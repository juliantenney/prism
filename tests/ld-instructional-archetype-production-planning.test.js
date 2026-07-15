/**
 * Sprint 60 Phase A — production instructional-archetype planning.
 * Authoritative SoT: required_materials[].instructional_archetype + archetype_plan.
 * No S59_*_TEST tokens, window flags, selected_dla_test, emission blocks, or stamps.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const archetype = require("../lib/ld-instructional-archetype.js");
const dlaContract = require("../lib/ld-dla-page-enrich-contract.js");
const dlaEnrich = require("../lib/page-dla-enrich.js");

function mechanismMaterial(overrides) {
  return Object.assign(
    {
      material_id: "A2-M1",
      material_type: "text",
      purpose: "Explain the enzyme temperature mechanism",
      instructional_archetype: "mechanism_explanation",
      archetype_plan: {
        start: "temperature increases within and beyond the enzyme's stable range",
        outcome: "reaction rate first increases and then decreases",
        required_links: [
          "molecular kinetic energy and collision frequency",
          "enzyme-substrate complex formation",
          "disruption of enzyme structure at high temperature"
        ]
      }
    },
    overrides || {}
  );
}

function processMaterial(overrides) {
  return Object.assign(
    {
      material_id: "A4-M1",
      material_type: "worked_example",
      purpose: "Walk through interpreting reaction-rate results",
      instructional_archetype: "process_walkthrough",
      archetype_plan: {
        process_goal: "interpret an enzyme reaction-rate investigation",
        stages: [
          "identify the manipulated condition and measured outcome",
          "inspect the pattern across observations",
          "connect the pattern to enzyme behaviour",
          "form a bounded conclusion"
        ]
      }
    },
    overrides || {}
  );
}

function mentalModelMaterial(overrides) {
  return Object.assign(
    {
      material_id: "A3-M1",
      material_type: "modelling_note",
      purpose: "Build a working thermostat model",
      instructional_archetype: "mental_model_building",
      archetype_plan: {
        system: "a room heated by a thermostat-controlled heater",
        key_relationships: [
          "the thermostat compares room temperature with the set point",
          "below set point the heater turns on; at or above set point it turns off"
        ],
        governing_constraint: "the heater has a finite heating capacity",
        contrast: {
          state_a: "the outside temperature is mildly cold",
          state_b: "the outside temperature becomes extremely cold"
        }
      }
    },
    overrides || {}
  );
}

function pageFromMaterials(materialsByActivity) {
  const activities = Object.keys(materialsByActivity).map(function (activityId) {
    return {
      activity_id: activityId,
      required_materials: materialsByActivity[activityId]
    };
  });
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: activities
  };
}

test("S60 Phase A: DLA enrich-contract teaches production Priority-1 archetype planning", () => {
  const guidance = dlaContract.buildInstructionalArchetypePlanningGuidance();
  const snippet = dlaContract.buildCanonicalDlaPageShapeSnippet();

  assert.match(guidance, /instructional_archetype/);
  assert.match(guidance, /archetype_plan/);
  assert.match(guidance, /mechanism_explanation/);
  assert.match(guidance, /process_walkthrough/);
  assert.match(guidance, /mental_model_building/);
  assert.match(guidance, /evaluation_judgement/);
  assert.match(guidance, /key_relationships/);
  assert.match(guidance, /governing_constraint/);
  assert.match(guidance, /contrast/);
  assert.match(guidance, /state_a/);
  assert.match(guidance, /state_b/);
  assert.match(guidance, /judgement_focus/);
  assert.match(guidance, /Do NOT emit parts/);
  assert.match(guidance, /predicted_effect/);
  assert.match(guidance, /multiple materials using different Priority-1 archetypes/i);
  assert.match(guidance, /Ordinary materials must omit/i);
  assert.match(guidance, /material_type is presentation format/i);
  assert.match(guidance, /Do not use workflow goal\/title tokens/i);
  assert.doesNotMatch(guidance, /system\/parts\/relationships/);
  assert.doesNotMatch(guidance, /omit unless intentional/i);
  assert.doesNotMatch(guidance, /S59_/);

  assert.match(snippet, /Instructional archetype planning on required_materials/);
  assert.match(snippet, /key_relationships/);
  assert.match(snippet, /evaluation_judgement/);
  assert.doesNotMatch(snippet, /system\/parts\/relationships/);
  assert.equal(dlaContract.CONTRACT_VERSION, "58-DLA-PARTIAL-2");
});

test("S60 Phase A: valid archetype DLA page routes to GAM with no S59 activation", () => {
  const page = pageFromMaterials({
    A2: [mechanismMaterial()]
  });

  assert.equal(archetype.isMechanismTestOptIn("Enzymes without token"), false);
  assert.equal(archetype.isProcessTestOptIn(page), false);
  assert.equal(archetype.isMentalModelTestOptIn({ goal: "normal lesson" }), false);
  assert.equal(
    archetype.resolveS59DlaTestSelection({ goal: "normal lesson" }).selected_dla_test,
    "none"
  );

  const validated = archetype.validatePageArchetypePlans(page);
  assert.equal(validated.errors.length, 0, validated.errors.join("; "));
  assert.equal(validated.activeAssignments.length, 1);

  const draft = archetype.applyArchetypeRoutingBlockToDraft("GAM BASE", page, {
    isGenerateActivityMaterialsStep: true
  });
  assert.match(draft, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.match(draft, /instructional_archetype=mechanism_explanation/);
  assert.match(draft, /Realise every entry in required_links/);
  assert.doesNotMatch(draft, /S59_MECHANISM_TEST|S59_PROCESS_TEST|S59_MENTAL_MODEL_TEST/);
  assert.doesNotMatch(draft, /LD-INSTRUCTIONAL-ARCHETYPE-DLA-(MECHANISM|PROCESS|MENTAL-MODEL)-TEST/);
  assert.doesNotMatch(draft, /selected_dla_test/);
});

test("S60 Phase A: mixed Priority-1 archetypes on one page route both rules", () => {
  const page = pageFromMaterials({
    A2: [mechanismMaterial()],
    A4: [processMaterial()],
    A1: [
      {
        material_id: "A1-M1",
        material_type: "text",
        purpose: "Ordinary orientation — no archetype"
      }
    ]
  });

  const validated = archetype.validatePageArchetypePlans(page);
  assert.equal(validated.errors.length, 0, validated.errors.join("; "));
  assert.equal(validated.activeAssignments.length, 2);

  const block = archetype.buildArchetypeRoutingBlock(page);
  assert.match(block, /instructional_archetype=mechanism_explanation/);
  assert.match(block, /instructional_archetype=process_walkthrough/);
  assert.match(
    block,
    /Selected rule ids for this request: mechanism_explanation, process_walkthrough\./
  );
  assert.match(block, /Realise every entry in required_links/);
  assert.match(block, /worked walkthrough/i);
  assert.doesNotMatch(block, /mental_model_building/);
  assert.doesNotMatch(block, /S59_/);

  const capture = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(capture.ok, true, (capture.errors || []).join("; "));
});

test("S60 Phase A: corrected mental_model_building contract validates and routes", () => {
  const material = mentalModelMaterial();
  assert.equal(
    Object.prototype.hasOwnProperty.call(material.archetype_plan, "parts"),
    false
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(material.archetype_plan, "predicted_effect"),
    false
  );

  const result = archetype.validateMaterialArchetypePlan(material);
  assert.equal(result.ok, true, result.errors.join("; "));
  assert.equal(result.active, true);

  const page = pageFromMaterials({ A3: [material] });
  const draft = archetype.applyArchetypeRoutingBlockToDraft("GAM BASE", page, {
    isGenerateActivityMaterialsStep: true
  });
  assert.match(draft, /instructional_archetype=mental_model_building/);
  assert.match(draft, /Build a coherent account of the named system/);
  assert.match(draft, /key_relationships/);
  assert.match(draft, /governing_constraint/);
  assert.match(draft, /Selected rule ids for this request: mental_model_building\./);
  assert.doesNotMatch(draft, /"parts"/);
  assert.doesNotMatch(draft, /predicted_effect/);
  assert.doesNotMatch(draft, /S59_MENTAL_MODEL_TEST/);

  const capture = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(capture.ok, true, (capture.errors || []).join("; "));
});

test("S60 Phase A: incomplete mental_model plan fails capture validation", () => {
  const page = pageFromMaterials({
    A3: [
      mentalModelMaterial({
        archetype_plan: {
          system: "a thermostat room",
          parts: ["sensor", "heater"],
          relationships: ["sensor controls heater"]
        }
      })
    ]
  });
  const bad = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(bad.ok, false);
  assert.match(
    bad.errors.join("\n"),
    /key_relationships|governing_constraint|contrast/i
  );
});

test("S60 Phase A: non-archetype materials still omit routing", () => {
  const page = pageFromMaterials({
    A1: [
      {
        material_id: "A1-M1",
        material_type: "text",
        purpose: "Define a term"
      }
    ]
  });
  assert.equal(archetype.buildArchetypeRoutingBlock(page), "");
  const after = archetype.applyArchetypeRoutingBlockToDraft("GAM BASE", page, {
    isGenerateActivityMaterialsStep: true
  });
  assert.equal(after, "GAM BASE");
});
