"use strict";

var validateInput = require("./validate-input").validateInput;
var diagnostic = require("./validate-input").diagnostic;
var buildActivityModel =
  require("./build-activity-model").buildActivityModel;
var validatePageModel = require("./validate-model").validatePageModel;
var normalizeContent = require("./normalize-content");
var parseMaterial = require("./parse-material");
var expositoryStructured = require("./expository-structured-materials");
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
var timelineDurations = require("./project-timeline-durations");
var sessionFraming = require("./resolve-session-framing");

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

/**
 * Map assembled page.sections[] into learner-facing exposition sections.
 * Preserves source order. Does not invent prose or convert sections to activities.
 *
 * @param {Object} page
 * @returns {import("./types").ExpositionSection[]}
 */
function buildExpositionSections(page) {
  var sections = Array.isArray(page && page.sections) ? page.sections : [];
  return sections
    .map(function (section, index) {
      if (!section || typeof section !== "object") return null;
      var sectionId = String(section.section_id || "").trim();
      if (!sectionId) return null;
      var materials = Array.isArray(section.materials) ? section.materials : [];
      return {
        id: sectionId,
        title: String(section.title || "").trim() || "Section " + (index + 1),
        // Learner-facing prose from XD exposition only — never fall back to explanation_intent.
        explanation: String(section.exposition || "").trim(),
        order:
          typeof section.order === "number" && Number.isFinite(section.order)
            ? section.order
            : index + 1,
        materials: materials
          .map(function (material, materialIndex) {
            if (!material || typeof material !== "object") return null;
            var sectionMaterialId =
              String(material.material_id || "").trim() ||
              sectionId + "-material-" + (materialIndex + 1);
            var structured = expositoryStructured.buildExpositionStructuredMaterial(
              material,
              sectionId,
              materialIndex
            );
            if (structured) {
              structured.id = structured.id || sectionMaterialId;
              return structured;
            }
            var kind = String(material.kind || material.type || "").trim();
            var renderKind = parseMaterial.hasMaterialRenderer(kind) ? kind : "text";
            var source = Object.assign({}, material, {
              material_id: sectionMaterialId,
              kind: renderKind,
              type: renderKind,
              material_type: renderKind,
              title: String(material.title || "").trim(),
              // String prose only on the ordinary path — structured objects handled above.
              body:
                typeof material.body === "string"
                  ? material.body
                  : material.body == null
                    ? ""
                    : ""
            });
            // Defensive: object bodies should already be classified above. If not,
            // preserve the body for semantic fallback (never String(object)).
            if (material.body != null && typeof material.body === "object") {
              return {
                id: sectionMaterialId,
                kind: kind || "structured",
                type: "expository_structured_fallback",
                sectionId: sectionId,
                commissionId: String(material.commission_id || "").trim(),
                sourceOrder: materialIndex,
                title: String(material.title || "").trim(),
                body: material.body
              };
            }
            var model = parseMaterial.buildMaterialModel(source, materialIndex);
            model.kind = kind || renderKind;
            model.sectionId = sectionId;
            model.commissionId = String(material.commission_id || "").trim();
            return model;
          })
          .filter(Boolean),
        visualAffordanceAfterContent: null
      };
    })
    .filter(Boolean);
}

function synthesisBody(page, field) {
  var value = page && page.page_synthesis && page.page_synthesis[field];
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return String(value.body == null ? "" : value.body).trim();
  }
  return String(value == null ? "" : value).trim();
}

/**
 * Deterministic Expository product marker for presentation scoping (S87-T-005).
 * True when assemble stamped expository_journey or Expository stages enriched the page.
 * Interactive pages must not receive this marker.
 */
function isExpositoryLearnerPage(page) {
  if (!page || typeof page !== "object") return false;
  if (page.expository_journey && typeof page.expository_journey === "object") {
    return true;
  }
  var enriched =
    page.assembly_state && Array.isArray(page.assembly_state.enriched_by)
      ? page.assembly_state.enriched_by
      : [];
  for (var i = 0; i < enriched.length; i++) {
    var stage = String(enriched[i] || "").trim();
    if (
      stage === "expository_journey_plan" ||
      stage === "expository_development" ||
      stage === "expository_materials"
    ) {
      return true;
    }
  }
  return false;
}

