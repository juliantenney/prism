"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildPageModel,
  buildComposedPageModel,
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext");
const classification = require("../lib/learner-renderer-vnext/compose-moment-classification");
const { parseLearnerTask } = require("../lib/learner-renderer-vnext/parse-learner-task");

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "owen-a1-assembled-shape.json"
);

function loadFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
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
    if (depth === 0) return source.slice(openTagStart, tagRe.lastIndex);
  }
  return "";
}

function momentHtml(activityHtml, kind) {
  const marker = 'data-composition-moment="' + kind + '"';
  const start = activityHtml.indexOf(marker);
  if (start < 0) return "";
  const sectionStart = activityHtml.lastIndexOf("<section", start);
  const next = activityHtml.indexOf('data-composition-moment="', start + marker.length);
  const end =
    next >= 0 ? activityHtml.lastIndexOf("</section>", next) + 10 : activityHtml.length;
  return activityHtml.slice(sectionStart >= 0 ? sectionStart : start, end);
}

test("S72-T-073 / S74A-T-042: Owen A1 splits study vs production; Do keeps write workspaces before Check", () => {
  const sourcePage = loadFixture();
  const steps = parseLearnerTask(sourcePage.activities[0].learner_task);
  assert.equal(steps.length, 3, "unnumbered Then/Finally clauses must split");
  assert.equal(classification.classifyInstructionPlacement(steps[0]), "learn");
  assert.equal(classification.classifyInstructionPlacement(steps[1]), "do");
  assert.equal(classification.classifyInstructionPlacement(steps[2]), "do");

  const modelResult = buildPageModel(sourcePage);
  assert.equal(modelResult.ok, true, (modelResult.errors || []).map((e) => e.message || e).join("; "));

  const a1 = modelResult.model.activities.find((activity) => activity.id === "A1");
  assert.ok(a1, "A1 missing from model");

  const independent = (a1.beats || []).find(
    (beat) => beat.sourceFunction === "independent_performance"
  );
  assert.ok(independent, "independent_performance beat missing");
  assert.equal((independent.instructions || []).length, 3);

  const composed = buildComposedPageModel(modelResult, sourcePage, {
    compositionMode: "moments"
  }).composed;
  const a1Composed = composed.activities.find((activity) => activity.id === "A1");
  const kinds = (a1Composed.moments || []).map((moment) => moment.kind);
  assert.deepEqual(kinds, ["orient", "learn", "do", "check"]);

  const learnMoment = a1Composed.moments.find((moment) => moment.kind === "learn");
  const doMoment = a1Composed.moments.find((moment) => moment.kind === "do");
  const learnTexts = (learnMoment.items || [])
    .filter((item) => item.kind === "instruction")
    .map((item) => String(item.instruction.text || ""));
  const doTexts = (doMoment.items || [])
    .filter((item) => item.kind === "instruction")
    .map((item) => String(item.instruction.text || ""));
  assert.ok(learnTexts.some((text) => /^Study the explanatory material/i.test(text)));
  assert.ok(doTexts.every((text) => !/^Study the explanatory material/i.test(text)));
  assert.ok(doTexts.some((text) => /^Write a short paragraph/i.test(text)));

  const html = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const a1Html = extractActivityHtml(html, "A1");
  const learnHtml = momentHtml(a1Html, "learn");
  const doHtml = momentHtml(a1Html, "do");
  const checkHtml = momentHtml(a1Html, "check");
  assert.ok(doHtml.length > 0, "Do moment missing in rendered A1");
  assert.ok(checkHtml.length > 0, "Check moment missing in rendered A1");

  assert.ok(learnHtml.indexOf("Study the explanatory material") < learnHtml.indexOf('data-material-id="A1-M1"'));
  assert.doesNotMatch(learnHtml, /Write a short paragraph/i);
  assert.doesNotMatch(doHtml, /Study the explanatory material and worked example/i);
  assert.ok((doHtml.match(/data-workspace-capability="text_entry"/g) || []).length >= 1);
  assert.ok(a1Html.indexOf('data-composition-moment="do"') < a1Html.indexOf('data-composition-moment="check"'));
  assert.match(checkHtml, /Complete your response first/i);
});
