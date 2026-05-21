# Assessment & feedback semantics — working notes



**Pack:** Sprint 27 — investigation  

**Authoritative code:** `app.js`, LD `domain-learning-design-step-patterns.md`  

**27-1 evidence:** [`elicitation-evidence-matrix.md`](elicitation-evidence-matrix.md), R27-006–011 in [`review-log.md`](review-log.md)  

**27-2 status:** **Elicitation audit complete** (read-only; no schema/code changes)  

**Not authoritative:** Candidate factor IDs below are **documentation proposals** until R27-4 charter freeze



---



## Framing



PRISM **generates** assessment items and **renders** them when composition places them in `page.sections[]`. Sprint 27 asks whether PRISM **models** assessment pedagogy with the same rigour as activity pedagogy.



**27-2 conclusion:** The system has **strong item-bank and coverage semantics** at elicitation (type, count, difficulty, `feedback_required` mode) but **weak or absent semantics** for discussion-first assessment, feedback **timing**, facilitator-led reveal, peer-instruction sequencing, diagnostic misconception stance, and confidence-based formats. Answer hiding is achieved mainly through **composition/render policy** (`include_answers`, omitted fields, `feedback_display: none`), not through a unified pedagogical contract from brief → generation.



---



## Working ontology (validated against 27-1)



| Term | Meaning | Where it lives today | 27-1 / 27-2 status |

|------|---------|----------------------|---------------------|

| **Assessment type** | MCQ, T/F, short answer, essay, mixed | `assessment_type`, item `item_type`, Design Assessment `activity_type` | **Strong E**; collateral cues (R27-011: “case study” in inputs) |

| **Item count** | Total items to generate | `assessment_total_items`, blueprint `total_items` | **Strong E** when explicit number in brief |

| **Coverage / difficulty** | Blueprint / generation distribution | Design Assessment, Generate Assessment Items | **Medium E**; Design Assessment often **pruned** (Case A, C) |

| **Answer visibility (learner export)** | Whether learner sees correct answers in HTML | `include_answers`, page `feedback_display`, item answer fields, renderer | **Presentation chain** (H4, R27-007, R27-009) — not pedagogy at G |

| **Feedback mode** | None / per-item / aggregate commentary | `feedback_required` (brief optional); GAI `feedback_mode`; Design Feedback step | **Mode ≠ timing**; Design Feedback **absent** in primary cases (R27-008) |

| **Feedback timing** | When answers/feedback become visible | *No factor*; `feedback_display: reflection_then_answers` in **Design Assessment pack only** | **Gap** — see § feedback_timing |

| **Assessment interaction mode** | Retrieval vs discussion-first vs diagnostic vs confidence | *No factor*; activity `grouping` only | **Gap** — see § assessment_interaction_mode |

| **Facilitator-led reveal** | Tutor controls when answers are shown | Facilitator notes in sequence/activities; `page_profile: facilitator` extract | **Weak** — conflated with facilitator *materials* (R27-011) |

| **Peer discussion / peer instruction** | Discuss before self-check | Activity prose, `discussion_prompts` materials | **G rich, E absent** (climate Case C) |

| **Diagnostic misconception assessment** | Items target known misconceptions | GAI prompt mentions misconception-aware distractors; no brief factor | **G partial, E absent** |

| **Page profile** | Learner vs assessment vs facilitator | `page_profile` extract | **Strong E**; can misfire (inflation) |



---



## Elicitation inventory (LD `workflowBriefConfig`)



### Required factors (Factory must capture)



| ID | Type | Extract regex? | Notes |

|----|------|----------------|-------|

| `topic` | text | Partial (goal heuristics) | Required in config |

| `learner_level` | select | Yes (`undergraduate`, etc.) | |

| `design_scope` | select | Weak in extract | Often resolved in panel |

| `delivery_pattern` | select | Weak | |

| `input_strategy` | select | Yes | `provided_source_content`, `generate_from_topic` |



### Optional factors (brief-time / refinement)



| ID | Extract? | Post-gen queue? | Maps to step | 27-2 note |

|----|----------|-----------------|--------------|-----------|

| `assessment_required` | **Yes** | — | triggerRules → GAI | Dominates topology |

