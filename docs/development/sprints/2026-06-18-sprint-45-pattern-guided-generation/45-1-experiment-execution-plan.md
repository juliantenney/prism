# 45-1 Experiment Execution Plan

**Date:** 2026-06-18  
**Type:** Evidence-collection execution specification  
**Status:** Active — evidence-collection stage  
**Authority:** [45-1-pattern-injection-experiment-design.md](45-1-pattern-injection-experiment-design.md) (accepted)  
**Predecessor:** Sprint 44 closure; frozen benchmark corpus; 44-2 contracts; SP-02; SP-03

---

## Purpose

45-1 tests whether pattern-guided generation can move `decision_table` and `transfer_prompt` GAM bodies toward 44-2 Strong realisation — remediating FM-04, FM-02, and FM-03 — while preserving learner ownership. The approved design defines baseline vs treatment conditions, six obligation-matched output pairs, and a verdict-first evaluation method.

This execution plan specifies **how evidence is collected, recorded, and classified** during the experiment. It does not prescribe implementation mechanisms, prompt engineering, code changes, or any expansion beyond SP-02 and SP-03.

**Primary outcome:** Paired verdict deltas (baseline → treatment) on identical DLA obligations, supported by FM checks, ownership audits, Detection Signals (secondary), and corpus-relative comparison against frozen Marx and Photosynthesis benchmark bodies.

---

## Experimental Matrix

Six obligation-matched pairs. Each pair comprises one **baseline** body and one **treatment** body for the same domain, activity, material type, and DLA obligation. The variable between conditions is whether SP-02 or SP-03 pattern specifications inform generation intent.

### Pair DT-MRX-A4

| Field | Value |
| ----- | ----- |
| **Pair ID** | DT-MRX-A4 |
| **Domain** | Marx (`marx-capitalism-v1`) |
| **Activity** | A4 — *Was Marx Right? Final Evaluation* |
| **Material type** | `decision_table` |
| **Pattern (treatment only)** | SP-02 / DT-SP-01 |
| **DLA obligation** | Three criteria rows; partial exemplar specified |
| **Frozen reference** | M13 — Strong (Pass 2, Inter-Rater) |
| **Target FM** | FM-04 |
| **Comparison objective** | Establish whether treatment maintains or reproduces Strong realisation on an already-Strong Marx obligation; confirm FM-04 absent; detect Marx overfitting or mimicry of M13 |

### Pair DT-PS-A4

| Field | Value |
| ----- | ----- |
| **Pair ID** | DT-PS-A4 |
| **Domain** | Photosynthesis (`photosynthesis-v1`) |
| **Activity** | A4 — *Evaluating Misconceptions* |
| **Material type** | `decision_table` |
| **Pattern (treatment only)** | SP-02 / DT-SP-01 |
| **DLA obligation** | Two claim rows; model row specified |
| **Frozen reference** | M12 — Minimum; FM-04 recorded |
| **Target FM** | FM-04 |
| **Comparison objective** | Test whether SP-02 guidance remediates FM-04 on Photosynthesis evaluate arc; primary Photosynthesis remediation pair per design Gate 3 |

### Pair DT-PS-A6

| Field | Value |
| ----- | ----- |
| **Pair ID** | DT-PS-A6 |
| **Domain** | Photosynthesis (`photosynthesis-v1`) |
| **Activity** | A6 — capstone |
| **Material type** | `decision_table` |
| **Pattern (treatment only)** | SP-02 / DT-SP-01 |
| **DLA obligation** | Three factor rows |
| **Frozen reference** | M19 — Minimum; FM-04 recorded |
| **Target FM** | FM-04 |
| **Comparison objective** | Test SP-02 generalisation to capstone decision table; verdict improvement and FM-04 clearance vs baseline on same obligation |

### Pair TP-MRX-A4

