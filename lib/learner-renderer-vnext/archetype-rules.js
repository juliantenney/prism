/**
 * Sprint 69 Phase 5B — demoted facade.
 *
 * Canonical educational legality: shared archetype grammar.
 * Canonical binding: archetype-canonical-binding.js
 *
 * Journey compatibility registry and composition-continuity overlays have been
 * removed from the production runtime.
 */
"use strict";

var episodePlanVocabulary = require("../episode-plan-v1-vocabulary.js");
var binding = require("./archetype-canonical-binding.js");

module.exports = {
  EPISODE_PLAN_V1_SEQUENCES: binding.EPISODE_PLAN_V1_SEQUENCES,
  FUNCTION_ENUM: binding.FUNCTION_ENUM,
  V1_LEARNER_ROLE_BY_FUNCTION: binding.V1_LEARNER_ROLE_BY_FUNCTION,
  isApprovedFunction: episodePlanVocabulary.isApprovedFunction,
  buildCanonicalFunctionEnumVariant: binding.buildCanonicalFunctionEnumVariant,
  buildEpisodePlanV1Variant: binding.buildEpisodePlanV1Variant,
  /**
   * @deprecated Removed in Phase 5B. Always returns null.
   * Canonical legality uses shared grammar; binding uses buildCanonicalFunctionEnumVariant.
   */
  selectArchetypeVariant: function selectArchetypeVariant() {
    return null;
  },
  /** @deprecated Empty — journey registry removed in Phase 5B. */
  ARCHETYPE_RULES: Object.freeze({}),
  REGISTRY_ROLE: "removed-phase-5b"
};
