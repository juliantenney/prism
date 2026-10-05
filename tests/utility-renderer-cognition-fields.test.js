/**
 * Cognition field renderer — PB-S-007 smoke (kitchen sink fixture).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const fixturePath = "tests/fixtures/page-render/renderer-kitchen-sink-page.json";

test("cognition fields: kitchen sink fixture renders without error", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /Renderer stabilisation edge cases|PEL reasoning field showcase/i);
});

test("cognition fields: beat stream present in vNext export", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-beat-section|util-beat-stream/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
