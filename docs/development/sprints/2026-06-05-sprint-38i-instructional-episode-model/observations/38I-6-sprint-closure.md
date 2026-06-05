# Slice 38I-6 — Sprint closure and forward plan

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Sprint:** **38-I — Instructional Episode Model** — **CLOSED**  
**Type:** Retrospective and forward plan only — no implementation in this sprint  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)  
**Predecessor:** [Sprint 38-H](../2026-06-05-sprint-38h-workbook-realisation-fidelity/) (**CLOSED** — [38H-5](../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-5-sprint-closure.md))  
**Successor:** [Sprint 38-J — Instructional Function Planning](../../2026-06-05-sprint-38j-instructional-function-planning/) (**CHARTERED**)

---

## Closure verdict

| Verdict | **SUCCESS** |
|---------|-------------|

**Justification:** Sprint 38-I succeeded because it converted the programme's pedagogical ambition from an implicit aspiration into an **explicit instructional episode model** with **demonstrated target-state examples** and a **practical implementation path**. All six charter phases completed; no pack, code, schema, ACM, or renderer changes were made. Hold conditions from 38-G and 38-H remain valid.

---

## 1. Sprint summary

| Phase | Deliverable | What it established |
|-------|-------------|---------------------|
| **38I-1** | [38I-1-prior-pedagogical-journey-review.md](38I-1-prior-pedagogical-journey-review.md) | Recovered instructional functions from Sprints 28–31; documented survival/dilution through 38G/38H; §8 function vocabulary for later slices |
| **38I-2** | [38I-2-instructional-episode-model.md](38I-2-instructional-episode-model.md) | Four episode archetypes (Understand, Apply, Analyse, Evaluate) with canonical function sequences, R/C/O classification, and cross-episode comparison matrix |
| **38I-3** | [38I-3-km-lo-episode-mapping.md](38I-3-km-lo-episode-mapping.md) | LO→archetype selection rules; KM affordance→function population; coverage analysis; Evaluate partial / scaffold fading weak |
| **38I-4** | [38I-4-target-state-workbook-mockups.md](38I-4-target-state-workbook-mockups.md) · [A4 learner episode](artefacts/38I-4-a4-evaluate-learner-episode.md) | Inflation A1–A4 target states (~8× density vs `EV-38G-AFTER`); complete learner-facing Evaluate exemplar; architecture plausibility confirmed |
| **38I-5** | [38I-5-implementation-implications.md](38I-5-implementation-implications.md) | Function reliability matrix; inference burden; minimum eight-item change set; Instructional Function Plan as missing layer |
| **38I-6** | This document | Closure verdict; forward plan for 38-J |

**Programme arc within 38-I:**

```text
Recover (38I-1) → Define (38I-2) → Map (38I-3) → Demonstrate (38I-4) → Implicate (38I-5) → Close (38I-6)
```

---

## 2. Core conclusion

**Major programme finding:**

> **Rich self-directed instructional episodes are feasible within the existing architecture.** The missing layer is **not** schema, ACM, or renderer capability, but **instructional planning / DLA choreography**.

The pipeline already has KM substance, LO intent, ACM components, DLA cognition fields, GAM material types, and a preservation path to the learner page (38-H). What it lacks is a **mandatory intermediate step** that converts LO into an **episode archetype** and **ordered instructional function plan** before `learner_task` and materials are emitted. `EV-38G-AFTER` demonstrates the failure mode: **LO → activity shell** with hints, not **LO → archetype → functions → rich episode**.

---

## 3. What 38-I proved

### 3.1 Visible pedagogy and episode richness are distinct

38G improved preambles, cognition fields, and material variety. Learners still received **thin task shells** when teaching moves were not sequenced as episodes. Framing without explanation, modelling, verification, and fade is **visible pedagogy**, not **episode richness** ([38I-1](38I-1-prior-pedagogical-journey-review.md); [38I-2 §1.2](38I-2-instructional-episode-model.md)).

### 3.2 Episode archetypes can be defined by cognitive demand

[38I-2](38I-2-instructional-episode-model.md) defined Understand, Apply, Analyse, and Evaluate with distinct function sequences, scaffold curves, verification focus, and transfer obligations. Remember/Create were correctly excluded as separate workbook archetypes. The §6 matrix gives a testable design specification.

### 3.3 Existing KM/LO affordances can support most functions

