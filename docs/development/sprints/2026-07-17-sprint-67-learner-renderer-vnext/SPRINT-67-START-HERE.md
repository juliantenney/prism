# Sprint 67 — START HERE

**Learner Renderer vNext**

**Document role:** Reading order for a fresh conversation. Authoritative scope: [SPRINT-67-CHARTER.md](SPRINT-67-CHARTER.md) · [canonical charter](../../../sprints/sprint-67-learner-renderer-vnext.md).

## Status

- **Sprint:** 67 — **Chartered / ready to start** (2026-07-17)
- **Predecessor:** Sprint 66 **Paused** — investigation + vNext model complete; HTML deferred
- **Nature:** Deterministic learner-page renderer rewrite
- **Do not:** extend legacy heuristic composer; mix legacy + vNext in one render; implement under Sprint 66 numbering

---

## Read in this order

1. [next-chat-briefing.md](next-chat-briefing.md) (paste into new chat)  
2. [HANDOVER.md](HANDOVER.md)  
3. [SPRINT-67-CHARTER.md](SPRINT-67-CHARTER.md)  
4. [context/README.md](context/README.md)  
5. [sprint-summary.md](sprint-summary.md) · [backlog.md](backlog.md)  
6. Model review (code): [`lib/learner-renderer-vnext/MODEL_REVIEW.md`](../../../../lib/learner-renderer-vnext/MODEL_REVIEW.md)  
7. Sprint 66 close (settled): [SPRINT-66-CLOSURE.md](../2026-07-16-sprint-66-grounded-renderer-learner-experience/SPRINT-66-CLOSURE.md)

---

## Architectural principles (non-negotiable)

1. Deterministic pipeline: PRISM JSON → validated learner-page view model → HTML.  
2. Single canonical page model; one rendering path.  
3. No heuristic beat scoring; no activity-ID-specific mappings.  
4. No post-render content insertion; no material-consumption flags.  
5. Render from the view model only (do not re-inspect source JSON in renderers).  
6. Empty beats omitted from renderable model.  
7. Explicit ownership of tasks, prompts, materials, and expected output.

---

## Immediate next task

**S67-BL-001** — Confirm model freeze, then implement `render-page` / `render-activity` / `render-beat` / `render-material` against the existing page model.
