/**
 * Sprint 58 Phase 3A — DLA partial page output contract.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "object" || !module.exports) {
    if (typeof root !== "undefined") {
      root.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT = api;
    }
    return;
  }
  module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var CONTRACT_VERSION = "58-DLA-PARTIAL-1";

  function buildDlaPageEnrichContractBlock() {
    return [
      "",
      "### Sprint 58 vNext DLA partial-page contract (required)",
      "",
      "Output a partial v2 page artefact for DLA-owned fields only.",
      "Do not return a full page replay. Do not emit standalone learning_activities artefacts.",
      "",
      "Required top-level envelope:",
      '- artifact_type: "page"',
      '- schema_version: "2.0.0"',
      "- assembly_state.current_stage: \"dla\"",
      '- assembly_state.enriched_by must include "dla"',
      "",
      "Required payload:",
      "- activities[] (DLA-owned subset only)",
      "- each activities[] row must include activity_id",
      '- include DLA-owned instructional fields such as learner_task, expected_output, activity_preamble',
      "- DLA-owned cognition/scaffold fields (reasoning_orientation, self_explanation_prompt, etc.)",
      "- include required_materials where applicable",
      "",
      "Explicitly forbidden:",
      "- full-page replay",
      "- shell fields: title, audience, page_profile, learning_outcomes, episode_plans",
      "- materials[].body or any GAM material body content",
      "- page_synthesis",
      "- learning_sequence / assessment_check",
      "- preserving, reconstructing, or copy-forwarding non-DLA stage fields",
      "",
      "Return one pretty-printed fenced JSON page artefact. Footer: STEP N OUTPUT: page"
    ].join("\n");
  }

  function buildCanonicalDlaPageShapeSnippet() {
    return [
      "Canonical DLA partial activity shape (required fields per activity):",
      "",
      '"artifact_type": "page"',
      '"schema_version": "2.0.0"',
      '"assembly_state": { "current_stage": "dla", "enriched_by": ["dla"] }',
      '"activities": [',
      "  {",
      '    "activity_id": "A1",',
      '"learner_task": "Substantive learner-facing task prose tied to the LO and episode beats."',
      '"expected_output": "Quality-threshold prose describing what good evidence looks like."',
      '"activity_preamble": "Learner-facing orientation for this activity."',
      '"required_materials": [',
      "  {",
      '    "material_id": "A1-M1",',
      '    "material_type": "text",',
      '    "purpose": "Introduce the core concept for this beat.",',
      '    "instructional_function": "explanation",',
      '    "plan_beat_index": 3',
      "  }",
      "]",
      "  }",
      "]",
      "",
      "Optional required_materials planning fields (Sprint 59 MVP — omit unless intentional):",
      '- instructional_archetype: one of mechanism_explanation | process_walkthrough | mental_model_building',
      "- archetype_plan: matching skeleton only (mechanism: start/outcome/required_links; process: process_goal/stages; mental_model: system/parts/relationships)",
      "- material_type remains independent of instructional_archetype; do not invent unknown archetype values",
      "",
      "Forbidden in DLA partial:",
      "- full page shell fields",
      "- materials[].body",
      "- page_synthesis",
      "- learning_sequence",
      "- full-page replay"
    ].join("\n");
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    buildDlaPageEnrichContractBlock: buildDlaPageEnrichContractBlock,
    buildCanonicalDlaPageShapeSnippet: buildCanonicalDlaPageShapeSnippet
  };
});
