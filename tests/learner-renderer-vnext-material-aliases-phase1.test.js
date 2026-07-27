"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const vnext = require("../lib/learner-renderer-vnext");
const parseMaterial = require("../lib/learner-renderer-vnext/parse-material");
const renderMaterial = require("../lib/learner-renderer-vnext/render-material").renderMaterial;
const buildBeatModels = require("../lib/learner-renderer-vnext/build-beat-model").buildBeatModels;
const buildCanonicalVariant =
  require("../lib/learner-renderer-vnext/archetype-canonical-binding")
    .buildCanonicalFunctionEnumVariant;

const ALIAS_CASES = Object.freeze([
  { alias: "checklists", canonical: "checklist", beatFunction: "verification" },
  { alias: "examples", canonical: "worked_example", beatFunction: "worked_thinking" },
  { alias: "worked_examples", canonical: "worked_example", beatFunction: "worked_thinking" },
  { alias: "exposition", canonical: "text", beatFunction: "explanation" },
  { alias: "reading", canonical: "text", beatFunction: "explanation" },
  { alias: "reading_text", canonical: "text", beatFunction: "explanation" },
  { alias: "prompt", canonical: "prompt_set", beatFunction: "guided_inquiry" },
  { alias: "prompts", canonical: "prompt_set", beatFunction: "guided_inquiry" },
  { alias: "scenarios", canonical: "scenario", beatFunction: "guided_practice" },
  { alias: "study_scenarios", canonical: "scenario", beatFunction: "guided_practice" },
  { alias: "templates", canonical: "template", beatFunction: "guided_practice" },
  { alias: "worksheet_template", canonical: "template", beatFunction: "guided_practice" }
]);

function bodyFor(canonical) {
  if (canonical === "checklist") return "- Criterion one\n- Criterion two\n\nRevise and retry.";
  if (canonical === "prompt_set") return "1. Explain demand pressure.\n2. Compare elasticity assumptions.";
  if (canonical === "template")
    return "### Claim\nWrite your claim.\n\n### Evidence\nAdd evidence.\n\n### Judgement\nConclude briefly.";
  if (canonical === "scenario")
    return "Scenario A: food-price inflation accelerates while wages remain flat.";
  return "Canonical body for " + canonical + ".";
}

function makeMaterial(materialId, materialType, canonical) {
  return {
    material_id: materialId,
    material_type: materialType,
    title: materialType + " title",
    body_format: "markdown",
    body: bodyFor(canonical)
  };
}

function pageWithMaterials(_beatFunction, materials) {
  return {
    schema_version: "2.0.0",
    title: "Alias page",
    page_profile: "learner",
    activities: [
      {
        activity_id: "A1",
        title: "Alias activity",
        learner_task: "Complete the activity.",
        expected_output: "Complete all prompts.",
        episode_plan: {
          archetype: "apply",
          beats: [
            { function: "explanation" },
            { function: "worked_thinking" },
            { function: "guided_inquiry" },
            { function: "guided_practice" },
            { function: "verification" }
          ]
        },
        materials: materials
      }
    ]
  };
}

function activityForComposition(beatFunction, material) {
  return {
    activity_id: "A1",
    title: "Alias activity",
    learner_task: "",
    expected_output: "",
    materials: [material]
  };
}

test("phase1 aliases: table-driven canonical normalisation + rendering", () => {
  ALIAS_CASES.forEach(function (entry) {
    const aliasMaterial = makeMaterial("A1-M1", entry.alias, entry.canonical);
    const canonicalMaterial = makeMaterial("A1-M2", entry.canonical, entry.canonical);
    const page = pageWithMaterials(entry.beatFunction, [aliasMaterial, canonicalMaterial]);

    const validated = vnext.validateInput(page);
    assert.equal(
      validated.errors.length,
      0,
      "validateInput should accept alias " + entry.alias
    );

    const aliasModel = parseMaterial.buildMaterialModel(aliasMaterial, 0);
    const canonicalModel = parseMaterial.buildMaterialModel(canonicalMaterial, 1);

    assert.equal(aliasModel.type, entry.canonical);
    assert.equal(canonicalModel.type, entry.canonical);
    assert.equal(aliasModel.body, bodyFor(entry.canonical));
    assert.equal(canonicalModel.body, bodyFor(entry.canonical));
    assert.equal(aliasModel.authoredType, entry.alias);
    assert.equal(canonicalModel.authoredType, undefined);

    const variant = buildCanonicalVariant("apply", [entry.beatFunction]);
    const beatResult = buildBeatModels(
      activityForComposition(entry.beatFunction, aliasMaterial),
      variant
    );
    assert.equal(
      beatResult.errors.length,
      0,
      entry.alias + " must compose in canonical " + entry.beatFunction + " beat"
    );
    assert.ok(
      beatResult.beats.some(function (beat) {
        return (beat.materials || []).some(function (material) {
          return material.id === "A1-M1" && material.type === entry.canonical;
        });
      })
    );

    const aliasHtml = renderMaterial(aliasModel);
    assert.match(aliasHtml, new RegExp('data-material-type="' + entry.canonical + '"'));
    assert.doesNotMatch(aliasHtml, /data-render-status="unsupported"/);

    assert.equal(parseMaterial.resolveMaterialType(aliasMaterial), entry.canonical);
    assert.equal(parseMaterial.hasMaterialRenderer(entry.alias), true);
    assert.equal(parseMaterial.hasMaterialRenderer(entry.canonical), true);
  });
});

