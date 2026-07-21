"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { buildPageModel } = require("../lib/learner-renderer-vnext");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");
const { renderActivity } = require("../lib/learner-renderer-vnext/render-activity");
const { renderBeat } = require("../lib/learner-renderer-vnext/render-beat");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");

const repoRoot = path.resolve(__dirname, "..");
const moduleDir = path.join(repoRoot, "lib", "learner-renderer-vnext");
const fixturePath = path.join(
  repoRoot,
  "tests",
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

function loadModel() {
  const source = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const result = buildPageModel(source);
  assert.equal(result.ok, true);
  return { source, model: result.model };
}

function materialById(model, materialId) {
  for (const activity of model.activities) {
    for (const beat of activity.beats) {
      for (const material of beat.materials) {
        if (material.id === materialId) return material;
      }
    }
  }
  return null;
}

function extractActivityHtml(html, activityId, activityIds) {
  const start = html.indexOf(`data-activity-id="${activityId}"`);
  assert.ok(start >= 0, `missing activity ${activityId}`);
  const nextStart = activityIds
    .map((id) => html.indexOf(`data-activity-id="${id}"`))
    .filter((position) => position > start)
    .sort((left, right) => left - right)[0];
  return nextStart >= 0 ? html.slice(start, nextStart) : html.slice(start);
}

function countOccurrences(haystack, needle) {
  const matches = String(haystack).match(new RegExp(needle, "g"));
  return matches ? matches.length : 0;
}

test("vNext page renderer preserves model-provided activity order", () => {
  const { model } = loadModel();
  const reversed = Object.assign({}, model, {
    activities: model.activities.slice().reverse()
  });
  const output = renderPage(reversed);
  const positions = reversed.activities.map((activity) =>
    output.indexOf(`data-activity-id="${activity.id}"`)
  );

  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, positions.slice().sort((left, right) => left - right));
});

test("vNext activity renderer preserves model-provided beat order", () => {
  const activity = loadModel().model.activities[0];
  const reversed = Object.assign({}, activity, {
    beats: activity.beats.slice().reverse()
  });
  const output = renderActivity(reversed);
  const positions = reversed.beats.map((beat) =>
    output.indexOf(`data-beat-function="${beat.sourceFunction}"`)
  );

  assert.deepEqual(positions, positions.slice().sort((left, right) => left - right));
});

test("vNext beat renderer omits a beat with no learner-facing content", () => {
  const output = renderBeat({
    sourceFunction: "orientation",
    learnerRole: "reflect",
    learnerLabel: "Reflect",
    instructions: [],
    prompts: [],
    materials: [],
    expectedOutput: null
  });

  assert.equal(output, "");
  assert.doesNotMatch(output, /util-beat-section/);
});

test("vNext beat heading uses learnerLabel and keeps source function as metadata", () => {
  const output = renderBeat({
    sourceFunction: "check_understanding",
    learnerRole: "check",
    learnerLabel: "Check your work",
    instructions: [{ sourceStepNumber: 1, text: "Review your answer." }],
    prompts: [],
    materials: [],
    expectedOutput: null
  });

  assert.match(output, /data-beat-function="check_understanding"/);
  assert.match(
    output,
    /<h3 class="util-beat-heading util-icon-heading">[\s\S]*<span class="util-semantic-icon__label">Check your work<\/span>/
  );
  assert.doesNotMatch(
    output,
    /<span class="util-semantic-icon__label">check_understanding<\/span>/
  );
});

test("vNext beat renderer preserves material order and stable ID markers", () => {
  const activity = loadModel().model.activities.find((candidate) => candidate.id === "A5");
  const beat = activity.beats.find(
    (candidate) => candidate.sourceFunction === "reflection"
  );
  const output = renderBeat(beat);
  const materialIds = beat.materials.map((material) => material.id);
  const positions = materialIds.map((id) =>
    output.indexOf(`data-material-id="${id}"`)
  );

  assert.deepEqual(materialIds, ["A5-M8", "A5-M7"]);
  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(positions, positions.slice().sort((left, right) => left - right));
});

test("vNext material renderer explicitly marks unsupported material kinds", () => {
  const output = renderMaterial({
    id: "M-UNKNOWN",
    type: "unknown_kind",
    title: "Unknown",
    bodyFormat: "plain",
    body: "Content",
    sourceOrder: 0,
    checklist: null
  });

  assert.match(output, /data-material-id="M-UNKNOWN"/);
  assert.match(output, /data-render-status="unsupported"/);
  assert.match(output, /Unsupported material kind: unknown_kind/);
});

