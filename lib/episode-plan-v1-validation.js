/**
 * Sprint 38-S — Episode Plan V1 frozen taxonomy validation (38R-2 / 38Q-2).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      require("./episode-plan-population-contract.js"),
      require("./episode-plan-v1-templates.js")
    );
  } else {
    var contract = root.PRISM_EPISODE_PLAN_POPULATION;
    var templates = root.PRISM_EPISODE_PLAN_V1_TEMPLATES;
    root.PRISM_EPISODE_PLAN_V1_VALIDATION = factory(contract, templates);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (contractMod, templatesMod) {
  var FROZEN_ARCHETYPES = ["understand", "apply", "analyse", "evaluate"];

  function frozenArchetypeSet() {
    var set = {};
    FROZEN_ARCHETYPES.forEach(function (a) {
      set[a] = true;
    });
    return set;
  }

  function approvedFunctionSet() {
    var specs =
      contractMod && contractMod.FUNCTION_SPECS ? contractMod.FUNCTION_SPECS : {};
    var set = {};
    Object.keys(specs).forEach(function (k) {
      set[String(k).trim().toLowerCase()] = true;
    });
    return set;
  }

  function normalizeKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  var ALLOWED_EPISODE_PLAN_KEYS = { archetype: true, beats: true };
  var ALLOWED_BEAT_KEYS = { function: true };

  function validateEpisodePlanV1(episodePlan, prefix) {
    var errors = [];
    var label = prefix || "episode_plan";
    if (!episodePlan || typeof episodePlan !== "object") {
      return { ok: false, errors: [label + ": missing episode_plan object"] };
    }
    Object.keys(episodePlan).forEach(function (key) {
      if (!ALLOWED_EPISODE_PLAN_KEYS[key]) {
        errors.push(label + ": non-V1 field '" + key + "'");
      }
    });
    var archetype = normalizeKey(episodePlan.archetype);
    if (!archetype) {
      errors.push(label + ": missing archetype");
    } else if (!frozenArchetypeSet()[archetype]) {
      errors.push(label + ": archetype '" + episodePlan.archetype + "' is not frozen V1 (use understand|apply|analyse|evaluate)");
    }
    var beats = Array.isArray(episodePlan.beats) ? episodePlan.beats : [];
    if (!beats.length) {
      errors.push(label + ": beats[] empty");
    }
    var fnSet = approvedFunctionSet();
    beats.forEach(function (beat, index) {
      if (!beat || typeof beat !== "object") {
        errors.push(label + " beat[" + index + "]: not an object");
        return;
      }
      Object.keys(beat).forEach(function (key) {
        if (!ALLOWED_BEAT_KEYS[key]) {
          errors.push(label + " beat[" + index + "]: non-V1 field '" + key + "'");
        }
      });
      var fn = normalizeKey(beat.function);
      if (!fn) {
        errors.push(label + " beat[" + index + "]: missing function");
      } else if (!fnSet[fn]) {
        errors.push(
          label + " beat[" + index + "]: function '" + beat.function + "' is not approved FunctionEnum"
        );
      }
    });
    if (contractMod && typeof contractMod.assertPlanBeforePopulateGate === "function") {
      var gate = contractMod.assertPlanBeforePopulateGate(episodePlan);
      if (!gate.ok) {
        gate.errors.forEach(function (e) {
          errors.push(label + ": " + e);
        });
      }
    }
    return { ok: errors.length === 0, errors: errors };
  }

  function resolveEpisodePlanFromRow(row, index) {
    if (!row || typeof row !== "object") return null;
    if (row.episode_plan && typeof row.episode_plan === "object") {
      return row.episode_plan;
    }
    if (row.archetype || row.beats) {
      return {
        archetype: row.archetype,
        beats: row.beats
      };
    }
    if (row.archetype && !row.beats) {
      return { archetype: row.archetype, beats: [] };
    }
    return null;
  }

  function validateEpisodePlansContainerV1(container) {
    var errors = [];
    if (!container || typeof container !== "object") {
      return { ok: false, errors: ["EP-V1: missing episode_plans container"] };
    }
    var forbiddenContainerKeys = ["transitions", "learner_state", "branching", "orchestration"];
    forbiddenContainerKeys.forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(container, key)) {
        errors.push("EP-V1: non-V1 container field '" + key + "'");
      }
    });
    var plans = container.episode_plans;
    if (!Array.isArray(plans) || !plans.length) {
      return { ok: false, errors: ["EP-V1: episode_plans[] missing or empty"] };
    }
    plans.forEach(function (row, index) {
      var prefix = "plan[" + index + "]";
      if (!row || typeof row !== "object") {
        errors.push(prefix + ": not an object");
        return;
      }
      if (!String(row.activity_id || "").trim()) {
        errors.push(prefix + ": missing activity_id");
      }
      ["transitions", "learner_state", "branching", "orchestration", "material_obligations"].forEach(
        function (key) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            errors.push(prefix + ": non-V1 field '" + key + "'");
          }
        }
      );
      var episodePlan = resolveEpisodePlanFromRow(row, index);
      if (!episodePlan) {
        errors.push(prefix + ": missing episode_plan { archetype, beats[] }");
        return;
      }
      if (row.archetype && row.episode_plan) {
        errors.push(prefix + ": duplicate archetype at row and episode_plan level");
      }
      var planCheck = validateEpisodePlanV1(episodePlan, prefix + ".episode_plan");
      if (!planCheck.ok) {
        errors = errors.concat(planCheck.errors);
      }
    });
    return { ok: errors.length === 0, errors: errors };
  }

  function isEpisodePlansContainerV1Valid(container) {
    return validateEpisodePlansContainerV1(container).ok;
  }

  return {
    VALIDATION_VERSION: "38S-V1",
    FROZEN_ARCHETYPES: FROZEN_ARCHETYPES.slice(),
    frozenArchetypeSet: frozenArchetypeSet,
    approvedFunctionSet: approvedFunctionSet,
    validateEpisodePlanV1: validateEpisodePlanV1,
    validateEpisodePlansContainerV1: validateEpisodePlansContainerV1,
    isEpisodePlansContainerV1Valid: isEpisodePlansContainerV1Valid,
    resolveEpisodePlanFromRow: resolveEpisodePlanFromRow
  };
});