[38I-3](38I-3-km-lo-episode-mapping.md) showed **strong** population for Understand, Apply, and Analyse from fixed KM keys (`concepts`, `relationships`, `groupings`, `processes`, `misconceptions`) and LO properties (`cognitive_level`, statement, related concepts). KM trigger rules upgrade obligations (e.g. misconception → Misconception challenge **R**).

### 3.4 Rich Inflation episodes can be mocked up without schema expansion

[38I-4](38I-4-target-state-workbook-mockups.md) produced ~800–1,350 word target episodes for A1–A4 using only existing material types and cognition surfaces. The [A4 learner episode](artefacts/38I-4-a4-evaluate-learner-episode.md) proves a solo learner can be taught through Evaluate without a tutor.

### 3.5 Evaluate is feasible but remains the reliability bottleneck

A4 target state and learner episode close **H-04** conceptually: criteria, perspectives, trade-offs, exemplar judgement, rubric verification, and transfer **R**. Generation reliability is **low** today because criteria, perspectives, and scenario detail require **inference** — not because Evaluate is pedagogically impossible ([38I-5 §4.2](38I-5-implementation-implications.md)).

### 3.6 Renderer implications are minimal

Target states use **existing** learner-facing forms: prose, headings, prompts, tables, checklists, worked examples, scenarios, and consolidation templates. No new page components, layout types, or `app.js` changes are required. 38-H established that richer upstream intent can reach the page when emitted; 38-I confirms the **upstream** gap is planning and population, not compose ([38H-5](../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-5-sprint-closure.md)).

---

## 4. Remaining uncertainties

| Uncertainty | Why it matters | When to resolve |
|-------------|----------------|-----------------|
| **Reliability on non-Inflation topics** | Inflation KM is well-populated; other topics may lack misconceptions, processes, or relationships | Second anchor topic after 38-J |
| **Consistency of inference contracts** | Evaluate criteria/perspectives authored from LO+brief may vary run-to-run | 38-J implementation + harness scoring |
| **Token / page length management** | ~1,000-word episodes × 4 activities increases generation cost and page length | 38-J proof run; editorial caps if needed |
| **Session-level scaffold fading** | Cross-activity independence has no KM/LO field; high inference burden | 38-J session arc contract; optional later affordance |
| **Explicit criteria / perspectives / trade-offs / rubric slots** | May become necessary if inference contracts fail on second topic | Post-38-J affordance review only — **not** 38-J scope |

**Inherited from 38-H (unchanged):** Full `EV-38H-AFTER` end-to-end page comparator rerun remains optional; harness and KM capture are validated.

---

## 5. Recommended next sprint

### Sprint 38-J — Instructional Function Planning Implementation

| Field | Content |
|-------|---------|
| **Purpose** | Introduce an **episode planning layer** between LO/archetype selection and DLA generation so rich instructional episodes become **normal output**, not exceptional authoring |
| **Programme question** | Can the pipeline **consistently** generate 38I-4-class episodes from fixed KM/LO without schema expansion? |
| **Target chain** | See §6 below |
| **Predecessor** | Sprint 38-I (this sprint) |
| **Charter** | To be authored in a new sprint folder — **not started here** |

```text
KM → LO → Episode Archetype → Instructional Function Plan → ACM → DLA → GAM → Page
```

**Relationship to prior sprints:**

| Sprint | Role relative to 38-J |
|--------|----------------------|
| **38-G** | ACM and KM exploitation foundation — frozen |
| **38-H** | Preservation and anti-spoiler — hold |
| **38-I** | Episode model, mapping, mock-ups, implications — **specification for 38-J** |

---

## 6. Recommended implementation scope (38-J)

### In scope

| # | Item | Source |
|---|------|--------|
| 1 | **Archetype selection before DLA** | 38I-3 LO-ARC rules |
| 2 | **Function-plan templates** for Understand / Apply / Analyse / Evaluate | 38I-2 canonical sequences |
| 3 | **KM trigger obligations** | 38I-3 §3.6 trigger table |
| 4 | **Inference contracts** for Evaluate criteria, perspectives, trade-offs | 38I-3 §4.1; 38I-4 A4; 38I-5 §4.3 |
| 5 | **Anti-shell rule** — no LO→task-only activities | 38G-2; 38I-5 |
| 6 | **Anti-spoiler rule** — extend 38H-2 consolidation discipline | 38H-2 GAM-WB-06b |
| 7 | **Function-ordered GAM emission** | 38I-5 §6.2 item 8 |
| 8 | **Session arc contract** — LO distribution, scaffold fade across activities | 38I-3 §5.1; 38I-5 |
| 9 | **Archetype-over-LO-verb override** when process/criteria signal Apply | 38I-4 A2; 38I-5 |
| 10 | **One Inflation re-run** as proof (`EV-38J-AFTER` vs `EV-38G-AFTER`) | 38H harness lineage |

