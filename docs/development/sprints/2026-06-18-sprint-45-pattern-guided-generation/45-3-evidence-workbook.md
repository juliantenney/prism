# Sprint 45.3 Evidence Workbook

**Experiment:** 45.3 Regression Against Benchmark Corpus  
**Status:** Pre-execution template (no scoring populated)  
**Authority:** `SPRINT-45-3-CHARTER.md` · `SPRINT-45-3-REGRESSION-EVALUATION-DESIGN.md` · `SPRINT-45-3-EXECUTION-PLAN.md`

**Non-goals for this workbook template:** Performing scoring, comparative analysis, or result calculations.

---

## Workbook Header

| Field | Value |
| ----- | ----- |
| **Experiment ID** | 45-3 |
| **Design version** | 1.0 |
| **Execution state** | pre-execution |
| **Generation set policy (D1)** | 45.1 completed cohort only |
| **Corpus scope policy (D2)** | hybrid (45.1 cohort + frozen target-type segment) |
| **Non-target policy (D3)** | non-target types not subject to SP-02/SP-03 |
| **Scoring started** | no |
| **Comparative analysis started** | no |
| **Result calculations started** | no |

---

## Input Registers

### A. Generation Cohort Register (45.1, frozen)

| Pair ID | BL artefact ID | TR artefact ID | Domain | Material type | Injection slot | Inclusion status |
| ------- | -------------- | -------------- | ------ | ------------- | -------------- | ---------------- |
| DT-MRX-A4 | BL-DT-MRX-A4 | TR-DT-MRX-A4 | Marx | `decision_table` | SP-02 / DT-SP-01 | included |
| DT-PS-A4 | BL-DT-PS-A4 | TR-DT-PS-A4 | Photosynthesis | `decision_table` | SP-02 / DT-SP-01 | included |
| DT-PS-A6 | BL-DT-PS-A6 | TR-DT-PS-A6 | Photosynthesis | `decision_table` | SP-02 / DT-SP-01 | included |
| TP-MRX-A4 | BL-TP-MRX-A4 | TR-TP-MRX-A4 | Marx | `transfer_prompt` | SP-03 / TP-SP-01 | included |
| TP-PS-A4 | BL-TP-PS-A4 | TR-TP-PS-A4 | Photosynthesis | `transfer_prompt` | SP-03 / TP-SP-01 | included |
| TP-PS-A6 | BL-TP-PS-A6 | TR-TP-PS-A6 | Photosynthesis | `transfer_prompt` | SP-03 / TP-SP-01 | included |

### B. Frozen Reference Register (target-type segment, frozen)

| Reference artefact ID | Domain | Material type | Segment membership | Inclusion status |
| --------------------- | ------ | ------------- | ------------------ | ---------------- |
| REF-DT-MRX-* | Marx | `decision_table` | target-type segment (`decision_table`) | included |
| REF-TP-MRX-* | Marx | `transfer_prompt` | target-type segment (`transfer_prompt`) | included |
| REF-DT-PS-* | Photosynthesis | `decision_table` | target-type segment (`decision_table`) | included |
| REF-TP-PS-* | Photosynthesis | `transfer_prompt` | target-type segment (`transfer_prompt`) | included |

### C. Non-Target Type Register

| Material type | In-scope for non-target regression check | Data available | Notes |
| ------------- | ---------------------------------------- | ------------- | ----- |
| (populate from benchmark corpus types outside DT/TP) | Y | | |

### D. Scope Lock (Phase 1)

| Lock | Confirmation | Status |
| ---- | ------------ | ------ |
| D1 | Generation set locked to completed 45.1 cohort only; no new generation run | confirmed |
| D2 | Corpus scope locked to hybrid model: 45.1 cohort + frozen target-type segment (`decision_table`, `transfer_prompt`) across Marx and Photosynthesis | confirmed |
| D3 | Non-target definition locked to material types not subject to SP-02/SP-03 injection; same-run co-generation interpretation remains out of scope unless explicitly authorised | confirmed |

