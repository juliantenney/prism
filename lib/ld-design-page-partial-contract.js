/**
 * Sprint 58 Phase 0 — Design Page partial output contract (vNext-native).
 * Lifecycle: canonical for partialPageOutputs Design Page prompts.
 * Owns: learner-facing title, page_synthesis partial emit instructions; assembly_state envelope;
 *       Design Page visual planning (Sprint 70).
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
  var CONTRACT_VERSION = "70-DP-PARTIAL-2A";

  function buildDesignPagePartialContractBlock() {
    return [
      "",
      MARKER + ":",
      "- Module: " + MODULE_ID + " | Sprint 70 Design Page partial-page contract (" + CONTRACT_VERSION + ")",
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
      "Required learner-facing title:",
      '- title: concise publication-quality resource title naming the subject',
      "- Do not copy the original request/brief as the title",
      '- Forbidden title scaffolding: "Create a…", duration requirements, audience instructions, workflow language',
      "- Title must describe the subject; omit request phrasing",
      "",
      "Required payload (canonical — page_synthesis + Design Page visual planning):",
      "- page_synthesis object with substantive learner-facing wrapper prose",
      '- page_synthesis.knowledge_summary is mandatory (body + format, e.g. format "markdown")',
      "- page_synthesis.overview and page_synthesis.learning_purpose — transport upstream bodies from conversation when present",
      "- page_synthesis.study_tips — transport upstream closure/debrief bodies only; do not synthesize from scratch",
      "",
      "Orientation body hygiene (renderer owns structural labels Overview / Learning purpose / Knowledge summary / Study tips):",
      "- page_synthesis.*.body must contain content only — do not begin with duplicate markdown headings",
      "- Do not start bodies with ## Welcome, ## Overview, ## Learning Purpose, ## Knowledge Summary, or ## Study Tips",
      "- Preferred: \"This self-study resource explores …\" — not \"## Welcome\\n\\nThis self-study resource explores …\"",
      "",
      "Required page-root visual planning (Design Page authoritative — Sprint 38 / Sprint 70):",
      '- visual_affordance_schema_version: "38.4"',
      "- activities_visual_review[] — one object per upstream activity_id with activity_visual_value.decision (high|medium|low|none) and mandatory non-empty activity_visual_value.rationale",
      "- visual_affordances[] — authoritative visual planning rows at page root (use [] if empty)",
      "- Every visual_affordances[] row requires non-empty rationale explaining instructional value (not title/topic restatement); generate rows also require caption_intent, alt_text, and detailed_description from the same semantic specification",
      "- Follow the appended Sprint 38 visual affordance authoring contract for visual_decision, scope, subject, context, evidence_anchors (canonical activity_id.path or page_synthesis.field strings only), visual_slot, rationale, activities_visual_review.rationale, alt_text, detailed_description, and related fields",
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
      "- shell fields: audience, page_profile, learning_outcomes, episode_plans (title is Design Page owned — emit the learner-facing title)",
      "- activities[] regeneration or activities[].materials[] bodies (already owned by GAM partial)",
      "- renaming activities[] or changing activities[].title (DLA owns the final learner-facing activity title; page-level title is separate)",
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
      '"title": "Concise learner-facing resource title",',
      '"assembly_state": { "current_stage": "design_page", "enriched_by": ["design_page"] }',
      '"page_synthesis": {',
      '  "overview": { "body": "Content only — no ## Welcome / ## Overview heading.", "format": "markdown" },',
      '  "learning_purpose": { "body": "...", "format": "markdown" },',
      '  "knowledge_summary": { "body": "Substantive concept synthesis — not a glossary dump.", "format": "markdown" },',
      '  "study_tips": { "body": "...", "format": "markdown" }',
      "}",
      '"visual_affordance_schema_version": "38.4",',
      '"activities_visual_review": [],',
      '"visual_affordances": []',
      "",
      "Forbidden in Design Page partial:",
      "- activities[] with material bodies",
      "- non-owned shell fields (audience, page_profile, learning_outcomes, episode_plans)",
      "- full-page replay",
      "- sections[] unless explicitly mirroring page_synthesis",
      "- request/brief phrasing used as title"
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
