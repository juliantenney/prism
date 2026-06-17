# 45.2 Agreement Analysis Report

**Experiment:** 45-2 Pattern-Aware Evaluation Repeatability Study  
**Report type:** E0 vs E1 agreement matrix + S5 + disqualifier-path review — Phase 4.4/4.5/4.6  
**Status:** Agreement matrix, S5, and Phase 4.6 disqualifier review populated — concordance totals and S/F/I assessment deferred  
**Authority:** [SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md](SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md) · [SPRINT-45-2-EXECUTION-PLAN.md](SPRINT-45-2-EXECUTION-PLAN.md) · [45-2-pattern-aware-evaluation-protocol.md](45-2-pattern-aware-evaluation-protocol.md) · [45-2-evidence-workbook.md](45-2-evidence-workbook.md)

**Non-goals at this gate:** Concordance calculation · S/F/I assessment · recommendation routing

**Prerequisite:** Blind gate opened 2026-06-16 after E1 completed all fourteen body evaluations.

---

## Report Header

| Field | Value |
| ----- | ----- |
| **Report ID** | 45-2-agreement-analysis |
| **Protocol version** | 1.0 (frozen) |
| **Protocol file** | `45-2-pattern-aware-evaluation-protocol.md` |
| **Workbook version / date** | E1 scoring complete — 2026-06-16 |
| **Workbook file** | `45-2-evidence-workbook.md` |
| **E0 reference** | `45-1-evidence-workbook.md` |
| **E0 evaluator code** | E0 |
| **E1 evaluator code** | E1-45-2-01 |
| **E2 adjudicator code** | — |
| **E1b second independent code** | — |
| **Blind status at analysis** | [x] blind maintained until E1 complete  [ ] blind breached |
| **Blind gate opened** | 2026-06-16 |
| **Analysis completion date** | 2026-06-16 (matrix only) |
| **Analyst role** | Phase 4.4 agreement matrix construction |

---

## Executive Summary

```text
Phase 4.4 agreement matrix constructed from E0 (`45-1-evidence-workbook.md`) and E1 (`45-2-evidence-workbook.md`) after blind gate opening.
Per-body and per-pair comparison rows populated with match/mismatch status.
S5 verdict-first check completed with per-disagreement compliance review.
Phase 4.6 disqualifier-path review completed with pair-level and disagreement-level consistency checks.
Concordance aggregates and S/F/I assessment not yet performed.
```

---

## Evaluation Coverage

| Metric | Target | Actual | Complete |
| ------ | ------ | ------ | -------- |
| **Bodies evaluated (E1)** | 14 | 14 | [x] |
| **45.1 paired bodies** | 12 | 12 | [x] |
| **Holdout bodies** | 2 | 2 | [x] |
| **Pairs classified (E1)** | 6 | 6 | [x] |
| **Boundary exercise B1 (TP-PS-A6)** | 1 | 1 | [x] |
| **Boundary exercise B2 (HO-TP-01)** | 1 | 1 | [x] |
| **Agreement analysis — paired bodies** | 12 | 12 | [x] |
| **Holdout per-body review** | 2 | 2 | [x] |

### Body inventory

| Artefact ID | Type | E1 complete | Included in verdict agreement |
| ----------- | ---- | ----------- | ----------------------------- |
| BL-DT-MRX-A4 | 45.1 paired | [x] | [x] yes |
| TR-DT-MRX-A4 | 45.1 paired | [x] | [x] yes |
| BL-DT-PS-A4 | 45.1 paired | [x] | [x] yes |
| TR-DT-PS-A4 | 45.1 paired | [x] | [x] yes |
| BL-DT-PS-A6 | 45.1 paired | [x] | [x] yes |
| TR-DT-PS-A6 | 45.1 paired | [x] | [x] yes |
| BL-TP-MRX-A4 | 45.1 paired | [x] | [x] yes |
| TR-TP-MRX-A4 | 45.1 paired | [x] | [x] yes |
| BL-TP-PS-A4 | 45.1 paired | [x] | [x] yes |
| TR-TP-PS-A4 | 45.1 paired | [x] | [x] yes |
| BL-TP-PS-A6 | 45.1 paired | [x] | [x] yes |
| TR-TP-PS-A6 | 45.1 paired | [x] | [x] yes |
| HO-DT-01 | Holdout | [x] | [ ] n/a — E1 only |
| HO-TP-01 | Holdout | [x] | [ ] n/a — E1 only |

---

## Agreement Matrix

*Phase 4.4 — field-by-field E0 vs E1 comparison. Aggregate concordance not calculated at this gate.*

---

## Verdict Agreement

*Twelve paired bodies — exact tier match (Failed / Minimum / Strong). Holdouts excluded — no E0 reference.*

### Aggregate

| Metric | Value | Threshold reference |
| ------ | ----- | ------------------- |
| **Exact verdict matches** | 10/12 | S4: ≥10/12 |
| **Verdict mismatches** | 2/12 (`BL-TP-MRX-A4`, `BL-TP-PS-A6`) | |
| **Incompatible verdicts without resolvable boundary** | 1/12 (`BL-TP-MRX-A4`) | F2: ≥3 |

### Per-body verdict table

