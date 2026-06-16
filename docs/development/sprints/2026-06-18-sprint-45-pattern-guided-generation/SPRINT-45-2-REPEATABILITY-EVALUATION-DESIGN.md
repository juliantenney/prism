# Sprint 45.2 Repeatability Evaluation Design

**Date:** 2026-06-18  
**Type:** Repeatability evaluation design — not implementation architecture, generation architecture, or protocol text  
**Purpose:** Design the minimum valid Sprint 45.2 capable of answering the chartered repeatability question  
**Authority:** [SPRINT-45-2-CHARTER.md](SPRINT-45-2-CHARTER.md) · [SPRINT-45-2-SCOPE-ANALYSIS.md](SPRINT-45-2-SCOPE-ANALYSIS.md) · [SPRINT-45-2-DESIGN-CONSTRAINTS.md](SPRINT-45-2-DESIGN-CONSTRAINTS.md) · [REPEATABILITY-ANALYSIS.md](REPEATABILITY-ANALYSIS.md) · [EVALUATION-STACK-ANALYSIS.md](EVALUATION-STACK-ANALYSIS.md) · [EVIDENCE-STANDARDS-ANALYSIS.md](EVIDENCE-STANDARDS-ANALYSIS.md) · [pattern-aware-evaluation-position-paper.md](pattern-aware-evaluation-position-paper.md)

**Non-goals:** Implementation architecture · generation architecture · Pattern Library redesign · contract redesign · protocol drafting (protocol is a sprint output, specified here only as a deliverable type)

**Prerequisite:** This design satisfies [`SPRINT-45-2-DESIGN-CONSTRAINTS.md`](SPRINT-45-2-DESIGN-CONSTRAINTS.md). Authorisation to execute is separate.

---

## Design Objective

### Precise question tested

> Can the Sprint 45.1 pattern-aware evaluation method — 44-2 contract verdicts as primary evidence, pattern Detection Signals as secondary corroboration, mandatory FM and ownership checks, corpus-relative anti-mimicry comparison, and explicit boundary declarations where calibration is ambiguous — be formalised into a **repeatable protocol** that yields **compatible conclusions** when applied independently to the twelve 45-1 artefacts and to a **minimal holdout** of `decision_table` and `transfer_prompt` bodies within SP-02/SP-03 scope?

### What this design tests

| Tests | Does not test |
| ----- | ------------- |
| Cross-rater repeatability on same bodies | Whether SP-02/SP-03 improve generation again |
| Session-artefact risk on twelve 45-1 bodies | Production injection mechanism |
| Minimal generalisation beyond twelve bodies | Corpus-wide regression (45-3) |
| Operationalisability of ownership, anti-mimicry, boundary layers | Pattern or contract redesign |
| Convergent evidence standard reproducibility | Additional patterns or material types |

### Design type

A **repeatability evaluation study** comprising protocol specification, independent re-application of the seven-layer stack, holdout single-body evaluation, and structured agreement analysis — not a second Pattern Injection Experiment.

---

## Research Hypothesis

**H₁ (repeatability hypothesis):**

When the 45-1 evaluation layers are specified as a written protocol and applied by at least one reviewer **independent of the 45-1 scoring session**, independent application will yield:

1. **Compatible contract verdicts** on the twelve frozen 45-1 artefacts sufficient to reproduce the six 45-1 pair classifications (4 Improvement, 2 No Change).
2. **Compatible layer outcomes** on FM, ownership, and anti-mimicry channels — with disagreements confined to documented, resolvable cases (e.g. boundary declaration choice), not systematic incoherence.
3. **Verdict-first ordering preserved** — Detection Signals corroborate but do not override contract verdicts; no pair classified as Improvement on signals alone.
4. **Applicable full-stack evaluation** on holdout bodies beyond the original twelve, including at least one ambiguous transfer case handled via explicit boundary declaration per TP-PS-A6 precedent.
5. **Sufficient agreement** for the method to serve as standing research infrastructure gating further generation research.

