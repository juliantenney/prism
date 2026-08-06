# Sprint 74A — Handover

**From:** Sprint 74 programme wrapper (OPEN)  
**To:** Sprint 74A implementation (**OPEN**)  
**Decisions:** [S74A-D01](decisions.md) · [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) · parent [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)

---

## Current state

- T-001 / T-010 **Done**  
- `S74A-D02` **Accepted** — remove obsolete renderer after inventory; vNext sole implementation  
- Runtime changes from documentation reconciliation: **None**  
- Current task: **S74A-T-020** (**Not started — next**)  
- 74B / 74C: **Not opened**

---

## Mission

Establish vNext as the sole learner-renderer implementation, remove the obsolete renderer and redundant paths, verify existing learner-export functionality on the production browser path.

---

## Task sequence

| Now | Later |
| --- | ----- |
| **T-020** artefact integrity | **T-030** production-browser baseline |
| | **T-040** obsolete-renderer removal inventory |
| | **T-045** remove obsolete implementation |
| | **T-050** sole-renderer verification + closure |

---

## What not to do

- Do not begin T-045 before T-030 and T-040  
- Do not retain the obsolete renderer as Compatibility by default  
- Do not leave dead code behind flags / hidden selectors / unreachable branches  
- Do not create an in-tree archive of the obsolete renderer  
- Do not treat Node-based green as deployment proof  
- Do not open 74B/74C; no schema redesign; no size-driven `app.js` split  

---

## Authoritative links

| Kind | Path |
| ---- | ---- |
| Start here | [SPRINT-74A-START-HERE.md](SPRINT-74A-START-HERE.md) |
| Charter / Plan / Status | [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md) · [PLAN.md](PLAN.md) · [STATUS.md](STATUS.md) |
| Constraints | [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) |
