# Sprint 75 — Status / Dashboard

**Sprint:** 75 — PRISM User Experience and Interface  
**Status:** **OPEN** (opened 2026-08-10)  
**Opened:** 2026-08-10  
**Predecessor:** Sprint 74 — **COMPLETE / Closed**  
**Charter:** [SPRINT-75-CHARTER.md](SPRINT-75-CHARTER.md)  
**Decisions:** [S75-D01](decisions.md#s75-d01--open-sprint-75--prism-user-experience-and-interface) · … · [S75-D25](decisions.md#s75-d25--create-proposed-workflow-one-graph-read-only-preview)  
**Cross-journey synthesis:** [S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md](S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md)

---

## Narrative

```text
… prior D03–D24 …
  → S75-D25 Accepted — Create Proposed workflow is one read-only graph
     Draft/Refined Create chrome retired; pack post-gen machinery retained
  → Persistence closed (do not reopen); Sprint 76 NOT opened
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
| S75-D03–D24 | **Accepted** |
| S75-D25 | **Accepted** — Proposed workflow read-only; Create Draft/Refined retired |
| C-08 Create refinement discoverability | **CLOSED AS RESOLVED** |
| Orphaned runstate cleanup | **Backlog** — [PB-FA-007](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-007--user-controlled-storage-management) |
| Release / development process (incl. cache-bust) | **Backlog** — [PB-S-005](../../../backlog/PRODUCT-BACKLOG.md#pb-s-005--stable-release--development-process) |
| Settings parameter contract + IA | **Backlog** — [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) |
| First-class Slideshow / product catalogue | **Backlog** — [PB-FA-008](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-008--first-class-slideshow-product--architecture-extensibility-test) |
| Research domain pack maturation | **Backlog** — [PB-FA-009](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-009--research-domain-pack-maturation) |
| Sprint 76 | **Not opened** |

---

## Last updated

2026-08-11 — `S75-D25` Create Proposed workflow read-only preview; Draft/Refined Create chrome retired; pack post-generation refinement machinery retained. Persistence untouched; Sprint 76 not opened.
