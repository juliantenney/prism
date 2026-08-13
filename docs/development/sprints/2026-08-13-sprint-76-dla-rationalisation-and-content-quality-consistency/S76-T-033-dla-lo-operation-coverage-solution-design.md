# S76-T-033 — DLA LO-operation coverage solution design

**Task:** S76-T-033  
**Problem:** [T-032](S76-T-032-dla-a4-constructive-alignment-diagnostic.md) — PRISM can design a learner task that performs a valid supporting check for a learning outcome while failing to require the higher-order judgement the outcome actually specifies  
**Status:** **Solution design complete** (2026-08-13) — **implementation deferred until after P04**  
**Mode:** DESIGN ONLY — no production code, prompt, schema, validator, test, fixture, EP, DLA, GAM, Design Page, Graphics, QA, workflow, or Settings changes  
**Depends on:** [T-020](S76-T-020-dla-p02-solution-design.md) · [T-021](S76-T-021-dla-p01-solution-design.md) · [T-022](S76-T-022-dla-p03-solution-design.md) · [T-027](S76-T-027-dla-p01-residual-operand-closure-solution-design.md) · [T-031](S76-T-031-generated-operand-operational-suitability-solution-design.md) · [T-032](S76-T-032-dla-a4-constructive-alignment-diagnostic.md)  
**Out of scope:** implementation · T-031 implementation · P04 implementation · P05 · new schema · semantic validators · Bloom/keyword heuristics · EP redesign · GAM compensation

This artefact designs the **smallest durable DLA semantic contract** for LO-operation coverage. It does not rewrite prompts. It does not authorise implementation. Live-prompt change is **deferred until after P04**.

**DESIGN COMPLETE — IMPLEMENTATION DEFERRED UNTIL AFTER P04**

---

## A. Executive design decision

**PROPOSED TARGET CONTRACT**

Keep existing fields. Do not add a decomposition schema, alignment object, or validation subsystem.

Clarify **Activity commissioning order step 1** (already: define learner production via `learner_task` / `expected_output`). That step currently does not say production must cover the mapped outcome’s **load-bearing operations**. Shape copy already says `learner_task` is “tied to the LO” — too weak (T-032).

**Refine step 1** so DLA:

1. reads the mapped LO as **operations a competent observer would need to see demonstrated**, not as a title to restated;  
2. designs `learner_task` / `expected_output` so completing the task **requires those operations**;  
3. does **not** treat a necessary supporting check as sufficient for a higher-order judgement;  
4. applies a one-line counterfactual: if the learner completed the task perfectly, would the work demonstrate the **whole** mapped outcome?

This is **A — clarification of existing constructive-alignment semantics**, not a new contract, not P02, not T-031.

**Recommended intervention:** Option 3 — compact LO-operation coverage principle **in step 1**, including the counterfactual as part of that same planning sentence. No PRE-EMIT block. No domain examples in the live prompt. Unique add ~150–280 characters (Copy ×2 ~300–560).

P01 / P02 / P03 unchanged. EP not redesigned. GAM does not invent the missing judgement.

**LO-OPERATION COVERAGE DESIGN COMPLETE — IMPLEMENTATION DEFERRED UNTIL AFTER P04**

---

## B. Definition of LO-operation coverage

**CURRENT FACT (T-032):** “Tied to the LO” can be satisfied by a task that only performs a supporting check (constraint substitution) while the LO also requires a higher-order judgement (optimality).

**PROPOSED TARGET CONTRACT**

A DLA learner-production obligation is **aligned** when completing it requires the learner to perform every **load-bearing** reasoning or production operation needed for an observer to conclude that the **mapped learning outcome** has been demonstrated.

The brief’s candidate is **accepted** with two refinements:

- coverage is relative to **load-bearing** operations of **this activity’s mapped LO**, not every disciplinarily possible demonstration of the topic;  
- supporting steps may appear **inside** the primary production; they must not **replace** it.

The primary logic is the **observer / perfect-completion counterfactual**, not Bloom verbs, keyword maps, or “and” counting in the LO sentence.

---

## C. Primary vs supporting operation

