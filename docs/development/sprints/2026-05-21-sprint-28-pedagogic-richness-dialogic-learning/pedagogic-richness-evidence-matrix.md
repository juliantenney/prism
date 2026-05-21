# Pedagogic richness evidence matrix — Sprint 28

**Purpose:** Compare **pedagogic richness** and **cognitive engagement architecture** across pipeline layers — whether materials model **how learning unfolds**, not only which **instructional artefacts** exist. Assessment/feedback semantics are **Sprint 27 stabilised** — out of scope here.

**Status:** **28-1–28-3 investigation complete** (2026-05-21). **28-4 charter drafted** — [`slice-28-4-charter.md`](slice-28-4-charter.md). **Climate Case 1 fixture scores unchanged**; **P28-01 live** is a separate richer-brief run.

**Strategic lens:** **Self-study** and **learner-facing resources** are primary strategic use-cases; **tutor-led** workshops (e.g. climate) are **stress-tests** that surface scaffolding and learner-model gaps visibly.

**Layer key:** **E** elicitation · **O** orchestration · **G** generation · **C** composition · **R** rendering

**Test floor:** `node --test tests/*.test.js` → **311 passed** (verified 28-1)

**Rubric:** [`activity-materials-quality-notes.md`](activity-materials-quality-notes.md)

---

## Matrix columns (per case)

| Column | Question |
|--------|----------|
| Workflow brief | What dialogic/rich pedagogy did the educator ask for? |
| Elicitation / resolved | Richness-related factors (explicit, inferred, default) |
| Workflow topology | DLA, GAM, CLS, GAI, Design Feedback presence/order |
| Activity artefacts | `learning_activities`, `activity_materials` depth |
| Assessment artefacts | `assessment_items` (contrast for H5) |
| Composed page | `page.sections[]` — activity vs assessment blocks |
| Rendered output | Export HTML — dialogic content preserved? |
| Rubric scores | 0–3 per dimension (see quality notes) |
| Intent preservation | Pass / partial / fail + primary layer tag |
| Gap IDs | P1–Pn from quality notes |

---

## Case 1 — Climate misconception seminar (PRIMARY stress-test)

**28 framing:** Tutor-led workshop that **surfaces** missing **adaptive scaffolding (D6)** and **learner-model awareness (D7)**; same gaps would **harm self-study** more severely (no tutor recovery). **Sprint 27:** assessment/topology stabilised — not re-litigated here.

**Reference brief** (observation harness `tutor-led-seminar`; aligns with `workflow-ld-epistemic-grounding.test.js` `CLIMATE_SEMINAR_GOAL`):

> Design a 60-minute seminar on climate misconceptions. Small groups discuss scenario questions using task cards and prompts, then complete a 5-item formative check. Do not reveal correct answers on the student handout. The tutor will debrief answers after group discussion. Include facilitator notes and delayed feedback guidance.

**Inputs:** Facilitator notes with pacing, scenario prompts, debrief guidance for formative check.  
**Desired outputs:** Learner handout page plus facilitator session notes.

**Evidence sources:** Read-only extract/heuristics (current `app.js`, 2026-05-21); `tests/workflow-sprint27-post-stabilisation-observation.test.js`; `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json`; `tests/utility-ld-climate-misconception-page-render.test.js`; Sprint 27 `probe-p27-04-assessment-items-excerpt.md` (fixture proxy label). **No live Factory/OpenAI run** for this audit. **P27-02** documents **ocean acidification** (analogue brief), not this exact climate text — cited only where noted.

