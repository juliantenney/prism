"use strict";

/**
 * Sprint 68 IMP-013 — generic moments composition tests.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {
  buildPageModel,
  buildComposedPageModel,
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext");
const {
  SOURCE_FUNCTION_MOMENT_MAP,
  classifyBeatMoment,
  classifyActivityBeats
} = require("../lib/learner-renderer-vnext/compose-moment-classification");

const repoRoot = path.resolve(__dirname, "..");
const new01Path = path.join(
  repoRoot,
  "tests/fixtures/page-render/learner-renderer-generic-moments-new01-page.json"
);
const kitchenSinkPath = path.join(
  repoRoot,
  "tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json"
);

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function renameActivityFixture(page, fromId, toId) {
  const clone = JSON.parse(JSON.stringify(page));
  clone.activities = clone.activities.map(function (activity) {
    if (activity.activity_id !== fromId) return activity;
    const renamed = Object.assign({}, activity, { activity_id: toId });
    renamed.materials = (activity.materials || []).map(function (material) {
      return Object.assign({}, material, {
        activity_id: toId,
        material_id: String(material.material_id).replace(fromId, toId)
      });
    });
    return renamed;
  });
  clone.learning_sequence = {
    ordered_activity_ids: clone.activities.map(function (activity) {
      return activity.activity_id;
    })
  };
  return clone;
}

function metricsFromHtml(html) {
  const body = (String(html || "").match(/<body[^>]*>([\s\S]*)<\/body>/i) || [])[1] || html;
  return {
    compositionMode: (html.match(/data-composition-mode="([^"]+)"/) || [])[1] || null,
    composedActivityCount: Number(
      (html.match(/data-composed-activity-count="(\d+)"/) || [])[1] || 0
    ),
    beatsFallbackActivityCount: Number(
      (html.match(/data-beats-fallback-activity-count="(\d+)"/) || [])[1] || 0
    ),
    compositionMoments: (body.match(/data-composition-moment="/g) || []).length,
    beatSections: (body.match(/data-beat-function="/g) || []).length,
    textWorkspaces: (body.match(/data-workspace-capability="text_entry"/g) || []).length,
    tableWorkspaces: (body.match(/data-workspace-kind="table_entry"/g) || []).length,
    momentsPaths: (body.match(/data-render-path="moments"/g) || []).length,
    beatsFallbackPaths: (body.match(/data-render-path="beats-fallback"/g) || []).length
  };
}

function compositionMetrics(page) {
  const modelResult = buildPageModel(page);
  assert.equal(modelResult.ok, true);
  const composedResult = buildComposedPageModel(modelResult, page);
  const rendered = renderLearnerPageHtml(page);
  const htmlMetrics = metricsFromHtml(rendered.html);
  const momentKinds = (composedResult.composed.activities[0]?.moments || []).map(function (m) {
    return m.kind;
  });
  return {
    modelResult: modelResult,
    composedResult: composedResult,
    htmlMetrics: htmlMetrics,
    momentKinds: momentKinds
  };
}

test("classification: canonical sourceFunction inventory maps to moments", () => {
  assert.equal(SOURCE_FUNCTION_MOMENT_MAP.orientation, "orient");
  assert.equal(SOURCE_FUNCTION_MOMENT_MAP.explanation, "learn");
  assert.equal(SOURCE_FUNCTION_MOMENT_MAP.analysis, "do");
  assert.equal(SOURCE_FUNCTION_MOMENT_MAP.check_understanding, "check");
  assert.equal(SOURCE_FUNCTION_MOMENT_MAP.evaluation, "do");
  assert.equal(SOURCE_FUNCTION_MOMENT_MAP.reflection, "check");
});

test("generic composition: NEW01 composes four moments without activityIds override", () => {
  const page = loadJson(new01Path);
  const metrics = compositionMetrics(page);
  assert.deepEqual(metrics.momentKinds, ["orient", "learn", "do", "check"]);
  assert.equal(metrics.composedResult.diagnostics.composedActivityCount, 1);
  assert.equal(metrics.composedResult.diagnostics.beatsFallbackActivityCount, 0);
  assert.equal(metrics.htmlMetrics.compositionMoments, 4);
  assert.equal(metrics.htmlMetrics.beatSections, 0);
  assert.equal(metrics.htmlMetrics.momentsPaths, 1);
});

test("generic composition: renaming activity ID does not change composition", () => {
  const base = loadJson(new01Path);
  const renamed = renameActivityFixture(base, "NEW01", "ALT99");
  const baseMetrics = compositionMetrics(base);
  const renamedMetrics = compositionMetrics(renamed);
  assert.deepEqual(renamedMetrics.momentKinds, baseMetrics.momentKinds);
  assert.equal(renamedMetrics.htmlMetrics.compositionMoments, baseMetrics.htmlMetrics.compositionMoments);
  assert.equal(renamedMetrics.htmlMetrics.textWorkspaces, baseMetrics.htmlMetrics.textWorkspaces);
});

test("generic composition: all kitchen-sink activities compose by default", () => {
  const page = loadJson(kitchenSinkPath);
  const modelResult = buildPageModel(page);
  const composedResult = buildComposedPageModel(modelResult, page);
  assert.equal(composedResult.diagnostics.composedActivityCount, 5);
  assert.equal(composedResult.diagnostics.beatsFallbackActivityCount, 0);
  composedResult.composed.activities.forEach(function (activity) {
    assert.ok(activity.moments.length >= 2, activity.id + " should compose multiple moments");
  });
});

test("generic composition: kitchen-sink renders moments path with workspaces", () => {
  const page = loadJson(kitchenSinkPath);
  const rendered = renderLearnerPageHtml(page);
  const metrics = metricsFromHtml(rendered.html);
  assert.equal(metrics.compositionMode, "moments");
  assert.equal(metrics.composedActivityCount, 5);
  assert.equal(metrics.beatsFallbackActivityCount, 0);
  assert.equal(metrics.beatSections, 0);
  assert.ok(metrics.compositionMoments >= 15);
  assert.ok(metrics.tableWorkspaces >= 3);
  assert.ok(metrics.textWorkspaces >= 2);
  assert.equal(metrics.momentsPaths, 5);
});

test("generic composition: static materials remain inside composed moments", () => {
  const html = renderLearnerPageHtml(loadJson(kitchenSinkPath)).html;
  assert.match(html, /data-composition-moment="learn"[\s\S]*data-material-type="text"/);
  assert.match(html, /data-composition-moment="learn"[\s\S]*data-material-type="modelling_note"/);
  assert.match(html, /data-composition-moment="check"[\s\S]*data-material-type="checklist"/);
});

test("generic composition: production entry point renders NEW01 via renderLearnerPageHtml", () => {
  const rendered = renderLearnerPageHtml(loadJson(new01Path));
  assert.equal(rendered.error, null);
  const metrics = metricsFromHtml(rendered.html);
  assert.equal(metrics.compositionMoments, 4);
  assert.equal(metrics.beatSections, 0);
});

test("generic composition: semantic beat functions classify KS01 beats", () => {
  const page = loadJson(kitchenSinkPath);
  const modelResult = buildPageModel(page);
  const ks01 = modelResult.model.activities.find(function (activity) {
    return activity.id === "KS01";
  });
  const groups = classifyActivityBeats(ks01);
  assert.equal(classifyBeatMoment(ks01.beats[0]), "orient");
  assert.equal(classifyBeatMoment(ks01.beats[1]), "learn");
  assert.ok(groups.splitBeats.length === 1);
});

test("generic composition: diagnostics distinguish mode from render path", () => {
  const html = renderLearnerPageHtml(loadJson(new01Path)).html;
  assert.match(html, /data-composition-mode="moments"/);
  assert.match(html, /data-composed-activity-count="1"/);
  assert.match(html, /data-beats-fallback-activity-count="0"/);
  assert.match(html, /data-render-path="moments"/);
  assert.doesNotMatch(html, /data-render-path="beats-fallback"/);
});
