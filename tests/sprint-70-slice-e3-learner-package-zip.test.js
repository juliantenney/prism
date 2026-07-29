/**
 * Sprint 70 E3 — ZIP serializer over LearnerPackage.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
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
const TINY_PNG_DATA_URL =
  "data:image/png;base64," + Buffer.from(TINY_PNG_BYTES).toString("base64");

test("E3: empty-assets package ZIP is valid with learner-page.html", () => {
  const built = lp.buildLearnerPackage({
    html: "<!doctype html><html><body><p>No images</p></body></html>",
    visualAssetManifest: { assets: [] }
  });
  assert.equal(built.ok, true);
  const zipped = zipApi.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true);
  assert.ok(zipped.bytes instanceof Uint8Array);
  assert.ok(zipped.bytes.length > 0);
  const entries = fflate.unzipSync(zipped.bytes);
  assert.ok(entries["learner-page.html"]);
  const html = fflate.strFromU8(entries["learner-page.html"]);
  assert.match(html, /No images/);
  assert.equal(Object.keys(entries).filter((k) => k.startsWith("assets/")).length, 0);
});

test("E3: ZIP contains rewritten HTML and expected asset paths", () => {
  const built = lp.buildLearnerPackage({
    html:
      '<html><body><img src="' +
      TINY_PNG_DATA_URL +
      '" alt="map"></body></html>',
    visualAssetManifest: {
      assets: [
        {
          brief_id: "brief-map",
          scope: "page",
          visual_slot: "knowledge-summary-after-content",
          mime_type: "image/png",
          render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
        }
      ]
    }
  });
  assert.equal(built.ok, true);
  const zipped = zipApi.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true);
  const entries = fflate.unzipSync(zipped.bytes);
  assert.ok(entries["learner-page.html"]);
  assert.ok(entries["assets/knowledge-summary-after-content.png"]);
  const html = fflate.strFromU8(entries["learner-page.html"]);
  assert.match(html, /assets\/knowledge-summary-after-content\.png/);
  assert.doesNotMatch(html, /data:image\/png;base64/);
  assert.doesNotMatch(html, /blob:/i);
  assert.deepEqual(
    Array.from(entries["assets/knowledge-summary-after-content.png"]),
    Array.from(TINY_PNG_BYTES)
  );
});

test("E3: activity asset path is correct in archive", () => {
  const built = lp.buildLearnerPackage({
    html: '<html><body><img src="' + TINY_PNG_DATA_URL + '"></body></html>',
    visualAssetManifest: {
      assets: [
        {
          brief_id: "brief-a1",
          scope: "activity",
          activity_id: "A1",
          visual_slot: "materials-entry",
          mime_type: "image/png",
          render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
        }
      ]
    }
  });
  const zipped = zipApi.serializeLearnerPackageToZip(built.package);
  const entries = fflate.unzipSync(zipped.bytes);
  assert.ok(entries["assets/activity-a1-materials-entry.png"]);
  assert.ok(zipped.entryPaths.includes("learner-page.html"));
  assert.ok(zipped.entryPaths.includes("assets/activity-a1-materials-entry.png"));
});
