# domain-learning-design-prompt-rules.md

## Purpose

This document defines the prompt design rules for learning design workflows within PRISM.

These rules ensure that prompts:
- produce consistent, structured outputs
- adhere to instructional design principles
- generate artefacts that are reusable across workflows

---

# Core Principles

## 1. Grounding in Source Content

- All outputs must be based on:
  - the original input content
  - or upstream artefacts (e.g. normalized_content, knowledge_model)

- Do NOT:
  - introduce external knowledge
  - invent unsupported concepts

---

## 2. Explicit Task Definition

Prompts must clearly state:
- what transformation is required
- what the input represents
- what the output should achieve

Avoid vague instructions like:
- “summarise this”
- “improve this”

Prefer:
- “extract key concepts and structure them as…”

---

## 3. Structured Output Requirement

Prompts must specify output format when outputs are reused.

Preferred formats:
- JSON (for machine-readable artefacts)
- structured lists or tables

Always:
- define the schema
- include field names
- avoid free-form prose for reusable artefacts

---

## 4. Artefact Awareness

Prompts must:
- refer explicitly to input artefacts
- produce clearly named output artefacts

Example:
- “Using the knowledge_model…”
- “Output as learning_outcomes…”

This ensures compatibility across workflow steps.

---

## 5. Alignment Enforcement

Prompts must enforce alignment between artefacts.

Examples:
- outcomes must align with concepts
- assessments must align with outcomes
- feedback must align with misconceptions

Include explicit instructions such as:
- “Ensure each item maps to a concept”
- “Maintain alignment with previous artefacts”

---

## 6. Avoidance of Vague Language

Prompts must discourage vague outputs.

Examples:
- Avoid: “ensure understanding”
- Prefer: “explain”, “apply”, “analyse”

For outcomes:
- require observable verbs

For activities:
- require explicit learner actions

---

## 6b. Learner-action rhetoric (Sprint 35)

For self-directed learner pages and runnable activities, prompts must require:

| Field | Write as | Avoid |
|-------|----------|-------|
| `learner_task` | Observable action on materials (complete, compare, decide, justify, record) | Passive coverage ("learn about", "understand", "explore") |
| `expected_output` | Evidence of completion (filled artefact, quoted values, short judgement) | Topic summary or "understanding of…" |
| `support_note` | One misconception guard or evidence rule (1–2 sentences) | Tutoring steps, facilitator notes, answer giveaways |
| `activity_preamble` | Orientation only (why this activity, what thinking mode) | Full task instructions duplicated from `learner_task` |
| Assessment `question` / `stem` | Decision, justification, or interpretation | Label-only recall when judgement is possible |

Materials support the task; they must not replace the task or pre-answer judgement cells (except explicit faded worked examples).

See also: auto-applied **Learner-action rhetoric** block on Design Learning Activities, Generate Activity Materials, Design Page, and assessment producer steps for self-directed learner-page workflows.

---

## 6c. Worked-example and faded-support (Sprint 35)

Use existing material types only (`worked_example`, `sample_output`, `template`, `prompt_set`, `scenario`, `checklist`).

| Stage | Material pattern | Learner sees |
|-------|------------------|--------------|
| **Modelled** | `worked_example` / `sample_output` / one filled template row | Full reasoning chain; why each move matters |
| **Faded** | `template` / table with partial cells | Same shape; learner completes missing rationale, judgement, or cells |
| **Independent** | `scenario` / new data / checklist without model row | Similar task; less scaffolding |

Rules:

- One reasoning move per modelled example (concise).
- Faded rows demonstrate the move; they do not complete the whole task.
- Independent activities must not repeat the modelled answer verbatim.
- Link procedure to meaning where relevant (especially quantitative interpretation).

Auto-applied **Worked-example and faded-support** block on self-directed learner-page DLA, GAM, Design Page, and assessment producer steps.

---

## 6d. Embedded feedback and misconception interruption (Sprint 35)

Use existing fields only (`support_note`, `materials.prompt_set`, `materials.checklist`, `expected_output`, assessment `explanation` / `explanation_or_rationale`, `study_tips`).

| Field | Pattern | Avoid |
|-------|---------|-------|
| `support_note` | **Check your thinking:** + what a wrong answer signals + link back to concept/procedure | Tutoring steps, full solutions |
| `prompt_set` | 1–3 self-check bullets (`If X, revisit Y`) | Answer keys, adaptive branches |
| `checklist` | Optional guard on one item | Long essay prompts in checklist |
| `expected_output` | Quality signals that expose weak reasoning | Pre-written model answers |
| Assessment explanation | One-sentence error pattern + correction cue | Worked solutions, long keys |
| `study_tips` | Brief misconception interrupts | Remediation pathways |

