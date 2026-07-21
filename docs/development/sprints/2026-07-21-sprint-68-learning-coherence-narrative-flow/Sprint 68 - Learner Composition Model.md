# Sprint 68 – Learner Composition Model

**Status:** Design validation (pre-implementation)  
**Reference case:** Activity 1 — *Defining Heteroscedasticity and Homoscedasticity*  
**Fixture:** `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json`  
**Related:** [Sprint 68 - Learner Renderer Composition Principles.md](Sprint%2068%20-%20Learner%20Renderer%20Composition%20Principles.md)

---

## Purpose

This document defines a minimal **renderer-level vocabulary** for composing authoritative PRISM artefacts into coherent learner experiences.

It is a design artefact for Sprint 68. It does not introduce PRISM schema fields, pipeline changes, or production renderer code.

The heteroscedasticity lesson is used as the reference case because it is the golden fixture for vNext regression and has complete upstream semantics across all pipeline stages.

---

## Learner moment vocabulary

Sprint 68 uses six **learner moments** — composition concepts used only inside the renderer:

| Learner moment | Learner question answered | Composition role |
| -------------- | ------------------------- | ---------------- |
| **Orient** | *Where am I in the lesson, and how should I approach this activity?* | Frame purpose, phase, and thinking stance before substantive work |
| **Learn** | *What do I need to understand?* | Present authoritative explanation for reading or observation |
| **Do** | *What work am I expected to produce?* | Make learner actions explicit; host work where output is externalised |
| **Check** | *How do I know my work is good enough?* | Provide exemplars, criteria, checklists, and success thresholds |
| **Reflect** | *What have I learned about my own understanding?* | Prompt metacognition, misconception repair, or connection-making |
| **Transition** | *Why does the next step matter?* | Maintain horizontal continuity across activities |

These moments are **not** PRISM schema fields. They are not episode-plan beat functions. They are not learner-role labels from Sprint 67 (`reflect`, `explain`, `check`, etc.).

They describe how the renderer **groups, sequences, and presents** existing authoritative semantics so that learners experience one instructional conversation rather than a serial list of objects.

---

## Renderer concepts, not schema fields

| Concept | What it is | What it is not |
| ------- | ---------- | -------------- |
| Learner moment | Renderer composition unit | New JSON property |
| Composition | Grouping existing fields and materials by learner experience | Content generation |
| Moment mapping | Deriving presentation from authoritative semantics | Heuristic inference of missing pedagogy |

The page model may eventually carry composed moment groupings as a **render-time projection**. That projection would be built from existing PRISM data — not authored upstream as a separate instructional artefact.

Sprint 68 validates this model against Activity 1 before any implementation commitment.

---

## Semantic mapping

The table below maps existing PRISM semantics to learner moments. A single field may contribute to more than one moment depending on placement and surrounding composition rules.

| PRISM semantic | Source location | Typical learner moment(s) | Notes |
| -------------- | --------------- | ------------------------- | ----- |
| **Study phase** | `learning_sequence.study_flow[].phase` | Orient | Page-level context for where the activity sits in the lesson arc |
| **Activity purpose** | `learning_sequence.timeline[].purpose` | Orient, Transition | Forward-looking at activity entry; backward/forward at activity exit |
| **Activity preamble** | `activities[].activity_preamble` | Orient, Transition | At activity entry: frames the activity. At next activity entry: may partially bridge from predecessor |
| **Reasoning orientation** | `activities[].reasoning_orientation` | Orient | Thinking stance; composed with preamble, not shown as unrelated block |
| **Learner task** | `activities[].learner_task` | Do, Learn, Check | Numbered steps split across moments by instructional intent, not by beat boundary |
| **Generated materials** | `activities[].materials[]` | Learn, Do, Check, Reflect | Role depends on material type **and** placement relative to task steps |
| **Expected output** | `activities[].expected_output` | Check | Success criteria for produced work; not a substitute for workspace |
| **Self-explanation prompt** | `activities[].self_explanation_prompt` | Orient, Reflect | Priming before Learn → Orient. Post-check metacognition → Reflect |
| **Checklists / criteria** | materials with `material_type: checklist` | Check | Verification against authored criteria |
| **Intellectual coherence bridge** | `activities[].intellectual_coherence_bridge` | Transition | Explicit inter-activity or capstone continuity (absent on A1) |
| **Sample output / worked example** | `sample_output`, `worked_example` materials | Learn, Do, Check | See placement rules below |
| **Episode plan beat function** | `episode_plan.beats[].function` | *(mapping input, not moment)* | Informs material assignment; renderer composes across beats |
| **Progression logic** | `learning_sequence.navigation_guidance.progression_logic` | Orient, Transition | Lesson-level narrative available at page scope |

