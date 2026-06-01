# Sprint 30 baseline test floor

**Recorded:** 2026-06-01  
**After 30-1c GAM learner voice guard + orientation evaluator**

---

## Command

```bash
cd c:\xampp\htdocs\prism
node --test tests/*.test.js
```

## Expected result

```
ℹ pass 445
ℹ fail 0
```

**Delta from 30-1b:** +5 tests in `workflow-pel-orientation.test.js` (30-1c GAM voice guard + orientation evaluator).

---

## Sprint 30 gate

- **No merge** that drops below **445** without documented justification in [`../review-log.md`](../review-log.md).

---

## Focused suites (during development)

```bash
node --test tests/workflow-pel-orientation.test.js
node --test tests/workflow-self-directed-activity-framing-adoption.test.js
node --test tests/workflow-brief-learner-resource-defaults.test.js
node --test tests/workflow-self-directed-learner-page-formatting.test.js
node --test tests/utility-renderer-kitchen-sink.test.js
node --test tests/utility-self-directed-activity-framing.test.js
node --test tests/utility-marx-page-render.test.js
node --test tests/workflow-ld-cognition-contracts.test.js
```

---

## Historical

| Phase | Floor | Notes |
|-------|-------|-------|
| 30-0 (pre-PEC) | 430 | Before any PEC code |
| 30-1 | 436 | `workflow-pel-orientation.test.js` |
| 30-1b | 440 | Orientation field renderer passthrough |
| 30-1c | 445 | GAM learner voice guard + `evaluatePelOrientationContractSatisfaction` |
