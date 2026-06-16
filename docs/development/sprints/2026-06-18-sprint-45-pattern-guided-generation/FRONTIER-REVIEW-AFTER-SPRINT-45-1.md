# Frontier Review: After Sprint 45.1

**Date:** 2026-06-18  
**Type:** Evidence-grounded frontier analysis — not sprint planning  
**Purpose:** Determine how the PRISM research frontier changed between Sprint 44 closure and Sprint 45.1 closure  
**Authority:** [sprint-44-review.md](../2026-06-15-sprint-44/sprint-44-review.md) · [sprint-44-outcomes.md](../2026-06-15-sprint-44/sprint-44-outcomes.md) · [sprint-45-proposal.md](../2026-06-15-sprint-44/sprint-45-proposal.md) · [SPRINT-45-1-CLOSURE-REVIEW.md](SPRINT-45-1-CLOSURE-REVIEW.md) · [SPRINT-45-2-CHARTER.md](SPRINT-45-2-CHARTER.md) · [pattern-aware-evaluation-position-paper.md](pattern-aware-evaluation-position-paper.md)

**Non-goals:** Sprint planning · implementation · architecture proposals · redesign

---

## Frontier At Sprint 44 Closure

At Sprint 44 closure ([`sprint-44-review.md`](../2026-06-15-sprint-44/sprint-44-review.md), [`sprint-44-outcomes.md`](../2026-06-15-sprint-44/sprint-44-outcomes.md)), PRISM had completed the **observability layer** for instructional material quality. Sprint 43 architecture remained settled. The active quality gap was framed as **instructional material realisation** — whether learner-facing materials perform their educational function.

### Major unresolved questions at Sprint 44 closure

| # | Question | Source |
| - | -------- | ------ |
| 1 | **Do evidence-backed patterns improve GAM generation?** | Sprint 44 Remaining Uncertainties: "Patterns → generation — No experiment yet whether patterns improve GAM output" |
| 2 | **Can pattern guidance be measured with the Sprint 44 rubric?** | [`sprint-45-proposal.md`](../2026-06-15-sprint-44/sprint-45-proposal.md) 45-2 workstream |
| 3 | **Does pattern guidance generalise or overfit Marx?** | Sprint 45 proposal 45-3 |
| 4 | **Can failed bodies be repaired without full workflow re-run?** | Sprint 45 proposal 45-4 |
| 5 | **What is the runtime effect of the 44-1 capture gate?** | Sprint 44 Remaining Uncertainties: "44-1 implementation impact — Gate designed; runtime effect not measured" |
| 6 | **How should Strong/Minimum calibration boundaries be resolved?** | M2, Marx checklists, M1/M23/M22 — documented, not resolved |
| 7 | **What patterns apply to unevaluated material types?** | Five 44-2 types without Pattern Library v1 entries |
| 8 | **Can failure modes and patterns be detected or enforced automatically?** | Sprint 44: "Automated detection / repair — explicitly out of scope; not implemented" |

### What Sprint 44 had settled

- 44-2 contracts discriminate on frozen corpus (Strong / Minimum / Failed spread).
- Instructional material realisation is the principal quality gap (not missing workflow stages or upstream pedagogy).
- Pattern Library Draft 1 (SP-01–SP-06) is evidence-backed and authorised.
- Benchmark corpus supports reproducible human evaluation.
- Capture and composition are separate channels (FM-01, FM-12).

### Proposed next frontier at Sprint 44 closure

[`sprint-45-proposal.md`](../2026-06-15-sprint-44/sprint-45-proposal.md) proposed **Pattern-Guided Generation** — experiment with whether patterns can influence pipeline output, still evaluated through 44-2 contracts. Workstreams 45-1 through 45-4 were proposed but **not approved**.

---

## Frontier At Sprint 45.1 Closure

After Sprint 45.1 ([`SPRINT-45-1-CLOSURE-REVIEW.md`](SPRINT-45-1-CLOSURE-REVIEW.md)), the frontier has **shifted within** pattern-guided generation research. The headline question at Sprint 44 closure — *can patterns influence generation at all?* — has **positive controlled evidence** on six obligation-matched pairs (SP-02, SP-03; `decision_table`, `transfer_prompt`; Marx + Photosynthesis).

