# Renderer cognition evidence matrix

**Sprint:** 29-0  
**Date:** 2026-05-21  
**Scoring:** 0 = absent/weak, 1 = partial, 2 = strong (investigator judgement, documentary)

**Legend:** **S28** = structural state after Sprint 28 composition; **R now** = current Utilities HTML renderer without cognition classes.

---

## Dimensions (D-R1–D-R10)

| ID | Dimension | Question |
|----|-----------|----------|
| D-R1 | Cognition visibility | Are typed cognition fields visually distinguishable from body text? |
| D-R2 | Activity salience | Do activities compete visually with assessment? |
| D-R3 | Reasoning flow clarity | Is predict→discuss→revise (or equivalent) legible? |
| D-R4 | Misconception/reconciliation adjacency | Are claim + repair visually paired? |
| D-R5 | Assessment dominance | Does MCQ/check section visually overpower activities? |
| D-R6 | Visual differentiation | Are section roles clear (icon, heading, spacing)? |
| D-R7 | Cognitive sequencing visibility | Is order of cognitive moves apparent? |
| D-R8 | Learner orientation | Can a learner see what to do first / next? |
| D-R9 | Typographic overload | Is the page scannable without wall-of-text? |
| D-R10 | Section flattening | Are cognition sections reduced to generic blocks? |

---

## Probe summary

| Probe | JSON source | Cognition packs (S28) | Cognition fields in JSON |
|-------|-------------|----------------------|---------------------------|
| **R29-P01** | [`probe-p28-01-post-5d.md`](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-01-post-5d.md) §G | `misconception_repair_pack` | `misconception_claim`, `reconciliation_prompt`, `evidence_contrast`, `uncertainty_tension_prompt` |
| **R29-P02** | [`probe-p28-02-post-5d.md`](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-02-post-5d.md) §G | `peer_instruction_pack` | `initial_position_prompt`, `reasoning_revision_prompt`, `revision_trigger` |
| **R29-P07** | [`probe-p28-07-post-5d.md`](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-07-post-5d.md) §G | `transcript_transformation_pack` (+ repair) | `transformation_activity`, `source_to_application_prompt`, misconception fields |
| **R29-P08** | RNA sparse / lean retrieval fixtures | none | none expected |
| **R29-P09** | [`renderer-kitchen-sink-page.json`](../../../tests/fixtures/page-render/renderer-kitchen-sink-page.json) | none | pattern baseline only |

---

## Matrix (documentary 29-0 scores — superseded for P01/P02/P07)

*29-0 scores were investigator judgement from JSON audit + code read. **29-1 HTML-backed scores below take precedence** for R29-P01, P02, P07.*

| Probe | D-R1 | D-R2 | D-R3 | D-R4 | D-R5 | D-R6 | D-R7 | D-R8 | D-R9 | D-R10 |
|-------|------|------|------|------|------|------|------|------|------|-------|
| **R29-P01** *(29-0)* | 0 | 1 | 0 | 0 | 1 | 2 | 0 | 1 | 1 | 2 |
| **R29-P02** *(29-0)* | 0 | 1 | 0 | n/a | 1 | 2 | 0 | 1 | 1 | 2 |
| **R29-P07** *(29-0)* | 0 | 1 | 0 | 0 | 1 | 2 | 0 | 1 | 1 | 2 |
| **R29-P08** | n/a | 0 | n/a | n/a | 2 | 1 | n/a | 0 | 0 | 1 |
| **R29-P09** | n/a | 2 | n/a | n/a | 0 | 2 | 1 | 2 | 1 | 1 |

---

## Matrix (29-1 HTML-backed — `buildUtilityStructuredHtmlForTest`)

**Source:** [`28-5d-stabilisation-capture.json`](../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/28-5d-stabilisation-capture.json) live `page` objects; captures in [`context-files/r29-p*-html-capture.md`](context-files/r29-p01-html-capture.md).

| Probe | D-R1 | D-R2 | D-R3 | D-R4 | D-R5 | D-R6 | D-R7 | D-R8 | D-R9 | D-R10 |
|-------|------|------|------|------|------|------|------|------|------|-------|
| **R29-P01** | **1** | **2** | **0** | **1** | **0** | **2** | **0** | **2** | **1** | **2** |
| **R29-P02** | **1** | **2** | **1** | **0** | **1** | **2** | **1** | **2** | **1** | **2** |
| **R29-P07** | **1** | **2** | **0** | **1** | **1** | **2** | **0** | **2** | **1** | **2** |

