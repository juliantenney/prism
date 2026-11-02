/**
 * Sprint 94 WP3 — shared commission ORIGINAL_BRIEF composition and runtime delivery.
 *
 * Intake already stores specification / journey context / dependencies.
 * This suite proves commissioned Interactive, Expository, and Assessment Pack
 * receive labelled blocks at earliest content-generating stages, without
 * duplicating Situated Task token delivery or changing standalone Create.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const intake = require("../lib/first-class-commission-intake.js");
const family = require("../lib/first-class-workflow-family.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const SPEC =
  "Educational job: Practise comparing the three study-provision options already established.";
const JOURNEY =
  "Established scenario: learners choose among longer library opening hours, additional study spaces, and improved online support. Earlier they recorded an initial judgement.";
const DEPS =
  "Requires c1. Bring forward the learner's own initial judgement from the opening Interactive.";

const CORE_GLC = "Generate or extend teaching-ready learning_content from topic, audience, and level.";
const CORE_MK = "Model the conceptual knowledge contained in this content as knowledge_model.";
const CORE_DLO = "Generate clear, observable learning outcomes from the knowledge model.";
const CORE_NORMALIZE = "Transform the provided content into clean normalized_content.";
const CORE_PURPOSE = "You are interpreting the evidence purpose of an Assessment Pack.";
const CORE_EP = "Deterministic episode-plan step. Do not invent pedagogy here.";

function loadApi() {
  const loaded = loadPrismAppJsTestApi({
    extraLibs: [
      "lib/first-class-commission-intake.js",
      "lib/expository-sibling-prompts.js",
      "lib/situated-task-sibling-prompts.js",
      "lib/situated-task-design-page.js",
      "lib/learning-journey-sibling-prompts.js"
    ]
  });
  const host = loaded.window || loaded.sandbox;
  if (host && loaded.sandbox && loaded.sandbox.PrismExpositorySiblingPrompts) {
    host.PrismExpositorySiblingPrompts = loaded.sandbox.PrismExpositorySiblingPrompts;
  }
  return loaded;
}

function countHeading(text, heading) {
  const re = new RegExp("^" + heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "gm");
  return (String(text || "").match(re) || []).length;
}

function assertOnce(text, heading) {
  assert.equal(countHeading(text, heading), 1, "expected one " + heading + " heading");
}

function assertAbsent(text, heading) {
  assert.equal(countHeading(text, heading), 0, "expected no " + heading + " heading");
}

function assertNoTransferOrInspection(text) {
  assert.doesNotMatch(
    String(text || ""),
    /learner-state transfer is provided|transfers prior responses automatically|inspected previous published|inspected earlier published|stored answers are available|previous responses are available/i
  );
}

function withOverride(step, body, extra) {
  return Object.assign({}, step, extra || {}, {
    id: (step && step.id) || "step",
    prompt_source_type: "local_override",
    override_prompt_body: String(body || "")
  });
}

function commissionedWorkflow(api, productId, focus, extraSteps) {
  const result = intake.intakeCommission({
    productId: productId,
    specificationText: SPEC,
    journeyContextText: JOURNEY,
    dependencies: DEPS,
    sourceJourneyWorkflowId: "wf-lj",
    sourceCommissionId: "c2",
    focus: focus
  });
  assert.equal(result.ok, true, result.code || "");
  const steps = (result.family.steps || []).map(function (row, i) {
    return Object.assign({}, row, { id: "s" + i });
  });
  if (Array.isArray(extraSteps)) {
    extraSteps.forEach(function (row, i) {
      steps.push(Object.assign({}, row, { id: "x" + i }));
    });
  }
  const wf = {
    id: "wf-c2-" + productId,
    product: productId,
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: "c2",
    steps: steps,
    workflowBriefResolution: {
      resolvedFactors: Object.assign({}, result.family.deliverySeed, { topic: focus }),
      initialBrief: {
        topic: focus,
        commissionSpecification: SPEC,
        journeyContextText: JOURNEY,
        dependencies: DEPS,
        commissionDependencies: DEPS
      }
    }
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  return { result: result, wf: wf };
}

function standaloneWorkflow(api, productId, focus, steps) {
  const wf = {
    id: "wf-solo-" + productId,
    product: productId,
    steps: steps,
    workflowBriefResolution: {
      resolvedFactors: { topic: focus },
      initialBrief: { topic: focus }
    }
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  return wf;
}

function findStep(wf, title) {
  return wf.steps.find(function (row) {
    return String(row.title || "") === title;
  });
}

function resolveTitled(api, wf, title, core) {
  const step = findStep(wf, title);
  assert.ok(step, "missing step " + title);
  const live = withOverride(step, core);
  return api.resolveStepPromptText(live, wf);
}

test("shared composer emits labelled blocks for commissioned Interactive, Expository, and Assessment Pack", () => {
  const { api } = loadApi();
  ["interactive", "expository", "assessment_pack"].forEach(function (productId) {
    const { wf } = commissionedWorkflow(api, productId, "Compare study-provision options");
    assert.equal(typeof api.composeCommissionedOriginalBrief, "function");
    const brief = api.composeCommissionedOriginalBrief(wf);
    assert.match(brief, /COMMISSION SPECIFICATION/);
    assert.match(brief, /three study-provision options/i);
    assert.match(brief, /LEARNING JOURNEY CONTEXT/);
    assert.match(brief, /longer library opening hours/i);
    assert.match(brief, /EDUCATIONAL DEPENDENCIES/);
    assert.match(brief, /Requires c1/);
    assert.match(brief, /does not transfer the learner's prior responses/i);
    assert.match(brief, /Do not claim that earlier published resources have been inspected/);
    assertOnce(brief, "COMMISSION SPECIFICATION");
    assertOnce(brief, "LEARNING JOURNEY CONTEXT");
    assertNoTransferOrInspection(brief);
  });
});

test("commissioned Interactive earliest stages receive the labelled brief once via resolveStepPromptText", () => {
  const { api } = loadApi();
  const { wf, result } = commissionedWorkflow(api, "interactive", "Compare study-provision options", [
    { title: "Normalize Content", canonical_step_id: "step_normalize_content" },
    { title: "Design Episode Plan", canonical_step_id: "step_design_episode_plan" }
  ]);
  const glc = resolveTitled(api, wf, "Generate Learning Content", CORE_GLC);
  const mk = resolveTitled(api, wf, "Model Knowledge", CORE_MK);
  const dlo = resolveTitled(api, wf, "Define Learning Outcomes", CORE_DLO);
  const normalize = resolveTitled(api, wf, "Normalize Content", CORE_NORMALIZE);
  const ep = resolveTitled(api, wf, "Design Episode Plan", CORE_EP);

  [glc, mk, dlo, normalize].forEach(function (resolved) {
    assert.ok(resolved && resolved.text);
    assertOnce(resolved.text, "COMMISSION SPECIFICATION");
    assertOnce(resolved.text, "LEARNING JOURNEY CONTEXT");
    assertOnce(resolved.text, "EDUCATIONAL DEPENDENCIES (prior experience handoff)");
    assert.match(resolved.text, /Requires c1/);
    assertNoTransferOrInspection(resolved.text);
  });
  assert.match(glc.text, /Generate or extend teaching-ready learning_content/);
  assertAbsent(ep.text, "COMMISSION SPECIFICATION");
  assertAbsent(ep.text, "LEARNING JOURNEY CONTEXT");

  const glcStep = withOverride(findStep(wf, "Generate Learning Content"), CORE_GLC);
  const before = glcStep.override_prompt_body;
  api.resolveStepPromptText(glcStep, wf);
  assert.equal(glcStep.override_prompt_body, before);
  assert.equal(result.family.deliverySeed.commission_specification, SPEC);
});

test("commissioned Expository GLC, MK, and DLO receive the labelled brief once", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "expository", "Explain the study-provision choice");
  const glc = api.resolveStepPromptText(findStep(wf, "Generate Learning Content"), wf);
  const mk = resolveTitled(api, wf, "Model Knowledge", CORE_MK);
  const dlo = api.resolveStepPromptText(findStep(wf, "Define Learning Outcomes"), wf);
  const dp = api.resolveStepPromptText(findStep(wf, "Design Page"), wf);

  [
    ["Generate Learning Content", glc],
    ["Model Knowledge", mk],
    ["Define Learning Outcomes", dlo]
  ].forEach(function (row) {
    const resolved = row[1];
    assert.ok(resolved && resolved.text, row[0] + " prompt was empty: " + JSON.stringify(resolved));
    assertOnce(resolved.text, "COMMISSION SPECIFICATION");
    assertOnce(resolved.text, "LEARNING JOURNEY CONTEXT");
    assert.match(resolved.text, /additional study spaces/i);
    assertNoTransferOrInspection(resolved.text);
  });
  assert.match(glc.text, /explanatory richness spine/i);
  assertAbsent(dp.text, "COMMISSION SPECIFICATION");
});

test("commissioned Assessment Pack prefix stages and Interpret Evidence Purpose receive the brief", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "assessment_pack", "Check the study-provision judgement");
  const glc = resolveTitled(api, wf, "Generate Learning Content", CORE_GLC);
  const mk = resolveTitled(api, wf, "Model Knowledge", CORE_MK);
  const dlo = resolveTitled(api, wf, "Define Learning Outcomes", CORE_DLO);
  const purposeStep = findStep(wf, "Interpret Evidence Purpose");
  const purpose = api.resolveStepPromptText(
    withOverride(purposeStep, purposeStep.promptBody || CORE_PURPOSE),
    wf
  );
  const design = api.resolveStepPromptText(
    withOverride(findStep(wf, "Design Page"), "Synthesise the Assessment Pack Design Page."),
    wf
  );

  [glc, mk, dlo, purpose].forEach(function (resolved) {
    assert.ok(resolved && resolved.text);
    assertOnce(resolved.text, "COMMISSION SPECIFICATION");
    assertOnce(resolved.text, "LEARNING JOURNEY CONTEXT");
    assert.match(resolved.text, /initial judgement/i);
    assertNoTransferOrInspection(resolved.text);
  });
  assert.match(purpose.text, /interpreting the evidence purpose/i);
  assertAbsent(design.text, "COMMISSION SPECIFICATION");
});

test("standalone Interactive, Expository, and Assessment Pack omit commission blocks", () => {
  const { api } = loadApi();
  const interactive = standaloneWorkflow(api, "interactive", "Bayes theorem", [
    {
      title: "Generate Learning Content",
      canonical_step_id: "step_generate_learning_content",
      outputName: "learning_content"
    }
  ]);
  const interactiveGlc = resolveTitled(api, interactive, "Generate Learning Content", CORE_GLC);
  assertAbsent(interactiveGlc.text, "COMMISSION SPECIFICATION");
  assertAbsent(interactiveGlc.text, "LEARNING JOURNEY CONTEXT");
  assertAbsent(interactiveGlc.text, "EDUCATIONAL DEPENDENCIES (prior experience handoff)");
  assert.match(interactiveGlc.text, /teaching-ready learning_content/);

  const expositoryBuilt = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "expository_resource",
    focus: "Photosynthesis",
    startingArtefact: "generate_from_topic"
  });
  const expository = standaloneWorkflow(
    api,
    "expository",
    "Photosynthesis",
    expositoryBuilt.steps.map(function (row, i) {
      return Object.assign({}, row, { id: "e" + i });
    })
  );
  const expoGlc = api.resolveStepPromptText(findStep(expository, "Generate Learning Content"), expository);
  assertAbsent(expoGlc.text, "COMMISSION SPECIFICATION");
  assertAbsent(expoGlc.text, "LEARNING JOURNEY CONTEXT");

  const apBuilt = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Formative check",
    startingPoint: "topic"
  });
  const assessment = standaloneWorkflow(
    api,
    "assessment_pack",
    "Formative check",
    apBuilt.steps.map(function (row, i) {
      return Object.assign({}, row, { id: "a" + i });
    })
  );
  const purpose = findStep(assessment, "Interpret Evidence Purpose");
  const apPurpose = api.resolveStepPromptText(
    withOverride(purpose, purpose.promptBody || CORE_PURPOSE),
    assessment
  );
  assertAbsent(apPurpose.text, "COMMISSION SPECIFICATION");
  assertAbsent(apPurpose.text, "LEARNING JOURNEY CONTEXT");
});

test("commissioned Situated Task Situation still materialises ORIGINAL_BRIEF without duplicate delivery", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "situated_task", "Workplace Investigation");
  const situation = api.resolveStepPromptText(findStep(wf, "Situation"), wf);
  assert.ok(situation && situation.text);
  assertOnce(situation.text, "COMMISSION SPECIFICATION");
  assertOnce(situation.text, "LEARNING JOURNEY CONTEXT");
  assertOnce(situation.text, "EDUCATIONAL DEPENDENCIES (prior experience handoff)");
  assert.match(situation.text, /when this Situated Task was commissioned/);
  assert.match(situation.text, /You are establishing the Situation for a Situated Task/);
  assertNoTransferOrInspection(situation.text);
  const composed = api.composeSituatedTaskOriginalBrief(wf);
  assert.match(composed, /COMMISSION SPECIFICATION/);
  assert.doesNotMatch(composed, /Do not claim that earlier published resources have been inspected/);
});

test("standalone Situated Task keeps original_brief and omits commission labels", () => {
  const { api } = loadApi();
  const wf = {
    product: "situated_task",
    workflowBriefResolution: {
      resolvedFactors: {
        topic: "Observe a practice",
        original_brief: "PURPOSE / FOCUS\nObserve a practice"
      }
    }
  };
  const brief = api.composeSituatedTaskOriginalBrief(wf);
  assert.match(brief, /Observe a practice/);
  assert.doesNotMatch(brief, /COMMISSION SPECIFICATION/);
  assert.doesNotMatch(brief, /EDUCATIONAL DEPENDENCIES/);
});

test("Learning Journey retains its distinct original brief", () => {
  const { api } = loadApi();
  const wf = {
    product: "learning_journey",
    steps: [{ title: "Requirements", canonical_step_id: "step_journey_requirements" }],
    workflowBriefResolution: {
      resolvedFactors: {
        topic: "Credibility judgements",
        learning_time: "4 hours",
        duration: "two weeks",
        original_brief: "PURPOSE / FOCUS\nCredibility judgements\n\nLEARNING TIME\n4 hours"
      }
    }
  };
  const resolved = api.resolveStepPromptText(wf.steps[0], wf);
  assert.ok(resolved && resolved.text);
  assert.match(resolved.text, /PURPOSE \/ FOCUS/);
  assert.match(resolved.text, /Credibility judgements/);
  assert.match(resolved.text, /You are establishing the learning requirements for a Learning Journey/);
  assertAbsent(resolved.text, "COMMISSION SPECIFICATION");
  assertAbsent(resolved.text, "LEARNING JOURNEY CONTEXT");
});

test("ORIGINAL_BRIEF token path does not prepend a second authoritative brief", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "interactive", "Compare study-provision options");
  const step = withOverride(
    findStep(wf, "Generate Learning Content"),
    "{{ORIGINAL_BRIEF}}\n\n" + CORE_GLC
  );
  const resolved = api.resolveStepPromptText(step, wf);
  assertOnce(resolved.text, "COMMISSION SPECIFICATION");
  assertOnce(resolved.text, "LEARNING JOURNEY CONTEXT");
  assert.match(resolved.text, /teaching-ready learning_content/);
  assert.doesNotMatch(resolved.text, /\{\{\s*ORIGINAL_BRIEF\s*\}\}/);
  assert.equal(step.override_prompt_body, "{{ORIGINAL_BRIEF}}\n\n" + CORE_GLC);
});

test("family topology and Assessment Pack prefix promptBody remain unchanged", () => {
  const interactive = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "self_study_resource",
    focus: "Bayes",
    startingArtefact: "generate_from_topic"
  });
  assert.deepEqual(interactive.titles, family.INTERACTIVE_TITLES.slice());
  assert.equal(interactive.deliverySeed.commission_specification, undefined);

  const assessment = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Formative check",
    startingPoint: "topic"
  });
  assert.equal(assessment.titles[0], "Generate Learning Content");
  assert.equal(assessment.steps[0].promptBody, undefined);
  assert.equal(assessment.titles[3], "Interpret Evidence Purpose");
  assert.match(assessment.steps[3].promptBody, /interpreting the evidence purpose/i);
  assert.doesNotMatch(assessment.steps[3].promptBody, /COMMISSION SPECIFICATION/);

  const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert.match(appSource, /function composeCommissionedOriginalBrief/);
  assert.match(appSource, /function applyCommissionedOriginalBriefDelivery/);
  assert.doesNotMatch(appSource, /e50c39b5-0c33-4869-bf5a-4fc2cef07c70/);
});
