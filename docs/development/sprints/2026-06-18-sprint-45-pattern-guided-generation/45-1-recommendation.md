# 45-1 Recommendation Report

**Experiment ID:** 45-1  
**Evaluation completed:** 2026-06-18  
**Evaluator:** Sprint 45 evidence collection (session)  
**Design authority:** [45-1-pattern-injection-experiment-design.md](45-1-pattern-injection-experiment-design.md)  
**Evidence source:** [45-1-evidence-workbook.md](45-1-evidence-workbook.md) only

## Experiment Summary

45-1 completed all six obligation-matched baseline/treatment pairs across `decision_table` (SP-02) and `transfer_prompt` (SP-03). Primary evidence (44-2 contract verdicts) shows four Photosynthesis remediation improvements and two Marx maintain-test no-change outcomes. No pair-level regressions occurred. No ownership regressions were recorded. Anti-mimicry checks were negative across all pairs.

High-level totals from workbook:

| Metric | Value |
| ------ | ----- |
| Pairs completed | 6/6 |
| Improvements | 4 |
| No Change | 2 |
| Regressions | 0 |
| Inconclusive | 0 |
| Photosynthesis remediation rate | 4/4 |
| Ownership regressions | 0 |
| FM aggregate delta (treatment vs baseline) | FM-04: reduced (2 -> 0) · FM-02: reduced (1 -> 0) · FM-03: reduced (2 -> 0) |

## Pair Results

| Pair | Baseline -> Treatment | Classification | FM Delta | Ownership |
| ---- | --------------------- | -------------- | -------- | --------- |
| DT-MRX-A4 | Strong -> Strong | No Change | FM-04 unchanged (absent both) | Pass -> Pass (no regression) |
| DT-PS-A4 | Minimum -> Strong | Improvement | FM-04 reduced (present -> absent) | Pass -> Pass (no regression) |
| DT-PS-A6 | Minimum -> Strong | Improvement | FM-04 reduced (present -> absent) | Pass -> Pass (no regression) |
| TP-MRX-A4 | Strong -> Strong | No Change | FM-02/FM-03 unchanged (absent both) | Pass -> Pass (no regression) |
| TP-PS-A4 | Failed -> Strong | Improvement | FM-02 reduced; FM-03 reduced | Pass -> Pass (no regression) |
| TP-PS-A6 | Failed -> Strong *(under declared M22 interpretation)* | Improvement | FM-02 unchanged (absent both); FM-03 reduced | Pass -> Pass (no regression) |

## SP-02 Findings

Assessed pairs: `DT-MRX-A4`, `DT-PS-A4`, `DT-PS-A6`.

- **Marx maintain-test:** `DT-MRX-A4` held Strong -> Strong with FM-04 absent in both baseline and treatment; no ownership regression; anti-mimicry no.
- **Photosynthesis remediation A4:** `DT-PS-A4` improved Minimum -> Strong with FM-04 cleared; Strong outcome tied to partial-exemplar reasoning row with learner judgement cells remaining empty.
- **Photosynthesis remediation A6:** `DT-PS-A6` improved Minimum -> Strong with FM-04 cleared; workbook explicitly distinguishes substantive exemplar reasoning from superficial non-empty cell completion.
- **Pattern-level interpretation:** SP-02 evidence meets both maintain and remediation expectations in-scope: hold on already-Strong Marx reference and improvement on both Photosynthesis FM-04 targets.

## SP-03 Findings

Assessed pairs: `TP-MRX-A4`, `TP-PS-A4`, `TP-PS-A6`.

- **Marx maintain-test:** `TP-MRX-A4` held Strong -> Strong; FM-02/FM-03 absent in both conditions; ownership preserved.
- **Photosynthesis remediation A4:** `TP-PS-A4` improved Failed -> Strong with FM-02/FM-03 both reduced; workbook attributes gain to learner-context selection plus substantive transfer scaffolding, not transfer-slot presence.
- **Photosynthesis boundary A6 (M22):** `TP-PS-A6` baseline recorded as Failed under declared Inter-Rater conjunctive minimum (completion criterion present, own-context absent); treatment Strong with explicit learner-context selection and FM-03 reduction.
- **Pattern-level interpretation:** SP-03 evidence supports maintain on Marx and remediation on both Photosynthesis transfer pairs under the declared boundary interpretation.

## Success Criteria Review

Against approved 45-1 criteria:

| Criterion | Result | Evidence |
| --------- | ------ | -------- |
| Contract improvement or Strong maintained | Met (6/6) | 4 improvements + 2 Strong holds |
| Target FM absent in treatment | Met (6/6) | FM-04 absent on all treatment decision tables; FM-02/FM-03 absent on all treatment transfer prompts |
| Ownership preserved | Met (6/6) | No treatment ownership regression flags |
| Pattern signals present (secondary) | Met (6/6 treatment bodies) | SP-02/SP-03 Strong signal profiles recorded on treatments |
| Photosynthesis remediation majority | Met | 4/4 Photosynthesis pairs improved |
| Cross-domain signal (>=1 PS DT + >=1 PS TP Strong) | Met | DT-PS-A4/A6 Strong; TP-PS-A4/A6 Strong |
| Not mimicry | Met | Mimicry suspect = no across pairs |
| Primary measure shift toward Strong without Failed increase | Met | Baseline Failed pairs improved; treatment set contains no Failed verdicts |

Convergent evidence standard is satisfied on all four Photosynthesis pairs (4/4).

## Failure Criteria Review

| Failure Condition | Triggered? | Evidence |
| ----------------- | ---------- | -------- |
| Verdict regression vs paired baseline | No | 0 regressions |
| Target FM present in treatment | No | FM targets absent in treatment outputs |
| Ownership violation / regression | No | 0 ownership regressions |
| Superficial pattern match without verdict improvement | No | No such flags in workbook outcomes |
| Benchmark mimicry/domain-inappropriate copying | No | Anti-mimicry checks all negative |
| No Photosynthesis pair improves | No | 4/4 improved |
| Treatment FM aggregate increases vs baseline | No | FM-04, FM-02, FM-03 all reduced or unchanged favorable |
| Marx treatment regresses from Strong | No | Both Marx pairs remained Strong |

No experiment-level failure criteria were triggered.

## Ownership Review

Workbook evidence shows ownership preserved across all six treatment bodies:

- `decision_table` treatments retained learner-owned judgement loci (judgement/impact cells left empty, exemplar judgement not pre-filled).
- `transfer_prompt` treatments did not provide pre-written learner responses.
- No treatment body was flagged with ownership regression.
- TP-PS-A6 baseline FM-03 weakness was context-framing, not ownership collapse; treatment corrected framing while keeping outputs learner-owned.

Overall ownership result: **pass across all pairs**.

## Anti-Mimicry Review

Workbook corpus-comparison entries report `mimicry suspect = no` for all six pairs.

- Marx treatment pairs retained Strong feature sets with lexical variation from frozen references (no verbatim replication concern).
- Photosynthesis remediation pairs moved toward Strong feature sets while remaining domain-specific:
  - SP-02 outputs used Photosynthesis claims/factors and scenario links (not Marx criteria-text transplant).
  - SP-03 outputs used Photosynthesis misconceptions/ecological contexts and A4/A6 transfer framing (not Marx transfer-content transplant).
- Reported improvements are tied to contract-realisation moves (exemplar reasoning, context selection, operational criteria, multi-cue transfer), not surface format imitation.

Anti-mimicry attestation: **supported by workbook evidence**.

## M22 Boundary Note

TP-PS-A6 was treated as the designated boundary pair with explicit in-pair declaration:

- Applied interpretation: **Inter-Rater conjunctive** §5.8 minimum (own-context + completion both required).
- Baseline M22 under this declaration: **Failed** (completion criterion present; own-context absent; FM-03 present).
- Treatment: **Strong** with explicit learner-context selection and FM-03 absent.
- Scope discipline: this handling documents boundary ambiguity for TP-PS-A6 only; it does not reopen Sprint 44 calibration decisions or alter historical records.

## Conclusions

From workbook evidence only:

1. SP-02 and SP-03 both met maintain expectations on already-Strong Marx pairs (no degradation).
2. All four Photosynthesis remediation targets improved at verdict level, with corresponding targeted FM reductions.
3. No ownership regressions occurred in treatment outputs.
4. No anti-mimicry failures were observed; improvements were reported as instructional-function gains rather than benchmark copying.
5. The M22 boundary case was explicitly handled and documented without reopening Sprint 44 contract calibration.

## Recommendation

- [x] **Proceed to 45-2**
- [ ] Repeat 45-1 with corrections
- [ ] Stop and document negative result

**Justification:** Gate 2 execution evidence is complete (all 12 bodies collected and evaluated with verdict/FM/ownership/signal/corpus records). Gate 3 outcome evidence is satisfied by convergent Photosynthesis improvements (4/4), zero ownership regressions, and no experiment-level failure criteria triggered. The recommendation is grounded in workbook-recorded verdict deltas, FM deltas, ownership audits, anti-mimicry checks, and the documented TP-PS-A6 boundary declaration.

