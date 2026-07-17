# Learner renderer vNext: model review milestone

This milestone implements source validation and the canonical page-model builder
only. It contains no HTML renderer, CSS, legacy integration, feature selector,
post-render mutation, or dependency on the legacy beat planners.

## 1. Module boundary

Implemented:

```text
lib/learner-renderer-vnext/
  index.js
  types.js
  labels.js
  archetype-rules.js
  validate-input.js
  validate-model.js
  parse-learner-task.js
  parse-material.js
  build-page-model.js
  build-activity-model.js
  build-beat-model.js
  MODEL_REVIEW.md
```

Deferred until model approval:

```text
  render-page.js
  render-activity.js
  render-beat.js
  render-material.js
  legacy/vNext feature selection
```

`types.js` is the exact JSDoc contract. Rendering will receive
`LearnerPageModel`; it will not receive the source page.

## 2. Deterministic assignment rules

Variants require an exact match on both `episode_plan.archetype` and the full
ordered `activity.episode_plan.beats[].function` sequence. Unsupported shapes
are errors. There is no nearest match.

### `understand`: orientation, explanation, check_understanding

- orientation: role `reflect`; 0 task steps; prompt fields
  `self_explanation_prompt`, `conceptual_contrast_prompt`,
  `intellectual_coherence_bridge`; no material types.
- explanation: role `explain`; next 1 task step; `text`.
- check_understanding: role `check`; all remaining task steps;
  `worked_example`, `sample_output`, `checklist`; expected output.

### `understand`: orientation, explanation, application, check_understanding

- orientation: role `reflect`; 0 task steps; orientation prompt fields.
- explanation: role `explain`; next 2 task steps; `text`, `modelling_note`.
- application: role `practise`; next 1 task step; `prompt_set`.
- check_understanding: role `check`; all remaining task steps; `checklist`;
  expected output.

### `analyse`: orientation, worked_example, analysis, check_understanding

- orientation: role `reflect`; 0 task steps; orientation prompt fields.
- worked_example: role `model`; next 1 task step; `worked_example`.
- analysis: role `practise`; next 3 task steps; material order `scenario`,
  then `analysis_table`.
- check_understanding: role `check`; all remaining task steps; `checklist`;
  expected output.

### `apply`: orientation, worked_example, practice, reflection

- orientation: role `reflect`; 0 task steps; orientation prompt fields.
- worked_example: role `model`; next 2 task steps; `worked_example`.
- practice: role `practise`; next 3 task steps; material order `scenario`,
  `decision_table`, `checklist`; expected output.
- reflection: role `transfer`; 0 task steps;
  `transfer_or_application_task`.

### `evaluate`: orientation, comparison, evaluation, reflection

- orientation: role `explain`; next 1 task step; `text`;
  `intellectual_coherence_bridge`.
- comparison: role `model`; next 1 task step; material order `scenario`,
  `sample_output`.
- evaluation: role `practise`; next 3 task steps; material order
  `comparison_table`, `template`, `checklist`; expected output;
  `argument_structure_hint`.
- reflection: role `transfer`; all remaining task steps; material order
  `consolidation_summary`, `transfer_prompt`;
  `transfer_or_application_task`.

Numbered learner-task entries are never split. For A5, source step 5 remains
one instruction in the evaluation beat; source step 6 is the reflection
instruction. Material ordering independently places A5-M8 before A5-M7.

## 3. Validation contract

Hard errors:

- invalid page or activities shape;
- missing or duplicate activity IDs;
- missing activity-local episode plans;
- missing or duplicate material IDs, including cross-activity duplicates;
- unknown material types without a registered future renderer;
- missing or repeated activities in the learning sequence;
- unsupported archetype/beat-sequence variants;
- materials matching zero or multiple declared beat rules;
- task allocation requesting unavailable steps;
- unassigned or multiply assigned task steps;
- prompt fields matching multiple beat rules;
- expected output matching zero or multiple beat rules;
- source-to-model material, task-step, or expected-output closure failures;
- any empty beat found in the renderable model.

Warnings:

- an activity omitted from the learning sequence is appended in source order;
- an optional prompt field has no mapping in the selected rule;
- an empty episode-plan entry is omitted from renderable beats.

Material ambiguity diagnostics include:

```js
{
  activityId,
  materialId,
  materialType,
  candidateBeats
}
```

