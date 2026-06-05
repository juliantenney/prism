# Slice 38K-2 — Function depth model

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Type:** Pedagogical modelling only — no pack, code, schema, or harness changes  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38K-2  
**Input:** [38K-1 baseline depth analysis](38K-1-baseline-depth-analysis.md) · [38I-2 episode model](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md) · [38J-2 function-plan design](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-2-function-plan-prompt-design.md)

**Baselines cited:** `EV-38J-AFTER-*` · [38I-4 targets](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)

---

## §1 Executive summary

[38K-1](38K-1-baseline-depth-analysis.md) established that Sprint 38-J **solved episode structure**: `EV-38J-AFTER` plans and preserves instructional functions in recognisable order. The workbook nevertheless remains far from [38I-4](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md) because **functions are under-populated** (~65–70% of remaining gap) and **closure functions are often not emitted** (~30–35%).

**Purpose of this depth model:** Define what each instructional function must **contain** — not how long it is — so a solo learner experiences **substantial teaching** rather than cues, labels, or empty scaffolds.

**Governing test (from 38-K charter):** A function is **sufficient** when the learner can:

1. **Understand** what to do in this step  
2. **Understand** why it matters in this episode  
3. **See** how expert reasoning works (where modelling applies)  
4. **Attempt** the step with appropriate scaffold  
5. **Check or revise** without tutor support  

**Core distinction this model makes explicit:**

| State | Meaning |
|-------|---------|
| **Episode structure exists** | Functions are planned, ordered, and emitted as Material rows or cognition fields |
| **Episode feels like substantial teaching** | Each emitted function reaches **Level 3 (Sufficient)** on the depth scale (§3), and **Required** functions for the archetype are present |

**Headline model outputs:**

- A **five-level depth scale** with operational definitions (§3)  
- **Depth contracts** per instructional function — purpose, failure mode, sufficient floor, rich characteristics (§4)  
- A **structural vs depth boundary** rule with `EV-38J-AFTER` examples (§5)  
- **Leverage ranking** and **archetype depth matrix** for 38K-3 (§6–§7)

**38K-2 does not propose implementation.** It supplies the reusable vocabulary 38K-3 will turn into archetype-specific depth rules.

---

## §2 Function inventory

Instructional functions observed across [38I-2](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md), [38J-2](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-2-function-plan-prompt-design.md) IFP templates, and `EV-38J-AFTER` emission patterns.

### 2.1 Session and episode framing functions

| Function | Definition | Typical emission surface |
|----------|------------|--------------------------|
| **Orientation** | States why this episode exists **now** in the session arc | `activity_preamble`, workbook section header |
| **Framing** | Bounds the problem space — stakes, constraints, authentic context | `text`, `scenario`, preamble |
| **Activation** | Elicits prior knowledge the episode will build on | `prior_knowledge_activation`, on-page prompt |

### 2.2 Concept teaching functions

| Function | Definition | Typical emission surface |
|----------|------------|--------------------------|
| **Explanation** | Teaches concepts, definitions, relationships needed for success | `text`, exposition Material |
| **Example** | Positive instance making the target idea concrete | `text`, `worked_example`, scenario slice |
| **Non-example** | Contrast case clarifying what the target idea is **not** | `task_cards`, table in `text` |
| **Conceptual contrast** | Side-by-side comparison of confusable ideas on shared dimensions | Table in `text` / `worked_example` |
| **Misconception challenge** | Surfaces tempting error; prompts evidence-based reconciliation | Dedicated section, `support_note`, `worked_example` subsection |

### 2.3 Method and criteria functions

| Function | Definition | Typical emission surface |
|----------|------------|--------------------------|
| **Criteria exposition** | Makes rules, dimensions, comparison lenses, or procedure steps explicit | `text`, criteria block before practice |
| **Perspective building** | Maps who gains, who loses, or competing stakeholder views before judgement | `scenario`, narrative in `text` |
| **Trade-off analysis** | Names tensions between criteria or strategies; forbids premature closure | `prompt_set`, guided inquiry, `modelling_note` |

### 2.4 Modelling functions

