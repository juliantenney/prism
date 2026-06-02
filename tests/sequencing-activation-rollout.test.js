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

test("strict learner export path auto-enables sequencing policy", () => {
  const page = loadFixture();
  const seqRow = page.sections[0].content[0];
  const suppressed = api.shouldSuppressInstructionList(
    seqRow,
    seqRow.materials,
    seqRow.learner_instructions,
    { enableSequencingInteractionPolicy: true },
    "learner"
  );
  assert.equal(suppressed, true);
  const html = api.buildUtilityStructuredHtmlForTest(page, ["sections"]).html || "";
  assert.match(html, /Put these in order from earliest to latest\./i);
});

test("strict facilitator export path stays disabled by default", () => {
  const page = loadFixture();
  page.page_profile = "facilitator";
  const html = api.buildUtilityStructuredHtmlForTest(page, ["sections"]).html || "";
  assert.match(html, /<li>\s*Event A\s*<\/li>/i);
  assert.match(html, /<li>\s*Event B\s*<\/li>/i);
  assert.match(html, /<li>\s*Event C\s*<\/li>/i);
});

test("explicit false remains reversible override for strict learner export", () => {
  const page = loadFixture();
  const html = api.buildUtilityStructuredHtmlForTest(page, ["sections"], {
    enableSequencingInteractionPolicy: false
  }).html || "";
  assert.match(html, /<li>\s*Event A\s*<\/li>/i);
  assert.match(html, /<li>\s*Event B\s*<\/li>/i);
  assert.match(html, /<li>\s*Event C\s*<\/li>/i);
});
