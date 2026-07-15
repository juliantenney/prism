const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const archetype = require("../lib/ld-instructional-archetype.js");
const depth = require("../lib/ld-gam-instructional-depth.js");
const instructionalPattern = require("../lib/instructional-pattern-prompt.js");
const dlaEnrich = require("../lib/page-dla-enrich.js");
const assemble = require("../lib/page-vnext-assemble.js");

function pageWithActivities(activities) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: activities
  };
}

test("opt-in is explicit only — no automatic inference from enzymes topic", () => {
  assert.equal(archetype.isMechanismTestOptIn("Enzymes and Reaction Rates"), false);
  assert.equal(
    archetype.isMechanismTestOptIn({
      goal: "Teach enzymes and temperature effects on reaction rate"
    }),
    false
  );
  assert.equal(
    archetype.isMechanismTestOptIn("Teach enzymes. S59_MECHANISM_TEST"),
    true
  );
  assert.equal(archetype.isMechanismTestOptIn(true), true);
});

test("designated DLA test material emits mechanism fields when stamped", () => {
  const page = pageWithActivities([
    {
      activity_id: "A2",
      required_materials: [
        {
          material_id: "A2-M1",
          material_type: "text",
          purpose: "temp/rate"
        }
      ]
    }
  ]);
  const result = archetype.applyEnzymesMechanismTestPlanToDlaPage(page);
  assert.equal(result.ok, true);
  assert.equal(result.changed, true);
  assert.equal(result.activity_id, "A2");
  assert.equal(result.material_id, "A2-M1");
  assert.equal(result.instructional_archetype, "mechanism_explanation");
  assert.deepEqual(
    result.archetype_plan.required_links,
    archetype.ENZYMES_MECHANISM_TEST_PLAN.required_links
  );
  const mat = page.activities[0].required_materials[0];
  assert.equal(mat.instructional_archetype, "mechanism_explanation");
  assert.equal(
    mat.archetype_plan.start,
    archetype.ENZYMES_MECHANISM_TEST_PLAN.start
  );
});