| Function | Definition | Typical emission surface |
|----------|------------|--------------------------|
| **Worked thinking** | Expert reasoning visible step-by-step — decisions and intermediate steps, not only final answer | `worked_example`, `modelling_note` |
| **Worked example** | Full expert execution of a procedure or explanation path (subset of worked thinking when procedural) | `worked_example` |
| **Worked judgement** | Exemplar contrast — weak vs strong quality of defence using criteria (non-spoiler) | `modelling_note` |
| **Sample output** | Completed model artefact showing expected form/depth (use with copy-risk guard) | `sample_output` |

### 2.5 Practice and performance functions

| Function | Definition | Typical emission surface |
|----------|------------|--------------------------|
| **Guided inquiry** | Bounded exploration prompts sustaining productive uncertainty | `prompt_set` |
| **Guided practice** | Learner attempt with heavy scaffold — hints, partial structure, exemplar cells | `analysis_table`, `classification_table`, hint column |
| **Guided analysis** | Guided practice specialised for analytic matrix/table completion | `analysis_table` + hints |
| **Guided judgement** | Guided practice specialised for criteria-based ranking or scoring | `decision_table` + scoring guide |
| **Independent practice** | Learner attempt with reduced scaffold — owns the performance | `learner_task`, empty table, write band |
| **Independent analysis** | Independent practice producing justified structured comparison | Completed analysis + justification prose |
| **Independent judgement** | Independent practice producing defended recommendation or decision memo | `template`, `task_cards`, structured write task |
| **Evaluative judgement** | Distinct performance move — compare ≥2 options using criteria; may overlap independent judgement on Evaluate | Rubric-led comparison section |

### 2.6 Closure functions

| Function | Definition | Typical emission surface |
|----------|------------|--------------------------|
| **Verification** | Self-check against explicit criteria before continuing | `checklist`, keyed answers, rubric table |
| **Revision** | Compare attempt to model/evidence; instruction to update | Repair path in verification, revision prompt |
| **Reflection** | Learner articulates meaning, difficulty, or metacognitive insight | `self_explanation_prompt`, reflection prompts |
| **Transfer** | Apply same frame/method/criteria to new or personal context | `transfer_prompt` Material (not field-only) |
| **Synthesis** | Integrate multiple session ideas into one coherent product | `consolidation_summary` (learner-write scaffold) |
| **Transition** | Bridge to next episode; state what was established | Closing paragraph, next-episode pointer |

### 2.7 Inventory notes

- **Worked example** is often the procedural face of **worked thinking** on Apply episodes; on Analyse/Evaluate, worked thinking may use `modelling_note` without numeric procedure.  
- **Guided analysis** and **guided judgement** are specialisations of **guided practice** — depth rules inherit from guided practice plus archetype-specific requirements.  
- **Evaluative judgement** and **independent judgement** overlap on Evaluate archetype; independent judgement specifies the **learner-owned artefact**; evaluative judgement specifies the **criteria-led comparison act**.  
- Functions not always separate Materials — e.g. **conceptual contrast** may live inside **explanation** — but depth is assessed on whether the **move** is present and sufficient, not on Material count.

---

## §3 Depth scale

Five levels. Assessment uses the **instructional sufficiency test** (§1) — not word count.

### Level definitions

| Level | Label | Operational definition | Sufficiency test |
|-------|-------|------------------------|------------------|
| **0** | **Absent** | Function not planned, not emitted, or only named in a task imperative with no teaching body | Fails all five |
| **1** | **Cue** | Function labelled or implied — title, single sentence, empty table, cognition field not rendered as learner-facing teaching | Passes (1) at best |
| **2** | **Thin** | Some teaching content but missing ≥2 sufficiency dimensions — e.g. expert steps without interpretation, or practice without check | Passes 1–2; fails 3–5 |
| **3** | **Sufficient** | Passes **all five** sufficiency dimensions for this function in this archetype | **Minimum floor for 38I-4-class episodes** |
| **4** | **Rich** | Sufficient **plus** discrimination practice, repair path, partial exemplar, or multi-perspective depth appropriate to archetype | Target benchmark for high-stakes functions |

### How to score a function

1. Identify the **primary purpose** of the function in context (§4).  
2. Ask each sufficiency question in order.  
3. If any of 3–5 fails → **Level 2 or below**.  
4. If all pass → **Level 3**.  
5. If all pass and rich characteristics (§4) are met → **Level 4**.

### `EV-38J-AFTER` calibration (from 38K-1)

