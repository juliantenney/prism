/**
 * Climate misconception discussion page — PB-S-007 render smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const fixturePath = "tests/fixtures/page-render/ld-climate-misconception-discussion-page.json";

test("climate misconception fixture: parses", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  assert.equal(parsed.artifact_type, "page");
});

test("climate misconception fixture: renders without error", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  const html = renderPageHtml(api, parsed);
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /Cold winters disprove global warming/i);
  assert.match(html, /Climate models are unreliable/i);
});

test("climate misconception fixture: learning activities use vNext activity shell", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-activity/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
