/**
 * Sprint 50 Phase 2 instructional grammar — PB-S-007 smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const marxPath = "tests/fixtures/page-render/marx-self-study-page.json";

test("Sprint 50 Phase 2: Marx fixture parses", () => {
  assert.equal(loadPageFixture(repoRoot, marxPath).artifact_type, "page");
});

test("Sprint 50 Phase 2: Marx fixture renders vNext HTML without error", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, marxPath));
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /Explaining Marx/i);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
