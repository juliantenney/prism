# Sprint 45.2 Charter

**Date:** 2026-06-18  
**Type:** Research charter — not a sprint design  
**Status:** Proposed — awaiting authorisation to plan  
**Purpose:** Determine whether the next PRISM frontier is correctly identified as **pattern-aware evaluation**  
**Authority:** [SPRINT-45-1-CLOSURE-REVIEW.md](SPRINT-45-1-CLOSURE-REVIEW.md) · [45-1-recommendation.md](45-1-recommendation.md) · [45-1-evidence-workbook.md](45-1-evidence-workbook.md) · [../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) · [../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md)

**Non-goals for this document:** Sprint design · implementation · code · contract redesign · Pattern Library redesign · Sprint 44 reopening

---

## Context

Sprint 44 is closed and authoritative. It made instructional material realisation observable through 44-2 contracts (minimum / strong / failed realisation per material type), a frozen Marx/Photosynthesis benchmark corpus, and the Sprint 44-3 Pattern Library (SP-01–SP-06, FM-01–FM-12) anchored to those contracts.

Sprint 45.1 is complete. The Pattern Injection Experiment tested whether SP-02 (`decision_table`) and SP-03 (`transfer_prompt`) could be deliberately induced in obligation-matched GAM bodies. Six baseline/treatment pairs were collected and evaluated. Recorded outcomes:

| Aggregate | Result |
| --------- | ------ |
| Pairs completed | 6/6 |
| Improvements | 4 (all Photosynthesis remediation) |
| No Change | 2 (Marx maintain-test) |
| Regressions | 0 |
| Ownership regressions | 0 |
| Mimicry suspect | No on all pairs |
| Target FM delta | FM-04, FM-02, FM-03 reduced on remediation pairs |

45-1 answered its primary research question positively within experiment scope: pattern-guided treatment improved 44-2 verdicts on weak Photosynthesis obligations, held Strong on Marx references, reduced target failure modes, and preserved learner ownership without benchmark mimicry.

The frontier after 45-1 is no longer *whether patterns can influence generation at all* — that has controlled positive evidence — but whether the evaluation method that detected those moves can be made **repeatable and generalisable** before further generation experiments expand.

---

## Why Sprint 45.2 Exists

45-1 demonstrated that a verdict-first evaluation stack worked **once** on a fixed six-pair sample. It did **not** establish that the method is standing research infrastructure. Uncertainties remaining after 45-1 that 45-2 is proposed to address:

| Uncertainty | 45-1 status |
| ----------- | ----------- |
| Can pattern-aware evaluation be applied repeatably beyond the original session? | Single evaluator session; independent re-score not recorded |
| Does the method discriminate improvement from superficial pattern-shaped output on new bodies? | Superficial-match control was operational but no false positives observed in-sample |
| Can ownership auditing, FM checks, and anti-mimicry comparison be applied consistently? | All passed in 45-1; consistency across raters or runs unproven |
| Can ambiguous bodies (e.g. M22-like transfer boundaries) be handled without reopening Sprint 44 calibration? | TP-PS-A6 documented in-pair only; standing boundary-handling policy unset |
| Is verdict-first + secondary Detection Signals the correct evaluation layering for generated bodies? | Worked in 45-1; not validated as a formal protocol |

Uncertainties **not** motivating 45-2 (deferred to other slices or out of scope):

- Production injection mechanism (45-1 Q-02; not an evaluation question)
- Corpus-wide regression and non-target material effects (45-3)
- Material-level repair without re-generation (45-4)
- Expansion to SP-01, SP-04, SP-05, SP-06 or additional material types

45-2 exists because 45-1 proved the evaluation method *can work* but not that it *is reliable enough to govern further generation research*.

---

## Candidate Research Question

> Can the 45-1 evaluation method — 44-2 contract verdicts as primary evidence, pattern Detection Signals as secondary corroboration, mandatory FM and ownership checks, corpus-relative anti-mimicry comparison, and explicit boundary declarations where calibration is ambiguous — be formalised into a repeatable pattern-aware evaluation protocol that reliably scores `decision_table` and `transfer_prompt` bodies beyond the original six-pair experiment?

This question tests the **evaluation frontier**, not the **generation frontier**. It asks whether PRISM can stand up a defensible method for judging pattern presence, failure-mode absence, and ownership preservation on generated instructional bodies.

---

## Evidence Motivating 45.2

From 45-1 evidence only (workbook, recommendation, closure review):

