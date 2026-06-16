# 45-2 Pattern-Aware Evaluation Protocol

**Version:** 1.0 (template — assign version at freeze)  
**Date:** 2026-06-18  
**Type:** Standing evaluation protocol for Sprint 45.2 independent repeatability study  
**Purpose:** Procedure E1 must follow when conducting the independent repeatability evaluation  
**Authority:** [SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md](SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md) · [SPRINT-45-2-EXECUTION-PLAN.md](SPRINT-45-2-EXECUTION-PLAN.md) · [45-2-evidence-workbook.md](45-2-evidence-workbook.md) · [EVALUATION-STACK-ANALYSIS.md](EVALUATION-STACK-ANALYSIS.md) · [EVIDENCE-STANDARDS-ANALYSIS.md](EVIDENCE-STANDARDS-ANALYSIS.md)

**Normative inputs (read-only):** [sprint-44-2-instructional-depth-contracts.md](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) · [sprint-44-3-instructional-pattern-library.md](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md)

**Non-goals:** Method redesign · implementation architecture · contract redesign · Pattern Library redesign · scope expansion

---

## Purpose

This protocol operationalises the Sprint 45.1 pattern-aware evaluation method for **independent repeatability testing** under Sprint 45.2.

**Mandatory objective:** Enable evaluator E1 to apply the seven-layer evaluation stack to fourteen GAM material bodies — twelve frozen 45-1 artefacts and two holdout bodies — producing workbook evidence sufficient for later comparison against the frozen 45-1 reference session (E0) without reopening Sprint 44 authority or Sprint 45.1 findings.

**This protocol tests** whether the evaluation method is repeatable. It does **not** test whether pattern-guided generation improves output.

---

## Scope

### Included artefacts

| Set | IDs | Evaluation mode |
| --- | --- | --------------- |
| **45-1 paired bodies** | `BL-DT-MRX-A4`, `TR-DT-MRX-A4`, `BL-DT-PS-A4`, `TR-DT-PS-A4`, `BL-DT-PS-A6`, `TR-DT-PS-A6`, `BL-TP-MRX-A4`, `TR-TP-MRX-A4`, `BL-TP-PS-A4`, `TR-TP-PS-A4`, `BL-TP-PS-A6`, `TR-TP-PS-A6` | Per-body stack + six pair classifications |
| **Holdouts** | `HO-DT-01`, `HO-TP-01` | Per-body stack only — no pair classification |

### Included patterns

| Pattern | Material type | Contract section | Target instructional FMs |
| ------- | ------------- | ---------------- | ------------------------ |
| SP-02 | `decision_table` | 44-2 §5.6 | FM-04 |
| SP-03 | `transfer_prompt` | 44-2 §5.8 | FM-02, FM-03 |

### Included material types

- `decision_table`
- `transfer_prompt`

### Excluded

| Exclusion | Status |
| --------- | ------ |
| SP-01, SP-04, SP-05, SP-06 | Out of protocol scope |
| All other 44-2 material types | Out of protocol scope |
| Additional domains beyond Marx/Photosynthesis in scope expansion sense | Out of scope |
| New obligation-matched pairs / second injection experiment | Out of scope |
| Corpus-wide regression | Out of scope |
| Modification of 44-2 contracts or 44-3 Pattern Library | Prohibited |
| Global resolution of Sprint 44 calibration splits | Prohibited |

### Evaluation surface

**GAM body text only.** Do not evaluate prompts, generator configuration, workflow instructions, or code.

---

## Evaluator Independence Requirements

### Role

| Role | Protocol obligation |
| ---- | ------------------- |
| **E1** | Applies this protocol to all fourteen bodies; records evidence in workbook |
| **E0** | Frozen reference in [`45-1-evidence-workbook.md`](45-1-evidence-workbook.md) — **not consulted by E1 during scoring** |

### Mandatory independence

1. **E1 must not have scored any of the twelve 45-1 bodies during Sprint 45.1 evidence collection.**
2. **E1 must complete all fourteen body evaluations before accessing E0 layer scores or pair classifications** for any body in the comparison set.
3. **E1 may receive** pair metadata, DLA obligation snapshots, artefact files, and normative Sprint 44 inputs during scoring.
4. **E1 must not receive** E0 verdicts, FM fields, ownership results, anti-mimicry results, Detection Signal profiles, superficial-match flags, pair classifications, or [`45-1-recommendation.md`](45-1-recommendation.md) aggregate outcomes before the blind gate opens.

