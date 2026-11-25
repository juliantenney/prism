/**
 * Sprint 105 — Economics C1 Expository live-acceptance regression:
 * Graphical construction specifications / production instructions must not leak
 * into learner-facing figure descriptions or unattached illustration alternatives,
 * while genuine learner-facing accessible equivalents, captions, alt text, and
 * native structured scatterplots remain preserved across preview and ZIP export.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fflate = require("fflate");

const renderAffordance = require("../lib/learner-renderer-vnext/render-visual-affordance.js");
const figureContract = require("../lib/learner-figure-description-contract.js");
const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext/render-learner-page.js");
const learnerPackage = require("../lib/learner-package.js");
const learnerPackageZip = require("../lib/learner-package-zip.js");
const expositoryPrompts = require("../lib/expository-sibling-prompts.js");

const C1_CONSTRUCTION_SPEC =
  "Construct a clean horizontal number line with equally spaced reference ticks at -1, -0.5, 0, +0.5 and +1. " +
  "Position zero exactly halfway between the endpoints. Identify the left half as negative linear association " +
  "and the right half as positive linear association. Label the endpoints as perfect negative and perfect positive " +
  "linear association respectively, and label zero as no linear association. Use two outward-pointing arrows of " +
  "equal length and visual weight, beginning at zero and extending towards the respective endpoints. Label each " +
  "arrow Increasing linear strength. These arrows describe increasing absolute correlation magnitude and must not " +
  "resemble causal connectors. Place a diamond marker at the precise position corresponding to 0.93, near the " +
  "right endpoint. Offset its annotation vertically and use a short leader if necessary to prevent overlap with " +
  "the +1 endpoint label. The leader connects only the marker to its own annotation. Maintain sufficient spacing, " +
  "legible typography and strong foreground-background contrast. Use marker shape, explicit labels and arrow " +
  "orientation to communicate meaning independently of colour. Do not introduce coloured strength bands, " +
  "additional examples, decorative statistical symbols or arbitrary classification boundaries. Preserve the " +
  "existing textual equivalent from M02.";

const C1_LEARNER_CAPTION =
  "The sign of Pearson correlation indicates direction; distance from zero indicates linear strength.";

const C1_ALT_TEXT =
  "Pearson correlation scale from -1 to +1, with zero at the centre. Linear strength increases towards either endpoint. The regional investment coefficient of 0.93 is marked near +1.";

const C1_GENUINE_ACCESSIBLE =
  "The Pearson correlation scale runs from -1 (perfect negative linear association) through 0 (no linear association) to +1 (perfect positive linear association). The regional investment coefficient of 0.93 sits near +1, indicating a strong positive linear association.";

const TINY_PNG_BYTES = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
  0x00, 0x00, 0x03, 0x00, 0x01, 0x00, 0x05, 0xfe, 0xd4, 0xef, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
  0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
]);
const TINY_PNG_DATA_URL =
  "data:image/png;base64," + Buffer.from(TINY_PNG_BYTES).toString("base64");

function buildC1EconomicsPage(options) {
  const opts = options || {};
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "expository",
    page_kind: "expository",
    title: "Reading relationships in economic data",
    activities: [],
    sections: [
      {
        section_id: "S2",
        title: "Examining regional investment and growth",
        exposition: "A scatterplot shows how investment and growth vary together across ten regions.",
        materials: [
          {
            material_id: "M01",
            kind: "scatterplot",
            title: "Regional investment and economic growth",
            body: {
              scatterplot: {
                title: "Regional investment and economic growth",
                x_axis: { label: "Private investment", unit: "% of GVA", min: 10, max: 30 },
                y_axis: { label: "Economic growth", unit: "%", min: 0, max: 6 },
                observations: [
                  { label: "R1", x: 12, y: 1.2 },
                  { label: "R2", x: 18, y: 2.8 },
                  { label: "R3", x: 25, y: 4.9 }
                ]
              },
              caption: "Higher regional investment accompanies faster real GVA growth."
            }
          }
        ]
      },
      {
        section_id: "S3",
        title: "What does Pearson correlation tell us?",
        exposition: "Pearson correlation summarises direction and strength of linear association between -1 and +1.",
        materials: [
          {
            material_id: "M02",
            kind: opts.asNumberLineSpec ? "Annotated number-line representation" : "Annotated correlation scale",
            title: "Interpreting the Pearson correlation coefficient",
            body: opts.asNumberLineSpec
              ? {
                  title: "Interpreting the Pearson correlation coefficient",
                  number_line: { start: -1, end: 1, ticks: [-1, -0.5, 0, 0.5, 1] },
                  observations: [{ value: 0.93, label: "Regional investment" }],
                  detailed_description: C1_CONSTRUCTION_SPEC,
                  text_equivalent: C1_GENUINE_ACCESSIBLE
                }
              : {
                  title: "Interpreting the Pearson correlation coefficient",
                  caption: "Direction depends on which side of zero the coefficient lies. Linear strength depends on its distance from zero.",
                  detailed_description: C1_CONSTRUCTION_SPEC
                }
          }
        ]
      }
    ],
    visual_affordance_schema_version: "38.4",
    activities_visual_review: [],
    visual_affordances: [
      {
        affordance_id: "va-s3-correlation-scale-01",
        scope: "section",
        section_id: "S3",
        visual_decision: "generate",
        visual_slot: "section-after-content",
        tier: "essential",
        purpose: "data_pattern_reading",
        preferred_representation: "number_line_segments",
        subject: "Pearson correlation scale with regional investment coefficient",
        context: "Visual brief: horizontal correlation scale from -1 to +1 with 0.93 marked.",
        evidence_anchors: ["S3.materials.M02"],
        rationale: "Makes direction and magnitude of Pearson correlation perceptually inspectable.",
        reasoning_supported: "Reading sign and distance from zero on the correlation scale.",
        learner_stage: "post_reasoning",
        anti_spoiler: false,
        representation_avoid: ["generic_infographic"],
        canonical_discipline_note: "Show only -1, -0.5, 0, +0.5, +1 and 0.93.",
        requires_exact_data_match: true,
        must_show: ["-1", "-0.5", "0", "+0.5", "+1", "0.93"],
        must_not_show: ["Coloured strength bands"],
        allowed_claims: ["0.93 indicates a strong positive linear association."],
        disallowed_claims: ["Investment causes growth."],
        source_basis: "S3.materials.M02",
        caption_intent: C1_LEARNER_CAPTION,
        alt_text: C1_ALT_TEXT,
        detailed_description: opts.detailedDescription || C1_CONSTRUCTION_SPEC,
        discipline_risk_level: "high"
      }
    ],
    page_synthesis: {},
    assembly_state: {
      current_stage: "design_page",
      enriched_by: [
        "expository_journey_plan",
        "expository_development",
        "expository_materials",
        "design_page"
      ]
    }
  };
}

function correlationScaleAsset(detailedDescription) {
  return {
    brief_id: "vb-38-4-va-s3-correlation-scale-01-section-s3-section-after-content",
    affordance_id: "va-s3-correlation-scale-01",
    scope: "section",
    section_id: "S3",
    activity_id: "",
    visual_slot: "section-after-content",
    mime_type: "image/png",
    subject: "Pearson correlation scale with regional investment coefficient",
    caption_intent: C1_LEARNER_CAPTION,
    alt_text: C1_ALT_TEXT,
    detailed_description: detailedDescription,
    render_source: { kind: "data_url", value: TINY_PNG_DATA_URL }
  };
}

test("C1 construction specification is classified as production prose while genuine accessible text is preserved", () => {
  assert.equal(renderAffordance.isGraphicsProductionProse(C1_CONSTRUCTION_SPEC), true);
  assert.equal(figureContract.looksLikeProductionPrompt(C1_CONSTRUCTION_SPEC), true);

  // Mid-text construction directive even after a declarative opening sentence
  const mixed =
    "Pearson correlation scale from -1 to +1. Place a diamond marker at 0.93 and offset its annotation vertically to prevent overlap.";
  assert.equal(renderAffordance.isGraphicsProductionProse(mixed), true);
  assert.equal(figureContract.looksLikeProductionPrompt(mixed), true);

  // Legitimate learner-facing descriptions remain eligible
  assert.equal(renderAffordance.isGraphicsProductionProse(C1_GENUINE_ACCESSIBLE), false);
  assert.equal(figureContract.looksLikeProductionPrompt(C1_GENUINE_ACCESSIBLE), false);
  assert.equal(renderAffordance.isGraphicsProductionProse(C1_LEARNER_CAPTION), false);
});

test("attached C1 correlation scale suppresses construction prose in learner preview and ZIP export while preserving caption, alt, M02 text and scatterplot", () => {
  const page = buildC1EconomicsPage();
  const asset = correlationScaleAsset(C1_CONSTRUCTION_SPEC);
  const rendered = renderLearnerPageHtml(page, {
    compositionMode: "moments",
    visualAssets: { assets: [asset] }
  });
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");

  // Construction specification must NOT appear anywhere in learner preview
  assert.doesNotMatch(html, /Construct a clean horizontal number line/i);
  assert.doesNotMatch(html, /Place a diamond marker/i);
  assert.doesNotMatch(html, /foreground-background contrast/i);
  assert.doesNotMatch(html, /Do not introduce coloured strength bands/i);
  assert.doesNotMatch(html, /Preserve the existing textual equivalent from M02/i);
  assert.doesNotMatch(html, /util-visual-asset-detailed-description/);

  // Caption, alt text, M02 prose, and native S2 scatterplot MUST remain intact
  assert.match(html, /<strong>Figure 1\.<\/strong>/);
  assert.match(html, /The sign of Pearson correlation indicates direction; distance from zero indicates linear strength\./);
  assert.match(html, /alt="Pearson correlation scale from -1 to \+1/);
  assert.match(html, /Direction depends on which side of zero the coefficient lies\./);
  assert.match(html, /data-material-type="expository_structured_scatterplot"/);
  assert.match(html, /<svg\b[^>]*role="img"/);

  // ZIP export must match learner preview identically
  const built = learnerPackage.buildLearnerPackage({
    html: html,
    visualAssetManifest: { assets: [asset] },
    title: "Reading relationships in economic data"
  });
  assert.equal(built.ok, true, JSON.stringify(built.error || {}));
  const zipped = learnerPackageZip.serializeLearnerPackageToZip(built.package);
  assert.equal(zipped.ok, true, JSON.stringify(zipped.error || {}));
  const entries = fflate.unzipSync(zipped.bytes);
  const packagedHtml = fflate.strFromU8(entries["learner-page.html"]);
  assert.doesNotMatch(packagedHtml, /Construct a clean horizontal number line/i);
  assert.doesNotMatch(packagedHtml, /util-visual-asset-detailed-description/);
  assert.match(packagedHtml, /src="assets\/section-after-content\.png"/);
  assert.match(packagedHtml, /The sign of Pearson correlation indicates direction; distance from zero indicates linear strength\./);
  assert.match(packagedHtml, /data-material-type="expository_structured_scatterplot"/);
});

test("genuine learner-facing detailed_description is still published beneath attached figure", () => {
  const page = buildC1EconomicsPage({ detailedDescription: C1_GENUINE_ACCESSIBLE });
  const asset = correlationScaleAsset(C1_GENUINE_ACCESSIBLE);
  const rendered = renderLearnerPageHtml(page, {
    compositionMode: "moments",
    visualAssets: { assets: [asset] }
  });
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assert.match(html, /util-visual-asset-detailed-description/);
  assert.match(html, /The regional investment coefficient of 0\.93 sits near \+1/);
});

test("unattached C1 number-line illustration suppresses construction prose and publishes genuine accessible equivalent", () => {
  const page = buildC1EconomicsPage({ asNumberLineSpec: true });
  const rendered = renderLearnerPageHtml(page, {
    compositionMode: "moments",
    visualAssets: { assets: [] }
  });
  assert.equal(rendered.error, null);
  const html = String(rendered.html || "");
  assert.match(html, /data-illustration-status="unfulfilled"/);
  assert.match(html, /The Pearson correlation scale runs from -1/);
  assert.doesNotMatch(html, /Construct a clean horizontal number line/i);
  assert.doesNotMatch(html, /Place a diamond marker/i);
});

test("Expository Design Page prompt distinguishes learner-facing visual_affordances detailed_description from production-only editorial_opening_image detailed_description", () => {
  const dpPrompt = expositoryPrompts.TEMPLATES.design_page;
  assert.match(
    dpPrompt,
    /visual_affordances\[\]\s+generate\s+rows,\s+detailed_description\s+MUST\s+be\s+visible\s+learner-facing\s+accessible\s+textbook\s+prose/i
  );
  assert.match(
    dpPrompt,
    /Unlike\s+editorial_opening_image\.detailed_description/i
  );
});
