/**
 * Sprint 55 typography foundation — PB-S-007 smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();

test("Sprint 55: Marx beat-render fixture exports vNext typography tokens", () => {
  const html = renderPageHtml(
    api,
    loadPageFixture(repoRoot, "tests/fixtures/page-render/marx-beat-render-page.json")
  );
  assert.match(html, /--learner-text-base/);
  assert.match(html, /util-page-export--vnext/);
});

test("Sprint 55: Marx self-study fixture renders without error", () => {
  const html = renderPageHtml(
    api,
    loadPageFixture(repoRoot, "tests/fixtures/page-render/marx-self-study-page.json")
  );
  assert.match(html, /util-learner-renderer-vnext/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
