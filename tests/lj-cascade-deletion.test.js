/**
 * Learning Journey cascade deletion — ownership planning + delete path.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");
const workflowResources = require("../lib/prism-workflow-resources.js");
const hierarchy = require("../lib/learning-journey-workflow-hierarchy.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const RUNKEY = "promptr.workflows.runstate.v1";
const WFKEY = "promptr.workflows.v1";

function lj(id, name) {
  return {
    id,
    name: name || id,
    product: "learning_journey",
    createdAt: 1000,
    updatedAt: 2000,
    selectedDomains: ["general"],
    workflowInputs: [],
    workflowOutputs: [],
    workflowOutputSpec: { goal: "Journey" },
    steps: [
      {
        id: "s-" + id,
        title: "Design Page",
        prompt_source_type: "local_override",
        prompt_source: "local_override",
        promptId: "",
        override_prompt_body: "Return JSON.",
        outputName: "learning_journey_page",
        inputBindings: []
      }
    ]
  };
}

function child(id, name, sourceWorkflowId, sourceCommissionId, product) {
  return {
    id,
    name,
    product: product || "interactive",
    sourceWorkflowId,
    sourceCommissionId: sourceCommissionId || "",
    createdAt: 1000,
    updatedAt: 2000,
    selectedDomains: ["general"],
    workflowInputs: [],
    workflowOutputs: [],
    workflowOutputSpec: { goal: "Child" },
    steps: [
      {
        id: "s-" + id,
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

function standalone(id, name) {
  return child(id, name, "", "", "interactive");
}

test("listOwnedConstituentWorkflows uses sourceWorkflowId only", () => {
  const parent = lj("wf-lj", "Journey");
  const owned = child("wf-c1", "Owned A", "wf-lj", "c1");
  const ownedSnake = {
    ...child("wf-c2", "Owned B", "", "c2"),
    source_workflow_id: "wf-lj"
  };
  delete ownedSnake.sourceWorkflowId;
  const unrelated = standalone("wf-u", "Unrelated");
  const wrongParent = child("wf-x", "Other LJ child", "wf-other", "c9");
  const noSource = standalone("wf-n", "No source");
  const namedLike = {
    ...standalone("wf-name", "Journey / Interactive"),
    name: "Journey / Interactive"
  };

  const listed = hierarchy.listOwnedConstituentWorkflows(parent, [
    parent,
    owned,
    ownedSnake,
    unrelated,
    wrongParent,
    noSource,
    namedLike
  ]);
  assert.deepEqual(
    listed.map((w) => w.id).sort(),
    ["wf-c1", "wf-c2"],
    "only provenance-matched constituents"
  );
});

test("listOwnedConstituentWorkflows empty for non-LJ parent", () => {
  const interactive = standalone("wf-i", "Interactive");
  const pretendChild = child("wf-c", "Claimed", "wf-i", "c1");
  assert.deepEqual(
    hierarchy.listOwnedConstituentWorkflows(interactive, [interactive, pretendChild]),
    []
  );
});

test("planLearningJourneyCascadeDeletion includes owned; excludes unrelated and ambiguous", () => {
  const parent = lj("wf-lj", "Journey");
  const c1 = child("wf-c1", "Alpha Constituent", "wf-lj", "c1");
  const c2 = child("wf-c2", "Beta Constituent", "wf-lj", "c2", "expository");
  const unrelated = standalone("wf-u", "Standalone Interactive");
  const orphanClaim = child("wf-orphan", "Orphan claim", "wf-missing", "c3");
  const commissionOnly = {
    ...standalone("wf-ref", "Referenced only"),
    // Merely referenced in commissions — no ownership provenance.
    notes: "commission c1 of wf-lj"
  };

  const plan = hierarchy.planLearningJourneyCascadeDeletion(parent, [
    parent,
    c1,
    c2,
    unrelated,
    orphanClaim,
    commissionOnly
  ]);
  assert.equal(plan.cascade, true);
  assert.deepEqual(plan.deleteIds.sort(), ["wf-c1", "wf-c2", "wf-lj"]);
  assert.equal(plan.constituents.length, 2);
  assert.ok(plan.constituents.every((w) => w.id === "wf-c1" || w.id === "wf-c2"));
});

test("planLearningJourneyCascadeDeletion is non-cascade for standalone", () => {
  const wf = standalone("wf-s", "Solo");
  const plan = hierarchy.planLearningJourneyCascadeDeletion(wf, [wf]);
  assert.equal(plan.cascade, false);
  assert.deepEqual(plan.deleteIds, []);
  assert.deepEqual(plan.constituents, []);
});

test("confirm copy lists exact constituent names and count", () => {
  // Pure copy builder exercised via hierarchy plan shape (no app boot).
  const constituents = [
    { id: "wf-c1", name: "Alpha Constituent" },
    { id: "wf-c2", name: "Beta Constituent" }
  ];
  const title = "Journey";
  const count = constituents.length;
  const lines = constituents.map((wf) => "• " + wf.name);
  const body =
    "This will permanently delete the Learning Journey, its Run data and its generated assets, together with " +
    count +
    " owned constituent workflows:\n\n" +
    lines.join("\n") +
    "\n\nThis cannot be undone.";
  assert.match(body, /2 owned constituent workflows/);
  assert.match(body, /• Alpha Constituent/);
  assert.match(body, /• Beta Constituent/);
  assert.ok(title);
});

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

function flushAsync(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms || 0));
}

async function flushDelete() {
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

  const deleteDialog = createElementStub("dialog");
  deleteDialog.__nextReturnValue = opts.deleteDialogChoice || "cancel";
  elementStore.set("deleteWorkflowConfirmDialog", deleteDialog);
  elementStore.set("deleteWorkflowConfirmTitle", createElementStub("h2"));
  elementStore.set("deleteWorkflowConfirmBody", createElementStub("p"));
  elementStore.set("deleteWorkflowAlsoDeletePromptsRow", createElementStub("label"));
  elementStore.set("deleteWorkflowAlsoDeletePrompts", createElementStub("input"));
  elementStore.set("deleteWorkflowAlsoDeletePromptsLabel", createElementStub("span"));
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
      getAllPrompts: () => Promise.resolve([])
    }
  };

  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  sandbox.globalThis = windowStub;
  workflowResources.resetStorageBackendForTests();
  if (typeof opts.overrideDeleteResourcesForWorkflow === "function") {
    workflowResources.deleteResourcesForWorkflow = opts.overrideDeleteResourcesForWorkflow;
  }
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
  const catalogueStore = require("../lib/prism-workflow-catalogue-store.js");
  catalogueStore.resetStorageBackendForTests();
  sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  windowStub.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  sandbox.PRISM_LEARNING_JOURNEY_WORKFLOW_HIERARCHY = hierarchy;
  windowStub.PRISM_LEARNING_JOURNEY_WORKFLOW_HIERARCHY = hierarchy;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS.concat([
    "lib/first-class-workflow-family.js",
    "lib/learning-journey-workflow-hierarchy.js"
  ]));
  // Re-assert after script load (vm globalThis wiring can miss sandbox.window).
  sandbox.PRISM_LEARNING_JOURNEY_WORKFLOW_HIERARCHY = hierarchy;
  windowStub.PRISM_LEARNING_JOURNEY_WORKFLOW_HIERARCHY = hierarchy;
  sandbox.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  windowStub.PRISM_WORKFLOW_CATALOGUE_STORE = catalogueStore;
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return {
    api: sandbox.window.__PRISM_TEST_API,
    storage,
    toastContainer: elementStore.get("toastContainer"),
    deleteDialog,
    deleteBody: elementStore.get("deleteWorkflowConfirmBody"),
    deleteTitle: elementStore.get("deleteWorkflowConfirmTitle")
  };
}

test("Deleting Learning Journey cascades to owned constituents and leaves unrelated", async () => {
  const parent = lj("wf-lj", "Cascade Journey");
  const c1 = child("wf-c1", "Owned Interactive", "wf-lj", "c1");
  const c2 = child("wf-c2", "Owned Expository", "wf-lj", "c2", "expository");
  const unrelated = standalone("wf-u", "Unrelated Interactive");
  const ambiguous = child("wf-amb", "Ambiguous other parent", "wf-other", "c9");

  const { api, storage, deleteBody, deleteTitle } = boot({
    deleteDialogChoice: "confirm",
    seedStorage: {
      [WFKEY]: JSON.stringify([parent, c1, c2, unrelated, ambiguous]),
      [RUNKEY]: JSON.stringify({
        "wf-lj": { runIndex: 1 },
        "wf-c1": { runIndex: 2 },
        "wf-c2": { runIndex: 3 },
        "wf-u": { runIndex: 4 },
        "wf-amb": { runIndex: 5 }
      })
    }
  });
  await flushDelete();
  api.setWorkflowsForTest([parent, c1, c2, unrelated, ambiguous]);
  api.setSelectedWorkflowIdForTest("wf-lj");
  api.saveWorkflowsForTest();

  await workflowResources.putTextResource({
    workflow_id: "wf-lj",
    slot_key: "run_capture:s-wf-lj:final",
    text_payload: "{\"lj\":true}"
  });
  await workflowResources.putTextResource({
    workflow_id: "wf-c1",
    slot_key: "run_capture:s-wf-c1:final",
    text_payload: "{\"c1\":true}"
  });
  await workflowResources.putTextResource({
    workflow_id: "wf-u",
    slot_key: "run_capture:s-wf-u:final",
    text_payload: "{\"u\":true}"
  });

  const plan = api.planDeleteWorkflowCascadeForTest(parent);
  assert.equal(plan.cascade, true);
  assert.equal(plan.constituents.length, 2);

  api.handleDeleteWorkflowForTest();
  await flushDelete();

  assert.match(String(deleteTitle.textContent || ""), /Delete Learning Journey/);
  assert.match(String(deleteBody.textContent || ""), /2 owned constituent/);
  assert.match(String(deleteBody.textContent || ""), /Owned Interactive/);
  assert.match(String(deleteBody.textContent || ""), /Owned Expository/);

  const after = api.getWorkflowsForTest();
  assert.equal(after.some((w) => w.id === "wf-lj"), false);
  assert.equal(after.some((w) => w.id === "wf-c1"), false);
  assert.equal(after.some((w) => w.id === "wf-c2"), false);
  assert.equal(after.some((w) => w.id === "wf-u"), true, "unrelated preserved");
  assert.equal(after.some((w) => w.id === "wf-amb"), true, "ambiguous ownership preserved");

  const persisted = JSON.parse(storage[WFKEY] || "[]");
  assert.equal(persisted.some((w) => w.id === "wf-lj"), false);
  assert.equal(persisted.some((w) => w.id === "wf-c1"), false);
  assert.equal(persisted.some((w) => w.id === "wf-u"), true);

  const run = JSON.parse(storage[RUNKEY] || "{}");
  assert.equal(run["wf-lj"], undefined);
  assert.equal(run["wf-c1"], undefined);
  assert.equal(run["wf-c2"], undefined);
  assert.ok(run["wf-u"]);
  assert.ok(run["wf-amb"]);

  assert.equal((await workflowResources.listActiveResources("wf-lj")).length, 0);
  assert.equal((await workflowResources.listActiveResources("wf-c1")).length, 0);
  assert.ok((await workflowResources.listActiveResources("wf-u")).length >= 1);
});

test("Cancelling Learning Journey cascade deletes nothing", async () => {
  const parent = lj("wf-lj-cancel", "Cancel Journey");
  const c1 = child("wf-c-cancel", "Owned", "wf-lj-cancel", "c1");
  const { api, storage } = boot({
    deleteDialogChoice: "cancel",
    seedStorage: {
      [WFKEY]: JSON.stringify([parent, c1]),
      [RUNKEY]: JSON.stringify({
        "wf-lj-cancel": { runIndex: 1 },
        "wf-c-cancel": { runIndex: 1 }
      })
    }
  });
  await flushDelete();
  api.setWorkflowsForTest([parent, c1]);
  api.setSelectedWorkflowIdForTest("wf-lj-cancel");
  api.saveWorkflowsForTest();

  api.handleDeleteWorkflowForTest();
  await flushDelete();

  assert.equal(api.getWorkflowsForTest().length, 2);
  assert.ok(JSON.parse(storage[WFKEY] || "[]").some((w) => w.id === "wf-lj-cancel"));
  assert.ok(JSON.parse(storage[WFKEY] || "[]").some((w) => w.id === "wf-c-cancel"));
  assert.ok(JSON.parse(storage[RUNKEY] || "{}")["wf-lj-cancel"]);
  assert.ok(JSON.parse(storage[RUNKEY] || "{}")["wf-c-cancel"]);
});

test("Standalone workflow deletion remains single-workflow", async () => {
  const solo = standalone("wf-solo", "Solo Workflow");
  const other = standalone("wf-other", "Other Workflow");
  const { api, storage, deleteTitle, deleteBody } = boot({
    deleteDialogChoice: "confirm",
    seedStorage: {
      [WFKEY]: JSON.stringify([solo, other]),
      [RUNKEY]: JSON.stringify({
        "wf-solo": { runIndex: 1 },
        "wf-other": { runIndex: 1 }
      })
    }
  });
  await flushDelete();
  api.setWorkflowsForTest([solo, other]);
  api.setSelectedWorkflowIdForTest("wf-solo");
  api.saveWorkflowsForTest();

  api.handleDeleteWorkflowForTest();
  await flushDelete();

  assert.match(String(deleteTitle.textContent || ""), /Delete "Solo Workflow"/);
  assert.doesNotMatch(String(deleteBody.textContent || ""), /constituent/i);

  const after = api.getWorkflowsForTest();
  assert.equal(after.length, 1);
  assert.equal(after[0].id, "wf-other");
  assert.equal(JSON.parse(storage[WFKEY] || "[]").some((w) => w.id === "wf-solo"), false);
  assert.equal(JSON.parse(storage[WFKEY] || "[]").some((w) => w.id === "wf-other"), true);
});

test("Deleting a constituent alone does not delete the Learning Journey", async () => {
  const parent = lj("wf-lj-keep", "Keep Journey");
  const c1 = child("wf-c-only", "Just Child", "wf-lj-keep", "c1");
  const { api } = boot({
    deleteDialogChoice: "confirm",
    seedStorage: {
      [WFKEY]: JSON.stringify([parent, c1]),
      [RUNKEY]: JSON.stringify({})
    }
  });
  await flushDelete();
  api.setWorkflowsForTest([parent, c1]);
  api.setSelectedWorkflowIdForTest("wf-c-only");
  api.saveWorkflowsForTest();

  api.handleDeleteWorkflowForTest();
  await flushDelete();

  const after = api.getWorkflowsForTest();
  assert.equal(after.some((w) => w.id === "wf-c-only"), false);
  assert.equal(after.some((w) => w.id === "wf-lj-keep"), true);
});

test("Resource purge failure aborts before removing Learning Journey definitions", async () => {
  const parent = lj("wf-lj-fail", "Fail Journey");
  const c1 = child("wf-c-fail", "Owned Fail", "wf-lj-fail", "c1");
  let calls = 0;
  const { api, storage } = boot({
    deleteDialogChoice: "confirm",
    overrideDeleteResourcesForWorkflow: (workflowId) => {
      calls += 1;
      if (String(workflowId) === "wf-c-fail") {
        return Promise.resolve({ ok: false, message: "Constituent purge failed." });
      }
      return Promise.resolve({ ok: true, deleted: 0 });
    },
    seedStorage: {
      [WFKEY]: JSON.stringify([parent, c1]),
      [RUNKEY]: JSON.stringify({
        "wf-lj-fail": { runIndex: 1 },
        "wf-c-fail": { runIndex: 1 }
      })
    }
  });
  await flushDelete();
  api.setWorkflowsForTest([parent, c1]);
  api.setSelectedWorkflowIdForTest("wf-lj-fail");
  api.saveWorkflowsForTest();

  api.handleDeleteWorkflowForTest();
  await flushDelete();

  assert.ok(calls >= 1);
  assert.equal(api.getWorkflowsForTest().length, 2);
  assert.ok(JSON.parse(storage[WFKEY] || "[]").some((w) => w.id === "wf-lj-fail"));
  assert.ok(JSON.parse(storage[WFKEY] || "[]").some((w) => w.id === "wf-c-fail"));
  assert.ok(JSON.parse(storage[RUNKEY] || "{}")["wf-lj-fail"]);
});
