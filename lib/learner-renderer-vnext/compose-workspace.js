"use strict";

/**
 * Deterministic workspace rules for composed Do moments.
 * Activity-scoped classification — not a general-purpose task classifier.
 */

var A1_WRITTEN_RESPONSE_STEP = 5;
var A4_PROMPT_SET_RESPONSE_STEP = 3;
var A5_WRITTEN_JUDGEMENT_STEP = 4;

var WORKSPACE_GUIDANCE =
  "Your response is not saved on this page. Copy it to your notes if you need to keep it.";

/**
 * @param {number} sourceStepNumber
 * @param {string} instruction
 * @param {string} responseLabel
 * @returns {import("./types").WorkspaceRequirement}
 */
function buildTextEntryWorkspace(sourceStepNumber, instruction, responseLabel) {
  return {
    mode: "inline",
    capability: "text_entry",
    sourceStepNumber: sourceStepNumber,
    instruction: instruction,
    responseLabel: responseLabel,
    persistenceAvailable: false,
    guidance: WORKSPACE_GUIDANCE
  };
}

/**
 * @param {string} activityId
 * @param {{ sourceStepNumber: number, text: string }|null} taskStep
 * @returns {import("./types").WorkspaceRequirement|null}
 */
function determineWorkspaceRequirement(activityId, taskStep) {
  var id = String(activityId || "").trim();
  if (!taskStep || !String(taskStep.text || "").trim()) return null;

  var stepNumber = Number(taskStep.sourceStepNumber);
  var stepText = String(taskStep.text || "").trim();

  if (id === "A1") {
    if (stepNumber !== A1_WRITTEN_RESPONSE_STEP) return null;
    if (!/^Write\b/i.test(stepText)) return null;
    return buildTextEntryWorkspace(stepNumber, stepText, "Record your response");
  }

  if (id === "A4") {
    if (stepNumber !== A4_PROMPT_SET_RESPONSE_STEP) return null;
    if (!/^Complete the prompt set\b/i.test(stepText)) return null;
    return buildTextEntryWorkspace(stepNumber, stepText, "Explain the chain of effects");
  }

  if (id === "A5") {
    if (stepNumber !== A5_WRITTEN_JUDGEMENT_STEP) return null;
    if (!/^Produce an independent written judgement\b/i.test(stepText)) return null;
    return buildTextEntryWorkspace(
      stepNumber,
      stepText,
      "Write your justified recommendation"
    );
  }

  return null;
}

/**
 * Resolve ordered workspace requirements for composed Do steps.
 *
 * @param {string} activityId
 * @param {{ sourceStepNumber: number, text: string }[]} taskSteps
 * @param {number[]} stepNumbers
 * @returns {import("./types").WorkspaceRequirement[]}
 */
function determineWorkspaceRequirements(activityId, taskSteps, stepNumbers) {
  var steps = Array.isArray(taskSteps) ? taskSteps : [];
  var numbers = Array.isArray(stepNumbers) ? stepNumbers : [];
  var workspaces = [];
  numbers.forEach(function (stepNumber) {
    var taskStep = steps.find(function (entry) {
      return Number(entry && entry.sourceStepNumber) === Number(stepNumber);
    });
    var workspace = determineWorkspaceRequirement(activityId, taskStep || null);
    if (workspace) workspaces.push(workspace);
  });
  return workspaces;
}

module.exports = {
  A1_WRITTEN_RESPONSE_STEP: A1_WRITTEN_RESPONSE_STEP,
  A4_PROMPT_SET_RESPONSE_STEP: A4_PROMPT_SET_RESPONSE_STEP,
  A5_WRITTEN_JUDGEMENT_STEP: A5_WRITTEN_JUDGEMENT_STEP,
  WORKSPACE_GUIDANCE: WORKSPACE_GUIDANCE,
  buildTextEntryWorkspace: buildTextEntryWorkspace,
  determineWorkspaceRequirement: determineWorkspaceRequirement,
  determineWorkspaceRequirements: determineWorkspaceRequirements
};
