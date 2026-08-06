# Sprint 73 — Plan

**Status:** **OPEN** (2026-08-06)  
**Theme:** Workflow Resources  
**Backlog anchor:** [PB-FA-001](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources)  
**Charter:** [SPRINT-73-CHARTER.md](SPRINT-73-CHARTER.md)  
**Planning principle:** A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria.

Task IDs: `S73-T-###`. Decision IDs: `S73-D##` in [decisions.md](decisions.md).

**Implementation is not assumed.** Phase 2 and Phase 3 tasks are **conditional** on the feasibility decision gate.

---

## Phase 1 — Architecture discovery (committed)

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S73-T-001 | Map current generated-image lifecycle (generation → reference → render → export) | **Done** | [S73-T-001-generated-image-lifecycle-discovery.md](S73-T-001-generated-image-lifecycle-discovery.md) |
| S73-T-002 | **Determine canonical owner of a workflow resource** — compare ownership locations; identify primary owner and contributing/reference layers | **Done** | [S73-T-002-canonical-workflow-resource-ownership.md](S73-T-002-canonical-workflow-resource-ownership.md) |
| S73-T-003 | Evaluate persistence opportunities and storage strategy options | **Done** | [S73-T-003-persistence-strategy-evaluation.md](S73-T-003-persistence-strategy-evaluation.md) |
| S73-T-004 | Assess export and public-export-path implications | **Done** | [S73-T-004-export-and-regeneration-path-implications.md](S73-T-004-export-and-regeneration-path-implications.md) |
| S73-T-005 | Feasibility synthesis and decision-gate recommendation (incl. prompt-independence durability) | **Done** | [S73-T-005-feasibility-synthesis.md](S73-T-005-feasibility-synthesis.md) |

**Phase 1 deliverables:**

- Architecture discovery notes: [S73-T-001](S73-T-001-generated-image-lifecycle-discovery.md) · [S73-T-002](S73-T-002-canonical-workflow-resource-ownership.md) · [S73-T-003](S73-T-003-persistence-strategy-evaluation.md) · [S73-T-004](S73-T-004-export-and-regeneration-path-implications.md) · [S73-T-005](S73-T-005-feasibility-synthesis.md)  
- Regeneration verdict (T-004): **conditionally compatible** with canonical owner model  
- Feasibility synthesis verdict (T-005): **feasible with explicit conditions** (input to decision gate)  
- Prompt-independence durability assessed without requiring durable generation prompts  
- Draft Phase 2 acceptance-criteria obligations recorded  
- Feasibility gate outcome recorded in `S73-D02` (**accepted; conditional feasibility**)  
- Phase 2 acceptance criteria: [S73-T-010](S73-T-010-phase-2-acceptance-criteria.md)  

---

## Decision gate

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S73-T-006 | Record feasibility decision (`S73-D02`) | **Done** | [S73-D02 in decisions.md](decisions.md#s73-d02-workflow-resource-persistence-is-feasible-with-explicit-conditions) |

---

## Phase 2 — Persistent generated images (conditional)

*Acceptance criteria recorded (`S73-T-010`); implementation may begin on `S73-T-011`.*

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S73-T-010 | Define acceptance criteria for image persistence | **Done** | [S73-T-010-phase-2-acceptance-criteria.md](S73-T-010-phase-2-acceptance-criteria.md) |
| S73-T-011 | Implement persistent generated images (minimal vertical slice) | **Done** | [S73-T-011-generated-image-persistence-implementation.md](S73-T-011-generated-image-persistence-implementation.md) |
| S73-T-012 | Focused regression coverage for persistence path | **Next** | Complete verification matrix + browser proof per T-010 |

---

## Phase 3 — Generalise Workflow Resources architecture (conditional)

*Do not schedule until Phase 2 is working.*

| ID | Task | Status | Notes |
| -- | ---- | ------ | ----- |
| S73-T-020 | Document generalised Workflow Resources model | **Blocked** | Extensible to uploaded documents, embedded video — design only |
| S73-T-021 | Evaluate alignment with author-evidence association persistence (`S72-D09`) | **Blocked** | Unified workflow asset persistence model |

---

## Explicit non-scope (this plan)

- PB-FA-002 programming resources  
- PB-FA-003 pipeline integrity  
- Evidence architecture changes (default out)  
- PDF / Word / video implementation  
- Unrelated UI polish · learner renderer redesign  

Unrelated product-backlog items are **not** added to this plan without a recorded scope decision.

---

## Execution order

```text
Phase 1 (S73-T-001 … T-005)
  → Decision gate (S73-T-006 / S73-D02)
  → [if feasible] Phase 2 (S73-T-010 … T-012)
  → [if Phase 2 succeeds] Phase 3 (S73-T-020 … T-021)
```

---

## Former Sprint 72 links (historical — now PB-FA-001)

T-042, T-051, B-002, T-040, T-041, T-044 — retired from Sprint 72; tracked under [PB-FA-001 — Workflow Resources](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources).
