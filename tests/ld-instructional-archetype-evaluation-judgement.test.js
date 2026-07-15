/**
 * Sprint 61-E01 — evaluation_judgement archetype extensibility.
 */
const test = require("node:test");
const assert = require("node:assert/strict");

const archetype = require("../lib/ld-instructional-archetype.js");
const dlaContract = require("../lib/ld-dla-page-enrich-contract.js");
const depth = require("../lib/ld-gam-instructional-depth.js");
const dlaEnrich = require("../lib/page-dla-enrich.js");

const RNA_EVALUATION_PLAN = {
  question:
    "Should this outbreak response prioritise containment measures that slow RNA-virus transmission?",
  criteria: [
    "biological transmission risk reduction",
    "feasibility under current surveillance capacity"
  ],
  evidence: [
    "observed secondary attack patterns in close-contact clusters",
    "genome mutation rate constraining sterilising immunity expectations"
  ],
  tradeoffs: [
    "stricter containment may delay other clinical services",
    "incomplete genomic coverage limits certainty about lineage dominance"
  ],
  judgement_focus:
    "whether the available biological evidence justifies prioritising containment now"
};

function evaluationMaterial(overrides) {
  return Object.assign(
    {
      material_id: "A5-M1",
      material_type: "worked_example",
      purpose: "Model evidence-based evaluative judgement for an outbreak response decision",
      instructional_archetype: "evaluation_judgement",
      archetype_plan: Object.assign({}, RNA_EVALUATION_PLAN)
    },
    overrides || {}
  );
}

function pageWithMaterial(material) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A5",
        required_materials: [material]
      }
    ]
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

test("evaluation_judgement is on the allowlist", () => {
  assert.equal(archetype.isAllowedArchetype("evaluation_judgement"), true);
  assert.ok(archetype.ALLOWED_ARCHETYPES.indexOf("evaluation_judgement") >= 0);
  assert.ok(archetype.RULES.evaluation_judgement);
  assert.deepEqual(archetype.PLAN_KEYS.evaluation_judgement, [
    "question",
    "criteria",
    "evidence",
    "tradeoffs",
    "judgement_focus"
  ]);
});

test("valid evaluation_judgement plan passes validation and DLA capture", () => {
  const page = pageWithMaterial(evaluationMaterial());
  const validated = archetype.validatePageArchetypePlans(page);
  assert.equal(validated.ok, true, validated.errors.join("; "));
  assert.equal(validated.activeAssignments.length, 1);
  assert.equal(validated.activeAssignments[0].archetype, "evaluation_judgement");

  const capture = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(capture.ok, true, (capture.errors || []).join("; "));
});

test("evaluation_judgement plan validation rejects incomplete fields", () => {
  const cases = [
    {
      plan: Object.assign({}, RNA_EVALUATION_PLAN, { question: "" }),
      expect: /question/
    },
    {
      plan: Object.assign({}, RNA_EVALUATION_PLAN, { criteria: ["only-one"] }),
      expect: /at least two/
    },
    {
      plan: Object.assign({}, RNA_EVALUATION_PLAN, { evidence: [] }),
      expect: /evidence/
    },
    {
      plan: Object.assign({}, RNA_EVALUATION_PLAN, { evidence: ["", "  "] }),
      expect: /evidence/
    },
    {
      plan: Object.assign({}, RNA_EVALUATION_PLAN, { tradeoffs: [] }),
      expect: /tradeoffs/
    },
    {
      plan: Object.assign({}, RNA_EVALUATION_PLAN, { judgement_focus: "" }),
      expect: /judgement_focus/
    }
  ];

  cases.forEach(function (row) {
    const result = archetype.validateMaterialArchetypePlan({
      material_id: "A5-M1",
      instructional_archetype: "evaluation_judgement",
      archetype_plan: row.plan
    });
    assert.equal(result.ok, false);
    assert.match(result.errors.join("\n"), row.expect);
  });
});

test("unknown archetypes remain rejected", () => {
  const page = pageWithMaterial({
    material_id: "A5-M1",
    instructional_archetype: "worked_judgement",
    archetype_plan: RNA_EVALUATION_PLAN
  });
  const validated = archetype.validatePageArchetypePlans(page);
  assert.equal(validated.ok, false);
  assert.match(validated.errors.join("\n"), /unknown value/i);
  assert.match(validated.errors.join("\n"), /evaluation_judgement/);
  assert.equal(archetype.buildArchetypeRoutingBlock(page), "");
});

test("evaluation_judgement routing includes plan payload and delivery rule only when assigned", () => {
  const page = pageWithMaterial(evaluationMaterial());
  const block = archetype.buildArchetypeRoutingBlock(page);

  assert.match(block, /instructional_archetype=evaluation_judgement/);
  assert.match(block, /Selected rule ids for this request: evaluation_judgement\./);
  assert.match(block, /Apply every supplied criterion to the supplied evidence/);
  assert.match(block, /judgement_focus/);
  assert.match(block, /tradeoffs/);
  assert.ok(block.indexOf(archetype.RULES.evaluation_judgement) >= 0);

  assert.doesNotMatch(block, /instructional_archetype=mechanism_explanation/);
  assert.doesNotMatch(block, /instructional_archetype=process_walkthrough/);
  assert.doesNotMatch(block, /instructional_archetype=mental_model_building/);

  const mechanismOnly = pageWithMaterial({
    material_id: "A2-M1",
    instructional_archetype: "mechanism_explanation",
    archetype_plan: {
      start: "a",
      outcome: "b",
      required_links: ["c"]
    }
  });
  const mechBlock = archetype.buildArchetypeRoutingBlock(mechanismOnly);
  assert.doesNotMatch(mechBlock, /evaluation_judgement/);
  assert.doesNotMatch(mechBlock, /Apply every supplied criterion/);
});

