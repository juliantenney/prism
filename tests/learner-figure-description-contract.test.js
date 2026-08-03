"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const figureContract = require("../lib/learner-figure-description-contract.js");
const renderAffordance = require("../lib/learner-renderer-vnext/render-visual-affordance.js");
const visualAssets = require("../lib/prism-visual-assets.js");
const viewer = require("../lib/learner-content-viewer.js");
const sprint38 = require("../lib/sprint38-visual-affordances.js");

const TINY_PNG_DATA_URL =
  "data:image/png;base64," +
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const DETAILED =
  "HCV enters after receptor attachment, internalization, membrane fusion, and RNA release into the cytosol. " +
  "Arrows mark sequence from cell-surface receptors to uncoating; labels name each stage without claiming timing certainty beyond the brief.";

function makeAsset(overrides) {
  return Object.assign(
    {
      asset_id: "asset-brief-hcv-01",
      brief_id: "brief-hcv-01",
      affordance_id: "va-A1-hcv-entry-01",
      visual_slot: "materials-entry",
      alt_text: "HCV entry pathway from receptor attachment to RNA release; detailed description follows.",
      detailed_description: DETAILED,
      render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
    },
    overrides || {}
  );
}

test("1. substantive figure renders concise alt and detailed description", () => {
  const html = renderAffordance.renderVisualAffordanceFigure(
    makeAsset(),
    { slot: "materials-entry", subject: "HCV entry", affordanceId: "va-A1-hcv-entry-01" },
    { figureCounter: { value: 0 } }
  );
  assert.match(html, /<figure[\s\S]*<\/figure>/);
  assert.match(
    html,
    /alt="HCV entry pathway from receptor attachment to RNA release; detailed description follows\."/
  );
  assert.match(html, /<strong>Figure 1\.<\/strong>/);
  assert.match(html, /HCV enters after receptor attachment/);
  assert.doesNotMatch(html, /<h[4-6]\b/i);
});

test("2. deterministic Figure 1 / Figure 2 numbering in document order", () => {
  const counter = { value: 0 };
  const opts = { figureCounter: counter };
  const first = renderAffordance.renderVisualAffordanceFigure(
    makeAsset({ asset_id: "asset-a", brief_id: "brief-a" }),
    { slot: "materials-entry", affordanceId: "va-a" },
    opts
  );
  const second = renderAffordance.renderVisualAffordanceFigure(
    makeAsset({
      asset_id: "asset-b",
      brief_id: "brief-b",
      alt_text: "Second figure; detailed description follows.",
      detailed_description: "Second instructional description of labelled stages."
    }),
    { slot: "knowledge-summary-after-content", affordanceId: "va-b" },
    opts
  );
  assert.match(first, /data-figure-number="1"/);
  assert.match(first, /<strong>Figure 1\.<\/strong>/);
  assert.match(second, /data-figure-number="2"/);
  assert.match(second, /<strong>Figure 2\.<\/strong>/);
  assert.equal(counter.value, 2);
});

test("3. aria-describedby points to visible figcaption id", () => {
  const html = renderAffordance.renderVisualAffordanceFigure(
    makeAsset(),
    { slot: "materials-entry", affordanceId: "va-A1-hcv-entry-01" },
    { figureCounter: { value: 0 } }
  );
  const describedBy = html.match(/aria-describedby="([^"]+)"/);
  assert.ok(describedBy, "aria-describedby required");
  const id = describedBy[1];
  assert.match(html, new RegExp('<figcaption[^>]+id="' + id + '"'));
  assert.match(html, /id="figure-description-asset-brief-hcv-01"/);
});

test("4. generated Figure n. is not duplicated inside description body", () => {
  const html = renderAffordance.renderVisualAffordanceFigure(
    makeAsset({
      detailed_description: "Figure 1. Should strip leading generated label from body copy."
    }),
    { slot: "materials-entry", affordanceId: "va-x" },
    { figureCounter: { value: 0 } }
  );
  assert.equal((html.match(/Figure 1\./g) || []).length, 1);
  assert.match(html, /Should strip leading generated label/);
});

