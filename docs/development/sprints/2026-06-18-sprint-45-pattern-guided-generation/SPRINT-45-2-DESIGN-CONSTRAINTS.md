# Sprint 45.2 Design Constraints

**Date:** 2026-06-18  
**Type:** Design-review framework — not a sprint design, protocol, or implementation proposal  
**Purpose:** Identify the constraints that any valid Sprint 45.2 design must satisfy  
**Authority:** [SPRINT-45-2-CHARTER.md](SPRINT-45-2-CHARTER.md) · [SPRINT-45-2-SCOPE-ANALYSIS.md](SPRINT-45-2-SCOPE-ANALYSIS.md) · [REPEATABILITY-ANALYSIS.md](REPEATABILITY-ANALYSIS.md) · [EVALUATION-STACK-ANALYSIS.md](EVALUATION-STACK-ANALYSIS.md) · [EVIDENCE-STANDARDS-ANALYSIS.md](EVIDENCE-STANDARDS-ANALYSIS.md) · [pattern-aware-evaluation-position-paper.md](pattern-aware-evaluation-position-paper.md) · [METHODOLOGICAL-CONTRIBUTIONS-OF-SPRINT-45-1.md](METHODOLOGICAL-CONTRIBUTIONS-OF-SPRINT-45-1.md)

**Non-goals:** Sprint design · protocol drafting · implementation · architecture · contract or Pattern Library redesign

---

## Background

### Frontier

