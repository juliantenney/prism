/**
 * Sprint 38-S — Proof metrics (38R-4 M-01–M-08).
 */
(function (root, factory) {
  var contract = null;
  if (typeof module === "object" && module.exports) {
    contract = require("./episode-plan-population-contract.js");
    module.exports = factory(contract);
  } else {
    contract = root.PRISM_EPISODE_PLAN_POPULATION;
    root.PRISM_EPISODE_PLAN_PROOF_METRICS = factory(contract);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (contractMod) {
  var TRANSITION_TESTS = {
    T1: { chain: "T1", activities: ["A2", "A3"], required: ["worked_thinking", "guided_practice", "independent_performance"] },
    T2: { chain: "T2", activities: ["A4"], required: ["perspective_construction", "criteria_construction", "evaluative_judgement"] },
    T4: { chain: "T4", activities: ["A4"], required: ["evaluative_judgement", "transfer", "reflection"] },
    T5: { chain: "T5", activities: ["A1", "A2", "A3"], required: ["independent_performance", "verification", "reflection"] }
  };

  var EV38M_MATERIAL_COUNTS = { A1: 4, A2: 4, A3: 4, A4: 8 };

  var PLAN_OBL_M_TARGETS = { A1: 7, A2: 7, A3: 8, A4: 10 };

  function activityList(la) {
    if (!la || typeof la !== "object") return [];
    if (Array.isArray(la.activities)) return la.activities;
    if (Array.isArray(la.learning_activities)) return la.learning_activities;
    return [];
  }

  function findActivity(la, id) {
    return activityList(la).find(function (a) {
      return String(a.activity_id || "") === id;
    });
  }

  function findPlan(plans, id, index) {
    var rows = (plans && plans.episode_plans) || [];
    var hit = rows.find(function (p) {
      return String(p.activity_id || "") === id;
    });
    if (hit && hit.episode_plan) return hit.episode_plan;
    if (rows[index] && rows[index].episode_plan) return rows[index].episode_plan;
    return null;
  }

  function transitionFamilyPass(contract, plan, activity) {
    var chains = contract.validateTransitionChainProtection(plan, activity);
    return chains;
  }

  function scoreTransitionFamily(chains, chainId) {
    var hit = chains.find(function (c) {
      return c.chain === chainId;
    });
    if (!hit) return { status: "Fail", applicable: false, pass: false };
    if (!hit.applicable) return { status: "n/a", applicable: false, pass: true };
    return {
      status: hit.pass ? "Pass" : "Fail",
      applicable: true,
      pass: hit.pass,
      mechanism: hit.mechanism,
      merged: hit.merged
    };
  }

  function metricEpisodeContinuity(plan, activity) {
    var beats = contractMod.planBeats(plan);
    if (beats.length < 2) return { metric: "M-04", percent: 100, pass: true, pairs: 0, ordered: 0 };
    var matrix = contractMod.buildBeatTraceMatrix(plan, activity);
    var ordered = 0;
    for (var i = 1; i < matrix.length; i++) {
      var prev = matrix[i - 1];
      var curr = matrix[i];
      if (prev.traceable && curr.traceable) {
        var prevIdx = -1;
        var currIdx = -1;
        prev.obligations.forEach(function (o) {
          if (typeof o.plan_beat_index === "number") prevIdx = Math.max(prevIdx, o.plan_beat_index);
        });
        curr.obligations.forEach(function (o) {
          if (typeof o.plan_beat_index === "number") currIdx = Math.max(currIdx, o.plan_beat_index);
        });
        if (prevIdx >= 0 && currIdx >= 0 && currIdx >= prevIdx) ordered++;
      }
    }
    var pairs = beats.length - 1;
    var percent = pairs ? Math.round((ordered / pairs) * 10000) / 100 : 100;
    return {
      metric: "M-04",
      percent: percent,
      pass: percent === 100,
      pairs: pairs,
      ordered: ordered
    };
  }

  function orphanMaterialCount(activity, plan) {
    var beats = contractMod.planBeats(plan);
    var beatFns = beats.map(function (b) {
      return b.function;
    });
    var mats = (activity.required_materials || []).filter(function (m) {
      return m && m.supplementary !== true;
    });
    var orphans = mats.filter(function (m) {
      var fn = String(m.instructional_function || "").trim().toLowerCase();
      if (!fn) return true;
      if (typeof m.plan_beat_index !== "number") return true;
      return beatFns.indexOf(fn) === -1 && m.plan_beat_index >= beats.length;
    });
    return orphans.length;
  }

  function gapClosure(activity, plan, activityId) {
    var gaps = {
      GAP_01: false,
      GAP_02: false,
      GAP_06: false,
      GAP_13: false
    };
    var chains = contractMod.validateTransitionChainProtection(plan, activity);
    var t1 = chains.find(function (c) {
      return c.chain === "T1";
    });
    if (t1 && t1.applicable) gaps.GAP_01 = t1.pass;
    if (activityId === "A4") {
      var t2 = chains.find(function (c) {
        return c.chain === "T2";
      });
      gaps.GAP_02 = t2 && t2.applicable ? t2.pass : false;
    }
    gaps.GAP_06 = t1 && t1.applicable ? t1.pass : activityId !== "A2" && activityId !== "A3";
    var m03 = contractMod.metricOrderedObligationSurvival(plan, activity);
    gaps.GAP_13 = m03.pass && !!(activity.episode_plan_ref || activity._population_trace);
    return gaps;
  }

  function evaluateActivity(activityId, activity, plan, options) {
    var opts = options || {};
    var m02 = contractMod.metricBeatSurvival(plan, activity);
    var m03 = contractMod.metricOrderedObligationSurvival(plan, activity);
    var m04 = metricEpisodeContinuity(plan, activity);
    var m05 = contractMod.metricAcViolations(plan, activity);
    var chains = contractMod.validateTransitionChainProtection(plan, activity);
    var oblM = (activity.required_materials || []).length;
    var baseline = EV38M_MATERIAL_COUNTS[activityId] || 1;
    var m06 = {
      metric: "M-06",
      ratio: Math.round((oblM / baseline) * 100) / 100,
      pass: activityId === "A1" ? oblM >= baseline : oblM / baseline >= 1.5,
      obl_m: oblM,
      baseline: baseline
    };
    var m07 = {
      metric: "M-07",
      count: orphanMaterialCount(activity, plan),
      pass: orphanMaterialCount(activity, plan) === 0
    };
    var gaps = gapClosure(activity, plan, activityId);
    var gapClosed = Object.keys(gaps).filter(function (k) {
      return gaps[k];
    }).length;
    return {
      activity_id: activityId,
      M02: m02,
      M03: m03,
      M04: m04,
      M05: m05,
      M06: m06,
      M07: m07,
      M08_gaps: gaps,
      M08_closed: gapClosed,
      transition_chains: chains,
      trace: contractMod.buildBeatTraceMatrix(plan, activity)
    };
  }

  function evaluateProofSuite(learningActivities, episodePlans, options) {
    var opts = options || {};
    var activities = ["A1", "A2", "A3", "A4"];
    var perActivity = {};
    activities.forEach(function (id, index) {
      var act = findActivity(learningActivities, id);
      var plan = findPlan(episodePlans, id, index);
      if (act && plan) perActivity[id] = evaluateActivity(id, act, plan, opts);
    });

    var tResults = {};
    ["T1", "T2", "T4", "T5"].forEach(function (tid) {
      var def = TRANSITION_TESTS[tid];
      var passes = [];
      def.activities.forEach(function (aid) {
        var row = perActivity[aid];
        if (!row) return;
        var sc = scoreTransitionFamily(row.transition_chains, tid);
        if (sc.applicable) passes.push(sc.pass);
      });
      var applicable = passes.length > 0;
      tResults[tid] = {
        status: !applicable ? "n/a" : passes.every(Boolean) ? "Pass" : passes.some(Boolean) ? "Partial" : "Fail",
        applicable: applicable,
        pass: applicable ? passes.every(Boolean) : true
      };
    });

    if (opts.t3Micro) {
      var t3 = contractMod.validateTransitionChainProtection(opts.t3Micro.plan, opts.t3Micro.activity);
      var t3hit = t3.find(function (c) {
        return c.chain === "T3";
      });
      tResults.T3 = {
        status: t3hit && t3hit.pass ? "Pass" : "Fail",
        applicable: true,
        pass: !!(t3hit && t3hit.pass)
      };
    }

    var tested = Object.keys(tResults).filter(function (k) {
      return tResults[k].applicable;
    });
    var passed = tested.filter(function (k) {
      return tResults[k].pass;
    });
    var m01 = {
      metric: "M-01",
      percent: tested.length ? Math.round((passed.length / tested.length) * 10000) / 100 : 0,
      pass: tested.length ? passed.length / tested.length >= 0.8 : false,
      tested: tested.length,
      passed: passed.length,
      families: tResults
    };

    var m02All = activities.every(function (id) {
      return !perActivity[id] || perActivity[id].M02.pass;
    });
    var m03All = activities.every(function (id) {
      return !perActivity[id] || perActivity[id].M03.pass;
    });
    var m05Total = activities.reduce(function (sum, id) {
      return sum + (perActivity[id] ? perActivity[id].M05.count : 0);
    }, 0);
    var m07Total = activities.reduce(function (sum, id) {
      return sum + (perActivity[id] ? perActivity[id].M07.count : 0);
    }, 0);

    var acAudit = [];
    activities.forEach(function (id) {
      if (!perActivity[id]) return;
      (perActivity[id].M05.violations || []).forEach(function (v) {
        acAudit.push({ activity_id: id, rule: v.rule, message: v.message });
      });
    });

    return {
      perActivity: perActivity,
      M01: m01,
      M02_all_pass: m02All,
      M03_all_pass: m03All,
      M05_total: m05Total,
      M05_pass: m05Total === 0,
      M07_total: m07Total,
      M07_pass: m07Total === 0,
      acAudit: acAudit,
      transitionFamilies: tResults,
      PLAN_OBL_M_TARGETS: PLAN_OBL_M_TARGETS,
      EV38M_MATERIAL_COUNTS: EV38M_MATERIAL_COUNTS
    };
  }

  return {
    evaluateProofSuite: evaluateProofSuite,
    evaluateActivity: evaluateActivity,
    EV38M_MATERIAL_COUNTS: EV38M_MATERIAL_COUNTS,
    PLAN_OBL_M_TARGETS: PLAN_OBL_M_TARGETS
  };
});
