# PRISM Shared Operational Vocabulary

These phrases are lightweight operational shorthand used across PRISM development sessions involving:

- Julian
- ChatGPT
- Cursor

The goal is:

- continuity
- consistency
- bounded architectural work
- reduced conversational overhead
- coherent architectural traceability

These are conventions, not strict commands.

## "Close this chat down"

Meaning:

Perform end-of-session workflow including:

- docs updates
- continuity updates
- handover preparation
- bootstrap preparation
- next bounded task definition
- commit/check-in preparation

## "Prepare the next chat"

Meaning:

Generate:

- suggested next bounded task
- bootstrap prompt
- relevant file list
- constraints/context for the next chat

## "Prepare sprint folder"

Meaning:

Create one portable sprint folder for the next architectural chat including:

- `SPRINT-CONTEXT.md`
- `GPT-BOOTSTRAP-PROMPT.md`
- `CURRENT-STATE.md`
- `HANDOVER.md`
- `context-files/` bounded files only

Clarification:

Sprint folders should remain intentionally minimal and tightly aligned to the next bounded task. They are not archives, backups, or full project exports.

Compatibility note:

- "Prepare context pack" remains a valid legacy phrase from Sprint 01 and should be interpreted as "prepare sprint folder."

## "Run continuity update"

Meaning:

Review and update:

- `current-state.md`
- decisions log (if needed)
- handover docs/templates
- relevant continuity information

## "Bootstrap this task"

Meaning:

Create:

- bounded task definition
- recommended files
- architectural constraints
- suggested starting prompt

## "Consolidation pass"

Meaning:

Focus on:

- cleanup
- clarification
- rationalisation
- consistency
- stability

Avoid:

- major feature expansion
- speculative redesign
- unrelated refactors

## "Architectural review"

Meaning:

Prioritise:

- conceptual clarity
- semantics
- responsibilities
- system boundaries
- contracts/schemas

Implementation should remain secondary.

## "Smoke-check"

Meaning:

Perform lightweight runtime/path/UI verification without broad testing or refactoring.

## "Bounded task"

Meaning:

A tightly scoped architectural or implementation objective suitable for a single coherent chat/session.

Clarification:

Chats should generally focus on one bounded task at a time.

## "Prepare check-in"

Meaning:

Generate:

- concise coherent commit/check-in message
- summary of architectural significance
- summary of major changes
- reminder to verify checklist/docs continuity before commit

Clarification:

Check-ins should represent coherent architectural or consolidation progress, not arbitrary file edits.

---

## Workflow validation lifecycle (documentation vocabulary)

Use this sequence when describing workflow-definition checks in prose:

1. **Normalize** — Where owned (for example load/import via `normalizeWorkflowForV1`), reconcile stored shapes and legacy aliases into the current compatible representation. Normalization may record compatibility warnings; it is not the same step as validation.
2. **Validate** — `validateWorkflow(wf)` evaluates a **snapshot** of the workflow definition and returns **warnings only**. It does **not** mutate the workflow object.
3. **Surface warnings** — Callers decide how warnings appear (validation panel, toasts, import summary text). This is **caller-owned warning surfacing**.

Stable phrases:

- **Warning-only** — Validation never blocks save, import, or merge on its own; there is no “hard fail” gate from `validateWorkflow`.
- **Non-mutating** — `validateWorkflow` does not alter the definition; callers hold the authoritative objects they pass in.
- **Caller-owned warning surfacing** — Same validation result may be shown in different UI surfaces depending on context (editor draft vs save vs import).

Avoid implying:

- **Blocking validation** — Not part of the current contract.
- **Enforcement pipeline** — Misleading; describe observe → warn → surface instead.
- **Migration or redesign** — Validation and normalization docs describe **compatibility-preserving** behavior, not future schema migrations.

## Prompt attachment modes (workflow steps)

Stable mode labels (stored semantics):

- **`library_prompt`** — Step uses a Prompt Library asset via `promptId` (optional trimmed `override_prompt_body` may coexist per compatibility rules).
- **`local_override`** — Step uses inline body text (`override_prompt_body`); not library-linked for execution resolution in the same way as `library_prompt`.
- **None / empty** — No runnable library link and no effective local body in the resolved shape; may still be a deliberate compatibility state.

Compatibility fields (intentionally preserved, not redundant “cleanup” targets in docs):

- **`prompt_source`** and **`prompt_source_type`** — Dual fields kept for **compatibility** across older data and import paths. Documentation should **not** imply a schema consolidation sprint or field removal.

## Import/export bundles (documentation vocabulary)

When describing workflow export/import in documentation:

- Behavior is **compatibility-preserving** relative to existing bundle shapes and merge rules.
- Descriptions of bundle shape (`version`, `workflows`, `prompts`, array-vs-object wrappers) are **documentation-only** summaries of current behavior, not a redesign spec.
- **Merge/import semantics** in code are unchanged unless a future sprint explicitly scopes behavior work.
- Avoid wording that suggests contract migrations, replacement formats, or import/export **redesign** while describing current behavior.

## Workflow step identity (workflow definition vocabulary)

- **`step.id`** — **Persisted workflow-step identity** within a workflow’s `steps` array; stable handle for bindings and storage.
- **`canonical_step_id`** — **Semantic or catalog lineage** reference (pattern/catalog), not the primary persisted step identity.
- **Editor DOM rows / run UI** — **Derived or transient projections** of the definition; not a second source of truth alongside `state.workflows`.

## Continuity artefacts (closure, pointers, sprint folders)

- **Closure notes** — Sprint check-in/closure notes under `docs/consolidation/` record scope, outcomes, and explicit non-goals (for example verification-only, docs-only).
- **`current-state.md`** — Rolling snapshot; should point to the active sprint planning or closure doc as the single obvious “where we are” entry.
- **Session handovers** — Should stay fresh when sprint phase changes; not a duplicate of every consolidation detail.
- **Sprint folders** (`docs/development/sprints/...`) — **Portable snapshots** for chat bootstrap; **not** canonical replacements for `current-state`, consolidation docs, or handovers.

