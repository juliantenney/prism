# Slice 38F-5 — Final evaluation and sprint closure

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Sprint:** **38-F — Workbook Contract Refinement** → **CLOSED**  
**Authority:** [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md) · [38D-5](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-5-inflation-before-after-evaluation.md) · [38E-11](../../2026-06-04-sprint-38e-workbook-contract-implementation/observations/38E-11-final-evaluation-and-sprint-closure.md)  
**Evidence trail:** [38F-1](38F-1-v01-v05-forensic-analysis.md) · [38F-2](38F-2-contract-refinement.md) · [38F-3](38F-3-regression-prompt-surface-check.md) · [38F-4](38F-4-inflation-after-scorecard.md) · `EV-38F-AFTER-*`

---

## 1. Purpose

Close **Sprint 38-F** by judging whether the **V-01/V-05 refinement hypothesis** was validated on the Inflation anchor, synthesising evidence from 38F-1 through 38F-4, and recommending the next programme action — with **Workbook** and **Preservation** reported separately throughout.

---

## 2. Sprint mission recap

**Mission:**

> Resolve **V-01** (≥4 genre families including table/reference) and **V-05** (explicit `scenario` Material) while preserving:
>
> - `worked_example`
> - `sample_output`
> - `consolidation_summary`
> - **Preservation PASS**

**Primary success condition:**

> **Workbook PASS** + **Preservation PASS** (never conflated)

**Primary hypothesis (38F charter):**

> If workbook contracts explicitly require a table/reference family and a distinct scenario Material, Inflation will resolve V-01 and V-05 without regressing preservation.

**Programme question:**

> Can minimal pack-only refinements close the last two V-rules on the Inflation anchor while holding 38-E workbook function and 38-B preservation?

**Implementation boundary (held):** Pack-only — `domains/learning-design/domain-learning-design-step-patterns.md` §5 + §6; **`app.js` not modified** ([38F-1](38F-1-v01-v05-forensic-analysis.md)).

---

## 3. What changed

| Phase | Scope | Outcome |
|-------|--------|---------|
| **[38F-1](38F-1-v01-v05-forensic-analysis.md)** | Forensic on `EV-38E10-AFTER` | **V-01:** DLA omitted `*_table` after 38E-8/9 consolidation focus. **V-05:** DLA used `task_cards` instead of `scenario` despite WB-18. Break at **DLA → GAM**; **`app.js` not causal**. Recommend minimal §5/§6 deltas. |
| **[38F-2](38F-2-contract-refinement.md)** | Pack §5/§6 only | **DLA-WB-06a** (mandatory table row), **DLA-WB-18** (scenario row; anti task_cards-only), **GAM-WB-38F-01**, **GAM-WB-10**, **F5/F6**. 38E-8/9 rows **unchanged**. |
| **[38F-3](38F-3-regression-prompt-surface-check.md)** | `tests/workbook-contract-prompt-surface.test.js` | **12/12** pass; V-01/V-05/38E-8/9/V-13 on prompt surface; preservation libs untouched. **READY** for 38F-4. |
| **[38F-4](38F-4-inflation-after-scorecard.md)** | `EV-38F-AFTER` | **V-01 Pass**, **V-05 Pass**, 38E-8/9 **retained**, **Preservation PASS**. **Workbook FAIL** — **V-10** (R3 retrieval); **DLA-WB-11** not met. 3-activity compression; no `task_cards`/`checklist`. |

**Repo touch (implementation):** `domain-learning-design-step-patterns.md` §5–§6; `tests/workbook-contract-prompt-surface.test.js`; sprint `artefacts/EV-38F-AFTER-*`. **Not changed:** `app.js`, preservation `lib/*`, renderer, Design Page §13 body.

---

## 4. Hypothesis assessment

**Hypothesis:**

> If workbook contracts explicitly require a table/reference family and a distinct scenario Material, Inflation will resolve V-01 and V-05 without regressing preservation.

**Judgement: Partially supported**

