"use strict";

var hasMaterialRenderer = require("./parse-material").hasMaterialRenderer;

function diagnostic(severity, code, message, details) {
  return Object.assign(
    {
      severity: severity,
      code: code,
      message: message
    },
    details || {}
  );
}

/**
 * Validate source identity and required structural boundaries before assignment.
 *
 * @param {*} input
 * @returns {{errors:Object[],warnings:Object[]}}
 */
function validateInput(input) {
  var errors = [];
  var warnings = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    errors.push(diagnostic("error", "INVALID_PAGE", "Page input must be an object."));
    return { errors: errors, warnings: warnings };
  }

  var activities = Array.isArray(input.activities) ? input.activities : [];
  if (!Array.isArray(input.activities)) {
    errors.push(
      diagnostic("error", "INVALID_ACTIVITIES", "Page activities must be an array.")
    );
  }

  var activityIds = {};
  var globalMaterialIds = {};
  activities.forEach(function (activity) {
    var activityId = String((activity && activity.activity_id) || "").trim();
    if (!activityId) {
      errors.push(
        diagnostic("error", "MISSING_ACTIVITY_ID", "Every activity requires activity_id.")
      );
      return;
    }
    if (activityIds[activityId]) {
      errors.push(
        diagnostic(
          "error",
          "DUPLICATE_ACTIVITY_ID",
          "Duplicate activity ID: " + activityId,
          { activityId: activityId }
        )
      );
    }
    activityIds[activityId] = true;

    if (
      !activity.episode_plan ||
      !Array.isArray(activity.episode_plan.beats) ||
      !activity.episode_plan.beats.length
    ) {
      errors.push(
        diagnostic(
          "error",
          "MISSING_ACTIVITY_EPISODE_PLAN",
          "Activity must provide activity.episode_plan.beats.",
          { activityId: activityId }
        )
      );
    }

    var materialIds = {};
    var materials = Array.isArray(activity.materials) ? activity.materials : [];
    if (!Array.isArray(activity.materials)) {
      errors.push(
        diagnostic(
          "error",
          "INVALID_ACTIVITY_MATERIALS",
          "Activity materials must be an array.",
          { activityId: activityId }
        )
      );
    }
    materials.forEach(function (material) {
      var materialId = String((material && material.material_id) || "").trim();
      var materialType = String((material && material.material_type) || "").trim();
      if (!materialId) {
        errors.push(
          diagnostic(
            "error",
            "MISSING_MATERIAL_ID",
            "Every material requires material_id.",
            { activityId: activityId, materialType: materialType }
          )
        );
        return;
      }
      if (materialIds[materialId]) {
        errors.push(
          diagnostic(
            "error",
            "DUPLICATE_MATERIAL_ID",
            "Duplicate material ID in activity: " + materialId,
            { activityId: activityId, materialId: materialId, materialType: materialType }
          )
        );
      }
      materialIds[materialId] = true;
      if (
        globalMaterialIds[materialId] &&
        globalMaterialIds[materialId] !== activityId
      ) {
        errors.push(
          diagnostic(
            "error",
            "DUPLICATE_MATERIAL_ID",
            "Material ID is duplicated across the page: " + materialId,
            { activityId: activityId, materialId: materialId, materialType: materialType }
          )
        );
      }
      globalMaterialIds[materialId] = activityId;
      if (!hasMaterialRenderer(materialType)) {
        errors.push(
          diagnostic(
            "error",
            "UNKNOWN_MATERIAL_TYPE",
            "No vNext material renderer is registered for type: " + materialType,
            { activityId: activityId, materialId: materialId, materialType: materialType }
          )
        );
      }
    });
  });

  var orderedIds =
    input.learning_sequence &&
    Array.isArray(input.learning_sequence.ordered_activity_ids)
      ? input.learning_sequence.ordered_activity_ids
      : null;
  if (orderedIds) {
    var sequenceSeen = {};
    orderedIds.forEach(function (rawId) {
      var activityId = String(rawId || "").trim();
      if (sequenceSeen[activityId]) {
        errors.push(
          diagnostic(
            "error",
            "DUPLICATE_SEQUENCE_ACTIVITY",
            "Learning sequence repeats activity: " + activityId,
            { activityId: activityId }
          )
        );
      }
      sequenceSeen[activityId] = true;
      if (!activityIds[activityId]) {
        errors.push(
          diagnostic(
            "error",
            "MISSING_SEQUENCE_ACTIVITY",
            "Learning sequence references a missing activity: " + activityId,
            { activityId: activityId }
          )
        );
      }
    });
  }

  return { errors: errors, warnings: warnings };
}

module.exports = {
  diagnostic: diagnostic,
  validateInput: validateInput
};
