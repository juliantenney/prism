# Sprint 73 — Charter

**Sprint:** 73 — Workflow Resources  
**Status:** **OPEN** (2026-08-06)  
**Opened:** 2026-08-06  
**Predecessor:** Sprint 72 — COMPLETE / Closed (2026-08-05)  
**Backlog anchor:** [PB-FA-001](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources)  
**Start here:** [SPRINT-73-START-HERE.md](SPRINT-73-START-HERE.md)

---

## Purpose

**Provide first-class Workflow Resources for Prism** by investigating durable persistence for learner-facing resources, beginning with generated images.

**Do not assume implementation is possible.** The first objective is to understand the current architecture and determine whether robust workflow asset persistence is achievable as the foundation for that capability.

---

## Workflow Resources direction

**Workflow Resources** are expected ultimately to encompass:

- **Generated media** (images and similar generated assets — first investigation / implementation slice in Sprint 73)  
- **Uploaded documents** (e.g. PDF, Word — anticipated consumers only)  
- **Embedded external resources** (e.g. video — anticipated consumers only)

Sprint 73 **does not commit** to implementing uploaded documents or embedded video. PDF, Word, and video remain anticipated architecture consumers unless a later decision changes scope.

---

## Problem statement

Sprint 72 productised evidence-centred instructional architecture but **explicitly deferred** durable workflow asset storage:

- **`S72-D09`** — generated image assets and workflow ↔ author-evidence associations must share **one** workflow asset-persistence model.  
- **`S72-D10`** — conversation-bound source use is implemented; **attachment byte persistence** remains out of scope.

Generated images and other learner-facing assets currently lack first-class Workflow Resources — no durable persistence and identity model that survives workflow refresh, navigation, export, and selective regeneration. Without this, platform durability, workflow continuity, and author experience remain fragile as Prism approaches v1.0 feature completeness.

---

## Central question

Can Prism introduce first-class Workflow Resources — beginning with persistent generated images — through a shared, extensible architecture that survives refresh, export, and regeneration without compromising fidelity or workflow continuity?

---

## Design principles (Sprint 73 — planning constraints)

### Resource-type neutrality

> **Resource-type neutrality:** the persistence architecture must not be specialised for images. Images are the first implementation slice of a resource model intended to support multiple learner-facing resource types.

This is a planning/design constraint for Phase 1 evaluation — not an implementation decision.

### Prompt-independence (durability)

> A persisted workflow resource should remain usable even if its generating prompt is no longer available.

Phase 1 must **evaluate** whether Prism's architecture can satisfy this durability requirement.

---

## Goals (ordered; conditional beyond Phase 1)

1. **Investigate** the current generated-image lifecycle, ownership boundaries, and persistence opportunities — including **what is the canonical owner of a workflow resource?**  
2. **Determine** a storage strategy and evaluate export / public-path implications.  
3. **Establish** whether robust workflow asset persistence is technically feasible (decision gate).  
4. **If feasible:** implement persistent generated images as the first Workflow Resources slice.  
5. **If images succeed:** generalise into a **Workflow Resources** architecture suitable for future types (PDF, Word, embedded video, etc.) — **design only for those types in this sprint; do not schedule their implementation**.

---

## Anticipated future resource types (not Sprint 73 commitments)

| Type | Sprint 73 status |
| ---- | ---------------- |
| Generated images / media | Primary investigation / first implementation candidate |
| Uploaded PDF resources | Anticipated consumer of architecture — **not scheduled** |
| Uploaded Word documents | Anticipated consumer — **not scheduled** |
| Embedded video | Anticipated consumer — **not scheduled** |
| Future resource types | Record as architecture consumers only |

---

## Workstreams

| ID | Workstream | Phase | Priority |
| -- | ---------- | ----- | -------- |
| WS1 | Architecture discovery (lifecycle, canonical ownership, storage, export, prompt-independence) | 1 | **P1 — committed** |
| WS2 | Feasibility decision gate | Gate | **P1 — committed** |
| WS3 | Persistent generated images | 2 | **Conditional** |
| WS4 | Workflow Resources generalisation | 3 | **Conditional** |

