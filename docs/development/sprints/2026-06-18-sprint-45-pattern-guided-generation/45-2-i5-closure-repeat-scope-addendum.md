# Sprint 45.2 I5 Closure Repeat Scope Addendum

**Date:** 2026-06-17  
**Type:** Repeat scope addendum — scope definition only  
**Status:** Drafted — not authorised for execution  
**Parent sprint:** Sprint 45.2 Pattern-Aware Evaluation Repeatability Study (complete)  
**Routing authority:** [`45-2-recommendation.md`](45-2-recommendation.md) — Repeat 45.2, targeted I5 closure  
**Protocol authority:** [`45-2-pattern-aware-evaluation-protocol.md`](45-2-pattern-aware-evaluation-protocol.md) v1.0 (frozen — read-only)  
**I5 authority:** [`45-2-repeatability-agreement-report.md`](45-2-repeatability-agreement-report.md) § Inconclusive Criteria Review · § Open unknowns

**Non-goals for this document:** Challenge case authoring · E1 scoring · agreement re-analysis · protocol amendment · recommendation reversal

---

## 1. Purpose

Close inconclusive criterion **I5** by testing whether the frozen Sprint 45.2 protocol **detects and handles** an explicit **superficial-match-positive** case.

I5 condition (frozen): `No superficial-match case; all else met`.

Sprint 45.2 established that no `superficial_match = yes` case was observed in the compared paired bodies. Disqualifier-path behaviour under positive superficial-match conditions therefore remains **unstress-tested**. This addendum defines the **narrowest repeat scope** authorised by the Sprint 45.2 recommendation to supply the missing evidence and determine whether I5 can be cleared without reopening completed Sprint 45.2 work.

**Success definition (scope level):** Produce one scored, documented superficial-match-positive challenge case and a recorded disqualifier-path outcome under the frozen protocol — sufficient to support an I5 closure determination.

---

## 2. Non-goals

The I5 closure repeat extension **must not**:

| Non-goal | Rationale |
| -------- | --------- |
| Run a new Pattern Injection Experiment or new generation study | Recommendation specifies targeted repeatability extension, not regeneration |
| Re-execute full Sprint 45.2 (Components A–E) | Routing selected “Other — specify”, not full sprint |
| Re-score, re-open, or amend E1 records for the original twelve 45.1 bodies | Completed scoring is frozen |
| Re-score or amend holdout bodies (`HO-DT-01`, `HO-TP-01`) | Outside I5 closure scope |
| Re-run E0 vs E1 agreement analysis on the original fourteen bodies or six pairs | Completed agreement analysis is frozen |
| Modify [`45-2-pattern-aware-evaluation-protocol.md`](45-2-pattern-aware-evaluation-protocol.md), 44-2 contracts, 44-3 Pattern Library, or Sprint 44 calibration records | Constraint 1 |
| Alter the Sprint 45.2 recommendation outcome or routing decision | Constraint 4 — addendum extends scope only |
| Expand beyond SP-02 / SP-03 or beyond `decision_table` / `transfer_prompt` material types | Constraint 5 |
| Resolve non-I5 discordances (BL-TP-MRX-A4, BL-TP-PS-A6, TP-MRX-A4) | Out of scope for I5 closure |
| Authorise 45.3 corpus regression | Remains blocked until I5 closure is resolved |
| Begin scoring or execution under this addendum until separately authorised | Scope definition only |

---

## 3. Required challenge case characteristics

The explicit superficial-match-positive challenge case **must** satisfy all of the following.

### 3.1 Scope and material constraints

| Requirement | Specification |
| ----------- | ------------- |
| Pattern lens | **SP-02** (`decision_table`, §5.6, FM-04) **or** **SP-03** (`transfer_prompt`, §5.8, FM-02/FM-03) — **one** lens only for the I5 pair |
| Material type | `decision_table` if SP-02; `transfer_prompt` if SP-03 |
| Domain / obligation | Within an obligation already represented in Sprint 45.1/45.2 evaluation scope (Marx or Photosynthesis) |
| Corpus relationship | Must not be one of the twelve frozen 45.1 artefact bodies or the two holdout bodies |

### 3.2 Superficial-match design intent