| `assessment_type` | **Yes** | **mustAsk** (fallback queue) | GAI, Design Assessment | |

| `assessment_total_items` | **Yes** (if counted) | **mustAsk** | GAI, Design Assessment | “Short formative” not counted |

| `feedback_required` | Partial | optional in `assessment_pack` class | Design Page patch | **Commentary mode**, not timing |

| `include_answers` | Partial (buggy) | pass-through | Design Page | R27-007 negation gap |

| `page_profile` | **Yes** | — | Design Page | |

| `activities_required` | **Yes** | — | O pruning | “Task cards” **not** in regex (R27-010) |

| `materials_required` | **Yes** | — | O pruning | |

| `assessment_strategy` | No | — | — | Rarely set from brief |

| `assessment_cadence` | No | — | — | Module/sequence only |

| `question_style_mix` | No | optional queue | GAI | |

| `cognitive_demand` | No | optional queue | refinement | |

| `difficulty_profile` | No | optional queue | GAI, Design Assessment | |

| `activity_pattern_mix` | No | — | DLA | Activity-only |

| `sequencing_granularity` | No | — | CLS | Workshop heuristic often adds CLS |



### Step / settings-only (not brief factors)



| Key | Step | Elicitation | Renderer wired? |

|-----|------|-------------|-----------------|

| `feedback_display` | Design Assessment (`workflowBriefConfig` settings ~1247; step option ~2742) | `settings-only` / blueprint | **Partial R:** `none`, `answer_grid_end`, `answers_explanations` only (`app.js` ~23965–23978). **`reflection_then_answers` not parsed** |

| `feedback_mode` | Generate Assessment Items (~3043) | Step param | GAI prompt only |

| `include_answers` | Design Page (~3200) | Step param + extract | C + R |

| `include_feedback_guidance` | Design Page (~3216) | Step param + extract | C |



### Post-generation queue (`getAssessmentPostGenerationElicitationQueue` ~8957)



When `assessment_pack` intent class matches (`resolveAssessmentIntentClassMetadata` ~7067): ordered factors = type, count, style mix, difficulty, **`feedback_required`**, coverage, cognitive demand — **no** `feedback_timing`, `assessment_interaction_mode`, or `feedback_display`.



Fallback when no intent class: mustAsk `assessment_type`, `assessment_total_items`; candidates include `feedback_required` only among feedback-related IDs.



**27-2 finding (R27-014):** Late queue **duplicates** brief-time optional set for type/count; does **not** close timing/interaction gaps.



---



## Focus semantics (27-2 audit)



### 1. `feedback_timing` (candidate factor — **missing**)



**Intended meaning:** When learners (or tutors) see correctness relative to activity flow — e.g. immediate self-check, after small-group discussion, end-of-session reveal, tutor-only reveal.



| Layer | Today | 27-1 evidence |

|-------|--------|---------------|

| **E** | No factor. `feedback_required` = commentary mode (`none` / `item_level` / `aggregate` / `both_item_and_aggregate`), pack ~542–558 | Climate needs *delayed* reveal; not captured |

| **O** | No step ordering rule tied to timing | Design Feedback pruned (R27-008) |

| **G** | GAI may emit `explanation_or_rationale` regardless | Answers in JSON, hidden later |

| **C** | Design Page: include answers only when `include_answers` true (~3224) | Fixture uses `feedback_display: none` at page root |

| **R** | `hideAnswers` when `feedback_display === "none"` (~23984) | Climate render test |



**Pack nuance:** Design Assessment option `reflection_then_answers` (~2763–2765) describes timing in **blueprint prompt-shaping** but is **not** a brief factor and **not** implemented in renderer mode switch (~23965–23978).



**Candidate ID (doc only):**



```text

feedback_timing

  choices: immediate_self_check | after_peer_discussion | end_of_session_reveal | tutor_led_reveal_only

  default: immediate_self_check

  askWhen: assessment_required && page in session_materials

```



---



### 2. `assessment_interaction_mode` (candidate factor — **missing**)



**Intended meaning:** Pedagogical stance of the assessment segment — not the same as `assessment_type` (MCQ/T/F).



