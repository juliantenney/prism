/**
 * Sprint 38-S — Episode Plan population contract tests (38S-2).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const contract = require(path.join(repoRoot, "lib", "episode-plan-population-contract.js"));

const PLANS = {
  A1: {
    archetype: "understand",
    beats: [
      { function: "orientation" },
      { function: "framing" },
      { function: "activation" },
      { function: "explanation" },
      { function: "example" },
      { function: "non_example" },
      { function: "misconception_confrontation" },
      { function: "guided_practice" },
      { function: "independent_performance" },
      { function: "verification" },
      { function: "reflection" },
      { function: "transition" }
    ]
  },
  A2: {
    archetype: "apply",
    beats: [
      { function: "orientation" },
      { function: "framing" },
      { function: "activation" },
      { function: "criteria_exposition" },
      { function: "worked_thinking" },
      { function: "guided_practice" },
      { function: "independent_performance" },
      { function: "verification" },
      { function: "revision" },
      { function: "reflection" },
      { function: "transfer" },
      { function: "transition" }
    ]
  },
  A3: {
    archetype: "analyse",
    beats: [
      { function: "orientation" },
      { function: "framing" },
      { function: "activation" },
      { function: "criteria_exposition" },
      { function: "explanation" },
      { function: "worked_thinking" },
      { function: "guided_inquiry" },
      { function: "guided_practice" },
      { function: "independent_performance" },
      { function: "verification" },
      { function: "reflection" },
      { function: "transfer" },
      { function: "transition" }
    ]
  },
  A4: {
    archetype: "evaluate",
    beats: [
      { function: "orientation" },
      { function: "framing" },
      { function: "activation" },
      { function: "perspective_construction" },
      { function: "criteria_exposition" },
      { function: "criteria_construction" },
      { function: "worked_judgement" },
      { function: "guided_inquiry" },
      { function: "guided_reasoning" },
      { function: "independent_performance" },
      { function: "evaluative_judgement" },
      { function: "verification" },
      { function: "reflection" },
      { function: "transfer" },
      { function: "transition" }
    ]
  }
};

function populate(plan, activityId) {
  return contract.applyPopulationScaffoldToActivity(
    { activity_id: activityId || "test" },
    plan
  );
}

test("plan-before-populate gate rejects missing plan", () => {
  const gate = contract.assertPlanBeforePopulateGate(null);
  assert.equal(gate.ok, false);
  assert.match(gate.errors.join(" "), /PF-11/);
});

test("plan-before-populate gate accepts A1 plan", () => {
  const gate = contract.assertPlanBeforePopulateGate(PLANS.A1);
  assert.equal(gate.ok, true);
});

test("A1 structural population — Strong", () => {
  const activity = populate(PLANS.A1, "A1");
  const validation = contract.validatePopulationContract(PLANS.A1, activity);
  assert.equal(validation.ok, true);
  assert.equal(validation.metrics.M02.survived_beats, 12);
  assert.equal(validation.metrics.M02.percent, 100);
  assert.equal(validation.metrics.M03.pass, true);
  assert.equal(activity.required_materials.length, 7);
  assert.ok(activity.episode_plan_ref);
  assert.ok(activity.materials_order.length === 7);
});

test("A2 structural population — Strong (T1 triple)", () => {
  const activity = populate(PLANS.A2, "A2");
  const validation = contract.validatePopulationContract(PLANS.A2, activity);
  assert.equal(validation.ok, true);
  const t1 = validation.transition_chains.find((c) => c.chain === "T1");
  assert.equal(t1.applicable, true);
  assert.equal(t1.pass, true);
  const fns = activity.required_materials.map((m) => m.instructional_function);
  assert.ok(fns.includes("worked_thinking"));
  assert.ok(fns.includes("guided_practice"));
  assert.ok(fns.includes("independent_performance"));
});

test("A3 structural population — Strong", () => {
  const activity = populate(PLANS.A3, "A3");
  const validation = contract.validatePopulationContract(PLANS.A3, activity);
  assert.equal(validation.ok, true);
  assert.equal(activity.required_materials.length, 8);
});

test("A4 structural population — Strong (T2 + T4 + T5)", () => {
  const activity = populate(PLANS.A4, "A4");
  const validation = contract.validatePopulationContract(PLANS.A4, activity);
  assert.equal(validation.ok, true);
  ["T2", "T4", "T5"].forEach((id) => {
    const chain = validation.transition_chains.find((c) => c.chain === id);
    assert.equal(chain.applicable, true, id);
    assert.equal(chain.pass, true, id);
  });
  assert.equal(activity.required_materials.length, 10);
});

test("beat trace matrix is inspectable without prompts", () => {
  const activity = populate(PLANS.A2, "A2");
  const matrix = contract.buildBeatTraceMatrix(PLANS.A2, activity);
  assert.equal(matrix.length, 12);
  matrix.forEach((row) => {
    assert.equal(row.traceable, true, "beat " + row.function);
    assert.ok(row.obligations.length >= 1);
  });
});

test("AC-01 detects T1 merge collapse", () => {
  const activity = populate(PLANS.A2, "A2");
  activity.required_materials = activity.required_materials.filter(
    (m) =>
      m.instructional_function !== "guided_practice" &&
      m.instructional_function !== "independent_performance"
  );
  const violations = contract.detectAcViolations(PLANS.A2, activity);
  assert.ok(violations.some((v) => v.rule === "AC-01"));
});

test("AC-03 detects reflection substitution", () => {
  const activity = populate(PLANS.A1, "A1");
  delete activity.self_explanation_prompt;
  activity._learner_task_segments = (activity._learner_task_segments || []).filter(
    (s) => s.instructional_function !== "reflection"
  );
  activity.required_materials.push({
    material_id: "M_bad",
    type: "consolidation_summary",
    instructional_function: "consolidation_summary",
    plan_beat_index: 99
  });
  const violations = contract.detectAcViolations(PLANS.A1, activity);
  assert.ok(violations.some((v) => v.rule === "AC-03"));
});

test("AC-07 detects independent_performance as sample_output", () => {
  const activity = populate(PLANS.A1, "A1");
  const perf = activity.required_materials.find(
    (m) => m.instructional_function === "independent_performance"
  );
  perf.type = "sample_output";
  const violations = contract.detectAcViolations(PLANS.A1, activity);
  assert.ok(violations.some((v) => v.rule === "AC-07"));
});

test("M-03 detects obligation order drift", () => {
  const activity = populate(PLANS.A2, "A2");
  const mats = activity.required_materials;
  const last = mats[mats.length - 1];
  mats[mats.length - 1] = mats[0];
  mats[0] = last;
  const m03 = contract.metricOrderedObligationSurvival(PLANS.A2, activity);
  assert.equal(m03.pass, false);
});

test("focus function families are mapped in FUNCTION_SPECS", () => {
  const focus = [
    "worked_thinking",
    "guided_practice",
    "independent_performance",
    "verification",
    "reflection",
    "prediction",
    "observation",
    "revision",
    "perspective_construction",
    "criteria_construction",
    "evaluative_judgement",
    "transfer"
  ];
  focus.forEach((fn) => {
    assert.ok(contract.FUNCTION_SPECS[fn], fn);
    assert.ok(contract.FUNCTION_SPECS[fn].pedagogical_spec);
  });
});
