Context: PRISM v1.0 stabilisation foundations are in place (Sprints 03–06). Sprint 07 begins **workflow generation rationalisation** as a **review-first** sprint.

Task: Execute Sprint 07 per `docs/consolidation/sprint-07-workflow-generation-rationalisation-review.md`.

Priority: **Architecture audit only** until a follow-on sprint explicitly approves implementation.

First step:

- Build the **workflow generation architecture audit table** (pipeline stage, owner/file, domain-specific assumptions, inputs/outputs, relationship to canonical workflow definitions, elicitation/brief dependencies, ambiguity/mess, recommended next action).

Focus areas:

- domain-pack structure and possible future reset/rebuild (document tradeoffs only)
- domain-specific logic audit across `workflowGenerationContext.js`, `app.js` workflow-design regions, and `domains/`
- elicitation lifecycle (draft/refined, save designed workflow)
- workflow brief form vs generated step needs
- generated workflow quality vs Sprint 04 canonical definition contracts
- **LD concern:** capture more design-relevant information up front where appropriate; avoid over-reliance on long chat or buried step-only configuration—**analyse current state**, do not implement new fields unless a later sprint scopes it

Constraints:

- **no implementation** in Sprint 07 unless user explicitly rescopes
- no generator rewrite, domain-pack rewrite, execution-engine redesign, module restructuring
- **no domain-specific logic** in general app/runtime code paths (flag violations in audit; do not add new ones)

Success criteria:

- audit table complete for major pipeline stages
- review log / recommendations separated from implementation backlog
- no unscoped code changes

Starter pack:

- `docs/development/sprints/2026-05-12-sprint-07-workflow-generation-rationalisation-review/` including `context-files/` physical copies
