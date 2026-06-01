# Sprint 32 — current state

**Date:** 2026-06-02  
**Pack path:** `docs/development/sprints/2026-06-02-sprint-32-pedagogic-diagram-enhancement/`  
**Status:** **PLANNED** — **NOT STARTED**

**Handover:** [`HANDOVER.md`](HANDOVER.md)  
**Charter:** [`sprint-32-charter.md`](sprint-32-charter.md)  
**Planning notes:** [`SPRINT-32-PLANNING-NOTES.md`](SPRINT-32-PLANNING-NOTES.md)  
**Predecessor:** [Sprint 31 CLOSED](../2026-06-01-sprint-31-page-rhetoric-renderer-experience/SPRINT-31-RETROSPECTIVE.md)

---

## At a glance

| Item | State |
|------|--------|
| **Sprint 32 programme** | **PLANNED** — no implementation approved |
| **Proposed slices 32-1–32-7** | **Draft only** — not chartered |
| **Workflow JSON changes** | **None** |
| **`app.js` / renderer changes** | **None** (Sprint 31 R-layer frozen) |
| **Inherited test floor** | **502 pass** / **0 fail** (Sprint 31 close) |
| **Next bounded step** | Governance review + workflow architecture design (docs only) |

---

## Verification (inherited — do not regress)

```bash
cd c:\xampp\htdocs\prism
node --test tests/*.test.js
# Expected until Sprint 32 implementation begins: 502 pass, 0 fail
```

See [`baseline-test-floor.md`](baseline-test-floor.md).

---

## Programme intent (summary)

Introduce a **workflow programme** (not a renderer sprint) for **pedagogically justified** diagram and figure generation, **accessible** embedding, and **self-contained** enhanced learner-page HTML export — without decorative imagery, semantic rewriting, or generation-layer pedagogy changes.

---

## Closed predecessor

| Programme | Status | Floor |
|-----------|--------|-------|
| Sprint 31 — Page rhetoric & renderer experience | **CLOSED** (R31-999) | **502** |

**Do not reopen Sprint 31** except regression fixes to slices 31-1–31-6.

---

## First actions when starting implementation (future)

1. Approve charter amendments and slice charters in [`review-log.md`](review-log.md).  
2. Audit existing visual/SVG workflow paths — [`context-files/visual-enhancement-workflow-analysis.md`](context-files/visual-enhancement-workflow-analysis.md).  
3. Confirm artefact handoff architecture (no base64 in prompts).  
4. Only then modify workflow JSON / `app.js` under explicit slice approval.
