# Sprint 28 charter — Pedagogic richness & cognitive engagement architecture

**Pack:** `docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/`  
**Date:** 2026-05-21  
**Mode:** **Investigation first** — no implementation until evidence matrix, rubric, and gap charter are agreed

**Theme (2026-05-21 reframing):** Investigation spans **dialogic workshop quality** and **cognitive engagement architecture** — how materials model **how learning unfolds**, not only which instructional artefacts exist.

---

## Primary goal

Investigate whether PRISM can move from **instructional orchestration** toward **pedagogically intelligent learning-experience generation** — augmenting subject experts who are not expert learning designers.

Probe whether generated **activities**, **task cards**, **scenarios**, **prompts**, and **guidance** encode **learner cognition** (misconception repair, productive uncertainty, self-explanation, reasoning revision, cognitive progression) — not only **structural correctness** (topology, sequencing, assessment semantics, typed composition).

---

## Core question

> Can PRISM generate learning experiences that **strengthen pedagogy** through **cognitive engagement architecture** — not merely preserve tutor intent or emit structurally correct instructional artefacts?

**Supporting question (dialogic strand, retained):** Can workshop and seminar materials sustain **authentic dialogic exchange** where briefs require it?

---

## Strategic distinction

| PRISM strength (evidence to date) | PRISM weakness (28 investigation) |
|-----------------------------------|-------------------------------------|
| Workflow **topology** | **Learner cognition modelling** in materials |
| Instructional **sequencing** (steps, CLS) | **Adaptive scaffolding** inside artefacts |
| Assessment **semantics** (Sprint 27) | **Contingent guidance** without live tutor |
| Typed artefact **composition** + render | **Misconception repair** paths in activities |
| Brief **intent preservation** (partial) | **Productive uncertainty** sustained in self-study |
| | **Cognitive progression** inside GAM outputs |

**Key distinction:** **Structural orchestration** vs **pedagogically intelligent learning design** · **Instructional artefacts** vs **modelling how learning unfolds**.

**Augmentation principle:** PRISM should not only **preserve** pedagogical intent from briefs; it should increasingly **augment and strengthen** pedagogy encoded in learner-facing materials.

**Explicit non-implications (this sprint):** No **autonomous tutoring** product; no **adaptive runtime personalisation**; no claim that **learner models** are implemented in production — investigation documents **gaps** and **target architecture**, not shipped features.

---

## Hypotheses under test

### H1 — Structure preserved; materials shallow

Sprint 26–27 improved **topology** (`activities_required`, DLA → GAM → GAI ordering, epistemic grounding). Generated `activity_materials` may still read as **outline-level** or **generic** despite correct step inclusion.

**Probe:** Compare workflow `steps[]` vs depth of `activity_materials` JSON (task cards, scenarios, facilitator_moves) for climate seminar.

### H2 — Task cards procedurally correct, scenically thin

Task cards may list **steps** and **claims** but lack **authentic context** (stakeholders, constraints, plausible misconceptions, locale/detail) needed for seminar discussion.

**Probe:** Rubric-score task cards from climate + case-based ethics probes; note template repetition.

### H3 — Facilitator moves broad, not contingent

Facilitator notes may describe **what to do** without **contingent moves** (“If group A argues X, ask Y”; “If silence > 2 min, use prompt Z”).

**Probe:** Count contingent vs generic facilitator strings in `facilitator_moves` / session notes artefacts.

### H4 — Discussion prompts lack cognitive tension

Prompts may request **analysis** or **compare** without **productive uncertainty**, **conflicting evidence**, or **forced choice** that sustains dialogic exchange.

**Probe:** Classify prompts on tension scale (see [`activity-materials-quality-notes.md`](activity-materials-quality-notes.md)); compare to assessment item stems post–Sprint 27.

### H5 — Assessment richer than activities

After Sprint 27, **assessment_items** and **feedback** semantics may exceed **activity_materials** in specificity (distractors, visibility, debrief timing) while activities remain generic.

**Probe:** Side-by-side richness rubric on climate case — GAI/Design Feedback vs GAM outputs.

### H6 — Progressive sequencing under-modelled

Activity blocks may not show **cognitive progression** (activate → confront → reconcile → apply) across materials; sequencing may live only in **Construct Learning Sequence** prose, not in material granularity.

**Probe:** Map activity IDs / ordering cues across `learning_activities` and `activity_materials`; check elicitation for sequencing factors.

### H7 — Instructional artefacts stronger than learner cognition (new)

