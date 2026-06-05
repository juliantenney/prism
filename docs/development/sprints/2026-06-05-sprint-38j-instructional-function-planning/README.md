# Sprint 38-J — Instructional Function Planning Implementation

**Pack path:** `docs/development/sprints/2026-06-05-sprint-38j-instructional-function-planning/`  
**Date:** 2026-06-05  
**Status:** **CLOSED** — **SUCCESS** ([38J-6](observations/38J-6-sprint-closure.md)) · **38-K RECOMMENDED**  
**Predecessor:** [Sprint 38-I — Instructional Episode Model](../2026-06-05-sprint-38i-instructional-episode-model/) (**CLOSED** — [38I-6](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-6-sprint-closure.md) · **SUCCESS**)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · [HANDOVER.md](HANDOVER.md) · [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Sprint purpose

Implement the **pedagogical planning behaviour** identified by Sprint 38-I so DLA generation becomes **episode-aware** and produces **rich instructional episodes** rather than sparse activity shells.

| Prior sprint | Established |
|--------------|-------------|
| **38-G** | KM/LO affordances can drive richer instructional design (ACM) |
| **38-H** | DLA/GAM intent can be preserved to the learner page; fidelity defects fixed |
| **38-I** | Episode archetypes, KM/LO mapping, target-state mock-ups, implementation path |

**Programme question:**

> Can the pipeline **consistently** generate 38I-4-class instructional episodes from fixed KM/LO **without** schema expansion?

---

## Architecture framing

**Stable external chain (unchanged):**

```text
KM → LO → ACM → DLA → GAM → Workbook Page
```

**Conceptual generation logic (internal to DLA/GAM prompts):**

```text
KM + LO
  → episode archetype selection
  → instructional function planning
  → ACM/DLA population
  → GAM realisation
  → workbook page
```

**Important:** Instructional Function Planning is **internal DLA generation logic** — not a new external workflow step or persistent artefact unless later evidence requires it.

---

## Phase table

| Phase | Focus | Deliverable | Status |
|-------|--------|-------------|--------|
| **38J-1** | Charter and baseline inspection | [38J-1](observations/38J-1-baseline-inspection.md) | **COMPLETE** |
| **38J-2** | Function-plan prompt design | [38J-2](observations/38J-2-function-plan-prompt-design.md) | **COMPLETE** |
| **38J-3** | DLA generation implementation | [38J-3](observations/38J-3-dla-implementation.md) | **COMPLETE** |
| **38J-4** | GAM realisation implementation | [38J-4](observations/38J-4-gam-implementation.md) | **COMPLETE** |
| **38J-5** | Inflation proof run | [38J-5](observations/38J-5-inflation-proof-run.md) · `artefacts/EV-38J-AFTER-*` | **COMPLETE** |
| **38J-6** | Closure | [38J-6](observations/38J-6-sprint-closure.md) | **COMPLETE** |

Detail: [IMPLEMENTATION-CHARTER.md](IMPLEMENTATION-CHARTER.md)

---

## Initial scope (summary)

1. Archetype selection before DLA generation  
2. Function-plan templates for Understand / Apply / Analyse / Evaluate  
3. KM trigger obligations ([38I-3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) §3.6)  
4. Evaluate inference contracts (criteria, perspectives, trade-offs, judgement rubrics)  
5. Anti-shell rule  
6. Anti-spoiler rule (extend [38H-2](../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-2-gam-consolidation-discipline.md))  
7. Function-ordered GAM emission  
8. Session arc / scaffold-fading guidance  
9. Inflation proof run — `EV-38J-AFTER` vs `EV-38G-AFTER`

---

## Scope boundaries

| In scope | Out of scope |
|----------|--------------|
| Pack §5 DLA episode-aware planning | Schema expansion |
| Pack §6 GAM function-ordered emission | ACM redesign |
| Inference contracts in prompts | Renderer changes |
| Anti-shell / anti-spoiler discipline | New page components |
| Inflation proof run + comparator | New external workflow step |
| Harness capture for `EV-38J-AFTER` | Persistent IFP artefact (unless later justified) |
| Targeted tests | `app.js` changes (unless blocker) |

---

## Authority (read-only)

| Document | Role |
|----------|------|
| [38I-6 closure](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-6-sprint-closure.md) | Predecessor authority · 38-J scope |
| [38I-2 episode model](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) | Archetype sequences · R/C/O |
| [38I-3 KM/LO mapping](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) | Population rules · triggers |
| [38I-4 target states](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | Success comparator |
| [38I-4 A4 learner episode](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | Evaluate exemplar |
| [38I-5 implications](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) | Minimum change set |
| [38G-2 ACM](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) | Frozen component bridge |
| [38H-5 closure](../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-5-sprint-closure.md) | Preservation hold |

**Frozen comparators (do not overwrite):** EV-01 · `EV-38E5-AFTER-*` · `EV-38E10-AFTER-*` · `EV-38F-AFTER-*` · `EV-38G-AFTER-*` · `EV-38H-AFTER-knowledge-model.json`

**Frozen proof prefix:** `EV-38J-AFTER-*` ([38J-5](observations/38J-5-inflation-proof-run.md))

**Successor:** **Sprint 38-K — Instructional Function Depth and Episode Richness** (recommended in [38J-6](observations/38J-6-sprint-closure.md))
