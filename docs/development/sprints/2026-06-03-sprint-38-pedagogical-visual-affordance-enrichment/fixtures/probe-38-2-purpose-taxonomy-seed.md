# Probe 38-2 — Purpose taxonomy seed (38-1 crosswalk)

**Date:** 2026-06-03  
**Slice:** 38-2 — **COMPLETE**  
**Authority:** [../observations/38-1-visual-affordance-audit.md](../observations/38-1-visual-affordance-audit.md) → [../observations/38-2-visual-purpose-taxonomy.md](../observations/38-2-visual-purpose-taxonomy.md)

---

## Programme roll-up

| Decision | Count | Taxonomy buckets |
|----------|-------|------------------|
| **generate** | **6** | 6 purposes (see below) |
| **defer** | **2** | 2 `defer_reason` values |
| **reject** | **7** | 7 `rejection_reason` values (Marx A4 extra row uses same family) |
| **Total meaningful opportunities** | **15** | |

**Definition:** Opportunity = pedagogical function not already adequate in materials — **not** hook insertion point.

---

## Generate purposes (allow-list)

| `purpose` | Fixtures (38-1) |
|-----------|-----------------|
| `distinction` | Inflation A2 (full + CSV); CI A2 |
| `comparison` | Marx A3 |
| `classification` | Inflation CSV A3 |
| `mechanism` | Climate CC-MIS-1 (post card grid) |
| `evidence_structure` | Climate CC-MIS-1 (analysis template) |
| `data_pattern_reading` | CI A4 |

---

## Full crosswalk (17 audit rows → 15 opportunities)

| Anchor | Activity | Decision | Purpose / defer / reject | Notes |
|--------|----------|----------|--------------------------|-------|
| Inflation | A1 warm-up | reject | `low_pedagogical_value` | 4 hooks — not 4 opportunities |
| Inflation | A2 indicator | generate | `distinction` | Merges with CSV A2 row |
| Inflation | A3 household | reject | `duplicate_existing_structure` | |
| Inflation | A4 variable costs | reject | `duplicate_existing_structure` | |
| Inflation | A5 debrief | reject | `debrief_without_new_reasoning` | |
| Inflation CSV | A2 index table | *(merge)* | `distinction` | Same opportunity as A2 full |
| Inflation CSV | A3 types grid | generate | `classification` | |
| Climate | Mechanism slot | generate | `mechanism` | `materials-card-grid-after` |
| Climate | Evidence template | generate | `evidence_structure` | |
| Climate | Formative T/F | reject | `decorative_only` | `spoiler_risk` secondary |
| CI | A4 overlap | generate | `data_pattern_reading` | |
| CI | A2 level–width | generate | `distinction` | `materials-table-pair-between` |
| CI | A1 worked example | defer | `worked_example_sufficient_first` | |
| CI | Assessment | reject | `assessment_text_sufficient` | |
| Marx | A3 comparison | generate | `comparison` | |
| Marx | A2 model row | defer | `model_row_sufficient_first` | |
| Marx | Knowledge summary | reject | `duplicate_existing_structure` | |
| Marx | A4 factory | reject | `low_pedagogical_value` | Traceability row (roll-up with warm-up/debrief family) |

---

## Quick decision tree (probe card)

```text
Pedagogical function distinct? → No: reject
Materials already adequate?    → Yes: reject (duplicate_existing_structure)
Learner must try first?        → Yes: defer
Else                           → generate (pick 1 of 6 purposes)
```

---

## QA checks (compose-time, future 38-4)

- [ ] `purpose` ∈ { distinction, comparison, classification, mechanism, evidence_structure, data_pattern_reading } when generate  
- [ ] `defer_reason` ∈ { worked_example_sufficient_first, model_row_sufficient_first } when defer  
- [ ] `rejection_reason` required when reject  
- [ ] Topic / title alone → defect, not in allow-list  
