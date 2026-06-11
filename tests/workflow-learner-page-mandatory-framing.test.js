/**
 * Sprint 41 Slice 5 finalisation — mandatory learner framing at DLA for learner pages.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);
const marxProceduralDlaPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "workflow-brief",
  "marx-dla-procedural-output.json"
);

const WORKSHOP_LEARNER_HANDOUT_BRIEF = {
  goal:
    "Using the uploaded lecture on climate change, create a misconception discussion workshop with task cards and small group discussion.",
  inputs: "Uploaded lecture transcript on climate change.",
  desiredOutputs: "Facilitator handout and learner handout",
  startingArtefact: "provided_source_content",
  selectedDomains: ["learning-design"]
};

const MARX_SELF_STUDY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
  selectedDomains: ["learning-design"]
};

const FACILITATOR_ONLY_BRIEF = {
  goal: "Design a 90-minute facilitated workshop on team communication for nursing students.",
  inputs: "Face-to-face classroom with tutor facilitation",
  desiredOutputs: "Facilitator guide and slide deck",
  selectedDomains: ["learning-design"]
};

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

const api = loadPrismTestApi();
const ldBriefConfig = api.normalizeWorkflowBriefConfig(
  extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"))
);

function resolveBrief(brief) {
  const explicit = api.extractWorkflowBriefExplicitFactors(brief);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    brief.goal,
    brief.inputs
  );
  return api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    brief
  ).resolved;
}

function dlaPromptForBrief(brief) {
  const resolved = resolveBrief(brief);
  const ctx = {
    workflowGoal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  return api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    api.applyPedagogicCognitionContractScaffoldToDraft("Design executable learning activities.\n", ctx),
    ctx
  );
}

test("41-5 final: workshop learner-page DLA prompt requires activity_preamble on every activity", () => {
  const prompt = dlaPromptForBrief(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  assert.match(prompt, /each activity object must include activity_preamble/i);
  assert.match(prompt, /why the activity matters/i);
  assert.match(prompt, /Mandatory per activity/i);
});

test("41-5 final: workshop learner-page DLA prompt requires cognition field on every activity", () => {
  const prompt = dlaPromptForBrief(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  assert.match(
    prompt,
    /each activity object must include at least one cognition-orientation field/i
  );
  assert.match(prompt, /reasoning_orientation, self_explanation_prompt, conceptual_contrast_prompt/i);
  assert.match(prompt, /Learner-page activity framing by archetype/i);
  assert.match(prompt, /Understanding activities:/i);
  assert.match(prompt, /Evaluation activities:/i);
});

test("41-5 final: self-study learner page receives same mandatory framing guarantees", () => {
  const workshopPrompt = dlaPromptForBrief(WORKSHOP_LEARNER_HANDOUT_BRIEF);
  const selfStudyPrompt = dlaPromptForBrief(MARX_SELF_STUDY_BRIEF);
  assert.match(selfStudyPrompt, /each activity object must include activity_preamble/i);
  assert.match(
    selfStudyPrompt,
    /each activity object must include at least one cognition-orientation field/i
  );
  assert.match(selfStudyPrompt, /do not emit learner-page activities with only title, learner_task/i);
  assert.match(workshopPrompt, /each activity object must include at least one cognition-orientation field/i);
});

test("41-5 final: facilitator-only outputs do not receive mandatory learner-page DLA framing", () => {
  const prompt = dlaPromptForBrief(FACILITATOR_ONLY_BRIEF);
  assert.doesNotMatch(prompt, /output contract \(learner-facing page/i);
  assert.doesNotMatch(prompt, /Mandatory per activity/i);
  assert.doesNotMatch(prompt, /Learner-page activity framing by archetype/i);
});

test("evaluateLearnerPageDlaActivityFramingCoverage: preamble-only row fails mandatory cognition", () => {
  const cov = api.evaluateLearnerPageDlaActivityFramingCoverage([
    {
      activity_id: "LO1",
      activity_preamble: "This builds foundational understanding.",
      learner_task: "Study the example.",
      expected_output: "Notes"
    }
  ]);
  assert.equal(cov.meetsPreambleCoverage, true);
  assert.equal(cov.meetsMandatoryCognitionCoverage, false);
  assert.equal(cov.meetsMandatoryFraming, false);
  assert.ok(cov.activityFailures[0].missing.includes("cognition_orientation_field"));
});

test("evaluateLearnerPageDlaActivityFramingCoverage: well-formed workshop activity passes", () => {
  const cov = api.evaluateLearnerPageDlaActivityFramingCoverage([
    {
      activity_id: "LO1",
      activity_preamble: "This activity builds your foundational understanding of climate mechanisms.",
      reasoning_orientation: "Separate weather anecdotes from climate trend evidence.",
      learner_task: "Study the explanation.",
      expected_output: "Annotated notes"
    }
  ]);
  assert.equal(cov.meetsMandatoryFraming, true);
});

test("applyLearnerPageDlaFramingValidationToCapture: procedural DLA fails for learner-page brief", () => {
  const procedural = JSON.parse(fs.readFileSync(marxProceduralDlaPath, "utf8"));
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  api.setWorkflowRunCapturedOutputsForTest({});
  const raw = JSON.stringify(procedural, null, 2);
  api.applyLearnerPageDlaFramingValidationToCapture(raw, ctx, "step-dla-test");
  assert.match(
    String(api.getWorkflowRunLearnerPageFramingValidationForTest("step-dla-test")),
    /Learner-page framing required on every activity/i
  );
});
