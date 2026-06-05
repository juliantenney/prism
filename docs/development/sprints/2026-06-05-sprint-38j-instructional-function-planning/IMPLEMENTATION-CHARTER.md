# Sprint 38-J — Implementation charter (Instructional Function Planning)

**Date:** 2026-06-05  
**Status:** **CLOSED** — **SUCCESS** ([38J-6](observations/38J-6-sprint-closure.md)) · **38-K RECOMMENDED**  
**Predecessor:** [Sprint 38-I](../2026-06-05-sprint-38i-instructional-episode-model/) (**CLOSED** — [38I-6](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-6-sprint-closure.md) · **SUCCESS**)

---

## Mission

Make DLA generation **episode-aware** by introducing **instructional function planning** into pack / prompt behaviour, so rich self-directed instructional episodes become **normal output** rather than exceptional authoring.

**Not:** schema expansion, ACM redesign, renderer changes, new page components, new external workflow steps, or persistent Instructional Function Plan artefacts (unless later evidence requires).

---

## Programme question

> Can the pipeline **consistently** generate [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)-class episodes from fixed KM/LO?

38-I answered **feasibility**. 38-J tests **reliability through implementation**.

---

## Inherited finding (38-I)

> **Rich self-directed instructional episodes are feasible within the existing architecture.** The missing layer is **instructional planning / DLA choreography** — not schema, ACM, or renderer capability.

**Failure mode to fix:** `LO → activity shell` (`EV-38G-AFTER`).  
**Target state:** `LO → archetype → function plan (internal) → populated DLA → ordered GAM → page`.

---

## Architecture

### Stable external chain

```text
KM → LO → ACM → DLA → GAM → Workbook Page
```

### Internal generation logic (38-J implements)

```text
KM + LO
        ↓
Episode archetype selection        (38I-3 LO-ARC rules)
        ↓
Instructional function planning    (38I-2 sequences — internal prompt logic)
        ↓
KM trigger obligations + inference contracts
        ↓
ACM component selection            (38G-2 — frozen)
        ↓
DLA population                     (pack §5)
        ↓
GAM realisation                    (pack §6 — function-ordered)
        ↓
Workbook page                      (38H preservation — hold)
```

**Framing rule:** Instructional Function Planning is **embedded in DLA/GAM generation prompts** — not a separate pipeline step or stored artefact in v1.

---

## Initial implementation scope