### Blind status

| State | Meaning |
| ----- | ------- |
| **Blind maintained** | E1 scoring in progress; E0 comparison fields not accessed |
| **Blind lifted** | All fourteen bodies complete; agreement analysis may proceed |

Record blind status in workbook header and `45-2-evidence/experiment-metadata.md`.

*Explanatory note:* Prior informal knowledge of 45-1 existence does not automatically invalidate E1; exposure to E0 scores before completion does.

---

## Evaluation Stack

Seven layers. Roles are fixed — do not reorder authority.

### Layer 1 — Contract Verdict

| Attribute | Definition |
| --------- | ---------- |
| **Role** | Primary **normative** judgement |
| **Question** | Does this body meet Failed, Minimum, or Strong realisation for its material type under authoritative 44-2 §5.6 or §5.8? |
| **Authority** | Closed Sprint 44-2 contracts |
| **Output** | Verdict tier + justification citing **contract bullets** — not pattern names alone |
| **On conflict** | Layer 1 **governs** all other layers |

### Layer 2 — Detection Signals

| Attribute | Definition |
| --------- | ---------- |
| **Role** | **Corroborative** observational layer |
| **Question** | Do SP-02 or SP-03 Detection Signal checklists indicate minimum, strong, or failed pattern shape? |
| **Authority** | Sprint 44-3 pattern entries (SP-02, SP-03) |
| **Output** | Checklist state, signal profile, `superficial_match_flag` |
| **On conflict** | **Subordinate** to Layer 1 — signals must not override verdict |

*Mandatory rule:* Strong signals without verdict rise do not constitute Improvement; set `superficial_match_flag = yes` when pattern-shaped features are present and verdict has not risen (paired context) or body would falsely appear improved on shape alone.

### Layer 3 — Failure Modes

| Attribute | Definition |
| --------- | ---------- |
| **Role** | **Diagnostic** layer |
| **Question** | Which named instructional failure modes or capture artefacts are present? |
| **Authority** | Sprint 44-3 FM index |
| **Instructional FMs** | FM-04 (`decision_table`); FM-02, FM-03 (`transfer_prompt`) |
| **Capture channel** | FM-01, FM-12 — record separately; **do not conflate** with instructional FMs |
| **On conflict** | FM informs diagnosis; verdict tier states overall realisation (Layer 1 governs) |

### Layer 4 — Ownership Audit

| Attribute | Definition |
| --------- | ---------- |
| **Role** | **Gating** layer — independent constraint |
| **Question** | Does author scaffolding preserve learner-assigned output loci (scaffold ≠ deliverable)? |
| **Output** | Ownership pass/fail; ownership regression yes/no |
| **On conflict** | **Ownership regression vetoes success** regardless of Layer 1 or Layer 2 |

*Explanatory note:* A body may pass ownership and fail instructionally — layers are separable.

### Layer 5 — Anti-Mimicry Review

| Attribute | Definition |
| --------- | ---------- |
| **Role** | **Gating / validity** layer |
| **Question** | Is observed quality domain-appropriate instructional function, not benchmark copying or cross-domain transplant? |
| **Output** | Strong-reference proximity, weak-reference distance, `mimicry_suspect`, corpus comparison notes |
| **On conflict** | **Mimicry suspect = yes** vetoes trust in improvement regardless of verdict |

### Layer 6 — Boundary Declaration

| Attribute | Definition |
| --------- | ---------- |
| **Role** | **Interpretive** precondition layer |
| **Question** | Which contract interpretation governs when calibration is ambiguous? |
| **Output** | Declared §5.x reading, calibration reference, `declaration_before_verdict`, `global_calibration_reopened = no` |
| **On conflict** | Declaration **conditions** Layer 1 on ambiguous bodies; does not amend Sprint 44 historical records |

*Mandatory rule:* Declare before assigning final verdict on ambiguous bodies.

### Layer 7 — Convergent Judgement

| Attribute | Definition |
| --------- | ---------- |
| **Role** | **Synthesising** layer |
| **Question** | Given Layers 1–6, what is the pattern-aware evaluation outcome? |
| **Per body** | Convergent notes where applicable |
| **Per pair** | Pair classification: Improvement / No Change / Regression / Inconclusive |
| **On conflict** | Apply evidence standard resolution rules (verdict governs; ownership and mimicry veto) |

