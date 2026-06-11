# Sprint 41 Implementation Start Points

## Implementation Goal

Apply the Educational Quality Framework to PRISM generation so that outputs more consistently manifest:

- Understanding
- Capability
- Judgement
- Independence
- Metacognition
- Learning success
- Progressive independence

## Likely Implementation Strategy

Implementation is expected to be primarily prompt-architecture work.

Major architecture changes are not expected unless investigation proves otherwise.

## Initial Tasks

### 1. Locate Prompt Entry Points

Identify where PRISM currently defines or assembles prompts for:

- page generation
- learning activities
- learning sequences
- assessment
- feedback
- PEL / metacognitive guidance

### 2. Map Framework Concepts to Prompt Locations

For each framework element, identify where it should enter the generation process.

Example:

| Framework Element | Likely Prompt Location |
|---|---|
| North Star | System / workflow level |
| Learner transformations | Workflow / sequence / activity prompts |
| Developmental pathways | Sequence and activity prompts |
| Judgement development | Activity and assessment prompts |
| Metacognition | PEL / guidance layer prompts |
| Learning success | Activity framing and reflection prompts |
| Progressive independence | Sequence and activity progression prompts |

### 3. Preserve Existing Architecture

Do not redesign architecture unless required.

The expected work is to adapt existing prompt structures and generation guidance.

### 4. Add Manifestation Guidance

Ensure prompts specify what framework concepts should look like in outputs.

Examples:

- Judgement should manifest as comparison, evaluation, justification, critique and defence.
- Independence should manifest as reduced scaffolding, learner decision making and transfer.
- Metacognition should manifest as lightweight guidance, reflection, confidence checks and progress checks.
- Learning success should manifest as visible learner progress and confidence development.

### 5. Review Output Structure

Investigate how to support the conceptual two-column model:

- Learning Guidance
- Learning Activities

Accessibility must be considered.

The two-column model should not require inaccessible layout.

It may be implemented structurally or semantically rather than literally as visual columns.

### 6. Test Against Existing Output

Use the inflation self-study output as a comparison case.

Ask:

- Does the revised generation improve understanding development?
- Does it strengthen judgement?
- Does it make learning success visible?
- Does it support progressive independence?
- Does it include metacognitive guidance without overwhelming the content?

## Key Implementation Principle

Do not optimise for more visible activity.

Optimise for better cognitive activity.

The learner should be asked to think, compare, evaluate, justify, reflect, decide and transfer.
