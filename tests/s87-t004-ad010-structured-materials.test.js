/**
 * S87-T-004 — AD-010 structured-material rendering repair.
 *
 * Evidenced C01–C05 kinds produced learner-facing
 * "Structured material body is not supported for learner rendering."
 * Export HTML retained kinds only; body shapes are reconstructed fixtures.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const structured = require("../lib/learner-renderer-vnext/expository-structured-materials.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

const AD010_MSG = /Structured material body is not supported for learner rendering/i;
const fixturesDir = path.join(__dirname, "fixtures");
const ad010Cases = JSON.parse(
  fs.readFileSync(path.join(fixturesDir, "s87-t004-ad010-structured-bodies.json"), "utf8")
).cases;

function pageWithMaterials(materials) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "AD-010 regression page",
    activities: [],
    sections: [
      {
        section_id: "S1",
        title: "Section one",
        exposition: "Section prose remains visible.",
        materials: materials
      }
    ],
    page_synthesis: {},
    assembly_state: {
      current_stage: "expository_materials",
      enriched_by: [
        "expository_journey_plan",
        "expository_development",
        "expository_materials"
      ]
    }
  };
}

function renderMaterials(materials) {
  const page = pageWithMaterials(materials);
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors || []));
  const html = String(renderLearnerPageHtml(page).html || "");
  return { page, model, html, mats: model.model.expositionSections[0].materials };
}

test("string body still uses ordinary material path (unchanged)", () => {
  const { html, mats } = renderMaterials([
    {
      material_id: "str-1",
      section_id: "S1",
      kind: "text",
      body: "Ordinary prose material UNIQUE-STRING-BODY."
    }
  ]);
  assert.equal(mats[0].type === "expository_structured_fallback", false);
  assert.doesNotMatch(String(mats[0].type || ""), /expository_structured_/);
  assert.match(html, /UNIQUE-STRING-BODY/);
  assert.doesNotMatch(html, AD010_MSG);
});

test("stages[] compact worked example still renders", () => {
  const { html, mats } = renderMaterials([
    {
      material_id: "we-1",
      kind: "compact_worked_example",
      body: {
        title: "Worked title",
        scenario: "A seminar scenario.",
        stages: [
          { label: "Stage A", description: "Do A." },
          { label: "Stage B", description: "Do B." }
        ],
        synthesis: "Synthesis closes the example."
      }
    }
  ]);
  assert.equal(mats[0].type, "expository_compact_worked_example");
  assert.match(html, /data-expository-structured="compact_worked_example"/);
  assert.match(html, /Worked title/);
  assert.match(html, /Stage A/);
  assert.match(html, /Synthesis closes the example/);
  assert.doesNotMatch(html, AD010_MSG);
});

test("elements[]+relationships[] diagram still caption-only", () => {
  const { html, mats } = renderMaterials([
    {
      material_id: "diag-1",
      kind: "conceptual_diagram",
      body: {
        title: "Loop title",
        elements: [
          { id: "a", label: "Alpha", supporting_text: "HIDDEN-ELEMENT-TEXT" }
        ],
        relationships: [{ from: "a", to: "a", meaning: "HIDDEN-REL-TEXT" }],
        caption: "Visible caption only."
      }
    }
  ]);
  assert.equal(mats[0].type, "expository_diagram_caption");
  assert.match(html, /data-expository-structured="diagram_caption"/);
  assert.match(html, /Loop title/);
  assert.match(html, /Visible caption only/);
  assert.doesNotMatch(html, /HIDDEN-ELEMENT-TEXT/);
  assert.doesNotMatch(html, /HIDDEN-REL-TEXT/);
  assert.doesNotMatch(html, AD010_MSG);
});

test("each reconstructed C01–C05 AD-010 shape renders meaningful content", () => {
  const materials = ad010Cases
    .filter((c) => c.case_id !== "generic")
    .map((c) => ({
      material_id: c.material_id,
      kind: c.kind,
      body: c.body,
      formal_notes: "AUTHOR-ONLY-" + c.material_id
    }));
  const { html, mats } = renderMaterials(materials);
  assert.equal(mats.length, materials.length);
  mats.forEach((m) => {
    assert.notEqual(m.type, "expository_structured_unsupported");
    assert.match(
      String(m.type),
      /expository_structured_(sequence|elements|table|contrast|equation|fallback)|expository_compact_worked_example/
    );
  });
  assert.doesNotMatch(html, AD010_MSG);
  assert.doesNotMatch(html, /AUTHOR-ONLY/);
  // Content samples from reconstructed bodies
  assert.match(html, /P\(H\|E\)/);
  assert.match(html, /Base-rate versus hit-rate/);
  assert.match(html, /Natural frequencies/);
  assert.match(html, /Question design flow/);
  assert.match(html, /Purpose shapes wording/);
  assert.match(html, /Reconstructing a camouflage/);
  assert.match(html, /Identify the outcome/);
  assert.match(html, /Levels of explanation for July 1914/);
  assert.match(html, /Truth versus validity/);
  assert.match(html, /Appraising an argument/);
  assert.match(html, /Test soundness/);
});

test("generic valid structured object fallback does not emit AD-010 message", () => {
  const generic = ad010Cases.find((c) => c.case_id === "generic");
  const { html, mats } = renderMaterials([
    {
      material_id: generic.material_id,
      kind: generic.kind,
      body: generic.body,
      formal_notes: "AUTHOR-ONLY generic"
    }
  ]);
  assert.equal(mats[0].type, "expository_structured_fallback");
  assert.match(html, /data-expository-structured="fallback"/);
  assert.doesNotMatch(html, AD010_MSG);
  assert.doesNotMatch(html, /AUTHOR-ONLY/);
  assert.doesNotMatch(html, /\{"title"/); // no JSON dump
});

test("generic fallback preserves nested instructional content", () => {
  const generic = ad010Cases.find((c) => c.case_id === "generic");
  const { html } = renderMaterials([
    { material_id: generic.material_id, kind: generic.kind, body: generic.body }
  ]);
  assert.match(html, /UNIQUE-KEEP-77/);
  assert.match(html, /Claim A remains learner-visible/);
  assert.match(html, /What must remain after fallback rendering/);
});

test("arrays render as lists, not JSON", () => {
  const { html } = renderMaterials([
    {
      material_id: "arr-1",
      kind: "bullet_pack",
      body: {
        title: "Array pack",
        items: ["Alpha item", "Beta item", "Gamma item"]
      }
    }
  ]);
  assert.match(html, /<ul>/);
  assert.match(html, /Alpha item/);
  assert.doesNotMatch(html, /\["Alpha item"/);
  assert.doesNotMatch(html, AD010_MSG);
});

test("nested objects preserve labels and values intelligibly", () => {
  const built = structured.buildExpositionStructuredMaterial(
    {
      material_id: "nest-1",
      kind: "packet",
      body: {
        learner_focus: "Keep labels readable",
        support: { tip_one: "Readable tip" }
      }
    },
    "S1",
    0
  );
  assert.equal(built.type, "expository_structured_fallback");
  const html = structured.renderExpositionStructuredMaterial(built);
  assert.match(html, /Learner focus/);
  assert.match(html, /Keep labels readable/);
  assert.match(html, /Tip one/);
  assert.match(html, /Readable tip/);
  assert.doesNotMatch(html, AD010_MSG);
});

test("null / empty / invalid bodies follow deterministic behaviour", () => {
  const emptyObj = structured.buildExpositionStructuredMaterial(
    { material_id: "empty-1", kind: "empty", body: {} },
    "S1",
    0
  );
  assert.equal(emptyObj.type, "expository_structured_fallback");
  const emptyHtml = structured.renderExpositionStructuredMaterial(emptyObj);
  assert.doesNotMatch(emptyHtml, AD010_MSG);

  const emptyArr = structured.buildExpositionStructuredMaterial(
    { material_id: "empty-arr", kind: "empty", body: [] },
    "S1",
    1
  );
  assert.equal(emptyArr.type, "expository_structured_fallback");
  assert.doesNotMatch(
    structured.renderExpositionStructuredMaterial(emptyArr),
    AD010_MSG
  );

  // Non-object non-string → ordinary path (null from builder)
  assert.equal(
    structured.buildExpositionStructuredMaterial(
      { material_id: "num-1", kind: "x", body: 42 },
      "S1",
      2
    ),
    null
  );

  // Legacy unsupported model without body still shows diagnostic
  const legacyHtml = structured.renderExpositionStructuredMaterial({
    id: "legacy-1",
    kind: "x",
    type: "expository_structured_unsupported",
    sectionId: "S1"
  });
  assert.match(legacyHtml, AD010_MSG);
});

test("HTML escaping remains intact for structured fallback", () => {
  const { html } = renderMaterials([
    {
      material_id: "esc-1",
      kind: "inject",
      body: {
        title: "<script>alert(1)</script>",
        note: "A & B <C>"
      }
    }
  ]);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /A &amp; B &lt;C&gt;/);
});

test("browser bundle exports match Node specialised classifiers", () => {
  // Source of truth is the Node module; browser artefact is rebuilt from it.
  // Spot-check that regenerated browser file contains the new type tokens.
  const browserSrc = fs.readFileSync(
    path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
    "utf8"
  );
  assert.match(browserSrc, /expository_structured_fallback/);
  assert.match(browserSrc, /expository_structured_sequence/);
  assert.match(browserSrc, /expository_structured_elements/);
  assert.match(browserSrc, /isSequenceBody/);
  assert.match(browserSrc, /renderStructuredFallback/);

  // Behavioural equivalence: Node build+render for a representative case
  const sample = ad010Cases.find((c) => c.material_id === "XM-MAT-S2-01");
  const built = structured.buildExpositionStructuredMaterial(
    { material_id: sample.material_id, kind: sample.kind, body: sample.body },
    "S1",
    0
  );
  assert.equal(built.type, "expository_structured_contrast");
  const html = structured.renderExpositionStructuredMaterial(built);
  assert.match(html, /Truth versus validity/);
  assert.doesNotMatch(html, AD010_MSG);
});

test("Interactive string-body materials remain unchanged on shared surface", () => {
  const interactive = JSON.parse(
    fs.readFileSync(path.join(fixturesDir, "page-render", "roman-roads-page.json"), "utf8")
  );
  const result = renderLearnerPageHtml(interactive);
  assert.equal(result.error, null);
  const html = String(result.html || "");
  assert.match(html, /data-region="activities"/);
  assert.doesNotMatch(html, /data-expository-structured=/);
  assert.doesNotMatch(html, AD010_MSG);
  assert.doesNotMatch(html, /\[object Object\]/);
});

test("buildExpositionStructuredMaterial preserves body on fallback (unique content rule)", () => {
  const built = structured.buildExpositionStructuredMaterial(
    {
      material_id: "keep-1",
      kind: "odd",
      body: { foo: "bar-UNIQUE", nested: { a: "keep-me" } },
      formal_notes: "AUTHOR-ONLY"
    },
    "S9",
    0
  );
  assert.equal(built.type, "expository_structured_fallback");
  assert.equal(built.body.foo, "bar-UNIQUE");
  assert.equal(built.body.nested.a, "keep-me");
  assert.equal(built._authorFormalNotes, "AUTHOR-ONLY");
  const html = structured.renderExpositionStructuredMaterial(built);
  assert.match(html, /bar-UNIQUE/);
  assert.match(html, /keep-me/);
  assert.doesNotMatch(html, /AUTHOR-ONLY/);
  assert.doesNotMatch(html, AD010_MSG);
});
