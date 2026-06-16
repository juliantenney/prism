# Evaluation Stack Analysis

**Date:** 2026-06-18  
**Type:** Conceptual analysis — not a protocol, checklist, or implementation design  
**Purpose:** Analyse the evaluation stack that emerged from Sprint 45.1 and clarify the role of each layer  
**Authority:** [pattern-aware-evaluation-position-paper.md](pattern-aware-evaluation-position-paper.md) · [METHODOLOGICAL-CONTRIBUTIONS-OF-SPRINT-45-1.md](METHODOLOGICAL-CONTRIBUTIONS-OF-SPRINT-45-1.md) · [PRISM-RESEARCH-ASSET-INVENTORY.md](PRISM-RESEARCH-ASSET-INVENTORY.md) · [45-1-recommendation.md](45-1-recommendation.md) · [45-1-evidence-workbook.md](45-1-evidence-workbook.md) · [SPRINT-45-2-CHARTER.md](SPRINT-45-2-CHARTER.md)

**Non-goals:** Implementation · protocol design · contract redesign · Pattern Library redesign

---

## Background

Sprint 44 established **single-layer contract evaluation** as sufficient for its research task: characterising instructional quality shapes on a frozen benchmark corpus. Reviewers scored GAM bodies against 44-2 contracts (Failed / Minimum / Strong), documented failure modes, and extracted patterns from contrast exemplars.

Sprint 45.1 changed the research question. The Pattern Injection Experiment asked whether deliberate pattern guidance could **improve** bodies on identical DLA obligations — a paired intervention claim, not a corpus description. That shift exposed gaps contract scoring alone does not close:

- Valid structure can score Minimum or Failed while lacking instructional function (DT-PS baselines: table shell + FM-04; TP-PS-A4: transfer slot + Failed).
- A body can pass ownership while failing instructionally (TP-PS-A4 baseline: ownership pass, Failed verdict).
- Pattern-shaped output can approach Strong-reference features without being domain-appropriate improvement (anti-mimicry risk).
- Ambiguous bodies require explicit calibration choice before scoring (TP-PS-A6: M22 boundary).
- No single evidence channel was sufficient to classify pair outcomes — 45-1 success required convergent evidence across layers.

The **evaluation stack** is the multi-layer structure that emerged when 45-1 operationalised these requirements. It is named *pattern-aware evaluation* in the position paper. It was exercised once in the 45-1 workbook; it is not yet a standing protocol.

---

## The Stack

Seven conceptual layers, in dependency order:

| # | Layer | One-line role |
| - | ----- | ------------- |
| **1** | 44-2 contract verdict | Primary normative judgement of instructional realisation tier |
| **2** | Detection Signals | Secondary corroboration of pattern shape presence |
| **3** | Failure Mode analysis | Diagnostic naming of instructional weakness; paired delta tracking |
| **4** | Ownership audit | Independent constraint — scaffold ≠ deliverable |
| **5** | Anti-mimicry analysis | Validity check — instructional function vs benchmark copying |
| **6** | Boundary declaration | Calibration choice when contract application is ambiguous |
| **7** | Convergent judgement | Synthesis — classification of pattern-aware evaluation outcome |

**Evaluation surface:** GAM body text (instructional layer). FM-01/FM-12 scored under capture channel, not conflated with instructional FMs (workbook instruction).

**In paired experiments (45-1):** Layers 1–6 apply per body; Layer 7 synthesises baseline/treatment comparison into pair classification (Improvement / No Change / Regression / Inconclusive).

---

## Layer 1: 44-2 Contract Verdict

### Role

Primary **normative** judgement: does this body meet Failed, Minimum, or Strong realisation for its material type under the authoritative §5.x contract?

### Authority

- Closed Sprint 44-2 contracts govern.
- Justification must cite contract bullets — **not pattern names alone** (workbook instruction).
- When layers conflict in principle, **contract verdict governs** (position paper; 45-2 charter failure condition if systematic divergence is unresolvable).

### Strengths (demonstrated)

