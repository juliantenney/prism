# Methodological Contributions of Sprint 45.1

**Date:** 2026-06-18  
**Type:** Research-method analysis — not a sprint plan, protocol, or implementation proposal  
**Purpose:** Determine what methodological contributions, if any, emerged from Sprint 45.1 beyond immediate experimental findings  
**Authority:** [SPRINT-45-1-CLOSURE-REVIEW.md](SPRINT-45-1-CLOSURE-REVIEW.md) · [45-1-recommendation.md](45-1-recommendation.md) · [pattern-aware-evaluation-position-paper.md](pattern-aware-evaluation-position-paper.md) · [CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md](CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md) · [FRONTIER-REVIEW-AFTER-SPRINT-45-1.md](FRONTIER-REVIEW-AFTER-SPRINT-45-1.md) · [LESSONS-FROM-SP-02-AND-SP-03.md](LESSONS-FROM-SP-02-AND-SP-03.md) · [SPRINT-45-2-CHARTER.md](SPRINT-45-2-CHARTER.md)

**Non-goals:** Implementation · protocol design · architecture · contract or Pattern Library redesign

---

## Background

Sprint 45.1 was the **Pattern Injection Experiment** — a controlled test of whether evidence-backed Pattern Library entries SP-02 (`decision_table`) and SP-03 (`transfer_prompt`) could be deliberately applied to GAM material bodies such that outcomes improved on matched DLA obligations while preserving learner ownership and avoiding benchmark mimicry.

| Dimension | Scope |
| --------- | ----- |
| Patterns | SP-02, SP-03 only |
| Material types | `decision_table`, `transfer_prompt` |
| Domains | Marx, Photosynthesis |
| Design | Six obligation-matched baseline/treatment pairs (12 bodies) |
| Primary measure | 44-2 contract verdicts (§5.6, §5.8) |
| Secondary measures | Detection Signals, FM checks, ownership audit, anti-mimicry comparison |
| Injection mechanism | Open (Q-02) — pattern-guided bodies, not production pipeline |

Sprint 44 had made instructional quality **observable** on a frozen corpus. Sprint 45.1 asked whether pattern guidance could **influence** generated bodies — a different research modality requiring different evaluative machinery. This document assesses whether 45.1 contributed **methodology** beyond its substantive findings about SP-02 and SP-03.

---

## Immediate Experimental Findings

Direct results only — no interpretation.

| Metric | Value |
| ------ | ----- |
| Pairs completed | 6/6 |
| Improvements | 4 (all Photosynthesis remediation) |
| No Change | 2 (Marx maintain-test) |
| Regressions | 0 |
| Inconclusive | 0 |
| Ownership regressions | 0 |
| Mimicry suspect | No on all six pairs |
| FM aggregate delta | FM-04: 2→0 · FM-02: 1→0 · FM-03: 2→0 |
| Photosynthesis remediation rate | 4/4 |
| Treatment bodies with Strong verdicts | 6/6 |
| Treatment bodies with Strong Detection Signal profiles | 6/6 |
| Experiment-level success criteria | Met |
| Experiment-level failure criteria | Not triggered |
| Recommendation | Proceed to 45-2 |

**Pair-level verdict deltas:**

| Pair | Baseline → Treatment |
| ---- | -------------------- |
| DT-MRX-A4 | Strong → Strong |
| DT-PS-A4 | Minimum → Strong |
| DT-PS-A6 | Minimum → Strong |
| TP-MRX-A4 | Strong → Strong |
| TP-PS-A4 | Failed → Strong |
| TP-PS-A6 | Failed → Strong *(under declared M22 interpretation)* |

---

## Methodological Problem Addressed

Before Sprint 45.1, PRISM had a validated **corpus characterisation method** but no demonstrated **generation intervention evaluation method**.

### What Sprint 44 provided

- Single-body contract scoring on frozen historical captures.
- Verdict tiers (Failed / Minimum / Strong) with inter-rater validation.
- Pattern extraction **from** evaluation outcomes.
- Evidence chain: corpus → contracts → patterns ([`sprint-44-review.md`](../2026-06-15-sprint-44/sprint-44-review.md)).

