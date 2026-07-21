"use strict";

var html = require("./render-html-utils");
var renderBeat = require("./render-beat").renderBeat;
var promptLabels = require("./prompt-labels");
var renderVisualAffordance =
  require("./render-visual-affordance").renderVisualAffordanceHook;
var learnerIcons = require("./learner-icon-renderer");

function renderMarkdownRegion(text) {
  return html.renderMarkdownBlock(text) || html.renderPlainText(text);
}

function renderActivityBadges(activity) {
  var badges = [];
  if (activity.durationMinutes != null) {
    badges.push(
      '<span class="util-badge util-badge-time">' +
        html.escapeHtml(String(activity.durationMinutes)) +
        " min</span>"
    );
  }
  if (String(activity.grouping || "").trim()) {
    badges.push(
      '<span class="util-badge util-badge-group">' +
        html.escapeHtml(activity.grouping) +
        "</span>"
    );
  }
  if (!badges.length) return "";
  return '<div class="util-badge-row">' + badges.join("") + "</div>";
}

function renderMappedOutcomes(mappedOutcomeIds) {
  var ids = html.arrayOrEmpty(mappedOutcomeIds).filter(Boolean);
  if (!ids.length) return "";
  var label =
    ids.length === 1
      ? "Supports " + ids[0]
      : "Supports " + ids.slice(0, -1).join(", ") + " and " + ids[ids.length - 1];
  return (
    '<p class="util-mapped-outcomes util-prose-measure util-icon-heading">' +
    learnerIcons.renderLabeledText(html.escapeHtml(label), "activity.mapped_outcomes", {
      size: "sm"
    }) +
    "</p>"
  );
}

function renderFraming(activity) {
  var parts = [];
  if (String(activity.preamble || "").trim()) {
    parts.push(
      '<div class="util-activity-preamble util-prose-measure util-icon-heading">' +
        learnerIcons.renderLabeledText(renderMarkdownRegion(activity.preamble), "activity.preamble", {
          size: "sm",
          blockLabel: true
        }) +
        "</div>"
    );
  }
  if (String(activity.reasoningOrientation || "").trim()) {
    parts.push(
      '<div class="util-pedagogical-guidance util-pedagogical-guidance--reasoning-orientation util-reasoning-orientation util-activity-preamble-cue util-pel-reasoning-cue util-prose-measure" data-guidance-type="reasoning_orientation">' +
        learnerIcons.renderGuidanceLabel(
          promptLabels.labelForPromptField("reasoning_orientation"),
          "reasoning_orientation"
        ) +
        '<div class="util-guidance-body"><p>' +
        html.renderMarkdownInline(activity.reasoningOrientation) +
        "</p></div></div>"
    );
  }
  if (!parts.length) return "";
  return '<div class="util-activity-framing">' + parts.join("") + "</div>";
}

/**
 * Render one canonical LearnerActivity without changing beat order.
 *
 * @param {import("./types").LearnerActivity} activity
 * @returns {string}
 */
function renderActivity(activity) {
  var activityId = String(activity.id || "");
  var beats = html.arrayOrEmpty(activity.beats).map(renderBeat).join("");
  var afterHeaderHook = activity.visualAffordanceAfterHeader
    ? renderVisualAffordance(activity.visualAffordanceAfterHeader)
    : "";

  return (
    '<article class="util-activity util-task-block util-vnext-activity" id="activity-' +
    html.escapeAttribute(activityId) +
    '" data-activity-id="' +
    html.escapeAttribute(activityId) +
    '">' +
    '<header class="util-activity-header">' +
    '<h2 class="util-activity-title">' +
    html.escapeHtml(activity.title) +
    "</h2>" +
    renderActivityBadges(activity) +
    "</header>" +
    afterHeaderHook +
    renderMappedOutcomes(activity.mappedOutcomeIds) +
    renderFraming(activity) +
    beats +
    "</article>"
  );
}

module.exports = {
  renderActivity: renderActivity
};
