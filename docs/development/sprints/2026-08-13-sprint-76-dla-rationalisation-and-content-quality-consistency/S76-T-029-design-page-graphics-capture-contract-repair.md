# S76-T-029 — Design Page graphics capture contract repair

**Task:** S76-T-029  
**Status:** **Implemented** (2026-08-13) — ready to recapture Design Page  
**Mode:** Bounded Design Page **capture** repair only  
**Depends on:** live Lagrangian Graphics (0) blocker · preceding graphics-handoff diagnostics  
**Out of scope:** Design Page prompt rewrite · Graphics planner/compiler behaviour · DLA/GAM/EP · P04/P05 · stale-image / Clear Run Data · Lagrangian regeneration

This artefact records the capture-gate repair. It does **not** recapture Design Page. It does **not** claim the current Lagrangian run is unblocked until the operator re-runs Design Page only.

---

## 1. Live blocker

Graphics (0) on the assembled Lagrangian page:

- `visual_affordances[0]: rationale is required` (`va-a1-constrained-system`)
- `visual_affordances[1]: rationale is required` (`va-a4-verification-framework`)
- `visual_affordances[2]: rationale is required` (`va-a5-shadow-price`)
- Visual job planning: “Not run because the visual-planning contract is invalid.”

---

## 2. Root cause

Design Page capture (`validateDesignPagePartialPageCapture`) did not validate `visual_affordances[]` row shape. It only syntax-checked `evidence_anchors` when that array was already present.

The Design Page prompt already requires `rationale` and the generate field set. Graphics already fail-closes via `validateAffordanceEnvelope`. Incomplete generate rows were stored, assembled, then rejected at Graphics.

---

## 3. Production files changed

| File | Change |
| ---- | ------ |
| `lib/visual-planning-contract.js` | Evidence-anchor **existence** check skipped when `activityIdSet` is null. New `validateVisualPlanningCaptureShape(page)` reuses Sprint 38 envelope + Sprint 70 generate SHAPE (subject, context, evidence_anchors presence/syntax). Does **not** check `page.activities[]`. |
| `app.js` | `validateDesignPagePartialPageCapture` calls `validateVisualPlanningCaptureShape` and surfaces issue messages as capture errors. |
| `index.html` | Cache pin `lib/visual-planning-contract.js?v=20260813-s76-dp-va-capture` |

**Not changed:** Design Page prompt blocks · `lib/sprint38-visual-affordances.js` · `lib/prism-visual-jobs-planner.js` · `lib/prism-image-brief-compiler.js` · DLA/GAM/EP · captured Lagrangian JSON.

---

## 4. Shared validator reuse

| Piece | Reuse |
| ----- | ----- |
| Sprint 38 envelope including `rationale` | `validateAffordanceEnvelope` via existing `mapSprint38AffordanceErrors` |
| Sprint 70 generate SHAPE (`subject`, `context`, `evidence_anchors` present/non-empty/syntax) | existing `validateGeneratePlanningFields` / `validateEvidenceAnchorSyntax` with `activityIdSet = null` |
| Schema version when VA fields present | existing `validateSchemaVersion` / `detectFieldPresence` |
| Assembled-page activity existence | **not** called at capture; remains Graphics/`validateVisualPlanningContract` |

`validateVisualPlanningContract` is **not** called on Design Page partials (would false-fail activity-scoped ids).

Sprint 70 shape vs referential split: `validateEvidenceAnchorSyntax` now applies `VPC_EVIDENCE_ANCHOR_UNKNOWN_ACTIVITY` only when `activityIdSet` is a non-null object. Capture passes `null`. Graphics still passes `collectPageActivityIds(page)`.

---

## 5. Schema-version capture rule

When any of `visual_affordance_schema_version`, `activities_visual_review`, or `visual_affordances` is **present** (including empty arrays), capture requires `visual_affordance_schema_version: "38.4"` — same presence rule as Graphics.

Legitimate Design Page partials **without** those keys (legacy / no visual planning) remain valid.

Empty `visual_affordances: []` remains valid **with** schema `"38.4"`.

---

## 6. Capture invariant implemented

A Design Page `visual_affordances[]` row with `visual_decision: "generate"` is rejected at capture unless it satisfies the downstream generate-row **SHAPE** contract Graphics will consume.

Empty `visual_affordances: []` remains valid.

Activity-id / evidence-anchor **existence** against `page.activities[]` is **not** a capture check.

Invalid generate rows fail capture with the concrete row messages (e.g. `visual_affordances[0]: rationale is required`). They are not stored for later Graphics failure.

---

## 7. Tests

New: `tests/s76-design-page-graphics-capture-contract.test.js`  
Fixture: `tests/fixtures/page-assemble/dp-partial-generate-valid.json`

| Case | Result |
| ---- | ------ |
| Missing `rationale` (live bug) | capture **fail** |
| Missing `learner_stage` | capture **fail** |
| Missing `evidence_anchors` | capture **fail** |
| Invalid evidence-anchor syntax | capture **fail** |
| No VA keys | capture **pass** |
| `visual_affordances: []` + schema 38.4 | capture **pass** |
| Valid generate, no `activities[]` | capture **pass** |
| E2E capture → assemble → `validateVisualPlanningContract` valid → `planPrismVisualJobs` jobs ≥ 1 → `compilePrismImageBriefs` briefs ≥ 1 | **pass** |

Also re-ran: `tests/page-partial-capture-validate.test.js`, `tests/page-vnext-assemble.test.js`, `tests/sprint-70-slice-4-visual-jobs-planner.test.js` — **99 pass / 0 fail** combined with T-029.

---

## 8. Compatibility

- Design Page partials without visual-planning keys: unchanged.
- Generate rows that Graphics already accepted: still pass capture.
- Capture does not require `activities[]`.
- Graphics planner fail-closed behaviour unchanged.

---

## 9. Confirmations

| Item | Status |
| ---- | ------ |
| Graphics planner fail-closed | **Unchanged** |
| Design Page prompt semantics | **Unchanged** |
| DLA / GAM / EP | **Unchanged** |
| Current Lagrangian captures | **Not edited** |
| P04 / P05 | **Not started** |
| Stale-image / Clear Run Data | **Untouched** in this task (separate defect). **Later:** queue G Clear Run Data generated-image purge closed by bounded maintenance 2026-08-14. |

---

## 10. Stale-image defect (not this task)

Operator observation: Clear run data does not clear previously stored images. Separate from missing graphics jobs. Do not fold into this repair.

---

## 11. Verdict

**GRAPHICS CAPTURE/HANDOFF DEFECT IMPLEMENTED — READY TO RECAPTURE DESIGN PAGE**

Operator action: re-run Design Page only on the existing Lagrangian EP/DLA/GAM state. Do not hand-edit the previous Design Page JSON.