| Sub-claim | Result | Evidence |
|-----------|--------|----------|
| **V-01 resolved** | **Yes** | 4 GAM families incl. **table**; `analysis_table` pipe material on A2; [38F-4 §9](38F-4-inflation-after-scorecard.md) |
| **V-05 resolved** | **Yes** | `Material: scenario` with 2 households; AP-04 **Pass**; not embedded in task_cards only |
| **Preservation held** | **Yes** | V-13 **PASS**; B4-01/B4-02 pass; GAM→page bodies verbatim incl. table + scenario |
| **38E-8/9 retained** | **Yes** | worked_example, sample_output, consolidation_summary on 38F run |
| **Full workbook PASS** | **No** | **V-10 Fail** (R3); DLA-WB-11 — retrieval genres absent on ≥2 activities |
| **No Design Page / renderer regression** | **Yes** | Page carries authored genres; compose `scenario` → `materials.scenarios` with verbatim body |

**Narrow hypothesis (V-01 + V-05 + preservation):** **Supported** on `EV-38F-AFTER`.

**Charter primary success condition (Workbook PASS + Preservation PASS):** **Not met** — dual verdicts: Workbook **FAIL**, Preservation **PASS**.

---

## 5. Before / after comparison

| Measure | 38E10 (`EV-38E10-AFTER`) | 38F (`EV-38F-AFTER`) |
|---------|--------------------------|----------------------|
| **Workbook verdict** | **FAIL** | **FAIL** |
| **Preservation verdict** | **PASS** | **PASS** |
| **V-01** | **Fail** (3 families; no table family) | **Pass** (4 families incl. table) |
| **V-05** | **Fail** (cases in task_cards only) | **Pass** (`Material: scenario`) |
| **worked_example** | **Yes** | **Yes** |
| **sample_output** | **Yes** | **Yes** |
| **consolidation_summary** | **Yes** | **Yes** |
| **Table family** | **No** (0 pipe-table materials) | **Yes** (`analysis_table`) |
| **Scenario Material** | **No** | **Yes** (2 households) |
| **Retrieval** (`task_cards` / `checklist` / `prompt_set`) | **Yes** (checklist + task_cards) | **No** |
| **Activity count** | **4** | **3** |
| **Genre family count** | **3** | **4** |

**Net Δ (38E10 → 38F):** Sprint blockers **V-01/V-05 fixed**; 38E-8/9 **held**; retrieval **regressed**; activity count **compressed**.

---

## 6. Confirmed findings

**Confirmed:**

- **V-01 fixed** — table/reference family restored via DLA-WB-06a + GAM-WB-38F-01; `analysis_table` manifests at DLA, GAM, and page.
- **V-05 fixed** — distinct `scenario` Material; not task_cards-only substitution ([38F-2](38F-2-contract-refinement.md) anti-pattern enforced).
- **worked / consolidation retained** — `worked_example`, `sample_output`, `consolidation_summary` present with full bodies; V-03/V-04 **Pass**.
- **preservation retained** — V-13 **PASS** across EV-01 → 38E5 → 38E10 → 38F; no B4 regression when table authored.
- **Design Page not causal** — when GAM authors genres, page materials match; scenario mapped to `materials.scenarios` per compose convention, bodies verbatim.
- **renderer not causal** — JSON/page primary evidence; render excerpt utility-only; no renderer edits in programme.
- **Pack refinements change live output** — fourth anchor run confirms contract → pipeline causality ([38D-5](38D-5-inflation-before-after-evaluation.md) Case **A+**).

**Not confirmed (charter primary):**

- **Full Workbook PASS** — blocked by **R3 retrieval** / **V-10**, not by V-01/V-05.

---

## 7. Remaining blocker analysis

**Focus:** R3 retrieval · **DLA-WB-11** only (per sprint closure scope).

### Trace: DLA → GAM → Page

```text
DLA (38F run: 3 activities)
  inflation_wb_01 — text, worked_example, sample_output
  inflation_wb_02 — scenario, analysis_table, text
  inflation_wb_03 — consolidation_summary, text
  │
  │  DLA-WB-11 expects retrieval genres (task_cards | checklist | prompt_set)
  │  on ≥2 activities — NONE listed in required_materials on any activity
  ▼
GAM
  │  Mirrors DLA types 1:1 (6 types, 4 families)
  │  No Material: task_cards | checklist | prompt_set
  ▼
Page (V-10)
  │  R3 learner-check retrieval — Partial
  │  No checklist/cards/prompt_set on ≥2 activities
  ▼
Workbook FAIL (G3 — V-10 required Pass)
```