Sprint 45.1 established controlled positive evidence that SP-02/SP-03 pattern guidance can influence `decision_table` and `transfer_prompt` bodies on obligation-matched pairs. The frontier after 45.1 is whether the **evaluation method that detected those moves** can become **repeatable standing research infrastructure** — not whether patterns can influence generation again on the same twelve artefacts ([`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md); [`FRONTIER-REVIEW-AFTER-SPRINT-45-1.md`](FRONTIER-REVIEW-AFTER-SPRINT-45-1.md)).

### Charter

Sprint 45.2 is chartered to answer:

> Can the 45-1 evaluation method — 44-2 contract verdicts as primary evidence, pattern Detection Signals as secondary corroboration, mandatory FM and ownership checks, corpus-relative anti-mimicry comparison, and explicit boundary declarations where calibration is ambiguous — be formalised into a repeatable pattern-aware evaluation protocol that reliably scores `decision_table` and `transfer_prompt` bodies beyond the original six-pair experiment?

This is an **evaluation** question. It does not reopen generation mechanism, contract text, Pattern Library architecture, or Sprint 44 calibration decisions.

### Scope position

[`SPRINT-45-2-SCOPE-ANALYSIS.md`](SPRINT-45-2-SCOPE-ANALYSIS.md) concluded that 45.2 should be **repeatability-focused with minimal generalisation**:

| Dimension | Minimum credible scope |
| --------- | ---------------------- |
| Existing bodies | All twelve 45-1 artefacts re-evaluated |
| Evaluators | ≥1 independent of the 45-1 scoring session |
| New bodies | ≥2 (one `decision_table`, one `transfer_prompt`), SP-02/SP-03 only |
| Boundary exercise | At least one ambiguous transfer case with explicit declaration |
| Out of scope | Additional patterns, domains, material types, full six-pair replication, corpus regression |

**Demonstrated:** Operability and internal consistency on six pairs.  
**Not demonstrated:** Cross-rater repeatability, generalisation beyond twelve bodies, disqualifier-path reliability.

Any valid 45.2 design must satisfy the constraints below. This document does not propose how to satisfy them.

---

## Non-Negotiable Constraints

Requirements imposed by closed authority — not open to redesign within 45.2.

### From Sprint 44

| Constraint | Source | Evidence basis |
| ---------- | ------ | -------------- |
| **44-2 contracts are normative and closed** | Charter § Relationship To Sprint 44 | Verdict tiers (Failed / Minimum / Strong) unchanged; no new tiers or bullet rewrites |
| **44-3 Pattern Library is closed** | Charter § What 45.2 Is Not Intended To Demonstrate | SP-02/SP-03 and FM indexes consumed as-is; no pattern additions or index redesign |
| **Frozen benchmark corpus is not rescored or refrozen** | Charter § Relationship To Sprint 44 | Anti-mimicry anchors (M13, M16, M12, M14, M19, M22) used comparatively; corpus prose unchanged |
| **Sprint 44 calibration splits are not globally resolved** | Charter; 45-1 TP-PS-A6 precedent | M22 and similar splits documented per-evaluation only |
| **Contract verdict governs on layer conflict** | Evaluation stack analysis; position paper | When signals and verdict diverge, verdict is authoritative |
| **Detection Signals are secondary to contracts** | 44-3; 45-1 workbook; position paper | Pattern names alone cannot justify verdicts |

### From Sprint 45.1 findings

*These findings are closed — 45.2 does not relitigate them.*

| Constraint | Implication for design |
| ---------- | ---------------------- |
| **Six pair outcomes stand within 45-1 scope** | 4 Improvement, 2 No Change, 0 Regression — design may re-evaluate but must not treat 45-1 as automatically disproved if re-scoring diverges without recording why |
| **Verdict-first ordering was exercised** | Any valid design preserves Layer 1 primacy; signals did not drive classifications in 45-1 |
| **Convergent evidence standard was applied** | Improvement required verdict rise + target FM absent + ownership preserved; design must test whether this standard reproduces |
| **TP-PS-A6 boundary declaration is precedent** | Ambiguous transfer evaluation may follow declared interpretation model; not global M22 resolution |
| **45-1 recommendation gates injection expansion** | Design must not expand pattern injection scope as primary activity |

### From Charter

| Constraint | Charter reference |
| ---------- | ----------------- |
| **Evaluation frontier only** | Candidate Research Question; § What 45.2 Is Not Intended To Demonstrate |
| **SP-02 and SP-03 only** | Success condition 5; exclusions table |
| **`decision_table` and `transfer_prompt` only** | Success condition 5 |
| **Application beyond original six-pair session** | Success condition 2 |
| **Written protocol artefact without modifying 44-2/44-3 text** | Success condition 1 |
| **45-2 failure does not invalidate 45-1 generation findings in scope** | § Failure Conditions closing note |

### From Scope Analysis

| Constraint | Scope analysis reference |
| ---------- | ------------------------ |
| **Independent evaluator required** | Same evaluator only = consistency, not repeatability |
| **All twelve 45-1 bodies in re-evaluation** | Subsampling risks missing Marx maintain and boundary cases |
| **Minimal holdout new bodies required** | Zero new bodies fails charter |
| **Not a second full 45-1 injection experiment** | Full six-pair replication tests generation variance, not evaluation repeatability |
| **Not documentation-only** | Protocol specification without application under-scopes |

*Interpretation:* Non-negotiable constraints define the **boundary box** within which any 45.2 design must operate. Violation invalidates the design as a 45.2 sprint.

---

## Frontier Alignment Constraints

How a design must remain focused on **repeatability** rather than **generalisation expansion**.

### Primary vs secondary objectives

| Objective | Priority | Basis |
| --------- | -------- | ----- |
| **Repeatability** (compatible conclusions on same bodies across evaluators/sessions) | **Primary** | Charter uncertainties 1, 3, 4; repeatability analysis |
| **Bounded generalisation** (compatible conclusions on minimal holdout beyond twelve) | **Secondary but required** | Charter success condition 2; scope analysis minimum |
| **Pattern expansion** | **Excluded** | Charter exclusions |
| **Corpus-wide regression** | **Excluded** | 45-3 dependency |
| **Generation replication** | **Excluded** | Different research question |

### Design must test, not assume

| Term | 45-1 status | 45.2 design must |
| ---- | ----------- | ---------------- |
| Operability | Demonstrated | Not re-prove as primary success — may assume operability as baseline |
| Consistency | Demonstrated in-sample | Not treat in-sample consistency as repeatability proof |
| Repeatability | Unmeasured | **Measure** — independent application on same bodies |
| Generalisation | Unmeasured | **Measure minimally** — holdout bodies, not corpus-wide |

### Anti-drift constraints

A valid design must **not**:

- Treat unanimous 45-1 success as proof evaluation is easy on noisier generation.
- Use re-scoring the twelve bodies by the **same** evaluator as the sole repeatability test.
- Substitute a large new-body collection for inter-rater testing on existing bodies.
- Frame success primarily as "new bodies improved again" — that is a generation claim.
- Expand to prove pattern-guided generation always works — charter explicit exclusion.

*Evidence:* [`REPEATABILITY-ANALYSIS.md`](REPEATABILITY-ANALYSIS.md) § What Repeatability Means; [`SPRINT-45-2-SCOPE-ANALYSIS.md`](SPRINT-45-2-SCOPE-ANALYSIS.md) § Recommendation.

*Interpretation:* Generalisation in 45.2 is a **minimum credibility threshold**, not a breadth objective. Repeatability is the frontier gate.

---

## Evaluation Constraints

What must be preserved from the 45.1 seven-layer evaluation stack ([`EVALUATION-STACK-ANALYSIS.md`](EVALUATION-STACK-ANALYSIS.md)).

### Layer preservation

| Layer | Must preserve | Must not |
| ----- | ------------- | -------- |
| **L1 — Contract verdict** | Failed / Minimum / Strong per §5.6 or §5.8; justification citing contract bullets | Replace with pattern checklist; add tiers |
| **L2 — Detection Signals** | Secondary corroboration from SP-02/SP-03 signal checklists; superficial-match guard | Elevate to primary classifier; override verdict |
| **L3 — Failure Mode analysis** | FM-04 (`decision_table`); FM-02, FM-03 (`transfer_prompt`); FM-01/FM-12 under capture channel only | Conflate capture FMs with instructional FMs |
| **L4 — Ownership audit** | Independent gate; regression overrides success | Merge into contract verdict tier |
| **L5 — Anti-mimicry** | Corpus-relative validity check | Replace contract scoring |
| **L6 — Boundary declaration** | Per-evaluation explicit interpretation on ambiguous bodies | Reopen global Sprint 44 calibration |
| **L7 — Convergent judgement** | Synthesis before pair/outcome classification | Single-layer classification |

### Ordering constraints

| Ordering rule | Evidence basis |
| ------------- | -------------- |
| **Verdict-first** | All six 45-1 pair outcomes followed Layer 1 |
| **Signals secondary** | No pair improved on signals without verdict rise |
| **Ownership and mimicry as gates** | Design: regression or mimicry fails regardless of verdict |
| **Boundary declaration before verdict on ambiguous bodies** | TP-PS-A6 precedent |
| **Convergent synthesis last** | Four Improvements met multi-layer bar before classification |

### Evaluation surface

| Constraint | Basis |
| ---------- | ----- |
| **GAM body text only** | 45-1 workbook instruction |
| **Not prompt, generator, or workflow evaluation** | Position paper § What Pattern-Aware Evaluation Is Not |
| **Paired comparison where 45-1 pairs apply** | Obligation-matched baseline/treatment structure for re-classification |

### Layer relationship preservation

```text
L1 normative → L2/L3/L4 parallel → L5 validity → L6 when needed → L7 synthesis
```

Layers 4 and 5 may **veto** would-be success. Layer 6 **conditions** Layer 1 on ambiguous bodies. Layer 2 must not **override** Layer 1.

*Demonstrated:* Stack ordering and separability (e.g. TP-PS-A4 baseline: ownership pass + Failed verdict).  
*Not demonstrated:* Stack reproducibility across evaluators — 45.2 must test without altering layer definitions.

---

## Evidence Constraints

What evidence a valid design must collect — derived from charter success conditions and evidence standards analysis.

### Per-body evidence (all evaluated bodies)

| Evidence channel | Must record | Role |
| ---------------- | ----------- | ---- |
| Contract verdict | Failed / Minimum / Strong + §5.x justification | Primary |
| Detection Signals | SP-02 or SP-03 profile; superficial-match flag | Secondary / guard |
| Failure Modes | Target FMs + capture channel if applicable | Diagnostic / convergent |
| Ownership audit | Pass/fail; regression yes/no | Gating |
| Anti-mimicry | Proximity, distance, mimicry suspect | Gating / validity |
| Boundary declaration | Explicit §5.x interpretation if ambiguous | Preconditional |

### Classification evidence (paired bodies)

| Classification | Necessary evidence (from 45-1 standard) |
| -------------- | ---------------------------------------- |
| **Improvement** | Verdict strictly higher than baseline; target FM absent in treatment; ownership pass, no regression |
| **No Change** | Verdict unchanged (including Strong → Strong maintain-test) |
| **Regression** | Verdict lower, ownership regression/fail, mimicry confirmed, or superficial match with worse verdict |
| **Inconclusive** | Disputed interpretation without resolvable declaration |

**Verdict ordering:** Failed < Minimum < Strong.

### Repeatability evidence

| Evidence type | Purpose |
| ------------- | ------- |
| **Independent evaluator outcomes** | Cross-rater repeatability |
| **Agreement on twelve 45-1 bodies** | Session-artefact test; pair classification reproduction |
| **Holdout body outcomes** | Minimal generalisation |
| **Convergent-evidence comparison** | Whether necessary + corroborative + gating layers align across applications |
| **Disagreement documentation** | Where layers diverge — required for charter failure assessment |

### Disqualifier-path evidence

A valid design should **attempt to collect evidence** on whether disqualifier paths are operational — charter success condition 3. 45-1 had zero superficial-match, mimicry-positive, or ownership-regression cases.

| Disqualifier | 45-1 status | 45.2 design implication |
| ------------ | ----------- | ------------------------ |
| Superficial match (signals without verdict rise) | Designed; not triggered | Must not assume path works without stress |
| Mimicry suspect | Designed; not triggered | Must record application even if all negative |
| Ownership regression | Designed; not triggered | Must record application even if all negative |

*Evidence:* [`EVIDENCE-STANDARDS-ANALYSIS.md`](EVIDENCE-STANDARDS-ANALYSIS.md) § Necessary / Corroborative / Disqualifying Evidence.  
*Interpretation:* A design that collects only verdicts without FM, ownership, anti-mimicry, and convergence comparison fails evidence constraints.

---

## Scope Constraints

Expansions explicitly prohibited — charter and scope analysis.

### Prohibited scope expansions

| Expansion | Prohibition source |
| --------- | ------------------ |
| SP-01, SP-04, SP-05, SP-06 | Charter § What 45.2 Is Not Intended To Demonstrate |
| Material types beyond `decision_table`, `transfer_prompt` | Charter success condition 5 |
| Domains beyond Marx/Photosynthesis (for scope expansion purposes) | Scope analysis § Candidate E |
| Corpus-wide regression (45-3) | Charter exclusions |
| Material-level repair (45-4) | Charter exclusions |
| Production injection mechanism | Charter; 45-1 Q-02 |
| Prompts, validators, code, pipeline | Charter exclusions |
| New verdict tiers or contract amendments | Charter; Sprint 44 closed |
| Pattern Library architecture changes | Sprint 44-3 closed |
| Global M22 or calibration resolution | Charter exclusions |
| Universal Strong enforcement / runtime gates | Sprint 44-1 scope |

### Prohibited activity framing

| Framing | Why invalid |
| ------- | ----------- |
| **Second full 45-1 injection experiment** as primary activity | Tests generation replication, not evaluation repeatability |
| **Large new-body corpus** as substitute for inter-rater testing | Dilutes repeatability signal |
| **Protocol-only sprint** with no independent application | Under-scopes charter |
| **Generation success as primary outcome** | Wrong frontier question |

### Permitted scope (minimum)

| Element | Permitted |
| ------- | --------- |
| Twelve 45-1 artefacts | Full re-evaluation |
| ≥1 independent evaluator | Required |
| ≥2 holdout bodies (one per type) | Minimal generalisation |
| SP-02, SP-03 only | Chartered patterns |
| Marx and Photosynthesis | Existing 45-1 domains |
| Written protocol specification | Charter success 1 — as output, not drafted here |

*Evidence:* [`SPRINT-45-2-SCOPE-ANALYSIS.md`](SPRINT-45-2-SCOPE-ANALYSIS.md) § Must include / Must not include.

---

## Validity Constraints

How ownership, anti-mimicry, and boundary handling must be treated.

### Ownership (Layer 4)

| Constraint | Basis |
| ---------- | ----- |
| **Independent of contract verdict** | TP-PS-A4 baseline: ownership pass + Failed |
| **Regression is hard gate** | Design: ownership regression → Regression regardless of verdict |
| **Concrete checks preserved** | Empty judgement loci; no pre-written learner transfer (45-1 workbook) |
| **Must be traceable to protocol steps** | Charter success condition 4 |
| **Not ad hoc session intuition** | Charter failure condition 4 if irreducible intuition only |

*Demonstrated:* Zero ownership regressions on six treatments.  
*Not demonstrated:* Cross-rater agreement on ownership edge cases (modelling vs completing).

### Anti-mimicry (Layer 5)

| Constraint | Basis |
| ---------- | ----- |
| **Corpus-relative comparison** | Strong-reference proximity; weak-reference distance; mimicry suspect flag |
| **Validity check, not verdict substitute** | Distinguishes instructional function from benchmark copying |
| **Mimicry suspect disqualifies improvement trust** | Design failure criterion |
| **Domain-appropriate judgement documented** | 45-1 workbook corpus comparison fields |
| **Must be applicable as standing procedure** | Charter success condition 4 |

*Demonstrated:* mimicry suspect = no on all six pairs.  
*Not demonstrated:* Positive mimicry case calibration; inter-rater agreement.

### Boundary handling (Layer 6)

| Constraint | Basis |
| ---------- | ----- |
| **Declared before verdict drives classification** on ambiguous bodies | TP-PS-A6 precedent |
| **Per-evaluation only** | Frozen M22 unchanged; no global calibration reopening |
| **Enables classifiable outcome vs Inconclusive** | TP-PS-A6: declaration → Improvement; design allowed Inconclusive without declaration |
| **At least one exercise required** | Scope analysis; charter success condition 5 |
| **Must not proliferate incompatible declarations without documentation** | Charter failure condition 5; repeatability risk |

*Demonstrated:* One instance (TP-PS-A6 conjunctive §5.8 minimum).  
*Interpretation:* Boundary declarations are **evaluation-local interpretive choices**, not Sprint 44 amendments.

---

## Repeatability Constraints

What must be demonstrated before repeatability can be claimed — from repeatability analysis conditions.

### Conditions that must be tested

| # | Condition | 45-1 status |
| - | --------- | ----------- |
| 1 | **Normative layer stable** — compatible verdicts across reviewers on same bodies | Open |
| 2 | **Classification rules sufficient** — verdict ordering + FM/ownership + disqualifiers yield same pair classification | Demonstrated once |
| 3 | **Judgement layers operationalisable** — anti-mimicry, substantive-vs-cosmetic, boundary declaration with acceptable agreement | Open |
| 4 | **Disqualifier paths work under stress** — ownership regression and mimicry flags when borderline cases appear | Open |
| 5 | **Generalisation beyond sample** — consistent conclusions on bodies not identical to twelve | Open |
| 6 | **Utility threshold met** — agreement and cost support use as gate for further generation research | Open |

### What repeatability claim requires

A valid design must enable assessment of:

| Claim element | Minimum evidence |
| ------------- | ---------------- |
| **Cross-rater repeatability** | ≥1 independent evaluator on all twelve 45-1 bodies |
| **Session-artefact exclusion** | Pair classifications on twelve bodies compared to 45-1 workbook |
| **Minimal generalisation** | Holdout evaluation beyond twelve |
| **Verdict-first preservation** | Signals do not become primary under multi-rater use |
| **Convergent synthesis reproducibility** | Layer alignment comparison across applications |
| **Practical utility** | Documented agreement level sufficient to assess charter failure condition 5 |

### What repeatability claim does not require

| Element | Why excluded |
| ------- | ------------ |
| Proof that 45-1 Improvements were wrong | Charter: failure does not invalidate 45-1 in scope |
| Full corpus regression | 45-3 |
| Multi-pattern expansion | Charter |
| Perfect inter-rater agreement on all layers | Threshold to be set in design — not predefined here |

*Evidence:* [`REPEATABILITY-ANALYSIS.md`](REPEATABILITY-ANALYSIS.md) § What would have to be true for repeatability; § Conclusion.  
*Interpretation:* Repeatability is **measured**, not assumed from 45-1 operability.

---

## Failure Conditions

Design characteristics that would **invalidate** a proposed 45.2 — mapped to charter failure conditions and scope under-scoping.

### Invalid as 45.2 (wrong sprint)

| Design characteristic | Why invalid |
| ----------------------- | ----------- |
| Primary activity is production injection or pipeline build | Charter exclusion |
| Adds SP-01/04/05/06 or new material types as evaluation scope | Scope constraint violation |
| Reopens 44-2 contract text or adds verdict tiers | Sprint 44 closed |
| Redesigns Pattern Library indexes or adds patterns | Sprint 44-3 closed |
| Resolves M22 or other calibration splits globally | Charter exclusion |
| Corpus-wide regression as primary activity | 45-3 scope |
| Second full six-pair injection experiment as primary activity | Scope analysis: wrong question |
| Documentation-only — protocol written but not independently applied | Under-scopes repeatability frontier |

### Invalid as credible repeatability test (within 45.2 framing)

| Design characteristic | Charter / analysis failure |
| ----------------------- | -------------------------- |
| Same evaluator only — no independent reviewer | Repeatability unmeasured |
| Subset of twelve bodies without justification | Risks missing maintain-test and boundary cases |
| Zero holdout bodies | Fails "beyond original six-pair experiment" |
| Verdict-only scoring without FM, ownership, anti-mimicry | Evidence constraints violated |
| Signals as primary success criterion | Violates verdict-first stack |
| No boundary-declaration exercise | Charter success condition 5 unaddressed |
| No convergent-evidence comparison | Charter success condition 6 unaddressed |

### Outcomes that would indicate frontier failure (if observed)

These are **research failure conditions**, not design-invalidity — but a design must be capable of detecting them:

| Outcome | Charter failure |
| ------- | --------------- |
| Incompatible primary verdicts on same bodies across reviewers | Failure 1 |
| Systematic signal/verdict divergence without resolution | Failure 2 |
| Cosmetic shape passes as Improvement | Failure 3 |
| Ownership/mimicry not operationalisable | Failure 4 |
| Disagreement exceeds utility | Failure 5 |
| Twelve bodies re-score to materially different pair classifications | Failure 6 |

*Evidence:* [`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md) § Failure Conditions.

---

## Success Conditions

Design characteristics that would make a proposed 45.2 **fit-for-purpose** — charter success conditions translated to design requirements.

### Must enable

| # | Fit-for-purpose characteristic | Charter / scope source |
| - | -------------------------------- | ---------------------- |
| 1 | **Protocol specification output** — codifies Layers 1–7 without modifying 44-2/44-3 authoritative text | Success condition 1 |
| 2 | **Independent application** — reviewer(s) other than 45-1 session apply full stack | Scope analysis; charter uncertainty 1 |
| 3 | **Full twelve-body re-evaluation** — all six pairs re-classified under protocol | Scope analysis; failure condition 6 |
| 4 | **Holdout evaluation** — ≥1 `decision_table` + ≥1 `transfer_prompt` not among original twelve | Success condition 2; scope minimum |
| 5 | **Superficial-match discrimination attempt** — design capable of detecting or documenting absence of cosmetic false positive | Success condition 3 |
| 6 | **Ownership and anti-mimicry as traceable steps** — not ad hoc | Success condition 4 |
| 7 | **Boundary-declaration exercise** — ambiguous transfer case with explicit declaration | Success condition 5 |
| 8 | **Convergent-evidence recording** — layer outcomes comparable across applications | Success condition 6 |
| 9 | **Agreement/disagreement analysis** — sufficient to assess utility | Repeatability condition 6 |
| 10 | **Scope lock** — SP-02/SP-03; `decision_table`/`transfer_prompt`; no prohibited expansion | Charter scope |

### Should enable (if feasible without scope expansion)

| Characteristic | Basis |
| -------------- | ----- |
| At least one body where superficial pattern shape is correctly classified as non-improvement | Charter success 3; 45-1 had zero triggers |
| Disqualifier-path documentation even if all negative | Evidence standards analysis |
| Separation of per-output success from experiment-level synthesis | 45-1 methodological contribution |

### Success is not

| Misconception | Correction |
| ------------- | ---------- |
| Replicating 45-1 generation improvements | Generation claim — not 45.2 frontier |
| Achieving unanimous agreement on all layers | Threshold is design decision |
| Proving pattern-guided generation always works | Charter exclusion |
| Closing all repeatability unknowns from analysis | Ten unknowns listed; 45.2 reduces uncertainty on chartered subset |

*Evidence:* [`SPRINT-45-2-CHARTER.md`](SPRINT-45-2-CHARTER.md) § Success Conditions; [`SPRINT-45-2-SCOPE-ANALYSIS.md`](SPRINT-45-2-SCOPE-ANALYSIS.md) § Smallest Credible Experiment.

---

## Design Review Checklist

Concise checklist for evaluating future 45.2 designs. Each item is pass/fail against constraints in this document.

### Frontier and scope

- [ ] Primary research question is evaluation repeatability, not generation replication
- [ ] Design tests cross-rater repeatability, not only same-evaluator consistency
- [ ] Design includes all twelve 45-1 bodies in re-evaluation
- [ ] Design includes ≥2 holdout bodies (one per chartered material type)
- [ ] Design does not expand to SP-01/04/05/06
- [ ] Design does not expand to additional material types
- [ ] Design does not treat corpus regression (45-3) as in-scope
- [ ] Design does not reopen 44-2 contracts, 44-3 patterns, or Sprint 44 calibration

### Evaluation stack

- [ ] Full seven-layer stack preserved with verdict-first ordering
- [ ] Detection Signals remain secondary — cannot override contract verdict
- [ ] FM-01/FM-12 scored under capture channel only
- [ ] Ownership audit is independent gate with regression override
- [ ] Anti-mimicry is corpus-relative validity check
- [ ] Boundary declaration required on ambiguous bodies before classification
- [ ] Convergent judgement synthesises layers before pair classification
- [ ] Evaluation surface is GAM body text only

### Evidence collection

- [ ] Per-body: verdict, signals, FMs, ownership, anti-mimicry recorded
- [ ] Paired bodies: classification uses Failed < Minimum < Strong ordering
- [ ] Improvement requires verdict rise + target FM absent + ownership preserved
- [ ] Disqualifier paths (superficial match, mimicry, ownership regression) addressable
- [ ] Independent evaluator outcomes recorded and comparable
- [ ] Convergent-evidence agreement/disagreement documented
- [ ] Boundary-declaration exercise included

### Repeatability

- [ ] ≥1 evaluator independent of 45-1 scoring session
- [ ] Pair classifications on twelve bodies compared to 45-1 workbook
- [ ] Holdout outcomes test generalisation beyond familiar sample
- [ ] Design can detect charter failure outcomes (verdict incompatibility, signal drift, session artefact)
- [ ] Utility/agreement sufficient to assess whether method can govern further research

### Prohibited elements absent

- [ ] No production injection mechanism as primary activity
- [ ] No implementation/code/pipeline scope
- [ ] No second full six-pair injection experiment as primary activity
- [ ] No protocol-only design without independent application
- [ ] No global M22 or calibration resolution

**Review rule:** Any failed **Frontier and scope**, **Evaluation stack**, or **Prohibited elements** item invalidates the design as 45.2. Failed **Evidence collection** or **Repeatability** items invalidate credibility even if nominally in scope.

---

## Conclusion

### Strongest design constraints

Any valid Sprint 45.2 design operates within a closed box defined by Sprint 44 authority, closed 45.1 findings, and chartered repeatability scope.

**Non-negotiable core:**

1. **Evaluation frontier only** — test whether pattern-aware evaluation is repeatable; do not re-run generation experiments or expand patterns/types/domains.

2. **Seven-layer stack preserved** — verdict-first; signals secondary; ownership and anti-mimicry as gates; boundary declaration on ambiguity; convergent synthesis last.

3. **Closed normative inputs** — 44-2 contracts and 44-3 patterns consumed without redesign; frozen corpus unchanged.

4. **Minimum credible evidence** — independent evaluator on all twelve 45-1 bodies; minimal holdout beyond twelve; full per-body evidence channels; boundary exercise; convergent comparison.

5. **Repeatability measured, not assumed** — operability and in-sample consistency from 45-1 are necessary context but insufficient for success.

**Evidence-derived vs interpretation:**

| Constraint type | Examples |
| --------------- | -------- |
| **Evidence-derived** | Verdict-first ordering; twelve bodies; SP-02/SP-03 only; charter exclusions; 45-1 convergent evidence standard; TP-PS-A6 boundary precedent |
| **Interpretation** | Minimum holdout = two bodies; all twelve must be re-evaluated; documentation-only sprint is invalid; utility threshold specifics |

**One-line summary:** A fit-for-purpose 45.2 design must **independently re-apply the full 45-1 evaluation stack to all twelve existing bodies plus a minimal SP-02/SP-03 holdout**, preserve verdict-first convergent evidence rules, treat ownership and anti-mimicry as operational gates, handle ambiguity via per-evaluation boundary declaration, and **must not** expand scope, reopen Sprint 44 authority, or substitute generation replication for evaluation repeatability.

---

## Traceability

| Section | Primary sources |
| ------- | --------------- |
| Background | `SPRINT-45-2-CHARTER.md`; `SPRINT-45-2-SCOPE-ANALYSIS.md` |
| Non-negotiable constraints | Charter § Relationship To Sprint 44/45.1; scope analysis |
| Frontier alignment | `REPEATABILITY-ANALYSIS.md`; scope analysis § Recommendation |
| Evaluation constraints | `EVALUATION-STACK-ANALYSIS.md`; position paper |
| Evidence constraints | `EVIDENCE-STANDARDS-ANALYSIS.md`; charter § Success Conditions |
| Scope constraints | Charter § What 45.2 Is Not Intended; scope analysis |
| Validity constraints | Evaluation stack L4–L6; charter success/failure 3–5 |
| Repeatability constraints | `REPEATABILITY-ANALYSIS.md` § Conclusion |
| Failure / success conditions | `SPRINT-45-2-CHARTER.md` § Success/Failure Conditions |
| Checklist | Synthesis of all sections |
