# Sprint 38-Q — Implementation charter (Instructional Episode Depth and Teaching Architecture)

**Date:** 2026-06-06  
**Status:** **CLOSED — SUCCESS** — [38Q-6 closure](observations/38Q-6-sprint-closure.md)  
**Predecessor:** [Sprint 38-P](../2026-06-05-sprint-38p-instructional-role-fidelity/) (**CLOSED** — [38P-7](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-7-sprint-closure.md) · **SUCCESS**)

---

## Background

### Fidelity programme (closed)

| Sprint | Mission | Status |
|--------|---------|--------|
| **38-M** | Body fidelity — GAM→Page merge; anti-synopsis; `proofOk` | **CLOSED SUCCESS** |
| **38-N** | Render fidelity — markers; A3 sequencing; schema alignment | **CLOSED SUCCESS** |
| **38-O** | Role fidelity discovery — taxonomy; F1 recommendation | **CLOSED SUCCESS** |
| **38-P** | Role fidelity implementation — registry; supersession; `roleOk` | **CLOSED SUCCESS** |

**Outcome on EV-38P-AFTER:**

```text
proofOk: true
roleOk: true
fullOk: true
```

**The fidelity problem is considered solved.** Do not reopen 38M, 38N, 38O, or 38P without new discovery evidence.

Current outputs are **coherent, complete, structurally valid, and faithfully preserved** — yet remain **worksheet-oriented**. That gap is established; its **cause is not yet settled**.

### Generation gap (established — cause open)

[38P-6A](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md) and [38P-7](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-7-sprint-closure.md) established:

- Rich instructional materials are **no longer lost** by the preservation pipeline on the merged path.
- Learner-facing outputs remain **worksheet-oriented** despite successful fidelity preservation.
- Current patterns **overuse** templates, tables, and checklists.
- Current patterns **underuse** worked judgement, weak/strong exemplars, guided reasoning, misconception confrontation, comparative evaluation, transfer chains, narrative episodes, and evaluative dialogue structures.

**38Q does not assume** that improving DLA/GAM behaviour alone will close this gap.

### Episode model (prior art — target anchor)

[Sprint 38-I](../2026-06-05-sprint-38i-instructional-episode-model/) defined **what good looks like** — archetypes, KM/LO mapping, target-state mock-ups, and the [38I-4 A4 Evaluate learner episode](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md). 38-Q **investigates the educational abstraction** needed to reach those targets — it does not assume the current DLA/GAM layer is the correct abstraction.

---

## Mission

**Investigate the educational abstraction between knowledge representation and instructional materials** when the goal is rich teaching episodes rather than worksheet-oriented activities.

Shift the programme question from implementation tuning toward **architectural adequacy** — while preserving the fidelity guarantees in 38M–38P.

---

## Core questions

### Primary question (governing)

> **What educational abstraction should sit between knowledge representation and instructional materials if the goal is to generate rich teaching episodes rather than worksheet-oriented activities?**

### Subsidiary question (not assumed)

> How can DLA and GAM generate richer instructional episodes while preserving the fidelity guarantees already established in 38M–38P?

This subsidiary question remains in scope **only if** investigation supports H1 (implementation deficiency) or H2 (abstraction extension). It is **not** the governing assumption of 38Q.

---

## Educational abstraction challenge

38Q is an **educational abstraction investigation**, not merely a DLA/GAM improvement sprint.

| Principle | Statement |
|-----------|-----------|
| **No default abstraction** | 38Q must **not** assume DLA and GAM are the correct educational abstractions. |
| **Gap ≠ cause** | The generation gap is established; its cause is **not yet settled**. |
| **Three resolution paths** | DLA/GAM may need: **(A)** implementation improvement, **(B)** abstraction extension, or **(C)** abstraction redesign or replacement. |
| **Fidelity frozen** | Any conclusion must respect `fullOk` as a hard constraint on future work. |

### Three hypotheses

| ID | Hypothesis | If true, implies |
|----|------------|------------------|
| **H1 — Implementation deficiency** | Current abstractions are sound; richer outputs require better generation behaviour, prompting, orchestration, or planning | Keep DLA/GAM; improve implementation |
| **H2 — Abstraction extension** | Current abstractions are partially sound but lack first-class structures for instructional episodes, cognitive challenge, scaffolding, reasoning, judgement, transfer, or reflection | Extend DLA/GAM or add a planning/episode layer |
| **H3 — Abstraction misalignment** | Current abstractions are organised around the wrong educational units and naturally produce worksheet-oriented outputs even when fidelity and implementation are correct | Redesign abstraction around instructional episodes |