| Artefact ID | Pair | E0 verdict | E1 verdict | Agreement | Notes |
| ----------- | ---- | ---------- | ---------- | ----------- | ----- |
| BL-DT-MRX-A4 | DT-MRX-A4 | Strong | Strong | [x] match  [ ] mismatch | |
| TR-DT-MRX-A4 | DT-MRX-A4 | Strong | Strong | [x] match  [ ] mismatch | |
| BL-DT-PS-A4 | DT-PS-A4 | Minimum | Minimum | [x] match  [ ] mismatch | |
| TR-DT-PS-A4 | DT-PS-A4 | Strong | Strong | [x] match  [ ] mismatch | |
| BL-DT-PS-A6 | DT-PS-A6 | Minimum | Minimum | [x] match  [ ] mismatch | |
| TR-DT-PS-A6 | DT-PS-A6 | Strong | Strong | [x] match  [ ] mismatch | |
| BL-TP-MRX-A4 | TP-MRX-A4 | Strong | Minimum | [ ] match  [x] mismatch | E1 rates own-context framing weaker than E0 M16 Strong precedent |
| TR-TP-MRX-A4 | TP-MRX-A4 | Strong | Strong | [x] match  [ ] mismatch | |
| BL-TP-PS-A4 | TP-PS-A4 | Failed | Failed | [x] match  [ ] mismatch | |
| TR-TP-PS-A4 | TP-PS-A4 | Strong | Strong | [x] match  [ ] mismatch | |
| BL-TP-PS-A6 | TP-PS-A6 | Failed | Minimum | [ ] match  [x] mismatch | B1 boundary reading differs — E0 Inter-Rater conjunctive vs E1 Pass 2 conjunctive |
| TR-TP-PS-A6 | TP-PS-A6 | Strong | Strong | [x] match  [ ] mismatch | |

### Holdout verdicts (E1 only — no E0 comparison)

| Artefact ID | E1 verdict | Notes |
| ----------- | ---------- | ----- |
| HO-DT-01 | Minimum | M12 holdout; FM-04 present |
| HO-TP-01 | Minimum | M22 holdout; B2 Pass 2 declaration applied |

---

## Pair Classification Agreement

*Primary repeatability measure — six pairs.*

### Aggregate

| Metric | Value | Threshold reference |
| ------ | ----- | ------------------- |
| **Pair classification matches** | 5/6 | S3: ≥5/6 |
| **Pair classification mismatches** | 1/6 (`TP-MRX-A4`) | F1: ≤3/6 |
| **Classification inversions (Improvement ↔ No Change)** | 1 (`TP-MRX-A4`) | F7: ≥2 with ≤3/6 |
| **Signal-only Improvement pairs (E1)** | 0 | S5: 0 |

### Per-pair table

| Pair ID | E0 classification | E1 classification | Agreement | Notes |
| ------- | ------------------ | ----------------- | ----------- | ----- |
| DT-MRX-A4 | No Change | No Change | [x] match  [ ] mismatch | |
| DT-PS-A4 | Improvement | Improvement | [x] match  [ ] mismatch | |
| DT-PS-A6 | Improvement | Improvement | [x] match  [ ] mismatch | |
| TP-MRX-A4 | No Change | Improvement | [ ] match  [x] mismatch | Driven by BL-TP-MRX-A4 verdict discordance (E0 Strong→Strong vs E1 Minimum→Strong) |
| TP-PS-A4 | Improvement | Improvement | [x] match  [ ] mismatch | |
| TP-PS-A6 | Improvement | Improvement | [x] match  [ ] mismatch | Both Improvement despite BL-TP-PS-A6 tier discordance under different B1 readings |

### E1 pair synthesis fields (reference)

| Pair ID | E1 baseline verdict | E1 treatment verdict | E1 verdict delta | Target FM absent (treatment) | E1 per-output success |
| ------- | ------------------- | -------------------- | ---------------- | ---------------------------- | --------------------- |
| DT-MRX-A4 | Strong | Strong | equal | yes | met |
| DT-PS-A4 | Minimum | Strong | rise | yes | met |
| DT-PS-A6 | Minimum | Strong | rise | yes | met |
| TP-MRX-A4 | Minimum | Strong | rise | yes | met |
| TP-PS-A4 | Failed | Strong | rise | yes | met |
| TP-PS-A6 | Minimum | Strong | rise | yes | met |

---

## Layer Agreement Analysis

*Twelve paired bodies unless noted. Agreement types: exact match · compatible · incompatible · n/a.*

### Layer 1 — Contract Verdict

| Metric | Value |
| ------ | ----- |
| **Exact matches** | /12 |
| **Mismatches** | |
| **Mismatched artefact IDs** | BL-TP-MRX-A4; BL-TP-PS-A6 |