---

## Evaluation Order

### Per-body order (mandatory)

```text
1. Determine if body is ambiguous → if yes, complete Layer 6 BEFORE Layer 1 final verdict
2. Layer 1 — Contract Verdict
3. Layers 2, 3, 4 — in any order (parallel corroboration / diagnosis / gating)
4. Layer 5 — Anti-Mimicry Review
5. Record per-body convergent notes (Layer 7 input)
```

### Pair order (mandatory)

```text
6. Complete both baseline and treatment body records for the pair
7. Layer 7 — Pair classification and derived flags
```

### Special ordering requirements

| Situation | Mandatory order |
| --------- | --------------- |
| **TP-PS-A6 pair (B1)** | Record pair-level boundary declaration **before** scoring `BL-TP-PS-A6` or `TR-TP-PS-A6` |
| **HO-TP-01 (B2)** | Record boundary declaration **before** Layer 1 verdict on `HO-TP-01` |
| **All other bodies** | Apply Layer 6 only if ambiguity is present; otherwise mark not applicable |

*Explanatory note:* The evaluation stack analysis diagrams L6 as potentially preceding L1 on ambiguous bodies; this protocol makes that ordering mandatory for B1 and B2 touchpoints.

---

## Body Evaluation Procedure

**Apply to each of fourteen bodies.** Record in [`45-2-evidence-workbook.md`](45-2-evidence-workbook.md) § Existing Body Sections.

### Step 1 — Prepare

1. Open artefact verbatim text file (read-only).
2. Confirm artefact ID, material type, pattern lens, contract section, target FM(s).
3. Do not consult E0 workbook for this body.

### Step 2 — Boundary check (Layer 6)

1. Determine whether contract application is ambiguous for this body.
2. **If ambiguous:** complete full boundary record **before** Step 3.
3. **If not ambiguous:** record `Applicable = no`.
4. **B1 bodies (`BL-TP-PS-A6`, `TR-TP-PS-A6`):** use pair-level declaration recorded before either body is scored.
5. **B2 body (`HO-TP-01`):** complete B2 declaration before verdict.

### Step 3 — Contract verdict (Layer 1)

1. Read GAM body text only.
2. Assign Failed, Minimum, or Strong per §5.6 (`decision_table`) or §5.8 (`transfer_prompt`).
3. Cite specific contract bullets in justification.
4. Do not cite pattern names as sole justification.

### Step 4 — Detection signals (Layer 2)

1. Apply SP-02 or SP-03 Detection Signal checklist from 44-3.
2. Record minimum / strong / failed signal items as met or not met.
3. Assign signal profile tier.
4. Set `superficial_match_flag` (yes / no / n/a per body role).

### Step 5 — Failure modes (Layer 3)

1. Record target instructional FM(s): FM-04 or FM-02/FM-03 — present or absent.
2. Record FM-01 and FM-12 under capture channel if present.
3. Do not treat capture artefacts as instructional weakness.

### Step 6 — Ownership audit (Layer 4)

1. Check learner-assigned loci: empty judgement cells (`decision_table`); no pre-written learner transfer (`transfer_prompt`).
2. For treatment bodies in pairs: assess ownership regression vs baseline.
3. Record overall pass/fail and regression yes/no.

### Step 7 — Anti-mimicry review (Layer 5)

1. Compare body to frozen Strong and weak corpus references for the obligation/domain.
2. Record proximity, distance, and `mimicry_suspect`.
3. Document corpus comparison summary.

### Step 8 — Per-body convergent notes (Layer 7 input)

1. Record any layer integration notes required for later pair synthesis or holdout review.
2. Mark body section populated in artefact register.

---

## Pair Classification Procedure

**Apply after both bodies of a pair are complete.** Record in workbook § Pair Comparison Sections.

**Pairs:** DT-MRX-A4 · DT-PS-A4 · DT-PS-A6 · TP-MRX-A4 · TP-PS-A4 · TP-PS-A6

### Step 1 — Extract pair inputs

