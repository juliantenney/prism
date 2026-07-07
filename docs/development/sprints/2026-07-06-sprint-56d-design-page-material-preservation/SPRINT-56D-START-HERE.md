# Sprint 56D — Start Here

**Sprint:** 56D — Design Page Material Preservation Fix  
**Type:** Implementation / debugging sprint  
**Status:** **Active**  
**Date opened:** 2026-07-06  
**Predecessor:** [Sprint 56C](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-START-HERE.md) (completed — do not reopen)

---

## What Sprint 56D is

Sprint 56D is an **implementation and debugging sprint** only. It addresses a **live end-to-end preservation failure** observed after Sprint 56C closed: GAM material bodies are truncated or summarised when composed into the Design Page artefact.

**Sprint 56C governance and architecture are frozen.** Do not reopen Wave 1–4 decisions, CP-4 briefs, OQ resolutions, or validation architecture.

---

## Programme status

| Sprint | Status |
| ------ | ------ |
| **56A** | **Complete** — architecture investigation |
| **56B** | **Complete** — CP-4 approved |
| **56C** | **Complete** — [closure summary](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-CLOSURE-SUMMARY.md) |
| **56D** | **Active** — material preservation fix |
| **57** | **Reserved** — future roadmap |

---

## Primary goal

**Restore verbatim GAM → Design Page material preservation.**

When upstream `activity_materials` (GAM) contains full learner-facing material bodies (M1–M15 in the observed workflow), the Design Page output must carry **identical bodies** in `learning_activities.content[].materials.*` — no truncation, excerpting, summarisation, ellipsis insertion, or LLM-composed substitutes.

The HTML renderer faithfully renders what the Design Page artefact contains. The first failure point is **GAM → Design Page compose**, not the renderer.

---

## Secondary goal

**Diagnose React minified error #185** separately.

This runtime error appears during testing and is tracked as a distinct workstream. Do not conflate React diagnostics with material-preservation fixes unless evidence links them.

---

## Binding constraints (read first)

| Document | Purpose |
| -------- | ------- |
| [SPRINT-56D-CONTEXT-LOCKS.md](SPRINT-56D-CONTEXT-LOCKS.md) | Non-negotiables |
| [SPRINT-56D-CURSOR-RULES.md](SPRINT-56D-CURSOR-RULES.md) | Agent/implementation rules |
| [SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md) | What Prism can validate |

Frozen architecture authorities (read-only):

- [CP-4 Approval Brief](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md)
- [Architecture Guardrails](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-ARCHITECTURE-GUARDRAILS.md)
- [Sprint 56C Governance Sign-Off](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-GOVERNANCE-SIGNOFF.md)

---

## Required reading (in order)

| # | Document |
| - | -------- |
| 1 | [SPRINT-56D-PRESERVATION-FAILURE-REPORT.md](SPRINT-56D-PRESERVATION-FAILURE-REPORT.md) |
| 2 | [SPRINT-56D-CONTEXT-LOCKS.md](SPRINT-56D-CONTEXT-LOCKS.md) |
| 3 | [SPRINT-56D-IMPLEMENTATION-TASKS.md](SPRINT-56D-IMPLEMENTATION-TASKS.md) |
| 4 | [SPRINT-56D-TEST-PLAN.md](SPRINT-56D-TEST-PLAN.md) |
| 5 | [SPRINT-56D-OPEN-QUESTIONS.md](SPRINT-56D-OPEN-QUESTIONS.md) |
| 6 | [SPRINT-56D-CURSOR-RULES.md](SPRINT-56D-CURSOR-RULES.md) |

---

## What Sprint 56D is not

- Not an architecture sprint — CP-4 decisions stay frozen
- Not a prompt-authoring sprint — do not add new LLM generation to Design Page
- Not a DLA or GAM rewrite unless evidence proves upstream failure
- Not a workflow regeneration exercise as first-line fix
- Not a reopening of Sprint 56C Waves 1–4

---

## Success criteria

1. GAM material bodies appear **verbatim** in Design Page `activity.materials.*` fields for the reproduction workflow.
2. Regression tests prove body equality (length/hash), ID/order preservation, and no ellipsis/summary substitution.
3. HTML export contains full M1/M2/M5/M9/M15 bodies (renderer is faithful transport).
4. React #185 root cause documented (fix optional in same sprint if low-risk).

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56D-START-HERE.md` |
| Sprint | 56D |
| Status | Active |
