# Evidence Standards Analysis

**Date:** 2026-06-18  
**Type:** Analytical document — not a protocol, scoring guide, or implementation design  
**Purpose:** Determine what evidence standard Sprint 45.1 actually used when classifying intervention outcomes  
**Authority:** [EVALUATION-STACK-ANALYSIS.md](EVALUATION-STACK-ANALYSIS.md) · [pattern-aware-evaluation-position-paper.md](pattern-aware-evaluation-position-paper.md) · [METHODOLOGICAL-CONTRIBUTIONS-OF-SPRINT-45-1.md](METHODOLOGICAL-CONTRIBUTIONS-OF-SPRINT-45-1.md) · [45-1-evidence-workbook.md](45-1-evidence-workbook.md) · [45-1-recommendation.md](45-1-recommendation.md) · [45-1-experiment-execution-plan.md](45-1-experiment-execution-plan.md) · [SPRINT-45-2-CHARTER.md](SPRINT-45-2-CHARTER.md)

**Non-goals:** Protocol design · implementation · contract redesign · Pattern Library redesign

---

## Background

Sprint 45.1 classified six obligation-matched pairs as **Improvement** (4), **No Change** (2), **Regression** (0), or **Inconclusive** (0). The experiment recommendation proceeded to 45-2 on the basis that convergent evidence supported those classifications.

Evidence standards became important because Sprint 45.1 was not asking *what quality tier does this body occupy?* (Sprint 44 question) but *did pattern-guided intervention improve this body on an identical obligation, and can that claim be trusted?* That trust question required more than a verdict delta. The design pre-specified success, failure, and inconclusive conditions across multiple evidence sources; the workbook recorded how each source was applied per pair.

This document reverse-engineers the **actual evidence standard** from design authority, execution plan classification rules, and recorded workbook outcomes — distinguishing what was **necessary**, **corroborative**, and **disqualifying** in practice.

---

## The Problem

### Why a verdict change alone is insufficient

Sprint 45.1 design and workbook evidence establish that contract verdict delta is **primary but not sufficient** for intervention-trust claims.

| Reason | 45-1 evidence |
| ------ | ------------- |
| **Structure ≠ strong realisation** | DT-PS-A4/A6 baselines: valid tables, Minimum verdict, FM-04 present — structure without exemplar reasoning |
| **Slot presence ≠ transfer success** | TP-PS-A4 baseline: transfer slot occupied, Failed verdict, FM-02/FM-03 present |
| **Ownership separable from instruction** | TP-PS-A4 baseline: ownership pass, Failed verdict |
| **Pattern shape ≠ contract satisfaction** | Design failure: "Pattern signals present but verdict unchanged or worse = superficial pattern match" |
| **Strong reference proximity ≠ valid improvement** | Anti-mimicry required — mimicry suspect would fail regardless of verdict |
| **Verdict alone does not attest mimicry or ownership** | All six Improvements also recorded ownership pass, anti-mimicry no, target FM absent |

*Interpretation:* Verdict change is the **necessary primary condition** for Improvement classification. Alone it would not have met the pre-specified per-output success or convergent evidence standard.

---

## Evidence Sources Used In 45.1

All six sources were recorded in the workbook for each body or pair as applicable.

| Source | What it recorded | Primary / secondary role |
| ------ | ---------------- | ------------------------ |
| **Contract verdict** | Failed / Minimum / Strong per §5.6 or §5.8; justification citing contract bullets | **Primary** — drove pair classification ordering |
| **Detection Signals** | SP-02/SP-03 minimum, strong, failed signal checklists; signal profile; superficial-match flag | **Secondary** — corroboration; superficial-match guard |
| **Failure Modes** | FM-04 (`decision_table`); FM-02, FM-03 (`transfer_prompt`); FM-01/FM-12 under capture channel | **Diagnostic / convergent** — paired delta; target FM absent required for Improvement |
| **Ownership audit** | Learner loci checks; overall pass/fail; ownership regression yes/no | **Gating** — regression overrides regardless of verdict |
| **Anti-mimicry** | Strong-reference proximity; weak-reference distance; mimicry suspect; corpus summary | **Gating / validity** — mimicry suspect = failure |
| **Boundary declaration** | Explicit §5.x interpretation where calibration ambiguous (TP-PS-A6) | **Precondition** — enables verdict application without global calibration reopening |

**Evaluation surface:** GAM body text only (workbook instruction). Paired comparison on identical DLA obligations.

