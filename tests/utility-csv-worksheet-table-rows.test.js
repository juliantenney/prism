/**
 * CSV-like worksheet bullet lists → semantic tables (not comma-in-li prose lists).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("path");
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
    appendChild: () => {},
    removeChild: () => {},
    setAttribute: () => {},
    removeAttribute: () => {},
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
  assert.ok(api);
  return api;
}

const YEAR_INDEX_MD = [
  "- Year,Index",
  "- 2022,100",
  "- 2023,105"
].join("\n");

const ASPECT_TABLE_MD = [
  "- Aspect,Demand-pull,Cost-push,Built-in",
  "- Cause,,,",
  "- Mechanism,,,",
  "- Example,,,",
  "- Difference,,,"
].join("\n");

test("utilityRenderMarkdownBlock: Year/Index CSV bullets render as table", () => {
  const api = loadPrismTestApi();
  const html = api.utilityRenderMarkdownBlockForTest(YEAR_INDEX_MD);
  assert.match(html, /util-table-scroll util-material-table/);
  assert.match(html, /<table[\s\S]*<thead[\s\S]*<th[^>]*>[\s\S]*Year[\s\S]*<\/th>/);
  assert.match(html, /<td[^>]*>[\s\S]*2022[\s\S]*<\/td>/);
  assert.doesNotMatch(html, /<li>Year,Index<\/li>/i);
});

test("utilityRenderMarkdownBlock: Aspect comparison table preserves blank cells", () => {
  const api = loadPrismTestApi();
  const html = api.utilityRenderMarkdownBlockForTest(ASPECT_TABLE_MD);
  assert.match(html, /util-table-scroll util-material-table/);
  assert.match(html, /<th[^>]*>[\s\S]*Demand-pull[\s\S]*<\/th>/);
  assert.match(html, /util-worksheet-blank/);
  assert.doesNotMatch(html, /<li>Aspect,Demand-pull,Cost-push,Built-in<\/li>/i);
});

test("utilityRenderMarkdownBlock: prose bullets with commas stay ul", () => {
  const api = loadPrismTestApi();
  const md = [
    "- Inflation, unemployment, and growth are macro topics you should link in your answer.",
    "- Use the scenarios, not the answer key, when you discuss distributional effects."
  ].join("\n");
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<ul>/);
  assert.doesNotMatch(html, /util-material-table/);
});

test("utilityRenderMarkdownBlock: mixed CSV and prose bullets stay ul", () => {
  const api = loadPrismTestApi();
  const md = ["- Year,Index", "- Explain why the index matters for your household."].join("\n");
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<ul>/);
  assert.match(html, /<li>Year,Index<\/li>/i);
  assert.doesNotMatch(html, /util-material-table/);
});

test("utilityRenderMarkdownBlock: single comma-separated line stays ul", () => {
  const api = loadPrismTestApi();
  const html = api.utilityRenderMarkdownBlockForTest("- One row, only here");
  assert.match(html, /<ul>/);
  assert.doesNotMatch(html, /<table/);
});

test("utilityRenderMarkdownBlock: pipe markdown table regression", () => {
  const api = loadPrismTestApi();
  const md = ["| Year | Index |", "| --- | --- |", "| 2022 | 100 |"].join("\n");
  const html = api.utilityRenderMarkdownBlockForTest(md);
  assert.match(html, /<table/);
  assert.match(html, /<th[^>]*>[\s\S]*Year[\s\S]*<\/th>/);
  assert.doesNotMatch(html, /<ul>/);
});

test("utilityTryRenderCsvLikeMaterialTable: string array without bullet prefixes", () => {
  const api = loadPrismTestApi();
  const html = api.utilityTryRenderCsvLikeMaterialTableForTest([
    "Year,Index",
    "2022,100",
    "2023,105"
  ]);
  assert.ok(html);
  assert.match(html, /util-material-table/);
  assert.match(html, /util-table-scroll util-material-table/);
  assert.doesNotMatch(html, /<li>Year,Index<\/li>/i);
});

test("buildUtilityStructuredHtml: inline comparison_table array uses Worksheet table path", () => {
  const api = loadPrismTestApi();
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "page",
    title: "Inline comparison_table",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A2",
            title: "Index table",
            materials: {
              comparison_table: ["Year,Index", "2022,100", "2023,105"]
            }
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /Worksheet/);
  assert.doesNotMatch(html, /<li>Year,Index<\/li>/i);
  assert.match(html, /<table[\s\S]*<th[^>]*>[\s\S]*Year[\s\S]*<\/th>/);
});

test("buildUtilityStructuredHtml: analysis_table CSV bullets use table pathway", () => {
  const api = loadPrismTestApi();
  const r = api.buildUtilityStructuredHtmlForTest({
    artifact_type: "page",
    title: "CSV table worksheet",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A2",
            title: "Index data",
            learner_task: "Complete the table.",
            materials: {
              analysis_table: YEAR_INDEX_MD
            }
          },
          {
            activity_id: "A3",
            title: "Inflation types",
            learner_task: "Complete the comparison grid.",
            materials: {
              analysis_table: ASPECT_TABLE_MD
            }
          }
        ]
      }
    ]
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.doesNotMatch(html, /<li>Year,Index<\/li>/i);
  assert.doesNotMatch(html, /<li>Aspect,Demand-pull,Cost-push,Built-in<\/li>/i);
  assert.match(html, /util-table-scroll util-material-table/);
  assert.match(html, /<th[^>]*>[\s\S]*Year[\s\S]*<\/th>/);
  assert.match(html, /<th[^>]*>[\s\S]*Built-in[\s\S]*<\/th>/);
});
