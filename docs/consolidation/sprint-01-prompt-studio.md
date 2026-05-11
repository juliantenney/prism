# Sprint 01 - Prompt Studio Consolidation

## Purpose

Consolidate Prompt Studio into a clearer, lower-complexity authoring/refinement surface with improved semantics and reduced state ambiguity.

## Current Position

Prompt Studio is functional and central to PRISM, but flow/state complexity has accumulated across prompt definition, refinement, and output shaping.

## Goals

- streamline prompt creation/refinement flow
- clarify prompt asset semantics
- improve parameterisation clarity
- reduce UI/runtime complexity
- simplify state handling where possible

## Non-Goals

- no workflow-generation redesign
- no domain-pack redesign
- no renderer redesign

## Architectural Questions

- What is the minimum durable prompt asset model used by Prompt Studio and Prompt Library?
- Which state is canonical vs derived in refinement flow?
- Where can implicit behavior be replaced with explicit inspectable state?

## UX Goals

- inspectability
- clarity
- simplification
- reduced hidden state
- better workflow visibility

## Technical Consolidation Goals

- reduce duplicated logic in prompt flow handlers
- streamline state handling and transitions
- improve naming consistency for prompt/refinement data
- isolate responsibilities between UI wiring and prompt semantics
- remove obsolete code paths

## Risks

- regressions in existing refinement flow
- accidental coupling changes with Prompt Library behavior
- over-consolidation that reduces current usability

## Success Criteria

- Prompt Studio flow is easier to follow and reason about
- state transitions are explicit and inspectable
- no runtime breakages in core prompt creation/refinement usage
- no unintended scope expansion into unrelated systems

## Likely Relevant Files

- `app.js`
- `index.html`
- `style.css`
- `docs/development/current-state.md`
- `docs/development/development-protocol.md`

