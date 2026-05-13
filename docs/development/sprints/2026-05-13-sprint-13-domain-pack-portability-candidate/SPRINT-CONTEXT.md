# Sprint Context

**Role:** authoritative for **this pack only** (candidate/prep continuity).

**Candidate/prep only. No Sprint 13 umbrella approval implied.**

**Sprint:** Sprint 13 — Domain-pack portability & manifest-driven configuration (**candidate**)

## Sprint 13 status wording

**Sprint 13 is candidate/prep only — not approved, not started.**

When implementation is explicitly chartered, record it in a consolidation closure or charter doc; until then, treat all Sprint 13 work as **preparation, audit, and documentation planning** only.

## Upstream / continuity

- **Sprint 12 — first-pass structural observability (Phases A–E):** **closed** — `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md` (**do not reopen**).
- **Broader Sprint 12** prep/history: `docs/consolidation/sprint-12-candidate-prep-note.md` (candidate framing; not a blanket approval of Sprint 13).
- **Sprint 11:** closed — `docs/consolidation/sprint-11-closure.md`.
- **Evidence map:** `docs/consolidation/sprint-10-contract-audit.md` (orienteering for domain/orchestration surfaces).

**Scope posture:** preparation and continuity **unless and until** a written Sprint 13 first-pass is approved.

**Non-goals while candidate/prep:** no unsolicited production code changes, no domain-pack edits, no prompt rewrites, no persistence/import/export changes, no orchestration behaviour changes without charter.

## Candidate charter summary

See **`CHARTER-FIRST-PASS-SUMMARY.md`** in this folder for the bounded first-pass approval proposal (S13-07 + S13-01 primary; S13-02/S13-03 decision-gated; explicit deferred list).

**Purpose:** Reduce hardcoded domain assumptions in core; move toward manifest/domain-pack–owned configuration; support **General**, **Learning Design**, and **Research** as functioning **v1** packs; **avoid** broad architecture rewrite.

## Read-first order

1. `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`
2. `docs/development/current-state.md`
3. `docs/consolidation/sprint-12-candidate-prep-note.md`
4. `domains/domain-manifest.json`
5. `workflowGenerationContext.js`
6. `app.js` — domain selection, Workflow Factory, domain UI call sites
7. `domains/general/`, `domains/learning-design/`, `domains/research/` — relevant pack files (read-only in prep)

## Review log

- **2026-05-13** — Sprint 13 candidate context snapshot created (prep only).
