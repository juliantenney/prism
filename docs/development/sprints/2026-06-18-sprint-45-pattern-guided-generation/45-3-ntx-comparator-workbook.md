# Sprint 45.3-NTX Comparator Workbook

**Experiment:** 45.3-NTX Non-Target Comparator Extension  
**Type:** Comparator register + body-level evaluation workbook  
**Status:** NTX-3 body-level evaluation populated  
**Authority:** `45-3-ntx-scope-addendum.md` · `45-3-ntx-execution-status.md`

**NTX-1 rule:** Populate register and provenance surfaces only. Do not populate verdict, FM judgement, ownership outcome, mimicry outcome, or regression outcome fields in NTX-1.

---

## A) Comparator Register (Frozen Slots)

| Comparator ID | Domain | Activity ID | Material ID | Material type | Inclusion status | Notes |
| ------------- | ------ | ----------- | ----------- | ------------- | ---------------- | ----- |
| NTX-TXT-MRX-A1 | Marx | A1 | M1 | `text` | included (frozen) | Cross-domain `text` lane. |
| NTX-TXT-PS-A1 | Photosynthesis | A1 | M1 | `text` | included (frozen) | Cross-domain `text` lane; calibration declaration required. |
| NTX-WE-MRX-A1 | Marx | A1 | M2 | `worked_example` | included (frozen) | Cross-domain `worked_example` lane; calibration declaration required. |
| NTX-WE-PS-A1 | Photosynthesis | A1 | M2 | `worked_example` | included (frozen) | Cross-domain `worked_example` lane. |
| NTX-CL-PS-A2 | Photosynthesis | A2 | M7 | `checklist` | included (frozen) | Single-domain checklist lane (first-pass policy). |

## B) Frozen-Reference Register

| Reference ID | Domain | Activity ID | Material ID | Material type | Frozen source path | Contract anchor section | Inclusion status |
| ------------ | ------ | ----------- | ----------- | ------------- | ------------------ | ----------------------- | ---------------- |
| REF-TXT-MRX-A1-M1 | Marx | A1 | M1 | `text` | `../2026-06-15-sprint-44/benchmark-corpus/marx/activity-materials.txt` | 44-2 §5.1 | included |
| REF-TXT-PS-A1-M1 | Photosynthesis | A1 | M1 | `text` | `../2026-06-15-sprint-44/benchmark-corpus/photosynthesis/learning-materials.txt` | 44-2 §5.1 | included |
| REF-WE-MRX-A1-M2 | Marx | A1 | M2 | `worked_example` | `../2026-06-15-sprint-44/benchmark-corpus/marx/activity-materials.txt` | 44-2 §5.2 | included |
| REF-WE-PS-A1-M2 | Photosynthesis | A1 | M2 | `worked_example` | `../2026-06-15-sprint-44/benchmark-corpus/photosynthesis/learning-materials.txt` | 44-2 §5.2 | included |
| REF-CL-PS-A2-M7 | Photosynthesis | A2 | M7 | `checklist` | `../2026-06-15-sprint-44/benchmark-corpus/photosynthesis/learning-materials.txt` | 44-2 §5.7 | included |

## C) Slot Mapping Table (Reference <-> Extension)

| Mapping ID | Comparator ID | Frozen Reference ID | Planned extension artefact ID | Planned extension artefact path | Mapping status |
| ---------- | ------------- | ------------------- | ----------------------------- | ------------------------------- | -------------- |
| MAP-NTX-01 | NTX-TXT-MRX-A1 | REF-TXT-MRX-A1-M1 | EXT-TXT-MRX-A1-M1 | `45-3-ntx-evidence/artefacts/EXT-TXT-MRX-A1-M1.txt` | captured (ntx-2) |
| MAP-NTX-02 | NTX-TXT-PS-A1 | REF-TXT-PS-A1-M1 | EXT-TXT-PS-A1-M1 | `45-3-ntx-evidence/artefacts/EXT-TXT-PS-A1-M1.txt` | captured (ntx-2) |
| MAP-NTX-03 | NTX-WE-MRX-A1 | REF-WE-MRX-A1-M2 | EXT-WE-MRX-A1-M2 | `45-3-ntx-evidence/artefacts/EXT-WE-MRX-A1-M2.txt` | captured (ntx-2) |
| MAP-NTX-04 | NTX-WE-PS-A1 | REF-WE-PS-A1-M2 | EXT-WE-PS-A1-M2 | `45-3-ntx-evidence/artefacts/EXT-WE-PS-A1-M2.txt` | captured (ntx-2) |
| MAP-NTX-05 | NTX-CL-PS-A2 | REF-CL-PS-A2-M7 | EXT-CL-PS-A2-M7 | `45-3-ntx-evidence/artefacts/EXT-CL-PS-A2-M7.txt` | captured (ntx-2) |

