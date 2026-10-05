/**
 * CSV worksheet table rows — PB-S-007 smoke (CSV helper + render).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();

test("utilityMaterialValueToCsvRowTexts: string rows round-trip", () => {
  const rows = api.utilityMaterialValueToCsvRowTextsForTest(["Year,Index", "2022,100"]);
  assert.equal(rows.join("\n"), "Year,Index\n2022,100");
});

test("csv worksheet fixture: renders vNext export without error", () => {
  const parsed = loadPageFixture(
    repoRoot,
    "tests/fixtures/page-render/ld-inflation-workshop-csv-worksheet-page.json"
  );
  const html = renderPageHtml(api, parsed);
  assert.match(html, /util-page-export--vnext/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
