/**
 * LD-JOURNEY-ASSIMILATION — Design Page compose journey expression (Sprint 42-6).
 * Lifecycle: canonical (Slice 42-6).
 * Owns: upstream signal assimilation into wrapper prose (overview, purpose, summary, transitions, closure).
 * Does not duplicate: materials fidelity, field preservation, repair, EQF, PEL, LD-AUTHORIAL-EXPOSITION bodies.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_JOURNEY_ASSIMILATION = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-JOURNEY-ASSIMILATION";
  var MARKER = "LD-JOURNEY-ASSIMILATION-CONTRACT (auto-applied)";

  var CORE_LINES = [
    "",
    MARKER + ":",
    "- Module: " +
      MODULE_ID +
      " | Design Page compose only — assimilate existing upstream journey signals into wrapper/page-level prose (overview, learning_purpose, knowledge_summary, study_tips, and high-level section framing).",
    "- Goal: express Question → Investigation → Evidence → Judgement — not Activity → Activity → Activity. Shape wrapper composition around preserved GAM materials; never rewrite, compress, or mutate activity.materials.* bodies.",
    "- Scope: wrapper/page-level sections only. Obey LD-MATERIALS-COPY PREC-02 and LD-AUTHORIAL-EXPOSITION PRESERVATION BOUNDARY — journey assimilation does not override materials fidelity or verbatim preservation of activity-row/PEL fields."
  ];

  var UPSTREAM_SIGNAL_LINES = [
    "- UPSTREAM SIGNALS (use bound captures when present; do not invent journey not supported by artefacts):",
    "  • learning_content — central inquiry, section progression, explanatory stakes; lift governing question and intellectual arc for overview.",
    "  • knowledge_model — concepts, relationships, processes, misconceptions; derive knowledge_summary as orienting conceptual problem (not glossary dump); name use_in_activities links where helpful.",
    "  • learning_outcomes — capability progression across the resource; connect learning_purpose to how understanding develops.",
    "  • learning_activities — infer progression signals from ordered activities and preserved framing fields to shape wrapper-level inquiry and synthesis only (do not rewrite activity-row fields).",
    "  • activity_materials — closure, debrief, transfer prompts, consolidation, judgement scaffolds in materials (reference in study_tips; copy bodies verbatim per L4).",
    "  • learning_sequence — timeline order/duration for activity flow; assimilate transition_to_next and phase_type into overview, optional learning_sequence/timeline section phrasing, and study_tips synthesis (not into activity-row or materials fields)."
  ];

  var OVERVIEW_PURPOSE_LINES = [
    "- OVERVIEW:",
    "  • Establish the central inquiry and intellectual journey — stakes, tension, and what the learner will be able to judge by the end.",
    "  • Do not list activities, durations, or task run-sheets; name inquiry moves (orient → distinguish → test → integrate → judge → transfer) when upstream supports them.",
    "- LEARNING PURPOSE:",
    "  • Explain how understanding develops across the resource — what capability deepens from first to last activity.",
    "  • Connect each phase to the larger inquiry; outcome bullets only after one connective paragraph."
  ];

  var KNOWLEDGE_SUMMARY_LINES = [
    "- KNOWLEDGE SUMMARY (when learning_content or knowledge_model captures are bound, or upstream implies concepts):",
    "  • Orient the learner to the conceptual problem and key distinctions — preview how ideas will be used in activities.",
    "  • Avoid glossary-style repetition; include relationships or use_in_activities cues when KM/LC provide them.",
    "  • Do not restate full activity materials or duplicate overview prose."
  ];

  var TRANSITION_LINES = [
    "- WRAPPER TRANSITIONS:",
    "  • Make intellectual movement visible at wrapper/page level — why this stage follows the previous one and what reasoning carries forward.",
    "  • When learning_sequence.timeline[] is bound, use transition_to_next and phase_type only for overview, optional learning_sequence/timeline wording, and study_tips synthesis; do not rewrite activity_preamble, intellectual_coherence_bridge, or other preserved activity-row fields.",
    "  • Prefer cumulative progression: each stage should feel like evidence or capability accumulated for the next judgement.",
    "  • Preserve activity-row and PEL/cognition fields verbatim when present upstream; journey assimilation does not improve, restyle, or reinterpret preserved field text."
  ];

  var VOICE_LINES = [
    "- JOURNEY VOICE (prefer inquiry, investigation, judgement):",
    "  • Prefer: Having distinguished… / You can now investigate… / This prepares you to evaluate… / The next stage tests… / The final step is to weigh… / Your earlier analysis now becomes evidence for…",
    "  • Avoid as primary organising voice: Next complete… / Then do… / Activity 2 asks you to… / After finishing the task…"
  ];

  var CLOSURE_LINES = [
    "- CLOSURE / STUDY TIPS:",
    "  • Draw on upstream consolidation, transfer, debrief, and judgement structures from GAM and DLA transfer_or_application_task when present — without rewriting preserved activity-row fields.",
    "  • Synthesise what should now be clearer, what distinction can be sustained, and what transfers — concluded inquiry, not merely finished tasks.",
    "  • At least one epistemic synthesis bullet; avoid diary tone (reflect on your learning, well done)."
  ];

  function buildLdJourneyAssimilationPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? CORE_LINES.slice() : CORE_LINES.slice(2);
    lines = lines
      .concat(UPSTREAM_SIGNAL_LINES)
      .concat(OVERVIEW_PURPOSE_LINES)
      .concat(KNOWLEDGE_SUMMARY_LINES)
      .concat(TRANSITION_LINES)
      .concat(VOICE_LINES)
      .concat(CLOSURE_LINES);
    return lines.join("\n");
  }

  function markerRegex() {
    return /LD-JOURNEY-ASSIMILATION-CONTRACT \(auto-applied\)/i;
  }

  function assimilationAlreadyPresent(text) {
    return markerRegex().test(String(text || ""));
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    buildLdJourneyAssimilationPromptBlock: buildLdJourneyAssimilationPromptBlock,
    markerRegex: markerRegex,
    assimilationAlreadyPresent: assimilationAlreadyPresent
  };
});

