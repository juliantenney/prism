/**
 * Sprint 58 Phase 0 — Design Page partial output contract (vNext-native).
 * Lifecycle: canonical for partialPageOutputs Design Page prompts.
 * Owns: page_synthesis partial emit instructions; assembly_state envelope.
 * Does not duplicate: LD-DESIGN-PAGE-COMPOSE-CONTRACT (rollback/legacy), LD-MATERIALS-COPY, activity/material regeneration.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_DESIGN_PAGE_PARTIAL_CONTRACT = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-DESIGN-PAGE-PARTIAL-CONTRACT";
  var MARKER = "LD-DESIGN-PAGE-PARTIAL-CONTRACT (auto-applied)";
  var CONTRACT_VERSION = "58-DP-PARTIAL-0";

  function buildDesignPagePartialContractBlock() {
    return [
      "",
      MARKER + ":",
      "- Module: " + MODULE_ID + " | Sprint 58 vNext Design Page partial-page contract (" + CONTRACT_VERSION + ")",
      "",
      "Output a partial v2 page artefact for Design Page owned fields only.",
      "Do not return a full-page replay. Materials and activities are already hydrated upstream — PRISM assembles the final page deterministically.",
      "",
      "Required top-level envelope:",
      '- artifact_type: "page"',
      '- schema_version: "2.0.0"',
      '- assembly_state.current_stage: "design_page"',
      '- assembly_state.enriched_by must include "design_page"',
      "",
      "Required payload (canonical — page_synthesis):",
      "- page_synthesis object with substantive learner-facing wrapper prose",
      '- page_synthesis.knowledge_summary is mandatory (body + format, e.g. format "markdown")',
      "- page_synthesis.overview and page_synthesis.learning_purpose — transport upstream bodies from conversation when present",
      "- page_synthesis.study_tips — transport upstream closure/debrief bodies only; do not synthesize from scratch",
      "",
      "sections[] is optional:",
      "- Do not emit sections[] unless a downstream consumer explicitly requires mirrored section rows",
      "- When page_synthesis fields are populated, sections[] is not required",
      "- If sections[] is emitted, mirror page_synthesis bodies only — do not duplicate or regenerate activity content",
      "",
      "Use Copilot conversation context for upstream instructional content (DLA, GAM, LS, LC, KM, LO).",
      "PRISM does not embed stored prior step outputs in partial mode.",
      "",
      "Explicitly forbidden:",
      "- full-page replay",
      "- shell fields: title, audience, page_profile, learning_outcomes, episode_plans",
      "- activities[] regeneration or activities[].materials[] bodies (already owned by GAM partial)",
      "- learning_sequence / assessment_check regeneration",
      "- resolving activity_materials from chat or re-copying GAM Content: blocks",
      "- preserving or reconstructing non–Design-Page stage fields in this JSON",
      "",
      "Wrapper-gap fallback only: obey appended LD-THIN-ASSEMBLY-COHERENCE-CONTRACT when upstream wrapper bodies are absent — minimal, capped.",
      "",
      "Return one pretty-printed fenced JSON page artefact. Footer: STEP N OUTPUT: page"
    ].join("\n");
  }

  function buildCanonicalDesignPagePartialShapeSnippet() {
    return [
      "Canonical Design Page partial shape (page_synthesis-first):",
      "",
      '"artifact_type": "page"',
      '"schema_version": "2.0.0"',
      '"assembly_state": { "current_stage": "design_page", "enriched_by": ["design_page"] }',
      '"page_synthesis": {',
      '  "overview": { "body": "...", "format": "markdown" },',
      '  "learning_purpose": { "body": "...", "format": "markdown" },',
      '  "knowledge_summary": { "body": "Substantive concept synthesis — not a glossary dump.", "format": "markdown" }',
      '  "study_tips": { "body": "...", "format": "markdown" }',
      "}",
      "",
      "Forbidden in Design Page partial:",
      "- activities[] with material bodies",
      "- shell top-level fields",
      "- full-page replay",
      "- sections[] unless explicitly mirroring page_synthesis"
    ].join("\n");
  }

  function markerRegex() {
    return /LD-DESIGN-PAGE-PARTIAL-CONTRACT \(auto-applied\)/i;
  }

  function partialContractAlreadyPresent(text) {
    return markerRegex().test(String(text || ""));
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    CONTRACT_VERSION: CONTRACT_VERSION,
    buildDesignPagePartialContractBlock: buildDesignPagePartialContractBlock,
    buildCanonicalDesignPagePartialShapeSnippet: buildCanonicalDesignPagePartialShapeSnippet,
    markerRegex: markerRegex,
    partialContractAlreadyPresent: partialContractAlreadyPresent
  };
});
