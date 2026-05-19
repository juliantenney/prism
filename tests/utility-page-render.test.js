const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const fixturesDir = path.join(__dirname, "fixtures", "page-render");

const PAGE_METADATA_ORDER = [
  "sections",
  "source_artefacts",
  "constraints_applied",
  "generation_notes"
];

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

function mainBodyHtml(html) {
  return html.split('<details class="util-meta"')[0];
}

function sectionScope(html, headingText) {
  const re = new RegExp(
    headingText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?(?=<h2|<details class=\"util-meta\"|$)",
    "i"
  );
  const m = html.match(re);
  return m ? m[0] : html;
}

/** Shared HTML shape semantics (domain-agnostic). */
function assertNoParagraphListNesting(html) {
  const chunks = String(html || "").split(/<\/p>/i);
  for (const chunk of chunks) {
    if (!/<p\b/i.test(chunk)) continue;
    const insideP = chunk.replace(/^[\s\S]*?<p[^>]*>/i, "");
    assert.equal(
      /<ul\b/i.test(insideP),
      false,
      "expected no <ul> inside an open <p> (before </p>)"
    );
  }
  assert.equal(
    /<ul\b[\s\S]*?<\/ul>\s*<\/p>/i.test(html),
    false,
    "expected no </ul> immediately before </p>"
  );
}

function assertNoOrphanListItems(html) {
  let stripped = String(html || "");
  stripped = stripped.replace(/<ul class="util-checkbox-list"[^>]*>[\s\S]*?<\/ul>/gi, "");
  stripped = stripped.replace(/<ul[^>]*>[\s\S]*?<\/ul>/gi, "");
  stripped = stripped.replace(/<ol[^>]*>[\s\S]*?<\/ol>/gi, "");
  assert.equal(/<li\b/i.test(stripped), false, "expected no orphan <li> outside lists");
}

function assertAdjacentCompatibleUlMerged(html) {
  const plainOnly = String(html || "").replace(
    /<ul\b[^>]*\butil-checkbox-list\b[^>]*>[\s\S]*?<\/ul>/gi,
    ""
  );
  assert.equal(
    /<\/ul>\s*<ul\b/i.test(plainOnly),
    false,
    "expected adjacent plain <ul> blocks merged (checkbox boundaries may remain)"
  );
}

function assertCheckboxListsPreserved(html) {
  const blocks = html.match(/<ul class="util-checkbox-list"[^>]*>[\s\S]*?<\/ul>/gi) || [];
  for (const block of blocks) {
    assert.match(block, /util-checkbox/);
    assert.equal(/<p>\s*<ul/i.test(block), false, "checkbox list must not be inside <p>");
    assert.equal(/<ul\b/i.test(block.replace(/^<ul[^>]*>/i, "")), false, "no nested <ul> in checkbox list");
  }
}

function assertTablesPreserved(html) {
  const tables = html.match(/<table>[\s\S]*?<\/table>/gi) || [];
  assert.ok(tables.length > 0, "expected at least one <table>");
  for (const table of tables) {
    assert.doesNotMatch(table, /<ul\b/i, "table block must not contain list markup");
    assert.match(table, /<t[hd]>/i);
  }
}

function assertMcqOptionsNotCheckboxLists(html) {
  const scope =
    html.match(/Select the best response[\s\S]{0,2500}/i)?.[0] ||
    html.match(/Question 1[\s\S]{0,2500}/i)?.[0] ||
    "";
  assert.ok(scope, "expected MCQ stem in output");
  assert.match(scope, /Option alpha/);
  assert.match(scope, /Option beta/);
  assert.doesNotMatch(
    scope,
    /util-checkbox-list[\s\S]*Option alpha/i,
    "MCQ letter options must not be rendered as util-checkbox-list"
  );
}

function assertStandardListSemantics(html, scope, expectedLiCount) {
  const block = scope || html;
  assert.match(block, /<ul>/);
  const liCount = (block.match(/<li>/g) || []).length;
  if (typeof expectedLiCount === "number") {
    assert.equal(liCount, expectedLiCount, `expected ${expectedLiCount} <li> in scope`);
  }
  assertNoParagraphListNesting(block);
  assertNoOrphanListItems(block);
  assertAdjacentCompatibleUlMerged(block);
}

function assertProductionMetadataFold(html) {
  assert.match(html, /(?:Production Metadata|Document information)/);
  const body = mainBodyHtml(html);
  const meta = html.match(/<details class="util-meta"[\s\S]*$/i);
  assert.ok(meta, "expected util-meta details");
  assertNoParagraphListNesting(html);
  assertNoOrphanListItems(html);
  return { body, meta: meta[0] };
}

function assertSanitizedPageSemantics(html, opts) {
  opts = opts || {};
  assertNoParagraphListNesting(html);
  assertNoOrphanListItems(html);
  assertAdjacentCompatibleUlMerged(html);
  if (opts.expectCheckbox) assertCheckboxListsPreserved(html);
  if (opts.expectTable) assertTablesPreserved(html);
  if (opts.expectMcq) assertMcqOptionsNotCheckboxLists(html);
}

// --- Content shapes (fixtures named by shape, not domain) ---

test("page shape: string bullet block → ul/li semantics", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-string-bullet-block.json");
  const scope = sectionScope(html, "Section A");
  assertStandardListSemantics(html, scope, 3);
  assert.match(scope, /First line in a multiline bullet block/);
  assertSanitizedPageSemantics(html);
});