| Mode | Brief signals (examples) | Today |

|------|--------------------------|--------|

| `retrieval_practice` | “formative questions”, “quiz”, “check understanding” | **Default** path (H2) |

| `discussion_oriented` | “misconception discussion”, “discuss before checking” | Only in **activity** materials (climate) |

| `diagnostic_misconception` | “misconception”, “diagnose”, “which claims are false” | GAI prompt: misconception-aware distractors (~pack §9); **no E factor** |

| `confidence_based` | “confidence rating”, “CARS”, “certainty” | **Absent** in LD pack grep |



| Layer | Ownership |

|-------|-----------|

| **E** | **Primary gap** — no factor; workshop/assessment regex does not read “misconception discussion” as assessment mode |

| **O** | Lean assessment pack excludes activity chain when `formative assessment` + no activities (pack ~301–322); co-mention fixes RNA only via `activities_required` |

| **G** | DLA encodes discussion; GAI encodes item bank + optional per-item feedback |

| **C** | No `assessment_interaction_mode` on page metadata |

| **R** | Closed for presentation; does not infer mode |



**Candidate ID (doc only):**



```text

assessment_interaction_mode

  choices: retrieval_practice | discussion_oriented | diagnostic_misconception | confidence_based | mixed

  default: retrieval_practice

  mapsTo: step_generate_assessment_items.stimulus_mode / composition notes (27-4 design)

```



---



### 3. Answer visibility — pedagogy vs render policy (validated H4)



**Two channels (often confused):**



| Channel | Purpose | Set by | 27-1 behaviour |

|---------|---------|--------|----------------|

| **Pedagogical contract** | Should items *exist* with answers for marking/tutor? | Brief intent, GAI, tutor pack | GAI prompt **requires** answer fields in JSON |

| **Learner export policy** | Should *learner HTML* show answers? | `include_answers`, `feedback_display`, C omission | RNA/inflation: no `correct_answer` in page JSON; climate: answers in JSON + `feedback_display: none` |



**Extract (`app.js` ~7316–7334):**



- Hide: `no answers`, `hide answers`, `reveal answers after submission` — **does not** match “do not reveal **correct** answers” (R27-007).

- Show: `correct answers` substring matches even inside negation → `include_answers: true`.



**Design Page patch (~7986–8012):** If `assessment_type === mcq` or item-level feedback, may force `include_answers: true` unless explicitly false — can **override** hide intent.



**Renderer (~23984–24085):** Suppresses inline answers when `feedback_display === "none"`; `answer_grid_end` / `answers_explanations` defer to grid — **presentation only**.



**27-2 decision (R27-012):** Treat answer visibility for **learner pages** as **C + R policy** today; treat **misconception + delayed reveal** as **E + O + G** gap because neither `feedback_timing` nor reliable `include_answers` encodes it.



**Candidate IDs (doc only):**



```text

learner_answer_visibility   # learner-facing export only

  choices: hidden_until_reveal | show_after_activity_block | show_answer_grid_end | show_with_explanations

  distinct from: include_answers (tutor/marked artefact)



tutor_answer_artefact      # whether answer_key is generated at all

  choices: generate_internal_only | include_in_facilitator_page | include_in_learner_page

```



---



### 4. Facilitator-led / tutor-led reveal



| Layer | Today | Evidence |

|-------|--------|----------|

| **E** | `page_profile: facilitator` from “facilitator guide/pacing notes” (~7305) | Inflation probe: facilitator profile vs learner `desiredOutputs` (R27-011) |

| **O** | No “tutor reveals answers after debrief” topology rule | Design Feedback pruned without “feedback pack” phrases |

| **G** | Facilitator_moves on **activities**; assessment items still learner-item shaped | |

| **C** | Facilitator page profile could include answers; learner profile omits | Not tested live in 27-1 |

| **R** | Same `feedback_display` path for learner export | |



**Candidate ID (doc only):** `feedback_timing: tutor_led_reveal_only` + `page_profile: facilitator` for tutor pack; requires **E** disambiguation so pacing notes do not alone flip profile (R27-011).



---



### 5. Peer discussion / peer instruction



| Layer | Today | Evidence |

|-------|--------|----------|

