/**
 * Sprint 59 — mental_model_building MVP (thermostat fixture).
 * Delivery integrity first; does not claim transfer PASS.
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const depth = require("../lib/ld-gam-instructional-depth.js");
const archetype = require("../lib/ld-instructional-archetype.js");
const dlaEnrich = require("../lib/page-dla-enrich.js");

const fixturePath = path.join(
  __dirname,
  "..",
  "docs",
  "development",
  "sprints",
  "2026-07-14-sprint-59-instructional-content-richness-audit",
  "artefacts",
  "enzymes-archetype-mvp",
  "mental-model-building.required-material.json"
);

function pageWithMaterial(material) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A3",
        required_materials: [material]
      }
    ]
  };
}

test("mental-model opt-in is explicit only", () => {
  assert.equal(archetype.isMentalModelTestOptIn("thermostat investigation"), false);
  assert.equal(archetype.isMentalModelTestOptIn("S59_MENTAL_MODEL_TEST rooms"), true);
  assert.equal(archetype.isMentalModelTestOptIn(true), true);
});

test("mental-model token only selects mental_model activation", () => {
  const selection = archetype.resolveS59DlaTestSelection(
    "Heating systems — S59_MENTAL_MODEL_TEST"
  );
  assert.equal(selection.mental_model_requested, true);
  assert.equal(selection.mechanism_requested, false);
  assert.equal(selection.process_requested, false);
  assert.equal(selection.selected_dla_test, "mental_model");
  assert.equal(selection.conflict, false);
});

test("any two Sprint 59 DLA test tokens fail closed", () => {
  const both = archetype.resolveS59DlaTestSelection(
    "S59_PROCESS_TEST and S59_MENTAL_MODEL_TEST"
  );
  assert.equal(both.conflict, true);
  assert.equal(both.selected_dla_test, "none");
});

test("valid thermostat mental-model contract passes DLA validation", () => {
  const material = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const page = pageWithMaterial(material);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(material.archetype_plan.parts, undefined);
  assert.equal(material.archetype_plan.predicted_effect, undefined);
});

test("incomplete mental-model plans reject with useful diagnostics", () => {
  const result = archetype.validateMaterialArchetypePlan({
    material_id: "A3-M1",
    instructional_archetype: "mental_model_building",
    archetype_plan: {
      system: "x",
      key_relationships: [],
      governing_constraint: "",
      contrast: { state_a: "a" }
    }
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /key_relationships|governing_constraint|state_b/);
});

test("mental-model stamp selects mental_model_building rule only", () => {
  const page = pageWithMaterial({
    material_id: "A3-M1",
    material_type: "modelling_note"
  });
  const stamped = archetype.applyThermostatMentalModelTestPlanToDlaPage(page);
  assert.equal(stamped.ok, true);
  assert.equal(stamped.instructional_archetype, "mental_model_building");
  assert.equal(stamped.material_id, "A3-M1");
  assert.equal(stamped.activity_id, "A3");
  assert.equal(
    stamped.archetype_plan.system,
    archetype.THERMOSTAT_MENTAL_MODEL_TEST_PLAN.system
  );

  const base = depth.applyLdGamInstructionalDepthContractToDraft("GAM BASE", {
    isGenerateActivityMaterialsStep: true
  });
  const routed = archetype.applyArchetypeRoutingBlockToDraft(base, page, {
    isGenerateActivityMaterialsStep: true
  });
  assert.match(routed, /Selected rule ids for this request: mental_model_building\./);
  assert.match(
    routed,
    /Build a coherent account of the named system using the supplied relationships and governing constraint/
  );
  assert.match(routed, /two supplied states/);
  assert.match(routed, /finite heating capacity/);
  assert.match(routed, /mildly cold/);
  assert.match(routed, /extremely cold/);
  assert.doesNotMatch(routed, /Realise every entry in required_links/);
  assert.doesNotMatch(routed, /worked walkthrough/i);
  assert.doesNotMatch(routed, /predicted_effect/);
  assert.match(routed, /ANTI-GAMING/i);
  assert.match(routed, /ANTI-LEAKAGE/i);
});

test("mental-model DLA emission block carries thermostat fixture only", () => {
  const draft = archetype.applyDlaMentalModelTestEmissionBlockToDraft("DLA BASE", {
    isDesignLearningActivitiesStep: true,
    mentalModelTestOptIn: true
  });
  assert.match(draft, /LD-INSTRUCTIONAL-ARCHETYPE-DLA-MENTAL-MODEL-TEST/);
  assert.match(draft, /S59_MENTAL_MODEL_TEST is active/);
  assert.match(draft, /"instructional_archetype": "mental_model_building"/);
  assert.match(draft, /thermostat-controlled heater/);
  assert.doesNotMatch(draft, /"instructional_archetype": "mechanism_explanation"/);
  assert.doesNotMatch(draft, /"instructional_archetype": "process_walkthrough"/);
  assert.doesNotMatch(draft, /"predicted_effect"\s*:/);
  assert.doesNotMatch(draft, /"parts"\s*:/);
});

test("process rule text remains frozen 20260715-4 wording", () => {
  assert.equal(archetype.PROCESS_RULE_FROZEN_VERSION, "20260715-4");
  assert.match(
    archetype.RULES.process_walkthrough,
    /Realise the process_goal as one continuous worked walkthrough/
  );
  assert.match(
    archetype.RULES.process_walkthrough,
    /explicit intermediate finding/
  );
});

test("SCRIPT_VERSION bumped for mental-model MVP module", () => {
  assert.equal(archetype.SCRIPT_VERSION, "20260715-e01w");
});
