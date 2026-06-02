const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "sequencing-rollout-learner-page.json"
);

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => false },
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
  const sandbox = { console, setTimeout, clearTimeout, Promise, _: { debounce: (fn) => fn } };
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

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

const api = loadPrismTestApi();

test("render-policy flags: explicit false remains disabled by default", () => {
  const policy = api.resolveSequencingPolicy({ enableSequencingInteractionPolicy: false }, "learner");
  assert.equal(policy.enabled, false);
  assert.equal(api.shouldApplySequencingPolicy({ enableSequencingInteractionPolicy: false }, "learner"), false);
});

test("render-policy flags: explicit true enables policy for learner profile", () => {
  const policy = api.resolveSequencingPolicy({ enableSequencingInteractionPolicy: true }, "learner");
  assert.equal(policy.enabled, true);
  assert.equal(api.shouldApplySequencingPolicy({ enableSequencingInteractionPolicy: true }, "learner"), true);
});

test("strict learner mode: facilitator profile does not apply policy", () => {
  const shouldApply = api.shouldApplySequencingPolicy(
    { sequencingPolicy: { enabled: true, strictLearnerMode: true, allowLegacyInference: true } },
    "facilitator"
  );
  assert.equal(shouldApply, false);
});

test("target fixture: canonical metadata is preserved and learner order consumed when enabled", () => {
  const fixture = loadFixture();
  const seqRow = fixture.sections[0].content[0];
  const canonicalBefore = Array.from(seqRow.ordering.canonical_order);

  const disabledOrder = api.orderTaskCardItemsForRender(
    seqRow.materials.task_cards,
    seqRow,
    { enableSequencingInteractionPolicy: false },
    "learner"
  );
  assert.equal(disabledOrder[0].title, "Event A");

  const enabledOrder = api.orderTaskCardItemsForRender(
    seqRow.materials.task_cards,
    seqRow,
    { enableSequencingInteractionPolicy: true },
    "learner"
  );
  assert.equal(enabledOrder[0].title, "Event C");
  assert.deepEqual(Array.from(seqRow.ordering.canonical_order), canonicalBefore);
});

test("target fixture: duplicate list suppression applies only for sequencing row", () => {
  const fixture = loadFixture();
  const seqRow = fixture.sections[0].content[0];
  const discussionRow = fixture.sections[0].content[1];

  const seqSuppressed = api.shouldSuppressInstructionList(
    seqRow,
    seqRow.materials,
    seqRow.learner_instructions,
    { enableSequencingInteractionPolicy: true },
    "learner"
  );
  assert.equal(seqSuppressed, true);

  const discussionSuppressed = api.shouldSuppressInstructionList(
    discussionRow,
    discussionRow.materials,
    discussionRow.learner_instructions,
    { enableSequencingInteractionPolicy: true },
    "learner"
  );
  assert.equal(discussionSuppressed, false);
});

test("target fixture: low-confidence legacy mismatch does not suppress", () => {
  const legacyRow = {
    activity_interaction_type: "sequencing",
    learner_instructions: ["Alpha", "Beta", "Gamma"],
    materials: {
      task_cards: [
        { title: "Delta", instruction: "D" },
        { title: "Epsilon", instruction: "E" },
        { title: "Zeta", instruction: "Z" }
      ]
    }
  };
  const suppressed = api.shouldSuppressInstructionList(
    legacyRow,
    legacyRow.materials,
    legacyRow.learner_instructions,
    { enableSequencingInteractionPolicy: true },
    "learner"
  );
  assert.equal(suppressed, false);
});

test("realistic fixture render: disabled preserves list, enabled keeps short instruction text", () => {
  const page = loadFixture();
  const disabled = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
    enableSequencingInteractionPolicy: false
  }).html || "";
  const enabled = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
    enableSequencingInteractionPolicy: true
  }).html || "";

  assert.match(disabled, /<li>\s*Event A\s*<\/li>/i);
  assert.match(disabled, /<li>\s*Event B\s*<\/li>/i);
  assert.match(disabled, /<li>\s*Event C\s*<\/li>/i);
  assert.match(enabled, /Put these in order from earliest to latest\./i);
});