---

## Initial work plan

### Phase 1 — Architecture discovery

- Understand current image lifecycle (generation → reference → render → export).  
- **Determine the canonical owner of a workflow resource** — investigate and compare ownership locations, identifying primary owner and contributing/reference layers:  
  - workflow data  
  - workflow step  
  - visual job  
  - learner page  
  - export package  
  - shared resource/asset store  
- Identify persistence opportunities and constraints.  
- Determine storage strategy options (inline, sidecar, indexed store, etc.) — **resource-type-neutral** options preferred.  
- Identify export and public-export-path implications (Sprint 72 browser-bundle parity lesson).  
- **Evaluate** prompt-independence: can a persisted resource remain usable without its generating prompt?  
- Evaluate whether workflow asset persistence is technically feasible within Prism's architecture.

### Decision gate

Record a decision (`S73-D02`) stating whether persistence is **practical**. If not practical, close or pivot with explicit rationale — do not proceed to implementation on hope.

### Phase 2 — Persistent generated images *(conditional)*

Implement persistent generated images **only if** the gate passes. Scope: stable resource identity, generation metadata, reconnect after refresh/navigation, selective regeneration semantics.

### Phase 3 — Generalise Workflow Resources architecture *(conditional)*

Generalise the working image persistence into an extensible **Workflow Resources** model **only after** Phase 2 is working. Document anticipated consumers (PDF, video, attachments) without implementing them.

---

## Boundaries (explicit non-scope)

Sprint 73 will **not initially** address:

- **Programming-resource support** (PB-FA-002)  
- **Pipeline integrity** work (PB-FA-003)  
- **Unrelated UI polish**  
- **Learner renderer redesign**  
- **Evidence architecture changes** (Sprint 72 slice; `S72-D10` boundary preserved unless discovery proves a narrow, necessary coupling)

Sprint 73 scope remains **tightly aligned with PB-FA-001**. Unrelated product-backlog items are not absorbed into this sprint.

---

## Product backlog alignment

| Item | Relationship |
| ---- | ------------ |
| **PB-FA-001** Workflow Resources | **Primary sprint anchor** |
| PB-R-001 Minimal durable store for Copilot attachments | Research input to shared model — may inform but does not expand sprint scope without decision |
| PB-FA-002, PB-FA-003 | Out of scope |
| Product ideas (image-style consistency, specialist renderers, etc.) | Out of scope |

**Planning principle:** A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria. Sprint 73 opens on PB-FA-001 because predecessor decisions exist; Phase 1 must **complete** the readiness bar before Phase 2 implementation begins.

---

## Current platform state (entry)

- Sprint 72 is **complete**; primary instructional-architecture objective met.  
- Sprint 71 findings are **fully dispositioned** ([SPRINT-71-DISPOSITION-AUDIT.md](../2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-71-DISPOSITION-AUDIT.md)).  
- Prism is approaching **feature completeness for v1.0**; emphasis is shifting toward **platform durability**, **workflow continuity**, **content quality**, **author experience**, and **product polish**.  
- Continuous verification strategy from Sprint 72 (`S72-D14`) remains the regression posture.

---

## Success criteria (draft — refine after Phase 1)

| Criterion | Phase |
| --------- | ----- |
| Documented architecture discovery with canonical ownership answer and storage options | 1 |
| Recorded feasibility decision with rationale | Gate |
| Generated images persist across refresh/navigation with stable identity *(if feasible)* | 2 |
| Documented Workflow Resources model extensible to future types *(if Phase 2 succeeds)* | 3 |

Success criteria for Phases 2–3 are **conditional** and must not be treated as committed until the gate passes.

---

## Inherited binding decisions (link only)

| ID | Summary |
| -- | ------- |
| `S72-D09` | One shared workflow asset-persistence model for images and author-evidence associations |
| `S72-D10` | Attachment bytes not persisted in Sprint 72; byte path deferred to PB-FA-001 / PB-R-001 |
| `S72-D14` | Continuous verification replaces dedicated final cross-disciplinary sweep |

Full text: [Sprint 72 decisions.md](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md)