### Major questions remaining after 45.1 closure

| Priority | Question | Status after 45.1 |
| -------- | -------- | ----------------- |
| 1 | **Can pattern-aware evaluation be formalised and applied repeatably?** | Method worked once; not standing ([SPRINT-45-2-CHARTER](SPRINT-45-2-CHARTER.md)) |
| 2 | **Do generation improvements replicate beyond one experiment run?** | Single body per pair; no replication variance |
| 3 | **Does generation improve corpus-wide without non-target regression?** | 45-3 scope; not tested |
| 4 | **When should additional patterns (SP-01, SP-04–SP-06) enter injection?** | Deferred pending evaluation standing |
| 5 | **How is M22-like calibration ambiguity handled in standing policy?** | Documented per-pair (TP-PS-A6); global rule unset |
| 6 | **What mechanism injects patterns into production generation?** | Explicitly open in 45-1 design (Q-02) |
| 7 | **44-1 runtime capture gate impact** | Unchanged — not stress-tested in 45-1 |
| 8 | **Unevaluated material types, automated detection/repair** | Unchanged from Sprint 44 |

The **active quality frontier** remains instructional material realisation. The **active research frontier** has moved from *making quality observable* (Sprint 44) and *testing whether patterns can move it* (45-1, answered in scope) to *making the observation method reliable enough to govern further generation research* (pattern-aware evaluation).

---

## Questions Resolved By 45.1

Evidence only — from [`45-1-evidence-workbook.md`](45-1-evidence-workbook.md), [`45-1-recommendation.md`](45-1-recommendation.md), and closure review.

| Question | Resolution | Evidence |
| -------- | ---------- | -------- |
| Can SP-02 be deliberately induced to improve `decision_table` verdicts on weak obligations? | **Yes, in scope** | DT-PS-A4, DT-PS-A6: Minimum → Strong; FM-04 reduced |
| Can SP-03 be deliberately induced to improve `transfer_prompt` verdicts on weak obligations? | **Yes, in scope** | TP-PS-A4: Failed → Strong; TP-PS-A6: Failed → Strong (declared interpretation); FM-02/FM-03 reduced |
| Can pattern guidance hold Strong on already-Strong Marx references? | **Yes, in scope** | DT-MRX-A4, TP-MRX-A4: Strong → Strong; no FM introduction |
| Can pattern-guided treatment preserve learner ownership? | **Yes, in scope** | 0 ownership regressions across six treatment bodies |
| Can pattern-guided improvement occur without benchmark mimicry? | **Yes, in scope** | Mimicry suspect = no on all six pairs |
| Are FM-04, FM-02, FM-03 actionable remediation targets? | **Yes, in scope** | All three reduced on at least one remediation pair |
| Are Photosynthesis weak shapes remediable (not immutable)? | **Yes, in scope** | 4/4 Photosynthesis pairs improved |
| Is verdict-first + secondary Detection Signals operable for generation experiments? | **Yes, in scope** | Pair classifications followed verdict ordering; signals corroborated on all six treatments |
| Can M22-like ambiguity be handled without reopening Sprint 44 calibration? | **Yes, in-pair** | TP-PS-A6: explicit boundary declaration; frozen M22 unchanged |

*Not resolved:* whether patterns improve generation **generally**, **reproducibly**, or **at production scale**. 45-1 resolved the controlled experiment question within its defined scope only.

---

## Questions Narrowed By 45.1

Questions that remain open but are now **better constrained** by 45-1 evidence.

