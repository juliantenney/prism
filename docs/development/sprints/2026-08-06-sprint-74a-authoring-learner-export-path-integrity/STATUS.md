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
T-001 ✅ → T-010 ✅ → T-020 ✅ → T-030 ✅ → T-040 ✅ → T-042 interleaving repair ✅
  → next: T-045 remove (slices S1–S8) → T-050 verify/close
```

---

## Checkpoint

| Item | State |
| ---- | ----- |
| Sprint 74A | **OPEN** |
| T-001 / T-010 / T-020 / T-030 / T-040 / T-042 | **Done** |
| T-045 | **Not started — next** (unblocked after T-042 browser evidence) |
| T-050 | **Not started** |
| Interleaving regression | **Repaired** (T-042) — production behaviour includes corrected activity/task interleaving |
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
| S74A-T-030 | Definitive vNext production-browser baseline | **Done** (see §8a qualification) |
| S74A-T-040 | Obsolete renderer responsibility and removal inventory | **Done** |
| S74A-T-042 | Activity-beat/task interleaving definitive-path repair | **Done** |
| S74A-T-045 | Remove obsolete learner-renderer implementation | **Not started — next** |
| S74A-T-050 | Sole-renderer verification and sprint closure | **Not started** |

---

## Current task

Begin **S74A-T-045** when authorised — execute [T-040 inventory](S74A-T-040-obsolete-renderer-responsibility-removal-inventory.md) slices S1–S8. Preserve [T-030 §8](S74A-T-030-production-browser-baseline.md) **and** corrected interleaving ([T-042](S74A-T-042-activity-task-interleaving-definitive-path-repair.md) / §8a). Do not mark removal ACs complete until T-050.

---

## Last updated

2026-08-06 — Pre-removal checkpoint: T-020…T-042 Done; freshness green; working tree clean before T-045 (Not started).
