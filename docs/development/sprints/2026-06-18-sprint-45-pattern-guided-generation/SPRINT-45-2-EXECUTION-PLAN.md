# Sprint 45.2 Execution Plan

**Date:** 2026-06-18  
**Type:** Execution plan — not a redesign, implementation proposal, or protocol text  
**Purpose:** Define how the approved 45.2 repeatability evaluation design will be executed and evidenced  
**Design authority:** [SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md](SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md)  
**Constraint authority:** [SPRINT-45-2-DESIGN-CONSTRAINTS.md](SPRINT-45-2-DESIGN-CONSTRAINTS.md) · [SPRINT-45-2-CHARTER.md](SPRINT-45-2-CHARTER.md)

**Non-goals:** Redesign · implementation architecture · generation architecture · contract redesign · Pattern Library redesign · scope expansion

**Status:** Planned — awaiting execution authorisation

---

## Objective

### Repeatability question

> Can the Sprint 45.1 pattern-aware evaluation method — 44-2 contract verdicts as primary evidence, pattern Detection Signals as secondary corroboration, mandatory FM and ownership checks, corpus-relative anti-mimicry comparison, and explicit boundary declarations where calibration is ambiguous — be formalised into a **repeatable protocol** that yields **compatible conclusions** when applied independently to the twelve 45-1 artefacts and to a **minimal holdout** of `decision_table` and `transfer_prompt` bodies within SP-02/SP-03 scope?

### Execution goal

Execute Components A–E of the approved design, collect evidence sufficient to assess mandatory success criteria S1–S9 and failure criteria F1–F7, and produce recommendation artefacts routing to **proceed to 45.3**, **repeat 45.2**, or **stop and document negative result**.

### What execution does not do

- Re-score or relitigate Sprint 45.1 generation findings.
- Generate new obligation-matched pairs or run a second Pattern Injection Experiment.
- Modify 44-2 contracts, 44-3 Pattern Library, or Sprint 44 calibration records.
- Expand beyond SP-02/SP-03 or `decision_table`/`transfer_prompt`.

---

## Experimental Components

From approved design — dependency order preserved:

| Component | Execution activity | Primary deliverable |
| --------- | ------------------ | ------------------- |
| **A — Protocol specification** | Codify Layers 1–7 from 45-1 practice into written procedure | `45-2-pattern-aware-evaluation-protocol.md` |
| **B — Twelve-body re-evaluation** | E1 blind-scores all twelve 45-1 artefacts; classifies six pairs | `45-2-evidence-workbook.md` (paired section) |
| **C — Holdout evaluation** | E1 scores `HO-DT-01` and `HO-TP-01` as single bodies | `45-2-evidence-workbook.md` (holdout section) |
| **D — Boundary exercise** | B1 (TP-PS-A6 pair) + B2 (HO-TP-01/M22) declarations before verdict | `45-2-boundary-declaration-annex.md` |
| **E — Agreement analysis** | E0 vs E1 comparison; success/failure/inconclusive assessment | `45-2-repeatability-agreement-report.md` |

```text
Phase 0: Preconditions and artefact lock
    ↓
Phase 1: Component A — Protocol specification
    ↓
Phase 2: Component B — Twelve-body blind evaluation (six pairs)
    ↓
Phase 3: Component C — Holdout evaluation
    ↓         (Component D embedded in B3 and C2)
Phase 4: Component E — Agreement analysis
    ↓
Phase 5: Recommendation and completion review
```

---

## Artefact Set

### Twelve existing 45.1 artefacts (frozen — read-only)

Source: [`45-1-evidence/artefacts/`](45-1-evidence/artefacts/)