| Artefact ID | E0 verdict | E1 verdict | Agreement | Boundary resolved | Notes |
| ----------- | ---------- | ---------- | ----------- | ----------------- | ----- |
| BL-DT-MRX-A4 | Strong | Strong | match | [ ] yes  [ ] no  [x] n/a | |
| TR-DT-MRX-A4 | Strong | Strong | match | [ ] yes  [ ] no  [x] n/a | |
| BL-DT-PS-A4 | Minimum | Minimum | match | [ ] yes  [ ] no  [x] n/a | |
| TR-DT-PS-A4 | Strong | Strong | match | [ ] yes  [ ] no  [x] n/a | |
| BL-DT-PS-A6 | Minimum | Minimum | match | [ ] yes  [ ] no  [x] n/a | |
| TR-DT-PS-A6 | Strong | Strong | match | [ ] yes  [ ] no  [x] n/a | |
| BL-TP-MRX-A4 | Strong | Minimum | mismatch | [ ] yes  [x] no  [ ] n/a | No boundary touchpoint on pair |
| TR-TP-MRX-A4 | Strong | Strong | match | [ ] yes  [ ] no  [x] n/a | |
| BL-TP-PS-A4 | Failed | Failed | match | [ ] yes  [ ] no  [x] n/a | |
| TR-TP-PS-A4 | Strong | Strong | match | [ ] yes  [ ] no  [x] n/a | |
| BL-TP-PS-A6 | Failed | Minimum | mismatch | [x] yes  [ ] no  [ ] n/a | Opposite readings of same M22 ambiguity — resolvability TBD at S/F gate |
| TR-TP-PS-A6 | Strong | Strong | match | [ ] yes  [ ] no  [x] n/a | |

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
| BL-DT-MRX-A4 | Strong | Strong | n/a | n/a | compatible / match | |
| TR-DT-MRX-A4 | Strong | Strong | no | no | compatible / match | |
| BL-DT-PS-A4 | Minimum | Minimum | n/a | n/a | compatible / match | |
| TR-DT-PS-A4 | Strong | Strong | no | no | compatible / match | |
| BL-DT-PS-A6 | Minimum | Minimum | n/a | n/a | compatible / match | |
| TR-DT-PS-A6 | Strong | Strong | no | no | compatible / match | |
| BL-TP-MRX-A4 | Strong | Minimum | n/a | n/a | incompatible / match | Signal tier discordance co-occurs with L1 mismatch |
| TR-TP-MRX-A4 | Strong | Strong | no | no | compatible / match | |
| BL-TP-PS-A4 | Failed | Failed | n/a | n/a | compatible / match | |
| TR-TP-PS-A4 | Strong | Strong | no | no | compatible / match | |
| BL-TP-PS-A6 | Weak | Minimum | n/a | n/a | incompatible / match | Tier shift under different §5.8 readings |
| TR-TP-PS-A6 | Strong | Strong | no | no | compatible / match | |

**S5 Verdict-First Check (Phase 4.5)**

| Check | Result |
| ----- | ------ |
| E1 pairs classified Improvement without verdict rise | 0 observed in E1 pair set |
| Signal-profile difference caused verdict override | No evidence in disagreement set |
| FM difference caused verdict override | No evidence in disagreement set |
| Pair classifications derived from verdict deltas (not signal tiers) | Yes — including mismatch case TP-MRX-A4 |
| Boundary declarations changed interpretation without bypassing verdict authority | Yes — B1 altered BL-TP-PS-A6 interpretation path, verdict remained governing for classification |
| **S5 determination** | **Pass** |

### Per-disagreement verdict-first review

| Disagreement ID | Artefact/Pair | Disagreement type | Verdict-first compliant | Evidence | Rationale |
| --------------- | ------------- | ----------------- | ----------------------- | -------- | --------- |
| D1 | BL-TP-MRX-A4 | L1 verdict mismatch (Strong vs Minimum) | yes | L1 rows disagree; L2/L3 differ but both raters still anchor final judgement in §5.8 contract interpretation text | Verdict divergence reflects contract interpretation, not signal/FM override |
| D2 | BL-TP-PS-A6 | L1 verdict mismatch (Failed vs Minimum) | yes | B1 declarations differ; both declared before verdict; L1 contract tier assigned from declared §5.8 reading | Boundary interpretation changes L1 outcome but does not bypass verdict authority |
| D3 | TP-MRX-A4 | Pair classification mismatch (No Change vs Improvement) | yes | E0 pair = Strong->Strong; E1 pair = Minimum->Strong; both classifications follow verdict deltas | Pair disagreement is downstream of L1 baseline verdict discordance, not signal-profile control |
| D4 | BL-TP-MRX-A4 | L2 signal mismatch (Strong vs Minimum) | yes | Co-occurs with D1; no record of L2 forcing a different L1 than each rater's contract reading | Signals corroborate each rater's verdict; no override mechanism evidenced |
| D5 | BL-TP-MRX-A4 | FM-03 mismatch (absent vs present) | yes | FM disagreement logged in L3 while ownership/mimicry both pass and L1 remains interpretation-led | FM used diagnostically; not used as independent verdict controller |
| D6 | BL-TP-PS-A6 | L2 signal mismatch (Weak vs Minimum) | yes | Pair classification still Improvement for both because treatment verdict > baseline verdict in both frameworks | Signal-tier mismatch did not alter verdict-first pair derivation |
| D7 | B1 (TP-PS-A6) | Boundary interpretation difference | yes | Both declarations recorded pre-verdict; `global_calibration_reopened = no`; treatment verdict/classification align on both sides | Boundary modifies interpretation inputs only; L1 contract verdict remains governing authority |

---

### Layer 3 — Failure Modes

| Metric | Value |
| ------ | ----- |
| **Target FM agreement** | /12 |
| **Target FM mismatches** | |
| **Capture channel (FM-01/FM-12) agreement** | /12 |