---

## Classification Standards

Analysis of evidence required per classification per design ([`45-1-experiment-execution-plan.md`](45-1-experiment-execution-plan.md) § Result Classification) and recorded application ([`45-1-evidence-workbook.md`](45-1-evidence-workbook.md)).

### Improvement

**Definition (design):** Treatment verdict **strictly higher** than baseline on same obligation; target FM **absent** in treatment; ownership **preserved** (no regression, overall pass).

**Verdict ordering:** Failed < Minimum < Strong.

| Required for Improvement (design + practice) | Recorded on all four Improvement pairs |
| -------------------------------------------- | ---------------------------------------- |
| Verdict rise (Failed/Minimum → Strong) | Yes — DT-PS-A4, DT-PS-A6, TP-PS-A4, TP-PS-A6 |
| Target FM absent in treatment | Yes — FM-04 absent (DT-PS); FM-02/FM-03 absent (TP-PS) |
| Ownership pass; no regression | Yes — all four |
| Per-output success met | Yes — all four workbook flags |

**Also recorded on Improvements (convergent, not sole classifiers):**

- Strong Detection Signal profile on treatment (all four).
- Anti-mimicry suspect = no (all four).
- Workbook justification distinguishing substantive move from cosmetic shape (all four).
- FM clearance event where FM present in baseline (DT-PS-A4/A6 FM-04; TP-PS-A4 FM-02/FM-03; TP-PS-A6 FM-03).

**Explicitly not Improvement alone:**

- Detection Signals without verdict rise (design).
- FM cleared but verdict unchanged → **No Change** (design).

**Special case not used in 45-1:** Strong → Strong classified Improvement only if FM cleared from baseline or meaningful strong-bar reinforcement documented; otherwise **No Change**. Marx pairs used No Change instead.

### No Change

**Definition (design):** Treatment verdict **equals** baseline; or Strong maintained on already-Strong obligation without FM clearance event; ownership preserved.

| Situation | 45-1 instance |
| --------- | ------------- |
| Strong → Strong (Marx maintain-test) | DT-MRX-A4, TP-MRX-A4 |
| FM absent at baseline and treatment | Both Marx pairs — no FM clearance event |
| Per-output success still met on treatment | Strong maintained + target FM absent + ownership pass |

**Evidence recorded on No Change pairs:**

- Verdict delta Strong → Strong.
- FM unchanged favourable (absent both conditions).
- Ownership pass both conditions.
- Strong signals on both baseline and treatment.
- Anti-mimicry no.
- Explicit note: expected for maintain-test; do not generalise to Photosynthesis.

**Not required for No Change:** Verdict improvement; FM clearance; anti-mimicry concern (none recorded).

### Regression

**Definition (design):** Any of: verdict strictly lower; ownership regression; treatment ownership fail; benchmark mimicry confirmed; superficial match with worse verdict.

| Condition | 45-1 instances |
| --------- | -------------- |
| Any regression trigger | **0 pairs** |

**Would classify Regression if observed (design — not triggered):**

- Minimum → Failed; Strong → Minimum; etc.
- Ownership regression regardless of verdict.
- Mimicry suspect = yes with domain-inappropriate copy.
- Superficial pattern match + verdict worse.

### Inconclusive

**Definition (design):** Pair cannot be classified without disputed interpretation; or missing body, FM-01 stub without re-collection, undeterminable ownership.

| Situation | 45-1 handling |
| --------- | ------------- |
| TP-PS-A6 M22 ambiguity | **Not inconclusive in outcome** — boundary declaration applied; classified **Improvement** under declared conjunctive §5.8 reading |
| Other inconclusive triggers | **Not triggered** |

**Design allowed inconclusive for TP-PS-A6** if interpretation disputed without declaration. Practice: declaration enabled classifiable Improvement.

---

## Convergent Evidence

### What 45-1 required before accepting an improvement claim

**Per-output minimum (design § Success Criteria):**

```text
Verdict improvement (or Strong maintained on maintain-test)
AND target FM absent in treatment
AND ownership preserved
```

**Strong per-output (design):** Above + Strong verdict + full Strong Detection Signal set on treatment.

**Meaningful / convergent result (design § Evidence Standard):**

```text
Detection Signals present (secondary)
AND contract verdict improvement (or Strong maintained where applicable)
AND FM reduction on targeted outputs (where applicable)
AND learner ownership preserved
AND corpus-relative comparison — toward Strong feature set, not benchmark reproduction
```

