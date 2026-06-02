const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false,
      toggle: () => false
    },
    style: {},
    dataset: {},
    children: [],
    appendChild() {},
    removeChild() {},
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {},
    focus: () => {},
    click: () => {}
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
    addEventListener: () => {},
    createElement: () => createElementStub(),
    getElementById: (id) => {
      if (!elementStore.has(id)) elementStore.set(id, createElementStub());
      return elementStore.get(id);
    },
    querySelector: () => createElementStub(),
    querySelectorAll: () => [],
    body: { appendChild: () => {}, removeChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
    removeEventListener: () => {},
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "blob:test", revokeObjectURL: () => {} },
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

const api = loadPrismTestApi();

test("deterministic shuffle repeats with same seed", () => {
  const items = ["A", "B", "C", "D", "E"];
  const seed = api.computeStableSeed(["wf-1", "A3", "sequencing"]);
  const first = api.deterministicShuffle(items, seed);
  const second = api.deterministicShuffle(items, seed);
  assert.deepEqual(Array.from(first), Array.from(second));
});

test("deterministic shuffle changes across different seeds", () => {
  const items = ["A", "B", "C", "D", "E", "F", "G"];
  const a = api.deterministicShuffle(items, api.computeStableSeed(["wf-1", "A3"]));
  const b = api.deterministicShuffle(items, api.computeStableSeed(["wf-1", "A4"]));
  assert.notDeepEqual(Array.from(a), Array.from(b));
});

test("deterministic shuffle does not mutate source array", () => {
  const items = [{ id: "x" }, { id: "y" }, { id: "z" }];
  const before = items.slice();
  const out = api.deterministicShuffle(items, 1234);
  assert.deepEqual(items, before);
  assert.notEqual(out, items);
});

test("sequencing policy defaults disabled unless explicitly enabled", () => {
  const policy = api.resolveSequencingPolicy({}, "learner");
  assert.equal(policy.enabled, false);
  assert.equal(policy.strictLearnerMode, true);
  assert.equal(policy.allowLegacyInference, true);
});

test("sequencing policy helper tolerates legacy rows", () => {
  const legacy = { activity_id: "A1", title: "Legacy" };
  assert.deepEqual(Array.from(api.getCanonicalItemOrder(legacy)), []);
  assert.deepEqual(Array.from(api.getLearnerItemOrderForRender(legacy, {}, "learner")), []);
  assert.equal(api.shouldApplySequencingPolicy({}, "learner"), false);
});

test("metadata helper uses learner order only when policy enabled", () => {
  const row = {
    activity_id: "A2",
    ordering: {
      canonical_order: ["C1", "C2", "C3"],
      learner_display_order: ["C2", "C3", "C1"]
    }
  };
  const disabled = api.getLearnerItemOrderForRender(row, {}, "learner");
  const enabled = api.getLearnerItemOrderForRender(
    row,
    { sequencingPolicy: { enabled: true, strictLearnerMode: true, allowLegacyInference: true } },
    "learner"
  );
  assert.deepEqual(Array.from(disabled), ["C1", "C2", "C3"]);
  assert.deepEqual(Array.from(enabled), ["C2", "C3", "C1"]);
});