| **E** | No peer-instruction factor; `grouping` on activities only | Inflation: `small_group` in fixture activities |

| **O** | `Construct Learning Sequence` included when `workshop` + sequence cues (~10254–10259) | Climate/inflation probes include CLS |

| **G** | `discussion_prompts`, `task_cards` in activity materials (climate fixture) | R27-010: `activities_required` not extracted for “task cards” |

| **C** | Materials embedded under `learning_activities`; assessment is separate `assessment_check` | |

| **R** | Prompt-set / card grid render (closed) | |



**Gap:** Sequence of “discuss → then check” is **implicit** in session plan prose, not a binding between activity block and assessment visibility.



**Candidate ID (doc only):**



```text

peer_instruction_phase

  choices: none | think_pair_share | small_group_discussion_then_check | whole_group_debrief_then_reveal

  couples with: feedback_timing = after_peer_discussion

```



---



### 6. Diagnostic misconception assessment



| Layer | Today | Evidence |

|-------|--------|----------|

| **E** | No diagnostic stance factor | Climate brief: misconception discussion — not mapped to assessment |

| **O** | Full activity chain via workshop heuristic | |

| **G** | GAI: “misconception-aware choices” (pack §9); DLA: rich misconception materials | Activity >> assessment interaction (H5) |

| **C** | T/F items with `true_false_answer` in JSON; proposition stems | `ld-climate-misconception-discussion-page.json` |

| **R** | T/F layout without revealed answer (test L139–149) | |



**Gap:** Diagnostic **intent** lives in activities; assessment block is still **retrieval-shaped** (T/F propositions) without elicited link to discussion phase or delayed reveal.



**Candidate ID (doc only):** `assessment_interaction_mode: diagnostic_misconception` + optional `misconception_catalog_source: from_activity_materials | from_knowledge_model`.



---



### 7. Confidence-based assessment (CARS-style)



| Layer | Today |

|-------|--------|

| **E–R** | **No** factor, prompt option, or item_type in LD pack (27-2 grep) |



**Candidate ID (doc only):** `confidence_rating_required: boolean` + item schema extension (27-4 only — out of scope for investigation implementation).



---



### 8. Design Feedback — topology inclusion rules (validated)



**Included when (pack `triggerRules` ~298–299):**



- Brief mentions: `feedback pack`, `learner feedback`, `feedback guidance`, `formative feedback`



**Included when (app.js `explicitFeedbackRequested` ~10169–10171):**



- Same phrase family: `feedback pack|design feedback|learner feedback|feedback guidance|formative feedback`



**Pruned when (~11174):**



- Step title `design feedback` and **not** `explicitFeedbackRequested`



**Not sufficient to include (27-1 cases):**



- “formative assessment”, “formative check”, “formative questions”

- “misconception discussion”, “do not reveal answers”

- Workshop + activities + assessment co-presence



**Implication:** `feedback_pack` artefact step is **decoupled** from formative assessment wording. `feedback_required` optional factor controls Design Page / commentary patches but **does not** add Design Feedback step to topology.



**Layer ownership:** **O** (primary), **E** (missing cue → factor mapping), **G** (orphaned step when pruned)



---



## Validated gap list (27-2)



Priorities retained from 27-1 draft; validated and extended with layer tags and evidence IDs.



| P | Gap | Primary layer | Secondary | 27-1 / 27-2 evidence |

|---|-----|---------------|-----------|----------------------|

| **P1** | No **`assessment_interaction_mode`** (discussion / diagnostic / confidence) | **E** | O, G | Matrix Cases B–C; H3, H5 |

| **P2** | No **`feedback_timing`**; `feedback_required` ≠ timing | **E** | O, C, R | Climate delayed reveal; pack `reflection_then_answers` not in extract/renderer |

| **P3** | **Answer visibility** = export policy, not generation pedagogy | **C, R** | E, G | R27-007, R27-009; GAI still requires answer fields |

| **P4** | **`include_answers` extract** false positive / negation blind spot | **E** | C | R27-007 (`app.js` ~7316–7328) |

| **P5** | **Design Feedback** pruned unless explicit feedback-pack phrases | **O** | E | R27-008; not triggered by “formative assessment” |