| Evidence | Source |
| -------- | ------ |
| Discriminates on frozen corpus across 25+ materials | Sprint 44 |
| Drove all six 45-1 pair classifications | Verdict deltas: 4 Improvements, 2 No Change |
| Tracks remediation on paired obligations | Minimum/Failed → Strong on Photosynthesis pairs |
| Distinguishes tier without pattern checklist | M12/M19 Minimum without Strong signals |

### Limitations

- Captures **outcome tier**, not **causal attribution** of improvement.
- Does not alone discriminate cosmetic from substantive instructional moves (DT-PS: valid structure + Minimum).
- Does not attest ownership preservation or non-mimicry independently.
- Calibration ambiguity on some bodies (M22) requires Layer 6 before verdict is interpretable in research context.

*Interpretation:* Layer 1 is necessary and authoritative; it is not sufficient for intervention-trust claims.

---

## Layer 2: Detection Signals

### Role

**Corroborative** observational layer — do pattern Detection Signal checklists (from SP-02, SP-03 entries) indicate minimum, strong, or failed pattern shape?

### Evidential value

- Secondary to contract verdict; confirms **how** improvement manifests or diagnoses weakness shape.
- Supports superficial-match discrimination when signals and verdict diverge (design failure criterion; not triggered in-sample).

### Strengths (demonstrated)

| Evidence | Source |
| -------- | ------ |
| All six treatments: Strong signal profile + Strong verdict | Workbook |
| Baselines: signal profiles matched verdict tier | BL-TP-PS-A4 Failed profile; BL-DT-PS Minimum-only |
| Superficial-match flag operational on treatments | All `no` on scored pairs |

### Limitations

- **Must not override** Layer 1 — no pair improved on signals without verdict rise.
- Strong signals on treatment do not alone constitute experiment success (design: "pattern signals without contract improvement = superficial match — failure").
- Minimum realisation can satisfy contract without Strong signal profile.
- Not observed: Strong signals with Failed/Minimum verdict on treatments — a 45-2 failure risk if systematic.

*Interpretation:* Layer 2 answers a different question than Layer 1: *Does the body exhibit features associated with a named pattern shape?*

---

## Layer 3: Failure Mode Analysis

### Role

**Diagnostic** layer — which named instructional failure modes (FM-02–FM-11) or capture artefacts (FM-01, FM-12) are present?

### Diagnostic value

- Names **why** a body is weak (FM-04: shell without exemplar; FM-02: thin body; FM-03: third-person transfer).
- Supplies **paired delta** metric in intervention research — FM present in baseline → absent in treatment.
- Separates instructional FMs from capture channel (workbook: do not conflate FM-01/FM-12 with instructional scoring).

### Strengths (demonstrated)

| Evidence | Source |
| -------- | ------ |
| FM-04 cleared when DT-PS pairs improved | 2→0 aggregate |
| FM-02, FM-03 cleared when TP-PS-A4 improved | Both present baseline → absent treatment |
| FM-03 cleared on TP-PS-A6 under declared interpretation | FM-02 absent both conditions |
| FM present + Minimum/Failed coherent | M12 shape on DT-PS baselines |

### Limitations

- FM presence informs diagnosis; **verdict tier states overall realisation** — Layer 1 governs classification.
- Only FM-04, FM-02, FM-03 tested under intervention in 45-1.
- FM channel separation exercised but FM-01/FM-12 absent on all bodies — capture stress not tested.

---

## Layer 4: Ownership Audit

### Role

**Gating** layer — independent constraint on whether author scaffolding preserves learner-assigned output loci (MP-1 / scaffold ≠ deliverable).

### Gatekeeping value

- **Regression override:** ownership violation fails treatment **regardless of verdict or signals** (design failure criterion).
- Separates ownership from instructional quality — body can pass ownership and fail contract (TP-PS-A4 baseline).

### Strengths (demonstrated)

