# 45.2 Recommendation

**Experiment:** 45-2 Pattern-Aware Evaluation Repeatability Study  
**Document type:** Sprint recommendation (Phase 5)  
**Status:** Final — route selected  
**Authority:** [SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md](SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md) · [SPRINT-45-2-EXECUTION-PLAN.md](SPRINT-45-2-EXECUTION-PLAN.md) · [45-2-pattern-aware-evaluation-protocol.md](45-2-pattern-aware-evaluation-protocol.md) · [45-2-evidence-workbook.md](45-2-evidence-workbook.md) · [45-2-repeatability-agreement-report.md](45-2-repeatability-agreement-report.md)

**Non-goals:** Redesign of protocol/design/scope.

**Prerequisite:** Phase 4 complete and agreement report populated.

---

## Experiment Summary

| Field | Value |
| ----- | ----- |
| **Experiment ID** | 45-2 |
| **Protocol version** | 1.0 (frozen) |
| **Protocol file** | `45-2-pattern-aware-evaluation-protocol.md` |
| **Workbook file** | `45-2-evidence-workbook.md` |
| **Agreement report file** | `45-2-repeatability-agreement-report.md` |
| **E0 reference** | `45-1-evidence-workbook.md` |
| **E0 evaluator code** | E0 |
| **E1 evaluator code** | E1-45-2-01 |
| **E2 adjudicator code** | n/a |
| **E1b evaluator code** | n/a |
| **Evaluation completed** | yes |
| **Recommendation drafted** | 2026-06-16 |

### Artefact counts

| Metric | Target | Actual |
| ------ | ------ | ------ |
| **Bodies evaluated (E1)** | 14 | 14 |
| **45.1 paired bodies** | 12 | 12 |
| **Holdout bodies** | 2 | 2 |
| **Pairs classified (E1)** | 6 | 6 |
| **Boundary exercises** | 2 (B1, B2) | 2 |

### Completion status

| Component | Complete |
| --------- | -------- |
| Protocol frozen (S1) | [x] |
| E1 workbook — 14/14 bodies | [x] |
| E1 workbook — 6/6 pairs | [x] |
| Holdouts HO-DT-01, HO-TP-01 | [x] |
| Boundary annex B1 + B2 | [x] |
| Blind gate observed | [x] |
| Agreement report complete | [x] |
| Sprint 45.2 execution complete | [x] |

### Aggregate outcomes (placeholder)

| Metric | Value |
| ------ | ----- |
| **Pair concordance (E0 vs E1)** | 5/6 |
| **Verdict concordance (paired bodies)** | 10/12 |
| **Classification inversions (Improvement ↔ No Change)** | 1 |
| **Holdout evaluation status** | [x] complete  [ ] partial  [ ] not done |
| **Boundary exercise status** | [x] B1 complete  [x] B2 complete |

---

## Repeatability Findings

*Summary of whether the Sprint 45.1 pattern-aware evaluation method demonstrated repeatability under independent application.*

```text
Independent E1 re-application reproduced high concordance with E0 (pair 5/6; verdict 10/12),
passed verdict-first and disqualifier-path integrity checks, and met S1-S9 with no F-trigger.
However, inconclusive criterion I5 is triggered due to lack of an explicit superficial-match-positive case.
```

### Research hypothesis disposition

| Hypothesis | Disposition |
| ---------- | ----------- |
| **H₁ (repeatability supported)** | [x] supported  [ ] not supported  [ ] inconclusive |
| **H₀ (repeatability rejected)** | [x] rejected  [ ] accepted  [ ] inconclusive |

---

## Verdict Agreement Review

| Metric | Value | Threshold |
| ------ | ----- | --------- |
| **Exact verdict matches** | 10/12 | S4: ≥10/12 |
| **Verdict mismatches** | 2/12 | |
| **Incompatible verdicts without resolvable boundary** | 1/12 | F2: ≥3 |

### Summary

