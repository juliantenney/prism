# Sprint 74C — START HERE

**Sprint:** 74C — Repository Hygiene & Historical Residue Rationalisation  
**Status:** **OPEN** (planning only)  
**Opened:** 2026-08-07  
**Type:** Repository hygiene sprint (final narrowed Sprint 74 phase)  
**Parent:** [Sprint 74](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/SPRINT-74-START-HERE.md) — **OPEN**  
**Charter:** [SPRINT-74C-CHARTER.md](SPRINT-74C-CHARTER.md)  
**Opening:** [S74C-D01](decisions.md#s74c-d01-open-sprint-74c-for-repository-hygiene--historical-residue-rationalisation)  
**Scope authority:** [S74-programme-post-74B-review.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-programme-post-74B-review.md) — **narrowed R1**  
**Programme principle:** [S74-D07](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d07--one-definitive-codebase-around-established-functionality) · [S74-D09](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement)  
**Engineering disciplines:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) *(inherited — not duplicated)*

---

## Mission

Leave the repository **clean, well-classified, and low-noise** before Sprint 75 UI work.

This is **not** an architectural redesign sprint.

## Governing principle

> If removing something requires reasoning about current product behaviour, it does not belong in 74C.

## Hard constraints

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md)

## Scope / non-scope (summary)

| In | Out |
| -- | --- |
| Root scratch, `tmp-*`, dumped HTML/JSON | PB-S-001 fixture enrichment |
| `_archive/` classification | Broad-suite repair |
| Broken/obsolete probes & tools | Runtime / product behaviour |
| Historical residue classification | Orchestration, prompts, capture, validation, assemble, render, UI |
| Retain/delete/archive decisions | WR orphans (PB-R-008); PB-FA-004 |
| Repository cleanliness | Schema / pedagogy redesign; Sprint 75 |

## Current task

**S74C-T-040** — Execute approved hygiene (**Done**).

**Next:** **S74C-T-050** — Verify and close (**Not started**).

## Reading order

1. [S74C-T-040-repository-hygiene-execution-evidence.md](S74C-T-040-repository-hygiene-execution-evidence.md)  
2. [STATUS.md](STATUS.md) · [PLAN.md](PLAN.md)  
3. [SPRINT-74C-CHARTER.md](SPRINT-74C-CHARTER.md)  

## Immediate next action

When authorised: begin **S74C-T-050**. Do **not** reopen hygiene slices. Do **not** open Sprint 75 without separate authority.
