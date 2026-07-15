const test = require("node:test");
const assert = require("node:assert/strict");
const depth = require("../lib/ld-gam-instructional-depth.js");
const archetype = require("../lib/ld-instructional-archetype.js");
const gamContract = require("../lib/ld-gam-page-enrich-contract.js");

/**
 * Mirrors the live V2 GAM Copy branch in buildWorkflowStepInstructions:
 * when isGamPageEnrichmentV2CopyStep, promptBody = buildGamV2CopyMaterialAuthoringBrief()
 * and resolveStepPromptText / applyWorkflowStepRuntimePromptAugmentations are skipped.
 */
function buildSimulatedV2GamCopyPrompt(page) {
  const brief = [
    "Output contract: return a partial page artefact only (not a full-page replay).",
    'Required envelope: artifact_type "page", schema_version "2.0.0", assembly_state.current_stage "gam".',
    "Required payload: activities[] containing activity_id and materials[] only."
  ].join("\n");
  return [
    "Execution mode: autonomous.",
    "This step is titled: Generate Activity Materials.",
    gamContract.buildGamPageEnrichContractBlock(),
    "Material authoring guidance (Sprint 56F v2 — output shape is defined above):",
    brief,
    "```json",
    JSON.stringify(page, null, 2),
    "```"
  ].join("\n");
}

function processFixturePage() {
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
  archetype.applyEnzymesProcessTestPlanToDlaPage(page);
  return page;
}

test("V2 GAM copy base prompt contains DEPTH contract name but not archetype routing", () => {
  const page = processFixturePage();
  const displayedOrCopiedV2 = buildSimulatedV2GamCopyPrompt(page);
  assert.match(displayedOrCopiedV2, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT/);
  assert.doesNotMatch(displayedOrCopiedV2, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.doesNotMatch(displayedOrCopiedV2, /Realise the process_goal as one continuous worked walkthrough/);
  assert.doesNotMatch(
    displayedOrCopiedV2,
    /Selected rule ids for this request: process_walkthrough/
  );
});

test("submitted GAM prompt after Copy-path fix includes archetype routing + process rule", () => {
  const page = processFixturePage();
  const v2Base = buildSimulatedV2GamCopyPrompt(page);
  // Post-fix delivery: buildWorkflowStepInstructions now calls applyLdInstructionalArchetypeRoutingToDraft
  const submitted = archetype.applyArchetypeRoutingBlockToDraft(v2Base, page, {
    isGenerateActivityMaterialsStep: true
  });
  assert.match(submitted, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.match(submitted, /Realise the process_goal as one continuous worked walkthrough/);
  assert.match(submitted, /explicit intermediate finding/i);
  assert.match(submitted, /how-to guide/i);
  assert.match(submitted, /interpret an enzyme reaction-rate investigation/);
  assert.match(submitted, /Selected rule ids for this request: process_walkthrough\./);
  archetype.ENZYMES_PROCESS_TEST_PLAN.stages.forEach(function (stage) {
    assert.match(submitted, new RegExp(stage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
  assert.doesNotMatch(submitted, /Walk through the supplied stages in order/);
});

test("Prompt Studio path vs Copy path: both contain routing after delivery fix; report exact pre-fix difference", () => {
  const page = processFixturePage();
  const studio = depth.applyLdGamInstructionalDepthContractToDraft("GAM LIBRARY BODY", {
    isGenerateActivityMaterialsStep: true
  });
  const studioAugmented = archetype.applyArchetypeRoutingBlockToDraft(studio, page, {
    isGenerateActivityMaterialsStep: true
  });
  const copyPreFix = buildSimulatedV2GamCopyPrompt(page);
  const copySubmitted = archetype.applyArchetypeRoutingBlockToDraft(copyPreFix, page, {
    isGenerateActivityMaterialsStep: true
  });

  assert.match(studioAugmented, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.match(copySubmitted, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.match(studioAugmented, /Realise the process_goal as one continuous worked walkthrough/);
  assert.match(copySubmitted, /Realise the process_goal as one continuous worked walkthrough/);
  assert.match(copySubmitted, /explicit intermediate finding/i);

  // Displayed V2 copy before delivery fix ≠ studio augmented (routing absent only on copy base).
  assert.notEqual(copyPreFix, studioAugmented);
  assert.equal(
    /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/i.test(copyPreFix),
    false,
    "pre-fix V2 copy base must lack archetype routing (documents the bypass)"
  );
  assert.equal(
    /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/i.test(copySubmitted),
    true,
    "post-fix submitted copy must include archetype routing"
  );

  // Bodies still differ (V2 brief ≠ full DEPTH block) but routing duties align.
  assert.notEqual(copySubmitted, studioAugmented);
  assert.match(studioAugmented, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT \(auto-applied\)/);
  assert.match(copySubmitted, /LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT/);
});

test("legacy path without process plan still leaves routing absent", () => {
  const page = {
    artifact_type: "page",
    activities: [
      {
        activity_id: "A1",
        required_materials: [{ material_id: "A1-M1", material_type: "text" }]
      }
    ]
  };
  const base = buildSimulatedV2GamCopyPrompt(page);
  const submitted = archetype.applyArchetypeRoutingBlockToDraft(base, page, {
    isGenerateActivityMaterialsStep: true
  });
  assert.doesNotMatch(submitted, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.equal(archetype.estimateRoutingPromptGrowth(page).chars, 0);
});
