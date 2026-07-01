/**
 * LD-SELF-DIRECTED-RHETORIC — canonical L5/L7 self-directed learner-page rhetoric (Sprint 38-B Wave 1).
 * Lifecycle: canonical (Wave 1 exit, 2026-06-04); Design Page scope aligned Sprint 49-C3b.
 * Taxonomy: clusters 1, 11; layers L5 + L7 ([38B-2]).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_SELF_DIRECTED_RHETORIC = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-SELF-DIRECTED-RHETORIC";
  var MARKER = "LD-SELF-DIRECTED-RHETORIC (auto-applied)";

  var SHARED_LINES = [
    "",
    MARKER + ":",
    "- Module: " +
      MODULE_ID +
      " | Layers: L5 (orientation, progression, closure), L7 (learner voice) | Clusters: 1, 11",
    "- Precedence: L4 LD-MATERIALS-COPY / LD-TABLE-FIDELITY and L7 LD-MATH-RENDER override rhetoric — never summarise activity.materials or thin materials for overview; overview/learning_purpose frame journey only.",
    "- PRESERVATION BOUNDARY (Design Page compose): copy activity-row, PEL/cognition, support_note, learner_task, expected_output, and activity.materials.* verbatim per LD-DESIGN-PAGE-COMPOSE and LD-AUTHORIAL-EXPOSITION PRESERVATION BOUNDARY — rhetoric does not rewrite, restyle, assimilate, or improve preserved fields.",
    "- Facilitator ban: no Welcome to this module, In this session we will, explore the topic, timing choreography, or tutor/facilitator voice in learner-visible fields."
  ];

  var WRAPPER_RHETORIC_LINES = [
    "- Scope (wrapper/page-level prose): overview, learning_purpose, knowledge_summary, study_tips, high-level inquiry framing, and optional learning_sequence wrapper prose — not materials bodies or preserved activity-row fields.",
    "- Session journey: overview and/or learning_purpose frame a coherent intellectual journey (stakes, one why-this-is-hard tension, intellectual modes, how activities build).",
    "- Difficulty types: conceptual difficulty, procedural difficulty, interpretive ambiguity, disciplinary uncertainty, competing explanations, plausible misconception — not generic challenging-topic filler.",
    "- Progression: cumulative reasoning journeys; phase vocabulary orienting → distinguishing → testing → integrating → judging → transferring — no facilitator narration (now you will, in this session we will).",
    "- Closure: study_tips 2–4 bullets with at least ONE epistemic synthesis (what should now be clearer; what distinction can now be sustained); Explicitly avoid: reflect on your learning, well done, diary tone.",
    "- knowledge_summary previews at start only."
  ];

  var DLA_AUTHORING_LINES = [
    "- Scope (DLA authoring): learner_task, expected_output, support_note, activity_preamble, and cognition-orientation fields on learning_activities — field semantics at generation; preserve verbatim on Design Page compose.",
    "- Learner voice: learner_task uses observable learner verbs and states actions on materials; expected_output is 30–70 words describing evidence of completion, format, scope, depth, and quality threshold the learner could meet — not a deliverable label; support_note is a 20–70 word misconception or evidence guard — not tutoring.",
    "- purpose names the learning move; activity_preamble orients without duplicating learner_task; preserve support_note, expected_output, activity_preamble on pages — do not merge into materials.",
    "- Assessment: stems require decision, justification, or interpretation; formative MCQ sets use numbered sub-questions for multi-step reasoning.",
    "- Worked example / fading: sequence modelled reasoning → faded partial completion → independent transfer when the brief allows; label ### Worked example or model rows; do not pre-fill entire tables outside the modelled material.",
    "- intellectual_coherence_bridge and cognition-orientation field definitions: see OUTPUT CONTRACT on Design Learning Activities; preserve on Design Page compose.",
    "- Misconception: Check your thinking: in support_note (reactive); overview names proactive tension — do not repeat the overview tension verbatim in support_note; prompt_set self-check bullets; no adaptive feedback or answer keys in independent activities.",
    "- Concept/procedure: step → meaning lines and Use this when… cues in materials; learner_task states procedure + conceptual question; expected_output requires interpretation not completion-only.",
    "- study_orientation adds working guidance only — do not repeat the full overview.",
    "- Transfer: transfer_or_application_task names named move + changed context; optional limit of transfer (e.g. mechanism evidence does not transfer to policy judgement); What changed in your understanding? / hardest to justify? acceptable closure cues.",
    "- Final activity expected_output requires evaluative judgement; ### Closure or ### Debrief sections must meet GAM-PRES-08 transfer/closure minima (substantive epistemic judgement and transfer_prompt ≥80 words when specified) — not minimal bullet stubs."
  ];

  var GAM_AUTHORING_LINES = [
    "- Scope (GAM authoring): realise closure, debrief, misconception checks, and concept/procedure integration in material bodies — full learner-facing prose per upstream required_materials.",
    "- Pattern and depth: INSTRUCTIONAL-PATTERN-SP blocks for type shape; pack GAM-PRES-08/09 for depth floors."
  ];

  var GAM_SHARED_LINES = [
    "",
    MARKER + ":",
    "- Module: " +
      MODULE_ID +
      " | Layers: L5, L7 | Clusters: 1, 11 | Role: GAM",
    "- Precedence: L4 LD-MATERIALS-COPY / LD-TABLE-FIDELITY and L7 LD-MATH-RENDER override rhetoric.",
    "- Facilitator-ban and learner material voice: authoritative owner is Self-directed learner-page self-study materials (material voice) — not this block.",
    "- Depth and closure minima: pack GAM-PRES-08/09 authoritative."
  ];

  var ROLE_RIDERS = {
    design_page: [
      "- Design Page rider: shape overview/learning_purpose/knowledge_summary/study_tips from upstream journey and orientation substance — wrapper/page-level prose only.",
      "- Journey assimilation: when LD-JOURNEY-ASSIMILATION is appended, follow it for inquiry arc, knowledge_summary orientation, learning_sequence transitions, and closure synthesis — wrapper prose only; materials bodies stay L4-preserved."
    ],
    gam: [
      "- GAM rider: realise upstream required_materials specifications as full learner-facing prose — not outline labels."
    ],
    assessment: [
      "- Assessment rider: judgement-oriented stems and one-sentence explanations linking procedure to concept on items and feedback."
    ],
    dla: []
  };

  function buildLdSelfDirectedRhetoricPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var role = String(opts.role || "core").toLowerCase();
    var lines = includeMarker ? SHARED_LINES.slice() : SHARED_LINES.slice(2);
    if (role === "design_page") {
      lines = lines.concat(WRAPPER_RHETORIC_LINES).concat(ROLE_RIDERS.design_page);
    } else if (role === "gam") {
      lines = includeMarker ? GAM_SHARED_LINES.slice() : GAM_SHARED_LINES.slice(2);
      lines = lines.concat(GAM_AUTHORING_LINES).concat(ROLE_RIDERS.gam);
    } else if (role === "assessment") {
      lines = lines.concat([
        "- Assessment: stems require decision, justification, or interpretation; formative MCQ sets use numbered sub-questions for multi-step reasoning."
      ]).concat(ROLE_RIDERS.assessment);
    } else {
      lines = lines.concat(WRAPPER_RHETORIC_LINES).concat(DLA_AUTHORING_LINES);
      if (role === "dla" && ROLE_RIDERS.dla.length) {
        lines = lines.concat(ROLE_RIDERS.dla);
      }
    }
    return lines.join("\n");
  }

  function markerRegex() {
    return /LD-SELF-DIRECTED-RHETORIC \(auto-applied\)/i;
  }

  function legacyRhetoricMarkerRegex() {
    return /learner-action rhetoric \(auto-applied\)|worked-example and faded-support \(auto-applied\)|embedded feedback and misconception interruption \(auto-applied\)|concept\/procedure integration \(auto-applied\)|metacognitive closure and evaluative judgement \(auto-applied\)|session orientation rhetoric \(auto-applied\)|conceptual tension and difficulty framing \(auto-applied\)|intellectual progression signalling \(auto-applied\)|epistemic synthesis and closure \(auto-applied\)|transfer and durable understanding \(auto-applied\)/i;
  }

  function moduleIdInTextRegex() {
    return /LD-SELF-DIRECTED-RHETORIC \| Layers: L5/i;
  }

  function rhetoricAlreadyPresent(text) {
    var body = String(text || "");
    if (markerRegex().test(body) || moduleIdInTextRegex().test(body)) return true;
    return legacyRhetoricMarkerRegex().test(body);
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    buildLdSelfDirectedRhetoricPromptBlock: buildLdSelfDirectedRhetoricPromptBlock,
    markerRegex: markerRegex,
    legacyRhetoricMarkerRegex: legacyRhetoricMarkerRegex,
    moduleIdInTextRegex: moduleIdInTextRegex,
    rhetoricAlreadyPresent: rhetoricAlreadyPresent
  };
});
