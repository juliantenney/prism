# Sprint 38-C — Self-study learning resource quality review (Inflation)

**Date:** 2026-06-04  
**Type:** Learner-experience observation only — **no** code, prompts, tests, or implementation proposals  
**Central question:** *Would this be a good **60-minute** self-study learning experience for a student?*  
**Answer:** **No** — not as a coherent hour of guided self-study; usable as **reference + worksheet fragments** with significant gaps.  
**Artefacts:** [ev-38b4-01-design-page.json](../fixtures/ev-38b4-01-design-page.json) · [ev-38b4-01-pipeline-gam.txt](../fixtures/ev-38b4-01-pipeline-gam.txt) · [ev-38b4-01-render-excerpt.html](../fixtures/ev-38b4-01-render-excerpt.html)  
**Prior slice:** [38C-design-page-richness-review.md](38C-design-page-richness-review.md) (materials fidelity; not repeated here)  
**Related:** [38B-W3-4](38B-W3-4-inflation-gate-evidence.md) · [38B-W3](38B-W3-design-page-authority-review.md)

---

## 1. Executive summary

| Dimension | Verdict | Confidence |
|-----------|---------|------------|
| **Genuinely thin?** | **Yes** — low explanatory and scaffolding prose; table-heavy | **High** |
| **Why it feels thin** | Reference tables dominate; no scenarios/cards/checklists; weak narrative; no consolidation section; facilitated task wording | **High** |
| **Pedagogical vs structural** | **Both** — missing instructional functions (pedagogical) + 125 min labelled duration vs 60-min intent (structural) | **High** |
| **Origin** | **Primary:** GAM authoring + DLA/capture material spec · **Secondary:** product/brief mismatch · **Minor:** Design Page task framing · **Not:** materials stripping on this run | **Medium–high** |
| **60-minute self-study fit** | **Poor** | **High** |
| **Enhancement sprint justified?** | **Yes** — end-to-end self-study resource design (DLA → GAM → page shape), not Design Page preserve alone | **High** |

**One-line learner verdict:** A motivated student could **complete tables and skim definitions** in one sitting, but would **not** receive the modelling, practice progression, misconception support, or closure expected of a university self-study workbook or FutureLearn-style step.

---

## 2. Learner experience assessment (rendered page lens)

*Assumption: student sees only the exported page ([render excerpt](../fixtures/ev-38b4-01-render-excerpt.html)).*

| Criterion | Rating (1–5) | Evidence |
|-----------|:------------:|----------|
| **Clarity** | 3 | Clear titles, outcomes list, and pipe tables; A2/A4 tasks assume a **partner/group** the solo learner does not have |
| **Engagement** | 2 | Little narrative, no phased “you are here”, no variety (cards/scenarios); long table blocks |
| **Progression** | 3 | A1→A5 sequence is logical (concepts → measures → budget → strategies → plan) but **not signposted** on page (no timeline, study tips) |
| **Instructional support** | 2 | Preambles are one sentence each; A5 cognition fields may not surface in HTML excerpt; no worked examples or hints in materials |
| **Conceptual understanding** | 2–3 | Definitions inside tables help; little **explanatory teaching** connecting ideas; A3 task references “scenarios” not present in materials |
| **Independent study suitability** | 2 | **125 min** sum of `duration_minutes` vs ~**1,400** learner-facing words in tasks+preambles+intro — either rushed shallow work or >60 min table labour |

### 2.1 Quantified learner-facing volume (EV-01)

| Measure | Value |
|---------|------:|
| Page sections | **3** (intro, outcomes, activities only) |
| Sum `duration_minutes` | **125** (15+20+25+30+35) |
| Intro prose words | **~69** |
| Activity preambles (total) | **~76** words |
| `learner_task` (total) | **~152** words |
| `materials.*` (total) | **~1,106** words (mostly table cells) |
| Study tips / reflection / assessment sections | **0** |
| GAM non-table blocks (scenarios, cards, prompts) | **0** |

---

## 3. Resource-type classification