test("emitted fields survive DLA validation", () => {
  const page = pageWithActivities([
    {
      activity_id: "A2",
      required_materials: [{ material_id: "A2-M1", material_type: "text" }]
    }
  ]);
  archetype.applyEnzymesMechanismTestPlanToDlaPage(page);
  const check = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("GAM routing reads stamped capture and selects only mechanism rule", () => {
  const page = pageWithActivities([
    {
      activity_id: "A2",
      required_materials: [
        { material_id: "A2-M1", material_type: "text" },
        { material_id: "A2-M2", material_type: "checklist", purpose: "verify" }
      ]
    }
  ]);
  archetype.applyEnzymesMechanismTestPlanToDlaPage(page);
  const base = depth.applyLdGamInstructionalDepthContractToDraft("GAM BASE", {
    isGenerateActivityMaterialsStep: true
  });
  const routed = archetype.applyArchetypeRoutingBlockToDraft(base, page, {
    isGenerateActivityMaterialsStep: true
  });
  assert.match(routed, /Selected rule ids for this request: mechanism_explanation\./);
  assert.match(routed, /Realise every entry in required_links/);
  assert.match(routed, /more than one phase|each phase/i);
  assert.doesNotMatch(routed, /worked walkthrough/i);
  assert.doesNotMatch(routed, /Build a coherent account of the named system/);
  assert.match(routed, /ANTI-GAMING/i);
  assert.match(routed, /ANTI-LEAKAGE/i);
  assert.equal(
    routed.split(archetype.ENZYMES_MECHANISM_TEST_PLAN.start).length - 1,
    1
  );
});

test("mechanism_explanation rule duties: every link + all outcome phases", () => {
  const rule = archetype.RULES.mechanism_explanation;
  assert.match(rule, /Realise every entry in required_links/);
  assert.match(rule, /distinct intelligible transition/);
  assert.match(rule, /more than one phase/);
  assert.match(rule, /explain each phase/i);
  assert.match(rule, /do not stop after the first phase/i);
  assert.match(rule, /omit an intermediate link/i);
  assert.match(rule, /connected learner-facing prose|labelled list/i);
  assert.doesNotMatch(rule, /each important transition/);
  assert.match(
    archetype.RULES.process_walkthrough,
    /worked walkthrough.*every supplied stage.*explicit intermediate finding.*procedural checklist/is
  );
  assert.match(
    archetype.RULES.mental_model_building,
    /Build a coherent account of the named system using the supplied relationships and governing constraint/
  );
  assert.match(archetype.RULES.mental_model_building, /two supplied states/);
  assert.doesNotMatch(archetype.RULES.mental_model_building, /glossary of separate definitions/);
});

test("planning values included exactly once in mechanism routing block", () => {
  const page = pageWithActivities([
    {
      activity_id: "A2",
      required_materials: [{ material_id: "A2-M1", material_type: "text" }]
    }
  ]);
  archetype.applyEnzymesMechanismTestPlanToDlaPage(page);
  const block = archetype.buildArchetypeRoutingBlock(page);
  const start = archetype.ENZYMES_MECHANISM_TEST_PLAN.start;
  assert.equal(block.split(start).length - 1, 1);
  assert.equal(block.split("archetype_plan:").length - 1, 1);
  assert.equal(block.split("Rule:").length - 1, 1);
});

test("materials without explicit designation remain unchanged", () => {
  const page = pageWithActivities([
    {
      activity_id: "A1",
      required_materials: [
        { material_id: "A1-M1", material_type: "text", purpose: "intro" }
      ]
    }
  ]);
  const before = JSON.stringify(page.activities[0].required_materials[0]);
  // No stamp without calling apply; routing empty
  assert.equal(archetype.buildArchetypeRoutingBlock(page), "");
  assert.equal(JSON.stringify(page.activities[0].required_materials[0]), before);
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      page.activities[0].required_materials[0],
      "instructional_archetype"
    ),
    false
  );
});

test("DLA emission block only attaches under explicit opt-in", () => {
  const draft = "DLA BASE";
  assert.equal(
    archetype.applyDlaMechanismTestEmissionBlockToDraft(draft, {
      isDesignLearningActivitiesStep: true,
      mechanismTestOptIn: false
    }),
    draft
  );
  const withOptIn = archetype.applyDlaMechanismTestEmissionBlockToDraft(draft, {
    isDesignLearningActivitiesStep: true,
    mechanismTestOptIn: true
  });
  assert.match(withOptIn, /LD-INSTRUCTIONAL-ARCHETYPE-DLA-MECHANISM-TEST/);
  assert.match(withOptIn, /"instructional_archetype": "mechanism_explanation"/);
  assert.doesNotMatch(
    withOptIn,
    /"instructional_archetype": "(process_walkthrough|mental_model_building)"/
  );
  assert.match(withOptIn, /Do not emit process_walkthrough or mental_model_building/);
  assert.equal(
    archetype.applyDlaMechanismTestEmissionBlockToDraft(draft, {
      isDesignLearningActivitiesStep: false,
      mechanismTestOptIn: true
    }),
    draft
  );
});

test("invalid mechanism plans still fail DLA validation", () => {
  const page = pageWithActivities([
    {
      activity_id: "A2",
      required_materials: [
        {
          material_id: "A2-M1",
          material_type: "text",
          instructional_archetype: "mechanism_explanation",
          archetype_plan: { start: "x" }
        }
      ]
    }
  ]);
  const bad = dlaEnrich.validateDlaPartialPageCapture(page);
  assert.equal(bad.ok, false);
  assert.match(bad.errors.join("\n"), /outcome|required_links/i);
});

