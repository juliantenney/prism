# Sprint 45.1 Closure Review

**Date:** 2026-06-18  
**Scope:** 45-1 Pattern Injection Experiment — evidence collection and evaluation complete  
**Authority:** [45-1-pattern-injection-experiment-design.md](45-1-pattern-injection-experiment-design.md) · [45-1-experiment-execution-plan.md](45-1-experiment-execution-plan.md) · [45-1-evidence-workbook.md](45-1-evidence-workbook.md) · [45-1-recommendation.md](45-1-recommendation.md)  
**Status:** Closure review — Sprint 44 remains closed and authoritative

---

## Original Research Question

45-1 was designed to answer:

> Can evidence-backed instructional patterns SP-02 (partial-exemplar decision table) and SP-03 (capstone transfer prompt) be deliberately induced in GAM material generation such that generated bodies show (a) target pattern detection signals, (b) improved 44-2 contract verdicts relative to baseline generation on the same DLA obligations, (c) reduced incidence of FM-04, FM-02, and FM-03, and (d) preserved learner ownership — without benchmark mimicry or scaffold-to-deliverable collapse?

Secondary questions (informative, not gating): cross-domain generalisation vs Marx overfitting; corpus-relative proximity to Strong references without copying.

---

## Evidence Collected

Six obligation-matched pairs (12 bodies) evaluated per approved execution plan. All pairs complete; no inconclusive or regression classifications.

| Pair | Pattern | Domain | Baseline verdict | Treatment verdict | Classification | Target FM delta |
| ---- | ------- | ------ | ---------------- | ----------------- | -------------- | ----------------- |
| DT-MRX-A4 | SP-02 | Marx | Strong | Strong | No Change | FM-04: absent both |
| DT-PS-A4 | SP-02 | Photosynthesis | Minimum | Strong | Improvement | FM-04: reduced |
| DT-PS-A6 | SP-02 | Photosynthesis | Minimum | Strong | Improvement | FM-04: reduced |
| TP-MRX-A4 | SP-03 | Marx | Strong | Strong | No Change | FM-02/FM-03: absent both |
| TP-PS-A4 | SP-03 | Photosynthesis | Failed | Strong | Improvement | FM-02/FM-03: reduced |
| TP-PS-A6 | SP-03 | Photosynthesis | Failed* | Strong | Improvement | FM-03: reduced; FM-02: absent both |

\*TP-PS-A6 baseline scored **Failed** under the declared Inter-Rater conjunctive §5.8 minimum interpretation (completion criterion present; learner-context selection absent). Frozen M22 historical verdict remains Minimum (Pass 2) / Failed (Inter-Rater) — boundary documented, not resolved.

Aggregate: 4 Improvements · 2 No Change · 0 Regression · 0 Inconclusive · 0 ownership regressions · mimicry suspect = no on all six pairs.

---

## What 45-1 Demonstrated

Conclusions supported directly by workbook evidence:

1. **Pattern-guided treatment can improve 44-2 verdicts on Photosynthesis weak obligations.** All four Photosynthesis pairs improved (Minimum→Strong or Failed→Strong). Marx maintain-test pairs held Strong.

2. **Target failure modes reduced on remediation pairs.** FM-04 cleared on both Photosynthesis `decision_table` pairs (present in baseline, absent in treatment). FM-02 and FM-03 cleared on TP-PS-A4 (both present in baseline, absent in treatment). FM-03 cleared on TP-PS-A6 under declared interpretation.

3. **SP-02 Strong shape is achievable without ownership regression.** Treatment bodies modelled partial exemplar reasoning (evidence/reason cells) while learner judgement loci remained empty. Workbook explicitly distinguishes substantive exemplar reasoning from superficial table completion (DT-PS-A4, DT-PS-A6).

4. **SP-03 Strong shape is achievable without ownership regression.** Treatment bodies added learner-context selection, operational completion criteria, and multi-cue transfer scaffolding without pre-written learner transfer responses. Workbook explicitly distinguishes substantive transfer support from mere transfer-slot presence (TP-PS-A4).

