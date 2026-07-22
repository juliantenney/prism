"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { readVideoTranscriptTestPage } = require("../tests/videotranscripttest-workflow-fixture");
const inspect =
  require("../lib/learner-renderer-vnext/archetype-diagnostics").inspectActivitiesArchetypes;
const buildModel = require("../lib/learner-renderer-vnext/build-page-model").buildPageModel;
const renderPage = require("../lib/learner-renderer-vnext/render-learner-page").renderLearnerPageHtml;

var loaded = readVideoTranscriptTestPage();
var page = loaded.page;
var inspections = inspect(page.activities);
var model = buildModel(page);
var rendered = renderPage(page, { compositionMode: "moments" });
var html = rendered.html || "";
var body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [])[1] || html;
var momentCounts = { orient: 0, learn: 0, do: 0, check: 0 };
["orient", "learn", "do", "check"].forEach(function (kind) {
  momentCounts[kind] = (body.match(new RegExp('data-composition-moment="' + kind + '"', "g")) || [])
    .length;
});
var ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(function (match) {
  return match[1];
});

var outPath = path.join(
  __dirname,
  "..",
  "docs",
  "development",
  "sprints",
  "2026-07-21-sprint-68-learning-coherence-narrative-flow",
  "artefacts",
  "videotranscripttest-imp-014c-diagnostics.json"
);

var metrics = {
  workflowId: loaded.provenance.workflow_id,
  workflowName: loaded.provenance.workflow_name,
  fixturePath: loaded.fixturePath,
  activityCount: page.activities.length,
  inspections: inspections,
  modelOk: model.ok,
  cascadeSummary: model.diagnostics.cascadeSummary,
  errorCodes: model.errors.map(function (error) {
    return error.code;
  }),
  render: {
    compositionMode: (html.match(/data-composition-mode="([^"]+)"/) || [])[1] || null,
    composedActivityCount: Number(
      (html.match(/data-composed-activity-count="(\d+)"/) || [])[1] || 0
    ),
    beatsFallbackActivityCount: Number(
      (html.match(/data-beats-fallback-activity-count="(\d+)"/) || [])[1] || 0
    ),
    compositionMoments: (body.match(/data-composition-moment="/g) || []).length,
    momentCounts: momentCounts,
    textWorkspaces: (html.match(/data-workspace-capability="text_entry"/g) || []).length,
    tableWorkspaces: (html.match(/data-workspace-kind="table_entry"/g) || []).length,
    tableEntryInputs: (html.match(/util-learner-table-workspace__input/g) || []).length,
    unsupportedTypes: [
      ...new Set(
        (html.match(/data-render-status="unsupported"[^>]*data-material-type="([^"]+)"/g) || [])
          .map(function (chunk) {
            return (chunk.match(/data-material-type="([^"]+)"/) || [])[1];
          })
          .filter(Boolean)
      )
    ],
    duplicateIdCount: ids.length - new Set(ids).size,
    htmlLength: html.length,
    renderError: rendered.error
  }
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(metrics, null, 2) + "\n", "utf8");
console.log(JSON.stringify(metrics, null, 2));