**Primary pack surfaces (anticipated):** §5 DLA (function plan, session arc), §6 GAM (ordered materials, inference contracts). Exact edit plan belongs in 38-J charter.

### Explicitly out of scope (38-J)

| Exclusion | Rationale |
|-----------|-----------|
| **Schema expansion** | 38-I proved mock-ups without new KM/LO keys |
| **ACM redesign** | [38G-2](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) bridge is sufficient |
| **Renderer changes** | Target state uses existing text/tables/checklists |
| **New page components** | No layout innovation required |
| **`app.js` changes** | Unless a narrow bug blocks preservation — not indicated |
| **Criteria/perspectives/trade-offs KM slots** | Deferred to post-38-J review if inference fails |

---

## 7. Success criteria for Sprint 38-J

| # | Criterion | Measure |
|---|-----------|---------|
| 1 | **Recognisable instructional episodes** | Generated Inflation workbook A1–A4 are teaching sequences, not ~50–150 word task shells |
| 2 | **A4 Evaluate completeness** | A4 includes criteria exposition, trade-offs, worked judgement, guided judgement, independent judgement, verification, reflection, and transfer |
| 3 | **Preservation** | Page rendering retains function-ordered content without structural loss (38H hold) |
| 4 | **Manageable output** | Increased word count is intentional and bounded; no runaway duplication or spoiler bodies |
| 5 | **Comparator improvement** | `EV-38J-AFTER` DLA/GAM/page trace shows material improvement over `EV-38G-AFTER` on H-04 and episode richness |
| 6 | **Hold conditions** | V-01, V-05, 38E/38F material types, 38G ACM rows, 38H fixes unchanged except extended pack clauses |

**Optional stretch:** Harness function-coverage scoring against 38I-2 **R** moves per activity.

---

## 8. Charter compliance (38-I exit)

| Sprint exit criterion | Status |
|-----------------------|--------|
| Prior journey work synthesised (38I-1) | **Met** |
| Episode patterns by cognitive level (38I-2) | **Met** |
| KM/LO mapping documented (38I-3) | **Met** |
| Inflation target-state examples (38I-4) | **Met** |
| Future implementation path identified (38I-5) | **Met** |
| No pack/code/schema changes | **Met** |

---

## Evidence index

| Artefact | Role |
|----------|------|
| [38I-1](38I-1-prior-pedagogical-journey-review.md) | Function recovery |
| [38I-2](38I-2-instructional-episode-model.md) | Archetype specification |
| [38I-3](38I-3-km-lo-episode-mapping.md) | KM/LO population rules |
| [38I-4](38I-4-target-state-workbook-mockups.md) | Target-state proof |
| [38I-4 A4 episode](artefacts/38I-4-a4-evaluate-learner-episode.md) | Learner-facing Evaluate exemplar |
| [38I-5](38I-5-implementation-implications.md) | Implementation minimum set |
| [EV-38G-AFTER DLA](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-dla-learning-activities.json) | Baseline comparator |
| [EV-38H-AFTER KM](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/artefacts/EV-38H-AFTER-knowledge-model.json) | KM anchor |
| [38H-1 H-04](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-1-workbook-realisation-fidelity-analysis.md) | Evaluate gap origin |

---

## Forward plan summary

```text
38-I CLOSED (SUCCESS)
    → Charter Sprint 38-J — Instructional Function Planning Implementation
        → Pack §5/§6 function-plan obligations
        → Inflation proof run (EV-38J-AFTER)
        → Optional: second topic + affordance review if inference contracts fail
```

**Successor pack:** [38-J HANDOVER](../../2026-06-05-sprint-38j-instructional-function-planning/HANDOVER.md) — start **38J-1**.

---

## References

- [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)
- [README.md](../README.md)
- [HANDOVER.md](../HANDOVER.md)
- [38H-5 sprint closure](../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-5-sprint-closure.md)
- [38G-2 activity component model](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md)
