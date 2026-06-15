# Sprint 45 Proposal — Pattern-Guided Generation

**Date:** 2026-06-15  
**Type:** Proposal — **not approved**  
**Predecessor:** [Sprint 44 — Instructional Depth and GAM Validation](sprint-44-outcomes.md)  
**Working title:** Pattern-Guided Generation

---

## Rationale

Sprint 44 made instructional quality **observable** (44-2 contracts), **measurable** (benchmark evaluation), and **reusable** (Pattern Library Draft 1 + meta-principles). It did not test whether those artefacts can **change what the pipeline produces**.

The benchmark corpus and evaluation passes established:

- Strong, Minimum, and Failed realisations are distinguishable on frozen materials.
- Recurring failure modes (FM-02–FM-11) are evidenced cross-domain.
- Strong patterns (SP-01–SP-06) encode what worked on Marx exemplars and what contrast cases lacked.

Sprint 45 should **experiment** with whether evidence-backed patterns can influence GAM generation quality — still evaluated through 44-2 contracts and benchmark traceability — **without** reopening educational architecture, contract redesign, or treating patterns as unvalidated prompt dumps.

This document is a **proposal** for the next frontier. It is not an approved sprint charter.

---

## Starting Assets

| Asset | Location | Role in Sprint 45 |
| ----- | -------- | ------------------- |
| 44-2 instructional depth contracts (Draft 1) | [`sprint-44-2-instructional-depth-contracts.md`](sprint-44-2-instructional-depth-contracts.md) | Evaluation rubric — unchanged |
| Benchmark corpus (Marx, Photosynthesis) | [`benchmark-corpus/`](benchmark-corpus/) | Regression baseline + contrast reference |
| Pattern Library Draft 1 | [`sprint-44-3-instructional-pattern-library.md`](sprint-44-3-instructional-pattern-library.md) + [`patterns/`](patterns/) | Generation targets |
| Failure-mode catalogue | Pattern Library Secondary Index | Negative constraints for evaluation |
| Meta-principles MP-1–MP-8 | Pattern Library § Meta-Principles | Orientation only; 44-2 governs verdicts |
| 44-1 capture gate design | [`sprint-44-slice-1-tiered-gam-capture-gate.md`](sprint-44-slice-1-tiered-gam-capture-gate.md) | May ship during Sprint 45; complementary to quality experiments |

---

## Proposed Sprint Goal

**Determine whether evidence-backed instructional patterns can be used to improve GAM material generation quality — measured by 44-2 contract evaluation and pattern detection signals — without reopening educational architecture or redesigning 44-2 contracts.**

Success means observable movement toward Strong pattern signals and away from documented failure modes on controlled generation runs — not universal Strong realisation in one sprint.

---

## Candidate Workstreams

### 45-1 Pattern Injection Experiment

Inject one or two pattern specifications into GAM generation context for controlled material types and compare output bodies to:

- frozen benchmark Strong exemplars (e.g. Marx M13, M16)
- pre-pattern generation on the same DLA obligations

**Suggested initial patterns:**

- **DT-SP-01 / SP-02** — partial-exemplar decision table (unanimous Strong; clear FM-04 contrast)
- **TP-SP-01 / SP-03** — capstone transfer prompt (unanimous Strong on M16; unanimous Failed on M14)

**Question answered:** Do generated bodies exhibit target pattern detection signals?

---

### 45-2 Pattern-Aware Evaluation

Apply 44-2 contracts and pattern Detection Signals sections to generated materials:

- Target pattern signals present?
- Documented failure modes absent (e.g. FM-04, FM-02, FM-03)?
- Learner-ownership mechanisms preserved (empty judgement cells, no pre-written transfer, etc.)?

Reuse evaluation method conventions from Sprint 44 (body vs composition separation; stub detection).

**Question answered:** Is improvement measurable with the same rubric Sprint 44 validated?

---

### 45-3 Regression Against Benchmark Corpus

Compare new generation outputs against frozen Marx / Photosynthesis corpus:

