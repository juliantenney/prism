/**
 * Sprint 94 WP5 — learner-facing bring-forward at copy-owning stages.
 *
 * WP3/WP4 deliver the labelled brief and educational honour instruction to
 * earliest content-generating stages. This suite proves commissioned
 * Interactive Design Learning Activities, Expository Development, and
 * Assessment Pack Interpret Evidence Purpose also receive one shared
 * learner-facing bring-forward instruction, without rewriting stored prompts.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const intake = require("../lib/first-class-commission-intake.js");
const family = require("../lib/first-class-workflow-family.js");
const design = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const SPEC_REUSE =
  "Educational job: Reconsider the study-provision choice using new evidence.";
const JOURNEY_REUSE =
  "Established scenario: learners choose among longer library opening hours, additional study spaces, and improved online support. Earlier they recorded an initial judgement. Bring forward that learner-owned initial judgement and use it when weighing the new evidence.";
const DEPS_REUSE =
  "Requires c1. Bring forward the learner's own initial judgement from the opening Interactive.";

const SPEC_SCENARIO_ONLY =
  "Educational job: Explain the three study-provision options already established.";
const JOURNEY_SCENARIO_ONLY =
  "Established scenario: learners choose among longer library opening hours, additional study spaces, and improved online support.";
const DEPS_POINTER_ONLY = "Requires c1.";

const SPEC_FIRST = "Educational job: Make an initial judgement among the three study-provision options.";
const JOURNEY_FIRST =
  "This is the first experience. Learners make an initial judgement among longer library opening hours, additional study spaces, and improved online support.";

const SPEC_NO_SCENARIO_REUSE =
  "Educational job: Write an analysis that uses the learner's earlier critique notes.";
const JOURNEY_NO_SCENARIO_REUSE =
  "There is no recurring scenario. Each activity is independent of any shared setting or named options. Learners should bring forward their own notes from the earlier critique activity and use them when writing this analysis.";
const DEPS_NO_SCENARIO_REUSE =
  "Requires c1. Bring forward the learner's own critique notes from the earlier activity.";

const CORE_DLA =
  "Populate executable learning_activities. Each activity MUST include activity_preamble.";
const CORE_PURPOSE = "You are interpreting the evidence purpose of an Assessment Pack.";
const CORE_GLC = "Generate or extend teaching-ready learning_content from topic, audience, and level.";

const HONOUR_HEADING = "AUTHORITATIVE COMMISSION CONTEXT";
const WP5_HEADING = "LEARNER-FACING BRING-FORWARD";

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

function assertBringForwardContract(text) {
  const body = String(text || "");
  assertOnce(body, WP5_HEADING);
  assert.match(body, /only when the commission explicitly requires learners to reuse their own earlier work/);
  assert.match(body, /Identify the relevant earlier learner activity/);
  assert.match(body, /consult or retrieve from their own work/);
  assert.match(body, /how that work informs the current activity/);
  assert.match(body, /Avoid assuming that learners completed the earlier activity/);
  assert.match(body, /If you completed the earlier activity, revisit/);
  assert.match(body, /Avoid implying that PRISM automatically transfers learner responses/);
  assert.match(body, /Refer only to educationally relevant predecessors/);
  assert.match(body, /Appear once in this product's existing learner-facing structure/);
  assert.match(body, /Do not infer a bring-forward requirement from shared scenario facts, journey position, or dependency identifiers alone/);
  assert.match(body, /A shared scenario is not automatically a bring-forward requirement/);
  assert.match(body, /A journey that explicitly has no recurring scenario may still require bring-forward/);
  assert.match(body, /Where the commission does not require learner-owned reuse, do not invent a bring-forward instruction/);
  assertNoTransferOrInspection(body);
}

function assertBriefHonourBringForwardThenTask(text, stageNeedle) {
  const body = String(text || "");
  const briefAt = body.indexOf("COMMISSION SPECIFICATION");
  const honourAt = body.indexOf(HONOUR_HEADING);
  const wp5At = body.indexOf(WP5_HEADING);
  const taskAt = body.indexOf(stageNeedle);
  assert.ok(briefAt >= 0, "labelled brief missing");
  assert.ok(honourAt > briefAt, "honour instruction must follow the labelled brief");
  assert.ok(wp5At > honourAt, "bring-forward instruction must follow the honour instruction");
  assert.ok(taskAt > wp5At, "stage task must follow the bring-forward instruction");
  assertOnce(body, "COMMISSION SPECIFICATION");
  assertOnce(body, HONOUR_HEADING);
  assertOnce(body, WP5_HEADING);
}

function withOverride(step, body, extra) {
  return Object.assign({}, step, extra || {}, {
    id: (step && step.id) || "step",
    prompt_source_type: "local_override",
    override_prompt_body: String(body || "")
  });
}

function commissionedWorkflow(api, productId, focus, texts) {
  const spec = texts && texts.spec != null ? texts.spec : SPEC_REUSE;
  const journey = texts && texts.journey != null ? texts.journey : JOURNEY_REUSE;
  const deps = texts && texts.deps != null ? texts.deps : DEPS_REUSE;
  const result = intake.intakeCommission({
    productId: productId,
    specificationText: spec,
    journeyContextText: journey,
    dependencies: deps,
    sourceJourneyWorkflowId: "wf-lj",
    sourceCommissionId: texts && texts.commissionId ? texts.commissionId : "c2",
    focus: focus
  });
  assert.equal(result.ok, true, result.code || "");
  const steps = (result.family.steps || []).map(function (row, i) {
    return Object.assign({}, row, { id: "s" + i });
  });
  const wf = {
    id: "wf-c2-" + productId + "-" + String((texts && texts.tag) || "reuse"),
    product: productId,
    sourceWorkflowId: "wf-lj",
    sourceCommissionId: texts && texts.commissionId ? texts.commissionId : "c2",
    steps: steps,
    workflowBriefResolution: {
      resolvedFactors: Object.assign({}, result.family.deliverySeed, { topic: focus }),
      initialBrief: {
        topic: focus,
        commissionSpecification: spec,
        journeyContextText: journey,
        dependencies: deps,
        commissionDependencies: deps
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

test("shared WP5 instruction states the learner-facing contract and product placement", () => {
  const { api } = loadApi();
  const interactive = commissionedWorkflow(api, "interactive", "Compare study-provision options").wf;
  const expository = commissionedWorkflow(api, "expository", "Explain the study-provision choice").wf;
  const assessment = commissionedWorkflow(api, "assessment_pack", "Check the study-provision judgement").wf;

  assert.equal(typeof api.composeCommissionedLearnerFacingBringForwardInstruction, "function");
  const interactiveText = api.composeCommissionedLearnerFacingBringForwardInstruction(interactive);
  const expositoryText = api.composeCommissionedLearnerFacingBringForwardInstruction(expository);
  const assessmentText = api.composeCommissionedLearnerFacingBringForwardInstruction(assessment);

  [interactiveText, expositoryText, assessmentText].forEach(assertBringForwardContract);
  assert.match(interactiveText, /first relevant activity's existing activity_preamble/);
  assert.doesNotMatch(interactiveText, /learner_context\.bring_forward/);
  assert.doesNotMatch(interactiveText, /opening section's existing exposition/);
  assert.match(expositoryText, /opening section's existing exposition/);
  assert.doesNotMatch(expositoryText, /activity_preamble/);
  assert.match(assessmentText, /learner_context\.bring_forward/);
  assert.match(assessmentText, /Do not duplicate this copy in Design Page exposition/);
  assert.match(assessmentText, /Do not populate bring_forward from dependency identifiers alone/);
});

test("commissioned Interactive Design Learning Activities receives brief, honour, and WP5 instruction", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "interactive", "Compare study-provision options");
  const dlaStep = findStep(wf, "Design Learning Activities");
  assert.ok(dlaStep, "missing Design Learning Activities");
  const live = withOverride(dlaStep, CORE_DLA, {
    canonical_step_id: "step_design_learning_activities"
  });
  const resolved = api.resolveStepPromptText(live, wf);
  assert.ok(resolved && resolved.text);
  assertBringForwardContract(resolved.text);
  assertBriefHonourBringForwardThenTask(resolved.text, "activity_preamble");
  assert.match(resolved.text, /first relevant activity's existing activity_preamble/);
  assert.match(resolved.text, /initial judgement/i);
  assert.match(resolved.text, /Do not add an overview banner/);
  assert.match(resolved.text, /Do not require an overview field/);
  const before = live.override_prompt_body;
  api.resolveStepPromptText(live, wf);
  assert.equal(live.override_prompt_body, before);

  const glc = resolveTitled(api, wf, "Generate Learning Content", CORE_GLC);
  assertOnce(glc.text, HONOUR_HEADING);
  assertAbsent(glc.text, WP5_HEADING);
  assertAbsent(api.resolveStepPromptText(findStep(wf, "Design Page"), wf).text, WP5_HEADING);
});

test("commissioned Expository Development receives brief, honour, and WP5 instruction", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "expository", "Explain the study-provision choice");
  const xd = api.resolveStepPromptText(findStep(wf, "Expository Development"), wf);
  assert.ok(xd && xd.text, "Expository Development prompt was empty: " + JSON.stringify(xd));
  assertBringForwardContract(xd.text);
  assertBriefHonourBringForwardThenTask(xd.text, "explanation_intent vs exposition");
  assert.match(xd.text, /opening section's existing exposition/);
  assert.match(xd.text, /Do not treat within-chapter continuity_hooks as cross-component dependencies/);
  assert.match(xd.text, /initial judgement/i);

  const dp = api.resolveStepPromptText(findStep(wf, "Design Page"), wf);
  assertAbsent(dp.text, WP5_HEADING);
  assertAbsent(dp.text, "COMMISSION SPECIFICATION");
  const glc = api.resolveStepPromptText(findStep(wf, "Generate Learning Content"), wf);
  assertAbsent(glc.text, WP5_HEADING);
  assertOnce(glc.text, HONOUR_HEADING);
});

test("commissioned Assessment Pack Interpret Evidence Purpose receives WP5 without duplicating WP3/WP4 context", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "assessment_pack", "Check the study-provision judgement");
  const purposeStep = findStep(wf, "Interpret Evidence Purpose");
  const purpose = api.resolveStepPromptText(
    withOverride(purposeStep, purposeStep.promptBody || CORE_PURPOSE),
    wf
  );
  assert.ok(purpose && purpose.text);
  assertBringForwardContract(purpose.text);
  assertBriefHonourBringForwardThenTask(purpose.text, "interpreting the evidence purpose");
  assertOnce(purpose.text, "COMMISSION SPECIFICATION");
  assertOnce(purpose.text, "LEARNING JOURNEY CONTEXT");
  assertOnce(purpose.text, HONOUR_HEADING);
  assertOnce(purpose.text, WP5_HEADING);
  assert.match(purpose.text, /Bind commissioning/);
  assert.match(purpose.text, /Grounding context:/);
  assert.match(purpose.text, /learner_context\.bring_forward/);
  assert.match(purpose.text, /what identifies the learner-owned earlier work/);
  assert.match(purpose.text, /how_used explains its role in the current assessment/);
  assert.doesNotMatch(purpose.text, /Do not duplicate this copy in Design Page exposition[\s\S]*Do not duplicate this copy in Design Page exposition/);

  const designPage = api.resolveStepPromptText(
    withOverride(findStep(wf, "Design Page"), "Synthesise the Assessment Pack Design Page."),
    wf
  );
  assertAbsent(designPage.text, WP5_HEADING);
  assertAbsent(designPage.text, "COMMISSION SPECIFICATION");
});

test("scenario continuity or dependency pointers without reuse still forbid invented bring-forward", () => {
  const { api } = loadApi();
  const scenario = commissionedWorkflow(api, "interactive", "Explain the options", {
    spec: SPEC_SCENARIO_ONLY,
    journey: JOURNEY_SCENARIO_ONLY,
    deps: "",
    tag: "scenario-only"
  });
  const scenarioDla = api.resolveStepPromptText(
    withOverride(findStep(scenario.wf, "Design Learning Activities"), CORE_DLA, {
      canonical_step_id: "step_design_learning_activities"
    }),
    scenario.wf
  );
  assertBringForwardContract(scenarioDla.text);
  assert.match(scenarioDla.text, /A shared scenario is not automatically a bring-forward requirement/);
  assert.doesNotMatch(scenarioDla.text, /Bring forward the learner's own initial judgement/);

  const depsOnly = commissionedWorkflow(api, "interactive", "Explain the options", {
    spec: SPEC_SCENARIO_ONLY,
    journey: JOURNEY_SCENARIO_ONLY,
    deps: DEPS_POINTER_ONLY,
    tag: "deps-only"
  });
  const depsDla = api.resolveStepPromptText(
    withOverride(findStep(depsOnly.wf, "Design Learning Activities"), CORE_DLA, {
      canonical_step_id: "step_design_learning_activities"
    }),
    depsOnly.wf
  );
  assertBringForwardContract(depsDla.text);
  assert.match(depsDla.text, /dependency identifiers alone/);
  assert.match(depsDla.text, /Requires c1/);
  assert.doesNotMatch(depsDla.text, /Bring forward the learner's own initial judgement/);
});

test("no-recurring-scenario journeys still allow genuine learner-work reuse", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "expository", "Independent critique analysis", {
    spec: SPEC_NO_SCENARIO_REUSE,
    journey: JOURNEY_NO_SCENARIO_REUSE,
    deps: DEPS_NO_SCENARIO_REUSE,
    tag: "no-scenario-reuse"
  });
  const xd = api.resolveStepPromptText(findStep(wf, "Expository Development"), wf);
  assertBringForwardContract(xd.text);
  assert.match(xd.text, /There is no recurring scenario/);
  assert.match(xd.text, /critique notes/);
  assert.match(xd.text, /A journey that explicitly has no recurring scenario may still require bring-forward/);
  assert.match(
    xd.text,
    /Where the context explicitly states that there is no recurring scenario, do not invent one/
  );
});

test("first component with no preceding work does not invent bring-forward", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "interactive", "Make an initial judgement", {
    spec: SPEC_FIRST,
    journey: JOURNEY_FIRST,
    deps: "",
    commissionId: "c1",
    tag: "first"
  });
  const dla = api.resolveStepPromptText(
    withOverride(findStep(wf, "Design Learning Activities"), CORE_DLA, {
      canonical_step_id: "step_design_learning_activities"
    }),
    wf
  );
  assertBringForwardContract(dla.text);
  assert.match(dla.text, /Where the commission does not require learner-owned reuse, do not invent a bring-forward instruction/);
  assert.match(dla.text, /This is the first experience/);
  assert.doesNotMatch(dla.text, /Bring forward the learner's own initial judgement/);
});

test("standalone Interactive, Expository, and Assessment Pack omit the WP5 instruction", () => {
  const { api } = loadApi();
  const interactive = standaloneWorkflow(api, "interactive", "Bayes theorem", [
    {
      title: "Design Learning Activities",
      canonical_step_id: "step_design_learning_activities"
    }
  ]);
  const interactiveDla = resolveTitled(api, interactive, "Design Learning Activities", CORE_DLA);
  assertAbsent(interactiveDla.text, WP5_HEADING);
  assertAbsent(interactiveDla.text, "COMMISSION SPECIFICATION");
  assertAbsent(interactiveDla.text, HONOUR_HEADING);
  assert.match(interactiveDla.text, /activity_preamble/);

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
  const xd = api.resolveStepPromptText(findStep(expository, "Expository Development"), expository);
  assertAbsent(xd.text, WP5_HEADING);
  assertAbsent(xd.text, "COMMISSION SPECIFICATION");

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
  assertAbsent(apPurpose.text, WP5_HEADING);
  assert.match(apPurpose.text, /Bind commissioning/);
  assert.match(apPurpose.text, /Grounding context:/);
});

test("Situated Task and Learning Journey retain existing handoff and exposition without a WP5 block", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "situated_task", "Workplace Investigation");
  const situation = api.resolveStepPromptText(findStep(wf, "Situation"), wf);
  assertOnce(situation.text, "COMMISSION SPECIFICATION");
  assert.match(situation.text, /when this Situated Task was commissioned/);
  assertAbsent(situation.text, WP5_HEADING);
  assertAbsent(situation.text, HONOUR_HEADING);

  const lj = {
    product: "learning_journey",
    steps: [{ title: "Requirements", canonical_step_id: "step_journey_requirements" }],
    workflowBriefResolution: {
      resolvedFactors: {
        topic: "Credibility judgements",
        original_brief: "PURPOSE / FOCUS\nCredibility judgements"
      }
    }
  };
  const requirements = api.resolveStepPromptText(lj.steps[0], lj);
  assert.match(requirements.text, /You are establishing the learning requirements for a Learning Journey/);
  assertAbsent(requirements.text, WP5_HEADING);
  assertAbsent(requirements.text, "COMMISSION SPECIFICATION");
});

test("WP3/WP4 delivery remains idempotent and stored prompt bodies are unchanged", () => {
  const { api } = loadApi();
  const { wf } = commissionedWorkflow(api, "interactive", "Compare study-provision options");
  const template = "{{ORIGINAL_BRIEF}}\n\n" + CORE_DLA;
  const step = withOverride(findStep(wf, "Design Learning Activities"), template, {
    canonical_step_id: "step_design_learning_activities"
  });
  const first = api.resolveStepPromptText(step, wf).text;
  const second = api.resolveStepPromptText(step, wf).text;
  assert.equal(first, second);
  assertOnce(first, "COMMISSION SPECIFICATION");
  assertOnce(first, HONOUR_HEADING);
  assertOnce(first, WP5_HEADING);
  assert.doesNotMatch(first, /\{\{\s*ORIGINAL_BRIEF\s*\}\}/);
  assert.equal(step.override_prompt_body, template);

  const assessment = family.buildFirstClassWorkflowFamily({
    ldCreateOutputType: "assessment_pack",
    focus: "Formative check",
    startingPoint: "topic"
  });
  assert.doesNotMatch(assessment.steps[3].promptBody, /LEARNER-FACING BRING-FORWARD/);
  assert.match(assessment.steps[3].promptBody, /Bind commissioning/);
  assert.match(assessment.steps[3].promptBody, /Grounding context:/);

  const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  assert.match(appSource, /function composeCommissionedLearnerFacingBringForwardInstruction/);
  assert.match(appSource, /function isCommissionLearnerFacingCopyStep/);
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
    assert.doesNotMatch(source, /LEARNER-FACING BRING-FORWARD/);
  });
});

test("learner home and ZIP remain free of raw commissioning metadata", () => {
  const fixture = design.buildLearningJourneyDesignPageFixture({
    title: "Learning Journey: Continuity capture"
  });
  assert.equal(fixture.ok, true);
  const page = JSON.parse(JSON.stringify(fixture.page));
  page.commissions[0].specification_text = "SECRET_SPEC_HOME_C1";
  page.commissions[1].journey_context_text = "SECRET_JOURNEY_CONTEXT_HOME";
  page.commissions[1].dependencies = "SECRET_DEPENDENCY_HOME";
  const home = ljPackage.buildLearningJourneyHomeHtml(page);
  assert.equal(home.ok, true);
  assert.doesNotMatch(home.html, /SECRET_SPEC_HOME_C1/);
  assert.doesNotMatch(home.html, /SECRET_JOURNEY_CONTEXT_HOME/);
  assert.doesNotMatch(home.html, /SECRET_DEPENDENCY_HOME/);
  assert.doesNotMatch(home.html, /COMMISSION SPECIFICATION/);
  assert.doesNotMatch(home.html, /LEARNER-FACING BRING-FORWARD/);
  assert.doesNotMatch(home.html, /Educational job/);
});
