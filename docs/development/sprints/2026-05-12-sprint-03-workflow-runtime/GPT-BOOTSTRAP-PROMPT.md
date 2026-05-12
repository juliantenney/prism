Context: PRISM has completed Sprint 02 Prompt Library Consolidation.

Task: Begin Sprint 03 Workflow Runtime Consolidation (bounded).

Priority: Architecture-first workflow runtime consolidation.

First step:

- perform a workflow runtime semantic/state/lifecycle review before implementation edits

Review focus:

- workflow definition state vs workflow runtime execution state
- workflow run-mode and step navigation/runtime state
- artefact visibility and inspectability
- workflow step output/input lifecycle clarity
- Prompt Studio workflow-prompt hydration boundary only where it affects workflow runtime semantics

Constraints:

- preserve runtime compatibility
- no workflow-generation redesign
- no domain-pack redesign
- no app.js module restructuring
- no Prompt Studio redesign
- no Prompt Library redesign
- no speculative architecture
- avoid implementation edits until review is complete

Success criteria:

- clearer workflow runtime lifecycle semantics
- explicit definition vs runtime state boundaries
- inspectable step navigation/artefact visibility lifecycle paths
- narrow, verified changes aligned to sprint continuity docs
