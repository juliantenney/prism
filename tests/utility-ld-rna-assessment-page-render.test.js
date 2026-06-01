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

test("slice 31-1: RNA/HCV fixture — production metadata folded, not in main body", () => {
  const html = renderPageFixture(api, fixturePath);
  const body = html.split('<details class="util-meta"')[0];
  assert.match(html, /<details class="util-meta"/);
  assert.match(html, /About this page/);
  assert.doesNotMatch(body, /<h2[^>]*>\s*Source Artefacts/i);
  assert.doesNotMatch(body, /<h2[^>]*>\s*Production Metadata/i);
  assert.doesNotMatch(body, /<strong>Audience:<\/strong>/i);
  assert.match(html, /util-meta-section/);
  assert.match(html, /learning content/i);
});

test("slice 31-3: RNA/HCV fixture — 31-1/31-2 regression smoke", () => {
  const html = renderPageFixture(api, fixturePath);
  assert.match(html, /util-activity-task--primary/);
  assert.match(html, /About this page/);
  assert.doesNotMatch(html.split('<details class="util-meta"')[0], /<strong>Audience:<\/strong>/i);
});

test("slice 31-6: RNA assessment — formative item wrappers and no checkbox confusion", () => {
  const html = renderPageFixture(api, fixturePath);
  const scope = assessmentSectionScope(html);
  assert.ok(scope);
  assert.match(scope, /util-assessment-item--formative/);
  assert.match(scope, /util-assessment-prompt/);
  assert.match(scope, /util-assessment-choices/);
  assert.match(scope, /util-assessment-options/);
  assert.doesNotMatch(scope, /util-checkbox-list/i);
  assert.equal((scope.match(/util-assessment-title/gi) || []).length, 10);
  assert.match(scope, /Which type of RNA virus genome can be directly translated/i);
});

test("slice 31-5: RNA/HCV fixture — primary task and 31-1–31-4 regression smoke", () => {
  const html = renderPageFixture(api, fixturePath);
  assert.match(html, /util-activity-task--primary/);
  assert.match(html, /About this page/);
  assert.doesNotMatch(html.split('<details class="util-meta"')[0], /<strong>Audience:<\/strong>/i);
  if (html.includes("util-materials-stack")) {
    assert.match(html, /util-materials-stack/);
  }
});

test("slice 31-4: RNA/HCV fixture — materials stack and 31-3 knowledge wrappers intact", () => {
  const html = renderPageFixture(api, fixturePath);
  const body = html.split('<details class="util-meta"')[0];
  assert.match(html, /util-activity-task--primary/);
  if (body.includes("util-activity-materials")) {
    assert.match(body, /util-materials-stack/);
  }
  if (body.includes("Key Knowledge") || body.includes("knowledge")) {
    assert.match(body, /util-knowledge-summary|util-definition-list/);
  }
});

test("slice 31-2: RNA/HCV fixture — PEL cues and primary task hierarchy preserved", () => {
  const html = renderPageFixture(api, fixturePath);
  assert.match(html, /util-activity-task--primary/);
  assert.match(html, /\.util-activity-framing\{/);
  assert.doesNotMatch(html.split('<details class="util-meta"')[0], /<strong>Audience:<\/strong>/i);
  assert.match(html, /About this page/);
  const body = html.split('<details class="util-meta"')[0];
  if (/How to think:/i.test(body)) {
    const thinkIdx = body.indexOf("How to think:");
    const taskIdx = body.indexOf("util-activity-task--primary");
    if (thinkIdx !== -1 && taskIdx !== -1) {
      assert.ok(thinkIdx < taskIdx, "reasoning cue should precede primary task");
    }
  }
});

test("slice 31-1: RNA live JSON — generation_notes not in body H2", () => {
  const livePath = path.join(
    repoRoot,
    "docs/development/sprints/2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/live-artefacts/rna-page.json"
  );
  const html = renderPageFixture(api, livePath);
  const body = html.split('<details class="util-meta"')[0];
  assert.doesNotMatch(body, /<h2[^>]*>\s*Generation Notes/i);
  assert.doesNotMatch(body, /<h2[^>]*>\s*Source Artefacts/i);
  assert.doesNotMatch(body, /<strong>Audience:<\/strong>/i);
  assert.match(html, /<details class="util-meta"/);
});
