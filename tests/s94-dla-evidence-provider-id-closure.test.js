/**
 * Capture-time P02 closure: required=true with omitted provider_material_ids.
 * Copies existing evidence_requirement row IDs; does not invent providers or
 * flip required to false.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const dlaEnrich = require("../lib/page-dla-enrich.js");
const dlaContract = require("../lib/ld-dla-page-enrich-contract.js");

const PROVIDER_MISSING =
  /activities\[1\]\.evidence_decision\.provider_material_ids must list at least one provider when required=true/;
const PROVIDER_MISSING_A3 =
  /activities\[2\]\.evidence_decision\.provider_material_ids must list at least one provider when required=true/;

function evidenceRequirement() {
  return {
    kind: "learner_evidence",
    purpose: "Provide inspectable observations needed for an evidence-informed judgement.",
    learner_action: "Inspect the observations and justify the conclusion with cited particulars.",
    observable_features: ["stated measurements", "contrast between options"]
  };
}

function providerRow(id) {
  return {
    material_id: id,
    material_type: "scenario",
    purpose: "Inspectable cases the learner must use as grounds for judgement.",
    specification: "Two short cases with measurements; do not state the conclusion.",
    evidence_requirement: evidenceRequirement()
  };
}

function teachingRow(id) {
  return {
    material_id: id,
    material_type: "text",
    purpose: "Teaching overview of the decision method.",
    specification: "Explain how to weigh options without resolving the focal case."
  };
}

function activityShape(overrides) {
  return Object.assign(
    {
      activity_id: "A1",
      title: "Orient to the decision",
      grouping: "individual",
      duration_minutes: 10,
      learner_task: "Complete the commissioned production.",
      expected_output: "The required learner product.",
      activity_preamble: "Use the commissioned materials for this activity.",
      intellectual_coherence_bridge:
        "You have the orientation; now produce the required output for this activity.",
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      required_materials: [teachingRow("A1-M1")],
      evidence_decision: {
        required: false,
        reason: "Orientation does not require inspecting particulars as grounds.",
        provider_material_ids: []
      },
      materials: [],
      episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
    },
    overrides || {}
  );
}

function omittedProviderActivity(id, title) {
  return activityShape({
    activity_id: id,
    title: title,
    learner_task:
      "Inspect the supplied cases and make an evidence-informed judgement among the established options.",
    expected_output: "A justified judgement citing particulars from the cases.",
    activity_preamble: "Bring forward your own earlier judgement and weigh it against new evidence.",
    intellectual_coherence_bridge:
      "Earlier you recorded an initial judgement; now inspect new evidence about the same decision.",
    task_material_decision: {
      separate_inputs_required: true,
      task_input_material_ids: [id + "-ME1"]
    },
    required_materials: [teachingRow(id + "-M1"), providerRow(id + "-ME1")],
    evidence_decision: {
      required: true,
      reason: "Learner must inspect supplied cases before judging.",
      provider_material_ids: []
    },
    episode_plan: { archetype: "evaluate", beats: [{ function: "guided_practice" }] }
  });
}

function failingCapture() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      activityShape(),
      omittedProviderActivity("A2", "Weigh new evidence"),
      omittedProviderActivity("A3", "Reach a revised judgement")
    ]
  };
}

test("unrepaired DLA with required=true and empty provider lists fails the reported capture errors", () => {
  const page = failingCapture();
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some(function (err) {
      return PROVIDER_MISSING.test(err);
    }),
    check.errors.join("; ")
  );
  assert.ok(
    check.errors.some(function (err) {
      return PROVIDER_MISSING_A3.test(err);
    }),
    check.errors.join("; ")
  );
});

test("repair copies existing evidence_requirement row IDs and the capture then validates", () => {
  const page = failingCapture();
  const repaired = dlaEnrich.repairDlaEvidenceDecisionProviderClosure(page);
  assert.equal(repaired.repairApplied, true);
  assert.deepEqual(repaired.page.activities[0].evidence_decision.provider_material_ids, []);
  assert.equal(repaired.page.activities[0].evidence_decision.required, false);
  assert.deepEqual(repaired.page.activities[1].evidence_decision.provider_material_ids, ["A2-ME1"]);
  assert.deepEqual(repaired.page.activities[2].evidence_decision.provider_material_ids, ["A3-ME1"]);
  assert.equal(repaired.page.activities[1].evidence_decision.required, true);
  assert.equal(repaired.page.activities[2].evidence_decision.required, true);
  assert.ok(
    repaired.page.activities[1].task_material_decision.task_input_material_ids.indexOf("A2-ME1") !== -1
  );
  const check = dlaEnrich.validateDlaPartialPageCapture(repaired.page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("shell-placeholder repair path also closes omitted provider IDs", () => {
  const page = failingCapture();
  const repaired = dlaEnrich.repairDlaPartialShellPlaceholderFields(page, {});
  assert.equal(repaired.repairApplied, true);
  assert.deepEqual(repaired.page.activities[1].evidence_decision.provider_material_ids, ["A2-ME1"]);
  assert.deepEqual(repaired.page.activities[2].evidence_decision.provider_material_ids, ["A3-ME1"]);
  const check = dlaEnrich.validateDlaPartialPageCapture(repaired.page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("required=true with no evidence_requirement rows is not flipped false and still fails", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      activityShape({
        activity_id: "A2",
        title: "Weigh new evidence",
        evidence_decision: {
          required: true,
          reason: "Learner must inspect supplied cases before judging.",
          provider_material_ids: []
        },
        required_materials: [teachingRow("A2-M1")]
      })
    ]
  };
  const repaired = dlaEnrich.repairDlaEvidenceDecisionProviderClosure(page);
  assert.equal(repaired.repairApplied, false);
  assert.equal(repaired.page.activities[0].evidence_decision.required, true);
  assert.deepEqual(repaired.page.activities[0].evidence_decision.provider_material_ids, []);
  const check = dlaEnrich.validateDlaPartialPageCapture(repaired.page);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some(function (err) {
      return /provider_material_ids must list at least one provider when required=true/.test(err);
    }),
    check.errors.join("; ")
  );
});

test("pre-emit P02 gate now requires a provider when required=true", () => {
  const output = dlaContract.assembleDlaCanonicalContract().sections.output;
  assert.match(
    dlaContract.DLA_P02_FINAL_SILENT_PRE_EMIT_GATE,
    /when evidence_decision\.required is true, provider_material_ids must list at least one provider/
  );
  assert.match(
    output,
    /when evidence_decision\.required is true, provider_material_ids must list at least one provider/
  );
});

function interactiveDlaWorkflow() {
  return {
    id: "wf-interactive-dla-p02",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: {
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    steps: [
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "page",
        canonical_step_id: "step_design_learning_activities"
      }
    ]
  };
}

function continuityReuseCapture() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      activityShape({
        activity_id: "A1",
        title: "Compare the policy options",
        learner_task: "Compare the supplied options using the inspectable particulars.",
        expected_output: "A comparison grounded in the supplied evidence.",
        task_material_decision: {
          separate_inputs_required: true,
          task_input_material_ids: ["A1-M1"]
        },
        required_materials: [providerRow("A1-M1"), teachingRow("A1-M2")],
        evidence_decision: {
          required: true,
          reason: "Learners compare options from inspectable particulars.",
          provider_material_ids: ["A1-M1"]
        },
        episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
      }),
      activityShape({
        activity_id: "A2",
        title: "Defend the provisional decision",
        learner_task: "Substantiate the provisional judgement using the original evidence.",
        expected_output: "An independently justified provisional decision.",
        task_material_decision: {
          separate_inputs_required: false,
          task_input_material_ids: []
        },
        required_materials: [teachingRow("A2-M1")],
        evidence_decision: {
          required: true,
          reason:
            "Particulars remain available through the existing A1 evidence provider; no new evidence operand is required in this activity.",
          provider_material_ids: []
        }
      }),
      activityShape({
        activity_id: "A3",
        title: "Qualify the decision",
        learner_task: "Evaluate the evidential limits of the existing recommendation.",
        expected_output: "A qualified decision with stated confidence.",
        task_material_decision: {
          separate_inputs_required: false,
          task_input_material_ids: []
        },
        required_materials: [teachingRow("A3-M1")],
        evidence_decision: {
          required: true,
          reason:
            "Original scenario evidence remains the grounds; no additional evidence provider is commissioned.",
          provider_material_ids: []
        }
      })
    ]
  };
}

function loadPastePathApi() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/ld-dla-page-enrich-contract.js",
      "lib/ld-activity-title-contract.js",
      "lib/page-dla-enrich.js"
    ]
  });
  loaded.window.PRISM_PAGE_DLA_ENRICH = dlaEnrich;
  return loaded.api;
}

test("paste path still fails the live continuity-reuse DLA and does not invent providers", () => {
  const page = continuityReuseCapture();
  const repaired = dlaEnrich.repairDlaPartialShellPlaceholderFields(page, {});
  assert.equal(repaired.page.activities[1].evidence_decision.required, true);
  assert.equal(repaired.page.activities[2].evidence_decision.required, true);
  assert.deepEqual(repaired.page.activities[1].evidence_decision.provider_material_ids, []);
  assert.deepEqual(repaired.page.activities[2].evidence_decision.provider_material_ids, []);
  assert.equal(
    (repaired.page.activities[1].required_materials || []).some(function (row) {
      return row && row.evidence_requirement;
    }),
    false
  );
  assert.equal(
    (repaired.page.activities[2].required_materials || []).some(function (row) {
      return row && row.evidence_requirement;
    }),
    false
  );

  const api = loadPastePathApi();
  const wf = interactiveDlaWorkflow();
  const step = wf.steps[0];
  const check = api.validateDlaOrPageCapture(page, null, wf, step);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some(function (err) {
      return PROVIDER_MISSING.test(err);
    }),
    check.errors.join("; ")
  );
  assert.ok(
    check.errors.some(function (err) {
      return PROVIDER_MISSING_A3.test(err);
    }),
    check.errors.join("; ")
  );
  assert.equal(page.activities[1].evidence_decision.required, true);
  assert.equal(page.activities[2].evidence_decision.required, true);
  assert.deepEqual(page.activities[1].evidence_decision.provider_material_ids, []);
  assert.deepEqual(page.activities[2].evidence_decision.provider_material_ids, []);
});

test("paste path does apply provider-ID closure when evidence-bearing rows exist on the activity", () => {
  const api = loadPastePathApi();
  const wf = interactiveDlaWorkflow();
  const step = wf.steps[0];
  const check = api.validateDlaOrPageCapture(failingCapture(), null, wf, step);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

function learnerOwnedPriorEvidenceCapture() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      activityShape({
        activity_id: "A1",
        title: "Examine Your Use of Evidence",
        learner_task: "Evaluate how your retained prior response used evidence versus assumptions.",
        expected_output: "Two evaluations grounded in identifiable features of the retained response.",
        task_material_decision: {
          separate_inputs_required: false,
          task_input_material_ids: []
        },
        required_materials: [
          teachingRow("A1-M1"),
          {
            material_id: "A1-M2",
            material_type: "template",
            purpose: "Provide a two-field learner response surface for the evaluations.",
            specification: "Two labelled fields for evidence-use and assumption-use evaluations."
          },
          {
            material_id: "A1-M3",
            material_type: "checklist",
            purpose: "Support diagnostic review of the evaluations.",
            specification: "Three diagnostic quality dimensions for the evaluations."
          }
        ],
        evidence_decision: {
          required: true,
          reason:
            "The learner must inspect identifiable features of their own completed prior response as grounds. This learner-owned artefact is an external educational dependency rather than a new material commissioned from GAM.",
          provider_material_ids: []
        },
        episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
      }),
      activityShape({
        activity_id: "A2",
        title: "Test Your Recommendation's Defensibility",
        learner_task: "Evaluate the defensibility of the original recommendation.",
        expected_output: "A defensibility evaluation citing retained particulars.",
        task_material_decision: {
          separate_inputs_required: false,
          task_input_material_ids: []
        },
        required_materials: [
          teachingRow("A2-M1"),
          {
            material_id: "A2-M2",
            material_type: "template",
            purpose: "Provide a response surface for the defensibility evaluation.",
            specification: "Two labelled fields for strength and vulnerability."
          },
          {
            material_id: "A2-M3",
            material_type: "checklist",
            purpose: "Support diagnostic review of recommendation quality.",
            specification: "Three diagnostic quality dimensions."
          }
        ],
        evidence_decision: {
          required: true,
          reason:
            "Evaluating defensibility requires inspection of the learner's retained comparison and justification. The retained response supplies these particulars externally and must not be replaced by generated evidence.",
          provider_material_ids: []
        },
        episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
      }),
      activityShape({
        activity_id: "A3",
        title: "Identify Strength and Improvement",
        learner_task: "Select one reasoning strength and one improvement from the retained work.",
        expected_output: "A compact transfer-oriented conclusion.",
        task_material_decision: {
          separate_inputs_required: false,
          task_input_material_ids: []
        },
        required_materials: [
          {
            material_id: "A3-M1",
            material_type: "transfer_prompt",
            purpose: "Commission a compact transfer-oriented conclusion.",
            specification: "Ask for one strength and one improvement without teaching the answer."
          },
          {
            material_id: "A3-M2",
            material_type: "template",
            purpose: "Provide a structured response surface for the conclusion.",
            specification: "Three labelled fields for strength, improvement, and transfer."
          },
          {
            material_id: "A3-M3",
            material_type: "checklist",
            purpose: "Support final diagnostic review.",
            specification: "Three diagnostic quality dimensions."
          }
        ],
        evidence_decision: {
          required: true,
          reason:
            "The learner must use identifiable features of their retained response as grounds. These learner-produced particulars are not new GAM evidence materials.",
          provider_material_ids: []
        },
        episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
      })
    ]
  };
}

test("live learner-owned prior-evidence DLA fails on all three activities and capture repair cannot invent providers", () => {
  const page = learnerOwnedPriorEvidenceCapture();
  const unrepaired = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(unrepaired.ok, false);
  ["activities[0]", "activities[1]", "activities[2]"].forEach(function (prefix) {
    assert.ok(
      unrepaired.errors.some(function (err) {
        return new RegExp(
          prefix.replace(/[[\]]/g, "\\$&") +
            "\\.evidence_decision\\.provider_material_ids must list at least one provider when required=true"
        ).test(err);
      }),
      unrepaired.errors.join("; ")
    );
  });

  const repaired = dlaEnrich.repairDlaEvidenceDecisionProviderClosure(page);
  assert.equal(repaired.repairApplied, false);
  repaired.page.activities.forEach(function (activity) {
    assert.equal(activity.evidence_decision.required, true);
    assert.deepEqual(activity.evidence_decision.provider_material_ids, []);
    assert.equal(
      (activity.required_materials || []).some(function (row) {
        return row && row.evidence_requirement;
      }),
      false
    );
  });

  const api = loadPastePathApi();
  const check = api.validateDlaOrPageCapture(page, null, interactiveDlaWorkflow(), interactiveDlaWorkflow().steps[0]);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some(function (err) {
      return /activities\[0\]\.evidence_decision\.provider_material_ids must list at least one provider when required=true/.test(
        err
      );
    }),
    check.errors.join("; ")
  );
});

test("evidence contract forbids empty providers when required because of learner-owned prior work", () => {
  const evidence = dlaContract.assembleDlaCanonicalContract().sections.evidence;
  assert.match(
    evidence,
    /Learner-owned prior work or retained earlier-commission responses do not exempt P02/
  );
  assert.match(
    evidence,
    /Do not leave providers empty by calling the evidence an external dependency/
  );
});