| Field | Value |
| ----- | ----- |
| **Pair ID** | TP-MRX-A4 |
| **Domain** | Marx (`marx-capitalism-v1`) |
| **Activity** | A4 — capstone; `purpose: transfer` |
| **Material type** | `transfer_prompt` |
| **Pattern (treatment only)** | SP-03 / TP-SP-01 |
| **DLA obligation** | Apply evaluation lens to new context |
| **Frozen reference** | M16 — Strong (Pass 2, Inter-Rater) |
| **Target FM** | FM-02, FM-03 |
| **Comparison objective** | Establish whether treatment maintains Strong transfer on Marx capstone; confirm FM-02/FM-03 absent; detect mimicry of M16 |

### Pair TP-PS-A4

| Field | Value |
| ----- | ----- |
| **Pair ID** | TP-PS-A4 |
| **Domain** | Photosynthesis (`photosynthesis-v1`) |
| **Activity** | A4; `purpose: transfer` |
| **Material type** | `transfer_prompt` |
| **Pattern (treatment only)** | SP-03 / TP-SP-01 |
| **DLA obligation** | Transfer on misconception evaluate arc |
| **Frozen reference** | M14 — Failed; FM-02, FM-03 |
| **Target FM** | FM-02, FM-03 |
| **Comparison objective** | Test whether SP-03 guidance remediates unanimous Failed transfer; primary Photosynthesis remediation pair per design Gate 3; clearest single-type discrimination in Sprint 44 |

### Pair TP-PS-A6

| Field | Value |
| ----- | ----- |
| **Pair ID** | TP-PS-A6 |
| **Domain** | Photosynthesis (`photosynthesis-v1`) |
| **Activity** | A6 — capstone; `purpose: transfer` |
| **DLA obligation** | Capstone transfer |
| **Material type** | `transfer_prompt` |
| **Pattern (treatment only)** | SP-03 / TP-SP-01 |
| **Frozen reference** | M22 — Minimum (Pass 2) / Failed (Inter-Rater); FM-03 risk |
| **Target FM** | FM-02, FM-03 |
| **Comparison objective** | Test SP-03 on capstone transfer; document M22-boundary handling; declare §5.8 minimum interpretation used; do not treat outcome alone as SP-03 validation or invalidation |

### Matrix summary

| Pair ID | Domain | Activity | Material type | Pattern | Frozen ref | Primary comparison |
| ------- | ------ | -------- | ------------- | ------- | ---------- | ------------------ |
| DT-MRX-A4 | Marx | A4 | `decision_table` | SP-02 | M13 Strong | Maintain Strong; no FM-04 |
| DT-PS-A4 | Photosynthesis | A4 | `decision_table` | SP-02 | M12 Min / FM-04 | Remediate FM-04; verdict ↑ |
| DT-PS-A6 | Photosynthesis | A6 | `decision_table` | SP-02 | M19 Min / FM-04 | Remediate FM-04; verdict ↑ |
| TP-MRX-A4 | Marx | A4 | `transfer_prompt` | SP-03 | M16 Strong | Maintain Strong; no FM-02/03 |
| TP-PS-A4 | Photosynthesis | A4 | `transfer_prompt` | SP-03 | M14 Failed | Remediate FM-02/03; verdict ↑ |
| TP-PS-A6 | Photosynthesis | A6 | `transfer_prompt` | SP-03 | M22 boundary | SP-03 signals; document ambiguity |

**Totals:** 6 pairs · 12 bodies (6 baseline + 6 treatment) · 2 domains · 2 material types · 2 patterns

---

## Evidence Collection Procedure

Evidence collection follows the approved design evaluation layers in fixed order. Body text is the evaluation unit throughout. Page composition and capture channel are recorded separately when observed but do not substitute for body scoring.

### 1. Baseline generation collection

**Objective:** Obtain pre-pattern GAM material bodies for all six target slots under baseline condition.

**Procedure:**