**Experiment-level Gate 3 (recommendation):** Convergent evidence on all four Photosynthesis pairs (4/4) — verdict improvement + FM clearance + ownership + anti-mimicry + secondary signals.

### What actually happened on Improvements

All four Improvements met:

1. Verdict rise (primary).
2. Target FM absent in treatment (necessary convergent).
3. Ownership pass, no regression (gating).
4. Strong signals on treatment (corroborative — present on all four).
5. Mimicry suspect = no (gating — present on all four).
6. Substantive-move justification in workbook (interpretive corroboration — recorded on all four).

**No Improvement was classified on fewer layers.** No pair improved on signals without verdict rise.

---

## Necessary Evidence

Evidence that **appears necessary** for Improvement classification in 45-1 — absent any one, Improvement would not have been recorded under design rules.

| Evidence | Necessity basis |
| -------- | --------------- |
| **Verdict strictly higher than baseline** | Execution plan Improvement definition; all four Improvements show Failed/Minimum → Strong |
| **Target FM absent in treatment** | Per-output success criterion; all four treatments cleared target FMs |
| **Ownership pass on treatment** | Per-output success; regression = Regression regardless of verdict |
| **No ownership regression** | Design override; zero regressions recorded |
| **Paired obligation match** | Design structure; all pairs same DLA obligation |

*Interpretation:* Layers 1 (verdict rise) + 3 (target FM absent) + 4 (ownership pass, no regression) form the **necessary core** for Improvement.

---

## Corroborative Evidence

Evidence **supportive but not decisive** — recorded on Improvements; design states insufficient alone.

| Evidence | Role in 45-1 |
| -------- | ------------ |
| **Strong Detection Signal profile on treatment** | Present on all six treatments including No Change pairs — corroborates but does not classify alone |
| **Signal profile shift baseline → treatment** | e.g. Minimum-only → Strong on DT-PS; Failed → Strong on TP-PS-A4 |
| **FM clearance when FM present in baseline** | Corroborates verdict rise; would not alone cause Improvement if verdict unchanged |
| **Workbook substantive-move notes** | Discriminates exemplar reasoning vs shell; scaffolding vs slot — interpretive corroboration |
| **Strong-reference proximity** | Corpus comparison field — supports anti-mimicry, not verdict tier |
| **Per-output success = met** | Derived flag aggregating necessary conditions |

**Demonstrated:** TP-MRX-A4 and DT-MRX-A4 have Strong signals + Strong verdict + No Change — signals do not imply Improvement without verdict rise.

---

## Disqualifying Evidence

Evidence that **would invalidate** an Improvement claim under 45-1 design — defined in failure criteria; none triggered in practice.

| Disqualifier | Design rule | Observed in 45-1 |
| ------------ | ----------- | ---------------- |
| **Verdict regression** | Treatment verdict lower than baseline | 0 pairs |
| **Target FM present in treatment** | FM-04 / FM-02 / FM-03 present | 0 treatment bodies |
| **Ownership regression** | Treatment fills loci baseline left empty | 0 pairs |
| **Treatment ownership fail** | Overall ownership fail | 0 treatments |
| **Superficial pattern match** | Signals met, verdict not improved | 0 flags (`superficial_match = yes`) |
| **Mimicry suspect** | Domain-inappropriate M13/M16 copy | 0 pairs |
| **Failed treatment where baseline was Minimum+** | Per-output failure | 0 treatments (all treatments Strong) |

**Hard gate principle:** Ownership regression or mimicry confirmed would disqualify **regardless of verdict or signals** (design).

---

## Evidence Conflicts

How conflicts were specified and handled.

### Strong signals but weak verdict

| Design rule | 45-1 observation |
| ----------- | ---------------- |
| Signals without verdict improvement = superficial match failure (if pattern-shaped) or insufficient for Improvement | Not observed on treatments — all treatments Strong verdict + Strong signals |
| Baselines can have partial signals without Strong verdict | BL-TP-PS-A4: some minimum-adjacent signals + Failed |

**Resolution principle:** Verdict governs; signals diagnose.

### Strong verdict but ownership regression

| Design rule | 45-1 observation |
| ----------- | ---------------- |
| Regression **regardless of verdict** | Not observed — 0 regressions |

**Resolution principle:** Layer 4 vetoes Improvement.

### Strong verdict but mimicry concern

