/**
 * Sprint 58 Phase 3A — DLA partial page output contract.
 * Sprint 60 Phase A — Priority-1 instructional archetype planning guidance (production).
 * DLA-ACTIVITY-TITLE-1 — final learner-facing activities[].title ownership.
 */
(function (root, factory) {
  "use strict";
  var api = factory(root);
  if (typeof module !== "object" || !module.exports) {
    if (typeof root !== "undefined") {
      root.PRISM_LD_DLA_PAGE_ENRICH_CONTRACT = api;
    }
    return;
  }
  module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function (root) {
  "use strict";

  var CONTRACT_VERSION = "58-DLA-PARTIAL-3";

  function resolveTitleContract() {
    if (typeof module === "object" && module.exports) {
      try {
        return require("./ld-activity-title-contract.js");
      } catch (_) {}
    }
    var scope =
      root ||
      (typeof globalThis !== "undefined"
        ? globalThis
        : typeof window !== "undefined"
          ? window
          : {});
    return scope.PRISM_LD_ACTIVITY_TITLE_CONTRACT || null;
  }

  function activityTitleGuidanceBlock() {
    var titleMod = resolveTitleContract();
    if (titleMod && typeof titleMod.buildDlaActivityTitleGuidance === "function") {
      return titleMod.buildDlaActivityTitleGuidance();
    }
    return [
      "Learner-facing activity title (required on every activities[] row):",
      "- Emit activities[].title as the final concise name for the designed activity.",
      "- Normally use 3–7 words; prefer no more than 45 characters; never exceed 60 characters.",
      "- Name the actual topic, action, or learning experience — not the mapped learning-outcome statement.",
      "- Remain meaningful when heard without surrounding visual context.",
      "- Retain necessary disciplinary terminology.",
      "- Be distinct from every sibling activity title in this resource.",
      "- Create semantic distinctness rather than appending A1, A2, or other internal activity IDs.",
      "- Do not include internal activity IDs in learner-facing titles (as standalone tokens or uniqueness suffixes).",
      "- Do not truncate with terminal ellipses (... or …).",
      '- Do not use generic labels such as "Activity A1".',
      "- This title replaces any provisional Episode Plan shell title and must not be regenerated downstream."
    ].join("\n");
  }

  function buildDlaPageEnrichContractBlock() {
    return [
      "",
      "### Sprint 58 vNext DLA partial-page contract (required)",
      "",
      "Output a partial v2 page artefact for DLA-owned fields only.",
      "Do not return a full-page replay. Do not emit standalone learning_activities artefacts.",
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
      "- each activities[] row must include title (final learner-facing activity name — replaces Episode Plan provisional title)",
      '- include DLA-owned instructional fields such as learner_task, expected_output, activity_preamble',
      "- DLA-owned cognition/scaffold fields (reasoning_orientation, self_explanation_prompt, etc.)",
      "- include required_materials where applicable",
      "- each activities[] row must include evidence_decision { required, reason, provider_material_ids[] }",
      "- optional only on evidence-provider required_materials[] rows: evidence_requirement object for evidence-dependent reasoning tasks",
      "",
      activityTitleGuidanceBlock(),
      "",
      "Verification checklist diagnostic specification (when required_materials includes type checklist):",
      "- Specify 3–4 diagnostic review criteria (hard maximum 5) in the checklist specification.",
      "- Each criterion must align with the activity task, expected_output, and mapped learning outcome(s).",
      "- Each criterion must name a meaningful dimension of response quality and the response features learners should examine.",
      "- Specifications must support criterion-specific correction (not generic tick-box completion).",
      "- Do NOT write learner-facing criterion questions, why-it-matters prose, feature lists, or repair actions — GAM owns those.",
      "",
      "Evidence-centred requirement semantics (optional, backward-compatible on required_materials[] rows):",
      '- Use evidence_requirement only when the learner must inspect evidence to complete the task (interpret/diagnose/analyse/compare/evaluate/justify from observations).',
      '- evidence_requirement.kind: "learner_evidence"',
      "- evidence_requirement.purpose: why this evidence is needed for the task",
      "- evidence_requirement.learner_action: what the learner must do with the evidence",
      "- evidence_requirement.observable_features: non-empty string array of particulars learners must inspect",
      "- Optional refinements when needed: minimum_suitable_form, processing_notes, provenance, disclosure_constraint, evidence_layout, fixed_observation_fields, learner_response_fields.",
      "- Evidence providers supply observations/data/cases/source extracts. Response scaffolds (analysis_table, decision_table, comparison_table, template, etc.) organise learner analysis.",
      "- Referencing or recording evidence in a scaffold does NOT make that scaffold an evidence provider.",
      '- Attach evidence_requirement only to evidence-provider material(s) named in evidence_decision.provider_material_ids.',
      "- Prefer a separate evidence provider plus an ordinary response scaffold when evidence has already been supplied elsewhere.",
      '- Use evidence_layout: "combined_evidence_workspace" only when that SAME material genuinely contains both fixed evidence columns and learner-editable response columns, is listed in provider_material_ids, and both fixed_observation_fields and learner_response_fields are non-empty string arrays naming those columns (cell values remain blank for learners).',
      "- Do not attach combined_evidence_workspace to a response scaffold when a separate provider already fulfils the evidence requirement.",
      '- Use provenance: "system_generated_simulation" for generated instructional evidence requiring simulation honesty.',
      "- Keep evidence requirements proportionate to duration, prerequisite knowledge, and cognitive load.",
      "- Do not generate final evidence bodies here; GAM fulfils required materials.",
      "- evidence_decision must be explicit per activity and auditable against learner_task/expected_output wording.",
      "- If evidence_decision.required is true, provider_material_ids must reference required_materials rows that include evidence_requirement (one-to-one agreement).",
      "- When evidence_decision.required is true, any pre-task teaching, worked_example, or modelling_note must not analyse the focal evidence provider, answer the focal learner task, state a preferred mechanism/option/interpretation, or provide the provisional/final judgement learners must derive.",
      "- A pre-task worked example may remain if it uses a distinct analogous case, demonstrates only the reasoning procedure, or models one reasoning step without resolving the focal question.",
      "- Known boundary (this slice): supports system-generated learner evidence with honest simulation labelling. Uploaded primary evidence is not yet preserved as a stable, addressable artefact throughout the pipeline; source-bound disciplines that need exact excerpts/provenance are a separate future work package (upload classification, preservation, identifiers, retrieval, rights/provenance).",
      "",
      "Explicitly forbidden:",
      "- full-page replay",
      "- shell fields: page-level title, audience, page_profile, learning_outcomes, episode_plans",
      "  (page-level title is not activities[].title — activity titles are required DLA-owned fields)",
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
      '    "title": "Map inflation cause chains",',
      '"learner_task": "Substantive learner-facing task prose tied to the LO and episode beats."',
      '"expected_output": "Quality-threshold prose describing what good evidence looks like."',
      '"activity_preamble": "Learner-facing orientation for this activity."',
      '"evidence_decision": { "required": true, "reason": "Learner must inspect observable evidence before judging.", "provider_material_ids": ["A1-M1"] },',
      '"required_materials": [',
      "  {",
      '    "material_id": "A1-M1",',
      '    "material_type": "scenario",',
      '    "purpose": "Provide contrastive evidence cases for diagnosis.",',
      '    "instructional_function": "guided_reasoning",',
      '    "plan_beat_index": 3,',
      '    "evidence_requirement": {',
      '      "kind": "learner_evidence",',
      '      "purpose": "Provide inspectable observations needed for diagnosis.",',
      '      "learner_action": "Inspect the observations and justify the likely diagnosis.",',
      '      "observable_features": ["pattern in observed values", "contrast between two cases"],',
      '      "minimum_suitable_form": "compact comparison table",',
      '      "processing_notes": "Keep to a short learner-ready summary; avoid unnecessary raw data.",',
      '      "provenance": "system_generated_simulation",',
      '      "disclosure_constraint": "Do not state the intended conclusion before learner response.",',
      '      "evidence_layout": "separate_provider"',
      "    }",
      "  }",
      "]",
      "  }",
      "]",
      "",
      activityTitleGuidanceBlock(),
      "",
      buildInstructionalArchetypePlanningGuidance(),
      "",
      "Forbidden in DLA partial:",
      "- full page shell fields (page-level title, audience, page_profile, learning_outcomes, episode_plans)",
      "- omitting activities[].title",
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