| Artefact ID | Material type | E0 target FM(s) | E1 target FM(s) | Agreement | Notes |
| ----------- | ------------- | --------------- | --------------- | ----------- | ----- |
| BL-DT-MRX-A4 | DT | FM-04: absent | FM-04: absent | match | |
| TR-DT-MRX-A4 | DT | FM-04: absent | FM-04: absent | match | |
| BL-DT-PS-A4 | DT | FM-04: present | FM-04: present | match | |
| TR-DT-PS-A4 | DT | FM-04: absent | FM-04: absent | match | |
| BL-DT-PS-A6 | DT | FM-04: present | FM-04: present | match | |
| TR-DT-PS-A6 | DT | FM-04: absent | FM-04: absent | match | |
| BL-TP-MRX-A4 | TP | FM-02: absent; FM-03: absent | FM-02: absent; FM-03: present | mismatch | FM-03 discordance on baseline |
| TR-TP-MRX-A4 | TP | FM-02: absent; FM-03: absent | FM-02: absent; FM-03: absent | match | |
| BL-TP-PS-A4 | TP | FM-02: present; FM-03: present | FM-02: present; FM-03: present | match | |
| TR-TP-PS-A4 | TP | FM-02: absent; FM-03: absent | FM-02: absent; FM-03: absent | match | |
| BL-TP-PS-A6 | TP | FM-02: absent; FM-03: present | FM-02: absent; FM-03: present | match | |
| TR-TP-PS-A6 | TP | FM-02: absent; FM-03: absent | FM-02: absent; FM-03: absent | match | |

---

### Layer 4 — Ownership Audit

| Metric | Value |
| ------ | ----- |
| **Ownership pass agreement** | /12 |
| **Ownership regression agreement** | /12 |
| **Mismatches** | |

| Artefact ID | E0 ownership pass | E1 ownership pass | E0 regression | E1 regression | Agreement | Notes |
| ----------- | ----------------- | ----------------- | ------------- | ------------- | ----------- | ----- |
| BL-DT-MRX-A4 | pass | pass | n/a | n/a | match | |
| TR-DT-MRX-A4 | pass | pass | no | no | match | |
| BL-DT-PS-A4 | pass | pass | n/a | n/a | match | |
| TR-DT-PS-A4 | pass | pass | no | no | match | |
| BL-DT-PS-A6 | pass | pass | n/a | n/a | match | |
| TR-DT-PS-A6 | pass | pass | no | no | match | |
| BL-TP-MRX-A4 | pass | pass | n/a | n/a | match | |
| TR-TP-MRX-A4 | pass | pass | no | no | match | |
| BL-TP-PS-A4 | pass | pass | n/a | n/a | match | |
| TR-TP-PS-A4 | pass | pass | no | no | match | |
| BL-TP-PS-A6 | pass | pass | n/a | n/a | match | |
| TR-TP-PS-A6 | pass | pass | no | no | match | |

---

### Layer 5 — Anti-Mimicry

| Metric | Value |
| ------ | ----- |
| **Mimicry suspect agreement** | /12 |
| **Mismatches** | |

| Artefact ID | E0 mimicry suspect | E1 mimicry suspect | E0 proximity | E1 proximity | Agreement | Notes |
| ----------- | ------------------ | ------------------ | ------------ | ------------ | ----------- | ----- |
| BL-DT-MRX-A4 | no | no | same (M13) | n/a | match | |
| TR-DT-MRX-A4 | no | no | same | n/a | match | |
| BL-DT-PS-A4 | no | no | farther (M12) | n/a | match | |
| TR-DT-PS-A4 | no | no | closer to M13 | n/a | match | |
| BL-DT-PS-A6 | no | no | farther (M19) | n/a | match | |
| TR-DT-PS-A6 | no | no | closer to M13 | n/a | match | |
| BL-TP-MRX-A4 | no | no | same (M16) | n/a | match | |
| TR-TP-MRX-A4 | no | no | same | n/a | match | |
| BL-TP-PS-A4 | no | no | farther (M14) | n/a | match | |
| TR-TP-PS-A4 | no | no | closer to M16 | n/a | match | |
| BL-TP-PS-A6 | no | no | farther (M16) | n/a | match | |
| TR-TP-PS-A6 | no | no | closer to M16 | n/a | match | |

**Holdout anti-mimicry (E1 only)**

| Artefact ID | E1 mimicry suspect | Notes |
| ----------- | ------------------ | ----- |
| HO-DT-01 | no | |
| HO-TP-01 | no | |

---

### Layer 6 — Boundary Declaration

| Metric | Value |
| ------ | ----- |
| **Bodies requiring boundary** | 3 (BL-TP-PS-A6, TR-TP-PS-A6, HO-TP-01) |
| **Declaration compatibility (paired bodies)** | *Deferred — see Boundary Exercise Review* |
| **global_calibration_reopened = yes on any record** | [ ] yes  [x] no — must be no |

| Artefact ID | E0 boundary applicable | E1 boundary applicable | E0 declaration summary | E1 declaration summary | Agreement | Notes |
| ----------- | ---------------------- | ---------------------- | ---------------------- | ---------------------- | ----------- | ----- |
| BL-TP-PS-A6 | yes | yes | Inter-Rater conjunctive §5.8 minimum (M22) | Pass 2 conjunctive §5.8 minimum (B1) | incompatible | Different minimum readings on same ambiguity |
| TR-TP-PS-A6 | n/a (pair-level) | yes (B1 pair) | Same pair declaration as BL | Pass 2 conjunctive §5.8 (B1) | n/a | E0 declaration recorded at pair metadata level |
| HO-TP-01 | n/a | yes | n/a | Pass 2 conjunctive §5.8 (B2) | n/a | Holdout — E1 procedure only |

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
| DT-MRX-A4 | No Change | No Change | n/a | n/a | met | met | match | |
| DT-PS-A4 | Improvement | Improvement | yes | yes | met | met | match | |
| DT-PS-A6 | Improvement | Improvement | yes | yes | met | met | match | |
| TP-MRX-A4 | No Change | Improvement | n/a | yes | met | met | mismatch | Classification inversion (No Change ↔ Improvement) |
| TP-PS-A4 | Improvement | Improvement | yes | yes | met | met | match | |
| TP-PS-A6 | Improvement | Improvement | yes | yes | met | met | match | |

