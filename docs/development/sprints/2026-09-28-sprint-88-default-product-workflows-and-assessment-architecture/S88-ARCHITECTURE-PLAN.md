# Sprint 88 — Architecture plan

**Bounded planning pass for first-class workflow families**

**Sprint:** 88  
**Date:** 2026-09-28  
**Authorisation:** [S88-D10](decisions.md#s88-d10--open-the-bounded-architecture-planning-pass)  
**Direction adopted:** [S88-D05](decisions.md#s88-d05--adopt-the-first-class-workflow-family-invariant) … [S88-D09](decisions.md#s88-d09--residual-stages-do-not-define-first-class-topology)  
**Mode:** Specification only. No production change. No implementation authorisation.

### How to read this document

| Marker | Meaning |
| ------ | ------- |
| **Adopted** | Decided in S88-D05–D09. This plan specifies it. It does not implement it |
| **Plan** | Implementation planning. Not yet authorised to build |
| **Preserved** | Stays in the product until a later decision. Not removed here |
| **Deferred** | Out of this plan’s build boundary |
| **Debt** | Known defect or accidental contract. Not repaired in this pass |

---

## A. Product and variant model

**Adopted hierarchy** (Learning Design domain, not a product):

```text
Learning Design
  Interactive Resource
    Self-study variant
    Workshop variant          ← current status only (S88-D03); not redesigned
  Expository Resource
```

Assessment is not a product in this plan.

**Fact.** `ldCreateOutputType` (`self_study_resource`, `workshop`, `expository_resource`) began as a Create-time control. [S75-D11](../2026-08-10-sprint-75-prism-user-experience-and-interface/decisions.md) said it was not a new persisted output-type architecture. Current save writes the field, and `isExpositoryResourceWorkflow` treats it as sufficient. Investigation 1 found no decision that authorised that persistence. That accidental load-bearing field is [S88-AD-003](ARCHITECTURAL-DEBT.md).

**Plan — smallest identity.** Persist product and variant separately. Do not keep the Create-widget name as the architectural id.

| Field | Values | Notes |
| ----- | ------ | ----- |
| `product` | `interactive` \| `expository` | First-class product |
| `variant` | `self_study` \| `workshop` | Required when `product` is `interactive`. Absent for Expository |
| `startingPoint` | `topic` \| `authoritative_source` | Documented structural option, not a third product |

Domain remains `learning-design` on the workflow. Research is not this identity.

**Plan — compatibility read.** When loading an older workflow:

| Legacy `ldCreateOutputType` | Maps to |
| --------------------------- | ------- |
| `self_study_resource` | `interactive` / `self_study` |
| `workshop` | `interactive` / `workshop` |
| `expository_resource` | `expository`, no variant |
| absent | Do not invent a product. Keep the stored step graph. Identity may stay unknown |

New writes use `product`, `variant`, and `startingPoint`. They may continue to emit the legacy field as a mirror until a later implementation drops it. The mirror is compatibility, not the contract.

---

## B. Canonical workflow families

**Adopted.** Normal creation instantiates these families. It does not keep a model-emitted stage just because today’s prune filter would (`return true`).

**Plan — structural option shared by both products.** `startingPoint: authoritative_source` prefixes **Normalize Content**. `startingPoint: topic` does not. That is the only normal-path structural option in this plan.

### Interactive / Self-study

```text
[Normalize Content]
→ Generate Learning Content
→ Model Knowledge
→ Define Learning Outcomes
→ Design Episode Plan
→ Design Learning Activities
→ Generate Activity Materials
→ Construct Learning Sequence
→ Design Page
```

| | |
| --- | --- |
| Required | Every stage in that list, plus Normalize only when starting point is authoritative source |
| Parameters | Focus; learner level; audience; scope/duration |
| Defaults | `design_scope: session`; delivery seed from today’s Self-study product (`self_directed`, `async`, `mostly_online`, learner page); `session_materials` includes `page` |
| Not in the family | The nine residual stages in S88-D09 |

### Interactive / Workshop

**Plan.** Same stage list as Self-study. Workshop is a **parameter variant**, not a second catalogue. This follows [S75-D11](../2026-08-10-sprint-75-prism-user-experience-and-interface/decisions.md) (workshop selects facilitated delivery on the existing machinery) and [S88-D03](decisions.md#s88-d03--workshop-remains-an-interactive-variant-for-current-sprint-88-scope) (do not redesign Workshop).

| | |
| --- | --- |
| Required stages | Same as Self-study, including the Normalize prefix only for authoritative source |
| Parameters that differ | Delivery seed: `live_workshop`, `in_person`, `face_to_face`, classroom as learning environment |
| Not a target | Reproducing today’s predicate split (`selfDirectedPageNeedsSequence` versus the workshop goal trigger versus `workshopRichWorkflowIntent`). Those differences are historical control flow, not a Workshop redesign |

### Expository / topic

```text
Generate Learning Content
→ Model Knowledge
→ Define Learning Outcomes
→ Expository Journey Plan
→ Expository Development
→ Expository Materials
→ Design Page
```

### Expository / authoritative source

**Adopted (S88-D08).**

```text
Normalize Content
→ Generate Learning Content
→ Model Knowledge
→ Define Learning Outcomes
→ Expository Journey Plan
→ Expository Development
→ Expository Materials
→ Design Page
```

| | |
| --- | --- |
| Required | The seven topic stages always; Normalize only for authoritative source |
| Parameters | Focus; learner level; audience; scope / `expository_extent` |
| Defaults | Self-directed learner-page seed; `activities_required: false`; `materials_required: false`; extent does not add or remove stages |
| Bypassed | Episode Plan, Design Learning Activities, Generate Activity Materials, Construct Learning Sequence |

**Debt.** Today the source graph does not take this family, because the Sprint 85 replacement sits inside the Sprint 27 topic-only guard. [S88-AD-002](ARCHITECTURAL-DEBT.md). Not fixed in this pass.

---

## C. First-class Create input contract

**Adopted (S88-D06).** No distinct elicitation phase. Do not surface the historical factor catalogue.

**Plan — minimum before instantiation.**

| Input | Self-study | Workshop | Expository | Class |
| ----- | ---------- | -------- | ---------- | ----- |
| Product | Interactive | Interactive | Expository | Required author input |
| Variant | Self-study | Workshop | — | Required for Interactive; fixed by the product control |
| Focus | Yes | Yes | Yes | Required author input. This is the topic text. Do not depend on a model, or on the “on/about” regex, to recover it |
| Starting point | Topic or authoritative source | Same | Same | Explicit structural choice |
| Learner level | Optional | Optional | Optional | Optional parameter. If empty, a deterministic default may be applied for prompt scaffolding. It does not choose stages |
| Audience | Optional | Optional | Optional | Optional parameter |
| Scope / duration / extent | Optional | Optional | Optional (`expository_extent` when text supports it) | Optional parameter. Does not change membership |
| Delivery pattern | Defaulted by variant | Defaulted by variant | Defaulted by product | Deterministic default |
| Design scope | Default `session` | Default `session` | Not an Interactive design-scope choice | Deterministic default |
| Page artefact | Default | Default | Default | Deterministic default |
| Pedagogy inside a stage | — | — | — | Downstream-stage responsibility |
| Assessment items, slides, VLE, learning objects, rubric, QA | — | — | — | Not normal-create inputs (S88-D09) |

---

## D. Formative assessment on Interactive

**Plan.** Formative assessment that belongs to an Interactive resource is already the activity path:

```text
Design Episode Plan
→ Design Learning Activities
→ evidence_requirement on activity materials
→ Generate Activity Materials
→ learner workspaces
```

That path is intrinsic to the Interactive family. It is not Generate Assessment Items.

**Plan — author-facing control.** The first implementation boundary adds **no** new Create control and does **not** reintroduce Generate Assessment Items as a topology branch. Checks and evidence stay inside Design Learning Activities and Generate Activity Materials. If a later product decision wants a visible “how much checking” parameter, that parameter would tune those stages. It would not add a stage. This plan does not add that parameter.

**Preserved.** Design Assessment, Generate Assessment Items, Design Feedback, and the rubric/QA stages stay in the catalogue (S88-D04, S88-D09). They are not stages of the normal Interactive or Expository family.

**Deferred.** A future Assessment product. Not designed here.

---

## E. Local workflow instantiation

**Plan.** A normal first-class create builds the workflow object locally:

1. Read the input contract in §C.
2. Select the family in §B from `product` + `variant` + `startingPoint`.
3. Write ordered steps with canonical titles and pack dependency order. Do not call `callOpenAIForWorkflowIntentInterpretation` or `callOpenAIForWorkflowDesign`. Do not require model `steps[]`.
4. Apply variant/product defaults and optional parameters onto the workflow and step settings (`applyWorkflowBriefMappings` / settings-only patches are the kind of local mapping to reuse).
5. Seed each step’s prompt from the existing pack or Expository sibling template (`override_prompt_body` at save is already local).
6. Save that object. Copy uses `resolveStepPromptText`, which is already local.

**Reuse.** Product seeds in `getLdCreateOutputTypePrimaryFactorSeed`; `composeLdCreateDesignIntent` only as a label for focus-plus-product, not as a model brief; canonical titles and dependencies in `domain-learning-design-step-patterns.md`; the Expository title list already written inside `applyWorkflowDesignHeuristics`; Expository sibling prompts; save-time template seeding; clipboard copy.

**Cease to be authoritative on this path.** Intent-interpretation model call; design model call; model `steps[]` as input; wording triggers that insert the nine residual stages; the prune filter’s default keep; wrapping the whole Expository replacement in `!hasAuthoritativeProvidedSource()`.

**Preserved elsewhere.** `applyWorkflowDesignHeuristics` remains the editor for the Custom/Generated path until that path is separately changed. It is not deleted in the first implementation.

**Not in this pass.** No instantiator is implemented.

---

## F. Custom / Generated boundary

**Plan.** The existing model-driven design path remains the route when PRISM must determine the workflow itself.

| Stays on that path | Why |
| --- | --- |
| Custom / Generated workflows | No documented first-class family |
| Research | Objective and graph are not the Learning Design families in §B. Not redesigned here |
| Residual catalogue | Slides, VLE structure, learning-object set, marking rubric, Validate, Revise, Design Assessment, Generate Assessment Items, Design Feedback |
| Unusual shapes | Anything that is not §B |

**Plan — boundary rule.** If `product` is `interactive` or `expository` and the author is on normal Create, instantiate §B. If the author explicitly chooses custom/generated design, or the workflow is Research, keep today’s design call and heuristics.

This plan does not redesign Custom workflows or Research.

---

## G. API-key boundary

**Adopted (S88-D07).**

| Action | PRISM API key |
| --- | --- |
| Open Create; enter product, variant, focus, starting point, optional parameters | Not required |
| Instantiate, save, inspect the workflow | Not required |
| Copy a step prompt | Not required |
| Execute a model-dependent stage (author runs the prompt) | The **author** needs a model. PRISM does not have to call one to copy the prompt |
| Prompt Studio `callOpenAI` / `runPromptReview` | Required, as today. Separate from Create |

**Plan — first moment a PRISM key matters after deterministic creation.** The first in-app provider call the author chooses: Prompt Studio refinement or review. Ordinary Run/Copy does not become that moment. Out-of-app execution of the copied prompt is the author’s model access, not a PRISM key check.

**Preserved.** Current `ensureCreateWorkflowApiKeyPrerequisite` behaviour until an implementation decision changes it. [Do not modify provider/key handling now.]

---

## H. Migration and compatibility

**Plan.** Do not rewrite stored step graphs.

| Case | Treatment |
| --- | --- |
| Legacy `ldCreateOutputType` | Read and map as in §A. Do not require a backfill before old workflows open |
| Existing generated first-class workflows | Keep saved steps, including any incidental stages they already have |
| Authoritative-source Expository already saved | Keep the stored graph, even if it contains Interactive stages. Only new creates use §B |
| Historical optional stages on a saved workflow | Keep them. Do not strip slides, items, or rubric on load |
| Workshop workflows already saved | Keep stored steps. Do not rebuild them into the documented family |

New creates are the cut-over. Old graphs stay runnable.

---

## I. Next Assessment investigation

**Deferred. Not executed. No Assessment topology in this plan.**

The next bounded investigation starts from the three layers already established:

| Layer | Object |
| ----- | ------ |
| A | Interactive formative assessment inside the activity → evidence → materials / workspace path |
| B | Existing Design Assessment, Generate Assessment Items, Design Feedback, rubric, and QA stages |
| C | A possible future first-class Assessment product — not designed until that investigation says whether it should exist |

It should use [S88-AD-001](ARCHITECTURAL-DEBT.md) as evidence of current control-flow failure, not as a repair ticket. It should not remove layer B in order to tidy topology. Exit is a recommendation on whether C is warranted and how B relates to A, not an implementation.

---

## Distinctions

| Kind | Content |
| ---- | --- |
| **Adopted architecture** | S88-D05 invariant; S88-D06 no normal elicitation phase; S88-D07 no PRISM key to construct a known family; S88-D08 Expository source prefix; S88-D09 residual stages excluded from normal families |
| **Implementation planning** | §§A–H. Identity fields, four documented topologies, Create contract, local instantiator shape, custom boundary, key boundary, compatibility. Not authorised to build |
| **Preserved / deferred** | Elicitation and design-model machinery for Custom/Generated and Research; the nine residual stages; Design Assessment unrepaired; current key gate; current Expository source nesting; Assessment product |
| **Debt** | S88-AD-001 dead blueprint arm; S88-AD-002 Expository replacement nested in the topic-only guard; S88-AD-003 `ldCreateOutputType` persisted without an authorising decision |
| **Still open** | Whether a later product decision wants a visible Interactive “how much checking” parameter inside DLA/GAM. This plan’s first boundary adds none. It is not a blocker for the specification |

---

## Proposed first implementation boundary

When implementation is later authorised, the first change is only:

- normal Learning Design Create for Interactive (Self-study and Workshop) and Expository;
- local instantiation of the §B families from the §C inputs;
- no PRISM API key on that create path;
- no rewriting of saved graphs;
- no removal of Custom/Generated design, Research, elicitation, or residual stages;
- no repair of S88-AD-001;
- no new formative-assessment control;
- no Assessment product.

The Expository source fix (lift the family out of the topic-only guard, or equivalent) belongs inside that boundary because S88-D08 is part of the family. It is still not authorised until an implementation decision.

## Unresolved product decisions

None that block this specification. The only amendable choice is the absent “how much checking” control in §D. Workshop-as-own-product and Assessment-as-product stay explicitly deferred.

## Proposed next Assessment investigation

A bounded investigation of layers A, B, and C as in §I. It does not start in this pass.
