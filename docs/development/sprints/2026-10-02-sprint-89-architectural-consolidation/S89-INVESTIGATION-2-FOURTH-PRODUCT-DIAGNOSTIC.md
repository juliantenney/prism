# S89 Investigation 2 — Fourth-product diagnostic and pre-consolidation line baseline

**Status:** Diagnostic and measurement. Not a refactoring plan and not a decision to build a product.  
**Held fixed:** S89-D01 through S89-D05.  
**Prior evidence:** [S89-INVESTIGATION-1-CURRENT-PIPELINE.md](S89-INVESTIGATION-1-CURRENT-PIPELINE.md) · [S89-INVESTIGATION-1B-CURRENT-RESPONSIBILITY-BOUNDARIES.md](S89-INVESTIGATION-1B-CURRENT-RESPONSIBILITY-BOUNDARIES.md)

The probe is a nameless fourth first-class Learning Design product with a predetermined pipeline, shared upstream stages, its own intellectual stages and prompts, deterministic assembly, preview and publishing, and topic plus authoritative-source modes. Product-output-as-source is optional. It does not use workflow elicitation, model-generated workflow design, Research, or Interactive assessment questions.

---

## 1. Executive summary

Another predetermined product could be added without calling workflow elicitation or the design model, and without editing Domain Pack `canonicalSteps` or `assessmentPolicy`. Those are not on the first-class create path.

The cost is not a new file in a family registry. Almost every recognition point is a handwritten branch, and most of them live in `app.js`. The family module is the one place that already lists pipelines. Publishing, prompt augmentation, identity tests, and the Create form each learn products separately. A fourth product that is not marked Assessment or Expository falls through those branches into Interactive treatment. That is the central accidental coupling.

The repository currently behaves as products added by branching, with a real shared prefix and a real family module, not as a family where a new member is mostly new files. S89-D01–D05 say an implementer should not extend `applyWorkflowDesignHeuristics`, the Design Assessment policy, or Research in order to add it. The code would not force them to. It would still tempt them, because those mechanisms are how an older graph was reshaped into a product.

---

## 2. Line-count baseline

**When:** 2026-10-02, before any Sprint 89 implementation.  
**What:** physical lines. Count newline bytes (`0x0A`). If the file is non-empty and does not end with a newline, count the last line as well. Blank lines count. This matches `wc -l` when the file ends with a newline.

**Repeat:** from the repository root, the same rule, the same inclusion lists below. Do not switch to a logical-line or token count.

### Named files

| File | Lines |
| ---- | ----- |
| `app.js` | 60110 |
| `workflowGenerationContext.js` | 1009 |
| `lib/first-class-workflow-family.js` | 520 |
| `lib/expository-sibling-prompts.js` | 502 |
| `lib/expository-domain-guidance.js` | 175 |
| `lib/assessment-pack-publish.js` | 312 |
| `lib/assessment-component-forms.js` | 116 |
| `lib/page-vnext-assemble.js` | 1046 |
| `lib/educational-quality-framework-prompt.js` | 216 |
| `lib/ld-design-page-partial-contract.js` | 148 |

**Architectural cluster (those ten JavaScript files):** **64154**.

Learning Design pack, same counting rule, not included in the JavaScript totals:

| File | Lines |
| ---- | ----- |
| `domains/learning-design/domain-learning-design-principles.md` | 231 |
| `domains/learning-design/domain-learning-design-artefacts.md` | 625 |
| `domains/learning-design/domain-learning-design-step-patterns.md` | 3824 |
| `domains/learning-design/domain-learning-design-prompt-rules.md` | 472 |
| `domains/domain-manifest.json` | 40 |

**Learning Design pack plus manifest:** **5192**.  
There is no separate elicitation module. Generation and heuristics are inside `app.js` and `workflowGenerationContext.js`.

### Total application JavaScript

**152139** lines in **224** files.

**Scope:** every `.js` file under the repository root and under `lib/`, except the exclusions.