test("5. alt-text length contract clips at word boundary", () => {
  const long =
    "HCV entry pathway overview covering receptor attachment internalization membrane fusion uncoating and cytosolic RNA release with instructional purpose noted for learners who need the accessible summary";
  assert.ok(long.length > figureContract.ALT_TEXT_MAX_CHARS);
  const clipped = figureContract.buildConciseAltText({ alt_text: long });
  assert.ok(clipped.length <= figureContract.ALT_TEXT_MAX_CHARS + 1);
  assert.ok(clipped.endsWith("…"));
  const beforeEllipsis = clipped.slice(0, -1);
  assert.ok(/\s/.test(long.slice(0, figureContract.ALT_TEXT_MAX_CHARS)));
  assert.doesNotMatch(beforeEllipsis, /[A-Za-z]{18,}$/);
});

test("6. description length/quality guidance soft-warns for rich specs", () => {
  const diagnosed = figureContract.diagnoseFigureDescriptionQuality(
    {
      alt_text: "Short alt; detailed description follows.",
      detailed_description: "Too short for three must-show items.",
      must_show: ["a", "b", "c"]
    },
    { substantive: true }
  );
  assert.equal(
    diagnosed.diagnostics.some((d) => d.code === "FIGURE_DESCRIPTION_SHORT_FOR_RICH_SPEC"),
    true
  );
  const promptLike = figureContract.diagnoseFigureDescriptionQuality(
    {
      alt_text: "Alt; detailed description follows.",
      detailed_description: "Photorealistic cinematic camera render of the pathway on a white background."
    },
    { substantive: true }
  );
  assert.equal(
    promptLike.diagnostics.some((d) => d.code === "FIGURE_DESCRIPTION_LOOKS_LIKE_PROMPT"),
    true
  );
});

test("7. existing figure without detailed_description remains renderable", () => {
  const warnings = [];
  const html = renderAffordance.renderVisualAffordanceFigure(
    {
      asset_id: "asset-legacy",
      alt_text: "Legacy road map",
      learner_caption: "Road links across the empire",
      render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
    },
    { slot: "materials-entry", subject: "Roads" },
    {
      figureCounter: { value: 0 },
      registerVisualAssetWarning: function (w) {
        warnings.push(w);
      }
    }
  );
  assert.match(html, /<figure/);
  assert.match(html, /alt="Legacy road map"/);
  assert.match(html, /Road links across the empire/);
  assert.match(html, /<strong>Figure 1\.<\/strong>/);
  assert.equal(
    warnings.some((w) => w.code === "FIGURE_DETAILED_DESCRIPTION_MISSING"),
    true
  );
});

test("8. decorative hooks and UI-only paths are not numbered as figures", () => {
  const counter = { value: 0 };
  const hookOnly = renderAffordance.renderVisualAffordanceHook(
    { slot: "materials-entry", subject: "Unused", affordanceId: "va-skip" },
    { figureCounter: counter }
  );
  assert.match(hookOnly, /util-visual-affordance/);
  assert.doesNotMatch(hookOnly, /<figure/);
  assert.doesNotMatch(hookOnly, /Figure 1/);
  assert.equal(counter.value, 0);

  // Explicit empty-alt decorative treatment is out of this figure path; ensure we do not invent numbering for unresolved hooks.
});

test("9. print / no-JS retain figcaption description in static HTML", () => {
  const html = renderAffordance.renderVisualAffordanceFigure(
    makeAsset(),
    { slot: "materials-entry", affordanceId: "va-A1-hcv-entry-01" },
    { figureCounter: { value: 0 } }
  );
  assert.match(html, /<figcaption[\s\S]*HCV enters after receptor attachment/);
  assert.doesNotMatch(html, /<figcaption[^>]*hidden/);
  assert.doesNotMatch(html, /figcaption[^>]*aria-hidden="true"/);
});

test("10. responsive enlargement control remains intact", () => {
  const html = renderAffordance.renderVisualAffordanceFigure(
    makeAsset(),
    { slot: "materials-entry", affordanceId: "va-A1" },
    { figureCounter: { value: 0 } }
  );
  assert.match(html, /util-visual-asset--expandable/);
  assert.match(html, /util-learner-content-expand/);
  assert.match(html, /aria-label="View image larger"/);
  const enhanced = viewer.enhanceStandaloneLearnerHtml(
    "<!doctype html><html><body>" + html + "</body></html>"
  );
  assert.match(enhanced, /id="prism-learner-content-viewer"/);
  assert.match(enhanced, /util-learner-content-viewer__caption/);
});

test("11. no h4–h6 headings are introduced by figure markup", () => {
  const html = renderAffordance.renderVisualAffordanceFigure(
    makeAsset(),
    { slot: "materials-entry", affordanceId: "va-A1" },
    { figureCounter: { value: 0 } }
  );
  assert.doesNotMatch(html, /<h[4-6]\b/i);
});

