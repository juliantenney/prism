# PRISM Current State

## Strategic Position

PRISM is in a consolidation and stabilisation phase focused on architectural clarity, continuity, and reduction of conceptual drift.

## Strongest Current Capabilities

- Prompt Studio for structured prompt refinement
- Prompt Library for reusable prompt storage and management
- Manual Workflow Builder and step-by-step workflow execution
- Utilities pipeline for HTML-oriented rendering and export
- Domain-pack constrained workflow context loading

## Current Consolidation Priorities

- preserve runtime and manifest path stability
- keep architecture and filesystem structure coherent
- maintain explicit workflow semantics and artefact contracts
- improve continuity documentation and check-in discipline
- archive legacy content rather than deleting

## Focus and Scope Notes

- workflow generation is not the immediate focus
- domain-pack rationalisation is planned later, not during current stabilisation work
- tidy-up/governance phase is complete
- continuity workflow is now operational
- shared operational vocabulary is established
- recent documentation cleanup and archive moves are complete
- conservative artefacts naming policy is retained for stability
- consolidation sprint structure now exists under `docs/consolidation/`
- sprint transition portability now uses `docs/development/sprints/YYYY-MM-DD-sprint-name/`
- backlog system now exists under `docs/backlog/`
- current focus remains manual system stabilisation before workflow generation redesign
- Prompt Studio consolidation model is now explicit:
  - brief state = user-authored refinement inputs/parameters
  - runtime refinement session state = transient conversational refinement lifecycle
  - prompt asset state = durable Prompt Library entity
- workflow prompt context is treated as a secondary/future consideration in Sprint 01, not a driver of current Prompt Studio design

## Next Active Focus

- Sprint 04 - Workflow Definition Consolidation stabilization and check-in
- maintain bounded behavior-preserving posture while closing Sprint 04 continuity and verification notes
- Sprint 05 planning artifact prepared: `docs/consolidation/sprint-05-manual-verification-planning.md`
- next step after Sprint 04 check-in: execute manual browser verification before any further implementation

## Sprint Status Notes

- Sprint 01 - Prompt Studio Consolidation completed its first pass.
- Sprint 01 outcomes: clearer Prompt Studio semantics/state boundaries, improved refinement lifecycle and payload/display clarity, and narrow accessibility/technical-debt cleanup.
- Sprint 02 - Prompt Library Consolidation passes 1-3 completed:
  - lifecycle contract comments and helper extraction landed in `app.js` without schema/runtime redesign
  - Prompt Library lifecycle flows (new/save/delete/duplicate/use/copy/export/import) were verified stable
  - canonical durable state remains `state.prompts` + `state.selectedPromptId`; filters/list/detail/version views remain derived projections
  - preserved policy: `usageCount` increments only on Use as template; duplicate keeps historical versions and adds duplicate/save snapshots; metadata ownership remains split between handlers and `Library` persistence
- Sprint 02 Prompt Library Consolidation is completed and committed.
- Sprint 03 Workflow Runtime Consolidation (review + passes 1-2) completed:
  - clarified workflow definition vs runtime navigation semantics
  - documented and stabilized run-mode lifecycle/reset inspectability without behavior redesign
  - clarified Prompt Studio workflow hydration/save boundary semantics for step outcomes
  - improved internal input-binding chip inspectability with source-step identity display only
  - manual smoke checks confirmed runtime compatibility preserved
- Sprint 03 intentionally deferred:
  - run-mode redesign/state-machine work
  - schema/storage restructuring
  - workflow generation/domain-pack redesign
  - app.js module-boundary restructuring
- Sprint 03 Workflow Runtime Consolidation is completed, continuity-updated, smoke-checked, and stabilised for check-in.
- Sprint 04 now targets authored workflow definition consolidation:
  - workflow definition schema semantics and canonical step ownership
  - prompt attachment/reference semantics
  - normalization and validation ownership boundaries
  - import/export and DOM <-> persisted definition synchronization inspectability
- Sprint 04 passes completed (bounded, behavior-preserving):
  - Pass 1: prompt attachment canonicalization helper extraction
  - Pass 2: UI read-path consolidation for prompt attachment state projection
  - Pass 3: canonical step identity clarification (`step.id` vs `canonical_step_id`)
  - Pass 4: validation lifecycle clarification (normalize->validate usage, warning-only/non-mutating contract, caller-owned surfacing)
- Sprint 04 stabilization notes:
  - no schema/runtime/import/export redesign was introduced
  - validation warnings remain non-blocking by design
  - smoke verification remains lightweight/manual in this environment (no browser automation harness in repo)
- Deferred from Sprint 01 by design:
  - major `app.js` size reduction (requires later module-boundary sprint)
  - generated workflow integration decisions
  - broader UI polish

## Active Focus Areas

- Prompt Studio
- Prompt Library
- Manual Workflow Builder
- workflow semantics
- artefact contracts

