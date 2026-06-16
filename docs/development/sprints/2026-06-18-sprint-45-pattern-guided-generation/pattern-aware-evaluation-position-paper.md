# Pattern-Aware Evaluation: Position Paper

**Date:** 2026-06-18  
**Type:** Conceptual position paper — not a sprint design, protocol, or implementation proposal  
**Status:** Draft for Sprint 45.2 authorisation context  
**Authority:** [sprint-44-2-instructional-depth-contracts.md](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) · [sprint-44-3-instructional-pattern-library.md](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) · [45-1-evidence-workbook.md](45-1-evidence-workbook.md) · [45-1-recommendation.md](45-1-recommendation.md) · [SPRINT-45-1-CLOSURE-REVIEW.md](SPRINT-45-1-CLOSURE-REVIEW.md) · [SPRINT-45-2-CHARTER.md](SPRINT-45-2-CHARTER.md)

**Non-goals:** Protocol design · implementation · architecture redesign · contract redesign · Pattern Library redesign

---

## Background

PRISM's instructional quality frontier was established across three closed layers before Sprint 45.

**Sprint 43** stabilised educational architecture: investigation-primary ownership, resource-secondary ownership, activity and material support structures, and learner-facing manifestation. Cross-domain testing (Marx, Photosynthesis) suggested the architecture generalises. Remaining quality limitations appeared in **instructional material realisation** — whether materials perform their educational function — rather than in ownership or sequencing.

**Sprint 44** made that realisation layer observable. Sprint 44-2 defined instructional depth contracts for eleven learner-facing material types: educational purpose, minimum realisation, strong realisation, and failure modes, with verdict tiers (Failed / Minimum / Strong). Sprint 44-3 extended those contracts with an Instructional Pattern Library — reusable strong shapes (SP-01–SP-06), named failure modes (FM-01–FM-12), and Detection Signals anchored to specific §5.x contract sections. A frozen Marx/Photosynthesis benchmark corpus supplied contrast exemplars. Three evaluation passes and inter-rater validation scored historical bodies against contracts.

**Sprint 45.1** shifted from observing frozen corpus quality to testing whether pattern guidance can **influence** generated bodies. The Pattern Injection Experiment applied SP-02 (`decision_table`) and SP-03 (`transfer_prompt`) to six obligation-matched baseline/treatment pairs. Recorded outcomes: 4 Improvements (Photosynthesis remediation), 2 No Change (Marx maintain-test), 0 Regressions, 0 ownership regressions, 0 mimicry flags. Target failure modes FM-04, FM-02, and FM-03 reduced on remediation pairs.

Sprint 45.1 is complete. Sprint 45.2 is chartered to determine whether **pattern-aware evaluation** — the evaluative concept that emerged during 45-1 — should become standing research infrastructure. This paper defines that concept. It does not design the sprint that would test it.

---

## The Problem

Contract evaluation alone was **sufficient for Sprint 44** because Sprint 44's task was to make instructional quality observable on a **fixed, historically captured corpus**. Reviewers scored known bodies against 44-2 minimum/strong/failed criteria, documented failure modes, and derived patterns from contrast exemplars. The question was: *What quality shapes exist, and can reviewers agree on them?* Contract verdicts were the right primary evidence for that question.

Contract evaluation alone became **insufficient for interpreting Sprint 45.1** because 45-1's task was different: *Did deliberate pattern guidance cause instructional improvement on generated bodies, and can we trust that improvement?* Several gaps appeared that contract scoring alone does not close.

**1. Cosmetic shape vs instructional gain.** Sprint 44 already showed that valid structure does not imply strong realisation. Photosynthesis M12 and M19 scored Minimum with FM-04 despite proper tables and empty learner cells. In 45-1, DT-PS-A4 baseline had valid table structure but Minimum + FM-04; treatment reached Strong only when partial-exemplar **reasoning** was added — not when a cell was merely filled. TP-PS-A4 baseline occupied a transfer slot but scored Failed; treatment reached Strong through learner-context selection and substantive scaffolding, not slot presence alone. A contract verdict captures the outcome; it does not by itself explain whether an observed change is a genuine instructional move or a superficial pattern-shaped artefact.

