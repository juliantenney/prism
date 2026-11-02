/**
 * Sprint 94 WP4 — honour the labelled commission brief as authoritative educational context.
 *
 * WP3 already delivers COMMISSION SPECIFICATION / LEARNING JOURNEY CONTEXT /
 * EDUCATIONAL DEPENDENCIES. This suite proves eligible commissioned stages also
 * receive one shared honour instruction, without rewriting stored stage prompts.
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
const NO_SCENARIO_JOURNEY =
  "There is no recurring scenario. Each activity is independent of any shared setting or named options.";

const CORE_GLC = "Generate or extend teaching-ready learning_content from topic, audience, and level.";
const CORE_MK = "Model the conceptual knowledge contained in this content as knowledge_model.";
const CORE_DLO = "Generate clear, observable learning outcomes from the knowledge model.";
const CORE_NORMALIZE = "Transform the provided content into clean normalized_content.";
const CORE_PURPOSE = "You are interpreting the evidence purpose of an Assessment Pack.";
const CORE_EP = "Deterministic episode-plan step. Do not invent pedagogy here.";

const HONOUR_HEADING = "AUTHORITATIVE COMMISSION CONTEXT";

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

function assertHonourContract(text) {
  const body = String(text || "");
  assertOnce(body, HONOUR_HEADING);
  assert.match(body, /Do not silently replace established scenario facts or substitute different options/);
  assert.match(body, /named alternatives or options/);
  assert.match(body, /New evidence, developments, and perspectives are permitted/);
  assert.match(body, /New evidence may challenge earlier judgements/);
  assert.match(
    body,
    /Where the context explicitly states that there is no recurring scenario, do not invent one/
  );
  assert.match(body, /do not prove that learners completed those activities/);
  assert.match(body, /what individual learners answered/);
  assert.match(body, /ask learners to consult their own earlier work/);
  assert.match(body, /Do not imply that PRISM automatically transfers learner responses/);
  assert.match(body, /Do not claim that earlier published resources have been inspected/);
  assert.match(body, /Do not discard relevant evidence merely because it challenges an earlier judgement/);
  assert.match(body, /Do not silently rewrite evidence to make it agree with an established scenario/);
  assertNoTransferOrInspection(body);
}

function assertBriefThenHonourThenTask(text, stageNeedle) {
  const body = String(text || "");
  const briefAt = body.indexOf("COMMISSION SPECIFICATION");
  const honourAt = body.indexOf(HONOUR_HEADING);
  const taskAt = body.indexOf(stageNeedle);
  assert.ok(briefAt >= 0, "labelled brief missing");
  assert.ok(honourAt > briefAt, "honour instruction must follow the labelled brief");
  assert.ok(taskAt > honourAt, "stage task must follow the honour instruction");
}

function withOverride(step, body, extra) {
  return Object.assign({}, step, extra || {}, {
    id: (step && step.id) || "step",
    prompt_source_type: "local_override",
    override_prompt_body: String(body || "")
  });
}

function commissionedWorkflow(api, productId, focus, extraSteps, journeyContext) {
  const journey = journeyContext == null ? JOURNEY : journeyContext;
  const result = intake.intakeCommission({
    productId: productId,
    specificationText: SPEC,
    journeyContextText: journey,
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
        journeyContextText: journey,
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

test("shared honour instruction states the educational contract; Assessment Pack clarification is pack-only", () => {
  const { api } = loadApi();
  const interactive = commissionedWorkflow(api, "interactive", "Compare study-provision options").wf;
  const assessment = commissionedWorkflow(api, "assessment_pack", "Check the study-provision judgement").wf;

  assert.equal(typeof api.composeCommissionedContextHonourInstruction, "function");
  const interactiveHonour = api.composeCommissionedContextHonourInstruction(interactive);
  const assessmentHonour = api.composeCommissionedContextHonourInstruction(assessment);

  assertHonourContract(interactiveHonour);
  assertHonourContract(assessmentHonour);
  assert.doesNotMatch(interactiveHonour, /Assessment Pack clarification/);
  assert.doesNotMatch(interactiveHonour, /Grounding context remains this pack's topic/);
  assert.match(assessmentHonour, /Assessment Pack clarification/);
  assert.match(assessmentHonour, /LEARNING JOURNEY CONTEXT is authoritative/);
  assert.match(assessmentHonour, /Grounding context remains this pack's topic or focus/);
  assert.match(assessmentHonour, /learner_context\.depends_on_prior_work/);
  assert.match(assessmentHonour, /learner_context\.bring_forward/);
  assert.match(assessmentHonour, /derive those values from the authoritative commission context/);
});

test("commissioned Interactive earliest stages receive labelled brief and honour instruction", () => {
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

  [
    [glc, "teaching-ready learning_content"],
    [mk, "knowledge_model"],
    [dlo, "observable learning outcomes"],
    [normalize, "normalized_content"]
  ].forEach(function (row) {
    const resolved = row[0];
    assert.ok(resolved && resolved.text);
    assertOnce(resolved.text, "COMMISSION SPECIFICATION");
    assertOnce(resolved.text, "LEARNING JOURNEY CONTEXT");
    assertOnce(resolved.text, "EDUCATIONAL DEPENDENCIES (prior experience handoff)");
    assertHonourContract(resolved.text);
    assert.match(resolved.text, /longer library opening hours/i);
    assert.match(resolved.text, /additional study spaces/i);
    assert.match(resolved.text, /improved online support/i);
    assert.doesNotMatch(resolved.text, /Assessment Pack clarification/);
    assertBriefThenHonourThenTask(resolved.text, row[1]);
  });
  assertAbsent(ep.text, "COMMISSION SPECIFICATION");
  assertAbsent(ep.text, HONOUR_HEADING);

  const glcStep = withOverride(findStep(wf, "Generate Learning Content"), CORE_GLC);
  const before = glcStep.override_prompt_body;
  api.resolveStepPromptText(glcStep, wf);
  assert.equal(glcStep.override_prompt_body, before);
  assert.equal(result.family.deliverySeed.commission_specification, SPEC);
});

test("commissioned Expository GLC, MK, and DLO receive labelled brief and honour instruction", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "expository", "Explain the study-provision choice");
  const glc = api.resolveStepPromptText(findStep(wf, "Generate Learning Content"), wf);
  const mk = resolveTitled(api, wf, "Model Knowledge", CORE_MK);
  const dlo = api.resolveStepPromptText(findStep(wf, "Define Learning Outcomes"), wf);
  const dp = api.resolveStepPromptText(findStep(wf, "Design Page"), wf);

  [
    ["Generate Learning Content", glc, "explanatory richness spine"],
    ["Model Knowledge", mk, "knowledge_model"],
    ["Define Learning Outcomes", dlo, "learning outcomes"]
  ].forEach(function (row) {
    const resolved = row[1];
    assert.ok(resolved && resolved.text, row[0] + " prompt was empty: " + JSON.stringify(resolved));
    assertOnce(resolved.text, "COMMISSION SPECIFICATION");
    assertOnce(resolved.text, HONOUR_HEADING);
    assertHonourContract(resolved.text);
    assert.match(resolved.text, /additional study spaces/i);
    assert.doesNotMatch(resolved.text, /Assessment Pack clarification/);
    assertBriefThenHonourThenTask(resolved.text, row[2]);
  });
  assert.match(glc.text, /explanatory richness spine/i);
  assertAbsent(dp.text, "COMMISSION SPECIFICATION");
  assertAbsent(dp.text, HONOUR_HEADING);
});

test("commissioned Assessment Pack prefix stages and Interpret Evidence Purpose honour the brief", () => {
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
    assertOnce(resolved.text, HONOUR_HEADING);
    assertHonourContract(resolved.text);
    assert.match(resolved.text, /Assessment Pack clarification/);
    assert.match(resolved.text, /LEARNING JOURNEY CONTEXT is authoritative/);
    assert.match(resolved.text, /initial judgement/i);
    assert.match(resolved.text, /derive those values from the authoritative commission context/);
  });
  assert.match(purpose.text, /interpreting the evidence purpose/i);
  assert.match(purpose.text, /Bind commissioning/);
  assert.match(purpose.text, /Grounding context:/);
  assert.match(purpose.text, /learner_context\.depends_on_prior_work/);
  assert.match(purpose.text, /learner_context\.bring_forward/);
  assertAbsent(design.text, "COMMISSION SPECIFICATION");
  assertAbsent(design.text, HONOUR_HEADING);

  const storedPurpose = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Formative check",
    startingPoint: "topic"
  }).steps[3].promptBody;
  assert.match(storedPurpose, /Bind commissioning/);
  assert.match(storedPurpose, /Grounding context:/);
  assert.doesNotMatch(storedPurpose, /AUTHORITATIVE COMMISSION CONTEXT/);
  assert.doesNotMatch(storedPurpose, /COMMISSION SPECIFICATION/);
});

test("no recurring scenario is honoured without inventing one", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(
    api,
    "interactive",
    "Independent check",
    null,
    NO_SCENARIO_JOURNEY
  );
  const glc = resolveTitled(api, wf, "Generate Learning Content", CORE_GLC);
  assert.match(glc.text, /There is no recurring scenario/);
  assert.match(
    glc.text,
    /Where the context explicitly states that there is no recurring scenario, do not invent one/
  );
  assertHonourContract(glc.text);
});

test("standalone Interactive, Expository, and Assessment Pack prompts remain unchanged", () => {
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
  assertAbsent(interactiveGlc.text, HONOUR_HEADING);
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
  assertAbsent(expoGlc.text, HONOUR_HEADING);
  assert.match(expoGlc.text, /explanatory richness spine/i);

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
  assertAbsent(apPurpose.text, HONOUR_HEADING);
  assert.match(apPurpose.text, /Bind commissioning/);
  assert.match(apPurpose.text, /Grounding context:/);
});

test("Situated Task Situation keeps existing handoff instructions without a WP4 honour block", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "situated_task", "Workplace Investigation");
  const situation = api.resolveStepPromptText(findStep(wf, "Situation"), wf);
  assert.ok(situation && situation.text);
  assertOnce(situation.text, "COMMISSION SPECIFICATION");
  assertOnce(situation.text, "LEARNING JOURNEY CONTEXT");
  assert.match(situation.text, /when this Situated Task was commissioned/);
  assert.match(situation.text, /You are establishing the Situation for a Situated Task/);
  assertAbsent(situation.text, HONOUR_HEADING);
  assert.doesNotMatch(situation.text, /Assessment Pack clarification/);
  assertNoTransferOrInspection(situation.text);
});

test("Learning Journey Requirements retains its distinct brief without a WP4 honour block", () => {
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
  assertAbsent(resolved.text, HONOUR_HEADING);
});

test("token-based commissioned prompt contains one labelled brief and one honour instruction", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "interactive", "Compare study-provision options");
  const template = "{{ORIGINAL_BRIEF}}\n\n" + CORE_GLC;
  const step = withOverride(findStep(wf, "Generate Learning Content"), template);
  const resolved = api.resolveStepPromptText(step, wf);
  assertOnce(resolved.text, "COMMISSION SPECIFICATION");
  assertOnce(resolved.text, "LEARNING JOURNEY CONTEXT");
  assertOnce(resolved.text, HONOUR_HEADING);
  assertHonourContract(resolved.text);
  assertBriefThenHonourThenTask(resolved.text, "teaching-ready learning_content");
  assert.doesNotMatch(resolved.text, /\{\{\s*ORIGINAL_BRIEF\s*\}\}/);
  assert.equal(step.override_prompt_body, template);
});

test("WP3 delivery remains idempotent and stored family / catalog prompt bodies are unchanged", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "interactive", "Compare study-provision options");
  const template = "{{ORIGINAL_BRIEF}}\n\n" + CORE_GLC;
  const step = withOverride(findStep(wf, "Generate Learning Content"), template);
  const first = api.resolveStepPromptText(step, wf).text;
  const second = api.resolveStepPromptText(step, wf).text;
  assert.equal(first, second);
  assertOnce(first, "COMMISSION SPECIFICATION");
  assertOnce(first, HONOUR_HEADING);

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
  assert.equal(assessment.steps[0].promptBody, undefined);
  assert.doesNotMatch(assessment.steps[3].promptBody, /AUTHORITATIVE COMMISSION CONTEXT/);
  assert.match(assessment.steps[3].promptBody, /Bind commissioning/);
  assert.match(assessment.steps[3].promptBody, /Grounding context:/);

  const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert.match(appSource, /function composeCommissionedContextHonourInstruction/);
  assert.match(appSource, /function applyCommissionedOriginalBriefDelivery/);
  assert.doesNotMatch(appSource, /e50c39b5-0c33-4869-bf5a-4fc2cef07c70/);

  const catalog = fs.readFileSync(
    path.join(__dirname, "..", "domains", "learning-design", "domain-learning-design-step-patterns.md"),
    "utf8"
  );
  const expositorySibling = fs.readFileSync(
    path.join(__dirname, "..", "lib", "expository-sibling-prompts.js"),
    "utf8"
  );
  const familySource = fs.readFileSync(
    path.join(__dirname, "..", "lib", "first-class-workflow-family.js"),
    "utf8"
  );
  [catalog, expositorySibling, familySource].forEach(function (source) {
    assert.doesNotMatch(source, /AUTHORITATIVE COMMISSION CONTEXT/);
  });
});
