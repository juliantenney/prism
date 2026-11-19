/**
 * Sprint 100B-1 — Interactive → workload feasibility adapter.
 *
 * Maps existing Interactive page / activity fields into the Sprint 100A
 * estimator input contract and formats non-blocking author-facing warnings.
 *
 * Does not mutate page artefacts, schemas, or declared durations.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      typeof require === "function" ? require("./workload-feasibility-estimator.js") : null
    );
  } else {
    root.PrismInteractiveWorkloadFeasibilityAdapter = factory(
      root.PrismWorkloadFeasibilityEstimator || null
    );
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (estimatorApi) {
  "use strict";

  var SCHEMA_VERSION = "100B1.1";

  function resolveEstimator() {
    if (estimatorApi && typeof estimatorApi.estimateActivityWorkload === "function") {
      return estimatorApi;
    }
    if (typeof require === "function") {
      try {
        return require("./workload-feasibility-estimator.js");
      } catch (_err) {}
    }
    if (typeof globalThis !== "undefined" && globalThis.PrismWorkloadFeasibilityEstimator) {
      return globalThis.PrismWorkloadFeasibilityEstimator;
    }
    return null;
  }

  function asTrimmed(value) {
    return String(value == null ? "" : value).trim();
  }

  function parseFiniteMinutes(value) {
    if (value == null || value === "") return null;
    var n = Number(value);
    if (!Number.isFinite(n) || n < 0) return null;
    return Math.round(n);
  }

  function collectText(activity) {
    if (!activity || typeof activity !== "object") return "";
    var parts = [
      activity.title,
      activity.learner_task,
      activity.expected_output,
      activity.activity_preamble,
      activity.support_note
    ];
    var materials = Array.isArray(activity.required_materials)
      ? activity.required_materials
      : [];
    materials.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      parts.push(row.type, row.purpose, row.specification);
    });
    return parts
      .map(asTrimmed)
      .filter(Boolean)
      .join("\n");
  }

  function extractExplicitWordBand(text) {
    var api = resolveEstimator();
    if (api && typeof api.parseSuggestedLengthWords === "function") {
      var fromApi = api.parseSuggestedLengthWords(text);
      if (fromApi) return fromApi;
    }
    var range = String(text || "").match(/(\d{1,4})\s*[-–—]\s*(\d{1,4})\s*words?\b/i);
    if (range) return { min: Number(range[1]), max: Number(range[2]) };
    var single = String(text || "").match(/\b(\d{1,4})\s*words?\b/i);
    if (single) {
      var n = Number(single[1]);
      return { min: n, max: n };
    }
    return null;
  }

  function timelineDurationMap(page) {
    var map = Object.create(null);
    var sequence = page && page.learning_sequence;
    if (!sequence || !Array.isArray(sequence.timeline)) return map;
    sequence.timeline.forEach(function (entry) {
      if (!entry || typeof entry !== "object") return;
      var id = asTrimmed(entry.activity_id);
      if (!id || Object.prototype.hasOwnProperty.call(map, id)) return;
      var minutes = parseFiniteMinutes(entry.duration_minutes);
      if (minutes == null) minutes = parseFiniteMinutes(entry.estimated_minutes);
      if (minutes == null) return;
      map[id] = minutes;
    });
    return map;
  }

  function resolveActivityDuration(activity, timelineById) {
    var fromActivity = parseFiniteMinutes(activity && activity.duration_minutes);
    if (fromActivity != null) return fromActivity;
    var id = asTrimmed(activity && activity.activity_id);
    if (id && timelineById && Object.prototype.hasOwnProperty.call(timelineById, id)) {
      return timelineById[id];
    }
    return null;
  }

  function looksLikeMcq(text, activity) {
    var materials = Array.isArray(activity && activity.required_materials)
      ? activity.required_materials
      : [];
    var hasMcqMaterial = materials.some(function (row) {
      var type = asTrimmed(row && row.type).toLowerCase();
      return /mcq|multiple[-_ ]?choice|auto_check/.test(type);
    });
    if (hasMcqMaterial) return true;
    return /\b(multiple[- ]choice|choose one option|select the best|mcq)\b/i.test(text);
  }

  function looksLikeMathProblem(text) {
    return /\b(equation|equations|calculate|computation|derivative|lagrange|algebra|solve the problem)\b/i.test(
      text
    );
  }

  function inferReasoningDemand(text, hasWordBand) {
    if (/\b(argument|justify|justification|defend|philosophical)\b/i.test(text)) {
      return "argument";
    }
    if (/\b(evaluat|recommend|trade-?off|criteria|judgement|judgment)\b/i.test(text)) {
      return "evaluation";
    }
    if (/\b(compar|analys|reconsider|diagnos|contrast)\b/i.test(text)) {
      return "analysis";
    }
    if (/\b(apply|application|calculate|compute)\b/i.test(text)) {
      return "application";
    }
    if (hasWordBand) return "analysis";
    return "unknown";
  }

  function inferReadingDemand(text) {
    if (/\b(dossier|evidence pack|complete (?:fictional )?evidence|full (?:set of )?evidence)\b/i.test(text)) {
      return "dossier";
    }
    if (
      /\b(read the|review the|revisit|evidence|scenario|case study|source material|provided study)\b/i.test(
        text
      )
    ) {
      return "moderate";
    }
    return "unknown";
  }

  function inferActivityType(text, activity, wordBand, reasoningDemand) {
    if (looksLikeMcq(text, activity) && !wordBand) return "mcq";
    if (looksLikeMathProblem(text) && !wordBand) return "mathematical_problem";
    if (wordBand) {
      if (reasoningDemand === "argument") return "argumentative_writing";
      if (reasoningDemand === "evaluation" && /\brecommend/i.test(text)) {
        return "institutional_recommendation";
      }
      if (reasoningDemand === "analysis" || reasoningDemand === "evaluation") {
        return "analytical_writing";
      }
      return "constructed_response";
    }
    // Free-text fields alone do not justify a substantial-writing type.
    return "unknown";
  }

  function detectFeedbackInterpretation(text, activity) {
    if (/\b(feedback|worked solution|compare your (?:answer|solution)|review against)\b/i.test(text)) {
      return true;
    }
    var materials = Array.isArray(activity && activity.required_materials)
      ? activity.required_materials
      : [];
    return materials.some(function (row) {
      var purpose = asTrimmed(row && row.purpose).toLowerCase();
      var type = asTrimmed(row && row.type).toLowerCase();
      return (
        purpose.indexOf("feedback") !== -1 ||
        purpose.indexOf("diagnostic") !== -1 ||
        type === "sample_output"
      );
    });
  }

  function detectRevision(text) {
    return /\b(revise|revision|improve your|rewrite|refine (?:your|the) (?:response|explanation|argument))\b/i.test(
      text
    );
  }

  function mergeActivities(page, baseline) {
    var byId = Object.create(null);
    function ingest(list) {
      if (!Array.isArray(list)) return;
      list.forEach(function (activity) {
        if (!activity || typeof activity !== "object") return;
        var id = asTrimmed(activity.activity_id);
        if (!id) return;
        if (!byId[id]) {
          byId[id] = activity;
          return;
        }
        // Prefer the row that carries richer task prose when merging baseline + page.
        var existing = byId[id];
        var existingText = collectText(existing).length;
        var nextText = collectText(activity).length;
        byId[id] = nextText >= existingText ? Object.assign({}, existing, activity) : existing;
        if (
          parseFiniteMinutes(existing.duration_minutes) == null &&
          parseFiniteMinutes(activity.duration_minutes) != null
        ) {
          byId[id].duration_minutes = activity.duration_minutes;
        }
      });
    }
    ingest(baseline && baseline.activities);
    ingest(page && page.activities);
    return Object.keys(byId).map(function (id) {
      return byId[id];
    });
  }

  /**
   * Map one activity into a 100A estimator input. Returns null when evidence is
   * too thin to justify a meaningful estimate.
   */
  function mapActivityToEstimatorInput(activity, timelineById) {
    var text = collectText(activity);
    var wordBand = extractExplicitWordBand(text);
    var reasoningDemand = inferReasoningDemand(text, !!wordBand);
    var readingDemand = inferReadingDemand(text);
    if (readingDemand === "dossier" && /\brecommend/i.test(text)) {
      // Institutional-style recommendation with dossier language.
      reasoningDemand = reasoningDemand === "unknown" ? "evaluation" : reasoningDemand;
    }
    var activityType = inferActivityType(text, activity, wordBand, reasoningDemand);
    var declaredDurationMinutes = resolveActivityDuration(activity, timelineById);
    var requiresFeedbackInterpretation = detectFeedbackInterpretation(text, activity);
    var requiresRevision = detectRevision(text);

    var hasDemandSignal =
      !!wordBand ||
      activityType === "mcq" ||
      activityType === "mathematical_problem" ||
      readingDemand !== "unknown" ||
      (reasoningDemand !== "unknown" && !!wordBand) ||
      requiresFeedbackInterpretation ||
      requiresRevision;

    if (!hasDemandSignal) return null;

    return {
      activityId: asTrimmed(activity.activity_id) || null,
      title: asTrimmed(activity.title) || asTrimmed(activity.activity_id) || "Activity",
      input: {
        activityType: activityType,
        declaredDurationMinutes: declaredDurationMinutes,
        suggestedLengthWords: wordBand,
        reasoningDemand: reasoningDemand,
        readingDemand: readingDemand,
        requiresFeedbackInterpretation: requiresFeedbackInterpretation,
        requiresRevision: requiresRevision,
        dossierReview: readingDemand === "dossier"
      }
    };
  }

  function formatAuthorWarning(activityLabel, declared, estimate) {
    var range = estimate.indicativeEffortMinutes || {};
    var demandBits = [];
    if (estimate.components) {
      if (estimate.components.reading && estimate.components.reading.high > 0) {
        demandBits.push("reading/evidence review");
      }
      if (estimate.components.reasoning && estimate.components.reasoning.high > 0) {
        demandBits.push("reasoning/judgement");
      }
      if (estimate.components.production && estimate.components.production.high > 0) {
        demandBits.push("response production");
      }
      if (estimate.components.feedback && estimate.components.feedback.high > 0) {
        demandBits.push("feedback interpretation");
      }
      if (estimate.components.revision && estimate.components.revision.high > 0) {
        demandBits.push("revision");
      }
    }
    var demands =
      demandBits.length > 0 ? demandBits.join(", ") : "the identified learning demands";
    return (
      "Workload feasibility (indicative): " +
      activityLabel +
      " is allocated " +
      declared +
      " minutes, but the visible demands (" +
      demands +
      ") suggest about " +
      range.low +
      "–" +
      range.high +
      " minutes may be more realistic. Consider reducing the task scope, simplifying the response, or allowing more time. This is a planning aid, not a measured completion time. You may continue without changing the design."
    );
  }

  /**
   * Assess Interactive page activities and return advisory findings only.
   *
   * @param {object} page Learning Sequence (or enriched) page artefact
   * @param {object} [baseline] Upstream page (e.g. GAM) providing activity prose
   * @returns {{ schemaVersion: string, warnings: string[], findings: object[] }}
   */
  function assessInteractivePageWorkload(page, baseline) {
    var estimator = resolveEstimator();
    var warnings = [];
    var findings = [];
    if (!estimator || typeof estimator.estimateActivityWorkload !== "function") {
      return { schemaVersion: SCHEMA_VERSION, warnings: warnings, findings: findings };
    }
    var timelineById = timelineDurationMap(page);
    var activities = mergeActivities(page, baseline);
    activities.forEach(function (activity) {
      var mapped = mapActivityToEstimatorInput(activity, timelineById);
      if (!mapped) return;
      var estimate = estimator.estimateActivityWorkload(mapped.input);
      var finding = {
        activityId: mapped.activityId,
        title: mapped.title,
        input: mapped.input,
        estimate: estimate
      };
      findings.push(finding);
      if (
        !estimate ||
        !estimate.sufficientEvidence ||
        estimate.plausiblyInsufficient !== true ||
        mapped.input.declaredDurationMinutes == null
      ) {
        return;
      }
      warnings.push(
        formatAuthorWarning(mapped.title, mapped.input.declaredDurationMinutes, estimate)
      );
    });
    return { schemaVersion: SCHEMA_VERSION, warnings: warnings, findings: findings };
  }

  function collectInteractiveWorkloadWarnings(page, baseline) {
    return assessInteractivePageWorkload(page, baseline).warnings;
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    assessInteractivePageWorkload: assessInteractivePageWorkload,
    collectInteractiveWorkloadWarnings: collectInteractiveWorkloadWarnings,
    mapActivityToEstimatorInput: mapActivityToEstimatorInput,
    mergeActivities: mergeActivities
  };
});
