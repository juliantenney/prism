/**
 * Renderer hotfix — assessment_check sections (RNA/HCV page shape).
 */

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
  "ld-rna-hcv-assessment-page.json"
);
const inflationFullPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-page-full.json"
);

const CATALOG_PAGE_SECTION_ORDER = [
  "overview",
  "learning_purpose",
  "knowledge_summary",
  "learning_activities",
  "assessment_check",
  "support_notes"
];

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
  assert.ok(api);
  return api;
}

function renderPageFixture(api, filePath, sectionOrder) {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const r = sectionOrder
    ? api.buildUtilityStructuredHtmlForTest(parsed, sectionOrder)
    : api.buildUtilityStructuredHtmlForTest(parsed);
  assert.ok(r && !r.error, r && r.error);
  return String(r.html || "");
}

function assessmentSectionScope(html) {
  const m = html.match(
    /Formative Assessment Check[\s\S]*?(?=<h2 class="util-section-heading"|<details class="util-meta"|$)/i
  );
  return m ? m[0] : "";
}

const api = loadPrismTestApi();

test("RNA/HCV page: assessment_check renders heading, stems, and object-key options", () => {
  const html = renderPageFixture(api, fixturePath);
  assert.match(html, /Formative Assessment Check/i);
  assert.match(html, /Study and Revision Guidance/i);
  assert.match(html, /Which type of RNA virus genome can be directly translated/i);
  assert.match(html, /Positive-sense RNA/i);
  assert.match(html, /Why is microRNA-122 essential/i);
  assert.match(html, /util-assessment-section/);
  assert.match(html, /util-assessment-item/);
  assert.match(html, /util-assessment-options/);
  assert.doesNotMatch(html, /Self-check questions will appear here/i);
  const scope = assessmentSectionScope(html);
  assert.ok(scope, "assessment section scope");
  assert.equal((scope.match(/util-assessment-title/gi) || []).length, 10);
  assert.doesNotMatch(scope, /Study and Revision Guidance/i);
  assert.doesNotMatch(html, /Correct answer:/i);
  assert.doesNotMatch(html, /Answer Key/i);
});

test("RNA/HCV page: catalog sectionOrder with adjacent support_notes does not bleed headings or drop MCQs", () => {
  const html = renderPageFixture(api, fixturePath, CATALOG_PAGE_SECTION_ORDER);
  assert.match(html, /Formative Assessment Check/i);
  assert.match(html, /Study and Revision Guidance/i);
  assert.match(html, /Which type of RNA virus genome can be directly translated/i);
  assert.doesNotMatch(html, /Self-check questions will appear here/i);
  const scope = assessmentSectionScope(html);
  assert.ok(scope);
  assert.equal((scope.match(/util-assessment-title/gi) || []).length, 10);
  assert.doesNotMatch(scope, /Study and Revision Guidance/i);
});

test("RNA/HCV page: assessment_check renders when heading is omitted but section_id is canonical", () => {
  const parsed = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const ac = parsed.sections.find((s) => s.section_id === "assessment_check");
  delete ac.heading;
  const r = api.buildUtilityStructuredHtmlForTest(parsed, CATALOG_PAGE_SECTION_ORDER);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /Which type of RNA virus genome can be directly translated/i);
  assert.match(html, /util-assessment-section/);
  assert.doesNotMatch(html, /Self-check questions will appear here/i);
});

test("inflation workshop (full): assessment_check section still renders MCQ body", () => {
  const html = renderPageFixture(api, inflationFullPath, CATALOG_PAGE_SECTION_ORDER);
  assert.match(html, /Formative assessment check/i);
  assert.match(html, /Which situation best illustrates inflation/i);
  assert.match(html, /util-assessment-section/);
});