| Design rule | 45-1 observation |
| ----------- | ---------------- |
| Mimicry = process + outcome failure | mimicry suspect = no on all pairs |

**Resolution principle:** Layer 5 vetoes trust in improvement.

### Boundary ambiguity

| Design rule | 45-1 observation |
| ----------- | ---------------- |
| TP-PS-A6 could be **Inconclusive** if interpretation disputed | **Boundary declaration** applied: Inter-Rater conjunctive §5.8 minimum |
| Do not resolve M22 globally | Frozen M22 unchanged; in-pair only |

**Resolution principle:** Layer 6 preconditions Layer 1 — declaration enables Failed baseline → Strong treatment Improvement rather than Inconclusive.

### FM cleared but verdict unchanged

| Design rule | 45-1 observation |
| ----------- | ---------------- |
| **No Change** — note FM delta | Marx pairs: FM absent both conditions — no clearance event |

**Resolution principle:** Verdict delta drives pair classification; FM delta supplementary.

### Signals and verdict both Strong on No Change pair

| Observation | Resolution |
| ----------- | ---------- |
| DT-MRX-A4, TP-MRX-A4: Strong → Strong, Strong signals both | **No Change** — no verdict rise; maintain-test expected |

**Resolution principle:** Improvement requires verdict **rise** (except unused Strong→Strong + FM clearance special case).

---

## Lessons From Completed Pairs

Evidence applied per pair — recorded workbook outcomes only.

### DT-MRX-A4 — **No Change**

| Evidence | Baseline | Treatment |
| -------- | -------- | --------- |
| Verdict | Strong | Strong |
| FM-04 | Absent | Absent |
| Ownership | Pass | Pass; no regression |
| Signals | Strong profile | Strong profile |
| Mimicry | — | No |
| **Classification driver** | Strong → Strong; no FM clearance event; maintain-test |

### DT-PS-A4 — **Improvement**

| Evidence | Baseline | Treatment |
| -------- | -------- | --------- |
| Verdict | Minimum | Strong |
| FM-04 | Present | Absent |
| Ownership | Pass | Pass; no regression |
| Signals | Minimum-only | Strong |
| Mimicry | — | No |
| **Classification driver** | Minimum → Strong + FM-04 cleared + ownership + non-superficial exemplar reasoning |

### DT-PS-A6 — **Improvement**

| Evidence | Baseline | Treatment |
| -------- | -------- | --------- |
| Verdict | Minimum | Strong |
| FM-04 | Present | Absent |
| Ownership | Pass | Pass; no regression |
| Signals | Minimum-only | Strong |
| Mimicry | — | No |
| **Classification driver** | Minimum → Strong + FM-04 cleared; partial-exemplar reasoning vs shell |

### TP-MRX-A4 — **No Change**

| Evidence | Baseline | Treatment |
| -------- | -------- | --------- |
| Verdict | Strong | Strong |
| FM-02/FM-03 | Absent | Absent |
| Ownership | Pass | Pass; no regression |
| Signals | Strong profile | Strong profile |
| Mimicry | — | No |
| **Classification driver** | Strong → Strong; Marx maintain-test |

### TP-PS-A4 — **Improvement**

| Evidence | Baseline | Treatment |
| -------- | -------- | --------- |
| Verdict | Failed | Strong |
| FM-02/FM-03 | Present / Present | Absent / Absent |
| Ownership | Pass | Pass; no regression |
| Signals | Failed profile | Strong |
| Mimicry | — | No |
| **Classification driver** | Failed → Strong + both FMs cleared; scaffolding vs slot (baseline had slot + Failed) |

### TP-PS-A6 — **Improvement**

| Evidence | Baseline | Treatment |
| -------- | -------- | --------- |
| Verdict | Failed *(declared conjunctive §5.8)* | Strong |
| FM-02/FM-03 | Absent / Present | Absent / Absent |
| Ownership | Pass | Pass; no regression |
| Signals | — | Strong |
| Mimicry | — | No |
| Boundary | M22 flag yes; declaration recorded | — |
| **Classification driver** | Failed → Strong under declared interpretation + FM-03 cleared; boundary documented not resolved globally |

**Cross-pair lesson:** Marx No Change did not predict Photosynthesis Improvement — each pair classified on its own evidence stack.

---

## Strongest Supported Evidence Standard

The best **evidence-supported** interpretation of the 45-1 standard:

> **An intervention Improvement claim requires a strict paired verdict rise on an identical DLA obligation, with target failure modes absent in the treatment body and ownership preserved without regression. Detection Signals, anti-mimicry clearance, and substantive-move discrimination corroborate the claim but do not substitute for the verdict rise. Ownership failure or mimicry suspicion disqualifies the claim regardless of verdict. Where contract calibration is ambiguous, an explicit boundary declaration must govern verdict application before pair classification. No Change applies when verdict is unchanged on maintain-test obligations, even when Strong signals and Strong verdict persist on both sides.**

**Convergent evidence standard (experiment level):** All four Photosynthesis Improvements additionally met anti-mimicry clearance and secondary Strong signals — Gate 3 satisfied at 4/4.

**Not part of the demonstrated necessary minimum for single-pair Improvement:** Anti-mimicry and Strong signals were **always present** on Improvements in 45-1 but design treats signals-without-verdict-rise as failure; mimicry as disqualifier was **not stress-tested** with a positive mimicry case.

---

## Implications For 45.2

Aspects of the evidence standard requiring **repeatability testing** — conceptual only ([`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md)).

| Aspect | Why repeatability matters |
| ------ | ------------------------- |
| **Necessary core** (verdict rise + FM absent + ownership) | Do independent reviewers apply same necessary conditions? |
| **Verdict ordering** | Failed < Minimum < Strong — compatible classifications on same bodies? |
| **Corroborative layers** | Do signals anti-mimicry add consistent confidence without drift to primary? |
| **Disqualifiers** | Are ownership regression and mimicry operationalisable beyond 45-1 session? |
| **Superficial-match discrimination** | No false positive in-sample — can protocol detect cosmetic shape on new bodies? |
| **Boundary declaration** | Does TP-PS-A6 precedent generalise without becoming Inconclusive? |
| **Convergent threshold** | Is 4/4 Photosynthesis convergence replicable? |
| **Re-scoring 45-1 bodies** | Do twelve bodies reproduce same six classifications under protocol? |
| **Conflict resolution rules** | Verdict governs; ownership/mimicry veto — stable under multi-rater use? |

**45-2 does not need to prove** that 45-1 Improvements were wrong — it needs to test whether this evidence standard can be **specified and reapplied** reliably.

---

## Conclusion

### The evidence standard that emerged from Sprint 45.1

Sprint 45.1 used a **convergent, verdict-first, paired evidence standard** for intervention outcome classification:

| Element | Standard |
| ------- | -------- |
| **Primary** | Paired 44-2 contract verdict delta (Failed < Minimum < Strong) |
| **Necessary convergent** | Target FM absent in treatment; ownership pass without regression |
| **Corroborative** | Detection Signals (secondary); FM clearance event; substantive-move notes |
| **Gating / disqualifying** | Ownership regression; mimicry suspect; superficial match without verdict rise |
| **Preconditional** | Boundary declaration when calibration ambiguous |
| **Improvement** | Verdict rise + necessary convergent + gates clear |
| **No Change** | No verdict rise (including Strong → Strong maintain-test) |
| **Regression** | Verdict fall, ownership fail/regression, or mimicry (none observed) |
| **Inconclusive** | Disputed interpretation without declaration (designed for TP-PS-A6; avoided via declaration) |

**Demonstrated:** Standard was **applied consistently** across six pairs with zero Regression and zero Inconclusive outcomes; four Improvements met full convergent bar; experiment-level success criteria met.

**Not demonstrated:** Standard is **repeatable** across raters, runs, or bodies beyond the twelve 45-1 artefacts; disqualifying paths were **designed but not observed** in-sample.

*One-line summary:* 45-1 treated **verdict rise as necessary and authoritative**, **FM absence and ownership as necessary convergent gates**, **signals and anti-mimicry as corroborative or vetoing**, and **boundary declaration as enabling** — requiring alignment before an Improvement claim stood.

---

## Traceability

| Section | Primary sources |
| ------- | --------------- |
| Classification standards | `45-1-experiment-execution-plan.md` § Result Classification |
| Convergent evidence | `45-1-pattern-injection-experiment-design.md` § Evidence Standard, § Success Criteria |
| Pair evidence | `45-1-evidence-workbook.md` pair outcome sections |
| Aggregate outcomes | `45-1-recommendation.md` |
| Stack roles | `EVALUATION-STACK-ANALYSIS.md` |
| 45-2 repeatability | `SPRINT-45-2-CHARTER.md` § Success/Failure Conditions |