### E. Dependency Lock (Phase 1)

| Dependency | Confirmation | Status |
| ---------- | ------------ | ------ |
| Sprint 45.1 | Completed cohort and evidence artefacts available and fixed | confirmed |
| Sprint 45.2 | Closure state recorded and available as standing dependency | confirmed |
| I5 Closure Extension | I5 closure report and governance addendum recorded; dependency satisfied | confirmed |

---

## Body-Level Section

Phase 2 population from authoritative completed Sprint 45.1 evidence; no reinterpretation applied.

| Body ID | Set | Domain | Material type | Pair ID | Condition | L1 verdict | Target FM fields | Ownership field | Mimicry/superficial-match fields | Evidence citations | Notes |
| ------- | --- | ------ | ------------- | ------- | --------- | ---------- | ---------------- | --------------- | --------------------------------- | ------------------ | ----- |
| BL-DT-MRX-A4 | 45.1 cohort | Marx | `decision_table` | DT-MRX-A4 | BL | Strong | FM-04 absent | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Baseline from frozen M13 lineage in 45-1 evidence pack. |
| TR-DT-MRX-A4 | 45.1 cohort | Marx | `decision_table` | DT-MRX-A4 | TR | Strong | FM-04 absent | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Treatment under SP-02 / DT-SP-01. |
| BL-DT-PS-A4 | 45.1 cohort | Photosynthesis | `decision_table` | DT-PS-A4 | BL | Minimum | FM-04 present | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Baseline from frozen M12 lineage in 45-1 evidence pack. |
| TR-DT-PS-A4 | 45.1 cohort | Photosynthesis | `decision_table` | DT-PS-A4 | TR | Strong | FM-04 absent | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Treatment under SP-02 / DT-SP-01. |
| BL-DT-PS-A6 | 45.1 cohort | Photosynthesis | `decision_table` | DT-PS-A6 | BL | Minimum | FM-04 present | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Baseline from frozen M19 lineage in 45-1 evidence pack. |
| TR-DT-PS-A6 | 45.1 cohort | Photosynthesis | `decision_table` | DT-PS-A6 | TR | Strong | FM-04 absent | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Treatment under SP-02 / DT-SP-01. |
| BL-TP-MRX-A4 | 45.1 cohort | Marx | `transfer_prompt` | TP-MRX-A4 | BL | Strong | FM-02 absent; FM-03 absent | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Baseline from frozen M16 lineage in 45-1 evidence pack. |
| TR-TP-MRX-A4 | 45.1 cohort | Marx | `transfer_prompt` | TP-MRX-A4 | TR | Strong | FM-02 absent; FM-03 absent | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Treatment under SP-03 / TP-SP-01. |
| BL-TP-PS-A4 | 45.1 cohort | Photosynthesis | `transfer_prompt` | TP-PS-A4 | BL | Failed | FM-02 present; FM-03 present | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Baseline from frozen M14 lineage in 45-1 evidence pack. |
| TR-TP-PS-A4 | 45.1 cohort | Photosynthesis | `transfer_prompt` | TP-PS-A4 | TR | Strong | FM-02 absent; FM-03 absent | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Treatment under SP-03 / TP-SP-01. |
| BL-TP-PS-A6 | 45.1 cohort | Photosynthesis | `transfer_prompt` | TP-PS-A6 | BL | Failed | FM-02 absent; FM-03 present | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Baseline scored Failed under declared Inter-Rater conjunctive interpretation in 45-1 closure evidence. |
| TR-TP-PS-A6 | 45.1 cohort | Photosynthesis | `transfer_prompt` | TP-PS-A6 | TR | Strong | FM-02 absent; FM-03 absent | ownership pass; no regression | mimicry_suspect = no; superficial-match not recorded as positive | `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` | Treatment under SP-03 / TP-SP-01. |

---

## Pair-Level Section (45.1 six pairs)