### Why retrieval blocks Workbook PASS now

At **38E10**, retrieval **Passed** (checklist A2, task_cards) while **V-01/V-05 Failed**. At **38F**, adding mandatory **table + scenario** rows (and 3-activity compression) coincided with **omission** of retrieval genres — not weakening of the retrieval **rule** in [38D-4](../../2026-06-04-sprint-38d-workbook-authoring-contracts/observations/38D-4-workbook-validation-criteria.md).

| Explanation | Applies? | Notes |
|-------------|----------|-------|
| **Retrieval requirement weakened** | **No** | 38D-4 / DLA-WB-11 unchanged; 38F did not edit retrieval clauses |
| **Retrieval requirement omitted from output** | **Yes** | Model did not author retrieval types despite prior 38E10 behaviour |
| **Activity compression side effect** | **Yes** | 4 → 3 activities; practice merged; checklist/task_cards dropped |
| **Model non-compliance** | **Partial** | Single-run variance; pack co-presence not yet explicit for table+scenario **and** retrieval |

**Conclusion:** Dominant blocker **moved** from V-01/V-05 (38E10) to **R3 / DLA-WB-11** (38F) — a **trade-off within token/activity budget**, not a platform or preservation failure.

---

## 8. Programme interpretation

```text
EV-01 (38-B BEFORE)
  │  table-only · 5 activities · R4/R5 absent · Workbook FAIL
  ▼
38E5 (38E-2/3 contracts)
  │  multi-genre uplift · tables + scenario type · worked/consolidation missing
  ▼
38E10 (38E-8/9 function strengthening)
  │  worked + consolidation PASS · retrieval PASS · V-01/V-05 FAIL
  ▼
38F (38F-2 V-01/V-05 refinement)
     V-01/V-05 PASS · table + scenario PASS · retrieval FAIL · Workbook FAIL
```

| Era | Dominant workbook failure | Preservation |
|-----|---------------------------|--------------|
| **EV-01** | Table-only (AP-01); no worked/consolidation | PASS |
| **38E5** | V-03/V-04 (worked/consolidation) | PASS |
| **38E10** | **V-01, V-05** (no table family; scenario in task_cards) | PASS |
| **38F** | **V-10 / R3** (retrieval density; WB-11) | PASS |

**Pattern:** Each targeted pack sprint **fixes the prior dominant rule** and surfaces the **next** contract gap on the same anchor — consistent with **authoring-contract** programme, not downstream compose/render failure.

---

## 9. Recommendation

**Choice: B — Tiny retrieval-refinement sprint**

| Option | Fit | Rationale |
|--------|-----|-----------|
| **A. Close workbook programme** | **No** | Workbook still **FAIL** on anchor; one rule family remains (R3/WB-11) |
| **B. Tiny retrieval-refinement sprint** | **Yes** | Evidence: retrieval present at 38E10, absent at 38F after co-mandating table+scenario; pack-only co-presence fix likely |
| **C. Design Page investigation** | **No** | 38E/38F runs show GAM→page fidelity when genres authored |
| **D. Renderer investigation** | **No** | No render-layer evidence for retrieval loss |
| **E. New pedagogy investigation** | **No** | 38C/38D model sufficient; gap is **contract density**, not new pedagogy |

**Do not** conflate **Preservation PASS** with **Workbook PASS**. **Do not** reopen 38-B architecture or strip 38F-2 / 38E-8/9 rows without charter amendment.

---

## 10. Proposed next sprint

**Sprint 38-G — Retrieval Density Refinement**

| In scope | Out of scope (explicit non-goals) |
|----------|-----------------------------------|
| Retrieval material persistence (`task_cards`, `checklist`, `prompt_set`) | Architecture changes |
| DLA-WB-11 co-presence with 38F-06a/18 and 38E-8/9 rows | Preservation reopening |
| Activity-count / compression effects | Design Page investigation |
| Inflation rerun + final validation | Renderer investigation |
| Dual verdicts (Workbook vs Preservation) | worked/consolidation redesign |

