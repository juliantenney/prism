"use strict";

/**
 * S68-IMP-012 — GAM type audit and kitchen-sink fixture tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const artefactDir = path.join(
  repoRoot,
  "docs",
  "development",
  "sprints",
  "2026-07-21-sprint-68-learning-coherence-narrative-flow",
  "artefacts"
);
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "learner-renderer-kitchen-sink-page.json"
);
const rnaFixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "rna-hcv-assembled-vnext-materials-page.json"
);

const vnext = require("../lib/learner-renderer-vnext");
const { MATERIAL_RENDERER_TYPES } = require("../lib/learner-renderer-vnext/parse-material");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");
const { buildMaterialModel } = require("../lib/learner-renderer-vnext/parse-material");

const INVENTORY_PATH = path.join(artefactDir, "gam-renderer-type-inventory.json");
const SURFACE_MAP_PATH = path.join(artefactDir, "gam-type-to-surface-map.json");
const UNSUPPORTED_PATH = path.join(artefactDir, "gam-unsupported-learner-interactions.json");

function loadInventory() {
  return JSON.parse(fs.readFileSync(INVENTORY_PATH, "utf8"));
}

function loadKitchenSink() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function renderKitchenSink() {
  const rendered = vnext.renderLearnerPageHtml(loadKitchenSink());
  assert.equal(rendered.error, null, rendered.error || "render failed");
  return String(rendered.html || "");
}

function collectIds(html) {
  return [...String(html || "").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
}

test("audit integrity: inventory is generated and type names are unique", () => {
  execFileSync(process.execPath, [path.join(repoRoot, "scripts/build-gam-renderer-type-inventory.js")], {
    cwd: repoRoot,
    stdio: "pipe"
  });
  const inventory = loadInventory();
  const types = inventory.material_types.map(function (entry) {
    return entry.type;
  });
  assert.equal(types.length, new Set(types).size, "canonical material type names must be unique");
  assert.ok(inventory.summary.canonical_material_types >= 50);
  assert.equal(inventory.summary.vnext_supported_material_types, MATERIAL_RENDERER_TYPES.length);
  assert.ok(fs.existsSync(SURFACE_MAP_PATH));
  assert.ok(fs.existsSync(UNSUPPORTED_PATH));
});

test("audit integrity: every vNext type has evidence and fixture mapping", () => {
  const inventory = loadInventory();
  MATERIAL_RENDERER_TYPES.forEach(function (type) {
    const entry = inventory.material_types.find(function (row) {
      return row.type === type;
    });
    assert.ok(entry, "missing inventory entry for " + type);
    assert.equal(entry.vnextSupported, true);
    assert.ok(entry.sourceLocations.length >= 1);
    assert.ok(entry.kitchenSinkFixtureId, "kitchen sink mapping required for " + type);
  });
});

function materialTypesFromPage(page) {
  return (page.activities || []).flatMap(function (activity) {
    return (activity.materials || []).map(function (material) {
      return String(material.material_type).toLowerCase();
    });
  });
}

test("fixture coverage: supported material types have fixture evidence", () => {
  const kitchenTypes = materialTypesFromPage(loadKitchenSink());
  const rnaTypes = materialTypesFromPage(JSON.parse(fs.readFileSync(rnaFixturePath, "utf8")));
  const combined = new Set(kitchenTypes.concat(rnaTypes));
  MATERIAL_RENDERER_TYPES.forEach(function (type) {
    assert.ok(combined.has(type), "fixture evidence missing for " + type);
  });
  assert.equal(new Set(kitchenTypes).size, 13);
});

test("fixture coverage: validates through buildPageModel without errors", () => {
  const result = vnext.buildPageModel(loadKitchenSink());
  assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test("rendering: kitchen-sink renders composed moments without beat sections", () => {
  const html = renderKitchenSink();
  assert.match(html, /data-composition-mode="moments"/);
  assert.match(html, /data-composed-activity-count="5"/);
  assert.match(html, /data-beats-fallback-activity-count="0"/);
  assert.equal((html.match(/data-beat-function="/g) || []).length, 0);
  assert.ok((html.match(/data-composition-moment="/g) || []).length >= 15);
  assert.match(html, /data-activity-id="KS01" data-render-path="moments"/);
  assert.match(html, /data-activity-id="KS05" data-render-path="moments"/);
  materialTypesFromPage(loadKitchenSink()).forEach(function (type) {
    assert.match(html, new RegExp('data-material-type="' + type + '"'));
  });
});

test("rendering: table types route to table_entry workspaces in composed Do moments", () => {
  const html = renderKitchenSink();
  assert.match(html, /data-workspace-kind="table_entry"/);
  assert.match(html, /util-learner-table-workspace/);
});

test("rendering: unsupported registry types fall back via renderMaterial unit path", () => {
  const model = buildMaterialModel(
    {
      material_id: "UNSUPPORTED-1",
      material_type: "impact_table",
      title: "Impact table",
      body: "| A | B |\n| --- | --- |\n| 1 | |"
    },
    0
  );
  const output = renderMaterial(model);
  assert.match(output, /data-render-status="unsupported"/);
  assert.match(output, /impact_table/);
});

test("surface reuse: type-to-surface map lists table_entry and text_entry mappings", () => {
  const map = JSON.parse(fs.readFileSync(SURFACE_MAP_PATH, "utf8"));
  assert.deepEqual(map.table_entry, [
    "analysis_table",
    "decision_table",
    "comparison_table",
    "classification_table",
    "planning_table"
  ]);
  assert.ok(Array.isArray(map.text_entry));
  assert.ok(map.static.length >= MATERIAL_RENDERER_TYPES.length - 3);
});

test("accessibility: kitchen-sink page has unique id attributes", () => {
  const html = renderKitchenSink();
  const ids = collectIds(html);
  assert.equal(ids.length, new Set(ids).size);
});

test("regression: inventory maintenance rule detects new fixture types", () => {
  execFileSync(process.execPath, [path.join(repoRoot, "scripts/build-gam-renderer-type-inventory.js")], {
    cwd: repoRoot,
    stdio: "pipe"
  });
  const inventory = loadInventory();
  const observed = inventory.material_types.filter(function (entry) {
    return entry.observedInFixtures;
  });
  assert.ok(observed.length >= 15);
  const fixtureTypes = new Set(
    (loadKitchenSink().activities || []).flatMap(function (activity) {
      return (activity.materials || []).map(function (material) {
        return String(material.material_type).toLowerCase();
      });
    })
  );
  inventory.material_types
    .filter(function (entry) {
      return entry.vnextSupported;
    })
    .forEach(function (entry) {
      assert.ok(
        fixtureTypes.has(entry.type) || entry.observedInFixtures,
        "fixture evidence required for " + entry.type
      );
      assert.ok(entry.kitchenSinkFixtureId, "inventory must map " + entry.type);
    });
});
