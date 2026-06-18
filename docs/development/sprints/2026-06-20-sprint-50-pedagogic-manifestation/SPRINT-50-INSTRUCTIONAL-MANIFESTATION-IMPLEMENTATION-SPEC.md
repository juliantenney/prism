# Sprint 50 — Instructional Manifestation Implementation Specification

**Status:** Implementation target — validated model, scoped to Design Page compose + renderer  
**Authority:** Sprint 50 investigation artefacts in this folder  
**Mode:** Specification only — no code, no architecture redesign, no new pedagogic structures  
**Scope:** Self-directed learner-page workflow (`page_profile: learner`)

---

# Executive Summary

Sprint 50 implements a **linear instructional grammar** on the learner page by doing two things:

1. **Compose** — Guarantee that upstream DLA and GAM fields required for manifestation are **persisted on authoritative `page.json` activity rows** (existing merge path; strengthened persistence guarantee).
2. **Renderer** — Emit each activity as a **single-column sequence of labelled instructional sections** in fixed function order, with **one primary owner per function** and no duplicate Compass/cognition/framing signals.

The learner reads, in order when content exists:

**Why this activity → How to approach this → Read and model → [Explain before you check] → What to do → Check your work → What to take away → Apply elsewhere**

Page-level **Inquiry** and **What you will develop** precede the activity list. Optional page **What should now be clearer** follows all activities.

No upstream DLA/GAM/prompt/schema/gate work is in scope.

---

# Instructional Grammar

## Page level (once)

| Order | Learner-facing heading | Function | Source |
| ----- | ---------------------- | -------- | ------ |
| P1 | *(page title)* | — | `page.title` |
| P2 | **Inquiry** | Orient | `sections[].overview` |
| P3 | **What you will develop** | Orient | `sections[].learning_purpose` (or `learning_purpose_outcomes`) |
| P4 | **Key ideas preview** *(optional)* | Orient | `sections[].knowledge_summary` |
| P5 | **Activities** | — | `sections[].learning_activities` container |
| P6 | **What should now be clearer** *(optional)* | Reflect | `sections[].study_tips` |

## Activity level (repeat)

| Order | Learner-facing heading | Function | Mandatory? |
| ----- | ---------------------- | -------- | ---------- |
| A0 | *(activity title)* | — | Yes |
| A1 | **Why this activity** | Orient | When Orient content exists |
| A2 | **How to approach this** | Think | When Think content exists |
| A3 | **Read and model** | Study | When Study materials exist |
| A3b | **Explain before you check** | Reflect (pre-check) | Only when pre-check reflect content exists |
| A4 | **What to do** | Do | When Do content exists |
| A5 | **Check your work** | Check | When Check content exists |
| A6 | **What to take away** | Reflect (post-check) | When post-check reflect content exists |
| A7 | **Apply elsewhere** | Transfer | When Transfer content exists |
| A8 | **Watch for this mistake** *(optional)* | Think guard | When `support_note` exists and not redundant with Check |

**Branch rule:** Section A3b appears **only** when `self_explanation_prompt` (or equivalent generative reflect field) must be completed **before** the learner consults `sample_output` or `checklist`. Otherwise Reflect appears only at A6.

**Omission rule:** If a function has no source content after merge and material classification, **omit the section entirely** — do not render empty headings.

---

# Function Ownership Matrix

## Orient

| Role | Field / structure |
| ---- | ----------------- |
| **Primary (page)** | `sections[].overview` |
| **Secondary (page)** | `sections[].learning_purpose`, `sections[].knowledge_summary` |
| **Primary (activity)** | `activity_preamble` |
| **Secondary (activity)** | `orienting_preamble`, `activity_framing`, `purpose`, `intellectual_coherence_bridge`, `prior_knowledge_activation`, `prior_knowledge_prompt`, `study_orientation` (first activity only when page-level working guidance) |
| **Fallback** | Omit **Why this activity** section; page-level Inquiry still provides minimum Orient |

