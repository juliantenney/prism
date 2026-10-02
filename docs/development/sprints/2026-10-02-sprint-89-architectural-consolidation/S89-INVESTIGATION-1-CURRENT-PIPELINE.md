# Current PRISM pipeline — Domain Pack to published first-class product

**Sprint:** 89 — Architectural Consolidation  
**Status:** Investigation record only. Not an architectural decision. Not a change list.  
**Decisions held fixed:** [S89-D01](decisions.md#s89-d01--open-sprint-89--architectural-consolidation) · [S89-D02](decisions.md#s89-d02--first-class-product-pipelines-are-predetermined)  
**Fourth-product diagnostic:** not performed.

Labels: **Observed** means the current code does this. **Inferred** means the relationship is strong but not spelled out as a contract. **Uncertain** means it was not established.

---

## 1. Executive summary

Normal first-class create does not elicit a workflow. `handleStartWorkflowDesign` (`app.js`) returns early when the selection is Learning Design, not Research, and a recognised product type. It builds a fixed title list in `lib/first-class-workflow-family.js` with `callsModel: false`, clears elicitation state, and stops. Interactive, Expository, and Assessment Pack are therefore defined pipelines in that function, not preferred graphs waiting to be revised by a model.

Domain Packs still exist as markdown catalogues (`domains/domain-manifest.json`). At create time the first-class path does not ask them for the stage list. At run time they still supply prompt rules, and the Learning Design step-pattern file still holds the older canonical-step list, brief factors, and assessment-blueprint policy used by generated workflows.

The model-design path remains. It is what runs when the create is not a normal first-class Learning Design product. That path still calls a model, then `applyWorkflowDesignHeuristics`, which prunes and rewrites stages, including the dead Design Assessment arm and the Expository replacement nested in a topic-only guard. New first-class graphs do not pass through that function.

Assembly splits by product: Assessment uses `lib/assessment-pack-publish.js`; Expository uses `assembleExpositoryPageFromPartials` in `lib/page-vnext-assemble.js`; Interactive uses the shared page-partial path. Product output reused as source is the terminal Design Page of Interactive or Expository only.

---

## 2. Domain Pack responsibilities

**Observed.** `domains/domain-manifest.json` lists platform files and three domains: `general` (always on), `learning-design`, and `research`. Each domain lists four markdown files: principles, artefacts, step patterns, prompt rules.

**Observed.** `workflowGenerationContext.js` `getWorkflowBriefConfig` loads the manifest, treats `general` as baseline-only (no brief config), and reads `workflowBriefConfig` from the first non-general domain’s step-patterns file. It does not merge domains.

**Observed.** `app.js` calls that config to render Factory fields, starting-artefact options, and step-pattern catalogues (`renderWorkflowFactoryDomainUiConfig`, `refreshWorkflowStepPatternCatalogForDomains`, `getWorkflowBriefConfig`). `ensureDomainPromptRulesCached` loads prompt-rule files for the selected domains.

**Observed.** Learning Design step patterns (`domains/learning-design/domain-learning-design-step-patterns.md`) contain `workflowPolicy.canonicalSteps`. That list includes both the current first-class titles and older titles (`Design Assessment`, `Generate Assessment Items`, `Design Feedback`, slide deck, VLE, learning-object set). The same file’s `workflowBriefConfig` includes `assessmentPolicy` whose authority step is `step_design_assessment`.

**Observed.** Expository run prompts declare that they still consume domain guidance. `lib/expository-sibling-prompts.js` `DOMAIN_GUIDANCE_CONSUMPTION` maps stages including shared GLC, Model Knowledge, and Learning Outcomes, plus Expository-specific stages, to `general` and the selected domain. `app.js` `collectExpositoryDomainGuidanceTexts` loads those prompt-rule paths.

**Observed.** Product availability on the Create form is not a Domain Pack flag. The Learning Design product list is a constant in `app.js` (`self_study_resource`, `workshop`, `expository_resource`, `assessment_pack`). Domain selection decides whether that form is shown (`syncWorkflowFactoryLdCreateOutputTypeUi` is invoked when the domain is learning-design). **Inferred:** selecting Research instead of Learning Design is what keeps create off the first-class return, because `isNormalFirstClassLearningDesignCreate` requires learning-design and rejects research.

**Uncertain.** How much of principles and artefacts markdown is injected into a first-class run prompt beyond the prompt-rules paths Expository explicitly consumes. Interactive prompt composition was not fully read in this pass.

Domain Packs were not judged. This section only records what they currently contain and who reads them.

---

## 3. First-class creation entry and state

**Observed.** `isNormalFirstClassLearningDesignCreate` (`app.js`) is true only when domains include `learning-design`, do not include `research`, and `ldCreateOutputType` normalises to a known product.

**Observed.** That branch never calls the model. Assessment calls `applyLocalAssessmentPackDesign`. The other three output types call `applyLocalFirstClassWorkflowDesign`. Both set `firstClassLocal: true`, `callsModel: false`, and `state.workflowBriefElicitation = null`.

**Observed.** Interactive and Expository topology is the title array in `buildFirstClassWorkflowFamily`. Authoritative source inserts `Normalize Content` at the front. Workshop is an Interactive variant (`variant: "workshop"`), not a separate pipeline. Focus, audience, and scope are copied onto `deliverySeed`. Steps are `{ title, role: "" }` with no prompt body stored at create.

**Observed.** Assessment topology is built in `buildAssessmentPackFamily`: optional `Normalize Content`, then Generate Learning Content, Model Knowledge, Define Learning Outcomes, then Plan Assessment Evidence, Author Assessment Components, and Design Page. Prompt bodies for the last three stages are written into the step at create. Depth, intent, count mode, and feedback timing are seed fields, not extra stages.

**Observed.** Save (`app.js`, workflow object around the `firstClassLocal` assignment) persists `selectedDomains`, `ldCreateOutputType`, `product`, `variant`, `startingPoint`, `sourceWorkflowId`, `workflowBriefResolution`, and steps. `ldCreateOutputType` is written even when `product` is also written.

**Observed.** Product output as source is `readFirstClassProductOutput`. It accepts only Interactive or Expository, and only the terminal Design Page capture. Learning Outcomes captures are rejected by that function. Assessment Pack is not a selectable product output there.

**Observed.** Input modes do not invent stages. They select `startingPoint` and, for source and product-output, the known Normalize prefix.

---

## 4. Interactive end to end

**Observed pipeline (topic):** Generate Learning Content → Model Knowledge → Define Learning Outcomes → Design Episode Plan → Design Learning Activities → Generate Activity Materials → Construct Learning Sequence → Design Page.

**Observed pipeline (authoritative source):** the same list with Normalize Content first. Local create does not add Normalize for any other starting point. Product-output-as-source is implemented on the Assessment receiver, not as an Interactive starting mode in `buildFirstClassWorkflowFamily` (only `authoritative_source` unshifts Normalize). **Uncertain** whether the Create UI offers product-output as an Interactive starting point; the family builder only special-cases `authoritative_source`.

**Observed.** Create stores titles, not prompts. Run-time instruction building is separate (`buildWorkflowStepInstructions` and domain prompt loading). Design Page capture is validated as a page partial, including Interactive visual-contract checks, unless the workflow is Assessment (separate validator) or Expository (separate knowledge-summary rules in `validateDesignPagePartialPageCapture`).

**Observed.** Final page assembly for non-Assessment workflows goes through `resolvePageForRenderOrAssembly` into the shared page path. Expository is a branch inside that path (`assembleExpositoryPageFromPartials`). Interactive is the remaining page-partial assembly.

**Shared with siblings:** Normalize (when selected), Generate Learning Content, Model Knowledge, Define Learning Outcomes, Design Page as a stage name, domain prompt-rule loading, learner renderer shell.

**Interactive-specific:** the four middle stages (episode plan, learning activities, activity materials, learning sequence) and Interactive Design Page field requirements.

**Historical, not on the local graph:** canonical-step names for assessment blueprint, items, feedback, slides, and VLE remain in the domain policy and in heuristics. They are not titles `buildFirstClassWorkflowFamily` emits.

---

## 5. Expository end to end

**Observed pipeline:** Generate Learning Content → Model Knowledge → Define Learning Outcomes → Expository Journey Plan → Expository Development → Expository Materials → Design Page, plus Normalize Content when the starting point is authoritative source.

**Observed.** Stage prompts for the Expository-specific stages, and the decision to consume domain guidance, live in `lib/expository-sibling-prompts.js`. Shared stages can still attach domain prompt rules (`DOMAIN_GUIDANCE_CONSUMPTION` includes GLC, Model Knowledge, and Learning Outcomes).

**Observed.** Replacement of an Interactive-shaped graph with those Expository titles happens inside `applyWorkflowDesignHeuristics`, in the block entered only when `!hasAuthoritativeProvidedSource()`. New local creates do not call that function. **Inferred:** the nested guard is reachable only for a model-generated graph that is later classified as Expository and lacks an authoritative source. It does not construct the first-class Expository workflow an author gets from Create today.

**Observed.** Assembly is the Expository partial assembler, not the Assessment publisher. Design Page validation requires Expository knowledge-summary material when `isExpositoryResourceWorkflow` is true. That predicate is true if `ldCreateOutputType` is `expository_resource`, or if a step id starts with `step_expository_`, or if an expository extent constraint is present. It can also match goal text. **Uncertain** how often the goal-text arm fires on a non-Expository workflow; the predicate is broader than `product === "expository"`.

**Sibling-specific:** journey plan, development, materials, and the Expository page synthesis contract.

**Shared contracts:** the three upstream Learning Design stages and Design Page as the terminal capture name.

---

## 6. Assessment Pack end to end

**Observed pipeline:** the Learning Design prefix above, then Plan Assessment Evidence (`evidence_plan`), Author Assessment Components (`assessment_pack`), Design Page (`assessment_design_page`). Topic omits Normalize. Authoritative source and product-output include it.

**Observed.** Evidence planning and component authoring prompts are the strings built in `buildAssessmentPackPrompts` and stored on the steps. They name the five supported forms and forbid short constructed response. Depth, count mode, and feedback timing are parameters in that prompt and in `deliverySeed`.

**Observed.** Publishing does not ask Design Page to restate the pack. `resolvePageForRenderOrAssembly` detects `workflowRecordIsAssessmentPack` and calls `assembleAssessmentPackPage` with the assessment-pack capture, the Design Page JSON, the upstream learning-outcomes artefact, and `resolvedFactors.feedback_timing`. The page kind is `assessment`. Outcome statements are taken from the Learning Outcomes artefact for ids the components map.

**Observed.** The learner runtime (`lib/learner-renderer-vnext/assessment-runtime.js`) judges responses deterministically and builds the evidence profile. Check versus Finish follows `feedback_timing` on the page. That behaviour is downstream of assembly, not a second authoring stage.

**Observed.** `readFirstClassProductOutput` does not treat an Assessment Pack as source material for a later first-class product.

**Historical Design Assessment machinery, still in the repo:** `applyWorkflowDesignHeuristics` computes `keepDesignAssessmentStep` from `assessmentBlueprintRequested` and diagnostic item flags, and can drop or keep titles `design assessment`, `generate assessment items`, and `design marking rubric`. `workflowBriefConfig.assessmentPolicy` still names `step_design_assessment` as the authority step. Local Assessment create does not emit those titles and does not call the heuristic. **Observed** from source order inside the heuristic: `keepDesignAssessmentStep` is assigned using `assessmentBlueprintRequested` before that variable is assigned later in the same function. Because both are `var`, the blueprint flag is still undefined at the first use. That matches the existing debt note. Reachability of the heuristic is the model-design path, not first-class Create.

---

## 7. Elicitation and workflow generation

**Observed.** First-class Create clears `workflowBriefElicitation` and returns before `ensureCreateWorkflowApiKeyPrerequisite` and before the model design request. A normal first-class product therefore does not reach workflow generation or the post-parse heuristics.

**Observed.** If that early return does not run, design continues into a model call and `applyWorkflowDesignHeuristics`. The gate is “not a normal first-class Learning Design create”: missing product, Research included, or no learning-design domain. The code does not branch on a literal name “Custom” at that gate. **Inferred:** Custom, Research, and any other non-first-class create share this generated path. It was not shown that every generated graph is what the UI labels Custom.

**Observed.** Elicitation state is still a live object for the generated path (`state.workflowBriefElicitation`, brief config from the domain pack, factor resolution that records sources as explicit, inferred, or elicited). First-class run state stores resolved factors from the local seed with `askedFactors: []`.

**Observed.** Domain Packs still configure that generated path: brief factors and assessment policy live in the Learning Design step-pattern file, and the heuristic reads `policy.canonicalSteps` from that world when it rewrites a generated graph.

**Uncertain.** Which generated-workflow screens are still reachable from the current Create UI once Learning Design and a product are selected. The code path is intact. This pass did not click through a Custom or Research create.

---

## 8. Authoritative artefacts

| Product | Model-authored artefacts (observed producers) | Deterministic assembly inputs |
| ------- | --------------------------------------------- | ----------------------------- |
| Interactive | Content, knowledge model, learning outcomes, episode plan, activities, materials, sequence, Design Page | Design Page / page partials through the shared page assembler |
| Expository | Same upstream three, then journey plan, development, materials, Design Page | `assembleExpositoryPageFromPartials` |
| Assessment | Same upstream three when that prefix is present, then evidence plan, assessment pack, Design Page presentation | `assembleAssessmentPackPage`: pack components, Design Page title/instructions/framing, Learning Outcomes statements, feedback timing from the create seed |

**Observed.** Assessment assembly resolves outcome statements from the Learning Outcomes artefact. It does not ask a later model to copy them. Interactive and Expository Design Page captures are themselves model artefacts that the page assembler publishes; this pass did not prove whether those captures restate earlier structured fields or only bind them.

**Observed.** Product-output reuse transports the terminal page text of Interactive or Expository into a new workflow as source material. It does not append the source workflow’s stages.

---

## 9. Assembly, preview, and publishing

**Observed.** One renderer entry, `resolvePageForRenderOrAssembly`, branches first on Assessment, then the remaining page path branches on Expository versus the shared page. Preview and export use the learner-renderer vNext bundle. Assessment checks and the evidence profile are a client runtime script, not a model call.

**Observed.** Product discrimination downstream uses `ldCreateOutputType`, `product`, step canonical ids, and, for Expository, the broader `isExpositoryResourceWorkflow` predicate. Assessment identity for assembly is `workflowRecordIsAssessmentPack`, which is separate from the Expository predicate.

**Historical visible downstream:** Interactive Design Page validation still knows the older visual-affordance contract. Assessment publish rejects that contract on its Design Page. The Learning Design prompt catalogue still describes it. Whether a stale copied prompt can still ask a first-class Assessment Design Page for those fields depends on `buildWorkflowStepInstructions` at run time. That function was not re-read line by line in this pass. **Uncertain** how much of the catalogue is still appended after the Sprint 88 prompt isolation.

---

## 10. Cross-product responsibility matrix

| Responsibility | Classification | Evidence |
| -------------- | -------------- | -------- |
| Domain Pack catalogues | Shared, and still the brief source for generated workflows | Manifest; `getWorkflowBriefConfig`; Expository guidance consumption |
| Product list on Create | Product-entry, not a pack field | `app.js` output-type constants |
| Predetermined stage list | Product-specific lists in one module | `first-class-workflow-family.js` |
| Topic vs source branch | Shared rule: Normalize prefix | `buildFirstClassWorkflowFamily`, `buildAssessmentPackFamily` |
| Product-output as source | Assessment receiver only, in the family reader | `readFirstClassProductOutput` |
| Prompt authorship | Split: Assessment baked at create; Expository sibling module; Interactive run-time composition | Family prompts; `expository-sibling-prompts.js` |
| Model execution of stages | Shared run loop | Not re-traced step by step; stage prompts are the intellectual work |
| Deterministic assembly | Product-specific publishers behind one resolver | `resolvePageForRenderOrAssembly` |
| Preview / learner runtime | Shared shell; Assessment runtime is its own script | Renderer vNext; `assessment-runtime.js` |
| Workflow elicitation / generation | Historical for first-class; still the non-first-class path | Early return versus model design plus heuristics |
| Custom | Not a separate code gate | Complement of `isNormalFirstClassLearningDesignCreate` |

Duplicated plumbing **observed** in the narrow sense that Expository stage titles exist both in the family module and again inside the heuristic rewriter. **Inferred** that the second copy only matters for generated graphs.

---

## 11. S88 debt, against this evidence

None of these are resolved.

**S88-AD-001.** The blueprint arm is still in `applyWorkflowDesignHeuristics`, and `keepDesignAssessmentStep` still reads `assessmentBlueprintRequested` before that binding. The function is still called after model workflow design. It is not called by first-class Create. The debt description remains accurate. Scope is the generated path, not the Assessment Pack pipeline.

**S88-AD-002.** The Expository title replacement still sits inside `if (!hasAuthoritativeProvidedSource())` in that same heuristic. Local Expository create does not use it. The debt description remains accurate for generated graphs. It is smaller than “how Expository is created today.”

**S88-AD-003.** Save still writes `ldCreateOutputType` beside `product` / `variant` / `startingPoint`. Callers such as `isExpositoryResourceWorkflow` and `isLdCreateExpositoryResource` still read it. No decision in this pass authorised that persistence. The debt description remains accurate.

**S88-AD-004.** Elicitation objects, brief-factor resolution, model workflow design, and the heuristic rewriter are still present and still run when create is not first-class. First-class create does not use them to choose topology. The debt description remains accurate. This pass did not measure how much of that machinery Research or a generated workflow still needs.

**S88-AD-005.** A new product’s stage list can be added in `buildFirstClassWorkflowFamily`, but Create UI, identity predicates, prompt construction, assembly, and several `isExpository` / `isAssessment` branches live in `app.js` and in publishers. The “not a single family member insert” description remains accurate. This pass did not design a boundary.

**S88-AD-006.** Domain Packs still own canonical-step policy, brief config, assessment-blueprint inheritance, and prompt rules. First-class topology does not come from that policy. Some Expository stages still declare that they consume domain guidance. The “reassess after deterministic create” description remains accurate. Nothing here says which pack duties are redundant.

---

## 12. Historical seams observed

- One Learning Design canonical-step list still names stages that first-class Create does not emit, including Design Assessment.
- Brief config still treats Design Assessment as the authority for item generation.
- Two Expository topologies: the family title list, and the heuristic rewriter behind a topic-only source check.
- Identity is stored twice: `product` and `ldCreateOutputType`.
- Expository detection is wider than the product field (type, step id prefix, constraint, goal text).
- Interactive and Expository prompts are applied at run from catalogues; Assessment prompts are stored at create.
- Product-output-as-source is implemented for feeding Assessment (and the reader rejects Assessment itself as that source).

---

## 13. Uncertainties

- How much Interactive run-time prompt text still comes from the Learning Design catalogue versus a code constant.
- Whether a current Create session can still open the elicitation panel after a first-class product is selected (the design function returns; other buttons were not traced).
- Whether goal-text inside `isExpositoryResourceWorkflow` can classify a non-Expository workflow as Expository during validation.
- Whether Assessment Design Page run instructions are fully isolated from the Interactive visual contract on every copy path (prior sprint work said they were; this pass did not re-audit the prompt string).
- What subset of heuristic and domain-policy behaviour Research create still depends on.

The hypothetical fourth-product diagnostic was not run.
