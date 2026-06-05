# Slice 38I-3 — KM/LO → Episode Mapping

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Mapping exercise only — no schema, pack, ACM, or implementation changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38I-3  
**Inputs:** [38I-2 instructional episode model](38I-2-instructional-episode-model.md) · [38I-1 journey review](38I-1-prior-pedagogical-journey-review.md) · [38G-2 ACM §3–6](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md)

**Anchor artefacts (read-only):** [EV-38H-AFTER-knowledge-model.json](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/artefacts/EV-38H-AFTER-knowledge-model.json) · [EV-38G-AFTER-dla-learning-activities.json](../../2026-06-04-sprint-38g-activity-component-quality/artefacts/EV-38G-AFTER-dla-learning-activities.json)

---

## Guiding question

> Given the episode model in 38I-2, **how much of that model can already be realised** using existing KM and LO affordances?

**Short answer:** **Most Understand and Apply** episode functions can be **population-guided** from current KM+LO. **Analyse** is **well supported** when relationships and groupings are present. **Evaluate** has **partial KM coverage** — LO can select the archetype, but **criteria, perspectives, and trade-offs** must be **authored from LO statement + relationships + brief**, not read from dedicated KM slots. **Scaffold fading** and **anticipated responses** are the weakest mappings — session-level inference, not KM/LO fields.

---

## Section 1 — Mapping principles

### 1.1 Conceptual chain (fixed structures)

```text
Knowledge Model (KM)
        ↓  supplies concept/process/misconception substance
Learning Outcomes (LO)
        ↓  selects primary cognitive demand + output intent
Episode Archetype (38I-2)
        ↓  determines required instructional function sequence
Instructional Functions (38I-2 moves)
        ↓  specifies what must be taught/modelled/checked
ACM Realisation (38G-2 — frozen)
        ↓  maps functions to generation components/fields/materials
DLA → GAM → Workbook Page
```

**38I-3 scope:** KM → LO → Archetype → **Instructional Functions**. ACM is **downstream realisation reference only** — not redesigned.

### 1.2 Separation of roles

| Layer | Decides | Does not decide |
|-------|---------|-----------------|
| **KM** | *What world knowledge exists* — concepts, relations, processes, misconceptions | Episode sequence, cognitive demand, learner task wording |
| **LO** | *What performance is required* — primary archetype, concept scope, output shape | Full episode choreography (that is archetype + DLA) |
| **Archetype** | *Which instructional moves are required/common* | Material types, field names |
| **ACM** | *How moves appear in activities/materials* | KM/LO schema |

### 1.3 Population vs selection

| Operation | Driven by | Example |
|-----------|-----------|---------|
| **Archetype selection** | LO properties (especially cognitive demand) | `cognitive_level: Evaluate` → Evaluate archetype |
| **Function population** | KM affordances + LO concept scope | `misconceptions[]` → Misconception challenge content |
| **Function obligation upgrade** | KM triggers on mapped concepts | Misconception listed for LO concepts → Misconception challenge **R** (38I-2 †) |
| **Gap fill** | Brief + LO statement + author inference | Evaluate criteria when KM has no `criteria` slot |

### 1.4 Multi-source rule

A single instructional function may draw from **multiple KM affordances** and **LO properties**:

```text
Analyse → Criteria exposition
  ← relationships (contrast_with, affects)
  ← groupings (comparison sets)
  ← LO related concepts (scope boundary)
```

### 1.5 Non-expansion rule

Current KM top-level keys (fixed): `concepts`, `relationships`, `groupings`, `processes`, `misconceptions`.  
Current LO outcome fields (pack §4 intent): `statement`, related concepts, `cognitive_level`, notes; container `outcomes[]`, `alignment_notes`.

**No new affordances proposed in this slice.**

---

## Section 2 — LO → archetype selection

### 2.1 Primary selector: cognitive demand

**Rule LO-ARC-01:** Each activity episode has **one primary archetype** taken from the **highest cognitive demand** among its `mapped_learning_outcomes` for that episode.

