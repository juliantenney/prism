# 45.2 Agreement Analysis Report Template

**Experiment:** 45-2 Pattern-Aware Evaluation Repeatability Study  
**Report type:** E0 vs E1 agreement analysis — template only  
**Status:** Not populated — awaiting Phase 4 execution  
**Authority:** [SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md](SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md) · [SPRINT-45-2-EXECUTION-PLAN.md](SPRINT-45-2-EXECUTION-PLAN.md) · [45-2-pattern-aware-evaluation-protocol.md](45-2-pattern-aware-evaluation-protocol.md) · [45-2-evidence-workbook.md](45-2-evidence-workbook.md)

**Non-goals:** Findings · scoring · recommendation · protocol changes · design changes

**Prerequisite:** Blind gate opened after E1 completes all fourteen body evaluations per protocol.

---

## Report Header

| Field | Value |
| ----- | ----- |
| **Report ID** | 45-2-agreement-analysis |
| **Protocol version** | |
| **Protocol file** | `45-2-pattern-aware-evaluation-protocol.md` |
| **Workbook version / date** | |
| **Workbook file** | `45-2-evidence-workbook.md` |
| **E0 reference** | `45-1-evidence-workbook.md` |
| **E0 evaluator code** | E0 |
| **E1 evaluator code** | |
| **E2 adjudicator code** | |
| **E1b second independent code** | |
| **Blind status at analysis** | [ ] blind maintained until E1 complete  [ ] blind gate opened |
| **Blind gate opened** | |
| **Analysis completion date** | |
| **Analyst role** | |

---

## Executive Summary

```text

```

---

## Evaluation Coverage

| Metric | Target | Actual | Complete |
| ------ | ------ | ------ | -------- |
| **Bodies evaluated (E1)** | 14 | | [ ] |
| **45.1 paired bodies** | 12 | | [ ] |
| **Holdout bodies** | 2 | | [ ] |
| **Pairs classified (E1)** | 6 | | [ ] |
| **Boundary exercise B1 (TP-PS-A6)** | 1 | | [ ] |
| **Boundary exercise B2 (HO-TP-01)** | 1 | | [ ] |
| **Agreement analysis — paired bodies** | 12 | | [ ] |
| **Holdout per-body review** | 2 | | [ ] |

### Body inventory

| Artefact ID | Type | E1 complete | Included in verdict agreement |
| ----------- | ---- | ----------- | ----------------------------- |
| BL-DT-MRX-A4 | 45.1 paired | [ ] | [ ] yes |
| TR-DT-MRX-A4 | 45.1 paired | [ ] | [ ] yes |
| BL-DT-PS-A4 | 45.1 paired | [ ] | [ ] yes |
| TR-DT-PS-A4 | 45.1 paired | [ ] | [ ] yes |
| BL-DT-PS-A6 | 45.1 paired | [ ] | [ ] yes |
| TR-DT-PS-A6 | 45.1 paired | [ ] | [ ] yes |
| BL-TP-MRX-A4 | 45.1 paired | [ ] | [ ] yes |
| TR-TP-MRX-A4 | 45.1 paired | [ ] | [ ] yes |
| BL-TP-PS-A4 | 45.1 paired | [ ] | [ ] yes |
| TR-TP-PS-A4 | 45.1 paired | [ ] | [ ] yes |
| BL-TP-PS-A6 | 45.1 paired | [ ] | [ ] yes |
| TR-TP-PS-A6 | 45.1 paired | [ ] | [ ] yes |
| HO-DT-01 | Holdout | [ ] | [ ] n/a — E1 only |
| HO-TP-01 | Holdout | [ ] | [ ] n/a — E1 only |

---

## Verdict Agreement

*Twelve paired bodies — exact tier match (Failed / Minimum / Strong). Holdouts excluded — no E0 reference.*

### Aggregate

| Metric | Value | Threshold reference |
| ------ | ----- | ------------------- |
| **Exact verdict matches** | /12 | S4: ≥10/12 |
| **Verdict mismatches** | | |
| **Incompatible verdicts without resolvable boundary** | | F2: ≥3 |