Phase 2 population copied from authoritative completed 45.1 pair outcomes; no new classification performed.

| Pair ID | BL verdict | TR verdict | Pair class | FM delta | Ownership delta | Notes | Provenance |
| ------- | ---------- | ---------- | ---------- | -------- | --------------- | ----- | ---------- |
| DT-MRX-A4 | Strong | Strong | No Change | FM-04 absent both | no ownership regression | Marx maintain-test pair | `SPRINT-45-1-CLOSURE-REVIEW.md`; `45-1-evidence-workbook.md` |
| DT-PS-A4 | Minimum | Strong | Improvement | FM-04 reduced (present -> absent) | no ownership regression | Photosynthesis remediation pair | `SPRINT-45-1-CLOSURE-REVIEW.md`; `45-1-evidence-workbook.md` |
| DT-PS-A6 | Minimum | Strong | Improvement | FM-04 reduced (present -> absent) | no ownership regression | Photosynthesis remediation pair | `SPRINT-45-1-CLOSURE-REVIEW.md`; `45-1-evidence-workbook.md` |
| TP-MRX-A4 | Strong | Strong | No Change | FM-02/FM-03 absent both | no ownership regression | Marx maintain-test pair | `SPRINT-45-1-CLOSURE-REVIEW.md`; `45-1-evidence-workbook.md` |
| TP-PS-A4 | Failed | Strong | Improvement | FM-02/FM-03 reduced (present -> absent) | no ownership regression | Photosynthesis remediation pair | `SPRINT-45-1-CLOSURE-REVIEW.md`; `45-1-evidence-workbook.md` |
| TP-PS-A6 | Failed | Strong | Improvement | FM-03 reduced (present -> absent); FM-02 absent both | no ownership regression | Boundary declaration applies per 45-1 closure note | `SPRINT-45-1-CLOSURE-REVIEW.md`; `45-1-evidence-workbook.md` |

---

## Segment-Level Section

### Target-Type Segments

| Segment ID | Domain | Material type | Cohort count | Reference count | Evidence status | Notes |
| ---------- | ------ | ------------- | ------------ | --------------- | --------------- | ----- |
| SEG-MRX-DT | Marx | `decision_table` | 2 | REF-DT-MRX-* (registered) | populated | Cohort count aggregated from Phase 2 body-level entries (BL+TR for DT-MRX-A4). |
| SEG-MRX-TP | Marx | `transfer_prompt` | 2 | REF-TP-MRX-* (registered) | populated | Cohort count aggregated from Phase 2 body-level entries (BL+TR for TP-MRX-A4). |
| SEG-PS-DT | Photosynthesis | `decision_table` | 4 | REF-DT-PS-* (registered) | populated | Cohort count aggregated from Phase 2 body-level entries (BL+TR for DT-PS-A4 and DT-PS-A6). |
| SEG-PS-TP | Photosynthesis | `transfer_prompt` | 4 | REF-TP-PS-* (registered) | populated | Cohort count aggregated from Phase 2 body-level entries (BL+TR for TP-PS-A4 and TP-PS-A6). |

---

## Distribution Tables

### A. Cohort Verdict Distribution (target types)

| Segment ID | Failed | Minimum | Strong | Total | Notes |
| ---------- | ------ | ------- | ------ | ----- | ----- |
| SEG-MRX-DT | 0 | 0 | 2 | 2 | Aggregated from Phase 2 body-level entries: BL-DT-MRX-A4, TR-DT-MRX-A4. |
| SEG-MRX-TP | 0 | 0 | 2 | 2 | Aggregated from Phase 2 body-level entries: BL-TP-MRX-A4, TR-TP-MRX-A4. |
| SEG-PS-DT | 0 | 2 | 2 | 4 | Aggregated from Phase 2 body-level entries: BL/TR DT-PS-A4 and BL/TR DT-PS-A6. |
| SEG-PS-TP | 2 | 0 | 2 | 4 | Aggregated from Phase 2 body-level entries: BL/TR TP-PS-A4 and BL/TR TP-PS-A6. |

