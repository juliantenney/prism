/**
 * Sprint 56C Wave 1 Phase 2A — runtime prompt smoke.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const { api } = loadPrismAppJsTestApi();

test("56C W1 P2A smoke: partial Design Page prompt includes partial contract", () => {
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
  const prompt = api
    .applyWorkflowStepRuntimePromptAugmentations("Assemble learner page.\n", step, wf)
    .trim();
  assert.match(prompt, /\(auto-applied\)/);
});
