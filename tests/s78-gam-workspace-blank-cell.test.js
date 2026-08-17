/**
 * S78-T-007 — GAM learner-workspace blank-cell capture enforcement.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const gamEnrich = require(path.join(repoRoot, "lib", "page-gam-enrich.js"));
const gamWorkspace = require(path.join(repoRoot, "lib", "gam-workspace-fulfilment.js"));

const TABLE_WITH_BLANKS =
  "| Dimension | Entity A | Entity B |\n| --- | --- | --- |\n| Cost | | |\n| Risk | | |";

const TABLE_PARTIAL_EXEMPLAR =
  "| Dimension | Entity A | Entity B |\n| --- | --- | --- |\n| Cost | Low (example) | |\n| Risk | | |";

const TABLE_ALL_FILLED =
  "| Dimension | Entity A | Entity B |\n| --- | --- | --- |\n| Cost | High | Low |\n| Risk | Medium | Low |";

const TEXT_MARKDOWN_TABLE =
  "## Reference\n\n| Dimension | Entity A | Entity B |\n| --- | --- | --- |\n| Cost | High | Low |";

function workspaceRequiredRow(id, overrides) {
  return Object.assign(
    {
      material_id: id,
      material_type: "comparison_table",
      purpose: "Learner comparison workspace.",
      specification: "Three dimensions; learner-completion cells blank except one optional exemplar row.",
      response_fulfilment: {
        kind: "learner_workspace",
        response_kind: "table_compare",
        allows_partial_exemplar: true
      }
    },
    overrides || {}
  );
}

function buildDlaBaseline(overrides) {
  return Object.assign(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Workspace test page",
      audience: "Learners",
      page_profile: { profile_type: "learner" },
      learning_outcomes: [{ outcome_id: "LO1", statement: "Compare entities." }],
      episode_plans: [
        {
          activity_id: "A1",
          mapped_learning_outcome_ids: ["LO1"],
          episode_plan_id: "EP-A1",
          episode_plan: { archetype: "apply", beats: [{ function: "guided_practice" }] }
        }
      ],
      source_artefacts: [],
      page_synthesis: {},
      generation_notes: {},
      assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
      activities: [
        {
          activity_id: "A1",
          title: "Compare entities",
          grouping: "individual",
          duration_minutes: 15,
          learning_outcome_ids: ["LO1"],
          learner_task: "Enter your responses into a comparison table.",
          expected_output: "Completed comparison table.",
          activity_preamble: "Complete the workspace.",
          intellectual_coherence_bridge: "Compare the entities in tabular form.",
          reasoning_orientation: "Compare dimensions systematically.",
          task_material_decision: {
            separate_inputs_required: false,
            task_input_material_ids: []
          },
          required_materials: [workspaceRequiredRow("A1-W1")],
          evidence_decision: {
            required: false,
            reason: "No inspectable particulars required.",
            provider_material_ids: []
          },
          materials: [],
          episode_plan: {
            archetype: "apply",
            beats: [{ function: "guided_practice" }]
          }
        }
      ]
    },
    overrides || {}
  );
}

function buildGamPartialCapture(materialBody, baseline, materialOverrides) {
  var baselineAct = baseline.activities[0];
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "gam", enriched_by: ["gam"] },
    activities: [
      {
        activity_id: "A1",
        materials: [
          Object.assign(
            {
              material_id: "A1-W1",
              material_type: "comparison_table",
              activity_id: "A1",
              title: "Comparison workspace",
              body_format: "markdown",
              body: materialBody
            },
            materialOverrides || {}
          )
        ]
      }
    ]
  };
}

function buildGamEnrichedPage(materialBody, baseline, extraMaterials) {
  var page = JSON.parse(JSON.stringify(baseline));
  var act = page.activities[0];
  act.materials = [
    {
      material_id: "A1-W1",
      material_type: "comparison_table",
      activity_id: "A1",
      title: "Comparison workspace",
      body_format: "markdown",
      body: materialBody
    }
  ].concat(extraMaterials || []);
  page.assembly_state = { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] };
  return page;
}

test("A valid learner workspace with blank cells passes partial capture", () => {
  const baseline = buildDlaBaseline();
  const page = buildGamPartialCapture(TABLE_WITH_BLANKS, baseline);
  const check = gamEnrich.validateGamPartialPageCapture(page, { baseline });
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("B all-filled learner workspace fails partial capture", () => {
  const baseline = buildDlaBaseline();
  const page = buildGamPartialCapture(TABLE_ALL_FILLED, baseline);
  const check = gamEnrich.validateGamPartialPageCapture(page, { baseline });
  assert.equal(check.ok, false);
  assert.ok(
    (check.errors || []).some((e) => /S78_WS_GAM_NO_BLANK_CELLS/.test(e)),
    check.errors.join("; ")
  );
  assert.ok((check.errors || []).some((e) => /A1-W1/.test(e)));
  assert.ok((check.errors || []).some((e) => /response_kind=table_compare/.test(e)));
});

test("C partial exemplar workspace passes", () => {
  const baseline = buildDlaBaseline();
  const page = buildGamPartialCapture(TABLE_PARTIAL_EXEMPLAR, baseline);
  const check = gamEnrich.validateGamPartialPageCapture(page, { baseline });
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("D display reference table without learner_workspace passes", () => {
  const baseline = buildDlaBaseline({
    activities: [
      {
        activity_id: "A1",
        title: "Study reference",
        learner_task: "Study the reference table.",
        expected_output: "Demonstrated understanding.",
        activity_preamble: "Review the table.",
        intellectual_coherence_bridge: "Study the reference dimensions.",
        task_material_decision: {
          separate_inputs_required: false,
          task_input_material_ids: []
        },
        required_materials: [
          {
            material_id: "A1-R1",
            material_type: "reference_table",
            purpose: "Display dimension schema.",
            specification: "Fixed reference table for study only."
          }
        ],
        evidence_decision: {
          required: false,
          reason: "Study only.",
          provider_material_ids: []
        },
        materials: []
      }
    ]
  });
  const page = buildGamPartialCapture(TABLE_ALL_FILLED, baseline, {
    material_id: "A1-R1",
    material_type: "reference_table",
    title: "Reference table"
  });
  const check = gamEnrich.validateGamPartialPageCapture(page, { baseline });
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("E static instructional text table passes", () => {
  const baseline = buildDlaBaseline({
    activities: [
      {
        activity_id: "A1",
        title: "Read exposition",
        learner_task: "Study the exposition.",
        expected_output: "Understanding demonstrated.",
        activity_preamble: "Read carefully.",
        intellectual_coherence_bridge: "Orient to the exposition.",
        task_material_decision: {
          separate_inputs_required: false,
          task_input_material_ids: []
        },
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            purpose: "Teaching exposition with embedded table.",
            specification: "Short exposition including a display table."
          }
        ],
        evidence_decision: {
          required: false,
          reason: "Teaching only.",
          provider_material_ids: []
        },
        materials: []
      }
    ]
  });
  const page = buildGamPartialCapture(TEXT_MARKDOWN_TABLE, baseline, {
    material_id: "A1-M1",
    material_type: "text",
    title: "Exposition"
  });
  const check = gamEnrich.validateGamPartialPageCapture(page, { baseline });
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("G authoritative projection from baseline controls guard when partial page lacks required_materials", () => {
  const baseline = buildDlaBaseline();
  const page = buildGamPartialCapture(TABLE_ALL_FILLED, baseline);
  assert.equal(page.activities[0].required_materials, undefined);
  const resolved = gamWorkspace.resolveRequiredMaterialRowForGam(
    page.activities[0],
    "A1-W1",
    baseline
  );
  assert.ok(resolved && resolved.response_fulfilment);
  assert.equal(resolved.response_fulfilment.kind, "learner_workspace");
  const check = gamEnrich.validateGamPartialPageCapture(page, { baseline });
  assert.equal(check.ok, false);
  assert.ok((check.errors || []).some((e) => /S78_WS_GAM_NO_BLANK_CELLS/.test(e)));
});

test("validateGamEnrichedPage enforces blank-cell guard", () => {
  const baseline = buildDlaBaseline();
  const page = buildGamEnrichedPage(TABLE_ALL_FILLED, baseline);
  const check = gamEnrich.validateGamEnrichedPage(page, baseline);
  assert.equal(check.ok, false);
  assert.ok((check.errors || []).some((e) => /S78_WS_GAM_NO_BLANK_CELLS/.test(e)));
});

test("validateGamEnrichedPage passes valid workspace", () => {
  const baseline = buildDlaBaseline();
  const page = buildGamEnrichedPage(TABLE_WITH_BLANKS, baseline);
  const check = gamEnrich.validateGamEnrichedPage(page, baseline);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});

test("partial capture without baseline does not infer workspace from material_type alone", () => {
  const page = buildGamPartialCapture(TABLE_ALL_FILLED, buildDlaBaseline());
  const check = gamEnrich.validateGamPartialPageCapture(page);
  assert.equal(check.ok, true, (check.errors || []).join("; "));
});
