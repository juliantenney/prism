# domain-learning-design-artefacts.md

## Purpose

This document defines the canonical artefacts used in learning design workflows within PRISM.

Artefacts are the **core data structures** that workflows produce and consume.  
They act as stable interfaces between steps and enable composability across workflows.

---

# Design Principles

- Artefacts must be:
  - clearly named
  - reusable across workflows
  - structured (prefer JSON-compatible formats)
  - grounded in source content

- Avoid:
  - vague names (e.g. "result", "data")
  - one-off artefacts that are not reused

---

# Core Artefacts

## 1. normalized_content

### Description
A cleaned and structured representation of raw input content.

### Purpose
- Removes noise (e.g. transcription artefacts)
- Segments content into meaningful units
- Prepares content for further analysis

### Typical Structure
- topic
- purpose
- sections (with key ideas, examples, definitions)

---

## 2. knowledge_model

### Description
A structured representation of the conceptual knowledge within the content.

### Purpose
- Identifies key concepts
- Defines relationships between concepts
- Surfaces processes and structures
- Identifies misconceptions

### Typical Structure
- concepts
- relationships
- processes (optional)
- misconceptions

---

## 3. learning_outcomes

### Description
A set of measurable statements describing what learners should be able to do.

### Purpose
- Defines intended learning
- Drives activity and assessment design

### Requirements
- Must be observable and assessable
- Must align with concepts in the knowledge_model

---

## 4. assessment_blueprint

### Description
A structured plan for assessment tasks.

### Purpose
- Maps outcomes or concepts to assessment items
- Defines cognitive level and intent of each item

### Typical Structure
- purpose
- question_plan (with concept, level, rationale)

---

## 5. learning_activities

### Description
A set of designed tasks that require learner engagement.

### Purpose
- Enable learners to achieve learning outcomes
- Provide practice and application opportunities

### Requirements
- Must require active engagement
- Must align with outcomes
- Each activity should include:
  - required_materials (array of { material_id, type, purpose, specification })
  - learner_task
  - expected_output
  - facilitator_moves or facilitation_notes
  - grouping
  - duration_minutes
- required_materials defines WHAT materials are needed, not the full material content
- required_materials entries should include:
  - material_id
  - type
  - purpose (what the material is used for)
  - specification (what the material should contain)
- required_materials.type should use controlled values:
  - task_cards
  - prompt_set
  - scenario
  - checklist
  - template
  - sample_output

---

## 6. activity_materials

### Description
Facilitator-ready materials generated from activity material specifications.

### Purpose
- Convert activity material requirements into complete reusable resources
- Provide concrete workshop-ready assets for sequence delivery

### Requirements
- Must map materials to activity_ids from learning_activities
- Must preserve material_id from required_materials
- For `design_scope = single_activity`, default output should include only activity-level materials required for the selected activity design
- Each material should include:
  - material_id
  - activity_id
  - type
  - title
  - usage
  - content
- usage is required and must state:
  - when the facilitator introduces the material
  - how learners interact with it
  - what the facilitator does with it
- Avoid vague usage such as "Used in activity"
- content must contain actual usable material content (array or structured object)
- No placeholders or label-only content
- Do not describe a material without writing its usable content
- Handouts, guides, summaries, worksheets, and support sheets must be fully written out
- Must satisfy the corresponding required_material specification

### Strict Activity-Level Type Schemas
- task_cards:
  - content: [
      { "text": "string" }
    ]
- sample_output:
  - content: "string" OR ["string"]
- template:
  - content: {
      "fields": ["string"]
    }
- checklist:
  - content: {
      "sections": [
        {
          "label": "string",
          "items": ["string"]
        }
      ]
    }
- scenario:
  - content: [
      {
        "scenario_title": "string",
        "text": "string"
      }
    ]
- prompt_set:
  - content: ["string"]
- text:
  - content: "string" OR ["string"]

### Output Checks
- checks must include:
  - all_materials_fully_generated
  - no_placeholder_materials
  - all_materials_have_usage
  - all_materials_match_specification

---

## 7. session_materials

### Description
Lightweight session-level support resources used across activities.

### Purpose
- Provide small cross-session support resources
- Preserve legacy compatibility where lightweight session resources are still needed
- Avoid overlap with full assembled delivery artefacts

### Requirements
- Must not be tied to a single activity_id
- For `design_scope = single_activity`, do not generate session_materials unless explicitly requested in constraints/brief
- Each material should include:
  - material_id
  - type
  - title
  - usage
  - content
- type should be lightweight support only (for example: agenda_outline, timing_overview, logistics_note, resource_index)
- usage is required and must state how the material supports whole-session delivery
- content must contain actual usable material content (string, array, or structured object)
- Do not use session_materials to store full page or slide_deck artefacts
- Do not duplicate activity-level material content unless needed for usability

