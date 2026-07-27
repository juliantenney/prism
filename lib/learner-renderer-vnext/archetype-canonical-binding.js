/**
 * Canonical FunctionEnum renderer binding (Sprint 69 Phase 5B).
 *
 * Educational legality: shared archetype grammar.
 * This module builds deterministic presentation/composition metadata from
 * archetype + FunctionEnum beats + shared role map. No whole-sequence registry.
 * No compressed vocabulary. No historical sequence identity.
 */
"use strict";

var episodePlanVocabulary = require("../episode-plan-v1-vocabulary.js");
var FUNCTION_ENUM = episodePlanVocabulary.FUNCTION_ENUM;

function beat(sourceFunction, learnerRole, options) {
  var opts = options || {};
  return Object.freeze({
    sourceFunction: sourceFunction,
    learnerRole: learnerRole,
    materialTypes: Object.freeze((opts.materialTypes || []).slice()),
    materialOrder: Object.freeze(
      (opts.materialOrder || opts.materialTypes || []).slice()
    ),
    promptFields: Object.freeze((opts.promptFields || []).slice()),
    taskSteps: Object.freeze({ take: opts.take == null ? 0 : opts.take }),
    includeExpectedOutput: opts.includeExpectedOutput === true
  });
}

function variant(id, beatSequence, beats) {
  return Object.freeze({
    id: id,
    beatSequence: Object.freeze(beatSequence.slice()),
    beats: Object.freeze(beats.slice())
  });
}

/** Exact frozen Episode Plan V1 sequences (lib/episode-plan-v1-templates.js). */
var EPISODE_PLAN_V1_SEQUENCES = Object.freeze({
  understand: Object.freeze([
    "orientation",
    "framing",
    "activation",
    "explanation",
    "example",
    "non_example",
    "misconception_confrontation",
    "guided_practice",
    "independent_performance",
    "verification",
    "reflection",
    "transition"
  ]),
  apply: Object.freeze([
    "orientation",
    "framing",
    "activation",
    "criteria_exposition",
    "worked_thinking",
    "guided_practice",
    "independent_performance",
    "verification",
    "revision",
    "reflection",
    "transfer",
    "transition"
  ]),
  analyse: Object.freeze([
    "orientation",
    "framing",
    "activation",
    "criteria_exposition",
    "explanation",
    "worked_thinking",
    "guided_inquiry",
    "guided_practice",
    "independent_performance",
    "verification",
    "reflection",
    "transfer",
    "transition"
  ]),
  evaluate: Object.freeze([
    "orientation",
    "framing",
    "activation",
    "perspective_construction",
    "criteria_exposition",
    "criteria_construction",
    "worked_judgement",
    "guided_inquiry",
    "guided_reasoning",
    "independent_performance",
    "evaluative_judgement",
    "verification",
    "reflection",
    "transfer",
    "transition"
  ])
});

var V1_LEARNER_ROLE_BY_FUNCTION = Object.freeze({
  orientation: "reflect",
  framing: "reflect",
  activation: "reflect",
  transition: "reflect",
  explanation: "explain",
  example: "explain",
  non_example: "explain",
  misconception_confrontation: "explain",
  criteria_exposition: "explain",
  perspective_construction: "explain",
  worked_thinking: "model",
  worked_judgement: "model",
  guided_inquiry: "practise",
  guided_reasoning: "practise",
  guided_practice: "practise",
  independent_performance: "practise",
  criteria_construction: "practise",
  evaluative_judgement: "practise",
  verification: "check",
  revision: "check",
  reflection: "check",
  transfer: "transfer",
  prediction: "practise",
  observation: "explain"
});

(function assertV1RolesCoverFunctionEnum() {
  var missing = [];
  FUNCTION_ENUM.forEach(function (id) {
    if (!V1_LEARNER_ROLE_BY_FUNCTION[id]) missing.push(id);
  });
  if (missing.length) {
    throw new Error(
      "V1_LEARNER_ROLE_BY_FUNCTION missing FunctionEnum ids: " + missing.join(",")
    );
  }
})();

