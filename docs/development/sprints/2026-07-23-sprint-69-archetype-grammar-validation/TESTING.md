# Sprint 69 Testing Strategy

## Mandatory suites

```bash
node --test tests/episode-plan-v1-validation.test.js
node --test tests/workflow-ld-episode-plan-step.test.js
node --test tests/page-vnext-assemble.test.js
node --test tests/educational-psychology-episode-plan-contract.test.js
node --test tests/learner-renderer-vnext*.test.js
node scripts/certify-learner-renderer-vnext.js
```

## Validation gates

1. Producer boundary catches illegal beat vocabulary.
2. Canonical EP survives assembly unchanged.
3. Renderer produces zero unknown-archetype regressions on authoritative corpus.
4. Node/browser parity remains green.
5. Certification remains PASS/CERTIFIED.

## Metrics to track

- test pass/fail counts
- diagnostic counts (`UNKNOWN_ARCHETYPE_VARIANT`, assignment errors)
- certification coverage totals