| Evidence | Source |
| -------- | ------ |
| Zero ownership regressions across six treatments | Recommendation |
| DT treatments: judgement loci empty; exemplar reasoning in evidence/reason cells only | Workbook |
| TP treatments: no pre-written learner transfer responses | Workbook |
| TP-PS-A4 baseline: ownership pass + Failed verdict | Workbook |

### Limitations

- Exercised on six bodies; consistency across raters unproven.
- Audit criteria draw on contract cross-cutting principles and pattern guards — not a separate verdict tier.
- 45-2 charter: failure if not operationalisable as standing procedure.

*Interpretation:* Layer 4 is a **hard gate** on treatment success, not a gradated score.

---

## Layer 5: Anti-Mimicry Analysis

### Role

**Gating / validity** layer — corpus-relative comparison assessing whether improvement is domain-appropriate instructional function or benchmark copying.

### Validity value

- Strong-reference proximity, weak-reference distance, mimicry suspect flag.
- Distinguishes approaching M13/M16 **feature set** from **verbatim or cross-domain transplant**.
- Design: mimicry = process + outcome failure.

### Strengths (demonstrated)

| Evidence | Source |
| -------- | ------ |
| Mimicry suspect = no on all six pairs | Recommendation |
| Photosynthesis treatments domain-specific; not M13/M16 prose transplant | Workbook corpus comparison |
| Marx treatments: lexical variation from frozen references | TP-MRX-A4, DT-MRX-A4 notes |

### Limitations

- Reviewer judgement — not automatic text-overlap scoring.
- No mimicry-positive case in-sample — control not stress-tested under failure.
- Does not replace contract verdict; attests **validity** of improvement, not tier.

---

## Layer 6: Boundary Declaration

### Role

**Interpretive** layer — documents which contract interpretation governs when calibration is ambiguous, **without reopening** Sprint 44 historical records.

### Calibration value

- Makes verdict application explicit where inter-rater splits exist (M22: Pass 2 Minimum / Inter-Rater Failed).
- Enables scored evaluation to proceed without global calibration resolution.

### Strengths (demonstrated)

| Evidence | Source |
| -------- | ------ |
| TP-PS-A6: Inter-Rater conjunctive §5.8 minimum declared in-pair | Recommendation M22 note |
| Baseline Failed, treatment Strong under declaration; frozen M22 unchanged | Workbook |
| Design: M22 ambiguity documented, not resolved by experiment | Experiment design |

### Limitations

- **Single documented instance** in 45-1.
- Declaration does not eliminate ambiguity globally — governs one evaluation only.
- Must be declared **before** verdict drives pair classification on ambiguous bodies — ordering not fully generalised beyond TP-PS-A6 precedent.

---

## Layer 7: Convergent Judgement

### Role

**Synthesis** layer — integrates Layers 1–6 (and paired delta where applicable) into a pattern-aware evaluation outcome.

### Synthesis function

In 45-1 paired experiments:

- **Per-output success (treatment):** verdict improvement or Strong maintained + target FM absent + ownership preserved (+ Strong signals secondary).
- **Pair classification:** Improvement / No Change / Regression / Inconclusive from baseline → treatment verdict ordering.
- **Experiment success:** convergent evidence across Photosynthesis remediation pairs; no systematic ownership regression; anti-mimicry clearance.

### Strengths (demonstrated)

| Evidence | Source |
| -------- | ------ |
| All four Photosynthesis Improvements met convergent standard | Recommendation: 4/4 |
| No superficial-match failures | Design criterion not triggered |
| Marx No Change classified without masking remediation | Per-output vs experiment-level criteria separated |
| Zero experiment-level failure criteria triggered | Recommendation |

### Limitations

- Convergence thresholds were design-specified for 45-1 scope — not validated as general rule.
- No Inconclusive or Regression cases in-sample — synthesis under negative outcomes untested.
- Single evaluator session — convergent judgement reproducibility unproven.

---

## Layer Relationships

