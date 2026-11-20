# Sprint 101E — Discipline-first Practice interactions

**Status:** Investigation complete; prompt-layer guidance extended — **101E not closed**  
**Date:** 2026-11-20  
**Do not overwrite C2 or C3. Do not regenerate existing commissions. Do not commit/push.**

## Problem

Live Practice C2 (QA 86) and C3 (QA 90) show strong mathematical reasoning and criterion-based feedback, but learners are repeatedly asked to **write about** mathematics rather than **perform** operations and structured judgements. Progressive interaction prompts (earlier 101E) help at the design layer, yet the **interaction repertoire** cannot realise a Sprint 101C-style reasoning matrix with selectable controls in cells. C3 also leaked dense instructional-design language into learner-facing task briefings.

**Design principle:** Learners spend effort doing the discipline, not describing how they would do it. Do not reduce intellectual demand; reduce unnecessary writing.

---

## 1. What the architecture already supports

### Practice / activity Do path (confirmed in renderer)

| Control / surface | Status on Practice Do | Notes |
| ----------------- | --------------------- | ----- |
| `table_entry` completion tables | **Supported** | Semantic `<table>` with headers; editable cells are **textareas only** (`render-table-workspace.js`). Persistence via `table_entry` adapter. |
| Template / `text_entry` fields | **Supported** | Labelled response fields; `input_modality` `text` \| `math` (MathLive). |
| Ordering / sequencing / ranking | **Supported** | Via ordering workspace model / surface. |
| Checklist + `diagnostic_review` | **Supported** | Criterion-based guided review (“Check your work”); self-evaluation panels, not determinate key-check of open production. |
| `prompt_set` / task cards | **Supported** | Concise prompts / micro-decisions as materials (not selectable in-cell widgets). |
| Compound multi-material activities | **Supported** | Several coordinated materials/steps in one activity (table + template + checklist, etc.). |

### Elsewhere in PRISM (not Practice Do)

| Control | Where | Notes |
| ------- | ----- | ----- |
| MCQ / radio single-select | Assessment Pack (`assessment_selection`) | `assessment-interactive.js` — radios, checkboxes, classification/matching `<select>`s. |
| Multi-select checkboxes | Assessment Pack | Same path. |
| Classification / matching dropdowns | Assessment Pack | Labelled `<select>` per subject — closest existing “reasoning matrix” UI. |
| Determinate selection auto-check | Assessment runtime | Not wired as Practice activity workspace feedback. |

### Recognised but not implemented on activity response parts

`learner-surface-registry.js` returns `UNSUPPORTED_LEARNER_SURFACE` for:

- `single_select`
- `multi_select`
- `matching`

`table_entry` as a **response part** is also rejected (must compose via table workspace materials).

### Check your work today (activity path)

1. **Response checking:** Learner text/math/table/ordering state persists; ordering may support exact-sequence checks when commissioned. Typed table cells are **not** auto-marked against a key.
2. **Diagnostic feedback:** Guided-review checklist criteria + post-attempt model/worked materials (reveal-after pattern).
3. **Evaluative judgement:** Criterion-based self-evaluation (features / why it matters / repair) — not simplistic right/wrong for open production.
4. **Revision:** Learner can change persisted workspace values after feedback; checklists remain available.

Assessment Pack selection check is a **different product surface** and must not be assumed available inside Practice Do merely because prompts mention “select” or “classify”.

### Accessibility / layout baseline for tables

Table workspaces already use semantic tables (`scope="col"` / `scope="row"`, labelled textareas). Any future compound layout should keep that pattern; CSS Grid may refine responsive presentation without replacing table semantics where row/column meaning matters.

---

## 2. Specific limitation

**Prompts can describe richer controls than Practice Do can render.**

In particular:

- `table_entry` cannot host dropdowns, radios, or checkboxes inside cells.
- Activity response parts cannot commission `single_select` / `multi_select` / `matching`.
- Assessment Pack selection UIs are not composed into Practice activity Do moments.
- Progressive / repertoire prompt guidance therefore improves design intent but **cannot** produce a genuine interactive reasoning matrix without renderer or composition work.

A typed “worksheet” (short cells + math fields + brief judgement + checklist) **is** already generable and valid — it still relies on typing for classification judgements, which is the C2/C3 friction.

---

## 3. Decision — no speculative vertical slice this pass

Implementing a true **interactive reasoning matrix** (classify claims via selects, evidence support, unsupported inference, final judgement) requires one of:

| Option | Work | Risk |
| ------ | ---- | ---- |
| **A** | Prompt-only composition of existing surfaces | Already done (progressive + this pass). Does **not** deliver selectable in-cell controls. |
| **B** | Lift Assessment Pack form patterns into activity Do (compose `assessment_selection`-like blocks or implement stubbed surfaces) | Medium; shared renderer; Practice vs Assessment boundary; Check-your-work model changes. |
| **C** | New in-cell widget family on `table_entry` | High; schema + a11y + persistence + validation. |
| **D** | Hybrid “matrix material” type | High; new schema surface. |

Per sprint constraint: *if a complete vertical slice needs substantial architectural changes, stop after investigation and propose a bounded plan*. **This pass stopped on Option B/C/D implementation** and left the bounded Option B plan in §8. **Follow-on (2026-11-20):** Option B vertical slice implemented — see [101E-PRACTICE-SELECTION-CONTROLS.md](101E-PRACTICE-SELECTION-CONTROLS.md). Options C/D remain out of scope.

---

## 4. What was implemented (safe slice)

Prompt-contract only (Practice route), version `101E-PRACTICE-DISCIPLINE-FIRST-V1`:

1. **Discipline-first principle** — do the discipline; minimise unnecessary writing; reserve prose for authentic justification outcomes.
2. **Honest repertoire** — restated: no dropdown/checkbox-in-cell; no Assessment Pack forms as Practice materials.
3. **Learner-facing language (Phase 5)** — DLA/GAM guidance converting design-spec voice into clear, actionable instructions (with bad/better example aligned to C3-style wording).
4. **Check your work preservation** — criterion-based review, hints, models, revision; explicit note that determinate auto-check of typed cells is not a Practice workspace feature today.

**Not implemented:** new renderer widgets, schema changes, Assessment→Practice lift, regeneration of C2/C3.

---

## 5. Files changed

| File | Change |
| ---- | ------ |
| `lib/ld-practice-presentation-contracts.js` | Discipline-first, learner-facing language, Check-your-work notes; contract version bump. |
| `tests/s101e-practice-progressive-interaction.test.js` | Version assertion updated. |
| `tests/s101e-practice-discipline-first.test.js` | New regression coverage for language + isolation. |
| `docs/.../101E-DISCIPLINE-FIRST-INTERACTIONS.md` | This report. |
| `docs/.../101E-PROGRESSIVE-INTERACTION-DESIGN.md` | Cross-link / version note. |
| `docs/.../STATUS.md` | Work log entry. |

---

## 6. Tests

**2026-11-20 run:** `node --test tests/s101e-practice-progressive-interaction.test.js tests/s101e-practice-discipline-first.test.js` → **8/8 pass**.

- `tests/s101e-practice-progressive-interaction.test.js` (4)
- `tests/s101e-practice-discipline-first.test.js` (4)
- Practice vs Interactive isolation assertions included

### Manual tests (cannot fully automate)

1. Keyboard tab order through a multi-material Practice activity (table → math field → checklist).
2. Screen reader: table headers + cell labels; guided-review status (`aria-live`).
3. Narrow viewport: table breakout / reflow preserves header–cell relationships.
4. After Check your work, revise a table cell and a template field; confirm persistence.
5. Confirm Interactive self-study generation unchanged (no Practice contract markers).
6. On next Practice DLA (new commission only — do not overwrite C2/C3): inspect `learner_task` / preamble for actionable language, not design-spec paste.

---

## 7. Remaining limitations

- Classification still typed into textareas.
- No determinate selection feedback on Practice Do.
- Assessment Pack UI not reusable from Practice activities without Option B.
- Existing C2/C3 learner pages are unchanged until deliberately regenerated (out of scope).

---

## 8. Bounded Option B plan → implemented

**Goal (met for vertical slice):** Structured judgement selections inside Practice Do, without inventing in-cell table widgets or Assessment Pack chrome.

Implementation report: [101E-PRACTICE-SELECTION-CONTROLS.md](101E-PRACTICE-SELECTION-CONTROLS.md) (`101E-PRACTICE-SELECTION-CONTROLS-V1`).

### Remaining non-goals

- Dropdowns inside every `table_entry` cell (Option C).
- Weakening schemas to accept unsupported structures.
- Broad renderer rewrite.
- Marking 101E complete solely because selection controls exist.
- Overwriting C2/C3.

---

## Verdict

Discipline-first prompt guidance landed first; the selectable-matrix gap was renderer/composition, not prompt wording alone. **Option B vertical slice is now implemented** (Practice `selection` materials + contracts + tests). 101E remains open (IndexedDB C1 verify still pending; no C2/C3 overwrite).
