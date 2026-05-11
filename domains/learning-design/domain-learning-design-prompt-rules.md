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
