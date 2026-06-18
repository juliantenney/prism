/**
 * Sprint 49 — DLA Framing Gate v1 (workflow run-mode capture validation).
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
  return api.resolveWorkflowBriefFactors(ldBriefConfig, explicit, {}, inferred, brief)
    .resolved;
}

function marxDlaContext(resolved) {
  return {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
}

function marxGamContext(resolved) {
  const factors = Object.assign({}, resolved);
  factors.delivery_context = "self_directed";
  factors.session_materials = ["page"];
  return {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Generate Activity Materials",
    stepCanonicalStepId: "step_generate_activity_materials",
    workflowBriefResolution: { resolvedFactors: factors }
  };
}

function compliantMarxDlaCapture() {
  return {
    artifact_type: "learning_activities",
    title: "Marx self-study activities (compliant framing)",
    activities: [
      {
        activity_id: "A1",
        activity_preamble: "This timeline anchors Marx's life phases before deeper reading.",
        reasoning_orientation: "Separate dated facts from interpretive claims.",
        learner_task: "Complete the timeline table with four life phases and one idea per phase.",
        expected_output: "Completed timeline table."
      },
      {
        activity_id: "A2",
        activity_preamble: "Comparing major works clarifies how Marx's arguments evolved.",
        self_explanation_prompt: "Explain the audience difference between the two works.",
        learner_task: "Fill the comparison table with purpose and key difference for each work.",
        expected_output: "Filled comparison table."
      }
    ]
  };
}

function applyDlaCapture(raw, ctx, stepId) {
  return api.applyLearnerPageDlaFramingValidationToCapture(
    typeof raw === "string" ? raw : JSON.stringify(raw, null, 2),
    ctx,
    stepId
  );
}

test("scope: learner-page DLA context runs framing validation on capture", () => {
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxDlaContext(resolved);
  assert.equal(api.isWorkflowStepDesignLearningActivities(ctx), true);
  assert.equal(api.shouldApplyLearnerPagePedagogicFramingScaffold(ctx, resolved, {
    goal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs
  }), true);
});

test("compliant learner-page DLA passes capture validation", () => {
  api.setWorkflowRunCapturedOutputsForTest({});
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxDlaContext(resolved);
  applyDlaCapture(compliantMarxDlaCapture(), ctx, "dla-step");
  assert.equal(api.getWorkflowRunLearnerPageFramingValidationForTest("dla-step"), "");
  assert.equal(api.getWorkflowRunLearnerPageFramingGateBlockForTest("dla-step"), "");
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest("dla-step"), true);
});

test("missing cognition field fails mandatory framing", () => {
  api.setWorkflowRunCapturedOutputsForTest({});
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxDlaContext(resolved);
  const capture = {
    artifact_type: "learning_activities",
    activities: [
      {
        activity_id: "A1",
        activity_preamble: "Why this activity matters.",
        learner_task: "Do the task.",
        expected_output: "Output."
      }
    ]
  };
  applyDlaCapture(capture, ctx, "dla-step");
  const msg = api.getWorkflowRunLearnerPageFramingValidationForTest("dla-step");
  assert.match(msg, /Learner-page framing required on every activity/i);
  assert.match(msg, /cognition_orientation_field/);
});

test("missing activity_preamble fails mandatory framing", () => {
  api.setWorkflowRunCapturedOutputsForTest({});
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxDlaContext(resolved);
  const capture = {
    artifact_type: "learning_activities",
    activities: [
      {
        activity_id: "A1",
        reasoning_orientation: "Orient before you judge.",
        learner_task: "Do the task.",
        expected_output: "Output."
      }
    ]
  };
  applyDlaCapture(capture, ctx, "dla-step");
  const msg = api.getWorkflowRunLearnerPageFramingValidationForTest("dla-step");
  assert.match(msg, /Learner-page framing required on every activity/i);
  assert.match(msg, /activity_preamble/);
});

test("next-step advancement blocked when framing validation fails", () => {
  api.setWorkflowRunCapturedOutputsForTest({});
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxDlaContext(resolved);
  const procedural = JSON.parse(fs.readFileSync(marxProceduralDlaPath, "utf8"));
  api.setWorkflowRunStepCompletedForTest({ "dla-step": true });
  applyDlaCapture(procedural, ctx, "dla-step");
  assert.equal(api.isWorkflowRunStepCompletedForTest("dla-step"), false);
  assert.match(api.getWorkflowRunLearnerPageFramingGateBlockForTest("dla-step"), /Learner-page framing/i);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest("dla-step"), false);
  assert.equal(api.isWorkflowRunStepCompletedForTest("dla-step"), false);
});

test("validation clears after compliant recapture", () => {
  api.setWorkflowRunCapturedOutputsForTest({});
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxDlaContext(resolved);
  const procedural = JSON.parse(fs.readFileSync(marxProceduralDlaPath, "utf8"));
  applyDlaCapture(procedural, ctx, "dla-step");
  assert.match(
    api.getWorkflowRunLearnerPageFramingValidationForTest("dla-step"),
    /Learner-page framing required/i
  );
  applyDlaCapture(compliantMarxDlaCapture(), ctx, "dla-step");
  assert.equal(api.getWorkflowRunLearnerPageFramingValidationForTest("dla-step"), "");
  assert.equal(api.getWorkflowRunLearnerPageFramingGateBlockForTest("dla-step"), "");
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest("dla-step"), true);
});

test("facilitator workflows are unaffected by learner-page framing gate", () => {
  api.setWorkflowRunCapturedOutputsForTest({});
  const resolved = resolveBrief(FACILITATOR_ONLY_BRIEF);
  const ctx = {
    workflowGoal: FACILITATOR_ONLY_BRIEF.goal,
    desiredOutputs: FACILITATOR_ONLY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const procedural = JSON.parse(fs.readFileSync(marxProceduralDlaPath, "utf8"));
  applyDlaCapture(procedural, ctx, "dla-step");
  assert.equal(api.getWorkflowRunLearnerPageFramingValidationForTest("dla-step"), "");
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest("dla-step"), true);
});

test("empty capture clears framing gate state", () => {
  api.setWorkflowRunCapturedOutputsForTest({});
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxDlaContext(resolved);
  const procedural = JSON.parse(fs.readFileSync(marxProceduralDlaPath, "utf8"));
  applyDlaCapture(procedural, ctx, "dla-step");
  assert.match(api.getWorkflowRunLearnerPageFramingValidationForTest("dla-step"), /Learner-page framing/i);
  applyDlaCapture("", ctx, "dla-step");
  assert.equal(api.getWorkflowRunLearnerPageFramingValidationForTest("dla-step"), "");
  assert.equal(api.getWorkflowRunLearnerPageFramingGateBlockForTest("dla-step"), "");
});

test("DLA pass plus GAM fail still triggers GAM gate on GAM step", () => {
  api.setWorkflowsForTest([
    {
      id: "wf-dla-gam-gate",
      steps: [
        {
          id: "dla-step",
          title: "Design Learning Activities",
          canonical_step_id: "step_design_learning_activities",
          outputName: "learning_activities"
        },
        {
          id: "gam-step",
          title: "Generate Activity Materials",
          canonical_step_id: "step_generate_activity_materials",
          outputName: "activity_materials"
        }
      ]
    }
  ]);
  api.setSelectedWorkflowIdForTest("wf-dla-gam-gate");
  api.setWorkflowRunCapturedOutputsForTest({
    "dla-step": JSON.stringify(compliantMarxDlaCapture(), null, 2)
  });
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const dlaCtx = marxDlaContext(resolved);
  const gamCtx = marxGamContext(resolved);
  applyDlaCapture(compliantMarxDlaCapture(), dlaCtx, "dla-step");
  assert.equal(api.getWorkflowRunLearnerPageFramingGateBlockForTest("dla-step"), "");
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest("dla-step"), true);
  const gamStub = JSON.stringify({ pack: { activities: [{ activity_id: "A1" }] } });
  api.applyGamPackTextValidationToCapture(gamStub, gamCtx, "gam-step", gamStub);
  assert.equal(api.getWorkflowRunLearnerPageFramingGateBlockForTest("gam-step"), "");
  assert.match(api.getWorkflowRunCaptureGatesBlockReasonForTest("gam-step"), /GAM-FMT-01/);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest("gam-step"), false);
});

test("marx procedural fixture fails mandatory framing gate", () => {
  api.setWorkflowRunCapturedOutputsForTest({});
  const resolved = resolveBrief(MARX_SELF_STUDY_BRIEF);
  const ctx = marxDlaContext(resolved);
  const procedural = JSON.parse(fs.readFileSync(marxProceduralDlaPath, "utf8"));
  applyDlaCapture(procedural, ctx, "dla-step");
  const msg = api.getWorkflowRunLearnerPageFramingValidationForTest("dla-step");
  assert.match(msg, /Learner-page framing required on every activity/i);
  assert.match(msg, /A1/);
  assert.match(msg, /A2/);
  assert.equal(api.tryCompleteWorkflowRunStepIfCaptureGatesPassForTest("dla-step"), false);
});
