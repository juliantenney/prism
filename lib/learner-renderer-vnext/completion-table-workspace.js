"use strict";

/**
 * Completion-table workspace classification for composed Do moments.
 * Reference tables in Learn remain on the static material path.
 */

var tableTypes = require("./table-material-types");
var tableParse = require("./table-material-parse");

var TABLE_WORKSPACE_GUIDANCE =
  "Enter your responses in the table below. Your draft is saved on this device when possible. It is not submitted.";

/** @deprecated Use UNCONDITIONAL_COMPLETION_TABLE_TYPES from table-material-types.js */
var COMPLETION_TABLE_MATERIAL_TYPES = tableTypes.UNCONDITIONAL_COMPLETION_TABLE_TYPES;

function isCompletionTableMaterialType(materialType) {
  var type = String(materialType || "").trim();
  return (
    tableTypes.isUnconditionalCompletionTableType(type) ||
    tableTypes.isConditionalCompletionTableType(type)
  );
}

/**
 * Whether a Do-moment material item should receive table-workspace metadata.
 *
 * Unconditional completion tables (analysis/decision/comparison) always route
 * to table_entry in Do moments. Classification and planning tables route only
 * when the markdown table contains blank learner-completion cells.
 *
 * @param {import("./types").LearnerMaterial|null|undefined} material
 * @returns {boolean}
 */
function shouldComposeTableWorkspaceMaterial(material) {
  if (!material) return false;
  var type = String(material.type || "").trim();
  if (tableTypes.isUnconditionalCompletionTableType(type)) return true;
  if (tableTypes.isConditionalCompletionTableType(type)) {
    return tableParse.materialHasBlankTableCells(material);
  }
  return false;
}

module.exports = {
  COMPLETION_TABLE_MATERIAL_TYPES: COMPLETION_TABLE_MATERIAL_TYPES,
  TABLE_WORKSPACE_GUIDANCE: TABLE_WORKSPACE_GUIDANCE,
  isCompletionTableMaterialType: isCompletionTableMaterialType,
  shouldComposeTableWorkspaceMaterial: shouldComposeTableWorkspaceMaterial
};
