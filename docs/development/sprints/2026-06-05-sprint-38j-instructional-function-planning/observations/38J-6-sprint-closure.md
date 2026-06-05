# Slice 38J-6 — Sprint closure

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Sprint:** **38-J — Instructional Function Planning Implementation** — **CLOSED**  
**Type:** Retrospective and forward plan only — no implementation  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)  
**Predecessor:** [Sprint 38-I](../2026-06-05-sprint-38i-instructional-episode-model/) (**CLOSED** — [38I-6](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-6-sprint-closure.md))  
**Successor:** [Sprint 38-K — Instructional Function Depth and Episode Richness](../../2026-06-05-sprint-38k-instructional-function-depth/) (**CHARTERED**)

---

## §1 Sprint summary

Sprint 38-J implemented the instructional function planning layer designed in Sprint 38-I and measured the result on the Inflation anchor.

| Phase | Deliverable | What it established |
|-------|-------------|---------------------|
| **38J-1** | [38J-1-baseline-inspection.md](38J-1-baseline-inspection.md) | DLA plans material checklists + task verbs; GAM faithful but cannot recover missing choreography; §5/§6 insertion points identified |
| **38J-2** | [38J-2-function-plan-prompt-design.md](38J-2-function-plan-prompt-design.md) | IFP-00..08, KM triggers, inference contracts, anti-shell/anti-spoiler, session arc, DLA-WB-22..25 design — draft only |
| **38J-3** | [38J-3-dla-implementation.md](38J-3-dla-implementation.md) | Pack §5 IFP mandatory planning; archetype templates; DLA-WB-22..25; tests 18/18 |
| **38J-4** | [38J-4-gam-implementation.md](38J-4-gam-implementation.md) | Pack §6 GAM-PRES preservation; GAM-WB-22..25; F8 no-collapse; tests 23/23 |
| **38J-5** | [38J-5-inflation-proof-run.md](38J-5-inflation-proof-run.md) · `artefacts/EV-38J-AFTER-*` | Full pipeline capture; vs `EV-38G-AFTER` comparator; proof-run verdict **C (substantial improvement)** |
| **38J-6** | This document | Closure; 38-K recommendation |

**Programme arc within 38-J:**

```text
Inspect (38J-1) → Design (38J-2) → Implement DLA (38J-3) → Implement GAM (38J-4) → Prove (38J-5) → Close (38J-6)
```

**Proof artefacts (frozen — do not overwrite):** `EV-38J-AFTER-*` · comparator `EV-38J-vs-38G-comparison.json` · harness `ev-38j-inflation-pipeline-capture-once.mjs`

---

## §2 Hypothesis evaluation

**Central hypothesis:**

> Instructional Function Planning can transform activity-shell generation into instructional-episode generation **without** schema, ACM, renderer, or workflow changes.

### Verdict: **Partially confirmed**

