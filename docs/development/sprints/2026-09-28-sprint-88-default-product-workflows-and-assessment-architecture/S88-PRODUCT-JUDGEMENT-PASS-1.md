# Sprint 88 — Product Judgement Pass 1

**Resolve Investigation 1 questions before architecture planning**

**Sprint:** 88  
**Date:** 2026-09-28  
**Mode:** Investigation and product judgement only. No production change. No implementation tasks. No architecture-planning pass.

**Reads:** [S88-INVESTIGATION-1-REPORT.md](S88-INVESTIGATION-1-REPORT.md) §§13–17.

### How to read this document

| Marker | Meaning |
| ------ | ------- |
| **Fact** | Repository evidence |
| **Inference** | Conclusion from that evidence |
| **Judgement** | Operator product judgement, recorded as S88-D03 or S88-D04 |
| **Recommendation** | Not yet a decision; still needs Julian’s judgement |

---

## 1. Workshop

**Judgement (S88-D03).** Workshop currently remains a variant of the Interactive Resource product. Its existing workflow variation is adequate for current purposes. Sprint 88 will not redesign Workshop. This does not decide that Workshop must permanently remain an Interactive variant.

**Judgement.** Working principle, recorded but not adopted as a workflow model: a first-class product should have a coherent, predictable workflow architecture. Legitimate structural variation should be explicit and understandable, rather than arising unpredictably from model inference.

**Fact.** No Workshop behaviour was changed.

Investigation 1 §16 question 1 is **resolved for current Sprint 88 scope**.

---

## 2. Expository and authoritative source

**Conclusion: B.** Repository evidence supports S85-D03’s common Expository topology, with Normalize Content as the source-specific prefix. It does not support a different downstream topology for authoritative source.

**Fact.** `if (!hasAuthoritativeProvidedSource())` was introduced on 2026-05-21 in commit `f4b4a439` (“Sprint 27: stabilise assessment semantics and epistemic grounding”). The comment on that guard is: topic-only paths must not run Model Knowledge without a content producer. That is older Interactive/shared heuristic logic. It is not an Expository decision.

**Fact.** The Expository replacement was inserted inside that existing block on 2026-09-21 in commit `63690073` (“feat: establish expository workflow and pipeline spine”). The block itself still tries to keep Normalize Content when the graph already has it, or when source posture asks for it, and when the path is not generate-from-topic (`keepNormalize && !generateFromTopic`). That prefix cannot run when the guard is true, because the whole replacement is skipped.

**Fact.** [S84-D05](../2026-09-21-sprint-84-expository-resource-planning/S84-EXPOSITORY-RESOURCE-DESIGN.md) says Normalize Content is reused unchanged **when source is supplied**, and that Episode Plan, Design Learning Activities, Generate Activity Materials, and Construct Learning Sequence are bypassed. [S85-D03](../2026-09-21-sprint-85-expository-resource-implementation/decisions.md) repeats the chain as `[Normalize?] → GLC → MK → LO → EJP → XD → XM → Design Page`.

**Absent.** No sprint decision or implementation note found that says authoritative-source Expository should use a different downstream topology.

**Fact.** `tests/s85-wp1-expository-topology.test.js` covers `startingArtefact: "generate_from_topic"` only. No test asserts the provided-source Expository graph.

**Fact.** When the guard is true, the replacement does not run. Other `isExpositoryResourceWorkflow` checks skip some Interactive inserts (sequence-for-self-directed, workshop-rich force-include, expository factor stripping). They do not delete Interactive stages the model already emitted. An authoritative-source Expository design can therefore still contain Design Episode Plan, Design Learning Activities, Generate Activity Materials, or Construct Learning Sequence if those titles survived heuristics. Normalize Content can still be inserted by the older source-posture logic. That is source handling, not the S85 sibling chain.

**Inference.** The discrepancy is an accidental nesting: Sprint 85 placed the sibling replacement inside a Sprint 27 topic-only guard. Normalize was already the intended treatment of authoritative source, as a prefix of the same chain, not as a reason to fall through to Interactive assembly.

This pass does not fix the nesting.

---

## 3. Optional stages on normal first-class create

None of these stages is the intrinsic topology of current Self-study, Workshop, or Expository topic creation. None of them is why a model must invent a first-class graph. Removing free-text insertion would change incidental graphs authors can get today by wording. It would not remove a stage the demonstrated normal product chains require.