## Think

| Role | Field / structure |
| ---- | ----------------- |
| **Primary** | `reasoning_orientation` |
| **Secondary** | `reasoning_orientation_prompt`, `conceptual_contrast_prompt`, `argument_structure_hint`, `evidence_use_prompt`, `uncertainty_tension_prompt`, `disciplinary_lens`, `intellectual_frame`, `scaffold_hint_sequence` |
| **Think guard (adjacent to Check)** | `support_note`, `support_notes` |
| **Fallback** | Omit **How to approach this**; inline Study bridges may carry local Think |

## Study

| Role | Field / structure |
| ---- | ----------------- |
| **Primary** | `materials.text` |
| **Secondary (ordered within section)** | `materials.scenario`, `materials.scenarios`, `materials.worked_example`, `materials.worked_analytic_pass`, `materials.modelling_note`, `materials.sample_output` *(when positioned before learner attempt)* |
| **Embedded Think** | Cognition cues inline in non-text material bodies; material “Bridge” paragraphs |
| **Fallback** | Omit **Read and model**; activity may be Do-only if design intends (rare) |

## Do

| Role | Field / structure |
| ---- | ----------------- |
| **Primary** | `learner_task` |
| **Secondary** | `learner_instructions`, `instructions`, `materials.analysis_table`, `materials.comparison_table`, `materials.worksheet`, `materials.table`, `materials.template`, `materials.templates`, `materials.independent_judgement_template`, `materials.decision_table`, `materials.prompt_set`, `materials.prompts`, `ordering.learner_display_order` |
| **Fallback** | Omit **What to do** only if no task and no practice surfaces exist |

## Check

| Role | Field / structure |
| ---- | ----------------- |
| **Primary** | `materials.checklist`, `materials.checklists` |
| **Secondary** | `expected_output`, `materials.sample_output` *(when positioned as quality exemplar after attempt)* |
| **Fallback** | Omit **Check your work**; `expected_output` alone may constitute Check if no checklist |

## Reflect

| Role | Field / structure |
| ---- | ----------------- |
| **Primary (pre-check)** | `self_explanation_prompt` |
| **Primary (post-check)** | `materials.reflection_prompt`, `materials.consolidation_summary` |
| **Secondary** | Pack fields `reasoning_revision_prompt`, `reconciliation_prompt` when brief-active |
| **Page closure** | `sections[].study_tips` |
| **Fallback** | Omit Reflect sections when no reflect sources exist |

## Transfer

| Role | Field / structure |
| ---- | ----------------- |
| **Primary** | `materials.transfer_prompt`, `materials.transfer_prompt_evaluate` |
| **Secondary** | `transfer_or_application_task`, `source_to_application_prompt` |
| **Fallback** | Omit **Apply elsewhere** |

---

# Compose Responsibilities

## What Design Page compose must guarantee

1. **Every upstream `learning_activities` activity row** in scope appears in `page.sections[].learning_activities.content` with matching `activity_id`.
2. **PEL and Think activity-row fields** from upstream DLA are **copied or merged** onto each matching page activity row when present upstream — not left DLA-only.
3. **GAM material bodies** are **copied verbatim** onto `activity.materials.*` via existing materials preservation — no thinning to references.
4. **`learner_task`, `expected_output`, `support_note`** are copied verbatim per activity when present upstream.
5. **Merged compose output** is the **authoritative saved `page.json`** after workflow capture validation — not a pre-merge LLM draft.
6. **Page wrapper sections** (`overview`, `learning_purpose`, optional `knowledge_summary`, `study_tips`) are composed as wrapper prose only — they do not replace activity-row fields.

## Compose mechanisms (existing — specify behaviour, do not redesign)

