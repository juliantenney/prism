# Sprint 02 - Prompt Library Consolidation

## Purpose

Consolidate Prompt Library semantics and operations so durable prompt assets remain inspectable, predictable, and stable.

## Current Position

Prompt Library supports save/use/edit/delete/copy/export/import and version metadata, but semantic clarity and lifecycle inspectability can be improved through bounded consolidation.

## Goals

- clarify durable prompt asset semantics
- clarify Prompt Library lifecycle operations (save/use/edit/delete/copy/export/import)
- improve Prompt Library state handling inspectability
- clarify Prompt Studio <-> Prompt Library boundaries
- reduce clearly obsolete/duplicated Prompt Library complexity where safe

## Non-Goals

- no workflow-generation redesign
- no domain-pack redesign
- no app.js module restructuring
- no Prompt Studio redesign
- no major schema rewrite
- no speculative architecture

## Architectural Questions

- Which Prompt Library state is canonical vs derived during lifecycle operations?
- Which Prompt Library metadata/fields are user-authored vs system-derived?
- Where do Prompt Studio and Prompt Library responsibilities begin/end in save/use flows?

## UX Goals

- inspectability
- clarity
- simplification
- reduced hidden state

## Technical Consolidation Goals

- improve lifecycle handler readability for save/use/edit/delete/copy/export/import flows
- improve naming consistency for prompt asset operations/state
- isolate Prompt Library persistence boundaries from Prompt Studio runtime boundaries
- remove obsolete or confusing Prompt Library code paths

## Risks

- regressions in save/import/export behavior
- accidental metadata compatibility drift
- over-scoping into Prompt Studio or workflow redesign concerns

## Success Criteria

- Prompt Library lifecycle operations are easier to inspect and reason about
- prompt asset semantics are explicit and consistent across save/use/edit flows
- core library flows remain stable with no runtime regressions
- consolidation remains bounded to Prompt Library concerns only

## Likely Relevant Files

- `app.js`
- `library.js`
- `index.html`
- `style.css`
- `docs/consolidation/sprint-02-prompt-library.md`
- `docs/development/current-state.md`
- `docs/development/development-protocol.md`
- `docs/development/shared-vocabulary.md`

