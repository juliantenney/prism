/**
 * Sprint 38-N — Page fidelity hardening (R1 marker generalisation, R2 render order, R3 schema alignment).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const sprint38mArtefacts = path.join(
  repoRoot,
  "docs/development/sprints/2026-06-05-sprint-38m-page-composition-fidelity/artefacts"
);
const gamPath = path.join(sprint38mArtefacts, "EV-38M-AFTER-gam.json");
const pagePath = path.join(sprint38mArtefacts, "EV-38M-AFTER-design-page.json");

const {
  validate38MPageFidelity,
  validate38LPageGamPreservation,
  pageMaterialText,
  semanticMarkerSatisfied,
  hasGuidedTableExemplar,
  evaluateMaterialMarkers
} = require(path.join(repoRoot, "lib/page-gam-materials-preserve.js"));

function activityRow(page, index) {
  const section = (page.sections || []).find(
    (s) =>
      String(s.section_id || "").toLowerCase() === "learning_activities" ||
      /learning activit/i.test(String(s.heading || ""))
  );
  const rows = Array.isArray(section?.content) ? section.content : [];
  return rows[index] || null;
}

test("38N R1 — semantic markers accept fresh GAM phrasing on EV-38M-AFTER A4", () => {
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const a4 = activityRow(page, 3);
  const worked = pageMaterialText(a4.materials, "worked_judgement_weak_strong");
  const guided = pageMaterialText(a4.materials, "guided_judgement_table");
  const scenario = pageMaterialText(a4.materials, "scenario_maya_strategy_menu");

  assert.match(worked, /Weak Judgement \(Slogan-style\)/i);
  assert.match(worked, /Strong Judgement \(Criteria-led\)/i);
  assert.ok(semanticMarkerSatisfied("weak_worked_judgement", worked));
  assert.ok(semanticMarkerSatisfied("strong_worked_judgement", worked));

  const workedMarkers = evaluateMaterialMarkers(worked, [
    "weak_worked_judgement",
    "strong_worked_judgement"
  ]);
  assert.deepEqual(workedMarkers.missing, []);

  assert.ok(hasGuidedTableExemplar(guided));
  const guidedMarkers = evaluateMaterialMarkers(guided, ["guided_table_exemplar"]);
  assert.deepEqual(guidedMarkers.missing, []);

  assert.ok(semanticMarkerSatisfied("strategy_a", scenario));
  assert.ok(semanticMarkerSatisfied("strategy_e", scenario));
});

test("38N R3 — pageMaterialText resolves scenarios[] and alias keys on EV-38M-AFTER", () => {
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const a4 = activityRow(page, 3);
  const a3 = activityRow(page, 2);

  const scenarioFromArray = pageMaterialText(a4.materials, "scenario_maya_strategy_menu");
  assert.ok(scenarioFromArray.length > 400);
  assert.match(scenarioFromArray, /Strategy A:/i);

  const workedAlias = pageMaterialText(a4.materials, "worked_judgement_weak_strong");
  assert.ok(workedAlias.length > 400);

  const a3Scenario = pageMaterialText(a3.materials, "scenario_maya_households");
  assert.ok(a3Scenario.length > 200);
  assert.match(a3Scenario, /Fixed Income/i);
});

test("38N R1+R3 — validate38M and 38L regression pass on EV-38M-AFTER replay", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));

  const check38M = validate38MPageFidelity(page, { gamSource: gam });
  assert.equal(check38M.ok, true, check38M.errors.join("; "));

  const check38L = validate38LPageGamPreservation(page, { gamSource: gam });
  assert.equal(check38L.ok, true, check38L.errors.join("; "));
});
