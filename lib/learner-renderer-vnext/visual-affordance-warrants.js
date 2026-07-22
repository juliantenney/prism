"use strict";

var tableTypes = require("./table-material-types");

var CARD_GRID_MATERIAL_TYPES = Object.freeze({
  scenario: true,
  prompt_set: true
});

var TABLE_MATERIAL_TYPES = tableTypes.TABLE_MATERIAL_TYPES;

var WARRANT_MATERIAL_TYPES = Object.freeze({
  scenario: true,
  prompt_set: true,
  analysis_table: true,
  decision_table: true,
  comparison_table: true,
  classification_table: true,
  planning_table: true,
  worked_example: true,
  template: true,
  checklist: true
});

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function collectActivityMaterials(activity) {
  var materials = [];
  arrayOrEmpty(activity && activity.beats).forEach(function (beat) {
    materials = materials.concat(arrayOrEmpty(beat.materials));
  });
  return materials;
}

function beatHasPromptField(activity, field) {
  return arrayOrEmpty(activity && activity.beats).some(function (beat) {
    return arrayOrEmpty(beat.prompts).some(function (prompt) {
      return String(prompt.sourceField || "") === field;
    });
  });
}

function materialsWarrantVisualAffordances(materials) {
  return arrayOrEmpty(materials).some(function (material) {
    return !!WARRANT_MATERIAL_TYPES[String(material.type || "")];
  });
}

function activityWarrantsAfterHeaderAffordance(activity) {
  var materials = collectActivityMaterials(activity);
  if (!materialsWarrantVisualAffordances(materials)) return false;
  if (String(activity.reasoningOrientation || "").trim()) return true;
  if (beatHasPromptField(activity, "transfer_or_application_task")) return true;
  if (beatHasPromptField(activity, "intellectual_coherence_bridge")) return true;
  return materialsWarrantVisualAffordances(materials);
}

function pageWarrantsAssessmentAffordance(model) {
  return arrayOrEmpty(model && model.assessment && model.assessment.items).length > 0;
}

function isCardGridMaterialType(type) {
  return !!CARD_GRID_MATERIAL_TYPES[String(type || "")];
}

function isTableMaterialType(type) {
  return !!TABLE_MATERIAL_TYPES[String(type || "")];
}

function tailWarrantsNextBlockAffordance(remainingSequence) {
  for (var i = 0; i < arrayOrEmpty(remainingSequence).length; i += 1) {
    var item = remainingSequence[i];
    if (!item || !item.kind) continue;
    if (item.kind === "material" && item.material) {
      var type = String(item.material.type || "");
      if (
        isTableMaterialType(type) ||
        type === "template" ||
        type === "checklist" ||
        type === "prompt_set" ||
        type === "worked_example"
      ) {
        return true;
      }
    }
    if (item.kind === "expectedOutput") return true;
  }
  return false;
}

function findNextMaterialItem(remainingSequence) {
  for (var i = 0; i < arrayOrEmpty(remainingSequence).length; i += 1) {
    var item = remainingSequence[i];
    if (item && item.kind === "material" && item.material) return item.material;
  }
  return null;
}

function legacyWarrantForSlot(slot, activity, remainingSequence) {
  if (slot === "activity-after-header") {
    return activityWarrantsAfterHeaderAffordance(activity);
  }
  if (slot === "materials-entry") return true;
  if (slot === "materials-card-grid-after") {
    return tailWarrantsNextBlockAffordance(remainingSequence);
  }
  if (slot === "materials-table-pair-between") {
    var nextMaterial = findNextMaterialItem(remainingSequence);
    return nextMaterial ? isTableMaterialType(nextMaterial.type) : false;
  }
  if (slot === "assessment-before-checkpoint") {
    return true;
  }
  return false;
}

module.exports = {
  CARD_GRID_MATERIAL_TYPES: CARD_GRID_MATERIAL_TYPES,
  TABLE_MATERIAL_TYPES: TABLE_MATERIAL_TYPES,
  materialsWarrantVisualAffordances: materialsWarrantVisualAffordances,
  activityWarrantsAfterHeaderAffordance: activityWarrantsAfterHeaderAffordance,
  pageWarrantsAssessmentAffordance: pageWarrantsAssessmentAffordance,
  isCardGridMaterialType: isCardGridMaterialType,
  isTableMaterialType: isTableMaterialType,
  tailWarrantsNextBlockAffordance: tailWarrantsNextBlockAffordance,
  legacyWarrantForSlot: legacyWarrantForSlot
};