1. **Confirm obligation anchor** — For each pair, record the DLA `required_materials` entry (type, purpose, specification) from frozen `design-learning-activities.json` for the named domain and activity. This obligation text is the generation anchor and must be identical for the paired treatment run.
2. **Confirm upstream anchor** — Record that generation uses the frozen benchmark upstream artefact chain for the domain (learning content, knowledge model, outcomes, episode plans, activities as frozen). No obligation or upstream drift between baseline and treatment.
3. **Collect baseline bodies** — Obtain one GAM material body per pair under baseline condition: generation for the target slot **without** SP-02 or SP-03 pattern specifications informing generation intent.
4. **Record body artefact** — Store the full verbatim body text for each baseline output. Assign stable artefact IDs: `BL-{PairID}` (e.g. `BL-DT-PS-A4`).
5. **Record capture-channel observations** — Note FM-01 stub emission or FM-12 composition issues if present. Classify as capture/channel; do not score as instructional FM-04/FM-02/FM-03.
6. **Do not score during collection** — Baseline bodies are collected first; evaluation is a separate step (§3).

**Frozen corpus role:** Benchmark bodies (M12, M13, M14, M16, M19, M22) are **comparative anchors**, not substitutes for new baseline bodies. Where historical corpus verdicts are cited, label them `frozen-corpus` in the worksheet. New baseline bodies are scored independently and compared to both paired treatment and frozen reference.

**Expected baseline profile (diagnostic, not gating):** Photosynthesis pairs may exhibit FM-04 (`decision_table`) or FM-02/FM-03 (`transfer_prompt`) consistent with Sprint 44 Pass 2. Marx pairs may already meet Strong threshold.

### 2. Treatment generation collection

**Objective:** Obtain pattern-guided GAM material bodies for the same six slots under treatment condition.

**Procedure:**

1. **Match obligation and upstream** — Use identical DLA obligation and frozen upstream artefact chain as the paired baseline for each pair ID.
2. **Apply pattern guidance** — Obtain one GAM material body per pair under treatment condition: generation for the target slot **with** SP-02 (for `decision_table`) or SP-03 (for `transfer_prompt`) pattern specifications informing generation intent per approved design.
3. **Record body artefact** — Store full verbatim body text. Assign stable artefact IDs: `TR-{PairID}` (e.g. `TR-DT-PS-A4`).
4. **Record capture-channel observations** — Same FM-01/FM-12 separation as baseline.
5. **Do not score during collection** — Treatment bodies are collected before evaluation.

**Treatment invariant check at collection (factual only):** Record whether the body is domain-appropriate (Marx vs Photosynthesis content) and whether obvious verbatim copy of M13/M16 text into Photosynthesis slots is present. Full anti-mimicry review occurs at evaluation.

### 3. Evaluation sequence

Evaluation runs **after** all 12 bodies are collected. Apply layers in strict priority order per approved design.

| Step | Layer | Action | Applies to |
| ---- | ----- | ------ | ---------- |
| 1 | **44-2 verdict (primary)** | Score each body independently against §5.6 (`decision_table`) or §5.8 (`transfer_prompt`). Record Failed / Minimum / Strong with contract-bullet justification. | All 12 bodies |
| 2 | **Paired delta** | Compare baseline verdict → treatment verdict for each pair. Assign result classification (§ Result Classification). | 6 pairs |
| 3 | **Detection Signals (secondary)** | Apply SP-02 or SP-03 checklist to treatment bodies. Apply same checklist to baseline for diagnostic comparison. | All 12 bodies (treatment primary) |
| 4 | **Failure Mode checks** | Record FM-04 (`decision_table`); FM-02, FM-03 (`transfer_prompt`) as present/absent per body. Compare baseline vs treatment per pair. | 12 bodies |
| 5 | **Learner ownership audit** | Run mandatory pass/fail checks per material type. Flag ownership regression if treatment fills loci baseline left empty. | All 12 bodies; regression check per pair |
| 6 | **Corpus-relative comparison** | Compare treatment (and baseline where useful) against frozen reference ID for the pair. Assess Strong-reference proximity, weak-reference distance, cross-domain generalisation. | 6 pairs |
| 7 | **DLA cross-check** | If DLA specifies partial exemplar and `decision_table` body has none, record FM-04 even when Minimum met (M12 precedent). | `decision_table` bodies |
| 8 | **M22 boundary declaration** | For TP-PS-A6 only: declare §5.8 minimum interpretation applied (Pass 2 compensatory vs Inter-Rater conjunctive). | TP-PS-A6 treatment (+ baseline) |

