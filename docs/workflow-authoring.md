# Workflow Authoring Guide (Pedagogy-First)

This guide explains how to design high-quality PRISM workflows for learning content creation.

## Authoring Principles

- Design steps for real decision points, not micro-actions.
- Keep each step outcome explicit (`outputName` helps).
- Use prompt links (`promptId`) for repeatability.
- Use `notes` for context-specific instructions not worth making a reusable prompt.
- Keep dependencies linear and clear (`inputFromStepId`).
- Each step should be understandable and executable in isolation given its declared inputs.

## Recommended Step Granularity

Use one step when actions naturally happen together:
- "Generate activities and answer key"

Split into separate steps when:
- A human review/approval is needed
- You switch task mode (analysis -> drafting -> assessment design)
- A previous step's output must be stabilized before continuing

## Complexity Control

Keep workflows usable by default:

- Prefer **5-8 steps** unless complexity clearly demands more.
- Use **compact mode** for 4-6 steps when speed/simplicity is prioritized.
- Use **full mode** for 6-8 steps when richer outputs and stronger QA are required.
- Avoid splitting steps unless at least one applies:
  - Different task type
  - Human review gate
  - Output is reused downstream

If in doubt, keep the workflow compact and expand only where quality depends on it.

## Common Step Types

Use step type patterns to avoid inconsistent boundaries:

- **Extraction**: input -> structured data
  - Example: raw content -> concept map
- **Transformation**: intermediate -> improved intermediate
  - Example: draft outcomes -> measurable outcomes
- **Generation**: intermediate(s) -> new artefact
  - Example: outcomes + sequence -> activity plan
- **Evaluation**: artefact -> critique/report
  - Example: assessment pack -> alignment QA report
- **Synthesis**: multiple artefacts -> unified output
  - Example: outcomes + activities + assessments -> instructor guide

## Pedagogy Workflow Template

Common 8-step structure:

1. Clarify audience and constraints
2. Define learning outcomes
3. Sequence content by outcomes
4. Draft instructional activities
5. Design assessments aligned to outcomes
6. Produce instructor facilitation notes
7. Build learner materials
8. QA for alignment/accessibility/time-on-task

## Prompt Design Conventions

For reusable pedagogy prompts:
- Make expected output format explicit (tables, headings, JSON, rubric format).
- Specify output format explicitly whenever outputs are reused downstream.
- Include alignment checks:
  - outcome -> activity -> assessment traceability
- Include ambiguity behavior:
  - what model should do if inputs are incomplete.

Good prompt tags:
- `pedagogy`
- `lesson-design`
- `assessment`
- `activities`
- `facilitation`
- `alignment`

## Field Guidance

Workflow-level fields:
- `description`: one-sentence mission
- `artefacts`: exact inputs provided by user
- `scopeAndConstraints`: format/duration/effort/level/accessibility constraints

Step-level fields:
- `title`: concise action
- `roleLabel`: why this step exists
- `inputKind`: expected primary input type
- `inputFromStepId`: point to prior output when chaining
- `outputName`: stable name for later references
- `notes`: key run instructions and conditions

## Artefact Contract (Practical)

Design outputs as reusable artefacts, not incidental text.

- Use descriptive `outputName` values (for example `alignment_matrix`, `facilitation_notes`).
- If downstream steps depend on a result, always name the upstream output.
- In notes/prompts, explicitly reference the artefact being consumed.
- Keep artefact naming consistent across steps to reduce ambiguity.
- Do not introduce artefacts unless required by final outputs or consumed by downstream steps.

## Anti-Patterns

- Too many micro-steps that do not require review between them
- Missing `outputName` for steps whose outputs are reused
- Reusing one generic prompt for unrelated pedagogical goals
- Unlinked `promptId` values (references to missing prompts)
- No time/effort constraints in `scopeAndConstraints`

## Quality Checklist

Before saving/exporting a workflow:

- Each step has a clear output target.
- Assessments align to outcomes.
- Activities align to outcomes and level.
- Estimated learner effort is realistic and explicit.
- Accessibility requirements are called out.
- All `promptId` references resolve to imported prompts.

## Maintenance Checklist

When app schema changes:

1. Update `workflow-spec.md` first.
2. Update all JSON examples in `docs/examples/`.
3. Update this authoring guide where semantics changed.
4. Re-import example bundles into PRISM as a smoke test.