```text
Verdict concordance meets threshold (10/12). Two mismatches are recorded:
one unresolved non-boundary interpretation split (BL-TP-MRX-A4) and one boundary-driven split (BL-TP-PS-A6).
F2 is not triggered because incompatible unresolved mismatch count remains below threshold.
```

### Notable verdict disagreements

| Artefact ID | E0 verdict | E1 verdict | Resolved | Notes |
| ----------- | ---------- | ---------- | -------- | ----- |
| BL-TP-MRX-A4 | Strong | Minimum | [ ] yes  [x] no | Primary non-boundary L1 interpretation disagreement |
| BL-TP-PS-A6 | Failed | Minimum | [x] yes  [ ] no | Boundary-driven structural split under B1 interpretation difference |

---

## Pair Classification Review

| Metric | Value | Threshold |
| ------ | ----- | --------- |
| **Pair classification matches** | 5/6 | S3: ≥5/6 |
| **Pair classification mismatches** | 1/6 | F1: ≤3/6 |
| **Classification inversions** | 1 | F7: ≥2 with ≤3/6 |

### Per-pair summary

| Pair ID | E0 classification | E1 classification | Agreement | Notes |
| ------- | ------------------ | ----------------- | ----------- | ----- |
| DT-MRX-A4 | No Change | No Change | [x] match  [ ] mismatch | |
| DT-PS-A4 | Improvement | Improvement | [x] match  [ ] mismatch | |
| DT-PS-A6 | Improvement | Improvement | [x] match  [ ] mismatch | |
| TP-MRX-A4 | No Change | Improvement | [ ] match  [x] mismatch | Derivative from BL-TP-MRX-A4 baseline verdict split |
| TP-PS-A4 | Improvement | Improvement | [x] match  [ ] mismatch | |
| TP-PS-A6 | Improvement | Improvement | [x] match  [ ] mismatch | |

### Summary

```text
Pair concordance meets threshold at 5/6.
Single discordant pair (TP-MRX-A4) is attributed to upstream BL-TP-MRX-A4 L1 disagreement.
```

---

## Layer Agreement Review

### Layer 1 — Contract Verdict

| Metric | Value |
| ------ | ----- |
| **Agreement count** | 10/12 |
| **Material mismatches** | BL-TP-MRX-A4; BL-TP-PS-A6 |

```text
L1 remains the primary source of substantive disagreement.
One mismatch is unresolved non-boundary (BL-TP-MRX-A4); one is boundary-driven (BL-TP-PS-A6).
```

---

### Layer 2 — Detection Signals

| Metric | Value |
| ------ | ----- |
| **Signal profile compatible** | 10/12 |
| **Superficial-match flag agreement** | 12/12 |
| **S5 verdict-first check** | [x] pass  [ ] fail |
| **Signal-only Improvement pairs (E1)** | 0 |

```text
Signal-level mismatches are derivative and do not override contract verdict authority.
No signal-only Improvement classification detected.
```

---

### Layer 3 — Failure Modes

| Metric | Value |
| ------ | ----- |
| **Target FM agreement** | 11/12 |
| **Capture channel separation maintained** | [x] yes  [ ] no |

```text
Single FM mismatch (BL-TP-MRX-A4 FM-03) is derivative from baseline interpretation divergence.
No evidence of FM-driven verdict override.
```

---

### Layer 4 — Ownership Audit

| Metric | Value |
| ------ | ----- |
| **Ownership pass agreement** | 12/12 |
| **Ownership regression agreement** | 12/12 |
| **Operationalisable from protocol** | [x] yes  [ ] no |

```text
Ownership checks are complete and concordant across all paired bodies.
No ownership failure/regression disqualified any Improvement outcome.
```

---

### Layer 5 — Anti-Mimicry

| Metric | Value |
| ------ | ----- |
| **Mimicry suspect agreement** | 12/12 |
| **Operationalisable from protocol** | [x] yes  [ ] no |

```text
Mimicry suspect remains no across paired bodies for both evaluators.
No anti-mimicry disqualifier triggered.
```

