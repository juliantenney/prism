/**
 * Declarative assignment policy.
 *
 * A variant is selected only when both its archetype and complete source beat
 * sequence match. There is no nearest-match or catch-all placement.
 */
"use strict";

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

/** @type {import("./types").ArchetypeRules} */
var ARCHETYPE_RULES = Object.freeze({
  understand: Object.freeze({
    variants: Object.freeze([
      variant(
        "understand-explain-check",
        ["orientation", "explanation", "check_understanding"],
        [
          beat("orientation", "reflect", {
            promptFields: [
              "self_explanation_prompt",
              "conceptual_contrast_prompt",
              "intellectual_coherence_bridge"
            ],
            take: 0
          }),
          beat("explanation", "explain", {
            materialTypes: ["text"],
            take: 1
          }),
          beat("check_understanding", "check", {
            materialTypes: ["worked_example", "sample_output", "checklist"],
            materialOrder: ["worked_example", "sample_output", "checklist"],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      ),
      variant(
        "understand-explain-apply-check",
        ["orientation", "explanation", "application", "check_understanding"],
        [
          beat("orientation", "reflect", {
            promptFields: [
              "self_explanation_prompt",
              "conceptual_contrast_prompt",
              "intellectual_coherence_bridge"
            ],
            take: 0
          }),
          beat("explanation", "explain", {
            materialTypes: ["text", "modelling_note"],
            materialOrder: ["text", "modelling_note"],
            take: 2
          }),
          beat("application", "practise", {
            materialTypes: ["prompt_set"],
            take: 1
          }),
          beat("check_understanding", "check", {
            materialTypes: ["checklist"],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      )
    ])
  }),
  analyse: Object.freeze({
    variants: Object.freeze([
      variant(
        "analyse-model-analyse-check",
        ["orientation", "worked_example", "analysis", "check_understanding"],
        [
          beat("orientation", "reflect", {
            promptFields: [
              "conceptual_contrast_prompt",
              "self_explanation_prompt",
              "intellectual_coherence_bridge"
            ],
            take: 0
          }),
          beat("worked_example", "model", {
            materialTypes: ["worked_example"],
            take: 1
          }),
          beat("analysis", "practise", {
            materialTypes: ["scenario", "analysis_table"],
            materialOrder: ["scenario", "analysis_table"],
            take: 3
          }),
          beat("check_understanding", "check", {
            materialTypes: ["checklist"],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      )
    ])
  }),
  apply: Object.freeze({
    variants: Object.freeze([
      variant(
        "apply-model-practise-transfer",
        ["orientation", "worked_example", "practice", "reflection"],
        [
          beat("orientation", "reflect", {
            promptFields: [
              "self_explanation_prompt",
              "conceptual_contrast_prompt",
              "intellectual_coherence_bridge"
            ],
            take: 0
          }),
          beat("worked_example", "model", {
            materialTypes: ["worked_example"],
            take: 2
          }),
          beat("practice", "practise", {
            materialTypes: ["scenario", "decision_table", "checklist"],
            materialOrder: ["scenario", "decision_table", "checklist"],
            take: 3,
            includeExpectedOutput: true
          }),
          beat("reflection", "transfer", {
            promptFields: ["transfer_or_application_task"],
            take: 0
          })
        ]
      )
    ])
  }),
  evaluate: Object.freeze({
    variants: Object.freeze([
      variant(
        "evaluate-explain-model-practise-transfer",
        ["orientation", "comparison", "evaluation", "reflection"],
        [
          beat("orientation", "explain", {
            materialTypes: ["text"],
            promptFields: ["intellectual_coherence_bridge"],
            take: 1
          }),
          beat("comparison", "model", {
            materialTypes: ["scenario", "sample_output"],
            materialOrder: ["scenario", "sample_output"],
            take: 1
          }),
          beat("evaluation", "practise", {
            materialTypes: ["comparison_table", "template", "checklist"],
            materialOrder: ["comparison_table", "template", "checklist"],
            promptFields: ["argument_structure_hint"],
            take: 3,
            includeExpectedOutput: true
          }),
          beat("reflection", "transfer", {
            materialTypes: ["consolidation_summary", "transfer_prompt"],
            materialOrder: ["consolidation_summary", "transfer_prompt"],
            promptFields: ["transfer_or_application_task"],
            take: "rest"
          })
        ]
      )
    ])
  })
});

function selectArchetypeVariant(archetype, sourceFunctions) {
  var family = ARCHETYPE_RULES[String(archetype || "")];
  if (!family) return null;
  var signature = JSON.stringify(sourceFunctions || []);
  for (var i = 0; i < family.variants.length; i += 1) {
    if (JSON.stringify(family.variants[i].beatSequence) === signature) {
      return family.variants[i];
    }
  }
  return null;
}

module.exports = {
  ARCHETYPE_RULES: ARCHETYPE_RULES,
  selectArchetypeVariant: selectArchetypeVariant
};
