/**
 * Beat-first activity render — PB-S-007 smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const fixturePath = "tests/fixtures/page-render/marx-beat-render-page.json";

test("beat-first: Marx beat-render fixture parses", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  assert.equal(parsed.artifact_type, "page");
});

test("beat-first: fixture renders beat sections in vNext export", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-beat-section|util-beat-stream/);
  assert.match(html, /util-page-export--vnext/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
