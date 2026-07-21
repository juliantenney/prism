"use strict";

/**
 * Sprint 68 — A1 Learn moment composition and explanatory content tests.
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
  A1_LEARN_STEP_NUMBERS,
  A1_LEARN_MATERIAL_IDS,
  learnItemRoleForInstruction,
  learnItemRoleForMaterial
} = require("../lib/learner-renderer-vnext/compose-activity-moments");
const { applyBeatContentSuppression } = require("../lib/learner-renderer-vnext/compose-beat-suppression");
const { renderBeat } = require("../lib/learner-renderer-vnext/render-beat");
const { renderMaterial } = require("../lib/learner-renderer-vnext/render-material");
const { renderLearnMoment } = require("../lib/learner-renderer-vnext/render-composed-moment");
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

test("adapter: A1 receives exactly one Learn moment in moments mode", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });

  const learnMoments = getA1Moments(composedResult).filter((moment) => moment.kind === "learn");
  assert.equal(learnMoments.length, 1);
  assert.equal(learnMoments[0].kind, "learn");
});

test("adapter: only concept-building explanatory sources are assigned to Learn", () => {
  const { a1 } = buildGoldenContext();
  const learnMoment = composeLearnMoment(a1);
  assert.ok(learnMoment);

  const instructionSteps = learnMoment.items
    .filter((item) => item.kind === "instruction")
    .map((item) => item.instruction.sourceStepNumber);
  assert.deepEqual(instructionSteps, A1_LEARN_STEP_NUMBERS);

  const materialIds = learnMoment.items
    .filter((item) => item.kind === "material")
    .map((item) => item.material.id);
  assert.deepEqual(materialIds, A1_LEARN_MATERIAL_IDS);

  assert.match(
    learnMoment.items.find((item) => item.kind === "instruction").instruction.text,
    /Study the explanatory text introducing residuals/i
  );
  assert.equal(
    learnMoment.items.find((item) => item.kind === "material").material.title,
    "Residual Variance and Heteroscedasticity"
  );

  assert.ok(!learnMoment.items.some((item) => item.kind === "expectedOutput"));
  assert.ok(!learnMoment.items.some((item) => item.kind === "prompt"));
});

test("adapter: exact Learn sources match the fixture", () => {
  const { a1 } = buildGoldenContext();
  const learnMoment = composeLearnMoment(a1);

  assert.deepEqual(
    learnMoment.explanatorySteps.map((step) => step.sourceStepNumber),
    [1]
  );
  assert.deepEqual(
    learnMoment.materials.map((material) => material.id),
    ["A1-M1"]
  );
  assert.equal(learnMoment.items.length, 2);
});

test("adapter: source order and identity are preserved in Learn moment", () => {
  const { a1 } = buildGoldenContext();
  const learnMoment = composeLearnMoment(a1);

  const sequence = learnMoment.items.map((item) => {
    if (item.kind === "instruction") return "step:" + item.instruction.sourceStepNumber;
    if (item.kind === "material") return "material:" + item.material.id;
    return item.kind;
  });
  assert.deepEqual(sequence, ["step:1", "material:A1-M1"]);

  learnMoment.items.forEach((item) => {
    assert.equal(item.sourceRef.beatFunction, "explanation");
    assert.equal(item.sourceRef.activityId, "A1");
  });
});

test("adapter: Learn moment appears after Orient and before Do", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });
  const kinds = getA1Moments(composedResult).map((moment) => moment.kind);
  assert.deepEqual(kinds, ["orient", "learn", "do", "check"]);
});

test("adapter: Learn item roles distinguish explanatory semantics", () => {
  const { a1 } = buildGoldenContext();
  const learnMoment = composeLearnMoment(a1);
  const instructionItem = learnMoment.items.find((item) => item.kind === "instruction");
  const materialItem = learnMoment.items.find((item) => item.kind === "material");

  assert.equal(instructionItem.role, learnItemRoleForInstruction(instructionItem.instruction));
  assert.equal(materialItem.role, learnItemRoleForMaterial(materialItem.material));
  assert.equal(instructionItem.role, "explanation");
  assert.equal(materialItem.role, "definition");
});

test("adapter: Learn content has no reveal by default", () => {
  const { a1 } = buildGoldenContext();
  const learnMoment = composeLearnMoment(a1);
  learnMoment.items.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(item, "reveal")) {
      assert.equal(item.reveal, null);
    }
  });
});

test("adapter: missing optional explanatory content degrades safely", () => {
  const { a1 } = buildGoldenContext();
  const clone = JSON.parse(JSON.stringify(a1));
  const explanationBeat = clone.beats.find((beat) => beat.sourceFunction === "explanation");
  explanationBeat.materials = explanationBeat.materials.filter((material) => material.id !== "A1-M1");

  const learnMoment = composeLearnMoment(clone);
  assert.ok(learnMoment);
  assert.equal(learnMoment.items.filter((item) => item.kind === "material").length, 0);
  assert.equal(learnMoment.items.filter((item) => item.kind === "instruction").length, 1);
});

test("adapter: missing Learn task step degrades to no Learn moment", () => {
  const { a1 } = buildGoldenContext();
  const clone = JSON.parse(JSON.stringify(a1));
  const explanationBeat = clone.beats.find((beat) => beat.sourceFunction === "explanation");
  explanationBeat.instructions = [];
  explanationBeat.materials = [];

  assert.equal(composeLearnMoment(clone), null);
});

test("adapter: composition does not mutate input models", () => {
  const { sourcePage, modelResult, a1 } = buildGoldenContext();
  const sourceSnapshot = JSON.stringify(sourcePage);
  const beatsBefore = JSON.stringify(a1.beats);

  buildComposedPageModel(modelResult, sourcePage, { compositionMode: "moments" });
  composeLearnMoment(a1);

  assert.equal(JSON.stringify(sourcePage), sourceSnapshot);
  assert.equal(JSON.stringify(a1.beats), beatsBefore);
});

test("suppression: Learn filter removes only consumed explanation sources", () => {
  const { sourcePage, modelResult, a1 } = buildGoldenContext();
  const map = buildActivityCompositionMap(
    buildComposedPageModel(modelResult, sourcePage, { compositionMode: "moments" }).composed
  );
  const explanationBeat = a1.beats.find((beat) => beat.sourceFunction === "explanation");
  const filtered = applyBeatContentSuppression(
    explanationBeat,
    map.A1.suppressBeatContent.explanation
  );

  assert.equal(filtered.instructions.length, 0);
  assert.equal(filtered.materials.length, 0);
});

test("suppression: fully consumed explanation beat renders nothing", () => {
  const { sourcePage, modelResult, a1 } = buildGoldenContext();
  const map = buildActivityCompositionMap(
    buildComposedPageModel(modelResult, sourcePage, { compositionMode: "moments" }).composed
  );
  const explanationBeat = a1.beats.find((beat) => beat.sourceFunction === "explanation");
  const filtered = applyBeatContentSuppression(
    explanationBeat,
    map.A1.suppressBeatContent.explanation
  );

  assert.equal(renderBeat(filtered, map.A1.suppressBeatContent.explanation), "");
});

test("render slice: Learn section renders explanatory content once with structured material reuse", () => {
  const { a1 } = buildGoldenContext();
  const learnMoment = composeLearnMoment(a1);
  const material = learnMoment.materials[0];
  const learnHtml = renderLearnMoment(learnMoment, "A1");
  const materialHtml = renderMaterial(material);

  assert.match(learnHtml, /data-composition-moment="learn"/);
  assert.match(learnHtml, /Explore the idea/);
  assert.match(learnHtml, /Study the explanatory text introducing residuals/i);
  assert.match(learnHtml, /data-material-id="A1-M1"/);
  assert.match(learnHtml, /Residual Variance and Heteroscedasticity/);
  assert.match(learnHtml, /Homoscedasticity occurs when residuals have a similar spread/i);
  assert.ok(learnHtml.includes(materialHtml));
  assert.doesNotMatch(learnHtml, /<details/);
});

test("render slice: Learn appears after Orient and before Do in A1 HTML", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  const orientIndex = a1Html.indexOf('data-composition-moment="orient"');
  const learnIndex = a1Html.indexOf('data-composition-moment="learn"');
  const doIndex = a1Html.indexOf('data-composition-moment="do"');
  const checkIndex = a1Html.indexOf('data-composition-moment="check"');

  assert.ok(orientIndex >= 0);
  assert.ok(learnIndex > orientIndex);
  assert.ok(doIndex > learnIndex);
  assert.ok(checkIndex > doIndex);
});

test("render slice: A1-M1 and step 1 appear exactly once", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.equal((a1Html.match(/data-material-id="A1-M1"/g) || []).length, 1);
  assert.equal(
    (a1Html.match(/Study the explanatory text introducing residuals/gi) || []).length,
    1
  );
});

test("render slice: consumed Learn content is not duplicated in legacy explanation beat", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.doesNotMatch(a1Html, /data-beat-function="explanation"/);
});

test("render slice: no raw schema or composition labels in learner-facing HTML", () => {
  const sourcePage = loadFixture();
  const learnSection = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  ).slice(
    extractActivityHtml(
      renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
      "A1"
    ).indexOf('data-composition-moment="learn"')
  );

  assert.doesNotMatch(learnSection, /explanation beat/i);
  assert.doesNotMatch(learnSection, /sourceStepNumber/i);
  assert.doesNotMatch(learnSection, /check_understanding/i);
});

test("render slice: Orient, Do workspace, and Check reveal remain unchanged", () => {
  const sourcePage = loadFixture();
  const a1Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A1"
  );

  assert.equal((a1Html.match(/data-composition-moment="orient"/g) || []).length, 1);
  assert.match(a1Html, /<textarea[^>]*class="util-learner-workspace__input"/);
  assert.match(a1Html, /Check your response/);
  assert.match(a1Html, /<summary>Review the example response<\/summary>/);
  assert.match(a1Html, /Complete your response first, then use this material to check or improve it/i);
});

test("render slice: explicit beats mode remains available and default export uses moments", () => {
  const sourcePage = loadFixture();
  const beatsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html;
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const defaultHtml = renderLearnerPageHtml(sourcePage).html;

  assert.equal(defaultHtml, momentsHtml);
  assert.notEqual(defaultHtml, beatsHtml);

  assert.match(extractActivityHtml(momentsHtml, "A2"), /data-composition-moment="learn"/);
});

test("render slice: Learn output remains deterministic", () => {
  const sourcePage = loadFixture();
  const first = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const second = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  assert.equal(first, second);
});

test("composition map: exposes Learn moment and explanation beat suppression hints", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  });
  const map = buildActivityCompositionMap(composedResult.composed);

  assert.ok(map.A1.learnMoment);
  assert.deepEqual(map.A1.suppressBeatContent.explanation.omitInstructionSteps, [1]);
  assert.deepEqual(map.A1.suppressBeatContent.explanation.omitMaterialIds, ["A1-M1"]);
  assert.equal(map.A1.suppressBeatContent.explanation.omitExpectedOutput, false);

  const html = renderPage(modelResult.model, { activityComposition: map });
  const a1Html = extractActivityHtml(html, "A1");
  assert.match(a1Html, /data-composition-moment="learn"/);
  assert.doesNotMatch(a1Html, /data-beat-function="explanation"/);
});
