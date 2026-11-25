# Sprint 105 — Validation Plan

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Status:** **CLOSED — COMPLETE (2026-11-25; M1 `4b698db`, M2 `09cfbfc`, M3 `83e7aec`, M4 `a7ad249`, all manual acceptance checks confirmed)**  
**Baseline:** `a7ad249` (implementation complete; closed per `S105-D04`)

---

## 1. Evidence & scope boundaries

- Do **not** pull pre-existing [PB-S-008](../../../backlog/PRODUCT-BACKLOG.md#pb-s-008--full-suite-pre-existing-failures-technical-debt) failures into Sprint 105.
- Preserve both the original pre-intervention Economics baseline (`c01-page.json`, `c01-zip/`, `c02-page.json`, `tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`, and external captures) and the incomplete Sprint 104 regeneration untouched throughout Sprint 105.

---

## 2. Milestone verification gates & observed results

### Milestone 1 gate — Stage contracts, deterministic LJ assembler, workflow versioning & strict legacy separation (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `node --check lib/learning-journey-assemble.js` | **Pass** (exit 0) | New UMD module syntax clean |
| `node --check lib/page-vnext-assemble.js` | **Pass** (exit 0) | Additive LJ stage registration & delegation clean |
| `node --check lib/first-class-workflow-family.js` | **Pass** (exit 0) | Workflow versioning (`s105_v1`) & brief-source origin clean |
| `node --check tests/s105-m1-lj-assembly.test.js` | **Pass** (exit 0) | Test syntax clean |
| `tests/s105-m1-lj-assembly.test.js` | **8 / 8 pass** | Complete 5-stage assembly & immutable DP top-level/commission/journal keys (zero intermediate leakage); mandatory 5-stage enforcement (Stage 2/3 omission fails closed); deterministic brief-provided source transport & conflict rejection; single-stage ownership & cross-stage integrity across Stages 1–5 (including pre-injection continuity & Stage 1 outcome subset/conflict); constituent journey & disabled journal integrity; strict legacy separation (progressive rejects monolithic bypass; legacy monolithic passes); `page-vnext-assemble.js` delegation & workflow-capture assembly; live downstream compatibility with unchanged `first-class-commission-intake.js`, `learning-journey-shared-source.js`, `learning-journey-unified-shell.js`, and `learning-journey-workload-feasibility-adapter.js` |
| `tests/page-vnext-assemble.test.js` | **32 / 32 pass** | Interactive & Practice partial-page assembly non-regression |
| `tests/s85-expository-assembled-learner-page-sections.test.js` | **6 / 6 pass** | Expository progressive assembly non-regression |
| `tests/s96-lj-shared-source-design-page-boundary.test.js` | **19 / 19 pass** | Shared source write-once boundary non-regression |
| `tests/s104-m5-workload-estimation.test.js` | **6 / 6 pass** | Sprint 104 M5 authoritative duration & workload adapter non-regression |
| **Focused Milestone 1 total** | **71 / 71 pass** | Zero regressions across Interactive, Expository, LJ shared source, and S104 M5 |

*Baseline observation (outside M1 scope):* Running `tests/s104-m1-duration-transport.test.js` showed 10/11 passing; the single failure at `tests/s104-m1-duration-transport.test.js:1011` (`resolveEffectiveWorkflowDurationMinutes(` static count `5 !== 3` in `app.js`) is pre-existing from Sprint 104 M5 (`f1f1269`), as Sprint 105 M1 did not touch `app.js`.

### Milestone 2 gate — Economical prompts, Step 5 runner-guidance fix & continuity reconciliation (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `node --check` on `lib/learning-journey-assemble.js`, `lib/learning-journey-shared-source.js`, `lib/learning-journey-design-page.js`, `lib/learning-journey-sibling-prompts.js`, `app.js`, `tests/s105-m2-prompts-and-continuity.test.js` | **Pass** (exit 0) | All touched JS files syntax clean |
| `tests/s105-m2-prompts-and-continuity.test.js` | **5 / 5 pass** | All 5 progressive prompts aligned verbatim to M1 contracts without legacy prose checklists or arbitrary word-count limits; thin Step 5 editorial-only contract; deterministic brief-provided shared-source transport without retranscription; authoritative stored-capture handoff honours author edits & never leaks Stage 4 specs/context/source into Stage 5; `S105-AD-002` Step 5 Interactive runner-guidance leak fixed for both progressive & legacy LJ in live `app.js` VM; `S105-AD-003` reconciled continuity guidance & validator; legacy LJ & Interactive preserved |
| `tests/s105-m1-lj-assembly.test.js` | **8 / 8 pass** | M1 stage validators, deterministic assembler & legacy separation intact |
| `tests/s104-m4-proportionate-commissioning.test.js` | **2 / 2 pass** | Sprint 104 M4 proportionate commissioning non-regression |
| `tests/s94-learning-journey-wp2-continuity-validation.test.js` | **20 / 20 pass** | Continuity validator & automatic-transfer rejection non-regression |
| `tests/s103-duration-fidelity-guidance.test.js` | **5 / 5 pass** | Familiar vs unfamiliar reading & duration fidelity guidance non-regression |
| `tests/s96-lj-shared-source-design-page-boundary.test.js` | **19 / 19 pass** | Shared source boundary non-regression |
| `tests/s91-learning-journey-design-page-run-stage.test.js` | **4 / 4 pass** | LJ Design Page run-stage routing & Interactive non-regression |
| Non-LJ product family design-page suites (`s94-assessment-design-page-framing-string`, `s92-situated-task-slice1-family-design-page`, `s85-expository-design-page-visual-affordances`, `s85-expository-design-page-capture-shape`) | **37 / 37 pass** | Assessment Pack, Situated Task, and Expository product families unaffected |
| **Focused Milestone 2 total** | **100 / 100 pass** | Zero regressions across LJ and non-LJ product families; no live generation yet |

### Milestone 3 gate — Run orchestration, invalidation, reload persistence, clear-run, duplication & legacy compatibility (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `node --check` on `lib/learning-journey-assemble.js`, `lib/learning-journey-sibling-prompts.js`, `app.js`, `tests/s105-m2-prompts-and-continuity.test.js`, `tests/s105-m3-lifecycle-and-orchestration.test.js` | **Pass** (exit 0) | All touched JS files syntax clean |
| `tests/s105-m3-lifecycle-and-orchestration.test.js` | **6 / 6 pass** | 5-stage progressive capture, validation, persistence & deterministic assembly requiring all 5 stages and rejecting monolithic bypass; authoritative author-edit propagation through compact Stages 2–5 handoffs (Stage 5 receives editorial cues without specs/source) + upstream invalidation clearing downstream stages & run-derived metadata while preserving brief-provided source; reload persistence restoring all 5 stages identically, failing closed on corrupted Stage 3, and zero phantom captures on empty reload; origin-aware clear-run & clean workflow duplication (`S105-AD-004`) for both run-generated and brief-provided source; legacy pre-105 LJ monolithic Step 5 compatibility; stale async persistence write abort & durable `ABSENT≠DELETE` purge preventing resurrection on reload |
| `tests/s105-m2-prompts-and-continuity.test.js` | **5 / 5 pass** | M2 progressive prompts, strengthened handoff assertions, Step 5 runner-guidance fix & continuity reconciliation |
| `tests/s105-m1-lj-assembly.test.js` | **8 / 8 pass** | M1 stage contracts, deterministic assembler & legacy separation |
| `tests/qa-lj-no-phantom-run-captures.test.js` | **2 / 2 pass** | Zero phantom run captures across commission creation & switching |
| `tests/qa-lj-batch-component-creation.test.js` | **6 / 6 pass** | LJ single & batch component creation non-regression |
| `tests/qa-lj-commission-native-and-lifecycle.test.js` | **3 / 3 pass** | Commission-native creation & deletion lifecycle non-regression |
| `tests/s96-lj-shared-source-design-page-boundary.test.js` | **19 / 19 pass** | Shared source write-once & derived-stat contradiction boundary |
| `tests/s94-learning-journey-wp2-continuity-validation.test.js` | **20 / 20 pass** | Continuity validation & author inspection / learner export safety |
| `tests/s91-learning-journey-design-page-run-stage.test.js` | **4 / 4 pass** | LJ Design Page run-stage routing & Interactive isolation |
| `tests/s103-clear-run-learner-runtime-isolation.test.js` | **7 / 7 pass** | Clear run data learner-runtime isolation non-regression |
| `tests/s102e-clear-run-data-practice-child.test.js` | **3 / 3 pass** | Clear run data Practice child & stale persist abort non-regression |
| `tests/page-vnext-assemble.test.js` | **32 / 32 pass** | Interactive & Practice partial-page assembly non-regression |
| `tests/s85-expository-assembled-learner-page-sections.test.js` | **6 / 6 pass** | Expository progressive assembly non-regression |
| `tests/s104-m5-workload-estimation.test.js` | **6 / 6 pass** | Authoritative durations & workload feasibility adapter non-regression |
| Sprint 104 M2–M4 safeguards (`s104-m2-practice-episode-plan`, `s104-m3-downstream-practice-reconciliation`, `s104-m4-proportionate-commissioning`) | **13 / 13 pass** | Sprint 104 Practice & proportionate commissioning safeguards intact |
| **Focused Milestone 3 total** | **140 / 140 unique tests pass** (`127/127` + `13/13` M2–M4; `19/19` M2–M5) | Zero regressions across LJ lifecycle, clear-run, duplication, Interactive, Practice, Expository, and Sprint 104 safeguards; no live generation yet |

### Milestone 4 gate — Pre-live readiness, live-acceptance fixes (`a7ad249`), manual live acceptance & Sprint 104 handback (**Complete & Accepted 2026-11-25**)

#### Pre-live gap-coverage & browser readiness checks (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `index.html` script inventory & cache freshness | **Pass** (`112/112` on disk, `26` bumped to `?v=20261125-s105-m4`) | Eliminated stale browser cache tokens on `app.js`, `learning-journey-*.js`, `page-vnext-assemble.js`, `first-class-*.js`, and S104 workload/Practice/Expository/Situated modules |
| Live browser readiness (`http://localhost/prism/index.html`, read-only) | **Pass** (`0` non-200 script responses, `109` PRISM globals loaded) | Confirmed fresh M3 handoff/prompt logic active in browser memory and `buildFirstClassWorkflowFamily({ product: "learning_journey", ... })` produces `progressive_capture_version: "s105_v1"`, `duration_contract_version: "s104_m1"`, `source_context_origin: "brief_provided"`, `outputSpec.partialPageOutputs: true`, and all 5 ordered LJ steps |
| `tests/s102-commission-native-lo-bind.test.js` | **27 / 27 pass** | Component & journey LO marker extraction, fail-closed validation, planning delivery |
| `tests/s102e-commission-native-runtime-path.test.js` | **13 / 13 pass** | Script load order (`commission-native-lo-bind` before intake) & commission-native routing across products |
| `tests/s103-artefact-consumer-four-product.test.js` | **5 / 5 pass** | 4-product artefact continuity proposal & read-only consumer resolution |
| `tests/s95-m2-learning-journey-unified-shell.test.js` | **7 / 7 pass** | Unified shell HTML, Markdown overview, CSS embedding & ZIP assembly |
| `tests/s95-m5-unified-publishing-ui.test.js` | **3 / 3 pass** | Single ZIP download control routing LJ to unified shell |
| `tests/s96-lj-unified-overview-editorial-opening.test.js` | **4 / 4 pass** | Parent Editorial Opening banner & offline ZIP resolution on Overview |
| **Outstanding gap-coverage total** | **59 / 59 pass** | Plus `7 / 7` functional/contract Journal pipeline assertions passing in `s97-m3-t1-learning-journal-pipeline.test.js` (its 2 static legacy-prompt regex failures are pre-existing `PB-S-008` baseline debt documented in Sprint 104 `VALIDATION.md`) |

#### Live-acceptance defect fix — `evaluate` evaluative refinement sequencing (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `tests/episode-plan-v1-archetype-grammar.test.js` | **8 / 8 pass** | `evaluate` accepts `evaluative_judgement → independent_performance`, integrated `evaluative_judgement` without extra `independent_performance`, and `independent_performance → evaluative_judgement`; integrated `evaluative_judgement` binds response/evidence materials; genuine ordering/core violations still fail closed |
| `tests/episode-plan-v1-validation.test.js` | **3 / 3 pass** | Episode Plan V1 validation & non-regression |
| `tests/s104-m2-practice-episode-plan.test.js` | **8 / 8 pass** | Practice Episode Plan AI authoring, grammar enforcement, outcome coverage, and Interactive non-regression |
| `tests/s104-m3-downstream-practice-reconciliation.test.js` | **3 / 3 pass** | Practice downstream reconciliation & Interactive guard |
| `tests/learner-renderer-vnext-episode-plan-v1-archetypes-imp014b.test.js` | **2 / 2 pass** | Canonical binding & vNext render non-regression |
| `tests/s105-lj-commission-workload-estimation.test.js` | **7 / 7 pass** | Integrated workload estimation, clause-filtering safety, and Practice feedback contract consistency preserved |
| `npm run check:learner-renderer-vnext-browser` | **Pass** | Rebuilt browser artefacts match source |
| **Focused live-acceptance fix total** | **31 / 31 pass** | Zero regressions across grammar, canonical binding, Practice contracts, and workload estimation |

#### Live-acceptance defect fix — Expository Design Page visual-affordance vocabulary & native scatterplot distinction (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `tests/s85-expository-design-page-visual-affordances.test.js` | **12 / 12 pass** | Expository DP prompt lists all 8 `PURPOSES` and 15 `REPRESENTATIONS` verbatim; distinguishes natively rendered deterministic SVG scatterplots from unrealised image-pipeline graphics; keeps Sprint 38 validator strict (`scatterplot` not added to image-pipeline enum); `expository-xm-illustration-handoff` never misclassifies structured scatterplots as unrealised illustrations while preserving number-line handoff |
| `tests/s85-expository-design-page-capture-shape.test.js` | **10 / 10 pass** | Expository DP capture shape & assembly non-regression |
| `tests/s93-expository-xm-illustration-handoff.test.js` | **5 / 5 pass** | XM illustration handoff non-regression |
| `tests/qa-c02-expository-structured-rendering.test.js` | **5 / 5 pass** | Native deterministic inline SVG scatterplot rendering & accessible tables |
| `npm run check:learner-renderer-vnext-browser` | **Pass** | Rebuilt browser artefacts match source |
| **Focused Expository DP fix total** | **32 / 32 pass** | Plus `12 / 13` in `s96-c2-expository-number-line-formula-regression` (1 unrelated pre-existing decorative editorial-opening caption assertion) |

#### Live-acceptance defect fix — Authoring graphics SVG intake & rasterization (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `node --check` on `lib/prism-visual-assets.js`, `lib/utilities-visual-jobs-workspace.js`, `app.js` | **Pass** (exit 0) | Syntax clean |
| `tests/s105-svg-visual-asset-intake.test.js` | **4 / 4 pass** | Clipboard SVG extraction, `viewBox`/2× normalization, fail-closed rejection of active/external SVG content, human prompt PNG/SVG delivery guidance, and dropzone SVG file acceptance |
| `tests/sprint-70-slice-6-utilities-visual-jobs-workspace.test.js` | **26 / 26 pass** | Visual jobs workspace UI, attachment hooks, and compiler integration non-regression |
| `tests/sprint-70-slice-7-visual-jobs-human-prompt.test.js` | **13 / 13 pass** | Human prompt derivation & handoff non-regression |
| `tests/sprint-70-slice-7a-human-prompt-quality.test.js` | **16 / 16 pass** | Prompt modality, representation guidance, and quality diagnostics non-regression |
| **Focused SVG intake fix total** | **59 / 59 pass** | Zero regressions across existing graphics jobs, attachment pipeline, and prompts |

#### Live-acceptance defect fix — Economics C1 graphical construction-prose suppression (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `tests/s105-c1-figure-construction-prose-suppression.test.js` | **5 / 5 pass** | Real Economics C1 `"Construct a clean horizontal number line..."` spec suppressed in learner preview & ZIP export; caption, alt text, `M02` accessible text, genuine learner-facing `detailed_description`, unattached illustration fallback, and native S2 scatterplot preserved; Design Page prompt distinguishes learner-facing vs production-only `detailed_description` |
| `tests/s102e-expository-publication-defects.test.js` | **7 / 7 pass** | Layout-commission prose suppression & Expository publication contracts |
| `tests/learner-figure-description-contract.test.js` | **17 / 17 pass** | Textbook figure description contract, numbering, `aria-describedby`, standalone export & browser bundle parity |
| `tests/s85-expository-design-page-visual-affordances.test.js` | **12 / 12 pass** | Expository Design Page visual-affordance prompt & validator non-regression |
| `tests/s105-svg-visual-asset-intake.test.js` | **4 / 4 pass** | Retained SVG intake & 2× PNG rasterisation contract |
| `npm run check:learner-renderer-vnext-browser` | **Pass** | Rebuilt browser artefacts match source (preview/ZIP parity) |
| **Focused C1 construction-prose fix total** | **45 / 45 pass** | Plus `12 / 13` in `s96-c2-expository-number-line-formula-regression` (1 pre-existing `PB-S-008` decorative editorial-opening alt assertion) |

#### Live-acceptance defect fix — Nested scatterplot & accessible table realisation across all 6 sections of C1 Expository (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `tests/s105-c1-full-expository-scatterplots-and-sections.test.js` | **1 / 1 pass** | Complete 6-section Economics C1 end-to-end fixture: S1 prose, S2 `M01` SVG scatterplot + restored `accessible_table`, S3 `M02` + `Figure 1` correlation scale (no construction prose), S4 `M03` & S5 `M04` nested `initial_evidence.scatterplot` realised as SVG + semantic tables + staged sequence + zero raw spec/path leakage, S6 `M05` summary table, and preview/ZIP parity |
| `tests/s105-c1-figure-construction-prose-suppression.test.js` | **5 / 5 pass** | Retained C1 construction-prose suppression & accessible-text preservation |
| `tests/s105-practice-scatterplot-publication.test.js` | **6 / 6 pass** | Practice scatterplot publication non-regression |
| `tests/qa-c02-expository-structured-rendering.test.js` | **5 / 5 pass** | Expository SVG scatterplots, response/feedback disclosures, and standalone/unified export parity |
| `tests/s87-t004-ad010-structured-materials.test.js` | **12 / 12 pass** | Structured material fallback, table, timeline, and browser-bundle export parity |
| `tests/s93-expository-structured-publication.test.js` | **7 / 7 pass** | Expository structured publication & representation-spec non-regression |
| `tests/s93-expository-xm-illustration-handoff.test.js` | **5 / 5 pass** | XM illustration handoff & nested native scatterplot exclusion |
| `tests/s102e-expository-publication-defects.test.js` | **7 / 7 pass** | Schema-mechanic suppression & Expository publication contracts |
| `tests/s105-svg-visual-asset-intake.test.js` | **4 / 4 pass** | Retained SVG intake & 2× PNG rasterisation contract |
| `npm run check:learner-renderer-vnext-browser` | **Pass** | Rebuilt browser artefacts match source (preview/ZIP parity) |
| **Focused C1 6-section fix total** | **47 / 47 pass** (`node --test` count across 9 suites) | Zero regressions across Expository, Practice, structured materials, and SVG intake |

#### Live-acceptance defect fix — Remaining structured-comparison publication defects in S4 (`M03`) & S5 (`M04`) (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `tests/s105-c1-full-expository-scatterplots-and-sections.test.js` | **1 / 1 pass** | Complete 6-section C1 fixture including S4 `ordered_expenditure_values`, `pearson_correlation_reveal`, `datasets[]` cross-ref manifest, and S5 `comparing_successive_observations` + `comparing_the_positions_of_observations_within_each_distribution` `series[]`: zero exposure of `Title`, `Coefficient`, `Coefficient display`, `Series`, `Observation ids`, `Ordered values`, `Successive differences`, `Relative vertical positions`, `Unit`, `Values`, `Horizontal variable`, `Horizontal step`, `Vertical variable`, `Difference unit`, `Accessible distribution comparison`, `Comparison guidance`, `Qualification`, or incomplete S5 coefficient block; row-aligned semantic HTML tables & preview/ZIP parity verified |
| `tests/s105-c1-figure-construction-prose-suppression.test.js` | **5 / 5 pass** | Retained C1 construction-prose suppression & accessible-text preservation |
| `tests/s105-practice-scatterplot-publication.test.js` | **6 / 6 pass** | Practice scatterplot publication non-regression |
| `tests/s105-svg-visual-asset-intake.test.js` | **4 / 4 pass** | Retained SVG intake & 2× PNG rasterisation contract |
| `tests/qa-c02-expository-structured-rendering.test.js` | **5 / 5 pass** | Expository SVG scatterplots, disclosures, and standalone/unified export parity |
| `tests/s87-t004-ad010-structured-materials.test.js` | **12 / 12 pass** | Structured material fallback, tables, timelines, and browser-bundle export parity |
| `tests/s87-t007-terminal-closure-order.test.js` | **10 / 10 pass** | Expository terminal closure & section ordering non-regression |
| `tests/s93-expository-structured-publication.test.js` | **7 / 7 pass** | Expository structured publication & representation-spec non-regression |
| `tests/s93-expository-xm-illustration-handoff.test.js` | **5 / 5 pass** | XM illustration handoff & nested native scatterplot exclusion |
| `tests/s102e-expository-publication-defects.test.js` | **7 / 7 pass** | Schema-mechanic suppression & Expository publication contracts |
| `npm run check:learner-renderer-vnext-browser` | **Pass** | Rebuilt browser artefacts match source (`?v=20261125-s105-m4n` in `index.html`) |
| **Focused C1 structured-comparison fix total** | **57 / 57 pass** (`node --test` count across 10 suites) | Zero regressions across Expository, Practice, terminal ordering, structured materials, and SVG intake |

#### Workstream 1 — Expository representational necessity & workload proportionality (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `node --check lib/expository-sibling-prompts.js` | **Pass** (exit 0) | Syntax clean |
| `tests/s105-expository-representational-necessity.test.js` | **3 / 3 pass** | EJP, XD, and XM carry generic representational necessity & duration proportionality principle, 3-way distinction, prohibition on uncommissioned derived series/transformations, task-relative accessible-equivalence judgement, zero arbitrary caps/tiers, zero Interactive semantics, XD `materials_commission[].constraints` guidance, XM anti-duplication guidance, and runtime Expository augmentation parity |
| `tests/s85-wp3-expository-sibling-prompts.test.js` | **14 / 14 pass** | Expository sibling prompt routing, judgement rules, domain guidance, and Interactive isolation |
| `tests/s99-expository-academic-plain-english.test.js` | **4 / 4 pass** | Expository Academic Plain English & non-duplication on EJP/DP |
| `tests/s85-expository-design-page-visual-affordances.test.js` | **12 / 12 pass** | Expository DP visual-affordance prompt & validator non-regression |
| `tests/s85-expository-stepnotes-parameterisation.test.js` | **4 / 4 pass** | Expository stepNotes materialisation & Interactive isolation |
| `tests/s85-wp2-expository-contracts.test.js` | **12 / 12 pass** | Expository EJP/XD/XM contracts, extent, and assembly non-regression |
| `tests/s105-c1-full-expository-scatterplots-and-sections.test.js` | **1 / 1 pass** | Preserved existing 6-section Economics C1 artefact regression evidence untouched |
| **Focused Workstream 1 total** | **50 / 50 pass** (`node --test` count across 7 suites) | Zero regressions across Expository prompts, contracts, runtime augmentation, and preserved C1 artefact |

#### Workstream 2 (`S105-D03`) — Optional block-level material anchors in Expository exposition (**Verified 2026-11-25**)

| Check / Suite | Result | Verified Scope |
| ------------- | ------ | -------------- |
| `node --check` on `lib/expository-material-anchors.js`, `lib/expository-contracts.js`, `lib/page-vnext-assemble.js` | **Pass** (exit 0) | Syntax clean |
| `npm run check:learner-renderer-vnext-browser` | **Pass** | Rebuilt browser bundle matches source (`?v=20261125-s105-m4p` in `index.html`) |
| `tests/s105-expository-material-anchors.test.js` | **9 / 9 pass** | Interleaved exposition, multiple anchors, mixed anchored/unanchored, XD/lock/assembly validation errors (unknown, `material_id`, malformed, cross-section, duplicate), defensive rendering & actionable diagnostics, literal syntax in code fences/inline code/blockquotes/quotes, fulfilled inline + unfulfilled fallback + unlinked section-end figures, EQ8 terminal consolidation, preview/standalone-ZIP/unified-LJ parity, and XD/XM prompt contracts |
| `tests/s105-expository-representational-necessity.test.js` | **3 / 3 pass** | Workstream 1 proportionality principle & runtime augmentation non-regression |
| `tests/s105-c1-full-expository-scatterplots-and-sections.test.js` | **1 / 1 pass** | Preserved original 6-section Economics C1 artefact unchanged |
| `tests/s105-c1-figure-construction-prose-suppression.test.js` | **5 / 5 pass** | Construction-prose suppression & accessible-text preservation |
| `tests/s85-wp2-expository-contracts.test.js` | **12 / 12 pass** | Expository EJP/XD/XM contracts & assembly |
| `tests/s85-wp3-expository-sibling-prompts.test.js` | **14 / 14 pass** | Expository sibling prompt contracts & Interactive isolation |
| `tests/s87-t007-terminal-closure-order.test.js` | **10 / 10 pass** | EQ8 terminal closure ordering across unanchored Expository & Interactive |
| `tests/qa-c02-expository-structured-rendering.test.js` | **5 / 5 pass** | Expository scatterplots, disclosures, standalone/unified export parity |
| `tests/s93-expository-structured-publication.test.js` | **7 / 7 pass** | Expository structured publication non-regression |
| `tests/s93-expository-xm-illustration-handoff.test.js` | **5 / 5 pass** | XM illustration handoff non-regression |
| `tests/s99-expository-academic-plain-english.test.js` | **4 / 4 pass** | Expository Academic Plain English non-regression |
| `tests/s102e-expository-publication-defects.test.js` | **7 / 7 pass** | Expository publication defects non-regression |
| `tests/s87-t004-ad010-structured-materials.test.js` | **12 / 12 pass** | Structured materials & browser-bundle export parity |
| `tests/s85-expository-design-page-visual-affordances.test.js` | **12 / 12 pass** | Expository DP visual-affordance contracts |
| **Focused Workstream 2 total** | **106 / 106 pass** (`node --test` count across 14 suites) | Zero regressions across Expository, visual affordances, terminal ordering, structured materials, and unified Learning Journey shell |

#### Live acceptance — Regenerated Economics C1 Expository Resource (**Passed 2026-11-25**)

| Check | Result | Evidence / Notes |
| ----- | ------ | ---------------- |
| Expository QA benchmark | **91 / 100 (Professional / Excellent)** | No production cap; zero critical or major production defects ([C1-LIVE-ACCEPTANCE-QA-RECORD.md](evidence/c1-expository-live-acceptance/C1-LIVE-ACCEPTANCE-QA-RECORD.md)) |
| Independent HTML inspection | **Pass** | 6 substantive sections, 4 inline material placements, 3 native SVG scatterplots, 4 data/comparison tables, 0 unnecessary derived numerical series, 0 raw anchor leaks, coherent evidence-before-prediction & interpretation sequencing, ~1,994 words of expository prose |
| Preserved export artefact | **Archived** | [c1-regenerated-reading-relationships-in-economic-data.zip](evidence/c1-expository-live-acceptance/c1-regenerated-reading-relationships-in-economic-data.zip); original C1 baseline regression fixture preserved unchanged |
| Residual workload-fidelity observation | **Recorded (non-blocking)** | Commissioned duration: 10 minutes; estimated actual learner workload: ~12–15 minutes (actual learner timings unmeasured). Workload fidelity continues to be evaluated across remaining Economics Learning Journey components. |
| Minor publication defect | **Logged (`S105-AD-005`)** | One Markdown blockquote rendered with literal `&gt;` inside `<p>` rather than `<blockquote>`; logged in [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md) for subsequent attention without regenerating C1 |

#### User-confirmed live acceptance & manual browser checks ([MANUAL-ACCEPTANCE-CHECKLIST.md](MANUAL-ACCEPTANCE-CHECKLIST.md) — **Passed 2026-11-25**)

| Check / Live Run | Result | Evidence Class & Qualification |
| ---------------- | ------ | ------------------------------ |
| Fresh 90-minute Economics Learning Journey (*Correlation and Causation: Making Sense of Economic Evidence*) | **Pass** | **User-confirmed live authoring:** Completed progressive Steps 1–5 cleanly without output-length failure, assembled deterministically, and actively used for downstream component commissioning (adopted as canonical Sprint 104 parent workflow). |
| 30-hour, 10-week, 50-component Political Economy Learning Journey | **Pass (LJ scalability)** | **User-confirmed live authoring:** Completed all five progressive capture stages and assembled deterministically. **Boundary:** Provides live scalability evidence for progressive LJ capture and deterministic assembly only; does **not** claim all 50 components have been produced or that its integrated learner runtime has been validated. |
| 1. Reload persistence & restoration of accepted stage captures and assembled Design Page | **Pass** | **User-confirmed manual browser check** (hard reload restored accepted captures and assembled DP cleanly with zero phantom captures). |
| 2. Parent Learning Journey Overview preview | **Pass** | **User-confirmed manual browser check** (Overview rendered cleanly without raw commissioning or continuity metadata). |
| 3. Legacy workflow compatibility & preservation of both historical Economics baselines | **Pass** | **User-confirmed manual browser check (read-only)** (untouched pre-Sprint 105 baseline opened intact without mutation; both historical Economics baselines preserved). |
| 4. Workflow duplication (`S105-AD-004`) | **Pass** | **User-confirmed manual browser check (disposable duplicate)** (clean separation of brief and progressive mode from stripped stage captures and run-derived state). |
| 5. Upstream invalidation, authoritative edited captures, downstream prompt propagation & non-resurrection after reload | **Pass** | **User-confirmed manual browser check (disposable duplicate)** (editing upstream stage invalidated downstream stages, propagated edits authoritatively into downstream prompts, and did not resurrect invalidated captures after reload). |
| 6. Clear-run behaviour & preservation of brief data | **Pass** | **User-confirmed manual browser check (disposable duplicate)** (`Clear run data` cleared captures and run-derived state with zero phantom captures on reload while preserving brief data). |
| Brief-provided source material preservation (`{ status: "provided" }`) | **Verified (automated)** | **Automated regression coverage** (`tests/s105-m1-lj-assembly.test.js`, `tests/s105-m2-prompts-and-continuity.test.js`, `tests/s105-m3-lifecycle-and-orchestration.test.js`, `tests/s96-lj-shared-source-design-page-boundary.test.js`); separate live manual exercise of a brief-provided source corpus was not separately recorded. |

- **Formal handback to Sprint 104 (`S105-D04` / `S104-D05`):** Sprint 105 is **CLOSED — COMPLETE** ([SPRINT-105-CLOSURE.md](SPRINT-105-CLOSURE.md)). The fresh 90-minute Economics Learning Journey is adopted as the canonical parent workflow for resumed **Sprint 104 live acceptance** (`M1` integrated live acceptance, `M6` 5-/15-/30-min Practice sensitivity probes, and `M7` remaining Economics component generation, workload assessment, baseline comparison against preserved pre-intervention captures, educational QA, and unified learner-runtime acceptance).