| Mechanism | Responsibility |
| --------- | -------------- |
| `applyPageCompositionValidationForCapturedPage` | Run on Design Page capture; mutate capture to merged page |
| `repairLearnerPageCompositionFromUpstream` | Strip bad omissions; restore missing activities; merge framing fields |
| `mergeLearnerPageActivityFramingFieldsIntoPageActivities` | Copy `LEARNER_PAGE_ACTIVITY_FRAMING_PRESERVATION_FIELD_IDS` from upstream when absent on row |
| `applyComposedPageGamMaterialsPreserve` | Overlay GAM bodies when compose thins materials |
| `assignComposedPageMutations` | Write merged result back to capture state |

## Field persistence table

| Field | Required for Manifestation | Currently Persisted (Marx run2) | Compose Action |
| ----- | -------------------------- | ------------------------------- | -------------- |
| `activity_preamble` | **Yes** — Orient owner | No on rows | **Must merge/copy from upstream DLA** when absent on row |
| `reasoning_orientation` | **Yes** — Think owner | No on rows | **Must merge/copy** when absent |
| `prior_knowledge_activation` | Optional | No | Merge when upstream has value |
| `intellectual_frame` | Optional | No | Merge when upstream has value |
| `disciplinary_lens` | Optional | No | Merge when upstream has value |
| `conceptual_contrast_prompt` | Optional | No | Merge when upstream has value |
| `argument_structure_hint` | Optional | No | Merge when upstream has value |
| `evidence_use_prompt` | Optional | No | Merge when upstream has value |
| `uncertainty_tension_prompt` | Optional | No | Merge when upstream has value |
| `intellectual_coherence_bridge` | Optional | No | Merge when upstream has value |
| `study_orientation` | Optional (first activity) | No | Merge when upstream has value |
| `self_explanation_prompt` | Optional (Reflect pre-check) | No | Merge when upstream has value |
| `transfer_or_application_task` | Optional (Transfer) | No | Merge when upstream has value; subordinate to `materials.transfer_prompt` |
| `scaffold_hint_sequence` | Optional | No | Merge when upstream has value |
| `learner_task` | **Yes** — Do owner | Yes | Preserve verbatim |
| `expected_output` | **Yes** — Check secondary | Yes | Preserve verbatim |
| `support_note` | Optional — Think guard | Yes | Preserve verbatim |
| `materials.*` | **Yes** — Study/Do/Check/Reflect/Transfer | Yes (materials) | Preserve via GAM overlay |
| `overview` | **Yes** — page Orient | Yes | Compose wrapper |
| `learning_purpose` | **Yes** — page Orient | Yes | Compose wrapper |

**Minimum manifestation bar (compose):** For every activity in a learner-page workbook, **`activity_preamble` and `reasoning_orientation` must appear on the page activity row** when upstream DLA carries them — the saved artefact must not rely on render-time-only merge.

---

# Renderer Responsibilities

## Global render rules

1. **Single column** — all instructional sections stack vertically in grammar order.
2. **Semantic headings** — each function section uses the learner-facing heading from the Instructional Grammar table (heading level: one step below activity title).
3. **Full prose** — render complete field bodies; do not truncate Orient/Think to labels only.
4. **No duplicate function sections** — if content would appear twice under the same function, render once in the owning section.
5. **Activity title** precedes A1; duration/grouping badges are metadata after title, not instructional sections.

## Per-function renderer specification

### Orient — “Why this activity”

| Attribute | Specification |
| --------- | ------------- |
| **Heading** | Why this activity |
| **Sources** | `activity_preamble` (primary); then `intellectual_coherence_bridge`, `prior_knowledge_activation`, `purpose` if not duplicate |
| **Render order** | A1 (first instructional section after title) |
| **Omit if** | No non-empty Orient sources after de-duplication |
| **Prose** | Full markdown/plain text of preamble and sub-cues as paragraphs — not one-line summaries |

### Think — “How to approach this”

