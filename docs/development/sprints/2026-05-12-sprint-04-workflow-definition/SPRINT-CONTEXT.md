# Sprint Context

Sprint:

- Sprint 04 - Workflow Definition Consolidation

Status:

- Sprint 03 Workflow Runtime Consolidation is completed and stabilised.
- Sprint 04 is starting.

Scope:

- workflow definition schema semantics
- canonical step definition ownership
- prompt attachment/reference semantics
- workflow import/export normalization consistency
- workflow validation ownership/boundaries
- workflow definition inspectability/readability
- legacy normalization compatibility paths

Review targets:

- `normalizeWorkflowForV1()`
- workflow gather/save flows
- workflow import/export bundle semantics
- prompt-source field combinations
- canonical step identifiers
- workflow validation lifecycle
- DOM <-> persisted workflow synchronization boundaries

Non-goals:

- no workflow-generation redesign
- no execution-engine redesign
- no domain-pack redesign
- no app.js module restructuring
- no schema rewrite/migration framework
- no automation/agent architecture work

Working method:

- architecture-first workflow definition semantic/state/lifecycle review before implementation edits
- bounded consolidation only
- preserve runtime compatibility
- document ambiguities before changing behavior