| Column | Observation (28-1) |
|--------|-------------------|
| **Workflow brief** | **Dialogic workshop:** small groups; **scenario questions**; **task cards** + **prompts**; **misconception** topic; **5-item formative check**; tutor **debrief** after discussion; **facilitator notes** + delayed feedback guidance; learner handout without revealed answers. |
| **Elicitation / resolved** | **Assessment/delivery (Sprint 27, evidenced):** `assessment_required: true` (explicit); `assessment_total_items: 5` (explicit); `activities_required: true` (explicit); `feedback_timing: tutor_led_reveal_only` (explicit); `assessment_interaction_mode: discussion_oriented` (explicit); `learner_answer_visibility: hidden_until_reveal` (explicit); `include_answers: false` (explicit); `peer_instruction_phase: small_group_discussion_then_check` (explicit); `design_feedback_required: true` (default). **Richness/dialogic (not evidenced as factors):** no `dialogic_mode`, `scenario_authenticity`, `facilitator_contingency`, `cognitive_progression`, or `anticipated_responses` in `workflowBriefConfig` / extract. **`misconception_assessment_link: false`** (default) despite “climate misconceptions” in goal. **`page_profile: facilitator`** (explicit) while desired outputs include **learner handout** — dual-audience intent not split. **`design_scope: single_activity`** (inferred) vs 60-minute **seminar** wording. |
| **Workflow topology** | **Evidenced** (read-only heuristics, climate brief): `Normalize Content` → `Generate Learning Content` → `Model Knowledge` → `Define Learning Outcomes` → `Design Learning Activities` → `Generate Activity Materials` → `Generate Assessment Items` → `Design Feedback` → `Construct Learning Sequence` → `Design Page`. Matches post–Sprint 27 observation harness checks (DLA before GAM; GAI before Design Feedback; Design Feedback before CLS/Design Page). **Facilitator-only page artefact** not represented as separate topology step. |
| **Activity artefacts (`learning_activities`)** | **Not evidenced** — no standalone `learning_activities` JSON in repo for this case. |
| **Activity artefacts (`activity_materials`)** | **Not evidenced** — no standalone `activity_materials` JSON in repo for this case. |
| **Assessment artefacts (`assessment_items`)** | **Not evidenced** as standalone artefact. **Partial proxy** via composed page items (fixture): 2× `true_false` only (brief asks **5** items) — see assessment column. |
| **Composed page** | **Evidenced** — `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json`. **Sections:** `overview`, `learning_activities`, `assessment_check`. **Single activity** `CC-MIS-1` (40 min, `small_group`) with `materials`: `task_cards` (10 bullet **false claims**), `analysis_template` (worksheet markdown), `discussion_prompts` (3 strings), `evaluation_checklist` (4 procedural checks). **`facilitator_moves`:** **not present** on activity object. **`expected_output`:** markdown list (template, notes, one-sentence correction). **Assessment block:** TF-1, TF-2 with `true_false_answer` in JSON. **`feedback_display: "none"`** at page root (Sprint 27 visibility — out of 28 rubric scope). **Facilitator session notes section:** **not evidenced** in fixture (learner page only). |
| **Rendered output** | **Evidenced** — `tests/utility-ld-climate-misconception-page-render.test.js`. **Activities:** ≥10 task cards in `util-card-grid`; typed template, prompt set, checklist, output block rendered (not flattened to plain bullets). **Assessment:** T/F options; **no** “Correct answer” in HTML. **Dialogic tension:** renderer preserves fixture text; does not add contingent facilitation. |
| **Rubric scores (0–3)** | **D1** Authentic scenario: **1** — named false claims, no roles/places/stakeholder scenario. **D2** Task-card specificity: **1** — claim list + split cards; weak per-card deliverable/time/role. **D3** Productive uncertainty: **2** — worksheet “uncertain” option; prompts invite persuasion/evidence. **D4** Dialogic prompts: **2** — peer-oriented questions; limited forced disagreement. **D5** Misconception confrontation: **2** — strong claim set; thin “why tempting” per claim. **D6** Facilitator contingent moves: **0** — **not evidenced** in fixture. **D7** Anticipated learner responses: **0** — **not evidenced**. **D8** Progressive sequencing: **1** — one 40-min block; checklist procedural. **D9** Peer discussion structure: **0** — seminar/small-group, not predict→pair→revise. **D10** Activity vs assessment balance: **2** — activities materially richer than 2 T/F items; brief/item count mismatch. **Mean (D1–D8, D10):** **1.2** · **Weakest:** D6, D7 (0); D1, D2, D8 (1). |
| **Intent preservation (dialogic richness)** | **Partial** — **G/C** (fixture proxy): misconception **claims** and discussion **prompts** present; **authentic scenarios**, **adaptive scaffolding (D6)**, **learner-model awareness (D7)**, **multi-phase progression**, and **5-item check** not fully realised. **E:** no cognitive-engagement richness factors; `misconception_assessment_link` false. **O:** activity chain **preserved** (H1 structure). Primary gap tag: **G** (cognition-in-materials), secondary **E**. Supports **H7** (artefacts > cognition). |
| **Gap IDs** | **P28-001**, **P28-002**, **P28-003**, **P28-004**, **P28-006** (confirmed); **P28-005** partial (count + specificity); **P28-007**, **P28-008** not supported for this case (render preserves structure). |

### Case 1 — Layer trace (richness-focused)

| Layer | Verdict | Evidence summary |
|-------|---------|------------------|
| **E** | **Partial** | Workshop/assessment semantics captured (observation harness); **dialogic richness dimensions absent**; `misconception_assessment_link` false; facilitator `page_profile` vs learner handout conflict. |
| **O** | **Pass (structure)** | Full DLA → GAM → GAI → Design Feedback → CLS → Design Page chain for climate brief (read-only trace + harness). |
| **G** | **Partial (proxy only)** | No standalone G artefacts; fixture implies **claim-list task cards**, **generic facilitator absence**, **2/5 assessment items**. |
| **C** | **Partial (proxy)** | Typed materials embedded in `learning_activities` section; answers in assessment JSON; no facilitator pack section. |
| **R** | **Pass (fidelity)** | Task cards, prompts, checklist, T/F render; no added pedagogy. |

### Case 1 — Hypothesis touchpoints (climate row only; programme verdicts pending)

