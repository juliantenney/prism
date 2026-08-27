# Sprint 80 — Next-chat briefing

**Sprint status:** **OPEN** (2026-08-27)
**Opening:** [S80-D01](decisions.md#s80-d01--open-sprint-80--settings-discovery-product-value-and-policy-architecture)
**Start here:** [SPRINT-80-START-HERE.md](SPRINT-80-START-HERE.md)

---

## Context (load this first)

| Fact | State |
| ---- | ----- |
| Sprint 80 | **OPEN** — discovery/planning **only** |
| S80-T-001 … T-004 | **COMPLETE — ACCEPTED** |
| S80-T-005 | **COMPLETE** (acceptance may still be pending) |
| S80-T-005A | **COMPLETE** (awaiting acceptance) |
| S80-T-005B | **COMPLETE** (awaiting acceptance) |
| S80-T-005B.1 | **COMPLETE** (awaiting acceptance; corrected by T-005B.2) |
| S80-T-005B.2 | **COMPLETE — ACCEPTED** |
| S80-T-006 | **DECIDED** — Option C: Adjustments |
| S80-T-007 | **PLAN** — awaiting operator review (Q1–Q4) |
| Next | **S80-T-006** human gate after acceptance |
| Settings / parameterisation runtime | **Not authorised** |
| A/B/C/D | **Not decided** |

## Evidence stack for T-006

| Record | Contribution |
| ------ | ------------ |
| T-003 | Product value / framing; tiny concept set |
| T-004 | Hybrid ownership preferred candidate |
| T-005 | Persistence Option C preferred candidate |
| T-005A | Create commissioning vs Run payload; Settings ≠ parameterisation |
| T-005B | Topic / Duration / Audience are deterministic but have **no Run reader**; feasibility B/B/B; source description commissioning-only |
| **T-007** | **ARCHITECTURE:** registry → one resolver → 3 projections → **2** ingress points (`app.js:33394` + `33293`). **No model call at Run** (copy-to-clipboard). Per-step author text **already** reaches the model via `step.notes` (`33786–33793`). **Topic not baked.** Persistence `wf.adjustments` + `step.additional_instruction`. Alpha minimum S1+S2+S3+S4. New defect **D3** |
| **T-006** | **DECISION:** Settings superseded → **Adjustments** = (1) small allowlisted **typed workflow parameters** + (2) optional **per-step natural-language instruction**. Composition, not replacement. No new AI call. Parameters cannot change topology. v1: Topic, Duration (blocked on defect D1), Audience (needs canonical vocabulary), assessment (conditional). `[PRISM_STEP_PARAMS]` demoted to legacy; no migration complexity |
| T-005B.2 | **44** keys (T-005B.1's 42 + `activities_required`, `materials_required`). Only **25** have a proven effect; **17** have none; only **6** are model-visible. The Create bake reads no factor (`app.js:5373`), and `[PRISM_STEP_PARAMS]` has **no reachable route to a model** (`27107` early return kills the only caller). Topology is where factors actually work |
| T-005B.1 | **42** resolved brief keys, not 28 — 13 exist only in code (8 undeclared passthrough + 5 conditional cognition) + 1 alias. `resolvedSources` `"default"` is overloaded; product seed is laundered into `explicit`. `topic` is the only candidate with no enum conflict, no topology gate and no dependents |

## Do

- Review [S80-T-005B](S80-T-005B-minimal-runtime-parameter-contract-diagnostic.md).
- Review [S80-T-005B.1](S80-T-005B.1-complete-brief-factor-inventory-and-resolution-diagnostic.md) — the complete factor table.
- Review [S80-T-005B.2](S80-T-005B.2-resolved-brief-factor-effectiveness-live-consumer-audit.md) — the effectiveness matrix and the proven-effective shortlist.
- **Read [S80-T-006](S80-T-006-operator-product-architecture-decision-gate.md) (product decision) then [S80-T-007](S80-T-007-adjustments-target-architecture-and-implementation-plan.md) (architecture plan).** T-007 §1.1 **corrects** T-006 §17C on the projection chokepoint. Awaiting operator answers to Q1–Q4; then authorise slice S1 and/or S3. Do not implement without slice authorisation.
- On acceptance, open **S80-T-006** as **operator decision** only.

## Do not

- Implement parameterisation or Settings.
- Choose A/B/C/D in Cursor.
- Assume all Create fields should become Run parameters.
- Derive `learner_level` from free-text audience.
