"use strict";

/**
 * Shared table material type registry for vNext static and workspace rendering.
 * Sprint 68 IMP-014A — classification_table and planning_table.
 */

var TABLE_MATERIAL_TYPES = Object.freeze({
  analysis_table: true,
  decision_table: true,
  comparison_table: true,
  classification_table: true,
  planning_table: true
});

/** Completion tables that always receive table_entry metadata in composed Do moments. */
var UNCONDITIONAL_COMPLETION_TABLE_TYPES = Object.freeze({
  analysis_table: true,
  decision_table: true,
  comparison_table: true
});

/**
 * Completion tables that route to table_entry only when the markdown table
 * contains blank learner-completion cells.
 */
var CONDITIONAL_COMPLETION_TABLE_TYPES = Object.freeze({
  classification_table: true,
  planning_table: true
});

function isTableMaterialType(materialType) {
  return !!TABLE_MATERIAL_TYPES[String(materialType || "").trim()];
}

function isUnconditionalCompletionTableType(materialType) {
  return !!UNCONDITIONAL_COMPLETION_TABLE_TYPES[String(materialType || "").trim()];
}

function isConditionalCompletionTableType(materialType) {
  return !!CONDITIONAL_COMPLETION_TABLE_TYPES[String(materialType || "").trim()];
}

module.exports = {
  TABLE_MATERIAL_TYPES: TABLE_MATERIAL_TYPES,
  UNCONDITIONAL_COMPLETION_TABLE_TYPES: UNCONDITIONAL_COMPLETION_TABLE_TYPES,
  CONDITIONAL_COMPLETION_TABLE_TYPES: CONDITIONAL_COMPLETION_TABLE_TYPES,
  isTableMaterialType: isTableMaterialType,
  isUnconditionalCompletionTableType: isUnconditionalCompletionTableType,
  isConditionalCompletionTableType: isConditionalCompletionTableType
};
