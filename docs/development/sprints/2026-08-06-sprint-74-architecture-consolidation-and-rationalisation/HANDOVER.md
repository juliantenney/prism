# Sprint 74 — Handover

**From:** Sprint 73 (COMPLETE / Closed 2026-08-06)  
**To:** Sprint 74 — Architecture Consolidation and Rationalisation (**OPEN** 2026-08-06)  
**Decision:** [S74-D01](decisions.md#s74-d01-sprint-74-scope--architecture-consolidation-and-rationalisation-discovery-led-wrapper)

---

## Current state

- **Sprint 73** is closed. Workflow Resources objective **met**. Do **not** reopen Sprint 73 implementation.  
- **Sprint 74** is open as a **discovery-led wrapper** — map supported architecture; recommend sequenced rationalisation domains.  
- **S74-T-001** discovery report is **complete**.  
- **S74-T-010** domain refinement is **complete** (`S74-D02` recommends 74A).  
- **Sprint 74A / 74B / 74C** are **not opened** — 74A awaits operator approval.

---

## Planning principle

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria.

---

## What Sprint 74 inherits

| From | Carry-forward |
| ---- | ------------- |
| Sprint 73 | Workflow Resources owner; image/resource/video persistence; Authoring UI; learner presentation; `S73-D01`…`S73-D03` |
| Sprint 72 | Continuous verification (`S72-D14`); production browser-path / generated-artefact consistency lesson; maturation backlog model |
| Sprint 67 / architecture docs | Learner-renderer-vNext as supported production browser path |
| Sprint 56 / 56F | Progressive page enrichment / vNext page schema direction |
| Sprint 38 series | Why LD visual/pedagogical architecture exists |

---

## Binding constraints (carry into 74A–C)

See [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) and `S74-D03`…`S74-D05`:

- Browser-only runtime; Node = development/test tooling only  
- One supported path per major responsibility  
- `app.js` by ownership, not size  
- Static deployment preserved  
- Repository comprehension (reduce ambiguity; not line-count chasing) — see constraints doc  

---

## Immediate sequence

1. Read [S74-T-010-rationalisation-domain-refinement.md](S74-T-010-rationalisation-domain-refinement.md).  
2. Operator approval to **open Sprint 74A** (Authoring → learner export path integrity).  
3. Optional: **S74-T-011** only if a thinner AC seed is required before pack open.  
4. Do **not** open 74B/74C yet; do **not** implement under this wrapper.

---

## Binding predecessor evidence (link only)

| Kind | Authority |
| ---- | --------- |
| Sprint 73 Final Report | [SPRINT-73-FINAL-REPORT.md](../2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md) |
| Sprint 73 Closure | [SPRINT-73-CLOSURE.md](../2026-08-06-sprint-73-workflow-resources/SPRINT-73-CLOSURE.md) |
| Product Backlog | [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) |
| Learner renderer architecture | [learner-renderer-vnext.md](../../../architecture/learner-renderer-vnext.md) |

---

## What not to do

- Do not delete, consolidate, rename, or refactor runtime code under discovery/planning tasks  
- Do not reopen Sprint 73 feature work  
- Do not open Sprint 74A / 74B / 74C from this handover alone  
- Do not classify code as removable without evidence  
- Do not treat historical sprint experiments as supported product surface without verification  
- Do not invent a backend or treat Node tests as production proof (`S74-D03`)  
- Do not open a size-driven `app.js` split sprint (`S74-D05`)  
