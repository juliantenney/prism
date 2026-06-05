/**
 * Sprint 38-L — DLA mandatory obligation checker (pack §5 IFP-10 / DLA-WB-26..31).
 * Used by harness smoke tests and post-capture validation; no schema changes.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PRISM_DLA_38L_OBLIGATION_CHECK = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function activityList(learningActivities) {
    if (!learningActivities || typeof learningActivities !== "object") return [];
    if (Array.isArray(learningActivities.activities)) return learningActivities.activities;
    if (Array.isArray(learningActivities.learning_activities)) {
      return learningActivities.learning_activities;
    }
    return [];
  }

  function materialTypes(activity) {
    var mats = activity && Array.isArray(activity.required_materials) ? activity.required_materials : [];
    return mats.map(function (m) {
      return String((m && m.type) || "").trim().toLowerCase();
    });
  }

  function findMaterialIndex(materials, predicate) {
    if (!Array.isArray(materials)) return -1;
    for (var i = 0; i < materials.length; i++) {
      if (predicate(materials[i], i)) return i;
    }
    return -1;
  }

  function isEvaluateCapstone(activity, index, total) {
    if (!activity || typeof activity !== "object") return false;
    if (index === total - 1 && total >= 2) return true;
    var task = String(activity.learner_task || "").toLowerCase();
    var title = String(activity.title || "").toLowerCase();
    if (/evaluate|judgement|judgment|strategy/.test(task + " " + title)) return true;
    if (activity.transfer_or_application_task) return true;
    return false;
  }

  function hasIndependentJudgementMaterial(materials) {
    return findMaterialIndex(materials, function (m) {
      var type = String((m && m.type) || "").toLowerCase();
      var purpose = String((m && m.purpose) || "").toLowerCase();
      return (
        (type === "template" || type === "task_cards") &&
        /independent judgement|independent judgment/.test(purpose)
      );
    }) !== -1;
  }

  /**
   * @param {object} learningActivities
   * @returns {{ ok: boolean, errors: string[] }}
   */
  function validateDla38LObligations(learningActivities) {
    var acts = activityList(learningActivities);
    var errors = [];

    if (!acts.length) {
      return { ok: false, errors: ["no activities"] };
    }

    acts.forEach(function (act, index) {
      var aid = String((act && act.activity_id) || "activity_" + (index + 1));
      var materials = Array.isArray(act.required_materials) ? act.required_materials : [];
      var types = materialTypes(act);

      if (types.indexOf("checklist") === -1) {
        errors.push(aid + ": missing checklist material (DLA-WB-26)");
      }

      var analysisIdx = findMaterialIndex(materials, function (m) {
        return String((m && m.type) || "").toLowerCase() === "analysis_table";
      });
      if (analysisIdx !== -1) {
        var passIdx = findMaterialIndex(materials, function (m) {
          var type = String((m && m.type) || "").toLowerCase();
          var purpose = String((m && m.purpose) || "").toLowerCase();
          return (
            (type === "worked_example" || type === "modelling_note") &&
            /worked analytic pass|analytic pass/.test(purpose)
          );
        });
        if (passIdx === -1 || passIdx > analysisIdx) {
          errors.push(
            aid + ": missing worked analytic pass before analysis_table (DLA-WB-27)"
          );
        }
      }

      if (isEvaluateCapstone(act, index, acts.length)) {
        if (!hasIndependentJudgementMaterial(materials)) {
          errors.push(
            aid + ": missing independent judgement template/task_cards (DLA-WB-28/31)"
          );
        }
        if (types.indexOf("transfer_prompt") === -1) {
          errors.push(aid + ": missing transfer_prompt material (DLA-WB-28/31)");
        }
      }

      if (act.transfer_or_application_task && types.indexOf("transfer_prompt") === -1) {
        errors.push(
          aid + ": transfer_or_application_task field without transfer_prompt row (DLA-WB-29)"
        );
      }
    });

    return { ok: errors.length === 0, errors: errors };
  }

  return {
    validateDla38LObligations: validateDla38LObligations,
    activityList: activityList
  };
});