| Layer | Primary character | Relationship to Layer 1 |
| ----- | ----------------- | ------------------------- |
| **1 — Contract verdict** | **Normative** | Authority — governs on conflict |
| **2 — Detection Signals** | **Corroborative** | Subordinate — confirms or diagnoses shape |
| **3 — Failure Mode analysis** | **Diagnostic** | Complementary — explains weakness; delta channel |
| **4 — Ownership audit** | **Gating** | Independent — can veto success regardless of L1/L2 |
| **5 — Anti-mimicry** | **Gating** | Independent validity — can veto success regardless of L1/L2 |
| **6 — Boundary declaration** | **Interpretive** | Precondition for L1 on ambiguous bodies |
| **7 — Convergent judgement** | **Synthesising** | Integrates all layers into outcome |

### Dependency flow

```text
Surface: GAM body text
    → L1 Verdict (normative)
    → L2 Signals ∥ L3 FMs ∥ L4 Ownership  (parallel corroboration / diagnosis / gating)
    → L5 Anti-mimicry (validity)
    → L6 Boundary declaration (when needed, may precede L1 on ambiguous bodies)
    → L7 Convergent judgement (synthesis)
```

*Interpretation:* Layers 2–5 surround Layer 1; they do not replace it. Layers 4 and 5 can **veto** a would-be success. Layer 6 **conditions** Layer 1 where calibration splits exist. Layer 7 **requires alignment** across layers for intervention success classification.

---

## Failure Of A Layer

What happens when a layer fails or conflicts — from 45-1 design criteria and observed evidence.

| Layer | Failure / conflict | Effect on evaluation |
| ----- | ------------------ | -------------------- |
| **L1 — Verdict** | Treatment regresses vs baseline | Pair → **Regression**; experiment failure |
| **L1 vs L2** | Strong signals, no verdict improvement | **Superficial pattern match** — design failure; signals must not override |
| **L1 vs L2** | Verdict Strong, weak/missing signals | Verdict governs; corroboration weak — confidence reduced (*not observed on 45-1 treatments*) |
| **L3 — FM** | Target FM present in treatment | Per-output failure; blocks Improvement |
| **L3 vs L1** | FM absent but verdict still Failed/Minimum | Verdict governs tier; FM aids diagnosis — convergent success not met |
| **L4 — Ownership** | Regression (pre-filled judgement, pre-written transfer) | **Failure regardless of L1/L2** — hard gate |
| **L4 vs L1** | Ownership pass, Failed verdict | Instructional fail, ownership pass — layers separable (TP-PS-A4 baseline) |
| **L5 — Anti-mimicry** | Mimicry suspect = yes | Process + outcome failure |
| **L5 vs L1** | Strong verdict but mimetic copy | Validity failure — improvement not trusted |
| **L6 — Boundary** | Ambiguous body, no declaration | Verdict unstable; pair may be **Inconclusive** (design) |
| **L6 vs L1** | Different declarations → different verdicts | Documented per evaluation; global calibration unchanged |
| **L7 — Convergence** | Layers disagree without resolution rule | Evaluation outcome indeterminate — 45-2 failure risk |

**Observed in 45-1:** L4/L5 separability (TP-PS-A4 ownership pass + Failed); L6 enabling TP-PS-A6 scoring; L1+L3+L4+L5 convergence on all Improvements. **Not observed:** L2 overriding L1; mimicry positive; ownership regression; superficial-match trigger.

---

## Lessons From Sprint 45.1

Recorded evidence only.

1. **Verdict-first ordering was operable** — all pair outcomes followed Layer 1; Layer 2 did not drive classifications.

2. **Convergent evidence was necessary** — four Photosynthesis Improvements required verdict rise + FM clearance + ownership + anti-mimicry; not one layer alone.

3. **FM delta aligned with verdict delta** on all remediation pairs — Layer 3 corroborated Layer 1 movement.

4. **Ownership is independently auditable** — TP-PS-A4 baseline proved L4 ≠ L1.

5. **Anti-mimicry cleared on all pairs** — Strong-shape targeting did not produce benchmark copy on this sample.

6. **Boundary declaration enabled ambiguous-body evaluation** — TP-PS-A6 without reopening M22 historical records.