| Question | How 45-1 narrowed it |
| -------- | -------------------- |
| **Do patterns improve GAM generation?** | Narrowed to: SP-02 and SP-03 improve matched obligations when deliberately applied. Broader pattern set and injection mechanism still open. |
| **Does pattern guidance generalise or overfit Marx?** | Narrowed to: Photosynthesis remediation succeeded (4/4) alongside Marx maintain-test (2/2). Full corpus regression (45-3) still required for distribution-level claims. |
| **Can improvement be measured with Sprint 44 rubric?** | Narrowed to: yes, with **additional layers** — FM checks, ownership audit, anti-mimicry, boundary declarations. Contract verdict alone is insufficient for generation research (position paper). |
| **Is table structure sufficient for Strong?** | Narrowed: **No** — DT-PS baselines had valid structure + Minimum + FM-04; treatment required partial-exemplar reasoning. |
| **Is transfer-slot presence sufficient?** | Narrowed: **No** — TP-PS-A4 baseline occupied slot + Failed + FM-02/FM-03. |
| **Does Marx Strong predict Photosynthesis remediation?** | Narrowed: **No** — Marx No Change did not predict Photosynthesis outcome; each pair required independent evidence. |
| **Can Detection Signals substitute for contract verdict?** | Narrowed: design rejected checklist-only success; 45-1 did not observe false positives in-sample, but verdict primacy was necessary to classify improvements. |
| **When should SP-01, SP-04–SP-06 enter injection?** | Narrowed: after evaluation method is standing (45-1 recommendation gates expansion). |

---

## Questions Unchanged

Questions **unaffected** by 45-1 — same status as at Sprint 44 closure.

| Question | Why unchanged |
| -------- | ------------- |
| **44-1 runtime capture gate impact on capture quality** | FM-01/FM-12 absent on all 45-1 bodies; capture channel not stress-tested |
| **Global resolution of Strong/Minimum calibration** (M2, Marx checklists, M1, M23, M22) | TP-PS-A6 documented in-pair only; historical records unchanged |
| **Patterns for unevaluated material types** (`modelling_note`, `misconception_note`, `sample_output`, `rubric`, `quality_criteria`) | 45-1 scope: SP-02/SP-03 only |
| **Automated detection / repair of failure modes** | Out of 45-1 scope; no new evidence |
| **Template / independent_judgement pattern (TM-SP-01)** | Not authored in Sprint 44; not addressed in 45-1 |
| **FM-08 applied exposition bridge stability** | Pass 1 only in Sprint 44; not revisited |
| **Page-composition channel (FM-12) as separate quality problem** | Not stress-tested in 45-1 |
| **Ownership model, salience model, investigation-primary architecture** | Explicitly not reopened |
| **Missing-stage / missing-upstream-pedagogy hypotheses** | Not reopened; 45-1 improved bodies without changing DLA obligations or upstream pedagogy |

---

## New Questions Created By 45.1

Questions that **did not exist** (or were not prioritised) at Sprint 44 closure.

| # | New question | Origin |
| - | ------------ | ------ |
| 1 | **Can the 45-1 multi-layer evaluation method become standing research infrastructure?** | Emerged from experiment practice; named *pattern-aware evaluation* (position paper); chartered as 45-2 |
| 2 | **How do reviewers discriminate substantive instructional moves from cosmetic pattern shape?** | DT-PS-A4/A6 exemplar reasoning vs table shell; TP-PS-A4 scaffolding vs slot presence |
| 3 | **Must ownership be audited independently of contract verdict?** | TP-PS-A4 baseline: ownership pass + Failed verdict |
| 4 | **Must anti-mimicry be assessed separately from Strong-reference proximity?** | All pairs required corpus comparison; zero mimicry flags |
| 5 | **What is the minimum treatment feature set per FM?** | Partial exemplar only vs full Strong signal set — not isolated in 45-1 |
| 6 | **Will verdict improvements replicate across independent generation runs?** | Single baseline/treatment per pair |
| 7 | **Can pattern-aware evaluation be applied consistently by multiple raters?** | Single evaluator session |
| 8 | **Do non-target materials regress when pattern guidance targets specific slots?** | 45-3 question; not testable from 45-1 pair design |
| 9 | **Does pattern guidance degrade under capture-channel stress?** | FM-01 stub, FM-12 composition loss not observed in 45-1 sample |

At Sprint 44 closure, the proposed next step was generation experimentation (45-1). After 45-1, a **second-order evaluation question** now leads the frontier queue — evaluation reliability as prerequisite for trustworthy generation claims.

---

## Shift In Project Centre Of Gravity

### Sprint 44 closure

**Centre of gravity:** Make instructional quality **observable, measurable, and reusable** on a frozen benchmark corpus.

- Primary activity: contract evaluation → pattern extraction
- Primary artefact: 44-2 contracts + Pattern Library v1
- Primary question: *What quality shapes exist?*

### Sprint 45.1 closure

