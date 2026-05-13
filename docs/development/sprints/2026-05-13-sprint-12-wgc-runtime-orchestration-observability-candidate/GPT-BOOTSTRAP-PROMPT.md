# GPT bootstrap — Sprint 12 candidate (WGC/runtime orchestration observability)

**Use this prompt to start a fresh chat** for Sprint 12 preparation work only. This pack is for `2026-05-13-sprint-12-wgc-runtime-orchestration-observability-candidate`.

**Pack path:** `docs/development/sprints/2026-05-13-sprint-12-wgc-runtime-orchestration-observability-candidate/`

---

## 1. Current status and boundary

- Sprint 11 is closed: `docs/consolidation/sprint-11-closure.md`.
- Sprint 12 is candidate/prep only: `docs/consolidation/sprint-12-candidate-prep-note.md`.
- Sprint 12 is not approved and not started.
- No implementation is allowed before written pass scope is explicitly accepted.

This pack supports continuity and preparation only; it does not authorize code, fixture, test, or domain-pack changes.

---

## 2. Candidate focus

Primary candidate focus is deferred WGC/runtime orchestration observability, especially PA-WGC coverage.

Keep completed/deferred/future separation explicit:

- Completed: Sprint 11 closure channels and pinned baseline behaviours.
- Deferred: WGC/runtime orchestration coverage not completed in Sprint 11.
- Future candidate: Sprint 12 prep options only, pending approval.

---

## 3. Read-first order

1. `docs/consolidation/sprint-11-closure.md`
2. `docs/consolidation/sprint-12-candidate-prep-note.md`
3. `docs/consolidation/sprint-10-contract-audit.md` with focus on WGC/runtime sections used as evidence map
4. `workflowGenerationContext.js`
5. `app.js` WGC/prompt assembly call sites
6. `domains/domain-manifest.json` and relevant domain files

Suggested Sprint 10 audit focus lanes for this prep:

- WGC responsibility map and ordering semantics
- prompt assembly inventory touching orchestration channels (including PA-WGC references)
- persistence/import/export compatibility touchpoints that can influence orchestration assertions

---

## 4. Proposal-only first pass scope (not approved)

Proposed first pass:

- PA-WGC deterministic excerpt coverage
- stubbed `fetch`
- manifest/file ordering assertions
- platform -> domain -> brief sequencing assertions
- section-header/file-path assertions

Explicit pass-proposal non-goals:

- no prompt rewrite
- no domain-pack edits
- no WGC behaviour changes
- no semantic rationalisation

---

## 5. Guardrails while unapproved

- Do not imply Sprint 12 is active.
- Do not mark any pass as approved.
- Do not implement code/fixtures/tests until written scope acceptance.
- Keep evidence-first framing anchored to Sprint 10 audit and Sprint 11 closure.

---

## Copy-paste block for the assistant

You are preparing Sprint 12 continuity work only for PRISM. Sprint 11 is closed (`docs/consolidation/sprint-11-closure.md`). Sprint 12 is candidate/prep only (`docs/consolidation/sprint-12-candidate-prep-note.md`) and is not approved or started. Do not implement code, fixtures, tests, domain-pack edits, or semantic rationalisation. Use Sprint 10 audit (`docs/consolidation/sprint-10-contract-audit.md`) as the evidence map, with emphasis on WGC/runtime orchestration coverage (especially PA-WGC). Any first pass scope is proposal only until written acceptance. Keep completed/deferred/future-candidate separation explicit.

---

## Review log

- **2026-05-13** — Sprint 12 bootstrap prompt created for candidate/prep-only continuity; no implementation authorized.
