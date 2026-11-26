"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const REPO_ROOT = path.resolve(__dirname, "..");
const dlaEnrich = require(path.join(REPO_ROOT, "lib", "page-dla-enrich.js"));
const dlaContract = require(path.join(REPO_ROOT, "lib", "ld-dla-page-enrich-contract.js"));

function makeEvidenceRequirement(overrides) {
  return Object.assign(
    {
      kind: "learner_evidence",
      purpose: "Provide inspectable questionnaire wording as grounds for redesign.",
      learner_action: "Inspect each item's exact wording and diagnose design flaws.",
      observable_features: ["leading phrasing", "double-barrelled items", "unbalanced scale anchors"],
      provenance: "system_generated_simulation",
      evidence_layout: "separate_provider"
    },
    overrides || {}
  );
}

function makePracticeActivity(requiredMaterials, providerIds, taskInputIds) {
  return {
    activity_id: "A2",
    title: "Redesign the questionnaire extract",
    grouping: "individual",
    duration_minutes: 15,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Inspect the draft questionnaire extract, identify its wording and scale flaws, and produce a coherent redesign.",
    expected_output:
      "A redesigned questionnaire extract with brief justification linked to the original wording flaws.",
    task_material_decision: {
      separate_inputs_required: true,
      task_input_material_ids: taskInputIds || providerIds
    },
    required_materials: requiredMaterials,
    evidence_decision: {
      required: true,
      reason: "Learners must inspect the draft questionnaire wording directly as grounds for redesign.",
      provider_material_ids: providerIds
    },
    materials: [],
    episode_plan: { archetype: "redesign", beats: [{ function: "evaluative_judgement" }] }
  };
}

function validatePracticePartial(activity) {
  return dlaEnrich.validateDlaPartialPageCapture(
    {
      artifact_type: "page",
      schema_version: "2.0.0",
      assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
      activities: [activity]
    },
    { practiceProduct: true }
  );
}

test("1. Invalid combination: teaching/explanatory material carrying evidence_requirement fails provider-role closure", () => {
  const act = makePracticeActivity(
    [
      {
        material_id: "A2-M1",
        material_type: "scenario",
        purpose: "Supply the verbatim draft questionnaire extract for inspection.",
        specification:
          "Present the 6-item draft questionnaire with exact wording and response scale anchors; do not label flaws.",
        evidence_requirement: makeEvidenceRequirement()
      },
      {
        material_id: "A2-M2",
        material_type: "text",
        purpose: "Explain key concepts in neutral questionnaire design.",
        specification:
          "Explanatory teaching overview introducing leading questions, double-barrelled items, and balanced scales.",
        evidence_requirement: makeEvidenceRequirement({
          purpose: "Provide conceptual principles for evaluating questions.",
          learner_action: "Read the conceptual overview and apply the principles."
        })
      }
    ],
    ["A2-M1", "A2-M2"],
    ["A2-M1", "A2-M2"]
  );
  const res = validatePracticePartial(act);
  assert.equal(res.ok, false);
  assert.ok(
    res.errors.some((e) =>
      /activities\[0\]\.required_materials\[1\].*teaching\/explanatory material cannot carry evidence_requirement.*provider-role closure/i.test(
        e
      )
    ),
    "Expected provider-role closure error on teaching/explanatory row, got: " + res.errors.join("; ")
  );
});

test("2. Invalid combination: explanatory feedback discussing or interpreting evidence cannot carry evidence_requirement", () => {
  const act = makePracticeActivity(
    [
      {
        material_id: "A2-M1",
        material_type: "scenario",
        purpose: "Supply the verbatim draft questionnaire extract for inspection.",
        specification:
          "Present the 6-item draft questionnaire with exact wording and response scales; do not include explanatory feedback.",
        evidence_requirement: makeEvidenceRequirement()
      },
      {
        material_id: "A2-M2",
        material_type: "text",
        purpose:
          "Provide post-attempt explanatory feedback interpreting the questionnaire excerpt and survey results.",
        specification:
          "Explanatory feedback discussing the observations from the draft questionnaire cases and explaining why each flaw biases respondent data.",
        evidence_requirement: makeEvidenceRequirement({
          purpose: "Help learners interpret the flaws discussed in feedback."
        })
      }
    ],
    ["A2-M1", "A2-M2"],
    ["A2-M1", "A2-M2"]
  );
  const res = validatePracticePartial(act);
  assert.equal(res.ok, false);
  assert.ok(
    res.errors.some((e) =>
      /activities\[0\]\.required_materials\[1\].*teaching\/explanatory material cannot carry evidence_requirement.*provider-role closure/i.test(
        e
      )
    ),
    "Explanatory feedback discussing evidence must fail provider-role closure, got: " +
      res.errors.join("; ")
  );
});

test("3. Valid separation: inspectable evidence provider with evidence_requirement + explanatory/feedback row without evidence_requirement", () => {
  const act = makePracticeActivity(
    [
      {
        material_id: "A2-M1",
        material_type: "scenario",
        purpose: "Supply the verbatim draft questionnaire extract for inspection and redesign.",
        specification:
          "Present the 6-item draft questionnaire preserving exact wording and response scales; do not label flaws or include explanatory feedback.",
        evidence_requirement: makeEvidenceRequirement()
      },
      {
        material_id: "A2-M2",
        material_type: "text",
        purpose:
          "Provide post-attempt explanatory feedback discussing how leading phrasing and double-barrelled items distort responses.",
        specification:
          "Concise explanatory feedback interpreting the main design issues after the learner submits their redesign."
      }
    ],
    ["A2-M1"],
    ["A2-M1"]
  );
  const res = validatePracticePartial(act);
  assert.equal(res.ok, true, "Valid separated evidence + explanatory feedback should pass: " + res.errors.join("; "));
});

test("4. Valid dual-role material: explanatory framing paired with clearly distinguished inspectable evidence passes", () => {
  const act = makePracticeActivity(
    [
      {
        material_id: "A2-M1",
        material_type: "scenario",
        purpose:
          "Explain the survey commissioning context and supply the clearly distinguished verbatim draft questionnaire extract for inspection.",
        specification:
          "Open with a brief two-sentence overview of the commissioning context, then present a clearly distinguished source extract preserving the exact wording and response scales of all six draft items; do not diagnose flaws.",
        evidence_requirement: makeEvidenceRequirement()
      }
    ],
    ["A2-M1"],
    ["A2-M1"]
  );
  const res = validatePracticePartial(act);
  assert.equal(res.ok, true, "Legitimate dual-role material with clearly distinguished evidence should pass: " + res.errors.join("; "));
});

test("5. Live Practice DLA contract clearly distinguishes teaching/explanatory/feedback, inspectable evidence, and dual-role materials", () => {
  const assembled = dlaContract.assembleDlaCanonicalContract({ practiceProduct: true });
  const providers = assembled.sections.providers;
  const output = assembled.sections.output;

  assert.match(providers, /Distinguish three material roles strictly/i);
  assert.match(providers, /post-attempt explanatory feedback/i);
  assert.match(providers, /even when they discuss, critique, or interpret evidence/i);
  assert.match(providers, /legitimate dual-role materials/i);
  assert.match(providers, /clearly distinguish the supplied inspectable evidence component/i);
  assert.match(output, /Provider-role closure:/i);
  assert.match(output, /no teaching-only, explanatory-only, or explanatory-feedback row/i);
  assert.match(
    dlaContract.DLA_P02_FINAL_SILENT_PRE_EMIT_GATE,
    /provider-role closure/i
  );
});