### Per-body verdict table

| Artefact ID | Pair | E0 verdict | E1 verdict | Agreement | Notes |
| ----------- | ---- | ---------- | ---------- | ----------- | ----- |
| BL-DT-MRX-A4 | DT-MRX-A4 | | | [ ] match  [ ] mismatch | |
| TR-DT-MRX-A4 | DT-MRX-A4 | | | [ ] match  [ ] mismatch | |
| BL-DT-PS-A4 | DT-PS-A4 | | | [ ] match  [ ] mismatch | |
| TR-DT-PS-A4 | DT-PS-A4 | | | [ ] match  [ ] mismatch | |
| BL-DT-PS-A6 | DT-PS-A6 | | | [ ] match  [ ] mismatch | |
| TR-DT-PS-A6 | DT-PS-A6 | | | [ ] match  [ ] mismatch | |
| BL-TP-MRX-A4 | TP-MRX-A4 | | | [ ] match  [ ] mismatch | |
| TR-TP-MRX-A4 | TP-MRX-A4 | | | [ ] match  [ ] mismatch | |
| BL-TP-PS-A4 | TP-PS-A4 | | | [ ] match  [ ] mismatch | |
| TR-TP-PS-A4 | TP-PS-A4 | | | [ ] match  [ ] mismatch | |
| BL-TP-PS-A6 | TP-PS-A6 | | | [ ] match  [ ] mismatch | |
| TR-TP-PS-A6 | TP-PS-A6 | | | [ ] match  [ ] mismatch | |

### Holdout verdicts (E1 only — no E0 comparison)

| Artefact ID | E1 verdict | Notes |
| ----------- | ---------- | ----- |
| HO-DT-01 | | |
| HO-TP-01 | | |

---

## Pair Classification Agreement

*Primary repeatability measure — six pairs.*

### Aggregate

| Metric | Value | Threshold reference |
| ------ | ----- | ------------------- |
| **Pair classification matches** | /6 | S3: ≥5/6 |
| **Pair classification mismatches** | | F1: ≤3/6 |
| **Classification inversions (Improvement ↔ No Change)** | | F7: ≥2 with ≤3/6 |
| **Signal-only Improvement pairs (E1)** | | S5: 0 |

### Per-pair table

| Pair ID | E0 classification | E1 classification | Agreement | Notes |
| ------- | ------------------ | ----------------- | ----------- | ----- |
| DT-MRX-A4 | | | [ ] match  [ ] mismatch | |
| DT-PS-A4 | | | [ ] match  [ ] mismatch | |
| DT-PS-A6 | | | [ ] match  [ ] mismatch | |
| TP-MRX-A4 | | | [ ] match  [ ] mismatch | |
| TP-PS-A4 | | | [ ] match  [ ] mismatch | |
| TP-PS-A6 | | | [ ] match  [ ] mismatch | |

### E1 pair synthesis fields (reference)

| Pair ID | E1 baseline verdict | E1 treatment verdict | E1 verdict delta | Target FM absent (treatment) | E1 per-output success |
| ------- | ------------------- | -------------------- | ---------------- | ---------------------------- | --------------------- |
| DT-MRX-A4 | | | | | |
| DT-PS-A4 | | | | | |
| DT-PS-A6 | | | | | |
| TP-MRX-A4 | | | | | |
| TP-PS-A4 | | | | | |
| TP-PS-A6 | | | | | |

---

## Layer Agreement Analysis

*Twelve paired bodies unless noted. Agreement types: exact match · compatible · incompatible · n/a.*

### Layer 1 — Contract Verdict

| Metric | Value |
| ------ | ----- |
| **Exact matches** | /12 |
| **Mismatches** | |
| **Mismatched artefact IDs** | |

