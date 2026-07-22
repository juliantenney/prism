"use strict";

/**
 * Evidence-based workspace rules for composed Do moments.
 * Sprint 68 IMP-013 — activity-ID-independent classification.
 */

var WORKSPACE_GUIDANCE =
  "Your response is not saved on this page. Copy it to your notes if you need to keep it.";

/** @deprecated Reference constants retained for heteroscedasticity regression tests. */
var A1_WRITTEN_RESPONSE_STEP = 5;
/** @deprecated Reference constants retained for heteroscedasticity regression tests. */
var A4_PROMPT_SET_RESPONSE_STEP = 3;
/** @deprecated Reference constants retained for heteroscedasticity regression tests. */
var A5_WRITTEN_JUDGEMENT_STEP = 4;

/**
 * Ordered text-entry rules — first match wins.
 * Patterns are intentionally specific to avoid turning instructional prose into inputs.
 */
var TEXT_ENTRY_RULES = Object.freeze([
  {
    pattern: /^Produce an independent written judgement\b/i,
    label: "Write your justified recommendation"
  },
  {
    pattern: /^Complete the prompt set by explaining\b/i,
    label: "Explain the chain of effects"
  },
  {
    pattern: /^Complete the prompt set responses?\b/i,
    label: "Record your responses"
  },
  {
    pattern: /^Complete the prompt set\b/i,
    label: "Explain the chain of effects"
  },
  {
    pattern: /^Write a brief summary\b/i,
    label: "Record your response"
  },
  {
    pattern: /^Write a brief explanation\b/i,
    label: "Record your response"
  },
  {
    pattern: /^Write\b/i,
    label: "Record your response"
  }
]);

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
 * @param {{ sourceStepNumber: number, text: string }|null} taskStep
 * @returns {import("./types").WorkspaceRequirement|null}
 */
function determineWorkspaceRequirement(taskStep) {
  if (!taskStep || !String(taskStep.text || "").trim()) return null;

  var stepNumber = Number(taskStep.sourceStepNumber);
  var stepText = String(taskStep.text || "").trim();

  for (var i = 0; i < TEXT_ENTRY_RULES.length; i += 1) {
    var rule = TEXT_ENTRY_RULES[i];
    if (rule.pattern.test(stepText)) {
      return buildTextEntryWorkspace(stepNumber, stepText, rule.label);
    }
  }

  return null;
}

/**
 * Resolve ordered workspace requirements for composed Do steps.
 *
 * @param {{ sourceStepNumber: number, text: string }[]} taskSteps
 * @param {number[]} stepNumbers
 * @returns {import("./types").WorkspaceRequirement[]}
 */
function determineWorkspaceRequirements(taskSteps, stepNumbers) {
  var steps = Array.isArray(taskSteps) ? taskSteps : [];
  var numbers = Array.isArray(stepNumbers) ? stepNumbers : [];
  var workspaces = [];
  numbers.forEach(function (stepNumber) {
    var taskStep = steps.find(function (entry) {
      return Number(entry && entry.sourceStepNumber) === Number(stepNumber);
    });
    var workspace = determineWorkspaceRequirement(taskStep || null);
    if (workspace) workspaces.push(workspace);
  });
  return workspaces;
}

module.exports = {
  A1_WRITTEN_RESPONSE_STEP: A1_WRITTEN_RESPONSE_STEP,
  A4_PROMPT_SET_RESPONSE_STEP: A4_PROMPT_SET_RESPONSE_STEP,
  A5_WRITTEN_JUDGEMENT_STEP: A5_WRITTEN_JUDGEMENT_STEP,
  TEXT_ENTRY_RULES: TEXT_ENTRY_RULES,
  WORKSPACE_GUIDANCE: WORKSPACE_GUIDANCE,
  buildTextEntryWorkspace: buildTextEntryWorkspace,
  determineWorkspaceRequirement: determineWorkspaceRequirement,
  determineWorkspaceRequirements: determineWorkspaceRequirements
};
