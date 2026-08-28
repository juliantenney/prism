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
const INFLATION_DESIGN_PAGE = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38S-AFTER-3-design-page.json"
);

function fixtureVerificationRubricBody() {
  const page = JSON.parse(fs.readFileSync(INFLATION_DESIGN_PAGE, "utf8"));
  const la = page.sections.find(function (section) {
    return String(section.section_id || "").toLowerCase() === "learning_activities";
  });
  const row = (la && la.content || []).find(function (entry) {
    return String(entry.activity_id || "") === "A4";
  });
  assert.ok(row && row.materials && row.materials.checklist_evaluate);
  return String(row.materials.checklist_evaluate);
}

function pageWithMaterial(material) {
  return {
    schema_version: "2.0.0",
    title: "Phase8 rubric page",
    page_profile: "learner",
    activities: [
      {
        activity_id: "A1",
        title: "Evaluation activity",
        learner_task: "Verify your evaluation against the rubric.",
        expected_output: "Verified evaluation memo.",
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

test("phase8 contract: rubric aliases to checklist and is absent from beat registry", () => {
  assert.equal(parseMaterial.canonicalMaterialType("rubric"), "checklist");
  assert.equal(parseMaterial.hasMaterialRenderer("rubric"), true);
  assert.equal(
    beatRegistry.MATERIAL_BEAT_REGISTRY.some(function (row) {
      return beatRegistry.normalizeMaterialType(row.materialType) === "rubric";
    }),
    false
  );
  assert.ok(
    beatRegistry.MATERIAL_BEAT_REGISTRY.some(function (row) {
      return beatRegistry.normalizeMaterialType(row.materialType) === "checklist";
    })
  );
});

test("phase8 fixture-backed: inflation verification rubric preserves criteria table as static checklist", () => {
  const body = fixtureVerificationRubricBody();
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A4-RUBRIC",
      material_type: "rubric",
      title: "Verification rubric",
      body: body
    },
    0
  );
  assert.equal(model.type, "checklist");
  assert.equal(model.authoredType, "rubric");
  assert.match(model.body, /Pass\/Fail/i);
  assert.match(model.body, /Repair Instructions/i);
  assert.match(model.body, /transferability/i);
  const html = renderMaterial(model);
  assert.match(html, /util-checklist-block|util-material-role-checklist|<table/i);
  assert.match(html, /detailed planning and depth/i);
  assert.doesNotMatch(html, /Unsupported material kind/);
  assert.doesNotMatch(html, /data-workspace-capability="table_entry"/);
});

test("phase8 rendering: bullet rubric criteria preserve order and escaping", () => {
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-R1",
      material_type: "rubric",
      title: "Self-check rubric",
      body:
        "- [ ] Criterion <one> uses evidence & reasoning.\n- [ ] Criterion two explains trade-offs."
    },
    0
  );
  assert.equal(model.type, "checklist");
  assert.equal(model.checklist.criteria.length, 2);
  const html = renderMaterial(model, { interactiveChecklist: false });
  assert.match(html, /Criterion &lt;one&gt;/);
  assert.match(html, /&amp; reasoning/);
  assert.match(html, /trade-offs/);
});

test("phase8 validation: fixture-shaped rubric accepted by buildPageModel", () => {
  const result = vnext.buildPageModel(
    pageWithMaterial({
      material_id: "A1-M1",
      material_type: "rubric",
      title: "Verification rubric",
      body_format: "markdown",
      body: fixtureVerificationRubricBody()
    })
  );
  assert.equal(result.ok, true, JSON.stringify(result.errors || []));
});

test("phase8 validation: empty rubric payload rejects with INVALID_MATERIAL_PAYLOAD", () => {
  const result = vnext.buildPageModel(
    pageWithMaterial({
      material_id: "A1-M1",
      material_type: "rubric",
      title: "Empty rubric",
      body: "   "
    })
  );
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "INVALID_MATERIAL_PAYLOAD" && error.authoredMaterialType === "rubric";
    })
  );
});

