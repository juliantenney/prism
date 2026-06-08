# 38Q-3 — Gap analysis: current output vs teaching-episode taxonomy

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Diagnostic gap analysis — docs only; no architecture proposals  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38Q-3  
**Inputs:** [38Q-1](38Q-1-what-good-looks-like-baseline.md) · [38Q-2](38Q-2-episode-taxonomy-catalogue.md) · [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38P-6A](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md) · `EV-38M-AFTER-dla-learning-activities.json` · `EV-38P-AFTER-gam.json`  
**Successor:** 38Q-4 Abstraction design options

---

## Scope

Measure the gap between:

| A | B |
|---|---|
| **38I / historical target-state teaching episodes** | **EV-38P-AFTER generation output** (post-38M merge, post-38P render; `fullOk: true`) |

Using the [38Q-2 function-first taxonomy](38Q-2-episode-taxonomy-catalogue.md).

**Diagnostic only.** No fixes, IFP, redesign, or 38Q-4 options.

### Quality scale (Task 1)

| Code | Meaning |
|------|---------|
| **S** | Strong — function performs intended learner-state change |
| **P** | Partial — present but incomplete or weak pedagogy |
| **W** | Weak — nominal presence; artefact substitutes for move |
| **M** | Missing — not generated or not observable to learner |

### Gap class (Task 6)

| Class | Meaning |
|-------|---------|
| **G1** | Missing function |
| **G2** | Weak realisation |
| **G3** | Missing transition (functions exist but unconnected) |
| **G4** | Artefact substitution |
| **G5** | Episode-structure gap (materials exist; learner-state progression absent) |

### Evidence convention

- **Expected (38I):** [38I-4 mock-ups](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) + [38I-2 R/C/O](38Q-2-episode-taxonomy-catalogue.md)  
- **Present in EV-38P:** `EV-38M-AFTER` DLA + `EV-38P-AFTER` GAM + [38P-6A UX findings](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)  
- **A3 note:** 38I target A3 = typology/causes Analyse; EV-38P A3 = household impact Analyse — function audit uses **38I Analyse archetype** expectations; content mismatch noted separately

---

## Task 1 — Function coverage audit

### 1.1 A1 — Understand (CPI vs GDP deflator)

**38I planned object:** Concept-discrimination sequence ([38Q-1 §A](38Q-1-what-good-looks-like-baseline.md))

