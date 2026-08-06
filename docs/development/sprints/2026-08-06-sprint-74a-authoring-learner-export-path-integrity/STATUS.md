# Sprint 74A — Status / Dashboard

**Sprint:** 74A — Authoring → Learner Export Path Integrity  
**Status:** **OPEN**  
**Opened:** 2026-08-06  
**Parent:** Sprint 74 — **OPEN** (programme wrapper)  
**Charter:** [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md)  
**Sole-renderer removal direction:** [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) — **Accepted**

---

## Narrative

```text
T-001 ✅ → T-010 ✅ → T-020 ✅ → T-030 ✅ → T-040 ✅ → T-042 ✅ → T-045 remove ✅
  → next: T-050 sole-renderer verification / close
```

---

## Checkpoint

| Item | State |
| ---- | ----- |
| Sprint 74A | **OPEN** |
| T-001 / T-010 / T-020 / T-030 / T-040 / T-042 / **T-045** | **Done** |
| T-050 | **Not started — next** |
| Interleaving regression | **Repaired** (T-042) — preserve under T-050 |
| Generated artefact freshness | **Green** |
| Obsolete-renderer removal | **Done** (T-045); acceptance pending T-050 |
| Pre-removal rollback | `065b3ac` |
| 74B / 74C | **Not opened** |

---

## Phase / task tracker

| ID | Task | Status |
| -- | ---- | ------ |
| S74A-T-001 | Sprint pack initialisation | **Done** |
| S74A-T-010 | Export-path documentation audit | **Done** |
| S74A-T-020 | vNext generated browser artefact integrity | **Done** |
| S74A-T-030 | Definitive vNext production-browser baseline | **Done** (see §8a qualification) |
| S74A-T-040 | Obsolete renderer responsibility and removal inventory | **Done** |
| S74A-T-042 | Activity-beat/task interleaving definitive-path repair | **Done** |
| S74A-T-045 | Remove obsolete learner-renderer implementation | **Done** |
| S74A-T-050 | Sole-renderer verification and sprint closure | **Not started — next** |

---

## Current task

Begin **S74A-T-050** when authorised — production-browser sole-renderer verification against [T-030 §8](S74A-T-030-production-browser-baseline.md) + [T-042](S74A-T-042-activity-task-interleaving-definitive-path-repair.md) interleaving. Evidence: [S74A-T-045-obsolete-learner-renderer-removal.md](S74A-T-045-obsolete-learner-renderer-removal.md).

---

## T-045 slice log

| Slice | Subject | Notes |
| ----- | ------- | ----- |
| S1 | Remove learner renderer selection | Selector/state removed |
| S2 | Route learner page export exclusively through vNext | Pipeline always `runLearnerRendererVNextExport` |
| S3 | Remove obsolete learner page routing | Drop dead page plan + registry page variant |
| S4 | Remove obsolete learner renderer implementation | Structured HTML rejects pages; slide_deck retained |
| S5 | Browser bootstrap / normalizeRendererVersion | Sole-version API; rebuild artefacts |
| S6 | Remove obsolete renderer tests and fixtures | Legacy parity suites deleted/rewritten |
| S7 | Docs / terminology after removal | Active guidance describes sole vNext |
| S8 | Residue sweep + evidence | [T-045 report](S74A-T-045-obsolete-learner-renderer-removal.md) |

---

## Last updated

2026-08-06 — S74A-T-045 Done; next T-050. Pre-removal rollback `065b3ac`.
