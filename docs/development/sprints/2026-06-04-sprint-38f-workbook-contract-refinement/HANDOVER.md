# Handover — Sprint 38-F → Programme (38-G proposed)

**Pack:** [README.md](README.md) · **Status:** **CLOSED** — [38F-5](observations/38F-5-final-evaluation-and-sprint-closure.md)

**Predecessor:** [Sprint 38-E](../2026-06-04-sprint-38e-workbook-contract-implementation/) (**CLOSED**)

---

## What 38-F proved

| Finding | Evidence |
|---------|----------|
| **V-01 fixable by pack** | `analysis_table` + 4 families on `EV-38F-AFTER` |
| **V-05 fixable by pack** | `Material: scenario` + 2 households; AP-04 Pass |
| **38E-8/9 retained** | worked_example, sample_output, consolidation_summary on 38F run |
| **Preservation stable** | V-13 **PASS**; B4 pass when table authored |
| **Design Page / renderer not causal** | GAM→page match when genres authored |
| **Full Workbook PASS not met** | V-10 Fail — retrieval genres dropped vs 38E10 |

**38-F exit:** Workbook **FAIL** · Preservation **PASS** · hypothesis **partially supported** · Case **A+**.

---

## What remains (programme)

| Blocker | 38F evidence | Proposed 38-G intent |
|---------|--------------|----------------------|
| **R3 retrieval** | No task_cards/checklist/prompt_set | Co-mandate retrieval **with** 38F table/scenario rows |
| **DLA-WB-11** | 3 activities; retrieval on 0 activities | ≥2 activities with retrieval genres; guard compression |

---

## Why 38-G is narrow

- Dominant failure **moved** from V-01/V-05 (38E10) to retrieval (38F) — same programme pattern as 38E→38F.
- **Pack-only** fix likely; no 38F-1 evidence for `app.js`.
- Do **not** reopen Design Page, renderer, or 38-B preservation.

---

## Boundaries for 38-G

| Keep | Do not strip |
|------|----------------|
| 38F-2 DLA-WB-06a/18 · GAM-WB-38F-01/10 | 38E-8/9 worked/consolidation rows |
| Frozen comparators EV-01 … EV-38F | 38-B `LD-MATERIALS-COPY` / `LD-TABLE-FIDELITY` |

---

## Suggested next chat

1. Charter **Sprint 38-G — Retrieval Density Refinement** (folder + IMPLEMENTATION-CHARTER).
2. Read [38F-5 §7](observations/38F-5-final-evaluation-and-sprint-closure.md) (R3 trace) and `EV-38F-AFTER-dla-learning-activities.json` vs `EV-38E10-AFTER-dla-learning-activities.json`.
3. Propose minimal §5/§6 co-presence clauses; extend prompt-surface tests; Inflation AFTER.

**Quick resume (38-F archive):** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [38F-5](observations/38F-5-final-evaluation-and-sprint-closure.md)