| Attribute | Specification |
| --------- | ------------- |
| **Heading** | How to approach this |
| **Sources** | `reasoning_orientation` (primary); merge into one block: `conceptual_contrast_prompt`, `argument_structure_hint`, `evidence_use_prompt`, `uncertainty_tension_prompt`, `disciplinary_lens`, `intellectual_frame`, `scaffold_hint_sequence` |
| **Render order** | A2 |
| **Omit if** | No Think sources after merge |
| **Prose** | Each sub-field may render as labelled paragraph within section; preserve instructional voice |
| **Exclude from this section** | `support_note` (renders at A8), cognition-pack fields (render in Reflect or omit if duplicate) |

### Study — “Read and model”

| Attribute | Specification |
| --------- | ------------- |
| **Heading** | Read and model |
| **Sources** | Classified Study materials in order: `text` → `scenario`/`scenarios` → `worked_example` → `worked_analytic_pass` → `modelling_note` → `sample_output` *(pre-check position only)* |
| **Render order** | A3 — **before** What to do |
| **Omit if** | No Study-classified materials |
| **Prose** | Full material bodies; inline cognition cues stay inside parent material block |
| **Subheadings** | Material-type headings allowed within section (e.g. Worked example) — must not break top-level grammar order |

### Reflect (pre-check) — “Explain before you check”

| Attribute | Specification |
| --------- | ------------- |
| **Heading** | Explain before you check |
| **Sources** | `self_explanation_prompt` when activity design places generative step before model/check exposure |
| **Render order** | A3b — after Study, before Do |
| **Omit if** | No pre-check reflect field, or `sample_output`/`checklist` already encountered |
| **Activation rule** | Render A3b when `self_explanation_prompt` present **and** (`sample_output` or `checklist` exists later in activity) |

### Do — “What to do”

| Attribute | Specification |
| --------- | ------------- |
| **Heading** | What to do |
| **Sources** | `learner_task` (primary); then Do-classified materials: `analysis_table`, `comparison_table`, `worksheet`, `table`, `template`, `decision_table`, `prompt_set`, etc. |
| **Render order** | A4 — after Study (and A3b if present) |
| **Omit if** | No task and no Do materials |
| **Prose** | Task as numbered list when structured; full table/template bodies |

### Check — “Check your work”

| Attribute | Specification |
| --------- | ------------- |
| **Heading** | Check your work |
| **Sources** | `materials.checklist` (primary); `expected_output`; `sample_output` *(post-attempt exemplar position)* |
| **Render order** | A5 — immediately after Do |
| **Omit if** | No checklist and no expected_output |
| **Unification** | Checklist and expected output **same section** — not separated by other content |

### Reflect (post-check) — “What to take away”

| Attribute | Specification |
| --------- | ------------- |
| **Heading** | What to take away |
| **Sources** | `materials.reflection_prompt`, `materials.consolidation_summary`; pack `reconciliation_prompt`, `reasoning_revision_prompt` when applicable |
| **Render order** | A6 — after Check |
| **Omit if** | No post-check reflect sources |

### Transfer — “Apply elsewhere”

| Attribute | Specification |
| --------- | ------------- |
| **Heading** | Apply elsewhere |
| **Sources** | `materials.transfer_prompt` (primary); `transfer_or_application_task` only if no material transfer body |
| **Render order** | A7 — last instructional section (before optional Think guard) |
| **Omit if** | No transfer sources |

### Think guard — “Watch for this mistake”

| Attribute | Specification |
| --------- | ------------- |
| **Heading** | Watch for this mistake |
| **Sources** | `support_note` |
| **Render order** | A8 — after Check (or after Transfer if present); **not** before Do |
| **Omit if** | Empty, duplicate of checklist repair text, or facilitator choreography (sanitized) |

## Material classification (renderer)