### 29-1 findings (renderer lens)

| Probe | Cognition in JSON | Rendered as | Assessment vs activities (HTML len) |
|-------|-------------------|-------------|-------------------------------------|
| **P01** | Labels in `task_cards` markdown only | **embedded_prose** in cards; no `util-cognition*` | LA **9225** > AC **1949** — activities dominate |
| **P02** | `materials_key` for peer-instruction fields | **materials_key_heading** via `renderMaterialValue` (`util-generic-material-icon`) | LA **20378** > AC **3169**; 18 assessment items in AC section |
| **P07** | Labels in `task_cards` / prompts | **embedded_prose**; transformation fields not first-class on rows | LA **19008** > AC **5297** |

**S28 structural uplift (unchanged):** `learning_activities` before `assessment_check`; `metadata.cognition_profile.active: true`.

**R now gap (29-1 confirmed):** No `util-cognition` classes. Activity-row cognition IDs are not in `renderLearningActivitiesBlocks` allow-list. P02 cognition keys appear only when duplicated under `materials` object keys (generic material renderer). P01/P07 cognition legibility depends on markdown inside skipped/ parsed `task_cards` blobs.

---

## Matrix (29-2 renderer implementation — activity-row fields)

**Change:** `renderCognitionFieldsForActivity` in `app.js` — semantic blocks for cognition keys on **activity rows**; materials keys skipped when row-level field present.

| Probe | D-R1 | D-R2 | D-R3 | D-R4 | D-R5 | D-R6 | D-R7 | D-R8 | D-R9 | D-R10 |
|-------|------|------|------|------|------|------|------|------|------|-------|
| **R29-P01** | **1**† | **2** | **0** | **1**† | **0** | **2** | **0** | **2** | **1** | **1** |
| **R29-P02** | **2**‡ | **2** | **1** | n/a | **1** | **2** | **1** | **2** | **1** | **1** |
| **R29-P07** | **1**† | **2** | **0** | **1**† | **1** | **2** | **0** | **2** | **1** | **1** |

† Post-5d capture JSON often embeds cognition labels in `task_cards` only — row-level merge required for **2**.  
‡ **2** when upstream/composition places peer-instruction fields on activity rows (see `workflow-ld-cognition-composition.test.js`); materials-only keys remain generic until merged to row.

**29-2 hypothesis update:** R29-H3 **Partial** (row fields first-class; materials/task-card path unchanged). R29-H5 **Partial** (profile passed to render context; blocks gate on row field presence).

---

## Before vs after Sprint 28 (renderer lens)

| Aspect | Before Sprint 28 | After Sprint 28 (JSON) | Renderer today (R) |
|--------|------------------|------------------------|-------------------|
| Activity survival | Often omitted or assessment-only | Injected + ordered in C | Activities render if in `sections[]` |
| Cognition fields | Rare in JSON | Typed keys on activities | **Not first-class in render path** |
| Section IDs | Drift (`section_2`) | Canonical | Icons/heuristics work |
| Assessment semantics | Sprint 27 stable | `feedback_display` on page | Reflection block / hidden answers |

**Conclusion:** Sprint 28 fixed **data**; Sprint 29 targets **legibility of data already on the page**.

---

## Hypothesis adjudication

| ID | 29-0 | 29-1 update |
|----|------|-------------|
| **R29-H1** | **Supported** | **Partial** — item chrome still distinct (`util-assessment-item`), but section HTML length favours activities on P01/P02/P07 |
| **R29-H2** | **Open** | **Open** — needs 29-3 A/B with cognition classes |
| **R29-H3** | **Supported** | **Supported** — HTML confirms no first-class activity-row cognition blocks (P01/P07); P02 uses generic material headings only |
| **R29-H4** | **Open** | **Partial** — P02 `materials_key` headings improve label visibility without semantic classes |
| **R29-H5** | **Partial** | **Supported** — `cognition_profile` in JSON; renderer does not branch on profile in export HTML |

---

## Sprint 28 architectural outcome (cross-reference)

PRISM now **preserves** cognition through composition. The renderer **does not yet express** that preservation semantically — this matrix is the baseline for measuring 29-x improvements.