| | **Primary outcome operation** | **Supporting operation** |
| - | ----------------------------- | ------------------------ |
| Meaning | The judgement, explanation, derivation, evaluation, construction, diagnosis, selection, comparison, or other production the outcome actually requires an observer to see | A necessary check, observation, calculation, classification, evidence-gathering step, or intermediate condition that contributes to the outcome |
| Alone | Demonstrates the outcome (or that part of a compound outcome) | Does **not** by itself demonstrate the outcome |
| A4 | Identify / determine the **optimum** (O1) | Verify the **constraint** (O2) — necessary for a constrained optimum, not sufficient |
| Failure mode | Dropped or relabelled (“valid” = “optimal”) | Performed well and mistaken for the whole LO |

**O2 is still load-bearing in LO4** because the outcome **explicitly** requires it as a second claim. Coverage means **both** primary judgement **and** named supporting claims the LO treats as part of demonstration — not “only O1” and not “O2 standing in for O1.”

**Do not** split every conjunction in an LO into separate activities. If perfect completion of one production already shows all load-bearing operations to an observer, the activity is aligned (Roman Roads / already-good cases).

---

## D. Compound outcomes (no new schema)

**PROPOSED TARGET CONTRACT**

When a mapped LO contains more than one load-bearing claim, DLA **reasons** (internally) about what an observer would need to see. It does **not** emit a new decomposition object.

Planning question (not a field):

> What would a learner have to produce or do for an observer to conclude this outcome has genuinely been demonstrated?

For “identify the optimal solution and verify that it satisfies the constraint,” the observer needs **optimality established** and **feasibility established**. A perfect feasibility-only product fails that question.

No `lo_operations[]`, no `alignment_coverage` flag, no `outcome_alignment` revival on partial-v2 DLA.

---

## E. DLA ownership

**PROPOSED TARGET CONTRACT**

DLA **must**:

- interpret the mapped LO **semantically** (what must be demonstrated);  
- identify its load-bearing learner operations (internally);  
- design `learner_task` so those operations are **required**, not optional labels;  
- write `expected_output` so quality thresholds **evidence those operations**;  
- then commission task inputs / evidence **for that production** (existing P01 → P03 order).

**Minimum generic rule:**

> Completing the activity perfectly must demonstrate the mapped outcome. A necessary supporting check is not a substitute for the outcome’s higher-order operation.

DLA **must not**:

- merely restate LO wording as the task;  
- assume one supporting check demonstrates the whole outcome;  
- push the missing judgement into GAM;  
- rely on QA to repair the design.

DLA does **not** own EP archetype/beat order (pack: populate, do not replan).

---

## F. EP ownership

**CURRENT FACT:** EP owns choreography, archetype, beat order, and LO mapping. DLA owns `learner_task` / commissions. T-032: EP A4 was **WEAK BUT NOT CAUSAL**.

**PROPOSED TARGET CONTRACT**

Unchanged. EP may map LO4 to `analyse` or `evaluate`; both can host O1+O2. Broad beats are **not** a licence for DLA to reduce the LO to verification.

EP **need not** semantically decompose the LO into operations. DLA does that when writing production.

**Do not redesign EP.**

---

## G. GAM ownership

**PROPOSED TARGET CONTRACT**

GAM **must not** repair this class. If DLA commissions a feasibility-check activity, GAM **faithfully fulfils** it (T-024 1:1; T-032 counterfactual B). Inventing an uncommissioned optimality judgement would be pedagogical invention (T-022 / T-031).

Once DLA satisfies this contract, GAM may assume:

- `learner_task` / `expected_output` already name the operations to support;  
- purpose / specification bound the particulars for **those** operations;  
- T-031 then applies: realised particulars must be **operationally suitable** for the commissioned (now LO-covering) operation.

GAM does not re-read the LO to upgrade a weak task.

---

## H. Lagrangian A4 — target chain

| Layer | Target |
| ----- | ------ |
| **LO4** | O1 determine optimality; O2 verify constraint |
| **EP** | Unchanged choreography capable of both (analyse or evaluate) |
| **`learner_task`** | Requires the learner to **establish which candidate is optimal on a taught basis** **and** **verify the original constraint**. Not “check candidates / substitute into the constraint” alone; not labelling feasible as optimal |
| **`expected_output`** | Quality threshold that an observer would accept as **both** optimality reasoning **and** a feasibility check |
| **Task inputs** | Particulars that make **both** operations possible (candidates / cases **plus** a basis that distinguishes feasible from optimal — e.g. objective values to compare, taught optimality-condition status, contrasting candidates — as the designed grain requires) |
| **P02** | May remain `true` if cases are particulars-as-grounds for the **optimality** judgement (and feasibility check). Do not flip to false |

