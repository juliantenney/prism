"use strict";

var resolveArchetypeValidation =
  require("./archetype-validation-route").resolveArchetypeValidation;
var compareRegistryAndGrammar =
  require("./archetype-grammar-dual-validation").compareRegistryAndGrammar;

var PRIMARY_ARCHETYPE_FAILURE_CODES = Object.freeze([
  "UNKNOWN_ARCHETYPE",
  "ARCHETYPE_GRAMMAR_VALIDATION_FAILED",
  "UNKNOWN_EPISODE_PLAN_BEAT",
  "MIXED_EPISODE_PLAN_VOCABULARY",
  "MALFORMED_EPISODE_PLAN_SEQUENCE"
]);

var CASCADE_CONSEQUENCE_CODES = Object.freeze([
  "UNASSIGNED_MATERIAL",
  "MULTIPLY_ASSIGNED_MATERIAL",
  "UNASSIGNED_TASK_STEP",
  "MULTIPLY_ASSIGNED_TASK_STEP",
  "UNASSIGNED_EXPECTED_OUTPUT",
  "MULTIPLY_ASSIGNED_EXPECTED_OUTPUT",
  "EMPTY_RENDERED_BEAT"
]);

function listRegisteredVariants() {
  return [];
}

function describeNoMatchReason(archetype, normalizedSequence, registeredVariants, resolution) {
  if (resolution && resolution.errors && resolution.errors.length) {
    var primary = resolution.errors[0];
    if (primary && primary.code === "ARCHETYPE_GRAMMAR_VALIDATION_FAILED") {
      return "Canonical FunctionEnum sequence failed shared archetype grammar validation.";
    }
    if (primary && primary.message) return String(primary.message);
  }
  if (!String(archetype || "").trim()) {
    return "Activity episode_plan.archetype is missing or empty after normalisation.";
  }
  if (!normalizedSequence.length) {
    return "Activity episode_plan.beats is empty or all beat functions normalised to empty strings.";
  }
  return "Archetype validation failed for the normalised beat sequence.";
}

