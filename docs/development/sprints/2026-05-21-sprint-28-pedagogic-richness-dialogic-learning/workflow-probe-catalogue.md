# Workflow probe catalogue — Sprint 28

**Purpose:** Standardised brief templates to test **pedagogic richness** and **cognitive engagement architecture** — how materials model **learner cognition**, not assessment visibility (Sprint 27).

**Strategic split:**

| Probe family | Role |
|--------------|------|
| **P28-08, P28-09** | **Primary strategic** — self-study / learner-facing (no tutor recovery) |
| **P28-01–P28-07** | Facilitated formats as **stress-tests** for scaffolding, misconception repair, dialogic phases |

**Usage:** Investigation captures (28-3); optional future fixtures under `tests/fixtures/workflow-brief-ld-sparse/`.

Each probe lists: **intent**, **brief skeleton**, **richness dimensions to score**, **topology hints**, **capture checklist**.

**Rubric:** [`activity-materials-quality-notes.md`](activity-materials-quality-notes.md) (D1–D10; cognitive engagement interpretation table)

---

## Probe index

| ID | Name | Primary hypotheses | Status |
|----|------|-------------------|--------|
| P28-01 | Climate misconception seminar — richer task cards | H1, H2, H3, H5 | **Complete** — [28-3 live](context-files/probe-p28-01-live.md) · [post-5d](context-files/probe-p28-01-post-5d.md) |
| P28-02 | Peer instruction: prediction → discussion → revision | H4, H6, H9 | **Complete** — [28-3 live](context-files/probe-p28-02-live.md) · [post-5d](context-files/probe-p28-02-post-5d.md) |
| P28-03 | Case-based ethics seminar | H2, H4 | **Not run** |
| P28-04 | Lab/practical troubleshooting session | H2, H3, H6 | **Not run** |
| P28-05 | Data interpretation workshop | H2, H4, H6 | **Not run** |
| P28-06 | Debate/disagreement seminar | H4, H3 | **Not run** |
| P28-07 | Uploaded transcript → dialogic activity conversion | H1, H6 | **Complete** — [28-3 live](context-files/probe-p28-07-live.md) · [post-5d](context-files/probe-p28-07-post-5d.md) |
| P28-08 | Self-study revision resource (solo cognitive path) | **H7**, H1, D3, D7 | **Not run** |
| P28-09 | Concept explainer page (no assessment; self-explanation) | **H7**, H5, D7 | **Not run** |

---

## P28-01 — Climate misconception seminar (PRIMARY stress-test)

**Carry-forward from Sprint 27 P27-02** — extend with explicit **rich task card** ask.

**Brief skeleton:**

> Design a 60-minute seminar on climate misconceptions for undergraduate students. Small groups use **rich task cards** with authentic scenarios (named places, roles, and conflicting claims), discussion prompts that create productive uncertainty, and facilitator moves that respond to common learner arguments. After group work, students complete a **5-item formative check**; **do not reveal correct answers on the student handout** — the tutor debriefs after discussion. Include **contingent facilitator notes** (if learners say X, ask Y) and delayed feedback guidance.

**Richness dimensions to score:** D1, D2, D3, D4, D5, D6, D7, D8, D10

**Semantic dimensions (Sprint 27 — expect stable):**

- `assessment_required: true`, `assessment_total_items: 5` (explicit)  
- `feedback_timing: tutor_led_reveal_only`  
- `learner_answer_visibility: hidden_until_reveal`  
- `assessment_interaction_mode: discussion_oriented`  
- `design_feedback_required: true`  

**Topology hints:**

- Normalize? + GLC → MK → DLO → DLA → GAM → GAI → Design Feedback → CLS → Design Page  
- Facilitator materials in inputs (not `provided_source_content`)

**Capture:**

- E/O: observation harness or `extract` + `applyWorkflowDesignHeuristics`  
- G: `learning_activities`, `activity_materials` (full JSON)  
- C: `page.sections[]` — task card blocks vs assessment_check  
- R: export HTML — hidden answers; dialogic sections present  
- Rubric: all D1–D8 + D10

**Anchors:** `ld-climate-misconception-discussion-page.json`; P27-02 probe note

---

## P28-02 — Peer instruction (prediction → discussion → revision)

**Brief skeleton:**

> Create a peer instruction session on [topic]. Students **predict** answers individually, **discuss in pairs** with structured prompts, then **revise** predictions. Include 6 MCQs and reflection prompts. **Confirm solutions only after pair discussion.** Emphasise dialogic comparison, not silent voting.

**Richness dimensions:** D4, D8, D9, D10

**Semantic dimensions (Sprint 27):**

- `feedback_timing: after_peer_discussion`  
- `assessment_interaction_mode: discussion_oriented`  
- Presentation mapping: `reflection_then_answers` (timing-only resolver)

