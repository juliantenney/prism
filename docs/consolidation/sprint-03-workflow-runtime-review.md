# Sprint 03 - Workflow Runtime Consolidation Review

## Review Scope

Architecture-first, read-only review of workflow runtime semantics/state/lifecycle before implementation edits.

Reviewed files:

- `app.js`
- `index.html`
- `style.css`
- `workflowGenerationContext.js` (only for workflow prompt hydration boundary context)
- `docs/consolidation/sprint-03-workflow-runtime.md`
- `docs/development/current-state.md`
- `docs/development/development-protocol.md`
- `docs/development/shared-vocabulary.md`

No implementation, schema, storage, or UI behavior changes were made in this pass.

## Continuity Status (Passes 1-2)

- Pass 1 completed: runtime lifecycle comment clarity + transient run navigation reset helper + workflow-step save outcome comments
- Pass 2 completed: internal input-binding chip display includes source-step identity for inspectability only
- runtime compatibility preserved by manual smoke checks

## Current Runtime Lifecycle Model

Workflow runtime behavior currently operates as a UI-driven runner layered on top of durable workflow definitions:

- durable workflow definition state is stored in `state.workflows` and persisted via `WORKFLOW_STORAGE_KEY` localStorage serialization
- workflow detail panel renders editable step definitions; run mode projects that same workflow into a single-step-at-a-time execution view
- transient run navigation state is tracked in:
  - `state.currentWorkflowRunIndex`
  - `state.workflowRunVisibleStepId`
  - `state.workflowRunCopiedStepId`
- run mode is currently represented by UI state (`workflowDetail.run-mode` class + active run tab button) rather than a dedicated runtime enum in state
- step instructions are generated at copy-time from current DOM + selected workflow step config (including prompt resolution and input bindings)

## Definition vs Runtime Ownership

| Concern | Canonical owner | Derived/runtime projection |
|---|---|---|
| Workflow entities | `state.workflows` | `renderWorkflowList()` item projection |
| Selected workflow | `state.selectedWorkflowId` | selected list styling + detail panel contents |
| Step definitions (`title`, `roleLabel`, `inputKind`, `outputName`, `notes`, prompt source fields, `inputBindings`) | workflow object in `state.workflows` after save | editable step DOM rows in `workflowSteps` |
| Prompt source semantics (`prompt_source_type`, `promptId`, `override_prompt_body`) | saved workflow step data | prompt dropdown labels + run-time prompt resolution |
| Run-mode flag | UI classes/active tab state (`workflowDetail.run-mode`, mode buttons) | field readOnly/disabled state, hidden edit controls, run controls visibility |
| Run navigation index | `state.currentWorkflowRunIndex` | visible single step + prev/next enablement + "Step X of Y" |
| Visible/copy status | `state.workflowRunVisibleStepId`, `state.workflowRunCopiedStepId` | copy button label state (`Copy` vs `✓ Copied`) |
| Artefact inputs/outputs | workflow fields + step `outputName` + step `inputBindings` | input binding dropdown options/chips, instruction text, validation warnings |

## Run-Mode Lifecycle (enter, exit, reset, render)

- **Enter run mode**
  - `workflowModeRunBtn` click -> `setWorkflowMode("run")`
  - sets run button active, adds `run-mode` class, makes fields read-only/disabled, disables move/remove/add-step controls
  - resets run navigation (`currentWorkflowRunIndex = 0`, clears visible/copied step ids)
  - calls `updateWorkflowRunView()`

- **Exit run mode**
  - `workflowModeEditBtn` click -> `setWorkflowMode("edit")`
  - removes `run-mode` class, re-enables editable controls, restores full step list visibility via `updateWorkflowRunView()`

- **Runtime render**
  - `updateWorkflowRunView()` is the central render function for run navigation:
    - if not in run mode (or no steps): show all steps, clear runtime status/copy state, disable prev/next
    - if in run mode: clamp index, show only current step, update status text and prev/next disabled state

- **Reset points**
  - selecting/populating a workflow (`populateWorkflowDetail`) resets `currentWorkflowRunIndex` to `0` and updates run view
  - entering run mode always resets index and visible/copy markers
  - non-run rendering path clears visible/copied runtime step markers

