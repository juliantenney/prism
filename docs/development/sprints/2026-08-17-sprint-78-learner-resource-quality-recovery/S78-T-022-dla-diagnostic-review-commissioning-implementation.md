# S78-T-022 — DLA activity-level diagnostic-review commissioning implementation

**Task:** S78-T-022  
**Status:** **IMPLEMENTATION COMPLETE** (2026-08-17)  
**Mode:** DLA implementation (S78-WS-3 Stage 1)  
**Depends on:** [S78-T-021](S78-T-021-check-revision-architecture-solution-design.md)  
**Does not include:** GAM salience (T-023) · Lagrangian regeneration · T-019 · verifier extension · assembly/renderer changes

---

## 1. Implementation summary

Implemented **S78-WS-3** at the DLA commissioning layer:

- Lightweight `diagnostic_review` binding on the authoritative diagnostic `checklist` row
- DLA contract §4 / §6 / §10 salience (DR-1 closure + checklist item 6)
- G1 / DLA-WB-26 replaced with trigger-scoped S78-WS-3 rule in workbook overlay
- Stage 1 capture validation (`lib/dla-diagnostic-review.js` + `page-dla-enrich.js` gate)
- T-023 projection of `diagnostic_review` to GAM authoritative commission (`app.js`)
- Regression tests: `tests/s78-dla-diagnostic-review.test.js`
- Updated WS1/WS2 test fixtures with valid diagnostic-review rows where independent production exists

**Contract version:** `78-DLA-WS-3` (extends `78-DLA-WS-2`)

---

## 2. Exact S78-WS-3 invariant implemented

When an activity requires **substantive independent learner production**:

> DLA MUST commission **exactly one** checklist row with `diagnostic_review.covers_response_material_ids` set-equal to every same-activity `response_fulfilment` material id.

**Trigger (reused, not reimplemented):**

```text
classifyLearnerProductionSteps(...).productionKinds.length > 0
AND NOT isGuidedOnlyActivity(classification)
```

---

## 3. `diagnostic_review` representation

On diagnostic `checklist` `required_materials[]` rows only:

```json
"diagnostic_review": {
  "covers_response_material_ids": ["A2-W1"]
}
```

---

## 4. Capture diagnostic codes

| Code | Meaning |
| ---- | ------- |
| `S78_DR_MISSING_REVIEW` | Trigger true; no `diagnostic_review` checklist |
| `S78_DR_DUPLICATE_REVIEW` | More than one `diagnostic_review` on the activity |
| `S78_DR_COVERAGE_MISMATCH` | `covers_response_material_ids` ≠ fulfilment ids |
| `S78_DR_UNKNOWN_ID` | Covered id missing or not a response surface |
| `S78_DR_WRONG_HOST` | `diagnostic_review` on a non-checklist row |
| `S78_DR_INVALID_SHAPE` | Malformed binding object |

---

## 5. Files changed

| File | Change |
| ---- | ------ |
| `lib/dla-diagnostic-review.js` | **New** — trigger + capture gate |
| `lib/dla-practice-independence.js` | Export `isGuidedOnlyActivity` for WS-3 reuse |
| `lib/page-dla-enrich.js` | Wire shape validation + activity gate |
| `lib/ld-dla-page-enrich-contract.js` | `78-DLA-WS-3` contract prose |
| `app.js` | Project `diagnostic_review` to GAM commission |
| `tests/s78-dla-diagnostic-review.test.js` | **New** regression suite |
| `tests/s78-dla-response-fulfilment.test.js` | Fixture updates |
| `tests/s78-dla-practice-independence.test.js` | Fixture + size band |
| `tests/ld-dla-canonical-assembler.test.js` | Version bump |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | Version + size band |
| `tests/ld-instructional-archetype-production-planning.test.js` | Version bump |

**Not changed:** GAM prompts · assembly · renderer · verifier · schemas

---

## 6. GAM / renderer

Existing path unchanged: DLA checklist → GAM `guided_criteria` → renderer “Review your answer”. **T-023 not opened** — no evidence that commissioned checklists fail to reach `guided_criteria`.

---

## 7. Verification

| Criterion | Met? |
| --------- | ---- |
| Trigger reuses WS1/WS2 classifiers | Yes |
| Exactly-one review enforced at DLA capture | Yes |
| Coverage binds to `response_fulfilment` ids | Yes |
| G1 replaced, not blindly revived | Yes |
| No GAM/assembly/renderer change | Yes |
| Sprint 78 remains OPEN | Yes |

---

## 8. Recommended next task

**Operator-led:** resume **S78-T-013** (WS2 / operational suitability) or authorise **S78-T-024** integration verification / fresh benchmark after T-013 path stabilises.

Open **S78-T-023** only if a post-T-022 exhibit shows GAM authoring Markdown tick-lists instead of `guided_criteria` for commissioned diagnostic checklists.

Do **not** regenerate Lagrangian inside this task. Do **not** start T-019.

---

## 9. References

- [S78-T-021](S78-T-021-check-revision-architecture-solution-design.md)  
- [S78-T-003](S78-T-003-check-revision-architecture-diagnostic.md)  
- [S78-T-005](S78-T-005-dla-response-fulfilment-implementation.md) · [S78-T-011](S78-T-011-dla-model-practice-independence-commissioning.md)
