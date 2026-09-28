# Sprint 88 — Assessment Pack architecture plan

**Planning from responsibilities, not from the old stage catalogue**

**Sprint:** 88  
**Date:** 2026-09-28  
**Authorisation:** [S88-D16](decisions.md#s88-d16--open-the-assessment-pack-architecture-planning-pass)  
**Product direction:** [S88-D13](decisions.md#s88-d13--adopt-assessment-pack-as-a-first-class-learning-design-product) · [S88-D14](decisions.md#s88-d14--assessment-is-both-a-product-and-a-capability) · [S88-D15](decisions.md#s88-d15--assessment-design-and-assessment-authoring-stay-distinct)  
**Mode:** Specification only. No production change. No implementation. Design Assessment is not repaired. Interactive is not redesigned.

### How to read this document

| Marker | Meaning |
| ------ | ------- |
| **Adopted** | Decided in S88-D13–D15 |
| **Plan** | Architecture for a later implementation. Not authorised to build |
| **Preserved** | Stays runnable. Not removed and not absorbed |
| **Supersede** | Do not carry the old stage forward as the Assessment Pack implementation |

---

## 1. Adopted product

**Adopted.** Assessment Pack is a first-class Learning Design product beside Interactive Resource (Self-study and Workshop variants) and Expository Resource. Create does not offer it yet.

**Adopted definition.** An Assessment Pack provides a deliberately designed set of opportunities for learners to demonstrate achievement of intended learning, together with the means by which that evidence can be judged and appropriate feedback provided.

Its design responsibility is to decide what evidence would support a defensible judgement of that learning. Its authoring responsibility is to create the components that elicit the evidence. The means of judgement are designed into the pack. PRISM does not itself award the achievement.

**Adopted.** That is different from Interactive, whose formative activity → evidence → materials/workspace path stays inside Interactive. Formative checking inside an Interactive resource does not make it an Assessment Pack.

---

## 2. Responsibilities before stages

A stage is justified only when it is a distinct intellectual transformation. Everything else is a parameter, a field on a contract, or renderer behaviour.

| Responsibility | Purpose | Needs | Produces | Consumed by | Stage? |
| --- | --- | --- | --- | --- | --- |
| Establish intended learning, when it is not already available | The pack must know what achievement means | Topic and/or source | Learning outcomes, and content or a knowledge model only if outcomes cannot be written safely without them | Assessment design | **Prefix stages already in PRISM**, only on a documented starting-point variant. Not new assessment stages |
| Assessment design | Decide what evidence would support a judgement of those outcomes | Outcomes; purpose; extent; grounding | An evidence plan for the pack | Assessment authoring | **Yes.** This is not writing the questions |
| Assessment authoring | Create the learner-facing components that elicit that evidence, including the information needed to judge each component | The evidence plan | The pack of components | Learner rendering, later | **Yes.** One authoring transformation for a heterogeneous pack |
| Judgement design as a general scheme | Decide whether evidence is checkable, comparable to an expected answer, criteria-based, or human-judged, and how components weigh in the pack | Outcomes and purpose | Fields on the evidence plan, then realised on each component | Authoring | **No separate stage.** Pack-level posture is part of design. Component keys, exemplars, and criteria are part of authoring |
| Feedback | Say whether and when a learner should see a result, an exemplar, or guidance | Purpose and component type | A pack-level posture plus optional generated text on a component | Renderer | **No stage** |
| Learner-facing arrangement | Order, instructions, choice sets, and what stays hidden until attempt | The authored pack | The same pack object, rendered | The learner | **No model stage.** Deterministic presentation, as page assembly is for other products |
| Audit of the design | Review the assessment for flaws | The pack | A review note | An author on a custom path | **Not in the product family** |

---

## 3. Assessment design

**Plan.** The design stage determines, for the pack and for each planned component:

- which learning outcomes the pack addresses;
- what a learner must do or produce to demonstrate each of those outcomes;
- coverage across outcomes, including any outcome deliberately not addressed;
- breadth versus depth;
- appropriate challenge;
- the evidence form (selected response, short constructed response, extended writing, and so on);
- how many components, and their balance;
- where the learner may choose among components;
- why that evidence is a valid sign of the intended learning;
- whether a response can be checked objectively, compared with an expected or model answer, judged against criteria, or requires substantial human judgement;
- how the components add up to one pack, including optional weighting when a combined quantitative result is required ([S88-D20](decisions.md#s88-d20--weighting-is-optional-and-separate-from-purpose));
- when diagnostic intent is present, what distinctions in learner understanding the evidence is meant to reveal ([S88-D19](decisions.md#s88-d19--diagnostic-intent-is-orthogonal-to-formative-and-summative-purpose)).

**Plan — successor object.** Replace reliance on the historical `assessment_blueprint` with an **evidence plan**. The old blueprint’s useful ideas (coverage, difficulty, count, question strategy) are not a sufficient contract: it was tied to one item-generation step, it did not have to say how evidence would be judged, and its live step is not healthy (S88-AD-001). The evidence plan is the design output. It is not the learner-facing pack and it contains no finished stems or essays.

---

## 4. Assessment authoring

**Plan.** One authoring stage turns the evidence plan into **assessment components**. Response type is a property of a component, not a stage and not a product variant.

The contract must allow a heterogeneous pack. The set below is illustrative, not closed:

| Component form | Rough scale | Belongs as |
| --- | --- | --- |
| Multiple choice, single answer | One stem, one key | A component |
| Multiple choice, more than one answer | One stem, a key set | A component |
| Short constructed response | About 50 words or fewer | A component |
| Shorter written response | About 500 words or fewer | A component |
| Essay | Extended writing | A component |
| A choice set | Several essay (or other) prompts, of which the learner attempts one or more | A group of components plus a choice rule on the pack |

Type-specific generation (options and a key, versus a prompt and criteria) happens inside that one stage, driven by the component’s form. It does not add stages.

**Plan — relationship to Generate Assessment Items.** Reuse the idea of a partial-page item list and the Check contract for objectively checkable forms. Supersede the stage as the product’s authoring implementation: its contract is item-centric, blueprint-optional, and not able to carry essays, choice sets, criteria, and pack structure as one object. A broader **assessment pack** contract succeeds `assessment_check` as the product output, and may embed checkable items in the same shape Check already understands.

---

## 5. Judgement and marking

**Plan.** Judgement is a combination with clear ownership, not its own stage.

| Owned by assessment design | Owned by component authoring |
| --- | --- |
| Whether each planned component is objectively checkable, comparable to an expected answer, criteria-based, or human-judged | The correct answer or answer set, when the form has one |
| That the evidence form matches that judgement kind | Acceptable-answer guidance, when a short response has a bounded target |
| Pack-level weighting, when a combined quantitative result is required, whatever the principal purpose | A model or exemplar answer, when one helps judgement or later feedback, and not otherwise |
| | Marking guidance, criteria, or a rubric for that component, when judgement is not a key |

Automatic marking is a property of objectively checkable components only. A model answer is not required for every component. An essay without criteria is an incomplete component. A multiple-choice item without a key is an incomplete component. A separate Design Marking Rubric stage is not part of the family; rubric content lives on the component, or on the pack when one rubric covers the whole pack.

---

## 6. Feedback

**Plan.** Feedback is not the historical Design Feedback stage.

| Concern | Where it lives |
| --- | --- |
| Whether feedback is appropriate at all | Pack parameter (purpose) |
| Immediate, delayed, or withheld until a human responds | Pack parameter: feedback posture |
| Answer-specific comment, general comment, or none | Component field, authored only when the posture asks for generated feedback |
| Revealing a model or exemplar | Component field plus renderer behaviour under the posture |
| Learner self-review against criteria | Renderer behaviour, using criteria already on the component |
| Model-assisted review | Out of this plan. Not a stage |
| Human feedback | Runtime. The pack may say it is expected. PRISM does not generate the teacher’s response |

One “feedback mode” enum is not justified. Posture (when, and whether) is pack-level. Content (what is said) is per component, and only generated when the posture requires it.

---

## 7. Parameters and structural choices

**Plan.** Ordinary detail must not cause a model to invent the topology.

**Ordinary parameters.** Principal purpose (formative or summative). Diagnostic intent, orthogonal to that purpose, and not a stage. Extent. Difficulty or challenge. Outcome coverage emphasis. Which response forms may appear. How many components, as a target rather than a stage switch. Optional weighting when components must contribute to a combined result. Feedback posture. Judgement posture at pack level (the design still decides per component). Source or knowledge grounding as context, not as a different product.

**Explicit structural choices.** Starting point: topic; authoritative source; or a completed Interactive or Expository product output treated as that source. Learner choice is a field on the evidence plan (a choice set), not a separate workflow. Target component count is a scope parameter, not a starting point.

**Downstream reasoning.** How to sample a topic into outcomes. How to phrase a stem. Whether a particular essay needs a rubric sentence. Those belong to the prefix stages or to authoring.

**Topology changes.** Only the starting-point prefixes in §8. Purpose, diagnostic intent, and weighting do not add or remove the two assessment stages.

---

## 8. Inputs and starting points

**Plan — minimum to instantiate.** Product (Assessment Pack), focus (what the assessment is about, in the author’s words), and starting point. Learning outcomes are required **before assessment design runs**. They are not always required **before the workflow exists**.

| Starting point | Workflow prefix | Then |
| --- | --- | --- |
| Learning outcomes supplied directly | None | Plan Assessment Evidence → Author Assessment Components |
| Existing Interactive Resource | None. That resource’s established Learning Outcomes are passed in. They are not regenerated from the original brief. The Interactive workflow is not copied into this one | The same two assessment stages |
| Topic | Generate Learning Content → Model Knowledge → Define Learning Outcomes | The same two assessment stages |
| Authoritative source | Normalize Content → Generate Learning Content → Model Knowledge → Define Learning Outcomes | The same two assessment stages |

**Adopted (S88-D17, S88-D18), corrected (S88-D24).** Topic and ordinary source are not different products. They use the established Learning Design prefix. There is no shortcut from topic to Learning Outcomes. A completed Interactive or Expository output may be selected as source material and then uses the same source pipeline, including Normalize Content. Internal artefacts such as saved Learning Outcomes are not the product-to-product input. The upstream workflow is not copied. This does not authorise a product-composition framework. Create stays minimal: product, focus, starting point, target component count, plus purpose, diagnostic intent, and optional weighting.

The earlier open choice — whether a topic start may skip content and model knowledge — is **closed**. It may not.

---

## 9. Learner-facing pack

**Plan.** The learner-facing object is one Assessment Pack:

- instructions and how the pack is meant to be attempted;
- ordered components;
- a choice rule, when the evidence plan says the learner chooses;
- a response surface per component form;
- checking only where the component is objectively checkable, using the existing Check behaviour as the evidence for that narrow case, not as the whole product;
- criteria, rubric, or exemplar only under the feedback posture and only after the attempt when the posture says they must wait;
- no revelation, before submission, of keys, exemplars, or criterion-by-criterion marking notes that would collapse the task.

Extended writing does not get a fake Check button. Hidden material is renderer behaviour driven by the feedback posture, not a separate stage.

---

## 10. Disposition of existing machinery

| Existing piece | Disposition |
| --- | --- |
| Design Assessment, the stage | **Supersede** for Assessment Pack. Do not repair or revive it. Leave it runnable on old and custom graphs |
| `assessment_blueprint` | **Supersede** with the evidence plan. Do not treat the current object as sufficient |
| Generate Assessment Items | **Reuse with revision** of the authoring idea and of checkable item shape. **Supersede** the stage as the product’s authoring implementation |
| `assessment_check` | **Reuse with revision** as the checkable-item portion of a component. Not the whole pack |
| Design Feedback | **Preserve** as residual or Custom. Not a stage of Assessment Pack |
| Design Marking Rubric | **Preserve** as residual or Custom. Pack and component fields carry criteria instead |
| Validate Learning Design | **Preserve** as residual or Custom. Not part of the family |
| Revise Assessment Based on QA | **Preserve** as residual or Custom |
| Learner Check control | **Reuse** for objectively checkable components. Not the complete learner experience |
| Interactive DLA/GAM evidence | **Unrelated** to this product’s family. **Preserved** on Interactive |

Nothing is removed in this plan.

---

## 11. Canonical family

**Plan.** Smallest family, outcomes already available:

```text
Plan Assessment Evidence
→ Author Assessment Components
```

| Stage | Responsibility | Input | Output | Why it is its own stage |
| --- | --- | --- | --- | --- |
| Plan Assessment Evidence | Decide what evidence would support a judgement of the intended learning, and how that evidence can be judged, including distinctions in understanding when diagnostic intent is set | Learning outcomes produced in this workflow; purpose; diagnostic intent; target component count; extent; focus | Evidence plan | Writing that plan is not writing the questions |
| Author Assessment Components | Create the heterogeneous components that elicit the evidence, including keys, guidance, criteria, or exemplars as the form requires | Evidence plan; outcomes | Assessment Pack | A different transformation: designed evidence becomes learner-facing tasks |

**Documented prefixes, not extra assessment stages.**

```text
[Normalize Content]                                      when starting point is authoritative source
→ Generate Learning Content → Model Knowledge
→ Define Learning Outcomes                               when outcomes are not supplied
→ Plan Assessment Evidence
→ Author Assessment Components
```

Topic starts omit Normalize Content. A completed Interactive or Expository output uses the source prefix, including Normalize Content (S88-D24). The prefix is not omitted in order to reuse another product’s Learning Outcomes. No model invents this graph. Purpose, diagnostic intent, optional weighting, and target component count parameterise the assessment stages and do not change the prefix. Design Page is not an Assessment Pack stage: its contract and the deterministic page assembly expect a learning page, and the renderer does not publish an assessment pack.

---

## 12. Compatibility

**Plan.** Existing workflows keep their stored stages, including Design Assessment and Generate Assessment Items. Graphs are not rewritten. Assessment Pack is a new-create architecture, as Interactive and Expository local families were. Old stages stay available on Custom and legacy graphs. There is no migration programme in this plan.

---

## Distinctions

| Kind | Content |
| ---- | --- |
| **Adopted** | S88-D13 product and definition; S88-D14 product and capability; S88-D15 design distinct from authoring; S88-D17–D21 amendments |
| **Planned architecture** | Evidence plan, component pack, two assessment stages, Interactive-resource outcomes as input, Learning Design prefix when outcomes are not supplied, feedback as posture plus component fields, judgement split between design and authoring, diagnostic intent as a parameter |
| **Reuse** | Outcomes stages and Normalize as prefixes; Check for checkable items; the idea of item authoring; a completed product output as source material |
| **Supersede or preserve** | §10 |
| **Unresolved** | None of the previous three planning choices remain open |
| **Implemented** | The three starting points in §11, local create, and the first two component forms |
| **Not authorised** | Later response forms, a complete renderer, marking, a Design Feedback stage, repair of Design Assessment, any change to Interactive, a product-composition framework |

---

## 13. Decisions previously left open

Resolved by [S88-D17](decisions.md#s88-d17--an-existing-interactive-resource-may-supply-assessment-pack-outcomes) through [S88-D21](decisions.md#s88-d21--first-implementation-forms-are-not-the-products-scope):

1. Topic and ordinary source use Generate Learning Content, Model Knowledge, and Define Learning Outcomes. There is no shortcut from topic to outcomes. A completed Interactive or Expository output is source material for that same source pipeline (S88-D24). Saved Learning Outcomes are not the product-to-product input.
2. Single-answer multiple choice and short constructed response are the first implementation forms only, not the product’s scope.
3. Weighting is optional whenever a combined quantitative result is required. It is not limited to summative packs.

No further product judgement is required before this architecture can stand. The three starting points are implemented (S88-D23 / S88-T-016). Later forms and a complete renderer are not.

---

## 14. Smallest plausible first implementation boundary

Implemented (S88-T-015, S88-T-016):

- new Assessment Pack creates from a topic, ordinary source material, or a completed Interactive or Expository output used as source material, using the prefixes in §11;
- local instantiation of that graph, ending in Plan Assessment Evidence → Author Assessment Components;
- evidence-plan and component contracts that can later hold further forms, with single-answer multiple choice and short constructed response as the first forms implemented;
- no Create menu change until that instantiation exists;
- no renderer work beyond what Check can already do, and no Check on constructed responses;
- no rewrite of saved graphs;
- no repair of Design Assessment;
- no change to Interactive formative assessment;
- no topic or source prefix left unimplemented; essays and choice sets remain later forms.