### B. Frozen Reference Verdict Distribution (target types)

| Segment ID | Failed | Minimum | Strong | Total | Notes |
| ---------- | ------ | ------- | ------ | ----- | ----- |
| SEG-MRX-DT | 0 | 0 | 1 | 1 | Reference body M13 (Strong). Provenance: `45-1-evidence-workbook.md` frozen reference field + `SPRINT-45-1-CLOSURE-REVIEW.md` pair summary. |
| SEG-MRX-TP | 0 | 0 | 1 | 1 | Reference body M16 (Strong). Provenance: `45-1-evidence-workbook.md` frozen reference field + `SPRINT-45-1-CLOSURE-REVIEW.md` pair summary. |
| SEG-PS-DT | 0 | 2 | 0 | 2 | Reference bodies M12 and M19 (Minimum). Provenance: `45-1-evidence-workbook.md` frozen reference fields + `SPRINT-45-1-CLOSURE-REVIEW.md` pair summary. |
| SEG-PS-TP | 1* | 0* | 0 | 2 | Reference bodies M14 (Failed) and M22 boundary case. M22 historical split recorded as Minimum (Pass 2) / Failed (Inter-Rater); starred count reflects Inter-Rater-conjunctive convention used in 45-1 closure. Provenance: `45-1-evidence-workbook.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` (M22 boundary note). |

### C. Distribution Comparison Table

| Segment ID | Cohort profile summary | Reference profile summary | Shift descriptor | Evidence status |
| ---------- | ---------------------- | ------------------------- | ---------------- | --------------- |
| SEG-MRX-DT | 0/0/2 (Total 2) | 0/0/1 (Total 1) | Bounded alignment with Strong-profile reference; cohort includes paired BL+TR records on same target type. | populated |
| SEG-MRX-TP | 0/0/2 (Total 2) | 0/0/1 (Total 1) | Bounded alignment with Strong-profile reference; cohort includes paired BL+TR records on same target type. | populated |
| SEG-PS-DT | 0/2/2 (Total 4) | 0/2/0 (Total 2) | Bounded upward movement from Minimum-only reference profile to mixed Minimum/Strong cohort profile. | populated |
| SEG-PS-TP | 2/0/2 (Total 4) | 1*/0*/0 (Total 2, M22 boundary split noted) | Mixed profile remains boundary-sensitive on reference side due M22 historical split; cohort includes both Failed and Strong states. | populated |

---

## Domain-Comparison Tables

### A. Marx vs Photosynthesis (target types)

| Material type | Marx profile summary | Photosynthesis profile summary | Cross-domain interpretation notes |
| ------------- | -------------------- | ------------------------------ | --------------------------------- |
| `decision_table` | SEG-MRX-DT cohort distribution = Failed 0, Minimum 0, Strong 2 (Total 2). | SEG-PS-DT cohort distribution = Failed 0, Minimum 2, Strong 2 (Total 4). | Populated from Phase 3 segment/distribution evidence using target-type segment rows only. |
| `transfer_prompt` | SEG-MRX-TP cohort distribution = Failed 0, Minimum 0, Strong 2 (Total 2). | SEG-PS-TP cohort distribution = Failed 2, Minimum 0, Strong 2 (Total 4). | Populated from Phase 3 segment/distribution evidence using target-type segment rows only. |

### B. Generalisation / Overfit Interpretation Log

| Question | Evidence reference | Preliminary status | Notes |
| -------- | ------------------ | ------------------ | ----- |
| Generalisation beyond Marx? | Phase 2 pair-level rows (`DT-PS-A4`, `DT-PS-A6`, `TP-PS-A4`, `TP-PS-A6`) + Phase 3 segment/distribution rows (`SEG-PS-DT`, `SEG-PS-TP`) | evidence-populated | Evidence references entered for Phase 4 traceability; no Findings Summary synthesis performed. |
| Overfit-to-Marx risk signal? | Phase 2 pair-level rows (`DT-MRX-A4`, `TP-MRX-A4`) + Phase 3 segment/distribution rows (`SEG-MRX-DT`, `SEG-MRX-TP`, `SEG-PS-DT`, `SEG-PS-TP`) | evidence-populated | Evidence references entered for Phase 4 traceability; route/conclusion fields intentionally deferred to Phase 5. |