### Material type defaults (before placement override)

| Material type | Default moment | Placement can reassign to |
| ------------- | -------------- | ------------------------- |
| `text` | Learn | — |
| `worked_example` | Learn | Do (when learner task says "work through") |
| `sample_output` | Check | Learn (when presented before attempt as model) |
| `checklist` | Check | Reflect (when prompts misconception repair) |
| `scenario` | Learn | Do |
| `analysis_table`, `decision_table`, `template` | Do | — |
| `modelling_note` | Learn | Orient |

---

## Composition rules

### Rule 1 — Multiple PRISM fields compose one learner moment

When several authoritative fields serve the same learner experience at the same point in the flow, the renderer composes them into **one visible moment**, preserving all content but reducing visual restarts.

**Example (Activity 1 entry):** study phase + activity purpose + activity preamble + reasoning orientation + self-explanation prompt → single **Orient** moment.

Pedagogical distinctions between fields remain in the model. The renderer changes **presentation grouping**, not semantic erasure.

### Rule 2 — One material may serve different moments by placement

Material type provides a default moment. **Placement relative to learner task steps** overrides the default.

| Condition | Assignment |
| --------- | ---------- |
| Task step uses "Study …" / "Review …" / "Read …" | Material → **Learn** |
| Task step uses "Work through …" / "Complete …" / "Write …" / "Produce …" | Material → **Do** |
| Task step uses "Compare …" / "Verify …" / "Check …" | Material → **Check** |
| Material presented after learner attempt | **Check** (exemplar or criteria) |
| Material presented before independent attempt as model | **Learn** |

**Example (A1-M2):** A `worked_example` defaults to Learn, but A1 learner task step 2 says *"Work through the expert example…"* → composed into **Do** (guided application), not passive reading.

**Example (A1-M3):** A `sample_output` follows step 3 *"Compare the sample response with the explanation"* → composed into **Check**.

### Rule 3 — Externalised learner work requires explicit workspace

When the learner task expects **produced output** (writing, completing a table, making a judgement) that is not captured inside a fillable material:

1. The **Do** moment must state clearly *when* the work happens and *where* the learner completes it.
2. The renderer must provide either:
   - an explicit workspace region (notes area, response block, table completion surface), or
   - unambiguous instruction that the learner works externally (notebook, document) with a visible call-to-action.

**Example (A1 step 5):** *"Write a brief explanation distinguishing homoscedasticity from heteroscedasticity in your own words"* requires a **Do** workspace. The fixture supplies `expected_output` criteria but no dedicated response material — composition must surface this gap.

### Rule 4 — Preserve beat semantics, compose across them

Episode-plan beats remain the authoritative assignment mechanism for materials and prompts. Learner moments are a **presentation layer** that may span beat boundaries.

The renderer must not reassign materials to different beats. It may visually compose content from adjacent beats into one learner moment.

### Rule 5 — Transition draws on page-level and activity-level semantics

**Transition** may compose:

- `intellectual_coherence_bridge` when present;
- successor `activity_preamble` (page-level composition at activity boundary);
- `learning_sequence.timeline[].purpose` of the next activity;
- `progression_logic` where appropriate.

Absence of explicit transition semantics is a **documented gap**, not a licence to invent copy.

---

## Worked composition — Activity 1 (heteroscedasticity)

**Activity:** A1 — Defining Heteroscedasticity and Homoscedasticity  
**Archetype:** `understand` (orientation → explanation → check_understanding)  
**Study phase:** Build understanding  
**Duration:** 12 min · **Outcome:** LO1

This section preserves all authoritative content from the fixture. Content appears grouped by learner moment, not by current beat/render order.

---

### Orient

*Composed from: study phase, activity purpose, activity preamble, reasoning orientation, self-explanation prompt, mapped outcome LO1, activity title context.*

**Lesson phase:** Build understanding *(from `learning_sequence.study_flow`)*

**Activity purpose:** Build foundational understanding of heteroscedasticity, homoscedasticity, and residual variance. *(from `learning_sequence.timeline`)*

**Supports LO1**

---

**Activity preamble**

> You will build a foundational mental model of residual variance before working with evidence. Focus on how the spread of residuals differs between homoscedastic and heteroscedastic situations.

**How to think** *(reasoning orientation)*

> Focus on the spread of errors rather than the existence of errors. Ask yourself whether the amount of prediction error remains stable or changes across observations. Build a mental picture of residual variability before thinking about statistical consequences.

**Explain it to yourself** *(self-explanation prompt — priming, composed here rather than as separate beat header)*

