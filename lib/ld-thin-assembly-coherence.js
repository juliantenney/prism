/**
 * LD-THIN-ASSEMBLY-COHERENCE — Design Page thin assembly-coherence bridge (Sprint 56C Wave 2).
 * Lifecycle: canonical (W2.3A contract).
 * Owns: minimal navigation, sequencing, structural framing — wrapper-gap fallback only (R-40, R-44, R-45, R-47).
 * Does not duplicate: LD-DESIGN-PAGE-COMPOSE preserve/embed, LD-MATERIALS-COPY archival transport, removed wrapper stack.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_THIN_ASSEMBLY_COHERENCE = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-THIN-ASSEMBLY-COHERENCE";
  var MARKER = "LD-THIN-ASSEMBLY-COHERENCE-CONTRACT (auto-applied)";
  var NAVIGATION_POINTER_WORD_CAP = 80;
  var TRANSITION_GLUE_WORD_CAP = 60;

  var CORE_LINES = [
    "",
    MARKER + ":",
    "- Module: " +
      MODULE_ID +
      " | Layer 3 — sole Design Page generative prose contract | Clusters: assembly-coherence (R-40, R-44, R-45, R-47)",
    "- Scope: minimal navigation, sequencing, and structural framing after upstream bodies are bound to final membership and order — wrapper-gap fallback only.",
    "- Precedence: obey appended LD-DESIGN-PAGE-COMPOSE-CONTRACT and embedded LD-MATERIALS-COPY / LD-TABLE-FIDELITY preserve roles — this block does not override archival transport or field preservation."
  ];

  var TRANSPORT_FIRST_LINES = [
    "- TRANSPORT-FIRST (hard — apply before any bridge fallback):",
    "  1. Bind upstream bodies to wrapper slots verbatim when present (learning_content, learning_outcomes, knowledge_model, learning_sequence).",
    "  2. knowledge_summary — transport upstream LC/KM body when bound; omit section when none (OQ-17). Bridge must not author.",
    "  3. study_tips — transport upstream GAM closure/debrief bodies when present; omit when none. Bridge must not author or synthesize.",
    "  4. overview / learning_purpose — transport upstream body verbatim when present.",
    "  5. Emit bridge fallback prose only where a wrapper slot remains empty after transport — if no gap exists, omit bridge prose entirely.",
    "  6. Never override, paraphrase, or replace transported wrapper text for coherence."
  ];

  var ALLOWED_OUTPUT_LINES = [
    "- ALLOWED OUTPUTS (wrapper-gap fallback only):",
    "  • overview — navigation pointer only when no upstream overview body exists (what this assembled page contains; where to start).",
    "  • learning_purpose — structural orientation only when no upstream learning_purpose body exists (how activities are ordered on this page — not capability teaching).",
    "  • Section headings — organisational labels on sections[] (structure, not lessons).",
    "  • Short sequencing pointers — composed activity order / section flow after membership closure.",
    "  • Source / membership signalling — which upstream artefacts were consumed; activities_omitted[] when applicable (metadata tone, not prose teaching).",
    "  • Verbatim upstream transition placement — when learning_sequence.timeline[].transition_to_next exists, place text verbatim in permitted wrapper slot; do not paraphrase."
  ];

  var VOLUME_CAP_LINES = [
    "- VOLUME CAPS (bridge-generated prose only — no cap on verbatim upstream transport):",
    "  • overview / learning_purpose bridge fallback: ≤ " +
      NAVIGATION_POINTER_WORD_CAP +
      " words per affected section — minimal navigation pointer.",
    "  • Cross-activity transition glue in wrapper: ≤ " +
      TRANSITION_GLUE_WORD_CAP +
      " words per insert — navigational continuity only.",
    "  • If transport fills a slot, do not add bridge prose to that slot."
  ];

  var SLOT_DISCIPLINE_LINES = [
    "- WRAPPER SLOT DISCIPLINE (R-44 / R-47):",
    "  • overview — page-level navigation: what the resource contains and entry point; not an activity summary or session run-sheet.",
    "  • learning_purpose — structural role of the purpose section on this composed page; not a duplicate overview; not outcome teaching.",
    "  • Do not repeat the same upstream substance in overview and learning_purpose.",
    "  • One rhetorical job per wrapper section — structural framing only."
  ];

  var SEQUENCING_LINES = [
    "- SEQUENCING (R-40):",
    "  • Reference composed learning_activities.content[] order — authoritative sequence after membership closure.",
    "  • When learning_sequence is bound, use timeline for order/timing signals only — prefer verbatim transition_to_next for continuity text.",
    "  • FORBIDDEN transition glue: scheduling-only filler (Next complete…, Then do Activity 2…, Move to the next task…, In this session we will…)."
  ];

  var PRESERVATION_LINES = [
    "- PRESERVATION (hard):",
    "  • activity.materials.*, activity-row scaffold fields, episode_plan beats, and assessment items — transport verbatim per compose contract; bridge does not read GAM Content: to summarise into wrapper prose.",
    "  • intellectual_coherence_bridge, activity_preamble, learner_task, cognition-orientation fields — DLA-owned; copy verbatim on activity rows; never assimilate into overview or learning_purpose.",
    "  • Never condense, summarise, paraphrase, or optimise GAM, DLA, episode, or assessment payloads for page size or readability."
  ];

  var PROHIBITED_LINES = [
    "- PROHIBITED (hard — even when wrapper gap exists):",
    "  • Teaching, instructional explanations, concept exposition, or learning guidance.",
    "  • Summaries of materials, activities, knowledge model, or learning content.",
    "  • knowledge_summary or study_tips synthesis or authoring.",
    "  • Rhetoric, voice polish, learner-arc authoring, journey assimilation, or authorial exposition.",
    "  • EDUCATIONAL-QUALITY-FRAMEWORK augmentation on Design Page.",
    "  • Visual affordance generation, schema 38.4 mandates, or VA row authoring.",
    "  • Generating or rewriting intellectual_coherence_bridge on activity rows.",
    "  • Row-field assimilation — do not improve, restyle, or merge preserved activity-row fields into wrapper prose.",
    "  • Facilitator choreography, session timing, or tutor voice in learner page_profile wrapper sections.",
    "  • Epistemic closure bullets, task recap lists, or what-you-should-now-understand synthesis in wrapper slots."
  ];

  function buildLdThinAssemblyCoherencePromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? CORE_LINES.slice() : CORE_LINES.slice(2);
    lines = lines
      .concat(TRANSPORT_FIRST_LINES)
      .concat(ALLOWED_OUTPUT_LINES)
      .concat(VOLUME_CAP_LINES)
      .concat(SLOT_DISCIPLINE_LINES)
      .concat(SEQUENCING_LINES)
      .concat(PRESERVATION_LINES)
      .concat(PROHIBITED_LINES);
    return lines.join("\n");
  }

  function markerRegex() {
    return /LD-THIN-ASSEMBLY-COHERENCE-CONTRACT \(auto-applied\)/i;
  }

  function moduleIdInTextRegex() {
    return /LD-THIN-ASSEMBLY-COHERENCE \| Layer 3/i;
  }

  function coherenceAlreadyPresent(text) {
    var body = String(text || "");
    return markerRegex().test(body) || moduleIdInTextRegex().test(body);
  }

  function isThinAssemblyCoherenceTargetStep(context) {
    var ctx = context && typeof context === "object" ? context : {};
    var canonicalId = String(ctx.stepCanonicalStepId || "").toLowerCase().trim();
    if (canonicalId === "step_design_page") return true;
    var title = String(ctx.stepCanonicalTitle || ctx.stepTitle || "")
      .toLowerCase()
      .trim();
    return title === "design page" || title.indexOf("design page") !== -1;
  }

  function applyLdThinAssemblyCoherenceContractToDraft(draft, context) {
    var draftBody = String(draft || "").trim();
    if (!draftBody) return "";
    if (!isThinAssemblyCoherenceTargetStep(context)) return draftBody;
    if (coherenceAlreadyPresent(draftBody)) return draftBody;
    return (draftBody + buildLdThinAssemblyCoherencePromptBlock({ context: context })).trim();
  }

  var LD_THIN_ASSEMBLY_COHERENCE_CONTRACT = {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    NAVIGATION_POINTER_WORD_CAP: NAVIGATION_POINTER_WORD_CAP,
    TRANSITION_GLUE_WORD_CAP: TRANSITION_GLUE_WORD_CAP,
    buildLdThinAssemblyCoherencePromptBlock: buildLdThinAssemblyCoherencePromptBlock,
    markerRegex: markerRegex,
    moduleIdInTextRegex: moduleIdInTextRegex,
    coherenceAlreadyPresent: coherenceAlreadyPresent,
    isThinAssemblyCoherenceTargetStep: isThinAssemblyCoherenceTargetStep
  };

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    NAVIGATION_POINTER_WORD_CAP: NAVIGATION_POINTER_WORD_CAP,
    TRANSITION_GLUE_WORD_CAP: TRANSITION_GLUE_WORD_CAP,
    LD_THIN_ASSEMBLY_COHERENCE_CONTRACT: LD_THIN_ASSEMBLY_COHERENCE_CONTRACT,
    buildLdThinAssemblyCoherencePromptBlock: buildLdThinAssemblyCoherencePromptBlock,
    applyLdThinAssemblyCoherenceContractToDraft: applyLdThinAssemblyCoherenceContractToDraft,
    markerRegex: markerRegex,
    moduleIdInTextRegex: moduleIdInTextRegex,
    coherenceAlreadyPresent: coherenceAlreadyPresent,
    isThinAssemblyCoherenceTargetStep: isThinAssemblyCoherenceTargetStep
  };
});
