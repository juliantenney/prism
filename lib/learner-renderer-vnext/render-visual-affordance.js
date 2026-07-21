"use strict";

var html = require("./render-html-utils");

/**
 * Emit a hidden DOM hook for downstream visual enhancement (Sprint 36/38 contract).
 *
 * @param {import("./types").VisualAffordanceHook} hook
 * @returns {string}
 */
function renderVisualAffordanceHook(hook) {
  if (!hook || !hook.slot) return "";
  var slotId = String(hook.slot || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");
  if (!slotId) return "";

  var subject = String(hook.subject || "").trim();
  var activityId = String(hook.activityId || "").trim();
  var affordanceId = String(hook.affordanceId || "").trim();

  var attrs =
    ' class="util-visual-affordance util-visual-affordance--' +
    html.escapeAttribute(slotId) +
    '" data-visual-slot="' +
    html.escapeAttribute(slotId) +
    '" hidden aria-hidden="true"';

  if (subject) {
    attrs += ' data-visual-subject="' + html.escapeAttribute(subject) + '"';
  }
  if (activityId) {
    attrs += ' data-visual-activity-id="' + html.escapeAttribute(activityId) + '"';
    attrs += ' data-activity-id="' + html.escapeAttribute(activityId) + '"';
  }
  if (affordanceId) {
    attrs += ' data-affordance-id="' + html.escapeAttribute(affordanceId) + '"';
  }

  return "<div" + attrs + "></div>";
}

module.exports = {
  renderVisualAffordanceHook: renderVisualAffordanceHook
};
