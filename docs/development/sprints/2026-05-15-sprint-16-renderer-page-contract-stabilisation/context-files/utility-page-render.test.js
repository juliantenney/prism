const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(__dirname, "fixtures", "page-render");

function createElementStub() {
  return {
    value: "",
    textContent: "",
    className: "",
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() { return false; } },
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
  assert.ok(api);
  assert.equal(typeof api.buildUtilityStructuredHtmlForTest, "function");
  return { api };
}

function loadPageFixture(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function renderPageFixture(api, fixtureName, sectionOrder) {
  const parsed = loadPageFixture(fixtureName);
  const r = api.buildUtilityStructuredHtmlForTest(parsed, sectionOrder);
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

test("page fixture: Research multiline • bullets in section.content", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "research-multiline-bullets.json");
  const keyFindingsBlock = html.match(/Key findings[\s\S]*?(?=<h2|<details class="util-meta"|$)/i);
  assert.ok(keyFindingsBlock, "Key findings section missing");
  const sectionHtml = keyFindingsBlock[0];
  assert.match(sectionHtml, /<ul>/);
  assert.equal((sectionHtml.match(/<li>/g) || []).length, 3);
  assert.match(sectionHtml, /Infrastructure vs practice/);
});

test("page fixture: Research inline • bullet run in section.content", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "research-inline-bullets.json");
  assert.match(html, /<ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 3);
});

test("page fixture: Research prose + bullets + prose", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "research-prose-bullets-prose.json");
  assert.match(html, /Intro paragraph stays/);
  assert.match(html, /<ul>/);
  assert.match(html, /Closing line/);
});

test("page fixture: LD learning activities + formative assessment section", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "ld-learning-activities-assessment.json");
  assert.match(html, /Learning activit/i);
  assert.match(html, /Scenario A/);
  assert.match(html, /Formative Assessment Check|assessment check/i);
  assert.match(html, /Which observation most strongly/);
});

test("page fixture: markdown table in section.content", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "markdown-table-section.json");
  assert.match(html, /<table>/);
  assert.match(html, /Adoption/);
});

test("page fixture: checkbox list in section.content", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "checkbox-list-section.json");
  assert.match(html, /util-checkbox-list/);
  assert.match(html, /☐/);
});

test("page fixture: production metadata collapsible block", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "metadata-full.json", [
    "sections",
    "source_artefacts",
    "constraints_applied",
    "generation_notes"
  ]);
  assert.match(html, /Production Metadata/);
  assert.match(html, /Briefing Note/);
  assert.match(html, /Thematic Analysis/);
  assert.match(html, /limitations/i);
});
