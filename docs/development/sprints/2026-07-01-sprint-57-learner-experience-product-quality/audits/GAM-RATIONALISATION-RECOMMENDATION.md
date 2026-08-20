# GAM Rationalisation Recommendation (Sprint 57 Discovery)

**Status:** Evidence-backed recommendation  
**Date:** 2026-07-01  
**Classification:** **AMBER**

---

## 1. Classification

### AMBER — Moderate duplication; targeted cleanup recommended

GAM does **not** qualify for **GREEN** (minimal duplication, single-source governance) because:

- Augmented prompt **46,349 chars** (+34% vs Sprint 38B baseline 34,482)
- **INSTRUCTIONAL-PATTERN SP-01..07** adds **14,979 chars** (32%) largely restating pack GAM-PRES-08 per-type rules
- **12 governance authorities** on the generation path with documented overlap (Authority Map)
- Estimated **18,000–24,000 chars** (39–52%) thematic duplication (Duplication Audit)

GAM does **not** qualify for **RED** (DLA-style accretion programme) because:

- Pack **GAM-PRES/GAM-WB** (~19k embedded) is a **coherent pack SSOT** — unlike pre-S56 DLA where OUTPUT CONTRACT, cognition, scaffold, and PRE-EMIT conflicted on the same JSON fields
- **No numeric word-range grid conflicts** on identical fields (Contract Conflict Audit)
- **No PRE-EMIT duplicate gate** on emit
- **No JSON exemplar** on main emit path
- Capture validation is **tiered and singular** for workflow advance (Validation Audit)
- Facilitated path is **lean** (~21,967 chars augmented in prior probe vs 46,349 self-directed) — bloat is gated to self-directed + SP stack

**Recommendation:** Enter a **targeted Sprint 57 rationalisation track** (not a full DLA-scale programme). Priority: dedupe SP↔pack↔PEL depth authority; align char/word validation; avoid new runtime layers.

---

## 2. Evidence summary

| Metric | Value | Source |
|--------|------:|--------|
| Augmented prompt (self-directed) | **46,349** | `scripts/probe-gam-s57-audit-metrics.js` |
| Seeded pack | 15,145 | Same probe |
| Runtime delta | +31,204 | Same probe |
| vs 38B GAM augmented | +11,867 (+34%) | `38B-1-prompt-audit.md` vs probe |
| vs DLA post-S56 core | +14,417 | 46,349 vs 31,932 |
| vs DLA pre-S56 | −3,600 | 46,349 vs 49,949 |
| Governance authorities | **12** | `GAM-AUTHORITY-MAP.md` |
| Auto-applied blocks (full bootstrap) | **13** | Probe `blockTitles` |
| Estimated duplication | **18k–24k chars** | `GAM-DUPLICATION-AUDIT.md` |
| Documented contract conflicts | **6** (no rubric conflicts) | `GAM-CONTRACT-CONFLICT-AUDIT.md` |
| Validation layers | **4** active + compose downstream | `GAM-VALIDATION-AUDIT.md` |
| PRE-EMIT on GAM | **0** | Validation audit |

---

## 3. Executive summary (required questions)

### 1. What is the current GAM prompt size?

**46,349 characters** augmented (self-directed RNA/HCV brief, full lib bootstrap, 2026-07-01). Breakdown: pack 15,145 (33%); runtime +31,204 (67%). Largest runtime contributor: INSTRUCTIONAL-PATTERN SP blocks **14,979 chars** (32% of total).

### 2. How many governance authorities exist?

**12** distinct authorities influence GAM generation (pack GAM-PRES/WB + 11 runtime modules/blocks). See `GAM-AUTHORITY-MAP.md`.

### 3. How much duplication exists?

Estimated **18,000–24,000 characters** (39–52% of augmented prompt) of thematic duplication. Primary clusters: GAM-PRES-08 depth floors restated in SP-03/04/05/06/07 and PEL reasoning block; facilitator ban ×3; table/materials pack + runtime dual naming.

Phrase evidence: `GAM-PRES-08` ×11, `80 words` ×7, `facilitator` ×9, `GOOD shape example` ×7.

### 4. Are there conflicting contracts?