| Requirement | Specification |
| ----------- | ------------- |
| Intentional pattern shape | Treatment body must **intentionally** exhibit SP-02 or SP-03 Detection Signal profile features (checklist items met or substantially met per frozen L2 procedure) |
| Verdict non-rise | Treatment must **fail to achieve** a genuine Layer 1 verdict rise relative to baseline **or** must present pattern-shaped L2 signals **without** valid Layer 1 improvement — i.e. shape without substantive contract gain |
| FM / contract realism | Baseline and treatment must be scorable under frozen §5.6 or §5.8 without protocol amendment; target FM(s) for the chosen pattern must be assessable on treatment |
| Guard testability | Sufficient body structure for E1 to apply L2 signal checklist, set `superficial_match_flag`, and complete L3–L5 without undeterminable ownership from recorded text alone |
| Disqualifier exercisability | Case must be constructed so that, if E1 applies the frozen protocol correctly, `superficial_match_flag = yes` on the **treatment** body is **expected** |

### 3.3 Prohibited challenge designs

| Prohibited | Reason |
| ---------- | ------ |
| Treatment with clear verdict rise + target FM absent + ownership pass + no superficial match | Would not produce `superficial_match = yes`; does not close I5 |
| Bodies requiring new boundary touchpoints or protocol exceptions | Frozen protocol only |
| Mimicry-primary or ownership-fail-primary cases | I5 tests superficial-match disqualifier path, not F2/F3 substitutes |
| Cases depending on E0 comparison or 45.1 pair reclassification | Additive evidence only |

### 3.4 Layer recordability

Each body in the challenge set must support full frozen **Body Evaluation Procedure** recording:

- Layer 1 — Contract verdict + justification
- Layer 2 — Signal profile + `superficial_match_flag`
- Layer 3 — Target FM(s) + capture channel
- Layer 4 — Ownership pass + regression
- Layer 5 — Anti-mimicry fields + corpus comparison summary
- Layer 7 input — Convergent notes as required for pair synthesis

---

## 4. Recommended minimal artefact structure

### 4.1 Selected structure: one paired baseline/treatment challenge

| Option | Selected | Rationale |
| ------ | -------- | --------- |
| Single body only | [ ] | Insufficient — does not exercise pair-level disqualifier gate |
| **Paired baseline/treatment (one pair)** | **[x]** | **Minimally sufficient** under frozen protocol |
| Multi-pair or mixed SP-02 + SP-03 set | [ ] | Exceeds “one explicit … challenge case” in recommendation |

### 4.2 Justification

A **single paired baseline/treatment challenge** is the minimally sufficient structure because:

1. **I5 trigger context.** Sprint 45.2 recorded I5 because no `superficial_match = yes` case appeared in the **compared paired bodies**. Closure requires evidence in the same structural context the inconclusive criterion addresses.

2. **Frozen L2 rule.** Protocol Layer 2 mandates `superficial_match_flag = yes` when pattern-shaped features are present and verdict has not risen in **paired context** (treatment relative to baseline).

3. **Disqualifier path location.** Pair Classification Procedure Step 3 — Disqualifier check (mandatory before Improvement) — tests **superficial match (signals met, verdict not risen)** using treatment Layer 2 input. A single unpaired body does not invoke this gate.

4. **Recommendation wording.** The authorised repeat scope requires verification of **disqualifier-path behaviour under positive superficial-match conditions** — that path is pair-classification logic, not body-only scoring.

5. **Phase 4.6 precedent.** Sprint 45.2 disqualifier-path review was pair-level. I5 closure evidence must be comparable in granularity.

A holdout-style single body could record an L2 flag but would **not** complete the disqualifier-path stress test that I5 left open.

### 4.3 Proposed artefact identifiers (tentative — finalise at case selection)

| Artefact ID | Role | Pair ID |
| ----------- | ---- | ------- |
| `BL-I5-CH-01` | Baseline | `I5-CH-01` |
| `TR-I5-CH-01` | Treatment (superficial-match challenge) | `I5-CH-01` |

**Storage (when created):** [`45-2-evidence/artefacts/`](45-2-evidence/artefacts/) — separate from frozen 45.1 and holdout files.

**Pair metadata:** One new pair row in I5 closure artefact register; no linkage to DT-MRX-A4, DT-PS-A4, DT-PS-A6, TP-MRX-A4, TP-PS-A4, or TP-PS-A6.

### 4.4 Boundary declarations

| Touchpoint | Applicability |
| ---------- | ------------- |
| B1 (TP-PS-A6) | **Not required** — distinct pair |
| B2 (HO-TP-01) | **Not required** — not a holdout |
| New boundary touchpoint | **Prohibited** — challenge case must be scorable without protocol amendment |

If the selected case is inherently ambiguous under §5.8 in a way that would require a new boundary procedure, **reject the case** and select an alternative within scope.

---

## 5. Evidence required for I5 closure

All evidence is **additive**. No amendment to existing workbook sections for the original fourteen bodies.

