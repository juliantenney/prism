# S76-T-032 — Lagrangian A4 constructive-alignment diagnostic

**Task:** S76-T-032  
**Status:** **Diagnostic complete** (2026-08-13) — not implementation  
**Mode:** DIAGNOSTIC ONLY — no production code, prompt, schema, validator, test, fixture, EP, DLA, GAM, Design Page, Graphics, QA, or Settings changes  
**Depends on:** [T-010](S76-T-010-dla-audit-report.md) · [T-020](S76-T-020-dla-p02-solution-design.md) · [T-021](S76-T-021-dla-p01-solution-design.md) · [T-026](S76-T-026-dla-p01-residual-operand-closure-diagnostic.md) · [T-028](S76-T-028-dla-p01-residual-operand-closure-implementation.md) · [T-030](S76-T-030-generated-operand-operational-suitability-diagnostic.md) · [T-031](S76-T-031-generated-operand-operational-suitability-solution-design.md)  
**Out of scope:** fix implementation · T-031 implementation · P04 · P05 · P01/P02/P03 reopen · T-031 absorption · maths redesign · keyword heuristics

This artefact diagnoses a **post-P01-R1 Lagrangian re-benchmark constructive-alignment residual** on Activity 4. It does not authorise a solution. It does not mark anything fixed. It does not claim RECOVER. It does not start P04. It does not implement T-031.

---

## Limitation — runtime artefacts

Exact runtime LO / EP / DLA / GAM JSON for the 2026-08-13 post-T-028 Lagrangian re-benchmark is **not persisted in the repository**. No captured page JSON or Lagrangian benchmark artefact for this run was found under `docs/` or test fixtures.

Reconstruction uses:

1. **Operator-reported QA** for this run (primary live evidence for LO4, the generated A4 job, and the feasibility≠optimality finding);  
2. **Sprint 76 historical A4 exhibits** (T-010 / T-020 / T-021 / T-026 / T-027) — same subject, **earlier or coarser** characterisation (typically “interpret λ / shadow prices”);  
3. **Current production** DLA/EP/GAM prompt and contract surfaces.

Where live JSON is needed to quote `learner_task`, `expected_output`, `specification`, or case bodies, this report states the **role pattern** rather than inventing wording.

Operator-reported post-T-028 score (not an in-repo artefact): Lagrangian QA **84 / 100 — Strong**. P01 residual **worked**. A3 operational suitability is [T-030](S76-T-030-generated-operand-operational-suitability-diagnostic.md) / [T-031](S76-T-031-generated-operand-operational-suitability-solution-design.md) — **separate**. This diagnostic does **not** force A4 into P01, P02, P03, or T-031.

**Historical vs this-run grain:** Sprint 76 records consistently describe A4 as **interpret λ / cases as grounds**. This run’s QA maps A4 to an LO that requires **identify the optimal solution** and **verify the original constraint**, with a generated task of **analyse/verify candidate solutions**. Those may be the same activity at different grains (shadow-price work as one introductory optimality move) or an LO↔activity mapping shift. This report treats **operator QA as authoritative for this run’s alignment failure**, and historical records as the **P01/P02/P03 exhibit**, not as a substitute for unquoted `learner_task`.

---

## 0. Failure in one paragraph

LO4 (operator) requires two operations: **identify/determine the optimum** of a constrained problem, and **verify that the solution satisfies the original constraint**. The generated A4 asks learners to **analyse/verify candidate solutions**. Substituting a candidate into the constraint establishes **feasibility**, not **optimality**. The activity can therefore evidence a **necessary supporting check** while never requiring the **higher-order judgement** the outcome specifies. P01 now supplies cases. P02 may correctly treat those cases as particulars-as-grounds. T-031 concerns whether generated particulars support the **commissioned** operation. This defect is whether the **commissioned operation itself** matches the LO.

---

## 1. Reconstructed A4 chain

### 1.1 LO4

**Exact wording not in git.** Operator paraphrase (this run):

- identify the optimal solution to a constrained optimisation problem; **and**  
- verify that it satisfies the original constraint.

QA reduced **Constructive Alignment** because the realised activity can establish the second without the first.

### 1.2 EP A4

