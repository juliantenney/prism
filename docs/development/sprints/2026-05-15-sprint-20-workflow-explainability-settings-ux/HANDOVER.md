# Session Handover — Sprint 20 portable pack

**Role:** historical pack for **closed Sprint 20** — use programme closeout for current truth.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/`

**Date:** 2026-05-15 (final — Sprint 20 closed)

**Programme closeout:** [`docs/consolidation/sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md)

---

## Sprint status

| Sprint | Status |
|--------|--------|
| **Sprint 20** | **Closed** — Slices 20-1, 20-2, 20-3; **135 tests** |
| **Sprint 19** | **Closed** — **118 tests** |
| **Sprint 18** | **Closed** — **100 tests** |

**Sprint 21:** **Not started** — see closeout §11 (Pack-defined Step Parameter Controls).

---

## What Sprint 20 delivered

**Thesis:** Generate with minimal questions; then show what was assumed and where to tune — in the UI, not in more chat.

| Slice | Summary |
|-------|---------|
| **20-1** | Settings discoverability — badges, summaries, planning → Settings navigation |
| **20-2** | Provenance — assumptions, step relevance, workflow-level mappings |
| **20-3** | Resolved-brief panel polish — action-first planning, scannable layout |

**Architecture preserved:** no new elicitation; no blocking adequacy changes; no schema or interpreter rewrites; Research/LD packs unchanged in Sprint 20.

---

## Consolidated interaction model (post Sprint 20)

1. Lightweight brief  
2. Essentials gate minimum viability  
3. Workflow synthesis → concrete workflow  
4. Planning adequacy advises (non-blocking)  
5. Provenance explains assumptions  
6. Step relevance shows where assumptions apply  
7. Settings provide tuning surface  

**Limitation discovered:** Settings do not yet expose **all** mapped `stepParams` as first-class controls — **Sprint 21 candidate**.

---

## Verification

```bash
node --test tests/*.test.js
```

**Floor at close:** **135 passed**, 0 failed.

---

## Next programme work (do not scope as Sprint 20)

| Priority | Item |
|----------|------|
| **1** | **Sprint 21 candidate** — Pack-defined Step Parameter Controls ([`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) §11) |
| **2** | Pack parameter audit — right parameters exposed? ([`sprint-20-parameterisation-reflection.md`](../../../consolidation/sprint-20-parameterisation-reflection.md)) |
| **3** | Optional: Settings vs brief diff; Utilities renderer programme |

---

## Slice closeouts

| Slice | Document |
|-------|----------|
| 20-1 | [`sprint-20-slice-1-closeout.md`](../../../consolidation/sprint-20-slice-1-closeout.md) |
| 20-2 | [`sprint-20-slice-2-closeout.md`](../../../consolidation/sprint-20-slice-2-closeout.md) |
| 20-3 | [`sprint-20-slice-3-charter.md`](../../../consolidation/sprint-20-slice-3-charter.md) + [`sprint-20-slice-3-implementation-plan.md`](../../../consolidation/sprint-20-slice-3-implementation-plan.md) |
| Programme | [`sprint-20-closeout.md`](../../../consolidation/sprint-20-closeout.md) |
