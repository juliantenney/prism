# Current Frontier — Sprint 45 (Proposed)

**Date:** 2026-06-18  
**Status:** Proposed — not yet started  
**Supersedes for new chats:** Sprint 44 frontier docs for **starting point** — Sprint 44 is closed

---

## Current Proposed Frontier

Sprint 45 would shift from **making quality observable** (Sprint 44) to **testing whether patterns influence generation** (Sprint 45).

| Priority | Slice | Question |
| -------- | ----- | -------- |
| 1 | **45-1** Pattern Injection Experiment | Can SP-02 and SP-03 be deliberately induced in GAM output? |
| 2 | **45-2** Pattern-Aware Evaluation | Do generated bodies show pattern signals and avoid documented FMs? |
| 3 | **45-3** Regression Against Benchmark Corpus | Does generation improve vs frozen Marx/Photosynthesis baseline? |
| 4 | **45-4** Material-Level Repair Strategy | Can failed bodies be repaired without full workflow re-run? |

**Sprint 45 is not approved.** No implementation should begin without explicit authorisation.

---

## Active Questions (Open)

| Question | Where addressed |
| -------- | --------------- |
| What mechanism injects pattern specs into GAM? | 45-1 design (TBD — not assumed) |
| Do SP-02/SP-03 signals appear in generated `decision_table` and `transfer_prompt` bodies? | 45-1 + 45-2 |
| Do FM-04, FM-02, FM-03 decrease vs baseline generation? | 45-2 |
| Does guidance generalise to Photosynthesis or overfit Marx? | 45-3 |
| Is learner ownership preserved (empty judgement cells, no pre-written transfer)? | 45-2 |
| When to inject SP-01, SP-04, SP-05, SP-06? | After 45-1 results |
| Does 44-1 runtime capture gate affect experiment design? | Parallel track — observe |

---

## Non-Goals

| Non-goal | Reason |
| -------- | ------ |
| Reopen ownership model | Settled Sprint 43 |
| Redesign 44-2 contracts | Closed Sprint 44 |
| Redesign Pattern Library | Closed Sprint 44 |
| Implement full autonomous repair | Premature before 45-1 |
| Treat patterns as prompts without evaluation | Method violation |
| Expand to unevaluated material types first | No SP entries |
| Renderer / page layout redesign | Out of scope |
| Universal Strong enforcement gates | 44-1 excludes |
| Resolve all calibration boundaries via generation | Document only |
| Auto-approve Sprint 45 | Requires explicit user approval |

---

## Recommended First Action

1. **Confirm Sprint 45 approval** with the user
2. If approved: design **45-1** for `decision_table` + `transfer_prompt` using **SP-02** and **SP-03** only
3. Define injection experiment plan before any code changes
4. Plan **45-2** evaluation using 44-2 + pattern Detection Signals + FM checks

If not approved: remain in proposal discussion — read Sprint 44 closure docs; do not implement.

---

## Parallel Work (Optional)

**44-1 capture gate runtime implementation** may continue in parallel:

- Spec: [`../../2026-06-15-sprint-44/sprint-44-slice-1-tiered-gam-capture-gate.md`](../../2026-06-15-sprint-44/sprint-44-slice-1-tiered-gam-capture-gate.md)
- Complementary to 45-1 (blocks FM-01 stubs early) — not a substitute for pattern injection experiment

---

## Source Documents

| Document | Role |
| -------- | ---- |
| [`../sprint-45-slice-index.md`](../sprint-45-slice-index.md) | Proposed slice details |
| [`../sprint-45-current-frontier.md`](../sprint-45-current-frontier.md) | Frontier summary |
| [`../../2026-06-15-sprint-44/sprint-45-proposal.md`](../../2026-06-15-sprint-44/sprint-45-proposal.md) | Authoritative proposal |
| [`../../2026-06-15-sprint-44/sprint-44-outcomes.md`](../../2026-06-15-sprint-44/sprint-44-outcomes.md) | Sprint 44 closure |

---

## Success Signals (If Sprint 45 Proceeds)

| Signal | Indicator |
| ------ | --------- |
| Pattern signals present | SP-02/SP-03 Detection checklists pass on injection runs |
| Failure modes reduced | FM-04, FM-02, FM-03 less frequent vs baseline |
| Contract traceability | Verdicts justified via 44-2 §5.x + corpus comparison |
| Ownership preserved | No pre-filled judgement; no pre-written transfer |
| Evidence documented | Corpus → generate → evaluate → report chain |

---

**Continue from Sprint 44 closure. Sprint 45 begins only if approved.**
