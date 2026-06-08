/**
 * Sprint 38-S — DLA obligation tagging + population contract integration (38S-3).
 */
(function (root, factory) {
  var contract = null;
  var templates = null;
  if (typeof module === "object" && module.exports) {
    contract = require("./episode-plan-population-contract.js");
    templates = require("./episode-plan-v1-templates.js");
    module.exports = factory(contract, templates);
  } else {
    contract = root.PRISM_EPISODE_PLAN_POPULATION;
    templates = root.PRISM_EPISODE_PLAN_V1_TEMPLATES;
    root.PRISM_EPISODE_PLAN_DLA_INTEGRATION = factory(contract, templates);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (contract, templatesMod) {
  var INTEGRATION_VERSION = "38S-R1";

  function requireContract() {
    if (!contract || typeof contract.assertPlanBeforePopulateGate !== "function") {
      throw new Error("episode-plan-population-contract module unavailable");
    }
    return contract;
  }

  function requireTemplates() {
    if (!templatesMod || typeof templatesMod.deriveEpisodePlansFromLearningOutcomes !== "function") {
      throw new Error("episode-plan-v1-templates module unavailable");
    }
    return templatesMod;
  }

  function activityList(learningActivities) {
    if (!learningActivities || typeof learningActivities !== "object") return [];
    if (Array.isArray(learningActivities.activities)) return learningActivities.activities;
    if (Array.isArray(learningActivities.learning_activities)) {
      return learningActivities.learning_activities;
    }
    return [];
  }

  function normalizeFn(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");
  }

  function purposeMatchesFunction(purpose, fn) {
    var p = normalizeFn(purpose).replace(/_/g, " ");
    var f = normalizeFn(fn).replace(/_/g, " ");
    return p === f || p.indexOf(f) !== -1 || f.indexOf(p) !== -1;
  }

  function is38LDepthRow(m) {
    if (!m || typeof m !== "object") return false;
    var purpose = String(m.purpose || "").toLowerCase();
    var type = String(m.type || "").toLowerCase();
    if (type === "consolidation_summary") return true;
    if (/worked analytic pass|analytic pass/.test(purpose)) return true;
    if (
      (type === "template" || type === "task_cards") &&
      /independent judgement|independent judgment/.test(purpose)
    ) {
      return true;
    }
    return false;
  }

  function placementIndexForSupplementary(materials, extra) {
    var type = String(extra.type || "").toLowerCase();
    var purpose = String(extra.purpose || "").toLowerCase();
    if (/worked analytic pass|analytic pass/.test(purpose)) {
      var tableIdx = materials.findIndex(function (m) {
        return String(m.type || "").toLowerCase() === "analysis_table";
      });
      if (tableIdx >= 0) return tableIdx;
    }
    if (
      (type === "template" || type === "task_cards") &&
      /independent judgement|independent judgment/.test(purpose)
    ) {
      var transferIdx = materials.findIndex(function (m) {
        return String(m.type || "").toLowerCase() === "transfer_prompt";
      });
      if (transferIdx >= 0) return transferIdx;
    }
    return materials.length;
  }

  function findPlanForActivity(episodePlansContainer, activity, index) {
    var plans = (episodePlansContainer && episodePlansContainer.episode_plans) || [];
    var aid = String((activity && activity.activity_id) || "").trim();
    if (aid) {
      var hit = plans.find(function (p) {
        return String(p.activity_id || "") === aid;
      });
      if (hit && hit.episode_plan) return hit.episode_plan;
    }
    if (plans[index] && plans[index].episode_plan) return plans[index].episode_plan;
    return null;
  }

  function assertPlanBeforePopulateGate(episodePlan) {
    return requireContract().assertPlanBeforePopulateGate(episodePlan);
  }

  function requireV1Validation() {
    if (typeof module === "object" && module.exports) {
      try {
        return require("./episode-plan-v1-validation.js");
      } catch (_) {
        return null;
      }
    }
    return typeof globalThis !== "undefined" && globalThis.PRISM_EPISODE_PLAN_V1_VALIDATION
      ? globalThis.PRISM_EPISODE_PLAN_V1_VALIDATION
      : null;
  }

  function assertEpisodePlansContainerGate(episodePlansContainer) {
    var v1 = requireV1Validation();
    if (v1 && typeof v1.validateEpisodePlansContainerV1 === "function") {
      return v1.validateEpisodePlansContainerV1(episodePlansContainer);
    }
    var errors = [];
    if (!episodePlansContainer || typeof episodePlansContainer !== "object") {
      return { ok: false, errors: ["PF-11: missing episode_plans container"] };
    }
    var plans = episodePlansContainer.episode_plans;
    if (!Array.isArray(plans) || !plans.length) {
      return { ok: false, errors: ["PF-11: episode_plans empty"] };
    }
    plans.forEach(function (row, i) {
      var gate = assertPlanBeforePopulateGate(row && row.episode_plan);
      if (!gate.ok) {
        gate.errors.forEach(function (e) {
          errors.push("plan[" + i + "]: " + e);
        });
      }
    });
    return { ok: errors.length === 0, errors: errors };
  }

  function deriveEpisodePlansFromLearningOutcomes(learningOutcomes, options) {
    return requireTemplates().deriveEpisodePlansFromLearningOutcomes(learningOutcomes, options);
  }

  /**
   * Merge LLM DLA output with plan-ordered obligation scaffold (tags + order authoritative).
   */
  function mergePopulationScaffoldWithLlmActivity(llmActivity, episodePlan) {
    var c = requireContract();
    var gate = c.assertPlanBeforePopulateGate(episodePlan);
    if (!gate.ok) {
      throw new Error("plan-before-populate gate failed: " + gate.errors.join("; "));
    }
    var scaffolded = c.applyPopulationScaffoldToActivity(
      { activity_id: (llmActivity && llmActivity.activity_id) || "activity" },
      episodePlan
    );
    var out = Object.assign({}, llmActivity || {});
    var llmMats = Array.isArray(out.required_materials) ? out.required_materials : [];
    var used = {};

    out.required_materials = scaffolded.required_materials.map(function (scaffoldMat) {
      var fn = scaffoldMat.instructional_function;
      var match = null;
      for (var i = 0; i < llmMats.length; i++) {
        if (used[i]) continue;
        var m = llmMats[i];
        if (is38LDepthRow(m)) continue;
        var mFn = normalizeFn(m.instructional_function || m.purpose);
        if (mFn === fn || purposeMatchesFunction(m.purpose, fn)) {
          match = m;
          used[i] = true;
          break;
        }
      }
      if (!match) {
        for (var j = 0; j < llmMats.length; j++) {
          if (!used[j] && typeof llmMats[j].plan_beat_index === "number") {
            if (is38LDepthRow(llmMats[j])) continue;
            if (llmMats[j].plan_beat_index === scaffoldMat.plan_beat_index) {
              match = llmMats[j];
              used[j] = true;
              break;
            }
          }
        }
      }
      var merged = Object.assign({}, scaffoldMat);
      if (match) {
        if (match.type) merged.type = match.type;
        if (match.specification) merged.specification = match.specification;
        if (match.content) merged.content = match.content;
        if (match.title) merged.title = match.title;
        if (match.purpose) merged.purpose = match.purpose;
      }
      merged.instructional_function = fn;
      merged.plan_beat_index = scaffoldMat.plan_beat_index;
      return merged;
    });

    var supplementary = [];
    for (var u = 0; u < llmMats.length; u++) {
      if (used[u]) continue;
      var extra = Object.assign({}, llmMats[u]);
      extra.supplementary = true;
      supplementary.push(extra);
    }
    if (supplementary.length) {
      supplementary.forEach(function (extra) {
        var idx = placementIndexForSupplementary(out.required_materials, extra);
        out.required_materials.splice(idx, 0, extra);
      });
    }

    out.episode_plan_ref = scaffolded.episode_plan_ref;
    out._population_trace = scaffolded._population_trace;
    out._learner_task_segments = scaffolded._learner_task_segments;
    out.materials_order = out.required_materials.map(function (m) {
      return m.material_id || ("OBL-M-" + (typeof m.plan_beat_index === "number" ? m.plan_beat_index : "S"));
    });
    out._population_contract_version = INTEGRATION_VERSION;

    var cognitionFields = [
      "activity_preamble",
      "reasoning_orientation",
      "prior_knowledge_activation",
      "self_explanation_prompt"
    ];
    cognitionFields.forEach(function (field) {
      if (llmActivity && llmActivity[field]) out[field] = llmActivity[field];
      else if (scaffolded[field]) out[field] = scaffolded[field];
      if (scaffolded["_plan_" + field]) {
        out["_plan_" + field] = scaffolded["_plan_" + field];
      }
    });

    if (scaffolded.learner_task) {
      out.learner_task = llmActivity && llmActivity.learner_task
        ? llmActivity.learner_task
        : scaffolded.learner_task;
    }

    return out;
  }

  /**
   * Apply population contract to full learning_activities artefact.
   */
  function applyPopulationContractToLearningActivities(learningActivities, episodePlansContainer, options) {
    var opts = options || {};
    var containerGate = assertEpisodePlansContainerGate(episodePlansContainer);
    if (!containerGate.ok && !opts.allowDerive) {
      return {
        ok: false,
        errors: containerGate.errors,
        learning_activities: learningActivities
      };
    }
    var acts = activityList(learningActivities);
    var plans = episodePlansContainer.episode_plans;
    if (acts.length && plans.length < acts.length && !opts.allowPartial) {
      return {
        ok: false,
        errors: ["episode_plans count " + plans.length + " < activities " + acts.length],
        learning_activities: learningActivities
      };
    }
    var mergedActs = acts.map(function (act, index) {
      var plan = findPlanForActivity(episodePlansContainer, act, index);
      if (!plan) return act;
      return mergePopulationScaffoldWithLlmActivity(act, plan);
    });
    var out = Object.assign({}, learningActivities || {});
    if (Array.isArray(learningActivities.activities)) out.activities = mergedActs;
    else out.activities = mergedActs;
    out._episode_plans_ref = {
      count: plans.length,
      integration_version: INTEGRATION_VERSION
    };
    return { ok: true, errors: [], learning_activities: out };
  }

  function validateLearningActivitiesPopulationContract(learningActivities, episodePlansContainer) {
    var c = requireContract();
    var acts = activityList(learningActivities);
    var plans = (episodePlansContainer && episodePlansContainer.episode_plans) || [];
    var errors = [];
    var metrics = [];
    acts.forEach(function (act, index) {
      var plan = findPlanForActivity(episodePlansContainer, act, index);
      if (!plan) {
        errors.push((act.activity_id || "activity_" + (index + 1)) + ": missing episode_plan");
        return;
      }
      var result = c.validatePopulationContract(plan, act);
      if (!result.ok) {
        errors.push(
          (act.activity_id || "activity_" + (index + 1)) + ": " + result.errors.join("; ")
        );
      }
      metrics.push({
        activity_id: act.activity_id || "activity_" + (index + 1),
        metrics: result.metrics
      });
    });
    if (acts.length && !plans.length) {
      errors.push("PF-11: no episode_plans for validation");
    }
    return { ok: errors.length === 0, errors: errors, metrics: metrics };
  }

  function buildDlaPopulationOnlyPromptBlock() {
    return [
      "",
      "### Episode Plan population contract (38S-3 — auto-applied)",
      "",
      "DLA is **population-only**. Episode Plan V1 (upstream) is the planning authority.",
      "",
      "**Forbidden in DLA:** archetype selection, beat sequencing, fade choreography, transition planning, or inventing instructional functions not in the plan.",
      "",
      "**Required in DLA:** populate obligation specifications and activity metadata from the upstream Episode Plan beats; preserve `instructional_function` and beat order; assemble `learner_task` from beat obligations.",
      "",
      "**Gate:** If upstream `episode_plans` is missing or beats are empty, do not emit `required_materials[]` — return an error object instead.",
      "",
      "Post-population enforcement will tag every `required_materials[]` row with `instructional_function` and `plan_beat_index` from the plan."
    ].join("\n");
  }

  function verifyObligationTagging(activity) {
    var mats = activity && Array.isArray(activity.required_materials) ? activity.required_materials : [];
    var missingFn = mats.filter(function (m) {
      return !String(m.instructional_function || "").trim();
    });
    var missingIdx = mats.filter(function (m) {
      return typeof m.plan_beat_index !== "number";
    });
    return {
      instructional_function_present: missingFn.length === 0,
      plan_beat_index_present: missingIdx.length === 0,
      material_count: mats.length,
      missing_instructional_function: missingFn.length,
      missing_plan_beat_index: missingIdx.length,
      episode_plan_ref: !!(activity && activity.episode_plan_ref)
    };
  }

  return {
    INTEGRATION_VERSION: INTEGRATION_VERSION,
    assertPlanBeforePopulateGate: assertPlanBeforePopulateGate,
    assertEpisodePlansContainerGate: assertEpisodePlansContainerGate,
    deriveEpisodePlansFromLearningOutcomes: deriveEpisodePlansFromLearningOutcomes,
    mergePopulationScaffoldWithLlmActivity: mergePopulationScaffoldWithLlmActivity,
    applyPopulationContractToLearningActivities: applyPopulationContractToLearningActivities,
    validateLearningActivitiesPopulationContract: validateLearningActivitiesPopulationContract,
    buildDlaPopulationOnlyPromptBlock: buildDlaPopulationOnlyPromptBlock,
    verifyObligationTagging: verifyObligationTagging,
    findPlanForActivity: findPlanForActivity,
    activityList: activityList
  };
});
