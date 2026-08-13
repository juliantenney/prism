/**
 * Sprint 76 Gate A — P01 task-material closure, P02 epistemic evidence,
 * P03 ordinary commission sufficiency.
 *
 * Both validateDlaPartialPageCapture and validateDlaEnrichedPage must agree.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function teachingRow(id) {
  return {
    material_id: id,
    material_type: "text",
    purpose: "Teaching overview of the method.",
    specification: "Explain the construction steps with one worked numerical example."
  };
}

function checklistRow(id) {
  return {
    material_id: id,
    material_type: "checklist",
    purpose: "Self-check the constructed expression.",
    specification:
      "Terms match the statement; multipliers align with constraints; construction is complete."
  };
}

function practiceRow(id) {
  return {
    material_id: id,
    material_type: "template",
    purpose: "Unseen practice problem set.",
    specification: "Three unseen optimisation statements with blank Lagrangian construction lines."
  };
}

function providerRow(id) {
  return {
    material_id: id,
    material_type: "scenario",
    purpose: "Contrastive observation cases for diagnosis.",
    specification: "Two short cases with measurements and outcomes; do not state the conclusion.",
    evidence_requirement: {
      kind: "learner_evidence",
      purpose: "Provide inspectable observations needed for diagnosis.",
      learner_action: "Inspect the observations and justify the likely diagnosis.",
      observable_features: ["pattern in observed values", "contrast between two cases"]
    }
  };
}

function activityDefaults(overrides) {
  return Object.assign(
    {
      activity_id: "A1",
      title: "Construct the Lagrangian",
      grouping: "individual",
      duration_minutes: 15,
      learning_outcome_ids: ["LO1"],
      learner_task: "Complete the assigned production using the commissioned materials.",
      expected_output: "The required learner product with the stated quality threshold.",
      activity_preamble: "Use the commissioned materials for this activity.",
      intellectual_coherence_bridge:
        "You have the orientation; now produce the required output for this activity.",
      reasoning_orientation: "Name the method, then apply it to the commissioned inputs.",
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      required_materials: [teachingRow("A1-M1"), checklistRow("A1-M2")],
      evidence_decision: {
        required: false,
        reason:
          "Task can be completed from teaching/practice scaffolds without inspectable particulars as grounds.",
        provider_material_ids: []
      },
      materials: [],
      episode_plan: { archetype: "apply", beats: [{ function: "guided_practice" }] }
    },
    overrides || {}
  );
}

function buildFullPage(activity) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Contract matrix page",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Apply constrained optimisation." }],
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
    activities: [activity],
    source_artefacts: [],
    generation_notes: {}
  };
}

function buildPartialPage(activity) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [activity]
  };
}

function assertBoth(activity, expectOk, label, errorPattern) {
  const partial = dlaEnrich.validateDlaPartialPageCapture(buildPartialPage(clone(activity)));
  const full = dlaEnrich.validateDlaEnrichedPage(buildFullPage(clone(activity)), null);
  assert.equal(partial.ok, expectOk, label + " partial: " + (partial.errors || []).join("; "));
  assert.equal(full.ok, expectOk, label + " full: " + (full.errors || []).join("; "));
  if (errorPattern) {
    assert.ok(
      (partial.errors || []).some((e) => errorPattern.test(e)),
      label + " partial missing " + errorPattern + " in " + (partial.errors || []).join("; ")
    );
    assert.ok(
      (full.errors || []).some((e) => errorPattern.test(e)),
      label + " full missing " + errorPattern + " in " + (full.errors || []).join("; ")
    );
  }
  if (expectOk) {
    assert.equal(
      (partial.errors || []).some((e) => /contradicts evidence-dependent/i.test(e)),
      false,
      label + " partial must not emit prose fail-close"
    );
    assert.equal(
      (full.errors || []).some((e) => /contradicts evidence-dependent/i.test(e)),
      false,
      label + " full must not emit prose fail-close"
    );
  }
}

test("P01 pass: inline-complete task, no separate inputs", () => {
  assertBoth(activityDefaults(), true, "inline-complete");
});

test("P01 pass: ordinary practice with task-input material and evidence false", () => {
  assertBoth(
    activityDefaults({
      learner_task: "Construct the Lagrangian for each practice problem.",
      expected_output: "Correct Lagrangians for each practice problem.",
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-M3"]
      },
      required_materials: [
        teachingRow("A1-M1"),
        checklistRow("A1-M2"),
        practiceRow("A1-M3")
      ],
      evidence_decision: {
        required: false,
        reason: "Practice operands are procedural inputs, not particulars-as-grounds.",
        provider_material_ids: []
      }
    }),
    true,
    "ordinary practice"
  );
});

test("P01 pass: evidence task with provider also listed as task input", () => {
  assertBoth(
    activityDefaults({
      title: "Diagnose from observations",
      learner_task: "Inspect the cases and diagnose the likely mechanism.",
      expected_output: "A justified diagnosis grounded in the cases.",
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-ME1"]
      },
      required_materials: [teachingRow("A1-M1"), providerRow("A1-ME1")],
      evidence_decision: {
        required: true,
        reason: "Learner must inspect observable particulars before diagnosing.",
        provider_material_ids: ["A1-ME1"]
      },
      episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
    }),
    true,
    "evidence task"
  );
});

test("P01 fail: missing task_material_decision", () => {
  const activity = activityDefaults();
  delete activity.task_material_decision;
  assertBoth(activity, false, "missing decision", /task_material_decision required/);
});

test("P01 fail: true + no ids", () => {
  assertBoth(
    activityDefaults({
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: []
      }
    }),
    false,
    "true empty ids",
    /at least one id when separate_inputs_required=true/
  );
});

test("P01 fail: false + ids", () => {
  assertBoth(
    activityDefaults({
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: ["A1-M1"]
      }
    }),
    false,
    "false with ids",
    /must be empty when separate_inputs_required=false/
  );
});

test("P01 fail: duplicate id", () => {
  assertBoth(
    activityDefaults({
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-M1", "A1-M1"]
      }
    }),
    false,
    "duplicate id",
    /must not contain duplicate id/
  );
});

test("P01 fail: unknown id", () => {
  assertBoth(
    activityDefaults({
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-MISSING"]
      }
    }),
    false,
    "unknown id",
    /unknown task-input material_id/
  );
});

test("P01 fail: required_materials absent", () => {
  const activity = activityDefaults();
  delete activity.required_materials;
  assertBoth(activity, false, "materials absent", /required_materials must be an array/);
});

test("P02 pass: procedural task-input material with evidence false", () => {
  assertBoth(
    activityDefaults({
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-M3"]
      },
      required_materials: [teachingRow("A1-M1"), practiceRow("A1-M3")],
      evidence_decision: {
        required: false,
        reason: "Procedural practice operands are not epistemic evidence.",
        provider_material_ids: []
      }
    }),
    true,
    "procedural P02 false"
  );
});

test("P02 pass: valid evidence task with provider closure", () => {
  assertBoth(
    activityDefaults({
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-ME1", "A1-M3"]
      },
      required_materials: [practiceRow("A1-M3"), providerRow("A1-ME1")],
      evidence_decision: {
        required: true,
        reason: "Learner must inspect particulars as grounds.",
        provider_material_ids: ["A1-ME1"]
      }
    }),
    true,
    "valid evidence closure"
  );
});

test("P02 pass: evidential-looking learner_task wording with required:false", () => {
  assertBoth(
    activityDefaults({
      learner_task:
        "Analyse the supplied dataset and interpret the results, including any quotations.",
      expected_output: "A trend statement grounded in the dataset.",
      task_material_decision: {
        separate_inputs_required: false,
        task_input_material_ids: []
      },
      required_materials: [teachingRow("A1-M1")],
      evidence_decision: {
        required: false,
        reason: "Structured decision: no particulars-as-grounds dependence.",
        provider_material_ids: []
      }
    }),
    true,
    "wording with required false"
  );
});

test("P02 fail: required true with no provider", () => {
  assertBoth(
    activityDefaults({
      evidence_decision: {
        required: true,
        reason: "Needs particulars as grounds.",
        provider_material_ids: []
      }
    }),
    false,
    "true no provider",
    /at least one provider when required=true/
  );
});

test("P02 fail: provider absent from required_materials", () => {
  assertBoth(
    activityDefaults({
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-ME1"]
      },
      required_materials: [teachingRow("A1-M1")],
      evidence_decision: {
        required: true,
        reason: "Needs particulars as grounds.",
        provider_material_ids: ["A1-ME1"]
      }
    }),
    false,
    "provider missing from materials",
    /missing provider material_id|unknown task-input material_id/
  );
});

test("P02 fail: provider not listed as task input", () => {
  assertBoth(
    activityDefaults({
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-M3"]
      },
      required_materials: [practiceRow("A1-M3"), providerRow("A1-ME1")],
      evidence_decision: {
        required: true,
        reason: "Needs particulars as grounds.",
        provider_material_ids: ["A1-ME1"]
      }
    }),
    false,
    "provider not task input",
    /must be listed in activities\[0\]\.task_material_decision\.task_input_material_ids/
  );
});

test("P02 fail: provider missing evidence_requirement", () => {
  const provider = providerRow("A1-ME1");
  delete provider.evidence_requirement;
  assertBoth(
    activityDefaults({
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-ME1"]
      },
      required_materials: [provider],
      evidence_decision: {
        required: true,
        reason: "Needs particulars as grounds.",
        provider_material_ids: ["A1-ME1"]
      }
    }),
    false,
    "provider missing evidence_requirement",
    /must include evidence_requirement/
  );
});

test("P03 pass: non-empty purpose and meaningful specification", () => {
  assertBoth(activityDefaults(), true, "meaningful purpose/spec");
});

test("P03 pass: purpose equal to material-type token is not rejected", () => {
  assertBoth(
    activityDefaults({
      required_materials: [
        {
          material_id: "A1-M1",
          material_type: "template",
          purpose: "template",
          specification: "Three unseen practice items with blank answer lines."
        }
      ]
    }),
    true,
    "purpose equals type token"
  );
});

test("P03 fail: missing purpose", () => {
  const row = teachingRow("A1-M1");
  delete row.purpose;
  assertBoth(
    activityDefaults({ required_materials: [row, checklistRow("A1-M2")] }),
    false,
    "missing purpose",
    /\.purpose required/
  );
});

test("P03 fail: empty / whitespace-only purpose", () => {
  const row = teachingRow("A1-M1");
  row.purpose = "   ";
  assertBoth(
    activityDefaults({ required_materials: [row, checklistRow("A1-M2")] }),
    false,
    "empty purpose",
    /\.purpose required/
  );
});

test("P03 fail: missing specification", () => {
  const row = teachingRow("A1-M1");
  delete row.specification;
  assertBoth(
    activityDefaults({ required_materials: [row, checklistRow("A1-M2")] }),
    false,
    "missing specification",
    /\.specification required/
  );
});

test("P03 fail: empty / whitespace-only specification", () => {
  const row = teachingRow("A1-M1");
  row.specification = "  ";
  assertBoth(
    activityDefaults({ required_materials: [row, checklistRow("A1-M2")] }),
    false,
    "empty specification",
    /\.specification required/
  );
});

test("P03 fail: specification equal to material type", () => {
  const row = teachingRow("A1-M1");
  row.specification = "text";
  assertBoth(
    activityDefaults({ required_materials: [row, checklistRow("A1-M2")] }),
    false,
    "spec equals type",
    /specification must not be only the material_type token/
  );
});

test("P03 fail: specification equal after case/whitespace/punctuation normalisation", () => {
  const cases = ["Text", "  TEXT  ", "text.", "text!", "text:"];
  cases.forEach(function (specification) {
    const row = teachingRow("A1-M1");
    row.specification = specification;
    assertBoth(
      activityDefaults({ required_materials: [row, checklistRow("A1-M2")] }),
      false,
      "spec echo " + JSON.stringify(specification),
      /specification must not be only the material_type token/
    );
  });
});

test("P03 fail: provider row with evidence_requirement but empty specification", () => {
  const provider = providerRow("A1-ME1");
  provider.specification = "";
  assertBoth(
    activityDefaults({
      task_material_decision: {
        separate_inputs_required: true,
        task_input_material_ids: ["A1-ME1"]
      },
      required_materials: [provider],
      evidence_decision: {
        required: true,
        reason: "Needs particulars as grounds.",
        provider_material_ids: ["A1-ME1"]
      }
    }),
    false,
    "provider empty spec",
    /\.specification required/
  );
});
