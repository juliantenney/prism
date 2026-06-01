# Sprint 30 baseline test floor

**Recorded:** 2026-05-21  
**Before PEC implementation (30-0)**

---

## Command

```bash
cd c:\xampp\htdocs\prism
node --test tests/*.test.js
```

## Expected result

```
ℹ pass 430
ℹ fail 0
```

---

## Sprint 30 gate

- **No merge** that drops below **430** without documented justification in [`../review-log.md`](../review-log.md).
- After 30-1, update this file with new floor if tests added.

---

## Focused suites (during development)

```bash
node --test tests/workflow-self-directed-activity-framing-adoption.test.js
node --test tests/workflow-brief-learner-resource-defaults.test.js
node --test tests/workflow-self-directed-learner-page-formatting.test.js
node --test tests/utility-renderer-kitchen-sink.test.js
node --test tests/workflow-ld-cognition-contracts.test.js
```