---

### Layer 6 — Boundary Declaration

| Metric | Value |
| ------ | ----- |
| **B1 + B2 complete** | [x] yes  [ ] no |
| **Declaration compatibility** | [ ] compatible  [x] incompatible |
| **global_calibration_reopened** | [x] no  [ ] yes |

```text
Boundary process integrity is preserved despite B1 interpretation incompatibility.
B1 incompatibility yields structurally expected tier divergence on BL-TP-PS-A6.
```

---

### Layer 7 — Convergent Judgement

| Metric | Value |
| ------ | ----- |
| **Pair classification agreement** | 5/6 |
| **Convergent evidence reproducible** | [ ] yes  [ ] no  [x] partial |

```text
Convergent pair logic is largely reproducible with one derivative inversion (TP-MRX-A4).
```

---

## Boundary Review

### B1 — TP-PS-A6

| Field | Value |
| ----- | ----- |
| **E0 declared interpretation** | Inter-Rater conjunctive §5.8 minimum |
| **E1 declared interpretation** | Pass 2 conjunctive §5.8 minimum |
| **Agreement status** | [ ] compatible  [x] incompatible |
| **Declaration before verdict (E1)** | [x] yes  [ ] no |
| **Global calibration reopened** | [x] no  [ ] yes |
| **Impact on pair classification** | No pair split; both classify TP-PS-A6 as Improvement |

```text
Boundary incompatibility is explicit and structurally bounded.
It changes BL tier interpretation but does not collapse pair-level convergence.
```

---

### B2 — HO-TP-01 (M22)

| Field | Value |
| ----- | ----- |
| **E1 declared interpretation** | Pass 2 conjunctive §5.8 minimum |
| **Declaration before verdict** | [x] yes  [ ] no |
| **Global calibration reopened** | [x] no  [ ] yes |
| **E1 verdict under declaration** | Minimum |
| **Frozen M22 records altered** | [x] no  [ ] yes |
| **Procedure compliant** | [x] yes  [ ] no |

```text
B2 procedure executed as required before verdict on holdout.
No procedural contamination or calibration reopening detected.
```

---

## Success Criteria Review

*All S1–S9 required for proceed-to-45.3.*

| ID | Criterion | Threshold | Assessment | Evidence |
| -- | --------- | --------- | ---------- | -------- |
| **S1** | Protocol exists covering L1–L7 without 44-2/44-3 modification | Protocol file | [x] met  [ ] not_met | Protocol file + traceability |
| **S2** | Independent application complete — 12 + 2 holdouts full stack | 14/14 | [x] met  [ ] not_met | Coverage 14/14 |
| **S3** | Pair classification concordance | ≥5/6 | [x] met  [ ] not_met | 5/6 |
| **S4** | Verdict concordance (paired bodies) | ≥10/12 | [x] met  [ ] not_met | 10/12 |
| **S5** | No systematic signal override | 0 signal-only Improvement | [x] met  [ ] not_met | S5 Pass; count 0 |
| **S6** | Ownership and anti-mimicry traceable on all 14 bodies | Complete fields | [x] met  [ ] not_met | L4/L5 + disqualifier review pass |
| **S7** | Boundary exercise complete B1 + B2; no global reopening | Both touchpoints | [x] met  [ ] not_met | B1/B2 complete; no global reopen |
| **S8** | Holdouts evaluated | HO-DT-01 + HO-TP-01 | [x] met  [ ] not_met | Holdout sections complete |
| **S9** | Disagreements documented and resolvable | Utility sufficient | [x] met  [ ] not_met | Phase 4.8 attribution finalised |

**All mandatory success criteria met:** [x] yes  [ ] no

---

## Failure Criteria Review

*Any F1–F7 triggered → stop input.*