| Artefact ID | E0 verdict | E1 verdict | Agreement | Boundary resolved | Notes |
| ----------- | ---------- | ---------- | ----------- | ----------------- | ----- |
| BL-DT-MRX-A4 | | | | [ ] yes  [ ] no  [ ] n/a | |
| TR-DT-MRX-A4 | | | | [ ] yes  [ ] no  [ ] n/a | |
| BL-DT-PS-A4 | | | | [ ] yes  [ ] no  [ ] n/a | |
| TR-DT-PS-A4 | | | | [ ] yes  [ ] no  [ ] n/a | |
| BL-DT-PS-A6 | | | | [ ] yes  [ ] no  [ ] n/a | |
| TR-DT-PS-A6 | | | | [ ] yes  [ ] no  [ ] n/a | |
| BL-TP-MRX-A4 | | | | [ ] yes  [ ] no  [ ] n/a | |
| TR-TP-MRX-A4 | | | | [ ] yes  [ ] no  [ ] n/a | |
| BL-TP-PS-A4 | | | | [ ] yes  [ ] no  [ ] n/a | |
| TR-TP-PS-A4 | | | | [ ] yes  [ ] no  [ ] n/a | |
| BL-TP-PS-A6 | | | | [ ] yes  [ ] no  [ ] n/a | |
| TR-TP-PS-A6 | | | | [ ] yes  [ ] no  [ ] n/a | |

---

### Layer 2 — Detection Signals

| Metric | Value |
| ------ | ----- |
| **Signal profile compatible** | /12 |
| **Signal profile incompatible** | |
| **Superficial-match flag matches** | /12 |
| **Superficial-match mismatches** | |

| Artefact ID | E0 signal profile | E1 signal profile | E0 superficial_match | E1 superficial_match | Agreement | Notes |
| ----------- | ----------------- | ----------------- | -------------------- | -------------------- | ----------- | ----- |
| BL-DT-MRX-A4 | | | | | | |
| TR-DT-MRX-A4 | | | | | | |
| BL-DT-PS-A4 | | | | | | |
| TR-DT-PS-A4 | | | | | | |
| BL-DT-PS-A6 | | | | | | |
| TR-DT-PS-A6 | | | | | | |
| BL-TP-MRX-A4 | | | | | | |
| TR-TP-MRX-A4 | | | | | | |
| BL-TP-PS-A4 | | | | | | |
| TR-TP-PS-A4 | | | | | | |
| BL-TP-PS-A6 | | | | | | |
| TR-TP-PS-A6 | | | | | | |

**Verdict-first check (S5)**

| Check | Result |
| ----- | ------ |
| E1 pairs classified Improvement without verdict rise | |
| Signal/verdict divergence count (treatments) | |
| **S5 pass** | [ ] yes  [ ] no |

---

### Layer 3 — Failure Modes

| Metric | Value |
| ------ | ----- |
| **Target FM agreement** | /12 |
| **Target FM mismatches** | |
| **Capture channel (FM-01/FM-12) agreement** | /12 |

| Artefact ID | Material type | E0 target FM(s) | E1 target FM(s) | Agreement | Notes |
| ----------- | ------------- | --------------- | --------------- | ----------- | ----- |
| BL-DT-MRX-A4 | DT | FM-04 | | | |
| TR-DT-MRX-A4 | DT | FM-04 | | | |
| BL-DT-PS-A4 | DT | FM-04 | | | |
| TR-DT-PS-A4 | DT | FM-04 | | | |
| BL-DT-PS-A6 | DT | FM-04 | | | |
| TR-DT-PS-A6 | DT | FM-04 | | | |
| BL-TP-MRX-A4 | TP | FM-02, FM-03 | | | |
| TR-TP-MRX-A4 | TP | FM-02, FM-03 | | | |
| BL-TP-PS-A4 | TP | FM-02, FM-03 | | | |
| TR-TP-PS-A4 | TP | FM-02, FM-03 | | | |
| BL-TP-PS-A6 | TP | FM-02, FM-03 | | | |
| TR-TP-PS-A6 | TP | FM-02, FM-03 | | | |

---

### Layer 4 — Ownership Audit

| Metric | Value |
| ------ | ----- |
| **Ownership pass agreement** | /12 |
| **Ownership regression agreement** | /12 |
| **Mismatches** | |

