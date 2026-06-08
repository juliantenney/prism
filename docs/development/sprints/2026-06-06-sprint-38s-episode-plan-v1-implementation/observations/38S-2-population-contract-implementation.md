# 38S-2 — Population contract implementation

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Implementation phase — population contract module + structural validation  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38S-2  
**Inputs:** [38R-3 mapping](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md) · [38R-2 A1–A4 plans](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md) · [38S-1 integration](38S-1-episode-plan-v1-integration.md) · [38Q-5 M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)  
**Implementation:** `lib/episode-plan-population-contract.js` · `tests/episode-plan-population-contract.test.js`  
**Successor:** [38S-3 DLA obligation tagging](38S-3-dla-obligation-tagging.md)

---

## Executive framing

**Frozen plan (V1 — unchanged):**

```yaml
episode_plan:
  archetype: <archetype>
  beats:
    - function: <FunctionEnum>
```

**Rule:** Beat order is pedagogically authoritative.

**Primary question:**

> How do we guarantee that every instructional beat survives population into DLA?

**Answer (38S-2):** A **deterministic population contract** converts plan beats → traceable obligation scaffold **before** LLM content fill. Structural survival is enforced by:

1. **Plan-before-populate gate** (M-13 / PF-11)  
2. **1:1 beat → obligation mapping** with `instructional_function` + `plan_beat_index`  
3. **AC-01–AC-10** post-population detection  
4. **T1–T5 chain protection** on populated activity rows  

**Scope boundary:** This phase implements the contract and structural scaffold. **Proof runs (38S-4) not executed.** Full pipeline integration (DLA prompt, inflation harness) is **38S-3+**.

---

## Task 1 — Population Contract

## Population Contract

**Version:** `38S-2` (`CONTRACT_VERSION` in `lib/episode-plan-population-contract.js`)

**Transform:**

```text
Episode Plan V1  →  Obligation Set (OBL-M + OBL-C + OBL-T)
```

**Population entry points:**

| Function | Role |
|----------|------|
| `assertPlanBeforePopulateGate(episodePlan)` | M-13 gate — reject population without valid plan |
| `buildObligationScaffoldFromPlan(episodePlan)` | Deterministic beat → obligation scaffold |
| `applyPopulationScaffoldToActivity(activity, episodePlan)` | Merge scaffold onto activity row |
| `validatePopulationContract(episodePlan, activity)` | Composite P1–P10 + AC + T-chain check |

### Principles (P1–P10)

| ID | Requirement | Enforcement mechanism |
|----|-------------|----------------------|
| **P1** | Every beat survives | `buildObligationScaffoldFromPlan` emits ≥1 obligation per beat; `metricBeatSurvival` (M-02) ≥ 95% |
| **P2** | Beat order survives | OBL-M rows carry `plan_beat_index`; `materials_order` derived from plan order; M-03 |
| **P3** | Transition-critical chains survive | `validateTransitionChainProtection` for T1–T5 |
| **P4** | Materials realise beats | OBL-M carries `specification` (pedagogical intent); `type` unset at population — GAM chooses |
| **P5** | Verification remains verification | `verification` spec requires rubric + repair; AC-02 on checklist-only realisation |
| **P6** | Reflection remains learner reflection | `reflection` → OBL-C (`self_explanation_prompt`) + OBL-T; AC-03 forbids `consolidation_summary` |
| **P7** | Anti-substitution enforced | `anti_substitution[]` on each obligation; AC-01–AC-10 detectors |
| **P8** | `learner_task` derived from beats | `_learner_task_segments[]` assembled in beat order → `learner_task` |
| **P9** | Plan remains planning authority | Gate blocks population without plan; orphan materials flagged (AC-08) |
| **P10** | Fidelity path unchanged | Contract extends activity metadata only; GAM → Page compose untouched |

### Obligation classes

| Class | DLA surface | Population behaviour |
|-------|-------------|---------------------|
| **OBL-M** | `required_materials[]` | One row per material-class beat; tagged with `instructional_function`, `plan_beat_index` |
| **OBL-C** | Cognition fields | `activity_preamble`, `reasoning_orientation`, `prior_knowledge_activation`, `self_explanation_prompt` |
| **OBL-T** | `learner_task` segment | Ordered segments in `_learner_task_segments[]`; assembled into `learner_task` |

