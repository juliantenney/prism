# Sprint 23 Slice 23-2 — Elicitation alignment + burden reduction

**Date:** 2026-05-18  
**Status:** **Closed**  
**Sprint:** 23 — Learning Design pack rationalisation  
**Slice:** 23-2

**Baseline:** [`ld-semantics-matrix.md`](ld-semantics-matrix.md) (Slice 23-1)  
**Deliverable:** [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md)

---

## Objective

Classify LD elicitation factors by operational posture (blocking essentials, topology gates, structured-state initialisers, settings-only after synthesis, deferral/removal candidates) and produce a burden-reduction plan — **no pack or runtime edits**.

---

## Scope

| In scope | Detail |
|----------|--------|
| Classification vocabulary | Six postures + precedence model |
| All 29 factors + extraFields | Master recommendation table |
| Settings duplication analysis | Workflow + assessment priority rows |
| Assessment elicitation recommendations | mustAsk / topology / deferral |
| Handoff to 23-4 / 23-5 / 23-6 | |

| Out of scope | Detail |
|--------------|--------|
| Pack JSON changes | **23-6** |
| Runtime / WGC / PF / Settings code | Not chartered |
| Removing elicitation in code | Explicit constraint |

---

## Outcomes

| Outcome | Status |
|---------|--------|
| `ld-elicitation-alignment-plan.md` | **Done** |
| Priority 23-1 rows addressed | **Done** (§9.1) |
| No pack/runtime delta | **Verified** |

---

## Verification

```bash
node --test tests/*.test.js
```

**Result:** **188 passed**, 0 failed.

---

## Handoff

- **23-3:** PF bespoke audit (after 23-5 assessment authority sketch)  
- **23-4:** Parameter ownership (`learner_level`, duration keys, cross-step id disambiguation)  
- **23-5:** Design Assessment semantics + initializer vs Settings  
- **23-6:** Pack edits (`mustAsk`, extraFields, DA controls) — **not started**
