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
const VERSIONKEY = "promptr.runCaptureStorageVersion";

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
    querySelectorAll() { return [] }
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
  if (!seedStorage) {
    workflowResources.resetStorageBackendForTests();
  }
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, storage };
}

function buildWorkflow(id, name) {
  return {
    id,
    name: name || "WF " + id,
    steps: [
      { id: "dla_step", canonical_step_id: "step_design_learning_activities", title: "DLA", outputName: "page" },
      { id: "gam_step", canonical_step_id: "step_generate_activity_materials", title: "GAM", outputName: "page" }
    ]
  };
}

function storeRec(storage, workflowId) {
  const raw = storage[RUNKEY];
  if (!raw) return null;
  return JSON.parse(raw)[workflowId] || null;
}

function seedInlineRunstate(storage, workflowId, stepId, finalText, rawText) {
  const store = {};
  store[workflowId] = {
    capturedOutputs: { [stepId]: finalText },
    capturedOutputsRaw: { [stepId]: rawText != null ? rawText : finalText },
    captureRefs: {},
    stepCompleted: {},
    runIndex: 0
  };
  storage[RUNKEY] = JSON.stringify(store);
}

function buildStepLi(stepId, textareaValue) {
  const ta = {
    value: textareaValue || "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } }
  };
  const li = {
    classList: { contains() { return false; } },
    getAttribute(name) {
      return name === "data-step-id" ? stepId : null;
    },
    querySelector(selector) {
      if (selector === '[data-field="runStepOutput"]') return ta;
      if (selector === '[data-field="outputName"]') return { value: "page" };
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
  return { li, ta };
}

test("A inline-only capture migrates to resource ref", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-a");
  api.setWorkflowsForTest([wf]);
  const payload = JSON.stringify({ text: "inline-only-" + "x".repeat(500) });
  seedInlineRunstate(storage, wf.id, "dla_step", payload, payload);
  const summary = await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  assert.equal(summary.capturesMigrated >= 1, true);
  const rec = storeRec(storage, wf.id);
  assert.ok(rec.captureRefs.dla_step);
  assert.equal(Object.keys(rec.capturedOutputs || {}).length, 0);
});

test("B identical raw/final uses one resource", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-b");
  api.setWorkflowsForTest([wf]);
  const payload = JSON.stringify({ same: true });
  seedInlineRunstate(storage, wf.id, "dla_step", payload, payload);
  await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  const rec = storeRec(storage, wf.id);
  assert.equal(rec.captureRefs.dla_step.raw.resource_id, rec.captureRefs.dla_step.final.resource_id);
});

test("C differing raw/final preserves both resources", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-c");
  api.setWorkflowsForTest([wf]);
  const raw = JSON.stringify({ mode: "raw", extra: true });
  const final = JSON.stringify({ mode: "final" });
  seedInlineRunstate(storage, wf.id, "dla_step", final, raw);
  await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  const rec = storeRec(storage, wf.id);
  assert.notEqual(rec.captureRefs.dla_step.raw.resource_id, rec.captureRefs.dla_step.final.resource_id);
});

test("D ref-only capture remains unchanged", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-d");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const payload = JSON.stringify({ refOnly: true });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(wf.id, "dla_step", payload, payload);
  const store = {};
  store[wf.id] = {
    capturedOutputs: {},
    capturedOutputsRaw: {},
    captureRefs: { dla_step: put.refs },
    stepCompleted: {},
    runIndex: 0
  };
  storage[RUNKEY] = JSON.stringify(store);
  const before = JSON.stringify(storeRec(storage, wf.id).captureRefs);
  const summary = await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  assert.equal(summary.capturesAlreadyResourceBacked >= 1, true);
  assert.equal(JSON.stringify(storeRec(storage, wf.id).captureRefs), before);
});

test("E inline+identical-ref removes inline after verification", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-e");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const payload = JSON.stringify({ mixed: "same" });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(wf.id, "dla_step", payload, payload);
  const store = {};
  store[wf.id] = {
    capturedOutputs: { dla_step: payload },
    capturedOutputsRaw: { dla_step: payload },
    captureRefs: { dla_step: put.refs },
    stepCompleted: {},
    runIndex: 0
  };
  storage[RUNKEY] = JSON.stringify(store);
  await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  const rec = storeRec(storage, wf.id);
  assert.equal(Object.keys(rec.capturedOutputs || {}).length, 0);
  assert.ok(rec.captureRefs.dla_step);
});