Sequence with 35-2: modelled reasoning first, then faded partial work, then independent transfer — embed misconception checks at faded and independent stages especially.

Auto-applied **Embedded feedback and misconception interruption** block on self-directed learner-page DLA, GAM, Design Page, and assessment producer steps.

---

## 6e. Concept/procedure integration (Sprint 35)

Make procedures meaningful: each move should state what it means conceptually and when it applies.

| Field | Pattern | Avoid |
|-------|---------|-------|
| `knowledge_summary` | One-line preview: how each key idea links to an activity procedure | Long theory dump; pasting full summary into activities |
| `worked_example` / `template` / `checklist` | Step → meaning pairs; optional **Use this when…** | Mechanical steps only |
| `learner_task` | Procedure + conceptual question it answers | Fill-the-table without meaning |
| `expected_output` | Result + interpretation (judgement, when procedure applies) | Completion-only |
| Assessment | Why method/interpretation is appropriate | Answer-only recall |
| `required_materials.specification` | Name conceptual purpose the material must show | — |

Examples: *Judge Correct? → separates procedure claims from single-interval probability*; *Identify author’s claim → separates assertion from evidence*.

Auto-applied **Concept/procedure integration** block on self-directed learner-page DLA, GAM, Design Page, and assessment producer steps.

---

## 6f. Metacognitive closure and evaluative judgement (Sprint 35)

Help learners consolidate what changed in their thinking and exercise judgement — concisely, at page or activity end.

| Field | Pattern | Avoid |
|-------|---------|-------|
| `study_tips` | Closure + transfer bullets (2–4 total) | Diary reflection; generic “reflect on learning” |
| `materials` (Closure/Debrief) | 2–3 judgement questions under ### Closure | Long reflective prose |
| `expected_output` | Evaluative criteria (compare, justify, critique weak reasoning) | Completion-only |
| `transfer_or_application_task` | Where else / what assumption fails | Adaptive coaching |
| Assessment | Compare interpretations; statistical vs practical significance | Answer-only |
| `support_note` | What evidence would strengthen conclusion | Tutoring dialogue |

Examples: *What changed in your understanding?*; *Which interpretation was hardest to justify?*; *Where else would quoting endpoints matter?*

Auto-applied **Metacognitive closure and evaluative judgement** block on self-directed learner-page DLA, GAM, Design Page, and assessment producer steps.

---

## 6g. Session orientation rhetoric (Sprint 37)

Frame each learner page as a **coherent intellectual journey** at entry — not a topic coverage summary or component list.

| Field / section | Pattern | Avoid |
|-----------------|---------|-------|
| `sections[].overview` | 2–4 sentences: topic, stakes, one why-this-is-hard tension, intellectual work modes, named activity arc | “This page covers…”, “Discuss and evaluate…” without stakes or sequence |
| `sections[].learning_purpose` | 3–5 concise outcome-style bullets grounded in activities; may include time/effort | Duplicating entire overview verbatim; generic module welcome |
| `study_orientation` (first activity, 2+ activities) | 2–4 sentences: how to work through the page (order, effort, note-taking) | Repeating full overview; “Welcome to this module” |
| `intellectual_frame` (once) | Mode of inquiry in 1–2 sentences | Duplicating `study_orientation` or reasoning_orientation |
| `knowledge_summary` | One-line preview per key idea → activity move | Substituting for session orientation |

**Five elements** (distribute across overview and/or `learning_purpose`; not all in one field):

1. Topic and disciplinary focus  
2. Intellectual stakes (why misjudgement matters)  
3. One honest conceptual tension (why-this-is-hard)  
4. What the learner will do intellectually (compare, judge, trace mechanism, repair misconception, apply)  
5. How activities build (e.g. model → practise → transfer)

**Exemplar shape:** Marx live page “Introduction and Study Orientation” (`marx-page.json` in Sprint 30 live artefacts).

Auto-applied **Session orientation rhetoric** block on self-directed learner-page DLA, GAM, Design Page, and assessment producer steps.

---

## 6h. Conceptual tension and difficulty framing (Sprint 37)

Name **why this reasoning is hard** with discipline-specific precision — not hype, struggle filler, or reflective diary tone.

### Difficulty types (use the right label; do not conflate)

| Type | Learner discriminates or judges… |
|------|----------------------------------|
| Conceptual difficulty | Two ideas that must stay separate (e.g. genome polarity vs replication strategy; author purpose vs plot) |
| Procedural difficulty | Correct sequence or guard in a method (e.g. quote endpoints; choose α before p-value comparison) |
| Interpretive ambiguity | Two plausible readings until a stated move applies (e.g. procedure vs single-interval “95%”) |
| Disciplinary uncertainty | Scope limits of evidence or models — uncertainty as part of reasoning, not failure |
| Competing explanations | Rival mechanisms or policies using evidence rules, not louder rhetoric |
| Plausible misconception | Intuitive claim that fails a stated test (e.g. weather event vs climate trend) |

