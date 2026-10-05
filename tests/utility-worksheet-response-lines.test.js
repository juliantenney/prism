/**
 * Worksheet response lines — PB-S-007 smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const fixturePath = "tests/fixtures/page-render/ld-inflation-workshop-csv-worksheet-page.json";

test("worksheet response lines: inflation CSV fixture parses", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  assert.equal(parsed.artifact_type, "page");
});

test("worksheet response lines: fixture renders vNext HTML without error", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /Measuring Inflation/i);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
