/**
 * Sprint 56F Phase 3 — DLA enrich-in-place contract (vNext page artefact).
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

  var CONTRACT_VERSION = "56F-DLA-PAGE-1";

  function buildDlaPageEnrichContractBlock() {
    return [
      "",
      "### Sprint 56F vNext DLA enrich-in-place contract (required)",
      "",
      "Input: vNext page artefact (schema_version 2.0.0) from Design Episode Plan with assembly_state.current_stage episode_plan.",
      "Output: the SAME page object enriched by DLA — not a standalone learning_activities artefact and not legacy sections.",
      "",
      "Preserve verbatim:",
      "- artifact_type, schema_version, title, audience, page_profile",
      "- activities[].activity_id and activity order",
      "- activities[].episode_plan (archetype + beats — do not replan)",
      "- learning_outcomes[], episode_plans[], source_artefacts[] (append-only provenance only)",
      "- page_synthesis: {} (empty — finalise_page owns synthesis)",
      "",
      "Replace per activity:",
      '- learner_task, expected_output, activity_preamble (replace em dash — placeholders)',
      "- DLA-owned cognition/scaffold fields (reasoning_orientation, self_explanation_prompt, etc.)",
      "- required_materials[] structural obligations derived from episode_plan beats",
      "",
      "Forbidden:",
      "- materials[].body or any GAM material bodies",
      "- page_synthesis content (overview, learning_purpose, knowledge_summary, study_tips)",
      "- sections[]",
      "- learning_sequence, assessment_check",
      "- changed activity_id or reordered activities",
      "",
      "Update assembly_state:",
      '- current_stage: "dla"',
      '- enriched_by: ["episode_plan", "dla"]',
      "",
      "Return one pretty-printed fenced JSON page artefact. Footer: STEP N OUTPUT: page"
    ].join("\n");
  }

  function buildCanonicalDlaPageShapeSnippet() {
    return [
      "Canonical DLA-enriched activity shape (required fields per activity):",
      "",
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
      '"materials": []',
      "",
      "Forbidden after DLA:",
      '- learner_task / expected_output / activity_preamble: "—"',
      "- materials[].body",
      "- sections[]",
      '- standalone { "activities": [...] } without page wrapper'
    ].join("\n");
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    buildDlaPageEnrichContractBlock: buildDlaPageEnrichContractBlock,
    buildCanonicalDlaPageShapeSnippet: buildCanonicalDlaPageShapeSnippet
  };
});
