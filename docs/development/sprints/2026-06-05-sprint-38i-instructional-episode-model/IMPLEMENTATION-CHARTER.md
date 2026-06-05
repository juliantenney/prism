# Sprint 38-I — Implementation charter (Instructional Episode Model)

**Date:** 2026-06-05  
**Status:** **CHARTERED**  
**Predecessor:** [Sprint 38-H](../2026-06-05-sprint-38h-workbook-realisation-fidelity/) (**CLOSED** — [38H-5](../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-5-sprint-closure.md))

---

## Mission

Define the **target pedagogical model** for excellent **self-directed workbook activities** — what an instructional episode should contain, by cognitive demand, and how that model relates to existing KM, LO, and ACM affordances.

**Not:** implementation in packs, schema expansion, pipeline changes, or reopening 38G/38H fixes.

---

## Programme question

> **What should an excellent self-directed instructional episode look like** — and how should future DLA/GAM/page work aim to generate it?

The architecture question is largely answered:

```text
KM → LO → ACM → DLA → GAM → Workbook Page
```

The **pedagogical** question is not yet explicit or rigorous enough.

---

## Core hypothesis

**Different cognitive demands require different instructional episode patterns.**

| Cognitive level | Illustrative episode components (draft — refine in 38I-2) |
|-----------------|-----------------------------------------------------------|
| **Understand** | orientation · prior knowledge activation · concept explanation · example · non-example · misconception challenge · self-check · transition |
| **Apply** | context · process explanation · worked example · guided practice · independent practice · verification · reflection |
| **Analyse** | framing · comparison criteria · worked classification/analysis · guided reasoning · independent analysis · justification · transfer |
| **Evaluate** | competing perspectives · decision criteria · trade-offs · judgement task · justification · reflection · transfer |

38-I examines and refines these patterns against prior programme work (Sprints 28–31) and the frozen ACM ([38G-2](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md)).

---

## Inherited insight

| Sprint | Proved |
|--------|--------|
| **38-G** | KM/LO affordances can drive richer instructional design via ACM (pack §5/§6) |
| **38-H** | Most DLA/GAM instructional intent can be **preserved** to the learner page; local fidelity defects fixed |

**Limitation now:** target instructional design model is **not yet explicit** — not pipeline incapacity.

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Pack implementation | 38I-5 identifies implications only; implementation is a **future** sprint |
| Schema expansion | KM/LO fields frozen |
| `app.js` / renderer changes | Out of charter |
| Pipeline / harness changes | Out of charter |
| V-01 / V-05 re-litigation | Hold 38F-2 |
| ACM redesign | [38G-2](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) stands |
| Reopening 38G or 38H fixes | Monitor only |

---

## Implementation permissions by phase

| Phase | Code / prompt changes | Notes |
|-------|----------------------|--------|
| **38I-1** | **None** | Analysis — review Sprints 28–31 |
| **38I-2** | **None** | Episode model definition |
| **38I-3** | **None** | KM/LO → episode mapping |
| **38I-4** | **None** | Target-state mock-ups (docs) |
| **38I-5** | **None** | Implementation implications (docs) |
| **38I-6** | **Docs only** | Closure |

**Entire sprint:** analysis and model design only unless charter amended.

---

## Phases

### 38I-1 — Prior pedagogical journey review

| Field | Content |
|-------|---------|
| **Purpose** | Review Sprints 28–31; extract journey stages, instructional functions, learner support patterns, activity types, self-study flow concepts |
| **Deliverable** | `observations/38I-1-prior-pedagogical-journey-review.md` |
| **Rule** | **Do not invent a new model** until earlier journey work is reviewed |
| **Status** | **Not started** — **START HERE** |

---

### 38I-2 — Instructional episode model

| Field | Content |
|-------|---------|
| **Purpose** | Define episode patterns by cognitive demand (Understand / Apply / Analyse / Evaluate; others if justified) |
| **Deliverable** | `observations/38I-2-instructional-episode-model.md` |
| **Depends on** | 38I-1 |
| **Status** | Not started |

---

### 38I-3 — KM/LO to episode mapping

| Field | Content |
|-------|---------|
| **Purpose** | Map KM affordances and LO properties to episode components |
| **Deliverable** | `observations/38I-3-km-lo-episode-mapping.md` |
| **Depends on** | 38I-2 |
| **Status** | Not started |

---

### 38I-4 — Target-state workbook mock-ups

| Field | Content |
|-------|---------|
| **Purpose** | Rich target-state examples using Inflation anchor |
| **Deliverable** | `observations/38I-4-target-state-workbook-mockups.md` (+ optional artefacts) |
| **Depends on** | 38I-2, 38I-3 |
| **Status** | Not started |

---

### 38I-5 — Implementation implications

| Field | Content |
|-------|---------|
| **Purpose** | What future DLA/GAM/page changes would realise the episode model |
| **Deliverable** | `observations/38I-5-implementation-implications.md` |
| **Depends on** | 38I-4 |
| **Status** | Not started |

---

### 38I-6 — Closure and forward plan

| Field | Content |
|-------|---------|
| **Purpose** | Close 38-I; programme recommendation |
| **Deliverable** | `observations/38I-6-sprint-closure.md` |
| **Depends on** | 38I-5 |
| **Status** | Not started |

---

## Phase dependency graph

```text
38I-1 Prior journey review (Sprints 28–31)
    → 38I-2 Instructional episode model
        → 38I-3 KM/LO → episode mapping
            → 38I-4 Target-state mock-ups (Inflation)
                → 38I-5 Implementation implications
                    → 38I-6 Closure
```

---

## Success criteria (sprint exit)

| Criterion | Measure |
|-----------|---------|
| Prior journey work synthesised | 38I-1 complete |
| Episode patterns defined by cognitive level | 38I-2 complete |
| KM/LO mapping documented | 38I-3 complete |
| Inflation target-state examples | 38I-4 complete |
| Future implementation path identified | 38I-5 complete |
| No pack/code/schema changes | Charter compliance |

---

## References

- [README.md](README.md)
- [HANDOVER.md](HANDOVER.md)
- [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md)
- [38H-5 closure](../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-5-sprint-closure.md)
- [38G-2 ACM](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md)
- [Sprint 28](../../2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/sprint-28-index.md)
