# Probe 38-1 — Inflation visual affordance audit worksheet

**Date:** 2026-06-03  
**Slice:** 38-1 — **COMPLETE**  
**Fixtures:** `ld-inflation-workshop-page-full.json`, `ld-inflation-workshop-csv-worksheet-page.json`  
**Observation:** [../observations/38-1-visual-affordance-audit.md](../observations/38-1-visual-affordance-audit.md)

---

## Session context

| Field | Value |
|-------|-------|
| Discipline | Introductory economics |
| Delivery | Live workshop (`page_profile: learner`) |
| Validation | Economics Inflation project + fixture renders |
| JSON affordance fields | **None** (`hasVisualAffordances: false`) |

---

## Rendered hook inventory (audit run)

### Full workshop (`ld-inflation-workshop-page-full.json`)

| activity_id | Hook count | Slots | `data-visual-subject` |
|-------------|------------|-------|------------------------|
| A1 | 4 | `activity-after-header`, `materials-entry`, `materials-card-grid-after`, `materials-scenario` | Activity title |
| A2 | 2 | `activity-after-header`, `materials-entry` | Activity title |
| A3 | 3 | `activity-after-header`, `materials-entry`, `materials-scenario` | Activity title |
| A4 | 3 | `activity-after-header`, `materials-entry`, `materials-scenario` | Activity title |
| A5 | 1 | `materials-entry` | Activity title |
| (page) | 1 | `assessment-before-checkpoint` | null |

**Total hooks:** 14

### CSV worksheet (`ld-inflation-workshop-csv-worksheet-page.json`)

| activity_id | Hook count | Slots |
|-------------|------------|-------|
| A2 | 1 | `materials-entry` |
| A3 | 1 | `materials-entry` |

**Total hooks:** 2 — no `materials-table-pair-between` (single table per activity).

---

## Activity materials (JSON — not in affordance hooks)

| Activity | Key materials (from `activity_materials` or inline) | Table-sufficient? |
|----------|---------------------------------------------------|-------------------|
| A1 | scenario, task_cards, classification_table | Yes — cards + table |
| A2 | comparison_table (CPI, PPI, GDP deflator), prompt_set, checklist | Yes — comparison table primary |
| A3 | scenario (4 households), analysis_table (empty) | Yes |
| A4 | scenario, impact_table (empty) | Yes |
| A5 | discussion_prompts only | N/A — debrief |

---

## Activity audit grid (Sprint 38 v2 decisions)

| Activity | `activity_visual_value` (v2) | `visual_decision` | `rejection_reason` | Charter: LD from hook alone? |
|----------|------------------------------|-------------------|--------------------|------------------------------|
| A1 warm-up | none | **reject** | `low_value_activity` | **Fail** |
| A2 indicator | high | **generate** | — | **Fail** (hook); Partial (materials) |
| A3 household | low / none | **reject** | `duplicate_existing_material` | **Fail** |
| A4 variable costs | low | **reject** | `duplicate_existing_material` | **Fail** |
| A5 debrief | none | **reject** | `low_value_activity` | **Fail** |
| A2 CSV | high | **generate** | — | **Fail** |
| A3 CSV types | high | **generate** | — (`classification`, anti-spoiler) | **Fail** |

---

## Inflation failure catalogue

| ID | Full workshop | CSV | Notes |
|----|---------------|-----|-------|
| F1 Duplicate table | **observed** (programme) | possible | A2 comparison_table + infographic |
| F2 Unsupported causal | possible | unlikely | No mechanism claims in materials |
| F3 Illustrated summary | **observed** (programme) | possible | Overview + activity heroes |
| F4 Non-canonical | **observed** (programme) | possible | Money/arrow clip-art risk |
| F5 Indiscriminate | **observed** | **observed** | 14 / 2 hooks vs 1–2 generate opportunities |
| F6 Spoiler | **observed** | **observed** | Empty classification / analysis cells |

---

## VEU analyse (assumptions — not re-run)

| Check | Expected today | Target after 38-4/38-5 |
|-------|----------------|------------------------|
| Input | HTML + titles | HTML + **authoritative JSON** |
| A2 opportunity | Inferred “inflation” / indicator topic | `purpose: distinction`, `comparison_framework` |
| A1 opportunity | Possible from 4 hooks | **reject** `low_value_activity` |
| Reject list | Model discretion | Authored `rejection_reason` |
| Topic-only | **Likely** | **Forbidden** |

---

## Human-designer test — Inflation

**Question:** Could a competent LD create the correct instructional diagram from **currently emitted affordance alone**?

| Scope | Score | Notes |
|-------|-------|-------|
| Hook-only (A2 `activity-after-header`) | **Fail** | Knows slot + title only |
| Full page JSON (materials) | **Partial** | Can infer CPI/deflator distinction from table |
| Sprint 38 v2 brief (probe-38-4 example) | **Pass** (target) | Not emitted today |

---

## Affordance quality — Inflation A2 representative hook

| Criterion | Score (0–2) |
|-----------|-------------|
| Purpose specificity | 1 |
| Representation specificity | 0 |
| Discipline fidelity | 0 |
| Spoiler handling | 0 |
| Designer actionability | 1 |
| **Total** | **2 / 10** |

---

## Audit conclusion (inflation slice)

- **generate:** 2–3 (A2 full, A2 CSV, A3 CSV classification)  
- **reject:** 4+ (A1, A3, A4, A5, assessment hook)  
- **Primary gap:** hooks signal “place something here” using **activity title as topic**  
- **38-1 programme verdict:** Upstream bottleneck **confirmed** for inflation  

See full cross-anchor conclusions in [38-1-visual-affordance-audit.md § Sprint 38-1 conclusion](../observations/38-1-visual-affordance-audit.md).
