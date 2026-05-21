# Elicitation evidence matrix — Sprint 27



**Purpose:** Compare pedagogical intent preservation across pipeline layers for three Sprint 26 evidence cases.  

**Status:** **27-1 complete** · **27-3 probes** P27-02/03/04 captured (E/O + P27-04 fixture proxy G/C/R).



**Layer key:** **E** elicitation · **O** orchestration · **G** generation · **C** composition · **R** rendering



**Test floor (27-1):** `node --test tests/*.test.js` → **259 passed**, 0 failed.



---



## Matrix columns (per case)



| Column | Question |

|--------|----------|

| Workflow brief | What did the educator ask for? |

| Elicitation questions | What does Factory / `workflowBriefConfig` ask? |

| Resolved assumptions | `extractWorkflowBriefExplicitFactors` + resolved panel |

| Workflow topology | Post-heuristic `steps[]` |

| Activity artefacts | `learning_activities`, `activity_materials` |

| Assessment artefacts | `assessment_items`, optional `feedback_pack`, blueprint |

| Composed page | `page.sections[]`, metadata, `feedback_display` |

| Rendered output | Export HTML semantics (not CSS) |

| Intent preservation | Pass / partial / fail + primary layer tag |



---



## Case A — RNA/HCV sparse workshop (self-study + transcript)



**Sprint 26 finding:** Activity/material topology dropped when formative assessment co-mentioned; assessment forward. **Track A fixed** in code/tests.



| Dimension | Intended (brief) | Observed (evidence) | Layer | Notes |

|-----------|------------------|---------------------|-------|-------|

| Workflow brief | Self-study follow-up; short **learning activities** + short **formative assessment**; lecture transcript | `tests/fixtures/workflow-brief-ld-sparse/rna-virus-activities-formative.json` | — | HCV/RNA topic |

| Elicitation questions | Topic, level, scope, delivery, input strategy; optional `assessment_type`, `assessment_total_items`, `feedback_required`, `page_profile` | LD `workflowBriefConfig` optionalFactors (`domain-learning-design-step-patterns.md` ~402–593) | **E** | No discussion-mode / feedback-timing factors |

| Resolved assumptions | `activities_required`, `assessment_required`, `materials_required`, `provided_source_content`, learner page | Extract test: `workflow-ld-rna-sparse-brief-topology.test.js` L106–108; probe `context-files/27-1-extraction-probe.js` | **E** | `include_answers` / `feedback_display` **unset** on brief |

| Workflow topology | Outcomes → **Design Learning Activities** → **Generate Activity Materials** → **Generate Assessment Items** → **Design Page** | Test L137–151; probe steps: NC → MK → DLO → DLA → GAM → GAI → CLS → DP | **O** | **Design Feedback** absent (no brief cue); **Design Assessment** absent |

| Activity artefacts | Short activities grounded in transcript | *No live G capture in 27-1* | **G** | DLA prompt requires `learner_task`, `required_materials`, `facilitator_moves` (pack §5, ~2547) |

| Assessment artefacts | Short formative check | GAI prompt requires `correct_answer` / `answer_key` when generated (pack §9, ~2954) | **G** | Topology now reaches GAI (Sprint 26-A) |

| Composed page | Activities + `assessment_check` | `ld-rna-hcv-assessment-page.json`: 10 MCQs, **stem + options only** (no `correct_answer` fields) | **C** | Assessment-only page fixture; `source_artefacts` not listed for activities |

| Rendered output | Learner page; MCQs visible; answers not shown | `utility-ld-rna-assessment-page-render.test.js` L128–144: 10 items, **no** “Correct answer” / “Answer Key” | **R** | Sprint 26-B closed for assessment section render |

| Intent preservation | Activities + assessment co-equal | **Partial (fixed at O/E)** | **E,O** | Pre-fix failure was topology; fixtures/tests document post-fix chain |



**Factor audit (RNA brief text):**



| Factor | Value | Source |

|--------|-------|--------|

| `assessment_required` | `true` | `formative assessment` → `app.js` ~7294 |

| `activities_required` | `true` | `learning activities` → ~7296–7298 |

| `materials_required` | `true` | activities + learner-facing page → ~7408–7413 |

| `include_answers` | — | not set |

| `feedback_required` | — | not set |

| `feedback_display` | — | not on page fixture |

| `assessment_type` | — | not inferred (no mcq cue) |

| `assessment_total_items` | — | “short” not parsed as count (~7364–7385) |



