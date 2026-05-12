# Sprint 03 - Workflow Runtime Consolidation

## Purpose

Consolidate workflow runtime semantics so workflow definition, execution state, and artefact visibility remain inspectable and stable.

## Current Position

Sprint 01 clarified Prompt Studio runtime/refinement semantics. Sprint 02 clarified Prompt Library durable prompt asset lifecycle semantics. Sprint 03 continues consolidation-before-expansion with an architecture-first workflow runtime review before implementation edits.

## Goals

- clarify workflow definition vs workflow execution semantics
- clarify workflow run-mode state and step navigation/runtime state
- clarify workflow step output/input lifecycle and artefact visibility
- improve inspectability of workflow runtime handlers and state transitions
- clarify Prompt Studio workflow-prompt hydration boundary only where it affects workflow runtime semantics

## Non-Goals

- no workflow-generation redesign
- no domain-pack redesign
- no app.js module restructuring
- no Prompt Studio redesign
- no Prompt Library redesign
- no speculative architecture
- no execution engine / automation / agent redesign

## Architectural Questions

- which workflow state is canonical definition state vs transient execution/runtime state?
- where are step navigation and run-mode transitions set, reset, and consumed?
- how are step outputs and artefacts produced, stored, and surfaced in runtime UI?
- where does Prompt Studio hydration intersect workflow runtime semantics, and where should that boundary remain explicit?

## Technical Consolidation Goals

- improve readability/inspectability of workflow runtime lifecycle paths
- reduce semantic ambiguity in run-mode and step-transition checks
- keep workflow runtime behavior stable while clarifying lifecycle ownership
- document any ambiguous runtime policy that should be deferred rather than redesigned

## Risks

- regressions in workflow runtime state transitions
- accidental drift between displayed runtime state and persisted workflow definition
- over-scoping into workflow generation or domain-pack redesign

## Success Criteria

- workflow runtime lifecycle semantics are easier to inspect and reason about
- definition/runtime boundaries are explicit in comments and helper naming
- step navigation and artefact visibility behavior remains runtime-compatible
- consolidation remains bounded to workflow runtime concerns only

## Status (Current)

- Sprint 03 architecture-first runtime review completed and documented in `sprint-03-workflow-runtime-review.md`
- Pass 1 completed:
  - runtime lifecycle comment clarity around run mode/navigation ownership
  - transient run-navigation reset helper usage at existing reset points only
  - explicit workflow-step save outcome comments (`local_override` vs `library_prompt` link)
- Pass 2 completed:
  - internal input-binding chips now include source-step identity for inspectability-only display
- manual smoke checks confirmed runtime compatibility was preserved

## Preserved By Design

- no schema/storage changes
- no workflow-generation redesign
- no domain-pack redesign
- no Prompt Studio or Prompt Library redesign
- no app.js module restructuring
- no run-mode semantic redesign

## Deferred Ambiguities (Intentional)

- run-mode source-of-truth remains UI-state based (class/buttons + transient markers), not a new runtime enum/state machine
- run navigation index remains global runtime state (not per-workflow keyed)
- hydration/save routing remains in existing shared handler paths for compatibility and boundedness
