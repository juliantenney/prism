# Sprint 03 - Manual Workflow Builder Consolidation

## Purpose

Consolidate the Manual Workflow Builder as a semantically explicit, inspectable workflow composition system with clearer step/artefact behavior.

## Current Position

Manual workflow composition is a core strength of PRISM and likely the most architecturally significant consolidation area due to step semantics, artefact flow, and execution clarity.

## Goals

- clarify workflow step semantics
- improve artefact flow visibility
- improve inspectability
- improve execution clarity
- simplify step configuration
- improve workflow coherence

## Non-Goals

- no automatic workflow-generation redesign yet
- no major domain-pack rewrite yet

## Architectural Questions

- What is the authoritative step contract for manual workflows?
- How should artefact inputs/outputs be represented and inspected consistently?
- Which workflow responsibilities belong to authoring vs execution views?

## UX Goals

- inspectability
- clarity
- simplification
- reduced hidden state
- better workflow visibility

## Technical Consolidation Goals

- reduce duplicated workflow-step handling logic
- streamline state handling across edit/run workflow modes
- improve naming consistency in step and artefact structures
- isolate responsibilities for composition, rendering, and execution
- remove obsolete code paths that obscure manual workflow semantics

## Risks

- regressions in workflow edit/run usability
- accidental breakage of import/export compatibility
- scope drift into generation redesign work

## Success Criteria

- step semantics are explicit and internally consistent
- artefact flow is easier to inspect and reason about
- workflow configuration feels simpler without reducing capability
- runtime stability is preserved while reducing conceptual complexity

## Likely Relevant Files

- `app.js`
- `index.html`
- `workflowGenerationContext.js`
- `docs/workflow/workflow-spec.md`
- `docs/workflow/workflow-authoring.md`
- `docs/development/current-state.md`