**References:** `rna-virus-activities-formative.json`, `workflow-ld-rna-sparse-brief-topology.test.js`, `ld-rna-hcv-assessment-page.json`, `utility-ld-rna-assessment-page-render.test.js`



**Hypothesis touchpoints:** H3 (type/count weak vs activity co-presence), H6 (O drop pre-fix), H2 (lean path avoided when activities_required)



---



## Case B — Inflation workshop (60-minute, activities + formative questions)



**Sprint 26 finding:** Assessment renders; page fixture omits answer fields; export does not reveal answers without `feedback_display` / answer fields.



| Dimension | Intended (brief) | Observed (evidence) | Layer | Notes |

|-----------|------------------|---------------------|-------|-------|

| Workflow brief | 60-min workshop; activities + formative questions; group discussion, case study, facilitator notes; learner page | Orchestration test goal L93–94; full page fixture | — | |

| Elicitation questions | Standard optional assessment factors + `activity_pattern_mix`, `sequencing_granularity` | Pack optionalFactors | **E** | “Formative assessment questions” → `assessment_required`; no item count in brief |

| Resolved assumptions | `assessment_required`, `activities_required`, `materials_required`, `live_workshop`, `learner_level`; side effects: `page_profile: facilitator` (from “facilitator pacing notes”), `assessment_type: case_study` (from “case study” in inputs) | Probe `27-1-extraction-probe.js` (Inflation row) | **E** | Facilitator **page_profile** mismatch vs `desiredOutputs: learner-facing page` |

| Workflow topology | GLC → MK → DLO → DLA → GAM → **Design Assessment** → GAI → CLS → DP | Probe steps; `workflow-ld-orchestration.test.js` L91–120 (GLC order, GAM before DP) | **O** | Rich workshop chain (`workshopRichWorkflowIntent` ~10263–10267). **Design Feedback** pruned (~11174) |

| Activity artefacts | 5 activities (A1–A5); materials in `activity_materials` section | `ld-inflation-workshop-page-full.json` L25–165 | **G** | Typed materials in separate section; some `materials: []` on activity rows |

| Assessment artefacts | Formative MCQ check | `assessment_check`: 1 item, `item_type: mcq`, **no** `correct_answer` | **G/C** | `source_artefacts` lists activities/materials/sequence but **not** `assessment_items: true` |

| Composed page | `assessment_check` + rich `learning_activities`; no root `feedback_display` | Fixture L167–184; metadata has `page_profile: learner` only | **C** | Composition dropped answer-bearing fields |

| Rendered output | MCQ stem/options; no answer reveal | `utility-ld-rna-assessment-page-render.test.js` L171–174 (inflation MCQ body); RNA test pattern: no “Correct answer” | **R** | Renderer closed; presentation follows JSON absence |

| Intent preservation | Formative check + rich workshop activities | **Partial** | **E,C** | Pedagogy rich in activities; assessment thin (1 MCQ, no answers in page JSON) |



**Factor audit (inflation workshop brief):**



| Factor | Value | Source |

|--------|-------|--------|

| `assessment_required` | `true` | `formative assessment questions` |

| `activities_required` | `true` | `activities` |

| `include_answers` | — | not set |

| `feedback_display` | — | absent on fixture root |

| `feedback_required` | — | not set |

| `assessment_type` | `case_study` | “case study” in inputs (~7313) — may skew GAI params |

| `assessment_total_items` | — | not inferred |

| `page_profile` (extract) | `facilitator` | “facilitator pacing notes” (~7305) vs learner desired output |



**References:** `ld-inflation-workshop-page-full.json`, `utility-ld-inflation-page-render.test.js`, `workflow-ld-orchestration.test.js`, probe script



**Hypothesis touchpoints:** H1 (rich G in activities; C simplifies assessment), H2 (workshop rich vs lean assessment pack), H4 (no answers in page JSON → no reveal in R), H5



---



## Case C — Climate misconception discussion (hide answers on handout)



**Sprint 26 finding:** Discussion-oriented materials in activities; T/F check; answers in JSON but hidden in export via `feedback_display: none`.



| Dimension | Intended (brief) | Observed (evidence) | Layer | Notes |

|-----------|------------------|---------------------|-------|-------|

| Workflow brief | Misconception **discussion**; task cards, analysis template, T/F check; **do not reveal correct answers** on student handout | Paraphrase in probe; fixture mirrors production shape | — | |

| Elicitation questions | Same LD config — no `discussion_assessment_mode` / `feedback_timing` | Pack optionalFactors | **E** | Gap |

