# Sprint 11 — Pass 2 implementation note (PE channels)

## Scope

- In scope: PE-normalise (`normalizeWorkflowForV1`), PE-export (`buildWorkflowBundle`), PE-import (`importWorkflowsAndPrompts`), PE-conflict (`newerWins` via `updatedAt`).
- Out of scope preserved: schema/storage version changes, semantic renames, WGC/domain-pack, renderer/sequencing, broad refactor.

## Baseline commit

- `966591f71cfbe06b6ae5826cd94fe7c843af0d4d`

## Channels covered

- PE-normalise: `normalizeWorkflowForV1`
- PE-export: `buildWorkflowBundle`
- PE-import: `importWorkflowsAndPrompts`
- PE-conflict: `newerWins` path via `updatedAt` in `importWorkflowsAndPrompts`

## Fixtures added

- `tests/fixtures/workflow-persistence-pass2/pe-normalise-minimal.json`
- `tests/fixtures/workflow-persistence-pass2/pe-export-workflow-only.json`
- `tests/fixtures/workflow-persistence-pass2/pe-import-workflow-array-object.json`
- `tests/fixtures/workflow-persistence-pass2/pe-conflict-newerWins.json`

## Files changed

- Modified: `app.js` (test-only API exposure for existing PE functions/state access; no production logic change).
- Added: `tests/workflow-persistence-pass2.test.js`

## Unavoidable seams

- Added test-only `window.__PRISM_TEST_API` exposures for:
  - `normalizeWorkflowForV1`
  - `buildWorkflowBundle`
  - `importWorkflowsAndPrompts`
  - `setWorkflowsForTest`
  - `getWorkflowsForTest`
  - `setPromptsForTest`

## Deferred edge cases

- `exportAllData` runtime path deferred in this pass to avoid broader browser/download seams.
- Missing/invalid `updatedAt` conflict behavior deferred (ambiguous/unstable edge semantics not changed in this pass).

## Verification

- Test command intended: `node --test tests/workflow-persistence-pass2.test.js`
- Local environment note: `node` is unavailable in current shell (`CommandNotFoundException`), so execution must be run on a Node-enabled machine.