---

## Task 2 — Beat → obligation mapping

Implemented in `FUNCTION_SPECS` (`lib/episode-plan-population-contract.js`). Focus families (user-requested):

| Function | Obligation type | Required population behaviour |
|----------|-----------------|------------------------------|
| **worked_thinking** | OBL-M | Stepwise model obligation; distinct from guided/independent; anti-merge (AC-01) |
| **guided_practice** | OBL-M | Partial attempt with fading support; must not merge with worked or independent |
| **independent_performance** | OBL-M + OBL-T | Full learner attempt; no sample_output copy path (AC-07) |
| **verification** | OBL-M | Quality audit spec with rubric dimensions + conditional repair; not checklist-only (AC-02) |
| **reflection** | OBL-C + OBL-T | Learner-generated metacognitive response; not designer consolidation (AC-03) |
| **prediction** | OBL-M + OBL-T | Anticipation before evidence confrontation |
| **observation** | OBL-M | Evidence confrontation; inspect-before-teach |
| **revision** | OBL-M + OBL-T | Rework after audit failure |
| **perspective_construction** | OBL-M + OBL-T | Learner constructs viewpoints; pause-and-write required; not scenario menu only (AC-04) |
| **criteria_construction** | OBL-M + OBL-T | Learner weights/prioritises criteria; not exposition-only (AC-05) |
| **evaluative_judgement** | OBL-M + OBL-T | Defended recommendation/comparison; not template-only memo (AC-06) |
| **transfer** | OBL-M + OBL-T | Personal-context reapplication linked to criteria |

Full FunctionEnum table (all 24 functions) is in `FUNCTION_SPECS` — aligned with [38R-3 Task 2](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md).

**Design rule:** Obligations carry **pedagogical spec**, not material type. GAM selects `worked_example`, `classification_table`, etc. from spec at realisation.

---

## Task 3 — Obligation Identity Contract

## Obligation Identity Contract

A reviewer must trace **Episode Plan beat → DLA obligation** without reading prompts.

### Where is `instructional_function` stored?

| Surface | Field | Example |
|---------|-------|---------|
| OBL-M | `required_materials[].instructional_function` | `"worked_thinking"` |
| OBL-C | `activity._plan_<field>.instructional_function` | `_plan_activity_preamble.instructional_function: "orientation"` |
| OBL-T | `_learner_task_segments[].instructional_function` | `"independent_performance"` |

Legacy `purpose` retained for backward compatibility but **not authoritative** — `instructional_function` is canonical.

### How is beat order represented?

| Mechanism | Purpose |
|-----------|---------|
| `required_materials[].plan_beat_index` | Index-aligned link to `episode_plan.beats[i]` |
| `materials_order[]` | Ordered material_id list mirroring plan material beats |
| `_learner_task_segments[].plan_beat_index` | Task segment order anchor |
| `_population_trace[]` | Per-beat summary: `{ beat_index, instructional_function, surfaces[] }` |

**Order rule:** OBL-M `plan_beat_index` values must be non-decreasing in `required_materials[]` array order (M-03).

### How is traceability maintained?

| Artefact | Role |
|----------|------|
| `episode_plan_ref` | `{ archetype, beat_count, population_contract_version }` on activity |
| `buildBeatTraceMatrix(episodePlan, activity)` | Reviewer table: beat → matched obligations |
| `_population_trace[]` | Machine-readable beat → surface map |

**Trace without prompts:** Inspect `buildBeatTraceMatrix` output or activity JSON fields above. Every beat row shows `traceable: true/false` and matched obligation surfaces.

---

## Task 4 — Transition-critical chain protection

| Chain | Functions | Protection mechanism |
|-------|-----------|---------------------|
| **T1** | worked_thinking → guided_practice → independent_performance | Plan subsequence check; ≥1 distinct obligation per function (OBL-M/C/T); AC-01 if <3 distinct when all three in plan |
| **T2** | perspective_construction → criteria_construction → evaluative_judgement | Subsequence check; AC-04/AC-05 on substitution; exposition between perspective and construction allowed |
| **T3** | prediction → observation → revision | Subsequence check; three distinct obligations when subchain present |
| **T4** | evaluative_judgement → transfer → reflection | All three present as distinct obligations; judgement plan index precedes both transfer and reflection (38I A4 order: … judgement → verification → reflection → transfer) |
| **T5** | independent_performance → verification → reflection | Subsequence check; verification depth P5; reflection OBL-C not consolidation (AC-03) |

