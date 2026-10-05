/**
 * Inflation workshop page — PB-S-007 render smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const fullPath = "tests/fixtures/page-render/ld-inflation-workshop-page-full.json";
const reducedPath = "tests/fixtures/page-render/ld-inflation-workshop-page.json";

test("inflation full fixture: parses with learning_activities section", () => {
  const parsed = loadPageFixture(repoRoot, fullPath);
  assert.equal(parsed.artifact_type, "page");
  const la = (parsed.sections || []).find((s) => s.section_id === "learning_activities");
  assert.ok(la && Array.isArray(la.content) && la.content.length >= 3);
});

test("inflation full fixture: renders vNext HTML without error", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fullPath));
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /Inflation|inflation/i);
  assert.doesNotMatch(html, /PRISMBLANK/i);
});

test("inflation reduced fixture: renders without error", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, reducedPath));
  assert.match(html, /util-learner-renderer-vnext/);
  assert.match(html, /util-activity/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
