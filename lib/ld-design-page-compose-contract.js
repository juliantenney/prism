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
    "activity_preamble, learner_task, prior_knowledge_activation, reasoning_orientation, self_explanation_prompt, evidence_use_prompt, argument_structure_hint, conceptual_contrast_prompt, disciplinary_lens, transfer_or_application_task, scaffold_hint_sequence, uncertainty_tension_prompt, study_orientation, intellectual_frame, intellectual_coherence_bridge";

  var CORE_LINES = [
    "",
    MARKER + ":",
    "- Module: " +
      MODULE_ID +
      " | L0–L3 read-only page compose + L5 field preservation. Obey appended LD-MATERIALS-COPY, LD-TABLE-FIDELITY, LD-MATH-RENDER, and LD-GUIDED-LEARNING-SCAFFOLD compose preservation — bodies not repeated here.",
    "- Final learner output (hard): the page artefact is complete learner-facing output — obey LD-MATERIALS-COPY PAGE ARTEFACT IS FINAL LEARNER OUTPUT; embed full material bodies, never references or placeholders."
  ];

  var CONTEXT_ACCESS_RULE_LINES = [
    "- CONTEXT ACCESS RULE (hard): the workflow runs in a single Copilot conversation. Upstream artefacts do not need to be attached again in the current user message.",
    "- If Generate Activity Materials exists earlier in the active conversation, parse activity_materials directly from conversation history — it is available.",
    "- Forbidden unavailability claims unless you have first searched the active conversation for: artifact_type, activity_materials, Generate Activity Materials, Material:, Content:, LO1-TEXT, LO2-SCN — and found none:",
    "  • upstream artefacts are not available",
    "  • activity_materials bodies are not present",
    "  • full material bodies are unavailable",
    "  • current message context lacks the artefacts",
    "- The current user message is not the only context; the active Copilot chat history is context; previous artefacts in the same chat are context.",
    "- Design Page must compose from upstream GAM Content: bodies already present in the conversation."
  ];

  var UPSTREAM_CONSUMPTION_LINES = [
    "- UPSTREAM SOURCE (hard): upstream artefacts are complete outputs from prior workflow steps already present in this Copilot/workflow conversation (each labelled STEP N OUTPUT: <artefact_name>). This step does not receive re-injected artefact bodies from PRISM or the runner — locate and consume the full prior-step output for every bound input.",
  ].concat(CONTEXT_ACCESS_RULE_LINES).concat([
    "- activity_materials: authoritative body is the entire Generate Activity Materials step output. Usual format is pack text with Activity ID / Material: / Purpose: / Content: blocks (not JSON specification stubs or required_materials-only restatement).",
    "- Authoritative GAM content binding (hard): Material/Purpose/type are metadata only; activity.materials.<field> = exact Content: body per LD-MATERIALS-COPY AUTHORITATIVE GAM CONTENT BINDING (embedded below).",
    "- Multi-material enumeration (hard): for each Activity ID, emit one activity.materials.<destination_field> per GAM Material block — obey LD-MATERIALS-COPY MULTI-MATERIAL ENUMERATION INVARIANT; never bind only materials.text when multiple blocks exist.",
    "- Full content body preservation (hard): each activity.materials.<field> equals the entire Content: body until next Material:/Activity:/STEP/EOF — obey LD-MATERIALS-COPY FULL CONTENT BODY PRESERVATION; no first-line, heading-only, or excerpt substitutes.",
    "- Material preservation overrides page optimisation (hard): Content: body is authoritative — obey LD-MATERIALS-COPY MATERIAL PRESERVATION OVERRIDES PAGE OPTIMISATION; never condense, summarise, or substitute descriptions for Content: bodies regardless of page size or rendering practicality.",
    "- Page artefact is final learner output (hard): every required material must be physically present in activity.materials.* — obey LD-MATERIALS-COPY PAGE ARTEFACT IS FINAL LEARNER OUTPUT; no \"Full ... from ...\", upstream references, or material-id placeholders.",
    "- activity.materials opaque transport (hard): each GAM Content: body is uninterpreted payload — obey LD-MATERIALS-COPY OPAQUE PAYLOAD TRANSPORT; do not read scenario/template/worked_example/etc. as structures to regenerate before paste.",
    "- For each Activity ID block, merge every Material Content: section verbatim into the matching learning_activities.content[] row activity.materials.<field> (map material_id to field keys, e.g. LO1_TEXT→text, LO1_TABLE→comparison_table, LO5_CONSOLIDATION→consolidation_summary).",
    "- Copy full markdown bodies: ## / ### headings, every worked-example step, complete pipe-table rows, consolidation and transfer prompts — never substitute synopsis lines (e.g. \"Definitions of…\") when upstream Content: holds full exposition.",
    "- FORBIDDEN: composing material bodies only from learning_activities.required_materials without reading GAM Content:; paraphrasing GAM into catalogue labels; header-only tables without pipe rows when upstream tables exist.",
    "- learning_activities, episode_plans, assessment_items, and other bound artefacts: consume the full matching prior STEP N OUTPUT bodies from conversation — read-only compose; do not replan, respecify, or summarise away upstream bodies."
  ]);

  var MEMBERSHIP_LINES = [
    "- ACTIVITY MEMBERSHIP (hard): every upstream activity_id in learning_activities.content unless generation_notes.activities_omitted[] with explicit user-authorised authority (subset request or workflow constraint) — never omit for output size, token limit, or model length; when upstream activity_materials provides bodies, copy the full materials object onto the matching row (no synopsis, reference-only, placeholder, or catalogue substitution); material bodies are hard constraints — never truncate, summarise, or thin materials to references for output size, token limit, or model length; learning_sequence order/timing only; validate (U \\ X) ⊆ C; assessment_check.content object with items[] when assessment_items provided; record non-material gaps in generation_notes.limitations with explicit reason — never excuse material-body loss via limitations.",
    "- Forbidden compose disclaimer: do not claim that \"full activity material bodies are abbreviated\" (or equivalent) in page artefacts. If full upstream bodies exist, preserve them verbatim in activity.materials.*.",
    "- Forbidden generation_notes rationale: do not state materials were represented in condensed form, condensed for practicality, shortened for page rendering, or summarised for brevity — see LD-MATERIALS-COPY GENERATION NOTES RULE; fail before emit if any material was condensed.",
    "- Incomplete page rule: if the artefact is not the complete final learner-facing page (missing activities, reference-only materials, or dereferenceable content), do not emit it as a valid page — see LD-MATERIALS-COPY PAGE ARTEFACT IS FINAL LEARNER OUTPUT."
  ];

  var FIELD_AUTHORIZING_LINES = [
    "- TRANSPORT VS ARCHIVAL FIELDS: knowledge_summary — transport upstream body when LC/KM provides one; omit section when none. overview / learning_purpose — thin assembly-coherence only (R-40). study_tips — transport upstream closure/debrief bodies only; no synthesis from GAM signals. Section headings — organisation only. learning_activities.content[].materials.* is archival only — obey LD-MATERIALS-COPY TRANSPORT VS ARCHIVAL FIELDS in the L4 preserve embed below.",
    "- PRE-EMIT VALIDATION: before final output, verify every populated activity.materials.* field matches an upstream Material Content: body and is not model-authored; per Activity ID, count(activity.materials keys) equals count(GAM Material blocks) — see LD-MATERIALS-COPY MULTI-MATERIAL ENUMERATION INVARIANT; each field must pass FULL CONTENT BODY PRESERVATION, MATERIAL PRESERVATION OVERRIDES PAGE OPTIMISATION, and PAGE ARTEFACT IS FINAL LEARNER OUTPUT (entire embedded Content: body — not reference, excerpt, summary, or condensed representation)."
  ];

  var MATERIALS_BRIDGE_LINES = [
    "- MATERIALS FIDELITY (compose): copy activity.materials.* verbatim from upstream activity_materials (no paraphrase, shorten, summarise, or rewrite); L4 preserve embed:"
  ];

  var FIELD_PRESERVATION_LINES = [
    "- Activity field preservation (learner-facing page): copy verbatim onto each matching activity_id when present upstream learning_activities (not only activity_materials):",
    "  " + FIELD_PRESERVATION_FIELD_IDS,
    "- learner_task, expected_output, and support_note (or support_notes) must copy verbatim — do not merge into materials, paraphrase, shorten, or label-ify; activity_preamble before learner_task.",
    "- Scaffold fields (reasoning_orientation, conceptual_contrast_prompt, argument_structure_hint, self_explanation_prompt, expected_output, intellectual_coherence_bridge) must remain full learner-facing prose — never compress to metadata labels or arrow chains during compose."
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
    var lines = CORE_LINES.slice().concat(UPSTREAM_CONSUMPTION_LINES).concat(MEMBERSHIP_LINES);
    if (includeFieldPreservation) {
      lines = lines.concat(FIELD_PRESERVATION_LINES);
    }
    lines = lines.concat(EPISODE_PLAN_LINES);
    lines = lines.concat(FIELD_AUTHORIZING_LINES);
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
    UPSTREAM_CONSUMPTION_LINES: UPSTREAM_CONSUMPTION_LINES,
    FIELD_AUTHORIZING_LINES: FIELD_AUTHORIZING_LINES,
    EPISODE_PLAN_LINES: EPISODE_PLAN_LINES,
    buildLdDesignPageComposePromptBlock: buildLdDesignPageComposePromptBlock,
    markerRegex: markerRegex,
    moduleIdInTextRegex: moduleIdInTextRegex,
    legacyComposePresentRegex: legacyComposePresentRegex,
    composeAlreadyPresent: composeAlreadyPresent
  };
});