Live EP JSON not in git.

| Field | Reconstruction | Source |
| ----- | -------------- | ------ |
| Typical archetype (historical Sprint 76) | `analyse`: orientation → worked_example → **analysis** (scenario then table) | T-026 §2, §5 |
| V1 default index mapping | Fourth activity **can** be `evaluate` (`lib/episode-plan-v1-templates.js` understand/apply/analyse/evaluate by index) | Production templates — **not proof** of this run |
| Analyse beats (grammar) | Frame + inquiry/performance + closure; **verification** is a legal beat; **evaluative_judgement** is **not** required | `lib/episode-plan-v1-archetype-grammar.js` |
| Evaluate beats | Include `worked_judgement`, `evaluative_judgement`, criteria | Same |
| Mapped LO | Operator: LO4 | Operator |
| What EP owns | Choreography, archetype, beat order, LO mapping | T-010; pack DLA: do not replan beats |
| What EP does not own | `learner_task`, material ids, case numbers | T-021 / T-022 |

EP can host **both** LO operations (analyse or evaluate). Analyse+verification **also** permits reducing the episode to candidate-checking. That is **capable of** the later failure; it does not by itself write the learner task.

### 1.3 DLA A4

Live DLA JSON not in git.

| Field | This re-benchmark (operator + T-028 success) | Historical exhibit |
| ----- | -------------------------------------------- | ------------------ |
| Learner production | Analyse / verify **candidate solutions** (operator QA) | Interpret λ in context (T-026) |
| `task_material_decision` | Cases as task inputs (P01-R1 **worked**; operator: A4/A5 P01/P02 distinction preserved on the 84 run) | `true`; cases listed (T-026) |
| `evidence_decision` | Not reopened as wrong; T-020/T-028: A4 **may** be `required: true` | Cases as providers when judgement-from-particulars |
| Materials | Cases/data + workspace/scaffold + possible model (operator: not missing operands) | Scenario/cases + table + teaching |

Exact `learner_task`, `expected_output`, `purpose`, and `specification` **cannot be quoted**.

### 1.4 GAM A4

Operator: GAM generated the commissioned cases. QA: information available is enough to show **constraint satisfaction**, not enough (or not used) to establish **this candidate is the optimum**. Case bodies not in git.

### 1.5 Final activity (QA)

| What the learner is instructed to do | Analyse / verify candidate solutions |
| ------------------------------------ | ------------------------------------ |
| What they can actually produce | “This candidate satisfies the constraint” (feasibility) |
| What they need not produce | A basis that it is **the** constrained optimum |

**Where the LO became a feasibility check:** the collapse is visible at **DLA learner production** (what the learner must produce). EP may have offered an analyse/verify choreography; GAM realised cases. The LO’s optimality operation is not recovered in the task QA describes.

---

## 2. LO4 operation decomposition

**O1. Identify / determine the optimal solution**

Requires a **positive optimality basis** in the introductory taught method, for example (classification only, not a curriculum redesign):

- the candidate satisfies the **taught optimality conditions** (e.g. interior FOCs from A3), not merely the constraint; and/or  
- among **feasible** candidates, this one is best on the **objective**; and/or  
- uniqueness / “this is the candidate the taught method selects”; and/or  
- (if that is the designed A4 grain) λ / tightness supporting “this is the constrained optimum.”

**O2. Verify the original constraint**

Requires substitution / checking **feasibility**: the candidate lies on (or satisfies) the constraint.

**O2 ⇏ O1.** Constraint satisfaction is a **necessary condition** for a constrained optimum, not a **sufficient** justification of optimality. A feasible non-optimum satisfies O2 and fails O1.

QA’s finding is exactly that substitution was treated as if it evidenced O1.

---

## 3. EP responsibility

Pack DLA (`domain-learning-design-step-patterns.md`): DLA **populates** EP beats; it must **not** replan archetype or beat order. EP therefore **owns choreography and LO mapping**, not the wording of `learner_task`.