**Disqualifier path application log (Phase 4.6)**

| Disqualifier | Applied on all relevant bodies | Any E0/E1 mismatch | Notes |
| ------------ | -------------------------------- | ------------------ | ----- |
| Ownership regression | [x] yes  [ ] no | no | All treatment bodies record no regression; no pair invalidated |
| Ownership failure | [x] yes  [ ] no | no | Ownership pass on all paired bodies (E0 and E1) |
| Mimicry suspect | [x] yes  [ ] no | no | Mimicry suspect = no across paired bodies (E0 and E1) |
| Superficial match guard | [x] yes  [ ] no | no | Improvement treatments use superficial_match = no; n/a only on baselines |
| Other Improvement disqualifier signals | [x] yes  [ ] no | no | No disqualifier-triggering condition found in disagreement set |

### Phase 4.6 Disqualifier Path Review

Scope: all six pair outcomes with emphasis on Improvement pairs and disagreement-linked records.

#### Pair-level disqualifier review

| Pair ID | E0 classification | E1 classification | Disqualifier present | Disqualifier type | Evidence | Review outcome |
| ------- | ----------------- | ----------------- | -------------------- | ----------------- | -------- | -------------- |
| DT-MRX-A4 | No Change | No Change | no | none | Treatment ownership pass; ownership regression no; mimicry no; superficial_match no | Valid (no disqualifier breach) |
| DT-PS-A4 | Improvement | Improvement | no | none | Treatment FM-04 cleared; ownership pass; regression no; mimicry no; superficial_match no | Valid Improvement path |
| DT-PS-A6 | Improvement | Improvement | no | none | Treatment FM-04 cleared; ownership pass; regression no; mimicry no; superficial_match no | Valid Improvement path |
| TP-MRX-A4 | No Change | Improvement | no | none | Both sides: treatment ownership pass, regression no, mimicry no, superficial_match no; disagreement is verdict interpretation only | Valid classification disagreement (not disqualifier-driven) |
| TP-PS-A4 | Improvement | Improvement | no | none | Treatment FM-02/FM-03 absent; ownership pass; regression no; mimicry no; superficial_match no | Valid Improvement path |
| TP-PS-A6 | Improvement | Improvement | no | none | Treatment FM-02/FM-03 absent; ownership pass; regression no; mimicry no; superficial_match no; B1 declared pre-verdict | Valid Improvement path (boundary-dependent) |

#### Disagreement-level disqualifier consistency review

| Disagreement ID | Artefact/Pair | Disqualifier inconsistency indicated | Evidence | Outcome |
| --------------- | ------------- | ------------------------------------ | -------- | ------- |
| D1 | BL-TP-MRX-A4 (L1) | no | L1 tier split; no ownership/mimicry/superficial disqualifier flags | Not disqualifier-path divergence |
| D2 | BL-TP-PS-A6 (L1) | no | Boundary interpretation split; ownership/mimicry unchanged | Not disqualifier-path divergence |
| D3 | TP-MRX-A4 (L7) | no | Pair inversion derived from baseline verdict split; treatment disqualifier checks pass | Not disqualifier-path divergence |
| D4 | BL-TP-MRX-A4 (L2) | no | Signal tier mismatch without disqualifier trigger fields | Not disqualifier-path divergence |
| D5 | BL-TP-MRX-A4 (L3) | no | FM-03 disagreement on baseline interpretation; no ownership/mimicry/superficial trigger | Not disqualifier-path divergence |
| D6 | BL-TP-PS-A6 (L2) | no | Signal mismatch under B1 readings; no disqualifier trigger | Not disqualifier-path divergence |
| D7 | B1 boundary | no | Interpretation-path divergence with pre-verdict declaration on both sides | Not disqualifier-path divergence |

#### Overall Phase 4.6 determination

**Pass**

```text
No Improvement classification is invalidated by disqualifier-path criteria.
No evidence of inconsistent disqualifier application between E0 and E1 is observed in the disagreement register.
Remaining disagreements are interpretation- or boundary-path differences, not ownership/mimicry/superficial disqualifier failures.
```

---

## Boundary Exercise Review

### B1 — TP-PS-A6

| Field | E0 | E1 |
| ----- | -- | -- |
| **Touchpoint** | B1 | B1 |
| **Pair** | TP-PS-A6 | TP-PS-A6 |
| **Ambiguity flag** | yes (M22 split) | yes (M22 split) |
| **Calibration reference** | M22 — Pass 2 Minimum vs Inter-Rater Failed | M22 — Pass 2 Minimum vs Inter-Rater Failed |
| **Declared interpretation** | Inter-Rater conjunctive §5.8 minimum | Pass 2 conjunctive §5.8 minimum |
| **Declaration before verdict** | yes | yes |
| **Global calibration reopened** | no | no |
| **Verdict baseline** | Failed | Minimum |
| **Verdict treatment** | Strong | Strong |
| **Pair classification** | Improvement | Improvement |

