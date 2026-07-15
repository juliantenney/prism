const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const archetype = require("../lib/ld-instructional-archetype.js");
const depth = require("../lib/ld-gam-instructional-depth.js");
const assemble = require("../lib/page-vnext-assemble.js");
const instructionalPattern = require("../lib/instructional-pattern-prompt.js");

const enzymesDir = path.join(
  __dirname,
  "..",
  "docs",
  "development",
  "sprints",
  "2026-07-14-sprint-59-instructional-content-richness-audit",
  "artefacts",
  "enzymes-archetype-mvp"
);

function loadEnzymesFixture(name) {
  return JSON.parse(
    fs.readFileSync(path.join(enzymesDir, name), "utf8")
  );
}

function pageWithMaterial(material) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A1",
        required_materials: [material]
      }
    ]
  };
}

test("legacy material without instructional_archetype leaves routing empty", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "text",
    purpose: "Explain a concept",
    specification: "Short definition"
  });
  const before = "BASE GAM DRAFT";
  const after = archetype.applyArchetypeRoutingBlockToDraft(before, page, {
    isGenerateActivityMaterialsStep: true
  });
  assert.equal(after, before);
  assert.equal(archetype.buildArchetypeRoutingBlock(page), "");
  assert.equal(archetype.estimateRoutingPromptGrowth(page).chars, 0);
});

test("each valid archetype selects only its own compact rule", () => {
  const cases = [
    [
      "mechanism_explanation",
      {
        start: "a",
        outcome: "b",
        required_links: ["link-1"]
      },
      /Realise every entry in required_links/
    ],
    [
      "process_walkthrough",
      {
        process_goal: "interpret results",
        stages: ["stage-1", "stage-2"]
      },
      /worked walkthrough/i
    ],
    [
      "mental_model_building",
      {
        system: "thermostat room",
        key_relationships: ["heater switches when below set point"],
        governing_constraint: "finite heating capacity",
        contrast: { state_a: "mild cold", state_b: "extreme cold" }
      },
      /Build a coherent account of the named system/
    ]
  ];

  cases.forEach(function (row) {
    const id = row[0];
    const plan = row[1];
    const ruleRe = row[2];
    const page = pageWithMaterial({
      material_id: "A1-M1",
      type: "worked_example",
      instructional_archetype: id,
      archetype_plan: plan
    });
    const block = archetype.buildArchetypeRoutingBlock(page);
    assert.match(block, ruleRe);
    assert.match(block, new RegExp("instructional_archetype=" + id));
    assert.match(
      block,
      new RegExp("Selected rule ids for this request: " + id + "\\.")
    );
    archetype.ALLOWED_ARCHETYPES.forEach(function (other) {
      if (other === id) return;
      assert.doesNotMatch(
        block,
        new RegExp("Selected rule ids for this request:.*" + other)
      );
      assert.doesNotMatch(block, new RegExp("instructional_archetype=" + other));
    });
  });
});

test("unknown archetype values do not activate a rule", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "text",
    instructional_archetype: "concept_exposition",
    archetype_plan: {
      system: "x",
      key_relationships: ["a"],
      governing_constraint: "c",
      contrast: { state_a: "a", state_b: "b" }
    }
  });
  const validated = archetype.validatePageArchetypePlans(page);
  assert.equal(validated.ok, false);
  assert.match(validated.errors.join("\n"), /unknown value/i);
  assert.equal(archetype.buildArchetypeRoutingBlock(page), "");
});

test("incomplete planning payloads reject with useful diagnostics", () => {
  const cases = [
    {
      instructional_archetype: "mechanism_explanation",
      archetype_plan: { start: "only-start", outcome: "", required_links: [] },
      expect: /required_links|outcome/
    },
    {
      instructional_archetype: "process_walkthrough",
      archetype_plan: { process_goal: "goal", stages: ["one"] },
      expect: /at least two/
    },
    {
      instructional_archetype: "mental_model_building",
      archetype_plan: {
        system: "",
        key_relationships: [],
        governing_constraint: "",
        contrast: { state_a: "a" }
      },
      expect: /system|key_relationships|governing_constraint|state_b/
    }
  ];
  cases.forEach(function (row) {
    const result = archetype.validateMaterialArchetypePlan({
      material_id: "A1-M1",
      instructional_archetype: row.instructional_archetype,
      archetype_plan: row.archetype_plan
    });
    assert.equal(result.ok, false);
    assert.match(result.errors.join("\n"), row.expect);
  });
});

test("material type remains independent from instructional archetype", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "scenario",
    type: "scenario",
    instructional_archetype: "mechanism_explanation",
    archetype_plan: {
      start: "temp rises",
      outcome: "rate falls",
      required_links: ["denaturation"]
    }
  });
  const block = archetype.buildArchetypeRoutingBlock(page);
  assert.match(block, /material_type=scenario/);
  assert.match(block, /instructional_archetype=mechanism_explanation/);
  assert.equal(
    archetype.materialTypeOf(page.activities[0].required_materials[0]),
    "scenario"
  );
});