*Basis:* 45-1 demonstrated operability and in-sample consistency; repeatability analysis hypothesises verdict-first rules and binary FM/ownership checks are most likely to repeat; anti-mimicry and boundary declaration are highest drift risk ([`REPEATABILITY-ANALYSIS.md`](REPEATABILITY-ANALYSIS.md)).

---

## Null Hypothesis

**H₀ (repeatability failure hypothesis):**

Independent protocol application will **not** yield compatible, utility-sufficient conclusions. Specifically, one or more of the following will hold:

1. **Incompatible primary verdicts** on the same bodies across independent applications — indicating contract ambiguity dominates over missing protocol ([`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md) failure 1).
2. **Materially different pair classifications** on re-scoring the twelve 45-1 bodies — indicating 45-1 outcomes were session artefacts (failure 6).
3. **Systematic Detection Signal / contract verdict divergence** without resolvable justification — indicating two-layer model incoherence (failure 2).
4. **Cosmetic pattern shape passes as Improvement** under protocol — superficial-match control fails (failure 3).
5. **Ownership or anti-mimicry checks are not operationalisable** as traceable standing procedures (failure 4).
6. **Evaluator disagreement exceeds research utility** — method cannot govern further generation research (failure 5).

**H₀ does not claim:** 45-1 generation findings were wrong within stated scope. Charter: 45-2 failure does not invalidate 45-1 in scope.

---

## Scope

### Included artefacts

| Set | IDs | Role |
| --- | --- | ---- |
| **45-1 paired artefacts (frozen)** | `BL-DT-MRX-A4`, `TR-DT-MRX-A4`, `BL-DT-PS-A4`, `TR-DT-PS-A4`, `BL-DT-PS-A6`, `TR-DT-PS-A6`, `BL-TP-MRX-A4`, `TR-TP-MRX-A4`, `BL-TP-PS-A4`, `TR-TP-PS-A4`, `BL-TP-PS-A6`, `TR-TP-PS-A6` | Independent re-evaluation; pair re-classification vs 45-1 workbook |
| **Holdout single bodies (not among twelve)** | `HO-DT-01`, `HO-TP-01` | Minimal beyond-experiment evaluation |

**Holdout body selection (design decision):**

| Holdout | Proposed source | Rationale |
| ------- | --------------- | --------- |
| `HO-DT-01` | Frozen benchmark corpus **M12** or **M19** (Photosynthesis `decision_table`, weak shape) | Not among 45-1 twelve; exercises SP-02/FM-04 evaluation on known Minimum + FM-04 shape; tests non-Improvement classification on pattern-shaped weakness without pair claim |
| `HO-TP-01` | Frozen benchmark corpus **M22** (Photosynthesis `transfer_prompt`, calibration split) | Not among 45-1 twelve; canonical ambiguous transfer body; satisfies boundary exercise and holdout in one |

*Alternative if M22 already used in holdout role:* Any Photosynthesis `transfer_prompt` body with documented Sprint 44 calibration ambiguity, evaluated with explicit per-evaluation declaration only.

Holdout bodies are **evaluated as single bodies** (Layers 1–6 + per-body synthesis). They are **not** obligation-matched pairs. No new generation run is required for minimum valid design when frozen corpus holdouts are used.

### Included evaluators

| Role | Identity | Activity |
| ---- | -------- | -------- |
| **E0 — Reference session** | 45-1 scoring session (frozen) | [`45-1-evidence-workbook.md`](45-1-evidence-workbook.md) — not re-run; serves as comparison baseline |
| **E1 — Independent evaluator** | ≥1 reviewer with **no role in 45-1 body scoring** | Applies protocol to all twelve 45-1 artefacts + both holdouts |
| **E2 — Optional adjudicator** | If feasible without scope expansion | Resolves documented disagreements between E0 and E1 using protocol rules only; does not reopen Sprint 44 calibration globally |

**Minimum valid:** E1 only + comparison to E0 workbook.  
**Strengthened (optional, not required for minimum):** Second independent evaluator E1b blind to E1 scores.

E1 must **not** have access to 45-1 pair classifications or workbook layer scores until own evaluation is complete for each body (sequential blind scoring per body or full blind pass before comparison).

### Included patterns

| Pattern | Material type | Contract section | Target FMs |
| ------- | ------------- | ---------------- | ---------- |
| **SP-02** | `decision_table` | 44-2 §5.6 | FM-04 |
| **SP-03** | `transfer_prompt` | 44-2 §5.8 | FM-02, FM-03 |

### Included material types

| Type | In scope |
| ---- | -------- |
| `decision_table` | Yes |
| `transfer_prompt` | Yes |
| All other 44-2 types | **Excluded** |

### Included domains

| Domain | Role |
| ------ | ---- |
| Marx (`marx-capitalism-v1`) | 45-1 pairs DT-MRX-A4, TP-MRX-A4 |
| Photosynthesis | 45-1 pairs + holdout bodies |

No additional domains for scope expansion.

### Exclusions confirmed

| Exclusion | Status |
| --------- | ------ |
| SP-01, SP-04, SP-05, SP-06 | Out of scope |
| Additional material types | Out of scope |
| Second full six-pair injection experiment | Out of scope |
| Corpus-wide regression (45-3) | Out of scope |
| Material-level repair (45-4) | Out of scope |
| Production injection mechanism | Out of scope |
| 44-2 / 44-3 redesign | Out of scope |
| Global M22 or calibration resolution | Out of scope |
| Implementation, code, pipeline | Out of scope |

---

## Experimental Components

Five components in dependency order:

```text
Component A: Protocol specification (codify 45-1 layers 1–7)
    ↓
Component B: Independent twelve-body re-evaluation (six pairs)
    ↓
Component C: Holdout single-body evaluation (HO-DT-01, HO-TP-01)
    ↓
Component D: Boundary declaration exercise (HO-TP-01 / M22 + TP-PS-A6 pair)
    ↓
Component E: Agreement analysis and sprint synthesis
```

| Component | Purpose | Primary output |
| --------- | ------- | -------------- |
| **A — Protocol specification** | Written procedure enabling E1 to apply stack without 45-1 session familiarity | Pattern-aware evaluation protocol document |
| **B — Twelve-body re-evaluation** | Cross-rater repeatability + session-artefact test | 45-2 evaluation workbook (paired section) |
| **C — Holdout evaluation** | Minimal generalisation beyond original experiment | 45-2 evaluation workbook (holdout section) |
| **D — Boundary exercise** | Layer 6 standing beyond single TP-PS-A6 workbook record | Boundary declaration records |
| **E — Agreement analysis** | Convergent evidence reproducibility + utility assessment | Repeatability agreement report |

**Component A** is derived from 45-1 practice and closed Sprint 44 authority — it does not amend contracts or patterns.  
**Components B–D** are evaluation-only; body text is read-only input.  
**Component E** compares E1 to E0 (and E1b if used) against thresholds in § Success Criteria.

---

## Existing Artefact Evaluation

### Inputs

- Twelve frozen verbatim body files from [`45-1-evidence/artefacts/`](45-1-evidence/artefacts/)
- Pair metadata and DLA obligation snapshots from 45-1 workbook (structural context only — not layer scores)
- Closed 44-2 contracts and 44-3 SP-02/SP-03 entries

### Procedure (design)

1. **E1 scores each body independently** through full seven-layer stack per protocol Component A.
2. **Scoring order:** Per body — L6 boundary declaration if ambiguous → L1 verdict → L2 signals + L3 FMs + L4 ownership (parallel) → L5 anti-mimicry → per-body layer record.
3. **Pair synthesis (L7):** After both baseline and treatment for a pair are complete, E1 classifies pair outcome using 45-1 evidence standard:
   - **Improvement:** Verdict strictly higher; target FM absent in treatment; ownership pass, no regression.
   - **No Change:** Verdict unchanged.
   - **Regression / Inconclusive:** Per [`EVIDENCE-STANDARDS-ANALYSIS.md`](EVIDENCE-STANDARDS-ANALYSIS.md).
4. **Blind constraint:** E1 completes all twelve body scores before viewing 45-1 pair classifications or E0 layer fields for that body.
5. **Comparison:** After E1 completion, record agreement field-by-field against E0 workbook.

### Pairs and expected 45-1 reference classifications

| Pair | E0 pair classification | E0 verdict delta |
| ---- | ---------------------- | ---------------- |
| DT-MRX-A4 | No Change | Strong → Strong |
| DT-PS-A4 | Improvement | Minimum → Strong |
| DT-PS-A6 | Improvement | Minimum → Strong |
| TP-MRX-A4 | No Change | Strong → Strong |
| TP-PS-A4 | Improvement | Failed → Strong |
| TP-PS-A6 | Improvement | Failed → Strong *(under declared conjunctive §5.8)* |

### Agreement fields recorded per body

| Field | Agreement type |
| ----- | -------------- |
| Contract verdict (Failed / Minimum / Strong) | Exact match |
| Target FM present/absent | Exact match |
| Ownership pass/fail; regression yes/no | Exact match |
| Mimicry suspect yes/no | Exact match |
| Superficial-match flag | Exact match |
| Detection Signal profile tier | Compatible / incompatible |
| Boundary declaration (if any) | Compatible / incompatible / not applicable |

### Pair-level agreement

| Field | Agreement type |
| ----- | -------------- |
| Pair classification | Exact match (Improvement / No Change / Regression / Inconclusive) |

**Primary repeatability measure:** Six pair classifications — E1 vs E0.

---

## Holdout Evaluation

### Purpose

Satisfy charter success condition 2 (application beyond original six-pair session) with **minimal** scope — not a generation experiment.

### Holdout bodies

| ID | Proposed body | Material type | Pattern lens | Evaluation focus |
| -- | ------------- | ------------- | ------------ | ---------------- |
| `HO-DT-01` | Corpus **M12** or **M19** | `decision_table` | SP-02 / §5.6 | Weak table shape; FM-04 present; verdict likely Minimum — tests protocol on non-45-1 body without Improvement claim |
| `HO-TP-01` | Corpus **M22** | `transfer_prompt` | SP-03 / §5.8 | Calibration ambiguity; boundary declaration required before verdict |

### Procedure

1. E1 applies full stack to each holdout as **single-body evaluation** (no baseline/treatment pair).
2. Record all per-body evidence channels per § Evidence Collection.
3. **No pair classification** for holdouts — per-body verdict and layer outcomes only.
4. **Superficial-match discrimination:** If holdout exhibits pattern-shaped features without Strong verdict, record superficial-match flag and confirm protocol does not treat as Improvement (charter success 3 attempt).
5. E1 must not use 45-1 workbook scores for holdout bodies (none exist).

### Why frozen corpus holdouts are valid

- Bodies are **not among the original twelve** 45-1 artefacts.
- Charter permits "holdout or newly generated" samples — frozen corpus holdout satisfies "beyond original experiment" without generation as primary activity.
- M12/M19 and M22 are established in Sprint 44 evidence; M22 is the documented calibration-split precedent.

*If holdout generation is later preferred:* At most one new `decision_table` and one new `transfer_prompt` body may substitute — still single-body evaluation only, not a six-pair replication.

---

## Boundary Exercise

### Requirement

At least one ambiguous transfer body evaluated with **explicit boundary declaration before verdict** — per TP-PS-A6 precedent; no global Sprint 44 calibration reopening.

### Two boundary touchpoints (minimum valid design)

| Touchpoint | Body | Exercise |
| ---------- | ---- | -------- |
| **B1 — Pair re-evaluation** | `BL-TP-PS-A6`, `TR-TP-PS-A6` | E1 declares §5.8 interpretation **before** scoring TP-PS-A6 pair; record whether declaration matches TP-PS-A6 precedent (Inter-Rater conjunctive minimum); compare pair classification to E0 |
| **B2 — Holdout boundary** | `HO-TP-01` (M22) | E1 declares which §5.8 minimum interpretation governs **before** verdict; record declaration text; score body; do not alter frozen M22 historical Sprint 44 records |

### Boundary record fields (per ambiguous body)

| Field | Required |
| ----- | -------- |
| `ambiguity_flag` | yes |
| `calibration_reference` | e.g. M22 Pass 2 vs Inter-Rater split |
| `declared_interpretation` | Explicit §5.x reading chosen |
| `declaration_before_verdict` | yes (ordering check) |
| `global_calibration_reopened` | no (must be no) |
| `verdict_under_declaration` | Failed / Minimum / Strong |

### Success for boundary exercise

- Declarations are **documented and precede verdicts** on B1 and B2.
- E1 pair classification on TP-PS-A6 is **derivable from declared interpretation** — not Inconclusive solely due to undeclared ambiguity.
- Declarations do not require amending Sprint 44 authoritative records.

### Failure signal

- Incompatible declarations on same body with no protocol resolution path.
- Boundary declarations multiply without convergence across B1/B2 (charter failure 5 risk).

---

## Evidence Collection

### Per-body evidence (all 14 bodies: 12 paired + 2 holdout)

| Channel | Fields | Authority layer |
| ------- | ------ | --------------- |
| **Contract verdict** | Tier + §5.6 or §5.8 bullet citations | L1 |
| **Detection Signals** | SP-02 or SP-03 checklist items; signal profile; `superficial_match_flag` | L2 |
| **Failure modes** | FM-04 (DT) or FM-02/FM-03 (TP); FM-01/FM-12 under capture channel if present | L3 |
| **Ownership audit** | Pass/fail; regression yes/no; notes | L4 |
| **Anti-mimicry** | Strong-reference proximity; weak-reference distance; `mimicry_suspect`; corpus summary | L5 |
| **Boundary declaration** | Full boundary record if ambiguous | L6 |

### Paired evidence (six pairs only)

| Field | Source |
| ----- | ------ |
| Baseline + treatment verdict delta | L7 input |
| Target FM absent in treatment | L7 necessary condition |
| Pair classification | L7 output |
| Per-output success flag | Derived |
| Convergent evidence met (Improvement pairs) | L7 synthesis |

### Repeatability evidence

| Record | Purpose |
| ------ | ------- |
| E1 complete workbook | Independent application |
| E0 vs E1 agreement matrix | Cross-rater repeatability |
| Disagreement log with layer attribution | Failure/inconclusive diagnosis |
| Verdict-first check | No Improvement classified on signals without verdict rise |
| Disqualifier path application log | Ownership, mimicry, superficial-match — even if all negative |
| Evaluator identity and blind procedure attestation | Methodological traceability |
| Evaluation timestamps | Session separation from 45-1 |

### Evidence standard applied

Per [`EVIDENCE-STANDARDS-ANALYSIS.md`](EVIDENCE-STANDARDS-ANALYSIS.md):

- **Improvement (paired):** Verdict rise + target FM absent + ownership preserved.
- **No Change:** No verdict rise.
- **Disqualifiers:** Ownership regression, mimicry suspect, superficial match without verdict rise — recorded even if not triggered.

---

## Evaluation Outputs

| # | Output | Description |
| - | ------ | ----------- |
| 1 | **Pattern-aware evaluation protocol** | Written specification of Layers 1–7, ordering rules, evidence standard, boundary procedure, disqualifier paths — without modifying 44-2/44-3 text |
| 2 | **45-2 evaluation workbook** | E1 scores for fourteen bodies; six pair classifications; holdout per-body records |
| 3 | **Repeatability agreement report** | E0 vs E1 field agreement; pair classification concordance; layer disagreement analysis |
| 4 | **Boundary declaration annex** | B1 (TP-PS-A6) and B2 (HO-TP-01/M22) records |
| 5 | **45-2 recommendation** | Proceed / repeat / stop gate per § Recommendation Gate |
| 6 | **Frozen artefact register** | Confirm twelve 45-1 body texts unchanged; holdout source citations |

**Not outputs:** Code, pipeline, validators, contract amendments, pattern library changes, global calibration resolution.

---

## Success Criteria

Findings that **support repeatability** (H₁ not rejected):

### Mandatory (all required)

| # | Criterion | Threshold |
| - | --------- | --------- |
| S1 | **Protocol exists** | Written protocol covers Layers 1–7 without 44-2/44-3 modification |
| S2 | **Independent application complete** | E1 scores all twelve 45-1 bodies + both holdouts through full stack |
| S3 | **Pair classification concordance** | E1 reproduces **≥5/6** E0 pair classifications exactly |
| S4 | **Verdict concordance** | E1 exact verdict match with E0 on **≥10/12** paired bodies |
| S5 | **No systematic signal override** | Zero pairs classified Improvement by E1 on signals without verdict rise |
| S6 | **Ownership and anti-mimicry traceable** | All fourteen bodies have ownership and anti-mimicry fields completed per protocol steps — not blank or ad hoc |
| S7 | **Boundary exercise complete** | Declarations recorded before verdict on TP-PS-A6 pair (B1) and HO-TP-01 (B2); `global_calibration_reopened = no` |
| S8 | **Holdout evaluated** | HO-DT-01 and HO-TP-01 scored with full stack |
| S9 | **Utility sufficient** | Disagreements (if any) are **documented and resolvable** under protocol — not indicating irreducible intuition on ownership/mimicry |

### Strong support (not all required for minimum success)

| Criterion | Threshold |
| --------- | --------- |
| **Perfect pair concordance** | 6/6 pair classifications match E0 |
| **Perfect verdict concordance** | 12/12 exact verdict match |
| **Superficial-match discrimination observed** | At least one holdout or body correctly **not** classified as Improvement despite pattern-shaped features |
| **Disqualifier path documentation** | Explicit record that superficial-match, mimicry, and ownership regression checks were applied |

### Interpretation

Meeting S1–S9 supports: pattern-aware evaluation is **repeatable enough** to serve as standing infrastructure for chartered SP-02/SP-03 scope. Perfect concordance strengthens confidence but is not required — one resolvable disagreement (e.g. boundary declaration wording) may still support H₁ if S3–S4 thresholds met and disagreement is layer-attributed.

*Threshold rationale (interpretation):* S3 at 5/6 allows one pair discordance for adjudication without automatic failure; S4 at 10/12 allows two verdict-tier disagreements on non-classification-critical bodies if pair outcomes still agree. Stricter than chance; looser than perfection.

---

## Failure Criteria

Findings that **reject repeatability** (H₀ accepted):

| # | Condition | Charter mapping |
| - | --------- | --------------- |
| F1 | E1 pair classifications match E0 on **≤3/6** pairs | Session artefact / classification rules insufficient |
| F2 | **≥3 bodies** with incompatible contract verdicts (tier difference >0 on Failed–Minimum–Strong scale) without resolvable boundary declaration | Failure 1 — contract ambiguity dominates |
| F3 | **Systematic** signal/verdict divergence on E1 scoring (≥2 bodies: Strong signals + Failed/Minimum verdict on treatments, or E1 Improvement on signals without verdict rise) | Failure 2 — two-layer incoherence |
| F4 | E1 classifies a pair as **Improvement** where E0 recorded superficial-match-equivalent pattern (signals met, verdict not risen) and protocol should have blocked | Failure 3 |
| F5 | Ownership or anti-mimicry fields cannot be completed from protocol — evaluators report irreducible intuition only | Failure 4 |
| F6 | Disagreement on pair classifications or verdicts **exceeds utility** — no protocol resolution path; method too unstable to gate research | Failure 5 |
| F7 | E1 reproduces **≤3/6** pair classifications **and** ≥2 are classification inversions (Improvement ↔ No Change) | Failure 6 — 45-1 outcomes likely session artefacts |

**Any one of F1–F7 triggers repeatability rejection** for recommendation purposes.

**F1 alone** (4/6 concordance) is **inconclusive**, not automatic failure — see § Inconclusive Outcomes.

---

## Inconclusive Outcomes

Findings that **leave the question unresolved**:

| # | Condition | Implication |
| - | --------- | ----------- |
| I1 | Pair concordance **4/6** (one discordant pair, five matching) | Borderline — repeat or adjudicate |
| I2 | Verdict concordance **9/12** with pair concordance ≥5/6 | Verdict noise on non-decisive bodies |
| I3 | Single pair discordance **solely** on boundary declaration choice (e.g. TP-PS-A6) with documented compatible declarations | Layer 6 drift — protocol may need refinement, not full rejection |
| I4 | All concordance thresholds met but **holdout evaluation incomplete** (one holdout missing) | Generalisation untested — repeat holdout component |
| I5 | No superficial-match positive case observed; all other criteria met | Disqualifier path **unstress-tested** — repeatability supported for positive path only |
| I6 | E1 complete; optional E1b disagrees with E1 on ≥3 bodies | Multi-rater utility unclear — repeat with adjudication design |
| I7 | Protocol specification incomplete but evaluation partially done | Procedural invalidity — repeat sprint |

### Inconclusive handling

- Document which unknown from [`REPEATABILITY-ANALYSIS.md`](REPEATABILITY-ANALYSIS.md) § Remaining Unknowns remains open.
- Do not claim standing protocol until resolved or explicitly accepted with documented limitation.

---

## Risks

Methodological risks only — not project management or resourcing.

| Risk | Mechanism | Mitigation in design |
| ---- | --------- | -------------------- |
| **Protocol overfit to 45-1 bodies** | Specification derived from same twelve artefacts being tested | Holdout bodies external to 45-1; blind E1 scoring |
| **Familiarity bias if E1 saw 45-1 recommendation** | Prior knowledge of expected outcomes | Blind procedure; score bodies before viewing E0 classifications |
| **False confidence from unanimous 45-1** | All treatments Strong — evaluation may seem easier than noisier generation | Holdout weak shapes (M12/M19); superficial-match flag required |
| **Detection Signal drift to primary** | Protocol wording imprecise on layer ordering | S5 explicit check; verdict-first rule in protocol Component A |
| **Boundary proliferation** | M22 + TP-PS-A6 yield incompatible declarations | Two touchpoints only; document compatibility; no global reopening |
| **Anti-mimicry non-operationalisability** | No positive mimicry calibration case | Record application on all bodies; flag I5 if unstress-tested |
| **Frozen corpus holdout ≠ generated body generalisation** | Holdout is historical, not newly generated | Accept as minimum valid per scope analysis; note in recommendation if generation holdout deferred |
| **Single independent evaluator** | n=1 cross-rater comparison (E0 vs E1) | Minimum valid per scope; optional E1b strengthens; I6 if multi-rater discordance |
| **Contract ambiguity masquerading as protocol failure** | Sprint 44 residual splits (M22) | Boundary declaration procedure; distinguish F2 from I3 |
| **Wrong frontier if generation variance dominates** | Repeatability passes but injection unreliable | Out of 45.2 scope; 45-2 does not test generation — note in gate to 45-3 |

---

## Recommendation Gate

Conditions for post-sprint routing. Assessment uses § Success, Failure, and Inconclusive criteria.

### Proceed to 45.3

**When all of:**

- S1–S9 met (mandatory success criteria).
- No F1–F7 failure condition triggered.
- Repeatability agreement report documents **standing protocol** sufficient to gate corpus-wide regression.
- Known limitations explicitly recorded (e.g. I5 disqualifier path unstress-tested — acceptable if flagged).

**45.3 scope (not designed here):** Corpus-wide regression against frozen benchmark — depends on evaluation standing per charter and slice index.

**Does not automatically authorise:** Pattern injection expansion beyond SP-02/SP-03; production implementation.

### Repeat 45.2

**When any of:**

- **Inconclusive band:** I1 or I2 without failure — one pair or two verdict discordances with otherwise compatible layers.
- **I3:** Boundary-only discordance — refine protocol Layer 6 wording; re-run evaluation component.
- **I4:** Holdout incomplete — complete holdout only.
- **I6:** Multi-rater disagreement — add adjudication or third reviewer.
- **I7:** Procedural flaw — blind broken, protocol incomplete, E1 not independent.
- **Partial success:** S3 met at 5/6 but F7 not triggered — targeted repeat on discordant pair(s) only.

**Repeat scope:** Narrowest component that resolves inconclusive condition — not full sprint duplication unless I7.

### Stop and document negative result

**When any of:**

- F1–F7 failure condition met.
- Repeat attempt still fails mandatory success criteria.
- Evidence indicates **contract ambiguity** not fixable by protocol (F2) — frontier may be wrong; charter refinement needed before further 45.x planning.
- Evidence indicates **two-layer model incoherent** (F3) — pattern-aware evaluation concept requires revision.
- Utility failure (F6) — method cannot govern generation research.

**Stop actions:**

- Document negative result without invalidating 45-1 generation findings in scope.
- Record which charter failure condition(s) triggered.
- Recommend frontier re-assessment (e.g. injection mechanism, alternative evaluation approach) — not automatic 45-3.

**Stop does not require:** Reopening Sprint 44 contracts, ownership model, salience model, or 45.1 findings.

---

## Design Validation

This design satisfies [`SPRINT-45-2-DESIGN-CONSTRAINTS.md`](SPRINT-45-2-DESIGN-CONSTRAINTS.md) design review checklist:

| Constraint area | Status |
| --------------- | ------ |
| Frontier and scope | Evaluation repeatability; twelve bodies; two holdouts; SP-02/SP-03 only |
| Evaluation stack | Seven layers; verdict-first; full evidence channels |
| Evidence collection | Per-body + paired + agreement records |
| Repeatability | E1 independent; E0 comparison; holdout generalisation |
| Prohibited elements | No injection experiment, implementation, expansion, calibration reopening |

---

## Conclusion

### Minimum valid Sprint 45.2

A repeatability evaluation study with **five components**: protocol specification, blind independent re-scoring of **all twelve** frozen 45-1 artefacts (six pair re-classifications), **two** frozen-corpus holdout single-body evaluations (`HO-DT-01`, `HO-TP-01`), **dual boundary touchpoints** (TP-PS-A6 pair + M22 holdout), and structured **E0 vs E1 agreement analysis** against explicit success/failure thresholds.

### Design decisions grounded in authority

| Decision | Source |
| -------- | ------ |
| Twelve bodies, not subsample | Scope analysis; design constraints |
| ≥1 independent evaluator | Scope analysis minimum |
| Two holdout single bodies from frozen corpus | Charter "holdout or newly generated"; avoids generation-primary sprint |
| M22 for boundary + holdout | TP-PS-A6 precedent; Sprint 44 calibration history |
| Paired re-classification not new injection | Scope analysis § Candidate C vs full replication |
| 5/6 pair and 10/12 verdict thresholds | Interpretation — balances utility vs perfection; enables inconclusive band |

### What execution will establish

If success criteria met: pattern-aware evaluation is **repeatable standing infrastructure** for `decision_table` and `transfer_prompt` under SP-02/SP-03 — sufficient to **proceed to 45.3** with documented limitations.

If failure criteria met: repeatability hypothesis rejected — **stop and document** without reopening closed Sprint 44 or 45.1 authority.

If inconclusive: **repeat** targeted component before gate decision.

---

## Traceability

| Section | Primary sources |
| ------- | --------------- |
| Design objective / hypotheses | `SPRINT-45-2-CHARTER.md` |
| Scope | `SPRINT-45-2-SCOPE-ANALYSIS.md`; `SPRINT-45-2-DESIGN-CONSTRAINTS.md` |
| Twelve artefacts | `45-1-evidence-workbook.md`; `45-1-experiment-execution-plan.md` |
| Evaluation stack / evidence | `EVALUATION-STACK-ANALYSIS.md`; `EVIDENCE-STANDARDS-ANALYSIS.md` |
| Boundary | TP-PS-A6 workbook; charter success 5 |
| Success/failure | Charter § Success/Failure Conditions; design constraints |
| Recommendation gate | Charter; slice index 45-3 dependency |
| Holdout selection | Sprint 44 corpus (M12, M19, M22 references in 45-1 workbook) |
