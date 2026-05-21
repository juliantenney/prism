# Renderer semantics notes (investigation draft)

**Sprint:** 29-0  
**Date:** 2026-05-21  
**Status:** Documentation only — **no CSS shipped**

---

## 1. Renderer semantics vs pedagogic generation

```text
Brief (E) → Topology (O) → Generation (G) → Composition (C) → Renderer (R)
                              ↑ authoritative pedagogy          ↑ presentation only
```

- **Pedagogy** is decided upstream (DLA/GAM prompts, activity JSON, materials).
- **Composition** ensures cognition fields and section order exist on the `page` artefact.
- **Renderer** maps existing JSON to HTML — it must not invent tasks, phases, or assessment items.

**Illustration pipeline (future):** Generated diagrams and figures are **not** renderer semantics; they would be separate assets referenced from materials or pages.

---

## 2. Current renderer behaviour (code audit)

**Primary path:** `renderLearningActivitiesBlocks` in `app.js`.

**Explicit activity row fields rendered:**

| Field | Presentation |
|-------|----------------|
| `title` | `h3` in `util-activity-header` |
| `duration_minutes`, `grouping` | `util-badge` row |
| `purpose` / task summary | One-line **Task:** paragraph |
| `learner_task` | **What to do** block + markdown |
| `learner_instructions` | **Guidance** (if distinct) |
| `materials` | Typed material renderers (task cards, scenarios, prompts, …) |
| `expected_output` | `util-output-block` |
| `support_note` / facilitator notes | Support paragraph |

**Sprint 28 cognition fields — not in explicit allow-list:**

- `reasoning_revision_prompt`, `initial_position_prompt`, `revision_trigger`
- `misconception_claim`, `reconciliation_prompt`, `evidence_contrast`
- `transformation_activity`, `source_to_application_prompt`
- `self_explanation_prompt`, `transfer_or_application_task`
- `scaffold_hint_sequence`, `uncertainty_tension_prompt`

**Effect:** Fields exist in JSON (post-5d probes) but render as **undifferentiated text** unless copied into `learner_task` or materials. This is the core **flattening** finding (R29-H3).

**Composition metadata:** `page.metadata.cognition_profile` is set by `applyPedagogicCognitionSemanticsToComposedPage` but **not read** by renderer in 29-0 codebase.

**Assessment path:** `assessment_check` items use dedicated stems/options styling; Sprint 27 `feedback_display` controls reflection/answer blocks — **separate** from activity cognition.

---

## 3. Candidate semantic classes (implementation spec placeholder)

| Class | BEM-style hook (proposed) | Fields | Visual intent |
|-------|---------------------------|--------|---------------|
| `reasoning-revision` | `util-cognition util-cognition--revision` | revision trio | Three-step mini-rail: position → discuss → revise |
| `misconception-repair` | `util-cognition util-cognition--repair` | claim, reconciliation, contrast | Warning callout + repair + side-by-side evidence |
| `productive-uncertainty` | `util-cognition util-cognition--uncertainty` | `uncertainty_tension_prompt` | Left border accent; “explore tension” label |
| `evidence-contrast` | `util-cognition util-cognition--contrast` | `evidence_contrast` | Two-column or stacked compare |
| `self-explanation` | `util-cognition util-cognition--explain` | `self_explanation_prompt` | Reflective panel, softer surface |
| `transfer-application` | `util-cognition util-cognition--transfer` | `transfer_or_application_task` | Application badge + task body |
| `scaffold-sequence` | `util-cognition util-cognition--scaffold` | `scaffold_hint_sequence` | Ordered list / numbered hints |
| `reflection-cycle` | (assessment CSS) | N/A — uses `feedback_display` | Existing Sprint 27 patterns |

**Design rules:**

- One primary class per activity (derived from `cognition_profile.pack_ids` or first matching field).
- Secondary fields render as labelled sub-blocks inside the activity card — not merged into `learner_task`.
- Print-safe: borders and weight, not colour-only signalling.
- Degrade: unknown/missing → omit cognition chrome; show `learner_task` only.

---

## 4. Semantic rendering opportunities (lightweight)

| Field | Opportunity | Avoid |
|-------|-------------|-------|
| `misconception_claim` | Contrast/warning callout, icon `fa-triangle-exclamation` | Alarmist red flood |
| `reasoning_revision_prompt` | “Revise your thinking” subheading + distinct surface | Duplicate MCQ styling |
| `uncertainty_tension_prompt` | Exploratory accent, question-first layout | Competing with assessment |
| `evidence_contrast` | Comparison layout (claim vs evidence) | Wide tables on mobile |
| `scaffold_hint_sequence` | Progressive numbered hints | Interactive reveal JS |
| `self_explanation_prompt` | Reflective annotation panel | Tutor avatar / chat UI |
| `transfer_or_application_task` | Professional-practice label | New workflow step |

---

## 5. Section-level semantics (existing)

| `section_id` | Current | Cognition note |
|--------------|---------|----------------|
| `learning_activities` | Puzzle icon, `util-task-block` stack | Primary target for field-level semantics |
| `assessment_check` | Clipboard icon, item list | Keep Sprint 27 dominance for answers policy |
| `overview` | Neutral | Unchanged |
| `learning_sequence` | Timeline chrome (Sprint 26) | Optional phase markers later |

---

## 6. Explicit non-goals (renderer programme)

- Not a visual redesign sprint  
- Not a branding refresh  
- Not illustration / diagram generation  
- Not motion or animation  
- Not adaptive UI or learner-state display  
- Not LMS replacement  
- Not new frontend framework  
- Not changes to G/C/E layers in Sprint 29  

---

## 7. Recommended implementation guardrails (29-3 preview)

1. New function: `renderCognitionFieldsForActivity(row, profile)` called from `renderLearningActivitiesBlocks` **after** header, **before** materials.
2. Gate on `metadata.cognition_profile.active` or presence of any cognition key on row.
3. Fixture: extend kitchen sink or add `renderer-cognition-page.json` with one row per class.
4. Tests: HTML contains class hooks; no regression on P27 assessment visibility tests.