5. **Cross-domain generalisation signal (within experiment scope).** Photosynthesis remediation succeeded on both material types; Marx Strong references were maintained. Anti-mimicry checks negative on all pairs — improvements attributed to instructional-function moves, not verbatim M13/M16 transplant.

6. **Verdict-first evaluation with secondary Detection Signals is operable.** Contract verdicts drove pair classifications; pattern signals corroborated but did not override verdicts. No pair classified improvement on signals alone without verdict rise.

7. **M22 boundary can be handled in-pair without reopening Sprint 44 calibration.** TP-PS-A6 recorded explicit §5.8 minimum interpretation declaration; outcome documented under that declaration only.

---

## What 45-1 Did Not Demonstrate

Limits of the experiment — not failures, but out-of-scope or unproven:

| Limit | Reason |
| ----- | ------ |
| **How pattern guidance reaches a generator** | Design explicitly left injection mechanism open (Q-02). 45-1 tested pattern-guided bodies, not a production pipeline. |
| **Reproducibility across multiple generation runs** | Single baseline/treatment body per pair; no replication variance measured. |
| **Generalisation beyond SP-02 and SP-03** | Scope locked to two patterns only. SP-01, SP-04, SP-05, SP-06 not tested. |
| **Generalisation beyond `decision_table` and `transfer_prompt`** | No other material types evaluated. |
| **Generalisation beyond six defined DLA slots** | Two domains, three activities, six obligation-matched outputs only. |
| **Non-target material regression** | 45-3 scope; not assessed in 45-1. |
| **Runtime or automated capture-channel behaviour** | FM-01/FM-12 absent on all recorded bodies; capture channel not stress-tested. |
| **Global resolution of M22 §5.8 minimum interpretation** | Conjunctive interpretation declared for TP-PS-A6 only; Pass 2 compensatory reading not applied or validated experiment-wide. |
| **That Detection Signals alone constitute success** | Design guards against this; no such false positive observed, but the experiment did not prove signals are unnecessary — it proved verdict + FM + ownership convergence on this sample. |
| **Material-level repair without re-generation** | 45-4 scope; not tested. |
| **Industrial scale or inter-rater replication of 45-1 bodies** | Single evaluator session; workbook structured for reproducibility but independent re-score not recorded. |

---

## Assumptions Confirmed

Sprint 44 assumptions **strengthened** by 45-1 evidence:

| Assumption | 45-1 evidence |
| ---------- | ------------- |
| Instructional material realisation is the actionable quality frontier | Verdict improvements on Photosynthesis weak slots without changing DLA obligations or upstream pedagogy |
| 44-2 contracts discriminate and can track remediation | Primary verdict deltas aligned with FM clearance on all remediation pairs |
| FM-04 is remediable via partial-exemplar modelling (SP-02) | DT-PS-A4 and DT-PS-A6: FM-04 present → absent with Strong treatment verdicts |
| FM-02/FM-03 are remediable via substantive transfer scaffolding (SP-03) | TP-PS-A4: both FMs cleared; TP-PS-A6: FM-03 cleared |
| Pattern guidance can preserve learner ownership (MP-1) | Zero ownership regressions across six treatment bodies |
| Marx Strong references are maintainable under pattern guidance | DT-MRX-A4 and TP-MRX-A4: Strong → Strong, no FM introduction |
| Photosynthesis weak shapes are not immutable | 4/4 Photosynthesis pairs improved |
| Pattern Detection Signals correlate with contract improvement when both present | Treatment bodies showed Strong signal profiles alongside Strong verdicts on all six treatments |
| Benchmark mimicry is a distinguishable failure mode | Corpus comparison and superficial-match flags operational; no mimicry flagged |

---

## Assumptions Challenged

Assumptions **weakened, qualified, or left open** — not overturned, but no longer unqualified:

| Assumption | 45-1 finding |
| ---------- | ------------ |
| M22 can be treated as settled Minimum under Pass 2 compensatory reading | TP-PS-A6 baseline scored Failed under declared conjunctive reading despite operational completion band — M22 ambiguity persists globally |
| Completion criterion alone may suffice for transfer minimum | TP-PS-A6 baseline had 80+ words and ≥2 impacts but failed minimum under conjunctive interpretation for missing learner-context selection |
| Marx Strong success predicts Photosynthesis remediation | Marx No Change outcomes did not predict Photosynthesis results; remediation required independent evidence per pair |
| Table structure alone approaches Strong | DT-PS-A4/A6 baselines had valid tables but Minimum + FM-04; structure without exemplar reasoning insufficient |
| Transfer slot presence approaches transfer success | TP-PS-A4 baseline occupied transfer slot but Failed; slot without scaffolding insufficient |
| Pattern checklist pass could substitute for verdict | Design rejected this; 45-1 did not produce counterexamples in-sample, but the experiment confirms verdict primacy was necessary to classify improvements |

---

## Remaining Uncertainties

Questions **not answered** by 45-1:

1. What mechanism reliably injects SP-02/SP-03 into production generation?
2. Will verdict improvements replicate across independent generation runs on the same obligations?
3. Which §5.8 minimum interpretation should govern capstone transfer globally — conjunctive or compensatory?
4. Do SP-02/SP-03 effects hold on additional domains, activities, or material slots beyond the six tested?
5. Do non-target materials regress when pattern guidance is applied to target slots?
6. When should SP-01, SP-04, SP-05, SP-06 enter the injection programme?
7. Can pattern-aware evaluation be applied consistently by multiple raters on newly generated bodies?
8. Does pattern guidance degrade under capture-channel stress (FM-01 stub, FM-12 composition loss)?
9. What is the minimum treatment feature set for each FM — partial exemplar only, or full Strong signal set?

---

## Impact on Sprint 44 Understanding

45-1 **does not change** Sprint 44 frozen verdicts, contracts, Pattern Library architecture, or settled Sprint 43 decisions. It **extends** interpretation as follows:

| Sprint 44 finding | 45-1 impact |
| ----------------- | ----------- |
| M12/M19 Minimum + FM-04 | **Remediable** — pattern-guided treatment reached Strong with FM-04 absent (DT-PS-A4, DT-PS-A6) |
| M14 Failed + FM-02/FM-03 | **Remediable** — pattern-guided treatment reached Strong with both FMs absent (TP-PS-A4) |
| M13/M16 Strong | **Maintainable** — pattern-guided treatment held Strong without regression (DT-MRX-A4, TP-MRX-A4) |
| M22 boundary (P2 Minimum / IR Failed) | **Still ambiguous globally** — documented in-pair; treatment improved under declared interpretation but did not resolve historical split |
| FM-04, FM-02, FM-03 as named failure modes | **Validated as actionable targets** — all three reduced on at least one remediation pair |
| Detection Signals as secondary layer | **Validated in practice** — corroborated verdicts without overriding them |
| Instructional frontier hypothesis | **Strengthened** — controlled experiment moved weak bodies toward Strong without ownership collapse |

Sprint 44 historical scoring of frozen corpus bodies is unchanged. 45-1 adds forward-looking evidence that the patterns encoding Sprint 44 Strong shapes can influence generation outcomes when deliberately applied.

---

## Frontier After 45-1

Before 45-1, the frontier was: *Can patterns influence generation at all?*

After 45-1, that question has **positive controlled evidence** on six obligation-matched pairs. The frontier shifts to:

| Priority | Question | Rationale from 45-1 |
| -------- | -------- | ------------------- |
| 1 | Can pattern-aware evaluation be formalised and applied repeatably? | 45-1 evaluation method worked once; 45-2 is the recommended next step |
| 2 | Do improvements generalise beyond this single experiment run? | No replication variance measured |
| 3 | Does generation improve corpus-wide without non-target regression? | 45-3 scope; not tested in 45-1 |
| 4 | When and how should additional patterns enter injection? | SP-02/SP-03 succeeded; SP-01/04/05/06 deferred |
| 5 | How is M22-like ambiguity handled in standing evaluation policy? | Documented per-pair only; global rule unset |

