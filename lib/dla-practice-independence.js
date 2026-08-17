"use strict";

/**
 * S78-WS-2 — Model/practice operand independence binding for DLA partial-page capture.
 * Stage 1: authoritative relationship + deterministic structural closure only.
 */

var fulfilment = require("./dla-production-fulfilment.js");
var classifyLearnerProductionSteps = fulfilment.classifyLearnerProductionSteps;

var MODEL_MATERIAL_TYPES = Object.freeze({
  worked_example: true,
  modelling_note: true
});

var OPERAND_MATERIAL_TYPES = Object.freeze({
  scenario: true,
  task_card: true,
  scenarios: true,
  task_cards: true,
  study_scenarios: true,
  prompt_set: true
});

var WORKSPACE_MATERIAL_TYPES = Object.freeze({
  template: true,
  analysis_table: true,
  comparison_table: true,
  decision_table: true,
  classification_table: true,
  planning_table: true,
  data_table: true,
  impact_table: true
});

var GUIDED_PRODUCTION_STEP_RE =
  /\b(guided practice|with hints|using the supplied hints|follow the guided|scaffolded practice|complete the guided)\b/i;

var STUDY_STEP_RE =
  /^(study|read|review|work through|examine|look at|follow the|review the|use the checklist|verify|check the|complete the self-check|complete the checklist|complete the verification)\b/i;

var VERIFY_STEP_RE =
  /^(compare your|verify|check|use the checklist|complete the self-check|complete the checklist|complete the .*verification checklist|revise|review your|self-check|consolidate)\b/i;

function isStudyOrVerifyStep(text) {
  var step = String(text || "").trim();
  if (!step) return true;
  if (STUDY_STEP_RE.test(step)) return true;
  if (VERIFY_STEP_RE.test(step)) return true;
  return false;
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function materialTypeToken(row) {
  return String((row && (row.material_type || row.type)) || "").trim();
}

function materialIdToken(row) {
  return nonEmptyString(row && row.material_id) ? String(row.material_id).trim() : "";
}

function isModelRow(row) {
  return !!MODEL_MATERIAL_TYPES[materialTypeToken(row)];
}

function isOperandRow(row) {
  return !!OPERAND_MATERIAL_TYPES[materialTypeToken(row)];
}

function isGuidedOnlyActivity(classification) {
  var nonStudySteps = classification.steps.filter(function (step) {
    return !isStudyOrVerifyStep(step.text);
  });
  if (!nonStudySteps.length) return false;
  return nonStudySteps.every(function (step) {
    return GUIDED_PRODUCTION_STEP_RE.test(step.text);
  });
}

function hasBoundLearnerWorkspace(requiredMaterials) {
  return requiredMaterials.some(function (row) {
    if (!row || typeof row !== "object") return false;
    var rf = row.response_fulfilment;
    if (!rf || typeof rf !== "object") return false;
    return (
      String(rf.kind || "").trim() === "learner_workspace" ||
      String(rf.kind || "").trim() === "learner_text_production"
    );
  });
}

function hasIndependentAttemptProduction(activity, requiredMaterials, classification) {
  if (isGuidedOnlyActivity(classification)) return false;
  if (classification.productionKinds.length) return true;
  return hasBoundLearnerWorkspace(requiredMaterials);
}

function resolveAttemptOperandIds(activity, requiredMaterials) {
  var ids = [];
  var seen = Object.create(null);
  var taskDecision = activity && activity.task_material_decision;
  var taskInputIds =
    taskDecision && Array.isArray(taskDecision.task_input_material_ids)
      ? taskDecision.task_input_material_ids
      : [];

  taskInputIds.forEach(function (rawId) {
    var id = nonEmptyString(rawId) ? String(rawId).trim() : "";
    if (!id || seen[id]) return;
    var row = requiredMaterials.find(function (entry) {
      return materialIdToken(entry) === id;
    });
    if (!row) return;
    var type = materialTypeToken(row);
    if (MODEL_MATERIAL_TYPES[type]) return;
    if (WORKSPACE_MATERIAL_TYPES[type] && !OPERAND_MATERIAL_TYPES[type]) return;
    seen[id] = true;
    ids.push(id);
  });

  if (ids.length) return ids;

  requiredMaterials.forEach(function (row) {
    var id = materialIdToken(row);
    if (!id || seen[id]) return;
    if (isOperandRow(row)) {
      seen[id] = true;
      ids.push(id);
    }
  });

  return ids;
}

function activityRequiresPracticeIndependence(activity) {
  var requiredMaterials = Array.isArray(activity && activity.required_materials)
    ? activity.required_materials
    : [];
  if (!requiredMaterials.some(isModelRow)) return false;

  var classification = classifyLearnerProductionSteps(
    activity && activity.learner_task,
    activity && activity.expected_output
  );
  if (!hasIndependentAttemptProduction(activity, requiredMaterials, classification)) return false;

  return resolveAttemptOperandIds(activity, requiredMaterials).length > 0;
}

function validatePracticeIndependenceShape(value, path, errors) {
  if (value == null) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push("S78_WS2_INVALID_SHAPE: " + path + " must be an object when present");
    return;
  }
  var ids = value.attempt_operand_material_ids;
  if (!Array.isArray(ids) || !ids.length) {
    errors.push(
      "S78_WS2_INVALID_SHAPE: " +
        path +
        ".attempt_operand_material_ids must be a non-empty string array when present"
    );
    return;
  }
  ids.forEach(function (rawId, index) {
    if (!nonEmptyString(rawId)) {
      errors.push(
        "S78_WS2_INVALID_SHAPE: " +
          path +
          ".attempt_operand_material_ids[" +
          index +
          "] must be a non-empty string"
      );
    }
  });
}

