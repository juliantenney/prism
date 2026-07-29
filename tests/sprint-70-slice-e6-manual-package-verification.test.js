/**
 * Sprint 70 E6 — automated package verification covering replace/remove/empty/offline refs.
 * Complements manual UI checklist; does not mutate fixtures on disk.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const fflate = require("fflate");

const lp = require("../lib/learner-package.js");
const zipApi = require("../lib/learner-package-zip.js");

const TINY_PNG_BYTES = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x05, 0xfe, 0xd4, 0xef, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
  0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
]);

function dataUrlFrom(bytes) {
  return "data:image/png;base64," + Buffer.from(bytes).toString("base64");
}

const DATA_A = dataUrlFrom(TINY_PNG_BYTES);
const DATA_B = dataUrlFrom(Uint8Array.from([...TINY_PNG_BYTES, 0x11, 0x22]));

test("E6: multi-asset package extracts offline with relative paths only", () => {
  const activity = {
    brief_id: "brief-activity",
    scope: "activity",
    activity_id: "A1",
    visual_slot: "materials-entry",
    mime_type: "image/png",
    render_source: { kind: "data_url", value: DATA_A }
  };
  const pageAsset = {
    brief_id: "brief-page",
    scope: "page",
    visual_slot: "knowledge-summary-after-content",
    mime_type: "image/png",
    render_source: { kind: "data_url", value: DATA_B }
  };
  const html =
    "<!doctype html><html><body>" +
    '<img src="' +
    DATA_A +
    '" alt="activity">' +
    '<img src="' +
    DATA_B +
    '" alt="summary">' +
    "</body></html>";

  const manifestSnapshot = JSON.stringify({ assets: [activity, pageAsset] });
  const built = lp.buildLearnerPackage({
    html,
    visualAssetManifest: JSON.parse(manifestSnapshot),
    pageSlug: "roman-roads"
  });
  assert.equal(built.ok, true);
  assert.equal(JSON.stringify({ assets: [activity, pageAsset] }), manifestSnapshot);

  const zipped = zipApi.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "prism-learner-pkg-"));
  try {
    const zipPath = path.join(tmpDir, "roman-roads-learner-package.zip");
    fs.writeFileSync(zipPath, zipped.bytes);
    const entries = fflate.unzipSync(fs.readFileSync(zipPath));
    assert.ok(entries["learner-page.html"]);
    assert.ok(entries["assets/activity-a1-materials-entry.png"]);
    assert.ok(entries["assets/knowledge-summary-after-content.png"]);

    const packagedHtml = fflate.strFromU8(entries["learner-page.html"]);
    assert.match(packagedHtml, /assets\/activity-a1-materials-entry\.png/);
    assert.match(packagedHtml, /assets\/knowledge-summary-after-content\.png/);
    assert.doesNotMatch(packagedHtml, /blob:/i);
    assert.doesNotMatch(packagedHtml, /data:image\/png;base64/);

    fs.writeFileSync(path.join(tmpDir, "learner-page.html"), packagedHtml);
    fs.mkdirSync(path.join(tmpDir, "assets"));
    fs.writeFileSync(
      path.join(tmpDir, "assets", "activity-a1-materials-entry.png"),
      entries["assets/activity-a1-materials-entry.png"]
    );
    fs.writeFileSync(
      path.join(tmpDir, "assets", "knowledge-summary-after-content.png"),
      entries["assets/knowledge-summary-after-content.png"]
    );
    const offlineHtml = fs.readFileSync(path.join(tmpDir, "learner-page.html"), "utf8");
    assert.match(offlineHtml, /src="assets\/activity-a1-materials-entry\.png"/);
    assert.ok(fs.existsSync(path.join(tmpDir, "assets", "activity-a1-materials-entry.png")));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("E6: replace keeps path; remove drops file and HTML reference", () => {
  const brief = {
    brief_id: "brief-stable",
    scope: "activity",
    activity_id: "a2",
    visual_slot: "process",
    mime_type: "image/png"
  };
  const first = lp.buildLearnerPackage({
    html: '<html><img src="' + DATA_A + '"></html>',
    visualAssetManifest: {
      assets: [Object.assign({}, brief, { render_source: { kind: "data_url", value: DATA_A } })]
    }
  });
  const replaced = lp.buildLearnerPackage({
    html: '<html><img src="' + DATA_B + '"></html>',
    visualAssetManifest: {
      assets: [Object.assign({}, brief, { render_source: { kind: "data_url", value: DATA_B } })]
    }
  });
  assert.equal(first.package.assets[0].path, "assets/activity-a2-process.png");
  assert.equal(replaced.package.assets[0].path, first.package.assets[0].path);
  assert.notDeepEqual(
    Array.from(first.package.assets[0].bytes),
    Array.from(replaced.package.assets[0].bytes)
  );

  const removed = lp.buildLearnerPackage({
    html: "<html><body><p>gone</p></body></html>",
    visualAssetManifest: { assets: [] }
  });
  assert.equal(removed.package.assets.length, 0);
  assert.doesNotMatch(removed.package.html, /activity-a2-process/);
});

test("E6: empty image package remains a valid ZIP", () => {
  const built = lp.buildLearnerPackage({
    html: "<!doctype html><html><body><p>text only</p></body></html>",
    visualAssetManifest: { assets: [] }
  });
  const zipped = zipApi.serializeLearnerPackageToZip(built.package);
  const entries = fflate.unzipSync(zipped.bytes);
  assert.deepEqual(Object.keys(entries).sort(), ["learner-page.html"]);
});