**Centre of gravity:** Determine whether **pattern-guided generation can move** observable quality — and whether the **method that judges that move** is trustworthy.

- Primary activity: controlled injection experiment + multi-layer evaluation
- Primary artefact: 45-1 evidence workbook (12 bodies, 6 pair outcomes)
- Primary question (answered in scope): *Can patterns influence generation when deliberately applied?*
- Emerging secondary question (now leading): *Can we reliably tell whether they did?*

### Assessment

The project focus **shifted along the evidence chain**, not across architectural layers:

```text
Sprint 43:  architecture (who owns the learner experience)
     ↓
Sprint 44:  observability (what quality shapes exist on frozen corpus)
     ↓
Sprint 45.1: influence (can patterns move quality on generated bodies)
     ↓
Emerging:   evaluation reliability (can we trust claims about influence)
```

The **quality layer** (instructional material realisation) is unchanged. The **research modality** moved from descriptive corpus science to experimental generation science — which exposed an evaluation gap contract scoring alone does not close.

*Interpretation:* Centre of gravity did **not** return to Sprint 43 architecture, workflow stages, or upstream pedagogy. It advanced **deeper into material realisation** with a new dependency on evaluative method, not a new architectural hypothesis.

---

## Research Trajectory

| Sprint | Layer addressed | Core question | Primary method | Key outcome |
| ------ | --------------- | ------------- | -------------- | ----------- |
| **Sprint 43** | Educational architecture | How should a self-directed resource be owned, structured, and manifested? | Cross-domain architecture testing (Marx, Photosynthesis) | Investigation-primary ownership settled; architecture generalises; material realisation identified as remaining gap |
| **Sprint 44** | Instructional observability | What must each material type achieve, and what shapes appear on benchmarks? | 44-2 contract evaluation (3 passes + inter-rater) on frozen corpus | Contracts discriminate; FMs named; SP-01–SP-06 extracted; quality made observable |
| **Sprint 45.1** | Pattern-guided influence | Can deliberate pattern application improve generated bodies on matched obligations? | Obligation-matched baseline/treatment pairs; multi-layer evaluation | 4 improvements, 2 no-change, 0 regressions; FM clearance; ownership preserved; pattern-aware evaluation concept emerged |

### Direction of travel

1. **From structure to function** — Sprint 43 (structure) → Sprint 44 (function observability) → Sprint 45.1 (function influence).
2. **From frozen to generated evidence** — Sprint 44 scored historical captures; 45-1 scored deliberately guided generation on identical obligations.
3. **From single-layer to multi-layer judgement** — Sprint 44 contract verdicts sufficed for corpus characterisation; 45-1 required verdict + FM + ownership + anti-mimicry convergence.
4. **From description to experimentation** — Sprint 44 asked what exists; 45-1 asked what changes when patterns are applied.
5. **From generation hypothesis to evaluation hypothesis** — Sprint 44 deferred patterns→generation; 45-1 partially answered it; frontier now prioritises evaluation standing before expansion.

The trajectory is **progressively operationalising the instructional realisation frontier** — not revisiting architectural foundations.

---

## Candidate Frontiers

Ranked by **evidence support** from Sprint 44 closure, 45-1 outcomes, 45-1 recommendation, 45-2 charter, and position paper. Rank reflects which frontier is most **directly warranted by recorded evidence**, not implementation ease.

| Rank | Frontier | Evidence support | Dependency |
| ---- | -------- | ---------------- | ---------- |
| **1** | **Pattern-aware evaluation (45-2)** | 45-1 recommendation: proceed to 45-2. Closure review: first priority. Charter: method worked once, repeatability unproven. Position paper: concept named from 45-1 practice. Gates further injection per 45-1 recommendation. | Consumes Sprint 44 artefacts unchanged |
| **2** | **Generation replication / expanded injection** | 45-1 positive in scope; charter explicitly gates expansion until evaluation standing. Open: replication variance, additional patterns, injection mechanism (Q-02). | Depends on Rank 1 or accepts higher epistemic risk |
| **3** | **Corpus regression (45-3)** | Sprint 45 proposal; closure review lists as priority 3. Not tested in 45-1. Requires reliable scoring of generated bodies across corpus. | Depends on Rank 1 |
| **4** | **Material-level repair (45-4)** | Sprint 45 proposal; 45-1 showed FMs are remediable via re-generation, not repair. Repair path untested. | Depends on evaluation method + generation evidence |
| **5** | **44-1 runtime capture gate measurement** | Sprint 44 deferred; unchanged by 45-1. Complementary to quality research but no new evidence from 45-1. | Parallel track |
| **6** | **Calibration boundary resolution** (M22 global, M2, etc.) | Documented in Sprint 44 and TP-PS-A6; 45-1 handled in-pair without resolution. Lower urgency than evaluation standing. | Risk of reopening closed calibration |
| **7** | **Unevaluated material types / automated enforcement** | Open since Sprint 44; no 45-1 evidence. Lowest immediate support. | Requires evaluation + generation evidence on evaluated types first |