> How would you explain to a fellow economics student why two regressions can have residuals but only one exhibits heteroscedasticity?

*Composition note: five distinct PRISM fields form one entry conversation. Current vNext renderer shows preamble and reasoning orientation as separate visual blocks; self-explanation prompt appears inside the orientation beat as a separate labelled region.*

---

### Learn

*Composed from: learner task step 1, material A1-M1.*

**Your task:** Study the explanatory text introducing residuals, homoscedasticity, and heteroscedasticity.

**Material A1-M1 — Residual Variance and Heteroscedasticity** *(text)*

> ## Residuals and Variance
>
> A residual is the difference between an observed value and a value predicted by a regression model.
>
> Homoscedasticity occurs when residuals have a similar spread across all observations.
>
> Heteroscedasticity occurs when the spread changes. For example, prediction errors may be small for low-income households but much larger for high-income households.
>
> The key issue is not whether residuals exist. All regressions contain residuals. The issue is whether the variability of those residuals remains constant.

*Composition note: step 1 instruction and core text form one Read/Learn moment. Learner task step numbering is retained for traceability but not shown as five separate section headers.*

---

### Do

*Composed from: learner task steps 2 and 5, material A1-M2, workspace requirement for step 5.*

**Step 2 — Work through the expert example**

**Material A1-M2 — Worked Example: Constant versus Changing Spread** *(worked_example)*

> ## Example
>
> Consider two regressions.
>
> ### Case A
> Residuals mostly fall between -5 and +5 across the full range of fitted values.
>
> Reasoning:
> 1. Residuals are present.
> 2. Their spread remains similar.
> 3. Variance appears constant.
> 4. This is consistent with homoscedasticity.
>
> ### Case B
> Residuals range from -2 to +2 at low values but from -15 to +15 at high values.
>
> Reasoning:
> 1. Residual spread increases.
> 2. Variability changes systematically.
> 3. Variance is not constant.
> 4. This is consistent with heteroscedasticity.

*Placement rule applied: worked_example → Do because task step says "Work through".*

---

**Step 5 — Write your explanation**

**Your task:** Write a brief explanation distinguishing homoscedasticity from heteroscedasticity in your own words.

**Workspace required:** Learner produces external written response. Renderer must surface a response area or explicit "write in your notes" call-to-action before Check criteria appear.

*Composition note: step 5 is independent production separated from the guided example in step 2. Both belong to Do but serve different sub-stages (guided → independent).*

---

### Check

*Composed from: learner task steps 3 and 4, materials A1-M3 and A1-M4, expected output.*

**Step 3 — Compare with the exemplar**

**Material A1-M3 — Sample Explanation** *(sample_output)*

> Homoscedasticity means that residuals have a roughly constant spread across observations. Heteroscedasticity means that the spread changes, becoming larger or smaller in different parts of the data. The presence of residuals alone does not indicate heteroscedasticity; it is the change in residual variance that matters.

*Placement rule applied: sample_output → Check because task step says "Compare".*

---

**Step 4 — Complete the self-check**

**Material A1-M4 — Concept Self-Check** *(checklist)*

> - Have I explained residual variance?
> - Have I correctly distinguished homoscedasticity and heteroscedasticity?
> - Have I avoided claiming that all residuals imply heteroscedasticity?
> - Have I referenced an economic example?
>
> If any answer is No, revise before continuing.

---

**Success criteria** *(expected output)*

> A successful response clearly defines both homoscedasticity and heteroscedasticity, refers to residual variance, and explains the difference using plain language rather than formulae alone. The explanation should demonstrate that changing variability, not simply the presence of residuals, is the defining feature.

*Composition note: steps 3–4, exemplar, checklist, and expected output form one verification arc after Do. Step 4's misconception identification spans Check and Reflect (see below).*

---

### Reflect

*Composed from: learner task step 4 (metacognitive clause), self-explanation prompt (retrospective reading).*

**Metacognitive prompt** *(from learner task step 4)*

> Identify one misconception you previously held or might have held.

**Optional retrospective use of self-explanation prompt**

> How would you explain to a fellow economics student why two regressions can have residuals but only one exhibits heteroscedasticity?

*Composition note: the self-explanation prompt appears in Orient as priming. After Check, the same prompt may function as Reflect without repeating verbatim — renderer decision pending implementation. Step 4's misconception clause is the primary Reflect semantics for A1.*

*Current vNext placement: self-explanation prompt only in orientation beat (Orient). Step 4 Reflect semantics are embedded in check_understanding beat instructions without distinct visual moment.*

---

### Transition

*Composed from: activity purpose of A2, progression logic, A2 activity preamble (page-level boundary).*