| LO `cognitive_level` (normalized) | Primary archetype |
|-----------------------------------|-------------------|
| Understand · Remember · Know (discouraged verb) | **Understand** |
| Apply · Use · Implement · Calculate · Demonstrate | **Apply** |
| Analyse · Analyze · Compare · Interpret · Classify · Assess* | **Analyse** |
| Evaluate · Judge · Critique · Justify · Recommend · Defend | **Evaluate** |

\* **Assess** is ambiguous — see edge cases §2.4.

**Rule LO-ARC-02:** If `cognitive_level` is **missing**, infer from **action verb** in `statement` using table above; default conservative bias toward **Understand** only when verb is vague.

**Rule LO-ARC-03:** If an activity maps **multiple LOs** at different levels, primary archetype = **max level** (Evaluate > Analyse > Apply > Understand).

### 2.2 Secondary selectors (modulate function emphasis, not archetype)

| LO property | Effect on episode |
|-------------|-------------------|
| **Related concepts** (concept focus) | Scopes Explanation, Example, Misconception challenge to named concepts |
| **Statement action verb** | Confirms archetype; shapes Independent practice and expected output |
| **Outcome intent** (in statement/notes) | Output shape: classification vs procedure vs justification vs plan |
| **Progression** (ordinal position in `outcomes[]` or session notes) | Scaffold fading across **session**; Transition content |
| **Transfer expectations** (verbs: personal, household, own context; LO notes) | Elevates Transfer from O/C to **R** within Apply/Analyse/Evaluate |

### 2.3 Selection decision flow

```text
For each episode (activity):
  1. Collect mapped LOs
  2. Normalize cognitive_level (or infer verb)
  3. primary_level = max(levels)
  4. archetype = map(primary_level)  [LO-ARC-01]
  5. Apply KM triggers (§3.4) to upgrade function tags R/C/O
  6. If transfer cues in LO/brief → flag Transfer emphasis
```

### 2.4 Edge cases

| Case | Rule | Inflation example |
|------|------|-------------------|
| **Assess vs Evaluate** | If statement requires **criteria-based judgement** or **strategy choice** → **Evaluate**; if **structured comparison** without recommendation → **Analyse** | A3 “Assess impacts…” → **Analyse**; “Evaluate strategies to manage…” → **Evaluate** |
| **Explain at capstone** | Lower-level LO on high episode position does **not** downgrade archetype | A4 maps Explain + Analyze + Assess + **Evaluate** → primary **Evaluate** |
| **Apply disguised as Analyse** | Verb “analyze” but LO only requires formula application → **Apply** (inspect outcome intent) | CPI rate calculation without interpretation → Apply |
| **Understand-only session slice** | Early LOs at Understand with no higher LO on same episode → **Understand** | First exposure to inflation definition |
| **Missing cognitive_level** | Verb inference; flag confidence **low** for author review | Legacy LO objects with statement only |
| **Multi-LO Evaluate + Understand on closure** | Archetype **Evaluate**; Understand LO supplies **Activation** only, not teaching-only episode | A4 consolidation — risk: collapses to summary (H-04) |
| **cognitiveEmphasis (pack option)** | Biases LO generation distribution; does **not** override per-outcome level on mapped activity | `application` emphasis → more Apply LOs, not all Apply archetypes |

### 2.5 LO properties → archetype quick reference

| Signal | Understand | Apply | Analyse | Evaluate |
|--------|:----------:|:-----:|:-------:|:--------:|
| cognitive_level | ✓ primary | ✓ primary | ✓ primary | ✓ primary |
| concept-heavy related concepts | ✓ | ○ | ○ | ○ |
| process verb / calculation outcome | ○ | ✓ | ○ | ○ |
| compare / interpret / trend language | ○ | ○ | ✓ | ○ |
| justify / recommend / strategy choice | ○ | ○ | ○ | ✓ |
| personal/household transfer in statement | ○ | C | C | R |

---

## Section 3 — KM affordance → instructional function mapping

### 3.1 KM affordance catalogue (fixed)

