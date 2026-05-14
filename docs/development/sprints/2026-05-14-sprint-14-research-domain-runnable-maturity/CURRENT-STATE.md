# Current State Snapshot — Sprint 14 pack

**Role:** authoritative for **this pack only** (portable continuity).

**Canonical live source (outside this pack):** `docs/development/current-state.md` in the repository.

**Snapshots in this pack:** `context-files/current-state.md` (refreshed **2026-05-14** consolidation pass).

---

## Active sprint

- **Sprint 14 — Research Domain Runnable Maturity** — **first implementation / verification slice documented** (2026-05-14): make **Research** a **usable, trustworthy** runnable Workflow Factory domain. **Charter:** `context-files/sprint-14-charter.md`. **Map:** `context-files/sprint-14-index.md`. **Closure register:** `context-files/sprint-14-current-known-issues.md` (**§§10–11** completed vs remaining; **E4.1**, **E4.3**, **E4.4**, **E4.5**, **I9.1** **mitigated**; **I9.2** **partially mitigated**).

---

## Completed prior work relevant to Sprint 14

- **General baseline-only** — Factory requires **Learning Design** or **Research**; General always-on in normalised lists — `docs/consolidation/sprint-13-general-alwayson-first-structured-domain-behaviour.md` §**Current v1** (see consolidation in repo; summary also in pack `context-files/current-state.md`).
- **Sprint 12** — first-pass structural observability (A–E) — **closed**; tests remain guardrails — `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`.
- **Sprint 13** — first-pass documentation + narrow Factory domain control tidy — **closed** — `docs/consolidation/sprint-13-index.md`.
- **Sprint 11** — fixture/regression foundations — **closed** — informs how to add tests when touching generation.

---

## Current known issues (register + closure)

See **`context-files/sprint-14-current-known-issues.md`** (authoritative). **`context-files/sprint-14-research-pack-baseline-audit.md`** remains a **read-only baseline snapshot**; live pack truth is repo **`domains/research/*.md`**.

---

## Next actions (optional follow-ups — not Sprint 14 core)

1. **Renderer polish** for Research-originated **`page`** payloads (Utilities) — **known issues §11**; **not** a chartered renderer redesign.
2. **Optional export JSON audit** for governance-heavy reviews.
3. **`runnerInstructions`** editorial pass (**R3.1**).

**Regression guard:** Run **`node --test tests/*.test.js`** before further Research generation changes.

---

## Review log

- **2026-05-14** — Pack `CURRENT-STATE.md` created for Sprint 14 portable context.
- **2026-05-14** — **Consolidation pass:** aligned with repo **`docs/development/current-state.md`** and **`sprint-14-current-known-issues.md`** closure sections; refreshed **`context-files/current-state.md`**; replaced “immediate next action” with **optional follow-ups** (first slice delivered).
