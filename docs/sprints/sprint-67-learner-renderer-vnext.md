# Sprint 67 — Learner Renderer vNext

**Status:** Chartered (2026-07-17)  
**Opened:** 2026-07-17  
**Type:** Isolated learner-page renderer rewrite (model → HTML)  
**Portable pack:** [docs/development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/](../development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/)  
**START HERE:** [SPRINT-67-START-HERE.md](../development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/SPRINT-67-START-HERE.md)  
**HANDOVER:** [HANDOVER.md](../development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/HANDOVER.md)  
**Charter:** [SPRINT-67-CHARTER.md](../development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/SPRINT-67-CHARTER.md)  
**Predecessor close:** [Sprint 66 closure](../development/sprints/2026-07-16-sprint-66-grounded-renderer-learner-experience/SPRINT-66-CLOSURE.md)

---

## Purpose

Complete deterministic learner-page rendering:

```text
PRISM JSON → validated learner-page view model → HTML
```

Model layer inherited from Sprint 66. This sprint owns HTML, feature flag, tests, and rollout readiness.