test("F broken ref + valid inline repairs correctly", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-f");
  api.setWorkflowsForTest([wf]);
  const payload = JSON.stringify({ repair: "inline" });
  const store = {};
  store[wf.id] = {
    capturedOutputs: { dla_step: payload },
    capturedOutputsRaw: { dla_step: payload },
    captureRefs: {
      dla_step: {
        final: { resource_id: "missing-resource-id", slot_key: "run_capture:dla_step:final" },
        raw: { resource_id: "missing-resource-id", slot_key: "run_capture:dla_step:raw" }
      }
    },
    stepCompleted: {},
    runIndex: 0
  };
  storage[RUNKEY] = JSON.stringify(store);
  const summary = await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  const rec = storeRec(storage, wf.id);
  assert.equal(summary.capturesMigrated >= 1, true);
  assert.equal(Object.keys(rec.capturedOutputs || {}).length, 0);
  assert.notEqual(rec.captureRefs.dla_step.final.resource_id, "missing-resource-id");
});

test("G inline/ref conflict is reported, not silently overwritten", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-g");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const inline = JSON.stringify({ source: "inline" });
  const resource = JSON.stringify({ source: "resource" });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(wf.id, "dla_step", resource, resource);
  const store = {};
  store[wf.id] = {
    capturedOutputs: { dla_step: inline },
    capturedOutputsRaw: { dla_step: inline },
    captureRefs: { dla_step: put.refs },
    stepCompleted: {},
    runIndex: 0
  };
  storage[RUNKEY] = JSON.stringify(store);
  const summary = await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  assert.equal(summary.conflicts.length >= 1, true);
  const rec = storeRec(storage, wf.id);
  assert.equal(String(rec.capturedOutputs.dla_step || ""), inline);
});

test("H migration failure preserves inline data", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-h");
  api.setWorkflowsForTest([wf]);
  const payload = JSON.stringify({ keep: "inline" });
  seedInlineRunstate(storage, wf.id, "dla_step", payload, payload);
  workflowResources.setStorageBackend({
    kind: "memory",
    putMeta: () => Promise.reject(new Error("write_failed")),
    getMeta: () => Promise.resolve(null),
    putPayload: () => Promise.resolve({ ok: true }),
    getPayload: () => Promise.resolve(null),
    deletePayload: () => Promise.resolve({ ok: true }),
    listMetaByWorkflow: () => Promise.resolve([]),
    clear: () => Promise.resolve({ ok: true })
  });
  const summary = await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  assert.equal(summary.failures.length >= 1, true);
  assert.equal(String(storeRec(storage, wf.id).capturedOutputs.dla_step || ""), payload);
  workflowResources.resetStorageBackendForTests();
});

test("I migration is idempotent", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-i");
  api.setWorkflowsForTest([wf]);
  const payload = JSON.stringify({ idempotent: true });
  seedInlineRunstate(storage, wf.id, "dla_step", payload, payload);
  const first = await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  const second = await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  assert.equal(first.capturesMigrated >= 1, true);
  assert.equal(second.capturesMigrated, 0);
  assert.equal(second.capturesAlreadyResourceBacked >= 1, true);
});

test("J orphaned runstate is reported, not deleted", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-owned");
  api.setWorkflowsForTest([wf]);
  const orphanId = "orphan-wf-id";
  const payload = JSON.stringify({ orphan: true });
  const store = {};
  store[orphanId] = {
    capturedOutputs: { orphan_step: payload },
    capturedOutputsRaw: { orphan_step: payload },
    captureRefs: {},
    stepCompleted: {},
    runIndex: 0
  };
  storage[RUNKEY] = JSON.stringify(store);
  const summary = await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  assert.equal(summary.orphanedRunstate.some((row) => row.workflowId === orphanId), true);
  assert.ok(storeRec(storage, orphanId));
});

test("K owned runstate stores refs not inline bodies after migration", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-k");
  api.setWorkflowsForTest([wf]);
  const payload = JSON.stringify({ durable: "ref" });
  seedInlineRunstate(storage, wf.id, "dla_step", payload, payload);
  await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  api.setRunCaptureStorageVersionForTest(2);
  const rec = storeRec(storage, wf.id);
  assert.ok(rec.captureRefs.dla_step);
  assert.equal(Object.keys(rec.capturedOutputs || {}).length, 0);
});

