"use strict";

var parseLearnerTask = require("./parse-learner-task").parseLearnerTask;
var hasLearnerFacingContent =
  require("./build-beat-model").hasLearnerFacingContent;
var diagnostic = require("./validate-input").diagnostic;

function countBy(values, keyFn) {
  var counts = {};
  values.forEach(function (value) {
    var key = keyFn(value);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

/**
 * Verify source-to-model closure before the model may be rendered.
 *
 * @param {Object} sourcePage
 * @param {import("./types").LearnerPageModel} model
 * @returns {{errors:Object[],warnings:Object[]}}
 */
function validatePageModel(sourcePage, model) {
  var errors = [];
  var warnings = [];
  var sourceActivities = Array.isArray(sourcePage.activities)
    ? sourcePage.activities
    : [];
  var sourceById = {};
  sourceActivities.forEach(function (activity) {
    sourceById[String(activity.activity_id || "")] = activity;
  });

  var activityCounts = countBy(model.activities, function (activity) {
    return activity.id;
  });
  Object.keys(activityCounts).forEach(function (activityId) {
    if (activityCounts[activityId] > 1) {
      errors.push(
        diagnostic(
          "error",
          "DUPLICATE_MODEL_ACTIVITY",
          "Activity appears more than once in the page model.",
          { activityId: activityId }
        )
      );
    }
  });

  model.activities.forEach(function (activityModel) {
    var source = sourceById[activityModel.id] || {};
    var modelMaterials = [];
    var modelSteps = [];
    var expectedCount = 0;

    activityModel.beats.forEach(function (beat) {
      if (!hasLearnerFacingContent(beat)) {
        errors.push(
          diagnostic(
            "error",
            "EMPTY_RENDERED_BEAT",
            "Rendered beat has no learner-facing content.",
            {
              activityId: activityModel.id,
              sourceFunction: beat.sourceFunction
            }
          )
        );
      }
      modelMaterials = modelMaterials.concat(beat.materials);
      modelSteps = modelSteps.concat(beat.instructions);
      if (beat.expectedOutput !== null) expectedCount += 1;
    });

    var materialCounts = countBy(modelMaterials, function (material) {
      return material.id;
    });
    (Array.isArray(source.materials) ? source.materials : []).forEach(function (material) {
      var materialId = String(material.material_id || "");
      var count = materialCounts[materialId] || 0;
      if (count !== 1) {
        errors.push(
          diagnostic(
            "error",
            count ? "MULTIPLY_ASSIGNED_MATERIAL" : "UNASSIGNED_MATERIAL",
            "Material must appear exactly once in the page model.",
            {
              activityId: activityModel.id,
              materialId: materialId,
              materialType: String(material.material_type || "")
            }
          )
        );
      }
    });

    var stepCounts = countBy(modelSteps, function (step) {
      return String(step.sourceStepNumber);
    });
    parseLearnerTask(source.learner_task).forEach(function (step) {
      var count = stepCounts[String(step.sourceStepNumber)] || 0;
      if (count !== 1) {
        errors.push(
          diagnostic(
            "error",
            count ? "MULTIPLY_ASSIGNED_TASK_STEP" : "UNASSIGNED_TASK_STEP",
            "Learner-task step must appear exactly once in the page model.",
            {
              activityId: activityModel.id,
              sourceStepNumber: step.sourceStepNumber
            }
          )
        );
      }
    });

    var sourceExpected = String(
      source.expected_output == null ? "" : source.expected_output
    ).trim();
    if (sourceExpected && expectedCount !== 1) {
      errors.push(
        diagnostic(
          "error",
          expectedCount
            ? "MULTIPLY_ASSIGNED_EXPECTED_OUTPUT"
            : "UNASSIGNED_EXPECTED_OUTPUT",
          "Expected output must appear exactly once in the page model.",
          { activityId: activityModel.id }
        )
      );
    }
  });

  return { errors: errors, warnings: warnings };
}

module.exports = {
  validatePageModel: validatePageModel
};
