# 38Q-5 — Recommended educational architecture

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Architecture recommendation — docs only; no implementation  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38Q-5  
**Inputs:** [38Q-1](38Q-1-what-good-looks-like-baseline.md) · [38Q-2](38Q-2-episode-taxonomy-catalogue.md) · [38Q-3](38Q-3-dla-gam-gap-analysis.md) · [38Q-4](38Q-4-episode-generation-design-options.md)  
**Successor:** 38Q-6 Sprint closure

---

## Scope

This phase makes an **explicit architecture recommendation** grounded entirely in 38Q-1 through 38Q-4. No new evidence introduced. 38M–38P not reopened. `fullOk` remains a hard constraint.

### Primary decision question

> What should be the primary planning object between learning outcomes and instructional materials?

### Success condition

At end of 38Q-5 it is possible to answer:

> **What educational abstraction should sit between knowledge representation and instructional materials if the goal is rich teaching episodes rather than worksheet-oriented activities?**

---

## Task 1 — Final hypothesis reassessment

Evidence accumulated across 38Q-2 (taxonomy), 38Q-3 (gap quantification), and 38Q-4 (option stress-testing) revises confidence from 38Q-1 provisional verdict.

| Hypothesis | Evidence for | Evidence against | Final assessment |
|------------|--------------|------------------|------------------|
| **H1 — Implementation deficiency** | Weak/strong comparison and worked bodies generate at `fullOk` ([38Q-1 §G.5](38Q-1-what-good-looks-like-baseline.md)); 38M–38P closed preservation defects; some G2 depth gaps may yield to better specs | Worksheet orientation persists at `fullOk` ([38Q-3](38Q-3-dla-gam-gap-analysis.md)); G3/G5 dominant — not implementation bugs; prompt enrichment **Weak** on all five thematic gaps ([38Q-4 Task 4](38Q-4-episode-generation-design-options.md)); LO guidance ~5% richness ([38Q-1](38Q-1-what-good-looks-like-baseline.md) citing 38I-5) | **Rejected as primary cause.** **Strengthened against** across 38Q. Residual role: G2 depth tuning within planned functions. |
| **H2 — Abstraction extension** | 7/11 features scored **B** partial support ([38Q-1 §G](38Q-1-what-good-looks-like-baseline.md)); functions exist as material nodes but transitions Missing ([38Q-3 §7.1–7.4](38Q-3-dla-gam-gap-analysis.md)); D/F **Strong** on G3/G5 ([38Q-4](38Q-4-episode-generation-design-options.md)); ~35% target richness from episode structure unrealised ([38Q-1](38Q-1-what-good-looks-like-baseline.md) citing 38I-5); planning layer preserves DLA/GAM fidelity path | Extension without enforcement risks prompt accretion ([38Q-4 prompt accretion](38Q-4-episode-generation-design-options.md)); plan could devolve into labelled checklist (38Q-4 failure mode) | **Confirmed as primary resolution path.** **Strengthened** across 38Q. |
| **H3 — Abstraction misalignment** | Activity + parallel `required_materials` = worksheet architecture ([38Q-1 native-object](38Q-1-what-good-looks-like-baseline.md)); 3/11 features **C** — sequence-native with no material home ([38Q-1 §G](38Q-1-what-good-looks-like-baseline.md)); reorder test fails ([38Q-3 GAP-13](38Q-3-dla-gam-gap-analysis.md)); `learner_task` = completion checklist | GAM material model valid as **realisation** ([38Q-4](38Q-4-episode-generation-design-options.md)); Strong exposition at `fullOk` — not wholly wrong stack; full retirement of DLA/GAM risks fidelity regression (38Q-4 Option E **Moderate** fidelity) | **Partially confirmed — unit-of-design, not full stack replacement.** **Strengthened on diagnosis; weakened on “replace everything.”** Misalignment is **activity-as-primary-planner**, not DLA/GAM as material surfaces. |

### Hypothesis trajectory

