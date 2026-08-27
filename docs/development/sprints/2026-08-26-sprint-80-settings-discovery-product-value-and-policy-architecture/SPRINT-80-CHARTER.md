# Sprint 80 — Charter

**Sprint:** 80 — Settings Discovery, Product Value and Policy Architecture  
**Status:** OPEN (2026-08-26)  
**Type:** Discovery / planning (product + architecture)  
**Predecessor:** Sprint 79 — CLOSED; DLA Phase D retirement COMPLETE  
**Start here:** [SPRINT-80-START-HERE.md](SPRINT-80-START-HERE.md)  
**Opening decision:** [S80-D01](decisions.md#s80-d01--open-sprint-80--settings-discovery-product-value-and-policy-architecture)

---

## Mission

Determine whether PRISM Settings should exist; which settings (if any) are genuinely useful; which existing settings have been superseded by later architecture; what authority retained settings should have; where they should live/persist; and what a future implementation architecture should look like.

```text
EXISTING SETTINGS CATALOGUE (hypotheses)
  → product-value & supersession review against CURRENT architecture
  → operator decision (A/B/C/D)
  → target policy architecture + implementation plan (if needed)
  → NO accidental runtime activation in this sprint
```

## Scope guard (binding)

This sprint must **not**:

- activate existing Settings merely because they are present;
- change learner-resource generation semantics;
- retune DLA, GAM, PEL, or Design Page;
- implement Workspace Surfaces;
- migrate persisted schema;
- alter validators;
- implement PB-FA-005 before the operator decision gate;
- make `PRISM_PARAMS` / `[PRISM_STEP_PARAMS]` authoritative without evidence;
- introduce generic prompt-modifier infrastructure;
- start an implementation sprint.

## Opening package

- [S80-T-001-sprint-opening-settings-history-and-current-state-diagnostic.md](S80-T-001-sprint-opening-settings-history-and-current-state-diagnostic.md)