| Resolved assumptions | Probe: `include_answers: true` (see below); `page_profile: learner`; **no** `activities_required` flag; fixture sets `feedback_display: "none"` | Probe + `ld-climate-misconception-discussion-page.json` L6 | **E** | **Extract bug:** “correct answers” substring in “do not reveal **correct answers**” matches `explicitIncludeAnswersCueRe` (~7316–7328) |

| Workflow topology | DLA → GAM → GAI → CLS → DP (no Design Feedback) | Probe Climate row; `workshop` in goal drives session/sequence cues (~10247–10259) | **O** | Activities chain from `workshop` in `explicitSessionOrActivityRequested` (~10190–10191), not `task cards` |

| Activity artefacts | `task_cards`, `analysis_template`, `discussion_prompts`, `evaluation_checklist` embedded in activity `materials` | Fixture L16–40 | **G** | High interaction richness |

| Assessment artefacts | 2× `true_false`; `true_false_answer` present | Fixture L48–59 | **G** | Answers generated in JSON |

| Composed page | `feedback_display: "none"` at page root; answers retained in items | Fixture L6, L52–58 | **C** | Composition preserves answers for renderer policy |

| Rendered output | T/F options; **no** “Correct answer” | `utility-ld-climate-misconception-page-render.test.js` L139–149 | **R** | Sprint 26 hotfix closed R |

| Intent preservation | Discussion-first; delayed/hidden correctness | **Partial** | **E,C,R** | Intent achieved in fixture via **manual** `feedback_display`, not reliable extract |



**Factor audit (climate paraphrase brief vs fixture):**



| Factor | Brief extract (probe) | Fixture / render |

|--------|----------------------|------------------|

| `include_answers` | **`true`** (false positive) | N/A at root; items have `true_false_answer` |

| `feedback_display` | — | `"none"` |

| `feedback_required` | — | — |

| `assessment_required` | implied via “formative check” | section present |

| `activities_required` | **not set** (`task cards` not in activity regex ~7296) | rich activities present |



**References:** `ld-climate-misconception-discussion-page.json`, `utility-ld-climate-misconception-page-render.test.js`, `app.js` ~7316–7328, probe script



**Hypothesis touchpoints:** H4 (visibility = presentation flag; extract unreliable), H5 (activities >> assessment interaction), H3 (discussion mode not elicited)



---



## Prompt contract comparison (27-1)



| Step | Pack section | Interaction / pedagogy emphasis | Assessment–feedback fields |

|------|--------------|--------------------------------|-----------------------------|

| **Design Learning Activities** | §5 (~2516–2604) | **High:** `learner_task`, `expected_output`, `required_materials`, `facilitator_moves`, `failure_mode`, grouping, duration | None |

| **Generate Assessment Items** | §9 (~2920–3078) | **Medium–high (item bank):** stems, distractors, `correct_answer`, `true_false_answer`, `answer_key`, optional per-item feedback via `feedback_mode` userOption | Item types, difficulty, coverage |

| **Design Feedback** | §8 (~2828–2913) | **High potential:** `feedback_pack`, misconception guidance — **requires** `assessment_items` | Only if topology includes step (~11174 prune) |

| **Design Page** | §13 (~3187–3224) | **Composition only:** `include_answers`, `include_feedback_guidance` booleans; preserve/omit answer fields | `feedback_display` in blueprint option (Design Assessment), not brief extract |



**H5 evidence:** DLA template (~2547) mandates runnable tasks and facilitator moves; GAI template (~2954) mandates item schema and answer_key; Design Feedback (~2907) is separate artefact — **often not in topology** for these three cases.



---



## 27-3 workflow probes (priority)

**Method:** [`context-files/27-3-probe-runner.js`](context-files/27-3-probe-runner.js) + [`27-3-probe-capture.json`](context-files/27-3-probe-capture.json). Live `assessment_items` / `feedback_pack` / composed page: **PENDING** except P27-04 fixture proxy.

| Probe | Candidate factors (intended) | E capture | O topology | Design Assessment | Design Feedback | G/C/R |
|-------|------------------------------|-----------|------------|-------------------|-----------------|-------|
| **P27-02** | `feedback_timing`, `discussion_oriented`, hidden answers, `design_feedback_required` | **Drop:** timing/mode null; `include_answers: true`; `page_profile: facilitator` | DLA+GAM+CLS+DP; **GAI before DLA** | No | No | **PENDING** |
| **P27-03** | `peer_instruction_phase`, `after_peer_discussion`, 6 MCQs | **Partial:** count/type/activities; no timing/peer; `page_profile: assessment` | DLA→GAM→GAI→CLS→DP | No | No | **PENDING** |
| **P27-04** | `diagnostic_misconception`, hidden answers, `misconception_assessment_link` | **Drop:** mode/link null; `include_answers: true`; `activities_required: true` | DLA→GAM→GAI→CLS→DP | No | No | **Proxy:** climate page fixture |