### 5.1 Mandatory evidence set

| # | Evidence item | Source / location |
| - | ------------- | ----------------- |
| 1 | E1 blind scoring record | I5 closure workbook section — E1 evaluator identity, protocol v1.0 reference, blind maintained until I5 scoring complete |
| 2 | Layer 1 verdict (baseline + treatment) | Per-body workbook entries |
| 3 | Layer 2 signal profile + `superficial_match_flag` | Per-body workbook entries — **treatment must record `superficial_match_flag`** |
| 4 | Layer 3 FM record | Per-body workbook entries — target FM(s) for chosen SP lens |
| 5 | Layer 4 ownership audit | Per-body workbook entries |
| 6 | Layer 5 anti-mimicry / mimicry review | Per-body workbook entries |
| 7 | Pair classification | Workbook § I5 pair comparison — classification + derived flags |
| 8 | Disqualifier-path application log | I5 closure report — explicit record that superficial-match disqualifier was applied and outcome |
| 9 | I5 closure determination | I5 closure report — closed / still open / failure-level |

### 5.2 E1 independence requirements

| Requirement | Specification |
| ----------- | ------------- |
| Protocol version | `1.0 (frozen)` — [`45-2-pattern-aware-evaluation-protocol.md`](45-2-pattern-aware-evaluation-protocol.md) |
| E0 access during I5 scoring | **Prohibited** — no consultation of [`45-1-evidence-workbook.md`](45-1-evidence-workbook.md) layer fields or [`45-2-evidence-workbook.md`](45-2-evidence-workbook.md) original body/pair scores during I5 blind pass |
| Prior recommendation access during scoring | **Prohibited** — E1 must not use [`45-2-recommendation.md`](45-2-recommendation.md) routing rationale to bias superficial-match judgement |
| Blind gate | Open only after I5 pair scoring complete (mirrors Sprint 45.2 Phases 2–3 discipline) |

### 5.3 Optional supporting evidence

| Item | When required |
| ---- | ------------- |
| Challenge case design rationale | Recommended at case selection — documents intentional superficial-shape / non-rise design |
| Corpus comparison anchors | As required by L5 procedure for the chosen obligation |

---

## 6. Closure criteria

### 6.1 I5 closed

I5 is **closed** when **all** of the following are recorded:

| Criterion | Required outcome |
| --------- | ---------------- |
| Positive superficial-match observation | E1 records `superficial_match_flag = yes` on **treatment** (`TR-I5-CH-01`) |
| Layer completeness | L1–L5 fields complete on both bodies per frozen protocol |
| Disqualifier path exercised | Pair Classification Step 3 completed; superficial-match disqualifier **considered and documented** |
| Improvement not wrongly awarded | Pair classification is **not** Improvement when superficial match applies with verdict non-rise (expected: **No Change**, **Regression**, or **Inconclusive** per frozen rules — **not** Improvement) |
| No failure criterion triggered | F4 (and other F1–F7) **not** triggered on I5 evidence |
| Closure report issued | [`45-2-i5-closure-report.md`](45-2-i5-closure-report.md) records determination: **I5 closed** |

**Interpretation:** I5 closure means the frozen protocol **successfully detected** superficial pattern shape **and** the disqualifier path **behaved as specified** under positive superficial-match conditions. It does not require concordance with E0 (no E0 exists for the challenge pair).

### 6.2 I5 still open

I5 remains **open** if any of the following occur after the I5 extension:

| Condition | Status |
| --------- | ------ |
| No `superficial_match = yes` recorded on treatment despite challenge intent | I5 still open — positive case not demonstrated |
| `superficial_match = yes` recorded but disqualifier-path log incomplete or ambiguous | I5 still open — stress test inconclusive |
| Pair classified Improvement with `superficial_match = yes` and verdict non-rise, but case review finds protocol misapplication rather than protocol failure | I5 still open — rescope or re-score under authorisation |
| Challenge case could not be scored without protocol exception | I5 still open — case selection failure; select new case |
| I5 extension not executed | I5 still open — unchanged from Sprint 45.2 outcome |

### 6.3 Failure-level evidence

The following constitute **failure-level** evidence on the I5 extension (not merely “still open”):

| Failure signal | Maps to | Meaning |
| -------------- | ------- | ------- |
| E1 classifies **Improvement** where treatment has `superficial_match = yes` and verdict has **not** strictly risen above baseline | **F4** | Cosmetic pattern shape passes as Improvement — superficial-match control fails |
| E1 classifies **Improvement** with superficial-match disqualifier conditions met and disqualifier check not documented | **F4** (protocol integrity) | Disqualifier path bypass |
| Ownership regression or mimicry suspect on treatment classified as Improvement | **F2 / F3** | Disqualifier hard-gate failure |
| E1 scoring required protocol amendment to complete | Contract / protocol incoherence | Escalate to Stop path review — outside I5-only closure |

