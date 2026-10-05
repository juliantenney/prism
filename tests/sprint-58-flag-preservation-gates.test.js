/**
 * Sprint 58 flag preservation — partial prompt smoke.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const { api } = loadPrismAppJsTestApi();

function partialDesignPagePrompt() {
  const step = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
  const wf = {
    goal: "Learner page",
    desiredOutputs: "Page",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { goal: "Learner page" }
  };
  return api
    .applyWorkflowStepRuntimePromptAugmentations("Design page.\n", step, wf)
    .trim();
}

test("S58 D1 smoke: partial prompt is augmented at runtime", () => {
  assert.match(partialDesignPagePrompt(), /\(auto-applied\)/);
});

test("S58 D2 smoke: partial prompt excludes compose contract", () => {
  assert.doesNotMatch(partialDesignPagePrompt(), /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
});