| Input | Source |
| ----- | ------ |
| Baseline verdict | BL body Layer 1 |
| Treatment verdict | TR body Layer 1 |
| Target FM in treatment | TR body Layer 3 |
| Ownership on treatment | TR body Layer 4 |
| Anti-mimicry on treatment | TR body Layer 5 |
| Superficial-match flag | TR body Layer 2 |

**Verdict ordering:** Failed < Minimum < Strong.

### Step 2 — Apply classification rules (mandatory)

| Classification | **All** required conditions |
| -------------- | --------------------------- |
| **Improvement** | Treatment verdict **strictly higher** than baseline; target FM **absent** in treatment; ownership pass on treatment; **no** ownership regression |
| **No Change** | Treatment verdict **equals** baseline (including Strong → Strong); ownership preserved |
| **Regression** | Verdict strictly lower; **or** ownership regression; **or** treatment ownership fail; **or** mimicry suspect = yes; **or** superficial match with worse verdict |
| **Inconclusive** | Classification requires disputed interpretation **and** no resolvable boundary declaration; or undeterminable ownership from recorded text |

### Step 3 — Disqualifier check (mandatory before Improvement)

Confirm **none** of the following:

- Ownership regression on treatment
- Treatment ownership fail
- Mimicry suspect = yes on treatment
- Superficial match (signals met, verdict not risen)

**Hard gate:** Ownership regression or mimicry suspect disqualifies Improvement **regardless of verdict or signals**.

### Step 4 — Derived flags

| Flag | Rule |
| ---- | ---- |
| `per_output_success` (treatment) | met if treatment meets per-output minimum: verdict improvement or Strong maintained + target FM absent + ownership preserved |
| `convergent_evidence_met` | yes for Improvement pairs if verdict rise + FM absent + ownership + anti-mimicry clearance recorded |

### Step 5 — Record pair outcome

1. Enter E1 pair classification.
2. Leave E0 classification and agreement status blank until blind gate opens.
3. For TP-PS-A6: cross-reference B1 boundary annex.

*Mandatory rule:* Do not classify Improvement on Detection Signals alone without verdict rise.

---

## Holdout Evaluation Procedure

**Apply to `HO-DT-01` and `HO-TP-01` only.** No pair classification.

### Step 1 — Prepare holdout

1. Confirm holdout artefact file and corpus source recorded in artefact register.
2. `HO-DT-01`: Photosynthesis `decision_table`; SP-02 lens; source M12 or M19.
3. `HO-TP-01`: Photosynthesis `transfer_prompt`; SP-03 lens; source M22.

### Step 2 — Evaluate body

1. Apply **Body Evaluation Procedure** (§ above) in full.
2. For `HO-TP-01`: complete **Boundary Declaration Procedure B2** before Layer 1 verdict.

### Step 3 — Holdout review record

1. Complete workbook § Holdout Review Section for the holdout.
2. Record generalisation notes and superficial-match discrimination observation (if any).
3. Do not assign pair classification.

*Explanatory note:* Holdouts test minimal generalisation beyond the twelve 45-1 artefacts; absence of Improvement classification is expected for weak-shape holdouts.

---

## Boundary Declaration Procedure

### When required

| Touchpoint | Bodies | Trigger |
| ---------- | ------ | ------- |
| **B1** | TP-PS-A6 pair (`BL-TP-PS-A6`, `TR-TP-PS-A6`) | M22-like §5.8 ambiguity — **always required** for this pair |
| **B2** | `HO-TP-01` (M22) | Calibration split — **always required** |
| **Other bodies** | Any | Required only if evaluator determines contract application is ambiguous |

### B1 — TP-PS-A6 (mandatory)

1. **Before scoring either body** in the TP-PS-A6 pair, record in workbook § Boundary Annex — B1:
   - `ambiguity_flag = yes`
   - `calibration_reference` (M22 / Pass 2 vs Inter-Rater split)
   - `declared_interpretation` — explicit §5.8 minimum reading
   - `declaration_before_verdict = yes`
   - `global_calibration_reopened = no`
2. Score baseline and treatment under the declared interpretation.
3. Record impact on verdicts and pair classification.
4. Do not alter frozen M22 or Sprint 44 historical records.

*Explanatory note:* TP-PS-A6 precedent in 45-1 used Inter-Rater conjunctive §5.8 minimum; E1 may apply the same or document an alternative declaration with rationale — comparison to E0 occurs after blind gate.

