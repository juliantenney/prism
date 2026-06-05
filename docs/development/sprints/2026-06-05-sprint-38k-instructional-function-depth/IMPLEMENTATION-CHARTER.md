# Sprint 38-K — Implementation charter (Instructional Function Depth and Episode Richness)

**Date:** 2026-06-05  
**Status:** **CLOSED** — **SUCCESS** ([38K-6](observations/38K-6-sprint-closure.md)) · **Successor [38-L CHARTERED](../2026-06-05-sprint-38l-instructional-function-depth-implementation/)**  
**Predecessor:** [Sprint 38-J](../2026-06-05-sprint-38j-instructional-function-planning/) (**CLOSED** — [38J-6](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md) · **SUCCESS**)

---

## Mission

Define **depth contracts** and **population richness rules** so generated workbook episodes move materially closer to [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) **while preserving** the 38-J architecture (IFP + GAM-PRES, no schema expansion).

**Not:** word-count targets as primary success metric; schema/ACM/renderer/workflow redesign; new archetypes or material types; reopening 38-J structure unless evidence demands it.

---

## Programme question

> How much teaching should each instructional function contain for a solo learner to experience **substantial self-directed instruction**?

38-I answered **what functions exist**.  
38-J answered **whether they are planned and preserved**.  
38-K answers **how deep each function must be populated**.

---

## Inherited finding (38-J)

> **38-J solved episode structure.** `EV-38J-AFTER` shows recognisable episode shapes vs `EV-38G-AFTER`. Remaining gap is **population depth** and **structural emission** (verification, transfer, independent judgement) — not platform capability.

**Structural vs depth (carry forward):**

| Gap type | Example from 38J-5 |
|----------|-------------------|
| **Structural** | No `transfer_prompt` Material; no independent judgement `template`; missing verification `checklist` |
| **Population-depth** | Present functions with thin bodies; guided table without partial exemplar; exposition without discrimination practice |

38-K must treat both — depth model first, then archetype rules, then implementation implications.

---

## Instructional sufficiency principle

A function is **deep enough** when the learner can:

1. **Understand** what to do  
2. **See** why it matters in this episode  
3. **Follow** how expert reasoning works (where modelling applies)  
4. **Attempt** the step independently with appropriate scaffold fade  
5. **Check or revise** the response without tutor intervention  

Word count may **indicate** sufficiency but is not the goal. Cues, labels, and checklist stubs without teaching content are **shallow** regardless of length.

---

## Architecture (unchanged)

```text
KM → LO → ACM → DLA (IFP) → GAM (GAM-PRES) → Workbook Page
```

38-K designs **prompt-level depth obligations** that extend IFP population and GAM realisation — not new layers.

---

## Initial analysis scope

