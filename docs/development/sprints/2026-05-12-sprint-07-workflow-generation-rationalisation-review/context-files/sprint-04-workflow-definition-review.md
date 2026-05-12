# Sprint 04 - Workflow Definition Consolidation Review (Prep Pass)

Terminology in this note aligns with `docs/development/shared-vocabulary.md` (validation lifecycle, prompt attachment modes, step identity, import/export narrative).

## Canonical Workflow Definition Owner

- canonical durable owner in app runtime: `state.workflows` (with selected pointer `state.selectedWorkflowId`)
- persisted owner: localStorage via `saveWorkflows()` / `loadWorkflows()`
- canonical step identity owner: `step.id`
- semantic/catalog lineage field: `step.canonical_step_id` (not the primary persisted step identity)

## Derived / Runtime-Only Fields and Projections

- DOM step rows (`workflowSteps` children + `data-*` attributes) are derived editor projections of selected workflow definition
- run-navigation fields are transient runtime state, not workflow-definition schema:
  - `state.currentWorkflowRunIndex`
  - `state.workflowRunVisibleStepId`
  - `state.workflowRunCopiedStepId`
- validation panel content is derived warning projection from `validateWorkflow()` output

## Normalization Ownership Path

- load/import normalization owner: `normalizeWorkflowForV1(rawWorkflow, warningTarget)`
- ownership responsibilities:
  - normalize prompt-source fields (`prompt_source`, `prompt_source_type`, `promptId`, `override_prompt_body`)
  - normalize legacy aliases (`promptSourceType`, `overridePromptBody`, etc.)
  - reconcile legacy `depends_on` into explicit `inputBindings`
  - normalize workflow-level arrays/output spec (`workflowInputs`, `workflowOutputs`, `workflowOutputSpec`)
- gather/save path ownership:
  - `gatherWorkflowDetailFormData()` captures DOM -> workflow-definition draft
  - `handleSaveWorkflow()` canonicalizes prompt-source combinations before persistence

## Validation Ownership Path

- owner: `validateWorkflow(wf)`
- scope:
  - prompt resolvability checks (`resolveStepPromptText`)
  - internal binding source existence/order checks
  - internal binding source output-name availability checks
- contract (**warning-only**, **non-mutating**):
  - returns warnings only — **not** blocking validation and **not** an enforcement gate on save or import
  - does not mutate workflow-definition state
- surfacing: **caller-owned warning surfacing** (validation panel, toasts, import summary text). Same snapshot may be evaluated in multiple contexts.

## Ambiguous Prompt Attachment Combinations (Intentionally Preserved)

- dual compatibility fields remain (`prompt_source` and `prompt_source_type`) — **not** redundant schema debt to “clean up” in documentation; preserved for older data and import paths
- `library_prompt` can coexist with trimmed `override_prompt_body` text in stored shape
- `prompt_source_type` fallback derives from `override_prompt_body` or `promptId` when source field is absent/none
- `prompt_instance` / `prompt_bindings` remain present in persisted records even where currently low-usage

## Safe Next Implementation Targets (Not Implemented)

1. Add a tiny helper documenting/centralizing prompt attachment canonicalization used by both save and normalization paths (behavior-preserving only).
2. Add explicit inline comments near `step.id` vs `canonical_step_id` usage sites in gather/save/import flows to reduce identity ambiguity.
3. Add a bounded comments-only note in import/export handlers clarifying bundle compatibility contract (`version`, `workflows`, `prompts`) and merge order.
4. Add tests/checklist notes (docs-only) for ambiguous prompt attachment combinations before any behavior edits.

---

# Sprint 04 - Workflow Definition Consolidation Review (Pass 4: Validation Lifecycle Clarification)

## `validateWorkflow()` Callers

- `populateWorkflowDetail(wf)`
  - usage: `renderWorkflowValidationWarnings(validateWorkflow(wf))`
  - purpose: surface warnings when a persisted/selected workflow is rendered in editor.
- `handleSaveWorkflow()`
  - usage: `var warnings = validateWorkflow(data);`
  - purpose: evaluate the workflow-definition snapshot that is about to be persisted.
- `importWorkflowsAndPrompts(workflows, prompts, options)`
  - usage: `var validationWarnings = validateWorkflow(normalizedWorkflow);`
  - purpose: evaluate imported workflow after `normalizeWorkflowForV1(...)`, then aggregate warnings for post-import toast/panel messaging.
- `els.workflowDetail` input handler
  - usage: `renderWorkflowValidationWarnings(validateWorkflow(draft))`
  - purpose: real-time warning projection over gathered DOM draft state.

## Current Validation Ownership Boundary

- `validateWorkflow(wf)` is a pure **warning-only** evaluator over a workflow-definition snapshot (**non-mutating**).
- It checks only:
  - step prompt resolvability (`resolveStepPromptText`)
  - internal-binding source-step existence
  - internal-binding source-step ordering (no forward/self dependency)
  - internal-binding source-step output-name availability
- It returns deduplicated warnings; it does not mutate the workflow.
- Lifecycle currently observed (**normalize → validate → surface warnings**):
  - **Normalize first, validate second** on import/load-oriented flows (`normalizeWorkflowForV1` before `validateWorkflow`)
  - save/edit/render flows validate snapshot shapes already aligned by gather/save/load paths (normalization ownership differs by path; validation remains warning-only everywhere)
  - **Caller-owned warning surfacing** (`renderWorkflowValidationWarnings`, toasts, import summary text)

## Mixed Concerns Currently Present (Intentionally Preserved)

- **Definition coherence**
  - binding references exist and are topologically valid (previous-step only).
- **Runtime readiness**
  - runnable prompt resolution and source output availability are evaluated as warnings.
- **UI completeness**
  - missing prompt/output conditions are surfaced for editor guidance; **not** enforced via blocking validation.
- **Compatibility warnings**
  - import path combines normalization warnings and validation warnings; both remain non-blocking.

These concerns are intentionally co-located in warning-only validation/surfacing for Sprint 04 to preserve behavior and avoid introducing blocking gates.

## Recommendation

- For Sprint 04 scope, comments/docs are sufficient; no implementation cleanup is required now.
- Rationale:
  - boundary is already stable and non-mutating;
  - caller-owned warning surfacing is explicit and behavior-compatible;
  - separating concern classes into distinct validators would be structural cleanup, not required for current consolidation goals.
- Optional post-S04 debt item (deferred): extract warning categories (definition/runtime/UI/compatibility) behind the same warning-only contract, without changing messages or blocking semantics.