### What Sprint 44 did not provide

| Gap | Recorded in Sprint 44 closure |
| --- | ------------------------------ |
| Patterns → generation | "No experiment yet whether patterns improve GAM output" |
| Paired intervention comparison | Not applicable — Sprint 44 scored fixed bodies |
| Trustworthiness of generation improvement | Not tested — no generation intervention |
| Cosmetic vs substantive discrimination under intervention | Not required for corpus scoring |
| Ownership audit as independent channel | Embedded in contract principles; not separately exercised under pattern guidance |
| Anti-mimicry under deliberate Strong-shape targeting | Not tested |
| Boundary declaration under active evaluation | Documented historically (M22); not operationalised for new bodies |

*Interpretation:* When the research question shifts from *what quality shapes exist?* to *did deliberate pattern guidance improve bodies on identical obligations?*, contract verdict alone does not close epistemic gaps that 45-1 exposed in practice ([`pattern-aware-evaluation-position-paper.md`](pattern-aware-evaluation-position-paper.md) § The Problem).

---

## Methodological Contributions

Each contribution assessed separately against 45-1 evidence. **Demonstrated** = operated in 45-1 with recorded outcomes. **Named** = conceptualised in post-45.1 documents from 45-1 practice. **Unproven** = not yet standing or generalisable.

### 1. Pattern-aware evaluation

**What it is:** Multi-layer evaluative stance — contract verdict primary; Detection Signals, FMs, ownership, anti-mimicry, and boundary declarations as surrounding evidence ([`pattern-aware-evaluation-position-paper.md`](pattern-aware-evaluation-position-paper.md)).

| Status | Assessment |
| ------ | ---------- |
| **Demonstrated** | Yes — all six pairs evaluated through the full stack; workbook instructions mandated layer ordering |
| **Named** | Yes — position paper defines concept from 45-1 practice |
| **Contribution** | **Strong** — 45-1's primary methodological output; chartered as 45-2 research question |

**Evidence:** Pair classifications required convergent layers, not contract alone. Recommendation explicitly frames next step as formalising this method.

---

### 2. Convergent judgement

**What it is:** Requirement that multiple evidence channels align before classifying intervention success — verdict improvement + target FM absent + ownership preserved + anti-mimicry clearance (+ secondary signals).

| Status | Assessment |
| ------ | ---------- |
| **Demonstrated** | Yes — design pre-specified convergent evidence standard; all four Photosynthesis improvements satisfied it; no superficial-match failures triggered |
| **Contribution** | **Strong** — prevented false positives from pattern-shaped output without verdict rise (design failure criterion: "Pattern signals present but verdict unchanged or worse = superficial pattern match — failure") |

**Evidence:** [`45-1-pattern-injection-experiment-design.md`](45-1-pattern-injection-experiment-design.md) § Failure Criteria; [`45-1-recommendation.md`](45-1-recommendation.md) § Success Criteria Review (convergent evidence 4/4).

---

### 3. Verdict-first evaluation

**What it is:** Strict priority ordering — 44-2 contract verdict drives pair classification; Detection Signals corroborate but do not override.

| Status | Assessment |
| ------ | ---------- |
| **Demonstrated** | Yes — workbook instruction: "Detection Signals are secondary to contract verdict"; all pair outcomes followed verdict ordering |
| **Contribution** | **Strong** — rejected checklist-only success as failure mode in design; no pair improved on signals without verdict rise |

**Evidence:** Closure review § What 45-1 Demonstrated (6); contracts-and-patterns analysis: patterns operationalise, contracts measure.

---

### 4. Ownership auditing

**What it is:** Independent audit channel — whether author scaffolding preserves learner-assigned output loci (MP-1 / scaffold ≠ deliverable), with **regression as override** regardless of verdict or signals.

| Status | Assessment |
| ------ | ---------- |
| **Demonstrated** | Yes — exercised on all six treatment bodies; zero regressions |
| **Contribution** | **Moderate-strong** — proved separability: TP-PS-A4 baseline ownership pass + Failed verdict |

