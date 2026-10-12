/**
 * Urban Heat Island representation specifications.
 * Fixtures follow the republished learner page: three finished illustrations
 * and two commissioned comparison tables wrapped in authoring objects.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const fixture = require("./fixtures/uhi-urban-heat-island-materials.json");

const SCHEMA_LABELS = [
  "Format",
  "Diagram",
  "Graph",
  "Chart type",
  "Data status",
  "Surface description",
  "Annotations",
  "Comparison focus",
  "Column headers",
  "Text equivalent",
  "Visible elements",
  "Shared equation",
  "Series id",
  "Line style"
];

function pageFromFixture() {
  const materials = fixture.materials;
  const order = ["XM-M01", "XM-M02", "XM-M03", "XM-M04", "XM-M05"];
  const sections = order.map(function (id) {
    const row = materials[id];
    return {
      section_id: row.section_id,
      title: row.section_title,
      exposition: row.section_title,
      materials: [
        {
          material_id: id,
          kind: row.kind,
          title: row.body.title,
          body: row.body
        }
      ]
    };
  });
  const visualAffordances = order
    .filter(function (id) {
      return materials[id].figure;
    })
    .map(function (id) {
      const row = materials[id];
      return {
        affordance_id: "va-" + row.section_id,
        scope: "section",
        section_id: row.section_id,
        visual_decision: "generate",
        visual_slot: "section-after-content",
        subject: row.section_title
      };
    });
  const assets = order
    .filter(function (id) {
      return materials[id].figure;
    })
    .map(function (id) {
      const row = materials[id];
      return {
        brief_id: "brief-" + row.section_id,
        affordance_id: "va-" + row.section_id,
        scope: "section",
        section_id: row.section_id,
        visual_slot: "section-after-content",
        alt_text: row.alt_text,
        detailed_description: row.body.text_equivalent,
        render_source: { kind: "file", value: row.figure }
      };
    });
  return {
    page: {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: fixture.title,
      activities: [],
      sections: sections,
      visual_affordances: visualAffordances,
      page_synthesis: {},
      assembly_state: {
        current_stage: "expository_materials",
        enriched_by: [
          "expository_journey_plan",
          "expository_development",
          "expository_materials"
        ]
      }
    },
    assets: assets
  };
}

function article(html, materialId) {
  const marker = 'data-material-id="' + materialId + '"';
  const start = html.indexOf(marker);
  assert.notEqual(start, -1, "missing material " + materialId);
  const open = html.lastIndexOf("<article", start);
  const end = html.indexOf("</article>", start);
  return html.slice(open, end + "</article>".length);
}

function visible(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

test("Urban Heat Island publishes three illustrations and two comparison tables without specification schema", () => {
  const built = pageFromFixture();
  const rendered = renderLearnerPageHtml(built.page, {
    visualAssets: { assets: built.assets }
  });
  assert.equal(rendered.error, null, JSON.stringify(rendered.error));
  const html = String(rendered.html || "");
  const tables = html.match(/<table\b/gi) || [];
  assert.equal(tables.length, 2);

  ["XM-M01", "XM-M02", "XM-M03"].forEach(function (id) {
    const block = article(html, id);
    assert.match(block, /data-representation-spec-suppressed="section-figure"/);
    assert.doesNotMatch(block, /<table\b/i);
    assert.doesNotMatch(block, /<h4\b/i);
    assert.match(visible(block), /text_equivalent|The diagram compares|The left cross-section|The graph contains/);
  });
  assert.match(visible(article(html, "XM-M01")), /The diagram compares two environments/);
  assert.match(
    visible(article(html, "XM-M01")),
    /Arrow widths are illustrative, not measured/
  );
  assert.match(visible(article(html, "XM-M02")), /The left cross-section shows a narrow street/);
  assert.match(visible(article(html, "XM-M03")), /The graph contains two conceptual air-temperature curves/);

  const measurement = article(html, "XM-M04");
  const mitigation = article(html, "XM-M05");
  assert.match(measurement, /<table/);
  assert.match(mitigation, /<table/);
  assert.match(measurement, /<th[^>]*>\s*Dimension\s*<\/th>/);
  assert.match(measurement, /<th[^>]*>\s*Surface urban heat island\s*<\/th>/);
  assert.match(measurement, /<th[^>]*>\s*Atmospheric urban heat island\s*<\/th>/);
  assert.match(measurement, /Thermal infrared observations from satellites or aircraft/);
  assert.match(
    measurement,
    /Surface and atmospheric urban heat islands describe related but different temperature contrasts/
  );
  assert.match(visible(measurement), /Neither measurement should automatically be treated/);
  assert.doesNotMatch(measurement, /<h4/i);
  assert.doesNotMatch(measurement, /Concise two-column comparison/);

  assert.match(mitigation, /<th[^>]*>\s*Intervention\s*<\/th>/);
  assert.match(mitigation, /<th[^>]*>\s*Principal physical mechanism\s*<\/th>/);
  assert.match(mitigation, /Street trees and vegetation/);
  assert.match(mitigation, /Green roofs/);
  assert.match(
    visible(mitigation),
    /Each strategy should be judged against its intended thermal outcome/
  );
  assert.doesNotMatch(mitigation, /Compact comparative table/);

  assert.match(html, /assets\/section-after-content\.png/);
  assert.match(html, /assets\/section-after-content-vb-38-4-va-s3-urban-form\.png/);
  assert.match(html, /assets\/section-after-content-vb-38-4-va-s4-diurnal-te\.png/);
  assert.match(html, /Two-panel conceptual energy-balance diagram/);
  assert.match(html, /Cross-sections of a narrow street canyon/);
  assert.match(html, /Conceptual 24-hour line graph/);

  SCHEMA_LABELS.forEach(function (label) {
    const pattern = new RegExp(
      "<(?:strong|h4|dt|th)[^>]*>\\s*" + label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*</",
      "i"
    );
    assert.doesNotMatch(html, pattern, "schema label published: " + label);
  });
  assert.doesNotMatch(html, /<h4[^>]*>\s*Table\s*<\/h4>/i);
});