## D) Provenance Fields

### D1. Reference Provenance

| Field | Value |
| ----- | ----- |
| Frozen corpus authority | `../2026-06-15-sprint-44/benchmark-corpus/` |
| Reference material mapping source | Domain `design-learning-activities.json` + domain materials body file (`activity-materials.txt` / `learning-materials.txt`) |
| Contract authority source | `../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md` |

### D2. Extension Provenance (placeholders for NTX-2 capture)

| Field | Value |
| ----- | ----- |
| Extension run identifier | NTX-2-CAPTURE-2026-06-17-01 |
| Capture timestamp | 2026-06-17 |
| Capture operator record | agent session (NTX-2 minimal capture) |
| Artefact integrity check | 5/5 mapped extension artefact files present at mapped paths |

## E) Calibration Declaration Placeholders (mandatory)

| Calibration ID | Slot | Declaration required? | Declaration text | Status |
| -------------- | ---- | --------------------- | ---------------- | ------ |
| CAL-NTX-01 | NTX-TXT-PS-A1 (`text`, Photosynthesis M1) | yes | Position: Inter-Rater-consistent split-body interpretation for FM-07 handling. Exposition block can score Strong when connective teaching function is intact; FM-07 is recorded as channel contamination rather than automatic downgrade. | completed |
| CAL-NTX-02 | NTX-WE-MRX-A1 (`worked_example`, Marx M2) | yes | Position: Bridge-required Strong interpretation for NTX consistency. Without explicit parallel-task bridge ("use the same method on..."), score does not exceed Minimum; record FM-05. | completed |

---

## F) NTX-2 Extension Artefact Capture Records

| Capture ID | Comparator ID | Extension artefact ID | Extension artefact path | Linked frozen reference ID | Capture status | Capture notes |
| ---------- | ------------- | --------------------- | ----------------------- | -------------------------- | -------------- | ------------- |
| CAP-NTX-01 | NTX-TXT-MRX-A1 | EXT-TXT-MRX-A1-M1 | `45-3-ntx-evidence/artefacts/EXT-TXT-MRX-A1-M1.txt` | REF-TXT-MRX-A1-M1 | captured | NTX-2 generation capture completed; evaluation fields intentionally deferred. |
| CAP-NTX-02 | NTX-TXT-PS-A1 | EXT-TXT-PS-A1-M1 | `45-3-ntx-evidence/artefacts/EXT-TXT-PS-A1-M1.txt` | REF-TXT-PS-A1-M1 | captured | NTX-2 generation capture completed; evaluation fields intentionally deferred. |
| CAP-NTX-03 | NTX-WE-MRX-A1 | EXT-WE-MRX-A1-M2 | `45-3-ntx-evidence/artefacts/EXT-WE-MRX-A1-M2.txt` | REF-WE-MRX-A1-M2 | captured | NTX-2 generation capture completed; evaluation fields intentionally deferred. |
| CAP-NTX-04 | NTX-WE-PS-A1 | EXT-WE-PS-A1-M2 | `45-3-ntx-evidence/artefacts/EXT-WE-PS-A1-M2.txt` | REF-WE-PS-A1-M2 | captured | NTX-2 generation capture completed; evaluation fields intentionally deferred. |
| CAP-NTX-05 | NTX-CL-PS-A2 | EXT-CL-PS-A2-M7 | `45-3-ntx-evidence/artefacts/EXT-CL-PS-A2-M7.txt` | REF-CL-PS-A2-M7 | captured | NTX-2 generation capture completed; evaluation fields intentionally deferred. |

