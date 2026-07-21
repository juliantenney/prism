"use strict";

/**
 * Sprint 68 — S68-IMP-006 Activity 2 composition (static workspace) tests.
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
  A2_LEARN_STEP_NUMBERS,
  A2_LEARN_MATERIAL_IDS,
  A2_DO_STEP_NUMBERS,
  A2_DO_MATERIAL_IDS_BY_STEP,
  A2_CHECK_STEP_NUMBERS,
  A2_CHECK_MATERIAL_IDS
} = require("../lib/learner-renderer-vnext/compose-activity-moments");
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
  const a2 = modelResult.model.activities.find((activity) => activity.id === "A2");
  assert.ok(a2);
  return { sourcePage, modelResult, a2 };
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

function getA2Moments(composedResult) {
  const activity = composedResult.composed.activities.find((entry) => entry.id === "A2");
  assert.ok(activity);
  return activity.moments;
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

test("adapter: A2 receives four composed moments in order", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments",
    activityIds: ["A2"]
  });

  assert.equal(composedResult.ok, true);
  assert.equal(composedResult.composed.activities.length, 1);
  const kinds = getA2Moments(composedResult).map((moment) => moment.kind);
  assert.deepEqual(kinds, ["orient", "learn", "do", "check"]);
});

test("adapter: A2-M1 appears only in Learn moment", () => {
  const { a2 } = buildGoldenContext();
  const learnMoment = composeLearnMoment(a2);
  assert.ok(learnMoment);

  const materialIds = learnMoment.items
    .filter((item) => item.kind === "material")
    .map((item) => item.material.id);
  assert.deepEqual(materialIds, A2_LEARN_MATERIAL_IDS);
  assert.deepEqual(
    learnMoment.items
      .filter((item) => item.kind === "instruction")
      .map((item) => item.instruction.sourceStepNumber),
    A2_LEARN_STEP_NUMBERS
  );

  const doMoment = composeDoMoment(a2);
  const checkMoment = composeCheckMoment(a2);
  assert.ok(doMoment);
  assert.ok(checkMoment);
  assert.ok(
    !doMoment.items.some((item) => item.kind === "material" && item.material.id === "A2-M1")
  );
  assert.ok(
    !checkMoment.items.some((item) => item.kind === "material" && item.material.id === "A2-M1")
  );
});

test("adapter: A2-M2 appears only in Do moment as completion table workspace", () => {
  const { a2 } = buildGoldenContext();
  const doMoment = composeDoMoment(a2);
  assert.ok(doMoment);

  const materialIds = doMoment.items
    .filter((item) => item.kind === "material")
    .map((item) => item.material.id);
  assert.deepEqual(materialIds, ["A2-M3", "A2-M2"]);

  const learnMoment = composeLearnMoment(a2);
  const checkMoment = composeCheckMoment(a2);
  assert.ok(
    !learnMoment.items.some((item) => item.kind === "material" && item.material.id === "A2-M2")
  );
  assert.ok(
    !checkMoment.items.some((item) => item.kind === "material" && item.material.id === "A2-M2")
  );
});

test("adapter: A2 Do moment does not create a standalone workspace (Rule 3)", () => {
  const { a2 } = buildGoldenContext();
  const doMoment = composeDoMoment(a2);
  assert.ok(doMoment);
  assert.equal(doMoment.workspace, null);
});

test("adapter: A2 Do moment includes scenarios, analysis table, and expected output", () => {
  const { a2 } = buildGoldenContext();
  const doMoment = composeDoMoment(a2);
  assert.ok(doMoment);

  const instructionSteps = doMoment.items
    .filter((item) => item.kind === "instruction")
    .map((item) => item.instruction.sourceStepNumber);
  assert.deepEqual(instructionSteps, A2_DO_STEP_NUMBERS);

  const materialIds = doMoment.items
    .filter((item) => item.kind === "material")
    .map((item) => item.material.id);
  assert.deepEqual(materialIds, ["A2-M3", "A2-M2"]);

  assert.ok(doMoment.expectedOutput);
  assert.match(doMoment.expectedOutput.text, /successful analysis identifies/i);
});

test("render slice: A2 moments HTML has table workspace in Do and no textarea workspace", () => {
  const { sourcePage } = buildGoldenContext();
  const a2Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A2"
  );

  assert.doesNotMatch(a2Html, /data-beat-function="/);
  assert.equal((a2Html.match(/data-composition-moment="/g) || []).length, 4);
  assert.doesNotMatch(a2Html, /util-learner-workspace/);
  assert.doesNotMatch(a2Html, /<textarea/);

  const learnHtml = momentHtml(a2Html, "learn");
  const doHtml = momentHtml(a2Html, "do");
  assert.equal((learnHtml.match(/data-material-id="A2-M1"/g) || []).length, 1);
  assert.doesNotMatch(learnHtml, /data-material-id="A2-M2"/);
  assert.equal((doHtml.match(/data-workspace-kind="table_entry"/g) || []).length, 1);
  assert.equal((doHtml.match(/data-material-id="A2-M2"/g) || []).length, 2);
  assert.equal((doHtml.match(/data-material-id="A2-M3"/g) || []).length, 1);
  assert.doesNotMatch(doHtml, /data-material-id="A2-M1"/);
});

test("render slice: A2 analysis table renders as interactive table workspace in Do", () => {
  const { sourcePage } = buildGoldenContext();
  const doHtml = momentHtml(
    extractActivityHtml(renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html, "A2"),
    "do"
  );

  assert.match(doHtml, /util-learner-table-workspace/);
  assert.match(doHtml, /util-learner-table-workspace__input/);
  assert.equal((doHtml.match(/util-learner-table-workspace__input/g) || []).length, 9);
});

test("render slice: A1 unchanged and A5 remains beats mode in moments export", () => {
  const sourcePage = loadFixture();
  const beatsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html;
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;

  const a1Beats = extractActivityHtml(beatsHtml, "A1");
  const a1Moments = extractActivityHtml(momentsHtml, "A1");
  assert.notEqual(a1Beats, a1Moments);
  assert.equal((a1Moments.match(/data-composition-moment="/g) || []).length, 4);
  assert.match(a1Moments, /util-learner-workspace__input/);
});

test("composition map: A2 exposes beat anchors and suppression hints", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments",
    activityIds: ["A2"]
  });
  const map = buildActivityCompositionMap(composedResult.composed);

  assert.ok(map.A2.learnMoment);
  assert.ok(map.A2.doMoment);
  assert.ok(map.A2.checkMoment);
  assert.equal(map.A2.learnMomentBeat, "worked_example");
  assert.equal(map.A2.doMomentBeat, "analysis");
  assert.equal(map.A2.checkMomentBeat, "check_understanding");

  assert.deepEqual(map.A2.suppressBeatContent.worked_example.omitMaterialIds, ["A2-M1"]);
  assert.deepEqual(map.A2.suppressBeatContent.analysis.omitMaterialIds.sort(), [
    "A2-M2",
    "A2-M3"
  ]);
  assert.deepEqual(map.A2.suppressBeatContent.analysis.omitInstructionSteps, [2, 3, 4]);
  assert.equal(map.A2.suppressBeatContent.check_understanding.omitExpectedOutput, true);
  assert.deepEqual(map.A2.suppressBeatContent.check_understanding.omitMaterialIds, ["A2-M4"]);
  assert.deepEqual(map.A2.suppressBeatContent.check_understanding.omitInstructionSteps, [5]);

  const html = renderPage(modelResult.model, { activityComposition: map });
  const a2Html = extractActivityHtml(html, "A2");
  assert.doesNotMatch(a2Html, /data-beat-function="/);
});

test("adapter: A2 Check moment uses checklist verification pattern", () => {
  const { a2 } = buildGoldenContext();
  const checkMoment = composeCheckMoment(a2);
  assert.ok(checkMoment);

  assert.deepEqual(
    checkMoment.items
      .filter((item) => item.kind === "instruction")
      .map((item) => item.instruction.sourceStepNumber),
    A2_CHECK_STEP_NUMBERS
  );
  assert.deepEqual(
    checkMoment.items
      .filter((item) => item.kind === "material")
      .map((item) => item.material.id),
    A2_CHECK_MATERIAL_IDS
  );
  assert.match(checkMoment.learnerGuidance, /Complete your response first/i);
});