| **P6** | **`feedback_display`** on page rarely derived from brief; climate fixture manual | **E, C** | R | Case C matrix; renderer `none` (~23984) |

| **P7** | **`reflection_then_answers`** in Design Assessment pack **not** wired to renderer | **R** (anomaly) | E, C | Pack ~2763; `app.js` ~23965–23978 no branch |

| **P8** | **Design Assessment** pruned on lean / sparse paths | **O** | E | Case A topology; `assessment_pack` `defaultExclude` (~1764) |

| **P9** | **Activity cues** (`task cards`) not in `activities_required` regex | **E** | O | R27-010; O recovers via `workshop` |

| **P10** | **Collateral extract** skews `page_profile` / `assessment_type` | **E** | O, G | R27-011 inflation probe |

| **P11** | **Post-gen queue** does not elicit timing/interaction; duplicates type/count | **E** | — | `intentClasses.assessment_pack` ~1737–1759; ~8957 |

| **P12** | **Diagnostic misconception** only in activity/materials prompts, not assessment elicitation | **G** | E, C | Climate fixture; H5 |

| **P13** | **Confidence-based assessment** not modeled | **E** | G | 27-2 pack grep — absent |

| **P14** | **Peer-instruction sequencing** not bound to assessment reveal | **O** | E, C | Inflation CLS + separate `assessment_check` |



---



## Candidate factor catalogue (documentation only — 27-4)



| ID | Meaning | Suggested type | Ask when | Maps to (proposed) |

|----|---------|----------------|----------|---------------------|

| `feedback_timing` | When answers/feedback become visible to learners | select | `assessment_required` + learner page | Design Page metadata, `feedback_display`, O ordering |

| `assessment_interaction_mode` | Retrieval vs discussion vs diagnostic vs confidence | select | `assessment_required` | GAI prompt + Design Assessment blueprint |

| `learner_answer_visibility` | Learner export policy (distinct from tutor key) | select | learner `page_profile` | Design Page `include_answers`, page `feedback_display` |

| `tutor_answer_artefact` | Whether to generate tutor-only answer key | select | facilitator/assessment profile | GAI `answer_key`, separate page section |

| `peer_instruction_phase` | Discuss-before-check pattern | select | workshop + activities + assessment | CLS + `feedback_timing` |

| `misconception_assessment_link` | Tie check to activity misconception set | boolean | `diagnostic_misconception` mode | GAI coverage / stems from activity materials |

| `confidence_rating_required` | CARS-style confidence per item | boolean | explicit brief cue | GAI item schema (future) |

| `design_feedback_required` | Force Design Feedback step in topology | boolean | `feedback_timing` ≠ immediate or diagnostic mode | O `explicitFeedbackRequested` expansion |



**Explicit non-goals for 27-4 (until probed in 27-3):** Changing renderer unless JSON contract changes; MCQ styling (closed Sprint 26).



---



## Generation vs composition vs rendering (summary diagram)



```text

Brief

  └─ E: assessment_required, assessment_type, assessment_total_items, feedback_required,

         include_answers (buggy), page_profile, activities_required

  └─ O: step list, Design Feedback prune, Design Assessment prune, workshop rich path

  └─ G: assessment_items (+ answer fields), learning_activities (+ materials), [feedback_pack if O]

  └─ C: page.sections[], include_answers option, feedback_display on page (often unset)

  └─ R: feedback_display modes none | answer_grid_end | answers_explanations (inline suppress/grid)

```



---



## References



- [`elicitation-evidence-matrix.md`](elicitation-evidence-matrix.md) — Cases A–C, prompt compare  

- [`review-log.md`](review-log.md) — R27-006–018  

- [`context-files/27-1-extraction-probe.js`](context-files/27-1-extraction-probe.js)  

- LD pack: `workflowBriefConfig` ~340+, `intentClasses.assessment_pack` ~1720+, `triggerRules` ~298, Design Assessment `feedback_display` ~2742  

- `app.js`: extract ~7288–7334, Design Page patch ~7986–8012, heuristics ~10169–11220, post-gen queue ~8957, render ~23958–24132  

- Sprint 26: [`../2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/`](../2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/)