**Evidence:** Workbook ownership sections per pair; recommendation § Ownership Review. Design: ownership violation = failure regardless of pattern signals.

*Interpretation:* Ownership auditing was **necessary in principle** before 45-1; 45-1 **operationalised** it as a mandatory independent gate under pattern guidance.

---

### 5. Anti-mimicry controls

**What it is:** Corpus-relative comparison — Strong-reference proximity, weak-reference distance, mimicry suspect flag — to distinguish domain-appropriate instructional-function improvement from benchmark copying.

| Status | Assessment |
| ------ | ---------- |
| **Demonstrated** | Yes — recorded on all six pairs; mimicry suspect = no throughout |
| **Contribution** | **Moderate-strong** — design treated mimicry as process + outcome failure; 45-1 showed Strong-shape targeting does not automatically produce mimicry on this sample |

**Evidence:** Workbook corpus-comparison sections; recommendation § Anti-Mimicry Review. No automatic text-overlap scoring — reviewer judgement.

---

### 6. Boundary declarations

**What it is:** Explicit pre-committed §5.x interpretation when calibration is ambiguous — documented per evaluation without reopening Sprint 44 historical records.

| Status | Assessment |
| ------ | ---------- |
| **Demonstrated** | Yes — TP-PS-A6: Inter-Rater conjunctive §5.8 minimum declared in-pair; baseline Failed, treatment Strong; frozen M22 unchanged |
| **Contribution** | **Moderate** — single documented instance; proves feasibility, not standing policy |

**Evidence:** Recommendation § M22 Boundary Note; closure review § What 45-1 Demonstrated (7).

---

### 7. Intervention testing using patterns

**What it is:** Obligation-matched baseline/treatment paired design — frozen corpus baselines as anchors; pattern-guided treatment on identical DLA obligations; maintain-test + remediation slots; FM pre-specification per pattern.

| Status | Assessment |
| ------ | ---------- |
| **Demonstrated** | Yes — six pairs completed; Marx maintain (2) + Photosynthesis remediate (4) structure executed |
| **Contribution** | **Strong for design pattern** — first PRISM use of Pattern Library entries as intervention targets with paired delta |

**Evidence:** Design § Output set summary; pair register in workbook. Marx No Change did not predict Photosynthesis outcome — supports per-obligation pairing, not domain-level inference.

**Limit:** Single body per pair; no replication; injection mechanism open.

---

### 8. Ancillary methodological elements (supporting)

| Element | Demonstrated? | Contribution |
| ------- | ------------- | ------------ |
| **Explicit pair classifications** (Improvement / No Change / Regression / Inconclusive) | Yes | Moderate — prevented ambiguous aggregation |
| **FM channel separation** (FM-01/FM-12 capture vs instructional FMs) | Yes — all absent; channel exercised | Moderate — preserves Sprint 44 body vs composition rule under intervention |
| **Frozen baseline anchoring** | Yes — M12, M14, M19, M22 baselines byte-identical to corpus | Moderate — paired delta without relitigating historical scores |
| **Maintain-test + remediate dual design** | Yes | Moderate — detected degradation risk on Strong references while testing remediation |
| **Superficial-match flags** | Control present; no triggers in-sample | Weak-positive — control operationalised; no false-positive case observed |
| **Workbook evidence structure** | Yes — baseline → treatment → pair outcome | Moderate — traceable recommendation chain |

---

## Relationship To Sprint 44

| Sprint 44 method | What 45.1 added |
| ---------------- | --------------- |
| Single-body contract scoring | **Paired delta** on identical obligations |
| Corpus → pattern extraction | **Pattern → corpus improvement test** (reverse causal direction in experiment) |
| Inter-rater validation on frozen bodies | **Multi-layer evaluation** on generated/intervention bodies |
| FM documentation | **FM as paired delta metric** pre-specified per pattern |
| Body vs composition separation | **Preserved and exercised** under intervention (FM-01/FM-12 channel) |
| Boundary documentation (historical) | **Boundary declaration** (operational, per-evaluation) |
| Detection Signals in pattern entries | **Signals as secondary corroboration**, not primary success criterion |

