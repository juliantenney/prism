"use strict";

/**
 * Sprint 68 IMP-014A — capture RNA table rendering metrics.
 */

const fs = require("node:fs");
const path = require("node:path");
const {
  buildPageModel,
  buildComposedPageModel,
  renderLearnerPageHtml,
  validateInput
} = require("../lib/learner-renderer-vnext");
const { buildMaterialModel } = require("../lib/learner-renderer-vnext/parse-material");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");
const {
  shouldComposeTableWorkspaceMaterial
} = require("../lib/learner-renderer-vnext/completion-table-workspace");

const repoRoot = path.resolve(__dirname, "..");
const artefactDir = path.join(
  repoRoot,
  "docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts"
);
const rnaPath = path.join(
  repoRoot,
  "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json"
);

function metricsFromHtml(html) {
  const body = (String(html || "").match(/<body[^>]*>([\s\S]*)<\/body>/i) || [])[1] || html;
  const ids = [...String(html || "").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  return {
    compositionMode: (html.match(/data-composition-mode="([^"]+)"/) || [])[1] || null,
    composedActivityCount: Number(
      (html.match(/data-composed-activity-count="(\d+)"/) || [])[1] || 0
    ),
    beatsFallbackActivityCount: Number(
      (html.match(/data-beats-fallback-activity-count="(\d+)"/) || [])[1] || 0
    ),
    compositionMoments: (body.match(/data-composition-moment="/g) || []).length,
    momentsByType: {
      orient: (body.match(/data-composition-moment="orient"/g) || []).length,
      learn: (body.match(/data-composition-moment="learn"/g) || []).length,
      do: (body.match(/data-composition-moment="do"/g) || []).length,
      check: (body.match(/data-composition-moment="check"/g) || []).length
    },
    beatSections: (body.match(/data-beat-function="/g) || []).length,
    classificationTables: (body.match(/data-material-type="classification_table"/g) || []).length,
    planningTables: (body.match(/data-material-type="planning_table"/g) || []).length,
    tableWorkspaceClassificationTables: (
      body.match(
        /data-material-type="classification_table"[\s\S]*?data-render-mode="table_workspace"/g
      ) || []
    ).length,
    tableWorkspacePlanningTables: (
      body.match(/data-material-type="planning_table"[\s\S]*?data-render-mode="table_workspace"/g) || []
    ).length,
    textWorkspaces: (body.match(/data-workspace-capability="text_entry"/g) || []).length,
    tableWorkspaces: (body.match(/data-workspace-kind="table_entry"/g) || []).length,
    unsupportedTypes: [
      ...new Set(
        (body.match(/data-render-status="unsupported"[^>]*data-material-type="([^"]+)"/g) || [])
          .map((chunk) => (chunk.match(/data-material-type="([^"]+)"/) || [])[1])
          .filter(Boolean)
      )
    ],
    duplicateIdCount: ids.length - new Set(ids).size
  };
}

function tableMaterialReport(page) {
  return page.activities.flatMap(function (activity) {
    return (activity.materials || [])
      .filter(function (material) {
        return (
          material.material_type === "classification_table" ||
          material.material_type === "planning_table"
        );
      })
      .map(function (material) {
        const model = buildMaterialModel(material, 0);
        const html = renderMaterial(model);
        return {
          activityId: activity.activity_id,
          materialId: material.material_id,
          materialType: material.material_type,
          tableWorkspaceEligible: shouldComposeTableWorkspaceMaterial(model),
          rendersStaticTable: /<table>/.test(html),
          unsupported: /data-render-status="unsupported"/.test(html)
        };
      });
  });
}

function main() {
  const page = JSON.parse(fs.readFileSync(rnaPath, "utf8"));
  const inputValidation = validateInput(page);
  const materialRendererErrors = inputValidation.errors.filter(function (error) {
    return String(error.message || "").includes("No vNext material renderer is registered");
  });
  const modelResult = buildPageModel(page);
  const composed = modelResult.ok ? buildComposedPageModel(modelResult, page) : null;
  const rendered = renderLearnerPageHtml(page);

  const report = {
    label: "rna-hcv-assembled",
    fixture: "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json",
    materialTypeValidationClear: materialRendererErrors.length === 0,
    materialRendererErrors: materialRendererErrors.map(function (error) {
      return error.message;
    }),
    renderSuccess: !rendered.error,
    renderError: rendered.error || null,
    modelBuildSuccess: !!modelResult.ok,
    modelBuildErrors: modelResult.ok
      ? []
      : modelResult.errors.slice(0, 8).map(function (error) {
          return error.message;
        }),
    activityCount: page.activities.length,
    composedActivityCount: composed ? composed.diagnostics.composedActivityCount : 0,
    beatsFallbackActivityCount: composed ? composed.diagnostics.beatsFallbackActivityCount : 0,
    beatsFallbackActivityIds: composed ? composed.diagnostics.beatsFallbackActivityIds : [],
    tableMaterials: tableMaterialReport(page),
    htmlMetrics: rendered.error ? null : metricsFromHtml(rendered.html)
  };

  fs.mkdirSync(artefactDir, { recursive: true });
  fs.writeFileSync(
    path.join(artefactDir, "rna-generic-moments-table-metrics.json"),
    JSON.stringify(report, null, 2) + "\n"
  );
  if (rendered.html) {
    fs.writeFileSync(path.join(artefactDir, "rna-generic-moments-table-export.html"), rendered.html);
  }

  console.log(JSON.stringify(report, null, 2));
}

main();
