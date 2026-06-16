# Sprint 45.2 Scope Analysis

**Date:** 2026-06-18  
**Type:** Scope analysis — not a sprint design, protocol, or implementation proposal  
**Purpose:** Determine the minimum credible experiment capable of answering the Sprint 45.2 frontier question  
**Authority:** [SPRINT-45-2-CHARTER.md](SPRINT-45-2-CHARTER.md) · [EVALUATION-STACK-ANALYSIS.md](EVALUATION-STACK-ANALYSIS.md) · [EVIDENCE-STANDARDS-ANALYSIS.md](EVIDENCE-STANDARDS-ANALYSIS.md) · [REPEATABILITY-ANALYSIS.md](REPEATABILITY-ANALYSIS.md) · [PRISM-RESEARCH-ASSET-INVENTORY.md](PRISM-RESEARCH-ASSET-INVENTORY.md) · [FRONTIER-REVIEW-AFTER-SPRINT-45-1.md](FRONTIER-REVIEW-AFTER-SPRINT-45-1.md)

**Non-goals:** Sprint design · implementation · protocol drafting · architecture · contract or Pattern Library redesign

---

## Background

Sprint 45.1 completed the Pattern Injection Experiment with positive in-scope results: four Photosynthesis Improvements, two Marx No Change outcomes, zero regressions, zero ownership regressions, zero mimicry flags. Those outcomes were classified using a **seven-layer evaluation approach** exercised once in a single evaluator session on twelve GAM bodies across six obligation-matched pairs.

The frontier after 45.1 is no longer whether SP-02/SP-03 can influence bodies under deliberate guidance — that has controlled evidence within scope. The frontier is whether the **evaluation method that detected those moves** can become **repeatable standing research infrastructure** before further pattern injection expands ([`FRONTIER-REVIEW-AFTER-SPRINT-45-1.md`](FRONTIER-REVIEW-AFTER-SPRINT-45-1.md); [`45-1-recommendation.md`](45-1-recommendation.md)).

Sprint 45.2 is chartered to test that frontier. This document analyses **how much scope** a credible 45.2 experiment requires — not how to design it.

---

## The Frontier Question

From [`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md):

> Can the 45-1 evaluation method — 44-2 contract verdicts as primary evidence, pattern Detection Signals as secondary corroboration, mandatory FM and ownership checks, corpus-relative anti-mimicry comparison, and explicit boundary declarations where calibration is ambiguous — be formalised into a repeatable pattern-aware evaluation protocol that reliably scores `decision_table` and `transfer_prompt` bodies **beyond the original six-pair experiment**?

This is an **evaluation** question, not a generation question. It asks whether pattern-aware evaluation can be **reapplied with defensible consistency** — not whether new pattern-guided bodies improve again.

---

## What Repeatability Means In This Context

Four terms used in post-45.1 analysis — distinct meanings.

| Term | Definition | 45-1 status |
| ---- | ---------- | ----------- |
| **Operability** | The evaluation stack can be applied end-to-end and produce classifiable outcomes | **Demonstrated** — six pairs complete; design success criteria met |
| **Consistency** | Layer outcomes align internally within a single application (verdict, FM, ownership, anti-mimicry converge) | **Demonstrated** — high internal consistency; zero layer conflicts in-sample |
| **Repeatability** | Independent or subsequent application yields **compatible** conclusions on the **same bodies** (verdicts, pair classifications) | **Not demonstrated** — single evaluator; no re-score ([`REPEATABILITY-ANALYSIS.md`](REPEATABILITY-ANALYSIS.md)) |
| **Generalisation** | The method yields **compatible** conclusions on **bodies not identical** to the 45-1 twelve | **Not demonstrated** — no holdout or new-body evaluation |

**45.2 frontier targets repeatability and bounded generalisation** — not re-proving operability (already shown) and not full corpus-wide or multi-pattern expansion.

*Interpretation:* Repeatability without any generalisation tests only whether 45-1 was a **session artefact**. Generalisation without repeatability tests only whether the method works on new bodies for one evaluator. The charter requires **both**, but not at maximum scope.

---

## Candidate Scope A: Re-score Existing 45.1 Bodies

**Description:** Apply the evaluation stack again to the twelve frozen 45-1 artefacts (six baseline, six treatment); compare verdicts, layer outcomes, and pair classifications to the original workbook.

### Assessment

| Factor | Assessment |
| ------ | ---------- |
| **Addresses** | Session-artefact risk; whether classifications reproduce ([`REPEATABILITY-ANALYSIS.md`](REPEATABILITY-ANALYSIS.md) § Evidence For Repeatability) |
| **Charter alignment** | Partial — charter success condition 6 implies re-scoring; condition 2 requires bodies **beyond** original session |
| **Strength** | Lowest-cost test of classification stability; charter failure if pair outcomes change materially |
| **Limit** | Same evaluator re-score tests **consistency over time**, not **inter-rater repeatability**; familiarity bias remains |
| **Verdict** | **Necessary but not sufficient** alone |

---

## Candidate Scope B: Independent Evaluators On Existing Bodies

**Description:** One or more reviewers other than the 45-1 session independently apply the evaluation stack to the twelve 45-1 bodies; measure agreement on verdicts, FMs, ownership, anti-mimicry, and pair classifications.

### Assessment

| Factor | Assessment |
| ------ | ---------- |
| **Addresses** | Core repeatability uncertainty — "single evaluator session; independent re-score not recorded" ([`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md)) |
| **Charter alignment** | Strong — convergent evidence across evaluators; detects charter failure if verdicts incompatible |
| **Strength** | Directly tests whether judgement-dependent layers (contract, FM, ownership, mimicry) are operationalisable across people |
| **Limit** | Does not test generalisation to new bodies; does not stress superficial-match disqualifier (no such case in twelve) |
| **Verdict** | **Central to minimum credible scope** |