test("L cold restore hydrates from refs only", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-l");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const payload = JSON.stringify({ hydrate: "only-refs", body: "z".repeat(1200) });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(wf.id, "dla_step", payload, payload);
  storage[RUNKEY] = JSON.stringify({
    [wf.id]: {
      capturedOutputs: {},
      capturedOutputsRaw: {},
      captureRefs: { dla_step: put.refs },
      stepCompleted: {},
      runIndex: 0
    }
  });
  api.setRunCaptureStorageVersionForTest(2);
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  api.setWorkflowRunCaptureRefsForTest({});
  api.restoreWorkflowRunStateForWorkflowForTest(wf.id);
  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
  const live = api.getWorkflowRunCapturedOutputsForTest();
  assert.equal(String(live.dla_step || "").length > 500, true);
});

test("M fresh session starts at Step 1 with durable captures", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-m");
  api.setWorkflowsForTest([wf]);
  const payload = JSON.stringify({ step1: true });
  seedInlineRunstate(storage, wf.id, "dla_step", payload, payload);
  await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  api.setRunCaptureStorageVersionForTest(2);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.restoreWorkflowRunStateForWorkflowForTest(wf.id);
  assert.equal(api.getCurrentWorkflowRunIndexForTest(), 0);
});

test("N navigate to DLA after hydration binds textarea", async () => {
  const { api } = boot();
  const wf = buildWorkflow("wf-mig-n");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const payload = JSON.stringify({ dla: "hydrated-text", pad: "y".repeat(800) });
  api.setWorkflowRunCapturedOutputsForTest({ dla_step: payload });
  api.setWorkflowRunCapturedOutputsRawForTest({ dla_step: payload });
  const { li, ta } = buildStepLi("dla_step", "");
  const bound = api.bindWorkflowRunCaptureTextareaFromStateForTest(li, { force: true });
  assert.equal(bound, true);
  assert.equal(ta.value, payload);
});

test("O visible DLA during hydration updates textarea when ready", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-o");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const payload = JSON.stringify({ delayed: "hydrate", body: "q".repeat(600) });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(wf.id, "dla_step", payload, payload);
  storage[RUNKEY] = JSON.stringify({
    [wf.id]: {
      capturedOutputs: {},
      capturedOutputsRaw: {},
      captureRefs: { dla_step: put.refs },
      stepCompleted: {},
      runIndex: 0
    }
  });
  api.setRunCaptureStorageVersionForTest(2);
  api.setWorkflowRunCaptureRefsForTest({ dla_step: put.refs });
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  const { li, ta } = buildStepLi("dla_step", "");
  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
  api.bindWorkflowRunCaptureTextareaFromStateForTest(li, { force: true });
  assert.equal(ta.value, payload);
});

test("P blank pre-hydration DOM sync does not clobber hydrated capture", async () => {
  const { api } = boot();
  const wf = buildWorkflow("wf-mig-p");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setCurrentWorkflowRunIndexForTest(0);
  const payload = JSON.stringify({ keep: "hydrated" });
  api.setWorkflowRunCapturedOutputsForTest({ dla_step: payload });
  api.setWorkflowRunCapturedOutputsRawForTest({ dla_step: payload });
  const { li, ta } = buildStepLi("dla_step", "");
  api.syncWorkflowRunCapturedOutputToState(li, { source: "sync_all_dom" });
  const live = api.getWorkflowRunCapturedOutputsForTest();
  assert.equal(String(live.dla_step || ""), payload);
  assert.equal(ta.value, payload);
});

test("Q storage version marker set after clean owned migration", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-q");
  api.setWorkflowsForTest([wf]);
  const payload = JSON.stringify({ q: 1 });
  seedInlineRunstate(storage, wf.id, "dla_step", payload, payload);
  const summary = await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  assert.equal(summary.ownedInlineCapturesRemaining, 0);
  assert.equal(api.getRunCaptureStorageVersionForTest(), 2);
});

test("R no valid capture data silently deleted on conflict", async () => {
  const { api, storage } = boot();
  const wf = buildWorkflow("wf-mig-r");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  const inline = JSON.stringify({ keep: "both-inline" });
  const resource = JSON.stringify({ keep: "both-resource" });
  const put = await api.persistWorkflowRunCapturePayloadForStepForTest(wf.id, "dla_step", resource, resource);
  storage[RUNKEY] = JSON.stringify({
    [wf.id]: {
      capturedOutputs: { dla_step: inline },
      capturedOutputsRaw: { dla_step: inline },
      captureRefs: { dla_step: put.refs },
      stepCompleted: {},
      runIndex: 0
    }
  });
  await api.migrateAllWorkflowRunCapturesToResourceStoreForTest();
  const rec = storeRec(storage, wf.id);
  assert.equal(String(rec.capturedOutputs.dla_step || ""), inline);
  assert.ok(rec.captureRefs.dla_step);
});
