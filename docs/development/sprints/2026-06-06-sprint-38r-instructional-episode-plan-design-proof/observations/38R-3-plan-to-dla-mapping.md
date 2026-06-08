# 38R-3 — Episode Plan → DLA mapping

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Design-proof phase — docs only; no code; no production schema  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38R-3  
**Inputs:** [38R-1 V1](38R-1-minimum-viable-episode-plan.md) · [38R-2 A1–A4 plans](38R-2-archetype-fit-test.md) · [38Q-3 gaps](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) · [38Q-5 M-1–M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) · `EV-38M-AFTER-dla-learning-activities.json`  
**Successor:** [38R-4 Proof and validation design](38R-4-proof-validation-design.md)

---

## Executive framing

**Frozen plan (V1):**

```yaml
episode_plan:
  archetype: <archetype>
  beats:
    - function: <FunctionEnum>
```

**Rule:** Beat order is pedagogically authoritative.

**Primary question:**

> Can ordered instructional functions become DLA obligations without collapsing back into worksheet-oriented material bundles?

**38Q failure mode to avoid:**

```text
Activity → parallel required_materials[] → completion learner_task
         → G3, G5, G4
```

**Design stance:** Map **functions** to **obligations** — not materials to materials. GAM chooses material types at realisation.

---

## Task 1 — Mapping principles

## Mapping principles

Derived from [38Q-3](38Q-3-dla-gam-gap-analysis.md), [38Q-5 M-1–M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md), and `EV-38M-AFTER` failure patterns.

