# Sprint 11 — Pass 1 implementation note (BL + F-INT)

## Scope

- In scope: `briefLines` / `base` assembly and `extractWorkflowBriefExplicitFactors`.
- Out of scope preserved: semantic changes, prompt-contract edits, domain-pack changes, persistence/import-export, WGC, renderer, sequencing.

## Baseline commit

- `a0d9f422f4ae1fdf4fdd8175847021151e355dde`

## Files modified / added

- Modified: `app.js` (minimal testability seams only; production call path unchanged in intent).
- Added: `tests/workflow-brief-pass1.test.js`
- Added fixtures:
  - `tests/fixtures/workflow-brief-pass1/minimal.json`
  - `tests/fixtures/workflow-brief-pass1/maximal-factor-rich.json`
  - `tests/fixtures/workflow-brief-pass1/cross-domain-ordering.json`

## Unavoidable seams introduced

- Added `buildWorkflowDesignBase(input)` helper and switched existing base object assembly to call it.
- Added `buildWorkflowDesignBrief(base, resolvedState)` helper and switched existing brief assembly to call it.
- Exposed test-only hooks via `window.__PRISM_TEST_API`:
  - `buildWorkflowDesignBase`
  - `buildWorkflowDesignBrief`
  - `extractWorkflowBriefExplicitFactors`

## Deterministic coverage added

- Minimal case
- Maximal factor-rich case
- Cross-domain ordering-sensitive case
- Assertions cover:
  - exact `briefLines` ordering/prefixes
  - stable `base` output
  - extracted factor JSON subset

## Verification

- Test command intended: `node --test tests/workflow-brief-pass1.test.js`
- Local environment note: `node` is unavailable in current shell (`CommandNotFoundException`), so execution must be run on a Node-enabled machine.

## Preservation correction

- Corrected `buildWorkflowDesignBase()` `selectedDomains` assignment to preserve original array reference semantics (`base.selectedDomains === selectedDomains`) by removing `.slice()`.
