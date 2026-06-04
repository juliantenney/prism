# Slice 38C-1 — Workbook pedagogy model

**Date:** 2026-06-04  
**Status:** **COMPLETE**  
**Charter:** [PLANNING-CHARTER.md](../PLANNING-CHARTER.md) § 38C-1  
**Inputs:** [38C self-study quality review](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-self-study-resource-quality-review.md) · [38C richness review](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-design-page-richness-review.md)  
**Hypothesis (programme):** Wrong **instructional genre** for self-study — not Design Page stripping ([HANDOVER.md](../HANDOVER.md)).

**This slice:** Planning model only — no `app.js`, pack, test, or implementation proposals.

---

## Success criterion (met)

A reviewer can take a composed `page` JSON and/or rendered HTML, score each instructional function as **Present** / **Partial** / **Absent**, apply the **60-minute minimum viable workbook** bar, and classify the resource genre with stated pass/fail rules.

---

## 1. Definition — self-study workbook

A **self-study workbook** is a **solo-learner** learning resource that combines:

1. **Enough exposition** for the learner to understand ideas without a live instructor.  
2. A **deliberate practice arc** — support is offered, used, and then reduced across the session.  
3. **Verification points** where the learner can check understanding before moving on.  
4. **Closure** — the learner leaves with summarised takeaways and (where appropriate) an integrated output.

In PRISM terms (`page_profile: learner`), the workbook is the **composed page** (sections + `learning_activities[]` + `materials.*` + learner-visible metadata). The reviewer judges **what the learner sees**, not upstream JSON the renderer omits.

**Not required for this definition:** facilitator moves, group discussion, or live workshop timing — though pair tasks may appear as optional stretch.

---

## 2. Adjacent genres — definitions and discriminators

| Genre | Definition | Primary discriminator | Typical PRISM signals |
|-------|------------|----------------------|------------------------|
| **Self-study workbook** | Solo session with teach → model/example → practice → check → consolidate → (synthesise / transfer) | **Explanatory teaching + consolidation** both **Present**; practice arc evident | Prose sections + varied `materials` types + closure section + solo `learner_task` |
| **Activity sheet** | Tasks and blanks; learner fills tables or short answers with minimal teaching | **Explanatory teaching Absent or Partial**; tasks dominate; **consolidation Absent** | Thin preambles; “complete the table”; tables as main content |
| **Reference notes** | Lookup definitions, comparisons, facts — weak practice arc | **Guided practice Absent**; **retrieval Absent**; tables/definitions without tasks | Dense `materials` tables; few or no `learner_task` outputs |
| **Guided tutorial** | Step-by-step path with check after each step | **Modelling or worked examples Present** + **retrieval after each step** | Numbered steps, “try then check”, inline feedback cues |
| **Revision sheet** | Exam-prep recap; recall-heavy; weak synthesis | **Retrieval Present**; **synthesis Absent**; **transfer Absent** | Cue cards, summary tables, no integrative capstone |

### 2.1 Genre decision tree (after function scoring)

```text
IF explanatory_teaching ∈ {Absent} AND consolidation ∈ {Absent}
  → classify as activity_sheet OR reference_notes (see 2.2)
ELSE IF workbook_minimum_pass (§5) = PASS
  → self_study_workbook
ELSE IF worked_examples OR modelling Present AND retrieval Present per step
  → guided_tutorial (partial workbook — note gap vs §5)
ELSE IF retrieval Present AND synthesis Absent AND transfer Absent
  → revision_sheet
ELSE
  → hybrid — name primary + secondary (e.g. activity_sheet + reference_notes)
```

### 2.2 Activity sheet vs reference notes

| Signal | Activity sheet | Reference notes |
|--------|----------------|-----------------|
| `learner_task` / expected output | **Present** on most activities | Sparse or generic |
| Learner completion required | **Yes** — blanks, rankings, calculations | **Optional** — mainly read |
| Table role | Worksheet to complete | Encyclopaedia to consult |
| Session arc | Task sequence | Flat lookup |

---

