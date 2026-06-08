# 38R-4 — Proof and validation design

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Design-proof phase — proof requirements only; no code; no production schema; no implementation design  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38R-4  
**Inputs:** [38R-1 V1](38R-1-minimum-viable-episode-plan.md) · [38R-2 A1–A4 plans](38R-2-archetype-fit-test.md) · [38R-3 mapping](38R-3-plan-to-dla-mapping.md) · [38Q-3 gaps](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md) · [38Q-5 M-1–M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) · `EV-38M-AFTER-dla-learning-activities.json` · [38P-6 EV-38P-AFTER](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6-proof-run.md)  
**Successor:** [38R-5 Implementation recommendation](38R-5-implementation-recommendation.md)

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

**38R-3 verdict:** **Mostly (B)** — V1 maps to DLA; remaining risks are **population behaviour**, not schema.

**Primary question (this phase):**

> What evidence would be sufficient to prove that Episode Plan V1 reduces G3/G5 while preserving `fullOk`?

**Design stance:** Define **inspectable structural proof** — not subjective teaching-quality scoring. A future implementation sprint runs the proof; 38R-4 defines what must pass.

**Comparison baselines:**

| Baseline | Role in proof |
|----------|---------------|
| **EV-38M-AFTER** (`dla-learning-activities.json`) | **Before** — parallel bundles; G3/G5 dominant at `fullOk` |
| **38R-2 frozen plans** | **Authority** — beat sequences for A1–A4 |
| **EV-38P-AFTER** | **Regression floor** — `fullOk: true`, 58/58, RF-1..RF-8 |

---

## Proof architecture

```text
Episode Plan V1 (frozen)
  → populate DLA obligations (implementation — out of scope here)
  → generated DLA JSON
  → structural validators (V1–V6, metrics M-01–M-08)
  → existing 38M–38P replay harness
  → fidelity validators (proofOk, roleOk, fullOk)
  → verdict vs Claims A–E
```

**Two proof lanes (both required at gate):**

1. **Educational lane** — structural metrics on plan-driven DLA vs EV-38M baseline  
2. **Fidelity lane** — replay through unchanged 38M–38P compose/render path

---

## Task 1 — Proof claims matrix

