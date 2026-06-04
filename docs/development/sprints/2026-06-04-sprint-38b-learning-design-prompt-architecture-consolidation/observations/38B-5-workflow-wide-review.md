# Slice 38B-5 — Workflow-wide review

**Date:** 2026-06-04 (updated post Wave 1 + Wave 2a planning)  
**Status:** **COMPLETE** (38B-1 + **38B-2** taxonomy — waves revised). **Wave 1 DONE** · **Wave 2 DONE** · **Wave 3 planning DONE** — [38B-W3](38B-W3-design-page-authority-review.md)  
**Inventory:** [probe-38B-5-workflow-prompt-inventory.md](../fixtures/probe-38B-5-workflow-prompt-inventory.md)

---

## Success criterion

Identify LD steps with prompt growth or layered augmentations; rank consolidation candidates and dependencies with evidence.

---

## Evidence summary (2026-06-04 probe)

| Step | Augmented (self-directed) | Blocks | Pack § |
|------|------------------------:|-------:|--------|
| Design Page | 45,791 | 15 | §13 |
| DLA | 39,201 | 14 | §5 |
| GAM | 34,482 | 15 | §6 |
| Assessment Items | 32,308 | 11 | §9 |
| Construct Sequence | 4,462 | 0 | §10 |
| Define Outcomes | 1,569 | 0 | §4 |
| Model Knowledge | 1,293 | 0 | §3 |

**~152k chars** of augmented instruction across the four heaviest steps alone (self-directed probe), before upstream JSON payloads.

---

## Consolidation waves (evidence + taxonomy)

**Taxonomy:** [38B-2](38B-2-instruction-taxonomy.md). **Precedence:** deploy `LD-TABLE-FIDELITY` and `LD-MATERIALS-COPY` before collapsing rhetoric or Sprint 38 examples.

### Wave 1 — Shared modules (foundation) — **COMPLETE**

| Module | Clusters | Steps affected |
|--------|----------|----------------|
| `LD-TABLE-FIDELITY` | 5 | **GAM**, Design Page, DLA spec cross-ref |
| `LD-MATERIALS-COPY` | 4 | Design Page, GAM echo |
| `LD-MATH-RENDER` | 8 | DLA, GAM, Assessment, Design Page |
| `LD-SELF-DIRECTED-RHETORIC` | 1, 11, 7 | DLA, GAM, Assessment, Design Page |

**Goal:** Authoritative L4 table rules + global precedence text before per-step trims. Unblocks [38B-4](38B-4-materials-and-table-fidelity.md) without Design Page-only patches.

**Exit:** [38B-W1-5](38B-W1-5-wave-1-exit-gate.md) — four-step sum **72,878** chars (−52.3% vs 38B-1 baseline).

---

### Wave 2a — GAM authority (**COMPLETE** — PR-W2a-1 pack trim)

| Evidence | Detail (post Wave 1 probe) |
|----------|----------------------------|
| GAM | **15,806** augmented (post W2a-1); **6** markers; cluster **5** **author**; `LD-TABLE-FIDELITY` + embedded `LD-MATERIALS-COPY` |
| 38B-4 | Programme **MONITORING** — GAM author path; Design Page preserve in Wave 3 ([B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md)) |
| Audit | [38B-W2A-GAM-authority-review.md](38B-W2A-GAM-authority-review.md) |

**Goal (not size):** GAM = single authoritative table producer; remove pack/runtime ambiguity vs canonical `LD-*` modules; optional merge of reading/voice/timeline scaffolds.

**Implementation scope (approved direction):** Pack §6 CC-CONTRACT dedupe; fix self-directed output template (`Facilitator use:` conflict); ≤4 markers (stretch ≤3).

---

### Wave 2b — DLA authority (**COMPLETE** — PR-W2b-1 + PR-W2b-2)

| Evidence | Detail (post Wave 1 probe) |
|----------|----------------------------|
| DLA | **20,274** augmented; **6** markers; `LD-TABLE-FIDELITY` **spec (dla)** active |
| 38B-4 | Programme **MONITORING** — upstream spec + GAM author + DP preserve ([B4-CLOSURE-REVIEW](B4-CLOSURE-REVIEW.md)) |
| Audit | [38B-W2B](38B-W2B-DLA-authority-review.md) · [38B-W2B-1](38B-W2B-1-DLA-pack-authority-trim.md) · [38B-W2B-2](38B-W2B-2-dla-table-spec-role.md) |

**Goal (not size):** DLA = **specifications-only**; GAM = table **author**; Design Page = **preserve** — chain wired.

**Optional:** PR-W2b-3 merge OUTPUT CONTRACT + framing blocks.

**Order:** **GAM (2a) → DLA (2b)**.

---

### Wave 3 — Design Page authority (planning **COMPLETE**; implementation not started)

