"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const vnext = require("../lib/learner-renderer-vnext");
const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");
const beatRegistry = require("../lib/beat-material-registry");
const {
  buildGamRendererTypeInventoryIsolated
} = require("./gam-renderer-inventory-test-helper.js");

const repoRoot = path.resolve(__dirname, "..");
const PHASE3_TYPES = Object.freeze([
  "criteria_exposition",
  "discussion",
  "guidance",
  "instructions",
  "what_to_do"
]);

function pageWithMaterialType(materialType) {
  return {
    schema_version: "2.0.0",
    title: "Phase3 boundary page",
    page_profile: "learner",
    activities: [
      {
        activity_id: "A1",
        title: "Boundary activity",
        learner_task: "Do the activity.",
        expected_output: "A short response.",
        episode_plan: { archetype: "apply", beats: [{ function: "guided_practice" }] },
        materials: [
          {
            material_id: "A1-M1",
            material_type: materialType,
            title: materialType + " probe",
            body_format: "markdown",
            body: "Body"
          }
        ]
      }
    ]
  };
}

test("phase3 contract: five types are non-renderable and absent from beat material registry", () => {
  PHASE3_TYPES.forEach(function (type) {
    assert.equal(parseMaterial.hasMaterialRenderer(type), false);
    assert.ok(parseMaterial.NON_RENDERABLE_MATERIAL_TYPES[type]);
    assert.equal(
      beatRegistry.MATERIAL_BEAT_REGISTRY.some(function (row) {
        return beatRegistry.normalizeMaterialType(row.materialType) === type;
      }),
      false
    );
  });
});

test("phase3 validation: five types reject as NON_RENDERABLE_MATERIAL_TYPE", () => {
  PHASE3_TYPES.forEach(function (type) {
    const result = vnext.buildPageModel(pageWithMaterialType(type));
    assert.equal(result.ok, false);
    assert.ok(
      result.errors.some(function (error) {
        return (
          error.code === "NON_RENDERABLE_MATERIAL_TYPE" &&
          error.authoredMaterialType === type
        );
      }),
      "Expected NON_RENDERABLE_MATERIAL_TYPE for " + type
    );
  });
});

test("phase3 compatibility: structural usage in fixtures remains valid", () => {
  // fixture has discussion prompts as a structural materials field, not material_type
  const fixturePath = path.join(
    repoRoot,
    "tests/fixtures/page-render/ld-climate-misconception-discussion-page.json"
  );
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const activity = page.sections[1].content[0];
  assert.ok(activity);
  assert.ok(activity.materials);
  assert.ok(Array.isArray(activity.materials.discussion_prompts));
  // Ensure no material_type leakage for this phase-3 set
  Object.keys(activity.materials || {}).forEach(function (key) {
    assert.equal(PHASE3_TYPES.includes(String(key || "").toLowerCase()), false);
  });
});

test("phase3 inventory: five types are excluded from renderable material inventory", () => {
  const built = buildGamRendererTypeInventoryIsolated(repoRoot);
  const inventory = built.inventory;
  const unsupported = built.unsupported;

  PHASE3_TYPES.forEach(function (type) {
    assert.equal(
      inventory.material_types.some(function (entry) {
        return entry.type === type;
      }),
      false
    );
    assert.equal(
      unsupported.unsupported.some(function (entry) {
        return entry.type === type;
      }),
      false
    );
  });
});
