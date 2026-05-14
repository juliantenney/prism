# Current State Snapshot — Sprint 14 pack

**Role:** authoritative for **this pack only** (portable continuity).

**Canonical live source (outside this pack):** `docs/development/current-state.md` in the repository.

**Snapshots in this pack:** `context-files/current-state.md` (copy dated when the pack was built).

---

## Active sprint

- **Sprint 14 — Research Domain Runnable Maturity** — **implementation/verification** focus: make **Research** a **usable, trustworthy** runnable Workflow Factory domain. **Charter:** `context-files/sprint-14-charter.md`. **Map:** `context-files/sprint-14-index.md`.

---

## Completed prior work relevant to Sprint 14

- **General baseline-only** — Factory requires **Learning Design** or **Research**; General always-on in normalised lists — `docs/consolidation/sprint-13-general-alwayson-first-structured-domain-behaviour.md` §**Current v1** (see consolidation in repo; summary also in pack `context-files/current-state.md`).
- **Sprint 12** — first-pass structural observability (A–E) — **closed**; tests remain guardrails — `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`.
- **Sprint 13** — first-pass documentation + narrow Factory domain control tidy — **closed** — `docs/consolidation/sprint-13-index.md`.
- **Sprint 11** — fixture/regression foundations — **closed** — informs how to add tests when touching generation.

---

## Current known issues (starting register)

See **`context-files/sprint-14-current-known-issues.md`** and the concrete pack gaps in **`context-files/sprint-14-research-pack-baseline-audit.md`** (including **`objective_type: analysis`** missing from **`triggerRules`**, **`Generate Research Content`** missing from **`stepRoleAnchors`**, markdown **##** order vs **`canonicalSteps`**).

---

## Immediate next action

1. Open **`context-files/sprint-14-charter.md`** and confirm scope for the first implementation slice.
2. Pick **one** baseline-audit item or known-issue id; implement or document verification steps; add/adjust **tests** if behaviour changes.
3. Run **`node --test tests/*.test.js`** before considering the slice done.

**Implementation gate:** Do not start broad refactors; keep changes **Research-scoped** and **charter-aligned** unless the user explicitly widens scope in session.

---

## Review log

- **2026-05-14** — Pack `CURRENT-STATE.md` created for Sprint 14 portable context.