| Artefact ID | Pair | Condition | Material type |
| ----------- | ---- | --------- | ------------- |
| `BL-DT-MRX-A4` | DT-MRX-A4 | Baseline | `decision_table` |
| `TR-DT-MRX-A4` | DT-MRX-A4 | Treatment | `decision_table` |
| `BL-DT-PS-A4` | DT-PS-A4 | Baseline | `decision_table` |
| `TR-DT-PS-A4` | DT-PS-A4 | Treatment | `decision_table` |
| `BL-DT-PS-A6` | DT-PS-A6 | Baseline | `decision_table` |
| `TR-DT-PS-A6` | DT-PS-A6 | Treatment | `decision_table` |
| `BL-TP-MRX-A4` | TP-MRX-A4 | Baseline | `transfer_prompt` |
| `TR-TP-MRX-A4` | TP-MRX-A4 | Treatment | `transfer_prompt` |
| `BL-TP-PS-A4` | TP-PS-A4 | Baseline | `transfer_prompt` |
| `TR-TP-PS-A4` | TP-PS-A4 | Treatment | `transfer_prompt` |
| `BL-TP-PS-A6` | TP-PS-A6 | Baseline | `transfer_prompt` |
| `TR-TP-PS-A6` | TP-PS-A6 | Treatment | `transfer_prompt` |

**Immutability requirement:** Body text must match 45-1 artefact files at execution start. Any drift invalidates comparison — re-verify before E1 scoring begins.

### Holdout artefacts (frozen at selection — read-only for E1)

| Artefact ID | Approved source | Material type | Pattern lens | Selection rule |
| ----------- | --------------- | ------------- | ------------ | -------------- |
| `HO-DT-01` | Benchmark corpus **M12** or **M19** (Photosynthesis) | `decision_table` | SP-02 / §5.6 | Choose one at Phase 0; record corpus path + material ID; store verbatim copy in `45-2-evidence/artefacts/HO-DT-01.txt` |
| `HO-TP-01` | Benchmark corpus **M22** (Photosynthesis) | `transfer_prompt` | SP-03 / §5.8 | Fixed per design; store verbatim copy in `45-2-evidence/artefacts/HO-TP-01.txt` |

Holdout bodies are **not** among the twelve 45-1 artefacts. No pair structure.

### Protocol artefacts (normative inputs — read-only)

| Artefact | Role |
| -------- | ---- |
| [`sprint-44-2-instructional-depth-contracts.md`](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) | L1 contract authority (§5.6, §5.8) |
| [`sprint-44-3-instructional-pattern-library.md`](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) | L2 signals; L3 FM definitions (SP-02, SP-03) |
| Frozen benchmark corpus files | L5 anti-mimicry anchors; holdout source text |
| [`45-2-pattern-aware-evaluation-protocol.md`](45-2-pattern-aware-evaluation-protocol.md) | Sprint-produced procedure (Component A output) |
| Pair metadata + DLA obligation snapshots from [`45-1-evidence-workbook.md`](45-1-evidence-workbook.md) | Structural context for paired bodies — **layer scores withheld from E1 until blind pass complete** |

### Comparison artefacts (reference — E0 frozen)

| Artefact | Role |
| -------- | ---- |
| [`45-1-evidence-workbook.md`](45-1-evidence-workbook.md) | E0 per-body and per-pair scores — comparison baseline after E1 blind pass |
| [`45-1-recommendation.md`](45-1-recommendation.md) | E0 aggregate outcomes and pair classifications |

E1 must **not** access E0 layer fields or pair classifications during Phases 2–3.

---

## Evaluator Structure

### Roles

| Role | Description | Independence requirement |
| ---- | ----------- | ------------------------ |
| **E0 — Reference session** | Frozen 45-1 scoring recorded in workbook | Not re-run; no new scores added to 45-1 artefacts |
| **E1 — Independent evaluator** | Applies protocol to all fourteen bodies | **Must not** have scored any of the twelve 45-1 bodies during 45-1 evidence collection |
| **E2 — Optional adjudicator** | Resolves E0/E1 disagreements using protocol only | Must not have been E0 or E1; no global calibration reopening |

**Minimum valid execution:** E0 + E1.  
**Optional strengthening:** Second independent evaluator E1b (blind to E1) — not required for sprint completion.

### Blind procedure requirements

