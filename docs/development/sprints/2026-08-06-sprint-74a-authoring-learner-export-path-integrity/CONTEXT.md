# Sprint 74A — Context

**Status:** **OPEN** (opened 2026-08-06)  
**Role:** Durable context for definitive learner-renderer codebase work  
**Parent:** Sprint 74 wrapper — link discovery; do not rewrite factual findings  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Sole renderer:** [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer)

---

## Why this sprint exists

Sprint 74A establishes **one definitive learner-renderer implementation** around existing Authoring → export functionality. vNext is the architecture. The previous renderer is **obsolete**. There is no product requirement to retain it as Compatibility. After evidence confirms coverage, remove it and its exclusive supporting surfaces.

---

## Target architecture

| Kind | State |
| ---- | ----- |
| **Definitive** | vNext — Authoring → Preview / HTML / ZIP / Open in New Tab |
| **Obsolete** | Previous renderer — inventoried (T-040), removed (T-045) |
| **Shared helpers** | Retain/move only with evidence of current responsibility |

Do not use **Compatibility** for the old renderer except historically (e.g. T-010-era classification).

---

## Binding constraints

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) — browser-only; static deployment; one definitive implementation (`S74-D07`); `app.js` by ownership.

---

## Key surfaces

| Surface | Role |
| ------- | ---- |
| `lib/learner-renderer-vnext/*` + `learner-renderer-vnext-browser.js` | Definitive renderer (source + generated artefact) |
| `app.js` page-export pipeline | Converge exclusively on vNext; remove obsolete branches |
| Authoring renderer select / version state | Remove (T-045) |
| Obsolete structured HTML page renderer | Remove when T-040 proves no remaining responsibility |
| Export architecture docs | Sole-renderer narrative by T-050 |

---

## Durable facts from S74A-T-010 (historical)

At audit time, Authoring defaulted to vNext while the old renderer remained selectable (then labelled Compatibility). Evidence report retained with **supersession** to sole-implementation / removal target (`S74A-D02`).

---

## Verification posture

- **T-030** — pre-removal production-browser + Node-based baseline  
- **T-050** — post-removal sole-renderer production-browser verification  
- Node-based tests = supporting evidence only  

---

## Predecessor links (only)

| Kind | Link |
| ---- | ---- |
| Discovery | [S74-T-001](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-001-codebase-rationalisation-discovery.md) |
| Domain refinement | [S74-T-010](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md) |
| vNext architecture | [learner-renderer-vnext.md](../../../architecture/learner-renderer-vnext.md) |
| PB-FA-003 | [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-003--pipeline-integrity) |