**2. Pattern influence is a causal claim, not a corpus description.** Sprint 44 asked what shapes exist in benchmark materials. Sprint 45.1 asked whether applying SP-02/SP-03 moves bodies toward those shapes on identical DLA obligations. That requires paired comparison, failure-mode tracking, and discrimination between improvement and no-change — not single-body contract scoring in isolation.

**3. Ownership and mimicry are independent risks.** Sprint 44 contracts include scaffold ≠ deliverable principles, but 45-1 showed a body can pass ownership audit while failing instructionally (TP-PS-A4 baseline: ownership pass, Failed verdict). Conversely, pattern-guided treatment can approach Strong-reference feature sets without violating ownership (all six treatment bodies: ownership pass). Contract verdicts do not separately attest that learner loci remain empty or that improvements are not benchmark transplants.

**4. Ambiguous calibration requires explicit handling.** Sprint 44 inter-rater validation documented boundary variance (e.g. M22). TP-PS-A6 in 45-1 required a declared §5.8 minimum interpretation before scoring. Contract text alone does not specify which reading applies in a given evaluation without a documented boundary declaration.

**5. Multiple evidence channels must converge.** 45-1 success criteria required contract improvement **and** target FM absence **and** ownership preservation **and** anti-mimicry clearance **and** (secondarily) Detection Signal presence. No single layer was sufficient to classify pair outcomes.

*Interpretation:* Sprint 44 contract evaluation remains necessary but not sufficient when the research question shifts from corpus characterisation to pattern-guided generation assessment. Pattern-aware evaluation names the multi-layer evaluative concept that 45-1 operationalised in practice.

---

## What Is Pattern-Aware Evaluation?

**Pattern-aware evaluation** is the evaluative stance of judging a learner-facing GAM material body by converging multiple evidence layers — with **44-2 contract verdict as primary normative evidence** — when the research question concerns whether instructional patterns are present, whether documented failure modes are absent, whether learner ownership is preserved, and whether observed quality moves are genuine rather than cosmetic or mimetic.

More precisely, pattern-aware evaluation:

1. **Scores the body against the authoritative 44-2 contract** for its material type (Failed / Minimum / Strong), with justification citing contract bullets — not pattern names alone.

2. **Uses pattern Detection Signals as secondary corroboration** — observational indicators from the Pattern Library that a strong or minimum shape is present, without elevating signals above the contract verdict.

3. **Checks named failure modes** — instructional FMs linked to the material type and pattern, distinguished from capture-channel artefacts (FM-01 stub, FM-12 composition loss).

4. **Audits learner ownership independently** — whether author scaffolding models a move without completing learner-assigned output (MP-1 / scaffold ≠ deliverable).

5. **Compares corpus-relative proximity** — whether the body approaches Strong-reference instructional function without mimicking frozen benchmark prose or inappropriately transplanting cross-domain content.

6. **Declares calibration boundaries explicitly** when contract application is ambiguous — documenting which interpretation governs that evaluation without reopening Sprint 44 historical records.

Pattern-aware evaluation applies to **GAM body text** as the instructional evidence surface. It is an educational judgement method. It emerged from 45-1 practice; it is not yet a standing protocol.

---

## What Pattern-Aware Evaluation Is Not

| Mischaracterisation | Why it is incorrect |
| ------------------- | ------------------- |
| **Contract replacement** | 44-2 contracts remain normative and primary. Patterns extend contracts; they do not supersede them (44-3: "When an MP appears to conflict with a 44-2 §5.x contract, the contract governs"). |
| **Pattern scoring** | Detection Signals are not a checklist that can declare success independently of contract verdict. 45-1 explicitly rejected checklist-only success; pair classifications followed verdict ordering. |
| **Prompt evaluation** | Pattern-aware evaluation judges realised **material bodies**, not prompt wording, generator configuration, or workflow instructions. |
| **Implementation evaluation** | It does not assess validators, renderers, capture gates, or code paths. FM-01/FM-12 are recorded under capture channel when relevant but are not conflated with instructional FMs (45-1 workbook instruction). |