function normalizeLearningOutcomeId(outcome) {
  if (!outcome || typeof outcome !== "object") return "";
  var id = outcome.id;
  if (id == null || id === "") id = outcome.outcome_id;
  if (id == null || id === "") id = outcome.learning_outcome_id;
  return String(id == null ? "" : id).trim();
}

/**
 * Shell / unfinished activities that must not appear in the learner-facing page.
 * Typical shape: truncated LO title, "—" instructional fields, empty materials.
 */
function isPlaceholderActivity(activity) {
  if (!activity || typeof activity !== "object") return true;
  function isEmptyOrDash(value) {
    var text = String(value == null ? "" : value).trim();
    return !text || text === "—" || text === "-" || text === "–";
  }
  var materials = Array.isArray(activity.materials) ? activity.materials : [];
  var required = Array.isArray(activity.required_materials)
    ? activity.required_materials
    : [];
  if (materials.length > 0 || required.length > 0) return false;
  return (
    isEmptyOrDash(activity.learner_task) &&
    isEmptyOrDash(activity.expected_output) &&
    isEmptyOrDash(activity.activity_preamble)
  );
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
  if (!sequence) {
    return activities.filter(function (activity) {
      if (!isPlaceholderActivity(activity)) return true;
      warnings.push(
        diagnostic(
          "warning",
          "PLACEHOLDER_ACTIVITY_OMITTED",
          "Placeholder activity omitted from learner page (empty instructional fields and materials).",
          { activityId: String(activity.activity_id || "") }
        )
      );
      return false;
    });
  }

  var included = {};
  var ordered = sequence
    .map(function (activityId) {
      included[activityId] = true;
      var activity = byId[activityId];
      if (!activity) return null;
      if (isPlaceholderActivity(activity)) {
        warnings.push(
          diagnostic(
            "warning",
            "PLACEHOLDER_ACTIVITY_OMITTED",
            "Placeholder activity listed in learning_sequence was omitted from learner page.",
            { activityId: activityId }
          )
        );
        return null;
      }
      return activity;
    })
    .filter(Boolean);
  activities.forEach(function (activity) {
    var activityId = String(activity.activity_id || "");
    if (included[activityId]) return;
    if (isPlaceholderActivity(activity)) {
      warnings.push(
        diagnostic(
          "warning",
          "PLACEHOLDER_ACTIVITY_OMITTED",
          "Placeholder activity not in learning_sequence omitted from learner page.",
          { activityId: activityId }
        )
      );
      return;
    }
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

  var sourcePage = timelineDurations.pageWithProjectedTimelineDurations(page);
  var errors = [];
  var warnings = inputValidation.warnings.slice();
  var omittedBeats = [];
  var archetypeInspection = inspectActivitiesArchetypes(
    Array.isArray(sourcePage.activities) ? sourcePage.activities : []
  );
  var activityModels = orderedActivities(sourcePage, warnings).map(function (activity) {
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
  var headerDurationMinutes = timelineDurations.resolveHeaderDurationMinutes(
    totalDuration,
    sourcePage.learning_sequence
  );
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
            id: normalizeLearningOutcomeId(outcome),
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

  var overview = normalizeContent.stripLeadingMatchingMarkdownHeading(
    synthesisBody(page, "overview"),
    "Overview"
  );
  var studyTips = normalizeContent.stripLeadingMatchingMarkdownHeading(
    synthesisBody(page, "study_tips"),
    "Study tips"
  );
  var closingParagraph = normalizeContent.stripLeadingMatchingMarkdownHeading(
    synthesisBody(page, "closing_paragraph"),
    "Closing"
  );
  var assessmentItems =
    page.assessment_check && Array.isArray(page.assessment_check.items)
      ? page.assessment_check.items.map(function (item) {
          return Object.assign({}, item);
        })
      : [];
  var model = {
    title: String(page.title || "").trim(),
    pageKind: isExpositoryLearnerPage(sourcePage) ? "expository" : "interactive",
    sessionFraming: sessionFraming.resolveSessionFramingFromPage(page),
    header: {
      description: overview,
      durationMinutes: headerDurationMinutes
    },
    orientationSections: orientationSections,
    expositionSections: buildExpositionSections(sourcePage),
    closingParagraph: closingParagraph,
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
  buildExpositionSections: buildExpositionSections,
  isExpositoryLearnerPage: isExpositoryLearnerPage,
  buildPageModel: buildPageModel
};