**Why evaluation is the bottleneck**

1. **45-1 success depended on the evaluation stack.** All four Photosynthesis improvements were classified from 44-2 verdict deltas, not from Detection Signals alone. The method detected real instructional gains (Minimum/Failed → Strong) aligned with FM clearance.

2. **Detection Signals corroborated but did not drive outcomes.** All six treatment bodies recorded Strong signal profiles, but pair classifications followed verdict ordering. The design explicitly guarded against checklist-only success — a guard that was necessary in principle and untested as a standing protocol.

3. **Discriminating controls were exercised and mattered.** Workbook distinguishes substantive exemplar reasoning from superficial table completion (DT-PS-A4, DT-PS-A6) and substantive transfer scaffolding from transfer-slot presence (TP-PS-A4). These discriminations are evaluation judgements, not generation properties.

4. **Ownership and anti-mimicry were separate audit channels.** Zero ownership regressions and zero mimicry flags across six pairs — but both required explicit reviewer judgement beyond contract scoring.

5. **Boundary handling was procedural, not settled.** TP-PS-A6 required a declared §5.8 minimum interpretation. Treatment improved under that declaration; global M22 calibration was not reopened. A standing evaluation policy for such cases does not yet exist.

**Why generation cannot advance without evaluation standing**

6. **45-1 recommendation gates further injection.** [45-1-recommendation.md](45-1-recommendation.md) recommends proceeding to 45-2 and states: do not expand pattern injection scope until the evaluation method is standing.

7. **Repeatability was not measured.** Single baseline/treatment body per pair; no replication variance; no independent re-score recorded.

*Speculation (not 45-1 evidence):* Whether a formal protocol would improve inter-rater agreement or reduce evaluation time is hypothesised but not demonstrated.

---

## What 45.2 Is Intended To Demonstrate

Precise intended demonstrations — evidence that would need to be collected in a future 45-2 sprint (not designed here):

1. **The 45-1 evaluation layers can be specified as a repeatable protocol** — written procedure sufficient for a reviewer other than the 45-1 session to apply the same verdict-first, signal-secondary, FM, ownership, and anti-mimicry sequence without reopening 44-2 contract text.

2. **The protocol discriminates instructional improvement from cosmetic pattern shape** — on bodies not identical to the 45-1 twelve, reviewers can distinguish verdict-level gain from superficial-match cases using the same controls that were operational in 45-1.

3. **Ownership auditing and anti-mimicry comparison are applicable as standing checks** — not ad hoc session judgements tied to 45-1 workbook familiarity.

4. **Ambiguous transfer bodies can be evaluated with explicit boundary declarations** — following the TP-PS-A6 precedent without altering frozen Sprint 44 corpus verdicts or global calibration.

5. **Pattern-aware evaluation covers the two material types and two patterns validated in 45-1** — `decision_table` (SP-02, §5.6, FM-04) and `transfer_prompt` (SP-03, §5.8, FM-02/FM-03) — as the initial protocol scope.

---

## What 45.2 Is Not Intended To Demonstrate

Explicit exclusions:

| Exclusion | Reason |
| --------- | ------ |
| How pattern guidance reaches a generator | Generation/injection mechanism — 45-1 Q-02; not evaluation |
| Production pipeline, prompts, validators, or code | Implementation — out of charter scope |
| New verdict tiers or contract amendments | 44-2 contracts are closed |
| Pattern Library architecture changes | Sprint 44-3 is closed |
| Resolution of M22 or other Sprint 44 calibration splits | Document per-evaluation only; do not reopen calibration |
| Corpus-wide regression (45-3) | Requires standing evaluation first |
| Material-level repair (45-4) | Downstream of evaluation and generation evidence |
| SP-01, SP-04, SP-05, SP-06 or unevaluated material types | Scope expansion deferred until protocol stands on SP-02/SP-03 |
| That pattern-guided generation always improves output | Generation claim — 45-1 addressed a controlled sample; 45-2 addresses evaluation reliability |
| Universal Strong enforcement or runtime capture gates | Sprint 44-1 / workflow scope |

---

## Relationship To Sprint 44

45-2 **builds on** Sprint 44; it does **not reopen** any closed Sprint 44 decision.

