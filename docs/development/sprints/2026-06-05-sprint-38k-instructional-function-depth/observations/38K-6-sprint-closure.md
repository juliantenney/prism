# Slice 38K-6 — Sprint closure

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Sprint:** **38-K — Instructional Function Depth and Episode Richness** — **CLOSED**  
**Type:** Retrospective and forward plan only — no implementation  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)  
**Predecessor:** [Sprint 38-J](../2026-06-05-sprint-38j-instructional-function-planning/) (**CLOSED** — [38J-6](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md) · **SUCCESS**)  
**Successor:** **Sprint 38-L — Instructional Function Depth Implementation** (**RECOMMENDED** — not chartered)

---

## §1 Sprint summary

Sprint 38-K investigated why `EV-38J-AFTER` — produced after successful IFP and GAM-PRES — remains substantially below [38I-4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) target-state richness, and defined what generation must add to close that gap **without** architecture expansion.

| Phase | Deliverable | What it established |
|-------|-------------|---------------------|
| **38K-1** | [38K-1-baseline-depth-analysis.md](38K-1-baseline-depth-analysis.md) | `EV-38J-AFTER` vs 38I-4 per activity; structural vs depth split; dominant bottleneck **B (thin population)** |
| **38K-2** | [38K-2-function-depth-model.md](38K-2-function-depth-model.md) | Level 0–4 scale; 28 function contracts; five-dimension sufficiency test; leverage ranking |
| **38K-3** | [38K-3-archetype-specific-depth-rules.md](38K-3-archetype-specific-depth-rules.md) | Per-archetype Level 3 floors; Understand/Apply/Analyse/Evaluate profiles; cross-archetype matrix |
| **38K-4** | [38K-4-target-state-depth-examples.md](38K-4-target-state-depth-examples.md) | E1–E4 before/after learner-facing demonstrations; closure as primary thinness driver |
| **38K-5** | [38K-5-implementation-implications.md](38K-5-implementation-implications.md) | R1–R7 required upgrades; §5/§6 production surface; architecture hold; 38-L handover |
| **38K-6** | This document | Closure; 38-L recommendation |

**Investigation arc:**

```text
Diagnose (38K-1) → Model depth (38K-2) → Archetype rules (38K-3)
  → Demonstrate (38K-4) → Recommend implementation (38K-5) → Close (38K-6)
```

**Frozen baselines (do not overwrite):** `EV-38G-AFTER-*` · `EV-38J-AFTER-*` · [38I-4 targets](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)

**Future proof prefix (successor sprint):** `EV-38L-AFTER-*` (recommended naming)

---

## §2 Hypothesis evaluation

**Central hypothesis:**

> The remaining gap between `EV-38J-AFTER` and the 38I-4 target-state episodes can be explained primarily through **instructional-function depth and closure obligations** rather than **architectural deficiencies**.

### Verdict: **Partially confirmed**

| Aspect | Assessment | Evidence |
|--------|------------|----------|
| **Gap primarily depth/closure** | **Confirmed** | ~65–70% thin population; closure functions (verification, transfer, independent judgement) Level 0 on 38J ([38K-1](38K-1-baseline-depth-analysis.md) §1, §8) |
| **Structural emission secondary but real** | **Confirmed** | ~30–35% — missing Material rows, not renderer loss ([38K-1](38K-1-baseline-depth-analysis.md) §6; [38K-5](38K-5-implementation-implications.md) §6) |
| **No architectural deficiency** | **Confirmed** | A2 Level 4 worked example on existing types; 38I-4 plausibility on frozen ACM ([38K-1](38K-1-baseline-depth-analysis.md) §8; [38K-5](38K-5-implementation-implications.md) §9) |
| **Depth/closure alone sufficient for 38I-4 benchmark** | **Not confirmed** | Evaluate **substance contract** (household vs policy LO) is cross-cutting; full benchmark length/richness not proven without implementation run |
| **Generation can close gap materially** | **Confirmed (design level)** | [38K-4](38K-4-target-state-depth-examples.md) E1–E4 show minimum L3 floors achievable in existing surfaces; [38K-5](38K-5-implementation-implications.md) roadmap |

