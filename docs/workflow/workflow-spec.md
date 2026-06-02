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
  "artifacts": "Raw content, audience profile, delivery format",
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
- `artifacts`: key inputs/resources
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

Treat workflows as data pipelines. Each step should produce reusable artifacts.

Output artifacts should be:
- Reusable by downstream steps
- Stable in meaning across the workflow
- Named descriptively (for example `knowledge_model` instead of `result`)

Rules:
- If a step output is consumed later, that step should set `outputName`.
- Prompts and notes should refer to artifacts explicitly by role/name.
- Avoid generic output labels when outputs are reused.
- Do not introduce artifacts that are not used downstream or required by final outputs.

## Step Type Patterns

Use these common step categories to improve consistency:

- Extraction: raw input -> structured representation
- Transformation: intermediate artifact -> refined artifact
- Generation: artifact(s) -> new output asset
- Evaluation: draft artifact -> critique/quality report
- Synthesis: multiple artifacts -> unified deliverable

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
- Refer to expected input artifacts explicitly
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

## Page Assembly and Renderer Compatibility Notes

When workflows include page-oriented learning design steps:

- Keep `artifact_type` stable as `page` for page artifacts.
- Preserve structured `assessment_items` content in page assembly inputs when available.
- Avoid compressing learner-facing activity materials into label-only placeholders.
- Preserve assessment item structure fields where available (`item_id`, `stem`, `options`, and answer/explanation fields when policy permits) so downstream renderer modes can present them correctly.

Renderer-specific behavior is documented in:

- `docs/architecture/renderer-export-behavior.md`

## Sequencing Interaction Policy Rollout (V1)

The sequencing/ranking learner-order policy is rollout-gated.

- Policy key:
  - `enableSequencingInteractionPolicy` (boolean render option), or
  - `sequencingPolicy.enabled` (equivalent object form)
- Current rollout stage:
  - **enabled for strict learner exports only**
  - disabled elsewhere by default (facilitator/instructor/default render paths)

Expected behavior when enabled:
- Applies only to activity rows marked as `activity_interaction_type: sequencing|ranking`
- Learner-facing task-card order follows `ordering.learner_display_order` when present
- `ordering.canonical_order` remains internal correctness metadata and is not used as learner display order
- Duplicate learner item enumeration may be suppressed when task cards represent the same sequencing set
- Short learner task/instruction framing text should remain visible above activity cards

Guardrails:
- No policy effect when disabled
- No suppression for non-sequencing/non-ranking activity rows
- Legacy rows use conservative fallback matching; no suppression unless confidence is high
- Renderer consumes metadata only and must not mutate activity metadata

Activation path and rollback:
- Activation path:
  - strict learner exports (page sections-array export path with `page_profile = learner`) auto-set `enableSequencingInteractionPolicy: true`
  - explicit render option still takes precedence for manual control
- Rollback:
  - pass `enableSequencingInteractionPolicy: false` in export/render options to disable immediately
  - no schema rollback required; metadata fields remain backward-compatible when policy is off

Rationale:
- Fixes learner-facing sequencing leakage and duplicate list/card enumeration where metadata supports it
- Limits risk by keeping facilitator/default rendering unchanged

Known limitations:
- Legacy rows without stable item IDs may fall back to strict text-overlap checks
- Policy currently targets sequencing/ranking only (not classification/discussion)

Future expansion path:
- After additional fixture validation, consider default enablement for broader learner export surfaces
- Keep non-learner profiles opt-in unless pedagogy requirements change
