# PR-W1-2 — LD-MATERIALS-COPY mapping and size accounting

**Date:** 2026-06-04  
**Change class:** CC-MODULE  
**Baseline:** post PR-W1-1 four-step sum **155,988** (self-directed augmented)  
**Canonical source:** `lib/ld-materials-copy.js`

---

## 1. Inventory → taxonomy

| Source | Layer | Steps | → Module |
|--------|-------|-------|----------|
| `buildDesignPageActivityMaterialsFidelityPromptBlock` (L4 bullets) | L4 | Design Page | preserve (embedded) |
| `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock` | L5 | Design Page | **not moved** (orientation fields) |
| GAM pack §6 full-content template lines | L4 | GAM | pack (deferred trim) |
| `buildSelfDirectedGamPelReasoningMaterialPromptBlock` | L5/L4 mix | GAM | **partial** — author embed only |
| Sprint 38 “must not replace materials” | L6 | Design Page | 2-line rider kept in composite header |
| Rhetoric blocks “Design Page: preserve … verbatim” | L5 | DLA/GAM/DP | **W1-4** |
| Pack §13 MATERIALS FIDELITY notes | L4 | Design Page | pack (Wave 3) |

---

## 2. Size accounting (probe)

| Step | Post W1-1 | Post W1-2 | Δ W1-2 | Markers |
|------|----------:|----------:|-------:|--------:|
| GAM | 36,356 | 37,516 | **+1,160** | **15** (unchanged) |
| Design Page | 47,944 | 48,495 | **+551** | **15** (unchanged) |
| DLA | 39,380 | 39,380 | **0** | 14 |
| Assessment | 32,308 | 32,308 | **0** | 11 |
| **Four-step sum** | **155,988** | **157,699** | **+1,711 (+1.1%)** | — |

**vs 38B-1 baseline (152,782):** cumulative **+4,917 (+3.2%)** after W1-1+W1-2.

**Block estimates (lib string lengths):**

| Block | Chars |
|-------|------:|
| Materials preserve (no marker) | ~1,450 |
| Materials author GAM embed (no marker) | ~480 |
| Removed Design Page duplicate prose (pre-W1-2 composite) | ~1,100 |

---

## 3. Remaining duplication (documented)

| Location | Wave |
|----------|------|
| Pack §6 / §13 materials fidelity prose | 2a / 3 |
| Field preservation L5 verbatim fields | keep (L5) |
| Rhetoric “preserve worked_example… verbatim” | W1-4 |
| Sprint 38 + composite header figures-only (2 lines) | Wave 3 L6 rider |
| `app.js` inline bootstrap mirrors lib | post W1-5 |

---

## 4. Validation

| Check | Status |
|-------|--------|
| L8-01 | **PASS** — 713/713 |
| L4-01–L4-03 | **PASS** |
| MR-04 single lib authority | **Met** |
| GAP-02 markers | **Target: no increase** (GAM/DP embed without marker) |