---

## Non-Target Regression Section

### A. Definition Lock

- Non-target in this workbook means material types not subject to SP-02/SP-03 injection.
- Same-run co-generation interpretation is out of scope unless separately authorised.

### B. Non-Target Assessment Table

| Non-target type | Baseline/reference expectation | Observed evidence | Regression indicator | Evidence status | Notes |
| --------------- | ------------------------------ | ----------------- | -------------------- | --------------- | ----- |
| Types outside `decision_table` / `transfer_prompt` in frozen benchmark corpus | Non-target definition is fixed by D3; benchmark corpus is authoritative source for those types. | Extracted 45.3 populated evidence remains DT/TP target-type scoped; no populated non-target body-level/segment-level verdict table exists in this workbook. | not-assessed (bounded) | partial | Strongest defensible state under existing populated evidence: non-target status remains partial; additional extraction from existing frozen corpus records would be required to advance without new data collection. |

### C. Data Sufficiency Note

| Field | Value |
| ----- | ----- |
| Non-target data sufficient for claim | [ ] yes [ ] no [x] partial |
| If partial/no, reason | Available populated evidence surfaces (Phase 2 body/pair + Phase 3 segment/distribution + Phase 4 domain table) are target-type scoped; non-target evidence can be bounded but not fully resolved without additional extraction from existing authoritative frozen-corpus records. |

---

## Findings Summary Section

Populate only after execution analysis is completed.

### A. Research Question Coverage

| Question | Answered (Y/N) | Evidence location | Notes |
| -------- | -------------- | ----------------- | ----- |
| Target-type distribution shift | Y | Body-Level, Pair-Level, Segment-Level, Distribution Tables A/C | Cohort-side distribution evidence is populated and traceable from Phase 2 to Phase 3 surfaces. |
| Cross-domain generalisation/overfit | Y (bounded) | Domain-Comparison Tables A/B + Phase 2 pair-level + Phase 3 segment/distribution references | Evidence-populated comparison exists for DT/TP across Marx and Photosynthesis; interpretation remains bounded to populated target-type evidence. |
| Non-target regression | Partial | Non-Target Regression Section B/C | Evidence status explicitly recorded as partial/not-assessed due target-type-scoped populated evidence surfaces. |

### B. Evidence Summary

```text
Evidence-supported synthesis (Phase 5):
- Phase 2 body/pair evidence is complete and provenance-linked to 45-1 authoritative artefacts.
- Phase 3 segment/distribution surfaces are populated for target-type segments.
- Phase 4 cross-domain tables and non-target status fields are populated.

Carried-forward limitations:
- Non-target regression evidence is status-only and partial under D3 because populated evidence surfaces are target-type scoped.

Unresolved questions:
- Full non-target regression determination remains unresolved under current populated evidence.
- Any stronger non-target claim requires bounded extraction from existing authoritative frozen non-target records.
```

### C. Open Issues

| Issue | Blocking recommendation? | Notes |
| ----- | ------------------------ | ----- |
| Non-target regression evidence partial/not-assessed | yes | D3 definition applied; available populated evidence remains target-type scoped. Additional extraction from existing frozen records needed for closure. |

---

## Workbook Completion Checklist

- [x] Input registers complete and locked.
- [x] Body-level records complete.
- [x] Pair-level section complete.
- [x] Segment-level section complete.
- [x] Distribution tables complete.
- [x] Domain-comparison tables complete.
- [x] Non-target regression section complete.
- [x] Findings summary drafted.