**Evaluator discipline:**

- Verdict justification cites 44-2 contract bullets, not pattern names alone.
- Pattern Detection Signals do not override verdict.
- FM-01 and FM-12 are never scored as FM-04, FM-02, or FM-03.
- Score GAM body text only; do not penalise bodies for FM-12 page-composition loss in the same pass.

### 4. Evidence recording sequence

After evaluation, assemble the experiment record in this order:

1. **Experiment metadata** — Date range, evaluator identity, design document version, corpus IDs, obligation file paths.
2. **Artefact register** — All 12 body IDs with domain, activity, material type, condition (baseline/treatment), full body text or immutable reference.
3. **Completed worksheets** — One worksheet per pair (§ Evaluation Worksheet Structure).
4. **Aggregate tables** — Verdict distribution (baseline vs treatment); FM incidence; ownership pass/fail summary; pair-level result classifications.
5. **Corpus-relative notes** — Per-pair comparison to frozen reference (M12–M22 as applicable).
6. **Experiment-level assessment** — Success criteria review, failure criteria review, recommendation (§ Recommendation Template).
7. **Gate evidence checklist** — Gate 2 and Gate 3 items from approved design § Recommendation Gate.

**Chain integrity:**

```text
Frozen DLA obligation (recorded)
    → baseline body (BL-*)
    → treatment body (TR-*)
    → 44-2 verdict + justification (each body)
    → paired delta + result classification (each pair)
    → FM + ownership + Detection Signals + corpus-relative (each pair)
    → experiment recommendation
```

---

## Evaluation Worksheet Structure

One worksheet per pair. A second reviewer must be able to reproduce verdicts from recorded body text and justifications alone.

### Worksheet header

| Field | Description |
| ----- | ----------- |
| `worksheet_id` | Same as Pair ID (e.g. `DT-PS-A4`) |
| `evaluator` | Name or identifier |
| `evaluation_date` | ISO date |
| `design_ref` | `45-1-pattern-injection-experiment-design.md` (accepted) |
| `domain` | `marx-capitalism-v1` or `photosynthesis-v1` |
| `activity` | Activity ID and title |
| `material_type` | `decision_table` or `transfer_prompt` |
| `pattern` | SP-02 or SP-03 (treatment condition) |
| `contract_section` | 44-2 §5.6 or §5.8 |
| `frozen_reference_id` | M12, M13, M14, M16, M19, or M22 |
| `dla_obligation_ref` | Path + activity + `required_materials` index |
| `baseline_artefact_id` | e.g. `BL-DT-PS-A4` |
| `treatment_artefact_id` | e.g. `TR-DT-PS-A4` |

### Body record (per condition)

| Field | Baseline | Treatment |
| ----- | -------- | --------- |
| `body_text` | Full verbatim GAM body | Full verbatim GAM body |
| `capture_fm01` | present / absent | present / absent |
| `capture_fm12` | present / absent / not assessed | present / absent / not assessed |

### Verdict fields (primary)

