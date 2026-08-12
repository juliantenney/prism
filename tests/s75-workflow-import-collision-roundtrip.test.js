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
const appSource = fs.readFileSync(appJsPath, "utf8");
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
    appendChild(child) {
      this.children.push(child);
      child.parentNode = this;
      return child;
    },
    removeChild(child) {
      const idx = this.children.indexOf(child);
      if (idx >= 0) this.children.splice(idx, 1);
      child.parentNode = null;
      return child;
    },
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
    focus() {},
    click() {},
    querySelector() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
  if (tag === "DIALOG") {
    el.showModal = function () {
      this.open = true;
      this.__openedCount = (this.__openedCount || 0) + 1;
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

function workflowFixture(id, name, options) {
  const opts = options && typeof options === "object" ? options : {};
  const stepId = opts.stepId || "step-1";
  return {
    id,
    name,
    createdAt: opts.createdAt || 1000,
    updatedAt: opts.updatedAt || 2000,
    selectedDomains: ["general"],
    workflowInputs: [],
    workflowOutputs: [],
    workflowOutputSpec: {
      goal: opts.goal || "Goal"
    },
    steps: [
      {
        id: stepId,
        title: opts.stepTitle || "Step",
        prompt_source_type: opts.promptSourceType || "local_override",
        prompt_source: opts.promptSourceType || "local_override",
        promptId: opts.promptId || "",
        override_prompt_body: opts.overridePromptBody || "Return JSON.",
        outputName: opts.outputName || "artifact",
        inputBindings: Array.isArray(opts.inputBindings) ? opts.inputBindings : []
      }
    ]
  };
}

function getToastMessages(toastContainer) {
  const toasts = Array.isArray(toastContainer.children) ? toastContainer.children : [];
  return toasts
    .map((toast) => {
      const msgNode = (toast.children || []).find((child) => child.className === "toast-message");
      return msgNode && typeof msgNode.textContent === "string" ? msgNode.textContent : "";
    })
    .filter(Boolean);
}

function flushAsync(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms || 0));
}

async function flushImport() {
  for (let i = 0; i < 20; i++) {
    await flushAsync(0);
  }
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

  const collisionDialog = createElementStub("dialog");
  const collisionChoices = Array.isArray(opts.collisionChoices) ? opts.collisionChoices.slice() : [];
  collisionDialog.showModal = function () {
    this.open = true;
    this.__openedCount = (this.__openedCount || 0) + 1;
    const nextChoice = collisionChoices.length ? collisionChoices.shift() : "cancel";
    this.returnValue = String(nextChoice || "cancel");
    setTimeout(() => this.close(), 0);
  };

  const toastContainer = createElementStub("div");
  [
    "toastContainer",
    "workflowSteps",
    "workflowImportCollisionTitle",
    "workflowImportCollisionBody",
    "workflowImportCollisionImportAsNew",
    "workflowImportCollisionUpdateExisting",
    "workflowImportCollisionCancel",
    "clearWorkflowRunDataConfirmDialog",
    "clearWorkflowRunDataConfirmTitle",
    "clearWorkflowRunDataConfirmBody",
    "clearWorkflowRunDataConfirmCancel",
    "clearWorkflowRunDataConfirmSubmit"
  ].forEach((id) => {
    if (id === "toastContainer") {
      elementStore.set(id, toastContainer);
    } else if (id === "workflowImportCollisionDialog") {
      elementStore.set(id, collisionDialog);
    } else {
      elementStore.set(id, createElementStub("div"));
    }
  });
  if (opts.enableCollisionDialog === true) {
    elementStore.set("workflowImportCollisionDialog", collisionDialog);
  }

  const promptChoices = Array.isArray(opts.promptChoices) ? opts.promptChoices.slice() : [];

  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: {
      debounce: (fn) => fn,
      formatDate: () => "date",
      uuid: (() => {
        let n = 0;
        return () => "uuid-" + ++n;
      })()
    },
    localStorage,
    prompt:
      typeof opts.prompt === "function"
        ? opts.prompt
        : () => (promptChoices.length ? String(promptChoices.shift()) : "3"),
    confirm: typeof opts.confirm === "function" ? opts.confirm : () => false,
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries:
        typeof opts.importPromptsFromEntries === "function"
          ? opts.importPromptsFromEntries
          : () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts:
        typeof opts.getAllPrompts === "function"
          ? opts.getAllPrompts
          : () => Promise.resolve([])
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
  return {
    api: sandbox.window.__PRISM_TEST_API,
    storage,
    elementStore,
    collisionDialog
  };
}

const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");