| Question | Assessment |
| -------- | ---------- |
| Could EP preserve both O1 and O2? | **Yes.** Evaluate (judgement + verification) or analyse (criteria + independent performance + verification) can carry both. |
| Did EP already reduce LO4 to generic analysis/verification? | **Unknown without JSON.** Historical reconstruction is `analyse`. Operator task language is analyse/verify candidates. Default V1 fourth-slot is `evaluate`. |
| Is EP representation **SUFFICIENT / WEAK BUT NOT CAUSAL / CAUSAL**? | **WEAK BUT NOT CAUSAL** on present evidence. Analyse+verification **permits** a feasibility-only episode; it does not force DLA to drop O1. Counterfactual C (§8): DLA can still require optimality judgement inside that choreography. |

EP is **not** the earliest causal layer unless live JSON later shows beats/LO mapping that **exclude** optimality identification. That would upgrade EP; it is not shown now.

**Not A (LO interpretation) as primary:** the operator’s LO4 already contains both operations. Failure is downstream of a usable LO statement.

---

## 4. DLA learner-production responsibility (central)

DLA owns `learner_task` / `expected_output` (commissioning-order step 1; shape: task prose “tied to the LO and episode beats”).

On operator evidence, the realised production is **analyse/verify candidates**, which QA could complete via **constraint substitution**, without requiring:

- which candidate is optimal;  
- why it is optimal;  
- taught optimality conditions vs feasibility;  
- a distinction between feasible and optimal.

**Counterfactual that locates this layer:**

> If GAM had fulfilled every DLA commission **perfectly**, would the activity necessarily have evidenced the **whole** of LO4?

**NO**, if DLA’s production obligation was only candidate/constraint verification. Perfect cases and a perfect workspace still only answer the question DLA asked. Perfect fulfilment of a feasibility task cannot evidence O1.

That is **primarily a DLA reasoning-design / constructive-alignment failure** (outcome C in the primary-question list), not a missing-row or GAM-body failure.

Pack pressure (obligation population, G4 analyse WE+table, DLA-WB-18 scenario) **rewards** “analyse cases in a table.” It does **not** require the table’s learner columns to be an **optimality** judgement. That biases toward a supporting check; it does not write the task by itself.

---

## 5. DLA material / evidence sufficiency

Necessary particulars depend on the **actual** DLA operation.

| If DLA asked… | Particulars needed |
| ------------- | ------------------ |
| O2 only (feasibility) | Candidate(s) + constraint (substitution) |
| O1 + O2 | Those **plus** a basis that distinguishes optimal from merely feasible (objective values to compare; FOC/status of taught conditions; contrasting candidates; or another explicit optimality criterion DLA named) |

On this run, P01 **worked**: cases were commissioned and listed. This is **not** P01 recurring (T-010’s A4 hole was **missing** λ/cases).

If DLA asked only O2, the commissioned particulars may be **sufficient for the DLA task** and **insufficient for LO4**. That is not “wrong materials for a well-asked optimality task.” It is **the wrong reasoning operation**, so material “insufficiency” is **downstream** of §4.

If DLA **did** ask O1 but commissioned only (x, constraint) with no optimality basis, that would be evidence/material **sufficiency** for a well-asked claim — closer to T-031 / P03 content, still not P01 absence.

**On operator evidence (task = verify candidates; QA = feasibility only):** classify as **wrong learner operation first**. Do not relabel it P01. Do not fold it into T-031 unless later JSON shows DLA asked for optimality and GAM’s cases could not support that commissioned judgement.

---

## 6. P02 / evidence semantics

T-020: A4 cases **may** be particulars-as-grounds (`required: true`) when learners derive tightness / meaning **from** those particulars; or `false` if they only apply a taught procedure to given λ. T-028: do **not** “fix” A4 by flipping the boolean.

**This run:** cases exist; a judgement-like analyse/verify task is described. Treating cases as providers can be **semantically correct**.

The defect is not “these are not evidence.” It is that the **claim** they are used to support (feasibility / “valid candidate”) is **weaker than LO4** (optimality).

**Verdict: EVIDENCE SEMANTICS CORRECT, EVIDENCE SUFFICIENCY WRONG — relative to LO4**, not relative to a feasibility-only `learner_task`.

Do **not** set `evidence_decision.required: false` to “fix” alignment. That would collapse a P02-true judgement activity and would not restore O1.

