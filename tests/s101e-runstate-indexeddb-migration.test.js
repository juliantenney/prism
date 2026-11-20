/**
 * Sprint 101E — Workflow run-state IndexedDB migration.
 * Authoritative durability must not require localStorage.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const workflowResources = require("../lib/prism-workflow-resources.js");
const workflowRunstateStore = require("../lib/prism-workflow-runstate-store.js");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  injectLearnerRendererVNextInSandbox,
  wirePageVnextAssembleForTests
} = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const RUNKEY = "promptr.workflows.runstate.v1";
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "expository-development-s101e-persist.json"
);

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

function buildPayload() {
  const base = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  let pad = "";
  while (pad.length < 8000) {
    pad += " Extended exposition with ∇f=λ∇g nested generation_notes preservation. ";
  }
  base.sections[7].body = String(base.sections[7].body || "") + pad;
  return JSON.stringify(base, null, 2);
}

function boot(options) {
  const opts = options && typeof options === "object" ? options : {};
  const storage = Object.create(null);
  const sessionStorageData = Object.create(null);
  const toasts = [];
  const localStorage = {
    getItem(k) {
      if (opts.localStorageUnavailable) {
        const err = new Error("localStorage disabled");
        err.name = "SecurityError";
        throw err;
      }
      return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null;
    },
    setItem(k, v) {
      if (opts.localStorageQuota) {
        const err = new Error(
          "Failed to execute 'setItem' on 'Storage': Setting the value of '" +
            k +
            "' exceeded the quota."
        );
        err.name = "QuotaExceededError";
        throw err;
      }
      if (opts.localStorageUnavailable) {
        const err = new Error("localStorage disabled");
        err.name = "SecurityError";
        throw err;
      }
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
  const sessionStorage = {
    getItem(k) {
      return Object.prototype.hasOwnProperty.call(sessionStorageData, k)
        ? sessionStorageData[k]
        : null;
    },
    setItem(k, v) {
      sessionStorageData[k] = String(v);
    },
    removeItem(k) {
      delete sessionStorageData[k];
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
      toasts.push({ message: String(msg.textContent || ""), type: String(node.className || "") });
    }
    return node;
  };
  elementStore.set("toastContainer", toastContainer);
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
    sessionStorage,
    __PRISM_TEST_HARNESS__: true,
    URL: { createObjectURL: () => "blob:x", revokeObjectURL() {} },
    Blob: Blob,
    navigator: {
      storage: { estimate: () => Promise.resolve({ usage: 10_000_000, quota: 100_000_000 }) }
    },
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    }
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  sandbox.sessionStorage = sessionStorage;
  windowStub.window = windowStub;
  workflowResources.resetStorageBackendForTests();
  workflowRunstateStore.resetStorageBackendForTests();
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
  sandbox.PRISM_WORKFLOW_RUNSTATE_STORE = workflowRunstateStore;
  windowStub.PRISM_WORKFLOW_RUNSTATE_STORE = workflowRunstateStore;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(
    sandbox,
    repoRoot,
    PEDAGOGICAL_ICON_LIBS.concat([
      "lib/page-vnext-assemble.js",
      "lib/prism-workflow-runstate-store.js"
    ])
  );
  wirePageVnextAssembleForTests(windowStub, repoRoot);
  injectLearnerRendererVNextInSandbox(sandbox, repoRoot);
  sandbox.PRISM_WORKFLOW_RUNSTATE_STORE = workflowRunstateStore;
  windowStub.PRISM_WORKFLOW_RUNSTATE_STORE = workflowRunstateStore;
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return {
    api: sandbox.window.__PRISM_TEST_API,
    storage,
    sessionStorageData,
    toasts,
    runstateStore: workflowRunstateStore
  };
}

function buildExpoWorkflow(id) {
  return {
    id,
    name: "Expo IDB " + id,
    product: "expository",
    steps: [
      {
        id: "xd_step",
        title: "Expository Development",
        outputName: "expository_development",
        canonical_step_id: "step_expository_development"
      },
      {
        id: "xm_step",
        title: "Expository Materials",
        outputName: "expository_materials",
        canonical_step_id: "step_expository_materials"
      }
    ]
  };
}

function buildRunLi(stepId, outputName, value, canonicalStepId) {
  const ta = createElementStub();
  ta.value = value;
  const status = createElementStub();
  const outName = createElementStub();
  outName.value = outputName;
  const li = createElementStub();
  li.getAttribute = function (name) {
    if (name === "data-step-id") return stepId;
    if (name === "data-canonical-step-id") return canonicalStepId || "";
    return null;
  };
  li.querySelector = function (sel) {
    if (sel === '[data-field="runStepOutput"]') return ta;
    if (sel === '[data-role="run-step-output-status"]') return status;
    if (sel === '[data-field="outputName"]') return outName;
    return null;
  };
  return { li, ta };
}

function flush() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

test("runstate store prefers richer snapshots without deleting either", () => {
  const empty = null;
  const small = JSON.stringify({ wfA: { captureRefs: {}, stepCompleted: {} } });
  const rich = JSON.stringify({
    wfA: {
      captureRefs: { xd_step: { final: { resource_id: "wr-1" } } },
      stepCompleted: { xd_step: true }
    },
    wfB: { captureRefs: {}, stepCompleted: {} }
  });
  assert.equal(workflowRunstateStore.preferRicherRunStateJson(small, rich), rich);
  assert.equal(workflowRunstateStore.preferRicherRunStateJson(rich, small), rich);
  assert.equal(workflowRunstateStore.preferRicherRunStateJson(small, empty), small);
});

test("C1 Step 5 persists when localStorage is at quota (IndexedDB authoritative)", async () => {
  const { api, storage, toasts, runstateStore } = boot({ localStorageQuota: true });
  const wf = buildExpoWorkflow("wf-idb-quota");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setCurrentWorkflowRunIndexForTest(0);
  const payload = buildPayload();
  const { li } = buildRunLi(
    "xd_step",
    "expository_development",
    payload,
    "step_expository_development"
  );
  api.setWorkflowStepElementsForTest([li]);

  const syncResult = api.syncWorkflowRunCapturedOutputToStateForTest(li, {
    source: "user_input"
  });
  const outcome = syncResult && typeof syncResult.then === "function" ? await syncResult : syncResult;
  await flush();

  assert.equal(outcome && outcome.ok, true, JSON.stringify(outcome));
  assert.equal(
    toasts.filter((t) => /couldn't save this result/i.test(t.message)).length,
    0
  );
  // localStorage backup may be empty/failed — durable truth is IndexedDB/memory store.
  assert.equal(storage[RUNKEY], undefined);
  const idbRaw = await runstateStore.readRunStateJson();
  assert.ok(idbRaw, "runstate written to IndexedDB-backed store");
  const idbStore = JSON.parse(idbRaw);
  assert.ok(idbStore[wf.id]);
  assert.ok(idbStore[wf.id].captureRefs.xd_step.final.resource_id);

  // Simulate refresh: clear memory maps, hydrate from durable IDB (LS empty/quota).
  api.setWorkflowRunCapturedOutputsForTest({});
  api.setWorkflowRunCapturedOutputsRawForTest({});
  api.setWorkflowRunCaptureRefsForTest({});
  // Reset memory by re-reading from durable store.
  await api.hydrateWorkflowRunStateStoreFromDurableForTest();
  const liveStore = api.loadWorkflowRunStateStoreForTest();
  assert.ok(liveStore[wf.id].captureRefs.xd_step.final.resource_id);
  await api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(wf.id);
  const live = api.getWorkflowRunCapturedOutputsForTest();
  const parsed = JSON.parse(String(live.xd_step || "{}"));
  assert.equal(typeof parsed.generation_notes, "object");
  assert.doesNotMatch(String(live.xd_step || ""), /"generation_notes":\s*"\[object Object\]"/);
});

test("C1 Step 5 persists when localStorage is unavailable", async () => {
  const { api, runstateStore } = boot({ localStorageUnavailable: true });
  const wf = buildExpoWorkflow("wf-idb-nols");
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest(wf.id);
  api.setCurrentWorkflowRunIndexForTest(0);
  const payload = buildPayload();
  const { li } = buildRunLi(
    "xd_step",
    "expository_development",
    payload,
    "step_expository_development"
  );
  api.setWorkflowStepElementsForTest([li]);
  const syncResult = api.syncWorkflowRunCapturedOutputToStateForTest(li, {
    source: "user_input"
  });
  const outcome = syncResult && typeof syncResult.then === "function" ? await syncResult : syncResult;
  await flush();
  assert.equal(outcome && outcome.ok, true, JSON.stringify(outcome));
  const idbRaw = await runstateStore.readRunStateJson();
  assert.ok(JSON.parse(idbRaw)[wf.id].captureRefs.xd_step);
});

test("legacy localStorage runstate migrates into IndexedDB without deletion", async () => {
  const { api, storage, runstateStore } = boot();
  const legacy = {
    "wf-legacy": {
      captureRefs: {
        xd_step: { final: { resource_id: "wr-legacy", slot_key: "run_capture:xd_step:final" } }
      },
      stepCompleted: { xd_step: true },
      runIndex: 1,
      capturedOutputs: {},
      capturedOutputsRaw: {}
    }
  };
  storage[RUNKEY] = JSON.stringify(legacy);
  const result = await api.hydrateWorkflowRunStateStoreFromDurableForTest();
  assert.equal(result.migrated, true);
  assert.equal(result.source, "localStorage");
  // Legacy LS left in place.
  assert.ok(storage[RUNKEY]);
  const idbRaw = await runstateStore.readRunStateJson();
  assert.ok(JSON.parse(idbRaw)["wf-legacy"].captureRefs.xd_step.final.resource_id);
});

test("regression guard: authoritative runstate save path is IndexedDB", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  const saveStart = source.indexOf("function saveWorkflowRunStateStore");
  assert.ok(saveStart > 0);
  const saveEnd = source.indexOf("function buildWorkflowRunStateSnapshotForCurrentSelection", saveStart);
  const saveFn = source.slice(saveStart, saveEnd);
  assert.match(saveFn, /writeRunStateJson/);
  assert.match(saveFn, /tryWriteLocalWorkflowRunStateBackup/);
  // Authoritative success must not require localStorage.setItem of the runstate key.
  assert.doesNotMatch(
    saveFn,
    /window\.localStorage\.setItem\(\s*WORKFLOW_RUN_STATE_STORAGE_KEY/
  );
});

test("regression guard: first-party runstate key writes only via backup helper", () => {
  const root = path.resolve(__dirname, "..");
  const firstParty = [
    "app.js",
    "lib/prism-workflow-runstate-store.js",
    "lib/prism-workflow-catalogue-store.js",
    "lib/prism-workflow-resources.js"
  ];
  const allowedPatterns = [
    /tryWriteLocalWorkflowRunStateBackup/,
    /readLocalWorkflowRunStateJson/,
    /WORKFLOW_RUN_STATE_STORAGE_KEY/
  ];
  firstParty.forEach((rel) => {
    const text = fs.readFileSync(path.join(root, rel), "utf8");
    // Disallow direct setItem of the runstate key outside the named backup helper.
    const directWrites = [
      ...text.matchAll(
        /localStorage\.setItem\(\s*(?:WORKFLOW_RUN_STATE_STORAGE_KEY|["']promptr\.workflows\.runstate\.v1["'])/g
      )
    ];
    directWrites.forEach((match) => {
      const idx = match.index || 0;
      const window = text.slice(Math.max(0, idx - 220), idx + 80);
      assert.match(
        window,
        /tryWriteLocalWorkflowRunStateBackup|function tryWriteLocalWorkflowRunStateBackup/,
        rel + " must not write runstate key outside backup helper"
      );
    });
    void allowedPatterns;
  });
});
