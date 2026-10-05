/**
 * Self-directed activity framing — PB-S-007 render smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const fixturePath = "tests/fixtures/page-render/self-directed-activity-framing-page.json";

test("self-directed framing fixture: parses", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  assert.equal(parsed.artifact_type, "page");
});

test("self-directed framing fixture: renders vNext HTML without error", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /util-activity/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
