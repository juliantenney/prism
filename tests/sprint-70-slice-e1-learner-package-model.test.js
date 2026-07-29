/**
 * Sprint 70 E1 — LearnerPackage model and deterministic asset naming.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const lp = require("../lib/learner-package.js");

test("E1: activity-scoped asset filename", () => {
  const name = lp.buildPackageAssetBasename({
    scope: "activity",
    activity_id: "A1",
    visual_slot: "materials-entry",
    mime_type: "image/png"
  });
  assert.equal(name, "activity-a1-materials-entry.png");
});

test("E1: page-scoped asset filename", () => {
  const name = lp.buildPackageAssetBasename({
    scope: "page",
    visual_slot: "knowledge-summary-after-content",
    mime_type: "image/png"
  });
  assert.equal(name, "knowledge-summary-after-content.png");
});

test("E1: page-scoped when activity_id absent", () => {
  const name = lp.buildPackageAssetBasename({
    visual_slot: "Knowledge Summary Concept Map",
    mime_type: "image/jpeg"
  });
  assert.equal(name, "knowledge-summary-concept-map.jpg");
});

test("E1: empty asset list yields empty path assignment", () => {
  assert.deepEqual(lp.assignPackageAssetPaths([]), []);
  assert.deepEqual(lp.assignPackageAssetPaths(null), []);
});

test("E1: deterministic collision handling uses brief suffix", () => {
  const assigned = lp.assignPackageAssetPaths([
    {
      brief_id: "brief-alpha-111",
      scope: "activity",
      activity_id: "a1",
      visual_slot: "process",
      mime_type: "image/png"
    },
    {
      brief_id: "brief-beta-222",
      scope: "activity",
      activity_id: "a1",
      visual_slot: "process",
      mime_type: "image/png"
    }
  ]);
  assert.equal(assigned[0].path, "assets/activity-a1-process.png");
  assert.equal(assigned[1].path, "assets/activity-a1-process-brief-beta-222.png");
  assert.notEqual(assigned[0].path, assigned[1].path);
});

test("E1: replacing image for same brief retains filename", () => {
  const brief = {
    brief_id: "brief-stable-01",
    scope: "activity",
    activity_id: "A2",
    visual_slot: "process",
    mime_type: "image/webp"
  };
  const first = lp.assignPackageAssetPaths([brief]);
  const replaced = lp.assignPackageAssetPaths([
    Object.assign({}, brief, { mime_type: "image/webp", asset_id: "asset-new" })
  ]);
  assert.equal(first[0].path, "assets/activity-a2-process.webp");
  assert.equal(replaced[0].path, first[0].path);
});

test("E1: buildLearnerPackage with empty assets is valid", () => {
  const result = lp.buildLearnerPackage({
    html: "<!doctype html><html><body><p>Hello</p></body></html>",
    visualAssetManifest: { assets: [] },
    pageSlug: "roman-roads",
    builtAt: "2026-07-28T00:00:00.000Z"
  });
  assert.equal(result.ok, true);
  assert.equal(result.package.assets.length, 0);
  assert.match(result.package.html, /Hello/);
  assert.equal(result.package.metadata.asset_count, 0);
  assert.equal(result.package.metadata.html_entry, "learner-page.html");
});

test("E1: zip basename is deterministic", () => {
  assert.equal(
    lp.buildLearnerPackageZipBasename("Roman Roads Page"),
    "roman-roads-page-learner-package.zip"
  );
});