| Category | Fit | Evidence |
|----------|:---:|----------|
| **Self-study workbook** | **Weak** | No multi-phase workbook structure, no faded practice, no answer checks, no reflection closure |
| **Guided tutorial** | **Weak** | No step-by-step modelling or “try then check” |
| **Workshop handout** | **Weak** | `facilitator_moves: null` but tasks say *partner* / *group* — hybrid confusion |
| **Activity sheet** | **Strong** | Repeated “complete the table / rank / classify” tasks with embedded reference data |
| **Revision sheet** | **Strong** | Dense definitional and comparison tables; pre-filled ratings on A4 |
| **Reference notes** | **Strong** | Tables carry definitions, methods, pros/cons |

**Closest match:** **Activity sheet + revision/reference notes** (combined), **not** a self-study workbook.

**Title vs reality:** *“Self-Directed Learning Journey”* promises narrative progression; delivered structure is **three flat sections** and five task cards worth of instruction.

---

## 4. Instructional-function audit

| Function | Status | Learner-visible evidence | Gap severity |
|----------|--------|--------------------------|--------------|
| **Worked examples** | **Absent** | No stepped solution in materials; A4 table includes model **ratings** learner did not produce | **Pedagogical** |
| **Modelling** | **Absent** | No “watch how to classify one row” or CPI calculation walkthrough | **Pedagogical** |
| **Guided practice** | **Partially present** | Tasks ask to complete/classify/rank; tables partly pre-filled (A4 effectiveness column filled) | **Usability** / **Pedagogical** |
| **Faded support** | **Absent** | No reduce-scaffolding sequence across A1–A5 | **Pedagogical** |
| **Misconceptions** | **Absent** | `failure_mode` strings exist in JSON; not framed as “common mistakes” for learner | **Cosmetic** (JSON only) |
| **Explanatory teaching** | **Partially present** | Definitions inside table cells (~1,100 words); no connecting prose between activities | **Pedagogical** |
| **Interpretation guidance** | **Partially present** | A3 “Notes on Impact” column; no prompt to interpret CPI vs PPI trade-offs in prose | **Pedagogical** |
| **Retrieval opportunities** | **Partially present** | A1 classification, A3 % change calculation implied; no low-stakes quiz or recall prompts | **Pedagogical** |
| **Synthesis opportunities** | **Present** | A5 personal finance plan task | **Pedagogical** (undermined by missing prior scenarios) |
| **Consolidation** | **Absent** | No summary, “key takeaways”, or reflection section on page | **Critical** (self-study) |
| **Transfer** | **Partially present** | A5 `transfer_or_application_task` in JSON; learner must infer from task text | **Pedagogical** |
| **Evaluative judgement** | **Partially present** | A4 ranking task; no rubric or exemplar of good justification | **Pedagogical** |

---

## 5. DLA intent vs learner experience

*DLA JSON not committed; inference from composed page + capture brief + golden upstream fixture.*

| DLA-implied intent (from titles, outcomes, progression) | Delivered to learner? | Mismatch |
|------------------------------------------------------|------------------------|----------|
| Build concepts → measure → budget → strategies → plan | **Partial** | Sequence exists; **depth** missing between steps |
| Self-directed / solo study (`page_profile: learner`) | **Partial** | A2 *partner*, A4 *group* language |
| “Real-life household budgeting **scenarios**” (A3 preamble) | **No** | No scenario prose in materials; budget table is generic |
| Cognition-rich synthesis (A5 fields) | **Uncertain in HTML** | Fields present in JSON; render excerpt truncated — learner may not see scaffolds |
| 60-minute study (product anchor; golden overview says 60 min workshop) | **No** | **125** minutes labelled; thin word count does not compensate |

**Rhetoric vs experience:** Page **claims** a “learning journey” and “series of activities”; learner receives **reference tables + short instructions** — **pedagogical** gap between marketing copy (intro) and instructional body.

---

## 6. GAM pedagogical value vs learner pedagogical value

*Not a preservation question — what **teaching work** each layer does.*

