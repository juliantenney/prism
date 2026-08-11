/**
 * Sprint 75 — C-05 / S75-D09 revised: Create Workflow API-key is an
 * API-ACTION prerequisite, not a navigation prerequisite.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise };
  const documentStub = { readyState: "loading", addEventListener: () => {} };
  const windowStub = { document: documentStub };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, source };
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");

test("A: Fresh HTML session surfaces Create Workflow without requiring a key", () => {
  assert.match(indexHtml, /id="tabWorkflowFactory"[^>]*class="tab active"/);
  assert.match(indexHtml, /id="tabWorkflowFactory"[^>]*aria-selected="true"/);
  // Create panel visible by default; Prompt Studio not the accidental surface.
  assert.match(
    indexHtml,
    /id="workflowFactoryPanel"[\s\S]{0,120}class="refinement-panel"/
  );
  assert.doesNotMatch(
    indexHtml,
    /id="workflowFactoryPanel"[\s\S]{0,120}class="refinement-panel hidden"/
  );
  assert.match(
    indexHtml,
    /id="refinementPanel"[^>]*class="refinement-panel hidden"/
  );
});

test("B: Create Workflow tab and displayed surface agree in markup", () => {
  assert.match(indexHtml, /aria-controls="workflowFactoryPanel"/);
  assert.match(indexHtml, /id="workflowFactoryPanel"[\s\S]{0,160}aria-hidden="false"/);
  assert.match(indexHtml, /id="refinementPanel"[^>]*aria-hidden="true"/);
});

test("C: Navigation into Create Workflow is not API-gated", () => {
  const { source } = loadPrismTestApi();
  const switchStart = source.indexOf("function switchTab(name)");
  assert.ok(switchStart > 0);
  const switchSlice = source.slice(switchStart, switchStart + 700);
  assert.doesNotMatch(
    switchSlice,
    /ensureCreateWorkflowApiKeyPrerequisite/
  );
  assert.match(
    source,
    /Create Workflow is always navigable|API key is gated on Design workflow/
  );
  const initStart = source.indexOf("function finalizeInitialUiSetup");
  assert.ok(initStart > 0);
  const initSlice = source.slice(initStart, initStart + 500);
  assert.ok(initSlice.includes('switchTab("workflowFactory")'));
});

test("D: Local brief controls remain editable without a key; Design is disabled until key present", () => {
  const { source, api } = loadPrismTestApi();
  // S75-D23 progressive disclosure: Design is disabled without a key, while
  // Create remains navigable and brief fields stay editable (unchanged).
  assert.match(source, /els\.wfDesignStartBtn\.disabled\s*=\s*!hasKey/);
  assert.match(source, /syncWorkflowFactoryDesignAssistantChrome/);
  assert.match(indexHtml, /id="wfDesignName"/);
  assert.match(indexHtml, /id="wfDesignIntent"/);
  assert.match(indexHtml, /id="wfLdCreateOutputTypeGroup"/);
  assert.match(indexHtml, /id="wfDesignApiKeyRequiredBtn"/);
  api.setOpenAiApiKeyForTest(null);
  assert.equal(api.hasConfiguredOpenAiApiKeyForTest(), false);
});

test("E: Entering Create Workflow does not itself invoke OpenAI callers", () => {
  const { source } = loadPrismTestApi();
  const switchStart = source.indexOf("function switchTab(name)");
  const switchEnd = source.indexOf("\n  function ", switchStart + 20);
  const switchBody = source.slice(switchStart, switchEnd > 0 ? switchEnd : switchStart + 2500);
  assert.doesNotMatch(switchBody, /callOpenAI/);
  assert.doesNotMatch(switchBody, /fetch\s*\(/);
});

test("F: First API-dependent Create action is Design workflow / handleStartWorkflowDesign", () => {
  const { source, api } = loadPrismTestApi();
  assert.match(source, /function handleStartWorkflowDesign\s*\(/);
  const start = source.indexOf("function handleStartWorkflowDesign");
  assert.ok(start > 0);
  const slice = source.slice(start, start + 5000);
  const gateIdx = slice.indexOf("ensureCreateWorkflowApiKeyPrerequisite()");
  const statusIdx = slice.indexOf('setWorkflowDesignStatusBadge("Designing');
  const intentCall = source.indexOf("callOpenAIForWorkflowIntentInterpretation", start);
  assert.ok(gateIdx > 0, "action gate present in handleStartWorkflowDesign");
  assert.ok(statusIdx > gateIdx, "gate before Designing status mutation");
  assert.ok(intentCall > start + gateIdx, "intent API call occurs after the gate");
  api.setOpenAiApiKeyForTest(null);
  assert.equal(api.ensureCreateWorkflowApiKeyPrerequisiteForTest(), false);
});

test("G: Blocking Design preserves brief — gate runs before design log / result reset", () => {
  const { source } = loadPrismTestApi();
  const start = source.indexOf("function handleStartWorkflowDesign");
  const slice = source.slice(start, start + 5000);
  const gateIdx = slice.indexOf("ensureCreateWorkflowApiKeyPrerequisite()");
  const clearLogIdx = slice.indexOf("wfDesignLog.innerHTML");
  const clearResultIdx = slice.indexOf("state.workflowDesignResult = null");
  assert.ok(gateIdx > 0);
  assert.ok(clearLogIdx < 0 || clearLogIdx > gateIdx);
  assert.ok(clearResultIdx < 0 || clearResultIdx > gateIdx);
  // No early return that clears form fields on missing key.
  assert.doesNotMatch(slice, /wfDesignName\.value\s*=\s*""/);
  assert.doesNotMatch(slice, /wfDesignIntent\.value\s*=\s*""/);
});

test("H: Missing-key guidance uses existing API controls; Create progressive disclosure action present", () => {
  const { source, api } = loadPrismTestApi();
  api.setOpenAiApiKeyForTest(null);
  assert.equal(typeof api.revealOpenAiApiKeyEntryForTest, "function");
  assert.match(source, /function revealOpenAiApiKeyEntry\s*\(/);
  assert.match(source, /triggerOpenAiApiKeyFilePicker/);
  assert.match(source, /els\.apiKeyFile\.focus/);
  assert.match(source, /apiKeyControls\.classList\.remove\("hidden"\)/);
  assert.match(source, /Load your OpenAI API key to continue/);
  assert.doesNotMatch(source, /Load your OpenAI API key first to create workflows/);
  assert.equal(api.ensureCreateWorkflowApiKeyPrerequisiteForTest(), false);
  assert.match(indexHtml, /id="apiKeyFile"/);
  assert.match(indexHtml, /id="wfDesignApiKeyRequiredBtn"/);
  assert.doesNotMatch(indexHtml, /id="wfDesignApiKeyHint"/);
  assert.doesNotMatch(
    indexHtml,
    /An OpenAI API key is needed to generate the workflow\. You can fill in the brief first/
  );
});

test("I: After loading a key, Create API-action prerequisite passes (continue existing flow)", () => {
  const { api } = loadPrismTestApi();
  api.setOpenAiApiKeyForTest(null);
  assert.equal(api.ensureCreateWorkflowApiKeyPrerequisiteForTest(), false);
  api.setOpenAiApiKeyForTest("sk-after-load");
  assert.equal(api.ensureCreateWorkflowApiKeyPrerequisiteForTest(), true);
  assert.equal(api.hasConfiguredOpenAiApiKeyForTest(), true);
});

test("J: With a key already loaded, Design gate is a no-op pass", () => {
  const { api } = loadPrismTestApi();
  api.setOpenAiApiKeyForTest("sk-test-key");
  assert.equal(api.hasConfiguredOpenAiApiKeyForTest(), true);
  assert.equal(api.ensureCreateWorkflowApiKeyPrerequisiteForTest(), true);
});

test("K: Other main-area navigation remains unaffected", () => {
  const { source } = loadPrismTestApi();
  const switchStart = source.indexOf("function switchTab(name)");
  const switchSlice = source.slice(switchStart, switchStart + 900);
  assert.doesNotMatch(switchSlice, /name\s*===\s*"workflows".*apiKey/);
  assert.doesNotMatch(switchSlice, /name\s*===\s*"utilities".*ensureCreateWorkflow/);
  assert.doesNotMatch(switchSlice, /name\s*===\s*"promptFactory".*ensureCreateWorkflow/);
  assert.doesNotMatch(source, /setWorkflowMode\([\s\S]{0,200}ensureCreateWorkflowApiKeyPrerequisite/);
  assert.match(source, /function handleApiKeyFileChange\s*\(/);
  assert.match(source, /state\.apiKey\s*=\s*content/);
  assert.match(source, /API key loaded into memory/);
});
