# S78-T-039 — Guided-review feature-list enumeration fix

**Task:** S78-T-039  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-25)  
**Implements:** [S78-T-038](S78-T-038-learner-composition-presentation-regression-diagnostic.md) Defect 3 (P1)  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

---

## 1. Root-cause confirmation

Guided-review **What to look for** feature rows are rendered by `renderGuidedFeatureLists` in `lib/learner-renderer-vnext/render-material.js`. The renderer generates semantic feature keys (`A.`, `B.`, …) inside each `<li>`, but the look-for block wrapped those rows in `<ol>`. The browser therefore composed **numeric ordered-list markers** with **renderer letter keys**, producing learner-visible `1. A.` / `2. B.` with no independent numeric semantics.

The **If something is missing** block already used `<ul>` with `Missing A:` / `Missing B:` labels and was not affected.

This is a **material-renderer presentation bug**, not authoring, GAM generation, or guided-review schema.

---

## 2. Exact production change

| Item | Detail |
| ---- | ------ |
| **File** | `lib/learner-renderer-vnext/render-material.js` |
| **Function** | `renderGuidedFeatureLists` |
| **Change** | Look-for list wrapper `<ol>` → `<ul>` |
| **Unchanged** | `util-guided-review__feature-key` letter generation; feature content; missing/repair `<ul>` block; classes and DOM hooks |

Expected learner-facing structure:

```text
A. …
B. …
```

Not:

```text
1. A. …
2. B. …
```

---

## 3. Why the change is scoped safely

- Only the look-for branch of `renderGuidedFeatureLists` changed — a single guided-review surface.
- Global markdown ordered-list handling (`renderMarkdownBlock` → `<ol>`) untouched.
- A/B key generation, guided-review schema, GAM content, missing-item repair lists, learner-task parsing, workspace/template behaviour, and QA workflows unchanged.
- `<ul>` preserves list semantics and accessibility (`<li>` rows, section labels, feature keys) without adding a second enumeration layer.

---

## 4. Tests added/changed

| File | Change |
| ---- | ------ |
| `tests/s78-t-039-guided-review-feature-list-enumeration.test.js` | **Added** — look-for A/B/C keys; no `<ol>` in look-for; no `1. A.` combination; order preserved; missing guidance unchanged; ordinary markdown `<ol>` unaffected; live vNext export path via `__PRISM_TEST_API.renderLearnerPageForTest` |

---

## 5. Test results

```text
tests/s78-t-039-guided-review-feature-list-enumeration.test.js  5/5 pass
tests/learner-renderer-vnext-guided-review.test.js              9/9 pass
tests/learner-renderer-vnext-browser-artefact-freshness.test.js 2/2 pass (after rebuild)
```

---

## 6. Live / re-export confirmation

Live vNext export test injects a two-criterion guided-review checklist (A/B/C features on criterion 1) into `tests/fixtures/page-render/owen-a1-assembled-shape.json` and asserts through `renderLearnerPageForTest`:

- `util-guided-review__feature-key">A.` / `B.` / `C.` present in look-for
- look-for section uses `<ul>`, not `<ol>`
- no `1. <span class="util-guided-review__feature-key">A.` combination
- `Missing A:` repair guidance unchanged

Re-export of the existing post–94 Lagrangian package requires no GPT regeneration — only renderer rebuild/export. Operator re-export should show the same fix on guided-review surfaces already authored with A/B features.

---

## 7. Ordinary ordered lists unaffected

Regression test confirms `renderMarkdownBlock("1. First…\n2. Second…")` still emits `<ol>` with ordered items.

---

## 8. Files changed

| Path | Role |
| ---- | ---- |
| `lib/learner-renderer-vnext/render-material.js` | Look-for `<ol>` → `<ul>` |
| `lib/learner-renderer-vnext-browser.js` | Regenerated browser bundle |
| `lib/learner-renderer-vnext-export-runtime.js` | Regenerated export runtime |
| `lib/learner-renderer-vnext-export-runtime-source.js` | Regenerated export runtime source |
| `tests/s78-t-039-guided-review-feature-list-enumeration.test.js` | Regression coverage |
| Sprint navigation docs | Minimal T-039 record + status |

---

## 9. Deviations

None.

---

## 10. Unresolved risks

| Risk | Notes |
| ---- | ----- |
| Residual T-038 defects | Defects 1, 2, 4 remain open (transfer production, numbered tasks, workspace fidelity) |
| CSS list-style on `<ul>` | Look-for lists may still show bullet markers unless CSS zeroes list-style for `util-guided-review__look-for ul`; numeric double-enumeration is fixed; visual bullet vs letter-only is a separate styling question |
| Other `<ol>` + inline label patterns | Out of scope; only guided-review look-for was changed |

---

## 11. Sprint 78 / T-013 state

**Sprint 78:** OPEN  
**T-013:** OPEN — not closed by this renderer fix  
**T-040+:** not opened from this task