**Entry state:** Pack §5/§6 = 38E-2/3 + 38E-8/9 + **38F-2**; comparators frozen through `EV-38F-AFTER`.

**Success target:** **Workbook PASS** + **Preservation PASS** on Inflation anchor.

---

## 11. Executive summary

**Stakeholder summary (one page)**

**Original problem.** After Sprint 38-E, the Inflation self-study workbook anchor passed worked-example and consolidation rules but still failed workbook validation on **genre diversity (V-01)** and **scenario typing (V-05)**. Preservation of Design Page materials remained stable.

**Intervention path.** Sprint 38-F added minimal learning-design contract text: require at least one table/reference material and a distinct `scenario` Material, without removing worked-example or consolidation obligations from 38-E. No application code, Design Page, or renderer changes were made.

**What improved.** On the post-refinement pipeline run (`EV-38F-AFTER`), **V-01 and V-05 passed**, table and scenario materials appeared in learner output, and worked example, sample output, and consolidation summary **remained**. **Preservation passed** again — materials copy faithfully to the Design Page.

**What remains.** Overall **workbook validation still fails** because **retrieval/checklist materials** that were present on the prior run were **not authored** when table and scenario were restored (three activities instead of four). This is a **contract co-presence** issue, not a platform bug.

**Recommendation.** Proceed with a **small follow-up sprint (38-G)** to keep table, scenario, worked, and consolidation requirements **and** explicitly retain retrieval genres, then re-run the Inflation evaluation. Do **not** close the workbook programme yet; do **not** pivot to Design Page or renderer investigations.

---

## 12. Programme-level conclusions (38-C → 38-F)

| Question | Answer |
|----------|--------|
| **Is workbook quality primarily an authoring-contract problem?** | **Yes.** EV-01 → 38E → 38F shows predictable rule-level movement when pack §5/§6 change; preservation stable throughout. |
| **Is Design Page the primary cause?** | **No.** When GAM authors full bodies, page matches; failures trace to **missing DLA/GAM types**, not compose stripping. |
| **Is renderer the primary cause?** | **No.** Validation uses DLA/GAM/page JSON; renderer not implicated in rule failures. |
| **Is preservation architecture sound?** | **Yes.** V-13 **PASS** on all programme runs since EV-01; B4 passes when tables authored. |

**Collective establishment (38-C → 38-F):**

- **38-C/38-D** defined workbook pedagogy and validation (V-01 … V-13).
- **38-E** proved pack contracts change output and fixed worked/consolidation (38E-8/9).
- **38-F** proved V-01/V-05 fixable by **targeted refinement** without preservation regression.
- **Full PASS** requires **all** rule families co-present — current gap is **retrieval density**, not a new architectural layer.

---

## 13. Closure statement

| Criterion | Met? |
|-----------|------|
| Explicit judgement on 38F hypothesis | **Yes** — **Partially supported** (§4) |
| Explicit judgement on workbook programme progress | **Yes** — material uplift; **Workbook PASS** not yet achieved |
| Clear recommendation | **Yes** — **B** → Sprint **38-G** (§9–§10) |
| Separate Workbook and Preservation reporting | **Yes** — throughout |
| Stakeholder-ready summary | **Yes** — §11 |
| Programme-level conclusions recorded | **Yes** — §12 |

**Sprint 38-F — Workbook Contract Refinement: COMPLETE / CLOSED** (2026-06-04)

| Verdict | Result |
|---------|--------|
| **Sprint scope (V-01, V-05, 38E-8/9, preservation)** | **Achieved** on anchor run |
| **Charter primary (Workbook PASS + Preservation PASS)** | **Partial** — Preservation **PASS**; Workbook **FAIL** (V-10) |
| **Implementation** | Pack §5/§6 + tests only; `app.js` unchanged |
| **Next programme action** | [Sprint 38-G — Retrieval Density Refinement](#10-proposed-next-sprint) |

**Frozen artefacts (do not overwrite):** EV-01 · `EV-38E5-AFTER-*` · `EV-38E10-AFTER-*` · `EV-38F-AFTER-*`
