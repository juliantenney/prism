/**
 * Sprint 100A — Workload feasibility estimator (standalone module).
 * No production workflow integration.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const estimator = require(path.join(repoRoot, "lib", "workload-feasibility-estimator.js"));
const calibration = JSON.parse(
  fs.readFileSync(
    path.join(repoRoot, "tests", "fixtures", "s100a-workload-calibration.json"),
    "utf8"
  )
);

function estimate(input) {
  return estimator.estimateActivityWorkload(input);
}

test("exports schema version and pure estimator", () => {
  assert.equal(estimator.SCHEMA_VERSION, "100A.2");
  assert.equal(typeof estimator.estimateActivityWorkload, "function");
});

test("does not mutate supplied activity data", () => {
  const input = {
    activityType: "analytical_writing",
    declaredDurationMinutes: 5,
    suggestedLengthWords: { min: 180, max: 250 },
    reasoningDemand: "analysis",
    readingDemand: "moderate",
    nested: { keep: true }
  };
  const snapshot = JSON.stringify(input);
  estimate(input);
  assert.equal(JSON.stringify(input), snapshot);
});

test("workload estimate is independent of declared duration", () => {
  const base = {
    activityType: "philosophical_argument",
    suggestedLengthWords: { min: 300, max: 400 },
    reasoningDemand: "argument",
    readingDemand: "moderate"
  };
  const a = estimate(Object.assign({}, base, { declaredDurationMinutes: 10 }));
  const b = estimate(Object.assign({}, base, { declaredDurationMinutes: 45 }));
  const c = estimate(Object.assign({}, base));
  assert.equal(a.sufficientEvidence, true);
  assert.deepEqual(a.indicativeEffortMinutes, b.indicativeEffortMinutes);
  assert.deepEqual(a.indicativeEffortMinutes, c.indicativeEffortMinutes);
  assert.equal(a.plausiblyInsufficient, true);
  assert.equal(b.plausiblyInsufficient, false);
  assert.equal(c.plausiblyInsufficient, null);
});

test("simple recall / MCQ demand is lighter than analytical writing", () => {
  const mcq = estimate({
    activityType: "mcq",
    declaredDurationMinutes: 3,
    reasoningDemand: "recall",
    readingDemand: "brief"
  });
  const writing = estimate({
    activityType: "analytical_writing",
    declaredDurationMinutes: 20,
    suggestedLengthWords: { min: 180, max: 250 },
    reasoningDemand: "analysis",
    readingDemand: "moderate"
  });
  assert.ok(mcq.indicativeEffortMinutes.high < writing.indicativeEffortMinutes.low);
  assert.equal(mcq.plausiblyInsufficient, false);
});

test("reading and evidence-review overhead increases the range", () => {
  const without = estimate({
    activityType: "constructed_response",
    suggestedLengthWords: { min: 200, max: 250 },
    reasoningDemand: "analysis",
    readingDemand: "none"
  });
  const withDossier = estimate({
    activityType: "constructed_response",
    suggestedLengthWords: { min: 200, max: 250 },
    reasoningDemand: "analysis",
    readingDemand: "dossier"
  });
  assert.ok(withDossier.indicativeEffortMinutes.low > without.indicativeEffortMinutes.low);
  assert.ok(withDossier.indicativeEffortMinutes.high > without.indicativeEffortMinutes.high);
  assert.match(withDossier.explanation, /Indicative learner effort about/i);
  assert.ok(withDossier.factors.some((f) => /dossier/i.test(f)));
});

test("feedback and revision overhead increases the range", () => {
  const base = estimate({
    activityType: "mathematical_problem",
    reasoningDemand: "application",
    readingDemand: "brief"
  });
  const withFeedback = estimate({
    activityType: "mathematical_problem",
    reasoningDemand: "application",
    readingDemand: "brief",
    requiresFeedbackInterpretation: true
  });
  const withRevision = estimate({
    activityType: "analytical_writing",
    suggestedLengthWords: { min: 180, max: 250 },
    reasoningDemand: "analysis",
    readingDemand: "brief",
    requiresRevision: true
  });
  const writingBase = estimate({
    activityType: "analytical_writing",
    suggestedLengthWords: { min: 180, max: 250 },
    reasoningDemand: "analysis",
    readingDemand: "brief"
  });
  assert.ok(withFeedback.indicativeEffortMinutes.low > base.indicativeEffortMinutes.low);
  assert.ok(withRevision.indicativeEffortMinutes.low > writingBase.indicativeEffortMinutes.low);
});

test("missing or ambiguous input yields insufficient evidence", () => {
  const empty = estimate({});
  assert.equal(empty.sufficientEvidence, false);
  assert.equal(empty.indicativeEffortMinutes, null);
  assert.equal(empty.plausiblyInsufficient, null);
  assert.ok(empty.factors[0].includes("Insufficient demand evidence"));

  const nullish = estimate(null);
  assert.equal(nullish.sufficientEvidence, false);
});

test("explanations are stable and intelligible", () => {
  const result = estimate({
    activityType: "mcq",
    declaredDurationMinutes: 3,
    reasoningDemand: "comprehension",
    readingDemand: "brief"
  });
  const again = estimate({
    activityType: "mcq",
    declaredDurationMinutes: 3,
    reasoningDemand: "comprehension",
    readingDemand: "brief"
  });
  assert.equal(result.explanation, again.explanation);
  assert.match(result.explanation, /Indicative learner effort about \d+–\d+ minutes/);
  assert.match(result.explanation, /not measured completion times/i);
  assert.ok(Array.isArray(result.factors));
  assert.ok(result.factors.length >= 2);
});

test("parseSuggestedLengthWords accepts common shapes", () => {
  assert.deepEqual(estimator.parseSuggestedLengthWords("300-400"), { min: 300, max: 400 });
  assert.deepEqual(estimator.parseSuggestedLengthWords("approximately 180–250 words"), {
    min: 180,
    max: 250
  });
  assert.deepEqual(estimator.parseSuggestedLengthWords(120), { min: 120, max: 120 });
});

test("calibration cases distinguish overload from feasible", () => {
  const summary = [];
  for (const row of calibration.cases) {
    const result = estimate(row.input);
    assert.equal(result.sufficientEvidence, true, row.id);
    assert.ok(result.indicativeEffortMinutes, row.id);
    assert.ok(result.indicativeEffortMinutes.low <= result.indicativeEffortMinutes.high, row.id);
    if (row.expect === "overload") {
      assert.equal(result.plausiblyInsufficient, true, row.id + " should overload");
    } else if (row.expect === "feasible") {
      assert.equal(result.plausiblyInsufficient, false, row.id + " should be feasible");
    }
    summary.push({
      id: row.id,
      declared: result.declaredDurationMinutes,
      range: result.indicativeEffortMinutes,
      plausiblyInsufficient: result.plausiblyInsufficient
    });
  }
  // Visible when run with reporters that print console output.
  console.log("s100a calibration summary:", JSON.stringify(summary, null, 2));
});

test("boundary: declared equal to low bound is not flagged insufficient", () => {
  const probe = estimate({
    activityType: "mcq",
    reasoningDemand: "comprehension",
    readingDemand: "brief"
  });
  const atLow = estimate({
    activityType: "mcq",
    reasoningDemand: "comprehension",
    readingDemand: "brief",
    declaredDurationMinutes: probe.indicativeEffortMinutes.low
  });
  assert.equal(atLow.plausiblyInsufficient, false);
});

test("boundary: declared one minute below low bound is flagged", () => {
  const probe = estimate({
    activityType: "analytical_writing",
    suggestedLengthWords: { min: 180, max: 250 },
    reasoningDemand: "analysis",
    readingDemand: "moderate"
  });
  const below = estimate({
    activityType: "analytical_writing",
    suggestedLengthWords: { min: 180, max: 250 },
    reasoningDemand: "analysis",
    readingDemand: "moderate",
    declaredDurationMinutes: Math.max(0, probe.indicativeEffortMinutes.low - 1)
  });
  assert.equal(below.plausiblyInsufficient, true);
});

test("type floor without word count remains conservative and explicit", () => {
  const result = estimate({
    activityType: "argumentative_writing",
    declaredDurationMinutes: 8,
    reasoningDemand: "argument",
    readingDemand: "brief"
  });
  assert.equal(result.sufficientEvidence, true);
  assert.equal(result.plausiblyInsufficient, true);
  assert.ok(result.factors.some((f) => /length was not supplied/i.test(f)));
});

test("existing duration allocation helpers remain untouched by this module", () => {
  // Sanity: 100A must not alter Learning Sequence projection behaviour.
  const project = require(path.join(
    repoRoot,
    "lib",
    "learner-renderer-vnext",
    "project-timeline-durations.js"
  ));
  const page = {
    activities: [{ activity_id: "A1", title: "Demo" }],
    learning_sequence: {
      total_duration_minutes: 30,
      timeline: [{ activity_id: "A1", duration_minutes: 12 }]
    }
  };
  const before = JSON.stringify(page);
  project.projectTimelineDurationsOntoActivities(page);
  assert.equal(page.activities[0].duration_minutes, 12);
  // Ensure estimator import did not change projection semantics.
  assert.notEqual(before, JSON.stringify(page));
  const again = {
    activities: [{ activity_id: "A1", title: "Demo", duration_minutes: 9 }],
    learning_sequence: {
      timeline: [{ activity_id: "A1", duration_minutes: 12 }]
    }
  };
  project.projectTimelineDurationsOntoActivities(again);
  assert.equal(again.activities[0].duration_minutes, 9);
});
