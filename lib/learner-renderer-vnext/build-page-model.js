"use strict";

var validateInput = require("./validate-input").validateInput;
var diagnostic = require("./validate-input").diagnostic;
var buildActivityModel =
  require("./build-activity-model").buildActivityModel;
var validatePageModel = require("./validate-model").validatePageModel;

var ORIENTATION_SECTION_DEFINITIONS = Object.freeze([
  Object.freeze({ field: "overview", type: "overview", title: "Overview" }),
  Object.freeze({
    field: "learning_purpose",
    type: "learning_purpose",
    title: "Learning purpose"
  }),
  Object.freeze({
    field: "knowledge_summary",
    type: "knowledge_summary",
    title: "Knowledge summary"
  })
]);

function synthesisBody(page, field) {
  var value = page && page.page_synthesis && page.page_synthesis[field];
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return String(value.body == null ? "" : value.body).trim();
  }
  return String(value == null ? "" : value).trim();
}

function orderedActivities(page, warnings) {
  var activities = Array.isArray(page.activities) ? page.activities : [];
  var byId = {};
  activities.forEach(function (activity) {
    byId[String(activity.activity_id || "")] = activity;
  });
  var sequence =
    page.learning_sequence &&
    Array.isArray(page.learning_sequence.ordered_activity_ids)
      ? page.learning_sequence.ordered_activity_ids.map(String)
      : null;
  if (!sequence) return activities.slice();

  var included = {};
  var ordered = sequence
    .map(function (activityId) {
      included[activityId] = true;
      return byId[activityId];
    })
    .filter(Boolean);
  activities.forEach(function (activity) {
    var activityId = String(activity.activity_id || "");
    if (included[activityId]) return;
    warnings.push(
      diagnostic(
        "warning",
        "ACTIVITY_NOT_IN_LEARNING_SEQUENCE",
        "Activity is not listed in learning_sequence.ordered_activity_ids; appended in source order.",
        { activityId: activityId }
      )
    );
    ordered.push(activity);
  });
  return ordered;
}

/**
 * @param {Object} page
 * @returns {import("./types").LearnerPageModelResult}
 */
function buildPageModel(page) {
  var inputValidation = validateInput(page);
  if (inputValidation.errors.length) {
    return {
      ok: false,
      model: null,
      errors: inputValidation.errors,
      warnings: inputValidation.warnings,
      diagnostics: { omittedBeats: [] }
    };
  }

  var errors = [];
  var warnings = inputValidation.warnings.slice();
  var omittedBeats = [];
  var activityModels = orderedActivities(page, warnings).map(function (activity) {
    var result = buildActivityModel(activity);
    errors = errors.concat(result.errors);
    warnings = warnings.concat(result.warnings);
    omittedBeats = omittedBeats.concat(result.omittedBeats);
    return result.activity;
  });

  var totalDuration = activityModels.reduce(function (total, activity) {
    return total + (activity.durationMinutes == null ? 0 : activity.durationMinutes);
  }, 0);
  var orientationSections = ORIENTATION_SECTION_DEFINITIONS.map(function (definition) {
    return {
      type: definition.type,
      title: definition.title,
      content: synthesisBody(page, definition.field)
    };
  }).filter(function (section) {
    return !!section.content;
  });

  var overview = synthesisBody(page, "overview");
  var studyTips = synthesisBody(page, "study_tips");
  var assessmentItems =
    page.assessment_check && Array.isArray(page.assessment_check.items)
      ? page.assessment_check.items.map(function (item) {
          return Object.assign({}, item);
        })
      : [];
  var model = {
    title: String(page.title || "").trim(),
    header: {
      description: overview,
      durationMinutes: totalDuration || null
    },
    orientationSections: orientationSections,
    activities: activityModels,
    assessment: { items: assessmentItems },
    studyTips: studyTips
  };

  var modelValidation = validatePageModel(page, model);
  errors = errors.concat(modelValidation.errors);
  warnings = warnings.concat(modelValidation.warnings);

  return {
    ok: errors.length === 0,
    model: errors.length === 0 ? model : null,
    errors: errors,
    warnings: warnings,
    diagnostics: { omittedBeats: omittedBeats }
  };
}

module.exports = {
  ORIENTATION_SECTION_DEFINITIONS: ORIENTATION_SECTION_DEFINITIONS,
  buildPageModel: buildPageModel
};