Sprint 44 answered: *What shapes exist and can reviewers agree?*  
Sprint 45.1 added methodology for: *When patterns are applied as interventions, how do we judge whether improvement is real, ownership-safe, and non-mimetic?*

Sprint 44 methods remain **necessary**; 45.1 methods are **additional** for generation-intervention research. Neither replaces the other.

---

## Relationship To Pattern-Guided Generation

| Category | Examples | Status after 45.1 |
| -------- | -------- | ----------------- |
| **Generation findings** | SP-02/SP-03 improve weak Photosynthesis obligations; hold Marx Strong; clear FM-04/FM-02/FM-03 | Demonstrated in scope (six pairs) |
| **Methodological contributions** | Pattern-aware evaluation; convergent judgement; verdict-first ordering; ownership audit; anti-mimicry; boundary declarations; paired intervention design | Demonstrated as **operable once**; not standing |

**Distinction:** Generation findings state **what happened** when SP-02/SP-03 were applied on six slots. Methodological contributions state **how PRISM judged that it happened** and **what evaluative machinery is needed** when the research question is pattern-guided intervention.

The 45-1 recommendation gates further **generation** expansion on **evaluation** standing — evidence that the project itself treats methodology as a separable contribution with its own maturity curve ([`45-1-recommendation.md`](45-1-recommendation.md); [`FRONTIER-REVIEW-AFTER-SPRINT-45-1.md`](FRONTIER-REVIEW-AFTER-SPRINT-45-1.md)).

---

## What Another Researcher Could Reuse

Transferable ideas **demonstrated in 45-1** — not proven as universal protocol:

1. **Obligation-matched baseline/treatment pairing** with frozen corpus weak shapes as baselines — enables paired delta without rescoring historical materials.

2. **Maintain-test slots on Strong references** alongside remediation slots on weak shapes — tests degradation and improvement in one experiment.

3. **Verdict-first, signal-secondary layering** when patterns are intervention targets — prevents checklist-only false positives.

4. **Convergent evidence standard** for intervention success — verdict + FM + ownership + anti-mimicry before classifying Improvement.

5. **Independent ownership audit with regression override** — separable from contract verdict (TP-PS-A4 precedent).

6. **Corpus-relative anti-mimicry comparison** — Strong-reference proximity without verbatim-copy requirement.

7. **Pre-specified FM targets per pattern** — FM delta as convergent channel alongside verdict delta.

8. **Explicit boundary declaration for ambiguous bodies** — evaluate without reopening historical calibration (TP-PS-A6 precedent).

9. **Pair classification taxonomy** — Improvement / No Change / Regression / Inconclusive with defined verdict ordering.

10. **Discriminate substantive moves from cosmetic shape** — exemplar reasoning vs table shell; scaffolding vs slot presence — as reviewer judgements within convergent framework.

*Speculation:* These may transfer to other instructional AI quality research contexts where normative rubrics exist and reusable shapes are tested as interventions — not validated beyond PRISM 45-1.

---

## What Remains Unproven

| Limitation | Recorded fact |
| ---------- | ------------- |
| **Method repeatability** | Single evaluator session; no independent re-score |
| **Generalisability beyond six pairs** | Two patterns, two types, six slots, one run |
| **Standing protocol** | Method operated once; 45-2 chartered to test formalisation |
| **Multi-rater consistency** | Not measured |
| **Superficial-match control under false positive** | No in-sample trigger |
| **Boundary declaration as standing policy** | One instance (TP-PS-A6) |
| **Replication variance** | Single body per pair |
| **Production or automated application** | Injection mechanism open |
| **Transfer to SP-01, SP-04–SP-06** | Not tested |
| **Evaluation cost / utility trade-off** | Not measured |

Methodological contributions are **demonstrated as operable**, not **proven as reliable infrastructure**.

---

## Candidate Contribution Statement