| Sprint 44 artefact | How 45-2 uses it | What 45-2 does not do |
| ------------------ | ---------------- | --------------------- |
| **44-2 contracts** | Primary verdict source (§5.6 `decision_table`, §5.8 `transfer_prompt`); minimum/strong/failed tiers unchanged | Add tiers, rewrite bullets, or relitigate frozen corpus scores |
| **44-3 Pattern Library** | Secondary Detection Signals (SP-02, SP-03); FM checks (FM-04, FM-02, FM-03, FM-01, FM-12); MP-1 ownership as audit convention | Redesign indexes, add patterns, or elevate MP-1–MP-8 above contracts |
| **Benchmark corpus** | Anti-mimicry and corpus-relative comparison anchors (M13, M16 Strong; M12, M14, M19, M22 weak references) | Re-freeze, rescore, or transplant corpus prose |
| **Inter-Rater validation** | Boundary-declaration precedent for ambiguous bodies | Resolve M22 globally or alter historical Pass 2 / Inter-Rater records |
| **Instructional frontier hypothesis** | Evaluation targets material realisation quality | Revisit ownership, salience, investigation-primary, or upstream-pedagogy hypotheses |

Sprint 44 made quality **observable**. 45-1 showed pattern guidance can move observable quality on a sample. 45-2 aims to make the **observation method** reliable — still within the Sprint 44 observability stack, not a replacement for it.

---

## Relationship To Sprint 45.1

| 45-1 output | 45-2 relationship |
| ----------- | ----------------- |
| Six pair outcomes (4 Improvement, 2 No Change) | Proof that the evaluation stack detected real moves; 45-2 asks whether the stack generalises |
| 12 artefact bodies | Potential re-evaluation or holdout material for protocol validation; not assumed sufficient alone |
| Verdict-first + signal-secondary layering | Candidate protocol core — to be formalised, not reinvented |
| Ownership audit results (0 regressions) | Candidate mandatory check — to be specified as standing procedure |
| Anti-mimicry results (0 flags) | Candidate corpus-comparison procedure — to be specified |
| TP-PS-A6 boundary declaration | Candidate template for ambiguous-body handling — not global calibration change |
| Closure recommendation (proceed to 45-2) | Direct predecessor authorisation signal |

45-1 answered: *Can patterns influence generation when deliberately applied?*  
45-2 would answer: *Can we reliably tell whether they did?*

45-2 does not repeat the injection experiment. It treats 45-1's evaluation practice as a hypothesis to be hardened into protocol, not as automatically standing infrastructure.

---

## Risks

| Risk | Description | Grounding |
| ---- | ----------- | --------- |
| **Protocol overfit to 45-1 bodies** | Formalising the method on the same twelve artefacts may confirm familiarity, not generalisability | 45-1 used single bodies per pair with no independent re-score |
| **False confidence from unanimous 45-1 success** | Four improvements and zero regressions may suggest evaluation is easier than it is on noisier generation | All treatment bodies reached Strong; no partial or ambiguous improvement cases in aggregate |
| **Detection Signal drift** | Secondary layer could creep to primary if protocol wording is imprecise | 45-1 design rejected checklist-only success; risk remains if protocol is poorly specified |
| **Boundary proliferation** | Per-evaluation declarations (M22 model) may multiply without reducing ambiguity | TP-PS-A6 handled in-pair; global rule unset |
| **Premature scope creep** | Pressure to add patterns, material types, or implementation hooks before protocol stands | Slice index lists 45-3/45-4 as dependent |
| **Evaluation cost** | Full stack (verdict + signals + FM + ownership + anti-mimicry) may be too heavy for routine use | Not measured in 45-1 |
| **Wrong frontier selection** | If generation variance is the actual bottleneck, standing evaluation may delay more informative work | 45-1 left injection mechanism open; charter treats evaluation as gate per 45-1 recommendation |

*Speculation:* Whether inter-rater disagreement would be material on generated bodies is unknown — 45-1 did not measure it.

---

## Success Conditions

Evidence that would justify saying **45-2 succeeded** and the frontier was correctly identified:

1. **A written pattern-aware evaluation protocol exists** that specifies verdict-first ordering, secondary Detection Signals, FM channels, ownership audit, anti-mimicry comparison, and boundary-declaration rules — without modifying 44-2 or 44-3 authoritative text.

2. **The protocol is applied to bodies beyond the original 45-1 session** — including holdout or newly generated `decision_table` and `transfer_prompt` samples within SP-02/SP-03 scope — with recorded outcomes.

3. **Improvement vs superficial-match discrimination is demonstrated** — at least one case where pattern-shaped output is correctly classified as non-improvement (or explicit documentation that no such case arose and why that is informative).

