# Sprint 103 — Charter

**Sprint:** 103 — Learning Journey Runtime Continuity and Commissioning Fidelity  
**Status:** **OPEN**  
**Opened:** 2026-11-23  
**Type:** Focused, evidence-led verification and targeted correction  
**Opening:** [S103-D02](decisions.md#s103-d02--open-sprint-103--learning-journey-runtime-continuity-and-commissioning-fidelity)  
**Policy:** [S103-D01](../2026-11-20-sprint-102-learning-journey-owned-outcomes/decisions.md#s103-d01--learning-journey-first-architecture) — Learning Journey-first architecture (**Accepted**; implement commissioning alignment in this sprint)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Investigation plan:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)

---

## Problem statement

Sprint 102 delivered journey-owned outcomes, commission-native planning entry, shared-source handoff, and Interactive/Practice Learning Journal repairs. Live design validation (LJ Tests 1–2; Test 3 design-only) passed with qualifications.

Still unverified or unproven:

- Assessment Pack and Situated Task commission-native **runtime** and journal capture.  
- Whether later components can retrieve and use **actual** earlier learner responses (not only design-time journal opportunities).  
- That new Learning Journey commissioning consistently uses the four-product family under S103-D01 (Interactive for standalone/legacy only).

Without that evidence, Learning Journeys cannot be claimed as coherent, connected educational experiences across all four commissioned product types.

---

## Sprint objective

Establish that Learning Journeys function as coherent, connected educational experiences across:

1. Expository  
2. Practice  
3. Assessment Pack  
4. Situated Task  

Prioritise **verification**, **targeted corrections**, and **real learner-work continuity** over new features or architectural redesign. Keep the sprint relatively short and evidence-led.

---

## Workstreams (locked)

| ID | Workstream | Intent |
| -- | ---------- | ------ |
| **A** | Commissioning fidelity | Verify commissions exploit distinctive product capabilities; preserve outcomes, purpose, activity/interaction opportunities, shared sources, journal/evidence and continuity requirements. Confirm new journeys use the four-product family. |
| **B** | Journal and runtime round-tripping | Through actual running components, validate capture → association → persistence → restore → unified-shell visibility for learner work across all four types. Distinguish authoring, rendering, and runtime persistence. |
| **C** | Cross-component learner-work continuity | Validate whether a later component can retrieve/surface/use an earlier component’s **actual** learner response. Distinguish design continuity, journal visibility, runtime access, and response-aware behaviour. |
| **D** | Product-family alignment | Align LJ creation/commissioning with S103-D01 without disrupting standalone or legacy Interactive. No new product types. |

---

## Agreed decisions (locked at opening)

1. Learning Journey-first policy ([S103-D01](../2026-11-20-sprint-102-learning-journey-owned-outcomes/decisions.md#s103-d01--learning-journey-first-architecture)) is **accepted**; this sprint implements **commissioning alignment**, not a broader product rewrite.  
2. New Learning Journeys commission Expository, Practice, Assessment Pack, and/or Situated Task — **not** Interactive.  
3. Standalone Interactive and existing Interactive LJ commissions remain supported and must not be disturbed.  
4. Reuse Sprint 102 evidence and existing test journeys; do **not** regenerate all six LJ Test 3 children merely to repeat design validation.  
5. Do **not** treat untested Assessment Pack or Situated Task paths as validated.  
6. Distinguish already demonstrated (S102) / still requiring runtime verification / confirmed defects / proposed enhancements.  
7. Acceptance criteria must be observable learner behaviour and actual round-tripping.  
8. Prefer the smallest viable correction; if response-aware continuity is unsupported, document the boundary before proposing architecture.  
9. Avoid wholesale prompt rewrites.  
10. Sprint 102 remains closed; do not reopen it for polish.

---

## Explicit exclusions

Do **not** include in this sprint:

- Clear run data work or regression testing  
- Workspace folders ([PB-FA-031](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-031--workspace-folders))  
- New Practice interaction surfaces ([PB-FA-030](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-030--practice-interaction-surfaces))  
- Precision graphics ([PB-FA-020](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-020--precision-graphics-and-structured-visual-specifications))  
- Assisted brief development ([PB-FA-026](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-026--assisted-brief-development-from-teaching-intention-to-learning-experience))  
- Release / deployment packaging ([PB-S-005](../../../backlog/PRODUCT-BACKLOG.md#pb-s-005--release--deployment-packaging))  
- Adaptive branching or major architectural redesign  
- General prompt-contract migration ([PB-FA-010](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-010--prompt-contract-consistency))

---

## Guardrails

- Start with **bounded investigation / readiness**, not speculative coding.  
- No application implementation until investigation gates and separate authorisation.  
- No AI marking of shared artefacts; no implicit sharing of all learner responses beyond evidenced contracts.  
- Assessment Pack remains **NON-SUMMATIVE**.  
- Do not commit or push without explicit author request (opening commit authorised by this open instruction).

---

## Predecessor / successor

**Predecessor:** [Sprint 102 CLOSED](../2026-11-20-sprint-102-learning-journey-owned-outcomes/SPRINT-102-CLOSURE.md)  
**Backlog context:** [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) (inter-sprint reconciliation committed)
