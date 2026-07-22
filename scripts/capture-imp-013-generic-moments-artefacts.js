"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vnext = require("../lib/learner-renderer-vnext");

const repoRoot = path.resolve(__dirname, "..");
const artefactDir = path.join(
  repoRoot,
  "docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts"
);

function loadJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
}

function metricsFromHtml(html) {
  const body = (String(html || "").match(/<body[^>]*>([\s\S]*)<\/body>/i) || [])[1] || html;
  const momentKinds = [...body.matchAll(/data-composition-moment="([^"]+)"/g)].map(function (m) {
    return m[1];
  });
  const materialTypes = [
    ...new Set([...body.matchAll(/data-material-type="([^"]+)"/g)].map(function (m) {
      return m[1];
    }))
  ].sort();
  const ids = [...body.matchAll(/\sid="([^"]+)"/g)].map(function (m) {
    return m[1];
  });
  return {
    compositionMode: (html.match(/data-composition-mode="([^"]+)"/) || [])[1] || null,
    composedActivityCount: Number(
      (html.match(/data-composed-activity-count="(\d+)"/) || [])[1] || 0
    ),
    beatsFallbackActivityCount: Number(
      (html.match(/data-beats-fallback-activity-count="(\d+)"/) || [])[1] || 0
    ),
    compositionMoments: momentKinds.length,
    momentsByType: momentKinds.reduce(function (acc, kind) {
      acc[kind] = (acc[kind] || 0) + 1;
      return acc;
    }, {}),
    beatSections: (body.match(/data-beat-function="/g) || []).length,
    textWorkspaces: (body.match(/data-workspace-capability="text_entry"/g) || []).length,
    tableWorkspaces: (body.match(/data-workspace-kind="table_entry"/g) || []).length,
    materialTypes: materialTypes,
    duplicateIdCount: ids.length - new Set(ids).size
  };
}

function capture(label, relativeFixturePath, htmlName, metricsName) {
  const page = loadJson(relativeFixturePath);
  const rendered = vnext.renderLearnerPageHtml(page);
  if (rendered.error) throw new Error(label + ": " + rendered.error);
  const html = String(rendered.html || "");
  const metrics = Object.assign(
    {
      label: label,
      fixture: relativeFixturePath,
      activityCount: (page.activities || []).length,
      beatsFallbackActivityIds:
        rendered.composedResult?.diagnostics?.beatsFallbackActivityIds || []
    },
    metricsFromHtml(html)
  );
  fs.writeFileSync(path.join(artefactDir, htmlName), html, "utf8");
  fs.writeFileSync(path.join(artefactDir, metricsName), JSON.stringify(metrics, null, 2), "utf8");
  return metrics;
}

if (!fs.existsSync(artefactDir)) fs.mkdirSync(artefactDir, { recursive: true });

const kitchenSink = capture(
  "kitchen-sink",
  "tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json",
  "kitchen-sink-generic-moments-export.html",
  "kitchen-sink-generic-moments-metrics.json"
);
const new01 = capture(
  "NEW01",
  "tests/fixtures/page-render/learner-renderer-generic-moments-new01-page.json",
  "generic-moments-new01-export.html",
  "generic-moments-new01-metrics.json"
);
const hetero = capture(
  "heteroscedasticity-A1-A5",
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json",
  "heteroscedasticity-generic-moments-export.html",
  "heteroscedasticity-generic-moments-metrics.json"
);

const mapDoc = {
  title: "Canonical beat-function to composition-moment map (IMP-013)",
  source: "lib/learner-renderer-vnext/compose-moment-classification.js",
  map: require("../lib/learner-renderer-vnext/compose-moment-classification").SOURCE_FUNCTION_MOMENT_MAP
};
fs.writeFileSync(
  path.join(artefactDir, "beat-function-to-moment-map.json"),
  JSON.stringify(mapDoc, null, 2),
  "utf8"
);

console.log(JSON.stringify({ kitchenSink, new01, hetero }, null, 2));
