/**
 * Sprint 48 Slice 2 — SP-02 / SP-03 instructional pattern GAM prompt augmentation.
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
const patternLib = require("../lib/instructional-pattern-prompt.js");

const SP02_MARKER = /INSTRUCTIONAL-PATTERN-SP-02 \(auto-applied\)/i;
const SP03_MARKER = /INSTRUCTIONAL-PATTERN-SP-03 \(auto-applied\)/i;

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

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  const fence = md.indexOf("```json", idx);
  const close = md.indexOf("```", fence + 7);
  return JSON.parse(md.slice(fence + 7, close).trim()).workflowBriefConfig;
}

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

function applyRuntimePrompt(baseDraft, stepId, stepTitle, brief) {
  const resolved = resolveBrief(brief);
  const factors = Object.assign({}, resolved);
  if (brief === MARX_SELF_STUDY_BRIEF) {
    factors.delivery_context = "self_directed";
    factors.session_materials = ["page"];
  }
  const step = {
    canonical_step_id: stepId,
    canonical_title: stepTitle,
    title: stepTitle
  };
  const wf = {
    goal: brief.goal,
    desiredOutputs: brief.desiredOutputs,
    workflowOutputSpec: { goal: brief.goal },
    workflowBriefResolution: { resolvedFactors: factors }
  };
  return api.applyWorkflowStepRuntimePromptAugmentations(baseDraft, step, wf);
}

function assertSp02Content(prompt) {
  assert.match(prompt, SP02_MARKER);
  assert.match(prompt, /SP-02 \/ DT-SP-01 partial-exemplar decision table/i);
  assert.match(prompt, /decision_table/i);
  assert.match(prompt, /partial exemplar row/i);
  assert.match(prompt, /Judgement.*empty on every row/i);
  assert.match(prompt, /FM-04/i);
}

function assertSp03Content(prompt) {
  assert.match(prompt, SP03_MARKER);
  assert.match(prompt, /SP-03 \/ TP-SP-01 capstone transfer prompt/i);
  assert.match(prompt, /transfer_prompt/i);
  assert.match(prompt, /learner-context selection/i);
  assert.match(prompt, /operational completion criterion/i);
  assert.match(prompt, /FM-02/i);
  assert.match(prompt, /FM-03/i);
}

test("48-2: lib exports SP-02 and SP-03 markers and apply helper", () => {
  assert.equal(patternLib.MODULE_ID, "INSTRUCTIONAL-PATTERN-PROMPT");
  assert.match(patternLib.MARKER_SP02, SP02_MARKER);
  assert.match(patternLib.MARKER_SP03, SP03_MARKER);
  const block = patternLib.buildInstructionalPatternPromptBlock();
  assertSp02Content(block);
  assertSp03Content(block);
});

test("48-2: self-directed learner-page GAM receives SP-02 and SP-03 markers", () => {
  const base = "Realise activity materials from upstream DLA.\n";
  const prompt = applyRuntimePrompt(
    base,
    "step_generate_activity_materials",
    "Generate Activity Materials",
    MARX_SELF_STUDY_BRIEF
  );
  assertSp02Content(prompt);
  assertSp03Content(prompt);
  assert.ok(prompt.length > base.length);
});

test("48-2: scope gate — facilitator brief excludes pattern markers on GAM", () => {
  const prompt = applyRuntimePrompt(
    "Realise activity materials.\n",
    "step_generate_activity_materials",
    "Generate Activity Materials",
    FACILITATOR_ONLY_BRIEF
  );
  assert.doesNotMatch(prompt, SP02_MARKER);
  assert.doesNotMatch(prompt, SP03_MARKER);
});

test("48-2: non-GAM step Design Learning Activities excludes pattern markers", () => {
  const prompt = applyRuntimePrompt(
    "Populate learning activities.\n",
    "step_design_learning_activities",
    "Design Learning Activities",
    MARX_SELF_STUDY_BRIEF
  );
  assert.doesNotMatch(prompt, SP02_MARKER);
  assert.doesNotMatch(prompt, SP03_MARKER);
});

test("48-2: non-GAM step Design Page excludes pattern markers", () => {
  const prompt = applyRuntimePrompt(
    "Assemble the learner page.\n",
    "step_design_page",
    "Design Page",
    MARX_SELF_STUDY_BRIEF
  );
  assert.doesNotMatch(prompt, SP02_MARKER);
  assert.doesNotMatch(prompt, SP03_MARKER);
});

test("48-2: pattern markers are not duplicated on second apply", () => {
  const ctx = {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalStepId: "step_generate_activity_materials",
    stepCanonicalTitle: "Generate Activity Materials",
    workflowBriefResolution: {
      resolvedFactors: Object.assign(resolveBrief(MARX_SELF_STUDY_BRIEF), {
        delivery_context: "self_directed",
        session_materials: ["page"]
      })
    }
  };
  const once = api.applyInstructionalPatternPromptBlockToDraft("Draft.\n", ctx);
  const twice = api.applyInstructionalPatternPromptBlockToDraft(once, ctx);
  assert.equal((twice.match(SP02_MARKER) || []).length, 1);
  assert.equal((twice.match(SP03_MARKER) || []).length, 1);
});

test("48-2: lib apply helper does not duplicate markers", () => {
  const once = patternLib.applyInstructionalPatternPromptBlockToDraft("Draft.\n", {});
  const twice = patternLib.applyInstructionalPatternPromptBlockToDraft(once, {});
  assert.equal((twice.match(SP02_MARKER) || []).length, 1);
  assert.equal((twice.match(SP03_MARKER) || []).length, 1);
});

test("48-2: resolveInstructionalPatternPromptLib exposes apply helper", () => {
  const lib = api.resolveInstructionalPatternPromptLib();
  assert.ok(lib);
  assert.equal(typeof lib.applyInstructionalPatternPromptBlockToDraft, "function");
  assert.equal(typeof lib.buildInstructionalPatternPromptBlock, "function");
});

test("48-2: GAM prompt delta is additive — DLA prompt unchanged for pattern markers", () => {
  const dlaBase = "Populate learning activities from episode plans.\n";
  const dlaPrompt = applyRuntimePrompt(
    dlaBase,
    "step_design_learning_activities",
    "Design Learning Activities",
    MARX_SELF_STUDY_BRIEF
  );
  const gamBase = "Realise activity materials.\n";
  const gamPrompt = applyRuntimePrompt(
    gamBase,
    "step_generate_activity_materials",
    "Generate Activity Materials",
    MARX_SELF_STUDY_BRIEF
  );
  assert.doesNotMatch(dlaPrompt, SP02_MARKER);
  assert.doesNotMatch(dlaPrompt, SP03_MARKER);
  assert.match(gamPrompt, SP02_MARKER);
  assert.match(gamPrompt, SP03_MARKER);
});
