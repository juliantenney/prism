/**
 * Utilities UI export pipeline — same path as handleUtilitiesGenerate preview/download.
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

const CATALOG_PAGE_SECTION_ORDER = [
  "overview",
  "learning_purpose",
  "knowledge_summary",
  "learning_activities",
  "learning_sequence",
  "activity_materials",
  "assessment_check",
  "support_notes",
  "study_tips"
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

function loadPrismTestApi(options) {
  const opts = options && typeof options === "object" ? options : {};
  const source = fs.readFileSync(appJsPath, "utf8");
  const sandbox = {
    console,
    setTimeout,
    clearTimeout,
    Promise,
    _: { debounce: (fn) => fn }
  };

  if (opts.withWorkflowGenerationContext) {
    const manifestJson = JSON.parse(fs.readFileSync(manifestFsPath, "utf8"));
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
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(manifestJson)
        });
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
    },
    WorkflowGenerationContext: sandbox.WorkflowGenerationContext
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

function countMaterialTables(html) {
  return (String(html || "").match(/util-table-scroll util-material-table/g) || []).length;
}

const api = loadPrismTestApi();

test("runUtilityPageExportPipelineForTest: nested comparison_table.content array emits semantic table", () => {
  const page = {
    artifact_type: "page",
    title: "Nested table payload",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A2",
            title: "Index table",
            materials: {
              comparison_table: {
                content: ["Year,Index", "2022,100", "2023,105"]
              }
            }
          }
        ]
      }
    ]
  };
  const r = api.runUtilityPageExportPipelineForTest(page, {
    sectionOrder: CATALOG_PAGE_SECTION_ORDER,
    applyCompositionValidation: true
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.ok(countMaterialTables(html) >= 1, "expected util-material-table wrapper in export HTML");
  assert.doesNotMatch(html, /<li>Year,Index<\/li>/i);
  assert.match(html, /<table[\s\S]*<th[^>]*>[\s\S]*Year[\s\S]*<\/th>/i);
});

test("runUtilityPageExportPipelineForTest: inflation CSV fixture via catalog sectionOrder", () => {
  const page = JSON.parse(fs.readFileSync(csvFixturePath, "utf8"));
  const r = api.runUtilityPageExportPipelineForTest(page, {
    sectionOrder: CATALOG_PAGE_SECTION_ORDER,
    applyCompositionValidation: true
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.ok(countMaterialTables(html) >= 2, "expected material tables for A2 and A3");
  assert.doesNotMatch(html, /<li>Year,Index<\/li>/i);
  assert.doesNotMatch(html, /<li>Aspect,Demand-pull,Cost-push,Built-in<\/li>/i);
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /util-activity-materials/);
});

test("renderUtilitiesArtefactHtmlAsyncForTest: mirrors handleUtilitiesGenerate catalog plan path", async () => {
  const apiUi = loadPrismTestApi({ withWorkflowGenerationContext: true });
  const page = JSON.parse(fs.readFileSync(csvFixturePath, "utf8"));
  const r = await apiUi.renderUtilitiesArtefactHtmlAsyncForTest(page, {
    selectedFormat: "html",
    presentationMode: "single_page",
    applyCompositionValidation: true
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.ok(countMaterialTables(html) >= 2, "expected material tables via async UI export path");
  assert.doesNotMatch(html, /<li>Year,Index<\/li>/i);
  assert.doesNotMatch(html, /<li>Aspect,Demand-pull,Cost-push,Built-in<\/li>/i);
  assert.match(html, /<table[\s\S]*<th[^>]*>[\s\S]*Year[\s\S]*<\/th>/i);
});

test("renderUtilitiesArtefactHtmlAsyncForTest: top-level activity_materials merges into learning activities", async () => {
  const apiUi = loadPrismTestApi({ withWorkflowGenerationContext: true });
  const page = {
    artifact_type: "page",
    title: "Top-level materials split",
    page_profile: "learner",
    learning_activities: [
      {
        activity_id: "A2",
        title: "Measuring Inflation: Indicator Comparison",
        materials: {}
      }
    ],
    activity_materials: [
      {
        activity_id: "A2",
        material_type: "comparison_table",
        content: ["Year,Index", "2022,100", "2023,105"]
      }
    ]
  };
  const r = await apiUi.renderUtilitiesArtefactHtmlAsyncForTest(page, {
    selectedFormat: "html",
    applyCompositionValidation: false
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.ok(countMaterialTables(html) >= 1);
  assert.doesNotMatch(html, /<li>Year,Index<\/li>/i);
  assert.match(html, /Worksheet[\s\S]*<table/i);
});

test("buildUtilityStructuredHtmlForTest delegates to runUtilityPageExportPipelineForTest", () => {
  const page = JSON.parse(fs.readFileSync(csvFixturePath, "utf8"));
  const direct = api.runUtilityPageExportPipelineForTest(page, { sectionOrder: ["sections"] });
  const viaWrapper = api.buildUtilityStructuredHtmlForTest(page, ["sections"]);
  assert.ok(direct && !direct.error);
  assert.ok(viaWrapper && !viaWrapper.error);
  assert.equal(
    countMaterialTables(direct.html),
    countMaterialTables(viaWrapper.html),
    "wrapper should use the same export pipeline"
  );
});
