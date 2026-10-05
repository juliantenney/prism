const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  loadPageFixture,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api, repoRoot } = loadUtilityPageRenderTestApi();

test("visual affordance: climate page renders without error", () => {
  const html = renderPageHtml(
    api,
    loadPageFixture(repoRoot, "tests/fixtures/page-render/ld-climate-misconception-discussion-page.json")
  );
  assert.match(html, /util-page-export--vnext/);
  assert.doesNotMatch(html, /\[object Object\]/i);
});

test("visual affordance: hook renderer stays block-level and hidden", () => {
  const hook = api.utilityRenderVisualAffordanceHookForTest("activity-after-header", {
    subject: "Sample activity",
    activityId: "A1"
  });
  assert.match(hook, /^<div class="util-visual-affordance util-visual-affordance--activity-after-header"/);
  assert.match(hook, /data-visual-slot="activity-after-header"/);
  assert.match(hook, /data-visual-subject="Sample activity"/);
  assert.match(hook, /\shidden\b/);
  assert.match(hook, /aria-hidden="true"/);
  assert.doesNotMatch(hook, /<h[1-5]/);
});
