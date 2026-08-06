# Sprint 73 — Plan

**Status:** **COMPLETE / Closed** (2026-08-06)  
**Theme:** Workflow Resources  
**Backlog anchor:** [PB-FA-001](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources)  
**Charter:** [SPRINT-73-CHARTER.md](SPRINT-73-CHARTER.md)  
**Final report:** [SPRINT-73-FINAL-REPORT.md](SPRINT-73-FINAL-REPORT.md)  
**Closure:** [SPRINT-73-CLOSURE.md](SPRINT-73-CLOSURE.md)  
**Planning principle:** A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria.

Task IDs: `S73-T-###`. Decision IDs: `S73-D##` in [decisions.md](decisions.md).

All Sprint 73 phases and implementation tasks below are **Done**. No implementation tasks remain active. No Sprint 74 tasks are created here. Future work: [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md).

---

## Phase 1 — Architecture discovery (committed) — Complete

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S73-T-001 | Map current generated-image lifecycle (generation → reference → render → export) | **Done** | [S73-T-001-generated-image-lifecycle-discovery.md](S73-T-001-generated-image-lifecycle-discovery.md) |
| S73-T-002 | **Determine canonical owner of a workflow resource** — compare ownership locations; identify primary owner and contributing/reference layers | **Done** | [S73-T-002-canonical-workflow-resource-ownership.md](S73-T-002-canonical-workflow-resource-ownership.md) |
| S73-T-003 | Evaluate persistence opportunities and storage strategy options | **Done** | [S73-T-003-persistence-strategy-evaluation.md](S73-T-003-persistence-strategy-evaluation.md) |
| S73-T-004 | Assess export and public-export-path implications | **Done** | [S73-T-004-export-and-regeneration-path-implications.md](S73-T-004-export-and-regeneration-path-implications.md) |
| S73-T-005 | Feasibility synthesis and decision-gate recommendation (incl. prompt-independence durability) | **Done** | [S73-T-005-feasibility-synthesis.md](S73-T-005-feasibility-synthesis.md) |

**Phase 1 deliverables:** discovery notes linked above; regeneration verdict conditionally compatible; feasibility **feasible with explicit conditions**; gate outcome `S73-D02`.

---

## Decision gate — Complete

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S73-T-006 | Record feasibility decision (`S73-D02`) | **Done** | [S73-D02 in decisions.md](decisions.md#s73-d02-workflow-resource-persistence-is-feasible-with-explicit-conditions) |

---

## Phase 2 — Persistent generated images — Complete

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S73-T-010 | Define acceptance criteria for image persistence | **Done** | [S73-T-010-phase-2-acceptance-criteria.md](S73-T-010-phase-2-acceptance-criteria.md) |
| S73-T-011 | Implement persistent generated images (minimal vertical slice) | **Done** | [S73-T-011-generated-image-persistence-implementation.md](S73-T-011-generated-image-persistence-implementation.md) |
| S73-T-012 | Focused regression coverage for persistence path | **Done** | [S73-T-012-generated-image-persistence-verification.md](S73-T-012-generated-image-persistence-verification.md) |

**Phase 2 outcome:** Complete with documented constraints (see T-012). Heavy verify ~10 images / ~23.7 MB.

---

## Phase 3 — Generalise Workflow Resources architecture — Complete

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S73-T-020 | Document generalised Workflow Resources model | **Done** | [S73-T-020-workflow-resources-generalisation-design.md](S73-T-020-workflow-resources-generalisation-design.md) |
| S73-T-021 | Evaluate alignment with author-evidence association persistence (`S72-D09`) | **Done** | Shared owner model retained; page refs remain lightweight and compatible |
| S73-T-022 | Slice A implementation — page-level downloadable resources | **Done** | [S73-T-022-024-resources-and-video-implementation.md](S73-T-022-024-resources-and-video-implementation.md) |
| S73-T-023 | Slice A verification | **Done** | [S73-T-023-025-resources-and-video-verification.md](S73-T-023-025-resources-and-video-verification.md) |
| S73-T-024 | Slice B implementation — one embedded video | **Done** | [S73-T-022-024-resources-and-video-implementation.md](S73-T-022-024-resources-and-video-implementation.md) |
| S73-T-025 | Slice B verification | **Done** | [S73-T-023-025-resources-and-video-verification.md](S73-T-023-025-resources-and-video-verification.md) |

**UI / presentation polish (within Phase 3 evidence, not separate tasks):** authoring tabs with always-visible counts; Orient nested video/resources; vertical Video form — documented in T-022-024 §15–16 and T-023-025 presentation addendum. **Complete.**

---

## Explicit non-scope (this plan — unchanged)

- PB-FA-002 programming resources  
- PB-FA-003 pipeline integrity  
- Manually uploaded graphics → [PB-FA-004](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-004--manually-uploaded-graphics) (backlog; not Sprint 73)  
- Evidence architecture changes (default out)  
- Unrelated learner-renderer redesign  

No new future-resource implementation is scheduled in this plan.

---

## Execution order (historical)

```text
Phase 1 (S73-T-001 … T-005)
  → Decision gate (S73-T-006 / S73-D02)
  → Phase 2 (S73-T-010 … T-012)
  → Phase 3 (S73-T-020 … T-025 + documented UI refinements)
  → Closeout (Final Report + Closure)
```

---

## Former Sprint 72 links (historical — now PB-FA-001)

T-042, T-051, B-002, T-040, T-041, T-044 — retired from Sprint 72; Sprint 73 closed against [PB-FA-001 — Workflow Resources](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources).
