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

test("normalization preserves sequencing metadata when present", () => {
  const row = {
    activity_id: "A1",
    title: "Timeline ordering",
    activity_interaction_type: "sequencing",
    ordering: {
      canonical_order: ["E1", "E2", "E3"],
      learner_display_order: ["E2", "E3", "E1"],
      learner_display_order_strategy: "deterministic_shuffle",
      shuffle_seed_key: "wf-1::a1"
    },
    render_hints: {
      suppress_instruction_list_when_task_cards_present: true,
      keep_instruction_summary_above_cards: true
    }
  };

  const out = api.normalizeActivityInteractionMetadata(row);
  assert.notEqual(out, row, "normalization should return a cloned object when metadata is present");
  assert.equal(out.activity_interaction_type, "sequencing");
  assert.deepEqual(Array.from(out.ordering.canonical_order), ["E1", "E2", "E3"]);
  assert.deepEqual(Array.from(out.ordering.learner_display_order), ["E2", "E3", "E1"]);
  assert.equal(out.ordering.learner_display_order_strategy, "deterministic_shuffle");
  assert.equal(out.ordering.shuffle_seed_key, "wf-1::a1");
  assert.equal(out.render_hints.suppress_instruction_list_when_task_cards_present, true);
  assert.equal(out.render_hints.keep_instruction_summary_above_cards, true);
});

test("partial metadata is tolerated with safe nested defaults", () => {
  const row = {
    activity_id: "A2",
    activity_interaction_type: "ranking",
    ordering: {
      canonical_order: ["A", "B", "C"]
    },
    render_hints: {}
  };

  const out = api.normalizeActivityInteractionMetadata(row);
  assert.deepEqual(Array.from(out.ordering.canonical_order), ["A", "B", "C"]);
  assert.deepEqual(Array.from(out.ordering.learner_display_order), []);
  assert.equal(out.ordering.learner_display_order_strategy, "");
  assert.equal(out.ordering.shuffle_seed_key, "");
  assert.equal(out.render_hints.suppress_instruction_list_when_task_cards_present, false);
  assert.equal(out.render_hints.keep_instruction_summary_above_cards, false);
});

test("missing metadata leaves legacy rows unchanged", () => {
  const row = {
    activity_id: "A3",
    title: "Legacy activity",
    learner_task: "Discuss with your group."
  };

  const out = api.normalizeActivityInteractionMetadata(row);
  assert.equal(out, row, "legacy rows should pass through untouched");
  assert.equal(Object.prototype.hasOwnProperty.call(out, "ordering"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(out, "render_hints"), false);
});

test("source objects are not mutated during metadata normalization", () => {
  const row = {
    activity_id: "A4",
    ordering: {
      canonical_order: ["one", "two"]
    },
    render_hints: {
      keep_instruction_summary_above_cards: true
    }
  };

  const sourceBefore = JSON.stringify(row);
  const out = api.normalizeActivityInteractionMetadata(row);

  out.ordering.canonical_order.push("three");
  out.render_hints.keep_instruction_summary_above_cards = false;

  assert.equal(JSON.stringify(row), sourceBefore, "source row should remain unchanged");
  assert.deepEqual(Array.from(row.ordering.canonical_order), ["one", "two"]);
  assert.equal(row.render_hints.keep_instruction_summary_above_cards, true);
});