| Field | Baseline | Treatment |
| ----- | -------- | --------- |
| `verdict` | Failed / Minimum / Strong | Failed / Minimum / Strong |
| `contract_observations` | Bullet list citing §5.6 or §5.8 minimum, strong, and/or failure-mode bullets observed | Same |
| `verdict_justification` | 2–5 sentences; contract bullets only | 2–5 sentences; contract bullets only |
| `frozen_corpus_verdict` | Historical verdict on frozen reference (from Sprint 44) | N/A — compare treatment to frozen ref in corpus-relative section |

### Detection-signal observations (secondary)

| Field | Baseline | Treatment |
| ----- | -------- | --------- |
| `detection_signal_checklist` | SP-02 or SP-03 checklist items: met / not met / n/a per item | Same |
| `detection_signal_summary` | Minimum / Strong / Weak / Failed signal profile | Same |
| `superficial_match_flag` | n/a or yes — pattern-shaped but verdict weak | yes / no — treatment only meaningful field |

### FM observations

| Field | Baseline | Treatment | Delta |
| ----- | -------- | --------- | ----- |
| `fm04` | present / absent | present / absent | reduced / unchanged / increased / n/a |
| `fm02` | present / absent / n/a | present / absent / n/a | reduced / unchanged / increased / n/a |
| `fm03` | present / absent / n/a | present / absent / n/a | reduced / unchanged / increased / n/a |
| `fm_notes` | Free text; DLA cross-check; M22 boundary if applicable | Same | |

### Learner ownership observations

| Field | Baseline | Treatment |
| ----- | -------- | --------- |
| `ownership_judgement_cells_empty` | pass / fail / n/a | pass / fail / n/a |
| `ownership_no_prefilled_ratings` | pass / fail / n/a | pass / fail / n/a |
| `ownership_exemplar_judgement_empty` | pass / fail / n/a | pass / fail / n/a |
| `ownership_no_prewritten_transfer` | pass / fail / n/a | pass / fail / n/a |
| `ownership_learner_context_framing` | pass / fail / n/a / not required | pass / fail / n/a |
| `ownership_overall` | pass / fail | pass / fail |
| `ownership_regression` | — | yes / no — treatment fills loci baseline left empty |
| `ownership_notes` | Free text | Free text |

### Corpus-relative observations

| Field | Description |
| ----- | ----------- |
| `frozen_reference_body` | Citation or excerpt from benchmark corpus for frozen reference ID |
| `strong_reference_proximity` | Does treatment move toward M13/M16 feature set without copying? closer / same / farther / n/a |
| `weak_reference_distance` | Does treatment avoid M12/M19/M14 failure shapes? yes / partial / no |
| `cross_domain_note` | Photosynthesis improvement vs Marx hold/regress |
| `mimicry_suspect` | yes / no — verbatim or domain-inappropriate M13/M16 transplant |
| `corpus_relative_summary` | 2–4 sentences |

### Pair summary

| Field | Description |
| ----- | ----------- |
| `paired_verdict_delta` | e.g. Minimum → Strong |
| `result_classification` | improvement / no_change / regression / inconclusive |
| `per_output_success` | met / not_met / n/a — per design § Per-output success |
| `pair_notes` | Free text |

---

## Result Classification

Classify each **pair** after paired verdict comparison. Classification uses baseline and treatment verdicts plus ownership regression override.

### Verdict ordering

For delta purposes:

```text
Failed < Minimum < Strong
```

### improvement

**Definition:** Treatment verdict is strictly higher than baseline on the same obligation, target FM absent in treatment, ownership preserved (no regression), and ownership overall pass on treatment.

| Example delta | Qualifies if |
| ------------- | ------------ |
| Failed → Minimum | FM cleared; ownership pass |
| Failed → Strong | FM cleared; ownership pass |
| Minimum → Strong | FM cleared; ownership pass |
| Strong → Strong | Marx pairs: maintain Strong; FM absent; ownership pass — classified **improvement** only when FM was present in baseline and cleared in treatment, or when contract observations document meaningful strong-bar reinforcement. Otherwise use **no_change**. |

