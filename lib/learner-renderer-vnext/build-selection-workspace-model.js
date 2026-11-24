"use strict";

var types = require("./response-part-types");
var WORKSPACE_GUIDANCE = require("./compose-workspace").WORKSPACE_GUIDANCE;
var normalizeSelectionSemantics =
  require("./normalize-selection").normalizeSelectionSemantics;

/**
 * @param {import("./types").ResponsePart} part
 * @param {{ activityId?: string }} [options]
 * @returns {{ ok: true, workspace: object }|{ ok: false, diagnostic: object }}
 */
function buildSelectionWorkspaceModel(part, options) {
  var opts = options || {};
  var surfaceKind = String((part && part.surfaceKind) || "");
  if (
    surfaceKind !== types.SURFACE_KIND.SINGLE_SELECT &&
    surfaceKind !== types.SURFACE_KIND.MULTI_SELECT &&
    surfaceKind !== types.SURFACE_KIND.MATCHING
  ) {
    return {
      ok: false,
      diagnostic: {
        code: types.DIAGNOSTIC.UNSUPPORTED_LEARNER_SURFACE,
        message: "Not a selection surface.",
        surfaceKind: surfaceKind,
        responsePartId: part && part.responsePartId
      }
    };
  }

  var source = part && part.selection ? part.selection : part;
  var normalized = normalizeSelectionSemantics(source, {
    activityId: opts.activityId,
    materialId: part && part.provenance && part.provenance.materialId
  });
  if (!normalized.ok) {
    return {
      ok: false,
      diagnostic: (normalized.diagnostics && normalized.diagnostics[0]) || {
        code: "SELECTION_INVALID",
        message: "Invalid selection workspace.",
        responsePartId: part && part.responsePartId
      }
    };
  }

  var model = normalized.model;
  // Honour the response-part surface even if the payload used an alias.
  model.form = surfaceKind;
  model.surfaceKind = surfaceKind;

  var activityId = String(
    opts.activityId || (part.provenance && part.provenance.activityId) || "activity"
  );
  var responsePartId = String(part.responsePartId || "");
  var workspaceId =
    String(part.workspaceId || "").trim() ||
    "selection-" +
      activityId.replace(/[^a-z0-9]+/gi, "-").toLowerCase() +
      "-" +
      responsePartId.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  return {
    ok: true,
    workspace: {
      mode: "inline",
      capability: surfaceKind,
      kind: "selection",
      workspaceId: workspaceId,
      activityId: activityId,
      responsePartId: responsePartId,
      sourceStepNumber:
        part.sourceStepNumber == null ? Number(part.order) || 0 : Number(part.sourceStepNumber),
      instruction: String(part.prompt || model.prompt || part.label || "").trim(),
      responseLabel: String(part.label || model.label || "Your decision").trim(),
      label: String(part.label || model.label || "Your decision").trim(),
      prompt: String(part.prompt || model.prompt || "").trim(),
      guidance: String(part.guidance || WORKSPACE_GUIDANCE),
      sourceKind: String(part.sourceKind || "selection"),
      sourceId: String(part.sourceId || ""),
      order: Number(part.order) || 0,
      sequenceOrder:
        part.sequenceOrder != null && Number.isFinite(Number(part.sequenceOrder))
          ? Number(part.sequenceOrder)
          : undefined,
      selection: model,
      persistenceAvailable: true
    }
  };
}

module.exports = {
  buildSelectionWorkspaceModel: buildSelectionWorkspaceModel
};
