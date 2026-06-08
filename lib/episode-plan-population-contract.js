/**
 * Sprint 38-S — Episode Plan population contract (38S-2).
 * Converts frozen Episode Plan V1 beats → traceable DLA obligations.
 * Structural scaffold + validation; material types chosen downstream (GAM).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PRISM_EPISODE_PLAN_POPULATION = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var CONTRACT_VERSION = "38S-2";

  var COGNITION_FIELD_MAP = {
    orientation: "activity_preamble",
    framing: "reasoning_orientation",
    activation: "prior_knowledge_activation",
    reflection: "self_explanation_prompt",
    transition: null
  };

  var FUNCTION_SPECS = {
    orientation: {
      classes: ["cognition"],
      pedagogical_spec: "Session-arc purpose; why this episode now.",
      anti_substitution: ["generic_boilerplate_only"]
    },
    framing: {
      classes: ["cognition", "task_segment"],
      pedagogical_spec: "Bounded problem statement for this episode.",
      anti_substitution: []
    },
    activation: {
      classes: ["cognition"],
      pedagogical_spec: "Prior-knowledge recall prompt tied to mapped LO concepts.",
      anti_substitution: []
    },
    explanation: {
      classes: ["material"],
      pedagogical_spec: "Teach core concept or procedure rules from KM — not synopsis-only.",
      anti_substitution: ["synopsis_only"]
    },
    example: {
      classes: ["material"],
      pedagogical_spec: "Positive instance illustrating the concept.",
      anti_substitution: []
    },
    non_example: {
      classes: ["material"],
      pedagogical_spec: "Contrasting case; boundary discrimination.",
      anti_substitution: ["merged_into_example"]
    },
    misconception_confrontation: {
      classes: ["material"],
      pedagogical_spec: "Named confusion + reconciliation move from KM misconceptions.",
      anti_substitution: ["single_support_note_line"]
    },
    criteria_exposition: {
      classes: ["material"],
      pedagogical_spec: "Decision or analytic dimensions delivered for learner use.",
      anti_substitution: []
    },
    criteria_construction: {
      classes: ["material", "task_segment"],
      pedagogical_spec: "Learner weights or prioritises criteria for the case.",
      anti_substitution: ["read_only_rubric_prose", "exposition_only"]
    },
    perspective_construction: {
      classes: ["material", "task_segment"],
      pedagogical_spec: "Learner constructs viewpoints; pause-and-write required.",
      anti_substitution: ["scenario_menu_only"]
    },
    worked_thinking: {
      classes: ["material"],
      pedagogical_spec: "Stepwise model of intellectual or procedural move.",
      anti_substitution: ["merged_with_guided_or_independent"]
    },
    worked_judgement: {
      classes: ["material"],
      pedagogical_spec: "Exemplar quality contrast — weak vs strong reasoning.",
      anti_substitution: ["slogan_contrast_only"]
    },
    guided_inquiry: {
      classes: ["material"],
      pedagogical_spec: "Productive uncertainty or trade-off tension prompts.",
      anti_substitution: []
    },
    guided_reasoning: {
      classes: ["material"],
      pedagogical_spec: "Partial completion with hint scaffolding; learner supplies justifications.",
      anti_substitution: ["pre_filled_decision_table"]
    },
    guided_practice: {
      classes: ["material"],
      pedagogical_spec: "Partial attempt with fading support — distinct from independent.",
      anti_substitution: ["merged_with_independent", "merged_with_worked"]
    },
    independent_performance: {
      classes: ["material", "task_segment"],
      pedagogical_spec: "Full learner attempt without model-answer copy path.",
      anti_substitution: ["sample_output_as_copy_source"]
    },
    evaluative_judgement: {
      classes: ["material", "task_segment"],
      pedagogical_spec: "Defended recommendation or comparative judgement.",
      anti_substitution: ["template_only_memo"]
    },
    verification: {
      classes: ["material"],
      pedagogical_spec: "Quality audit with rubric dimensions and conditional repair path.",
      anti_substitution: ["checklist_only_tick"]
    },
    revision: {
      classes: ["material", "task_segment"],
      pedagogical_spec: "Rework after audit failure.",
      anti_substitution: []
    },
    reflection: {
      classes: ["cognition", "task_segment"],
      pedagogical_spec: "Learner-generated metacognitive response.",
      anti_substitution: ["consolidation_summary", "designer_prose_only"]
    },
    transfer: {
      classes: ["material", "task_segment"],
      pedagogical_spec: "Personal-context reapplication linked to criteria.",
      anti_substitution: ["single_optional_sentence"]
    },
    prediction: {
      classes: ["material", "task_segment"],
      pedagogical_spec: "Anticipation before evidence confrontation.",
      anti_substitution: []
    },
    observation: {
      classes: ["material"],
      pedagogical_spec: "Evidence confrontation; inspect-before-teach.",
      anti_substitution: []
    },
    transition: {
      classes: ["task_segment"],
      pedagogical_spec: "Bridge to next episode or session close.",
      anti_substitution: []
    }
  };

  var TRANSITION_CHAINS = {
    T1: ["worked_thinking", "guided_practice", "independent_performance"],
    T2: ["perspective_construction", "criteria_construction", "evaluative_judgement"],
    T3: ["prediction", "observation", "revision"],
    T4: ["evaluative_judgement", "transfer", "reflection"],
    T5: ["independent_performance", "verification", "reflection"]
  };

  function normalizeFunction(fn) {
    return String(fn || "").trim().toLowerCase();
  }

  function planBeats(episodePlan) {
    if (!episodePlan || !Array.isArray(episodePlan.beats)) return [];
    return episodePlan.beats.map(function (b, i) {
      return {
        index: i,
        function: normalizeFunction(b && b.function)
      };
    });
  }

  var FROZEN_V1_ARCHETYPES = {
    understand: true,
    apply: true,
    analyse: true,
    evaluate: true
  };

  function assertPlanBeforePopulateGate(episodePlan) {
    var errors = [];
    if (!episodePlan || typeof episodePlan !== "object") {
      return { ok: false, errors: ["PF-11: missing episode_plan object"] };
    }
    var archetype = normalizeFunction(episodePlan.archetype);
    if (!archetype) {
      errors.push("PF-11: missing episode_plan.archetype");
    } else if (!FROZEN_V1_ARCHETYPES[archetype]) {
      errors.push("PF-11: archetype not frozen V1 enum: " + String(episodePlan.archetype));
    }
    var beats = planBeats(episodePlan);
    if (!beats.length) {
      errors.push("PF-11: episode_plan.beats empty");
    }
    beats.forEach(function (b) {
      if (!b.function) errors.push("beat " + b.index + ": missing function");
      else if (!FUNCTION_SPECS[b.function]) {
        errors.push("beat " + b.index + ": unknown function " + b.function);
      }
    });
    return { ok: errors.length === 0, errors: errors };
  }

  function materialIdFor(beatIndex, seq) {
    return "M_plan_" + (beatIndex + 1) + (seq > 0 ? "_" + (seq + 1) : "");
  }

  /**
   * Build structural obligation scaffold from plan (no material types).
   * @returns {{ obligations: object[], cognition: object[], task_segments: object[], trace: object[] }}
   */
  function buildObligationScaffoldFromPlan(episodePlan, options) {
    var gate = assertPlanBeforePopulateGate(episodePlan);
    if (!gate.ok) {
      throw new Error("plan-before-populate gate failed: " + gate.errors.join("; "));
    }
    var opts = options || {};
    var activityId = String(opts.activity_id || "activity");
    var beats = planBeats(episodePlan);
    var obligations = [];
    var cognition = [];
    var taskSegments = [];
    var trace = [];

    beats.forEach(function (beat) {
      var spec = FUNCTION_SPECS[beat.function];
      if (!spec) return;
      var surfaces = [];

      spec.classes.forEach(function (cls) {
        if (cls === "material") {
          var row = {
            material_id: materialIdFor(beat.index, obligations.length),
            instructional_function: beat.function,
            plan_beat_index: beat.index,
            obligation_class: "material",
            specification: spec.pedagogical_spec,
            anti_substitution: spec.anti_substitution.slice(),
            purpose: beat.function.replace(/_/g, " "),
            population_contract_version: CONTRACT_VERSION
          };
          obligations.push(row);
          surfaces.push("required_materials[]");
        } else if (cls === "cognition") {
          var field = COGNITION_FIELD_MAP[beat.function];
          if (field) {
            cognition.push({
              instructional_function: beat.function,
              plan_beat_index: beat.index,
              obligation_class: "cognition",
              field: field,
              specification: spec.pedagogical_spec,
              anti_substitution: spec.anti_substitution.slice()
            });
            surfaces.push(field);
          }
        } else if (cls === "task_segment") {
          taskSegments.push({
            instructional_function: beat.function,
            plan_beat_index: beat.index,
            obligation_class: "task_segment",
            segment_order: beat.index,
            specification: spec.pedagogical_spec,
            anti_substitution: spec.anti_substitution.slice()
          });
          surfaces.push("learner_task_segment");
        }
      });

      trace.push({
        beat_index: beat.index,
        instructional_function: beat.function,
        surfaces: surfaces,
        obligation_count: surfaces.length
      });
    });

    return {
      activity_id: activityId,
      archetype: episodePlan.archetype,
      obligations: obligations,
      cognition: cognition,
      task_segments: taskSegments,
      trace: trace,
      beat_count: beats.length,
      obl_m_count: obligations.length
    };
  }

  function assembleLearnerTaskFromSegments(taskSegments) {
    if (!taskSegments.length) return "";
    var sorted = taskSegments.slice().sort(function (a, b) {
      return a.plan_beat_index - b.plan_beat_index;
    });
    return sorted
      .map(function (s) {
        return "- [" + s.instructional_function + "] " + s.specification;
      })
      .join("\n");
  }

  /**
   * Apply population scaffold to activity row (structural merge).
   */
  function applyPopulationScaffoldToActivity(activity, episodePlan, options) {
    var scaffold = buildObligationScaffoldFromPlan(episodePlan, {
      activity_id: (activity && activity.activity_id) || (options && options.activity_id)
    });
    var out = Object.assign({}, activity || {});
    out.episode_plan_ref = {
      archetype: episodePlan.archetype,
      beat_count: scaffold.beat_count,
      population_contract_version: CONTRACT_VERSION
    };
    out.required_materials = scaffold.obligations.map(function (o) {
      return Object.assign({}, o);
    });
    scaffold.cognition.forEach(function (c) {
      if (c.field) {
        out[c.field] = out[c.field] || "[population:" + c.instructional_function + "] " + c.specification;
        out["_plan_" + c.field] = {
          instructional_function: c.instructional_function,
          plan_beat_index: c.plan_beat_index
        };
      }
    });
    out._learner_task_segments = scaffold.task_segments;
    out.learner_task = assembleLearnerTaskFromSegments(scaffold.task_segments);
    out._population_trace = scaffold.trace;
    out.materials_order = scaffold.obligations.map(function (o) {
      return o.material_id;
    });
    return out;
  }

  function taggedMaterials(activity) {
    var mats = activity && Array.isArray(activity.required_materials) ? activity.required_materials : [];
    return mats
      .filter(function (m) {
        return !m || m.supplementary !== true;
      })
      .map(function (m, i) {
      return {
        index: i,
        instructional_function: normalizeFunction(
          m.instructional_function || m.purpose || ""
        ),
        plan_beat_index:
          typeof m.plan_beat_index === "number" ? m.plan_beat_index : null,
        type: String((m && m.type) || "").toLowerCase(),
        specification: String((m && m.specification) || ""),
        material_id: m.material_id
      };
    });
  }

  function cognitionObligations(activity) {
    var out = [];
    var fields = [
      ["activity_preamble", "orientation"],
      ["reasoning_orientation", "framing"],
      ["prior_knowledge_activation", "activation"],
      ["self_explanation_prompt", "reflection"]
    ];
    fields.forEach(function (pair) {
      var field = pair[0];
      var defaultFn = pair[1];
      var meta = activity && activity["_plan_" + field];
      if (activity && activity[field]) {
        out.push({
          instructional_function: normalizeFunction(
            (meta && meta.instructional_function) || defaultFn
          ),
          plan_beat_index: meta && typeof meta.plan_beat_index === "number" ? meta.plan_beat_index : null,
          surface: field,
          obligation_class: "cognition"
        });
      }
    });
    return out;
  }

  function allObligations(activity) {
    var list = [];
    taggedMaterials(activity).forEach(function (m) {
      list.push({
        instructional_function: m.instructional_function,
        plan_beat_index: m.plan_beat_index,
        obligation_class: "material",
        surface: "required_materials[]"
      });
    });
    cognitionObligations(activity).forEach(function (c) {
      list.push(c);
    });
    var segments = (activity && activity._learner_task_segments) || [];
    segments.forEach(function (s) {
      list.push({
        instructional_function: normalizeFunction(s.instructional_function),
        plan_beat_index: s.plan_beat_index,
        obligation_class: "task_segment",
        surface: "learner_task_segment"
      });
    });
    return list;
  }

  function buildBeatTraceMatrix(episodePlan, activity) {
    var beats = planBeats(episodePlan);
    var obligations = allObligations(activity);
    return beats.map(function (beat) {
      var matched = obligations.filter(function (o) {
        if (typeof o.plan_beat_index === "number") {
          return o.plan_beat_index === beat.index;
        }
        return o.instructional_function === beat.function;
      });
      return {
        beat_index: beat.index,
        function: beat.function,
        traceable: matched.length > 0,
        obligations: matched
      };
    });
  }

  function subsequenceIndices(beats, chain) {
    var indices = [];
    var cursor = 0;
    for (var i = 0; i < beats.length && cursor < chain.length; i++) {
      if (beats[i].function === chain[cursor]) {
        indices.push(beats[i].index);
        cursor++;
      }
    }
    if (cursor < chain.length) return null;
    return indices;
  }

  function distinctObligationFunctions(activity, functions) {
    var obligations = allObligations(activity);
    var found = [];
    functions.forEach(function (fn) {
      var hits = obligations.filter(function (o) {
        return o.instructional_function === fn;
      });
      if (hits.length) found.push({ function: fn, count: hits.length });
    });
    return found;
  }

  function planHasFunctions(beats, functions) {
    return functions.every(function (fn) {
      return beats.some(function (b) {
        return b.function === fn;
      });
    });
  }

  function beatIndexFor(beats, fn) {
    var hit = beats.find(function (b) {
      return b.function === fn;
    });
    return hit ? hit.index : -1;
  }

  function validateTransitionChainProtection(episodePlan, activity) {
    var beats = planBeats(episodePlan);
    var results = [];
    Object.keys(TRANSITION_CHAINS).forEach(function (chainId) {
      var chain = TRANSITION_CHAINS[chainId];
      if (!planHasFunctions(beats, chain)) {
        results.push({
          chain: chainId,
          applicable: false,
          pass: true,
          mechanism: "n/a — subchain not in plan"
        });
        return;
      }
      var distinct = distinctObligationFunctions(activity, chain);
      var pass =
        distinct.length === chain.length &&
        distinct.every(function (d) {
          return d.count >= 1;
        });
      var mechanism =
        "≥1 obligation (OBL-M/C/T) per chain function; no merge";

      if (chainId === "T4") {
        var j = beatIndexFor(beats, "evaluative_judgement");
        var t = beatIndexFor(beats, "transfer");
        var r = beatIndexFor(beats, "reflection");
        pass =
          pass &&
          j >= 0 &&
          t > j &&
          r > j;
        mechanism +=
          "; T4: judgement precedes transfer and reflection (38I order may interleave verification)";
      } else {
        var indices = subsequenceIndices(beats, chain);
        if (indices) mechanism += "; plan indices " + indices.join("→");
      }

      results.push({
        chain: chainId,
        applicable: true,
        pass: pass,
        mechanism: mechanism,
        distinct_count: distinct.length,
        required_count: chain.length,
        merged: distinct.length < chain.length
      });
    });
    return results;
  }

  function detectAcViolations(episodePlan, activity) {
    var violations = [];
    var beats = planBeats(episodePlan);
    var mats = taggedMaterials(activity);

    function hasBeat(fn) {
      return beats.some(function (b) {
        return b.function === fn;
      });
    }

    function matCount(fn) {
      return mats.filter(function (m) {
        return m.instructional_function === fn;
      }).length;
    }

    if (hasBeat("worked_thinking") && hasBeat("guided_practice") && hasBeat("independent_performance")) {
      var t1Count =
        (matCount("worked_thinking") > 0 ? 1 : 0) +
        (matCount("guided_practice") > 0 ? 1 : 0) +
        (matCount("independent_performance") > 0 ? 1 : 0);
      if (t1Count < 3) {
        violations.push({
          rule: "AC-01",
          message: "T1 triple collapsed — fewer than 3 distinct fade obligations"
        });
      }
    }

    mats.forEach(function (m) {
      if (m.instructional_function === "verification" && m.type === "checklist") {
        if (!/rubric|repair|dimension/i.test(m.specification)) {
          violations.push({
            rule: "AC-02",
            message: "verification checklist without rubric/repair spec (material " + m.material_id + ")"
          });
        }
      }
      if (m.instructional_function === "independent_performance" && m.type === "sample_output") {
        violations.push({
          rule: "AC-07",
          message: "independent_performance realised as sample_output (" + m.material_id + ")"
        });
      }
      if (m.instructional_function === "perspective_construction" && m.type === "scenario") {
        if (!/pause|write|construct|viewpoint/i.test(m.specification)) {
          violations.push({
            rule: "AC-04",
            message: "perspective_construction scenario menu without pause-and-write spec"
          });
        }
      }
      if (m.instructional_function === "criteria_construction") {
        if (!/weight|priorit|learner/i.test(m.specification)) {
          violations.push({
            rule: "AC-05",
            message: "criteria_construction without learner weighting action in spec"
          });
        }
      }
      if (m.instructional_function === "evaluative_judgement" && m.type === "template") {
        if (!/defend|compar|recommend/i.test(m.specification)) {
          violations.push({
            rule: "AC-06",
            message: "evaluative_judgement template without defended comparison spec"
          });
        }
      }
      if (m.instructional_function === "guided_reasoning" && m.type === "classification_table") {
        if (/pre-fill|prefill|completed/i.test(m.specification)) {
          violations.push({
            rule: "AC-10",
            message: "guided_reasoning pre-filled decision table"
          });
        }
      }
    });

    if (hasBeat("reflection")) {
      var reflMats = mats.filter(function (m) {
        return m.type === "consolidation_summary" || m.instructional_function === "consolidation_summary";
      });
      if (reflMats.length) {
        violations.push({
          rule: "AC-03",
          message: "reflection beat substituted by consolidation_summary material"
        });
      }
      if (!activity.self_explanation_prompt && !((activity._learner_task_segments || []).some(function (s) {
        return normalizeFunction(s.instructional_function) === "reflection";
      }))) {
        violations.push({
          rule: "AC-03",
          message: "reflection beat missing self_explanation_prompt or task segment"
        });
      }
    }

    var teachingBeats = beats.filter(function (b) {
      var spec = FUNCTION_SPECS[b.function];
      return spec && spec.classes.indexOf("material") !== -1;
    });
    teachingBeats.forEach(function (beat) {
      if (matCount(beat.function) === 0) {
        var cogOnly = cognitionObligations(activity).some(function (c) {
          return c.instructional_function === beat.function;
        });
        if (!cogOnly) {
          violations.push({
            rule: "AC-09",
            message: "teaching beat " + beat.function + " missing OBL-M (cognition-only substitution)"
          });
        }
      }
    });

    if (beats.length && mats.length > 0) {
      var orphanMats = mats.filter(function (m) {
        return typeof m.plan_beat_index !== "number";
      });
      if (orphanMats.length === mats.length && !activity.episode_plan_ref) {
        violations.push({
          rule: "AC-08",
          message: "parallel bundle — no plan_beat_index on materials"
        });
      }
    }

    return violations;
  }

  function metricBeatSurvival(episodePlan, activity) {
    var matrix = buildBeatTraceMatrix(episodePlan, activity);
    var total = matrix.length;
    var survived = matrix.filter(function (r) {
      return r.traceable;
    }).length;
    return {
      metric: "M-02",
      total_beats: total,
      survived_beats: survived,
      percent: total ? Math.round((survived / total) * 10000) / 100 : 0,
      pass: total ? survived / total >= 0.95 : false,
      matrix: matrix
    };
  }

  function metricOrderedObligationSurvival(episodePlan, activity) {
    var mats = taggedMaterials(activity).filter(function (m) {
      return typeof m.plan_beat_index === "number";
    });
    var total = mats.length;
    var ordered = 0;
    for (var i = 1; i < mats.length; i++) {
      if (mats[i].plan_beat_index >= mats[i - 1].plan_beat_index) ordered++;
    }
    var allOrdered = total <= 1 || ordered === total - 1;
    var indicesMatchPlan = mats.every(function (m, i) {
      return m.plan_beat_index === mats[i].plan_beat_index;
    });
    return {
      metric: "M-03",
      obl_m_count: total,
      order_violations: total > 1 ? total - 1 - ordered : 0,
      percent: total <= 1 ? 100 : Math.round((ordered / (total - 1)) * 10000) / 100,
      pass: allOrdered,
      materials: mats
    };
  }

  function metricAcViolations(episodePlan, activity) {
    var violations = detectAcViolations(episodePlan, activity);
    return {
      metric: "M-05",
      count: violations.length,
      pass: violations.length === 0,
      violations: violations
    };
  }

  function validatePopulationContract(episodePlan, activity) {
    var gate = assertPlanBeforePopulateGate(episodePlan);
    if (!gate.ok) {
      return { ok: false, errors: gate.errors, metrics: {} };
    }
    var m02 = metricBeatSurvival(episodePlan, activity);
    var m03 = metricOrderedObligationSurvival(episodePlan, activity);
    var m05 = metricAcViolations(episodePlan, activity);
    var chains = validateTransitionChainProtection(episodePlan, activity);
    var errors = [];
    if (!m02.pass) errors.push("M-02 beat survival below 95%");
    if (!m03.pass) errors.push("M-03 obligation order drift");
    if (!m05.pass) {
      m05.violations.forEach(function (v) {
        errors.push(v.rule + ": " + v.message);
      });
    }
    chains.forEach(function (c) {
      if (c.applicable && !c.pass) errors.push(c.chain + " transition chain collapsed");
    });
    return {
      ok: errors.length === 0,
      errors: errors,
      metrics: { M02: m02, M03: m03, M05: m05 },
      transition_chains: chains,
      trace: buildBeatTraceMatrix(episodePlan, activity)
    };
  }

  return {
    CONTRACT_VERSION: CONTRACT_VERSION,
    FROZEN_V1_ARCHETYPES: FROZEN_V1_ARCHETYPES,
    FUNCTION_SPECS: FUNCTION_SPECS,
    TRANSITION_CHAINS: TRANSITION_CHAINS,
    COGNITION_FIELD_MAP: COGNITION_FIELD_MAP,
    assertPlanBeforePopulateGate: assertPlanBeforePopulateGate,
    buildObligationScaffoldFromPlan: buildObligationScaffoldFromPlan,
    applyPopulationScaffoldToActivity: applyPopulationScaffoldToActivity,
    assembleLearnerTaskFromSegments: assembleLearnerTaskFromSegments,
    buildBeatTraceMatrix: buildBeatTraceMatrix,
    validateTransitionChainProtection: validateTransitionChainProtection,
    detectAcViolations: detectAcViolations,
    metricBeatSurvival: metricBeatSurvival,
    metricOrderedObligationSurvival: metricOrderedObligationSurvival,
    metricAcViolations: metricAcViolations,
    validatePopulationContract: validatePopulationContract,
    planBeats: planBeats
  };
});