| Function instance | Level | Why |
|-------------------|-------|-----|
| A2 worked_example | **4** | Steps + interpretation + weighted reasoning — solo learner can follow and replicate |
| A1 text exposition | **3** | Definitions + distinctions; weaker on discrimination framing |
| A4 criteria text | **3** | Four criteria explained with rationale |
| A4 decision_table | **2** | Structure without scoring guide or partial exemplar |
| A1 activation field | **1** | Cognition field only |
| A1 verification | **0** | Not emitted |
| A4 transfer field | **1** | `transfer_or_application_task` without `transfer_prompt` Material |

**Rule:** Word count correlates with depth but does not determine it. A 200-word `sample_output` can be **Thin** if it replaces independent practice without verification.

---

## §4 Function depth contracts

Each contract states: **Purpose** · **Failure mode** · **Minimum sufficient (Level 3)** · **Rich (Level 4)**.

Contracts apply per archetype; §7 marks where each function matters most.

---

### Orientation

| Field | Content |
|-------|---------|
| **Purpose** | Anchor the episode in the session arc — why this step now, what prior work it builds on |
| **Failure mode** | Generic preamble ("this activity introduces…") with no link to prior/next episodes |
| **Sufficient** | ≥2 sentences: prior episode established X; this episode does Y; connects to session outcome |
| **Rich** | Names learner stake ("if your mental model is loose here, downstream wobbles") + explicit forward link |

**EV-38J:** A1–A4 preambles → **Level 1–2**.

---

### Framing

| Field | Content |
|-------|---------|
| **Purpose** | Bound the intellectual problem — what question, case, or decision is in scope |
| **Failure mode** | Topic title only; no stakes or constraints |
| **Sufficient** | Authentic context constants (scenario numbers, decision type, time horizon) + explicit task boundary |
| **Rich** | Framing poses a **question** the episode will answer, not only a topic label |

**EV-38J:** A3 scenario **Sufficient**; A1/A2 framing **Thin**.

---

### Activation

| Field | Content |
|-------|---------|
| **Purpose** | Surface prior knowledge so new teaching connects to something the learner already holds |
| **Failure mode** | "Recall prior knowledge" with no specific prompt |
| **Sufficient** | ≥1 concrete retrieval prompt the learner can answer in writing before continuing |
| **Rich** | Prompt + instruction to revisit answer after teaching ("keep your answer — you will revise") |

**EV-38J:** Cognition fields only → **Level 1**.

---

### Explanation

| Field | Content |
|-------|---------|
| **Purpose** | Teach concepts, definitions, and relationships required for the episode performance |
| **Failure mode** | Glossary list; definitions without consequence or use |
| **Sufficient** | Core idea + ≥2 supporting points + **why it matters** for this episode's task |
| **Rich** | Adds relational links (KM `affects` / `contrasts_with`) + consequence for household/decision context |

**EV-38J:** A1 text, A4 criteria text → **Level 3**.

---

### Example

| Field | Content |
|-------|---------|
| **Purpose** | Make the target idea concrete through a positive instance |
| **Failure mode** | Abstract definition only; no instantiated case |
| **Sufficient** | One worked-through instance with concrete values or narrative the learner can inspect |
| **Rich** | Instance tied to episode framing constants; learner can map features back to definition |

**EV-38J:** Embedded in A1 text/worked → **Level 3** where present.

---

### Non-example

| Field | Content |
|-------|---------|
| **Purpose** | Clarify boundaries — what does **not** count as the target idea |
| **Failure mode** | Absent when confusable cases exist; learner over-generalises |
| **Sufficient** | ≥2 contrast cases with **why not** for each, in table or list form |
| **Rich** | Includes "needs more information" borderline case + decision rule |

**EV-38J:** A1 → **Level 0** (38I-4 requires for CPI/inflation discrimination).

---

### Conceptual contrast

| Field | Content |
|-------|---------|
| **Purpose** | Compare confusable ideas on **shared dimensions** so discrimination is structural, not memorised |
| **Failure mode** | Two definitions in sequence without comparison dimensions |
| **Sufficient** | Table or paired prose: ≥3 dimensions × two concepts, with clear difference on each |
| **Rich** | Adds "when both valid" reconciliation sentence + headline takeaway rule |

**EV-38J:** A1 CPI/GDP in text → **Level 2–3** (prose contrast sufficient but not rich — no reconciliation prompt).