| Field | Value |
| ----- | ----- |
| **Agreement status** | [ ] compatible  [x] incompatible  [ ] n/a |
| **Impact on verdict** | BL-TP-PS-A6 tier discordance (Failed vs Minimum) under opposite §5.8 readings |
| **Impact on classification** | None — both classify Improvement |
| **Impact notes** | Pair outcome agrees despite baseline tier disagreement; boundary resolvability to be assessed at S7/S9 gate |

```text
E0 applied Inter-Rater conjunctive reading (own-context required for minimum).
E1 applied Pass 2 conjunctive reading (completion criterion + substantive cues sufficient for minimum).
Both declared before verdict; neither reopened global calibration.
```

---

### B2 — HO-TP-01

| Field | E0 | E1 |
| ----- | -- | -- |
| **Touchpoint** | B2 | B2 |
| **Artefact** | n/a — holdout | HO-TP-01 |
| **Corpus reference** | M22 | M22 |
| **Ambiguity flag** | n/a | yes (M22 split) |
| **Calibration reference** | n/a | M22 — Pass 2 vs Inter-Rater split |
| **Declared interpretation** | n/a | Pass 2 conjunctive §5.8 minimum |
| **Declaration before verdict** | n/a | yes |
| **Global calibration reopened** | n/a | no |
| **Verdict under declaration** | n/a | Minimum |

| Field | Value |
| ----- | ----- |
| **Agreement status** | [x] E1 procedure compliant  [ ] non-compliant |
| **Impact on verdict** | n/a — no E0 holdout reference |
| **Impact on classification** | n/a — single body |
| **Impact notes** | E1 B2 declaration preceded verdict; frozen M22 records not altered |
| **Frozen M22 records altered** | [x] no  [ ] yes — must be no |

```text
Holdout body scored under declared B2 Pass 2 reading → Minimum.
No E0 comparison available for holdout verdict.
```

---

## Disagreement Register

*One row per disagreement. Layer attribution required. Finalised in Phase 4.8.*

### Phase 4.8 — Disagreement Attribution and Finalisation

#### Attribution model

```text
Primary disagreement: first-order divergence at governing layer (typically L1 contract verdict).
Derivative disagreement: downstream divergence caused by an upstream primary disagreement.
Boundary-driven disagreement: divergence caused by alternative declared boundary interpretations (L6 path), not by protocol bypass.
```

#### Phase 4.8 disagreement-attribution table

| Disagreement ID | Artefact/Pair | Category | Originating layer | Dependency chain | Downstream derived from upstream verdict disagreement | Status | Rationale |
| --------------- | ------------- | -------- | ----------------- | ---------------- | ----------------------------------------------------- | ------ | --------- |
| D1 | BL-TP-MRX-A4 verdict | Primary | L1 | L1 split -> L7 pair inversion on TP-MRX-A4 | yes (drives D3) | unresolved | No boundary touchpoint; E0/E1 differ on §5.8 baseline interpretation |
| D2 | BL-TP-PS-A6 verdict | Primary + boundary-driven | L1 (via L6 B1) | B1 interpretation split -> L1 tier split; pair remains aligned | no (no pair split) | structurally expected | Opposed B1 readings produce baseline tier discordance while treatment and pair classification still converge |
| D3 | TP-MRX-A4 pair classification | Derivative | L7 | D1 (BL-TP-MRX-A4 verdict) -> baseline delta divergence -> pair inversion | yes (from D1) | structurally expected | E0 Strong->Strong = No Change; E1 Minimum->Strong = Improvement |
| D4 | BL-TP-MRX-A4 signal profile | Derivative | L2 | D1 L1 interpretation split -> signal-tier framing divergence | yes (from D1) | structurally expected | Secondary signal disagreement co-occurs with the same baseline interpretation split |
| D5 | BL-TP-MRX-A4 FM-03 | Derivative | L3 | D1 L1 interpretation split -> FM diagnostic divergence | yes (from D1) | structurally expected | FM-03 coded differently under competing baseline interpretations |
| D6 | BL-TP-PS-A6 signal profile | Derivative + boundary-driven | L2 (via L6 B1) | B1 split (D7) -> D2 L1 split -> L2 tier divergence | yes (from D2/D7 pathway) | structurally expected | Signal tier differs under alternative B1 interpretation pathway |
| D7 | B1 interpretation difference | Boundary-driven primary | L6 | L6 declaration split -> D2 verdict split -> D6 signal divergence | yes (drives D2 and D6) | resolved as boundary-attributed | Both declarations were protocol-compliant and pre-verdict with no global recalibration |

#### Relationship note (required linkage)

```text
BL-TP-MRX-A4 verdict disagreement (D1) is the upstream non-boundary primary divergence and directly explains the TP-MRX-A4 pair-classification inversion (D3).
B1 interpretation difference (D7) is the upstream boundary-driven divergence and explains BL-TP-PS-A6 verdict disagreement (D2), with secondary signal divergence at BL-TP-PS-A6 (D6).
Thus, disagreement topology is two-source:
  Source A (non-boundary): D1 -> D3, D4, D5
  Source B (boundary-driven): D7 -> D2 -> D6
```