| Affordance | Typical content | Programme role |
|------------|-----------------|----------------|
| **concepts** + definitions | Named ideas + glosses | Teaching substance |
| **relationships** | typed links (measures, contrasts_with, affects, …) | Structure for analysis and criteria |
| **groupings** | named sets of concepts | Framing, classification, comparison |
| **processes** | named procedures + steps | Method modelling |
| **misconceptions** | false beliefs + correction | Error confrontation |

### 3.2 Understand archetype — function population

**Required functions (38I-2):** Orientation, Explanation, Example, Independent classification, Verification.

| Instructional function | KM affordances | LO properties | Notes |
|------------------------|----------------|---------------|-------|
| Orientation | groupings (session chunk) | progression, related concepts | LO positions episode in arc |
| Framing | groupings | related concepts | e.g. “Inflation Measurement Methods” |
| Activation | concepts (prior topics) | progression > 1 | Earlier concepts in same KM |
| Explanation | **concepts** + definitions | related concepts | Core population source |
| Example | concepts, relationships | statement scope | Positive instance |
| Non-example | **relationships** (`contrasts_with`), misconceptions | related concepts | CPI vs GDP deflator |
| Misconception challenge | **misconceptions** | related concepts | **R** when misconception maps to LO concepts |
| Guided classification | groupings, relationships | — | Partial table scaffold |
| Independent classification | concepts, groupings | statement, outcome intent | Learner sorts/labels |
| Verification | misconceptions (as distractors), concepts | — | Self-check discrimination |
| Reflection | concepts | — | Self-explanation prompt content |
| Transition | groupings, relationships | progression | Bridge to Apply |

### 3.3 Apply archetype — function population

**Required functions:** Orientation, Framing, Criteria exposition (process), Worked thinking, Guided practice, Independent practice, Verification.

| Instructional function | KM affordances | LO properties | Notes |
|------------------------|----------------|---------------|-------|
| Orientation | processes (name) | statement | What method is being applied |
| Framing | concepts, groupings | related concepts | Context for application |
| Criteria exposition | **processes.steps** | statement verb | Steps = procedure criteria |
| Worked thinking | **processes** | — | “Calculating CPI Inflation” steps |
| Guided practice | processes, concepts | outcome intent | Partial worksheet |
| Independent practice | processes | statement | Full learner execution |
| Verification | processes.steps | — | Checklist against steps |
| Revision | processes, misconceptions | — | Compare to model |
| Transfer | concepts, processes | transfer cues in LO | New numbers/context |
| Reflection | processes | — | Process meta-cognition |

### 3.4 Analyse archetype — function population

**Required functions:** Orientation, Framing, Criteria exposition, Worked thinking, Guided practice, Independent practice, Verification, Reflection.

| Instructional function | KM affordances | LO properties | Notes |
|------------------------|----------------|---------------|-------|
| Framing | relationships, groupings | statement | Analytical question |
| Criteria exposition | **relationships** (types), **groupings** | related concepts | Dimensions for comparison |
| Explanation | relationships, concepts | — | Teach lenses before analysis |
| Worked thinking | relationships, processes | — | Model one analytic pass |
| Guided inquiry | relationships (`contrasts_with`) | — | Productive uncertainty |
| Guided practice | relationships, groupings | — | Partial matrix |
| Independent practice | relationships, concepts, groupings | outcome intent | Justified analysis |
| Misconception challenge | misconceptions | — | Wrong inference patterns |
| Verification | relationships | — | “Did you cite correct relation?” |
| Reflection | relationships | — | Why analysis holds |
| Transfer | relationships, groupings | transfer cues | New case, same frame |

### 3.5 Evaluate archetype — function population

**Required functions:** Orientation, Framing, Criteria exposition, Independent practice, Evaluative judgement, Verification, Reflection, Transfer.

| Instructional function | KM affordances | LO properties | Notes |
|------------------------|----------------|---------------|-------|
| Framing | concepts (stakes), relationships (`affects`) | statement | Decision context |
| Criteria exposition | relationships, groupings, misconceptions | **statement + notes** | **Weak KM slot** — criteria authored from LO+brief |
| Explanation | concepts, relationships | — | Perspectives/constraints |
| Worked thinking (exemplar) | relationships, misconceptions | — | Strong/weak judgement exemplar |
| Guided inquiry | relationships (trade-offs) | — | Explore tensions |
| Evaluative judgement | relationships, misconceptions | statement | Justified choice |
| Verification | misconceptions, relationships | — | Rubric audit |
| Reflection | relationships, concepts | — | Trade-off reflection |
| Transfer | concepts (household), relationships (`affects`) | **transfer in LO** | Personal budget — inflation anchor |
| Synthesis | groupings, multiple concepts | multi-LO map | Integrate session ideas |

