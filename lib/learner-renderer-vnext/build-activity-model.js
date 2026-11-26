"use strict";

var inspectActivityArchetype =
  require("./archetype-diagnostics").inspectActivityArchetype;
var buildDualValidationDiagnostics =
  require("./archetype-grammar-dual-validation").buildDualValidationDiagnostics;
var buildBeatModels = require("./build-beat-model").buildBeatModels;

function normalizeToken(value) {
  return String(value == null ? "" : value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function cleanOptionalProse(value) {
  var text = String(value == null ? "" : value).trim();
  if (!text || text === "—" || text === "-" || text === "–") return "";
  return text;
}

function isExplicitlyTimedActivity(activity) {
  if (!activity || typeof activity !== "object") return false;
  return (
    activity.explicit_time_limit === true ||
    activity.explicitTimeLimit === true ||
    activity.fixed_timing === true ||
    activity.fixedTiming === true
  );
}

function emptyActivityShell(activity, activityId) {
  return {
    id: activityId,
    title: String(activity.title || "").trim(),
    durationMinutes: Number.isFinite(Number(activity.duration_minutes))
      ? Number(activity.duration_minutes)
      : null,
    explicitTimeLimit: isExplicitlyTimedActivity(activity),
    grouping: String(activity.grouping || "").trim(),
    preamble: cleanOptionalProse(activity.activity_preamble),
    reasoningOrientation: cleanOptionalProse(activity.reasoning_orientation),
    mappedOutcomeIds: [],
    beats: []
  };
}

/**
 * @param {Object} activity
 * @returns {{activity:Object,errors:Object[],warnings:Object[],omittedBeats:Object[]}}
 */
function buildActivityModel(activity) {
  var activityId = String(activity.activity_id || "").trim();
  var inspection = inspectActivityArchetype(activity);
  var resolution = inspection.validationResolution;
  var observationalWarnings = buildDualValidationDiagnostics(
    inspection && inspection.dualValidation
  );

  if (!resolution || !resolution.ok || !resolution.variant) {
    return {
      activity: emptyActivityShell(activity, activityId),
      errors:
        resolution && Array.isArray(resolution.errors) && resolution.errors.length
          ? resolution.errors.slice()
          : [],
      warnings: observationalWarnings,
      omittedBeats: [],
      archetypeInspection: inspection
    };
  }

  var beatResult = buildBeatModels(activity, resolution.variant);
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
      explicitTimeLimit: isExplicitlyTimedActivity(activity),
      grouping: String(activity.grouping || "").trim(),
      preamble: cleanOptionalProse(activity.activity_preamble),
      reasoningOrientation: cleanOptionalProse(activity.reasoning_orientation),
      mappedOutcomeIds: mappedOutcomeIds,
      beats: beatResult.beats,
      activityInteractionType: String(activity.activity_interaction_type || "").trim(),
      ordering:
        activity.ordering && typeof activity.ordering === "object" && !Array.isArray(activity.ordering)
          ? activity.ordering
          : null,
      learnerTask: String(activity.learner_task || "").trim(),
      learnerInstructions: Array.isArray(activity.learner_instructions)
        ? activity.learner_instructions.slice()
        : null,
      sourceActivity: activity,
      validationRoute: resolution.validationRoute,
      runtimeAuthority: resolution.runtimeAuthority,
      bindingSource: resolution.bindingSource,
      matchedVariantId: resolution.matchedVariantId
    },
    errors: beatResult.errors,
    warnings: observationalWarnings.concat(beatResult.warnings || []),
    omittedBeats: beatResult.omittedBeats,
    archetypeInspection: inspection
  };
}

module.exports = {
  normalizeToken: normalizeToken,
  buildActivityModel: buildActivityModel
};
