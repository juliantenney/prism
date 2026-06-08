/**
 * Sprint 38-S — Episode Plan V1 frozen taxonomy validation.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const validation = require(path.join(repoRoot, "lib", "episode-plan-v1-validation.js"));
const templates = require(path.join(repoRoot, "lib", "episode-plan-v1-templates.js"));

const WRONG_TAXONOMY = {
  episode_plans: [
    {
      activity_id: "A1",
      archetype: "concept_explanation",
      beats: [
        { function: "introduce_concept" },
        { function: "explain_key_ideas" },
        { function: "illustrate_with_example" }
      ]
    },
    {
      activity_id: "A2",
      archetype: "comparative_analysis",
      beats: [{ function: "reinforce_understanding" }]
    }
  ]
};

test("rejects invented archetypes and beat functions", () => {
  const result = validation.validateEpisodePlansContainerV1(WRONG_TAXONOMY);
  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /concept_explanation|not frozen V1/i);
  assert.match(result.errors.join(" "), /introduce_concept|not approved FunctionEnum/i);
});

test("accepts canonical deriveEpisodePlansFromLearningOutcomes output", () => {
  const lo = {
    learning_outcomes: [
      { id: "LO1", cognitive_level: "understand", statement: "Explain X." },
      { id: "LO2", cognitive_level: "apply", statement: "Apply Y." },
      { id: "LO3", cognitive_level: "analyse", statement: "Analyse Z." },
      { id: "LO4", cognitive_level: "evaluate", statement: "Evaluate W." }
    ]
  };
  const container = templates.deriveEpisodePlansFromLearningOutcomes(lo);
  const result = validation.validateEpisodePlansContainerV1(container);
  assert.equal(result.ok, true, result.errors && result.errors.join("; "));
  assert.equal(container.episode_plans[0].episode_plan.archetype, "understand");
  assert.equal(container.episode_plans[3].episode_plan.archetype, "evaluate");
  assert.ok(
    container.episode_plans[0].episode_plan.beats.some((b) => b.function === "explanation")
  );
});

test("rejects non-V1 episode_plan extra fields", () => {
  const bad = {
    episode_plans: [
      {
        activity_id: "A1",
        episode_plan: {
          archetype: "understand",
          beats: [{ function: "orientation" }],
          transitions: []
        }
      }
    ]
  };
  const result = validation.validateEpisodePlansContainerV1(bad);
  assert.equal(result.ok, false);
  assert.match(result.errors.join(" "), /non-V1 field 'transitions'/i);
});
