/**
 * Sprint 58 Phase 3A — Generate Assessment Items partial page output contract.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "object" || !module.exports) {
    if (typeof root !== "undefined") {
      root.PRISM_LD_GAI_PAGE_ENRICH_CONTRACT = api;
    }
    return;
  }
  module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var CONTRACT_VERSION = "58-GAI-PARTIAL-1";

  function buildGaiPageEnrichContractBlock() {
    return [
      "",
      "### Sprint 58 vNext GAI partial-page contract (required)",
      "",
      "Output a partial v2 page artefact for assessment-items fields only.",
      "Do not return standalone assessment_items JSON. Do not emit a legacy root object with top-level items[], difficulty_distribution, answer_key, or explanations.",
      "",
      "Required top-level envelope:",
      '- artifact_type: "page"',
      '- schema_version: "2.0.0"',
      '- assembly_state.current_stage: "assessment_items"',
      '- assembly_state.enriched_by must include "assessment_items"',
      "",
      "Required payload (use one or both):",
      "- assessment_check object with items[]",
      '- sections[] row with section_id "assessment_check" and content.items[]',
      "",
      "Item authoring (inside assessment_check.items[] or sections[].content.items[]):",
      "- each item needs item_id, item_type, topic, related_learning_outcomes, integration_type, difficulty_level, explanation_or_rationale, and type-specific fields",
      "- single_answer_mcq: stem, options, correct_answer (and correct_answer_text when available)",
      "- include answer_key / per-item answer fields for tutor/marking use unless tutor_answer_artefact explicitly omits them",
      "",
      "Explicitly forbidden:",
      "- standalone assessment_items artefact shape",
      "- top-level items / difficulty_distribution / answer_key / explanations without page envelope",
      "- full-page replay (title, audience, activities, materials, page_synthesis, learning_sequence, etc.)",
      "- preserving, reconstructing, or copy-forwarding non-GAI stage fields",
      "",
      "Return one pretty-printed fenced JSON page artefact. Footer: STEP N OUTPUT: page"
    ].join("\n");
  }

  function buildCanonicalGaiAssessmentShapeSnippet() {
    return [
      "Canonical GAI partial shape:",
      "```json",
      "{",
      '  "artifact_type": "page",',
      '  "schema_version": "2.0.0",',
      '  "assembly_state": { "current_stage": "assessment_items", "enriched_by": ["assessment_items"] },',
      '  "assessment_check": {',
      '    "items": [',
      "      {",
      '        "item_id": "Q1",',
      '        "item_type": "single_answer_mcq",',
      '        "topic": "Inflation drivers",',
      '        "related_learning_outcomes": ["LO1"],',
      '        "integration_type": "single",',
      '        "difficulty_level": "comprehension",',
      '        "stem": "Which inflation type is driven by rising demand?",',
      '        "options": ["Demand-pull", "Cost-push", "Imported inflation", "Wage freeze"],',
      '        "correct_answer": "Demand-pull",',
      '        "explanation_or_rationale": "Demand-pull inflation occurs when aggregate demand outpaces supply."',
      "      }",
      "    ]",
      "  }",
      "}",
      "```",
      "",
      "Invalid GAI outputs:",
      '- root object with only "items" (missing artifact_type / assembly_state / assessment_check)',
      "- full page shell replay",
      "- activities / materials / learning_sequence content",
      '- STEP N OUTPUT: assessment_items (must be STEP N OUTPUT: page)'
    ].join("\n");
  }

  function buildGaiPageEnrichAuthoringBrief() {
    return [
      "Output contract: return a partial page artefact only (not standalone assessment_items JSON).",
      'Required envelope: artifact_type "page", schema_version "2.0.0", assembly_state.current_stage "assessment_items", and assembly_state.enriched_by including "assessment_items".',
      "Required payload: assessment_check.items[] and/or sections[].section_id=assessment_check with content.items[].",
      "Use Copilot conversation context for upstream instructional content; PRISM does not embed stored prior step outputs in this mode.",
      "Forbidden: top-level items/difficulty_distribution/answer_key without page envelope, activities/materials regeneration, page_synthesis, learning_sequence mutation, and full-page replay.",
      "Do not reconstruct or preserve non-owned stage fields."
    ].join("\n");
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    buildGaiPageEnrichContractBlock: buildGaiPageEnrichContractBlock,
    buildCanonicalGaiAssessmentShapeSnippet: buildCanonicalGaiAssessmentShapeSnippet,
    buildGaiPageEnrichAuthoringBrief: buildGaiPageEnrichAuthoringBrief
  };
});
