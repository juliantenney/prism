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
        "understand-orient-explain-check",
        ["orientation", "explanation", "check"],
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
            materialTypes: ["text", "worked_example", "modelling_note"],
            materialOrder: ["text", "worked_example", "modelling_note"],
            take: 2
          }),
          beat("check", "check", {
            materialTypes: [
              "sample_output",
              "classification_table",
              "analysis_table",
              "comparison_table",
              "checklist"
            ],
            materialOrder: [
              "sample_output",
              "classification_table",
              "analysis_table",
              "comparison_table",
              "checklist"
            ],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      ),
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
      ),
      variant(
        "understand-explain-model-practise-verify",
        ["explanation", "worked_thinking", "guided_practice", "verification"],
        [
          beat("explanation", "explain", {
            materialTypes: ["text"],
            take: 0
          }),
          beat("worked_thinking", "model", {
            materialTypes: ["worked_example", "sample_output", "modelling_note"],
            materialOrder: ["worked_example", "sample_output", "modelling_note"],
            take: 0
          }),
          beat("guided_practice", "practise", {
            materialTypes: [
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "scenario",
              "prompt_set",
              "template"
            ],
            materialOrder: [
              "scenario",
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "prompt_set",
              "template"
            ],
            take: 0
          }),
          beat("verification", "check", {
            materialTypes: ["checklist"],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      ),
      variant(
        "understand-explain-model-verify",
        ["explanation", "worked_thinking", "verification"],
        [
          beat("explanation", "explain", {
            materialTypes: ["text"],
            take: 0
          }),
          beat("worked_thinking", "model", {
            materialTypes: ["worked_example", "sample_output", "modelling_note"],
            materialOrder: ["worked_example", "sample_output", "modelling_note"],
            take: 0
          }),
          beat("verification", "check", {
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
        "analyse-orient-investigate-synthesise",
        ["orientation", "investigation", "synthesis"],
        [
          beat("orientation", "reflect", {
            promptFields: [
              "conceptual_contrast_prompt",
              "self_explanation_prompt",
              "intellectual_coherence_bridge"
            ],
            take: 0
          }),
          beat("investigation", "practise", {
            materialTypes: [
              "text",
              "worked_example",
              "modelling_note",
              "scenario",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "classification_table",
              "planning_table",
              "prompt_set",
              "template"
            ],
            materialOrder: [
              "text",
              "modelling_note",
              "worked_example",
              "scenario",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "classification_table",
              "planning_table",
              "prompt_set",
              "template"
            ],
            take: 3
          }),
          beat("synthesis", "check", {
            materialTypes: ["checklist", "consolidation_summary", "sample_output"],
            materialOrder: ["sample_output", "consolidation_summary", "checklist"],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      ),
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
      ),
      variant(
        "analyse-explain-model-practise-verify",
        ["explanation", "worked_thinking", "guided_practice", "verification"],
        [
          beat("explanation", "explain", {
            materialTypes: ["text"],
            take: 0
          }),
          beat("worked_thinking", "model", {
            materialTypes: ["worked_example", "sample_output", "modelling_note"],
            materialOrder: ["worked_example", "sample_output", "modelling_note"],
            take: 0
          }),
          beat("guided_practice", "practise", {
            materialTypes: [
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "scenario",
              "prompt_set",
              "template"
            ],
            materialOrder: [
              "scenario",
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "prompt_set",
              "template"
            ],
            take: 0
          }),
          beat("verification", "check", {
            materialTypes: ["checklist"],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      ),
      variant(
        "analyse-model-practise-verify",
        ["worked_thinking", "guided_practice", "verification"],
        [
          beat("worked_thinking", "model", {
            materialTypes: ["text", "worked_example", "sample_output", "modelling_note"],
            materialOrder: ["text", "worked_example", "modelling_note", "sample_output"],
            take: 0
          }),
          beat("guided_practice", "practise", {
            materialTypes: [
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "scenario",
              "prompt_set",
              "template"
            ],
            materialOrder: [
              "scenario",
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "prompt_set",
              "template"
            ],
            take: 0
          }),
          beat("verification", "check", {
            materialTypes: ["checklist"],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      ),
      variant(
        "analyse-explain-practise-verify",
        ["explanation", "guided_practice", "verification"],
        [
          beat("explanation", "explain", {
            materialTypes: ["text", "worked_example", "modelling_note"],
            materialOrder: ["text", "worked_example", "modelling_note"],
            take: 0
          }),
          beat("guided_practice", "practise", {
            materialTypes: [
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "scenario",
              "prompt_set",
              "template"
            ],
            materialOrder: [
              "scenario",
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "prompt_set",
              "template"
            ],
            take: 0
          }),
          beat("verification", "check", {
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
        "apply-orient-practise-feedback",
        ["orientation", "practice", "feedback"],
        [
          beat("orientation", "reflect", {
            materialTypes: ["text"],
            promptFields: [
              "self_explanation_prompt",
              "conceptual_contrast_prompt",
              "intellectual_coherence_bridge"
            ],
            take: 1
          }),
          beat("practice", "practise", {
            materialTypes: [
              "scenario",
              "worked_example",
              "modelling_note",
              "planning_table",
              "decision_table",
              "classification_table",
              "analysis_table",
              "comparison_table",
              "prompt_set",
              "template"
            ],
            materialOrder: [
              "scenario",
              "worked_example",
              "modelling_note",
              "planning_table",
              "decision_table",
              "classification_table",
              "analysis_table",
              "comparison_table",
              "prompt_set",
              "template"
            ],
            take: 2
          }),
          beat("feedback", "check", {
            materialTypes: ["checklist", "sample_output"],
            materialOrder: ["sample_output", "checklist"],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      ),
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
      ),
      variant(
        "apply-explain-practise-verify",
        ["explanation", "guided_practice", "verification"],
        [
          beat("explanation", "explain", {
            materialTypes: ["text"],
            take: 0
          }),
          beat("guided_practice", "practise", {
            materialTypes: [
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "scenario",
              "prompt_set",
              "template"
            ],
            materialOrder: [
              "scenario",
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "prompt_set",
              "template"
            ],
            take: 0
          }),
          beat("verification", "check", {
            materialTypes: ["checklist"],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      )
    ])
  }),
  evaluate: Object.freeze({
    variants: Object.freeze([
      variant(
        "evaluate-orient-judge-reflect",
        ["orientation", "judgement", "reflection"],
        [
          beat("orientation", "reflect", {
            materialTypes: ["text"],
            promptFields: [
              "self_explanation_prompt",
              "conceptual_contrast_prompt",
              "intellectual_coherence_bridge"
            ],
            take: 1
          }),
          beat("judgement", "practise", {
            materialTypes: [
              "scenario",
              "worked_example",
              "decision_table",
              "comparison_table",
              "template",
              "planning_table",
              "prompt_set"
            ],
            materialOrder: [
              "scenario",
              "worked_example",
              "decision_table",
              "comparison_table",
              "template",
              "planning_table",
              "prompt_set"
            ],
            take: 4
          }),
          beat("reflection", "check", {
            materialTypes: ["checklist", "transfer_prompt", "consolidation_summary"],
            materialOrder: ["checklist", "consolidation_summary", "transfer_prompt"],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      ),
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
      ),
      variant(
        "evaluate-explain-judgement-practise-transfer-verify",
        ["explanation", "worked_judgement", "guided_practice", "transfer", "verification"],
        [
          beat("explanation", "explain", {
            materialTypes: ["text"],
            take: 0
          }),
          beat("worked_judgement", "model", {
            materialTypes: ["worked_example", "sample_output", "modelling_note", "scenario"],
            materialOrder: ["worked_example", "scenario", "modelling_note", "sample_output"],
            take: 0
          }),
          beat("guided_practice", "practise", {
            materialTypes: [
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "template",
              "prompt_set"
            ],
            materialOrder: [
              "decision_table",
              "comparison_table",
              "analysis_table",
              "classification_table",
              "planning_table",
              "template",
              "prompt_set"
            ],
            take: 0
          }),
          beat("transfer", "transfer", {
            materialTypes: ["transfer_prompt", "consolidation_summary"],
            materialOrder: ["transfer_prompt", "consolidation_summary"],
            take: 0
          }),
          beat("verification", "check", {
            materialTypes: ["checklist"],
            take: "rest",
            includeExpectedOutput: true
          })
        ]
      ),
      variant(
        "evaluate-explain-model-practise-transfer-verify",
        ["explanation", "worked_thinking", "guided_practice", "transfer", "verification"],
        [
          beat("explanation", "explain", {
            materialTypes: ["text"],
            take: 0
          }),
          beat("worked_thinking", "model", {
            materialTypes: ["worked_example", "sample_output", "modelling_note", "scenario"],
            materialOrder: ["worked_example", "scenario", "modelling_note", "sample_output"],
            take: 0
          }),
          beat("guided_practice", "practise", {
            materialTypes: [
              "classification_table",
              "analysis_table",
              "decision_table",
              "comparison_table",
              "planning_table",
              "template",
              "prompt_set"
            ],
            materialOrder: [
              "decision_table",
              "comparison_table",
              "analysis_table",
              "classification_table",
              "planning_table",
              "template",
              "prompt_set"
            ],
            take: 0
          }),
          beat("transfer", "transfer", {
            materialTypes: ["transfer_prompt", "consolidation_summary"],
            materialOrder: ["transfer_prompt", "consolidation_summary"],
            take: 0
          }),
          beat("verification", "check", {
            materialTypes: ["checklist"],
            take: "rest",
            includeExpectedOutput: true
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