| # | Item | Authority |
|---|------|-----------|
| 1 | `EV-38J-AFTER` vs 38I-4 per-function depth comparison | [38J-5](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md) |
| 2 | Per-function minimum expectations | [38I-2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) sequences |
| 3 | Archetype depth profiles | Understand / Apply / Analyse / Evaluate |
| 4 | Evaluate richness benchmark | [38I-4 A4](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |
| 5 | Apply depth benchmark | 38I-4 A2 + `EV-38J-AFTER` A2 (38J win — deepen not redesign) |
| 6 | Activity-position effects | Session arc × depth fade ([38J-2 ARC](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-2-function-plan-prompt-design.md)) |
| 7 | LO/harness alignment for Evaluate | [38J-6 §5](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md) |

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Schema expansion | Per 38-I / 38-J hold |
| ACM redesign | 38G-2 frozen |
| Renderer changes | 38-H hold |
| New workflow steps | Internal prompt depth only |
| New material types | Use existing GAM catalogue |
| New archetypes | Four from 38-I |
| Word-count-only metrics | Sufficiency rubric required |
| Re-litigating 38-J IFP/GAM-PRES | Extend depth; do not remove |
| Implementation in 38-K v1 | 38K-5 recommends; separate implementation sprint if needed |

---

## Implementation permissions by phase

| Phase | Pack / code changes | Notes |
|-------|---------------------|--------|
| **38K-1** | **None** | Baseline depth analysis only |
| **38K-2** | **Draft in observations** | Function depth model |
| **38K-3** | **Draft in observations** | Archetype depth rules |
| **38K-4** | **Draft in observations** | Before/after depth examples |
| **38K-5** | **Draft in observations** | Implementation implications — may recommend §5/§6 deltas |
| **38K-6** | **Docs only** | Closure + next step |

**Primary production surface (future implementation):** `domains/learning-design/domain-learning-design-step-patterns.md` §5/§6 — **after** 38-K design complete.

---

## Phases

### 38K-1 — Baseline depth analysis

| Field | Content |
|-------|---------|
| **Purpose** | Compare `EV-38J-AFTER` vs 38I-4 mock-ups; identify shallow functions; separate structural vs population-depth gaps |
| **Deliverable** | `observations/38K-1-baseline-depth-analysis.md` |
| **Rule** | **No implementation** |
| **Status** | **COMPLETE** |

---

### 38K-2 — Function depth model

| Field | Content |
|-------|---------|
| **Purpose** | Minimum sufficiency expectations per instructional function (explanation, worked thinking, misconception challenge, guided practice, verification, transfer, judgement, etc.) |
| **Deliverable** | `observations/38K-2-function-depth-model.md` |
| **Depends on** | 38K-1 |
| **Status** | **COMPLETE** |

---

### 38K-3 — Archetype-specific depth rules

| Field | Content |
|-------|---------|
| **Purpose** | Map depth floors across Understand, Apply, Analyse, Evaluate; activity-position modifiers |
| **Deliverable** | `observations/38K-3-archetype-specific-depth-rules.md` |
| **Depends on** | 38K-2 |
| **Status** | **COMPLETE** |

---

### 38K-4 — Target-state depth examples

| Field | Content |
|-------|---------|
| **Purpose** | Focused before/after examples — especially A2 Apply and A4 Evaluate |
| **Deliverable** | `observations/38K-4-target-state-depth-examples.md` (+ optional `observations/artefacts/`) |
| **Depends on** | 38K-3 |
| **Status** | **COMPLETE** |

---

### 38K-5 — Implementation implications

| Field | Content |
|-------|---------|
| **Purpose** | Recommend prompt-level changes to increase depth while preserving 38J architecture |
| **Deliverable** | `observations/38K-5-implementation-implications.md` |
| **Depends on** | 38K-4 |
| **Status** | **COMPLETE** |

---

### 38K-6 — Closure

| Field | Content |
|-------|---------|
| **Purpose** | Evidence-backed depth model summary; remaining gaps; next implementation step |
| **Deliverable** | `observations/38K-6-sprint-closure.md` |
| **Depends on** | 38K-5 |
| **Status** | **COMPLETE** |

---

## Phase dependency graph

```text
38K-1 Baseline depth analysis
    → 38K-2 Function depth model
        → 38K-3 Archetype depth rules
            → 38K-4 Target-state depth examples
                → 38K-5 Implementation implications
                    → 38K-6 Closure
```

---

## Success criterion

38-K produces an **evidence-backed depth model** that explains how generated workbook episodes can move **materially closer** to 38I-4 mock-ups **while preserving** the 38-J architecture (IFP, GAM-PRES, stable chain, no schema).

---

## Hold conditions (from 38-J)

| Hold | Source |
|------|--------|
| IFP mandatory planning | [38J-3](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md) |
| GAM-PRES preservation | [38J-4](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md) |
| Anti-spoiler | 38H GAM-WB-06b |
| Table/scenario rows | 38F V-01 / V-05 |
| Frozen comparators | EV-38G · EV-38J-AFTER |

---

## References

- [38J-6 closure](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md)  
- [38J-5 proof run](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)  
- [38I-4 targets](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)  
- [38I-2 episode model](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)
