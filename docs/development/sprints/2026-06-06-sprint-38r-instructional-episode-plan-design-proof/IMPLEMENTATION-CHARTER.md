# Sprint 38-R — Implementation charter (Instructional Episode Plan Design Proof)

**Date:** 2026-06-06  
**Status:** **CLOSED — SUCCESS**  
**Predecessor:** [Sprint 38-Q](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/) (**CLOSED** — [38Q-6](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-6-sprint-closure.md) · **SUCCESS**)

---

## Programme framing

```text
38Q discovered the missing planning abstraction.
38R proves the smallest viable form of that abstraction.
```

| Sprint | Role |
|--------|------|
| **38Q** | Educational abstraction investigation — **CLOSED** |
| **38R** | Episode Plan **design proof** — **CHARTERED** |
| **Follow-on** | [Sprint 38-S](../2026-06-06-sprint-38s-episode-plan-v1-implementation/) — **CHARTERED** · [38R-6](observations/38R-6-sprint-closure.md) |

**38R is not asking** whether Episode Plan is useful in principle. **38Q answered that.**

**38R asks** whether the Episode Plan can be made **small, precise, testable, and mappable** to the existing DLA → GAM → Page pipeline.

---

## Background

### 38Q outcomes (authoritative input)

| Finding | Source |
|---------|--------|
| Prism currently plans **activities**; needs to plan **instructional episodes** | [38Q-6](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-6-sprint-closure.md) |
| Dominant gaps: **G3** (missing transitions) + **G5** (episode-structure gaps) | [38Q-3](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) |
| **H2 confirmed** — abstraction extension via episode planning | [38Q-5](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **H3 partial** — activity-as-planner misaligned; DLA/GAM remain realisation layers | [38Q-5](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **H1 rejected** as primary | [38Q-5](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| Prompt accretion does **not** solve G3/G5 | [38Q-4](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-4-episode-generation-design-options.md) |

### Recommended architecture (frozen — 38R implements design proof only)

```text
LO → Instructional Episode Plan → DLA → GAM → Page
```

- **DLA, GAM, fidelity machinery:** retained  
- **Episode Plan:** planning authority between LO and DLA  
- **Option F Hybrid** per [38Q-5](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)

### Fidelity programme (closed — do not reopen)

| Sprint | Outcome |
|--------|---------|
| **38M–38P** | `proofOk: true`, `roleOk: true`, `fullOk: true` on EV-38P-AFTER |

**38R must not modify:** DLA, GAM, Page, render, validators, role registry, or fidelity machinery.

---

## Mission

Design the **smallest viable Instructional Episode Plan** abstraction that:

- represents ordered instructional functions,
- represents instructional transitions,
- represents learner-state progression,
- maps cleanly to DLA material obligations,
- preserves the existing fidelity path,
- can express the [38I A1–A4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) target episode structures,
- avoids prompt-only enrichment as the primary solution.

**No coding.** **No production schema.** Design-proof and documentation only.

---

## Core question

> What is the smallest Instructional Episode Plan representation that can express the transitions 38Q identified as missing?

### Minimum required transition families

| # | Transition family | 38Q gap anchor |
|---|-------------------|----------------|
| 1 | **Worked → Guided → Independent** | GAP-01 fade; G3 |
| 2 | **Perspective → Criteria → Judgement** | GAP-02–04; A4 chain |
| 3 | **Predict → Evidence → Revision** | GAP-15; historical D9 |
| 4 | **Judgement → Transfer → Reflection** | GAP-16–17; Evaluate arc |
| 5 | **Perform → Verify → Reflect** | GAP-08; verification chain |

Source: [38Q-3](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md), [38Q-2](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) §7.3.

---

## Reference models (read-only)

| Model | Location | Use in 38R |
|-------|----------|------------|
| 38Q taxonomy | [38Q-2](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-2-episode-taxonomy-catalogue.md) | Function + transition vocabulary |
| 38Q gap register | [38Q-3](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) | G3/G5 proof targets |
| 38Q recommendation | [38Q-5](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) | Architecture + migration principles M-1–M-13 |
| 38I target states | [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | A1–A4 acceptance structures |
| 38I-5 implications | [38I-5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) | Prior IFP concept — 38R supersedes as design-proof |
| EV-38P-AFTER | Post-fidelity baseline | `fullOk` floor |

---

## Scope

### In scope

| Area | Description |
|------|-------------|
| Minimum viable plan schema | Compact representation; not prompt prose |
| Transition family expressibility | Five families above |
| Archetype fit | A1 Understand, A2 Apply, A3 Analyse, A4 Evaluate |
| Plan → DLA mapping design | Ordered obligations; anti-substitution |
| Proof design | G3/G5 reduction evidence plan; `fullOk` preservation |
| Implementation recommendation | Proceed / refine / reject |

### Out of scope

| Item | Notes |
|------|-------|
| Production code | Default: docs only |
| Production schema files | Design in sprint observations only |
| DLA/GAM/Page changes | Realisation layers frozen |
| 38M–38P reopening | Fidelity closed |
| Prompt expansion as primary fix | Explicitly excluded per 38Q-4 |
| Re-litigating 38Q recommendation | 38Q closure authoritative |

---

## Success criteria (sprint completion at 38R-6)

| ID | Criterion |
|----|-----------|
| **SC-1** | Minimum viable Episode Plan schema defined |
| **SC-2** | Schema expresses all five transition families |
| **SC-3** | Schema expresses A1–A4 target episode structures |
| **SC-4** | Plan-to-DLA mapping specified at design level |
| **SC-5** | Fidelity preservation strategy documented |
| **SC-6** | G3/G5 reduction proof approach defined |
| **SC-7** | Prompt accretion explicitly avoided as primary mechanism |
| **SC-8** | Recommendation made for implementation, refinement, or rejection |

---

## Phase plan

### 38R-1 — Minimum viable Episode Plan

| Field | Content |
|-------|---------|
| **Purpose** | Define smallest possible plan object; test against five transition families |
| **Deliverable** | [observations/38R-1-minimum-viable-episode-plan.md](observations/38R-1-minimum-viable-episode-plan.md) |
| **Depends on** | 38Q-6 closure |
| **Status** | **COMPLETE** |

---

### 38R-2 — Archetype fit test

| Field | Content |
|-------|---------|
| **Purpose** | Express A1–A4 as Episode Plans using 38R-1 schema V1 |
| **Deliverable** | [observations/38R-2-archetype-fit-test.md](observations/38R-2-archetype-fit-test.md) |
| **Depends on** | 38R-1 |
| **Status** | **COMPLETE** |

---

### 38R-3 — Plan-to-DLA mapping

| Field | Content |
|-------|---------|
| **Purpose** | Map plan functions/transitions to DLA obligations without losing choreography |
| **Deliverable** | `observations/38R-3-plan-to-dla-mapping.md` |
| **Depends on** | 38R-2 |
| **Status** | **COMPLETE** |

---

### 38R-4 — Proof and validation design

| Field | Content |
|-------|---------|
| **Purpose** | Evidence design for G3/G5 reduction while preserving `fullOk` |
| **Deliverable** | `observations/38R-4-proof-validation-design.md` |
| **Depends on** | 38R-3 |
| **Status** | **COMPLETE** |

---

### 38R-5 — Implementation recommendation

| Field | Content |
|-------|---------|
| **Purpose** | Recommend proceed to implementation, refine design, or revisit architecture |
| **Deliverable** | `observations/38R-5-implementation-recommendation.md` |
| **Depends on** | 38R-4 |
| **Status** | **COMPLETE** |

---

### 38R-6 — Closure

| Field | Content |
|-------|---------|
| **Purpose** | Close sprint; implementation handoff if warranted |
| **Deliverable** | `observations/38R-6-sprint-closure.md` |
| **Depends on** | 38R-5 |
| **Status** | **COMPLETE** |

**Dependency chain:**

```text
38R-1 MV schema → 38R-2 Archetype fit → 38R-3 Plan→DLA
  → 38R-4 Proof design → 38R-5 Recommendation → 38R-6 Closure
```

---

## Implementation permissions

| Phase | Code / pack changes | Notes |
|-------|---------------------|-------|
| **38R-1** through **38R-6** | **Docs only** (default) | Design-proof sprint |
| **Follow-on sprint** | TBD by 38R-5/38R-6 | Must preserve `fullOk`; satisfy M-1–M-13 from [38Q-5](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |

---

## Migration principles (inherited from 38Q-5 — binding on follow-on)

M-1 through M-13 — see [38Q-5 Task 7](../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md). 38R design must be compatible with all.

---

## Programme lineage

```text
38I Episode model → 38M–38P Fidelity → 38Q Abstraction investigation
  → 38R Episode Plan design proof → 38S Implementation
```

---

## Risks

| Risk | Mitigation |
|------|------------|
| Plan schema becomes prompt-accretion in disguise | SC-7; compact structural object required in 38R-1 |
| Plan too large to be viable | 38R-1 explicit minimality test |
| Plan cannot map to DLA without redesign | 38R-3 dedicated phase |
| Proof design ignores `fullOk` | SC-5; EV-38P-AFTER baseline locked |
| Re-litigating 38Q | 38Q-6 authoritative; 38R assumes H2 path |
