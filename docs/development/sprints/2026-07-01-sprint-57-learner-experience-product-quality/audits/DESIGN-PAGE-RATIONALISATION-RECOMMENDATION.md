# Design Page Rationalisation Recommendation (Sprint 57 Discovery)

**Status:** Evidence-backed recommendation  
**Date:** 2026-07-01  
**Classification:** **AMBER** (upper bound — approaching RED thresholds on pack duplication)

---

## 1. Classification

### AMBER — Moderate-to-high duplication; targeted rationalisation recommended

Design Page does **not** qualify for **GREEN** because:

- Augmented prompt **44,386 chars** — largest learner-facing emit vs post-S56 DLA (31,932) and post-remediation GAM (41,558)
- Pack `promptTemplate` (**10,927 chars**, 24.6%) largely restates runtime LD-DESIGN-PAGE-COMPOSE contract
- **22 governance authorities** on full path (12 emit + 10 post-emit); **2 referenced modules not injected** (LD-MATERIALS-COPY, LD-TABLE-FIDELITY)
- Estimated **14,000–20,000 chars** (32–45%) thematic duplication
- **10 documented contract tensions** including high-severity governance drift (C-01)
- Still **~2×** Sprint 38B charter target (≤22k augmented)

Design Page does **not** fully qualify for **RED** (DLA-style rationalisation programme) because:

- **No PRE-EMIT duplicate gate** on emit (probe: `PRE-EMIT` ×0)
- **No competing word-range grids** forcing regeneration on the same JSON fields at emit time (unlike pre-S56 DLA OUTPUT CONTRACT + SSOT + PRE-EMIT stack)
- Compose contract (`LD-DESIGN-PAGE-COMPOSE-CONTRACT`) is a **documented canonical owner** with explicit “does not duplicate” headers — architecture intent is clearer than pre-S56 DLA
- Capture validation is **tiered and repair-backed** (GAM preserve overlay) rather than conflicting emit-time gates
- Facilitated path is leaner (**42,265** vs **44,386** self-directed) — bloat gated to learner-page framing stack
- Augmented size **decreased 3.1%** since 38B despite pack growth — rhetoric consolidation already delivered partial relief

**Recommendation:** Enter a **targeted Design Page rationalisation track** (not a full DLA-S56 programme). Priority: pack thinning to compose SSOT; fix materials/table module injection or remove pack inline rules; compose-only scaffold slice; journey/rhetoric dedupe. Re-probe after each tranche.

---

## 2. Evidence summary

| Metric | Value | Source |
|--------|------:|--------|
| Augmented prompt (self-directed) | **44,386** | `scripts/probe-design-page-s57-audit-metrics.js` |
| Seeded pack | 10,757 | Same probe |
| Runtime delta | +33,629 | Same probe |
| vs 38B Design Page augmented | −1,405 (−3.1%) | `38B-1-prompt-audit.md` vs probe |
| vs DLA post-S56 | +12,454 (+39%) | 44,386 vs 31,932 |
| vs GAM post-remediation | +2,828 (+6.8%) | 44,386 vs 41,558 |
| vs DLA pre-S56 | −5,563 | 44,386 vs 49,949 |
| Governance authorities (full path) | **22** | `DESIGN-PAGE-AUTHORITY-MAP.md` |
| Emit-time auto-applied blocks | **9** | Probe `blockTitles` |
| Estimated duplication | **14k–20k chars** | `DESIGN-PAGE-DUPLICATION-AUDIT.md` |
| Documented contract conflicts | **10** (2 high) | `DESIGN-PAGE-CONTRACT-CONFLICT-AUDIT.md` |
| Validation/repair systems | **12** | `DESIGN-PAGE-VALIDATION-AUDIT.md` |
| PRE-EMIT on Design Page | **0** | Validation audit + probe |

---

## 3. Executive summary (required questions)

### 1. What is the current Design Page prompt size?

**44,386 characters** augmented (self-directed RNA/HCV brief, full lib bootstrap, 2026-07-01). Breakdown: pack 10,757 seeded (24.2%); runtime +33,629 (75.8%). Largest contributor: **Design Page compose stack** +21,850 chars in one augmentation step (49.2% of runtime delta). Largest single block: pack template 10,927 chars (24.6%) + LD-DESIGN-PAGE-COMPOSE 9,978 chars (22.5%).

### 2. How many governance authorities exist?

**22** distinct authorities influence Design Page (12 on emit path including 2 referenced-but-not-injected; 10 post-emit/capture/repair). See `DESIGN-PAGE-AUTHORITY-MAP.md`.

