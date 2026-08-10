/**
 * Sprint 75 — C-07 My Workflows default / handoff mode (S75-D10).
 *
 * Run is the fresh-session default and Create→My Workflows destination.
 * Active-session navigation preserves the operator-chosen mode.
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

test("A/B: fresh session defaults workflowDetailMode to Run", () => {
  const { api, source } = loadPrismTestApi();
  assert.equal(api.getWorkflowDetailModeForTest(), "run");
  assert.match(source, /workflowDetailMode:\s*"run"/);
  assert.match(source, /function finalizeInitialUiSetup[\s\S]*?setWorkflowMode\("run"\)/);
  assert.doesNotMatch(source, /function finalizeInitialUiSetup[\s\S]*?setWorkflowMode\("edit"\)/);
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const runBtn = html.slice(
    html.indexOf('id="workflowModeRunBtn"'),
    html.indexOf('id="workflowModeRunBtn"') + 280
  );
  const editBtn = html.slice(
    html.indexOf('id="workflowModeEditBtn"'),
    html.indexOf('id="workflowModeEditBtn"') + 280
  );
  assert.match(runBtn, /workflow-mode-tab active/);
  assert.match(runBtn, /aria-selected="true"/);
  assert.doesNotMatch(editBtn, /workflow-mode-tab active/);
  assert.match(editBtn, /aria-selected="false"/);
});

test("C/D/E: active-session mode is preserved across area navigation (no reset in switchTab)", () => {
  const { api, source } = loadPrismTestApi();
  api.setWorkflowDetailModeForTest("edit");
  assert.equal(api.getWorkflowDetailModeForTest(), "edit");
  api.setWorkflowDetailModeForTest("settings");
  assert.equal(api.getWorkflowDetailModeForTest(), "settings");
  api.setWorkflowDetailModeForTest("run");
  assert.equal(api.getWorkflowDetailModeForTest(), "run");

  const switchStart = source.indexOf("function switchTab(name)");
  assert.ok(switchStart > 0);
  const switchBody = source.slice(switchStart, switchStart + 2500);
  assert.doesNotMatch(switchBody, /setWorkflowMode\(/);
  assert.doesNotMatch(switchBody, /workflowDetailMode\s*=/);
});

test("F: Create Workflow save handoff selects new workflow and forces Run", () => {
  const { source } = loadPrismTestApi();
  const fnStart = source.indexOf("function handleSaveDesignedWorkflow()");
  assert.ok(fnStart > 0);
  const fnBody = source.slice(fnStart, fnStart + 12000);
  assert.match(fnBody, /switchTab\("workflows"\)/);
  assert.match(fnBody, /selectWorkflow\(wfId\)/);
  assert.match(fnBody, /setWorkflowMode\("run"\)/);
  // Handoff order: navigate + select, then Run.
  const switchIdx = fnBody.indexOf('switchTab("workflows")');
  const selectIdx = fnBody.indexOf("selectWorkflow(wfId)");
  const runIdx = fnBody.indexOf('setWorkflowMode("run")');
  assert.ok(switchIdx > 0 && selectIdx > switchIdx && runIdx > selectIdx);
});

test("G: Create handoff Run force is not applied on ordinary switchTab to workflows", () => {
  const { source } = loadPrismTestApi();
  const switchStart = source.indexOf("function switchTab(name)");
  const switchBody = source.slice(switchStart, switchStart + 2500);
  assert.doesNotMatch(switchBody, /setWorkflowMode\("run"\)/);
  // Only explicit handoff / init / user click set Run — not every workflows entry.
  const workflowsClicks = source.match(/switchTab\("workflows"\)/g) || [];
  assert.ok(workflowsClicks.length >= 1);
});

test("H: selecting another workflow does not reset mode", () => {
  const { source } = loadPrismTestApi();
  const fnStart = source.indexOf("function selectWorkflow(id)");
  assert.ok(fnStart > 0);
  const fnBody = source.slice(fnStart, fnStart + 1800);
  assert.doesNotMatch(fnBody, /setWorkflowMode\(/);
  assert.match(fnBody, /preserveRunNavigation:\s*state\.workflowDetailMode\s*===\s*"run"/);
});

test("I/J: no new persistence; mode remains in-session state only", () => {
  const { source } = loadPrismTestApi();
  assert.doesNotMatch(source, /workflowDetailMode.*localStorage|localStorage.*workflowDetailMode/);
  assert.doesNotMatch(source, /workflowModeSeen|firstWorkflowMode|modeLandingFlag/);
  assert.match(source, /WORKFLOW_STORAGE_KEY\s*=\s*"promptr\.workflows\.v1"/);
  assert.match(source, /WORKFLOW_RUN_STATE_STORAGE_KEY\s*=\s*"promptr\.workflows\.runstate\.v1"/);
});
