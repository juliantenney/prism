const test = require("node:test");
const assert = require("node:assert/strict");
const depth = require("../lib/ld-gam-instructional-depth.js");
const archetype = require("../lib/ld-instructional-archetype.js");
const dlaEnrich = require("../lib/page-dla-enrich.js");

function pageWithMaterial(material) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A4",
        required_materials: [material]
      }
    ]
  };
}

test("process opt-in is explicit only", () => {
  assert.equal(archetype.isProcessTestOptIn("Enzymes investigation"), false);
  assert.equal(archetype.isProcessTestOptIn("S59_PROCESS_TEST enzymes"), true);
  assert.equal(archetype.isProcessTestOptIn(true), true);
});

test("valid process contract passes validation", () => {
  const page = pageWithMaterial({
    material_id: "A4-M1",
    material_type: "worked_example",
    instructional_archetype: "process_walkthrough",
    archetype_plan: archetype.ENZYMES_PROCESS_TEST_PLAN
  });
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("invalid process contract fails validation", () => {
  const page = pageWithMaterial({
    material_id: "A4-M1",
    material_type: "worked_example",
    instructional_archetype: "process_walkthrough",
    archetype_plan: { process_goal: "x", stages: ["only-one"] }
  });
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, false);
  assert.match(check.errors.join("\n"), /at least two/i);
});

test("process stamp selects process_walkthrough rule only", () => {
  const page = pageWithMaterial({
    material_id: "A4-M1",
    material_type: "worked_example"
  });
  const stamped = archetype.applyEnzymesProcessTestPlanToDlaPage(page);
  assert.equal(stamped.ok, true);
  assert.equal(stamped.instructional_archetype, "process_walkthrough");
  assert.equal(stamped.material_id, "A4-M1");
  assert.equal(stamped.activity_id, "A4");

  const base = depth.applyLdGamInstructionalDepthContractToDraft("GAM BASE", {
    isGenerateActivityMaterialsStep: true
  });
  const routed = archetype.applyArchetypeRoutingBlockToDraft(base, page, {
    isGenerateActivityMaterialsStep: true
  });
  assert.match(routed, /Selected rule ids for this request: process_walkthrough\./);
  assert.match(routed, /Walk through the supplied stages in order/);
  assert.doesNotMatch(routed, /Realise every entry in required_links/);
  assert.doesNotMatch(routed, /Build a coherent working model/);
  assert.equal(
    routed.split(archetype.ENZYMES_PROCESS_TEST_PLAN.process_goal).length - 1,
    1
  );
  assert.equal(routed.split("archetype_plan:").length - 1, 1);
});

test("legacy path remains unchanged under process plumbing", () => {
  const page = pageWithMaterial({
    material_id: "A4-M2",
    material_type: "checklist",
    purpose: "check"
  });
  assert.equal(archetype.buildArchetypeRoutingBlock(page), "");
  assert.equal(
    archetype.applyDlaProcessTestEmissionBlockToDraft("DLA", {
      isDesignLearningActivitiesStep: true,
      processTestOptIn: false
    }),
    "DLA"
  );
});

test("process DLA emission block attaches only with opt-in", () => {
  const withOptIn = archetype.applyDlaProcessTestEmissionBlockToDraft("DLA BASE", {
    isDesignLearningActivitiesStep: true,
    processTestOptIn: true
  });
  assert.match(withOptIn, /LD-INSTRUCTIONAL-ARCHETYPE-DLA-PROCESS-TEST/);
  assert.match(withOptIn, /"instructional_archetype": "process_walkthrough"/);
  assert.doesNotMatch(
    withOptIn,
    /"instructional_archetype": "(mechanism_explanation|mental_model_building)"/
  );
});

test("process debug snapshots expose selected rule", () => {
  const page = pageWithMaterial({
    material_id: "A4-M1",
    material_type: "worked_example"
  });
  archetype.applyEnzymesProcessTestPlanToDlaPage(page);
  const snaps = archetype.collectRoutingDebugSnapshots(page);
  assert.equal(snaps.length, 1);
  assert.equal(snaps[0].instructional_archetype, "process_walkthrough");
  assert.equal(snaps[0].rule_selected, true);
  assert.ok(snaps[0].archetype_plan.process_goal);
});