The active quality frontier remains **instructional material realisation**. 45-1 established that pattern-guided generation can move that frontier on tested obligations. The next research step is making the evaluation that detected those moves **repeatable and generalisable** — not yet proving production-scale injection.

---

## Lessons for Future Experiments

Evaluation design:

- **Verdict-first layering worked.** Primary 44-2 verdicts drove pair outcomes; Detection Signals remained secondary. Future experiments should preserve this ordering.
- **Explicit pair classifications** (Improvement / No Change / Regression / Inconclusive) with defined verdict ordering prevented ambiguous aggregation.
- **Per-output success criteria** separate from experiment-level success enabled Marx maintain-test pairs to classify No Change without masking Photosynthesis remediation.

Ownership auditing:

- **Ownership regression as override** — design requirement proved necessary in principle; zero regressions observed but the gate was exercised on every treatment body.
- **Distinguish scaffolding from deliverable** — exemplar reasoning cells and transfer production prompts were scored as author scaffolding; judgement cells and learner responses remained empty.
- **Baseline can pass ownership while failing contract** — TP-PS-A4 and TP-PS-A6 baselines: ownership pass, instructional fail (FM-02/FM-03 or FM-03).

Anti-mimicry controls:

- **Corpus-relative comparison** (Strong-reference proximity, weak-reference distance, mimicry suspect) operationalised anti-mimicry beyond verdict score alone.
- **Superficial-match flags** distinguished pattern-shaped output without verdict improvement — none triggered in 45-1, but the control was used on treatment bodies.
- **Domain-appropriate content** was an explicit reviewer judgement, not automatic text-overlap scoring.

Evidence collection:

- **Frozen baseline bodies as comparative anchors** enabled paired delta without re-litigating historical corpus.
- **M22 boundary declaration** should be mandatory when evaluating ambiguous transfer bodies — TP-PS-A6 demonstrated this.
- **FM channel separation** (FM-01/FM-12 vs instructional FMs) kept capture artefacts out of instructional scoring.
- **Workbook structure** (baseline → treatment → pair outcome per pair) supported traceable recommendation without re-reading raw artefacts.

Discriminating moves (instructional, not cosmetic):

- Partial-exemplar **reasoning** vs empty-grid-plus-one-filled-cell (SP-02).
- Learner-context **selection** vs third-person procedural correction (SP-03).
- Substantive transfer **scaffolding** vs transfer-slot presence alone (SP-03).

---

## Recommendation

**Next research question to address:**

> Can the 45-1 evaluation method — 44-2 verdicts as primary evidence, pattern Detection Signals as secondary, mandatory FM and ownership checks, corpus-relative anti-mimicry comparison, and explicit boundary declarations — be formalised into a repeatable pattern-aware evaluation protocol that reliably scores newly generated `decision_table` and `transfer_prompt` bodies beyond this single six-pair experiment?

This corresponds to **45-2 Pattern-Aware Evaluation**, as recommended in [45-1-recommendation.md](45-1-recommendation.md). It follows directly from what 45-1 demonstrated (the method detected real improvements) and what it did not demonstrate (repeatability, generalisability, multi-rater consistency on new generation).

45-1 is **closed**. Proceed to 45-2 when authorised. Do not expand pattern injection scope until the evaluation method is standing.

---

## Traceability

| Artefact | Role |
| -------- | ---- |
| [45-1-pattern-injection-experiment-design.md](45-1-pattern-injection-experiment-design.md) | Research question, success/failure criteria |
| [45-1-experiment-execution-plan.md](45-1-experiment-execution-plan.md) | Collection and classification procedure |
| [45-1-evidence-workbook.md](45-1-evidence-workbook.md) | Primary evidence (12 bodies, 6 pair outcomes) |
| [45-1-recommendation.md](45-1-recommendation.md) | Gate review and proceed recommendation |