---

### Misconception challenge

| Field | Content |
|-------|---------|
| **Purpose** | Surface tempting error; require evidence-based repair before performance |
| **Failure mode** | One-line `support_note`; misconception buried in worked example without learner prompt |
| **Sufficient** | Named misconception + why it tempts + **learner reconciliation prompt** (write N sentences) |
| **Rich** | Contrast table + reconciliation applied to episode framing scenario |

**EV-38J:** A1 subsection in worked_example → **Level 2** (no standalone learner prompt).

---

### Criteria exposition

| Field | Content |
|-------|---------|
| **Purpose** | Make comparison lenses, procedure rules, or decision dimensions explicit before performance |
| **Failure mode** | Criteria implied in task ("analyse carefully"); procedure only in appendix |
| **Sufficient** | ≥3 named criteria/dimensions, each with **what you judge** and **why it matters here** |
| **Rich** | Criteria stay visible through guided/independent stages; includes weighting or priority guidance |

**EV-38J:** A4 policy criteria → **Level 3**; A2 procedure → **Level 2** (implicit in worked steps).

---

### Perspective building

| Field | Content |
|-------|---------|
| **Purpose** | Map competing views or distributional effects before judgement |
| **Failure mode** | Single viewpoint scenario; "inflation is bad" framing |
| **Sufficient** | ≥2 perspectives or household types with **different exposure** named; learner prompt to identify who is more affected |
| **Rich** | Lens table (distribution, adaptation, time horizon) + competing priorities stated without resolving them |

**EV-38J:** A4 two policy scenarios → **Level 3** for policy domain; A3 two households → **Level 3**; lacks Evaluate-style priority tensions.

---

### Trade-off analysis

| Field | Content |
|-------|---------|
| **Purpose** | Prevent premature closure — name what is gained and lost per option |
| **Failure mode** | Pros/cons list without criteria; recommendation with no cost acknowledged |
| **Sufficient** | ≥2 explicit trade-off tensions tied to criteria; learner must write which priority dominates **for this case** |
| **Rich** | Guided prompts where two criteria **pull against** each other; exemplar names trade-off accepted |

**EV-38J:** A4 modelling_note touches trade-offs implicitly → **Level 2**; no dedicated inquiry sequence.

---

### Worked thinking

| Field | Content |
|-------|---------|
| **Purpose** | Make expert reasoning visible — intermediate steps, decisions, and interpretation |
| **Failure mode** | Formula + answer; finished table with no reasoning path |
| **Sufficient** | ≥3 numbered steps with **think-aloud** between steps + interpretation of result in context |
| **Rich** | Decision points ("I do not yet conclude…"), error avoidance, link back to criteria |

**EV-38J:** A2 → **Level 4**; A1 worked → **Level 3**; A3 analytic pass → **Level 0**.

---

### Worked example

| Field | Content |
|-------|---------|
| **Purpose** | Model full execution of procedure or explanation path for learner replication |
| **Failure mode** | Same as worked thinking failure — answer-only model |
| **Sufficient** | Complete run with inputs, operations, intermediate values, final result, one-sentence meaning |
| **Rich** | Worked thinking rich characteristics + optional misconception subsection |

**EV-38J:** A2 → **Level 4** (reference case for 38K depth model).

---

### Worked judgement

| Field | Content |
|-------|---------|
| **Purpose** | Model **quality** of evaluation — weak vs strong defence using criteria (not spoiler answer) |
| **Failure mode** | Single "good answer" essay; model that pre-answers learner task |
| **Sufficient** | Weak exemplar labelled + strong exemplar with **criteria cited** + explicit "what weak lacks" |
| **Rich** | Strong exemplar names trade-off accepted + conditional clause ("if pay review fails…") |

**EV-38J:** A4 modelling_note → **Level 3**; anti-spoiler preserved.

---

### Sample output

| Field | Content |
|-------|---------|
| **Purpose** | Show expected form, depth, and tone of learner artefact |
| **Failure mode** | Full answer learner can copy; no guard against transcription |
| **Sufficient** | Model shows structure and depth + task requires **recomposition** (not copy) + verification checks originality |
| **Rich** | Annotated model ("notice how criterion X appears") or partial model with gaps |

**EV-38J:** A1/A2 sample_output → **Level 2–3** body, **Thin** pedagogy (copy risk, no guard).

