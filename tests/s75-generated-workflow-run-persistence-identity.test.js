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
      contains(name) {
        return this._name === name ? true : false;
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

function boot(seedStorage) {
  const { storage, localStorage } = makeStorage(seedStorage);
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
      uuid: () => "wf-step-" + ++uuidCounter
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
  if (!seedStorage) {
    workflowResources.resetStorageBackendForTests();
  }
  sandbox.PRISM_WORKFLOW_RESOURCES = workflowResources;
  windowStub.PRISM_WORKFLOW_RESOURCES = workflowResources;
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return { api: sandbox.window.__PRISM_TEST_API, storage };
}

function buildGeneratedLikeWorkflowSkeleton(id) {
  return {
    id: id || "wf-generated",
    name: "Generated Workflow",
    selectedDomains: ["general", "learning_design"],
    artefacts: "Topic brief",
    workflowInputs: ["Topic brief"],
    workflowOutputs: ["page"],
    workflowOutputSpec: {
      goal: "Produce a learner-ready page",
      pageEnrichmentV2: true,
      partialPageOutputs: true
    },
    steps: [
      { title: "Design Episode Plan", outputName: "page", canonical_step_id: "step_design_episode_plan", notes: "EP notes" },
      { title: "Design Learning Activities", outputName: "page", canonical_step_id: "step_design_learning_activities", notes: "DLA notes" },
      { title: "Generate Activity Materials", outputName: "page", canonical_step_id: "step_generate_activity_materials", notes: "GAM notes" },
      { title: "Construct Learning Sequence", outputName: "page", canonical_step_id: "step_construct_learning_sequence", notes: "CLS notes" },
      { title: "Design Page", outputName: "page", canonical_step_id: "step_design_page", notes: "DP notes" }
    ]
  };
}

function makeStepDom(step, overrides) {
  const attrs = Object.assign(
    {
      "data-step-id": String(step.id || ""),
      "data-canonical-step-id": String(step.canonical_step_id || ""),
      "data-domain-version": String(step.domain_version || "")
    },
    (overrides && overrides.attrs) || {}
  );
  const fieldValues = {
    title: (overrides && overrides.title) || step.title || "",
    roleLabel: (overrides && overrides.roleLabel) || step.roleLabel || "",
    promptId: "",
    inputKind: (overrides && overrides.inputKind) || step.inputKind || "text",
    outputName: (overrides && overrides.outputName) || step.outputName || "",
    notes: (overrides && overrides.notes) || step.notes || "",
    stepId: (overrides && overrides.stepIdField) || String(step.id || "")
  };
  return {
    classList: {
      contains(name) {
        return name === "workflow-step";
      }
    },
    __workflowStepId:
      overrides && Object.prototype.hasOwnProperty.call(overrides, "workflowStepId")
        ? overrides.workflowStepId
        : String(step.id || ""),
    hasAttribute() {
      return false;
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : "";
    },
    setAttribute(name, value) {
      attrs[name] = String(value);
    },
    querySelector(selector) {
      if (selector === '[data-field="title"]') return { value: fieldValues.title };
      if (selector === '[data-field="roleLabel"]') return { value: fieldValues.roleLabel };
      if (selector === '[data-field="promptId"]') return { value: fieldValues.promptId };
      if (selector === '[data-field="inputKind"]') return { value: fieldValues.inputKind };
      if (selector === '[data-field="outputName"]') return { value: fieldValues.outputName };
      if (selector === '[data-field="notes"]') return { value: fieldValues.notes, hasAttribute: () => false, getAttribute: () => "" };
      if (selector === '[data-field="stepId"]') return { value: fieldValues.stepId };
      return null;
    },
    querySelectorAll() {
      return [];
    }
  };
}

function stageCaptureMaps(workflow) {
  const byTitle = {
    "Design Episode Plan": "EP-CAPTURE",
    "Design Learning Activities": "DLA-CAPTURE",
    "Generate Activity Materials": "GAM-CAPTURE",
    "Construct Learning Sequence": "CLS-CAPTURE",
    "Design Page": "DP-CAPTURE"
  };
  const out = {};
  const outRaw = {};
  const completed = {};
  (workflow.steps || []).forEach((step) => {
    const marker = byTitle[step.title] || "CAPTURE";
    out[step.id] = marker;
    outRaw[step.id] = marker + "-RAW";
    completed[step.id] = true;
  });
  return { out, outRaw, completed };
}

function assertStringArrayEqual(actual, expected, message) {
  assert.equal(JSON.stringify(actual || []), JSON.stringify(expected || []), message || "");
}

test("A/B/C: generated ids are assigned once and stable across save/load + edit/save/reload", async () => {
  const first = boot();
  const api = first.api;
  const generated = api.normalizeWorkflowForV1(buildGeneratedLikeWorkflowSkeleton("wf-generated"), []);
  const idsBefore = generated.steps.map((s) => s.id);
  assert.equal(new Set(idsBefore).size, generated.steps.length);
  assert.ok(idsBefore.every(Boolean));

  api.setWorkflowsForTest([generated]);
  api.setSelectedWorkflowIdForTest(generated.id);
  api.saveWorkflowsForTest();
  await api.loadWorkflowsForTest();
  const loaded = api.getWorkflowsForTest().find((wf) => wf.id === generated.id);
  assert.ok(loaded);
  assertStringArrayEqual(loaded.steps.map((s) => s.id), idsBefore);

  const stepRows = loaded.steps.map((step) => makeStepDom(step));
  api.setWorkflowStepElementsForTest(stepRows);
  api.handleSaveWorkflowForTest();
  const afterEditSave = api.getWorkflowsForTest().find((wf) => wf.id === generated.id);
  assertStringArrayEqual(afterEditSave.steps.map((s) => s.id), idsBefore);

  const second = boot(first.storage);
  await second.api.loadWorkflowsForTest();
  const reloaded = second.api.getWorkflowsForTest().find((wf) => wf.id === generated.id);
  assert.ok(reloaded);
  assertStringArrayEqual(reloaded.steps.map((s) => s.id), idsBefore);
});

test("D: reorder preserves durable step ids", () => {
  const { api } = boot();
  const generated = api.normalizeWorkflowForV1(buildGeneratedLikeWorkflowSkeleton("wf-reorder"), []);
  const byTitleBefore = {};
  generated.steps.forEach((s) => {
    byTitleBefore[s.title] = s.id;
  });
  const reordered = [generated.steps[2], generated.steps[0], generated.steps[1], generated.steps[3], generated.steps[4]];
  const dom = reordered.map((step) => makeStepDom(step));
  api.setWorkflowsForTest([generated]);
  api.setSelectedWorkflowIdForTest(generated.id);
  api.setWorkflowStepElementsForTest(dom);
  api.handleSaveWorkflowForTest();
  const saved = api.getWorkflowsForTest()[0];
  const byTitleAfter = {};
  saved.steps.forEach((s) => {
    byTitleAfter[s.title] = s.id;
  });
  assert.deepEqual(byTitleAfter, byTitleBefore);
  assertStringArrayEqual(saved.steps.map((s) => s.title), reordered.map((s) => s.title));
});

test("E/F: existing ids preserved; new step gets one stable id; title/notes/output edits keep ids", async () => {
  const first = boot();
  const api = first.api;
  const generated = api.normalizeWorkflowForV1(buildGeneratedLikeWorkflowSkeleton("wf-new-step"), []);
  const beforeIds = generated.steps.map((s) => s.id);
  api.setWorkflowsForTest([generated]);
  api.setSelectedWorkflowIdForTest(generated.id);

  const dom = generated.steps.map((step, index) =>
    makeStepDom(step, {
      title: step.title + " edited",
      notes: "edited notes " + index,
      outputName: "page"
    })
  );
  const newStep = {
    id: "new-step-once",
    title: "Custom Review Step",
    roleLabel: "Custom",
    outputName: "page",
    notes: "new"
  };
  dom.push(makeStepDom(newStep, { attrs: { "data-canonical-step-id": "" } }));
  api.setWorkflowStepElementsForTest(dom);
  api.handleSaveWorkflowForTest();
  const saved = api.getWorkflowsForTest()[0];
  const savedIds = saved.steps.map((s) => s.id);
  assert.equal(saved.steps.length, beforeIds.length + 1);
  assertStringArrayEqual(savedIds.slice(0, beforeIds.length), beforeIds);
  assert.equal(savedIds[savedIds.length - 1], "new-step-once");

  api.saveWorkflowsForTest();
  const second = boot(first.storage);
  await second.api.loadWorkflowsForTest();
  const reloaded = second.api.getWorkflowsForTest()[0];
  assertStringArrayEqual(reloaded.steps.map((s) => s.id), savedIds);
});

test("G: EP/DLA/GAM/CLS/DP captures restore after edit/save/reload and DLA gate passes", async () => {
  const first = boot();
  const api = first.api;
  const generated = api.normalizeWorkflowForV1(buildGeneratedLikeWorkflowSkeleton("wf-captures"), []);
  api.setWorkflowsForTest([generated]);
  api.setSelectedWorkflowIdForTest(generated.id);
  api.saveWorkflowsForTest();
  const { out, outRaw, completed } = stageCaptureMaps(generated);
  const refs = {};
  for (const sid of Object.keys(outRaw)) {
    const put = await api.persistWorkflowRunCapturePayloadForStepForTest(
      generated.id,
      sid,
      outRaw[sid],
      out[sid]
    );
    assert.equal(put.ok, true, JSON.stringify(put));
    refs[sid] = put.refs;
  }
  api.setWorkflowRunCaptureRefsForTest(refs);
  api.setWorkflowRunCapturedOutputsForTest(out);
  api.setWorkflowRunCapturedOutputsRawForTest(outRaw);
  api.setWorkflowRunStepCompletedForTest(completed);
  api.persistWorkflowRunStateForWorkflowForTest(generated.id, { toastType: "" });

  const editDom = generated.steps.map((step) => makeStepDom(step, { notes: step.notes + " edited" }));
  api.setWorkflowStepElementsForTest(editDom);
  api.handleSaveWorkflowForTest();
  api.saveWorkflowsForTest();
  assert.ok(first.storage[WFKEY], "workflow storage should be written");
  assert.ok(
    JSON.parse(first.storage[WFKEY]).some((wf) => wf.id === generated.id),
    "saved workflow id should remain"
  );

  const second = boot(first.storage);
  await second.api.loadWorkflowsForTest();
  const reloadedWf = second.api.getWorkflowsForTest().find((wf) => wf.id === generated.id);
  assert.ok(reloadedWf, "reloaded workflow missing; ids=" + second.api.getWorkflowsForTest().map((w) => w.id).join(","));
  second.api.setSelectedWorkflowIdForTest(reloadedWf.id);
  second.api.restoreWorkflowRunStateForWorkflowForTest(reloadedWf.id);
  await second.api.hydrateWorkflowRunCapturePayloadsForWorkflowForTest(reloadedWf.id);
  const restored = second.api.getWorkflowRunCapturedOutputsRawForTest();
  reloadedWf.steps.forEach((step) => {
    assert.ok(restored[step.id], "missing restored capture for " + step.title);
  });
  const dlaStep = reloadedWf.steps.find((s) => s.canonical_step_id === "step_design_learning_activities");
  assert.ok(dlaStep);
  assert.equal(
    second.api.isWorkflowRunStepCaptureReadyForAdvance(dlaStep, dlaStep.id, reloadedWf, null),
    true
  );
});

test("identity fallback: existing workflow row keeps id when data-step-id attribute is missing", () => {
  const { api } = boot();
  const generated = api.normalizeWorkflowForV1(buildGeneratedLikeWorkflowSkeleton("wf-missing-attr"), []);
  api.setWorkflowsForTest([generated]);
  api.setSelectedWorkflowIdForTest(generated.id);
  const missingAttrRow = makeStepDom(generated.steps[0], {
    attrs: { "data-step-id": "", "data-canonical-step-id": generated.steps[0].canonical_step_id },
    workflowStepId: "",
    stepIdField: ""
  });
  const others = generated.steps.slice(1).map((step) => makeStepDom(step));
  api.setWorkflowStepElementsForTest([missingAttrRow].concat(others));
  const gathered = api.gatherWorkflowDetailFormDataForTest();
  assert.equal(gathered.steps[0].id, generated.steps[0].id);
});

