"use strict";

var parseLearnerTask = require("./parse-learner-task").parseLearnerTask;
var hasLearnerFacingContent =
  require("./build-beat-model").hasLearnerFacingContent;
var diagnostic = require("./validate-input").diagnostic;
var normalizeSelection = require("./normalize-selection");
var composeResponseParts = require("./compose-response-parts");

function countBy(values, keyFn) {
  var counts = {};
  values.forEach(function (value) {
    var key = keyFn(value);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

/**
 * Response-item closure: every explicitly authored selection item (selection.items[])
 * and every DLA-declared response item (contract v2) must be realised as exactly one
 * response part. Identity-based; legacy single-decision selections are unaffected, and
 * legacy captures are not required to carry DLA declarations.
 */
function appendSelectionItemClosureErrors(source, activityId, errors) {
  var materials = Array.isArray(source.materials) ? source.materials : [];
  var requiredRows = Array.isArray(source.required_materials) ? source.required_materials : [];
  materials.forEach(function (material) {
    var type = String((material && material.material_type) || "")
      .trim()
      .toLowerCase();
    if (type !== "selection" || !material.selection || typeof material.selection !== "object") return;
    var materialId = String(material.material_id || "");
    var cluster = normalizeSelection.resolveSelectionCluster(material.selection, {
      materialId: materialId
    });
    var declared = [];
    requiredRows.forEach(function (row) {
      var rf = row && row.response_fulfilment;
      if (
        row &&
        String(row.material_id || "") === materialId &&
        rf &&
        Number(rf.contract_version) === normalizeSelection.SELECTION_CLUSTER_CONTRACT_VERSION &&
        Array.isArray(rf.response_items)
      ) {
        rf.response_items.forEach(function (item) {
          var id = String((item && item.item_id) || "").trim();
          if (id) declared.push(id);
        });
      }
    });
    if (!cluster.present && !declared.length) return;

    var expected = declared.slice();
    cluster.declaredIds.forEach(function (id) {
      if (expected.indexOf(id) === -1) expected.push(id);
    });
    var realised = composeResponseParts.partFromSelectionMaterial(
      activityId,
      {
        id: materialId,
        type: "selection",
        title: String(material.title || ""),
        body: typeof material.body === "string" ? material.body : "",
        selection: material.selection
      },
      1
    );
    var realisedIds = (realised.parts || []).map(function (part) {
      return String((part.provenance && part.provenance.selectionItemId) || "");
    });
    expected.forEach(function (id) {
      if (realisedIds.indexOf(id) !== -1) return;
      errors.push(
        diagnostic(
          "error",
          "SELECTION_ITEM_NOT_REALISED",
          "Selection response item has no realised response part.",
          { activityId: activityId, materialId: materialId, itemId: id }
        )
      );
    });
  });
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

    appendSelectionItemClosureErrors(source, activityModel.id, errors);

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
