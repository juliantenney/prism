const test = require("node:test");
const assert = require("node:assert/strict");
const depth = require("../lib/ld-gam-instructional-depth.js");
const archetype = require("../lib/ld-instructional-archetype.js");
const materialsCopy = require("../lib/ld-materials-copy.js");

const OLD_PROCESS_RULE =
  "Walk through the supplied stages in order. Explain what happens at each stage and why it advances the process; do not turn stage labels into unsupported numbered facts.";

const REVISED_PROCESS_RULE_PREFIX =
  "Realise the process_goal as one continuous worked walkthrough";

function a4ProcessPage() {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A4",
        required_materials: [
          {
            material_id: "A4-M1",
            material_type: "worked_example"
          }
        ]
      }
    ]
  };
  const stamped = archetype.applyEnzymesProcessTestPlanToDlaPage(page);
  assert.equal(stamped.ok, true);
  return page;
}

/**
 * Approximate the live GAM augmentation order for the A4-M1 governing stack:
 * materials-copy (author) → DEPTH → archetype routing.
 */
function assembleA4M1GamPromptSegment(baseDraft) {
  const page = a4ProcessPage();
  let draft = String(baseDraft || "GAM BASE PROMPT").trim();
  draft += materialsCopy.buildLdMaterialsCopyPromptBlock({
    role: "author",
    includeMarker: true
  });
  draft = depth.applyLdGamInstructionalDepthContractToDraft(draft, {
    isGenerateActivityMaterialsStep: true
  });
  draft = archetype.applyArchetypeRoutingBlockToDraft(draft, page, {
    isGenerateActivityMaterialsStep: true
  });
  return { draft, page };
}

test("assembled A4-M1 GAM prompt contains revised process rule verbatim", () => {
  const { draft } = assembleA4M1GamPromptSegment();
  assert.match(draft, new RegExp(REVISED_PROCESS_RULE_PREFIX));
  assert.ok(draft.includes(archetype.RULES.process_walkthrough));
  assert.doesNotMatch(draft, /Walk through the supplied stages in order/);
});

test("assembled A4-M1 GAM prompt contains process_goal and all four stages in order", () => {
  const { draft } = assembleA4M1GamPromptSegment();
  assert.match(draft, /interpret an enzyme reaction-rate investigation/);
  const stages = archetype.ENZYMES_PROCESS_TEST_PLAN.stages;
  stages.forEach(function (stage) {
    assert.match(draft, new RegExp(stage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
  const first = draft.indexOf(stages[0]);
  const second = draft.indexOf(stages[1]);
  const third = draft.indexOf(stages[2]);
  const fourth = draft.indexOf(stages[3]);
  assert.ok(first >= 0 && second > first && third > second && fourth > third);
});

test("assembled A4-M1 GAM prompt selects process_walkthrough only", () => {
  const { draft } = assembleA4M1GamPromptSegment();
  assert.match(draft, /Selected rule ids for this request: process_walkthrough\./);
  assert.doesNotMatch(draft, /Selected rule ids for this request:.*mechanism_explanation/);
  assert.doesNotMatch(draft, /Selected rule ids for this request:.*mental_model_building/);
  assert.doesNotMatch(draft, /Realise every entry in required_links/);
  assert.doesNotMatch(draft, /Build a coherent account of the named system/);
  assert.doesNotMatch(draft, /Build a coherent working model/);
});

test("assembled A4-M1 GAM prompt contains anti-collapse and finding-transfer duties", () => {
  const { draft } = assembleA4M1GamPromptSegment();
  assert.match(draft, /procedural checklist/i);
  assert.match(draft, /explicit intermediate finding/i);
  assert.match(draft, /carry that finding forward/i);
  assert.match(draft, /final conclusion must depend on those findings/i);
  assert.match(draft, /do not restate stage labels as procedural Step\/how-to/i);
  assert.match(draft, /do not produce a how-to guide/i);
});

test("stale embedded routing block is replaced with revised rule", () => {
  const page = a4ProcessPage();
  const stale =
    "GAM BASE\n\nLD-INSTRUCTIONAL-ARCHETYPE-ROUTING (auto-applied):\n" +
    "- Material A4-M1 (activity A4); material_type=worked_example; instructional_archetype=process_walkthrough\n" +
    "  Rule: " +
    OLD_PROCESS_RULE +
    "\n\n- Selected rule ids for this request: process_walkthrough.\n\nNEXT-CONTRACT (auto-applied):\n- keep me";
  const refreshed = archetype.applyArchetypeRoutingBlockToDraft(stale, page, {
    isGenerateActivityMaterialsStep: true
  });
  assert.ok(refreshed.includes(archetype.RULES.process_walkthrough));
  assert.doesNotMatch(refreshed, /Walk through the supplied stages in order/);
  assert.match(refreshed, /NEXT-CONTRACT \(auto-applied\)/);
  assert.match(refreshed, /Realise the process_goal as one continuous worked walkthrough/);
});

test("runtime snapshot exposes loaded rule + plan for A4-M1", () => {
  const page = a4ProcessPage();
  const snap = archetype.buildS59GamArchetypeRuntimeSnapshot(page, {
    material_id: "A4-M1"
  });
  assert.equal(snap.loaded_archetype_script_version, "20260715-5");
  assert.equal(snap.selected_instructional_archetype, "process_walkthrough");
  assert.equal(snap.material_id, "A4-M1");
  assert.equal(
    snap.selected_rule_text,
    archetype.RULES.process_walkthrough
  );
  assert.equal(
    snap.archetype_plan_received.process_goal,
    "interpret an enzyme reaction-rate investigation"
  );
  assert.deepEqual(
    snap.archetype_plan_received.stages,
    archetype.ENZYMES_PROCESS_TEST_PLAN.stages
  );
});

test("legacy path growth remains zero without archetype materials", () => {
  const empty = { artifact_type: "page", activities: [] };
  assert.equal(archetype.estimateRoutingPromptGrowth(empty).chars, 0);
  assert.equal(
    archetype.applyArchetypeRoutingBlockToDraft("BASE", empty, {
      isGenerateActivityMaterialsStep: true
    }),
    "BASE"
  );
});
