/**
 * Assessment Pack Design Page generation — commissioned authentic performance fidelity.
 *
 * Regression for the C05 authoring failure: an explicitly commissioned independent
 * recommendation / criteria-based self-review was acknowledged but deferred outside
 * a determinate-only formative_check Design Page with no in-pack delivery.
 *
 * Prompt-contract tests only. Does not regenerate the live C05 resource.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const family = require("../lib/first-class-workflow-family.js");

/** Supplied C05 Learning Journey Assessment Pack commission (authentic performance). */
const C05_AUTHENTIC_FOCUS = [
  "Learning Journey Assessment Pack commission for The Committee Recommendation.",
  "Learners must produce an independent committee recommendation that selects and justifies one of four institutional options,",
  "interprets the quantitative findings, integrates conflicting operational and stakeholder evidence, acknowledges uncertainty,",
  "compares a plausible alternative, and proposes feasible conditions.",
  "They then complete a six-criterion self-review of their own recommendation covering accuracy, critical appraisal, integration,",
  "stakeholder evaluation, proportionality and uncertainty, with optional concise revision.",
  "Short determinate formative checks may support the reasoning, but the independent recommendation and self-review are required learner performances.",
  "Learners should be able to copy their recommendation for later reuse in the journey."
].join(" ");

/** Determinate-only commission — must not invent constructed performances. */
const DETERMINATE_ONLY_FOCUS =
  "Check how well the learner can identify a prior probability before new evidence. Use short auto-checkable items only.";

function build(focus) {
  return family.buildFirstClassWorkflowFamily({
    product: "assessment_pack",
    focus: focus,
    startingPoint: "topic"
  });
}

function stages(built) {
  return {
    purpose: built.steps[3],
    elicitation: built.steps[4],
    formative: built.steps[5],
    design: built.steps[6]
  };
}

function assertFidelityOnAllStages(step) {
  [step.purpose, step.elicitation, step.formative, step.design].forEach(function (stage) {
    assert.match(stage.promptBody, /Commissioned authentic performance fidelity/);
    assert.match(stage.promptBody, /delivery\.kind "constructed_performance"/);
    assert.match(stage.promptBody, /formative_check intent and short or quick extent do not permit omitting/);
    assert.match(stage.promptBody, /Do not invent constructed performances the commission does not require/);
    assert.match(
      stage.promptBody,
      /Do not silently relocate a required performance outside this generated pack unless the grounding context explicitly identifies/
    );
    assert.match(
      stage.promptBody,
      /Do not add automatic correctness judgements, scores, or runtime marking for unrestricted learner writing/
    );
  });
}

test("C05 authentic commission requires constructed_performance delivery and output_specification", () => {
  const built = build(C05_AUTHENTIC_FOCUS);
  assert.equal(built.ok, true);
  const step = stages(built);
  assertFidelityOnAllStages(step);

  assert.equal(step.purpose.promptBody.indexOf(C05_AUTHENTIC_FOCUS) !== -1, true);
  assert.match(step.elicitation.promptBody, /constructed_performance/);
  assert.match(
    step.design.promptBody,
    /Preserve every non_determinate constructed_performance elicitation/
  );
  assert.match(
    step.design.promptBody,
    /Do not drop a commissioned authentic performance, convert it into determinate items, or describe it only as work the learner will do outside this page/
  );

  // Retain/copy of the recommendation engages the existing output_specification path.
  assert.match(step.design.promptBody, /Emit assessment_evidence\.output_specification/);
  assert.match(step.design.role, /Emit output_specification mapped only to the elicitations already designed/);
  assert.equal(step.design.promptBody.indexOf("This commission does not ask for a structured learner-owned artefact"), -1);

  // Supporting determinate checks remain allowed; determinate-only collapse is forbidden.
  assert.match(step.purpose.promptBody, /Determinate auto_checkable_items may still support/);
  assert.match(
    step.elicitation.promptBody,
    /If the grounding context also requires an authentic constructed performance, author that as additional non_determinate elicitation/
  );
});

test("determinate-only commission keeps omit-output guidance and does not invent constructed performances", () => {
  const built = build(DETERMINATE_ONLY_FOCUS);
  assert.equal(built.ok, true);
  const step = stages(built);
  assertFidelityOnAllStages(step);

  assert.match(step.design.promptBody, /omit output_specification/i);
  assert.match(step.design.promptBody, /This commission does not ask for a structured learner-owned artefact/);
  assert.equal(step.design.promptBody.indexOf("Emit assessment_evidence.output_specification"), -1);
  assert.match(step.design.role, /Omit output_specification unless the commission explicitly requires retain/);
  assert.match(step.elicitation.promptBody, /Author the determinate items specified by planned_component_forms/);
  assert.match(step.elicitation.promptBody, /Do not invent constructed performances the commission does not require/);
  assert.equal(step.elicitation.promptBody.indexOf("committee recommendation"), -1);
  assert.equal(step.elicitation.promptBody.indexOf("six-criterion"), -1);
  assert.equal(step.design.promptBody.indexOf("journey-commissioning-brief"), -1);
});

test("authentic performance without retain/copy language still requires in-pack constructed delivery", () => {
  const focus = [
    "Assessment Pack for an institutional decision case.",
    "Learners must write an independent committee recommendation with justification",
    "and complete a six-criterion self-review of their own recommendation.",
    "Formative checks may support the reasoning."
  ].join(" ");
  const step = stages(build(focus));
  assertFidelityOnAllStages(step);
  assert.match(
    step.design.promptBody,
    /Preserve every non_determinate constructed_performance elicitation/
  );
  // No retain/reuse/copy → do not force the structured-artefact Emit path.
  assert.match(step.design.promptBody, /This commission does not ask for a structured learner-owned artefact/);
  assert.equal(step.design.promptBody.indexOf("Emit assessment_evidence.output_specification"), -1);
  assert.match(
    step.design.promptBody,
    /Omit output_specification unless the grounding context explicitly requires the learner to retain, reuse, or copy/
  );
});
