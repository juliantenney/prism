# 38Q-6 — Sprint closure (Instructional Episode Depth and Teaching Architecture)

**Date:** 2026-06-06  
**Status:** **CLOSED — SUCCESS**  
**Type:** Sprint closure — documentation only; no new analysis or implementation design  
**Authority:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md)  
**Recommendation:** [38Q-5-recommended-architecture.md](38Q-5-recommended-architecture.md)

---

## Executive verdict

Sprint **38-Q** is **CLOSED — SUCCESS**.

The sprint completed an **educational abstraction investigation** across six phases (38Q-1 through 38Q-6). It determined that the dominant gap between 38I target-state teaching episodes and EV-38P-AFTER output is **not fidelity or material quality** but **missing transitions (G3)** and **episode-structure gaps (G5)**. It recommends introducing an **Instructional Episode Plan** as the primary planning object between Learning Outcomes and DLA, while preserving DLA, GAM, and Page compose as realisation and fidelity surfaces.

All charter success criteria **SC-1 through SC-9** pass. No 38M–38P fidelity claims were weakened. No production code changed.

---

## Task 1 — Opening question vs revised question

### Question at sprint start

> **How can DLA and GAM generate richer instructional episodes while preserving fidelity?**

This framed the programme as a **DLA/GAM improvement** problem — assuming the current abstractions were the right place to fix worksheet orientation.

### Revised question (introduced during 38Q)

> **What educational abstraction should sit between knowledge representation and instructional materials if the goal is rich teaching episodes rather than worksheet-oriented activities?**

This reframed the programme as an **architectural adequacy** investigation — asking whether the unit of design between KM and materials is correct.

### Why the second framing proved more productive

| Factor | Effect |
|--------|--------|
| **Separated fidelity from generation shape** | [38Q-1 §D](38Q-1-what-good-looks-like-baseline.md): `fullOk: true` on EV-38P-AFTER proved preservation works; worksheet orientation is upstream |
| **Surfaced native-object mismatch** | [38Q-1](38Q-1-what-good-looks-like-baseline.md): DLA/GAM plans Activity → `required_materials[]` → `learner_task`; 38I plans Episode → functions → transitions |
| **Enabled H1/H2/H3 testing** | Charter hypotheses required comparing implementation improvement, extension, and redesign — not defaulting to prompts |
| **Made transitions visible** | [38Q-2 §7.3](38Q-2-episode-taxonomy-catalogue.md): strongest teaching discriminators are **transition-driven**, not material-type-driven |
| **Prevented false solutions** | [38Q-4](38Q-4-episode-generation-design-options.md): prompt enrichment and GAM extension **Weak** on G3/G5 despite Strong material bodies |
| **Answered blank-sheet test** | [38Q-5](38Q-5-recommended-architecture.md): greenfield design would insert episode planning between LO and DLA — not lengthen prompts |

The subsidiary DLA/GAM question remains valid **only as a downstream constraint** (`fullOk` preservation), not as the governing diagnosis.

---

## Task 2 — Major discoveries

## Major discoveries

### Discovery 1 — Fidelity was not the bottleneck

