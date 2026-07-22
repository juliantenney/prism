"use strict";

/**
 * Sprint 68 — S68-IMP-010 Activity 5 capstone composition with ordered multi-surface Do.
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
  A5_LEARN_BEAT_CONFIGS,
  A5_DO_STEP_NUMBERS,
  A5_DO_MATERIAL_IDS_BY_STEP,
  A5_WORKSPACE_STEP_NUMBERS
} = require("../lib/learner-renderer-vnext/compose-activity-moments");
const { determineWorkspaceRequirement } = require("../lib/learner-renderer-vnext/compose-workspace");
const { resolveWorkspaceList } = require("../lib/learner-renderer-vnext/render-composed-moment");
const { renderTableWorkspace } = require("../lib/learner-renderer-vnext/render-table-workspace");
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
  const a5 = modelResult.model.activities.find((activity) => activity.id === "A5");
  assert.ok(a5);
  return { sourcePage, modelResult, a5 };
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

function indexOfOrFail(source, needle, label) {
  const index = source.indexOf(needle);
  assert.ok(index >= 0, label + " not found");
  return index;
}

test("adapter: A5 receives four composed moments in order", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments",
    activityIds: ["A5"]
  });

  assert.equal(composedResult.ok, true);
  const activity = composedResult.composed.activities.find((entry) => entry.id === "A5");
  assert.ok(activity);
  assert.deepEqual(
    activity.moments.map((moment) => moment.kind),
    ["orient", "learn", "do", "check"]
  );
});

test("adapter: A5 Learn spans orientation and comparison beats", () => {
  const { a5 } = buildGoldenContext();
  const learnMoment = composeLearnMoment(a5);
  assert.ok(learnMoment);

  const expectedSteps = A5_LEARN_BEAT_CONFIGS.flatMap((config) => [...config.stepNumbers]);
  assert.deepEqual(
    learnMoment.items
      .filter((item) => item.kind === "instruction")
      .map((item) => item.instruction.sourceStepNumber),
    expectedSteps
  );
  assert.deepEqual(
    learnMoment.items
      .filter((item) => item.kind === "material")
      .map((item) => item.material.id),
    ["A5-M1", "A5-M2", "A5-M3"]
  );
});

test("adapter: A5 Do composes table and text surfaces in authored order", () => {
  const { a5 } = buildGoldenContext();
  const doMoment = composeDoMoment(a5);
  assert.ok(doMoment);

  assert.deepEqual(
    doMoment.items
      .filter((item) => item.kind === "instruction")
      .map((item) => item.instruction.sourceStepNumber),
    A5_DO_STEP_NUMBERS
  );

  const materialIds = doMoment.items
    .filter((item) => item.kind === "material")
    .map((item) => item.material.id);
  assert.deepEqual(materialIds, [
    ...A5_DO_MATERIAL_IDS_BY_STEP[3],
    ...A5_DO_MATERIAL_IDS_BY_STEP[4]
  ]);

  const tableItem = doMoment.items.find(
    (item) => item.kind === "material" && item.material.id === "A5-M4"
  );
  assert.equal(tableItem.tableWorkspace, true);

  const prompt = doMoment.items.find((item) => item.kind === "prompt");
  assert.ok(prompt);
  assert.equal(prompt.prompt.sourceField, "argument_structure_hint");

  const workspaces = resolveWorkspaceList(doMoment);
  assert.equal(workspaces.length, 1);
  assert.equal(workspaces[0].capability, "text_entry");
  assert.equal(workspaces[0].sourceStepNumber, A5_WORKSPACE_STEP_NUMBERS[0]);
  assert.equal(workspaces[0].responseLabel, "Write your justified recommendation");
  assert.match(doMoment.expectedOutput.text, /reasoned recommendation/i);
});

test("adapter: A5 Check includes checklist, consolidation, and transfer", () => {
  const { a5 } = buildGoldenContext();
  const checkMoment = composeCheckMoment(a5);
  assert.ok(checkMoment);

  assert.deepEqual(
    checkMoment.items
      .filter((item) => item.kind === "instruction")
      .map((item) => item.instruction.sourceStepNumber),
    [5, 6]
  );
  assert.deepEqual(
    checkMoment.items
      .filter((item) => item.kind === "material")
      .map((item) => item.material.id),
    ["A5-M6", "A5-M8", "A5-M7"]
  );
});

test("workspace: A5 step 4 routes through shared text-entry rule", () => {
  const { a5 } = buildGoldenContext();
  const evaluationBeat = a5.beats.find((beat) => beat.sourceFunction === "evaluation");
  const step4 = evaluationBeat.instructions.find((entry) => entry.sourceStepNumber === 4);
  const workspace = determineWorkspaceRequirement(step4);
  assert.ok(workspace);
  assert.equal(workspace.capability, "text_entry");
  assert.equal(workspace.responseLabel, "Write your justified recommendation");
});

test("render slice: A5 Do renders table_entry before text_entry with deduplicated guidance", () => {
  const { sourcePage } = buildGoldenContext();
  const a5Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A5"
  );
  const doHtml = momentHtml(a5Html, "do");

  assert.match(doHtml, /data-workspace-kind="table_entry"/);
  assert.match(doHtml, /data-workspace-capability="text_entry"/);
  assert.equal((doHtml.match(/util-learner-table-workspace__input/g) || []).length, 12);
  assert.equal((doHtml.match(/util-learner-workspace__input/g) || []).length, 1);

  const tablePos = indexOfOrFail(doHtml, 'data-material-id="A5-M4"', "comparison table");
  const textPos = indexOfOrFail(doHtml, 'data-workspace-capability="text_entry"', "text workspace");
  assert.ok(tablePos < textPos, "table workspace must precede text workspace");

  assert.doesNotMatch(doHtml, /util-learner-table-workspace__guidance/);
  assert.match(doHtml, /util-learner-workspace__note/);
  assert.match(doHtml, /Write your justified recommendation/);
  assert.match(doHtml, /data-material-id="A5-M5"/);
});

test("render slice: A5 Learn keeps reference tables static and places capstone materials", () => {
  const { sourcePage } = buildGoldenContext();
  const a5Html = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A5"
  );
  const learnHtml = momentHtml(a5Html, "learn");
  const orientHtml = momentHtml(a5Html, "orient");

  assert.match(orientHtml, /intellectual_coherence_bridge|Connect your learning/i);
  assert.match(learnHtml, /data-material-id="A5-M1"/);
  assert.match(learnHtml, /data-material-id="A5-M2"/);
  assert.match(learnHtml, /data-material-id="A5-M3"/);
  assert.doesNotMatch(learnHtml, /util-learner-table-workspace/);
  assert.doesNotMatch(learnHtml, /util-learner-workspace/);
});

test("render slice: A5 beats mode unchanged", () => {
  const { sourcePage } = buildGoldenContext();
  const beatsHtml = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "beats" }).html,
    "A5"
  );
  const momentsHtml = extractActivityHtml(
    renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html,
    "A5"
  );

  assert.doesNotMatch(beatsHtml, /data-composition-moment="/);
  assert.notEqual(beatsHtml, momentsHtml);
  assert.match(beatsHtml, /data-material-id="A5-M4"/);
  assert.doesNotMatch(beatsHtml, /util-learner-table-workspace__input/);
});

test("composition map: A5 exposes multi-beat suppression and reflection omission", () => {
  const { sourcePage, modelResult } = buildGoldenContext();
  const composedResult = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments",
    activityIds: ["A5"]
  });
  const map = buildActivityCompositionMap(composedResult.composed);

  assert.equal(map.A5.learnMomentBeat, "comparison");
  assert.equal(map.A5.doMomentBeat, "evaluation");
  assert.equal(map.A5.checkMomentBeat, "evaluation");
  assert.ok(map.A5.omitBeatFunctions.includes("reflection"));
  assert.ok(map.A5.omitBeatFunctions.includes("orientation"));

  assert.deepEqual(map.A5.suppressBeatContent.orientation.omitMaterialIds, ["A5-M1"]);
  assert.deepEqual(map.A5.suppressBeatContent.orientation.omitInstructionSteps, [1]);
  assert.deepEqual(map.A5.suppressBeatContent.comparison.omitMaterialIds, ["A5-M2", "A5-M3"]);
  assert.deepEqual(map.A5.suppressBeatContent.comparison.omitInstructionSteps, [2]);
  assert.deepEqual(map.A5.suppressBeatContent.evaluation.omitMaterialIds.sort(), [
    "A5-M4",
    "A5-M5",
    "A5-M6"
  ]);
  assert.deepEqual(map.A5.suppressBeatContent.evaluation.omitInstructionSteps.sort(), [3, 4, 5]);
  assert.equal(map.A5.suppressBeatContent.evaluation.omitExpectedOutput, true);
  assert.deepEqual(map.A5.suppressBeatContent.evaluation.omitPromptSourceFields, [
    "argument_structure_hint"
  ]);

  const html = renderPage(modelResult.model, { activityComposition: map });
  const a5Html = extractActivityHtml(html, "A5");
  assert.doesNotMatch(a5Html, /data-beat-function="reflection"/);
  assert.equal((a5Html.match(/argument_structure_hint|Structure your response/g) || []).length, 1);
});

test("table workspace: A5-M4 comparison_table uses shared renderer with 12 editable cells", () => {
  const { a5 } = buildGoldenContext();
  const material = findMaterial(a5, "A5-M4");
  assert.ok(material);
  assert.equal(material.type, "comparison_table");

  const html = renderTableWorkspace(material, "A5");
  assert.match(html, /data-workspace-kind="table_entry"/);
  assert.equal((html.match(/util-learner-table-workspace__input/g) || []).length, 12);
});

test("regression: A1–A4 moments behaviour unchanged when A5 is enabled", () => {
  const sourcePage = loadFixture();
  const momentsHtml = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;

  ["A1", "A2", "A3", "A4"].forEach((activityId) => {
    const html = extractActivityHtml(momentsHtml, activityId);
    assert.equal((html.match(/data-composition-moment="/g) || []).length, 4, activityId);
  });

  assert.match(extractActivityHtml(momentsHtml, "A1"), /util-learner-workspace__input/);
  assert.match(extractActivityHtml(momentsHtml, "A2"), /data-workspace-kind="table_entry"/);
  assert.match(extractActivityHtml(momentsHtml, "A3"), /data-workspace-kind="table_entry"/);
  assert.match(extractActivityHtml(momentsHtml, "A4"), /data-workspace-capability="text_entry"/);
});
