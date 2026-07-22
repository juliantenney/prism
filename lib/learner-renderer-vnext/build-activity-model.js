"use strict";

var selectArchetypeVariant =
  require("./archetype-rules").selectArchetypeVariant;
var inspectActivityArchetype =
  require("./archetype-diagnostics").inspectActivityArchetype;
var listRegisteredVariants =
  require("./archetype-diagnostics").listRegisteredVariants;
var buildBeatModels = require("./build-beat-model").buildBeatModels;
var diagnostic = require("./validate-input").diagnostic;

function normalizeToken(value) {
  return String(value == null ? "" : value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

/**
 * @param {Object} activity
 * @returns {{activity:Object,errors:Object[],warnings:Object[],omittedBeats:Object[]}}
 */
function buildActivityModel(activity) {
  var activityId = String(activity.activity_id || "").trim();
  var episodePlan = activity.episode_plan || {};
  var archetype = normalizeToken(episodePlan.archetype);
  var rawBeatSequence = Array.isArray(episodePlan.beats)
    ? episodePlan.beats.map(function (beat) {
        return String((beat && beat.function) || "");
      })
    : [];
  var sourceFunctions = rawBeatSequence.map(normalizeToken);
  var inspection = inspectActivityArchetype(activity);
  var variant = selectArchetypeVariant(archetype, sourceFunctions);

  if (!variant) {
    var registeredVariants = listRegisteredVariants(archetype);
    return {
      activity: {
        id: activityId,
        title: String(activity.title || "").trim(),
        durationMinutes: Number.isFinite(Number(activity.duration_minutes))
          ? Number(activity.duration_minutes)
          : null,
        grouping: String(activity.grouping || "").trim(),
        preamble: String(activity.activity_preamble || "").trim(),
        reasoningOrientation: String(activity.reasoning_orientation || "").trim(),
        mappedOutcomeIds: [],
        beats: []
      },
      errors: [
        diagnostic(
          "error",
          "UNKNOWN_ARCHETYPE_VARIANT",
          "No exact archetype rule matches the activity beat sequence.",
          {
            activityId: activityId,
            archetype: archetype,
            rawBeatSequence: rawBeatSequence,
            candidateBeats: sourceFunctions,
            acceptedSequences: registeredVariants.map(function (row) {
              return row.beatSequence;
            }),
            registeredVariantIds: registeredVariants.map(function (row) {
              return row.id;
            }),
            noMatchReason: inspection.noMatchReason,
            errorRole: "primary"
          }
        )
      ],
      warnings: [],
      omittedBeats: [],
      archetypeInspection: inspection
    };
  }

  var beatResult = buildBeatModels(activity, variant);
  var mappedOutcomeIds = Array.isArray(activity.mapped_learning_outcomes)
    ? activity.mapped_learning_outcomes.map(String).filter(Boolean)
    : [];
  return {
    activity: {
      id: activityId,
      title: String(activity.title || "").trim(),
      durationMinutes: Number.isFinite(Number(activity.duration_minutes))
        ? Number(activity.duration_minutes)
        : null,
      grouping: String(activity.grouping || "").trim(),
      preamble: String(activity.activity_preamble || "").trim(),
      reasoningOrientation: String(activity.reasoning_orientation || "").trim(),
      mappedOutcomeIds: mappedOutcomeIds,
      beats: beatResult.beats
    },
    errors: beatResult.errors,
    warnings: beatResult.warnings,
    omittedBeats: beatResult.omittedBeats,
    archetypeInspection: inspection
  };
}

module.exports = {
  normalizeToken: normalizeToken,
  buildActivityModel: buildActivityModel
};