## 3. Instructional functions — rubric

**Score each function:** **Present** · **Partial** · **Absent**  
**Review surfaces:** `page` JSON (`sections[]`, `learning_activities.content[]`, `materials.*`, cognition fields) and **rendered HTML** (headings, prose blocks, cards, tables, checklists).

---

### 3.1 Explanatory teaching

| | |
|--|--|
| **Purpose** | Connect concepts in readable prose so a solo learner grasps *why* before *do*. |
| **Present** | ≥1 section or activity block with **≥120 words** of continuous explanatory prose (not only table cells) linking ≥2 ideas; OR `knowledge_summary` / equivalent section with substantive teaching text. |
| **Partial** | Definitions/examples only inside tables; OR short intro (under 120 words) plus activity preambles under 40 words each; OR teaching prose exists but does not bridge between activities. |
| **Absent** | No learner-visible prose whose primary job is explanation; only tasks + reference tables. |
| **Evidence (JSON)** | `sections[].content` string/object with paragraphs; `materials.scenario` / `materials.exposition`; `knowledge_summary`, `study_orientation`. |
| **Evidence (HTML)** | `<p>` blocks under overview/key ideas; not only `<table>`. |
| **Anti-patterns** | “Learning journey” intro that does not teach; catalogue labels (“Set of scenarios…”); table-only definitions counted as full teaching. |

---

### 3.2 Worked examples

| | |
|--|--|
| **Purpose** | Show an expert completing one instance **step-by-step** before the learner attempts a parallel task. |
| **Present** | ≥1 `materials.worked_example` (or equivalent) with **ordered steps** and at least one intermediate result visible; learner task explicitly builds on it (“use the same method on…”). |
| **Partial** | Fully worked row/cell inside a table the learner did not produce; OR steps listed without reasoning; OR example in facilitator-only field not rendered. |
| **Absent** | No stepped expert solution; only blank templates or pre-filled answer keys. |
| **Evidence (JSON)** | `materials.worked_example`, `materials.model_solution`, staged headings in materials markdown. |
| **Evidence (HTML)** | `.util-template-block`, numbered stages, “Example solution” heading. |
| **Anti-patterns** | Pre-filled effectiveness ratings (learner ranks given scores); answer key without steps; duplicate table labelled “reference”. |

---

### 3.3 Modelling

| | |
|--|--|
| **Purpose** | Make expert **reasoning** visible — criteria, checks, and decisions — not only final answers. |
| **Present** | Think-aloud or decision-criteria prose (“First check… because…”); OR annotated walkthrough of one classification/measurement choice with rationale. |
| **Partial** | “Notes” column in tables that interpret but do not show reasoning process; OR `reasoning_orientation` in JSON not visible in HTML. |
| **Absent** | Only outcomes and definitions; no process modelling. |
| **Evidence (JSON)** | `reasoning_orientation`, `materials.modelling`, markdown with “Criteria:” / “Decision:”. |
| **Evidence (HTML)** | Visible reasoning block before practice task. |
| **Anti-patterns** | Modelling conflated with worked example with no decision rules; generic facilitator support_note not in materials. |

---

### 3.4 Guided practice

| | |
|--|--|
| **Purpose** | Structured learner attempt with **clear task**, **materials to work on**, and **success criteria**. |
| **Present** | ≥2 activities each with: specific `learner_task`, non-empty `materials` suited to task, `expected_output` stating completable artefact; solo-feasible wording. |
| **Partial** | Tasks exist but materials missing (task references scenarios not in `materials`); OR social wording (“partner”, “group”) on solo page; OR tables mostly pre-filled leaving little to do. |
| **Absent** | Read-only reference with no completion expectation. |
| **Evidence (JSON)** | `learner_task`, `expected_output`, `materials.*` aligned with task. |
| **Evidence (HTML)** | Task block + worksheet/table with empty cells or explicit “your answer”. |
| **Anti-patterns** | Task-heavy with no substance to complete; placeholder materials; impossible tasks without data. |

---

### 3.5 Fading

