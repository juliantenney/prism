# S78-T-005 — DLA contract + `response_fulfilment` commissioning

**Task:** S78-T-005  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-17)  
**Workstream:** 1 — Learner production / workspace fulfilment  
**Depends on:** [S78-T-004](S78-T-004-learner-production-workspace-fulfilment-solution-design.md) (design complete)  
**Authorisation:** Operator authorised bounded T-004 DLA-side repair (T-005 scope includes contract + capture validator per implementation prompt)

---

## 1. Implementation summary

Implemented **S78-WS-1 Response fulfilment binding** at the DLA commissioning layer:

- New structured field `response_fulfilment` on `required_materials[]` rows (parallel to `evidence_requirement`).
- Canonical DLA contract bumped to **`78-DLA-WS-1`** with §4 Production, §6 Commissioning, and §10 Output shape rules.
- Fail-closed capture gate in `validateDlaPartialPageCapture` / `validateDlaEnrichedPage` via new module `lib/dla-production-fulfilment.js`.
- GAM authoritative commission projection (T-023 path) now copies `response_fulfilment` into embedded JSON.

**Not implemented in T-005 (per T-004 decomposition):** GAM blank-cell defence-in-depth → **S78-T-007**.

---

## 2. Canonical invariant enforced

> Every **load-bearing learner production obligation** must be explicitly bound to ≥1 commissioned **learner response surface** (`required_materials[]` row with `response_fulfilment` + compatible `material_type`) before GAM runs.

T-001 exhibit class (table production satisfied by static `text` / `explanatory_note` / `checklist` only) now **FAIL CLOSED** at DLA capture with `S78_WS_UNBOUND_PRODUCTION`.

---

## 3. `response_fulfilment` representation

```json
"response_fulfilment": {
  "kind": "learner_workspace",
  "response_kind": "table_compare",
  "binds_production_steps": [3],
  "allows_partial_exemplar": true
}
```

| Field | Values |
| ----- | ------ |
| `kind` | `learner_workspace` \| `learner_text_production` |
| `response_kind` | `table_compare` \| `table_complete` \| `table_decide` \| `table_classify` \| `table_plan` \| `text_compose` |
| `binds_production_steps` | Optional 1-based `learner_task` step numbers |
| `allows_partial_exemplar` | Optional boolean (documents G5 partial-row intent) |

No new `material_type` tokens. Material vocabulary unchanged from Sprint 77.

---

## 4. Production files changed

| File | Purpose |
| ---- | ------- |
| `lib/dla-production-fulfilment.js` | **New** — step classifier, shape validation, S78-WS-1 gate |
| `lib/ld-dla-page-enrich-contract.js` | Contract text + version `78-DLA-WS-1` |
| `lib/page-dla-enrich.js` | Wire shape validation + fulfilment gate into capture validators |
| `app.js` | `projectGamAuthoritativeDlaCommissionFromPage` projects `response_fulfilment`; authority prose updated |
| `tests/s78-dla-response-fulfilment.test.js` | **New** — R1–R3/R6 regression suite |
| `tests/ld-dla-canonical-assembler.test.js` | Version bump assertions |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | Version bump assertions |
| `tests/ld-instructional-archetype-production-planning.test.js` | Version bump assertions |

---

## 5. Fail-closed diagnostics

| Code | Condition |
| ---- | --------- |
| `S78_WS_UNBOUND_PRODUCTION` | Load-bearing production kind with no matching commissioned row |
| `S78_WS_INCOMPATIBLE_TYPE` | `response_fulfilment.response_kind` incompatible with `material_type`, or teaching-only type bound to table production |

Errors include `activity_id`, step number/snippet, required `response_kind`, and commissioned `material_id` list where applicable.

---

## 6. Valid cases preserved (regression tests)

| Case | Result |
| ---- | ------ |
| Production + valid `comparison_table` workspace | PASS |
| Production + static-only materials (T-001 class) | FAIL |
| Display `reference_table` + study/verify task | PASS |
| Supporting materials + distinct workspace | PASS |
| Partial exemplar workspace (`allows_partial_exemplar: true`) | PASS |

---

## 7. Verification commands

```text
node --test tests/s78-dla-response-fulfilment.test.js
node --test tests/ld-dla-evidence-decision-consistency-prompt.test.js tests/ld-dla-canonical-assembler.test.js tests/s76-dla-p01-p02-p03-contract.test.js
node --test tests/page-dla-enrich.test.js tests/page-gam-enrich.test.js tests/ld-instructional-archetype-production-planning.test.js tests/ld-instructional-archetype.test.js tests/ld-activity-title-contract.test.js
```

**Results:** 9/9 S78 tests pass; 68/68 focused DLA contract suite pass; 105/105 broader DLA/GAM suite pass.

---

## 8. Sprint 77 protected-contract impact

- P01–P04, T-031, T-033, evidence_decision, task_material_decision validators **unchanged in behaviour** for non-table-production activities.
- Contract version increment **`78-DLA-WS-1`** extends (does not replace) `77-DLA-CANONICAL-3` semantics.
- No assembly or renderer changes.

---

## 9. Remaining Workstream 1 gap

| Item | Successor |
| ---- | --------- |
| GAM blank-cell guard for bound workspace rows | **S78-T-007** |
| Full R1/R4/R5 integration + fresh Lagrangian Gate | **S78-T-008** |

T-005 proves **DLA commissioning repair only**. Fresh regeneration QA belongs at T-008 gate.

---

## 10. Recommended next task

**S78-T-007** — GAM capture validator blank-cell guard for `response_fulfilment.kind === "learner_workspace"` table-family rows (T-004 §6).

Do **not** jump to benchmark regeneration until T-007 (and any other designed WS1 components) are complete.
