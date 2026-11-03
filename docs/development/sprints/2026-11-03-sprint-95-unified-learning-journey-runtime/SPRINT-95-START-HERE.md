# Sprint 95 — START HERE

**Sprint:** 95 — Unified Learning Journey Runtime  
**Status:** **OPEN** — M1 ready; not started  
**Opened:** 2026-11-03  
**Type:** Architectural foundations → bounded implementation  
**Opening decision:** [S95-D01](decisions.md#s95-d01--open-sprint-95--unified-learning-journey-runtime)  
**Charter:** [SPRINT-95-CHARTER.md](SPRINT-95-CHARTER.md)  
**Map:** [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md)  
**Predecessor:** [Sprint 94 — CLOSED — ACCEPTED](../2026-11-02-sprint-94-learning-journey-continuity/SPRINT-94-CLOSURE.md) — **do not reopen**  
**Backlog:** [PB-FA-023](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-023--unified-learning-journey-runtime)

---

## If you are starting a new session

1. Read this file.  
2. Read [decisions.md](decisions.md) — S95-D01 (and later decisions as accepted).  
3. Read [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md) — milestones M1–M4.  
4. Implement **M1 only** unless this chat is explicitly authorised to continue.  
5. Do **not** reopen Sprint 94. Do **not** regenerate *Deciding Under Uncertainty*.

| Fact | State |
| ---- | ----- |
| Sprint 94 | **CLOSED — ACCEPTED** — continuity commissioning |
| Sprint 95 | **OPEN** |
| M1 Renderer Lifecycle Demonstrator | **READY — not started** |
| Multi-document LJ ZIP | Remains valid until explicitly superseded |
| Standalone publishing | Must remain fully supported |

---

## Hard constraints

- No iframes for resource delivery.  
- No server-side learner accounts / central learner DB in this sprint.  
- No AI marking of shared learner artefacts.  
- No new application framework; no wholesale visual redesign.  
- No user-controlled themes yet — architectural readiness only.  
- Do not change Learning Journey publishing during **M1**.  
- Prefer Assessment Pack for the M1 lifecycle demonstrator.

---

## Immediate next

Authorise and implement **M1 — Renderer Lifecycle Demonstrator** (Assessment Pack): container-scoped init/dispose, persist, unmount, remount restore, no duplicate handlers; standalone behaviour unchanged.
