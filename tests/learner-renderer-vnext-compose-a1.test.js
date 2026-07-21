"use strict";

/**
 * Sprint 68 — A1 Orient composition adapter and vertical slice tests.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildPageModel,
  buildComposedPageModel,
  buildActivityCompositionMap,
  renderLearnerPageHtml,
  normalizeCompositionMode
} = require("../lib/learner-renderer-vnext");
const { composeOrientMoment } = require("../lib/learner-renderer-vnext/compose-activity-moments");
const { buildSequenceContext } = require("../lib/learner-renderer-vnext/compose-sequence-context");
const { renderPage } = require("../lib/learner-renderer-vnext/render-page");

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

const EXPECTED_ORIENT_ROLES = [
  "studyPhase",
  "activityPurpose",
  "activity_preamble",
  "reasoning_orientation"
];

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

test("normalizeCompositionMode: defaults to moments and accepts beats", () => {
  assert.equal(normalizeCompositionMode(undefined), "moments");
  assert.equal(normalizeCompositionMode(""), "moments");
  assert.equal(normalizeCompositionMode("beats"), "beats");
  assert.equal(normalizeCompositionMode("moments"), "moments");
  assert.throws(() => normalizeCompositionMode("invalid"), /Unsupported learner composition mode/);
});

test("adapter: A1 Orient moment is created from heteroscedasticity fixture", () => {
  const { sourcePage, modelResult, a1 } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });

  assert.equal(composedResult.ok, true);
  assert.ok(composedResult.composed);
  assert.equal(composedResult.composed.mode, "moments");
  assert.equal(composedResult.composed.activities.length, 5);
  assert.equal(composedResult.composed.activities[0].id, "A1");
  assert.equal(composedResult.composed.activities[1].id, "A2");
  assert.equal(composedResult.composed.activities[2].id, "A3");
  assert.equal(composedResult.composed.activities[3].id, "A4");
  assert.equal(composedResult.composed.activities[4].id, "A5");

  const orient = composedResult.composed.activities[0].moments.find(
    (moment) => moment.kind === "orient"
  );
  assert.ok(orient);
  assert.ok(orient.items.length >= 5);

  const roles = orient.items
    .filter((item) => item.kind === "compositionText")
    .map((item) => item.role);
  EXPECTED_ORIENT_ROLES.forEach((role) => assert.ok(roles.includes(role)));

  const introPrompt = orient.items.find(
    (item) =>
      item.kind === "prompt" &&
      item.prompt &&
      item.prompt.sourceField === "self_explanation_prompt"
  );
  assert.ok(introPrompt);
  assert.match(introPrompt.prompt.text, /two regressions can have residuals/i);

  const sequenceContext = buildSequenceContext(sourcePage);
  const directOrient = composeOrientMoment(a1, sequenceContext);
  assert.deepEqual(directOrient.items, orient.items);
});

test("adapter: source order and source identity are preserved", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });
  const orient = composedResult.composed.activities[0].moments.find(
    (moment) => moment.kind === "orient"
  );
  assert.ok(orient);

  assert.equal(orient.items[0].role, "studyPhase");
  assert.equal(orient.items[0].sourceRef.sourceField, "learning_sequence.study_flow.phase");
  assert.equal(orient.items[1].role, "activityPurpose");
  assert.equal(orient.items[2].sourceRef.sourceField, "activity_preamble");
  assert.equal(orient.items[3].sourceRef.sourceField, "reasoning_orientation");
  assert.equal(orient.items[4].prompt.sourceField, "self_explanation_prompt");
  assert.equal(orient.items[4].sourceRef.beatFunction, "orientation");

  assert.match(orient.items[0].text, /Build understanding/i);
  assert.match(orient.items[1].text, /foundational understanding/i);
  assert.match(orient.items[2].text, /foundational mental model/i);
  assert.match(orient.items[3].text, /spread of errors/i);
});

test("adapter: input page model and source page are not mutated", () => {
  const { sourcePage, modelResult, a1 } = buildGoldenContext();
  const sourceSnapshot = JSON.stringify(sourcePage);
  const preambleBefore = a1.preamble;
  const beatsBefore = JSON.stringify(a1.beats);

  buildComposedPageModel(modelResult, sourcePage, { compositionMode: "moments" });

  assert.equal(JSON.stringify(sourcePage), sourceSnapshot);
  assert.equal(a1.preamble, preambleBefore);
  assert.equal(JSON.stringify(a1.beats), beatsBefore);
});

test("adapter: missing learning_sequence fields degrade safely", () => {
  const { sourcePage, modelResult, a1 } = buildGoldenContext();
  const strippedPage = JSON.parse(JSON.stringify(sourcePage));
  delete strippedPage.learning_sequence;

  const composedResult = buildComposedPageModel(modelResult, strippedPage, {
    compositionMode: "moments"
  });
  assert.equal(composedResult.ok, true);

  const orient = composedResult.composed.activities[0].moments.find(
    (moment) => moment.kind === "orient"
  );
  assert.ok(orient);
  const roles = orient.items
    .filter((item) => item.kind === "compositionText")
    .map((item) => item.role);

  assert.ok(!roles.includes("studyPhase"));
  assert.ok(!roles.includes("activityPurpose"));
  assert.ok(roles.includes("activity_preamble"));
  assert.ok(roles.includes("reasoning_orientation"));
  assert.ok(orient.items.some((item) => item.kind === "prompt"));

  const emptyContext = buildSequenceContext({});
  const orientFromModel = composeOrientMoment(a1, emptyContext);
  assert.ok(orientFromModel);
  assert.equal(orientFromModel.items.length, 3);
});

test("render slice: moments mode renders one composed Orient section for A1", () => {
  const sourcePage = loadFixture();
  const rendered = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" });
  assert.equal(rendered.error, null);
  assert.ok(rendered.composedResult);

  const a1Html = extractActivityHtml(rendered.html, "A1");
  assert.match(a1Html, /data-composition-moment="orient"/);
  assert.equal(
    (a1Html.match(/data-composition-moment="orient"/g) || []).length,
    1
  );
  assert.match(a1Html, /util-composition-study-phase/);
  assert.match(a1Html, /Build understanding/);
  assert.match(a1Html, /foundational mental model/i);
  assert.match(a1Html, /spread of errors/i);
  assert.match(a1Html, /two regressions can have residuals/i);
});

test("render slice: original Orient source fields are not rendered twice in A1", () => {
  const sourcePage = loadFixture();
  const beatsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html;
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;

  const beatsA1 = extractActivityHtml(beatsHtml, "A1");
  const momentsA1 = extractActivityHtml(momentsHtml, "A1");

  assert.match(beatsA1, /util-activity-preamble/);
  assert.match(beatsA1, /data-guidance-type="reasoning_orientation"/);
  assert.match(beatsA1, /data-beat-function="orientation"/);

  assert.doesNotMatch(momentsA1, /util-activity-preamble/);
  assert.doesNotMatch(momentsA1, /data-guidance-type="reasoning_orientation"/);
  assert.doesNotMatch(momentsA1, /data-beat-function="orientation"/);
  assert.doesNotMatch(momentsA1, /Explain it to yourself/);
  assert.doesNotMatch(momentsA1, /data-learner-role="reflect"/);
});

test("render slice: remaining A1 beat content still renders", () => {
  const sourcePage = loadFixture();
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const a1Html = extractActivityHtml(momentsHtml, "A1");

  assert.match(a1Html, /data-composition-moment="learn"/);
  assert.doesNotMatch(a1Html, /data-beat-function="explanation"/);
  assert.match(a1Html, /data-material-id="A1-M1"/);
  assert.match(a1Html, /data-composition-moment="do"/);
  assert.match(a1Html, /data-material-id="A1-M2"/);
  assert.match(a1Html, /Residual Variance and Heteroscedasticity/);
  assert.match(a1Html, /Compare the sample response with the explanation/i);
});

test("render slice: default rendering uses moments mode", () => {
  const sourcePage = loadFixture();
  const explicitBeats = renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html;
  const explicitMoments = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const defaultHtml = renderLearnerPageHtml(sourcePage).html;
  assert.equal(defaultHtml, explicitMoments);
  assert.notEqual(defaultHtml, explicitBeats);
  assert.match(defaultHtml, /data-composition-mode="moments"/);
});

test("render slice: other activities remain on existing rendering path", () => {
  const sourcePage = loadFixture();
  const beatsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html;
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;

  const a2Moments = extractActivityHtml(momentsHtml, "A2");
  assert.match(a2Moments, /data-composition-moment="orient"/);
  const a3Moments = extractActivityHtml(momentsHtml, "A3");
  assert.match(a3Moments, /data-composition-moment="orient"/);
  const a4Moments = extractActivityHtml(momentsHtml, "A4");
  assert.match(a4Moments, /data-composition-moment="orient"/);
});

test("render slice: output remains deterministic", () => {
  const sourcePage = loadFixture();
  const first = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const second = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  assert.equal(first, second);
});

test("render hints: activity composition map drives page render options", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });
  const map = buildActivityCompositionMap(composedResult.composed);

  assert.ok(map.A1);
  assert.ok(map.A1.orientMoment);
  assert.ok(map.A1.learnMoment);
  assert.ok(map.A1.doMoment);
  assert.ok(map.A1.checkMoment);
  assert.equal(map.A1.suppressFraming, true);
  assert.deepEqual(map.A1.omitBeatFunctions, ["orientation"]);
  assert.deepEqual(map.A1.suppressBeatContent.explanation.omitInstructionSteps, [1]);
  assert.deepEqual(map.A1.suppressBeatContent.explanation.omitMaterialIds, ["A1-M1"]);
  assert.deepEqual(map.A1.suppressBeatContent.check_understanding.omitInstructionSteps, [2, 3, 4, 5]);
  assert.deepEqual(map.A1.suppressBeatContent.check_understanding.omitMaterialIds, [
    "A1-M2",
    "A1-M3",
    "A1-M4"
  ]);

  const html = renderPage(modelResult.model, { activityComposition: map });
  const a1Html = extractActivityHtml(html, "A1");
  assert.match(a1Html, /data-composition-moment="orient"/);
  assert.doesNotMatch(a1Html, /data-beat-function="orientation"/);
});
