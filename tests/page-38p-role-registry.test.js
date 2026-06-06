/**
 * Sprint 38-P — Role registry unit tests.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const registry = require(path.join(repoRoot, "lib/page-role-registry.js"));

const {
  ROLE_REGISTRY_VERSION,
  resolveRoleFamily,
  resolveCanonicalKey,
  resolveCanonicalRole,
  resolveRoleHeading,
  resolveRoleSequence,
  resolveRoleMetadata,
  resolveRoleFromGam,
  getAllowedAliases,
  getAuthorityRules,
  getRoleFamilyForPageKey,
  getSequenceForArchetype,
  getRegistryEntry,
  listRoleFamilies,
  ROLE_RENDER_ALIAS_GROUPS
} = registry;

test("38P registry version is 38P-2", () => {
  assert.equal(ROLE_REGISTRY_VERSION, "38P-2");
});

test("38P registry lists all charter role families", () => {
  const families = listRoleFamilies();
  const required = [
    "worked_example",
    "worked_calculation",
    "worked_analytic_pass",
    "model_answer",
    "model_calculation",
    "sample_output",
    "explanatory_guidance",
    "reasoning_support",
    "scaffold_hint",
    "scenario",
    "verification_checklist",
    "worked_judgement_support",
    "guided_judgement_table",
    "independent_template",
    "transfer_prompt",
    "consolidation_summary",
    "learner_task",
    "practice_table"
  ];
  required.forEach((f) => {
    assert.ok(families.includes(f), "missing role family: " + f);
  });
});

test("38P resolveRoleFamily — worked variants disambiguated by purpose", () => {
  assert.equal(resolveRoleFamily("worked_example", "worked thinking"), "worked_example");
  assert.equal(resolveRoleFamily("worked_example", "worked analytic pass"), "worked_analytic_pass");
  assert.equal(
    resolveRoleFamily("worked_example", "CPI calculation walkthrough"),
    "worked_calculation"
  );
});

test("38P resolveCanonicalKey — aligns with 38M pageFieldKeyForMaterial branches", () => {
  assert.equal(resolveCanonicalKey("modelling_note", "worked judgement"), "worked_judgement_weak_strong");
  assert.equal(resolveCanonicalKey("decision_table", "guided judgement"), "guided_judgement_table");
  assert.equal(resolveCanonicalKey("transfer_prompt", "transfer"), "transfer_prompt_evaluate");
  assert.equal(resolveCanonicalKey("template", "independent judgement"), "independent_judgement_template");
  assert.equal(resolveCanonicalKey("text", "criteria exposition"), "criteria_exposition_evaluate");
  assert.equal(resolveCanonicalKey("text", "concept elucidation"), "concept_exposition");
  assert.equal(resolveCanonicalKey("checklist", "verification"), "checklist_evaluate");
  assert.equal(resolveCanonicalKey("scenario", "decision context"), "scenario_maya_households");
  assert.equal(resolveCanonicalKey("scenario", "strategy menu"), "scenario_maya_strategy_menu");
});

test("38P A4 — modelling_note maps to worked_judgement_support", () => {
  assert.equal(resolveRoleFamily("modelling_note", "worked judgement"), "worked_judgement_support");
  assert.equal(resolveCanonicalKey("modelling_note", "worked judgement"), "worked_judgement_weak_strong");
  assert.equal(
    resolveRoleHeading("worked_judgement_support"),
    "Worked judgement (weak vs strong)"
  );
  const meta = resolveRoleMetadata("modelling_note", "worked judgement");
  assert.equal(meta.role_family, "worked_judgement_support");
  assert.equal(meta.canonical_key, "worked_judgement_weak_strong");
  assert.deepEqual(meta.authority_rules.body_markers, [
    "weak_worked_judgement",
    "strong_worked_judgement"
  ]);
  assert.ok(getAllowedAliases("worked_judgement_support").includes("modelling_note"));
  assert.equal(
    getRoleFamilyForPageKey("modelling_note", { prefer_judgement: true }),
    "worked_judgement_support"
  );
  assert.equal(getRoleFamilyForPageKey("worked_judgement_weak_strong"), "worked_judgement_support");
});

test("38P A4 — decision_table maps to guided_judgement_table", () => {
  assert.equal(resolveRoleFamily("decision_table", "guided judgement"), "guided_judgement_table");
  assert.equal(resolveCanonicalKey("decision_table", "guided judgement"), "guided_judgement_table");
  assert.equal(getRoleFamilyForPageKey("decision_table"), "guided_judgement_table");
  assert.equal(getRoleFamilyForPageKey("guided_judgement_table"), "guided_judgement_table");
  assert.ok(getAllowedAliases("guided_judgement_table").includes("decision_table"));
  assert.ok(ROLE_RENDER_ALIAS_GROUPS.guided_judgement_table.includes("decision_table"));
});

test("38P A4 — transfer_prompt variants map to transfer_prompt role", () => {
  assert.equal(resolveRoleFamily("transfer_prompt", "transfer"), "transfer_prompt");
  assert.equal(resolveCanonicalKey("transfer_prompt", "transfer"), "transfer_prompt_evaluate");
  assert.equal(getRoleFamilyForPageKey("transfer_prompt"), "transfer_prompt");
  assert.equal(getRoleFamilyForPageKey("transfer_prompt_evaluate"), "transfer_prompt");
  assert.ok(getAllowedAliases("transfer_prompt").includes("transfer_prompt"));
  assert.ok(getAllowedAliases("transfer_prompt").includes("transfer_prompt_evaluate"));
});

test("38P A4 — independent template mappings", () => {
  assert.equal(resolveRoleFamily("template", "independent judgement"), "independent_template");
  assert.equal(resolveCanonicalKey("template", "independent judgement"), "independent_judgement_template");
  assert.equal(getRoleFamilyForPageKey("independent_judgement_template"), "independent_template");
  assert.equal(getRoleFamilyForPageKey("template"), "independent_template");
  assert.ok(getAllowedAliases("independent_template").includes("template"));
  assert.ok(getAllowedAliases("independent_template").includes("independent_judgement_template"));
});

test("38P resolveRoleFromGam — material object convenience", () => {
  const meta = resolveRoleFromGam({
    type: "modelling_note",
    purpose: "worked judgement",
    material_id: "M15"
  });
  assert.equal(meta.role_family, "worked_judgement_support");
  assert.equal(meta.canonical_key, "worked_judgement_weak_strong");
  assert.equal(meta.authority, "gam");
});

test("38P alias resolution — checklist and scenario families", () => {
  assert.equal(resolveRoleFamily("checklist", "verification"), "verification_checklist");
  assert.ok(getAllowedAliases("verification_checklist").includes("verification_checklist"));
  assert.ok(getAllowedAliases("verification_checklist").includes("checklist_evaluate"));
  assert.equal(getRoleFamilyForPageKey("evaluation_checklist"), "verification_checklist");
  assert.equal(resolveRoleFamily("scenario", "case study"), "scenario");
  assert.equal(getRoleFamilyForPageKey("scenario_maya_households"), "scenario");
});

test("38P sequence ordering — evaluate archetype matches 38I-4 A4 flow", () => {
  const sequence = getSequenceForArchetype("evaluate");
  const workedIdx = sequence.indexOf("worked_judgement_support");
  const guidedIdx = sequence.indexOf("guided_judgement_table");
  const templateIdx = sequence.indexOf("independent_template");
  const checklistIdx = sequence.indexOf("verification_checklist");
  const transferIdx = sequence.indexOf("transfer_prompt");
  assert.ok(workedIdx >= 0 && guidedIdx > workedIdx, "guided follows worked judgement");
  assert.ok(templateIdx > guidedIdx, "template follows guided table");
  assert.ok(checklistIdx > templateIdx, "checklist follows template");
  assert.ok(transferIdx > checklistIdx, "transfer follows checklist");
  assert.equal(resolveRoleSequence("worked_judgement_support", "evaluate"), 30);
  assert.equal(resolveRoleSequence("guided_judgement_table", "evaluate"), 40);
  assert.equal(resolveRoleSequence("transfer_prompt", "evaluate"), 80);
});

test("38P sequence ordering — analyse archetype prioritises worked analytic pass", () => {
  const sequence = getSequenceForArchetype("analyse");
  const passIdx = sequence.indexOf("worked_analytic_pass");
  const tableIdx = sequence.indexOf("practice_table");
  assert.ok(passIdx >= 0 && tableIdx > passIdx, "worksheet follows worked pass on analyse");
});

test("38P resolveCanonicalRole — family default and context override", () => {
  assert.equal(resolveCanonicalRole("worked_judgement_support"), "worked_judgement_weak_strong");
  assert.equal(
    resolveCanonicalRole("explanatory_guidance", {
      type: "text",
      purpose: "criteria exposition"
    }),
    "criteria_exposition_evaluate"
  );
  assert.equal(
    resolveCanonicalRole("explanatory_guidance", {
      type: "text",
      purpose: "concept elucidation"
    }),
    "concept_exposition"
  );
});

test("38P activity-row roles — scaffold and learner task", () => {
  const scaffold = getRegistryEntry("scaffold_hint");
  assert.equal(scaffold.storage, "activity_row");
  assert.equal(scaffold.activity_row_field, "scaffold_hint_sequence");
  assert.equal(getRoleFamilyForPageKey("scaffold_hint_sequence"), "scaffold_hint");
  const learner = getRegistryEntry("learner_task");
  assert.equal(learner.storage, "activity_row");
  assert.equal(learner.activity_row_field, "learner_task");
});

test("38P unknown and fallback behaviour", () => {
  assert.equal(resolveRoleFamily("unknown_type", "foo"), null);
  assert.equal(resolveCanonicalKey("unknown_type", "foo"), null);
  assert.equal(resolveRoleMetadata("unknown_type", "foo"), null);
  assert.equal(getRoleFamilyForPageKey("nonexistent_key"), null);
  assert.equal(getRegistryEntry("nonexistent_family"), null);
  assert.deepEqual(getAllowedAliases("nonexistent_family"), []);
  assert.equal(resolveRoleSequence("nonexistent_family", "evaluate"), null);
});

test("38P authority rules exposed per role family", () => {
  const rules = getAuthorityRules("consolidation_summary");
  assert.ok(Array.isArray(rules.inversion_markers));
  assert.ok(rules.inversion_markers.includes("learner_write_prompt"));
  const guided = getAuthorityRules("guided_judgement_table");
  assert.ok(guided.body_markers.includes("guided_table_exemplar"));
});