function appendPracticeIndependenceValidationErrors(activity, activityIndex, errors) {
  var activityId = nonEmptyString(activity && activity.activity_id)
    ? String(activity.activity_id).trim()
    : "activities[" + activityIndex + "]";
  var requiredMaterials = Array.isArray(activity && activity.required_materials)
    ? activity.required_materials
    : [];
  var rowById = Object.create(null);
  requiredMaterials.forEach(function (row) {
    var id = materialIdToken(row);
    if (id) rowById[id] = row;
  });

  var requiresBinding = activityRequiresPracticeIndependence(activity);
  var expectedOperandIds = requiresBinding
    ? resolveAttemptOperandIds(activity, requiredMaterials)
    : [];

  requiredMaterials.forEach(function (row, reqIndex) {
    var rowPath = "activities[" + activityIndex + "].required_materials[" + reqIndex + "]";
    var materialId = materialIdToken(row) || rowPath;
    var hasField =
      row &&
      typeof row === "object" &&
      !Array.isArray(row) &&
      Object.prototype.hasOwnProperty.call(row, "practice_independence");

    if (!hasField) return;

    if (!isModelRow(row)) {
      errors.push(
        "S78_WS2_FORBIDDEN_ON_ROW: " +
          rowPath +
          " (" +
          materialId +
          ") practice_independence only permitted on worked_example or modelling_note rows"
      );
      return;
    }

    validatePracticeIndependenceShape(
      row.practice_independence,
      rowPath + ".practice_independence",
      errors
    );
    if (!row.practice_independence || typeof row.practice_independence !== "object") return;

    var boundIds = Array.isArray(row.practice_independence.attempt_operand_material_ids)
      ? row.practice_independence.attempt_operand_material_ids
      : [];

    if (boundIds.indexOf(materialId) !== -1) {
      errors.push(
        "S78_WS2_OPERAND_CLOSURE: " +
          rowPath +
          " (" +
          materialId +
          ") practice_independence must not bind to the model row itself"
      );
    }

    boundIds.forEach(function (operandId, opIndex) {
      var opId = nonEmptyString(operandId) ? String(operandId).trim() : "";
      if (!opId) return;
      var operandRow = rowById[opId];
      if (!operandRow) {
        errors.push(
          "S78_WS2_OPERAND_CLOSURE: " +
            rowPath +
            " (" +
            materialId +
            ") practice_independence.attempt_operand_material_ids[" +
            opIndex +
            "] references missing material_id " +
            opId +
            " in activity " +
            activityId
        );
        return;
      }
      if (isModelRow(operandRow)) {
        errors.push(
          "S78_WS2_OPERAND_CLOSURE: " +
            rowPath +
            " (" +
            materialId +
            ") attempt operand " +
            opId +
            " must not be a model row (worked_example/modelling_note)"
        );
      }
    });
  });

  if (!requiresBinding) return;

  requiredMaterials.filter(isModelRow).forEach(function (row) {
    var materialId = materialIdToken(row);
    var reqIndex = requiredMaterials.indexOf(row);
    var rowPath = "activities[" + activityIndex + "].required_materials[" + reqIndex + "]";
    var binding = row && row.practice_independence;
    if (!binding || typeof binding !== "object") {
      errors.push(
        "S78_WS2_MISSING_BINDING: activities[" +
          activityIndex +
          "] (" +
          activityId +
          ") model material_id " +
          materialId +
          " requires practice_independence binding to attempt operand(s)" +
          (expectedOperandIds.length
            ? " [" + expectedOperandIds.join(", ") + "]"
            : "")
      );
    }
  });
}

module.exports = {
  MODEL_MATERIAL_TYPES: MODEL_MATERIAL_TYPES,
  OPERAND_MATERIAL_TYPES: OPERAND_MATERIAL_TYPES,
  isGuidedOnlyActivity: isGuidedOnlyActivity,
  activityRequiresPracticeIndependence: activityRequiresPracticeIndependence,
  resolveAttemptOperandIds: resolveAttemptOperandIds,
  validatePracticeIndependenceShape: validatePracticeIndependenceShape,
  appendPracticeIndependenceValidationErrors: appendPracticeIndependenceValidationErrors
};
