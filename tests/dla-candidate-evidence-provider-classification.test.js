/**
 * Candidate explanations/claims as evidence providers (provider-role closure).
 * Reproduction fixture: C03 Compare explanations DLA commission.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));

const C03_FIXTURE = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "dla",
  "c03-compare-explanations-dla.json"
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function evidenceRequirement(overrides) {
  return Object.assign(
    {
      kind: "learner_evidence",
      purpose: "Provide inspectable particulars the learner must use as grounds.",
      learner_action: "Inspect the particulars and justify the conclusion.",
      observable_features: ["stated measurements", "contrast between options"],
      provenance: "system_generated_simulation",
      evidence_layout: "separate_provider"
    },
    overrides || {}
  );
}

function checklistRow(id) {
  return {
    material_id: id,
    material_type: "checklist",
    purpose: "Self-check the completed judgement.",
    specification: "Preference recorded; wording cited; justification complete."
  };
}

function activityDefaults(overrides) {
  return Object.assign(
    {
      activity_id: "A1",
      title: "Compare candidate explanations",
      grouping: "individual",
      duration_minutes: 20,
      learning_outcome_ids: ["LO1"],
      learner_task: "Complete the assigned production using the commissioned materials.",
      expected_output: "The required learner product with the stated quality threshold.",
      activity_preamble: "Use the commissioned materials for this activity.",
      intellectual_coherence_bridge:
        "You have the orientation; now produce the required output for this activity.",
      reasoning_orientation: "Name the method, then apply it to the commissioned inputs.",
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-M1"]
      },
      required_materials: [],
      evidence_decision: {
        required: true,
        reason: "Learners must inspect candidate wording as grounds for judgement.",
        provider_material_ids: ["A1-M1"]
      },
      materials: [],
      episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
    },
    overrides || {}
  );
}

function buildPartialPage(activity) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [activity]
  };
}

function buildFullPage(activity) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Candidate evidence provider page",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Judge explanation quality." }],
    episode_plans: [
      {
        activity_id: activity.activity_id,
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-" + activity.activity_id,
        episode_plan: activity.episode_plan
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    source_artefacts: [],
    generation_notes: {},
    activities: [activity]
  };
}

function providerRoleErrors(result) {
  return (result.errors || []).filter((e) =>
    /provider-role closure|teaching\/explanatory/i.test(String(e || ""))
  );
}

function assertProviderRolePass(activity, label) {
  const partial = dlaEnrich.validateDlaPartialPageCapture(buildPartialPage(clone(activity)));
  const full = dlaEnrich.validateDlaEnrichedPage(buildFullPage(clone(activity)), null);
  assert.deepEqual(
    providerRoleErrors(partial),
    [],
    label + " partial provider-role: " + providerRoleErrors(partial).join("; ")
  );
  assert.deepEqual(
    providerRoleErrors(full),
    [],
    label + " full provider-role: " + providerRoleErrors(full).join("; ")
  );
  assert.equal(partial.ok, true, label + " partial: " + (partial.errors || []).join("; "));
  assert.equal(full.ok, true, label + " full: " + (full.errors || []).join("; "));
}

function assertProviderRoleFail(activity, label) {
  const partial = dlaEnrich.validateDlaPartialPageCapture(buildPartialPage(clone(activity)));
  const full = dlaEnrich.validateDlaEnrichedPage(buildFullPage(clone(activity)), null);
  assert.ok(
    providerRoleErrors(partial).length > 0,
    label + " partial missing provider-role in " + (partial.errors || []).join("; ")
  );
  assert.ok(
    providerRoleErrors(full).length > 0,
    label + " full missing provider-role in " + (full.errors || []).join("; ")
  );
}

test("C03 fixture: provider-role closure accepts candidate task_card evidence providers unchanged", () => {
  const page = JSON.parse(fs.readFileSync(C03_FIXTURE, "utf8"));
  assert.equal(page.activities[0].required_materials[1].material_id, "A1-M2");
  assert.equal(page.activities[0].required_materials[1].material_type, "task_card");
  assert.equal(page.activities[1].required_materials[1].material_id, "A2-M2");
  assert.equal(page.activities[1].required_materials[1].material_type, "task_card");
  assert.equal(page.activities[2].required_materials[1].material_id, "A3-M2");
  assert.equal(page.activities[2].required_materials[1].material_type, "task_card");

  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.deepEqual(
    providerRoleErrors(check),
    [],
    "provider-role errors remain:\n" + providerRoleErrors(check).join("\n")
  );
  assert.equal(
    (check.errors || []).some((e) =>
      /required_materials\[\d+\].*teaching\/explanatory material cannot carry evidence_requirement/i.test(
        e
      )
    ),
    false
  );
});

test("candidate explanations on task_card are accepted evidence providers", () => {
  assertProviderRolePass(
    activityDefaults({
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "task_card",
          purpose: "Supply contrasting candidate explanations for independent comparative judgement.",
          specification:
            "Commission three pairs of short candidate explanations. Label all statements explicitly as candidate explanations for evaluation, not authoritative findings. Do not reveal preferred choices, quality-dimension labels, diagnostic criteria or explanatory feedback within the candidate material.",
          evidence_requirement: evidenceRequirement({
            purpose: "Provide inspectable differences in wording that learners must evaluate.",
            learner_action: "Compare the actual wording of both candidates in each pair.",
            observable_features: [
              "Differences in numerical representation",
              "Differences in strength of inference"
            ],
            disclosure_constraint:
              "All candidate explanations must be visibly distinguished from authoritative research findings."
          })
        },
        checklistRow("A1-M2")
      ]
    }),
    "candidate explanations"
  );
});

test("candidate claims on task_card are accepted evidence providers", () => {
  assertProviderRolePass(
    activityDefaults({
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "task_card",
          purpose: "Supply candidate claims containing distinct numerical and inferential issues.",
          specification:
            "Provide four short, explicitly labelled candidate claims about the survey. Do not include answer labels or explanations in the stimulus.",
          evidence_requirement: evidenceRequirement({
            purpose: "Provide actual candidate claims whose features learners must inspect.",
            learner_action: "Examine each claim's wording against the survey evidence.",
            observable_features: ["Numerical difference terminology", "Causal language"]
          })
        },
        checklistRow("A1-M2")
      ]
    }),
    "candidate claims"
  );
});

test("ordinary teaching text cannot satisfy evidence_requirement by declaration alone", () => {
  assertProviderRoleFail(
    activityDefaults({
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "text",
          purpose: "Introduce key concepts in form and perspective.",
          specification: "Explanatory teaching guide only.",
          evidence_requirement: evidenceRequirement()
        },
        checklistRow("A1-M2")
      ]
    }),
    "teaching-only text"
  );
});

test("existing scenario evidence provider arrangement remains accepted", () => {
  assertProviderRolePass(
    activityDefaults({
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "scenario",
          purpose: "Contrastive observation cases for diagnosis.",
          specification: "Two short cases with measurements and outcomes; do not state the conclusion.",
          evidence_requirement: evidenceRequirement({
            purpose: "Provide inspectable observations needed for diagnosis.",
            observable_features: ["pattern in observed values", "contrast between two cases"]
          })
        },
        {
          material_id: "A1-M2",
          material_type: "comparison_table",
          purpose: "Learner workspace for recording the diagnosis.",
          specification: "Blank comparison rows; learners complete judgements."
        },
        checklistRow("A1-M3")
      ]
    }),
    "scenario provider"
  );
});

test("DLA generation guidance states candidate explanations/claims as evidence providers", () => {
  const providers = dlaContract.assembleDlaCanonicalContract().sections.providers;
  assert.match(
    providers,
    /Candidate explanations, claims, statements, or wordings that learners must inspect/
  );
  assert.match(providers, /legitimate evidence providers even when authored as educational materials/);
  assert.match(providers, /not by attaching evidence_requirement to ordinary instructional text alone/);
  assert.match(providers, /material_type is presentation only: task_card may render either/);
  assert.match(providers, /Teaching or explanatory material is not a provider/);
  assert.match(providers, /prefer scenario, task_card, data_table, or reference_table/);
});