*Speculation:* Pattern-aware evaluation is also not, by itself, a quality gate for production deployment. 45-1 tested a research sample; standing use in workflow is unproven.

---

## Relationship To 44-2 Contracts

44-2 contracts remain **normative** — the authoritative statement of what each material type must achieve educationally.

Evidence for this relationship:

- Sprint 44-2 defines contracts as the layer that makes implicit instructional expectations explicit for reviewers (§1, §2).
- Sprint 44-3 states patterns supply reusable shapes that **satisfy** contracts; they do not replace or restate contract text.
- 45-1 workbook instructions require verdict justification citing §5.6 or §5.8 bullets, not pattern names alone.
- All six 45-1 pair classifications were driven by contract verdict deltas (Minimum/Failed → Strong, or Strong → Strong).

Pattern-aware evaluation **depends on** contracts; it does not amend them. The contract verdict answers: *Does this body meet minimum, strong, or failed realisation for its material type?* Pattern-aware evaluation adds surrounding evidence layers to interpret that verdict in pattern-influence research — especially whether an improvement is trustworthy, ownership-safe, and non-mimetic.

When contract and pattern signals align (as on all six 45-1 treatment bodies), corroboration strengthens confidence. When they diverge — a case 45-1 did not observe but 45-2 charter identifies as a failure risk — the contract verdict governs.

---

## Relationship To Detection Signals

Detection Signals are **secondary evidential indicators** drawn from authored pattern entries (e.g. SP-02 § Detection Signals; SP-03 § Detection Signals). They describe observable features associated with minimum, strong, or failed pattern realisation — partial exemplar row present, learner-context selection framing, operational completion criterion, and similar.

Their evidential role in pattern-aware evaluation:

| Role | Evidence from 45-1 |
| ---- | ------------------ |
| **Corroborate** contract verdicts | All six treatment bodies recorded Strong signal profiles alongside Strong verdicts. |
| **Diagnose** weakness shape | BL-TP-PS-A4 recorded Failed signal profile matching Failed verdict. BL-DT-PS-A4/A6 recorded Minimum-only signals matching Minimum + FM-04. |
| **Flag superficial match risk** | 45-1 design included superficial-match flags; treatment flags were `no` on scored pairs. Signals help distinguish pattern-shaped output from verdict-level improvement. |
| **Must not override** primary verdict | Pair outcomes followed verdict ordering; no pair improved on signals alone without verdict rise. |

*Interpretation:* Detection Signals answer a different question than contracts: *Does the body exhibit features associated with a named strong/minimum/failed pattern shape?* That is informative but subordinate. A body could theoretically exhibit strong signals while failing contract minimum (not observed in 45-1 treatments) or lack signals while meeting minimum (possible for minimum realisation without strong pattern). Pattern-aware evaluation holds signals in this secondary role deliberately.

---

## Relationship To Failure Modes

Failure modes complement pattern observation by naming **documented ways materials fail** their instructional function, independent of whether a pattern checklist is partially satisfied.

44-3 indexes instructional failure modes per material type: FM-04 for `decision_table` (table shell without partial exemplar); FM-02 and FM-03 for `transfer_prompt` (thin body; third-person procedural transfer). Capture artefacts FM-01 and FM-12 are documented separately and scored under capture channel, not conflated with instructional FMs (45-1 workbook instruction).

In pattern-aware evaluation, failure-mode analysis:

- **Tracks targeted FMs** associated with the pattern under test (45-1: FM-04 for SP-02; FM-02/FM-03 for SP-03).
- **Records presence/absence independently** of verdict tier — a body can be Minimum with FM-04 (M12, M19, DT-PS baselines) or Failed with FM-02/FM-03 (M14, TP-PS-A4 baseline).
- **Supplies paired delta evidence** — 45-1 remediation pairs showed FM clearance coinciding with verdict improvement (FM-04: 2→0; FM-02: 1→0; FM-03: 2→0 aggregate).

Failure modes answer: *Which named instructional failures are present?* They do not replace contract verdicts — FM presence informs diagnosis; verdict tier states overall realisation. Together they explain **why** a body is weak (FM-04: structure without modelling) and **how much** it achieves (Minimum vs Failed).

---

## Relationship To Ownership Audits

Learner ownership remains an **independent constraint** — a body can satisfy structural contract minimum while violating ownership, or fail instructionally while preserving ownership.

Sprint 44 encodes ownership in cross-cutting principles (scaffold ≠ deliverable; criteria before judgement; own-context transfer) and in MP-1 (Pattern Library Meta-Principles). 45-1 treated ownership as a separate audit channel with regression as an override condition.

Evidence from 45-1:

- All six treatment bodies: ownership pass, no regression.
- DT-PS-A4/A6 treatments modelled evidence/reason cells while *Correct/Incorrect* and *Impact* judgement loci remained empty.
- TP-PS-A4/A6 treatments scaffolded transfer production without pre-written learner responses.
- TP-PS-A4 **baseline**: ownership pass, Failed verdict — demonstrating instructional failure and ownership pass are separable judgements.

Pattern-aware evaluation audits ownership because pattern guidance risks **scaffold-to-deliverable collapse** — filling learner judgement cells, supplying completed transfer essays, or pre-rating options. A Strong contract verdict on a body that regresses ownership would not constitute successful pattern realisation under 45-1 success criteria. Ownership audit answers: *Does author support remain scaffolding, not deliverable completion?*

---

## Relationship To Anti-Mimicry Analysis

Pattern presence alone is **insufficient evidence** of successful pattern-guided improvement because a body can reproduce Strong-reference surface features — table layout, word bands, bullet structure — by copying benchmark shape or cross-domain transplant without achieving domain-appropriate instructional function.

45-1 required corpus-relative comparison on each pair:

- **Strong-reference proximity** — does treatment approach Strong instructional feature set (M13, M16)?
- **Weak-reference distance** — does treatment avoid Failed failure shape (M14)?
- **Mimicry suspect** — is improvement reducible to verbatim or inappropriate cross-domain copying?

Recorded result: mimicry suspect = **no** on all six pairs. Workbook justifications attribute improvements to instructional-function moves:

- DT-PS-A4 treatment: Photosynthesis column layout and domain content, not M13 criteria transplant.
- TP-MRX-A4 treatment: workplace frame vs M16 digital-platform frame; distinct bullet phrasing.
- DT-PS-A6: A6 factors and scenario-linked evidence, not Marx M13 wording.

Anti-mimicry analysis answers: *Is the observed quality move domain-appropriate and functionally grounded, or imitative of frozen references?* It prevents mistaking benchmark proximity for instructional success — especially when Detection Signals intentionally describe features shared with Strong exemplars.

*Interpretation:* Anti-mimicry is reviewer judgement informed by corpus comparison, not automated text overlap. 45-1 did not specify algorithmic thresholds.

---

## Lessons From Sprint 45.1

The completed experiment illustrates why multiple evidence layers are necessary.

### Lesson 1 — Verdict improvement required convergent evidence

All four Photosynthesis **Improvement** classifications required contract verdict rise **and** FM clearance **and** ownership pass **and** anti-mimicry clearance. TP-PS-A4: Failed → Strong with FM-02/FM-03 reduced, ownership pass, mimicry no. No layer alone would have sufficed for the experiment's convergent evidence standard.

### Lesson 2 — Structure without modelling is a recurring false-positive shape