| ID | Climate-row read | Notes |
|----|------------------|-------|
| **H1** | **Partial** | Topology/activity chain **pass**; material depth **shallow** on contingency and scenario. |
| **H2** | **Partial** | Procedural cards + claims; not authentic scenarios. |
| **H3** | **Supported** (absence) | No contingent facilitator moves in fixture. |
| **H4** | **Partial** | Prompts dialogic-lite; limited productive uncertainty. |
| **H5** | **Partial** | Activities **broader** than 2 T/F items; **not** 5-item check; items tightly worded. |
| **H6** | **Partial** | Single activity vs 60-minute multi-phase seminar ask. |
| **H7** | **Partial** (climate row) | Rich typed **artefacts**; weak **cognition modelling** (D6/D7 = 0). |

**Anchors:**

- `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json`
- `tests/workflow-sprint27-post-stabilisation-observation.test.js` (`tutor-led-seminar`)
- `tests/utility-ld-climate-misconception-page-render.test.js`
- `../2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/context-files/probe-p27-04-assessment-items-excerpt.md` (fixture proxy)
- `../2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/context-files/probe-p27-02-resolved-factors.md` (**analogue** — ocean acidification; pre–Sprint 27 topology)

**Future probe:** P28-01 (richer task cards brief) — **live run in 28-3** (see below); fixture row above **unchanged**.

---

## Live probe programme (28-3)

**Method:** Pack prompt templates + `extractWorkflowBriefExplicitFactors` / heuristics + OpenAI `gpt-4.1-mini` step chain (DLA → GAM → GAI → Design Page). **Not** full PRISM Run UI. Captures: [`context-files/`](context-files/).

| Probe | Key finding vs 28-1 fixture / E/O-only | Live mean rubric | H6–H12 |
|-------|------------------------------------------|------------------|--------|
| **P28-01** | **Richer brief** yields named scenarios, if-then `facilitator_moves`, embedded task cards — **large lift** vs climate fixture (1.2) | **~1.7** | H7 **weakened**; H11 **Partial**; H10/H12 **unchanged** |
| **P28-02** | **Reasoning revision cycle** in activities (predict → pair revise → reflect); solutions leak in materials | **~1.5** | H9 **strengthened**; H11 **Partial** |
| **P28-07** | **Transcript → dialogic activities** (not assessment-only); contrasts RNA page fixture | **~1.6** | H5/H7 **weakened** for transformation case; H12 **weakened** |

**Critical question answer:** Explicit pedagogic wording **can raise generation quality substantially** within existing field types — but **does not** add typed cognition schema, **does not** fix E factor gaps, and **default/sparse briefs** still converge to thin shells. Outcome: **B** — richer prose and phase structure, **not** a new internal representation layer.

---

## Case 2 — Peer instruction (prediction → discussion → revision)

**Briefs audited:**

| Source | Goal (abbrev.) |
|--------|----------------|
| Observation harness `peer-instruction` | Opportunity cost; answer individually → pairs → **revise**; 6 MCQs + reflection; solutions **after** pair discussion |
| Sprint 27 **P27-03** (stoichiometry) | Same peer-instruction shape; “emphasise pair discussion before confirming solutions” |

**Evidence:** Read-only E/O (`tests/workflow-sprint27-post-stabilisation-observation.test.js`, `manual-validation-observation-log.md`); `tests/workflow-ld-assessment-semantics-extract.test.js` (P27-03); `tests/workflow-ld-assessment-semantics-topology.test.js` (P27-03); `tests/workflow-ld-assessment-semantics-e2e.test.js` (27-4f composition path); [`probe-p27-03-peer-instruction.md`](../2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/context-files/probe-p27-03-peer-instruction.md) (historical E/O; superseded where tests differ). **No** peer-instruction `page.sections[]` fixture in repo. **No live G/C/R** for this case.

