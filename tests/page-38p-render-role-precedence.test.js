/**
 * Sprint 38-P — Render role precedence (material_role_index consumer).
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
  validate38MPageFidelity
} = require(path.join(repoRoot, "lib/page-gam-materials-preserve.js"));

const { applyA3MaterialsSequencingToComposedPage } = require(path.join(
  repoRoot,
  "lib/page-a3-materials-sequencing.js"
));

const roleRender = require(path.join(repoRoot, "lib/page-role-render-sequencing.js"));

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

test("38P-4 plan — A4 selects canonical keys and skips superseded stubs", () => {
  const { merged } = mergedPageWithRoleIndex();
  const a4 = activityRow(merged, 3);
  assert.ok(roleRender.isRolePrecedenceActive(a4));

  const plan = roleRender.buildRolePrecedenceRenderPlan(a4, a4.materials);
  const keys = plan.map((p) => p.key);

  assert.ok(keys.includes("worked_judgement_weak_strong"));
  assert.ok(keys.includes("guided_judgement_table"));
  assert.ok(keys.includes("transfer_prompt_evaluate"));
  assert.ok(keys.includes("independent_judgement_template"));
  assert.equal(keys.includes("modelling_note"), false);
  assert.equal(keys.includes("decision_table"), false);
  assert.equal(keys.includes("transfer_prompt"), false);
  assert.equal(keys.includes("template"), false);
});

test("38P-4 A3 — role precedence active with materials_order on merged page", () => {
  const { merged } = mergedPageWithRoleIndex();
  const a3 = activityRow(merged, 2);
  assert.ok(roleRender.isRolePrecedenceActive(a3));
  assert.ok(Array.isArray(a3.materials_order));
});

test("38P-4 38M body fidelity preserved on merged replay", () => {
  const { gam, merged } = mergedPageWithRoleIndex();
  const check = validate38MPageFidelity(merged, { gamSource: gam });
  assert.equal(check.ok, true, check.errors.join("; "));
});
