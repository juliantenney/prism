"use strict";

var buildBeatContentSequence =
  require("./build-beat-content-sequence").buildBeatContentSequence;

/**
 * Apply source-driven suppression to a beat copy for rendering.
 *
 * @param {import("./types").LearnerBeat} beat
 * @param {{ omitInstructionSteps?: number[], omitMaterialIds?: string[], omitExpectedOutput?: boolean, omitPromptSourceFields?: string[] }|null} suppression
 * @returns {import("./types").LearnerBeat}
 */
function applyBeatContentSuppression(beat, suppression) {
  if (!beat || !suppression) return beat;

  var omitSteps = Array.isArray(suppression.omitInstructionSteps)
    ? suppression.omitInstructionSteps
    : [];
  var omitMaterialIds = Array.isArray(suppression.omitMaterialIds)
    ? suppression.omitMaterialIds
    : [];
  var stepSet = Object.create(null);
  omitSteps.forEach(function (step) {
    stepSet[Number(step)] = true;
  });
  var materialSet = Object.create(null);
  omitMaterialIds.forEach(function (materialId) {
    materialSet[String(materialId)] = true;
  });

  var omitPromptFields = Array.isArray(suppression.omitPromptSourceFields)
    ? suppression.omitPromptSourceFields
    : [];
  var promptFieldSet = Object.create(null);
  omitPromptFields.forEach(function (field) {
    promptFieldSet[String(field)] = true;
  });

  var filtered = {
    sourceFunction: beat.sourceFunction,
    learnerRole: beat.learnerRole,
    learnerLabel: beat.learnerLabel,
    instructions: (Array.isArray(beat.instructions) ? beat.instructions : []).filter(
      function (instruction) {
        return !stepSet[Number(instruction && instruction.sourceStepNumber)];
      }
    ),
    prompts: (Array.isArray(beat.prompts) ? beat.prompts : []).filter(function (prompt) {
      return !promptFieldSet[String((prompt && prompt.sourceField) || "")];
    }),
    materials: (Array.isArray(beat.materials) ? beat.materials : []).filter(function (material) {
      return !materialSet[String((material && material.id) || "")];
    }),
    expectedOutput: suppression.omitExpectedOutput ? null : beat.expectedOutput,
    contentSequence: []
  };

  filtered.contentSequence = buildBeatContentSequence(filtered);
  return filtered;
}

/**
 * Merge two beat suppression descriptors for the same beat function.
 *
 * @param {{ omitInstructionSteps?: number[], omitMaterialIds?: string[], omitExpectedOutput?: boolean, omitPromptSourceFields?: string[] }|null} left
 * @param {{ omitInstructionSteps?: number[], omitMaterialIds?: string[], omitExpectedOutput?: boolean, omitPromptSourceFields?: string[] }|null} right
 * @returns {{ omitInstructionSteps: number[], omitMaterialIds: string[], omitExpectedOutput: boolean, omitPromptSourceFields: string[] }}
 */
function mergeBeatSuppressionEntry(left, right) {
  var mergedSteps = Object.create(null);
  var mergedMaterials = Object.create(null);
  var mergedPromptFields = Object.create(null);
  [left, right].forEach(function (entry) {
    if (!entry) return;
    (Array.isArray(entry.omitInstructionSteps) ? entry.omitInstructionSteps : []).forEach(
      function (step) {
        mergedSteps[Number(step)] = true;
      }
    );
    (Array.isArray(entry.omitMaterialIds) ? entry.omitMaterialIds : []).forEach(function (id) {
      mergedMaterials[String(id)] = true;
    });
    (Array.isArray(entry.omitPromptSourceFields) ? entry.omitPromptSourceFields : []).forEach(
      function (field) {
        mergedPromptFields[String(field)] = true;
      }
    );
  });
  return {
    omitInstructionSteps: Object.keys(mergedSteps)
      .map(Number)
      .sort(function (a, b) {
        return a - b;
      }),
    omitMaterialIds: Object.keys(mergedMaterials).sort(),
    omitExpectedOutput: !!((left && left.omitExpectedOutput) || (right && right.omitExpectedOutput)),
    omitPromptSourceFields: Object.keys(mergedPromptFields).sort()
  };
}

module.exports = {
  applyBeatContentSuppression: applyBeatContentSuppression,
  mergeBeatSuppressionEntry: mergeBeatSuppressionEntry
};