**More data does not fix the existing feasibility-only task.** The **operation** must require optimality reasoning; then particulars are commissioned for that operation (P01/P03), then GAM realises them suitably (T-031).

---

## I. Durable DLA test

**PROPOSED TARGET CONTRACT** — compact counterfactual, planning not audit:

> If a learner completed this task perfectly, could they still fail to demonstrate the mapped outcome because they only completed an intermediate or necessary condition?

**YES** → production is insufficiently aligned; redesign `learner_task` / `expected_output` **before** commissioning materials.

This is a **useful generative principle**. It is general, not Lagrange-specific, and short enough to live **inside step 1**. It is **not** a PRE-EMIT checklist.

---

## J. Cross-disciplinary test

Same rule. No subject-specific prompt branches.

| Domain | Primary outcome operation | Supporting operation (weak task) | Sufficient learner production |
| ------ | ------------------------- | -------------------------------- | ----------------------------- |
| **History** | Evaluate which explanation is strongest | Identify evidence supporting each | Comparative judgement using that evidence |
| **Science** | Determine which model best explains observations | Check compatibility with one observation | Model selection / explanatory fit on the relevant observations |
| **Statistics** | Select and justify an appropriate test | Check one assumption | Test choice with justification (assumptions may be part of that justification, not the whole) |
| **Literature** | Evaluate which interpretation is better supported | Find compatible quotations | Interpretive evaluation using those quotations |
| **Engineering** | Diagnose the most likely fault and justify | Identify abnormal readings | Diagnosis + justification from those readings |
| **Medicine / professional** | Select and justify a management decision | Identify relevant symptoms / criteria | Decision + justification against the framework |

---

## K. Relation to constructive alignment

**A. Clarification of existing DLA constructive-alignment semantics.**

Existing fields are **sufficient**:

| Field | Role |
| ----- | ---- |
| `mapped_learning_outcomes` | Which outcome this activity must demonstrate |
| `learner_task` | Production that requires the load-bearing operations |
| `expected_output` | What good demonstration of those operations looks like |

No new structure. Pack `outcome_alignment` is **not** revived on partial-v2.

Not **B** (new contract). Not **C** (P02). Not a GAM or EP contract.

---

## L. Relation to P02

**CURRENT FACT (T-020 / T-032):** A4 cases can correctly be particulars-as-grounds (`required: true`) while still only supporting a **weaker claim**.

| | Meaning |
| - | ------- |
| **EVIDENCE ROLE** | Are these particulars grounds for inference/judgement? (P02 boolean + provider fields) |
| **EVIDENCE / REASONING SUFFICIENCY FOR THE CLAIM** | Given the **actual** learner claim, do the grounds + required reasoning establish **that** claim — and is that claim the **LO**? |

P02 answers role. This design answers **whether the claim is the LO’s load-bearing operations**. Do **not** expand `evidence_decision`. Do **not** set `required: false` to “fix” A4.

`evidence_requirement.learner_action` / `observable_features` should describe inspection for the **aligned** judgement once step 1 is correct. They do not replace step 1.

---

## M. Relation to P03 / T-031 — ordering

```text
LO  (what must be demonstrated)
  → learner operation   T-033  DLA production covers load-bearing LO operations
  → task/material needs T-021  P01 operands for that operation
  → material commission T-022  P03 purpose/specification bounds
  → suitable fulfilment T-031  GAM particulars usable for the commissioned operation
```

| | Question |
| - | -------- |
| **T-033** | Did DLA ask the learner to perform the **right** operation(s)? |
| **P01** | Are the objects of that operation commissioned and listed? |
| **P03** | Is the commission bounded enough that GAM need not invent the job? |
| **T-031** | Given the right operation, can the generated operand **support** it? |
| **P02** | Are those particulars **grounds** (independent boolean)? |

Wrong order (commission cases, then hope the task is an LO) is how A4 collapsed. P04 rationalisation should not invert this order.

---

## N. DLA prompt surface (do not edit now)