test("12. standalone export preserves complete figure structure", () => {
  const html = renderAffordance.renderVisualAffordanceFigure(
    makeAsset(),
    { slot: "materials-entry", affordanceId: "va-A1-hcv-entry-01" },
    { figureCounter: { value: 0 } }
  );
  const standalone = viewer.enhanceStandaloneLearnerHtml(
    "<!doctype html><html><body>" + html + "</body></html>"
  );
  assert.match(standalone, /<figure class="util-visual-asset/);
  assert.match(standalone, /aria-describedby="figure-description-asset-brief-hcv-01"/);
  assert.match(standalone, /id="figure-description-asset-brief-hcv-01"/);
  assert.match(standalone, /<strong>Figure 1\.<\/strong>/);
  assert.match(standalone, /HCV enters after receptor attachment/);
  assert.match(standalone, /loading="lazy"/);
  assert.match(standalone, /decoding="async"/);
});

test("asset association copies authored alt_text and detailed_description", () => {
  const created = visualAssets.createVisualAssetAssociation(
    {
      brief_id: "brief-hcv-01",
      job_id: "job-hcv-01",
      affordance_id: "va-A1-hcv-entry-01",
      visual_slot: "materials-entry",
      subject: "HCV entry pathway",
      preferred_representation: "process",
      alt_text: "HCV entry pathway from receptor attachment to RNA release; detailed description follows.",
      detailed_description: DETAILED
    },
    {
      filename: "hcv.png",
      mime_type: "image/png",
      byte_size: 68,
      width: 1,
      height: 1,
      render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
    },
    { intakeMethod: "file_picker" }
  );
  assert.equal(created.ok, true);
  assert.equal(created.asset.detailed_description, DETAILED);
  assert.ok(created.asset.alt_text.length <= figureContract.ALT_TEXT_MAX_CHARS);
  assert.match(created.asset.alt_text, /detailed description follows/i);
});

test("sprint38 soft-warns when generate row lacks detailed_description", () => {
  const warnings = sprint38.collectGenerateFigureDescriptionWarnings(
    {
      visual_decision: "generate",
      affordance_id: "va-A1",
      alt_text: "Short alt; detailed description follows.",
      caption_intent: "Caption"
    },
    0
  );
  assert.equal(
    warnings.some((w) => w.code === "FIGURE_DETAILED_DESCRIPTION_MISSING"),
    true
  );
});

test("page-order hook rendering numbers multiple packaged assets", () => {
  const counter = { value: 0 };
  const assets = {
    "va-A1-one": makeAsset({
      asset_id: "asset-one",
      brief_id: "brief-one",
      affordance_id: "va-A1-one",
      detailed_description: "First figure describes labelled stage relationships."
    }),
    "va-A1-two": makeAsset({
      asset_id: "asset-two",
      brief_id: "brief-two",
      affordance_id: "va-A1-two",
      alt_text: "Second instructional figure; detailed description follows.",
      detailed_description: "Second figure describes the next substantive instructional visual."
    })
  };
  const opts = {
    figureCounter: counter,
    resolveVisualAsset: function (hook) {
      return assets[hook.affordanceId] || null;
    }
  };
  const first = renderAffordance.renderVisualAffordanceHook(
    { slot: "materials-entry", activityId: "A1", affordanceId: "va-A1-one", subject: "One" },
    opts
  );
  const second = renderAffordance.renderVisualAffordanceHook(
    {
      slot: "knowledge-summary-after-content",
      affordanceId: "va-A1-two",
      subject: "Two"
    },
    opts
  );
  assert.match(first, /data-figure-number="1"/);
  assert.match(second, /data-figure-number="2"/);
  assert.match(first, /<strong>Figure 1\.<\/strong>/);
  assert.match(second, /<strong>Figure 2\.<\/strong>/);
  assert.equal(counter.value, 2);
});

test("browser bundle source includes figure description wiring after rebuild expectation", () => {
  // Soft presence check of source module; bundle rebuild is exercised separately.
  const src = fs.readFileSync(
    path.join(__dirname, "..", "lib", "learner-renderer-vnext", "render-visual-affordance.js"),
    "utf8"
  );
  assert.match(src, /aria-describedby/);
  assert.match(src, /detailed_description/);
  assert.match(src, /Figure /);
});