| Requirement | Enforcement |
| ----------- | ----------- |
| E1 completes all fourteen body scores before opening E0 workbook layer fields | Phase gate between Phase 3 and Phase 4 |
| E1 may receive pair metadata and obligation snapshots during scoring | Structural context only |
| E1 must not receive E0 verdicts, FM fields, ownership, mimicry, signals, pair classifications, or recommendation summary before blind gate | Document attestation in workbook |
| E1 must not receive 45-1 recommendation aggregate table before blind gate | |
| If E1 had prior read access to 45-1 recommendation, record exposure and assess I7 risk | Attestation field |

### Evidence independence attestation

Record in `45-2-evidence/experiment-metadata.md`:

| Field | Value |
| ----- | ----- |
| `e1_independent_of_45_1_scoring` | yes / no — if no, execution invalid (I7) |
| `blind_gate_observed` | yes / no |
| `e0_workbook_accessed_by_e1_after` | timestamp after E1 completion |
| `e2_used` | yes / no |
| `e1b_used` | yes / no |

---

## Execution Sequence

### Phase 0 — Preconditions and artefact lock

| Step | Action | Gate |
| ---- | ------ | ---- |
| 0.1 | Confirm design authority: this plan implements approved design without modification | — |
| 0.2 | Verify all twelve 45-1 artefact files exist and match workbook register | Block if missing |
| 0.3 | Select `HO-DT-01` source (M12 or M19); extract verbatim text to `45-2-evidence/artefacts/HO-DT-01.txt` | Record corpus path + ID |
| 0.4 | Extract `HO-TP-01` (M22) verbatim text to `45-2-evidence/artefacts/HO-TP-01.txt` | Record corpus path + ID |
| 0.5 | Create `45-2-evidence/` folder structure (see § Workbook Requirements) | — |
| 0.6 | Confirm E1 independence attestation | Block if E1 scored 45-1 bodies |
| 0.7 | Prepare E1 access package: body files + pair metadata + normative inputs — **exclude** E0 layer scores | — |

### Phase 1 — Component A: Protocol specification

| Step | Action | Output |
| ---- | ------ | ------ |
| 1.1 | Draft protocol codifying Layers 1–7, ordering, evidence standard, boundary procedure, disqualifier paths | Protocol draft |
| 1.2 | Verify protocol references but does not modify 44-2/44-3 authoritative text | Review checklist |
| 1.3 | Verify verdict-first rule, superficial-match guard, ownership/mimicry gates explicit | S1 prerequisite |
| 1.4 | Freeze protocol as `45-2-pattern-aware-evaluation-protocol.md` before E1 scoring begins | **Gate: E1 may not start Phase 2 until protocol frozen** |

### Phase 2 — Component B: Twelve-body blind evaluation

**Scoring order per body:** L6 (if ambiguous) → L1 → L2 + L3 + L4 → L5 → per-body record.

**Recommended pair evaluation order** (any order permitted if all twelve completed before blind gate):

| Step | Pair | Bodies | Notes |
| ---- | ---- | ------ | ----- |
| 2.1 | DT-MRX-A4 | BL, TR | Maintain-test |
| 2.2 | DT-PS-A4 | BL, TR | Remediation |
| 2.3 | DT-PS-A6 | BL, TR | Remediation |
| 2.4 | TP-MRX-A4 | BL, TR | Maintain-test |
| 2.5 | TP-PS-A4 | BL, TR | Remediation |
| 2.6 | TP-PS-A6 | BL, TR | **B1 boundary — declare §5.8 interpretation before scoring either body** |

| Step | Action | Output |
| ---- | ------ | ------ |
| 2.7 | After each pair: L7 pair classification (Improvement / No Change / Regression / Inconclusive) | Pair outcome sections in workbook |
| 2.8 | Record per-output success flags on treatments | Workbook derived fields |
| 2.9 | Confirm all twelve body sections complete — no blank mandatory fields | **Gate: blind completeness** |

### Phase 3 — Component C: Holdout evaluation

