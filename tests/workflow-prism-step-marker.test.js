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
  assert.equal(typeof api.sanitizePrismRunCapturedOutput, "function");
  return { api };
}

test("buildWorkflowStepInstructions: STEP N OUTPUT pattern when outputName is set", () => {
  const { api } = loadPrismTestApi();
  const step = {
    id: "s1",
    title: "Only notes",
    roleLabel: "",
    outputName: "normalized_content",
    inputKind: "text",
    notes: "Designer note for this step.",
    override_prompt_body: "",
    prompt_source_type: "none",
    prompt_source: "none",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 0, null);
  assert.match(instr, /Finish the artefact in your main answer; do not include the machine artefact name inside that body/i);
  assert.match(
    instr,
    /At the end of your answer, restate the final output on a separate line, prefixed with 'STEP N OUTPUT:'\./
  );
  assert.match(instr, /exit any markdown or fenced code output/i);
  assert.match(instr, /plain conversational text outside the artefact block/i);
  assert.match(instr, /runner status\/footer only, not part of the markdown artefact body/i);
  assert.match(instr, /STEP\s*1\s*OUTPUT:\s*normalized_content/);
  assert.equal(/\[\[PRISM_COMPLETE\]\]/.test(instr), false);
  assert.equal(instr.includes("Name the final result of this step as:"), false);
});

test("buildWorkflowStepInstructions: STEP number follows zero-based index", () => {
  const { api } = loadPrismTestApi();
  const step = {
    id: "s2",
    title: "Second",
    roleLabel: "",
    outputName: "out2",
    inputKind: "text",
    notes: "n",
    prompt_source_type: "none",
    prompt_source: "none",
    promptId: "",
    inputBindings: []
  };
  const instr = api.buildWorkflowStepInstructions(step, 2, null);
  assert.match(instr, /STEP\s*3\s*OUTPUT/i);
});

test("sanitizePrismRunCapturedOutput: strips trailing STEP N OUTPUT block", () => {
  const { api } = loadPrismTestApi();
  assert.equal(api.sanitizePrismRunCapturedOutput("Hello\nSTEP 1 OUTPUT: meta"), "Hello");
  assert.equal(api.sanitizePrismRunCapturedOutput("Body\n\nSTEP 2 OUTPUT:\nmore\nlines"), "Body\n");
});

test("sanitizePrismRunCapturedOutput: content before STEP line preserved exactly", () => {
  const { api } = loadPrismTestApi();
  const before = "  line1\n\tline2";
  assert.equal(api.sanitizePrismRunCapturedOutput(`${before}\nSTEP 1 OUTPUT: x`), before);
});

test("sanitizePrismRunCapturedOutput: strips trailing orphan markdown fence line", () => {
  const { api } = loadPrismTestApi();
  assert.equal(api.sanitizePrismRunCapturedOutput("body\n```"), "body");
  assert.equal(api.sanitizePrismRunCapturedOutput("body\n```markdown"), "body");
  assert.equal(api.sanitizePrismRunCapturedOutput("```"), "");
});

test("sanitizePrismRunCapturedOutput: does not strip ``` line mid-body", () => {
  const { api } = loadPrismTestApi();
  const s = "intro\n```\ncode\n```\ntrailer";
  assert.equal(api.sanitizePrismRunCapturedOutput(s), s);
});

test("sanitizePrismRunCapturedOutput: no STEP footer leaves string unchanged", () => {
  const { api } = loadPrismTestApi();
  const s = "Body\nSTEP 1 OUTPUT is a discussion phrase only when not at line start";
  assert.equal(api.sanitizePrismRunCapturedOutput(s), s);
});

test("buildWorkflowStepInstructions: upstream injection has no STEP OUTPUT footer", () => {
  const { api } = loadPrismTestApi();
  const wf = {
    id: "wf1",
    name: "Test WF",
    artefacts: "",
    tags: [],
    notes: "",
    selectedDomains: ["general"],
    workflowOutputSpec: { audience: "", goal: "", constraints: "" },
    steps: [
      {
        id: "s1",
        title: "Producer",
        roleLabel: "",
        outputName: "alpha",
        inputKind: "text",
        notes: "",
        prompt_source_type: "none",
        prompt_source: "none",
        promptId: "",
        inputBindings: [],
        canonical_step_id: "",
        domain_version: ""
      },
      {
        id: "s2",
        title: "Consumer",
        roleLabel: "",
        outputName: "",
        inputKind: "text",
        notes: "Use upstream artefact.",
        prompt_source_type: "none",
        prompt_source: "none",
        promptId: "",
        inputBindings: [{ kind: "internal", sourceStepId: "s1", artifactName: "alpha" }],
        canonical_step_id: "",
        domain_version: ""
      }
    ]
  };
  api.setWorkflowsForTest([wf]);
  api.setSelectedWorkflowIdForTest("wf1");
  api.setWorkflowRunCaptureMapsForTest(
    { s1: "ART_OK" },
    { s1: "ART_OK\nSTEP 1 OUTPUT: should not appear downstream\n" }
  );

  const consumer = wf.steps[1];
  const instr = api.buildWorkflowStepInstructions(consumer, 1, null);
  assert.match(instr, /Upstream artefact "alpha"/);
  assert.match(instr, /ART_OK/);

  const idxUp = instr.indexOf('Upstream artefact "alpha"');
  const idxTail = instr.indexOf("How to use inputs for this step (from the workflow designer):");
  assert.ok(idxUp >= 0 && idxTail > idxUp);
  const mid = instr.slice(idxUp, idxTail);
  assert.equal(/STEP\s*\d+\s*OUTPUT/i.test(mid), false);
});

test("gatherWorkflowDetailFormData step capture still excludes runStepOutput", () => {
  const src = fs.readFileSync(appJsPath, "utf8");
  const fnStart = src.indexOf("function gatherWorkflowDetailFormData()");
  assert.ok(fnStart >= 0);
  const fnSlice = src.slice(fnStart, fnStart + 20000);
  const pushIdx = fnSlice.indexOf("steps.push({");
  assert.ok(pushIdx >= 0);
  const pushBlock = fnSlice.slice(pushIdx, pushIdx + 1200);
  assert.equal(pushBlock.includes("runStepOutput"), false);
});
