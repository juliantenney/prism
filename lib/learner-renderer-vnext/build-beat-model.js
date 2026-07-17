"use strict";

var labelForRole = require("./labels").labelForRole;
var parseLearnerTask = require("./parse-learner-task").parseLearnerTask;
var buildMaterialModel = require("./parse-material").buildMaterialModel;
var diagnostic = require("./validate-input").diagnostic;

var OPTIONAL_PROMPT_FIELDS = Object.freeze([
  "self_explanation_prompt",
  "conceptual_contrast_prompt",
  "transfer_or_application_task",
  "argument_structure_hint",
  "intellectual_coherence_bridge"
]);

function hasLearnerFacingContent(beat) {
  return (
    beat.instructions.length > 0 ||
    beat.prompts.length > 0 ||
    beat.materials.length > 0 ||
    beat.expectedOutput !== null
  );
}

function materialTypeRank(rule, materialType) {
  var index = rule.materialOrder.indexOf(materialType);
  return index < 0 ? Number.MAX_SAFE_INTEGER : index;
}

/**
 * Build all learner-facing beats before any HTML exists.
 *
 * @param {Object} activity
 * @param {import("./types").ArchetypeVariantRule} variant
 * @returns {{beats:Object[],errors:Object[],warnings:Object[],omittedBeats:Object[]}}
 */
function buildBeatModels(activity, variant) {
  var activityId = String(activity.activity_id || "").trim();
  var errors = [];
  var warnings = [];
  var omittedBeats = [];
  var sourceMaterials = Array.isArray(activity.materials) ? activity.materials : [];
  var materials = sourceMaterials.map(buildMaterialModel);
  var steps = parseLearnerTask(activity.learner_task);

  var beats = variant.beats.map(function (rule) {
    return {
      sourceFunction: rule.sourceFunction,
      learnerRole: rule.learnerRole,
      learnerLabel: labelForRole(rule.learnerRole),
      instructions: [],
      prompts: [],
      materials: [],
      expectedOutput: null
    };
  });

  materials.forEach(function (material) {
    var candidates = [];
    variant.beats.forEach(function (rule, index) {
      if (rule.materialTypes.indexOf(material.type) !== -1) {
        candidates.push(index);
      }
    });

    if (candidates.length !== 1) {
      var candidateBeats = candidates.map(function (index) {
        return variant.beats[index].sourceFunction;
      });
      errors.push(
        diagnostic(
          "error",
          candidates.length ? "MULTIPLY_ASSIGNED_MATERIAL" : "UNASSIGNED_MATERIAL",
          candidates.length
            ? "Material matches more than one beat rule: " + material.id
            : "Material has no matching beat rule: " + material.id,
          {
            activityId: activityId,
            materialId: material.id,
            materialType: material.type,
            candidateBeats: candidateBeats
          }
        )
      );
      return;
    }
    beats[candidates[0]].materials.push(material);
  });

  beats.forEach(function (beat, beatIndex) {
    var rule = variant.beats[beatIndex];
    beat.materials.sort(function (left, right) {
      var rankDifference =
        materialTypeRank(rule, left.type) - materialTypeRank(rule, right.type);
      return rankDifference || left.sourceOrder - right.sourceOrder;
    });
  });

  var stepCursor = 0;
  variant.beats.forEach(function (rule, beatIndex) {
    var requested = rule.taskSteps.take;
    var count = requested === "rest" ? steps.length - stepCursor : Number(requested);
    if (!Number.isInteger(count) || count < 0) {
      errors.push(
        diagnostic(
          "error",
          "INVALID_TASK_ALLOCATION_RULE",
          "Invalid task allocation in rule variant: " + variant.id,
          { activityId: activityId, sourceFunction: rule.sourceFunction }
        )
      );
      return;
    }
    if (stepCursor + count > steps.length) {
      errors.push(
        diagnostic(
          "error",
          "INSUFFICIENT_TASK_STEPS",
          "Rule requests more learner-task steps than the activity provides.",
          { activityId: activityId, sourceFunction: rule.sourceFunction }
        )
      );
      count = Math.max(0, steps.length - stepCursor);
    }
    beats[beatIndex].instructions = steps.slice(stepCursor, stepCursor + count);
    stepCursor += count;
  });

  if (stepCursor !== steps.length) {
    steps.slice(stepCursor).forEach(function (step) {
      errors.push(
        diagnostic(
          "error",
          "UNASSIGNED_TASK_STEP",
          "Learner-task step was not assigned.",
          { activityId: activityId, sourceStepNumber: step.sourceStepNumber }
        )
      );
    });
  }

  OPTIONAL_PROMPT_FIELDS.forEach(function (field) {
    var value = String(activity[field] == null ? "" : activity[field]).trim();
    if (!value) return;
    var candidates = [];
    variant.beats.forEach(function (rule, index) {
      if (rule.promptFields.indexOf(field) !== -1) candidates.push(index);
    });
    if (!candidates.length) {
      warnings.push(
        diagnostic(
          "warning",
          "UNMAPPED_OPTIONAL_PROMPT",
          "Optional prompt field is not mapped by the selected rule.",
          { activityId: activityId, sourceField: field }
        )
      );
      return;
    }
    if (candidates.length > 1) {
      errors.push(
        diagnostic(
          "error",
          "MULTIPLY_ASSIGNED_PROMPT",
          "Prompt field matches more than one beat rule.",
          {
            activityId: activityId,
            sourceField: field,
            candidateBeats: candidates.map(function (index) {
              return variant.beats[index].sourceFunction;
            })
          }
        )
      );
      return;
    }
    beats[candidates[0]].prompts.push({ sourceField: field, text: value });
  });

  var expectedOutput = String(
    activity.expected_output == null ? "" : activity.expected_output
  ).trim();
  if (expectedOutput) {
    var expectedCandidates = [];
    variant.beats.forEach(function (rule, index) {
      if (rule.includeExpectedOutput) expectedCandidates.push(index);
    });
    if (expectedCandidates.length !== 1) {
      errors.push(
        diagnostic(
          "error",
          expectedCandidates.length
            ? "MULTIPLY_ASSIGNED_EXPECTED_OUTPUT"
            : "UNASSIGNED_EXPECTED_OUTPUT",
          "Expected output must match exactly one beat rule.",
          {
            activityId: activityId,
            candidateBeats: expectedCandidates.map(function (index) {
              return variant.beats[index].sourceFunction;
            })
          }
        )
      );
    } else {
      beats[expectedCandidates[0]].expectedOutput = { text: expectedOutput };
    }
  }

  var renderedBeats = beats.filter(function (beat) {
    if (hasLearnerFacingContent(beat)) return true;
    omittedBeats.push({
      activityId: activityId,
      sourceFunction: beat.sourceFunction,
      reason: "empty_learner_facing_content"
    });
    warnings.push(
      diagnostic(
        "warning",
        "OMITTED_EMPTY_BEAT",
        "Episode-plan beat has no learner-facing content and was omitted.",
        { activityId: activityId, sourceFunction: beat.sourceFunction }
      )
    );
    return false;
  });

  return {
    beats: renderedBeats,
    errors: errors,
    warnings: warnings,
    omittedBeats: omittedBeats
  };
}

module.exports = {
  OPTIONAL_PROMPT_FIELDS: OPTIONAL_PROMPT_FIELDS,
  hasLearnerFacingContent: hasLearnerFacingContent,
  buildBeatModels: buildBeatModels
};
