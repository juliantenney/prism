/**
 * Sprint 69 Phase 5B — Explicit archetype validation routing.
 *
 * Sole educational validation route for production:
 *   FunctionEnum classification → shared grammar → canonical binding
 *
 * Compressed / mixed / unknown / malformed vocabulary fails closed.
 * No journey-compatibility registry. No whole-sequence legality.
 */
"use strict";

var vocabulary = require("../episode-plan-v1-vocabulary.js");
var grammar = require("../episode-plan-v1-archetype-grammar.js");
var binding = require("./archetype-canonical-binding.js");
var diagnostic = require("./validate-input").diagnostic;

var VALIDATION_ROUTE = Object.freeze({
  CANONICAL_GRAMMAR: "canonical-grammar",
  MALFORMED: "malformed",
  UNKNOWN_OR_MIXED: "unknown-or-mixed-vocabulary"
});

var RUNTIME_AUTHORITY = Object.freeze({
  SHARED_ARCHETYPE_GRAMMAR: "shared-archetype-grammar"
});

/**
 * Historical compressed beats retained only for classification/diagnostics.
 * Not FunctionEnum. Not accepted for production rendering.
 */
var NON_CANONICAL_COMPATIBILITY_BEATS = Object.freeze({
  check: true,
  check_understanding: true,
  application: true,
  practice: true,
  feedback: true,
  investigation: true,
  synthesis: true,
  worked_example: true,
  analysis: true,
  judgement: true,
  comparison: true,
  evaluation: true
});

function classifySequenceVocabulary(normalizedBeatSequence) {
  var sequence = Array.isArray(normalizedBeatSequence)
    ? normalizedBeatSequence.slice()
    : [];
  var emptyIndexes = [];
  var functionEnumBeats = [];
  var compressedBeats = [];
  var unknownBeats = [];

  sequence.forEach(function (beat, index) {
    var id = String(beat || "");
    if (!id) {
      emptyIndexes.push(index);
      return;
    }
    if (vocabulary.FUNCTION_ENUM_SET[id]) {
      functionEnumBeats.push(id);
      return;
    }
    if (NON_CANONICAL_COMPATIBILITY_BEATS[id]) {
      compressedBeats.push(id);
      return;
    }
    unknownBeats.push({ beat: id, index: index });
  });

  if (!sequence.length || emptyIndexes.length) {
    return Object.freeze({
      kind: "malformed",
      validationRoute: VALIDATION_ROUTE.MALFORMED,
      sequence: Object.freeze(sequence),
      emptyIndexes: Object.freeze(emptyIndexes.slice()),
      functionEnumBeats: Object.freeze(functionEnumBeats.slice()),
      compressedBeats: Object.freeze(compressedBeats.slice()),
      unknownBeats: Object.freeze(unknownBeats.slice())
    });
  }

  if (compressedBeats.length && functionEnumBeats.length) {
    return Object.freeze({
      kind: "mixed_vocabulary",
      validationRoute: VALIDATION_ROUTE.UNKNOWN_OR_MIXED,
      sequence: Object.freeze(sequence),
      emptyIndexes: Object.freeze([]),
      functionEnumBeats: Object.freeze(functionEnumBeats.slice()),
      compressedBeats: Object.freeze(compressedBeats.slice()),
      unknownBeats: Object.freeze(unknownBeats.slice())
    });
  }

  if (compressedBeats.length || unknownBeats.length) {
    return Object.freeze({
      kind: "unknown_or_compressed",
      validationRoute: VALIDATION_ROUTE.UNKNOWN_OR_MIXED,
      sequence: Object.freeze(sequence),
      emptyIndexes: Object.freeze([]),
      functionEnumBeats: Object.freeze(functionEnumBeats.slice()),
      compressedBeats: Object.freeze(compressedBeats.slice()),
      unknownBeats: Object.freeze(unknownBeats.slice())
    });
  }

  return Object.freeze({
    kind: "canonical_function_enum",
    validationRoute: VALIDATION_ROUTE.CANONICAL_GRAMMAR,
    sequence: Object.freeze(sequence),
    emptyIndexes: Object.freeze([]),
    functionEnumBeats: Object.freeze(functionEnumBeats.slice()),
    compressedBeats: Object.freeze([]),
    unknownBeats: Object.freeze([])
  });
}

