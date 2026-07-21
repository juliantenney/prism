"use strict";

/**
 * Sprint 68 — S68-IMP-009 Activity 4 composition and prompt-set workspace tests.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildPageModel,
  buildComposedPageModel,
  buildActivityCompositionMap,
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext");
const {
  composeLearnMoment,
  composeDoMoment,
  composeCheckMoment,
  A4_LEARN_STEP_NUMBERS,
  A4_LEARN_MATERIAL_IDS_BY_STEP,
  A4_DO_STEP_NUMBERS,
  A4_DO_MATERIAL_IDS_BY_STEP,
  A4_CHECK_STEP_NUMBERS,
  A4_CHECK_MATERIAL_IDS
} = require("../lib/learner-renderer-vnext/compose-activity-moments");
const { determineWorkspaceRequirement } = require("../lib/learner-renderer-vnext/compose-workspace");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function buildGoldenContext() {
  const sourcePage = loadFixture();
  const modelResult = buildPageModel(sourcePage);
  assert.equal(modelResult.ok, true);
  const a4 = modelResult.model.activities.find((activity) => activity.id === "A4");
  assert.ok(a4);
  return { sourcePage, modelResult, a4 };
}

function extractActivityHtml(html, activityId) {
  const source = String(html || "");
  const marker = 'id="activity-' + activityId + '"';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return "";

  const openTagStart = source.lastIndexOf("<article", markerIndex);
  if (openTagStart < 0) return "";

  const tagRe = /<(\/?)article\b[^>]*>/gi;
  tagRe.lastIndex = openTagStart;
  let depth = 0;
  let match;
  while ((match = tagRe.exec(source)) !== null) {
    if (match[1]) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return source.slice(openTagStart, tagRe.lastIndex);
    }
  }
  return "";
}

function momentHtml(html, kind) {
  const marker = 'data-composition-moment="' + kind + '"';
  const start = html.indexOf(marker);
  if (start < 0) return "";
  const sectionStart = html.lastIndexOf("<section", start);
  const sectionEnd = html.indexOf("</section>", start);
  if (sectionStart < 0 || sectionEnd < 0) return "";
  return html.slice(sectionStart, sectionEnd + "</section>".length);
}

test("adapter: A4 receives four composed moments in order", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments",
    activityIds: ["A4"]
  });

  assert.equal(composedResult.ok, true);
  const activity = composedResult.composed.activities.find((entry) => entry.id === "A4");
  assert.ok(activity);
  assert.deepEqual(
    activity.moments.map((moment) => moment.kind),
    ["orient", "learn", "do", "check"]
  );
});

test("adapter: A4 Learn includes explanation materials only", () => {
  const { a4 } = buildGoldenContext();
  const learnMoment = composeLearnMoment(a4);
  assert.ok(learnMoment);

  assert.deepEqual(
    learnMoment.items
      .filter((item) => item.kind === "instruction")
      .map((item) => item.instruction.sourceStepNumber),
    A4_LEARN_STEP_NUMBERS
  );
  assert.deepEqual(
    learnMoment.items
      .filter((item) => item.kind === "material")
      .map((item) => item.material.id),
    [...A4_LEARN_MATERIAL_IDS_BY_STEP[1], ...A4_LEARN_MATERIAL_IDS_BY_STEP[2]]
  );

  const doMoment = composeDoMoment(a4);
  assert.ok(
    !learnMoment.items.some((item) => item.kind === "material" && item.material.id === "A4-M3")
  );
  assert.ok(doMoment);
});

test("adapter: A4 Do uses one combined text_entry workspace for prompt set", () => {
  const { a4 } = buildGoldenContext();
  const doMoment = composeDoMoment(a4);
  assert.ok(doMoment);

  assert.deepEqual(
    doMoment.items
      .filter((item) => item.kind === "instruction")
      .map((item) => item.instruction.sourceStepNumber),
    A4_DO_STEP_NUMBERS
  );
  assert.deepEqual(
    doMoment.items
      .filter((item) => item.kind === "material")
      .map((item) => item.material.id),
    A4_DO_MATERIAL_IDS_BY_STEP[3]
  );
  assert.equal(doMoment.items.filter((item) => item.kind === "material").length, 1);
  const promptMaterial = doMoment.items.find(
    (item) => item.kind === "material" && item.material && item.material.id === "A4-M3"
  );
  assert.ok(promptMaterial);
  assert.notEqual(promptMaterial.tableWorkspace, true);

  assert.ok(doMoment.workspace);
  assert.equal(doMoment.workspace.capability, "text_entry");
  assert.equal(doMoment.workspace.sourceStepNumber, 3);
  assert.equal(doMoment.workspace.responseLabel, "Explain the chain of effects");

  const workspace = determineWorkspaceRequirement("A4", {
    sourceStepNumber: 3,
    text: "Complete the prompt set by explaining each stage in the chain of effects."
  });
  assert.ok(workspace);
  assert.equal(workspace.capability, "text_entry");
});

test("adapter: A4 Check includes checklist verification only", () => {
  const { a4 } = buildGoldenContext();
  const checkMoment = composeCheckMoment(a4);
  assert.ok(checkMoment);

  assert.deepEqual(
    checkMoment.items
      .filter((item) => item.kind === "instruction")
      .map((item) => item.instruction.sourceStepNumber),
    A4_CHECK_STEP_NUMBERS
  );
  assert.deepEqual(
    checkMoment.items
      .filter((item) => item.kind === "material")
      .map((item) => item.material.id),
    A4_CHECK_MATERIAL_IDS
  );
  assert.ok(!checkMoment.items.some((item) => item.kind === "prompt"));
});

test("render slice: A4 Do preserves prompt set once with single textarea workspace", () => {
  const { sourcePage } = buildGoldenContext();
  const a4Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A4"
  );
  const doHtml = momentHtml(a4Html, "do");

  assert.match(doHtml, /data-material-id="A4-M3"/);
  assert.match(doHtml, /What changes in the residuals/);
  assert.match(doHtml, /How could this affect a research conclusion/);
  assert.equal((doHtml.match(/data-material-id="A4-M3"/g) || []).length, 1);
  assert.equal((doHtml.match(/util-learner-workspace__input/g) || []).length, 1);
  assert.equal((doHtml.match(/<textarea/g) || []).length, 1);
  assert.match(doHtml, /Explain the chain of effects/);
  assert.match(doHtml, /util-composition-expected-output/);
  assert.doesNotMatch(doHtml, /util-learner-table-workspace/);
});

test("render slice: A4 beats mode unchanged with static prompt set", () => {
  const { sourcePage } = buildGoldenContext();
  const a4Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html,
    "A4"
  );

  assert.match(a4Html, /data-material-id="A4-M3"/);
  assert.doesNotMatch(a4Html, /util-learner-workspace/);
  assert.doesNotMatch(a4Html, /<textarea/);
  assert.match(a4Html, /data-beat-function="application"/);
});

test("composition map: A4 beat anchors and suppression hints", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments",
    activityIds: ["A4"]
  });
  const map = buildActivityCompositionMap(composedResult.composed);

  assert.equal(map.A4.learnMomentBeat, "explanation");
  assert.equal(map.A4.doMomentBeat, "application");
  assert.equal(map.A4.checkMomentBeat, "check_understanding");

  assert.deepEqual(map.A4.suppressBeatContent.explanation.omitMaterialIds, ["A4-M1", "A4-M2"]);
  assert.deepEqual(map.A4.suppressBeatContent.explanation.omitInstructionSteps, [1, 2]);
  assert.deepEqual(map.A4.suppressBeatContent.application.omitMaterialIds, ["A4-M3"]);
  assert.deepEqual(map.A4.suppressBeatContent.application.omitInstructionSteps, [3]);
  assert.deepEqual(map.A4.suppressBeatContent.check_understanding.omitMaterialIds, ["A4-M4"]);
  assert.deepEqual(map.A4.suppressBeatContent.check_understanding.omitInstructionSteps, [4]);
  assert.equal(map.A4.suppressBeatContent.check_understanding.omitExpectedOutput, true);

  const html = renderPage(modelResult.model, { activityComposition: map });
  assert.doesNotMatch(extractActivityHtml(html, "A4"), /data-beat-function="/);
});

test("regression: A1–A3 unchanged; A5 remains beats in moments export", () => {
  const sourcePage = loadFixture();
  const beatsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html;
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;

  assert.equal((extractActivityHtml(momentsHtml, "A1").match(/data-composition-moment="/g) || []).length, 4);
  assert.match(extractActivityHtml(momentsHtml, "A2"), /data-workspace-kind="table_entry"/);
  assert.match(extractActivityHtml(momentsHtml, "A3"), /data-workspace-kind="table_entry"/);
  assert.equal((extractActivityHtml(momentsHtml, "A4").match(/data-composition-moment="/g) || []).length, 4);
  assert.match(extractActivityHtml(momentsHtml, "A4"), /util-learner-workspace__input/);

  const a5Moments = extractActivityHtml(momentsHtml, "A5");
  assert.equal((a5Moments.match(/data-composition-moment="/g) || []).length, 4);
  assert.match(a5Moments, /data-workspace-kind="table_entry"/);
  assert.match(a5Moments, /data-workspace-capability="text_entry"/);
  assert.notEqual(a5Moments, extractActivityHtml(beatsHtml, "A5"));
});
