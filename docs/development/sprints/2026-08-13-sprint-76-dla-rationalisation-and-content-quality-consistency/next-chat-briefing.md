# Sprint 76 — Next-chat briefing

**Audience:** Fresh session (coding agent or product conversation).  
**Sprint status:** **OPEN** (opened 2026-08-13)  
**Handover:** [HANDOVER.md](HANDOVER.md) · **Status:** [STATUS.md](STATUS.md) · **T-010:** [S76-T-010-dla-audit-report.md](S76-T-010-dla-audit-report.md)

---

## Immediate instruction

> **Sprint 76 is OPEN. P04 Gate A/B is complete. P04 Gate C is PASS ([T-037](S76-T-037-dla-p04-gate-c-rebenchmark.md)). First review that verdict, then decide ordering among A–F. Do not implement P05, T-031, or T-033 from this briefing. Do not diagnose the new GAM findings from this briefing. Do not claim RECOVER. Settings follows later. Sprint 75 remains CLOSED.**

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
P04 Gate A+B: [S76-T-036-dla-p04-evidence-guidance-rationalisation-implementation.md](S76-T-036-dla-p04-evidence-guidance-rationalisation-implementation.md)  
P04 Gate C: [S76-T-037-dla-p04-gate-c-rebenchmark.md](S76-T-037-dla-p04-gate-c-rebenchmark.md)

Register:

| ID | Problem |
| -- | ------- |
| **DLA-P01** | Task→material closure — **structurally contracted**; **P01-R1 implemented**; post-P04 Lagrangian **A2 held**, **A3 residual recurred** (queue A) — do not reopen structural validators |
| **DLA-P02** | Evidence dependence — **contracted**; **P04 Gate C PASS** (RR P02 coherent; Lagrangian A2 false / A5 true) |
| **DLA-P03** | Ordinary commissioning — **contracted at Gate B** |
| **DLA-P04** | Evidence self-audit rationalisation — **Gate A/B complete; Gate C PASS** (`76-DLA-PARTIAL-6`) |
| **DLA-P05** | Expanding DLA contract/shape is dual-injected on Copy — **open** (queue F) |
| **T-030 / T-031** | Generated-operand operational suitability — design complete; **not implemented** (queue B) |
| **T-032 / T-033** | A4 constructive alignment / LO-operation coverage — design complete; **not implemented** (queue C) |
| **NEW D** | GAM pedagogical-function fulfilment — A4 worked_example structurally present, not actually worked — **not investigated** |
| **NEW E** | GAM learner-facing corruption — A3 derivation mangling — **not investigated**; do not assume same cause as D |

GAM is bounded fulfilment, not a Sprint 76 redesign target. Queue D/E are recorded exhibits only.

---

## Benchmark strategy

| Subject | Role |
| ------- | ---- |
| Roman Roads | Control — post-P04 Gate C **86 Strong** |
| Lagrangian Multipliers | Challenge — post-P04 Gate C **76 / 69** |

Latest scores (operator-reported, JSON not in git): pre-T-028 RR **87**, Lagrangian **88**; post-T-028 Lagrangian **84**; post-P04 RR **86**, Lagrangian **76** uncapped / **69** release. Do not claim RECOVER. Do not treat Lagrangian drop as a P04 evidence-role failure.

---

## Deferred

- Settings (**PB-FA-005**)  
- Evidence rollback execution  
- New workflow step (default no)  
- P05 / T-031 / T-033 until ordered after T-037 review  
- Queue D/E GAM diagnostics until ordered  
- Fresh generation unless the operator authorises another run  

## Closure (not optional)

Sprint 76 cannot close after a one-off DLA rationalisation alone. Before close: document durable prompt-engineering discipline preventing **APPEND NOW → RATIONALISE LATER** ([S76-D03](decisions.md#s76-d03--durable-prompt-engineering-discipline-as-sprint-76-exit-condition)). T-010 documented the accretion pattern; it did not specify the mechanism.

---

## Transition working-tree notes

Uncommitted fixes may exist for empty-capture false storage-full toast and DLA evidence false positives. Continue-to-Authoring async refresh defect remains open. Inspect git status before assuming committed.

---

## Do not

- Reopen Sprint 75 UX casually  
- Implement P05, T-031, or T-033 without a decided order  
- Diagnose A3/A4 GAM from this briefing  
- Absorb T-032/T-033 into P04 or T-031  
- Absorb Settings into this lane prematurely  
- Claim DLA size or Copy×2 caused quality regression  
- Re-audit T-010 architecture from chat  