```text
38Q-1 provisional:  H1 Low · H2 High · H3 Medium
38Q-3 quantified:   G3 + G5 dominant — planning/sequencing gap
38Q-4 stress-tested: D/F Strong; A/C Weak on G3/G5
38Q-5 conclusion:   H2 primary · H3 partial (reframe planner) · H1 residual only
```

---

## Task 2 — Blank-sheet evaluation

**Setup:** Prism does not exist. Fidelity requirements (`proofOk`, `roleOk`, `fullOk`) and 38I target states are known design constraints.

### Would we design KM → LO → DLA → GAM → Page unchanged?

**No.**

| Reason | Evidence |
|--------|----------|
| Pipeline optimises **material catalogue completion**, not **learner-state progression** | [38Q-1](38Q-1-what-good-looks-like-baseline.md): native object = Activity → `required_materials[]` → `learner_task` |
| LO → activity shell collapses episode choreography | [38Q-3 GAP-13](38Q-3-dla-gam-gap-analysis.md): parallel bundles; [38Q-1 §H](38Q-1-what-good-looks-like-baseline.md): LO→task collapse |
| Transition-dominant teaching cannot be specified as material list | [38Q-2 §7](38Q-2-episode-taxonomy-catalogue.md): fade, predict-revise, perspective→judgement are **edge-weighted** |
| Rich A4 describable function-only without material types | [38Q-2 §8](38Q-2-episode-taxonomy-catalogue.md) |
| EV-38P proves preservation works — gap is **upstream shape** | [38Q-3](38Q-3-dla-gam-gap-analysis.md): Strong bodies + Missing transitions at `fullOk` |

### What would we keep?

| Layer | Blank-sheet verdict | Why |
|-------|---------------------|-----|
| **KM** | **Keep** | Substance source; strongly supported functions map to KM ([38Q-1 §G](38Q-1-what-good-looks-like-baseline.md)) |
| **LO** | **Keep** | Performance intent; archetype signal |
| **DLA** | **Keep as realisation** | Obligation population + cognition fields — not as primary planner |
| **GAM** | **Keep as realisation** | Long-form material bodies; 38M–38P fidelity proven |
| **Page compose** | **Keep unchanged** | Fidelity floor — do not redesign |

### What planning object would we choose instead?

**Instructional Episode Plan** — ordered instructional functions, explicit transitions, and learner-state progression targets — **between LO and DLA**.

```text
KM (substance)
  ↓
LO (performance intent)
  ↓
Episode archetype (Understand | Apply | Analyse | Evaluate)
  ↓
Instructional Episode Plan   ← NEW PRIMARY PLANNING OBJECT
  ↓  ordered functions + transitions + learner-state targets
  ↓  inference contracts for Evaluate / taxonomy gaps
DLA population (obligations derived from plan)
  ↓
GAM realisation
  ↓
Page compose (fidelity — frozen)
```

This matches the **38Q-4 Option F (Hybrid)** cluster and [38Q-1 leading interim hypothesis](38Q-1-what-good-looks-like-baseline.md): extend with planning layer; preserve DLA/GAM as realisation.

### Position evaluation (three candidates)

| Position | Statement | Verdict | Evidence |
|----------|-----------|---------|----------|
| **Position 1** | Activity remains primary planner | **Rejected** | G3/G5 dominant ([38Q-3](38Q-3-dla-gam-gap-analysis.md)); A/C Weak ([38Q-4](38Q-4-episode-generation-design-options.md)); worksheet architecture all four archetypes ([38Q-3 Task 5](38Q-3-dla-gam-gap-analysis.md)) |
| **Position 2** | Episode planning primary; activities/materials downstream | **Recommended** | D/F Strong on G3/G5; fidelity **Strong**; H2 confirmed; reframes H3 misalignment without discarding 38M–38P investment |
| **Position 3** | Episode sole planner; retire activity-centred planning | **Not recommended** | Educational alignment **Strong** (Option E) but fidelity **Moderate**, migration **Weak** ([38Q-4](38Q-4-episode-generation-design-options.md)); Position 2 achieves same G3/G5 gain with lower risk |

---