| Surface | Classification |
| -------- | -------------- |
| Commissioning-order **step 1** (“Define the learner production obligation”) | **ESSENTIAL.** Later implementation **replaces/extends this step only**. |
| Shape `learner_task`: “tied to the LO and episode beats” | **SECONDARY.** After P04, one aligned phrase is enough; do not keep a second copy of the full principle. |
| Shape `expected_output`: “what good evidence looks like” | **SECONDARY.** Quality of the product; may later say it evidences the mapped outcome’s operations. Do not duplicate the step-1 rule. |
| Checklist “align with mapped LOs” | **SECONDARY.** Aligns checklist to the **task**; harmless if the task is aligned, misleading if not. Do not hang the principle here. |
| Pack “avoid LO→task shells”; DLA-WB-02 map LO ids | **SECONDARY / pack.** Id mapping ≠ operation coverage. Do not add a pack branch in this design. |
| PRE-DESIGN / PRE-EMIT / per-activity evidence audit / INVALID–VALID | **DO NOT TOUCH UNTIL P04.** Provider-presence consistency, not LO-operation coverage. |

**One core semantic location after rationalisation:** commissioning-order **step 1**.

Conceptual later wording (not shipped): keep “define learner production”; add that `learner_task` / `expected_output` must require every load-bearing operation of the mapped LO; a supporting check is not a substitute; if perfect completion would still miss the outcome, redesign production before commissioning materials.

---

## O. Evidence-guidance interaction (P04 input, not P04)

| Guidance | Classification | Note |
| -------- | -------------- | ---- |
| `learner_action` / `observable_features` (what to inspect for the judgement) | **PRESERVE PRINCIPLE** | Grounds for the **actual** claim, once the claim is LO-aligned |
| Delayed disclosure / do not pre-state the judgement | **PRESERVE PRINCIPLE** | Orthogonal; keep |
| PRE-EMIT: attachments / conversation_attachment / required:false vs inspect wording | **CONSOLIDATE** (P04) | Existence and provenance consistency |
| Per-activity evidence-decision consistency audit | **CONSOLIDATE** | Same consistency story as PRE-EMIT |
| INVALID / VALID contrast (`required: false` + “analyse supplied case evidence”) | **REDUNDANT** | Third copy of the consistency story |
| “Providers exist ⇒ evidential activity is done” (implicit if audits dominate step 1) | **POTENTIALLY DISTRACTING** | Encourages presence of particulars over sufficiency of **production** for the LO |
| Step 1 as currently written | **PRESERVE SURFACE, REFINE LATER** | Too thin; this design’s home |

P04 **may** thin the triplicate evidence-consistency audits. That thinning **does not** implement T-033. P04 **must not** treat remaining evidence audits as LO-operation coverage.

---

## P. Counterfactual test verdict

The perfect-completion test is **sufficiently general**, **better as a planning principle** (inside step 1), and **not redundant** with “tied to the LO.”

It is **audit-like** only if implemented as a new PRE-EMIT section — **rejected**. One sentence in step 1 is planning, not a stack.

---

## Q. Schema / validator impact

| Change | Decision |
| ------ | -------- |
| **SCHEMA** | **NO** |
| **DETERMINISTIC VALIDATOR** | **NO** |

This is semantic reasoning over LO meaning and learner production. Bloom maps, keyword matching, noun/verb heuristics, semantic regexes, and subject-specific optimality checkers remain **out** (T-010 principle 8; T-032 §12).

Structural P01/P02/P03 stay as they are. They will not detect A4-class collapse.

---

## R. Design options

### Option 1 — Clarify `learner_task` / `expected_output` alignment wording only

- **Effectiveness:** LOW–MEDIUM. “Tied to the LO” already exists and failed.  
- **Prompt cost:** ~40–80 unique (shape).  
- **Duplication:** Low.  
- **Evidence audits:** Untouched; still dominate attention.  
- **P04:** Compatible but weak.

### Option 2 — Compact LO-operation coverage principle in the planning sequence (step 1), no counterfactual

- **Effectiveness:** MEDIUM–HIGH. Names supporting-check ≠ judgement.  
- **Prompt cost:** ~120–200 unique.  
- **Duplication:** Low if shape is not also expanded.  
- **Evidence audits:** Still separate (P04).  
- **P04:** Compatible.

### Option 3 — Principle + one-line counterfactual **in the same step 1** **(recommend)**

- **Effectiveness:** HIGH for the diagnosed class; operational test without verb lists.  
- **Prompt cost:** ~150–280 unique; assembled ×2 ~300–560.  
- **Duplication:** Avoid a second copy in PRE-EMIT or shape.  
- **Evidence audits:** Distinct; P04 can still consolidate those.  
- **P04:** Compatible: live add **after** P04 so the new sentence is not immediately rationalised; P04 must **keep step 1 as the refinement surface**.