**Excluded:** `node_modules/`, `docs/`, `tests/`, `.git/`, `lib/mathlive/` (vendor), `lib/learner-renderer-vnext-browser.js`, `lib/learner-renderer-vnext-export-runtime.js`, and `lib/learner-renderer-vnext-export-runtime-source.js` (generated bundles). Markdown domain packs are outside this JavaScript total.

### `app.js` ranges

These are top-level `function` spans (from the function line through the line before the next top-level function). They overlap in responsibility. Do not add them.

| Area | Lines | Span |
| ---- | ----- | ---- |
| `continueWorkflowDesignGeneration` (model-design entry) | 22982–23259 | 278 |
| `isNormalFirstClassLearningDesignCreate` | 23270–23281 | 12 |
| `applyLocalFirstClassWorkflowDesign` | 23282–23332 | 51 |
| `applyLocalAssessmentPackDesign` | 23403–23483 | 81 |
| `handleStartWorkflowDesign` | 23484–23870 | 387 |
| `applyWorkflowDesignHeuristics` | 24679–26781 | 2103 |

`keepDesignAssessmentStep` is inside the heuristic, around lines 24819–24822, and reads `assessmentBlueprintRequested` before that variable is assigned at line 24856. Identity helpers are small and scattered: `isExpositoryResourceWorkflow` is lines 5482–5514; `workflowRecordIsAssessmentPack` is lines 10159–10164. Prompt augmentation is `applyWorkflowStepRuntimePromptAugmentations`, lines 17475–17526, and calls helpers elsewhere. There is no single elicitation function.

---

## 3. Hypothetical product assumptions

A fourth sibling with a fixed stage list, shared upstream Learning Design stages, its own intellectual stages and prompt contracts, its own deterministic publisher, topic and authoritative-source entry, and optional product-output-as-source. No elicitation. No generated workflow. No Research. No Interactive question stages. Not a copy of Interactive, Expository, or Assessment pedagogy.

---

## 4. Product declaration and Create

| Touchpoint | Why it changes | Class | Assumption exposed |
| ---------- | -------------- | ----- | ------------------ |
| `app.js` output-type constants and the Create `<select>` in `index.html` | The product list is a constant, not pack data | Legitimate shared contract for a selector; the list itself is duplicated in script and HTML | Each product is a new option in two places |
| `normalizeLdCreateOutputType` and `isNormalFirstClassLearningDesignCreate` | Unknown types never take the local-create return | Legitimate shared contract | First-class means “this string is on the list” |
| `handleStartWorkflowDesign` | Assessment has its own local function; the other products share one | Accidental coupling if the new product’s parameters cannot fit `applyLocalFirstClassWorkflowDesign` | Assessment was a special case bolted beside the pair |
| Save block that copies `product`, `variant`, `startingPoint` | Already generic if the family identity is filled | Legitimate shared contract | Persistence can follow identity without a new field, except `ldCreateOutputType` still has to be mirrored |
| Product-parameter widgets | Assessment depth, count, and feedback are their own DOM and sync functions | Legitimate product-specific UI, implemented as more `app.js` | Parameters are not a shared parameter block |

A coherent single declaration does not exist today. The family module, the Create constants, the HTML select, and the assembly predicates must each be taught the new id.

---

## 5. Pipeline

| Touchpoint | Why | Class | Assumption |
| ---------- | --- | ----- | ---------- |
| `lib/first-class-workflow-family.js` `buildFirstClassWorkflowFamily` | New title list and starting-point rule belong here | Legitimate product-specific implementation inside the shared module | This file is the predetermined-pipeline home |
| Normalize prefix | Already a shared rule for `authoritative_source` | Legitimate shared contract | Topic vs source is not product pedagogy |
| Domain Pack `canonicalSteps` | A predetermined product does not need its name added there | Legacy if an implementer edits it anyway | The pack list still looks like the source of topology |
| `applyWorkflowDesignHeuristics` | Local create never calls it | Legacy. A correct fourth product does not modify it | Older products were repaired after generation |

---

## 6. Prompt and intellectual contracts

An implementer would have to choose among three existing styles.

