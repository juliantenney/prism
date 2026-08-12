/**
 * Sprint 75 — Clear run data requires confirmation before mutation.
 */

"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");
const workflowResources = require("../lib/prism-workflow-resources.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const RUNKEY = "promptr.workflows.runstate.v1";
const WFKEY = "promptr.workflows.v1";

function createElementStub(tagName) {
  const tag = String(tagName || "div").toUpperCase();
  const el = {
    tagName: tag,
    value: "",
    textContent: "",
    innerHTML: "",
    open: false,
    returnValue: "",
    className: "",
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
      toggle() {
        return false;
      }
    },
    style: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener(type, fn) {
      if (!this.__listeners) this.__listeners = Object.create(null);
      if (!this.__listeners[type]) this.__listeners[type] = [];
      this.__listeners[type].push(fn);
    },
    removeEventListener(type, fn) {
      if (!this.__listeners || !this.__listeners[type]) return;
      this.__listeners[type] = this.__listeners[type].filter((h) => h !== fn);
    },
    focus() {
      this.__focused = true;
    },
    click() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    showModal() {
      this.open = true;
    },
    close() {
      this.open = false;
      const handlers = (this.__listeners && this.__listeners.close) || [];
      handlers.forEach((fn) => fn());
    }
  };
  if (tag === "DIALOG") {
    el.showModal = function () {
      this.open = true;
    };
  }
  return el;
}

function makeStorage(seed) {
  const storage = Object.assign({}, seed || {});
  return {
    storage,
    localStorage: {
      getItem(k) {
        return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null;
      },
      setItem(k, v) {
        storage[k] = String(v);
      },
      removeItem(k) {
        delete storage[k];
      }
    }
  };
}

function boot(options) {
  const opts = options && typeof options === "object" ? options : {};
  const { storage, localStorage } = makeStorage(opts.seedStorage);
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: (tag) => createElementStub(tag),
    getElementById(id) {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub("div"));
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const dialog = createElementStub("dialog");
  dialog.returnValue = "";
  [
    "clearWorkflowRunDataConfirmDialog",
    "clearWorkflowRunDataConfirmTitle",
    "clearWorkflowRunDataConfirmBody",
    "clearWorkflowRunDataConfirmCancel",
    "clearWorkflowRunDataConfirmSubmit",
    "workflowSteps"
  ].forEach((id) => {
    elementStore.set(id, id === "clearWorkflowRunDataConfirmDialog" ? dialog : createElementStub("div"));
  });

  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, uuid: () => "uuid-test" },
    localStorage,
    confirm: typeof opts.confirm === "function" ? opts.confirm : () => false,
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  workflowResources.resetStorageBackendForTests();
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, storage, dialog, elementStore };
}

function assertRunDataCleared(storage, workflowId) {
  const raw = storage[RUNKEY];
  if (!raw) return;
  const store = JSON.parse(raw);
  const rec = store[workflowId];
  if (!rec) return;
  assert.equal(Object.keys(rec.capturedOutputs || {}).length, 0);
  assert.equal(Object.keys(rec.capturedOutputsRaw || {}).length, 0);
  assert.equal(Object.keys(rec.captureRefs || {}).length, 0);
  assert.equal(Object.keys(rec.stepCompleted || {}).length, 0);
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
const appSource = fs.readFileSync(appJsPath, "utf8");

test("A: Markup exposes accessible clear-run-data confirmation dialog", () => {
  assert.match(indexHtml, /id="clearWorkflowRunDataConfirmDialog"/);
  assert.match(indexHtml, /aria-labelledby="clearWorkflowRunDataConfirmTitle"/);
  assert.match(indexHtml, /aria-describedby="clearWorkflowRunDataConfirmBody"/);
  assert.match(indexHtml, /id="clearWorkflowRunDataConfirmCancel"[\s\S]*?\bautofocus\b/);
  assert.match(indexHtml, /class="btn small danger"[\s\S]*id="clearWorkflowRunDataConfirmSubmit"/);
  assert.match(indexHtml, /Clear run data/);
  assert.match(indexHtml, /app\.js\?v=20260812-s75-ps-progressive/);
});

test("B: Confirmation copy identifies the selected workflow", () => {
  const { api } = boot();
  const copy = api.buildClearWorkflowRunDataConfirmCopyForTest("Roman Roads");
  assert.equal(copy.title, 'Clear run data for "Roman Roads"?');
  assert.match(copy.body, /Run progress, captured data and generated assets/);
  assert.match(copy.body, /workflow itself and its settings will not be deleted/);
  assert.match(copy.body, /cannot be undone/i);
});

test("C: Cancel leaves run state and workflow definition untouched", async () => {
  const wf = {
    id: "wf-clear-1",
    name: "Demo Workflow",
    createdAt: 1000,
    updatedAt: 2000,
    steps: [{ id: "step-1", title: "Step 1" }]
  };
  const runRecord = {
    runIndex: 1,
    stepCompleted: { "step-1": true },
    capturedOutputs: { "step-1": "{\"ok\":true}" }
  };
  const { api, storage, dialog } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wf]),
      [RUNKEY]: JSON.stringify({ "wf-clear-1": runRecord })
    }
  });

  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wf))]);
  api.setSelectedWorkflowIdForTest("wf-clear-1");
  api.setWorkflowRunCapturedOutputsForTest({ "step-1": "{\"ok\":true}" });
  api.saveWorkflowsForTest();

  dialog.returnValue = "cancel";
  const cancelPromise = api.requestClearWorkflowRunDataConfirmationForTest("Demo Workflow");
  dialog.close();
  assert.equal(await cancelPromise, false);

  assert.ok(storage[RUNKEY].includes("wf-clear-1"));
  assert.equal(api.getWorkflowsForTest().length, 1);
  assert.equal(api.getWorkflowsForTest()[0].name, "Demo Workflow");
  assert.equal(api.getWorkflowsForTest()[0].steps[0].id, "step-1");
});