### Field placement

| Field | Pattern | Avoid |
|-------|---------|-------|
| `overview` / `learning_purpose` | One primary tension sentence (37-1 element 3) naming distinction + stakes | Coverage menus; “challenging topic” |
| `uncertainty_tension_prompt` | Optional 1–2 activities: what is unstable + discriminating move (1 sentence) | “Reflect on uncertainties”; diary prompts |
| `conceptual_contrast_prompt` | Concept pair + one plausible merge error | Repeating full overview tension |
| `support_note` / `prompt_set` (35-3) | Reactive **Check your thinking** when slip is likely | Same sentence as overview |
| Misconception materials | Claim + repair/classification move | Long myth lists without discriminating columns |

**Honest example (interpretive ambiguity):** *The same “95%” can describe a long-run method or sound like a probability about one interval — you will label which meaning a sentence uses before judging Correct?*

Pairs with Sprint 35 misconception interruption (reactive) and Sprint 37-1 session orientation (proactive entry).

Auto-applied **Conceptual tension and difficulty framing** block on self-directed learner-page DLA, GAM, Design Page, and assessment producer steps.

---

## 6i. Intellectual progression signalling (Sprint 37)

Make the session arc **legible** — activities are cumulative reasoning steps, not adjacent task islands.

### Session phases (compress as needed)

Orienting → distinguishing → testing → integrating → judging → transferring. Name phase **shifts** in bridges, not facilitator choreography.

### Field placement

| Field | Pattern | Avoid |
|-------|---------|-------|
| `overview` / `learning_purpose` | One arc sentence: how activities build (37-1 element 5) | Component lists without sequence |
| `intellectual_coherence_bridge` | Each follow-on activity (2+ page): carried **move** + **escalation** (less scaffold, harder judgement, new context) | “Building on previous activity”; title repeat |
| `activity_preamble` | This activity’s contribution (1 sentence) | Duplicate bridge verbatim |
| `purpose` | Stage: model / practise / integrate / judge / transfer | Duplicate `learner_task` |
| `knowledge_summary` | `use_in_activities` maps ideas → roles in arc | Long theory replacing overview |
| Single-activity `learner_task` | Order matches materials arc (e.g. cards → template → discuss) | Inventory without intellectual order |
| `assessment_check` | Items escalate along same arc when present | Unrelated bolt-on quiz |

**Bridge exemplar:** *Apply the procedure-vs-probability move from the worked example to new statements.*

**Single-activity exemplar (climate-shaped):** *Encounter persuasive claims → classify one focal claim with evidence → defend a corrected explanation in discussion.*

Tie progression to 37-2: later activities use earlier **distinctions as tools**.

Auto-applied **Intellectual progression signalling** block on self-directed learner-page DLA, GAM, Design Page, and assessment producer steps.

---

## 6j. Epistemic synthesis and closure (Sprint 37)

End sessions with **epistemic clarity** — what should now be clearer — not procedural completion, topic recap, or reflective diary tone.

### Closure principles (use ≥1 per page end; concise)

- **What should now be clearer** — which distinction or concept pair is stable  
- **What distinction can now be sustained** — which merge error should feel less persuasive  
- **What kind of judgement is now possible** — what verdict the learner can defend with stated evidence rules  
- **What explanatory move matters differently** — which carried move (37-3) now governs later reasoning  

Tie to **37-2 tension** and **37-3 arc** in one clause each — do not re-paste the full overview.

### Field placement

| Field | Pattern | Avoid |
|-------|---------|-------|
| `study_tips` | 2–4 bullets: ≥1 epistemic synthesis + optional ≤1 technique; optional brief transfer | “Reflect on learning”; “you have completed”; recap lists |
| `materials` ### Closure / ### Debrief | 2–3 judgement questions on culminating activity | Long reflective essays |
| `expected_output` (final activity) | Include one epistemic synthesis criterion | Completion-only |
| `support_notes` | If no `study_tips`, may carry 2 epistemic bullets — not procedural-only revision | Substitute for synthesis on rich learner pages |
| `knowledge_summary` | Preview at start only — not post-session recap essay | Key takeaways dump |
| Assessment `explanation` | Reinforce distinction corrected | Full worked solutions |

**Exemplar (CI-shaped):** *Before you finish: what changed in your understanding of interval interpretation?* + *Which row was hardest to justify, and what evidence would make your conclusion more reliable?*

Pairs with Sprint 35 §6f (activity judgement) — §6j deepens **page-level** synthesis.

Auto-applied **Epistemic synthesis and closure** block on self-directed learner-page DLA, GAM, Design Page, and assessment producer steps.

---

## 6k. Transfer and durable understanding (Sprint 37)

