# Sprint 38-F — Implementation charter (Workbook Contract Refinement)

**Date:** 2026-06-04  
**Status:** **CLOSED** (2026-06-04) — [38F-5](observations/38F-5-final-evaluation-and-sprint-closure.md)  
**Predecessor:** [Sprint 38-E](../2026-06-04-sprint-38e-workbook-contract-implementation/) (**CLOSED** — [38E-11](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-11-final-evaluation-and-sprint-closure.md))

---

## Mission

**Refine** Sprint **38-E** workbook contracts in learning-design **prompts/contracts** so the Inflation self-study learner anchor satisfies **V-01** and **V-05** while **retaining** worked-example and consolidation obligations from 38E-8/9.

**Primary success condition:**

> **Workbook PASS** + **Preservation PASS** (reported separately)

**Primary hypothesis:**

> If the workbook contracts explicitly preserve at least one table/reference family and require scenario content to be authored as a distinct `scenario` Material, then Inflation will pass [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) workbook validation without regressing Design Page preservation or B4 table fidelity.

---

## Preconditions (assumed true)

**Sprint 38-B:**

- Design Page compose contract and materials preservation (`LD-MATERIALS-COPY`, `LD-TABLE-FIDELITY`)
- B4 table fidelity **MONITORING** with passing gate evidence when tables are authored
- EV-01 BEFORE frozen

**Sprint 38-C / 38-D:**

- Workbook pedagogy and validation model (**CLOSED** planning)
- [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) V-01 … V-13
- [38D-5](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) evaluation framework

**Sprint 38-E:**

- Pack §5 + §6 workbook contracts enacted ([38E-2](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-2-dla-contract-implementation.md), [38E-3](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-3-gam-contract-implementation.md))
- Function strengthening ([38E-8](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-8-dla-workbook-function-strengthening.md), [38E-9](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-9-gam-workbook-function-enforcement.md))
- `EV-38E10-AFTER` — V-03/V-04/V-10 Pass; **V-01/V-05 Fail**; Preservation **PASS**
- `app.js` **not** required for 38E programme ([38E-1](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-1-implementation-target-audit.md))

---

## Programme question

> Can minimal pack-only refinements for V-01 and V-05 achieve **Workbook PASS** on the Inflation anchor while holding 38-E workbook functions and 38-B preservation?

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Design Page changes | §13 pack / compose — out of charter |
| Renderer changes | Deferred |
| `app.js` changes | Forbidden unless 38F-1 proves need **and** charter amended |
| New pedagogy model | 38C/38D authority — cite only |
| Reopening 38-B preservation architecture | V-13 regression monitor only |
| Prompt-size reduction | 38-B complete |
| Broad runtime refactor | Out of charter |
| Sprint 39 reasoning cues | Separate programme |
| Re-implementing full 38D/38E contract sets | Refinement only — do not strip 38E-8/9 rows |

---

## Implementation permissions by phase

| Phase | Code / prompt changes | Notes |
|-------|----------------------|--------|
| **38F-1** | **None** | Analysis only |
| **38F-2** | **`domain-learning-design-step-patterns.md` §5 + §6 only** | Minimal V-01/V-05 deltas; retain 38E-8/9 mandates |
| **38F-3** | **Tests/checks** only if tied to V-01, V-05, V-13 | e.g. extend `workbook-contract-prompt-surface.test.js` |
| **38F-4** | **Artefacts** under sprint `artefacts/` only | `EV-38F-AFTER-*`; scorecard observation |
| **38F-5** | **Docs only** | Sprint closure |
| **`app.js`** | **Forbidden** unless 38F-1 documents need + charter amendment | Default: pack-only |

**Authorised implementation file (38F-2):**

`domains/learning-design/domain-learning-design-step-patterns.md` — **§5 DLA** and **§6 GAM** workbook contract text only.

---

## Phases

### 38F-1 — V-01 / V-05 forensic analysis

| Field | Content |
|-------|---------|
| **Purpose** | Trace why **V-01** (genre families) and **V-05** (scenario Material) failed on `EV-38E10-AFTER`; identify smallest pack clauses to fix without dropping worked/consolidation |
| **Planned deliverable** | [observations/38F-1-v01-v05-forensic-analysis.md](observations/38F-1-v01-v05-forensic-analysis.md) |
| **Inputs from 38-E** | [38E-10](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md); `EV-38E10-AFTER-*`; [38E-11 §9](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-11-final-evaluation-and-sprint-closure.md); current pack §5/§6 |
| **Implementation permission** | **Analysis only** — no code/prompt changes |
| **Success criteria** | DLA vs GAM break points for V-01 and V-05 documented; proposed clause deltas scoped; `app.js` yes/no with evidence; trade-off vs 38E5 (tables present, scenario typed) explicit |
| **Non-goals** | Pack edits; pipeline run; test changes |
| **Status** | **COMPLETE** (2026-06-04) — [38F-1](observations/38F-1-v01-v05-forensic-analysis.md); `app.js` **NO**; recommend **C** DLA+GAM |

