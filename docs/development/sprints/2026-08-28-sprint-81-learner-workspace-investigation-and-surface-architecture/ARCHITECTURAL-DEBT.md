# Sprint 81 — Architectural debt ledger

Debt discovered during Sprint 81 investigation. Definitions live in the
diagnostics that find each item; this file records **current status only**.

**Sprint 81 is CLOSED / COMPLETE (2026-08-28).** Outcome **B**. Entries below remain
**carried unknowns** unless marked parked/not pursued.

## Protected prior programme state (do not regress)

| Item | State |
| ---- | ----- |
| Sprint 80 | CLOSED — WORKING ALPHA |
| Sprint 81 | CLOSED — B shipped |
| D-014 | RESOLVED — [governance record](../../governance/D-014-test-suite-confidence-diagnostic.md) |
| First-class gate | `npm run test:first-class` → **339/339** at close |

## Open / carried

| ID | Finding | Found in | Notes |
| -- | ------- | -------- | ----- |
| **S81-D-001** | `diagnostic_review` is DLA/GAM structural commission binding only; **not** consumed by learner-renderer-vnext. Learner “diagnostic” UI is guided-checklist self-attestation, not runtime join on `covers_response_material_ids`. | T-001 | Hard constraint; R4 deliberately does not invent a consumer |
| **S81-D-002** | Response-part surfaces `matching`, `single_select`, `multi_select` recognised but unsupported; select-like UX exists only via assessment interactive (`assessment_selection`) | T-001 | Do not assume general select/match workspaces exist |
| **S81-D-003** | Ordering workspace implemented in vNext + certification fixtures; **absent** from DLA `RESPONSE_KINDS` — live Create→DLA emission frequency unknown | T-001 | Do not treat ordering as proven routine generative first-class output without further evidence |
| **S81-D-004** | Design Feedback / `feedback_pack` not on first-class CAI → assemble → vNext path | T-001 | Optional/historical step; Create prunes unless explicit feedback intent |
| **S81-D-005** | `multiple_answer_mcq` allowed in LD pack; interactive multi-select not proven in vNext (S80 honesty debt carries forward) | T-001 / S80 | Do not claim multi-select assessment interactivity as first-class |
| **S81-D-006** | `explanatory_note` listed in DLA teaching-only materials but absent from vNext `MATERIAL_RENDERER_TYPES` | T-001 | Commission/render vocabulary mismatch; unknown live emission |
| **S81-D-007** | Dual vocabulary: DLA `response_kind` vs runtime `data-workspace-kind` — joined by heuristics only; renderer does not branch on `response_kind` | T-001 | Relevant to any later surface/mapping design |

## Parked / not pursued (intentionally rejected alternatives)

| ID | Finding | Disposition |
| -- | ------- | ----------- |
| **S81-P-001** | R3 primary (read-only production in Check) | **PARKED / NOT PURSUED** — R4 selected ([T-006](S81-T-006-revision-co-access-design-validation-r3-vs-r4.md)) |
| **S81-P-002** | R5 dual-pane / fixed multi-column review | **PARKED / NOT PURSUED** — a11y/reflow risk; not shipped |
| **S81-P-003** | T5 table replacement / C3 new compose family | **PARKED / NOT PURSUED** — no evidence case in S81 |
| **S81-P-004** | Criterion→field/cell mapping; free-text/table diagnostic engine; surface-family architecture | **PARKED / NOT PURSUED** — rejected by investigation + S81-D02 |

## Resolved in Sprint 81

| ID | Finding | Resolution |
| -- | ------- | ---------- |
| **S81-R-001** | Revision/self-review co-access (N1/N4) without new surface family | Shipped R1 asymmetric + R4 accompaniment ([T-007](S81-T-007-implement-r1-task-check-navigation.md), [T-008](S81-T-008-implement-r4-revision-criterion-accompaniment.md)); operator-accepted |
