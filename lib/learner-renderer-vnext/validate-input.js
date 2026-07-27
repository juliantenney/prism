"use strict";

var hasMaterialRenderer = require("./parse-material").hasMaterialRenderer;
var resolveMaterialType = require("./parse-material").resolveMaterialType;
var canonicalMaterialType = require("./parse-material").canonicalMaterialType;
var normalizeMaterialType = require("./parse-material").normalizeMaterialType;
var parseTaskCardPayload = require("./parse-material").parseTaskCardPayload;
var resolveLegacyTableWorksheet =
  require("./parse-material").resolveLegacyTableWorksheet;
var NON_RENDERABLE_MATERIAL_TYPES =
  require("./parse-material").NON_RENDERABLE_MATERIAL_TYPES;

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

var PHASE1_ALIAS_TYPES = Object.freeze({
  checklists: true,
  examples: true,
  worked_examples: true,
  exposition: true,
  reading: true,
  reading_text: true,
  prompt: true,
  prompts: true,
  scenarios: true,
  study_scenarios: true,
  templates: true,
  worksheet_template: true
});

function rawMaterialType(material) {
  if (!material || typeof material !== "object") return "";
  var raw = material.material_type;
  if (raw == null || !String(raw).trim()) raw = material.type;
  if (raw == null || !String(raw).trim()) raw = material.materialType;
  if (raw == null || !String(raw).trim()) raw = material.kind;
  return normalizeMaterialType(raw);
}

function isAliasPayloadInvalid(material) {
  var rawType = rawMaterialType(material);
  if (!PHASE1_ALIAS_TYPES[rawType]) return false;
  if (material == null || typeof material !== "object") return true;
  if (!Object.prototype.hasOwnProperty.call(material, "body")) return false;
  if (material.body == null) return false;
  return typeof material.body !== "string";
}

function isTaskCardPayloadInvalid(material) {
  var canonicalType = canonicalMaterialType(rawMaterialType(material));
  if (canonicalType !== "task_card") return false;
  if (material == null || typeof material !== "object") return true;
  var payload =
    material.body != null
      ? material.body
      : material.content != null
      ? material.content
      : material.text != null
      ? material.text
      : null;
  var parsed = parseTaskCardPayload(payload);
  return !parsed.ok;
}

function rubricPayload(material) {
  if (material == null || typeof material !== "object") return null;
  if (material.body != null) return material.body;
  if (material.content != null) return material.content;
  if (material.text != null) return material.text;
  return null;
}

function isRubricPayloadAmbiguous(material) {
  if (rawMaterialType(material) !== "rubric") return false;
  var payload = rubricPayload(material);
  if (payload == null) return false;
  if (typeof payload === "string") return false;
  if (Array.isArray(payload)) {
    return !payload.every(function (entry) {
      return typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean";
    });
  }
  return typeof payload === "object";
}

function isRubricPayloadInvalid(material) {
  if (rawMaterialType(material) !== "rubric") return false;
  if (isRubricPayloadAmbiguous(material)) return false;
  var payload = rubricPayload(material);
  if (payload == null) return true;
  if (typeof payload === "string") return !String(payload).trim();
  if (Array.isArray(payload)) return !payload.length;
  return true;
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
      var materialType = resolveMaterialType(material);
      var authoredType = rawMaterialType(material);
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
      if (isAliasPayloadInvalid(material)) {
        errors.push(
          diagnostic(
            "error",
            "INVALID_MATERIAL_PAYLOAD",
            "Alias material payload must provide a markdown string body.",
            {
              activityId: activityId,
              materialId: materialId,
              materialType: materialType,
              authoredMaterialType: authoredType,
              canonicalMaterialType: canonicalMaterialType(authoredType)
            }
          )
        );
        return;
      }
      if (isTaskCardPayloadInvalid(material)) {
        errors.push(
          diagnostic(
            "error",
            "INVALID_MATERIAL_PAYLOAD",
            "Task-card material payload must be a string, object, or array of card entries.",
            {
              activityId: activityId,
              materialId: materialId,
              materialType: materialType,
              authoredMaterialType: authoredType,
              canonicalMaterialType: canonicalMaterialType(authoredType)
            }
          )
        );
        return;
      }
      if (isRubricPayloadAmbiguous(material)) {
        errors.push(
          diagnostic(
            "error",
            "AMBIGUOUS_MATERIAL_TYPE",
            "Rubric payload must be markdown string or plain checklist lines; structured scoring grids require an explicit canonical type.",
            {
              activityId: activityId,
              materialId: materialId,
              materialType: materialType,
              authoredMaterialType: authoredType,
              canonicalMaterialType: canonicalMaterialType(authoredType)
            }
          )
        );
        return;
      }
      if (isRubricPayloadInvalid(material)) {
        errors.push(
          diagnostic(
            "error",
            "INVALID_MATERIAL_PAYLOAD",
            "Rubric material payload must provide markdown checklist or verification criteria text.",
            {
              activityId: activityId,
              materialId: materialId,
              materialType: materialType,
              authoredMaterialType: authoredType,
              canonicalMaterialType: canonicalMaterialType(authoredType)
            }
          )
        );
        return;
      }
      if (NON_RENDERABLE_MATERIAL_TYPES[authoredType]) {
        errors.push(
          diagnostic(
            "error",
            "NON_RENDERABLE_MATERIAL_TYPE",
            'Material type "' +
              authoredType +
              '" is not a learner-renderable material type; it is reserved for ' +
              NON_RENDERABLE_MATERIAL_TYPES[authoredType] +
              ".",
            {
              activityId: activityId,
              materialId: materialId,
              materialType: materialType,
              authoredMaterialType: authoredType,
              boundaryKind: NON_RENDERABLE_MATERIAL_TYPES[authoredType]
            }
          )
        );
        return;
      }
      if (authoredType === "table" || authoredType === "worksheet") {
        var legacyResolution = resolveLegacyTableWorksheet(material || {});
        if (!legacyResolution.ok) {
          errors.push(
            diagnostic(
              "error",
              legacyResolution.code || "AMBIGUOUS_MATERIAL_TYPE",
              legacyResolution.reason ||
                "Legacy generic material requires explicit canonical table/worksheet type.",
              {
                activityId: activityId,
                materialId: materialId,
                materialType: materialType,
                authoredMaterialType: authoredType
              }
            )
          );
          return;
        }
      }
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
