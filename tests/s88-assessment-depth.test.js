/**
 * Sprint 88 — assessment depth, automatic count, evidence profile, feedback timing.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const family = require("../lib/first-class-workflow-family.js");
const publish = require("../lib/assessment-pack-publish.js");
const runtime = require("../lib/learner-renderer-vnext/assessment-runtime.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");

function build(overrides) {
  return family.buildFirstClassWorkflowFamily(
    Object.assign(
      {
        ldCreateOutputType: "assessment_pack",
        focus: "Bayes theorem",
        startingPoint: "topic"
      },
      overrides || {}
    )
  );
}

test("depth, automatic count, and per-component feedback are the defaults", () => {
  const built = build();
  assert.equal(built.deliverySeed.assessment_depth, "standard");
  assert.equal(built.deliverySeed.component_count_mode, "auto");
  assert.equal(built.deliverySeed.target_component_count, null);
  assert.equal(built.deliverySeed.feedback_timing, "per_component");
  const plan = built.steps[3].promptBody;
  assert.match(plan, /Assessment depth: standard/);
  assert.match(plan, /Component count: PRISM decides/);
  assert.match(plan, /count_basis/);
  assert.match(plan, /evidence_rationale/);
  assert.match(plan, /whether each relevant outcome is probed/);
  assert.equal(plan.indexOf("one question per"), -1);
  assert.equal(plan.indexOf("three questions per"), -1);
  assert.equal(plan.indexOf("stronger evidence"), -1);
  assert.match(plan, /Feedback timing: per_component/);
  assert.match(built.steps[4].promptBody, /planned_component_forms/);
  assert.match(built.steps[4].promptBody, /Do not rebalance the mix/);
});

test("an exact count stays a hard constraint and a stale allocation does not set it", () => {
  const exact = build({ componentCountMode: "exact", componentCount: 8, assessmentDepth: "quick" });
  assert.equal(exact.deliverySeed.component_count_mode, "exact");
  assert.equal(exact.deliverySeed.target_component_count, 8);
  assert.match(exact.steps[3].promptBody, /Component count: exactly 8/);
  assert.match(exact.steps[3].promptBody, /Assessment depth: quick/);
  const custom = build({
    componentMix: "custom",
    componentCountMode: "auto",
    componentAllocation: {
      single_answer_mcq: 3,
      multiple_answer_mcq: 1,
      ordering: 1,
      classification: 2,
      matching: 1
    }
  });
  assert.equal(custom.deliverySeed.component_mix, "prism_decides");
  assert.equal(custom.deliverySeed.component_count_mode, "auto");
  assert.equal(custom.deliverySeed.target_component_count, null);
  const end = build({ feedbackTiming: "end_of_pack", componentCount: 4 });
  assert.equal(end.deliverySeed.feedback_timing, "end_of_pack");
  assert.equal(end.deliverySeed.assessment_intent, "formative_check");
});

test("end of pack hides checking until finish and the evidence profile stays conservative", () => {
  const assembled = publish.assembleAssessmentPackPage({
    feedbackTiming: "end_of_pack",
    designPage: { title: "Check", framing: "A guide." },
    learningOutcomes: {
      learning_outcomes: [{ id: "LO1", statement: "Explain prior probability." }]
    },
    assessmentPack: {
      artifact_type: "assessment_pack",
      components: [
        {
          id: "q1",
          form: "single_answer_mcq",
          mapped_learning_outcomes: ["LO1"],
          prompt: { stem: "Which is a prior?", options: [{ key: "a", text: "Belief before evidence" }] },
          judgement: { correct_answer: "a" },
          feedback_note: "A prior is the belief before the evidence.",
          representation: null
        }
      ]
    }
  });
  const html = renderPage(buildPageModel(assembled.page).model, {});
  assert.match(html, /data-feedback-timing="end_of_pack"/);
  assert.match(html, /Finish assessment/);
  assert.match(html, /Explain prior probability/);
  const script = runtime.getAssessmentRuntimeScript();
  assert.match(script, /Limited evidence/);
  assert.match(script, /Consistently successful evidence across/);
  assert.match(script, /Mixed evidence across/);
  assert.equal(script.indexOf("mastered"), -1);
  assert.equal(script.indexOf("Stronger evidence"), -1);
  assert.match(script, /data-feedback-timing'\)==='end_of_pack'/);
});