**Not improvement alone:** Detection Signals present without verdict rise; FM cleared but verdict unchanged (record in worksheet; may contribute to experiment-level FM reduction but pair is **no_change** unless verdict rises).

### no_change

**Definition:** Treatment verdict equals baseline; or Strong maintained on Marx already-Strong obligation without FM clearance event; ownership preserved.

| Situation | Classification |
| --------- | -------------- |
| Minimum → Minimum | no_change |
| Strong → Strong (Marx hold) | no_change — expected on DT-MRX-A4, TP-MRX-A4 |
| FM reduced but verdict unchanged | no_change — note FM delta in worksheet |
| Baseline and treatment both Failed with identical profile | no_change |

### regression

**Definition:** Any of the following:

| Condition | Classification |
| --------- | -------------- |
| Treatment verdict strictly lower than baseline | regression |
| Ownership regression on treatment | regression — regardless of verdict |
| Treatment ownership overall fail | regression — regardless of verdict |
| Superficial pattern match: Detection Signals largely met, verdict same or worse, pattern-shaped output | regression if verdict worse; no_change if same (flag superficial_match) |
| Benchmark mimicry confirmed with domain-inappropriate copy | regression |

### inconclusive

**Definition:** Pair cannot be classified improvement/regression/no_change without disputed interpretation. Does not count toward experiment-level success or hard failure alone.

| Situation | Classification |
| --------- | -------------- |
| TP-PS-A6: Minimum under Pass 2 reading, Failed under Inter-Rater reading | inconclusive — declare interpretation used |
| FM-01 stub on treatment body; body not re-collected | inconclusive for pair until body re-collected or stub excluded by capture record |
| Baseline or treatment body missing or obligation drift detected | inconclusive — halt pair until corrected |
| Evaluator cannot determine ownership pass/fail from recorded text | inconclusive — complete ownership_notes |

### Pair-level success flag (derived)

| Flag | Rule |
| ---- | ---- |
| `pair_success` | result_classification = improvement AND per_output_success = met |
| `pair_failure` | result_classification = regression OR (treatment superficial_match_flag = yes AND verdict not improved) |
| `pair_inconclusive` | result_classification = inconclusive |

### Experiment-level aggregation

| Metric | Rule |
| ------ | ---- |
| Photosynthesis remediation rate | Count improvement on DT-PS-A4, DT-PS-A6, TP-PS-A4, TP-PS-A6 ÷ 4 |
| Meaningful result (Gate 3) | ≥50% of Photosynthesis pairs meet convergent evidence standard (design § Evidence Standard) |
| Experiment-level failure | Per design § Experiment-level failure — assessed in Recommendation Template |

---

## Evidence Logging Requirements

### Immutable artefacts

| Requirement | Detail |
| ----------- | ------ |
| **Body preservation** | Full verbatim text for all 12 bodies at time of evaluation |
| **Stable IDs** | `BL-{PairID}` and `TR-{PairID}` never reused for different text |
| **Obligation snapshot** | Copy of relevant DLA `required_materials` entry per pair |
| **Timestamp** | Collection date per body; evaluation date per worksheet |

### Reproducibility

| Requirement | Detail |
| ----------- | ------ |
| **Contract citations** | Every verdict lists specific 44-2 §5.6 or §5.8 bullets |
| **Frozen reference citation** | Corpus path + material ID (e.g. `benchmark-corpus/photosynthesis/learning-materials.txt` → M12) |
| **Checklist state** | Detection Signals recorded as met/not met per item, not summary-only |
| **M22 declaration** | TP-PS-A6 worksheet must state Pass 2 or Inter-Rater minimum interpretation |
| **Second reviewer** | Independent reviewer can re-score from logged body + obligation without access to generation process |

### Separation of channels

| Channel | Log under | Do not conflate with |
| ------- | --------- | --------------------- |
| GAM body instructional quality | Worksheet verdict, FM-04/02/03 | FM-01, FM-12 |
| FM-01 stub | `capture_fm01` | FM-02 thin transfer |
| FM-12 composition | `capture_fm12` | FM-04 table shell |

