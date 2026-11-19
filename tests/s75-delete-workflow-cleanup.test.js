"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");
const workflowResources = require("../lib/prism-workflow-resources.js");
const originalDeleteResourcesForWorkflow = workflowResources.deleteResourcesForWorkflow;

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
    checked: false,
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
    removeChild(child) {
      this.children = this.children.filter((c) => c !== child);
      if (child) child.parentNode = null;
      return child;
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
      if (typeof this.__onShowModal === "function") {
        try {
          this.__onShowModal();
        } catch (_err) {}
      }
      const scripted = this.__nextReturnValue || "cancel";
      this.returnValue = scripted;
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

function workflow(id, name, stepId) {
  return {
    id,
    name,
    createdAt: 1000,
    updatedAt: 2000,
    selectedDomains: ["general"],
    workflowInputs: [],
    workflowOutputs: [],
    workflowOutputSpec: { goal: "Goal " + name },
    steps: [
      {
        id: stepId || "s-" + id,
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

function getToastMessages(toastContainer) {
  const rows = Array.isArray(toastContainer.children) ? toastContainer.children : [];
  return rows
    .map((toast) => {
      const msg = (toast.children || []).find((n) => n.className === "toast-message");
      return msg ? String(msg.textContent || "") : "";
    })
    .filter(Boolean);
}

function flushAsync(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms || 0));
}

async function flushDelete() {
  for (let i = 0; i < 16; i++) {
    await flushAsync(0);
  }
}

function boot(options) {
  const opts = options && typeof options === "object" ? options : {};
  const { storage, localStorage } = makeStorage(opts.seedStorage);
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
  const elementStore = new Map();

  const deleteDialog = createElementStub("dialog");
  deleteDialog.__nextReturnValue = opts.deleteDialogChoice || "cancel";
  const alsoDeletePrompts = createElementStub("input");
  alsoDeletePrompts.type = "checkbox";
  alsoDeletePrompts.checked = false;
  const alsoDeletePromptsRow = createElementStub("label");
  alsoDeletePromptsRow.classList.add("hidden");
  const alsoDeletePromptsLabel = createElementStub("span");
  if (opts.deleteAlsoRelatedPrompts) {
    deleteDialog.__onShowModal = function () {
      alsoDeletePrompts.checked = true;
    };
  }
  elementStore.set("deleteWorkflowConfirmDialog", deleteDialog);
  elementStore.set("deleteWorkflowConfirmTitle", createElementStub("h2"));
  elementStore.set("deleteWorkflowConfirmBody", createElementStub("p"));
  elementStore.set("deleteWorkflowAlsoDeletePromptsRow", alsoDeletePromptsRow);
  elementStore.set("deleteWorkflowAlsoDeletePrompts", alsoDeletePrompts);
  elementStore.set("deleteWorkflowAlsoDeletePromptsLabel", alsoDeletePromptsLabel);
  elementStore.set("deleteWorkflowConfirmCancel", createElementStub("button"));
  elementStore.set("deleteWorkflowConfirmSubmit", createElementStub("button"));

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
    "utilitiesSelectedWorkflowLabel",
    "utilitiesAssembledFromLabel",
    "utilitiesWorkflowMismatchWarning",
    "utilitiesJsonInput",
    "apiKeyStatus"
  ].forEach((id) => {
    if (!elementStore.has(id)) elementStore.set(id, createElementStub("div"));
  });

  const workflowModeRunBtn = elementStore.get("workflowModeRunBtn");
  const workflowDetail = elementStore.get("workflowDetail");
  workflowModeRunBtn.classList.contains = (name) => name === "active";
  workflowDetail.classList.contains = (name) => name === "run-mode";

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

  const libraryState = Array.isArray(opts.promptEntries) ? opts.promptEntries.slice() : [];
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
      formatDate: () => "date"
    },
    localStorage,
    confirm: () => false,
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve(libraryState.slice()),
      deletePrompt: (id) => {
        const target = String(id || "");
        const before = libraryState.length;
        for (let i = libraryState.length - 1; i >= 0; i -= 1) {
          if (String((libraryState[i] && libraryState[i].id) || "") === target) {
            libraryState.splice(i, 1);
          }
        }
        return Promise.resolve({ ok: true, deleted: before !== libraryState.length });
      }
    }
  };

  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  sandbox.globalThis = windowStub;
  workflowResources.resetStorageBackendForTests();
  // Always restore the real implementation first — a prior test may have
  // replaced deleteResourcesForWorkflow with a failing stub.
  workflowResources.deleteResourcesForWorkflow = originalDeleteResourcesForWorkflow;
  if (typeof opts.overrideDeleteResourcesForWorkflow === "function") {
    workflowResources.deleteResourcesForWorkflow = opts.overrideDeleteResourcesForWorkflow;
  }
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
  const catalogueStore = require("../lib/prism-workflow-catalogue-store.js");
  catalogueStore.resetStorageBackendForTests();
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
    toastContainer: elementStore.get("toastContainer"),
    libraryState,
    alsoDeletePrompts,
    alsoDeletePromptsRow,
    elementStore
  };
}

