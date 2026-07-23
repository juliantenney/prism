/**
 * Sprint 69 Phase 5B — Observational grammar dual validation.
 *
 * Shared grammar is the sole educational legality authority.
 * Observational comparison no longer references a runtime compatibility registry.
 */
"use strict";

var episodePlanGrammar = require("../episode-plan-v1-archetype-grammar.js");
var diagnostic = require("./validate-input").diagnostic;

var COMPARISON = Object.freeze({
  REGISTRY_ACCEPTS_GRAMMAR_ACCEPTS: "REGISTRY_ACCEPTS_GRAMMAR_ACCEPTS",
  REGISTRY_ACCEPTS_GRAMMAR_REJECTS: "REGISTRY_ACCEPTS_GRAMMAR_REJECTS",
  REGISTRY_REJECTS_GRAMMAR_ACCEPTS: "REGISTRY_REJECTS_GRAMMAR_ACCEPTS",
  REGISTRY_REJECTS_GRAMMAR_REJECTS: "REGISTRY_REJECTS_GRAMMAR_REJECTS",
  GRAMMAR_NOT_APPLICABLE: "GRAMMAR_NOT_APPLICABLE"
});

var VALIDATION_OWNER = "Sprint 69 Phase 5B dual validation";

var DISAGREEMENT_CODES = Object.freeze({
  REGISTRY_ACCEPTS_GRAMMAR_REJECTS: "ARCHETYPE_GRAMMAR_REJECTS_REGISTERED_SEQUENCE",
  REGISTRY_REJECTS_GRAMMAR_ACCEPTS: "ARCHETYPE_GRAMMAR_ACCEPTS_UNREGISTERED_SEQUENCE"
});

function compareRegistryAndGrammar(input) {
  var opts = input && typeof input === "object" ? input : {};
  var archetype = String(opts.archetype || "");
  var sequence = Array.isArray(opts.normalizedBeatSequence)
    ? opts.normalizedBeatSequence.slice()
    : [];
  var registryAccepts = opts.registryMatch === true;
  var grammarResult =
    opts.grammarResult && typeof opts.grammarResult === "object"
      ? opts.grammarResult
      : episodePlanGrammar.validateSequenceAgainstGrammar(archetype, sequence);

  var comparison;
  if (!grammarResult.applicable) {
    comparison = COMPARISON.GRAMMAR_NOT_APPLICABLE;
  } else if (registryAccepts && grammarResult.valid) {
    comparison = COMPARISON.REGISTRY_ACCEPTS_GRAMMAR_ACCEPTS;
  } else if (registryAccepts && !grammarResult.valid) {
    comparison = COMPARISON.REGISTRY_ACCEPTS_GRAMMAR_REJECTS;
  } else if (!registryAccepts && grammarResult.valid) {
    comparison = COMPARISON.REGISTRY_REJECTS_GRAMMAR_ACCEPTS;
  } else {
    comparison = COMPARISON.REGISTRY_REJECTS_GRAMMAR_REJECTS;
  }

  var validationRoute = opts.validationRoute || null;
  var runtimeAuthority =
    opts.runtimeAuthority ||
    (validationRoute === "canonical-grammar"
      ? "shared-archetype-grammar"
      : "observational-comparison");

  var renderingContinued =
    opts.renderingContinued != null
      ? !!opts.renderingContinued
      : !!grammarResult.valid;

  return Object.freeze({
    comparison: comparison,
    disagreement:
      comparison === COMPARISON.REGISTRY_ACCEPTS_GRAMMAR_REJECTS ||
      comparison === COMPARISON.REGISTRY_REJECTS_GRAMMAR_ACCEPTS,
    activityId: String(opts.activityId || ""),
    archetype: archetype,
    sequence: Object.freeze(sequence.slice()),
    validationRoute: validationRoute,
    registry: Object.freeze({
      accepts: false,
      matchedVariantId: null,
      authority: "removed-phase-5b"
    }),
    grammar: Object.freeze({
      version: episodePlanGrammar.GRAMMAR_VERSION,
      applicable: grammarResult.applicable,
      applicability: grammarResult.applicability,
      valid: grammarResult.valid,
      violations: Object.freeze(
        (grammarResult.violations || []).map(function (row) {
          return Object.freeze(Object.assign({}, row));
        })
      )
    }),
    owner: VALIDATION_OWNER,
    runtimeAuthority: runtimeAuthority,
    bindingSource: opts.bindingSource || null,
    renderingContinued: renderingContinued,
    renderingAffectedByGrammar: validationRoute === "canonical-grammar",
    phase: "phase-5b"
  });
}

function buildDualValidationDiagnostics(dual) {
  // Phase 5B: no runtime registry — observational disagreement warnings are unused.
  if (!dual || !dual.disagreement) return [];
  if (dual.validationRoute === "canonical-grammar" && dual.renderingContinued) {
    return [];
  }
  return [];
}

module.exports = {
  COMPARISON: COMPARISON,
  DISAGREEMENT_CODES: DISAGREEMENT_CODES,
  RUNTIME_AUTHORITY: "shared-archetype-grammar",
  VALIDATION_OWNER: VALIDATION_OWNER,
  compareRegistryAndGrammar: compareRegistryAndGrammar,
  buildDualValidationDiagnostics: buildDualValidationDiagnostics,
  GRAMMAR_VERSION: episodePlanGrammar.GRAMMAR_VERSION
};