---

## 7. GAM responsibility

GAM Copy: honour purpose; specification as binding; do not redesign the activity (pack GAM; T-024 1:1).

If DLA commissioned “cases for verifying candidates / constraint checks,” GAM **faithfully realising** those cases is **not** a fulfilment failure.

T-031 distinction:

| | This A4 finding |
| - | ---------------- |
| **Operational suitability** | Particulars vs **commissioned** operation |
| **Constructive alignment** | **Commissioned** operation vs **LO** |

Do **not** blame GAM for a reasoning step DLA never commissioned. T-031 remains **partially related** only in the counterfactual where DLA asked O1 and the cases could not support it (T-031 §N). Operator evidence does not establish that counterfactual. **Do not implement T-031 here; do not absorb A4 into T-031.**

---

## 8. Counterfactuals

**A — Keep GAM materials; change only learner reasoning/task**

**Possibly yes**, if the generated cases already contain (or can be read as) an optimality basis (several candidates + objectives, or FOC status + constraint). **Unknown** without case bodies. If cases are only a point and a constraint, A fails even with a better task — then materials/T-031 share the residual. That is a **secondary** branch, not the primary location.

**B — Keep DLA `learner_task`; give GAM richer cases**

**No.** If the task only requires analysing/verifying candidates via the constraint, richer numbers still evidence **O2**. They cannot force the learner to perform **O1**. This is the **discriminating** test.

**C — Keep EP; DLA redesigns production and commissions**

**Yes**, on present evidence. Analyse (or evaluate) choreography can ask: identify which candidate is optimal **and on what taught basis**, then verify the constraint. DLA can commission whatever extra particulars that production needs. Pack “do not replan beats” does not forbid a fuller `learner_task` tied to the LO.

**Earliest causal layer: DLA learner-production design.**

---

## 9. Cross-disciplinary generalisation

Yes. PRISM can confuse a **necessary supporting check** with the **higher-order judgement** the LO specifies.

| Domain | LO | Collapsed task | Lost judgement |
| ------ | -- | -------------- | -------------- |
| **History** | Evaluate which explanation is strongest | Find evidence supporting each explanation | Comparative evaluation |
| **Science** | Determine which model best explains observations | Check compatibility with one observation | Model selection |
| **Statistics** | Select and justify the appropriate test | Check whether one assumption holds | Test choice |
| **Literature** | Evaluate which interpretation is better supported | Find quotations compatible with each | Interpretive evaluation |

**Generic issue:** DLA can design a valid **supporting operation** (compatibility, assumption check, quotation hunt, constraint substitution) that is **necessary but not sufficient** for the mapped outcome’s **claim**.

This is **reasoning-design / constructive alignment**, not operand presence (P01), not evidence-boolean semantics (P02), not empty specification (P03), not T-031 (particulars vs commissioned operation).

---

## 10. Existing DLA guidance

| Surface | What it says | Vs this defect |
| ------- | ------------ | -------------- |
| Commissioning-order **step 1** | Define learner production (`expected_output`, `learner_task` intent) | Names production; does **not** say it must cover the LO’s load-bearing operations |
| Shape `learner_task` | “tied to the LO and episode beats” | **Indirect.** Too weak to stop a supporting-check task that still “mentions” the LO |
| Shape `expected_output` | “what good evidence looks like” / pack AS-05 quality-threshold prose | Quality of the artefact, not O1 vs O2 completeness |
| Checklist spec | Criteria align with task, expected_output, mapped LOs | Aligns **checklist** to the **task**, so it can faithfully check feasibility if that is the task |
| Pack DLA | Obligation population; **avoid LO→task shells**; do not replan EP; DLA-WB-02 map ≥1 LO id | Mapping **ids**, not operations. “Avoid shells” fights empty tasks, not reduced judgements |
| Pack `outcome_alignment` key | In pack output shape | **Not** a partial-v2 DLA contract field; not a live alignment audit of O1 vs O2 |
| Evidence PRE-EMIT / per-activity audit | `required` consistent with **inspecting** particulars | **Competes for attention:** “is there evidence?” not “does production match the LO claim?” |
| `evaluation_judgement` material archetype | Criteria + evidence + justified conclusion | Optional **material** planning; not activity-level LO alignment; A4 need not emit it |
| P01 step 2 | What the learner **acts upon** | Operand role, not which **judgement** |
| P02 | Particulars-as-grounds vs procedure | Can be correct while the grounds only support a weaker claim |
| T-031 (design only, not live) | Particulars usable for **commissioned** operation | Explicitly **not** this LO↔task gap |