| Step | Action | Output |
| ---- | ------ | ------ |
| 3.1 | E1 scores `HO-DT-01` through full stack (single body — no pair classification) | Holdout section: HO-DT-01 |
| 3.2 | E1 declares boundary on `HO-TP-01` (**B2**) before verdict | Boundary annex B2 record |
| 3.3 | E1 scores `HO-TP-01` through full stack | Holdout section: HO-TP-01 |
| 3.4 | Record superficial-match flag on holdouts if applicable | S3 attempt evidence |
| 3.5 | Confirm fourteen total bodies scored | **Gate: S2 prerequisite** |

### Phase 4 — Component D + E: Boundary annex finalisation and agreement analysis

| Step | Action | Output |
| ---- | ------ | ------ |
| 4.1 | Compile B1 records from TP-PS-A6 pair scoring into boundary annex | `45-2-boundary-declaration-annex.md` |
| 4.2 | Compile B2 records from HO-TP-01 into boundary annex | Same file |
| 4.3 | **Open blind gate:** E1 (or analysis role) accesses E0 workbook | Timestamp attestation |
| 4.4 | Build E0 vs E1 agreement matrix — per body and per pair | Agreement report |
| 4.5 | Run verdict-first check (S5) | Agreement report § Signal override |
| 4.6 | Run disqualifier path log review | Agreement report § Disqualifiers |
| 4.7 | Assess S1–S9, F1–F7, I1–I7 | Agreement report § Assessment |
| 4.8 | Document disagreements with layer attribution | Disagreement log |

### Phase 5 — Recommendation and completion

| Step | Action | Output |
| ---- | ------ | ------ |
| 5.1 | Draft `45-2-recommendation.md` using recommendation template | Recommendation |
| 5.2 | Route: proceed to 45.3 / repeat 45.2 / stop | Recommendation gate |
| 5.3 | Complete completion criteria checklist | Sprint closure |

---

## Evidence Collection

### By phase

| Phase | Evidence captured |
| ----- | ----------------- |
| **0** | Artefact integrity checksum or manual verify record; holdout source citations; E1 independence attestation |
| **1** | Frozen protocol document; protocol review checklist (no 44-2/44-3 modification) |
| **2** | Per-body L1–L6 fields × 12; per-pair L7 × 6; B1 boundary records for TP-PS-A6 |
| **3** | Per-body L1–L6 fields × 2 holdouts; B2 boundary record for HO-TP-01 |
| **4** | Agreement matrix; concordance counts; disagreement log; S/F/I assessment |
| **5** | Recommendation; known limitations; routing decision |

### Per-body mandatory fields (all 14 bodies)

| Channel | Fields |
| ------- | ------ |
| **Identity** | `artefact_id`, `material_type`, `pattern_lens`, `evaluation_date`, `evaluator_role` |
| **L1 Contract** | `verdict_tier`, `contract_section`, `justification_bullets[]` |
| **L2 Signals** | `signal_checklist{}`, `signal_profile`, `superficial_match_flag` |
| **L3 FMs** | `fm_04` or `fm_02`/`fm_03`; `capture_fm01`, `capture_fm12` if present |
| **L4 Ownership** | `ownership_pass`, `ownership_regression`, `ownership_notes` |
| **L5 Anti-mimicry** | `strong_ref_proximity`, `weak_ref_distance`, `mimicry_suspect`, `corpus_comparison_notes` |
| **L6 Boundary** | Full boundary record if `ambiguity_flag = yes`; else `not_applicable` |

### Per-pair mandatory fields (six pairs only)

| Field | Rule |
| ----- | ---- |
| `baseline_verdict` | From BL body |
| `treatment_verdict` | From TR body |
| `verdict_delta` | Failed < Minimum < Strong ordering |
| `target_fm_absent_treatment` | yes / no |
| `pair_classification` | Improvement / No Change / Regression / Inconclusive |
| `per_output_success` | met / not_met (treatment) |
| `convergent_evidence_met` | yes / no / n/a (Improvement pairs) |

### Repeatability-specific evidence

