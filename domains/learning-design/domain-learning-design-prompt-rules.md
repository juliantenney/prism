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
