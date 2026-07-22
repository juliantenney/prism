"use strict";

/**
 * Sprint 68 — A1 Do moment composition and workspace vertical slice tests.
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
  composeDoMoment,
  A1_DO_STEP_NUMBERS,
  A1_DO_MATERIAL_IDS
} = require("../lib/learner-renderer-vnext/compose-activity-moments");
const {
  determineWorkspaceRequirement,
  A1_WRITTEN_RESPONSE_STEP
} = require("../lib/learner-renderer-vnext/compose-workspace");
const { applyBeatContentSuppression } = require("../lib/learner-renderer-vnext/compose-beat-suppression");
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
  const a1 = modelResult.model.activities.find((activity) => activity.id === "A1");
  assert.ok(a1);
  return { sourcePage, modelResult, a1 };
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
  var depth = 0;
  var match;
  while ((match = tagRe.exec(source)) !== null) {
    if (match[1]) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return source.slice(openTagStart, tagRe.lastIndex);
    }
  }
  return "";
}

function getA1Moments(composedResult) {
  return composedResult.composed.activities[0].moments;
}

test("adapter: A1 receives exactly one Do moment in moments mode", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });

  const doMoments = getA1Moments(composedResult).filter((moment) => moment.kind === "do");
  assert.equal(doMoments.length, 1);
  assert.equal(doMoments[0].kind, "do");
});

test("adapter: Do moment preserves authoritative task text and source ordering", () => {
  const { a1 } = buildGoldenContext();
  const doMoment = composeDoMoment(a1);
  assert.ok(doMoment);

  const instructionSteps = doMoment.items
    .filter((item) => item.kind === "instruction")
    .map((item) => item.instruction.sourceStepNumber);
  assert.deepEqual(instructionSteps, A1_DO_STEP_NUMBERS);

  assert.match(doMoment.items[0].instruction.text, /Work through the expert example/i);
  assert.match(
    doMoment.items.find((item) => item.kind === "material").material.id,
    /A1-M2/
  );
  assert.match(
    doMoment.items.find((item) => item.instruction && item.instruction.sourceStepNumber === 5)
      .instruction.text,
    /Write a brief explanation/i
  );

  assert.equal(doMoment.items[0].sourceRef.beatFunction, "check_understanding");
  assert.equal(doMoment.items[1].sourceRef.materialId, "A1-M2");
});

test("adapter: expected output is represented explicitly in Do moment", () => {
  const { a1 } = buildGoldenContext();
  const doMoment = composeDoMoment(a1);
  assert.ok(doMoment.expectedOutput);
  assert.match(doMoment.expectedOutput.text, /clearly defines both homoscedasticity and heteroscedasticity/i);

  const expectedItem = doMoment.items.find((item) => item.kind === "expectedOutput");
  assert.ok(expectedItem);
  assert.equal(expectedItem.sourceRef.sourceField, "expected_output");
});

test("adapter: workspace requirement is separate from task content", () => {
  const { a1 } = buildGoldenContext();
  const doMoment = composeDoMoment(a1);
  assert.ok(doMoment.workspace);
  assert.equal(doMoment.workspace.sourceStepNumber, A1_WRITTEN_RESPONSE_STEP);
  assert.equal(doMoment.workspace.mode, "inline");
  assert.equal(doMoment.workspace.capability, "text_entry");
  assert.equal(doMoment.workspace.persistenceAvailable, true);
  assert.match(doMoment.workspace.instruction, /Write a brief explanation/i);
  assert.match(doMoment.workspace.guidance, /saved on this device/i);

  const workspaceRule = determineWorkspaceRequirement(
    doMoment.taskSteps.find((step) => step.sourceStepNumber === 5)
  );
  assert.ok(workspaceRule);
  assert.equal(workspaceRule.capability, doMoment.workspace.capability);
  assert.equal(workspaceRule.sourceStepNumber, doMoment.workspace.sourceStepNumber);
});

test("adapter: missing optional expected output degrades safely", () => {
  const { a1 } = buildGoldenContext();
  const clone = JSON.parse(JSON.stringify(a1));
  const checkBeat = clone.beats.find((beat) => beat.sourceFunction === "check_understanding");
  checkBeat.expectedOutput = null;

  const doMoment = composeDoMoment(clone);
  assert.ok(doMoment);
  assert.equal(doMoment.expectedOutput, null);
  assert.ok(!doMoment.items.some((item) => item.kind === "expectedOutput"));
  assert.ok(doMoment.workspace);
});

test("adapter: missing Do task steps degrades to no Do moment", () => {
  const { a1 } = buildGoldenContext();
  const clone = JSON.parse(JSON.stringify(a1));
  const checkBeat = clone.beats.find((beat) => beat.sourceFunction === "check_understanding");
  checkBeat.instructions = checkBeat.instructions.filter(
    (instruction) => instruction.sourceStepNumber !== 2 && instruction.sourceStepNumber !== 5
  );
  checkBeat.materials = checkBeat.materials.filter((material) => material.id !== "A1-M2");
  checkBeat.expectedOutput = null;

  assert.equal(composeDoMoment(clone), null);
});

test("adapter: composition does not mutate input models", () => {
  const { sourcePage, modelResult, a1 } = buildGoldenContext();
  const sourceSnapshot = JSON.stringify(sourcePage);
  const beatsBefore = JSON.stringify(a1.beats);

  buildComposedPageModel(modelResult, sourcePage, { compositionMode: "moments" });
  composeDoMoment(a1);

  assert.equal(JSON.stringify(sourcePage), sourceSnapshot);
  assert.equal(JSON.stringify(a1.beats), beatsBefore);
});

test("render slice: A1 renders one coherent Do section with accessible workspace", () => {
  const sourcePage = loadFixture();
  const html = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const a1Html = extractActivityHtml(html, "A1");

  assert.match(a1Html, /data-composition-moment="do"/);
  assert.equal((a1Html.match(/data-composition-moment="do"/g) || []).length, 1);
  assert.match(a1Html, /Your task/);
  assert.match(a1Html, /What to produce/);
  assert.match(a1Html, /Your response/);
  assert.match(a1Html, /<textarea[^>]*class="util-learner-workspace__input"/);
  assert.match(a1Html, /for="learner-workspace-a1-/);
  assert.match(a1Html, /saved on this device/i);
});

test("render slice: workspace claims local draft only, not submission or scoring", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.match(a1Html, /saved on this device/i);
  assert.match(a1Html, /not submitted/i);
  assert.doesNotMatch(a1Html, /score/i);
});

test("render slice: consumed Do content is not rendered twice in A1", () => {
  const sourcePage = loadFixture();
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const a1Html = extractActivityHtml(momentsHtml, "A1");
  const checkSection = a1Html.slice(a1Html.indexOf('data-composition-moment="check"'));

  assert.match(a1Html, /data-composition-moment="do"/);
  assert.match(a1Html, /data-material-id="A1-M2"/);
  assert.doesNotMatch(checkSection, /data-material-id="A1-M2"/);
  assert.doesNotMatch(checkSection, /Work through the expert example/i);
  assert.doesNotMatch(checkSection, /Write a brief explanation distinguishing homoscedasticity/i);
  assert.doesNotMatch(checkSection, /util-expected-output/);
  assert.doesNotMatch(checkSection, /util-output-block/);
});

test("render slice: explanation and composed Check content render without legacy check beat", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.match(a1Html, /data-composition-moment="learn"/);
  assert.doesNotMatch(a1Html, /data-beat-function="explanation"/);
  assert.match(a1Html, /data-material-id="A1-M1"/);
  assert.match(a1Html, /data-material-id="A1-M3"/);
  assert.match(a1Html, /data-material-id="A1-M4"/);
  assert.match(a1Html, /Compare the sample response with the explanation/i);
  assert.match(a1Html, /Complete the self-check/i);
});

test("render slice: Orient still renders exactly once after Do addition", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.equal((a1Html.match(/data-composition-moment="orient"/g) || []).length, 1);
});

test("render slice: explicit beats mode remains available and default export uses moments", () => {
  const sourcePage = loadFixture();
  const beatsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html;
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const defaultHtml = renderLearnerPageHtml(sourcePage).html;

  assert.equal(defaultHtml, momentsHtml);
  assert.notEqual(defaultHtml, beatsHtml);
});

test("render slice: Do output remains deterministic", () => {
  const sourcePage = loadFixture();
  const first = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const second = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  assert.equal(first, second);
});

test("suppression: beat content filter removes only consumed Do sources", () => {
  const { a1 } = buildGoldenContext();
  const checkBeat = a1.beats.find((beat) => beat.sourceFunction === "check_understanding");
  const filtered = applyBeatContentSuppression(checkBeat, {
    omitInstructionSteps: A1_DO_STEP_NUMBERS,
    omitMaterialIds: A1_DO_MATERIAL_IDS,
    omitExpectedOutput: true
  });

  assert.deepEqual(
    filtered.instructions.map((instruction) => instruction.sourceStepNumber),
    [3, 4]
  );
  assert.deepEqual(
    filtered.materials.map((material) => material.id),
    ["A1-M3", "A1-M4"]
  );
  assert.equal(filtered.expectedOutput, null);
});

test("composition map: exposes Do moment and beat suppression hints", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });
  const map = buildActivityCompositionMap(composedResult.composed);

  assert.ok(map.A1.doMoment);
  assert.ok(map.A1.checkMoment);
  assert.ok(map.A1.suppressBeatContent.check_understanding);
  assert.deepEqual(map.A1.suppressBeatContent.check_understanding.omitInstructionSteps, [2, 3, 4, 5]);
  assert.deepEqual(map.A1.suppressBeatContent.check_understanding.omitMaterialIds, [
    "A1-M2",
    "A1-M3",
    "A1-M4"
  ]);
  assert.equal(map.A1.suppressBeatContent.check_understanding.omitExpectedOutput, true);

  const html = renderPage(modelResult.model, { activityComposition: map });
  const a1Html = extractActivityHtml(html, "A1");
  assert.match(a1Html, /data-composition-moment="do"/);
  assert.match(a1Html, /data-composition-moment="check"/);
  assert.doesNotMatch(a1Html, /data-beat-function="check_understanding"/);
});

test("adapter: Do moment consumes exact A1 source inventory", () => {
  const { a1 } = buildGoldenContext();
  const doMoment = composeDoMoment(a1);

  assert.deepEqual(
    doMoment.taskSteps.map((step) => step.sourceStepNumber),
    [2, 5]
  );
  assert.deepEqual(
    doMoment.materials.map((material) => material.id),
    ["A1-M2"]
  );
  assert.equal(doMoment.items.filter((item) => item.kind === "instruction").length, 2);
  assert.equal(doMoment.items.filter((item) => item.kind === "material").length, 1);
  assert.equal(doMoment.items.filter((item) => item.kind === "expectedOutput").length, 1);
});
