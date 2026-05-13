# Sprint Context

**Sprint:** Sprint 12 — WGC/runtime orchestration observability (candidate)

**Status:** **Candidate/prep only**. **Not approved. Not started.**

**Upstream:** Sprint 11 closure `docs/consolidation/sprint-11-closure.md`; Sprint 12 prep note `docs/consolidation/sprint-12-candidate-prep-note.md`; Sprint 10 canonical evidence map `docs/consolidation/sprint-10-contract-audit.md` (`3bd6d10`).

**Scope posture:** preparation and continuity only. No implementation before written pass scope acceptance.

**Non-goals while unapproved:** no production code changes, no fixture/test changes, no semantic rationalisation, no domain-pack edits.

## Candidate focus (preparation)

- Deferred WGC/runtime orchestration coverage from Sprint 11.
- Priority candidate lane: PA-WGC deterministic observability.
- Secondary candidate lanes: bounded runtime/prompt assembly slices and persistence dual-save compatibility checks (as prep direction only).

## Read-first order

1. `docs/consolidation/sprint-11-closure.md`
2. `docs/consolidation/sprint-12-candidate-prep-note.md`
3. `docs/consolidation/sprint-10-contract-audit.md` (WGC/runtime sections used as evidence map)
4. `workflowGenerationContext.js`
5. `app.js` WGC/prompt-assembly call sites
6. `domains/domain-manifest.json` plus referenced domain files as needed

## Proposal-only first pass (not approved)

Proposed first pass target: **PA-WGC deterministic excerpt coverage** with:

- stubbed `fetch`
- deterministic manifest and file ordering
- platform -> domain -> brief sequencing checks
- section-header and file-path assertions

Pass proposal non-goals:

- no prompt rewrite
- no domain-pack edits
- no WGC behaviour changes

## Review log

- **2026-05-13** — Sprint 12 context created as candidate/prep only; no chartered pass approved or started.