A1 has **no** `intellectual_coherence_bridge`. Explicit transition semantics must be drawn from page-level learning sequence:

**Progression logic** *(lesson-level)*

> Conceptual foundations precede interpretation, application, consequence analysis, and evaluative judgement.

**Looking ahead** *(A2 activity purpose — composed at A1 exit / A2 entry boundary)*

> Develop analytical skill in interpreting residual plots and identifying changing variance patterns.

**A2 preamble** *(successor activity — partial bridge when composed at boundary)*

> You will learn how economists interpret residual plots by examining patterns rather than individual points.

*Composition note: Transition for A1 is **implicit**, not authored as a dedicated A1 field. Page-level composition must decide whether to render transition at end of A1, start of A2, or both — without inventing connective prose.*

---

## Moment flow summary (A1)

```
Orient → Learn → Do (guided) → Do (independent) → Check → Reflect → Transition*
                                                                    *implicit only
```

| Moment | PRISM sources used | Current vNext issue |
| ------ | ------------------ | ------------------- |
| Orient | study phase, purpose, preamble, reasoning orientation, self-explanation prompt, LO1 | Fragmented into separate blocks and beat header |
| Learn | task step 1, A1-M1 | Correct content; isolated inside explanation beat |
| Do | task steps 2, 5, A1-M2 | Step 5 lacks workspace; steps split across beats |
| Check | task steps 3–4, A1-M3, A1-M4, expected output | Criteria and exemplar nested inside check beat without clear verification arc |
| Reflect | task step 4 clause | No distinct reflect moment |
| Transition | progression logic, A2 purpose/preamble | No A1 bridge; continuity depends on next activity entry |

---

## Unresolved cases and missing semantics (Activity 1)

Issues discovered while composing A1. None require schema changes at this stage; they inform renderer implementation and boundary validation.

| ID | Issue | Classification | Minimal resolution path |
| -- | ----- | -------------- | ----------------------- |
| **LC-A1-01** | **No explicit Transition field on A1** | Render model / composition gap | Compose from page-level `learning_sequence` at activity boundary; do not invent bridge copy |
| **LC-A1-02** | **Step 5 written response has no workspace material** | Render model deficiency | Renderer provides response workspace or explicit external-work instruction in Do moment |
| **LC-A1-03** | **Study phase and activity purpose not in activity page model** | Render model deficiency | Page builder must expose `learning_sequence` fields for Orient composition |
| **LC-A1-04** | **Self-explanation prompt dual role (Orient priming vs Reflect)** | Composition rule ambiguity | Same field, two placements by moment — do not duplicate text; decide single or retrospective presentation |
| **LC-A1-05** | **Learner task shown as beat-scoped instructions** | Renderer composition gap | Task is one authoritative sequence spanning Learn/Do/Check; beats assign materials but should not fragment task narrative |
| **LC-A1-06** | **Step 4 spans Check and Reflect** | Composition rule (multi-moment field) | Single task step with verification + metacognition clauses — compose checklist under Check, misconception prompt under Reflect |
| **LC-A1-07** | **Expected output may read as "the answer"** | Presentation risk (known S67-F06) | Present as success criteria within Check, after learner attempt, not before Do |
| **LC-A1-08** | **A2 preamble as partial Transition** | Composition decision | Confirm page-level rule: successor preamble at boundary vs end-of-predecessor — avoid double rendering |

### Not missing from PRISM (confirmed)

The following are **present and sufficient** for A1 composition. Gaps are in renderer mapping and presentation, not upstream authoring:

- Activity preamble, reasoning orientation, self-explanation prompt
- Full learner task sequence (5 steps)
- All four generated materials with appropriate types
- Expected output success criteria
- Episode plan beat assignment
- Learning sequence phase and purpose

No PRISM schema extension is required for Activity 1. Implementation should focus on composition of existing semantics.

---

## Validation outcome

Activity 1 validates the learner composition model:

1. Six learner moments are sufficient to describe the intended experience.
2. Existing PRISM semantics map cleanly with documented placement rules.
3. Most A1 weaknesses are composition and render-model gaps, not missing instructional content.
4. One render-model gap (workspace for step 5) and one page-model gap (study phase / purpose exposure) are concrete implementation targets.
5. Transition remains the primary horizontal composition challenge when no `intellectual_coherence_bridge` exists.

**Next step:** Validate the same model against A5 (capstone, has bridge) and A2 (analysis table, stronger Do/Check split) before implementing composition changes in `lib/learner-renderer-vnext/`.

---

## Document control

| Version | Date | Change |
| ------- | ---- | ------ |
| 1.0 | 2026-07-21 | Initial model; A1 worked composition |
