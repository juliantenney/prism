"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const vnext = require("../lib/learner-renderer-vnext");
const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");
const beatRegistry = require("../lib/beat-material-registry");
const normalizePageForRender = require("../lib/page-render-normalize").normalizePageForRender;

const repoRoot = path.resolve(__dirname, "..");
const INVENTORY_PATH = path.join(
  repoRoot,
  "docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/gam-renderer-type-inventory.json"
);
const UNSUPPORTED_PATH = path.join(
  repoRoot,
  "docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/gam-unsupported-learner-interactions.json"
);

const PHASE6_NON_RENDERABLE = Object.freeze(["support_note", "support_notes"]);
const PHASE6_OBSOLETE = "support";

function pageWithMaterialType(materialType, body) {
  return {
    schema_version: "2.0.0",
    title: "Phase6 boundary page",
    page_profile: "learner",
    activities: [
      {
        activity_id: "A1",
        title: "Boundary activity",
        learner_task: "Do the activity.",
        expected_output: "A short response.",
        support_note: "Field-level support note must remain valid.",
        episode_plan: { archetype: "apply", beats: [{ function: "guided_practice" }] },
        materials: [
          {
            material_id: "A1-M1",
            material_type: materialType,
            title: materialType + " probe",
            body_format: "markdown",
            body: body == null ? "Body" : body
          }
        ]
      }
    ]
  };
}

test("phase6 contract: support_note and support_notes are non-renderable and absent from beat registry", () => {
  PHASE6_NON_RENDERABLE.forEach(function (type) {
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

test("phase6 contract: support is obsolete registry residue with no non-renderable boundary", () => {
  assert.equal(parseMaterial.hasMaterialRenderer(PHASE6_OBSOLETE), false);
  assert.equal(parseMaterial.NON_RENDERABLE_MATERIAL_TYPES[PHASE6_OBSOLETE], undefined);
  assert.equal(
    beatRegistry.MATERIAL_BEAT_REGISTRY.some(function (row) {
      return beatRegistry.normalizeMaterialType(row.materialType) === PHASE6_OBSOLETE;
    }),
    false
  );
});

test("phase6 validation: support_note and support_notes reject as NON_RENDERABLE_MATERIAL_TYPE", () => {
  PHASE6_NON_RENDERABLE.forEach(function (type) {
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
    assert.equal(
      result.errors.some(function (error) {
        return error.code === "UNKNOWN_MATERIAL_TYPE";
      }),
      false
    );
  });
});

test("phase6 validation: obsolete support material_type remains UNKNOWN_MATERIAL_TYPE", () => {
  const result = vnext.buildPageModel(pageWithMaterialType(PHASE6_OBSOLETE));
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "UNKNOWN_MATERIAL_TYPE" && error.materialType === PHASE6_OBSOLETE;
    })
  );
  assert.equal(
    result.errors.some(function (error) {
      return error.code === "NON_RENDERABLE_MATERIAL_TYPE";
    }),
    false
  );
});

test("phase6 validation: malformed support_note material payload still rejects as non-renderable", () => {
  const result = vnext.buildPageModel(pageWithMaterialType("support_note", null));
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "NON_RENDERABLE_MATERIAL_TYPE";
    })
  );
  assert.equal(
    result.errors.some(function (error) {
      return error.code === "INVALID_MATERIAL_PAYLOAD";
    }),
    false
  );
});

test("phase6 compatibility: activity support_note field remains valid with renderable materials", () => {
  const page = pageWithMaterialType("text");
  delete page.activities[0].materials[0].material_type;
  page.activities[0].materials[0].material_type = "text";
  const validated = vnext.validateInput(page);
  assert.equal(
    validated.errors.some(function (error) {
      return error.code === "NON_RENDERABLE_MATERIAL_TYPE";
    }),
    false
  );
  assert.match(page.activities[0].support_note, /Field-level support note/);
});

test("phase6 compatibility: fixture activity support_note is field-level not material_type", () => {
  const fixturePath = path.join(
    repoRoot,
    "tests/fixtures/page-render/marx-beat-render-page.json"
  );
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const activities = page.sections.find(function (section) {
    return String(section.section_id || "").toLowerCase() === "learning_activities";
  });
  assert.ok(activities && Array.isArray(activities.content));
  activities.content.forEach(function (row, index) {
    assert.match(String(row.support_note || ""), /\S/, "A" + (index + 1) + " support_note");
    Object.keys(row.materials || {}).forEach(function (key) {
      assert.notEqual(String(key).toLowerCase(), "support_note");
      assert.notEqual(String(key).toLowerCase(), "support_notes");
      assert.notEqual(String(key).toLowerCase(), "support");
    });
  });
});

test("phase6 compatibility: DLA fixture preserves scalar support_note on activity rows", () => {
  const fixturePath = path.join(repoRoot, "tests/fixtures/dla/rna-hcv-terse-scaffold-dla.json");
  const dla = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const notes = (dla.activities || [])
    .map(function (row) {
      return String(row.support_note || "").trim();
    })
    .filter(Boolean);
  assert.equal(notes.length, 5);
  assert.match(notes[0], /complementary strand/i);
  assert.match(notes[4], /comparing both/i);
});

test("phase6 compatibility: support_notes page section normalizes with ordered content", () => {
  const fixturePath = path.join(
    repoRoot,
    "tests/fixtures/page-render/ld-rna-hcv-assessment-page.json"
  );
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const normalized = normalizePageForRender(page);
  const section = (normalized.sections || []).find(function (row) {
    return String(row.section_id || "").toLowerCase() === "support_notes";
  });
  assert.ok(section);
  const lines = String(section.content || "")
    .split("\n")
    .map(function (line) {
      return line.replace(/^\s*-\s+/, "").trim();
    })
    .filter(Boolean);
  assert.equal(lines.length, 3);
  assert.match(lines[0], /knowledge summary/i);
  assert.match(lines[1], /misconception/i);
  assert.match(lines[2], /rationales/i);
});

test("phase6 compatibility: unknown material behaviour remains unchanged", () => {
  const result = vnext.buildPageModel(pageWithMaterialType("mystery_material_xyz"));
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "UNKNOWN_MATERIAL_TYPE";
    })
  );
});

test("phase6 inventory: support family excluded from renderable material inventory", () => {
  execFileSync(process.execPath, [path.join(repoRoot, "scripts/build-gam-renderer-type-inventory.js")], {
    cwd: repoRoot,
    stdio: "pipe"
  });
  const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, "utf8"));
  const unsupported = JSON.parse(fs.readFileSync(UNSUPPORTED_PATH, "utf8"));

  ["support", "support_note", "support_notes"].forEach(function (type) {
    assert.equal(
      inventory.material_types.some(function (entry) {
        return entry.type === type;
      }),
      false,
      "renderable inventory must exclude " + type
    );
    assert.equal(
      unsupported.unsupported.some(function (entry) {
        return entry.type === type;
      }),
      false,
      "unsupported list must exclude resolved " + type
    );
  });

  PHASE6_NON_RENDERABLE.forEach(function (type) {
    const row = (inventory.non_renderable_material_types || []).find(function (entry) {
      return entry.type === type;
    });
    assert.ok(row, "non_renderable inventory must include " + type);
  });
});