test("phase8 validation: structured scoring rubric rejects with AMBIGUOUS_MATERIAL_TYPE", () => {
  const result = vnext.buildPageModel(
    pageWithMaterial({
      material_id: "A1-M1",
      material_type: "rubric",
      title: "Scoring grid",
      content: {
        criteria: [
          {
            id: "depth",
            label: "Depth",
            weight: 0.25,
            levels: [
              { label: "Emerging", points: 1, descriptor: "Minimal planning." },
              { label: "Proficient", points: 3, descriptor: "Detailed planning." }
            ]
          }
        ]
      }
    })
  );
  assert.equal(result.ok, false);
  assert.ok(
    result.errors.some(function (error) {
      return error.code === "AMBIGUOUS_MATERIAL_TYPE" && error.authoredMaterialType === "rubric";
    })
  );
});

test("phase8 moment policy: rubric alias composes to Check via checklist", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "rubric",
    title: "Verification rubric",
    body: "- [ ] Criterion one is evidenced.\n- [ ] Criterion two weighs trade-offs."
  });
  page.activities[0].episode_plan = { archetype: "evaluate", beats: [{ function: "verification" }] };
  page.activities[0].learner_task = "";
  page.activities[0].expected_output = "";
  const validated = vnext.validateInput(page);
  assert.equal(validated.errors.length, 0);
  const variant = buildCanonicalVariant("evaluate", ["verification"]);
  const beatResult = buildBeatModels(page.activities[0], variant);
  assert.equal(beatResult.errors.length, 0);
  const material = beatResult.beats[0].materials[0];
  assert.equal(material.type, "checklist");
  assert.equal(material.authoredType, "rubric");
  const moments = classifyActivityBeats({ beats: beatResult.beats });
  assert.ok(moments.checkBeats.length >= 1);
});

test("phase8 compatibility: production pages keep rubric content on checklist keys", () => {
  const page = JSON.parse(fs.readFileSync(INFLATION_DESIGN_PAGE, "utf8"));
  const la = page.sections.find(function (section) {
    return String(section.section_id || "").toLowerCase() === "learning_activities";
  });
  const row = (la && la.content || []).find(function (entry) {
    return String(entry.activity_id || "") === "A4";
  });
  assert.ok(row && row.materials);
  assert.ok(row.materials.checklist_evaluate);
  assert.ok(row.materials.checklist);
  assert.equal(Object.prototype.hasOwnProperty.call(row.materials, "rubric"), false);
});

test("phase8 compatibility: marking_rubric workflow field does not require material_type rubric", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "text",
    title: "Brief",
    body: "Evaluation brief."
  });
  page.marking_rubric = {
    criteria: [{ id: "c1", label: "Assessor criterion", levels: [{ points: 5 }] }]
  };
  const validated = vnext.validateInput(page);
  assert.equal(
    validated.errors.some(function (error) {
      return /marking_rubric/i.test(String(error.message || ""));
    }),
    false
  );
});

test("phase8 regression: reference_table renderer unchanged", () => {
  const model = parseMaterial.buildMaterialModel(
    {
      material_id: "A1-REF",
      material_type: "reference_table",
      title: "Reference",
      body: "| Criterion | Descriptor |\n| --- | --- |\n| Depth | Detailed planning |"
    },
    0
  );
  const html = renderMaterial(model);
  assert.match(html, /util-material-table-block|<table/i);
  assert.doesNotMatch(html, /util-checklist-block/);
});

test("phase8 inventory: rubric removed from unsupported list", () => {
  const built = buildGamRendererTypeInventoryIsolated(repoRoot);
  const inventory = built.inventory;
  const unsupported = built.unsupported;
  assert.equal(
    inventory.material_types.some(function (entry) {
      return entry.type === "rubric";
    }),
    false
  );
  assert.equal(
    unsupported.unsupported.some(function (entry) {
      return entry.type === "rubric";
    }),
    false
  );
});
