/**
 * Sprint 56C Wave 2 — runtime prompt smoke (historical gate prose retired).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const { api } = loadPrismAppJsTestApi();

function designPagePartialPrompt() {
  const step = {
    canonical_step_id: "step_design_page",
    canonical_title: "Design Page",
    title: "Design Page"
  };
  const wf = {
    goal: "Self-directed learner page",
    desiredOutputs: "Learner-facing page",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    workflowOutputSpec: { goal: "Self-directed learner page" }
  };
  return api
    .applyWorkflowStepRuntimePromptAugmentations("Assemble learner page.\n", step, wf)
    .trim();
}

test("56C W2 smoke: Design Page runtime prompt is augmented", () => {
  assert.match(designPagePartialPrompt(), /\(auto-applied\)/);
});

test("56C W2 smoke: partial Design Page prompt is non-empty augmented runtime", () => {
  const prompt = designPagePartialPrompt();
  assert.ok(prompt.length > 200);
  assert.match(prompt, /Assemble learner page/i);
});
