"use strict";

/**
 * S78-T-007 — GAM defence-in-depth for commissioned learner table workspaces.
 * Triggers only when authoritative DLA response_fulfilment.kind === "learner_workspace".
 */

var tableMaterialTypes = require("./learner-renderer-vnext/table-material-types.js");
var tableMaterialParse = require("./learner-renderer-vnext/table-material-parse.js");

var TABLE_FAMILY_WORKSPACE_TYPES = Object.freeze(
  Object.keys(tableMaterialTypes.TABLE_MATERIAL_TYPES).reduce(function (acc, key) {
    if (key !== "reference_table") acc[key] = true;
    return acc;
  }, Object.create(null))
);

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isTableFamilyWorkspaceMaterialType(materialType) {
  return !!TABLE_FAMILY_WORKSPACE_TYPES[String(materialType || "").trim()];
}

function findRequiredMaterialRow(requiredMaterials, materialId) {
  var id = String(materialId || "").trim();
  if (!id || !Array.isArray(requiredMaterials)) return null;
  for (var i = 0; i < requiredMaterials.length; i += 1) {
    var row = requiredMaterials[i];
    if (!row || typeof row !== "object") continue;
    if (String(row.material_id || "").trim() === id) return row;
  }
  return null;
}

function resolveBaselineActivity(baseline, activityId) {
  if (!baseline || !Array.isArray(baseline.activities)) return null;
  var id = String(activityId || "").trim();
  for (var i = 0; i < baseline.activities.length; i += 1) {
    var act = baseline.activities[i];
    if (act && String(act.activity_id || "").trim() === id) return act;
  }
  return null;
}

function resolveRequiredMaterialRowForGam(activity, materialId, baseline) {
  var requiredOnCapture = Array.isArray(activity && activity.required_materials)
    ? activity.required_materials
    : [];
  var fromCapture = findRequiredMaterialRow(requiredOnCapture, materialId);
  if (fromCapture) return fromCapture;

  var baselineActivity = resolveBaselineActivity(baseline, activity && activity.activity_id);
  var requiredOnBaseline = Array.isArray(baselineActivity && baselineActivity.required_materials)
    ? baselineActivity.required_materials
    : [];
  return findRequiredMaterialRow(requiredOnBaseline, materialId);
}

function commissionedLearnerTableWorkspace(requiredRow) {
  if (!requiredRow || typeof requiredRow !== "object") return null;
  var rf = requiredRow.response_fulfilment;
  if (!rf || typeof rf !== "object") return null;
  if (String(rf.kind || "").trim() !== "learner_workspace") return null;
  if (!isTableFamilyWorkspaceMaterialType(requiredRow.material_type || requiredRow.type)) {
    return null;
  }
  return rf;
}

function appendGamLearnerWorkspaceBlankCellErrors(activity, activityIndex, baseline, errors) {
  if (!activity || typeof activity !== "object") return;
  var activityId = nonEmptyString(activity.activity_id)
    ? String(activity.activity_id).trim()
    : "activities[" + activityIndex + "]";
  var materials = Array.isArray(activity.materials) ? activity.materials : [];

  materials.forEach(function (material, materialIndex) {
    if (!material || typeof material !== "object") return;
    var materialId = nonEmptyString(material.material_id)
      ? String(material.material_id).trim()
      : "materials[" + materialIndex + "]";
    var requiredRow = resolveRequiredMaterialRowForGam(activity, materialId, baseline);
    var workspaceCommission = commissionedLearnerTableWorkspace(requiredRow);
    if (!workspaceCommission) return;

    var materialType = String(material.material_type || requiredRow.material_type || "").trim();
    if (!isTableFamilyWorkspaceMaterialType(materialType)) return;

    if (tableMaterialParse.materialHasBlankTableCells(material)) return;

    var responseKind = String(workspaceCommission.response_kind || "").trim() || "unknown";
    errors.push(
      "S78_WS_GAM_NO_BLANK_CELLS: activities[" +
        activityIndex +
        "] (" +
        activityId +
        ").materials[" +
        materialIndex +
        "] (" +
        materialId +
        ") material_type=" +
        materialType +
        " response_fulfilment.kind=learner_workspace response_kind=" +
        responseKind +
        " — GAM table body has no blank learner-response cells"
    );
  });
}

function appendGamPageLearnerWorkspaceBlankCellErrors(page, baseline, errors) {
  if (!page || typeof page !== "object") return;
  (Array.isArray(page.activities) ? page.activities : []).forEach(function (activity, index) {
    appendGamLearnerWorkspaceBlankCellErrors(activity, index, baseline, errors);
  });
}

module.exports = {
  TABLE_FAMILY_WORKSPACE_TYPES: TABLE_FAMILY_WORKSPACE_TYPES,
  isTableFamilyWorkspaceMaterialType: isTableFamilyWorkspaceMaterialType,
  resolveRequiredMaterialRowForGam: resolveRequiredMaterialRowForGam,
  commissionedLearnerTableWorkspace: commissionedLearnerTableWorkspace,
  appendGamLearnerWorkspaceBlankCellErrors: appendGamLearnerWorkspaceBlankCellErrors,
  appendGamPageLearnerWorkspaceBlankCellErrors: appendGamPageLearnerWorkspaceBlankCellErrors
};
