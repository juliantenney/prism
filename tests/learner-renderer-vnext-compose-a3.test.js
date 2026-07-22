"use strict";

/**
 * Sprint 68 — S68-IMP-008 Activity 3 composition and table workspace reuse tests.
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
  A3_LEARN_STEP_NUMBERS,
  A3_LEARN_MATERIAL_IDS,
  A3_DO_STEP_NUMBERS,
  A3_DO_MATERIAL_IDS_BY_STEP,
  A3_CHECK_STEP_NUMBERS,
  A3_CHECK_MATERIAL_IDS
} = require("../lib/learner-renderer-vnext/compose-activity-moments");
const {
  renderTableWorkspace,
  extractTableFromMaterial
} = require("../lib/learner-renderer-vnext/render-table-workspace");
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
  const a3 = modelResult.model.activities.find((activity) => activity.id === "A3");
  assert.ok(a3);
  return { sourcePage, modelResult, a3 };
}

function findMaterial(activity, materialId) {
  for (const beat of activity.beats) {
    const match = (beat.materials || []).find((material) => material.id === materialId);
    if (match) return match;
  }
  return null;
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

test("adapter: A3 receives four composed moments in order", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments",
    activityIds: ["A3"]
  });

  assert.equal(composedResult.ok, true);
  const activity = composedResult.composed.activities.find((entry) => entry.id === "A3");
  assert.ok(activity);
  const kinds = activity.moments.map((moment) => moment.kind);
  assert.deepEqual(kinds, ["orient", "learn", "do", "check"]);
});

test("adapter: A3 Learn includes worked example steps and A3-M1 only", () => {
  const { a3 } = buildGoldenContext();
  const learnMoment = composeLearnMoment(a3);
  assert.ok(learnMoment);

  assert.deepEqual(
    learnMoment.items
      .filter((item) => item.kind === "instruction")
      .map((item) => item.instruction.sourceStepNumber),
    A3_LEARN_STEP_NUMBERS
  );
  assert.deepEqual(
    learnMoment.items
      .filter((item) => item.kind === "material")
      .map((item) => item.material.id),
    A3_LEARN_MATERIAL_IDS
  );
});

test("adapter: A3 Do composes scenarios and decision table with table workspace metadata", () => {
  const { a3 } = buildGoldenContext();
  const doMoment = composeDoMoment(a3);
  assert.ok(doMoment);
  assert.equal(doMoment.workspace, null);

  assert.deepEqual(
    doMoment.items
      .filter((item) => item.kind === "instruction")
      .map((item) => item.instruction.sourceStepNumber),
    A3_DO_STEP_NUMBERS
  );

  const materials = doMoment.items.filter((item) => item.kind === "material");
  assert.deepEqual(
    materials.map((item) => item.material.id),
    ["A3-M2", "A3-M3"]
  );
  assert.equal(materials.find((item) => item.material.id === "A3-M2").tableWorkspace, false);
  assert.equal(materials.find((item) => item.material.id === "A3-M3").tableWorkspace, true);
  assert.match(doMoment.expectedOutput.text, /strong response uses residual evidence/i);
});

test("adapter: A3 Check includes checklist and transfer reflection guidance", () => {
  const { a3 } = buildGoldenContext();
  const checkMoment = composeCheckMoment(a3);
  assert.ok(checkMoment);

  assert.deepEqual(
    checkMoment.items
      .filter((item) => item.kind === "instruction")
      .map((item) => item.instruction.sourceStepNumber),
    A3_CHECK_STEP_NUMBERS
  );
  assert.deepEqual(
    checkMoment.items
      .filter((item) => item.kind === "material")
      .map((item) => item.material.id),
    A3_CHECK_MATERIAL_IDS
  );

  const transfer = checkMoment.items.find((item) => item.kind === "prompt");
  assert.ok(transfer);
  assert.equal(transfer.prompt.sourceField, "transfer_or_application_task");
  assert.match(transfer.prompt.text, /another economic variable pair/i);
});

test("render slice: A3-M3 reuses renderTableWorkspace in moments mode", () => {
  const { sourcePage } = buildGoldenContext();
  const a3Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A3"
  );
  const learnHtml = momentHtml(a3Html, "learn");
  const doHtml = momentHtml(a3Html, "do");

  assert.doesNotMatch(a3Html, /data-beat-function="/);
  assert.equal((a3Html.match(/data-composition-moment="/g) || []).length, 4);
  assert.doesNotMatch(momentHtml(a3Html, "do"), /util-learner-workspace/);
  assert.doesNotMatch(momentHtml(a3Html, "do"), /<textarea/);
  assert.match(momentHtml(a3Html, "check"), /util-learner-workspace__input/);

  assert.match(learnHtml, /data-material-id="A3-M1"/);
  assert.doesNotMatch(learnHtml, /util-learner-table-workspace/);
  assert.doesNotMatch(learnHtml, /<input/);

  assert.match(doHtml, /data-workspace-kind="table_entry"/);
  assert.match(doHtml, /data-material-id="A3-M3"/);
  assert.match(doHtml, /util-learner-table-workspace__guidance/);
  assert.equal((doHtml.match(/util-learner-table-workspace__input/g) || []).length, 8);
});

test("render slice: A3 beats mode keeps decision table static", () => {
  const { sourcePage } = buildGoldenContext();
  const a3Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html,
    "A3"
  );

  assert.match(a3Html, /data-material-id="A3-M3"/);
  assert.doesNotMatch(a3Html, /util-learner-table-workspace/);
  assert.doesNotMatch(a3Html, /<input/);
});

test("workspace: A3-M3 decision_table renders editable cells without synthetic row labels", () => {
  const { a3 } = buildGoldenContext();
  const material = findMaterial(a3, "A3-M3");
  assert.ok(material);
  assert.equal(material.type, "decision_table");

  const table = extractTableFromMaterial(material);
  assert.equal(table.rows.length, 3);

  const html = renderTableWorkspace(material, "A3");
  assert.match(html, /Likely heteroscedasticity/);
  assert.doesNotMatch(html, /Response row \d+/);
  assert.match(html, /aria-label="Response field, row 2, column Evidence Observed"/);
  assert.equal((html.match(/util-learner-table-workspace__input/g) || []).length, 8);
});

test("composition map: A3 exposes beat anchors, reflection omission, and suppression hints", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments",
    activityIds: ["A3"]
  });
  const map = buildActivityCompositionMap(composedResult.composed);

  assert.ok(map.A3.learnMoment);
  assert.ok(map.A3.doMoment);
  assert.ok(map.A3.checkMoment);
  assert.equal(map.A3.learnMomentBeat, "worked_example");
  assert.equal(map.A3.doMomentBeat, "practice");
  assert.equal(map.A3.checkMomentBeat, "practice");
  assert.ok(map.A3.omitBeatFunctions.includes("reflection"));

  assert.deepEqual(map.A3.suppressBeatContent.worked_example.omitMaterialIds, ["A3-M1"]);
  assert.deepEqual(map.A3.suppressBeatContent.worked_example.omitInstructionSteps, [1, 2]);
  assert.deepEqual(map.A3.suppressBeatContent.practice.omitMaterialIds.sort(), ["A3-M2", "A3-M3", "A3-M4"]);
  assert.deepEqual(map.A3.suppressBeatContent.practice.omitInstructionSteps.sort(), [3, 4, 5]);
  assert.equal(map.A3.suppressBeatContent.practice.omitExpectedOutput, true);

  const html = renderPage(modelResult.model, { activityComposition: map });
  const a3Html = extractActivityHtml(html, "A3");
  assert.doesNotMatch(a3Html, /data-beat-function="/);
});

test("regression: A1 and A2 unchanged; A5 remains beats in moments export", () => {
  const sourcePage = loadFixture();
  const beatsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html;
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;

  const a1Moments = extractActivityHtml(momentsHtml, "A1");
  const a2Moments = extractActivityHtml(momentsHtml, "A2");
  const a3Moments = extractActivityHtml(momentsHtml, "A3");

  assert.equal((a1Moments.match(/data-composition-moment="/g) || []).length, 4);
  assert.match(a1Moments, /util-learner-workspace__input/);
  assert.equal((a2Moments.match(/data-composition-moment="/g) || []).length, 4);
  assert.match(a2Moments, /data-workspace-kind="table_entry"/);
  assert.equal((a3Moments.match(/data-composition-moment="/g) || []).length, 4);
  assert.match(a3Moments, /data-workspace-kind="table_entry"/);
});
