const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
const vm = require("node:vm");

// Markdown block-level shapes: full page HTML semantics live in utility-page-render.test.js
// (tests/fixtures/page-render/shape-*.json).

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");

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
  assert.equal(typeof api.utilityRenderMarkdownBlockForTest, "function");
  assert.equal(typeof api.buildUtilityStructuredHtmlForTest, "function");
  return { api };
}

test("utilityRenderMarkdownBlock: newline bullet lines (•) become ul/li", () => {
  const { api } = loadPrismTestApi();
  const md = "• Item one.\n• Item two.\n• Item three.";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<ul>/);
  assert.match(html, /<\/ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 3);
  assert.match(html, /Item one/);
  assert.match(html, /Item two/);
  assert.match(html, /Item three/);
});

test("utilityRenderMarkdownBlock: inline • run becomes ul/li", () => {
  const { api } = loadPrismTestApi();
  const md = "• item one. • item two. • item three.";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 3);
});

test("utilityRenderMarkdownBlock: prose + bullets + prose", () => {
  const { api } = loadPrismTestApi();
  const md = "Intro paragraph stays.\n\n• First bullet.\n• Second bullet.\n\nClosing line.";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /Intro paragraph stays/);
  assert.match(html, /<ul>/);
  assert.match(html, /First bullet/);
  assert.match(html, /Second bullet/);
  assert.match(html, /Closing line/);
});

test("utilityRenderMarkdownBlock: markdown table still renders", () => {
  const { api } = loadPrismTestApi();
  const md = ["| Col A | Col B |", "| --- | --- |", "| x | y |"].join("\n");
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<table>/);
  assert.match(html, /<\/table>/);
  assert.match(html, /Col A/);
});

test("utilityRenderMarkdownBlock: ordinary prose unchanged (single p)", () => {
  const { api } = loadPrismTestApi();
  const md = "Just a normal paragraph without list markers.";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /^<p>/);
  assert.match(html, /<\/p>$/);
  assert.equal(html.includes("<ul>"), false);
});

test("utilityRenderMarkdownBlock: hyphen checklist lines stay ul (checkbox sanitize is downstream)", () => {
  const { api } = loadPrismTestApi();
  const md = "- ☐ First task\n- ☐ Second task";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 2);
  assert.match(html, /☐/);
});

test("utilityRenderMarkdownBlock: CR-only newlines still produce ul/li for bullet lines", () => {
  const { api } = loadPrismTestApi();
  const md = "• One.\r• Two.\r• Three.";
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 3);
});

test("utilityRenderMarkdownBlock: ordered item keeps indented bullets nested", () => {
  const { api } = loadPrismTestApi();
  const md = [
    "1. Identify:",
    "  - \\(a\\)",
    "  - \\(b\\)",
    "  - \\(c\\)",
    "2. Substitute values in the quadratic formula."
  ].join("\n");
  const html = String(api.utilityRenderMarkdownBlockForTest(md) || "");
  assert.match(
    html,
    /<ol><li>Identify:<ul><li>\\\(a\\\)<\/li><li>\\\(b\\\)<\/li><li>\\\(c\\\)<\/li><\/ul><\/li><li>Substitute values in the quadratic formula\.<\/li><\/ol>/
  );
  assert.doesNotMatch(html, /<\/ol>\s*<ul>/);
});

test("buildUtilityStructuredHtml: materials content with newline • bullets yields ul/li (Research-style Key Findings text)", () => {
  const { api } = loadPrismTestApi();
  const keyFindingsBody =
    "• Infrastructure vs practice: tools exist but adoption lags.\n" +
    "• Efficiency vs impact: speed gains do not always improve outcomes.\n" +
    "• AI adoption pattern: pilots cluster in low-risk workflows first.";
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "document",
    title: "Research briefing page",
    audience: "Stakeholders",
    sections: [
      {
        title: "Learning activities",
        content: [
          {
            title: "Synthesis block",
            materials: {
              heading: "Key Findings",
              content: keyFindingsBody
            }
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /<ul>/);
  assert.equal((html.match(/<li>/g) || []).length, 3);
  assert.match(html, /Infrastructure vs practice/);
  assert.match(html, /Efficiency vs impact/);
  assert.match(html, /AI adoption pattern/);
});