function resolveArchetypeValidation(input) {
  var opts = input && typeof input === "object" ? input : {};
  var activityId = String(opts.activityId || "");
  var archetype = String(opts.archetype || "");
  var sequence = Array.isArray(opts.normalizedBeatSequence)
    ? opts.normalizedBeatSequence.slice()
    : [];
  var classification = classifySequenceVocabulary(sequence);
  var errors = [];

  function fail(code, message, extra) {
    errors.push(
      diagnostic(
        "error",
        code,
        message,
        Object.assign(
          {
            activityId: activityId,
            archetype: archetype,
            sequence: sequence.slice(),
            validationRoute: classification.validationRoute,
            owner: "Episode Plan capture",
            runtimeAuthority: null,
            errorRole: "primary"
          },
          extra || {}
        )
      )
    );
    return {
      ok: false,
      validationRoute: classification.validationRoute,
      runtimeAuthority: null,
      classification: classification,
      grammarResult: null,
      variant: null,
      registryMatch: false,
      continuityMatch: false,
      matchedVariantId: null,
      bindingSource: null,
      nonCanonicalCompatibility: false,
      errors: errors
    };
  }

  if (!archetype) {
    return fail("UNKNOWN_ARCHETYPE", "Activity episode_plan.archetype is missing.");
  }

  if (!grammar.isKnownArchetype(archetype)) {
    return fail(
      "UNKNOWN_ARCHETYPE",
      'Archetype "' + archetype + '" is not a frozen Episode Plan V1 archetype.'
    );
  }

  if (classification.kind === "malformed") {
    return fail(
      "MALFORMED_EPISODE_PLAN_SEQUENCE",
      "Episode plan beat sequence is empty or contains empty beat functions.",
      { emptyIndexes: classification.emptyIndexes.slice() }
    );
  }

  if (classification.kind === "mixed_vocabulary") {
    return fail(
      "MIXED_EPISODE_PLAN_VOCABULARY",
      "Episode plan sequence mixes FunctionEnum with non-canonical compressed vocabulary.",
      {
        functionEnumBeats: classification.functionEnumBeats.slice(),
        compressedBeats: classification.compressedBeats.slice(),
        unknownBeats: classification.unknownBeats.slice(),
        canonicalSource: "Episode Plan FunctionEnum"
      }
    );
  }

  if (classification.kind === "unknown_or_compressed") {
    var code = classification.compressedBeats.length
      ? "UNKNOWN_EPISODE_PLAN_BEAT"
      : "UNKNOWN_EPISODE_PLAN_BEAT";
    return fail(
      code,
      "Episode plan sequence contains beat values outside FunctionEnum.",
      {
        functionEnumBeats: classification.functionEnumBeats.slice(),
        compressedBeats: classification.compressedBeats.slice(),
        unknownBeats: classification.unknownBeats.slice(),
        canonicalSource: "Episode Plan FunctionEnum"
      }
    );
  }

  var grammarResult = grammar.validateSequenceAgainstGrammar(archetype, sequence);
  if (!grammarResult.valid) {
    errors.push(
      diagnostic(
        "error",
        "ARCHETYPE_GRAMMAR_VALIDATION_FAILED",
        "Canonical FunctionEnum sequence failed shared archetype grammar validation.",
        {
          activityId: activityId,
          archetype: archetype,
          sequence: sequence.slice(),
          validationRoute: VALIDATION_ROUTE.CANONICAL_GRAMMAR,
          grammarVersion: grammar.GRAMMAR_VERSION,
          grammarViolations: grammarResult.violations.slice(),
          owner: "Episode Plan / shared archetype grammar",
          runtimeAuthority: RUNTIME_AUTHORITY.SHARED_ARCHETYPE_GRAMMAR,
          renderingContinued: false,
          errorRole: "primary"
        }
      )
    );
    return {
      ok: false,
      validationRoute: VALIDATION_ROUTE.CANONICAL_GRAMMAR,
      runtimeAuthority: RUNTIME_AUTHORITY.SHARED_ARCHETYPE_GRAMMAR,
      classification: classification,
      grammarResult: grammarResult,
      variant: null,
      registryMatch: false,
      continuityMatch: false,
      matchedVariantId: null,
      bindingSource: null,
      nonCanonicalCompatibility: false,
      errors: errors
    };
  }

  var variant = binding.buildCanonicalFunctionEnumVariant(archetype, sequence);
  return {
    ok: true,
    validationRoute: VALIDATION_ROUTE.CANONICAL_GRAMMAR,
    runtimeAuthority: RUNTIME_AUTHORITY.SHARED_ARCHETYPE_GRAMMAR,
    classification: classification,
    grammarResult: grammarResult,
    variant: variant,
    registryMatch: false,
    continuityMatch: false,
    matchedVariantId: variant.id,
    bindingSource: "canonical-grammar-binding",
    nonCanonicalCompatibility: false,
    errors: errors
  };
}

module.exports = {
  VALIDATION_ROUTE: VALIDATION_ROUTE,
  RUNTIME_AUTHORITY: RUNTIME_AUTHORITY,
  NON_CANONICAL_COMPATIBILITY_BEATS: NON_CANONICAL_COMPATIBILITY_BEATS,
  classifySequenceVocabulary: classifySequenceVocabulary,
  resolveArchetypeValidation: resolveArchetypeValidation
};
