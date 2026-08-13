"use strict";

/**
 * Sprint 76 — empty Run capture must not durable-persist / false storage-full toasts.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const workflowResources = require("../lib/prism-workflow-resources.js");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox,
  wirePageVnextAssembleForTests
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const indexHtmlPath = path.join(repoRoot, "index.html");
const RUNKEY = "promptr.workflows.runstate.v1";
const fixtureDir = path.join(repoRoot, "tests", "fixtures", "page-assemble");

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
    children: [],
    appendChild(node) {
      this.children.push(node);
      return node;
    },
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    addEventListener() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
}

function boot(options) {
  const opts = options && typeof options === "object" ? options : {};
  const storage = {};
  const toasts = [];
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
  const elementStore = new Map();
  const toastContainer = createElementStub();
  toastContainer.appendChild = function (node) {
    this.children.push(node);
    const msg =
      node &&
      node.children &&
      node.children.find(function (c) {
        return c && c.className === "toast-message";
      });
    if (msg) {
      toasts.push({
        message: String(msg.textContent || ""),
        type: String(node.className || "")
      });
    }
    return node;
  };
  elementStore.set("toastContainer", toastContainer);

  const documentStub = {
    // Keep loading so app.js does not run init() → loadWorkflows(), which
    // would wipe selectedWorkflowId during async capture persist in this harness.
    readyState: "loading",
    addEventListener() {},
    createElement: (tag) => {
      const el = createElementStub();
      el.tagName = String(tag || "div").toUpperCase();
      return el;
    },
    getElementById(id) {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const putCalls = [];
  const copyCalls = [];
  const resourcesProxy = Object.create(workflowResources);
  const originalPut = workflowResources.putTextResource.bind(workflowResources);
  resourcesProxy.putTextResource = function (input) {
    putCalls.push({
      workflow_id: input && input.workflow_id,
      slot_key: input && input.slot_key,
      text_payload: input && input.text_payload != null ? String(input.text_payload) : ""
    });
    return originalPut(input);
  };

  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    setTimeout,
    clearTimeout,
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: {
      debounce: (fn) => fn,
      uuid: () => "id-" + Math.random().toString(16).slice(2),
      copyText: (text) => {
        copyCalls.push(String(text || ""));
        return Promise.resolve(true);
      }
    },
    localStorage,
    URL: { createObjectURL: () => "blob:x", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  if (!opts.retainResourceBackend) {
    workflowResources.resetStorageBackendForTests();
  }
  sandbox.PRISM_WORKFLOW_RESOURCES = resourcesProxy;
  windowStub.PRISM_WORKFLOW_RESOURCES = resourcesProxy;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat(["lib/page-vnext-assemble.js"])
  );
  wirePageVnextAssembleForTests(windowStub, repoRoot);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  // Ensure toast path is live for failure classification tests.
  if (api && typeof api.cacheElementsForTest === "function") {
    api.cacheElementsForTest();
  }
  return { api, storage, putCalls, copyCalls, toasts, resourcesProxy };
}

function storeRec(storage, workflowId) {
  const raw = storage[RUNKEY];
  if (!raw) return null;
  const store = JSON.parse(raw);
  return store[workflowId] || null;
}

function loadFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixtureDir, name), "utf8"));
}

function buildRunLi(stepId, outputName, initialValue, canonicalStepId) {
  const ta = createElementStub();
  ta.value = String(initialValue || "");
  const output = createElementStub();
  output.value = String(outputName || "");
  const status = createElementStub();
  const attrs = {
    "data-step-id": String(stepId || ""),
    "data-canonical-step-id": String(canonicalStepId || "")
  };
  const li = createElementStub();
  li.classList.contains = (name) => name === "workflow-step";
  li.setAttribute = (name, value) => {
    attrs[name] = String(value);
  };
  li.getAttribute = (name) =>
    Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null;
  li.querySelector = (selector) => {
    if (selector === '[data-field="runStepOutput"]') return ta;
    if (selector === '[data-field="outputName"]') return output;
    if (selector === '[data-role="run-step-output-status"]') return status;
    return null;
  };
  return { li, ta };
}

function buildArtefactWorkflow(id) {
  return {
    id: id || "wf-s76-empty",
    name: "S76 empty capture",
    pageEnrichmentV2: true,
    partialPageOutputs: true,
    steps: [
      {
        id: "step_1",
        title: "Normalize Content",
        outputName: "normalized_content",
        canonical_step_id: "step_normalize_content"
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

function flushMicrotasks() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

test("empty helper treats blank and whitespace as empty", () => {
  const { api } = boot();
  assert.equal(api.isWorkflowRunCapturePayloadEmptyForTest("", ""), true);
  assert.equal(api.isWorkflowRunCapturePayloadEmptyForTest("   ", "\n\t"), true);
  assert.equal(api.isWorkflowRunCapturePayloadEmptyForTest("{ }", ""), false);
  assert.equal(api.isWorkflowRunCapturePayloadEmptyForTest("", "{a:1}"), false);
});

test("empty/whitespace syncAll never calls putTextResource and creates no refs", async () => {
  const { api, storage, putCalls, toasts } = boot();
  const wf = buildArtefactWorkflow("wf-empty-1");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setCurrentWorkflowRunIndexForTest(0);
  // No durable runstate record — the pre-fix failure mode.
  const emptyLi = buildRunLi(
    "step_1",
    "normalized_content",
    "",
    "step_normalize_content"
  );
  const wsLi = buildRunLi("dp_step", "page", "   \n  ", "step_design_page");
  api.setWorkflowStepElementsForTest([emptyLi.li, wsLi.li]);

  api.syncAllWorkflowRunCapturesFromDomToState();
  api.syncAllWorkflowRunCapturesFromDomToState();
  api.syncAllWorkflowRunCapturesFromDomToState();
  await flushMicrotasks();

  assert.equal(putCalls.length, 0);
  assert.equal(storeRec(storage, wf.id), null);
  assert.equal(Object.keys(api.getWorkflowRunCaptureRefsForTest() || {}).length, 0);
  assert.equal(api.workflowStepHasPersistedRunDataForTest(wf.id, "step_1"), false);
  assert.equal(api.workflowStepHasPersistedRunDataForTest(wf.id, "dp_step"), false);
  assert.equal(
    toasts.filter((t) => /storage is full|couldn't save this result/i.test(t.message)).length,
    0
  );
});

test("whitespace-only capture on a single artefact step does not durable-write", async () => {
  const { api, storage, putCalls, toasts } = boot();
  const wf = buildArtefactWorkflow("wf-ws-only");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setCurrentWorkflowRunIndexForTest(1);
  const { li } = buildRunLi("dp_step", "page", " \t\n ", "step_design_page");
  api.setWorkflowStepElementsForTest([li]);
  const syncResult = api.syncWorkflowRunCapturedOutputToState(li, { source: "user_input" });
  if (syncResult && typeof syncResult.then === "function") {
    await syncResult;
  }
  await flushMicrotasks();
  assert.equal(putCalls.length, 0);
  assert.equal(storeRec(storage, wf.id), null);
  assert.equal(Object.keys(api.getWorkflowRunCaptureRefsForTest() || {}).length, 0);
  assert.equal(
    toasts.filter((t) => /storage is full|couldn't save this result/i.test(t.message)).length,
    0
  );
});

test("Copy path still syncs captures then copies instructions (contract)", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  const html = fs.readFileSync(indexHtmlPath, "utf8");
  assert.match(html, /id="workflowRunCopyBtn"/);
  assert.match(
    source,
    /els\.workflowRunCopyBtn\.addEventListener\("click"[\s\S]*stepCopyBtn\.click/
  );
  const copyStart = source.indexOf('copyBtn.addEventListener("click"');
  assert.ok(copyStart > 0);
  const copyEnd = source.indexOf("var moveUpBtn", copyStart);
  const copyFn = source.slice(copyStart, copyEnd);
  assert.match(copyFn, /syncAllWorkflowRunCapturesFromDomToState\(\)/);
  assert.match(copyFn, /buildWorkflowStepInstructions/);
  assert.match(copyFn, /Utils[\s\S]*copyText/);
  // Copy still copies even when capture sync is a no-op for empty payloads.
  assert.match(
    copyFn,
    /syncAllWorkflowRunCapturesFromDomToState\(\)[\s\S]*copyText/
  );
  // Empty-payload guard must sit ahead of durable put on the sync path.
  assert.match(
    source,
    /isWorkflowRunCapturePayloadEmpty\(persistedRawNow, persistedFinalNow\)[\s\S]*persistWorkflowRunCapturePayloadForStep/
  );
});

test("non-empty pasted result persists through PRISM_WORKFLOW_RESOURCES and writes refs", async () => {
  const { api, storage, putCalls } = boot();
  const wf = buildArtefactWorkflow("wf-nonempty");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setCurrentWorkflowRunIndexForTest(1);
  const dpPartial = loadFixture("dp-partial.json");
  const raw = JSON.stringify(dpPartial, null, 2);
  const { li } = buildRunLi("dp_step", "page", raw, "step_design_page");
  api.setWorkflowStepElementsForTest([
    buildRunLi("step_1", "normalized_content", "", "step_normalize_content").li,
    li
  ]);

  const syncResult = api.syncWorkflowRunCapturedOutputToState(li, { source: "user_input" });
  if (syncResult && typeof syncResult.then === "function") {
    await syncResult;
  }
  await flushMicrotasks();

  assert.ok(putCalls.length >= 1);
  assert.ok(putCalls.every((c) => String(c.text_payload || "").trim()));
  const liveRefs = api.getWorkflowRunCaptureRefsForTest();
  assert.ok(liveRefs.dp_step && liveRefs.dp_step.final && liveRefs.dp_step.final.resource_id);
  const rec = storeRec(storage, wf.id);
  assert.ok(rec);
  assert.ok(rec.captureRefs && rec.captureRefs.dp_step);
  assert.ok(
    rec.captureRefs.dp_step.final &&
      String(rec.captureRefs.dp_step.final.resource_id || "").trim()
  );
  assert.equal(Object.keys(rec.capturedOutputs || {}).length, 0);
  assert.equal(api.workflowStepHasPersistedRunDataForTest(wf.id, "dp_step"), true);
  assert.equal(api.isWorkflowRunAuthoringReadyForTest(wf.id), true);
});

test("genuine persisted capture survives reload/hydrate and marks saved-data", async () => {
  const { api, storage } = boot();
  const wf = buildArtefactWorkflow("wf-reload");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const dpPartial = loadFixture("dp-partial.json");
  const raw = JSON.stringify(dpPartial, null, 2);
  const finalText = JSON.stringify(dpPartial);
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(
    wf.id,
    "dp_step",
    raw,
    finalText
  );
  assert.equal(put.ok, true);
  api.setWorkflowRunCaptureRefsForTest({ dp_step: put.refs });
  api.setWorkflowRunCapturedOutputsForTest({ dp_step: finalText });
  api.setWorkflowRunCapturedOutputsRawForTest({ dp_step: raw });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { toastType: "" });

  // Simulate cold session maps, then hydrate.
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  api.setWorkflowRunCaptureRefsForTest(
    JSON.parse(storage[RUNKEY] ? JSON.stringify(JSON.parse(storage[RUNKEY])[wf.id].captureRefs) : "{}")
  );
  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
  const live = api.getWorkflowRunCapturedOutputsForTest();
  assert.ok(String(live.dp_step || "").trim());
  assert.equal(
    api.workflowStepHasPersistedRunDataForTest(wf.id, "dp_step"),
    true
  );
  assert.equal(api.workflowStepHasPersistedRunDataForTest(wf.id, "step_1"), false);
  const segments = api.buildWorkflowRunProgressSegmentsForTest({
    workflowId: wf.id,
    steps: wf.steps,
    currentIndex: 1
  });
  assert.equal(segments[1].hasSavedData, true);
  assert.equal(segments[0].hasSavedData, false);
});

test("toast classification: invalid_put_input is not storage-full", () => {
  const { api } = boot();
  const msg = api.buildWorkflowRunCapturePersistFailureToastMessageForTest(
    {
      ok: false,
      reason: "final_payload_write_failed",
      detail: { ok: false, code: "invalid_put_input", message: "Missing workflow, slot key, or text payload." }
    },
    { ok: false }
  );
  assert.equal(msg, api.WORKFLOW_RUN_CAPTURE_PERSIST_TOAST_GENERIC_FOR_TEST);
  assert.doesNotMatch(msg, /storage is full/i);
});

test("toast classification: resource_store_unavailable is not storage-full", () => {
  const { api } = boot();
  const msg = api.buildWorkflowRunCapturePersistFailureToastMessageForTest(
    { ok: false, reason: "resource_store_unavailable" },
    { ok: false }
  );
  assert.equal(msg, api.WORKFLOW_RUN_CAPTURE_PERSIST_TOAST_GENERIC_FOR_TEST);
});

test("toast classification: generic storage_write_failed is not storage-full", () => {
  const { api } = boot();
  const msg = api.buildWorkflowRunCapturePersistFailureToastMessageForTest(
    { ok: true },
    { ok: false, reason: "storage_write_failed" }
  );
  assert.equal(msg, api.WORKFLOW_RUN_CAPTURE_PERSIST_TOAST_GENERIC_FOR_TEST);
});

test("toast classification: genuine quota wording retained", () => {
  const { api } = boot();
  const msg = api.buildWorkflowRunCapturePersistFailureToastMessageForTest(
    {
      ok: false,
      reason: "payload_write_exception",
      message: "QuotaExceededError: storage full"
    },
    { ok: false }
  );
  assert.equal(msg, api.WORKFLOW_RUN_CAPTURE_PERSIST_TOAST_QUOTA_FOR_TEST);
  assert.match(msg, /storage is full/i);
});

test("hardcoded storage-full toast is no longer unconditional on persist failure", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  assert.match(source, /buildWorkflowRunCapturePersistFailureToastMessage/);
  assert.match(source, /isWorkflowRunCapturePayloadEmpty/);
  // Must not still hardcode the quota string as the only failure toast in sync.
  const syncStart = source.indexOf("function syncWorkflowRunCapturedOutputToState");
  const syncEnd = source.indexOf("function updateRunStepOutputStatus", syncStart);
  const syncFn = source.slice(syncStart, syncEnd);
  assert.doesNotMatch(
    syncFn,
    /showToast\(\s*"PRISM couldn't save this result because browser storage is full/
  );
});