| | |
|--|--|
| **Purpose** | Reduce scaffolding across the session so later activities demand more independence. |
| **Present** | Documented progression: early activity includes hints/checklist/cards; later activity drops hints or increases open-endedness; OR `scaffold_hint_sequence` narrows over A1→A5. |
| **Partial** | Sequence gets harder by topic but support level flat; OR fading only on final activity (A5) metadata. |
| **Absent** | Same support density throughout; OR only reference tables repeated (e.g. A5 dumps all prior tables). |
| **Evidence (JSON)** | Compare hint density A1 vs A5; `scaffold_hint_sequence`; presence of `task_cards` early only. |
| **Evidence (HTML)** | Fewer callout boxes / cards in later activities. |
| **Anti-patterns** | Re-posting full reference tables on synthesis activity instead of fading. |

---

### 3.6 Misconceptions

| | |
|--|--|
| **Purpose** | Surface common errors so self-study learners can self-correct without an instructor. |
| **Present** | Learner-visible “Common mistake”, “Watch out”, or misconception–correction pairs tied to the topic. |
| **Partial** | `failure_mode` on activities (JSON) not rendered or not framed as learner-facing; OR vague “errors in calculation”. |
| **Absent** | No misconception content visible to learner. |
| **Evidence (JSON)** | `materials.misconceptions`, `failure_mode` rendered, FAQ-style blocks. |
| **Evidence (HTML)** | Callout / aside with mistake label. |
| **Anti-patterns** | Failure modes written for facilitators only; punitive tone without correction. |

---

### 3.7 Retrieval

| | |
|--|--|
| **Purpose** | Prompt recall and low-stakes verification before moving on. |
| **Present** | ≥2 retrieval episodes: e.g. `task_cards`, self-check questions, “cover and recall”, checklist, or explicit quiz prompts with expected check. |
| **Partial** | One implicit retrieval (classify from memory) without answer check; OR checklist without confirmation step. |
| **Absent** | No recall or self-check; learner only reads and fills tables once. |
| **Evidence (JSON)** | `materials.task_cards`, `prompt_set`, `checklist`, `self_explanation_prompt` learner-visible. |
| **Evidence (HTML)** | Card grid, numbered prompts, “Before you continue” block. |
| **Anti-patterns** | Only summative capstone; pre-filled tables removing retrieval need. |

---

### 3.8 Consolidation

| | |
|--|--|
| **Purpose** | Close the session — summarise, reflect, and anchor what to remember. |
| **Present** | Dedicated section (e.g. `study_tips`, `reflection`, `key_takeaways`, `summary`) with **≥80 words** summarising ≥3 ideas from the session; OR structured reflection prompts with space for learner notes. |
| **Partial** | Outcomes list restated at start only; OR A5 plan task without “what you learned”; OR consolidation buried in one sentence. |
| **Absent** | Page ends after last activity with no closure. |
| **Evidence (JSON)** | `sections[]` with consolidation `section_id` / heading; reflection in `materials`. |
| **Evidence (HTML)** | Final section before meta/footer with summary/reflection heading. |
| **Anti-patterns** | Marketing intro substituted for closure; duplicate learning outcomes list as “summary”. |

---

### 3.9 Synthesis

| | |
|--|--|
| **Purpose** | Integrate multiple prior ideas into one coherent learner product. |
| **Present** | Capstone activity requiring combination of ≥3 preceding topics (explicit in task); integrative `expected_output` (plan, essay, decision memo). |
| **Partial** | Capstone lists topics to mention but materials do not support integration; OR repetition of tables without synthesis instructions. |
| **Absent** | Only isolated micro-tasks; no integrative artefact. |
| **Evidence (JSON)** | A5-style `learner_task` with numbered integration steps; `expected_output` multi-part. |
| **Evidence (HTML)** | Final activity titled synthesise / apply / plan. |
| **Anti-patterns** | “Paste prior tables again” as synthesis; outline-only capstone. |

---

### 3.10 Transfer