---

### Guided inquiry

| Field | Content |
|-------|---------|
| **Purpose** | Sustain productive uncertainty through bounded questions before structured performance |
| **Failure mode** | Open-ended "discuss"; questions answerable without episode teaching |
| **Sufficient** | ≥3 sequenced prompts tied to scenario constants; each requires episode concepts |
| **Rich** | Prompts escalate to criteria conflict or evidence gap; brief note-taking instruction |

**EV-38J:** A3 prompt_set → **Level 3**.

---

### Guided practice

| Field | Content |
|-------|---------|
| **Purpose** | First learner attempt with heavy scaffold — partial completion, hints, exemplar cells |
| **Failure mode** | Empty table with column headers only; "complete the table" with no hints |
| **Sufficient** | ≥1 exemplar row **or** hint column **or** single-step guided sub-task before full task |
| **Rich** | Fade sequence: one row done → one row hinted → remainder independent; scoring guide for self-check |

**EV-38J:** A2 practice table → **Level 3** (fade via prior worked/sample); A3/A4 tables → **Level 2**.

---

### Guided analysis

| Field | Content |
|-------|---------|
| **Purpose** | Guided practice for analytic matrix — partial classification with justification |
| **Failure mode** | Empty analysis grid; criteria not visible while completing |
| **Sufficient** | Partial row(s) completed with justification + learner completes ≥1 row with same columns |
| **Rich** | Criteria exposition visible alongside table; worked analytic pass immediately precedes |

**EV-38J:** A3 analysis_table → **Level 2** (no partial exemplar, no worked pass).

---

### Guided judgement

| Field | Content |
|-------|---------|
| **Purpose** | Scaffold criteria-based ranking or scoring before independent recommendation |
| **Failure mode** | Empty decision table; ratings without justification column |
| **Sufficient** | Rating scale defined + ≥2 criteria rows + justification column required + ≥1 worked rating example |
| **Rich** | Scoring guide (1–3 per criterion) + instruction to reject one strategy with criterion-based reason |

**EV-38J:** A4 decision_table → **Level 2**.

---

### Independent practice

| Field | Content |
|-------|---------|
| **Purpose** | Learner performance with reduced scaffold — evidence the skill is owned |
| **Failure mode** | "Write your answer" with no structure, word band, or success criteria |
| **Sufficient** | Clear artefact type + minimum evidence specification (steps shown, word band, or table completion) |
| **Rich** | Structured sub-parts (opening / evidence / conclusion); links to verification rubric |

**EV-38J:** A2 table completion → **Level 3**; A1 write task → **Level 2**.

---

### Independent analysis

| Field | Content |
|-------|---------|
| **Purpose** | Full analytic performance with justification citing relationships or scenario facts |
| **Failure mode** | Table cells filled with labels only; no "because" |
| **Sufficient** | Completed matrix + every row has justification citing ≥1 scenario fact |
| **Rich** | Requires comparison across cases ("Household A more exposed because…") |

**EV-38J:** A3 expected_output implies this → **Level 2** (table without modelling path).

---

### Independent judgement

| Field | Content |
|-------|---------|
| **Purpose** | Learner-owned defended recommendation — primary Evaluate evidence |
| **Failure mode** | Session summary substitutes for judgement; list of tips |
| **Sufficient** | Structured memo: priority criterion + primary/secondary choice + trade-off + revision condition; word band |
| **Rich** | Memo template with section labels; rejects lowest-ranked option with criterion reason |

**EV-38J:** A4 → **Level 0** (consolidation_summary is synthesis, not judgement memo).

---

### Evaluative judgement

| Field | Content |
|-------|---------|
| **Purpose** | Compare ≥2 options using explicit criteria — distinct evaluative move |
| **Failure mode** | Single-option advocacy; criteria named but not applied |
| **Sufficient** | Compare ≥2 options on ≥2 criteria with explicit preference order and reason |
| **Rich** | Checkpoint questions before verification ("did you compare, not only advocate?") |

**EV-38J:** A4 partial via table task → **Level 2** (no independent memo).

---

### Verification

| Field | Content |
|-------|---------|
| **Purpose** | Enable self-check and repair before progression — solo substitute for tutor feedback |
| **Failure mode** | Absent; implicit "check your work"; table completion treated as verification |
| **Sufficient** | ≥4 check items **or** keyed answers with tolerance rule + **action if fail** (revise X) |
| **Rich** | Rubric with Yes/Partial/No + repair path pointing to specific earlier section |

