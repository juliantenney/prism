/**
 * Sprint 69 Phase 2 — shared archetype grammar contract tests.
 *
 * Grammar is data-only in this phase: no renderer cutover, no dual validation,
 * no registry retirement. Structural helpers are exercised for contract proofs only.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const grammar = require(path.join(repoRoot, "lib", "episode-plan-v1-archetype-grammar.js"));
const vocabulary = require(path.join(repoRoot, "lib", "episode-plan-v1-vocabulary.js"));
const archetypeRules = require(path.join(
  repoRoot,
  "lib",
  "learner-renderer-vnext",
  "archetype-rules.js"
));
const templates = require(path.join(repoRoot, "lib", "episode-plan-v1-templates.js"));

test("grammar is internally consistent and deterministic", () => {
  const first = grammar.assertGrammarIntegrity();
  const second = grammar.assertGrammarIntegrity();
  assert.equal(first.ok, true, first.errors.join("; "));
  assert.deepEqual(first, second);
  assert.equal(grammar.GRAMMAR_VERSION, "S69-P2");
  assert.ok(Object.isFrozen(grammar.FROZEN_ARCHETYPES));
  assert.ok(Object.isFrozen(grammar.ARCHETYPE_GRAMMAR));
  assert.deepEqual(grammar.listArchetypes(), ["understand", "apply", "analyse", "evaluate"]);
});

test("grammar cannot reference undefined archetypes or unknown FunctionEnum values", () => {
  grammar.listArchetypes().forEach(function (archetype) {
    const g = grammar.getArchetypeGrammar(archetype);
    assert.ok(g, archetype);
    assert.equal(g.archetype, archetype);
    g.allowedBeats.forEach(function (beat) {
      assert.equal(
        vocabulary.isCanonicalFunctionExact(beat),
        true,
        archetype + " allowed " + beat
      );
    });
  });
  assert.equal(grammar.isKnownArchetype("concept_explanation"), false);
  assert.equal(grammar.getArchetypeGrammar("concept_explanation"), null);
});

test("required, optional, ordering, and terminal rules are explicit per archetype", () => {
  grammar.listArchetypes().forEach(function (archetype) {
    const g = grammar.getArchetypeGrammar(archetype);
    assert.ok(Array.isArray(g.requiredBeats));
    assert.ok(Array.isArray(g.optionalBeats));
    assert.ok(Array.isArray(g.requiredGroups));
    assert.ok(g.cardinality && typeof g.cardinality === "object");
    assert.ok(Array.isArray(g.phases) && g.phases.length >= 3);
    assert.ok(Array.isArray(g.precedes));
    assert.ok(Array.isArray(g.terminal.allowedLast) && g.terminal.allowedLast.length > 0);
    assert.ok(Array.isArray(g.terminal.exclusiveLast));
    assert.ok(g.roleExpectations && typeof g.roleExpectations === "object");

    g.requiredBeats.forEach(function (beat) {
      assert.ok(g.allowedBeats.indexOf(beat) !== -1, "required in allowed: " + beat);
      assert.ok(g.optionalBeats.indexOf(beat) === -1, "required not optional: " + beat);
    });
    g.optionalBeats.forEach(function (beat) {
      assert.ok(g.allowedBeats.indexOf(beat) !== -1, "optional in allowed: " + beat);
    });
    assert.deepEqual(
      g.allowedBeats.slice().sort(),
      g.requiredBeats.concat(g.optionalBeats).slice().sort()
    );
  });
});

test("every Episode Plan V1 template sequence is representable by grammar", () => {
  grammar.listArchetypes().forEach(function (archetype) {
    const template = templates.ARCHETYPE_TEMPLATES[archetype];
    assert.ok(template, archetype);
    const beats = template.beats.map(function (row) {
      return row.function;
    });
    const result = grammar.isSequenceRepresentable(archetype, beats);
    assert.equal(result.ok, true, archetype + ": " + result.errors.join("; "));
  });
});

test("every FunctionEnum V1 sequence is representable; compressed sequences are not", () => {
  const feIds = [];

  Object.keys(archetypeRules.EPISODE_PLAN_V1_SEQUENCES).forEach(function (archetype) {
    const seq = archetypeRules.EPISODE_PLAN_V1_SEQUENCES[archetype];
    feIds.push(archetype + "-episode-plan-v1");
    const result = grammar.isSequenceRepresentable(archetype, seq);
    assert.equal(result.ok, true, archetype + "-v1: " + result.errors.join("; "));
  });

  assert.ok(feIds.length >= 4, "expected FunctionEnum sequences");
  assert.deepEqual(archetypeRules.ARCHETYPE_RULES, {});
  assert.equal(archetypeRules.REGISTRY_ROLE, "removed-phase-5b");

  const journeySample = grammar.isSequenceRepresentable("understand", [
    "orientation",
    "explanation",
    "check"
  ]);
  assert.equal(journeySample.ok, false);
  assert.ok(
    journeySample.errors.some(function (msg) {
      return /not FunctionEnum|not allowed/.test(msg);
    })
  );
});

test("illegal sequences fail closed against grammar helpers", () => {
  const unknownBeat = grammar.isSequenceRepresentable("understand", [
    "orientation",
    "consolidation",
    "transition"
  ]);
  assert.equal(unknownBeat.ok, false);

  const missingRequired = grammar.isSequenceRepresentable("understand", [
    "orientation",
    "verification",
    "transition"
  ]);
  assert.equal(missingRequired.ok, false);

  const badTerminal = grammar.isSequenceRepresentable("understand", [
    "explanation",
    "verification",
    "orientation"
  ]);
  assert.equal(badTerminal.ok, false);

  const transitionNotLast = grammar.isSequenceRepresentable("understand", [
    "explanation",
    "transition",
    "verification"
  ]);
  assert.equal(transitionNotLast.ok, false);
});

test("Phase 5B: selectArchetypeVariant is removed; grammar is sole legality authority", () => {
  const understandSeq = archetypeRules.EPISODE_PLAN_V1_SEQUENCES.understand.slice();
  assert.equal(
    archetypeRules.selectArchetypeVariant("understand", understandSeq),
    null,
    "canonical V1 FE must not use a whole-sequence registry"
  );
  assert.equal(
    archetypeRules.selectArchetypeVariant("understand", [
      "orientation",
      "explanation",
      "check"
    ]),
    null
  );
  assert.equal(archetypeRules.REGISTRY_ROLE, "removed-phase-5b");
  assert.equal(archetypeRules.ARCHETYPE_GRAMMAR, undefined);
});
