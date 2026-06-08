/**
 * Sprint 38-S — Frozen Episode Plan V1 templates (38R-2 A1–A4).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PRISM_EPISODE_PLAN_V1_TEMPLATES = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var ARCHETYPE_TEMPLATES = {
    understand: {
      archetype: "understand",
      beats: [
        { function: "orientation" },
        { function: "framing" },
        { function: "activation" },
        { function: "explanation" },
        { function: "example" },
        { function: "non_example" },
        { function: "misconception_confrontation" },
        { function: "guided_practice" },
        { function: "independent_performance" },
        { function: "verification" },
        { function: "reflection" },
        { function: "transition" }
      ]
    },
    apply: {
      archetype: "apply",
      beats: [
        { function: "orientation" },
        { function: "framing" },
        { function: "activation" },
        { function: "criteria_exposition" },
        { function: "worked_thinking" },
        { function: "guided_practice" },
        { function: "independent_performance" },
        { function: "verification" },
        { function: "revision" },
        { function: "reflection" },
        { function: "transfer" },
        { function: "transition" }
      ]
    },
    analyse: {
      archetype: "analyse",
      beats: [
        { function: "orientation" },
        { function: "framing" },
        { function: "activation" },
        { function: "criteria_exposition" },
        { function: "explanation" },
        { function: "worked_thinking" },
        { function: "guided_inquiry" },
        { function: "guided_practice" },
        { function: "independent_performance" },
        { function: "verification" },
        { function: "reflection" },
        { function: "transfer" },
        { function: "transition" }
      ]
    },
    evaluate: {
      archetype: "evaluate",
      beats: [
        { function: "orientation" },
        { function: "framing" },
        { function: "activation" },
        { function: "perspective_construction" },
        { function: "criteria_exposition" },
        { function: "criteria_construction" },
        { function: "worked_judgement" },
        { function: "guided_inquiry" },
        { function: "guided_reasoning" },
        { function: "independent_performance" },
        { function: "evaluative_judgement" },
        { function: "verification" },
        { function: "reflection" },
        { function: "transfer" },
        { function: "transition" }
      ]
    }
  };

  var COGNITIVE_TO_ARCHETYPE = {
    understand: "understand",
    explain: "understand",
    remembering: "understand",
    remember: "understand",
    apply: "apply",
    applying: "apply",
    analyse: "analyse",
    analyze: "analyse",
    analysis: "analyse",
    evaluate: "evaluate",
    evaluating: "evaluate",
    evaluation: "evaluate"
  };

  function clonePlan(template) {
    return {
      archetype: template.archetype,
      beats: template.beats.map(function (b) {
        return { function: b.function };
      })
    };
  }

  function normalizeCognitiveLevel(level) {
    return String(level || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, "");
  }

  function archetypeFromCognitiveLevel(cognitiveLevel) {
    var key = normalizeCognitiveLevel(cognitiveLevel);
    return COGNITIVE_TO_ARCHETYPE[key] || null;
  }

  function templateForArchetype(archetype) {
    var key = String(archetype || "").trim().toLowerCase();
    return ARCHETYPE_TEMPLATES[key] ? clonePlan(ARCHETYPE_TEMPLATES[key]) : null;
  }

  function defaultActivityId(index) {
    return "A" + (index + 1);
  }

  /**
   * Derive episode plan for one activity from LO cognitive level.
   * @param {object} lo - learning outcome row
   * @param {number} activityIndex - zero-based
   */
  function deriveEpisodePlanForActivity(lo, activityIndex) {
    var archetype =
      archetypeFromCognitiveLevel(lo && lo.cognitive_level) ||
      ["understand", "apply", "analyse", "evaluate"][activityIndex] ||
      "understand";
    var template = templateForArchetype(archetype);
    if (!template) return null;
    return template;
  }

  /**
   * Build episode_plans[] container from learning_outcomes.
   * @param {object} learningOutcomes - { learning_outcomes: [...] }
   * @param {object} [options]
   */
  function deriveEpisodePlansFromLearningOutcomes(learningOutcomes, options) {
    var opts = options || {};
    var los = [];
    if (learningOutcomes && Array.isArray(learningOutcomes.learning_outcomes)) {
      los = learningOutcomes.learning_outcomes;
    } else if (Array.isArray(learningOutcomes)) {
      los = learningOutcomes;
    }
    var plans = [];
    los.forEach(function (lo, index) {
      var plan = deriveEpisodePlanForActivity(lo, index);
      if (!plan) return;
      var activityId =
        (opts.activity_ids && opts.activity_ids[index]) ||
        defaultActivityId(index);
      plans.push({
        activity_id: activityId,
        mapped_learning_outcome_ids: lo.id ? [lo.id] : ["LO" + (index + 1)],
        episode_plan: plan
      });
    });
    return {
      episode_plans: plans,
      derivation_version: "38S-3",
      source: "learning_outcomes"
    };
  }

  return {
    ARCHETYPE_TEMPLATES: ARCHETYPE_TEMPLATES,
    COGNITIVE_TO_ARCHETYPE: COGNITIVE_TO_ARCHETYPE,
    archetypeFromCognitiveLevel: archetypeFromCognitiveLevel,
    templateForArchetype: templateForArchetype,
    deriveEpisodePlanForActivity: deriveEpisodePlanForActivity,
    deriveEpisodePlansFromLearningOutcomes: deriveEpisodePlansFromLearningOutcomes,
    clonePlan: clonePlan
  };
});