**Recommend Option 3** as the smallest **robust** option. Option 1 is the status quo. Option 2 lacks the test that makes the principle checkable during generation.

---

## S. Prompt-budget discipline

| | Unique | Assembled ×2 |
| - | ------ | ------------ |
| Target (Option 3, replace/extend step 1) | **~150–280** | **~300–560** |
| Rejected | New PRE-EMIT section; domain example list; second shape paragraph repeating the full rule | |

Prefer **replacement** of the current short step-1 sentence over appending a sixth commissioning step. If implementation creeps past ~300 unique, cut examples, not the counterfactual.

T-031’s later DLA add (step 3, ~120–250) is **separate** and also post-P04. Do not merge T-031 and T-033 into one paragraph (different questions: operand suitability vs LO coverage). Sequential post-P04 implementation should keep them as **two short refinements of two existing steps**.

---

## T. Acceptance criteria (future implementation)

**Lagrangian A4**

- Learner production requires **both** optimality judgement and feasibility check.  
- `expected_output` evidences both.  
- Necessary particulars support both.  
- P02 may remain `true` where cases are grounds for that judgement.

**Cross-disciplinary**

- A supporting check cannot silently replace the higher-order outcome judgement.

**Architecture**

- no new schema;  
- no semantic validator;  
- no GAM compensation;  
- no EP redesign;  
- no extra workflow stage;  
- no large self-audit / PRE-EMIT block;  
- unique add in the §S band; still only the existing two DLA contract/shape injection sites.

**Roman Roads / already-good cases**

- Do **not** force unnecessary decomposition when perfect completion already demonstrates the mapped outcome. The counterfactual is the test, not mandatory splitting of every “and.”

**Tests (when implemented):** prompt-surface assertions on step 1 only. No new Gate A semantic cases.

---

## U. P04 sequencing and protection

**Confirm:** design now; **live implementation after P04**. Same rationale as T-031 / T-032 option B. Shipping step-1 prose before P04 would add unique DLA text that P04 would then have to rationalise (S76-D03).

Do **not** fold T-033 into P04. P04 is evidence-guidance accretion, not LO-operation coverage.

**P04 must preserve**

| Surface | Why |
| ------- | --- |
| Commissioning-order **step 1** as the learner-production planning home | This design refines it later |
| Learner-production ownership (`learner_task` / `expected_output` are DLA’s) | EP still does not write the task |
| `evidence_requirement.learner_action` / `observable_features` | Grounds for the **actual** judgement; do not thin to “any cases” |
| Distinction: evidence **existence** ≠ sufficiency for the **learner claim** / LO | T-032 / this §L |
| Ordering: LO → operation → materials → fulfilment | §M |

**P04 may safely remove / consolidate** (does **not** contribute to LO-operation coverage):

- duplicate PRE-EMIT vs per-activity vs INVALID/VALID **evidence-decision consistency** copies of the same provider-presence story (keep **one**);  
- wording that only asks whether particulars are **inspected**, if a surviving single audit still closes `required` vs inspect-language.

That consolidation is **P04’s job**. It is **not** T-033 implementation.

**Do not implement or design P04 from this artefact. Do not implement T-031 from this artefact.**

---

## V. Risks / unresolved

| Risk | Handling |
| ---- | -------- |
| DLA over-splits every compound LO | Acceptance: Roman Roads / perfect-completion already aligned → no extra split |
| Step 1 grows examples (history/science lists) | Forbidden in live prompt; tables in this artefact only |
| Implementer puts the counterfactual in PRE-EMIT | Forbidden; step 1 only |
| Merge with T-031 step 3 | Different questions; two short existing-step refinements after P04 |
| Live A4 JSON still missing | Does not block this design (T-032) |

---

## W. Verdict

**LO-OPERATION COVERAGE DESIGN COMPLETE — IMPLEMENTATION DEFERRED UNTIL AFTER P04**

Option 3 accepted as design. P01/P02/P03 preserved. No schema. No validator. No EP/GAM redesign. No P04 implementation from this artefact. No live prompt change from this artefact. No T-031 implementation.

**HARD STOP.**

---

*End of S76-T-033.*