### B2 — HO-TP-01 / M22 (mandatory)

1. **Before Layer 1 verdict** on `HO-TP-01`, record in workbook § Boundary Annex — B2:
   - Full boundary record fields
   - `declaration_before_verdict = yes`
   - `global_calibration_reopened = no`
2. Assign verdict under declared interpretation only.
3. Record `verdict_under_declaration`.
4. Confirm frozen M22 historical Sprint 44 records are not altered.

### Prohibited boundary actions

- Declaring boundary **after** verdict is assigned
- Reopening or amending global Sprint 44 calibration
- Resolving M22 corpus-wide within this evaluation

### Retrospective changes

**Prohibited:** Changing boundary declaration after pair classification or holdout review is complete except to correct documented clerical error with audit note.

---

## Evidence Recording Requirements

All evidence recorded in [`45-2-evidence-workbook.md`](45-2-evidence-workbook.md).

| Protocol step | Workbook section |
| ------------- | ---------------- |
| Header metadata | § Workbook Header |
| Artefact status | § Artefact Register |
| Per-body Layers 1–6 | § Existing Body Sections (matching artefact ID) |
| Pair Layer 7 | § Pair Comparison Sections |
| Holdout summary | § Holdout Review Sections |
| B1 / B2 | § Boundary Annex |
| Post-blind comparison | § Agreement Summary (populated after blind gate) |

### Mandatory field completeness (per body)

- Layer 1: verdict tier + justification
- Layer 2: signal profile + `superficial_match_flag`
- Layer 3: target FM(s) + capture channel if applicable
- Layer 4: ownership pass + regression
- Layer 5: mimicry fields
- Layer 6: boundary record or not applicable

### Supporting files

| File | Purpose |
| ---- | ------- |
| `45-2-evidence/experiment-metadata.md` | Independence and blind attestation |
| `45-2-evidence/artefact-register.md` | Source citations for holdouts |
| `45-2-evidence/artefacts/HO-DT-01.txt` | Holdout verbatim text |
| `45-2-evidence/artefacts/HO-TP-01.txt` | Holdout verbatim text |

---

## Agreement Analysis Inputs

E1 produces the following for later E0/E1 comparison **after** blind gate opens. E1 does not complete agreement fields during blind scoring.

### Per-body inputs (twelve paired bodies)

| Field | For agreement analysis |
| ----- | ---------------------- |
| Contract verdict | Exact match vs E0 |
| Target FM present/absent | Exact match |
| Ownership pass; regression | Exact match |
| Mimicry suspect | Exact match |
| Superficial-match flag | Exact match |
| Signal profile tier | Compatible / incompatible |
| Boundary declaration | Compatible / incompatible / n/a |

### Per-pair inputs (six pairs)

| Field | For agreement analysis |
| ----- | ---------------------- |
| E1 pair classification | Compare to E0 |
| Agreement status | match / mismatch |
| Disagreement notes | Layer attribution if mismatch |

### Aggregate inputs (completed in agreement analysis phase)

| Metric | Threshold reference |
| ------ | ------------------- |
| Pair concordance | S3: ≥5/6; F1: ≤3/6 |
| Verdict concordance | S4: ≥10/12 |
| Signal-only Improvement pairs | S5: must be 0 |
| Verdict-first check | Pass / fail |

*Explanatory note:* Full agreement analysis is documented in `45-2-repeatability-agreement-report.md` per execution plan Phase 4; workbook § Agreement Summary holds summary fields.

---

## Prohibited Actions

| Prohibited action | Reason |
| ----------------- | ------ |
| Consulting E0 scores, classifications, or recommendation before E1 completes all fourteen bodies | Breaks blind independence |
| Modifying 44-2 contract text or verdict tier definitions | Sprint 44 closed |
| Modifying 44-3 pattern definitions or adding patterns | Pattern Library closed |
| Elevating Detection Signals above contract verdict | Violates verdict-first ordering |
| Classifying Improvement without verdict rise | Violates evidence standard |
| Assigning verdict before boundary declaration on B1/B2 bodies | Violates Layer 6 ordering |
| Retrospective boundary changes without audit note | Invalidates declaration record |
| Outcome-first scoring (pair classification before body layers complete) | Violates stack order |
| Reopening global Sprint 44 calibration (M22 resolution) | Charter exclusion |
| Rescoring or altering frozen 45-1 artefact text | Invalidates comparison |
| Expanding evaluation to SP-01/04/05/06 or other material types | Scope violation |
| Treating holdout evaluation as paired Improvement test | Holdouts are single-body only |
| Conflating FM-01/FM-12 with instructional FMs | Channel separation violation |

