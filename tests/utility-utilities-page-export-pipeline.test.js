/**
 * Utilities UI export pipeline — PB-S-007 smoke (catalog HTML archaeology removed).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const csvFixturePath = "tests/fixtures/page-render/ld-inflation-workshop-csv-worksheet-page.json";

test("export pipeline: inflation CSV fixture renders without error", () => {
  const page = loadPageFixture(repoRoot, csvFixturePath);
  const r = api.runUtilityPageExportPipelineForTest(page, {
    sectionOrder: ["sections"],
    applyCompositionValidation: false
  });
  assert.ok(r && !r.error, r && r.error);
  const html = String(r.html || "");
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /util-page-export--vnext/);
});

test("buildUtilityStructuredHtmlForTest delegates to export pipeline for same fixture", () => {
  const page = loadPageFixture(repoRoot, csvFixturePath);
  const direct = api.runUtilityPageExportPipelineForTest(page, { sectionOrder: ["sections"] });
  const viaWrapper = api.buildUtilityStructuredHtmlForTest(page, ["sections"]);
  assert.ok(direct && !direct.error);
  assert.ok(viaWrapper && !viaWrapper.error);
  assert.equal(String(direct.html || "").length > 1000, true);
  assert.equal(String(viaWrapper.html || "").length > 1000, true);
});

test("export pipeline: minimal sections-shaped page lifts to activities and renders", () => {
  const page = {
    artifact_type: "page",
    title: "Nested table payload",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A2",
            title: "Index table",
            materials: {
              comparison_table: {
                content: ["Year,Index", "2022,100", "2023,105"]
              }
            }
          }
        ]
      }
    ]
  };
  const html = renderPageHtml(api, page);
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /Index table/i);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
