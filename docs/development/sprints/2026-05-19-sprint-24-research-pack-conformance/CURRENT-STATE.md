# Sprint 24 — current state

**Date:** 2026-05-19  
**Pack path:** `docs/development/sprints/2026-05-19-sprint-24-research-pack-conformance/`  
**Sprint:** 24 — Research pack semantic conformance review  
**Status:** **Slice 24-1 closed** — audit complete; sprint may close or charter optional follow-ups

**Predecessor:** [Sprint 23 closeout](../2026-05-18-sprint-23-learning-design-pack-rationalisation/sprint-23-closeout.md)

**Entry point:** [`sprint-24-index.md`](sprint-24-index.md)

---

## Sprint framing

Short **evidence-led audit** — not a major architectural programme. Compare Research pack semantics to the Sprint 23 governance model without assuming Learning Design-level remediation.

---

## Slice status

| Slice | Focus | Status |
|-------|--------|--------|
| **24-1** | Research pack semantic conformance audit | **Closed** — [`research-pack-conformance-audit.md`](research-pack-conformance-audit.md) |

---

## Audit verdict (24-1)

**The Research pack already conforms sufficiently** to Sprint 23 governance principles through a deliberate variant:

- **Declarative** `workflowPolicy` (topology, triggers, heuristics)
- **Workflow-level** `mappingRules` (constraints, audience)
- **PF `userOptions`** as the step operational surface (no `stepParameterControls` today)
- **No** cross-step inheritance doctrine (not applicable)

**Minor drift only** — no critical defect; **no pack or runtime changes** in 24-1.

---

## Verification floor

```bash
node --test tests/*.test.js
```

| Metric | Value |
|--------|-------|
| **Tests** | **195 passed**, 0 failed |

---

## Out of scope (unchanged)

| Item | Notes |
|------|--------|
| Renderer / v1 UX | Not Sprint 24 |
| Settings redesign | Not Sprint 24 |
| LD-style metadata rationalisation | Not indicated by audit |
| Runtime inheritance retirement | LD programme (Sprint 23 follow-up) |
| Provenance / workflow graph redesign | Out of scope |
| Cross-pack consistency | Later, if chartered |

---

## References

| Document | Role |
|----------|------|
| [`research-pack-conformance-audit.md`](research-pack-conformance-audit.md) | Slice 24-1 deliverable |
| [`slice-24-1-charter.md`](slice-24-1-charter.md) | Slice charter |
| [`review-log.md`](review-log.md) | Decisions |
| Research pack (live) | `domains/research/domain-research-step-patterns.md` |
