# Sprint 32 baseline test floor

**Recorded:** 2026-06-02  
**Status:** **Inherited** — Sprint 32 **NOT STARTED** (no programme tests added yet)

---

## Inherited baseline (Sprint 31 close)

Sprint 32 begins with the floor frozen at Sprint 31 programme close ([R31-999](../2026-06-01-sprint-31-page-rhetoric-renderer-experience/review-log.md)).

| Metric | Value |
|--------|-------|
| **Pass** | **502** |
| **Fail** | **0** |

---

## Command

```bash
cd c:\xampp\htdocs\prism
node --test tests/*.test.js
```

Expected until Sprint 32 implementation adds tests:

```
ℹ pass 502
ℹ fail 0
```

---

## Sprint 32 gate (when implementation begins)

- **No merge** that drops below **502** without documented justification in [`review-log.md`](review-log.md).
- New Sprint 32 tests must be **justified per slice charter** — no speculative test scaffolding during planning phase.
- Renderer regression tests from Sprint 31 remain authoritative for R-layer behaviour.

---

## Historical progression (reference)

| Programme | Floor |
|-----------|-------|
| Sprint 30 close | 471 |
| Sprint 31 close | **502** |

See [`../2026-06-01-sprint-31-page-rhetoric-renderer-experience/baseline-test-floor.md`](../2026-06-01-sprint-31-page-rhetoric-renderer-experience/baseline-test-floor.md).
