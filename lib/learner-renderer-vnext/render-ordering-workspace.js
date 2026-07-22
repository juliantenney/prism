"use strict";

var html = require("./render-html-utils");

function escapeAttr(value) {
  return html.escapeAttribute(String(value || ""));
}

function renderOrderingItem(item, index, total, workspaceId) {
  var position = index + 1;
  var content = String(item.content || "");
  var label = String(item.accessibleLabel || content);
  var isFirst = position === 1;
  var isLast = position === total;
  var upDisabled = isFirst ? " disabled" : "";
  var downDisabled = isLast ? " disabled" : "";

  return (
    '<li class="util-ordering-item" data-ordering-item-id="' +
    escapeAttr(item.itemId) +
    '" id="' +
    escapeAttr(item.domId) +
    '" data-position="' +
    escapeAttr(position) +
    '">' +
    '<div class="util-ordering-item__body">' +
    '<p class="util-ordering-item__position" aria-hidden="true">' +
    html.escapeHtml(String(position) + " of " + String(total)) +
    "</p>" +
    '<div class="util-ordering-item__content">' +
    html.renderMarkdownInline(content) +
    "</div>" +
    '<span class="util-visually-hidden">' +
    html.escapeHtml("Item " + position + " of " + total + ": " + label) +
    "</span>" +
    "</div>" +
    '<div class="util-ordering-item__controls">' +
    '<button type="button" class="util-ordering-item__move util-ordering-item__move--up"' +
    upDisabled +
    ' data-ordering-action="up" data-ordering-workspace-id="' +
    escapeAttr(workspaceId) +
    '" aria-label="' +
    escapeAttr('Move "' + label + '" up') +
    '">Move up</button>' +
    '<button type="button" class="util-ordering-item__move util-ordering-item__move--down"' +
    downDisabled +
    ' data-ordering-action="down" data-ordering-workspace-id="' +
    escapeAttr(workspaceId) +
    '" aria-label="' +
    escapeAttr('Move "' + label + '" down') +
    '">Move down</button>' +
    "</div>" +
    "</li>"
  );
}

/**
 * @param {Object} workspace
 * @returns {string}
 */
function renderOrderingWorkspace(workspace) {
  if (!workspace || workspace.capability !== "ordering") return "";
  var items = Array.isArray(workspace.items) ? workspace.items : [];
  if (items.length < 2) return "";

  var workspaceId = String(workspace.workspaceId || "");
  var label = String(workspace.label || workspace.responseLabel || "Sequence the stages").trim();
  var prompt = String(workspace.prompt || workspace.instruction || "").trim();
  var guidance = String(workspace.guidance || "").trim();
  var total = items.length;

  var listHtml = items
    .map(function (item, index) {
      return renderOrderingItem(item, index, total, workspaceId);
    })
    .join("");

  var promptHtml = prompt
    ? '<p class="util-ordering-workspace__prompt">' + html.renderMarkdownInline(prompt) + "</p>"
    : "";
  var guidanceHtml = guidance
    ? '<p class="util-learner-workspace__note">' + html.escapeHtml(guidance) + "</p>"
    : "";

  var checkHtml = "";
  if (workspace.validation && workspace.validation.mode === "exact_order") {
    checkHtml =
      '<div class="util-ordering-workspace__check">' +
      '<button type="button" class="util-ordering-workspace__check-btn" data-ordering-action="check" data-ordering-workspace-id="' +
      escapeAttr(workspaceId) +
      '">Check sequence</button>' +
      '<p class="util-ordering-workspace__feedback" data-ordering-feedback hidden></p>' +
      "</div>";
  }

  var initialOrderAttr = escapeAttr(
    JSON.stringify(
      items.map(function (item) {
        return item.itemId;
      })
    )
  );

  return (
    '<div class="util-learner-workspace util-ordering-workspace util-prose-measure" data-workspace-kind="ordering" data-workspace-capability="ordering" data-workspace-id="' +
    escapeAttr(workspaceId) +
    '" data-response-part-id="' +
    escapeAttr(workspace.responsePartId || "") +
    '" data-ordering-mode="' +
    escapeAttr(workspace.orderingMode || "sequence") +
    '" data-validation-mode="' +
    escapeAttr((workspace.validation && workspace.validation.mode) || "none") +
    '" data-initial-item-order="' +
    initialOrderAttr +
    '">' +
    '<h4 class="util-composition-subheading util-ordering-workspace__label">' +
    html.escapeHtml(label) +
    "</h4>" +
    promptHtml +
    '<ol class="util-ordering-list" data-ordering-list>' +
    listHtml +
    "</ol>" +
    '<div class="util-ordering-workspace__status" aria-live="polite" data-ordering-status></div>' +
    checkHtml +
    guidanceHtml +
    (workspace.validation && workspace.validation.mode === "exact_order"
      ? '<script type="application/json" class="util-ordering-expected" hidden>' +
        html.escapeHtml(JSON.stringify(workspace.validation.expectedOrder || [])) +
        "</script>"
      : "") +
    "</div>"
  );
}

module.exports = {
  renderOrderingWorkspace: renderOrderingWorkspace
};
