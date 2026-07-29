"use strict";

/**
 * Regression: visual asset attachment must not force composition mode to "beats".
 * The moments renderer is the default and supports visual assets natively.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const renderer = require("../lib/learner-renderer-vnext");

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "educational-psychology-post-s68",
  "repaired-assembled-page.json"
);

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

test("default composition mode is moments, not beats", () => {
  const page = loadFixture();
  const result = renderer.renderLearnerPageHtml(page);
  assert.equal(result.error, null, "render should succeed");
  const html = result.html;
  assert.match(html, /data-composition-mode="moments"/,
    "page must use moments composition by default");
});

test("moments composition with visual assets does not fall back to beats", () => {
  const page = loadFixture();
  const fakeManifest = {
    manifest_version: "1.0",
    schema_version: "38.4",
    assets: [{
      asset_id: "asset-test",
      brief_id: "vb-test",
      job_id: "vj-test",
      affordance_id: "va-test",
      scope: "activity",
      activity_id: page.activities[0].activity_id,
      visual_slot: "materials-entry",
      filename: "test.png",
      mime_type: "image/png",
      byte_size: 1000,
      width: 400,
      height: 300,
      status: "attached",
      render_source: { kind: "data_url", value: "data:image/png;base64,AAAA" },
      alt_text: "Test image"
    }],
    missing_brief_ids: [],
    diagnostics: { briefs_received: 1, assets_attached: 1, assets_missing: 0 }
  };

  const result = renderer.renderLearnerPageHtml(page, {
    visualAssets: fakeManifest
  });
  assert.equal(result.error, null, "render should succeed with visual assets");
  const html = result.html;
  assert.match(html, /data-composition-mode="moments"/,
    "visual assets must not force beats mode");
});

test("explicit beats mode is respected", () => {
  const page = loadFixture();
  const result = renderer.renderLearnerPageHtml(page, {
    compositionMode: "beats"
  });
  assert.equal(result.error, null);
  assert.doesNotMatch(result.html, /data-composition-mode="moments"/);
});

test("beats-fallback-activity-count is zero when all activities compose", () => {
  const page = loadFixture();
  const result = renderer.renderLearnerPageHtml(page);
  assert.equal(result.error, null);
  assert.match(result.html, /data-beats-fallback-activity-count="0"/);
});

test("activities render with data-render-path moments", () => {
  const page = loadFixture();
  const result = renderer.renderLearnerPageHtml(page);
  assert.equal(result.error, null);
  const html = result.html;
  const momentsPaths = (html.match(/data-render-path="moments"/g) || []).length;
  assert.ok(momentsPaths > 0, "at least one activity should use moments render path");
});

test("app.js resolveUtilitiesCompositionModeForRender does not force beats for visual assets", () => {
  const appSource = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
  const fnMatch = appSource.match(
    /function resolveUtilitiesCompositionModeForRender\([\s\S]*?\n  \}/
  );
  assert.ok(fnMatch, "function found in source");
  const fnBody = fnMatch[0];
  assert.ok(
    fnBody.indexOf('return "beats"') === -1,
    "resolveUtilitiesCompositionModeForRender must not contain unconditional return 'beats'"
  );
});
