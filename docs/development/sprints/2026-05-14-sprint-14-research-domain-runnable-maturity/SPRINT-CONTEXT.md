# Sprint Context

**Role:** authoritative for **this pack only** (Sprint 14 portable continuity).

**Sprint:** Sprint 14 — Research Domain Runnable Maturity

**Pack path:** `docs/development/sprints/2026-05-14-sprint-14-research-domain-runnable-maturity/`

**Physical snapshots:** `context-files/` — point-in-time copies for upload to a fresh chat; **not** live repo paths. Prefer **`context-files/`** when working from this pack alone.

---

## Sprint 14 focus

- **Goal:** Make the **Research** domain a **genuinely usable, trustworthy runnable** workflow domain (Workflow Factory generation, brief/elicitation fit, step patterns, runner guidance, artefact story).
- **Framing:** **Practical implementation and verification** work — **not** a portability architecture sprint, **not** an orchestration rewrite, **not** a schema redesign programme.

---

## Runnable-domain posture (v1)

- **General** is **baseline-only** (always merged via manifest / `normalizeSelectedDomains`); it is **not** user-selectable as a runnable Workflow Factory domain.
- **Learning Design** and **Research** are the **runnable v1** Factory domains.
- Sprint 14 **concentrates on Research**; **Learning Design** elicitation parity is **explicitly out of scope** for this sprint (may follow later).

---

## Upstream closure (do not reopen)

- **Sprint 12** — first-pass structural observability (Phases A–E) — **closed** — `docs/consolidation/sprint-12-first-pass-structural-observability-closure.md`
- **Sprint 13** — first-pass consolidation — **closed** — `docs/consolidation/sprint-13-index.md`, `docs/consolidation/sprint-13-first-pass-closure.md`

**General baseline-only (product clarification):** `docs/consolidation/sprint-13-general-alwayson-first-structured-domain-behaviour.md` §**Current v1 — General baseline-only** (also copied indirectly via `context-files/current-state.md` pointers).

---

## Consolidation artefacts (Sprint 14)

| Artefact | Purpose |
|----------|---------|
| `context-files/sprint-14-index.md` | Sprint 14 map |
| `context-files/sprint-14-charter.md` | Goals, non-goals, constraints, exclusions |
| `context-files/sprint-14-research-pack-baseline-audit.md` | Read-only Research pack baseline vs LD |
| `context-files/sprint-14-current-known-issues.md` | Issue register before deep implementation |

**Portability backlog (context only):** `context-files/prism-architecture-portability-backlog.md` — Sprint 14 is **practical runnable-pack work** (§2.1), **not** portability redesign.

---

## Read-first order (from this pack)

1. `context-files/sprint-14-charter.md`
2. `context-files/sprint-14-index.md`
3. `context-files/sprint-14-research-pack-baseline-audit.md`
4. `context-files/sprint-14-current-known-issues.md`
5. `context-files/current-state.md`
6. `context-files/domain-manifest.json`
7. `context-files/domain-research-step-patterns.md` (policy + brief + steps)
8. `context-files/domain-research-artefacts.md`
9. `context-files/domain-learning-design-step-patterns.md` (comparison only — do not expand scope to LD overhaul)
10. `context-files/workflowGenerationContext.js` — loaders, `getWorkflowBriefConfig`, `normalizeSelectedDomains`
11. `context-files/app.js` — Workflow Factory, domain select, generation entrypoints (bounded edits only when chartered)
12. `context-files/development-protocol.md`, `context-files/shared-vocabulary.md`

---

## Review log

- **2026-05-14** — Sprint 14 portable context pack created (`SPRINT-CONTEXT.md`, bootstrap prompt, `CURRENT-STATE.md`, `HANDOVER.md`, `context-files/` snapshots).
