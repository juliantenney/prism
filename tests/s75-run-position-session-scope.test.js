"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const workflowResources = require("../lib/prism-workflow-resources.js");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const RUNKEY = "promptr.workflows.runstate.v1";
const WFKEY = "promptr.workflows.v1";

function createElementStub() {
  return {
    value: "",
    textContent: "",
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
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    removeEventListener() {},
    focus() {},
    click() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
}

function boot(seedStorage) {
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
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    setTimeout,
    clearTimeout,
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn, uuid: () => "id-" + Math.random().toString(16).slice(2) },
    localStorage,
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
  if (!seedStorage) {
    workflowResources.resetStorageBackendForTests();
  }
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, storage };
}

async function persistCaptureRefs(api, workflowId, capturesRaw, capturesFinal) {
  const refs = {};
  const keys = Object.keys(capturesRaw || {});
  for (const sid of keys) {
    const put = await api.persistWorkflowRunCapturePayloadForStepForTest(
      workflowId,
      sid,
      capturesRaw[sid],
      capturesFinal[sid]
    );
    assert.equal(put.ok, true);
    refs[sid] = put.refs;
  }
  api.setWorkflowRunCaptureRefsForTest(refs);
}

function buildWorkflow(id) {
  return {
    id: id || "wf-s75-session",
    name: "Session Rule Workflow",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "ep_step",
        title: "Design Episode Plan",
        outputName: "page",
        canonical_step_id: "step_design_episode_plan"
      },
      {
        id: "dla_step",
        title: "Design Learning Activities",
        outputName: "page",
        canonical_step_id: "step_design_learning_activities"
      },
      {
        id: "gam_step",
        title: "Generate Activity Materials",
        outputName: "page",
        canonical_step_id: "step_generate_activity_materials"
      },
      {
        id: "ls_step",
        title: "Construct Learning Sequence",
        outputName: "page",
        canonical_step_id: "step_construct_learning_sequence"
      },
      {
        id: "dp_step",
        title: "Design Page",
        outputName: "page",
        canonical_step_id: "step_design_page"
      }
    ]
  };
}

function captureMapsForWorkflow(wf) {
  const captures = {};
  const capturesRaw = {};
  const completed = {};
  (wf.steps || []).forEach((step) => {
    captures[step.id] = "CAPTURE::" + step.id;
    capturesRaw[step.id] = "RAW::" + step.id;
    completed[step.id] = true;
  });
  return { captures, capturesRaw, completed };
}

test("A: same session keeps Run step after Authoring and back", () => {
  const { api } = boot();
  const wf = buildWorkflow("wf-a");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowDetailModeForTest("run");
  api.setCurrentWorkflowRunIndexForTest(4);
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });
  api.handleContinueToAuthoringForTest();
  api.setWorkflowDetailModeForTest("run");
  assert.equal(api.getCurrentWorkflowRunIndexForTest(), 4);
});

test("B: same session Run -> Edit -> Run preserves current step", () => {
  const { api } = boot();
  const wf = buildWorkflow("wf-b");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setWorkflowDetailModeForTest("run");
  api.setCurrentWorkflowRunIndexForTest(4);
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });
  api.setWorkflowDetailModeForTest("edit");
  api.setWorkflowDetailModeForTest("run");
  assert.equal(api.getCurrentWorkflowRunIndexForTest(), 4);
});

test("C/D/E: cold session starts at Step 1 while captures restore", async () => {
  const first = boot();
  const wf = buildWorkflow("wf-cold");
  const { captures, capturesRaw, completed } = captureMapsForWorkflow(wf);
  first.api.setWorkflowsForTest([wf]);
  first.api.setSelectedWorkflowIdForTest(wf.id);
  first.api.setWorkflowRunCapturedOutputsForTest(captures);
  first.api.setWorkflowRunCapturedOutputsRawForTest(capturesRaw);
  first.api.setWorkflowRunStepCompletedForTest(completed);
  await persistCaptureRefs(first.api, wf.id, capturesRaw, captures);
  first.api.setCurrentWorkflowRunIndexForTest(4);
  first.api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });
  first.api.saveWorkflowsForTest();
  const storeBefore = JSON.parse(first.storage[RUNKEY] || "{}");
  assert.equal(storeBefore[wf.id].runIndex, 4);

  const second = boot(first.storage);
  await second.api.loadWorkflowsForTest();
  await second.api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
  assert.equal(second.api.getCurrentWorkflowRunIndexForTest(), 0);
  const restoredRaw = second.api.getWorkflowRunCapturedOutputsRawForTest();
  assert.equal(Object.keys(restoredRaw).length, 5);
  assert.equal(restoredRaw.dla_step, "RAW::dla_step");
  assert.equal(restoredRaw.gam_step, "RAW::gam_step");

  second.api.setCurrentWorkflowRunIndexForTest(2);
  const afterNav = second.api.getWorkflowRunCapturedOutputsRawForTest();
  assert.equal(afterNav.dla_step, "RAW::dla_step");
  assert.equal(afterNav.dp_step, "RAW::dp_step");
});

test("F: workflow selection does not clear restored capture maps", async () => {
  const first = boot();
  const wfA = buildWorkflow("wf-a");
  const wfB = buildWorkflow("wf-b");
  const { captures, capturesRaw, completed } = captureMapsForWorkflow(wfA);
  first.api.setWorkflowsForTest([wfA, wfB]);
  first.api.setSelectedWorkflowIdForTest(wfA.id);
  first.api.setWorkflowRunCapturedOutputsForTest(captures);
  first.api.setWorkflowRunCapturedOutputsRawForTest(capturesRaw);
  first.api.setWorkflowRunStepCompletedForTest(completed);
  await persistCaptureRefs(first.api, wfA.id, capturesRaw, captures);
  first.api.setCurrentWorkflowRunIndexForTest(4);
  first.api.persistWorkflowRunStateForWorkflowForTest(wfA.id, { toastType: "" });
  first.api.saveWorkflowsForTest();

  const second = boot(first.storage);
  await second.api.loadWorkflowsForTest();
  second.api.setSelectedWorkflowIdForTest(wfB.id);
  second.api.restoreWorkflowRunStateForWorkflowForTest(wfB.id);
  second.api.setSelectedWorkflowIdForTest(wfA.id);
  second.api.restoreWorkflowRunStateForWorkflowForTest(wfA.id);
  await second.api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wfA.id);
  const restoredRaw = second.api.getWorkflowRunCapturedOutputsRawForTest();
  assert.equal(Object.keys(restoredRaw).length, 5);
  assert.equal(restoredRaw.ls_step, "RAW::ls_step");
});

test("stored runIndex remains in durable schema but is session-ignored on cold load", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-schema");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setCurrentWorkflowRunIndexForTest(4);
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });
  const rec = JSON.parse(storage[RUNKEY] || "{}")[wf.id];
  assert.equal(rec.runIndex, 4);
  storage[WFKEY] = JSON.stringify([wf]);

  const next = boot(storage);
  await next.api.loadWorkflowsForTest();
  assert.equal(next.api.getCurrentWorkflowRunIndexForTest(), 0);
});

