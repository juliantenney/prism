# Sprint 23 Slice 23-5 — Design Assessment semantics

**Date:** 2026-05-18  
**Status:** **Closed**  
**Sprint:** 23 — Learning Design pack rationalisation  
**Slice:** 23-5

**Baselines:** Slices 23-1–23-4  
**Deliverable:** [`ld-design-assessment-semantics.md`](ld-design-assessment-semantics.md)

---

## Objective

Resolve Design Assessment vocabulary, ownership, inheritance, prompt placeholders, Settings targets, and Generate Items dependency — documentation only.

---

## Approved decisions (charter)

- DA = canonical assessment authority  
- Gen inherits by default; explicit override wins  
- `assessment_type` → **`activity_type`** alias (keep)  
- Canonical DA keys: **`difficulty_profile`**, **`coverage_scope`**, **`total_items`**  
- Gen: **`number_of_items`**, **`coverage_mode`**, **`response_formats`**  
- `feedback_display` ≠ `feedback_required`  
- `cognitive_demand`, `assessment_cadence` → **DA step controls** in 23-6  
- Runtime inheritance preserved until parity gates  

---

## Outcomes

| Outcome | Status |
|---------|--------|
| `ld-design-assessment-semantics.md` | **Done** |
| 23-6 metadata change list (§11) | **Done** |
| Regression checklist (§12) | **Done** |
| No pack/runtime delta | **Verified** |

---

## Verification

```bash
node --test tests/*.test.js
```

**Result:** **188 passed**, 0 failed.

---

## Handoff

- **23-6:** Implement §8–§11 pack metadata  
- **Runtime charter:** After 23-6 + §12 tests