---

## 10. slide_deck

### Description
A structured presentation-support artefact aligned to delivery sequence.

### Purpose
- Support delivery moments such as framing, task launch, debrief, and closure
- Provide concise slide-level support aligned to sequence and activities
- Complement, not replace, learning materials and sequence artefacts

### Typical Structure
- title
- audience
- slides[]:
  - slide_id
  - slide_title
  - purpose
  - content
  - facilitator_notes (optional)
  - linked_activity_ids (optional)
  - linked_material_ids (optional)

### Requirements
- Must be assembled from learning_outcomes, learning_activities, activity_materials, and learning_sequence
- Must align to sequence moments and preserve activity/material traceability where relevant
- Must not duplicate full material bodies unless needed for slide usability
- Must not redesign learning pedagogy

### Render Hints
```json
{
  "renderHints": {
    "renderable": true,
    "supportedFormats": ["html"],
    "rendererType": "slides",
    "rendererVariant": "slide_deck",
    "renderConfig": {
      "sectionOrder": ["slides"],
      "labels": {
        "slides": "Slides"
      },
      "omitIfMissing": [],
      "grouping": "slide_cards",
      "itemKeyMap": {
        "slideTitle": "slide_title",
        "slideContent": "content",
        "slideNotes": "facilitator_notes"
      }
    }
  }
}
```

---

## 11. mcq_items

### Description
A set of multiple-choice questions.

### Purpose
- Provide scalable assessment
- Test understanding and application

### Requirements
- One correct answer
- Plausible distractors
- Alignment with concepts or outcomes

---

## 12. feedback_pack

### Description
A structured set of feedback linked to assessment items.

### Purpose
- Explain correct answers
- Address misconceptions
- Support learning improvement

---

## 13. learning_sequence

### Description
An ordered structure of learning activities and content.

### Purpose
- Organises learning into a coherent experience
- Manages progression and scaffolding

### Requirements
- Must be a timed plan with explicit blocks
- Must reference activities where relevant
- Each block should include:
  - facilitator actions
  - learner actions
  - grouping
  - transition to next block
- Must include checks that confirm:
  - all_activity_ids_valid
  - no_new_activities_introduced
  - all_materials_traceable_to_activity_materials
  - cognitive_timing_feasible
  - closure_integrated
  - no_zero_minute_blocks
  - omissions_justified
- Should include:
  - activities_used
  - activities_omitted (with reason for omission)

---

## 14. module_map

### Description
A structured multi-week/module plan for higher-education delivery.

### Ownership
- Primary producer: `Construct Learning Sequence` (module/course contexts)

### Typical Structure
- weeks[] where each week includes:
  - week (number)
  - topic
  - learning_outcomes[]
  - activities[]

### Requirements
- JSON-structured output (not prose narrative only)
- Must only be produced when module-level indicators are present
- Must not be produced for `design_scope = single_activity`

---

## 15. vle_structure

### Description
A structured VLE-ready organisation of sections, resources, and activities.

### Purpose
- Represent learning design as learner-facing VLE structure without platform lock-in
- Preserve pedagogic sequencing and activity intent in organised sections
- Provide a stable source artefact for later Moodle/VLE transformation prompts

### Typical Structure
- title
- organisation_mode (topic | week | session)
- sections[]:
  - section_id
  - title
  - summary
  - resources[]
  - activities[]
  - learner_instructions (optional)
  - release_notes (optional)

### Requirements
- JSON-structured output
- Must preserve alignment with upstream learning outcomes, activities, materials, and sequence
- Must not invent new learning activities
- Must not collapse pedagogic structure into purely technical categories
- Must remain suitable as a stable source artefact for later platform-specific transformation

---

## 16. learning_object_set

### Description
One coherent artefact containing one or more structured digital learning objects.

### Purpose
- Represent reusable interactive learning-object content grounded in workflow artefacts
- Support Xerte-style or similar digital learning-object implementations
- Provide a stable source artefact for later rendering/package prompts

### Typical Structure
- title
- audience
- objects[]:
  - object_id
  - title
  - purpose
  - pages[]
  - type / interaction_type
  - content
  - linked_activity_ids (optional)
  - linked_outcomes (optional)

### Requirements
- JSON-structured output
- Must include one or more coherent learning objects in a single artefact
- Must remain grounded in upstream artefacts
- Must not invent unsupported pedagogy
- Must remain suitable as a stable source artefact for later interactive rendering

---

## 18. page

### Description
A structured readable composite artefact assembled from existing learning design outputs for HTML/VLE page delivery.

### Purpose
- Provide one coherent profile-aware page body suitable for VLE/HTML use
- Support learner, facilitator, and assessment page profiles from one composite artefact
- Preserve explicit requested components, quantities, and constraints with high fidelity

