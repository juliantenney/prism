# Sprint 74 — START HERE

**Sprint:** 74 — Architecture Consolidation and Rationalisation  
**Status:** **OPEN** (programme wrapper; Sprint 74A implementation active)  
**Opened:** 2026-08-06  
**Predecessor:** [Sprint 73 — COMPLETE / Closed](../2026-08-06-sprint-73-workflow-resources/SPRINT-73-CLOSURE.md) — do not reopen  
**Theme:** Discovery-led wrapper — sequence evidence-based rationalisation toward **one definitive codebase**  
**Charter:** [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md)  
**Active sub-sprint:** [Sprint 74A START HERE](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-START-HERE.md)

---

## Purpose (summary)

Understand the current supported Prism architecture and establish a sequence of evidence-based rationalisation sprints (**74A / 74B / 74C …**) that converge established responsibilities onto **one definitive implementation** (`S74-D07`).

Discovery and domain refinement are **complete**. **Sprint 74A is OPEN**. Continue work in the **74A pack**.

---

## Central question (answered for sequencing)

> What is the supported Prism architecture today, where do ownership and runtime paths diverge, and which coherent domains should become sequenced rationalisation sprints?

See [S74-T-001](S74-T-001-codebase-rationalisation-discovery.md) and [S74-T-010](S74-T-010-rationalisation-domain-refinement.md). First implementation domain: **74A** (sole vNext learner renderer; remove obsolete renderer).

---

## Planning principle

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria.

| Sub-sprint | Status |
| ---------- | ------ |
| **74A** | **OPEN** — [pack](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-START-HERE.md) (`S74-D06`; `S74A-D02` under `S74-D07`) |
| **74B** | Not opened |
| **74C** | Not opened |

---

## Reading order

1. [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) (`S74-D07` / Constraint 2)  
2. Active work: [Sprint 74A START HERE](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-START-HERE.md)  
3. Programme: [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md) · [STATUS.md](STATUS.md)  

---

## Hard rules

- **Do not** reopen Sprint 73 implementation work  
- **Do not** implement Domain A under this wrapper — use the 74A pack  
- **Do not** open 74B / 74C without readiness  
- **Do not** introduce backend, runtime Node, or non-static deployment (`S74-D03`)  
- **Do not** plan a size-driven `app.js` split (`S74-D05`)  
- Obey [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) — definitive codebase; Compatibility only for current product requirements  
- Evidence-led removal of obsolete alternatives is the intended outcome when covered (`S74-D07`)  

## Next

Sprint 74A is **COMPLETE / Closed**. Do **not** open 74B/74C automatically.  
