# Sprint 38-L — Implementation charter (Instructional Function Depth Implementation)

**Date:** 2026-06-05  
**Status:** **CHARTERED**  
**Predecessor:** [Sprint 38-K](../2026-06-05-sprint-38k-instructional-function-depth/) (**CLOSED** — [38K-6](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-6-sprint-closure.md) · **SUCCESS**)

---

## Mission

Implement **instructional sufficiency obligations** (R1–R7) within the existing 38-J architecture so `EV-38L-AFTER` demonstrates materially richer episodes than `EV-38J-AFTER`, approaching [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) **minimum floor**.

**Not:** schema/ACM/renderer/workflow redesign; new archetypes or material types; reopening 38-J episode structure; word-count-only metrics.

---

## Programme question

> How can the existing 38J architecture generate **instructionally sufficient** episodes that approach the 38I-4 benchmark **without architectural change**?

38-I answered **what functions exist**.  
38-J answered **whether they are planned and preserved**.  
38-K answered **how deep each function must be**.  
38-L **implements** depth and closure in pack §5/§6.

---

## Inherited finding (38-K)

> **The architecture is holding.** Remaining gap is **~65–70% thin function population** and **~30–35% missing closure emissions** — not platform capability.

**38-K conclusion (do not re-litigate):**

| Layer | Change required? |
|-------|------------------|
| Schema | **No** |
| ACM | **No** |
| Renderer | **No** |
| Workflow | **No** |
| Pack §5/§6 | **Yes** |

---

## Instructional sufficiency principle

A function reaches **Level 3** when the learner can ([38K-2](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md)):

1. Understand what to do  
2. Understand why it matters  
3. See how expert reasoning works (where modelling applies)  
4. Attempt independently with appropriate scaffold  
5. Check or revise without tutor support  

---

## Architecture

### Stable chain (unchanged)

```text
KM → LO → Episode Archetype → Instructional Function Plan → ACM → DLA → GAM → Workbook Page
```

### Implementation surface

| Surface | Scope |
|---------|--------|
| **Pack §5** | IFP extension: depth floors (R2), emission gates (R4), archetype packs (R5, R6), verification plan (R1) |
| **Pack §6** | GAM-PRES extension: depth-shaped bodies (R3), verification/transfer/closure bodies |
| **Harness** | Evaluate LO/substance alignment (R7) — if pack inference insufficient |
| **Tests** | Prompt-surface assertions as needed (follow 38J-3/38J-4 pattern) |

**Primary file:** `domains/learning-design/domain-learning-design-step-patterns.md`

---

## Core implementation goals

| ID | Goal | Phases |
|----|------|--------|
| **R1** | Universal verification obligation — all activities | 38L-2, 38L-3, 38L-4 |
| **R2** | Level 3 depth floors in DLA `specification` fields | 38L-2 |
| **R3** | Function-shaped GAM body rules (purpose → body template) | 38L-3 |
| **R4** | Closure emission gates (`transfer_prompt`, `template`, `checklist`) | 38L-2, 38L-4 |
| **R5** | Evaluate completion pack (memo, rubric, transfer; not consolidation-only) | 38L-2, 38L-3, 38L-4 |
| **R6** | Analyse worked analytic pass before analysis matrix | 38L-2, 38L-3 |
| **R7** | Evaluate LO/harness household alignment | 38L-1, 38L-4, 38L-5 |

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Schema expansion | Per 38-K hold |
| ACM redesign | 38G-2 frozen |
| Renderer / `app.js` | 38H hold |
| New workflow steps | Internal prompt depth only |
| New material types | Existing catalogue |
| New archetypes | Four from 38-I |
| Removing/weakening IFP/GAM-PRES | Extend only ([38J-3](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md), [38J-4](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md)) |
| Full 38I-4 benchmark length in one sprint | Minimum sufficiency floor first |

---

## Implementation permissions by phase

| Phase | Pack / code changes | Notes |
|-------|---------------------|--------|
| **38L-1** | **None** | Planning review — map R1–R7 to §5/§6 edit plan |
| **38L-2** | **Pack §5** | DLA depth floors + emission gates |
| **38L-3** | **Pack §6** | GAM depth-shaped bodies |
| **38L-4** | **Pack §5/§6** | Closure packs; R7 harness if needed |
| **38L-5** | **Harness / artefacts** | `EV-38L-AFTER` proof run + comparator |
| **38L-6** | **Docs only** | Closure |

