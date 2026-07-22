"use strict";

var validateInput = require("./validate-input").validateInput;
var diagnostic = require("./validate-input").diagnostic;
var buildActivityModel =
  require("./build-activity-model").buildActivityModel;
var validatePageModel = require("./validate-model").validatePageModel;
var normalizeContent = require("./normalize-content");
var attachVisualAffordancePlacements =
  require("./build-visual-affordance-placements").attachVisualAffordancePlacements;
var markCascadeErrors =
  require("./archetype-diagnostics").markCascadeErrors;
var collectPrimaryFailureActivityIds =
  require("./archetype-diagnostics").collectPrimaryFailureActivityIds;
var summarizeCascadeByActivity =
  require("./archetype-diagnostics").summarizeCascadeByActivity;
var inspectActivitiesArchetypes =
  require("./archetype-diagnostics").inspectActivitiesArchetypes;

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
  var archetypeInspection = inspectActivitiesArchetypes(
    Array.isArray(page.activities) ? page.activities : []
  );
  var activityModels = orderedActivities(page, warnings).map(function (activity) {
    var result = buildActivityModel(activity);
    if (result.archetypeInspection) {
      var index = archetypeInspection.findIndex(function (row) {
        return String(row.activityId || "") === String(activity.activity_id || "");
      });
      if (index >= 0) {
        archetypeInspection[index] = result.archetypeInspection;
      }
    }
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
      content: normalizeContent.stripLeadingMatchingMarkdownHeading(
        synthesisBody(page, definition.field),
        definition.title
      )
    };
  }).filter(function (section) {
    return !!section.content;
  });

  var learningOutcomes = Array.isArray(page.learning_outcomes)
    ? page.learning_outcomes
        .map(function (outcome) {
          return {
            id: String((outcome && outcome.id) || "").trim(),
            statement: String((outcome && outcome.statement) || "").trim()
          };
        })
        .filter(function (outcome) {
          return outcome.id && outcome.statement;
        })
    : [];

  var progressionGuidance = String(
    (page.learning_sequence &&
      page.learning_sequence.navigation_guidance &&
      page.learning_sequence.navigation_guidance.progression_logic) ||
      ""
  ).trim();

  var overview = synthesisBody(page, "overview");
  var studyTips = normalizeContent.stripLeadingMatchingMarkdownHeading(
    synthesisBody(page, "study_tips"),
    "Study tips"
  );
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
    learningOutcomes: learningOutcomes,
    progressionGuidance: progressionGuidance,
    activities: activityModels,
    assessment: { items: assessmentItems },
    studyTips: studyTips
  };

  var modelValidation = validatePageModel(page, model);
  errors = errors.concat(modelValidation.errors);
  warnings = warnings.concat(modelValidation.warnings);

  errors = markCascadeErrors(errors, collectPrimaryFailureActivityIds(errors));

  if (errors.length === 0) {
    attachVisualAffordancePlacements(page, model);
  }

  return {
    ok: errors.length === 0,
    model: errors.length === 0 ? model : null,
    errors: errors,
    warnings: warnings,
    diagnostics: {
      omittedBeats: omittedBeats,
      archetypeInspection: archetypeInspection,
      cascadeSummary: summarizeCascadeByActivity(errors)
    }
  };
}

module.exports = {
  ORIENTATION_SECTION_DEFINITIONS: ORIENTATION_SECTION_DEFINITIONS,
  buildPageModel: buildPageModel
};
