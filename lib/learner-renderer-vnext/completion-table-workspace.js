"use strict";

/**
 * Completion-table workspace classification for composed Do moments.
 * Reference tables in Learn remain on the static material path.
 */

var COMPLETION_TABLE_MATERIAL_TYPES = Object.freeze({
  analysis_table: true,
  decision_table: true,
  comparison_table: true
});

var TABLE_WORKSPACE_GUIDANCE =
  "Enter your responses in the table below. Your answers are not saved on this page. Copy important work to your notes if you need to keep it.";

function isCompletionTableMaterialType(materialType) {
  return !!COMPLETION_TABLE_MATERIAL_TYPES[String(materialType || "").trim()];
}

/**
 * Whether a Do-moment material item should receive table-workspace metadata.
 *
 * @param {import("./types").LearnerMaterial|null|undefined} material
 * @returns {boolean}
 */
function shouldComposeTableWorkspaceMaterial(material) {
  if (!material) return false;
  return isCompletionTableMaterialType(material.type);
}

module.exports = {
  COMPLETION_TABLE_MATERIAL_TYPES: COMPLETION_TABLE_MATERIAL_TYPES,
  TABLE_WORKSPACE_GUIDANCE: TABLE_WORKSPACE_GUIDANCE,
  isCompletionTableMaterialType: isCompletionTableMaterialType,
  shouldComposeTableWorkspaceMaterial: shouldComposeTableWorkspaceMaterial
};