**Conclusion:** The hypothesis holds for **explanation** of the current gap and for **feasibility** of improvement via §5/§6 extensions. It does **not** yet hold as **proven implementation outcome** — that requires Sprint 38-L proof run.

---

## §3 Core findings

| Finding | Detail | Authority |
|---------|--------|-----------|
| **Dominant bottleneck** | **Thin function population** (~65–70%) — functions emitted but below Level 3; empty scaffolds; cognition-only transfer | [38K-1](38K-1-baseline-depth-analysis.md) §8 |
| **Structural vs depth split** | **Mixed** — ~30–35% missing emissions (verification, transfer, independent judgement, worked analytic pass) | [38K-1](38K-1-baseline-depth-analysis.md) §6 |
| **Universal verification** | Verification **Level 0 on all four** Inflation activities — blocks check/revise for solo learners; highest cross-archetype leverage | [38K-1](38K-1-baseline-depth-analysis.md) §7; [38K-4](38K-4-target-state-depth-examples.md) §5 |
| **Analyse worked-pass** | A3 has scenario + inquiry but **no worked analytic pass** — largest analytic teaching gap; matrix feels like worksheet | [38K-1](38K-1-baseline-depth-analysis.md) §4; [38K-4 E3](38K-4-target-state-depth-examples.md) |
| **Evaluate completion** | A4 has Evaluate **shape** (criteria, perspectives, modelling) but **3/10** Required functions at floor; consolidation substitutes for independent judgement; transfer absent | [38K-3](38K-3-archetype-specific-depth-rules.md) §6; [38K-4 E4](38K-4-target-state-depth-examples.md) |
| **Apply proof point** | A2 worked example **Level 4** — pipeline delivers depth when IFP specifies it; extend closure, do not redesign | [38K-3](38K-3-archetype-specific-depth-rules.md) §4; [38K-4 E2](38K-4-target-state-depth-examples.md) |
| **Present ≠ sufficient** | Episode structure from 38J necessary but insufficient; Level 3 floor per [38K-3](38K-3-archetype-specific-depth-rules.md) required | [38K-2](38K-2-function-depth-model.md) §1 |

**Programme sentence:**

```text
38-J solved episode structure.
38-K defined episode sufficiency.
38-L must implement depth and closure obligations.
```

---

## §4 Architecture findings

| Layer | Changes required? | Conclusion | Evidence |
|-------|-------------------|------------|----------|
| **Schema (KM/LO/DLA)** | **No** | Depth obligations live in `specification` prose and planning behaviour | [38J-3](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md); [38K-5](38K-5-implementation-implications.md) §7 |
| **ACM** | **No** | 38I-4 targets use existing material types: `checklist`, `template`, `transfer_prompt`, `modelling_note`, etc. | [38I-4 evaluation questions](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); [38K-5](38K-5-implementation-implications.md) §9 |
| **Renderer / app.js** | **No** | `EV-38J-AFTER-workbook.md` carries emitted bodies; gaps are upstream | [38K-1](38K-1-baseline-depth-analysis.md) §8 |
| **Workflow** | **No** | No new pipeline step; IFP remains internal §5 logic | 38-J hold; [38K-5](38K-5-implementation-implications.md) §2 |
| **Pack §5/§6 prompts** | **Yes (successor)** | **Only** recommended implementation surface | [38K-5](38K-5-implementation-implications.md) §3 R1–R7 |

**Stable chain (unchanged):**

```text
KM → LO → ACM → DLA (IFP + depth floors) → GAM (GAM-PRES + depth bodies) → Workbook Page
```

---

## §5 Pedagogical findings

### What 38K established