### Typical Structure
- artifact_type
- title
- audience
- page_profile (learner | facilitator | assessment)
- sections[] (array of section objects):
  - section_id
  - heading
  - content
  - canonical section_id order (when applicable):
    - overview
    - learning_purpose
    - knowledge_summary
    - learning_activities
    - assessment_check
    - support_notes
- source_artefacts (optional)
- constraints_applied (optional)
- generation_notes (optional):
  - limitations[] (required when any explicit hard requirement cannot be fully satisfied or when any activity is omitted)
  - activities_omitted[] (required for each intentional activity omission: activity_id, title, reason, authority = user_constraint | duration_constraint | explicit_exclusion)

### Requirements
- Must be assembled from `learning_outcomes`, `learning_activities`, and `activity_materials`
- May incorporate `learning_sequence`, `assessment_items`, `feedback_pack`, `marking_rubric`, and `assessment_blueprint` when present
- Must remain grounded in provided upstream artefacts only
- Must not invent unsupported pedagogy, activities, resources, questions, or feedback
- Must omit unsupported optional sections rather than fabricate them
- Must respect selected `page_profile` and include profile-appropriate sections
- Must preserve alignment with outcomes, activities, materials, and assessments where relevant
- Must be usable as a standalone readable page for the selected profile
- Must treat explicitly requested component types, quantities, and exclusions as hard constraints
- Must preserve requested counts for learner-facing components (for example MCQs, tasks, reflection prompts) unless impossible
- Sections must use meaningful headings/titles derived from intent/content; generic placeholders like "Section 1" are fallback-only when no better heading is available
- If explicit hard constraints cannot be met from available upstream artefacts, must record the gap in `generation_notes.limitations` instead of silently reducing scope
- When upstream `learning_activities` is provided, every upstream `activity_id` must appear in `sections[]` learning_activities content unless traceably omitted in `generation_notes.activities_omitted[]`
- `learning_sequence` controls order and timing only; it must not reduce activity membership below upstream `learning_activities`
- `activity_materials` enrich activities only; they must not define which activities exist on the page
- If `page_profile` is `learner`, include at minimum substantive summary/content plus learner tasks/instructions
- If `page_profile` is `facilitator`, include at minimum run/session guidance plus sequencing/logistics/facilitation notes
- If page_profile is `assessment`, must preserve structured assessment item integrity (do not flatten questions into narrative prose)
- If `page_profile` is `assessment`, include at minimum a structured questions/items section and optionally `answer_key`, `marking_guidance`, and `feedback_guidance` when supported and requested
- If formative MCQs/questions are included, each item must be structurally valid (at least `stem` and `options`)
- If exclusions such as "do not include answers" are requested, question items must omit answer-bearing fields while preserving question structure

### Render Hints
```json
{
  "renderHints": {
    "renderable": true,
    "supportedFormats": ["html"],
    "rendererType": "document",
    "rendererVariant": "page",
    "renderConfig": {
      "sectionOrder": ["overview", "learning_purpose", "knowledge_summary", "learning_activities", "assessment_check", "support_notes"],
      "labels": {
        "overview": "Overview",
        "learning_purpose": "Learning Purpose",
        "knowledge_summary": "Key Knowledge Summary",
        "learning_activities": "Learning Activities",
        "assessment_check": "Formative Assessment Check",
        "support_notes": "Support Notes"
      },
      "omitIfMissing": ["assessment_check", "support_notes", "source_artefacts", "constraints_applied", "generation_notes"],
      "grouping": "document_sections",
      "itemKeyMap": {}
    }
  }
}
```

---

## 19. marking_rubric

### Description
A tutor-facing marking rubric for assessing submitted responses consistently.

### Purpose
- Provide transparent assessment criteria and descriptors
- Support reliable, fair marking across assessors
- Align grading practice with the assessment blueprint and outcomes

### Typical Structure
- rubric (title, purpose)
- criteria[]:
  - criterion_id
  - criterion
  - weight
  - descriptors (level-specific guidance)
- grading_scale
- moderation_guidance
- assessor_notes

### Requirements
- Must align to `assessment_blueprint` intent and coverage
- Must use `revised_assessment_items` when present, otherwise `assessment_items`
- Criterion weights must sum to 100
- Descriptors must be actionable for tutors/markers
- Must include moderation guidance for consistency across markers

---

# Usage Guidelines

- Workflows should:
  - produce artefacts with outputName
  - reuse artefacts via inputFromStepId
  - maintain consistency in naming

- Prefer:
  - chaining artefacts across workflows
  - reusing core artefacts rather than redefining them

---

# Summary

Artefacts are the **foundation of composable learning design workflows** in PRISM.

They enable:
- reuse
- consistency
- quality control
- interoperability between workflows
