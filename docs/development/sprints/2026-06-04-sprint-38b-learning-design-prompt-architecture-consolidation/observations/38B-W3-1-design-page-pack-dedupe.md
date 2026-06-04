# PR-W3-1 — Design Page pack authority dedupe

**Date:** 2026-06-04  
**Scope:** Pack §13 only (`domain-learning-design-step-patterns.md` — `promptTemplate`, `defaultPromptNotes`)  
**Out of scope:** `app.js`, runtime augmentation, renderer, VEU, tests (no changes)

---

## 1. Objective

Remove Design Page pack duplication now owned by canonical modules and Wave 2 authority separation, while preserving genuine compose ownership (page schema, membership, field preservation hooks, affordance attachment, validation).

---

## 2. Authority references added (pack)

| Module | Pack role after W3-1 |
|--------|----------------------|
| **LD-MATERIALS-COPY** | Preserve merge of `activity_materials` → `activity.materials`; PREC-02; no placeholder catalogue |
| **LD-TABLE-FIDELITY** | Preserve pipe tables verbatim in `materials.<table_key>`; no comma-row / Headers+Rows |
| **LD-MATH-RENDER** | Renderer-supported TeX only; forbidden `$...$`, `$$...$$`, code spans/fences |
| **LD-SELF-DIRECTED-RHETORIC** | Learner profile overview/learning_purpose/study_tips + verbatim activity orientation (not materials bodies) |

Runtime still appends full contracts (6 markers unchanged).

---

## 3. Duplication removed (pack)

| Former pack ownership | Action |
|----------------------|--------|
| Long verbatim material-copy bullets (10+ lines) | Replaced with LD-MATERIALS-COPY preserve one-liner + ACTIVITY MEMBERSHIP |
| Duplicate math delimiter paragraph | Folded into LD-MATH-RENDER canonical line |
| Second MATERIALS FIDELITY merge paragraph | Merged into single MATERIALS FIDELITY block |
| Sprint 38 field-by-field generate/defer/reject prose | Compressed; **test anchors retained**; detail deferred to runtime Sprint 38 contract |
| `defaultPromptNotes` rhetoric/orientation essay (~8.5k) | Runner-oriented summary (~1.5k); defers to runtime modules |

### Preserved in pack (Design Page genuine ownership)

- Read-only composition task and hard constraints
- `page_profile` / include_answers / marking / feedback options
- `sections[]` schema, canonical `section_id` order
- `learning_activities.content` array shape and membership / `(U \ X) ⊆ C` validation
- `assessment_check.content` object + items array rules
- Page-root Sprint 38 **output keys** and mandatory heading line (anchors)
- MATERIALS FIDELITY additive-page-root + forbidden placeholders + generated-figures-only rule

---

## 4. Metrics (probe `scripts/probe-38b1-ld-workflow-prompt-audit.js`)

| Metric | Pre W3-1 | Post W3-1 | Δ |
|--------|----------:|----------:|--:|
| `packTemplateChars` | 9,818 | **7,915** | **−1,903** |
| `packNotesChars` | 8,476 | **1,461** | **−7,015** |
| `seededChars` (self-directed) | 9,648 | **7,745** | **−1,903** |
| `augmentedChars` (self-directed) | 27,345 | **25,442** | **−1,903** |
| Runtime `blockCount` | 6 | **6** | 0 |
| Facilitated `augmentedChars` | 22,560 | **20,657** | **−1,903** |

**Four-step augmented sum (self-directed):** 74,534 → **72,631** (−1,903; Design Page-only delta).

**Interpretation:** Seeded and augmented dropped by the same amount — pack-only change; runtime append chain unchanged.

---

## 5. Regression gates

| Gate | Result |
|------|--------|
| `node --test tests/*.test.js` | **724 pass / 0 fail** |
| Pack test anchors (`design-page-materials-fidelity`, `sprint-38-visual-affordances`, `mathjax-producer-prompt-contract`) | **Pass** |
| Runtime markers (materials fidelity, Sprint 38, LD-MATH-RENDER, rhetoric) | **Unchanged** |
| B4 PREC / table preserve semantics in runtime | **Unchanged** (no `app.js` edit) |
| Sprint 38 affordance requirements | **Unchanged** (runtime owns examples) |

---

## 6. Files changed

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | §13 `promptTemplate`, `defaultPromptNotes` |
| `observations/38B-W3-design-page-authority-review.md` | §12 sign-off → W3-1 complete |
| `observations/38B-3-design-page-consolidation-plan.md` | Post W3-1 metrics note |
| `observations/38B-W3-1-design-page-pack-dedupe.md` | This record |

---

## 7. Next (PR-W3-2 baseline)

- Introduce `LD-DESIGN-PAGE-COMPOSE-CONTRACT` runtime merge (≤3 append units target).
- Further augmented reduction (~3k–5k) requires runtime consolidation, not additional pack-only trim without weakening seeded compose rules.

---

## 8. Sign-off

| Item | Status |
|------|--------|
| PR-W3-1 pack dedupe | **COMPLETE** |
| Runtime behaviour | **No change** |
| Clean baseline for PR-W3-2 | **Yes** — seeded **7,745**, augmented **25,442** |
