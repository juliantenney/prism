# Sprint 82 — Architectural debt ledger

Debt relevant to Sprint 82 scope. Definitions live in diagnostics; this file records **current status only**.

**Sprint 82 is OPEN (2026-09-01).**

## Protected prior programme state (do not regress)

| Item | State |
| ---- | ----- |
| Sprint 80 | CLOSED — WORKING ALPHA |
| Sprint 81 | CLOSED — B shipped |
| D-014 | RESOLVED — [governance record](../../governance/D-014-test-suite-confidence-diagnostic.md) |
| First-class gate | `npm run test:first-class` → **339/339** (last reported) |
| Gate 1 modality | COMPLETE — [record](../../governance/semantic-learner-input-modality-gate-1.md) |

## Sprint 82 active / in-scope

| ID | Finding | Notes |
| -- | ------- | ----- |
| **S82-D-001** | `ResponsePart.inputModality` propagation | G2A scaffolding in place; **G2B** hardens for production |
| **S82-D-002** | Maths `text_entry` interaction gap | **ADDRESSED (alpha)** — MathLive accepted ([S82-D02](decisions.md#s82-d02--gate-2a-outcome-go-alpha-mathlive)); G2B ships |
| **S82-D-003** | Gate 2 treatment choice | **RESOLVED** — A GO ALPHA MATHLIVE ([S82-D02](decisions.md#s82-d02--gate-2a-outcome-go-alpha-mathlive)) |
| **S82-D-004** | MathJax learner-package CDN/offline dependency | Known debt; not Sprint 82 redesign blocker |
| **S82-D-005** | Maths editor dependency | **RESOLVED (spike)** — `mathlive@0.110.0` in `lib/mathlive-spike/`; G2B production packaging |

## Carried from Sprint 81 (backlog unless encountered)

| ID | Finding | Notes |
| -- | ------- | ----- |
| S81-D-001…D-007 | See [S81 ARCHITECTURAL-DEBT](../2026-08-28-sprint-81-learner-workspace-investigation-and-surface-architecture/ARCHITECTURAL-DEBT.md) | Unchanged unless Sprint 82 work touches them |

## Pre-S82 closed (not active)

| Item | Status |
| ---- | ------ |
| Graphics material-role grounding | **CLOSED** — observe in normal use only |

## Explicitly deferred beyond Sprint 82

- Table per-cell `input_modality: math`  
- Rich mixed prose+math editor  
- CAS / symbolic correctness  
- Alpha hardening export-import lifecycle programme  
- Slideshow / output extensibility implementation  