| Artefact ID | E0 ownership pass | E1 ownership pass | E0 regression | E1 regression | Agreement | Notes |
| ----------- | ----------------- | ----------------- | ------------- | ------------- | ----------- | ----- |
| BL-DT-MRX-A4 | | | | | | |
| TR-DT-MRX-A4 | | | | | | |
| BL-DT-PS-A4 | | | | | | |
| TR-DT-PS-A4 | | | | | | |
| BL-DT-PS-A6 | | | | | | |
| TR-DT-PS-A6 | | | | | | |
| BL-TP-MRX-A4 | | | | | | |
| TR-TP-MRX-A4 | | | | | | |
| BL-TP-PS-A4 | | | | | | |
| TR-TP-PS-A4 | | | | | | |
| BL-TP-PS-A6 | | | | | | |
| TR-TP-PS-A6 | | | | | | |

---

### Layer 5 — Anti-Mimicry

| Metric | Value |
| ------ | ----- |
| **Mimicry suspect agreement** | /12 |
| **Mismatches** | |

| Artefact ID | E0 mimicry suspect | E1 mimicry suspect | E0 proximity | E1 proximity | Agreement | Notes |
| ----------- | ------------------ | ------------------ | ------------ | ------------ | ----------- | ----- |
| BL-DT-MRX-A4 | | | | | | |
| TR-DT-MRX-A4 | | | | | | |
| BL-DT-PS-A4 | | | | | | |
| TR-DT-PS-A4 | | | | | | |
| BL-DT-PS-A6 | | | | | | |
| TR-DT-PS-A6 | | | | | | |
| BL-TP-MRX-A4 | | | | | | |
| TR-TP-MRX-A4 | | | | | | |
| BL-TP-PS-A4 | | | | | | |
| TR-TP-PS-A4 | | | | | | |
| BL-TP-PS-A6 | | | | | | |
| TR-TP-PS-A6 | | | | | | |

**Holdout anti-mimicry (E1 only)**

| Artefact ID | E1 mimicry suspect | Notes |
| ----------- | ------------------ | ----- |
| HO-DT-01 | | |
| HO-TP-01 | | |

---

### Layer 6 — Boundary Declaration

| Metric | Value |
| ------ | ----- |
| **Bodies requiring boundary** | |
| **Declaration compatibility (paired bodies)** | |
| **global_calibration_reopened = yes on any record** | [ ] yes  [ ] no — must be no |

| Artefact ID | E0 boundary applicable | E1 boundary applicable | E0 declaration summary | E1 declaration summary | Agreement | Notes |
| ----------- | ---------------------- | ---------------------- | ---------------------- | ---------------------- | ----------- | ----- |
| BL-TP-PS-A6 | | | | | | |
| TR-TP-PS-A6 | | | | | | |
| HO-TP-01 | n/a | | n/a | | n/a | |

*See § Boundary Exercise Review for B1 and B2 detail.*

---

### Layer 7 — Convergent Judgement

| Metric | Value |
| ------ | ----- |
| **Pair classification agreement** | /6 |
| **Convergent evidence flag agreement (Improvement pairs)** | |
| **Per-output success agreement (treatments)** | /6 |

| Pair ID | E0 pair classification | E1 pair classification | E0 convergent met | E1 convergent met | E0 per-output success | E1 per-output success | Agreement | Notes |
| ------- | ------------------------ | ------------------------ | ----------------- | ----------------- | --------------------- | --------------------- | ----------- | ----- |
| DT-MRX-A4 | | | | | | | | |
| DT-PS-A4 | | | | | | | | |
| DT-PS-A6 | | | | | | | | |
| TP-MRX-A4 | | | | | | | | |
| TP-PS-A4 | | | | | | | | |
| TP-PS-A6 | | | | | | | | |

**Disqualifier path application log**

| Disqualifier | Applied on all relevant bodies | Any E0/E1 mismatch | Notes |
| ------------ | -------------------------------- | ------------------ | ----- |
| Ownership regression | [ ] yes  [ ] no | | |
| Mimicry suspect | [ ] yes  [ ] no | | |
| Superficial match | [ ] yes  [ ] no | | |

---

## Boundary Exercise Review