7. **Cosmetic shape discriminations were exercised in reviewer notes** — exemplar reasoning vs table shell (DT-PS); scaffolding vs slot (TP-PS-A4); superficial-match flags all `no`.

8. **Maintain-test pairs required the same stack** — Marx No Change after full layer exercise, not verdict-only glance.

9. **Capture channel separation preserved** — FM-01/FM-12 absent; instructional FMs scored separately.

10. **No layer failure triggered experiment-level failure criteria** — stack complete on six pairs; repeatability not tested.

---

## Implications For Sprint 45.2

What the chartered sprint must test about the stack — conceptual requirements only, not sprint design.

| Stack aspect | What 45.2 must test |
| ------------ | ------------------- |
| **Whole stack** | Can Layers 1–7 be specified reproducibly without modifying 44-2 or 44-3? |
| **L1 — Verdict** | Do independent reviewers reach compatible verdicts on same bodies? |
| **L2 — Signals** | Do signals and verdicts systematically diverge on new bodies? |
| **L2 superficial match** | Can pattern-shaped non-improvement be correctly classified? |
| **L3 — FMs** | Are FM checks traceable to protocol steps across raters? |
| **L4 — Ownership** | Is ownership audit operationalisable beyond 45-1 session intuition? |
| **L5 — Anti-mimicry** | Is corpus comparison applicable as standing procedure? |
| **L6 — Boundary** | Does declaration precedent generalise to new ambiguous bodies? |
| **L7 — Convergence** | Does convergent judgement yield consistent outcomes across evaluators and holdout bodies? |
| **Re-evaluation** | Do twelve 45-1 bodies re-score to same pair classifications under protocol? |

**45-2 failure would indicate:** stack incoherence, irreproducibility, or utility insufficient to govern further generation research — not invalidation of 45-1 findings in scope ([`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md) § Failure Conditions).

---

## Conclusion

### Best current understanding of the evaluation stack

The evaluation stack that emerged from Sprint 45.1 is a **seven-layer structure for judging pattern-guided instructional material bodies**, with **44-2 contract verdict as the single normative authority** and **six surrounding layers** that corroborate, diagnose, gate, interpret, or synthesise.

| Understanding | Status |
| ------------- | ------ |
| Stack is **necessary** for intervention-trust claims beyond corpus characterisation | **Demonstrated** — 45-1 could not have classified Improvements on contract alone |
| Layer ordering: verdict-first; signals secondary; ownership and mimicry as gates | **Demonstrated** — workbook, design, outcomes |
| Convergent judgement integrates layers before pair classification | **Demonstrated** — 4/4 Photosynthesis convergent |
| Stack is **standing protocol** | **Not demonstrated** — exercised once; 45-2 chartered |
| Layer failure modes and conflict resolution | **Partially demonstrated** — separability shown; veto paths designed but not all triggered |

**In one formulation:**

> Pattern-aware evaluation applies a normative contract verdict first, then requires convergent alignment across failure-mode diagnosis, independent ownership audit, anti-mimicry validity checking, and (where needed) explicit boundary declaration, with Detection Signals as secondary corroboration — before classifying whether pattern-guided intervention succeeded.

This is the best current understanding **supported by Sprint 45.1 evidence**. Whether the stack is **repeatable, generalisable, and sufficient** for ongoing research is the question Sprint 45.2 is chartered to address — not answered here.

---

## Traceability

| Section | Primary sources |
| ------- | --------------- |
| Background | Position paper § The Problem; methodological contributions |
| Layer roles | `45-1-pattern-injection-experiment-design.md` § Evaluation Method; workbook instructions |
| Demonstrated strengths/limitations | `45-1-recommendation.md`; `45-1-evidence-workbook.md`; closure review |
| Relationships / failure | Design § Failure Criteria; position paper § Proposed Conceptual Model |
| 45-2 implications | `SPRINT-45-2-CHARTER.md` § Success/Failure Conditions |
| Asset context | `PRISM-RESEARCH-ASSET-INVENTORY.md` |
