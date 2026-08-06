# Sprint 74A — Handover

**From:** Sprint 74 programme wrapper (OPEN)  
**To:** Sprint 74A implementation (**OPEN**)  
**Decisions:** [S74A-D01](decisions.md) · [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) · parent [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)

---

## Current state

- T-001…T-040 / **T-042** **Done**  
- Interleaving repair: [S74A-T-042-activity-task-interleaving-definitive-path-repair.md](S74A-T-042-activity-task-interleaving-definitive-path-repair.md)  
- Removal inventory: [S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md](S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md) (§20 T-042 follow-up)  
- Baseline: [S74A-T-030-production-browser-baseline.md](S74A-T-030-production-browser-baseline.md) §8 + **§8a**  
- Current task: **S74A-T-045** (**Not started — next**)  
- 74B / 74C: **Not opened**

---

## Engineering disciplines (see CONTEXT)

Verification provenance, freshness gate, production browser path, Node ≠ deployment proof, baseline before removal, residue sweep.  
T-042: interleaving owned by vNext parse + compose — not structured HTML / Legacy.

---

## Preserve after removal

T-030 §8 export spine **and** corrected beat/task interleaving (T-042 / §8a). No silent Legacy fallback. slide_deck keeps `buildUtilityStructuredHtml` without retaining obsolete learner-page interleaving there.

---

## Task sequence

| Now | Later |
| --- | ----- |
| **T-045** remove obsolete implementation (slices S1–S8) | **T-050** sole-renderer verification + closure |

---

## What not to do

- Do not reintroduce aggregate terminal **Your task** for multi-clause study+write tasks  
- Do not delete `buildUtilityStructuredHtml` wholesale — slide_deck owner  
- Do not fix Sprint-70 E4 cache-bust drift under T-045  
- Do not open 74B/74C  

---

## Authoritative links

| Kind | Path |
| ---- | ---- |
| Start here | [SPRINT-74A-START-HERE.md](SPRINT-74A-START-HERE.md) |
| T-042 repair | [S74A-T-042-activity-task-interleaving-definitive-path-repair.md](S74A-T-042-activity-task-interleaving-definitive-path-repair.md) |
| T-040 inventory | [S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md](S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md) |
| T-030 baseline | [S74A-T-030-production-browser-baseline.md](S74A-T-030-production-browser-baseline.md) |
| Plan / Status | [PLAN.md](PLAN.md) · [STATUS.md](STATUS.md) |