**Implementation:** `validateTransitionChainProtection(episodePlan, activity)` — returns per-chain `{ applicable, pass, mechanism, merged }`.

**Goal:** Silent collapse (e.g. T1 triple → one table) surfaces as `merged: true` and AC-01 violation.

---

## Task 5 — Anti-collapse enforcement

| Rule | Detection | Enforcement |
|------|-----------|-------------|
| **AC-01** | Plan has worked+guided+independent; populated activity has <3 distinct tagged obligations for those functions | `detectAcViolations`; blocks `validatePopulationContract` |
| **AC-02** | `verification` material with `type: checklist` and spec lacking rubric/repair/dimension keywords | AC-02 violation |
| **AC-03** | `reflection` beat with `consolidation_summary` material, or missing `self_explanation_prompt` + reflection task segment | AC-03 violation |
| **AC-04** | `perspective_construction` as `type: scenario` without pause/write/construct in spec | AC-04 violation |
| **AC-05** | `criteria_construction` spec without weight/priorit/learner action keywords | AC-05 violation |
| **AC-06** | `evaluative_judgement` as template without defend/compar/recommend in spec | AC-06 violation |
| **AC-07** | `independent_performance` with `type: sample_output` | AC-07 violation |
| **AC-08** | All materials lack `plan_beat_index` and no `episode_plan_ref` | AC-08 parallel bundle signal |
| **AC-09** | Teaching beat (OBL-M class) has zero material obligation; cognition-only substitute | AC-09 violation |
| **AC-10** | `guided_reasoning` classification_table with pre-fill language in spec | AC-10 violation |

**Enforcement approach:**

```text
Population pipeline:
  1. assertPlanBeforePopulateGate(plan)     → hard stop (PF-11)
  2. buildObligationScaffoldFromPlan(plan)  → structural obligations
  3. [LLM fills spec bodies — 38S-3+]
  4. validatePopulationContract(plan, activity) → M-02, M-03, M-05 + T-chains
```

Structural scaffold from step 2 alone passes validation for A1–A4 reference plans (proof in unit tests).

---

## Task 6 — Population examples (A1–A4 structural)

Notation: `→ OBL-M(fn)` / `→ OBL-C(field)` / `→ OBL-T`

### A1 — Understand — **Strong**

**Plan:** 12 beats ([38R-2](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-2-archetype-fit-test.md))

**Obligation structure (structural population):**

| # | Beat | Obligations |
|---|------|-------------|
| 1 | orientation | → OBL-C(`activity_preamble`) |
| 2 | framing | → OBL-C(`reasoning_orientation`) + OBL-T |
| 3 | activation | → OBL-C(`prior_knowledge_activation`) |
| 4–7 | explanation … misconception | → OBL-M ×4 |
| 8 | guided_practice | → OBL-M |
| 9 | independent_performance | → OBL-M + OBL-T |
| 10 | verification | → OBL-M |
| 11 | reflection | → OBL-C(`self_explanation_prompt`) + OBL-T |
| 12 | transition | → OBL-T |

**OBL-M count:** 7 · **M-02:** 100% · **T5:** Pass · **vs EV-38M:** Failed (4 materials, collapsed) → contract **Strong**

---

### A2 — Apply — **Strong**

**Obligation structure:**

| # | Beat | Obligations |
|---|------|-------------|
| 1–3 | orientation, framing, activation | OBL-C ×3 |
| 4 | criteria_exposition | → OBL-M |
| 5–7 | worked_thinking, guided_practice, independent_performance | → OBL-M ×3 (**T1 triple**) |
| 8 | verification | → OBL-M |
| 9 | revision | → OBL-M + OBL-T |
| 10 | reflection | → OBL-C + OBL-T |
| 11 | transfer | → OBL-M + OBL-T |
| 12 | transition | → OBL-T |

