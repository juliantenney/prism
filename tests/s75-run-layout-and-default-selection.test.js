"use strict";

/**
 * Sprint 75 — Run layout grouping + My Workflows default selection.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const styleCssPath = path.join(repoRoot, "style.css");

function loadPrismTestApi(seedStorage) {
  const storage = Object.assign({}, seedStorage || {});
  const localStorage = {
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null;
    },
    setItem(k, v) {
      storage[k] = String(v);
    },
    removeItem(k) {
      delete storage[k];
    },
    key(i) {
      const keys = Object.keys(storage);
      return i >= 0 && i < keys.length ? keys[i] : null;
    },
    get length() {
      return Object.keys(storage).length;
    }
  };
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const documentStub = {
    readyState: "loading",
    addEventListener: () => {},
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({
      className: "",
      classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
      setAttribute() {},
      appendChild() {},
      textContent: ""
    })
  };
  const windowStub = { document: documentStub, localStorage };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return { api, storage, source };
}

function wf(id, name, updatedAt) {
  return {
    id,
    name,
    tags: [],
    steps: [{ id: id + "-s1", title: "Step" }],
    createdAt: updatedAt,
    updatedAt
  };
}

test("1-6: Run chrome lives inside the current-step panel in working order", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const css = fs.readFileSync(styleCssPath, "utf8");
  const { source } = loadPrismTestApi();
  const createStart = source.indexOf("function createWorkflowStepElement");
  const createBody = source.slice(createStart, source.indexOf("function gatherWorkflowDetailFormData()"));
  assert.match(createBody, /data-role", "run-step-nav"/);
  assert.match(createBody, /data-role", "run-step-identity"/);
  assert.match(createBody, /data-role", "run-step-copy"/);
  const navIdx = createBody.indexOf('li.appendChild(runNav)');
  const identityIdx = createBody.indexOf('li.appendChild(runIdentity)');
  const instructionsIdx = createBody.indexOf('li.appendChild(instructionsGroup)');
  const copyIdx = createBody.indexOf('li.appendChild(runCopy)');
  const captureIdx = createBody.indexOf('li.appendChild(userNotesWrap)');
  assert.ok(navIdx > 0 && identityIdx > navIdx, "progress/nav before step heading");
  assert.ok(instructionsIdx > identityIdx, "heading before description/instructions");
  assert.ok(copyIdx > instructionsIdx, "Copy after description/instructions/guidance");
  assert.ok(captureIdx > copyIdx, "Copy before paste/capture controls");
  assert.match(source, /syncWorkflowRunStepIdentityPlacement\(currentStepLi\)/);
  assert.match(source, /navTarget\.appendChild\(els\.workflowRunProgress\)/);
  assert.match(source, /navTarget\.appendChild\(els\.workflowRunButtons\)/);
  assert.match(source, /copyTarget\.appendChild\(els\.workflowRunCopyBtn\)/);
  assert.match(css, /\.workflow-detail\.run-mode\s+\.workflow-step-run-nav\s*\{[\s\S]*display:\s*flex/);
  assert.match(css, /\.workflow-run-progress\s*\{[\s\S]*width:\s*max-content/);
  assert.match(html, /id="workflowRunProgressSegments"/);
  assert.match(html, /id="workflowPrevStepBtn"/);
  assert.match(html, /id="workflowNextStepBtn"/);
  assert.match(html, /id="workflowRunStatus"/);
  assert.match(html, /id="workflowRunCopyBtn"/);
  assert.match(html, /id="workflowRunChromePark"/);
  const buttonsStart = html.indexOf('class="workflow-run-buttons"');
  const buttons = html.slice(buttonsStart, html.indexOf("</div>", buttonsStart));
  assert.match(buttons, /id="workflowPrevStepBtn"/);
  assert.match(buttons, /id="workflowNextStepBtn"/);
  assert.match(buttons, /id="workflowContinueToAuthoringBtn"/);
  assert.doesNotMatch(buttons, /id="workflowRunCopyBtn"/);
});

test("6-7: Copy and Previous/Next behaviour remain unchanged", () => {
  const { source } = loadPrismTestApi();
  assert.match(
    source,
    /els\.workflowRunCopyBtn\.addEventListener\("click"[\s\S]*stepCopyBtn\.click/
  );
  assert.match(source, /els\.workflowPrevStepBtn\.disabled\s*=\s*idx\s*===\s*0/);
  assert.match(source, /els\.workflowPrevStepBtn\.addEventListener\("click"/);
  assert.match(source, /els\.workflowNextStepBtn\.addEventListener\("click"/);
  assert.match(source, /resolveWorkflowRunNextStepDisabledReason\(/);
});

test("8: progress/saved-data model is unchanged", () => {
  const { api } = loadPrismTestApi();
  const steps = [
    { id: "s1", title: "One" },
    { id: "s2", title: "Two" },
    { id: "s3", title: "Three" }
  ];
  const segments = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: "wf-x",
    steps,
    currentIndex: 1
  });
  assert.deepEqual(
    segments.map((row) => row.progress),
    ["passed", "current", "future"]
  );
  assert.equal(segments.every((row) => row.hasSavedData === false), true);
});

test("9-12: DLA guidance, capture persistence, and Continue-to-Authoring stay unchanged", () => {
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  const { source } = loadPrismTestApi();
  assert.match(source, /data-role", "runner-step-guidance"/);
  assert.match(source, /getWorkflowRunStepGuidanceText\(/);
  assert.match(source, /data-field", "runStepOutput"/);
  assert.match(html, /id="workflowContinueToAuthoringBtn"/);
  const buttonsStart = html.indexOf('class="workflow-run-buttons"');
  const buttons = html.slice(buttonsStart, html.indexOf("</div>", buttonsStart));
  assert.match(buttons, /id="workflowContinueToAuthoringBtn"/);
  assert.match(source, /isWorkflowRunAuthoringReady\(/);
  assert.match(source, /workflowHasPersistedDesignPageResult\(/);
});

test("12-13: no selection selects the first displayed workflow (Updated newest)", () => {
  const { api } = loadPrismTestApi();
  const older = wf("wf-old", "Older", 100);
  const newer = wf("wf-new", "Newer", 200);
  const workflows = [older, newer];
  const visible = api.applyWorkflowListFilters(workflows, { query: "", tag: [], sort: "updatedDesc" });
  assert.equal(visible[0].id, "wf-new");
  const resolved = api.resolveWorkflowSelectionForCurrentViewForTest({
    workflows,
    visible,
    selectedWorkflowId: ""
  });
  assert.equal(resolved.action, "select");
  assert.equal(resolved.workflowId, "wf-new");
});

test("14: existing valid visible selection is preserved", () => {
  const { api } = loadPrismTestApi();
  const older = wf("wf-old", "Older", 100);
  const newer = wf("wf-new", "Newer", 200);
  const workflows = [older, newer];
  const visible = api.applyWorkflowListFilters(workflows, { query: "", tag: [], sort: "updatedDesc" });
  const resolved = api.resolveWorkflowSelectionForCurrentViewForTest({
    workflows,
    visible,
    selectedWorkflowId: "wf-old"
  });
  assert.equal(resolved.action, "keep");
  assert.equal(resolved.workflowId, "wf-old");
});

test("15: selected workflow excluded by search/filter falls back to first visible", () => {
  const { api } = loadPrismTestApi();
  const roman = Object.assign(wf("wf-roman", "Roman Roads", 300), { tags: ["history"] });
  const maths = Object.assign(wf("wf-maths", "Fractions", 200), { tags: ["maths"] });
  const workflows = [roman, maths];
  const visible = api.applyWorkflowListFilters(workflows, {
    query: "fraction",
    tag: [],
    sort: "updatedDesc"
  });
  assert.deepEqual(visible.map((row) => row.id), ["wf-maths"]);
  const resolved = api.resolveWorkflowSelectionForCurrentViewForTest({
    workflows,
    visible,
    selectedWorkflowId: "wf-roman"
  });
  assert.equal(resolved.action, "select");
  assert.equal(resolved.workflowId, "wf-maths");
});

test("16: zero visible search/filter results produces no invalid selection", () => {
  const { api } = loadPrismTestApi();
  const workflows = [wf("wf-a", "Alpha", 100)];
  const visible = api.applyWorkflowListFilters(workflows, {
    query: "zzzz-no-match",
    tag: [],
    sort: "updatedDesc"
  });
  assert.equal(visible.length, 0);
  const resolved = api.resolveWorkflowSelectionForCurrentViewForTest({
    workflows,
    visible,
    selectedWorkflowId: "wf-a"
  });
  assert.equal(resolved.action, "none");
  assert.equal(resolved.workflowId, "");
});

test("17: empty workflow collection remains safe", () => {
  const { api } = loadPrismTestApi();
  const resolved = api.resolveWorkflowSelectionForCurrentViewForTest({
    workflows: [],
    visible: [],
    selectedWorkflowId: ""
  });
  assert.equal(resolved.action, "none");
  assert.equal(resolved.workflowId, "");
});

test("18: explicit workflow selection still wins over default ordering", () => {
  const { api } = loadPrismTestApi();
  const older = wf("wf-old", "Older", 100);
  const newer = wf("wf-new", "Newer", 200);
  api.setWorkflowsForTest([older, newer]);
  api.selectWorkflowForTest("wf-old");
  assert.equal(api.getSelectedWorkflowIdForTest(), "wf-old");
});

test("19-21: New/Duplicate/Rename selection contracts remain in source", () => {
  const { source } = loadPrismTestApi();
  const newBody = source.slice(
    source.indexOf("function handleNewWorkflow()"),
    source.indexOf("function handleAddWorkflowStep()")
  );
  assert.match(newBody, /selectWorkflow\(newWorkflow\.id\)/);
  const dupBody = source.slice(
    source.indexOf("function handleDuplicateWorkflow()"),
    source.indexOf("function handleRenameWorkflow()")
  );
  assert.match(dupBody, /selectWorkflow\(clone\.id\)/);
  const renameBody = source.slice(
    source.indexOf("function handleRenameWorkflow()"),
    source.indexOf("async function handleDeleteWorkflow()")
  );
  assert.match(renameBody, /selectWorkflow\(wf\.id\)/);
  assert.doesNotMatch(renameBody, /wf\.id\s*=/);
});

test("22: delete keeps immediate empty selection; later render path can default-select", () => {
  const { source, api } = loadPrismTestApi();
  const deleteBody = source.slice(
    source.indexOf("async function handleDeleteWorkflow()"),
    source.indexOf("async function handleDeleteWorkflow()") + 3500
  );
  assert.match(deleteBody, /state\.selectedWorkflowId = null/);
  assert.match(deleteBody, /renderWorkflowList\(\{\s*skipDefaultSelection:\s*true\s*\}\)/);
  assert.match(deleteBody, /clearWorkflowDetail\(\)/);
  const remaining = [wf("wf-b", "Kept", 50)];
  const afterDelete = api.resolveWorkflowSelectionForCurrentViewForTest({
    workflows: remaining,
    visible: remaining,
    selectedWorkflowId: ""
  });
  assert.equal(afterDelete.action, "select");
  assert.equal(afterDelete.workflowId, "wf-b");
});

test("fresh load no longer prefers storage order over the displayed list", () => {
  const { source } = loadPrismTestApi();
  const loadStart = source.indexOf("function loadWorkflows()");
  const loadBody = source.slice(loadStart, source.indexOf("function saveWorkflows()"));
  assert.doesNotMatch(loadBody, /state\.selectedWorkflowId = state\.workflows\[0\]\.id/);
  assert.match(loadBody, /renderWorkflowList\(\)/);
  assert.match(loadBody, /if \(!state\.selectedWorkflowId\) \{\s*clearWorkflowDetail\(\);/);
});
