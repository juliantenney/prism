# Current State Snapshot

**Role:** authoritative for **this pack only** (portable continuity mirror).

**Candidate/prep only. No Sprint 13 umbrella approval implied.**

**Canonical source:** `docs/development/current-state.md`

## Sprint 13 continuity (this pack)

**Status:** **Sprint 13 — candidate/prep only — not approved — not started.**

**Focus:** Domain-pack **portability** and **manifest-driven configuration** for **v1** — reduce hardcoded domain coupling in core **without** a broad `app.js` rewrite; long-term goal: **drop-in domain packs** with minimal/no core changes (**not** claimed complete in any single pass).

**Sprint 12 boundary:** **Sprint 12 first-pass structural observability (A–E)** is **closed separately** — `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`. **Do not reopen** Sprint 12 A–E.

**Implementation gate:** No production code, domain-pack edits, prompt rewrites, persistence changes, or orchestration behaviour changes **under this prep-only pack** unless explicit written Sprint 13 first-pass approval supersedes this gate.

## References

- Sprint 12 first-pass closure: `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`
- Repo canonical current state: `docs/development/current-state.md`
- Sprint 12 candidate prep note: `docs/consolidation/sprint-12-candidate-prep-note.md`
- Bounded first-pass charter summary (this pack): `CHARTER-FIRST-PASS-SUMMARY.md`
- Bootstrap prompt (this pack): `GPT-BOOTSTRAP-PROMPT.md`

## Read-first order

1. `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`
2. `docs/development/current-state.md`
3. `docs/consolidation/sprint-12-candidate-prep-note.md`
4. `domains/domain-manifest.json`
5. `workflowGenerationContext.js`
6. `app.js` (domain selection / Factory / domain UI)
7. Domain packs: `domains/general/`, `domains/learning-design/`, `domains/research/` (as needed; read-only in prep)

## Review log

- **2026-05-13** — Sprint 13 portable current-state snapshot added for candidate/prep continuity only.