| Record | Location |
| ------ | -------- |
| E1 complete workbook | `45-2-evidence-workbook.md` |
| E0 vs E1 agreement matrix | `45-2-repeatability-agreement-report.md` |
| Disagreement log with layer attribution | Agreement report appendix |
| Verdict-first check result | Agreement report |
| Disqualifier application log | Agreement report |
| Blind procedure attestation | `45-2-evidence/experiment-metadata.md` |

---

## Agreement Analysis

Performed in Phase 4 after blind gate opens.

### Per-body comparisons (twelve paired bodies)

| Field | Comparison type | Count toward |
| ----- | --------------- | ------------ |
| Contract verdict | Exact match / mismatch | S4 (≥10/12); F2 (≥3 incompatible) |
| Target FM present/absent | Exact match / mismatch | Layer concordance |
| Ownership pass; regression | Exact match / mismatch | S6; F5 |
| Mimicry suspect | Exact match / mismatch | S6; F5 |
| Superficial-match flag | Exact match / mismatch | F4 context |
| Detection Signal profile tier | Compatible / incompatible | F3 context |
| Boundary declaration | Compatible / incompatible / n/a | I3; S7 |

### Per-pair comparisons (six pairs)

| Field | Comparison type | Count toward |
| ----- | --------------- | ------------ |
| Pair classification | Exact match / mismatch | **S3 (≥5/6)**; **F1 (≤3/6)**; **F7** |

### Aggregate metrics

| Metric | Formula | Threshold |
| ------ | ------- | --------- |
| Pair concordance | Matching pair classifications ÷ 6 | S3: ≥5; F1: ≤3; I1: 4 |
| Verdict concordance | Exact verdict matches ÷ 12 | S4: ≥10; I2: 9 with S3 met |
| Classification inversions | Improvement ↔ No Change mismatches | F7: ≥2 with ≤3/6 concordance |
| Incompatible verdicts without boundary resolution | Bodies with tier mismatch and no resolvable L6 | F2: ≥3 |
| Signal override pairs | E1 Improvement without verdict rise | S5: 0; F3: ≥1 systematic |

### E0 reference pair classifications (for comparison)

| Pair | E0 classification |
| ---- | ----------------- |
| DT-MRX-A4 | No Change |
| DT-PS-A4 | Improvement |
| DT-PS-A6 | Improvement |
| TP-MRX-A4 | No Change |
| TP-PS-A4 | Improvement |
| TP-PS-A6 | Improvement |

### Holdout analysis (no E0 comparison)

- Record E1 per-body outcomes only.
- Note whether `HO-DT-01` scored as non-Improvement (expected: Minimum-tier weak shape).
- Note whether `HO-TP-01` required boundary declaration before verdict (required: yes).
- Flag superficial-match discrimination if pattern-shaped features present without Strong verdict.

---

## Boundary Exercise

Embedded in Phases 2.6 and 3.2 — consolidated in boundary annex.

### B1 — TP-PS-A6 pair (Component D touchpoint 1)

| Step | Requirement |
| ---- | ----------- |
| Before scoring `BL-TP-PS-A6` or `TR-TP-PS-A6` | E1 records boundary declaration for the pair |
| Declaration content | Explicit §5.8 minimum interpretation (TP-PS-A6 precedent: Inter-Rater conjunctive minimum) |
| Ordering check | `declaration_before_verdict = yes` |
| Global calibration | `global_calibration_reopened = no` |
| Comparison | E1 pair classification derivable from declaration; compare to E0 Improvement under same precedent |

### B2 — HO-TP-01 / M22 (Component D touchpoint 2)

| Step | Requirement |
| ---- | ----------- |
| Before scoring `HO-TP-01` | E1 records boundary declaration |
| Declaration content | Which §5.8 reading governs M22 ambiguity |
| Fields | Full boundary record per design |
| Constraint | Do not alter frozen M22 Sprint 44 historical records |

### Boundary annex structure

File: `45-2-boundary-declaration-annex.md`

