# Sprint 74A — Next-chat briefing

**Pack status:** **OPEN** — T-001…T-042 Done; next **T-045**  
**Mission:** Sole / definitive vNext learner renderer; remove obsolete renderer  
**Decisions:** `S74A-D01` · **`S74A-D02`** · parent **`S74-D07`**  
**Baseline:** [S74A-T-030](S74A-T-030-production-browser-baseline.md) §8 + §8a  
**Removal map:** [S74A-T-040](S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md)  
**Interleaving:** [S74A-T-042](S74A-T-042-activity-task-interleaving-definitive-path-repair.md)

---

## One-line mission

**Begin S74A-T-045** when authorised — execute T-040 slices S1–S8. Preserve corrected beat/task interleaving (T-042). Do not combine with unrelated work.

---

## Read first

1. [SPRINT-74A-START-HERE.md](SPRINT-74A-START-HERE.md)  
2. [T-042 repair](S74A-T-042-activity-task-interleaving-definitive-path-repair.md)  
3. [T-040 inventory](S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md) §20  
4. [T-030](S74A-T-030-production-browser-baseline.md) §8 + §8a  
5. [CONTEXT.md](CONTEXT.md) · [PLAN.md](PLAN.md) · [STATUS.md](STATUS.md)  

---

## Sequence

1. ~~T-020…T-040~~ Done  
2. ~~T-042~~ Done — interleaving definitive-path repair  
3. **T-045** remove obsolete learner-renderer ← **next**  
4. **T-050** sole-renderer verification + closure  

---

## Hard rules

- Preserve T-030 §8 **and** T-042 interleaving  
- Interleaving owner = vNext parse + compose — not `buildUtilityStructuredHtml`  
- No silent Legacy fallback  
- Node ≠ deployment proof; freshness before browser verification  
- No Sprint-70 E4 drift fix under T-045; no 74B/74C  

---

## Terminology

definitive implementation · sole learner renderer · obsolete / superseded renderer · production browser path · generated browser artefact · Node-based test evidence · beat/task interleaving
