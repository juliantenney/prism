# Sprint 82 — Architectural debt ledger

Debt relevant to Sprint 82 scope. Definitions live in diagnostics; this file records **current status only**.

**Sprint 82 is CLOSED / COMPLETE (2026-09-02).** Alpha development complete — see [S82-D04](decisions.md#s82-d04--alpha-development-complete).

## Protected prior programme state (do not regress)

| Item | State |
| ---- | ----- |
| Sprint 80 | CLOSED — WORKING ALPHA |
| Sprint 81 | CLOSED — B shipped |
| Sprint 82 | CLOSED — alpha milestone recorded |
| D-014 | RESOLVED — [governance record](../../governance/D-014-test-suite-confidence-diagnostic.md) |
| First-class gate | `npm run test:first-class` → **339/339** |
| Gate 1 modality | COMPLETE — [record](../../governance/semantic-learner-input-modality-gate-1.md) |

## Sprint 82 resolved in sprint

| ID | Finding | Notes |
| -- | ------- | ----- |
| **S82-D-001** | `ResponsePart.inputModality` propagation | **RESOLVED (G2B)** |
| **S82-D-002** | Maths `text_entry` interaction gap | **ADDRESSED (alpha)** — MathLive ([G2B](S82-G2B-production-hardening.md)) |
| **S82-D-003** | Gate 2 treatment choice | **RESOLVED** — A GO ALPHA MATHLIVE ([S82-D02](decisions.md#s82-d02--gate-2a-outcome-go-alpha-mathlive)) |
| **S82-D-004** | MathJax learner-package CDN/offline dependency | **ADDRESSED** — local MathJax packaging for offline exports (Sprint 82 close) |
| **S82-D-005** | Maths editor dependency | **RESOLVED (G2B)** — `mathlive@0.110.0` in `lib/mathlive/` |

## Carried from Sprint 81 (backlog unless encountered)

| ID | Finding | Notes |
| -- | ------- | ----- |
| S81-D-001…D-007 | See [S81 ARCHITECTURAL-DEBT](../2026-08-28-sprint-81-learner-workspace-investigation-and-surface-architecture/ARCHITECTURAL-DEBT.md) | Post-alpha backlog |

## Pre-S82 closed (not active)

| Item | Status |
| ---- | ------ |
| Graphics material-role grounding | **CLOSED** — observe in normal use only |

## Explicitly deferred post-alpha (preserved — not alpha blockers)

Historical notes only — **canonical planning authority:** [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md).

- Historical **RC3–RC8** full-suite residue — [D-014](../../governance/D-014-test-suite-confidence-diagnostic.md) (not a planning programme)  
- Future maths capabilities (mixed prose+math; per-cell table maths; CAS) — [PB-M-001](../../../backlog/PRODUCT-BACKLOG.md#pb-m-001--future-maths-capabilities)  
- Significant post-alpha candidates include Expository Resource ([PB-FA-011](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource)) — not automatic next work  
- Sprint 81 debt S81-D-001…D-007 remains in the [S81 ledger](../2026-08-28-sprint-81-learner-workspace-investigation-and-surface-architecture/ARCHITECTURAL-DEBT.md) (not promoted to product backlog)  

Former PB-FA-008 Slideshow-as-architecture-test is **superseded**; Presentation remains a lightweight idea only.

## Engineering record — withdrawn finding

The **Effective Feedback Workshop 90-vs-60 Learning Sequence defect** is **not** retained as open debt. Commissioned duration was **60 minutes**; LS was correct. Prior diagnosis used a synthetic fixture — see [SPRINT-82-CLOSURE.md](SPRINT-82-CLOSURE.md) §2.5. Generic LS duration compliance validation remains as **contract enforcement only**.
