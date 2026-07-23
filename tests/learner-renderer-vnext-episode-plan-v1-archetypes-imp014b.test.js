"use strict";

/**
 * Sprint 68 IMP-014B — Episode Plan V1 beat sequences reach vNext page model.
 * Phase 5B: sequences resolve via shared grammar + canonical binding only.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const resolveArchetypeValidation =
  require("../lib/learner-renderer-vnext/archetype-validation-route")
    .resolveArchetypeValidation;
const buildModel = require("../lib/learner-renderer-vnext/build-page-model").buildPageModel;
const renderPage = require("../lib/learner-renderer-vnext/render-learner-page").renderLearnerPageHtml;

const repoRoot = path.resolve(__dirname, "..");
const rnaPath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "rna-hcv-assembled-vnext-materials-page.json"
);

/** Beat sequences from VideoTranscriptTest / RNA transcript assembly (Sprint 63). */
const EXPECTED_VARIANTS = Object.freeze([
  {
    activityId: "A1",
    archetype: "understand",
    beatSequence: ["explanation", "worked_thinking", "guided_practice", "verification"],
    variantIdPrefix: "understand-"
  },
  {
    activityId: "A2",
    archetype: "analyse",
    beatSequence: ["explanation", "worked_thinking", "guided_practice", "verification"],
    variantIdPrefix: "analyse-"
  },
  {
    activityId: "A3",
    archetype: "apply",
    beatSequence: ["explanation", "guided_practice", "verification"],
    variantIdPrefix: "apply-"
  },
  {
    activityId: "A4",
    archetype: "analyse",
    beatSequence: ["worked_thinking", "guided_practice", "verification"],
    variantIdPrefix: "analyse-"
  },
  {
    activityId: "A5",
    archetype: "analyse",
    beatSequence: ["explanation", "guided_practice", "verification"],
    variantIdPrefix: "analyse-"
  },
  {
    activityId: "A6",
    archetype: "evaluate",
    beatSequence: [
      "explanation",
      "worked_judgement",
      "guided_practice",
      "transfer",
      "verification"
    ],
    variantIdPrefix: "evaluate-"
  }
]);

function loadRnaPage() {
  return JSON.parse(fs.readFileSync(rnaPath, "utf8"));
}

function metricsFromHtml(html) {
  const body = (String(html || "").match(/<body[^>]*>([\s\S]*)<\/body>/i) || [])[1] || html;
  const ids = [...String(html || "").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const renderPaths = [
    ...new Set(
      (body.match(/data-render-path="([^"]+)"/g) || [])
        .map((chunk) => (chunk.match(/data-render-path="([^"]+)"/) || [])[1])
        .filter(Boolean)
    )
  ];
  return {
    compositionMode: (html.match(/data-composition-mode="([^"]+)"/) || [])[1] || null,
    composedActivityCount: Number(
      (html.match(/data-composed-activity-count="(\d+)"/) || [])[1] || 0
    ),
    beatsFallbackActivityCount: Number(
      (html.match(/data-beats-fallback-activity-count="(\d+)"/) || [])[1] || 0
    ),
    compositionMoments: (body.match(/data-composition-moment="/g) || []).length,
    textWorkspaces: (body.match(/data-workspace-capability="text_entry"/g) || []).length,
    tableWorkspaces: (body.match(/data-workspace-kind="table_entry"/g) || []).length,
    renderPaths: renderPaths,
    unsupportedTypes: [
      ...new Set(
        (html.match(/data-render-status="unsupported"[^>]*data-material-type="([^"]+)"/g) || [])
          .map((chunk) => (chunk.match(/data-material-type="([^"]+)"/) || [])[1])
          .filter(Boolean)
      )
    ],
    duplicateIdCount: ids.length - new Set(ids).size
  };
}

test("IMP-014B: production beat sequences resolve via grammar + canonical binding", () => {
  EXPECTED_VARIANTS.forEach(function (row) {
    const resolved = resolveArchetypeValidation({
      activityId: row.activityId,
      archetype: row.archetype,
      normalizedBeatSequence: row.beatSequence
    });
    assert.equal(resolved.ok, true, row.activityId + " " + JSON.stringify(resolved.errors));
    assert.equal(resolved.validationRoute, "canonical-grammar");
    assert.equal(resolved.runtimeAuthority, "shared-archetype-grammar");
    assert.equal(resolved.bindingSource, "canonical-grammar-binding");
    assert.equal(resolved.continuityMatch, false);
    assert.ok(
      String(resolved.matchedVariantId || "").indexOf(row.variantIdPrefix) === 0,
      row.activityId + " variant id " + resolved.matchedVariantId
    );
  });
});

test("IMP-014B: RNA transcript assembled page builds and renders through vNext", () => {
  const page = loadRnaPage();
  const modelResult = buildModel(page);
  assert.equal(modelResult.ok, true, modelResult.errors.map((e) => e.message).join("; "));
  assert.equal(modelResult.model.activities.length, 6);

  modelResult.model.activities.forEach(function (activity) {
    assert.ok(activity.beats.length >= 3, activity.id + " should retain learner-facing beats");
  });
  modelResult.diagnostics.archetypeInspection.forEach(function (insp) {
    assert.equal(insp.validationRoute, "canonical-grammar");
    assert.equal(insp.bindingSource, "canonical-grammar-binding");
  });

  const rendered = renderPage(page, { compositionMode: "moments" });
  assert.equal(rendered.error, null, rendered.error);
  assert.ok(rendered.html && rendered.html.length > 1000);

  const metrics = metricsFromHtml(rendered.html);
  assert.equal(metrics.compositionMode, "moments");
  assert.equal(metrics.composedActivityCount, 6);
  assert.equal(metrics.beatsFallbackActivityCount, 0);
  assert.equal(metrics.duplicateIdCount, 0);
  assert.deepEqual(metrics.unsupportedTypes, []);
});
