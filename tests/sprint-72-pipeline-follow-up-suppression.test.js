/**
 * S72-T-075 — Pipeline Copilot follow-up suppression via prompt bookends.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { loadPrismAppJsTestApi } = require("./prism-vm-lib-bootstrap.js");

const directive = require("../lib/workflow-pipeline-execution-directive.js");

function loadPrismTestApi() {
  return loadPrismAppJsTestApi().api;
}

test("directive lib exposes opening and completion bookends", () => {
  assert.match(
    directive.PIPELINE_EXECUTION_OPENING_DIRECTIVE,
    /Execution mode: autonomous/i
  );
  assert.match(
    directive.PIPELINE_EXECUTION_OPENING_DIRECTIVE,
    /Do not ask the user follow-up questions/i
  );
  assert.match(
    directive.PIPELINE_EXECUTION_COMPLETION_DIRECTIVE,
    /Pipeline completion rule/i
  );
  assert.match(
    directive.PIPELINE_EXECUTION_COMPLETION_DIRECTIVE,
    /Would you like me to/i
  );
});

test("isSpeculativeCopilotFollowUpText detects common speculative endings", () => {
  assert.equal(
    directive.isSpeculativeCopilotFollowUpText("Would you like me to refine this further?"),
    true
  );
  assert.equal(
    directive.isSpeculativeCopilotFollowUpText("Shall I also generate a quiz version?"),
    true
  );
  assert.equal(
    directive.isSpeculativeCopilotFollowUpText("STEP 3 OUTPUT: page"),
    false
  );
});

test("buildWorkflowStepInstructions bookends pipeline prompts with follow-up suppression", () => {
  const api = loadPrismTestApi();
  const opening = api.getPipelineExecutionOpeningDirective();
  const completion = api.getPipelineExecutionCompletionDirective();
  assert.match(opening, /Execution mode: autonomous/i);
  assert.match(completion, /Pipeline completion rule/i);
});

test("GAM copy path retains completion suppression after archetype routing", () => {
  const completion = directive.PIPELINE_EXECUTION_COMPLETION_DIRECTIVE;
  assert.match(completion, /Pipeline completion rule/i);
  assert.match(completion, /Would you like me to/i);
});