## 4. Expected A1 activity model

The complete material objects retain source `id`, `type`, `title`,
`bodyFormat`, verbatim `body`, source order, and parsed checklist data. The
assignment projection is:

```js
{
  id: "A1",
  title: "Defining Heteroscedasticity and Homoscedasticity",
  durationMinutes: 12,
  grouping: "individual",
  preamble: "You will build a foundational mental model ...",
  reasoningOrientation: "Focus on the spread of errors ...",
  beats: [
    {
      sourceFunction: "orientation",
      learnerRole: "reflect",
      learnerLabel: "Reflect",
      instructions: [],
      prompts: [{
        sourceField: "self_explanation_prompt",
        text: "How would you explain to a fellow economics student why two regressions can have residuals but only one exhibits heteroscedasticity?"
      }],
      materials: [],
      expectedOutput: null
    },
    {
      sourceFunction: "explanation",
      learnerRole: "explain",
      learnerLabel: "Understand",
      instructions: [{ sourceStepNumber: 1, text: "Study the explanatory text introducing residuals, homoscedasticity, and heteroscedasticity." }],
      prompts: [],
      materials: ["A1-M1"],
      expectedOutput: null
    },
    {
      sourceFunction: "check_understanding",
      learnerRole: "check",
      learnerLabel: "Check your work",
      instructions: [
        { sourceStepNumber: 2, text: "Work through the expert example showing how residual variance changes across observations." },
        { sourceStepNumber: 3, text: "Compare the sample response with the explanation." },
        { sourceStepNumber: 4, text: "Complete the self-check and identify one misconception you previously held or might have held." },
        { sourceStepNumber: 5, text: "Write a brief explanation distinguishing homoscedasticity from heteroscedasticity in your own words." }
      ],
      prompts: [],
      materials: ["A1-M2", "A1-M3", "A1-M4"],
      expectedOutput: { text: "A successful response clearly defines both homoscedasticity and heteroscedasticity, ..." }
    }
  ]
}
```

## 5. Expected A5 activity model

```js
{
  id: "A5",
  title: "Comparing Detection and Remedy Approaches",
  durationMinutes: 10,
  grouping: "individual",
  preamble: "This capstone activity asks you to judge ...",
  reasoningOrientation: "There is rarely a single universally correct response. ...",
  beats: [
    {
      sourceFunction: "orientation",
      learnerRole: "explain",
      learnerLabel: "Understand",
      instructions: [{ sourceStepNumber: 1, text: "Study the criteria for evaluating detection and remedy approaches." }],
      prompts: [{ sourceField: "intellectual_coherence_bridge", text: "You have moved from defining heteroscedasticity ..." }],
      materials: ["A5-M1"],
      expectedOutput: null
    },
    {
      sourceFunction: "comparison",
      learnerRole: "model",
      learnerLabel: "See it modelled",
      instructions: [{ sourceStepNumber: 2, text: "Review the research scenarios and the worked judgement example." }],
      prompts: [],
      materials: ["A5-M2", "A5-M3"],
      expectedOutput: null
    },
    {
      sourceFunction: "evaluation",
      learnerRole: "practise",
      learnerLabel: "Your turn",
      instructions: [
        { sourceStepNumber: 3, text: "Complete the comparison and decision framework." },
        { sourceStepNumber: 4, text: "Produce an independent written judgement recommending an approach and defending your reasoning." },
        { sourceStepNumber: 5, text: "Complete the final verification checklist and read the session consolidation summary." }
      ],
      prompts: [{ sourceField: "argument_structure_hint", text: "State the issue, apply evaluation criteria, weigh trade-offs, reach a recommendation, and justify the conclusion." }],
      materials: ["A5-M4", "A5-M5", "A5-M6"],
      expectedOutput: { text: "Produce a reasoned recommendation that evaluates evidence, ..." }
    },
    {
      sourceFunction: "reflection",
      learnerRole: "transfer",
      learnerLabel: "Apply elsewhere",
      instructions: [{ sourceStepNumber: 6, text: "Complete the transfer task." }],
      prompts: [],
      materials: ["A5-M8", "A5-M7"],
      expectedOutput: null
    }
  ]
}
```

The executable exact A1 assertion and A5 assignment assertion are in
`tests/learner-renderer-vnext-model.test.js`.
