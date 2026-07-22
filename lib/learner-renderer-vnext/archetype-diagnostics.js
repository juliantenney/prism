"use strict";

var ARCHETYPE_RULES = require("./archetype-rules").ARCHETYPE_RULES;
var selectArchetypeVariant = require("./archetype-rules").selectArchetypeVariant;

var CASCADE_CONSEQUENCE_CODES = Object.freeze([
  "UNASSIGNED_MATERIAL",
  "MULTIPLY_ASSIGNED_MATERIAL",
  "UNASSIGNED_TASK_STEP",
  "MULTIPLY_ASSIGNED_TASK_STEP",
  "UNASSIGNED_EXPECTED_OUTPUT",
  "MULTIPLY_ASSIGNED_EXPECTED_OUTPUT",
  "EMPTY_RENDERED_BEAT"
]);

function listRegisteredVariants(archetype) {
  var family = ARCHETYPE_RULES[String(archetype || "")];
  if (!family || !Array.isArray(family.variants)) return [];
  return family.variants.map(function (variant) {
    return {
      id: variant.id,
      beatSequence: variant.beatSequence.slice()
    };
  });
}

function describeNoMatchReason(archetype, normalizedSequence, registeredVariants) {
  if (!String(archetype || "").trim()) {
    return "Activity episode_plan.archetype is missing or empty after normalisation.";
  }
  if (!registeredVariants.length) {
    return 'No variants are registered for archetype "' + archetype + '".';
  }
  if (!normalizedSequence.length) {
    return "Activity episode_plan.beats is empty or all beat functions normalised to empty strings.";
  }
  return (
    "No registered variant has an exact beat-sequence match. " +
    "Normalised sequence length is " +
    normalizedSequence.length +
    "; registered variant count is " +
    registeredVariants.length +
    "."
  );
}

/**
 * Capture archetype selection inputs immediately before variant matching.
 *
 * @param {Object} activity
 * @param {function(string): string} normalizeToken
 * @returns {Object}
 */
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
  var variant = selectArchetypeVariant(archetype, normalizedBeatSequence);

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
    registeredVariantIds: registeredVariants.map(function (row) {
      return row.id;
    }),
    acceptedSequences: registeredVariants.map(function (row) {
      return row.beatSequence.slice();
    }),
    matchedVariantId: variant ? variant.id : null,
    match: !!variant,
    noMatchReason: variant
      ? null
      : describeNoMatchReason(archetype, normalizedBeatSequence, registeredVariants)
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

function markCascadeErrors(errors, primaryActivityIds) {
  var primary = primaryActivityIds || {};
  return (Array.isArray(errors) ? errors : []).map(function (error) {
    var next = Object.assign({}, error);
    var activityId = String(next.activityId || "");
    if (next.code === "UNKNOWN_ARCHETYPE_VARIANT") {
      next.errorRole = "primary";
      return next;
    }
    if (
      primary[activityId] &&
      CASCADE_CONSEQUENCE_CODES.indexOf(String(next.code || "")) >= 0
    ) {
      next.errorRole = "consequence";
      next.cascadeOf = "UNKNOWN_ARCHETYPE_VARIANT";
    }
    return next;
  });
}

function collectPrimaryFailureActivityIds(errors) {
  var primary = {};
  (Array.isArray(errors) ? errors : []).forEach(function (error) {
    if (error && error.code === "UNKNOWN_ARCHETYPE_VARIANT" && error.activityId) {
      primary[String(error.activityId)] = true;
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
    lines.push("    Archetype: " + String((inspection && inspection.archetype) || primary.archetype || ""));
    lines.push(
      "    Actual sequence: " +
        JSON.stringify(
          (inspection && inspection.normalizedBeatSequence) ||
            primary.candidateBeats ||
            []
        )
    );
    lines.push(
      "    Accepted sequences: " +
        JSON.stringify((inspection && inspection.acceptedSequences) || [])
    );
    if (inspection && inspection.noMatchReason) {
      lines.push("    Reason: " + inspection.noMatchReason);
    }
  }
  var consequences = groupedBucket.consequences;
  if (consequences.length) {
    lines.push("  Consequences:");
    var materialCount = consequences.filter(function (error) {
      return error.code === "UNASSIGNED_MATERIAL" || error.code === "MULTIPLY_ASSIGNED_MATERIAL";
    }).length;
    var stepCount = consequences.filter(function (error) {
      return error.code === "UNASSIGNED_TASK_STEP" || error.code === "MULTIPLY_ASSIGNED_TASK_STEP";
    }).length;
    var expectedCount = consequences.filter(function (error) {
      return (
        error.code === "UNASSIGNED_EXPECTED_OUTPUT" ||
        error.code === "MULTIPLY_ASSIGNED_EXPECTED_OUTPUT"
      );
    }).length;
    if (materialCount) lines.push("    " + materialCount + " material assignment error(s)");
    if (stepCount) lines.push("    " + stepCount + " learner-task step assignment error(s)");
    if (expectedCount) lines.push("    " + expectedCount + " expected-output assignment error(s)");
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
        "Activity " + activityId + ": " + String(error.message || error.code || "Validation error")
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
  listRegisteredVariants: listRegisteredVariants,
  inspectActivityArchetype: inspectActivityArchetype,
  inspectActivitiesArchetypes: inspectActivitiesArchetypes,
  markCascadeErrors: markCascadeErrors,
  collectPrimaryFailureActivityIds: collectPrimaryFailureActivityIds,
  groupErrorsByActivity: groupErrorsByActivity,
  summarizeCascadeByActivity: summarizeCascadeByActivity,
  formatGroupedModelErrors: formatGroupedModelErrors
};
