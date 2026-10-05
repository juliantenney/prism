/**
 * Learner workshop material visibility — PB-S-007 smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const fixturePath = "tests/fixtures/page-render/ld-inflation-workshop-page-full.json";

test("workshop material visibility: full inflation fixture renders", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /util-activity/);
});

test("workshop material visibility: learner body avoids PRISMBLANK tokens", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.doesNotMatch(html, /PRISMBLANK/i);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
