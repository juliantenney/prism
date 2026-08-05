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
  const sectionEnd = activityHtml.indexOf("</section>", start);
  if (sectionStart < 0 || sectionEnd < 0) return "";
  return activityHtml.slice(sectionStart, sectionEnd + "</section>".length);
}

test("S72-T-073: Owen A1 mixed study+write instruction is owned by Do and renders one text workspace before Check", () => {
  const sourcePage = loadFixture();
  const modelResult = buildPageModel(sourcePage);
  assert.equal(modelResult.ok, true, (modelResult.errors || []).map((e) => e.message || e).join("; "));

  const a1 = modelResult.model.activities.find((activity) => activity.id === "A1");
  assert.ok(a1, "A1 missing from model");

  const beatSnapshot = (a1.beats || []).map((beat) => ({
    beat: beat.sourceFunction,
    role: beat.learnerRole,
    moment: classification.classifyBeatMoment(beat),
    steps: (beat.instructions || []).map((instruction) => ({
      n: instruction.sourceStepNumber,
      placement: classification.classifyInstructionPlacement(instruction),
      text: String(instruction.text || "")
    }))
  }));

  const independent = beatSnapshot.find((row) => row.beat === "independent_performance");
  assert.ok(independent, "independent_performance beat missing");
  assert.equal(independent.steps.length, 1, "expected one parsed step on independent_performance");
  assert.equal(independent.steps[0].placement, "learn");
  assert.match(independent.steps[0].text, /Then write a short paragraph/i);

  const composed = buildComposedPageModel(modelResult, sourcePage, { compositionMode: "moments" }).composed;
  const a1Composed = composed.activities.find((activity) => activity.id === "A1");
  const kinds = (a1Composed.moments || []).map((moment) => moment.kind);
  assert.deepEqual(kinds, ["orient", "learn", "do", "check"]);

  const html = renderLearnerPageHtml(sourcePage, { compositionMode: "moments" }).html;
  const a1Html = extractActivityHtml(html, "A1");
  const doHtml = momentHtml(a1Html, "do");
  const checkHtml = momentHtml(a1Html, "check");
  assert.ok(doHtml.length > 0, "Do moment missing in rendered A1");
  assert.ok(checkHtml.length > 0, "Check moment missing in rendered A1");

  assert.equal((doHtml.match(/data-workspace-capability="text_entry"/g) || []).length, 1);
  assert.equal((a1Html.match(/<textarea\b/g) || []).length, 1);
  assert.ok(a1Html.indexOf('data-composition-moment="do"') < a1Html.indexOf('data-composition-moment="check"'));
  assert.ok(doHtml.indexOf("<textarea") >= 0);
  assert.match(checkHtml, /Complete your response first/i);
});
