/**
 * Sprint 69 Phase 1 — Canonical Episode Plan FunctionEnum vocabulary.
 *
 * Sole ownership of approved beat-function identifiers. Dependency-neutral:
 * no grammar, ordering, aliases, role inference, or renderer composition.
 *
 * Population/DLA pedagogical specs remain in episode-plan-population-contract.js;
 * this module owns membership only.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PRISM_EPISODE_PLAN_V1_VOCABULARY = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  /**
   * Canonical FunctionEnum identifiers (38Q-2 / 38S). Exact snake_case strings.
   * Order is stable for diagnostics and contract tests; not a sequence grammar.
   */
  var FUNCTION_ENUM = Object.freeze([
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

  var FUNCTION_ENUM_SET = Object.freeze(
    FUNCTION_ENUM.reduce(function (set, id) {
      set[id] = true;
      return set;
    }, Object.create(null))
  );

  /**
   * Preserve existing producer validation behaviour: trim + lowercase before
   * membership. Canonical identifiers themselves remain exact snake_case.
   */
  function normalizeFunctionKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function isApprovedFunction(value) {
    var key = normalizeFunctionKey(value);
    return key !== "" && FUNCTION_ENUM_SET[key] === true;
  }

  /**
   * Exact string membership against canonical identifiers (no case folding).
   * Used for shared-source / drift tests; producer validation continues to use
   * isApprovedFunction for behavioural parity.
   */
  function isCanonicalFunctionExact(value) {
    return typeof value === "string" && FUNCTION_ENUM_SET[value] === true;
  }

  function approvedFunctionSet() {
    var set = {};
    FUNCTION_ENUM.forEach(function (id) {
      set[id] = true;
    });
    return set;
  }

  function listApprovedFunctions() {
    return FUNCTION_ENUM.slice();
  }

  return {
    VOCABULARY_VERSION: "S69-P1",
    FUNCTION_ENUM: FUNCTION_ENUM,
    FUNCTION_ENUM_SET: FUNCTION_ENUM_SET,
    normalizeFunctionKey: normalizeFunctionKey,
    isApprovedFunction: isApprovedFunction,
    isCanonicalFunctionExact: isCanonicalFunctionExact,
    approvedFunctionSet: approvedFunctionSet,
    listApprovedFunctions: listApprovedFunctions
  };
});