| ID | Condition | Threshold | Triggered | Evidence |
| -- | --------- | --------- | --------- | -------- |
| **F1** | Pair concordance ≤3/6 | ≤3/6 | [ ] yes  [x] no | Pair concordance 5/6 |
| **F2** | ≥3 incompatible verdicts without resolvable boundary | ≥3 bodies | [ ] yes  [x] no | Incompatible unresolved = 1 |
| **F3** | Systematic signal/verdict divergence | Per design | [ ] yes  [x] no | S5 Pass, 0 signal-only Improvement |
| **F4** | E1 Improvement where superficial-match should block | Per protocol | [ ] yes  [x] no | Phase 4.6 disqualifier pass |
| **F5** | Ownership/anti-mimicry not operationalisable | Irreducible intuition | [ ] yes  [x] no | L4/L5 operationalisable |
| **F6** | Disagreement exceeds utility | No resolution path | [ ] yes  [x] no | Phase 4.8 attribution complete |
| **F7** | ≤3/6 concordance AND ≥2 Improvement ↔ No Change inversions | Combined | [ ] yes  [x] no | 5/6 and inversions=1 |

**Any failure criterion triggered:** [ ] yes  [x] no

**Triggered failure IDs (if any):**

```text
None.
```

---

## Inconclusive Criteria Review

| ID | Condition | Applicable | Triggered | Notes |
| -- | --------- | ---------- | --------- | ----- |
| **I1** | Pair concordance 4/6 | yes | [ ] yes  [x] no | Pair concordance is 5/6 |
| **I2** | Verdict concordance 9/12 with S3 met | yes | [ ] yes  [x] no | Verdict concordance is 10/12 |
| **I3** | Single pair discordance solely on boundary declaration | yes | [ ] yes  [x] no | Discordant pair is TP-MRX-A4 (non-boundary chain) |
| **I4** | Holdout evaluation incomplete | yes | [ ] yes  [x] no | Holdouts complete |
| **I5** | No superficial-match case; all else met | yes | [x] yes  [ ] no | Triggered per frozen definition |
| **I6** | E1b disagrees with E1 on ≥3 bodies | no | [ ] yes  [ ] no  [x] n/a | E1b not used |
| **I7** | Procedural flaw — blind broken or protocol incomplete | yes | [ ] yes  [x] no | Blind integrity maintained |

**Inconclusive outcome:** [x] yes  [ ] no

**Triggered inconclusive IDs (if any):**

```text
I5
```

---

## Evidence For Repeatability

*Findings that increase confidence the method is repeatable.*

```text
Evidence supporting repeatability is strong within chartered scope:
- S1-S9 are met
- F1-F7 are not triggered
- Concordance reaches threshold floors (pair 5/6, verdict 10/12)
- S5 and disqualifier reviews pass
- Disagreements are attributed and structurally bounded.
```

| Finding | Present | Reference |
| ------- | ------- | --------- |
| Independent reviewers reach compatible verdicts on same bodies | [x] yes  [ ] no | Verdict concordance 10/12 |
| Re-scoring twelve bodies reproduces pair classifications | [x] yes  [ ] no | Pair concordance 5/6 |
| Protocol application on holdout bodies yields consistent layer outcomes | [x] yes  [ ] no | HO-DT-01 + HO-TP-01 complete |
| Boundary declaration precedent applied consistently | [x] yes  [ ] no | B1/B2 declarations pre-verdict; no global reopen |
| Verdict-first ordering preserved under E1 use | [x] yes  [ ] no | S5 Pass |
| Convergent evidence threshold reproducible | [x] yes  [ ] no | S3/S4 met |
| Evaluation utility sufficient for research gate | [x] yes  [ ] no | S9 met; F6 not triggered |

---

## Evidence Against Repeatability

*Findings that weaken confidence.*

```text
Evidence against full closure is limited but material:
- one unresolved non-boundary primary L1 disagreement (BL-TP-MRX-A4),
- one derivative pair inversion (TP-MRX-A4),
- and an inconclusive-band trigger (I5) due to missing explicit superficial-match-positive case.
```

