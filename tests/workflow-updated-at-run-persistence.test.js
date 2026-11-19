/**
 * workflow.updatedAt must move with successful persisted run-data changes,
 * not only definition edits, and must drive Updated (newest) sorting.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");
const workflowResources = require("../lib/prism-workflow-resources.js");
const catalogueStore = require("../lib/prism-workflow-catalogue-store.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const RUNKEY = "promptr.workflows.runstate.v1";
const WFKEY = "promptr.workflows.v1";

function createElementStub(tagName) {
  const tag = String(tagName || "div").toUpperCase();
  const classSet = new Set();
  const el = {
    tagName: tag,
    value: "",
    textContent: "",
    innerHTML: "",
    className: "",
    children: [],
    style: {},
    dataset: {},
    disabled: false,
    open: false,
    returnValue: "",
    classList: {
      add: (...names) => names.forEach((n) => classSet.add(String(n))),
      remove: (...names) => names.forEach((n) => classSet.delete(String(n))),
      contains: (name) => classSet.has(String(name)),
      toggle: (name, force) => {
        const key = String(name);
        if (force === true) {
          classSet.add(key);
          return true;
        }
        if (force === false) {
          classSet.delete(key);
          return false;
        }
        if (classSet.has(key)) {
          classSet.delete(key);
          return false;
        }
        classSet.add(key);
        return true;
      }
    },
    appendChild(child) {
      this.children.push(child);
      child.parentNode = this;
      return child;
    },
    removeChild(childEl) {
      this.children = this.children.filter((c) => c !== childEl);
      if (childEl) childEl.parentNode = null;
      return childEl;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
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
    setAttribute() {},
    removeAttribute() {},
    getAttribute() {
      return null;
    },
    focus() {},
    click() {}
  };
  if (tag === "DIALOG") {
    el.showModal = function () {
      this.open = true;
      this.returnValue = this.__nextReturnValue || "cancel";
      setTimeout(() => this.close(), 0);
    };
    el.close = function () {
      this.open = false;
      const handlers = (this.__listeners && this.__listeners.close) || [];
      handlers.forEach((fn) => fn());
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

function workflow(id, name, updatedAt, createdAt) {
  return {
    id,
    name,
    createdAt: createdAt != null ? createdAt : 1000,
    updatedAt: updatedAt != null ? updatedAt : 2000,
    selectedDomains: ["general"],
    workflowInputs: [],
    workflowOutputs: [],
    workflowOutputSpec: { goal: "Goal " + name },
    steps: [
      {
        id: "step-" + id,
        title: "Step",
        prompt_source_type: "local_override",
        prompt_source: "local_override",
        promptId: "",
        override_prompt_body: "Return JSON.",
        outputName: "artifact",
        inputBindings: []
      }
    ]
  };
}

async function flush() {
  for (let i = 0; i < 24; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

function boot(options) {
  const opts = options && typeof options === "object" ? options : {};
  const { storage, localStorage } = makeStorage(opts.seedStorage);
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const elementStore = new Map();

  [
    "toastContainer",
    "workflowSteps",
    "workflowList",
    "workflowDetail",
    "workflowName",
    "workflowLibraryTags",
    "workflowLibraryNotes",
    "workflowMetaCreated",
    "workflowMetaUpdated",
    "workflowArtefacts",
    "workflowOutputs",
    "workflowStartingArtefact",
    "workflowAudience",
    "workflowGoal",
    "workflowConstraints",
    "deleteWorkflowBtn",
    "duplicateWorkflowBtn",
    "renameWorkflowBtn",
    "clearWorkflowRunDataBtn",
    "exportWorkflowBtn",
    "workflowValidationPanel",
    "workflowModeEditBtn",
    "workflowModeSettingsBtn",
    "workflowModeRunBtn",
    "workflowModeSettingsBadge",
    "workflowRunStatus",
    "workflowPrevStepBtn",
    "workflowNextStepBtn",
    "workflowRunCopyBtn",
    "workflowContinueToAuthoringBtn",
    "workflowSortSelect",
    "utilitiesSelectedWorkflowLabel",
    "utilitiesAssembledFromLabel",
    "utilitiesWorkflowMismatchWarning",
    "utilitiesJsonInput",
    "apiKeyStatus",
    "deleteWorkflowConfirmDialog",
    "deleteWorkflowConfirmTitle",
    "deleteWorkflowConfirmBody",
    "deleteWorkflowAlsoDeletePromptsRow",
    "deleteWorkflowAlsoDeletePrompts",
    "deleteWorkflowAlsoDeletePromptsLabel",
    "deleteWorkflowConfirmCancel",
    "deleteWorkflowConfirmSubmit",
    "clearWorkflowRunDataConfirmDialog",
    "clearWorkflowRunDataConfirmTitle",
    "clearWorkflowRunDataConfirmBody",
    "clearWorkflowRunDataConfirmCancel",
    "clearWorkflowRunDataConfirmSubmit"
  ].forEach((id) => {
    if (id.indexOf("Dialog") >= 0) {
      elementStore.set(id, createElementStub("dialog"));
    } else {
      elementStore.set(id, createElementStub(id.indexOf("Btn") >= 0 ? "button" : "div"));
    }
  });
  elementStore.get("workflowSortSelect").value = "updatedDesc";
  elementStore.get("workflowModeRunBtn").classList.contains = (name) => name === "active";
  elementStore.get("workflowDetail").classList.contains = (name) => name === "run-mode";

  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: (tag) => createElementStub(tag),
    getElementById(id) {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub("div"));
      return elementStore.get(id);
    },
    querySelector: () => createElementStub("div"),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };

  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: {
      debounce: (fn) => fn,
      uuid: (() => {
        let n = 0;
        return () => "wf-uuid-" + ++n;
      })(),
      formatDate: (ms) => "t:" + String(ms)
    },
    localStorage,
    confirm: () => false,
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
  sandbox.globalThis = windowStub;
  workflowResources.resetStorageBackendForTests();
  catalogueStore.resetStorageBackendForTests();
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
  sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  windowStub.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  windowStub.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return {
    api: sandbox.window.__PRISM_TEST_API,
    storage,
    catalogueStore
  };
}

function find(api, id) {
  return api.getWorkflowsForTest().find((wf) => wf.id === id);
}

async function awaitSave(api) {
  const outcome = api.saveWorkflowsForTest();
  if (outcome && typeof outcome.then === "function") await outcome;
  await flush();
}

test("1. Saving a new step result updates that workflow updatedAt", async () => {
  const wfA = workflow("wf-A", "Alpha", 2000, 1000);
  const wfB = workflow("wf-B", "Beta", 3000, 1100);
  const { api } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA, wfB]),
      [RUNKEY]: JSON.stringify({})
    }
  });
  await flush();
  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wfA)), JSON.parse(JSON.stringify(wfB))]);
  api.setSelectedWorkflowIdForTest("wf-A");
  api.restoreWorkflowRunStateForWorkflowForTest("wf-A");

  const put = await workflowResources.putTextResource({
    workflow_id: "wf-A",
    slot_key: "run_capture:step-wf-A:final",
    text_payload: "{\"v\":1}",
    mime_type: "application/json"
  });
  assert.equal(put.ok, true);

  const beforeA = find(api, "wf-A").updatedAt;
  const beforeB = find(api, "wf-B").updatedAt;
  const beforeCreatedA = find(api, "wf-A").createdAt;

  api.setWorkflowRunCaptureRefsForTest({
    "step-wf-A": {
      final: {
        resource_id: put.resource_id,
        slot_key: "run_capture:step-wf-A:final"
      }
    }
  });
  const persistResult = api.persistWorkflowRunStateForWorkflowForTest("wf-A", {
    source: "test_step_save",
    observedStepId: "step-wf-A"
  });
  await awaitSave(api);

  assert.equal(persistResult.ok, true);
  assert.equal(persistResult.touchedUpdatedAt, true);
  assert.ok(find(api, "wf-A").updatedAt > beforeA);
  assert.equal(find(api, "wf-A").createdAt, beforeCreatedA);
  assert.equal(find(api, "wf-B").updatedAt, beforeB);
});

test("2. Replacing or clearing run results updates updatedAt", async () => {
  const wfA = workflow("wf-A2", "Alpha2", 5000, 1000);
  const { api } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA]),
      [RUNKEY]: JSON.stringify({
        "wf-A2": {
          captureRefs: {
            "step-wf-A2": {
              final: { resource_id: "old", slot_key: "run_capture:step-wf-A2:final" }
            }
          },
          stepCompleted: { "step-wf-A2": true },
          runIndex: 0
        }
      })
    }
  });
  await flush();
  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wfA))]);
  api.setSelectedWorkflowIdForTest("wf-A2");
  api.restoreWorkflowRunStateForWorkflowForTest("wf-A2");

  const beforeReplace = find(api, "wf-A2").updatedAt;
  api.setWorkflowRunCaptureRefsForTest({
    "step-wf-A2": {
      final: { resource_id: "new", slot_key: "run_capture:step-wf-A2:final" }
    }
  });
  const replaceResult = api.persistWorkflowRunStateForWorkflowForTest("wf-A2", {
    source: "test_replace"
  });
  await awaitSave(api);
  assert.equal(replaceResult.ok, true);
  assert.equal(replaceResult.touchedUpdatedAt, true);
  const afterReplace = find(api, "wf-A2").updatedAt;
  assert.ok(afterReplace > beforeReplace);

  api.clearPersistedWorkflowRunStateForWorkflowForTest("wf-A2");
  await awaitSave(api);
  assert.ok(find(api, "wf-A2").updatedAt > afterReplace);
  assert.equal(find(api, "wf-A2").createdAt, 1000);
});

test("3. Editing a workflow definition updates updatedAt", async () => {
  const wfA = workflow("wf-edit", "Editable", 4000, 900);
  const { api } = boot({
    seedStorage: { [WFKEY]: JSON.stringify([wfA]), [RUNKEY]: JSON.stringify({}) }
  });
  await flush();
  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wfA))]);
  const before = find(api, "wf-edit").updatedAt;
  const touched = api.touchWorkflowUpdatedAtForTest("wf-edit", {
    persist: true,
    now: before + 1000
  });
  await awaitSave(api);
  assert.equal(touched.ok, true);
  assert.equal(find(api, "wf-edit").updatedAt, before + 1000);
  assert.equal(find(api, "wf-edit").createdAt, 900);
});

test("4. Read-only selection / navigation-style persist does not update updatedAt", async () => {
  const wfA = workflow("wf-ro", "Readonly", 8000, 1000);
  const { api } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA]),
      [RUNKEY]: JSON.stringify({
        "wf-ro": {
          captureRefs: {
            "step-wf-ro": {
              final: { resource_id: "r", slot_key: "run_capture:step-wf-ro:final" }
            }
          },
          stepCompleted: {},
          runIndex: 0,
          workflowResourceRefs: [],
          workflowPageResourceRefs: {}
        }
      })
    }
  });
  await flush();
  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wfA))]);
  api.setSelectedWorkflowIdForTest("wf-ro");
  api.restoreWorkflowRunStateForWorkflowForTest("wf-ro");
  const before = find(api, "wf-ro").updatedAt;

  const suppressed = api.persistWorkflowRunStateForWorkflowForTest("wf-ro", {
    source: "test_navigation",
    touchUpdatedAt: false
  });
  await flush();
  assert.equal(suppressed.ok, true);
  assert.equal(find(api, "wf-ro").updatedAt, before);

  // Unchanged activity fingerprint (same capture refs restored into live state).
  const noop = api.persistWorkflowRunStateForWorkflowForTest("wf-ro", {
    source: "test_selection_flush"
  });
  await flush();
  assert.equal(noop.ok, true);
  assert.equal(noop.touchedUpdatedAt, false);
  assert.equal(find(api, "wf-ro").updatedAt, before);
});

test("5. Updating one workflow does not change unrelated workflows", async () => {
  const wfA = workflow("wf-one", "One", 10000, 1);
  const wfB = workflow("wf-two", "Two", 20000, 2);
  const { api } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA, wfB]),
      [RUNKEY]: JSON.stringify({})
    }
  });
  await flush();
  api.setWorkflowsForTest([
    JSON.parse(JSON.stringify(wfA)),
    JSON.parse(JSON.stringify(wfB))
  ]);
  const beforeB = find(api, "wf-two").updatedAt;
  api.touchWorkflowUpdatedAtForTest("wf-one", { persist: true, now: 55555 });
  await awaitSave(api);
  assert.equal(find(api, "wf-one").updatedAt, 55555);
  assert.equal(find(api, "wf-two").updatedAt, beforeB);
});

test("6. updatedAt survives catalogue reload", async () => {
  const wfA = workflow("wf-reload", "Reload Me", 12000, 1000);
  const { api } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA]),
      [RUNKEY]: JSON.stringify({})
    }
  });
  await flush();
  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wfA))]);
  const touched = api.touchWorkflowUpdatedAtForTest("wf-reload", {
    persist: false,
    now: 77777
  });
  assert.equal(touched.ok, true);
  assert.equal(find(api, "wf-reload").updatedAt, 77777);
  await awaitSave(api);

  const durableRaw = await api.readDurableWorkflowCatalogueJsonForTest();
  const persisted = JSON.parse(durableRaw || "[]");
  const row = persisted.find((w) => w.id === "wf-reload");
  assert.ok(row, "workflow present in durable catalogue");
  assert.equal(row.updatedAt, 77777);
  assert.equal(row.createdAt, 1000);

  // Reload path: normalize + rehydrate catalogue from durable JSON.
  const normalized = persisted.map((wf) => api.normalizeWorkflowForV1(wf, []));
  api.setWorkflowsForTest(normalized);
  const reloaded = find(api, "wf-reload");
  assert.ok(reloaded);
  assert.equal(reloaded.updatedAt, 77777);
  assert.equal(reloaded.createdAt, 1000);
});

test("7. Older records remain compatible; Updated (newest) uses same timestamp", async () => {
  const legacy = {
    id: "wf-legacy",
    name: "Legacy",
    createdAt: 50,
    steps: []
  };
  const newer = workflow("wf-newer", "Newer", 9000, 60);
  const olderUpdated = workflow("wf-older", "Older", 1000, 70);
  const { api } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([legacy, newer, olderUpdated]),
      [RUNKEY]: JSON.stringify({})
    }
  });
  await flush();
  api.setWorkflowsForTest([
    JSON.parse(JSON.stringify(legacy)),
    JSON.parse(JSON.stringify(newer)),
    JSON.parse(JSON.stringify(olderUpdated))
  ]);

  const sorted = api.applyWorkflowListFiltersForTest(api.getWorkflowsForTest(), {
    sort: "updatedDesc"
  });
  assert.equal(sorted[0].id, "wf-newer");
  assert.equal(sorted[1].id, "wf-older");
  assert.equal(sorted[2].id, "wf-legacy");
  assert.equal(sorted[0].updatedAt, find(api, "wf-newer").updatedAt);

  const imported = api.buildImportedWorkflowForExistingIdentityForTest(
    find(api, "wf-newer"),
    Object.assign({}, find(api, "wf-newer"), { name: "Newer imported" })
  );
  assert.equal(imported.createdAt, 60);
  assert.ok(typeof imported.updatedAt === "number" && imported.updatedAt >= 9000);
  assert.equal(find(api, "wf-legacy").updatedAt, undefined);
});
