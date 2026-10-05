/**
 * Sprint 56C Wave 1 Phase 1 — runtime prompt smoke (golden gates retired).
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

test("56C W1 P1 smoke: Design Page runtime prompt is augmented", () => {
  const prompt = designPagePartialPrompt();
  assert.ok(prompt.length > 200);
  assert.match(prompt, /\(auto-applied\)/);
});

test("56C W1 P1 smoke: GAM step still receives math render contract", () => {
  const step = {
    canonical_step_id: "step_generate_activity_materials",
    canonical_title: "Generate Activity Materials",
    title: "Generate Activity Materials"
  };
  const wf = { goal: "Materials", desiredOutputs: "GAM", workflowOutputSpec: { goal: "Materials" } };
  const prompt = api
    .applyWorkflowStepRuntimePromptAugmentations("Generate materials.\n", step, wf)
    .trim();
  assert.match(prompt, /LD-MATH-RENDER \(auto-applied\)/i);
});
