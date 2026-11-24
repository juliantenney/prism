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

  function getMergedActivityMaterials(activity) {
    if (!activity || typeof activity !== "object") return [];
    var byKey = Object.create(null);
    var orderedKeys = [];
    function ingest(list, prefix) {
      if (!Array.isArray(list)) return;
      list.forEach(function (row, idx) {
        if (!row || typeof row !== "object") return;
        var mid = asTrimmed(row.material_id || row.materialId || row.id);
        var key = mid ? "id:" + mid : prefix + ":" + idx;
        if (!byKey[key]) {
          byKey[key] = Object.assign({}, row);
          orderedKeys.push(key);
        } else {
          byKey[key] = Object.assign({}, byKey[key], row);
        }
      });
    }
    ingest(activity.required_materials, "req");
    ingest(activity.materials, "mat");
    return orderedKeys.map(function (k) {
      return byKey[k];
    });
  }

  function materialTypeKey(row) {
    return asTrimmed((row && (row.material_type || row.type)) || "").toLowerCase();
  }

  function materialTextBlob(row) {
    if (!row || typeof row !== "object") return "";
    var parts = [
      row.type,
      row.material_type,
      row.title,
      row.purpose,
      row.specification,
      row.evidence_requirement,
      row.response_fulfilment
    ];
    if (typeof row.body === "string") {
      parts.push(row.body);
    } else if (row.body && typeof row.body === "object") {
      try {
        parts.push(JSON.stringify(row.body));
      } catch (_err) {}
    }
    return parts.map(asTrimmed).filter(Boolean).join("\n");
  }

  function isOptionalMaterial(row) {
    if (!row || typeof row !== "object") return false;
    if (row.optional === true || row.is_optional === true) return true;
    var header = [
      row.type,
      row.material_type,
      row.title,
      row.purpose,
      row.specification
    ]
      .map(asTrimmed)
      .join(" ");
    return /\boptional\b/i.test(header);
  }

  function extractChecklistCriteriaCount(row) {
    if (!row || typeof row !== "object") return 0;
    var body = row.body && typeof row.body === "object" ? row.body : null;
    if (body && Array.isArray(body.criteria) && body.criteria.length) {
      return body.criteria.length;
    }
    if (body && Array.isArray(body.items) && body.items.length) {
      return body.items.length;
    }
    var dr =
      (row.diagnostic_review && typeof row.diagnostic_review === "object"
        ? row.diagnostic_review
        : null) ||
      (body && body.diagnostic_review && typeof body.diagnostic_review === "object"
        ? body.diagnostic_review
        : null);
    if (dr) {
      if (Array.isArray(dr.criteria) && dr.criteria.length) return dr.criteria.length;
      if (Array.isArray(dr.dimensions) && dr.dimensions.length) return dr.dimensions.length;
      if (Array.isArray(dr.expected_repairs) && dr.expected_repairs.length) {
        return dr.expected_repairs.length;
      }
    }
    var spec = asTrimmed(row.specification || row.purpose || row.title);
    var m = spec.match(/\b(\d{1,2})\s+(?:diagnostic\s+)?(?:criteria|dimensions|checks)\b/i);
    return m ? Math.min(10, Number(m[1])) : 0;
  }

  function extractActivityMaterialSignals(activity, activityLevelFamiliar) {
    var merged = getMergedActivityMaterials(activity);
    var newEvidenceCount = 0;
    var familiarEvidenceCount = 0;
    var selectionControlCount = 0;
    var workedExampleCount = 0;
    var constructedResponseCount = 0;
    var checklistCriterionCount = 0;
    var optionalSupportCount = 0;
    var hasFeedbackMaterial = false;

    merged.forEach(function (row) {
      var mtype = materialTypeKey(row);
      var blob = materialTextBlob(row);
      if (isOptionalMaterial(row)) {
        optionalSupportCount += 1;
        return;
      }
      if (/^(?:selection|multiple[-_ ]?choice|mcq|auto[-_ ]?check)/.test(mtype) || (row.selection && typeof row.selection === "object")) {
        selectionControlCount += 1;
        return;
      }
      if (/^(?:worked_example|worked_thinking)$/.test(mtype)) {
        workedExampleCount += 1;
        return;
      }
      if (/^(?:template|response_workspace|table_entry|comparison_table)$/.test(mtype)) {
        constructedResponseCount += 1;
        return;
      }
      if (
        mtype === "checklist" ||
        mtype === "sample_output" ||
        (row.purpose && /feedback|diagnostic/i.test(String(row.purpose)))
      ) {
        hasFeedbackMaterial = true;
        checklistCriterionCount += extractChecklistCriteriaCount(row);
        return;
      }
      if (
        /^(?:data_table|dataset|scenario|case_study|diagram|chart|scatterplot)$/.test(mtype) ||
        Boolean(row.table || row.data)
      ) {
        var matFamiliar =
          looksLikeFamiliarMaterial(blob) ||
          (activityLevelFamiliar && !/\b(?:new|fresh|additional|unfamiliar)\b/i.test(blob));
        if (matFamiliar) {
          familiarEvidenceCount += 1;
        } else {
          newEvidenceCount += 1;
        }
      }
    });

    return {
      mergedMaterials: merged,
      newEvidenceCount: newEvidenceCount,
      familiarEvidenceCount: familiarEvidenceCount,
      selectionControlCount: selectionControlCount,
      workedExampleCount: workedExampleCount,
      constructedResponseCount: constructedResponseCount,
      checklistCriterionCount: checklistCriterionCount,
      optionalSupportCount: optionalSupportCount,
      hasFeedbackMaterial: hasFeedbackMaterial
    };
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
    var materials = getMergedActivityMaterials(activity);
    materials.forEach(function (row) {
      if (!row || typeof row !== "object") return;
      parts.push(
        row.material_type || row.type,
        row.title,
        row.purpose,
        row.specification,
        row.evidence_requirement
      );
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
    var materials = getMergedActivityMaterials(activity);
    var hasMcqMaterial = materials.some(function (row) {
      if (isOptionalMaterial(row)) return false;
      var type = materialTypeKey(row);
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

  function looksLikeFamiliarMaterial(text) {
    return /\b(revisit|revisiting|already (?:read|reviewed|examined|encountered|engaged)|earlier (?:evidence|judgement|judgment|work|response|material)|bring[- ]forward|prior (?:work|evidence|judgement|judgment)|familiar (?:evidence|material)|previously (?:reviewed|examined|encountered|engaged)|from (?:your|the) earlier)\b/i.test(
      String(text || "")
    );
  }

  function inferReadingDemand(text) {
    if (looksLikeFamiliarMaterial(text)) {
      return "familiar";
    }
    if (/\b(dossier|evidence pack|complete (?:fictional )?evidence|full (?:set of )?evidence)\b/i.test(text)) {
      return "dossier";
    }
    if (
      /\b(read the|review the|evidence|scenario|case study|source material|provided study)\b/i.test(
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
      if (
        reasoningDemand === "evaluation" &&
        /\b(?:institutional|evidence[- ]based|policy)?\s*recommendation\b|\brecommend(?:ing| a course| an action)\b/i.test(
          text
        )
      ) {
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

  function detectFeedbackInterpretation(text, activity, materialSignals) {
    if (materialSignals && materialSignals.hasFeedbackMaterial) return true;
    if (/\b(feedback|worked solution|compare your (?:answer|solution)|review against)\b/i.test(text)) {
      return true;
    }
    var materials = getMergedActivityMaterials(activity);
    return materials.some(function (row) {
      if (isOptionalMaterial(row)) return false;
      var purpose = asTrimmed(row && row.purpose).toLowerCase();
      var type = materialTypeKey(row);
      return (
        purpose.indexOf("feedback") !== -1 ||
        purpose.indexOf("diagnostic") !== -1 ||
        type === "sample_output" ||
        type === "checklist"
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
        var merged = nextText >= existingText ? Object.assign({}, existing, activity) : Object.assign({}, activity, existing);
        if (
          Array.isArray(existing.required_materials) &&
          !Array.isArray(merged.required_materials)
        ) {
          merged.required_materials = existing.required_materials;
        }
        if (Array.isArray(existing.materials) && !Array.isArray(merged.materials)) {
          merged.materials = existing.materials;
        }
        if (
          parseFiniteMinutes(existing.duration_minutes) == null &&
          parseFiniteMinutes(activity.duration_minutes) != null
        ) {
          merged.duration_minutes = activity.duration_minutes;
        }
        byId[id] = merged;
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
    var materialSignals = extractActivityMaterialSignals(activity, readingDemand === "familiar");
    var requiresFeedbackInterpretation = detectFeedbackInterpretation(
      text,
      activity,
      materialSignals
    );
    var requiresRevision = detectRevision(text);
    var familiarMaterial =
      readingDemand === "familiar" && materialSignals.newEvidenceCount === 0;

    // Avoid counting pure material reading twice when rich evidence materials account for inspection,
    // while keeping legacy text-only activities on readingDemand = "moderate".
    var effectiveReadingDemand = readingDemand;
    if (
      readingDemand === "familiar" &&
      materialSignals.newEvidenceCount > 0 &&
      materialSignals.familiarEvidenceCount === 0
    ) {
      materialSignals.familiarEvidenceCount = 1;
    }

    var hasDemandSignal =
      !!wordBand ||
      activityType === "mcq" ||
      activityType === "mathematical_problem" ||
      effectiveReadingDemand !== "unknown" ||
      (reasoningDemand !== "unknown" && !!wordBand) ||
      requiresFeedbackInterpretation ||
      requiresRevision ||
      materialSignals.newEvidenceCount > 0 ||
      materialSignals.familiarEvidenceCount > 0 ||
      materialSignals.selectionControlCount > 0 ||
      materialSignals.workedExampleCount > 0 ||
      materialSignals.constructedResponseCount > 0;

    if (!hasDemandSignal) return null;

    var estimatorInput = {
      activityType: activityType,
      declaredDurationMinutes: declaredDurationMinutes,
      suggestedLengthWords: wordBand,
      reasoningDemand: reasoningDemand,
      readingDemand: effectiveReadingDemand,
      requiresFeedbackInterpretation: requiresFeedbackInterpretation,
      requiresRevision: requiresRevision,
      dossierReview: effectiveReadingDemand === "dossier",
      familiarMaterial: familiarMaterial
    };
    if (materialSignals.newEvidenceCount > 0) {
      estimatorInput.newEvidenceCount = materialSignals.newEvidenceCount;
    }
    if (materialSignals.familiarEvidenceCount > 0) {
      estimatorInput.familiarEvidenceCount = materialSignals.familiarEvidenceCount;
    }
    if (materialSignals.selectionControlCount > 0) {
      estimatorInput.selectionControlCount = materialSignals.selectionControlCount;
    }
    if (materialSignals.workedExampleCount > 0) {
      estimatorInput.workedExampleCount = materialSignals.workedExampleCount;
    }
    if (materialSignals.constructedResponseCount > 0) {
      estimatorInput.constructedResponseCount = materialSignals.constructedResponseCount;
    }
    if (materialSignals.checklistCriterionCount > 0) {
      estimatorInput.checklistCriterionCount = materialSignals.checklistCriterionCount;
    }
    if (materialSignals.optionalSupportCount > 0) {
      estimatorInput.optionalSupportCount = materialSignals.optionalSupportCount;
    }

    return {
      activityId: asTrimmed(activity.activity_id) || null,
      title: asTrimmed(activity.title) || asTrimmed(activity.activity_id) || "Activity",
      input: estimatorInput
    };
  }

  function collectDriverLabels(components) {
    var demandBits = [];
    if (!components) return demandBits;
    if (components.reading && components.reading.high > 0) {
      demandBits.push("reading/evidence review");
    }
    if (components.evidenceInspection && components.evidenceInspection.high > 0) {
      demandBits.push("evidence inspection");
    }
    if (components.workedExamples && components.workedExamples.high > 0) {
      demandBits.push("worked examples");
    }
    if (components.decisions && components.decisions.high > 0) {
      demandBits.push("structured decisions");
    }
    if (components.reasoning && components.reasoning.high > 0) {
      demandBits.push("reasoning/judgement");
    }
    if (components.production && components.production.high > 0) {
      demandBits.push("response production");
    }
    if (components.feedback && components.feedback.high > 0) {
      demandBits.push("feedback interpretation");
    }
    if (components.revision && components.revision.high > 0) {
      demandBits.push("revision");
    }
    return demandBits;
  }

  function formatAuthorWarning(activityLabel, declared, estimate) {
    var range = estimate.indicativeEffortMinutes || {};
    var demandBits = collectDriverLabels(estimate.components);
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
      " minutes may be more realistic. Prefer proportionate adjustments to workload, staging, feedback engagement, or expected output before changing an authoritative time allocation. Where learners already engaged the material earlier, treat revisiting as lighter than a first reading. This is a planning aid, not a measured completion time. You may continue without changing the design."
    );
  }

  function computePageSynthesisOverheadBand(page) {
    var ps = page && page.page_synthesis;
    if (!ps || typeof ps !== "object") return { low: 0, high: 0 };
    var words = 0;
    ["overview", "learning_purpose", "knowledge_summary", "closing_paragraph"].forEach(function (k) {
      var val = ps[k];
      if (typeof val === "string" && val.trim()) {
        words += val.trim().split(/\s+/).length;
      } else if (val && typeof val === "object") {
        try {
          var s = JSON.stringify(val);
          if (s.length > 20) words += s.split(/\s+/).length;
        } catch (_err) {}
      }
    });
    return words >= 120 ? { low: 1, high: 3 } : { low: 0, high: 0 };
  }

  function resolveAuthoritativePageDurationMinutes(page, options, findings) {
    var opts = options && typeof options === "object" ? options : {};
    var fromEffective = parseFiniteMinutes(opts.effectiveDurationMinutes);
    if (fromEffective != null && fromEffective > 0) return fromEffective;
    var fromAuth = parseFiniteMinutes(opts.authoritativeDurationMinutes);
    if (fromAuth != null && fromAuth > 0) return fromAuth;
    var fromSeqTotal = parseFiniteMinutes(
      page && page.learning_sequence && page.learning_sequence.total_duration_minutes
    );
    if (fromSeqTotal != null && fromSeqTotal > 0) return fromSeqTotal;
    if (Array.isArray(findings) && findings.length > 0) {
      var allDeclared = findings.every(function (f) {
        return f && f.input && f.input.declaredDurationMinutes != null;
      });
      if (allDeclared) {
        return findings.reduce(function (sum, f) {
          return sum + f.input.declaredDurationMinutes;
        }, 0);
      }
    }
    return null;
  }

  /**
   * Assess Interactive / Practice page activities and return advisory findings only.
   *
   * @param {object} page Learning Sequence (or enriched) page artefact
   * @param {object} [baseline] Upstream page (e.g. GAM) providing activity prose
   * @param {object} [options]
   * @param {number|null} [options.effectiveDurationMinutes] authoritative workflow duration
   * @param {number|null} [options.authoritativeDurationMinutes]
   * @param {boolean} [options.requireAuthoritativeDuration]
   */
  function assessInteractivePageWorkload(page, baseline, options) {
    var estimator = resolveEstimator();
    var opts = options && typeof options === "object" ? options : {};
    var warnings = [];
    var findings = [];
    if (!estimator || typeof estimator.estimateActivityWorkload !== "function") {
      return {
        schemaVersion: SCHEMA_VERSION,
        durationStatus: "unavailable",
        authoritativeDurationMinutes: null,
        cumulative: null,
        warnings: warnings,
        findings: findings
      };
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

    var authoritativeDurationMinutes = resolveAuthoritativePageDurationMinutes(
      page,
      opts,
      findings
    );
    var overheadBand = computePageSynthesisOverheadBand(page);
    var estimates = findings.map(function (f) {
      return f.estimate;
    });
    var cumulative =
      typeof estimator.assessCumulativeWorkload === "function"
        ? estimator.assessCumulativeWorkload(estimates, authoritativeDurationMinutes, {
            overheadBand: overheadBand
          })
        : null;

    var durationStatus = authoritativeDurationMinutes != null ? "available" : "unavailable";
    if (
      durationStatus === "unavailable" &&
      cumulative &&
      cumulative.sufficientEvidence &&
      cumulative.cumulativeIndicativeMinutes
    ) {
      var missingRange = cumulative.cumulativeIndicativeMinutes;
      var missingDrivers = collectDriverLabels(cumulative.components);
      warnings.push(
        "Workload feasibility (indicative, page): authoritative duration is unavailable for this page (cumulative visible demands across " +
          findings.length +
          " activit" +
          (findings.length === 1 ? "y" : "ies") +
          " suggest about " +
          missingRange.low +
          "–" +
          missingRange.high +
          " minutes driven by " +
          (missingDrivers.length ? missingDrivers.join(", ") : "identified learning demands") +
          "), so duration feasibility could not be verified. No duration, outcome, or activity was altered."
      );
    } else if (
      cumulative &&
      cumulative.sufficientEvidence &&
      cumulative.plausiblyInsufficient === true &&
      (findings.length > 1 || warnings.length === 0)
    ) {
      var cumRange = cumulative.cumulativeIndicativeMinutes;
      var cumDrivers = collectDriverLabels(cumulative.components);
      warnings.push(
        "Workload feasibility (indicative, cumulative): total page demands (" +
          (cumDrivers.length ? cumDrivers.join(", ") : "the identified learning demands") +
          ") suggest about " +
          cumRange.low +
          "–" +
          cumRange.high +
          " minutes across " +
          findings.length +
          " activit" +
          (findings.length === 1 ? "y" : "ies") +
          ", which exceeds the authoritative duration of " +
          authoritativeDurationMinutes +
          " minutes. Prefer proportionate adjustments to evidence volume, decision density, feedback scope, or expected output without silently altering authoritative duration or outcomes. This is a planning aid, not a measured completion time. You may continue without changing the design."
      );
    }

    return {
      schemaVersion: SCHEMA_VERSION,
      durationStatus: durationStatus,
      authoritativeDurationMinutes: authoritativeDurationMinutes,
      cumulative: cumulative,
      warnings: warnings,
      findings: findings
    };
  }

  function collectInteractiveWorkloadWarnings(page, baseline, options) {
    return assessInteractivePageWorkload(page, baseline, options).warnings;
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    assessInteractivePageWorkload: assessInteractivePageWorkload,
    collectInteractiveWorkloadWarnings: collectInteractiveWorkloadWarnings,
    mapActivityToEstimatorInput: mapActivityToEstimatorInput,
    mergeActivities: mergeActivities
  };
});
