/**
 * Sprint 75 — retire generic Create Workflow workflow-review / freeform QA step insertion (S75-D03).
 *
 * Static + API probes: the unsafe generic reviewer path is gone; legitimate
 * review/refinement surfaces remain.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const ldPatternsPath = path.join(
  repoRoot,
  "domains",
  "learning-design",
  "domain-learning-design-step-patterns.md"
);

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

test("Create Workflow UI no longer exposes Review & suggest improvements", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  assert.doesNotMatch(html, /wfDesignReviewBtn/);
  assert.doesNotMatch(html, /Review\s*&amp;\s*suggest improvements/i);
  assert.doesNotMatch(html, /Review\s*&amp;\s*suggest improvements/);
  assert.match(html, /wfDesignSaveBtn/);
  assert.match(html, /wfDesignSteps/);
  assert.doesNotMatch(html, /wfDesignVersionSelect/);
  assert.match(html, /Proposed workflow/);
});

test("generic workflow reviewer runtime is removed from app.js", () => {
  const src = fs.readFileSync(appJsPath, "utf8");
  const retired = [
    "function handleWorkflowReview",
    "function callOpenAIForWorkflowReview",
    "function tryParseWorkflowReviewJson",
    "function getWorkflowReviewMaxOutputTokens",
    "workflowAwaitingRefineOptIn",
    "workflowAwaitingSuggestionAnswer",
    "workflowReviewSuggestions",
    "workflowReviewIndex",
    "workflowAwaitingDeepRefineOptIn",
    "workflowDeepRefineContext",
    "wfDesignReviewBtn",
    "Adding explicit review/refine/QA steps after major generation steps"
  ];
  for (const needle of retired) {
    assert.equal(src.includes(needle), false, "should not contain: " + needle);
  }
});

test("Prompt Studio prompt review and pack post-generation refinement remain", () => {
  const src = fs.readFileSync(appJsPath, "utf8");
  assert.match(src, /function runPromptReview\s*\(/);
  assert.match(src, /function getReviewMaxOutputTokens\s*\(/);
  assert.match(src, /post_generation_refinement/);
  assert.match(src, /stepRefinementProfiles/);
  assert.match(src, /function handleSaveDesignedWorkflow\s*\(/);
});

test("assessment-specific QA / feedback pack steps remain declared", () => {
  const md = fs.readFileSync(ldPatternsPath, "utf8");
  assert.match(md, /## 8\. Design Feedback/);
  assert.match(md, /## 18\. Validate Learning Design/);
  assert.match(md, /## 19\. Revise Assessment Based on QA/);
  assert.match(md, /step_design_feedback|step_validate_learning_design|step_revise_assessment_based_on_qa/);
});

test("retired reviewer failure class cannot recur via removed insertion path", () => {
  const src = fs.readFileSync(appJsPath, "utf8");
  // No remaining code path that queues freeform inserted steps from a workflow reviewer.
  assert.doesNotMatch(src, /proposed_changes/);
  assert.doesNotMatch(src, /after_step/);
  // Canonicalisation helper remains for legitimate save/generation paths.
  assert.match(src, /function pickCanonicalWorkflowStepTitle\s*\(/);
  const api = loadPrismTestApi();
  assert.equal(typeof api.applyWorkflowDesignHeuristics, "function");
  assert.equal(typeof api.handleWorkflowReview, "undefined");
  assert.equal(typeof api.callOpenAIForWorkflowReview, "undefined");
});

test("token budgets no longer allocate workflowReview (Prompt Studio refinementReview remains)", () => {
  const src = fs.readFileSync(appJsPath, "utf8");
  assert.doesNotMatch(src, /workflowReview\s*:/);
  assert.match(src, /refinementReview\s*:/);
});
