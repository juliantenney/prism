/**
 * Sprint 49-6b — GAM material bodies must survive into composed page JSON and render.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repoRoot = path.resolve(__dirname, "..");
const marxDir = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-06-15-sprint-44",
  "benchmark-corpus",
  "marx"
);
const gamTextPath = path.join(marxDir, "activity-materials.txt");
const pagePath = path.join(marxDir, "page.json");

const {
  applyGamMaterialsToComposedPage,
  parseUpstreamActivityMaterialsCapture,
  findLearningActivitiesRows,
  measurePageGamFidelity,
  pageMaterialText
} = require(path.join(repoRoot, "lib", "page-gam-materials-preserve.js"));
const gamFmt = require(path.join(repoRoot, "lib", "gam-output-format.js"));

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
    setAttribute() {},
    removeAttribute() {},
    getAttribute: () => null,
    addEventListener: () => {},
    removeEventListener: () => {}
  };
}

function loadPrismTestApi() {
  const libs = [
    "lib/design-page-materials-fidelity.js",
    "lib/page-gam-materials-preserve.js",
    "lib/page-a3-materials-sequencing.js"
  ];
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
    body: { appendChild: () => {} }
  };
  const windowStub = {
    document: documentStub,
    addEventListener: () => {},
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
  libs.forEach((rel) => {
    vm.runInContext(fs.readFileSync(path.join(repoRoot, rel), "utf8"), sandbox, { filename: rel });
  });
  vm.runInContext(fs.readFileSync(path.join(repoRoot, "app.js"), "utf8"), sandbox, {
    filename: "app.js"
  });
  return sandbox.window.__PRISM_TEST_API;
}

function gamUpstream() {
  const gamText = fs.readFileSync(gamTextPath, "utf8");
  const parsed = gamFmt.parseGamMaterialsFromText(gamText);
  return parseUpstreamActivityMaterialsCapture(parsed, null);
}

function materialLen(materials, key) {
  const val = materials && materials[key];
  return typeof val === "string" ? val.length : 0;
}

test("49-6b: GAM merge restores thinned Marx table and exposition bodies", () => {
  const upstream = gamUpstream();
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, upstream);
  const rows = findLearningActivitiesRows(merged);

  const gamA2 = upstream.find((a) => a.activity_id === "A2");
  const gamA3 = upstream.find((a) => a.activity_id === "A3");
  const gamA4 = upstream.find((a) => a.activity_id === "A4");
  const gamA2Table = gamA2.materials.find((m) => String(m.type || "").replace(/\\_/g, "_") === "analysis_table");
  const gamA3Table = gamA3.materials.find((m) => String(m.type || "").replace(/\\_/g, "_") === "comparison_table");
  const gamA4Table = gamA4.materials.find((m) => String(m.type || "").replace(/\\_/g, "_") === "decision_table");
  assert.ok(gamA2Table && gamA3Table && gamA4Table, "expected GAM table materials");

  assert.ok(materialLen(rows[1].materials, "analysis_table") >= gamA2Table.content.length * 0.99);
  assert.ok(materialLen(rows[2].materials, "comparison_table") >= gamA3Table.content.length * 0.99);
  assert.ok(
    pageMaterialText(rows[3].materials, "guided_judgement_table").length >=
      gamA4Table.content.length * 0.99
  );
  assert.ok(materialLen(rows[0].materials, "text") >= 1200, "SP-01 text body preserved");
});

test("49-6b: applyPedagogicCognitionSemanticsToComposedPage merges when upstreamActivityMaterials passed", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const upstream = gamUpstream();
  const next = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamActivityMaterials: upstream
  });
  assert.equal(next.metadata?.gam_materials_preserve_applied, true);
  const metrics = measurePageGamFidelity(next, { gamSource: { activities: upstream } });
  assert.ok(metrics.length >= 4);
  const compressed = metrics.filter(
    (m) =>
      m.gamLen > 0 &&
      (/compression|shell|synopsis/i.test(m.lossType || "") ||
        m.pageLen < m.gamLen * 0.99)
  );
  assert.equal(compressed.length, 0, JSON.stringify(compressed, null, 2));
});

test("49-6b: rendered page includes full GAM checklist and transfer bodies after merge", () => {
  const api = loadPrismTestApi();
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const upstream = gamUpstream();
  const merged = api.applyPedagogicCognitionSemanticsToComposedPage(page, {
    upstreamActivityMaterials: upstream
  });
  const html = api.runUtilityPageExportPipelineForTest(merged, {
    applyCompositionValidation: false
  }).html;
  assert.match(html, /util-checkbox-list/);
  assert.match(html, /surplus value/i);
  assert.doesNotMatch(html, /Transfer task in activity materials[\s\S]{0,200}ride-sharing, food delivery/i);
  const a4Transfer = pageMaterialText(findLearningActivitiesRows(merged)[3].materials, "transfer_prompt");
  assert.ok(a4Transfer.length > 500, "transfer prompt body substantial");
  const transferSnippet = a4Transfer
    .replace(/^#+\s*/gm, "")
    .slice(0, 40)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(html, new RegExp(transferSnippet));
});
