# S74A-T-042 — Activity-beat/task interleaving provenance and definitive-path repair

**Sprint:** 74A — Authoring → Learner Export Path Integrity  
**Task:** S74A-T-042  
**Status:** **Done** (2026-08-06)  
**Mode:** Narrow definitive-path repair + regression protection  
**Authority:** [PLAN.md](PLAN.md) · [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) · T-030 §8 (qualified) · T-040 inventory  
**Baseline revision (pre-repair):** `49279694bbdec17a0c32d0129fcd8f899e4aa37d`

---

## 1. Defect statement

**Observed (production):** For activities whose `learner_task` is unnumbered multi-clause prose (e.g. Owen A1), explanatory materials render in **Explore the idea**, while the entire task string — including study clauses — is dumped into one terminal **Your task** block.

**Expected:** Study clauses remain structurally linked with Learn materials; production clauses remain in Do; tasks are not flattened into one aggregate terminal list unless the page model explicitly represents one aggregate task.

This observed grouped-terminal behaviour must **not** be treated as the required T-030 baseline.

---

## 2. Current-revision provenance

| Step | Result |
| ---- | ------ |
| Commit hash | `49279694bbdec17a0c32d0129fcd8f899e4aa37d` |
| Freshness (before rebuild) | `npm run check:learner-renderer-vnext-browser` → **OK** |
| Rebuild | `npm run build:learner-renderer-vnext-browser` |
| Freshness (after rebuild / after repair) | **OK** |
| Browser | Static `http://localhost/prism/?t=s74a-t-042-interleave&nocache=1` |
| Input artefact | `tests/fixtures/page-render/owen-a1-assembled-shape.json` (controlled fixture) |
| Historical HTML | `page - 2026-08-05T100456.html` used only as **defect evidence**, not acceptance |

---

## 3. Reproduction

Pre-repair composition of Owen A1:

| Moment | Content |
| ------ | ------- |
| Learn | `M:A1-M1`, `M:A1-M2` only (no study instruction) |
| Do | Single instruction = entire learner_task (“Study… Then write… Finally…”) under **Your task** |

`parseLearnerTask` returned **one** step for the whole paragraph. Archetype allocation parked that step on `independent_performance`. Sprint 72 recovery then forced learn-classified text into Do via `doOwnedBeat`, and Learn no longer pulled learn instructions from do-beats.

---

## 4. Layer-by-layer trace

| Layer | Beat↔task association? | Flattened? | Owner | Obsolete path? |
| ----- | ---------------------- | ---------- | ----- | --------------- |
| 1. Generation/stage contract | Authored multi-clause prose OK | N/A | DLA/GAM upstream | No |
| 2. Enrichment/assembly | Present as single `learner_task` string | Not yet | page assembly | No |
| 3. Normalisation / parse | **Lost** — unnumbered prose → 1 step | Yes | `parse-learner-task.js` | No |
| 4. Assembled vNext model | Materials on explanation/example; all steps on independent_performance | Association broken | `build-beat-model.js` + V1 binding `take:"rest"` | No |
| 5. Export orchestration | vNext only (`runLearnerRendererVNextExport`) | Pass-through | `app.js` | **No** Legacy / structured-HTML |
| 6. Browser-loaded vNext | Moments composition | Learn materials; Do aggregate | `compose-generic-moments.js` | No |
| 7. Final HTML | Matches aggregate defect | Terminal Your task | `render-composed-moment.js` | No |

**Answers to key questions**

1. Association lost **before final template** — at parse + composition.  
2. Assembled page has materials on learn beats and task text on do beat, but **not** clause-level placement until parse splits.  
3. vNext composition previously **ignored** learn placement on do-beats (S72) and re-aggregated under Do.  
4. **No** old page-rendering / `buildUtilityStructuredHtml` involvement on the current vNext path.  
5. Aggregate list came from **one parsed step** + Do ownership exception — not a Legacy fallback.  
6. Prior S72 “Do recovery” fixed a missing Do moment on one branch while encoding the aggregate behaviour in tests (`sprint-72-owen-a1-do-recovery.test.js`).  
7. Those S72 tests protected the wrong ordering; numbered heteroscedasticity suites exercise a different parse shape.  
8. **Single definitive owner:** vNext `parse-learner-task` (clause identity) + `compose-generic-moments` Learn/Do placement (ordering). Renderer template is not the owner.

---

## 5. Root cause

Two cooperating defects on the **definitive vNext** path:

1. **`parseLearnerTask`** only split numbered lists. Unnumbered “Study… Then write… Finally…” stayed one step.  
2. **Sprint 72 Do recovery** (`de62802`) stopped collecting learn-classified instructions from do-beats into Learn, and allowed learn placement onto Do via `doOwnedBeat` — producing the terminal aggregate under **Your task**.

Obsolete structured-HTML / Legacy routing was **not** involved.

---

## 6. Definitive owner

| Responsibility | Owner |
| -------------- | ----- |
| Clause identity for unnumbered sequential tasks | `lib/learner-renderer-vnext/parse-learner-task.js` |
| Learn vs Do placement / interleave with materials | `lib/learner-renderer-vnext/compose-generic-moments.js` |
| HTML emission of composed moments | `render-composed-moment.js` (consumer only) |
| slide_deck / `buildUtilityStructuredHtml` | **Unrelated** — retain for non-page; do not own learner-page interleaving |

