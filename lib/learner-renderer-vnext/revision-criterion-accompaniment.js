"use strict";

/**
 * S81-T-008 R4 — revision-pass criterion accompaniment (markup helpers).
 * Activity-level Task landing only; no criterion→field mapping.
 */

var taskCheckNav = require("./task-check-navigation");

function revisionGuidanceId(activityId) {
  return "learner-revision-guidance-" + taskCheckNav.slugifyActivityId(activityId);
}

function revisionReminderId(activityId) {
  return "learner-revision-reminder-" + taskCheckNav.slugifyActivityId(activityId);
}

/**
 * Explicit Check-side revise control. Without JS: navigates to Task (R1 target).
 * With PE: also activates criterion guidance on that activity's Task region.
 *
 * @param {string} activityId
 * @param {string} criterionId
 * @param {{ escapeAttribute: Function, escapeHtml: Function }} html
 * @returns {string}
 */
function renderReviseWithCriterionAction(activityId, criterionId, html) {
  var taskId = taskCheckNav.taskLandmarkId(activityId);
  var cid = String(criterionId || "").trim();
  if (!cid) return "";
  return (
    '<p class="util-revision-criterion-action">' +
    '<a class="util-revision-criterion-action__link" href="#' +
    html.escapeAttribute(taskId) +
    '" data-revise-with-criterion="true" data-activity-id="' +
    html.escapeAttribute(String(activityId || "")) +
    '" data-revision-criterion-id="' +
    html.escapeAttribute(cid) +
    '">Revise with this criterion</a></p>'
  );
}

/**
 * Compact sticky reminder host (PE shows only when full guidance leaves viewport).
 *
 * @param {string} activityId
 * @param {{ escapeAttribute: Function, escapeHtml: Function }} html
 * @returns {string}
 */
function renderRevisionReminderHost(activityId, html) {
  var reminderId = revisionReminderId(activityId);
  return (
    '<div class="util-revision-reminder" id="' +
    html.escapeAttribute(reminderId) +
    '" hidden data-revision-reminder="true" data-activity-id="' +
    html.escapeAttribute(String(activityId || "")) +
    '" role="status">' +
    '<div class="util-revision-reminder__chrome">' +
    '<p class="util-revision-reminder__label">Revising against</p>' +
    '<button type="button" class="util-revision-reminder__view" data-revision-reminder-view>' +
    "View guidance</button>" +
    "</div>" +
    '<p class="util-revision-reminder__statement" data-revision-reminder-statement></p>' +
    "</div>"
  );
}

/**
 * Empty Task-side full guidance host. Visible only when PE sets an active criterion.
 * Scrolls with the document (not sticky).
 *
 * @param {string} activityId
 * @param {{ escapeAttribute: Function, escapeHtml: Function }} html
 * @returns {string}
 */
function renderRevisionGuidanceHost(activityId, html) {
  var guidanceId = revisionGuidanceId(activityId);
  var headingId = guidanceId + "-heading";
  return (
    renderRevisionReminderHost(activityId, html) +
    '<aside class="util-revision-guidance" id="' +
    html.escapeAttribute(guidanceId) +
    '" hidden data-revision-guidance="true" data-activity-id="' +
    html.escapeAttribute(String(activityId || "")) +
    '" aria-labelledby="' +
    html.escapeAttribute(headingId) +
    '">' +
    '<div class="util-revision-guidance__chrome">' +
    '<h4 class="util-revision-guidance__heading" id="' +
    html.escapeAttribute(headingId) +
    '" tabindex="-1">Review guidance</h4>' +
    '<button type="button" class="util-revision-guidance__hide" data-revision-guidance-hide>' +
    "Hide guidance</button>" +
    "</div>" +
    '<p class="util-revision-guidance__honesty">' +
    "This is review guidance you chose to keep in view while you revise. " +
    "You decide whether your response meets the criterion. " +
    "Prism does not mark or score your answer." +
    "</p>" +
    '<div class="util-revision-guidance__body" data-revision-guidance-body></div>' +
    "</aside>"
  );
}

/**
 * Compact sticky/fixed reminder styles for static export and PE.
 * Kept local so learner HTML does not depend on app.js for this experiment.
 *
 * @returns {string}
 */
function getRevisionReminderPresentationCss() {
  return [
    ".util-learner-renderer-vnext .util-revision-reminder{display:none}",
    // Sit below sticky journey nav via shell token --learner-sticky-nav-height (0 when absent).
    // Journey nav keeps z-index:50; reminder stays z-index:40.
    ".util-learner-renderer-vnext .util-revision-reminder[data-revision-reminder-active=\"true\"]{",
    "display:block;position:fixed;top:var(--learner-sticky-nav-height,0px);left:0;right:0;z-index:40;",
    "margin:0 auto;max-width:42rem;width:calc(100% - 1.5rem);",
    "padding:.45rem .75rem;border:1px solid #cbd5e1;border-left:3px solid #64748b;",
    "background:#fff;box-shadow:0 2px 8px rgba(15,23,42,.12)",
    "}",
    ".util-learner-renderer-vnext .util-revision-reminder__chrome{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:.35rem .75rem;margin:0 0 .2rem}",
    ".util-learner-renderer-vnext .util-revision-reminder__label{margin:0;font-size:.75rem;font-weight:650;color:#64748b}",
    ".util-learner-renderer-vnext .util-revision-reminder__statement{margin:0;font-size:.9rem;line-height:1.4;font-weight:600;color:#0f172a}",
    ".util-learner-renderer-vnext .util-revision-reminder__view{font:inherit;font-size:.9rem;color:#1d4ed8;background:transparent;border:0;padding:0;text-decoration:underline;text-underline-offset:2px;cursor:pointer}",
    ".util-learner-renderer-vnext .util-revision-reminder__view:focus{outline:2px solid #2563eb;outline-offset:2px}"
  ].join("");
}

module.exports = {
  revisionGuidanceId: revisionGuidanceId,
  revisionReminderId: revisionReminderId,
  renderReviseWithCriterionAction: renderReviseWithCriterionAction,
  renderRevisionReminderHost: renderRevisionReminderHost,
  renderRevisionGuidanceHost: renderRevisionGuidanceHost,
  getRevisionReminderPresentationCss: getRevisionReminderPresentationCss
};
