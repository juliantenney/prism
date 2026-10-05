/**
 * LD assessment visibility — PB-S-007 smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const fixturePath = "tests/fixtures/page-render/ld-rna-hcv-assessment-page.json";

test("assessment visibility: RNA fixture renders without error", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /Assessment|assessment/);
});

test("assessment visibility: no inline correct-answer leakage smoke", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.doesNotMatch(html, /Correct answer:\s*True/i);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
