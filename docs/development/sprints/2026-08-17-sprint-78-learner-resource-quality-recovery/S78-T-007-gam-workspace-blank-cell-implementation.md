# S78-T-007 — GAM learner-workspace blank-cell capture enforcement

**Task:** S78-T-007  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-17)  
**Workstream:** 1 — Learner production / workspace fulfilment (defence-in-depth)  
**Depends on:** [S78-T-005](S78-T-005-dla-response-fulfilment-implementation.md) (DLA commissioning repair complete)  
**Authorisation:** Operator authorised bounded GAM defence-in-depth per T-004 §6

---

## 1. Implementation summary

Added **S78-WS-1 GAM defence-in-depth**: when authoritative DLA commission marks a table-family material as `response_fulfilment.kind === "learner_workspace"`, GAM capture **fail-closed** if the authored markdown table body contains **no blank learner-response cells**.

- New module: `lib/gam-workspace-fulfilment.js`
- Wired into `validateGamPartialPageCapture` and `validateGamEnrichedPage` via `appendGamWorkspaceBlankCellGate`
- Partial GAM capture receives DLA baseline via `app.js` (`resolveDlaEnrichedPageJsonForGamCopy`) for `response_fulfilment` lookup
- Minimal GAM contract line added to `lib/ld-gam-page-enrich-contract.js` aligning prompt with executable guard

**Not in scope:** DLA changes, assembly, renderer, benchmark regeneration.

---

## 2. Authoritative GAM invariant enforced

> When DLA has commissioned `response_fulfilment.kind === "learner_workspace"` on a table-family row, GAM must not consume all learner-response slots — the table body must retain ≥1 blank cell detectable by `materialHasBlankTableCells()`.

This closes T-001 secondary **C** (GAM fills table bodies) at capture time, without inferring workspace intent from `material_type` or task verbs alone.

---

## 3. How `response_fulfilment` reaches GAM capture

| Path | Authority source |
| ---- | ---------------- |
| **Full GAM page** | `activities[].required_materials[]` on captured page (preserved from DLA baseline) |
| **Partial GAM capture** | DLA baseline page passed as `{ baseline }` from `validatePartialPageCaptureForStep` / `validateGamOrPageCapture` in `app.js` — lookup by `activity_id` + `material_id` |

T-005 T-023 projection (`projectGamAuthoritativeDlaCommissionFromPage`) remains the prompt-side commission; runtime validation uses stored DLA page JSON.

---

## 4. Table-family scope

Guard applies only when **both**:

1. Authoritative `response_fulfilment.kind === "learner_workspace"`
2. `material_type` ∈ `TABLE_MATERIAL_TYPES` **minus** `reference_table` (from `lib/learner-renderer-vnext/table-material-types.js`)

Excluded automatically: `reference_table`, `text`, instructional types without workspace commission.

---

## 5. Blank-response detection

Reuses `materialHasBlankTableCells()` from `lib/learner-renderer-vnext/table-material-parse.js` — same semantics as vNext conditional completion routing.

---

## 6. Fail-closed diagnostic

**Code:** `S78_WS_GAM_NO_BLANK_CELLS`

Includes: activity index/id, material index/id, `material_type`, `response_kind`, explicit message that GAM authored an all-filled learner workspace.

No silent repair or auto-blanking.

---

## 7. Partial-exemplar behaviour

**PASS** when ≥1 blank cell exists in data rows — fixed/model cells and partially completed exemplar rows are allowed (T-004 §6.3 / A2-M2 pattern).

---

## 8. Display/reference behaviour

Materials without `response_fulfilment.kind === "learner_workspace"` are **not** guarded — fully populated `reference_table` and `text` markdown tables pass unchanged.

Without DLA baseline, partial capture does **not** infer workspace from `comparison_table` alone.

---

## 9. Production files changed

| File | Purpose |
| ---- | ------- |
| `lib/gam-workspace-fulfilment.js` | **New** — commission lookup + blank-cell gate |
| `lib/page-gam-enrich.js` | Wire gate into both GAM validators |
| `app.js` | Pass DLA baseline to `validateGamPartialPageCapture` |
| `lib/ld-gam-page-enrich-contract.js` | One-line `response_fulfilment` authoring rule |
| `tests/s78-gam-workspace-blank-cell.test.js` | **New** — cases A–G regression suite |

---

## 10. Verification commands

```text
node --test tests/s78-gam-workspace-blank-cell.test.js
node --test tests/s78-dla-response-fulfilment.test.js tests/page-gam-enrich.test.js tests/ld-table-fidelity.test.js tests/s76-dla-p01-p02-p03-contract.test.js
```

**Results:** 9/9 T-007 tests; 90/90 combined WS1 + GAM + DLA suite pass.

---

## 11. Workstream 1 status after T-007

| Component | Status |
| --------- | ------ |
| DLA commissioning (T-005) | **Complete** |
| GAM preservation guard (T-007) | **Complete** |
| Integrated fresh regeneration + QA gate | **Outstanding** — **S78-T-008** |

Learner-facing Workstream 1 closure still requires fresh Lagrangian regeneration and independent QA — not claimed on unit tests alone.

---

## 12. Recommended next task

**S78-T-008** — Workstream 1 integration verification + fresh Lagrangian regeneration gate (R1/R4/R5 + operator QA per T-004 §9).

Do **not** start T-002/T-003 until WS1 integrated verification is complete or explicitly reprioritised.
