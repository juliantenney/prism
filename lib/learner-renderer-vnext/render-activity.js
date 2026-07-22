"use strict";

var html = require("./render-html-utils");
var renderBeat = require("./render-beat").renderBeat;
var promptLabels = require("./prompt-labels");
var renderVisualAffordance =
  require("./render-visual-affordance").renderVisualAffordanceHook;
var learnerIcons = require("./learner-icon-renderer");
var renderComposedMoment = require("./render-composed-moment");

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

function shouldOmitBeat(beat, composition) {
  if (!composition || !Array.isArray(composition.omitBeatFunctions)) return false;
  return composition.omitBeatFunctions.indexOf(String(beat.sourceFunction || "")) >= 0;
}

function beatSuppression(beat, composition) {
  if (!composition || !composition.suppressBeatContent) return null;
  return composition.suppressBeatContent[String(beat.sourceFunction || "")] || null;
}

function defaultMomentBeat(composition, kind) {
  if (!composition) return null;
  if (kind === "learn") {
    return composition.learnMomentBeat || "explanation";
  }
  if (kind === "do") {
    return composition.doMomentBeat || "check_understanding";
  }
  if (kind === "check") {
    return composition.checkMomentBeat || "check_understanding";
  }
  return null;
}

function shouldInjectMoment(composition, kind, beatFunction) {
  if (!composition) return false;
  return String(beatFunction || "") === defaultMomentBeat(composition, kind);
}

function renderActivityBeats(activity, composition) {
  var beats = html.arrayOrEmpty(activity.beats).filter(function (beat) {
    return !shouldOmitBeat(beat, composition);
  });
  var parts = [];
  var learnRendered = false;
  var doRendered = false;
  var checkRendered = false;

  beats.forEach(function (beat) {
    var beatFunction = String(beat.sourceFunction || "");

    if (composition && composition.learnMoment && !learnRendered && shouldInjectMoment(composition, "learn", beatFunction)) {
      parts.push(renderComposedMoment.renderLearnMoment(composition.learnMoment, activity.id));
      learnRendered = true;
    }

    if (composition && composition.doMoment && !doRendered && shouldInjectMoment(composition, "do", beatFunction)) {
      parts.push(renderComposedMoment.renderDoMoment(composition.doMoment, activity.id));
      doRendered = true;
    }

    if (composition && composition.checkMoment && !checkRendered && shouldInjectMoment(composition, "check", beatFunction)) {
      parts.push(renderComposedMoment.renderCheckMoment(composition.checkMoment, activity.id));
      checkRendered = true;
    }

    parts.push(renderBeat(beat, beatSuppression(beat, composition)));
  });

  if (composition && composition.learnMoment && !learnRendered) {
    parts.push(renderComposedMoment.renderLearnMoment(composition.learnMoment, activity.id));
  }
  if (composition && composition.doMoment && !doRendered) {
    parts.push(renderComposedMoment.renderDoMoment(composition.doMoment, activity.id));
  }
  if (composition && composition.checkMoment && !checkRendered) {
    parts.push(renderComposedMoment.renderCheckMoment(composition.checkMoment, activity.id));
  }

  return parts.join("");
}

/**
 * Render one canonical LearnerActivity without changing beat order.
 *
 * @param {import("./types").LearnerActivity} activity
 * @param {import("./types").ActivityCompositionRenderHints=} composition
 * @returns {string}
 */
function renderActivity(activity, composition) {
  var activityId = String(activity.id || "");
  var renderPath =
    composition && composition.renderPath ? String(composition.renderPath) : "beats-fallback";
  var beats = renderActivityBeats(activity, composition);
  var afterHeaderHook = activity.visualAffordanceAfterHeader
    ? renderVisualAffordance(activity.visualAffordanceAfterHeader)
    : "";
  var composedOrient =
    composition && composition.orientMoment
      ? renderComposedMoment.renderOrientMoment(composition.orientMoment, activityId)
      : "";
  var framing =
    composition && composition.suppressFraming ? "" : renderFraming(activity);

  return (
    '<article class="util-activity util-task-block util-vnext-activity" id="activity-' +
    html.escapeAttribute(activityId) +
    '" data-activity-id="' +
    html.escapeAttribute(activityId) +
    '" data-render-path="' +
    html.escapeAttribute(renderPath) +
    '">' +
    '<header class="util-activity-header">' +
    '<h2 class="util-activity-title">' +
    html.escapeHtml(activity.title) +
    "</h2>" +
    renderActivityBadges(activity) +
    "</header>" +
    afterHeaderHook +
    renderMappedOutcomes(activity.mappedOutcomeIds) +
    composedOrient +
    framing +
    beats +
    "</article>"
  );
}

module.exports = {
  renderActivity: renderActivity,
  renderFraming: renderFraming,
  shouldOmitBeat: shouldOmitBeat,
  beatSuppression: beatSuppression
};
