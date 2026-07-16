/**
 * Sprint 55 — typography foundation pass (editorial reading measure).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const marxFixturePath = path.join(repoRoot, "tests", "fixtures", "page-render", "marx-beat-render-page.json");

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
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  vm.runInContext(source, sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

test("typography foundation: export CSS includes reading measure and spacing scale", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(html, /max-width:68ch/);
  assert.match(html, /--space-1:\.375rem/);
  assert.match(html, /--space-5:2\.5rem/);
});

test("typography foundation: learning header shell stays export width, prose at 68ch", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(
    html,
    /body\.util-page-export--with-learning-header[^}]*max-width:920px/
  );
  assert.match(
    html,
    /body\.util-page-export>section,body\.util-page-export>div\[data-journey-section\][^}]*max-width:68ch/
  );
  assert.doesNotMatch(
    html,
    /body\.util-page-export--with-learning-header,body\.util-page-export--with-compass,body\.util-page-export--with-journey-nav\{max-width:68ch/
  );
  assert.match(html, /\.util-learning-header[^}]*max-width:none/);
});

test("typography foundation: activities render as document sections not cards", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(html, /article\.util-task-block[^}]*border:0/);
  assert.match(html, /article\.util-task-block[^}]*box-shadow:none/);
  assert.match(html, /article\.util-task-block[^}]*background:transparent/);
});

test("typography foundation: beat headings and subdued material headings", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(html, /\.util-beat-heading\{[^}]*font-size:1\.05rem/);
  assert.match(html, /h4\.util-material-heading[^}]*font-size:\.95rem/);
  assert.match(html, /h4\.util-material-heading[^}]*text-transform:none/);
});

test("typography foundation: instructional blocks use editorial chrome reduction", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  assert.match(html, /\.util-worked-example[^}]*background:transparent/);
  assert.match(html, /\.util-pedagogic-callout[^}]*box-shadow:none/);
  assert.match(html, /\.util-cognition[^}]*background:transparent/);
  assert.match(html, /\.util-support-note[^}]*background:transparent/);
});

test("typography foundation: Marx A1 retains beat structure with calmer presentation", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(marxFixturePath, "utf8"));
  const html = api.buildUtilityStructuredHtmlForTest(page).html || "";
  const a1 = html.match(
    /Historical Materialism and Capitalism[\s\S]*?(?=Surplus Value and Exploitation|Is Marx Still Relevant|$)/i
  );
  assert.ok(a1, "expected A1 block");
  assert.match(a1[0], /class="util-beat-heading"/);
  assert.match(a1[0], />Understand</);
  assert.match(a1[0], />See it modelled</);
  assert.match(a1[0], />Check your work</);
});
