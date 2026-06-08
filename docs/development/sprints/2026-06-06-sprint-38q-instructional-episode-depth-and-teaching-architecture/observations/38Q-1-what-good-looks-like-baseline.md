# 38Q-1 — “What good looks like” baseline review

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Evidence review and synthesis — docs only  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38Q-1  
**Successor:** 38Q-2 Instructional episode taxonomy and pattern catalogue

---

## Executive framing

**The fidelity problem is considered solved.**

Sprints 38M through 38P established and proved:

```text
proofOk: true  +  roleOk: true  =  fullOk: true   (EV-38P-AFTER)
```

Rich instructional materials are **no longer lost** by the preservation pipeline on the merged learner path. Sprint 38-Q begins **after** that closure. **Do not reopen 38M–38P.**

Current outputs are **coherent, complete, structurally valid, and faithfully preserved** — yet remain **worksheet-oriented**. The generation gap is established; **its cause is not yet settled**.

**38Q is an educational abstraction investigation**, not merely a DLA/GAM improvement sprint.

### Primary question (governing)

> What educational abstraction should sit between knowledge representation and instructional materials if the goal is to generate rich teaching episodes rather than worksheet-oriented activities?

### Subsidiary question (not assumed)

> How can DLA and GAM generate richer instructional episodes while preserving the fidelity guarantees already established in 38M–38P?

The subsidiary question applies **only if** investigation supports H1 (implementation deficiency) or H2 (abstraction extension). It is **not** the governing assumption.

The long-term goal is learning experiences closer to **historical “what good looks like” examples** and **[38I-4 episode structures](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)** than to **worksheet-oriented table/checklist packages**.

The objective is **not more content**. The objective is **better instructional architecture** — which may require a different abstraction, not only better prompts.

---

## Educational abstraction challenge

| Principle | Statement |
|-----------|-----------|
| **No default abstraction** | 38Q must **not** assume DLA and GAM are the correct educational abstractions. |
| **Gap ≠ cause** | The generation gap is established; its cause is **not yet settled**. |
| **Three resolution paths** | DLA/GAM may need: **(A)** implementation improvement, **(B)** abstraction extension, or **(C)** abstraction redesign or replacement. |
| **Fidelity frozen** | Any conclusion must respect `fullOk` as a hard constraint on future work. |

---

## Three hypotheses (test, do not presuppose)

| ID | Hypothesis | If true, implies |
|----|------------|------------------|
| **H1 — Implementation deficiency** | Current abstractions are sound; richer outputs require better generation behaviour, prompting, orchestration, or planning | Keep DLA/GAM; improve implementation |
| **H2 — Abstraction extension** | Current abstractions are partially sound but lack first-class structures for instructional episodes, cognitive challenge, scaffolding, reasoning, judgement, transfer, or reflection | Extend DLA/GAM or add a planning/episode layer |
| **H3 — Abstraction misalignment** | Current abstractions are organised around the wrong educational units and naturally produce worksheet-oriented outputs even when fidelity and implementation are correct | Redesign abstraction around instructional episodes |

38Q-1 through 38Q-5 must **test** these hypotheses against 38I exemplars and EV-38P-AFTER output — not presuppose H1.

---

## Blank-sheet thought experiment (in scope)

> **If Prism were designed today from scratch, would we recreate the current DLA and GAM abstractions?**

This counterfactual is **explicitly in scope** for 38Q. It is not rhetorical decoration — 38Q-5 must address it with evidence. 38Q-1 seeds the question against 38I-4 and historical exemplars.

---

## Prompt accretion challenge

| Principle | Statement |
|-----------|-----------|
| **No prompt-length assumption** | Do not assume richer outputs require longer prompts. |
| **Symptom vs solution** | Prompt growth may represent genuine educational complexity, **or** compensation for a weak underlying educational model. |
| **Investigation duty** | 38Q should determine whether prompt complexity is a **symptom** rather than a **solution**. |

38Q-4 will analyse prompt accretion; 38Q-1 notes where current DLA/GAM prompts already compensate for missing episode structures (see [38I-5 IFP hypothesis](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)).

---

## 1. Purpose of 38Q-1

Establish an authoritative **baseline** of excellent self-directed instructional design by synthesising:

1. **38I episode-depth work** — archetypes, target states, implementation implications  
2. **Historical pedagogical journey** — Sprints 28–31 and 38C/38I-1 recovered functions  
3. **38I-4 capstone structures** — especially A4 Evaluate teaching moves  
4. **Post-fidelity current output** — EV-38P-AFTER as “what we generate today”  
5. **38P-6A causal evidence** — why worksheet orientation persists despite `fullOk`  
6. **Abstraction adequacy** — §G matrix and counterfactual generation test (§H)

**38Q-1 output feeds 38Q-2** (taxonomy) and **38Q-3** (gap analysis + H1/H2/H3 evidence). It does not implement changes.

---

## 2. Authoritative reference catalogue

### 2.1 Instructional episode model (38I — primary anchor)

