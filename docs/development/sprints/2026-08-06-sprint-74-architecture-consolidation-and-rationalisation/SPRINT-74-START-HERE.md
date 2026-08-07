# Sprint 74 — START HERE

**Sprint:** 74 — Architecture Consolidation and Rationalisation  
**Status:** **OPEN** (programme wrapper)  
**Opened:** 2026-08-06  
**Predecessor:** [Sprint 73 — COMPLETE / Closed](../2026-08-06-sprint-73-workflow-resources/SPRINT-73-CLOSURE.md) — do not reopen  
**Theme:** Discovery-led wrapper — sequence evidence-based rationalisation toward **one definitive codebase**  
**Charter:** [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md)  
**Active sub-sprint:** [Sprint 74B START HERE](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/SPRINT-74B-START-HERE.md) — **OPEN**  
**Closed sub-sprint:** [Sprint 74A](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-START-HERE.md) — **COMPLETE / Closed**  
**Next sub-sprint:** 74C **Not opened**

---

## Purpose (summary)

Understand the current supported Prism architecture and establish a sequence of evidence-based rationalisation sprints (**74A / 74B / 74C …**) that converge established responsibilities onto **one definitive implementation** (`S74-D07`).

Discovery and domain refinement are **complete**. Sprint 74A is **closed**. **Sprint 74B is OPEN** — continue work in the **74B pack**. **No implementation has started** under 74B yet.

---

## Central question (answered for sequencing)

> What is the supported Prism architecture today, where do ownership and runtime paths diverge, and which coherent domains should become sequenced rationalisation sprints?

See [S74-T-001](S74-T-001-codebase-rationalisation-discovery.md) and [S74-T-010](S74-T-010-rationalisation-domain-refinement.md). Active domain: **74B** (generation-contract hygiene; ownership inventory first).

---

## Planning principle

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria.

| Sub-sprint | Status |
| ---------- | ------ |
| **74A** | **COMPLETE / Closed** — [pack](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-START-HERE.md) |
| **74B** | **OPEN** — [pack](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/SPRINT-74B-START-HERE.md) (`S74-D08` / `S74B-D01`) |
| **74C** | **Not opened** |

Architectural constraints define what Prism must remain; [Engineering Disciplines](../../ENGINEERING-DISCIPLINES.md) define how consolidation work is carried out safely.

---

## Reading order

1. [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) (`S74-D07` / Constraint 2)  
2. [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
3. Active work: [Sprint 74B START HERE](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/SPRINT-74B-START-HERE.md)  
4. Programme: [SPRINT-74-CHARTER.md](SPRINT-74-CHARTER.md) · [STATUS.md](STATUS.md)  

---

## Hard rules

- **Do not** reopen Sprint 73 implementation work  
- **Do not** implement Domain B under this wrapper — use the **74B pack**  
- **Do not** open 74C without readiness and operator approval  
- **Do not** introduce backend, runtime Node, or non-static deployment (`S74-D03`)  
- **Do not** plan a size-driven `app.js` split (`S74-D05`)  
- Obey [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) and inherit [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
- Evidence-led removal of obsolete/duplicate ownership — inventory before deletion  

## Next

When authorised: begin **S74B-T-010** in the 74B pack. Do **not** open 74C.
