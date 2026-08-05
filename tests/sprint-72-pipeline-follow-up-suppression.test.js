/**
 * S72-T-075 — Pipeline Copilot follow-up suppression via prompt bookends.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const directive = require("../lib/workflow-pipeline-execution-directive.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib/workflow-pipeline-execution-directive.js"), "utf8"),
    sandbox,
    { filename: "workflow-pipeline-execution-directive.js" }
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
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
  const step = {
    title: "Design Learning Activities",
    canonical_step_id: "step_design_learning_activities",
    outputName: "page",
    inputKind: "none",
    notes: "Populate DLA fields on the page artefact."
  };
  api.setWorkflowsForTest([
    {
      id: "wf-test",
      name: "Test",
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      steps: [step]
    }
  ]);
  api.setSelectedWorkflowIdForTest("wf-test");
  const instr = api.buildWorkflowStepInstructions(step, 0, null);
  assert.ok(instr);
  assert.ok(instr.indexOf(opening) < instr.indexOf(completion));
  assert.match(instr, /Execution mode: autonomous/i);
  assert.match(instr, /Do not ask the user follow-up questions/i);
  assert.match(instr, /Pipeline completion rule/i);
  assert.match(instr, /Any further refinements/i);
});

test("GAM copy path retains completion suppression after archetype routing", () => {
  const api = loadPrismTestApi();
  const step = {
    title: "Generate Activity Materials",
    canonical_step_id: "step_generate_activity_materials",
    outputName: "page",
    inputKind: "none"
  };
  api.setWorkflowsForTest([
    {
      id: "wf-gam",
      name: "GAM test",
      pageEnrichmentV2: true,
      partialPageOutputs: true,
      steps: [
        {
          id: "dla",
          title: "Design Learning Activities",
          canonical_step_id: "step_design_learning_activities",
          outputName: "page"
        },
        step
      ]
    }
  ]);
  api.setSelectedWorkflowIdForTest("wf-gam");
  const instr = api.buildWorkflowStepInstructions(step, 1, null);
  assert.match(instr, /Pipeline completion rule/i);
  assert.match(instr, /Would you like me to/i);
});
