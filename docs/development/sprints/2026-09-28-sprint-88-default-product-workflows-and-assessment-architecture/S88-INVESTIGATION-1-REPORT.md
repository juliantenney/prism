# Sprint 88 — Investigation 1

**Default Product Workflow Topology, Elicitation, and Assessment Archaeology**

**Sprint:** 88 — Default Product Workflows & Assessment Architecture  
**Tasks:** [S88-T-001](PLAN.md) … [S88-T-009](PLAN.md)  
**Authorisation:** [S88-D02](decisions.md#s88-d02--authorise-investigation-1--topology-elicitation-and-assessment-archaeology)  
**Date:** 2026-09-28  
**Mode:** Investigation and documentation only. No production code, prompt, contract, schema, UI, test, or renderer change.

> Findings below are **not** architectural decisions. This report does not approve canonical/default workflows and does not specify an Assessment product.

### How to read this document

| Marker | Meaning |
| ------ | ------- |
| **Fact** | Observed in current code, pack contracts, tests, or a dated decision |
| **Inference** | Conclusion from those facts; not itself a decision |
| **Absent** | No repository evidence found for that claim |
| **Recommendation** | Candidate for later product judgement — not adopted here |

---

## 1. Executive finding

**Fact.** Learning Design product identity is chosen by the author before any model call: Self-study resource, Workshop, or Expository Resource (`LD_CREATE_OUTPUT_TYPE_*` in `app.js`, `getSelectedLdCreateOutputTypeFromUi`, `handleStartWorkflowDesign`).

**Fact.** That choice does not by itself instantiate a workflow. Design still requires a configured API key, then a model call that returns `steps[]`. Local heuristics in `applyWorkflowDesignHeuristics` then edit that list. The function returns the parsed object unchanged unless `parsed.steps` is an array.

**Fact.** Expository **topic** creation then **replaces** that list with a fixed sibling chain. Interactive creation does not. Interactive membership is the model list plus pack triggers, product seeds, and an explicit prune list that keeps any title it does not reject (`return true` at the end of the prune filter).

**Inference.** The working sentence “product determines topology; the brief determines parameters” is **true for the normal Expository topic path**, **only partly true for Self-study**, and **not true for uploaded-source Expository**, where the fixed replacement does not run. It is also not true of Interactive optional stages (assessment items, feedback, slides, VLE, source normalisation): those change which stages exist, not only how a stage behaves.

**Fact.** “Create without an API key” is blocked today. “Execute inside PRISM without an API key” is a different question: Run copies a locally assembled prompt and does not call the provider. The prompt still expects a model when the author runs it elsewhere.

---

## 2. Historical product-selection transition

### Before explicit product selection

**Fact.** Sprint 75 discovery recorded an open primary field, “What are you trying to design or produce?”, with output type encoded in free text (`S75-T-010` §3.2, labelled observation, not a decision).

**Fact.** The code path that still interprets prose is older than the selector and remains in `app.js`: `interpretWorkflowBriefText`, `extractWorkflowBriefExplicitFactors`, `applyWorkflowBriefInferenceRules`, and `callOpenAIForWorkflowIntentInterpretation` (“Infer likely factor values from a loose user brief”). Delivery cues in that extractor still map workshop language to `live_workshop` and self-study language to `self_directed`.

**Fact.** Sprint 26’s elicitation map treats `interpretWorkflowBriefText` as the owner of `session_materials` and `learning_environments` from prose (`docs/development/sprints/2026-05-20-sprint-26-pedagogical-intent-elicitation-orchestration/context-files/elicitation-runtime-entrypoints.md`).

**Absent.** No decision in this search shows a closed Self-study / Workshop / page product enum before `S75-D11`.

### The turning point

**Fact.** [S75-D11](../2026-08-10-sprint-75-prism-user-experience-and-interface/decisions.md) — **Accepted (2026-08-10)** — replaced that open framing, for Learning Design Create only, with **What are you creating?** Options then: **Self-study resource** and **Workshop** only. The decision says the choice maps onto existing factor / `workflowOutputSpec` machinery, is Create-time only, and is explicitly **not** a new persisted output-type architecture. Natural-language reading of supporting materials was preserved. A same-day presentation correction put the control on `#wfLdCreateOutputType`.

**Fact.** [S75-D22](../2026-08-10-sprint-75-prism-user-experience-and-interface/decisions.md) — **Accepted (2026-08-11)** — kept that chooser and removed Supporting contents (`desiredOutputs`) and Scope and constraints from the LD Create form, so a hidden second product could not ride along. Research kept inference via `objective_type`.

### After the selector

**Fact.** `handleStartWorkflowDesign` now returns before design if Learning Design is selected and the dropdown is empty. `composeLdCreateDesignIntent` prefixes the focus (`Create a self-study resource: …`, `Create a workshop: …`, later `Create an Expository Resource: …`). `mergeLdCreateOutputTypeIntoExplicitFactors` writes the product seed and forces `session_materials` to include `page`.

**Fact.** Elicitation after that point is missing-factor questions (`stage: "required"`), not a product menu. `callOpenAIForWorkflowIntentInterpretation` still runs when a brief config loaded.

**Inference.** Once the dropdown is set, elicitation no longer chooses the Learning Design product id. It still infers other factors and the design model still proposes `steps[]`. Responsibilities that only existed to *discover which product to build* are redundant for the LD product id. Responsibilities that fill topic, level, source posture, and optional assessment or delivery cues are not redundant.

**Fact.** Current save writes `ldCreateOutputType` on the workflow object. [S80-T-005A](../2026-08-26-sprint-80-settings-discovery-product-value-and-policy-architecture/S80-T-005A-minimal-runtime-parameter-contract-diagnostic.md) still described that field as Create UI plus factor seed, **not** a top-level saved field. **Absent:** a decision in this search that authorises persisting it. `isExpositoryResourceWorkflow` nonetheless treats `ldCreateOutputType === expository_resource` as sufficient.

### Expository as a product-specific pipeline

**Fact.** Sprint 83 investigated only. [S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md) made a sibling prompt family and a protected Interactive baseline binding for later planning, and said that decision does not decide topology.

**Fact.** [S85-D03](../2026-09-21-sprint-85-expository-resource-implementation/decisions.md) — **Accepted (2026-09-21)** — added Create product `expository_resource` and instructed heuristics to build:

```text
[Normalize?] → Generate Learning Content → Model Knowledge → Define Learning Outcomes
  → Expository Journey Plan → Expository Development → Expository Materials → Design Page
```

bypassing Episode Plan, Design Learning Activities, Generate Activity Materials, and Construct Learning Sequence. [S85-D07](../2026-09-21-sprint-85-expository-resource-implementation/decisions.md) placed production prompts for those sibling steps in `lib/expository-sibling-prompts.js` without modifying Interactive pack templates.

**Inference.** Sprints 75’s Self-study vs Workshop choice seeded delivery factors inside one Interactive stage family. Sprints 85–87 are the point at which product id selects a different stage list, prompt family, and assemble function (`assembleExpositoryPageFromPartials` when an expository journey plan is present and an episode plan is not).

---

## 3. Current workflow-creation architecture

**Fact.** The path that constructs a first-class Learning Design workflow is:

1. Author selects domain and `#wfLdCreateOutputType`, plus name and focus.
2. `handleStartWorkflowDesign` composes the intent, refuses an empty product, then calls `ensureCreateWorkflowApiKeyPrerequisite` **before** elicitation or design.
3. Local extraction and product-factor merge run. If required factors are still missing, an elicitation queue opens. Required Learning Design factors in the pack include `topic`, `learner_level`, `design_scope` (default `session`), `delivery_pattern` (default `face_to_face`), and `input_strategy` (`domain-learning-design-step-patterns.md`).
4. `callOpenAIForWorkflowIntentInterpretation` fills factor guesses. Comments and merge order say deterministic explicit values stay authoritative when both supply a value.
5. `continueWorkflowDesignGeneration` calls `callOpenAIForWorkflowDesign`, which rejects without `state.apiKey` and expects JSON `status: complete` plus `steps[]`.
6. `applyWorkflowDesignHeuristics` canonicalises, includes, prunes, orders, and, for Expository without an authoritative source, replaces `steps`.
7. Save (`handleSaveDesignedWorkflow`) stores that result. It does not call the model. It does require `state.workflowDesignResult`, which this path assigns only after a successful design parse.

**Fact.** Domain policy — canonical titles, dependencies, precedence, trigger rules — lives in `domains/learning-design/domain-learning-design-step-patterns.md`. `canonical_step_id` is generally `step_` plus the title slug (`workflowGenerationContext.js`), with explicit ids for the expository stages and Episode Plan.

**Fact.** Execution of a saved step, in this app, copies `resolveStepPromptText` to the clipboard (`createWorkflowStepElement`). That handler does not read `state.apiKey`. In-app `callOpenAI` is Prompt Studio, not Create and not that Copy action.

---

## 4. Interactive topology

Interactive here means the two Create products that still use the Interactive stage family: **Self-study resource** and **Workshop**. They are not one predicate.

### Self-study, topic, no assessment language

**Fact.** The product seed is `delivery_context: self_directed`, `delivery_mode: async`, `delivery_pattern: mostly_online`, `page_profile: learner`. Merge also sets `session_materials` to include `page`.

**Fact.** Because session materials are then explicit, trigger rules whose `include` list contains Design Page, Generate Slide Deck, or Generate VLE Structure are skipped (`hasExplicitSessionMaterials` in `applyWorkflowDesignHeuristics`). The pack rule that would include the whole page chain (Generate Learning Content through Design Page when `session_materials` contains `page` and `design_scope` is session/sequence/module) is one of those skipped rules.

**Fact.** `selfDirectedPageNeedsSequence` is true when the workflow is not Expository, `delivery_context` is `self_directed`, and materials include `page`. That inserts **Construct Learning Sequence** if missing.

**Fact.** Pack dependencies say Construct Learning Sequence requires `learning_activities` and `activity_materials`; those activities require outcomes and `page`; Episode Plan produces `page` from outcomes; outcomes require a knowledge model; the knowledge model requires normalised or generated content. Heuristic dependency closure is what adds missing producers. The resulting topic self-study chain observed from that mechanism is:

```text
Generate Learning Content
→ Model Knowledge
→ Define Learning Outcomes
→ Design Episode Plan
→ Design Learning Activities
→ Generate Activity Materials
→ Construct Learning Sequence
→ Design Page
```

**Inference.** For this narrow case the chain is locally determined by the product seed plus closure, but only after a model `steps[]` exists for heuristics to edit. It is not a literal fixed array in source, unlike the Expository replacement.

### Workshop

**Fact.** The workshop seed is `delivery_mode: live_workshop`, `delivery_context: in_person`, `delivery_pattern: face_to_face`, plus classroom as a learning environment. It still forces `page` onto `session_materials`. `selfDirectedPageNeedsSequence` therefore does **not** fire.

**Fact.** The composed goal `Create a workshop: …` matches a trigger whose only include is Construct Learning Sequence (`whenGoalMentionsAnyOf` includes `workshop`). That rule is not skipped by the delivery-rule filter.

**Fact.** `workshopRichWorkflowIntent` additionally force-includes Generate Learning Content, Define Learning Outcomes, Design Learning Activities, Generate Activity Materials, Construct Learning Sequence, and Design Page, but only when session-delivery, timed-session, explicit session-or-activity, **and** assessment-item cues are all present, and the workflow is not Expository.

**Inference.** A plain workshop is not the self-study predicate. It can still grow an activity chain because the goal trigger inserts sequence and closure pulls producers, and a rich workshop grows a forced chain when assessment language is also present. This investigation did not execute a live design; the predicates are the evidence.

### Shared Interactive conditionals

**Fact.** These change **membership**, not only step settings:

| Predicate | Effect |
| --- | --- |
| `generate_from_topic` | Remove Normalize Content |
| Authoritative source / `provided_source_content` | Insert Normalize Content; may insert Generate Learning Content after it |
| `assessment_required`, item count, or quiz/test/formative wording | Insert Generate Assessment Items |
| Explicit decline (`assessment_required === false`, “no assessment”, “teaching page only”) | Remove Generate Assessment Items, Design Assessment, Design Marking Rubric |
| Blueprint / coverage-map / assessment-design wording | Include Design Assessment |
| Items requested, unless `keepDesignAssessmentStep` | Prune Design Assessment |
| Feedback / delayed-reveal / debrief wording | Insert Design Feedback after items |
| Slides in materials or goal | Insert Generate Slide Deck |
| VLE / Moodle wording, except a single-page topic workflow | Insert Generate VLE Structure |
| `formativeAssessmentPackDefaultIntent` (plain formative wording without page/session/activity cues) | Drop Episode Plan, activities, materials, sequence |
| `leanAssessmentItemIntent` | Drop outcomes, episode plan, activities, materials, content, knowledge model, sequence, and Design Page |
| Cognition packs | Force activity stages on the Interactive path only |
| Selected starting artefact the brief does not ask to regenerate | Remove that producer and its upstream chain |

**Fact.** Audience, learner level, `page_profile`, item count, difficulty, and response format parameterise stages that are already present. `design_scope: single_activity` asks the design model for a smaller graph (`callOpenAIForWorkflowDesign`) but does not, by itself, remove sequence once `selfDirectedPageNeedsSequence` is true.

---

## 5. Expository topology

**Fact.** The product seed matches the self-directed learner page and also sets `activities_required: false` and `materials_required: false`. `sanitizeExpositoryGenerationFactors` drops Interactive-only factor ids, including assessment and activity factors.

**Fact.** When `isExpositoryResourceWorkflow` is true **and** `hasAuthoritativeProvidedSource()` is false, `applyWorkflowDesignHeuristics` **replaces** `out.steps` with:

```text
[Normalize Content, if already present or source posture requires it, and not generate-from-topic]
→ Generate Learning Content
→ Model Knowledge
→ Define Learning Outcomes
→ Expository Journey Plan
→ Expository Development
→ Expository Materials
→ Design Page
```

Quiz wording, activity wording, and the model’s own step list do not survive that replacement. Bindings are applied separately by `ensureExpositorySiblingInputBindingsForSteps`.

**Fact.** That replacement sits inside `if (!hasAuthoritativeProvidedSource())`. An Expository workflow whose starting point is authoritative source content does **not** take this replacement. It remains on the general heuristic path.

**Fact.** [S85-D03](../2026-09-21-sprint-85-expository-resource-implementation/decisions.md) states the sibling chain **including** an optional Normalize prefix, not a different graph. **Inference.** Current control flow and that decision disagree for the uploaded-source case. This investigation does not decide which is intended.

**Fact.** `expository_extent` is planning input for Expository Journey Plan. Sprint 85 settings copy states that extent does not change which stages run. Sibling prompt selection is `resolveExpositorySiblingPromptBodyForStep` for the three expository stages always, and for shared stages (including Design Page) only when the workflow is Expository.

---

## 6. Sources of genuine topology variation

**Fact.** These change which stages exist:

- Product: Self-study vs Workshop vs Expository (different predicates; Expository topic path replaces the list).
- Starting point: topic vs authoritative source (Normalize; and, for Expository, whether the replacement runs at all).
- Assessment intent, explicit decline, blueprint wording, formative-pack and lean-item intents.
- Feedback timing and discussion/diagnostic interaction mode.
- Extra delivery: slides, VLE structure, learning-object / Xerte wording.
- Cognition-pack detection on the Interactive path.
- Canonical titles the model emits that the prune filter does not reject (`return true`).

**Fact.** Non-canonical titles are dropped before that. The model cannot invent a stage type outside `workflowPolicy.canonicalSteps`.

**Fact.** Research is a separate domain path (objective inference, research content steps). It is not a Learning Design product.

---

## 7. Sources of parameter / configuration variation

**Fact.** These do not, by themselves, add or remove the normal stage list:

- Topic text, audience, learner level, `page_profile`.
- `expository_extent` / Scale-scope text on an Expository workflow.
- Assessment count, difficulty, coverage, and response format **once** Generate Assessment Items or Design Assessment is already in the graph. Adjustments apply quantity and difficulty only when capability `generate_assessment_items` is present.
- Many pack controls marked `elicitation: settings-only`, mapped by `applyWorkflowBriefMappings` onto `stepParamPatch`.
- Step prompt body seeded at save from the pack template (`override_prompt_body`), locally, with no model call.

**Inference.** Scale, audience, and item-count are honest parameters. Presence of Generate Assessment Items, Design Assessment, Normalize Content, Slide Deck, or the Expository sibling middle is not: each changes the educational object the workflow produces.

---

## 8. Current responsibilities of elicitation

Classification is a finding, not a decision. “Elicitation” here includes the assistant queue, the intent-interpretation model call, and the local factor extractors on the Create path. Stage editing after the design model returns is noted where it is the thing that actually decides membership.

| Responsibility | What does it today | Class |
| --- | --- | --- |
| Product identity | Dropdown. Design refuses to continue without it. | **3** — duplicated; the model does not choose it |
| Delivery factors for that product | `getLdCreateOutputTypePrimaryFactorSeed` overwrites primary delivery factors | **3** for the seed; intent interpretation may still propose the same factors |
| Understanding the focus | Local `composeLdCreateDesignIntent` joins product label and focus. Topic regex looks for “on” / “about”, not the colon form, so topic often reaches the model call still empty | **1** for having a topic; **2** for using a model to read a colon-form focus |
| Required-factor questions | Queue if topic, level, design scope, delivery pattern, or input strategy are missing | **1** while those fields are not already explicit; **2** if the form already holds them |
| `callOpenAIForWorkflowIntentInterpretation` | Always invoked once a brief config exists | **2** if required factors are already explicit; currently **1** only because the path always calls it |
| `callOpenAIForWorkflowBriefExtraction` | Only when the author answers an elicitation question | **2** |
| Selecting stages | Design model proposes `steps[]`. Heuristics then include, prune, and, for Expository topic, replace | **4** for the model’s act of choosing first-class stages; **1** for the local rules that currently finish the graph |
| Ordering stages | Precedence, dependencies, Episode Plan anchor, Expository array order. Model `depends_on` is rebuilt linearly | **3** — model order is not the saved order |
| Configuring stages | Brief mappings and settings-only factors | **1** for values later runs read; **3** where Adjustments expose the same keys |
| Source / starting point | UI `input_strategy`; local Normalize insert | **1** — and it is already local |
| One-sentence workflow `summary` | Design model | **2** |
| Domain suggestion when no domain is selected | Local regex, before any model call | **2** |
| Research objective when `objective_type` is empty | `inferResearchObjectiveFromBriefBlob` and elicitation | **4** |
| JSON repair if design output is malformed | Second model call inside `callOpenAIForWorkflowDesign` | **2** |

---

## 9. Model / API-key dependency trace

**Fact.** Opening Create does not call a model. `switchTab` leaves Create navigable; the key is gated on Design workflow.

**Fact.** The earliest blocking check on Design is `ensureCreateWorkflowApiKeyPrerequisite` (`hasConfiguredOpenAiApiKey`, meaning a non-empty `state.apiKey`), called at the start of `handleStartWorkflowDesign` after name, intent, and product checks, and **before** elicitation. The comment names the reason: Design is the first Create action that leads to OpenAI calls. The Design button is also disabled when no key is loaded (`syncWorkflowFactoryDesignAssistantChrome`).

**Inference.** The key gate is not caused by a missing elicitation answer. It is caused by the design call that follows, and it fires even when every required factor is already explicit.

**Fact.** The first model request on a design that proceeds is `callOpenAIForWorkflowIntentInterpretation`. If no key is present that function returns empty factors rather than throwing, but the gate returns before it is reached.

**Fact.** `callOpenAIForWorkflowDesign` throws `"API key not loaded"` and is the call that assigns `state.workflowDesignResult`. `applyWorkflowDesignHeuristics` does not run in a useful way without `parsed.steps`.

**Inference.** Both an Interactive graph and an Expository topic graph are computable from local seeds, pack dependencies, and the Expository replacement **if** a stub `steps` array were passed in. Nothing in the UI does that. A workflow cannot be created, saved, and inspected through Design without a successful model design call, because Save requires that result.

**Fact.** After save, running a step inside PRISM does not call the provider. Copy builds the prompt locally. The author still needs a model to produce the step output, outside this gate.

**Fact.** Prompt Studio `callOpenAI` and `runPromptReview` are separate and do require a key. They are not the Create path.

| Question | Answer from this trace |
| --- | --- |
| Can the workflow object be **created** with no API key? | **No** on the current Design path |
| Could the **topology** be built locally if the design call were bypassed? | **Yes for Expository topic** (fixed list). **Yes for the normal Self-study chain** only as an inference from seeds plus closure, not as a fixed array, and only if heuristics were invoked with a stub `steps[]` |
| Can the workflow be **executed** with no model at all? | **No.** In-app execution does not call the model; the prompt is still model work |

---

## 10. Dynamic-assembly value still present

**Fact.** The canonical catalogue contains stages that normal first-class topic products do not emit: Generate Slide Deck, Generate VLE Structure, Generate Learning Object Set, Design Assessment, Design Feedback, Validate Learning Design, Revise Assessment Based on QA, Design Marking Rubric, and, on the Expository path, the whole Interactive middle.

**Fact.** [S75-D22](../2026-08-10-sprint-75-prism-user-experience-and-interface/decisions.md) stopped Learning Design Create from using `desiredOutputs` to invite a second product. The pack note says `desired_outputs` is not used on Learning Design Create. Optional stages still enter through wording and factors inside `applyWorkflowDesignHeuristics`, not through a second product dropdown.

**Fact.** Reachable combinations that change the educational object include: source normalisation; an assessment-item stage beside or instead of the activity chain; a blueprint stage; feedback after items; slides or VLE structure; a lean item-bank graph that drops page scaffolding; a formative-pack graph that drops the episode/activity middle; Research workflows; and any extra **canonical** title the model emits and the prune list keeps.

**Inference.** A default-workflow path that only ever instantiated the Self-study eight-step chain and the Expository seven-step chain would make those combinations unreachable unless they were reintroduced as explicit options. Some of that reachability is demonstrated and educational (source posture, assessment items versus an activity resource). Some is residual catalogue surface (marking rubric, QA revise, learning-object set) that [S75-D11](../2026-08-10-sprint-75-prism-user-experience-and-interface/decisions.md) already refused as Create products. Unused catalogue entries are not, by themselves, evidence that model-driven assembly is still required for first-class products.

**Fact.** Custom/generated value that remains specifically model-shaped is: proposing a summary; proposing canonical stages the rules did not already force; Research objective inference. Ordering and product identity are already local.

---

## 11. Assessment architecture inventory

Three layers are live in the repository. They are not one product.

### A — Formative assessment inside an Interactive resource

**Fact.** The default Self-study chain includes Design Episode Plan, Design Learning Activities, and Generate Activity Materials. Learner evidence is commissioned on activity materials (`evidence_requirement` in `lib/page-dla-enrich.js` and `lib/ld-gam-page-enrich-contract.js`). The renderer turns those materials into workspaces (`lib/learner-renderer-vnext/compose-workspace.js`).

**Fact.** Sprint 72 locked this as activity-pipeline work, not a new stage: [S72-D10](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md), [S72-D11](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md), [S72-D12](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md). Generate Activity Materials refuses `assessment_check` at its own stage (`lib/page-gam-enrich.js`).

### B — Assessment-design machinery

**Fact.** These stages are still in `workflowPolicy.canonicalSteps` and still have pack prompts: Design Assessment, Generate Assessment Items, Design Feedback, Validate Learning Design, Revise Assessment Based on QA, Design Marking Rubric.

**Design Assessment** (`step_design_assessment`). Pack purpose: define how learning will be assessed and ensure valid evidence; output `assessment_blueprint`; do not generate items. Trigger is blueprint / coverage-map / difficulty-profile / assessment-design wording. Sprint 80’s diagnostic (`S80-T-011`) recorded that a blueprint-only goal yields Design Assessment and not Generate Assessment Items. Downstream consumers named in the pack and assembler include Generate Assessment Items (optional blueprint), Design Marking Rubric (`requires: assessment_blueprint`), Validate Learning Design, and `assessment_design` in `lib/page-vnext-assemble.js`. Sprint 23 governance (`docs/development/sprints/2026-05-18-sprint-23-learning-design-pack-rationalisation/ld-design-assessment-semantics.md`) states Design Assessment owns what is assessed and Generate Items owns item generation. [S80-D07](../2026-08-26-sprint-80-settings-discovery-product-value-and-policy-architecture/decisions.md) closeout treats alpha assessment as items-first and Design Assessment as not required.

**Fact.** `keepDesignAssessmentStep` is computed at the point where `assessmentBlueprintRequested` and `assessmentItemsRequested` are still the hoisted `undefined` values of later `var` declarations in the same function (`var assessmentItemsRequested` and `var assessmentBlueprintRequested` appear after that assignment). The blueprint arm therefore does not contribute. The diagnostic-misconception arm can still contribute via `assessmentItemCountHint`, which is assigned earlier. The later prune then drops Design Assessment when items were requested unless that flag is true.

**Generate Assessment Items** (`step_generate_assessment_items`). Pack purpose: generate concrete items from outcomes, with an optional blueprint. Live output is a partial page with `assessment_check.items[]` (`lib/ld-gai-page-enrich-contract.js`), not the historical `assessment_items` JSON. It is included when `assessment_required` is true or the goal matches quiz / MCQ / test / question-bank / knowledge-check / formative wording. Page-like triggers in the pack exclude it, and explicit decline prunes it. It does not require Design Assessment (`requiresAnyOf: learning_outcomes | assessment_blueprint`). The learner renderer (`lib/learner-renderer-vnext/assessment-interactive.js`) turns evaluable MCQ and true/false items into a Check control. That control presents this stage’s output. It is not the activity workspace in layer A.

**Fact.** `assessment_strategy` and `assessment_cadence` are brief constraints. They do not name a stage. `page_profile: "assessment"` is a page voice, not a product id.

### C — A future Assessment product

**Fact.** Create offers only `self_study_resource`, `workshop`, and `expository_resource`. There is no Assessment product workflow. [S75-D11](../2026-08-10-sprint-75-prism-user-experience-and-interface/decisions.md) listed an assessment pack as out of scope. This report does not design one.

**Fact.** Expository replacement and `EXPOSITORY_INTERACTIVE_ONLY_FACTOR_IDS` remove assessment stages and assessment factors from the Expository topic path.

### Do assessment conditionals explain dynamic assembly?

**Inference.** They explain a real part of Interactive membership variation, not most of it, and none of the Expository topic replacement. Larger switches are product, source versus topic, the activity chain, sequence, slides, VLE, and cognition packs. After the Expository replacement, assessment predicates do not survive.

---

## 12. Relationship to current Interactive formative assessment

**Fact.** A Self-study resource with no assessment language does not include Generate Assessment Items: page materials are explicit, the page trigger that would have included items is skipped, and nothing re-adds the stage. Formative checking on that resource is layer A (activity tasks, evidence requirements, materials, learner workspaces).

**Fact.** Mentioning a quiz, item count, or formative questions on a Self-study or Workshop brief inserts layer B (items, and sometimes feedback) **beside** that activity chain, unless a lean or formative-pack intent instead **strips** the activity chain.

**Inference.** “Interactive formative assessment” in the shipped resource is the activity/evidence path. “Design Assessment” and “Generate Assessment Items” are an older, still reachable, item-and-blueprint path. They overlap in educational language and are separate in topology, contracts, and renderer surfaces.

---

## 13. Models A / B / C

### Model A — Mandatory elicitation and dynamic assembly remain the normal first-class route

| | |
| --- | --- |
| Preserves | Every reachable canonical combination, including model-emitted extras the prune list keeps; Research inference; current Design UX |
| Removes or bypasses | Nothing |
| Simpler | Nothing in creation |
| Less capable | Nothing |
| API during creation | Still required, because design is a model call even when the product and factors are explicit |
| Interactive | Stays rule-edited model output |
| Expository | Stays a local replacement that still waits on that model call, and still skips the replacement for authoritative source |
| Custom / generated | Unchanged |
| Assessment machinery | Unchanged: conditional, easy to trigger by wording, with the Design Assessment flag ordered as it is now |
| Migration | None |

**Inference.** Model A describes the control flow. It does not describe Expository topic topology, which is already deterministic after the model returns.

### Model B — Canonical topology instantiated locally; elicitation only for custom graphs

| | |
| --- | --- |
| Preserves | Normal Expository topic chain; the usual Self-study activity chain; parameters that already do not change membership; custom/generated design as an advanced path |
| Removes or bypasses | The design-model call on the normal first-class path; intent interpretation when the form already holds topic and required factors |
| Simpler | Creation of the two normal products; API key not required until a step prompt is actually run |
| Less capable | Silent loss of slides, VLE, learning objects, assessment-item graphs, blueprint graphs, feedback stages, and source-specific shape unless those are reintroduced as explicit choices |
| API during creation | Not required for the normal instantiate/configure/save/inspect path. Still required to **produce step outputs** |
| Interactive | Requires an explicit canonical chain. Today that chain is emergent from seeds and closure, and Workshop does not use the Self-study predicate |
| Expository | Matches the topic replacement. Does **not** match the authoritative-source branch, which would have to be specified |
| Custom / generated | Kept behind the existing model design call |
| Assessment machinery | Normal Interactive resources would not grow an item stage from incidental wording. Layer A would remain. Layer B would be reached only by an explicit choice or by the custom path |
| Migration | Saved workflows stay as stored graphs. New normal creates would not pass through `callOpenAIForWorkflowDesign`. The uploaded-source Expository disagreement with S85-D03 has to be resolved first or it will be baked in |

### Model C — Hybrid justified by the variation this investigation actually found

Normal first-class **topic** creates instantiate a product chain locally.

Structural options stay explicit and local, not model-inferred: starting posture (topic vs source), and any optional stage whose presence changes the educational object (assessment items, and, if still wanted, slides or VLE). Wording does not silently add or remove those stages.

Model-driven design remains the path for custom graphs, Research, and any catalogue stage that is not part of the product chain.

| | |
| --- | --- |
| Preserves | Product-specific topology already implemented for Expository topic; Interactive activity/evidence formative path; parameters; custom assembly where the graph is genuinely not the product chain |
| Removes or bypasses | Using the design model to rediscover product identity, order, and the normal stage list; using free text to attach assessment or delivery stages on a normal product create |
| Simpler | The normal create path, and the explanation of what a product *is* |
| Less capable | Incidental wording would no longer change topology. Authors who rely on “mention a quiz in the focus box” would need an explicit control or the custom path |
| API during creation | Not required for a normal product instantiate. Required for custom design, and still required outside PRISM to execute step prompts |
| Interactive | Self-study topic chain can be the canonical chain. Workshop needs its own statement: the code does not treat it as the self-directed chain |
| Expository | Topic chain can be the canonical chain. Source posture must be specified, because the code and S85-D03 currently disagree |
| Custom / generated | Keeps dynamic assembly, including residual catalogue stages |
| Assessment machinery | Layer A stays inside the Interactive chain. Layer B stays available as an explicit option or a custom graph, not as a hidden branch of every resource |
| Migration | Same as Model B for saved graphs. Smaller than B if optional stages remain choosable without a model |

---

## 14. Evidence-based recommendation

**Recommendation, not a decision.** Model A is what the Design button does, and it asks a model to propose a graph the product seed and heuristics mostly overwrite. Model B is accurate for Expository topic creation and approximately accurate for a topic Self-study resource, and it is too coarse for Workshop, for source posture, and for assessment-item topology. Model C is the smallest description that matches the evidence: deterministic product chains for normal creates; explicit local choices where stage membership changes the educational object; model-driven assembly retained for custom and Research workflows.

Do not parameterise away Generate Assessment Items, Normalize Content, or the Expository sibling middle. Those are different workflows, not settings on one workflow.

---

## 15. Risks and counter-evidence

- **Workshop is not Self-study.** Treating “Interactive” as one canonical chain would erase a live predicate difference (`self_directed` versus `live_workshop`, and `workshopRichWorkflowIntent`).
- **Uploaded-source Expository** does not take the sibling replacement. Adopting the topic list as “the” Expository workflow would either change that branch or quietly leave it on the old assembler. S85-D03 reads as if both were the same chain.
- **Model-emitted canonical extras** still survive the prune filter. A deterministic chain would drop those even when an author had obtained them through Design. That is a capability change, not a no-op.
- **`keepDesignAssessmentStep`’s blueprint arm is dead** because of `var` order. Any account of “when Design Assessment is kept” that follows the flag’s expression rather than its assignment order will overstate blueprint retention.
- **Topic extraction** does not read the colon-form focus. Removing intent interpretation without putting topic on the form would leave required `topic` empty.
- **Execution still needs a model** somewhere. Removing the Create key gate does not make step outputs local.
- **Persisted `ldCreateOutputType`** is read by `isExpositoryResourceWorkflow` but this search found no decision that authorised saving it. A local instantiator would make that field load-bearing.

---

## 16. Questions requiring product judgement

1. Is a plain Workshop supposed to be the same activity chain as Self-study, a facilitation chain, or “only the rich chain when the brief also asks for assessment”?
2. For Expository, should authoritative source use the S85-D03 chain plus Normalize, or is the current skip of the replacement intentional?
3. Which optional stages are still products an author may choose on a normal create (assessment items, slides, VLE), and which belong only on the custom path?
4. Is Design Assessment still a stage authors should be able to reach, given S80-D07 and the broken blueprint arm of `keepDesignAssessmentStep`?
5. Should normal first-class creation be possible with no API key, accepting that **running** a step remains model work outside that gate?

---

## 17. Candidate next step

**Not authorised by this report.** If product judgement answers §16, a later decision could open a **planning** pass that specifies: the Self-study chain, the Workshop chain, the Expository chain including source posture, and which membership changes remain explicit options. That pass would still not be implementation, and it would not design an Assessment product.

No implementation tasks are recorded in [PLAN.md](PLAN.md).
