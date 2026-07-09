const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

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
    click() {}
  };
}

function loadPrismTestApi() {
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  const elementStore = new Map();
  const documentStub = {
    readyState: "complete",
    addEventListener() {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild() {}, removeChild() {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener() {},
    removeEventListener() {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem() {} },
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
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  const api = sandbox.window.__PRISM_TEST_API;
  assert.ok(api, "Expected __PRISM_TEST_API");
  return api;
}

test("artefact steps require valid capture before advance", () => {
  const api = loadPrismTestApi();
  const step = { id: "s1", title: "Generate Assessment Items", outputName: "page" };
  const ta = createElementStub();
  ta.setAttribute("data-field", "runStepOutput");
  const li = createElementStub();
  li.setAttribute("data-step-id", "s1");
  li.querySelector = function (sel) {
    if (sel === '[data-field="runStepOutput"]') return ta;
    return null;
  };

  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(step, "s1", {}, li), false);

  ta.value = '{"artifact_type":"page","schema_version":"2.0.0"}';
  assert.equal(api.isWorkflowRunStepCaptureReadyForAdvance(step, "s1", {}, li), true);
});

test("clearWorkflowRunCaptureState empties in-memory capture maps", () => {
  const api = loadPrismTestApi();
  api.setWorkflowRunCapturedOutputsForTest({ s1: '{"items":[]}' });
  api.clearWorkflowRunCaptureState({ resetIndex: true, clearDom: false });
  assert.equal(Object.keys(api.getWorkflowRunCapturedOutputsForTest()).length, 0);
});

test("resolveWorkflowRunNextStepDisabledReason blocks empty artefact steps", () => {
  const api = loadPrismTestApi();
  const step = { id: "s1", title: "Design Learning Activities", outputName: "page" };
  const reason = api.resolveWorkflowRunNextStepDisabledReason(step, "s1", {}, null, 0, 3);
  assert.match(reason, /Paste a valid output artefact/i);
});

test("resolveWorkflowRunNextStepDisabledReason does not block non-page output steps", () => {
  const api = loadPrismTestApi();
  const step = { id: "s1", title: "Normalize Content", outputName: "normalized_content" };
  const reason = api.resolveWorkflowRunNextStepDisabledReason(step, "s1", {}, null, 0, 3);
  assert.equal(reason, "");
});

test("episode plan validation residue does not block when capture is empty", () => {
  const api = loadPrismTestApi();
  const step = { id: "s1", title: "Design Episode Plan", canonical_step_id: "step_design_episode_plan", outputName: "page" };
  const ta = createElementStub();
  ta.setAttribute("data-field", "runStepOutput");
  ta.value = "";
  const li = createElementStub();
  li.setAttribute("data-step-id", "s1");
  li.querySelector = function (sel) {
    if (sel === '[data-field="runStepOutput"]') return ta;
    return null;
  };
  api.setWorkflowRunCapturedOutputsForTest({ s1: "" });
  const reason = api.resolveWorkflowRunNextStepDisabledReason(step, "s1", {}, li, 0, 3);
  assert.match(reason, /Paste a valid output artefact/i);
});

test("EP page shell capture is advance-ready without design-page composition gates", () => {
  const api = loadPrismTestApi();
  const step = { id: "s1", title: "Design Episode Plan", canonical_step_id: "step_design_episode_plan", outputName: "page" };
  const ta = createElementStub();
  ta.setAttribute("data-field", "runStepOutput");
  ta.value = JSON.stringify({
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "episode_plan", enriched_by: ["episode_plan"] },
    title: "T",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    page_synthesis: {},
    learning_outcomes: [],
    activities: [],
    episode_plans: [],
    source_artefacts: [],
    generation_notes: { validation: { coverage_mode: "activity_aligned", known_issues: [] } }
  });
  const li = createElementStub();
  li.setAttribute("data-step-id", "s1");
  li.querySelector = function (sel) {
    if (sel === '[data-field="runStepOutput"]') return ta;
    return null;
  };
  const ready = api.isWorkflowRunStepCaptureReadyForAdvance(step, "s1", {}, li);
  assert.equal(ready, true);
});