| Document | What it defines | 38Q use |
|----------|-----------------|---------|
| [38I-1 Prior pedagogical journey](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md) | Recovered functions from Sprints 28–31; survival/dilution through 38G/38H | Historical “what good looks like” vocabulary |
| [38I-2 Instructional episode model](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) | Understand / Apply / Analyse / Evaluate archetypes; canonical function sequences | Archetype baseline |
| [38I-3 KM/LO → episode mapping](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-3-km-lo-episode-mapping.md) | Affordance → function population rules | What upstream can supply |
| [38I-4 Target-state mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | Inflation A1–A4 target density (~8× vs EV-38G-AFTER) | Quantitative bar |
| [38I-4 A4 Evaluate learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | Full capstone teaching architecture — perspectives, criteria, worked judgement, guided fade, transfer | **Primary capstone exemplar** |
| [38I-5 Implementation implications](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) | Function reliability; IFP as missing layer | Generation-surface hypothesis |
| [38I-6 Sprint closure](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-6-sprint-closure.md) | “Rich episodes feasible; planning/choreography is the gap” | Programme finding |

### 2.2 Workbook and ACM context

| Document | Role |
|----------|------|
| [38C-1 Workbook pedagogy model](../../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | Learner workbook quality bar |
| [38G-2 Activity component model](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) | ACM components vs episode functions |

### 2.3 Fidelity closure and current output (38P — contrast baseline)

| Document / artefact | Role |
|---------------------|------|
| [38P-6A GAM→Page investigation](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md) | Worksheet UX despite preservation; G4 generation shape |
| [38P-7 Sprint closure](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-7-sprint-closure.md) | Fidelity closed; generation gap confirmed |
| `EV-38P-AFTER-*` | Current DLA→GAM→Page→Render with `fullOk: true` |
| `EV-38M-AFTER-dla-learning-activities.json` | Current DLA material obligations |
| `EV-38M-AFTER-gam.json` | Current GAM modular output |

### 2.4 Historical “what good looks like” lineage

| Era | Contribution | Episode-relevant functions |
|-----|--------------|----------------------------|
| **Sprint 28** | Cognitive engagement architecture; D1–D10 rubric | Phased progression; anticipated responses; revision |
| **Sprint 30** | PEL orientation + reasoning contracts | Self-directed reasoning scaffolds |
| **Sprint 31** | Page rhetoric | Presentation — not episode depth |
| **38I-1 §8** | Consolidated function vocabulary | Cross-reference for 38Q-2 taxonomy |

---

## 3. Teaching architecture vs worksheet architecture

### 3.1 Target arc (38Q mission)

**Teaching architecture** — learner moves through reasoning:

```text
Observe → Predict → Compare → Explain → Evaluate → Transfer → Reflect
```

**Worksheet architecture** — learner completes artefacts:

```text
Read → Complete table → Checklist
```

### 3.2 Pattern privilege matrix (baseline inventory)

Patterns **underused** in current DLA/GAM output ([38P-6A](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) but **present** in 38I-4 and historical exemplars:

| Pattern | 38I-4 / exemplar signal | Current generation signal |
|---------|-------------------------|---------------------------|
| **Worked judgement** | Step 3 — economist judges options with explicit criteria | Modular `modelling_note` body; weak integration |
| **Weak vs strong exemplars** | Contrasting judgements with error patterns named | Bullet slogans or absent narrative contrast |
| **Guided reasoning** | Rubric construction before independent judgement | Empty table shell or checklist-only |
| **Guided → independent fade** | Worked example → guided table → memo template | Parallel modular materials without fade arc |
| **Misconception confrontation** | Named error patterns in criteria and feedback | Misconceptions in KM; rarely dramatised in episode |
| **Comparative evaluation** | Perspectives table; distribution/adaptation/time lenses | Scenario menu without perspective construction |
| **Transfer chains** | Application to new household with verification | Short transfer prompt; no chain |
| **Narrative learning episodes** | Step 1 builds perspectives before judging | Activity preamble + task list |
| **Evaluative dialogue structures** | Pause-and-write moves; competing perspectives | Single learner_task block |

Patterns **overused** in current output:

| Pattern | Risk |
|---------|------|
| **Templates** | Scaffold without teaching sequence |
| **Tables** | Completion task replaces reasoning |
| **Checklists** | Verification without modelling or criteria construction |

**38Q-1 task:** For each A1–A4 activity on the inflation workload, note which patterns appear in **38I-4 target** vs **EV-38P-AFTER** output.

---

## 4. Capstone exemplar — 38I-4 A4 Evaluate (summary)

The [38I-4 A4 learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) is the **authoritative capstone** for “what good looks like” at Evaluate level.

| Step | Teaching move | Worksheet substitute (to avoid) |
|------|---------------|--------------------------------|
| **Orientation** | Where you are in session; why Evaluate differs from Analyse | Generic LO restatement |
| **Step 1 — Perspectives** | Two households; three lenses; pause-and-write | Scenario list only |
| **Step 2 — Criteria** | Four-dimension rubric tied to case; weighting exercise | Criteria bullet list |
| **Step 3 — Worked judgement** | Economist ranks options A–E with trade-offs named | Modelling note slogans |
| **Step 4 — Guided judgement** | Learner ranks with hints; partial exemplar rows | Empty decision table |
| **Step 5 — Independent judgement** | Memo template with verification checklist | Template fragment |
| **Step 6 — Transfer + reflect** | New case + synthesis | One-line transfer prompt |

**Baseline finding (from 38P-6A):** EV-38P-AFTER preserves **all modular role types** at full body length after merge, but **does not generate** the integrated narrative arc above. Roles survive; **episode choreography does not**.

---

## 5. Current output baseline (EV-38P-AFTER)

Use post-fidelity artefacts as **“what we generate today”**:

| Artefact | Path | Review focus |
|----------|------|--------------|
| DLA | `EV-38M-AFTER-dla-learning-activities.json` | `required_materials` types; learner_task shape |
| GAM | `EV-38M-AFTER-gam.json` | Material bodies; modular vs narrative |
| Page (merged) | `EV-38P-AFTER-design-page.json` | Role index; canonical keys |
| Render | `EV-38P-AFTER-render.html` | Learner-facing sequence |
| Proof | `EV-38P-AFTER-run-log.json` | `fullOk: true` — fidelity floor |

**Do not treat pre-38P render or raw compose-only page as primary baseline** — they misrepresent current fidelity machinery.

---

## §A — Per-archetype summary (38I-4 target vs EV-38P-AFTER)

**Comparator:** [38I-4 target mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · `EV-38M-AFTER-dla-learning-activities.json` · `EV-38P-AFTER-gam.json` · [38P-6A](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)

**Note on A3:** 38I-4 target A3 is **Types and Causes of Inflation** (typology/causal Analyse). EV-38P-AFTER A3 is **Household Inflation Impact** (comparative household Analyse). Both are Analyse archetype but **different planned objects** — comparison notes both.

### A1 — Understand (CPI vs GDP deflator / inflation discrimination)

| Dimension | 38I-4 target | EV-38P-AFTER |
|-----------|--------------|--------------|
| **Episode trace** | Orientation → Explanation → Example → **Non-example** → **Misconception challenge** → Guided → Independent classification → Verification → Reflection ([38I-4 A1 §3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) | Read concept (M1) → study worked example (M2) → use sample output (M3) → checklist (M4) |
| **Scale** | ~950 words target | 4 materials; exposition + worked + model answer + checklist |
| **Teaching moves** | Discrimination tables; CPI/GDP deflator reconciliation; guided classification items | Concept text + worked contrast; **no** non-example material, **no** misconception dramatisation, **no** classification task |
| **Learner evidence** | Classify statements; own-words definition with example + non-example | Written explanation + checklist self-mark |
| **38P-6A** | — | “Exposition + worked example + model answer + checklist — **not table-first**” ([38P-6A A1](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) — **least worksheet-like** of four activities |

**Gap:** Target requires **concept-boundary teaching** (non-example, misconception repair, classification). Current delivers **read-model-verify** package — closer to reference library than coached discrimination episode.

### A2 — Apply (CPI calculation)

| Dimension | 38I-4 target | EV-38P-AFTER |
|-----------|--------------|--------------|
| **Episode trace** | Criteria exposition → Worked thinking → **Guided practice (one row)** → **Independent practice (full table)** → Verification → Transfer ([38I-4 A2 §3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) | Study worked (M5) → compare sample (M6) → **complete classification_table** (M7) → checklist (M8) |
| **Scale** | ~900 words; explicit fade arc | 4 materials; table-centric |
| **Teaching moves** | Procedure rules; error avoidance; **hint column on guided row**; keyed answers; revision path | Full table scaffold; worked + sample present |
| **Learner evidence** | Completed calculation table with procedural match | Completed table + checklist |
| **38P-6A** | — | Table renders as **“Worksheet”** heading; “**Table-centric Apply by design**” ([38P-6A A2](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |

**Gap:** Target **Apply fade** (guided row → independent table) absent — single practice table. Procedure teaching partially present via worked_example; **worksheet completion** dominates learner_task.

### A3 — Analyse

| Dimension | 38I-4 target (typology/causes) | EV-38P-AFTER (household impact) |
|-----------|-------------------------------|--------------------------------|
| **Episode trace** | Analytical question → Criteria dimensions → Worked analytic walkthrough → **Guided inquiry** → Guided matrix → Independent justification → Reflection ([38I-4 A3 §3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) | Study worked pass (M9) → **complete analysis_table** (M10) → review scenario (M11) → checklist (M12) |
| **Analytical object** | Compare inflation **types/causes** on trigger/transmission/first-hit/policy dimensions | Compare **two households** on distribution/adaptation/time lenses |
| **Teaching moves** | Cause taxonomy teaching; productive uncertainty prompts; justified comparison | Worked pass + empty lens table; scenario context |
| **38P-6A** | — | “Worksheet + table completion dominates”; ordering regression pre-38P ([38P-6A A3](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |

**Gap:** Even treating EV-38P A3 as valid Analyse, output is **table-completion-first** without guided inquiry beats or analytic narrative arc. **Content mismatch** with 38I A3 target (typology vs household) limits direct mock-up comparison — archetype gap patterns still align (§G).

### A4 — Evaluate (household strategy capstone)

| Dimension | 38I-4 target / [A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | EV-38P-AFTER |
|-----------|--------------|--------------|
| **Episode trace** | Perspectives → **Criteria construction** → Worked judgement → Guided ranking → Independent memo → Verify → **Learner reflection** → Transfer | Scenario (M13) → criteria text (M14) → modelling_note (M15) → decision_table (M16) → template (M17) → checklist (M18) → transfer (M19) → consolidation (M20) |
| **Scale** | ~1,350 words; 14 function trace ([38I-4 A4 §3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) | 8 materials; 7,716 chars GAM total ([38P-6A A4](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |
| **Teaching moves** | Integrated narrative; pause-and-write; criteria weighting; full A–E economist walkthrough | Modular role types present; **parallel** materials; M20 designer summary |
| **38P-6A** | — | “GAM modules cover role **types** but not **integrated narrative depth**”; G4 episodic structures never generated |

**Gap:** Broadest material coverage of four activities — yet **most episode functions missing** relative to 38I target (perspectives, criteria construction, fade, learner reflection). §G details feature-level gaps.

### Cross-archetype finding (tests Activity→Materials→Task hypothesis)

| 38I planned unit | EV-38P planned unit | Consistent? |
|------------------|---------------------|:-----------:|
| Ordered **instructional functions** with transitions | Parallel **`required_materials`** + **`learner_task`** checklist | **No** |
| Learner **state change** (discriminate → classify → justify) | Learner **artefact completion** (read → fill → check) | **Partial** |
| **Reasoning move** as primary object | **Material type** as primary object | **No** |

Weaknesses in §G are **not A4-specific**. A1 lacks misconception/non-example; A2/A3 lack fade and inquiry; all four use completion-oriented `learner_task`. A4 is the **most function-dense** target and therefore shows the largest **absolute** gap — but the **unit-of-design mismatch** appears at every archetype.

---

## §B — Pattern presence matrix (inflation workbook A1–A4)

Filled from [§3.2](#32-pattern-privilege-matrix-baseline-inventory). **Present** = observable in 38I-4 target or A4 episode; **Absent/weak** = missing or worksheet substitute in EV-38P-AFTER.

| Pattern | A1 | A2 | A3 | A4 |
|---------|:--:|:--:|:--:|:--:|
| **Worked judgement** | — | — | — | Target ✓ / EV **Partial** (M15 modular) |
| **Weak vs strong exemplars** | — | — | — | Target ✓ / EV **Partial** (M15 present) |
| **Guided reasoning** | Target ✓ (guided classification) / EV **Absent** | Target ✓ (hint row) / EV **Weak** (table only) | Target ✓ / EV **Partial** (table hints) | Target ✓ / EV **Partial** (M16) |
| **Guided → independent fade** | Target ✓ / EV **Absent** | Target ✓ / EV **Absent** | Target ✓ / EV **Absent** | Target ✓ / EV **Absent** |
| **Misconception confrontation** | Target **R** / EV **Absent** | — | — | Target ✓ / EV **Weak** (via weak/strong only) |
| **Comparative evaluation** | — | — | Target ✓ / EV **Partial** (household table) | Target ✓ / EV **Partial** (ranking table) |
| **Transfer chains** | — | Target ✓ (single calc) / EV **Absent** | Target ✓ / EV **Weak** | Target ✓ / EV **Partial** (M19 single prompt) |
| **Narrative learning episodes** | Target ✓ / EV **Absent** | Target ✓ / EV **Absent** | Target ✓ / EV **Absent** | Target ✓ / EV **Absent** |
| **Evaluative dialogue structures** | Target ✓ (reconciliation prompt) / EV **Absent** | — | Target ✓ (inquiry) / EV **Absent** | Target ✓ / EV **Absent** |
| **Templates (overuse risk)** | — | — | — | EV **Present** (M17) |
| **Tables (overuse risk)** | — | EV **Present** (M7 Worksheet) | EV **Present** (M10 Worksheet) | EV **Present** (M16) |
| **Checklists (overuse risk)** | EV **Present** (M4) | EV **Present** (M8) | EV **Present** (M12) | EV **Present** (M18) |

**Reading:** Patterns underused in 38I targets appear **absent or weak across all four activities**, not only A4. A4 adds Evaluate-specific patterns (worked judgement, weak/strong) where EV-38P is **partial**. Worksheet patterns (tables, checklists) appear **A2–A4** consistently.

---

## §C — Historical function recovery (Sprint 28–31 vs EV-38P-AFTER)

Source: [38I-1 §3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md), [38I-1 §8](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md), [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) targets.

| Historical function | Sprint origin | In 38I-4 target? | In EV-38P GAM/DLA? | Recovery status |
|---------------------|---------------|:----------------:|:-------------------:|-----------------|
| **Phased cognitive progression** (activate → confront → reconcile) | 28 D8/D9 | A1, A3, A4 | **No** — flat material lists | **Lost** |
| **Predict → revise cycle** | 28 D9 | Implicit in inquiry beats | **No** — `initial_position_prompt` absent on EV-38M | **Lost** |
| **Misconception repair path** | 28 D5; packs | A1 **R** | A1: **No** dedicated material; KM misconceptions unused | **Lost** (A1) |
| **Non-example / contrast** | 38I-2 Understand | A1 | **No** | **Lost** |
| **If-then scaffolding / anticipated responses** | 28 D6/D7 | Episode design | **No** | **Lost** |
| **Scaffold fading (session + within-episode)** | 28; 38I-2 | A2, A4 | **No** — parallel materials | **Lost** |
| **Guided inquiry / productive uncertainty** | 28 D3; 38I-2 | A3, A4 | **No** distinct prompts in GAM | **Lost** |
| **Pause-and-write / uncertainty tension** | 28; 29 semantics | A1, A4 | **No** | **Lost** |
| **PEL orientation_contract** | 30 | All activities | **Partial** — `activity_preamble` on all four DLA rows | **Diluted** |
| **PEL reasoning_contract** | 30 | A3, A4 | **Partial** — `reasoning_orientation` on some rows | **Diluted** |
| **Metacognition_contract** | 30 (deferred) | A4 Reflection | **No** — M20 read-only summary | **Lost** |
| **Intellectual coherence bridge** | 30 | Transitions | **No** inter-activity bridge materials | **Lost** |
| **Revision cycle fields** | 28–29 | A2 revision path | **No** | **Lost** |
| **Worked thinking** | 28 D2; 38C | All | **Yes** — worked_example / modelling_note | **Survived** |
| **Verification checklist** | 38C | All | **Yes** — checklist materials | **Survived** (often without repair path) |
| **Transfer task** | 28; 38C | A2–A4 target | **Partial** — A4 M19 only; A1–A3 weak/absent | **Diluted** |
| **Visible pedagogy / cue hierarchy** | 29, 31 | Presentation | **Yes** post-38P render — presentation not generation | **Survived** (downstream) |

**Summary:** Functions that **survived** map to **material types** (worked_example, checklist, scenario, table). Functions that **lost** map to **episode choreography, cognition cycles, and learner-state transitions** — the historical programme’s cognitive-process layer ([38I-1 §7](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md): “flattened phased progression, if-then scaffolding, anticipated responses, revision cycles”).

---

## §D — Generation vs fidelity distinction

| Gap class | Status | Evidence |
|-----------|--------|----------|
| **GAM body loss at Page compose** | **Solved** (38M) | Pre-merge A4 7% → post-merge 100% ([38P-6A §126](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |
| **Role duplication / stub headings** | **Solved** (38P) | `proofOk`, `roleOk`, `fullOk` on EV-38P-AFTER |
| **Render worksheet heading noise** | **Partially presentation** | A2/A3 “Worksheet” labels — registry semantics; bodies preserved ([38P-6A §160](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |
| **Modular material type coverage** | **Generation — adequate types** | 20/20 materials generated with substantive bodies ([38P-6A §22](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |
| **Episode function sequencing** | **Generation — open** | No fidelity stage plans instructional moves; DLA lists parallel obligations |
| **Narrative / perspective / fade arcs** | **Generation — open** | G4: never generated ([38P-6A §179](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) |
| **Misconception / non-example / inquiry** | **Generation — open** | Absent despite KM + 38I target ([§C](#c--historical-function-recovery-sprint-2831-vs-ev-38p-after)) |
| **Learner_task worksheet framing** | **Generation — open** | “Complete the table… Verify…” on all activities — persists with `fullOk` |
| **A3 content vs 38I target** | **Generation — open** | Household Analyse ≠ typology Analyse ([38I-4 A3 note](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |

**Rule for 38Q:** Do not attribute remaining worksheet orientation to merge, render, or validator defects. **Fidelity floor holds.** Remaining gaps are **upstream generation shape** and **abstraction unit-of-design** — consistent with §G provisional verdict (H2 High).

---

## §E — Baseline principles for 38Q-2 taxonomy

Seeded for taxonomy catalogue — **not** implementation decisions.

### E.1 Naming hierarchy

| Layer | Name source | Example |
|-------|-------------|---------|
| **Instructional function** | [38I-2 §1.3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) move vocabulary | Worked thinking, Misconception challenge, Evaluative judgement |
| **Function tag** | 38I-2 R / C / O | Criteria exposition **R** for Evaluate |
| **Pattern family** | 38Q §3.2 + §G features | Guided fade, Perspective construction |
| **Material type** | DLA/GAM ACM types | `modelling_note`, `decision_table` |
| **Anti-pattern** | Worksheet architecture | Table-without-teaching, checklist-without-modelling |

**38Q-2 rule:** Taxonomy entries must state **function first**, then note which material types **realise** the function — not equate material type with pedagogical move.

### E.2 Archetype anchors

| Archetype | Canonical sequence source | Primary learner evidence |
|-----------|---------------------------|----------------------------|
| **Understand** | 38I-2 §2.2 | Discrimination / classification |
| **Apply** | 38I-2 §3.2 | Procedure execution with fade |
| **Analyse** | 38I-2 §4.2 | Justified comparison / analysis |
| **Evaluate** | 38I-2 §5.2 | Defended judgement + transfer |

### E.3 Teaching vs worksheet classification test

An activity passage is **worksheet architecture** when:

1. Primary learner action is **fill a table or checklist** without prior modelling of the intellectual move.  
2. **Ordering of teaching** is absent — materials could be reordered without pedagogical loss.  
3. Verification checks **completion** not **reasoning quality** (no rubric, no exemplar contrast).

An activity passage is **teaching architecture** when:

1. Learner moves through **ordered reasoning states** (orient → model → try → verify → reflect).  
2. **Fade** or **confrontation** is structurally visible.  
3. Evidence requirement matches cognitive demand ([38I-2 §1.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)).

### E.4 Cross-reference to §G

38Q-2 should use §G feature names as **cross-cutting pattern vocabulary** applicable within multiple archetypes (e.g. Guided fade appears in Apply, Analyse, Evaluate).

---

## §F — Constraints and preservation requirements

Any future abstraction investigation outcome (38Q-4 onward) or follow-on implementation must respect:

| ID | Constraint | Evidence floor |
|----|------------|----------------|
| **F-1** | **`fullOk` hard constraint** | EV-38P-AFTER: `proofOk: true`, `roleOk: true`, `fullOk: true` |
| **F-2** | **Do not reopen 38M–38P** | [38P-7 closure](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-7-sprint-closure.md); charter hold |
| **F-3** | **Regression suite** | 58/58 (38M + 38N + 38P) — any future change must not regress |
| **F-4** | **38I target states authoritative** | Mock-ups + A4 episode — extend, do not replace without evidence |
| **F-5** | **38Q docs-only default** | No production changes until follow-on sprint chartered |
| **F-6** | **Merged path is canonical baseline** | Compare against post-38M merge + post-38P render — not raw compose |
| **F-7** | **Diagnosis before redesign** | 38Q-1 does not prescribe abstraction changes |

---

## Archetype-Level Abstraction Assessment

**Purpose:** Test whether weaknesses are A4-specific or structural across the episode model. For each archetype: (1) derive the **fundamental instructional object** from 38I target evidence; (2) assess DLA/GAM fit **without assuming** the Activity→Materials→Task hypothesis.

**Fit legend:** **A** = naturally represented · **B** = partially represented · **C** = poorly represented

| Archetype | Planned object (from 38I target) | DLA fit | GAM fit | H1/H2/H3 signal |
|-----------|----------------------------------|:-------:|:-------:|:----------------:|
| **A1 Understand** | **Concept-discrimination sequence** — teach definition → positive example → **non-example** → **misconception confrontation** → guided → independent classification → verification ([38I-4 A1 §3–4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); [38I-2 §2.2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)) | **B** | **B** | **H2** |
| **A2 Apply** | **Procedure-practice sequence with fade** — criteria/rules → worked run → **guided partial attempt** → **independent full attempt** → keyed verification → optional transfer ([38I-4 A2 §3–4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); [38I-2 §3.2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)) | **B** | **B** | **H2/H3** |
| **A3 Analyse** | **Analytic-reasoning sequence** — framed question → **comparison criteria/lenses** → worked analytic pass → **guided inquiry** → structured analysis → **justified conclusion** → reflection ([38I-4 A3 §3–4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); [38I-2 §4.2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)) | **B** | **B** | **H2/H3** |
| **A4 Evaluate** | **Judgement sequence** — perspectives → **criteria construction** → exemplar judgement → guided evaluation → **independent defended recommendation** → rubric verify → **learner reflection** → transfer **R** ([38I-4 A4 §3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)) | **B** | **B** | **H2** |

### Per-archetype evidence

#### A1 — Concept-discrimination sequence

| Question | Answer |
|----------|--------|
| **Planned object** | Sequence of **reasoning moves** that build discrimination — not a reading pack ([38I-2 §2.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md): “observable evidence of **discrimination**”). |
| **DLA fit B** | M1 text + M2 worked + M3 sample + M4 checklist — covers Explanation, Example, Verification. **Missing obligations:** non-example, misconception challenge, classification task ([EV-38M A1](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). `learner_task` = read → explain → checklist. |
| **GAM fit B** | Delivers exposition and worked contrast. **No** discrimination table, **no** reconciliation prompt ([38P-6A A1](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)). |
| **Not C** | Some teaching present — not pure task shell. Strongest fit of four activities. |

#### A2 — Procedure-practice sequence with fade

| Question | Answer |
|----------|--------|
| **Planned object** | **Process modelling with decreasing scaffold** — defining Apply arc ([38I-2 §3.4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md): “fade is the defining episode arc”). |
| **DLA fit B** | M5 worked + M6 sample + M7 `classification_table` + M8 checklist — procedure materials exist. **No** separate guided vs independent practice obligation; single table ([EV-38M A2](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). |
| **GAM fit B** | Worked steps + practice table generated ([38P-6A A2](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)). Render frame = **Worksheet**. Fade absent. |
| **H2/H3 signal** | Fade is sequence-native (**§G.7 C**) — material catalogue alone cannot express Apply arc. |

#### A3 — Analytic-reasoning sequence

| Question | Answer |
|----------|--------|
| **Planned object** | **Compare using explicit lenses** with worked analytic modelling and inquiry before independent justification ([38I-2 §4.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)). 38I target: typology/causes; EV-38P: household lenses — both are analytic-reasoning objects but **different content**. |
| **DLA fit B** | M9 worked pass + M10 analysis_table + M11 scenario + M12 checklist — analytic **artefacts** present. **No** guided inquiry obligation; `facilitation_moves` absent; table-first `learner_task` ([EV-38M A3](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). |
| **GAM fit B** | Lens columns in M10; worked pass M9 ([38P-6A A3](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)). **No** inquiry prompts; worksheet framing. |
| **H2/H3 signal** | Same structural gap as A2/A4 — **reasoning sequence** collapsed to **table completion**. |

#### A4 — Judgement sequence

| Question | Answer |
|----------|--------|
| **Planned object** | **Defended evaluative decision** through ordered moves — perspectives before criteria before judgement ([38I-2 §5.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md); [38I-4 A4 episode Step 1–8](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)). |
| **DLA fit B** | Richest material set (8 types M13–M20) including modelling_note, decision_table, transfer_prompt ([EV-38M A4](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). **Parallel list** — no perspective step, no criteria **construction**, no fade, M20 closure not learner reflection. |
| **GAM fit B** | All role types at substantive length post-fidelity ([38P-6A A4](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)). Integrated narrative absent (G4). |
| **Not C** | More than A1–A3 — **widest type coverage** — but same **sequence** deficit. Confirms §G: A4 gaps are **most visible**, not **unique**. |

---

## Native instructional object — diagnostic synthesis

**Key question:** What is the native instructional object currently represented by DLA/GAM, and how does that differ from 38I target-state exemplars?

### Current DLA/GAM native object

```text
Activity (LO-mapped)
  → required_materials[] (parallel material-type obligations)
  → learner_task (completion checklist)
  → expected_output (artefact evidence)
```

**Evidence:** All four EV-38M activities share this shape. Cognition fields (`activity_preamble`, `scaffold_hint_sequence`, etc.) are **activity-row annotations**, not ordered function plans. GAM realises each material independently ([38P-6A §25](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): “DLA shapes modular table/checklist activity design”).

**Native unit:** **Material-package activity** — an executable task with a **checklist of artefacts** to consume or complete.

### 38I target-state native object

```text
Instructional episode (archetype-selected)
  → ordered instructional functions / reasoning moves
  → learner state transitions (discriminate → apply → analyse → judge)
  → transitions, verification, closure
  → materials realise functions (downstream)
```

**Evidence:** [38I-2 §1.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md): “coherent sequence of instructional moves — not a material-type checklist.” Each 38I-4 mock-up §3 provides an **episode trace** with 10–14 tagged functions before mock-up prose.

**Native unit:** **Instructional episode** — a **coached reasoning path** where material types are **implementation surfaces**, not the planning object.

### Difference (tested, not assumed)

| Dimension | DLA/GAM | 38I target |
|-----------|---------|------------|
| **Primary planning object** | Material types + task | Instructional functions + sequence |
| **Ordering semantics** | Implicit in `learner_task` prose | Explicit in episode trace |
| **Learner state** | Completing artefacts | Moving through reasoning moves |
| **Fade / transition** | Not represented | Required across archetypes |
| **Evaluate vs Analyse** | More materials | Different **sequence shape**, not only density |

**Hypothesis test result:** The Activity → Materials → Task vs Episode → Reasoning Move → Transition framing **fits the evidence** across A1–A4. It is **not confirmed as the only explanation** — insufficient evidence to rule out that richer DLA specs alone could approximate some sequences (A1 is closest). But **three archetypes share the same structural deficit** (fade, inquiry, narrative), and A4’s extra material types do not close the sequence gap.

**Insufficient evidence note:** Single workload (inflation A1–A4), single pipeline run (EV-38P-AFTER). Cross-domain generalisation not tested in 38Q-1. A3 **content mismatch** limits strict mock-up diff for Analyse typology.

---

## 6. Baseline review checklist (38Q-1 completion criteria)

Complete the following synthesis sections in this document (or linked addenda) before closing 38Q-1:

- [x] **§A** — Per-archetype summary (A1 Understand, A2 Apply, A3 Analyse, A4 Evaluate): 38I-4 target vs EV-38P-AFTER  
- [x] **§B** — Pattern presence matrix (§3.2) filled for inflation workbook  
- [x] **§C** — Historical function recovery: which Sprint 28–31 moves appear in 38I-4 but not in current GAM  
- [x] **§D** — Explicit statement: which gaps are **generation** vs already **solved by fidelity**  
- [x] **§E** — Baseline principles for 38Q-2 taxonomy (naming conventions, R/C/O if used)  
- [x] **§F** — Constraints: any future design must preserve `fullOk`  
- [x] **§G** — Abstraction adequacy assessment matrix (below) filled with evidence  
- [x] **§H** — Counterfactual generation test (below) completed for 38I-4 A4 and historical exemplars

---

## §G — Abstraction adequacy assessment

**Evidence base:** [38I-4 A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) · [38I-2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-1 §3.1/§8](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md) · [38P-6A](../../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md) · `EV-38M-AFTER-dla-learning-activities.json` · `EV-38P-AFTER-gam.json` · [38I-5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)

**Method:** For each feature, assess DLA and GAM separately, cite concrete structures, apply the counterfactual (“perfect implementation per current design — would the feature naturally emerge?”), classify **A / B / C**.

**Legend:** **Y** = naturally represented · **Partial** = type exists but shape/depth misaligned · **N** = no first-class home

### Summary matrix

| Feature | DLA natural? | GAM natural? | Prompt forcing? | Missing abstraction? | Counterfactual | Primary hypothesis |
|---------|:------------:|:------------:|:---------------:|:--------------------:|:--------------:|:------------------:|
| Prediction | N | N | Y | Y | **C** | H2/H3 |
| Perspective construction | Partial | Partial | Y | Y | **C** | H2/H3 |
| Criteria construction | Partial | Partial | Y | Y | **B** | H2 |
| Worked judgement | Y | Y | Partial | Partial | **B** | H2 |
| Weak vs strong comparison | Y | Y | Partial | Partial | **A** | H1 |
| Guided reasoning | Y | Y | Partial | Partial | **B** | H2 |
| Guided → independent fade | N | N | Y | Y | **C** | H2/H3 |
| Misconception confrontation | Partial | Partial | Y | Y | **B** | H2 |
| Comparative evaluation | Partial | Partial | Y | Y | **B** | H2 |
| Transfer chains | Partial | Partial | Y | Y | **B** | H2 |
| Reflection | Partial | Partial | Y | Y | **B** | H2 |

---

### G.1 — Prediction

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **DLA** | **N** | No `prediction` material type or cognition field. A1–A4 use `prior_knowledge_activation` (recall), not predict-then-revise. Sprint 28 **D9 revision cycle** (`initial_position_prompt`, `reasoning_revision_prompt`) exists in pack vocabulary but is **absent** from `EV-38M-AFTER` DLA rows ([38I-1 §3.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md)). |
| **GAM** | **N** | GAM realises DLA `required_materials` only — no generation surface for anticipatory learner positions. |
| **38I exemplar** | Understand/Analyse episodes may elicit prediction before explanation ([38I-2 §2.2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) Activation); A4 capstone does not centre prediction but session arc expects phased progression ([38I-1 D9](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md)). |
| **Prompt forcing?** | **Y** — would require prose in `learner_task` or undeclared cognition fields. |
| **Missing abstraction?** | **Y** — no first-class predict → confront → revise structure. |

**Counterfactual:** **C — No.** Even perfect DLA/GAM would not emit prediction beats without schema/pack extension or an episode-planning layer ([38I-5 §3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md): phased progression flattened post-38G).

---

### G.2 — Perspective construction

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **DLA** | **Partial** | A4 `reasoning_orientation`: “Integrate multiple perspectives…” — orientation field, not a structured perspective artefact. A4 M13 `scenario` spec: “Maya-style household… strategy menu A–E” — **decision context**, not dual-household perspective mapping ([EV-38M DLA A4 M13](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). A3 M10 scenario + analysis table uses distribution/adaptation/time lenses in **table headers** — closer, but learner **fills cells**, does not construct perspectives narratively. |
| **GAM** | **Partial** | `EV-38P-AFTER` M13: single Maya household + neutral strategy list — **no** two-household contrast, **no** three-lens exposition, **no** pause-and-write move ([38I-4 Step 1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)). [38P-6A §158](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): “38I-4-style narrative perspectives — **never generated**” (G4). |
| **38I exemplar** | Step 1 is **core** Evaluate move: two households, three lenses table, competing perspective bullets, pause-and-write ([38I-4 §Step 1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38I-4 commentary](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md): “competing perspectives not first-class KM objects”). |
| **Prompt forcing?** | **Y** — `reasoning_orientation` hints at perspectives but DLA does not **obligate** perspective material or sequence before criteria. |
| **Missing abstraction?** | **Y** — no `perspective_map`, `competing_views`, or episode-step type for perspective construction. |

**Counterfactual:** **C — No.** Current design treats perspectives as optional prose in orientation fields or implicit in scenario text. 38I-4 Step 1 requires **integrated narrative episode choreography** absent from material-type catalogue ([38P-6A G4](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)).

---

### G.3 — Criteria construction

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **DLA** | **Partial** | A4 M14 `type: text`, `purpose: criteria exposition` — spec delivers **≥3 criteria** as author-written exposition, not learner-built rubric ([EV-38M DLA M14](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). Apply/Analyse use `processes.steps` or relationship lenses as criteria ([38I-5 §1.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md): criteria **strong** for Apply, **weak** for Evaluate). No weighting exercise or “construct your rubric” material type. |
| **GAM** | **Partial** | M14 body: three delivered criteria (Financial Stability, Purchasing Power, Risk/Trade-offs) — **read-only exposition** ([EV-38P-AFTER-gam.json M14](../../2026-06-05-sprint-38p-instructional-role-fidelity/artefacts/EV-38P-AFTER-gam.json)). 38I-4 Step 2 requires learner **weighting sentence** and four-dimension rubric tied to case — not generated. |
| **38I exemplar** | Step 2: four criteria + “write one sentence” on weighting — **construction**, not reception ([38I-4 §Step 2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); commentary: “no KM `criteria` slot”). |
| **Prompt forcing?** | **Y** — DLA can specify exposition depth in M14 spec, but **cannot** specify learner construction without inferring from free-text spec. |
| **Missing abstraction?** | **Y** — `criteria exposition` ≠ `criteria construction`; no rubric-building or weighting move. |

**Counterfactual:** **B — Partly.** Perfect implementation would produce criteria **text** (M14) reliably — observed on EV-38P-AFTER. It would **not** produce learner criteria construction or weighting without extending material semantics or episode plan ([38I-5 §3.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md): criteria exposition **high inference** for Evaluate).

---

### G.4 — Worked judgement

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **DLA** | **Y** | A4 M15 `type: modelling_note`, `purpose: worked judgement` — explicit spec: “Contrast weak slogan-style vs strong criteria-led evaluation” ([EV-38M DLA M15](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). Matches [38I-2 Evaluate](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) “Worked thinking (exemplar judgement)” as **C** move — type exists. |
| **GAM** | **Y** | M15: 1,082-char weak/strong contrast delivered ([EV-38P-AFTER-gam.json M15](../../2026-06-05-sprint-38p-instructional-role-fidelity/artefacts/EV-38P-AFTER-gam.json); [38P-6A A4](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): survives post-merge). |
| **38I exemplar** | Step 3: economist ranks **options A–E** with trade-offs named, conditional reasoning, explicit criterion weighting — **integrated multi-option judgement** ([38I-4 §Step 3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)). GAM M15 strong example focuses on **Strategy B** generically, not full A–E ranking narrative. |
| **Prompt forcing?** | **Partial** — type obligates contrast; **depth** (full ranking arc) depends on spec prose and GAM-WB prompt rules, not schema. |
| **Missing abstraction?** | **Partial** — `modelling_note` is the right **artefact**; missing **episode integration** (criteria applied to full option set in narrative sequence). |

**Counterfactual:** **B — Partly.** Perfect DLA/GAM produces a `modelling_note` body — **confirmed** on EV-38P-AFTER. It does **not** naturally produce 38I-4 Step 3’s integrated economist walkthrough without either richer specs or an episode layer sequencing criteria → perspectives → full ranking ([38P-6A](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): “modules cover role types but not integrated narrative depth”).

---

### G.5 — Weak vs strong comparison

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **DLA** | **Y** | M15 specification **explicitly** requires weak vs strong contrast — first-class obligation ([EV-38M DLA M15](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). |
| **GAM** | **Y** | M15 delivers labelled weak (slogan) and strong (criteria-led) judgements with commentary ([EV-38P-AFTER-gam.json M15](../../2026-06-05-sprint-38p-instructional-role-fidelity/artefacts/EV-38P-AFTER-gam.json); [38P-6A §152](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)). |
| **38I exemplar** | Step 3 weak/strong block — **same pedagogical function**, higher narrative integration and error-pattern naming ([38I-4 §Step 3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)). |
| **Prompt forcing?** | **Partial** — schema supports; quality variance (pre-merge compose produced “bullet slogans” per [38P-6A §142](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)) suggests **implementation** sensitivity, but post-GAM body is substantive. |
| **Missing abstraction?** | **Partial** — at **material** level, abstraction is adequate; at **episode** level, contrast is not woven through criteria/perspectives arc. |

**Counterfactual:** **A — Yes** (material level). Current abstractions **can** generate weak/strong comparison when DLA obligates M15 — **observed** on EV-38P-AFTER. Gap vs 38I-4 is **integration and depth**, not absence of type — **H1 signal** for this feature alone.

---

### G.6 — Guided reasoning

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **DLA** | **Y** | A4 M16 `decision_table`, `purpose: guided judgement` — partial exemplar ratings + hints ([EV-38M DLA M16](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). A3 `classification_table` / analysis table with lens columns — guided structured reasoning. `scaffold_hint_sequence` lists step hints. |
| **GAM** | **Y** | M16: Strategy A–E table with pre-filled Medium/High ratings and justification hints ([EV-38P-AFTER-gam.json M16](../../2026-06-05-sprint-38p-instructional-role-fidelity/artefacts/EV-38P-AFTER-gam.json)). |
| **38I exemplar** | Step 4: guided table + **checkpoint questions** + criterion-based rejection prompt — table **plus** narrative guided inquiry ([38I-4 §Step 4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38I-2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) Guided inquiry as distinct move). |
| **Prompt forcing?** | **Partial** — table scaffolding is schema-native; **productive uncertainty** / pause-and-write prompts require spec prose. |
| **Missing abstraction?** | **Partial** — `decision_table` covers **tabular** guided reasoning; **dialogic / inquiry** guided reasoning (28 D3/D4) has no material type. |

**Counterfactual:** **B — Partly.** Perfect DLA/GAM produces guided **tables** reliably (EV-38P-AFTER M16). It does not naturally produce 38I-4’s **inquiry prompts between table rows** or Sprint 28 guided inquiry without extension ([38I-1 §3.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md)).

---

### G.7 — Guided → independent fade

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **DLA** | **N** | Materials listed **in parallel** (M16 guided table, M17 independent template) with no fade metadata, dependency, or scaffold-reduction contract. `scaffold_hint_sequence` is a **flat list** — not a fade arc ([EV-38M A4](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). [38I-2 §1.2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md): “Scaffold fading is session-level… within episode, support peaks at modelling/guided practice and reduces at independent performance.” |
| **GAM** | **N** | Realises M16 and M17 as separate bodies — no linking semantics. [38P-6A](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): “Parallel modular materials **without fade arc**.” |
| **38I exemplar** | Steps 3→4→5: worked judgement → partial guided table → independent memo — explicit **progressive release** ([38I-4 §Steps 3–5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)). |
| **Prompt forcing?** | **Y** — `learner_task` enumerates steps in order but does not encode fade; relies on LLM/pack compliance. |
| **Missing abstraction?** | **Y** — no episode-step sequence, fade level, or IFP scaffold-reduction field ([38I-5 IFP hypothesis](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)). |

**Counterfactual:** **C — No.** Perfect DLA/GAM emits **side-by-side** guided and independent artefacts — observed behaviour. Fade is an **episode property**, not a material property; current units are wrong granularity ([38I-2 §1.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md): episode = “coherent sequence of instructional moves”).

---

### G.8 — Misconception confrontation

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **DLA** | **Partial** | Understand archetype: KM `misconceptions[]` can trigger Non-example / Misconception challenge ([38I-2 §2.3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)). A1 DLA has no explicit misconception material in `required_materials` on EV-38M — only concept + worked + sample + checklist. Evaluate A4 uses weak/strong judgement instead of named KM misconception dramatisation. Cognition fields (`misconception_claim`, `reconciliation_prompt`) exist in Sprint 28 vocabulary but **absent** from EV-38M DLA rows. |
| **GAM** | **Partial** | Can embed confrontation in `text` / `modelling_note` prose when specified. A4 M15 weak judgement = **error pattern** by example, not KM-linked misconception repair path. |
| **38I exemplar** | A4 Step 3 names error patterns in criteria; A1 Understand would use Misconception challenge per [38I-2 §6.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md). [38P-6A](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): “Misconceptions in KM; rarely dramatised in episode.” |
| **Prompt forcing?** | **Y** — KM trigger → material mapping is pack guidance, not schema enforcement. |
| **Missing abstraction?** | **Y** — no `misconception_confrontation` material type; Sprint 28 cognition fields not populated on inflation run. |

**Counterfactual:** **B — Partly.** Abstractions **can** carry confrontation via modelling_note or text when DLA specifies — A4 weak judgement demonstrates partial path. Full 28-style confront → reconcile cycle requires extension or IFP ([38I-1 §3.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md)).

---

### G.9 — Comparative evaluation

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **DLA** | **Partial** | A4 M16 `decision_table` supports **multi-strategy comparison** on criteria rows. Missing prerequisite: perspective construction (G.2) and learner-owned criteria weighting (G.3). A3 analysis table compares households on lenses — **analytic** comparison, not **evaluative** ranking with trade-offs. |
| **GAM** | **Partial** | M16 ranking table with A–E strategies ([EV-38P-AFTER-gam.json M16](../../2026-06-05-sprint-38p-instructional-role-fidelity/artefacts/EV-38P-AFTER-gam.json)). Render labels table “Guided judgement table” post-38P — not “Worksheet” ([38P-6A A4](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)). |
| **38I exemplar** | Steps 1–2 build perspectives and criteria **before** comparison; Step 4 comparison is criterion-justified with rejection checkpoint ([38I-4 §Steps 1–4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)). |
| **Prompt forcing?** | **Y** — table type enables comparison; **evaluative** comparison (perspectives + criteria + ranking) requires undeclared episode sequence. |
| **Missing abstraction?** | **Y** — comparison is table-native; **comparative evaluation** as episode function ([38I-2 Evaluative judgement](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)) is not a first-class plan object. |

**Counterfactual:** **B — Partly.** Perfect DLA/GAM produces comparison **tables** — confirmed. It does not produce **38I-4 comparative evaluation** (perspectives → criteria → ranked judgement arc) without episode choreography.

---

### G.10 — Transfer chains

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **DLA** | **Partial** | A4 M19 `transfer_prompt` + activity-level `transfer_or_application_task` ([EV-38M A4](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). Single prompt, ≥80 words — not a **chain** (apply → verify → reflect). |
| **GAM** | **Partial** | M19: single transfer task, 752 chars ([EV-38P-AFTER-gam.json M19](../../2026-06-05-sprint-38p-instructional-role-fidelity/artefacts/EV-38P-AFTER-gam.json); [38P-6A §156](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): transfer ≥80 words ✓). |
| **38I exemplar** | Step 8: reapply **same four criteria** to new context with constraint naming — transfer **with verification against rubric** ([38I-4 §Step 8](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38I-2 §5.3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md): Transfer **R** for Evaluate). |
| **Prompt forcing?** | **Y** — one-shot transfer is schema-default; multi-step chain requires spec prose. |
| **Missing abstraction?** | **Y** — no transfer sequence / chain type; [38P-6A](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): “Short transfer prompt; no chain.” |

**Counterfactual:** **B — Partly.** Single transfer prompt emerges naturally — **observed**. Transfer **chain** (criteria reapplication + verification) does not.

---

### G.11 — Reflection

| Layer | Verdict | Evidence |
|-------|---------|----------|
| **DLA** | **Partial** | `self_explanation_prompt` on A4: “What trade-offs must households consider…” — metacognitive field ([EV-38M A4](../2026-06-05-sprint-38m-page-composition-fidelity/artefacts/EV-38M-AFTER-dla-learning-activities.json)). M20 `consolidation_summary` spec: designer-written synthesis ≥80 words — **closure reading**, not learner reflection ([38I-2 §1.2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md): Reflection = learner-generated). |
| **GAM** | **Partial** | M20: third-person session summary — learner **reads**, does not answer reflection prompts ([EV-38P-AFTER-gam.json M20](../../2026-06-05-sprint-38p-instructional-role-fidelity/artefacts/EV-38P-AFTER-gam.json)). `self_explanation_prompt` lives on DLA activity row — depends on page composition surfacing, not GAM material. |
| **38I exemplar** | Step 7: three **learner** reflection questions including evaluate vs analyse distinction ([38I-4 §Step 7](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38I-2 §5.3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md): Reflection **R** for Evaluate). |
| **Prompt forcing?** | **Y** — reflection quality depends on populating cognition fields; M20 type biases toward **model summary** (38H-2 anti-spoiler tension). |
| **Missing abstraction?** | **Y** — no `reflection_prompt` material type distinct from `consolidation_summary`; Sprint 30 `metacognition_contract` deferred ([38I-1 §3.3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md)). |

**Counterfactual:** **B — Partly.** Activity-level `self_explanation_prompt` can surface with perfect composition — but current pipeline emphasises M20 read-only consolidation over Step 7 learner reflection — **worksheet-adjacent closure** ([38Q-1 §3.2](../38Q-1-what-good-looks-like-baseline.md)).

---

## Preliminary Hypothesis Assessment

Evidence from §G aggregated against H1 / H2 / H3. **Provisional only** — 38Q-2 taxonomy and 38Q-3 gap quantification may revise.

### H1 — Implementation deficiency

**Evidence supporting:**

- **Weak vs strong comparison (G.5):** DLA M15 + GAM `modelling_note` — type and obligation match 38I intent; EV-38P-AFTER delivers substantive contrast ([38P-6A §152](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)). Counterfactual **A**.
- **Guided reasoning tables (G.6):** M16 `decision_table` with hints — generated at full length post-fidelity; implementation gap was compose/render, now closed ([38P-7](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-7-sprint-closure.md)).
- **Worked judgement bodies (G.4):** Material type exists; GAM produces 1,082-char M15 — depth shortfall vs 38I-4 may be prompt/spec quality, not missing type.
- Pack already references IFP archetype templates in DLA `defaultPromptNotes` ([domain-learning-design-step-patterns.md](../../../../domains/learning-design/domain-learning-design-step-patterns.md)) — choreography guidance exists but is not structurally enforced.

**Evidence against:**

- Only **1/11** features scores counterfactual **A** at full 38I-4 integration bar; **3/11** score **C** (prediction, perspective construction, guided fade).
- [38P-6A G4](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): dominant gap is **instructional design shape**, not preservation — “table-first packages” persist with `fullOk: true`.
- Worksheet orientation survives **perfect fidelity** — suggests abstraction shape, not only implementation bugs.
- Sprint 28 cognition fields (`initial_position_prompt`, `misconception_claim`, etc.) **declared but unpopulated** on EV-38M — implementation alone has not activated existing surfaces.

### H2 — Abstraction extension

**Evidence supporting:**

- **7/11** features score counterfactual **B** — partial native support requiring extension (criteria construction, worked judgement integration, guided inquiry, misconception, comparative evaluation, transfer chain, reflection).
- [38I-5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md): **IFP** as smallest change — “conceptual planning layer between LO and DLA” with function-ordered population; ~35% richness from episode structure not realised today.
- DLA `required_materials` + cognition fields cover **artefact types** but not **episode function sequences** ([38I-2 §1.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)).
- Missing types/surfaces: perspective map, criteria construction, fade metadata, reflection material, predict-revise cycle, transfer chain.
- Prompt accretion (IFP in pack prose) may compensate for missing structural episode plan — symptom per 38Q charter.

**Evidence against:**

- Extension could collapse into “longer prompts” without new schema — may not fix **C**-classified features if wrong unit of design remains `activity + materials list`.
- Some **C** features (perspective, fade) may need more than extension — episode-first planning might be redesign (H3 territory).

### H3 — Abstraction misalignment

**Evidence supporting:**

- **3/11** features score **C** — prediction, perspective construction, guided → independent fade — episode-sequence properties with **no material-level home**.
- DLA/GAM unit of design = **activity + parallel `required_materials`**; 38I unit = **coherent instructional episode** with ordered moves ([38I-2 §1.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)).
- [38P-6A](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md): “Worksheet-oriented UX **by design**” — DLA specifies `classification_table`, `decision_table`; render uses “Worksheet” headings for A2/A3.
- `learner_task` format = completion checklist (“Complete the table… Verify… Transfer…”) — **worksheet architecture** ([38Q-1 §3.1](../38Q-1-what-good-looks-like-baseline.md)) even when bodies are rich.
- Blank-sheet question: episode archetypes ([38I-2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)) would likely be first-class; material-type checklist might be downstream realisation only.

**Evidence against:**

- Several Evaluate features **do** have material types (modelling_note, decision_table, template, transfer_prompt) — not wholly wrong abstraction.
- [38I-5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md) argues rich episodes are **feasible without schema expansion** via IFP — suggests misalignment is **layer placement** (missing plan), not necessarily wrong GAM material model.
- H3 overreach risk: conflating “needs episode layer” (H2) with “replace DLA/GAM entirely.”

---

## Provisional verdict

**Not a final recommendation** — 38Q-4/38Q-5 remain open. Confidence reflects §G evidence only.

```text
Current position:

H1 confidence: Low
H2 confidence: High
H3 confidence: Medium
```

**Reading:**

- **H1 Low:** Fidelity proves preservation works; material types exist for several target features. But worksheet orientation and missing episode choreography persist under `fullOk` — implementation improvement alone does not explain the full gap.
- **H2 High:** Strongest fit — DLA/GAM material catalogue is **partially sound**; missing **episode/planning layer** (IFP or equivalent) to sequence functions, fade scaffolds, and perspective/criteria construction before tables. Majority of features score **B**.
- **H3 Medium:** Significant for sequence-native features (**C** ×3) and worksheet-first activity shape; full redesign may be overstated if GAM remains valid **realisation** layer beneath an episode plan ([38I-5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)).

**Leading interim hypothesis:** Extend with an **instructional episode / function plan layer** between LO and DLA (H2), possibly reframing DLA as **episode plan → material obligations** rather than LO → task shell. Test in 38Q-4 whether this differs materially from “better prompts” (prompt accretion challenge).

---

## §H — Counterfactual generation test

For **38I-4 A4** and selected **historical exemplars**, apply this question:

> **Assume DLA and GAM were functioning perfectly according to their current design. Could they naturally generate the exemplar?**

Classify each exemplar:

| Outcome | Meaning | Hypothesis |
|---------|---------|------------|
| **A — Yes** | Abstraction is sound; implementation needs improvement | H1 |
| **B — Partly** | Abstraction requires extension | H2 |
| **C — No** | Abstraction itself is misaligned | H3 |

### Exemplars to test

| Exemplar | Source | Counterfactual outcome (A / B / C) | Evidence notes |
|----------|--------|-------------------------------------|----------------|
| **38I-4 A4 Evaluate learner episode** | [artefact](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | **B** | Material types cover weak/strong, guided table, template, transfer — **observed** on EV-38P-AFTER. Integrated 8-step episode (perspectives → criteria construction → fade → learner reflection) **not** producible from parallel materials alone ([38P-6A G4](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md); §G). |
| **38I-4 A3 Analyse target** | [38I-4 mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | **B** | A3 EV-38P: worked pass + lens table + scenario — types present. Analytic **reasoning arc** and cause taxonomy partly inferred ([38I-5 §2.1 A3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-5-implementation-implications.md)); table renders as “Worksheet” ([38P-6A A3](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)). |
| **Sprint 28 cognitive engagement (D1–D10)** | [38I-1 §3.1/§8](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md) | **C** | Predict-revise, if-then scaffolding, anticipated responses — cognition fields exist in programme vocabulary but **unpopulated** on EV-38M; phased progression flattened ([38I-1 §1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md)). |
| **Sprint 30 PEL reasoning contracts** | [38I-1 §3.3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md) | **B** | `activity_preamble`, `reasoning_orientation`, `self_explanation_prompt` **present** on A4 DLA — partial PEL surface. `metacognition_contract` deferred; bridges between activities not episode-planned. |
| **EV-38P-AFTER A4 (current output)** | `EV-38P-AFTER-*` | N/A — contrast baseline | Worksheet-oriented task list + modular materials despite `fullOk: true`; confirms §G gap is **generation shape**, not fidelity ([38P-6A](../2026-06-05-sprint-38p-instructional-role-fidelity/observations/38P-6A-gam-page-instructional-fidelity-investigation.md)). |

**38Q-1 task:** Complete outcome column and evidence notes before closing 38Q-1. Aggregate pattern feeds 38Q-3 H1/H2/H3 classification.

---

## 7. Preliminary baseline principles (seed for 38Q-2)

These principles are **seeded** in 38Q-1; 38Q-2 will formalise the taxonomy.

1. **Episode > artefact checklist** — Ordering of teaching moves matters more than material type coverage.  
2. **Fade > parallel modules** — Guided-to-independent sequence beats side-by-side table + checklist + template.  
3. **Perspectives before judgement** — Evaluate requires constructed criteria, not strategy menu completion alone.  
4. **Contrast > assertion** — Weak/strong exemplars must show *why*, not label slogans.  
5. **Pause-and-write > read-only** — Narrative episodes embed learner decisions at step boundaries.  
6. **Fidelity is non-negotiable** — Richer generation must not regress `proofOk` or `roleOk`.  
7. **Abstraction before accretion** — Prefer first-class educational structures over prompt compensation.

---

## 8. Relationship to downstream phases

| Phase | Consumes from 38Q-1 |
|-------|---------------------|
| **38Q-2** | Pattern catalogue; teaching vs worksheet definitions; §G feature vocabulary |
| **38Q-3** | Comparison matrix A1–A4; §G/§H hypothesis evidence (H1/H2/H3) |
| **38Q-4** | Constraints; abstraction options; prompt accretion analysis |
| **38Q-5** | Recommended architecture; blank-sheet counterfactual answer |
| **38Q-6** | SC-8 abstraction assessment; SC-9 final recommendation |

---

## 9. Hold conditions

- **Do not reopen** 38M, 38N, 38O, or 38P.  
- **Do not** propose merge, render, or validator changes in 38Q-1.  
- **Do not** conflate role survival (38P) with episode depth (38Q).  
- **Do not presuppose H1** — DLA/GAM improvement is one path, not the default.  
- **Treat 38I** as authoritative for target states — extend, do not replace.

---

## 10. Status and next action

| Field | Value |
|-------|-------|
| Phase | 38Q-1 |
| Status | **COMPLETE** |
| Next action | Proceed to **38Q-2** episode taxonomy and pattern catalogue |

**When 38Q-1 checklist is complete:** Update this document status to **COMPLETE** and index in [observations/README.md](README.md).

**Sprint success criteria fed by 38Q-1:** SC-8 (abstraction assessment) and SC-9 (final recommendation on what abstraction should sit between knowledge and materials) — completed at 38Q-6 closure.