PRISM may model **what to deliver** (cards, prompts, checks, pages) more reliably than **how cognition should unfold** (partial understandings, repair moves, self-explanation prompts, revision cycles) inside those artefacts.

**Probe:** Compare pack/prompt **required fields** for structural activity specs vs fields for **anticipated_responses**, scaffolding branches, and misconception repair; score self-study briefs where **no tutor can recover** weak materials.

**Note:** H7 does not invalidate Sprint 27; assessment semantics remain a separate, stabilised layer.

### H8 — Lean retrieval topology prunes activity cognition (28-1b)

Self-study briefs that foreground **retrieval practice** may route through **assessment-item-only** topology (e.g. NC → GLC → MK → GAI → Design Page), producing **mechanically correct** MCQ flows without **DLA/GAM/CLS** cognition steps — even when educators implicitly need revision **activities**, not only items.

**Probe:** Compare `retrieval-quiz` E/O vs full-chain briefs (`rna-virus-activities-formative`); score **D3/D6/D7** on composed learner pages.

**28-1b read:** **Supported** on observation harness `retrieval-quiz` (see matrix Case 4 / Case 5 profile A).

### H10 — Pedagogic cognition weakly typed vs assessment semantics (28-2)

Learner-cognition concepts (scaffolding branches, repair paths, revision phases, anticipated responses) are **not** first-class factors or JSON sub-schemas comparable to Sprint 27 assessment semantics.

**Probe:** Compare `workflowBriefConfig` + GAI `defaultOutputStructure` vs DLA/GAM (28-2 §3–4).

### H11 — Activity prompts rhetorical, not structurally rich (28-2)

DLA/GAM require **field labels** (`facilitator_moves`, material types) but not **typed cognitive content**; GAM outputs **text** without richness validation.

**Probe:** Pack prompt audit (28-2 §4).

### H12 — Composition privileges assessable artefacts (28-2)

Design Page and lean orchestration favour **assessment_check** survival and item completeness over mandatory **learning_activities** cognition blocks when upstream is thin.

**Probe:** Design Page prompt + RNA/climate/retrieval fixtures (28-2 §4; Cases 3, 5).

---

## Strategic use-cases

| Use-case | Role in Sprint 28 | Rationale |
|----------|-------------------|-----------|
| **Self-study / learner-facing resources** | **Primary strategic concern** | Solo learners cannot rely on tutor recovery; materials must carry **cognitive engagement** end-to-end |
| **Tutor-led seminars / workshops** | **High-signal stress-tests** | Expose scaffolding and misconception-repair gaps **clearly** when facilitator moves are absent |
| **Peer instruction / revision cycles** | Probe family (P28-02, etc.) | Tests **reasoning revision** and dialogic phases |
| **Uploaded source → activities** | Probe family (P28-07) | Tests whether source grounding includes **cognitive progression**, not only coverage |

**Observation (28-1):** Climate fixture is tutor-shaped but scores poorly on **D6/D7** — the same weakness would **hurt self-study more severely**.

---

## Focus areas (investigation lenses)

| Lens | What to observe |
|------|-----------------|
| Task-card richness | Authenticity, specificity, misconception confrontation, role clarity |
| Authentic scenario design | Stakes, context, plausibility, data/evidence hooks |
| Dialogic prompts | Turn-taking, disagreement, elaboration, revoicing hooks |
| Misconception confrontation | Named false claims, evidence contrast, resolution path |
| Facilitator moves | Contingent responses, timing, group dynamics |
| Anticipated learner responses | Expected errors, partial understandings, escalation paths |
| Progressive cognitive sequencing | Bloom/dialogic phase alignment across blocks |
| Peer discussion quality | Prediction → pair talk → revision structure |
| Productive uncertainty / ambiguity | Open-but-bounded problems, not vague “discuss” |
| Activity-material specificity | Named resources, quantities, constraints vs placeholders |

**Cognitive engagement architecture lenses (additive):**

| Lens | What to observe |
|------|-----------------|
| Adaptive scaffolding logic | When/how to narrow, hint, or escalate — not only timing |
| Learner-model awareness | Anticipated partial understandings and error trajectories |
| Misconception repair | Tempting false beliefs → evidence → reconciliation in materials |
| Productive uncertainty | Sustained interpretive gap without vague “discuss” |
| Self-explanation support | Prompts that require learners to articulate reasoning |
| Reasoning revision cycles | Predict → test → revise pathways in materials |
| Cognitive progression | Phases inside materials, not only workflow step order |

---

## Sprint scope

### In scope

