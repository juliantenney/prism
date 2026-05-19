# LD step trigger reference (canonical)

**Authoritative:** `domains/learning-design/domain-learning-design-step-patterns.md`  
**Why it matters:** Investigation must use **canonical titles** and **canonical_step_id** consistently.

---

## Activity / material chain (topology-critical)

| Display title | Typical `canonical_step_id` | Input artefact | Output artefact |
|---------------|----------------------------|----------------|-----------------|
| Normalize Content | `step_normalize_content` | source | `normalized_content` |
| Model Knowledge | `step_model_knowledge` | normalized / content | `knowledge_model` |
| Define Learning Outcomes | `step_define_learning_outcomes` | `knowledge_model` | `learning_outcomes` |
| **Design Learning Activities** | `step_design_learning_activities` | `learning_outcomes` | **`learning_activities`** |
| **Generate Activity Materials** | `step_generate_activity_materials` | **`learning_activities`** | **`activity_materials`**, `session_materials` |
| Generate Assessment Items | `step_generate_assessment_items` | outcomes / blueprint | `assessment_items` |
| Design Page | `step_design_page` | multiple optional | `page` |
| Construct Learning Sequence | `step_construct_learning_sequence` | activities + materials | `learning_sequence` |

Aliases (pack): "Generate Learning Activities", "Create Learning Activities", "Design Activities".

---

## Assessment chain (often strongly triggered)

| Display title | `canonical_step_id` | Notes |
|---------------|---------------------|-------|
| Design Assessment | `step_design_assessment` | Blueprint; often pruned on lean formative path |
| Generate Assessment Items | `step_generate_assessment_items` | Triggered by `assessment_required` pack rule |
| Design Feedback | `step_design_feedback` | Optional |
| Validate Learning Design | `step_validate_learning_design` | Often pruned on lean formative path |
| Design Marking Rubric | `step_design_marking_rubric` | Optional |

Sprint 23: **`assessment_required`** is workflow topology authority for assessment steps — see `ld-design-assessment-semantics.md`.

---

## Content generation alternate path

| Display title | `canonical_step_id` | When used |
|---------------|---------------------|-----------|
| Generate Learning Content | `step_generate_learning_content` | Topic-only / no authoritative source; gated by `allowGenerateLearningContent` |

Not a substitute for **Design Learning Activities** — different artefact (`learning_content` vs `learning_activities`).

---

## Phrase → step mapping (heuristic, not pack)

Runtime `hasIntent` regex buckets in `applyWorkflowDesignHeuristics` (~10152–10210):

| User language | Heuristic flag |
|---------------|----------------|
| quiz, MCQ, formative assessment, assessment items | `assessmentItemsRequested` |
| session, lesson, workshop, **activities**, tasks, exercise | `explicitSessionOrActivityRequested` |
| sequence, timed session | `sequenceRequested` |

**Gap:** "learning activities" as a phrase should match `activities` substring — verify word boundaries on actual brief.

---

## 26-1 checklist

- [ ] Confirm canonical_step_id on each observed workflow step row  
- [ ] Map omitted steps to prune rule or missing trigger include  
- [ ] Document whether model or heuristics removed activities first  