**Yes — 6 documented tensions**, none as severe as pre-S56 DLA word-range grids. Most significant: **words vs characters** for depth (GAM-PRES-08 vs GAM-FMT-04) and **anti-redundancy vs completeness** (explicitly carved out in prompt). No competing rubric models on GAM path.

### 5. Are multiple validation systems present?

**Yes — 4 systems:** (1) pack FAIL guidance, (2) capture sanitization, (3) tiered GAM-FMT gate (authoritative), (4) stabilisation evaluator (advisory). Compose-time A4 validation is downstream. **No PRE-EMIT** on emit. Overlap on facilitator ban and thin-body detection; no dual emit-time gates.

### 6. Is GAM healthier than DLA was pre-rationalisation?

**Yes, moderately healthier.**

| Dimension | DLA pre-S56 | GAM now |
|-----------|-------------|---------|
| Augmented size | 49,949 | 46,349 |
| SSOT clarity | Fragmented across 5+ blocks | Pack GAM-PRES primary |
| Field-level word conflicts | **Severe** | **Absent** |
| PRE-EMIT duplication | Yes | No |
| JSON exemplar on emit | Yes (~3k) | No |
| Runtime bloat driver | 30k self-directed scaffold stack | 15k SP + 9k self-directed sub-chain |
| Capture repair | Added S56 | Minimal (transfer band append) |

GAM is **smaller than pre-rationalisation DLA** but **larger than post-rationalisation DLA** and **growing** (+34% since 38B).

### 7. Does GAM warrant a Sprint 57 rationalisation programme?

**Targeted programme — yes. Full DLA-scale programme — no.**

| Programme tier | Warrant |
|----------------|---------|
| Full RED programme (SSOT module, PRE-EMIT merge, capture repair, deprecation register) | **Not warranted** — pack authority is usable; no field-level governance drift |
| AMBER targeted cleanup | **Warranted** — see backlog below |

---

## 4. Recommended Sprint 57 backlog (if approved)

| Priority | Item | Rationale | Est. savings |
|----------|------|-----------|-------------|
| P1 | **SP↔GAM-PRES dedupe** — SP blocks reference pack floors; drop repeated depth bullets | Largest duplication cluster (~8–10k overlap) | 8,000–12,000 chars |
| P2 | **PEL reasoning thin** — cross-ref SP markers only; remove restated rules | 3,874 char block largely redundant post-P1 | 2,000–3,000 chars |
| P3 | **Facilitator ban single owner** — retain self-study block; trim rhetoric overlap | 9 facilitator mentions | 400–800 chars |
| P4 | **Align GAM-FMT char floors with GAM-PRES word floors** | Resolve C-01 conflict | Behavioural, not size |
| P5 | **38B probe bootstrap parity** — load `instructional-pattern-prompt.js` in `probe-38b1` | Measurement accuracy | Governance |
| P6 | **Defer** unified GAM SSOT module unless P1–P2 insufficient | Pack already dense | — |

**Do not** (unless metrics fail after P1–P2):
- Add PRE-EMIT gate without deduping prompt first (DLA lesson: gate without SSOT adds accretion)
- Add capture repair layer before prompt authority is consolidated

---

## 5. Outcome mapping

| Outcome | Verdict |
|---------|---------|
| 1. GAM healthy, no rationalisation | **Rejected** — size inflation + SP duplication |
| 2. Moderate duplication, targeted cleanup | **Selected (AMBER)** |
| 3. DLA-style accretion, dedicated programme | **Rejected** — lacks DLA-level conflict/governance drift |

---

## 6. Traceability index

| Deliverable | Path |
|-------------|------|
| Prompt inventory | `GAM-PROMPT-INVENTORY.md` |
| Baseline metrics | `GAM-BASELINE-METRICS.md` |
| Authority map | `GAM-AUTHORITY-MAP.md` |
| Duplication audit | `GAM-DUPLICATION-AUDIT.md` |
| Contract conflicts | `GAM-CONTRACT-CONFLICT-AUDIT.md` |
| Validation audit | `GAM-VALIDATION-AUDIT.md` |
| Measurement probe | `scripts/probe-gam-s57-audit-metrics.js` |
| DLA comparison baseline | `SPRINT-55-DLA-PROMPT-RATIONALISATION-AUDIT.md` |
| Historical GAM size | `38B-1-prompt-audit.md` |