| Pedagogical asset | In GAM (EV-01)? | Reaches learner? | Disappears or weakens? |
|-------------------|:-----------------:|:----------------:|------------------------|
| Definitional reference (terms, CPI/PPI/GDP) | **Yes** (tables) | **Yes** | — |
| Comparative structure (columns) | **Yes** | **Yes** | — |
| Budget arithmetic dataset | **Yes** (A3 table with $) | **Yes** | Learner still must compute % — task OK |
| Strategy evaluation matrix | **Yes** (A4, pre-scored) | **Yes** | **Spoiler risk** — ratings given; ranking task less meaningful |
| Narrative scenarios | **No** | **No** | **Never authored** in GAM (cf. EV-03) |
| Task cards / retrieval prompts | **No** | **No** | **Never authored** |
| Discussion / self-check prompts | **No** | **No** | **Never authored** |
| Worked example | **No** | **No** | **Never authored** |
| Synthesis template for plan | **No** (only tables repeated on A5) | **Partial** | A5 task text only; **four tables duplicated** add noise not guidance |

**Summary:** **~100%** of GAM’s narrow pedagogical value (tables) reaches the learner; **~0%** of richer GAM patterns seen in EV-03 ever existed to reach the learner. Disappearance is **upstream absence**, not Design Page stripping.

---

## 7. Thinness taxonomy

| ID | Factor | Measured? | Severity |
|----|--------|-----------|----------|
| **TH-01** | Insufficient explanatory prose (between-idea narrative) | Intro **69** words; no `knowledge_summary` section | **Pedagogical** |
| **TH-02** | Insufficient **situated** examples (named households, stories) | **0** scenario blocks | **Critical** (self-study) |
| **TH-03** | Insufficient modelling / worked examples | **0** | **Pedagogical** |
| **TH-04** | Task-heavy, table-completion structure | **5** activities, **~152** task words total | **Usability** |
| **TH-05** | Weak narrative flow | 3 sections; no “Step 2 of 5” framing | **Usability** |
| **TH-06** | Lack of consolidation / reflection | No closing section | **Critical** (self-study) |
| **TH-07** | Weak synthesis support | A5 repeats tables; no plan template | **Pedagogical** |
| **TH-08** | Duration–scope mismatch | **125** min labels vs 60-min question | **Structural** |
| **TH-09** | Solo learner / social task mismatch | Partner/group in A2, A4 | **Usability** |
| **TH-10** | Pre-filled “answers” in reference tables | A4 effectiveness column | **Pedagogical** |

**Why it feels skinny:** Low **prose scaffolding** and **missing instructional genres** (scenario, card, checklist), not missing table **syntax** ([38B-W3-4](38B-W3-4-inflation-gate-evidence.md) PASS).

---

## 8. Target product vision comparison

| Vision | Appropriate? | Key differences from EV-01 |
|--------|:------------:|----------------------------|
| **University self-study workbook** | **No** | Workbooks include exposition, worked examples, practice with feedback, chapter summary; EV-01 is table-centric |
| **FutureLearn-style step sequence** | **No** | Steps use video/text, embedded checks, social prompts optional; EV-01 lacks checks, media, and explicit step UI |
| **Open educational resource (OER) chapter** | **Partial** | Tables could be reused as **OER appendix**; not standalone chapter |
| **Revision worksheet** | **Yes** | Matches pre-exam table review + short application tasks |

**60-minute constraint:** Golden fixture overview explicitly says **“60-minute workshop”**; EV-01 activity durations sum to **125 minutes** — **structural** misalignment with stated product time budget even if workshop delivery differs.

---

## 9. Severity summary (gaps)

| Gap | Cosmetic | Usability | Pedagogical | Critical (self-study) |
|-----|:--------:|:---------:|:-----------:|:---------------------:|
| No consolidation / reflection | | | | **✓** |
| No scenarios / situated cases | | | **✓** | **✓** |
| No worked examples / modelling | | | **✓** | |
| Partner/group on solo page | | **✓** | **✓** | |
| 125 min vs 60-min expectation | | | | **✓** |
| A4 pre-filled effectiveness ratings | | | **✓** | |
| A5 table dump without plan scaffold | | **✓** | **✓** | |
| Title “journey” vs reference sheet | **✓** | **✓** | | |

---

## 10. Strengths (fair account)

