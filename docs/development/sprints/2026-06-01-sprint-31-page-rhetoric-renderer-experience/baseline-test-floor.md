# Sprint 31 baseline test floor

**Recorded:** 2026-06-01  
**Status:** **CLOSED** (R31-999) — final floor **502** pass / **0** fail

---

## Inherited baseline (Sprint 30)

Sprint 31 begins with the floor frozen at Sprint 30 programme close ([R30-999](../2026-05-21-sprint-30-pedagogic-enrichment-layer/review-log.md)).

| Metric | Value |
|--------|-------|
| **Pass** | **471** |
| **Fail** | **0** |

---

## Command

```bash
cd c:\xampp\htdocs\prism
node --test tests/*.test.js
```

## Current floor (after slice 31-6 — programme close)

| Metric | Value |
|--------|-------|
| **Pass** | **502** |
| **Fail** | **0** |

```
ℹ pass 502
ℹ fail 0
```

---

## Sprint 31 gate

- **No merge** that drops below **502** without documented justification in [`review-log.md`](review-log.md).
- Progression: 471 → 475 (31-1) → 481 (31-2) → 485 (31-3) → 490 (31-4) → 497 (31-5) → **502** (31-6).

---

## Focused suites (renderer-heavy)

```bash
node --test tests/utility-renderer-kitchen-sink.test.js
node --test tests/utility-page-render.test.js
node --test tests/utility-self-directed-activity-framing.test.js
node --test tests/utility-renderer-cognition-fields.test.js
node --test tests/utility-marx-page-render.test.js
node --test tests/utility-ld-rna-assessment-page-render.test.js
node --test tests/utility-ld-assessment-visibility-render.test.js
node --test tests/utility-ld-inflation-page-render.test.js
```

---

## Historical (Sprint 30 close)

See [`../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/baseline-test-floor.md`](../2026-05-21-sprint-30-pedagogic-enrichment-layer/context-files/baseline-test-floor.md) for full progression 430 → 471.
