# Sprint 83 — START HERE

**Sprint:** 83 — Expository Resource Investigation  
**Status:** **OPEN** (opened 2026-09-21)  
**Type:** Investigation — **not** implementation  
**Backlog:** [PB-FA-011 — Expository Resource](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource)  
**Predecessor:** [Sprint 82 — CLOSED](../2026-09-01-sprint-82-maths-entry-and-alpha-completion/SPRINT-82-START-HERE.md) (Alpha development complete)  
**Opening decision:** [S83-D01](decisions.md#s83-d01--open-sprint-83--expository-resource-investigation)  
**Dashboard:** [STATUS.md](STATUS.md) · **Charter:** [SPRINT-83-CHARTER.md](SPRINT-83-CHARTER.md) · **Handover:** [HANDOVER.md](HANDOVER.md) · **Briefing:** [next-chat-briefing.md](next-chat-briefing.md)

---

## If you are starting a new session

> **Read this block first.** Sprint 83 is an **investigation sprint**. Do not implement Expository Resource, change production prompts/schemas/UI/renderer, or begin the detailed investigation until the separate investigation brief is supplied and accepted.

| Fact | State |
| ---- | ----- |
| Alpha | **Development complete** ([S82-D04](../2026-09-01-sprint-82-maths-entry-and-alpha-completion/decisions.md#s82-d04--alpha-development-complete)) |
| First-class gate at alpha close | `npm run test:first-class` → **339/339** |
| Sprint 82 | **CLOSED** — historical record |
| Sprint 83 | **OPEN** — pack established; detailed investigation brief **pending** |
| Canonical backlog | [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) (pruned post-alpha) |

---

## Broad objective

> Investigate whether PRISM's existing subsystem architecture can support a high-quality first-class Expository Resource, what product-specific prompt behaviour would be required, and whether any subsystem contracts need adaptation.

Working hypothesis (not a decision): the established subsystem progression remains broadly sound; Expository Resource likely warrants its own tailored prompt family rather than reusing Interactive Learning Resource prompts.

---

## Immediate next step

1. Review this pack (START HERE → Charter → Handover → Status).  
2. Await / accept the **separate Expository Resource investigation brief**.  
3. Only then begin investigation work under that brief.

Do **not** populate speculative investigation tasks ahead of the brief.

---

## Pack contents

- [SPRINT-83-CHARTER.md](SPRINT-83-CHARTER.md) — mission, boundaries, sequence intent  
- [STATUS.md](STATUS.md) — dashboard  
- [PLAN.md](PLAN.md) — programme posture (brief pending)  
- [decisions.md](decisions.md) — opening decision  
- [HANDOVER.md](HANDOVER.md) — continuity context for this sprint  
- [next-chat-briefing.md](next-chat-briefing.md) — compact load  
- [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md) — sprint-local ledger (empty at open)  
- [README.md](README.md) — index  

Programme pointer: [NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md)