---

## NTX-1 Guardrail Checklist

- [x] Comparator register populated.
- [x] Frozen-reference register populated.
- [x] Slot mapping table populated.
- [x] Provenance fields populated/placeheld.
- [x] Calibration placeholders created.
- [x] NTX-2 capture records populated without evaluation fields.
- [x] No verdict/regression fields populated.

---

## G) NTX-3 Body-Level Evaluation Records

NTX-3 scope note: body-level fields only. No regression indicators, no type-level rollups, and no aggregate judgement populated in this section.

| Eval ID | Comparator ID | Extension artefact ID | Evaluation authority (contract section) | Reference comparator | L1 verdict | Relevant FM flags | Ownership pass/regression | Mimicry suspect | Superficial-match applicability | Evaluation notes | Provenance |
| ------- | ------------- | --------------------- | --------------------------------------- | -------------------- | ---------- | ----------------- | ------------------------- | --------------- | ------------------------------- | ---------------- | ---------- |
| EVAL-NTX-01 | NTX-TXT-MRX-A1 | EXT-TXT-MRX-A1-M1 | 44-2 §5.1 `text` | REF-TXT-MRX-A1-M1 | Strong | FM-07 absent; no §5.1 failure mode triggered | pass / no regression | no | not applicable | Substantive connective exposition links multiple Marx concepts with clear intellectual progression and learner-facing teaching tone; not task-instruction duplication. | Contract: `../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md` §5.1; Artefact: `45-3-ntx-evidence/artefacts/EXT-TXT-MRX-A1-M1.txt` |
| EVAL-NTX-02 | NTX-TXT-PS-A1 | EXT-TXT-PS-A1-M1 | 44-2 §5.1 `text` + CAL-NTX-01 | REF-TXT-PS-A1-M1 | Strong | FM-07 absent in extension body; no §5.1 failure mode triggered | pass / no regression | no | not applicable | Connective exposition shows equation-to-process progression and explicit matter/energy linkage; calibration declaration applied to maintain split-handling consistency with Sprint 44 precedent. | Contract: `../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md` §5.1; Artefact: `45-3-ntx-evidence/artefacts/EXT-TXT-PS-A1-M1.txt`; Calibration: CAL-NTX-01 |
| EVAL-NTX-03 | NTX-WE-MRX-A1 | EXT-WE-MRX-A1-M2 | 44-2 §5.2 `worked_example` + CAL-NTX-02 | REF-WE-MRX-A1-M2 | Minimum | FM-05 present (no explicit parallel-task bridge); no §5.2 failed-floor mode triggered | pass / no regression | no | not applicable | Ordered steps with visible reasoning and completed instance satisfy minimum. Under bridge-required declaration, Strong not assigned because no explicit "use same method on learner task" instruction is present. | Contract: `../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md` §5.2; Artefact: `45-3-ntx-evidence/artefacts/EXT-WE-MRX-A1-M2.txt`; Calibration: CAL-NTX-02 |
| EVAL-NTX-04 | NTX-WE-PS-A1 | EXT-WE-PS-A1-M2 | 44-2 §5.2 `worked_example` | REF-WE-PS-A1-M2 | Minimum | FM-05 present (no explicit parallel-task bridge); no §5.2 failed-floor mode triggered | pass / no regression | no | not applicable | Stepwise worked example is complete and reasoned, but lacks explicit bridge from model to learner's parallel task; therefore remains at minimum under locked NTX calibration stance. | Contract: `../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md` §5.2; Artefact: `45-3-ntx-evidence/artefacts/EXT-WE-PS-A1-M2.txt` |
| EVAL-NTX-05 | NTX-CL-PS-A2 | EXT-CL-PS-A2-M7 | 44-2 §5.7 `checklist` | REF-CL-PS-A2-M7 | Minimum | FM-11 threshold-only signal present (no grouped sections / misconception guard); no §5.7 failure mode triggered | pass / no regression | no | not applicable | Checklist has >=4 checkable, criteria-linked items and revise instruction, meeting minimum. Strong-only signals are partial, so verdict remains minimum at body level. | Contract: `../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md` §5.7; Artefact: `45-3-ntx-evidence/artefacts/EXT-CL-PS-A2-M7.txt` |