---

## Phases

### 38L-1 — Implementation planning review

| Field | Content |
|-------|---------|
| **Purpose** | Translate [38K-5](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md) into concrete §5/§6 edit plan; confirm no architecture reopening |
| **Deliverable** | `observations/38L-1-implementation-planning-review.md` |
| **Rule** | **No pack edits** |
| **Status** | **COMPLETE** |

---

### 38L-2 — DLA depth-floor implementation

| Field | Content |
|-------|---------|
| **Purpose** | Implement R2, R4, R5 (planning), R6 (planning), R1 (planning) in §5 IFP |
| **Deliverable** | `observations/38L-2-dla-depth-floor-implementation.md` |
| **Depends on** | 38L-1 |
| **Status** | **COMPLETE** |
| **Authority** | [38K-3](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md) · [38K-4](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md) |

---

### 38L-3 — GAM depth-shaped body implementation

| Field | Content |
|-------|---------|
| **Purpose** | Implement R3, R1 (bodies), R5/R6 (body shapes) in §6 GAM-PRES |
| **Deliverable** | `observations/38L-3-gam-depth-shaped-body-implementation.md` |
| **Depends on** | 38L-2 |
| **Status** | **COMPLETE** |

---

### 38L-4 — Closure-function implementation

| Field | Content |
|-------|---------|
| **Purpose** | Complete closure packs; R7 Evaluate LO/harness alignment; anti-patterns (consolidation ≠ judgement) |
| **Deliverable** | `observations/38L-4-closure-function-implementation.md` |
| **Depends on** | 38L-3 |
| **Status** | **NEXT** |

---

### 38L-5 — Inflation proof run and evaluation

| Field | Content |
|-------|---------|
| **Purpose** | Capture `EV-38L-AFTER-*`; compare vs `EV-38J-AFTER`, `EV-38G-AFTER`, 38I-4 |
| **Deliverable** | `observations/38L-5-inflation-proof-run.md` · `artefacts/EV-38L-AFTER-*` |
| **Depends on** | 38L-4 |
| **Success checks** | Verification all activities; A4 judgement artefacts; A3 worked pass; transfer on Evaluate |

---

### 38L-6 — Closure

| Field | Content |
|-------|---------|
| **Purpose** | Evidence-backed closure; residual gaps; forward plan |
| **Deliverable** | `observations/38L-6-sprint-closure.md` |
| **Depends on** | 38L-5 |

---

## Phase dependency graph

```text
38L-1 Planning review
    → 38L-2 DLA depth-floor
        → 38L-3 GAM depth-floor
            → 38L-4 Closure functions
                → 38L-5 Proof run (EV-38L-AFTER)
                    → 38L-6 Closure
```

---

## Success criterion

A fresh Inflation rerun (`EV-38L-AFTER`) demonstrates **materially richer** instructional episodes than `EV-38J-AFTER`, including:

| Requirement | Evidence |
|-------------|----------|
| Verification on **all** activities | `checklist`/rubric Material at Level 3+ |
| Stronger Analyse modelling | Worked analytic pass on A3 |
| Evaluate judgement artefacts | Independent memo + rubric + transfer on A4 |
| Transfer and closure functions | Not cognition-field-only |
| Movement toward 38I-4 | Per [38K-3](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md) minimum L3 profile |

---

## Hold conditions

| Hold | Source |
|------|--------|
| IFP mandatory planning | [38J-3](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md) |
| GAM-PRES preservation | [38J-4](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md) |
| Anti-spoiler | 38H GAM-WB-06b |
| Table/scenario rows | 38F V-01 / V-05 |
| Frozen comparators | `EV-38G-AFTER-*` · `EV-38J-AFTER-*` |

---

## References

- [38K-1](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-1-baseline-depth-analysis.md) · [38K-5](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md)  
- [38J-5](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md) · [38J-6](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md)  
- [38I-4 targets](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38I-4 A4](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)
