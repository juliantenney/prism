# Sprint 56E Backlog

## Workstream 0 — Contract Extraction (first)
- [ ] Analyze current production Design Page prompt as source requirements only.
- [ ] Extract actual responsibilities independent of defensive wording/duplication/history.
- [ ] Publish contract baseline in `design-page-contract.md`.
- [ ] Review extracted invariants/failure conditions for testability.

## Workstream 1 — Schema Finalisation
- [ ] Reconcile schema against `design-page-contract.md`.
- [ ] Finalize required fields and invariants as enforceable schema + audit checks.
- [ ] Define schema examples for pass/fail cases.

## Workstream 2 — Minimal Prompt Refactor
- [ ] Reconcile minimal prompt against `design-page-contract.md`.
- [ ] Keep prompt minimal and responsibility-led.
- [ ] Add complexity only where a failed invariant requires it.

## Workstream 3 — Validation and Audit
- [ ] Execute external validation workflow on exported artefacts.
- [ ] Run checks for activity/material/order/episode/schema/self-containment.
- [ ] Detect false-positive validation claims.

## Workstream 4 — Comparison and Decision
- [ ] Compare minimal implementation vs current Design Page on same workflow outputs.
- [ ] Record deltas in fidelity, reliability, and maintainability.
- [ ] Produce recommendation: replace current implementation, iterate, or investigate further.