| Evidence | Detail (probe 2026-06-04) |
|----------|---------------------------|
| Design Page | **27,345** augmented; **6** markers; **largest** remaining step |
| Four-step sum | **74,534** (DLA **20,274** · GAM **15,806** · Assessment **11,109** · DP **27,345**) |
| Audit | [38B-W3-design-page-authority-review.md](38B-W3-design-page-authority-review.md) |
| Plan | [38B-3](38B-3-design-page-consolidation-plan.md) Strategy B — metrics revised |

**Goal:** **Preserve-only** compose; `LD-DESIGN-PAGE-COMPOSE-CONTRACT` + slim Sprint 38; pack §13 dedupe; target **≤22k** augmented (**~4k–7k** removable per W3 review).

**Depends on:** Wave 1 modules + Wave 2 chain (DLA spec → GAM author → DP preserve).

---

### Wave 4 — Assessment Items + Sequence + foundation

| Evidence | Detail |
|----------|--------|
| Assessment | **32,308** augmented; clusters **1**, **8**, **9** |
| Sequence | **4,462**; cluster **10** |
| MK / Outcomes | No runtime stack |

**Goal:** Rhetoric module ref only; Assessment pack trim; Sequence self-directed rider.

---

## Workflow-wide consolidation priority ranking

| Priority | Step | Wave | Taxonomy clusters | Rationale |
|----------|------|------|-------------------|-----------|
| 0 | **Shared modules** | 1 | 5, 4, 8, 1 | **DONE** — canonical modules deployed |
| 1 | Generate Activity Materials | **2a** | 5, 1, 11, 8 | Table **author**; [38B-W2A](38B-W2A-GAM-authority-review.md) |
| 2 | Design Learning Activities | **2b** | 5, 3, 1, 12 | Spec vocabulary; cognition |
| 3 | Design Page | 3 | 4–7, 12, 6 | Consumer; apply L4 before L6 |
| 4 | Generate Assessment Items | 4 | 1, 8, 9 | Rhetoric ref only |
| 5 | Construct Sequence / MK / Outcomes | 4 | 10, 2 | Pack trim |

---

## Dependency graph (materials / tables)

```text
DLA (required_materials: template | analysis_table | …)
  ↓ specifications only
GAM (pipe table realisation — PRIMARY TABLE AUTHOR)
  ↓ activity_materials artefact
Design Page (merge → learning_activities[].materials)
  ↓ compose (Sprint 38 affordances — frozen)
Renderer (expects materials.<table_key> pipes — frozen)
```

**Intervention order for table fidelity:** GAM contract → Design Page layer 4 → validate with 38B-6 anchors — not renderer.

---

## Shared module proposal (from 38B-2)

| Module ID | Clusters | Layers | Steps |
|-----------|----------|--------|-------|
| `LD-SOURCE-MEMBERSHIP` | 10 | L2–L3 | Design Page, Sequence |
| `LD-MATERIALS-COPY` | 4 | L4 | Design Page, GAM |
| `LD-TABLE-FIDELITY` | 5 | L4 | **GAM**, Design Page, DLA |
| `LD-PEL-PRESERVE` | 2, 3 | L5 | DLA, Design Page, GAM |
| `LD-SELF-DIRECTED-RHETORIC` | 1, 11, 7 | L5–L7 | DLA, GAM, Assessment, Design Page |
| `LD-SPRINT38-AFFORDANCE` | 6, 7 | L6 | Design Page only |
| `LD-MATH-RENDER` | 8 | L7 | DLA, GAM, Assessment, Design Page |
| `LD-ASSESSMENT-PRESERVE` | 9 | L1, L3 | Assessment, Design Page |

---

## Candidates table

| Step | Consolidate? | Wave | Depends on |
|------|-------------|------|------------|
| Design Page | **Yes** | 1 | 38B-2 taxonomy, GAM table output |
| Generate Activity Materials | **Yes** | **2a** | `LD-TABLE-FIDELITY` (deployed); [38B-W2A](38B-W2A-GAM-authority-review.md) |
| Design Learning Activities | **Yes** | **2b** | [38B-W2B](38B-W2B-DLA-authority-review.md); `LD-TABLE-FIDELITY` spec (dla) wired |
| Generate Assessment Items | **Yes** | 3 | `LD-SELF-DIRECTED-RHETORIC` |
| Construct Learning Sequence | Pack trim | 4 | Wave 1 overview language |
| Model Knowledge / Outcomes | Defer | 4 | — |

---

## Outputs

- [x] Ranked backlog with evidence  
- [x] Waves 1–4 defined  
- [x] GAM/DLA upstream table hypothesis documented  
- [x] Wave 2b DLA authority review — [38B-W2B](38B-W2B-DLA-authority-review.md)  
- [x] Wave 3 Design Page authority review — [38B-W3](38B-W3-design-page-authority-review.md)  
- [x] Shared modules named for 38B-3 / 38B-7
