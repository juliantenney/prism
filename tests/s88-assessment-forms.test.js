/**
 * Sprint 88 — formative Assessment forms, mix, and learner checks.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const family = require("../lib/first-class-workflow-family.js");
const forms = require("../lib/assessment-component-forms.js");
const publish = require("../lib/assessment-pack-publish.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");

function build(overrides) {
  return family.buildFirstClassWorkflowFamily(
    Object.assign(
      {
        ldCreateOutputType: "assessment_pack",
        focus: "Bayes theorem",
        startingPoint: "topic",
        componentCount: 8,
        assessmentIntent: "formative_check",
        componentMix: "prism_decides"
      },
      overrides || {}
    )
  );
}

test("formative check and pre-test diagnostic are the product intents", () => {
  const check = build();
  const diagnostic = build({ assessmentIntent: "pretest_diagnostic" });
  assert.equal(check.deliverySeed.assessment_intent, "formative_check");
  assert.equal(diagnostic.deliverySeed.assessment_intent, "pretest_diagnostic");
  assert.match(check.steps[3].promptBody, /formative_check/);
  assert.match(diagnostic.steps[3].promptBody, /pretest_diagnostic/);
  assert.match(check.steps[3].promptBody, /does not control the learner/);
  assert.equal(check.steps[3].promptBody.indexOf("adaptive"), -1);
  assert.deepEqual(check.titles, diagnostic.titles);
});

test("a stale custom allocation does not constrain a new pack", () => {
  const ignored = build({
    componentMix: "custom",
    componentCountMode: "auto",
    componentCount: 8,
    componentAllocation: { single_answer_mcq: 3, ordering: 2 }
  });
  assert.equal(ignored.ok, true);
  assert.equal(ignored.deliverySeed.component_mix, "prism_decides");
  assert.equal(ignored.deliverySeed.component_count_mode, "auto");
  assert.equal(ignored.deliverySeed.target_component_count, null);
  assert.match(ignored.steps[3].promptBody, /Component mix: PRISM decides/);
  assert.equal(ignored.steps[3].promptBody.indexOf("Use this allocation exactly"), -1);
  assert.equal(ignored.steps[3].promptBody.indexOf("single_answer_mcq: 3"), -1);
  forms.SUPPORTED_FORMS.forEach(function (form) {
    assert.match(ignored.steps[3].promptBody, new RegExp(form));
  });
  const missing = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Bayes theorem",
    componentCountMode: "exact"
  });
  assert.equal(missing.ok, false);
  assert.equal(missing.code, "component_count_required");
  const exact = build({ componentCountMode: "exact", componentCount: 4 });
  assert.equal(exact.deliverySeed.component_count_mode, "exact");
  assert.equal(exact.deliverySeed.target_component_count, 4);
});

test("object-keyed single-answer options render as choices and hide the key before check", () => {
  const assembled = publish.assembleAssessmentPackPage({
    designPage: {
      title: "A check",
      attempt_instructions: "Answer, then check.",
      framing: "Use this to see what is secure.",
      assessment_intent: "formative_check"
    },
    assessmentPack: {
      artifact_type: "assessment_pack",
      learning_outcomes: [{ id: "LO1", statement: "Identify a prior." }],
      evidence_plan_ref: { assessment_intent: "formative_check" },
      components: [
        {
          id: "q1",
          form: "single_answer_mcq",
          mapped_learning_outcomes: ["LO1"],
          prompt: {
            stem: "Which statement is a prior?",
            options: [
              { key: "a", text: "A belief before the evidence" },
              { key: "b", text: "The evidence itself" }
            ]
          },
          judgement: { auto_checkable: true, correct_answer: "a" },
          feedback_note: "A prior is the belief you held before the new evidence.",
          representation: null
        }
      ]
    }
  });
  assert.equal(assembled.ok, true);
  assert.deepEqual(assembled.page.assessment_check.items[0].options, [
    { key: "a", text: "A belief before the evidence" },
    { key: "b", text: "The evidence itself" }
  ]);
  const html = renderPage(buildPageModel(assembled.page).model, {});
  assert.match(html, /type="radio"/);
  assert.match(html, /value="a"/);
  assert.match(html, /A belief before the evidence/);
  assert.equal(html.indexOf("[object Object]"), -1);
  assert.equal(html.indexOf("Correct answer:"), -1);
  assert.equal(html.indexOf("Purpose: formative"), -1);
  assert.equal(html.indexOf("Self assessment"), -1);
  assert.match(html, />Assessment</);
  assert.match(html, /Use this to see what is secure/);
  assert.match(html, /Answer, then check/);
  const beforeScript = html.split("<script>")[0];
  assert.equal(beforeScript.indexOf("util-assessment-rationale"), -1);
});

test("the other supported forms render checkable interactions and a mapped summary", () => {
  const assembled = publish.assembleAssessmentPackPage({
    designPage: {
      title: "Diagnostic",
      framing: "This recommends what to concentrate on.",
      assessment_intent: "pretest_diagnostic"
    },
    assessmentPack: {
      artifact_type: "assessment_pack",
      learning_outcomes: [
        { id: "LO1", statement: "Recognise several valid features" },
        { id: "LO2", statement: "Order a short process" },
        { id: "LO3", statement: "Classify an example" },
        { id: "LO4", statement: "Match a cause with an effect" }
      ],
      components: [
        {
          id: "multi",
          form: "multiple_answer_mcq",
          mapped_learning_outcomes: ["LO1"],
          prompt: { stem: "Select every valid feature.", options: [{ key: "a", text: "One" }, { key: "b", text: "Two" }] },
          judgement: { correct_answers: ["a", "b"] },
          feedback_note: "Both features belong.",
          representation: null
        },
        {
          id: "order",
          form: "ordering",
          mapped_learning_outcomes: ["LO2"],
          prompt: { stem: "Order the steps.", items: [{ id: "s2", text: "Second" }, { id: "s1", text: "First" }] },
          judgement: { correct_order: ["s1", "s2"] },
          feedback_note: "First comes before second.",
          representation: null
        },
        {
          id: "class",
          form: "classification",
          mapped_learning_outcomes: ["LO3"],
          prompt: {
            stem: "Classify the example.",
            categories: [{ id: "c1", label: "Prior" }, { id: "c2", label: "Evidence" }],
            items: [{ id: "i1", text: "Belief before the data" }]
          },
          judgement: { assignments: { i1: "c1" } },
          feedback_note: "That example is a prior.",
          representation: null
        },
        {
          id: "match",
          form: "matching",
          mapped_learning_outcomes: ["LO4"],
          prompt: {
            stem: "Match each idea.",
            left: [{ id: "l1", text: "Prior" }],
            right: [{ id: "r2", text: "New information" }, { id: "r1", text: "Belief before the evidence" }]
          },
          judgement: { pairs: { l1: "r1" } },
          feedback_note: "A prior is the earlier belief.",
          representation: null
        }
      ]
    }
  });
  const html = renderPage(buildPageModel(assembled.page).model, {});
  assert.match(html, /type="checkbox"/);
  assert.match(html, /data-assessment-correct-set="a\|b"/);
  assert.match(html, /data-assessment-move="up"/);
  assert.match(html, /data-assessment-correct-order="s1\|s2"/);
  assert.match(html, /Select a category/);
  assert.match(html, /Choose a match/);
  assert.match(html, /data-assessment-intent="pretest_diagnostic"/);
  assert.match(html, /Recognise several valid features/);
  assert.match(html, /Summarise this assessment/);
  assert.equal(html.indexOf("skip content"), -1);
  assert.equal(html.indexOf("Self assessment"), -1);
  assert.match(html, /What this assessment checks/);
  assert.match(html, /data-assessment-position/);
  assert.match(html, /Move Second up/);
  assert.match(html, /Move Second down/);
  assert.match(html, /↑/);
  assert.match(html, /↓/);
  const movesAt = html.indexOf("util-assessment-order-moves");
  const statementAt = html.indexOf("util-assessment-order-text");
  assert.ok(movesAt > -1 && statementAt > movesAt);
  assert.match(html, /data-assessment-move="up" disabled/);
  assert.match(html, /data-assessment-move="down" disabled/);
  assert.match(html, /util-assessment-classify-row/);
  assert.match(html, /class="util-assessment-select" data-assessment-assignment/);
  assert.match(html, /util-assessment-match-row/);
  assert.match(html, /for="assessment-match-l1"/);
  assert.match(html, /id="assessment-match-l1"/);
  assert.match(html, /class="util-assessment-select" data-assessment-pair/);
  assert.match(html, /data-assessment-correct-map="l1:r1"/);
  assert.match(html, /First comes before second|Order the steps/);
});

test("learning outcome statements come from the upstream artefact, not a restatement", () => {
  const assembled = publish.assembleAssessmentPackPage({
    designPage: { title: "Check", framing: "A check." },
    learningOutcomes: {
      artifact_type: "learning_outcomes",
      learning_outcomes: [
        { id: "LO1", statement: "Explain the role of prior probability." },
        { id: "LO9", statement: "This outcome is not assessed." }
      ]
    },
    assessmentPack: {
      artifact_type: "assessment_pack",
      components: [
        {
          id: "q1",
          form: "ordering",
          mapped_learning_outcomes: ["LO1"],
          prompt: {
            stem: "Order the update.",
            items: [
              { id: "b", text: "Use the evidence" },
              { id: "a", text: "Start from the prior" }
            ]
          },
          judgement: { correct_order: ["a", "b"] },
          feedback_note: "The prior is the belief before the evidence, so it comes first.",
          representation: null
        }
      ]
    }
  });
  assert.deepEqual(assembled.page.learning_outcomes, [
    { id: "LO1", statement: "Explain the role of prior probability." }
  ]);
  const html = renderPage(buildPageModel(assembled.page).model, {});
  assert.match(html, /Explain the role of prior probability/);
  assert.equal(html.indexOf("This outcome is not assessed"), -1);
  assert.match(html, /The prior is the belief before the evidence/);
  assert.equal(html.indexOf(">LO1<"), -1);
});
