"use strict";

var sprint38 = require("./sprint38-visual-affordance-plan");
var warrants = require("./visual-affordance-warrants");

function shouldEmitHook(plan, activityId, slot, legacyWarrantFn) {
  if (!plan || plan.legacy) return legacyWarrantFn();
  return !!sprint38.resolveSlotGenerate(plan, activityId, slot);
}

/**
 * @param {string} slot
 * @param {Object} plan
 * @param {string} activityId
 * @param {string} subject
 * @returns {import("./types").VisualAffordanceHook|null}
 */
function buildHookDescriptor(slot, plan, activityId, subject) {
  var resolved = plan && !plan.legacy ? sprint38.resolveSlotGenerate(plan, activityId, slot) : null;
  return {
    slot: slot,
    activityId: resolved ? String(resolved.activity_id || activityId || "").trim() : String(activityId || "").trim(),
    affordanceId: resolved ? String(resolved.affordance_id || "").trim() : "",
    subject: String(subject || "").trim()
  };
}

/**
 * Attach machine-detectable visual affordance hook descriptors to the page model.
 * Resolution uses Sprint 38 render plan when authored affordances exist; otherwise
 * legacy placement warrants derived from typed model content.
 *
 * @param {Object} page
 * @param {import("./types").LearnerPageModel} model
 */