test("unknown archetypes activate no rule", () => {
  const page = pageWithActivities([
    {
      activity_id: "A1",
      required_materials: [
        {
          material_id: "A1-M1",
          instructional_archetype: "worked_judgement",
          archetype_plan: { start: "a", outcome: "b", required_links: ["c"] }
        }
      ]
    }
  ]);
  assert.equal(archetype.buildArchetypeRoutingBlock(page), "");
});

test("Evaluate and diagnostic prompt construction unchanged", () => {
  const pattern = instructionalPattern.buildInstructionalPatternPromptBlock({});
  const depthBlock = depth.buildGamInstructionalDepthPromptBlock();
  assert.match(pattern, /SP-0[1-7]|instructional pattern/i);
  assert.doesNotMatch(pattern, /S59_MECHANISM_TEST|DLA-MECHANISM-TEST/);
  assert.doesNotMatch(depthBlock, /S59_MECHANISM_TEST|DLA-MECHANISM-TEST/);
});

test("assembly preserves stamped mechanism fields without renderer changes", () => {
  const dlaPage = pageWithActivities([
    {
      activity_id: "A2",
      learner_task: "Explain temperature effects",
      required_materials: [{ material_id: "A2-M1", material_type: "text" }]
    }
  ]);
  archetype.applyEnzymesMechanismTestPlanToDlaPage(dlaPage);
  const ep = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Enzymes",
    activities: [{ activity_id: "A2", materials: [], required_materials: [] }],
    assembly_state: { current_stage: "episode_plan", enriched_by: ["episode_plan"] }
  };
  const gam = {
    artifact_type: "page",
    schema_version: "2.0.0",
    activities: [
      {
        activity_id: "A2",
        materials: [
          {
            material_id: "A2-M1",
            material_type: "text",
            title: "Temperature and rate",
            body: "Generated prose placeholder.",
            body_format: "markdown"
          }
        ]
      }
    ],
    assembly_state: { current_stage: "gam", enriched_by: ["gam"] }
  };
  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: ep,
    dla: dlaPage,
    gam: gam
  });
  assert.equal(result.ok, true);
  assert.equal(
    result.page.activities[0].required_materials[0].instructional_archetype,
    "mechanism_explanation"
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      result.page.activities[0].materials[0],
      "instructional_archetype"
    ),
    false
  );
});

test("prompt growth breakdown for mechanism material", () => {
  const page = pageWithActivities([
    {
      activity_id: "A2",
      required_materials: [{ material_id: "A2-M1", material_type: "text" }]
    }
  ]);
  archetype.applyEnzymesMechanismTestPlanToDlaPage(page);
  const growth = archetype.measureArchetypeRoutingPromptGrowth(page);
  assert.equal(growth.legacyPathGrowth, 0);
  assert.deepEqual(growth.selectedRules, ["mechanism_explanation"]);
  assert.ok(growth.compactRuleChars > 100);
  assert.ok(growth.planningValueChars > 100);
  assert.ok(growth.formattingOverheadChars > 0);
  assert.equal(
    growth.chars,
    growth.compactRuleChars +
      growth.planningValueChars +
      growth.formattingOverheadChars
  );
  assert.equal(archetype.measureArchetypeRoutingPromptGrowth({ activities: [] }).chars, 0);
});

test("routing debug snapshots omit non-archetype materials", () => {
  const page = pageWithActivities([
    {
      activity_id: "A2",
      required_materials: [
        { material_id: "A2-M1", material_type: "text" },
        { material_id: "A2-M2", material_type: "checklist" }
      ]
    }
  ]);
  archetype.applyEnzymesMechanismTestPlanToDlaPage(page);
  const snaps = archetype.collectRoutingDebugSnapshots(page);
  assert.equal(snaps.length, 1);
  assert.equal(snaps[0].material_id, "A2-M1");
  assert.equal(snaps[0].instructional_archetype, "mechanism_explanation");
  assert.equal(snaps[0].rule_selected, true);
  assert.ok(snaps[0].archetype_plan.start);
});
