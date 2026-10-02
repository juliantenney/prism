# Sprint 89 — Implementation slice 4

**Status:** Landed. Sprint 89 remains **OPEN**.

## Integration boundary

The three first-class products are declared in `lib/first-class-workflow-family.js`.

Each product record has an id, an author-facing label, a prompt route, and a publish route. Assessment also names its Create-parameter hook and the products whose completed output it accepts as source (`interactive` and `expository` only).

Create choices are declarations of those products. Workshop is an Interactive variant, not a fourth product. `listCreateDeclarations()` is what Create uses. The HTML select is presentation: on load, Learning Design Create replaces its options from that list. A test checks the markup values against the declaration so the two cannot drift unnoticed.

Shared code asks the declaration:

- `promptRouteForWorkflow` — `interactive`, `expository`, `assessment`, or `generic`
- `publishRouteForWorkflow` — `learner_page`, `expository_page`, `assessment_pack`, or empty
- `readFirstClassIdentity` — a stored product is accepted only if it is one of the three declared ids

Custom, Research, and unknown workflows are not in the list. They get the generic prompt route and no publish route. Generic prompts stay math and strict JSON only. A non-first-class page still uses the shared learner-page assembler.

## Left product-specific

- Interactive prompt-factory text and runtime scaffolds
- Expository sibling prompts and filtered domain guidance
- Assessment stage prompts
- Assessment depth, count, intent, and feedback timing controls
- The Assessment publisher (`assembleAssessmentPackPage`)
- The shared learner-page assembler, which already distinguishes Expository captures from Interactive captures
- The renderer shell

There is no plugin loader, schema, or universal assembler.

## Fourth-product recheck

A nameless fourth predetermined sibling would now change:

1. `lib/first-class-workflow-family.js` — add the product, its Create choice if it has one, and its predetermined stages.
2. A new module for its prompt text, if the text is not one of the three existing routes.
3. A new module for its publisher, if `learner_page`, `expository_page`, or `assessment_pack` is the wrong output.
4. One branch in `applyWorkflowStepRuntimePromptAugmentations` if the prompt route is new.
5. One branch in `resolvePageForRenderOrAssembly` if the publish route is new.
6. Product-specific Create controls in `index.html` only when it has its own parameters, registered by `parameterHook`.

It would not change Domain Pack topology, Custom, or the other products' prompt text. Identity is the declaration. Create options come from the declaration at runtime.

Investigation 2, before this slice: about four existing modules, with many separate branches in `app.js`. After this slice the recognition list is one declaration. `app.js` still has the two route switches, which is the integration point for a genuinely new prompt chain or page kind.

S88-AD-005 is **resolved** on that basis. It is not zero-edit extensibility.

## LOC anomaly

The written rule says to exclude three generated renderer files. The historical totals of **152139 / 224** and **149205 / 224** match a walk that includes those files.

Those three files are `lib/learner-renderer-vnext-browser.js` (20110), `lib/learner-renderer-vnext-export-runtime.js` (1509), and `lib/learner-renderer-vnext-export-runtime-source.js` (14).

The same walk today is **224 files and 148565 lines**. From the Slice 2 total that is −640, which is exactly `app.js` −529, `workflowGenerationContext.js` −219, and the family module +108 since Slice 2.

The Slice 3 figure **127995 / 222** excluded those generated files, so it is not comparable. Conclusion: **B.** The Slice 3 application-JS recount used a narrower scope than the totals it was compared with. Named-file baselines were not wrong.

Corrected application JavaScript, same 224-file scope as the baseline:

| Point | Files | Lines |
| ----- | ----: | ----: |
| Baseline | 224 | 152139 |
| After Slice 2 | 224 | 149205 |
| After Slice 4 | 224 | 148565 |

## Named files

| | Baseline | Slice 3 | Slice 4 |
| - | -------: | ------: | ------: |
| `app.js` | 60110 | 56593 | 56647 |
| Cluster | 64154 | 60418 | 60580 |
| `workflowGenerationContext.js` | 1009 | 790 | 790 |
| Family module | 520 | 520 | 628 |
| Learning Design pack + manifest | 5192 | 4276 | 4276 |

Slice 4 added 54 lines to `app.js` and 108 lines to the family module. Cluster +162 versus Slice 3. No new architecture file.

## Tests

Focused product-family tests passed. First-class gate: **339 passed, 0 failed**.

Broad suite, same command as Slice 3 (`npm run test:full`): **4220 tests, 3702 passed, 517 failed, 1 skipped**. Slice 3 was 4214 / 3696 / 517 / 1. The six additional tests are this slice's product-family tests. The failure count did not change. No new broad-suite failures were introduced. The suite is not green.