| Topic | Finding |
|-------|---------|
| **Instructional sufficiency** | Five-dimension test: what, why, expert reasoning, independent attempt, check/revise — word count is indicator only ([38K-2](38K-2-function-depth-model.md) §1) |
| **Depth floors** | **Level 3** minimum for every Required function per archetype ([38K-3](38K-3-archetype-specific-depth-rules.md)) |
| **Archetype differences** | Evaluate: 10 Required L3+ functions; Apply: extend A2; Analyse: worked pass; Understand: discrimination ladder |
| **Closure functions** | Verification, transfer, independent judgement disproportionately missing — 38J fixed **middle** of episodes, not **end** |
| **Self-directed learning** | Solo learners need explicit self-check and repair paths — cannot rely on tutor or table completion as verification |

### Most important pedagogical insight

> **Episode structure teaches the journey; closure functions teach whether the learner can continue alone.**

38-J made episodes **recognisable**. 38-K showed they are not yet **self-sufficient** because verification, transfer, and owned judgement artefacts are largely absent. Richness is not more materials in the middle — it is **completed instructional loops** at each archetype's closure.

---

## §6 Remaining uncertainties

| # | Uncertainty | Why unknown | Resolution |
|---|-------------|-------------|------------|
| 1 | **Depth-floor implementation reliability** | 38K is design-only; models may thin bodies despite specs | `EV-38L-AFTER` proof run |
| 2 | **Token/prompt budget at richer depth** | 38J already +50% DLA / +56% GAM vs 38G; depth adds Materials | Measure on 38-L capture |
| 3 | **Renderer/page perception** | Richer outputs not yet generated; 38H fidelity assumed sufficient | Post-38L workbook review |
| 4 | **Residual gap to 38I-4 after implementation** | [38K-5](38K-5-implementation-implications.md) estimates ~1.3–1.8× to full benchmark — qualitative only | Comparator matrix vs 38I-4 |
| 5 | **Evaluate substance vs depth interaction** | 38J LO drove policy not household; harness fix untested | Frozen household Evaluate LO on 38-L run |
| 6 | **KM richness vs depth spec** | 38J used 5-concept KM; optional KM swap not run | Optional `EV-38H-AFTER` KM injection |

**Not speculated:** Whether schema/ACM/renderer changes will become necessary — 38K evidence says **no** for minimum floor; 38-L may challenge that only with new evidence.

---

## §7 Successor sprint recommendation

### **Sprint 38-L — Instructional Function Depth Implementation** (**RECOMMENDED**)

**Not chartered in this closure.** Charter pack to be created when requested.

| Field | Content |
|-------|---------|
| **Mission** | Implement [38K-5](38K-5-implementation-implications.md) R1–R7 in pack §5 IFP and §6 GAM-PRES; produce `EV-38L-AFTER` inflation proof run |
| **Predecessor** | Sprint 38-K (**CLOSED** — this document) |
| **Design authority** | 38K-2 depth scale · 38K-3 archetype floors · 38K-4 examples · 38K-5 roadmap |
| **In scope** | Depth-floor enforcement in DLA specs; closure emission gates; verification universal obligation; Evaluate completion pack; Analyse worked-pass obligation; Evaluate LO/harness substance contract; inflation rerun |
| **Out of scope** | Schema, ACM, renderer, workflow, new archetypes, new material types, weakening 38J IFP/GAM-PRES |
| **Success criterion** | All four activities meet 38K-3 minimum L3 profile on Required functions; verification on all; A4 household Evaluate anchor; measurable improvement vs `EV-38J-AFTER` |

**Expected phases (draft):**

```text
38L-1 Pack §5 depth-floor + emission gates
38L-2 Pack §6 depth-shaped GAM bodies
38L-3 Harness/LO Evaluate contract (if needed)
38L-4 Inflation proof run → EV-38L-AFTER-*
38L-5 Comparator report vs EV-38J + 38I-4
38L-6 Closure
```

---

## §8 Final verdict

### **C. Successful**