| Column | Observation (28-1c) |
|--------|---------------------|
| **Workflow brief** | **Reasoning revision cycle** explicit: individual attempt → pair discussion → **revise answers**; delayed solution confirmation; reflection prompts. Assessment = 6 MCQs. |
| **Elicitation / resolved** | **Harness (opportunity cost):** `assessment_required: true`; `assessment_total_items: 6`; `assessment_interaction_mode: discussion_oriented`; `feedback_timing: after_peer_discussion`; `peer_instruction_phase: none` (**default** — passes harness via “peer instruction” goal cue, **not** `think_pair_share`); `learner_answer_visibility: show_answer_grid_end`; `design_feedback_required: true`. **Not set:** `cognitive_progression`, `reasoning_revision_cycle`, dialogic richness factors. **P27-03 (stoichiometry, evidenced in tests):** `peer_instruction_phase: think_pair_share`; `activities_required: true`; `page_profile: learner`; `assessment_total_items: 6`. **`feedback_timing` / `assessment_interaction_mode`:** **not evidenced** on explicit extract for P27-03 (27-3 capture); E2E test **injects** `after_peer_discussion` to obtain `reflection_then_answers`. |
| **Workflow topology** | **Evidenced (harness + P27-03):** NC → GLC → MK → DLO → DLA → GAM → GAI → CLS → Design Page. **DLA before GAI** (27-4b). **Design Feedback:** **not evidenced** on P27-03 topology test (contrast tutor-led P27-02). |
| **Activity artefacts** | **Not evidenced** — no `learning_activities` / `activity_materials` JSON for peer briefs. Pack **requires** `facilitator_moves`, `failure_mode` on DLA — **live G not captured**. |
| **Assessment artefacts** | **Not evidenced** standalone. E2E uses synthetic `assessment_items` with `explanation_or_rationale: "Discuss in pairs before confirming."` — **composition contract only**, not generative depth. |
| **Composed page** | **Not evidenced** for full peer session (activities + phased prompts + MCQ). **Partial contract (27-4f):** page may contain **assessment_check only**; `feedback_display: reflection_then_answers` when `feedback_timing: after_peer_discussion` is **resolved**; correct answers **in JSON**, **hidden** in HTML until “Self-check answers” block. |
| **Rendered output** | **Partial (27-4f synthetic page):** stem appears **before** “Self-check answers” in HTML — **ordering** supports discussion-before-reveal, **not** distinct predict/discuss/revise **activity** sections. |
| **Rubric (0–3)** | **D1** **0** — no scenario artefact. **D2** **0**. **D3** **0** — harness default end-reveal visibility; no sustained uncertainty in materials. **D4** **0** — no dialogic prompt set in fixture. **D5** **0** — no misconception repair path. **D6** **0** — no adaptive scaffolding branches. **D7** **0** — no anticipated responses. **D8** **1** — workflow orders activities before assessment; **no phased activity architecture** in composed output. **D9** **1** — **partial:** timing/phase factors at **E** (`after_peer_discussion`, `think_pair_share` on P27-03); **not evidenced** as distinct predict → discuss → revise **blocks** in page/activities. **D10** **N/A** (no full page). **Mean (scored dims):** **≈ 0.2**. |
| **Intent preservation (cognitive engagement)** | **Partial (E/O)** / **Fail (G/C)** — brief encodes **revision cycle** linguistically; system captures **assessment timing** partially; **does not evidence** reasoning revision, misconception reconciliation, or dialogic phase structure in learner-facing activity materials. |
| **Gap IDs** | **P28-003**, **P28-013**, **P28-006** |

### Case 2 — E/O focus questions

| Question | Answer |
|----------|--------|
| Does E encode **reasoning revision** vs discussion presence only? | **Partial** — `feedback_timing: after_peer_discussion` (harness); `peer_instruction_phase` often **default `none`** (harness) or `think_pair_share` (P27-03 only). **No** explicit “revise reasoning” / `reasoning_revision_cycle` factor. |
| Are predict / discuss / revise phases **distinct** in O? | **No** in composed artefacts — **yes** only as **brief prose** + step **order** (DLA → GAI). |
| Revise reasoning explicitly? | **Not evidenced** in G/C. |
| Misconceptions surfaced & reconciled? | **Not evidenced**. |
| Dialogic vs procedural prompts? | **Not evidenced** (no activity materials fixture). |
| Cognitive tension sustained? | **Not evidenced**. |
| Alternative explanations compared? | **Not evidenced**. |
| Adaptive scaffolding / learner anticipation? | **Not evidenced** (D6/D7 = 0). |

**Probe:** P28-02 · **Hypotheses:** **H4** Partial, **H6** Supported, **H7** Supported, **H9** (revision cycle) **Partial** at E only

---

## Case 3 — Uploaded transcript → dialogic activities

**Briefs audited:**

| Source | Role |
|--------|------|
| `tests/fixtures/workflow-brief-ld-sparse/rna-virus-activities-formative.json` | RNA/HCV follow-up; `provided_source_content` |
| Observation harness `transcript-source` | “Provided lecture transcript” → activities + short formative (empty inputs) |
| Sprint 27 **P27-04** | Transcript → **misconception workshop** (climate analogue for source transformation) |
| `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` | **C/R** proxy for RNA learner page |

**Evidence:** `tests/workflow-ld-rna-sparse-brief-topology.test.js`; observation harness + log; `tests/workflow-ld-epistemic-grounding.test.js` (GLC omission for `provided_source_content`); P27-04 note + climate fixture (workshop analogue). **No** `learning_activities` JSON for RNA transcript brief. **No live G** from transcript brief.

