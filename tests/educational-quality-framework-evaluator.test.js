/**
 * Sprint 41 Slice 3 — Educational Quality Framework diagnostic evaluator.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const evaluator = require("../lib/educational-quality-framework-evaluator.js");

const STRONG_LEARNING_ACTIVITIES = {
  activities: [
    {
      activity_id: "A1",
      title: "Understand inflation mechanisms",
      activity_preamble:
        "This opens the learner journey: connect prior knowledge to the session arc.",
      learner_task:
        "Explain the distinction between inflation and a one-off price change using the scenarios.",
      expected_output:
        "Evidence you can explain what you now understand and can do with the concepts.",
      support_note: "Check your thinking: are you connecting ideas or only naming terms?",
      required_materials: [
        {
          type: "worked_example",
          purpose: "modelled support",
          specification: "Stepped expert reasoning before faded partial completion"
        }
      ]
    },
    {
      activity_id: "A2",
      title: "Evaluate household strategies",
      learner_task:
        "Compare two households, justify your prioritisation, defend your trade-off, and decide which policy response is stronger.",
      expected_output:
        "Independent judgement memo with criteria-linked reasoning you can judge against.",
      transfer_or_application_task: "Transfer your criteria to a new household context on your own.",
      self_explanation_prompt: "What changed in your understanding after the comparison?"
    }
  ],
  delivery_notes: {
    study_tips:
      "What should now be clearer: you can judge policy impacts and manage the analysis independently."
  }
};

const THIN_SHELL = {
  activities: [
    {
      activity_id: "A1",
      title: "Page",
      learner_task: "Read the content.",
      expected_output: "Done."
    }
  ]
};

const INFLATION_FIXTURE_CANDIDATES = [
  "tests/fixtures/page-render/ld-inflation-workshop-page.json",
  "tests/fixtures/page-render/ld-inflation-workshop-page-full.json"
];

test("41E-1: module exports evaluator API", () => {
  assert.equal(evaluator.MODULE_ID, "EDUCATIONAL-QUALITY-FRAMEWORK-EVALUATOR");
  assert.equal(typeof evaluator.EVALUATOR_VERSION, "string");
  assert.equal(typeof evaluator.evaluateEducationalQualityFrameworkEvidence, "function");
  assert.equal(typeof evaluator.summariseEducationalQualityFrameworkEvidence, "function");
});

test("41E-1: strong synthetic learning_activities passes default threshold", () => {
  const result = evaluator.evaluateEducationalQualityFrameworkEvidence(STRONG_LEARNING_ACTIVITIES);
  assert.ok(result.score >= evaluator.DEFAULT_THRESHOLD);
  assert.equal(result.ok, true);
  assert.equal(result.dimensions.judgement.present, true);
  assert.equal(result.dimensions.understanding.present, true);
  assert.equal(result.dimensions.metacognition.present, true);
});

test("41E-1: thin content-shell scores low", () => {
  const result = evaluator.evaluateEducationalQualityFrameworkEvidence(THIN_SHELL, {
    threshold: 5
  });
  assert.ok(result.score < 5);
  assert.equal(result.ok, false);
  assert.ok(result.warnings.length > 0);
});

test("41E-1: judgement evidence detected through compare/evaluate/justify/criteria/defend language", () => {
  const result = evaluator.evaluateEducationalQualityFrameworkEvidence({
    activities: [
      {
        learner_task: "Compare the weak and strong arguments, justify your criteria, and defend your decision."
      }
    ]
  });
  assert.equal(result.dimensions.judgement.present, true);
  assert.ok(result.dimensions.judgement.evidence.length > 0);
});

test("41E-1: progressive independence detected through worked guided independent transfer language", () => {
  const result = evaluator.evaluateEducationalQualityFrameworkEvidence({
    activities: [
      {
        learner_task: "Study the worked example, complete the guided practice table, then attempt the independent transfer task on your own."
      }
    ]
  });
  assert.equal(result.dimensions.independence.present, true);
  assert.equal(result.dimensions.learner_journey.present, true);
});

test("41E-1: HTML input is lightly stripped and evaluated", () => {
  const html =
    "<div><p>Compare two interpretations and <strong>justify</strong> your decision.</p>" +
    "<p>Reflect on what changed in your understanding.</p></div>";
  const result = evaluator.evaluateEducationalQualityFrameworkEvidence(html);
  assert.equal(result.dimensions.judgement.present, true);
  assert.equal(result.dimensions.metacognition.present, true);
  assert.equal(result.dimensions.cognitive_activity.present, true);
});

test("41E-1: summariseEducationalQualityFrameworkEvidence returns concise summary", () => {
  const result = evaluator.evaluateEducationalQualityFrameworkEvidence(STRONG_LEARNING_ACTIVITIES);
  const summary = evaluator.summariseEducationalQualityFrameworkEvidence(result);
  assert.match(summary, /Educational quality evidence:/i);
  assert.match(summary, /8 dimensions/i);
  assert.match(summary, /present:/i);
  assert.ok(summary.length < 500);
});

test("41E-1: null/malformed input does not throw and returns low score with warning", () => {
  const nullResult = evaluator.evaluateEducationalQualityFrameworkEvidence(null);
  assert.equal(nullResult.score, 0);
  assert.equal(nullResult.ok, false);
  assert.ok(nullResult.warnings.length > 0);

  const emptyObj = evaluator.evaluateEducationalQualityFrameworkEvidence({});
  assert.equal(emptyObj.score, 0);
  assert.ok(emptyObj.warnings.length > 0);
});

test("41E-1: inflation fixture baseline diagnostic when fixture exists", () => {
  const repoRoot = path.resolve(__dirname, "..");
  const fixturePath = INFLATION_FIXTURE_CANDIDATES.map(function (rel) {
    return path.join(repoRoot, rel);
  }).find(function (abs) {
    return fs.existsSync(abs);
  });

  if (!fixturePath) {
    assert.ok(true, "no inflation fixture present — skip");
    return;
  }

  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const result = evaluator.evaluateEducationalQualityFrameworkEvidence(page);
  assert.equal(typeof result.score, "number");
  assert.ok(result.dimensions);
  evaluator.DIMENSION_ORDER.forEach(function (key) {
    assert.ok(result.dimensions[key]);
    assert.equal(typeof result.dimensions[key].present, "boolean");
    assert.ok(Array.isArray(result.dimensions[key].evidence));
  });
  const summary = evaluator.summariseEducationalQualityFrameworkEvidence(result);
  assert.ok(summary && summary.length > 0);
});
