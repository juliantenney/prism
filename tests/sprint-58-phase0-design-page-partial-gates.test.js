/**
 * Sprint 58 Phase 0 — partial Design Page prompt smoke.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const { api } = loadPrismAppJsTestApi();

test("Phase 0 smoke: partial mode injects partial contract", () => {
  const step = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
  const wf = {
    goal: "Page",
    desiredOutputs: "Page",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { goal: "Page" }
  };
  const prompt = api
    .applyWorkflowStepRuntimePromptAugmentations("Design page.\n", step, wf)
    .trim();
  assert.match(prompt, /\(auto-applied\)/);
  assert.doesNotMatch(prompt, /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i);
});
