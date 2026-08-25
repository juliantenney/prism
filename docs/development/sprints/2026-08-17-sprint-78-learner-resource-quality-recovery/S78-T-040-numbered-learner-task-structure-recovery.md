# S78-T-040 — Numbered learner-task structure recovery

**Task:** S78-T-040  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Implements:** [S78-T-038](S78-T-038-learner-composition-presentation-regression-diagnostic.md) Defect 2 (P2)  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

---

## 1. Root-cause confirmation

Generated `learner_task` strings can contain multiple numbered steps on a **single line**, e.g.:

```text
1. Inspect … 2. Identify … 3. Classify …
```

vNext `parseLearnerTask` only matched numbered markers at **line starts** (`(?:^|\n)\s*(\d+)[.)]\s+`). The leading `1.` was consumed as the first step marker; `2.` and `3.` remained literal inline text in step 1. Learner-facing output collapsed to one instruction paragraph.

This is a **parser transport defect**, amplified by single-line DLA authoring but not Lagrangian-specific.

---

## 2. Exact parser change

| Item | Detail |
| ---- | ------ |
| **File** | `lib/learner-renderer-vnext/parse-learner-task.js` |
| **Functions** | `findNumberedMarkers`, `isConsecutiveStepNumbers`, `splitOnNumberedMarkers`; `parseLearnerTask` orchestration updated |
| **Marker regex** | `/(?:^|\n|[.!?])\s*(\d+)([.)])\s+/g` — line start **or** after sentence punctuation |
| **Split rule** | When ≥2 markers form a consecutive ascending sequence, split on all matched markers |
| **Fallback** | Non-consecutive mid-line markers → line-start-only split (preserves existing newline behaviour); else unnumbered `Then`/`Finally` clause split |

Mid-line step text retains trailing sentence punctuation when the next marker follows `.` / `!` / `?`.

---

## 3. Sequential-list detection rule

A numbered split is applied only when:

1. **≥2 markers** are found with `[.)]` followed by whitespace (excludes `2.5`, `version 2.0`, etc.).
2. Marker numbers form a **consecutive ascending sequence** (`N, N+1, N+2, …`).

Examples:

| Input | Result |
| ----- | ------ |
| `1. A. 2. B. 3. C.` | 3 steps |
| `1. A\n2. B` | 2 steps (unchanged) |
| `1. A. 4. D.` (single line) | 1 step (non-consecutive) |
| `1. A\n4. D` | 2 steps (line-start fallback) |

---

## 4. False-positive protections

| Case | Protection |
| ---- | ---------- |
| Decimals (`2.5`) | `[.)]` must be followed by whitespace, not a digit |
| Versions (`version 2.0`) | Same — `.0` does not match |
| Ordinary numeric prose | No `[.)]\s+` pattern |
| Isolated references (`equation 2. For …`) | Mid-line marker requires `[.!?]` immediately before the digit group |
| Non-sequential markers (`1. … 4. …` single line) | Consecutive check fails → single step |
| Non-numbered tasks | Unchanged `Then`/`Finally`/`Next` clause split |

---

## 5. DLA authoring salience

**No DLA prompt change made.**

Existing DLA contract already requires substantive multi-segment `learner_task` prose (AS-02 teach/model segments). It does not prescribe newline formatting, but parser hardening is sufficient to recover already-authored single-line sequences on **re-export** without regeneration. Prompt salience alone would not fix existing packages.

---

## 6. Tests added/changed

| File | Change |
| ---- | ------ |
| `tests/s78-t-040-numbered-learner-task-structure-recovery.test.js` | **Added** — operator specimen; `1)` form; newline/unnumbered preservation; false positives; non-sequential controls; live vNext export |

Existing `tests/s74a-t-042-activity-task-interleaving.test.js` — **unchanged**, all pass.

---

## 7. Test results

```text
tests/s78-t-040-numbered-learner-task-structure-recovery.test.js  8/8 pass
tests/s74a-t-042-activity-task-interleaving.test.js               4/4 pass
tests/learner-renderer-vnext-browser-artefact-freshness.test.js   2/2 pass (after rebuild)
```

---

## 8. Live vNext / re-export confirmation

Live export test injects the operator single-line specimen into `owen-a1-assembled-shape.json` and asserts through `renderLearnerPageForTest`:

- Three separate `util-beat-instruction` blocks with step 1 / 2 / 3 text
- First instruction does **not** contain literal `2.` / `3.` markers

Re-export of the post–94 Lagrangian package requires no GPT regeneration.

---

## 9. Existing behaviour preserved

| Behaviour | Status |
| --------- | ------ |
| Newline-separated numbered lists | Unchanged |
| Unnumbered `Then`/`Finally` clause split | Unchanged |
| Non-sequential newline lists (`1.\n4.`) | Unchanged |
| Single numbered step | Unchanged |
| Non-numbered prose | Unchanged |

---

## 10. Files changed

| Path | Role |
| ---- | ---- |
| `lib/learner-renderer-vnext/parse-learner-task.js` | Mid-line consecutive numbered split |
| `lib/learner-renderer-vnext-browser.js` | Regenerated |
| `lib/learner-renderer-vnext-export-runtime.js` | Regenerated |
| `lib/learner-renderer-vnext-export-runtime-source.js` | Regenerated |
| `tests/s78-t-040-numbered-learner-task-structure-recovery.test.js` | Regression coverage |
| Sprint navigation docs | Minimal T-040 record + status |

---

## 11. Deviations

None.

---

## 12. Unresolved risks

| Risk | Notes |
| ---- | ----- |
| Remaining T-038 defects | Defects 1, 3 (fixed T-039), 4 still open |
| Edge-case mid-line sequences | Rare prose with `. 2.` after sentence end could split if part of consecutive list — mitigated by consecutive-number requirement |
| Authoring preference | Newline-separated steps remain best practice; parser does not enforce formatting upstream |

---

## 13. Sprint 78 / T-013 state

**Sprint 78:** OPEN  
**T-013:** OPEN — not closed by this parser fix  
**T-041+:** not opened from this task
