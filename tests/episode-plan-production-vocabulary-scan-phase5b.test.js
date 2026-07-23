/**
 * Sprint 69 Phase 5B — production-reachable Episode Plan vocabulary scan.
 *
 * Distinguishes compressed FunctionEnum producers from material labels,
 * negative fixtures, and documentation history.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const route = require("../lib/learner-renderer-vnext/archetype-validation-route.js");
const vocabulary = require("../lib/episode-plan-v1-vocabulary.js");
const { CERTIFICATION_CORPUS } = require("../lib/learner-renderer-vnext");

const repoRoot = path.resolve(__dirname, "..");

const POSITIVE_PAGE_SOURCES = [
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json",
  "tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json",
  "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json",
  "tests/fixtures/workflows/videotranscripttest-assembled-page.json",
  "tests/fixtures/educational-psychology-post-s68/repaired-assembled-page.json"
].concat(
  CERTIFICATION_CORPUS.map(function (entry) {
    return entry.fixturePath;
  })
);

const NEGATIVE_PAGE_SOURCES = [
  "tests/fixtures/educational-psychology-post-s68/design-episode-plan.json"
];

const BUILDER_SCRIPTS = [
  "scripts/build-learner-renderer-kitchen-sink-fixture.js"
];

function unique(list) {
  return Array.from(new Set(list));
}

function walkEpisodePlanFunctions(node, out) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach(function (child) {
      walkEpisodePlanFunctions(child, out);
    });
    return;
  }
  if (
    node.episode_plan &&
    typeof node.episode_plan === "object" &&
    Array.isArray(node.episode_plan.beats)
  ) {
    node.episode_plan.beats.forEach(function (beat) {
      if (beat && typeof beat === "object" && beat.function != null) {
        out.push(String(beat.function));
      }
    });
  }
  Object.keys(node).forEach(function (key) {
    if (key === "episode_plan") return;
    walkEpisodePlanFunctions(node[key], out);
  });
}

function classifyFunctions(functions) {
  const compressed = [];
  const unknown = [];
  const canonical = [];
  functions.forEach(function (fn) {
    if (vocabulary.FUNCTION_ENUM_SET[fn]) {
      canonical.push(fn);
      return;
    }
    if (route.NON_CANONICAL_COMPATIBILITY_BEATS[fn]) {
      compressed.push(fn);
      return;
    }
    unknown.push(fn);
  });
  return {
    compressed: unique(compressed).sort(),
    unknown: unique(unknown).sort(),
    canonical: unique(canonical).sort()
  };
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, rel), "utf8"));
}

test("production-reachable positive page sources have no compressed Episode Plan functions", () => {
  const sources = unique(POSITIVE_PAGE_SOURCES);
  const hits = [];
  sources.forEach(function (rel) {
    const page = readJson(rel);
    const functions = [];
    walkEpisodePlanFunctions(page, functions);
    const classified = classifyFunctions(functions);
    if (classified.compressed.length || classified.unknown.length) {
      hits.push({
        rel: rel,
        compressed: classified.compressed,
        unknown: classified.unknown
      });
    }
  });
  assert.deepEqual(hits, []);
});

test("kitchen-sink builder emits only FunctionEnum Episode Plan beats", () => {
  BUILDER_SCRIPTS.forEach(function (rel) {
    const source = fs.readFileSync(path.join(repoRoot, rel), "utf8");
    Object.keys(route.NON_CANONICAL_COMPATIBILITY_BEATS).forEach(function (beat) {
      const re = new RegExp(
        "function:\\s*[\"']" + beat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\"']"
      );
      assert.equal(re.test(source), false, rel + " still emits " + beat);
    });
  });
});

test("negative compressed Episode Plan capture remains fail-closed vocabulary", () => {
  NEGATIVE_PAGE_SOURCES.forEach(function (rel) {
    const page = readJson(rel);
    const functions = [];
    walkEpisodePlanFunctions(page, functions);
    const classified = classifyFunctions(functions);
    assert.ok(
      classified.compressed.length > 0,
      rel + " should retain compressed beats for negative coverage"
    );
  });
});

test("scan report categories remain within Phase 5B retirement targets", () => {
  const report = {
    productionReachableCompressedSources: [],
    productionReachableMixedSources: [],
    staleGeneratedArtifacts: [],
    persistedLegacyExamples: [],
    testOnlyNegativeFixtures: NEGATIVE_PAGE_SOURCES.slice(),
    catalogDocumentationReferences: [
      "lib/learner-renderer-vnext/MODEL_REVIEW.md",
      "docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/heteroscedasticity-a1-composition-structural-comparison.json",
      "docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/heteroscedasticity-a2-composition-structural-comparison.json",
      "docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/heteroscedasticity-a4-composition-structural-comparison.json",
      "docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/heteroscedasticity-a5-composition-structural-comparison.json"
    ]
  };

  unique(POSITIVE_PAGE_SOURCES).forEach(function (rel) {
    const functions = [];
    walkEpisodePlanFunctions(readJson(rel), functions);
    const classified = classifyFunctions(functions);
    if (classified.compressed.length && classified.canonical.length) {
      report.productionReachableMixedSources.push(rel);
    } else if (classified.compressed.length) {
      report.productionReachableCompressedSources.push(rel);
    }
  });

  assert.deepEqual(report.productionReachableCompressedSources, []);
  assert.deepEqual(report.productionReachableMixedSources, []);
  assert.equal(report.testOnlyNegativeFixtures.length >= 1, true);
});
