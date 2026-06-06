/**
 * Sprint 38-P — Merge supersession (material_role_index).
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
  applyGamMaterialsToComposedPage,
  validate38MPageFidelity,
  pageMaterialText,
  measureRoleSupersession,
  buildMaterialRoleIndex,
  mergeMaterialsFromGamList,
  ROLE_AUTHORITY
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

function gamMaterials(pageIndex, gam) {
  return gam.activities[pageIndex].materials;
}

function indexEntry(row, key) {
  return row?.material_role_index?.[key] || null;
}

test("38P-3 merge populates material_role_index on all activities", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, gam);

  assert.equal(merged.metadata?.role_supersession_applied, true);
  assert.equal(merged.metadata?.role_supersession_schema, "38P-3");
  assert.equal(merged.metadata?.gam_materials_preserve_schema, "38M-2");

  for (let i = 0; i < 4; i += 1) {
    const row = activityRow(merged, i);
    assert.ok(row.material_role_index, `A${i + 1} missing material_role_index`);
    assert.ok(Object.keys(row.material_role_index).length > 0);
  }
});

test("38P-3 A4 worked judgement — modelling_note superseded, canonical preserved", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const preRow = activityRow(page, 3);
  const merged = applyGamMaterialsToComposedPage(page, gam);
  const a4 = activityRow(merged, 3);
  const gamA4 = gamMaterials(3, gam);

  const stubLen = String(preRow.materials.modelling_note || "").length;
  const canonicalLen = String(a4.materials.worked_judgement_weak_strong || "").length;
  assert.ok(stubLen > 0, "pre-merge modelling_note stub expected");
  assert.ok(canonicalLen > stubLen, "canonical body should be fuller");

  assert.equal(a4.materials.modelling_note, preRow.materials.modelling_note, "stub body retained");

  const canonical = indexEntry(a4, "worked_judgement_weak_strong");
  const stub = indexEntry(a4, "modelling_note");
  const alias = indexEntry(a4, "worked_example");

  assert.equal(canonical?.authority, ROLE_AUTHORITY.CANONICAL);
  assert.equal(canonical?.role_family, "worked_judgement_support");
  assert.equal(canonical?.renderable, true);
  assert.equal(canonical?.canonical, true);

  assert.equal(stub?.authority, ROLE_AUTHORITY.SUPERSEDED);
  assert.equal(stub?.role_family, "worked_judgement_support");
  assert.equal(stub?.renderable, false);
  assert.equal(stub?.superseded_by, "worked_judgement_weak_strong");

  assert.equal(alias?.authority, ROLE_AUTHORITY.SUPERSEDED);
  assert.equal(alias?.renderable, false);
  assert.equal(alias?.superseded_by, "worked_judgement_weak_strong");

  const m15 = gamA4.find((m) => m.material_id === "M15");
  assert.equal(a4.materials.worked_judgement_weak_strong, m15.content);
});

test("38P-3 A4 guided judgement — decision_table superseded", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const preRow = activityRow(page, 3);
  const merged = applyGamMaterialsToComposedPage(page, gam);
  const a4 = activityRow(merged, 3);

  assert.ok(preRow.materials.decision_table, "pre-merge decision_table shell expected");
  assert.equal(a4.materials.decision_table, preRow.materials.decision_table, "shell body retained");

  const canonical = indexEntry(a4, "guided_judgement_table");
  const shell = indexEntry(a4, "decision_table");

  assert.equal(canonical?.authority, ROLE_AUTHORITY.CANONICAL);
  assert.equal(canonical?.role_family, "guided_judgement_table");
  assert.equal(shell?.authority, ROLE_AUTHORITY.SUPERSEDED);
  assert.equal(shell?.superseded_by, "guided_judgement_table");
  assert.equal(shell?.renderable, false);
});

test("38P-3 A4 transfer prompt — compose stub superseded by canonical", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, gam);
  const a4 = activityRow(merged, 3);

  const stub = indexEntry(a4, "transfer_prompt");
  const canonical = indexEntry(a4, "transfer_prompt_evaluate");

  assert.equal(canonical?.authority, ROLE_AUTHORITY.CANONICAL);
  assert.equal(canonical?.role_family, "transfer_prompt");
  assert.equal(stub?.authority, ROLE_AUTHORITY.SUPERSEDED);
  assert.equal(stub?.superseded_by, "transfer_prompt_evaluate");
  assert.equal(stub?.renderable, false);
  assert.ok(String(a4.materials.transfer_prompt || "").length > 0);
  assert.ok(String(a4.materials.transfer_prompt_evaluate || "").length > 0);
});

test("38P-3 A4 independent template — template alias superseded", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, gam);
  const a4 = activityRow(merged, 3);

  const canonical = indexEntry(a4, "independent_judgement_template");
  const alias = indexEntry(a4, "template");

  assert.equal(canonical?.authority, ROLE_AUTHORITY.CANONICAL);
  assert.equal(canonical?.role_family, "independent_template");
  assert.equal(alias?.authority, ROLE_AUTHORITY.SUPERSEDED);
  assert.equal(alias?.superseded_by, "independent_judgement_template");
  assert.equal(alias?.renderable, false);
});

test("38P-3 A1 worked example — canonical; checklist alias cleanup only", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, gam);
  const a1 = activityRow(merged, 0);

  const worked = indexEntry(a1, "worked_example");
  assert.equal(worked?.authority, ROLE_AUTHORITY.CANONICAL);
  assert.equal(worked?.role_family, "worked_example");
  assert.equal(worked?.renderable, true);

  const workedConflict = Object.values(a1.material_role_index || {}).filter(
    (e) =>
      e.role_family === "worked_example" &&
      (e.authority === ROLE_AUTHORITY.SUPERSEDED || e.authority === ROLE_AUTHORITY.ALIAS)
  );
  assert.equal(workedConflict.length, 0, "A1 worked_example should have no duplicate role entries");
});

test("38P-3 A3 — worked analytic pass canonical; checklist aliases tagged", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, gam);
  const a3 = activityRow(merged, 2);

  assert.equal(a3.activity_archetype, "analyse");

  const pass = indexEntry(a3, "worked_analytic_pass");
  assert.equal(pass?.authority, ROLE_AUTHORITY.CANONICAL);
  assert.equal(pass?.role_family, "worked_analytic_pass");

  const workedAlias = indexEntry(a3, "worked_example");
  if (workedAlias) {
    assert.equal(workedAlias.authority, ROLE_AUTHORITY.SUPERSEDED);
    assert.equal(workedAlias.renderable, false);
    assert.equal(workedAlias.superseded_by, "worked_analytic_pass");
  }
});

test("38P-3 measureRoleSupersession reports A4 duplicate-role cluster", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, gam);
  const report = measureRoleSupersession(merged);

  assert.ok(report.totals.canonical > 0);
  assert.ok(report.totals.superseded > 0 || report.totals.alias > 0);

  const a4Report = report.activities[3];
  assert.ok(a4Report.canonical.length >= 5);
  assert.ok(a4Report.superseded.length >= 3, "A4 compose stubs should be superseded");

  const supersededKeys = a4Report.superseded.map((e) => e.key);
  assert.ok(supersededKeys.includes("modelling_note"));
  assert.ok(supersededKeys.includes("decision_table"));
  assert.ok(supersededKeys.includes("transfer_prompt"));
});

test("38P-3 buildMaterialRoleIndex — unknown key is unresolved", () => {
  const index = buildMaterialRoleIndex(
    { custom_unknown_slot: "Some orphan compose text that is long enough to count." },
    { custom_unknown_slot: "Some orphan compose text that is long enough to count." },
    []
  );
  assert.equal(index.custom_unknown_slot?.authority, ROLE_AUTHORITY.UNRESOLVED);
  assert.equal(index.custom_unknown_slot?.renderable, true);
});

test("38P-3 38M body fidelity preserved after supersession metadata", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const merged = applyGamMaterialsToComposedPage(page, gam);
  const a4 = activityRow(merged, 3);

  const worked = pageMaterialText(a4.materials, "worked_judgement_weak_strong");
  assert.ok(worked.length > 400);

  const check = validate38MPageFidelity(merged, { gamSource: gam });
  assert.equal(check.ok, true, check.errors.join("; "));
});

test("38P-3 mergeMaterialsFromGamList alone does not attach role index", () => {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const a4pre = activityRow(page, 3);
  const mergedOnly = mergeMaterialsFromGamList(a4pre.materials, gamMaterials(3, gam));
  assert.equal(mergedOnly.material_role_index, undefined);
});
