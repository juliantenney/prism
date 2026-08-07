/**
 * Sprint 56C Wave 1 Phase 1 — augment-chain gate validation (Design Page).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

const MARX_SELF_STUDY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
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

const LD_BRIEF = MARX_SELF_STUDY_BRIEF;

function applyRuntimePrompt(baseDraft, stepId, stepTitle) {
  const step = {
    canonical_step_id: stepId,
    canonical_title: stepTitle,
    title: stepTitle
  };
  const wf = {
    goal: LD_BRIEF.goal,
    desiredOutputs: LD_BRIEF.desiredOutputs,
    pageEnrichmentV2: stepId === "step_design_page",
    partialPageOutputs: stepId === "step_design_page",
    workflowOutputSpec: { goal: LD_BRIEF.goal }
  };
  return api.applyWorkflowStepRuntimePromptAugmentations(baseDraft, step, wf);
}

function designPageAugmentedPrompt() {
  return applyRuntimePrompt(
    "Assemble learner page.\n",
    "step_design_page",
    "Design Page"
  ).trim();
}

function partialWorkflow(extra) {
  return Object.assign(
    {
      goal: LD_BRIEF.goal,
      desiredOutputs: LD_BRIEF.desiredOutputs,
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      workflowOutputSpec: { goal: LD_BRIEF.goal }
    },
    extra || {}
  );
}

function designPagePartialPrompt() {
  const step = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
  return api
    .applyWorkflowStepRuntimePromptAugmentations(
      "Assemble learner page.\n",
      step,
      partialWorkflow()
    )
    .trim();
}

test("56C W1 P1: Design Page partial prompt excludes Phase 1 gated ownership layers", () => {
  const prompt = designPagePartialPrompt();
  assert.doesNotMatch(prompt, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-JOURNEY-ASSIMILATION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /LD-AUTHORIAL-EXPOSITION-CONTRACT \(auto-applied\)/i);
  assert.doesNotMatch(prompt, /EDUCATIONAL-QUALITY-FRAMEWORK \(auto-applied\)/i);
  assert.match(prompt, /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i);
  assert.match(prompt, /sprint 38 visual affordance authoring contract \(auto-applied\)/i);
});

test("56C W1 P1: Design Page partial path retains partial contract", () => {
  const prompt = designPagePartialPrompt();
  assert.match(prompt, /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i);
  assert.match(prompt, /page_synthesis\.knowledge_summary is mandatory/i);
  assert.doesNotMatch(prompt, /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
});

test("56C W1 P1: GAM still receives rhetoric (non-DP path unchanged)", () => {
  const prompt = applyRuntimePrompt(
    "Generate materials.\n",
    "step_generate_activity_materials",
    "Generate Activity Materials"
  ).trim();
  assert.match(prompt, /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i);
});