function attachVisualAffordancePlacements(page, model) {
  var plan = sprint38.buildVisualAffordanceRenderPlan(page);
  model.visualAffordancePlan = {
    legacy: !!plan.legacy,
    slotGenerate: plan.slotGenerate || {},
    affordanceCount: plan.affordance_count || 0
  };

  if (
    shouldEmitHook(plan, "", "knowledge-summary-after-content", function () {
      return arrayOrEmpty(model.orientationSections).some(function (section) {
        return section && section.type === "knowledge_summary" && String(section.content || "").trim();
      });
    })
  ) {
    model.visualAffordanceAfterKnowledgeSummary = buildHookDescriptor(
      "knowledge-summary-after-content",
      plan,
      "",
      model.title
    );
  } else {
    model.visualAffordanceAfterKnowledgeSummary = null;
  }

  if (
    shouldEmitHook(plan, "", "assessment-before-checkpoint", function () {
      return warrants.pageWarrantsAssessmentAffordance(model);
    })
  ) {
    model.visualAffordanceBeforeAssessment = buildHookDescriptor(
      "assessment-before-checkpoint",
      plan,
      "",
      model.title
    );
  } else {
    model.visualAffordanceBeforeAssessment = null;
  }

  arrayOrEmpty(model.activities).forEach(function (activity) {
    var subject = String(activity.title || "").trim();
    var activityHasMaterialsEntry = false;

    activity.visualAffordanceAfterHeader = shouldEmitHook(
      plan,
      activity.id,
      "activity-after-header",
      function () {
        return warrants.activityWarrantsAfterHeaderAffordance(activity);
      }
    )
      ? buildHookDescriptor("activity-after-header", plan, activity.id, subject)
      : null;

    // Track whether Sprint 38 plan slots that depend on material-type guards have
    // been placed. When the plan explicitly authorises a slot the hook must be
    // emitted even when the legacy material-type heuristic would not fire —
    // the plan is the authoritative source for slot placement.
    var activityCardGridPlaced = false;
    var activityTablePairPlaced = false;
    var planWantsCardGrid = !!(plan && !plan.legacy &&
      sprint38.resolveSlotGenerate(plan, activity.id, "materials-card-grid-after"));
    var planWantsTablePair = !!(plan && !plan.legacy &&
      sprint38.resolveSlotGenerate(plan, activity.id, "materials-table-pair-between"));
    var planWantsAssessmentCheckpoint = !!(plan && !plan.legacy &&
      sprint38.resolveSlotGenerate(plan, activity.id, "assessment-before-checkpoint"));
    // First material in the activity — used as a fallback placement target when
    // the plan authorises a slot but no matching material type exists.
    var firstMaterialItem = null;
    var checkpointByPriority = {
      checklist: null,
      template: null,
      decision_table: null
    };

    arrayOrEmpty(activity.beats).forEach(function (beat) {
      var sequence = arrayOrEmpty(beat.contentSequence);
      sequence.forEach(function (item, index) {
        if (!item || typeof item !== "object") return;
        item.visualAffordanceBefore = null;
        item.visualAffordanceAfter = null;

        var remaining = sequence.slice(index + 1);

        if (!activityHasMaterialsEntry && item.kind === "material") {
          if (!firstMaterialItem) firstMaterialItem = item;
          if (
            shouldEmitHook(plan, activity.id, "materials-entry", function () {
              return warrants.legacyWarrantForSlot("materials-entry", activity, remaining);
            })
          ) {
            item.visualAffordanceBefore = buildHookDescriptor(
              "materials-entry",
              plan,
              activity.id,
              subject
            );
            activityHasMaterialsEntry = true;
          }
        }

        if (item.kind === "material" && item.material) {
          var materialType = String(item.material.type || "");

          if (
            planWantsAssessmentCheckpoint &&
            checkpointByPriority[materialType] === null
          ) {
            checkpointByPriority[materialType] = item;
          }

          if (warrants.isCardGridMaterialType(materialType)) {
            if (
              !activityCardGridPlaced &&
              shouldEmitHook(plan, activity.id, "materials-card-grid-after", function () {
                return warrants.legacyWarrantForSlot(
                  "materials-card-grid-after",
                  activity,
                  remaining
                );
              })
            ) {
              item.visualAffordanceAfter = buildHookDescriptor(
                "materials-card-grid-after",
                plan,
                activity.id,
                subject
              );
              activityCardGridPlaced = true;
            }
          }

          if (warrants.isTableMaterialType(materialType)) {
            // materials-table-pair-between is a single between-pair placement:
            // consume once per activity|slot identity, and only after a table
            // whose next material is also a table. Plan authorisation alone
            // must not re-emit the same placement after every subsequent table.
            var tablePairBetweenWarrant = warrants.legacyWarrantForSlot(
              "materials-table-pair-between",
              activity,
              remaining
            );
            if (
              !activityTablePairPlaced &&
              !item.visualAffordanceAfter &&
              tablePairBetweenWarrant &&
              shouldEmitHook(plan, activity.id, "materials-table-pair-between", function () {
                return true;
              })
            ) {
              item.visualAffordanceAfter = buildHookDescriptor(
                "materials-table-pair-between",
                plan,
                activity.id,
                subject
              );
              activityTablePairPlaced = true;
            }
          }
        }
      });
    });

    // Fallback: when the Sprint 38 plan authorises a material-dependent slot but
    // no matching material type was found, place the hook on the first material.
    if (!activityCardGridPlaced && planWantsCardGrid && firstMaterialItem) {
      firstMaterialItem.visualAffordanceAfter = buildHookDescriptor(
        "materials-card-grid-after",
        plan,
        activity.id,
        subject
      );
    }
    if (!activityTablePairPlaced && planWantsTablePair && firstMaterialItem) {
      if (!firstMaterialItem.visualAffordanceAfter) {
        firstMaterialItem.visualAffordanceAfter = buildHookDescriptor(
          "materials-table-pair-between",
          plan,
          activity.id,
          subject
        );
      }
    }

    // Activity-scoped assessment-before-checkpoint (Design Page may author this
    // on an activity rather than the page assessment region). Prefer checklist /
    // template / decision_table; fall back to the first material.
    if (planWantsAssessmentCheckpoint) {
      var checkpointTarget =
        checkpointByPriority.checklist ||
        checkpointByPriority.template ||
        checkpointByPriority.decision_table ||
        firstMaterialItem;
      if (checkpointTarget && !checkpointTarget.visualAffordanceBefore) {
        checkpointTarget.visualAffordanceBefore = buildHookDescriptor(
          "assessment-before-checkpoint",
          plan,
          activity.id,
          subject
        );
      } else if (
        checkpointTarget &&
        checkpointTarget.visualAffordanceBefore &&
        !checkpointTarget.visualAffordanceAfter
      ) {
        checkpointTarget.visualAffordanceAfter = buildHookDescriptor(
          "assessment-before-checkpoint",
          plan,
          activity.id,
          subject
        );
      }
    }
  });
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

module.exports = {
  attachVisualAffordancePlacements: attachVisualAffordancePlacements,
  shouldEmitHook: shouldEmitHook,
  buildHookDescriptor: buildHookDescriptor
};