**EV-38J:** All activities → **Level 0** (dominant cross-archetype gap).

---

### Revision

| Field | Content |
|-------|---------|
| **Purpose** | Close the loop — compare attempt to model and update |
| **Failure mode** | "Try again" without comparison target |
| **Sufficient** | Named comparison source (worked example, keyed answer, rubric row) + specific rewrite instruction |
| **Rich** | Conditional revision ("if ≥2 No on rubric, revise Step 5 before continuing") |

**EV-38J:** → **Level 0** (no repair paths).

---

### Reflection

| Field | Content |
|-------|---------|
| **Purpose** | Metacognitive consolidation — learner articulates meaning or difficulty |
| **Failure mode** | Generic "reflect on learning"; buried in consolidation prompts |
| **Sufficient** | ≥2 targeted questions tied to episode criteria or method |
| **Rich** | Includes "what evidence would change your answer?" on Evaluate |

**EV-38J:** A4 consolidation prompts → **Level 2** (session-wide, not judgement-focused).

---

### Transfer

| Field | Content |
|-------|---------|
| **Purpose** | Apply same frame, method, or criteria to new/personal context |
| **Failure mode** | Cognition field only; vague "apply to your context" |
| **Sufficient** | Dedicated Material or section: new case **or** personal context + ≥3 specific prompts + word band |
| **Rich** | Requires criterion-level transfer ("which strategy rises/drops in your context and why") |

**EV-38J:** → **Level 0–1** (field only on A1/A4).

---

### Synthesis

| Field | Content |
|-------|---------|
| **Purpose** | Integrate multiple session ideas into one coherent learner-written product |
| **Failure mode** | Pre-written model essay; spoiler consolidation |
| **Sufficient** | Scaffold prompts listing themes learner must integrate; **learner writes**; no model answer |
| **Rich** | Distinct from independent judgement — synthesis integrates; judgement decides |

**EV-38J:** A4 consolidation_summary → **Level 3** as synthesis scaffold; **must not substitute** for independent judgement on Evaluate.

---

### Transition

| Field | Content |
|-------|---------|
| **Purpose** | Bridge to next episode; state what competence was established |
| **Failure mode** | Activity ends without forward link |
| **Sufficient** | One paragraph: "you can now X; next you will Y" |
| **Rich** | Names the capability in verb form tied to LO progression |

**EV-38J:** → **Level 0**.

---

## §5 Structural versus depth boundary

### Decision rule

| Question | If **Yes** | Classification |
|----------|------------|----------------|
| Is the function **absent** from DLA `required_materials` and learner-facing sections? | → | **Missing function (structural)** |
| Is the function **planned and emitted** but failing sufficiency test 3–5? | → | **Shallow function (population-depth)** |
| Is the function present only as a **cognition field** not rendered as teaching? | → | **Missing function (structural)** for workbook-class self-study |
| Is the wrong **substance** taught while shape is correct? | → | **Structural (contract)** — LO/harness alignment, not depth scale |

**Principle:** Structure is a **gate** — depth cannot apply to absent functions. Once emitted, depth is assessed independently.

### Examples from `EV-38J-AFTER`

| Observation | Structural or depth? | Explanation |
|-------------|----------------------|-------------|
| No verification `checklist` on A1 | **Structural** | Function not in DLA plan — cannot be deepened by longer exposition |
| A1 explanation lacks discrimination framing | **Depth** | Explanation emitted; body thin on "what counts / does not count" |
| A2 worked_example strong | **Depth win** | Function present **and** Level 4 |
| A2 no verification checklist | **Structural** | Missing emission |
| A2 criteria only inside worked steps | **Depth** | Criteria exposition thin — should be explicit block |
| A3 no worked analytic pass | **Structural** | Analyse template function omitted |
| A3 empty analysis table | **Depth** | Guided analysis emitted as shell |
| A3 checklist dropped vs 38G | **Structural** | Regression — verification row removed |
| A4 no independent memo `template` | **Structural** | Evaluate required function not planned |
| A4 decision table no scoring guide | **Depth** | Guided judgement emitted thin |
| A4 consolidation instead of judgement memo | **Depth** | Wrong population of synthesis function |
| A4 policy vs household content | **Structural (contract)** | LO4 verb/substance mismatch — depth rules apply after correct anchor |
| `transfer_or_application_task` without Material | **Structural** | Transfer not emitted to page |

