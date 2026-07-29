/**
 * Sprint 70 E2 — Data URL decoding and HTML rewriting.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const lp = require("../lib/learner-package.js");

function pngDataUrlFromBytes(bytes) {
  const b64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(bytes).toString("base64")
      : "";
  return "data:image/png;base64," + b64;
}

const TINY_PNG_BYTES = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x05, 0xfe, 0xd4, 0xef, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
  0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
]);

const TINY_PNG_DATA_URL = pngDataUrlFromBytes(TINY_PNG_BYTES);

test("E2: MIME and extension inference", () => {
  assert.equal(lp.inferExtensionFromMime("image/png"), "png");
  assert.equal(lp.inferExtensionFromMime("image/jpeg"), "jpg");
  assert.equal(lp.inferExtensionFromMime("image/webp"), "webp");
});

test("E2: byte round-trip for PNG data URL", () => {
  const decoded = lp.decodeImageDataUrl(TINY_PNG_DATA_URL);
  assert.equal(decoded.ok, true);
  assert.equal(decoded.mime, "image/png");
  assert.equal(decoded.bytes.length, TINY_PNG_BYTES.length);
  assert.deepEqual(Array.from(decoded.bytes), Array.from(TINY_PNG_BYTES));
});

test("E2: relative path rewriting replaces exact sources", () => {
  const html =
    '<!doctype html><html><body><img src="' +
    TINY_PNG_DATA_URL +
    '" alt="x"></body></html>';
  const rewritten = lp.rewriteHtmlImageSources(html, {
    [TINY_PNG_DATA_URL]: "assets/activity-a1-materials-entry.png"
  });
  assert.match(rewritten, /src="assets\/activity-a1-materials-entry\.png"/);
  assert.doesNotMatch(rewritten, /data:image\/png;base64/);
});

test("E2: buildLearnerPackage rewrites and leaves no packaged data URLs", () => {
  const html =
    '<html><body><img class="util-visual-asset-image" src="' +
    TINY_PNG_DATA_URL +
    '"></body></html>';
  const result = lp.buildLearnerPackage({
    html,
    visualAssetManifest: {
      assets: [
        {
          brief_id: "b1",
          scope: "activity",
          activity_id: "a1",
          visual_slot: "materials-entry",
          mime_type: "image/png",
          render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
        }
      ]
    },
    builtAt: "2026-07-28T00:00:00.000Z"
  });
  assert.equal(result.ok, true);
  assert.equal(result.package.assets.length, 1);
  assert.equal(result.package.assets[0].path, "assets/activity-a1-materials-entry.png");
  assert.match(result.package.html, /assets\/activity-a1-materials-entry\.png/);
  assert.doesNotMatch(result.package.html, /data:image\/png;base64/);
  assert.doesNotMatch(result.package.html, /blob:/i);
});

test("E2: no blob URLs accepted as package source", () => {
  const decoded = lp.decodeImageDataUrl("blob:http://localhost/abc");
  assert.equal(decoded.ok, false);
  assert.equal(decoded.code, "blob_url");
});

test("E2: corrupt data URL is omitted without dangling links", () => {
  const html =
    '<html><body><img src="data:image/png;base64,@@@not-valid@@@"></body></html>';
  const result = lp.buildLearnerPackage({
    html,
    visualAssetManifest: {
      assets: [
        {
          brief_id: "corrupt-1",
          scope: "activity",
          activity_id: "a1",
          visual_slot: "process",
          mime_type: "image/png",
          render_source: {
            kind: "data_url",
            value: "data:image/png;base64,@@@not-valid@@@"
          }
        }
      ]
    }
  });
  assert.equal(result.ok, true);
  assert.equal(result.package.assets.length, 0);
  assert.ok(result.warnings.length >= 1);
  assert.doesNotMatch(result.package.html, /assets\/activity-a1-process/);
  // Original (undecodable) data URL may remain; no relative dangling path.
  assert.match(result.package.html, /data:image\/png;base64/);
});

test("E2: blob URLs in HTML fail closed", () => {
  const result = lp.buildLearnerPackage({
    html: '<html><body><img src="blob:http://localhost/x"></body></html>',
    visualAssetManifest: { assets: [] }
  });
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "blob_urls_present");
});

test("E2: missing data_url kind is omitted with warning", () => {
  const result = lp.buildLearnerPackage({
    html: "<html><body><p>ok</p></body></html>",
    visualAssetManifest: {
      assets: [
        {
          brief_id: "b-obj",
          scope: "page",
          visual_slot: "knowledge-summary-after-content",
          mime_type: "image/png",
          render_source: { kind: "object_url", value: "blob:x" }
        }
      ]
    }
  });
  assert.equal(result.ok, true);
  assert.equal(result.package.assets.length, 0);
  assert.ok(result.warnings.some((w) => w.code === "missing_data_url"));
});
