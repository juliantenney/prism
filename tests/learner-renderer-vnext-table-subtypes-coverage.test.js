/**
 * vNext coverage for authoring-valid table subtypes:
 * reference_table, data_table, impact_table.
 *
 * Shared table rendering path; type identity preserved.
 * Previous IMP-014A "unsupported" expectation for impact_table reflected
 * incomplete registry coverage, not intentional rejection.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildPageModel,
  renderLearnerPageHtml,
  validateInput
} = require("../lib/learner-renderer-vnext");
const {
  buildMaterialModel,
  hasMaterialRenderer,
  MATERIAL_RENDERER_TYPES
} = require("../lib/learner-renderer-vnext/parse-material");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");
const {
  shouldComposeTableWorkspaceMaterial
} = require("../lib/learner-renderer-vnext/completion-table-workspace");
const {
  classifyMaterialPlacement
} = require("../lib/learner-renderer-vnext/compose-moment-classification");
const { composeDoMoment } = require("../lib/learner-renderer-vnext/compose-activity-moments");

const repoRoot = path.resolve(__dirname, "..");
const heteroPath = path.join(
  repoRoot,
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json"
);
const marxPath = path.join(repoRoot, "tests/fixtures/page-render/marx-beat-render-page.json");
const inflationPath = path.join(
  repoRoot,
  "tests/fixtures/page-render/ld-inflation-workshop-page.json"
);

const populatedBody =
  "| Criterion | Look for |\n| --- | --- |\n| Spread | Cloud width changes |\n| Pattern | Funnel shape |";
const completionBody =
  "| Case | Residual | Magnitude | Interpretation | Judgement |\n| --- | --- | --- | --- | --- |\n| Example | 12 | High | Widening | Likely |\n| A |  |  |  |  |\n| B |  |  |  |  |";
const impactCompletionBody =
  "| Scenario | Cost pressure | Revenue pressure | Short-run response |\n| --- | --- | --- | --- |\n| Young renter |  |  |  |\n| Shop owner |  |  |  |";

function material(type, body, id) {
  return buildMaterialModel(
    {
      material_id: id || type + "-1",
      material_type: type,
      title: type + " probe",
      body_format: "markdown",
      body: body
    },
    0
  );
}

function probeActivity(type, body) {
  const table = material(type, body, "T01-M2");
  return {
    id: "T01",
    title: "Table probe",
    durationMinutes: 10,
    grouping: "individual",
    preamble: "Work with the table.",
    reasoningOrientation: "",
    mappedOutcomeIds: [],
    beats: [
      {
        sourceFunction: "explanation",
        learnerRole: "explain",
        learnerLabel: "Explain",
        instructions: [{ sourceStepNumber: 1, text: "Study the criteria." }],
        prompts: [],
        materials: [material("text", "Intro.", "T01-M1")],
        expectedOutput: null
      },
      {
        sourceFunction: "guided_practice",
        learnerRole: "practise",
        learnerLabel: "Apply",
        instructions: [{ sourceStepNumber: 2, text: "Complete the table below." }],
        prompts: [],
        materials: [table],
        expectedOutput: { text: "Completed rows." }
      }
    ]
  };
}

test("registry: three table subtypes are registered without alias collapse", () => {
  ["reference_table", "data_table", "impact_table"].forEach(function (type) {
    assert.equal(hasMaterialRenderer(type), true);
    assert.ok(MATERIAL_RENDERER_TYPES.indexOf(type) !== -1);
    const model = material(type, populatedBody);
    assert.equal(model.type, type);
  });
});

test("static: populated subtypes render HTML tables with semantic type metadata", () => {
  ["reference_table", "data_table", "impact_table"].forEach(function (type) {
    const html = renderMaterial(material(type, populatedBody));
    assert.match(html, new RegExp('data-material-type="' + type + '"'));
    assert.match(html, /util-material-table-block/);
    assert.match(html, /<table>/);
    assert.doesNotMatch(html, /data-render-status="unsupported"/);
    assert.doesNotMatch(html, /util-learner-table-workspace/);
  });
});

test("completion: reference_table never becomes table_entry from blanks alone", () => {
  const ref = material("reference_table", completionBody);
  assert.equal(shouldComposeTableWorkspaceMaterial(ref), false);
  assert.equal(classifyMaterialPlacement(ref), "learn");
  const doMoment = composeDoMoment(probeActivity("reference_table", completionBody));
  const item = doMoment.items.find(function (entry) {
    return entry.material && entry.material.id === "T01-M2";
  });
  assert.ok(item);
  assert.notEqual(item.tableWorkspace, true);
});

test("completion: data_table and impact_table are conditional on blank cells", () => {
  assert.equal(shouldComposeTableWorkspaceMaterial(material("data_table", populatedBody)), false);
  assert.equal(shouldComposeTableWorkspaceMaterial(material("data_table", completionBody)), true);
  assert.equal(shouldComposeTableWorkspaceMaterial(material("impact_table", populatedBody)), false);
  assert.equal(
    shouldComposeTableWorkspaceMaterial(material("impact_table", impactCompletionBody)),
    true
  );
  assert.equal(classifyMaterialPlacement(material("data_table", populatedBody)), "learn");
  assert.equal(classifyMaterialPlacement(material("data_table", completionBody)), "task");
  assert.equal(classifyMaterialPlacement(material("impact_table", impactCompletionBody)), "task");
});

test("hetero-shaped: A2 reference static; A3 data workspace; A4 impact workspace", () => {
  const a2Ref = material("reference_table", populatedBody, "A2-REF");
  const a3Data = material("data_table", completionBody, "A3-DATA");
  const a4Impact = material("impact_table", impactCompletionBody, "A4-IMPACT");

  assert.equal(shouldComposeTableWorkspaceMaterial(a2Ref), false);
  assert.equal(shouldComposeTableWorkspaceMaterial(a3Data), true);
  assert.equal(shouldComposeTableWorkspaceMaterial(a4Impact), true);

  assert.match(renderMaterial(a2Ref), /data-material-type="reference_table"/);
  assert.match(renderMaterial(a3Data), /data-material-type="data_table"/);
  assert.match(renderMaterial(a4Impact), /data-material-type="impact_table"/);

  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Hetero-shaped table subtypes",
    page_profile: "learner",
    activities: [
      {
        activity_id: "A2",
        title: "Interpret residual plots",
        learner_task:
          "1. Study the reference criteria.\n2. Complete the analysis.\n3. Verify with the checklist.",
        episode_plan: {
          archetype: "analyse",
          beats: [
            { function: "orientation" },
            { function: "explanation" },
            { function: "guided_practice" },
            { function: "verification" }
          ]
        },
        materials: [
          {
            material_id: "A2-REF",
            material_type: "reference_table",
            title: "Residual pattern criteria",
            body_format: "markdown",
            body: populatedBody
          },
          {
            material_id: "A2-TASK",
            material_type: "analysis_table",
            title: "Analysis",
            body_format: "markdown",
            body: completionBody
          },
          {
            material_id: "A2-CHECK",
            material_type: "checklist",
            title: "Check",
            body_format: "markdown",
            body: "- Pattern named\n- Judgement justified"
          }
        ]
      },
      {
        activity_id: "A3",
        title: "Residual calculation",
        learner_task:
          "1. Review the worked case.\n2. Complete the residual calculation table.\n3. Verify with the checklist.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "orientation" },
            { function: "worked_thinking" },
            { function: "guided_practice" },
            { function: "verification" }
          ]
        },
        materials: [
          {
            material_id: "A3-WE",
            material_type: "worked_example",
            title: "Worked residual",
            body_format: "markdown",
            body: "Observation then judgement."
          },
          {
            material_id: "A3-DATA",
            material_type: "data_table",
            title: "Residual calculation",
            body_format: "markdown",
            body: completionBody
          },
          {
            material_id: "A3-CHECK",
            material_type: "checklist",
            title: "Check",
            body_format: "markdown",
            body: "- Residuals calculated\n- Magnitudes interpreted"
          }
        ]
      },
      {
        activity_id: "A4",
        title: "Impact mapping",
        learner_task:
          "1. Study the chain.\n2. Complete the impact table.\n3. Verify with the checklist.",
        episode_plan: {
          archetype: "analyse",
          beats: [
            { function: "orientation" },
            { function: "explanation" },
            { function: "guided_practice" },
            { function: "verification" }
          ]
        },
        materials: [
          {
            material_id: "A4-TEXT",
            material_type: "text",
            title: "Inference chain",
            body_format: "markdown",
            body: "Changing variance affects standard errors."
          },
          {
            material_id: "A4-IMPACT",
            material_type: "impact_table",
            title: "Impact map",
            body_format: "markdown",
            body: impactCompletionBody
          },
          {
            material_id: "A4-CHECK",
            material_type: "checklist",
            title: "Check",
            body_format: "markdown",
            body: "- Impacts mapped\n- Responses justified"
          }
        ]
      }
    ]
  };

  const input = validateInput(page);
  assert.equal(
    input.errors.filter(function (error) {
      return String(error.message || "").includes("No vNext material renderer is registered");
    }).length,
    0
  );

  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors));
  const rendered = renderLearnerPageHtml(page, { compositionMode: "moments" });
  assert.doesNotMatch(String(rendered.error || ""), /No vNext material renderer is registered/);
  assert.match(rendered.html, /data-material-type="reference_table"/);
  assert.match(rendered.html, /data-material-type="data_table"/);
  assert.match(rendered.html, /data-material-type="impact_table"/);
  assert.match(rendered.html, /data-material-id="A3-DATA"/);
  assert.match(rendered.html, /data-material-id="A4-IMPACT"/);
  assert.match(rendered.html, /util-learner-table-workspace/);
  assert.ok(
    (rendered.html.match(/data-workspace-kind="table_entry"/g) || []).length >= 2,
    "expected A3 data_table and A4 impact_table workspaces"
  );
});

test("fixtures: golden heteroscedasticity page still validates without UNKNOWN_MATERIAL_TYPE", () => {
  const page = JSON.parse(fs.readFileSync(heteroPath, "utf8"));
  const input = validateInput(page);
  assert.equal(
    input.errors.filter(function (error) {
      return String(error.message || "").includes("No vNext material renderer is registered");
    }).length,
    0
  );
  const model = buildPageModel(page);
  assert.equal(model.ok, true);
});

test("fixtures: inflation impact_table content shape is ordinary pipe markdown", () => {
  if (!fs.existsSync(inflationPath)) return;
  const page = JSON.parse(fs.readFileSync(inflationPath, "utf8"));
  const blob = JSON.stringify(page);
  assert.match(blob, /impact_table/);
  const impactMaterial = material(
    "impact_table",
    "| Measure | What it tracks | Limitation |\n| --- | --- | --- |\n| CPI | Consumer basket prices | Basket may not match |"
  );
  assert.match(renderMaterial(impactMaterial), /data-material-type="impact_table"/);
});

test("fixtures: Marx reference_table content shape is ordinary pipe markdown", () => {
  if (!fs.existsSync(marxPath)) return;
  const page = JSON.parse(fs.readFileSync(marxPath, "utf8"));
  const blob = JSON.stringify(page);
  assert.match(blob, /reference_table/);
  const ref = material(
    "reference_table",
    "| Criterion | What to look for |\n| --- | --- |\n| Inequality trends | Changes in income |"
  );
  assert.equal(shouldComposeTableWorkspaceMaterial(ref), false);
  assert.match(renderMaterial(ref), /data-material-type="reference_table"/);
});

test("regression: existing table completion policies unchanged", () => {
  assert.equal(
    shouldComposeTableWorkspaceMaterial(material("analysis_table", populatedBody)),
    true
  );
  assert.equal(
    shouldComposeTableWorkspaceMaterial(material("comparison_table", populatedBody)),
    true
  );
  assert.equal(
    shouldComposeTableWorkspaceMaterial(material("decision_table", populatedBody)),
    true
  );
  assert.equal(
    shouldComposeTableWorkspaceMaterial(material("classification_table", populatedBody)),
    false
  );
  assert.equal(
    shouldComposeTableWorkspaceMaterial(material("classification_table", completionBody)),
    true
  );
  assert.equal(
    shouldComposeTableWorkspaceMaterial(material("planning_table", populatedBody)),
    false
  );
  assert.equal(
    shouldComposeTableWorkspaceMaterial(material("planning_table", completionBody)),
    true
  );
});

test("optional: beat-registry table types have vNext coverage or explicit note", () => {
  const beatRegistry = require("../lib/beat-material-registry.js");
  const rows = beatRegistry.MATERIAL_BEAT_REGISTRY || [];
  const tableRows = rows.filter(function (row) {
    return /_table$|^table$/.test(String(row.materialType || ""));
  });
  const missing = [];
  tableRows.forEach(function (row) {
    const type = String(row.materialType || "");
    if (type === "table" || type === "worksheet") return; // legacy aliases / generic
    if (!hasMaterialRenderer(type)) missing.push(type);
  });
  assert.deepEqual(missing, []);
});
