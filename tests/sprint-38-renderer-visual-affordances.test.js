/**
 * Sprint 38 visual affordances — PB-S-007 smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const repoRoot = path.resolve(__dirname, "..");
const s38LibPath = path.join(repoRoot, "lib", "sprint38-visual-affordances.js");

const { api } = loadUtilityPageRenderTestApi({
  repoRoot,
  preloadVmScript: s38LibPath
});

test("Sprint 38: climate fixture renders without error", () => {
  const html = renderPageHtml(
    api,
    loadPageFixture(repoRoot, "tests/fixtures/page-render/ld-climate-misconception-discussion-page.json")
  );
  assert.match(html, /util-page-export--vnext/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});

test("Sprint 38: visual affordance hook API returns hidden block element", () => {
  const hook = api.utilityRenderVisualAffordanceHookForTest("activity-after-header", {
    subject: "Sample",
    activityId: "A1"
  });
  assert.match(hook, /util-visual-affordance/);
  assert.match(hook, /\shidden\b/);
});