DT-PS-A4 and DT-PS-A6 baselines had valid tables and empty learner cells (contract minimum) but FM-04 and Minimum verdicts. Treatment added partial-exemplar reasoning — the discriminating move. Workbook explicitly rejected classifying improvement as "empty-grid-plus-one-filled-cell" without modelled reasoning. Contract minimum plus pattern-aware FM check exposed what contract tier alone might under-specify for generation research.

### Lesson 3 — Transfer slot ≠ transfer success

TP-PS-A4 baseline occupied a transfer-designated slot with two sentences and a third-person claim. Failed verdict, FM-02/FM-03 present, Failed signal profile — despite capstone placement and no pre-written learner response (some minimum-adjacent signals). Treatment reached Strong through learner-context selection, operational word band, and multi-cue application. Pattern-aware evaluation separated **placement** from **instructional function**.

### Lesson 4 — Maintain-test pairs need the same stack

DT-MRX-A4 and TP-MRX-A4 classified **No Change** (Strong → Strong) only after confirming FM absence, ownership preservation, and anti-mimicry clearance — not merely because verdict did not rise. The stack detects degradation and mimicry on hold slots, not only remediation.

### Lesson 5 — Boundary declarations are part of evaluation, not calibration reopening

TP-PS-A6 applied declared Inter-Rater conjunctive §5.8 minimum interpretation. Baseline Failed (completion present, own-context absent, FM-03). Treatment Strong with FM-03 cleared. Frozen M22 historical verdict unchanged. Pattern-aware evaluation incorporated explicit boundary choice without relitigating Sprint 44 records.

### Lesson 6 — Capture channel stays separate

FM-01 and FM-12 were absent on all 45-1 bodies and scored under capture channel. Instructional FMs (FM-02, FM-03, FM-04) were scored separately. Pattern-aware evaluation preserves this channel separation so stub or composition artefacts are not mistaken for instructional weakness.

---

## Proposed Conceptual Model

The following describes the **evaluation stack** that emerged from 45-1 — concepts only, not procedures.

```
┌─────────────────────────────────────────────────────────────┐
│  EVALUATION SURFACE: GAM body text (instructional layer)   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  PRIMARY: 44-2 Contract Verdict                            │
│  Failed / Minimum / Strong — justified by §5.x bullets       │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────────┐
│ SECONDARY:       │ │ FAILURE MODE │ │ OWNERSHIP AUDIT      │
│ Detection        │ │ ANALYSIS     │ │ (independent         │
│ Signals          │ │ instructional│ │  constraint)         │
│ corroboration    │ │ + capture    │ │ scaffold ≠ deliverable│
│                  │ │ channel      │ │ regression override  │
└──────────────────┘ └──────────────┘ └──────────────────────┘
              │               │               │
              └───────────────┼───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  CORPUS-RELATIVE ANTI-MIMICRY COMPARISON                   │
│  Strong-reference proximity · weak-reference distance ·      │
│  mimicry suspect                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  BOUNDARY DECLARATION (when calibration ambiguous)           │
│  Documents governing interpretation; does not alter corpus   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  CONVERGENT JUDGEMENT                                      │
│  Pattern-aware evaluation outcome — synthesis of layers    │
│  (in 45-1: paired delta classification per obligation)     │
└─────────────────────────────────────────────────────────────┘
```

**Conceptual ordering principles** (evidence-based where stated, interpretive where noted):

| Layer | Conceptual role |
| ----- | --------------- |
| **Contract verdict** | Primary normative judgement of instructional realisation tier. |
| **Detection Signals** | Secondary shape corroboration; superficial-match discrimination. |
| **Failure modes** | Named instructional failure diagnosis; paired delta tracking. |
| **Ownership audit** | Independent constraint; regression disqualifies success regardless of verdict. |
| **Anti-mimicry** | Corpus-relative authenticity check; pattern shape ≠ benchmark copy. |
| **Boundary declaration** | Explicit calibration choice for ambiguous bodies. |
| **Convergent judgement** | Synthesis — no single layer alone declares pattern-aware success in generation research. |

