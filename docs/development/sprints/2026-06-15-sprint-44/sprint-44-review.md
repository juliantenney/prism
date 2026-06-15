# Sprint 44 Review

**Date:** 2026-06-15  
**Sprint:** Instructional Depth and GAM Validation  
**Status:** Closing review

---

## Sprint Purpose

Sprint 44 moved PRISM from a **settled educational architecture** (Sprint 43) into **instructional material quality** and **GAM validation**. Where Sprint 43 asked who owns the learner experience and how structure should manifest, Sprint 44 asked whether learner-facing materials perform their educational function — and whether the programme could make that quality **observable, evaluable, and reusable** without reopening workflow or ownership debates.

The sprint had three planned slices:

| Slice | Intent |
| ----- | ------ |
| **44-1** | Tiered GAM capture safety — block structural/coverage failures before compose |
| **44-2** | Instructional depth contracts — explicit educational standards per material type |
| **44-3** | Instructional pattern library — evidence-backed strong realisation shapes |

Sprint 44 treated **material realisation** as the active quality frontier, not missing upstream pedagogy or missing workflow stages.

---

## Starting Point

Sprint 44 inherited a stable baseline from Sprint 43:

- **Investigation-primary / resource-secondary ownership** — accepted; not reopened.
- **Presence ≠ salience** — upstream structure does not guarantee learner-visible authority.
- **Architecture generalises** — Marx and Photosynthesis both produced coherent upstream artefacts; Photosynthesis exposed material-realisation weakness more visibly than architectural failure.
- **Two-column manifestation** — accepted prototype direction; not a Sprint 44 implementation target.
- **Principal quality gap reframed** — instructional material bodies often under-realise their function (exposition, modelling, verification, transfer, closure).

Initial frontier ([`sprint-44-current-frontier.md`](sprint-44-current-frontier.md)):

1. **44-1** — GAM capture gate (design → implement)
2. **44-2** — Depth contracts + benchmark evaluation
3. **44-3** — Pattern library (conditional on contract discrimination)

---

## Work Completed

### 44-1 — Tiered GAM capture gate

- **Design spec completed:** [`sprint-44-slice-1-tiered-gam-capture-gate.md`](sprint-44-slice-1-tiered-gam-capture-gate.md)
- Tier 1 (structural) and Tier 2 (coverage) **blocking**; Tier 3 (thin bodies) **warning only**
- Scope: self-directed learner-page GAM capture only; no prompt/renderer/LLM repair changes
- **Runtime implementation** was specified as ready but is **not claimed as shipped** in this sprint closure — design deliverable complete

### 44-2 — Instructional depth contracts

- **Draft 1 accepted as educational reference:** [`sprint-44-2-instructional-depth-contracts.md`](sprint-44-2-instructional-depth-contracts.md)
- Eleven material types with minimum, strong, and failure-mode sections
- Normative educational artefact — not an implementation or prompt spec

### Benchmark corpus

- Frozen cross-domain fixtures: [`benchmark-corpus/`](benchmark-corpus/)
- **Marx** (`marx-capitalism-v1`) — `activity-materials.txt`, DLA, upstream JSON
- **Photosynthesis** (`photosynthesis-v1`) — `learning-materials.txt`, DLA, upstream JSON
- Evaluation unit: GAM material bodies; DLA used for obligation verification only

### Evaluation programme

Three passes against 44-2 contracts (accepted session evidence; findings codified in patterns and this review):

| Pass | Scope |
| ---- | ----- |
| **Pass 1** | Sentinel: `text` (M1), `worked_example` (M2) — both domains |
| **Pass 2** | Verification, transfer, judgement, closure — Marx and Photosynthesis |
| **Inter-Rater Validation** | Independent cross-type scoring; same contracts, no prior report access |

Supporting assessments:

- **44-3 Readiness Assessment** — authorised Pattern Library Draft 1
- **44-3 Architecture Review** — architecture validated after SP-02, SP-03, SP-06 authoring
- **Sprint 44 Pattern Synthesis** — cross-pattern principles MP-1–MP-8

### 44-3 — Pattern Library

- **Architecture:** [`sprint-44-3-instructional-pattern-library.md`](sprint-44-3-instructional-pattern-library.md) — hybrid index, conventions, failure-mode registry, traceability
- **Six Draft 1 pattern entries** — [`patterns/`](patterns/) — all in-scope core material types
- **Meta-principles MP-1–MP-8** — observed cross-pattern regularities; subordinate to 44-2 contracts

---

## Key Discoveries

1. **44-2 contracts discriminate** — verdicts spread across Strong, Minimum, and Failed; not uniform pass clustering. Sharpest discrimination on `transfer_prompt` (Marx M16 Strong vs Photosynthesis M14 Failed) and `decision_table` (Marx M13 Strong vs Photosynthesis M12/M19 Minimum).

2. **Material realisation confirmed as the active frontier** — both domains produced structurally valid materials at minimum threshold; weakness was instructional depth (FM-04, FM-05, FM-07, FM-11, etc.), not missing workflow stages or missing upstream pedagogy.

3. **Failure modes became observable and nameable** — eleven instructional FMs (FM-02–FM-11) plus capture artefacts (FM-01, FM-12) documented with benchmark citations.