**OBL-M count:** 8 · **T1:** Pass · **T5:** Pass · **vs EV-38M:** Failed (single M7 table) → contract **Strong**

---

### A3 — Analyse — **Strong**

**Obligation structure:**

| # | Beat | Obligations |
|---|------|-------------|
| 1–3 | orientation, framing, activation | OBL-C ×3 |
| 4–9 | criteria_exposition … independent_performance | → OBL-M ×6 + OBL-T on independent |
| 10–13 | verification, reflection, transfer, transition | OBL-M / OBL-C / OBL-M / OBL-T |

**OBL-M count:** 8 · **T1:** Pass (indices 5→7→8) · **vs EV-38M:** Failed (4 materials, missing inquiry) → contract **Strong**

---

### A4 — Evaluate — **Strong**

**Obligation structure:**

| # | Beat | Obligations |
|---|------|-------------|
| 1–3 | orientation, framing, activation | OBL-C ×3 |
| 4 | perspective_construction | → OBL-M + OBL-T |
| 5 | criteria_exposition | → OBL-M |
| 6 | criteria_construction | → OBL-M + OBL-T |
| 7–10 | worked_judgement … independent_performance | → OBL-M ×4 + OBL-T |
| 11 | evaluative_judgement | → OBL-M + OBL-T |
| 12 | verification | → OBL-M |
| 13 | reflection | → OBL-C + OBL-T |
| 14 | transfer | → OBL-M + OBL-T |
| 15 | transition | → OBL-T |

**OBL-M count:** 10 · **T2:** Pass · **T4:** Pass (judgement precedes reflection and transfer) · **T5:** Pass · **vs EV-38M:** Failed (parallel bundle) → contract **Strong**

### Archetype summary

| Plan | Structural population | vs EV-38M |
|------|:---------------------:|:---------:|
| A1 | **Strong** | Failed |
| A2 | **Strong** | Failed |
| A3 | **Strong** | Failed |
| A4 | **Strong** | Failed |

Validated by `tests/episode-plan-population-contract.test.js` — all `validatePopulationContract` pass on scaffolded activities.

---

## Task 7 — DLA contract update

Required DLA changes to wire contract into production pipeline:

| Change | Impact | Phase |
|--------|:------:|-------|
| Call `assertPlanBeforePopulateGate` before DLA population | **High** | 38S-3 |
| Populate from `buildObligationScaffoldFromPlan` before LLM spec fill | **High** | 38S-3 |
| Persist `instructional_function` on `required_materials[]` | **Medium** | 38S-3 |
| Persist `plan_beat_index` on obligations | **Medium** | 38S-3 |
| Add `episode_plan_ref` + `_population_trace` on activity | **Low** | 38S-3 |
| DLA prompt: population-only — no archetype/sequence planning | **High** | 38S-3 |
| `materials_order[]` from plan (generalise beyond A3) | **Medium** | 38S-3 / existing 38N |
| Post-population `validatePopulationContract` hook | **Medium** | 38S-4 proof harness |
| Cognition field `_plan_*` metadata | **Low** | 38S-3 |
| Remove/supersede 38J internal IFP planning in DLA | **High** | 38S-3 |

**Not required:** Activity object redesign · V1 schema change · GAM/Page changes.

---

## Task 8 — Verification strategy

| Metric | Measurement approach |
|--------|---------------------|
| **M-02 Beat Survival** | `metricBeatSurvival(plan, activity)` — `(beats with ≥1 traceable obligation) / (beat count) × 100`; target ≥ 95% per gate activity; returns `matrix[]` for inspection |
| **M-03 Ordered Obligation Survival** | `metricOrderedObligationSurvival(plan, activity)` — non-decreasing `plan_beat_index` in `required_materials[]`; target 100% |
| **M-05 AC Violations** | `metricAcViolations(plan, activity)` — count of AC-01–AC-10 breaches via `detectAcViolations`; target 0 |

**Composite gate:** `validatePopulationContract(plan, activity).ok === true`

**38S-4 extension:** Run M-02/M-03/M-05 on LLM-populated DLA JSON for A1–A4 + T3 micro-plan against EV-38M baseline ([38R-4](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md)).

