"use strict";

var types = require("./response-part-types");
var WORKSPACE_GUIDANCE =
  require("./compose-workspace").WORKSPACE_GUIDANCE;
var buildOrderingWorkspaceModel =
  require("./build-ordering-workspace-model").buildOrderingWorkspaceModel;

/**
 * @param {import("./types").ResponsePart} part
 * @param {{ activityId?: string }} [options]
 * @returns {{ ok: true, workspace: import("./types").WorkspaceRequirement }|{ ok: false, diagnostic: Object }}
 */
function workspaceFromResponsePart(part, options) {
  var surfaceKind = String((part && part.surfaceKind) || types.SURFACE_KIND.TEXT_ENTRY);

  switch (surfaceKind) {
    case types.SURFACE_KIND.TEXT_ENTRY:
      return {
        ok: true,
        workspace: {
          mode: "inline",
          capability: "text_entry",
          sourceStepNumber:
            part.sourceStepNumber == null ? Number(part.order) || 0 : Number(part.sourceStepNumber),
          instruction: String(part.prompt || part.label || "").trim(),
          responseLabel: String(part.label || "Your response").trim(),
          prompt: String(part.prompt || "").trim(),
          responsePartId: String(part.responsePartId || ""),
          sourceKind: String(part.sourceKind || ""),
          sourceId: String(part.sourceId || ""),
          order: Number(part.order) || 0,
          rows: Number(part.rows) > 0 ? Number(part.rows) : 6,
          persistenceAvailable: true,
          guidance: String(part.guidance || WORKSPACE_GUIDANCE)
        }
      };
    case types.SURFACE_KIND.TABLE_ENTRY:
      return {
        ok: false,
        diagnostic: {
          code: types.DIAGNOSTIC.UNSUPPORTED_LEARNER_SURFACE,
          message: "table_entry must be composed via table workspace materials, not response parts.",
          surfaceKind: surfaceKind,
          responsePartId: part.responsePartId
        }
      };
    case types.SURFACE_KIND.ORDERING:
      return buildOrderingWorkspaceModel(part, options);
    case types.SURFACE_KIND.MATCHING:
    case types.SURFACE_KIND.SINGLE_SELECT:
    case types.SURFACE_KIND.MULTI_SELECT:
      return {
        ok: false,
        diagnostic: {
          code: types.DIAGNOSTIC.UNSUPPORTED_LEARNER_SURFACE,
          message: "Learner surface is recognised but not yet implemented.",
          surfaceKind: surfaceKind,
          responsePartId: part.responsePartId
        }
      };
    default:
      return {
        ok: false,
        diagnostic: {
          code: types.DIAGNOSTIC.UNSUPPORTED_LEARNER_SURFACE,
          message: "Unknown learner surface kind.",
          surfaceKind: surfaceKind,
          responsePartId: part.responsePartId
        }
      };
  }
}

module.exports = {
  workspaceFromResponsePart: workspaceFromResponsePart
};
