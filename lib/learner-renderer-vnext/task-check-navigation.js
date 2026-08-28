"use strict";

/**
 * S81-T-007 / T-008 R1 — per-activity Task (Do) ↔ Check landmarks.
 *
 * Learner-visible navigation is asymmetric (manual UX correction):
 *   - Check → Task: "Back to your task" (against document flow)
 *   - Task → Check: NOT rendered (linear Explore → Task → Check already reaches Check)
 *
 * Landmark ids remain for R4 revise handoff and Check→Task anchors.
 */

function slugifyActivityId(activityId) {
  var slug = String(activityId == null ? "" : activityId)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "activity";
}

function taskLandmarkId(activityId) {
  return "learner-task-" + slugifyActivityId(activityId);
}

function checkLandmarkId(activityId) {
  return "learner-check-" + slugifyActivityId(activityId);
}

function momentHasRenderableItems(moment) {
  if (!moment || typeof moment !== "object") return false;
  return Array.isArray(moment.items) && moment.items.length > 0;
}

/**
 * Enable R1 nav only when the activity composition includes both Do and Check
 * moments with items (same gate renderDoMoment/renderCheckMoment use for empty).
 *
 * @param {Object|null|undefined} composition
 * @returns {boolean}
 */
function shouldEnableTaskCheckNav(composition) {
  if (!composition) return false;
  return (
    momentHasRenderableItems(composition.doMoment) &&
    momentHasRenderableItems(composition.checkMoment)
  );
}

function activityTitleSuffix(activityTitle) {
  var title = String(activityTitle || "").trim();
  if (!title) return "";
  if (title.length > 72) title = title.slice(0, 69) + "…";
  return " (" + title + ")";
}

/**
 * @deprecated Not rendered in learner pages (Task→Check is redundant in linear flow).
 * Retained only if a caller needs the label/href string for tests.
 *
 * @param {string} activityId
 * @param {string=} activityTitle
 * @param {{ escapeAttribute: Function, escapeHtml: Function }} html
 * @returns {string}
 */
function renderTaskToCheckNavLink(activityId, activityTitle, html) {
  var checkId = checkLandmarkId(activityId);
  var label = "Check your response" + activityTitleSuffix(activityTitle);
  return (
    '<p class="util-composition-moment-nav">' +
    '<a class="util-composition-moment-nav__link" href="#' +
    html.escapeAttribute(checkId) +
    '">' +
    html.escapeHtml(label) +
    "</a></p>"
  );
}

/**
 * @param {string} activityId
 * @param {string=} activityTitle
 * @param {{ escapeAttribute: Function, escapeHtml: Function }} html
 * @returns {string}
 */
function renderCheckToTaskNavLink(activityId, activityTitle, html) {
  var taskId = taskLandmarkId(activityId);
  var label = "Back to your task" + activityTitleSuffix(activityTitle);
  return (
    '<p class="util-composition-moment-nav">' +
    '<a class="util-composition-moment-nav__link" href="#' +
    html.escapeAttribute(taskId) +
    '">' +
    html.escapeHtml(label) +
    "</a></p>"
  );
}

module.exports = {
  slugifyActivityId: slugifyActivityId,
  taskLandmarkId: taskLandmarkId,
  checkLandmarkId: checkLandmarkId,
  shouldEnableTaskCheckNav: shouldEnableTaskCheckNav,
  renderTaskToCheckNavLink: renderTaskToCheckNavLink,
  renderCheckToTaskNavLink: renderCheckToTaskNavLink
};