---

## Task 9 — Population verdict

| # | Question | Answer |
|---|----------|--------|
| 1 | Can every beat survive population? | **Yes** — deterministic scaffold guarantees ≥1 obligation per beat; M-02 100% on A1–A4 structural population |
| 2 | Can transition-critical chains survive? | **Yes** — T1/T2/T4/T5 pass on applicable A-plans; T3 passes when subchain present; collapse detectable via AC-01 and chain validator |
| 3 | Can DLA remain population-only? | **Yes** — plan owns sequence; DLA fills obligation specs and bodies; no replanning in DLA prompt (38S-3 wiring) |
| 4 | Does V1 remain unchanged? | **Yes** — no plan schema fields added; metadata on DLA obligations only |
| 5 | What risks remain? | LLM may violate AC rules during spec fill (**High** — 38S-4); GAM may substitute artefact types (**Medium**); pipeline not yet wired (**Medium** — 38S-3); page order drift without `materials_order` generalisation (**Low** — 38N exists) |

---

## Task 10 — Inputs to 38S-3

## Obligation Tagging Inputs

### Final population contract

- Module: `lib/episode-plan-population-contract.js`  
- Version: `38S-2`  
- Entry: plan → `buildObligationScaffoldFromPlan` → `applyPopulationScaffoldToActivity`  
- Gate: `assertPlanBeforePopulateGate` (M-13 / PF-11)  
- Validate: `validatePopulationContract`

### Obligation identity model

- `required_materials[].instructional_function`  
- `required_materials[].plan_beat_index`  
- `activity._plan_<cognition_field>` metadata  
- `activity._learner_task_segments[]`  
- `activity._population_trace[]`  
- `activity.episode_plan_ref`

### Chain protection rules

- T1–T5 definitions in `TRANSITION_CHAINS`  
- Validator: `validateTransitionChainProtection`  
- T4: judgement precedes transfer and reflection (non-adjacent OK per 38R-2 A4)

### Enforcement approach

- Pre-populate gate (hard stop)  
- Structural scaffold (deterministic)  
- Post-populate AC detection (`detectAcViolations`)  
- Metrics M-02, M-03, M-05

### Remaining risks

| Risk | Mitigation owner |
|------|------------------|
| LLM collapses obligations during spec fill | 38S-3 prompt + 38S-4 proof |
| GAM defaults to checklist/table | GAM realisation discipline + AC-02 |
| Harness not calling contract | 38S-3 integration in `ev-38l-inflation-pipeline-capture-once.mjs` |
| Decorative plan (PF-11) | Plan step persists artefact before DLA |

---

## Success condition

> "How does Prism guarantee that Episode Plan beats survive into DLA obligations without collapsing back into worksheet-oriented structures?"

**Answer:**

1. **Planning authority** sits in Episode Plan V1 — DLA cannot invent beats (P9, M-13 gate).  
2. **Deterministic scaffold** maps every beat to tagged obligations before content generation (P1, P2).  
3. **Identity contract** (`instructional_function` + `plan_beat_index`) enables traceability without prompts.  
4. **Anti-collapse rules** (AC-01–AC-10) and **T-chain protection** detect merge/substitution after population.  
5. **Verification metrics** (M-02, M-03, M-05) provide computable proof gate for 38S-4.

---

## Implementation artefacts

| Artefact | Path |
|----------|------|
| Population contract module | `lib/episode-plan-population-contract.js` |
| Unit tests (A1–A4 + AC) | `tests/episode-plan-population-contract.test.js` |

**Test result:** 12/12 pass (structural population, gate, AC detection, M-03 drift).

---

## Success contribution

| SC | Target | Status |
|----|--------|:------:|
| **SC-2** | Plan-before-populate gate implemented | **PASS** |
| **SC-4** | P1–P10 enforced | **PASS** (structural + validators) |

**SC-3** (`instructional_function` tagging in production DLA) → **38S-3**.

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38S-2 |
| Status | **COMPLETE** |
| Next | [38S-3 DLA obligation tagging](38S-3-dla-obligation-tagging.md) |
| Proof runs | **Not executed** — deferred to 38S-4 |
