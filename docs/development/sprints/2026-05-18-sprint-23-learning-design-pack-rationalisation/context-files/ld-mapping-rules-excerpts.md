# LD mappingRules excerpts (snapshot)

**Canonical source (authoritative):**  
`domains/learning-design/domain-learning-design-step-patterns.md` — `workflowBriefConfig.mappingRules` (approx. lines **1276–1465**)

**Why this matters for Sprint 23:** `mappingRules` declare how brief factors become **workflow constraints** and **stepParams**. They are **not** auto-promoted to Settings controls (Sprint 22 rule). Sprint 23 ensures every important `mapsTo` target has a deliberate UI owner (elicitation, Settings, or PF).

---

## Assessment-related rules

```json
{
  "factor": "assessment_strategy",
  "mapsTo": ["workflow.workflowOutputSpec.constraints.assessment_strategy"]
},
{
  "factor": "coverage_scope",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.coverage_scope",
    "stepParams.step_design_assessment.coverage_scope"
  ]
},
{
  "factor": "cognitive_demand",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.cognitive_demand",
    "stepParams.step_design_assessment.cognitive_demand"
  ]
},
{
  "factor": "question_style_mix",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.question_style_mix",
    "stepParams.step_generate_assessment_items.question_style_mix"
  ]
},
{
  "factor": "assessment_type",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.assessment_type",
    "stepParams.step_design_assessment.activity_type"
  ]
},
{
  "factor": "difficulty_profile",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.difficulty_profile",
    "stepParams.step_design_assessment.difficulty_profile",
    "stepParams.step_generate_assessment_items.difficulty_profile"
  ]
},
{
  "factor": "assessment_total_items",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.assessment_total_items",
    "stepParams.step_design_assessment.total_items",
    "stepParams.step_generate_assessment_items.number_of_items"
  ]
},
{
  "factor": "assessment_cadence",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.assessment_cadence",
    "stepParams.step_design_assessment.assessment_cadence"
  ]
}
```

**Naming note:** Brief factor `assessment_type` maps to step param `activity_type` — intentional alias to track in Slice 23-5.

---

## Workflow constraints (delivery / scope)

```json
{
  "factor": "design_scope",
  "mapsTo": ["workflow.workflowOutputSpec.constraints.design_scope"]
},
{
  "factor": "delivery_context",
  "mapsTo": ["workflow.workflowOutputSpec.constraints.delivery_context"]
},
{
  "factor": "input_strategy",
  "mapsTo": ["workflow.workflowOutputSpec.constraints.input_strategy"]
},
{
  "factor": "duration_minutes",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.duration_minutes",
    "stepParams.step_construct_learning_sequence.duration_minutes"
  ]
}
```

---

## Activity design

```json
{
  "factor": "activity_pattern_mix",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.activity_pattern_mix",
    "stepParams.step_design_learning_activities.activity_pattern_mix"
  ]
}
```

---

## Sequencing

```json
{
  "factor": "sequencing_granularity",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.sequencing_granularity",
    "stepParams.step_construct_learning_sequence.sequencing_granularity"
  ]
}
```

---

## Page / materials (representative)

```json
{
  "factor": "page_profile",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.page_profile",
    "stepParams.step_design_page.page_profile"
  ]
},
{
  "factor": "session_materials",
  "mapsTo": [
    "workflow.workflowOutputSpec.constraints.session_materials",
    "stepParams.step_generate_activity_materials.session_materials"
  ]
}
```
