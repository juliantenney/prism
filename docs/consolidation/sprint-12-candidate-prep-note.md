# Sprint 12 Candidate Preparation Note (Not Approved)

## Purpose

Capture candidate next-sprint preparation only, following Sprint 11 closure. This note does not approve or start Sprint 12.

## Completed / Deferred Context

- Completed in Sprint 11: BL/F-INT and PE deterministic regression foundations with local Node verification.
- Deferred from Sprint 11: WGC/runtime orchestration coverage and broader orchestration prompt-path coverage.

## Candidate Focus Areas (Preparation Only)

- WGC/runtime orchestration observability (largest currently uncovered contract surface).
- Prompt-assembly runtime slices that can detect orchestration drift without broad refactor.
- Persistence save-path compatibility checks where audit-identified divergence risk exists.

## Suggested Narrow Passes

- Pass A: WGC determinism and ordering surface
  - target: WGC section ordering, selected-domain ordering, and loaded file-list shape
  - objective: detect contract-surface drift in prompt context assembly
- Pass B: Runtime/design prompt assembly slices
  - target: bounded orchestration channels (for example `PA-DES-USER` plus one run lane)
  - objective: detect cross-channel drift beyond BL/F-INT and PE
- Pass C: Persistence dual-save compatibility checks
  - target: design-save vs Workflows gather-save field-preservation behaviour
  - objective: detect silent compatibility regressions without semantic migration

## Key Governance Risks

- Scope creep into semantic rationalisation under the label of fixture expansion.
- False confidence from single-channel assertions that miss parallel contract channels.
- Treating pinned awkward baseline behaviour as product intent rather than baseline observability.
- Silent contract changes without explicit charter/pass approval and contract table traceability.

## Recommended Sequencing

1. Confirm chartered pass scope and non-goals per pass.
2. Cover WGC/order/file-set first (largest remaining uncovered orchestration surface).
3. Add bounded runtime/design prompt-channel assertions.
4. Add persistence dual-save compatibility checks.
5. Reassess after coverage evidence; do not auto-authorize semantic contract changes.

## Approval Boundary

- Candidate/prep only.
- Not approved.
- Not started.