Extend **reusable judgement** beyond the immediate session without diluting **37-4 epistemic synthesis** or reopening the full arc.

### Modes (do not conflate)

| Mode | What the learner does | Typical surface |
|------|----------------------|-----------------|
| **Transfer** | Apply a **named move** in a **changed context** | `transfer_or_application_task`, one `study_tips` bullet |
| **Extension** | Same discriminating rule in an adjacent setting | Scenario, new numbers, new excerpt |
| **Comparison** | Judge explanations with **session criteria** | Debrief, contrast table |
| **Durable understanding** | Distinction remains usable after the session | 37-4 “sustained” + transfer habit |
| **Limit of transfer** | Where reasoning **fails** or assumptions break | Optional limit bullet; assumption-fails clause |

**Closure (37-4)** = what should now be clearer **in this session**. **Transfer (37-5)** = where the move applies **next** or **does not**.

### Field placement

| Field | Pattern | Avoid |
|-------|---------|-------|
| `transfer_or_application_task` | Final/transfer activity: move + context; optional limit clause | Generic “real world”; employability |
| `study_tips` | ≤1 transfer + optional ≤1 limit within 2–4 bullets | Third recap; “continue exploring” |
| `materials` ### Debrief | One comparison using session criteria | Detached compare-and-contrast |
| `expected_output` (transfer) | Apply move in new context or reject over-generalisation | Completion-only |
| `use_in_activities` | Maps ideas → transferable arc roles | Post-session extension essay |

### Discipline targets

| Session shape | Transfer bullet | Limit bullet |
|---------------|-----------------|--------------|
| **CI** | Procedure-vs-interval in [new context] | When endpoint/overlap rules fail if… |
| **Marx** | Purpose-and-difference on [other text/claim] | Assumption fails elsewhere |
| **Climate** | Evidence classification on [new claim] | Mechanism evidence vs policy debate |
| **RNA** | Diagnostic rule for [changed case feature] | Label recall without evidence |

**Exemplar (Marx-shaped):** *Where else would comparing interval endpoints matter — name one context in one sentence.* + *Name one assumption in your factory explanation that might fail in a different workplace.*

Pairs with Sprint 35 fading (model → transfer activity) and Sprint 37-4 (epistemic bullets first).

Auto-applied **Transfer and durable understanding** block on self-directed learner-page DLA, GAM, Design Page, and assessment producer steps.

---

## 7. Misconception Integration

Where relevant, prompts should require:
- identification of misconceptions
- use of misconceptions in:
  - distractors
  - feedback
  - activity design

This is critical for high-quality assessment.

---

## 8. Clarity and Concision

Prompts should instruct the model to:
- use clear, direct language
- avoid unnecessary verbosity
- keep outputs usable in real contexts (e.g. VLEs)

---

## 9. Scalability Awareness

Prompts should consider scale:

- Prefer:
  - automated feedback
  - reusable outputs
  - minimal manual intervention

- Avoid:
  - tutor-heavy processes unless explicitly required

---

## 10. Controlled Creativity

Prompts may allow variation, but within constraints.

- Encourage:
  - variation in question types
  - different activity formats

- Constrain:
  - scope to source content
  - alignment with artefacts

---

## 11. Operational Usability for Delivery

Prompts for reusable artefacts must require outputs that are:

- structured
- reusable
- operationally usable in live delivery

Avoid:

- vague activity descriptions
- rationale-only sequencing outputs
- outputs that require additional design interpretation before implementation
- activity or material references that are not present in upstream artefacts
- unresolved material placeholders in final delivery artefacts
- activity-level material requirements that are missing purpose/specification
- activity_materials entries that are label-only and do not contain usable content
- activity_materials entries missing facilitator usage guidance
- activity_materials entries that violate the defined type schema
- vague usage statements that do not explain when/how facilitators and learners use the material
- session-level delivery artefacts placed inside activity_materials
- session_materials entries missing usage guidance or usable content
- duplicated content across activity_materials and session_materials without a delivery reason
- process-explanation activities that rely on hidden internals without an observable representation in materials
- zero-minute sequencing blocks or bookkeeping-only closure steps
- broad session/module scaffolding when `design_scope` is `single_activity` unless explicitly requested
- module_map or multi-week structures when `design_scope` is `single_activity`

---

# Prompt Construction Pattern

A good learning design prompt typically includes:

1. Context
   - what the input is

2. Task
   - what transformation to perform

3. Constraints
   - rules to follow (e.g. alignment, fidelity)

4. Output format
   - explicit structure (JSON/schema)

5. Guidelines
   - quality expectations

---

# Summary

These rules ensure that prompts within learning design workflows:

- produce consistent outputs
- support reusable artefacts
- enforce instructional design quality
- integrate seamlessly into PRISM workflows
