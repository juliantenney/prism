# Sprint 74A — Handover

**From:** Sprint 74 programme wrapper (OPEN)  
**To:** Sprint 74A implementation (**OPEN**)  
**Decisions:** [S74A-D01](decisions.md) · [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) · parent [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)

---

## Current state

- T-001…T-045 **Done** (obsolete learner renderer removed)  
- Removal evidence: [S74A-T-045-obsolete-learner-renderer-removal.md](S74A-T-045-obsolete-learner-renderer-removal.md)  
- Pre-removal rollback: `065b3acab820f9f45a0079f7c266e57e86cf3225`  
- Interleaving repair: [S74A-T-042-activity-task-interleaving-definitive-path-repair.md](S74A-T-042-activity-task-interleaving-definitive-path-repair.md)  
- Baseline: [S74A-T-030-production-browser-baseline.md](S74A-T-030-production-browser-baseline.md) §8 + **§8a**  
- Current task: **S74A-T-050** (**Not started — next**)  
- 74B / 74C: **Not opened**

---

## Engineering disciplines (see CONTEXT)

Verification provenance, freshness gate, production browser path, Node ≠ deployment proof, residue sweep.  
T-042: interleaving owned by vNext parse + compose — not structured HTML.

---

## Preserve under T-050

T-030 §8 export spine **and** corrected beat/task interleaving (T-042 / §8a). No silent obsolete-renderer fallback. `slide_deck` keeps `buildUtilityStructuredHtml`.

---

## Task sequence

| Now | Later |
| --- | ----- |
| **T-050** sole-renderer verification + closure | — |

---

## Do not

- Claim final acceptance without T-050 browser evidence  
- Open 74B/74C  
- Fix Sprint-70 E4 drift as part of T-050 unless it blocks browser proof  
