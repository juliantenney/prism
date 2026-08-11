/**
 * Sprint 75 — My Workflows Rename preserves workflow identity (not Duplicate).
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
    createElement: () => createElementStub(),
    getElementById(id) {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
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
      uuid: () => "uuid-" + ++uuidCounter
    },
    localStorage,
    prompt: typeof opts.prompt === "function" ? opts.prompt : () => null,
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
  return { api: sandbox.window.__PRISM_TEST_API, storage, windowStub };
}

function sampleWorkflow() {
  return {
    id: "wf-rename-1",
    name: "Original Name",
    createdAt: 1000,
    updatedAt: 2000,
    selectedDomains: ["general"],
    artefacts: "",
    workflowInputs: [],
    workflowOutputs: [],
    steps: [
      {
        id: "step-a",
        title: "Step A",
        roleLabel: "",
        promptId: "",
        inputKind: "text",
        outputName: "outA",
        notes: "",
        inputBindings: []
      },
      {
        id: "step-b",
        title: "Step B",
        roleLabel: "",
        promptId: "",
        inputKind: "text",
        outputName: "outB",
        notes: "",
        inputBindings: [
          {
            kind: "internal",
            artifactName: "outA",
            sourceStepId: "step-a"
          }
        ]
      }
    ]
  };
}

test("Rename updates name in place and preserves identity, selection, runstate, and resources", async () => {
  const wf = sampleWorkflow();
  const runRecord = {
    runIndex: 1,
    stepCompleted: { "step-a": true },
    capturedOutputs: { "step-a": "{\"ok\":true}" },
    capturedOutputsRaw: { "step-a": "{\"ok\":true}" }
  };
  const { api, storage } = boot({
    prompt: () => "Renamed Workflow",
    seedStorage: {
      [WFKEY]: JSON.stringify([wf]),
      [RUNKEY]: JSON.stringify({ "wf-rename-1": runRecord })
    }
  });

  assert.ok(api);
  assert.equal(typeof api.handleRenameWorkflowForTest, "function");
  assert.equal(typeof api.handleDuplicateWorkflowForTest, "function");

  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wf))]);
  api.setSelectedWorkflowIdForTest("wf-rename-1");
  api.saveWorkflowsForTest();

  const resourceWrite = await workflowResources.putTextResource({
    workflow_id: "wf-rename-1",
    slot_key: "run_capture:step-a:final",
    mime_type: "application/json",
    text_payload: "{\"ok\":true}"
  });
  assert.equal(resourceWrite.ok, true);

  const beforeCount = api.getWorkflowsForTest().length;
  const beforeCreatedAt = api.getWorkflowsForTest()[0].createdAt;
  const beforeUpdatedAt = api.getWorkflowsForTest()[0].updatedAt;
  const beforeStepIds = api.getWorkflowsForTest()[0].steps.map((s) => s.id);
  const beforeBinding = JSON.stringify(api.getWorkflowsForTest()[0].steps[1].inputBindings);

  await new Promise((r) => setTimeout(r, 2));
  api.handleRenameWorkflowForTest();

  const after = api.getWorkflowsForTest();
  assert.equal(after.length, beforeCount);
  assert.equal(after.length, 1);
  assert.equal(after[0].id, "wf-rename-1");
  assert.equal(after[0].name, "Renamed Workflow");
  assert.equal(after[0].createdAt, beforeCreatedAt);
  assert.ok(after[0].updatedAt > beforeUpdatedAt);
  assert.deepEqual(
    after[0].steps.map((s) => s.id),
    beforeStepIds
  );
  assert.equal(JSON.stringify(after[0].steps[1].inputBindings), beforeBinding);
  assert.equal(api.getSelectedWorkflowIdForTest(), "wf-rename-1");

  const persistedWorkflows = JSON.parse(storage[WFKEY] || "[]");
  assert.equal(persistedWorkflows.length, 1);
  assert.equal(persistedWorkflows[0].id, "wf-rename-1");
  assert.equal(persistedWorkflows[0].name, "Renamed Workflow");

  const runStore = JSON.parse(storage[RUNKEY] || "{}");
  assert.ok(runStore["wf-rename-1"], "Run state remains keyed to the same workflow id");
  assert.equal(
    Object.keys(runStore).filter((k) => k !== "wf-rename-1").length,
    0,
    "Rename must not create Run state under a new workflow id"
  );

  const resources = await workflowResources.listActiveResources("wf-rename-1");
  assert.ok(Array.isArray(resources));
  assert.ok(resources.length >= 1);
  assert.ok(resources.every((row) => row.workflow_id === "wf-rename-1"));
});

test("Duplicate still creates a new workflow identity (unchanged contract)", () => {
  const wf = sampleWorkflow();
  const { api } = boot({
    prompt: () => "should-not-be-used",
    seedStorage: {
      [WFKEY]: JSON.stringify([wf]),
      [RUNKEY]: JSON.stringify({
        "wf-rename-1": { runIndex: 0, stepCompleted: { "step-a": true } }
      })
    }
  });

  api.setWorkflowsForTest([JSON.parse(JSON.stringify(wf))]);
  api.setSelectedWorkflowIdForTest("wf-rename-1");
  api.saveWorkflowsForTest();

  const beforeCount = api.getWorkflowsForTest().length;
  api.handleDuplicateWorkflowForTest();
  const after = api.getWorkflowsForTest();
  assert.equal(after.length, beforeCount + 1);
  const original = after.find((w) => w.id === "wf-rename-1");
  const clone = after.find((w) => w.id !== "wf-rename-1");
  assert.ok(original);
  assert.ok(clone);
  assert.notEqual(clone.id, "wf-rename-1");
  assert.match(clone.name, /\(copy\)$/);
  assert.notDeepEqual(
    clone.steps.map((s) => s.id),
    original.steps.map((s) => s.id)
  );
  assert.equal(api.getSelectedWorkflowIdForTest(), clone.id);

  const runStore = api.loadWorkflowRunStateStoreForTest();
  assert.ok(runStore["wf-rename-1"]);
  assert.equal(runStore[clone.id], undefined);
});

test("Rename source no longer clones or mints a new workflow id", () => {
  const source = fs.readFileSync(appJsPath, "utf8");
  const start = source.indexOf("function handleRenameWorkflow");
  assert.ok(start > 0);
  const end = source.indexOf("\n  function handleDeleteWorkflow", start);
  const body = source.slice(start, end > 0 ? end : start + 2500);
  assert.match(body, /New workflow name:/);
  assert.match(body, /Workflow renamed\./);
  assert.match(body, /wf\.name\s*=\s*nextName/);
  assert.match(body, /wf\.updatedAt\s*=\s*Date\.now\(\)/);
  assert.doesNotMatch(body, /JSON\.parse\(JSON\.stringify\(wf\)\)/);
  assert.doesNotMatch(body, /state\.workflows\.push/);
  assert.doesNotMatch(body, /duplicated and renamed/);
  assert.doesNotMatch(body, /New name for the duplicated workflow/);
});