*Interpretation:* In paired experiments (45-1), convergent judgement includes baseline/treatment comparison on identical DLA obligations. Single-body evaluation uses the same layers without paired delta. Procedure for applying each layer is out of scope for this paper.

---

## Implications

**For the research frontier.** Sprint 44 made quality observable. Sprint 45.1 showed pattern guidance can move observable quality on a controlled sample. Pattern-aware evaluation names the method that detected those moves. The frontier after 45-1 is whether that method can become **repeatable** — not whether patterns can influence generation at all (45-1 answered that in scope).

**For evaluation practice.** Reviewers assessing generated bodies in pattern-influence research should expect to apply multiple layers, not contract verdict alone. 45-1 workbook structure (contract → signals → FMs → ownership → corpus comparison → pair outcome) is empirical evidence that single-layer scoring is insufficient for this research question.

**For Sprint 44 authority.** Pattern-aware evaluation consumes closed Sprint 44 artefacts without redesign. Contracts stay primary; patterns stay secondary; frozen corpus stays historical reference; calibration boundaries are declared per evaluation, not reopened globally.

**For generation research sequencing.** 45-1 recommendation gates further pattern injection expansion until evaluation is standing. Pattern-aware evaluation is the conceptual prerequisite for trustworthy claims about pattern-guided generation — including future corpus regression (45-3) and repair exploration (45-4), which depend on reliable scoring of generated bodies.

**For discriminating instructional moves.** The concept encodes 45-1's empirical discriminations: exemplar reasoning vs table shell; substantive transfer scaffolding vs transfer-slot presence; domain-appropriate function vs Strong-reference mimicry. These are evaluation concepts, not generation mechanisms.

*Speculation:* Whether pattern-aware evaluation generalises to SP-01, SP-04–SP-06 and additional material types is plausible but unproven — 45-1 scope was SP-02/SP-03 only.

---

## Conclusion

**Pattern-aware evaluation** is the multi-layer evaluative concept that emerged when PRISM shifted from characterising frozen corpus quality (Sprint 44) to testing pattern-guided generation (Sprint 45.1).

It retains **44-2 contract verdicts as primary normative evidence** and surrounds them with **secondary Detection Signals**, **failure-mode analysis**, **independent ownership audits**, **corpus-relative anti-mimicry comparison**, and **explicit boundary declarations** where calibration is ambiguous.

It is **not** contract replacement, pattern checklist scoring, prompt evaluation, or implementation evaluation.

Sprint 45.1 demonstrated that this stack **can detect real instructional moves** — four verdict improvements with FM clearance, zero ownership regressions, zero mimicry flags — and **can discriminate** structural adequacy from strong realisation (FM-04 baselines; TP-PS-A4 Failed baseline with ownership pass).

Sprint 45.1 did **not** demonstrate that the stack is standing, repeatable, or generalisable beyond six pairs and one evaluator session.

The position of this paper: pattern-aware evaluation correctly names the evaluative concept required for the next PRISM research phase. Whether it can be formalised into reliable practice is the chartered question for Sprint 45.2 — not answered here.

---

## Traceability

| Claim type | Source |
| -------- | ------ |
| Sprint 44 observability role | 44-2 §1–2; 44-3 Purpose |
| 45-1 pair outcomes and aggregates | 45-1-evidence-workbook; 45-1-recommendation; SPRINT-45-1-CLOSURE-REVIEW |
| Verdict-first / signal-secondary ordering | 45-1 workbook instructions; closure review § What 45-1 Demonstrated (6) |
| FM-04 / FM-02 / FM-03 behaviour | Workbook pair sections; 44-3 type indexes |
| Ownership separability | TP-PS-A4 baseline workbook entry |
| Anti-mimicry results | 45-1-recommendation § Anti-Mimicry Review |
| M22 boundary handling | TP-PS-A6 workbook; closure review |
| 45-2 frontier framing | SPRINT-45-2-CHARTER |
| Contract/pattern hierarchy | 44-3 Relationship to 44-2 contracts; MP-1 |