---

### 38F-2 — Minimal DLA/GAM contract refinement

| Field | Content |
|-------|---------|
| **Purpose** | Apply **minimal** §5/§6 changes from 38F-1: require ≥1 table-family `required_materials` entry **and** retain 38E-8/9 rows; re-mandate `scenario` Material where brief uses household cases |
| **Planned deliverable** | [observations/38F-2-contract-refinement.md](observations/38F-2-contract-refinement.md) + pack diffs |
| **Inputs from 38-E** | [38E-8](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-8-dla-workbook-function-strengthening.md) · [38E-9](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-9-gam-workbook-function-enforcement.md) — **do not remove**; [38F-1](observations/38F-1-v01-v05-forensic-analysis.md) |
| **Implementation permission** | **`domain-learning-design-step-patterns.md` §5 + §6 only** |
| **Success criteria** | Reviewer can trace V-01 and V-05 obligations to pack locations; 38E-8/9 mandatory types unchanged in intent; no other repo files modified in this slice |
| **Non-goals** | `app.js`; Design Page; renderer; broad 38D clause rewrites; Inflation run |
| **Status** | **COMPLETE** (2026-06-04) — [38F-2](observations/38F-2-contract-refinement.md) |

**Depends on:** 38F-1

---

### 38F-3 — Regression prompt-surface check

| Field | Content |
|-------|---------|
| **Purpose** | Verify 38F-2 deltas against [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md); confirm V-13 preservation stack untouched; ready for 38F-4 |
| **Planned deliverable** | [observations/38F-3-regression-prompt-surface-check.md](observations/38F-3-regression-prompt-surface-check.md) |
| **Inputs from 38-E** | [38E-4](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-4-contract-regression-fixture-check.md) pattern; `tests/workbook-contract-prompt-surface.test.js` |
| **Implementation permission** | **Tests/checks** only if directly tied to V-01, V-05, V-13 |
| **Success criteria** | Regression checklist complete; 38E-8/9 clauses still present in pack; **READY** for Inflation AFTER |
| **Non-goals** | Live pipeline run; unrelated CI; 38-B fixture rewrites |
| **Status** | **COMPLETE** (2026-06-04) — [38F-3](observations/38F-3-regression-prompt-surface-check.md); **12/12** tests; **READY** for 38F-4 |

**Depends on:** 38F-2

---

### 38F-4 — Inflation re-run and scorecard

| Field | Content |
|-------|---------|
| **Purpose** | Run post-refinement Inflation pipeline; capture **`EV-38F-AFTER`**; score [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) + [38D-5 §6–§9](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md); compare EV-01 / 38E5 / 38E10 / 38F |
| **Planned deliverable** | [observations/38F-4-inflation-after-scorecard.md](observations/38F-4-inflation-after-scorecard.md) + [artefacts/EV-38F-AFTER-*](artefacts/) |
| **Inputs from 38-E** | Frozen comparators; [38E-10](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-10-inflation-rerun-scorecard.md) harness pattern (`ev-38e10-inflation-pipeline-capture-once.mjs`) |
| **Implementation permission** | **Artefacts** under sprint `artefacts/`; observation doc only |
| **Success criteria** | Dual verdicts: **Workbook** PASS/FAIL · **Preservation** PASS/FAIL; four-way comparison table; V-01/V-05 explicitly scored; 38E-8/9 types still present if PASS |
| **Non-goals** | Overwriting EV-01 / EV-38E5 / EV-38E10; pack edits during scoring |
| **Status** | **COMPLETE** (2026-06-04) — [38F-4](observations/38F-4-inflation-after-scorecard.md); Workbook **FAIL** (V-10); V-01/V-05 **Pass**; Preservation **PASS** |

**Depends on:** 38F-2, 38F-3

---

### 38F-5 — Sprint closure

