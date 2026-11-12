/**
 * Feedback quantity checks: exact visible tokens, plus narrow count-out-of-100 ↔ percent.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const canonical = require("../lib/assessment-pack-canonical.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

function formativeArtefact(stimulus, feedbackNote) {
  return {
    artifact_type: "assessment_formative_return",
    purpose: {
      role: "R2",
      visibility_claim: "visibility",
      stop_rationale: "stop",
      forward_intent: "forward"
    },
    learner_context: { depends_on_prior_work: false },
    elicitations: [
      {
        elicitation_id: "E1",
        order: 1,
        epistemic_class: "determinate",
        stimulus: stimulus,
        delivery: {
          kind: "auto_checkable_items",
          items: [
            {
              item_id: "I1",
              order: 1,
              form: "single_answer_mcq",
              prompt: {
                stem: "Which conclusion is best supported?",
                options: [
                  { key: "A", text: "An unsupported causal claim." },
                  {
                    key: "B",
                    text: "Students who reported regular short breaks were more likely to report good concentration."
                  },
                  { key: "C", text: "An unsupported 14% improvement claim." },
                  { key: "D", text: "An unsupported performance claim." }
                ]
              },
              judgement: { correct_answer: "B" },
              auto_checkable: true,
              key_defence: {
                learner_evidence: "The visible survey evidence supports an association only.",
                resolution: "unambiguous",
                alternatives: [
                  { option_key: "A", status: "less_defensible", reason: "Causal." },
                  { option_key: "C", status: "less_defensible", reason: "14%." },
                  { option_key: "D", status: "less_defensible", reason: "Performance." }
                ]
              },
              feedback_note: feedbackNote
            }
          ]
        },
        formative_return: {
          materials: [],
          forward_orientation: "Apply the distinction in your revised explanation.",
          optional_revision: { offered: false }
        }
      }
    ],
    pack_forward_orientation: "Retain both versions."
  };
}

function codes(result) {
  return (result.errors || []).map(function (error) {
    return typeof error === "string" ? error : error.code || error.message;
  });
}

test("visible 72 of 100 and 58 of 100; feedback 72% and 58% passes", () => {
  const artefact = formativeArtefact(
    "In the survey, 72 of 100 students reporting regular short breaks reported good concentration. Among students without regular short breaks, 58 of 100 reported good concentration. The observed difference was 14 percentage points.",
    "The observed proportions were 72% and 58%, a difference of 14 percentage points, not an established 14% improvement."
  );
  const checked = canonical.reviewDeterminateKeys(artefact);
  assert.equal(checked.ok, true, JSON.stringify(checked.errors));
});

test("visible 72%; feedback 72 of 100 passes via safe reverse equivalence", () => {
  const artefact = formativeArtefact(
    "In the survey, 72% of students in the regular-break group reported good concentration.",
    "The regular-break group included 72 of 100 students reporting good concentration."
  );
  const checked = canonical.reviewDeterminateKeys(artefact);
  assert.equal(checked.ok, true, JSON.stringify(checked.errors));
});

test("visible 72 of 120; feedback 72% fails", () => {
  const artefact = formativeArtefact(
    "In the survey, 72 of 120 students reported good concentration.",
    "The observed proportion was 72%."
  );
  const checked = canonical.reviewDeterminateKeys(artefact);
  assert.equal(checked.ok, false);
  assert.ok(codes(checked).indexOf("answer_key_invented_evidence") !== -1);
});

test("unrelated 72 and 100 appearing separately; feedback 72% fails", () => {
  const artefact = formativeArtefact(
    "Group A had 72 students. Another cohort later enrolled 100 students for a different module.",
    "The observed proportion was 72%."
  );
  const checked = canonical.reviewDeterminateKeys(artefact);
  assert.equal(checked.ok, false);
  assert.ok(codes(checked).indexOf("answer_key_invented_evidence") !== -1);
});

test("sentence-local Among 100 students..., N reported licenses N%", () => {
  const artefact = formativeArtefact(
    "Among 100 students who did not report taking regular short breaks, 58 reported good concentration.",
    "The observed proportion was 58%."
  );
  const checked = canonical.reviewDeterminateKeys(artefact);
  assert.equal(checked.ok, true, JSON.stringify(checked.errors));
});

test("visible 72 of 100; feedback 74% fails", () => {
  const artefact = formativeArtefact(
    "In the survey, 72 of 100 students reported good concentration.",
    "The observed proportion was 74%."
  );
  const checked = canonical.reviewDeterminateKeys(artefact);
  assert.equal(checked.ok, false);
  assert.ok(codes(checked).indexOf("answer_key_invented_evidence") !== -1);
});

test("feedback containing a genuinely new quantity continues to fail", () => {
  const artefact = formativeArtefact(
    "In the survey, 72 of 100 students reported good concentration. The observed difference was 14 percentage points.",
    "The observed proportion was 72%, and a confidence interval of 9% was also reported."
  );
  const checked = canonical.reviewDeterminateKeys(artefact);
  assert.equal(checked.ok, false);
  assert.ok(codes(checked).indexOf("answer_key_invented_evidence") !== -1);
});

test("original unmodified C5 formative return passes Author Formative Return capture", () => {
  const originalPath = path.join(__dirname, "..", "tmp-c5-formative-original.json");
  assert.equal(fs.existsSync(originalPath), true, "expected tmp-c5-formative-original.json");
  const original = JSON.parse(fs.readFileSync(originalPath, "utf8"));
  const feedback = original.elicitations[1].delivery.items[0].feedback_note;
  assert.match(feedback, /72%/);
  assert.match(feedback, /58%/);
  assert.match(original.elicitations[1].stimulus, /72 of 100/);
  assert.match(
    original.elicitations[1].stimulus,
    /Among 100 students who did not report taking regular short breaks, 58 reported/
  );

  const reviewed = canonical.reviewDeterminateKeys(original);
  assert.equal(reviewed.ok, true, JSON.stringify(reviewed.errors));

  const { api } = loadPrismAppJsTestApi({
    extraLibs: ["lib/assessment-component-forms.js", "lib/assessment-pack-canonical.js"]
  });
  const workflow = {
    id: "c5-quantity-equivalence",
    name: "C5 quantity equivalence",
    product: "assessment_pack",
    ldCreateOutputType: "assessment_pack",
    steps: [
      {
        id: "step-formative",
        title: "Author Formative Return",
        canonical_step_id: "step_author_formative_return",
        outputName: "assessment_formative_return"
      }
    ]
  };
  api.setWorkflowsForTest([workflow]);
  api.setSelectedWorkflowIdForTest(workflow.id);
  const capture = api.validateStrictJsonWorkflowRunStepCaptureForTest(
    JSON.stringify(original),
    workflow.steps[0],
    workflow
  );
  assert.equal(capture.ok, true, capture.message || JSON.stringify(capture));
});
