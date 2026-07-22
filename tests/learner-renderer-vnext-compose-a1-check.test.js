"use strict";

/**
 * Sprint 68 — A1 Check moment composition and verification flow tests.
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
  composeCheckMoment,
  composeDoMoment,
  A1_CHECK_STEP_NUMBERS,
  A1_CHECK_MATERIAL_IDS,
  revealBehaviourForCheckMaterial
} = require("../lib/learner-renderer-vnext/compose-activity-moments");
const { applyBeatContentSuppression } = require("../lib/learner-renderer-vnext/compose-beat-suppression");
const { renderBeat } = require("../lib/learner-renderer-vnext/render-beat");
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

function fullCheckSuppression(map) {
  return map.A1.suppressBeatContent.check_understanding;
}

test("adapter: A1 receives exactly one Check moment in moments mode", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });

  const checkMoments = getA1Moments(composedResult).filter((moment) => moment.kind === "check");
  assert.equal(checkMoments.length, 1);
  assert.equal(checkMoments[0].kind, "check");
});

test("adapter: only verification-oriented sources are assigned to Check", () => {
  const { a1 } = buildGoldenContext();
  const checkMoment = composeCheckMoment(a1);
  assert.ok(checkMoment);

  const instructionSteps = checkMoment.items
    .filter((item) => item.kind === "instruction")
    .map((item) => item.instruction.sourceStepNumber);
  assert.deepEqual(instructionSteps, A1_CHECK_STEP_NUMBERS);

  const materialIds = checkMoment.items
    .filter((item) => item.kind === "material")
    .map((item) => item.material.id);
  assert.deepEqual(materialIds, A1_CHECK_MATERIAL_IDS);

  assert.match(
    checkMoment.items.find((item) => item.instruction && item.instruction.sourceStepNumber === 3)
      .instruction.text,
    /Compare the sample response/i
  );
  assert.match(
    checkMoment.items.find((item) => item.instruction && item.instruction.sourceStepNumber === 4)
      .instruction.text,
    /Complete the self-check/i
  );

  assert.ok(!checkMoment.items.some((item) => item.kind === "expectedOutput"));
  assert.ok(!checkMoment.items.some((item) => item.material && item.material.id === "A1-M2"));
});

test("adapter: source order and identity are preserved in Check moment", () => {
  const { a1 } = buildGoldenContext();
  const checkMoment = composeCheckMoment(a1);
  assert.ok(checkMoment);

  const kinds = checkMoment.items.map((item) => {
    if (item.kind === "instruction") return "step:" + item.instruction.sourceStepNumber;
    if (item.kind === "material") return "material:" + item.material.id;
    return item.kind;
  });
  assert.deepEqual(kinds, ["step:3", "material:A1-M3", "step:4", "material:A1-M4"]);

  checkMoment.items.forEach((item) => {
    assert.equal(item.sourceRef.beatFunction, "check_understanding");
    assert.equal(item.sourceRef.activityId, "A1");
  });
});

test("adapter: Check moment follows Do moment in composed sequence", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });
  const moments = getA1Moments(composedResult);
  const kinds = moments.map((moment) => moment.kind);
  assert.deepEqual(kinds, ["orient", "learn", "do", "check"]);
});

test("adapter: reveal behaviour is represented separately from HTML", () => {
  const { a1 } = buildGoldenContext();
  const checkMoment = composeCheckMoment(a1);
  const m3Item = checkMoment.items.find(
    (item) => item.kind === "material" && item.material.id === "A1-M3"
  );
  const m4Item = checkMoment.items.find(
    (item) => item.kind === "material" && item.material.id === "A1-M4"
  );

  assert.deepEqual(m3Item.reveal, {
    mode: "details",
    defaultOpen: false,
    summary: "Review the example response"
  });
  assert.equal(m4Item.reveal, null);
  assert.deepEqual(revealBehaviourForCheckMaterial(m3Item.material), m3Item.reveal);
  assert.equal(revealBehaviourForCheckMaterial(m4Item.material), null);
});

test("adapter: missing optional checking material degrades safely", () => {
  const { a1 } = buildGoldenContext();
  const clone = JSON.parse(JSON.stringify(a1));
  const checkBeat = clone.beats.find((beat) => beat.sourceFunction === "check_understanding");
  checkBeat.materials = checkBeat.materials.filter((material) => material.id !== "A1-M4");

  const checkMoment = composeCheckMoment(clone);
  assert.ok(checkMoment);
  assert.deepEqual(
    checkMoment.items
      .filter((item) => item.kind === "material")
      .map((item) => item.material.id),
    ["A1-M3"]
  );
  assert.equal(checkMoment.items.filter((item) => item.kind === "instruction").length, 2);
});

test("adapter: missing Check task steps degrades to no Check moment", () => {
  const { a1 } = buildGoldenContext();
  const clone = JSON.parse(JSON.stringify(a1));
  const checkBeat = clone.beats.find((beat) => beat.sourceFunction === "check_understanding");
  checkBeat.instructions = checkBeat.instructions.filter(
    (instruction) => instruction.sourceStepNumber !== 3 && instruction.sourceStepNumber !== 4
  );
  checkBeat.materials = checkBeat.materials.filter(
    (material) => material.id !== "A1-M3" && material.id !== "A1-M4"
  );

  assert.equal(composeCheckMoment(clone), null);
});

test("adapter: composition does not mutate input models", () => {
  const { sourcePage, modelResult, a1 } = buildGoldenContext();
  const sourceSnapshot = JSON.stringify(sourcePage);
  const beatsBefore = JSON.stringify(a1.beats);

  buildComposedPageModel(modelResult, sourcePage, { compositionMode: "moments" });
  composeCheckMoment(a1);
  composeDoMoment(a1);

  assert.equal(JSON.stringify(sourcePage), sourceSnapshot);
  assert.equal(JSON.stringify(a1.beats), beatsBefore);
});

test("suppression: merged filter removes all consumed Do and Check sources", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const map = buildActivityCompositionMap(
    buildComposedPageModel(modelResult, sourcePage, { compositionMode: "moments" }).composed
  );
  const { a1 } = buildGoldenContext();
  const checkBeat = a1.beats.find((beat) => beat.sourceFunction === "check_understanding");
  const filtered = applyBeatContentSuppression(checkBeat, fullCheckSuppression(map));

  assert.equal(filtered.instructions.length, 0);
  assert.equal(filtered.materials.length, 0);
  assert.equal(filtered.expectedOutput, null);
});

test("suppression: empty filtered beat renders nothing", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const map = buildActivityCompositionMap(
    buildComposedPageModel(modelResult, sourcePage, { compositionMode: "moments" }).composed
  );
  const { a1 } = buildGoldenContext();
  const checkBeat = a1.beats.find((beat) => beat.sourceFunction === "check_understanding");
  const filtered = applyBeatContentSuppression(checkBeat, fullCheckSuppression(map));

  assert.equal(renderBeat(filtered, fullCheckSuppression(map)), "");
});

test("render slice: Check section follows Do and renders verification content once", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.match(a1Html, /data-composition-moment="check"/);
  assert.equal((a1Html.match(/data-composition-moment="check"/g) || []).length, 1);
  assert.match(a1Html, /Check your response/);
  assert.match(a1Html, /Complete your response first, then use this material to check or improve it/i);
  assert.match(a1Html, /Compare the sample response with the explanation/i);
  assert.match(a1Html, /Complete the self-check/i);

  const doIndex = a1Html.indexOf('data-composition-moment="do"');
  const checkIndex = a1Html.indexOf('data-composition-moment="check"');
  assert.ok(doIndex >= 0 && checkIndex > doIndex);
});

test("render slice: A1-M3 and A1-M4 appear exactly once inside Check moment", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.equal((a1Html.match(/data-material-id="A1-M3"/g) || []).length, 1);
  assert.equal((a1Html.match(/data-material-id="A1-M4"/g) || []).length, 1);

  const checkSection = a1Html.slice(a1Html.indexOf('data-composition-moment="check"'));
  assert.match(checkSection, /data-material-id="A1-M3"/);
  assert.match(checkSection, /data-material-id="A1-M4"/);
});

test("render slice: consumed checking content is not duplicated in legacy beat", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.doesNotMatch(a1Html, /data-beat-function="check_understanding"/);
  assert.doesNotMatch(a1Html, /util-beat-section[^>]*data-beat-function="check_understanding"/);
});

test("render slice: reveal UI is accessible and works without JavaScript", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.match(a1Html, /<details[^>]*data-reveal-mode="details"/);
  assert.match(a1Html, /<summary>Review the example response<\/summary>/);
  assert.doesNotMatch(a1Html, /<details[^>]*open/);
});

test("render slice: renderer does not claim automated checking, scoring, saving, or submission", () => {
  const sourcePage = loadFixture();
  const checkSection = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  ).slice(
    extractActivityHtml(
      renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
      "A1"
    ).indexOf('data-composition-moment="check"')
  );

  assert.doesNotMatch(checkSection, /automatically check/i);
  assert.doesNotMatch(checkSection, /score/i);
  assert.doesNotMatch(checkSection, /submit/i);
  assert.doesNotMatch(checkSection, /save your response/i);
});

test("render slice: Do workspace remains present and unchanged", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.match(a1Html, /data-composition-moment="do"/);
  assert.match(a1Html, /<textarea[^>]*class="util-learner-workspace__input"/);
  assert.match(a1Html, /saved on this device/i);
});

test("render slice: Orient and Learn content remain present", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.equal((a1Html.match(/data-composition-moment="orient"/g) || []).length, 1);
  assert.match(a1Html, /data-composition-moment="learn"/);
  assert.match(a1Html, /data-material-id="A1-M1"/);
});

test("render slice: explicit beats mode remains available and default export uses moments", () => {
  const sourcePage = loadFixture();
  const beatsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html;
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const defaultHtml = renderLearnerPageHtml(sourcePage).html;

  assert.equal(defaultHtml, momentsHtml);
  assert.notEqual(defaultHtml, beatsHtml);

  assert.match(extractActivityHtml(momentsHtml, "A2"), /data-composition-moment="check"/);
});

test("render slice: Check output remains deterministic", () => {
  const sourcePage = loadFixture();
  const first = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const second = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  assert.equal(first, second);
});

test("composition map: exposes Check moment and merged beat suppression hints", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });
  const map = buildActivityCompositionMap(composedResult.composed);

  assert.ok(map.A1.checkMoment);
  assert.deepEqual(fullCheckSuppression(map).omitInstructionSteps, [2, 3, 4, 5]);
  assert.deepEqual(fullCheckSuppression(map).omitMaterialIds, ["A1-M2", "A1-M3", "A1-M4"]);
  assert.equal(fullCheckSuppression(map).omitExpectedOutput, true);

  const html = renderPage(modelResult.model, { activityComposition: map });
  const a1Html = extractActivityHtml(html, "A1");
  assert.match(a1Html, /data-composition-moment="check"/);
  assert.doesNotMatch(a1Html, /data-beat-function="check_understanding"/);
});
