/**
 * Sprint 58 Phase 3A — DLA partial page output contract.
 * Sprint 60 Phase A — Priority-1 instructional archetype planning guidance (production).
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

  var CONTRACT_VERSION = "58-DLA-PARTIAL-2";

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

  function buildInstructionalArchetypePlanningGuidance() {
    return [
      "Instructional archetype planning on required_materials (Sprint 60 production — Priority 1, extended Sprint 61-E01):",
      "",
      "Authoritative source of truth (per material row):",
      "- instructional_archetype",
      "- archetype_plan",
      "",
      "When a material’s pedagogical job genuinely matches one of the supported Priority-1 archetypes,",
      "emit instructional_archetype and a complete archetype_plan on that required_materials row:",
      "",
      "1) mechanism_explanation — teach how/why an effect is transmitted (intervening causal process)",
      "   archetype_plan must include:",
      '   - start (non-empty string)',
      '   - outcome (non-empty string)',
      "   - required_links (non-empty string array; each link is an intervening process step)",
      "",
      "2) process_walkthrough — teach an ordered expert process (physical, cognitive, or institutional)",
      "   archetype_plan must include:",
      '   - process_goal (non-empty string)',
      "   - stages (non-empty string array; at least two stages)",
      "",
      "3) mental_model_building — help the learner assemble a durable working model of a system",
      "   archetype_plan must include exactly this shape (planning skeleton only — not learner body):",
      '   - system (non-empty string)',
      "   - key_relationships (non-empty string array)",
      '   - governing_constraint (non-empty string)',
      "   - contrast: { state_a, state_b } (both non-empty strings)",
      "   Do NOT emit parts, predicted_effect, or System:/Relationships: rubric headings as plan fields.",
      "",
      "4) evaluation_judgement — help the learner apply explicit criteria to relevant evidence,",
      "   consider trade-offs or limitations, and reach a justified conclusion",
      "   Select evaluation_judgement only when the learner must apply explicit criteria to evidence,",
      "   consider limitations or trade-offs, and reach or defend a justified conclusion.",
      "   archetype_plan must include:",
      '   - question (non-empty string)',
      "   - criteria (non-empty string array; at least two criteria)",
      "   - evidence (non-empty string array; at least one entry)",
      "   - tradeoffs (non-empty string array; at least one limitation or trade-off)",
      '   - judgement_focus (non-empty string)',
      "   Do NOT select evaluation_judgement merely because:",
      "   - the activity asks a question;",
      "   - the learner must explain a concept;",
      "   - the learner must compare two items descriptively;",
      "   - the learner must list advantages and disadvantages;",
      "   - the activity uses an Evaluate learning-function label but does not require evidence-based judgement.",
      "   Do not confuse evaluation_judgement with mechanism_explanation (causal transmission),",
      "   process_walkthrough (ordered expert stages without criteria weighing),",
      "   or mental_model_building (durable system model + contrast states).",
      "",
      "Selection rules:",
      "- Choose the archetype per material (not once for the whole page).",
      "- A page may contain multiple materials using different Priority-1 archetypes.",
      "- Emit archetype fields only when the material’s pedagogical purpose genuinely matches.",
      "- Ordinary materials must omit instructional_archetype and archetype_plan.",
      "- material_type is presentation format; instructional_archetype is pedagogical function — keep them independent.",
      "- Do not invent unknown instructional_archetype values (supported Priority-1 IDs only in this contract).",
      "- Do not use workflow goal/title tokens or sprint test tokens as the selection signal;",
      "  selection is expressed only on required_materials rows."
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
      buildInstructionalArchetypePlanningGuidance(),
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
    buildCanonicalDlaPageShapeSnippet: buildCanonicalDlaPageShapeSnippet,
    buildInstructionalArchetypePlanningGuidance: buildInstructionalArchetypePlanningGuidance
  };
});