### 3. How much duplication exists?

Estimated **14,000–20,000 characters** (32–45% of augmented prompt). Primary clusters: pack template ↔ compose contract (materials, membership, episode plans); journey assimilation ↔ rhetoric wrapper; DLA-oriented LD-GUIDED-LEARNING-SCAFFOLD on compose path. Phrase evidence: `verbatim` ×18, `activity.materials` ×27, `episode_plans` ×16.

### 4. Are there conflicting contracts?

**Yes — 10 documented tensions**, 2 high severity. Most significant: **pack and compose defer to LD-MATERIALS-COPY and LD-TABLE-FIDELITY but augmentation does not inject them** (C-01); **DLA generation scaffold rules on read-only compose step** (C-03). No pre-S56 DLA-style PRE-EMIT/word-grid conflicts.

### 5. How many validation systems exist?

**12** distinct validation/repair authorities: 2 prompt-side checklists; 6 capture validators; 4 compose repair overlays. **0 PRE-EMIT** on emit. Authoritative layer: `applyPageCompositionValidationForCapturedPage` + strict JSON gate; materials repair via `applyComposedPageGamMaterialsPreserve`.

### 6. Is Design Page healthier than pre-rationalisation DLA?

**Yes, moderately healthier** — but **less healthy than post-S56 DLA** and **slightly less healthy than post-remediation GAM**.

| Dimension | DLA pre-S56 | Design Page now |
|-----------|-------------|-----------------|
| Augmented size | 49,949 | 44,386 (−11%) |
| PRE-EMIT on emit | Yes | **No** |
| Competing word-range grids | Yes (severe) | No on emit (scaffold floors misplaced on compose) |
| Canonical SSOT module | Fragmented | LD-DESIGN-PAGE-COMPOSE declared |
| JSON exemplars on emit | ~3k page-oriented | ~2.4k Sprint 38 row exemplars only |
| Pack duplication | Moderate | **High** (pack ≈ compose) |

### 7. Does Design Page warrant a rationalisation programme?

**Targeted rationalisation — yes. Full DLA-S56 programme — no.**

| Programme type | Warranted? | Rationale |
|----------------|------------|-----------|
| Full RED programme (DLA-S56 scale) | **No** | No PRE-EMIT stack; clearer compose SSOT; capture repair compensates |
| AMBER targeted track | **Yes** | 44k chars; 32–45% duplication; governance drift on materials/table modules; 2× charter target |
| GREEN (no action) | **No** | Largest emit step; pack accretion continues |

**Suggested tranches (evidence-ranked, no implementation in this audit):**

1. Thin pack `promptTemplate` to pointers — defer to LD-DESIGN-PAGE-COMPOSE (est. −4k–6k chars)
2. Inject LD-MATERIALS-COPY + LD-TABLE-FIDELITY on Design Page **or** remove pack inline rules and compose deferral (governance fix)
3. Replace compose-path LD-GUIDED-LEARNING-SCAFFOLD full block with preservation-only compact slice (est. −2k–2.5k chars)
4. Dedupe journey ↔ rhetoric wrapper transitions (est. −0.8k–1.2k chars)
5. Re-probe with `scripts/probe-design-page-s57-audit-metrics.js` after each tranche

**Target:** Move toward 38B charter ≤22k augmented or interim ≤35k (between DLA post-S56 and current).

---

## 4. Comparison to GAM audit outcome

| Dimension | GAM (pre-remediation) | Design Page |
|-----------|----------------------|-------------|
| Classification | AMBER | **AMBER (upper)** |
| Augmented size | 46,349 → 41,558 after cleanup | 44,386 (no cleanup yet) |
| Primary duplication | SP blocks ↔ GAM-PRES | Pack template ↔ compose stack |
| Programme | Targeted cleanup (done) | **Targeted cleanup recommended** |
| PRE-EMIT | No | No |

---

## 5. Traceability

| Deliverable | Path |
|-------------|------|
| Prompt inventory | `DESIGN-PAGE-PROMPT-INVENTORY.md` |
| Baseline metrics | `DESIGN-PAGE-BASELINE-METRICS.md` |
| Authority map | `DESIGN-PAGE-AUTHORITY-MAP.md` |
| Duplication audit | `DESIGN-PAGE-DUPLICATION-AUDIT.md` |
| Contract conflicts | `DESIGN-PAGE-CONTRACT-CONFLICT-AUDIT.md` |
| Validation audit | `DESIGN-PAGE-VALIDATION-AUDIT.md` |
| Probe | `scripts/probe-design-page-s57-audit-metrics.js` |