| Column | Observation (28-1c) |
|--------|---------------------|
| **Workflow brief** | Transform **uploaded lecture** into **short learning activities** + **short formative assessment** (RNA/HCV). Epistemic: stay faithful to source. Pedagogic ask: **build on lecture knowledge** (follow-up), not paste transcript. |
| **Elicitation / resolved** | **RNA sparse (evidenced):** `input_strategy: provided_source_content`; `activities_required`, `assessment_required`, `materials_required: true`. **Not set:** “short” counts, `cognitive_progression`, `misconception_assessment_link`, dialogic transformation factors. **Harness `transcript-source`:** `provided_source_content`; `assessment_required: true`; `assessment_total_items: 10` (**default**); `assessment_interaction_mode: retrieval_practice` (**default**); `feedback_timing: immediate_self_check` — **misaligned** with “formative” + activities wording. **P27-04 (climate transcript analogue):** `misconception_assessment_link: true`; `diagnostic_misconception`; `hidden_until_reveal` — **richer E** when brief requests misconception **workshop** (not RNA brief). |
| **Workflow topology** | **RNA sparse test (evidenced):** NC → MK → DLO → DLA → GAM → GAI → Design Page (materials before assessment). **Harness transcript-source (evidenced):** NC → MK → DLO → DLA → GAM → Design Page — **`Generate Assessment Items` absent** despite `assessment_required: true` (**topology gap**). **GLC omitted** for provided source (epistemic grounding test) — **correct** for authority of upload. **Construct Learning Sequence / Design Feedback:** **not evidenced** on RNA sparse fixture expectations. |
| **Activity artefacts** | **Not evidenced** for RNA brief. **P27-04 analogue (climate page fixture):** `learning_activities` section with task cards, prompts — **transcript → dialogic workshop** possible when brief **asks** for misconception materials; **not** evidenced for RNA/HCV brief path. |
| **Assessment artefacts** | **Not evidenced** standalone. RNA page fixture: 10 MCQs in composed section. |
| **Composed page** | **Evidenced** — `ld-rna-hcv-assessment-page.json`: `overview`, `assessment_check` (10 MCQs), `support_notes`. **`learning_activities` section: not present** despite brief + `source_artefacts.learning_content: true`. **Does not flatten to summary prose** — **flattens to assessment-forward** layout. |
| **Rendered output** | **Evidenced** — `utility-ld-rna-assessment-page-render.test.js`: question blocks render; no answer leak; **no** activity materials blocks. |
| **Rubric (0–3)** | **D1** **1** — topical HCV/RNA stems; no authentic scenario. **D2** **0**. **D3** **0** — closed MCQ. **D4** **0** — no generative reasoning prompts on page. **D5** **1** — items test concepts; **no** confrontation/reconciliation arc. **D6** **0**. **D7** **1** — generic `support_notes` only. **D8** **0** — no cognitive progression across phases on page; O ordering only. **D9** **0**. **D10** **0** — assessment dominates vs activities ask. **Mean:** **≈ 0.2**. **P27-04 analogue (climate fixture only):** D8 **1**, D5 **2**, D3 **2** — workshop brief yields **richer C** than RNA page proxy. |
| **Intent preservation** | **Partial (E epistemic)** / **Fail (G/C pedagogic transformation)** — source grounding **preserved**; **pedagogic transformation** of transcript into dialogic/cognitive activities **not evidenced** on RNA learner page (assessment shell). |
| **Gap IDs** | **P28-003**, **P28-010**, **P28-011**, **P28-014**, **P28-012** |

### Case 3 — Focus questions

| Question | Answer |
|----------|--------|
| Does `provided_source_content` preserve grounding but weaken transformation? | **Yes (evidenced)** — GLC skipped; activities chain **can** run, but **composed page** lacks activity cognition (RNA fixture). |
| Sequencing beyond extraction? | **Partial (O only)** — DLO → DLA → GAM → GAI order in RNA test; **not evidenced** as learner-facing phase design. |
| Transcript activities cognitively transformed vs reformatted? | **Not evidenced** for RNA; **partial** for P27-04 climate analogue (materials present, still claim-list shallow). |
| Uncertainty surfaced? | **No** on RNA page. |
| Misconceptions anticipated? | **Partial** (item stems); **no** repair/reconcile. |
| Generative reasoning vs comprehension checks? | **Comprehension-style MCQ** on RNA page. |
| Activities richer than source? | **Not evidenced** on RNA page. |
| C/R flatten to summary? | **No** — **assessment block** replaces activity section. |

**Probe:** P28-07 · **Hypotheses:** **H1** Partial, **H5** Supported, **H6** Supported, **H7** Supported · **H8** **Not strengthened** (transcript path is not lean-retrieval; different failure mode)

---

## Case 4 — Self-study: retrieval revision page (profile A)

**Brief (observation harness `retrieval-quiz`):** Self-study photosynthesis revision; 10-item MCQ; show answers at end.

