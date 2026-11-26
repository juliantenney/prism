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

test("6. M6 C3 Step 2 regression: original evidence for independent evaluation AND feedback-informed reconsideration passes without false positive", () => {
  const c3RejectedPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A1",
        title: "Review and redesign the questionnaire",
        learner_task:
          "Read the research context and inspect all six questionnaire items before deciding what to change.",
        expected_output:
          "One coherent written questionnaire review that establishes defensible priorities.",
        task_material_decision: {
          separate_inputs_required: true,
          task_input_material_ids: ["A1-M1"]
        },
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "scenario",
            purpose:
              "Provide the original fictional research context and complete unannotated six-item questionnaire extract as directly inspectable evidence for independent methodological evaluation and redesign.",
            specification:
              "Present the fictional university research context and six-item questionnaire extract. Preserve the following six items and their response options without correction or diagnostic annotation. Item 1: 'How often have you participated in extracurricular activities since starting university?' Options: Never; Occasionally; Regularly; Very frequently. Do not introduce highlighted weaknesses, interpretive headings, corrected wording, model answers or indications of which items should be prioritised.",
            evidence_requirement: makeEvidenceRequirement({
              provenance: "conversation_attachment"
            })
          },
          {
            material_id: "A1-M2",
            material_type: "text",
            purpose:
              "Establish concise, non-answer-bearing criteria for evaluating the questionnaire as an integrated research instrument.",
            specification:
              "Commission a brief criteria exposition covering four connected dimensions. Do not diagnose any of the six focal items or disclose the subsequent feedback."
          },
          {
            material_id: "A1-M3",
            material_type: "template",
            purpose:
              "Provide one operational constructed-text workspace for the learner's integrated questionnaire review and coherent redesign.",
            specification:
              "Commission one editable extended-text field labelled 'Questionnaire review and proposed improvements'.",
            response_fields: [
              { label: "Questionnaire review and proposed improvements", input_modality: "text" }
            ],
            response_fulfilment: {
              kind: "learner_text_production",
              response_kind: "text_compose",
              artefact_elicitation_id: "E3",
              allows_partial_exemplar: false
            }
          }
        ],
        evidence_decision: {
          required: true,
          reason:
            "The required methodological judgements depend on inspecting the particular research objective, question wording and response formats.",
          provider_material_ids: ["A1-M1"]
        }
      },
      {
        activity_id: "A2",
        title: "Refine your questionnaire review",
        learner_task:
          "After completing your independent review, engage with the explanatory feedback, referring to the original questionnaire and your existing response.",
        expected_output:
          "A substantively strengthened version of the existing questionnaire review grounded in the original questionnaire and research objective.",
        task_material_decision: {
          separate_inputs_required: true,
          task_input_material_ids: ["A2-M1"]
        },
        required_materials: [
          {
            material_id: "A2-M1",
            material_type: "scenario",
            purpose:
              "Maintain access to the original questionnaire evidence during feedback-informed reconsideration so that the learner can substantiate selected refinements against the actual research objective and item wording.",
            specification:
              "Provide the same complete fictional research context and six-item questionnaire extract commissioned in A1-M1. Preserve every original question, response option, respondent condition and research objective. Item 1: 'How often have you participated in extracurricular activities since starting university?' Options: Never; Occasionally; Regularly; Very frequently. Do not substitute a corrected questionnaire, a summary of its weaknesses or a different scenario. Keep this original evidence distinct from explanatory feedback.",
            evidence_requirement: makeEvidenceRequirement({
              purpose:
                "Supply the unchanged questionnaire particulars needed to reconsider and substantiate selected methodological judgements during refinement.",
              learner_action:
                "Return selectively to relevant questions, response options and research conditions when testing explanatory feedback against the original evidence and strengthening the existing review.",
              provenance: "conversation_attachment"
            })
          },
          {
            material_id: "A2-M2",
            material_type: "sample_output",
            purpose:
              "Provide substantive post-attempt explanatory feedback that models reasoned methodological judgement about the actual questionnaire and supports selective reconsideration of the learner's existing review.",
            specification:
              "Reveal after the learner has attempted the independent questionnaire review. Explain how Items 1 and 2 overlap and illustrate revisions as components of explanatory feedback, not as a separate candidate-comparison exercise or new evidence provider."
          },
          {
            material_id: "A2-M3",
            material_type: "template",
            purpose:
              "Provide an operational continuation of the existing E3 constructed-text workspace so that feedback-informed improvement changes the original learner-authored review.",
            specification:
              "Commission the same single editable extended-text field labelled 'Questionnaire review and proposed improvements' used in A1-M3.",
            response_fields: [
              { label: "Questionnaire review and proposed improvements", input_modality: "text" }
            ],
            response_fulfilment: {
              kind: "learner_text_production",
              response_kind: "text_compose",
              artefact_elicitation_id: "E3",
              allows_partial_exemplar: false
            }
          },
          {
            material_id: "A2-M4",
            material_type: "checklist",
            purpose: "Support brief final verification of the quality and coherence of the refined review.",
            specification: "Commission one compact diagnostic self-review checklist.",
            diagnostic_review: {
              covers_response_material_ids: ["A2-M3"]
            }
          }
        ],
        evidence_decision: {
          required: true,
          reason:
            "Substantive refinement requires the learner to reconsider and substantiate selected judgements against the original questionnaire. A2-M1 supplies those directly inspectable particulars. A2-M2 is explanatory feedback, not an evidence provider.",
          provider_material_ids: ["A2-M1"]
        }
      }
    ]
  };

  const res = dlaEnrich.validateDlaPartialPageCapture(c3RejectedPage, { practiceProduct: true });
  assert.equal(
    res.ok,
    true,
    "Valid M6 C3 Step 2 DLA with A2-M1 evidence provider and A2-M2 explanatory feedback must pass, got: " +
      (res.errors || []).join("; ")
  );

  // Confirm that attaching evidence_requirement to A2-M2 explanatory feedback STILL fails closed
  const invalidWithFeedbackProvider = JSON.parse(JSON.stringify(c3RejectedPage));
  invalidWithFeedbackProvider.activities[1].task_material_decision.task_input_material_ids.push("A2-M2");
  invalidWithFeedbackProvider.activities[1].evidence_decision.provider_material_ids.push("A2-M2");
  invalidWithFeedbackProvider.activities[1].required_materials[1].evidence_requirement =
    makeEvidenceRequirement({
      purpose: "Model how a researcher interprets the questionnaire flaws."
    });
  const resInvalid = dlaEnrich.validateDlaPartialPageCapture(invalidWithFeedbackProvider, {
    practiceProduct: true
  });
  assert.equal(resInvalid.ok, false);
  assert.ok(
    resInvalid.errors.some((e) =>
      /activities\[1\]\.required_materials\[1\].*teaching\/explanatory material cannot carry evidence_requirement.*provider-role closure/i.test(
        e
      )
    ),
    "Explanatory feedback row A2-M2 must still fail if given evidence_requirement, got: " +
      (resInvalid.errors || []).join("; ")
  );
});

test("7. Prohibition, separation, and usage-context references to explanatory feedback do not misclassify inspectable evidence", () => {
  const act = makePracticeActivity(
    [
      {
        material_id: "A2-M1",
        material_type: "task_card",
        purpose:
          "Retain the original policy wording for reference when testing explanatory feedback against the supplied text.",
        specification:
          "Present the unaltered policy clauses for inspection during feedback-informed revision. Keep this evidence separate from explanatory feedback and do not include post-attempt explanatory feedback or conceptual commentary.",
        evidence_requirement: makeEvidenceRequirement({
          purpose: "Provide unchanged policy clauses for selective verification."
        })
      }
    ],
    ["A2-M1"],
    ["A2-M1"]
  );
  const res = validatePracticePartial(act);
  assert.equal(
    res.ok,
    true,
    "Separation/usage-context references to explanatory feedback must not misclassify an evidence provider: " +
      (res.errors || []).join("; ")
  );
});
