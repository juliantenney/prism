/**
 * LD-AUTHORIAL-EXPOSITION — Design Page compose authorial quality (Sprint 42).
 * Lifecycle: canonical (Slice 42-2).
 * Owns: rhetorical role separation, transition quality, framing assimilation, anti-redundancy, voice.
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
      " | Design Page compose only — authorial exposition on wrapper prose (overview, learning_purpose, study_tips, activity_preamble, intellectual_coherence_bridge, cognition-orientation fields, support_note, expected_output).",
    "- Goal: compose a coherent authored learning experience — not a stack of educational components. Preserve all upstream framing fields verbatim; improve how they read when composed.",
    "- Learner arc target: Explanation → Exploration → Reasoning → Reflection → Synthesis — not Orientation → Task → Activity → Checklist.",
    "- Do not add schema fields, workflow steps, or verbosity for its own sake. Educational authorship, not longer text."
  ];

  var ROLE_SEPARATION_LINES = [
    "- RHETORICAL ROLE SEPARATION (each section one job — do not repeat the same idea):",
    "  • overview — establish intellectual journey, stakes, and inquiry arc; not an activity summary or session run-sheet.",
    "  • learning_purpose — explain why this learning matters and what capability develops; not a duplicate overview; outcome bullets allowed only after one connective paragraph.",
    "  • activity_preamble — prepare learner thinking (why this activity now, what move is practised); not procedural first-step instructions (those belong in learner_task).",
    "  • intellectual_coherence_bridge — connect prior reasoning to the next challenge; name the carried distinction and what escalates; not \"reuse the move\" imperatives alone.",
    "  • study_tips / closure — synthesise meaning (what is clearer, what can be sustained, what transfers); not a recap of tasks completed.",
    "  • learner_task — observable actions only; teach before instruct in preamble, not in the task line.",
    "  • support_note — one misconception or evidence guard for the learner; not facilitator choreography."
  ];

  var TRANSITION_LINES = [
    "- TRANSITION QUALITY:",
    "  • Build intellectual momentum — explain why the next activity follows from what the learner just practised.",
    "  • Connect ideas, not only sequence steps or session blocks.",
    "  • Avoid formulaic bridges (\"In this activity you will…\", \"Now complete the table\", \"Reuse the move\" without naming the distinction).",
    "  • Each activity after the first: preamble or bridge must reference prior reasoning in topic-specific prose."
  ];

  var FRAMING_ASSIMILATION_LINES = [
    "- FRAMING ASSIMILATION:",
    "  • Write activity_preamble, reasoning_orientation, self_explanation_prompt, and related cognition fields as teachable instructional prose — not label stubs or stage directions (\"Study the model row\", \"No model row\").",
    "  • Field values must read naturally when rendered in sequence; do not write meta-labels in content (\"Study orientation:\", \"Metacognitive prompt:\", \"Cognition focus:\").",
    "  • Preamble teaches why + capability + journey link; cognition field adds how to think without repeating preamble or learner_task sentences."
  ];

  var ANTI_REDUNDANCY_LINES = [
    "- ANTI-REDUNDANCY:",
    "  • Do not repeat the same orientation sentence across overview, learning_purpose, study_orientation, and activity_preamble.",
    "  • knowledge_summary previews concepts; activities apply them — do not restate the full glossary in each preamble.",
    "  • expected_output states evidence of completion; preamble must not duplicate expected_output wording."
  ];

  var VOICE_SELF_STUDY_LINES = [
    "- VOICE (self-directed / self-study learner page):",
    "  • Explanation before task — teach before instruct.",
    "  • Reflective but authoritative — guide inquiry, not facilitator narration.",
    "  • study_orientation may address sequence, effort, and note-taking — not a second overview."
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
      .concat(FRAMING_ASSIMILATION_LINES)
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