| Evidence | Finding |
|----------|---------|
| 38M–38P programme | `proofOk: true`, `roleOk: true`, `fullOk: true` on EV-38P-AFTER ([38P-7](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-7-sprint-closure.md)) |
| Body preservation | 20/20 GAM materials at 100% char ratio post-merge ([38P-6A](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |
| Material-body survival | Explanation and Worked thinking **Strong** across A1–A3 ([38Q-3 §7.1](38Q-3-dla-gam-gap-analysis.md)) |

**Implication:** Remaining worksheet orientation cannot be attributed to merge, render, or validator defects.

---

### Discovery 2 — Rich teaching is composed of functions and transitions

| Evidence | Finding |
|----------|---------|
| [38Q-2 taxonomy](38Q-2-episode-taxonomy-catalogue.md) | 28 function-first catalogue; 19 instructional transitions; artefacts secondary |
| Archetype analysis | A1–A4 canonical sequences expressed as ordered functions (Understand discrimination; Apply fade; Analyse inquiry; Evaluate judgement chain) |
| Function-only A4 description | [38Q-2 §8](38Q-2-episode-taxonomy-catalogue.md): capstone episode specifiable without material types |

**Implication:** Teaching architecture is a **sequencing problem**, not a material-catalogue problem.

---

### Discovery 3 — Dominant gaps are G3 and G5

| Evidence | Finding |
|----------|---------|
| [38Q-3 gap analysis](38Q-3-dla-gam-gap-analysis.md) | G3 (missing transitions) + G5 (episode-structure gaps) **dominant** |
| Secondary G4 | Artefact substitution — checklists/tables/templates stand in for reasoning moves |
| Not dominant | Weak exposition; missing material bodies |
| Archetype scoring | None of four activities meet Teaching threshold on transition integrity |

**Implication:** Functions often exist as **material nodes** but are **not connected** into learner-state progression.

---

### Discovery 4 — Prompt accretion does not solve G3/G5

| Evidence | Finding |
|----------|---------|
| [38Q-4 Option A](38Q-4-episode-generation-design-options.md) | **Weak** on all five thematic gaps |
| Prompt accretion analysis | Strong bodies already at current prompt depth; accretion = **symptom** of missing episode model |
| LO guidance contribution | ~5% of target richness without structural plan ([38Q-1](38Q-1-what-good-looks-like-baseline.md) citing 38I-5) |

**Implication:** Richer prompts may deepen G2 weak realisation but cannot reliably enforce transitions.

---

### Discovery 5 — Episode planning is the missing planning object

| Evidence | Finding |
|----------|---------|
| [38Q-1](38Q-1-what-good-looks-like-baseline.md) | H2 High provisional; native-object diagnosis |
| [38Q-3](38Q-3-dla-gam-gap-analysis.md) | Parallel `required_materials[]` bundles; reorder test fails |
| [38Q-4](38Q-4-episode-generation-design-options.md) | Options D/F **Strong** on G3/G5; A/C **Weak** |
| [38Q-5](38Q-5-recommended-architecture.md) | **Instructional Episode Plan** recommended as primary object between LO and DLA |

**Implication:** The missing layer is **upstream planning**, not downstream preservation or realisation.

---

## Task 3 — Success criteria review

| SC | Criterion | Status | Evidence |
|----|-----------|:------:|----------|
| **SC-1** | Authoritative baseline of “what good looks like” documented and cross-linked to 38I | **PASS** | [38Q-1](38Q-1-what-good-looks-like-baseline.md) — §A–§H, archetype assessment, §G matrix |
| **SC-2** | Episode taxonomy distinguishes teaching architecture from worksheet architecture | **PASS** | [38Q-2](38Q-2-episode-taxonomy-catalogue.md) — §7 worksheet vs teaching; function-only patterns |
| **SC-3** | Gap analysis quantifies over/under-use on inflation workload | **PASS** | [38Q-3](38Q-3-dla-gam-gap-analysis.md) — Tasks 1–6; GAP-01–18; ranked over/underuse |
| **SC-4** | Design options evaluated with `fullOk` as hard constraint | **PASS** | [38Q-4](38Q-4-episode-generation-design-options.md) — fidelity column in scoring matrix |
| **SC-5** | Options cover implementation improvement, extension, and redesign paths | **PASS** | [38Q-4](38Q-4-episode-generation-design-options.md) — Options A–F; H1/H2/H3 alignment |
| **SC-6** | Implementation recommendation ready for follow-on sprint | **PASS** | [38Q-5](38Q-5-recommended-architecture.md) — migration principles M-1–M-13; §Inputs to 38Q-6 |
| **SC-7** | No regression to 38M–38P fidelity claims | **PASS** | Charter hold throughout; recommendation preserves merge/render path |
| **SC-8** | **Educational abstraction assessment completed** (H1/H2/H3 tested) | **PASS** | [38Q-1 §G](38Q-1-what-good-looks-like-baseline.md); [38Q-5 Task 1](38Q-5-recommended-architecture.md) final reassessment |
| **SC-9** | **Final recommendation answers what abstraction sits between knowledge and materials** | **PASS** | [38Q-5](38Q-5-recommended-architecture.md) — Instructional Episode Plan; Option F Hybrid |

**SC-8 and SC-9 explicitly confirmed:** Educational abstraction assessment and recommendation are **complete with evidence**.

---

## Task 4 — Hypothesis outcomes

| Hypothesis | Outcome | Notes |
|------------|---------|-------|
| **H1 — Implementation deficiency** | **Rejected as primary cause** | Fidelity closed; Strong exposition at `fullOk`. Residual role: G2 depth within planned functions. [38Q-5 Task 1](38Q-5-recommended-architecture.md) |
| **H2 — Abstraction extension** | **Confirmed** | Missing episode/planning layer between LO and DLA. D/F Strong on G3/G5. Recommendation: Option F Hybrid |
| **H3 — Abstraction misalignment** | **Partially confirmed** | Misalignment is **activity-as-primary-planner**, not DLA/GAM as realisation surfaces. Full stack replacement not recommended |

---

## Task 5 — Architecture recommendation summary

From [38Q-5](38Q-5-recommended-architecture.md).

### Recommended direction

```text
KM (substance)
  ↓
LO (performance intent)
  ↓
Episode archetype selection
  ↓
Instructional Episode Plan    ← PRIMARY PLANNING OBJECT
  ↓
DLA (derived obligations)
  ↓
GAM (material realisation)
  ↓
Page compose (fidelity — unchanged)
```

### Retained

| Component | Role |
|-----------|------|
| **DLA** | Retained — material obligations + cognition fields populated **from** plan |
| **GAM** | Retained — long-form material bodies |
| **Fidelity machinery** | Retained — 38M–38P merge/render/validation path frozen |
| **Instructional Episode Plan** | **Becomes planning authority** — functions, transitions, learner-state progression planned before material generation |

### Selected option

**Option F — Hybrid** (Position 2): episode planning primary; activities/materials downstream realisation.

---

## Task 6 — What 38Q did NOT recommend

Explicit exclusions for future programme context:

| Exclusion | Rationale |
|-----------|-----------|
| **No reopening of 38M–38P** | Fidelity problem solved; gap is upstream shape ([38Q-1 §F](38Q-1-what-good-looks-like-baseline.md)) |
| **No fidelity redesign** | `fullOk` hard constraint; merge/render path proven |
| **No prompt-only strategy** | Option A **Not recommended** — Weak on G3/G5 ([38Q-4](38Q-4-episode-generation-design-options.md)) |
| **No GAM-centric solution** | Option C **Not recommended** — too late in pipeline ([38Q-4](38Q-4-episode-generation-design-options.md)) |
| **No episode-native replacement of whole stack** | Option E / Position 3 **Not recommended** — Position 2 achieves same G3/G5 gain with lower migration risk ([38Q-5](38Q-5-recommended-architecture.md)) |

---

## Task 7 — Follow-on implementation sprint charter inputs

## Recommended implementation objectives

*Identification only — not designed in 38Q.*

| # | Objective | 38Q basis |
|---|-----------|-----------|
| 1 | Define **Instructional Episode Plan** representation (schema, pack contract, or equivalent) | [38Q-5](38Q-5-recommended-architecture.md); unresolved question E-1 |
| 2 | Define **function and transition vocabulary** aligned to [38Q-2](38Q-2-episode-taxonomy-catalogue.md) | 28 functions; 19 transitions; R/C/O tags |
| 3 | Define **archetype planning rules** (Understand / Apply / Analyse / Evaluate) | [38Q-2 archetype mappings](38Q-2-episode-taxonomy-catalogue.md); [38I-3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) |
| 4 | Map **Episode Plan → DLA obligations** (ordered `required_materials[]`, anti-substitution) | [38Q-5 M-4, M-13](38Q-5-recommended-architecture.md); GAP-13 |
| 5 | **Preserve `fullOk`** on EV-38P-AFTER regression baseline | Migration principle M-1, M-2, M-9 |
| 6 | **Demonstrate reduction of G3/G5 gaps** on inflation workload (transition integrity scoring) | [38Q-3 GAP register](38Q-3-dla-gam-gap-analysis.md); acceptance beyond `fullOk` |

### Migration principles (from 38Q-5)

M-1 through M-13 — see [38Q-5 Task 7](38Q-5-recommended-architecture.md). Follow-on sprint must satisfy all.

### Unresolved questions deferred to implementation

- Plan representation format  
- Activity container semantics (one activity per episode vs segmented beats)  
- Session-level scaffold fade across activities  
- Inference contract catalogue for Evaluate functions  
- Authoring/review UX for transition inspection  
- Transition-integrity acceptance harness  

---

## Task 8 — Programme significance

## Why 38Q matters

### What changed in understanding

| Before 38Q | After 38Q |
|------------|-----------|
| Worksheet orientation might be fidelity, prompt, or implementation failure | **Dominant cause is planning abstraction** — G3/G5 |
| Richer output = better DLA/GAM prompts | Richer output = **episode plan** then material realisation |
| A4 Evaluate seen as primary gap | Weaknesses are **cross-archetype** ([38Q-1](38Q-1-what-good-looks-like-baseline.md)) |
| `fullOk` implies teaching quality | `fullOk` implies **preservation** — not episode choreography |

### What changed in architecture thinking

- **Primary planning object** shifts from Activity to **Instructional Episode Plan**
- **DLA/GAM demoted** from planners to **realisation and fidelity surfaces**
- **Transitions** become as important as **functions** in generation design
- **Blank-sheet answer:** would not recreate LO → DLA → GAM unchanged ([38Q-5](38Q-5-recommended-architecture.md))

### Why 38Q is distinct from 38M–38P

| Programme | Question | Outcome |
|-----------|----------|---------|
| **38M–38P** | Can we **preserve** what generation produces? | **Yes** — `fullOk: true` |
| **38Q** | Can we **plan** what generation should produce? | **Not yet** — episode plan layer recommended |

38M–38P closed the **fidelity programme**. 38Q opened the **educational abstraction programme**. They are sequential, not competing.

---

## Phase outcomes summary

| Phase | Deliverable | Outcome |
|-------|-------------|---------|
| **38Q-1** | [Baseline review](38Q-1-what-good-looks-like-baseline.md) | Native-object diagnosis; §G matrix; H1 Low / H2 High / H3 Medium provisional |
| **38Q-2** | [Taxonomy catalogue](38Q-2-episode-taxonomy-catalogue.md) | 28 functions; 19 transitions; worksheet vs teaching discriminators |
| **38Q-3** | [Gap analysis](38Q-3-dla-gam-gap-analysis.md) | G3/G5 dominant; GAP-01–18; archetype scoring |
| **38Q-4** | [Design options](38Q-4-episode-generation-design-options.md) | Six options; D/F Strong; prompt accretion = symptom |
| **38Q-5** | [Recommendation](38Q-5-recommended-architecture.md) | Option F Hybrid; Episode Plan primary |
| **38Q-6** | This document | Closure; SC-1–9 PASS; follow-on inputs |

---

## Evidence base reviewed

| Document | Role |
|----------|------|
| [38Q-1-what-good-looks-like-baseline.md](38Q-1-what-good-looks-like-baseline.md) | Baseline; abstraction matrix; hypotheses |
| [38Q-2-episode-taxonomy-catalogue.md](38Q-2-episode-taxonomy-catalogue.md) | Function-first taxonomy |
| [38Q-3-dla-gam-gap-analysis.md](38Q-3-dla-gam-gap-analysis.md) | Gap quantification; G1–G5 |
| [38Q-4-episode-generation-design-options.md](38Q-4-episode-generation-design-options.md) | Option evaluation |
| [38Q-5-recommended-architecture.md](38Q-5-recommended-architecture.md) | Architecture recommendation |
| [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) | Mission; SC-1–SC-9 |
| EV-38P-AFTER | Canonical comparator; fidelity floor |

---

## Task 9 — Closure statement

### Before 38Q

Prism primarily planned **activities** — parallel `required_materials[]` bundles with completion-oriented `learner_task` shells. The fidelity programme (38M–38P) proved that whatever was generated could be **faithfully preserved** at `fullOk: true`. Worksheet-oriented output persisted.

### After 38Q

Prism is understood to require explicit planning of **instructional episodes** — ordered functions, transitions, and learner-state progression — **before** material obligations are generated. DLA and GAM remain valid **realisation layers** beneath that plan.

The fidelity programme established **preservation**.

38Q established the **planning abstraction** required for richer teaching experiences.

### Governing answer (for programme records)

> **What educational abstraction should sit between knowledge representation and instructional materials?**

**An Instructional Episode Plan** — between Learning Outcomes and DLA population — with DLA, GAM, and Page compose retained as downstream realisation and fidelity machinery.

### What should happen next

**[Sprint 38-R — Instructional Episode Plan Design Proof](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/)** — **CHARTERED**

Design-proof sprint before production implementation:

1. Define minimum viable Episode Plan schema (38R-1)  
2. Test A1–A4 archetype fit (38R-2)  
3. Specify plan→DLA mapping (38R-3)  
4. Design G3/G5 proof while preserving `fullOk` (38R-4)  
5. Recommend implementation, refinement, or rejection (38R-5)  

Production implementation deferred until 38R-6 closure warrants it.

---

## Status

| Field | Value |
|-------|-------|
| Sprint | 38-Q |
| Status | **CLOSED — SUCCESS** |
| Phases | 38Q-1 through 38Q-6 **COMPLETE** |
| Successor | [Sprint 38-R](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/) — **CHARTERED** |
