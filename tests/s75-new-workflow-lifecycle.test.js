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
const RUNKEY = "promptr.workflows.runstate.v1";
const WFKEY = "promptr.workflows.v1";

function createElementStub(tagName) {
  const tag = String(tagName || "div").toUpperCase();
  return {
    tagName: tag,
    value: "",
    textContent: "",
    innerHTML: "",
    className: "",
    checked: false,
    disabled: false,
    children: [],
    style: {},
    dataset: {},
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
    appendChild(node) {
      this.children.push(node);
      node.parentNode = this;
      return node;
    },
    removeChild(node) {
      const idx = this.children.indexOf(node);
      if (idx >= 0) this.children.splice(idx, 1);
      return node;
    },
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    },
    addEventListener() {},
    removeEventListener() {},
    setAttribute(name, value) {
      this._attrs = this._attrs || {};
      this._attrs[name] = String(value);
    },
    removeAttribute(name) {
      this._attrs = this._attrs || {};
      delete this._attrs[name];
    },
    getAttribute(name) {
      this._attrs = this._attrs || {};
      return Object.prototype.hasOwnProperty.call(this._attrs, name) ? this._attrs[name] : null;
    },
    focus() {},
    select() {},
    click() {}
  };
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

  const workflowList = createElementStub("ul");
  const workflowSteps = createElementStub("ul");
  const workflowName = createElementStub("input");
  const workflowTags = createElementStub("input");
  const workflowNotes = createElementStub("textarea");
  const workflowArtefacts = createElementStub("textarea");
  const workflowOutputs = createElementStub("textarea");
  const workflowStartingArtefact = createElementStub("input");
  const workflowAudience = createElementStub("input");
  const workflowGoal = createElementStub("input");
  const workflowConstraints = createElementStub("textarea");
  const workflowModeEditBtn = createElementStub("button");
  const workflowModeSettingsBtn = createElementStub("button");
  const workflowModeRunBtn = createElementStub("button");
  const workflowDetail = createElementStub("section");
  const exportWorkflowBtn = createElementStub("button");
  const workflowModeSettingsBadge = createElementStub("span");
  const workflowValidationPanel = createElementStub("div");

  [
    ["workflowList", workflowList],
    ["workflowSteps", workflowSteps],
    ["workflowName", workflowName],
    ["workflowLibraryTags", workflowTags],
    ["workflowLibraryNotes", workflowNotes],
    ["workflowArtefacts", workflowArtefacts],
    ["workflowOutputs", workflowOutputs],
    ["workflowStartingArtefact", workflowStartingArtefact],
    ["workflowAudience", workflowAudience],
    ["workflowGoal", workflowGoal],
    ["workflowConstraints", workflowConstraints],
    ["workflowModeEditBtn", workflowModeEditBtn],
    ["workflowModeSettingsBtn", workflowModeSettingsBtn],
    ["workflowModeRunBtn", workflowModeRunBtn],
    ["workflowDetail", workflowDetail],
    ["exportWorkflowBtn", exportWorkflowBtn],
    ["workflowModeSettingsBadge", workflowModeSettingsBadge],
    ["workflowValidationPanel", workflowValidationPanel],
    ["workflowMetaCreated", createElementStub("span")],
    ["workflowMetaUpdated", createElementStub("span")],
    ["deleteWorkflowBtn", createElementStub("button")],
    ["duplicateWorkflowBtn", createElementStub("button")],
    ["renameWorkflowBtn", createElementStub("button")],
    ["clearWorkflowRunDataBtn", createElementStub("button")],
    ["toastContainer", createElementStub("div")],
    ["apiKeyStatus", createElementStub("span")],
    ["workflowRunStatus", createElementStub("div")],
    ["workflowPrevStepBtn", createElementStub("button")],
    ["workflowNextStepBtn", createElementStub("button")],
    ["workflowRunCopyBtn", createElementStub("button")],
    ["workflowContinueToAuthoringBtn", createElementStub("button")]
  ].forEach(([id, el]) => elementStore.set(id, el));

  workflowModeRunBtn.classList.contains = (name) => name === "active";
  workflowModeEditBtn.classList.contains = () => false;
  workflowModeSettingsBtn.classList.contains = () => false;
  workflowDetail.classList.contains = (name) => name === "run-mode";

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

  let uuidCounter = 0;
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: {
      debounce: (fn) => fn,
      uuid: () => "wf-id-" + ++uuidCounter,
      formatDate: () => "date"
    },
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
  workflowResources.resetStorageBackendForTests();
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, storage };
}