test("A: markup exposes workflow import collision dialog and actions", () => {
  assert.match(indexHtml, /id="workflowImportCollisionDialog"/);
  assert.match(indexHtml, /aria-labelledby="workflowImportCollisionTitle"/);
  assert.match(indexHtml, /aria-describedby="workflowImportCollisionBody"/);
  assert.match(indexHtml, /id="workflowImportCollisionImportAsNew"/);
  assert.match(indexHtml, /id="workflowImportCollisionUpdateExisting"/);
  assert.match(indexHtml, /id="workflowImportCollisionCancel"[\s\S]*?\bautofocus\b/);
});

test("B: exported workflow imports into an empty store", async () => {
  const { api } = boot();
  await flushImport();
  const wf = workflowFixture("wf-empty", "Fresh Import", { updatedAt: 1001 });
  const bundle = api.buildWorkflowBundle([wf]);
  api.setWorkflowsForTest([]);
  api.importWorkflowsAndPrompts(bundle.workflows, bundle.prompts, { newerWins: true });
  await flushImport();
  const after = api.getWorkflowsForTest();
  assert.equal(after.length, 1);
  assert.equal(after[0].id, "wf-empty");
  assert.equal(after[0].name, "Fresh Import");
});

test("C: same-id collision prompts and update existing uses explicit choice", async () => {
  const existing = workflowFixture("wf-collide", "Lagrangian Multipliers", { updatedAt: 2000 });
  const incoming = workflowFixture("wf-collide", "Jamies Maths", { updatedAt: 2000 });
  const { api } = boot({
    enableCollisionDialog: true,
    collisionChoices: ["update_existing"]
  });
  await flushImport();
  api.setWorkflowsForTest([existing]);
  api.importWorkflowsAndPrompts([incoming], [], { newerWins: true });
  await flushImport();
  const after = api.getWorkflowsForTest();
  assert.equal(after.length, 1);
  assert.equal(after[0].id, "wf-collide");
  assert.equal(after[0].name, "Jamies Maths");
});

test("D: Import as new creates a new workflow id and keeps existing untouched", async () => {
  const existing = workflowFixture("wf-collide", "Existing Local", { updatedAt: 2000, stepId: "step-old" });
  const incoming = workflowFixture("wf-collide", "Imported Source", {
    updatedAt: 2000,
    stepId: "step-import",
    inputBindings: [{ kind: "internal", sourceStepId: "step-import", artifactName: "artifact" }]
  });
  const { api, storage } = boot({
    promptChoices: ["1"],
    seedStorage: {
      [WFKEY]: JSON.stringify([existing]),
      [RUNKEY]: JSON.stringify({
        "wf-collide": { capturedOutputs: { "step-old": "{\"ok\":true}" } }
      })
    }
  });
  await flushImport();
  api.setWorkflowsForTest([existing]);
  api.importWorkflowsAndPrompts([incoming], [], { newerWins: true });
  await flushImport();
  const after = api.getWorkflowsForTest();
  assert.equal(after.length, 2);
  const persisted = JSON.parse(storage[WFKEY] || "[]");
  assert.equal(persisted.length, 2);
  const importedAsNew = after.find((w) => w.name === "Imported Source");
  assert.ok(importedAsNew);
  assert.notEqual(importedAsNew.id, "wf-collide");
  const runStore = JSON.parse(storage[RUNKEY] || "{}");
  assert.ok(runStore["wf-collide"], "existing run state kept");
  assert.equal(runStore[importedAsNew.id], undefined, "new workflow starts with clean run state");
});

test("E: Update existing preserves id and keeps existing runstate/resources", async () => {
  const existing = workflowFixture("wf-update", "Existing Name", { updatedAt: 5000, stepId: "old-step" });
  const incoming = workflowFixture("wf-update", "Imported New Name", { updatedAt: 1000, stepId: "new-step" });
  const { api, storage } = boot({
    promptChoices: ["2"],
    seedStorage: {
      [WFKEY]: JSON.stringify([existing]),
      [RUNKEY]: JSON.stringify({
        "wf-update": { capturedOutputs: { "old-step": "{\"ok\":true}" } }
      })
    }
  });
  await flushImport();
  api.setWorkflowsForTest([existing]);
  const resourceWrite = await workflowResources.putTextResource({
    workflow_id: "wf-update",
    slot_key: "run_capture:old-step:final",
    mime_type: "application/json",
    text_payload: "{\"ok\":true}"
  });
  assert.equal(resourceWrite.ok, true);
  api.importWorkflowsAndPrompts([incoming], [], { newerWins: true });
  await flushImport();
  const after = api.getWorkflowsForTest();
  assert.equal(after.length, 1);
  assert.equal(after[0].id, "wf-update");
  assert.equal(after[0].name, "Imported New Name");
  const runStore = JSON.parse(storage[RUNKEY] || "{}");
  assert.ok(runStore["wf-update"], "run state remains untouched");
  const resources = await workflowResources.listActiveResources("wf-update");
  assert.ok(Array.isArray(resources));
  assert.ok(resources.length >= 1, "workflow resources remain untouched");
});