**Topology hints:** DLA before GAI; Design Feedback may appear

**Capture:** Phase structure in materials; peer prompts quality (D9)

---

## P28-03 — Case-based ethics seminar

**Brief skeleton:**

> Design a 90-minute ethics seminar using a **case study** with stakeholders and conflicting duties. Groups analyse the case with **task cards**, present recommendations, and respond to **challenging facilitator prompts**. Include a short written exit ticket (3 questions) — tutor collects for debrief next week.

**Richness dimensions:** D1, D2, D4, D6

**Hypotheses:** Authentic scenario (H2); tension in prompts (H4)

---

## P28-04 — Lab/practical troubleshooting session

**Brief skeleton:**

> Design a lab session where students diagnose **equipment failure** from symptoms and data logs. Provide troubleshooting **task cards**, anticipated wrong diagnoses, and facilitator **contingent hints** (if group stuck on X, offer Y). No summative grade; formative checklist for tutor only.

**Richness dimensions:** D2, D3, D6, D7, D8

**Note:** May use `assessment_required` with hidden tutor checklist — separate from Sprint 27 MCQ probes

---

## P28-05 — Data interpretation workshop

**Brief skeleton:**

> Design a workshop where students interpret **[dataset description]** tables and graphs. Groups argue for competing interpretations using **evidence cards**; facilitator prompts **productive disagreement**. End with 4 short explanation questions; answers discussed plenary, not on handout.

**Richness dimensions:** D1, D3, D4, D8

---

## P28-06 — Debate/disagreement seminar

**Brief skeleton:**

> Design a seminar on [contested policy topic]. Assign roles (pro/con/civil-society). Provide **opening claims**, **cross-examination prompts**, and facilitator moves for **managing disagreement** respectfully. No winner declared; synthesis prompt closes session.

**Richness dimensions:** D3, D4, D6

**Hypotheses:** Cognitive tension (H4); contingent facilitation (H3)

---

## P28-07 — Uploaded transcript → dialogic activities

**Brief skeleton:**

> Using the **provided lecture transcript** on [topic], create **dialogic learning activities** (discussion prompts, misconception confrontation, pair tasks) and a short formative assessment. Do not invent facts beyond the transcript; surface **uncertainty** where evidence is incomplete.

**Richness dimensions:** D1, D5, D8, D10

**Semantic dimensions (Sprint 27):**

- `input_strategy: provided_source_content`  
- No forced Generate Learning Content  

**Anchors:** `rna-virus-activities-formative.json`; P27-04

**Hypotheses:** Structure preserved (H1); sequencing from source (H6)

---

## Capture checklist (all probes)

| # | Artefact | Layer |
|---|----------|-------|
| 1 | Brief text + resolved factors | E |
| 2 | `steps[]` after heuristics | O |
| 3 | `learning_activities` JSON | G |
| 4 | `activity_materials` JSON | G |
| 5 | `assessment_items` JSON (contrast) | G |
| 6 | Composed `page` JSON | C |
| 7 | Export HTML excerpt | R |
| 8 | Rubric D1–D10 scores + notes | — |
| 9 | Gap IDs P28-00n | — |

**28-3 captures:** [`context-files/`](context-files/) — `probe-p28-01-live.md`, `probe-p28-02-live.md`, `probe-p28-07-live.md`, `28-3-probe-capture.json`, `28-3-probe-runner.js`.

---

## P28-08 — Self-study revision resource (PRIMARY strategic)

**Brief skeleton:**

> Create a self-study revision page on [topic] with a 10-item MCQ quiz. Show answers at the end. Include **worked examples**, **self-explanation prompts** after each section, and **“if you thought X, consider Y”** scaffolding — no tutor is available.

**Richness dimensions:** D3, D7, D8, **D6 (embedded scaffolding)**, D10 · **H7**

**Observation harness anchor:** `retrieval-quiz` scenario in `tests/workflow-sprint27-post-stabilisation-observation.test.js`

**28 note:** Topology may be lean; **cognitive engagement must live in materials**, not facilitation.

---

## P28-09 — Concept explainer (self-study, no assessment)

**Brief skeleton:**

> Create a short undergraduate teaching page explaining [concept] with one worked example. No quiz or assessment. Include **step-by-step reasoning prompts**, **common misconception callouts**, and a **check-your-understanding** reflection — learner works alone.

**Richness dimensions:** D5, D7, D8, D3 · **H7**, H5

**Observation harness anchor:** `no-assessment-page` scenario (Bayesian inference brief)

---

## Observation harness comparators (28-1 / 28-2)

| Harness ID | Strategic role |
|------------|----------------|
| `tutor-led-seminar` | Stress-test (28-1 **complete**) |
| `retrieval-quiz` | Self-study strategic (**pending** matrix) |
| `no-assessment-page` | Self-study explainer (**pending** matrix) |