| ID | Principle | Statement | Evidence |
|----|-----------|-----------|----------|
| **P1** | **Beat survival** | Every plan beat produces **≥1 traceable DLA obligation**; no beat may be absorbed into `learner_task` prose only | [38Q-3 G5](38Q-3-dla-gam-gap-analysis.md); cognition fields today do not substitute for missing materials ([38Q-3 §4.2 rank 10](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **P2** | **Order survival** | DLA obligation order **equals** plan beat order (index-aligned); no parallel bundle reordering | [GAP-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md); [38Q-5 M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) plan-before-populate gate |
| **P3** | **Transition-chain survival** | T1–T5 subchains map to **separate obligations** — never merged | [38R-2 T1 stress](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md); EV-38M A2 M7 single table = GAP-01/06 |
| **P4** | **Materials realise beats** | Material type is **downstream** (GAM); obligation carries `instructional_function` + pedagogical spec — not table/checklist as plan unit | [38Q-5 M-6](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **P5** | **Verification depth** | `verification` obligation requires **quality-audit spec** (rubric dimensions, repair path) — checklist is optional realisation, not default | [GAP-08](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) |
| **P6** | **Learner reflection** | `reflection` obligation requires **learner-generated action** — not designer `consolidation_summary` read-only | [GAP-11](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) |
| **P7** | **Anti-substitution** | No obligation may use artefact type as **sole** specification (e.g. "include checklist") without function intent | [38Q-3 G4 class](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) |
| **P8** | **Task derives from plan** | `learner_task` is **assembled from beat obligations** in order — not a generic completion shell prepended to bundle | EV-38M `learner_task` = "Study… Complete table… Verify…" pattern |
| **P9** | **Plan authority** | No `required_materials[]` entry exists without a plan beat ([38Q-5 M-3, M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)) | G5 root cause |
| **P10** | **Fidelity path unchanged** | Mapping feeds existing DLA → GAM → Page compose; does not bypass 38M–38P | [38Q-5 M-1, M-2](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |

### Refinements to candidate principles (Task 1)

| Candidate | Verdict |
|-----------|---------|
| P1–P6 (user list) | **Retained** — renamed P5/P6 for precision; evidence added |
| — | **Added P7–P10** — anti-substitution, learner_task derivation, plan authority, fidelity hold |

---

## Task 2 — Beat-to-obligation mapping model

### Obligation types (design-level — not production schema)

| Obligation type | DLA surface | When used |
|-----------------|-------------|-----------|
| **OBL-M** | `required_materials[]` entry | Beat requires learner-facing material body |
| **OBL-C** | Cognition field on activity row | Beat is preamble-class (orientation, activation, thin transition) |
| **OBL-T** | `learner_task` segment (ordered) | Beat defines learner action summary tied to function |

Every beat maps to **≥1** of OBL-M / OBL-C / OBL-T. Most teaching beats → **OBL-M** with function-tagged spec.

### Conceptual obligation record (design contract)

```yaml
function_obligation:
  index: <matches plan beat index>
  instructional_function: <FunctionEnum>
  obligation_class: material | cognition | task_segment
  pedagogical_spec: <what learner-state change, not material type>
  anti_substitution: <forbidden realisations>
```

**Population rule:** `required_materials[i]` is generated from beat `i` where `obligation_class: material`. Cognition fields do **not** consume beat index — they **annotate** beats mapped to OBL-C without breaking order index of OBL-M chain.

### Function → obligation mapping table

| Function | DLA obligation type | Pedagogical spec (obligation must preserve) | Anti-substitution |
|----------|---------------------|---------------------------------------------|-------------------|
| **orientation** | OBL-C → `activity_preamble` | Session-arc purpose; why this episode now | Generic boilerplate only |
| **framing** | OBL-C → `reasoning_orientation` + OBL-T segment | Bounded problem statement | — |
| **activation** | OBL-C → `prior_knowledge_activation` | Prior-knowledge recall prompt | — |
| **explanation** | OBL-M | Teach core concept / procedure rules | Synopsis-only body |
| **example** | OBL-M | Positive instance illustrating concept | — |
| **non_example** | OBL-M | Contrasting case; boundary discrimination | Merged into example |
| **misconception_confrontation** | OBL-M | Named confusion + reconciliation move | Single support_note line |
| **criteria_exposition** | OBL-M | Decision/analytic dimensions delivered for use | — |
| **criteria_construction** | OBL-M + OBL-T | Learner weights/prioritises criteria for case | Read-only rubric prose only ([GAP-04](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **perspective_construction** | OBL-M + OBL-T | Learner constructs viewpoints/lenses; pause-and-write | Scenario menu only ([GAP-03](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **worked_thinking** | OBL-M | Stepwise model of intellectual/procedural move | — |
| **worked_judgement** | OBL-M | Exemplar quality contrast (weak vs strong reasoning) | Slogan contrast only ([GAP-14](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **guided_inquiry** | OBL-M | Productive uncertainty / trade-off tension prompts | — |
| **guided_reasoning** | OBL-M | Partial completion with hint scaffolding | Pre-filled scores without learner justification ([GAP-12](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **guided_practice** | OBL-M | Partial attempt with fading support | Merged with independent ([GAP-06](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **independent_performance** | OBL-M + OBL-T | Full learner attempt without model answer path | `sample_output` as copy source ([GAP-09](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **evaluative_judgement** | OBL-M + OBL-T | Defended recommendation / comparative judgement | Template-only memo ([GAP-10](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **verification** | OBL-M | Quality audit + repair path | Checklist-only tick ([GAP-08](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **revision** | OBL-M or OBL-T | Rework after audit failure | — |
| **reflection** | OBL-C → `self_explanation_prompt` + OBL-T | Learner-generated metacognitive response | Designer `consolidation_summary` ([GAP-11](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **transfer** | OBL-M + OBL-T | Personal-context reapplication with criteria | Single optional sentence ([GAP-16](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **prediction** | OBL-M + OBL-T | Anticipation before evidence | — |
| **observation** | OBL-M | Evidence confrontation / inspect-before-teach | — |
| **transition** | OBL-C or OBL-T | Bridge to next episode | — |

**Note:** Material **type** (`worked_example`, `classification_table`, etc.) is chosen by GAM from `pedagogical_spec` — not specified in plan or obligation type name.

---

## Task 3 — Preservation audit (T1–T5)

| Family | Mapping survives? | Risk | Prevention |
|--------|:-----------------:|:----:|------------|
| **T1** Worked → Guided → Independent | **Yes** — three OBL-M entries, indices *n, n+1, n+2* | **Medium** | P3: forbid merge; anti-collapse rule AC-01 ([Task 4](#task-4--anti-collapse-analysis)) |
| **T2** Perspective → Criteria → Judgement | **Yes** — three distinct function obligations; exposition may sit between perspective and construction | **Medium** | AC-04, AC-05; criteria_construction not satisfied by exposition-only |
| **T3** Predict → Evidence → Revision | **Yes** — three beats → three obligations | **Low** | Absent in EV-38M; mapping adds obligations plan-first |
| **T4** Judgement → Transfer → Reflection | **Yes** — separate obligations; reflection via OBL-C/T not consolidation | **Medium** | AC-03, AC-06 |
| **T5** Perform → Verify → Reflect | **Yes** — independent_performance → verification → reflection chain | **Medium** | AC-02, AC-03; verification depth P5 |

**Overall:** Mapping **can** preserve all families **if** P1–P10 enforced at population. Risk is **behavioural collapse during generation**, not plan expressibility.

---

## Task 4 — Anti-collapse analysis

| ID | Failure mode | Consequence | Prevention rule |
|----|--------------|-------------|-----------------|
| **AC-01** | `worked_thinking` + `guided_practice` + `independent_performance` → **one** `classification_table` | T1 / GAP-01 destroyed | **One beat → ≥1 obligation;** fade triple **must** be ≥3 OBL-M rows ([38Q-3 A2](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **AC-02** | `verification` → checklist with generic repair | GAP-08 G4 | P5: spec must include rubric dimensions + conditional repair |
| **AC-03** | `reflection` → `consolidation_summary` designer prose | GAP-11 G4 | P6: reflection OBL-C/T only; forbid consolidation for reflection beat |
| **AC-04** | `perspective_construction` → scenario menu list | GAP-03 G4 | Spec requires learner pause-and-write; menu is input data not perspective beat |
| **AC-05** | `criteria_construction` → criteria exposition prose | GAP-04 G1 | Separate obligations; construction beat requires learner weighting action |
| **AC-06** | `evaluative_judgement` → memo template + word band | GAP-10 G4 | Spec requires defended comparison; template is scaffold not substitute |
| **AC-07** | `independent_performance` → `sample_output` | GAP-09 G4 | Anti-spoiler: sample only for non-performance beats or keyed verify |
| **AC-08** | All beats → parallel bundle + generic `learner_task` | GAP-13 G5 | P2, P8, P9: ordered obligations; task assembled from beats |
| **AC-09** | Cognition fields substitute for missing OBL-M | G3/G5 | P1: fields annotate; do not replace material obligations for teaching beats |
| **AC-10** | `guided_reasoning` → pre-filled decision table | GAP-12 G4 | Spec requires learner-supplied scores/justifications |

---

## Task 5 — DLA shape assessment

Evidence: `EV-38M-AFTER-dla-learning-activities.json`; [38M-4 A3 sequencing](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-4-a3-analyse-sequencing-fidelity.md); [38N-2 render ordering](../../2026-06-05-sprint-38n-page-fidelity-hardening/observations/38N-2-render-ordering-hardening.md).

| Question | Assessment | Evidence |
|----------|------------|----------|
| **Can DLA preserve order?** | **Yes, with contract** | `required_materials[]` is ordered array; A3 `materials_order` extends order to page layer — order is **supported** when population + compose enforce it; **not guaranteed today** without plan gate |
| **Can DLA preserve beat identity?** | **Partial today** | `purpose` field sometimes aligns (`worked thinking`, `verification`) but **no canonical `instructional_function`** per row; beat identity needs **limited extension** (function tag on obligation) |
| **Can DLA avoid parallel collapse?** | **No by default** | Current generation treats materials as **coverage set**; collapse is **population behaviour** — prevented by P9 plan-before-populate, not DLA shape alone |
| **Can DLA support all A1–A4 plans?** | **Yes** | Cognition fields cover orientation/activation/reflection; `required_materials[]` scales to 12–15 entries; no new activity object required |

### Structural judgement

DLA **can host** ordered function-derived obligations **without redesigning the activity object**. Viability requires:

1. **Population contract** (plan → obligations) — not prompt-only  
2. **Minimal metadata**: `instructional_function` per `required_materials[]` entry (or equivalent purpose enum aligned to 38Q-2)  
3. **Page-order propagation** — generalise `materials_order` beyond A3-only ([38M-4](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-4-a3-analyse-sequencing-fidelity.md))

This is **limited extension** (Outcome B) at **obligation metadata + population gate** — not DLA activity redesign.

---

## Task 6 — Archetype mapping proof (structural)

Notation: `→ OBL-M(function)` / `→ OBL-C(field)` / `→ OBL-T(segment)`

### A1 — Understand (12 beats) — **Strong**

| # | Plan beat | DLA mapping |
|---|-----------|-------------|
| 1 | orientation | → OBL-C(`activity_preamble`) |
| 2 | framing | → OBL-C(`reasoning_orientation`) |
| 3 | activation | → OBL-C(`prior_knowledge_activation`) |
| 4 | explanation | → OBL-M(explanation) |
| 5 | example | → OBL-M(example) |
| 6 | non_example | → OBL-M(non_example) |
| 7 | misconception_confrontation | → OBL-M(misconception_confrontation) |
| 8 | guided_practice | → OBL-M(guided_practice) |
| 9 | independent_performance | → OBL-M(independent_performance) + OBL-T |
| 10 | verification | → OBL-M(verification) |
| 11 | reflection | → OBL-C(`self_explanation_prompt`) + OBL-T |
| 12 | transition | → OBL-T |

**vs EV-38M A1:** 4 materials, missing beats 6–8, M3 sample_output violates AC-07. **Mapping exposes gaps; plan→obligation fixes.**

**OBL-M count:** 8 (ordered). T5 subchain at indices 9→10→11.

---

### A2 — Apply (12 beats) — **Strong**

| # | Plan beat | DLA mapping |
|---|-----------|-------------|
| 1–3 | orientation, framing, activation | OBL-C (as A1) |
| 4 | criteria_exposition | → OBL-M(criteria_exposition) |
| 5 | worked_thinking | → OBL-M(worked_thinking) |
| 6 | guided_practice | → OBL-M(guided_practice) |
| 7 | independent_performance | → OBL-M(independent_performance) + OBL-T |
| 8 | verification | → OBL-M(verification) |
| 9 | revision | → OBL-M(revision) or OBL-T |
| 10–12 | reflection, transfer, transition | OBL-C / OBL-M / OBL-T |

**T1:** indices 5→6→7 — **three OBL-M** (vs EV-38M single M7 table).

**vs EV-38M A2:** M5–M8 only; T1 collapsed. **Mapping Strong; current output Failed.**

---

### A3 — Analyse (13 beats) — **Strong**

| # | Plan beat | DLA mapping |
|---|-----------|-------------|
| 1–3 | orientation, framing, activation | OBL-C |
| 4 | criteria_exposition | → OBL-M(criteria_exposition) |
| 5 | explanation | → OBL-M(explanation) |
| 6 | worked_thinking | → OBL-M(worked_thinking) |
| 7 | guided_inquiry | → OBL-M(guided_inquiry) |
| 8 | guided_practice | → OBL-M(guided_practice) |
| 9 | independent_performance | → OBL-M(independent_performance) + OBL-T |
| 10–13 | verification, reflection, transfer, transition | OBL-M / OBL-C / OBL-T |

**T1:** indices 6→8→9 (worked → guided_practice → independent). **Embedded comparison** in specs for beats 4, 8, 9.

**vs EV-38M A3:** 4 materials; inquiry beat missing. **Mapping Strong.**

---

### A4 — Evaluate (15 beats) — **Strong**

| # | Plan beat | DLA mapping |
|---|-----------|-------------|
| 1–3 | orientation, framing, activation | OBL-C |
| 4 | perspective_construction | → OBL-M(perspective_construction) + OBL-T |
| 5 | criteria_exposition | → OBL-M(criteria_exposition) |
| 6 | criteria_construction | → OBL-M(criteria_construction) + OBL-T |
| 7 | worked_judgement | → OBL-M(worked_judgement) |
| 8 | guided_inquiry | → OBL-M(guided_inquiry) |
| 9 | guided_reasoning | → OBL-M(guided_reasoning) |
| 10 | independent_performance | → OBL-M(independent_performance) + OBL-T |
| 11 | evaluative_judgement | → OBL-M(evaluative_judgement) + OBL-T |
| 12 | verification | → OBL-M(verification) |
| 13 | reflection | → OBL-C + OBL-T |
| 14 | transfer | → OBL-M(transfer) + OBL-T |
| 15 | transition | → OBL-T |

**T2:** indices 4→6→11 (perspective → criteria_construction → evaluative_judgement; exposition at 5).  
**T4:** indices 11→14→13 — **order in plan** is … judgement → verification → reflection → transfer; T4 subchain is judgement→transfer→reflection. Plan order places verification/reflection before transfer in 38R-2 — **T4 subsequence** is `evaluative_judgement`(11) → `transfer`(14) → `reflection`(13) — **not contiguous** in full plan.

**Audit:** 38R-2 A4 plan order: … evaluative_judgement → verification → reflection → transfer. T4 requires judgement → transfer → reflection. **Mapping note:** T4 is **non-contiguous subsequence** in full A4 plan (reflection before transfer). Teaching intent preserved in 38I (reflect then transfer per mock-up). **T4 mapping survives** as ordered beats 11→14→13 if subsequence extraction allowed — or plan order should be … judgement → transfer → reflection for strict adjacency. **38I-4 mock-up:** Reflection before Transfer. **38R-2 plan matches 38I** — T4 family validated in 38R-1 as non-adjacent OK. **Mapping: Strong** with subsequence semantics.

**vs EV-38M A4:** 8 materials parallel; perspective/criteria construction collapsed. **Mapping Strong; current Failed.**

---

### Archetype summary

| Archetype | Mapping fit | Notes |
|-----------|:-------------:|-------|
| A1 | **Strong** | 8 OBL-M + cognition; fixes 4-material bundle |
| A2 | **Strong** | T1 triple explicit |
| A3 | **Strong** | Inquiry + T1 |
| A4 | **Strong** | 11 OBL-M; T2/T4 via subchains |

---

## Task 7 — Mapping verdict

### 1. Can V1 be mapped into DLA without losing choreography?

**Yes — with population contract and limited obligation metadata.**

Ordered plan beats map 1:1 to ordered obligations. T1–T5 survive when AC-01–AC-10 enforced. Choreography is lost **only if** population collapses obligations — not inherent to DLA array shape.

### 2. Does DLA remain a viable downstream realisation layer?

**Yes.** Activity row + ordered `required_materials[]` + cognition fields suffice. GAM/Page path unchanged ([38Q-5 M-1, M-2](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)).

### 3. Which 38Q gap classes are addressed by the mapping?

| Class | Addressed by mapping? | How |
|-------|:---------------------:|-----|
| **G3** Missing transitions | **Yes** | Separate obligations per beat; T-chains not merged (P3) |
| **G5** Episode-structure gap | **Yes** | P2, P8, P9 — ordered plan authority |
| **G4** Artefact substitution | **Partial** | Anti-collapse rules; full fix needs GAM realisation discipline |
| **G1** Missing function | **Yes** | Plan adds beats → obligations (e.g. perspective, non_example) |
| **G2** Weak realisation | **Partial** | Mapping specifies depth; GAM quality separate |

### 4. Which risks remain?

| Risk | Level | Owner phase |
|------|:-----:|-------------|
| Population collapses beats despite contract | **High** | Implementation / 38R-4 proof |
| `instructional_function` tag not enforced | **Medium** | Limited DLA extension |
| Page render order drift (alias keys) | **Medium** | Existing 38N/38P; generalise `materials_order` |
| GAM defaults to checklist/table | **Medium** | Realisation prompts + AC rules |
| Inference content for A4 criteria/perspectives | **Medium** | [38Q-5 M-11](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| Session-level fade | **Low** (out of scope) | Session plan |

### 5. Is additional Episode Plan complexity required?

**No.** V1 remains frozen. Complexity belongs in **obligation metadata + population gate**, not plan schema.

---

## Formal mapping verdict

| Outcome | Selected | Rationale |
|---------|:--------:|-----------|
| **A. Yes — V1 maps cleanly; DLA viable** | Partial | Plan mapping clean; DLA needs **obligation function tag** (design contract) |
| **B. Mostly — DLA requires limited extension** | **✓ Primary** | `instructional_function` per obligation + plan-before-populate; no activity redesign |
| **C. No — deeper architectural issues** | | Not supported — DLA array + cognition sufficient |

**Answer:**

> **Can a minimal Episode Plan drive DLA generation without recreating the parallel-material architecture that produced G3 and G5?**

**Yes — provided** population follows P1–P10 and AC-01–AC-10. The Episode Plan must be **authoritative**; DLA becomes **ordered obligation output**, not primary planner. **Limited DLA extension** (function tag on obligations) recommended for beat identity — not a V1 plan change.

**V1 schema: frozen.**

---

## Task 8 — Inputs to 38R-4

## Inputs to proof design

### Preserved mapping rules

- Principles **P1–P10**
- Anti-collapse **AC-01–AC-10**
- Obligation classes **OBL-M / OBL-C / OBL-T**
- A1–A4 structural maps (Task 6)

### Identified risks (proof must exercise)

| ID | Risk | Proof intent |
|----|------|--------------|
| R-01 | T1 triple collapse | Assert ≥3 obligations for worked/guided/independent |
| R-02 | Verification checklist-only | Rubric spec present in obligation |
| R-03 | Reflection → consolidation | No consolidation material for reflection beat |
| R-04 | Perspective → menu only | Pause-and-write spec present |
| R-05 | Order drift DLA → Page | `materials_order` matches plan indices |
| R-06 | `fullOk` regression | EV-38P-AFTER baseline unchanged on preservation |

### Evidence targets (38R-4)

| Target | Metric |
|--------|--------|
| **G3** | T1–T5 subchain obligation count ≥ minimum |
| **G5** | Obligation count = beat count (± cognition-only beats) |
| **G4** | AC rule violations = 0 on generated DLA |
| **Transition integrity** | Score from [38Q-3](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) methodology |
| **fullOk** | `proofOk` + `roleOk` on replay through 38M–38P path |

### Regression targets

| Baseline | Constraint |
|----------|------------|
| **EV-38P-AFTER** | `fullOk: true` must not regress ([38Q-5 M-1](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)) |
| **58/58 suite** | [38Q-5 M-9](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) |
| **38M–38P machinery** | No reopen ([38Q-5 M-2](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)) |

### Proof artefacts (proposed — 38R-4 to detail)

1. Paper walkthrough: A2 plan → obligation list → mock DLA row  
2. Transition integrity checklist on mapped inflation A1–A4  
3. AC violation detector (design-level, not code)  
4. Before/after: EV-38M obligation count vs plan-mapped obligation count  

---

## Sprint SC contribution

| SC | Status after 38R-3 |
|----|-------------------|
| **SC-4** | **PASS** — plan-to-DLA mapping at design level |
| **SC-5** | **On track** — fidelity preservation strategy documented (P10, regression targets) |

---

## Hold conditions

- No code; no production schema changes in 38R-3  
- V1 plan frozen  
- DLA activity object not redesigned  
- 38M–38P not reopened  

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38R-3 |
| Status | **COMPLETE** |
| Mapping verdict | **Mostly (B)** — V1 maps cleanly; limited DLA obligation metadata required |
| V1 schema | **Frozen** |
| Next | **38R-4** — Proof and validation design |
