/**
 * Sprint 100C — Learning Journey → workload feasibility adapter.
 *
 * Assesses commission-level and journey-level feasibility from Design Page
 * commission specifications plus the workflow learning-time envelope.
 *
 * Double-counting safeguards:
 * - Estimates commissions only (never also their nested activities).
 * - Never adds element allocations to commission allocations.
 * - Never sums estimator upper bounds into a predicted journey total.
 * - Arithmetic uses declared/allocated minutes only; feasibility stays separate.
 * - Overlapping/ambiguous commission scopes → risk note, not a numerical aggregate.
 *
 * Does not mutate Learning Journey schemas or declared envelopes.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      typeof require === "function" ? require("./workload-feasibility-estimator.js") : null
    );
  } else {
    root.PrismLearningJourneyWorkloadFeasibilityAdapter = factory(
      root.PrismWorkloadFeasibilityEstimator || null
    );
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (estimatorApi) {
  "use strict";

  var SCHEMA_VERSION = "100C.1";

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
    if (typeof window !== "undefined" && window.PrismWorkloadFeasibilityEstimator) {
      return window.PrismWorkloadFeasibilityEstimator;
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

  /**
   * Parse learning-time / duration envelopes such as "90 minutes", "1.5 hours", "4 hours".
   * Returns whole minutes or null.
   */
  function parseLearningTimeEnvelopeMinutes(value) {
    var direct = parseFiniteMinutes(value);
    if (direct != null) return direct;
    var text = asTrimmed(value);
    if (!text) return null;
    var hours = text.match(/(\d+(?:\.\d+)?)\s*hours?\b/i);
    if (hours) {
      return Math.round(Number(hours[1]) * 60);
    }
    var mins = text.match(/(\d{1,4})\s*(?:minutes?|mins?|min)\b/i);
    if (mins) return Number(mins[1]);
    return null;
  }

  /**
   * Prefer explicit "Approximate learner time: N minutes" / "with approximately N minutes
   * of learner effort". Do not sum nested stage allocations inside the same commission.
   */
  function parseCommissionAllocatedMinutes(text) {
    var src = asTrimmed(text);
    if (!src) return null;
    var labelled = src.match(
      /Approximate\s+learner\s+time\s*:\s*(\d{1,4})\s*(?:minutes?|mins?|min)?\b/i
    );
    if (labelled) return Number(labelled[1]);
    var effort = src.match(
      /(?:with\s+)?approximately\s+(\d{1,4})\s*(?:minutes?|mins?|min)\s+of\s+learner\s+effort\b/i
    );
    if (effort) return Number(effort[1]);
    var allocated = src.match(
      /(?:allocated|allow|allows)\s+(?:approximately\s+)?(\d{1,4})\s*(?:minutes?|mins?|min)\b/i
    );
    if (allocated) return Number(allocated[1]);
    // Last resort: first clear "approximately N minutes" that is not a numeric result.
    var approx = src.match(/approximately\s+(\d{1,4})\s*(?:minutes?|mins?|min)\b/i);
    if (approx) {
      var n = Number(approx[1]);
      // Guard against feeding-back measured values (e.g. "approximately 3.39 s").
      if (n >= 2) return n;
    }
    return null;
  }

  function resolveStructuredCommissionAllocatedMinutes(commission, options) {
    if (!commission || typeof commission !== "object") return null;
    var opts = options && typeof options === "object" ? options : {};
    var id = asTrimmed(commission.commission_id || commission.commissionId);
    var overrideMap =
      (opts.authoritativeDurationsByCommissionId &&
      typeof opts.authoritativeDurationsByCommissionId === "object"
        ? opts.authoritativeDurationsByCommissionId
        : null) ||
      (opts.commissionDurationsById && typeof opts.commissionDurationsById === "object"
        ? opts.commissionDurationsById
        : null);
    if (id && overrideMap && Object.prototype.hasOwnProperty.call(overrideMap, id)) {
      var fromMap = parseFiniteMinutes(overrideMap[id]);
      if (fromMap != null && fromMap > 0) return fromMap;
    }
    var candidates = [
      commission.allocated_minutes,
      commission.allocatedMinutes,
      commission.commissioned_duration_minutes,
      commission.commissionedDurationMinutes
    ];
    for (var i = 0; i < candidates.length; i += 1) {
      var parsed = parseFiniteMinutes(candidates[i]);
      if (parsed != null && parsed > 0) return parsed;
    }
    return null;
  }

  function resolveCommissionAllocatedMinutes(commission, options) {
    var opts = options && typeof options === "object" ? options : {};
    var structured = resolveStructuredCommissionAllocatedMinutes(commission, opts);
    if (structured != null) {
      return {
        minutes: structured,
        source: "structured",
        durationStatus: "available"
      };
    }
    if (opts.requireAuthoritativeDuration === true || opts.disableProseFallback === true) {
      return {
        minutes: null,
        source: "unavailable",
        durationStatus: "unavailable"
      };
    }
    var proseMinutes = parseCommissionAllocatedMinutes(collectCommissionText(commission));
    if (proseMinutes != null) {
      return {
        minutes: proseMinutes,
        source: "legacy_prose",
        durationStatus: "available"
      };
    }
    return {
      minutes: null,
      source: "unavailable",
      durationStatus: "unavailable"
    };
  }

  function hasStructuredDurationContract(page, options) {
    var opts = options && typeof options === "object" ? options : {};
    if (opts.requireAuthoritativeDuration === true || opts.disableProseFallback === true) {
      return true;
    }
    if (parseFiniteMinutes(opts.authoritativeParentDurationMinutes) != null) return true;
    if (
      page &&
      page.learning_journey &&
      parseFiniteMinutes(page.learning_journey.allocated_minutes) != null
    ) {
      return true;
    }
    if (page && asTrimmed(page.duration_contract_version)) return true;
    var overrideMap =
      opts.authoritativeDurationsByCommissionId || opts.commissionDurationsById;
    if (overrideMap && typeof overrideMap === "object" && Object.keys(overrideMap).length > 0) {
      return true;
    }
    var commissions = page && Array.isArray(page.commissions) ? page.commissions : [];
    return commissions.some(function (c) {
      return resolveStructuredCommissionAllocatedMinutes(c, opts) != null;
    });
  }

  function collectCommissionText(commission) {
    if (!commission || typeof commission !== "object") return "";
    return [
      commission.title,
      commission.specification_text || commission.specificationText,
      commission.journey_context_text || commission.journeyContextText,
      commission.product_id || commission.productId,
      commission.dependencies
    ]
      .map(asTrimmed)
      .filter(Boolean)
      .join("\n");
  }

  function extractWordBand(text) {
    var api = resolveEstimator();
    var range = String(text || "").match(/(\d{1,4})\s*[-–—]\s*(\d{1,4})\s*words?\b/i);
    if (range) return { min: Number(range[1]), max: Number(range[2]) };
    var single = String(text || "").match(/\b(\d{1,4})\s*words?\b/i);
    if (single) {
      var n = Number(single[1]);
      return { min: n, max: n };
    }
    if (api && typeof api.parseSuggestedLengthWords === "function" && /\bwords?\b/i.test(text)) {
      return api.parseSuggestedLengthWords(text);
    }
    return null;
  }

  function inferReasoningDemand(text, wordBand) {
    if (/\b(recommend|recommendation|evaluat|criteria|trade-?off)\b/i.test(text)) {
      return "evaluation";
    }
    if (/\b(argument|philosophical|defend)\b/i.test(text)) {
      return "argument";
    }
    if (/\b(compar|analys|reconsider|diagnos|prioritis|prioritiz|contrast|calculat|interpret)\b/i.test(text)) {
      return "analysis";
    }
    if (/\b(apply|application|compute)\b/i.test(text)) {
      return "application";
    }
    if (wordBand) return "analysis";
    return "unknown";
  }

  function looksLikeFamiliarMaterial(text) {
    return /\b(revisit|revisiting|already (?:read|reviewed|examined|encountered|engaged)|earlier (?:evidence|judgement|judgment|work|response|material|commission)|bring[- ]forward|prior (?:work|evidence|judgement|judgment)|familiar (?:evidence|material)|previously (?:reviewed|examined|encountered|engaged)|from (?:your|the) earlier)\b/i.test(
      String(text || "")
    );
  }

  function inferEvidenceSignals(text, readingDemand) {
    var src = String(text || "");
    var newEvidenceCount = 0;
    var familiarEvidenceCount = 0;
    if (
      /\b(?:new|fresh|additional|unfamiliar)\s+(?:dataset|datasets|data[- ]table|tables|evidence|chart|scatterplot|source)/i.test(
        src
      )
    ) {
      var explicitCount = src.match(/\b(\d{1,2})\s+(?:new|fresh|additional)\s+(?:datasets?|tables?|sources?|charts?)\b/i);
      newEvidenceCount = explicitCount ? Math.min(8, Number(explicitCount[1])) : 1;
    } else if (
      readingDemand !== "familiar" &&
      readingDemand !== "dossier" &&
      /\b(?:dataset|data[- ]table|scatterplot)\b/i.test(src)
    ) {
      var tableCount = src.match(/\b(\d{1,2})\s+(?:datasets?|data[- ]tables?|scatterplots?)\b/i);
      newEvidenceCount = tableCount ? Math.min(8, Number(tableCount[1])) : 1;
    }
    if (readingDemand === "familiar" && newEvidenceCount > 0) {
      // Mixed commission: revisiting earlier material while introducing new datasets.
      familiarEvidenceCount = 1;
    }
    var workedMatch = src.match(/\b(\d{1,2})\s+worked\s+examples?\b/i);
    var workedExampleCount = workedMatch
      ? Math.min(4, Number(workedMatch[1]))
      : /\bworked\s+(?:example|demonstration)\b/i.test(src)
        ? 1
        : 0;
    var optionalSupportCount = /\boptional\s+(?:hint|hints|extension|support|scaffold)\b/i.test(src)
      ? 1
      : 0;
    return {
      newEvidenceCount: newEvidenceCount,
      familiarEvidenceCount: familiarEvidenceCount,
      workedExampleCount: workedExampleCount,
      optionalSupportCount: optionalSupportCount
    };
  }

  function inferReadingDemand(text) {
    if (looksLikeFamiliarMaterial(text)) {
      return "familiar";
    }
    if (/\b(dossier|evidence pack|complete (?:fictional )?evidence|full (?:set of )?evidence)\b/i.test(text)) {
      return "dossier";
    }
    if (
      /\b(read (?:the|your)|review (?:the|your)|contested sources|source material|research (?:account|study)|canonical (?:dataset|observations|evidence))\b/i.test(
        text
      )
    ) {
      return "moderate";
    }
    return "unknown";
  }

  function inferActivityType(text, productId, wordBand, reasoningDemand) {
    var product = asTrimmed(productId).toLowerCase();
    if (/\b(mcq|multiple[- ]choice|auto[- ]?checkable)\b/i.test(text) && !wordBand) {
      return "mcq";
    }
    if (
      /\b(calculat|standard deviation|mathematical|equation)\b/i.test(text) &&
      !wordBand &&
      (product === "interactive" || product === "practice")
    ) {
      return "mathematical_problem";
    }
    if (wordBand) {
      if (
        reasoningDemand === "evaluation" &&
        /\b(?:institutional|evidence[- ]based|policy)?\s*recommendation\b|\brecommend(?:ing| a course| an action)\b/i.test(
          text
        )
      ) {
        return "institutional_recommendation";
      }
      if (reasoningDemand === "argument") return "argumentative_writing";
      if (reasoningDemand === "analysis" || reasoningDemand === "evaluation") {
        return "analytical_writing";
      }
      return "constructed_response";
    }
    // Commission prose alone without length / typed demand → insufficient.
    return "unknown";
  }

  function detectFeedbackInterpretation(text) {
    return /\b(feedback|self[- ]?evaluat|interpret (?:the )?feedback|after feedback)\b/i.test(
      text
    );
  }

  function detectRevision(text) {
    return /\b(then revise|revise (?:your|the)|revision|rewrite|after feedback.{0,40}revise)\b/i.test(
      text
    );
  }

  function commissionLabel(commission) {
    var title = asTrimmed(commission && commission.title);
    if (title) return title;
    var id = asTrimmed(commission && commission.commission_id);
    if (id) return id;
    return "Commission";
  }

  /**
   * Map one Design Page commission into a 100A estimator input.
   * Returns null when evidence is too thin (common for high-level commissions).
   */
  function mapCommissionToEstimatorInput(commission, options) {
    if (!commission || typeof commission !== "object") return null;
    var text = collectCommissionText(commission);
    var wordBand = extractWordBand(text);
    var reasoningDemand = inferReasoningDemand(text, !!wordBand);
    var readingDemand = inferReadingDemand(text);
    var productId = asTrimmed(commission.product_id || commission.productId);
    var activityType = inferActivityType(text, productId, wordBand, reasoningDemand);
    var durationResolution = resolveCommissionAllocatedMinutes(commission, options);
    var declaredDurationMinutes = durationResolution.minutes;
    var requiresFeedbackInterpretation = detectFeedbackInterpretation(text);
    var requiresRevision = detectRevision(text);
    var familiarMaterial = readingDemand === "familiar";
    var evidenceSignals = inferEvidenceSignals(text, readingDemand);

    var hasDemandSignal =
      !!wordBand ||
      activityType === "mcq" ||
      activityType === "mathematical_problem" ||
      evidenceSignals.newEvidenceCount > 0 ||
      evidenceSignals.workedExampleCount > 0 ||
      (readingDemand !== "unknown" && !!wordBand) ||
      (reasoningDemand !== "unknown" && !!wordBand) ||
      (requiresFeedbackInterpretation && !!wordBand) ||
      (requiresRevision && !!wordBand);

    if (!hasDemandSignal) return null;

    var estimatorInput = {
      activityType: activityType,
      declaredDurationMinutes: declaredDurationMinutes,
      suggestedLengthWords: wordBand,
      reasoningDemand: reasoningDemand,
      readingDemand: readingDemand,
      requiresFeedbackInterpretation: requiresFeedbackInterpretation,
      requiresRevision: requiresRevision,
      dossierReview: readingDemand === "dossier",
      familiarMaterial: familiarMaterial
    };
    if (evidenceSignals.newEvidenceCount > 0) {
      estimatorInput.newEvidenceCount = evidenceSignals.newEvidenceCount;
    }
    if (evidenceSignals.familiarEvidenceCount > 0) {
      estimatorInput.familiarEvidenceCount = evidenceSignals.familiarEvidenceCount;
    }
    if (evidenceSignals.workedExampleCount > 0) {
      estimatorInput.workedExampleCount = evidenceSignals.workedExampleCount;
    }
    if (evidenceSignals.optionalSupportCount > 0) {
      estimatorInput.optionalSupportCount = evidenceSignals.optionalSupportCount;
    }

    return {
      commissionId: asTrimmed(commission.commission_id) || null,
      title: commissionLabel(commission),
      productId: productId || null,
      allocatedMinutes: declaredDurationMinutes,
      durationSource: durationResolution.source,
      durationStatus: durationResolution.durationStatus,
      input: estimatorInput
    };
  }

  function formatCommissionWarning(label, declared, estimate) {
    var range = estimate.indicativeEffortMinutes || {};
    var demandBits = [];
    if (estimate.components) {
      if (estimate.components.reading && estimate.components.reading.high > 0) {
        demandBits.push("reading/evidence review");
      }
      if (estimate.components.evidenceInspection && estimate.components.evidenceInspection.high > 0) {
        demandBits.push("evidence inspection");
      }
      if (estimate.components.workedExamples && estimate.components.workedExamples.high > 0) {
        demandBits.push("worked examples");
      }
      if (estimate.components.decisions && estimate.components.decisions.high > 0) {
        demandBits.push("structured decisions");
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
      "Workload feasibility (indicative, commission): " +
      label +
      " is allocated " +
      declared +
      " minutes, but the visible demands (" +
      demands +
      ") suggest about " +
      range.low +
      "–" +
      range.high +
      " minutes may be more realistic. Prefer proportionate adjustments to workload, staging, feedback engagement, or redistribution of effort before changing authoritative journey allocations. Where earlier commissions already engaged the same material, avoid double-counting a full first-pass reading. This is a planning aid, not a measured completion time. You may continue without changing the design."
    );
  }

  function extractLearningElementRefs(text) {
    var refs = [];
    var re = /Learning\s+Elements?\s+(\d+(?:\s*(?:,|and)\s*\d+)*)/gi;
    var match;
    while ((match = re.exec(String(text || ""))) !== null) {
      var chunk = match[1];
      var nums = chunk.match(/\d+/g) || [];
      nums.forEach(function (n) {
        if (refs.indexOf(n) === -1) refs.push(n);
      });
    }
    return refs;
  }

  /**
   * Detect ambiguous overlap: multiple commissions claiming the same learning
   * element, or duplicate approximate-time scopes that cannot safely be aggregated.
   */
  function detectAggregationRisk(commissionFindings) {
    var elementOwners = Object.create(null);
    var overlapping = [];
    commissionFindings.forEach(function (row) {
      var refs = extractLearningElementRefs(row.specificationText || "");
      refs.forEach(function (el) {
        if (!elementOwners[el]) elementOwners[el] = [];
        elementOwners[el].push(row.commissionId || row.title);
      });
    });
    Object.keys(elementOwners).forEach(function (el) {
      if (elementOwners[el].length > 1) {
        overlapping.push({
          learningElement: el,
          commissionIds: elementOwners[el].slice()
        });
      }
    });
    return {
      hasOverlap: overlapping.length > 0,
      overlappingElements: overlapping
    };
  }

  function formatJourneyWarning(options) {
    var overloaded = options.overloadedTitles || [];
    var envelope = options.envelopeMinutes;
    var allocatedSum = options.allocatedSum;
    var arithmeticOk = options.arithmeticOk;
    var aggregationSafe = options.aggregationSafe;
    var parts = [];

    parts.push("Workload feasibility (indicative, journey)");

    if (overloaded.length) {
      parts.push(
        "One or more commissions appear overloaded relative to their allocated time: " +
          overloaded.join("; ") +
          "."
      );
    }

    if (envelope != null && allocatedSum != null && arithmeticOk === false) {
      parts.push(
        "Declared commission allocations total about " +
          allocatedSum +
          " minutes against a journey envelope of about " +
          envelope +
          " minutes (arithmetic consistency concern — separate from demand feasibility)."
      );
    } else if (envelope != null && allocatedSum != null && arithmeticOk === true && overloaded.length) {
      parts.push(
        "Commission allocations sum to about " +
          allocatedSum +
          " minutes and match the journey envelope of about " +
          envelope +
          " minutes arithmetically, but a correctly summed journey is not automatically feasible when individual commissions are overloaded."
      );
    } else if (envelope != null && overloaded.length) {
      parts.push(
        "The journey learning-time envelope is about " +
          envelope +
          " minutes; overloaded commissions may put that envelope at risk."
      );
    }

    if (!aggregationSafe) {
      parts.push(
        "Commission scopes appear to overlap or cannot safely be aggregated into a single predicted total, so no combined effort figure is invented."
      );
    } else {
      parts.push(
        "No combined estimator upper-bound total is reported; journey concern is based on evidenced commission-level feasibility, not summed prediction bands."
      );
    }

    parts.push(
      "Consider reducing scope, revising overloaded commissions, redistributing time, or increasing the journey envelope. Estimates are indicative planning aids, not measured completion times. You may continue without changing the design."
    );

    return parts.join(" ");
  }

  /**
   * @param {object} page Learning Journey Design Page
   * @param {object} [options]
   * @param {number|string|null} [options.learningTimeEnvelope] journey envelope minutes or prose
   * @param {number|string|null} [options.learningTimeEnvelopeMinutes]
   * @param {number|null} [options.authoritativeParentDurationMinutes]
   * @param {object|null} [options.authoritativeDurationsByCommissionId]
   * @param {boolean} [options.requireAuthoritativeDuration]
   */
  function assessLearningJourneyWorkload(page, options) {
    var estimator = resolveEstimator();
    var warnings = [];
    var findings = [];
    var opts = options && typeof options === "object" ? options : {};
    var structuredContract = hasStructuredDurationContract(page, opts);
    var perCommissionOpts = Object.assign({}, opts, {
      requireAuthoritativeDuration: structuredContract
    });
    var envelopeMinutes =
      parseFiniteMinutes(opts.authoritativeParentDurationMinutes) != null
        ? parseFiniteMinutes(opts.authoritativeParentDurationMinutes)
        : page &&
            page.learning_journey &&
            parseFiniteMinutes(page.learning_journey.allocated_minutes) != null
          ? parseFiniteMinutes(page.learning_journey.allocated_minutes)
          : parseFiniteMinutes(opts.learningTimeEnvelopeMinutes) != null
            ? parseFiniteMinutes(opts.learningTimeEnvelopeMinutes)
            : structuredContract
              ? null
              : parseLearningTimeEnvelopeMinutes(opts.learningTimeEnvelope);

    var commissions = page && Array.isArray(page.commissions) ? page.commissions : [];
    var commissionRows = [];
    var overloadedTitles = [];
    var allocatedKnown = [];
    var unavailableCommissionIds = [];
    var insufficientCount = 0;

    commissions.forEach(function (commission) {
      var durationResolution = resolveCommissionAllocatedMinutes(commission, perCommissionOpts);
      var allocated = durationResolution.minutes;
      var mapped = mapCommissionToEstimatorInput(commission, perCommissionOpts);
      var cid = asTrimmed(commission && commission.commission_id) || commissionLabel(commission);
      var row = {
        commissionId: asTrimmed(commission && commission.commission_id) || null,
        title: commissionLabel(commission),
        allocatedMinutes: allocated,
        durationSource: durationResolution.source,
        durationStatus: durationResolution.durationStatus,
        specificationText: asTrimmed(
          commission && (commission.specification_text || commission.specificationText)
        ),
        mapped: mapped,
        estimate: null,
        insufficientEvidence: !mapped
      };
      if (allocated != null) {
        allocatedKnown.push(allocated);
      } else {
        unavailableCommissionIds.push(cid);
      }

      if (!mapped || !estimator || typeof estimator.estimateActivityWorkload !== "function") {
        if (!mapped) insufficientCount += 1;
        commissionRows.push(row);
        findings.push(row);
        return;
      }

      var estimate = estimator.estimateActivityWorkload(mapped.input);
      row.estimate = estimate;
      commissionRows.push(row);
      findings.push(row);

      if (
        estimate &&
        estimate.sufficientEvidence &&
        estimate.plausiblyInsufficient === true &&
        mapped.input.declaredDurationMinutes != null
      ) {
        overloadedTitles.push(
          row.title + " (" + mapped.input.declaredDurationMinutes + " min)"
        );
        warnings.push(
          formatCommissionWarning(row.title, mapped.input.declaredDurationMinutes, estimate)
        );
      }
    });

    // Only treat as a complete allocated sum when every commission has a parseable allocation.
    // Never invent missing commission times and never add element-level allocations.
    var allHaveAllocation =
      commissions.length > 0 && allocatedKnown.length === commissions.length;
    var allocatedSum = allHaveAllocation
      ? allocatedKnown.reduce(function (a, b) {
          return a + b;
        }, 0)
      : null;

    var arithmeticOk =
      envelopeMinutes != null && allocatedSum != null
        ? allocatedSum === envelopeMinutes
        : null;

    var durationStatus =
      envelopeMinutes == null || (structuredContract && unavailableCommissionIds.length > 0)
        ? "unavailable"
        : unavailableCommissionIds.length > 0
          ? "partial"
          : "available";

    if (
      durationStatus === "unavailable" &&
      (structuredContract || commissions.some(function (c, i) { return commissionRows[i] && !commissionRows[i].insufficientEvidence; }))
    ) {
      var missingBits = [];
      if (envelopeMinutes == null) missingBits.push("authoritative journey duration");
      if (unavailableCommissionIds.length > 0) {
        missingBits.push(
          "structured allocated_minutes for commission(s): " + unavailableCommissionIds.join(", ")
        );
      }
      warnings.push(
        "Workload feasibility (indicative, journey): authoritative structured duration is unavailable (" +
          (missingBits.join("; ") || "missing allocation") +
          "), so workload-to-time feasibility could not be completed. No automatic duration or outcome change was applied."
      );
    }

    var aggregationRisk = detectAggregationRisk(commissionRows);
    // Aggregation of estimator bands is never performed. "aggregationSafe" only
    // means scopes are distinct enough that commission-level findings can be listed
    // without implying a summed predicted total.
    var aggregationSafe = !aggregationRisk.hasOverlap;

    // Over-allocation vs envelope is an arithmetic concern; under-allocation is
    // often incomplete authoring and is not treated as a feasibility failure.
    var overAllocated =
      envelopeMinutes != null &&
      allocatedSum != null &&
      allocatedSum > envelopeMinutes;

    // Journey-level warning when evidenced commission overload exists, or when
    // declared commission allocations exceed the envelope. Never emit a summed
    // estimator upper-bound prediction.
    if (overloadedTitles.length || overAllocated) {
      warnings.push(
        formatJourneyWarning({
          overloadedTitles: overloadedTitles,
          envelopeMinutes: envelopeMinutes,
          allocatedSum: allocatedSum,
          arithmeticOk: overAllocated ? false : arithmeticOk,
          aggregationSafe: aggregationSafe
        })
      );
    } else if (aggregationRisk.hasOverlap) {
      warnings.push(
        "Workload feasibility (indicative, journey): commission scopes appear to overlap on shared learning elements (" +
          aggregationRisk.overlappingElements
            .map(function (row) {
              return "Element " + row.learningElement + " → " + row.commissionIds.join(", ");
            })
            .join("; ") +
          "), so no combined workload total is produced. Review redistribution of educational jobs or time without assuming additive effort. Estimates are indicative. You may continue without changing the design."
      );
    }

    return {
      schemaVersion: SCHEMA_VERSION,
      warnings: warnings,
      findings: findings,
      journey: {
        envelopeMinutes: envelopeMinutes,
        allocatedSum: allocatedSum,
        arithmeticOk: arithmeticOk,
        durationStatus: durationStatus,
        unavailableCommissionIds: unavailableCommissionIds,
        overloadedCount: overloadedTitles.length,
        insufficientEvidenceCount: insufficientCount,
        aggregationSafe: aggregationSafe && !aggregationRisk.hasOverlap,
        aggregationRisk: aggregationRisk
      }
    };
  }

  function collectLearningJourneyWorkloadWarnings(page, options) {
    return assessLearningJourneyWorkload(page, options).warnings;
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    assessLearningJourneyWorkload: assessLearningJourneyWorkload,
    collectLearningJourneyWorkloadWarnings: collectLearningJourneyWorkloadWarnings,
    mapCommissionToEstimatorInput: mapCommissionToEstimatorInput,
    resolveCommissionAllocatedMinutes: resolveCommissionAllocatedMinutes,
    parseCommissionAllocatedMinutes: parseCommissionAllocatedMinutes,
    parseLearningTimeEnvelopeMinutes: parseLearningTimeEnvelopeMinutes,
    detectAggregationRisk: detectAggregationRisk
  };
});