test("Delete removes workflow definition runstate and owned resources only", async () => {
  const wfA = workflow("wf-A", "Alpha", "step-a");
  const wfB = workflow("wf-B", "Beta", "step-b");
  const runStore = {
    "wf-A": {
      runIndex: 2,
      stepCompleted: { "step-a": true },
      captureRefs: { "step-a": { final: { resource_id: "ra", slot_key: "run_capture:step-a:final" } } },
      capturedOutputs: { "step-a": "{\"ok\":true}" },
      capturedOutputsRaw: { "step-a": "{\"ok\":true}" }
    },
    "wf-B": {
      runIndex: 1,
      stepCompleted: { "step-b": true }
    }
  };
  const { api, storage } = boot({
    deleteDialogChoice: "confirm",
    promptEntries: [{ id: "p1", title: "Prompt", body: "Text" }],
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA, wfB]),
      [RUNKEY]: JSON.stringify(runStore)
    }
  });

  await flushDelete();
  api.setWorkflowsForTest([wfA, wfB]);
  api.setSelectedWorkflowIdForTest("wf-A");
  api.saveWorkflowsForTest();

  const textA = await workflowResources.putTextResource({
    workflow_id: "wf-A",
    slot_key: "run_capture:step-a:final",
    text_payload: "{\"ok\":true}",
    mime_type: "application/json"
  });
  const binA = await workflowResources.putBinaryFileResource({
    workflow_id: "wf-A",
    filename: "asset-a.png",
    mime_type: "image/png",
    payload_blob: Buffer.from("a"),
    byte_size: 1
  });
  const textB = await workflowResources.putTextResource({
    workflow_id: "wf-B",
    slot_key: "run_capture:step-b:final",
    text_payload: "{\"ok\":false}",
    mime_type: "application/json"
  });
  assert.equal(textA.ok, true);
  assert.equal(binA.ok, true);
  assert.equal(textB.ok, true);
  assert.equal((await workflowResources.listActiveResources("wf-A")).length >= 2, true);
  assert.equal((await workflowResources.listActiveResources("wf-B")).length >= 1, true);

  const beforeCount = api.getWorkflowsForTest().length;
  api.handleDeleteWorkflowForTest();
  await flushDelete();

  const after = api.getWorkflowsForTest();
  assert.equal(after.length, beforeCount - 1, "workflow count drops by one");
  assert.equal(after.some((wf) => wf.id === "wf-A"), false, "deleted workflow removed from state");
  assert.equal(after.some((wf) => wf.id === "wf-B"), true, "unrelated workflow preserved");
  assert.equal(api.getSelectedWorkflowIdForTest(), null, "selection cleared after delete");

  const persistedWorkflows = JSON.parse(storage[WFKEY] || "[]");
  assert.equal(persistedWorkflows.some((wf) => wf.id === "wf-A"), false);
  assert.equal(persistedWorkflows.some((wf) => wf.id === "wf-B"), true);

  const persistedRun = JSON.parse(storage[RUNKEY] || "{}");
  assert.equal(persistedRun["wf-A"], undefined, "deleted workflow runstate removed");
  assert.ok(persistedRun["wf-B"], "unrelated workflow runstate remains");

  const resourcesA = await workflowResources.listActiveResources("wf-A");
  const resourcesB = await workflowResources.listActiveResources("wf-B");
  assert.equal(resourcesA.length, 0, "all owned text/binary resources for deleted workflow removed");
  assert.ok(resourcesB.length >= 1, "unrelated workflow resources remain");

  const reloaded = boot({
    deleteDialogChoice: "cancel",
    seedStorage: {
      [WFKEY]: storage[WFKEY],
      [RUNKEY]: storage[RUNKEY]
    }
  });
  await reloaded.api.loadWorkflowsForTest();
  const reloadedWorkflows = reloaded.api.getWorkflowsForTest();
  assert.equal(reloadedWorkflows.some((wf) => wf.id === "wf-A"), false);
  assert.equal(reloadedWorkflows.some((wf) => wf.id === "wf-B"), true);
});

