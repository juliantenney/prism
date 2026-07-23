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
var ARCHETYPE_RULES = {
  understand: {
    variants: [
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
    ],
  },
  analyse: {
    variants: [
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
    ],
  },
  apply: {
    variants: [
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
    ],
  },
  evaluate: {
    variants: [
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
    ]
  }
};

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

function buildEpisodePlanV1Variant(archetype, beatSequence) {
  var hasTransfer = beatSequence.indexOf("transfer") !== -1;
  var hasExample = beatSequence.indexOf("example") !== -1;
  var hasExplanation = beatSequence.indexOf("explanation") !== -1;
  var beats = beatSequence.map(function (sourceFunction) {
    var role = V1_LEARNER_ROLE_BY_FUNCTION[sourceFunction] || "explain";
    var options = { take: 0, materialTypes: [], promptFields: [] };

    if (sourceFunction === "orientation") {
      options.promptFields = [
        "self_explanation_prompt",
        "conceptual_contrast_prompt",
        "intellectual_coherence_bridge"
      ];
    }
    if (sourceFunction === "explanation") {
      options.materialTypes = ["text", "modelling_note"];
      options.materialOrder = ["text", "modelling_note"];
    }
    if (sourceFunction === "criteria_exposition" && !hasExplanation) {
      options.materialTypes = ["text", "modelling_note"];
      options.materialOrder = ["text", "modelling_note"];
    }
    if (sourceFunction === "example") {
      options.materialTypes = ["worked_example"];
    }
    if (sourceFunction === "worked_thinking" && !hasExample) {
      options.materialTypes = hasExplanation
        ? ["worked_example", "sample_output"]
        : ["worked_example", "sample_output", "modelling_note"];
      options.materialOrder = options.materialTypes.slice();
    }
    if (
      sourceFunction === "guided_practice" ||
      sourceFunction === "guided_inquiry" ||
      sourceFunction === "guided_reasoning"
    ) {
      // Prefer guided_practice when present; otherwise first guided_* beat owns scaffolds.
      var guidedOwner =
        beatSequence.indexOf("guided_practice") !== -1
          ? "guided_practice"
          : beatSequence.indexOf("guided_inquiry") !== -1
            ? "guided_inquiry"
            : "guided_reasoning";
      if (sourceFunction === guidedOwner) {
        options.materialTypes = [
          "scenario",
          "analysis_table",
          "comparison_table",
          "classification_table",
          "decision_table",
          "planning_table",
          "prompt_set",
          "template"
        ];
        options.materialOrder = options.materialTypes.slice();
      }
    }
    if (sourceFunction === "independent_performance") {
      options.take = "rest";
    }
    if (sourceFunction === "verification") {
      options.materialTypes = ["sample_output", "checklist"];
      options.materialOrder = ["sample_output", "checklist"];
      options.includeExpectedOutput = true;
    }
    if (sourceFunction === "transfer") {
      options.materialTypes = ["transfer_prompt", "consolidation_summary"];
      options.materialOrder = ["transfer_prompt", "consolidation_summary"];
      options.promptFields = ["transfer_or_application_task"];
    }
    if (sourceFunction === "reflection" && !hasTransfer) {
      options.materialTypes = ["transfer_prompt", "consolidation_summary"];
      options.materialOrder = ["transfer_prompt", "consolidation_summary"];
      options.promptFields = ["transfer_or_application_task"];
    }
    return beat(sourceFunction, role, options);
  });

  return variant(archetype + "-episode-plan-v1", beatSequence.slice(), beats);
}

Object.keys(EPISODE_PLAN_V1_SEQUENCES).forEach(function (archetype) {
  var family = ARCHETYPE_RULES[archetype];
  if (!family || !Array.isArray(family.variants)) return;
  var sequence = EPISODE_PLAN_V1_SEQUENCES[archetype];
  var already = family.variants.some(function (row) {
    return JSON.stringify(row.beatSequence) === JSON.stringify(sequence);
  });
  if (!already) {
    family.variants.push(buildEpisodePlanV1Variant(archetype, sequence));
  }
});

Object.keys(ARCHETYPE_RULES).forEach(function (archetype) {
  var family = ARCHETYPE_RULES[archetype];
  family.variants = Object.freeze(family.variants.slice());
  ARCHETYPE_RULES[archetype] = Object.freeze(family);
});
Object.freeze(ARCHETYPE_RULES);

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
  EPISODE_PLAN_V1_SEQUENCES: EPISODE_PLAN_V1_SEQUENCES,
  selectArchetypeVariant: selectArchetypeVariant
};