*Speculation:* Rank 2 might leapfrog Rank 1 if stakeholders accept epistemic risk on generation claims without standing evaluation. No 45-1 evidence supports that sequencing.

---

## Recommendation

**The strongest current frontier is pattern-aware evaluation (45-2).**

### Why

1. **Direct 45-1 evidence.** The experiment succeeded in part because a multi-layer evaluation stack detected real instructional moves. The same evidence records that this stack was applied **once**, by **one session**, on **six pairs** — repeatability unproven ([SPRINT-45-1-CLOSURE-REVIEW](SPRINT-45-1-CLOSURE-REVIEW.md) § Remaining Uncertainties; [SPRINT-45-2-CHARTER](SPRINT-45-2-CHARTER.md) § Why Sprint 45.2 Exists).

2. **Explicit gate from 45-1.** [`45-1-recommendation.md`](45-1-recommendation.md) recommends proceeding to 45-2 and states that pattern injection scope should not expand until the evaluation method is standing.

3. **Frontier shift is evidence-based, not speculative.** Before 45-1: *Can patterns influence generation?* After 45-1: positive controlled answer in scope. The unanswered question with highest evidence coupling is whether the observation method generalises — not whether SP-02/SP-03 can work again on the same twelve bodies.

4. **Downstream frontiers depend on it.** Corpus regression (45-3), expanded injection, and repair exploration (45-4) all require trustworthy scoring of generated bodies. Without standing evaluation, generation claims carry unquantified epistemic risk (charter failure conditions).

5. **Consistent with Sprint 44 → 45 trajectory.** Sprint 44 built observability infrastructure. 45-1 used it experimentally. The natural next step is to harden the **evaluative instrument** before scaling the **generative experiment** — analogous to Sprint 44 validating contracts before authorising the Pattern Library.

6. **Does not reopen closed decisions.** Pattern-aware evaluation consumes 44-2 contracts, 44-3 patterns, and 45-1 evidence without redesigning architecture, contracts, or calibration records.

### What this recommendation is not

- Not approval to plan or execute 45-2 (charter awaits authorisation).
- Not a claim that generation research should stop — only that further injection expansion is **evidence-gated**.
- Not a ranking of implementation priority for 44-1 runtime work, which remains a parallel deferred question from Sprint 44.

**Summary:** Between Sprint 44 closure and Sprint 45.1 closure, PRISM moved from asking whether quality is observable to demonstrating that pattern guidance can move quality on a controlled sample — and discovered that **trustworthy observation of that move** is now the binding constraint on further research. Pattern-aware evaluation is the frontier with the strongest evidence support.

---

## Traceability

| Section | Primary sources |
| ------- | --------------- |
| Sprint 44 closure frontier | `sprint-44-review.md` § Remaining Uncertainties; `sprint-44-outcomes.md`; `sprint-45-proposal.md` |
| Sprint 45.1 closure frontier | `SPRINT-45-1-CLOSURE-REVIEW.md` § Frontier After 45-1 |
| Resolved / narrowed / new questions | `SPRINT-45-1-CLOSURE-REVIEW.md`; `45-1-recommendation.md` |
| Centre of gravity / trajectory | `sprint-44-review.md`; `pattern-aware-evaluation-position-paper.md` § Background |
| Candidate ranking | `SPRINT-45-2-CHARTER.md`; `sprint-45-proposal.md`; `45-1-recommendation.md` |
