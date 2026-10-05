/**
 * Learner journey presentation — PB-S-007 smoke.
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

test("learner journey: RNA fixture renders journey nav shell", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-journey-nav/);
  assert.match(html, /util-page-export--vnext/);
});

test("learner journey: sequential nav and activity titles present", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-journey-sequential/);
  assert.match(html, /util-activity-title/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