```text
B1 — TP-PS-A6
  ambiguity_flag, calibration_reference, declared_interpretation,
  declaration_before_verdict, global_calibration_reopened,
  verdict_baseline, verdict_treatment, pair_classification

B2 — HO-TP-01 (M22)
  ambiguity_flag, calibration_reference, declared_interpretation,
  declaration_before_verdict, global_calibration_reopened,
  verdict_under_declaration
```

### Boundary failure signals

- `global_calibration_reopened = yes` on any record → procedural failure.
- Incompatible declarations with no protocol resolution → F6 risk.
- TP-PS-A6 classified Inconclusive solely due to undeclared ambiguity → S7 failure.

---

## Workbook Requirements

### File structure

```text
docs/development/sprints/2026-06-18-sprint-45-pattern-guided-generation/
  45-2-pattern-aware-evaluation-protocol.md      # Component A
  45-2-evidence-workbook.md                        # Components B + C
  45-2-boundary-declaration-annex.md                # Component D
  45-2-repeatability-agreement-report.md            # Component E
  45-2-recommendation.md                            # Phase 5
  45-2-evidence/
    experiment-metadata.md
    artefact-register.md
    artefacts/
      HO-DT-01.txt
      HO-TP-01.txt
    disagreement-log.md                             # optional split from agreement report
```

Twelve 45-1 body files remain in [`45-1-evidence/artefacts/`](45-1-evidence/artefacts/) — not duplicated unless integrity copy desired.

### Workbook sections required

| Section | Content |
| ------- | ------- |
| **Instructions** | Score GAM body text only; verdict-first; FM-01/FM-12 under capture channel; cite §5.6/§5.8 bullets |
| **Artefact register** | All fourteen bodies with populated flag |
| **Paired body sections × 12** | Full per-body evidence per § Evidence Collection |
| **Pair outcome sections × 6** | L7 synthesis per pair |
| **Holdout sections × 2** | HO-DT-01, HO-TP-01 per-body only |
| **Blind attestation** | E1 independence and blind gate record |

### Field completeness gate

Before Phase 4 blind gate opens:

- [ ] All fourteen bodies: L1 verdict + justification present
- [ ] All fourteen bodies: L2 signals + superficial_match_flag present
- [ ] All fourteen bodies: L3 target FMs present
- [ ] All fourteen bodies: L4 ownership complete
- [ ] All fourteen bodies: L5 anti-mimicry complete
- [ ] Ambiguous bodies: L6 boundary record complete
- [ ] All six pairs: pair_classification present
- [ ] B1 and B2 boundary records in annex

---

## Classification Outputs

### Per-body outputs (E1)

| Output | Applies to |
| ------ | ---------- |
| Contract verdict (Failed / Minimum / Strong) | All 14 |
| Signal profile + superficial-match flag | All 14 |
| FM presence/absence | All 14 |
| Ownership pass/fail + regression | All 14 |
| Mimicry suspect yes/no | All 14 |
| Boundary declaration (if ambiguous) | TP-PS-A6 bodies + HO-TP-01 |

### Per-pair outputs (E1 — six pairs only)

| Output | Values |
| ------ | ------ |
| `pair_classification` | Improvement / No Change / Regression / Inconclusive |
| `per_output_success` | met / not_met |
| `convergent_evidence_met` | yes / no / n/a |

### Agreement outputs (Phase 4)

| Output | Description |
| ------ | ------------- |
| Pair concordance count | n/6 |
| Verdict concordance count | n/12 |
| Per-field agreement matrix | Body × field × match/mismatch |
| Disagreement log | Mismatches with layer attribution |
| S5 verdict-first check | pass / fail |
| S/F/I assessment table | Each criterion: met / not_met / n/a |

---

## Recommendation Outputs

File: `45-2-recommendation.md`

### Required sections

| Section | Content |
| ------- | ------- |
| **Summary** | Pair concordance, verdict concordance, holdout status, boundary exercise status |
| **Success criteria review** | S1–S9 each: met / not_met |
| **Failure criteria review** | F1–F7 each: triggered / not_triggered |
| **Inconclusive flags** | I1–I7 if applicable |
| **Known limitations** | e.g. I5 disqualifier unstress-tested; frozen corpus holdout vs generated |
| **Routing decision** | Proceed to 45.3 / Repeat 45.2 / Stop |
| **Repeat scope** | If repeat: which component only |
| **Gate statement** | Whether evaluation standing achieved for SP-02/SP-03 scope |

