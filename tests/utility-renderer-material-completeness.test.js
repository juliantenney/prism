/**
 * Material completeness — PB-S-007 RNA vNext fixture smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const fixturePath = "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json";

test("RNA vNext materials fixture: parses with activities", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  assert.ok(Array.isArray(parsed.activities) && parsed.activities.length >= 1);
});

test("RNA vNext materials fixture: renders without error", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /util-activity/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
