/**
 * Sprint 26 — synthetic renderer kitchen sink fixture (PB-S-007 smoke only).
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
const fixturePath = "tests/fixtures/page-render/renderer-kitchen-sink-page.json";

test("kitchen sink fixture: parses and declares synthetic renderer stress", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  assert.equal(parsed.artifact_type, "page");
  assert.equal(parsed.source_artefacts && parsed.source_artefacts.synthetic_fixture, true);
  assert.ok(Array.isArray(parsed.sections) && parsed.sections.length >= 8);
});

test("kitchen sink fixture: renders vNext HTML without error", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  const html = renderPageHtml(api, parsed);
  assert.match(html, /PRISM renderer kitchen sink/i);
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /util-learner-renderer-vnext/);
  assert.match(html, /util-learning-header/);
});

test("kitchen sink fixture: activity titles and no object leakage", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  const html = renderPageHtml(api, parsed);
  assert.match(html, /Pattern showcase/i);
  assert.match(html, /Minimal activity row/i);
  assert.match(html, /util-activity/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
