# Sprint 73 — Handover

**From:** Sprint 72 (COMPLETE / Closed 2026-08-05) · Sprint 71 disposition audit complete  
**To:** Sprint 73 — Workflow Resources (OPEN 2026-08-06)  
**Backlog anchor:** [PB-FA-001 — Workflow Resources](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources)

---

## Current state

- **Sprint 72** is closed. Instructional-architecture productisation objective is **met**.  
- **Sprint 71** findings are **fully dispositioned** — see [SPRINT-71-DISPOSITION-AUDIT.md](../2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-71-DISPOSITION-AUDIT.md).  
- Prism is approaching **v1.0 feature completeness**; emphasis shifts to **durability**, **workflow continuity**, **content quality**, **author experience**, and **polish**.  
- **Sprint 73** is open as a **discovery-led** sprint on **PB-FA-001 — Workflow Resources** (workflow asset persistence is the initial mechanism, beginning with generated images).

**S73-T-011 implementation is complete.** **S73-T-012** verification is next.

---

## Planning principle

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria. Ideas and possible future enhancements remain in the product backlog until they are ready for planning.

---

## What Sprint 73 inherits

| From | Carry-forward |
| ---- | ------------- |
| `S72-D09` | One **shared** workflow asset-persistence model (images + author-evidence associations) |
| `S72-D10` | Conversation-bound source use works; **byte persistence** still deferred |
| `S72-D14` | Continuous verification — stop, fix owning layer, add focused regression on observation |
| Sprint 72 closure | Public-export / browser-bundle parity lesson — evaluate export implications in Phase 1 |
| PB-FA-001 | Workflow Resources; former S72 tasks T-042, T-051, B-002, etc. |

---

## Immediate sequence (Phase 2 implementation)

1. Read [S73-T-010-phase-2-acceptance-criteria.md](S73-T-010-phase-2-acceptance-criteria.md), [PLAN.md](PLAN.md), and [decisions.md](decisions.md) (`S73-D02`).  
2. Execute `S73-T-011` — implement the minimal generated-image persistence vertical slice.  
3. Execute `S73-T-012` focused regression coverage alongside T-011.  
4. Do not widen into Phase 3 or out-of-scope resource types.

---

## Binding predecessor evidence (link only)

| Kind | Authority |
| ---- | --------- |
| Sprint 72 Final Report | [SPRINT-72-FINAL-REPORT.md](../2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-FINAL-REPORT.md) |
| Sprint 72 Closure | [SPRINT-72-CLOSURE.md](../2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-CLOSURE.md) |
| Sprint 72 Decisions | [decisions.md](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md) |
| Product Backlog | [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) |

Do **not** reopen or edit Sprint 71 evidence files.

---

## What not to do

- Do not assume persistence is already solved — **investigate first**  
- Do not expand into PB-FA-002 (programming), PB-FA-003 (pipeline integrity), or unrelated backlog items  
- Do not change evidence architecture unless discovery proves a narrow necessary coupling  
- Do not schedule PDF / video / Word implementation in this sprint  
- Do not claim the broader Sprint 72 evidence-centred suite is green (28 known pre-existing failures)