test("phase1 aliases: plural aliases preserve all entries (no silent drop)", () => {
  [
    { alias: "prompts", canonical: "prompt_set", beatFunction: "guided_inquiry" },
    { alias: "worked_examples", canonical: "worked_example", beatFunction: "worked_thinking" },
    { alias: "checklists", canonical: "checklist", beatFunction: "verification" },
    { alias: "scenarios", canonical: "scenario", beatFunction: "guided_practice" },
    { alias: "templates", canonical: "template", beatFunction: "guided_practice" }
  ].forEach(function (entry) {
    const page = pageWithMaterials(entry.beatFunction, [
      makeMaterial("A1-M1", entry.alias, entry.canonical),
      makeMaterial("A1-M2", entry.alias, entry.canonical)
    ]);
    page.activities[0].materials[1].body = bodyFor(entry.canonical) + " Second.";

    const m1 = parseMaterial.buildMaterialModel(page.activities[0].materials[0], 0);
    const m2 = parseMaterial.buildMaterialModel(page.activities[0].materials[1], 1);
    assert.equal(m1.type, entry.canonical);
    assert.equal(m2.type, entry.canonical);
    assert.equal(m2.body.includes("Second."), true);

    const variant = buildCanonicalVariant("apply", [entry.beatFunction]);
    const beatResult = buildBeatModels(
      {
        activity_id: "A1",
        title: "Plural alias",
        learner_task: "",
        expected_output: "",
        materials: page.activities[0].materials
      },
      variant
    );
    assert.equal(beatResult.errors.length, 0, entry.alias + " plural composition must pass");
    const ids = beatResult.beats
      .flatMap(function (beat) {
        return (beat.materials || []).map(function (material) {
          return material.id;
        });
      })
      .sort();
    assert.deepEqual(ids, ["A1-M1", "A1-M2"]);
  });
});

test("phase1 aliases: malformed alias payloads fail clearly", () => {
  ALIAS_CASES.forEach(function (entry) {
    const page = pageWithMaterials(entry.beatFunction, [
      {
        material_id: "A1-M1",
        material_type: entry.alias,
        title: "bad payload",
        body_format: "markdown",
        body: { unexpected: true }
      }
    ]);
    const result = vnext.buildPageModel(page);
    assert.equal(result.ok, false, entry.alias + " malformed payload should fail");
    assert.ok(
      result.errors.some(function (error) {
        return (
          error.code === "INVALID_MATERIAL_PAYLOAD" &&
          error.materialType === entry.canonical &&
          error.authoredMaterialType === entry.alias
        );
      }),
      entry.alias + " should emit INVALID_MATERIAL_PAYLOAD"
    );
  });
});

test("phase1 aliases: canonical renderers remain unchanged", () => {
  const canonicalTypes = ["checklist", "worked_example", "text", "prompt_set", "scenario", "template"];
  canonicalTypes.forEach(function (type) {
    const material = parseMaterial.buildMaterialModel(
      {
        material_id: "C1",
        material_type: type,
        title: "Canonical",
        body_format: "markdown",
        body: bodyFor(type)
      },
      0
    );
    const html = renderMaterial(material);
    assert.match(html, new RegExp('data-material-type="' + type + '"'));
    assert.doesNotMatch(html, /data-render-status="unsupported"/);
  });
});

test("phase1 alias policy: ambiguous aliases remain unsupported", () => {
  ["discussion", "guidance", "instructions", "what_to_do", "criteria_exposition"].forEach(
    function (type) {
      assert.equal(parseMaterial.hasMaterialRenderer(type), false);
      const page = pageWithMaterials("guided_practice", [
        {
          material_id: "A1-M1",
          material_type: type,
          title: type,
          body_format: "markdown",
          body: "Ambiguous alias body."
        }
      ]);
      const result = vnext.buildPageModel(page);
      assert.equal(result.ok, false);
      assert.ok(
        result.errors.some(function (error) {
          return (
            error.code === "UNKNOWN_MATERIAL_TYPE" ||
            error.code === "NON_RENDERABLE_MATERIAL_TYPE"
          );
        })
      );
    }
  );
});
