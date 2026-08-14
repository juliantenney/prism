# Sprint 77 — Charter

**Sprint:** 77 — DLA Prompt Contract Architecture Pilot  
**Status:** **COMPLETE / CLOSED** (opened 2026-08-14; closed 2026-08-14)  
**Opened:** 2026-08-14  
**Predecessor:** Sprint 76 — COMPLETE / Closed (2026-08-14) — DLA semantic repair chain closed; do not reopen  
**Type:** DLA-only instruction-architecture pilot (inventory-first)  
**Start here:** [SPRINT-77-START-HERE.md](SPRINT-77-START-HERE.md)  
**Closing decision:** [S77-D04](decisions.md#s77-d04--close-sprint-77--dla-prompt-contract-architecture-pilot-complete)  
**Predecessor close-out:** [S76-T-049](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/S76-T-049-sprint-76-closeout-and-prompt-architecture-handover.md)

---

## Mission

Make **DLA’s** model-visible instruction architecture **comprehensible, traceable, and maintainable** while **preserving** the behavioural contracts established and closed in Sprint 76.

This is **not** initially a “make prompts shorter” sprint.

The intended end state is a coherent **model-visible DLA instruction contract** with explicit conceptual structure and clear canonical homes for behavioural invariants; **source-code modularity may remain where useful**. Prompt architecture must not be interpreted as splitting one large prompt into many arbitrary fragments.

This is **not** a universal prompt-architecture template for every PRISM stage.

DLA is a **controlled reference implementation / pilot**. Lessons may later inform other stages; Sprint 77 does **not** restructure them.

---

## Why this sprint exists

Sprint 76 completed a coherent DLA **semantic repair chain** (P04, P01-R1, T-033, T-031) with Gate C evidence. Remaining prompt work changed class: from local semantic defects to **instruction-architecture / maintainability**.

Known observations at Sprint 76 close (unsolved): unique DLA contract+shape **18,872**; Copy dual-injects that pair (**P05**); assembled ×2 **37,744** before other DLA material; overall DLA prompt substantially larger once pack/context/other instructions are included. Concern is **comprehensibility, traceability, ownership, assembly structure, and redundancy** — not character count alone.

[S76-D03](../2026-08-13-sprint-76-dla-rationalisation-and-content-quality-consistency/decisions.md#s76-d03--durable-prompt-engineering-discipline-as-sprint-76-exit-condition) transferred here as architecture work, beginning with inventory.

---

## DLA-only pilot boundary

**In scope (eventually, after inventory + design + authorisation):** DLA model-visible prompt construction, assembly, ownership, duplication, unique vs assembled cost, and a later architecture for DLA only.

**Out of this sprint’s architecture pilot (do not restructure):** EP, GAM, Design Page, Graphics, QA, or other non-DLA prompts.

**Do not start in T-001 / T-010:** P05 implementation; GAM D; GAM E; Graphics/image lifecycle; prompt redesign; production edits.

---

## Protected Sprint 76 DLA baseline (do not reopen)

| Contract | Meaning |
| -------- | ------- |
| **P01 / P01-R1** | Task→material closure; object/state acted on includes intermediate supplied operands, not confused with workspace |
| **P02** | Evidence-dependence semantics |
| **P03** | Ordinary commissioning (purpose + specification) |
| **P04** | Evidence-guidance rationalisation; evidence semantics preserved |
| **T-033** | Learner production requires every load-bearing operation of the actual mapped LO |
| **T-031** | DLA pedagogical method/scope/boundary; GAM inherent executability. No generic DLA “must be solvable” |
| **Sprint 72** | Provider-authoring / source behaviour |

Live contract version at Sprint 76 close: **`76-DLA-PARTIAL-9`**.

---

## Sequence (mandatory)

1. **Inventory** before design.  
2. **Design** before restructuring.  
3. **Structure** before deletion.  
4. **Behaviour preservation** before prompt reduction.  
5. Measure **UNIQUE** and **ASSEMBLED** prompt cost separately.  
6. Do **not** implement **P05** during initial inventory/design.

---

## Success direction

| Concept | Meaning |
| ------- | ------- |
| **COMPREHENSIBILITY** | A reader can find where an invariant lives |
| **TRACEABILITY** | A behavioural defect can be traced to a canonical instruction |
| **OWNERSHIP** | Stage/layer ownership (including T-031 DLA vs GAM) remains explicit |
| **ASSEMBLY** | Injection order and multiplicity are inspectable |
| **PRESERVATION** | Closed Sprint 76 behaviours are not traded for tidier prose |

Do **not** treat length reduction as success by itself.

---

## First substantive task

**S77-T-013** — Phase A assembler — **COMPLETE** (production still LEGACY).

---

## Inherited constraints

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) · [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)
