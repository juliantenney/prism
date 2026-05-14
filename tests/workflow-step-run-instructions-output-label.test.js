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
  assert.equal(typeof api.buildWorkflowStepInstructions, "function");
  return { api, sandbox };
}

test("buildWorkflowStepInstructions: STEP N OUTPUT pattern when outputName is set", async () => {
  const { api } = loadPrismTestApi();
  const step = {
    id: "s1",
    title: "Normalize Content",
    roleLabel: "Prepare sources",
    outputName: "normalized_content",
    inputKind: "text",
    notes: "",
    override_prompt_body: "Return only the normalized body.",
    prompt_source_type: "local_override",
    prompt_source: "local_override",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 0, null);
  assert.match(instr, /core prompt for this step/i);
  assert.match(
    instr,
    /At the end of your answer, restate the final output on a separate line, prefixed with 'STEP N OUTPUT:'\./
  );
  assert.match(instr, /STEP\s*1\s*OUTPUT:\s*normalized_content/);
  assert.match(instr, /exit any markdown or fenced code output/i);
  assert.equal(/\[\[PRISM_COMPLETE\]\]/.test(instr), false);
  assert.equal(instr.includes("Name the final result of this step as:"), false);
});

test("buildPromptFactoryWorkflowContextText: step output artefact id is not injected as prose", () => {
  const { api } = loadPrismTestApi();
  const ctx = {
    workflowName: "Demo",
    stepTitle: "Normalize Content",
    stepCanonicalTitle: "Normalize Content",
    stepOutputName: "normalized_content",
    stepRoleLabel: "Normalize",
    stepNotes: "",
    stepInputArtefacts: []
  };
  const text = api.buildPromptFactoryWorkflowContextText(ctx, { promptScope: "step_only" });
  assert.equal(text.includes("normalized_content"), false);
  assert.equal(/output artefact/i.test(text), false);
});

test("buildWorkflowStepPromptFallback: no quoted machine artefact id lines", () => {
  const { api } = loadPrismTestApi();
  const cfg = {
    defaultPromptNotes: "Note.",
    preferredOutputFormat: "structured_markdown",
    defaultOutputStructure: null,
    structureStyle: "text_structured"
  };
  const ctx = {
    stepCanonicalTitle: "Normalize Content",
    stepTitle: "Normalize Content",
    stepOutputName: "normalized_content",
    stepInputArtefacts: []
  };
  const out = api.buildWorkflowStepPromptFallback(cfg, ctx, []);
  assert.equal(out.includes('artefact "normalized_content"'), false);
  assert.equal(/STEP\s*\d+\s*OUTPUT/i.test(out), false);
});
