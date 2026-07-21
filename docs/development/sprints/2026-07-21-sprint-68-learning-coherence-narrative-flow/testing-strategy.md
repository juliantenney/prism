# Sprint 68 — Testing Strategy

## Principles

- Preserve Sprint 67 regression coverage as the primary safety net.
- Add coherence-specific tests only when behaviour changes are agreed.
- Prefer structural HTML assertions over brittle full-document snapshots.

## Baseline (always run)

```bash
node --test tests/learner-renderer-vnext*.test.js
node scripts/build-learner-renderer-vnext-browser.js   # if lib changed
node scripts/write-heteroscedasticity-vnext-va-export.js  # refresh artefact
```

## Coherence test types (planned)

| Type | Purpose |
| ---- | ------- |
| Field trace tests | Assert transition fields appear in expected DOM region |
| Golden fragment tests | Activity boundary HTML structure |
| Multi-fixture spot checks | Bridge field presence across lessons |
| Manual narrative review | Human read-through of export |

## Not in scope

- Visual pixel regression
- Navigation sticky behaviour re-test (owned by Sprint 67 unless touched)

## Setup task

No new tests added during planning setup.
