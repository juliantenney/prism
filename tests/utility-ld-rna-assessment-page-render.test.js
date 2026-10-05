/**
 * RNA/HCV assessment page — PB-S-007 render smoke.
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

test("RNA/HCV fixture: parses", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  assert.equal(parsed.artifact_type, "page");
});

test("RNA/HCV fixture: renders vNext HTML without error", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  const html = renderPageHtml(api, parsed);
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /util-learner-renderer-vnext/);
});

test("RNA/HCV fixture: assessment-related learner copy survives export", () => {
  const html = renderPageHtml(api, loadPageFixture(repoRoot, fixturePath));
  assert.match(html, /util-assessment-section|Assessment/i);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
