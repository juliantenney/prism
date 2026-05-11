# PRISM Chat Bootstrap Template

## Current State

PRISM completed governance/continuity formalisation, documentation consolidation, shared operational vocabulary setup, sprint structuring, and backlog setup. Operational continuity is now stable and explicit.

## Current Priorities

- Sprint 01 - Prompt Studio Consolidation

## Current Constraints

- consolidation phase (stabilisation before expansion)
- avoid uncontrolled feature expansion
- preserve runtime compatibility
- preserve domain-pack filename stability
- no workflow-generation redesign in this sprint
- no domain-pack redesign in this sprint

## Relevant Files

- `docs/consolidation/sprint-01-prompt-studio.md`
- `docs/development/current-state.md`
- `docs/development/development-protocol.md`
- `docs/development/shared-vocabulary.md`
- `docs/development/checkin-checklist.md`
- `docs/architecture/decisions.md`
- `app.js`
- `index.html`
- `style.css`

## Recent Decisions

- consolidation-before-expansion strategy formalised
- continuity vocabulary and bounded sprint/backlog model formalised
- conservative artefacts naming policy retained
- commit/check-in continuity expectations formalised

## Immediate Task

Run an architecture-first consolidation pass on Prompt Studio to clarify prompt asset semantics, parameterisation semantics, and core state boundaries before narrow implementation edits.

## Suggested Focus

Focus on Prompt Studio semantics/state clarity and bounded consolidation changes only.

Do not drift into:

- workflow-generation redesign
- domain-pack redesign
- speculative future architecture
- unrelated renderer/utilities work

## Suggested Opening Prompt

Context: PRISM is in consolidation mode with continuity/docs/sprint/backlog structure now established.  
Task: Sprint 01 - Prompt Studio Consolidation (bounded).  
Scope: Prompt Studio semantics, parameterisation clarity, prompt/runtime boundaries, state complexity in `app.js` + related UI markup.  
Non-goals: workflow-generation redesign, domain-pack redesign, speculative architecture.  
Success criteria: clearer Prompt Studio semantics and state handling with narrow verified changes and updated continuity docs.

