/**
 * Sprint 100A — Learner workload feasibility estimator (standalone).
 *
 * Deterministic, indicative effort ranges for spotting potentially unrealistic
 * declared durations. Independent of PRISM duration-allocation arithmetic.
 *
 * Not integrated into production workflows in Phase 100A.
 * Not an empirical completion-time predictor.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PrismWorkloadFeasibilityEstimator = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // Sprint 103 (PB-FA-025): add familiar/revisit reading band; keep 100A contract shape.
  var SCHEMA_VERSION = "100A.2";

  /** Coarse reading / evidence-review bands (minutes). */
  var READING_BANDS = {
    none: { low: 0, high: 0 },
    brief: { low: 1, high: 3 },
    /** Purposeful revisiting of material already engaged earlier — not a first-pass read. */
    familiar: { low: 2, high: 5 },
    moderate: { low: 4, high: 8 },
    substantial: { low: 8, high: 15 },
    dossier: { low: 12, high: 25 }
  };

  /**
   * Reasoning / judgement bands (minutes).
   * Captures thinking load beyond mere reading or typing.
   */
  var REASONING_BANDS = {
    recall: { low: 0, high: 1 },
    comprehension: { low: 1, high: 3 },
    application: { low: 2, high: 6 },
    analysis: { low: 4, high: 9 },
    evaluation: { low: 5, high: 11 },
    argument: { low: 6, high: 12 }
  };

  var ACTIVITY_ALIASES = {
    mcq: "mcq",
    multiple_choice: "mcq",
    auto_checkable: "mcq",
    short_judgement: "mcq",
    constructed_response: "constructed_response",
    constructed_performance: "constructed_response",
    analytical_writing: "analytical_writing",
    analytical_reconsideration: "analytical_writing",
    argumentative_writing: "argumentative_writing",
    philosophical_argument: "argumentative_writing",
    institutional_recommendation: "institutional_recommendation",
    mathematical_problem: "mathematical_problem",
    math_problem: "mathematical_problem",
    interactive_judgement: "interactive_judgement",
    unknown: "unknown"
  };

  function asTrimmed(value) {
    return String(value == null ? "" : value).trim();
  }

  function parseFiniteMinutes(value) {
    if (value == null || value === "") return null;
    var n = Number(value);
    if (!Number.isFinite(n) || n < 0) return null;
    return Math.round(n);
  }

  function parseNonNegativeCount(value) {
    if (value == null || value === "") return 0;
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return 0;
    return Math.round(n);
  }

  function normalizeActivityType(raw) {
    var key = asTrimmed(raw).toLowerCase().replace(/[\s-]+/g, "_");
    if (!key) return "unknown";
    return ACTIVITY_ALIASES[key] || "unknown";
  }

  function normalizeReasoningDemand(raw, activityType) {
    var key = asTrimmed(raw).toLowerCase();
    if (REASONING_BANDS[key]) return key;
    if (activityType === "mcq") return "comprehension";
    if (activityType === "mathematical_problem") return "application";
    if (activityType === "analytical_writing") return "analysis";
    if (activityType === "argumentative_writing") return "argument";
    if (activityType === "institutional_recommendation") return "evaluation";
    if (activityType === "interactive_judgement") return "evaluation";
    if (activityType === "constructed_response") return "analysis";
    return "unknown";
  }

  function normalizeReadingDemand(raw, activityType, flags) {
    var key = asTrimmed(raw).toLowerCase();
    if (READING_BANDS[key]) return key;
    // Familiar revisit wins over first-pass evidence/dossier flags: later journey
    // components often re-open known material without a full initial read.
    if (flags && flags.familiarMaterial === true) return "familiar";
    if (flags && flags.evidenceReview === true) return "substantial";
    if (flags && flags.dossierReview === true) return "dossier";
    if (activityType === "institutional_recommendation") return "dossier";
    if (activityType === "mcq") return "brief";
    if (activityType === "mathematical_problem") return "brief";
    if (activityType === "interactive_judgement") return "moderate";
    return "unknown";
  }

  /**
   * Parse suggested response length into an inclusive word band.
   * Accepts number, {min,max}, or strings such as "300-400" / "approximately 180–250 words".
   */
  function parseSuggestedLengthWords(value) {
    if (value == null || value === "") return null;
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
      var rounded = Math.round(value);
      return { min: rounded, max: rounded };
    }
    if (typeof value === "object" && !Array.isArray(value)) {
      var min = parseFiniteMinutes(value.min != null ? value.min : value.low);
      var max = parseFiniteMinutes(value.max != null ? value.max : value.high);
      if (min == null && max == null) return null;
      if (min == null) min = max;
      if (max == null) max = min;
      if (min > max) {
        var swap = min;
        min = max;
        max = swap;
      }
      return { min: min, max: max };
    }
    var text = asTrimmed(value);
    if (!text) return null;
    var range = text.match(/(\d{1,4})\s*[-–—]\s*(\d{1,4})/);
    if (range) {
      return {
        min: Number(range[1]),
        max: Number(range[2])
      };
    }
    var single = text.match(/(\d{1,4})\s*words?\b/i) || text.match(/\b(\d{1,4})\b/);
    if (single) {
      var n = Number(single[1]);
      return { min: n, max: n };
    }
    return null;
  }

  function band(low, high) {
    return { low: low, high: high };
  }

  function addBands(a, b) {
    return band(a.low + b.low, a.high + b.high);
  }

  /**
   * Writing production band from word length and reasoning intensity.
   * Word count is a planning signal, not a complete cognitive measure —
   * reasoningDemand already contributes a separate thinking band.
   */
  function writingProductionBand(wordBand, reasoningDemand) {
    var mid = (wordBand.min + wordBand.max) / 2;
    var base;
    if (mid < 50) base = band(1, 3);
    else if (mid < 120) base = band(4, 8);
    else if (mid < 180) base = band(8, 14);
    else if (mid < 250) base = band(12, 20);
    else if (mid < 350) base = band(16, 28);
    else if (mid < 500) base = band(22, 36);
    else base = band(30, 48);

    // Argumentative / evaluative writing is slower than straightforward exposition.
    if (reasoningDemand === "argument" || reasoningDemand === "evaluation") {
      return band(base.low + 3, base.high + 6);
    }
    if (reasoningDemand === "analysis") {
      return band(base.low + 2, base.high + 4);
    }
    return base;
  }

  function mathematicalProductionBand() {
    // Focused problem work: set-up, calculation/reasoning, check.
    return band(10, 18);
  }

  function mcqProductionBand() {
    return band(0, 1);
  }

  function interactiveJudgementProductionBand() {
    // Short justified selection / confidence note, not extended prose.
    return band(1, 4);
  }

  function typeImpliedProductionFloor(activityType, reasoningDemand) {
    // Conservative floors when length is absent but type implies substantial work.
    if (activityType === "argumentative_writing") {
      return {
        band: band(18, 32),
        factor: "Activity type implies substantial argumentative writing; response length was not supplied."
      };
    }
    if (activityType === "institutional_recommendation") {
      return {
        band: band(20, 34),
        factor: "Activity type implies a substantial recommendation response; response length was not supplied."
      };
    }
    if (activityType === "analytical_writing") {
      return {
        band: band(12, 22),
        factor: "Activity type implies analytical writing; response length was not supplied."
      };
    }
    if (activityType === "constructed_response" && reasoningDemand === "argument") {
      return {
        band: band(15, 28),
        factor: "Constructed response with argument-level reasoning; response length was not supplied."
      };
    }
    return null;
  }

  function feedbackBand(required, checklistCriterionCount) {
    if (!required && !(checklistCriterionCount > 0)) return band(0, 0);
    if (checklistCriterionCount > 3) {
      var extra = Math.min(4, Math.floor((checklistCriterionCount - 2) / 2));
      return band(2 + extra, 5 + extra * 2);
    }
    return band(2, 5);
  }

  function revisionBand(required, hasSubstantialWriting) {
    if (!required) return band(0, 0);
    return hasSubstantialWriting ? band(5, 12) : band(3, 7);
  }

  function evidenceInspectionBand(newCount, familiarCount, readingDemand) {
    var low = 0;
    var high = 0;
    if (newCount > 0) {
      if (readingDemand === "dossier") {
        // Dossier reading (12-25 min) already absorbs up to 3 core evidence sources; charge only extras.
        var extraDossier = Math.max(0, newCount - 3);
        low += Math.min(8, extraDossier);
        high += Math.min(16, extraDossier * 2);
      } else if (readingDemand === "substantial" || readingDemand === "moderate") {
        // Reading band already covers the primary evidence read; charge additional distinct datasets.
        var extraModerate = Math.max(0, newCount - 1);
        low += Math.min(12, extraModerate * 2);
        high += Math.min(22, extraModerate * 4);
      } else {
        low += Math.min(14, newCount * 2);
        high += Math.min(24, newCount * 4);
      }
    }
    if (familiarCount > 0) {
      // Familiar/revisited evidence is lighter than first-pass inspection; avoid double counting
      // the primary familiar reading band when readingDemand === "familiar".
      var effectiveFamiliar = readingDemand === "familiar" ? Math.max(0, familiarCount - 1) : familiarCount;
      low += Math.min(6, effectiveFamiliar);
      high += Math.min(10, effectiveFamiliar * 2);
    }
    return band(low, high);
  }

  function decisionsBand(selectionControlCount, activityType) {
    if (!(selectionControlCount > 0)) return band(0, 0);
    var effectiveCount =
      activityType === "mcq" ? Math.max(0, selectionControlCount - 1) : selectionControlCount;
    if (effectiveCount <= 0) return band(0, 0);
    return band(Math.min(10, effectiveCount), Math.min(18, effectiveCount * 2));
  }

  function workedExamplesBand(workedExampleCount) {
    if (!(workedExampleCount > 0)) return band(0, 0);
    return band(Math.min(10, workedExampleCount * 2), Math.min(18, workedExampleCount * 4));
  }

  var COMPONENT_DRIVER_LABELS = [
    ["reading", "reading/framing"],
    ["evidenceInspection", "evidence inspection"],
    ["workedExamples", "worked examples"],
    ["decisions", "structured decisions"],
    ["reasoning", "reasoning/judgement"],
    ["production", "response construction"],
    ["feedback", "feedback engagement"],
    ["revision", "post-feedback revision"]
  ];

  function summarizeDemandDrivers(components) {
    var comp = components && typeof components === "object" ? components : {};
    var drivers = [];
    COMPONENT_DRIVER_LABELS.forEach(function (entry) {
      var key = entry[0];
      var label = entry[1];
      var b = comp[key];
      if (b && b.high > 0) {
        drivers.push({
          key: key,
          label: label,
          low: b.low,
          high: b.high
        });
      }
    });
    drivers.sort(function (a, b) {
      return b.high - a.high || b.low - a.low;
    });
    return drivers;
  }

  function hasMeaningfulDemandSignals(input, normalized) {
    if (normalized.wordBand) return true;
    if (normalized.readingDemand !== "unknown" && normalized.readingDemand !== "none") {
      return true;
    }
    if (normalized.reasoningDemand !== "unknown") return true;
    if (normalized.activityType !== "unknown") return true;
    if (normalized.requiresFeedback || normalized.requiresRevision) return true;
    if (
      normalized.newEvidenceCount > 0 ||
      normalized.familiarEvidenceCount > 0 ||
      normalized.selectionControlCount > 0 ||
      normalized.workedExampleCount > 0 ||
      normalized.constructedResponseCount > 0 ||
      normalized.checklistCriterionCount > 0
    ) {
      return true;
    }
    return !!(input && (input.evidenceReview || input.dossierReview));
  }

  /**
   * Estimate indicative learner effort for one activity-like unit.
   *
   * @param {object} input
   * @param {string} [input.activityType]
   * @param {number|null} [input.declaredDurationMinutes]
   * @param {number|object|string|null} [input.suggestedLengthWords]
   * @param {string} [input.reasoningDemand]
   * @param {string} [input.readingDemand]
   * @param {boolean} [input.requiresFeedbackInterpretation]
   * @param {boolean} [input.requiresRevision]
   * @param {boolean} [input.evidenceReview]
   * @param {boolean} [input.dossierReview]
   * @param {boolean} [input.familiarMaterial] purposeful revisit of already-engaged material
   * @param {number} [input.newEvidenceCount] unfamiliar inspectable datasets/tables/charts
   * @param {number} [input.familiarEvidenceCount] revisited/familiar datasets/tables
   * @param {number} [input.selectionControlCount] expected discrete selection/decision controls
   * @param {number} [input.workedExampleCount] expected pre-attempt worked examples
   * @param {number} [input.constructedResponseCount] distinct constructed-response surfaces
   * @param {number} [input.checklistCriterionCount] diagnostic review criteria count
   * @param {number} [input.optionalSupportCount] non-mandatory support/hints (0 min added)
   * @returns {object} feasibility result (does not mutate input)
   */
  function estimateActivityWorkload(input) {
    var src = input && typeof input === "object" && !Array.isArray(input) ? input : {};
    var activityType = normalizeActivityType(src.activityType);
    var wordBand = parseSuggestedLengthWords(src.suggestedLengthWords);
    var reasoningDemand = normalizeReasoningDemand(src.reasoningDemand, activityType);
    var readingDemand = normalizeReadingDemand(src.readingDemand, activityType, {
      evidenceReview: src.evidenceReview === true,
      dossierReview: src.dossierReview === true,
      familiarMaterial: src.familiarMaterial === true
    });
    var requiresFeedback = src.requiresFeedbackInterpretation === true;
    var requiresRevision = src.requiresRevision === true;
    var declaredDurationMinutes = parseFiniteMinutes(src.declaredDurationMinutes);
    var newEvidenceCount = parseNonNegativeCount(
      src.newEvidenceCount != null ? src.newEvidenceCount : src.evidenceInspectionCount
    );
    var familiarEvidenceCount = parseNonNegativeCount(src.familiarEvidenceCount);
    var selectionControlCount = parseNonNegativeCount(src.selectionControlCount);
    var workedExampleCount = parseNonNegativeCount(src.workedExampleCount);
    var constructedResponseCount = parseNonNegativeCount(src.constructedResponseCount);
    var checklistCriterionCount = parseNonNegativeCount(src.checklistCriterionCount);
    var optionalSupportCount = parseNonNegativeCount(src.optionalSupportCount);

    var normalized = {
      activityType: activityType,
      wordBand: wordBand,
      reasoningDemand: reasoningDemand,
      readingDemand: readingDemand,
      requiresFeedback: requiresFeedback,
      requiresRevision: requiresRevision,
      newEvidenceCount: newEvidenceCount,
      familiarEvidenceCount: familiarEvidenceCount,
      selectionControlCount: selectionControlCount,
      workedExampleCount: workedExampleCount,
      constructedResponseCount: constructedResponseCount,
      checklistCriterionCount: checklistCriterionCount
    };

    var factors = [];
    var components = {
      reading: band(0, 0),
      evidenceInspection: band(0, 0),
      workedExamples: band(0, 0),
      decisions: band(0, 0),
      reasoning: band(0, 0),
      production: band(0, 0),
      feedback: band(0, 0),
      revision: band(0, 0)
    };

    if (!hasMeaningfulDemandSignals(src, normalized)) {
      return {
        schemaVersion: SCHEMA_VERSION,
        sufficientEvidence: false,
        indicativeEffortMinutes: null,
        declaredDurationMinutes: declaredDurationMinutes,
        durationStatus: declaredDurationMinutes != null ? "available" : "unavailable",
        plausiblyInsufficient: null,
        demandDrivers: [],
        factors: [
          "Insufficient demand evidence: provide activity type, response length, reading demand, or reasoning demand."
        ],
        explanation:
          "No meaningful workload estimate is possible from the supplied evidence. Declared duration was not used to invent demand.",
        components: components
      };
    }

    // Reading / evidence review
    if (readingDemand !== "unknown") {
      components.reading = READING_BANDS[readingDemand];
      if (components.reading.high > 0) {
        factors.push(
          "Reading/evidence review treated as " +
            readingDemand +
            " (" +
            components.reading.low +
            "–" +
            components.reading.high +
            " min)."
        );
      } else {
        factors.push("No material reading or evidence-review demand indicated.");
      }
    } else {
      factors.push("Reading demand unspecified; no reading overhead invented.");
    }

    components.evidenceInspection = evidenceInspectionBand(
      newEvidenceCount,
      familiarEvidenceCount,
      readingDemand
    );
    if (components.evidenceInspection.high > 0) {
      factors.push(
        "Structured evidence inspection (" +
          newEvidenceCount +
          " unfamiliar, " +
          familiarEvidenceCount +
          " familiar/revisited) adds " +
          components.evidenceInspection.low +
          "–" +
          components.evidenceInspection.high +
          " min."
      );
    }

    components.workedExamples = workedExamplesBand(workedExampleCount);
    if (components.workedExamples.high > 0) {
      factors.push(
        "Worked examples (" +
          workedExampleCount +
          ") add " +
          components.workedExamples.low +
          "–" +
          components.workedExamples.high +
          " min."
      );
    }

    components.decisions = decisionsBand(selectionControlCount, activityType);
    if (components.decisions.high > 0) {
      factors.push(
        "Structured decision controls (" +
          selectionControlCount +
          ") add " +
          components.decisions.low +
          "–" +
          components.decisions.high +
          " min."
      );
    }

    // Reasoning / judgement
    if (reasoningDemand !== "unknown") {
      components.reasoning = REASONING_BANDS[reasoningDemand];
      factors.push(
        "Reasoning demand treated as " +
          reasoningDemand +
          " (" +
          components.reasoning.low +
          "–" +
          components.reasoning.high +
          " min)."
      );
    } else {
      factors.push("Reasoning demand unspecified; no thinking overhead invented.");
    }

    // Response production
    var substantialWriting = false;
    if (activityType === "mcq") {
      components.production = mcqProductionBand();
      factors.push("Multiple-choice / short selection: minimal response-production overhead.");
    } else if (activityType === "mathematical_problem") {
      components.production = mathematicalProductionBand();
      factors.push(
        "Focused mathematical problem work estimated at " +
          components.production.low +
          "–" +
          components.production.high +
          " min independent effort."
      );
    } else if (activityType === "interactive_judgement" && !wordBand) {
      components.production = interactiveJudgementProductionBand();
      factors.push("Short interactive judgement without extended writing length.");
    } else if (wordBand) {
      var writeReasoning = reasoningDemand === "unknown" ? "analysis" : reasoningDemand;
      components.production = writingProductionBand(wordBand, writeReasoning);
      substantialWriting = wordBand.max >= 120;
      if (constructedResponseCount > 1) {
        var extraTemplates = Math.min(3, constructedResponseCount - 1);
        components.production = addBands(
          components.production,
          band(extraTemplates * 3, extraTemplates * 6)
        );
      }
      factors.push(
        "Response length about " +
          wordBand.min +
          "–" +
          wordBand.max +
          " words informs production (" +
          components.production.low +
          "–" +
          components.production.high +
          " min); word count is not treated as a complete measure of demand."
      );
    } else {
      var implied = typeImpliedProductionFloor(activityType, reasoningDemand);
      if (implied) {
        components.production = implied.band;
        substantialWriting = true;
        factors.push(implied.factor);
      } else if (activityType === "constructed_response") {
        var crExtra = constructedResponseCount > 1 ? Math.min(3, constructedResponseCount - 1) : 0;
        components.production = band(6 + crExtra * 3, 14 + crExtra * 6);
        factors.push(
          "Constructed response without length: conservative moderate production floor only."
        );
      } else if (constructedResponseCount > 0) {
        var unbandedExtra = Math.min(3, constructedResponseCount - 1);
        components.production = band(4 + unbandedExtra * 3, 9 + unbandedExtra * 6);
        factors.push(
          "Constructed-response workspace(s) (" +
            constructedResponseCount +
            ") without explicit word band estimated conservatively (" +
            components.production.low +
            "–" +
            components.production.high +
            " min)."
        );
      } else {
        factors.push("No response-production length or type floor applied.");
      }
    }

    components.feedback = feedbackBand(requiresFeedback, checklistCriterionCount);
    if (components.feedback.high > 0) {
      factors.push(
        "Feedback interpretation overhead included (" +
          components.feedback.low +
          "–" +
          components.feedback.high +
          " min" +
          (checklistCriterionCount > 0 ? "; " + checklistCriterionCount + " criteria" : "") +
          ")."
      );
    }

    components.revision = revisionBand(requiresRevision, substantialWriting);
    if (requiresRevision) {
      factors.push(
        "Revision overhead included (" +
          components.revision.low +
          "–" +
          components.revision.high +
          " min)."
      );
    }

    if (optionalSupportCount > 0) {
      factors.push(
        "Optional support/extensions (" +
          optionalSupportCount +
          ") noted as non-mandatory and excluded from required workload."
      );
    }

    var total = band(0, 0);
    total = addBands(total, components.reading);
    total = addBands(total, components.evidenceInspection);
    total = addBands(total, components.workedExamples);
    total = addBands(total, components.decisions);
    total = addBands(total, components.reasoning);
    total = addBands(total, components.production);
    total = addBands(total, components.feedback);
    total = addBands(total, components.revision);

    // Guard against inverted empty totals when only "none" reading was known.
    if (total.high < total.low) {
      total = band(total.low, total.low);
    }
    if (total.high === 0 && total.low === 0) {
      // e.g. reading none + unknown everything else already filtered; keep explicit.
      factors.push("Computed demand totalled zero; treat as insufficient for feasibility comparison.");
      return {
        schemaVersion: SCHEMA_VERSION,
        sufficientEvidence: false,
        indicativeEffortMinutes: total,
        declaredDurationMinutes: declaredDurationMinutes,
        durationStatus: declaredDurationMinutes != null ? "available" : "unavailable",
        plausiblyInsufficient: null,
        demandDrivers: [],
        factors: factors,
        explanation:
          "Demand signals were present but resolved to no estimable effort. Declared duration was not used to invent workload.",
        components: components
      };
    }

    var plausiblyInsufficient = null;
    if (declaredDurationMinutes != null) {
      // Declared time is plausibly insufficient when it falls below the low
      // end of the indicative range. Equality at the low end is treated as
      // borderline-feasible, not overload.
      plausiblyInsufficient = declaredDurationMinutes < total.low;
      factors.push(
        plausiblyInsufficient
          ? "Declared " +
              declaredDurationMinutes +
              " min is below the indicative lower bound of " +
              total.low +
              " min."
          : "Declared " +
              declaredDurationMinutes +
              " min meets or exceeds the indicative lower bound of " +
              total.low +
              " min."
      );
    } else {
      factors.push("Declared duration is unavailable; feasibility comparison could not be completed.");
    }

    var demandDrivers = summarizeDemandDrivers(components);
    var explanation =
      "Indicative learner effort about " +
      total.low +
      "–" +
      total.high +
      " minutes" +
      (declaredDurationMinutes != null
        ? "; declared " +
          declaredDurationMinutes +
          " min is " +
          (plausiblyInsufficient ? "plausibly insufficient" : "not flagged as insufficient")
        : "; duration unavailable") +
      ". Ranges are coarse planning aids, not measured completion times.";

    return {
      schemaVersion: SCHEMA_VERSION,
      sufficientEvidence: true,
      indicativeEffortMinutes: total,
      declaredDurationMinutes: declaredDurationMinutes,
      durationStatus: declaredDurationMinutes != null ? "available" : "unavailable",
      plausiblyInsufficient: plausiblyInsufficient,
      demandDrivers: demandDrivers,
      factors: factors,
      explanation: explanation,
      components: components
    };
  }

  /**
   * Pure cumulative comparison across component estimates of a single product artefact
   * (never used to invent summed Learning Journey prediction totals).
   */
  function assessCumulativeWorkload(estimates, authoritativeDurationMinutes, options) {
    var list = Array.isArray(estimates) ? estimates : [];
    var opts = options && typeof options === "object" ? options : {};
    var overheadBand =
      opts.overheadBand &&
      typeof opts.overheadBand.low === "number" &&
      typeof opts.overheadBand.high === "number"
        ? opts.overheadBand
        : band(0, 0);
    var authMinutes = parseFiniteMinutes(authoritativeDurationMinutes);
    var aggregateComponents = {
      reading: band(overheadBand.low, overheadBand.high),
      evidenceInspection: band(0, 0),
      workedExamples: band(0, 0),
      decisions: band(0, 0),
      reasoning: band(0, 0),
      production: band(0, 0),
      feedback: band(0, 0),
      revision: band(0, 0)
    };
    var low = overheadBand.low;
    var high = overheadBand.high;
    var count = 0;
    list.forEach(function (est) {
      if (!est || !est.sufficientEvidence || !est.indicativeEffortMinutes) return;
      count += 1;
      low += est.indicativeEffortMinutes.low;
      high += est.indicativeEffortMinutes.high;
      if (est.components) {
        Object.keys(aggregateComponents).forEach(function (k) {
          var b = est.components[k];
          if (b && typeof b.low === "number" && typeof b.high === "number") {
            aggregateComponents[k] = addBands(aggregateComponents[k], b);
          }
        });
      }
    });
    if (count === 0) {
      return {
        sufficientEvidence: false,
        unitCount: 0,
        authoritativeDurationMinutes: authMinutes,
        durationStatus: authMinutes != null ? "available" : "unavailable",
        cumulativeIndicativeMinutes: null,
        plausiblyInsufficient: null,
        overBudgetByMinutes: null,
        primaryDrivers: [],
        components: aggregateComponents
      };
    }
    var range = band(low, high);
    var plausiblyInsufficient = authMinutes != null ? authMinutes < range.low : null;
    var overBudgetByMinutes =
      plausiblyInsufficient === true ? Math.max(0, range.low - authMinutes) : 0;
    return {
      sufficientEvidence: true,
      unitCount: count,
      authoritativeDurationMinutes: authMinutes,
      durationStatus: authMinutes != null ? "available" : "unavailable",
      cumulativeIndicativeMinutes: range,
      plausiblyInsufficient: plausiblyInsufficient,
      overBudgetByMinutes: plausiblyInsufficient === null ? null : overBudgetByMinutes,
      primaryDrivers: summarizeDemandDrivers(aggregateComponents),
      components: aggregateComponents
    };
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    READING_BANDS: READING_BANDS,
    estimateActivityWorkload: estimateActivityWorkload,
    assessCumulativeWorkload: assessCumulativeWorkload,
    summarizeDemandDrivers: summarizeDemandDrivers,
    // Test/helpers (pure)
    parseSuggestedLengthWords: parseSuggestedLengthWords,
    normalizeActivityType: normalizeActivityType,
    normalizeReadingDemand: normalizeReadingDemand
  };
});
