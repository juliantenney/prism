# Sprint 74A â€” Status / Dashboard

**Sprint:** 74A â€” Authoring â†’ Learner Export Path Integrity  
**Status:** **OPEN**  
**Opened:** 2026-08-06  
**Parent:** Sprint 74 â€” **OPEN** (programme wrapper)  
**Charter:** [SPRINT-74A-CHARTER.md](SPRINT-74A-CHARTER.md)  
**Sole-renderer removal direction:** [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer) â€” **Accepted**

---

## Narrative

```text
T-001 âœ… â†’ T-010 âœ… â†’ T-020 âœ… â†’ T-030 âœ… â†’ T-040 âœ… â†’ T-042 interleaving repair âœ…
  â†’ T-045 remove In progress (slices S1â€“S8) â†’ T-050 verify/close
```

---

## Checkpoint

| Item | State |
| ---- | ----- |
| Sprint 74A | **OPEN** |
| T-001 / T-010 / T-020 / T-030 / T-040 / T-042 | **Done** |
| T-045 | **In progress** (pre-removal rollback: `065b3ac`) |
| T-050 | **Not started** |
| Interleaving regression | **Repaired** (T-042) â€” production behaviour includes corrected activity/task interleaving |
| Generated artefact freshness | **Green** (`npm run check:learner-renderer-vnext-browser`) |
| Pre-removal working tree | **Clean checkpoint** before T-045 |
| Obsolete-renderer removal | Inventory Done; deletion **not started** |
| 74B / 74C | **Not opened** |

---

## Phase / task tracker

| ID | Task | Status |
| -- | ---- | ------ |
| S74A-T-001 | Sprint pack initialisation | **Done** |
| S74A-T-010 | Export-path documentation audit | **Done** |
| S74A-T-020 | vNext generated browser artefact integrity | **Done** |
| S74A-T-030 | Definitive vNext production-browser baseline | **Done** (see Â§8a qualification) |
| S74A-T-040 | Obsolete renderer responsibility and removal inventory | **Done** |
| S74A-T-042 | Activity-beat/task interleaving definitive-path repair | **Done** |
| S74A-T-045 | Remove obsolete learner-renderer implementation | **In progress** |
| S74A-T-050 | Sole-renderer verification and sprint closure | **Not started** |

---

## Current task

**S74A-T-045** In progress â€” execute [T-040 inventory](S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md) slices S1â€“S8. Preserve [T-030 Â§8](S74A-T-030-production-browser-baseline.md) **and** corrected interleaving ([T-042](S74A-T-042-activity-task-interleaving-definitive-path-repair.md) / Â§8a). Do not mark removal ACs complete until T-050.

---

## T-045 slice log

| Slice | Subject | Notes |
| ----- | ------- | ----- |
| S1 | Remove learner renderer selection | Selector/state removed |
| S2 | Route learner page export exclusively through vNext | Pipeline always `runLearnerRendererVNextExport` |
| S3 | Remove obsolete learner page routing | Drop dead page plan + registry page variant |
| S4 | Remove obsolete learner renderer implementation | Structured HTML rejects pages; slide_deck retained |
| S5 | Browser bootstrap / normalizeRendererVersion | Sole-version API; rebuild artefacts |

---

## Last updated

2026-08-06 â€” S74A-T-045 In progress from checkpoint `065b3ac`.
