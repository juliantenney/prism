# Sprint 75 — Status / Dashboard

**Sprint:** 75 — PRISM User Experience and Interface  
**Status:** **OPEN** (opened 2026-08-10)  
**Opened:** 2026-08-10  
**Predecessor:** Sprint 74 — **COMPLETE / Closed**  
**Charter:** [SPRINT-75-CHARTER.md](SPRINT-75-CHARTER.md)  
**Decisions:** [S75-D01](decisions.md#s75-d01--open-sprint-75--prism-user-experience-and-interface) · … · [S75-D25](decisions.md#s75-d25--create-proposed-workflow-one-graph-read-only-preview)  
**Pasteable context for product/design chat:** [next-chat-briefing.md](next-chat-briefing.md)  
**Cross-journey synthesis:** [S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md](S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md)

---

## Snapshot

| Lane | State |
| ---- | ----- |
| **Create UX pass** | **COMPLETE** (`S75-D22`–`D25`) |
| **Persistence** | **SETTLED** (`S75-D21`) — do not reopen |
| **NEXT REVIEW** | **My Workflows** — functional audit first, then UI |
| **Settings** | Major review **after** My Workflows → [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) |
| **Sprint 76** | **Not opened** |

```text
Create COMPLETE (intent → essentials → one graph → Proposed → Save Workflow)
  → Persistence SETTLED (IndexedDB payloads / localStorage refs)
  → NEXT: My Workflows functional/operator audit
  → Later: Settings (PB-FA-005)
```

---

## DONE

- Create journey simplified and coherent for this pass (see [next-chat-briefing.md](next-chat-briefing.md)).
- Cross-journey / Run / Authoring interventions through `S75-D21` as recorded in [decisions.md](decisions.md).
- Generic Create workflow reviewer retired (`S75-D03`).
- Run captures migrated to IndexedDB resources; ref-backed runtime (`storageVersion` ≥ 2).

---

## ESTABLISHED PRODUCT DECISIONS (Create)

| Decision | One-line |
| -------- | -------- |
| **S75-D22** | One workflow → one product; simplified LD Create brief |
| **S75-D23** | Assistant progressive disclosure + API-key action gate |
| **S75-D24** | Resolved-brief diagnostics off Create UI; resolution engine retained |
| **S75-D25** | One Proposed workflow (read-only); Draft/Refined Create chrome retired; **Save Workflow** |

Product model: **CREATE** = intent + essentials + generation · **SETTINGS** = deliberate detail · **RUN** / **AUTHORING** unchanged in role.

---

## KNOWN DEFECTS

| Defect | Notes |
| ------ | ----- |
| **Rename** | Known: appears to create a duplicate. Contract: rename in place; same identity; retain associated state. |
| **Delete / Import / Export** | Need My Workflows functional audit (identity, runstate, resources). |
| Duplicate Run inheritance | **Not a defect question** — Duplicate = **new identity + clean Run state** (decided). |

---

## BACKLOG / DEFERRED

| Item | Link |
| ---- | ---- |
| Settings / parameterisation + IA | [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) |
| User-controlled storage management (usage bar, explicit cleanup) | [PB-FA-007](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-007--user-controlled-storage-management) |
| Stable release / cache-bust process | [PB-S-005](../../../backlog/PRODUCT-BACKLOG.md#pb-s-005--stable-release--development-process) |
| Slideshow / product extensibility | [PB-FA-008](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-008--first-class-slideshow-product--architecture-extensibility-test) |
| Research pack maturation | [PB-FA-009](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-009--research-domain-pack-maturation) |
| Orphan-resource research | [PB-R-008](../../../backlog/PRODUCT-BACKLOG.md#pb-r-008) |
| QA / refinement lifecycle | [PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle) |
| T-020 C-09 / C-11 / C-12 | Deferred — operator prioritisation |

---

## NEXT REVIEW AREA

**My Workflows** — selection, modes (Run/Edit/Settings), switch/reload, Rename, Duplicate, Delete, Import, Export, Save/update, identity, runstate/resources. UI simplification **after** behaviour is understood.

---

## Persistence architecture (authoritative — settled)

| Store | Role |
| ----- | ---- |
| `PRISM_WORKFLOW_RESOURCES` / IndexedDB | Durable Run capture payloads |
| `promptr.workflows.runstate.v1` | `captureRefs`, completion flags, run index, resource refs |
| `promptr.runCaptureStorageVersion` | `2` = migrated / ref-backed normal runtime |

Legacy inline `capturedOutputs` / `capturedOutputsRaw` = migration/recovery only.

---

## Last updated

2026-08-11 — Documentation consistency pass: navigation docs aligned with Create **COMPLETE** / persistence **SETTLED** / My Workflows **NEXT**. Sprint 76 not opened.
