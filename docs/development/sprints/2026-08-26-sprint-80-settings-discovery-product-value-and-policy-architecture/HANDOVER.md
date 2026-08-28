# Sprint 80 — Handover

**Kind:** Closed-sprint handover  
**Sprint status:** **CLOSED** (2026-08-28)  
**Product status:** **WORKING ALPHA** (first-class self-study / workshop)  
**Alpha boundary:** [S80-T-008](S80-T-008-working-alpha-boundary-audit-and-sprint-80-closeout.md) (**ACCEPTED**)  
**Dashboard:** [STATUS.md](STATUS.md)  
**Start here:** [SPRINT-80-START-HERE.md](SPRINT-80-START-HERE.md)

---

## Start here

Sprint 80 is **CLOSED**. Operator accepted S5–S8 and T-008 on 2026-08-28. PRISM’s first-class self-study and workshop paths are **WORKING ALPHA** under the T-008 boundary.

Remaining architectural debt is **post-alpha** and does **not** reopen Sprint 80.

**Next immediate engineering task:** none under Sprint 80 — D-014 **RESOLVED**.  
**Active successor:** **Sprint 81** — [Learner Workspace Investigation & Surface Architecture](../2026-08-28-sprint-81-learner-workspace-investigation-and-surface-architecture/SPRINT-81-START-HERE.md).

## Implementation state (final)

| Slice | Status | Live model-visible behaviour? |
| ----- | ------ | ---------------------------- |
| **S1** — parameter registry + `workflow.adjustments` persistence | **COMPLETE — ACCEPTED** | **No** on its own. Contract, resolver and persistence only. |
| **S3** — per-step Additional Instruction | **COMPLETE — ACCEPTED** | **Yes.** |
| **S2** — Topic vertical proof | **COMPLETE — ACCEPTED** | **Yes.** |
| **S4** — Adjustments UI repurpose | **COMPLETE — ACCEPTED** | **Yes, narrowly.** |
| **S5** — Goal authority repair + Goal Adjustment | **COMPLETE — ACCEPTED** | **Yes.** D4/D5/D6 fixed. |
| **S6** — Duration parameter + D1 timing repair | **COMPLETE — ACCEPTED** | **Yes.** D1 fixed. |
| **S7** — Audience governed workflow parameter | **COMPLETE — ACCEPTED** | **Yes.** D13/D16 fixed. |
| **S8** — Assessment Adjustments (Quantity + Difficulty) | **COMPLETE — ACCEPTED** | **Yes.** CAI-gated; Question Type deferred. |
| Former S9–S11 / other cleanup | **Post-alpha** — not Sprint 80 | — |

Focused S80 suite at close: **229/229**. Full-suite failing locations: **393** (**D-014**; zero new from S8).

## Architecture retained (do not regress)

- Registry allowlist: `topic`, `goal`, `duration_minutes`, `audience`, `assessment_item_count`, `assessment_difficulty_profile` (last two require `generate_assessment_items`).
- Projection: `workflowContext` only; Episode Plan excluded from typed projection; Additional Instruction reaches every step including EP.
- Precedence: typed parameters > Goal > Additional Instruction > stage discretion.
- No `selectedOptions` / `PRISM_STEP_PARAMS` revival for governed parameters.
- Historical Settings catalogue inert on active UI; cleanup is post-alpha.

## What not to do next

- Do not reopen Sprint 80 for debt from [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md).
- Do not start Question Type, learner level, DA (D25–D27), or Settings spaghetti cleanup as “Sprint 80 leftovers.”
- Do not expand the alpha claim beyond T-008.

## Next programme

1. **D-014** — **RESOLVED** (confidence gate `npm run test:first-class`).  
2. **Sprint 81 ACTIVE** — [Learner Workspace Investigation & Surface Architecture](../2026-08-28-sprint-81-learner-workspace-investigation-and-surface-architecture/SPRINT-81-START-HERE.md). Accessibility remains a design constraint for future surfaces; not a Sprint 80 remediation programme.
