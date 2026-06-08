# 38Q-2 — Instructional episode taxonomy and pattern catalogue

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Pedagogical taxonomy — docs only; no implementation  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38Q-2  
**Inputs:** [38Q-1 baseline](38Q-1-what-good-looks-like-baseline.md) · [38I-1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md) · [38I-2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38I-4 mock-ups](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) · [38I-4 A4 episode](../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) · [38C-1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)  
**Successor:** 38Q-3 Gap analysis

---

## Scope

Establish a **function-first** taxonomy of teaching architecture — independent of any implementation surface.

| In scope | Out of scope |
|----------|--------------|
| Instructional functions, reasoning moves, transitions | DLA/GAM schema, material types, prompts |
| Archetype function bundles (Understand / Apply / Analyse / Evaluate) | Architecture recommendations, IFP, redesign |
| Worksheet vs teaching discrimination | Code, pack, or renderer changes |

**Design rule (from 38Q-1 §E):** The **function** is primary; **artefacts** are optional realisations. A ranking task is not *evaluative judgement* — it may *realise* it when criteria and justification are structurally required.

---

## Taxonomy design principles

1. **Move-first naming** — categories answer “What educational move is occurring?” not “What artefact exists?”  
2. **Evidence-led inventory** — vocabulary merges [38I-2 §1.3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md), [38I-1 §8](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md), [38C-1 §3](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md), and inflation target states [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md).  
3. **Learner-state change** — each function specifies how the learner’s cognitive position should shift.  
4. **Transitions are first-class** — many “teaching” qualities live in **edges** between moves, not in artefacts ([38Q-1 §G](../38Q-1-what-good-looks-like-baseline.md): fade, perspective-before-judgement).  
5. **R / C / O classification** — adopted from 38I-2 for cross-phase consistency ([§6](#6-function-classification-framework)).

### Category map (organising view only)

```text
Entry & session arc     → Orientation, Framing, Transition
Elicitation             → Activation, Observation, Prediction
Teaching & modelling    → Explanation, Example, Non-example, Worked thinking, Worked judgement
Confrontation & repair  → Cognitive conflict, Misconception confrontation, Revision
Criteria & perspectives → Criteria exposition, Criteria construction, Perspective construction, Comparison
Guided engagement       → Guided inquiry, Guided reasoning, Guided practice
Performance & judgement → Independent performance, Evaluative judgement, Comparative evaluation
Closure                 → Verification, Reflection, Synthesis, Transfer
Meta-progression        → Scaffold fade (cross-cutting)
```

---

## 1. Instructional function catalogue

### 1.1 Entry and session arc

| Function | Purpose | Typical learner-state change | Typical artefacts that may realise it |
|----------|---------|------------------------------|----------------------------------------|
| **Orientation** | Establish *why this episode now* and its place in the session arc | Unmotivated / disoriented → purpose-aware | Session-bridge prose; “where you are” framing; intellectual stake statement ([38I-4 A4 opening](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38C-1 §3.1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Framing** | Bound the problem space with authentic stakes and constraints | Abstract topic → situated problem | Scenario narrative; decision context; analytical question statement ([38I-4 A3 framing](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); Sprint 28 D1 authenticity) |
| **Transition** | Bridge from prior episode — state what was established and what changes | Completed prior move → readiness for next demand | Coherence bridge prose; explicit “next you will…” handoff ([38I-1 §8.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md); [38I-4 A1 transition](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |

### 1.2 Elicitation and preparation

| Function | Purpose | Typical learner-state change | Typical artefacts that may realise it |
|----------|---------|------------------------------|----------------------------------------|
| **Activation** | Elicit relevant prior knowledge before new teaching | Passive → actively retrieving prerequisites | Prior-knowledge prompt; brief recall question ([38I-2 §2.3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md); [38I-4 A1 activation](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |
| **Observation** | Direct attention to evidence or cases *before* explanation or prediction | Unnoticed detail → noticed features | Case vignette for inspection; “look at…” prompt; data display to study ([38I-4 A4 Step 1 households](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); Sprint 28 activate phase) |
| **Prediction** | Commit to a tentative position before evidence or teaching | Uncritical acceptance → accountable hypothesis | Predict-then-continue prompt; initial-position question ([38I-1 §3.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md) D9 revision cycle; [38I-4 A1 activation](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) “write one sentence… keep your answer”) |

### 1.3 Teaching and modelling

| Function | Purpose | Typical learner-state change | Typical artefacts that may realise it |
|----------|---------|------------------------------|----------------------------------------|
| **Explanation** | Teach concepts, relationships, or rules needed for success | Naïve → informed mental model | Connected prose exposition; structured concept teaching ([38I-2 §2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md); [38C-1 §3.1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Example** | Show a positive instance of the target idea | Abstract rule → concrete anchor | Worked positive instance; illustrative case ([38I-4 A1 example](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |
| **Non-example** | Show what the target idea is *not* — boundary clarification | Over-generalisation → discriminating boundaries | Contrast case; “not this” table row; boundary scenario ([38I-4 A1 non-example table](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |
| **Worked thinking** | Make expert **process** visible step-by-step (procedure or analysis) | “What to do?” → “How an expert proceeds” | Stepwise expert walkthrough with intermediate results ([38I-2 Apply/Analyse](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md); [38C-1 §3.2](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); [38I-4 A2 worked run](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |
| **Worked judgement** | Model **quality of evaluative reasoning** — criteria use, trade-offs, rejection | Opinion → criteria-led comparison pattern | Strong vs weak exemplar contrast; expert ranking with trade-offs named ([38I-4 A4 Step 3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38C-1 §3.11](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |

### 1.4 Confrontation and repair

| Function | Purpose | Typical learner-state change | Typical artefacts that may realise it |
|----------|---------|------------------------------|----------------------------------------|
| **Cognitive conflict** | Surface productive tension without immediate resolution | Comfortable certainty → held uncertainty | Competing claims; tension prompt; “both seem true…” setup ([38I-1 §3.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md) D3 productive uncertainty; [38I-4 A4 competing perspectives](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)) |
| **Misconception confrontation** | Name tempting error; prompt evidence-based reconciliation | Misconception held → repaired understanding | False claim + evidence contrast + reconciliation prompt ([38I-4 A1 misconception table](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); [38C-1 §3.6](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); Sprint 28 D5) |
| **Revision** | Compare attempt to model/evidence; update reasoning | Initial attempt fixed → improved reasoning | Compare-and-revise prompt; predict–discuss–revise cycle ([38I-1 §3.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md) D9; [38I-4 A2 revision path](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |

### 1.5 Criteria, perspectives, and comparison

| Function | Purpose | Typical learner-state change | Typical artefacts that may realise it |
|----------|---------|------------------------------|----------------------------------------|
| **Criteria exposition** | Make decision or analysis rules explicit (author-supplied) | Implicit standards → visible dimensions | Rubric prose; lens table; procedure rules list ([38I-4 A4 criteria section](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); [38I-4 A2 procedure rules](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |
| **Criteria construction** | Learner builds or weights criteria for the case | Received rubric → owned evaluative framework | Weighting exercise; “which criterion matters most here?” prompt ([38I-4 A4 Step 2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38Q-1 §G.3](../38Q-1-what-good-looks-like-baseline.md)) |
| **Perspective construction** | Map who sees the problem differently and through which lenses | Single viewpoint → multi-perspective field | Distributional map; stakeholder lenses; pause-and-write on perspective ([38I-4 A4 Step 1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38I-4 A3 comparison dimensions](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |
| **Comparison** | Structure likeness/difference along declared dimensions (analytic) | Unstructured impressions → dimensional contrast | Comparison matrix; typed relationship analysis ([38I-2 Analyse](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md); [38I-4 A3 worked pass](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |

### 1.6 Guided engagement

| Function | Purpose | Typical learner-state change | Typical artefacts that may realise it |
|----------|---------|------------------------------|----------------------------------------|
| **Guided inquiry** | Sustain bounded exploration; keep productive uncertainty alive | Premature closure → explored tensions | Open prompt sequence; “what if…” probes ([38I-4 A4 guided inquiry prompts](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); [38I-2 §4.3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)) |
| **Guided reasoning** | Learner performs intellectual move with heavy scaffolding (hints, partial structure) | Watching expert → attempting with support | Hint-column attempt; partial exemplar rows; staged reasoning prompts ([38I-4 A4 Step 4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38Q-1 §G.6](../38Q-1-what-good-looks-like-baseline.md)) |
| **Guided practice** | Completable structured attempt aligned to success criteria | Untried skill → first successful performance | Scaffolded exercise with explicit expected output ([38C-1 §3.4](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); [38I-4 A2 guided row](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)) |

### 1.7 Performance and judgement

| Function | Purpose | Typical learner-state change | Typical artefacts that may realise it |
|----------|---------|------------------------------|----------------------------------------|
| **Independent performance** | Learner executes target move with reduced scaffolding | Supported attempt → autonomous performance | Open task with success criteria; memo or analysis without hints ([38I-2 §3.4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md); [38I-4 A4 Step 5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)) |
| **Comparative evaluation** | Rank or select among options using explicit criteria | Option list → ordered preference with reasons | Multi-option comparison with justification requirement ([38I-4 A4 guided + independent judgement](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38C-1 §3.11](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Evaluative judgement** | Defend a decision under trade-offs; quality of justification is the object | Analysis complete → committed, revisable recommendation | Decision memo; ranked plan with trade-off naming ([38I-2 §5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md); [38I-4 A4 Steps 5–6 checkpoint](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)) |

### 1.8 Closure

| Function | Purpose | Typical learner-state change | Typical artefacts that may realise it |
|----------|---------|------------------------------|----------------------------------------|
| **Verification** | Check understanding or quality before continuing | Unchecked work → audited against criteria | Self-audit rubric; keyed procedural check; discrimination checklist ([38I-4 verification sections](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); [38C-1 §3.7](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Reflection** | Learner articulates meaning, process, or limits in own words | Task-complete → metacognitively aware | Open reflection questions requiring learner prose ([38I-4 A4 Step 7](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38C-1 §3.8](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Synthesis** | Integrate multiple ideas into one coherent product | Isolated skills → integrated whole | Integrative capstone task spanning prior topics ([38C-1 §3.9](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Transfer** | Apply method or criteria to learner’s own context | Classroom case → personal applicability | Personal-context application prompt with criteria ([38I-2 §5.3 Transfer R for Evaluate](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md); [38I-4 A4 Step 8](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38C-1 §3.10](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |

### 1.9 Meta-progression (cross-cutting)

| Function | Purpose | Typical learner-state change | Typical artefacts that may realise it |
|----------|---------|------------------------------|----------------------------------------|
| **Scaffold fade** | Progressively reduce support within or across episodes | Dependent on hints → increasing independence | Hint-dense early attempt → hint-free later attempt; session-level support reduction ([38C-1 §3.5](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); [38I-2 §1.4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md); [38Q-1 §G.7](../38Q-1-what-good-looks-like-baseline.md)) |

**Taxonomy notes:**

- **Worked judgement** retained as distinct from **Worked thinking** — same family, different learner-state target (quality of justification vs procedure/analytic steps). Evidence: [38I-2 §5.4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) modelling focus shifts to judgement quality at Evaluate.  
- **Criteria construction** retained as distinct from **Criteria exposition** — 38I-4 A4 requires learner weighting, not only delivered rubric ([38Q-1 §G.3](../38Q-1-what-good-looks-like-baseline.md)).  
- **Guided reasoning** spans inquiry + partial-performance moves; broader than **Guided practice** (task completion focus).  
- **Observation** retained separately from **Activation** — observation targets *case evidence*; activation targets *prior knowledge* ([38I-4 A4 Step 1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)).

---

## 2. Instructional transitions

Transitions are **reasoning edges** — they often determine teaching quality more than any single artefact ([38Q-1 native-object synthesis](../38Q-1-what-good-looks-like-baseline.md)).

| Transition | Educational purpose | Evidence in exemplars | Archetype scope |
|------------|--------------------|-----------------------|-----------------|
| **Orient → Activate** | Connect purpose to what learner already knows | [38I-4 A1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md): orientation then “before reading on, write…” | Cross-archetype (**C**) |
| **Activate → Observe** | Move from recall to inspecting new evidence | [38I-4 A4 Step 1](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md): session recap → household cases | Evaluate, Analyse |
| **Observe → Predict** | Commit before teaching closes uncertainty | [38I-4 A1 activation](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); Sprint 28 D9 | Understand, Analyse (**C**) |
| **Predict → Evidence** | Confront hypothesis with teaching or data | Sprint 28 activate→confront→reconcile ([38I-1 §3.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md)) | Cross-archetype (**C**) |
| **Evidence → Revision** | Update position after contrast or model | 28 revision cycle; [38I-4 A2 revision](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | Apply, Understand (**C**) |
| **Explain → Example → Non-example** | Build then bound concept | [38I-4 A1 sequence](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | Understand (**R** bundle) |
| **Example → Misconception confrontation** | Repair before performance | [38I-4 A1 reconciliation prompt](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | Understand (**R** when KM misconceptions) |
| **Criteria exposition → Worked thinking** | Rules before modelled application | [38I-4 A2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) procedure rules → expert run | Apply (**R**) |
| **Worked thinking → Guided practice** | Model before parallel attempt | [38I-2 Apply §3.2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md); [38I-4 A2 guided row](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) | Apply (**R**) |
| **Guided practice → Independent performance** | **Scaffold fade** — defining Apply/Analyse/Evaluate arc | [38I-4 A2/A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md); [38C-1 §3.5](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) | Apply, Analyse, Evaluate (**R** cross-archetype) |
| **Compare → Explain** (analytic) | Move from structured contrast to causal/accounting explanation | [38I-4 A3 worked pass](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) dimensions → transmission narrative | Analyse |
| **Perspective → Criteria** | Establish who is affected before how to judge | [38I-4 A4 Steps 1–2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | Evaluate (**R**) |
| **Criteria → Judgement** (worked) | Show quality application of rubric | [38I-4 A4 Step 3](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | Evaluate (**C**–**R**) |
| **Worked judgement → Guided reasoning** | Exemplar before partial learner ranking | [38I-4 A4 Steps 3–4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | Evaluate (**R**) |
| **Guided reasoning → Independent performance** | Fade to defended recommendation | [38I-4 A4 Steps 4–5](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | Evaluate, Apply, Analyse |
| **Independent performance → Verification** | Quality audit before closure | [38I-4 A4 Step 6](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | All archetypes (**R**) |
| **Verification → Reflection** | Move from “passed check” to metacognitive insight | [38I-4 A4 Steps 6–7](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) | Analyse, Evaluate (**R** at higher demand) |
| **Judgement → Transfer** | Apply same criteria to new context | [38I-4 A4 Step 8](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md); [38I-2 §5.3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) | Evaluate (**R**); Apply/Analyse (**C**) |
| **Transfer → Reflection** | Close loop on personal applicability | [38I-4 A4 Steps 7–8 ordering](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) (reflect may precede or follow transfer by design) | Evaluate |
| **Episode → Episode (Transition)** | Session coherence across activities | [38I-1 §8.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md); [38C session arc](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md) teach→model→practice→check | Cross-archetype session level |

---

## 3. Archetype function mapping

Authority: [38I-2 §2–§5](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md), [38I-2 §6.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md), inflation [38I-4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) target traces.

**Legend:** **R** Required · **C** Common · **O** Optional · **—** not normally part of episode

### 3.1 A1 — Understand (inflation discrimination)

**Planned object (38Q-1):** Concept-discrimination sequence — learner ends able to **discriminate** valid instances and repair confusions ([38I-2 §2.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)).

**Canonical function sequence (38I-4 A1):**

```text
Orientation → Framing → Activation → Explanation → Example → Non-example
  → Misconception confrontation → Guided practice (classification) → Independent performance
  → Verification → Reflection → Transition
```

| Function | Tag | Inflation target evidence |
|----------|:---:|---------------------------|
| Orientation | **R** | [38I-4 A1 orientation](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) |
| Framing | **C** | Bounded “what counts as inflation” |
| Activation | **C** | Prior price-change recall |
| Explanation | **R** | Core definition teaching |
| Example | **R** | £100→£105 basket |
| Non-example | **C** → **R** for confusable topic | Avocado frost case |
| Misconception confrontation | **R**† | CPI vs GDP deflator table + reconciliation |
| Guided inquiry | **O** | Hints on classification items |
| Guided practice | **C** | Labelled classification set |
| Independent performance | **R** | Own-words definition + example/non-example |
| Verification | **R** | Self-check + repair path |
| Reflection | **C** | Policymaker “why general matters” |
| Transition | **C** | Link to Apply measurement |
| Criteria exposition | **—** | Not primary at Understand |
| Worked thinking | **O** | Optional concept walkthrough |
| Evaluative judgement | **—** | |
| Transfer | **O** | Light analogy only ([38I-2 §2.4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)) |

† **R** when KM lists misconceptions ([38I-2 §6.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)).

### 3.2 A2 — Apply (CPI calculation)

**Planned object:** Procedure-practice sequence with **fade** — learner executes method with decreasing scaffold ([38I-2 §3.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)).

**Canonical function sequence (38I-4 A2):**

```text
Orientation → Framing → Activation → Criteria exposition → Worked thinking
  → Guided practice → Independent performance → Verification → Revision
  → Reflection → Transfer → Transition
```

| Function | Tag | Inflation target evidence |
|----------|:---:|---------------------------|
| Orientation | **R** | Measurement episode purpose |
| Framing | **R** | Fixed-basket measurement situation |
| Activation | **O** | CPI recall |
| Criteria exposition | **R** | Procedure rules + common errors |
| Worked thinking | **R** | 2018→2019 expert run |
| Guided practice | **R** | Single-row guided calculation |
| Independent performance | **R** | Full CPI table |
| Verification | **R** | Keyed rates + revision path |
| Revision | **C** | Rework row using model |
| Reflection | **C** | “Which step almost skipped?” |
| Transfer | **C** | New CPI value calculation |
| Transition | **C** | Link to Analyse |
| Scaffold fade | **R** (implicit) | Guided row → full table |
| Evaluative judgement | **O** | Procedural only at Apply boundary |

### 3.3 A3 — Analyse (inflation types/causes — 38I target)

**Planned object:** Analytic-reasoning sequence — learner **compares using lenses** and **justifies** structural conclusions ([38I-2 §4.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)).

**Canonical function sequence (38I-4 A3):**

```text
Orientation → Framing → Activation → Criteria exposition → Explanation
  → Worked thinking → Guided inquiry → Guided practice → Independent performance
  → Verification → Reflection → Transfer → Transition
```

| Function | Tag | Inflation target evidence |
|----------|:---:|---------------------------|
| Orientation | **R** | Why “why/type” follows measurement |
| Framing | **R** | Analytical question on types/causes |
| Activation | **C** | List remembered causes; revise |
| Criteria exposition | **R** | Comparison dimensions table |
| Explanation | **C** | Three types to compare |
| Worked thinking | **R** | Energy shock mini-analysis |
| Guided inquiry | **C** | Coexistence / observability prompts |
| Guided practice | **R** | Partial comparison matrix |
| Independent performance | **R** | Full analysis + justification |
| Verification | **R** | Logic/evidence audit |
| Reflection | **R** | Why analysis holds |
| Transfer | **C** | New case, same frame |
| Comparison | **R** (embedded) | Dimensional contrast throughout |
| Evaluative judgement | **C** | Justification quality, not final policy choice |

### 3.4 A4 — Evaluate (household strategy)

**Planned object:** Judgement sequence — learner **defends a revisable decision** under trade-offs ([38I-2 §5.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md); [38I-4 A4 episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)).

**Canonical function sequence (38I-4 A4 / episode):**

```text
Orientation → Framing → Activation → Perspective construction → Criteria exposition
  → Criteria construction → Worked judgement → Guided inquiry → Guided reasoning
  → Independent performance → Evaluative judgement → Verification → Reflection
  → Transfer → Transition
```

| Function | Tag | Inflation target evidence |
|----------|:---:|---------------------------|
| Orientation | **R** | Evaluate vs Analyse distinction |
| Framing | **R** | Authentic budget decision |
| Activation | **C** | Prior session concepts |
| Perspective construction | **R** | Two households; three lenses; pause-and-write |
| Criteria exposition | **R** | Four decision dimensions |
| Criteria construction | **C** | Weighting sentence ([38I-4 A4 Step 2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)) |
| Worked judgement | **C** | Weak/strong + full A–E economist walkthrough |
| Guided inquiry | **C** | Trade-off tension prompts |
| Guided reasoning | **C** | Partial ranking table |
| Independent performance | **R** | Decision memo |
| Evaluative judgement | **R** | Defended recommendation |
| Verification | **R** | Rubric self-audit |
| Reflection | **R** | Evaluate vs analyse; reversal evidence |
| Transfer | **R** | Personal context application |
| Comparative evaluation | **R** (embedded) | Strategy comparison throughout |
| Cognitive conflict | **C** | Competing household perspectives |

**38I-2 cross-check:** Matches [38I-2 §6.1 Evaluate column](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) with additions **Perspective construction**, **Criteria construction**, **Worked judgement** as explicit inflation-target obligations beyond the base matrix.

---

## 4. Worksheet vs teaching architecture

| Worksheet architecture | Teaching architecture |
|------------------------|----------------------|
| **Activity completion** | **Learner-state transition** — each section changes what the learner can discriminate, execute, analyse, or defend |
| **Artefact coverage** — “include a table, checklist, template” | **Reasoning progression** — ordered moves toward evidence of cognitive demand |
| **Template** as empty form to fill | **Scaffold** that is later **faded** — form follows modelling, not replaces it |
| **Table** as completion grid | **Comparison mechanism** — rows/columns encode **lenses or criteria**, not only data entry |
| **Checklist** as completion tick-boxes | **Verification mechanism** — audit against rubric, repair path, quality dimensions ([38C-1 §3.7](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Material sequence** — parallel list, reorderable without loss | **Instructional sequence** — order carries pedagogy ([38Q-1 §A](../38Q-1-what-good-looks-like-baseline.md)) |
| **Read → complete → verify** generic shell | **Orient → model → try → audit → reflect → apply** arc ([38C-1 §1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Sample output** for copying | **Exemplar contrast** for quality discrimination (weak vs strong) |
| **Consolidation** as designer summary to read | **Reflection** as learner-generated synthesis |
| **Scenario** as menu of items | **Perspective construction** as structured who/lens map before judgement |
| **Pre-filled ratings** | **Guided reasoning** with learner-supplied scores and justifications |
| **Capstone paragraph task** | **Evaluative judgement** with criteria, trade-offs, transfer **R** |
| **Single transfer sentence** | **Transfer chain** — same criteria reapplied with verification |
| **Implicit difficulty rise** | **Scaffold fade** explicitly designed ([38C-1 §3.5](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Structure = pedagogy assumed** | **Structure ≠ pedagogy** — explicit teaching moves required ([38I-1 §8.6](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md)) |

**Discriminator test (from 38Q-1 §E.3):** If reordering blocks without pedagogical loss → worksheet architecture. If order encodes reasoning → teaching architecture.

---

## 5. Episode structure patterns (function-only)

Rich episodes describable **without material vocabulary**:

### 5.1 Understand — discrimination episode

```text
Orient → Frame → Activate → Explain → Exemplify → Contrast (non-example)
  → Confront misconception → Guide classification → Perform independently
  → Verify (with repair) → Reflect → Transition
```

### 5.2 Apply — procedural fade episode

```text
Orient → Frame → State rules → Model expert run → Guide partial attempt
  → Perform full attempt → Verify → (Revise) → Reflect → (Transfer) → Transition
```

### 5.3 Analyse — lens-based reasoning episode

```text
Orient → Frame analytical question → State lenses → (Teach needed relations)
  → Model analytic pass → Inquire → Guide structured comparison
  → Perform justified analysis → Verify → Reflect → (Transfer) → Transition
```

### 5.4 Evaluate — judgement episode

```text
Orient → Frame decision → (Activate) → Construct perspectives → State criteria
  → (Weight criteria) → Model quality judgement → Explore trade-offs
  → Guide partial evaluation → Perform defended recommendation
  → Audit against rubric → Reflect → Transfer → (Transition)
```

### 5.5 Session arc (cross-archetype)

```text
Understand episode → Apply episode → Analyse episode → Evaluate episode
  with Transition bridges and session-level Scaffold fade
```

([38C-1 §1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md); [38I-2 §6.3](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md))

---

## 6. Function classification framework

### 6.1 Primary tags (38I-2)

| Tag | Meaning | Use in 38Q-3+ |
|-----|---------|---------------|
| **R** | Required — high-quality episode normally **fails** without this move | Gap = critical |
| **C** | Common — frequently valuable; context-dependent | Gap = significant |
| **O** | Optional — strengthens when topic/risk warrants | Gap = minor |
| **—** | Not normally part of this archetype | N/A |

### 6.2 Supplementary tags (38Q extension for gap analysis)

| Tag | Meaning |
|-----|---------|
| **E** | **Embedded** — not a separate beat but required throughout (e.g. Comparison within Analyse) |
| **T** | **Transition-critical** — quality lives primarily in the edge, not the node (e.g. Guided → Independent) |
| **†** | **Conditional R** — becomes Required when KM or LO triggers (misconception present, Evaluate LO, etc.) |

### 6.3 Master function × archetype matrix

Consolidates [38I-2 §6.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) with 38Q extensions (**Perspective construction**, **Criteria construction**, **Worked judgement**, **Scaffold fade**).

| Function | Understand | Apply | Analyse | Evaluate |
|----------|:----------:|:-----:|:-------:|:--------:|
| Orientation | R | R | R | R |
| Framing | C | R | R | R |
| Activation | C | O | C | C |
| Observation | O | O | C | C |
| Prediction | O | O | C | O |
| Explanation | R | C | C | C |
| Example | R | — | C | C |
| Non-example | C† | O | C | O |
| Misconception confrontation | C† | O | C | C |
| Cognitive conflict | O | O | C | C |
| Criteria exposition | O | R | R | R |
| Criteria construction | — | O | O | C |
| Perspective construction | — | — | C | R |
| Comparison | O | O | R | C |
| Worked thinking | O | R | R | C |
| Worked judgement | — | — | O | C |
| Guided inquiry | O | O | C | C |
| Guided reasoning | C | C | C | C |
| Guided practice | C | R | R | C |
| Scaffold fade | C | R | R | R |
| Independent performance | R | R | R | R |
| Comparative evaluation | — | O | C | R |
| Evaluative judgement | — | O | C | R |
| Verification | R | R | R | R |
| Revision | O | C | C | C |
| Reflection | C | C | R | R |
| Synthesis | O | O | C | C |
| Transfer | O | C | C | R |
| Transition | C | C | C | O |

---

## 7. End-of-phase synthesis

### 7.1 Functions consistently appearing in historical “what good looks like”

Across [38I-1 §8](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-1-prior-pedagogical-journey-review.md), [38C-1](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md), and [38I-4](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) targets, the **stable core** is:

| Tier | Functions | Evidence |
|------|-----------|----------|
| **Universal (all archetypes)** | Orientation, Verification, Independent performance | [38I-2 §6.1](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) all **R** |
| **Near-universal** | Framing, Worked thinking (Apply+), Guided practice, Reflection (Analyse+) | 38C minimum workbook; 38I-4 all activities |
| **Self-study programme core** | Explanation (Understand+), Criteria exposition (Apply+), Misconception confrontation (when KM), Transfer (Evaluate **R**) | 28–31 recovery; 38C R1–R7 |
| **Evaluate capstone core** | Perspective construction, Worked judgement, Comparative evaluation, Evaluative judgement, Transfer | [38I-4 A4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md) |
| **Historically valued but episodically absent in thin output** | Prediction, Revision, Guided inquiry, Scaffold fade, Criteria construction, Cognitive conflict | [38Q-1 §C](../38Q-1-what-good-looks-like-baseline.md) recovery table |

### 7.2 Functions responsible for worksheet vs teaching difference

| Discriminating function / transition | Why it separates genres |
|--------------------------------------|-------------------------|
| **Scaffold fade** (+ Guided → Independent transition) | Worksheet: flat support. Teaching: independence is **earned** ([38C-1 §3.5](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Worked thinking / Worked judgement** before performance | Worksheet: blank grid. Teaching: modelled intellectual move first |
| **Misconception confrontation / Cognitive conflict** | Worksheet: assumes correct first pass. Teaching: names failure modes |
| **Criteria exposition + Comparative evaluation** | Worksheet: rank or fill. Teaching: justify with visible dimensions |
| **Perspective construction → Criteria → Judgement chain** | Worksheet: jump to recommendation. Teaching: builds decision field |
| **Verification as quality audit** | Worksheet: tick completion. Teaching: rubric + repair ([38C-1 §3.11](../2026-06-04-sprint-38c-self-study-workbook-pedagogy/observations/38C-1-workbook-pedagogy-model.md)) |
| **Reflection (learner-generated)** | Worksheet: read designer summary. Teaching: learner articulates limits |
| **Transfer with criteria reapplication** | Worksheet: optional sentence. Teaching: required personal defence |
| **Instructional sequence (transitions)** | Worksheet: reorderable materials. Teaching: order is pedagogy ([38Q-1](../38Q-1-what-good-looks-like-baseline.md)) |

**Strongest single discriminator:** **Ordered reasoning progression with fade** — especially **Worked (thinking/judgement) → Guided → Independent → Verify** — absent in worksheet architecture, **R** in Apply/Analyse/Evaluate targets.

### 7.3 Functions operating primarily as transitions

These functions **exist as nodes** in catalogues but their **pedagogical value is edge-weighted**:

| Transition-dominant pattern | Node labels | Edge that carries teaching |
|----------------------------|-------------|----------------------------|
| **Scaffold fade** | Guided practice, Independent performance | Guided → Independent |
| **Predict–revise cycle** | Prediction, Revision | Predict → Evidence → Revision |
| **Perspective before judgement** | Perspective construction, Evaluative judgement | Perspective → Criteria → Judgement |
| **Model-before-parallel** | Worked thinking, Guided practice | Worked → Guided |
| **Quality before audit** | Independent performance, Verification | Perform → Verify |
| **Decision before personal apply** | Evaluative judgement, Transfer | Judgement → Transfer |
| **Session coherence** | Transition | Episode → Episode |

**Implication for 38Q-3:** Gap analysis should score **transition presence**, not only **function node presence** — consistent with 38Q-1 finding that parallel materials can cover nodes while missing choreography.

---

## 8. Success condition — function-only episode description

**Example — Evaluate capstone (38I-4 A4) in taxonomy terms only:**

```text
Orient the learner to the evaluative demand distinct from prior analysis.
Frame an authentic household decision under inflation pressure.
Activate prior distributional concepts.
Construct perspectives on who gains and loses through explicit lenses; pause for learner writing.
Exposit decision criteria; prompt learner to weight criteria for this case.
Model worked judgement contrasting weak slogan vs strong criteria-led reasoning across options.
Guide inquiry into trade-off tensions.
Guide partial comparative evaluation with justified scores.
Require independent evaluative judgement in a defended recommendation.
Verify against a quality rubric; require repair if audit fails.
Prompt reflection on bias, reversal evidence, and evaluate-vs-analyse distinction.
Transfer the same criteria to the learner’s own context.
Close the session arc.
```

No material type, table, template, checklist, or implementation structure is **required** to specify this episode — only **functions and transitions**.

---

## 9. Relationship to downstream phases

| Phase | Consumes from 38Q-2 |
|-------|---------------------|
| **38Q-3** | Function × archetype matrix; transition list; worksheet vs teaching discriminators |
| **38Q-4** | Classification framework (R/C/O/E/T); function-only episode patterns |
| **38Q-5** | Native instructional object vocabulary for recommendation |
| **38Q-6** | SC-2 (taxonomy distinguishes teaching from worksheet architecture) |

---

## 10. Hold conditions

- Taxonomy only — **no** implementation, IFP, or redesign proposals.  
- [38I-2](../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) vocabulary preferred; extensions justified in §1 notes.  
- Inflation anchor only — cross-domain validation remains for later programme work.

---

## 11. Status

| Field | Value |
|-------|-------|
| Phase | 38Q-2 |
| Status | **COMPLETE** |
| Next | **38Q-3** — gap analysis vs EV-38P-AFTER using this taxonomy |