4. **Ownership and anti-mimicry checks are applied as specified** — with results traceable to protocol steps, not ad hoc judgement.

5. **Ambiguous transfer evaluation uses explicit boundary declarations** — per TP-PS-A6 precedent — without reopening Sprint 44 calibration.

6. **Convergent evidence** — protocol application yields consistent primary verdict + FM + ownership conclusions across the evaluation evidence collected (exact convergence threshold to be set in sprint design, not here).

---

## Failure Conditions

Evidence that would justify saying **the proposed frontier was incorrect** or 45-2 should not proceed as chartered:

1. **The 45-1 evaluation layers cannot be specified reproducibly** — independent reviewers produce incompatible primary verdicts on the same bodies using frozen 44-2 contracts, indicating the problem is contract ambiguity rather than missing protocol.

2. **Detection Signals and contract verdicts systematically diverge** on generated bodies — signals suggest Strong while verdicts remain Minimum/Failed (or vice versa) without resolvable justification, indicating the two-layer model is incoherent.

3. **Superficial pattern shape is indistinguishable from improvement** under protocol — cosmetic table fill or transfer-slot presence passes evaluation despite FM presence or ownership risk.

4. **Ownership or anti-mimicry checks are not operationalisable** as standing procedures — outcomes depend on irreducible reviewer intuition with no documentable criteria.

5. **Evaluation cost or disagreement exceeds utility** — protocol cannot be applied with sufficient agreement to govern further generation research, indicating a different frontier (e.g. corpus regression or injection mechanism) should take priority.

6. **45-1 outcomes were session artefacts** — re-evaluation of the twelve 45-1 bodies under protocol produces materially different pair classifications, undermining the premise that evaluation can be standing.

Failure of 45-2 would **not** invalidate 45-1 generation findings within their stated scope; it would indicate that pattern-aware evaluation is not the correct next frontier, or that the charter requires refinement before planning.

---

## Recommendation

**Proceed with Sprint 45.2 planning.**

**Rationale (evidence-based):**

- 45-1 met all experiment-level success criteria and recommended proceeding to 45-2 ([45-1-recommendation.md](45-1-recommendation.md)).
- The closure review identifies repeatability and generalisability of the evaluation method as the **first priority** frontier after 45-1 ([SPRINT-45-1-CLOSURE-REVIEW.md](SPRINT-45-1-CLOSURE-REVIEW.md)).
- 45-1 demonstrated that verdict-first evaluation with secondary signals, FM checks, ownership audit, and anti-mimicry comparison **detected real instructional moves** — but explicitly did not demonstrate standing protocol, independent re-score, or application beyond six pairs.
- Sprint 44-2 and 44-3 supply closed authoritative inputs; 45-2 consumes them without redesign — consistent with all reopening constraints.
- Alternative frontiers (corpus regression, repair, injection mechanism) are either dependent on standing evaluation (45-3, 45-4) or address a different question (production injection).

**Not recommended at this time:**

- *Refine the charter before planning* — the research question, scope boundaries, and success/failure conditions are sufficiently grounded in 45-1 evidence; refinement would be warranted only if authorisation is withheld on specific scope grounds.
- *Select a different frontier* — no 45-1 evidence suggests generation injection or corpus regression should precede evaluation formalisation; 45-1 explicitly gates injection expansion on evaluation standing.

**Authorisation required:** This charter does not approve sprint execution. Explicit user authorisation is needed before 45-2 design begins.

---

## Traceability

| Document | Role in this charter |
| -------- | -------------------- |
| [SPRINT-45-1-CLOSURE-REVIEW.md](SPRINT-45-1-CLOSURE-REVIEW.md) | Frontier shift, demonstrated limits, next-question framing |
| [45-1-recommendation.md](45-1-recommendation.md) | Proceed-to-45-2 gate, pair aggregates, success/failure criteria |
| [45-1-evidence-workbook.md](45-1-evidence-workbook.md) | Primary evidence for evaluation method behaviour |
| [sprint-44-2-instructional-depth-contracts.md](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) | Closed contract authority for primary verdicts |
| [sprint-44-3-instructional-pattern-library.md](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) | Closed pattern/FM authority for secondary layer |
| [sprint-45-slice-index.md](sprint-45-slice-index.md) | Proposed 45-2 scope sketch (superseded by this charter for authorisation purposes) |
