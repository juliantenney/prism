/**
 * Sprint 104 — Situated Task → workload feasibility adapter.
 *
 * Maps a concrete authored Situated Task Design Page (Stage 5) into the shared
 * Sprint 100A workload feasibility estimator input contract and formats
 * non-blocking author-facing advisory warnings against the workflow's
 * authoritative inherited duration.
 *
 * Design boundaries:
 * - Does not mutate Situated Task pages, schemas, or declared durations.
 * - Preserves duration lock and non-blocking advisory semantics.
 * - Models actual learner work rather than mechanically counting prompts:
 *   one integrated advisory note with multiple intellectual requirements stays
 *   one constructed-response surface, while genuinely independent recording
 *   entries (e.g. pre-visit expectation, live observation log, post-visit
 *   reflection) are counted distinctly.
 * - Explicitly distinguishes insufficient_evidence and duration_unavailable
 *   from assessed_feasible.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      typeof require === "function" ? require("./workload-feasibility-estimator.js") : null
    );
  } else {
    root.PrismSituatedTaskWorkloadFeasibilityAdapter = factory(
      root.PrismWorkloadFeasibilityEstimator || null
    );
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (estimatorApi) {
  "use strict";

  var SCHEMA_VERSION = "104S.1";

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
    if (!Number.isFinite(n) || n <= 0) return null;
    return Math.round(n * 1e6) / 1e6;
  }

  function countWords(text) {
    var cleaned = String(text || "")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/\|[-:\s|]+\|/g, " ")
      .replace(/[#*_`>|[\]()]/g, " ")
      .trim();
    if (!cleaned) return 0;
    return cleaned.split(/\s+/).filter(Boolean).length;
  }

  /**
   * Count embedded Markdown data tables (header + separator + >= 2 data rows)
   * across learner-facing section exposition.
   */
  function countMarkdownDataTables(markdown) {
    var lines = String(markdown || "").split(/\r?\n/);
    var count = 0;
    var i = 0;
    while (i < lines.length) {
      var line = lines[i].trim();
      var next = i + 1 < lines.length ? lines[i + 1].trim() : "";
      if (
        line.indexOf("|") !== -1 &&
        /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(next)
      ) {
        var dataRows = 0;
        var j = i + 2;
        while (j < lines.length && lines[j].trim().indexOf("|") !== -1) {
          if (lines[j].trim().replace(/[|\s-]/g, "").length > 0) {
            dataRows += 1;
          }
          j += 1;
        }
        if (dataRows >= 2) count += 1;
        i = j;
        continue;
      }
      i += 1;
    }
    return count;
  }

  function extractWordBand(text) {
    var api = resolveEstimator();
    var src = String(text || "");
    var range = src.match(/(\d{1,4})\s*[-–—]\s*(\d{1,4})\s*words?\b/i);
    if (range) return { min: Number(range[1]), max: Number(range[2]) };
    var single = src.match(/\b(\d{1,4})\s*words?\b/i);
    if (single) {
      var n = Number(single[1]);
      return { min: n, max: n };
    }
    if (api && typeof api.parseSuggestedLengthWords === "function" && /\bwords?\b/i.test(src)) {
      return api.parseSuggestedLengthWords(src);
    }
    return null;
  }

  function looksLikeFamiliarMaterial(text) {
    return /\b(revisit|revisiting|already (?:read|reviewed|examined|encountered|engaged)|earlier (?:evidence|judgement|judgment|work|response|material|commission|activity)|bring[- ]forward|prior (?:work|evidence|judgement|judgment|observation|findings)|(?:now-)?familiar (?:evidence|material|dataset|datasets|case)|previously (?:reviewed|examined|encountered|engaged)|from (?:your|the) earlier)\b/i.test(
      String(text || "")
    );
  }

  function detectDistinctReasoningDemands(text) {
    var src = String(text || "");
    var moves = [];
    if (
      /\b(interpret\w*\s+(?:the\s+)?(?:paired\s+observations?|data|table|observations?|pattern|evidence)|paired\s+observations?|inspect\w*\s+(?:the\s+)?(?:data|table|observations?))\b/i.test(
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
      /\b(evaluat\w*\s+(?:the\s+)?(?:evidence\s+)?limitations?|limitations?\s+of\s+(?:the\s+)?evidence|what\s+the\s+evidence\s+cannot|caveats?\s+and\s+limitations?|strength\s+and\s+limitations?)\b/i.test(
        src
      )
    ) {
      moves.push("limitation_evaluation");
    }
    if (
      /\b(advisory\s+(?:judgement|judgment|note|briefing|recommendation)|integrated\s+(?:written\s+)?(?:judgement|judgment|advisory|recommendation)|weigh\w*\s+the\s+evidence|policy\s+advice|recommend\w*\s+(?:a|whether|what))\b/i.test(
        src
      )
    ) {
      moves.push("advisory_synthesis");
    }
    return moves;
  }

  function inferReasoningDemand(text, distinctMoves) {
    var src = String(text || "");
    if (
      distinctMoves.indexOf("advisory_synthesis") !== -1 ||
      distinctMoves.indexOf("limitation_evaluation") !== -1 ||
      /\b(recommend\w*|evaluat\w*|advisory\s+(?:judgement|judgment)|weigh\w*|criteria|trade-?off|limitations?\s+of\s+(?:the\s+)?evidence)\b/i.test(
        src
      )
    ) {
      return "evaluation";
    }
    if (/\b(argument\w*|philosophical|defend\w*\s+(?:a|your)\s+position)\b/i.test(src)) {
      return "argument";
    }
    if (
      distinctMoves.indexOf("competing_explanations") !== -1 ||
      distinctMoves.indexOf("evidence_interpretation") !== -1 ||
      /\b(compar\w*|analys\w*|reconsider\w*|diagnos\w*|contrast\w*|interpret\w*|diverge\w*|contradict\w*|pattern|explanation)\b/i.test(
        src
      )
    ) {
      return "analysis";
    }
    if (/\b(apply|applying|carry\s+out|undertake|observe|inspect\w*|investigat\w*|record\s+what)\b/i.test(src)) {
      return "application";
    }
    if (/\b(describe|explain|summarise|summarize|comprehend)\b/i.test(src)) {
      return "comprehension";
    }
    return "unknown";
  }

  function looksLikeBriefNote(text) {
    return /\b(brief\s+(?:note|jotting|summary|bullet|rationale|justification|response)|short\s+(?:note|summary|justification|response)|concise\s+(?:note|justification|bullet)|1\s*[-–—]\s*2\s+sentences?|one\s+or\s+two\s+sentences?|one\s+sentence|bullet\s+points?\s+only|quick\s+note|jottings?)\b/i.test(
      String(text || "")
    );
  }

  function looksLikeSubstantialWrittenDeliverable(text, hasArtefactEntry, reasoningDemand, wordBand) {
    if (wordBand && wordBand.max >= 120) return true;
    if (wordBand && wordBand.max < 100) return false;
    var src = String(text || "");
    if (looksLikeBriefNote(src)) return false;
    if (
      /\b(advisory\s+(?:judgement|judgment|note|briefing|memo|recommendation)|integrated\s+written\s+(?:judgement|judgment|advisory|response|evaluation|analysis)|written\s+(?:advisory|evaluation|judgement|judgment|briefing|recommendation|analysis|report)|structured\s+written\s+(?:judgement|judgment|response|analysis))\b/i.test(
        src
      )
    ) {
      return true;
    }
    if (
      hasArtefactEntry &&
      (reasoningDemand === "evaluation" ||
        reasoningDemand === "argument" ||
        reasoningDemand === "analysis")
    ) {
      return true;
    }
    return false;
  }

  function detectReviewOrSelfCheck(text) {
    var src = String(text || "");
    var hasReview = /\b(review\s+your\s+reasoning|reasoning\s+review|check\s+your\s+(?:reasoning|judgement|judgment|work|explanation)|self[- ]?check|self[- ]?evaluat\w*|before\s+finalising\s+(?:your|the)|verify\s+your\s+reasoning|audit\s+your\s+reasoning)\b/i.test(
      src
    );
    var criteriaMatches = src.match(/\b(criteria|checklist|checks?\s+to\s+verify)\b/i);
    return {
      requiresFeedbackInterpretation: hasReview,
      checklistCriterionCount: hasReview && criteriaMatches ? 2 : 0
    };
  }

  function detectRevision(text) {
    var src = String(text || "");
    var requiresRevision = /\b(then\s+revise|revise\s+(?:your|the)|revision|rewrite|refine\s+(?:your|the)\s+(?:judgement|judgment|response|explanation|reasoning|draft)|update\s+your\s+(?:judgement|judgment|position))\b/i.test(
      src
    );
    var revisionIsPrimary =
      requiresRevision &&
      /\b(revision\s+itself\s+is\s+the\s+learning\s+performance|revision\s+of\s+the\s+existing|revisit\s+and\s+revise\s+your\s+earlier)\b/i.test(
        src
      );
    return {
      requiresRevision: requiresRevision,
      revisionIsPrimary: revisionIsPrimary
    };
  }

  /**
   * Map a concrete Situated Task Design Page into a Sprint 100A estimator input.
   */
  function mapSituatedTaskToEstimatorInput(page, options) {
    if (!page || typeof page !== "object" || Array.isArray(page)) return null;
    var opts = options && typeof options === "object" ? options : {};
    var sl = page.situated_learning && typeof page.situated_learning === "object"
      ? page.situated_learning
      : null;
    if (!sl) return null;

    var declaredDurationMinutes = parseFiniteMinutes(
      opts.effectiveDurationMinutes != null
        ? opts.effectiveDurationMinutes
        : opts.authoritativeDurationMinutes != null
          ? opts.authoritativeDurationMinutes
          : opts.declaredDurationMinutes
    );

    var sections = Array.isArray(page.sections) ? page.sections : [];
    var expositionParts = [];
    var dataTableCount = 0;
    sections.forEach(function (sec) {
      if (!sec || typeof sec !== "object") return;
      var expo = asTrimmed(sec.exposition);
      if (expo) {
        expositionParts.push(expo);
        dataTableCount += countMarkdownDataTables(expo);
      }
    });
    var expositionText = expositionParts.join("\n\n");
    var sectionWordCount = countWords(expositionText);

    var activityObj = sl.activity && typeof sl.activity === "object" ? sl.activity : {};
    var purposeObj = sl.purpose && typeof sl.purpose === "object" ? sl.purpose : {};
    var recordObj = sl.record && typeof sl.record === "object" ? sl.record : {};
    var entries = Array.isArray(recordObj.entries) ? recordObj.entries : [];

    var entryTextParts = [];
    var artefactEntryCount = 0;
    var distinctEntryIds = Object.create(null);
    var independentEntryCount = 0;
    entries.forEach(function (entry, idx) {
      if (!entry || typeof entry !== "object") return;
      var eid = asTrimmed(entry.entry_id || entry.id) || "entry_" + idx;
      if (!distinctEntryIds[eid]) {
        distinctEntryIds[eid] = true;
        independentEntryCount += 1;
      }
      if (entry.label) entryTextParts.push(asTrimmed(entry.label));
      if (entry.prompt) entryTextParts.push(asTrimmed(entry.prompt));
      if (entry.artefact && typeof entry.artefact === "object") {
        artefactEntryCount += 1;
        if (entry.artefact.label) entryTextParts.push(asTrimmed(entry.artefact.label));
        if (entry.artefact.prompt) entryTextParts.push(asTrimmed(entry.artefact.prompt));
      }
    });

    var coreTaskText = [
      asTrimmed(page.title),
      asTrimmed(purposeObj.learning_intent),
      asTrimmed(activityObj.undertaking),
      asTrimmed(activityObj.context),
      asTrimmed(recordObj.retain),
      entryTextParts.join("\n"),
      expositionText
    ]
      .filter(Boolean)
      .join("\n");

    var familiarCues = looksLikeFamiliarMaterial(coreTaskText);

    // Evidence inspection: count embedded data tables and explicit unfamiliar paired-observation / dataset cues.
    var newEvidenceCount = dataTableCount;
    if (
      newEvidenceCount === 0 &&
      /\b(\d{1,2}|ten|eight|six|five|four|three|two)?\s*paired\s+observations?\b|\b(?:new|unfamiliar|provided|supplied)\s+(?:synthetic\s+)?(?:dataset|data\s+table|observations?|evidence\s+set|records?)\b|\b(?:dataset|data\s+table|scatterplot)\b/i.test(
        coreTaskText
      )
    ) {
      if (
        !familiarCues ||
        /\b(?:new|unfamiliar|additional|supplementary)\s+(?:synthetic\s+)?(?:dataset|data\s+table|observations?|evidence(?:\s+set)?|records?|table)\b|\b(?:provided\s+below|table\s+below)\b/i.test(
          coreTaskText
        )
      ) {
        newEvidenceCount = 1;
      }
    }
    var familiarEvidenceCount = familiarCues ? 1 : 0;

    // Reading & orientation demand from actual learner-facing exposition volume + familiarity.
    var readingDemand = "unknown";
    if (sectionWordCount > 0) {
      if (familiarCues && sectionWordCount < 500) {
        readingDemand = "familiar";
      } else if (sectionWordCount < 150) {
        readingDemand = "brief";
      } else if (sectionWordCount < 500) {
        readingDemand = "moderate";
      } else if (sectionWordCount < 1000) {
        readingDemand = "substantial";
      } else {
        readingDemand = "dossier";
      }
    } else if (familiarCues) {
      readingDemand = "familiar";
    }

    var distinctMoves = detectDistinctReasoningDemands(coreTaskText);
    var reasoningDemand = inferReasoningDemand(coreTaskText, distinctMoves);

    // Written production & recording surfaces:
    // Never infer multiple independent written responses from one integrated entry.
    var wordBand = extractWordBand(entryTextParts.join("\n")) || extractWordBand(coreTaskText);
    var substantialWritten = looksLikeSubstantialWrittenDeliverable(
      [entryTextParts.join("\n"), asTrimmed(activityObj.undertaking), asTrimmed(recordObj.retain)].join("\n"),
      artefactEntryCount > 0,
      reasoningDemand,
      wordBand
    );

    var constructedResponseCount = independentEntryCount;
    if (constructedResponseCount === 0 && (wordBand || substantialWritten)) {
      constructedResponseCount = 1;
    }

    var activityType = "unknown";
    if (wordBand || constructedResponseCount > 0) {
      if (wordBand && wordBand.max >= 120 && reasoningDemand === "argument") {
        activityType = "argumentative_writing";
      } else if (wordBand && wordBand.max >= 120 && (reasoningDemand === "analysis" || reasoningDemand === "evaluation")) {
        activityType = "analytical_writing";
      } else {
        activityType = "constructed_response";
      }
    }

    var reviewInfo = detectReviewOrSelfCheck(coreTaskText);
    var revisionInfo = detectRevision(coreTaskText);

    // Distinguish brief integrated justifications/notes from substantial integrated written production.
    var integratedReasoningProduction =
      constructedResponseCount > 0 &&
      !substantialWritten &&
      (!wordBand || wordBand.max < 120) &&
      reasoningDemand !== "unknown";

    var integratedEvidenceInspection = readingDemand === "familiar" && newEvidenceCount > 0;
    var integratedRevisionAsPerformance = revisionInfo.revisionIsPrimary;
    var integratedFeedbackSelfEvaluation =
      reviewInfo.requiresFeedbackInterpretation && revisionInfo.revisionIsPrimary;

    var hasMeaningfulSignal =
      sectionWordCount > 0 ||
      newEvidenceCount > 0 ||
      constructedResponseCount > 0 ||
      !!wordBand ||
      reasoningDemand !== "unknown" ||
      reviewInfo.requiresFeedbackInterpretation ||
      revisionInfo.requiresRevision;

    if (!hasMeaningfulSignal) return null;

    var estimatorInput = {
      activityType: activityType,
      declaredDurationMinutes: declaredDurationMinutes,
      suggestedLengthWords: wordBand,
      reasoningDemand: reasoningDemand,
      readingDemand: readingDemand,
      requiresFeedbackInterpretation: reviewInfo.requiresFeedbackInterpretation,
      requiresRevision: revisionInfo.requiresRevision,
      familiarMaterial: readingDemand === "familiar",
      dossierReview: readingDemand === "dossier"
    };
    if (constructedResponseCount > 0) {
      estimatorInput.constructedResponseCount = constructedResponseCount;
    }
    if (newEvidenceCount > 0) {
      estimatorInput.newEvidenceCount = newEvidenceCount;
    }
    if (familiarEvidenceCount > 0) {
      estimatorInput.familiarEvidenceCount = familiarEvidenceCount;
    }
    if (reviewInfo.checklistCriterionCount > 0) {
      estimatorInput.checklistCriterionCount = reviewInfo.checklistCriterionCount;
    }
    if (integratedReasoningProduction) {
      estimatorInput.integratedReasoningProduction = true;
    }
    if (integratedEvidenceInspection) {
      estimatorInput.integratedEvidenceInspection = true;
    }
    if (integratedRevisionAsPerformance) {
      estimatorInput.integratedRevisionAsPerformance = true;
    }
    if (integratedFeedbackSelfEvaluation) {
      estimatorInput.integratedFeedbackSelfEvaluation = true;
    }

    return {
      title: asTrimmed(page.title) || "Situated Task",
      declaredDurationMinutes: declaredDurationMinutes,
      durationStatus: declaredDurationMinutes != null ? "available" : "unavailable",
      input: estimatorInput,
      metadata: {
        sectionWordCount: sectionWordCount,
        dataTableCount: dataTableCount,
        recordEntryCount: independentEntryCount,
        artefactEntryCount: artefactEntryCount,
        distinctReasoningMoves: distinctMoves,
        distinctReasoningDemandCount: distinctMoves.length,
        substantialWrittenDeliverable: substantialWritten,
        integratedReasoningProduction: integratedReasoningProduction
      }
    };
  }

  function formatSituatedTaskWarning(label, declared, estimate, opts) {
    var estimator = resolveEstimator();
    if (estimator && typeof estimator.formatActionableWorkloadWarning === "function") {
      return estimator.formatActionableWorkloadWarning({
        scopePrefix: "Workload feasibility (advisory, Situated Task)",
        subjectLabel: label,
        allocatedMinutes: declared,
        estimate: estimate,
        durationLocked: !!(opts && opts.durationLocked === true),
        revisitNote: true
      });
    }
    var range = (estimate && estimate.indicativeEffortMinutes) || {};
    var demandBits = [];
    if (estimate && estimate.components) {
      if (estimate.components.reading && estimate.components.reading.high > 0) {
        demandBits.push("reading/orientation");
      }
      if (estimate.components.evidenceInspection && estimate.components.evidenceInspection.high > 0) {
        demandBits.push("evidence inspection");
      }
      if (estimate.components.reasoning && estimate.components.reasoning.high > 0) {
        demandBits.push("substantive reasoning");
      }
      if (estimate.components.production && estimate.components.production.high > 0) {
        demandBits.push("written production/recording");
      }
      if (estimate.components.feedback && estimate.components.feedback.high > 0) {
        demandBits.push("reasoning review");
      }
      if (estimate.components.revision && estimate.components.revision.high > 0) {
        demandBits.push("refinement/revision");
      }
    }
    var demands =
      demandBits.length > 0 ? demandBits.join(", ") : "the visible situated task demands";
    return (
      "Workload feasibility (advisory, Situated Task): " +
      label +
      " is allocated " +
      declared +
      " minutes, while estimated workload is approximately " +
      range.low +
      "–" +
      range.high +
      " minutes (principal demands: " +
      demands +
      "). This warning is advisory; you may retain the design where your professional judgement justifies it."
    );
  }

  function assessSituatedTaskWorkload(page, options) {
    var estimator = resolveEstimator();
    var opts = options && typeof options === "object" ? options : {};
    var mapped = mapSituatedTaskToEstimatorInput(page, opts);
    if (!mapped || !estimator || typeof estimator.estimateActivityWorkload !== "function") {
      var dur = parseFiniteMinutes(
        opts.effectiveDurationMinutes != null
          ? opts.effectiveDurationMinutes
          : opts.authoritativeDurationMinutes != null
            ? opts.authoritativeDurationMinutes
            : opts.declaredDurationMinutes
      );
      return {
        schemaVersion: SCHEMA_VERSION,
        status: "insufficient_evidence",
        sufficientEvidence: false,
        insufficientEvidence: true,
        durationStatus: dur != null ? "available" : "unavailable",
        declaredDurationMinutes: dur,
        mapped: mapped,
        estimate: null,
        warnings: []
      };
    }

    var estimate = estimator.estimateActivityWorkload(mapped.input);
    var warnings = [];
    var status = "assessed_feasible";
    if (!estimate || estimate.sufficientEvidence !== true) {
      status = "insufficient_evidence";
    } else if (estimate.durationStatus === "unavailable" || mapped.declaredDurationMinutes == null) {
      status = "duration_unavailable";
    } else if (estimate.plausiblyInsufficient === true) {
      status = "plausibly_insufficient";
      warnings.push(
        formatSituatedTaskWarning(mapped.title, mapped.declaredDurationMinutes, estimate, opts)
      );
    }

    return {
      schemaVersion: SCHEMA_VERSION,
      status: status,
      sufficientEvidence: !!(estimate && estimate.sufficientEvidence === true),
      insufficientEvidence: !(estimate && estimate.sufficientEvidence === true),
      durationStatus: mapped.durationStatus,
      declaredDurationMinutes: mapped.declaredDurationMinutes,
      mapped: mapped,
      estimate: estimate,
      warnings: warnings
    };
  }

  function collectSituatedTaskWorkloadWarnings(page, options) {
    var assessed = assessSituatedTaskWorkload(page, options);
    return assessed && Array.isArray(assessed.warnings) ? assessed.warnings.slice() : [];
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    countMarkdownDataTables: countMarkdownDataTables,
    mapSituatedTaskToEstimatorInput: mapSituatedTaskToEstimatorInput,
    assessSituatedTaskWorkload: assessSituatedTaskWorkload,
    collectSituatedTaskWorkloadWarnings: collectSituatedTaskWorkloadWarnings,
    formatSituatedTaskWarning: formatSituatedTaskWarning
  };
});
