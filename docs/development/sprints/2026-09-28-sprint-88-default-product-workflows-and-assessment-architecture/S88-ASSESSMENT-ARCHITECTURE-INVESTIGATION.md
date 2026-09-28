# Sprint 88 — Assessment Architecture Investigation

**Whether Assessment is a distinct educational object**

**Sprint:** 88  
**Task:** [S88-T-013](PLAN.md)  
**Authorisation:** [S88-D12](decisions.md#s88-d12--authorise-the-assessment-architecture-investigation)  
**Date:** 2026-09-28  
**Mode:** Investigation only. No production change. No Assessment product. No topology. Design Assessment is not repaired.

### How to read this document

| Marker | Meaning |
| ------ | ------- |
| **Fact** | Repository evidence: code, pack, contract, or a dated decision |
| **History** | What a sprint decided or recorded, in its own terms |
| **Inference** | Conclusion from those sources |
| **Not adopted** | A working distinction tested here, not a product decision |

---

## 1. What this investigation tested

**Not adopted.** A useful working split, tested against the record:

- Interactive designs activity through which learning develops, including formative evidence and feedback where appropriate.
- Expository designs explanation through which understanding develops.
- A possible Assessment product would design evidence from which achievement of intended learning can be judged.

The test question was: what evidence would allow a defensible judgement about whether intended learning has been achieved?

**Inference.** That wording is a fair description of a responsibility PRISM has named and only partly built. It is not a description of what the live first-class Interactive or Expository products actually emit. Interactive formative work supports learning. The older assessment stages aim at items and, sometimes, a blueprint for those items. Neither layer, today, records a judgement that intended learning has been achieved.

---

## 2. History, compressed

| When | What entered or changed | Educational problem named in the record |
| ---- | ----------------------- | ---------------------------------------- |
| Learning Design principles | “Assessment must provide credible evidence of learning.” | Evidence of learning, not yet a product |
| Sprint 23 (2026-05-18) | Authority model: Design Assessment owns **what** is assessed; Generate Assessment Items owns **how** items are generated | Blueprint versus item realisation were being mixed |
| Sprint 26 | Traced item output into the page renderer; elicitation could decide product shape before an explicit product chooser | Items were a workflow outcome, not a Create product |
| Sprint 27 | Investigated assessment and feedback semantics: strong item-bank fields; weak timing, reveal, discussion, and diagnostic stance | Generating items is not the same as modelling assessment pedagogy |
| Sprint 58 (partial pages, cited by later diagnostics) | Live Generate Assessment Items output became `assessment_check.items[]` on a partial page, not a freestanding `assessment_items` document | Items had to land in the learner page |
| Sprint 72 | Evidence-centred **activities**: system-generated and source-bound evidence inside DLA/GAM. [S72-D11](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md) refused a new assessment stage | “Make activities use evidence for reasoning,” not a new assessment pipeline |
| Sprint 75 | [S75-D11](../2026-08-10-sprint-75-prism-user-experience-and-interface/decisions.md) Create products were Self-study and Workshop only. An assessment pack was explicitly not a Create option | Authors were not offered “create an assessment” |
| Sprint 80 | Closeout ([S80-D07](../2026-08-26-sprint-80-settings-discovery-product-value-and-policy-architecture/decisions.md), 2026-08-28): alpha assessment is **items-first**. Quantity and difficulty are governed. Design Assessment is **not required** for alpha | A usable self-study/workshop resource, not a complete assessment-design system |
| Sprint 88 | Normal first-class families exclude the assessment stages. The stages remain reachable on Custom/legacy paths. [S88-AD-001](ARCHITECTURAL-DEBT.md) records the dead blueprint-retention arm | Topology cleanup must not be mistaken for an Assessment design |

**History.** Sprint 23 did not reject blueprints. It separated them from item writing. Sprint 80 did not repeal that split. It said the alpha resource does not need the blueprint step. Sprint 72 put a different kind of evidence inside activities and forbade a new stage for that slice. Later work narrowed and bypassed the blueprint path for ordinary products. It did not replace the educational idea of “what would count as evidence of achievement.”

---

## 3. The three layers

### Layer A — Interactive formative path

**Fact.** The normal Interactive family includes Design Episode Plan, Design Learning Activities, and Generate Activity Materials. DLA can commission `evidence_requirement`. GAM realises inspection, verification, and similar materials. The learner renderer turns those into workspaces. GAM refuses `assessment_check` on its own stage.

**Fact.** [S72-D10](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md) through [S72-D12](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md): evidence is for reasoning inside activities; it is selective; the slice must not add a pipeline stage.

| | |
| --- | --- |
| Educational object | A learning activity that may ask the learner to use evidence and produce work |
| Intended user | The learner of an Interactive resource; the author designs the activity |
| What the learner produces | Workspace entries, checks inside the activity, not a scored achievement record |
| Formative / summative | Formative, and only when the activity needs it |
| Evaluates achievement? | No. It supports learning |

### Layer B — Assessment-design and item machinery

**Fact.** Still in the Learning Design catalogue, and **not** in the new first-class families: Design Assessment, Generate Assessment Items, Design Feedback, Design Marking Rubric, Validate Learning Design, Revise Assessment Based on QA.

**Fact.** Sprint 23 model: Design Assessment emits an `assessment_blueprint` (coverage, difficulty policy, item count, question strategy) and must not emit items. Generate Assessment Items emits concrete items. Live output is a partial page with `assessment_check.items[]`. The Check control in the learner renderer scores evaluable multiple-choice and true/false items. That is a self-check of items, not a stored judgement of a learner against outcomes.

| | |
| --- | --- |
| Educational object | A specification of what would be asked, and/or the questions themselves |
| Intended user | An author building a question set; the learner may then attempt the items |
| Formative / summative | Neutral machinery. Brief factors can say formative or summative. The stages do not implement a summative judgement |
| Evaluates achievement? | The Check control marks item responses. It does not judge whether intended learning was achieved |

**Inference.** A and B are distinct. A uses evidence so the learner can reason. B specifies or writes questions about learning. They share words (“assessment”, “evidence”, “feedback”) and they do not share a contract or a stage. Forcing them into one workflow would mix “learn by doing” with “items that can be checked.”

### Layer C — a possible product

**Fact.** Create has never offered an Assessment product. [S75-D11](../2026-08-10-sprint-75-prism-user-experience-and-interface/decisions.md) kept an assessment pack out of scope. This investigation does not design one.

---

## 4. What “assessment” means in the repository

| Term | Distinct object |
| ---- | ---------------- |
| Assessment (principle) | Credible evidence of learning |
| Formative assessment (Interactive activities) | Practice and reasoning inside an activity |
| Learner evidence / `evidence_requirement` | Material the activity asks the learner to use or produce |
| Assessment item / `assessment_check` | A question with a checkable or stated answer |
| Assessment blueprint | A plan of coverage, difficulty, count, and question strategy — not the questions |
| Feedback | Several things: item-level reveal, a Design Feedback pack, and in-activity guidance |
| Marking rubric | A judgement scheme for human marking; rare and usually pruned |
| Check | The learner-page control for some item types |
| Validate / QA | A review of the assessment design, not of a learner |

**Inference.** “Assessment of learning” (evidence from which achievement could be judged) is closest to blueprint, items, and rubric. “Assessment for learning” is closest to layer A. The repository supports that distinction by having built them apart. It does not use those two phrases as product names, so they should not be imposed as labels.

---

## 5. Design Assessment

**History.** Sprint 23 rule A1: Design Assessment owns what is assessed. Rule A2: Generate Items owns how questions are written, subject to the blueprint. Downstream feedback, page, QA, and rubric were named as consumers, not as the assessment authority.

**Fact.** The blueprint object can carry purpose, coverage, difficulty, and quantity. Generate Assessment Items can run without it. Brief mappings already send count and difficulty straight to the item step. [S80-T-011](../2026-08-26-sprint-80-settings-discovery-product-value-and-policy-architecture/S80-T-011-design-assessment-topology-and-cai-relationship-diagnostic.md) records that ordinary formative briefs deliberately exclude Design Assessment (`defaultExclude`), and that the blueprint keep-path is additionally dead because of declaration order. That dead path is [S88-AD-001](ARCHITECTURAL-DEBT.md). This investigation does not repair it.

**History.** Sprint 80’s alpha close says Design Assessment is not required for the working self-study and workshop paths. That is simplification for alpha, not a decision that “what is assessed” stopped mattering. The diagnostic calls the rarity intentional and the blueprint-retention bug accidental.

**Judgement for this report, not a product decision.** Design Assessment is an **obsolete implementation of a still-useful responsibility**. The useful responsibility is: decide what evidence would support a judgement of intended learning, before or apart from writing the questions. The current step, its trigger, and S88-AD-001 are not a healthy implementation of that responsibility. There is enough evidence to say the idea is not superseded. There is not enough evidence to say the existing step should be revived as-is.

---

## 6. Generate Assessment Items

**Fact.** It consumes learning outcomes, and optionally a blueprint and a knowledge model. It produces `assessment_check.items[]`. The pack has long declared several response shapes (multiple choice, true/false, short answer, essay, mixed). Sprint 80’s contract diagnostic treated only single-answer multiple choice and true/false as end-to-end on the interactive Check path. Count and difficulty are parameters. A blueprint is optional in the live contract, not required in principle by the stage’s own dependency (`learning_outcomes` or `assessment_blueprint`).

**Inference.** Generate Assessment Items is **assessment authoring**: it writes the questions. It is only **assessment design** insofar as question type, count, and difficulty are chosen on the same step when no blueprint exists. Writing questions is not a complete account of judging whether learning was achieved. It is the part of that account alpha actually shipped.

---

## 7. Why the Interactive formative path stayed in activities

**History.** [S72-D11](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md): the evidence-centred slice must stay in the activity pipeline. The point was that learners use evidence to reason, not that PRISM score them.

**Inference.** That path should stay intrinsic to Interactive even if an Assessment product exists later. An Interactive resource can include formative activity without becoming an assessment. An Assessment product, if it existed, would answer a different request: design the evidence by which achievement can be judged. Sprint 72’s refusal of a new stage is about layer A. It is not a veto on layer C.

---

## 8. Does Assessment meet the first-class test?

The Sprint 88 criterion is a coherent educational object, a defined workflow family, and meaningful parameters, without a model inventing the topology. Topology is **not** specified here.

| Question | Finding |
| -------- | ------- |
| Distinct object? | **Inference: yes, as a purpose.** “Evidence by which intended learning can be judged” is not an Interactive activity and not an Expository explanation |
| Stable enough to name? | **Inference: the purpose is stable. The implementation is not.** Blueprint, items, and check have been narrowed and split |
| A recognisable design process? | **History: Sprint 23 named one** (decide what is assessed, then author items, then optional feedback, rubric, and review). Alpha usually performs only the authoring step |
| Would an author choose “Assessment”? | **Not evidenced as a Create option.** [S75-D11](../2026-08-10-sprint-75-prism-user-experience-and-interface/decisions.md) withheld it until a product contract existed. The educational request is recognisable; the product choice has never been offered |
| Parameterisable without inventing topology? | **Possible, not shown.** Count, difficulty, question type, and coverage already exist as parameters of the item stage. That does not prove a whole product family |
| What belongs? | Deciding what would count as evidence of achievement; authoring the tasks or items that elicit it; optional checking, feedback, and a rubric where a human must judge |
| What does not belong? | Interactive activities whose job is learning; Expository explanation; slides, VLE, and learning objects; QA stages that only audit the design |
| Clarify or repackage? | **Inference.** A product organised around the judgement question would clarify the pile of stages. Treating those stages as the product would only repackage residue |

**Recommendation, not a decision.** There is evidence for a coherent Assessment purpose. There is not yet a decision that it should be a first-class product, and this report does not make one.

---

## 9. Scope, without a taxonomy

Dimensions that already appear in the repository, and how they behave:

| Dimension | How it shows up | Kind |
| --------- | --------------- | ---- |
| Formative vs summative | Brief factor `assessment_strategy`. Does not choose a different stage family | Parameter, weakly consumed |
| Diagnostic stance | One of the few intents that still keeps Design Assessment | Possible structural option, currently a heuristic |
| Question type, count, difficulty, coverage | Item-stage parameters | Parameters |
| Selected response vs constructed response | Declared on items; only some types are checkable in the page | Parameter, with a capability gap |
| Item vs a whole test | The item step emits a set; it does not model a timed test administration | Not a separate product in the record |
| Rubric / human judgement | Separate rare stage | Possible companion responsibility, not a second product |
| Feedback | Split across item reveal, Design Feedback, and activities | Must not be one control without a later decision |
| Grounding in outcomes or source | Outcomes are the normal input; knowledge model and source are optional context | Parameter / input, not a new product |

**Inference.** These are mostly parameters of one purpose, not several products. Diagnostic design and human-marked work are the only variations that have ever looked structurally different, and both are marginal in the live alpha path.

---

## 10. Relationship to Learning Design

| Option | Fit to the evidence |
| ------ | ------------------- |
| A. A Learning Design product beside Interactive and Expository | Fits the purpose test. Not authorised |
| B. Only a capability inside other products | Fits layer A, and the alpha item path when an author happens to want questions. It does not fit a resource whose only job is evidence of achievement |
| C. Both a product and a capability | **Closest inference.** Formative activity stays inside Interactive. A standalone assessment could exist when that is what the author is creating. Item authoring could later be reused by that product. This is not a decision |
| D. Something else | No evidence for an object outside Learning Design |

**Fact.** An assessment design in the pack normally wants learning outcomes. It does not require an Interactive or Expository page. Nothing in the first-class families feeds an Assessment product, because that product does not exist. Interactive formative work does not require the item stages.

---

## Answers

1. **What existing machinery designs.** Two different things. Layer A designs learning activities that may use evidence. Layer B designs a question plan and/or the questions. Neither designs a recorded judgement that learning was achieved.

2. **Are they distinct?** Yes. Different contracts, stages, renderer surfaces, and sprint decisions.

3. **Evidence for a first-class Assessment product?** Evidence for a distinct purpose. No decision, and no topology.

4. **Responsibility it would own, if authorised later.** At the highest level: design the evidence from which a defensible judgement of intended learning could be made.

5. **Relevant existing machinery.** Learning outcomes as input. The blueprint idea (what is assessed). Generate Assessment Items (authoring). Check, for item types that can be checked. Rubric and Design Feedback only where judgement or response guidance is actually part of that evidence.

6. **Elsewhere or residual.** Interactive DLA/GAM evidence stays on Interactive. Validate Learning Design and Revise Assessment Based on QA are design-audit residue. Slides, VLE, and learning objects are unrelated. The current Design Assessment step is not a healthy owner of the blueprint idea (S88-AD-001 and the alpha bypass).

7. **Smallest decisions still required before any Assessment architecture is planned.**  
   - Is the purpose above accepted as the object, or rejected?  
   - If accepted, is it a Learning Design product, only a capability, or both (section 10, option C)?  
   - Does “what is assessed” remain a responsibility separate from writing questions, or is item authoring enough?

No workflow is specified until those are answered.