> **Sprint 45.1 demonstrated that pattern-guided generation intervention on instructional material bodies requires a multi-layer evaluation method — verdict-first contract scoring supplemented by failure-mode tracking, independent ownership auditing, corpus-relative anti-mimicry comparison, secondary Detection Signal corroboration, and explicit boundary declarations where calibration is ambiguous — with convergent judgement across layers before classifying improvement, applied to obligation-matched baseline/treatment pairs anchored on a frozen benchmark corpus.**

This statement is **supported by evidence** from experiment design, workbook execution, recommendation, and closure review. It does not claim the method is formalised, repeatable, or generalisable beyond 45-1 scope.

---

## Conclusion

### Is Sprint 45.1's primary contribution generative, methodological, both, or neither?

**Both — with methodological contribution as the more durable generalisable output.**

### Justification (evidence only)

**Generative contribution — demonstrated in scope:**

- SP-02 and SP-03 pattern-guided treatment improved 44-2 verdicts on four Photosynthesis pairs, held Strong on two Marx pairs, reduced target FMs, preserved ownership, and cleared anti-mimicry checks ([`45-1-recommendation.md`](45-1-recommendation.md); [`SPRINT-45-1-CLOSURE-REVIEW.md`](SPRINT-45-1-CLOSURE-REVIEW.md)).

- This answers the experiment's primary research question positively within bounded scope.

**Methodological contribution — demonstrated as operable, named, and frontier-leading:**

- The evaluative stack that detected generative success was **not available from Sprint 44 alone** — paired design, convergent judgement, verdict-first ordering, independent ownership audit, anti-mimicry controls, and boundary declarations were exercised and recorded ([`pattern-aware-evaluation-position-paper.md`](pattern-aware-evaluation-position-paper.md); workbook).

- Post-45.1 frontier analysis ranks **evaluation repeatability** above further generation expansion ([`FRONTIER-REVIEW-AFTER-SPRINT-45-1.md`](FRONTIER-REVIEW-AFTER-SPRINT-45-1.md); [`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md)).

- 45-1 recommendation proceeds to 45-2 (pattern-aware evaluation), not to expanded injection — the project's own gate treats methodology as the binding next question.

- Contracts-and-patterns analysis concludes patterns are operationalisations measured by contracts; 45-1 **proved the measurement apparatus** for intervention research, not only the intervention outcome ([`CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md`](CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md)).

**Why methodological contribution is primary in durable terms:**

- Generative findings are **scoped** to SP-02, SP-03, six pairs, one run — valuable but not independently reusable without the method that established them.

- Methodological elements are what 45-2, the position paper, frontier review, and recommendation all carry forward — the **transferable research apparatus**.

- Generative success **depends on** the method; the method was **stress-tested by** generative success. Without convergent judgement, the four Photosynthesis improvements would be epistemically weaker claims.

**Neither alone:**

- 45-1 is not **only** methodological — generative findings were the experiment's purpose and were positive.

- 45-1 is not **only** generative — the evaluation machinery is explicitly the next research frontier and was not available pre-45.1.

*Interpretation:* Sprint 45.1's lasting contribution to PRISM research practice is likely the **demonstration that pattern-guided instructional quality intervention requires pattern-aware evaluation** — with generative findings as the first proof case, not the final deliverable.

---

## Traceability

| Section | Primary sources |
| ------- | --------------- |
| Background / findings | `45-1-pattern-injection-experiment-design.md`; `45-1-recommendation.md`; `SPRINT-45-1-CLOSURE-REVIEW.md` |
| Methodological problem | `sprint-44-review.md` § Remaining Uncertainties; `pattern-aware-evaluation-position-paper.md` § The Problem |
| Contributions assessed | `45-1-evidence-workbook.md`; design § Evaluation Method, § Failure Criteria; closure § Lessons |
| Sprint 44 relationship | `sprint-44-outcomes.md` Evidence Chain; `CONTRACTS-AND-PATTERNS-RELATIONSHIP-ANALYSIS.md` |
| Reuse / limits | `SPRINT-45-2-CHARTER.md`; `LESSONS-FROM-SP-02-AND-SP-03.md` |
| Conclusion | `FRONTIER-REVIEW-AFTER-SPRINT-45-1.md`; `45-1-recommendation.md` |
