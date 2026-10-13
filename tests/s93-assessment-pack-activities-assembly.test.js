/**
 * Assessment Pack publication keeps questions in assessment_evidence.
 * Step 7 may copy those elicitations into activities[]; that copy is not an
 * Interactive activity and must not block assembly or drop the questions.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const canonical = require("../lib/assessment-pack-canonical.js");
const publish = require("../lib/assessment-pack-publish.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");

function purpose() {
  return {
    role: "R2",
    visibility_claim: "Whether the learner can keep a claim within the visible evidence.",
    stop_rationale: "A short formative stop.",
    forward_intent: "Show which distinction still needs attention."
  };
}

function determinate() {
  return {
    elicitation_id: "e1",
    order: 1,
    evidence_ask: "Identify the recorded fact.",
    epistemic_class: "determinate",
    stimulus: "The service log records that the new process was introduced.",
    delivery: {
      kind: "auto_checkable_items",
      items: [
        {
          item_id: "q1",
          order: 1,
          form: "single_answer_mcq",
          prompt: {
            stem: "Which statement does the service log record?",
            options: [
              { key: "a", text: "The process was introduced." },
              { key: "b", text: "The process improved the service." }
            ]
          },
          judgement: { correct_answer: "a", auto_checkable: true },
          auto_checkable: true,
          feedback_note: "The service log records that the new process was introduced."
        }
      ]
    },
    formative_return: {
      materials: [
        {
          material_id: "m1",
          body: "The service log records that the new process was introduced."
        }
      ],
      forward_orientation: "Look again at what the log records."
    }
  };
}

function constructed() {
  return {
    elicitation_id: "e2",
    order: 2,
    evidence_ask: "Explain the limit of the log.",
    epistemic_class: "non_determinate",
    stimulus: "The service log records that the new process was introduced.",
    delivery: {
      kind: "constructed_performance",
      prompt: "Explain what the service log does not establish about the process.",
      response_workspace: { intention: "A short written judgement" }
    },
    formative_return: {
      materials: [
        {
          material_id: "m2",
          body: "A careful response names that the log does not establish an improvement."
        }
      ],
      forward_orientation: "Use the log's limit in the next judgement."
    }
  };
}

function page(elicitations, activities) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Evidence and claims",
    activities: activities,
    sections: [],
    attempt_instructions: "Use only the service log.",
    assessment_evidence: {
      purpose: purpose(),
      learner_context: { depends_on_prior_work: false },
      elicitations: elicitations,
      pack_forward_orientation: "Use the result to decide what to examine next. It does not unlock or block a path."
    }
  };
}

test("elicitations copied into activities still assemble with their questions, keys and feedback", () => {
  const source = page(
    [determinate()],
    [JSON.parse(JSON.stringify(determinate())), JSON.parse(JSON.stringify(constructed()))]
  );
  const published = publish.resolveAssessmentPackPublishPage({ page: source });
  assert.equal(published.ok, true, published.message || JSON.stringify(published.errors));
  assert.deepEqual(published.page.activities, []);
  const ids = published.page.assessment_evidence.elicitations.map(function (row) {
    return row.elicitation_id;
  });
  assert.deepEqual(ids, ["e1", "e2"]);
  const rendered = renderLearnerPageHtml(published.page);
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assert.match(html, /Which statement does the service log record/);
  assert.match(html, /data-assessment-correct="a"/);
  assert.match(html, /The service log records that the new process was introduced/);
  assert.match(html, /Explain what the service log does not establish about the process/);
  assert.match(html, /the log does not establish an improvement/);
});

test("a generic interactive activity is still rejected", () => {
  const withShell = page([determinate(), constructed()], [{ activity_id: "A1" }]);
  const shell = publish.resolveAssessmentPackPublishPage({ page: withShell });
  assert.equal(shell.ok, false);
  assert.match(shell.message, /activities must be an empty array/);

  const withTask = page(
    [determinate(), constructed()],
    [{ activity_id: "A1", learner_task: "Work through the study activity." }]
  );
  const task = canonical.validateAssessmentPackCanonicalPage(
    canonical.normalizeAssessmentPackCanonicalPage(withTask).page
  );
  assert.equal(task.ok, false);
  assert.ok(task.errors.some(function (error) { return error.code === "activities_must_be_empty"; }));
});