| Finding | Present | Reference |
| ------- | ------- | --------- |
| Incompatible primary verdicts on same bodies | [x] yes  [ ] no | BL-TP-MRX-A4 |
| Materially different pair classifications on re-score | [x] yes  [ ] no | TP-MRX-A4 |
| Systematic signal/verdict divergence | [ ] yes  [x] no | S5 pass |
| Cosmetic shape passes as Improvement | [ ] yes  [x] no | Phase 4.6 pass |
| Ownership/mimicry not operationalisable | [ ] yes  [x] no | L4/L5 consistent |
| Evaluator disagreement exceeds utility | [ ] yes  [x] no | F6 not triggered |
| Boundary declarations multiply without convergence | [ ] yes  [x] no | Single B1 incompatibility, bounded |

---

## Limitations

*Known limitations explicitly recorded — required for proceed gate.*

```text
Limitations are known and bounded.
The key unresolved limitation is I5: no explicit superficial-match-positive case in paired comparison,
so disqualifier-path stress coverage remains incomplete despite passing checks on available cases.
```

| Limitation | Applies | Acceptable for proceed |
| ---------- | ------- | ---------------------- |
| Disqualifier paths unstress-tested (I5) | [x] yes  [ ] no | [ ] yes  [x] no |
| Frozen corpus holdout vs newly generated bodies | [x] yes  [ ] no | [x] yes  [ ] no |
| Single independent evaluator (E0 vs E1 only) | [x] yes  [ ] no | [x] yes  [ ] no |
| Perfect concordance not achieved | [x] yes  [ ] no | [x] yes  [ ] no |
| Other | | |

---

## Recommendation

**Select one route only after completing all review sections above.**

| Route | Selected |
| ----- | -------- |
| **Proceed to 45.3** | [ ] |
| **Repeat 45.2** | [x] |
| **Stop and document negative result** | [ ] |

### Repeat scope (if Repeat selected)

| Component to repeat | Selected |
| ------------------- | -------- |
| Full sprint (I7 only) | [ ] |
| Discordant pair(s) only | [ ] |
| Holdout component only (I4) | [ ] |
| Boundary / Layer 6 refinement (I3) | [ ] |
| Adjudication / additional rater (I6) | [ ] |
| Other — specify | [x] |

```text
Targeted repeatability extension focused on I5 closure:
introduce one explicit superficial-match-positive challenge case within SP-02/SP-03 scope,
run blind E1 scoring against frozen protocol,
and verify disqualifier-path behavior under positive superficial-match conditions.
```

### Gate statement

| Question | Answer |
| -------- | ------ |
| **Evaluation standing achieved for SP-02/SP-03 scope?** | [ ] yes  [ ] no  [x] partial |
| **Pattern-aware evaluation repeatable enough to gate further research?** | [ ] yes  [ ] no  [x] inconclusive |
| **45.3 corpus regression authorised by this outcome?** | [ ] yes  [x] no  [ ] conditional |
| **Pattern injection expansion beyond SP-02/SP-03 authorised?** | [x] no — not by 45.2  [ ] n/a |

---

## Rationale

*Justification for selected route — cite S/F/I assessments and agreement report.*

```text
Routing is Repeat 45.2 because the approved routing logic treats any triggered inconclusive criterion (I1-I7) as repeat input.
Although S1-S9 are met and no failure criteria are triggered, I5 remains active and is directly tied to coverage completeness of superficial-match stress behavior.
Given disagreement topology is bounded (one unresolved non-boundary primary split and one derivative pair inversion) and not failure-level,
the narrowest compliant action is a targeted repeat component for I5 closure rather than full stop.
Proceed is therefore not selected at this phase gate.
```

### Routing logic reference

| Route | Required conditions (from approved design) |
| ----- | -------------------------------------------- |
| **Proceed to 45.3** | S1–S9 met; no F1–F7; limitations documented; standing protocol sufficient |
| **Repeat 45.2** | I1–I7 or partial success; narrowest repeat component identified |
| **Stop** | Any F1–F7; repeat still fails S1–S9; contract ambiguity or two-layer incoherence |

