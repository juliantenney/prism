# Sprint 76 — Next-chat briefing

**Audience:** Fresh session (coding agent or product conversation).  
**Sprint status:** **OPEN** (opened 2026-08-13)  
**Handover:** [HANDOVER.md](HANDOVER.md) · **Status:** [STATUS.md](STATUS.md) · **T-010:** [S76-T-010-dla-audit-report.md](S76-T-010-dla-audit-report.md)

---

## Immediate instruction

> **Sprint 76 is OPEN. T-035 P04 implementation plan is complete — no implementation authorised. Do not implement P04, P05, T-031, or T-033 from this briefing. Do not claim RECOVER. Settings follows later. Sprint 75 remains CLOSED.**

---

## Theme

DLA rationalisation · task–material sufficiency · content-quality **consistency** (toward mid-90s typical quality without score-gaming). **RECOVER** any Sprint 71 baseline regression remains a **hypothesis**. T-010 established current **ADVANCE**-class contract problems without proving score regression.

---

## Diagnostic SSOT

[S76-T-010-dla-audit-report.md](S76-T-010-dla-audit-report.md)  
P02 design: [S76-T-020-dla-p02-solution-design.md](S76-T-020-dla-p02-solution-design.md)  
P01 design: [S76-T-021-dla-p01-solution-design.md](S76-T-021-dla-p01-solution-design.md)  
P03 design: [S76-T-022-dla-p03-solution-design.md](S76-T-022-dla-p03-solution-design.md)  
Implementation plan: [S76-T-023-dla-p01-p02-p03-implementation-plan.md](S76-T-023-dla-p01-p02-p03-implementation-plan.md)  
Gate A/B record: [S76-T-024-dla-p01-p02-p03-gate-a-b.md](S76-T-024-dla-p01-p02-p03-gate-a-b.md)  
P01 residual diagnostic: [S76-T-026-dla-p01-residual-operand-closure-diagnostic.md](S76-T-026-dla-p01-residual-operand-closure-diagnostic.md)  
P01 residual solution design: [S76-T-027-dla-p01-residual-operand-closure-solution-design.md](S76-T-027-dla-p01-residual-operand-closure-solution-design.md)  
P01 residual implementation: [S76-T-028-dla-p01-residual-operand-closure-implementation.md](S76-T-028-dla-p01-residual-operand-closure-implementation.md)  
Graphics capture repair: [S76-T-029-design-page-graphics-capture-contract-repair.md](S76-T-029-design-page-graphics-capture-contract-repair.md)  
Generated-operand operational suitability diagnostic: [S76-T-030-generated-operand-operational-suitability-diagnostic.md](S76-T-030-generated-operand-operational-suitability-diagnostic.md)  
Operational suitability solution design: [S76-T-031-generated-operand-operational-suitability-solution-design.md](S76-T-031-generated-operand-operational-suitability-solution-design.md)  
A4 constructive alignment: [S76-T-032-dla-a4-constructive-alignment-diagnostic.md](S76-T-032-dla-a4-constructive-alignment-diagnostic.md)  
LO-operation coverage solution design: [S76-T-033-dla-lo-operation-coverage-solution-design.md](S76-T-033-dla-lo-operation-coverage-solution-design.md)
P04 evidence-guidance rationalisation: [S76-T-034-dla-p04-evidence-guidance-rationalisation-solution-design.md](S76-T-034-dla-p04-evidence-guidance-rationalisation-solution-design.md)
P04 implementation plan: [S76-T-035-dla-p04-evidence-guidance-rationalisation-implementation-plan.md](S76-T-035-dla-p04-evidence-guidance-rationalisation-implementation-plan.md)

Register:

| ID | Problem |
| -- | ------- |
| **DLA-P01** | Task→material closure — **structurally contracted**; **P01-R1 implemented**; post-T-028 Lagrangian re-benchmark **worked** (QA 84) — do not reopen |
| **DLA-P02** | Evidence dependence — **contracted at Gate B**; Gate C reported strong |
| **DLA-P03** | Ordinary commissioning — **contracted at Gate B**; Gate C reported strong |
| **DLA-P04** | DLA evidence guidance accumulated redundant self-audit — **design + implementation plan complete** (do **not** implement; do **not** absorb T-031 or T-033) |
| **DLA-P05** | Expanding DLA contract/shape is dual-injected on Copy — **open** |
| **T-030** | Generated-operand **operational suitability** — diagnostic complete |
| **T-031** | Operational suitability **solution design complete** — **implementation deferred until after P04**; do not absorb into P04 |
| **T-032** | A4 **constructive alignment** — diagnostic complete; supporting check ≠ LO judgement; not P01/P02/P03/T-031 |
| **T-033** | LO-operation coverage **solution design complete** — **implementation deferred until after P04**; do not absorb into P04 |
| **T-034** | P04 evidence-guidance rationalisation **solution design complete** |
| **T-035** | P04 **implementation plan complete** — **no implementation authorised** |

GAM is bounded fulfilment, not a Sprint 76 redesign target.

---

## Benchmark strategy

| Subject | Role |
| ------- | ---- |
| Roman Roads | Control — repeated runs after authorised rationalisation |
| Lagrangian Multipliers | Challenge — repeated runs; task–material completeness |

Latest scores (operator-reported, JSON not in git): pre-T-028 Roman Roads **87**, Lagrangian **88**; post-T-028 Lagrangian **84** (P01 residual worked; A3 T-030; A4 constructive alignment T-032). Do not claim RECOVER.

---

## Deferred

- Settings (**PB-FA-005**)  
- Evidence rollback execution  
- New workflow step (default no)  
- P04 implementation or P05 until authorised  
- T-031 / T-033 live-prompt implementation until after P04  
- Fresh generation unless the operator authorises re-benchmark  

## Closure (not optional)

Sprint 76 cannot close after a one-off DLA rationalisation alone. Before close: document durable prompt-engineering discipline preventing **APPEND NOW → RATIONALISE LATER** ([S76-D03](decisions.md#s76-d03--durable-prompt-engineering-discipline-as-sprint-76-exit-condition)). T-010 documented the accretion pattern; it did not specify the mechanism.

---

## Transition working-tree notes

Uncommitted fixes may exist for empty-capture false storage-full toast and DLA evidence false positives. Continue-to-Authoring async refresh defect remains open. Inspect git status before assuming committed.

---

## Do not

- Reopen Sprint 75 UX casually  
- Start P04 implementation or P05 without authorisation  
- Absorb T-032/T-033 into P04 or T-031  
- Absorb Settings into this lane prematurely  
- Claim DLA size or Copy×2 caused quality regression  
- Re-audit T-010 architecture from chat  