| Aspect | Assessment | Evidence |
|--------|------------|----------|
| **Shell → episode (form)** | **Confirmed** | `EV-38J-AFTER` A1–A3 pass anti-shell; A4 has criteria → perspectives → worked judgement → guided table vs 38G consolidation-only |
| **Episode recognisability** | **Confirmed** | Segmented `learner_task`; function-ordered `required_materials`; 14 GAM materials vs 10 on 38G |
| **38I-4 target density** | **Not confirmed** | ~2–3× improvement vs 38G; not ~8× vs [38I-4 targets](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) |
| **A4 household Evaluate** | **Not confirmed** | Evaluate **shape** present; LO drove **policy communication** not [38I-4 A4 household episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |
| **No architecture expansion** | **Confirmed** | No schema, ACM, renderer, workflow, or `app.js` changes; pack §5/§6 only |

**Supporting proof-run metrics:**

| Metric | EV-38G-AFTER | EV-38J-AFTER |
|--------|--------------|--------------|
| GAM materials | 10 | **14** |
| DLA prompt chars | 15,755 | **23,718** (+50%) |
| A2 `worked_example` | Absent | **Present** |
| A4 spoiler consolidation | Model essay | **Scaffold prompts** |
| GAM function collapse | N/A | **None (F8)** |

**Conclusion:** IFP + GAM-PRES **changes the generation behaviour** from shells to episode-shaped output on the Inflation anchor. The hypothesis holds for **architectural feasibility** and **directional pedagogy**. It does **not** yet hold for **consistent 38I-4-class richness** — especially Evaluate independent judgement, transfer, and verification depth.

---

## §3 Architecture findings

| Layer | Changes required by 38-J evidence? | Conclusion |
|-------|-----------------------------------|------------|
| **JSON schema** | **No** | Existing `activities[]`, `required_materials`, cognition fields, and GAM Material types sufficient |
| **ACM** | **No** | [38G-2](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) bridge unchanged; IFP maps to existing surfaces |
| **Renderer / Design Page** | **No** | [38H-5](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-5-sprint-closure.md) preservation path holds; gaps are upstream emission |
| **Workflow steps** | **No** | IFP remains **internal §5 logic**; GAM-PRES **internal §6 logic** — no new external step |
| **Persistent IFP artefact** | **No** (v1) | Mental/scratch planning → existing fields; no evidence yet that stored plan improves reliability |

**Stable chain (validated):**

```text
KM → LO → ACM → DLA (IFP) → GAM (GAM-PRES) → Page
```

**Architecture conclusion:** Episode richness is a **prompt planning and population problem**, not a platform capability problem. Further gains should target **depth contracts and LO/harness alignment** before schema or renderer investment.

---

## §4 Pedagogical findings

Observed improvements on `EV-38J-AFTER` vs `EV-38G-AFTER`:

### Understand (A1)

| Function | 38G | 38J |
|----------|-----|-----|
| Exposition | In worked_example only | **Dedicated `text` + worked_example** |
| Misconception handling | `support_note` | **Section in worked_example** |
| Learner journey | Single imperative | **Segmented teach → model → write** |
| Verification | task_cards checklist | **Missing** (regression vs partial 38G) |

**Improvement:** Clear Understand teaching before performance. **Gap:** Non-example, classification, verification per 38I-4 A1.

### Apply (A2)

| Function | 38G | 38J |
|----------|-----|-----|
| Worked thinking | **Absent** | **Full stepped CPI calculation** |
| Guided practice | Table only | **Worked → sample → partial table** |
| KM-T03 (process ≥3) | Not satisfied | **Satisfied** |

**Improvement:** **Largest single-activity win** — directly fixes 38I/38G A2 failure mode.

### Analyse (A3)

| Function | 38G | 38J |
|----------|-----|-----|
| Scenario | Present | **Present + inflation context** |
| Analytic matrix | Present | **Present + justification column** |
| Guided inquiry | checklist | **prompt_set** (5 questions) |
| Worked analytic pass | Absent | **Still absent** |

**Improvement:** Richer scenario framing and guided inquiry. **Gap:** Worked analytic thinking; checklist verification dropped.

### Evaluate (A4)

| Function | 38G | 38J |
|----------|-----|-----|
| Criteria exposition | Absent | **4 criteria in text** |
| Perspectives | Absent | **2 policy scenarios** |
| Worked judgement | Absent | **Weak vs strong modelling_note** |
| Guided judgement | Absent | **Partial decision_table** |
| Independent judgement | Absent | **Absent** |
| Verification | Absent | **Absent** |
| Transfer | Field only | **No transfer_prompt Material** |
| Anti-spoiler | **FAIL** | **PASS** (scaffold consolidation) |

**Improvement:** Evaluate **episode shape** replaces summary-only capstone; anti-spoiler preserved. **Gap:** Wrong substantive anchor (policy vs household); missing independent memo, rubric verification, transfer.

---

## §5 Remaining gaps

### Structural gaps (missing functions in plan/emission)

| Gap | Activities | Evidence |
|-----|------------|----------|
| Verification checklist / rubric | A1, A4 | No `checklist` or `quality_criteria` Material when Evaluate/Understand require ≥4 checks |
| Independent judgement scaffold | A4 | No `template`/`task_cards` memo structure for learner-written judgement |
| Transfer material | A1, A4 | `transfer_or_application_task` in cognition fields but no `transfer_prompt` row |
| Non-example / classification | A1 | Understand template functions not fully populated |
| Worked analytic pass | A3 | Analyse template missing worked thinking before matrix |
| Evaluate LO alignment | A4 | LO *Summarize policy communication* ≠ household strategy Evaluate per 38I-4 |

### Population-depth gaps (function present but thin)

| Gap | Evidence |
|-----|----------|
| Instructional density | GAM bodies longer than 38G but below 38I-4 ~950-word A1 integrated target |
| Worked reasoning depth | A2 strong; A3 lacks analytic worked pass |
| Guided reasoning depth | A3 prompt_set good; A4 guided table present but no partial exemplar cells |
| Verification depth | Table completion substitutes for explicit rubric checkpoints |
| Transfer depth | Cognition field rhetoric only |
| Evaluate richness | Form without independent judgement + transfer + verification = partial Evaluate |

**Key distinction:** 38-J fixed **whether** episodes are planned and preserved. 38-K must fix **how fully** each function is populated and **whether LO/harness contracts anchor the right Evaluate content**.

---

## §6 Successor sprint recommendation

### Recommend **Sprint 38-K — Instructional Function Depth and Episode Richness**

**Rationale:**

1. **38-J proved the layer works** — IFP + GAM-PRES change outputs without architecture expansion.  
2. **Remaining failures are depth and contract failures**, not missing workflow or renderer.  
3. **Evaluate is still the bottleneck** — shape improved; household A4 benchmark not met.  
4. **Harness/LO alignment** — proof run LO set did not include explicit *Evaluate household strategies* verb; successor should tighten LO contract and optional frozen LO set for comparator runs.  
5. **No reopening of 38-J architecture** — extend depth obligations in pack §5/§6 and harness brief, not schema.

**Proposed 38-K focus areas (charter draft — not started here):**

| Area | Intent |
|------|--------|
| Function depth floors | Per-archetype minimum body depth (worked, guided, verification, transfer) |
| Evaluate LO contract | Harness + pack alignment to household Evaluate anchor |
| Structural emission rules | Mandatory `transfer_prompt`, `checklist`/`template` when IFP flags function |
| Second proof run | `EV-38K-AFTER` vs `EV-38J-AFTER` + 38I-4 targets |
| Population vs structure audit | Separate structural missing-function failures from thin-body failures |

---

## §7 Final verdict

### **C. Successful**

| Criterion | Met? |
|-----------|------|
| IFP implemented in §5 | Yes — [38J-3](38J-3-dla-implementation.md) |
| GAM preservation in §6 | Yes — [38J-4](38J-4-gam-implementation.md) |
| Inflation proof run captured | Yes — [38J-5](38J-5-inflation-proof-run.md) |
| Comparator improvement documented | Yes — substantial vs 38G |
| Architecture unchanged | Yes |
| Central hypothesis | **Partially confirmed** — sufficient for sprint success |

**Not A (Failed):** Clear measurable improvement; anti-shell broken on A1–A3; A4 Evaluate form emerged.  
**Not B (Partial) for sprint closure:** All charter phases delivered; implementation complete.  
**Not D (Transformational):** 38I-4 target density and A4 household benchmark not achieved.

**Sprint 38-J succeeded** at its charter scope: implement IFP, preserve through GAM, and produce evidence that episode-shaped generation is achievable without platform changes. **Transformational** richness remains programme work for 38-K.

---

## §8 Handover — starting point for 38-K

### Read first

1. [38J-5 inflation proof run](38J-5-inflation-proof-run.md) — §8 recommendations  
2. [38J-3 DLA implementation](38J-3-dla-implementation.md) — do not weaken IFP  
3. [38J-4 GAM implementation](38J-4-gam-implementation.md) — do not weaken GAM-PRES  
4. [38I-4 A4 learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) — Evaluate benchmark  
5. `artefacts/EV-38J-AFTER-*` — post-38J comparator baseline  

### Frozen comparators (do not overwrite)

`EV-01` · `EV-38E5-AFTER-*` · `EV-38E10-AFTER-*` · `EV-38F-AFTER-*` · `EV-38G-AFTER-*` · `EV-38H-AFTER-knowledge-model.json` · **`EV-38J-AFTER-*`**

### 38-K entry actions (when chartered)

1. Charter sprint pack `2026-06-05-sprint-38k-instructional-function-depth` (or equivalent date).  
2. **38K-1:** Depth gap analysis — structural vs population matrix from 38J-5 §8.  
3. **38K-2:** Depth contract design — per-function minimums; Evaluate LO/harness contract.  
4. **38K-3:** Pack §5/§6 depth implementation (minimal delta on IFP/GAM-PRES).  
5. **38K-4:** `EV-38K-AFTER` proof run vs `EV-38J-AFTER` + 38I-4.  
6. **38K-5:** Closure.

### Hold conditions (carry forward)

- 38H anti-spoiler (GAM-WB-06b)  
- 38F V-01/V-05 table/scenario rows  
- 38G ACM frozen  
- No schema/ACM/renderer unless 38-K evidence demands it  

---

## References

- [38J-1](38J-1-baseline-inspection.md) · [38J-2](38J-2-function-plan-prompt-design.md) · [38J-3](38J-3-dla-implementation.md) · [38J-4](38J-4-gam-implementation.md) · [38J-5](38J-5-inflation-proof-run.md)  
- [38I-6 closure](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-6-sprint-closure.md)  
- Pack: `domains/learning-design/domain-learning-design-step-patterns.md` §5/§6  
- Tests: `tests/workbook-contract-prompt-surface.test.js` (23/23 at 38J close)