### File organisation (recommended)

```text
45-1-evidence/
  experiment-metadata.md
  artefacts/
    BL-DT-MRX-A4.txt
    TR-DT-MRX-A4.txt
    … (12 body files)
  worksheets/
    DT-MRX-A4-worksheet.md
    … (6 worksheets)
  45-1-recommendation.md
```

Paths are illustrative. Location is team choice; structure and field completeness are mandatory.

### Gate 2 checklist (required before 45-2)

| Item | Evidence location |
| ---- | ----------------- |
| 6 baseline + 6 treatment bodies | Artefact register |
| All 12 bodies scored | Worksheets |
| FM-04, FM-02, FM-03 per body | Worksheets |
| Ownership audit complete | Worksheets |
| Detection Signals on treatment set | Worksheets |

---

## Recommendation Template

Complete after all worksheets and aggregate tables are finished. Copy this section into `45-1-recommendation.md`.

---

# 45-1 Experiment Recommendation

**Experiment ID:** 45-1  
**Evaluation completed:** [DATE]  
**Evaluator(s):** [NAME(S)]  
**Design authority:** 45-1-pattern-injection-experiment-design.md (accepted)

## Summary

| Metric | Value |
| ------ | ----- |
| Pairs completed | /6 |
| Pairs improvement | |
| Pairs no_change | |
| Pairs regression | |
| Pairs inconclusive | |
| Photosynthesis remediation rate | /4 |
| Ownership regressions | |
| FM aggregate delta (treatment vs baseline) | FM-04: ; FM-02: ; FM-03: |

---

### Findings

**Per-pair summary**

| Pair ID | Baseline verdict | Treatment verdict | Delta | Result | FM delta | Ownership |
| ------- | ---------------- | ----------------- | ----- | ------ | -------- | --------- |
| DT-MRX-A4 | | | | | | |
| DT-PS-A4 | | | | | | |
| DT-PS-A6 | | | | | | |
| TP-MRX-A4 | | | | | | |
| TP-PS-A4 | | | | | | |
| TP-PS-A6 | | | | | | |

**Cross-cutting findings**

- Photosynthesis vs Marx:
- Pattern features correlating with verdict improvement:
- Superficial matches observed:
- M22 boundary handling:
- Capture artefacts (FM-01/FM-12):

---

### Success Criteria Review

**Per-output success (treatment bodies)**

| Criterion | Met (count/6) | Notes |
| --------- | ------------- | ----- |
| Contract improvement or Strong maintained | | |
| Target FM absent | | |
| Ownership preserved | | |
| Pattern signals present (secondary) | | |

**Experiment-level success (design § Experiment-level success)**

| Criterion | Met? | Evidence |
| --------- | ---- | -------- |
| Photosynthesis remediation (majority of 4 PS pairs) | yes / no | |
| No systematic ownership regression | yes / no | |
| Cross-domain signal (≥1 PS decision_table + ≥1 PS transfer_prompt Strong with signals) | yes / no | |
| Not mimicry | yes / no | |
| Primary measure: verdict shift toward Strong without Failed increase | yes / no | |

**Meaningful result (design § Evidence Standard)**

Convergent evidence on Photosynthesis pairs: /4

```text
[ ] Pattern Detection Signals present (treatment)
[ ] 44-2 verdict improvement or Strong maintained
[ ] FM-04 / FM-02 / FM-03 reduction on PS targets
[ ] Learner ownership preserved
[ ] Corpus-relative movement toward Strong features — not text reproduction
```

---

### Failure Criteria Review

**Per-output failures observed**

| Condition | Count | Pair IDs |
| --------- | ----- | -------- |
| Verdict regression | | |
| Target FM in treatment | | |
| Ownership violation | | |
| Superficial pattern match | | |
| Benchmark mimicry | | |