- Copy Interactive: leave `promptBody` empty, accept a catalogue `promptFactory` seed at save, then accept `applyWorkflowStepRuntimePromptAugmentations`. That path appends Interactive activity and Design Page contracts unless a new predicate returns early. **Accidental coupling.**
- Copy Expository: add templates in a sibling module and a branch in `resolveStepPromptText` / the augmentation function. Domain prompt rules can be appended only if that module asks for them. **Legitimate product-specific module**, plus **accidental coupling** in `app.js` because the branch is a new `if`.
- Copy Assessment: store `promptBody` in the family module so save skips the catalogue seed. Design Page isolation still depends on `workflowRecordIsAssessmentPack` being extended or a new predicate being added beside it. **Legitimate product-specific prompts**, **accidental coupling** in the augmentation guard.

Domain Pack content does not have to change for a predetermined pipeline. It would change only if the implementer wanted Interactive-shaped catalogue templates. Under S89-D02 they should not need `canonicalSteps` or `assessmentPolicy`.

`app.js` would need a product-specific prompt branch if the new product must not inherit Interactive scaffolds. That branch is the coupling, not the prompt text.

---

## 7. Product identity

Places that would need to recognise the product, from the traces already in hand:

- Create type list and `normalizeLdCreateOutputType` (`app.js`, `index.html`)
- `buildFirstClassWorkflowFamily` product test
- Save of `product` and the mirrored `ldCreateOutputType`
- A new predicate or an extension of the Assessment/Expository tests used by prompt augmentation, Design Page validation, copy instructions, and `resolvePageForRenderOrAssembly`
- Renderer page-kind check if the output is not a normal page (`lib/learner-renderer-vnext/build-page-model.js` treats `page_kind === "assessment"` as special)

Authoritative identity is `workflow.product` plus the create-type string. Heuristic identity is the Expository goal/name test, step-id prefix, and constraint flag. A new product does not need those heuristics. If it is not caught by an explicit predicate, `isExpositoryResourceWorkflow` can still steal it when the name or goal matches “create an expository resource”, and otherwise the Interactive augmentation and page path accept it. **Teaching PRISM what the product is** is a set of scattered predicates. **Implementing what it does** is the new prompt module and publisher. The recognition cost is the larger share of edits to existing files. The behaviour cost is mostly new code that never gets reached until those predicates exist.

Rough existing modules that must be edited only to recognise it and route it: `app.js`, `index.html`, `lib/first-class-workflow-family.js`, and, if the page is not a normal learner page, the renderer page-model (and possibly `render-page.js`). That is **4**, with `app.js` repeated across many functions rather than one edit.

---

## 8. Artefacts

Shared run capture is keyed by step output name and canonical id. A new artefact type can be stored as a step capture without a new transport framework. **Legitimate shared contract:** the capture map.

**Legitimate product-specific:** validators for that artefact, and the publisher that reads it.

**Accidental coupling:** `resolvePageForRenderOrAssembly` and Design Page validation know Assessment and Expository shapes by name. A fourth artefact does not flow into the right assembler unless one of those functions gains another branch. Interactive field requirements run on any Design Page that is not Assessment and not caught as Expository.

---

## 9. Assembly, preview, publishing

A new `lib/<product>-publish.js` is legitimate product-specific work, as `assessment-pack-publish.js` and `assembleExpositoryPageFromPartials` already are.

To reach it, `resolvePageForRenderOrAssembly` in `app.js` must learn the product. That function is also the Interactive and Expository decision. **Accidental coupling:** one shared publisher entry contains product knowledge for all current siblings.

The learner-renderer shell can host a new page kind only if `build-page-model.js` and the renderer do not assume non-assessment pages are the Interactive/Expository page. **Uncertain** how far a distinct runtime can go before `render-page.js` needs a branch. A product that is “just another page” may pass through the shared renderer after its own assembler returns a page. That path is legitimate sharing. A product that is not a page still has to be refused by the Assessment and Expository branches so it is not published as one of them.

---

## 10. Input modes and product-output-as-source

