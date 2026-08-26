"use strict";

/**
 * Transport Learning Sequence timeline durations onto activity rows.
 * Does not compute a new allocation: copies timeline entry minutes onto
 * matching activities[].duration_minutes when the activity value is absent.
 *
 * Timeline entry minutes (first match wins per activity_id):
 *   1. finite duration_minutes
 *   2. finite estimated_minutes
 *
 * Sequence total (header fallback when activity sum is empty):
 *   1. finite total_duration_minutes
 *   2. finite total_estimated_minutes
 */

function parseFiniteDurationMinutes(value) {
  if (value == null || value === "") return null;
  var minutes = Number(value);
  return Number.isFinite(minutes) ? minutes : null;
}

function hasExplicitActivityDuration(activity) {
  return parseFiniteDurationMinutes(activity && activity.duration_minutes) != null;
}

/**
 * Resolve minutes from a single timeline entry without inventing values.
 */
function parseTimelineEntryMinutes(entry) {
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
  var fromDuration = parseFiniteDurationMinutes(entry.duration_minutes);
  if (fromDuration != null) return fromDuration;
  return parseFiniteDurationMinutes(entry.estimated_minutes);
}

function timelineDurationByActivityId(sequence) {
  var map = Object.create(null);
  if (!sequence || !Array.isArray(sequence.timeline)) return map;
  sequence.timeline.forEach(function (entry) {
    var activityId = String((entry && entry.activity_id) || "").trim();
    if (!activityId || Object.prototype.hasOwnProperty.call(map, activityId)) return;
    var minutes = parseTimelineEntryMinutes(entry);
    if (minutes == null) return;
    map[activityId] = minutes;
  });
  return map;
}

function parseSequenceTotalDurationMinutes(sequence) {
  var fromDuration = parseFiniteDurationMinutes(sequence && sequence.total_duration_minutes);
  if (fromDuration != null) return fromDuration;
  return parseFiniteDurationMinutes(sequence && sequence.total_estimated_minutes);
}

/**
 * Mutate page.activities in place. Returns the same page object.
 */
function projectTimelineDurationsOntoActivities(page) {
  if (!page || typeof page !== "object" || Array.isArray(page)) return page;
  var activities = page.activities;
  if (!Array.isArray(activities) || !activities.length) return page;
  var byId = timelineDurationByActivityId(page.learning_sequence);
  activities.forEach(function (activity) {
    if (!activity || typeof activity !== "object" || Array.isArray(activity)) return;
    if (hasExplicitActivityDuration(activity)) return;
    var activityId = String(activity.activity_id || "").trim();
    if (!activityId || !Object.prototype.hasOwnProperty.call(byId, activityId)) return;
    activity.duration_minutes = byId[activityId];
  });
  return page;
}

/**
 * Non-mutating projection for renderer input (does not alter the source page).
 */
function pageWithProjectedTimelineDurations(page) {
  if (!page || typeof page !== "object" || Array.isArray(page)) return page;
  var activities = Array.isArray(page.activities) ? page.activities : [];
  var byId = timelineDurationByActivityId(page.learning_sequence);
  var changed = false;
  var nextActivities = activities.map(function (activity) {
    if (!activity || typeof activity !== "object" || Array.isArray(activity)) return activity;
    if (hasExplicitActivityDuration(activity)) return activity;
    var activityId = String(activity.activity_id || "").trim();
    if (!activityId || !Object.prototype.hasOwnProperty.call(byId, activityId)) return activity;
    changed = true;
    var copy = Object.assign({}, activity);
    copy.duration_minutes = byId[activityId];
    return copy;
  });
  if (!changed) return page;
  return Object.assign({}, page, { activities: nextActivities });
}

function resolveHeaderDurationMinutes(activityDurationSum, sequence) {
  if (Number.isFinite(activityDurationSum) && activityDurationSum > 0) {
    return activityDurationSum;
  }
  var total = parseSequenceTotalDurationMinutes(sequence);
  return total != null && total > 0 ? total : null;
}

module.exports = {
  parseFiniteDurationMinutes: parseFiniteDurationMinutes,
  hasExplicitActivityDuration: hasExplicitActivityDuration,
  parseTimelineEntryMinutes: parseTimelineEntryMinutes,
  timelineDurationByActivityId: timelineDurationByActivityId,
  parseSequenceTotalDurationMinutes: parseSequenceTotalDurationMinutes,
  projectTimelineDurationsOntoActivities: projectTimelineDurationsOntoActivities,
  pageWithProjectedTimelineDurations: pageWithProjectedTimelineDurations,
  resolveHeaderDurationMinutes: resolveHeaderDurationMinutes
};
