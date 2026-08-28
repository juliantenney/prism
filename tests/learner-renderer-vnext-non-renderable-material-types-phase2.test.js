"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const vnext = require("../lib/learner-renderer-vnext");
const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");
const beatRegistry = require("../lib/beat-material-registry");
const normalizePageForRender =
  require("../lib/page-render-normalize").normalizePageForRender;
const {
  buildGamRendererTypeInventoryIsolated
} = require("./gam-renderer-inventory-test-helper.js");

const repoRoot = path.resolve(__dirname, "..");

const NON_RENDERABLE = Object.freeze([
  "expected_output",
  "materials",
  "metadata",
  "output",
  "production"
]);

function minimalPageWithMaterialType(materialType) {
  return {
    schema_version: "2.0.0",
    title: "Boundary page",
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

test("phase2 contract: non-renderable names are excluded from learner material registries", () => {
  NON_RENDERABLE.forEach(function (type) {
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

test("phase2 validation: material_type structural names are rejected clearly", () => {
  NON_RENDERABLE.forEach(function (type) {
    const result = vnext.buildPageModel(minimalPageWithMaterialType(type));
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
    assert.equal(
      result.errors.some(function (error) {
        return error.code === "UNKNOWN_MATERIAL_TYPE";
      }),
      false
    );
  });
});

test("phase2 compatibility: activity expected_output field remains valid", () => {
  const page = minimalPageWithMaterialType("text");
  const validated = vnext.validateInput(page);
  assert.equal(
    validated.errors.some(function (error) {
      return error.code === "NON_RENDERABLE_MATERIAL_TYPE";
    }),
    false
  );
  assert.equal(
    validated.errors.some(function (error) {
      return /expected_output/i.test(String(error.message || ""));
    }),
    false
  );
});

test("phase2 compatibility: legacy structural materials object maps still normalize", () => {
  const fixturePath = path.join(
    repoRoot,
    "tests/fixtures/page-render/ld-climate-misconception-discussion-page.json"
  );
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const normalized = normalizePageForRender(page);
  assert.ok(normalized);
  const learningActivities = (normalized.sections || []).find(function (section) {
    return String(section.section_id || "").toLowerCase() === "learning_activities";
  });
  assert.ok(learningActivities);
  const rows = Array.isArray(learningActivities.content) ? learningActivities.content : [];
  assert.ok(rows.length > 0);
  assert.equal(typeof rows[0].materials, "object");
  assert.equal(Array.isArray(rows[0].materials), false);
  assert.equal(typeof rows[0].expected_output, "string");
});

test("phase2 validation: unknown material types still use UNKNOWN_MATERIAL_TYPE", () => {
  const page = minimalPageWithMaterialType("mystery_widget");
  const result = vnext.buildPageModel(page);
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "UNKNOWN_MATERIAL_TYPE";
    })
  );
});

test("phase2 inventory: non-renderable types are excluded from renderer unsupported list", () => {
  const built = buildGamRendererTypeInventoryIsolated(repoRoot);
  const inventory = built.inventory;
  const unsupported = built.unsupported;

  NON_RENDERABLE.forEach(function (type) {
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