| Column | Observation (28-1b) |
|--------|---------------------|
| **Workflow brief** | Solo revision; **retrieval** via MCQ; **immediate** answer reveal (Sprint 27 semantics). No request for activities, scaffolding branches, or misconception repair — cognition must be **inferred** by PRISM, not specified by educator. |
| **Elicitation / resolved** | **Evidenced** (read-only E/O): `assessment_required: true` (explicit); `assessment_total_items: 10` (default); `assessment_type: mcq`; `learner_answer_visibility: show_answer_grid_end`; `feedback_timing: immediate_self_check`; `assessment_interaction_mode: retrieval_practice`; **`page_profile: assessment`** (not “revision journey”). **Not set:** `activities_required`, cognitive-engagement factors, `misconception_assessment_link`. |
| **Workflow topology** | **Evidenced:** `Normalize Content` → `Generate Learning Content` → `Model Knowledge` → `Generate Assessment Items` → `Design Page`. **No** `Design Learning Activities`, **no** `Generate Activity Materials`, **no** `Construct Learning Sequence`, **no** `Design Feedback`. **Lean assessment-item path** (orchestration > activity cognition). |
| **Activity artefacts** | **Not evidenced** — no `learning_activities` / `activity_materials` JSON for this brief. |
| **Assessment artefacts** | **Not evidenced** standalone; topology implies GAI step only. |
| **Composed page** | **Not evidenced** — no photosynthesis page fixture in repo. |
| **Rendered output** | **Not evidenced** for this brief. |
| **Rubric (0–3)** | D1 **0**, D2 **0**, D3 **0** (closed retrieval), D4 **0**, D5 **0**, D6 **0**, D7 **0**, D8 **1** (workflow ordering only), D9 **0**, D10 **N/A** — **mean ≈ 0.1**. |
| **Intent preservation** | **Partial (O)** / **Fail (G/C)** for cognitive engagement — assessment path **preserved**; **pedagogic intelligence for solo study not evidenced**. |
| **Gap IDs** | **P28-009**, **P28-003**, **H7**, **H8** |

**Probe:** P28-08

---

## Case 5 — Self-study cognitive engagement (learner-facing resources)

**Purpose:** Compare **facilitator-mediated recovery** (Case 1) vs **solo learner-facing** artefacts. Answer: *Can PRISM remain pedagogically effective when no tutor compensates?*

**Evidence profiles in this case:**

| Profile | Brief / fixture | Role |
|---------|-----------------|------|
| **A** | `retrieval-quiz` harness | Lean MCQ revision path — see Case 4 |
| **B** | `no-assessment-page` harness | Explainer + worked example; no quiz |
| **C** | `rna-virus-activities-formative.json` + `ld-rna-hcv-assessment-page.json` | Transcript self-study follow-up (Sprint 26/27) |
| **D** | `transcript-source` harness brief | Activities + formative wording; topology gap |

### Profile B — Concept explainer (no assessment)

**Brief:** Bayesian inference; one worked example; no quiz or assessment.

| Column | Observation (28-1b) |
|--------|---------------------|
| **E** | `assessment_required: false` (explicit); `learner_level: undergraduate`; `include_answers: false`; **`page_profile: assessment`** (extract quirk — brief negates assessment). **Inferred need:** self-explanation, misconception callouts, check-your-understanding — **not elicited**. |
| **O** | **Evidenced:** NC → GLC → MK → DLO → DLA → GAM → Design Page — **activity chain preserved** (no GAI). Stronger **structural** path for explainer than retrieval quiz. |
| **G/C/R** | **Not evidenced** — no Bayesian page fixture. |

**Rubric (profiles B, no fixture):** **Not scored** (insufficient artefact); O-layer **pass** for activity chain only.

**Probe:** P28-09 · **H7**, H5

### Profile C — RNA/HCV self-study page (fixture proxy)

**Brief (sparse fixture):** One-hour **individual** follow-up after lecture; short activities + short formative assessment; uploaded transcript.

| Column | Observation (28-1b) |
|--------|---------------------|
| **E** | **Evidenced** (`rna-virus-activities-formative.json` + topology test): `activities_required`, `assessment_required`, `materials_required`, `provided_source_content`. **Not set:** item count (“short”), cognitive-engagement factors. |
| **O** | **Evidenced** (rna-sparse E/O): NC → MK → DLO → DLA → GAM → GAI → CLS → DP — **full chain** (contrast retrieval-quiz). **Harness `transcript-source` brief** (same goal shape, empty inputs): **no GAI** in heuristic steps — **not evidenced** assessment step despite `assessment_required: true` (default item count 10). |
| **G** | **Partial:** DLA prompt contract requires `facilitator_moves` (pack) — **live G not captured**. Page fixture is **assessment-heavy**. |
| **C** | **Evidenced** — `ld-rna-hcv-assessment-page.json`: sections `overview`, `assessment_check` (10 MCQs, stems+options, **no** `correct_answer` in JSON), `support_notes`. **No** `learning_activities` / `knowledge_summary` section despite `source_artefacts.learning_content: true`. |
| **R** | **Evidenced** — `utility-ld-rna-assessment-page-render.test.js`: 10 question blocks; **no** “Correct answer” in HTML; catalog expects `knowledge_summary` slot but **not present** in fixture body. |