Failure-level evidence on the I5 extension **does not** retroactively invalidate completed Sprint 45.2 S1–S9 attainment. It blocks I5 closure and requires documented routing review (potential Stop or rescoped repeat) per frozen F-criteria logic.

---

## 7. Artefacts to create

| Artefact | File | Phase | Status |
| -------- | ---- | ----- | ------ |
| **Repeat scope addendum** | `45-2-i5-closure-repeat-scope-addendum.md` | Scope | This document |
| **I5 challenge artefact files** | `45-2-evidence/artefacts/BL-I5-CH-01.txt` · `45-2-evidence/artefacts/TR-I5-CH-01.txt` | Case preparation | Not created |
| **I5 challenge design note** (recommended) | `45-2-evidence/i5-challenge-design-note.md` | Case preparation | Not created |
| **I5 closure workbook section** | `45-2-i5-closure-workbook.md` (or dedicated § in workbook annex) | Execution | Not created |
| **I5 closure report** | `45-2-i5-closure-report.md` | Post-scoring | Not created |
| **Updated execution status** | `SPRINT-45-2-EXECUTION-STATUS.md` | Post-scope / post-closure | Pending update |
| **Recommendation addendum** (if I5 closed) | `45-2-recommendation-i5-closure-addendum.md` | Post-closure only | Not created |

### 7.1 Immutability rules

| Artefact set | Rule |
| ------------ | ---- |
| Twelve 45.1 bodies + two holdouts | Read-only — never modified by I5 extension |
| `45-2-evidence-workbook.md` (original sections) | Read-only — I5 evidence in separate workbook artefact |
| `45-2-repeatability-agreement-report.md` | Read-only — no re-analysis of original matrix |
| `45-2-recommendation.md` | Read-only — closure outcomes recorded in addendum only |

### 7.2 Recommendation addendum content (if I5 closed)

The recommendation addendum **may** record:

- I5 closure determination and evidence pointer
- Updated gate statement for 45.3 authorisation review (does not auto-authorise 45.3)
- Residual limitations unchanged by I5 (e.g. non-I5 discordances, I5-closed disclaimer)

It **must not** alter the original Repeat 45.2 routing record.

---

## 8. Execution outline (scope reference only — not authorised)

For planning purposes only. **No phase below is authorised by this addendum.**

| Phase | Activity | Deliverable |
| ----- | -------- | ----------- |
| I5-0 | Approve addendum; select or prepare challenge pair | Challenge artefact files + design note |
| I5-1 | E1 blind scoring of `BL-I5-CH-01` + `TR-I5-CH-01` | I5 closure workbook section |
| I5-2 | Pair classification + disqualifier-path log | Workbook pair section + closure report draft |
| I5-3 | I5 closure determination | `45-2-i5-closure-report.md` |
| I5-4 | Status + recommendation addendum (if closed) | Updated status; optional recommendation addendum |

---

## 9. Next step after this addendum

**Prepare or select** the explicit superficial-match-positive challenge pair (`BL-I5-CH-01` / `TR-I5-CH-01`) meeting §3 characteristics.

- Document design intent in `45-2-evidence/i5-challenge-design-note.md`.
- Store verbatim body text in `45-2-evidence/artefacts/`.
- **Do not** execute E1 scoring until I5-0 case selection is complete and I5-1 execution is separately authorised.

---

## 10. Authority chain

| Document | Role |
| -------- | ---- |
| [`45-2-recommendation.md`](45-2-recommendation.md) | Routes to Repeat 45.2; specifies targeted I5 closure scope |
| [`45-2-repeatability-agreement-report.md`](45-2-repeatability-agreement-report.md) | Records I5 trigger and open unknown |
| [`45-2-pattern-aware-evaluation-protocol.md`](45-2-pattern-aware-evaluation-protocol.md) v1.0 | Normative scoring and disqualifier procedure (frozen) |
| [`SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md`](SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md) | I5 / F4 definitions (design authority — not modified) |
| This addendum | Defines I5 closure repeat scope only |

---

## Sign-off (scope approval)

| Field | Value |
| ----- | ----- |
| Addendum version | 1.0-draft |
| Execution authorised | [ ] yes  [x] no |
| Challenge case selected | [ ] yes  [ ] no |
| E1 scoring authorised | [ ] yes  [x] no |
