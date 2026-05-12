Context: PRISM has completed Sprint 03 Workflow Runtime Consolidation.

Task: Begin Sprint 04 Workflow Definition Consolidation (bounded).

Priority: Architecture-first workflow definition consolidation.

First step:

- perform a workflow definition semantic/state/lifecycle review before implementation edits

Review focus:

- workflow definition schema semantics
- canonical step definition ownership
- prompt attachment/reference semantics
- workflow import/export normalization consistency
- workflow validation ownership/boundaries
- legacy normalization compatibility paths
- DOM <-> persisted workflow synchronization boundaries

Suggested targets:

- `normalizeWorkflowForV1()`
- workflow gather/save flows
- workflow import/export bundle semantics
- prompt-source field combinations
- canonical step identifiers
- workflow validation lifecycle

Constraints:

- preserve runtime compatibility
- no workflow-generation redesign
- no execution-engine redesign
- no domain-pack redesign
- no app.js module restructuring
- no schema rewrite/migration framework
- no automation/agent architecture work
- avoid implementation edits until review is complete

Success criteria:

- clearer workflow definition ownership semantics
- explicit canonical vs derived definition boundaries
- inspectable normalization/validation ownership paths
- narrow, verified changes aligned to sprint continuity docs