### Verdict disagreements

| # | Artefact ID | E0 verdict | E1 verdict | Tier delta | Boundary resolvable | Layer | Verdict-first compliant | Disqualifier-path consistent | S5 evidence note | Resolution |
| - | ----------- | ---------- | ---------- | ---------- | ------------------- | ----- | ---------------------- | --------------------------- | ---------------- | ---------- |
| 1 | BL-TP-MRX-A4 | Strong | Minimum | −1 tier | [ ] yes  [x] no | L1 | yes | yes | Contract-interpretation split; no signal/FM override record | Finalised — primary unresolved L1 interpretation disagreement |
| 2 | BL-TP-PS-A6 | Failed | Minimum | +1 tier | [x] yes  [ ] no | L1 | yes | yes | B1 declaration difference precedes verdict on both sides | Finalised — boundary-driven, structurally expected |

### Classification disagreements

| # | Pair ID | E0 classification | E1 classification | Inversion (Imp ↔ NC) | Layer | Verdict-first compliant | Disqualifier-path consistent | S5 evidence note | Resolution |
| - | ------- | ----------------- | ----------------- | -------------------- | ----- | ---------------------- | --------------------------- | ---------------- | ---------- |
| 1 | TP-MRX-A4 | No Change | Improvement | [x] yes  [ ] no | L7 | yes | yes | Classification follows each side's verdict delta, not signal tier | Finalised — derivative of D1 (BL-TP-MRX-A4 L1 split) |

### Layer disagreements

| # | Artefact ID | Layer | E0 value | E1 value | Affects pair outcome | Verdict-first compliant | Disqualifier-path consistent | S5 evidence note | Resolution |
| - | ----------- | ----- | -------- | -------- | -------------------- | ---------------------- | --------------------------- | ---------------- | ---------- |
| 1 | BL-TP-MRX-A4 | L2 | Strong | Minimum | [x] yes | yes | yes | L2 mismatch accompanies, but does not drive, L1 split | Finalised — derivative of D1 |
| 2 | BL-TP-MRX-A4 | L3 | FM-03 absent | FM-03 present | [x] yes | yes | yes | FM difference remains diagnostic; no independent tier override | Finalised — derivative of D1 |
| 3 | BL-TP-PS-A6 | L2 | Weak | Minimum | [ ] yes  [x] no | yes | yes | Signal tier differs under B1 reading; pair outcome still verdict-derived | Finalised — derivative of boundary path D7->D2 |

### Boundary disagreements

| # | Touchpoint | Issue | E0 position | E1 position | Verdict-first compliant | Disqualifier-path consistent | S5 evidence note | Resolution |
| - | ---------- | ----- | ----------- | ----------- | ---------------------- | --------------------------- | ---------------- | ---------- |
| 1 | B1 | §5.8 minimum reading on M22 | Inter-Rater conjunctive (own-context required) | Pass 2 conjunctive (completion + cues sufficient) | yes | yes | Declaration altered interpretation pathway only; verdict authority retained | Finalised — boundary-driven primary disagreement (protocol-compliant) |

### Utility assessment (F6 / S9 input)

| Field | Value |
| ----- | ----- |
| **Total material disagreements** | *Deferred — Phase 4.7* |
| **Resolvable under protocol** | [ ] yes  [ ] no  [ ] partial |
| **Irreducible intuition reported** | [ ] yes  [ ] no |
| **Utility sufficient for research gate** | [ ] yes  [ ] no  [ ] borderline |

---

## Success Criteria Review

*Mandatory — all S1–S9 required for proceed-to-45.3 input. Do not assess until analysis complete.*

| ID | Criterion | Threshold | Result | Evidence reference |
| -- | --------- | --------- | ------ | ------------------ |
| **S1** | Protocol exists covering L1–L7 without 44-2/44-3 modification | Protocol file | [x] met  [ ] not_met | `45-2-pattern-aware-evaluation-protocol.md`; traceability section |
| **S2** | Independent application complete — 12 + 2 holdouts full stack | 14/14 bodies | [x] met  [ ] not_met | § Evaluation Coverage (14/14 complete) |
| **S3** | Pair classification concordance | ≥5/6 | [x] met  [ ] not_met | § Pair Classification Agreement (5/6) |
| **S4** | Verdict concordance (paired bodies) | ≥10/12 | [x] met  [ ] not_met | § Verdict Agreement (10/12) |
| **S5** | No systematic signal override | 0 signal-only Improvement | [x] met  [ ] not_met | § Layer 2 S5 check (0 signal-only Improvement; Pass) |
| **S6** | Ownership and anti-mimicry traceable on all 14 bodies | No blank/ad hoc | [x] met  [ ] not_met | § Layer 4, § Layer 5, Phase 4.6 log |
| **S7** | Boundary exercise complete B1 + B2; no global reopening | Both touchpoints | [x] met  [ ] not_met | § Boundary Exercise Review (`global_calibration_reopened = no`) |
| **S8** | Holdouts evaluated | HO-DT-01 + HO-TP-01 | [x] met  [ ] not_met | § Evaluation Coverage; holdout verdict rows |
| **S9** | Disagreements documented and resolvable | Utility sufficient | [x] met  [ ] not_met | § Disagreement Register + disqualifier consistency fields |

### S-criteria rationale (Phase 4.7)