---

## H) Calibration Declaration Detail Record

### CAL-NTX-01 — Photosynthesis M1 `text`

| Field | Value |
| ----- | ----- |
| Interpretation position | Inter-Rater-consistent split-body interpretation: FM-07 contamination is recorded but does not automatically force Minimum when exposition function is strong. |
| Rationale | Sprint 44 precedent shows Pass-1/Inter-Rater split on Photosynthesis M1; this declaration prevents ad hoc switching and allows explicit FM-07 channel recording while judging exposition quality on §5.1 criteria. |
| Implications for scoring consistency | Photosynthesis `text` bodies with strong connective exposition can score Strong if §5.1 strong signals are present; FM-07 is still logged as a quality-channel note. |

### CAL-NTX-02 — Marx M2 `worked_example`

| Field | Value |
| ----- | ----- |
| Interpretation position | Bridge-required Strong interpretation: absence of explicit parallel-task bridge blocks Strong in §5.2 scoring. |
| Rationale | Sprint 44 recorded Strong/Minimum split on Marx M2 tied to FM-05 weighting; freezing bridge-required interpretation stabilises cross-lane comparability in NTX. |
| Implications for scoring consistency | `worked_example` bodies without explicit method-transfer bridge score Minimum (assuming minimum floor met), with FM-05 recorded consistently across Marx/Photosynthesis lanes. |

---

## I) NTX-4 Reference Profile Extraction

| Ref Profile ID | Comparator ID | Frozen reference ID | Reference verdict/profile | Calibration applied | Reference provenance |
| -------------- | ------------- | ------------------- | ------------------------- | ------------------ | ------------------- |
| RPE-NTX-01 | NTX-TXT-MRX-A1 | REF-TXT-MRX-A1-M1 | Strong (consensus reference profile) | not required | `sprint-44-review.md` (Marx M1 key Strong exemplar); `patterns/SP-01-TEXT-SP-01-connective-exposition-prose.md` (Marx M1 Strong, Pass 1 + Inter-Rater) |
| RPE-NTX-02 | NTX-TXT-PS-A1 | REF-TXT-PS-A1-M1 | Strong (calibrated reference under CAL-NTX-01 split-handling position) | CAL-NTX-01 | `patterns/SP-01-TEXT-SP-01-connective-exposition-prose.md` (Photosynthesis M1 Pass 1 Minimum / Inter-Rater Strong split; declaration-locked handling) |
| RPE-NTX-03 | NTX-WE-MRX-A1 | REF-WE-MRX-A1-M2 | Minimum (calibrated reference under CAL-NTX-02 bridge-required Strong rule) | CAL-NTX-02 | `patterns/SP-06-WE-SP-01-visible-reasoning-worked-example.md` (Marx M2 Pass 1 Strong / Inter-Rater Minimum split; bridge-required declaration applied) |
| RPE-NTX-04 | NTX-WE-PS-A1 | REF-WE-PS-A1-M2 | Minimum (stable cross-pass profile) | not required | `patterns/SP-06-WE-SP-01-visible-reasoning-worked-example.md` (Photosynthesis M2 Minimum in all passes) |
| RPE-NTX-05 | NTX-CL-PS-A2 | REF-CL-PS-A2-M7 | Minimum (stable checklist profile) | not required | `patterns/SP-05-CL-SP-01-criteria-linked-verification-checklist.md` (Photosynthesis M7 Minimum in Pass 2 + Inter-Rater) |

---

## J) NTX-4 Lane-Level Comparator Analysis

Lane-level rule: indicator set must be exactly one of `none` / `possible` / `confirmed` / `inconclusive`.

