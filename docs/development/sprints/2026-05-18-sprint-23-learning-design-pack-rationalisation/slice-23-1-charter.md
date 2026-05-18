# Sprint 23 Slice 23-1 — LD pack inventory + semantics matrix

**Date:** 2026-05-18  
**Status:** **Closed**  
**Sprint:** 23 — Learning Design pack rationalisation  
**Slice:** 23-1

**Bootstrap:** [`sprint-23-bootstrap.md`](sprint-23-bootstrap.md)  
**Deliverable:** [`ld-semantics-matrix.md`](ld-semantics-matrix.md)  
**Predecessor baseline:** Sprint 22 — **185+ tests** documented

---

## Objective

Produce an **inventory and semantics matrix** of the Learning Design domain pack: factors, mappings, controls, and PF surfaces — cross-checked with assessment inheritance in `app.js`.

**Thesis (slice):** *You cannot rationalise metadata until every semantic surface is visible in one matrix.*

---

## Scope

| In scope | Detail |
|----------|--------|
| **Pack inventory** | `requiredFactors`, `optionalFactors`, `refinementFactors`, `mappingRules`, `workflowParameterControls`, `stepParameterControls`, PF `userOptions` |
| **Runtime cross-check** | Design Assessment / Generate Assessment Items inheritance (`app.js`) |
| **Deliverable** | [`ld-semantics-matrix.md`](ld-semantics-matrix.md) |
| **Verification** | `node --test tests/*.test.js` — no code delta |

| Out of scope | Detail |
|--------------|--------|
| Pack metadata edits | Slice **23-6** |
| Runtime bespoke removal | Slice **23-3** / **23-5** + chartered runtime |
| Elicitation code changes | Slice **23-2** |
| Unified Settings changes | **Forbidden** |

---

## Outcomes

| Outcome | Status |
|---------|--------|
| Full semantics matrix with suggested columns | **Done** |
| Priority assessment issues confirmed (§2 of matrix) | **Done** |
| PF inventory by pack section | **Done** — matrix §8 |
| Runtime bespoke inventory | **Done** — matrix §9 |
| No pack/runtime edits | **Verified** |

---

## Verification

```bash
node --test tests/*.test.js
```

**Result:** **188 passed**, 0 failed.

---

## Handoff

- **23-2:** Elicitation alignment using matrix §4 and §11 conclusion 3  
- **23-3:** PF bespoke audit using matrix §8–§9  
- **23-4:** Workflow vs step ownership using §4–§7  
- **23-5:** Design Assessment deep-dive expanding matrix §3–§5  
- **23-6:** Pack metadata rationalisation — **not started** (await charter)