function buildEpisodePlanV1Variant(archetype, beatSequence) {
  return buildCanonicalFunctionEnumVariant(archetype, beatSequence, {
    id: String(archetype || "") + "-episode-plan-v1"
  });
}

/**
 * Deterministic composition binding for canonical FunctionEnum sequences.
 * Material ownership and task allocation are derived from beat presence in the
 * sequence (canonical semantic inputs), never from historical whole-sequence ids.
 */
function buildCanonicalFunctionEnumVariant(archetype, beatSequence, options) {
  var opts = options && typeof options === "object" ? options : {};
  var sequence = Array.isArray(beatSequence) ? beatSequence.slice() : [];
  var hasTransfer = sequence.indexOf("transfer") !== -1;
  var hasExample = sequence.indexOf("example") !== -1;
  var hasExplanation = sequence.indexOf("explanation") !== -1;
  var hasIndependent = sequence.indexOf("independent_performance") !== -1;
  var hasWorkedThinking = sequence.indexOf("worked_thinking") !== -1;
  var hasWorkedJudgement = sequence.indexOf("worked_judgement") !== -1;
  var hasCriteriaExposition = sequence.indexOf("criteria_exposition") !== -1;
  var hasPerspective = sequence.indexOf("perspective_construction") !== -1;
  var hasPrimaryTextOwner =
    hasExplanation || hasCriteriaExposition || hasPerspective;
  var hasVerification = sequence.indexOf("verification") !== -1;

  // argument_structure_hint scaffolds independent evaluative response work.
  // Bind to the primary do-beat owner (independent_performance, else guided_*).
  var argumentStructureOwner = null;
  if (hasIndependent) {
    argumentStructureOwner = "independent_performance";
  } else if (sequence.indexOf("guided_practice") !== -1) {
    argumentStructureOwner = "guided_practice";
  } else if (sequence.indexOf("guided_inquiry") !== -1) {
    argumentStructureOwner = "guided_inquiry";
  } else if (sequence.indexOf("guided_reasoning") !== -1) {
    argumentStructureOwner = "guided_reasoning";
  }

  var beats = sequence.map(function (sourceFunction) {
    var role = V1_LEARNER_ROLE_BY_FUNCTION[sourceFunction] || "explain";
    var beatOptions = { take: 0, materialTypes: [], promptFields: [] };

    if (sourceFunction === "orientation") {
      beatOptions.promptFields = [
        "self_explanation_prompt",
        "conceptual_contrast_prompt",
        "intellectual_coherence_bridge"
      ];
      if (!hasPrimaryTextOwner) {
        beatOptions.materialTypes = ["text"];
        beatOptions.materialOrder = ["text"];
      }
    }
    if (sourceFunction === "explanation") {
      if (hasWorkedThinking || hasWorkedJudgement) {
        beatOptions.materialTypes = ["text", "reference_table"];
      } else if (hasExample) {
        beatOptions.materialTypes = ["text", "modelling_note", "reference_table"];
      } else {
        beatOptions.materialTypes = [
          "text",
          "worked_example",
          "modelling_note",
          "reference_table"
        ];
      }
      beatOptions.materialOrder = beatOptions.materialTypes.slice();
    }
    if (sourceFunction === "criteria_exposition" && !hasExplanation) {
      beatOptions.materialTypes = ["text", "modelling_note", "reference_table"];
      beatOptions.materialOrder = beatOptions.materialTypes.slice();
    }
    if (
      sourceFunction === "perspective_construction" &&
      !hasExplanation &&
      !hasCriteriaExposition
    ) {
      beatOptions.materialTypes = ["text", "modelling_note"];
      beatOptions.materialOrder = beatOptions.materialTypes.slice();
    }
    if (sourceFunction === "example") {
      beatOptions.materialTypes = ["worked_example"];
    }
    if (sourceFunction === "worked_thinking" && !hasExample) {
      beatOptions.materialTypes = hasPrimaryTextOwner
        ? ["worked_example", "sample_output", "modelling_note"]
        : ["text", "worked_example", "sample_output", "modelling_note"];
      beatOptions.materialOrder = beatOptions.materialTypes.slice();
    }
    if (sourceFunction === "worked_judgement") {
      beatOptions.materialTypes = [
        "worked_example",
        "sample_output",
        "modelling_note",
        "scenario"
      ];
      beatOptions.materialOrder = [
        "worked_example",
        "scenario",
        "modelling_note",
        "sample_output"
      ];
    }
    if (
      sourceFunction === "guided_practice" ||
      sourceFunction === "guided_inquiry" ||
      sourceFunction === "guided_reasoning"
    ) {
      var guidedOwner =
        sequence.indexOf("guided_practice") !== -1
          ? "guided_practice"
          : sequence.indexOf("guided_inquiry") !== -1
            ? "guided_inquiry"
            : "guided_reasoning";
      if (sourceFunction === guidedOwner) {
        beatOptions.materialTypes = [
          "analysis_table",
          "comparison_table",
          "classification_table",
          "decision_table",
          "planning_table",
          "data_table",
          "impact_table",
          "prompt_set",
          "template"
        ];
        // Scenario belongs to worked_judgement when present.
        if (!hasWorkedJudgement) beatOptions.materialTypes.unshift("scenario");
        beatOptions.materialOrder = beatOptions.materialTypes.slice();
      }
    }
    if (sourceFunction === "independent_performance") {
      beatOptions.take = "rest";
    }
    if (argumentStructureOwner && sourceFunction === argumentStructureOwner) {
      beatOptions.promptFields = beatOptions.promptFields.concat([
        "argument_structure_hint"
      ]);
    }
    if (sourceFunction === "verification") {
      var modelOwnsSample =
        (hasWorkedThinking || hasWorkedJudgement) && !hasExample;
      beatOptions.materialTypes = modelOwnsSample
        ? ["checklist"]
        : ["sample_output", "checklist"];
      beatOptions.materialOrder = beatOptions.materialTypes.slice();
      beatOptions.includeExpectedOutput = true;
      if (!hasIndependent) beatOptions.take = "rest";
    }
    if (sourceFunction === "transfer") {
      beatOptions.materialTypes = ["transfer_prompt", "consolidation_summary"];
      beatOptions.materialOrder = ["transfer_prompt", "consolidation_summary"];
      beatOptions.promptFields = ["transfer_or_application_task"];
    }
    if (sourceFunction === "reflection") {
      if (!hasTransfer) {
        beatOptions.materialTypes = ["transfer_prompt", "consolidation_summary"];
        beatOptions.materialOrder = ["transfer_prompt", "consolidation_summary"];
        beatOptions.promptFields = ["transfer_or_application_task"];
      }
      if (!hasIndependent && !hasVerification) {
        beatOptions.take = "rest";
        beatOptions.materialTypes = beatOptions.materialTypes.concat(["checklist"]);
        beatOptions.materialOrder = beatOptions.materialTypes.slice();
        beatOptions.includeExpectedOutput = true;
      }
    }
    return beat(sourceFunction, role, beatOptions);
  });

  var id =
    opts.id ||
    String(archetype || "activity") + "-canonical-grammar-" + sequence.join("__");
  return variant(id, sequence, beats);
}

module.exports = {
  EPISODE_PLAN_V1_SEQUENCES: EPISODE_PLAN_V1_SEQUENCES,
  FUNCTION_ENUM: FUNCTION_ENUM,
  V1_LEARNER_ROLE_BY_FUNCTION: V1_LEARNER_ROLE_BY_FUNCTION,
  isApprovedFunction: episodePlanVocabulary.isApprovedFunction,
  buildCanonicalFunctionEnumVariant: buildCanonicalFunctionEnumVariant,
  buildEpisodePlanV1Variant: buildEpisodePlanV1Variant,
  beat: beat,
  variant: variant
};
