/**
 * LD-DESIGN-PAGE-COMPOSE-CONTRACT — canonical Design Page read-only compose (Sprint 38-B Wave 3).
 * Lifecycle: canonical (PR-W3-2, 2026-06-04).
 * Owns: page schema, activity membership, field preservation hooks, L4 preserve embed orchestration, L8 validation checklist.
 * Does not duplicate: LD-MATERIALS-COPY, LD-TABLE-FIDELITY, LD-MATH-RENDER, LD-SELF-DIRECTED-RHETORIC, Sprint 38 schema bodies.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_DESIGN_PAGE_COMPOSE = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-DESIGN-PAGE-COMPOSE-CONTRACT";
  var MARKER = "LD-DESIGN-PAGE-COMPOSE-CONTRACT (auto-applied)";

  var FIELD_PRESERVATION_FIELD_IDS =
    "activity_preamble, prior_knowledge_activation, reasoning_orientation, self_explanation_prompt, evidence_use_prompt, argument_structure_hint, conceptual_contrast_prompt, disciplinary_lens, transfer_or_application_task, scaffold_hint_sequence, uncertainty_tension_prompt, study_orientation, intellectual_frame, intellectual_coherence_bridge";

  var CORE_LINES = [
    "",
    MARKER + ":",
    "- Module: " +
      MODULE_ID +
      " | L0–L3 read-only page compose + L5 field preservation. Obey appended LD-JOURNEY-ASSIMILATION, LD-AUTHORIAL-EXPOSITION, LD-MATERIALS-COPY, LD-TABLE-FIDELITY, LD-SELF-DIRECTED-RHETORIC, LD-MATH-RENDER, and Sprint 38 visual/pedagogical contracts — bodies not repeated here."
  ];

  var MEMBERSHIP_LINES = [
    "- ACTIVITY MEMBERSHIP (hard): every upstream activity_id in learning_activities.content unless generation_notes.activities_omitted[] with explicit user-authorised authority (subset request or workflow constraint) — never omit for output size, token limit, or model length; when upstream activity_materials provides bodies, copy the full materials object onto the matching row (no synopsis, reference-only, placeholder, or catalogue substitution); material bodies are hard constraints — never truncate, summarise, or thin materials to references for output size, token limit, or model length; learning_sequence order/timing only; validate (U \\ X) ⊆ C; assessment_check.content object with items[] when assessment_items provided; record non-material gaps in generation_notes.limitations with explicit reason — never excuse material-body loss via limitations."
  ];

  var MATERIALS_BRIDGE_LINES = [
    "- MATERIALS FIDELITY (compose): visual_affordances[] are additive page-root metadata only — must not replace learning_activities.content[].materials; representation_avoid / duplicate rules on generated figures only; copy activity.materials.* verbatim from upstream activity_materials (no paraphrase, shorten, summarise, or rewrite); L4 preserve embed:"
  ];

  var FIELD_PRESERVATION_LINES = [
    "- Activity field preservation (learner-facing page): copy verbatim onto each matching activity_id when present upstream learning_activities (not only activity_materials):",
    "  " + FIELD_PRESERVATION_FIELD_IDS,
    "- expected_output and support_note (or support_notes) must copy verbatim — do not merge into materials; activity_preamble before learner_task."
  ];

  var EPISODE_PLAN_LINES = [
    "- EPISODE PLANS (portable page schema — hard when upstream episode_plans exist): the page artefact MUST be self-describing; carry authoritative instructional choreography on the page itself without requiring workflow captures or session state.",
    "- Top-level episode_plans[] (required when upstream episode_plans were provided): copy each row with activity_id aligned to learning_activities.content[] (map LO-aligned upstream ids to page A ids via mapped_learning_outcomes / composed order when ids differ); each row: activity_id, optional mapped_learning_outcome_ids, episode_plan { archetype, beats: [{ function }] } — copy beats verbatim; do not replan, reorder, or invent beats.",
    "- Per-activity episode_plan (required when upstream episode_plans were provided): attach episode_plan { archetype, beats[] } on each matching learning_activities.content[] row; when upstream plan activity_id differs from the page activity_id, record episode_plan_source_activity_id on the page activity.",
    "- Activity order: learning_activities.content[] order (and learning_sequence timing when present) is the authoritative activity sequence; episode_plans[] must align one plan per composed activity in that order.",
    "- source_artefacts MUST list episode_plans when upstream episode_plans were consumed.",
    "- Episode plans are structural metadata for downstream renderers — not learner-facing section prose; do not dump beat functions into sections[].content bodies."
  ];

  function buildLdDesignPageComposePromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeFieldPreservation = opts.includeFieldPreservation !== false;
    var includeAuthorialExposition = opts.includeAuthorialExposition !== false;
    var materialsCopyBlock = String(opts.materialsCopyBlock || "").trim();
    var tableFidelityBlock = String(opts.tableFidelityBlock || "").trim();
    var authorialExpositionBlock = String(opts.authorialExpositionBlock || "").trim();
    var lines = CORE_LINES.slice().concat(MEMBERSHIP_LINES);
    if (includeFieldPreservation) {
      lines = lines.concat(FIELD_PRESERVATION_LINES);
    }
    lines = lines.concat(EPISODE_PLAN_LINES);
    lines = lines.concat(MATERIALS_BRIDGE_LINES);
    if (materialsCopyBlock) {
      lines.push(materialsCopyBlock);
    }
    if (tableFidelityBlock) {
      lines.push(tableFidelityBlock);
    }
    if (includeAuthorialExposition && authorialExpositionBlock) {
      lines.push(authorialExpositionBlock);
    }
    return lines.join("\n");
  }

  function markerRegex() {
    return /LD-DESIGN-PAGE-COMPOSE-CONTRACT \(auto-applied\)/i;
  }

  function moduleIdInTextRegex() {
    return /LD-DESIGN-PAGE-COMPOSE-CONTRACT \| L0/i;
  }

  function legacyComposePresentRegex() {
    return /design page activity materials fidelity \(auto-applied\)/i;
  }

  function composeAlreadyPresent(text) {
    var body = String(text || "");
    if (markerRegex().test(body) || moduleIdInTextRegex().test(body)) {
      return true;
    }
    return legacyComposePresentRegex().test(body);
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    FIELD_PRESERVATION_FIELD_IDS: FIELD_PRESERVATION_FIELD_IDS,
    EPISODE_PLAN_LINES: EPISODE_PLAN_LINES,
    buildLdDesignPageComposePromptBlock: buildLdDesignPageComposePromptBlock,
    markerRegex: markerRegex,
    moduleIdInTextRegex: moduleIdInTextRegex,
    legacyComposePresentRegex: legacyComposePresentRegex,
    composeAlreadyPresent: composeAlreadyPresent
  };
});