### Routing rules (from approved design)

| Decision | Condition |
| -------- | --------- |
| **Proceed to 45.3** | S1–S9 met; no F1–F7; limitations documented |
| **Repeat 45.2** | I1–I7 or partial success per design § Recommendation Gate |
| **Stop** | Any F1–F7; or repeat still fails S1–S9 |

**Stop does not invalidate** 45-1 generation findings in scope.

---

## Success Review

Assess mandatory criteria S1–S9 after Phase 4. All must be met for **proceed to 45.3**.

| ID | Criterion | Evidence source | Pass check |
| -- | --------- | --------------- | ---------- |
| S1 | Protocol exists covering L1–L7 without 44-2/44-3 modification | Protocol file + review checklist | File exists; checklist signed |
| S2 | E1 scored all 12 + 2 holdouts through full stack | Workbook completeness gate | 14/14 bodies complete |
| S3 | Pair concordance ≥5/6 | Agreement report | Count ≥5 |
| S4 | Verdict concordance ≥10/12 | Agreement report | Count ≥10 |
| S5 | Zero E1 Improvement on signals without verdict rise | Agreement report § Signal override | Count = 0 |
| S6 | Ownership + anti-mimicry traceable on all 14 bodies | Workbook field audit | No blank/ad hoc fields |
| S7 | Boundary complete B1 + B2; `global_calibration_reopened = no` | Boundary annex | Both records; flag = no |
| S8 | Both holdouts evaluated | Workbook holdout sections | HO-DT-01 + HO-TP-01 present |
| S9 | Disagreements documented and resolvable | Disagreement log | No F5/F6 indicators |

### Strong support (record, not required for pass)

- 6/6 pair concordance
- 12/12 verdict concordance
- Superficial-match discrimination observed on holdout
- Disqualifier path explicit application log

---

## Failure Review

Assess F1–F7 after Phase 4. **Any one triggered → stop** (unless repeat authorised for inconclusive band).

| ID | Condition | Detection method |
| -- | --------- | ---------------- |
| F1 | Pair concordance ≤3/6 | Agreement report pair count |
| F2 | ≥3 bodies incompatible verdicts without resolvable boundary | Agreement matrix + disagreement log |
| F3 | Systematic signal/verdict divergence (≥2 bodies or E1 signal-only Improvement) | Agreement report § Signal override + body review |
| F4 | E1 Improvement where superficial-match should block | Pair + body cross-check vs E0 |
| F5 | Ownership/anti-mimicry not operationalisable from protocol | E1 attestation or incomplete fields |
| F6 | Disagreement exceeds utility; no resolution path | Disagreement log review |
| F7 | ≤3/6 pair concordance AND ≥2 Improvement ↔ No Change inversions | Agreement report |

### Inconclusive band (not failure — triggers repeat)

| ID | Condition |
| -- | --------- |
| I1 | Pair concordance = 4/6 |
| I2 | Verdict concordance = 9/12 with S3 met |
| I3 | Single pair discordance on boundary declaration only |
| I4 | Holdout incomplete |
| I5 | No superficial-match case; all else met |
| I6 | E1b disagrees with E1 on ≥3 bodies |
| I7 | Blind broken or protocol incomplete |

Document open unknowns from repeatability analysis when inconclusive.

---

## Risks

Execution risks only — not design or resourcing.