---

## Completion Requirements

E1 may lift blind status **only when all** of the following are true:

### Body completion

- [ ] All **fourteen** body sections populated through Layers 1–5 (and Layer 6 where applicable)
- [ ] **Twelve** paired bodies: full per-body records
- [ ] **Two** holdouts: full per-body records + holdout review sections

### Pair completion

- [ ] All **six** pair comparison sections: E1 classification recorded
- [ ] TP-PS-A6: B1 boundary annex complete

### Boundary completion

- [ ] B1 (TP-PS-A6) — declaration before verdict; `global_calibration_reopened = no`
- [ ] B2 (HO-TP-01) — declaration before verdict; `global_calibration_reopened = no`

### Register and attestation

- [ ] Artefact register: all fourteen `Populated` flags checked
- [ ] Workbook header: evaluator code, protocol version, dates completed
- [ ] `e1_independent_of_45_1_scoring = yes` attested
- [ ] `blind_gate_observed = yes` attested at lift

### After blind lift (not E1 scoring duty — analysis phase)

Agreement summary and repeatability report populated per execution plan Phase 4.

---

## Protocol Compliance Checklist

Operational checklist for E1 during execution.

### Before scoring

- [ ] Protocol version frozen and recorded
- [ ] E1 independence confirmed
- [ ] Twelve 45-1 artefact files verified unchanged
- [ ] Holdout files extracted and registered
- [ ] E0 workbook layer scores not accessed
- [ ] Normative 44-2 and 44-3 documents available

### Per body (×14)

- [ ] Ambiguity assessed; Layer 6 completed first if required
- [ ] Layer 1 verdict with §5.x bullet citations
- [ ] Layer 2 signals + superficial-match flag
- [ ] Layer 3 instructional FMs + capture channel separated
- [ ] Layer 4 ownership pass + regression
- [ ] Layer 5 anti-mimicry fields complete
- [ ] Body section marked populated

### Per pair (×6)

- [ ] Both bodies complete before pair classification
- [ ] Verdict delta computed (Failed < Minimum < Strong)
- [ ] Disqualifier check applied
- [ ] E1 pair classification recorded
- [ ] TP-PS-A6: B1 declaration precedes body scoring

### Holdouts (×2)

- [ ] HO-DT-01 evaluated — no pair classification
- [ ] HO-TP-01: B2 declaration precedes verdict
- [ ] Holdout review section complete

### Before blind lift

- [ ] 14/14 bodies complete
- [ ] 6/6 pairs classified
- [ ] B1 and B2 annex complete
- [ ] No E0 comparison fields filled
- [ ] Header and metadata attestation complete

### Prohibitions verified

- [ ] No E0 scores consulted during scoring
- [ ] No contract or pattern modifications
- [ ] No Improvement classified on signals alone
- [ ] No global calibration reopening

---

## Conclusion

This protocol specifies **how E1 applies the Sprint 45.1 seven-layer pattern-aware evaluation stack** to fourteen bodies under blind independence conditions for Sprint 45.2 repeatability testing.

**Mandatory core:** Verdict-first contract scoring; secondary Detection Signals; diagnostic FMs with capture-channel separation; ownership and anti-mimicry as gates; boundary declaration before verdict on ambiguous bodies; convergent pair classification from aligned evidence.

**Protocol intent:** Produce reproducible, workbook-traceable evaluation evidence comparable to the frozen 45-1 reference session — without redesigning contracts, patterns, or Sprint 45.1 findings.

---

## Traceability

| Section | Authority |
| ------- | --------- |
| Stack layers | `EVALUATION-STACK-ANALYSIS.md` |
| Classification rules | `EVIDENCE-STANDARDS-ANALYSIS.md` |
| Scope / artefacts | `SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md` |
| Execution order / blind gate | `SPRINT-45-2-EXECUTION-PLAN.md` |
| Workbook mapping | `45-2-evidence-workbook.md` |
| Boundary B1/B2 | Design § Boundary Exercise; execution plan Phase 2.6, 3.2 |