## Step Navigation Transition Map

- **Workflow selection**
  - `handleWorkflowListClick()` -> `selectWorkflow(id)` -> `populateWorkflowDetail(wf)`
  - transition effects:
    - `state.selectedWorkflowId` set
    - step DOM rebuilt from selected workflow definition
    - `state.currentWorkflowRunIndex = 0`
    - run view refreshed

- **Run navigation**
  - `workflowPrevStepBtn` click: decrement index -> `updateWorkflowRunView()` (clamped)
  - `workflowNextStepBtn` click: increment index -> `updateWorkflowRunView()` (clamped)
  - visible step id changes trigger reset of copied-state marker

- **Edit-time step reordering**
  - move up/down mutates DOM order, then `renumberWorkflowSteps()` and input-source refresh
  - durable step order changes only after `handleSaveWorkflow()` gathers DOM into workflow definition

- **Delete workflow**
  - removes selected workflow from `state.workflows`
  - clears selection/detail view and list projection

## Artefact Visibility and Input/Output Lifecycle Map

- **Declared workflow artefacts**
  - workflow-level inputs captured from `workflowArtefacts` text and parsed to `workflowInputs`
  - workflow-level desired outputs captured from `workflowOutputs` and parsed to `workflowOutputs`

- **Step outputs**
  - each step has explicit `outputName`
  - only named outputs are eligible for internal downstream binding options
  - output naming is surfaced in copy instructions ("STEP N OUTPUT" restatement guidance)

- **Step input bindings**
  - stored per-step as normalized `inputBindings` array (`internal`/`external`)
  - editable via "Input artefacts" controls in step UI
  - internal options are derived from previous steps only (`sourceStepId + artifactName`)
  - invalid internal bindings are pruned when upstream availability changes

- **Rendered/derived visibility**
  - run mode hides edit-heavy fields and shows step-focused execution controls
  - step input bindings are rendered as chips; internal bindings include source-step identity (`Step N: artefactName`) for inspectability
  - validation warnings derive from workflow semantics checks (missing prompt, invalid dependencies, missing source outputs)

- **Migration normalization**
  - `normalizeWorkflowForV1()` maps legacy `depends_on` into `inputBindings` and normalizes prompt-source fields

## Prompt Studio Workflow-Prompt Hydration Boundary (Runtime-Relevant)

- opening "New prompt" on a workflow step creates `state.promptFactoryWorkflowContext` with workflow + step semantic context
- Prompt Studio enters workflow prompt mode UI:
  - managed brief fields are disabled for workflow-owned parameters
  - action labels shift to workflow semantics ("Refine prompt", "Save to step")
- saving from Prompt Studio applies one of two runtime-affecting step outcomes:
  - **workflow step mode**: writes `override_prompt_body`, sets `prompt_source_type` to `local_override`, clears `promptId`
  - **link saved library prompt**: saves asset, then sets step `promptId` and `prompt_source_type` to `library_prompt`, clears override
- workflow prompt context is cleared explicitly (for example via `clearWorkflowPromptContext()` / new brief), not by generic tab switching

### Continuity Note: Context Clear Policy

- `promptFactoryWorkflowContext` is treated as explicit-action runtime context
- clear actions are explicit workflow/prompt actions (for example New brief / explicit clear paths)
- generic tab switching does not clear this context by default

## Ambiguities / Deferred Policy Questions

- run-mode source-of-truth is split across DOM classes/button state and runtime index variables (no explicit `workflowRunMode` state token)
- run navigation index is global runtime state, not keyed per workflow id
- hydration boundary logic and save routing share `handleSaveRefinedToLibrary()`, mixing two concerns (library persistence vs step prompt assignment)
- prompt context lifecycle is explicit but not centralized; context persistence across tab switches may be surprising without clear policy text

## Suggested Narrow Follow-up Targets (Not Yet Implemented)

1. Keep run-mode source-of-truth as documented (UI class/buttons + transient markers); defer enum/state-machine redesign.
2. Keep global run index semantics as-is for now; document per-workflow indexing as deferred policy.
3. Keep hydration/save routing in shared handler as-is; defer structural split unless a dedicated refactor sprint is approved.