---

## 7. Implementation change

1. **`parse-learner-task.js`** — after numbered-list parsing, split unnumbered prose on sequential discourse markers (`Then` / `Finally` / `Next` / …), strip markers, keep numbered entries unsplit.  
2. **`compose-generic-moments.js`** — restore Learn collection of learn-classified instructions from do/split beats; **stop** putting learn-classified steps into Do (`doOwnedBeat` exception removed).  
3. Rebuild generated browser artefacts.  
4. Replace S72 Owen tests that encoded aggregate Do ownership; add `tests/s74a-t-042-activity-task-interleaving.test.js`.

---

## 8. Duplicate / obsolete path findings

| Surface | Finding | Action |
| ------- | ------- | ------ |
| Legacy / `buildUtilityStructuredHtml` page branch | Not on current path | Remains T-045 removal inventory; **not** interleaving owner |
| S72 Owen aggregate assertions | Protected regression | Updated to interleaving expectations |
| Pre-existing heteroscedasticity check-step pairing failures in some suites | Present **before** T-042 (stash baseline also 5 fails) | Out of T-042 scope; do not treat as acceptance of aggregate Your task |

---

## 9. Focused regression evidence

```text
node --test tests/s74a-t-042-activity-task-interleaving.test.js
  tests/sprint-72-owen-a1-do-recovery.test.js
  tests/sprint-72-owen-a1-public-export-path.test.js
→ 6 pass / 0 fail
```

Assertions prove **ordering**, not mere text presence (Study before materials; Write/Apply in Do; Study absent from Do).

---

## 10. Generated-artefact freshness

`npm run build:learner-renderer-vnext-browser` then `npm run check:learner-renderer-vnext-browser` → **OK**.

---

## 11. Production browser verification

Path: `http://localhost/prism/?t=s74a-t-042-interleave&nocache=1` (static `index.html`).

| Check | Result |
| ----- | ------ |
| `PRISM_LEARNER_RENDERER_VNEXT` present | Yes |
| Authoring Preview with Owen fixture | `data-renderer=vnext` |
| Study in Learn before `A1-M1` | Yes |
| Write in Do; Study not in Do | Yes |
| Write not in Learn | Yes |

Supporting: `__PRISM_TEST_API.renderLearnerPageForTest` on same browser session (Node suites remain supporting only).

---

## 12. Residue sweep

| Match | Disposition |
| ----- | ----------- |
| Aggregate S72 Owen expectations | Updated |
| `doOwnedBeat` learn→Do exception | Removed |
| Discourse split helpers | Owned by `parse-learner-task` |
| Docs describing aggregate Owen Do as desired | None active beyond S72 tests (updated) |
| Page-only structured HTML | Still T-045; confirmed **not** this defect’s owner |

---

## 13. Impact on T-040 / T-045

- Interleaving ownership is **vNext composition/parse**, not shared structured HTML.  
- T-045 may still remove obsolete page branches inside `buildUtilityStructuredHtml`, but must **not** treat that module as the place to “preserve” interleaving.  
- Retained `runUtilityRendererByPlan` / slide_deck ownership unchanged.  
- T-045 remains blocked only until this repair is accepted; then proceed with inventory slices, preserving **corrected** interleaving (not T-030’s accidental aggregate observation).

---

## 14. Unresolved risks

| Risk | Notes |
| ---- | ----- |
| Discourse-marker split heuristics | Conservative markers only; unusual prose may still need numbered tasks |
| V1 `take:"rest"` on independent_performance | Study steps may still be allocated onto do beats; Learn composition re-homes them — durable but indirect |
| Pre-existing A1 check step-3 pairing gaps | Separate from T-042; do not reopen under T-045 without evidence |

---

## 15. Files changed

| File | Role |
| ---- | ---- |
| `lib/learner-renderer-vnext/parse-learner-task.js` | Clause split |
| `lib/learner-renderer-vnext/compose-generic-moments.js` | Learn/Do placement |
| `lib/learner-renderer-vnext-browser.js` (+ export companions if touched by build) | Generated artefacts |
| `tests/s74a-t-042-activity-task-interleaving.test.js` | New regression |
| `tests/sprint-72-owen-a1-do-recovery.test.js` | Corrected expectations |
| `tests/sprint-72-owen-a1-public-export-path.test.js` | Corrected expectations |
| Sprint 74A docs + T-030/T-040 notes | Tracking |

---

## 16. Commit-slice recommendation

1. Evidence note + regression tests (including corrected S72 Owen assertions).  
2. Definitive-path repair (`parse-learner-task` + `compose-generic-moments`).  
3. Generated browser artefacts + freshness confirmation.  
4. Sprint documentation / T-030 qualification / T-040 follow-up.

Each slice should leave the tree verifiable and reversible. **Do not** combine with T-045.

---

## Acceptance

| Criterion | Met |
| --------- | --- |
| Reproduced from current fresh artefacts | Yes |
| Exact layer identified | Yes — parse + compose |
| One definitive owner | Yes |
| Production path corrected | Yes |
| Ordering regression tests | Yes |
| Fresh browser verification | Yes |
| Stale artefacts not used as proof | Yes |
| T-040/T-045 reconciled | Yes |
| No T-045 / 74B / 74C / Sprint-70 E4 work | Yes |
