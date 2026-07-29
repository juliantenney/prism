const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const viewer = require("../lib/learner-content-viewer.js");
const lp = require("../lib/learner-package.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const renderAffordance = require("../lib/learner-renderer-vnext/render-visual-affordance.js");
const repoRoot = path.resolve(__dirname, "..");
const indexHtmlPath = path.join(repoRoot, "index.html");

const TINY_PNG_DATA_URL =
  "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function countMatches(text, pattern) {
  const m = String(text || "").match(pattern);
  return m ? m.length : 0;
}

test("expand icon is rendered for resolved visual image figure", () => {
  const html = renderAffordance.renderVisualAffordanceFigure(
    {
      render_source: { kind: "data_url", value: TINY_PNG_DATA_URL },
      alt_text: "Road map",
      learner_caption: "Road links"
    },
    { slot: "materials-entry", subject: "Roman roads" }
  );
  assert.match(html, /class="util-learner-content-expand"/);
  assert.match(html, /aria-label="View image larger"/);
  assert.match(html, /title="View image larger"/);
  assert.match(html, /<svg[^>]+aria-hidden="true"[^>]+focusable="false"/);
});

test("no expand icon is emitted when no image source resolves", () => {
  const noImage = renderAffordance.renderVisualAffordanceHook(
    { slot: "materials-entry", subject: "Roman roads", activityId: "A1", affordanceId: "va-a1" },
    { resolveVisualAsset: () => ({ render_source: { kind: "data_url", value: "" } }) }
  );
  assert.doesNotMatch(noImage, /util-learner-content-expand/);
  assert.doesNotMatch(noImage, /<figure/);
});

test("viewer enhancer injects one shared dialog and is idempotent", () => {
  const base =
    '<!doctype html><html><body><figure class="util-visual-asset"><button class="util-learner-content-expand"></button></figure></body></html>';
  const once = viewer.enhanceStandaloneLearnerHtml(base);
  const twice = viewer.enhanceStandaloneLearnerHtml(once);
  assert.equal(countMatches(once, /id="prism-learner-content-viewer"/g), 1);
  assert.equal(countMatches(twice, /id="prism-learner-content-viewer"/g), 1);
  assert.match(once, /showModal\(\)/);
  assert.match(once, /dialog\.close\(\)/);
  assert.match(once, /ev\.key==='Escape'/);
  assert.match(once, /lastOpener/);
  assert.match(once, /opener\.focus\(\)/);
});

test("viewer enhancer preserves inline image src for data/blob/remote URLs", () => {
  const urls = [
    TINY_PNG_DATA_URL,
    "blob:http://localhost/demo-object-url",
    "https://example.com/roman-roads.png"
  ];
  urls.forEach((src) => {
    const html =
      '<!doctype html><html><body><figure class="util-visual-asset">' +
      '<img class="util-visual-asset-image" data-stable="1" src="' +
      src +
      '" alt="Roman roads" loading="lazy" decoding="async">' +
      '<button class="util-learner-content-expand" type="button"></button>' +
      "</figure></body></html>";
    const enhanced = viewer.enhanceStandaloneLearnerHtml(html);
    assert.match(enhanced, new RegExp('src="' + src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"'));
    assert.match(enhanced, /data-stable="1"/);
    assert.match(enhanced, /loading="lazy"/);
    assert.match(enhanced, /decoding="async"/);
  });
});

test("viewer enhancer keeps multiple figure image sources distinct", () => {
  const html =
    '<!doctype html><html><body>' +
    '<figure class="util-visual-asset"><img class="util-visual-asset-image" src="' +
    TINY_PNG_DATA_URL +
    '" alt="a"><button class="util-learner-content-expand" type="button"></button></figure>' +
    '<figure class="util-visual-asset"><img class="util-visual-asset-image" src="https://example.com/b.png" alt="b"><button class="util-learner-content-expand" type="button"></button></figure>' +
    "</body></html>";
  const enhanced = viewer.enhanceStandaloneLearnerHtml(html);
  assert.equal(countMatches(enhanced, /class="util-visual-asset-image"/g), 2);
  assert.equal(countMatches(enhanced, /src="data:image\/png;base64,/g), 1);
  assert.equal(countMatches(enhanced, /src="https:\/\/example\.com\/b\.png"/g), 1);
});

test("preview iframe sandbox allows trusted learner-page scripts", () => {
  const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
  assert.match(indexHtml, /sandbox="allow-same-origin allow-scripts"/);
});

test("shared viewer dialog stays unique with multiple expandable figures", () => {
  const page = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "tests", "fixtures", "page-assemble", "roman-roads-visual-jobs-valid.json"),
      "utf8"
    )
  );
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const briefs = ws.compilerResult.briefs.slice(0, 2);
  const figures = [];
  briefs.forEach((brief, idx) => {
    const attached = workspace.attachVisualAssetToWorkspace(
      ws,
      brief.brief_id,
      {
        filename: "img-" + String(idx + 1) + ".png",
        mime_type: "image/png",
        byte_size: 68,
        width: 1,
        height: 1,
        render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
      },
      { intakeMethod: "file_picker" }
    );
    assert.equal(attached.ok, true);
    const html = renderAffordance.renderVisualAffordanceFigure(attached.asset, {
      slot: brief.visual_slot,
      subject: brief.subject
    });
    figures.push(html);
  });
  const enhanced = viewer.enhanceStandaloneLearnerHtml(
    "<!doctype html><html><body>" + figures.join("") + "</body></html>"
  );
  assert.ok(countMatches(enhanced, /class="util-learner-content-expand"/g) >= 2);
  assert.equal(countMatches(enhanced, /id="prism-learner-content-viewer"/g), 1);
  assert.equal(countMatches(enhanced, /id="prism-learner-content-viewer-title"/g), 1);
  assert.match(enhanced, /class="util-learner-content-viewer__caption"/);
});

test("learner package rewrite keeps dialog + rewrites relative image paths", () => {
  const html =
    '<!doctype html><html><body>' +
    '<figure class="util-visual-asset" data-learner-content-kind="image">' +
    '<div class="util-visual-asset-media">' +
    '<img class="util-visual-asset-image" alt="Road map" src="' +
    TINY_PNG_DATA_URL +
    '">' +
    '<button type="button" class="util-learner-content-expand" aria-label="View image larger" title="View image larger"></button>' +
    "</div><figcaption class=\"util-visual-asset-caption\">Road links</figcaption></figure>" +
    "</body></html>";
  const enhanced = viewer.enhanceStandaloneLearnerHtml(html);
  const built = lp.buildLearnerPackage({
    html: enhanced,
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
  assert.equal(built.ok, true);
  assert.match(built.package.html, /src="assets\/activity-a1-materials-entry\.png"/);
  assert.match(built.package.html, /class="util-learner-content-expand"/);
  assert.equal(countMatches(built.package.html, /id="prism-learner-content-viewer"/g), 1);
  assert.doesNotMatch(built.package.html, /blob:/i);
});