## Task 3 — Recommended educational architecture

## Recommended educational architecture

### Recommendation (single direction)

**Adopt Option F — Hybrid path:** introduce an **Instructional Episode Plan** as the **primary planning object** between LO and DLA; preserve DLA, GAM, and Page compose as **downstream realisation and fidelity surfaces**.

This is Position 2. It subsumes Option D (planning layer) with an explicit preservation commitment to the proven merge/render path.

### Primary planning object

**Instructional Episode Plan**

| Property | Description |
|----------|-------------|
| **Unit of design** | One coherent instructional episode per LO-bound teaching unit |
| **Contents** | Ordered instructional functions (38Q-2 taxonomy); explicit transitions; learner-state change targets per beat |
| **Authority** | **Canonical ordering** — materials may not be generated until plan is complete |
| **Archetype** | Selected from Understand / Apply / Analyse / Evaluate ([38Q-2](38Q-2-episode-taxonomy-catalogue.md)) |
| **Anti-patterns** | Forbids parallel material-bundle planning; forbids checklist/table substitution for missing functions ([38Q-3 G4](38Q-3-dla-gam-gap-analysis.md)) |

### Secondary planning objects

| Object | Role | Relationship to primary |
|--------|------|-------------------------|
| **KM** | Substance: concepts, processes, misconceptions, relationships, groupings | Feeds function population; trigger rules upgrade obligations (e.g. misconception → confrontation **R**) |
| **LO** | Performance intent, cognitive signal, concept scope | Selects archetype; bounds episode scope |
| **Archetype selector** | Maps LO + KM to canonical sequence template | Instantiates episode plan skeleton from [38Q-2 archetype mappings](38Q-2-episode-taxonomy-catalogue.md) |
| **Inference contracts** | Gap-fill for high-inference functions (Evaluate criteria, perspectives, trade-offs) | Attached to plan — not ad hoc GAM prompting |
| **Activity** | **Realisation container** — holds DLA row, `learner_task` segments, page binding | **Demoted** from planner to output structure; populated **from** plan |
| **DLA** | Material obligations + cognition fields | **Derived** from plan: each function maps to `required_materials[]` entry with order and role |
| **GAM** | Long-form material bodies | Realises obligations; anti-spoiler discipline unchanged |
| **Page compose** | Merge + render fidelity | **Frozen** — 38M–38P investment preserved |

### Episode planning ↔ material generation

```text
Plan first:     functions + transitions + learner-state targets
                     ↓
Map:            each planned function → ACM material obligation(s)
                     ↓
Populate DLA:   ordered required_materials[] + learner_task aligned to plan beats
                     ↓
Generate GAM:   bodies honour function intent (not generic table/checklist default)
                     ↓
Compose Page:   existing fidelity machinery (unchanged)
```

**Rule:** Materials **realise** planned functions. They do not **define** the episode. A checklist may realise **Verification** only when the plan specifies a verification function with defined learner-state change — not as default episode closure ([38Q-3 GAP-08](38Q-3-dla-gam-gap-analysis.md)).

### Relationship to fidelity machinery

| Fidelity guarantee | Architectural treatment |
|--------------------|-------------------------|
| `proofOk` | Plan does not bypass GAM→Page merge; bodies still generated and preserved |
| `roleOk` | Plan maps functions to existing role registry; no new render roles required for first gain |
| `fullOk` | Plan increases **obligation completeness and order** upstream; fidelity path unchanged |
| 38M–38P | **Not reopened** — episode plan feeds **into** existing DLA/GAM/Page stack |

The recommendation **extends upstream planning**; it does **not** replace downstream fidelity machinery.

---

## Task 4 — Competing options decision table