test("archetype metadata does not change assembly semantics", () => {
  const base = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Enzymes",
    activities: [
      {
        activity_id: "A1",
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            instructional_archetype: "mental_model_building",
            archetype_plan: {
              system: "a room heated by a thermostat-controlled heater",
              key_relationships: [
                "the thermostat compares room temperature with the set point"
              ],
              governing_constraint: "the heater has a finite heating capacity",
              contrast: {
                state_a: "the outside temperature is mildly cold",
                state_b: "the outside temperature becomes extremely cold"
              }
            }
          }
        ],
        materials: []
      }
    ],
    assembly_state: { current_stage: "episode_plan", enriched_by: ["episode_plan"] }
  };
  const dlaPartial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    activities: [
      {
        activity_id: "A1",
        learner_task: "Build a working model",
        required_materials: base.activities[0].required_materials
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] }
  };
  const gamPartial = {
    artifact_type: "page",
    schema_version: "2.0.0",
    activities: [
      {
        activity_id: "A1",
        materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            title: "Enzyme model",
            body: "The enzyme and substrate interact at the active site.",
            body_format: "markdown"
          }
        ]
      }
    ],
    assembly_state: { current_stage: "gam", enriched_by: ["gam"] }
  };

  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: base,
    dla: dlaPartial,
    gam: gamPartial
  });
  assert.equal(result.ok, true);
  const mat = result.page.activities[0].required_materials[0];
  assert.equal(mat.instructional_archetype, "mental_model_building");
  assert.equal(
    mat.archetype_plan.system,
    "a room heated by a thermostat-controlled heater"
  );
  assert.equal(result.page.activities[0].materials[0].body.includes("active site"), true);
  assert.equal(
    Object.prototype.hasOwnProperty.call(
      result.page.activities[0].materials[0],
      "instructional_archetype"
    ),
    false
  );
});

test("Evaluate / diagnostic instructional-pattern construction unchanged by archetype module", () => {
  const pattern = instructionalPattern.buildInstructionalPatternPromptBlock({});
  const depthBlock = depth.buildGamInstructionalDepthPromptBlock();
  assert.ok(typeof pattern === "string" && pattern.length > 0);
  assert.match(pattern, /SP-0[1-7]|instructional pattern/i);
  assert.doesNotMatch(depthBlock, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.doesNotMatch(depthBlock, /Selected rule ids for this request/);
  assert.doesNotMatch(pattern, /LD-INSTRUCTIONAL-ARCHETYPE-ROUTING/);
  assert.match(depthBlock, /ANTI-GAMING/i);
  assert.match(depthBlock, /ANTI-LEAKAGE/i);
});

test("full GAM prompt growth limited to selected rule + planning data", () => {
  const page = pageWithMaterial({
    material_id: "A1-M1",
    material_type: "text",
    instructional_archetype: "process_walkthrough",
    archetype_plan: {
      process_goal: "interpret an enzyme reaction-rate investigation",
      stages: ["identify", "inspect", "connect", "conclude"]
    }
  });
  const base = depth.applyLdGamInstructionalDepthContractToDraft("GAM BASE", {
    isGenerateActivityMaterialsStep: true
  });
  const withRoute = archetype.applyArchetypeRoutingBlockToDraft(base, page, {
    isGenerateActivityMaterialsStep: true
  });
  const growth = withRoute.length - base.length;
  const estimate = archetype.estimateRoutingPromptGrowth(page);
  assert.ok(estimate.chars > 0);
  assert.ok(growth <= estimate.chars + 5);
  assert.ok(estimate.chars < 2000);
  assert.deepEqual(estimate.selectedRules, ["process_walkthrough"]);
  assert.match(withRoute, /worked walkthrough/i);
  assert.doesNotMatch(withRoute, /Explain how the stated start produces the outcome/);
  assert.doesNotMatch(withRoute, /Build a coherent account of the named system/);
});

test("enzymes fixtures validate and route independently", () => {
  const mechanism = loadEnzymesFixture("mechanism-explanation.required-material.json");
  const process = loadEnzymesFixture("process-walkthrough.required-material.json");
  const mental = loadEnzymesFixture("mental-model-building.required-material.json");

  [mechanism, process, mental].forEach(function (fixture) {
    const result = archetype.validateMaterialArchetypePlan(fixture);
    assert.equal(result.ok, true, result.errors && result.errors.join("; "));
    const block = archetype.buildArchetypeRoutingBlock(pageWithMaterial(fixture));
    assert.match(block, new RegExp(fixture.instructional_archetype));
    assert.match(block, /Rule:/);
  });

  const mechBlock = archetype.buildArchetypeRoutingBlock(pageWithMaterial(mechanism));
  assert.doesNotMatch(mechBlock, /worked walkthrough/i);
  assert.doesNotMatch(mechBlock, /Build a coherent account of the named system/);
});

test("page-dla-enrich rejects incomplete archetype plans and accepts legacy rows", () => {
  const dlaEnrich = require("../lib/page-dla-enrich.js");
  const legacy = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A1",
        required_materials: [{ material_id: "A1-M1", material_type: "text", purpose: "x" }]
      }
    ]
  };
  assert.equal(dlaEnrich.validateDlaPartialPageCapture(legacy).ok, true);

  const incomplete = {
    artifact_type: "page",
    schema_version: "2.0.0",
    assembly_state: { current_stage: "dla", enriched_by: ["dla"] },
    activities: [
      {
        activity_id: "A1",
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            instructional_archetype: "mechanism_explanation",
            archetype_plan: { start: "only" }
          }
        ]
      }
    ]
  };
  const bad = dlaEnrich.validateDlaPartialPageCapture(incomplete);
  assert.equal(bad.ok, false);
  assert.match(bad.errors.join("\n"), /outcome|required_links/i);
});

test("soft rubric-label diagnostics are non-blocking", () => {
  const soft = archetype.softDiagnoseRubricLabelsInBody(
    "Cause: heat\nMechanism: denaturation\nOutcome: rate falls"
  );
  assert.equal(soft.ok, true);
  assert.ok(soft.warnings.length >= 2);
});
