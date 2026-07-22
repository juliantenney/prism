"use strict";

var collectResponseParts = require("./compose-response-parts").collectResponseParts;
var workspaceFromResponsePart =
  require("./learner-surface-registry").workspaceFromResponsePart;
var types = require("./response-part-types");

function findActivityTransferPrompt(modelActivity) {
  var beats = Array.isArray(modelActivity && modelActivity.beats) ? modelActivity.beats : [];
  for (var i = 0; i < beats.length; i += 1) {
    var prompts = Array.isArray(beats[i].prompts) ? beats[i].prompts : [];
    for (var j = 0; j < prompts.length; j += 1) {
      var prompt = prompts[j];
      if (
        String((prompt && prompt.sourceField) || "") === "transfer_or_application_task" &&
        String(prompt.text || "").trim()
      ) {
        return String(prompt.text || "").trim();
      }
    }
  }
  return "";
}

function dedupeResponseParts(parts) {
  var seenIds = Object.create(null);
  var hasTransfer = false;
  var diagnostics = [];
  var result = [];

  (Array.isArray(parts) ? parts : []).forEach(function (part) {
    var id = String(part.responsePartId || "");
    if (id && seenIds[id]) {
      diagnostics.push({
        code: types.DIAGNOSTIC.DUPLICATE_RESPONSE_PART,
        message: "Duplicate response part suppressed.",
        responsePartId: id
      });
      return;
    }

    var isTransferLike =
      part.sourceKind === types.SOURCE_KIND.TRANSFER_PROMPT ||
      (part.sourceKind === types.SOURCE_KIND.TASK_STEP &&
        /\b(transfer|identify another)\b/i.test(String(part.prompt || "")));
    if (isTransferLike) {
      if (hasTransfer) return;
      hasTransfer = true;
    }

    if (id) seenIds[id] = true;
    result.push(part);
  });

  return { parts: result, diagnostics: diagnostics };
}

/**
 * Compose normalised learner workspaces for a moment.
 *
 * @param {{
 *   activityId: string,
 *   modelActivity: import("./types").LearnerActivity,
 *   momentKind: string,
 *   items: import("./types").CompositionItem[],
 *   taskSteps: { sourceStepNumber: number, text: string }[],
 *   expectedOutput: import("./types").ExpectedOutputModel|null
 * }} context
 * @returns {{ workspaces: import("./types").WorkspaceRequirement[], diagnostics: Object[] }}
 */
function composeLearnerSurfaces(context) {
  var activityId = String(context.activityId || "");
  var modelActivity = context.modelActivity;
  var transferFallback =
    context.momentKind === "check" ? findActivityTransferPrompt(modelActivity) : "";

  var collected = collectResponseParts({
    activityId: activityId,
    momentKind: context.momentKind,
    items: context.items,
    taskSteps: context.taskSteps,
    expectedOutput: context.expectedOutput,
    activityPrompts: transferFallback ? { transfer: transferFallback } : undefined,
    modelActivity: modelActivity
  });

  var rawParts = Array.isArray(collected.parts) ? collected.parts : collected;
  var diagnostics = Array.isArray(collected.diagnostics) ? collected.diagnostics.slice() : [];

  var deduped = dedupeResponseParts(rawParts);
  var workspaces = [];
  diagnostics = diagnostics.concat(deduped.diagnostics);

  deduped.parts.forEach(function (part) {
    var mapped = workspaceFromResponsePart(part, { activityId: activityId });
    if (mapped.ok) {
      workspaces.push(mapped.workspace);
      return;
    }
    diagnostics.push(mapped.diagnostic);
  });

  workspaces.sort(function (a, b) {
    return Number(a.order || a.sourceStepNumber || 0) - Number(b.order || b.sourceStepNumber || 0);
  });

  return {
    workspaces: workspaces,
    diagnostics: diagnostics
  };
}

module.exports = {
  composeLearnerSurfaces: composeLearnerSurfaces,
  dedupeResponseParts: dedupeResponseParts,
  findActivityTransferPrompt: findActivityTransferPrompt
};