| Option | Decision | Reason |
|--------|----------|--------|
| **A — Prompt enrichment** | **Not recommended** | **Weak** on G3/G5 and all five thematic gaps ([38Q-4 Task 4](38Q-4-episode-generation-design-options.md)). Strong exposition already at `fullOk` ([38Q-3 §7.1](38Q-3-dla-gam-gap-analysis.md)) — bottleneck is not material prose. Prompt accretion = symptom ([38Q-4](38Q-4-episode-generation-design-options.md)). False-confidence risk under `fullOk`. |
| **B — DLA extension** | **Partially adopted** | Function ordering and obligation concepts **flow into DLA from plan** — but DLA must not remain **primary planner**. Activity-centric extension alone risks cosmetic tags + G5 recurrence ([38Q-4 Option B failure modes](38Q-4-episode-generation-design-options.md)). Adopt as **realisation shape**, not planning authority. |
| **C — GAM extension** | **Not recommended** | Too late for G3/G5 ([38Q-4](38Q-4-episode-generation-design-options.md)). Cannot obligate functions DLA never requested. GAP-02 fade, GAP-03 perspective construction require **upstream** obligations. Fidelity path should not absorb choreography logic ([38Q-1 §F](38Q-1-what-good-looks-like-baseline.md)). |
| **D — Planning layer** | **Recommended** | **Core** of recommendation. **Strong** on functions, transitions, episode planning, G3/G5 ([38Q-4 Task 3–4](38Q-4-episode-generation-design-options.md)). H2 primary alignment. Fidelity **Strong**. |
| **E — Episode-native redesign** | **Not recommended** | Strongest H3 alignment but **Moderate** fidelity compatibility, **Weak** migration ([38Q-4](38Q-4-episode-generation-design-options.md)). Position 2 achieves same educational object without retiring proven DLA→GAM→Page path. 58/58 regression exposure ([38Q-1 §F](38Q-1-what-good-looks-like-baseline.md)). |
| **F — Hybrid** | **Recommended** | **Selected direction** — D plus explicit DLA/GAM/Page preservation. **Strong** on G3/G5; fidelity **Strong**; migration **Moderate** vs E **Weak** ([38Q-4](38Q-4-episode-generation-design-options.md)). Best trade-off per 38Q-4 synthesis. |

---

## Task 5 — Educational rationale

### Why episodes require function/transition/state planning

Rich teaching episodes are **sequences of learner-state changes**, not **collections of artefacts**.

| Evidence source | Finding |
|-----------------|---------|
| [38Q-2 §7](38Q-2-episode-taxonomy-catalogue.md) | Strongest worksheet vs teaching discriminator = **ordered progression with fade** |
| [38Q-2 §7.3](38Q-2-episode-taxonomy-catalogue.md) | Fade, predict-revise, perspective→judgement are **transition-dominant** — pedagogical value on **edges**, not nodes |
| [38Q-3 §7.3](38Q-3-dla-gam-gap-analysis.md) | Priority transitions **Missing/Weak** all archetypes despite Strong material bodies |
| [38Q-3 Task 3](38Q-3-dla-gam-gap-analysis.md) | Tables, checklists, templates **substitute** for reasoning moves (G4) — artefact present, function absent |
| [38Q-3 A4](38Q-3-dla-gam-gap-analysis.md) | 8/8 material **types** present; 0/5 Evaluate transitions **Strong** — type coverage ≠ teaching |
| [38Q-1 reorder test](38Q-1-what-good-looks-like-baseline.md) | Parallel bundles reorderable without pedagogical loss — materials lack choreography |
| [38Q-2 §8](38Q-2-episode-taxonomy-catalogue.md) | A4 capstone fully specifiable in **functions only** — no table/template required to **plan** episode |

### Why material-bundle planning fails

| Material pattern | What it optimises | What it cannot guarantee |
|------------------|-------------------|--------------------------|
| **Tables** | Completion | Guided→Independent fade ([GAP-01](38Q-3-dla-gam-gap-analysis.md)) |
| **Checklists** | Tick verification | Quality rubric + repair dialogue ([GAP-08](38Q-3-dla-gam-gap-analysis.md)) |
| **Templates** | Form completion | Defended evaluative judgement ([GAP-10](38Q-3-dla-gam-gap-analysis.md)) |
| **Parallel bundles** | Coverage | Learner-state progression ([GAP-13](38Q-3-dla-gam-gap-analysis.md)) |

