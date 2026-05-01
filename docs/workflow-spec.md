# PRISM Workflow Bundle Specification

This document defines the JSON contract for workflow bundles imported/exported by PRISM.

## Bundle Shape

PRISM accepts a top-level object:

```json
{
  "version": 1,
  "prompts": [],
  "workflows": []
}
```

Notes:
- `version` is currently informational (`1` in exports).
- `prompts` and `workflows` should both be present as arrays.
- PRISM also accepts direct arrays for import:
  - Array of workflow objects
  - Array of prompt objects
  - But bundled object is recommended.

## Prompt Object Schema

Prompt import is strict. These fields are required for each prompt:
- `id` (string, unique)
- `title` (string, non-empty)
- `body` (string, non-empty)

Common full shape:

```json
{
  "id": "prompt-lesson-outline-v1",
  "title": "Lesson outline generator",
  "body": "Create a lesson outline for...",
  "model": "",
  "temperature": null,
  "maxTokens": null,
  "tags": ["pedagogy", "lesson-design"],
  "createdAt": 1710000000000,
  "updatedAt": 1710000000000,
  "usageCount": 0,
  "source": "manual",
  "versions": [
    {
      "id": "prompt-lesson-outline-v1-v1",
      "timestamp": 1710000000000,
      "body": "Create a lesson outline for...",
      "notes": ""
    }
  ],
  "notes": ""
}
```

Normalization behavior:
- If prompt is missing required fields (`id`, `title`, `body`), it is skipped.
- `source` should be `"manual"` or `"refined"` (use `"manual"` for generated bundles unless you need otherwise).
- If `versions` is missing/empty, PRISM will generate a fallback version snapshot on import.

## Workflow Object Schema

Workflow objects are imported from `workflows` and merged by `id`.

Recommended shape:

```json
{
  "id": "workflow-instructor-guide-v1",
  "name": "Instructor guide from raw content",
  "description": "Turns raw content into a complete instructor guide.",
  "artefacts": "Raw content, audience profile, delivery format",
  "scopeAndConstraints": "Short course, 60-minute learner effort, accessibility requirements",
  "steps": [],
  "createdAt": 1710000000000,
  "updatedAt": 1710000000000
}
```

Workflow fields:
- `id`: string, unique
- `name`: workflow title
- `description`: short purpose
- `artefacts`: key inputs/resources
- `scopeAndConstraints`: scope details (duration, level, effort, constraints)
- `steps`: ordered list of step objects
- `createdAt` / `updatedAt`: epoch milliseconds

## Step Object Schema

Recommended shape:

```json
{
  "id": "step-01-outcomes",
  "title": "Define learning outcomes",
  "roleLabel": "Outcomes design",
  "promptId": "prompt-outcomes-v1",
  "inputKind": "text",
  "inputFromStepId": "",
  "outputName": "learning_outcomes",
  "notes": "Use Bloom-aligned verbs and measurable outcomes."
}
```

Step fields:
- `id`: string, unique within workflow
- `title`: step name shown in UI
- `roleLabel`: optional short purpose
- `promptId`: optional reference to `prompts[].id`
- `inputKind`: one of:
  - `"text"`
  - `"file"`
  - `"url"`
  - `"none"`
- `inputFromStepId`: optional dependency on previous step id
- `outputName`: optional label for produced output
- `notes`: optional execution guidance

Step execution principle:
- Each step should be understandable and executable in isolation given its declared inputs.

## Artefact Design Principles

Treat workflows as data pipelines. Each step should produce reusable artefacts.

Output artefacts should be:
- Reusable by downstream steps
- Stable in meaning across the workflow
- Named descriptively (for example `knowledge_model` instead of `result`)

Rules:
- If a step output is consumed later, that step should set `outputName`.
- Prompts and notes should refer to artefacts explicitly by role/name.
- Avoid generic output labels when outputs are reused.
- Do not introduce artefacts that are not used downstream or required by final outputs.

## Step Type Patterns

Use these common step categories to improve consistency:

- Extraction: raw input -> structured representation
- Transformation: intermediate artefact -> refined artefact
- Generation: artefact(s) -> new output asset
- Evaluation: draft artefact -> critique/quality report
- Synthesis: multiple artefacts -> unified deliverable

Pattern guidance:
- Keep step boundaries aligned to one dominant type.
- Split steps when types change and review is helpful.
- Avoid mixing unrelated types in one step unless workflow is intentionally compact.

## Prompt Scope and Statelessness

Workflow-linked prompts should be self-contained.

Prompts should:
- Define the task clearly
- Define constraints and must-haves
- Define output format/structure
- Refer to expected input artefacts explicitly
- Specify output format explicitly whenever outputs are reused downstream (for example JSON schema, table columns, or heading structure).

Prompts should not:
- Assume hidden context not present in the current step inputs
- Rely on previous conversation state being remembered
- Depend on implicit defaults not stated in prompt/notes

## Cross-Reference Rules

To avoid broken workflows:
- Every `step.promptId` should reference an existing prompt in `prompts`.
- Every `step.inputFromStepId` should reference a valid prior step in the same workflow.
- Keep IDs stable once in use to support updates and merges.

## Import Behavior (Merge)

When importing bundled object:
- Prompts:
  - Merge by `id`
  - `newerWins` mode is used for bundled imports (newer `updatedAt` wins)
- Workflows:
  - Merge by `id`
  - `newerWins` mode for bundled imports
  - Older imports may be skipped if local copy is newer

## Validation Checklist (Before Import)

- JSON parses cleanly (no comments/trailing commas).
- Top-level object includes `prompts` and `workflows`.
- Prompt required fields present: `id`, `title`, `body`.
- `step.promptId` values exist in prompts array.
- `inputKind` values are valid enum values.
- `createdAt` and `updatedAt` are epoch milliseconds.
- IDs are unique and deterministic enough for later updates.
- Reused step outputs are explicitly named with `outputName`.