### 3.6 KM trigger table (function obligation upgrades)

| KM signal (on LO-related concepts) | Upgraded function | Archetypes affected |
|------------------------------------|-------------------|---------------------|
| `misconceptions[]` references concept | Misconception challenge → **R** | Understand; C→R Analyse/Evaluate |
| `relationships.type = contrasts_with` | Non-example, Criteria exposition | Understand, Analyse |
| `processes[]` with ≥3 steps | Worked thinking → **R** | Apply |
| `groupings[]` spanning LO concepts | Guided classification, Criteria exposition | Understand, Analyse |
| `relationships.type = affects` + household concepts | Transfer → **R** | Evaluate |
| No misconceptions for confusable pair | Non-example via **relationships** only | Understand — **gap risk** |

### 3.7 Instructional function → ACM realisation (reference bridge)

Frozen [38G-2](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md) — **not** redesigned; shows how populated functions reach DLA/GAM today.

| Instructional function (38I-2) | ACM component(s) | Typical DLA/GAM surfaces |
|-------------------------------|------------------|--------------------------|
| Orientation | Orientation | `activity_preamble`, `study_orientation` |
| Activation | Knowledge activation | `prior_knowledge_activation` |
| Explanation | Concept elucidation | exposition in materials, `knowledge_summary` upstream |
| Example / Non-example | Concept elucidation, Misconception handling | `worked_example`, contrast prose |
| Misconception challenge | Misconception handling | `support_note`, `task_cards`, `prompt_set` |
| Criteria exposition | Guidance, Concept elucidation | `reasoning_orientation`, table headers |
| Worked thinking | Worked reasoning | `worked_example`, `modelling_note` |
| Guided / Independent practice | Practice, Guidance | `learner_task`, scenarios, tables |
| Verification | Verification | `checklist`, `prompt_set`, `task_cards` |
| Reflection | Reflection | `self_explanation_prompt`, non-spoiler `consolidation_summary` |
| Revision | (28 cycle; partial ACM) | compare prompts, `scaffold_hint_sequence` |
| Evaluative judgement | Practice, Reflection | ranking tasks, rubric materials |
| Transfer | Transition + Practice | `transfer_or_application_task`, personal scenario |
| Transition | Transition | `intellectual_coherence_bridge` |

---

## Section 4 — Coverage analysis

### 4.1 By archetype

| Archetype | Coverage | KM strengths | KM gaps (no new fields) |
|-----------|----------|--------------|-------------------------|
| **Understand** | **Strong** | concepts, groupings, misconceptions, contrast relationships | Fine-grained examples/non-examples need author selection among concepts |
| **Apply** | **Strong** | processes with steps | Context framing relies on concepts + brief; no `context` slot |
| **Analyse** | **Strong** | relationships, groupings, misconceptions | Criteria lenses inferred from relationship types — not explicit rubric objects |
| **Evaluate** | **Partial** | affects-chains, misconceptions, household concepts | **No** `criteria`, `perspectives`, `trade_offs`, or `consequences` slots; judgement dimensions come from LO+brief inference |

### 4.2 By KM affordance

| Affordance | Understand | Apply | Analyse | Evaluate | Overall |
|------------|:----------:|:-----:|:-------:|:--------:|:-------:|
| concepts | **Strong** | C | C | C | **Strong** |
| relationships | C | O | **Strong** | **Strong** | **Strong** |
| groupings | **Strong** | O | **Strong** | C | **Strong** |
| processes | O | **Strong** | C | O | **Strong** (Apply); **Weak** (Evaluate) |
| misconceptions | **Strong** | O | C | C | **Partial** — sparse KM common |

### 4.3 By LO property

