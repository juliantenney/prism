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
    "- ACTIVITY MEMBERSHIP (hard): every upstream activity_id in learning_activities.content unless generation_notes.activities_omitted[] with explicit user-authorised authority (subset request or workflow constraint) — never omit for output size, token limit, or model length; when upstream activity_materials provides bodies, copy the full materials object onto the matching row (no synopsis, reference-only, placeholder, or catalogue substitution); material bodies are hard constraints — never truncate, summarise, or thin materials to references for output size, token limit, or model length; learning_sequence order/timing only; validate (U \\ X) ⊆ C; assessment_check.content object with items[] when assessment_items provided."
  ];

  var MATERIALS_BRIDGE_LINES = [
    "- MATERIALS FIDELITY (compose): visual_affordances[] are additive page-root metadata only — must not replace learning_activities.content[].materials; representation_avoid / duplicate rules on generated figures only; copy activity.materials.* verbatim from upstream activity_materials (no paraphrase, shorten, summarise, or rewrite); L4 preserve embed:"
  ];

  var FIELD_PRESERVATION_LINES = [
    "- Activity field preservation (learner-facing page): copy verbatim onto each matching activity_id when present upstream learning_activities (not only activity_materials):",
    "  " + FIELD_PRESERVATION_FIELD_IDS,
    "- expected_output and support_note (or support_notes) must copy verbatim — do not merge into materials; activity_preamble before learner_task."
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
    buildLdDesignPageComposePromptBlock: buildLdDesignPageComposePromptBlock,
    markerRegex: markerRegex,
    moduleIdInTextRegex: moduleIdInTextRegex,
    legacyComposePresentRegex: legacyComposePresentRegex,
    composeAlreadyPresent: composeAlreadyPresent
  };
});