function inspectActivityArchetype(activity) {
  var activityId = String((activity && activity.activity_id) || "").trim();
  var episodePlan = (activity && activity.episode_plan) || {};
  var rawBeats = Array.isArray(episodePlan.beats) ? episodePlan.beats : [];
  var rawBeatSequence = rawBeats.map(function (beat) {
    return String((beat && beat.function) || "");
  });
  var normalizedBeatSequence = rawBeatSequence.map(function (value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
  });
  var archetype = String(episodePlan.archetype || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  var registeredVariants = listRegisteredVariants(archetype);
  var resolution = resolveArchetypeValidation({
    activityId: activityId,
    archetype: archetype,
    normalizedBeatSequence: normalizedBeatSequence
  });
  var dualValidation = compareRegistryAndGrammar({
    activityId: activityId,
    archetype: archetype,
    normalizedBeatSequence: normalizedBeatSequence,
    registryMatch: false,
    matchedVariantId: null,
    renderingContinued: !!(resolution && resolution.ok),
    validationRoute: resolution.validationRoute,
    runtimeAuthority: resolution.runtimeAuthority,
    bindingSource: resolution.bindingSource,
    continuityMatch: false,
    grammarResult: resolution.grammarResult
  });

  return {
    activityId: activityId,
    title: String((activity && activity.title) || "").trim(),
    archetype: archetype,
    rawBeatSequence: rawBeatSequence,
    normalizedBeatSequence: normalizedBeatSequence,
    beatIds: rawBeats.map(function (beat, index) {
      return String(
        (beat && (beat.beat_id || beat.id)) || "beat-" + (index + 1)
      ).trim();
    }),
    registeredVariantIds: [],
    acceptedSequences: [],
    matchedVariantId: resolution.matchedVariantId || null,
    match: !!(resolution && resolution.ok),
    registryMatch: false,
    continuityMatch: false,
    validationRoute: resolution.validationRoute,
    runtimeAuthority: resolution.runtimeAuthority,
    bindingSource: resolution.bindingSource || null,
    nonCanonicalCompatibility: false,
    classification: resolution.classification,
    validationResolution: resolution,
    noMatchReason: resolution.ok
      ? null
      : describeNoMatchReason(
          archetype,
          normalizedBeatSequence,
          registeredVariants,
          resolution
        ),
    dualValidation: dualValidation
  };
}

function inspectActivitiesArchetypes(activities, normalizeToken) {
  var normalizer =
    typeof normalizeToken === "function"
      ? normalizeToken
      : function (value) {
          return String(value == null ? "" : value)
            .trim()
            .toLowerCase()
            .replace(/[\s-]+/g, "_");
        };
  return (Array.isArray(activities) ? activities : []).map(function (activity) {
    return inspectActivityArchetype(activity, normalizer);
  });
}

function isPrimaryArchetypeFailure(code) {
  return PRIMARY_ARCHETYPE_FAILURE_CODES.indexOf(String(code || "")) >= 0;
}

function markCascadeErrors(errors, primaryActivityIds) {
  var primary = primaryActivityIds || {};
  return (Array.isArray(errors) ? errors : []).map(function (error) {
    var next = Object.assign({}, error);
    var activityId = String(next.activityId || "");
    if (isPrimaryArchetypeFailure(next.code)) {
      next.errorRole = "primary";
      return next;
    }
    if (
      primary[activityId] &&
      CASCADE_CONSEQUENCE_CODES.indexOf(String(next.code || "")) >= 0
    ) {
      next.errorRole = "consequence";
      next.cascadeOf = primary[activityId];
    }
    return next;
  });
}

function collectPrimaryFailureActivityIds(errors) {
  var primary = {};
  (Array.isArray(errors) ? errors : []).forEach(function (error) {
    if (error && isPrimaryArchetypeFailure(error.code) && error.activityId) {
      primary[String(error.activityId)] = String(error.code);
    }
  });
  return primary;
}

function groupErrorsByActivity(errors) {
  var groups = {};
  (Array.isArray(errors) ? errors : []).forEach(function (error) {
    var activityId = String((error && error.activityId) || "__page__");
    if (!groups[activityId]) {
      groups[activityId] = { primary: [], consequences: [], other: [] };
    }
    if (error && error.errorRole === "primary") {
      groups[activityId].primary.push(error);
    } else if (error && error.errorRole === "consequence") {
      groups[activityId].consequences.push(error);
    } else {
      groups[activityId].other.push(error);
    }
  });
  return groups;
}

function summarizeCascadeByActivity(errors) {
  var summary = {};
  var grouped = groupErrorsByActivity(errors);
  Object.keys(grouped).forEach(function (activityId) {
    var bucket = grouped[activityId];
    if (!bucket.primary.length) return;
    summary[activityId] = {
      primaryCode: bucket.primary[0].code,
      consequenceCounts: {
        materials: bucket.consequences.filter(function (error) {
          return (
            error.code === "UNASSIGNED_MATERIAL" ||
            error.code === "MULTIPLY_ASSIGNED_MATERIAL"
          );
        }).length,
        taskSteps: bucket.consequences.filter(function (error) {
          return (
            error.code === "UNASSIGNED_TASK_STEP" ||
            error.code === "MULTIPLY_ASSIGNED_TASK_STEP"
          );
        }).length,
        expectedOutputs: bucket.consequences.filter(function (error) {
          return (
            error.code === "UNASSIGNED_EXPECTED_OUTPUT" ||
            error.code === "MULTIPLY_ASSIGNED_EXPECTED_OUTPUT"
          );
        }).length,
        emptyBeats: bucket.consequences.filter(function (error) {
          return error.code === "EMPTY_RENDERED_BEAT";
        }).length
      }
    };
  });
  return summary;
}

function formatActivityArchetypeFailure(activityId, groupedBucket, inspection) {
  var lines = [];
  lines.push("Activity " + activityId + " failed page-model construction:");
  var primary = groupedBucket.primary[0] || null;
  if (primary) {
    lines.push("  Primary:");
    lines.push("    " + primary.code);
    lines.push(
      "    Archetype: " +
        String((inspection && inspection.archetype) || primary.archetype || "")
    );
    lines.push(
      "    Actual sequence: " +
        JSON.stringify(
          (inspection && inspection.normalizedBeatSequence) ||
            primary.candidateBeats ||
            primary.sequence ||
            []
        )
    );
    if (inspection && inspection.validationRoute) {
      lines.push("    Validation route: " + inspection.validationRoute);
    }
    if (inspection && inspection.noMatchReason) {
      lines.push("    Reason: " + inspection.noMatchReason);
    }
  }
  var consequences = groupedBucket.consequences;
  if (consequences.length) {
    lines.push("  Consequences:");
    var materialCount = consequences.filter(function (error) {
      return (
        error.code === "UNASSIGNED_MATERIAL" ||
        error.code === "MULTIPLY_ASSIGNED_MATERIAL"
      );
    }).length;
    var stepCount = consequences.filter(function (error) {
      return (
        error.code === "UNASSIGNED_TASK_STEP" ||
        error.code === "MULTIPLY_ASSIGNED_TASK_STEP"
      );
    }).length;
    var expectedCount = consequences.filter(function (error) {
      return (
        error.code === "UNASSIGNED_EXPECTED_OUTPUT" ||
        error.code === "MULTIPLY_ASSIGNED_EXPECTED_OUTPUT"
      );
    }).length;
    if (materialCount) lines.push("    " + materialCount + " material assignment error(s)");
    if (stepCount) lines.push("    " + stepCount + " learner-task step assignment error(s)");
    if (expectedCount) {
      lines.push("    " + expectedCount + " expected-output assignment error(s)");
    }
  }
  return lines.join("\n");
}

function formatGroupedModelErrors(errors, archetypeInspection) {
  var marked = markCascadeErrors(errors, collectPrimaryFailureActivityIds(errors));
  var grouped = groupErrorsByActivity(marked);
  var inspectionByActivity = {};
  (Array.isArray(archetypeInspection) ? archetypeInspection : []).forEach(function (row) {
    inspectionByActivity[String(row.activityId || "")] = row;
  });

  var sections = [];
  Object.keys(grouped).forEach(function (activityId) {
    var bucket = grouped[activityId];
    if (activityId === "__page__") {
      bucket.other.forEach(function (error) {
        sections.push(String(error.message || error.code || "Validation error"));
      });
      return;
    }
    if (bucket.primary.length) {
      sections.push(
        formatActivityArchetypeFailure(
          activityId,
          bucket,
          inspectionByActivity[activityId]
        )
      );
      return;
    }
    bucket.other.concat(bucket.consequences).forEach(function (error) {
      sections.push(
        "Activity " +
          activityId +
          ": " +
          String(error.message || error.code || "Validation error")
      );
    });
  });

  if (!sections.length) {
    return "Learner page model validation failed.";
  }
  return sections.join("\n\n");
}

module.exports = {
  CASCADE_CONSEQUENCE_CODES: CASCADE_CONSEQUENCE_CODES,
  PRIMARY_ARCHETYPE_FAILURE_CODES: PRIMARY_ARCHETYPE_FAILURE_CODES,
  listRegisteredVariants: listRegisteredVariants,
  inspectActivityArchetype: inspectActivityArchetype,
  inspectActivitiesArchetypes: inspectActivitiesArchetypes,
  markCascadeErrors: markCascadeErrors,
  collectPrimaryFailureActivityIds: collectPrimaryFailureActivityIds,
  groupErrorsByActivity: groupErrorsByActivity,
  summarizeCascadeByActivity: summarizeCascadeByActivity,
  formatGroupedModelErrors: formatGroupedModelErrors
};