**G cognition checklist (fixture + support_notes):**

| Criterion | Evidenced? |
|-----------|------------|
| Misconceptions anticipated | **Partial** — stems target concepts; no “why tempting” repair path |
| Productive uncertainty sustained | **No** — retrieval MCQ format |
| Self-explanation prompts | **No** in page body; one bullet “note one misconception” in support_notes |
| Reasoning revision cycle | **No** |
| Scaffold fading | **No** |
| Reflection/retrieval meaningful | **Mechanical** — “re-read summary”, “after you have answered” |

**Rubric (profile C):** D1 **1**, D2 **0**, D3 **0**, D4 **0**, D5 **1**, D6 **0**, D7 **1**, D8 **0**, D9 **0**, D10 **0** — **mean ≈ 0.3**.

### Profile D — Transcript harness brief (E/O only)

Same goal as profile C without uploaded inputs in harness text — use to show **topology inconsistency** under sparse inputs.

### Case 5 — Synthesis rubric & verdict

| Dimension | Case 1 climate (facilitated) | Self-study profiles A/C |
|-----------|------------------------------|-------------------------|
| D6 adaptive scaffolding | **0** | **0** |
| D7 learner-model awareness | **0** | **0–1** (generic tips only) |
| D3 sustained engagement | **2** | **0** |
| Activity chain in topology | **Full** | **A: pruned** / **C test: full** |
| Activities on composed page | Rich materials block | **C: absent** |
| Tutor compensation | **Possible** | **None** |

**Case 5 intent preservation (cognitive engagement):** **Fail / Partial** — structural orchestration can be **strong** (profile B O, profile C test O, RNA topology tests) while **learner-facing cognition in artefacts remains thin**. Supports **H7**, **H8**.

**Hypotheses:** **H7**, **H8** (new), H1 (structure without solo cognition), H5 (assessment dominates page JSON)

**Gap IDs:** **P28-009**, **P28-010**, **P28-011**, **P28-012**, **P28-003**

---

## Facilitator-mediated recovery vs learner-facing cognition (28-1b)

| Question | Climate seminar (Case 1) | Self-study (Case 5) |
|----------|--------------------------|---------------------|
| Can weak D6/D7 be compensated? | **Often yes** (tutor debrief, group discussion) | **No** — solo learner sees materials only |
| Topology encodes activities? | **Yes** (DLA → GAM → GAI) | **Often no** (retrieval-quiz lean path) |
| Page encodes activity cognition? | **Partial** (materials in LA section) | **Often no** (RNA page: assessment only) |
| Primary risk to learner | Thin task cards | **Thin or absent** activity pedagogy + MCQ drill |

**Key investigation answer (evidence-based, 28-1b):** PRISM **does not yet demonstrate** pedagogically effective **solo** learning experiences comparable to facilitated workshops — formatting and assessment generation are ahead of **cognitive engagement architecture** in learner-facing outputs.

---

## Cross-case gap list (28-1)

| ID | Layer | Gap | Climate evidence | Priority |
|----|-------|-----|------------------|----------|
| P28-001 | G | Task cards are **claim bullets**, not authentic scenarios with roles/constraints | Fixture `task_cards` L25–26 | **High** |
| P28-002 | G | **No contingent facilitator moves**; brief asks facilitator notes — absent on activity | No `facilitator_moves`; no facilitator section in page | **High** |
| P28-003 | E | **No richness/dialogic factors** in extract/config | 28-1 extract audit | **High** |
| P28-004 | G | Discussion prompts **analytic**; limited productive uncertainty / forced choice | Prompts L28–30 | **Medium** |
| P28-005 | G/C | Assessment block **thinner** than activity volume but **2 items vs 5** requested; items proposition-specific | Fixture L47–59 vs brief | **Medium** |
| P28-006 | O/G | **Single 40-min activity** vs 60-minute seminar + multi-phase progression | Fixture one activity | **Medium** |
| P28-007 | C | Composition flattens typed materials | **Not evidenced** — render tests show typed blocks preserved | Low (climate) |
| P28-008 | R | Renderer strips dialogic tension | **Not evidenced** — fixture text preserved in HTML | Low (climate) |
| P28-009 | O | Self-study retrieval lean path drops DLA/GAM/CLS | `retrieval-quiz` E/O | **High** |
| P28-010 | G/C | Learner page assessment-forward; activities section missing | `ld-rna-hcv-assessment-page.json` | **High** |
| P28-011 | G | Study/reflection guidance mechanical | RNA `support_notes` | Medium |
| P28-012 | G | No misconception **reconciliation** stage in solo materials | 28-1b | Medium |
| P28-013 | G/E | Peer briefs encode revision cycle; **no** phased activity/page artefacts | Case 2 | **High** |
| P28-014 | O | Transcript harness: `assessment_required` but **no GAI** step | `transcript-source` log | **High** |
| P28-015 | E | Cognitive-engagement concepts **absent** as first-class factors | 28-2 §3.2 | **High** |
| P28-016 | O/E | `assessment_pack` / lean intent drops activity cognition | `leanAssessmentItemIntent`, Case 4 | **High** |