| LO property | Coverage utility | Limitation |
|-------------|------------------|------------|
| cognitive_level | **Strong** — archetype selection | Not always present on generated LOs; verb inference needed |
| related concepts | **Strong** — scopes KM reads | May be prose list, not normalized IDs |
| statement / outcome intent | **Strong** — output shape, edge disambiguation | Evaluate criteria often only here |
| progression | **Partial** — session fading | Not a guaranteed structured field; often implicit in outcome order |
| alignment_notes | **Common** — session-level intent | Not wired to per-episode function checklist |

### 4.4 Inflation anchor read (`EV-38H` KM + `EV-38G` DLA)

| Episode (inferred) | Mapped LO verb | Archetype (rules) | KM population adequacy |
|------------------|----------------|-------------------|------------------------|
| A1 Explain inflation | Explain | Understand → mixed Apply (worked example) | **Strong** — concepts, causes via relationships |
| A2 Analyze CPI | Analyze | Analyse | **Strong** — CPI concept, processes for calculation |
| A3 Assess household impacts | Assess | Analyse | **Strong** — Fixed/Variable income, affects relationships, scenarios |
| A4 Consolidation + Evaluate strategies | Evaluate (+ lower LOs) | **Evaluate** | **Partial** — KM lacks explicit strategy criteria; relationships support trade-offs; **H-04** realisation gap |

**Programme note:** KM now flows through harness (`EV-38H-AFTER-knowledge-model.json`); DLA exploitation improved in 38G but **Evaluate episode shape** still not fully realised on A4.

---

## Section 5 — Rich episode feasibility assessment

**Question:** Are existing KM+LO structures **sufficient** to generate **substantially richer** episodes than current inflation outputs?

| Richness dimension | KM+LO sufficient? | Verdict | Evidence |
|--------------------|-----------------|---------|----------|
| **Worked thinking** | **Yes** | **Feasible** | `processes.steps`; relationships for analytic modelling; 38G A1 worked_example |
| **Misconception handling** | **Conditional** | **Feasible when KM lists misconceptions** | Inflation KM has CPI/GDP deflator misconception; sparse KM → weak |
| **Verification** | **Yes** | **Feasible** | Concepts/misconceptions enable checks; LO outcome intent defines evidence — checklist design is DLA |
| **Reflection** | **Partial** | **Feasible** | KM supplies content prompts; metacognitive depth from LO level + archetype, not KM field |
| **Transfer** | **Partial** | **Feasible for household/policy topics** | LO transfer verbs + `affects` relationships; no `learner_context` slot |
| **Scaffold fading** | **Weak** | **Partially feasible** | **Not a KM/LO field** — inferred from LO order/progression + session design; 38G `scaffold_hint_sequence` per activity but not session fade contract |
| **Evaluate judgement** | **Partial** | **Gap remains** | LO selects Evaluate archetype; KM does not supply criteria/perspectives objects — author must construct from relationships + brief |

### 5.1 Overall feasibility verdict

| Compared to `EV-38G-AFTER` | Assessment |
|----------------------------|------------|
| **Understand / Apply / Analyse episodes** | KM+LO **are sufficient** to drive **substantially richer** episodes than 38F-style LO→task shells — **if** DLA follows 38I-2 function sequences and reads KM triggers |
| **Evaluate episodes** | KM+LO **partially sufficient** — archetype selectable, population **incomplete** without LO/brief-authored criteria; explains H-04 |
| **Session-level scaffold fading** | **Not KM/LO sufficient alone** — requires cross-episode design rules (38I-4 mock-ups), not new schema |

### 5.2 What richer means (non-implementational)

Richer ≠ more material types. Richer = **ordered instructional moves** populated from KM substance:

```text
38F pattern:  LO statement → learner_task (thin)
38G pattern:  LO + KM hints → components (better)
38I target:   LO → archetype → function sequence → KM-populated moves → ACM realisation
```

**38G already demonstrates** partial realisation (preambles, worked_example, scaffold_hint_sequence, cognition fields). **38I mapping** shows remaining richness is **primarily Evaluate criteria** and **session fading**, not missing concept inventory on inflation anchor.