| Strength | Evidence |
|----------|----------|
| **Clear learning outcome list** | Four outcomes at top of page |
| **Logical topic progression** | Concepts → measures → budget → strategies → synthesis |
| **Readable tables** | Render CSS supports accessible `<table>` layout |
| **Concrete budget numbers** | A3 gives before/after $ amounts for calculation practice |
| **Synthesis capstone** | A5 asks for integrated personal finance plan |
| **A5 cognition metadata** (if rendered) | `scaffold_hint_sequence`, `self_explanation_prompt` — strongest support signal in JSON |
| **B4/table fidelity** | Learner not exposed to broken CSV table shapes |

---

## 11. Weaknesses (learner-critical)

| Weakness | Impact on 60-min self-study |
|----------|----------------------------|
| No scenarios despite A3 framing | Student cannot practice “real-life” analysis as promised |
| No retrieval / self-check | No way to verify understanding without external answer key |
| No closure | Student finishes without “what to remember” |
| Facilitated task language | Solo student blocked or confused on A2/A4 |
| Thin task instructions | **~30** words average per `learner_task` — insufficient coaching |
| Duration inflation | Credible pacing unclear; undermines trust in time estimates |
| Reference-heavy A5 | Re-reading four tables ≠ writing a plan |

---

## 12. Origin attribution (self-study quality)

| Layer | Contribution to thin experience |
|-------|----------------------------------|
| **Product / brief vision** | “Self-directed journey” sets high bar; 60-min anchor in programme fixtures not enforced in output durations |
| **DLA** | Likely specified table-type `required_materials` only (capture hint); no committed JSON |
| **GAM** | Authored **tables only** — dominant **pedagogical** ceiling |
| **Design Page** | Composed framing + outcomes; **did not thin** materials; added facilitated wording and A5 duplication |
| **Renderer** | Displays what JSON contains; cannot add teaching prose |

**Design Page architecture** ([38B-W3](38B-W3-design-page-authority-review.md)) is **not** the primary self-study quality blocker on this evidence.

---

## 13. Evidence excerpts

### 13.1 Intro promise vs body

```text
"This learning journey is designed to help you understand inflation … analyze real-world data …"
```

→ No separate “real-world data” narrative; data = table cells only.

### 13.2 Solo page, social task (A2)

```text
page_profile: "learner"
learner_task: "Work with your partner to complete the comparison table …"
```

### 13.3 A3 preamble vs materials

```text
activity_preamble: "… apply inflation concepts to real-life household budgeting scenarios."
materials: { "analysis_table": "| Expense Category | …" }  // no scenario prose
```

### 13.4 Duration sum

```text
A1: 15 min · A2: 20 min · A3: 25 min · A4: 30 min · A5: 35 min → 125 min total
```

### 13.5 GAM scope (same run)

```text
ev-38b4-01-pipeline-gam.txt — 8 pipe tables, 0 scenario / task_card / prompt_set sections
```

---

## 14. Observation-level conclusions (no fixes)

| Question | Answer |
|----------|--------|
| Good **60-minute** self-study? | **No** |
| Genuinely thin? | **Yes** (pedagogically and structurally) |
| Why thin? | Missing instructional genres + prose; table-dominant; no closure; duration mismatch |
| Pedagogical or structural? | **Both** |
| DLA / GAM / Design Page / vision? | **GAM + DLA spec + vision** primary; **Design Page** minor (wording, A5 shape) |
| Future sprint? | **Justified** for self-study resource quality programme (38-C), distinct from 38-B preserve |

---

## 15. Open questions

1. Do A5 cognition fields (`scaffold_hint_sequence`, etc.) render in full HTML export?  
2. Would a student completing all tables in **60 minutes** achieve the four outcomes (needs user testing)?  
3. Is **125 min** intentional self-paced guidance or model error?  
4. Does post–Wave 3 live rerun change GAM genre mix without prompt-size work?  
5. Should product vision explicitly allow **“reference + worksheet”** mode vs **workbook** mode?

---

## 16. Sign-off

| Item | Status |
|------|--------|
| Sprint 38-C self-study quality review | **COMPLETE** |
| Implementation / PR proposals | **Out of scope** |

**Cross-reference:** [38C-design-page-richness-review.md](38C-design-page-richness-review.md) · [38B-W3-4](38B-W3-4-inflation-gate-evidence.md).
