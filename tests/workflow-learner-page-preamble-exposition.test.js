/**
 * Sprint 42 Slice 42-3 — DLA activity_preamble authorial exposition contract.
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

const MARX_SELF_STUDY_BRIEF = {
  goal:
    "Create a self-directed learning page on Karl Marx covering life phases, cause-effect links, comparison of major works, and application of core concepts.",
  inputs: "Undergraduate (self-directed study)",
  desiredOutputs: "Learner-facing page",
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

function marxResolvedFactors() {
  const explicit = api.extractWorkflowBriefExplicitFactors(MARX_SELF_STUDY_BRIEF);
  const inferred = api.applyWorkflowBriefInferenceRules(
    ldBriefConfig,
    MARX_SELF_STUDY_BRIEF.goal,
    MARX_SELF_STUDY_BRIEF.inputs
  );
  return api.resolveWorkflowBriefFactors(
    ldBriefConfig,
    explicit,
    {},
    inferred,
    MARX_SELF_STUDY_BRIEF
  ).resolved;
}

function applyDlaPromptPipeline(baseDraft, briefCtx, resolved) {
  const ctx = Object.assign({}, briefCtx, {
    workflowBriefResolution: { resolvedFactors: resolved }
  });
  return api.applySelfDirectedLearnerPageStepScaffoldsToDraft(
    api.applyPedagogicCognitionContractScaffoldToDraft(baseDraft, ctx),
    ctx
  );
}

test("42-3: Marx DLA prompt includes SSOT scaffold contract (preamble rules consolidated)", () => {
  const resolved = marxResolvedFactors();
  const prompt = applyDlaPromptPipeline(
    "Design executable learning activities.\n",
    {
      workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
      desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
      stepCanonicalTitle: "Design Learning Activities",
      stepCanonicalStepId: "step_design_learning_activities"
    },
    resolved
  );
  assert.match(prompt, /LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT \(auto-applied\)/i);
  assert.match(prompt, /FORBIDDEN on scaffold fields/i);
  assert.match(prompt, /activity_preamble 50–120/i);
  assert.doesNotMatch(prompt, /LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT \(auto-applied\)/i);
});

test("42-3: Design Page step does not receive DLA-only preamble exposition contract", () => {
  const resolved = marxResolvedFactors();
  const ctx = {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Page",
    stepCanonicalStepId: "step_design_page",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const prompt = api.applySelfDirectedLearnerPageStepScaffoldsToDraft("Assemble page.\n", ctx);
  assert.doesNotMatch(prompt, /LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT/i);
});

test("42-3: applyLdActivityPreambleExpositionContractToDraft is idempotent", () => {
  const resolved = marxResolvedFactors();
  const ctx = {
    workflowGoal: MARX_SELF_STUDY_BRIEF.goal,
    desiredOutputs: MARX_SELF_STUDY_BRIEF.desiredOutputs,
    stepCanonicalTitle: "Design Learning Activities",
    stepCanonicalStepId: "step_design_learning_activities",
    workflowBriefResolution: { resolvedFactors: resolved }
  };
  const once = api.applyLdActivityPreambleExpositionContractToDraft("Base\n", ctx);
  const twice = api.applyLdActivityPreambleExpositionContractToDraft(once, ctx);
  assert.equal(once, twice);
});

test("42-3: updated Marx benchmark passes authorial preamble heuristic", () => {
  const marx = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "tests", "fixtures", "page-render", "marx-self-study-page.json"),
      "utf8"
    )
  );
  const acts = marx.sections.find((s) => s.section_id === "learning_activities").content;
  const evidence = api.evaluateActivityPreambleExpositionEvidence(acts);
  assert.equal(evidence.meetsAuthorialExposition, true);
  assert.equal(evidence.proceduralOpeningCount, 0);
});
