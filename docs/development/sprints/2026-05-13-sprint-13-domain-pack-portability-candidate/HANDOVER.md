# Session Handover Snapshot

**Role:** authoritative for **this pack only** (candidate/prep continuity).

**Candidate/prep only. No Sprint 13 umbrella approval implied.**

**Canonical sources:** `docs/development/current-state.md`; `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`; `docs/consolidation/sprint-12-candidate-prep-note.md`

## Completed / closed (do not reopen)

- **Sprint 12 — first-pass structural observability (Phases A–E)** — **closed** — `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`

## Sprint 13 (this continuity pack)

**Status:** **Candidate/prep only** (not approved, not started as an umbrella program).

**Carried intent:** Domain-pack **portability** and **manifest-driven** configuration for **v1**; reduce **hardcoded** Learning Design / General / workflow-shape assumptions in **core** while keeping existing packs **functioning**; **avoid** broad architecture rewrite.

**Primary first-pass candidates (when/if chartered):** **S13-07** documentation (General, baseline, `alwaysOnDomains`, first-structured-domain behaviour); **S13-01** manifest-driven domain UI for **strict-parity**, clearly scoped controls.

**Decision-gated:** **S13-02** default domain rule; **S13-03** display-only hint neutralisation (non–prompt-facing proof required).

**Implementation gate:** No code, domain-pack edits, prompts, persistence, or orchestration behaviour changes until explicit written first-pass approval.

## Read-first order (Sprint 13 prep)

1. `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`
2. `docs/development/current-state.md`
3. `docs/consolidation/sprint-12-candidate-prep-note.md`
4. `domains/domain-manifest.json`
5. `workflowGenerationContext.js`
6. `app.js` — domain selection, Workflow Factory, domain UI call sites
7. `domains/general/`, `domains/learning-design/`, `domains/research/` — relevant files (read-only in prep)

## Explicitly deferred (prep pack default)

Starting artefact relocation; LD starting-point trio relocation; title-based domain injection replacement; `getGeneralFallbackBriefConfig` relocation; multi-domain brief merge; semantic prompt migration; broad `app.js` refactor; persistence/import/export migration; fallback/cache/`manifestPromise`/`textCache` work; **reopening Sprint 12 A–E**.

## Review log

- **2026-05-13** — Sprint 13 candidate handover snapshot created (prep only; no implementation approved).
