# Sprint 74 — START HERE

**Sprint:** 74 — Architecture Consolidation and Rationalisation  
**Status:** **OPEN** (discovery)  
**Opened:** 2026-08-06  
**Predecessor:** [Sprint 73 — COMPLETE / Closed](../2026-08-06-sprint-73-workflow-resources/SPRINT-73-CLOSURE.md) — do not reopen  
**Theme:** Discovery-led wrapper sprint — sequence evidence-based rationalisation domains  
**Charter:** [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md)

---

## Purpose (summary)

Understand the **current supported Prism architecture** and establish a sequence of evidence-based rationalisation sprints (**74A / 74B / 74C …**).

Sprint 74 is **not** indiscriminate cleanup. It is **discovery first**. Follow-on implementation sprints open only after coherent domains are identified with evidence.

---

## Central question

> What is the supported Prism architecture today, where do ownership and runtime paths diverge, and which coherent domains should become sequenced rationalisation sprints?

---

## Planning principle

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria. Ideas and possible future enhancements remain in the product backlog until they are ready for planning.

Sprint 74A / 74B / 74C are **not opened** by this pack. They are recommended domains only until **operator approval** opens a sub-sprint pack (`S74-D02` recommends 74A first).

---

## Reading order (open pack)

1. [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md)  
2. [next-chat-briefing.md](next-chat-briefing.md)  
3. [CONTEXT.md](CONTEXT.md) · [PLAN.md](PLAN.md) · [STATUS.md](STATUS.md) · [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)  
4. [S74-T-001-codebase-rationalisation-discovery.md](S74-T-001-codebase-rationalisation-discovery.md) · [S74-T-010-rationalisation-domain-refinement.md](S74-T-010-rationalisation-domain-refinement.md)  
5. Predecessor: [SPRINT-73-FINAL-REPORT.md](../2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md) (link only)

---

## What this sprint is / is not

| Is | Is not |
| -- | ------ |
| Discovery-led architectural mapping + domain refinement | Indiscriminate code cleanup |
| Evidence before conclusions | Immediate consolidation/refactor |
| Wrapper recommending 74A/74B/74C | Opening of 74A/74B/74C without operator approval |
| Classification of Supported / Compatibility / Duplicate / … | Claiming code is removable without evidence |

---

## Hard rules

- **Do not** reopen Sprint 73 implementation work  
- **Do not** delete, consolidate, rename, refactor, or modify runtime code in discovery/planning tasks  
- **Do not** open Sprint 74A / 74B / 74C until operator approval (`S74-D02` recommends 74A first)  
- **Do not** introduce backend, runtime Node, or non-static deployment (`S74-D03`)  
- **Do not** plan a size-driven `app.js` split (`S74-D05`)  
- Treat Sprint 73 as authoritative for Workflow Resources, Authoring UI, and related decisions  
- Obey [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)  

## Next

**Open Sprint 74A** after operator approval — see [S74-T-010](S74-T-010-rationalisation-domain-refinement.md).  