| # | Item | Authority |
|---|------|-----------|
| 1 | Archetype selection before DLA | [38I-3 §2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) LO-ARC rules |
| 2 | Function-plan templates (Understand / Apply / Analyse / Evaluate) | [38I-2 §2–5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) |
| 3 | KM trigger obligations | [38I-3 §3.6](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) |
| 4 | Evaluate inference contracts (criteria, perspectives, trade-offs, rubrics) | [38I-3 §3.5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md); [38I-4 A4](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |
| 5 | Anti-shell rule | [38G-2](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md); [38I-5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) |
| 6 | Anti-spoiler rule | [38H-2 GAM-WB-06b](../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-2-gam-consolidation-discipline.md) |
| 7 | Function-ordered GAM emission | [38I-5 §6.2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) |
| 8 | Session arc / scaffold-fading guidance | [38I-3 §5.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) |
| 9 | Inflation proof run | `EV-38J-AFTER` vs `EV-38G-AFTER` + [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) |

---

## Non-goals

| Non-goal | Notes |
|----------|--------|
| Schema expansion | KM/LO keys frozen per 38-I |
| ACM redesign | [38G-2](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) stands |
| Renderer / `app.js` changes | Target state uses existing components |
| New page components | Prose, tables, checklists, worked examples only |
| External IFP workflow step | Internal prompt logic only in v1 |
| Persistent IFP artefact | Deferred unless proof run shows need |
| V-01 / V-05 re-litigation | Hold 38F-2 |
| Criteria/perspectives KM slots | Post-38-J review only if inference fails |
| Reopening 38H fixes | GAM-WB-06b, DP-TABLE-ADJ-01, KM harness — hold |

---

## Implementation permissions by phase

| Phase | Pack / code changes | Notes |
|-------|---------------------|--------|
| **38J-1** | **None** | Baseline inspection only |
| **38J-2** | **Draft in observations** | Prompt design — no production pack until 38J-3 |
| **38J-3** | **Pack §5** | DLA episode-aware generation |
| **38J-4** | **Pack §6** | GAM function-ordered emission |
| **38J-5** | **Harness / artefacts** | Proof run; tests as needed |
| **38J-6** | **Docs only** | Closure |

**Primary production surface:** `domains/learning-design/domain-learning-design-step-patterns.md` (§5 DLA, §6 GAM) — exact edit plan emerges in 38J-1/2.

---

## Phases

### 38J-1 — Charter and baseline inspection

| Field | Content |
|-------|---------|
| **Purpose** | Confirm 38-I findings; inspect current DLA/GAM path; identify insertion points for archetype/function planning |
| **Deliverable** | `observations/38J-1-baseline-inspection.md` |
| **Rule** | **No implementation** |
| **Status** | **COMPLETE** — [38J-1](observations/38J-1-baseline-inspection.md) |

---

### 38J-2 — Function-plan prompt design

| Field | Content |
|-------|---------|
| **Purpose** | Internal prompt instructions/templates per archetype; R/C/O functions; anti-shell; anti-spoiler |
| **Deliverable** | `observations/38J-2-function-plan-prompt-design.md` |
| **Depends on** | 38J-1 |
| **Status** | **COMPLETE** — [38J-2](observations/38J-2-function-plan-prompt-design.md) |

---

### 38J-3 — DLA generation implementation

| Field | Content |
|-------|---------|
| **Purpose** | Apply episode-aware planning to DLA; emit richer ordered instructional functions |
| **Deliverable** | Pack §5 changes + `observations/38J-3-dla-implementation.md` (or equivalent) |
| **Depends on** | 38J-2 |
| **Status** | **COMPLETE** — [38J-3](observations/38J-3-dla-implementation.md) |

---

### 38J-4 — GAM realisation implementation

| Field | Content |
|-------|---------|
| **Purpose** | Preserve function ordering; expand instructional presentation; prevent spoiler consolidation |
| **Deliverable** | Pack §6 changes + `observations/38J-4-gam-implementation.md` (or equivalent) |
| **Depends on** | 38J-3 |
| **Status** | **COMPLETE** — [38J-4](observations/38J-4-gam-implementation.md) |

---

### 38J-5 — Inflation proof run

| Field | Content |
|-------|---------|
| **Purpose** | Generate `EV-38J-AFTER` artefacts; compare with `EV-38G-AFTER` and 38I-4 target states |
| **Deliverable** | `artefacts/EV-38J-AFTER-*` + `observations/38J-5-inflation-proof-run.md` |
| **Depends on** | 38J-4 |
| **Status** | **COMPLETE** — [38J-5](observations/38J-5-inflation-proof-run.md) · verdict **C** |

---

### 38J-6 — Closure

| Field | Content |
|-------|---------|
| **Purpose** | Assess recognisable instructional episodes; remaining gaps; future affordance candidates |
| **Deliverable** | `observations/38J-6-sprint-closure.md` |
| **Depends on** | 38J-5 |
| **Status** | **COMPLETE** — [38J-6](observations/38J-6-sprint-closure.md) · sprint **CLOSED** |

---

## Sprint closure

**Verdict:** **C. Successful**  
**Hypothesis:** Partially confirmed  
**Successor:** **Sprint 38-K — Instructional Function Depth and Episode Richness** (recommended — see 38J-6 §6)

---

## Phase dependency graph

```text
38J-1 Baseline inspection
    → 38J-2 Function-plan prompt design
        → 38J-3 DLA implementation (§5)
            → 38J-4 GAM implementation (§6)
                → 38J-5 Inflation proof run
                    → 38J-6 Closure
```

---

## Success criteria (sprint exit)

| # | Criterion |
|---|-----------|
| 1 | Generated Inflation workbook contains **recognisable instructional episodes**, not sparse task shells |
| 2 | **A4 Evaluate** includes criteria exposition, competing perspectives, worked judgement, guided judgement, independent judgement, verification, reflection, and transfer |
| 3 | **Understand / Apply / Analyse** show archetype-appropriate structures |
| 4 | Output **renderable** with existing page components — **no renderer changes** |
| 5 | **No schema or ACM redesign** introduced |
| 6 | Word count increase **managed** but not prematurely constrained |
| 7 | `EV-38J-AFTER` shows material improvement over `EV-38G-AFTER` on episode richness and H-04 |
| 8 | 38H hold conditions preserved (anti-spoiler, table adjunct, preservation) |

---

## References

- [README.md](README.md)
- [HANDOVER.md](HANDOVER.md)
- [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md)
- [38I-6 closure](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-6-sprint-closure.md)
- [38I-2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) · [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38I-5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)
- [38G-2 ACM](../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md)
- [38H-5 closure](../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-5-sprint-closure.md)
- [EV-38G-AFTER DLA](../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-dla-learning-activities.json)
