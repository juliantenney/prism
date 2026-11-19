/**
 * Sprint 100B-2 — Assessment Pack → workload feasibility adapter.
 *
 * Maps existing Assessment Pack elicitation fields into the Sprint 100A
 * estimator input contract and formats non-blocking author-facing warnings.
 *
 * Does not mutate Assessment Pack schemas or declared durations.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(
      typeof require === "function" ? require("./workload-feasibility-estimator.js") : null
    );
  } else {
    root.PrismAssessmentPackWorkloadFeasibilityAdapter = factory(
      root.PrismWorkloadFeasibilityEstimator || null
    );
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (estimatorApi) {
  "use strict";

  var SCHEMA_VERSION = "100B2.1";

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
   * Conservatively parse natural-language indicative time.
   * Prefers an explicit numeric minutes field when present.
   * For prose, takes the first clear "N minute(s)" mention — does not sum
   * nested stage timings (avoids double-counting preparation/composition/review).
   */
  function parseIndicativeTimeMinutes(value) {
    var direct = parseFiniteMinutes(value);
    if (direct != null) return direct;
    var text = asTrimmed(value);
    if (!text) return null;
    var match = text.match(/(\d{1,3})\s*(?:minutes?|mins?|min)\b/i);
    if (!match) return null;
    return Number(match[1]);
  }

  function collectElicitationText(elicitation) {
    if (!elicitation || typeof elicitation !== "object") return "";
    var prompt = elicitation.delivery && elicitation.delivery.prompt;
    var parts = [
      elicitation.evidence_ask,
      elicitation.stimulus,
      typeof prompt === "string" ? prompt : "",
      prompt && typeof prompt === "object"
        ? [prompt.title, prompt.context, prompt.task, prompt.response_expectation, prompt.suggested_length, prompt.indicative_time].join(
            "\n"
          )
        : "",
      elicitation.delivery &&
        elicitation.delivery.response_workspace &&
        elicitation.delivery.response_workspace.intention
    ];
    var formative = elicitation.formative_return;
    if (formative && typeof formative === "object") {
      parts.push(formative.forward_orientation);
      if (Array.isArray(formative.materials)) {
        formative.materials.forEach(function (row) {
          parts.push(row && row.body);
        });
      }
    }
    return parts
      .map(asTrimmed)
      .filter(Boolean)
      .join("\n");
  }

  function extractPromptField(elicitation, key) {
    var prompt = elicitation && elicitation.delivery && elicitation.delivery.prompt;
    if (!prompt) return "";
    if (typeof prompt === "string") return key === "task" ? prompt : "";
    if (typeof prompt === "object") return asTrimmed(prompt[key]);
    return "";
  }

  function extractWordBand(elicitation, text) {
    var suggested = extractPromptField(elicitation, "suggested_length");
    var api = resolveEstimator();
    // Only accept explicit word-length cues. Do not run the generic numeric
    // parser over full elicitation prose (it can treat minutes as word counts).
    if (suggested && /\bwords?\b/i.test(suggested)) {
      if (api && typeof api.parseSuggestedLengthWords === "function") {
        var fromSuggested = api.parseSuggestedLengthWords(suggested);
        if (fromSuggested) return fromSuggested;
      }
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

  function resolveDeclaredMinutes(elicitation) {
    var fromField = parseFiniteMinutes(elicitation && elicitation.indicative_duration_minutes);
    if (fromField != null) return fromField;
    var fromPrompt = parseIndicativeTimeMinutes(extractPromptField(elicitation, "indicative_time"));
    if (fromPrompt != null) return fromPrompt;
    return parseIndicativeTimeMinutes(elicitation && elicitation.indicative_time);
  }

  function inferReasoningDemand(text, wordBand, elicitation) {
    // Auto-checkable items: do not over-read assessment jargon ("judgement",
    // "justify") as extended evaluative writing demand.
    if (isAutoCheckable(elicitation)) {
      return "comprehension";
    }
    // Prefer recommendation / evaluation before argument so "justify your
    // recommendation" does not collapse into philosophical-argument mapping.
    if (/\b(recommend|recommendation|evaluat|criteria|trade-?off)\b/i.test(text)) {
      return "evaluation";
    }
    if (/\b(argument|philosophical|defend)\b/i.test(text)) {
      return "argument";
    }
    if (/\b(compar|analys|reconsider|diagnos|prioritis|prioritiz|contrast)\b/i.test(text)) {
      return "analysis";
    }
    if (/\b(apply|application|calculate|compute)\b/i.test(text)) {
      return "application";
    }
    if (wordBand) return "analysis";
    return "unknown";
  }

  function inferReadingDemand(text, elicitation) {
    if (/\b(dossier|evidence pack|complete (?:fictional )?evidence|full (?:set of )?evidence)\b/i.test(text)) {
      return "dossier";
    }
    var hasStimulus =
      !!asTrimmed(elicitation && elicitation.stimulus) ||
      !!(
        elicitation &&
        elicitation.delivery &&
        elicitation.delivery.stimulus &&
        typeof elicitation.delivery.stimulus === "object"
      );
    if (
      hasStimulus ||
      /\b(read (?:the|your)|review (?:the|your)|revisit|evidence|research (?:account|study)|source material)\b/i.test(
        text
      )
    ) {
      return "moderate";
    }
    return "unknown";
  }

  function isAutoCheckable(elicitation) {
    var kind = asTrimmed(
      elicitation && elicitation.delivery && elicitation.delivery.kind
    ).toLowerCase();
    return kind === "auto_checkable_items";
  }

  function isConstructed(elicitation) {
    var kind = asTrimmed(
      elicitation && elicitation.delivery && elicitation.delivery.kind
    ).toLowerCase();
    return kind === "constructed_performance";
  }

  function inferActivityType(text, elicitation, wordBand, reasoningDemand) {
    if (isAutoCheckable(elicitation) && !wordBand) return "mcq";
    if (wordBand) {
      if (/\brecommend/i.test(text)) return "institutional_recommendation";
      if (reasoningDemand === "argument") return "argumentative_writing";
      if (reasoningDemand === "analysis" || reasoningDemand === "evaluation") {
        return "analytical_writing";
      }
      return "constructed_response";
    }
    // Text-entry / constructed_performance alone does not invent substantial writing.
    return "unknown";
  }

  function hasFormativeFeedbackMaterials(elicitation) {
    var formative = elicitation && elicitation.formative_return;
    if (!formative || typeof formative !== "object") return false;
    if (Array.isArray(formative.materials) && formative.materials.length) return true;
    return !!asTrimmed(formative.feedback_note);
  }

  /**
   * Revision overhead applies only when the same elicitation's time budget
   * also covers post-response revision (not when the main task is itself a rewrite).
   */
  function hasSubstantiveRevisionRequirement(elicitation, text) {
    var formative = elicitation && elicitation.formative_return;
    if (formative && typeof formative === "object") {
      if (formative.optional_revision && formative.optional_revision.offered === true) {
        return true;
      }
      if (formative.revision && asTrimmed(formative.revision.prompt)) return true;
    }
    return /\b(then revise|after feedback.{0,40}revise|revise (?:your|the) (?:response|explanation|argument) after)\b/i.test(
      text
    );
  }

  function elicitationLabel(elicitation) {
    var title = extractPromptField(elicitation, "title");
    if (title) return title;
    var id = asTrimmed(elicitation && elicitation.elicitation_id);
    if (id) return id;
    return "Assessment task";
  }

  function mapElicitationToEstimatorInput(elicitation) {
    if (!elicitation || typeof elicitation !== "object") return null;
    var text = collectElicitationText(elicitation);
    var wordBand = extractWordBand(elicitation, text);
    var reasoningDemand = inferReasoningDemand(text, !!wordBand, elicitation);
    var readingDemand = inferReadingDemand(text, elicitation);
    var activityType = inferActivityType(text, elicitation, wordBand, reasoningDemand);
    var declaredDurationMinutes = resolveDeclaredMinutes(elicitation);
    var requiresFeedbackInterpretation = hasFormativeFeedbackMaterials(elicitation);
    var requiresRevision = hasSubstantiveRevisionRequirement(elicitation, text);

    var hasDemandSignal =
      !!wordBand ||
      activityType === "mcq" ||
      readingDemand !== "unknown" ||
      (reasoningDemand !== "unknown" && !!wordBand) ||
      requiresFeedbackInterpretation ||
      requiresRevision ||
      isAutoCheckable(elicitation);

    if (!hasDemandSignal) return null;

    return {
      elicitationId: asTrimmed(elicitation.elicitation_id) || null,
      title: elicitationLabel(elicitation),
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

  function extractElicitations(artefact) {
    if (!artefact || typeof artefact !== "object") return [];
    if (Array.isArray(artefact.elicitations)) return artefact.elicitations;
    if (
      artefact.assessment_evidence &&
      typeof artefact.assessment_evidence === "object" &&
      Array.isArray(artefact.assessment_evidence.elicitations)
    ) {
      return artefact.assessment_evidence.elicitations;
    }
    return [];
  }

  function formatAuthorWarning(taskLabel, declared, estimate) {
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
      taskLabel +
      " is allocated " +
      declared +
      " minutes, but the visible demands (" +
      demands +
      ") suggest about " +
      range.low +
      "–" +
      range.high +
      " minutes may be more realistic. Consider simplifying the task, reducing the expected output, separating stages, or allowing more time. This is a planning aid, not a measured completion time. You may continue without changing the design."
    );
  }

  function assessAssessmentPackWorkload(artefact) {
    var estimator = resolveEstimator();
    var warnings = [];
    var findings = [];
    if (!estimator || typeof estimator.estimateActivityWorkload !== "function") {
      return { schemaVersion: SCHEMA_VERSION, warnings: warnings, findings: findings };
    }
    extractElicitations(artefact).forEach(function (elicitation) {
      var mapped = mapElicitationToEstimatorInput(elicitation);
      if (!mapped) return;
      var estimate = estimator.estimateActivityWorkload(mapped.input);
      findings.push({
        elicitationId: mapped.elicitationId,
        title: mapped.title,
        input: mapped.input,
        estimate: estimate
      });
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

  function collectAssessmentPackWorkloadWarnings(artefact) {
    return assessAssessmentPackWorkload(artefact).warnings;
  }

  return {
    SCHEMA_VERSION: SCHEMA_VERSION,
    assessAssessmentPackWorkload: assessAssessmentPackWorkload,
    collectAssessmentPackWorkloadWarnings: collectAssessmentPackWorkloadWarnings,
    mapElicitationToEstimatorInput: mapElicitationToEstimatorInput,
    parseIndicativeTimeMinutes: parseIndicativeTimeMinutes,
    extractElicitations: extractElicitations
  };
});
