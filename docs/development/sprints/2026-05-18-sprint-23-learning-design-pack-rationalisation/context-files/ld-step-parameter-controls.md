# LD stepParameterControls (snapshot)

**Canonical source (authoritative):**  
`domains/learning-design/domain-learning-design-step-patterns.md` — `workflowBriefConfig.stepParameterControls` (approx. lines **904–1274**)

**Why this matters for Sprint 23:** **25** pack-declared step controls drive unified Settings and PF pack rendering. Sprint 23 must resolve **gaps** where `mappingRules` target `stepParams` keys with **no** matching control (notably several `step_design_assessment` paths).

---

## Index (all 25 controls by canonical step)

| canonicalStepId | keys (count) |
|-----------------|--------------|
| `step_design_page` | `page_profile`, `tone_style`, `depth_level`, `include_examples` (4) |
| `step_design_assessment` | `activity_type`, `total_items` (**2 only**) |
| `step_generate_assessment_items` | `number_of_items` (1) |
| `step_normalize_content` | `structure_mode`, `detail_level`, `keep_examples` (3) |
| `step_model_knowledge` | `include_relationships`, `include_misconceptions`, `include_processes` (3) |
| `step_define_learning_outcomes` | `learnerLevel`, `numberOfOutcomes`, `cognitiveEmphasis`, `scope` (4) |
| `step_design_learning_activities` | `activity_pattern_mix`, `grouping_preference`, `difficulty_level`, `coverage_breadth` (4) |
| `step_generate_activity_materials` | `session_materials` (1) |
| `step_construct_learning_sequence` | `duration_minutes`, `sequencing_granularity`, `sequencing_style` (3) |

**Sprint 23 gap (assessment):** `mappingRules` also map to `step_design_assessment.coverage_scope`, `.cognitive_demand`, `.difficulty_profile`, `.assessment_cadence` — **no** `stepParameterControls` entries for those keys yet.

---

## Excerpt — assessment-related controls

```json
{
  "key": "activity_type",
  "canonicalStepId": "step_design_assessment",
  "label": "Question strategy",
  "description": "Assessment type for the blueprint (maps from brief assessment type).",
  "controlType": "select",
  "default": "mcq",
  "options": [
    { "value": "mcq", "label": "Selected response" },
    { "value": "short_answer", "label": "Short written response" },
    { "value": "essay", "label": "Extended response" },
    { "value": "problem", "label": "Problem-solving response" },
    { "value": "case_study", "label": "Scenario-based response" },
    { "value": "mixed", "label": "Mixed response types" }
  ],
  "visible": true,
  "advanced": false,
  "elicitation": "elicited"
},
{
  "key": "number_of_items",
  "canonicalStepId": "step_generate_assessment_items",
  "label": "Number of items",
  "description": "How many assessment items to generate.",
  "controlType": "number",
  "default": "10",
  "visible": true,
  "advanced": false,
  "elicitation": "elicited"
},
{
  "key": "total_items",
  "canonicalStepId": "step_design_assessment",
  "label": "Total assessment items",
  "description": "Total items/questions in the assessment blueprint.",
  "controlType": "number",
  "default": "10",
  "min": 1,
  "max": 200,
  "visible": true,
  "advanced": true,
  "elicitation": "settings-only"
}
```

---

## Excerpt — activity design + sequencing (representative)

```json
{
  "key": "activity_pattern_mix",
  "canonicalStepId": "step_design_learning_activities",
  "label": "Activity pattern mix",
  "controlType": "select",
  "default": "balanced",
  "elicitation": "settings-only"
},
{
  "key": "sequencing_granularity",
  "canonicalStepId": "step_construct_learning_sequence",
  "label": "Sequencing granularity",
  "controlType": "select",
  "default": "standard",
  "elicitation": "settings-only"
}
```

See live pack for full option lists and remaining step controls.
