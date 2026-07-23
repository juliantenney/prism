/**
 * Regression: learner-facing beat assignment for the heteroscedasticity fixture.
 * Source of truth: activity.episode_plan.beats + learner_task + materials by id.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const compose = require("../lib/ld-beat-assignment-compose.js");
const normalize = require("../lib/page-render-normalize.js");

const fixturePath = path.join(
  __dirname,
  "fixtures",
  "page-render",
  "heteroscedasticity-beat-assignment-page.json"
);

function activityScope(html, activityId) {
  const titles = {
    A1: /Defining Heteroscedasticity and Homoscedasticity[\s\S]*?(?=Interpreting Residual Plot Evidence|$)/i,
    A2: /Interpreting Residual Plot Evidence[\s\S]*?(?=Applying Residual Evidence|$)/i,
    A3: /Applying Residual Evidence to Economic Data[\s\S]*?(?=Consequences for Statistical Inference|$)/i,
    A4: /Consequences for Statistical Inference[\s\S]*?(?=Comparing Detection and Remedy|$)/i,
    A5: /Comparing Detection and Remedy Approaches[\s\S]*$/i
  };
  const m = String(html || "").match(titles[activityId]);
  return m ? m[0] : "";
}

function beatSections(scopeHtml) {
  return [
    ...String(scopeHtml || "").matchAll(
      /<section class="util-beat-section"[^>]*data-(?:beat|episode)-function="([^"]+)"[^>]*>([\s\S]*?)<\/section>/gi
    )
  ].map((m) => ({ fn: m[1], html: m[0] }));
}

function materialMarkerOccurrences(html, marker) {
  const re = new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  return (String(html || "").match(re) || []).length;
}

const MATERIAL_MARKERS = {
  "A1-M1": "Residual Variance and Heteroscedasticity",
  "A1-M2": "Constant versus Changing Spread",
  "A1-M3": "Sample Explanation",
  "A1-M4": "Did I correctly distinguished|Have I correctly distinguished",
  "A2-M1": "Worked Residual Plot Interpretation",
  "A2-M2": "Residual Plot Analysis Table",
  "A2-M3": "Case A: Household Spending",
  "A2-M4": "Did I identify the visual pattern",
  "A3-M1": "Applied Economic Reasoning",
  "A3-M2": "Scenario 1: Household Spending",
  "A3-M3": "Evidence-to-Judgement Table",
  "A3-M4": "Did I use residual evidence",
  "A4-M1": "Why Economists Care",
  "A4-M2": "How the Problem Affects Inference",
  "A4-M3": "Explain the Chain of Effects",
  "A4-M4": "Did I explain changing variance",
  "A5-M1": "Detection and Remedy Options",
  "A5-M2": "Scenario A",
  "A5-M3": "Worked Judgement",
  "A5-M4": "Evaluation Framework",
  "A5-M5": "Independent Judgement Template",
  "A5-M6": "Did I apply explicit criteria",
  "A5-M7": "wages and years of education",
  "A5-M8": "Key Takeaways"
};

test("compose: heteroscedasticity beat counts and material membership", () => {
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  // Diagnostic metadata must not affect assignment.
  delete page.generation_notes;
  delete page.episode_plans;

  const expectedCounts = { A1: 3, A2: 4, A3: 4, A4: 4, A5: 4 };
  let total = 0;
  const allMaterialIds = [];

  page.activities.forEach((activity) => {
    const row = normalize.normalizeActivitiesForRender([
      JSON.parse(JSON.stringify(activity))
    ])[0];
    const assignment = compose.composeActivityBeatAssignments(row);
    assert.equal(
      assignment.beats.length,
      expectedCounts[activity.activity_id],
      activity.activity_id + " beat count"
    );
    total += assignment.beats.length;
    assignment.beats.forEach((beat) => {
      beat.materialIds.filter(Boolean).forEach((id) => allMaterialIds.push(id));
    });
  });

  assert.equal(total, 19);

  const expectedIds = Object.keys(MATERIAL_MARKERS);
  expectedIds.forEach((id) => {
    assert.equal(
      allMaterialIds.filter((x) => x === id).length,
      1,
      id + " assigned exactly once"
    );
  });

  const byId = {};
  page.activities.forEach((activity) => {
    const row = normalize.normalizeActivitiesForRender([
      JSON.parse(JSON.stringify(activity))
    ])[0];
    byId[activity.activity_id] = compose.composeActivityBeatAssignments(row);
  });

  function mats(activityId, beatFn) {
    const beat = byId[activityId].beats.find((b) => b.beat === beatFn);
    return beat ? beat.materialIds.filter(Boolean) : [];
  }

  assert.deepEqual(mats("A1", "explanation"), ["A1-M1"]);
  assert.deepEqual(mats("A1", "verification"), ["A1-M2", "A1-M3", "A1-M4"]);
  assert.deepEqual(mats("A2", "worked_thinking"), ["A2-M1"]);
  assert.deepEqual(mats("A2", "guided_practice"), ["A2-M2"]);
  assert.deepEqual(mats("A4", "explanation"), ["A4-M1", "A4-M2", "A4-M3"]);
  assert.deepEqual(mats("A5", "guided_practice"), ["A5-M4", "A5-M5", "A5-M6"]);
  assert.ok(mats("A5", "reflection").includes("A5-M8"));
  assert.ok(mats("A5", "reflection").includes("A5-M7"));
});

test("renderer: heteroscedasticity fixture beat DOM order and integrity (vNext)", () => {
  const { renderLearnerPageHtml } = require("../lib/learner-renderer-vnext");
  const page = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  delete page.generation_notes;
  delete page.episode_plans;

  const rendered = renderLearnerPageHtml(page, { compositionMode: "beats" });
  assert.equal(rendered.error, null, JSON.stringify(rendered.error));
  const html = String(rendered.html || "").replace(/<style[\s\S]*?<\/style>/i, "");

  const expectedCounts = { A1: 3, A2: 4, A3: 3, A4: 3, A5: 4 };
  let totalBeats = 0;

  Object.keys(expectedCounts).forEach((activityId) => {
    const scope = activityScope(html, activityId);
    assert.ok(scope, "expected scope for " + activityId);
    const sections = beatSections(scope);
    assert.equal(sections.length, expectedCounts[activityId], activityId + " DOM beat count");
    totalBeats += sections.length;
  });
  assert.equal(totalBeats, 17);
  assert.equal((html.match(/<section class="util-beat-section"/g) || []).length, 17);

  Object.keys(MATERIAL_MARKERS).forEach((id) => {
    const marker = MATERIAL_MARKERS[id];
    const count = marker.includes("|")
      ? marker.split("|").reduce((n, part) => n + materialMarkerOccurrences(html, part.trim()), 0)
      : materialMarkerOccurrences(html, marker);
    assert.ok(count >= 1, id + " marker renders (" + marker + ")");
  });

  assert.ok((html.match(/util-expected-output/g) || []).length >= 5);
  assert.ok((html.match(/util-checklist-block/g) || []).length >= 5);

  const a1 = activityScope(html, "A1");
  const a1Beats = beatSections(a1);
  assert.deepEqual(a1Beats.map((b) => b.fn), [
    "orientation",
    "explanation",
    "verification"
  ]);
  assert.match(a1Beats[1].html, /Residual Variance and Heteroscedasticity/);
  assert.match(a1Beats[2].html, /Constant versus Changing Spread|Sample Explanation|Concept Self-Check/);

  const a4 = activityScope(html, "A4");
  const a4Practice = beatSections(a4).find((b) => b.fn === "guided_practice");
  assert.ok(a4Practice);
  const a4Explain = beatSections(a4).find((b) => b.fn === "explanation");
  assert.ok(a4Explain);
  assert.match(a4Explain.html, /Explain the Chain of Effects|Why Economists Care/);

  const a5 = activityScope(html, "A5");
  const a5Practice = beatSections(a5).find((b) => b.fn === "guided_practice");
  assert.ok(a5Practice);
  assert.match(a5Practice.html, /Evaluation Framework|Independent Judgement Template/);
});