---

## Frontier Impact

*Impact on PRISM research sequencing — not a redesign of frontier.*

### If Proceed to 45.3

```text
Not selected.
```

| Impact | Notes |
| ------ | ----- |
| **45.3 corpus regression** | Dependent on evaluation standing |
| **Pattern injection gate** | Standing evaluation achieved for chartered scope |
| **45.1 findings** | Unchanged in scope |

### If Repeat 45.2

```text
Selected route.
Run a scoped repeatability extension to close I5 uncertainty with an explicit superficial-match-positive case and re-check disqualifier behavior.
```

| Impact | Notes |
| ------ | ----- |
| **Repeatability question** | Remains partially open (I5-specific) |
| **Blocked work** | 45.3 and expansion remain gated pending I5 closure |

### If Stop

```text
Not selected.
```

| Impact | Notes |
| ------ | ----- |
| **45.1 generation findings** | **Not invalidated** in stated scope |
| **Charter** | May require refinement before further 45.x planning |
| **Frontier re-assessment** | Pattern-aware evaluation may not be correct next frontier |

### Closed authority — not reopened by any route

- Sprint 44 contracts and Pattern Library
- Sprint 44 calibration decisions
- Sprint 45.1 findings
- Ownership model · salience model

---

## Reviewer Notes

```text
Phase 5 recommendation completed using frozen routing framework.
Route selected: Repeat 45.2 (targeted scope) due to I5 trigger.
No protocol/design/scope modifications proposed.
```

---

## Sign-Off Checklist

*Verification before recommendation is considered final.*

### Input artefacts

- [x] `45-2-pattern-aware-evaluation-protocol.md` — frozen version recorded
- [x] `45-2-evidence-workbook.md` — 14/14 bodies, 6/6 pairs complete
- [x] `45-2-boundary-declaration-annex.md` — B1 + B2 complete
- [x] `45-2-repeatability-agreement-report.md` — fully populated
- [x] `45-2-evidence/experiment-metadata.md` — independence and blind attestation
- [x] `45-2-evidence/artefact-register.md` — holdout sources recorded

### Review completeness

- [x] § Experiment Summary — counts verified
- [x] § Repeatability Findings — drafted
- [x] § Verdict Agreement Review — complete
- [x] § Pair Classification Review — complete
- [x] § Layer Agreement Review — L1–L7 complete
- [x] § Boundary Review — B1 + B2 complete
- [x] § Success Criteria Review — S1–S9 each assessed
- [x] § Failure Criteria Review — F1–F7 each assessed
- [x] § Inconclusive Criteria Review — I1–I7 each assessed
- [x] § Evidence For / Against Repeatability — recorded
- [x] § Limitations — documented

### Decision integrity

- [x] Exactly one recommendation route selected
- [x] Rationale cites agreement report and S/F/I assessments
- [x] Repeat scope specified if Repeat selected
- [x] Gate statement completed
- [x] Stop outcome does not claim invalidation of 45.1 in scope
- [x] No Sprint 44 or 45.1 authority reopened

### Cross-document consistency

- [x] Recommendation consistent with agreement report
- [x] Recommendation consistent with workbook agreement summary
- [x] Threshold counts match agreement report aggregates

### Sprint closure

- [x] Recommendation finalised
- [x] Sprint 45.2 marked complete
- [x] Next action identified (45.2 targeted repeat for I5 closure)

---

## Traceability

| Section | Authority |
| ------- | --------- |
| Success / failure / inconclusive criteria | `SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md` § Success/Failure/Inconclusive |
| Recommendation gate | Design § Recommendation Gate |
| Required sections | `SPRINT-45-2-EXECUTION-PLAN.md` § Recommendation Outputs |
| Evidence inputs | `45-2-repeatability-agreement-report.md` |
| Evaluation method | `45-2-pattern-aware-evaluation-protocol.md` |
