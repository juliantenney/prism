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

  /**
   * Extract only current-commission obligation text for demand inference.
   * Excludes journey_context_text (prior/subsequent commissions), dependencies,
   * and embedded COMPONENT_LEARNING_OUTCOMES metadata blocks so prior/future
   * learning descriptions cannot contaminate this commission's workload.
   */
  function stripEmbeddedOutcomeBlock(text) {
    return String(text || "").replace(
      /<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>[\s\S]*?<<<COMPONENT_LEARNING_OUTCOMES_END>>>/gi,
      " "
    );
  }

  /**
   * Remove prerequisite assumptions, explicit prohibitions/exclusions,
   * separately-commissioned/deferred obligations, and learner-proposed
   * hypothetical evidence mentions so negated or non-current items never
   * generate positive workload signals.
   */
  function stripNonCurrentClauses(rawText) {
    var src = stripEmbeddedOutcomeBlock(rawText);
    if (!src.trim()) return "";
    var sentences = src.split(/(?<=[.!?])\s+|\n+/);
    var kept = [];
    for (var i = 0; i < sentences.length; i += 1) {
      var s = asTrimmed(sentences[i]);
      if (!s) continue;
      // Prior-learning / prerequisite descriptions (not current learner obligations)
      if (
        /^(?:assume\s+learners|learners\s+have\s+(?:already|previously)|learners\s+bring|learners\s+should\s+therefore\s+bring|commission\s+\w+\s+(?:established|modelled|modeled|introduced|extended|required))\b/i.test(
          s
        )
      ) {
        continue;
      }
      // Whole-sentence prohibitions / exclusions
      if (
        /^(?:do\s+not|avoid|never|no\s+(?:persistent|individual|separate|new|additional|written|recurring|confirmed))\b/i.test(
          s
        )
      ) {
        continue;
      }
      // Obligations explicitly deferred to another component
      if (
        /\b(?:commissioned\s+separately\s+in|belongs?\s+to\s+(?:the\s+)?(?:later|subsequent|next)|reserved\s+for\s+(?:later|subsequent))\b/i.test(
          s
        )
      ) {
        continue;
      }
      // Inline contrastive exclusions ("rather than ...", "instead of ...", "without ...")
      s = s.replace(/\b(?:rather\s+than|instead\s+of|without)\s+[^.;,]+/gi, " ");
      // Inline negations ("do not display/introduce/require/release ...", "does not require ...")
      s = s.replace(
        /\b(?:do\s+not|does\s+not|must\s+not|cannot|never)\s+(?:require|introduce|display|release|reveal|provide|include|add|present|disclose|claim|analyse|analyze|supply|expect)\b[^.;]+/gi,
        " "
      );
      // Explicit "no <excluded demand>" noun phrases
      s = s.replace(
        /\bno\s+(?:substantial\s+)?(?:new|fresh|additional|unfamiliar|persistent|separate)\s+(?:dataset|datasets|evidence|table|tables|written|response|artefact|artifact|reflection|reflective\s+task)[^.;,]*/gi,
        " "
      );
      // Explicit "not a separate reflection / unrelated writing exercise"
      s = s.replace(/\bnot\s+a\s+(?:separate\s+)?(?:reflection|reflective\s+task|unrelated\s+writing\s+exercise)\b/gi, " ");
      // Learner-proposed hypothetical future evidence (reasoning topic, not an inspectable dataset)
      s = s.replace(
        /\b(?:propose|proposal\s+for|identify|which)\s+additional\s+(?:evidence|information)\b[^.;,]*/gi,
        " "
      );
      s = s.replace(/\b(?:hypothetical\s+evidence\s+conditions|explicitly\s+hypothetical\s+examples)\b/gi, " ");
      s = s.replace(/\s+/g, " ").trim();
      if (s) kept.push(s);
    }
    return kept.join(" ");
  }

  function extractCurrentObligationText(commission) {
    if (!commission || typeof commission !== "object") return "";
    var spec = asTrimmed(commission.specification_text || commission.specificationText);
    var title = asTrimmed(commission.title);
    // Use specification_text (cleaned of non-current/negated clauses) plus title.
    // Fall back to journey_context_text only if specification_text is completely absent.
    var cleanedSpec = stripNonCurrentClauses(spec);
    if (cleanedSpec) {
      return [title, cleanedSpec].filter(Boolean).join("\n");
    }
    var fallbackCtx = stripNonCurrentClauses(
      commission.journey_context_text || commission.journeyContextText
    );
    return [title, fallbackCtx].filter(Boolean).join("\n");
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

  function detectConstructedResponse(text, wordBand) {
    if (wordBand) return true;
    return /\b(declare\s+elicitation_id|learner[- ]authored\s+(?:text\s+)?(?:response|judgement|judgment|explanation|evaluation)|written\s+(?:advisory|evaluation|response|argument|briefing|judgement|judgment|analysis|recommendation|report)|advisory\s+(?:judgement|judgment|note|briefing|memo|recommendation)|integrated\s+written\s+(?:judgement|judgment|advisory|response|evaluation|analysis)|brief\s+(?:written\s+)?(?:note|justification|rationale)|construct\s+a\s+coherent\s+written|produce\s+a\s+refined\s+version\s+of\s+the\s+substantive\s+judgement)\b/i.test(
      String(text || "")
    );
  }

  function looksLikeBriefJustification(text) {
    return /\b(brief\s+(?:note|justification|rationale|response|explanation|jotting)|short\s+(?:note|justification|response)|concise\s+(?:note|justification|response)|1\s*[-–—]\s*2\s+sentences?|one\s+or\s+two\s+sentences?|one\s+sentence)\b/i.test(
      String(text || "")
    );
  }

  function detectSubstantialWrittenDeliverable(text, wordBand) {
    if (wordBand && wordBand.max >= 120) return true;
    if (wordBand && wordBand.max < 120) return false;
    var src = String(text || "");
    if (looksLikeBriefJustification(src)) return false;
    return /\b(advisory\s+(?:judgement|judgment|note|briefing|memo|recommendation)|integrated\s+written\s+(?:advisory|judgement|judgment|evaluation|analysis|recommendation)|written\s+(?:advisory\s+(?:judgement|judgment|note|briefing)|briefing|report|recommendation)|structured\s+written\s+(?:judgement|judgment|evaluation|analysis))\b/i.test(
      src
    );
  }

  function detectDistinctReasoningMoves(text) {
    var src = String(text || "");
    var moves = [];
    if (
      /\b(interpret\w*\s+(?:the\s+)?(?:paired\s+observations?|data|table|observations?|pattern|evidence)|paired\s+observations?)\b/i.test(
        src
      )
    ) {
      moves.push("evidence_interpretation");
    }
    if (
      /\b(direct\s*,?\s*reverse\s*(?:,?\s*and|&)\s*common[- ]cause|competing\s+(?:causal\s+)?explanations?|alternative\s+explanations?|confound\w*|reverse\s+causal)/i.test(
        src
      )
    ) {
      moves.push("competing_explanations");
    }
    if (
      /\b(evaluat\w*\s+(?:the\s+)?(?:evidence\s+)?limitations?|limitations?\s+of\s+(?:the\s+)?evidence|what\s+the\s+evidence\s+cannot|caveats?\s+and\s+limitations?)\b/i.test(
        src
      )
    ) {
      moves.push("limitation_evaluation");
    }
    if (
      /\b(advisory\s+(?:judgement|judgment|note|briefing|recommendation)|integrated\s+(?:written\s+)?(?:judgement|judgment|advisory|recommendation)|weigh\w*\s+the\s+evidence)\b/i.test(
        src
      )
    ) {
      moves.push("advisory_synthesis");
    }
    return moves;
  }

  function detectConciseRetrieval(text, hasConstructedResponse) {
    if (hasConstructedResponse) return false;
    return /\b(retrieval\s+practice|spaced\s+retrieval|begin\s+with\s+retrieval)\b/i.test(
      String(text || "")
    );
  }

  function detectBoundedSelectedResponse(text, productId, hasConstructedResponse) {
    if (hasConstructedResponse) return false;
    var src = String(text || "");
    if (
      /\b(mcq|multiple[- ]choice|auto[- ]?checkable|selected[- ]response|concise\s+questions)\b/i.test(
        src
      )
    ) {
      return true;
    }
    var product = asTrimmed(productId).toLowerCase();
    if (
      product === "expository" &&
      /\b(?:brief|embedded|guided)\s+(?:prediction|interpretation|reasoning|judgements?|checks?)\b/i.test(
        src
      )
    ) {
      return true;
    }
    return false;
  }

  function inferReasoningDemand(text, wordBand, options) {
    var src = String(text || "");
    var opts = options && typeof options === "object" ? options : {};
    var isConciseRetrieval = opts.isConciseRetrieval === true;
    var isBoundedSelected = opts.isBoundedSelectedResponse === true;
    var product = asTrimmed(opts.productId).toLowerCase();

    // Concise retrieval practice: support recall and comprehension tiers without
    // inflating conceptual-discrimination retrieval checks to full essay analysis.
    if (isConciseRetrieval) {
      if (
        /\b(discriminat|distinguish|apply|interpret|confounding|reverse\s+causality|compar|contrast)\b/i.test(
          src
        )
      ) {
        return "comprehension";
      }
      return "recall";
    }

    // Bounded selected-response / brief embedded checks: cognitive sophistication
    // is real, but response-selection workload is bounded (application for practice
    // discrimination checks; comprehension for brief embedded expository checks).
    if (isBoundedSelected) {
      if (product === "expository") {
        return "comprehension";
      }
      if (
        /\b(discriminat|classify|distinguish|contrasting\s+statements|justify|justification|apply|interpret|compar|contrast|analys|evaluat)\b/i.test(
          src
        )
      ) {
        return "application";
      }
      if (/\b(recall|memoriz|memoris|identify\s+definitions?)\b/i.test(src)) {
        return "recall";
      }
      return "comprehension";
    }

    if (/\b(recommend|recommendation|evaluat\w*|criteria|trade-?off)\b/i.test(src)) {
      return "evaluation";
    }
    if (/\b(argument\w*|philosophical|defend\w*)\b/i.test(src)) {
      return "argument";
    }
    if (/\b(compar\w*|analys\w*|reconsider\w*|diagnos\w*|prioritis\w*|prioritiz\w*|contrast\w*|calculat\w*|interpret\w*|reconcil\w*)\b/i.test(src)) {
      return "analysis";
    }
    if (/\b(appl(?:y|ies|ying|ication)|justif\w*|compute|computing)\b/i.test(src)) {
      return "application";
    }
    if (/\b(explain|describe|comprehend|understand|summarise|summarize)\b/i.test(src)) {
      return "comprehension";
    }
    if (/\b(recall|retrieve|memoriz|memoris)\b/i.test(src)) {
      return "recall";
    }
    if (wordBand) return "analysis";
    return "unknown";
  }

  function looksLikeFamiliarMaterial(text) {
    return /\b(revisit|revisiting|already (?:read|reviewed|examined|encountered|engaged)|earlier (?:evidence|judgement|judgment|work|response|material|commission)|bring[- ]forward|prior (?:work|evidence|judgement|judgment)|(?:now-)?familiar (?:evidence|material|dataset|datasets|case)|previously (?:reviewed|examined|encountered|engaged)|from (?:your|the) earlier)\b/i.test(
      String(text || "")
    );
  }

  function inferEvidenceSignals(text, readingDemand) {
    var src = String(text || "");
    var newEvidenceCount = 0;
    var familiarEvidenceCount = 0;
    if (
      /\b(?:new|fresh|additional|unfamiliar|previously\s+unseen|newly\s+released|first[- ]pass\s+unfamiliar)\s+(?:synthetic\s+)?(?:supplementary\s+)?(?:dataset|datasets|data[- ]table|tables|evidence|chart|scatterplot|source|observations?)/i.test(
        src
      ) ||
      /\b(?:two|three|four|\d{1,2})\s+(?:unfamiliar|new|fresh)\s+(?:synthetic\s+)?(?:datasets?|tables?|sources?|charts?)\b/i.test(
        src
      )
    ) {
      var explicitCount = src.match(
        /\b(\d{1,2})\s+(?:new|fresh|additional|unfamiliar)\s+(?:synthetic\s+)?(?:datasets?|tables?|sources?|charts?)\b/i
      );
      if (explicitCount) {
        newEvidenceCount = Math.min(8, Number(explicitCount[1]));
      } else if (/\btwo\s+(?:unfamiliar|new|fresh)\s+(?:synthetic\s+)?(?:datasets?|tables?|sources?|charts?)\b/i.test(src)) {
        newEvidenceCount = 2;
      } else {
        newEvidenceCount = 1;
      }
    } else if (
      readingDemand !== "familiar" &&
      readingDemand !== "dossier" &&
      /\b(?:dataset|data[- ]table|scatterplot|paired\s+observations?|observation\s+(?:set|table))\b/i.test(
        src
      )
    ) {
      var tableCount = src.match(/\b(\d{1,2})\s+(?:datasets?|data[- ]tables?|scatterplots?)\b/i);
      newEvidenceCount = tableCount ? Math.min(8, Number(tableCount[1])) : 1;
    }
    if (readingDemand === "familiar" && newEvidenceCount > 0) {
      // Mixed commission: revisiting earlier material while introducing new datasets.
      familiarEvidenceCount = 1;
    }
    // Do not count "worked examples" mentioned only as withheld pre-attempt reminders in retrieval-first sequences.
    var workedSrc = src.replace(
      /\bbegin\s+with\s+retrieval\s+before\s+presenting\b[^.;]*\bworked\s+examples?\b[^.;]*/gi,
      " "
    );
    var workedMatch = workedSrc.match(/\b(\d{1,2})\s+worked\s+examples?\b/i);
    var workedExampleCount = workedMatch
      ? Math.min(4, Number(workedMatch[1]))
      : /\bworked\s+(?:example|demonstration)\b/i.test(workedSrc)
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

  function inferReadingDemand(text, options) {
    var src = String(text || "");
    var opts = options && typeof options === "object" ? options : {};
    if (looksLikeFamiliarMaterial(src)) {
      return "familiar";
    }
    if (/\b(dossier|evidence pack|complete (?:fictional )?evidence|full (?:set of )?evidence)\b/i.test(src)) {
      return "dossier";
    }
    if (
      /\b(read (?:the|your)|review (?:the|your)|contested sources|source material|research (?:account|study)|canonical (?:dataset|observations|evidence)|paired\s+observations?)\b/i.test(
        src
      )
    ) {
      return "moderate";
    }
    if (opts.isConciseRetrieval === true) {
      return "brief";
    }
    return "unknown";
  }

  function inferActivityType(text, productId, wordBand, reasoningDemand, options) {
    var product = asTrimmed(productId).toLowerCase();
    var opts = options && typeof options === "object" ? options : {};
    if (
      (opts.isConciseRetrieval === true || opts.isBoundedSelectedResponse === true) &&
      !wordBand
    ) {
      return "mcq";
    }
    if (/\b(mcq|multiple[- ]choice|auto[- ]?checkable|selected[- ]response)\b/i.test(text) && !wordBand) {
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
    return /\b(feedback|self[- ]?evaluat|self[- ]?check|reasoning\s+review|review\s+(?:their|your)\s+reasoning|interpret (?:the )?feedback|after feedback)\b/i.test(
      text
    );
  }

  function detectRevision(text) {
    return /\b(then revise|revise (?:your|the)|revised\s+(?:causal\s+)?(?:judgement|judgment|response|explanation)|revision|rewrite|refine(?:d)?\s+(?:version|judgement|judgment|response|reasoning)|after feedback.{0,40}revise)\b/i.test(
      text
    );
  }

  function detectRevisionIsPrimaryPerformance(text) {
    return /\b(revision\s+itself\s+is\s+the\s+learning\s+performance|revision\s+of\s+the\s+existing|revised\s+(?:causal\s+)?(?:judgement|judgment)|refined\s+(?:version|judgement|judgment))\b/i.test(
      String(text || "")
    );
  }

  function detectIntegratedFeedbackSelfEvaluation(text, revisionIsPrimary) {
    if (!revisionIsPrimary) return false;
    return /\b(apply\s+(?:these\s+)?criteria\s+to\s+(?:their|your)\s+own|evaluating\s+(?:the\s+learner'?s\s+own|worked\s+judgements)|self[- ]?evaluat\w*\s+and\s+refin)/i.test(
      String(text || "")
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
    var text = extractCurrentObligationText(commission);
    var wordBand = extractWordBand(text);
    var productId = asTrimmed(commission.product_id || commission.productId);
    var hasConstructedResponse = detectConstructedResponse(text, wordBand);
    var isConciseRetrieval = detectConciseRetrieval(text, hasConstructedResponse);
    var isBoundedSelectedResponse = detectBoundedSelectedResponse(
      text,
      productId,
      hasConstructedResponse
    );
    var reasoningDemand = inferReasoningDemand(text, !!wordBand, {
      isConciseRetrieval: isConciseRetrieval,
      isBoundedSelectedResponse: isBoundedSelectedResponse,
      productId: productId
    });
    var readingDemand = inferReadingDemand(text, {
      isConciseRetrieval: isConciseRetrieval
    });
    var activityType = inferActivityType(text, productId, wordBand, reasoningDemand, {
      isConciseRetrieval: isConciseRetrieval,
      isBoundedSelectedResponse: isBoundedSelectedResponse
    });
    var durationResolution = resolveCommissionAllocatedMinutes(commission, options);
    var declaredDurationMinutes = durationResolution.minutes;
    var requiresFeedbackInterpretation = detectFeedbackInterpretation(text);
    var requiresRevision = detectRevision(text);
    var revisionIsPrimary = requiresRevision && detectRevisionIsPrimaryPerformance(text);
    var familiarMaterial = readingDemand === "familiar";
    var evidenceSignals = inferEvidenceSignals(text, readingDemand);
    var distinctReasoningMoves = detectDistinctReasoningMoves(text);
    var substantialWritten = detectSubstantialWrittenDeliverable(text, wordBand);
    var constructedResponseCount =
      !wordBand && hasConstructedResponse && !revisionIsPrimary ? 1 : 0;
    if (
      activityType === "unknown" &&
      substantialWritten &&
      !wordBand &&
      !revisionIsPrimary &&
      constructedResponseCount > 0
    ) {
      activityType = "constructed_response";
    }
    var integratedReasoningProduction =
      !substantialWritten &&
      (constructedResponseCount > 0 || (!!wordBand && wordBand.max < 120)) &&
      activityType !== "mcq" &&
      reasoningDemand !== "unknown";
    var integratedRevisionAsPerformance = revisionIsPrimary;
    var integratedFeedbackSelfEvaluation =
      requiresFeedbackInterpretation &&
      detectIntegratedFeedbackSelfEvaluation(text, revisionIsPrimary);
    var integratedEvidenceInspection =
      familiarMaterial && evidenceSignals.newEvidenceCount > 0;

    var hasDemandSignal =
      !!wordBand ||
      constructedResponseCount > 0 ||
      revisionIsPrimary ||
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
    if (constructedResponseCount > 0) {
      estimatorInput.constructedResponseCount = constructedResponseCount;
    }
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
    if (integratedReasoningProduction) {
      estimatorInput.integratedReasoningProduction = true;
    }
    if (integratedRevisionAsPerformance) {
      estimatorInput.integratedRevisionAsPerformance = true;
    }
    if (integratedFeedbackSelfEvaluation) {
      estimatorInput.integratedFeedbackSelfEvaluation = true;
    }
    if (integratedEvidenceInspection) {
      estimatorInput.integratedEvidenceInspection = true;
    }

    return {
      commissionId: asTrimmed(commission.commission_id) || null,
      title: commissionLabel(commission),
      productId: productId || null,
      allocatedMinutes: declaredDurationMinutes,
      durationSource: durationResolution.source,
      durationStatus: durationResolution.durationStatus,
      input: estimatorInput,
      metadata: {
        distinctReasoningMoves: distinctReasoningMoves,
        distinctReasoningDemandCount: distinctReasoningMoves.length,
        substantialWrittenDeliverable: substantialWritten
      }
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
    var insufficientEvidenceCommissionIds = [];
    var insufficientCount = 0;
    var assessedCount = 0;

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
        insufficientEvidence: !mapped,
        feasibilityStatus: !mapped ? "insufficient_evidence" : "pending"
      };
      if (allocated != null) {
        allocatedKnown.push(allocated);
      } else {
        unavailableCommissionIds.push(cid);
      }

      if (!mapped || !estimator || typeof estimator.estimateActivityWorkload !== "function") {
        if (!mapped) {
          insufficientCount += 1;
          insufficientEvidenceCommissionIds.push(cid);
        }
        row.feasibilityStatus = "insufficient_evidence";
        commissionRows.push(row);
        findings.push(row);
        return;
      }

      var estimate = estimator.estimateActivityWorkload(mapped.input);
      row.estimate = estimate;
      if (!estimate || estimate.sufficientEvidence !== true) {
        row.insufficientEvidence = true;
        row.feasibilityStatus = "insufficient_evidence";
        insufficientCount += 1;
        insufficientEvidenceCommissionIds.push(cid);
      } else if (estimate.durationStatus === "unavailable" || allocated == null) {
        row.feasibilityStatus = "duration_unavailable";
      } else if (estimate.plausiblyInsufficient === true) {
        row.feasibilityStatus = "plausibly_insufficient";
        assessedCount += 1;
      } else {
        row.feasibilityStatus = "assessed_feasible";
        assessedCount += 1;
      }
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
        assessedCount: assessedCount,
        insufficientEvidenceCount: insufficientCount,
        insufficientEvidenceCommissionIds: insufficientEvidenceCommissionIds,
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