---

## Candidate Scope C: New Bodies Using Existing Patterns

**Description:** Evaluate additional `decision_table` and `transfer_prompt` bodies (pattern-guided or comparative) beyond the original twelve, still within SP-02/SP-03 scope — holdout obligations, replication slots, or deliberately weak/shaped bodies.

### Assessment

| Factor | Assessment |
| ------ | ---------- |
| **Addresses** | Generalisation beyond familiar sample; superficial-match discrimination ([`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md) success conditions 2, 3) |
| **Charter alignment** | Strong — charter explicitly requires application beyond original six-pair experiment |
| **Strength** | Tests whether method works without 45-1 workbook familiarity; may surface borderline cases absent in unanimous-Strong treatment sample |
| **Limit** | Requires new body collection — introduces generation-adjacent activity; scope must stay evaluation-primary |
| **Verdict** | **Necessary for full charter answer**; size can be **minimal** (not a second 45-1) |

---

## Candidate Scope D: Additional Patterns

**Description:** Extend evaluation or injection to SP-01, SP-04, SP-05, SP-06.

### Assessment

| Factor | Assessment |
| ------ | ---------- |
| **Addresses** | Pattern Library breadth — not 45.2 repeatability question |
| **Charter alignment** | **Excluded** — "SP-01, SP-04, SP-05, SP-06 deferred until protocol stands on SP-02/SP-03" |
| **45-1 gate** | Recommendation: do not expand injection until evaluation standing |
| **Verdict** | **Premature expansion** |

---

## Candidate Scope E: Additional Domains

**Description:** Evaluate bodies from domains beyond Marx and Photosynthesis.

### Assessment

| Factor | Assessment |
| ------ | ---------- |
| **Addresses** | Cross-domain generalisation — 45-3 corpus regression territory |
| **Charter alignment** | Not required for repeatability; 45-1 already showed PS remediation with Marx maintain-test within two domains |
| **Verdict** | **Premature expansion** for 45.2 |

---

## Candidate Scope F: Additional Material Types

**Description:** Extend beyond `decision_table` and `transfer_prompt` to `text`, `checklist`, `worked_example`, etc.

### Assessment

| Factor | Assessment |
| ------ | ---------- |
| **Addresses** | Unevaluated 44-2 types — Sprint 44 scope, not 45.1 validation |
| **Charter alignment** | **Excluded** — initial protocol scope locked to SP-02/SP-03 material types |
| **Verdict** | **Premature expansion** |

---

## Which Candidates Directly Test The Frontier?

Mapped to repeatability analysis unknowns ([`REPEATABILITY-ANALYSIS.md`](REPEATABILITY-ANALYSIS.md) § Remaining Unknowns).

| Candidate | Frontier questions addressed |
| --------- | ---------------------------- |
| **A — Re-score** | #2 Will pair classifications reproduce? (partial — same rater) |
| **B — Independent evaluators** | #1 Same verdicts? #2 Classifications reproduce? #8 Convergent synthesis reproducible? |
| **C — New bodies** | #3 Generalise beyond twelve? #4 Reject superficial shape? #7 Signal/verdict divergence rate? |
| **D — Additional patterns** | None directly — expands generation scope |
| **E — Additional domains** | None directly — 45-3 territory |
| **F — Additional material types** | None directly — outside chartered 45.2 scope |

**Direct frontier testers:** **A + B + C** in combination.

- **B** answers whether repeatability is achievable across evaluators.
- **A** (as part of B or separate blind re-score) answers whether 45-1 outcomes were session artefacts.
- **C** answers whether the method generalises minimally beyond the original twelve and can encounter disqualifier paths not observed in 45-1.

---

## Which Candidates Prematurely Expand Scope?

| Candidate | Why premature |
| --------- | ------------- |
| **D — Additional patterns** | Charter explicit exclusion; 45-1 gates injection expansion on evaluation standing; repeatability not tested on SP-02/SP-03 yet |
| **E — Additional domains** | Does not reduce repeatability uncertainty; adds cross-domain regression question (45-3) |
| **F — Additional material types** | Charter limits to `decision_table` and `transfer_prompt`; unevaluated types lack 45-1 evaluation precedent |
| **Full 45-1 replication** (six new pairs, new generation run) | Duplicates generation experiment; tests replication variance not evaluation repeatability — different question |
| **Corpus-wide regression (45-3)** | Depends on standing evaluation; charter defers |

*Evidence:* [`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md) § What 45.2 Is Not Intended To Demonstrate; [`FRONTIER-REVIEW-AFTER-SPRINT-45-1.md`](FRONTIER-REVIEW-AFTER-SPRINT-45-1.md) candidate ranking.

---

## Smallest Credible Experiment

**Minimum experiment** that would meaningfully reduce uncertainty — **scope characteristics only**, not design.

### Must include

1. **Specification act** — The 45-1 evaluation layers codified as a written procedure usable without 45-1 session familiarity (charter success 1). *Characteristic:* documented protocol artefact as sprint output — not drafted here.

2. **Independent evaluation of the twelve 45-1 bodies** — At least one reviewer independent of the original 45-1 scoring session applies the full stack to all twelve artefacts; agreement measured on verdicts, target FMs, ownership, anti-mimicry, and pair classifications (addresses repeatability core; charter failure 1, 6).

3. **Minimal new-body evaluation within SP-02/SP-03 scope** — At least one `decision_table` and one `transfer_prompt` body **not** among the original twelve, evaluated by independent reviewer(s) using the same stack (charter success 2; generalisation minimum). *Characteristic:* small holdout set — not a second six-pair injection experiment.

4. **Boundary-declaration exercise** — At least one ambiguous or M22-like transfer body evaluated with explicit declared interpretation before verdict (charter success 5; TP-PS-A6 precedent). *Characteristic:* may be satisfied by TP-PS-A6 re-evaluation under protocol or one new ambiguous body — not global calibration resolution.

5. **Convergent-evidence comparison** — Record whether independent applications reach compatible layer conclusions and pair classifications under the evidence standard documented in [`EVIDENCE-STANDARDS-ANALYSIS.md`](EVIDENCE-STANDARDS-ANALYSIS.md) (charter success 6).

### Should include if feasible without expanding generation scope

6. **At least one body where superficial pattern shape is discriminated from improvement** — A case where pattern-shaped features do not warrant Improvement classification (charter success 3). *Characteristic:* may emerge from new-body holdout; 45-1 had zero superficial-match triggers.

### Must not include (for minimum credible scope)

- SP-01, SP-04, SP-05, SP-06
- Additional domains beyond Marx/Photosynthesis
- Additional material types
- Production injection mechanism testing
- Corpus-wide regression
- Contract or Pattern Library redesign

### Scope size hypothesis

| Dimension | Minimum credible | Not minimum |
| --------- | ---------------- | ----------- |
| **Existing bodies** | 12 (full re-evaluation) | Subsampling without all six pairs risks missing boundary/Marx maintain cases |
| **Independent evaluators** | ≥1 independent of 45-1 session | Same evaluator only = consistency, not repeatability |
| **New bodies** | ≥2 (one per material type) | Zero new bodies fails charter "beyond original experiment" |
| **Patterns** | SP-02, SP-03 only | Additional patterns |
| **Pairs** | Re-classification of 6 pairs + holdout evaluation | New six-pair injection study |

*This is a scope hypothesis — not a designed experiment.*

---

## Risks Of Under-Scoping

| Risk | Consequence |
| ---- | ----------- |
| **Re-score by same evaluator only** | Consistency over time tested; inter-rater repeatability not tested — charter core uncertainty remains |
| **Twelve bodies only, no new bodies** | Fails charter "beyond original six-pair experiment"; generalisation and superficial-match discrimination untested |
| **No independent evaluator** | Cannot distinguish protocol operability from single-session artefact |
| **No boundary-declaration case** | Layer 6 standing unproven beyond TP-PS-A6 workbook record |
| **No convergent-evidence comparison** | Cannot assess whether evidence standard is reproducible |
| **Protocol specification without application** | Charter success 1 alone does not answer whether method is repeatable in use |

Under-scoping produces a **documentation sprint** that does not reduce the repeatability uncertainty that motivated 45.2.

---

## Risks Of Over-Scoping

| Risk | Consequence |
| ---- | ----------- |
| **Additional patterns (D)** | Conflates evaluation repeatability with pattern expansion; violates 45-1 gate and charter exclusions |
| **Additional domains (E)** | Shifts to 45-3 regression question before evaluation standing |
| **Additional material types (F)** | Protocol untested on chartered types first |
| **Full second 45-1 injection experiment** | Tests generation replication, not evaluation repeatability; duplicates 45-1 cost |
| **Large new-body corpus** | Evaluation signal lost in generation collection; delays standing protocol |
| **Resolving M22 globally** | Reopens Sprint 44 calibration — charter forbids |

Over-scoping **delays** the evaluation-standing gate and **dilutes** the frontier question with generation and expansion questions already deferred.

---

## Recommendation

**Keep 45.2 focused on repeatability.**

### Justification (evidence only)

1. **Charter purpose** is whether pattern-aware evaluation is the correct frontier — a repeatability question ([`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md)).

2. **45-1 recommendation** gates further injection on evaluation standing — not on additional generation evidence ([`45-1-recommendation.md`](45-1-recommendation.md)).

3. **Frontier review** ranks pattern-aware evaluation first; expansion candidates (D, E, F) depend on standing evaluation ([`FRONTIER-REVIEW-AFTER-SPRINT-45-1.md`](FRONTIER-REVIEW-AFTER-SPRINT-45-1.md)).

4. **Repeatability analysis** shows operability and internal consistency demonstrated; repeatability and generalisation unproven ([`REPEATABILITY-ANALYSIS.md`](REPEATABILITY-ANALYSIS.md)).

5. **Charter explicitly excludes** D, E, F scope for 45.2.

### Not recommended

| Option | Why |
| ------ | --- |
| **Narrow 45.2** to protocol specification only (no independent application) | Under-scopes; does not test repeatability |
| **Expand 45.2** to additional patterns, domains, or types | Over-scopes; violates charter and 45-1 gate |

### Scope position

**Focused repeatability with minimal generalisation:** B (independent evaluators on twelve bodies) + minimal C (holdout new bodies per material type) + boundary-declaration exercise + convergent-evidence comparison — **not** a second full injection experiment and **not** pattern/domain/type expansion.

---

## Conclusion

### Strongest evidence-supported scope position

Sprint 45.2 requires the **smallest experiment that tests both repeatability and minimal generalisation** of the pattern-aware evaluation stack on the **chartered material types and patterns only** (`decision_table` / SP-02; `transfer_prompt` / SP-03).

**Minimum credible scope characteristics:**

| Component | Role |
| --------- | ---- |
| Written protocol specification | Codifies 45-1 layers for independent use |
| Independent re-evaluation of all twelve 45-1 bodies | Tests inter-rater repeatability and session-artefact risk |
| At least two new bodies (one per type) | Tests generalisation beyond original experiment |
| Boundary-declaration on ambiguous transfer | Tests Layer 6 standing |
| Convergent-evidence agreement analysis | Tests whether evidence standard reproduces |

**Out of minimum scope:** Additional patterns, domains, material types, full six-pair replication, corpus regression, implementation, calibration reopening.

**Confidence:** Operability is **demonstrated**; repeatability is **the correct 45.2 focus**; the minimum experiment above is **hypothesised** to meaningfully reduce uncertainty — not yet **demonstrated** until 45.2 executes.

*One-line summary:* 45.2 should be **repeatability-focused, not expansion-focused** — independent evaluators on the existing twelve bodies plus a **minimal holdout** of new SP-02/SP-03 bodies is the smallest credible scope that can answer the chartered frontier question without duplicating 45-1 or jumping to 45-3.

---

## Traceability

| Section | Primary sources |
| ------- | --------------- |
| Frontier question | `SPRINT-45-2-CHARTER.md` § Candidate Research Question |
| Repeatability terms | `REPEATABILITY-ANALYSIS.md` § Conclusion |
| Candidate assessments | `SPRINT-45-2-CHARTER.md` § What 45.2 Is/Is Not Intended; `FRONTIER-REVIEW-AFTER-SPRINT-45-1.md` |
| Minimum scope | Charter § Success Conditions; `REPEATABILITY-ANALYSIS.md` § Evidence For Repeatability |
| Recommendation | `45-1-recommendation.md`; `PRISM-RESEARCH-ASSET-INVENTORY.md` |