| Material key | Default function | Section |
| ------------ | ---------------- | ------- |
| `text` | Study | Read and model |
| `scenario`, `scenarios` | Study | Read and model |
| `worked_example`, `worked_analytic_pass` | Study | Read and model |
| `modelling_note` | Study | Read and model |
| `sample_output` | Study (pre-check) or Check (post-attempt) | Position rule: before Do = Study; after Do = Check |
| `analysis_table`, `comparison_table`, `worksheet`, `table` | Do | What to do |
| `template`, `templates`, `independent_judgement_template` | Do | What to do |
| `decision_table` | Do | What to do |
| `prompt_set`, `prompts` | Do | What to do |
| `checklist`, `checklists` | Check | Check your work |
| `reflection_prompt`, `consolidation_summary` | Reflect | What to take away |
| `transfer_prompt` | Transfer | Apply elsewhere |

---

# Duplicate Signal Ownership

## Compass duplication

| Signal | Primary owner | Compass behaviour |
| ------ | ------------- | ----------------- |
| Governing inquiry | Page `overview` | Page header may show inquiry once; **do not repeat per-activity Orient text** |
| Study/Think/Reflect/Transfer excerpts | Activity sections A1–A7 | **Do not re-list** as compass `signals[]` |
| Step position | Activity title + optional one-line “Step N of M” | Allowed; no function prose |

**Rule:** Journey Compass at activity level **must not** duplicate instructional function content already rendered in A1–A7.

## Think duplication

| Signal | Primary owner | Suppress in |
| ------ | ------------- | ----------- |
| `reasoning_orientation` | **How to approach this** (A2) | Separate framing “How to think” cue; Compass Think signal; `util-cognition` block for same field |
| Merged Think hints | **A2** | Standalone `util-pel-orientation-cue` duplicates |
| `support_note` | **Watch for this mistake** (A8) | Checklist “if not met” lines (keep in Check) |

## Check duplication

| Signal | Primary owner | Suppress in |
| ------ | ------------- | ----------- |
| Verification checklist | **Check your work** (A5) | Separate checklist section outside A5 |
| `expected_output` | **Check your work** (A5) | Standalone output block after Transfer |
| Sample output (exemplar) | **Check your work** (A5) when post-attempt | Study section if already used pre-check |

## Transfer duplication

| Signal | Primary owner | Suppress in |
| ------ | ------------- | ----------- |
| `materials.transfer_prompt` | **Apply elsewhere** (A7) | `transfer_or_application_task` row field; Compass Transfer pointer; `util-cognition--transfer` when material exists |

## Orient duplication

| Signal | Primary owner | Suppress in |
| ------ | ------------- | ----------- |
| `activity_preamble` | **Why this activity** (A1) | `orienting_preamble`, `activity_framing` aliases (merge); Compass Orient signals |
| Page inquiry | **Inquiry** (P2) | Repeated in every activity preamble opening |

## Reflect duplication

| Signal | Primary owner | Suppress in |
| ------ | ------------- | ----------- |
| `self_explanation_prompt` | **Explain before you check** (A3b) or post-check if no pre-check | `util-cognition--explain` standalone block; Compass Reflect |
| `consolidation_summary` | **What to take away** (A6) | Learner_task step text only (task may reference; body renders once) |

---

# Manifestation Rules

## Instructional prose expectations

- **Preserve upstream voice** — compose and render copy full pedagogic prose; no summarisation for readability.
- **Orient and Think** carry explanatory/narrative prose (multi-sentence allowed and expected).
- **Study** materials retain connective exposition, worked steps, bridges, and examples at full depth.
- **Do** tasks remain actionable numbered steps where upstream provides them.
- **Check** checklists retain criteria-linked items and repair guidance.
- **Reflect and Transfer** retain minimum word-band requirements when present in material bodies.

## Section labelling expectations

- Every function section uses the **exact learner-facing heading** from the Instructional Grammar (sentence case as specified).
- Headings are **semantic** (`<h2>`/`<h3>` or equivalent) — not CSS-only visual distinction.
- Material-type subheadings inside Study or Do are permitted; they must not replace top-level function headings.

## Ordering requirements