| Lane Compare ID | Comparator ID | Reference verdict | Extension verdict | Reference FM profile | Extension FM profile | Ownership comparison | Mimicry comparison | Lane-level indicator | Rationale | Provenance |
| --------------- | ------------- | ----------------- | ----------------- | -------------------- | -------------------- | -------------------- | ------------------ | -------------------- | --------- | ---------- |
| CMP-NTX-01 | NTX-TXT-MRX-A1 | Strong | Strong | No primary `text` failure mode required for reference Strong | FM-07 absent; no §5.1 failure mode triggered | pass -> pass (no regression) | no -> no | none | Extension matches calibrated Strong reference profile; no FM or ownership degradation observed at lane level. | RPE-NTX-01 + EVAL-NTX-01 |
| CMP-NTX-02 | NTX-TXT-PS-A1 | Strong (CAL-NTX-01 applied) | Strong | Split-profile resolved by declaration; FM-07 channel may be recorded separately in historical reference context | FM-07 absent; no §5.1 failure mode triggered | pass -> pass (no regression) | no -> no | none | Under locked CAL-NTX-01 interpretation, extension is aligned to calibrated Strong reference and shows no degradation signal. | RPE-NTX-02 + EVAL-NTX-02 + CAL-NTX-01 |
| CMP-NTX-03 | NTX-WE-MRX-A1 | Minimum (CAL-NTX-02 applied) | Minimum | FM-05 may be present under bridge-required interpretation | FM-05 present | pass -> pass (no regression) | no -> no | none | With CAL-NTX-02 bridge-required policy, extension equals calibrated reference band (Minimum) and does not introduce additional regression signal. | RPE-NTX-03 + EVAL-NTX-03 + CAL-NTX-02 |
| CMP-NTX-04 | NTX-WE-PS-A1 | Minimum | Minimum | FM-05 present in reference precedent | FM-05 present | pass -> pass (no regression) | no -> no | none | Extension reproduces stable reference profile (Minimum + FM-05) without evidence of deterioration. | RPE-NTX-04 + EVAL-NTX-04 |
| CMP-NTX-05 | NTX-CL-PS-A2 | Minimum | Minimum | FM-11 threshold-only checklist pattern in reference precedent | FM-11 threshold-only signal present | pass -> pass (no regression) | no -> no | none | Extension remains aligned with reference checklist minimum profile and shows no ownership/mimicry regression signal. | RPE-NTX-05 + EVAL-NTX-05 |

---

## K) NTX-4 Type-Level Rollups

| Type Rollup ID | Material type | Lanes included | Evidence sufficiency | Regression status | Rationale |
| -------------- | ------------- | -------------- | -------------------- | ----------------- | --------- |
| TR-NTX-01 | `text` | NTX-TXT-MRX-A1, NTX-TXT-PS-A1 | sufficient (bounded) | none | Both domain lanes complete with calibrated reference extraction and lane-level indicator `none`; no FM/ownership/mimicry deterioration signal observed. |
| TR-NTX-02 | `worked_example` | NTX-WE-MRX-A1, NTX-WE-PS-A1 | sufficient (bounded) | none | Both lanes remain at calibrated/stable Minimum reference profile with FM-05 consistency and no downward movement or ownership regression. |
| TR-NTX-03 | `checklist` | NTX-CL-PS-A2 | sufficient (bounded single-domain lane per frozen policy) | none | Single-domain checklist lane required by NTX-0 policy is complete; extension matches stable reference Minimum profile without added regression signal. |

---

## L) NTX-4 Overall Non-Target Assessment

| Field | Value |
| ----- | ----- |
| Evidence sufficiency status | sufficient (bounded NTX sample per frozen sufficiency criteria) |
| Overall non-target regression status | none |
| Status rationale | All five lane-level indicators are `none`, type-level rollups are complete for frozen sampled types/domains, and no ownership/mimicry deterioration or calibrated-band drop is observed. |

## M) Blocker Review (45.3 non-target partial/not-assessed)

| Field | Value |
| ----- | ----- |
| Original blocker | non-target regression partial/not-assessed |
| Blocker state after NTX-4 | closed |
| Rationale | NTX-4 converted prior status-only non-target channel into comparator-backed, provenance-complete lane/type evidence under frozen scope; overall non-target regression status is `none` with sufficient bounded evidence. |
