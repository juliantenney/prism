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

  function resolveDeclaredMinutes(elicitation, options) {
    var opts = options && typeof options === "object" ? options : {};
    var fromAllocated = parseFiniteMinutes(elicitation && elicitation.allocated_minutes);
    if (fromAllocated != null && fromAllocated > 0) return fromAllocated;
    var fromField = parseFiniteMinutes(elicitation && elicitation.indicative_duration_minutes);
    if (fromField != null && fromField > 0) return fromField;
    if (opts.requireAuthoritativeDuration === true || opts.disableProseFallback === true) {
      return null;
    }
    var fromPrompt = parseIndicativeTimeMinutes(extractPromptField(elicitation, "indicative_time"));
    if (fromPrompt != null) return fromPrompt;
    return parseIndicativeTimeMinutes(elicitation && elicitation.indicative_time);
  }

  function extractElicitationStructuredSignals(elicitation, readingDemand, text) {
    var newEvidenceCount = 0;
    var familiarEvidenceCount = 0;
    var selectionControlCount = 0;
    var workedExampleCount = 0;
    var constructedResponseCount = 0;
    var checklistCriterionCount = 0;
    var optionalSupportCount = 0;

    var delivery = elicitation && elicitation.delivery && typeof elicitation.delivery === "object"
      ? elicitation.delivery
      : null;

    // Structured stimulus tables/charts/datasets.
    var stimObj =
      (delivery && delivery.stimulus && typeof delivery.stimulus === "object"
        ? delivery.stimulus
        : null) ||
      (elicitation && elicitation.stimulus && typeof elicitation.stimulus === "object"
        ? elicitation.stimulus
        : null);
    if (stimObj) {
      var stimCount = 1;
      if (Array.isArray(stimObj.datasets) && stimObj.datasets.length) {
        stimCount = stimObj.datasets.length;
      } else if (Array.isArray(stimObj.tables) && stimObj.tables.length) {
        stimCount = stimObj.tables.length;
      }
      var stimText = JSON.stringify(stimObj);
      var stimFamiliar =
        readingDemand === "familiar" &&
        !/\b(?:new|fresh|additional|unfamiliar)\b/i.test(stimText);
      if (stimFamiliar) {
        familiarEvidenceCount += stimCount;
      } else {
        newEvidenceCount += stimCount;
      }
    } else if (
      readingDemand === "familiar" &&
      /\b(?:new|fresh|additional|unfamiliar)\s+(?:dataset|table|evidence|chart|scatterplot|data)\b/i.test(
        text
      )
    ) {
      newEvidenceCount += 1;
      familiarEvidenceCount = Math.max(1, familiarEvidenceCount);
    }

    if (delivery && isAutoCheckable(elicitation) && Array.isArray(delivery.items) && delivery.items.length) {
      selectionControlCount = delivery.items.length;
    }

    if (delivery && isConstructed(elicitation) && delivery.response_workspace && typeof delivery.response_workspace === "object") {
      var rw = delivery.response_workspace;
      if (Array.isArray(rw.parts) && rw.parts.length > 1) {
        constructedResponseCount = rw.parts.length;
      } else if (Array.isArray(rw.fields) && rw.fields.length > 1) {
        constructedResponseCount = rw.fields.length;
      }
    }

    var formative = elicitation && elicitation.formative_return;
    if (formative && typeof formative === "object") {
      var mats = Array.isArray(formative.materials) ? formative.materials : [];
      mats.forEach(function (row) {
        if (!row || typeof row !== "object") return;
        if (row.optional === true || /\boptional\b/i.test(asTrimmed(row.title) + " " + asTrimmed(row.purpose))) {
          optionalSupportCount += 1;
          return;
        }
        var kind = asTrimmed(row.kind || row.type || row.material_type).toLowerCase();
        if (kind === "worked_example" || kind === "worked_thinking") {
          workedExampleCount += 1;
        } else if (kind === "checklist" && Array.isArray(row.criteria)) {
          checklistCriterionCount += row.criteria.length;
        }
      });
      if (
        formative.optional_revision &&
        formative.optional_revision.offered === true &&
        !(formative.revision && asTrimmed(formative.revision.prompt)) &&
        !/\b(?:then revise|after feedback.{0,40}revise|revise (?:your|the) (?:response|explanation|argument) after)\b/i.test(
          text
        )
      ) {
        optionalSupportCount += 1;
      }
    }

    return {
      newEvidenceCount: newEvidenceCount,
      familiarEvidenceCount: familiarEvidenceCount,
      selectionControlCount: selectionControlCount,
      workedExampleCount: workedExampleCount,
      constructedResponseCount: constructedResponseCount,
      checklistCriterionCount: checklistCriterionCount,
      optionalSupportCount: optionalSupportCount
    };
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

  function looksLikeFamiliarMaterial(text) {
    return /\b(revisit|revisiting|already (?:read|reviewed|examined|encountered|engaged)|earlier (?:evidence|judgement|judgment|work|response|material)|bring[- ]forward|prior (?:work|evidence|judgement|judgment)|familiar (?:evidence|material)|previously (?:reviewed|examined|encountered|engaged)|from (?:your|the) earlier)\b/i.test(
      String(text || "")
    );
  }

  function inferReadingDemand(text, elicitation) {
    // Purposeful revisit of already-engaged material is lighter than a first pass,
    // including when later tasks still name a dossier or attach stimulus.
    if (looksLikeFamiliarMaterial(text)) {
      return "familiar";
    }
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
      /\b(read (?:the|your)|review (?:the|your)|evidence|research (?:account|study)|source material)\b/i.test(
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
    // Text-entry / constructed_performance alone does not invent substantial writing.
    return "unknown";
  }

  function hasFormativeFeedbackMaterials(elicitation) {
    var formative = elicitation && elicitation.formative_return;
    if (!formative || typeof formative !== "object") return false;
    var mats = Array.isArray(formative.materials) ? formative.materials : [];
    var hasExpectedMat = mats.some(function (row) {
      if (!row || typeof row !== "object") return false;
      return !(
        row.optional === true ||
        /\boptional\b/i.test(asTrimmed(row.title) + " " + asTrimmed(row.purpose))
      );
    });
    if (hasExpectedMat) return true;
    return !!asTrimmed(formative.feedback_note);
  }

  /**
   * Revision overhead applies only when the same elicitation's time budget
   * also covers mandatory post-response revision (not purely optional extension).
   */
  function hasSubstantiveRevisionRequirement(elicitation, text) {
    var formative = elicitation && elicitation.formative_return;
    if (formative && typeof formative === "object") {
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

  function mapElicitationToEstimatorInput(elicitation, options) {
    if (!elicitation || typeof elicitation !== "object") return null;
    var text = collectElicitationText(elicitation);
    var wordBand = extractWordBand(elicitation, text);
    var reasoningDemand = inferReasoningDemand(text, !!wordBand, elicitation);
    var readingDemand = inferReadingDemand(text, elicitation);
    var activityType = inferActivityType(text, elicitation, wordBand, reasoningDemand);
    var declaredDurationMinutes = resolveDeclaredMinutes(elicitation, options);
    var requiresFeedbackInterpretation = hasFormativeFeedbackMaterials(elicitation);
    var requiresRevision = hasSubstantiveRevisionRequirement(elicitation, text);
    var structuredSignals = extractElicitationStructuredSignals(
      elicitation,
      readingDemand,
      text
    );
    var familiarMaterial =
      readingDemand === "familiar" && structuredSignals.newEvidenceCount === 0;

    var hasDemandSignal =
      !!wordBand ||
      activityType === "mcq" ||
      readingDemand !== "unknown" ||
      (reasoningDemand !== "unknown" && !!wordBand) ||
      requiresFeedbackInterpretation ||
      requiresRevision ||
      isAutoCheckable(elicitation) ||
      structuredSignals.newEvidenceCount > 0 ||
      structuredSignals.familiarEvidenceCount > 0 ||
      structuredSignals.workedExampleCount > 0 ||
      structuredSignals.constructedResponseCount > 0;

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
    if (structuredSignals.newEvidenceCount > 0) {
      estimatorInput.newEvidenceCount = structuredSignals.newEvidenceCount;
    }
    if (structuredSignals.familiarEvidenceCount > 0) {
      estimatorInput.familiarEvidenceCount = structuredSignals.familiarEvidenceCount;
    }
    if (structuredSignals.selectionControlCount > 0) {
      estimatorInput.selectionControlCount = structuredSignals.selectionControlCount;
    }
    if (structuredSignals.workedExampleCount > 0) {
      estimatorInput.workedExampleCount = structuredSignals.workedExampleCount;
    }
    if (structuredSignals.constructedResponseCount > 0) {
      estimatorInput.constructedResponseCount = structuredSignals.constructedResponseCount;
    }
    if (structuredSignals.checklistCriterionCount > 0) {
      estimatorInput.checklistCriterionCount = structuredSignals.checklistCriterionCount;
    }
    if (structuredSignals.optionalSupportCount > 0) {
      estimatorInput.optionalSupportCount = structuredSignals.optionalSupportCount;
    }

    return {
      elicitationId: asTrimmed(elicitation.elicitation_id) || null,
      title: elicitationLabel(elicitation),
      input: estimatorInput
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

  function formatAuthorWarning(taskLabel, declared, estimate, opts) {
    var estimator = resolveEstimator();
    if (estimator && typeof estimator.formatActionableWorkloadWarning === "function") {
      return estimator.formatActionableWorkloadWarning({
        scopePrefix: "Workload feasibility (advisory, assessment)",
        subjectLabel: taskLabel,
        allocatedMinutes: declared,
        estimate: estimate,
        durationLocked: !!(opts && opts.durationLocked === true),
        revisitNote: true
      });
    }
    var range = estimate.indicativeEffortMinutes || {};
    var demandBits = collectDriverLabels(estimate.components);
    var demands =
      demandBits.length > 0 ? demandBits.join(", ") : "the identified learning demands";
    return (
      "Workload feasibility (advisory, assessment): " +
      taskLabel +
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

  function resolveAuthoritativePackDurationMinutes(artefact, options, findings) {
    var opts = options && typeof options === "object" ? options : {};
    var candidates = [
      opts.effectiveDurationMinutes,
      opts.authoritativeDurationMinutes,
      artefact && artefact.allocated_minutes,
      artefact && artefact.commissioned_duration_minutes
    ];
    for (var i = 0; i < candidates.length; i += 1) {
      var m = parseFiniteMinutes(candidates[i]);
      if (m != null && m > 0) return m;
    }
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

  function assessAssessmentPackWorkload(artefact, options) {
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
    extractElicitations(artefact).forEach(function (elicitation) {
      var mapped = mapElicitationToEstimatorInput(elicitation, opts);
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
        formatAuthorWarning(mapped.title, mapped.input.declaredDurationMinutes, estimate, opts)
      );
    });

    var authoritativeDurationMinutes = resolveAuthoritativePackDurationMinutes(
      artefact,
      opts,
      findings
    );
    var estimates = findings.map(function (f) {
      return f.estimate;
    });
    var cumulative =
      typeof estimator.assessCumulativeWorkload === "function"
        ? estimator.assessCumulativeWorkload(estimates, authoritativeDurationMinutes)
        : null;

    var allElicitationsDeclared =
      findings.length > 0 &&
      findings.every(function (f) {
        return f.input && f.input.declaredDurationMinutes != null;
      });
    var hasExplicitPackDuration =
      parseFiniteMinutes(opts.effectiveDurationMinutes) != null ||
      parseFiniteMinutes(opts.authoritativeDurationMinutes) != null ||
      parseFiniteMinutes(artefact && artefact.allocated_minutes) != null ||
      parseFiniteMinutes(artefact && artefact.commissioned_duration_minutes) != null;

    var durationStatus =
      hasExplicitPackDuration || allElicitationsDeclared
        ? "available"
        : "unavailable";

    if (
      durationStatus === "unavailable" &&
      cumulative &&
      cumulative.sufficientEvidence &&
      cumulative.cumulativeIndicativeMinutes
    ) {
      var missingRange = cumulative.cumulativeIndicativeMinutes;
      var missingDrivers = collectDriverLabels(cumulative.components);
      warnings.push(
        "Workload feasibility (indicative, assessment pack): authoritative duration is unavailable (cumulative visible demands across " +
          findings.length +
          " task" +
          (findings.length === 1 ? "" : "s") +
          " suggest about " +
          missingRange.low +
          "–" +
          missingRange.high +
          " minutes driven by " +
          (missingDrivers.length ? missingDrivers.join(", ") : "identified assessment demands") +
          "), so duration feasibility could not be verified. No duration, outcome, or task was altered."
      );
    } else if (
      cumulative &&
      cumulative.sufficientEvidence &&
      cumulative.plausiblyInsufficient === true &&
      (findings.length > 1 || warnings.length === 0)
    ) {
      if (typeof estimator.formatActionableWorkloadWarning === "function") {
        warnings.push(
          estimator.formatActionableWorkloadWarning({
            scopePrefix: "Workload feasibility (advisory, assessment pack cumulative)",
            subjectLabel:
              "This assessment pack (" +
              findings.length +
              " task" +
              (findings.length === 1 ? "" : "s") +
              ")",
            allocatedMinutes: authoritativeDurationMinutes,
            cumulative: cumulative,
            durationLocked: opts.durationLocked === true,
            revisitNote: true
          })
        );
      } else {
        var cumRange = cumulative.cumulativeIndicativeMinutes;
        var cumDrivers = collectDriverLabels(cumulative.components);
        warnings.push(
          "Workload feasibility (advisory, assessment pack cumulative): total assessment pack demands (" +
            (cumDrivers.length ? cumDrivers.join(", ") : "the identified assessment demands") +
            ") suggest about " +
            cumRange.low +
            "–" +
            cumRange.high +
            " minutes across " +
            findings.length +
            " task" +
            (findings.length === 1 ? "" : "s") +
            ", against an allocated duration of " +
            authoritativeDurationMinutes +
            " minutes. This warning is advisory; you may retain the design where your professional judgement justifies it."
        );
      }
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

  function collectAssessmentPackWorkloadWarnings(artefact, options) {
    return assessAssessmentPackWorkload(artefact, options).warnings;
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