---

## Section 6 — Implications for 38I-4

### 6.1 Target-state mock-up priorities (Inflation)

| Priority | Episode | Why |
|----------|---------|-----|
| **P1** | **Evaluate** — personal budget strategy judgement | Closes H-04; tests partial KM coverage + LO-authored criteria |
| **P2** | **Understand** — CPI vs GDP deflator discrimination | Exercises misconceptions + contrasts_with |
| **P3** | **Apply** — CPI calculation procedure | Exercises processes.steps + worked thinking fade |
| **P4** | **Analyse** — household comparison | Exercises affects relationships + groupings |

### 6.2 Mock-up must show per episode

1. **Primary archetype** — with LO-ARC rule citation  
2. **Function sequence** — R/C/O tags from 38I-2  
3. **KM read list** — which concepts/relationships/processes/misconceptions populate each **R** function  
4. **LO properties used** — cognitive_level, related concepts, transfer cues  
5. **Gap callouts** — where LO/brief fills missing KM (especially Evaluate criteria)  
6. **Contrast with `EV-38G-AFTER`** activity — what richer episode adds  

### 6.3 Review checklist for 38I-4 (from this mapping)

| Check | Source |
|-------|--------|
| Archetype matches max LO level | §2.1 |
| Every **R** function has KM and/or LO population source | §3.2–3.5 |
| Misconception challenge present when KM lists relevant misconception | §3.6 |
| Evaluate episode includes criteria exposition **authored** even if not in KM | §4.1 |
| Transfer explicit when LO/brief requires personal context | §2.2 |
| Session shows fading across ≥2 episodes | §5.1 scaffold fading |
| No LO→task shell (38G anti-pattern) | §5.2 |

### 6.4 Open questions for 38I-4 to resolve exemplarily

| # | Question | Mock-up should demonstrate |
|---|----------|---------------------------|
| 1 | Evaluate criteria without KM `criteria` slot | Criteria exposition from relationships + LO statement |
| 2 | A4 multi-LO capstone | Evaluate archetype with lower LOs as Activation only |
| 3 | Assess → Analyse vs Evaluate disambiguation | A3 vs A4 side-by-side |
| 4 | Minimum verification depth per archetype | Checklist vs keyed vs exemplar contrast |

### 6.5 Deferred to 38I-5 (not 38I-4)

- DLA/GAM field-level mapping changes  
- Pack prompt obligations  
- Harness assertions for KM→function coverage  

---

## Mapping model summary diagram

```text
┌─────────────────────────────────────────────────────────────┐
│ KNOWLEDGE MODEL (fixed keys)                                │
│  concepts · relationships · groupings · processes ·         │
│  misconceptions                                           │
└───────────────────────────┬─────────────────────────────────┘
                            │ populate function CONTENT
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ LEARNING OUTCOMES                                           │
│  cognitive_level · statement · related concepts · notes     │
└───────────────────────────┬─────────────────────────────────┘
                            │ select ARCHETYPE + output shape
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ EPISODE ARCHETYPE (38I-2)                                   │
│  Understand | Apply | Analyse | Evaluate                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ require FUNCTION sequence
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ INSTRUCTIONAL FUNCTIONS                                     │
│  Explanation · Worked thinking · Misconception challenge · …  │
└───────────────────────────┬─────────────────────────────────┘
                            │ realise via frozen ACM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ ACM → DLA → GAM → Workbook Page                             │
└─────────────────────────────────────────────────────────────┘
```

---

## References

- [38I-2 instructional episode model](38I-2-instructional-episode-model.md)
- [38I-1 prior pedagogical journey review](38I-1-prior-pedagogical-journey-review.md)
- [38G-2 activity component model](../../2026-06-04-sprint-38g-activity-component-quality/observations/38G-2-activity-component-model.md)
- [38H-1 analysis — H-04](../../2026-06-05-sprint-38h-workbook-realisation-fidelity/observations/38H-1-workbook-realisation-fidelity-analysis.md)
- Pack §3 Model Knowledge · §4 Define Learning Outcomes — `domain-learning-design-step-patterns.md`
