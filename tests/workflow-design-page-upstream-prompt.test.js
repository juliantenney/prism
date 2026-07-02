/**
 * Design Page copied prompt must instruct Copilot to consume upstream artefacts
 * from prior step outputs in conversation — not PRISM capture re-injection.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, module: { exports: {} }, exports: {} };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  sandbox.globalThis = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-design-page-compose-contract.js"), "utf8"),
    sandbox,
    { filename: "ld-design-page-compose-contract.js" }
  );
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-materials-copy.js"), "utf8"),
    sandbox,
    { filename: "ld-materials-copy.js" }
  );
  vm.runInContext(
    fs.readFileSync(path.join(repoRoot, "lib", "ld-table-fidelity.js"), "utf8"),
    sandbox,
    { filename: "ld-table-fidelity.js" }
  );
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api);
  return { api };
}

const { api } = loadPrismTestApi();

const wf = {
  id: "wf-dp-upstream",
  steps: [
    {
      id: "gam_step",
      title: "Generate Activity Materials",
      outputName: "activity_materials",
      canonical_step_id: "step_generate_activity_materials"
    },
    {
      id: "page_step",
      title: "Design Page",
      outputName: "page",
      canonical_step_id: "step_design_page",
      override_prompt_body: "Assemble the learner page from upstream artefacts.",
      prompt_source_type: "local_override",
      inputBindings: [
        {
          kind: "internal",
          sourceStepId: "gam_step",
          artifactName: "activity_materials"
        }
      ]
    }
  ]
};

test("buildWorkflowStepInstructions tells Design Page to use prior Copilot outputs, not PRISM captures", () => {
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf-dp-upstream");
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});

  const instr = api.buildWorkflowStepInstructions(wf.steps[1], 1, null);
  assert.match(instr, /prior step outputs in this conversation/i);
  assert.match(instr, /STEP N OUTPUT:/i);
  assert.match(instr, /runner does not re-paste those bodies/i);
  assert.match(instr, /Generate Activity Materials/i);
  assert.match(instr, /Multi-material enumeration/i);
  assert.match(instr, /transport, not authoring/i);
  assert.match(instr, /Context access:/i);
  assert.match(instr, /chat history is context/i);
  assert.match(instr, /before claiming artefacts are unavailable/i);
  assert.doesNotMatch(instr, /workflow capture; use this text verbatim/i);
  assert.doesNotMatch(instr, /CAPTURE MISSING:/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT requires conversational upstream and pack-text GAM merge", () => {
  const compose = require("../lib/ld-design-page-compose-contract.js");
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /prior workflow steps already present in this Copilot/i);
  assert.match(text, /pack text with Activity ID/i);
  assert.match(text, /Definitions of/i);
  assert.match(text, /FORBIDDEN: composing material bodies only from learning_activities\.required_materials/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: context access rule", () => {
  const compose = require("../lib/ld-design-page-compose-contract.js");
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /CONTEXT ACCESS RULE/i);
  assert.match(text, /do not need to be attached again in the current user message/i);
  assert.match(text, /activity_materials bodies are not present/i);
  assert.match(text, /current message context lacks the artefacts/i);
  assert.match(text, /active Copilot chat history is context/i);
  assert.match(text, /GAM Content: bodies already present in the conversation/i);
});