test("evaluation_judgement GAM rule requires modeled worked judgement not abstract meta-advice", () => {
  const rule = archetype.RULES.evaluation_judgement;
  assert.match(rule, /complete worked judgement sequence/i);
  assert.match(rule, /evidence assessed against each criterion/i);
  assert.match(rule, /comparative weighing/i);
  assert.match(rule, /limitation.*trade-off|competing interpretation/i);
  assert.match(rule, /final justified conclusion tied to judgement_focus/i);
  assert.match(rule, /convincing judgement compares evidence/i);
  assert.match(rule, /consider strengths and weaknesses/i);
  assert.match(rule, /When material_type is worked_example/i);
  assert.match(rule, /When material_type is template/i);
  assert.match(rule, /Initial position/i);
  assert.match(rule, /Final justified judgement/i);
  assert.match(rule, /duplicative Conclusion and Final judgement/i);
  assert.doesNotMatch(rule, /RNA virus|cell-to-cell/i);

  const page = pageWithMaterial(evaluationMaterial());
  const block = archetype.buildArchetypeRoutingBlock(page);
  assert.match(block, /material_type=worked_example/);
  assert.match(block, /complete worked judgement sequence/i);
  assert.match(block, /not meta-advice/i);
});

test("evaluation_judgement delivery observability: pass true when routed", () => {
  const page = pageWithMaterial(evaluationMaterial());
  const prompt = assembleGamPrompt(page);
  const delivery = archetype.buildArchetypeDeliveryVerification(page, prompt);

  assert.deepEqual(delivery.expected, ["evaluation_judgement"]);
  assert.deepEqual(delivery.delivered, ["evaluation_judgement"]);
  assert.deepEqual(delivery.missing, []);
  assert.equal(delivery.pass, true);

  const snap = archetype.buildFinalGamPromptObservabilitySnapshot(prompt, {}, page);
  assert.equal(snap.archetype_delivery.pass, true);
  assert.equal(snap.contains_evaluation_judgement_rule, true);
  assert.deepEqual(snap.selected_instructional_archetypes, ["evaluation_judgement"]);
  assert.equal(snap.selected_instructional_archetype, "evaluation_judgement");
  assert.match(snap.acceptance_rule, /archetype_delivery\.pass/);
});

test("evaluation_judgement delivery pass false when rule missing from prompt", () => {
  const page = pageWithMaterial(evaluationMaterial());
  const delivery = archetype.buildArchetypeDeliveryVerification(
    page,
    "GAM BASE without archetype routing"
  );
  assert.deepEqual(delivery.expected, ["evaluation_judgement"]);
  assert.deepEqual(delivery.delivered, []);
  assert.deepEqual(delivery.missing, ["evaluation_judgement"]);
  assert.equal(delivery.pass, false);
});

test("mixed archetypes including evaluation_judgement deliver together", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A2",
        required_materials: [
          {
            material_id: "A2-M1",
            instructional_archetype: "mechanism_explanation",
            archetype_plan: {
              start: "temperature rises",
              outcome: "rate falls",
              required_links: ["denaturation"]
            }
          }
        ]
      },
      {
        activity_id: "A5",
        required_materials: [evaluationMaterial()]
      }
    ]
  };
  const prompt = assembleGamPrompt(page);
  const delivery = archetype.buildArchetypeDeliveryVerification(page, prompt);
  assert.deepEqual(delivery.expected, [
    "evaluation_judgement",
    "mechanism_explanation"
  ]);
  assert.deepEqual(delivery.delivered, [
    "evaluation_judgement",
    "mechanism_explanation"
  ]);
  assert.equal(delivery.pass, true);

  const snap = archetype.buildFinalGamPromptObservabilitySnapshot(prompt, {}, page);
  assert.equal(snap.contains_mechanism_rule, true);
  assert.equal(snap.contains_evaluation_judgement_rule, true);
});

test("DLA production guidance includes evaluation_judgement and anti-over-selection cues", () => {
  const guidance = dlaContract.buildInstructionalArchetypePlanningGuidance();
  assert.match(guidance, /evaluation_judgement/);
  assert.match(guidance, /question/);
  assert.match(guidance, /criteria/);
  assert.match(guidance, /evidence/);
  assert.match(guidance, /tradeoffs/);
  assert.match(guidance, /judgement_focus/);
  assert.match(guidance, /at least two criteria/);
  assert.match(
    guidance,
    /Select evaluation_judgement only when the learner must apply explicit criteria/i
  );
  assert.match(guidance, /Do NOT select evaluation_judgement merely because/i);
  assert.match(guidance, /the activity asks a question/i);
  assert.match(guidance, /list advantages and disadvantages/i);
  assert.match(guidance, /Evaluate learning-function label/i);
  assert.match(guidance, /Do not confuse evaluation_judgement with mechanism_explanation/i);
  assert.match(guidance, /mental_model_building/);
  assert.match(guidance, /process_walkthrough/);
});