### B1 — TP-PS-A6

| Field | E0 | E1 |
| ----- | -- | -- |
| **Touchpoint** | B1 | B1 |
| **Pair** | TP-PS-A6 | TP-PS-A6 |
| **Ambiguity flag** | | |
| **Calibration reference** | | |
| **Declared interpretation** | | |
| **Declaration before verdict** | | |
| **Global calibration reopened** | | |
| **Verdict baseline** | | |
| **Verdict treatment** | | |
| **Pair classification** | | |

| Field | Value |
| ----- | ----- |
| **Agreement status** | [ ] compatible  [ ] incompatible  [ ] n/a |
| **Impact on verdict** | |
| **Impact on classification** | |
| **Impact notes** | |

```text

```

---

### B2 — HO-TP-01

| Field | E0 | E1 |
| ----- | -- | -- |
| **Touchpoint** | B2 | B2 |
| **Artefact** | n/a — holdout | HO-TP-01 |
| **Corpus reference** | M22 | M22 |
| **Ambiguity flag** | n/a | |
| **Calibration reference** | n/a | |
| **Declared interpretation** | n/a | |
| **Declaration before verdict** | n/a | |
| **Global calibration reopened** | n/a | |
| **Verdict under declaration** | n/a | |

| Field | Value |
| ----- | ----- |
| **Agreement status** | [ ] E1 procedure compliant  [ ] non-compliant |
| **Impact on verdict** | |
| **Impact on classification** | n/a — single body |
| **Impact notes** | |
| **Frozen M22 records altered** | [ ] no  [ ] yes — must be no |

```text

```

---

## Disagreement Register

*One row per disagreement. Layer attribution required.*

### Verdict disagreements

| # | Artefact ID | E0 verdict | E1 verdict | Tier delta | Boundary resolvable | Layer | Notes | Resolution |
| - | ----------- | ---------- | ---------- | ---------- | ------------------- | ----- | ----- | ---------- |
| 1 | | | | | [ ] yes  [ ] no | L1 | | |
| 2 | | | | | [ ] yes  [ ] no | L1 | | |
| 3 | | | | | [ ] yes  [ ] no | L1 | | |

### Classification disagreements

| # | Pair ID | E0 classification | E1 classification | Inversion (Imp ↔ NC) | Layer | Notes | Resolution |
| - | ------- | ----------------- | ----------------- | -------------------- | ----- | ----- | ---------- |
| 1 | | | | [ ] yes  [ ] no | L7 | | |
| 2 | | | | [ ] yes  [ ] no | L7 | | |

### Layer disagreements

| # | Artefact ID | Layer | E0 value | E1 value | Affects pair outcome | Notes | Resolution |
| - | ----------- | ----- | -------- | -------- | -------------------- | ----- | ---------- |
| 1 | | L2 | | | [ ] yes  [ ] no | | |
| 2 | | L3 | | | [ ] yes  [ ] no | | |
| 3 | | L4 | | | [ ] yes  [ ] no | | |
| 4 | | L5 | | | [ ] yes  [ ] no | | |
| 5 | | L6 | | | [ ] yes  [ ] no | | |

### Boundary disagreements

| # | Touchpoint | Issue | E0 position | E1 position | Notes | Resolution |
| - | ---------- | ----- | ----------- | ----------- | ----- | ---------- |
| 1 | B1 | | | | | |
| 2 | B2 | | | | | |

### Utility assessment (F6 / S9 input)

| Field | Value |
| ----- | ----- |
| **Total material disagreements** | |
| **Resolvable under protocol** | [ ] yes  [ ] no  [ ] partial |
| **Irreducible intuition reported** | [ ] yes  [ ] no |
| **Utility sufficient for research gate** | [ ] yes  [ ] no  [ ] borderline |

---

## Success Criteria Review

*Mandatory — all S1–S9 required for proceed-to-45.3 input. Do not assess until analysis complete.*

