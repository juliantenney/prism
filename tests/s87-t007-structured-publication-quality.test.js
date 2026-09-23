/**
 * S87-T-007 repair 1 — structured-material publication quality.
 *
 * Blank comparison tables (header/row-count OK, cells empty) and
 * learner-facing schema / internal-ID leakage after T-004 lossless fallback.
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
const fixtures = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "fixtures", "s87-t007-structured-publication-quality.json"),
    "utf8"
  )
);

function pageWithMaterials(materials) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "T-007 publication-quality page",
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

function stripTags(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

test("1. blank-table label-columns + mismatched row keys: values render", () => {
  const fx = fixtures.blank_table_label_columns_mismatched_row_keys;
  const { html, mats } = renderMaterials([
    {
      material_id: fx.material_id,
      kind: fx.kind,
      title: fx.title,
      body: fx.body
    }
  ]);
  assert.equal(mats[0].type, "expository_structured_table");
  assert.equal(mats[0].rows.length, 2);
  assert.match(html, /data-expository-structured="table"/);
  assert.match(html, /Initiating pressure/);
  assert.match(html, /Alliance timetable forces early mobilisation/);
  assert.match(html, /Evidence warrant/);
  assert.match(html, /Diplomatic signals leave room for de-escalation/);
  assert.match(html, /Dimension/);
  assert.match(html, /Account A/);
  assert.match(html, /Account B/);
  // No empty-row pattern for the two data rows: every <td> in tbody has text.
  const tbody = html.match(/<tbody>[\s\S]*?<\/tbody>/);
  assert.ok(tbody);
  assert.doesNotMatch(tbody[0], /<td>\s*<\/td>/);
  assert.doesNotMatch(html, AD010_MSG);
});

test("2. existing keyed table shape remains correct", () => {
  const fx = fixtures.good_keyed_table;
  const { html, mats } = renderMaterials([
    { material_id: fx.material_id, kind: fx.kind, body: fx.body }
  ]);
  assert.equal(mats[0].type, "expository_structured_table");
  assert.match(html, /Natural frequencies/);
  assert.match(html, /Base rate/);
  assert.match(html, /1 in 1000/);
  assert.match(html, /99%/);
  assert.doesNotMatch(html, AD010_MSG);
});

test("3. graph body: learner labels/relationships survive; machine ids do not leak", () => {
  const fx = fixtures.graph_with_machine_ids;
  const { html, mats } = renderMaterials([
    {
      material_id: fx.material_id,
      kind: fx.kind,
      title: fx.title,
      body: fx.body
    }
  ]);
  assert.equal(mats[0].type, "expository_structured_graph");
  assert.match(html, /data-expository-structured="graph"/);
  assert.match(html, /Great-power rivalry/);
  assert.match(html, /Military preparation/);
  assert.match(html, /Threat perception/);
  assert.match(html, /Crisis vulnerability/);
  assert.match(html, /drives armament races/);
  assert.match(html, /Great-power rivalry → Military preparation/);
  const visible = stripTags(html);
  assert.doesNotMatch(visible, /\bgreat_power_rivalry\b/);
  assert.doesNotMatch(visible, /\bmilitary_preparation\b/);
  assert.doesNotMatch(visible, /\bthreat_perception\b/);
  assert.doesNotMatch(visible, /\bcrisis_vulnerability\b/);
  assert.doesNotMatch(visible, /\bNodes\b/);
  assert.doesNotMatch(visible, /\bEdges\b/);
  // Schema table chrome
  assert.doesNotMatch(html, /<th[^>]*>\s*Id\s*<\/th>/i);
  assert.doesNotMatch(html, /<dt>\s*From\s*<\/dt>/i);
  assert.doesNotMatch(html, /<dt>\s*To\s*<\/dt>/i);
  // Material id may remain as data attribute only
  assert.match(html, /data-material-id="XM-MAT-S4-01"/);
  assert.doesNotMatch(visible, /XM-MAT-S4-01/);
  assert.doesNotMatch(html, AD010_MSG);
});

test("4. continuation / internal material reference does not appear learner-facing", () => {
  const fx = fixtures.continuation_internal_ref;
  const { html, mats } = renderMaterials([
    { material_id: fx.material_id, kind: fx.kind, body: fx.body }
  ]);
  assert.equal(mats[0].type, "expository_structured_fallback");
  assert.match(html, /KEEP-CONT-91/);
  assert.match(html, /Continuation keeps the rivalry thread visible/);
  const visible = stripTags(html);
  assert.doesNotMatch(visible, /XM-MAT-S4-01/);
  assert.doesNotMatch(visible, /XM-MAT-S4-02/);
  assert.doesNotMatch(visible, /continuation_of/i);
  assert.doesNotMatch(html, AD010_MSG);
});

test("5. generic nested object/array: intellectual text survives; no JSON / AD-010", () => {
  const fx = fixtures.generic_nested;
  const { html, mats } = renderMaterials([
    { material_id: fx.material_id, kind: fx.kind, body: fx.body }
  ]);
  assert.equal(mats[0].type, "expository_structured_fallback");
  assert.match(html, /UNIQUE-KEEP-77/);
  assert.match(html, /Claim A remains learner-visible/);
  assert.doesNotMatch(html, /\{"title"/);
  assert.doesNotMatch(html, AD010_MSG);
});

test("6. existing worked-example specialised rendering unchanged", () => {
  const fx = fixtures.worked_example;
  const { html, mats } = renderMaterials([
    { material_id: fx.material_id, kind: fx.kind, body: fx.body }
  ]);
  assert.equal(mats[0].type, "expository_compact_worked_example");
  assert.match(html, /data-expository-structured="compact_worked_example"/);
  assert.match(html, /Worked title/);
  assert.match(html, /Stage A/);
  assert.match(html, /Synthesis closes the example/);
});

test("7. existing diagram specialised rendering unchanged", () => {
  const fx = fixtures.diagram;
  const { html, mats } = renderMaterials([
    { material_id: fx.material_id, kind: fx.kind, body: fx.body }
  ]);
  assert.equal(mats[0].type, "expository_diagram_caption");
  assert.match(html, /Visible caption only/);
  assert.doesNotMatch(html, /HIDDEN-ELEMENT-TEXT/);
  assert.doesNotMatch(html, /HIDDEN-REL-TEXT/);
});

test("8. empty {} / [] behaviour remains safe", () => {
  const emptyObj = structured.buildExpositionStructuredMaterial(
    { material_id: "empty-1", kind: "empty", body: {} },
    "S1",
    0
  );
  assert.equal(emptyObj.type, "expository_structured_fallback");
  assert.doesNotMatch(
    structured.renderExpositionStructuredMaterial(emptyObj),
    AD010_MSG
  );

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
});

test("9. escaping / accessibility remain intact", () => {
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

  const fx = fixtures.blank_table_label_columns_mismatched_row_keys;
  const tableHtml = renderMaterials([
    { material_id: fx.material_id, kind: fx.kind, body: fx.body }
  ]).html;
  assert.match(tableHtml, /<table class="util-exposition-structured-table">/);
  assert.match(tableHtml, /<th scope="col">/);
  assert.match(tableHtml, /<tbody>/);
});

test("C05-style intellectual property headings humanised; diagram_logic chrome suppressed", () => {
  const fx = fixtures.c05_style_property_pack;
  const { html } = renderMaterials([
    { material_id: fx.material_id, kind: fx.kind, body: fx.body }
  ]);
  assert.match(html, /Validity concerns form/);
  assert.match(html, /Form/);
  assert.match(html, /Patterns/);
  assert.match(html, /Dimensions/);
  const visible = stripTags(html);
  assert.doesNotMatch(visible, /Diagram logic/i);
  assert.doesNotMatch(html, AD010_MSG);
});

test("browser artefact contains graph + sanitisation tokens after rebuild expectation", () => {
  const browserSrc = fs.readFileSync(
    path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
    "utf8"
  );
  assert.match(browserSrc, /expository_structured_fallback/);
  assert.match(browserSrc, /expository_structured_graph/);
  assert.match(browserSrc, /isGraphLikeBody/);
  assert.match(browserSrc, /isSchemaMechanicKey/);
  assert.match(browserSrc, /learnerFacingTitle/);
  assert.match(browserSrc, /resolveRowCell/);
});