test("New creates persists selects and orients to Edit; Save updates same identity", async () => {
  const existing = {
    id: "wf-existing",
    name: "Jamies Maths",
    createdAt: 1000,
    updatedAt: 2000,
    selectedDomains: ["general"],
    workflowInputs: [],
    workflowOutputs: [],
    workflowOutputSpec: { goal: "Existing goal" },
    steps: [{ id: "step-existing-1", title: "Step 1", outputName: "out", inputBindings: [] }]
  };
  const existingClone = JSON.parse(JSON.stringify(existing));
  const { api, storage } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([existing]),
      [RUNKEY]: JSON.stringify({
        "wf-existing": { capturedOutputs: { "step-existing-1": "{\"ok\":true}" } }
      })
    }
  });
  api.setWorkflowsForTest([existing]);
  api.setSelectedWorkflowIdForTest("wf-existing");
  api.setWorkflowDetailModeForTest("run");

  const oldResource = await workflowResources.putTextResource({
    workflow_id: "wf-existing",
    slot_key: "run_capture:step-existing-1:final",
    mime_type: "application/json",
    text_payload: "{\"ok\":true}"
  });
  assert.equal(oldResource.ok, true);

  const beforeCount = api.getWorkflowsForTest().length;
  api.handleNewWorkflowForTest();

  const afterNew = api.getWorkflowsForTest();
  assert.equal(afterNew.length, beforeCount + 1, "New adds exactly one workflow");

  const created = afterNew.find((wf) => wf.id !== "wf-existing");
  assert.ok(created, "New workflow should exist");
  assert.equal(created.name, "New workflow");
  assert.equal(api.getSelectedWorkflowIdForTest(), created.id, "new workflow selected");
  assert.equal(api.getWorkflowDetailModeForTest(), "edit", "workflow mode switched to Edit");

  const persistedAfterNew = JSON.parse(storage[WFKEY] || "[]");
  assert.equal(
    persistedAfterNew.length,
    beforeCount + 1,
    "new workflow persisted immediately to storage"
  );
  assert.ok(persistedAfterNew.some((wf) => wf.id === created.id));

  const runStoreAfterNew = JSON.parse(storage[RUNKEY] || "{}");
  assert.ok(runStoreAfterNew["wf-existing"], "existing run state preserved");
  assert.equal(runStoreAfterNew[created.id], undefined, "new workflow run state is clean");
  const newResources = await workflowResources.listActiveResources(created.id);
  assert.equal(newResources.length, 0, "new workflow resources start clean");
  const oldResources = await workflowResources.listActiveResources("wf-existing");
  assert.ok(oldResources.length >= 1, "existing workflow resources untouched");

  const existingAfterNew = afterNew.find((wf) => wf.id === "wf-existing");
  assert.ok(existingAfterNew, "previous workflow still exists");
  assert.equal(existingAfterNew.id, existingClone.id);
  assert.equal(existingAfterNew.name, existingClone.name);
  assert.equal(existingAfterNew.createdAt, existingClone.createdAt);
  assert.equal(existingAfterNew.updatedAt, existingClone.updatedAt);

  const createdId = created.id;
  const countAfterNew = afterNew.length;
  const createdBeforeSave = JSON.parse(JSON.stringify(created));

  const wfNameInput = api && api.gatherWorkflowDetailFormDataForTest ? null : null;
  void wfNameInput;
  // Simulate editing new workflow then saving: update selected workflow object fields directly
  // via detail form inputs the save handler reads.
  api.selectWorkflowForTest(createdId);
  // save reads from DOM-backed fields populated by selectWorkflow
  // We can mutate current selected workflow fields through the form via helper.
  const listBeforeSave = api.getWorkflowsForTest();
  const selected = listBeforeSave.find((wf) => wf.id === createdId);
  selected.name = "New workflow edited";
  api.setWorkflowsForTest(listBeforeSave);
  api.selectWorkflowForTest(createdId);
  // populate form value before save
  // set form fields using selected workflow through selectWorkflow and then save
  api.handleSaveWorkflowForTest();

  const afterSave = api.getWorkflowsForTest();
  assert.equal(afterSave.length, countAfterNew, "Save updates existing workflow, does not add another");
  const saved = afterSave.find((wf) => wf.id === createdId);
  assert.ok(saved, "saved workflow identity remains");
  assert.equal(saved.id, createdId);
  assert.ok(saved.updatedAt >= createdBeforeSave.updatedAt);
});

test("Reload after New keeps persisted minimal workflow and repeated New creates unique identities", async () => {
  const { api, storage } = boot({
    seedStorage: {
      [WFKEY]: JSON.stringify([]),
      [RUNKEY]: JSON.stringify({})
    }
  });
  api.setWorkflowsForTest([]);
  api.setWorkflowDetailModeForTest("run");

  api.handleNewWorkflowForTest();
  api.handleNewWorkflowForTest();
  api.handleNewWorkflowForTest();

  const created = api.getWorkflowsForTest();
  assert.equal(created.length, 3, "each New creates one workflow");
  const ids = created.map((wf) => wf.id);
  assert.equal(new Set(ids).size, 3, "each New gets unique workflow identity");
  assert.equal(api.getSelectedWorkflowIdForTest(), ids[2], "latest New is selected");
  assert.equal(api.getWorkflowDetailModeForTest(), "edit");

  const persisted = JSON.parse(storage[WFKEY] || "[]");
  assert.equal(persisted.length, 3, "all new workflows persisted immediately");

  const reloaded = boot({
    seedStorage: {
      [WFKEY]: storage[WFKEY],
      [RUNKEY]: storage[RUNKEY]
    }
  });
  await reloaded.api.loadWorkflowsForTest();
  const reloadedWorkflows = reloaded.api.getWorkflowsForTest();
  assert.equal(reloadedWorkflows.length, 3, "new workflows survive reload");
  reloadedWorkflows.forEach((wf) => {
    assert.equal(wf.name, "New workflow");
    assert.ok(Array.isArray(wf.steps));
    assert.equal(wf.steps.length, 0, "minimal new workflow remains step-clean");
  });
});
