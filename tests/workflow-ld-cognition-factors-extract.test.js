/**
 * Sprint 28-5a — typed pedagogic cognition factor extraction (conservative).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

function extractWorkflowBriefConfig(md) {
  const idx = md.indexOf("### Workflow Brief Config");
  assert.ok(idx !== -1);
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
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

const api = loadPrismTestApi();
const ldBriefConfig = extractWorkflowBriefConfig(fs.readFileSync(ldPatternsPath, "utf8"));
const normalizedLdConfig = api.normalizeWorkflowBriefConfig(ldBriefConfig);

function extractBrief(brief) {
  return api.extractWorkflowBriefExplicitFactors({
    goal: brief.goal,
    inputs: brief.inputs || "",
    desiredOutputs: brief.desiredOutputs || "",
    startingArtefact: brief.startingArtefact || "",
    selectedDomains: ["learning-design"]
  });
}

function resolveBrief(brief) {
  const explicit = extractBrief(brief);
  const resolved = api.resolveWorkflowBriefFactors(
    normalizedLdConfig,
    explicit,
    {},
    {},
    brief
  ).resolved;
  return { explicit, resolved };
}

test("28-5a: normalized LD config includes cognition optional factors", () => {
  const ids = (normalizedLdConfig.optionalFactors || []).map((f) => f.id);
  api.SPRINT_28_COGNITION_FACTOR_IDS.forEach((id) => {
    assert.ok(ids.includes(id), `missing optional factor ${id}`);
  });
});

test("28-5a: peer revise cue sets reasoning_revision_required", () => {
  const { explicit, resolved } = resolveBrief({
    goal:
      "Create a peer instruction session: students answer individually, discuss in pairs, then revise answers after discussion.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(explicit.reasoning_revision_required, true);
  assert.equal(resolved.reasoning_revision_required, true);
  assert.equal(explicit.activities_required, true);
});

test("28-5a: misconception + confront cue sets misconception_reconciliation_required", () => {
  const { explicit } = resolveBrief({
    goal:
      "Design a seminar on climate myths and false claims. Groups confront misconceptions with evidence and reconcile ideas.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(explicit.misconception_reconciliation_required, true);
});

test("28-5a: conflicting evidence sets productive_uncertainty_required", () => {
  const { explicit } = resolveBrief({
    goal: "Run a debate seminar using conflicting evidence and uncertain interpretations.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(explicit.productive_uncertainty_required, true);
});

test("28-5a: if learners struggle sets adaptive_scaffolding_required", () => {
  const { explicit } = resolveBrief({
    goal: "Self-study module with step-by-step hints if learners struggle with the task.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(explicit.adaptive_scaffolding_required, true);
});

test("28-5a: retrieval quiz does not set cognition factors (conservative)", () => {
  const { explicit, resolved } = resolveBrief({
    goal:
      "Create a self-study revision page on photosynthesis with a 10-item MCQ quiz. Show answers at the end.",
    selectedDomains: ["learning-design"]
  });
  api.SPRINT_28_COGNITION_FACTOR_IDS.forEach((id) => {
    assert.notEqual(explicit[id], true, id);
    assert.notEqual(resolved[id], true, id);
  });
});

test("28-5a: negated revise does not set reasoning_revision_required", () => {
  const { explicit } = resolveBrief({
    goal: "Do not ask students to revise answers after discussion; lecture only.",
    selectedDomains: ["learning-design"]
  });
  assert.notEqual(explicit.reasoning_revision_required, true);
});

test("28-5a: Sprint 27 hide-answers extract unchanged", () => {
  const factors = extractBrief({
    goal: "Do not reveal correct answers on the student handout.",
    selectedDomains: ["learning-design"]
  });
  assert.equal(factors.learner_answer_visibility, "hidden_until_reveal");
  assert.notEqual(factors.include_answers, true);
});
