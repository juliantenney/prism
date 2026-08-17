"use strict";

/**
 * S78-WS-3 — Activity-level diagnostic review binding for DLA partial-page capture.
 * Stage 1: authoritative commission + deterministic structural closure only.
 */

var fulfilment = require("./dla-production-fulfilment.js");
var classifyLearnerProductionSteps = fulfilment.classifyLearnerProductionSteps;
var isGuidedOnlyActivity = require("./dla-practice-independence.js").isGuidedOnlyActivity;

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function materialTypeToken(row) {
  return String((row && (row.material_type || row.type)) || "").trim();
}

function materialIdToken(row) {
  return nonEmptyString(row && row.material_id) ? String(row.material_id).trim() : "";
}

function isChecklistRow(row) {
  return materialTypeToken(row) === "checklist";
}

function rowHasResponseFulfilment(row) {
  if (!row || typeof row !== "object") return false;
  if (!Object.prototype.hasOwnProperty.call(row, "response_fulfilment")) return false;
  var rf = row.response_fulfilment;
  return rf && typeof rf === "object" && !Array.isArray(rf);
}

function collectResponseFulfilmentMaterialIds(requiredMaterials) {
  var ids = [];
  var seen = Object.create(null);
  requiredMaterials.forEach(function (row) {
    if (!rowHasResponseFulfilment(row)) return;
    var id = materialIdToken(row);
    if (!id || seen[id]) return;
    seen[id] = true;
    ids.push(id);
  });
  ids.sort();
  return ids;
}

function sortedIdList(ids) {
  return ids
    .map(function (id) {
      return nonEmptyString(id) ? String(id).trim() : "";
    })
    .filter(Boolean)
    .sort();
}

function idListsEqual(a, b) {
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function activityRequiresDiagnosticReview(activity) {
  var classification = classifyLearnerProductionSteps(
    activity && activity.learner_task,
    activity && activity.expected_output
  );
  if (isGuidedOnlyActivity(classification)) return false;
  return classification.productionKinds.length > 0;
}

function validateDiagnosticReviewShape(value, path, errors) {
  if (value == null) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push("S78_DR_INVALID_SHAPE: " + path + " must be an object when present");
    return;
  }
  var extraKeys = Object.keys(value).filter(function (key) {
    return key !== "covers_response_material_ids";
  });
  if (extraKeys.length) {
    errors.push(
      "S78_DR_INVALID_SHAPE: " + path + " must only contain covers_response_material_ids"
    );
  }
  var ids = value.covers_response_material_ids;
  if (!Array.isArray(ids) || !ids.length) {
    errors.push(
      "S78_DR_INVALID_SHAPE: " +
        path +
        ".covers_response_material_ids must be a non-empty string array when present"
    );
    return;
  }
  ids.forEach(function (rawId, index) {
    if (!nonEmptyString(rawId)) {
      errors.push(
        "S78_DR_INVALID_SHAPE: " +
          path +
          ".covers_response_material_ids[" +
          index +
          "] must be a non-empty string"
      );
    }
  });
}

function appendDiagnosticReviewValidationErrors(activity, activityIndex, errors) {
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

  var expectedCoverage = collectResponseFulfilmentMaterialIds(requiredMaterials);
  var requiresReview = activityRequiresDiagnosticReview(activity);
  var diagnosticRows = [];

  requiredMaterials.forEach(function (row, reqIndex) {
    var rowPath = "activities[" + activityIndex + "].required_materials[" + reqIndex + "]";
    var materialId = materialIdToken(row) || rowPath;
    var hasField =
      row &&
      typeof row === "object" &&
      !Array.isArray(row) &&
      Object.prototype.hasOwnProperty.call(row, "diagnostic_review");

    if (!hasField) return;

    diagnosticRows.push({ row: row, reqIndex: reqIndex, materialId: materialId });

    if (!isChecklistRow(row)) {
      errors.push(
        "S78_DR_WRONG_HOST: " +
          rowPath +
          " (" +
          materialId +
          ") diagnostic_review only permitted on checklist rows"
      );
      return;
    }

    validateDiagnosticReviewShape(row.diagnostic_review, rowPath + ".diagnostic_review", errors);
    if (!row.diagnostic_review || typeof row.diagnostic_review !== "object") return;

    var covered = sortedIdList(row.diagnostic_review.covers_response_material_ids || []);
    covered.forEach(function (coverId, coverIndex) {
      if (!coverId) return;
      var targetRow = rowById[coverId];
      if (!targetRow) {
        errors.push(
          "S78_DR_UNKNOWN_ID: " +
            rowPath +
            " (" +
            materialId +
            ") diagnostic_review.covers_response_material_ids[" +
            coverIndex +
            "] references missing material_id " +
            coverId +
            " in activity " +
            activityId
        );
        return;
      }
      if (!rowHasResponseFulfilment(targetRow)) {
        errors.push(
          "S78_DR_UNKNOWN_ID: " +
            rowPath +
            " (" +
            materialId +
            ") covers_response_material_ids[" +
            coverIndex +
            "] " +
            coverId +
            " is not a response_fulfilment production surface"
        );
      }
    });

    if (covered.length && !idListsEqual(covered, expectedCoverage)) {
      errors.push(
        "S78_DR_COVERAGE_MISMATCH: " +
          rowPath +
          " (" +
          materialId +
          ") diagnostic_review.covers_response_material_ids must equal all response_fulfilment material_ids [" +
          expectedCoverage.join(", ") +
          "]"
      );
    }
  });

  if (!requiresReview) return;

  if (!diagnosticRows.length) {
    errors.push(
      "S78_DR_MISSING_REVIEW: activities[" +
        activityIndex +
        "] (" +
        activityId +
        ") requires exactly one diagnostic_review checklist covering bound production" +
        (expectedCoverage.length ? " [" + expectedCoverage.join(", ") + "]" : "")
    );
    return;
  }

  if (diagnosticRows.length > 1) {
    errors.push(
      "S78_DR_DUPLICATE_REVIEW: activities[" +
        activityIndex +
        "] (" +
        activityId +
        ") must have exactly one diagnostic_review checklist; found " +
        diagnosticRows.length
    );
  }
}

module.exports = {
  activityRequiresDiagnosticReview: activityRequiresDiagnosticReview,
  collectResponseFulfilmentMaterialIds: collectResponseFulfilmentMaterialIds,
  validateDiagnosticReviewShape: validateDiagnosticReviewShape,
  appendDiagnosticReviewValidationErrors: appendDiagnosticReviewValidationErrors
};
