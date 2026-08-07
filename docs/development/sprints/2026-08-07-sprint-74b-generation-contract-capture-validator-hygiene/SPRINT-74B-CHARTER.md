# Sprint 74B — Charter

**Sprint:** 74B — Generation-contract & capture-validator hygiene  
**Status:** **OPEN** (2026-08-07)  
**Opened:** 2026-08-07  
**Type:** Implementation sprint  
**Parent programme:** Sprint 74 — Architecture Consolidation and Rationalisation  
**Start here:** [SPRINT-74B-START-HERE.md](SPRINT-74B-START-HERE.md)  
**Domain authority:** [S74-T-010 Domain B](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md#domain-b--generation-contract--capture-validator-hygiene-recommended-sprint-74b)  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Opening decision:** [S74B-D01](decisions.md#s74b-d01-open-sprint-74b-for-generation-contract--capture-validator-hygiene)  
**Backlog alignment:** Partial [PB-S-004](../../../backlog/PRODUCT-BACKLOG.md) (duplicate/legacy pathways — generation surfaces only)

---

## Mission

Reduce **dead or dual generation surfaces** (deprecated prompt builders, legacy capture validators, duplicate contract/transform ownership) while preserving supported prompt-generation behaviour and leaving the Authoring learner-export path unchanged.

Governing principle: **one definitive owner per established generation responsibility** (`S74-D07`) — removal or consolidation follows **ownership proof**, not zero-call-site proof alone.

## Target state

- Definitive ownership documented for prompt generation, generation contracts, capture validation, and compose / partial roles.  
- Duplicate or “last writer” paths identified and classified before modification.  
- Obsolete or duplicate surfaces removed or consolidated only with evidence and focused regression coverage.  
- Supported builders and prompt text for live step families remain stable unless explicitly accepted with fixtures.  
- Authoring Preview / HTML / ZIP / Open behaviour unchanged (Sprint 74A sole vNext path intact).  
- Active documentation describes definitive generation ownership — no plausible-but-wrong alternative paths.

## Problem statement

Generation logic still carries `@deprecated` prompt wrappers, legacy capture validators that always pass, and overlapping compose / partial contract surfaces. Architectural ambiguity can arise from **duplicate ownership inside the current supported path**, not only from obsolete implementations (Sprint 74A lesson). Maintainer confusion and silent prompt or ownership drift are the hazards.

## Goals (ordered)

1. **Inventory** generation ownership and duplicate paths (`S74B-T-010`).  
2. **Document** compose vs partial contract roles before any merge (`S74B-T-020`).  
3. **Plan** evidenced removals and consolidations from the inventory (`S74B-T-030`).  
4. **Execute** narrow removal/consolidation slices with focused tests (`S74B-T-040`).  
5. **Verify** hygiene outcome and close when ACs are evidenced (`S74B-T-050`).

## Supported product paths affected

Create Workflow / Run prompt assembly; Prompt Studio where it shares builders. **Authoring learner export is out of scope** — remains sole vNext from Sprint 74A.

## Scope

- Generation ownership and duplicate-path inventory (mandatory first)  
- `@deprecated` prompt helpers and call sites in `app.js` / contracts  
- Legacy capture-validator shims  
- Relevant `lib/ld-*-contract.js` and compose vs partial modules  
- Documentation of contract ownership  
- Focused generation/contract test updates protecting the definitive path  
- Evidence-led removal or consolidation per [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)

## Explicit non-scope

- Learner-renderer-vNext internals; Authoring export-path changes  
- Pedagogy redesign; domain pack content rewrites  
- Forced compose/partial code merge in the first slice (docs-only first)  
- Prompt Library IndexedDB model changes  
- Workflow Resources persistence / orphan cleanup  
- Legacy HTML renderer work  
- Repository / fixture / scratch hygiene (**Sprint 74C**)  
- Broad UI–state pathway rewrite (full PB-S-004) except a single proven duplicate blocking 74B AC  
- Size-driven `app.js` split; schema version changes; schema SSOT relocation  
- Opening Sprint 74C  

## Binding architectural constraints

**Do not duplicate.** Inherit:

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) (`S74-D03`…`S74-D05`, **`S74-D07`**)

**Do not duplicate.** Inherit working practice from:

[ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)

## Relationship to Sprint 74

Sprint 74 remains the governing programme wrapper. Sprint 74A (**COMPLETE / Closed**) delivered sole vNext learner export. Sprint 74B implements Domain B from [S74-T-010](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md). Sprint 74C remains **not opened**.

## Success / acceptance criteria

| ID | Criterion |
| -- | --------- |
| AC-01 | Generation ownership and duplicate-path inventory is complete **before** any removal or consolidation |
| AC-02 | Deprecated prompt helpers and legacy capture validators are inventoried with callers, owners, and classification |
| AC-03 | Removals and consolidations follow **ownership proof** — not zero-call-site proof alone |
| AC-04 | Supported prompt builders and generation behaviour for live step families remain unchanged unless explicitly accepted with fixtures |
| AC-05 | Focused contract/generation suites remain green (supporting evidence) |
| AC-06 | Authoring learner-export behaviour is unchanged (sole vNext path from 74A) |
| AC-07 | Compose vs partial contract **roles** are documented before any code merge |
| AC-08 | Node-based tests are labelled supporting evidence; browser-loaded prompt paths checked before deleting “unused” surfaces |
| AC-09 | Static deployment and browser-only runtime remain intact |
| AC-10 | Active documentation describes definitive generation ownership |
| AC-11 | No Sprint 74C work, export-path redesign, or pedagogy redesign enters the sprint |
| AC-12 | Residue sweep accounts for runtime, tests, fixtures, docs, and comments after each removal slice |
| AC-13 | Engineering Disciplines are inherited from the programme document — not duplicated inconsistently in the pack |

Domain B outline criteria from S74-T-010: **AC-B1…AC-B4** map to AC-01, AC-02, AC-03/AC-05, AC-06 respectively.

## Decision / task IDs

- Decisions: `S74B-D##` in [decisions.md](decisions.md)  
- Tasks: `S74B-T-###` in [PLAN.md](PLAN.md)  

## Risks (from S74-T-010)

| Risk | Mitigation |
| ---- | ---------- |
| Silent prompt drift | Call-path tracing; focused golden prompts |
| Silent ownership drift | Ownership inventory first; behavioural invariants; no merge without ownership matrix |
| Accidental export-path touch | Explicit non-scope; spot-check Authoring export unchanged |
| Compose/partial premature merge | Docs-only first; stop condition in charter |
