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
const RUNKEY = "promptr.workflows.runstate.v1";

function createElementStub() {
  return {
    value: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute() { return null; },
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; }
  };
}

function boot() {
  const storage = {};
  const localStorage = {
    getItem(k) { return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null; },
    setItem(k, v) { storage[k] = String(v); },
    removeItem(k) { delete storage[k]; },
    key(i) { const keys = Object.keys(storage); return i >= 0 && i < keys.length ? keys[i] : null; },
    get length() { return Object.keys(storage).length; }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById(id) {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
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
    URL: { createObjectURL: () => "blob:x", revokeObjectURL() {} },
    Blob: Blob,
    navigator: { storage: { estimate: () => Promise.resolve({ usage: 10_000_000, quota: 100_000_000 }) } },
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
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat(["lib/page-vnext-assemble.js"])
  );
  wirePageVnextAssembleForTests(windowStub, repoRoot);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, storage };
}

function storeRec(storage, workflowId) {
  const raw = storage[RUNKEY];
  if (!raw) return null;
  const store = JSON.parse(raw);
  return store[workflowId] || null;
}

function buildWorkflow(id) {
  return {
    id,
    name: "WF " + id,
    steps: [{ id: "dla_step", canonical_step_id: "step_design_learning_activities", title: "DLA", outputName: "page" }]
  };
}

test("new capture persists as resource refs, not inline localStorage bodies", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-res-1");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const payload = JSON.stringify({ artifact_type: "page", sections: [{ a: "x".repeat(18000) }] });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(
    wf.id,
    "dla_step",
    payload,
    payload
  );
  assert.equal(put.ok, true, JSON.stringify(put));
  api.setWorkflowRunCaptureRefsForTest({ dla_step: put.refs });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { observedStepId: "dla_step" });
  const rec = storeRec(storage, wf.id);
  assert.ok(rec.captureRefs && rec.captureRefs.dla_step);
  assert.equal(Object.keys(rec.capturedOutputs || {}).length, 0);
  assert.equal(Object.keys(rec.capturedOutputsRaw || {}).length, 0);
});

test("raw===final stores one resource payload via shared ref", async () => {
  const { api } = boot();
  const wf = buildWorkflow("wf-res-2");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const payload = JSON.stringify({ value: "same" });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(
    wf.id,
    "dla_step",
    payload,
    payload
  );
  assert.equal(put.ok, true, JSON.stringify(put));
  assert.equal(put.refs.raw.resource_id, put.refs.final.resource_id);
});

test("raw!==final stores separate raw/final resources", async () => {
  const { api } = boot();
  const wf = buildWorkflow("wf-res-3");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const raw = JSON.stringify({ value: "raw", extra: true });
  const final = JSON.stringify({ value: "final" });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(
    wf.id,
    "dla_step",
    raw,
    final
  );
  assert.equal(put.ok, true, JSON.stringify(put));
  assert.notEqual(put.refs.raw.resource_id, put.refs.final.resource_id);
});

test("cold restore hydrates capture payload from refs", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-res-4");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const payload = JSON.stringify({ artifact_type: "page", sections: [{ text: "DLA " + "x".repeat(17000) }] });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(
    wf.id,
    "dla_step",
    payload,
    payload
  );
  api.setWorkflowRunCaptureRefsForTest({ dla_step: put.refs });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { observedStepId: "dla_step" });
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
  const live = api.getWorkflowRunCapturedOutputsForTest();
  assert.equal(String(live.dla_step || "").length > 1000, true);
  const rec = storeRec(storage, wf.id);
  assert.ok(rec.captureRefs.dla_step.final.resource_id);
});

test("legacy inline runstate migrates safely to refs", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-res-5");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const big = JSON.stringify({ text: "x".repeat(20000) });
  api.setWorkflowRunCapturedOutputsForTest({ dla_step: big });
  api.setWorkflowRunCapturedOutputsRawForTest({ dla_step: big });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { observedStepId: "dla_step" });
  // Force legacy inline shape.
  const store = api.loadWorkflowRunStateStoreForTest();
  store[wf.id].capturedOutputs = { dla_step: big };
  store[wf.id].capturedOutputsRaw = { dla_step: big };
  store[wf.id].captureRefs = {};
  storage[RUNKEY] = JSON.stringify(store);
  const beforeChars = String(storage[RUNKEY] || "").length;
  const migration = await api.migrateLegacyInlineWorkflowRunCapturesToResourceRefsForTest(wf.id);
  assert.equal(migration.migrated >= 1, true);
  const after = storeRec(storage, wf.id);
  assert.ok(after.captureRefs && after.captureRefs.dla_step);
  assert.equal(Object.keys(after.capturedOutputs || {}).length, 0);
  assert.equal(Object.keys(after.capturedOutputsRaw || {}).length, 0);
  const afterChars = String(storage[RUNKEY] || "").length;
  assert.equal(afterChars < beforeChars, true);
});