Topic and authoritative source are already parameters of `buildFirstClassWorkflowFamily` (Normalize is prepended for source). A fourth product can reuse that if it is added as another product arm rather than copied only into the Assessment builder. **Legitimate shared contract**, currently split: Assessment duplicates the prefix in its own function.

Product-output-as-source is Assessment-specific in the family module (`readFirstClassProductOutput` plus the Assessment create UI). Adding another receiver means extending that reader’s allow-list and the receiving product’s start UI. It does not require every product to accept every other. **Legitimate product-specific** if the new product is a receiver. **Accidental coupling** only if Interactive or Expository assembly must change to feed it; today they already emit a Design Page, and the reader lifts that capture without their publishers knowing about Assessment.

---

## 11. Domain Packs

| Pack use for product four | Class |
| ------------------------- | ----- |
| General instructional principles the author still wants in a prompt, if a sibling module explicitly appends filtered rules the way Expository does | Genuine domain guidance, optional |
| Interactive `promptFactory` seeds and activity scaffolds | Interactive material the new product inherits only by falling through `app.js` |
| `canonicalSteps`, brief elicitation, `assessmentPolicy` | Generated-workflow material a predetermined product should not need |
| No pack edit at all | Sufficient for the pipeline itself |

Principles and artefacts files are loaded by `buildWorkflowGenerationContext`, which is the model-design path, not first-class run prompts. They are not a required edit.

---

## 12. Legacy collisions

| Machinery | Would a correct fourth product need it? | Class |
| --------- | ---------------------------------------- | ----- |
| Workflow elicitation | No | Legacy for this extension |
| Model-generated workflow design | No | Legacy for this extension |
| `applyWorkflowDesignHeuristics` | No | Legacy for this extension |
| `canonicalSteps` update | No | Legacy temptation |
| Design Assessment, Generate Assessment Items, Design Feedback, `assessmentPolicy` | No | Legacy; belongs to old Interactive questions, not a new product |
| Research | No | Not a current requirement (S89-D04) |
| Heuristic Expository detection | No; it can misfire | Legacy inference |

---

## 13. Change matrix (condensed)

See sections 4–12. Counts below are modules, not edit sites inside `app.js`.

**Existing modules a fourth product must modify to be recognised and routed:** `index.html`, `app.js`, `lib/first-class-workflow-family.js`, and likely `lib/learner-renderer-vnext/build-page-model.js` if it has a non-default page kind. **4.** `app.js` is many separate branches, not one.

**Natural new modules:** a prompt/contract module and a publisher module. A small runtime module only if the learner page needs behaviour the shared renderer does not have. **2**, sometimes **3**, plus tests. Tests are not product behaviour.

**File that absorbs the most unrelated branching:** `app.js`.

---

## 14. Investigation 1B uncertainties now closed enough for this diagnostic

**Plan Assessment Evidence and Author Assessment Components.** They enter `applyWorkflowStepRuntimePromptAugmentations` because only Assessment Design Page returns early. The helpers that were opened return immediately unless the step is Design Learning Activities, Generate Activity Materials, Design Page, or the old assessment-question ids (`step_generate_assessment_items`, `step_design_assessment`, `step_design_feedback`). Those ids and titles are not the Assessment Pack canonical ids or titles. **Observed:** PAE and AAC do not match those gates. They do not receive the Interactive scaffolds those functions add. This does not prove some unreviewed helper has no effect. It is enough to say the known Interactive contracts do not target them.

**Expository Model Knowledge.** `DOMAIN_GUIDANCE_CONSUMPTION` names `model_knowledge`, and the comment says there is no Expository template. `resolveExpositorySiblingPromptBodyForStep` only takes journey, development, materials, and the shared set GLC / learning outcomes / Design Page. Model Knowledge is not in that set, so the guidance append is not run for it. **Observed:** the consumption entry does not cause Model Knowledge to receive the filtered pack block.

**Principles and artefacts files.** `buildWorkflowGenerationContext` concatenates every domain file into the model-design prompt. `continueWorkflowDesignGeneration` is that caller. First-class run guidance loads prompt-rules, not the principles file. **Observed:** principles and artefacts are generation-context material, not a first-class execution inject, except artefacts can also match the lean prompt-file filter. They are not required to add product four.

