# Sprint 30 baseline test floor

**Recorded:** 2026-06-01  
**Sprint 30 CLOSED** — final floor frozen at close-out ([R30-999](../review-log.md))

---

## Command

```bash
cd c:\xampp\htdocs\prism
node --test tests/*.test.js
```

## Expected result

```
ℹ pass 471
ℹ fail 0
```

**Delta from 30-2b:** +5 tests in `tests/workflow-pel-reasoning.test.js` (30-2c page row sanitiser, workshop no-op, renderer + live Marx).

---

## Sprint 30 final floor (frozen)

| Metric | Value |
|--------|-------|
| **Pass** | **471** |
| **Fail** | **0** |

Sprint 30 programme complete. Post-close merges should not regress PEL/orientation/reasoning/sanitisation tests without review-log entry.

## Sprint 30 gate (historical)

- **No merge** that drops below **471** without documented justification in [`../review-log.md`](../review-log.md).

---

## Focused suites (during development)

```bash
node --test tests/workflow-pel-orientation.test.js
node --test tests/workflow-pel-reasoning.test.js
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
| 30-2 core | 457 | `workflow-pel-reasoning.test.js` + orientation resolver dual-PEC updates |
| 30-2r | 461 | Reasoning field renderer passthrough (kitchen-sink KS-A7 + framing A3) |
| 30-2b | 466 | GAM sanitiser + prompt hardening (`workflow-pel-reasoning.test.js` 30-2b) |
| 30-2c | 471 | Design Page row sanitiser (`workflow-pel-reasoning.test.js` 30-2c) |
