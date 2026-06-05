# Sprint 38-L — Instructional Function Depth Implementation

**Pack path:** `docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/`  
**Date:** 2026-06-05  
**Status:** **CLOSED** — [38L-6](observations/38L-6-sprint-closure.md) · **SUCCESS**  
**Predecessor:** [Sprint 38-K — Instructional Function Depth](../2026-06-05-sprint-38k-instructional-function-depth/) (**CLOSED** — [38K-6](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-6-sprint-closure.md) · **SUCCESS**)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md) · [38L-6 closure](observations/38L-6-sprint-closure.md)

---

## Sprint purpose

Implement **instructional sufficiency obligations** within the existing 38-J architecture so generated workbook episodes move materially closer to [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) **without** schema, ACM, renderer, or workflow changes.

| Prior sprint | Established |
|--------------|-------------|
| **38-I** | Episode archetypes, KM/LO mapping, 38I-4 target-state mock-ups |
| **38-J** | IFP in §5 DLA; GAM-PRES in §6; `EV-38J-AFTER` — episode **structure** |
| **38-K** | Depth model, archetype floors, E1–E4 examples, R1–R7 implementation roadmap |
| **38-L** | R1–R7 in §5/§6; `EV-38L-AFTER`; DLA obligations; GAM→Page preserve; loss trace |

**Core shift:**

```text
38-K defined episode sufficiency.
38-L implemented depth and closure obligations.
```

**Closure conclusion:** Architecture **PASS**; depth implementation **PASS**; 38I benchmark **PARTIAL** — remaining gap is **page composition fidelity + function richness calibration** ([38L-6 §5](observations/38L-6-sprint-closure.md)).

---

## Guiding question

What pack §5/§6 changes are required so a solo learner experiences **substantial teaching** — verification, closure, owned judgement — not abbreviated cues?

**Success metric:** Instructional sufficiency ([38K-2](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md)) — not word count alone.

---

## Architecture (unchanged)

```text
KM → LO → Episode Archetype → Instructional Function Plan → ACM → DLA → GAM → Workbook Page
```

**Do not revisit architecture questions.** [38K-6](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-6-sprint-closure.md) established no schema/ACM/renderer/workflow changes required.

---

## Core implementation goals (R1–R7) — delivered

| ID | Goal | Source |
|----|------|--------|
| **R1** | Universal verification obligation | [38K-5](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md) |
| **R2** | Level 3 depth floors in DLA specifications | [38K-3](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md) |
| **R3** | Function-shaped GAM body rules | [38K-2](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md) |
| **R4** | Closure emission gates | [38K-5](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md) §6 |
| **R5** | Evaluate completion pack | [38K-4 E4](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md) |
| **R6** | Analyse worked analytic pass | [38K-4 E3](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md) |
| **R7** | Evaluate LO / harness alignment | [38I-4 A4](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38L-1** | Implementation planning review | `observations/38L-1-implementation-planning-review.md` | **COMPLETE** |
| **38L-2** | DLA depth-floor implementation | `observations/38L-2-dla-depth-floor-implementation.md` | **COMPLETE** |
| **38L-3** | GAM depth-shaped body implementation | `observations/38L-3-gam-depth-shaped-body-implementation.md` | **COMPLETE** |
| **38L-4** | Closure integration + Evaluate alignment | `observations/38L-4-closure-integration-and-evaluate-alignment.md` | **COMPLETE** |
| **38L-5** | Inflation proof run | `observations/38L-5-inflation-proof-run.md` · `artefacts/EV-38L-AFTER-*` | **COMPLETE** |
| **38L-6** | Closure | `observations/38L-6-sprint-closure.md` | **COMPLETE** |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## In scope (delivered)

- DLA depth obligations (§5)  
- GAM depth obligations (§6)  
- Verification, transfer, closure obligations  
- Evaluate completion obligations  
- Analyse worked-pass obligations  
- Inflation proof rerun · `EV-38L-AFTER` comparison  
- DLA obligation validation · GAM→Page preservation · forensic loss trace  

---

## Out of scope (held)

| Item | Notes |
|------|--------|
| Schema changes | KM/LO keys frozen |
| ACM redesign | [38G-2](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) frozen |
| Renderer styling | Hold 38-H preservation |
| Workflow changes | No new pipeline steps |
| New material types | Existing GAM catalogue only |
| New episode archetypes | Four from 38-I |
| Full 38I-4 benchmark in one sprint | Minimum sufficiency floor first |

---

## Authority (read-only design)

| Document | Role |
|----------|------|
| [38K-5 implementation implications](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-5-implementation-implications.md) | **Primary implementation authority** |
| [38K-3 archetype depth rules](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-3-archetype-specific-depth-rules.md) | Level 3 floors |
| [38K-4 depth examples](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-4-target-state-depth-examples.md) | Target prose shapes |
| [38K-2 depth model](../2026-06-05-sprint-38k-instructional-function-depth/observations/38K-2-function-depth-model.md) | Sufficiency test |
| [38J-3 §5](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-3-dla-implementation.md) | IFP baseline — extend |
| [38J-4 §6](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-4-gam-implementation.md) | GAM-PRES baseline — extend |
| [38J-5 proof run](../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md) | Post-38J comparator |

**Baselines (frozen):** `EV-38G-AFTER-*` · `EV-38J-AFTER-*`

**Proof prefix (this sprint):** `EV-38L-AFTER-*`