**Finding:**

- “Tie task to the LO” **exists indirectly** and is **too weak** (**D** / diluted **B**).  
- The operational principle — **do not treat a necessary supporting check as the LO’s higher-order judgement** — is **genuinely absent** (**C**).  
- Evidence self-audit **exists clearly** for provider **presence vs wording** (P04 estate) and does **not** cover this class; it may **obscure** it by rewarding “cases exist + required true.”

Not mere generative variance of a clear rule (**not A**).

**Do not add guidance in this task.**

---

## 11. Relation to P04

P04 = accumulated DLA **evidence / self-audit** guidance (PRE-DESIGN, PRE-EMIT, per-activity consistency, INVALID–VALID).

Current audits ask: if the task inspects particulars, are providers listed? They do **not** ask: are those particulars **sufficient for the LO’s claim**, or only for a **supporting check**?

| Classification | Why |
| -------------- | --- |
| **P04 MUST PRESERVE A PRINCIPLE BUT NOT SOLVE A4** | Preserve `evidence_requirement.learner_action` / `observable_features` as bounds on **what the judgement inspects** — P04 must not thin them into “any cases.” Do **not** treat provider-presence consistency as constructive alignment. Do **not** absorb A4 into P04. |

Not **DIRECTLY RELEVANT** as “P04’s job to fix A4.” Not **SEPARATE** in the weak sense that P04 could accidentally worsen sufficiency language.

If P04 later **clarifies** the semantic core as “grounds for the **actual learner claim**,” that would **help** A4-class defects without being the A4 solution. That is a **preservation/clarity note**, not P04 design.

**Do not begin P04 from this artefact.**

---

## 12. Validator question

**NO.** “Checking feasibility is insufficient to establish optimality” is semantic/disciplinary reasoning. A generic pipeline must not infer from `learner_task` verbs or from “constraint”/“optimal” tokens that O1 is missing. Same T-010 principle 8 as P01/P02: no prose-heuristic reconstruction of undeclared alignment.

Structural checks (P01 ids, P02 provider closure, P03 non-empty spec) **passed** this class on the 84 run.

---

## 13. QA role

QA correctly detected a real constructive-alignment defect.

**Both:**

- **Expected generative variance** — models often substitute a checkable necessary condition for a harder judgement.  
- **DLA semantic-contract weakness** — nothing operational requires `learner_task` to cover each load-bearing LO operation, or forbids evidencing a supporting check in place of the outcome claim.

QA catching it does **not** mean upstream architecture is adequate.

---

## 14. Ranked root cause

### 1. DLA LEARNER-PRODUCTION DESIGN

**Confidence:** HIGH  

**Evidence:** Operator: task = analyse/verify candidates; QA = feasibility without optimality. Counterfactual B fails. Perfect GAM fulfilment of that task cannot evidence LO4. DLA owns `learner_task` / `expected_output`. Step 1 does not require LO-operation coverage.  

**Counter-evidence:** Live `learner_task` might already ask for optimality and learners/QA still used only the constraint; then production wording and materials would share blame. JSON missing.  

**Implication:** Primary design target is DLA **reasoning/alignment of production to LO operations**, not P01/P02/P03/T-031.

### 2. DLA EVIDENCE SUFFICIENCY (relative to LO4)

**Confidence:** MEDIUM  

**Evidence:** Cases can support O2 without supporting O1. P02 semantics can still be correct.  

**Counter-evidence:** If the task never asked O1, “insufficient evidence” is a description of LO gap, not a separate commissioning miss.  

**Implication:** Sufficiency follows the **claim**. Fix the claim/production first; then commission particulars for **that** claim.

### 3. EXPECTED GENERATIVE VARIANCE

