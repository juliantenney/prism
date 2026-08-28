# Sprint 80 — Next-chat briefing

**Sprint status:** **CLOSED** (2026-08-28)  
**Product status:** **WORKING ALPHA** (first-class self-study / workshop)  
**Opening:** [S80-D01](decisions.md#s80-d01--open-sprint-80--settings-discovery-product-value-and-policy-architecture)  
**Closeout:** [S80-T-008](S80-T-008-working-alpha-boundary-audit-and-sprint-80-closeout.md) — **ACCEPTED**  
**Start here:** [SPRINT-80-START-HERE.md](SPRINT-80-START-HERE.md)

---

## Context (load this first)

| Fact | State |
| ---- | ----- |
| Sprint 80 | **CLOSED** |
| Product | **WORKING ALPHA** — first-class self-study and workshop paths |
| Alpha boundary | Exactly [T-008](S80-T-008-working-alpha-boundary-audit-and-sprint-80-closeout.md); do not expand under Sprint 80 |
| S80-S1 … S80-S8 | **COMPLETE — ACCEPTED** |
| S80-T-008 | **ACCEPTED** |
| Remaining debt | **Post-alpha** — does **not** reopen Sprint 80 |
| Next engineering | **D-014 RESOLVED** — use `npm run test:first-class` as post-alpha gate ([record](../../governance/D-014-test-suite-confidence-diagnostic.md)) |
| Next product programme | **Learner-page accessibility** |
| Legacy Settings runtime | Superseded and inert (S4); cleanup is post-alpha |
| A/B/C/D | **DECIDED at T-006 — Option C (Adjustments)** — delivered |

## Accepted closeout decisions (2026-08-28)

- S80-S5, S80-S6, S80-S7, S80-S8: **ACCEPTED**
- S80-T-008: **ACCEPTED**
- Product status: **WORKING ALPHA**
- Sprint 80: **CLOSED**

## Delivery summary (archive)

Sprint 80 replaced Settings with **Adjustments**: typed workflow parameters + per-step Additional Instruction. Governed live parameters at close:

`topic`, `goal`, `duration_minutes`, `audience`, and (CAI-capable workflows only) `assessment_item_count`, `assessment_difficulty_profile`.

Key accepted evidence: T-006/T-007 architecture; T-009…T-012 diagnostics; S1–S8 vertical proofs (focused suite **229/229**; full-suite **393** failing locations = **D-014**, zero new from S8).

## Do

- Start the next session on **D-014** investigation (bounded; outside Sprint 80).
- After D-014, plan **learner-page accessibility** as the next substantive product programme.
- Keep alpha claims within T-008 (CAI-first assessment; MCQ default; Question Type / learner level / DA not required).

## Do not

- Reopen Sprint 80.
- Implement debt “to finish Sprint 80.”
- Add Question Type, learner level, or Settings cleanup under a Sprint 80 label.
- Claim the full test suite is green (D-014).
- Manufacture new backlog items beyond the operator sequencing above.
