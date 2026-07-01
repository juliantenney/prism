/**
 * LD-COGNITION-ORIENTATION — DLA activity-row cognition-orientation authoring (Sprint 49).
 * Lifecycle: canonical.
 * Owns: cognition-orientation JSON fields on learning_activities activity rows only.
 * Does not duplicate: OUTPUT CONTRACT bulk rules, pedagogic cognition packs, GAM/SP-01 FM-07, Design Page compose.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  if (typeof root !== "undefined") {
    root.PRISM_LD_COGNITION_ORIENTATION = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this, function () {
  "use strict";

  var MODULE_ID = "LD-COGNITION-ORIENTATION";
  var MARKER = "LD-COGNITION-ORIENTATION-CONTRACT (auto-applied)";

  var MANDATORY_COGNITION_FIELD_IDS = [
    "reasoning_orientation",
    "reasoning_orientation_prompt",
    "self_explanation_prompt",
    "conceptual_contrast_prompt",
    "uncertainty_tension_prompt",
    "argument_structure_hint",
    "transfer_or_application_task"
  ];

  var CORE_LINES = [
    "",
    MARKER + ":",
    "- Module: " +
      MODULE_ID +
      " | Design Learning Activities only — author activity-row cognition-orientation fields on each learner-page activity object.",
    "- Scope: JSON keys on each activity in activities[] — not page-level fields, not required_materials specifications, not GAM material bodies, not support_note.",
    "- activity_preamble orients significance; cognition-orientation fields state HOW TO THINK before the learner_task — complementary, not interchangeable.",
    "- Does not replace pedagogic cognition pack fields (misconception_claim, reasoning_revision_prompt, etc.) when those packs apply — this module covers learner-page mandatory orientation fields only."
  ];

  var REQUIREMENT_LINES = [
    "- MANDATORY PER ACTIVITY (learner-page workflows): activity_preamble + at least one non-empty field from:",
    "  " + MANDATORY_COGNITION_FIELD_IDS.join(", "),
    "- Pick the field that matches the episode_plan beat / primary_archetype (see Learner-page activity framing by archetype when present upstream).",
    "- ALLOWED: non-empty strings on the activity object using exact JSON keys above.",
    "- NOT ALLOWED: cognition cues only inside required_materials specification text; GAM text Content bodies; support_note; substituting activity_preamble for a cognition-orientation field."
  ];

  var EXEMPLAR_LINES = [
    "- EXEMPLAR CONTRAST (topic-specific strings required — do not copy verbatim):",
    "  • reasoning_orientation — Weak: \"Think carefully about the topic.\" / \"Trace mechanism → function relationships.\"",
    "  • reasoning_orientation — Strong (35–80 words): \"As you analyse each stage, ask two questions: what is the virus doing, and what problem does this solve? Avoid simply listing lifecycle events. Strong answers connect each mechanism to a functional consequence such as entry, replication, persistence, or spread.\"",
    "  • conceptual_contrast_prompt — Weak: \"Contrast positive vs negative-sense RNA.\"",
    "  • conceptual_contrast_prompt — Strong (35–80 words): \"When comparing genome types, focus on whether the genome can be translated immediately and whether a transcription step is needed first. The key distinction is not just polarity, but how polarity changes the route from genome entry to protein production.\"",
    "  • self_explanation_prompt — Weak: \"Explain your answer.\"",
    "  • self_explanation_prompt — Strong: \"Before checking the model row, explain which contrast you find more defensible and cite one passage as evidence.\""
  ];

  var PROSE_DEPTH_LINES = [
    "- PROSE DEPTH (mandatory — see LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT when auto-applied):",
    "  • reasoning_orientation, conceptual_contrast_prompt, argument_structure_hint: 35–80 words each — learner-facing how-to-think guidance, not labels.",
    "  • FORBIDDEN: arrow-only scaffolds, one-line contrasts, metadata tags."
  ];

  var PRE_EMIT_LINES = [
    "- PRE-EMIT CHECKLIST (before returning activities JSON):",
    "  For every activity object:",
    "  • activity_preamble is present and non-empty",
    "  • at least one cognition-orientation field from the mandatory set is present and non-empty",
    "  Do not emit procedural-only rows (title, learner_task, expected_output, required_materials only)."
  ];

  function buildLdCognitionOrientationPromptBlock(options) {
    var opts = options && typeof options === "object" ? options : {};
    var includeMarker = opts.includeMarker !== false;
    var lines = includeMarker ? CORE_LINES.slice() : CORE_LINES.slice(2);
    return lines
      .concat(REQUIREMENT_LINES)
      .concat(PROSE_DEPTH_LINES)
      .concat(EXEMPLAR_LINES)
      .concat(PRE_EMIT_LINES)
      .join("\n");
  }

  function markerRegex() {
    return /LD-COGNITION-ORIENTATION-CONTRACT \(auto-applied\)/i;
  }

  function cognitionOrientationAlreadyPresent(text) {
    return markerRegex().test(String(text || ""));
  }

  function normalizeActivitiesList(input) {
    if (Array.isArray(input)) return input;
    if (input && typeof input === "object" && Array.isArray(input.activities)) {
      return input.activities;
    }
    return [];
  }

  function activityRowHasMandatoryCognitionField(row) {
    if (!row || typeof row !== "object" || Array.isArray(row)) return false;
    var i;
    for (i = 0; i < MANDATORY_COGNITION_FIELD_IDS.length; i += 1) {
      var value = row[MANDATORY_COGNITION_FIELD_IDS[i]];
      if (value == null) continue;
      if (typeof value === "string" && value.trim()) return true;
    }
    return false;
  }

  function evaluateActivityCognitionOrientationEvidence(input) {
    var activities = normalizeActivitiesList(input);
    var rows = [];
    var cognitionCount = 0;
    activities.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      var id = String(row.activity_id || row.activityId || row.id || "").trim() || "activity";
      var hasCognition = activityRowHasMandatoryCognitionField(row);
      if (hasCognition) cognitionCount += 1;
      rows.push({ activity_id: id, has_mandatory_cognition_field: hasCognition });
    });
    var activityCount = activities.length;
    return {
      activityCount: activityCount,
      cognitionFieldCount: cognitionCount,
      meetsMandatoryCognitionCoverage: activityCount > 0 && cognitionCount === activityCount,
      mandatoryFieldIds: MANDATORY_COGNITION_FIELD_IDS.slice(),
      rows: rows
    };
  }

  return {
    MODULE_ID: MODULE_ID,
    MARKER: MARKER,
    MANDATORY_COGNITION_FIELD_IDS: MANDATORY_COGNITION_FIELD_IDS.slice(),
    buildLdCognitionOrientationPromptBlock: buildLdCognitionOrientationPromptBlock,
    markerRegex: markerRegex,
    cognitionOrientationAlreadyPresent: cognitionOrientationAlreadyPresent,
    activityRowHasMandatoryCognitionField: activityRowHasMandatoryCognitionField,
    evaluateActivityCognitionOrientationEvidence: evaluateActivityCognitionOrientationEvidence
  };
});
