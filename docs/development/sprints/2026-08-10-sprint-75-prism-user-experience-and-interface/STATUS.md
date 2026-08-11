# Sprint 75 — Status / Dashboard

**Sprint:** 75 — PRISM User Experience and Interface  
**Status:** **OPEN** (opened 2026-08-10)  
**Opened:** 2026-08-10  
**Predecessor:** Sprint 74 — **COMPLETE / Closed**  
**Charter:** [SPRINT-75-CHARTER.md](SPRINT-75-CHARTER.md)  
**Decisions:** [S75-D01](decisions.md#s75-d01--open-sprint-75--prism-user-experience-and-interface) · … · [S75-D22](decisions.md#s75-d22--one-workflow--one-product-learning-design-create-simplification)  
**Cross-journey synthesis:** [S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md](S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md)

---

## Narrative

```text
… prior D03–D21 …
  → Persistence closed: IndexedDB Run captures (S75-D21); do not reopen
  → S75-D22 Accepted — ONE WORKFLOW → ONE PRODUCT
     LD Create simplified: omit Supporting + Constraints;
     Source material conditional on Starting point;
     Current products remain Self-study · Workshop only
  → C-08 CLOSED AS RESOLVED (not implemented as polish)
  → Research retains Supporting + Constraints (no LD product picker yet)
  → Sprint 76 NOT opened
```

---

## Current persistence architecture (authoritative)

> **Run capture payloads are stored as workflow resources in IndexedDB.  
> localStorage stores lightweight refs and run metadata only.**

| Store | Role |
| ----- | ---- |
| `PRISM_WORKFLOW_RESOURCES` / IndexedDB | Durable Run capture payloads |
| `promptr.workflows.runstate.v1` | `captureRefs`, completion flags, run index, resource refs |
| `promptr.runCaptureStorageVersion` | `2` = migrated / ref-backed normal runtime |

Legacy inline `capturedOutputs` / `capturedOutputsRaw` bodies are migration/recovery only.

---

## Checkpoint

| Item | State |
| ---- | ----- |
| Sprint 75 | **OPEN** |
| S75-D03–D21 | **Accepted** (persistence closed — do not reopen) |
| S75-D22 | **Accepted** — one workflow → one product; LD Create simplification |
| C-08 Create refinement discoverability | **CLOSED AS RESOLVED** |
| Orphaned runstate cleanup | **Backlog** — [PB-FA-007](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-007--user-controlled-storage-management) |
| Release / development process (incl. cache-bust) | **Backlog** — [PB-S-005](../../../backlog/PRODUCT-BACKLOG.md#pb-s-005--stable-release--development-process) |
| Settings parameter contract + IA | **Backlog** — [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) |
| First-class Slideshow / product catalogue | **Backlog** — [PB-FA-008](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-008--first-class-slideshow-product--architecture-extensibility-test) |
| Research domain pack maturation | **Backlog** — [PB-FA-009](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-009--research-domain-pack-maturation) |
| Sprint 76 | **Not opened** |

---

## Last updated

2026-08-11 — Backlog maintenance after `S75-D22`: expanded PB-S-005 / PB-FA-005 / PB-FA-007; added PB-FA-008 (Slideshow + catalogue/composition) and PB-FA-009 (Research pack maturation). Application code and tests unchanged in this docs pass. Sprint 76 not opened.
