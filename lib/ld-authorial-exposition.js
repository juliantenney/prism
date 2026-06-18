/**
 * LD-AUTHORIAL-EXPOSITION — Design Page compose authorial quality (Sprint 42).
 * Lifecycle: canonical (Slice 42-2); scope narrowed Sprint 49-C1.
 * Owns: rhetorical role separation, transition quality, wrapper voice — overview, learning_purpose, knowledge_summary, study_tips.
 * Does not duplicate: field preservation, materials fidelity, EQF, PEL, mandatory framing minimums.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_AUTHORIAL_EXPOSITION = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-AUTHORIAL-EXPOSITION";
  var MARKER = "LD-AUTHORIAL-EXPOSITION-CONTRACT (auto-applied)";

  var CORE_LINES = [
    "",
    MARKER + ":",
    "- Module: " +
      MODULE_ID +
      " | Design Page compose only — authorial exposition on page wrapper prose (overview, learning_purpose, knowledge_summary, study_tips, and high-level section framing).",
    "- Goal: compose a coherent authored learning experience — not a stack of educational components. Shape wrapper prose for clarity and journey; do not rewrite, compress, summarise, or reinterpret preserved activity-row or material fields (see PRESERVATION BOUNDARY).",
    "- Learner arc target: Explanation → Exploration → Reasoning → Reflection → Synthesis — not Orientation → Task → Activity → Checklist.",
    "- Do not add schema fields, workflow steps, or verbosity for its own sake. Educational authorship, not longer text."
  ];

  var ROLE_SEPARATION_LINES = [
    "- RHETORICAL ROLE SEPARATION (wrapper sections only — each section one job):",
    "  • overview — establish intellectual journey, stakes, and inquiry arc; not an activity summary or session run-sheet.",
    "  • learning_purpose — explain why this learning matters and what capability develops; not a duplicate overview; outcome bullets allowed only after one connective paragraph.",
    "  • knowledge_summary — preview concepts for the session; activities apply them — do not restate the full glossary in each activity block.",
    "  • study_tips / closure — synthesise meaning (what is clearer, what can be sustained, what transfers); not a recap of tasks completed."
  ];

  var TRANSITION_LINES = [
    "- TRANSITION QUALITY (wrapper and learning_sequence prose):",
    "  • Build intellectual momentum across the page arc — connect overview, purpose, and closure.",
    "  • Connect ideas, not only sequence steps or session blocks.",
    "  • Avoid formulaic openers in wrapper prose (\"In this activity you will…\", \"Now complete the table\")."
  ];

  var PRESERVATION_BOUNDARY_LINES = [
    "- PRESERVATION BOUNDARY (LD-DESIGN-PAGE-COMPOSE owns these — authorial polish does not apply):",
    "  • Copy verbatim when present upstream: activity_preamble, learner_task, expected_output, support_note, all cognition-orientation fields in compose field preservation, and activity.materials.* / activity_materials bodies.",
    "  • Do not rewrite, compress, summarise, paraphrase, or reinterpret preserved fields to improve prose or shorten the page.",
    "  • LD-AUTHORIAL-EXPOSITION does not assimilate or restyle activity-row or material content — wrapper sections only."
  ];

  var ANTI_REDUNDANCY_LINES = [
    "- ANTI-REDUNDANCY (wrapper sections only):",
    "  • Do not repeat the same orientation sentence across overview and learning_purpose.",
    "  • knowledge_summary previews concepts; do not duplicate overview inquiry arc in study_tips."
  ];

  var VOICE_SELF_STUDY_LINES = [
    "- VOICE (self-directed / self-study learner page):",
    "  • Explanation before task — teach in wrapper prose before activities present learner_task.",
    "  • Reflective but authoritative — guide inquiry, not facilitator narration."
  ];

  var VOICE_WORKSHOP_LINES = [
    "- VOICE (facilitated workshop learner handout / page):",
    "  • Collaborative inquiry and reasoning — group discussion is allowed in learner_task and materials.",
    "  • No facilitator choreography on learner page: forbid circulate, minutes 5–12, debrief timing, offer worked example if groups stall, tutor moves in support_note.",
    "  • Orient learners to what to think about together — not how the tutor will manage the room."
  ];

  function buildLdAuthorialExpositionPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var facilitated = !!opts.facilitated;
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? CORE_LINES.slice() : CORE_LINES.slice(2);
    lines = lines
      .concat(ROLE_SEPARATION_LINES)
      .concat(TRANSITION_LINES)
      .concat(PRESERVATION_BOUNDARY_LINES)
      .concat(ANTI_REDUNDANCY_LINES);
    if (facilitated) {
      lines = lines.concat(VOICE_WORKSHOP_LINES);
    } else {
      lines = lines.concat(VOICE_SELF_STUDY_LINES);
    }
    return lines.join("\n");
  }

  function markerRegex() {
    return /LD-AUTHORIAL-EXPOSITION-CONTRACT \(auto-applied\)/i;
  }

  function expositionAlreadyPresent(text) {
    return markerRegex().test(String(text || ""));
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    buildLdAuthorialExpositionPromptBlock: buildLdAuthorialExpositionPromptBlock,
    markerRegex: markerRegex,
    expositionAlreadyPresent: expositionAlreadyPresent
  };
});
