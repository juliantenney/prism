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
    _: {
      debounce: (fn) => fn
    }
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
  assert.equal(typeof api.formatWorkflowRunStepCompleteStatus, "function");
  return { api };
}

test("formatWorkflowRunStepCompleteStatus: empty until pasted body or marked complete", () => {
  const { api } = loadPrismTestApi();
  assert.equal(api.formatWorkflowRunStepCompleteStatus("x", false, false), "");
  assert.equal(api.formatWorkflowRunStepCompleteStatus("", false, false), "");
});

test("formatWorkflowRunStepCompleteStatus: with output name when body or complete", () => {
  const { api } = loadPrismTestApi();
  assert.equal(
    api.formatWorkflowRunStepCompleteStatus("normalized_content", true, false),
    "Step complete \u00b7 Artefact: normalized_content"
  );
  assert.equal(
    api.formatWorkflowRunStepCompleteStatus("normalized_content", false, true),
    "Step complete \u00b7 Artefact: normalized_content"
  );
});

test("formatWorkflowRunStepCompleteStatus: no artefact line when output name blank", () => {
  const { api } = loadPrismTestApi();
  assert.equal(api.formatWorkflowRunStepCompleteStatus("  ", true, false), "Step complete");
  assert.equal(api.formatWorkflowRunStepCompleteStatus("", false, true), "Step complete");
});

test("gatherWorkflowDetailFormData step object must not capture runStepOutput field", () => {
  const src = fs.readFileSync(appJsPath, "utf8");
  const fnStart = src.indexOf("function gatherWorkflowDetailFormData()");
  assert.ok(fnStart >= 0, "gatherWorkflowDetailFormData must exist");
  const fnSlice = src.slice(fnStart, fnStart + 20000);
  const pushIdx = fnSlice.indexOf("steps.push({");
  assert.ok(pushIdx >= 0, "expected steps.push inside gather");
  const pushBlock = fnSlice.slice(pushIdx, pushIdx + 1200);
  assert.equal(
    pushBlock.includes("runStepOutput"),
    false,
    "run-mode paste buffer must not enter gathered step records"
  );
});
