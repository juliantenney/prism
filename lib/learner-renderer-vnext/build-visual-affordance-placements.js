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

    arrayOrEmpty(activity.beats).forEach(function (beat) {
      var sequence = arrayOrEmpty(beat.contentSequence);
      sequence.forEach(function (item, index) {
        if (!item || typeof item !== "object") return;
        item.visualAffordanceBefore = null;
        item.visualAffordanceAfter = null;

        var remaining = sequence.slice(index + 1);

        if (!activityHasMaterialsEntry && item.kind === "material") {
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

          if (warrants.isCardGridMaterialType(materialType)) {
            if (
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
            }
          }

          if (warrants.isTableMaterialType(materialType)) {
            if (
              shouldEmitHook(plan, activity.id, "materials-table-pair-between", function () {
                return warrants.legacyWarrantForSlot(
                  "materials-table-pair-between",
                  activity,
                  remaining
                );
              })
            ) {
              item.visualAffordanceAfter = buildHookDescriptor(
                "materials-table-pair-between",
                plan,
                activity.id,
                subject
              );
            }
          }
        }
      });
    });
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
