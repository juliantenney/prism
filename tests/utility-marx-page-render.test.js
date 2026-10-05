/**
 * Marx self-study page — PB-S-007 render smoke (historical HTML asserts removed).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();
const fixturePath = "tests/fixtures/page-render/marx-self-study-page.json";

test("marx self-study fixture: parses", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  assert.equal(parsed.artifact_type, "page");
  assert.ok(Array.isArray(parsed.sections) && parsed.sections.length >= 1);
});

test("marx self-study fixture: renders vNext learner page without error", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  const html = renderPageHtml(api, parsed);
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /util-learner-renderer-vnext/);
  assert.match(html, /Explaining Marx/i);
});

test("marx self-study fixture: knowledge summary and activity content present", () => {
  const parsed = loadPageFixture(repoRoot, fixturePath);
  const html = renderPageHtml(api, parsed);
  assert.match(html, /util-knowledge-summary/);
  assert.match(html, /Karl Marx/);
  assert.match(html, /util-activity/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