**Custom naming.** `isExpositoryResourceWorkflow` is true when goal, design intent, or name matches “create an expository resource”. A Custom workflow with that name takes the Expository prompt branch and skips the visual-affordance appender. A Custom workflow that is not classified that way, with a Design Page step, receives the Interactive visual contract. **Observed.**

General-only Design usage was not investigated.

---

## 15. Architectural pressure points

1. `app.js` as the product switch for create, prompts, validation, copy text, and assembly.
2. Falling through to Interactive when a workflow is neither Assessment nor Expository.
3. Two sources of topology appearance: the family module (real for first-class) and the domain canonical list plus heuristics (real only for generated graphs).
4. `ldCreateOutputType` kept beside `product`.
5. Prompt style is three incompatible habits, so product four has no single contract slot.

---

## 16. S88-AD-001…006

Not resolved.

- **001.** Still the broken keep-flag. A fourth product should not meet it. The wider question machinery is the same legacy bucket and is also unnecessary.
- **002.** The nested Expository rewrite is on the generated path only. A fourth product should not extend it. The duplicate title list remains evidence of two mechanisms.
- **003.** A new product would still be mirrored into `ldCreateOutputType` because identity checks read it. The debt still matters; the diagnostic shows the field is part of the recognition cost.
- **004.** Generation is not required to add a sibling. The temptation is that it used to be how products were shaped. Custom does not use it.
- **005.** The diagnostic is the evidence: family membership is not yet “add a member”. It is “edit `app.js` in several roles, then add product files the branches must name”.
- **006.** Packs are optional guidance and a generated-workflow catalogue. They are not the place a new pipeline is defined. No removal decision.

---

## 17. Remaining uncertainties

- How many renderer files a non-page product would touch beyond `build-page-model.js`.
- Whether every augmentation helper between the Design Page return and the end of `applyWorkflowStepRuntimePromptAugmentations` is gated. The ones inspected are. An exhaustive list was not made.
- How the Create HTML and `app.js` constants drift from each other in practice. Both must change; that is observed.

---

## Answers

1. **Yes.** Local create returns before elicitation and the design model. Product four belongs on that return.
2. **Yes.** `canonicalSteps` and `assessmentPolicy` are not the first-class stage source.
3. **About 4 existing modules** to recognise and route it (`index.html`, `app.js`, `lib/first-class-workflow-family.js`, and the renderer page-model if the page kind is special). `app.js` is many sites.
4. **2 or 3 new modules** (prompts, publisher, optional runtime), plus tests.
5. **`app.js`.**
6. **Strongest accidental coupling:** (1) non-Assessment, non-Expository workflows receive Interactive prompt scaffolds and Design Page contracts; (2) `resolvePageForRenderOrAssembly` is a product switch, not a shared call into a product publisher; (3) Create special-cases Assessment beside a generic first-class function, so the next parameterised product has no shared parameter slot.
7. **Strongest legacy that should not take part:** (1) model workflow design and `applyWorkflowDesignHeuristics`; (2) Design Assessment / item generation / `assessmentPolicy`; (3) goal/name Expository detection and the canonical-step list as a topology authority.
8. **Shared contracts that already work:** the upstream stage names (Normalize when sourced, Generate Learning Content, Model Knowledge, Define Learning Outcomes); run capture by output name; product identity fields on save when the family sets them; the learner-renderer shell once a page model exists; product output lifted as source text without splicing stages.
9. **More a set of products added through branching** than a coherent family. The family module and the shared upstream stages are real. Recognition, prompts, and publishing are still per-product branches in `app.js`, and the older generation path is still present beside them.
10. **Tempting and conceptually wrong under S89-D01–D05:** adding the product by extending the heuristic rewriter or `canonicalSteps`; giving it Interactive `promptFactory` scaffolds so Design Page “just works”; hanging formative question stages on it or on Interactive; treating a generated workflow or a Research path as the way to discover its pipeline; calling that generated path Custom.
