/**
 * Sprint 69 Phase 1 — shared FunctionEnum vocabulary contract.
 *
 * Proves producer validation and renderer consume one canonical source,
 * without introducing grammar, aliases, or fuzzy matching.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const vocabulary = require(path.join(repoRoot, "lib", "episode-plan-v1-vocabulary.js"));
const contract = require(path.join(repoRoot, "lib", "episode-plan-population-contract.js"));
const validation = require(path.join(repoRoot, "lib", "episode-plan-v1-validation.js"));
const archetypeRules = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-rules.js"
));
const shellCreate = require(path.join(repoRoot, "lib", "page-shell-create.js"));
const assemble = require(path.join(repoRoot, "lib", "page-vnext-assemble.js"));

const EXPECTED_FUNCTION_ENUM = Object.freeze([
  "orientation",
  "framing",
  "activation",
  "explanation",
  "example",
  "non_example",
  "misconception_confrontation",
  "criteria_exposition",
  "criteria_construction",
  "perspective_construction",
  "worked_thinking",
  "worked_judgement",
  "guided_inquiry",
  "guided_reasoning",
  "guided_practice",
  "independent_performance",
  "evaluative_judgement",
  "verification",
  "revision",
  "reflection",
  "transfer",
  "prediction",
  "observation",
  "transition"
]);

test("shared vocabulary contains exactly the currently supported FunctionEnum values", () => {
  assert.deepEqual(vocabulary.FUNCTION_ENUM.slice(), EXPECTED_FUNCTION_ENUM.slice());
  assert.equal(vocabulary.FUNCTION_ENUM.length, 24);
  assert.ok(Object.isFrozen(vocabulary.FUNCTION_ENUM));
});

test("producer and renderer consume the same canonical vocabulary source", () => {
  assert.equal(validation.FUNCTION_ENUM, vocabulary.FUNCTION_ENUM);
  assert.equal(archetypeRules.FUNCTION_ENUM, vocabulary.FUNCTION_ENUM);
  assert.equal(contract.FUNCTION_ENUM, vocabulary.FUNCTION_ENUM);

  const producerSet = validation.approvedFunctionSet();
  const rendererApproved = archetypeRules.isApprovedFunction;
  EXPECTED_FUNCTION_ENUM.forEach(function (id) {
    assert.equal(producerSet[id], true, "producer missing " + id);
    assert.equal(rendererApproved(id), true, "renderer missing " + id);
    assert.equal(vocabulary.isCanonicalFunctionExact(id), true);
  });
});

test("FUNCTION_SPECS keys remain aligned with shared vocabulary (no drift)", () => {
  assert.deepEqual(
    Object.keys(contract.FUNCTION_SPECS).sort(),
    vocabulary.listApprovedFunctions().sort()
  );
});

test("unknown vocabulary fails at producer/capture boundary with NON_CANONICAL diagnostics", () => {
  const shell = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Vocab gate",
    audience: "learners",
    page_profile: { profile_type: "learner" },
    assembly_state: { enriched_by: ["episode_plan"] },
    page_synthesis: {},
    learning_outcomes: [{ id: "LO1", statement: "Explain X.", cognitive_level: "understand" }],
    source_artefacts: [],
    generation_notes: {},
    activities: [
      {
        activity_id: "A1",
        title: "A1",
        episode_plan: {
          archetype: "understand",
          beats: [{ function: "orientation" }, { function: "consolidation" }]
        }
      }
    ],
    episode_plans: [
      {
        activity_id: "A1",
        episode_plan: {
          archetype: "understand",
          beats: [{ function: "orientation" }, { function: "consolidation" }]
        }
      }
    ]
  };

  const vocabCheck = validation.validatePageEpisodePlanVocabulary(shell, {
    owner: "Episode Plan capture",
    canonicalSource: "Episode Plan FunctionEnum"
  });
  assert.equal(vocabCheck.ok, false);
  assert.ok(
    vocabCheck.diagnostics.some(function (d) {
      return (
        d.code === "NON_CANONICAL_EPISODE_PLAN_BEAT" &&
        d.beat === "consolidation" &&
        d.owner === "Episode Plan capture" &&
        d.canonicalSource === "Episode Plan FunctionEnum"
      );
    }),
    vocabCheck.diagnostics.map(function (d) {
      return d.code;
    }).join(",")
  );

  const shellCheck = shellCreate.validatePageShellAgainstVNextSchema(shell);
  assert.equal(shellCheck.ok, false);
  assert.match(shellCheck.errors.join(" "), /NON_CANONICAL_EPISODE_PLAN_BEAT/);
  assert.match(shellCheck.errors.join(" "), /consolidation/);
});

test("matching remains exact: no aliases and unknown ids fail closed", () => {
  assert.equal(vocabulary.isApprovedFunction("explanation"), true);
  assert.equal(vocabulary.isApprovedFunction("consolidate"), false);
  assert.equal(vocabulary.isApprovedFunction("consolidation"), false);
  assert.equal(vocabulary.isApprovedFunction("check_understanding"), false);
  assert.equal(vocabulary.isApprovedFunction("guided_judgement"), false);
  assert.equal(vocabulary.isCanonicalFunctionExact("Explanation"), false);
  // Existing producer normalisation: case-folded membership still accepted.
  assert.equal(vocabulary.isApprovedFunction("Explanation"), true);
  assert.equal(vocabulary.isApprovedFunction(" EXPLANATION "), true);
});

test("renderer no longer provides journey-compatibility exact matching", () => {
  const journeySeq = ["orientation", "explanation", "check"];
  assert.equal(
    archetypeRules.selectArchetypeVariant("understand", journeySeq),
    null,
    "compressed sequences must not match any runtime registry"
  );
  assert.equal(archetypeRules.REGISTRY_ROLE, "removed-phase-5b");

  const understandSeq = archetypeRules.EPISODE_PLAN_V1_SEQUENCES.understand.slice();
  assert.equal(
    archetypeRules.selectArchetypeVariant("understand", understandSeq),
    null,
    "canonical FE uses shared grammar, not variant registry"
  );

  const nearMiss = journeySeq.slice();
  nearMiss[nearMiss.length - 1] = "consolidation";
  assert.equal(
    archetypeRules.selectArchetypeVariant("understand", nearMiss),
    null,
    "near-miss must not fuzzy-match"
  );
});

test("canonical episode_plan survives assembly unchanged", () => {
  const plan = {
    archetype: "understand",
    beats: EXPECTED_FUNCTION_ENUM.slice(0, 4).map(function (fn) {
      return { function: fn };
    })
  };
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Assembly preserve",
    audience: "learners",
    page_profile: { profile_type: "learner" },
    assembly_state: { enriched_by: ["episode_plan"], current_stage: "episode_plan" },
    page_synthesis: {},
    learning_outcomes: [],
    source_artefacts: [],
    generation_notes: {},
    activities: [
      {
        activity_id: "A1",
        title: "A1",
        episode_plan: JSON.parse(JSON.stringify(plan)),
        materials: { text: "body" }
      }
    ]
  };
  const dla = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Assembly preserve",
    audience: "learners",
    page_profile: { profile_type: "learner" },
    assembly_state: { enriched_by: ["dla"], current_stage: "dla" },
    page_synthesis: {},
    learning_outcomes: [],
    source_artefacts: [],
    generation_notes: {},
    activities: [
      {
        activity_id: "A1",
        episode_plan: {
          archetype: "apply",
          beats: [{ function: "consolidation" }]
        },
        learner_task: "Do the task"
      }
    ]
  };

  const result = assemble.assembleVNextPageFromPartials({
    episode_plan: page,
    dla: dla
  });
  assert.ok(result && result.page);
  assert.deepEqual(result.page.activities[0].episode_plan, plan);
});