| Field | Content |
|-------|---------|
| **Purpose** | Close sprint; judge hypothesis; recommend programme continuation or workbook programme closure |
| **Planned deliverable** | [observations/38F-5-final-evaluation-and-sprint-closure.md](observations/38F-5-final-evaluation-and-sprint-closure.md) |
| **Inputs from 38-E** | Full 38E trail + 38F-1 … 38F-4 |
| **Implementation permission** | **Docs only** |
| **Success criteria** | Explicit dual verdicts; hypothesis judgement; frozen artefact index; next step named |
| **Non-goals** | New implementation in closure slice |
| **Status** | **COMPLETE** (2026-06-04) — hypothesis **partially supported**; recommend **Sprint 38-G** |

**Depends on:** 38F-4

---

## Phase dependency graph

```text
38F-1 V-01 / V-05 forensic analysis (no code)
    → 38F-2 Minimal DLA/GAM pack refinement (§5 + §6 only)
        → 38F-3 Regression prompt-surface check
            → 38F-4 Inflation re-run + scorecard
                → 38F-5 Sprint closure
```

**Parallelism rule:** Phases are **sequential** — no parallel pack edits before 38F-1 completes.

---

## Success criteria (sprint exit)

| Criterion | Measure |
|-----------|---------|
| V-01/V-05 analysed | 38F-1 complete |
| Pack refined | 38F-2 minimal §5/§6 deltas |
| Regression checked | 38F-3; V-13 unchanged in architecture |
| Inflation evaluated | 38F-4 `EV-38F-AFTER` + scorecard |
| **Primary success** | **Workbook PASS** + **Preservation PASS** on 38F-4 run |
| **Partial success** | Document per [38D-5 §7](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) with dual verdicts |
| 38-E gains retained | worked_example, sample_output, consolidation_summary still manifest if Workbook PASS |
| Comparators preserved | EV-01, EV-38E5, EV-38E10 not overwritten |

---

## Boundaries with 38-E

| 38-E owns (closed) | 38-F owns |
|------------------|-----------|
| Full 38D contract enactment + 38E-8/9 function strengthening | **V-01 + V-05** refinement only |
| `EV-38E5-AFTER`, `EV-38E10-AFTER` | `EV-38F-AFTER` (new artefacts only) |
| Programme learning — partially supported | Hypothesis re-test on two rules |

**Do not strip** 38E-8/9 mandatory `required_materials` or GAM enforcement rows without charter amendment.

---

## Boundaries with 38-D

| 38-D owns (closed) | 38-F uses |
|------------------|-----------|
| Contract **specification** | [38D-4](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) V-01, V-05 scoring |
| Evaluation plan | [38D-5](../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) scorecard · tiers · Cases |

**Do not redefine** 38D-1 … 38D-5 — **refine pack text and evidence** only.

---

## Boundaries with 38-C

| 38-C owns | 38-F uses |
|-----------|-----------|
| Pedagogy model, gap analysis | PASS/FAIL bar only |

**Do not reopen** 38C-6 candidate ranking except to cite authority.

---

## Boundaries with 38-B

| 38-B owns | 38-F owns |
|-----------|-----------|
| `LD-MATERIALS-COPY`, `LD-TABLE-FIDELITY`, compose contract | **Reference** preserve modules; V-13 regression on 38F-4 |
| EV-01 fixtures (frozen) | Read-only BEFORE column |

**Do not reopen** 38-B architecture unless 38F-4 proves specific regression — document before any fix.

---

## Sprint exit summary (38F-5 — authoritative)

| Outcome | Result |
|---------|--------|
| V-01 / V-05 analysed and refined | **Yes** (38F-1 + 38F-2) |
| Regression checked | **Yes** (38F-3; 12/12 tests) |
| Inflation evaluated | **Yes** (`EV-38F-AFTER`) |
| **V-01 / V-05 on anchor** | **Pass** |
| **38E-8/9 retained** | **Yes** |
| **Preservation** | **PASS** |
| **Workbook overall** | **FAIL** (V-10 / R3) |
| Hypothesis | **Partially supported** |
| `app.js` changed | **No** |
| Post-closure review | [38F-8](observations/38F-8-inflation-page-quality-review.md) — professional workbook **FAIL** |
| **Successor** | [Sprint 38-G — Activity Component Quality](../2026-06-04-sprint-38g-activity-component-quality/) (**CHARTERED**) |

---

## References

- [README.md](README.md)
- [HANDOVER.md](HANDOVER.md)
- [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md)
- [38E HANDOVER](../2026-06-04-sprint-38e-workbook-contract-implementation/HANDOVER.md)
- [38E-11 final closure](../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-11-final-evaluation-and-sprint-closure.md)