| ID | Criterion | Threshold | Result | Evidence reference |
| -- | --------- | --------- | ------ | ------------------ |
| **S1** | Protocol exists covering L1–L7 without 44-2/44-3 modification | Protocol file | [ ] met  [ ] not_met | |
| **S2** | Independent application complete — 12 + 2 holdouts full stack | 14/14 bodies | [ ] met  [ ] not_met | |
| **S3** | Pair classification concordance | ≥5/6 | [ ] met  [ ] not_met | § Pair Classification Agreement |
| **S4** | Verdict concordance (paired bodies) | ≥10/12 | [ ] met  [ ] not_met | § Verdict Agreement |
| **S5** | No systematic signal override | 0 signal-only Improvement | [ ] met  [ ] not_met | § Layer 2 |
| **S6** | Ownership and anti-mimicry traceable on all 14 bodies | No blank/ad hoc | [ ] met  [ ] not_met | § L4, L5 |
| **S7** | Boundary exercise complete B1 + B2; no global reopening | Both touchpoints | [ ] met  [ ] not_met | § Boundary Exercise Review |
| **S8** | Holdouts evaluated | HO-DT-01 + HO-TP-01 | [ ] met  [ ] not_met | § Evaluation Coverage |
| **S9** | Disagreements documented and resolvable | Utility sufficient | [ ] met  [ ] not_met | § Disagreement Register |

### Strong support (record only — not required for S pass)

| Criterion | Result | Notes |
| --------- | ------ | ----- |
| Perfect pair concordance (6/6) | [ ] yes  [ ] no | |
| Perfect verdict concordance (12/12) | [ ] yes  [ ] no | |
| Superficial-match discrimination observed | [ ] yes  [ ] no | |
| Disqualifier path documentation complete | [ ] yes  [ ] no | |

---

## Failure Criteria Review

*Any F1–F7 triggered → stop input. Do not assess until analysis complete.*

| ID | Condition | Threshold | Triggered | Evidence reference |
| -- | --------- | --------- | --------- | ------------------ |
| **F1** | Pair concordance ≤3/6 | ≤3/6 matches | [ ] yes  [ ] no | § Pair Classification Agreement |
| **F2** | ≥3 incompatible verdicts without resolvable boundary | ≥3 bodies | [ ] yes  [ ] no | § Verdict Agreement; § Disagreement Register |
| **F3** | Systematic signal/verdict divergence | ≥2 bodies or signal-only Improvement | [ ] yes  [ ] no | § Layer 2 |
| **F4** | E1 Improvement where superficial-match should block | Per protocol | [ ] yes  [ ] no | § Layer 2; § Disagreement Register |
| **F5** | Ownership/anti-mimicry not operationalisable | Irreducible intuition | [ ] yes  [ ] no | § L4, L5 |
| **F6** | Disagreement exceeds utility | No resolution path | [ ] yes  [ ] no | § Disagreement Register |
| **F7** | ≤3/6 pair concordance AND ≥2 Improvement ↔ No Change inversions | Combined | [ ] yes  [ ] no | § Pair Classification Agreement |

---

## Inconclusive Criteria Review

*Borderline outcomes — repeat input. Do not assess until S/F review complete.*

| ID | Condition | Applicable | Triggered | Notes |
| -- | --------- | ---------- | --------- | ----- |
| **I1** | Pair concordance 4/6 | | [ ] yes  [ ] no | |
| **I2** | Verdict concordance 9/12 with S3 met | | [ ] yes  [ ] no | |
| **I3** | Single pair discordance solely on boundary declaration | | [ ] yes  [ ] no | |
| **I4** | Holdout evaluation incomplete | | [ ] yes  [ ] no | |
| **I5** | No superficial-match case; all else met | | [ ] yes  [ ] no | |
| **I6** | E1b disagrees with E1 on ≥3 bodies | | [ ] yes  [ ] no  [ ] n/a | |
| **I7** | Procedural flaw — blind broken or protocol incomplete | | [ ] yes  [ ] no | |

### Open unknowns (repeatability analysis)

```text

```

---

## Recommendation Input Summary

*Inputs for `45-2-recommendation.md` — no routing decision in this report.*

### Proceed evidence (45.3)