test("page shape: inline bullet run → ul/li semantics", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-inline-bullet-run.json");
  assertStandardListSemantics(html, sectionScope(html, "Section A"), 3);
  assert.match(html, /alpha/);
  assertSanitizedPageSemantics(html);
});

test("page shape: primitive string array → ul/li semantics", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-primitive-string-array.json");
  assertStandardListSemantics(html, sectionScope(html, "Section A"), 3);
  assert.match(html, /Array element one/);
  assertSanitizedPageSemantics(html);
});

test("page shape: prose + bullets + prose → p, ul, p without list nesting", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-prose-bullets-prose.json");
  const scope = sectionScope(html, "Section A");
  assert.match(scope, /Opening prose paragraph/);
  assert.match(scope, /<ul>/);
  assert.match(scope, /Closing prose paragraph/);
  assert.equal(/<p>[\s\S]*<ul>[\s\S]*<\/p>[\s\S]*Closing/i.test(scope), false);
  assertSanitizedPageSemantics(html);
});

test("page shape: checkbox list → util-checkbox-list preserved", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-checkbox-list.json");
  assert.match(html, /util-checkbox-list/);
  assert.match(html, /☐/);
  assertCheckboxListsPreserved(html);
  assertSanitizedPageSemantics(html, { expectCheckbox: true });
});

test("page shape: markdown table → table preserved without list markup", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-markdown-table.json");
  assertTablesPreserved(html);
  assertSanitizedPageSemantics(html, { expectTable: true });
  assert.match(html, /cell x/);
});

test("page shape: production metadata → util-meta fold only", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-production-metadata.json", PAGE_METADATA_ORDER);
  const { body, meta } = assertProductionMetadataFold(html);
  assert.equal(body.includes("Upstream Alpha"), false);
  assert.match(meta, /Upstream Alpha/);
  assert.match(meta, /limitations/i);
});

test("page shape: body bullets with metadata keys → metadata outside main body", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-metadata-with-body.json");
  const { body } = assertProductionMetadataFold(html);
  const scope = sectionScope(body, "Section A");
  assertStandardListSemantics(body, scope, 3);
  assert.equal(body.includes("Upstream Alpha"), false);
  assert.match(html, /Upstream Alpha/);
});

test("page shape: structured assessment MCQ → options not checkbox lists", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-structured-assessment-mcq.json");
  assert.match(html, /Select the best response/);
  assertMcqOptionsNotCheckboxLists(html);
  assertSanitizedPageSemantics(html, { expectMcq: true });
});

test("page shape: plain bullets then checkbox list → separate list kinds preserved", () => {
  const { api } = loadPrismTestApi();
  const html = renderPageFixture(api, "shape-bullets-then-checkbox.json");
  const scope = sectionScope(html, "Section A");
  assert.match(scope, /Plain bullet one/);
  assert.match(scope, /Checkbox task one/);
  assert.match(html, /util-checkbox-list/);
  const plainUlOpens = scope.match(/<ul(?![^>]*util-checkbox-list)[^>]*>/gi) || [];
  assert.ok(plainUlOpens.length >= 1, "expected at least one plain <ul>");
  assertCheckboxListsPreserved(html);
  assertAdjacentCompatibleUlMerged(html);
  assertNoOrphanListItems(html);
});
