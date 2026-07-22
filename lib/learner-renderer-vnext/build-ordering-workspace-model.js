"use strict";

var WORKSPACE_GUIDANCE = require("./compose-workspace").WORKSPACE_GUIDANCE;

/**
 * @param {import("./types").ResponsePart} part
 * @param {{ activityId?: string }} [options]
 * @returns {{ ok: true, workspace: Object }|{ ok: false, diagnostic: Object }}
 */
function buildOrderingWorkspaceModel(part, options) {
  var opts = options || {};
  var ordering = part && part.ordering;
  if (!ordering || !Array.isArray(ordering.items) || ordering.items.length < 2) {
    return {
      ok: false,
      diagnostic: {
        code: "ORDERING_ITEMS_MISSING",
        message: "Ordering workspace requires at least two items.",
        responsePartId: part && part.responsePartId
      }
    };
  }

  var activityId = String(opts.activityId || (part.provenance && part.provenance.activityId) || "activity");
  var responsePartId = String(part.responsePartId || "");
  var workspaceId =
    "ordering-" +
    activityId.replace(/[^a-z0-9]+/gi, "-").toLowerCase() +
    "-" +
    responsePartId.replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  var expectedPositions = Object.create(null);
  (Array.isArray(ordering.expectedOrder) ? ordering.expectedOrder : []).forEach(function (itemId, index) {
    expectedPositions[String(itemId)] = index + 1;
  });

  var renderItems = (Array.isArray(ordering.initialItems) && ordering.initialItems.length
    ? ordering.initialItems
    : ordering.items
  ).map(function (item, index) {
    var itemId = String(item.itemId || "");
    return {
      itemId: itemId,
      domId: workspaceId + "-item-" + itemId.replace(/[^a-z0-9]+/gi, "-").toLowerCase(),
      content: String(item.content || ""),
      accessibleLabel: String(item.accessibleLabel || item.content || ""),
      initialPosition: index + 1,
      expectedPosition: expectedPositions[itemId] || null
    };
  });

  return {
    ok: true,
    workspace: {
      mode: "inline",
      capability: "ordering",
      kind: "ordering",
      workspaceId: workspaceId,
      activityId: activityId,
      responsePartId: responsePartId,
      sourceStepNumber: part.sourceStepNumber == null ? Number(part.order) || 0 : Number(part.sourceStepNumber),
      instruction: String(part.prompt || part.label || "").trim(),
      responseLabel: String(part.label || "Sequence the stages").trim(),
      label: String(part.label || "Sequence the stages").trim(),
      prompt: String(part.prompt || "").trim(),
      guidance: String(part.guidance || WORKSPACE_GUIDANCE),
      sourceKind: String(part.sourceKind || "ordering"),
      sourceId: String(part.sourceId || ""),
      order: Number(part.order) || 0,
      orderingMode: String(ordering.mode || "sequence"),
      items: renderItems,
      validation: {
        mode: String(ordering.validationMode || "none"),
        expectedOrder: Array.isArray(ordering.expectedOrder) ? ordering.expectedOrder.slice() : []
      },
      persistenceAvailable: true
    }
  };
}

module.exports = {
  buildOrderingWorkspaceModel: buildOrderingWorkspaceModel
};