| | |
|--|--|
| **Purpose** | Apply learning to the **learner’s own context** (personal case, local data, role). |
| **Present** | Explicit transfer prompt (“your household”, “your context”, “choose a case from your experience”) with criteria for personal application. |
| **Partial** | Generic “real world” without personalisation; OR `transfer_or_application_task` in JSON not rendered. |
| **Absent** | Only abstract or third-person scenarios; no invitation to own context. |
| **Evidence (JSON)** | `transfer_or_application_task`, personal finance plan, “your” in learner_task. |
| **Evidence (HTML)** | Visible transfer subsection. |
| **Anti-patterns** | Fictional-only scenarios with no bridge to learner life when topic is personal finance / professional practice. |

---

### 3.11 Evaluative judgement

| | |
|--|--|
| **Purpose** | Support quality assessment — compare options, justify choices, use criteria or exemplars. |
| **Present** | Ranking/compare task **with** justification required; OR rubric / quality criteria / exemplar of strong vs weak answer. |
| **Partial** | “Rank strategies” without rubric; OR pre-given ratings so judgement is cosmetic. |
| **Absent** | Only right/wrong completion; no comparison or quality lens. |
| **Evidence (JSON)** | `activity_interaction_type: ranking`, `materials.rubric`, exemplar in materials. |
| **Evidence (HTML)** | Criteria list adjacent to ranking task. |
| **Anti-patterns** | Effectiveness column pre-filled; social debate without criteria. |

---

## 4. Minimum viable workbook — 60-minute self-study

Target: `page_profile: learner`, nominal **60 minutes** solo study (labelled durations should sum **50–70 min** or page states flexible pacing).

| Requirement | Minimum |
|-------------|---------|
| **Sections** | Intro/purpose + activities + **consolidation** (≥3 top-level learner sections) |
| **Activities** | **3–6** with clear sequence |
| **Explanatory teaching** | **Present** (§3.1) |
| **Guided practice** | **Present** on ≥2 activities |
| **Retrieval** | **Present** (≥2 episodes) |
| **Consolidation** | **Present** |
| **Modelling path** | **Present**: worked examples **OR** modelling (≥1) |
| **Integration path** | **Present**: synthesis **OR** transfer (≥1) |
| **Solo feasibility** | No required partner/group on >1 core activity |
| **Materials variety** | ≥2 material **types** across page (e.g. scenario + table; not tables only) |
| **Fading** | **Partial** acceptable for MVP; **Absent** triggers gap note in 38C-2 |

---

## 5. Workbook pass/fail rules

### 5.1 PASS — classified as **self-study workbook**

All must hold:

| Rule | Condition |
|------|-----------|
| **R1** | Explanatory teaching = **Present** |
| **R2** | Guided practice = **Present** |
| **R3** | Retrieval = **Present** |
| **R4** | Consolidation = **Present** |
| **R5** | Worked examples **OR** modelling = **Present** (at least one) |
| **R6** | Synthesis **OR** transfer = **Present** (at least one) |
| **R7** | §4 duration and solo-feasibility met |

### 5.2 FAIL — not a workbook

| Rule | Condition | Typical classification |
|------|-----------|------------------------|
| **F1** | Explanatory teaching **Absent** AND consolidation **Absent** | **Activity sheet** and/or **reference notes** |
| **F2** | R1–R4 any mandatory function **Absent** | Failed workbook (hybrid genre) |
| **F3** | Both worked examples and modelling **Absent** | Failed workbook |
| **F4** | Both synthesis and transfer **Absent** | Failed workbook (may still be **revision sheet** if retrieval Present) |

### 5.3 Partial workbook

**R1–R4** met but **R5** or **R6** only **Partial** → record as **workbook (partial)** — eligible for 38C-2 gap analysis, not genre PASS.

---

## 6. Reviewer scoring template

**Resource:** _______________________  
**Artefact:** `page` JSON path / HTML export  
**Reviewer / date:** _______________________  
**Nominal duration:** _________ min (sum `duration_minutes`: _________)

### 6.1 Function scores

