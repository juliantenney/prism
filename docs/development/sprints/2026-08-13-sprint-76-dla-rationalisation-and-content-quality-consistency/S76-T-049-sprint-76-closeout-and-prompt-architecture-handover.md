# S76-T-049 — Sprint 76 close-out and prompt-architecture handover

**Task:** S76-T-049  
**Status:** **COMPLETE** (2026-08-14) — Sprint 76 **CLOSED**  
**Mode:** DOCUMENTATION / CLOSE-OUT ONLY — no production, prompt, test, validator, schema, generation, P05, GAM D/E, or Graphics changes  
**Depends on:** [T-037](S76-T-037-dla-p04-gate-c-rebenchmark.md) · [T-042](S76-T-042-dla-p01-r1-intermediate-operand-gate-c-closure.md) · [T-045](S76-T-045-dla-lo-operation-coverage-gate-c-diagnostic.md) · [T-047](S76-T-047-generated-operand-operational-suitability-implementation.md) · [T-048](S76-T-048-t031-dla-operational-bound-gate-c-diagnostic.md)

Top-level closeout: [sprint-76-closeout.md](../../../sprints/sprint-76-closeout.md).  
Next programme pointer: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md).

---

## 1. Closure rationale

Sprint 76 reached its **intended stopping point**. The coherent DLA **semantic repair chain** is complete and has Gate C behavioural evidence. Remaining items (P05, GAM D/E, Graphics) are a **different class of work**: instruction-architecture / maintainability, pedagogical-function fulfilment, generation corruption, and image lifecycle — not unfinished local DLA semantics.

The operator decided **not** to continue P05, GAM D/E, or Graphics **inside** Sprint 76. Closing now is deliberate, not abandonment.