test("Delete cancellation performs no mutation", async () => {
  const wfA = workflow("wf-C", "Cancel Case", "step-c");
  const { api, storage } = boot({
    deleteDialogChoice: "cancel",
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA]),
      [RUNKEY]: JSON.stringify({
        "wf-C": { runIndex: 0, stepCompleted: { "step-c": true } }
      })
    }
  });
  await flushDelete();
  api.setWorkflowsForTest([wfA]);
  api.setSelectedWorkflowIdForTest("wf-C");
  api.saveWorkflowsForTest();
  await workflowResources.putTextResource({
    workflow_id: "wf-C",
    slot_key: "run_capture:step-c:final",
    text_payload: "{}"
  });

  api.handleDeleteWorkflowForTest();
  await flushDelete();

  assert.equal(api.getWorkflowsForTest().length, 1);
  assert.ok(JSON.parse(storage[WFKEY] || "[]").some((wf) => wf.id === "wf-C"));
  assert.ok(JSON.parse(storage[RUNKEY] || "{}")["wf-C"]);
  assert.ok((await workflowResources.listActiveResources("wf-C")).length >= 1);
});

test("Delete failure on resource purge blocks definition deletion and success toast", async () => {
  const wfA = workflow("wf-F", "Failure Case", "step-f");
  const { api, storage, toastContainer } = boot({
    deleteDialogChoice: "confirm",
    overrideDeleteResourcesForWorkflow: () =>
      Promise.resolve({
        ok: false,
        message: "Resource purge failed."
      }),
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA]),
      [RUNKEY]: JSON.stringify({
        "wf-F": { runIndex: 1, stepCompleted: { "step-f": true } }
      })
    }
  });
  await flushDelete();
  api.setWorkflowsForTest([wfA]);
  api.setSelectedWorkflowIdForTest("wf-F");
  api.saveWorkflowsForTest();

  api.handleDeleteWorkflowForTest();
  await flushDelete();

  const after = api.getWorkflowsForTest();
  assert.equal(after.length, 1, "workflow definition remains when purge fails");
  assert.ok(JSON.parse(storage[WFKEY] || "[]").some((wf) => wf.id === "wf-F"));
  assert.ok(JSON.parse(storage[RUNKEY] || "{}")["wf-F"], "runstate remains when purge fails");
  const toasts = getToastMessages(toastContainer);
  assert.ok(toasts.some((msg) => /Resource purge failed|cleanup failed/i.test(msg)));
  assert.ok(!toasts.some((msg) => /Workflow deleted\./i.test(msg)));
});

test("Delete keeps related Prompt Library prompts by default", async () => {
  const wfA = workflow("wf-P1", "Prompt Keep", "step-p1");
  wfA.steps[0].promptId = "prompt-keep";
  wfA.steps[0].prompt_source_type = "library_prompt";
  const prompts = [{ id: "prompt-keep", title: "Keep me", body: "Body" }];
  const { api, libraryState, alsoDeletePromptsRow, toastContainer } = boot({
    deleteDialogChoice: "confirm",
    promptEntries: prompts,
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA]),
      [RUNKEY]: JSON.stringify({})
    }
  });
  await flushDelete();
  api.setWorkflowsForTest([wfA]);
  api.setSelectedWorkflowIdForTest("wf-P1");
  api.setPromptsForTest(prompts);
  api.saveWorkflowsForTest();

  await api.handleDeleteWorkflowForTest();

  assert.equal(api.getWorkflowsForTest().length, 0);
  assert.equal(libraryState.some((p) => p.id === "prompt-keep"), true);
  assert.equal(alsoDeletePromptsRow.classList.contains("hidden"), false);
  const toasts = getToastMessages(toastContainer);
  assert.ok(toasts.some((msg) => /Workflow deleted\./i.test(msg)));
  assert.ok(!toasts.some((msg) => /related prompt/i.test(msg)));
});

