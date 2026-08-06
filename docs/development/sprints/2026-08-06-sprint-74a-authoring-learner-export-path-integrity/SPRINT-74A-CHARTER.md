# Sprint 74A — Charter

**Sprint:** 74A — Authoring → Learner Export Path Integrity  
**Status:** **OPEN** (2026-08-06)  
**Opened:** 2026-08-06  
**Type:** Implementation sprint  
**Parent programme:** Sprint 74 — Architecture Consolidation and Rationalisation  
**Start here:** [SPRINT-74A-START-HERE.md](SPRINT-74A-START-HERE.md)  
**Domain authority:** [S74-T-010 Domain A](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md) *(original inventory posture; superseded as target by operator decisions)*  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Opening decision:** [S74A-D01](decisions.md#s74a-d01-open-sprint-74a-for-authoring--learner-export-path-integrity)  
**Sole-renderer decision:** [S74A-D02](decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer)  
**Backlog alignment:** [PB-FA-003](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-003--pipeline-integrity)

---

## Mission

Establish **vNext as Prism’s sole learner-renderer implementation**, remove the **obsolete** renderer and its redundant paths, and verify that all existing learner-export functionality remains stable through the **production browser path**.

Governing principle: **one definitive implementation in the codebase for each established responsibility** (`S74-D07`) — not merely one supported path in documentation.

## Target state

- vNext is the sole learner-renderer architecture available in the active codebase.  
- The previous renderer is **obsolete / superseded** — not retained as Compatibility.  
- No user-facing renderer selector; no obsolete page-rendering branch; no obsolete fallback.  
- No obsolete parallel renderer implementation, exclusive helpers, exclusive tests/fixtures, or docs presenting multiple renderer choices.  
- Authoring Preview, HTML, learner ZIP, Open in New Tab, and required resource rendering remain intact via vNext.  
- Static deployment and browser-only runtime remain binding.  
- Node remains development/test tooling only.

## Problem statement

Authoring still exposes obsolete renderer selection and page-export branches that create a plausible-but-wrong alternative to vNext. Documentation through T-010 labelled that alternative as Compatibility under a prior posture. Operator direction requires a **definitive codebase**: once evidence confirms required functionality exists in vNext, remove the obsolete renderer — do not preserve it indefinitely.

## Goals (ordered)

1. Secure vNext generated browser artefact integrity (foundation for definitive loading).  
2. Record a definitive production-browser **baseline** of existing learner-export behaviour.  
3. Inventory obsolete-renderer responsibilities and produce an **exact removal plan**.  
4. Remove the obsolete renderer implementation and exclusive supporting surfaces.  
5. Verify the single-renderer end state on the production browser path and close when ACs are evidenced.

## Supported product spine

```text
Create Workflow → My Workflows → Authoring → Assemble → Preview (vNext)
  → HTML / learner ZIP / Open in New Tab
```

*(Single renderer path — obsolete renderer removed from the active tree.)*

## Scope

- Sole / definitive learner-renderer architecture (`S74A-D02`)  
- Generated browser artefact rebuild discipline  
- Pre-removal production-browser baseline and post-removal verification  
- Obsolete-renderer responsibility inventory and exact removal plan  
- Removal of selector, version state used only for obsolete selection, branches, fallbacks, implementation, exclusive helpers/globals/scripts/tests/fixtures/docs  
- Narrow renames of misleading terminology where required for clarity  
- Focused test updates protecting the single definitive path  

## Explicit non-scope

- Indiscriminate deletion without responsibility evidence  
- Retaining dead code behind flags, comments, hidden selectors, or unreachable branches  
- Creating a second compatibility module or in-tree archive of the obsolete renderer  
- Unrelated cleanup; size-driven `app.js` split; broad restructuring  
- Schema version changes; schema SSOT relocation  
- Design Page compose/partial consolidation  
- Prompt Studio / Prompt Library product changes  
- Deprecated generation-contract cleanup (**74B**)  
- Workflow Resources orphan cleanup; PB-FA-004  
- Repo / fixture / scratch / archive hygiene (**74C**)  
- Renaming `utilities*` IDs wholesale to `authoring*`  
- Opening Sprint 74B or 74C  

## Binding architectural constraints

**Do not duplicate.** Inherit:

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`, **`S74-D07`**)

Preferred terms: definitive implementation · sole learner renderer · single renderer path · one definitive codebase · obsolete / superseded renderer · browser runtime · production browser path · generated browser artefact · Node-based test evidence.

Avoid calling the old renderer **Compatibility** except when referring historically to its pre-`S74A-D02` classification.

## Relationship to Sprint 74

Sprint 74 remains the governing programme wrapper. Sprint 74A applies `S74-D07` to learner rendering via `S74A-D02`. Discovery records that recommended inventory-only / Compatibility retention are preserved as history and marked superseded. 74B and 74C remain **not opened**.

## Success / acceptance criteria

| ID | Criterion |
| -- | --------- |
| AC-01 | vNext is documented as Prism’s sole learner renderer |
| AC-02 | No user-facing renderer selector or renderer-version choice remains |
| AC-03 | All learner page Preview, HTML, ZIP and Open-in-New-Tab actions route exclusively through vNext |
| AC-04 | The vNext generated browser artefact is reproducible, current and verification-gated |
| AC-05 | The complete existing learner-export path is verified through the production browser path |
| AC-06 | Every obsolete renderer invocation and responsibility is inventoried before removal |
| AC-07 | The obsolete learner-renderer implementation is removed from the active codebase |
| AC-08 | Obsolete renderer branches, fallbacks, globals, script loading and exclusive helpers are removed |
| AC-09 | Tests and fixtures that exist solely for removed renderer behaviour are removed or replaced with vNext coverage |
| AC-10 | Shared functionality is retained only where evidence shows it supports current behaviour and is assigned to a clear owner |
| AC-11 | Existing Authoring and learner-export functionality remains stable |
| AC-12 | Node-based tests remain supporting evidence rather than deployment proof |
| AC-13 | Static deployment and browser-only runtime remain intact |
| AC-14 | Documentation and code present one definitive renderer architecture with no plausible obsolete alternative |
| AC-15 | No unrelated 74B/74C work, schema redesign or size-driven `app.js` restructuring enters the sprint |

## Decision / task IDs

- Decisions: `S74A-D##` in [decisions.md](decisions.md)  
- Tasks: `S74A-T-###` in [PLAN.md](PLAN.md)  