| Criterion | Met? | Evidence |
|-----------|:----:|----------|
| All charter phases delivered (38K-1..5) | Yes | Six observation artefacts |
| Dominant bottleneck identified | Yes | Thin population ~65–70% ([38K-1](38K-1-baseline-depth-analysis.md)) |
| Reusable depth model | Yes | [38K-2](38K-2-function-depth-model.md) + [38K-3](38K-3-archetype-specific-depth-rules.md) |
| Concrete demonstrations | Yes | [38K-4](38K-4-target-state-depth-examples.md) E1–E4 |
| Implementation roadmap without architecture change | Yes | [38K-5](38K-5-implementation-implications.md) |
| No implementation in 38-K scope | Yes | Analysis/design only per charter |
| Central hypothesis evaluated | Yes | §2 — partially confirmed |

**Not A (Failed):** Clear evidence-backed model; all deliverables complete; explains 38J→38I-4 gap coherently.

**Not B (Partial) for sprint closure:** Charter scope was **design and recommendations** — fully delivered. Residual gap to 38I-4 is **programme** work (38-L), not 38-K charter failure.

**Not D (Transformational):** No pack implementation, no `EV-38K/38L-AFTER` proof, 38I-4 benchmark not yet reached in generated output.

**Sprint 38-K succeeded** at defining **what instructional sufficiency requires** and **how** existing architecture can move materially closer to 38I-4 through depth and closure obligations alone.

---

## §9 Handover — starting point for Sprint 38-L

### Read first

1. [38K-5 implementation implications](38K-5-implementation-implications.md) — **primary authority**  
2. [38K-3 archetype depth rules](38K-3-archetype-specific-depth-rules.md) — floors per archetype  
3. [38K-4 depth examples](38K-4-target-state-depth-examples.md) — E1–E4 target prose shapes  
4. [38J-3 §5](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md) · [38J-4 §6](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md) — extend, do not weaken  
5. [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) — Evaluate calibration  

### First implementation targets (priority order)

| Priority | Obligation | Ref | Surface |
|:--------:|------------|-----|---------|
| **1** | Universal verification (R1) | 38K-5 §3, 38K-4 E1–E4 | §5 + §6 |
| **2** | Evaluate completion pack (R5) + substance contract (R7) | 38K-4 E4 | §5 + §6 + harness |
| **3** | Depth floors in DLA specifications (R2) | 38K-2 §4, 38K-3 | §5 IFP-08 |
| **4** | GAM depth-shaped bodies (R3) | 38K-5 §3 | §6 |
| **5** | Analyse worked analytic pass (R6) | 38K-4 E3 | §5 + §6 |
| **6** | Apply closure pack (O2) | 38K-4 E2 | §5 + §6 |
| **7** | Understand discrimination pack (O1) | 38K-4 E1 | §5 + §6 |

### Highest-priority obligations (minimum viable 38-L)

**R1 + R5 + R7 + R2** — verification everywhere, Evaluate memo/rubric/transfer, household LO anchor, depth in specs.

### Success measures (38-L proof run)

| Measure | Target |
|---------|--------|
| Verification Material | Present on **all four** activities at Level 3+ |
| A4 independent judgement | `template`/`task_cards` memo — not consolidation-only |
| A4 transfer | `transfer_prompt` Material present |
| A3 worked analytic pass | Material before analysis table |
| Archetype L3 profile | Per [38K-3](38K-3-archetype-specific-depth-rules.md) summary table |
| vs `EV-38J-AFTER` | Documented improvement on closure functions |
| vs 38I-4 | Minimum sufficiency floor met; benchmark distance reported |

### Frozen comparators

- `EV-38G-AFTER-*` — historical shell  
- `EV-38J-AFTER-*` — post-structure baseline  
- 38I-4 mock-ups + A4 episode — target calibration  

---

## References

- [38K-1](38K-1-baseline-depth-analysis.md) · [38K-2](38K-2-function-depth-model.md) · [38K-3](38K-3-archetype-specific-depth-rules.md) · [38K-4](38K-4-target-state-depth-examples.md) · [38K-5](38K-5-implementation-implications.md)  
- [38J-6 closure](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md) · [38J-5 proof](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)  
- [38I-4 targets](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)

---

**Parent:** [38K observations index](README.md) · **Sprint:** **38-K CLOSED** · **Successor:** **38-L RECOMMENDED**
