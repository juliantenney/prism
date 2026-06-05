# Sprint 38-K — Instructional Function Depth and Episode Richness

**Pack path:** `docs/development/sprints/2026-06-05-sprint-38k-instructional-function-depth/`  
**Date:** 2026-06-05  
**Status:** **CLOSED** — **SUCCESS** ([38K-6](observations/38K-6-sprint-closure.md)) · **38-L RECOMMENDED**  
**Predecessor:** [Sprint 38-J — Instructional Function Planning](../2026-06-05-sprint-38j-instructional-function-planning/) (**CLOSED** — [38J-6](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md) · **SUCCESS**)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Sprint purpose

Define the **depth contracts**, **richness expectations**, and **population rules** required for instructional functions to produce **substantial self-directed teaching** rather than abbreviated instructional cues.

| Prior sprint | Established |
|--------------|-------------|
| **38-I** | Episode archetypes, KM/LO mapping, 38I-4 target-state mock-ups |
| **38-J** | IFP in §5 DLA; GAM-PRES in §6; `EV-38J-AFTER` — episode **structure** without architecture changes |

**Core shift:**

```text
38-J solved episode structure.
38-K investigates episode depth.
```

**Programme question:**

> What should each instructional function **contain** so a solo learner experiences **teaching**, not cues?

---

## Guiding question

What should an **explanation**, **worked example**, **misconception challenge**, **guided reasoning sequence**, **verification stage**, **transfer task**, or **judgement activity** contain in order to feel like teaching?

**Not the goal:** word count alone.  
**The goal:** **instructional sufficiency** — a learner can understand what to do, why it matters, how expert reasoning works, how to attempt independently, and how to check or revise without tutor intervention.

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38K-1** | Baseline depth analysis | [38K-1](observations/38K-1-baseline-depth-analysis.md) | **COMPLETE** |
| **38K-2** | Function depth model | [38K-2](observations/38K-2-function-depth-model.md) | **COMPLETE** |
| **38K-3** | Archetype-specific depth rules | [38K-3](observations/38K-3-archetype-specific-depth-rules.md) | **COMPLETE** |
| **38K-4** | Target-state depth examples | [38K-4](observations/38K-4-target-state-depth-examples.md) | **COMPLETE** |
| **38K-5** | Implementation implications | [38K-5](observations/38K-5-implementation-implications.md) | **COMPLETE** |
| **38K-6** | Closure | [38K-6](observations/38K-6-sprint-closure.md) | **COMPLETE** |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## In scope

- Instructional function depth and depth floors  
- Richness expectations per function  
- Worked reasoning, guided practice, verification, transfer, Evaluate depth  
- Archetype-specific depth (Understand / Apply / Analyse / Evaluate)  
- Activity-position effects (session arc × depth)  
- `EV-38J-AFTER` vs [38I-4 target-state mock-ups](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)

---

## Out of scope

| Item | Notes |
|------|--------|
| Schema changes | KM/LO keys frozen |
| ACM redesign | [38G-2](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) frozen |
| Renderer / `app.js` | Hold 38-H preservation |
| Workflow changes | No new pipeline steps |
| New material types | Existing GAM types only |
| New episode archetypes | Four archetypes from 38-I |
| Reopening 38-J IFP/GAM-PRES | Extend only if evidence requires |

---

## Authority (read-only)

| Document | Role |
|----------|------|
| [38I-4 target states](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | Depth benchmark |
| [38I-4 A4 learner episode](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | Evaluate richness exemplar |
| [38J-5 proof run](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md) | Post-implementation evidence |
| [38J-6 closure](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-6-sprint-closure.md) | Gap taxonomy · handover |
| [38J-3 §5](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md) | IFP — do not weaken |
| [38J-4 §6](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md) | GAM-PRES — do not weaken |

**Baselines (frozen):** `EV-38G-AFTER-*` · `EV-38J-AFTER-*` ([38J artefacts](../2026-06-05-sprint-38j-instructional-function-planning/artefacts/))

**Successor:** **Sprint 38-L — Instructional Function Depth Implementation** ([38K-6](observations/38K-6-sprint-closure.md) §7)

**Recommended proof prefix (38-L):** `EV-38L-AFTER-*`