**Primary question (27-3):** Do candidate factors explain loss? **Yes** — they name dimensions that are **null at E** for all three probes; **O** drops `design_feedback_required`; **C/R** for hidden answers only appear in P27-04 proxy via `feedback_display`, not via `include_answers` extract.

Probe notes: [`probe-p27-02-resolved-factors.md`](context-files/probe-p27-02-resolved-factors.md), [`probe-p27-03-peer-instruction.md`](context-files/probe-p27-03-peer-instruction.md), [`probe-p27-04-assessment-items-excerpt.md`](context-files/probe-p27-04-assessment-items-excerpt.md).

---

## Cross-case comparison



| Semantic dimension | RNA/HCV | Inflation | Climate |

|--------------------|---------|-----------|---------|

| Discussion mode explicit in brief | Implied (activities) | Weak (group discussion) | **Strong** (misconception discussion) |

| Discussion mode in elicitation factors | **No** | **No** | **No** |

| `activities_required` extract | **Yes** | **Yes** | **No** (workshop heuristic still adds DLA) |

| `assessment_required` extract | **Yes** | **Yes** | Via “formative check” |

| `feedback_display` on page | — | — | **`none`** (fixture) |

| `include_answers` extract | — | — | **`true` false positive** on hide-answers brief |

| Design Feedback in topology | **No** | **No** | **No** |

| Design Assessment in topology | **No** | **Yes** (workshop rich) | **No** |

| Activity interaction richness (fixture) | Low (assessment-only page fixture) | **High** (5 activities, materials) | **High** (typed materials) |

| Assessment interaction richness | MCQ retrieval (10 items) | MCQ retrieval (1 item, no answer in page) | T/F proposition (answers in JSON, hidden in R) |



---



## Hypothesis verdict table (27-1 adjudication)



| ID | Verdict | Evidence (27-1) |

|----|---------|-----------------|

| H1 | **Supported (partial mechanism)** | Inflation/climate fixtures: rich **G** activity JSON; **C** page omits `correct_answer` on MCQs (inflation, RNA fixtures); **R** does not invent answers |

| H2 | **Supported (partial)** | Lean assessment pack rule excludes activity chain (pack ~301–322); RNA/inflation/climate briefs avoid that path; inflation workshop uses `workshopRichWorkflowIntent` (~10263–10267) |

| H3 | **Supported** | Factory optional factors weight `assessment_type`, `assessment_total_items`, `feedback_required` (~520–593); no discussion-mode / feedback-timing; climate `activities_required` not extracted for “task cards” |

| H4 | **Supported** | `include_answers` / `feedback_display` / renderer (~7986–8012, ~24203+, climate L6); climate hide-answers brief sets `include_answers: true` via substring (~7316–7328) |

| H5 | **Supported** | Prompt compare above; Design Feedback pruned when brief lacks feedback-pack cues (~10169–10171, ~11174) |

| H6 | **Supported** | RNA pre-fix O drop (Sprint 26); inflation C drops answers; climate E extract ≠ fixture `feedback_display`; Design Feedback absent all cases |



*Final R27 log entries → [`review-log.md`](review-log.md)*



---



## Artefact / test index



| Asset | Path |

|-------|------|

| RNA topology fixture | `tests/fixtures/workflow-brief-ld-sparse/rna-virus-activities-formative.json` |

| RNA topology test | `tests/workflow-ld-rna-sparse-brief-topology.test.js` |

| RNA assessment page | `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` |

| Inflation full page | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` |

| Climate page | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |

| Climate render test | `tests/utility-ld-climate-misconception-page-render.test.js` |

| 27-1 extraction probe | `context-files/27-1-extraction-probe.js` |
| 27-3 probe capture JSON | `context-files/27-3-probe-capture.json` |
| P27-02 note | `context-files/probe-p27-02-resolved-factors.md` |
| P27-03 note | `context-files/probe-p27-03-peer-instruction.md` |
| P27-04 note | `context-files/probe-p27-04-assessment-items-excerpt.md` |

