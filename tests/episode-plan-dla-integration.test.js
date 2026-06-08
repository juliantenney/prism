/**
 * Sprint 38-S — DLA obligation tagging integration tests (38S-3).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const templates = require(path.join(repoRoot, "lib", "episode-plan-v1-templates.js"));
const integration = require(path.join(repoRoot, "lib", "episode-plan-dla-integration.js"));
const contract = require(path.join(repoRoot, "lib", "episode-plan-population-contract.js"));

const FROZEN_LO = require(path.join(
  repoRoot,
  "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-frozen-learning-outcomes.json"
));

test("derive episode plans from frozen LO — 4 plans A1–A4", () => {
  const container = integration.deriveEpisodePlansFromLearningOutcomes(FROZEN_LO, {
    activity_ids: ["A1", "A2", "A3", "A4"]
  });
  assert.equal(container.episode_plans.length, 4);
  assert.equal(container.episode_plans[0].episode_plan.archetype, "understand");
  assert.equal(container.episode_plans[1].episode_plan.archetype, "apply");
  assert.equal(container.episode_plans[2].episode_plan.archetype, "analyse");
  assert.equal(container.episode_plans[3].episode_plan.archetype, "evaluate");
  const gate = integration.assertEpisodePlansContainerGate(container);
  assert.equal(gate.ok, true);
});

test("gate rejects invented LLM taxonomy (concept_explanation / introduce_concept)", () => {
  const bad = {
    episode_plans: [
      {
        activity_id: "A1",
        archetype: "concept_explanation",
        beats: [{ function: "introduce_concept" }]
      }
    ]
  };
  const gate = integration.assertEpisodePlansContainerGate(bad);
  assert.equal(gate.ok, false);
  assert.match(gate.errors.join(" "), /not frozen V1|not approved FunctionEnum/i);
});

test("gate rejects missing episode plans container", () => {
  const gate = integration.assertEpisodePlansContainerGate(null);
  assert.equal(gate.ok, false);
  assert.match(gate.errors.join(" "), /PF-11|EP-V1/);
});

test("apply population contract tags obligations from collapsed LLM bundle", () => {
  const container = integration.deriveEpisodePlansFromLearningOutcomes(FROZEN_LO, {
    activity_ids: ["A1", "A2", "A3", "A4"]
  });
  const collapsedLlm = {
    activities: [
      {
        activity_id: "A2",
        title: "Apply CPI",
        required_materials: [
          { material_id: "M1", type: "classification_table", purpose: "all in one" }
        ],
        learner_task: "Complete the table."
      }
    ]
  };
  const applied = integration.applyPopulationContractToLearningActivities(
    collapsedLlm,
    container
  );
  assert.equal(applied.ok, true);
  const a2 = applied.learning_activities.activities.find((a) => a.activity_id === "A2");
  assert.ok(a2);
  assert.ok(a2.required_materials.length >= 7);
  a2.required_materials
    .filter((m) => !m.supplementary)
    .forEach((m) => {
      assert.ok(m.instructional_function);
      assert.equal(typeof m.plan_beat_index, "number");
    });
  const validation = integration.validateLearningActivitiesPopulationContract(
    applied.learning_activities,
    container
  );
  assert.equal(validation.ok, true);
});

test("M-03 order preserved after merge", () => {
  const plan = templates.templateForArchetype("apply");
  const llm = {
    activity_id: "A2",
    required_materials: [
      {
        material_id: "X",
        type: "worked_example",
        purpose: "independent performance",
        specification: "Full attempt"
      },
      {
        material_id: "Y",
        type: "worked_example",
        purpose: "worked thinking",
        specification: "Model"
      }
    ]
  };
  const merged = integration.mergePopulationScaffoldWithLlmActivity(llm, plan);
  const m03 = contract.metricOrderedObligationSurvival(plan, merged);
  assert.equal(m03.pass, true);
});

test("verifyObligationTagging reports complete tags after merge", () => {
  const plan = templates.templateForArchetype("understand");
  const merged = integration.mergePopulationScaffoldWithLlmActivity({ activity_id: "A1" }, plan);
  const check = integration.verifyObligationTagging(merged);
  assert.equal(check.instructional_function_present, true);
  assert.equal(check.plan_beat_index_present, true);
  assert.equal(check.episode_plan_ref, true);
});

test("population-only prompt block mentions planning authority", () => {
  const block = integration.buildDlaPopulationOnlyPromptBlock();
  assert.match(block, /population-only/i);
  assert.match(block, /planning authority/i);
  assert.match(block, /instructional_function/);
});

const { validateDla38LObligations } = require(path.join(repoRoot, "lib", "dla-38l-obligation-check.js"));
const EV38L_DLA = require(path.join(
  repoRoot,
  "docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/EV-38L-AFTER-dla-learning-activities.json"
));

test("additive merge: EV-38L fixture passes population contract and 38L obligations", () => {
  const container = integration.deriveEpisodePlansFromLearningOutcomes(FROZEN_LO, {
    activity_ids: ["A1", "A2", "A3", "A4"]
  });
  const applied = integration.applyPopulationContractToLearningActivities(EV38L_DLA, container);
  assert.equal(applied.ok, true);
  const pop = integration.validateLearningActivitiesPopulationContract(
    applied.learning_activities,
    container
  );
  assert.equal(pop.ok, true, pop.errors.join("; "));
  const dla38l = validateDla38LObligations(applied.learning_activities);
  assert.equal(dla38l.ok, true, dla38l.errors.join("; "));
});

test("additive merge preserves 38L depth rows (worked analytic pass, independent judgement)", () => {
  const container = integration.deriveEpisodePlansFromLearningOutcomes(FROZEN_LO, {
    activity_ids: ["A1", "A2", "A3", "A4"]
  });
  const applied = integration.applyPopulationContractToLearningActivities(EV38L_DLA, container);
  const a3 = applied.learning_activities.activities.find((a) =>
    /A3/i.test(a.activity_id || "")
  );
  const a4 = applied.learning_activities.activities.find((a) =>
    /A4/i.test(a.activity_id || "")
  );
  assert.ok(a3);
  assert.ok(a4);
  const a3Pass = (a3.required_materials || []).some(
    (m) =>
      /worked analytic pass|analytic pass/i.test(String(m.purpose || "")) &&
      (m.type === "worked_example" || m.type === "modelling_note")
  );
  assert.equal(a3Pass, true, "A3 worked analytic pass must survive merge");
  const a4Judgement = (a4.required_materials || []).some(
    (m) =>
      (m.type === "template" || m.type === "task_cards") &&
      /independent judgement|independent judgment/i.test(String(m.purpose || ""))
  );
  assert.equal(a4Judgement, true, "A4 independent judgement template must survive merge");
});

test("additive merge appends unmatched LLM rows as supplementary", () => {
  const plan = templates.templateForArchetype("analyse");
  const llm = {
    activity_id: "A3",
    required_materials: [
      {
        material_id: "DEPTH-1",
        type: "worked_example",
        purpose: "worked analytic pass",
        specification: "Stepwise analytic pass"
      },
      {
        material_id: "DEPTH-2",
        type: "analysis_table",
        purpose: "learner completes analysis",
        specification: "Comparison table"
      }
    ]
  };
  const merged = integration.mergePopulationScaffoldWithLlmActivity(llm, plan);
  const supplementary = (merged.required_materials || []).filter((m) => m.supplementary === true);
  assert.ok(supplementary.length >= 0);
  const hasAnalyticPass = (merged.required_materials || []).some((m) =>
    /worked analytic pass/i.test(String(m.purpose || ""))
  );
  assert.equal(hasAnalyticPass, true);
  const tagged = (merged.required_materials || []).filter((m) => !m.supplementary);
  tagged.forEach((m) => {
    assert.ok(m.instructional_function);
    assert.equal(typeof m.plan_beat_index, "number");
  });
});
