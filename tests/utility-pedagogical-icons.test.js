/**
 * Semantic pedagogical icons (Lucide) and beat classification.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { runPrismLibScriptsInSandbox, PEDAGOGICAL_ICON_LIBS } = require("./prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const inflationFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-page-full.json"
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

test("pedagogical icons: semantic registry renders Lucide SVG", () => {
  const api = loadPrismTestApi();
  const icons = api.getUtilityPedagogicalIconRendererForTest();
  assert.ok(icons);
  const html = icons.renderIconHtml("REFLECT", { size: "md" });
  assert.match(html, /<svg class="[^"]*util-lucide-icon[^"]*util-lucide-icon--md/);
  assert.match(html, /viewBox="0 0 24 24"/);
  assert.match(html, /width="18" height="18"/);
  assert.doesNotMatch(html, /fa-/);
});

test("pedagogical beats: classification heuristics", () => {
  const api = loadPrismTestApi();
  const classify = api.utilityClassifyPedagogicalBeatForTest;
  assert.equal(classify("Reflect on your answer"), "REFLECT");
  assert.equal(classify("Think about how inflation affects households"), "REFLECT");
  assert.equal(classify("Discuss in your group"), "DISCUSS");
  assert.equal(classify("Worked Example: CPI basket"), "EXAMPLE");
  assert.equal(classify("Try it yourself"), "PRACTICE");
  assert.equal(classify("Check your understanding"), "CHECK");
  assert.equal(classify("", "checklist"), "CHECK");
  assert.equal(classify("Reflect on your answer", "checklist"), "CHECK");
});

test("pedagogical beats: renderBeat helper", () => {
  const api = loadPrismTestApi();
  const beat = api.utilityRenderPedagogicalBeatHtmlForTest("REFLECT", { label: "Reflect" });
  assert.match(beat, /data-pedagogic-beat="REFLECT"/);
  assert.match(beat, /util-pedagogic-beat/);
  assert.match(beat, /<svg/);
});

test("page export: Lucide icons and no Font Awesome", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(inflationFixturePath, "utf8"));
  const r = api.buildUtilityStructuredHtmlForTest(page);
  const html = r.html || "";
  assert.doesNotMatch(html, /font-awesome/);
  assert.doesNotMatch(html, /fa-solid/);
  assert.match(html, /util-lucide-icon/);
  assert.match(html, /\.util-lucide-icon--md\{width:18px;height:18px\}/);
  assert.match(html, /<header class="util-learning-header">/);
  const headerBlock = html.match(/<header class="util-learning-header"[\s\S]*?<\/header>/i);
  assert.ok(headerBlock, "expected sticky learning header block");
  assert.doesNotMatch(headerBlock[0], /<svg/);
  assert.doesNotMatch(headerBlock[0], /util-lucide-icon/);
  const bodyBlock = html.match(/<body[\s\S]*<\/body>/i);
  const bodyHtml = bodyBlock ? bodyBlock[0] : html;
  assert.doesNotMatch(bodyHtml, /<ul class="util-checkbox-list"/);
  assert.doesNotMatch(bodyHtml, /<span class="util-checkbox"/);
  assert.match(bodyHtml, /util-checklist/);
});