| Claim | Evidence required | Success threshold |
|-------|-------------------|-------------------|
| **A — Episode Plan reduces G3 (missing transitions)** | (1) T1–T5 structural audit on generated DLA; (2) `instructional_function` tags on obligations; (3) subsequence order check per [38R-1 order rule](38R-1-minimum-viable-episode-plan.md); (4) before/after vs EV-38M transition register ([38Q-3 §2](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) | **Transition coverage ≥ 80%** (M-01): ≥4/5 T-families **Pass** on applicable archetypes; **zero** T-family **Fail** on A2 (T1) or A4 (T2, T4); EV-38M baseline = 0/4 archetypes at Partial+ on priority transitions |
| **B — Episode Plan reduces G5 (episode-structure gaps)** | (1) Beat-to-obligation trace matrix per activity; (2) OBL-M inflation vs EV-38M material counts; (3) reorder-resistance check (adjacent pair order locked to plan indices); (4) `learner_task` segment alignment (P8) | **Beat survival ≥ 95%** (M-02); **ordered obligation survival = 100%** (M-03) on OBL-M chain; OBL-M count ≥ **plan OBL-M target** from [38R-3 Task 6](38R-3-plan-to-dla-mapping.md) (A1:8, A2:7, A3:8, A4:11); EV-38M baseline: 4/4/4/8 materials with GAP-13 |
| **C — Episode Plan reduces G4 (artefact substitution)** | (1) AC-01–AC-10 violation scan on generated DLA; (2) forbidden-type mapping per function ([38R-3 Task 2](38R-3-plan-to-dla-mapping.md) anti-substitution column); (3) reflection/verification depth field checks | **AC violation count = 0** (M-05) on gate activities; no reflection beat realised as `consolidation_summary`; no verification beat as checklist-only without rubric spec |
| **D — Episode Plan preserves fullOk** | (1) Full EV-38P proof replay on generated pipeline output; (2) `proofOk`, `roleOk`, `fullOk` from harness; (3) RF-1..RF-8; (4) 58/58 regression suite | **`fullOk: true`** on plan-driven replay; **58/58 PASS**; `proofOk` and `roleOk` both **true**; no RF gate regression vs [38P-6](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6-proof-run.md) |
| **E — Episode Plan does not require prompt accretion** | (1) Plan object size audit (fields only: archetype + beats); (2) prompt diff review — no new narrative choreography blocks substituting for plan; (3) population gate documented as structural (plan → obligations) per [38Q-5 M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md) | Plan remains **≤2 top-level keys** + ordered `function` list; prompt delta for episode choreography **≤10%** of total prompt size OR choreography enforced by **plan gate** not prompt prose; SC-7 satisfied |

### Claim dependency

```text
D (fidelity) is hard gate — failure blocks all Proceed
A + B are primary educational claims — both required for 38Q validation
C is secondary but blocking at AC violation count > 0 on gate set
E is architectural integrity — failure reopens SC-7 / prompt-accretion risk
```

---

## Task 2 — Validation dimensions

| Dimension | What is measured? | Why? |
|-----------|-------------------|------|
| **V1 — Transition integrity** | Presence and **order** of T1–T5 function subsequences as distinct tagged obligations in generated DLA | G3 is the dominant gap class; transitions are edge-weighted ([38Q-3 §7.3](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)); subsequence semantics from [38R-1](38R-1-minimum-viable-episode-plan.md) |
| **V2 — Episode integrity** | Plan beat count vs traceable obligation count; absence of orphan materials; `learner_task` derived from beats not generic shell | G5 = parallel bundles without learner-state progression ([GAP-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)); P8/P9 enforcement |
| **V3 — Function preservation** | Each plan `function` maps to ≥1 obligation with matching `instructional_function` tag; no function merged or dropped | Beat identity is the plan unit; collapse is the primary 38R-3 risk (R-01) |
| **V4 — Anti-substitution** | AC-01–AC-10 rules: artefact type cannot substitute function intent (checklist≠verification, consolidation≠reflection, etc.) | G4 at 24% of major gaps ([38Q-3 §Task 6](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)); survives only if tested structurally |
| **V5 — Fidelity preservation** | `proofOk`, `roleOk`, `fullOk`, RF-1..RF-8, body–role coherence, 58/58 suite on replay | 38M–38P closed; implementation must not reopen fidelity programme ([38Q-5 M-1, M-2](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)) |
| **V6 — Prompt independence** | Plan object carries choreography; prompts supply inference/realisation only | 38Q-4: prompt enrichment **Weak** on G3/G5; accretion is explicit failure mode (SC-7) |

---

## Task 3 — Transition integrity proof (T1–T5)

**Scoring rule (inherited from 38R-1):** A T-family **Passes** when its function subsequence appears as **distinct, order-preserving, tagged obligations** in generated DLA. Adjacency not required where 38R-2 validated non-contiguous subsequences (T4 in A4).

**Inspection surfaces:** `required_materials[].instructional_function` (or equivalent), cognition field mapping for OBL-C beats, obligation index alignment.

| Family | Applicable gate activities | Required evidence | Failure condition |
|--------|---------------------------|-------------------|-----------------|
| **T1** Worked → Guided → Independent | **A2** (beats 5–7), **A3** (beats 6–9) | ≥**3** separate OBL-M rows tagged `worked_thinking`, `guided_practice`, `independent_performance` in plan order; indices strictly increasing | **PF-01:** Single `classification_table` or one material covers all three (EV-38M A2 M7 pattern); guided merged into independent; worked absent |
| **T2** Perspective → Criteria → Judgement | **A4** (subsequence: `perspective_construction` → `criteria_construction` → `evaluative_judgement`; exposition at beat 5 allowed between perspective and construction) | ≥**3** distinct obligations for the three functions; `criteria_construction` has learner-weighting spec, not exposition-only | **PF-04 variant:** M13 menu-only perspective; M14 exposition-only criteria; M17 template-only judgement (EV-38M A4) |
| **T3** Predict → Evidence → Revision | **T3-MICRO** (synthetic 5-beat plan — no A1–A4 contiguous chain) | ≥**3** obligations tagged `prediction`, `observation` (or `cognitive_conflict`), `revision` in order | Any two merged; prediction absent; revision not reachable after evidence beat |
| **T4** Judgement → Transfer → Reflection | **A4** (subsequence: `evaluative_judgement` → `transfer` → `reflection` — non-contiguous in full plan per [38R-3](38R-3-plan-to-dla-mapping.md)) | Three distinct obligations; reflection via `self_explanation_prompt`/OBL-T, not consolidation | Transfer = one optional sentence only (GAP-16); reflection = designer consolidation prose (GAP-11) |
| **T5** Perform → Verify → Reflect | **A1** (beats 9–11), **A2** (beats 7–10), **A3** (beats 9–11) | `independent_performance` → `verification` → `reflection` as separate obligations; verification has rubric/repair spec | **PF-03:** Checklist-only verification; **PF-04:** Consolidation substitutes reflection; perform merged with verify |

### T3 micro-plan (proof artefact — not V1 change)

No frozen A1–A4 plan contains a contiguous T3 chain. Proof must include this **supplementary** plan:

```yaml
episode_plan:
  archetype: understand
  beats:
    - function: framing
    - function: prediction
    - function: observation
    - function: revision
    - function: reflection
```

**Rationale:** T3 is a chartered transition family ([38R-1 SC-2](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-1-minimum-viable-episode-plan.md)); omission would leave GAP-15 unproven.

---

## Task 4 — G3/G5 reduction metrics

All metrics are **computable from generated DLA JSON** (+ plan YAML for denominators). No human quality rubric required at gate.

| ID | Metric | Definition | Target | Baseline (EV-38M) |
|----|--------|------------|--------|-------------------|
| **M-01** | **Transition coverage %** | `(T-families Pass) / (T-families tested)` × 100. Tested set: T1,T2,T4,T5 on A1–A4 + T3 on micro-plan | **≥ 80%** (minimum 4/5 Pass) | **~0%** — priority transitions Missing/Weak all archetypes ([38Q-3 §Task 5](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **M-02** | **Beat survival %** | `(plan beats with ≥1 traceable obligation) / (plan beat count)` × 100 per activity | **≥ 95%** each gate activity | **~33–53%** — 4/12 (A1), 4/12 (A2), 4/13 (A3), 8/15 (A4) material coverage |
| **M-03** | **Ordered obligation survival %** | `(OBL-M entries where index order matches plan beat order) / (total OBL-M)` × 100 | **100%** | **Not measured** — order not authoritative today (GAP-13) |
| **M-04** | **Episode continuity %** | `(adjacent plan beat pairs with correctly ordered obligation mapping) / (total adjacent pairs − 1)` × 100 | **100%** | Fails reorder test ([38Q-1](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-1-what-good-looks-like-baseline.md)) |
| **M-05** | **AC violation count** | Count of AC-01–AC-10 rule breaches detected on gate DLA set | **0** | **≥6** substitution patterns documented (GAP-08–12, etc.) |
| **M-06** | **OBL-M inflation ratio** | `(generated OBL-M count) / (EV-38M material count)` per activity | **≥ 1.5×** for A2–A4 (structural inflation signal) | A1:1.0, A2:1.0, A3:1.0, A4:1.0 (no inflation) |
| **M-07** | **Orphan material count** | `required_materials` entries with no plan beat `instructional_function` mapping | **0** | **Unknown/untracked** — materials not plan-derived |
| **M-08** | **Priority GAP closure count** | Count of GAP-01, GAP-02, GAP-06, GAP-13 resolved on gate set (binary per gap per activity) | **≥ 4/4** priority gaps closed on applicable activities | **0/4** on GAP-01 (A2–A4), GAP-13 (all) |

### G3/G5 success composite

**G3 reduced** when: M-01 ≥ 80% **and** T1 Pass on A2 **and** T2 Pass on A4.  
**G5 reduced** when: M-02 ≥ 95% **and** M-03 = 100% **and** M-07 = 0 **and** M-08 includes GAP-13 closed on all four archetypes.

---

## Task 5 — Regression framework

**Authority:** [38P-6 EV-38P-AFTER](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6-proof-run.md) · [38Q-5 M-1, M-9](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)

**Replay path (unchanged):**

```text
generated GAM + design-page
  → applyGamMaterialsToComposedPage (38M + 38P supersession)
  → applyA3MaterialsSequencingToComposedPage (38N)
  → buildUtilityStructuredHtmlForTest (38P-4 role-precedence)
  → computeProofDimensionsForTest
```

| Regression area | Must remain true | Evidence source |
|-----------------|------------------|-----------------|
| **Composite fidelity** | `fullOk: true` | `EV-*-run-log.json` → `fullOk` |
| **Body fidelity** | `proofOk: true` | 38M validation + 38L regression |
| **Role fidelity** | `roleOk: true` | 38P validation |
| **RF gates** | RF-1..RF-8 **PASS** | [38P-6 §RF report](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6-proof-run.md) |
| **Automated suite** | **58/58 PASS** | Cumulative 38M+38N+38P tests |
| **proofOk non-regression** | `baselineComparison.proofOkUnchanged: true` when comparing preservation-only changes | 38P-6 pattern |
| **Material body coherence** | RF-7 body–role ratio thresholds on canonical keys | Char ratio ≥ threshold on planned materials |
| **Compose transparency** | `material_role_index` populated; supersession traceable | RF-8 |
| **Page render order** | `materials_order` / role-precedence order matches obligation order where declared | 38N/38P; R-05 |
| **38M–38P machinery** | No reopen of closed sprints | Harness path unchanged; no compose redesign |

**Regression scope note:** Plan-driven generation will produce **new** GAM/DLA content. Regression proves the **existing fidelity machinery** still passes on that content — not that byte-identical output matches EV-38P-AFTER artefacts.

**Preservation control (recommended):** Re-run EV-38M-AFTER through the harness after any pipeline touch to confirm `proofOkUnchanged` — detects accidental fidelity regression in shared code.

---

## Task 6 — Proof failure catalogue

| ID | Failure | Detection method | Severity |
|----|---------|------------------|----------|
| **PF-01** | **Transition collapse** — T-family functions merged into one obligation | T-audit: expected function tags < required count; M-01 Fail on family | **Critical** |
| **PF-02** | **Parallel bundle reappearance** — materials are unordered coverage set; plan order ignored | M-03 < 100%; reorder test passes without pedagogical loss; M-07 > 0 | **Critical** |
| **PF-03** | **Checklist substitution** — `verification` realised as checklist-only without rubric/repair spec | AC-02 trigger; `type: checklist` without `pedagogical_spec` depth fields | **High** |
| **PF-04** | **Reflection degradation** — `reflection` → `consolidation_summary` or read-only designer prose | AC-03 trigger; consolidation material on reflection beat index | **High** |
| **PF-05** | **Order drift** — DLA obligation order ≠ plan beat order; page render order diverges | M-03/M-04 Fail; `materials_order` mismatch vs plan indices | **Critical** |
| **PF-06** | **fullOk regression** — `proofOk` or `roleOk` false on replay | Harness `fullOk: false`; any RF gate Fail | **Blocking** |
| **PF-07** | **Beat drop** — plan beat has zero traceable obligation | M-02 < 95%; beat trace matrix hole | **Critical** |
| **PF-08** | **Perspective/menu substitution** — `perspective_construction` → scenario list only | AC-04 trigger on A4 | **High** |
| **PF-09** | **Criteria exposition substitution** — `criteria_construction` satisfied by read-only rubric prose | AC-05 trigger on A4 | **High** |
| **PF-10** | **Sample-output spoiler** — `independent_performance` paired with `sample_output` as copy source | AC-07 trigger (A1 risk) | **High** |
| **PF-11** | **Prompt accretion** — choreography enforced only by prompt prose; plan unused or decorative | V6 audit: plan not consulted in population; prompt size Δ > threshold; SC-7 Fail | **High** |
| **PF-12** | **Cognition-field substitution** — teaching beats satisfied only by `activity_preamble` etc. without OBL-M | AC-09 trigger; M-02 Fail on teaching beats | **High** |
| **PF-13** | **Learner_task shell** — generic completion task prepended; beats not reflected in task segments | P8 violation; single generic task with parallel bundle | **Medium** |
| **PF-14** | **Suite regression** | Any of 58 tests Fail | **Blocking** |

**Gate rule:** Any **Critical** or **Blocking** PF on gate set → **Hold**. Any **High** PF → **Hold** unless waived with documented remediation in 38R-5 (not automatic).

---

## Task 7 — Minimal implementation proof package

### Question

> What is the smallest experiment capable of validating the architecture?

### Absolute minimum (architecture smoke test)

| Artefact | Purpose |
|----------|---------|
| **A2 plan** → generated DLA | T1 fade — highest-evidence G5 failure in EV-38M ([GAP-01, GAP-06](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-3-dla-gam-gap-analysis.md)) |
| **A4 plan** → generated DLA | T2 + T4 — perspective/judgement chain; richest parallel-bundle failure |
| **T3-MICRO plan** → generated DLA | T3 — not covered by A1–A4 contiguously |
| **EV-38M preservation replay** | Confirm shared harness still `fullOk` after pipeline changes |
| **One full workbook replay** | A2+A4 minimum workbook through GAM → Page → `fullOk` |

**Verdict on absolute minimum:** Proves **core hypothesis** (ordered plan → ordered obligations reduces G3/G5) but **insufficient** for implementation gate — misses A1 discrimination chain (GAP-05) and A3 inquiry beat (GAP-07).

### Recommended gate minimum (implementation sprint exit)

| Artefact | Purpose |
|----------|---------|
| **A1 plan** → DLA → GAM → Page | GAP-05 non_example + misconception; T5; AC-07 sample-output risk |
| **A2 plan** → full pipeline | T1 + revision beat; Apply archetype |
| **A3 plan** → full pipeline | T1 variant + `guided_inquiry`; analyse fade |
| **A4 plan** → full pipeline | T2 + T4; highest G5 surface area |
| **T3-MICRO** → DLA obligation check | T3 family |
| **Full inflation workbook** | All four activities on shared KM/LO fixture |
| **EV-38P-class proof run** | New `EV-38R-AFTER` (or equivalent) with `fullOk`, 58/58, RF-1..RF-8 |
| **Before/after metric sheet** | M-01–M-08 vs EV-38M baseline |

### Proof artefacts (implementation sprint deliverables)

1. `EV-38R-AFTER-dla-learning-activities.json` — plan-populated DLA  
2. `EV-38R-AFTER-run-log.json` — dual-dimension proof report  
3. Beat-to-obligation trace matrix (A1–A4 + T3-MICRO)  
4. AC violation report (expect 0)  
5. M-01–M-08 scorecard vs EV-38M  
6. Prompt diff audit (Claim E)

---

## Task 8 — Implementation gate criteria

## Proceed / hold criteria

### Proceed if (all required)

1. **Claim D:** `fullOk: true`, `proofOk: true`, `roleOk: true` on plan-driven proof run  
2. **Claim A:** M-01 ≥ 80%; T1 **Pass** on A2; T2 **Pass** on A4  
3. **Claim B:** M-02 ≥ 95% on A1–A4; M-03 = 100%; M-07 = 0; GAP-13 closed on all four  
4. **Claim C:** M-05 = 0 (AC violations) on gate set  
5. **Claim E:** Plan remains V1 shape; population uses plan gate ([38Q-5 M-13](../../2026-06-06-sprint-38q-instructional-episode-depth-and-teaching-architecture/observations/38Q-5-recommended-architecture.md)); no prompt-accretion primary mechanism  
6. **Regression:** 58/58 PASS; RF-1..RF-8 PASS; no 38M–38P machinery reopen  
7. **T3-MICRO:** T3 **Pass**  
8. **No Blocking/Critical PF** on gate set  

### Hold if (any sufficient)

1. **PF-06** or **PF-14** — fidelity or suite regression  
2. **PF-01, PF-02, PF-05, PF-07** — choreography collapse  
3. M-01 < 80% OR T1 Fail on A2 OR T2 Fail on A4  
4. M-02 < 95% OR M-03 < 100% on any gate activity  
5. M-05 > 0  
6. Plan schema expanded beyond V1 without new 38R design phase  
7. Population bypasses plan (decorative plan object) — **PF-11**  
8. Implementation requires DLA activity object redesign (contradicts 38R-3)  
9. `fullOk` achieved only by disabling RF gates or shrinking material bodies below 38M thresholds  

### Conditional proceed (38R-5 decision)

- **High** PF with known GAM-only fix (not plan/schema change) — document remediation sprint scope  
- M-01 60–79% with all of T1, T2, T4 Pass — educational gain partial; architecture viable but G3 not fully closed  
- G2 depth gaps remain (worked judgement weak) — acceptable if G3/G5 metrics pass; track as realisation quality not planning failure  

---

## Task 9 — Final proof verdict

### 1. What must be demonstrated before implementation can be considered successful?

| # | Demonstration |
|---|---------------|
| 1 | Frozen A1–A4 (+ T3-MICRO) plans drive **ordered, tagged obligations** — not parallel bundles |
| 2 | T1 and T2 **Pass** on A2 and A4 respectively; M-01 ≥ 80% |
| 3 | Beat survival M-02 ≥ 95%; order survival M-03 = 100% |
| 4 | AC violations M-05 = 0 on gate set |
| 5 | Generated workbook replays through **unchanged** 38M–38P path with **`fullOk: true`** |
| 6 | 58/58 suite and RF-1..RF-8 preserved |
| 7 | Plan remains V1; population is structural gate — not prompt accretion |

### 2. What evidence would falsify the 38Q recommendation?

| Falsifier | Interpretation |
|-----------|----------------|
| Plan-driven DLA **matches** EV-38M obligation shape (same material counts, same collapses) | Episode Plan is **decorative** — H2 path fails |
| T1 still single-table on A2 after plan gate | Population ignores plan authority — revert to worksheet architecture |
| `fullOk` cannot be achieved on plan-inflated obligations without compose redesign | DLA/GAM/Page stack insufficient — deeper than 38R-3 assumed |
| M-05 > 0 persistently after GAM realisation | Function→obligation mapping insufficient; G4 requires GAM discipline beyond plan |
| Prompt size grows >10% with plan present but metrics unchanged | Prompt accretion duplicate — SC-7 failure |

### 3. What evidence would strongly support it?

| Support signal | Interpretation |
|----------------|----------------|
| OBL-M counts approach 38R-3 targets (8/7/8/11) vs EV-38M (4/4/4/8) | Structural G5 inflation — episode integrity restored |
| T1 ≥3 obligations on A2; A4 perspective + criteria_construction + evaluative_judgement separate | G3 priority transitions restored |
| M-05 = 0; reflection and verification pass AC rules | G4 reduced at obligation layer |
| `fullOk: true` on first plan-driven full workbook replay | Fidelity + education compatible — 38Q Option F validated |
| M-08 shows GAP-01, GAP-02, GAP-06, GAP-13 closed | Direct closure of 38Q-3 priority register entries |

### 4. Is V1 sufficiently specified to move toward implementation?

**Yes — for proof execution.**

| Aspect | Status |
|--------|--------|
| Plan schema | **Frozen** — sufficient for A1–A4 + T3-MICRO |
| Mapping contract | **Specified** — P1–P10, AC-01–AC-10, OBL-M/C/T ([38R-3](38R-3-plan-to-dla-mapping.md)) |
| Proof metrics | **Defined** — M-01–M-08 (this phase) |
| Gate criteria | **Objective** — Proceed/Hold above |
| Outstanding spec (implementation layer, not plan) | `instructional_function` tag on obligations; plan-before-populate gate ([38R-3 Mostly B](38R-3-plan-to-dla-mapping.md)) |

**Burden of proof on complexity:** No V1 expansion required before implementation proof. If proof fails, diagnose population/GAM before plan schema.

---

## Formal proof-readiness verdict

| Question | Answer |
|----------|--------|
| What evidence proves Episode Plans improve generation while preserving fidelity? | **Dual-lane proof:** structural metrics M-01–M-08 (educational) + EV-38P-class replay (`fullOk`, 58/58, RF-1..RF-8) (fidelity) |
| Is the proof framework complete? | **Yes** — claims, dimensions, T-audits, metrics, regression floor, PF catalogue, gate criteria defined |
| Can a future sprint execute without further design? | **Yes** — recommended gate package is A1–A4 + T3-MICRO + `EV-38R-AFTER` proof run |
| Does this phase approve implementation? | **No** — proof-readiness only; 38R-5 makes proceed/refine/reject recommendation |

| Outcome | Selected |
|---------|:--------:|
| **Proof framework ready** | **✓** |
| **V1 sufficient for proof** | **✓** |
| **Implementation approved** | **✗** (38R-5) |

**Answer to success condition:**

> **What evidence would prove that Instructional Episode Plans improve episode generation while preserving fidelity?**

**Educational:** M-01 ≥ 80%, M-02 ≥ 95%, M-03 = 100%, M-05 = 0, T1/T2 Pass on A2/A4, GAP-13 closed — measured on plan-driven DLA vs EV-38M baseline.  
**Fidelity:** `fullOk: true` on replay through unchanged 38M–38P harness; 58/58; RF-1..RF-8 — measured on generated workbook artefacts.

---

## Sprint SC contribution

| SC | Status after 38R-4 |
|----|-------------------|
| **SC-5** | **PASS** — fidelity preservation strategy documented (Task 5 regression framework) |
| **SC-6** | **PASS** — G3/G5 reduction proof approach defined (Claims A/B, M-01–M-08, T-audits) |
| **SC-7** | **On track** — Claim E + V6 + PF-11 gate prompt accretion |

---

## Inputs to 38R-5

| Input | Content |
|-------|---------|
| Gate criteria | Proceed/Hold (Task 8) |
| Proof package | Recommended minimum (Task 7) |
| Metrics | M-01–M-08 targets |
| Failure catalogue | PF-01–PF-14 |
| Falsifiers / supporters | Task 9 §2–3 |
| V1 status | Frozen — sufficient |
| Implementation layer spec | `instructional_function` tag + plan-before-populate gate (from 38R-3) |

---

## Hold conditions (unchanged)

- No code in 38R-4  
- No production schema  
- No implementation design  
- V1 plan frozen  
- 38M–38P not reopened  
- This phase does not approve implementation  

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38R-4 |
| Status | **COMPLETE** |
| Proof-readiness verdict | **Ready** — framework sufficient for implementation proof sprint |
| V1 schema | **Frozen** |
| Next | **38R-5** — Implementation recommendation |
