/**
 * Sprint 58 stabilisation — partial contract smoke (full E2E HTML pipeline retired).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const { api } = loadPrismAppJsTestApi();

test("S58 smoke: partial Design Page runtime includes partial contract", () => {
  const step = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
  const wf = {
    goal: "Topic page",
    desiredOutputs: "Page",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { goal: "Topic page" }
  };
  const prompt = api
    .applyWorkflowStepRuntimePromptAugmentations("Design page body.\n", step, wf)
    .trim();
  assert.match(prompt, /\(auto-applied\)/);
});