test("F: cancel leaves local workflow untouched", async () => {
  const existing = workflowFixture("wf-cancel", "Keep Me", { updatedAt: 3000 });
  const incoming = workflowFixture("wf-cancel", "Imported Candidate", { updatedAt: 3000 });
  const { api } = boot({ promptChoices: ["3"] });
  await flushImport();
  api.setWorkflowsForTest([existing]);
  api.importWorkflowsAndPrompts([incoming], [], { newerWins: true });
  await flushImport();
  const after = api.getWorkflowsForTest();
  assert.equal(after.length, 1);
  assert.equal(after[0].name, "Keep Me");
});

test("G: self-normalization warning noise is suppressed on import", async () => {
  const existing = workflowFixture("wf-noise", "Existing", { updatedAt: 3000, stepId: "s1" });
  const incoming = workflowFixture("wf-noise", "Existing", {
    updatedAt: 3000,
    stepId: "s1",
    inputBindings: [{ kind: "internal", sourceStepId: "s1", artifactName: "artifact" }]
  });
  const { api, elementStore } = boot({ promptChoices: ["2"] });
  await flushImport();
  api.setWorkflowsForTest([existing]);
  api.importWorkflowsAndPrompts([incoming], [], { newerWins: true });
  await flushImport();
  const toasts = getToastMessages(elementStore.get("toastContainer"));
  assert.ok(!toasts.some((msg) => /omitted self-referential/i.test(msg)));
});

test("H: genuine warnings remain visible with warning detail", async () => {
  const incoming = workflowFixture("wf-warn", "Warn Workflow", {
    promptSourceType: "local_override",
    overridePromptBody: ""
  });
  const { api, elementStore } = boot();
  await flushImport();
  api.setWorkflowsForTest([]);
  api.importWorkflowsAndPrompts([incoming], [], { newerWins: true });
  await flushImport();
  assert.equal(
    api.shouldSuppressWorkflowImportWarningForTest(
      "Step 1 has no runnable prompt configured (Local override selected, but prompt body is empty.).",
      "validate"
    ),
    false
  );
  assert.match(appSource, /workflow warning\(s\):\s*"\s*\+\s*firstWarning/);
});

test("I: bundled prompt references resolve without false warning", async () => {
  const incoming = workflowFixture("wf-prompt", "Prompt Workflow", {
    promptSourceType: "library_prompt",
    promptId: "prompt-1",
    overridePromptBody: ""
  });
  const prompts = [
    {
      id: "prompt-1",
      title: "Prompt One",
      body: "Return JSON.",
      tags: [],
      createdAt: 1000,
      updatedAt: 1000,
      usageCount: 0,
      source: "manual",
      versions: []
    }
  ];
  const { api, elementStore } = boot({
    importPromptsFromEntries: () => Promise.resolve({ added: 1, updated: 0, skipped: 0 }),
    getAllPrompts: () => Promise.resolve(prompts)
  });
  await flushImport();
  api.setWorkflowsForTest([]);
  api.setPromptsForTest([]);
  api.importWorkflowsAndPrompts([incoming], prompts, { newerWins: true });
  await flushImport();
  const toasts = getToastMessages(elementStore.get("toastContainer"));
  assert.ok(!toasts.some((msg) => /could not be resolved/i.test(msg)));
});

test("J: mixed export-all import handles colliding and non-colliding workflows", async () => {
  const existing = workflowFixture("wf-mix-1", "Existing One", { updatedAt: 2000 });
  const incomingCollide = workflowFixture("wf-mix-1", "Imported Colliding", { updatedAt: 2000 });
  const incomingFresh = workflowFixture("wf-mix-2", "Imported Fresh", { updatedAt: 2000 });
  const { api } = boot({ promptChoices: ["1"] });
  await flushImport();
  api.setWorkflowsForTest([existing]);
  api.importWorkflowsAndPrompts([incomingCollide, incomingFresh], [], { newerWins: true });
  await flushImport();
  const after = api.getWorkflowsForTest();
  assert.equal(after.length, 3);
  assert.ok(after.some((w) => w.id === "wf-mix-1" && w.name === "Existing One"));
  assert.ok(after.some((w) => w.id === "wf-mix-2" && w.name === "Imported Fresh"));
  assert.ok(after.some((w) => w.name === "Imported Colliding" && w.id !== "wf-mix-1"));
});
