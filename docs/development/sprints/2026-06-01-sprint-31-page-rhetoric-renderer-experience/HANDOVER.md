# Session handover — Sprint 31 (Page rhetoric & renderer experience)

**Role:** authoritative entry point for **this pack only**.

**Pack path:** `docs/development/sprints/2026-06-01-sprint-31-page-rhetoric-renderer-experience/`

**Date:** 2026-06-01

**Status:** **CLOSED** (R31-999)

**Live repo rule:** `app.js` and `tests/` are authoritative. This pack is **historical** except for regression fixes.

---

## Continue here (new work)

1. Read [`SPRINT-31-RETROSPECTIVE.md`](SPRINT-31-RETROSPECTIVE.md) — programme outcome and boundaries.  
2. Read [`CURRENT-STATE.md`](CURRENT-STATE.md) — final slice status and floor **502**.  
3. Read [`review-log.md`](review-log.md) — R31-001 through R31-999.  
4. Run `node --test tests/*.test.js` — expect **502** pass / **0 fail**.  
5. For **new** work: open a **new programme** (e.g. quantitative/math rendering, P31-03 fixture, or deferred `metacognition_contract` on the generation layer).

**Do not reopen Sprint 31** except for documented **regression fixes** to 31-1–31-6 R-layer behaviour. **Do not start Sprint 32** from this pack without a new charter.

---

## Programme outcome (one paragraph)

Sprint 31 improved rendered self-directed learner pages on the **R-layer only**: metadata fold, cue hierarchy, knowledge-summary wrappers, material presentation, deterministic activity dedupe, and formative assessment readability — with **no** generation, schema, PEC, or assessment-semantic changes. Final suite: **502 pass / 0 fail**.

---

## Slice map (all complete)

| Slice | Focus |
|-------|--------|
| 31-1 | Meta fold, learner audience boundary |
| 31-2 | Framing rail, primary task hierarchy |
| 31-3 | Knowledge-summary wrappers |
| 31-4 | Materials stack, tables, templates |
| 31-5 | Activity-local exact-match dedupe |
| 31-6 | Assessment prompt/choices hierarchy |

---

## Closed programmes (context)

| Programme | Status |
|-----------|--------|
| Sprint 30 PEL | **CLOSED** |
| Sprint 31 rhetoric | **CLOSED** |
| `metacognition_contract` | **Deferred** (Sprint 30 Phase 3) |

---

## Key references

| Doc | Use |
|-----|-----|
| [`context-files/sprint-31-renderer-architecture-summary.md`](context-files/sprint-31-renderer-architecture-summary.md) | R-layer class map |
| [`context-files/renderer-hooks.md`](context-files/renderer-hooks.md) | Function hooks |
| [`context-files/key-fixtures-and-tests.md`](context-files/key-fixtures-and-tests.md) | Test inventory |
