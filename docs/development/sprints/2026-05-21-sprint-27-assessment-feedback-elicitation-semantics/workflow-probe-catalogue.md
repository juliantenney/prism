# Workflow probe catalogue — Sprint 27

**Purpose:** Standardised brief templates to test assessment/feedback **semantics** — not renderer layout.  
**Usage:** Manual Factory runs (27-3) and/or future `tests/fixtures/workflow-brief-ld-sparse/` entries.

Each probe lists: **intent**, **brief skeleton**, **expected semantic dimensions**, **expected topology hints**, **capture checklist**.

---

## Probe index

| ID | Name | Primary hypotheses | 27-3 status |
|----|------|------------------|-------------|
| P27-01 | Self-study retrieval quiz | H2, H4 | Not run (control; inflation Case B) |
| P27-02 | Tutor-led delayed-feedback discussion quiz | H3, H4, H6 | **Captured E/O** — [`probe-p27-02-resolved-factors.md`](context-files/probe-p27-02-resolved-factors.md) |
| P27-03 | Peer instruction workflow | H5, H6 | **Captured E/O** — [`probe-p27-03-peer-instruction.md`](context-files/probe-p27-03-peer-instruction.md) |
| P27-04 | Diagnostic misconception assessment | H1, H5, H2 | **E/O + fixture proxy G/C/R** — [`probe-p27-04-assessment-items-excerpt.md`](context-files/probe-p27-04-assessment-items-excerpt.md) |
| P27-05 | Confidence-based assessment | H3 (gap) |
| P27-06 | Revision / self-check workflow | H4, H2 |
| P27-07 | Facilitator-led workshop assessment | H2, H6 |

---

## P27-01 — Self-study retrieval quiz

**Control case** — aligns with inflation-shaped workflows.

**Brief skeleton:**

> Design a self-study revision page on [topic]. Include a short knowledge check of 10 MCQs. Learners work alone. Do not include answer keys on the page.

**Semantic dimensions to elicit:**

- `assessment_required`, `assessment_total_items`, `assessment_type: mcq`  
- `include_answers: false`, `page_profile: learner`  
- `delivery_context: self_directed`  

**Topology hints:**

- Activities optional; assessment + Design Page likely  
- Design Feedback **unlikely**  

**Capture:** resolved factors, steps[], `feedback_display`, export HTML without answers.

---

## P27-02 — Tutor-led delayed-feedback discussion quiz

**Priority probe** for H3/H4.

**Brief skeleton:**

> Design a 60-minute seminar on [topic]. Small groups discuss scenario questions using provided prompts, then complete a 5-item formative check. **Do not reveal correct answers on the student handout** — tutor will debrief. Include facilitator notes.

**Semantic dimensions desired (may be missing today):**

- `feedback_timing: delayed`  
- `assessment_interaction_mode: discussion_then_assess`  
- `page_profile: learner` + facilitator materials  
- `include_answers: false`  

**Topology hints:**

- Design Learning Activities, Generate Activity Materials, Construct Learning Sequence?, Generate Assessment Items, Design Page  
- Design Feedback — **test if included**  

**Capture:** activity materials, assessment_items (answers in JSON?), page, facilitator export if any.

**27-3 result (E/O):** `include_answers: true` (false positive); `page_profile: facilitator`; Design Assessment/Feedback **absent**; GAI before DLA in topology. G/C/R **PENDING**. See probe note.

---

## P27-03 — Peer instruction workflow

**Brief skeleton:**

> Create a peer instruction session: students attempt problems individually, discuss in pairs, then revise answers. Include 6 MCQs and reflection prompts. Emphasise pair discussion before confirming solutions.

**Semantic dimensions:**

- `grouping: pair` on activities  
- Discussion-before-reveal (not a standard factor)  

**Hypotheses:** H5 — rich activities; assessment may still be MCQ-retrieval shaped.

**27-3 result (E/O):** `assessment_total_items: 6`, `activities_required`; `page_profile: assessment`; no timing/peer factors; Design Feedback **absent**. G/C/R **PENDING**.

---

## P27-04 — Diagnostic misconception assessment

**Aligns with climate case.**

**Brief skeleton:**

> Using the uploaded lecture on [topic], create a misconception discussion workshop. Provide task cards of common false claims, an analysis worksheet, and discussion prompts. End with true/false diagnostic statements — **learners should not see correct answers on the handout**.

**Semantic dimensions:**

- `activities_required`, `materials_required`  
- `assessment_type: true_false` or mixed  
- Misconception/discussion pedagogy  

**Fixture reference:** `ld-climate-misconception-discussion-page.json`

**27-3 result:** E/O capture + **fixture proxy** for page/T/F HTML (not live from exact brief). `feedback_display: none`; answers in item JSON, hidden in export. `feedback_pack` absent. See probe note.

---

## P27-05 — Confidence-based assessment

**Brief skeleton:**

> Add a 15-minute confidence-based review: for each statement, learners rate confidence then check answers. 8 MCQs with item-level explanatory feedback visible **after** submission.

**Semantic dimensions (likely gaps):**

- Confidence rating (no factor)  
- `feedback_timing: after_submission`  
- `include_feedback_guidance: true`  

**Purpose:** Expose elicitation holes explicitly in matrix.

---

## P27-06 — Revision / self-check workflow

**Brief skeleton:**

> Self-study revision guide with practice questions and a **self-check answer key** at the end of the page.

**Semantic dimensions:**

- `feedback_display: answer_grid_end` or `answers_explanations`  
- `include_answers: true` (delayed section)  

**Tests:** renderer modes in `renderQuestionBlocks` — semantic intent is **structured self-check**, not tutor-led.

---

## P27-07 — Facilitator-led workshop assessment

**Brief skeleton:**

> Face-to-face workshop with printed tutor pack: activities, timing, and a separate **tutor marking guide** with model answers. Student handout has questions only.

**Semantic dimensions:**

- `page_profile: facilitator` vs learner split  
- `include_answers` on tutor artefact only  

**Topology hints:**

- Generate Activity Materials, assessment items, Design Marking Rubric?, dual delivery  

---

## Capture checklist (all probes)

| # | Capture |
|---|---------|
| 1 | Factory brief text (exact) |
| 2 | Resolved factors JSON (screenshot or export) |
| 3 | Final workflow step titles |
| 4 | `assessment_items` excerpt (first 2 items, types, answer fields) |
| 5 | `feedback_pack` present? |
| 6 | `page.sections[]` ids and headings |
| 7 | `page.feedback_display`, `include_answers` if set |
| 8 | Export HTML — answers visible? feedback blocks? |
| 9 | Layer tag where intent dropped (E/O/G/C/R) |

---

## Fixture backlog (27-3 optional)

| Probe | Suggested fixture path |
|-------|------------------------|
| P27-01 | `tests/fixtures/workflow-brief-ld-sparse/self-study-retrieval-quiz.json` |
| P27-02 | `tests/fixtures/workflow-brief-ld-sparse/tutor-delayed-feedback.json` |
| P27-04 | Extend climate page + brief fixture pair |