```text
S3 and S4 are met at threshold floor (5/6 and 10/12 respectively).
S5 and Phase 4.6 both pass, indicating no signal-led or disqualifier-led invalid Improvement path.
Disagreements remain documented with layer attribution and protocol-resolvable pathways (boundary or adjudication path), supporting S9.
```

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
| **F1** | Pair concordance ≤3/6 | ≤3/6 matches | [ ] yes  [x] no | § Pair Classification Agreement (5/6) |
| **F2** | ≥3 incompatible verdicts without resolvable boundary | ≥3 bodies | [ ] yes  [x] no | § Verdict Agreement (1 unresolved mismatch) |
| **F3** | Systematic signal/verdict divergence | ≥2 bodies or signal-only Improvement | [ ] yes  [x] no | § Layer 2 S5 check (0 signal-only Improvement) |
| **F4** | E1 Improvement where superficial-match should block | Per protocol | [ ] yes  [x] no | § Layer 2; Phase 4.6 review |
| **F5** | Ownership/anti-mimicry not operationalisable | Irreducible intuition | [ ] yes  [x] no | § Layer 4, § Layer 5, Phase 4.6 pass |
| **F6** | Disagreement exceeds utility | No resolution path | [ ] yes  [x] no | § Disagreement Register (attributed + review fields) |
| **F7** | ≤3/6 pair concordance AND ≥2 Improvement ↔ No Change inversions | Combined | [ ] yes  [x] no | § Pair Classification Agreement (5/6; inversions=1) |

### F-criteria rationale (Phase 4.7)

```text
No failure trigger threshold is reached.
The strongest failure candidates (F2/F3/F6) remain below trigger conditions:
- F2: 1 unresolved non-boundary verdict mismatch (<3)
- F3: 0 signal-only Improvement pairs
- F6: disagreements are logged with protocol-attributed review paths.
```

---

## Inconclusive Criteria Review

*Borderline outcomes — repeat input. Do not assess until S/F review complete.*

| ID | Condition | Applicable | Triggered | Notes |
| -- | --------- | ---------- | --------- | ----- |
| **I1** | Pair concordance 4/6 | yes | [ ] yes  [x] no | Concordance is 5/6 |
| **I2** | Verdict concordance 9/12 with S3 met | yes | [ ] yes  [x] no | Concordance is 10/12 |
| **I3** | Single pair discordance solely on boundary declaration | yes | [ ] yes  [x] no | Discordant pair is TP-MRX-A4 (non-boundary) |
| **I4** | Holdout evaluation incomplete | yes | [ ] yes  [x] no | Both holdouts complete |
| **I5** | No superficial-match case; all else met | yes | [x] yes  [ ] no | No superficial-match `yes` case observed in compared paired bodies |
| **I6** | E1b disagrees with E1 on ≥3 bodies | no | [ ] yes  [ ] no  [x] n/a | E1b not used |
| **I7** | Procedural flaw — blind broken or protocol incomplete | yes | [ ] yes  [x] no | Blind gate procedure recorded and maintained |

### Open unknowns (repeatability analysis)

```text
I5 is triggered under the frozen inconclusive-band definition because no explicit superficial-match-positive test case is present in the paired comparison set.
All other inconclusive criteria are not triggered.
Open unknown for downstream recommendation phase: whether I5 should be treated as an acceptable known limitation under otherwise met S1-S9 and non-triggered F1-F7, or routed to repeat scope for explicit superficial-match stress test.
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
Phase 4.4 complete — agreement matrix populated from E0 and E1 workbooks.
Phase 4.5 complete — S5 verdict-first check recorded as Pass with per-disagreement review.
Phase 4.6 complete — disqualifier-path review recorded as Pass.
Known discordances remain: BL-TP-MRX-A4 (L1/L2/L3), BL-TP-PS-A6 (L1/L2/B1 boundary), TP-MRX-A4 (L7 classification inversion).
Concordance totals and S/F/I assessment deferred.
```

---

## Completion Checklist

*Verify all required analyses completed before recommendation drafting.*

### Prerequisites

- [x] E1 workbook complete — 14/14 bodies, 6/6 pairs
- [x] Blind gate opened and attested
- [x] E0 workbook accessed for comparison only after blind gate
- [x] This report populated from workbook and E0 reference (matrix sections)

### Analysis sections

- [x] § Evaluation Coverage — counts verified
- [x] § Verdict Agreement — 12 paired rows complete
- [x] § Pair Classification Agreement — 6 rows complete
- [x] § Layer Agreement Analysis — L1–L7 complete
- [x] § Boundary Exercise Review — B1 and B2 complete
- [x] § Disagreement Register — disagreements logged with layer attribution (resolution pending)
- [x] § Success Criteria Review — S1–S9 each marked
- [x] § Failure Criteria Review — F1–F7 each marked
- [x] § Inconclusive Criteria Review — I1–I7 assessed
- [ ] § Recommendation Input Summary — proceed/repeat/stop evidence drafted

### Threshold calculations

- [x] Pair concordance count: 5/6
- [x] Verdict concordance count: 10/12
- [x] Classification inversion count recorded
- [x] S5 verdict-first check completed
- [x] F2 incompatible verdict count recorded
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
| Analysis phase | `SPRINT-45-2-EXECUTION-PLAN.md` Phase 4 step 4.4 |
| Workbook cross-reference | `45-2-evidence-workbook.md` § Agreement Summary |
| E0 reference | `45-1-evidence-workbook.md` |
