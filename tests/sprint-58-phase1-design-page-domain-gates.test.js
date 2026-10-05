/**
 * Sprint 58 Phase 1 — partial Design Page domain prompt smoke.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const { api } = loadPrismAppJsTestApi();

test("Phase 1 smoke: partial runtime references partial contract", () => {
  const step = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
  const wf = {
    goal: "Domain page",
    desiredOutputs: "Page",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { goal: "Domain page" }
  };
  const prompt = api
    .applyWorkflowStepRuntimePromptAugmentations("Design page.\n", step, wf)
    .trim();
  assert.match(prompt, /\(auto-applied\)/);
});