| Requirement | Met | Supporting sections |
| ----------- | --- | ------------------- |
| S1–S9 all met | [ ] yes  [ ] no | § Success Criteria Review |
| No F1–F7 triggered | [ ] yes  [ ] no | § Failure Criteria Review |
| Standing protocol sufficient to gate corpus regression | [ ] yes  [ ] no | |
| Known limitations documented | [ ] yes  [ ] no | |

**Proceed evidence summary**

```text

```

### Repeat evidence

| Trigger | Applicable | Supporting sections |
| ------- | ---------- | ------------------- |
| I1–I7 inconclusive | [ ] yes  [ ] no | § Inconclusive Criteria Review |
| Partial S3 at 5/6 without F7 | [ ] yes  [ ] no | |
| Boundary-only discordance (I3) | [ ] yes  [ ] no | § Boundary Exercise Review |
| Holdout incomplete (I4) | [ ] yes  [ ] no | |
| Narrowest repeat component identified | | |

**Repeat evidence summary**

```text

```

### Stop evidence

| Trigger | Applicable | Supporting sections |
| ------- | ---------- | ------------------- |
| Any F1–F7 triggered | [ ] yes  [ ] no | § Failure Criteria Review |
| Contract ambiguity dominates (F2) | [ ] yes  [ ] no | |
| Two-layer model incoherent (F3) | [ ] yes  [ ] no | |
| Utility failure (F6) | [ ] yes  [ ] no | |
| Charter failure condition reference | | |

**Stop evidence summary**

```text

```

**Routing decision:** *Record in `45-2-recommendation.md` only — not here.*

| Route | Selected |
| ----- | -------- |
| Proceed to 45.3 | [ ] |
| Repeat 45.2 | [ ] |
| Stop and document negative result | [ ] |

---

## Reviewer Notes

```text

```

---

## Completion Checklist

*Verify all required analyses completed before recommendation drafting.*

### Prerequisites

- [ ] E1 workbook complete — 14/14 bodies, 6/6 pairs
- [ ] Blind gate opened and attested
- [ ] E0 workbook accessed for comparison only after blind gate
- [ ] This report populated from workbook and E0 reference

### Analysis sections

- [ ] § Evaluation Coverage — counts verified
- [ ] § Verdict Agreement — 12 paired rows complete
- [ ] § Pair Classification Agreement — 6 rows complete
- [ ] § Layer Agreement Analysis — L1–L7 complete
- [ ] § Boundary Exercise Review — B1 and B2 complete
- [ ] § Disagreement Register — all disagreements logged with layer attribution
- [ ] § Success Criteria Review — S1–S9 each marked
- [ ] § Failure Criteria Review — F1–F7 each marked
- [ ] § Inconclusive Criteria Review — I1–I7 assessed
- [ ] § Recommendation Input Summary — proceed/repeat/stop evidence drafted

### Threshold calculations

- [ ] Pair concordance count: /6
- [ ] Verdict concordance count: /12
- [ ] Classification inversion count recorded
- [ ] S5 verdict-first check completed
- [ ] F2 incompatible verdict count recorded
- [ ] `global_calibration_reopened` verified no on all boundary records

### Cross-artefact consistency

- [ ] Agreement report consistent with workbook § Agreement Summary
- [ ] Boundary fields consistent with workbook § Boundary Annex
- [ ] Coverage consistent with `45-2-evidence/experiment-metadata.md`

### Deliverable handoff

- [ ] This report complete
- [ ] Ready for `45-2-recommendation.md` drafting (Phase 5)
- [ ] No routing decision recorded in this file until recommendation authored

---

## Traceability

| Section | Authority |
| ------- | --------- |
| Artefact inventory | `SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md` § Scope |
| Agreement thresholds | Design § Success/Failure Criteria |
| Layer structure | `45-2-pattern-aware-evaluation-protocol.md` § Evaluation Stack |
| Analysis phase | `SPRINT-45-2-EXECUTION-PLAN.md` Phase 4 |
| Workbook cross-reference | `45-2-evidence-workbook.md` § Agreement Summary |
| E0 reference | `45-1-evidence-workbook.md` |