**Conclusion:** Material types are **valid realisations** when downstream of a function plan. As **primary planning vocabulary**, they collapse episodes into worksheet architecture — observed on EV-38P-AFTER at `fullOk: true` ([38Q-3 success condition](38Q-3-dla-gam-gap-analysis.md)).

---

## Task 6 — System architecture statement

**Current Prism plans:**

> Learning outcomes → activities with parallel `required_materials[]` and completion-oriented `learner_task` shells → GAM material bodies → preserved pages.

**Recommended Prism should plan:**

> Learning outcomes → **instructional episode plans** (ordered functions, transitions, learner-state progression) → **derived** material obligations and activity segments → GAM realisation → preserved pages.

---

## Task 7 — Migration principles

Derived from 38Q evidence. Any follow-on implementation sprint **must** satisfy:

| ID | Principle | Evidence basis |
|----|-----------|----------------|
| **M-1** | **Preserve `fullOk`** | [38Q-1 §F](38Q-1-what-good-looks-like-baseline.md) F-1; [38Q-3](38Q-3-dla-gam-gap-analysis.md): fidelity floor frozen |
| **M-2** | **Do not reopen 38M–38P** | [38Q-1 §F](38Q-1-what-good-looks-like-baseline.md) F-2; merge/render path proven |
| **M-3** | **Episode plan is planning authority** | G3/G5 dominant ([38Q-3](38Q-3-dla-gam-gap-analysis.md)); GAM cannot retrofit missing obligations ([38Q-4 Option C](38Q-4-episode-generation-design-options.md)) |
| **M-4** | **Separate episode planning from material realisation** | Hybrid boundary ([38Q-4 Option F](38Q-4-episode-generation-design-options.md)); avoid B-style cosmetic tags |
| **M-5** | **Transitions are first-class** | [38Q-2 §7.3](38Q-2-episode-taxonomy-catalogue.md); score edges not only nodes |
| **M-6** | **Anti-substitution rules** | G4 secondary but systematic ([38Q-3 Task 3](38Q-3-dla-gam-gap-analysis.md)); checklist/table only when function plan permits |
| **M-7** | **Prompt accretion is not primary strategy** | [38Q-4 prompt accretion](38Q-4-episode-generation-design-options.md); structural plan before prompt depth |
| **M-8** | **Archetype-canonical sequences** | [38Q-2](38Q-2-episode-taxonomy-catalogue.md) A1–A4 mappings as plan templates |
| **M-9** | **Regression suite non-regression** | [38Q-1 §F](38Q-1-what-good-looks-like-baseline.md) F-3: 58/58 floor |
| **M-10** | **38I target states remain acceptance authority** | [38Q-1 §F](38Q-1-what-good-looks-like-baseline.md) F-4; plan must close GAP register |
| **M-11** | **Inference contracts for Evaluate/high-inference functions** | [38Q-3 GAP-02–04](38Q-3-dla-gam-gap-analysis.md); plan-layer gap-fill, not GAM improvisation |
| **M-12** | **Activity demoted, not deleted** | Position 2 vs 3 ([Task 2](#task-2--blank-sheet-evaluation)); realisation container preserves page binding |
| **M-13** | **Plan-before-populate gate** | No DLA `required_materials[]` without completed episode plan — addresses GAP-13 |

---

## Task 8 — Recommendation confidence

| Area | Confidence | Rationale |
|------|:----------:|-----------|
| **Problem diagnosis** | **High** | G3/G5 quantified across four archetypes ([38Q-3](38Q-3-dla-gam-gap-analysis.md)); causal separation from fidelity ([38Q-1 §D](38Q-1-what-good-looks-like-baseline.md)) |
| **Taxonomy validity** | **High** | Function-first catalogue; transition-dominant patterns; function-only A4 description ([38Q-2](38Q-2-episode-taxonomy-catalogue.md)) |
| **Gap analysis** | **High** | S/P/W/M matrices; GAP-01–18 register; archetype scoring consistent with 38P-6A |
| **Recommended architecture** | **High** | D/F **Strong** on all stress-test gaps; H2 strengthened; blank-sheet converges on planning layer; Position 2 preferred over 1 and 3 |
| **Migration feasibility** | **Medium** | Fidelity path preserved (reduces risk); plan→DLA enforcement and inference contracts unproven in production; session-level fade remains open ([38Q-4 unresolved questions](38Q-4-episode-generation-design-options.md)) |

---

## Task 9 — Inputs to closure

## Inputs to 38Q-6

### Recommendation summary

| Field | Value |
|-------|-------|
| **Direction** | **Option F — Hybrid** (Position 2) |
| **Primary planning object** | **Instructional Episode Plan** (functions + transitions + learner-state progression) |
| **Preserved surfaces** | DLA obligations, GAM bodies, Page compose (38M–38P fidelity) |
| **Rejected as primary** | Prompt enrichment (A); GAM choreography (C); activity-primary planning (Position 1); full stack redesign (E / Position 3) |
| **Hypothesis conclusion** | **H2 confirmed** · **H1 rejected as primary** · **H3 partial** (reframe planner, not replace realisation) |

### Rationale summary

The dominant bottleneck is **missing transitions (G3)** and **episode-structure gaps (G5)**, not weak material bodies. EV-38P-AFTER proves DLA/GAM can **preserve** rich content at `fullOk`; it does not **plan** teaching sequences. A blank-sheet Prism would insert **episode planning between LO and DLA**, not lengthen prompts or extend GAM downstream. Hybrid preserves fidelity investment while making learner-state progression first-class.

### Unresolved questions (for 38Q-6 / follow-on)

1. **Plan representation** — conceptual object only in 38Q-5; schema vs pack-contract vs runtime structure deferred to implementation sprint.
2. **Activity container semantics** — one activity per episode vs segmented beats within activity row.
3. **Session-level scaffold fade** — cross-activity progression ([38Q-3 GAP-01](38Q-3-dla-gam-gap-analysis.md); 38Q-4 E-3) — session arc contract scope.
4. **Inference contract catalogue** — Evaluate criteria/perspectives/trade-offs: minimum viable rule set.
5. **Authoring/review UX** — how reviewers inspect transitions before generation.
6. **Acceptance harness** — transition integrity scoring beyond `fullOk` for follow-on validation.

### Implementation-sprint prerequisites

| Prerequisite | Source |
|--------------|--------|
| Charter authorising episode-plan layer | 38Q-6 closure |
| EV-38P-AFTER regression baseline locked | [38Q-1 §F](38Q-1-what-good-looks-like-baseline.md) |
| Archetype plan templates from 38Q-2 | [38Q-2 archetype mappings](38Q-2-episode-taxonomy-catalogue.md) |
| GAP closure acceptance matrix | [38Q-3 GAP register](38Q-3-dla-gam-gap-analysis.md) |
| Migration principles M-1–M-13 | This document §Task 7 |
| Paper walkthrough: A4 plan → DLA trace | [38Q-4 E-1](38Q-4-episode-generation-design-options.md) |

---

## Direct answer — governing question

> **What educational abstraction should sit between knowledge representation and instructional materials?**

**An Instructional Episode Plan** — specifying ordered instructional functions, transitions, and learner-state progression — sitting **between Learning Outcomes and DLA population**, with DLA and GAM retained as **material realisation and fidelity layers**.

This is evidence-led conclusion from 38Q-1 through 38Q-4:

- **Not** retain-and-prompt-only (H1 rejected),
- **Not** replace DLA/GAM entirely (H3 moderated),
- **Yes** extend with episode-first planning (H2 confirmed) in hybrid form (Option F).

---

## Hold conditions

- Architectural recommendation only — no implementation specification.  
- 38M–38P not reopened.  
- `fullOk` non-negotiable for follow-on work.  
- No new evidence beyond 38Q-1–38Q-4 corpus.

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38Q-5 |
| Status | **COMPLETE** |
| Next | **38Q-6** — sprint closure (SC-8, SC-9) |