4. **Inter-rater agreement on core findings** — unanimous on key Strong exemplars (M13, M16, M17, M1 Marx) and Failed cases (M13 checklist stub, M14 transfer); moderate disagreement on Strong/Minimum boundaries (Marx M2, Marx checklists, Photosynthesis M23, M22, M1).

5. **Patterns extracted without contract redesign** — SP-01–SP-06 authored from evaluation evidence only; no new verdict tiers or contract sections required.

6. **Cross-pattern meta-principles emerged** — scaffold ≠ deliverable, partial modelling, bridges, criteria linkage, operational completion criteria, reasoning over completeness, multi-cue structure, one move per material.

7. **Photosynthesis systematically thinner than Marx** on evaluative-arc materials; Marx capstone sequence (M12→M17) coherent strong reference arc.

8. **Capture and composition are separate channels** — stub emission (FM-01), cognition-cue collapse (FM-07), page-composition loss (FM-12) must not be scored as instructional patterns alone.

---

## Validated Claims

| Claim | Evidence |
| ----- | -------- |
| 44-2 contracts are operational for human evaluation | Three passes; 25+ materials scored with citations |
| Contracts discriminate across domains within material type | Marx vs Photosynthesis verdict splits on same types |
| Instructional material realisation is the principal quality gap | Recurrent FMs on both domains; architecture not reopened |
| Benchmark corpus supports reproducible evaluation | Frozen GAM bodies + DLA obligations |
| Pattern library is warranted (44-3 trigger met) | Readiness Assessment; Architecture Review |
| Evaluation → pattern extraction workflow is viable | Six patterns + MPs without new evaluation |
| Partial exemplar rows elevate decision tables | Unanimous Strong on Marx M13 |
| Transfer requires substantive body + completion criteria + context framing | Unanimous Failed on M14; M16 unanimous Strong |
| Worked examples need parallel-task bridge for unambiguous Strong | FM-05 cross-domain on M2; calibration split on Marx M2 |
| Exposition polluted by cognition cues is a real emission failure | FM-07 on Photosynthesis M1, M2, M4 |
| Closure can scaffold without collapsing learner synthesis | M17, M23 avoid pre-written capstone; anti-collapse |
| Meta-principles summarise without superseding 44-2 | Documented subordination in pattern library |

---

## Falsified or Avoided Claims

| Claim | Sprint 44 disposition |
| ----- | --------------------- |
| Missing workflow stage needed | **Not reopened** — disproved Sprint 43; evaluation found realisation gap |
| Missing upstream pedagogy | **Not reopened** — pedagogy present; bodies under-realise |
| Pattern library as speculative wishlist | **Avoided** — authorised only after discrimination evidence |
| Capture artefacts as instructional patterns | **Excluded** — FM-01/FM-12 in conventions, not pattern indexes |
| Universal semantic depth gates in 44-1 | **Excluded** — FMT-06/07/08 not global gates |
| Contracts require redesign to evaluate | **Falsified** — Draft 1 sufficient with method conventions |
| Marx uniformly better than Photosynthesis | **Avoided** — domain comparison not the evaluation objective; within-type discrimination used |
| Inter-rater perfect agreement on all materials | **Falsified** — calibration boundaries documented, not hidden |
| Patterns imply prompt/validator implementation | **Avoided** — educational design artefacts only |
| Page composition equals GAM body quality | **Separated** — body vs composition rule |

---

## Remaining Uncertainties

| Area | Notes |
| ---- | ----- |
| **Unevaluated material types** | `modelling_note`, `misconception_note`, `sample_output`, `rubric`, `quality_criteria` — in 44-2 contracts, not in Pattern Library v1 |
| **Strong / Minimum calibration** | Marx M2, Marx checklists, Photosynthesis M1/M23/M22 — documented boundaries, not resolved |
| **Page-composition channel** | FM-12 — materials absent from `page.json` despite GAM presence; separate from body scoring |
| **44-1 implementation impact** | Gate designed; runtime effect on capture quality not measured in Sprint 44 |
| **Patterns → generation** | No experiment yet whether patterns improve GAM output |
| **Automated detection / repair** | Explicitly out of Sprint 44 scope; not implemented |
| **Template / independent_judgement pattern** | Convention mapped; TM-SP-01 not authored |
| **FM-08 (applied exposition bridge)** | Pass 1 only; not stable inter-rater criterion |

---

## Sprint 44 Assessment

**Sprint 44 achieved its purpose.**

The sprint set out to make instructional material quality **explicit** (44-2), **measurable** (benchmark evaluation), **reproducible** (inter-rater validation), and **reusable** (Pattern Library Draft 1 + meta-principles). All four outcomes were delivered as educational design artefacts. GAM capture safety was **specified** (44-1); depth was **evaluated** and **patterned** (44-2, 44-3) without reopening Sprint 43 architecture.

What Sprint 44 did **not** claim: shipped runtime capture gate, prompt changes, automated enforcement of Strong realisation, or closed calibration disputes. Those are appropriately deferred to implementation and proposed Sprint 45 experimentation.

Sprint 44 closes with a validated evidence chain from frozen corpus to patterns — and a clear, evidence-based proposal for what to test next.