test("D: Confirm invokes existing cleanup without changing workflow definition", async () => {
  const wf = {
    id: "wf-clear-2",
    name: "Keep Definition",
    createdAt: 1000,
    updatedAt: 2000,
    steps: [{ id: "step-a", title: "Step A" }]
  };
  const runRecord = {
    runIndex: 2,
    stepCompleted: { "step-a": true },
    capturedOutputs: { "step-a": "{\"done\":true}" }
  };
  const { api, storage, dialog } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wf]),
      [RUNKEY]: JSON.stringify({ "wf-clear-2": runRecord })
    }
  });

  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wf))]);
  api.setSelectedWorkflowIdForTest("wf-clear-2");
  api.setWorkflowRunCapturedOutputsForTest({ "step-a": "{\"done\":true}" });
  api.saveWorkflowsForTest();

  dialog.returnValue = "confirm";
  const confirmPromise = api.requestClearWorkflowRunDataConfirmationForTest("Keep Definition");
  dialog.close();
  assert.equal(await confirmPromise, true);

  api.executeClearWorkflowRunDataForTest("wf-clear-2");

  const runStore = JSON.parse(storage[RUNKEY] || "{}");
  assert.equal(runStore["wf-clear-2"], undefined);
  assert.equal(api.getWorkflowsForTest().length, 1);
  assert.equal(api.getWorkflowsForTest()[0].id, "wf-clear-2");
  assert.equal(api.getWorkflowsForTest()[0].name, "Keep Definition");
  assert.equal(api.getWorkflowsForTest()[0].steps[0].id, "step-a");
  const captureRefs = api.getWorkflowRunCaptureRefsForTest();
  assert.equal(Object.keys(captureRefs).length, 0);
  assert.equal(Object.keys(api.getWorkflowRunCapturedOutputsForTest()).length, 0);
});

test("E: handleClearWorkflowRunData waits for confirmation before cleanup", async () => {
  const wf = {
    id: "wf-clear-3",
    name: "Gate Test",
    steps: [{ id: "s1", title: "One" }]
  };
  const { api, storage, dialog } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wf]),
      [RUNKEY]: JSON.stringify({
        "wf-clear-3": { capturedOutputs: { s1: "{}" } }
      })
    }
  });

  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wf))]);
  api.setSelectedWorkflowIdForTest("wf-clear-3");
  api.setWorkflowRunCapturedOutputsForTest({ s1: "{}" });

  dialog.returnValue = "confirm";
  api.handleClearWorkflowRunDataForTest();
  dialog.close();
  await new Promise((resolve) => setTimeout(resolve, 0));

  assertRunDataCleared(storage, "wf-clear-3");
  assert.equal(Object.keys(api.getWorkflowRunCapturedOutputsForTest()).length, 0);
  assert.match(appSource, /requestClearWorkflowRunDataConfirmation/);
  assert.match(appSource, /executeClearWorkflowRunData\(/);
  assert.match(appSource, /if \(!confirmed\) return;/);
});

test("F: executeClearWorkflowRunData preserves existing cleanup semantics", () => {
  const start = appSource.indexOf("function executeClearWorkflowRunData");
  assert.ok(start > 0);
  const end = appSource.indexOf("\n  function requestClearWorkflowRunDataConfirmation", start);
  const body = appSource.slice(start, end > 0 ? end : start + 600);
  assert.match(body, /clearWorkflowRunCaptureState\(/);
  assert.match(body, /resetWorkflowRunNavigationState\(/);
  assert.match(body, /updateWorkflowRunView\(/);
  assert.match(body, /Run data cleared\./);
});
