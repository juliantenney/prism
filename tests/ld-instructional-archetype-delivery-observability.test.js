/**
 * Sprint 60 Phase B — archetype routing delivery observability and verification.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const archetype = require("../lib/ld-instructional-archetype.js");
const depth = require("../lib/ld-gam-instructional-depth.js");

function mechanismMaterial() {
  return {
    material_id: "A2-M1",
    material_type: "text",
    instructional_archetype: "mechanism_explanation",
    archetype_plan: {
      start: "temperature increases",
      outcome: "reaction rate changes",
      required_links: ["collision frequency", "denaturation"]
    }
  };
}

function processMaterial() {
  return {
    material_id: "A4-M1",
    material_type: "worked_example",
    instructional_archetype: "process_walkthrough",
    archetype_plan: {
      process_goal: "interpret an enzyme reaction-rate investigation",
      stages: ["identify condition", "inspect pattern", "conclude"]
    }
  };
}

function mentalModelMaterial() {
  return {
    material_id: "A3-M1",
    material_type: "modelling_note",
    instructional_archetype: "mental_model_building",
    archetype_plan: {
      system: "a room heated by a thermostat-controlled heater",
      key_relationships: ["thermostat compares temperature with set point"],
      governing_constraint: "finite heating capacity",
      contrast: {
        state_a: "mild cold",
        state_b: "extreme cold"
      }
    }
  };
}

function pageWithMaterials(materialsByActivity) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: Object.keys(materialsByActivity).map(function (activityId) {
      return {
        activity_id: activityId,
        required_materials: materialsByActivity[activityId]
      };
    })
  };
}

function assembleGamPrompt(page) {
  var draft = depth.applyLdGamInstructionalDepthContractToDraft("GAM BASE", {
    isGenerateActivityMaterialsStep: true
  });
  return archetype.applyArchetypeRoutingBlockToDraft(draft, page, {
    isGenerateActivityMaterialsStep: true
  });
}

test("no-archetype page: expected empty, delivery pass, no false fail", () => {
  var page = pageWithMaterials({
    A1: [{ material_id: "A1-M1", material_type: "text", purpose: "Define term" }]
  });
  var prompt = assembleGamPrompt(page);
  var delivery = archetype.buildArchetypeDeliveryVerification(page, prompt);
  assert.deepEqual(delivery.expected, []);
  assert.deepEqual(delivery.delivered, []);
  assert.deepEqual(delivery.missing, []);
  assert.equal(delivery.pass, true);

  var snap = archetype.buildFinalGamPromptObservabilitySnapshot(prompt, {}, page);
  assert.equal(snap.archetype_delivery.pass, true);
  assert.equal(snap.contains_archetype_routing, false);
  assert.deepEqual(snap.selected_instructional_archetypes, []);
});

test("single-archetype page: expected equals delivered and pass is true", () => {
  var page = pageWithMaterials({ A2: [mechanismMaterial()] });
  var prompt = assembleGamPrompt(page);
  var delivery = archetype.buildArchetypeDeliveryVerification(page, prompt);
  assert.deepEqual(delivery.expected, ["mechanism_explanation"]);
  assert.deepEqual(delivery.delivered, ["mechanism_explanation"]);
  assert.deepEqual(delivery.missing, []);
  assert.equal(delivery.pass, true);

  var snap = archetype.buildFinalGamPromptObservabilitySnapshot(prompt, {}, page);
  assert.equal(snap.contains_archetype_routing, true);
  assert.equal(snap.contains_mechanism_rule, true);
  assert.equal(snap.contains_process_rule, false);
  assert.equal(snap.contains_mental_model_rule, false);
  assert.deepEqual(snap.selected_instructional_archetypes, ["mechanism_explanation"]);
  assert.equal(snap.selected_instructional_archetype, "mechanism_explanation");
});

test("mixed-archetype page: every expected Priority-1 archetype is delivered", () => {
  var page = pageWithMaterials({
    A2: [mechanismMaterial()],
    A4: [processMaterial()],
    A3: [mentalModelMaterial()]
  });
  var prompt = assembleGamPrompt(page);
  var delivery = archetype.buildArchetypeDeliveryVerification(page, prompt);
  assert.deepEqual(delivery.expected, [
    "mechanism_explanation",
    "mental_model_building",
    "process_walkthrough"
  ]);
  assert.deepEqual(delivery.delivered, delivery.expected);
  assert.equal(delivery.pass, true);

  var snap = archetype.buildFinalGamPromptObservabilitySnapshot(prompt, {}, page);
  assert.equal(snap.contains_mechanism_rule, true);
  assert.equal(snap.contains_process_rule, true);
  assert.equal(snap.contains_mental_model_rule, true);
  assert.equal(snap.selected_instructional_archetypes.length, 3);
});

test("prompt missing expected routing rule reports archetype in missing and pass false", () => {
  var page = pageWithMaterials({
    A2: [mechanismMaterial()],
    A4: [processMaterial()]
  });
  var fullPrompt = assembleGamPrompt(page);
  var stripped = fullPrompt.replace(
    /- Material A4-M1[\s\S]*?Rule: Realise the process_goal[\s\S]*?(?=\n- Material|\n- Selected rule ids)/,
    ""
  );
  stripped = stripped.replace(
    /,?\s*process_walkthrough(?=\.)/,
    ""
  );
  var delivery = archetype.buildArchetypeDeliveryVerification(page, stripped);
  assert.deepEqual(delivery.expected, [
    "mechanism_explanation",
    "process_walkthrough"
  ]);
  assert.equal(delivery.delivered.indexOf("mechanism_explanation") >= 0, true);
  assert.equal(delivery.delivered.indexOf("process_walkthrough") >= 0, false);
  assert.deepEqual(delivery.missing, ["process_walkthrough"]);
  assert.equal(delivery.pass, false);
});

test("acceptance rule is documented on the observability snapshot", () => {
  assert.match(
    archetype.ACCEPTANCE_RULE,
    /Do not evaluate archetype quality until archetype_delivery\.pass is true/
  );
  var snap = archetype.buildFinalGamPromptObservabilitySnapshot("GAM", {}, null);
  assert.equal(snap.acceptance_rule, archetype.ACCEPTANCE_RULE);
});

test("observability publication does not change routed prompt content", () => {
  var page = pageWithMaterials({
    A2: [mechanismMaterial()],
    A4: [processMaterial()]
  });
  var before = assembleGamPrompt(page);
  archetype.buildFinalGamPromptObservabilitySnapshot(before, { source: "test" }, page);
  var after = assembleGamPrompt(page);
  assert.equal(before, after);
});