test("failed migration retains legacy inline payload", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-res-6");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const big = JSON.stringify({ text: "x".repeat(5000) });
  const failingBackend = {
    kind: "memory",
    putMeta: () => Promise.reject(new Error("meta_write_failed")),
    getMeta: () => Promise.resolve(null),
    putPayload: () => Promise.resolve({ ok: true }),
    getPayload: () => Promise.resolve(null),
    deletePayload: () => Promise.resolve({ ok: true }),
    listMetaByWorkflow: () => Promise.resolve([]),
    clear: () => Promise.resolve({ ok: true })
  };
  workflowResources.setStorageBackend(failingBackend);
  api.setWorkflowRunCapturedOutputsForTest({ dla_step: big });
  api.setWorkflowRunCapturedOutputsRawForTest({ dla_step: big });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { observedStepId: "dla_step" });
  const store = api.loadWorkflowRunStateStoreForTest();
  store[wf.id].capturedOutputs = { dla_step: big };
  store[wf.id].capturedOutputsRaw = { dla_step: big };
  store[wf.id].captureRefs = {};
  storage[RUNKEY] = JSON.stringify(store);
  const migration = await api.migrateLegacyInlineWorkflowRunCapturesToResourceRefsForTest(wf.id);
  assert.equal(migration.ok, false);
  const rec = storeRec(storage, wf.id);
  assert.equal(String(rec.capturedOutputs.dla_step || "").length > 1000, true);
  workflowResources.resetStorageBackendForTests();
});

test("localStorage runstate stays lightweight after resource-backed persist", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-res-7");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const payload = JSON.stringify({ text: "x".repeat(3000) });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(
    wf.id,
    "dla_step",
    payload,
    payload
  );
  api.setWorkflowRunCaptureRefsForTest({ dla_step: put.refs });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { observedStepId: "dla_step" });
  const usage = api.buildLocalStorageUsageSnapshotForTest();
  assert.equal(typeof usage.runstateChars, "number");
  assert.equal(usage.runstateChars < payload.length, true);
  const rec = storeRec(storage, wf.id);
  assert.ok(rec.captureRefs.dla_step);
  assert.equal(Object.keys(rec.capturedOutputs || {}).length, 0);
});

test("resource write failure is surfaced and inline data is not claimed durable", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-res-8");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const payload = JSON.stringify({ text: "x".repeat(2000) });
  workflowResources.setStorageBackend({
    kind: "memory",
    putMeta: () => Promise.reject(new Error("meta_write_failed")),
    getMeta: () => Promise.resolve(null),
    putPayload: () => Promise.resolve({ ok: true }),
    getPayload: () => Promise.resolve(null),
    deletePayload: () => Promise.resolve({ ok: true }),
    listMetaByWorkflow: () => Promise.resolve([]),
    clear: () => Promise.resolve({ ok: true })
  });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(
    wf.id,
    "dla_step",
    payload,
    payload
  );
  assert.equal(put.ok, false);
  workflowResources.resetStorageBackendForTests();
});

test("Authoring assemble path hydrates capture refs before using live maps", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-res-9");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const payload = JSON.stringify({
    artifact_type: "page",
    title: "Hydrated Authoring",
    sections: [{ text: "y".repeat(1200) }]
  });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(
    wf.id,
    "dla_step",
    payload,
    payload
  );
  api.setWorkflowRunCaptureRefsForTest({ dla_step: put.refs });
  api.persistWorkflowRunStateForWorkflowForTest(wf.id, { observedStepId: "dla_step" });
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
  const live = api.getWorkflowRunCapturedOutputsForTest();
  assert.equal(String(live.dla_step || "").length > 500, true);
  assert.ok(storeRec(storage, wf.id).captureRefs.dla_step);
});
