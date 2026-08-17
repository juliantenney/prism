# S78-T-011 — DLA model/practice independence commissioning contract

**Task:** S78-T-011  
**Status:** **COMPLETE** (2026-08-17)  
**Mode:** DLA implementation (S78-WS-2 Stage 1)  
**Depends on:** [S78-T-010](S78-T-010-modelling-practice-independence-solution-design.md)  
**Does not include:** GAM authoring (T-012), Lagrangian regeneration

---

## 1. Implementation summary

Implemented **S78-WS-2** at the DLA commissioning layer:

- Lightweight `practice_independence` binding on model rows (`worked_example`, `modelling_note`)
- DLA contract §4 / §6 / §10 salience (MP-1 closure + checklist item 5)
- Stage 1 capture validation (`lib/dla-practice-independence.js` + `page-dla-enrich.js` gate)
- T-023 projection of `practice_independence` to GAM authoritative commission (`app.js`)
- Bounded archetype grammar clarification (`independent_performance` semantics)
- Regression tests: `tests/s78-dla-practice-independence.test.js`

**Contract version:** `78-DLA-WS-2` (extends `78-DLA-WS-1`)

---

## 2. Exact S78-WS-2 invariant implemented

Where a worked model supports a subsequent **independent learner attempt** on the same capability:

> The model MUST demonstrate the method on a **distinct operand** and MUST NOT disclose or substantially complete the target solution or load-bearing reasoning required by the independent attempt.

Enforced at Stage 1 as **authoritative commissioning + structural closure** — not semantic body proof.

---

## 3. `practice_independence` representation

On model `required_materials[]` rows only:

```json
"practice_independence": {
  "attempt_operand_material_ids": ["A3-M1"]
}
```

Canonical shape per T-010 — no additional fields.

---

## 4. Trigger conditions

Binding **required** when activity has **all**:

1. ≥1 model row (`worked_example` / `modelling_note`)
2. ≥1 resolvable attempt operand (`task_input_material_ids` → scenario/task_card/etc., or operand-type row)
3. Independent attempt production: classified load-bearing production **or** bound `response_fulfilment` learner workspace/text production
4. **Not** guided-only (all non-study learner_task steps match guided-practice scaffolding pattern)

---

## 5. Guided-practice exclusion

When every non-study `learner_task` step matches guided-practice scaffolding (`guided practice`, `using the supplied hints`, etc.), binding is **not** required — even if a bound workspace exists.

---

## 6. DLA specification requirements (contract prose)

Model row `specification` MUST state distinct instance from bound operands; must not complete attempt operand solution/reasoning. Operand specifications MUST define distinct near-transfer instances. Encoded in §6 commissioning block.

---

## 7. §10 / output-surface wording

Added **MP-1 / S78-WS-2 closure** invariant and **checklist item 5** in `buildDlaSectionOutput()`.

---

## 8. Pre-output checklist change

Extended existing 4-item checklist:

```text
5. MP-1 closure: model→independent-attempt pairs have practice_independence binding
   to attempt operand row(s); model spec requires distinct unsolved operand.
```

---

## 9. Shape / closure validation

`lib/dla-practice-independence.js` + `appendActivityPracticeIndependenceGate` in `page-dla-enrich.js`.

---

## 10. Fail-closed diagnostics

| Code | Condition |
| ---- | --------- |
| `S78_WS2_MISSING_BINDING` | Triggering activity; model row lacks binding |
| `S78_WS2_INVALID_SHAPE` | Malformed object or empty `attempt_operand_material_ids` |
| `S78_WS2_OPERAND_CLOSURE` | Unknown id, self-bind, or operand is model row |
| `S78_WS2_FORBIDDEN_ON_ROW` | `practice_independence` on non-model row |

Diagnostics include activity id, model material id, and operand ids where available.

---

## 11. DLA→GAM projection

`app.js` — `copyOwnFieldIfPresent(rm, row, "practice_independence")` on T-023 commission path; authority prose mentions honouring binding on model rows. **No GAM authoring behaviour change.**

---

## 12. R1–R8 results

| Case | Status |
| ---- | ------ |
| R1 Near transfer | **PASS** |
| R2 Missing binding | **FAIL CLOSED** |
| R2b Examine-prefixed + bound workspace | **FAIL CLOSED** (operand via workspace fallback) |
| R3 Superficial restatement | **Deferred Stage 2** — no semantic validator |
| R4 Guided practice | **PASS** without binding |
| R5 Model only | **PASS** |
| R6 Independent without model | **PASS** |
| R7 One model + multi-problem task_card | **PASS** |
| R8 Lagrangian-shaped modelling_note + scenario | **PASS** |

Additional: empty ids, unknown id, self-bind, forbidden row — **FAIL CLOSED**.

---

## 13. Existing suites run

| Suite | Result |
| ----- | ------ |
| `tests/s78-dla-practice-independence.test.js` | **16/16 pass** |
| `tests/s78-dla-response-fulfilment.test.js` | **9/9 pass** |
| `tests/ld-dla-evidence-decision-consistency-prompt.test.js` | **pass** (P02 preserved) |
| `tests/ld-dla-canonical-assembler.test.js` | **pass** |
| `tests/ld-instructional-archetype-production-planning.test.js` | **pass** |
| `tests/s78-gam-workspace-blank-cell.test.js` | **pass** |

No fixture weakening required.

---

## 14. Prompt size

| Surface | Chars |
| ------- | ----- |
| Canonical assembler text (default ctx, post T-011) | **24,981** |
| Estimated net WS2 addition (§4+§6+§10) | **~1,280** |

Bounded increase; no §7/§8 duplication. S78-WS-1 and P02 language preserved.

---

## 15. Deviations from T-010

| Deviation | Rationale |
| --------- | --------- |
| Independent-attempt trigger includes bound `response_fulfilment` fallback | Fresh Lagrangian commissions often lead with “Examine…” (study-prefixed single step); workspace binding identifies independent attempt without brittle verb parsing |
| Guided-only exclusion uses non-study step text patterns | Production classifier may infer `table_complete` from `expected_output` while step text is guided-only |

Semantics preserved; structural binding obligation unchanged.

---

## 16. Remaining WS2 gap

T-011 does **not** prove generated model bodies use a distinct operand. Stage 2 semantic leak detection remains deferred. **T-012** must make GAM operand-aware authoring salient; **T-013** validates generation.

---

## 17. Files changed

**Production:** `lib/dla-practice-independence.js` (new), `lib/ld-dla-page-enrich-contract.js`, `lib/page-dla-enrich.js`, `app.js`, `lib/episode-plan-v1-archetype-grammar.js` (comment only)

**Tests:** `tests/s78-dla-practice-independence.test.js` (new), version bumps in assembler/fulfilment/evidence tests

**Documentation:** this record, `STATUS.md`, `PLAN.md`, `SPRINT-78-START-HERE.md`

**GAM authoring / assembly / renderer:** **NO**

---

## 18. Recommended next task

**S78-T-012 — GAM operand-aware model/practice independence authoring repair** (authorised separately).
