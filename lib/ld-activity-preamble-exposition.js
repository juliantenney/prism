/**
 * LD-ACTIVITY-PREAMBLE-EXPOSITION — DLA activity_preamble authorial quality (Sprint 42 Slice 42-3).
 * Lifecycle: canonical (Slice 42-3).
 * Owns: explanatory/narrative activity_preamble generation on Design Learning Activities only.
 * Does not duplicate: mandatory framing minimums, cognition field contracts, Design Page compose (42-2).
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_ACTIVITY_PREAMBLE_EXPOSITION = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-ACTIVITY-PREAMBLE-EXPOSITION";
  var MARKER = "LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT (auto-applied)";

  var PROCEDURAL_OPENING_RE =
    /^(Identify|Analyse|Analyze|Examine|Establish|Complete|Bring together|Study the|No model row|In this activity you will|You will now|Now complete|Begin by|Develop understanding|Analyse how|Analyze how)\b/i;

  var CORE_LINES = [
    "",
    MARKER + ":",
    "- Module: " +
      MODULE_ID +
      " | Design Learning Activities only — upgrade activity_preamble from procedural cues to explanatory educational prose.",
    "- Scope: activity_preamble strings on each activity object. Do not add fields, schema, workflow steps, or EQF dimensions.",
    "- learner_task holds executable instructions; activity_preamble teaches before the task — never duplicate learner_task sentences or step lists."
  ];

  var AUTHORIAL_PURPOSE_LINES = [
    "- ACTIVITY_PREAMBLE AUTHORIAL PURPOSE (approximately 50–120 words, 2–4 sentences, topic-specific):",
    "  1. Explain why the idea or move matters — significance, stakes, or conceptual tension.",
    "  2. Introduce the intellectual question being explored (not the first action step).",
    "  3. Name the key distinction or mechanism the learner should attend to.",
    "  4. Connect to prior learning where appropriate — build on the previous activity's reasoning.",
    "  5. Prepare the kind of reasoning required before task execution — orient inquiry, not workflow.",
    "  6. Read like an introductory paragraph in a textbook or workbook — not a topic label or metadata tag."
  ];

  var PREFER_AVOID_LINES = [
    "- PREFER: significance, explanation, inquiry, conceptual tension, intellectual curiosity, narrative progression.",
    "- AVOID as standalone opening sentences: Identify…, Analyse…, Analyze…, Examine…, Establish…, Complete…, Bring together…, Study the model row…, No model row…, In this activity you will….",
    "- AVOID: topic labels, one-sentence metadata tags, and definitional stubs that merely name the subject without orienting reasoning.",
    "- AVOID: repeating purpose, learner_task, or intellectual_coherence_bridge wording — preamble teaches; bridge carries the prior move; task instructs."
  ];

  var EXEMPLAR_LINES = [
    "- EXEMPLAR CONTRAST (topic-specific strings required — do not copy verbatim):",
    "  • Weak: \"Identify and organise Marx's key predictions about how capitalism develops over time.\"",
    "  • Strong: \"Marx believed that capitalism contains pressures that push societies in particular directions. Before evaluating whether those predictions were accurate, it is important to understand what he expected to happen and why he believed those developments were built into the system itself.\"",
    "  • Weak: \"Analyse how Marx's predictions align or conflict with contemporary economic developments.\"",
    "  • Strong: \"Many of Marx's claims remain controversial because some appear strikingly relevant while others seem less convincing in light of modern evidence. This activity explores where contemporary capitalism supports, challenges, or complicates Marx's predictions.\"",
    "  • Weak: \"Study the model row before completing the full comparison table.\"",
    "  • Strong: \"Comparing two major works is not the same as summarising them: each text was written for a different purpose and audience. Before you complete the table, notice how a modelled row names author aim and a defensible contrast — that move is what makes comparison evidence-based rather than descriptive.\""
  ];

  function buildLdActivityPreambleExpositionPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? CORE_LINES.slice() : CORE_LINES.slice(2);
    return lines
      .concat(AUTHORIAL_PURPOSE_LINES)
      .concat(PREFER_AVOID_LINES)
      .concat(EXEMPLAR_LINES)
      .join("\n");
  }

  function markerRegex() {
    return /LD-ACTIVITY-PREAMBLE-EXPOSITION-CONTRACT \(auto-applied\)/i;
  }

  function expositionAlreadyPresent(text) {
    return markerRegex().test(String(text || ""));
  }

  function firstSentence(text) {
    var raw = String(text || "").trim();
    if (!raw) return "";
    var match = raw.match(/^[^.!?]+[.!?]?/);
    return match ? match[0].trim() : raw;
  }

  function preambleLooksProcedural(preamble) {
    var opening = firstSentence(preamble);
    if (!opening) return false;
    return PROCEDURAL_OPENING_RE.test(opening);
  }

  function normalizeActivitiesList(input) {
    if (Array.isArray(input)) return input;
    if (input && typeof input === "object" && Array.isArray(input.activities)) {
      return input.activities;
    }
    return [];
  }

  function evaluateActivityPreambleExpositionEvidence(input, options) {
    var opts = options && typeof options === "object" ? options : {};
    var activities = normalizeActivitiesList(input);
    var rows = [];
    var preambleCount = 0;
    var proceduralOpeningCount = 0;
    activities.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      var preamble = String(row.activity_preamble || row.orienting_preamble || row.activity_framing || "").trim();
      var learnerTask = String(row.learner_task || row.task || "").trim();
      var id = String(row.activity_id || row.activityId || row.id || "").trim() || "activity";
      if (!preamble) {
        rows.push({
          activity_id: id,
          has_preamble: false,
          procedural_opening: false,
          duplicates_learner_task: false
        });
        return;
      }
      preambleCount += 1;
      var procedural = preambleLooksProcedural(preamble);
      if (procedural) proceduralOpeningCount += 1;
      var duplicatesTask = false;
      if (learnerTask && preamble.length > 20 && learnerTask.length > 20) {
        var pNorm = preamble.toLowerCase().replace(/\s+/g, " ");
        var tNorm = learnerTask.toLowerCase().replace(/\s+/g, " ");
        duplicatesTask =
          pNorm === tNorm ||
          (pNorm.length > 40 && tNorm.indexOf(pNorm.slice(0, 40)) !== -1) ||
          (tNorm.length > 40 && pNorm.indexOf(tNorm.slice(0, 40)) !== -1);
      }
      rows.push({
        activity_id: id,
        has_preamble: true,
        procedural_opening: procedural,
        duplicates_learner_task: duplicatesTask,
        opening: firstSentence(preamble)
      });
    });
    var activityCount = activities.length;
    return {
      activityCount: activityCount,
      preambleCount: preambleCount,
      proceduralOpeningCount: proceduralOpeningCount,
      meetsPreambleCoverage: activityCount > 0 && preambleCount === activityCount,
      meetsAuthorialExposition:
        activityCount > 0 && preambleCount === activityCount && proceduralOpeningCount === 0,
      rows: rows
    };
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    PROCEDURAL_OPENING_RE: PROCEDURAL_OPENING_RE,
    buildLdActivityPreambleExpositionPromptBlock: buildLdActivityPreambleExpositionPromptBlock,
    markerRegex: markerRegex,
    expositionAlreadyPresent: expositionAlreadyPresent,
    preambleLooksProcedural: preambleLooksProcedural,
    evaluateActivityPreambleExpositionEvidence: evaluateActivityPreambleExpositionEvidence
  };
});