### Interaction

Structural and depth gaps **compound**: an empty guided judgement table is structural (row exists) **and** depth (no exemplar). Primary classification follows the decision rule: **emission exists → depth**; **no emission → structural**.

---

## §6 Highest leverage functions

Functions most responsible for the gap between `EV-38J-AFTER` and 38I-4 target-state episodes, ranked by **programme leverage** (impact × frequency × archetype weight).

| Rank | Function | Leverage rationale | 38J typical level | 38I-4 expectation |
|------|----------|-------------------|------------------|-------------------|
| **1** | **Verification** | Absent on **all** activities; 38I-2 marks **R** on every archetype; solo learners have no tutor feedback substitute | 0 | 3–4 |
| **2** | **Independent judgement** | A4 Evaluate bottleneck; capstone cannot complete without learner-owned memo | 0 (A4) | 3–4 |
| **3** | **Transfer** | **R** on Evaluate; **C** on Apply/Analyse; cognition-only on 38J | 0–1 | 3 |
| **4** | **Worked thinking** (analytic) | A3 missing entirely; A2 proves pipeline can reach Level 4 when specified | 0 (A3) / 4 (A2) | 3–4 |
| **5** | **Guided practice** (incl. guided analysis/judgement) | Tables present but Level 2 — no partial exemplar, scoring guide, or fade | 2–3 | 3–4 |
| **6** | **Criteria exposition** | Adequate on A4 policy; thin on A2/A3; must generalise across archetypes | 2–3 | 3–4 |
| **7** | **Perspective building** + **trade-off analysis** | Evaluate richness driver; A4 partial on policy scenarios only | 2–3 | 3–4 |
| **8** | **Non-example** + **misconception challenge** | Understand discrimination ladder; A1 has exposition but not practice path | 0–2 | 3–4 |
| **9** | **Orientation** + **framing** + **activation** | Uniformly Level 1 — caps perceived teaching quality even when core strong | 1–2 | 3 |
| **10** | **Reflection** + **transition** | Closure and session coherence; lower immediate gap than verification | 0–2 | 3 |

**Insight:** Ranks 1–3 are **closure functions**. 38-J fixed the **opening and middle** teach-then-do chain; 38I-4 richness is disproportionately in **how episodes end** — check, own, apply, bridge.

**A2 exception:** Worked example at Level 4 proves leverage rank 4 is **specification-dependent** — the pipeline delivers depth when IFP demands it.

---

## §7 Function depth matrix

**Depth importance** = how much archetype quality depends on reaching **Level 3+** for that function.

**Legend:** **H** = High (Required — episode fails without sufficient depth) · **M** = Medium (Common — material quality impact) · **L** = Low (Optional — polish) · **—** = not normally part of archetype

| Instructional function | Understand | Apply | Analyse | Evaluate |
|------------------------|:----------:|:-----:|:-------:|:--------:|
| Orientation | M | M | M | M |
| Framing | M | H | H | H |
| Activation | M | L | M | M |
| Explanation | H | L | M | M |
| Example | H | L | M | L |
| Non-example | H | — | M | L |
| Conceptual contrast | H | L | M | L |
| Misconception challenge | H | L | M | L |
| Criteria exposition | L | H | H | **H** |
| Perspective building | L | — | M | **H** |
| Trade-off analysis | — | L | M | **H** |
| Worked thinking | M | **H** | **H** | M |
| Worked example | M | **H** | L | — |
| Worked judgement | — | — | L | **H** |
| Sample output | M | M | L | — |
| Guided inquiry | L | L | M | M |
| Guided practice | M | **H** | **H** | M |
| Guided analysis | L | — | **H** | — |
| Guided judgement | — | — | L | **H** |
| Independent practice | H | **H** | **H** | M |
| Independent analysis | M | — | **H** | — |
| Independent judgement | — | — | L | **H** |
| Evaluative judgement | — | — | M | **H** |
| Verification | **H** | **H** | **H** | **H** |
| Revision | M | M | M | M |
| Reflection | M | M | H | **H** |
| Transfer | L | M | M | **H** |
| Synthesis | L | L | L | M |
| Transition | M | M | M | M |