| Function | Expected (38I) | Present in EV-38P | Quality | Gap | Notes |
|----------|:--------------:|:-----------------:|:-------:|:---:|-------|
| Orientation | R | ✓ `activity_preamble` | P | G2 | Generic intro; lacks session-arc “why now” ([38I-4 A1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |
| Framing | C | ✓ implicit in M1 | P | G2 | Bounded problem not explicit |
| Activation | C | ✓ `prior_knowledge_activation` | P | G3 | Field on DLA row; not integrated as episode beat |
| Observation | O | ✗ | M | G1 | No inspect-before-teach move |
| Prediction | O | ✗ | M | G1 | [38Q-1 §C](38Q-1-what-good-looks-like-baseline.md): 28 D9 absent |
| Explanation | R | ✓ M1 text (1,459 chars) | **S** | — | Substantive connected prose ([GAM A1 M1](../../2026-06-05-sprint-38p-instructional-role-fidelity/artefacts/EV-38P-AFTER-gam.json)) |
| Example | R | ✓ M2 worked | **S** | — | Stepwise CPI/GDP contrast |
| Non-example | C→R | ✗ | M | G1 | No boundary table ([38I-4 A1 non-example](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |
| Misconception confrontation | R† | ✗ | M | G1 | KM-relevant CPI/GDP confusion not dramatised |
| Cognitive conflict | O | ✗ | M | G1 | |
| Worked thinking | O | ✓ M2 | **S** | — | Overlaps Example |
| Guided practice | C | ✗ | M | G1 | No classification set with hints |
| Guided reasoning | C | ✗ | M | G1 | |
| Independent performance | R | ✓ `learner_task` “own words” | P | G4 | **M3 sample_output** (1,120 chars) invites copy vs discrimination ([38P-6A A1](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |
| Verification | R | ✓ M4 checklist | P | G4 | Tick-box self-check; repair generic — not discrimination audit |
| Reflection | C | ✓ `self_explanation_prompt` | P | G3 | Activity-row field; not structured episode beat |
| Revision | O | ✗ | M | G1 | |
| Transfer | O | ✗ | M | G1 | |
| Transition | C | ✗ | M | G1 | |
| Scaffold fade | C | ✗ | M | G5 | Read→write flat arc |

† Misconception **R** when KM lists confusable pair ([38I-2 §6.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)).

**A1 summary:** Strong **Explanation / Example / Worked thinking**; missing **discrimination moves** (Non-example, Misconception, Guided classification). Closest to teaching among four activities ([38P-6A](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): “not table-first” — still **read-model-verify**, not discrimination episode.

---

### 1.2 A2 — Apply (CPI calculation)

**38I planned object:** Procedure-practice sequence with fade ([38Q-2 §3.2](38Q-2-episode-taxonomy-catalogue.md))

| Function | Expected (38I) | Present in EV-38P | Quality | Gap | Notes |
|----------|:--------------:|:-----------------:|:-------:|:---:|-------|
| Orientation | R | ✓ preamble | P | G2 | |
| Framing | R | ✓ implicit in worked | P | G2 | Measurement situation not explicit section |
| Activation | O | ✓ `prior_knowledge_activation` | P | G3 | |
| Criteria exposition | R | ✓ embedded in M5 steps | P | G2 | Rules in worked body; no standalone “procedure rules + errors” beat |
| Worked thinking | R | ✓ M5 (1,310 chars) | **S** | — | Full weighted calculation walkthrough |
| Guided practice | R | ✗ | M | G1 | No single-row guided attempt ([38I-4 A2 guided row](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |
| Guided reasoning | C | ✗ | M | G1 | |
| Independent performance | R | ✓ M7 table | P | G4 | **Full table only** — learner fills all rows; no fade |
| Verification | R | ✓ M8 checklist | P | G4 | Procedural ticks; keyed answers not in learner-facing audit |
| Revision | C | W | W | G2 | Checklist says “revisit” — no structured compare-to-model path |
| Reflection | C | ✓ `self_explanation_prompt` | P | G3 | |
| Transfer | C | ✗ | M | G1 | [38I-4 A2 transfer calc](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) absent |
| Scaffold fade | R | ✗ | M | **G5** | **Defining Apply arc missing** ([38Q-1 §G.7](38Q-1-what-good-looks-like-baseline.md)) |
| Transition | C | ✗ | M | G1 | |

**A2 summary:** **Worked thinking S**; **fade arc M/G5**. Table-centric UX ([38P-6A A2](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): renders as “Worksheet”).

---

### 1.3 A3 — Analyse (household impact — EV-38P; vs typology in 38I target)

**38I planned object (archetype):** Analytic-reasoning sequence with inquiry ([38Q-2 §3.3](38Q-2-episode-taxonomy-catalogue.md))

| Function | Expected (38I) | Present in EV-38P | Quality | Gap | Notes |
|----------|:--------------:|:-----------------:|:-------:|:---:|-------|
| Orientation | R | ✓ preamble | P | G2 | |
| Framing | R | ✓ M11 scenarios + task | P | G2 | Household case — not typology analytical question (content gap) |
| Activation | C | ✓ `prior_knowledge_activation` | P | G3 | |
| Criteria exposition | R | ✓ M10 lens headers; M9 | P | G2 | Lenses named; not taught as comparison dimensions first |
| Explanation | C | W in M9 only | W | G2 | No three-type teaching (38I A3 target) |
| Worked thinking | R | ✓ M9 (1,313 chars) | **S** | — | Distribution/adaptation/time walkthrough |
| Guided inquiry | C | ✗ | M | G1 | No “coexistence / observability” prompts |
| Comparison | R | ✓ M10 structure | P | G4 | **Empty grid** — completion not pre-modelled contrast |
| Guided practice | R | ✓ M10 + hints in M9 | P | G4 | Table = primary learner action |
| Guided reasoning | C | ✗ | M | G1 | |
| Independent performance | R | ✓ task “justify ratings” | P | G2 | Justification in table cells only |
| Verification | R | ✓ M12 checklist | P | G4 | Completion/accuracy focus |
| Reflection | R | ✓ `self_explanation_prompt` | P | G3 | Not **R**-quality metacognitive beat |
| Transfer | C | ✗ | M | G1 | |
| Revision | C | ✗ | M | G1 | |
| Scaffold fade | R | ✗ | M | G5 | Worked pass + parallel empty table |
| Cognitive conflict | C | ✗ | M | G1 | |

**A3 summary:** **Worked analytic pass S**; inquiry, fade, reflection depth **M**. Worksheet-dominated ([38P-6A A3](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)).

---

### 1.4 A4 — Evaluate (household strategy capstone)

**38I planned object:** Judgement sequence ([38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md))

| Function | Expected (38I) | Present in EV-38P | Quality | Gap | Notes |
|----------|:--------------:|:-----------------:|:-------:|:---:|-------|
| Orientation | R | ✓ preamble | P | G2 | No Evaluate-vs-Analyse distinction ([38I-4 A4 Step 0](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)) |
| Framing | R | ✓ M13 scenario | P | G2 | Single household + strategy menu |
| Activation | C | ✓ `prior_knowledge_activation` | P | G3 | |
| Perspective construction | R | ✗ | M | **G1** | [38P-6A §158](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): narrative perspectives **never generated** |
| Criteria exposition | R | ✓ M14 (745 chars) | P | G2 | Three criteria delivered; 38I expects four + visibility throughout |
| Criteria construction | C | ✗ | M | G1 | No weighting exercise ([38I-4 Step 2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)) |
| Worked judgement | C | ✓ M15 (1,082 chars) | P | G2 | Weak/strong present; **Strategy B only** — not full A–E economist ranking ([38Q-1 §G.4](38Q-1-what-good-looks-like-baseline.md)) |
| Cognitive conflict | C | ✗ | M | G1 | No competing perspectives dramatised |
| Guided inquiry | C | ✗ | M | G1 | No trade-off tension prompts |
| Guided reasoning | C | ✓ M16 partial rows | P | G4 | Pre-filled Medium/High ratings — learner ranks into scaffolded grid |
| Comparative evaluation | R | ✓ M16 A–E | P | G2 | Ranking without prior perspective/criteria construction |
| Guided practice | C | ✓ M16 | P | G4 | Table-first |
| Independent performance | R | ✓ M17 template | P | G4 | Memo scaffold + word band — form without prior fade |
| Evaluative judgement | R | ✓ task + template | P | **G5** | Modules exist; **integrated defended recommendation arc absent** |
| Verification | R | ✓ M18 checklist | P | G4 | Structural memo checks — not rubric quality audit with Partial/No repair gate |
| Reflection | R | ✗ learner reflection | M | **G4** | **M20 consolidation_summary** = designer read-only prose ([38Q-1 §G.11](38Q-1-what-good-looks-like-baseline.md)) |
| Transfer | R | ✓ M19 (752 chars) | P | G2 | Single prompt ≥80 words — no criteria reapplication chain |
| Synthesis | C | ✓ M20 | W | G4 | Designer summary substitutes learner reflection |
| Scaffold fade | R | ✗ | M | **G5** | M15–M17 parallel — no guided→independent fade |
| Transition | O | ✗ | M | G1 | |

**A4 summary:** **Highest material-type coverage** (8 materials, 7,716 chars — [38P-6A A4](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) yet **largest episode-structure gap** vs [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md). G4/G5 dominate.

---

## Task 2 — Transition integrity audit

Canonical chains from [38Q-2 §3](38Q-2-episode-taxonomy-catalogue.md) and [38I-4 traces](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md).

### 2.1 A1 — Understand

| Transition | Status | Evidence |
|------------|--------|----------|
| Orient → Activate | **Partial** | Preamble + `prior_knowledge_activation` on same activity row — not sequenced beats |
| Activate → Observe | **Missing** | No observation-before-teach |
| Explain → Example | **Strong** | M1 → M2 natural read order |
| Example → Non-example | **Missing** | No contrast beat |
| Non-example → Misconception confrontation | **Missing** | Both absent |
| Misconception → Guided classification | **Missing** | |
| Guided → Independent performance | **Missing** | Sample output parallels independent task |
| Independent → Verification | **Partial** | Task then checklist — verification checks ticks not discrimination |
| Verification → Reflection | **Weak** | `self_explanation_prompt` not gated on verification |
| Episode → Episode (Transition) | **Missing** | No bridge to A2 |

### 2.2 A2 — Apply

| Transition | Status | Evidence |
|------------|--------|----------|
| Criteria exposition → Worked thinking | **Partial** | Rules inside M5, not explicit pre-model |
| **Worked thinking → Guided practice** | **Missing** | No guided row ([38I-4 A2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |
| **Guided practice → Independent performance** | **Missing** | **G5** — M7 is single full table |
| Independent → Verification | **Partial** | Checklist after table completion |
| Verification → Revision | **Weak** | Generic “revisit steps” in M8 |
| Independent → Transfer | **Missing** | No new-number transfer |
| **Scaffold fade (overall)** | **Missing** | [38Q-1 §B](38Q-1-what-good-looks-like-baseline.md) |

### 2.3 A3 — Analyse

| Transition | Status | Evidence |
|------------|--------|----------|
| Frame analytical question → Criteria exposition | **Partial** | Lenses in table headers; question implicit |
| Criteria → Worked thinking | **Partial** | M9 before M10 in DLA order; render ordering risk pre-38P ([38P-6A A3](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |
| Worked thinking → Guided inquiry | **Missing** | |
| Guided inquiry → Guided practice | **Missing** | |
| **Guided practice → Independent performance** | **Weak** | Same table serves both — no fade |
| Compare → Explain (analytic) | **Partial** | M9 explains in worked pass; learner table is classify not explain |
| Independent → Verification | **Partial** | Checklist |
| Verification → Reflection | **Weak** | |
| Judgement → Transfer | **N/A** | |

### 2.4 A4 — Evaluate

| Transition | Status | Evidence |
|------------|--------|----------|
| Orient → Frame decision | **Partial** | Preamble + M13 |
| **Perspective → Criteria** | **Missing** | **G1/G3** — M13 menu jumps to M14 criteria ([38P-6A §158](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |
| Criteria → Criteria construction | **Missing** | Exposition only |
| **Criteria → Worked judgement** | **Partial** | M14 → M15 sequential; weak integration |
| Worked judgement → Guided inquiry | **Missing** | |
| **Worked judgement → Guided reasoning** | **Partial** | M15 → M16; no inquiry between |
| **Guided reasoning → Independent performance** | **Missing** | **G5** — parallel template M17 |
| Independent → Evaluative judgement | **Weak** | Template structures memo; learner-state “defended choice” not enforced |
| Independent → Verification | **Partial** | M18 after template |
| **Verification → Reflection** | **Missing** | M20 designer summary — not learner reflection |
| **Judgement → Transfer** | **Partial** | M19 follows materials; no gate on memo quality |
| Transfer → Reflection | **Missing** | |
| **Predict → Evidence → Revision** | **Missing** | Cross-archetype — absent all activities |

### 2.5 Cross-archetype priority transitions ([38Q-2 §2](38Q-2-episode-taxonomy-catalogue.md))

| Priority transition | A1 | A2 | A3 | A4 | Overall |
|---------------------|:--:|:--:|:--:|:--:|:-------:|
| Predict → Evidence → Revision | M | M | M | M | **Missing** |
| Worked → Guided → Independent | P | M | W | M | **Missing/Weak** |
| Perspective → Criteria → Judgement | — | — | W | M | **Missing** |
| Judgement → Transfer | — | — | — | P | **Partial** |
| Transfer → Reflection | M | M | M | M | **Missing** |

---

## Task 3 — Artefact substitution analysis

| Intended function | Actual implementation (EV-38P) | Consequence | Gap |
|-------------------|--------------------------------|-------------|:---:|
| **Non-example / discrimination** | M3 `sample_output` model paragraph | Copy source replaces classify-and-contrast performance (A1) | G4 |
| **Guided practice (fade)** | M7 single `classification_table` (A2) | Full worksheet replaces guided-row → independent-table arc | G4, G5 |
| **Guided practice (fade)** | M10 empty `analysis_table` (A3) | Grid completion replaces guided partial → full analysis | G4, G5 |
| **Perspective construction** | M13 strategy menu A–E (A4) | Neutral option list replaces two-household/lens map | G4 |
| **Criteria construction** | M14 delivered criteria prose (A4) | Read-only rubric replaces learner weighting | G4 |
| **Worked judgement (integrated)** | M15 weak/strong bullets (A4) | Slogan contrast + generic Strategy B — not full ranking narrative | G2 |
| **Guided reasoning** | M16 pre-filled rating cells (A4) | Partially completed grid replaces learner-constructed scores + justifications | G4 |
| **Independent evaluative judgement** | M17 memo `template` + word band (A4) | Form scaffold replaces defended recommendation episode | G4 |
| **Verification (quality audit)** | M4/M8/M12/M18 checklists (all) | Tick completion replaces rubric Partial/No revision gate | G4 |
| **Reflection (learner-generated)** | M20 `consolidation_summary` (A4) | Designer third-person summary replaces Step 7 questions | G4 |
| **Transfer chain** | M19 single prompt (A4) | One-shot paragraph replaces criteria-linked personal application + verify | G2, G5 |
| **Misconception confrontation** | (none A1) | Absent despite KM affordance | G1 |
| **Parallel material bundle** | M13–M20 listed without episode choreography (A4) | Reorderable modules — [38Q-1 reorder test](38Q-1-what-good-looks-like-baseline.md) | G5 |

---

## Task 4 — Overuse / underuse analysis

### 4.1 Overused patterns (ranked by evidence)

| Rank | Pattern | Evidence | Archetypes |
|:----:|---------|----------|:----------:|
| 1 | **Completion-oriented `learner_task`** | All four: “Study… Complete… Verify…” ([EV-38M DLA](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)) | A1–A4 |
| 2 | **Checklist verification** | M4, M8, M12, M18 — sole verification surface | A1–A4 |
| 3 | **Practice tables** | M7 `classification_table`, M10 `analysis_table`, M16 `decision_table` | A2–A4 |
| 4 | **Parallel `required_materials` bundles** | 4–8 materials per activity, no sequence metadata | A1–A4 |
| 5 | **Sample output / model answer** | M3, M6 — copy risk ([38C-1 §3.2 anti-pattern](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) | A1, A2 |
| 6 | **Template scaffolds** | M17 memo template with word band | A4 |
| 7 | **Designer consolidation prose** | M20 read-only summary | A4 |
| 8 | **“Worksheet” render framing** | [38P-6A §160](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md) A2/A3 | A2, A3 |
| 9 | **Pre-filled table cells** | M16 Medium/High ratings pre-populated | A4 |
| 10 | **Cognition fields as annotations** | `scaffold_hint_sequence`, `self_explanation_prompt` on DLA rows — not episode beats | A1–A4 |

### 4.2 Underused patterns (ranked by evidence)

| Rank | Pattern | Expected (38I) | EV-38P status | Archetypes |
|:----:|---------|----------------|---------------|:----------:|
| 1 | **Scaffold fade** | R Apply/Analyse/Evaluate | Absent all | A2–A4 |
| 2 | **Perspective construction** | R Evaluate | Missing | A4 |
| 3 | **Misconception confrontation** | R† Understand | Missing | A1 |
| 4 | **Non-example** | C/R Understand | Missing | A1 |
| 5 | **Guided inquiry** | C Analyse/Evaluate | Missing | A3, A4 |
| 6 | **Prediction** | O/C historical | Missing | All |
| 7 | **Revision cycle** | C historical (28 D9) | Missing | All |
| 8 | **Criteria construction** | C Evaluate | Missing | A4 |
| 9 | **Learner reflection beats** | R Analyse/Evaluate | Field-only or designer M20 | A3, A4 |
| 10 | **Cognitive conflict** | C Evaluate | Missing | A4 |
| 11 | **Transfer with verification** | R Evaluate | Single prompt only | A4 |
| 12 | **Session Transition bridges** | C all | Missing | A1–A4 |
| 13 | **Pause-and-write / observation** | C/R exemplars | Missing | A1, A4 |
| 14 | **Quality rubric verification** | R Evaluate | Checklist only | A4 |
| 15 | **Integrated worked judgement** | C Evaluate | Partial weak/strong only | A4 |

---

## Task 5 — Archetype-level scoring

| Archetype | Function coverage (% relevant functions S or P) | Transition integrity | Overall architecture | Justification |
|-----------|:-------------------------------------------------:|:--------------------:|:--------------------:|---------------|
| **A1 Understand** | ~45% (5/11 R/C functions ≥P) | **Weak** — 1 Strong, 4 Partial, rest Missing | **Mixed** (lean worksheet on verify) | Strong exposition; missing discrimination chain ([38P-6A A1](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |
| **A2 Apply** | ~40% | **Missing** — fade absent | **Worksheet** | Table-first Apply; worked model present but **Worked→Guided→Independent Missing** |
| **A3 Analyse** | ~45% | **Weak** | **Worksheet** | Analytic pass S; table dominates; inquiry Missing |
| **A4 Evaluate** | ~55% (most materials, weakest episode) | **Missing** — perspective/judgement chain broken | **Mixed** (richest modules, worksheet sequencing) | 8/8 material **types**; **0/5** priority Evaluate transitions Strong |

**Architecture classification key:**

| Label | Criterion |
|-------|-----------|
| **Teaching** | ≥60% R functions ≥P **and** ≥50% canonical transitions Partial+ **and** fade or equivalent present |
| **Mixed** | Substantive teaching (S) in some functions **but** G5 episode-structure gap |
| **Worksheet** | Primary learner action = complete artefact; fade/inquiry/perspective Missing |

**None** of four activities meet **Teaching** threshold on transition integrity.

---

## Task 6 — Gap classification register

Major gaps aggregated (diagnostic IDs for 38Q-4 reference).

| ID | Gap | Class | Archetypes | Evidence pointer |
|----|-----|:-----:|:----------:|------------------|
| GAP-01 | Scaffold fade absent | **G5** | A2–A4 | [38Q-1 §G.7](38Q-1-what-good-looks-like-baseline.md); §2.2 A2 |
| GAP-02 | Perspective → Criteria → Judgement chain | **G3**, **G1** | A4 | [38P-6A §158](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md) |
| GAP-03 | Perspective construction missing | **G1** | A4 | M13 menu only |
| GAP-04 | Criteria construction missing | **G1** | A4 | M14 exposition only |
| GAP-05 | Non-example + misconception (A1) | **G1** | A1 | [38I-4 A1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) |
| GAP-06 | Guided practice row (Apply) | **G1**, **G5** | A2 | Single M7 table |
| GAP-07 | Guided inquiry | **G1** | A3, A4 | No tension prompts |
| GAP-08 | Checklist substitutes quality verification | **G4** | All | M4/M8/M12/M18 |
| GAP-09 | Sample output substitutes independent performance | **G4** | A1 | M3 |
| GAP-10 | Template substitutes evaluative judgement | **G4**, **G5** | A4 | M17 |
| GAP-11 | Consolidation substitutes reflection | **G4** | A4 | M20 vs [38I-4 Step 7](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |
| GAP-12 | Table substitutes guided reasoning | **G4** | A2–A4 | [38P-6A](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md) |
| GAP-13 | Parallel materials without episode plan | **G5** | All | [38Q-1 native-object](38Q-1-what-good-looks-like-baseline.md) |
| GAP-14 | Worked judgement weak vs 38I depth | **G2** | A4 | M15 Strategy B focus |
| GAP-15 | Predict → Revise cycle | **G1**, **G3** | All | [38Q-1 §C](38Q-1-what-good-looks-like-baseline.md) |
| GAP-16 | Transfer without chain | **G2**, **G5** | A4 | M19 |
| GAP-17 | Session transitions | **G1** | All | No inter-activity bridges |
| GAP-18 | Integrated narrative / pause-and-write | **G1**, **G5** | A4 | [38P-6A G4](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md) |

### Gap class totals (major gaps)

| Class | Count | Share |
|-------|------:|------:|
| **G1** Missing function | 7 | 28% |
| **G2** Weak realisation | 3 | 12% |
| **G3** Missing transition | 3 | 12% |
| **G4** Artefact substitution | 6 | 24% |
| **G5** Episode-structure gap | 6 | 24% |

*Many gaps carry dual classification (e.g. G4+G5). Counts index primary diagnostic entries.*

---

## Task 7 — End-of-phase synthesis

### 7.1 Functions that survive reasonably well today

| Function | Typical quality | Where | Evidence |
|----------|:---------------:|-------|----------|
| **Explanation** | **S** | A1 | M1 connected prose |
| **Worked thinking** | **S** | A1, A2, A3 | M2, M5, M9 substantive bodies |
| **Example / modelling (procedure)** | **S**–**P** | A1, A2 | Worked examples with steps |
| **Criteria exposition** | **P** | A3, A4 | Lens headers; M14 criteria list |
| **Orientation (thin)** | **P** | All | `activity_preamble` on every DLA row |
| **Worked judgement (partial)** | **P** | A4 | M15 weak/strong contrast — [38P-6A §152](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md) |
| **Transfer (minimal)** | **P** | A4 | M19 ≥80 words |
| **Comparative evaluation (scaffolded)** | **P** | A4 | M16 ranking grid |

**Pattern:** Functions that **map to deliverable prose or modular bodies** survive post-fidelity. **Sequence-native and learner-state functions** do not.

### 7.2 Functions that consistently degrade

| Function | Usual status | Cross-archetype? |
|----------|:------------:|:----------------:|
| Scaffold fade | M / G5 | **Yes** A2–A4 |
| Misconception confrontation | M | **Yes** (expected A1 R†) |
| Non-example | M | A1 |
| Prediction / Revision | M | **Yes** |
| Guided inquiry | M | A3, A4 |
| Perspective construction | M | A4 (also partial A3 via lenses) |
| Criteria construction | M | A4 |
| Learner reflection (episode beat) | M / G4 | A3, A4 |
| Cognitive conflict | M | A4 |
| Session Transition | M | **Yes** |
| Quality rubric verification | P→G4 | **Yes** |

### 7.3 Transitions most frequently absent

| Rank | Transition | Status across workbook |
|:----:|------------|------------------------|
| 1 | **Worked → Guided → Independent** | Missing A2, A4; Weak A3 |
| 2 | **Perspective → Criteria → Judgement** | Missing A4 |
| 3 | **Predict → Evidence → Revision** | Missing all |
| 4 | **Verification → Reflection (learner)** | Missing / Weak all |
| 5 | **Transfer → Reflection** | Missing all |
| 6 | **Guided inquiry between model and performance** | Missing A3, A4 |
| 7 | **Episode → Episode** | Missing all |

### 7.4 Primary bottleneck (diagnostic)

| Candidate bottleneck | Verdict | Evidence |
|---------------------|---------|----------|
| Missing functions (G1) | **Significant** | Perspective, misconception, fade, inquiry absent |
| Weak functions (G2) | **Moderate** | Worked judgement, criteria exposition, transfer shallow |
| Missing transitions (G3) | **Dominant** | Priority transitions Missing/Weak all archetypes |
| Episode-structure gaps (G5) | **Dominant** | Parallel materials; no learner-state progression ([38Q-1](38Q-1-what-good-looks-like-baseline.md)) |
| Artefact substitution (G4) | **Significant** | Checklist, table, template, consolidation replace moves |

**Primary bottleneck (evidence-led):** **Missing transitions (G3) and episode-structure gaps (G5)** — functions often exist as **material nodes** but are **not connected** into teaching sequences. Aligns with 38Q-1 provisional **H2 High** (extension/planning layer hypothesis) — stated here as **diagnosis only**, not recommendation.

Secondary: **G4 artefact substitution** — worksheet patterns stand in for reasoning moves.

**Not primary:** Pure **G1** absence of all teaching — **Explanation** and **Worked thinking** are **Strong** on multiple activities despite `fullOk`.

### 7.5 Dominant gap classes

```text
G3 + G5  (transition + episode structure)  ~ primary
G4       (artefact substitution)            ~ secondary
G1       (missing function)                 ~ tertiary (specific moves)
G2       (weak realisation)                 ~ least dominant alone
```

---

## Success condition — precise gap statement

### Generated today (with `fullOk: true`)

| Category | What survives |
|----------|---------------|
| **Expository teaching** | Connected explanation prose; stepwise worked examples (A1–A3) |
| **Modular Evaluate materials** | Scenario menu, criteria text, weak/strong modelling note, guided ranking grid, memo template, checklist, transfer prompt, consolidation (A4) |
| **Analytic scaffolding** | Worked analytic pass with lens vocabulary (A3) |
| **Thin orientation** | Activity preambles; cognition fields on DLA rows |
| **Procedural verification** | Checklists with generic repair hints (all activities) |
| **Body fidelity** | All 20/20 GAM materials at 100% char ratio post-merge ([38P-6A](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |

### Systematically lost or never generated

| Category | What is lost |
|----------|--------------|
| **Discrimination arc** | Non-example, misconception confrontation, guided classification (A1) |
| **Apply fade** | Guided partial attempt before full independent table (A2) |
| **Analytic inquiry** | Productive uncertainty prompts before performance (A3) |
| **Evaluate episode choreography** | Perspective construction, criteria weighting, inquiry tensions, integrated economist walkthrough, learner reflection (A4) |
| **Cross-cutting** | Prediction, revision cycles, scaffold fade, session transitions, quality rubric gates |
| **Transition integrity** | Worked→Guided→Independent; Perspective→Criteria→Judgement; Verify→Reflect |
| **Learner-state progression** | Ordered reasoning moves — replaced by **parallel artefact completion** |

### One-sentence summary

**EV-38P-AFTER faithfully preserves modular teaching content (especially exposition and worked examples) but systematically fails to generate instructional sequences and transitions that change learner state — producing worksheet-completion architectures even when individual functions appear as strong material bodies.**

---

## Hypothesis alignment (diagnostic only — not 38Q-4)

| Hypothesis | 38Q-3 evidence |
|------------|----------------|
| **H1** Low | Strong S ratings for Explanation/Worked thinking — not pure implementation failure |
| **H2** High | G3/G5 dominance — functions exist; **sequencing/planning** absent |
| **H3** Medium | Parallel material-bundle shape consistent across all archetypes ([38Q-1](38Q-1-what-good-looks-like-baseline.md)) |

---

## Relationship to 38Q-4

This document provides the **evidence base** for abstraction option evaluation:

- Function × quality matrices per archetype  
- Transition integrity scores  
- GAP-01–GAP-18 register with G1–G5 classification  
- Over/underuse ranked lists  

38Q-4 may ask which gaps are closable by implementation improvement vs require different planning objects — **without presupposing answers here**.

---

## Hold conditions

- No architecture options, IFP, or redesign in this phase.  
- EV-38P-AFTER remains canonical comparator; fidelity floor unchanged.  
- 38I target states remain authority for “Expected” column.

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38Q-3 |
| Status | **COMPLETE** |
| Next | **38Q-4** — abstraction design options |
