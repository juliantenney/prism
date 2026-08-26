# Sprint 79 — Charter

**Sprint:** 79 — GAM Architecture and Maintainability  
**Status:** OPEN (2026-08-26)  
**Type:** Structural/maintainability reorganisation with behavior preservation  
**Predecessor:** Sprint 78 — CLOSED  
**Start here:** [SPRINT-79-START-HERE.md](SPRINT-79-START-HERE.md)  
**Opening decision:** [S79-D01](decisions.md#s79-d01-open-sprint-79--gam-architecture-and-maintainability)

---

## Mission

Make GAM easier and safer to change without changing what GAM currently does.

```text
CURRENT GAM BEHAVIOUR
  -> clearer canonical ownership
  -> explicit sections/responsibilities
  -> less duplication
  -> predictable live prompt assembly
  -> stronger maintainability
  -> same valid generated artefact behaviour
```

## Scope guard (binding)

This sprint must not change production behavior as part of architectural reorganisation unless explicitly required for behavior preservation.

Out of scope:
- learner-quality redesign work;
- settings implementation;
- schema migration;
- validator weakening/expansion;
- DLA redesign;
- Design Page ownership changes;
- workspace-surface feature expansion;
- OPS verifier removal;
- reopening Sprint 78.

## Opening package

Opening task deliverable is recorded in:

- [S79-T-001-sprint-open-architecture-diagnostic-target-design-and-implementation-plan.md](S79-T-001-sprint-open-architecture-diagnostic-target-design-and-implementation-plan.md)

Opening decision: **A — READY TO REFACTOR**.
