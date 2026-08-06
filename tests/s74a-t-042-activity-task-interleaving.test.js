"use strict";

/**
 * S74A-T-042 — Activity beat/task interleaving (definitive vNext path).
 *
 * Protects ordering/structural placement, not mere text presence:
 * study instructions stay with Learn materials; production tasks stay in Do;
 * unnumbered sequential learner_task clauses are not flattened into one
 * terminal "Your task" aggregate.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  buildPageModel,
  buildComposedPageModel,
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext");
const {
  parseLearnerTask,
  splitUnnumberedSequentialClauses
} = require("../lib/learner-renderer-vnext/parse-learner-task");
const {
  classifyInstructionPlacement
} = require("../lib/learner-renderer-vnext/compose-moment-classification");

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "owen-a1-assembled-shape.json"
);

function loadOwen() {
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

function momentSlice(activityHtml, kind) {
  const marker = 'data-composition-moment="' + kind + '"';
  const start = activityHtml.indexOf(marker);
  if (start < 0) return "";
  const sectionStart = activityHtml.lastIndexOf("<section", start);
  const next = activityHtml.indexOf('data-composition-moment="', start + marker.length);
  const end =
    next >= 0 ? activityHtml.lastIndexOf("</section>", next) + 10 : activityHtml.length;
  return activityHtml.slice(sectionStart >= 0 ? sectionStart : start, end);
}

test("parseLearnerTask: numbered entries remain unsplit", () => {
  const steps = parseLearnerTask(
    "1. Study the text.\n2. Then write a paragraph.\n3. Finally, apply the model."
  );
  assert.equal(steps.length, 3);
  assert.match(steps[1].text, /^Then write/);
  assert.match(steps[2].text, /^Finally/);
});

test("parseLearnerTask: unnumbered Then/Finally clauses become distinct steps", () => {
  const clauses = splitUnnumberedSequentialClauses(
    "Study the explanatory material and worked example. Then write a short paragraph. Finally, apply the model to Wilfred Owen."
  );
  assert.deepEqual(clauses, [
    "Study the explanatory material and worked example.",
    "Write a short paragraph.",
    "Apply the model to Wilfred Owen."
  ]);
  const steps = parseLearnerTask(
    "Study the explanatory material and worked example. Then write a short paragraph. Finally, apply the model to Wilfred Owen."
  );
  assert.equal(steps.length, 3);
  assert.equal(classifyInstructionPlacement(steps[0]), "learn");
  assert.equal(classifyInstructionPlacement(steps[1]), "do");
  assert.equal(classifyInstructionPlacement(steps[2]), "do");
});

test("S74A-T-042: Owen A1 study instruction precedes Learn materials; production tasks stay in Do", () => {
  const page = loadOwen();
  const model = buildPageModel(page);
  assert.equal(model.ok, true, JSON.stringify(model.errors));

  const composed = buildComposedPageModel(model, page, { compositionMode: "moments" });
  assert.equal(composed.ok, true, JSON.stringify(composed.errors));
  const a1 = composed.composed.activities.find((activity) => activity.id === "A1");
  assert.ok(a1);

  const learn = (a1.moments || []).find((moment) => moment.kind === "learn");
  const doMoment = (a1.moments || []).find((moment) => moment.kind === "do");
  assert.ok(learn && doMoment);

  const learnKinds = (learn.items || []).map((item) => {
    if (item.kind === "instruction") return "I:" + item.instruction.sourceStepNumber;
    if (item.kind === "material") return "M:" + item.material.id;
    return item.kind;
  });
  assert.deepEqual(learnKinds.slice(0, 3), ["I:1", "M:A1-M1", "M:A1-M2"]);

  const doInstructions = (doMoment.items || [])
    .filter((item) => item.kind === "instruction")
    .map((item) => String(item.instruction.text || ""));
  assert.equal(doInstructions.length, 2);
  assert.match(doInstructions[0], /^Write a short paragraph/i);
  assert.match(doInstructions[1], /^Apply the model to Wilfred Owen/i);
  assert.ok(
    !doInstructions.some((text) => /^Study the explanatory material/i.test(text)),
    "Study clause must not reappear inside Do"
  );

  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html || "";
  const a1Html = extractActivityHtml(html, "A1");
  const learnHtml = momentSlice(a1Html, "learn");
  const doHtml = momentSlice(a1Html, "do");

  const studyPos = learnHtml.indexOf("Study the explanatory material and worked example");
  const m1Pos = learnHtml.indexOf('data-material-id="A1-M1"');
  const m2Pos = learnHtml.indexOf('data-material-id="A1-M2"');
  const writePos = doHtml.indexOf("Write a short paragraph");
  const applyPos = doHtml.indexOf("Apply the model to Wilfred Owen");
  const yourTaskPos = doHtml.indexOf("Your task");

  assert.ok(studyPos >= 0 && m1Pos > studyPos && m2Pos > m1Pos, "Study precedes Learn materials");
  assert.ok(yourTaskPos >= 0 && writePos > yourTaskPos && applyPos > writePos);
  assert.doesNotMatch(learnHtml, /Write a short paragraph/i);
  assert.doesNotMatch(doHtml, /Study the explanatory material and worked example/i);
  assert.ok(
    a1Html.indexOf('data-composition-moment="learn"') <
      a1Html.indexOf('data-composition-moment="do"')
  );
});

test("S74A-T-042 synthetic: Beat1/Task1/Beat2/Task2 ordering across Learn and Do", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Interleave regression",
    activities: [
      {
        activity_id: "R1",
        title: "Regression activity",
        duration_minutes: 10,
        grouping: "individual",
        mapped_learning_outcomes: ["LO1"],
        expected_output: "A short written response.",
        learner_task:
          "Study the first explanatory text. Then study the worked example. Finally, write an independent judgement.",
        materials: [
          {
            material_id: "R1-M1",
            type: "text",
            title: "Explanatory text",
            body: "Beat one body."
          },
          {
            material_id: "R1-M2",
            type: "worked_example",
            title: "Worked example",
            body: "Beat two body."
          },
          {
            material_id: "R1-M3",
            type: "checklist",
            title: "Checklist",
            body: "- Criterion"
          }
        ],
        episode_plan: {
          archetype: "understand",
          beats: [
            { function: "orientation" },
            { function: "explanation" },
            { function: "example" },
            { function: "independent_performance" },
            { function: "verification" }
          ]
        }
      }
    ],
    learning_outcomes: [{ outcome_id: "LO1", statement: "Explain the idea." }]
  };

  const steps = parseLearnerTask(page.activities[0].learner_task);
  assert.equal(steps.length, 3);
  assert.equal(classifyInstructionPlacement(steps[0]), "learn");
  assert.equal(classifyInstructionPlacement(steps[1]), "learn");
  assert.equal(classifyInstructionPlacement(steps[2]), "do");

  const html = renderLearnerPageHtml(page, { compositionMode: "moments" }).html || "";
  const activity = extractActivityHtml(html, "R1");
  const learnHtml = momentSlice(activity, "learn");
  const doHtml = momentSlice(activity, "do");

  const study1 = learnHtml.indexOf("Study the first explanatory text");
  const m1 = learnHtml.indexOf('data-material-id="R1-M1"');
  const study2 = learnHtml.indexOf("Study the worked example");
  const m2 = learnHtml.indexOf('data-material-id="R1-M2"');
  const write = doHtml.indexOf("Write an independent judgement");

  assert.ok(study1 >= 0 && m1 > study1, "Beat1 material follows study task 1");
  assert.ok(study2 > m1 && m2 > study2, "Beat2 material follows study task 2");
  assert.ok(write >= 0, "production task remains in Do");
  assert.doesNotMatch(doHtml, /Study the first explanatory text/i);
  assert.doesNotMatch(learnHtml, /Write an independent judgement/i);
  assert.equal((doHtml.match(/Your task/g) || []).length, 1);
});