- Verdict distribution shift (more Strong, fewer Failed/Minimum on target types)?
- No regression on materials not targeted by injection?
- Cross-domain behaviour (does Photosynthesis still show thinner realisation without pattern injection)?

**Question answered:** Does pattern guidance generalise or overfit Marx?

---

### 45-4 Generation Repair Strategy (exploratory)

Explore **material-level** repair for failed bodies (e.g. stub emission FM-01, thin transfer FM-02) without re-running the full workflow:

- Repair scope: single material body vs activity vs session
- Evaluation: post-repair 44-2 + pattern signals
- Explicitly **not** full autonomous repair in first slice

**Question answered:** Is repair cheaper than regeneration for known failure modes?

---

## Non-Goals

Sprint 45 proposal **excludes** (unless explicitly rescoped):

| Non-goal | Reason |
| -------- | ------ |
| Reopen ownership model | Settled Sprint 43 |
| Redesign 44-2 contracts | Draft 1 accepted; patterns subordinate |
| Redesign Pattern Library architecture | Validated Sprint 44 |
| Implement full autonomous repair pipeline | Premature before 45-1 results |
| Treat patterns as prompts without evaluation | Patterns are educational specs; injection must be measured |
| Expand to unevaluated material types first | No SP entries for modelling_note, rubric, etc. |
| Renderer / page layout redesign | Out of Sprint 44–45 instructional-depth scope |
| Universal Strong enforcement gates | 44-1 excludes semantic depth blocking |
| Resolve all calibration boundaries | Document; do not legislate via generation |

---

## Success Signals

Examples of what would indicate Sprint 45 succeeded:

| Signal | Indicator |
| ------ | --------- |
| Pattern signals in generated bodies | Detection checklists from SP-02 / SP-03 pass on injection runs |
| Failure mode reduction | FM-04, FM-02, FM-03 less frequent vs baseline generation on same DLA |
| Contract traceability maintained | Verdicts still justified via 44-2 §5.x + corpus comparison |
| Learner ownership preserved | No increase in pre-filled judgement, pre-written transfer, or closure collapse |
| No architecture regression | Upstream artefacts and activity structure unchanged |
| Evidence documented | Same chain as Sprint 44: corpus → evaluate → report |

---

## Recommended First Slice

**45-1 Pattern Injection Experiment — `decision_table` and `transfer_prompt` only.**

### Scope

- Patterns: **SP-02 / DT-SP-01**, **SP-03 / TP-SP-01**
- Material types: `decision_table`, `transfer_prompt`
- Domains: at least one evaluate/capstone activity per domain (Marx A4-shaped; Photosynthesis A4/A6-shaped)
- Evaluation: 45-2 pattern-aware scoring using existing contracts and pattern Detection Signals

### Justification

| Criterion | SP-02 + SP-03 |
| --------- | ------------- |
| Strongest evidence | M13 and M16 unanimous Strong; M14 unanimous Failed |
| Clearest contrast | Strong vs Minimum vs Failed discrimination in evaluation |
| Inter-rater agreement | High on primary exemplars and Failed cases |
| Failure modes | FM-04 and FM-02/FM-03 well documented with remediation shapes |
| Learner ownership | Explicit in patterns (empty judgement cells; no pre-written transfer) |
| Bounded experiment | Two types, two patterns — narrow enough to measure |

### Deferred to later slices

- SP-05 / checklist (calibration-sensitive — Marx Strong/Minimum split)
- SP-06 / worked_example (FM-05 cross-domain; bridge not in corpus Strong body)
- SP-01 / text (FM-07 emission channel; M1 verdict split)
- SP-04 / consolidation (M23 verdict split)
- 45-4 repair — after injection results show which FMs persist

### Dependencies

- 44-1 implementation desirable before large generation runs (block stubs early) but not strictly blocking a controlled experiment
- Pattern injection mechanism TBD (authoring guideline embed, spec block, or prompt segment) — must be evaluated, not assumed

---

## Approval Status

This proposal requires explicit approval before Sprint 45 work begins. Sprint 44 closes on educational-design deliverables; Sprint 45 starts with **45-1** as the recommended first experiment if approved.
