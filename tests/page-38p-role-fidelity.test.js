/**
 * Sprint 38-P — Role fidelity validation (roleOk / RF-1..RF-8).
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

const { applyGamMaterialsToComposedPage, ROLE_AUTHORITY } = require(path.join(
  repoRoot,
  "lib/page-gam-materials-preserve.js"
));

const { applyA3MaterialsSequencingToComposedPage } = require(path.join(
  repoRoot,
  "lib/page-a3-materials-sequencing.js"
));

const roleFidelity = require(path.join(repoRoot, "lib/page-role-fidelity.js"));

function activityRow(page, index) {
  const section = (page.sections || []).find(
    (s) =>
      String(s.section_id || "").toLowerCase() === "learning_activities" ||
      /learning activit/i.test(String(s.heading || ""))
  );
  const rows = Array.isArray(section?.content) ? section.content : [];
  return rows[index] || null;
}

function mergedPageWithRoleIndex() {
  const gam = JSON.parse(fs.readFileSync(gamPath, "utf8"));
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  let merged = applyGamMaterialsToComposedPage(page, gam);
  merged = applyA3MaterialsSequencingToComposedPage(merged);
  return { gam, merged };
}

test("38P-5 RF-1 — duplicate authoritative role family fails", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const a4 = activityRow(merged, 3);
  a4.material_role_index.transfer_prompt_evaluate_2 = {
    role_family: "transfer_prompt",
    canonical_key: "transfer_prompt_evaluate",
    authority: ROLE_AUTHORITY.CANONICAL,
    source: "gam",
    canonical: true,
    renderable: true,
    superseded_by: null
  };
  a4.materials.transfer_prompt_evaluate_2 = a4.materials.transfer_prompt_evaluate;

  const check = roleFidelity.validate38PRoleFidelity(merged, { gamSource: gam });
  assert.equal(check.roleOk, false);
  assert.ok(check.errors.some((e) => /RF1.*transfer_prompt/i.test(e)));
});

test("38P-5 RF-5 — role inversion on consolidation fails", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const a4 = activityRow(merged, 3);
  if (a4.materials.consolidation_summary) {
    a4.materials.consolidation_summary =
      "Write a 200-word reflection explaining your household inflation strategy.";
  }

  const check = roleFidelity.validate38PRoleFidelity(merged, { gamSource: gam });
  assert.equal(check.roleOk, false);
  assert.ok(check.errors.some((e) => /RF5/.test(e)));
});

test("38P-5 RF-6 — wrong render sequence fails", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const a4Title = activityRow(merged, 3).title;
  const fakeA4Html =
    `<h3>${a4Title}</h3><div class="util-materials-stack">` +
    '<h4 class="util-material-heading"><span>Scenario</span></h4><p>s</p>' +
    '<h4 class="util-material-heading"><span>Guided judgement table</span></h4><p>g</p>' +
    '<h4 class="util-material-heading"><span>Worked judgement (weak vs strong)</span></h4><p>w</p>' +
    "</div>";

  const check = roleFidelity.validate38PRoleFidelity(merged, {
    gamSource: gam,
    renderHtml: { 3: fakeA4Html }
  });
  assert.equal(check.roleOk, false);
  assert.ok(check.errors.some((e) => /RF6/.test(e)));
});

test("38P-5 unresolved role — renderable orphan does not break RF-1", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const a4 = activityRow(merged, 3);
  a4.materials.custom_orphan_slot = "Custom orphan slot text for unresolved role coverage test.";
  a4.material_role_index.custom_orphan_slot = {
    role_family: null,
    canonical_key: "custom_orphan_slot",
    authority: ROLE_AUTHORITY.UNRESOLVED,
    source: "compose",
    canonical: false,
    renderable: true,
    superseded_by: null
  };

  const check = roleFidelity.validate38PRoleFidelity(merged, { gamSource: gam });
  assert.equal(check.gates.RF1_role_uniqueness.ok, true, check.errors.join("; "));
});

test("38P-5 RF-7 — missing pedagogical markers on canonical body fails", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const a4 = activityRow(merged, 3);
  a4.materials.worked_judgement_weak_strong = "Short synopsis without weak or strong markers.";

  const check = roleFidelity.validate38PRoleFidelity(merged, { gamSource: gam });
  assert.equal(check.roleOk, false);
  assert.ok(check.errors.some((e) => /RF4|RF7/.test(e)));
});

test("38P-5 RF-8 — missing material_role_index fails", () => {
  const page = JSON.parse(fs.readFileSync(pagePath, "utf8"));
  const check = roleFidelity.validate38PRoleFidelity(page, { gamSource: JSON.parse(fs.readFileSync(gamPath, "utf8")) });
  assert.equal(check.roleOk, false);
  assert.ok(check.errors.some((e) => /RF8/.test(e)));
});

test("38P-5 diagnostics — measureRoleFidelity and measureRoleCoverage", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const coverage = roleFidelity.measureRoleCoverage(merged);
  assert.ok(coverage.totals.canonical > 0);
  assert.ok(coverage.totals.superseded > 0);
  assert.ok(coverage.activities[3].superseded.some((s) => s.key === "modelling_note"));

  const report = roleFidelity.measureRoleFidelity(merged, { gamSource: gam });
  assert.equal(typeof report.roleOk, "boolean");
  assert.ok(report.coverage);
  assert.ok(report.supersession);
});

test("38P-5 merged page — RF1 and RF8 pass without legacy utility HTML", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const check = roleFidelity.validate38PRoleFidelity(merged, { gamSource: gam });
  assert.equal(check.gates.RF1_role_uniqueness.ok, true, check.errors.join("; "));
  assert.equal(check.gates.RF8_compose_transparency.ok, true, check.errors.join("; "));
});
