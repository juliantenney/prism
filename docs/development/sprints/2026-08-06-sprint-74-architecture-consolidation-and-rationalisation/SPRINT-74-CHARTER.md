# Sprint 74 — Charter

**Sprint:** 74 — Architecture Consolidation and Rationalisation  
**Status:** **OPEN** (2026-08-06)  
**Opened:** 2026-08-06  
**Predecessor:** Sprint 73 — COMPLETE / Closed (2026-08-06)  
**Type:** Discovery-led wrapper sprint (maturation phase)  
**Start here:** [SPRINT-74-START-HERE.md](SPRINT-74-START-HERE.md)  
**Backlog relationships:** [PB-FA-003](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-003--pipeline-integrity) · [PB-S-004](../../../backlog/PRODUCT-BACKLOG.md) (related; not auto-consumed) · product backlog remains authority for feature work

---

## Binding architectural constraints

**Authoritative expanded statement:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)  
**Decisions:** `S74-D03` (browser-only + static deployment) · `S74-D04` (one supported path) · `S74-D05` (`app.js` by ownership, not size) · **`S74-D07`** (one definitive codebase)

These constraints bind Sprint 74 and all later **74A / 74B / 74C** work. Summary:

1. **Browser-only runtime** — production is HTML/JS/CSS + browser APIs; Node is development/test tooling only.  
2. **One definitive implementation** — converge established responsibilities onto one definitive codebase; remove obsolete alternatives once covered; Compatibility only for current explicit product requirements (`S74-D07` clarifies `S74-D04`).  
3. **`app.js` by ownership** — no size-driven split sprint; shell orchestration may remain.  
4. **Static deployment** — `index.html`-driven browser loading; no backend; no runtime compilation for end users.

---

## Purpose

Sprint 74 is a **discovery-led wrapper sprint**.

Its purpose is **not** to perform indiscriminate code cleanup or line-count reduction.

Its purpose is to **understand the current supported Prism architecture** and **establish a sequence of evidence-based rationalisation sprints** that leave **one definitive implementation** per established responsibility — unmistakable to maintainers, contributors, and coding agents.

Follow-on implementation work will occur as **Sprint 74A**, **Sprint 74B**, **Sprint 74C**, etc., once discovery has identified coherent domains **and** operator approval opens those packs.

---

## Problem statement

Prism has matured through major architectural programmes (Sprint 38 series, vNext prompt/page architecture, learner-renderer-vNext, Workflow Resources). The supported **production browser path** is strong, but the repository still carries compatibility paths, documentation drift, dual-looking module/tooling surfaces (easily misread as a second runtime), and accumulation in `app.js` and tests.

Without a disciplined map, rationalisation risks breaking supported behaviour, inventing a backend, or deleting code without evidence.

---

## Central question

Can Prism establish an evidence-based map of supported architecture, ownership, schemas, bundles, and tests — and from that map recommend coherent, sequenced rationalisation domains — without changing runtime behaviour in this sprint?

---

## Goals (ordered)

1. **Map** the supported product architecture and runtime path.  
2. **Identify** ownership boundaries.  
3. **Classify** duplicate, experimental, legacy, and compatibility paths.  
4. **Inventory** schemas/contracts, browser bundles/public paths, and tests.  
5. **Recommend** coherent rationalisation domains for future 74A / 74B / 74C (high-level only).  
6. **Do not** open implementation sub-sprints until readiness (approach, ownership, acceptance criteria) exists.

---

## Architectural reference points (link only — do not reconstruct history)

| Reference | Role | Pack |
| --------- | ---- | ---- |
| Sprint 38 programme | Major pedagogical / LD architectural overhaul | [2026-06-03-sprint-38-…](../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/) (+ 38b–38s series) |
| vNext Prompt / page architecture | Prompt rationalisation + progressive page enrichment | [Sprint 56](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/) · [Sprint 56F](../2026-07-07-sprint-56f-progressive-page-enrichment-architecture/) |
| vNext Learner Renderer | Isolated learner HTML renderer | [Sprint 67](../2026-07-17-sprint-67-learner-renderer-vnext/) · [architecture doc](../../../architecture/learner-renderer-vnext.md) |
| Sprint 73 Workflow Resources | Durable resources, Authoring integration | [Sprint 73](../2026-08-06-sprint-73-workflow-resources/) |

---

## Sprint 73 as predecessor authority

Treat Sprint 73 as authoritative for:

- Workflow Resources architecture  
- generated-image persistence  
- downloadable resources  
- embedded video  
- Authoring UI (including post-close nav label polish)  
- learner rendering integration for resources  
- accepted architectural decisions (`S73-D01`…`S73-D03`)

Do **not** reopen Sprint 73 implementation work.

---

## Explicit non-scope (this sprint)

- Runtime code changes, deletions, consolidations, renames, refactors (under the wrapper)  
- Schema updates  
- Opening Sprint 74A / 74B / 74C as implementation packs without operator approval  
- Feature delivery for PB-FA-002 / PB-FA-004 (remain backlog)  
- Reconstructing Sprint 38 / 56 / 67 / 73 implementation history  
- Introducing backend, runtime Node, or non-static deployment  
- Size-driven “split `app.js`” programme  

---

## Success criteria

| Criterion | Measure |
| --------- | ------- |
| Discovery pack exists | START HERE, charter, plan, status, decisions, constraints, handover, briefing |
| S74-T-001 / S74-T-010 complete | Evidence-led discovery + refined domains |
| Binding constraints recorded | `S74-D03`…`S74-D05` + [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) |
| No runtime change under wrapper | Discovery/planning posture |
| 74A/B/C not opened | Recommendations only until operator approval |
| Sprint 73 untouched | No reopening of S73 implementation |

---

## Decision IDs

Sprint decisions: `S74-D##` in [decisions.md](decisions.md).  
Tasks: `S74-T-###` in [PLAN.md](PLAN.md).
