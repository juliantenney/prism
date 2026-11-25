"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const visualAssets = require(path.join(repoRoot, "lib", "prism-visual-assets.js"));
const workspace = require(path.join(repoRoot, "lib", "utilities-visual-jobs-workspace.js"));

test("extractSvgMarkupFromClipboardText extracts standalone SVG from plain text or HTML clipboard payloads", () => {
  const sampleSvg =
    '<svg viewBox="0 0 800 220" width="100%"><line x1="40" y1="110" x2="760" y2="110" stroke="#1e293b"/></svg>';
  assert.equal(visualAssets.extractSvgMarkupFromClipboardText(sampleSvg), sampleSvg);
  assert.equal(
    visualAssets.extractSvgMarkupFromClipboardText("<div>" + sampleSvg + "</div>"),
    sampleSvg
  );
  assert.equal(visualAssets.extractSvgMarkupFromClipboardText("plain text only"), null);
});

test("validateAndNormalizeSvgForRasterization normalizes viewBox/xmlns/dimensions and computes crisp 2x PNG canvas size", () => {
  const pearsonScaleSvg =
    '<svg viewBox="0 0 800 220" width="100%"><line x1="60" y1="110" x2="740" y2="110" stroke="#1e293b" stroke-width="2"/><polygon points="716,102 724,110 716,118 708,110" fill="#1f4e79"/></svg>';
  const res = visualAssets.validateAndNormalizeSvgForRasterization(pearsonScaleSvg);
  assert.equal(res.ok, true);
  assert.equal(res.width, 800);
  assert.equal(res.height, 220);
  assert.equal(res.targetWidth, 1600);
  assert.equal(res.targetHeight, 440);
  assert.match(res.svgMarkup, /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(res.svgMarkup, /\bwidth="800"/);
  assert.match(res.svgMarkup, /\bheight="220"/);
});

test("validateAndNormalizeSvgForRasterization fails closed on active or external SVG content", () => {
  const unsafeCases = [
    '<svg viewBox="0 0 100 100"><script>alert(1)</script></svg>',
    '<svg viewBox="0 0 100 100" onload="alert(1)"><rect width="10" height="10"/></svg>',
    '<svg viewBox="0 0 100 100"><a href="javascript:alert(1)"><rect width="10" height="10"/></a></svg>',
    '<svg viewBox="0 0 100 100"><foreignObject width="50" height="50"><div>x</div></foreignObject></svg>',
    '<svg viewBox="0 0 100 100"><image href="https://example.com/x.png" width="10" height="10"/></svg>'
  ];
  unsafeCases.forEach((svg) => {
    const res = visualAssets.validateAndNormalizeSvgForRasterization(svg);
    assert.equal(res.ok, false, "Expected unsafe SVG to be rejected: " + svg);
    assert.equal(res.code, "unsafe_svg_content");
  });
});

test("Visual jobs human prompt specifies downloadable PNG or self-contained SVG, and file input accepts SVG", () => {
  const brief = {
    brief_id: "brief-s3-scale",
    job_id: "job-s3-scale",
    affordance_id: "va-S3-correlation-scale-01",
    scope: "section",
    section_id: "S3",
    visual_slot: "section-after-content",
    preferred_representation: "number_line_segments",
    purpose: "synthesis",
    subject: "The Pearson correlation scale",
    context: "Horizontal number line from -1 to +1 with diamond marker at r = 0.93.",
    content_requirements: { authored: ["Number line from -1 to +1", "Diamond marker at r = 0.93"] },
    exclusion_requirements: { authored_must_not_show: ["Categorical strength boundaries"] }
  };
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /^Generate a finished rendered educational image\./);
  assert.match(prompt, /downloadable PNG image/i);
  assert.match(prompt, /self-contained SVG file/i);

  // Verify dropzone HTML accepts image/svg+xml and .svg
  const fs = require("node:fs");
  const wsSource = fs.readFileSync(
    path.join(repoRoot, "lib", "utilities-visual-jobs-workspace.js"),
    "utf8"
  );
  assert.match(wsSource, /accept="image\/png,image\/jpeg,image\/webp,image\/svg\+xml,\.svg"/);
});
