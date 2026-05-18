# Design Assessment — pack metadata & PF excerpts

**Canonical source (authoritative):**  
`domains/learning-design/domain-learning-design-step-patterns.md`

| Section | Approx. lines |
|---------|----------------|
| Pack graph / dependencies | **49–118**, **263** |
| `stepParameterControls` (assessment) | **956–1008** |
| `mappingRules` (assessment factors) | **1334–1409** |
| **§7. Design Assessment** — PF config | **2395–2559** |
| **§9. Generate Assessment Items** — PF config | **2654–2778+** |

**Why this matters for Sprint 23:** **Priority review area.** Design Assessment is the assessment **blueprint** step; Generate Assessment Items **inherits** settings via runtime helpers. Pack `userOptions` use keys like `difficulty_level` and `coverage_breadth` while inheritance maps `activity_type` / `total_items` — vocabulary alignment is a core Sprint 23 task.

---

## Workflow graph (assessment chain)

```text
Design Assessment  →  produces assessment_blueprint
Generate Assessment Items  →  requires learning_outcomes OR assessment_blueprint
```

Pack dependency excerpt (conceptual): `["Design Assessment", "Generate Assessment Items"]` in step ordering rules.

---

## stepParameterControls vs PF userOptions (overlap)

| Concern | `stepParameterControls` key | PF `userOptions` id | Notes |
|---------|----------------------------|---------------------|--------|
| Question strategy | `activity_type` | `activity_type` | Aligned labels |
| Item count | `total_items` | `total_items` | Aligned |
| Difficulty | — (no control) | `difficulty_level` | PF only; maps via runtime to generate-items `difficulty_profile` |
| Coverage | — (no control) | `coverage_breadth` | PF only; maps to `coverage_mode` on generate step |
| Feedback display | — | `feedback_display` | PF only; not in Settings metadata |

---

## PF excerpt — Design Assessment userOptions (core)

```json
"configurationMode": "simple",
"userOptions": [
  {
    "id": "activity_type",
    "label": "Question strategy",
    "type": "select",
    "default": "mcq"
  },
  {
    "id": "feedback_display",
    "label": "Feedback display",
    "type": "select",
    "default": "answer_grid_end"
  },
  {
    "id": "difficulty_level",
    "label": "Difficulty level",
    "type": "select",
    "default": "moderate",
    "choices": ["introductory", "moderate", "advanced"]
  },
  {
    "id": "coverage_breadth",
    "label": "Coverage breadth",
    "type": "select",
    "default": "balanced",
    "choices": ["narrow", "balanced", "broad"]
  },
  {
    "id": "total_items",
    "label": "Total assessment items",
    "type": "number",
    "default": 10
  }
]
```

Prompt template placeholders: `{{option:activity_type}}`, `{{option:feedback_display}}`, `{{option:difficulty_level}}`, `{{option:coverage_breadth}}`, `{{option:total_items}}`.

---

## PF excerpt — Generate Assessment Items (subset)

Pack declares richer `userOptions` than `stepParameterControls` (only `number_of_items` in Settings metadata):

```json
"userOptions": [
  { "id": "number_of_items", "label": "Number of items", "type": "number", "default": 10 },
  { "id": "response_formats", "label": "Allowed response formats", "type": "select", "default": "single_answer_mcq" },
  { "id": "difficulty_profile", "label": "Difficulty profile", "type": "select", "default": "balanced" }
]
```

(Full list includes `composition_mode`, `stimulus_mode`, `scenario_scope`, `cognitive_emphasis`, `feedback_mode`, etc. — see live pack §9.)

---

## mappingRules targets (assessment-related)

```json
{ "factor": "assessment_type", "mapsTo": [
    "workflow.workflowOutputSpec.constraints.assessment_type",
    "stepParams.step_design_assessment.activity_type"
]},
{ "factor": "assessment_total_items", "mapsTo": [
    "workflow.workflowOutputSpec.constraints.assessment_total_items",
    "stepParams.step_design_assessment.total_items",
    "stepParams.step_generate_assessment_items.number_of_items"
]},
{ "factor": "difficulty_profile", "mapsTo": [
    "workflow.workflowOutputSpec.constraints.difficulty_profile",
    "stepParams.step_design_assessment.difficulty_profile",
    "stepParams.step_generate_assessment_items.difficulty_profile"
]}
```

**Sprint 23 question:** Should `difficulty_profile` / `coverage_scope` / `cognitive_demand` gain `stepParameterControls`, move to workflow-level controls, or stay PF-only with documented inheritance?
