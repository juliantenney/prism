# S78-T-009 — DLA P02 provider-row output-shape salience repair

**Task:** S78-T-009  
**Status:** **COMPLETE** (2026-08-17)  
**Mode:** Bounded prompt-contract implementation  
**Depends on:** [S78-T-008-candidate-1-prompt-reliability-diagnostic.md](S78-T-008-candidate-1-prompt-reliability-diagnostic.md)

---

## 1. Implementation summary

Repaired **§10 OUTPUT CONTRACT AND SHAPE** in `lib/ld-dla-page-enrich-contract.js` so the P02 provider-row invariant is **authoritative at the output-emission surface**, replacing misleading “optional only on evidence-provider rows” framing.

Added a **compact 4-item pre-output deterministic capture checklist** immediately before the forbidden list in §10.

No validator, schema, GAM, assembly, or renderer changes.

---

## 2. Exact §10 weakness repaired

**Removed:**

```text
- optional only on evidence-provider required_materials[] rows: evidence_requirement
- when evidence_requirement is present it MUST include: ...
```

This wording made `evidence_requirement` appear skippable at JSON construction time even when `provider_material_ids` was populated (T-008 Candidate 1 exhibit).

---

## 3. New normative output invariant

When `evidence_decision.required === true`:

- Every `material_id` in `evidence_decision.provider_material_ids` **MUST** identify a `required_materials[]` row carrying a **complete** `evidence_requirement`.
- Each provider row **MUST** appear in `task_material_decision.task_input_material_ids`.
- `evidence_requirement` **MUST NOT** appear on non-provider rows.
- When `evidence_decision.required === false`, omit `evidence_requirement` on all rows.

Required subfields unchanged: `kind`, `purpose`, `learner_action`, `observable_features`.

---

## 4. Pre-output checklist added

```text
Pre-output deterministic capture checks (verify internally before returning JSON):
1. P02 closure: for every provider_material_id, the matching required_materials[] row contains complete evidence_requirement.
2. Provider ids ⊆ task_input_material_ids when evidence_decision.required is true.
3. Load-bearing production bound via response_fulfilment on an operational learner-response row (see §4).
4. No evidence_requirement on non-provider rows; provider_material_ids empty when evidence_decision.required is false.
```

---

## 5. §7/§8/§10/§11 consistency

| Section | Role | Status |
| ------- | ---- | ------ |
| §7 Evidence | Conditional MUST: attach `evidence_requirement` on provider rows | Unchanged |
| §8 Providers | Field shape when `required: true` | Unchanged |
| §10 Output | **P02 closure invariant + checklist** | **Repaired** |
| §11 Examples | Evidence-true miniature with linked provider row | Unchanged |

Mutual consistency protected by `S78-T-009: §7/§8/§10/§11 remain mutually consistent on P02` test.

---

## 6. S78-WS-1 preservation

- `response_fulfilment` output line unchanged.
- §4 WS1 MUST-bind language unchanged.
- Checklist item 3 references §4 without altering WS1 semantics.
- All `tests/s78-dla-response-fulfilment.test.js` tests pass.

---

## 7. Prompt size before/after

| Surface | Before | After | Delta |
| ------- | ------ | ----- | ----- |
| Canonical contract (workbook overlay) | 28,698 chars | 29,628 chars | **+930 (+3.2%)** |

Bounded increase — structural salience only, no §7/§8 duplication.

---

## 8. Tests changed

| File | Change |
| ---- | ------ |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | +3 tests (S78-T-009 P02 output surface, checklist, §7/§8/§10/§11 consistency) |

---

## 9. Tests run + results

| Suite | Result |
| ----- | ------ |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | **37/37 pass** (incl. 3 new) |
| `tests/s78-dla-response-fulfilment.test.js` | **9/9 pass** |
| `tests/ld-dla-canonical-assembler.test.js` | **21/21 pass** |
| `tests/s76-dla-p01-p02-p03-contract.test.js` | **24/24 pass** (incl. P02 fail: provider missing `evidence_requirement`) |
| `tests/sprint-72-evidence-centred-activity-slice.test.js` | 53/60 pass — **7 pre-existing failures** on fixtures missing `response_fulfilment` (`S78_WS_UNBOUND_PRODUCTION`); unrelated to T-009 prompt edit |

---

## 10–14. Change matrix

| Area | Changed |
| ---- | ------- |
| Validator | **NO** |
| Schema | **NO** |
| GAM | **NO** |
| Assembly | **NO** |
| Renderer | **NO** |
| Production prompt | **YES** — `lib/ld-dla-page-enrich-contract.js` §10 only |

---

## 15. Production files changed

- `lib/ld-dla-page-enrich-contract.js`

---

## 16. Documentation files changed

- `S78-T-009-dla-p02-provider-row-output-shape-salience-repair.md` (this record)
- `STATUS.md`
- `PLAN.md`
- `SPRINT-78-START-HERE.md`
- `S78-T-008-workstream-1-integration-verification.md` (resume note)

---

## 17. Deviation from diagnostic design

**None.** Implemented exactly as designed: §10 conditional REQUIRED invariant + compact pre-output checklist; no §7/§8 duplication; §11 example retained.

Legacy rollback builder (`buildDlaPageEnrichContractBlock`) retains old optional framing — canonical assembler path is live default; rollback path untouched per bounded scope.

---

## 18. Recommended next action

> **Resume S78-T-008** using the **same fresh EP**, generate a new DLA candidate through the unchanged operator workflow, and inspect/validate that candidate before proceeding to GAM.

Do not regenerate the full benchmark inside T-009 scope.
