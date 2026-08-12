# Sprint 75 — Status / Dashboard

**Sprint:** 75 — PRISM User Experience and Interface  
**Status:** **COMPLETE / Closed** (closed 2026-08-12)  
**Opened:** 2026-08-10  
**Predecessor:** Sprint 74 — **COMPLETE / Closed**  
**Charter:** [SPRINT-75-CHARTER.md](SPRINT-75-CHARTER.md)  
**Closure:** [SPRINT-75-CLOSURE.md](SPRINT-75-CLOSURE.md) · [SPRINT-75-FINAL-REPORT.md](SPRINT-75-FINAL-REPORT.md)  
**Decisions:** [S75-D01](decisions.md#s75-d01--open-sprint-75--prism-user-experience-and-interface) · … · [S75-D32](decisions.md#s75-d32--prompt-library-header-action-grouping)  
**Handover:** [HANDOVER.md](HANDOVER.md) · [next-chat-briefing.md](next-chat-briefing.md)  
**Cross-journey synthesis:** [S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md](S75-T-020-cross-journey-ux-evidence-synthesis-and-intervention-framing.md)

---

## Snapshot

| Lane | State |
| ---- | ----- |
| **Sprint 75 programme** | **COMPLETE / Closed** (2026-08-12) |
| **Create UX pass** | **COMPLETE** (`S75-D22`–`D25`) |
| **My Workflows / Run / lifecycle** | **Delivered** (see Final Report §4) |
| **Prompt Studio / Prompt Library** | **Delivered** (see Final Report §6–7) |
| **Persistence** | **SETTLED** (`S75-D21`) — do not reopen |
| **NEXT (post-Sprint 75)** | **Lagrangian Multipliers resource quality investigation** |
| **Following** | **Settings** → [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) |
| **Sprint 76** | **Not opened** |

```text
Sprint 75 COMPLETE
  → NEXT: Lagrangian Multipliers resource quality investigation (diagnose before fix)
  → THEN: Settings (PB-FA-005)
  → Sprint 76 not opened
```

---

## Delivered (summary)

Full narrative: [SPRINT-75-FINAL-REPORT.md](SPRINT-75-FINAL-REPORT.md).

- **Create** — one-product brief; progressive assistant; hidden resolved-brief UI; Proposed workflow; Save Workflow; API-key action gate; generic reviewer retired.
- **My Workflows** — Run defaults and UX; display-only segmented progress; persisted-output indication; lifecycle (Rename, Duplicate, Delete, Import); control grouping; DLA guidance/validator fixes.
- **Authoring** — Run handoff; learner-ready assembly gate; Learning object format retired.
- **Run persistence** — D14–D21 sequence; IndexedDB resource-backed captures (**SETTLED**).
- **Prompt Studio** — Output type visibility; Generate progressive disclosure; Paste/Generate split (Paste default); Library-aligned paste save.
- **Prompt Library** — header action grouping; Copy prompt / Save / Use as template relocation.

---

## Testing (closeout)

| Suite | Result |
| ----- | ------ |
| Authoritative Sprint 75 regression batch (8 files) | **114 / 114 pass** |
| Full `tests/s75-*.test.js` | 1 stale cache-bust assertion in `s75-d26-compact-prism-status-control.test.js` (test maintenance; not fixed at closeout) |
| `tests/workflow-design-page-upstream-prompt.test.js` | **3 / 3 pass** (prior `visual_need` failure not reproduced) |

---

## Deferred / backlog

| Item | Link |
| ---- | ---- |
| Lagrangian Multipliers resource quality investigation | **Immediate next** — [HANDOVER.md](HANDOVER.md) |
| Settings / parameterisation + IA | [PB-FA-005](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-005--workflow-settings--parameterisation-source-of-truth-and-runtime-consistency) |
| Advanced custom-workflow Edit machinery | Future sprint **if evidence warrants** — not opened |
| User-controlled storage management | [PB-FA-007](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-007--user-controlled-storage-management) |
| QA / refinement lifecycle | [PB-FA-006](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-006--qa--workflow-and-resource-refinement-lifecycle) |
| T-020 C-09 / C-11 / C-12 | Deferred |
| Slideshow / Research pack / release process | PB-FA-008 / PB-FA-009 / PB-S-005 |

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

2026-08-12 — Sprint 75 **COMPLETE / Closed**. Handover points to Lagrangian Multipliers resource quality investigation, then Settings. Sprint 76 not opened.