- Read-only audit of LD pack prompts (`step_design_learning_activities`, `step_generate_activity_materials`)  
- Evidence matrix for observed/fixture artefacts  
- Pedagogic **richness rubric** (documentation)  
- Workflow **probe catalogue** (brief templates)  
- Gap list by layer **E / O / G / C / R** where relevant  
- Primary deep-dive: **Sprint 27 climate misconception seminar** (tutor-led **stress-test**; hidden answers; task cards) — **28-1 complete**  
- **Self-study** probes and observation-harness retrieval / no-assessment cases as **strategic** comparators  
- Comparison to Sprint 27 stabilised semantics (no re-litigation of visibility contracts)

### Out of scope (this sprint pack)

- Code, pack, or prompt changes  
- Live OpenAI runs **required** for 28-1 (fixtures + prior captures preferred first)  
- Assessment elicitation redesign (Sprint 27 closed)  
- Renderer presentation consolidation  
- Dual-artefact generation programmes  
- Confidence/CARS assessment modes (defer unless probe surfaces blocking gap)

---

## Primary carry-forward case

**Climate misconception seminar** (Sprint 27 P27-02 / observation harness tutor-led scenario):

> Design a 60-minute seminar on climate misconceptions. Small groups discuss scenario questions using task cards and prompts, then complete a 5-item formative check. Do not reveal correct answers on the student handout. The tutor will debrief after group discussion. Include facilitator notes and delayed feedback guidance.

**Why primary:** Combines **dialogic activity design**, **task cards**, **misconception framing**, **delayed assessment semantics** (now stabilised), and **facilitator/tutor split** — ideal **stress-test** for H1–H7 (surfaces missing **adaptive scaffolding** and **learner-model awareness** even when topology passes).

**Anchors:**

- Fixture: `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json`  
- Sprint 27 probes: `../2026-05-21-sprint-27-assessment-feedback-elicitation-semantics/context-files/probe-p27-02-resolved-factors.md`  
- Observation harness: tutor-led scenario in `tests/workflow-sprint27-post-stabilisation-observation.test.js`

---

## Suggested probe set (28-3)

| ID | Scenario | Primary hypotheses |
|----|----------|-------------------|
| P28-01 | Climate misconception seminar — **richer task cards** | H1, H2, H3, H5 |
| P28-02 | Peer instruction: prediction → discussion → revision | H4, H6 |
| P28-03 | Case-based ethics seminar | H2, H4 |
| P28-04 | Lab/practical troubleshooting session | H2, H3, H6 |
| P28-05 | Data interpretation workshop | H2, H4, H6 |
| P28-06 | Debate/disagreement seminar | H4, H3 |
| P28-07 | Uploaded transcript → dialogic activity conversion | H1, H6 |
| P28-08 | Self-study revision resource (solo cognitive path) | H7, H1, D3/D7 |
| P28-09 | Concept explainer page (no assessment; self-explanation) | H7, H5 |

Details: [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md).

---

## Deliverables (investigation complete when)

| Deliverable | File |
|-------------|------|
| Evidence matrix (observed artefacts) | [`pedagogic-richness-evidence-matrix.md`](pedagogic-richness-evidence-matrix.md) |
| Quality rubric for pedagogic richness | [`activity-materials-quality-notes.md`](activity-materials-quality-notes.md) |
| Probe catalogue | [`workflow-probe-catalogue.md`](workflow-probe-catalogue.md) |
| Gap list by E/O/G/C/R | Matrix + quality notes |
| Review decisions | [`review-log.md`](review-log.md) |
| Implementation charter | **Deferred** — `slice-28-4-charter.md` (create only after 28-3) |

---

## Success criteria (investigation phase)

1. H1–H7 adjudicated (Supported / Partial / Refuted) with cited artefacts.  
2. Climate case documented end-to-end at material **depth**, not only topology.  
3. Rubric applied to ≥3 probes (fixture or capture).  
4. Gap list prioritised (P1–Pn) without premature implementation.  
5. Test floor remains **≥311**; no runtime changes in investigation pack.

---

## Relationship to Sprint 27

| Sprint 27 delivered | Sprint 28 assumes |
|--------------------|-------------------|
| `feedback_timing`, `learner_answer_visibility`, `assessment_interaction_mode` | Stable; use as controlled variables in probes |
| Design Feedback ordering after GAI | Present when `design_feedback_required` / delayed timing |
| Epistemic grounding (GLC vs provided source) | Stable; transcript probe uses provided-source path |
| Negative assessment intent | Stable; no-assessment pages excluded from dialogic probes |
| Observation harness (5 scenarios) | Extend with **cognitive engagement / richness** columns in 28-3; self-study scenarios are **strategic** |
