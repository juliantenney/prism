/**
 * Live Utilities export path — worksheet CSV payloads that previously hit csv-fallback.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const appJsPath = path.join(repoRoot, "app.js");
const wgcPath = path.join(repoRoot, "workflowGenerationContext.js");
const manifestFsPath = path.join(repoRoot, "domains", "domain-manifest.json");
const csvFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "ld-inflation-workshop-csv-worksheet-page.json"
);

const A2_ROWS = ["Year,Index", "2022,100", "2023,105"];
const A3_ROWS = [
  "Aspect,Demand-pull,Cost-push,Built-in",
  "Cause,,,",
  "Mechanism,,,",
  "Example,,,",
  "Difference,,,"
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

function loadPrismTestApi(withWgc) {
  const manifestJson = JSON.parse(fs.readFileSync(manifestFsPath, "utf8"));
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };
  if (withWgc) {
    function resolveRepoFileFromUrl(url) {
      const normalized = String(url || "").replace(/\\/g, "/");
      const marker = "domains/";
      const pos = normalized.indexOf(marker);
      if (pos === -1) return null;
      return path.join(repoRoot, normalized.slice(pos).replace(/\//g, path.sep));
    }
    sandbox.fetch = function fetchImpl(url) {
      const u = String(url || "");
      if (u.includes("domain-manifest.json")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(manifestJson) });
      }
      const disk = resolveRepoFileFromUrl(u);
      if (disk && fs.existsSync(disk)) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(fs.readFileSync(disk, "utf8"))
        });
      }
      return Promise.resolve({ ok: false, status: 404, text: () => Promise.resolve("") });
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(wgcPath, "utf8"), sandbox, {
      filename: "workflowGenerationContext.js"
    });
    sandbox.WorkflowGenerationContext = sandbox.window.WorkflowGenerationContext;
  }
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
    location: { hash: "", pathname: "/" },
    _: sandbox._,
    Utils: { debounce: (fn) => fn },
    localStorage: { getItem: () => null, setItem: () => {} },
    URL: { createObjectURL: () => "blob:test" },
    Blob: function Blob() {},
    Library: {
      importPromptsFromEntries: () => Promise.resolve({ added: 0, updated: 0, skipped: 0 }),
      getAllPrompts: () => Promise.resolve([])
    },
    WorkflowGenerationContext: sandbox.WorkflowGenerationContext
  };
  sandbox.document = documentStub;
  sandbox.window = windowStub;
  windowStub.window = windowStub;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(appJsPath, "utf8"), sandbox, { filename: "app.js" });
  return sandbox.window.__PRISM_TEST_API;
}

function pageWithComparisonTable(comparisonTable) {
  return {
    artifact_type: "page",
    title: "Live worksheet CSV shapes",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A2",
            title: "Measuring Inflation: Indicator Comparison",
            materials: { comparison_table: comparisonTable }
          },
          {
            activity_id: "A3",
            title: "Inflation types comparison",
            materials: {
              comparison_table: A3_ROWS
            }
          }
        ]
      }
    ]
  };
}

function findActivityTaskBlock(html, activityTitle) {
  const parts = String(html || "").split('<article class="util-task-block">');
  const block = parts.find(function (part) {
    return part.indexOf(activityTitle) !== -1;
  });
  assert.ok(block, "expected util-task-block containing " + activityTitle);
  return block;
}

function assertWorksheetCsvExport(html, activityTitle) {
  const block = findActivityTaskBlock(html, activityTitle);
  assert.match(block, /util-table-scroll util-material-table/);
  assert.match(block, /<table[\s\S]*<th/i);
  assert.doesNotMatch(block, /<li>Year,Index<\/li>/i);
  return block;
}

const api = loadPrismTestApi(false);

test("utilityMaterialValueToCsvRowTexts: nested array-of-arrays rows", () => {
  const rows = api.utilityMaterialValueToCsvRowTextsForTest([
    ["Year", "Index"],
    ["2022", "100"],
    ["2023", "105"]
  ]);
  assert.equal(rows.join("\n"), A2_ROWS.join("\n"));
  assert.ok(api.utilityTryRenderCsvLikeMaterialTableForTest(rows));
});

test("utilityMaterialValueToCsvRowTexts: object rows with cells arrays", () => {
  const rows = api.utilityMaterialValueToCsvRowTextsForTest([
    { cells: ["Year", "Index"] },
    { cells: ["2022", "100"] },
    { cells: ["2023", "105"] }
  ]);
  assert.equal(rows.join("\n"), A2_ROWS.join("\n"));
});

test("utilityMaterialValueToCsvRowTexts: indexed object map", () => {
  const rows = api.utilityMaterialValueToCsvRowTextsForTest({
    0: "Year,Index",
    1: "2022,100",
    2: "2023,105"
  });
  assert.equal(rows.join("\n"), A2_ROWS.join("\n"));
});

test("utilityMaterialValueToCsvRowTexts: html list string", () => {
  const html =
    "<ul><li>Year,Index</li><li>2022,100</li><li>2023,105</li></ul>";
  const rows = api.utilityMaterialValueToCsvRowTextsForTest(html);
  assert.equal(rows.join("\n"), A2_ROWS.join("\n"));
});

test("runUtilityPageExportPipelineForTest: { content: string[] } wrapper on comparison_table", () => {
  const page = pageWithComparisonTable({ content: A2_ROWS });
  const r = api.runUtilityPageExportPipelineForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assertWorksheetCsvExport(html, "Measuring Inflation");
});

test("runUtilityPageExportPipelineForTest: materials.content string array (live shape)", () => {
  const page = {
    artifact_type: "page",
    title: "Content array worksheet",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A2",
            title: "Measuring Inflation: Indicator Comparison",
            materials: {
              content: A2_ROWS
            }
          },
          {
            activity_id: "A3",
            title: "Inflation types comparison",
            materials: {
              content: A3_ROWS
            }
          }
        ]
      }
    ]
  };
  const r = api.runUtilityPageExportPipelineForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assertWorksheetCsvExport(html, "Measuring Inflation");
  assertWorksheetCsvExport(html, "Inflation types comparison");
});

test("runUtilityPageExportPipelineForTest: nested array-of-arrays via export", () => {
  const page = pageWithComparisonTable([
    ["Year", "Index"],
    ["2022", "100"],
    ["2023", "105"]
  ]);
  const r = api.runUtilityPageExportPipelineForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assertWorksheetCsvExport(html, "Measuring Inflation");
  assert.doesNotMatch(html, /<li>Year,Index<\/li>/i);
});

test("runUtilityPageExportPipelineForTest: object cells via export", () => {
  const page = pageWithComparisonTable([
    { cells: ["Year", "Index"] },
    { cells: ["2022", "100"] },
    { cells: ["2023", "105"] }
  ]);
  const r = api.runUtilityPageExportPipelineForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assertWorksheetCsvExport(html, "Measuring Inflation");
});

test("runUtilityPageExportPipelineForTest: A3 empty cells preserved", () => {
  const page = pageWithComparisonTable(A2_ROWS);
  const r = api.runUtilityPageExportPipelineForTest(page);
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  const a3 = assertWorksheetCsvExport(html, "Inflation types comparison");
  assert.doesNotMatch(a3, /<li>Aspect,Demand-pull,Cost-push,Built-in<\/li>/i);
  assert.match(a3, /util-worksheet-blank/);
  assert.match(a3, /<td[^>]*>[\s\S]*util-worksheet-blank/);
});

test("renderUtilitiesArtefactHtmlAsyncForTest: inflation CSV fixture (catalog UI path)", async () => {
  const apiUi = loadPrismTestApi(true);
  const page = JSON.parse(fs.readFileSync(csvFixturePath, "utf8"));
  const r = await apiUi.renderUtilitiesArtefactHtmlAsyncForTest(page, {
    selectedFormat: "html",
    applyCompositionValidation: false
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assertWorksheetCsvExport(html, "Measuring Inflation");
  assertWorksheetCsvExport(html, "Inflation types comparison");
  assert.doesNotMatch(html, /<li>Year,Index<\/li>/i);
  assert.doesNotMatch(html, /<li>Aspect,Demand-pull,Cost-push,Built-in<\/li>/i);
});
