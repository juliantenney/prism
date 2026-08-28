"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const vnext = require("../lib/learner-renderer-vnext");
const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");
const renderMaterial = require("../lib/learner-renderer-vnext/render-material").renderMaterial;
const beatRegistry = require("../lib/beat-material-registry");
const classifyActivityBeats =
  require("../lib/learner-renderer-vnext/compose-moment-classification").classifyActivityBeats;
const buildBeatModels = require("../lib/learner-renderer-vnext/build-beat-model").buildBeatModels;
const buildCanonicalVariant =
  require("../lib/learner-renderer-vnext/archetype-canonical-binding")
    .buildCanonicalFunctionEnumVariant;
const {
  buildGamRendererTypeInventoryIsolated
} = require("./gam-renderer-inventory-test-helper.js");

const repoRoot = path.resolve(__dirname, "..");
const KITCHEN_SINK_PATH = path.join(
  repoRoot,
  "tests/fixtures/page-render/renderer-kitchen-sink-page.json"
);

const PHASE7_ALIASES = Object.freeze(["strategy_options", "strategy", "strategies"]);

function pageWithMaterial(material) {
  return {
    schema_version: "2.0.0",
    title: "Phase7 strategy page",
    page_profile: "learner",
    activities: [
      {
        activity_id: "A1",
        title: "Strategy activity",
        learner_task: "Review each strategy option and note trade-offs.",
        expected_output: "Brief notes on two options.",
        episode_plan: {
          archetype: "evaluate",
          beats: [
            { function: "perspective_construction" },
            { function: "criteria_exposition" },
            { function: "worked_judgement" },
            { function: "guided_reasoning" },
            { function: "evaluative_judgement" },
            { function: "verification" }
          ]
        },
        materials: [material]
      }
    ]
  };
}

function fixtureStrategyOptions() {
  const page = JSON.parse(fs.readFileSync(KITCHEN_SINK_PATH, "utf8"));
  const la = page.sections.find(function (section) {
    return String(section.section_id || "").toLowerCase() === "learning_activities";
  });
  const row = (la && la.content || []).find(function (entry) {
    return String(entry.activity_id || "") === "KS-A1";
  });
  assert.ok(row && Array.isArray(row.materials.strategy_options));
  return row.materials.strategy_options.slice();
}

test("phase7 contract: strategy family aliases canonicalize to task_card and preserve authored type", () => {
  PHASE7_ALIASES.forEach(function (type) {
    const source = {
      material_id: "A1-M1",
      material_type: type,
      title: "Strategy menu",
      content: [
        { label: "Option A", description: "Front-load concepts" },
        { label: "Option B", description: "Problem-first inquiry" }
      ]
    };
    const model = parseMaterial.buildMaterialModel(source, 0);
    assert.equal(model.type, "task_card");
    assert.equal(model.taskCards.length, 2);
    assert.equal(model.taskCards[0].title, "Option A");
    assert.equal(model.taskCards[1].title, "Option B");
    if (type === "task_card") assert.equal(model.authoredType, undefined);
    else assert.equal(model.authoredType, type);
  });
});

test("phase7 contract: strategy family removed from beat registry (shared task_card registration)", () => {
  ["strategy", "strategy_options"].forEach(function (type) {
    assert.equal(
      beatRegistry.MATERIAL_BEAT_REGISTRY.some(function (row) {
        return beatRegistry.normalizeMaterialType(row.materialType) === type;
      }),
      false
    );
  });
  assert.ok(
    beatRegistry.MATERIAL_BEAT_REGISTRY.some(function (row) {
      return beatRegistry.normalizeMaterialType(row.materialType) === "task_card";
    })
  );
});

test("phase7 fixture-backed: kitchen-sink strategy_options preserve labels, order, and descriptions", () => {
  const options = fixtureStrategyOptions();
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "KS-STRAT",
      material_type: "strategy_options",
      title: "Strategy options",
      content: options
    },
    0
  );
  assert.equal(model.type, "task_card");
  assert.equal(model.authoredType, "strategy_options");
  assert.equal(model.taskCards.length, 2);
  assert.equal(model.taskCards[0].title, "Option A");
  assert.match(model.taskCards[0].body, /Front-load concepts/);
  assert.equal(model.taskCards[1].title, "Option B");
  assert.match(model.taskCards[1].body, /Problem-first inquiry/);
});

test("phase7 rendering: shared task_card renderer preserves options with HTML escaping", () => {
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M1",
      material_type: "strategy_options",
      title: "Escaping strategies",
      content: [
        { label: "Option <A>", description: "Use <tag> & ampersand." },
        { option: "Option B", rationale: "Second option > first." }
      ]
    },
    0
  );
  const html = renderMaterial(model);
  assert.match(html, /util-material-task-cards/);
  assert.match(html, /Option &lt;A&gt;/);
  assert.match(html, /&amp; ampersand/);
  assert.match(html, /Option B/);
  assert.match(html, /Second option &gt; first/);
  assert.doesNotMatch(html, /Unsupported material kind/);
  assert.doesNotMatch(html, /data-workspace-kind/);
});

