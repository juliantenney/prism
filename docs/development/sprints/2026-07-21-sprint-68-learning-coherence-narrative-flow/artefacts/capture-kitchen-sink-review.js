"use strict";

/**
 * S68-IMP-012 — Kitchen-sink renderer review capture.
 */
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  runPrismLibScriptsInSandbox,
  PEDAGOGICAL_ICON_LIBS,
  wireBrowserGlobalThis,
  loadLearnerRendererVNextBrowserInSandbox
} = require("../../../../../tests/prism-vm-lib-bootstrap.js");

const repoRoot = path.resolve(__dirname, "..", "..", "..", "..", "..");
const outDir = __dirname;
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "learner-renderer-kitchen-sink-page.json"
);
const inventoryPath = path.join(outDir, "gam-renderer-type-inventory.json");

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

function loadProductionApi() {
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
  sandbox.document = documentStub;
  sandbox.window = {
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
  sandbox.window.window = sandbox.window;
  wireBrowserGlobalThis(sandbox);
  vm.createContext(sandbox);
  runPrismLibScriptsInSandbox(sandbox, repoRoot, PEDAGOGICAL_ICON_LIBS);
  loadLearnerRendererVNextBrowserInSandbox(sandbox, repoRoot);
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  return {
    api: sandbox.window.__PRISM_TEST_API,
    vnext: sandbox.window.PRISM_LEARNER_RENDERER_VNEXT
  };
}

function countMatches(source, re) {
  return (String(source).match(re) || []).length;
}

function bodyHtml(html) {
  const match = String(html || "").match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return match ? match[1] : String(html || "");
}

function collectIds(html) {
  return [...String(html || "").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
}

function duplicateIds(html) {
  const ids = collectIds(html);
  const seen = Object.create(null);
  const dups = [];
  ids.forEach(function (id) {
    if (seen[id]) dups.push(id);
    seen[id] = true;
  });
  return dups.sort();
}

function materialTypesInHtml(html) {
  return [...html.matchAll(/data-material-type="([^"]+)"/g)].map((m) => m[1]);
}

function structuralMetrics(html) {
  const body = bodyHtml(html);
  const materialTypes = materialTypesInHtml(body);
  const uniqueMaterialTypes = [...new Set(materialTypes)];
  return {
    page_bytes: html.length,
    activity_count: countMatches(body, /id="activity-KS0[1-5]"/g),
    composition_moments: countMatches(body, /data-composition-moment="/g),
    beat_sections: countMatches(body, /data-beat-function="/g),
    text_entry_workspaces: countMatches(body, /data-workspace-capability="text_entry"/g),
    table_entry_workspaces: countMatches(body, /data-workspace-kind="table_entry"/g),
    table_inputs: countMatches(body, /util-learner-table-workspace__input/g),
    textareas: countMatches(body, /util-learner-workspace__input/g),
    static_tables: countMatches(body, /util-material-table-block/g),
    prompts: countMatches(body, /data-source-field="/g),
    checklists: countMatches(body, /util-checklist-block/g),
    unsupported_fallbacks: countMatches(body, /data-render-status="unsupported"/g),
    duplicate_ids: duplicateIds(body),
    material_type_occurrences: materialTypes.length,
    unique_material_types_rendered: uniqueMaterialTypes.length,
    unique_material_types: uniqueMaterialTypes.sort()
  };
}

function main() {
  const { api, vnext } = loadProductionApi();
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, "utf8"));
  const rendered = vnext.renderLearnerPageHtml(fixture);
  if (!rendered || rendered.error) {
    throw new Error(String(rendered && rendered.error));
  }
  const exportHtml = api.composeStandaloneVnextLearnerExportForTest(
    rendered.html,
    rendered.modelResult,
    fixture
  );

  const exportPath = path.join(outDir, "learner-renderer-kitchen-sink-moments.html");
  const metricsPath = path.join(outDir, "learner-renderer-kitchen-sink-structural-metrics.json");
  const reviewPath = path.join(outDir, "learner-renderer-kitchen-sink-review.html");

  fs.writeFileSync(exportPath, exportHtml);
  const metrics = {
    captured_at: new Date().toISOString(),
    reviewer_task: "S68-IMP-012",
    fixture: "tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json",
    composition_mode: vnext.DEFAULT_COMPOSITION_MODE || "moments",
    inventory_summary: inventory.summary,
    render: structuralMetrics(exportHtml)
  };
  fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));

  const inventoryRows = (inventory.material_types || [])
    .filter(function (entry) {
      return entry.vnextSupported;
    })
    .map(function (entry) {
      return (
        "<tr><td>" +
        entry.type +
        "</td><td>" +
        (entry.kitchenSinkFixtureId || "—") +
        "</td><td>" +
        (entry.learnerSurfaceCapabilities || []).join(", ") +
        "</td><td>" +
        entry.interactionExpectation +
        "</td></tr>"
      );
    })
    .join("");

  const styleMatch = exportHtml.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = exportHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const reviewHtml =
    "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
    "<title>Sprint 68 kitchen-sink renderer review</title>" +
    "<style>body{margin:0;font-family:system-ui,sans-serif;background:#f8fafc;color:#0f172a}" +
    "header.dev-only{padding:1rem 1.25rem;background:#0f172a;color:#fff}" +
    "header.dev-only h1{margin:0 0 .35rem;font-size:1.1rem}" +
    ".dev-index{padding:1rem 1.25rem;background:#fff;border-bottom:1px solid #e2e8f0}" +
    ".dev-index table{border-collapse:collapse;width:100%;font-size:.85rem}" +
    ".dev-index th,.dev-index td{border:1px solid #e2e8f0;padding:.35rem .5rem;text-align:left}" +
    ".dev-frame{border:0;width:100%;min-height:120vh;display:block}" +
    (styleMatch ? styleMatch[1] : "") +
    "</style></head><body>" +
    "<header class=\"dev-only\"><h1>Sprint 68 — kitchen-sink renderer review</h1>" +
    "<p>Development wrapper only. Technical labels are not part of learner export.</p></header>" +
    "<section class=\"dev-index\"><h2>Type inventory (vNext supported)</h2>" +
    "<table><thead><tr><th>Type</th><th>Fixture ID</th><th>Surface capabilities</th><th>Interaction</th></tr></thead>" +
    "<tbody>" +
    inventoryRows +
    "</tbody></table>" +
    "<p>Rendered unique material types: " +
    metrics.render.unique_material_types_rendered +
    " · Beat sections: " +
    metrics.render.beat_sections +
    " · Unsupported fallbacks: " +
    metrics.render.unsupported_fallbacks +
    "</p></section>" +
    (bodyMatch ? bodyMatch[1] : exportHtml) +
    "</body></html>";

  fs.writeFileSync(reviewPath, reviewHtml);
  console.log(JSON.stringify(metrics, null, 2));
}

main();