| Function | Present | Partial | Absent | Notes (evidence path) |
|----------|:-------:|:-------:|:------:|------------------------|
| Explanatory teaching | | | | |
| Worked examples | | | | |
| Modelling | | | | |
| Guided practice | | | | |
| Fading | | | | |
| Misconceptions | | | | |
| Retrieval | | | | |
| Consolidation | | | | |
| Synthesis | | | | |
| Transfer | | | | |
| Evaluative judgement | | | | |

*Tick one column per row.*

### 6.2 Workbook rules

| Check | Pass | Fail | N/A |
|-------|:----:|:----:|:---:|
| R1 Explanatory teaching Present | | | |
| R2 Guided practice Present | | | |
| R3 Retrieval Present | | | |
| R4 Consolidation Present | | | |
| R5 Worked example OR modelling Present | | | |
| R6 Synthesis OR transfer Present | | | |
| R7 §4 60-min + solo + variety | | | |
| F1 Both teaching & consolidation Absent → not workbook | | | |

**Workbook PASS:** all R1–R7 Pass and F1 not triggered.

### 6.3 Genre classification

| Genre | Selected |
|-------|:--------:|
| Self-study workbook | |
| Activity sheet | |
| Reference notes | |
| Guided tutorial | |
| Revision sheet | |
| Hybrid (describe): | |

### 6.4 One-paragraph verdict

> Solo 60-minute fit (1–5): ___  
> Primary gap (if not PASS): ___  
> Origin hypothesis (observation only): DLA / GAM / Design Page / vision / brief — ___

---

## 7. Calibration — Inflation EV-01 (observation only)

Illustrates scoring; **not** a implementation target.

| Function | EV-01 score | Brief evidence |
|----------|-------------|----------------|
| Explanatory teaching | **Partial** | ~69-word intro; definitions in tables |
| Worked examples | **Absent** | |
| Modelling | **Absent** | |
| Guided practice | **Partial** | Tasks + tables; partner/group wording; A3 scenarios missing |
| Fading | **Absent** | A5 repeats all tables |
| Misconceptions | **Absent** | `failure_mode` not learner-facing |
| Retrieval | **Partial** | Implicit classify/calculate; no cards/checklist |
| Consolidation | **Absent** | |
| Synthesis | **Present** | A5 plan |
| Transfer | **Partial** | Personal plan task |
| Evaluative judgement | **Partial** | A4 rank; pre-filled ratings |

**Workbook PASS:** **Fail** (R4, R5, F1 risk on teaching+consolidation pairing)  
**Genre:** **Activity sheet + reference notes** ([38C quality review](../../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-self-study-resource-quality-review.md))

Confirms programme hypothesis: genre/thinness upstream of Design Page preserve.

---

## 8. Boundaries for later phases (no implementation)

| Phase | Uses 38C-1 for |
|-------|----------------|
| **38C-2** Gap analysis | Apply §6 template to Inflation EV, golden fixture, EV-03 GAM-rich path; severity + origin |
| **38C-3** DLA workbook requirements | Map **Absent/Partial** functions to `required_materials`, cognition fields, duration, solo task rules |
| **38C-4** GAM instructional genres | Map functions to material types (`scenario`, `worked_example`, `task_cards`, …) and author anti-patterns |
| **38C-5** Workbook experience & rendering | Map functions to page sections and HTML patterns; note render visibility of JSON-only fields |

**Out of scope for 38C-1:** pack text, `app.js`, probes, new tests, PR lists.

---

## 9. Sign-off

| Item | Status |
|------|--------|
| Workbook definition | **Done** §1 |
| Genre discriminators | **Done** §2 |
| Eleven function rubrics | **Done** §3 |
| 60-minute MVP + pass/fail | **Done** §4–5 |
| Reviewer template | **Done** §6 |
| Calibration example | **Done** §7 |
| Phase boundaries | **Done** §8 |
| Slice 38C-1 | **COMPLETE** |

**Next slice:** [38C-2 workbook gap analysis](38C-2-workbook-gap-analysis.md) (TBD) — apply §6 to all programme anchors.