### Archetype richness hotspots

| Archetype | Functions where Level 3+ matters most |
|-----------|--------------------------------------|
| **Understand** | Explanation, example, non-example, conceptual contrast, misconception challenge, independent practice, **verification** |
| **Apply** | Criteria exposition, **worked thinking/example**, guided practice, independent practice, **verification**, transfer |
| **Analyse** | Framing, criteria exposition, **worked thinking**, guided analysis, independent analysis, verification, reflection |
| **Evaluate** | Criteria exposition, perspective building, trade-off analysis, worked judgement, guided judgement, **independent judgement**, evaluative judgement, **verification**, **transfer**, reflection |

**Cross-cutting:** **Verification** is **H** on all four — the highest-leverage uniform floor.

---

## §8 Implications for 38K-3

38K-3 must translate this model into **archetype-specific depth rules** — minimum Level 3 obligations per Required function, with Evaluate and Apply as priority profiles.

### Archetype priority (strongest depth obligations)

| Priority | Archetype | Rationale |
|----------|-----------|-----------|
| **1** | **Evaluate** | Most functions at **H**; largest 38I-4 gap (A4); independent judgement + verification + transfer all **Required** and absent on 38J |
| **2** | **Apply** | A2 demonstrates pipeline can hit Level 4; rules should **extend** the A2 pattern (verification, transfer, explicit criteria) not redesign |
| **3** | **Analyse** | Worked analytic pass + guided analysis depth; verification regression vs 38G |
| **4** | **Understand** | Discrimination ladder (non-example, misconception, classification) + verification; less function count than Evaluate but defines session foundation |

### Per-archetype 38K-3 deliverable expectations (design only)

| Archetype | Minimum Level 3 set (from §7 H cells) | Special rules |
|-----------|--------------------------------------|---------------|
| **Evaluate** | Criteria, perspectives, trade-offs, worked judgement, guided judgement, independent judgement, evaluative judgement, verification, transfer, reflection | Synthesis must not substitute for judgement; anti-spoiler on exemplars |
| **Apply** | Framing, criteria exposition, worked thinking, guided practice, independent practice, verification | Fade sequence mandatory; transfer with new surface data |
| **Analyse** | Framing, criteria exposition, worked thinking, guided analysis, independent analysis, verification, reflection | Worked pass before empty matrix |
| **Understand** | Explanation, example, non-example or conceptual contrast, independent practice, verification | Misconception **H** when KM lists one; sample_output copy guard |

### Cross-archetype emission rules (for 38K-3 to formalise)

These are **structural gates** identified in §5 — 38K-3 should pair with depth floors:

1. **Verification** → `checklist` or rubric Material when archetype marks verification **R**  
2. **Transfer** → `transfer_prompt` Material when cognition transfer field set or Evaluate archetype  
3. **Independent judgement** → `template` or `task_cards` on Evaluate when independent judgement **R**  
4. **Worked thinking (analytic)** → `worked_example` or `modelling_note` before analysis/judgement tables on Analyse/Evaluate  

### What 38K-3 should not do

- Propose pack §5/§6 edits (38K-5 scope)  
- Set word-count targets as primary metrics  
- Reopen 38-J episode structure or function order  

### Success handoff

38K-3 output should let an implementer answer: *"For this Evaluate activity, which functions must reach Level 3, what does sufficient look like, and which Material rows must exist?"*

---

## References

- [38K-1 baseline depth analysis](38K-1-baseline-depth-analysis.md)  
- [38I-2 instructional episode model](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-2-instructional-episode-model.md)  
- [38I-4 target-state mock-ups](../../2026-06-05-sprint-38i-instructional-episode-model/observations/38I-4-target-state-workbook-mockups.md)  
- [38I-4 A4 learner episode](../../2026-06-05-sprint-38i-instructional-episode-model/observations/artefacts/38I-4-a4-evaluate-learner-episode.md)  
- [38J-2 function-plan prompt design](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-2-function-plan-prompt-design.md)  
- [38J-5 proof run](../../2026-06-05-sprint-38j-instructional-function-planning/observations/38J-5-inflation-proof-run.md)

---

**Parent:** [38K observations index](README.md) · **Charter:** 38K-2 · **Next:** 38K-3 Archetype-specific depth rules