38Q-1 through 38Q-5 must **test** these hypotheses against 38I exemplars and EV-38P-AFTER output — not presuppose H1.

### Blank-sheet thought experiment (in scope)

> **If Prism were designed today from scratch, would we recreate the current DLA and GAM abstractions?**

This counterfactual is **explicitly in scope** for 38Q. It is not rhetorical decoration — 38Q-5 must address it with evidence.

### Prompt accretion challenge

| Principle | Statement |
|-----------|-----------|
| **No prompt-length assumption** | Do not assume richer outputs require longer prompts. |
| **Symptom vs solution** | Prompt growth may represent genuine educational complexity, **or** compensation for a weak underlying educational model. |
| **Investigation duty** | 38Q should determine whether prompt complexity is a **symptom** rather than a **solution**. |

---

## Target learner arc

Future learner pages should increasingly follow:

```text
Observe → Predict → Compare → Explain → Evaluate → Transfer → Reflect
```

Instead of:

```text
Read → Complete table → Checklist
```

The objective is **not more content**. The objective is **better instructional architecture** — which may require a different abstraction, not only better prompts.

---

## Reference models (authoritative)

| Model | Location | Use in 38Q |
|-------|----------|------------|
| Instructional episode archetypes | [38I-2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) | Taxonomy anchor |
| KM/LO → episode mapping | [38I-3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) | Affordance rules |
| Target-state mock-ups | [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | Density and structure bar |
| A4 Evaluate exemplar | [38I-4 artefact](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | Capstone teaching architecture |
| Prior pedagogical journey | [38I-1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md) | Historical “what good looks like” |
| Workbook pedagogy model | [38C-1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | Learner workbook bar |
| Implementation implications | [38I-5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) | IFP as candidate missing layer |
| Current pipeline evidence | [38P-6A](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md) | Worksheet vs episode gap |
| Post-fidelity proof | `EV-38P-AFTER-*` | Baseline — must not regress |

**Pattern families to assess against abstractions:**

- Worked judgement and weak vs strong comparison structures
- Guided-to-independent reasoning sequences
- Misconception repair and confrontation
- Comparative evaluation and criteria construction
- Transfer and application chains
- Narrative learning episodes and evaluative dialogue structures

---

## Scope

### In scope

| Area | Description |
|------|-------------|
| Baseline review | Synthesise 38I, historical exemplars, EV-38P-AFTER; **abstraction adequacy matrix** |
| Episode taxonomy | Teaching-architecture vs worksheet patterns |
| Gap analysis | Current output vs 38I targets; classify H1/H2/H3 evidence |
| Abstraction options | Implementation improvement, extension, or redesign |
| Recommended architecture | What abstraction should sit between knowledge and materials |
| Counterfactual test | Blank-sheet DLA/GAM recreation question |
| Prompt accretion analysis | Symptom vs genuine complexity |

### Out of scope (this sprint)

| Item | Notes |
|------|-------|
| Production code changes | Default is docs only |
| Pack prompt edits | Design recommendations only until follow-on sprint |
| Renderer / validator changes | Fidelity machinery frozen |
| Reopening 38M–38P | Hold unless new evidence |
| Pre-deciding H1/H2/H3 | Investigation must remain open through 38Q-4 |

---

## Success criteria (sprint completion)

At 38Q-6 closure:

| ID | Criterion |
|----|-----------|
| **SC-1** | Authoritative baseline of “what good looks like” documented and cross-linked to 38I |
| **SC-2** | Episode taxonomy distinguishes teaching architecture from worksheet architecture |
| **SC-3** | Gap analysis quantifies current over/under-use patterns on inflation workload |
| **SC-4** | Design options evaluated with `fullOk` preservation as hard constraint |
| **SC-5** | Options cover implementation improvement, abstraction extension, and redesign paths |
| **SC-6** | Implementation recommendation ready for follow-on sprint with proof plan |
| **SC-7** | No regression to 38M–38P fidelity claims in documentation |
| **SC-8** | **Educational abstraction assessment completed** (H1/H2/H3 tested; §G matrix filled) |
| **SC-9** | **Final recommendation answers what abstraction should sit between knowledge and instructional materials** |

**38Q-6 concluded (with evidence):**

- **H2 confirmed** — extend with Instructional Episode Plan layer (Option F Hybrid)
- H1 rejected as primary cause; H3 partially confirmed (reframe planner, not replace stack)

See [38Q-6 closure](observations/38Q-6-sprint-closure.md).

---

## Phase plan

### 38Q-1 — Baseline review (“what good looks like” + abstraction adequacy)

| Field | Content |
|-------|---------|
| **Purpose** | Synthesise exemplars; complete §G abstraction matrix; counterfactual generation test for 38I-4 A4 |
| **Deliverable** | [observations/38Q-1-what-good-looks-like-baseline.md](observations/38Q-1-what-good-looks-like-baseline.md) |
| **Permissions** | Docs only |
| **Status** | **COMPLETE** |

---

### 38Q-2 — Instructional episode taxonomy and pattern catalogue

| Field | Content |
|-------|---------|
| **Purpose** | Catalogue teaching-architecture patterns; map features to abstraction requirements |
| **Deliverable** | [observations/38Q-2-episode-taxonomy-catalogue.md](observations/38Q-2-episode-taxonomy-catalogue.md) |
| **Depends on** | 38Q-1 |
| **Status** | **COMPLETE** |

---

### 38Q-3 — Gap analysis: current output vs desired episodes

| Field | Content |
|-------|---------|
| **Purpose** | Compare EV-38P-AFTER to 38I targets; classify evidence toward H1/H2/H3 |
| **Deliverable** | [observations/38Q-3-dla-gam-gap-analysis.md](observations/38Q-3-dla-gam-gap-analysis.md) |
| **Depends on** | 38Q-1, 38Q-2 |
| **Status** | **COMPLETE** |

---

### 38Q-4 — Design options (abstraction paths)

| Field | Content |
|-------|---------|
| **Purpose** | Options across implementation improvement, extension, and redesign; prompt accretion analysis |
| **Deliverable** | [observations/38Q-4-episode-generation-design-options.md](observations/38Q-4-episode-generation-design-options.md) |
| **Depends on** | 38Q-3 |
| **Status** | **COMPLETE** |

---

### 38Q-5 — Recommended architecture

| Field | Content |
|-------|---------|
| **Purpose** | Recommended educational abstraction; blank-sheet counterfactual answered |
| **Deliverable** | [observations/38Q-5-recommended-architecture.md](observations/38Q-5-recommended-architecture.md) |
| **Depends on** | 38Q-4 |
| **Status** | **COMPLETE** |

---

### 38Q-6 — Closure and implementation recommendation

| Field | Content |
|-------|---------|
| **Purpose** | Sprint closure; SC-8/SC-9; follow-on sprint charter |
| **Deliverable** | [observations/38Q-6-sprint-closure.md](observations/38Q-6-sprint-closure.md) |
| **Depends on** | 38Q-5 |
| **Status** | **COMPLETE** |

**Dependency chain:**

```text
38Q-1 Baseline + abstraction matrix → 38Q-2 Taxonomy → 38Q-3 Gap (H1/H2/H3)
  → 38Q-4 Abstraction options → 38Q-5 Recommendation → 38Q-6 Closure
```

---

## Implementation permissions by phase

| Phase | Code / pack changes | Notes |
|-------|---------------------|-------|
| **38Q-1** through **38Q-6** | **Docs only** (default) | Investigation sprint |
| **Successor sprint** | [38R](../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/) — design proof | Must preserve `fullOk` |

**Hold:** `proofOk`, `roleOk`, and `fullOk` on EV-38P-AFTER remain the fidelity floor.

---

## Programme lineage

```text
38M — Body fidelity (proofOk)                         CLOSED SUCCESS
38N — Render fidelity                                 CLOSED SUCCESS
38O — Role fidelity discovery                         CLOSED SUCCESS
38P — Role fidelity implementation (fullOk)          CLOSED SUCCESS
38I — Instructional episode model (target states)     CLOSED SUCCESS
38Q — Educational abstraction investigation           CHARTERED  ← THIS SPRINT
```

---

## Risks

| Risk | Mitigation |
|------|------------|
| Premature H1 conclusion (“just improve prompts”) | H1/H2/H3 framework; blank-sheet test; prompt accretion challenge |
| Reopening fidelity sprints | Charter hold |
| Conflating role survival with episode depth | 38P proves roles; 38Q investigates abstraction |
| Prompt length as proxy for richness | Explicit prompt accretion investigation in 38Q-4 |
| Ignoring 38I prior work | 38I remains authoritative target anchor |
| Abstraction redesign without proof plan | 38Q-6 must specify `fullOk` regression requirement |