**Experiment-level failure (design § Experiment-level failure)**

| Condition | Triggered? | Notes |
| --------- | ---------- | ----- |
| No Photosynthesis pair improves | yes / no | |
| Treatment increases FM aggregate vs baseline | yes / no | |
| Systematic ownership regression | yes / no | |
| Detection Signals majority without verdict improvement | yes / no | |
| Marx treatment regresses from Strong | yes / no | |

---

### Ownership Review

| Pair ID | Baseline ownership | Treatment ownership | Regression? |
| ------- | ------------------ | ------------------- | ----------- |
| DT-MRX-A4 | pass / fail | pass / fail | yes / no |
| DT-PS-A4 | pass / fail | pass / fail | yes / no |
| DT-PS-A6 | pass / fail | pass / fail | yes / no |
| TP-MRX-A4 | pass / fail | pass / fail | yes / no |
| TP-PS-A4 | pass / fail | pass / fail | yes / no |
| TP-PS-A6 | pass / fail | pass / fail | yes / no |

**Ownership summary:** [2–4 sentences — MP-1 compliance, scaffold-vs-deliverable issues, pre-filled judgement or pre-written transfer incidents]

---

### Anti-Mimicry Review

| Pair ID | Mimicry suspect? | Domain-appropriate? | Notes |
| ------- | ---------------- | ------------------- | ----- |
| DT-MRX-A4 | | | |
| DT-PS-A4 | | | |
| DT-PS-A6 | | | |
| TP-MRX-A4 | | | |
| TP-PS-A4 | | | |
| TP-PS-A6 | | | |

**Anti-mimicry attestation:** Treatment improvement is instructional (contract + move performance), not verbatim reproduction of M13/M16 across domains. **yes / no**

**Reviewer statement:** [1–3 sentences]

---

### Recommendation

Select **one**:

- [ ] **Proceed to 45-2** — Gate 2 complete; Gate 3 outcome evidence supports pattern-aware evaluation method finalisation
- [ ] **Repeat 45-1 with corrections** — Partial evidence; specific correction: [describe — e.g. obligation drift, stub re-collection, ambiguous pair only]
- [ ] **Stop and document negative result** — Experiment-level failure; document learning per Gate 4; do not expand to SP-01/SP-04/SP-05/SP-06

**Rationale:** [Paragraph citing primary verdict data, FM delta, ownership, anti-mimicry, and Gate 2/3 thresholds]

**Gate status**

| Gate | Status |
| ---- | ------ |
| Gate 2 — Execution evidence | complete / incomplete |
| Gate 3 — Outcome evidence | pass / fail / n/a |
| Gate 4 — Negative result documentation | required / n/a |

**Signed:** [Evaluator] · [Date]

---

## Traceability

| Link | Reference |
| ---- | --------- |
| **Approved design** | [45-1-pattern-injection-experiment-design.md](45-1-pattern-injection-experiment-design.md) |
| **44-2 contracts** | [../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) |
| **SP-02** | [../2026-06-15-sprint-44/patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md](../2026-06-15-sprint-44/patterns/SP-02-DT-SP-01-partial-exemplar-decision-table.md) |
| **SP-03** | [../2026-06-15-sprint-44/patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md](../2026-06-15-sprint-44/patterns/SP-03-TP-SP-01-capstone-transfer-prompt.md) |
| **Benchmark corpus** | [../2026-06-15-sprint-44/benchmark-corpus/](../2026-06-15-sprint-44/benchmark-corpus/) |
| **Sprint 45 slice index** | [sprint-45-slice-index.md](sprint-45-slice-index.md) |

---

## Document Status

| Field | Value |
| ----- | ----- |
| **Stage** | Evidence collection (active) |
| **Implementation** | Out of scope |
| **Next artefact** | Completed worksheets + 45-1-recommendation.md |