[S76-D03](decisions.md#s76-d03--durable-prompt-engineering-discipline-as-sprint-76-exit-condition) required a durable discipline against **APPEND NOW → RATIONALISE LATER**. That programme output is **handed to the next sprint** as **Prompt Contract Architecture** (inventory first). Sprint 76 does not claim that discipline is implemented.

**RECOVER** (Sprint 71 score regression) remains a **hypothesis**. Do not claim it.

---

## 2. Completed behavioural chain

| Link | What was established | Gate C |
| ---- | -------------------- | ------ |
| **P04** | Reduced evidence/self-audit duplication; evidence semantics preserved | **PASS** ([T-037](S76-T-037-dla-p04-gate-c-rebenchmark.md)) |
| **P01-R1** | DLA must identify the object/state acted on, including intermediate supplied operands; not confuse it with a workspace | **PASS** ([T-042](S76-T-042-dla-p01-r1-intermediate-operand-gate-c-closure.md)) |
| **T-033** | Learner production must require every load-bearing operation of the **actual mapped LO** | **PASS** ([T-045](S76-T-045-dla-lo-operation-coverage-gate-c-diagnostic.md)) |
| **T-031** | Commission → fulfilment: DLA pedagogical bounds; GAM inherent executability | **PASS** ([T-048](S76-T-048-t031-dla-operational-bound-gate-c-diagnostic.md); impl. [T-047](S76-T-047-generated-operand-operational-suitability-implementation.md)) |

P01 / P02 / P03 structural contracts **preserved**. Schemas **unchanged**. Deterministic validators **unchanged** for these semantic repairs. Live DLA contract version at close: **`76-DLA-PARTIAL-9`**.

---

## 3. T-048 ownership correction (do not reopen)

Preliminary T-031 Gate C was **too strict on DLA**.

A structural specification such as objective / equality constraint / numerical values / derive / solve / verify does **not** fail T-031 merely because it omits “must be solvable.”

If no additional pedagogical method/scope choice is required, **inherent executability belongs to GAM**.

Do **not** add a generic DLA “must be solvable” requirement. Historical unusable Problem B is primarily a **GAM Case-1** breach under the clarified contract.

**T-048 CORRECTION RECORDED: YES**

---

## 4. Prompt size / architecture observation (unsolved)

Not a character-count sprint. Concern: **comprehensibility, traceability, ownership, assembly structure, redundancy**.

| Measure | At close |
| ------- | -------- |
| Unique DLA contract+shape | **18,872** |
| Copy dual-injects that pair | **yes** (P05 still open) |
| Assembled ×2 from that pair | **37,744** before other DLA prompt material |
| Overall DLA prompt | substantially larger once pack/context/other instructions are included |

Diagnostics repeatedly had to establish: where an invariant lives; whether it is model-visible; whether another instruction competes; whether examples/audits restate it; whether a downstream layer owns the behaviour.

Do **not** treat length alone as the cause of behavioural failure.

---

## 5. Carry-forward (explicitly preserved)

| Item | Status | Note |
| ---- | ------ | ---- |
| **P05** duplicate DLA contract/shape injection | **OPEN / DEFERRED** | Mechanical de-duplication is still desirable. Operator chose to understand desired prompt **architecture** first rather than optimise the accidental structure. |
| **GAM D** pedagogical-function fulfilment | **OPEN** | Worked example can be structurally present without functioning as a worked example. Not diagnosed here. |
| **GAM E** learner-facing corruption/mangling | **OPEN** | Separate from GAM D and T-031. T-031 may overlap at consequence if corruption makes an operand unusable; it does not explain the mechanism. |
| **Graphics / image lifecycle** | **OPEN / SEPARATE** | Stale images after Clear Run Data (queue G). Do not absorb into prompt architecture automatically. |
| **T-032** A4 constructive alignment | **OPEN (diagnostic only)** | EP evaluate-vs-solve tension vs this session’s LO4; T-033 closed against quoted LOs. Do not reopen T-033. Do not absorb into P05. |
| **S76-D03** durable prompt-engineering discipline | **TRANSFERRED** | Next sprint’s architecture work, not an unimplemented 76 defect of the DLA semantic chain. |
| **Settings (PB-FA-005)** | **DEFERRED** | After this quality / architecture lane unless re-prioritised. |
| **Evidence-injection rollback** | **Option only** | Not executed. |
| **Continue-to-Authoring async UI refresh** | **OPEN defect** | Transition item; not Sprint 76 DLA semantics. |
| **RECOVER hypothesis** | **Open as hypothesis** | Not established. |

---

## 6. Why P05 / GAM D/E were not started

**P05:** removing a duplicate injection without an assembly model risks another APPEND NOW repair. Architecture diagnostic first.

**GAM D/E:** different mechanisms from T-031; operator deferred investigation. Not Sprint 76 incompleteness of the DLA chain.

---

## 7. Next sprint — intent only

**Working title:** Prompt Contract Architecture

**Intent:** Make model-visible instruction architecture comprehensible, traceable, and maintainable **while preserving established behavioural contracts**.

This is **not** initially a “make prompts shorter” sprint.

Carry-forward principles (not a designed hierarchy):

- behaviour preservation first;  
- inventory before restructuring;  
- structure before deletion;  
- one canonical home for each semantic invariant where possible;  
- examples illustrate contracts rather than silently introduce new ones;  
- distinguish semantic authoring guidance from deterministic validators;  
- make prompt assembly/order inspectable;  
- preserve stage/layer ownership (including T-031 DLA/GAM);  
- measure UNIQUE and ASSEMBLED cost separately;  
- do not change behaviour merely to tidy prose.

**Do not** design the canonical section hierarchy in this close-out. **Do not** refactor prompts. **Do not** implement P05.

---

## 8. First recommended next-sprint task

**DIAGNOSTIC / INVENTORY** of model-visible prompt construction across relevant workflow stages:

What blocks exist; where authored; where injected; how many times; assembled order; which invariant each block owns; duplication/overlap; examples that introduce semantics; validator-structure vs authoring guidance; stage-specific vs shared; unique vs assembled cost; dead/non-live surfaces; hardest traces from behavioural defect to canonical instruction.

Do not perform that inventory in Sprint 76.

---

## 9. Repository / commit state (2026-08-14)

**HEAD:** `62f562c` — `Sprint 76: rationalise DLA evidence guidance and complete P04 Gate C`

**Uncommitted at close-out writing (do not commit from this task):**

- Production: `lib/ld-dla-page-enrich-contract.js` (`76-DLA-PARTIAL-9`), `app.js` (GAM binding sentence), `index.html` pins  
- Tests: `tests/ld-dla-evidence-decision-consistency-prompt.test.js`, `tests/ld-instructional-archetype-production-planning.test.js`, `tests/page-gam-enrich.test.js`  
- Docs: T-038–T-049 pack artefacts and Sprint 76 pointer updates (this close-out included)

**Recommended commit boundary (operator):** one commit capturing remaining Sprint 76 **semantic implementation** (T-031) **plus** documentation through T-049 / closeout, **before** any Sprint 77 inventory. Do not mix P05 or GAM D/E. Do not force-push.

This close-out does **not** create that commit.

---

## 10. Production boundary of this task

Production / prompts / tests / validators / schemas: **not changed by T-049**. No generation. No benchmark.

---

**SPRINT 76 CLOSED — PROMPT CONTRACT ARCHITECTURE NEXT**
