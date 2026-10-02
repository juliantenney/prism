# S89 Investigation 1B — Current responsibility boundaries

**Status:** Evidence only. Not a target architecture and not a work list.  
**Decisions:** [S89-D03](decisions.md#s89-d03--custom-means-a-manually-assembled-workflow) · [S89-D04](decisions.md#s89-d04--research-is-not-a-current-architectural-requirement) · [S89-D05](decisions.md#s89-d05--interactive-does-not-own-formative-assessment-questions)  
**Prior map:** [S89-INVESTIGATION-1-CURRENT-PIPELINE.md](S89-INVESTIGATION-1-CURRENT-PIPELINE.md)  
**Fourth-product diagnostic:** not performed. No debt item is resolved.

Labels: **Observed**, **Inferred**, **Uncertain**.

---

## 1. Executive summary

The Learning Design Domain Pack does not choose the stage list of a current first-class product. It does inject filtered prompt-rule text into Expository stage prompts. Interactive steps are seeded at save from the pack’s prompt-factory templates, then augmented at run. Assessment specialist prompts are written by code at create; the Design Page path then refuses the Interactive visual contract. Pack files also still describe Design Assessment and item generation. That material serves the model-designed workflow path, not the three predetermined pipelines.

Custom, as decided in S89-D03, is a workflow whose steps point at Prompt Studio prompts in the library (`promptId` / `library_prompt`) or a typed override. That path does not call the design model or `applyWorkflowDesignHeuristics`. The generated path is a different feature: Design workflow when the selection is not a normal first-class Learning Design product. The three current products do not need it. Manually assembled Custom does not need it. Research can still enter it, and S89-D04 says that is not a reason to keep it.

Interactive formative **feedback** stays conceptually. Optional formative **questions** and the old assessment stages are legacy candidates under S89-D05. They are not on the local Interactive graph. S88-AD-001 describes one broken flag inside the generated-path heuristic. The question machinery is wider than that flag.

---

## 2. Clarifications recorded

- **S89-D03.** Custom means assembled from Prompt Studio prompts. It is not a synonym for generated, elicited, Research, or “not first-class”.
- **S89-D04.** Learning Design is the established domain. Research is not a current requirement and was not designed or removed here.
- **S89-D05.** Interactive keeps in-experience feedback. Assessment questions belong to Assessment Pack. Old question machinery is a retirement candidate, not yet removed.

---

## 3. Domain Pack influence

| Pack material | Where it is read | Effect class |
| ------------- | ---------------- | ------------ |
| Principles and artefacts markdown | Listed in the manifest | **Uncertain** as a direct prompt inject. This pass found no first-class create or run call that pastes those files. |
| Step patterns `canonicalSteps` and `workflowBriefConfig.assessmentPolicy` | `getWorkflowBriefConfig`; heuristic rewriter | **Generated-workflow only** for topology and Design Assessment authority. Not the stage list of local Interactive, Expository, or Assessment create. |
| Step-pattern `promptFactory` templates | `buildSeededStepPromptForWorkflowStep` | **First-class product execution** for Interactive (and any step saved without its own body): the template is copied onto the step at save. |
| Prompt-rule files | `applyExpositoryDomainGuidanceToDraft` → `filterRulesForExpository` → appended block | **First-class product execution** for Expository stages that the sibling module names. Activity rhetoric is cut out of the Learning Design rules before append. |
| Product list | Not in the pack | **First-class product creation** is the `app.js` output-type constant, gated on the Learning Design domain being selected. |

No pack field was found that changes deterministic assembly or the publisher after the model has returned. **Inferred** from the assembly functions, which take captures and workflow identity, not pack markdown.

---

## 4. Interactive

**Creation.** Topology is the title list in `buildFirstClassWorkflowFamily`. The pack’s `canonicalSteps` are not that list.

**Execution.** On save, steps without `promptBody` get `buildSeededStepPromptForWorkflowStep`, which reads the matched catalogue pattern’s `promptFactory`. That catalogue is loaded from the domain step-pattern file. The result is stored as `override_prompt_body` / `local_override`.

**Observed.** `resolveStepPromptText` then runs `applyWorkflowStepRuntimePromptAugmentations` on that body. Those add learning-activity scaffolds, page partial contracts, and the Sprint 38 visual-affordance block when the step is Design Page and the workflow is not an Assessment Pack. Interactive Design Page therefore still receives the Interactive visual contract. That is current Interactive behaviour, not Assessment leakage.

**Topology / state / assembly / publishing.** Pack does not set topology. It shapes the saved prompt and the run-time appendix. Assembly is the shared page path, not a pack file.

---

## 5. Expository

**Creation.** Same: family title list, including the three sibling stages. The duplicate Expository list inside `applyWorkflowDesignHeuristics` is not used for this create.

**Execution.** `resolveExpositorySiblingPromptBodyForStep` returns the template from `lib/expository-sibling-prompts.js` for journey plan, development, materials, and, when `isExpositoryResourceWorkflow` is true, also GLC, Learning Outcomes, and Design Page. `finalizePromptBody` then calls `applyExpositoryDomainGuidanceToDraft`, which appends filtered domain prompt-rule text (`buildDomainGuidanceBlock`). Interactive activity sections of the Learning Design rules are stripped first (`filterRulesForExpository`). Model Knowledge is named as consuming domain guidance in `DOMAIN_GUIDANCE_CONSUMPTION` but the sibling resolver does not return a template for it unless `resolveTemplate` matches. **Uncertain** whether Model Knowledge actually receives the guidance block; the append runs only after a non-empty sibling template.

**Observed.** The Expository branch of `applyWorkflowStepRuntimePromptAugmentations` returns after domain guidance, educational-quality, math, and JSON overlays. It does not call `applySprint38VisualAffordanceContractToDraft`.

**Assembly.** `assembleExpositoryPageFromPartials`. Not pack-driven.

---

## 6. Assessment

**Creation.** `buildAssessmentPackPrompts` writes `promptBody` onto Plan Assessment Evidence, Author Assessment Components, and Design Page. Save stores that string as `local_override` and does not replace it with a catalogue seed (`if (s.promptBody)`).

**Execution.** Those overrides still pass through `finalizePromptBody`. For Design Page, `applyWorkflowStepRuntimePromptAugmentations` returns immediately when `workflowRecordIsAssessmentPack` is true, before partial-page and visual-affordance appenders. Copy instructions (`buildWorkflowStepInstructions`) use a separate Assessment paragraph and set catalogue `runnerInstructions` to null for that step.

**Plan Assessment Evidence and Author Assessment Components** do not take that Design Page early return. They enter the rest of the augmentation function. Each later helper checks step identity before appending (Design Page, activities, materials). **Inferred:** a non-matching step gets little or none of those blocks. This pass did not execute a prompt to prove the strings are empty of Interactive scaffolds. **Uncertain** for PAE/AAC. **Observed** for Design Page: the visual-contract appenders are skipped.

**Pack assessmentPolicy.** Not read by `assembleAssessmentPackPage`. **Generated-workflow only.**

**Topology, assembly, publishing.** Code, not the pack. Feedback timing comes from the create seed.

---

## 7. Custom workflow path

**Observed.** Edit stores a step prompt as `library_prompt` plus `promptId`, or `local_override`. `resolveLibraryPromptBody` loads the Prompt Studio / library body. Run uses that text. `finalizePromptBody` still wraps it, so a Custom step whose title or canonical id is Design Page can receive the same run-time appenders as an Interactive Design Page. **Inferred** if the saved workflow is not marked Assessment or Expository.

**Observed.** `applyWorkflowDesignHeuristics` is called from the model-design promise (`runWorkflowDesign` parse chain), not from step edit or from library attach. Design-time elicitation is cleared for first-class create and is not required to attach a library prompt.

**Observed.** The domain canonical-step list does not choose a Custom step list. The author does. Catalogue matching can still affect token substitution and, if a step has a canonical id, later augmentations.

This path is not “the complement of `isNormalFirstClassLearningDesignCreate`”.

---

## 8. Generated / model-designed workflow path

**Observed.** `handleStartWorkflowDesign` returns before the API-key check and the model request when `isNormalFirstClassLearningDesignCreate` is true. Otherwise it continues into model design and heuristics.

**Observed.** If the domain is Learning Design and no product is selected, the function toasts and returns. It does not generate. An ordinary Learning Design create of one of the four output types therefore does not enter this path. (Workshop is Interactive.)

**Observed.** The path remains reachable when the selection is not that case: Research included, or not Learning Design (General-only), provided name and intent are filled and an API key exists. S89-D04: Research is not a reason to treat the path as required.

**Observed.** Custom library assembly does not call it. The three first-class products do not call it.

**Inferred.** No current intentional Learning Design product capability requires model-generated workflow design or workflow elicitation. What still requires it is that leftover Design action itself, plus whatever Research or General-only create still uses. This pass did not find another named product that needs it.

Brief state, `workflowBriefElicitation`, and `assessmentPolicy` exist for this path. First-class save writes `askedFactors: []` and a seed, not an elicited graph.

---

## 9. Interactive formative-assessment legacy

**Keep (S89-D05).** In-experience diagnostic and formative feedback on Interactive activities. That is not this machinery.

**Assessment Pack.** Separate pipeline and publisher. Keep.

**Question / old-stage machinery still present, not on the local Interactive graph:**

- Domain `canonicalSteps` still lists Design Assessment, Generate Assessment Items, Design Feedback, Design Marking Rubric.
- `workflowBriefConfig.assessmentPolicy` still points item generation at `step_design_assessment`.
- `applyWorkflowDesignHeuristics` still computes `keepDesignAssessmentStep` and filters those titles from a **generated** graph. The blueprint variable is still read before it is assigned (S88-AD-001).
- `resolveStepPromptText` hard-locks Generate Assessment Items to the v2 page `assessment_check` contract and drops a library body for that step.
- Create for the three products does not emit these stages.

**Observed.** None of that is how a current first-class Interactive workflow is constructed. It remains reachable on a generated graph or on a step an author adds by hand if the title or canonical id matches. No removal here.

S88-AD-001 is the broken keep-flag inside the heuristic. The legacy surface is that flag plus the pack policy, the canonical names, and the GAI lock. The debt item is narrower than the issue S89-D05 names. It is not amended or closed.

---

## 10. Product identity fallbacks

**Observed.** `readFirstClassIdentity` prefers `workflow.product`, then `ldCreateOutputType`. New saves write both.

**Observed.** `workflowRecordIsAssessmentPack` is `product === "assessment_pack"` or `ldCreateOutputType === "assessment_pack"`. No goal-text test.

**Observed.** `isExpositoryResourceWorkflow` is true if `ldCreateOutputType` is expository, or any step id starts with `step_expository_`, or `constraints.expository_extent` is set, or goal, design intent, or **name** matches `/create an? expository resource/i`.

New Expository creates set `product` and `ldCreateOutputType`, so they do not need the goal test. The goal/name test can mark another workflow Expository if those strings match, including a Custom workflow titled or briefed that way. Callers include prompt selection and Design Page validation. Historical graphs that lack `product` but have the output type or `step_expository_*` ids still match. That is defensive compatibility, not a requirement of a new first-class save.

Interactive has no matching “goal says interactive” detector in this pass. It is what remains when the other two predicates are false, plus `ldCreateOutputType` `self_study_resource` / `workshop` at create.

---

## 11. Assessment Design Page isolation

**Observed, for the two paths that were re-read.**

1. Run prompt: `applyLdDesignPagePartialContractToDraft` returns unchanged for an Assessment Pack. `applySprint38VisualAffordanceContractToDraft` does the same. `applyWorkflowStepRuntimePromptAugmentations` returns before both when the workflow is an Assessment Pack and the step is Design Page.
2. Copy/run instructions: the Assessment branch asks only for title, attempt instructions, framing, and the page envelope, and does not append `getRunnerInstructionsForStep` (the catalogue `what_to_check` text).

The earlier uncertainty — catalogue runner guidance still teaching the Interactive visual fields — is closed for these two functions. **Uncertain** only for some other copy builder not on this path. `buildWorkflowStepInstructions` is the live copy path used from the run panel.

Catalogue seeding does not replace an Assessment `promptBody` at save. Isolation is not “the pack is never nearby”; the pack template is not the body, and the visual-contract appenders are skipped.

---

## 12. Why prompt ownership differs

| Product | Contract defined | At create / save | At run |
| ------- | ---------------- | ---------------- | ------ |
| Interactive | Domain step-pattern `promptFactory`, plus `app.js` augmentations | Catalogue template seeded as `local_override` if the family step has no `promptBody` | Augmentations, including Design Page visual contract |
| Expository | `expository-sibling-prompts.js` | Family step has no `promptBody`, so save would also seed from the catalogue unless the sibling resolver wins at run | Sibling template first, then filtered domain prompt rules; visual-affordance block not applied on that branch |
| Assessment | `buildAssessmentPackPrompts` in the family module | `promptBody` stored as `local_override`; catalogue seed skipped | Design Page skips Interactive appenders; PAE/AAC still enter the augmentation function |

**Inferred.** The difference is historical layering: Interactive grew inside the pack template plus run-time scaffolds; Expository was given a sibling module so it would not inherit activity rhetoric; Assessment prompts were placed in the family module so evidence planning would not be a catalogue step. Nothing in code states that three storage styles are a single intended architecture. Nothing here says they must be unified.

---

## 13. Product output as source

**Observed.** `readFirstClassProductOutput` accepts only Interactive or Expository, and only the terminal Design Page capture. Assessment is rejected (`not_first_class_product` if product is not those two).

**Observed.** Assessment create calls that reader when the author chooses “existing PRISM product”. The transported value is the Design Page capture text, used as source material on the Normalize prefix. It is not a splice of the source workflow’s stages.

**Observed.** `buildFirstClassWorkflowFamily` adds Normalize only for `authoritative_source` (and the UI values that normalise to it). It does not take `product_output` as its own branch. The Assessment builder does. Interactive and Expository therefore do not have the same receiver path in this module.

There is no code contract that every product both emits and accepts every other product. The implemented combination is: Interactive or Expository Design Page → Assessment Pack source. Other combinations were not found in these functions.

---

## 14. Implications for S88-AD-001…006

Not resolved.

- **001.** Still the broken keep-flag. S89-D05 makes the surrounding question machinery the wider issue. The debt line stays narrower than that issue.
- **002.** Still only the generated-path rewriter. Unchanged.
- **003.** `ldCreateOutputType` is still persisted and still read by the Expository and Assessment predicates. Unchanged.
- **004.** Generation and elicitation are not required by the three products or by Custom assembly. They remain for non-first-class Design. Research is not a preservation argument (S89-D04). The debt description (“complexity left behind”) still fits. Scope looks more like an unused Learning Design path than a partner of Custom.
- **005.** Still many branches besides the family module. Unchanged as a direction. No boundary designed.
- **006.** Packs do not own first-class topology. They do own Interactive prompt templates and a filtered slice of prompt rules on Expository execution, plus the generated-path policy. “Reassess” is still right. This pass does not say what to delete.

---

## 15. Remaining uncertainties

- Whether Plan Assessment Evidence and Author Assessment Components pick up any Interactive scaffold inside `applyWorkflowStepRuntimePromptAugmentations` after the Design Page return. Design Page itself does not.
- Whether Expository Model Knowledge receives a domain-guidance block. The consumption map names it; the template resolver may not.
- Whether principles and artefacts files are injected anywhere this pass did not open.
- How often General-only Design is used in practice. The code allows it. S89-D04 does not make that a requirement.
- Whether a Custom step titled like an Expository or Assessment stage is mis-augmented because identity is inferred from title, step id, or goal text.

The fourth-product diagnostic was not run.
