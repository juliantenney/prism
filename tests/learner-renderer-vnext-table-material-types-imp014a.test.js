"use strict";

/**
 * Sprint 68 IMP-014A — classification_table and planning_table support.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildPageModel,
  buildComposedPageModel,
  renderLearnerPageHtml,
  validateInput
} = require("../lib/learner-renderer-vnext");
const { buildMaterialModel, hasMaterialRenderer } = require("../lib/learner-renderer-vnext/parse-material");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");
const {
  shouldComposeTableWorkspaceMaterial
} = require("../lib/learner-renderer-vnext/completion-table-workspace");
const { composeDoMoment } = require("../lib/learner-renderer-vnext/compose-activity-moments");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");
const { buildComposedPageModel: composePage } = require("../lib/learner-renderer-vnext/compose-page-model");

const repoRoot = path.resolve(__dirname, "..");
const rnaPath = path.join(
  repoRoot,
  "tests/fixtures/page-render/rna-hcv-assembled-vnext-materials-page.json"
);
const heteroPath = path.join(
  repoRoot,
  "tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json"
);
const new01Path = path.join(
  repoRoot,
  "tests/fixtures/page-render/learner-renderer-generic-moments-new01-page.json"
);

const completionBody =
  "| Column A | Column B |\n| --- | --- |\n| Fixed row | Filled |\n| Another |  |";
const informationalBody =
  "| Column A | Column B |\n| --- | --- |\n| Row one | Complete |\n| Row two | Also complete |";

function buildTableMaterial(materialType, body, materialId) {
  return buildMaterialModel(
    {
      material_id: materialId || "T01-M2",
      material_type: materialType,
      title: "Probe table",
      body_format: "markdown",
      body: body
    },
    1
  );
}

function buildProbeActivity(materialType, body) {
  var tableMaterial = buildTableMaterial(materialType, body);
  return {
    id: "T01",
    title: "Table probe",
    durationMinutes: 10,
    grouping: "individual",
    preamble: "Complete the table activity.",
    reasoningOrientation: "",
    mappedOutcomeIds: [],
    beats: [
      {
        sourceFunction: "explanation",
        learnerRole: "explain",
        learnerLabel: "Explain",
        instructions: [{ sourceStepNumber: 1, text: "Read the introduction." }],
        prompts: [],
        materials: [
          buildMaterialModel(
            {
              material_id: "T01-M1",
              material_type: "text",
              title: "Intro",
              body_format: "markdown",
              body: "Intro text."
            },
            0
          )
        ],
        expectedOutput: null
      },
      {
        sourceFunction: "analysis",
        learnerRole: "practise",
        learnerLabel: "Apply",
        instructions: [{ sourceStepNumber: 2, text: "Complete the table below." }],
        prompts: [],
        materials: [tableMaterial],
        expectedOutput: { text: "Completed table with both rows filled." }
      },
      {
        sourceFunction: "check_understanding",
        learnerRole: "check",
        learnerLabel: "Check",
        instructions: [{ sourceStepNumber: 3, text: "Verify with the checklist." }],
        prompts: [],
        materials: [
          buildMaterialModel(
            {
              material_id: "T01-M3",
              material_type: "checklist",
              title: "Checklist",
              body_format: "markdown",
              body: "- Criterion one\n- Criterion two"
            },
            2
          )
        ],
        expectedOutput: null
      }
    ]
  };
}

function metricsFromHtml(html) {
  const body = (String(html || "").match(/<body[^>]*>([\s\S]*)<\/body>/i) || [])[1] || html;
  return {
    compositionMoments: (body.match(/data-composition-moment="/g) || []).length,
    beatSections: (body.match(/data-beat-function="/g) || []).length,
    textWorkspaces: (body.match(/data-workspace-capability="text_entry"/g) || []).length,
    tableWorkspaces: (body.match(/data-workspace-kind="table_entry"/g) || []).length,
    classificationTables: (body.match(/data-material-type="classification_table"/g) || []).length,
    planningTables: (body.match(/data-material-type="planning_table"/g) || []).length,
    unsupported: (body.match(/data-render-status="unsupported"/g) || []).length
  };
}

function rnaTableMaterials(page) {
  return page.activities.flatMap(function (activity) {
    return (activity.materials || [])
      .filter(function (material) {
        return (
          material.material_type === "classification_table" ||
          material.material_type === "planning_table"
        );
      })
      .map(function (material) {
        return { activityId: activity.activity_id, source: material };
      });
  });
}

test("registry: classification_table and planning_table are registered renderers", () => {
  assert.equal(hasMaterialRenderer("classification_table"), true);
  assert.equal(hasMaterialRenderer("planning_table"), true);
});

test("render: classification_table static markdown table renders without throw", () => {
  const material = buildTableMaterial("classification_table", informationalBody, "X-M1");
  const html = renderMaterial(material);
  assert.match(html, /data-material-type="classification_table"/);
  assert.match(html, /<table>/);
  assert.doesNotMatch(html, /util-learner-table-workspace/);
});

test("render: planning_table static markdown table renders without throw", () => {
  const material = buildTableMaterial("planning_table", informationalBody, "X-M2");
  const html = renderMaterial(material);
  assert.match(html, /data-material-type="planning_table"/);
  assert.match(html, /<table>/);
});

test("workspace: informational classification_table stays static in composed Do", () => {
  const activity = buildProbeActivity("classification_table", informationalBody);
  const material = activity.beats[1].materials[0];
  assert.equal(shouldComposeTableWorkspaceMaterial(material), false);
  const doMoment = composeDoMoment(activity);
  const item = doMoment.items.find(function (entry) {
    return entry.material && entry.material.id === "T01-M2";
  });
  assert.ok(item);
  assert.notEqual(item.tableWorkspace, true);
});

test("workspace: completion classification_table routes to table_entry in composed Do", () => {
  const activity = buildProbeActivity("classification_table", completionBody);
  const material = activity.beats[1].materials[0];
  assert.equal(shouldComposeTableWorkspaceMaterial(material), true);
  const doMoment = composeDoMoment(activity);
  const item = doMoment.items.find(function (entry) {
    return entry.material && entry.material.id === "T01-M2";
  });
  assert.equal(item.tableWorkspace, true);
});

test("workspace: informational planning_table stays static in composed Do", () => {
  const activity = buildProbeActivity("planning_table", informationalBody);
  const material = activity.beats[1].materials[0];
  assert.equal(shouldComposeTableWorkspaceMaterial(material), false);
});

test("workspace: completion planning_table routes to table_entry in composed Do", () => {
  const activity = buildProbeActivity("planning_table", completionBody);
  const material = activity.beats[1].materials[0];
  assert.equal(shouldComposeTableWorkspaceMaterial(material), true);
  const doMoment = composeDoMoment(activity);
  const item = doMoment.items.find(function (entry) {
    return entry.material && entry.material.id === "T01-M2";
  });
  assert.equal(item.tableWorkspace, true);
});

test("regression: analysis_table workspace behaviour unchanged", () => {
  const hetero = JSON.parse(fs.readFileSync(heteroPath, "utf8"));
  const modelResult = buildPageModel(hetero);
  const a2 = modelResult.model.activities.find(function (activity) {
    return activity.id === "A2";
  });
  const doMoment = composeDoMoment(a2);
  const m2 = doMoment.items.find(function (item) {
    return item.material && item.material.id === "A2-M2";
  });
  assert.equal(m2.tableWorkspace, true);
  assert.equal(shouldComposeTableWorkspaceMaterial(m2.material), true);
});

test("validation: unsupported unrelated material types still fail explicitly", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Unsupported table probe",
    page_profile: "learner",
    activities: [
      {
        activity_id: "U01",
        title: "Unsupported",
        learner_task: "Read.",
        episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] },
        materials: [
          {
            material_id: "U01-M1",
            material_type: "impact_table",
            title: "Unsupported table",
            body_format: "markdown",
            body: "| A | B |\n| --- | --- |\n| 1 | 2 |"
          }
        ]
      }
    ]
  };
  const result = validateInput(page);
  assert.ok(result.errors.length >= 1);
  assert.match(result.errors[0].message, /No vNext material renderer is registered for type: impact_table/);
});

test("integration: RNA fixture clears material-type validation and table materials render", () => {
  const page = JSON.parse(fs.readFileSync(rnaPath, "utf8"));
  const inputResult = validateInput(page);
  const materialTypeErrors = inputResult.errors.filter(function (error) {
    return String(error.message || "").includes("No vNext material renderer is registered");
  });
  assert.equal(materialTypeErrors.length, 0);

  const rendered = renderLearnerPageHtml(page);
  assert.doesNotMatch(String(rendered.error || ""), /No vNext material renderer is registered/);

  rnaTableMaterials(page).forEach(function (entry) {
    const material = buildMaterialModel(entry.source, 0);
    const html = renderMaterial(material);
    assert.doesNotMatch(html, /data-render-status="unsupported"/);
    assert.match(html, /data-material-type="/);
    assert.ok(html.includes(entry.source.body.match(/S62-RNA-[A-Z0-9-]+-ROW/)?.[0] || "ROW"));
  });
});

test("integration: RNA table materials compose to table_entry when blank cells present", () => {
  const page = JSON.parse(fs.readFileSync(rnaPath, "utf8"));
  rnaTableMaterials(page).forEach(function (entry) {
    const material = buildMaterialModel(entry.source, 0);
    assert.equal(shouldComposeTableWorkspaceMaterial(material), true, entry.source.material_id);
    const activity = buildProbeActivity(material.type, material.body);
    activity.id = entry.activityId;
    activity.beats[1].materials[0].id = entry.source.material_id;
    const model = {
      title: "RNA table probe",
      durationMinutes: null,
      orientationSections: [],
      studyTips: null,
      progressionGuidance: null,
      assessment: null,
      activities: [activity]
    };
    const composed = composePage({ ok: true, model: model, errors: [], warnings: [] }, page);
    const html = renderPage(model, {
      compositionMode: "moments",
      composed: composed.composed,
      activityComposition: require("../lib/learner-renderer-vnext/compose-page-model").buildActivityCompositionMap(
        composed.composed
      )
    });
    assert.match(html, new RegExp('data-material-id="' + entry.source.material_id + '"'));
    assert.match(html, /util-learner-table-workspace/);
  });
});

test("regression: generic moments composition unchanged for NEW01 proof fixture", () => {
  const page = JSON.parse(fs.readFileSync(new01Path, "utf8"));
  const modelResult = buildPageModel(page);
  const composed = buildComposedPageModel(modelResult, page);
  assert.equal(composed.diagnostics.composedActivityCount, 1);
  assert.equal(composed.diagnostics.beatsFallbackActivityCount, 0);
  const rendered = renderLearnerPageHtml(page);
  const metrics = metricsFromHtml(rendered.html);
  assert.equal(metrics.compositionMoments, 4);
  assert.equal(metrics.beatSections, 0);
});
