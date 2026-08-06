# Sprint 74A — Next-chat briefing

**Pack status:** **OPEN** — T-001…T-045 Done; next **T-050**  
**Mission:** Sole / definitive vNext learner renderer; verify after removal  
**Decisions:** `S74A-D01` · **`S74A-D02`** · parent **`S74-D07`**  
**Baseline:** [S74A-T-030](S74A-T-030-production-browser-baseline.md) §8 + §8a  
**Removal evidence:** [S74A-T-045](S74A-T-045-obsolete-learner-renderer-removal.md)  
**Interleaving:** [S74A-T-042](S74A-T-042-activity-task-interleaving-definitive-path-repair.md)

---

## One-line mission

**Begin S74A-T-050** when authorised — production-browser sole-renderer verification and sprint closure. Do not reopen obsolete-renderer work unless T-050 finds a residue defect.

---

## Read first

1. [SPRINT-74A-START-HERE.md](SPRINT-74A-START-HERE.md)  
2. [T-045 removal evidence](S74A-T-045-obsolete-learner-renderer-removal.md)  
3. [T-030](S74A-T-030-production-browser-baseline.md) §8 + §8a  
4. [T-042 repair](S74A-T-042-activity-task-interleaving-definitive-path-repair.md)  
5. [STATUS.md](STATUS.md)  

---

## Sequence

1. ~~T-020…T-045~~ Done  
2. **T-050** sole-renderer verification + closure ← **next**  

---

## Hard rules

- Preserve T-030 §8 **and** T-042 interleaving  
- Fresh browser context; freshness gate before browser proof  
- Node ≠ deployment proof  
- No 74B/74C  

---

## Terminology

definitive implementation · sole learner renderer · obsolete / superseded renderer · production browser path · generated browser artefact · Node-based test evidence · beat/task interleaving