| Stage | Reachable now | How | Needed by normal Interactive / Expository? | Free-text removal breaks a demonstrated product chain? | Character |
| ----- | ------------- | --- | ------------------------------------------ | ------------------------------------------------------ | --------- |
| Generate Assessment Items | Yes | `assessment_required`, item count, or quiz / test / formative wording in `applyWorkflowDesignHeuristics` | No. Default page materials skip it. Expository topic replacement drops it | No | Assessment architecture — later judgement. Also an explicit structural option if an author wants an item bank |
| Design Assessment | Yes, narrowly | Blueprint / coverage / assessment-design wording. Pruned when items are requested unless `keepDesignAssessmentStep`. Blueprint arm of that flag does not run (S88-AD-001) | No | No | Assessment architecture — later judgement. Preserve; do not repair (S88-D04) |
| Design Feedback | Yes | Feedback, debrief, or delayed-reveal wording, after items exist | No | No | Assessment architecture, tied to items. Not a first-class product stage |
| Generate Slide Deck | Yes | Slides in materials or goal | No. S75-D11 refused slideshow as a Create product | No | Legacy / residual, or Custom workflow. Not normal first-class topology |
| Generate VLE Structure | Yes | VLE / Moodle wording, then removed again for a single-page topic workflow | No | No | Legacy / residual, or Custom |
| Generate Learning Object Set | Yes | Xerte / learning-object wording via pack trigger | No. S75-D11 refused a learning-object Create option | No | Legacy / residual, or Custom |
| Design Marking Rubric | Yes, rarely | Rubric wording; pack requires a blueprint and items; pruned on formative-pack intent | No | No | Legacy / residual assessment machinery |
| Validate Learning Design | Yes, rarely | QA wording; pruned when items exist unless QA is explicit | No | No | Legacy / residual |
| Revise Assessment Based on QA | Yes, rarely | QA-revise wording; requires Validate’s output | No | No | Legacy / residual |

**Inference.** Dynamic model-driven topology is not justified for normal first-class creation by these stages. Assessment-related ones wait for the later Assessment investigation. The others belong on a Custom/Generated path, or as a later explicit option if a product decision wants them. They are not a reason to keep asking a model to invent the product workflow.

---

## 4. Design Assessment

**Judgement (S88-D04).** Do not remove Design Assessment in Sprint 88. Do not repair `keepDesignAssessmentStep`. Do not design an Assessment product.

**Fact.** Intent to reconstruct later is already in the repository: Sprint 23 assessment semantics (blueprint owns what is assessed; items own generation), the pack prompt and `assessment_blueprint` contract, S80-T-011 (blueprint-only goal selects Design Assessment), and S80-D07 (alpha path is items-first; Design Assessment is not required).

**Inference.** No additional evidence is required before a later investigation can reconstruct what the stage was for. What it should become is still open. The dead blueprint arm is [S88-AD-001](ARCHITECTURAL-DEBT.md).

---

## 5. No-API-key first-class creation

**Recommendation, not a decision.** Investigation 1 did not find a hidden semantic dependency that stops normal first-class creation without a PRISM API key.

**Fact.** The key is required because `ensureCreateWorkflowApiKeyPrerequisite` runs before elicitation, and because `callOpenAIForWorkflowDesign` is what today produces `workflowDesignResult`. `applyWorkflowDesignHeuristics` returns immediately unless `parsed.steps` is an array. That is a control-flow dependency, not missing product information.

**Fact.** What a normal create already has, without a model:

| Information | Already available from |
| --- | --- |
| Product | Create selector |
| Focus / what it is about | Create focus, joined by `composeLdCreateDesignIntent` |
| Delivery posture | Product seed |
| Source vs topic | Starting-point / `input_strategy` control |
| Page as the Learning Design artefact | Factor merge forces `session_materials` to include `page` |
| Expository topic stage list | Fixed replacement array |
| Self-study activity chain | Product seed plus pack dependencies (emergent, not a literal array) |
| Step prompt text at save | Local pack template |

**Fact.** A model-authored summary, a restatement of the focus, and model step order are produced and then overwritten or unused for topology. No evidence in this pass shows normal first-class creation fails without them.

**Inference.** What would still be needed are ordinary inputs or defaults, not a design model: a usable topic string (the focus already is that string; the topic regex does not read the colon form), learner level if it stays required and has no default, and explicit structural choices if assessment items or extra outputs stay available on normal create. Those can be inputs, defaults, or left to a Custom path. They do not require the design call.

**Fact.** Executing a stage still needs a model somewhere. Copying the prompt inside PRISM does not. “API key required by PRISM to create” and “model access required by the author to run a stage” stay different. This pass does not change the key gate.

---

## 6. Does normal first-class creation still need an elicitation phase?