**Confidence:** HIGH as mechanism; LOW as sufficient diagnosis  

**Evidence:** Necessary-condition substitution is a common LLM pattern.  

**Counter-evidence:** Unconstrained by a production-alignment rule, it will recur.  

**Implication:** Keep QA. Do not stop at QA.

### 4. EP CHOREOGRAPHY

**Confidence:** MEDIUM as **weakening**; LOW as **sufficient cause**  

**Evidence:** Historical `analyse`; verification beat; pack populate-don’t-replan; operator “analyse/verify.”  

**Counter-evidence:** Counterfactual C; evaluate template exists for slot 4.  

**Implication:** Do not change EP as the A4 fix. Note analyse/verify **permits** collapse.

### 5. DLA MATERIAL COMMISSIONING (P01-class)

**Confidence:** LOW as this defect  

**Evidence:** P01-R1 worked; cases present. Opposite of T-010 A4 Major.  

**Implication:** Do not reopen P01.

### 6. GAM FULFILMENT

**Confidence:** LOW  

**Evidence:** 1:1; operator faithful generation. Counterfactual B.  

**Implication:** Do not redesign GAM for A4.

### 7. T-031 OPERATIONAL SUITABILITY

**Confidence:** LOW as primary; MEDIUM as **possible secondary** if JSON shows DLA asked O1 and cases could not support it  

**Evidence:** T-031 §N “partially covered.” Operator task language is the weaker operation.  

**Implication:** Keep T-031 deferred after P04. Do not implement it to “fix A4.”

### NOT SUPPORTED

- Flipping P02 to false.  
- Subject-specific optimality validators.  
- Treating A5 visual contradiction as this class (T-030/T-031: **separate**).

---

## 15. Bounded problem statement

**DLA constructive alignment (supporting check ≠ outcome judgement):**

PRISM can design a learner task that performs a **valid supporting check** for a learning outcome while failing to require the learner to perform the **higher-order judgement** the outcome actually specifies.

Distinct from:

| Problem | Difference |
| ------- | ---------- |
| **P01** | Cases/operands were present. |
| **P02** | Cases may correctly be particulars-as-grounds; the **claim** is too weak. |
| **P03** | Spec can be a fine brief for **verification** and still miss LO4. |
| **T-031** | Particulars vs **commissioned** operation. Here the **commissioned operation** vs **LO**. |

The second candidate (“evidence sufficient for a supporting condition vs the learner claim”) is a **true corollary** when the task *does* ask the strong claim with weak grounds. On this run the **smaller** statement is the task collapsing the LO. Adopt the supporting-check formulation as the bounded problem; keep evidence-sufficiency as a dependent clause, not a P02 reopen.

---

## 16. Sequencing

| Option | Assessment |
| ------ | ---------- |
| **A. Solve before P04** | Live prompt add before P04 repeats T-031’s accretion risk (S76-D03). |
| **B. Design before P04, implement after** | **Recommended.** P04 is about to touch evidence audits. A4 shows those audits do **not** equal LO alignment and must **not** be read as such. Design the A4 principle now so P04 **preserves** `learner_action` / `observable_features` and does not “solve” A4 by thinning/keeping the wrong self-audit. Implement A4 **after** P04, like T-031. |
| **C. Let P04 address it directly** | **Rejected.** P04 is evidence-guidance rationalisation, not learner-production↔LO operation coverage. |
| **D. Record and defer all design until after P04** | Weaker: P04 would proceed without an explicit preservation note. |
| **E. Further diagnostic** | **Not required** to locate the layer. Live JSON would quote `learner_task` but would not overturn counterfactual B given QA’s description of what the learner could establish. |

**Recommendation: B.**

Do **not** implement T-031. Do **not** begin P04 from this artefact.

---

## Verdict

**A4 CONSTRUCTIVE ALIGNMENT READY FOR SOLUTION DESIGN**

Primary cause: DLA learner-production collapsing LO4’s optimality judgement into a feasibility check. P01 closed. P02 semantics not the fix. T-031 separate. P04 must preserve a principle, not absorb this problem.

**HARD STOP.** Do not implement. Do not begin P04. Do not implement T-031.

---

*End of S76-T-032.*