test("vNext production renderers exclude legacy planner architecture", () => {
  const rendererFiles = [
    "render-page.js",
    "render-activity.js",
    "render-beat.js",
    "render-material.js",
    "render-html-utils.js"
  ];
  const source = rendererFiles
    .map((name) => fs.readFileSync(path.join(moduleDir, name), "utf8"))
    .join("\n");
  const forbidden = [
    "scoreClauseForBeat",
    "scoreMaterialForBeat",
    "chooseSinkBeatIndex",
    "earliestStepMention",
    "resolveBeatMaterialPlan",
    "orderedMaterialKeysRendered",
    "checklistRendered",
    "insertExpectedOutputGuidanceBeforeChecklist"
  ];

  assert.doesNotMatch(source, /ld-beat-assignment-compose/);
  forbidden.forEach((token) => assert.equal(source.includes(token), false));
  assert.doesNotMatch(
    source,
    /(?:activityId|activity\.id|activity\["id"\])\s*={2,3}\s*["']A\d+["']/
  );
});

test("vNext material renderer renders markdown headings and emphasis", () => {
  const { model } = loadModel();
  const material = materialById(model, "A1-M1");
  const output = renderMaterial(material);

  assert.match(output, /<h2>Residuals and Variance<\/h2>/);
  assert.match(output, /Homoscedasticity occurs/);
  assert.match(output, /data-material-id="A1-M1"/);
  assert.match(output, /data-material-type="text"/);
});

test("vNext material renderer renders checklist criteria and revision guidance", () => {
  const { model } = loadModel();
  const material = materialById(model, "A1-M4");
  const output = renderMaterial(material);

  assert.match(output, /util-checklist-block/);
  assert.match(output, /<ul class="util-checklist">/);
  assert.match(output, /Have I explained residual variance\?/);
  assert.match(output, /util-checklist-instruction/);
  assert.match(output, /revise before continuing/i);
  assert.doesNotMatch(output, /data-render-status="unsupported"/);
});

test("vNext beat renderer renders expected output once with markdown body", () => {
  const activity = loadModel().model.activities.find((candidate) => candidate.id === "A1");
  const beat = activity.beats.find(
    (candidate) => candidate.sourceFunction === "check_understanding"
  );
  const output = renderBeat(beat);

  assert.equal(countOccurrences(output, "util-expected-output"), 1);
  assert.match(output, /Expected output/);
  assert.match(output, /residual variance/);
});

test("vNext material renderer renders table materials with util-material-table wrapper", () => {
  const { model } = loadModel();
  const material = materialById(model, "A2-M2");
  const output = renderMaterial(material);

  assert.match(output, /util-table-scroll util-material-table/);
  assert.match(output, /<table>/);
  assert.match(output, /Observed Pattern/);
  assert.match(output, /Heteroscedasticity Judgement/);
  assert.match(output, /data-material-id="A2-M2"/);
});

test("vNext material renderer renders scenario materials preserving authored sections", () => {
  const { model } = loadModel();
  const material = materialById(model, "A2-M3");
  const output = renderMaterial(material);

  assert.match(output, /util-scenario-card/);
  assert.match(output, /Case A: Household Spending/);
  assert.match(output, /Case B: Income and Luxury Consumption/);
  assert.match(output, /Case C: Firm Profits/);
});

test("vNext material renderer renders template materials as authored markdown", () => {
  const { model } = loadModel();
  const material = materialById(model, "A5-M5");
  const output = renderMaterial(material);

  assert.match(output, /util-template-block/);
  assert.match(output, /data-material-id="A5-M5"/);
  assert.match(output, /data-material-type="template"/);
  assert.ok(output.length > 0);
});

test("vNext heteroscedasticity fixture renders each material and expected output exactly once", () => {
  const { source, model } = loadModel();
  const html = renderPage(model);
  const sourceMaterialIds = source.activities.flatMap((activity) =>
    activity.materials.map((material) => material.material_id)
  );

  sourceMaterialIds.forEach((materialId) => {
    assert.equal(
      countOccurrences(html, `data-material-id="${materialId}"`),
      1,
      `expected material ${materialId} once`
    );
  });

  const checklistIds = model.activities.flatMap((activity) =>
    activity.beats.flatMap((beat) =>
      beat.materials
        .filter((material) => material.type === "checklist")
        .map((material) => material.id)
    )
  );
  checklistIds.forEach((materialId) => {
    assert.equal(countOccurrences(html, `data-material-id="${materialId}"`), 1);
  });

  model.activities.forEach((activity) => {
    const expectedCount = activity.beats.filter((beat) => beat.expectedOutput !== null).length;
    const activityHtml = extractActivityHtml(
      html,
      activity.id,
      model.activities.map((candidate) => candidate.id)
    );
    assert.equal(
      countOccurrences(activityHtml, "util-expected-output"),
      expectedCount,
      `expected output count for ${activity.id}`
    );
  });

  assert.deepEqual(
    model.activities.map((activity) => activity.id),
    ["A1", "A2", "A3", "A4", "A5"]
  );

  model.activities.forEach((activity) => {
    activity.beats.forEach((beat) => {
      assert.match(html, new RegExp(`>${beat.learnerLabel}<`));
    });
  });
});

test("vNext material renderer preserves wrapper metadata for supported kinds", () => {
  const { model } = loadModel();
  const material = materialById(model, "A5-M8");
  const output = renderMaterial(material);

  assert.match(output, /data-material-id="A5-M8"/);
  assert.match(output, /data-material-type="consolidation_summary"/);
  assert.match(output, /data-body-format="markdown"/);
  assert.doesNotMatch(output, /data-render-status="unsupported"/);
});

test("vNext page renderer emits page title once in the page header", () => {
  const { model } = loadModel();
  const output = renderPage(model);

  assert.equal(countOccurrences(output, "<h1>"), 1);
  assert.match(output, /<h1>Why Does the Spread of Regression Errors Matter\? Understanding Heteroscedasticity<\/h1>/);
  assert.match(output, /class="util-page-header/);
});

test("vNext page renderer emits orientation sections with markdown before activities", () => {
  const { model } = loadModel();
  const output = renderPage(model);

  assert.match(output, /data-region="orientation"/);
  assert.match(output, /data-orientation-type="overview"/);
  assert.match(output, /data-orientation-type="learning_purpose"/);
  assert.match(output, /data-orientation-type="knowledge_summary"/);
  assert.match(output, /heteroscedasticity, a common issue in applied economic regression analysis/);
  assert.match(output, /<ul>/);
  const activityStart = output.indexOf('data-region="activities"');
  const orientationStart = output.indexOf('data-region="orientation"');
  assert.ok(orientationStart >= 0 && orientationStart < activityStart);
});

test("vNext page renderer emits assessment guidance from model items", () => {
  const { model } = loadModel();
  const output = renderPage(model);

  assert.match(output, /util-assessment-guidance/);
  assert.match(output, /util-assessment-item/);
  assert.match(output, /Which statement best describes heteroscedasticity in a regression model\?/);
  assert.match(output, /util-assessment-options/);
  assert.doesNotMatch(output, /item_type/);
  assert.doesNotMatch(output, /single_answer_mcq/);
});

test("vNext page renderer emits study tips with markdown list content", () => {
  const { model } = loadModel();
  const output = renderPage(model);

  assert.match(output, /<aside class="util-study-tips"/);
  assert.match(output, /Focus on the spread of residuals, not the existence of residuals/);
  assert.match(output, /util-study-tips__content/);
});

test("vNext page renderer omits absent page-level sections", () => {
  const minimal = {
    title: "Minimal page",
    header: { description: "", durationMinutes: null },
    orientationSections: [],
    activities: [],
    assessment: { items: [] },
    studyTips: ""
  };
  const output = renderPage(minimal);

  assert.match(output, /<h1>Minimal page<\/h1>/);
  assert.doesNotMatch(output, /data-region="orientation"/);
  assert.doesNotMatch(output, /data-region="activities"/);
  assert.doesNotMatch(output, /util-assessment-guidance/);
  assert.doesNotMatch(output, /util-study-tips/);
});

test("vNext activity renderer emits title and preamble outside beat sections", () => {
  const activity = loadModel().model.activities.find((candidate) => candidate.id === "A1");
  const output = renderActivity(activity);

  assert.match(output, /<h2 class="util-activity-title">Defining Heteroscedasticity and Homoscedasticity<\/h2>/);
  assert.match(output, /util-activity-preamble/);
  assert.match(output, /foundational mental model of residual variance/);
  const preambleIndex = output.indexOf("util-activity-preamble");
  const beatIndex = output.indexOf("util-beat-section");
  assert.ok(preambleIndex >= 0 && beatIndex >= 0 && preambleIndex < beatIndex);
});

test("vNext activity renderer emits reasoning orientation outside beat sections", () => {
  const activity = loadModel().model.activities.find((candidate) => candidate.id === "A1");
  const output = renderActivity(activity);

  assert.match(output, /util-reasoning-orientation/);
  assert.match(output, /How to think/);
  assert.match(output, /data-guidance-type="reasoning_orientation"/);
  assert.match(output, /spread of errors rather than the existence of errors/);
  const reasoningIndex = output.indexOf("util-reasoning-orientation");
  const beatIndex = output.indexOf("util-beat-section");
  assert.ok(reasoningIndex >= 0 && beatIndex >= 0 && reasoningIndex < beatIndex);
});

test("vNext activity renderer omits empty activity framing wrappers", () => {
  const activity = loadModel().model.activities.find((candidate) => candidate.id === "A2");
  const output = renderActivity(
    Object.assign({}, activity, { preamble: "", reasoningOrientation: "" })
  );

  assert.doesNotMatch(output, /util-activity-framing/);
  assert.doesNotMatch(output, /util-activity-preamble/);
  assert.doesNotMatch(output, /util-reasoning-orientation/);
  assert.match(output, /util-beat-section/);
});

test("vNext page framing appears once and does not duplicate overview in header", () => {
  const { model } = loadModel();
  const output = renderPage(model);

  assert.equal(countOccurrences(output, 'data-orientation-type="overview"'), 1);
  assert.equal(
    countOccurrences(output, "heteroscedasticity, a common issue in applied economic regression analysis"),
    1
  );
});