**Recommendation: 3.** No distinct elicitation phase for normal first-class products. Model-driven requirement interpretation and workflow generation stay where they are actually needed: Custom/Generated workflows, and Research’s unresolved objective type.

Not a decision.

| Information | Needed to choose topology? | Needed to parameterise? | Where it can come from |
| --- | --- | --- | --- |
| Product | Yes | — | **A.** Selector |
| Topic / focus | No | Yes, as the subject later stages reason about | **B.** The focus field already collected. A model is not required to read it |
| Audience / learner level | No | Yes, if a stage prompt expects it | **B** or **D.** Pack default exists for some levels; a required empty level is a parameter question, not a topology question |
| Scope / extent | No for stage membership (`expository_extent` does not change the Expository chain) | Yes | **B** or **D.** Design-scope default is `session` |
| Delivery pattern | No, once the product seed has written it | The seed is the parameter | **A.** Product seed. Asking again duplicates the selector |
| Input / source strategy | Yes — topic chain vs Normalize prefix | — | **C.** Starting-point control, already on Create |
| Assessment intent | Only if an item/blueprint stage is in the normal product | Otherwise no | **C** if it remains a normal-create option; otherwise **Custom**. Not free-text inference |
| Output extras (slides, VLE, learning objects) | Only if those stages are in the normal product | — | Not **F.** Section 3: they are not intrinsic. **Custom**, or a later explicit option |

**Inference.** Nothing in this set is **F** for normal first-class topology. Pre-workflow model elicitation is not what chooses the product workflow. A large substitute form is not implied. The minimum before instantiation is: product, focus, and starting point. Learner level and scope are parameters. Assessment and extra outputs are either explicit structural choices or outside normal create.

Mandatory elicitation (option 1) is not supported. Optional elicitation (option 2) remains available for Custom/Generated work, not as a phase every first-class create must pass through.

---

## 7. Proposed invariant

> A first-class PRISM product has a defined workflow family. Normal creation does not ask a model to invent that workflow. Product variants and structural options may select documented topology variants; ordinary requirement detail parameterises the workflow.

**Not adopted.**

**Evidence for it.** Expository topic creation already replaces the model list with a documented chain (S85-D03). Product selection is already author-explicit (S75-D11, extended by S85). The working principle in S88-D03 says structural variation should be explicit. Section 5 found no necessary design-model product that local inputs do not already carry. Section 3 found no optional stage that is intrinsic topology.

**Evidence against treating it as already true.** Interactive membership is still rule-edited model output. Wording still inserts and deletes stages. Authoritative-source Expository skips the documented chain and can keep Interactive stages. The prune filter keeps canonical titles it does not recognise as excluded (`return true`). Workshop is a variant, not a second invented product, but its predicates are not one written-down variant document.

**Wording so Workshop is not over-constrained.** “Workflow family” and “documented topology variants” allow Workshop to stay an Interactive variant (S88-D03) with its own documented variant, without declaring Workshop a separate product and without forbidding a future investigation from making it one. The invariant should not say “exactly one chain per product forever.”

| Surface | Implication if later adopted |
| --- | --- |
| Interactive | Normal Self-study create would instantiate the activity chain locally. Workshop would be a documented variant of that family, not a model invention, and not redesigned in Sprint 88 |
| Expository | Topic chain already matches. Source would be the same family plus Normalize, which is conclusion B, not a second product |
| Future Assessment product | Out of scope to design. The invariant would only mean that if it became first-class it would get its own documented family, not be injected by wording into every resource |
| Custom / Generated | Outside the invariant. Model-driven assembly remains appropriate there, including residual catalogue stages |

---

## 8. What is settled vs still open

**Settled for this sprint (judgements):** Workshop is an Interactive variant for now (S88-D03). Design Assessment stays, unrepaired (S88-D04). §16 question 1 is closed for current scope.

**Settled by evidence, not by a new architecture decision:** Expository source discrepancy is B. The nine optional stages do not justify model-invented first-class topology.

**Recommendations still requiring Julian’s judgement:** elicitation option 3; the no-API-key creation objective as an architectural aim; whether to adopt the invariant in the wording above.

Architecture planning is **not** opened.

---

## Remaining decisions before an architecture-planning pass

1. Adopt, amend, or reject the invariant in §7, including “workflow family” so Workshop can remain a variant.
2. Accept or reject recommendation 3: no distinct elicitation phase for normal first-class creation; model-driven generation kept for Custom/Generated workflows.
3. Accept or reject the aim that normal first-class instantiate / configure / save / inspect / copy does not require a PRISM API key, while stage execution still requires model access by the author.