test("Delete removes exclusive related prompts when option is checked", async () => {
  const wfA = workflow("wf-P2", "Prompt Delete", "step-p2");
  wfA.steps[0].promptId = "prompt-gone";
  wfA.steps[0].prompt_source_type = "library_prompt";
  const prompts = [{ id: "prompt-gone", title: "Remove me", body: "Body" }];
  const { api, libraryState, toastContainer } = boot({
    deleteDialogChoice: "confirm",
    deleteAlsoRelatedPrompts: true,
    promptEntries: prompts,
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA]),
      [RUNKEY]: JSON.stringify({})
    }
  });
  await flushDelete();
  api.setWorkflowsForTest([wfA]);
  api.setSelectedWorkflowIdForTest("wf-P2");
  api.setPromptsForTest(prompts);
  api.saveWorkflowsForTest();

  await api.handleDeleteWorkflowForTest();

  assert.equal(api.getWorkflowsForTest().length, 0);
  assert.equal(libraryState.some((p) => p.id === "prompt-gone"), false);
  const toasts = getToastMessages(toastContainer);
  assert.ok(toasts.some((msg) => /1 related prompt removed/i.test(msg)));
});

test("Delete keeps shared prompts even when option is checked", async () => {
  const wfA = workflow("wf-P3a", "Owner A", "step-p3a");
  const wfB = workflow("wf-P3b", "Owner B", "step-p3b");
  wfA.steps[0].promptId = "prompt-shared";
  wfA.steps[0].prompt_source_type = "library_prompt";
  wfB.steps[0].promptId = "prompt-shared";
  wfB.steps[0].prompt_source_type = "library_prompt";
  const prompts = [{ id: "prompt-shared", title: "Shared", body: "Body" }];
  const { api, libraryState } = boot({
    deleteDialogChoice: "confirm",
    deleteAlsoRelatedPrompts: true,
    promptEntries: prompts,
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA, wfB]),
      [RUNKEY]: JSON.stringify({})
    }
  });
  await flushDelete();
  api.setWorkflowsForTest([wfA, wfB]);
  api.setSelectedWorkflowIdForTest("wf-P3a");
  api.setPromptsForTest(prompts);
  api.saveWorkflowsForTest();

  await api.handleDeleteWorkflowForTest();

  assert.equal(api.getWorkflowsForTest().some((wf) => wf.id === "wf-P3a"), false);
  assert.equal(api.getWorkflowsForTest().some((wf) => wf.id === "wf-P3b"), true);
  assert.equal(libraryState.some((p) => p.id === "prompt-shared"), true);
});

test("Delete with no related prompts hides the option and still succeeds", async () => {
  const wfA = workflow("wf-P4", "No Prompt Link", "step-p4");
  const { api, alsoDeletePromptsRow, alsoDeletePrompts, toastContainer } = boot({
    deleteDialogChoice: "confirm",
    promptEntries: [{ id: "unrelated", title: "Unrelated", body: "x" }],
    seedStorage: {
      [WFKEY]: JSON.stringify([wfA]),
      [RUNKEY]: JSON.stringify({})
    }
  });
  await flushDelete();
  api.setWorkflowsForTest([wfA]);
  api.setSelectedWorkflowIdForTest("wf-P4");
  api.setPromptsForTest([{ id: "unrelated", title: "Unrelated", body: "x" }]);
  api.saveWorkflowsForTest();

  await api.handleDeleteWorkflowForTest();

  assert.equal(api.getWorkflowsForTest().length, 0);
  assert.equal(alsoDeletePromptsRow.classList.contains("hidden"), true);
  assert.equal(alsoDeletePrompts.checked, false);
  assert.ok(getToastMessages(toastContainer).some((msg) => /Workflow deleted\./i.test(msg)));
});
