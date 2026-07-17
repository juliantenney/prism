# Sprint 67 — Testing Strategy

## Layers

| Layer | Purpose |
| ----- | ------- |
| Model tests (existing) | Association + empty-beat + architecture exclusions |
| HTML unit / integration | Markers, orders, once-only content |
| Architecture grep tests | Forbidden legacy tokens / activity-ID branches |
| Feature-flag tests | Default legacy; exclusive vNext path |
| Human review | Coherence / readability on primary fixture |

## Primary fixture

`tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json`

## Must-pass assertions

See [acceptance-criteria.md](acceptance-criteria.md).

## Parity approach

Parity means **structural and content-ownership invariants**, not bug-compatible replication of legacy empty Reflect sections or mislabels. Document intentional deltas in the evidence log.

## Regression guard

Keep `tests/learner-renderer-vnext-model.test.js` green whenever rules change; add HTML golden tests rather than weakening model tests.