| Risk | Execution impact | Mitigation step |
| ---- | ---------------- | --------------- |
| **Blind gate breached** | E1 exposed to E0 scores early | Phase 0 package excludes layer fields; attestation; I7 if breached |
| **Artefact text drift** | Invalid E0/E1 comparison | Phase 0 integrity verify |
| **Protocol unfrozen before E1 starts** | S1 failure | Phase 1 gate blocks Phase 2 |
| **Incomplete workbook fields** | S6 failure; blocks Phase 4 | Completeness gate before blind opens |
| **Boundary declared after verdict** | S7 failure | Enforce ordering in TP-PS-A6 and HO-TP-01 steps |
| **E1 not independent** | Invalid execution | Phase 0 attestation block |
| **Holdout source not recorded** | Audit trail gap | Artefact register with corpus path + ID |
| **Agreement analysis before workbook complete** | Premature S/F assessment | Phase sequence enforcement |
| **Global calibration reopened accidentally** | Procedural violation | Boundary annex `global_calibration_reopened` check |
| **Recommendation drafted without F-review** | Wrong routing | Phase 5 requires completed agreement report |

---

## Completion Criteria

Sprint 45.2 is **complete** when all of the following exist and are internally consistent:

### Mandatory deliverables

| # | Deliverable | Validates |
| - | ----------- | --------- |
| 1 | `45-2-pattern-aware-evaluation-protocol.md` | S1 |
| 2 | `45-2-evidence-workbook.md` — fourteen bodies, six pairs, blind attestation | S2, S6, S8 |
| 3 | `45-2-boundary-declaration-annex.md` — B1 + B2 | S7 |
| 4 | `45-2-repeatability-agreement-report.md` — matrix, metrics, S/F/I assessment | S3–S5, S9 |
| 5 | `45-2-recommendation.md` — routing decision | Gate |
| 6 | `45-2-evidence/artefact-register.md` — twelve 45-1 refs + two holdouts with sources | Traceability |
| 7 | `45-2-evidence/experiment-metadata.md` — independence + blind attestation | Methodology |

### Mandatory evidence states

| State | Requirement |
| ----- | ----------- |
| **Bodies evaluated** | 14/14 through full seven-layer stack by E1 |
| **Pairs classified** | 6/6 pair outcomes recorded |
| **Agreement computed** | E0 vs E1 comparison complete for twelve paired bodies |
| **Criteria assessed** | S1–S9 and F1–F7 each explicitly marked |
| **Route declared** | Proceed / Repeat / Stop with justification |

### Completion does not require

- Proceed to 45.3 routing (stop or repeat are valid completions).
- Perfect 6/6 pair concordance.
- Optional E1b or E2 participation.
- New generation of holdout bodies (frozen corpus holdouts satisfy design).

### Invalid incomplete states

| State | Action |
| ----- | ------ |
| Protocol only, no E1 evaluation | Not complete — return to Phase 2 |
| Twelve bodies only, no holdouts | Not complete — return to Phase 3 |
| E1 complete, no agreement report | Not complete — return to Phase 4 |
| Agreement report without recommendation | Not complete — return to Phase 5 |
| Blind gate not observed | I7 — repeat affected components |

---

## Traceability

| Section | Authority |
| ------- | --------- |
| Objective / components | `SPRINT-45-2-REPEATABILITY-EVALUATION-DESIGN.md` |
| Artefact set | Design § Scope; `45-1-evidence-workbook.md` |
| Evaluator structure | Design § Included evaluators |
| Success/failure thresholds | Design § Success/Failure/Inconclusive |
| Evidence fields | `EVIDENCE-STANDARDS-ANALYSIS.md`; design § Evidence Collection |
| Execution sequence | Design components A–E; `45-1-experiment-execution-plan.md` logging patterns |
| Constraints | `SPRINT-45-2-DESIGN-CONSTRAINTS.md` |

---

## Execution checklist (summary)

```text
[ ] Phase 0 — Artefacts locked; E1 independent; holdouts extracted
[ ] Phase 1 — Protocol frozen (S1)
[ ] Phase 2 — Twelve bodies blind-scored; six pairs classified; B1 recorded
[ ] Phase 3 — Two holdouts scored; B2 recorded
[ ] Phase 4 — Blind gate opened; agreement report complete
[ ] Phase 5 — Recommendation routed; completion criteria met
```

*This plan implements the approved design without modification. Deviations require design amendment before execution.*