---

## Cross-case pattern — reasoning, peer, transcript (28-1c)

| Capability | Case 2 peer | Case 3 transcript (RNA) | Case 1 climate (analogue) |
|------------|-------------|-------------------------|---------------------------|
| Reasoning revision cycle (D9) | **E partial**; **G/C not evidenced** | **Not evidenced** | **0** (seminar ≠ predict→revise) |
| Misconception reconciliation (D5) | **Not evidenced** | **Partial** stems only | **2** claims; thin repair |
| Pedagogic transformation of source | n/a | **Fail** on RNA page | **Partial** (P27-04 workshop) |
| Instructional shell vs cognition | Assessment timing mappable | **Assessment-only page** | Typed materials; **D6/D7 = 0** |

**Working answer (28-1c):** PRISM models **structurally correct activity/assessment orchestration** and **assessment semantics** more reliably than **reasoning revision**, **misconception reconciliation**, or **transcript→dialogic transformation** in learner-facing artefacts.

---

## Hypothesis adjudication table (programme — closed 2026-05-21)

| ID | Verdict | Primary evidence | Layer |
|----|---------|------------------|-------|
| H1 | **Partial** | Cases 1–3, 5; live P28-01 rich scenarios | O/G |
| H2 | **Partial** | Case 1; P28-01 task cards | G |
| H3 | **Supported** (absence) | Cases 1–2 | G |
| H4 | **Partial** | Cases 1–2; P28-01 uncertainty prose | G |
| H5 | **Supported** | Cases 3, 5C; assessment semantics stable | G/C |
| H6 | **Stabilised** | 28-5b topology + post-5d P28-01/07 chains | O |
| H7 | **Partial** | Prose-rich G when brief explicit; factors now typed | G/E |
| H8 | **Supported** | Case 4/5A retrieval; lean tests unchanged | O |
| H9 | **Stabilised** | 28-5c peer fields + P28-02 post-5d `satisfied=true` | E/G |
| H10 | **Supported** | 28-5a factors/packs; lighter than assessment by design | E |
| H11 | **Stabilised** | 28-5c typed DLA contracts; LLM adherence variable | G |
| H12 | **Stabilised** | 28-5d composition; post-5d canonical sections + LA order | C |
| H13 | **Partial** | Typed fields lift ceiling; model variance remains | G/E |

**Post-5d live validation:** [`probe-p28-01-post-5d.md`](context-files/probe-p28-01-post-5d.md), [`probe-p28-02-post-5d.md`](context-files/probe-p28-02-post-5d.md), [`probe-p28-07-post-5d.md`](context-files/probe-p28-07-post-5d.md) — all three: DLA contract **satisfied**, `learning_activities` **before** `assessment_check`.

**Programme closure:** [`sprint-28-closure.md`](sprint-28-closure.md) (R28-030). **28-5e deferred.**

---

## Emerging architectural diagnosis (28-2)

Sprint 28-1 answered **where** outputs are weak (Cases 1–5 rubric). Sprint 28-2 answers **why** shallow output is **systematically likely**:

```text
Brief prose (dialogic / revision / transformation intent)
        ↓
Extract: strong assessment factors; weak/absent cognition factors  [E]
        ↓
Heuristics: full chain OR lean assessment attractor                [O]
        ↓
Generate: GAI typed JSON; DLA/GAM permissive / text                [G]
        ↓
Compose: assessment_check high fidelity; activities optional      [C]
        ↓
Render: faithful to composed JSON                                [R]
```

**Shift:** Primary gap is **internal pedagogic representation**, not isolated “prompt quality” on a single step.

**Detail:** [`activity-materials-quality-notes.md`](activity-materials-quality-notes.md) §3 (ontology), §10 (representational diagnosis), §11 (architectural diagnosis).

**New gaps:** **P28-015**, **P28-016**; **P28-017** (Design Page outputs omit canonical `section_id` under live compose), **P28-018** (assessment item duplication / alternate MCQ sets on peer page).

---

## Representation ceiling hypothesis (28-3)

**Draft (H13):** When briefs **explicitly demand** pedagogic richness, live generation **fills existing string fields** (task cards, facilitator_moves, phased activities) more fully — approaching rubric **~1.5–1.7** means. When briefs are **sparse** or **assessment-forward**, behaviour reverts toward **~0.2–1.2** (28-1 fixtures/E/O).

**Ceiling mechanism:** Strongest **typed** structures are **assessment `items[]`** and **workflow factors**; cognition has **no parallel typed slots**, so models **cannot** reliably emit reconciliation pathways, learner-model branches, or scaffold-fading as **first-class data** — only as **prose inside** `facilitator_moves` / `prompt_set`.

**Implication:** Prompting **mitigates** but **does not replace** representational extension (28-4).
