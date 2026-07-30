# Sprint 70 Checklist

## Pre-sprint checks

- [ ] Confirm active branch descends from recovery baseline `6853376`.
- [ ] Confirm production code/tests/fixtures are equivalent to recovery baseline except explicitly reviewed Sprint 70 slices.
- [ ] Confirm locked fixture exists: `tests/fixtures/page-render/hetero-dup-investigation-source.json`.
- [ ] Confirm fixture hash equals `df7cc025ece109280c46e0422a9e3cb99e34c945929dba92b80987eb678e62f5`.
- [ ] Confirm no pending production changes unrelated to Sprint 70 slices.
- [ ] Review `SPRINT-70-DESIGN-SPEC.md` unresolved questions.
- [ ] Approve slice order and commit boundaries.
- [ ] Initialize `SPRINT-70-SLICE-LOG.md` entry for active slice.

## Per-slice entry criteria

- [ ] Prior slice committed cleanly.
- [ ] Prior slice regression gate is green.
- [ ] Scope for current slice is explicit (in-scope/out-of-scope listed).
- [ ] Test additions for this slice are identified before coding.

## Per-slice completion criteria

- [ ] Slice goal achieved with smallest reasonable code surface.
- [ ] Dedicated tests added and passing.
- [ ] No hidden side-effects outside slice scope.
- [ ] Commit message references slice number and purpose.
- [ ] Rollback path is clear.

## Regression requirements (each slice)

- [ ] `npm run pretest:learner-renderer-vnext`
- [ ] `node --test tests/hetero-dup-material-dom-identity.test.js`
- [ ] `node --test tests/utility-utilities-page-export-pipeline.test.js`
- [ ] Relevant Sprint 70 slice tests (explicit file list, no wildcard-only commands)
- [ ] Additional hook/affordance suites when placement logic changes

## Browser verification requirements

- [ ] Utilities preview still renders full page with visuals absent.
- [ ] Knowledge Summary text remains visible in all failure states.
- [ ] No duplicate visual or material DOM identities.
- [ ] Activity A1-A6 paths still render in known-good regression pages.
- [ ] Alt text is meaningful and source-grounded.
- [ ] Captions are present where additional explanation is needed.
- [ ] No essential learning information is available only in visuals.
- [ ] Visual distinctions do not rely on color alone.
- [ ] Visual text remains readable with suitable contrast.

## Documentation update requirements

- [ ] Update decisions log when a new architectural choice is made.
- [ ] Update context file with durable new constraints/contracts only.
- [ ] Update test plan if a new gate or fixture policy is introduced.
- [ ] Record slice outcome and residual risk.
- [ ] Update `SPRINT-70-SLICE-LOG.md` with commit, tests, browser checks, and rollback point.

## Final Sprint 70 completion criteria

- [x] Final handover/closeout docs updated — [SPRINT-70-CLOSURE.md](SPRINT-70-CLOSURE.md) (2026-07-30).
- [x] Programme QA methodology outcomes and Sprint 71 decisions recorded.
- [x] Successor Sprint 71 pack created and marked Active.
- [ ] All planned visual-planning slices 1–10 completed or explicitly deferred with rationale — **unresolved at close** (slice log not fully reconciled; E1–E6 recorded complete).
- [ ] End-to-end visual-planning acceptance scenarios signed off — **not claimed** in closure (gap).
- [ ] Regression suite remains green on recovered baseline tests — **not re-certified in closure docs**.
- [ ] No baseline safety constraint violated — treat as ongoing engineering invariant, not closure-attested.

**Sprint 70 is Closed** on the QA-methodology outcome track. Remaining visual-planning ledger gaps are documentation/engineering follow-ups, not Sprint 71 primary work.