| Rule | Requirement |
| ---- | ------------- |
| R1 | Page: P2 → P3 → P4 → activities → P6 |
| R2 | Activity: A1 → A2 → A3 → [A3b] → A4 → A5 → A6 → A7 → [A8] |
| R3 | Study materials before Do — **never** render What to do before Read and model when Study materials exist |
| R4 | Check immediately follows Do (A5 after A4) |
| R5 | Transfer after Reflect post-check when both exist |
| R6 | `expected_output` inside A5, not after A7 |

## De-duplication requirements

- Render each source field **at most once** per activity in its owning section.
- Alias fields merge into primary owner before render.
- Compass does not re-emit function prose.

---

# Accessibility Requirements

1. **Linear document** — manifestation must be coherent with stylesheets removed; section order alone conveys grammar.
2. **Heading hierarchy** — page title → page sections → activity title → function sections → material subheadings; no skipped levels.
3. **No function conveyed by colour/icon alone** — badges and affordances are supplementary.
4. **Screen reader order** — DOM order matches reading order (R1–R6).
5. **Empty sections forbidden** — omit heading if no content (no “placeholder” sections).
6. **Link anchor stability** — function headings should be stable per activity for navigation (implementation detail left to renderer; requirement stated).

---

# Success Criteria

## Observable learner outcomes

After Sprint 50 implementation, on a Marx-class self-directed learner page (or equivalent workbook fixture), a learner can **without inference**:

| Question | Answered by |
| -------- | ----------- |
| Why am I doing this? | Page Inquiry + activity **Why this activity** |
| How should I think about this? | **How to approach this** |
| What should I study? | **Read and model** |
| What am I being asked to do? | **What to do** |
| How do I know I have succeeded? | **Check your work** |
| What should I take away? | **What to take away** + optional page **What should now be clearer** |
| Where else does this apply? | **Apply elsewhere** (when designed) |

## Acceptance checks (manifestation)

| # | Criterion |
| - | --------- |
| AC1 | Run2-class `page.json` with upstream DLA available: after compose, **every activity row** carries `activity_preamble` and `reasoning_orientation` when upstream has them |
| AC2 | Rendered HTML: **Read and model** precedes **What to do** for activities with both Study materials and `learner_task` |
| AC3 | **Check your work** contains checklist and `expected_output` in one section |
| AC4 | No duplicate `reasoning_orientation` or `activity_preamble` in Compass, framing block, and cognition block |
| AC5 | Linear strip test: function headings alone outline a complete instructional path for A1–A5 Marx activities |
| AC6 | Sprint 48–49 regression suites remain green (gates, patterns, materials preservation) |

---

# Sprint 50 Scope Boundary

## In scope

| Workstream | Deliverable |
| ---------- | ----------- |
| **Design Page compose** | Guaranteed persistence of PEL/Think row fields; authoritative merged `page.json`; materials preservation unchanged |
| **Renderer** | Function-ordered sections; headings; material classification; duplicate suppression; Compass de-scope |
| **Tests** | Compose persistence assertions; render order assertions; Marx fixture grammar checks |

## Out of scope

| Item | Rationale |
| ---- | --------- |
| DLA / GAM prompt changes | Fields already generated |
| OUTPUT CONTRACT / schema expansion | Validated unnecessary |
| Workflow gates | Frozen |
| Cognition ontology redesign | Validated unnecessary |
| New pedagogic fields or generation stages | Manifestation only |
| Two-column layout / CSS redesign | Minimal model is single-column linear |
| Mandatory Reflect on every activity | Optional function; generation coverage not Sprint 50 |

## Implementation sequencing (recommended)

1. **Compose fidelity** — ensure merged page model (unblocks Orient/Think sections).
2. **Renderer section assembly** — function order and headings (Study before Do).
3. **De-duplication** — Compass, cognition block, split Check/output.
4. **Validation** — Marx run2 + regression suites.

---

*Implementation specification v1 — Sprint 50 manifestation target.*
