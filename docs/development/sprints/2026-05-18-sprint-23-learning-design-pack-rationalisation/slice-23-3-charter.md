# Sprint 23 Slice 23-3 — Prompt Factory bespoke-control audit

**Date:** 2026-05-18  
**Status:** **Closed**  
**Sprint:** 23 — Learning Design pack rationalisation  
**Slice:** 23-3

**Baselines:** [`ld-semantics-matrix.md`](ld-semantics-matrix.md), [`ld-elicitation-alignment-plan.md`](ld-elicitation-alignment-plan.md)  
**Deliverable:** [`ld-pf-bespoke-control-audit.md`](ld-pf-bespoke-control-audit.md)

---

## Objective

Audit PF `userOptions` and LD runtime/PF behaviour against `stepParameterControls` for **all** canonical LD steps — Design Assessment / Generate Assessment Items as the highest-risk example, not a one-off.

---

## Scope

| In scope | Detail |
|----------|--------|
| 17 canonical steps | Inventory + PF vs controls matrix |
| Runtime bespoke inventory | B1–B15 in audit |
| Cross-step inheritance | DA → Generate Items |
| Retirement / convergence criteria | |
| Handoff to 23-4 / 23-5 / 23-6 | |

| Out of scope | Detail |
|--------------|--------|
| Pack edits | **23-6** |
| Runtime changes | After 23-5/23-6 parity |
| PF/Settings removal | Not this slice |

---

## Outcomes

| Outcome | Status |
|---------|--------|
| `ld-pf-bespoke-control-audit.md` | **Done** |
| All canonical steps reviewed | **Done** (§3, §9) |
| No code/pack delta | **Verified** |

---

## Verification

```bash
node --test tests/*.test.js
```

**Result:** **188 passed**, 0 failed.

---

## Handoff

- **23-4:** Parameter ownership and key disambiguation  
- **23-5:** Design Assessment semantics (use audit §8)  
- **23-6:** Pack metadata expansion (PF-only → controls)  
- Runtime inheritance retirement: **after** 23-6, separate charter