test("phase7 behaviour: strategy options are static exposition without selection workspace", () => {
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M1",
      material_type: "strategy",
      content: [{ label: "Strategy A", description: "Reference only." }]
    },
    0
  );
  const html = renderMaterial(model);
  assert.doesNotMatch(html, /type="radio"/i);
  assert.doesNotMatch(html, /checklist_entry/i);
  assert.doesNotMatch(html, /text_entry/i);
  assert.match(html, /util-task-card-list/);
});

test("phase7 validation: vNext accepts fixture-shaped strategy_options payloads", () => {
  const options = fixtureStrategyOptions();
  const result = vnext.buildPageModel(
    pageWithMaterial({
      material_id: "A1-M1",
      material_type: "strategy_options",
      title: "Strategy options",
      body_format: "markdown",
      content: options
    })
  );
  assert.equal(result.ok, true, JSON.stringify(result.errors || []));
});

test("phase7 validation: malformed strategy payload rejects with INVALID_MATERIAL_PAYLOAD", () => {
  const result = vnext.buildPageModel(
    pageWithMaterial({
      material_id: "A1-M1",
      material_type: "strategy_options",
      title: "Broken strategies",
      body_format: "markdown",
      content: [{ label: "Missing body only" }]
    })
  );
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "INVALID_MATERIAL_PAYLOAD";
    })
  );
});

test("phase7 validation: wrapper object with options array expands ordered strategies", () => {
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M1",
      material_type: "strategies",
      title: "Wrapped strategies",
      content: {
        options: [
          { label: "First", description: "One" },
          { label: "Second", description: "Two" }
        ]
      }
    },
    0
  );
  assert.equal(model.type, "task_card");
  assert.equal(model.authoredType, "strategies");
  assert.equal(model.taskCards.length, 2);
  assert.equal(model.taskCards[0].title, "First");
  assert.equal(model.taskCards[1].title, "Second");
});

test("phase7 moment policy: task_card strategy aliases classify as Do scaffolding material", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "strategy_options",
    title: "Strategy menu",
    content: [
      { label: "Option A", description: "Cut discretionary spending." },
      { label: "Option B", description: "Increase income." }
    ]
  });
  page.activities[0].episode_plan = { archetype: "apply", beats: [{ function: "guided_practice" }] };
  page.activities[0].learner_task = "";
  page.activities[0].expected_output = "";
  const validated = vnext.validateInput(page);
  assert.equal(validated.errors.length, 0);
  const variant = buildCanonicalVariant("apply", ["guided_practice"]);
  const beatResult = buildBeatModels(page.activities[0], variant);
  assert.equal(beatResult.errors.length, 0);
  const material = beatResult.beats[0].materials[0];
  assert.equal(material.type, "task_card");
  assert.equal(material.authoredType, "strategy_options");
  const moments = classifyActivityBeats({ beats: beatResult.beats });
  assert.ok(moments.doBeats.length >= 1);
});

test("phase7 compatibility: legacy materials map keeps strategy_options as field key", () => {
  const options = fixtureStrategyOptions();
  const page = JSON.parse(fs.readFileSync(KITCHEN_SINK_PATH, "utf8"));
  const la = page.sections.find(function (section) {
    return String(section.section_id || "").toLowerCase() === "learning_activities";
  });
  const row = (la && la.content || []).find(function (entry) {
    return String(entry.activity_id || "") === "KS-A1";
  });
  assert.deepEqual(row.materials.strategy_options, options);
  assert.equal(Object.prototype.hasOwnProperty.call(row.materials, "strategy"), false);
});

test("phase7 inventory: strategy family removed from unsupported list", () => {
  const built = buildGamRendererTypeInventoryIsolated(repoRoot);
  const inventory = built.inventory;
  const unsupported = built.unsupported;

  ["strategy", "strategy_options"].forEach(function (type) {
    assert.equal(
      inventory.material_types.some(function (entry) {
        return entry.type === type;
      }),
      false,
      "renderable inventory must exclude alias-resolved " + type
    );
    assert.equal(
      unsupported.unsupported.some(function (entry) {
        return entry.type === type;
      }),
      false,
      "unsupported list must exclude " + type
    );
  });
});

test("phase7 regression: canonical task_card renderer unchanged for native task_cards alias", () => {
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-M1",
      material_type: "task_cards",
      title: "Native cards",
      content: [{ title: "Card 1", instruction: "Do step one." }]
    },
    0
  );
  assert.equal(model.type, "task_card");
  assert.equal(model.authoredType, "task_cards");
  const html = renderMaterial(model);
  assert.match(html, /util-material-task-cards/);
  assert.match(html, /Card 1/);
});
