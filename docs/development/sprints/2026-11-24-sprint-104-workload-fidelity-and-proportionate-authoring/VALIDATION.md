# Sprint 104 — Validation ledger

**Status:** **OPEN — ECONOMICS CONSOLIDATED LIVE ACCEPTANCE PASSED; OPEN FOR M6 PROPORTIONALITY ACCEPTANCE & FINAL CLOSURE CHECKS** — Milestones 1–5 committed (`c461770` → `f1f1269`), `S104-D06` (`eebb162`), F01/F02 (`8c0b98a`), `S104-D07` (`86d40ad`); Sprint 105 **CLOSED — COMPLETE** (`76f44ef`)  
**Resumption baseline:** `76f44ef` (Sprint 104 M1–M5 `c461770`–`f1f1269` + Sprint 105 M1–M4 & closure `4b698db`–`76f44ef`)

---

## Evidence boundary rules

- Distinguish **baseline direct measurement**, **reported baseline observation**, **focused automated tests**, **live authoring duration probes**, and **educational QA / learner-runtime acceptance**.
- Retain the existing *Correlation and Causation: Making Sense of Economic Evidence* journey and captures untouched as the pre-intervention baseline.
- Do **not** pull [PB-S-008](../../../backlog/PRODUCT-BACKLOG.md#pb-s-008--full-suite-pre-existing-failures-technical-debt) pre-existing failures into Sprint 104.

---

## Phase 104A pre-intervention baseline evidence

| Artefact / Check | Measured Result | Evidence Class |
| ---------------- | --------------- | -------------- |
| `git rev-parse --short HEAD` | `1515cd4` (clean baseline before Sprint 104 docs) | Repository check |
| **C01** (*Interpreting relationships in economic data*, Practice) | 2 LOs → 2 `apply` 12-beat episodes; 2 activities (`A1`, `A2`); 22 materials; **5,264 total words** (264 `page_synthesis`, 4,305+ materials); **5 `data_table` datasets** (`D01`–`D05`); **5 `selection` controls**; **2 `template` responses** (`40–70w` + `70–100w`); **6 diagnostic criteria** (14 pairs); **0 `duration_minutes` fields** | Direct capture measurement (`c01-page.json`, `c01-zip/learner-page.html`) |
| `lib/interactive-workload-feasibility-adapter.js` on **C01** | `warnings: []` (`declaredDurationMinutes: null` on `A1` & `A2`, skipping comparison despite `22–46 min` + `19–42 min` = `41–88 min` raw estimate before datasets/selections/checklists) | Direct runtime module execution |
| **C02** (*What does a causal claim actually mean?*, Expository) | Expository structure (`activities: []`, `episode_plans: []`) — distinct S85 sibling pipeline | Direct capture inspection (`c02-page.json`) |
| **C06** (*Making an independent judgement about economic evidence*, AP) | 1 `constructed_performance` elicitation (`E1`), ~11 min, ~100–150 words, D09 scatterplot + table | Direct fixture inspection (`tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`) |
| **Economics journey & C04** (*Comparing competing economic explanations*, 8 min) | 90 min / 2 weeks; 6 components, 8 Practice activities (`C01`, `C03`, `C04`, `C05`), 10 constructed responses, 8 Journal entries; `C04` has 2 substantial activities, 2 datasets, 180–280w constructed response, structured decisions, 6 diagnostic criteria | User-reported baseline (raw `C03`/`C04`/`C05`/LJ captures external to repo; `Downloads` untouched) |

---

## Milestone 1 verification (Authoritative duration transport)

### Syntax checks (all 5 modified runtime/prompt modules)

| Check | Outcome |
| ----- | ------- |
| `node --check app.js` | **Pass** (exit 0) |
| `node --check lib/learning-journey-sibling-prompts.js` | **Pass** (exit 0) |
| `node --check lib/learning-journey-design-page.js` | **Pass** (exit 0) |
| `node --check lib/first-class-workflow-family.js` | **Pass** (exit 0) |
| `node --check lib/first-class-commission-intake.js` | **Pass** (exit 0) |

### Focused automated test suites (`node --test`, observed 2026-11-24)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-m1-duration-transport.test.js` | **11 / 11 pass** | Step 4 origin & reconciled example; prose/non-integer/missing rejection; Step 4 `journey_allocated_minutes` matching parent LJ duration & component sum reconciliation; newly authored non-bypass vs legacy compatibility; Step 4↔5 reconciliation & conflict fail-closed; lossless batch/single/prompt/persistence/delete-recreate transport across Expository, Practice, Assessment Pack, and Situated Task; 5-min Practice & 12-min LJ-Expository UI rendering; legacy absence without prose fallback; envelope/intake conflict fail-closed; standalone Expository & Interactive non-regression |
| Focused closure & legacy non-regression re-verification bundle (12 files: `s104-m1`, `s103-duration-fidelity-guidance`, `s100c`, `s94-wp2`, `s96-lj-shared-source-design-page-boundary`, `s91-wp3/wp4/preview`, `qa-lj-*`, `s80-s6`, `s85-wp4`) | **158 / 158 pass** | Confirms Step 4 parent-allocation reconciliation, non-bypass for `duration_contract_version: "s104_m1"`, legacy fixture compatibility, and standalone Expository/Interactive preservation |
| Core duration, capability, workload & commission-native bundle (12 existing files alongside `s104-m1`: `s80-s6`, `s85-wp4`, `s100a`, `s100b1`, `s100b2`, `s100c`, `s101`, `s102`, `s102e`, `s103-duration-fidelity-guidance`, `s103-artefact-consumer-four-product`, `qa-c06`) | **167 / 167 pass** | Confirms standalone Interactive 10–480 adjustments, standalone Expository `Scope/extent` vs hidden `Duration`, S100 estimator contracts, S101/S102/S102e commission-native LO binding across 4 products, and S103 duration-fidelity guidance |
| LJ lifecycle, 4-product, continuity & S102e/S103 bundle (21 files: `qa-lj-commission-native-and-lifecycle`, `qa-lj-batch-component-creation`, `s91-wp3/wp4/preview/direct/run-stage/ui-orchestration/status`, `s92-slice1/lj-handoff/stage5`, `s94-wp1/wp2/wp5`, `s102e-clear/journal/gam`, `s103-clear/radio/json-fencing`) | **167 / 167 pass** | Confirms batch creation, single creation, deletion/recreation, continuity gates, Situated Task Stage 5, Expository/Practice/AP runtime & clear-run isolation |
| **Milestone 1 manual acceptance** | **Pending integrated live validation** | Deferred to integrated live authoring / Milestone 6–7 validation per Milestone 1 closeout instruction |
| Excluded pre-existing [PB-S-008](../../../backlog/PRODUCT-BACKLOG.md#pb-s-008--full-suite-pre-existing-failures-technical-debt) tests observed separately | Pre-existing failures unchanged | `s91-learning-journey-design-page-acceptance.test.js:76` (test harness omits `lib/learning-journey-shared-source.js`); `s94-learning-journey-wp3-original-brief.test.js:223` (stale Expository GLC brief test); `s88`, `s91-wp1-wp2`, `s92-slice3`, `s94-wp4/wp5`, `s97-m3-t1` observed as pre-existing baseline failures in earlier broad sweeps |

---

## Milestone 2 verification (Practice Episode Plan design authority — uncommitted)

### Syntax checks (all modified runtime, contract & test files)

| Check | Outcome |
| ----- | ------- |
| `node --check app.js` | **Pass** (exit 0) |
| `node --check lib/practice-episode-plan.js` | **Pass** (exit 0) |
| `node --check lib/ld-practice-presentation-contracts.js` | **Pass** (exit 0) |
| `node --check tests/s104-m2-practice-episode-plan.test.js` | **Pass** (exit 0) |
| `node --check tests/qa-lj-no-phantom-run-captures.test.js` | **Pass** (exit 0) |

### Focused automated test suites (`node --test`, observed 2026-11-24)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-m2-practice-episode-plan.test.js` | **8 / 8 pass** | Script load order (`episode-plan-v1-archetype-grammar.js` before `practice-episode-plan.js`); commissioned & non-commission-native Practice EP prompts (outcomes, authoritative duration, purpose, prior learning, journey context, dependencies, shared learner artefact awareness, multi-LO cohesive support, zero duration tiers/quotas, zero deterministic Interactive strings); model-authored single-activity multi-LO & lean 3-beat capture acceptance without overwriting + vNext assembly/renderer compatibility; grammar enforcement (unknown archetype, non-`FunctionEnum` beat, missing required beat/group, phase/T1–T5 order, terminal closure, `activities`/`episode_plans` mismatch); outcome coverage & statement fidelity (single-sided ID sync, conflict/unmapped/unknown/rewritten/omitted rejection, invented DLA/GAM guard); Run state + resource ref persistence across simulated reload and unstarted Run non-auto-population; Interactive `v2_locked` / deterministic derivation / Copy prompt / canonical enforcement non-regression |
| Focused Milestone 2 + Practice + Interactive + Shell + Grammar + M1 + S80 regression bundle (14 files: `s104-m2`, `s104-m1`, `qa-lj-no-phantom-run-captures`, `s101`, `s101e`, `s102e`, `page-shell-create`, `page-partial-capture-validate`, `s69`, `s80-s2/s3/s5/s6/s7`) | **257 / 257 pass** | Confirms zero regressions across Practice intake/progressive interaction/runtime, LJ no-phantom-run-captures, vNext page shell & partial validation, V1 archetype grammar, M1 duration transport, and S80 parameter call-count & projection invariants |
| Focused downstream & LO-binding verification bundle (5 files: `s69-archetype-grammar`, `s102-commission-native-lo-bind`, `page-dla-enrich`, `page-gam-enrich`, `episode-plan-population-contract`) | **105 / 105 pass** | Confirms Milestone 3 downstream contracts (`DLA`, `GAM`, population contract) remain intact and untouched until Milestone 3 |
| Economics pre-intervention baseline preservation (`git status`) | **Untouched** | Zero modifications to `c01-page.json`, `c01-zip/`, `c02-page.json`, `tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`, or `Downloads`; no live generation run |

---

## Milestone 3 verification (Downstream Practice contract reconciliation — Committed `53bd50c`)

### Syntax & bundle freshness checks

| Check | Outcome |
| ----- | ------- |
| `node --check` across all 14 modified JS modules (`app.js`, `lib/page-dla-enrich.js`, `lib/ld-dla-page-enrich-contract.js`, `lib/ld-guided-learning-scaffold.js`, `lib/episode-plan-population-contract.js`, `lib/episode-plan-dla-integration.js`, `lib/dla-diagnostic-review.js`, `lib/guided-review-generation-contract.js`, `lib/ld-gam-page-enrich-contract.js`, `lib/gam-canonical-assembler.js`, `lib/page-gam-enrich.js`, `lib/ld-practice-presentation-contracts.js`, `lib/page-vnext-assemble.js`, `lib/learner-renderer-vnext/archetype-canonical-binding.js`, `lib/learner-renderer-vnext/build-activity-model.js`) | **Pass** (exit 0) |
| `npm run build:learner-renderer-vnext-browser` + `tests/learner-renderer-vnext-browser-artefact-freshness.test.js` | **Pass** (`lib/learner-renderer-vnext-browser.js` rebuilt & matched fresh source check) |

### Focused automated test suites (`node --test`, observed 2026-11-24)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-m3-downstream-practice-reconciliation.test.js` | **3 / 3 pass** | End-to-end lean Practice EP (`required_materials: []` / `materials: []`, omitted preamble/bridge/opening, `page_synthesis: {}`, 10-min LS preservation & expansion fail-closed, assembly, vNext render & learner package without `"—"` leakage); end-to-end richer multi-LO Practice EP (multi-LO fallback parity across all mapped LOs, beat-derived materials preserved, `selection` + concise `template` justification, 1–2 criterion `diagnostic_review` without 3-criterion floor, purposeful `knowledge_summary`, 18-min LS, vNext render); Practice exemplar removal & Interactive strictness guards |
| Sprint 104 M1–M3 & all Sprint 101 Practice suites (`s104-m1`, `s104-m2`, `s104-m3`, 17 `tests/s101*.test.js` files) | **131 / 131 pass** | Covers all reconciled Practice contracts, selection controls & browser bundle parity, editorial opening purpose-driven skip/omission/generate rules, workload economy, control-led justification without fixed exemplars, M1 duration transport & M2 EP design authority |
| DLA, scaffold, guided-review, population & assembly bundle (11 files: `page-dla-enrich`, `episode-plan-population-contract`, `episode-plan-dla-integration`, `sprint-55-guided-learning-quality`, `sprint-56-dla-capture-repair`, `guided-review-generation-quality`, `ld-dla-canonical-assembler`, `s78-dla-response-fulfilment`, `s78-dla-practice-independence`, `s78-dla-diagnostic-review`, `page-vnext-assemble`) | **176 / 176 pass** | Verifies Interactive DLA, population contract, guided-learning scaffold repair, diagnostic review & practice independence invariants remain 100% intact |
| GAM, S102e handoffs, S79 equivalence, depth, closure & capture-gate bundle (`s102e-*`, `s79-t-002`, `s79-t-003`, `page-gam-enrich`, `s78-gam-learner-closure-packaging`, `ld-gam-instructional-depth`, `learner-renderer-vnext-guided-review`, `workflow-dla-framing-capture-validation-gate`, `workflow-gam-capture-validation-gate`) | **138 / 138 pass** | Verifies S79-T-002 golden Interactive baselines, S79-T-003 canonical assembler, S102e Practice/Interactive Journal & shared-source handoffs, S78 closure, and capture gates; pre-existing Sprint 79 source-regex checks (`s79-t-005:214` / `s79-t-006:253`) excluded as unrelated pre-existing baseline debt where an earlier sprint replaced `return String(draft || "").trim();` with `finalizeJsonPresentation(draft)` inside `applyWorkflowStepRuntimePromptAugmentations` |
| LS, DP, partial capture, browser freshness & vNext renderer bundle (11 files: `page-partial-capture-validate`, `page-learning-sequence-enrich`, `page-design-page-enrich`, `sprint-58-phase0/1`, `learner-renderer-vnext-browser-artefact-freshness`, `imp014b`, `imp014c`, `compose-full-page`, `model`, `html`) | **80 / 80 pass** | Verifies LS/DP partial validation, browser bundle parity, V1 archetype grammar resolution, moment composition & HTML rendering |
| Economics pre-intervention baseline preservation (`git status`) | **Untouched** | Zero modifications to `c01-page.json`, `c01-zip/`, `c02-page.json`, `tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`, or `Downloads`; no live generation run |

---

## Gated milestone validation plan (Milestones 1–7)

| Milestone | Requirement | State |
| --------- | ----------- | ----- |
| **Milestone 1 — Authoritative duration transport** | Step 4 origin (`<<<COMMISSION_DURATIONS_BEGIN>>>` / `END`), parent-allocation & sum reconciliation, non-bypass for new authoring (`duration_contract_version: "s104_m1"`), Step 4↔5 reconciliation, zero prose fallback, lossless envelope/intake/family transport across all 4 commissioned products, persistence, delete/recreate, legacy compatibility, component duration lock UI | **Committed (`c461770`)** (automated verified; manual acceptance pending integrated live validation) |
| **Milestone 2 — Practice Episode Plan design authority** | AI-authored, deterministically validated Practice Episode Plans responsive to purpose, outcomes, authoritative duration, prior learning, and journey context; single cohesive multi-LO activity assessment; no fixed duration tiers or beat targets; standalone/legacy Interactive preserved | **Committed (`9db45bf`)** |
| **Milestone 3 — Reconciliation of downstream Practice contracts** | Conditional DLA / GAM / Guided Review / Population / Scaffold / Learning Sequence / Design Page obligations keyed to Episode Plan selections; purpose-driven Practice editorial furniture; multi-LO fallback parity; preserved structural/accessibility/material/artefact/renderer invariants; Interactive untouched | **Accepted & committed (`53bd50c`)** |
| **Milestone 4 — Proportionate Learning Journey commissioning** | Cross-journey pedagogical distribution, genuine learner performance & feedback reasoning, familiar-evidence reuse, progressive artefact reuse without inventing response-aware adaptation or snapshots, Journal-from-purposeful-performance rule, explicit infeasibility surfacing, 4-product duration calibration | **Committed (`43db3f4`)** |
| **Milestone 5 — Workload estimation corrections** | Fix `\|\| product === "practice"` precedence & prose-first duration lookup in `learning-journey-workload-feasibility-adapter.js`; wire cumulative workload against authoritative duration; explicit unavailable duration status; account for evidence, decisions, constructed responses, worked examples, feedback & revision; familiar/new & optional separation; advisory warnings only; audit Sprint 101 safeguards & arbitrary criterion caps | **Committed (`f1f1269`)** |
| **Milestone 6 — Practice duration sensitivity probes** | Live authoring runs for equivalent purpose at **5 min**, **15 min**, and **30 min** showing genuine structural & workload scaling with preserved pedagogical completeness | **Active (`S104-D05`)** |
| **Milestone 7 — 90-minute Economics journey completion, workload assessment, baseline comparison, QA & unified learner-runtime acceptance** | Use the fresh, assembled 90-min Economics LJ from Sprint 105 as canonical parent (retaining accepted regenerated C1 at `91/100` and preserving both historical baselines untouched); generate remaining components; assess holistic workload fidelity; compare against preserved pre-intervention baseline; run educational QA & unified learner-runtime acceptance | **Active (`S104-D05`; parent LJ & C1 complete)** |

---

## Milestone 4 verification (Proportionate Learning Journey commissioning — Committed `43db3f4`)

### Syntax checks (all 7 modified JS files)

| Check | Outcome |
| ----- | ------- |
| `node --check app.js` | **Pass** (exit 0) |
| `node --check lib/learning-journey-sibling-prompts.js` | **Pass** (exit 0) |
| `node --check lib/learning-journey-design-page.js` | **Pass** (exit 0) |
| `node --check lib/expository-sibling-prompts.js` | **Pass** (exit 0) |
| `node --check lib/first-class-workflow-family.js` | **Pass** (exit 0) |
| `node --check lib/situated-task-sibling-prompts.js` | **Pass** (exit 0) |
| `node --check tests/s104-m4-proportionate-commissioning.test.js` | **Pass** (exit 0) |

### Focused automated test suites (`node --test`, observed 2026-11-24)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-m4-proportionate-commissioning.test.js` + 18-suite cross-product & LJ continuity/duration regression bundle (`s104-m1`, `s104-m2`, `s104-m3`, `s103-duration-fidelity-guidance`, `s103-artefact-consumer-four-product`, `s94-wp1/wp2`, `s96-m3`, `s96-lj-shared-source-design-page-boundary`, `s85-wp3/wp4`, `s92-slice1/lj-handoff/stage5`, `s93-ap-handoff`, `qa-c06`, `s91-ui-orchestration`, `s91-commissioning-preview`) | **171 / 171 pass** | Verifies cross-journey distribution, achievable performance & feedback reasoning, familiar vs new evidence framing, consequential artefact reuse without runtime adaptation/snapshots, Journal discipline, infeasibility surfacing, zero forbidden quotas/tiers/word caps, and authoritative duration calibration across Practice, Expository, Assessment Pack, and Situated Task without standalone regression |
| Economics pre-intervention baseline preservation (`git status`) | **Untouched** | Zero modifications to `c01-page.json`, `c01-zip/`, `c02-page.json`, `tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`, or `Downloads`; no live generation run |

---

## Milestone 5 verification (Workload estimation corrections — Committed `f1f1269`)

### Syntax checks (all 6 modified/new JS files)

| Check | Outcome |
| ----- | ------- |
| `node --check app.js` | **Pass** (exit 0) |
| `node --check lib/workload-feasibility-estimator.js` | **Pass** (exit 0) |
| `node --check lib/learning-journey-workload-feasibility-adapter.js` | **Pass** (exit 0) |
| `node --check lib/interactive-workload-feasibility-adapter.js` | **Pass** (exit 0) |
| `node --check lib/assessment-pack-workload-feasibility-adapter.js` | **Pass** (exit 0) |
| `node --check tests/s104-m5-workload-estimation.test.js` | **Pass** (exit 0) |

### Focused automated test suites (`node --test`, observed 2026-11-24)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| 27-file Milestone 5 & reconciled regression bundle (`s104-m5-workload-estimation`, `s100a`, `s100b1`, `s100b2`, `s100c`, `s103-duration-fidelity-guidance`, `s103-artefact-consumer-four-product`, `s104-m1`..`s104-m4`, 12 `s101*` Practice/Selection/Workload/Control-led suites, `page-partial-capture-validate`, `qa-c06-assessment-pack-fidelity`, `s91-commissioning-preview`, `s91-ui-orchestration`) | **163 / 163 pass** | Verifies Practice math precedence fix, authoritative structured duration precedence over prose, explicit `durationStatus: "unavailable"` reporting instead of silent pass across LJ/Practice/Assessment Pack, cumulative comparison against authoritative duration (`C01`-like synthetic Practice fixture + multi-elicitation AP), deduplicated materials (`required_materials` vs `materials`), familiar vs new vs mixed evidence, structured decisions/worked examples/checklists/feedback/optional revision exclusion, driver identification, non-mutation & structural separation |
| Additional Sprint 88–96 Assessment Pack & LJ continuity check (`s92-lj-handoff`, `s92-slice1`, `s93-ap-handoff`, `s93-assessment-key-defence`, `s94-assessment-design-page-framing-string`, `s96-assessment-evidence-qualification`, `s96-lj-shared-source-design-page-boundary`, `s88-assessment-pack-publish`) | **52 / 53 pass** | 52 passing across S92–S96 AP/LJ handoff, key defence, framing, qualification, and shared-source contracts; 1 unrelated pre-existing `PB-S-008` exact-string prompt drift (`tests/s88-assessment-pack-publish.test.js:312`) unchanged |
| Reconciled Sprint 101 safeguards & arbitrary criterion cap audit | **Verified** | Confirmed accessibility (`util-assessment-fieldset`, `<label for>`, `alt_text`/`detailed_description`), independence (`anti_spoiler`, `spoiler_boundary`, unchecked draft restore), evidence fidelity (`requires_exact_data_match`, `evidence_anchors`, `evidence_decision`), and response functionality (`selection_choose`, `single_select`/`multi_select`/`matching`, `assessmentRuntime`) retained; remaining Practice criterion caps recorded under `S104-AD-009` |
| Economics pre-intervention baseline preservation (`git status`) | **Untouched** | Zero modifications to `c01-page.json`, `c01-zip/`, `c02-page.json`, `tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`, or `Downloads`; no live generation run |

---

## Sprint 105 handback & carried-forward live evidence (`S104-D05`, 2026-11-25)

| Artefact / Check | Result | Notes & Scope Boundary |
| ---------------- | ------ | ---------------------- |
| Parent 90-minute Economics Learning Journey | **Pass (live, Sprint 105)** | Fresh progressive 5-stage LJ assembled deterministically and confirmed across reload, preview, and commissioning; adopted as canonical Sprint 104 parent workflow |
| Regenerated Economics **C1** (*Reading relationships in economic data*, Expository, 10 min) | **Pass (`91 / 100` — Professional / Excellent)** | Zero production cap, zero critical/major defects, 6 sections, 4 inline material placements (`S105-D03`), 3 native SVG scatterplots, 4 data/comparison tables, 0 unnecessary derived series; archived under Sprint 105 [evidence/c1-expository-live-acceptance/](../2026-11-25-sprint-105-learning-journey-progressive-capture-and-assembly/evidence/c1-expository-live-acceptance/C1-LIVE-ACCEPTANCE-QA-RECORD.md). **Do not regenerate.** |
| Residual C1 workload-fidelity observation | **Carried forward (non-blocking)** | Commissioned: **10 minutes**; estimated learner workload: **~12–15 minutes** (**actual learner completion times remain unmeasured**). Assess holistically alongside remaining Economics components. |
| Historical Economics baselines (pre-intervention baseline + incomplete Sprint 104 regeneration) | **Preserved untouched** | Confirmed read-only during Sprint 105 closure; preserve without mutation throughout Sprint 104 live acceptance. |
| Remaining Sprint 104 acceptance gates | **Sequenced (`S104-D06`)** | After review of `S104-D06` corrections: (1) generate **Economics C6 & C2** diagnostic pair (recording **M1** duration-transport evidence concurrently) and review upstream-commissioning vs realised-workload relationship; (2) complete remaining Economics components & integrated **M7** acceptance (workload assessment, baseline comparison, educational QA, unified learner-runtime acceptance); (3) conduct **M6** via disposable **50-minute Probe LJ** containing three comparable Practice commissions at **5, 15, and 30 minutes** (probe brief reviewed separately). Scope discipline (`S104-D05` / `S104-D06`): no further estimator tuning or unrelated component-type improvements; Political Economy module is an independent stress test and not a Sprint 104 closure dependency. |

---

## `S104-D06` focused progressive LJ workload-fidelity verification (2026-11-25, uncommitted — stopped for review)

### Syntax checks

| Check | Outcome |
| ----- | ------- |
| `node --check lib/learning-journey-sibling-prompts.js` | **Pass** (exit 0) |
| `node --check app.js` | **Pass** (exit 0) |

### Focused automated test suites (`node --test`, observed 2026-11-25)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-lj-progressive-workload-fidelity.test.js` | **4 / 4 pass** | (1) Verifies restored S104 M4 workload-fidelity & effort-reconciliation requirements across progressive Stages 1–4 (`learning_requirements`, `learning_progression`, `learning_elements`, `learning_commissions`), all 5 required Stage 4 workload dimensions, mandatory pre-finalisation achievability verification beyond arithmetic, stage ownership boundaries, zero forbidden limits/counts/formulae, and zero new schema fields; (2) verifies non-blocking Stage 4 advisory warnings + UI banner before Stage 5 and exact unduplicated Stage 4 ↔ Stage 5 assembled Design Page consistency; (3) verifies real `tests/fixtures/s105-economics-stage4-commissions.json` flags `C2`, `C5`, and `C8` at Stage 4 capture without blocking acceptance; (4) verifies full warning lifecycle across reload/hydration, corrupted upstream reload, scope reconciliation edits, duration reallocation edits (without stale `deliverySeed` override), invalid captures, upstream invalidation, and `Clear run data` |
| 9-file Sprint 104 / 105 / 103 workload-fidelity, progressive LJ & isolation bundle (`s104-lj-progressive-workload-fidelity`, `s104-m4-proportionate-commissioning`, `s104-m5-workload-estimation`, `s105-m1-lj-assembly`, `s105-m2-prompts-and-continuity`, `s105-m3-lifecycle-and-orchestration`, `s105-lj-commission-workload-estimation`, `s103-clear-run-learner-runtime-isolation`, `qa-lj-no-phantom-run-captures`) | **48 / 48 pass** | Zero regressions across M4/M5 commissioning & estimator behaviour, Sprint 105 M1–M3 progressive assembly/prompts/lifecycle, Economics C3/C6 false-positive guards, and Clear-run/phantom-capture isolation |
| Additional S104 M2 & M3 suites (`s104-m2-practice-episode-plan`, `s104-m3-downstream-practice-reconciliation`) | **11 / 11 pass** | Practice Episode Plan authority and downstream DLA/GAM/LS/DP reconciliation remain unaffected |
| Pre-existing `tests/s104-m1-duration-transport.test.js:1011` (`resolveEffectiveWorkflowDurationMinutes` static count 5 vs 3) | **10 / 11 pass (1 pre-existing M5 mismatch)** | Confirmed via `git diff -- app.js` that `S104-D06` added **0** calls to `resolveEffectiveWorkflowDurationMinutes`; the extra 2 calls were introduced earlier in committed Sprint 104 M5 (`f1f1269`) for Practice LS and Assessment Pack adapters and left untouched per scope discipline |
| Accepted evidence & baseline preservation | **Untouched** | Accepted Economics LJ, accepted regenerated C1 (`91/100`), Political Economy module, Sprint 105 docs, and preserved historical Economics baselines remain unmodified |

---

## Live Practice C6 (*Retrieving the principles of statistical and causal reasoning*) publication QA & supporting fixes (2026-11-26)

### Corrected C6 publication QA result (republished from preserved captures)

| Check / Dimension | Recorded Result | Notes & Scope Boundary |
| ----------------- | --------------- | ---------------------- |
| **Final benchmark** | **`89 / 100`** (uncapped weighted score **`88.51`**) | **Release ready with minor revisions** |
| **Production defects** | **0 Critical, 0 Major, 0 Moderate** | All three previously identified production defects resolved via republication of existing captures (no educational content regenerated) |
| **Resolved production defects** | **3 / 3 resolved** | (1) **Evidence placement:** A1 `data_table` (`A1-M1`) and attached scatterplots now precede the `A1-M2` matching workspace inside **Your task**, while post-attempt feedback (`A1-M3` `sample_output`) remains in **Check your response** (`lib/learner-renderer-vnext/compose-generic-moments.js`); (2) **Matching-answer serialisation:** generic pair normalisation (`normalizeMatchingPairsMap`) emits `case1:1b\|case2:2c\|case3:3c` instead of `0:[object Object]\|1:[object Object]\|2:[object Object]` across both Practice and Assessment Pack paths (`lib/learner-renderer-vnext/normalize-selection.js`, `lib/learner-renderer-vnext/assessment-interactive.js`); (3) **Orphaned navigation:** `<script>`/`<style>` blocks are stripped before HTML landmark scanning so embedded `assessment-runtime.js` no longer emits a phantom `#journey-assessment` (`Self assessment`) link or inflated section count (`lib/learner-renderer-vnext/sequential-section-nav.js`) |
| **Preservation** | **Preserved intact** | Existing accepted captures, **5-minute** allocation (`2.5 + 2.5`), statistical evidence (all five correlation coefficients verified accurate), images, questions, and explanatory feedback preserved without regeneration |
| **Workload-fidelity evidence (non-defect)** | **Indicative QA timing recommendation: 7–10 minutes vs 5 allocated minutes** | Recorded strictly as **workload-fidelity evidence** (not a production defect and **not** a measured learner completion time); evaluate holistically across the 90-minute Economics Learning Journey |
| **QA scope boundary** | **Static QA only** | Static QA does **not** establish assistive-technology behaviour or client-side persistence behaviour |
| **Duration-lock observation (M1)** | **Not separately recorded in this QA report** | Kept distinct from the published 5-minute duration; do not infer UI duration-lock state from the published artefact |
| **Workload-warning observation (M5 / Step 4)** | **Not separately recorded in this QA report** | Kept distinct from the published 5-minute duration; do not infer live PRISM Step 4 / LS advisory warning display from the published artefact |

### Supporting live Practice fixes verified in the same checkpoint

1. **Practice `evaluate` / `evaluative_core` alignment & Step 1 parse diagnostics:**
   - Clarified `evaluate` `evaluative_core` compliance in `lib/practice-episode-plan.js` and `lib/ld-practice-presentation-contracts.js` (directing defended/refined judgements to `evaluative_judgement` without redundant beats); updated `lib/learner-renderer-vnext/archetype-canonical-binding.js` so `evaluative_judgement` owns `taskSteps` (`take = "rest"`) and `task_card` when `independent_performance` is absent; preserved specific Step 1 JSON parse diagnostics in `app.js` instead of overwriting with generic `"invalid capture object"`.
2. **Fractional timeline activity duration reconciliation (`2.5 + 2.5 = 5 min`):**
   - Removed per-activity integer rounding before summation in `app.js` (`parseLearningSequenceDurationMinutes` / `sumLearningSequenceTimelineMinutes` / `appendLearningSequenceDurationComplianceErrors`) and preserved 6-decimal fractional precision without weakening strict reconciliation (`4.9 vs 5`, `5.1 vs 5`, `5.5 vs 5` still fail closed).
   - Preserved fractional minutes in `lib/interactive-workload-feasibility-adapter.js`, `lib/workload-feasibility-estimator.js`, and `app.js` (`utilityFormatLearningHeaderDuration*`).
3. **Browser bundle & cache tokens:**
   - Rebuilt `lib/learner-renderer-vnext-browser.js` (`npm run build:learner-renderer-vnext-browser`) and bumped cache tokens in `index.html`.

### Focused automated test suites (`node --test`, observed 2026-11-26)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-c6-practice-publication-qa.test.js` + `learner-renderer-vnext-sequential-nav`, `learner-renderer-vnext-export-shell`, `s96-cross-archetype-section-nav`, `s104-m3-downstream-practice-reconciliation`, `s101e-practice-selection-controls`, `s101e-practice-selection-export-path`, `s103-multi-question-selection-radio-groups`, `learner-renderer-vnext-generic-moments`, `learner-renderer-vnext-compose-full-page`, `sprint-70-composition-moments-regression`, `learner-renderer-vnext-browser-artefact-freshness` | **93 / 93 pass** | Verifies all 3 C6 publication QA fixes (including runtime grading of correct, incorrect, and incomplete matching submissions), fractional `2.5 + 2.5 = 5` min reconciliation & mismatch rejection, and browser bundle freshness |
| `tests/s104-m2-practice-episode-plan.test.js`, `tests/episode-plan-v1-archetype-grammar.test.js`, `tests/s82-workshop-live-path-production.test.js`, `tests/page-vnext-assemble.test.js`, `tests/s78-t-037-learner-timing-metadata.test.js`, `tests/s100a-workload-feasibility-estimator.test.js`, `tests/s100b1-interactive-workload-feasibility.test.js`, `tests/s104-m5-workload-estimation.test.js` | **96 / 96 pass** | Verifies `evaluate` `evaluative_core` alignment, Practice EP validation, LS duration compliance, assembly projection, timing metadata, and workload estimation |

---

## Live Situated Task C4 publication QA & workload feasibility evidence (2026-11-26)

### C4 independent educational QA result & workload observation

| Check / Dimension | Recorded Result | Notes & Scope Boundary |
| ----------------- | --------------- | ---------------------- |
| **Educational QA score** | **`90 / 100`** | Published successfully |
| **Commissioned & published duration** | **`13 minutes`** | Inherited authoritative Learning Journey commission allocation |
| **Workload-fidelity evidence (independent QA)** | **Indicative expert estimate: `18–27 minutes`; recommended planning envelope: `20–25 minutes`** | Task requires interpretation of ten paired observations, construction of direct/reverse/common-cause explanations, evaluation of evidence limitations, reasoning review, and one integrated written advisory judgement. Recorded as indicative expert QA evidence — **not** an empirical learner measurement, and the estimator was **not** tuned to reproduce these figures |
| **Observed PRISM warning behaviour during live C4 authoring** | **No workload feasibility warnings displayed** | Root causes established: (1) Situated Task had **no downstream workload feasibility adapter or Stage 5 integration**; (2) upstream LJ extraction (`lib/learning-journey-workload-feasibility-adapter.js`) missed paired observations, reasoning review, and substantial integrated advisory deliverables (either returning `insufficient_evidence` or compressing unbanded production to 1–2 min via `integratedReasoningProduction: true`); (3) `insufficient_evidence` was not explicitly distinguished from `assessed_feasible` on commission rows |
| **Post-Connect More architectural debt recorded** | **[`PB-FA-032`](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-032--situated-task-structured-progressive-capture-and-pipeline-alignment)** & **[`PB-FA-033`](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-033--expository-downstream-workload-feasibility-assessment)** | `PB-FA-032`: align Situated Task intermediate stages with PRISM's structured progressive capture architecture while preserving Situated Task's distinctive educational model. `PB-FA-033`: add dedicated Expository downstream workload feasibility assessment. Both deferred post-Connect More; **neither** is an S104 closure dependency |
| **Deferred estimator calibration considerations (not S104 closure dependencies)** | **`distinctReasoningMoves` extension & borderline advisory policy deferred** | Both the proposed multi-move reasoning dimension (`distinctReasoningMoves` / `analyticalSubtasksCount`) and any separate borderline / tight-fit advisory policy are explicitly deferred as future calibration considerations, **not** Sprint 104 closure dependencies |
| **Semantic boundary of `assessed_feasible`** | **Absence of clear overload finding ≠ guaranteed feasibility** | The current conservative threshold (`declaredDurationMinutes < total.low`) establishes only that no clear overload was found from the extracted demand signals (`assessed_feasible` = *no clear overload finding*). It must **not** be read as positively established or guaranteed learner workload feasibility |

### Remediation & focused automated verification (`node --test`, observed 2026-11-26)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-situated-task-workload-feasibility.test.js` + full workload & C4 regression bundle (`s100a`, `s100b1`, `s100b2`, `s100c`, `s104-m5`, `s104-lj-progressive-workload-fidelity`, `s105-lj-commission-workload-estimation`, `s105-c4-situated-visual-affordance-contract`) | **76 / 76 pass** | Verifies dedicated `lib/situated-task-workload-feasibility-adapter.js`, Stage 5 `app.js` non-blocking warning lifecycle (capture, reload restoration, replacement, invalidation, clearing, duration-lock preservation), upstream LJ extraction for advisory deliverables & paired observations without double-counting, explicit `insufficient_evidence` / `duration_unavailable` vs `assessed_feasible` status, and zero regressions across Practice, Assessment Pack, and Learning Journey workload suites |

### C4 Situated Task live acceptance (2026-11-26 — PASS)

| Check / Dimension | Observed Live Result | Notes |
| ----------------- | -------------------- | ----- |
| **Hard refresh on existing completed Stage 5 capture** | **PASS — non-blocking workload feasibility warning displayed** | Restored cleanly via `revalidateSituatedTaskDesignPageCaptureAfterHydration` without regenerating any content |
| **Inherited duration lock** | **`13 minutes` preserved** | Unchanged by workload assessment |
| **PRISM indicative workload estimate** | **`19–40 minutes`** | Compare with independent QA indicative estimate (`18–27 minutes`); no further estimator calibration required on the basis of this case |
| **Workflow & authoring continuity** | **Workflow remains Completed; Continue to Authoring remains available** | Advisory warning does not block completion or downstream authoring |

---

## Assessment Pack bounded pre-Connect More contract hardening & scatterplot representation alignment (2026-11-26)

### Implementation summary (approved for live C7 acceptance from Stage 2 onward)

1. **`output_specification` authoring contract, live Copy path, and fail-closed capture/publication:**
   - Added `buildOutputSpecificationAuthoringContractLines()` in `lib/assessment-pack-canonical.js` derived directly from authoritative closed schema keys (`section_id`, `order`, `heading`, `contributions`, `contribution_id`, `label`, `elicitation_id`, `response_part`, plus a schema-valid JSON example) and wired it into both branches of Stage 4 `designOutput` in `lib/first-class-workflow-family.js`.
   - Added runtime Copy-time upgrading (`ensureAssessmentPackOutputSpecificationInDesignPrompt` in `app.js` `resolveStepPromptText` + deduplicated fallback in `buildWorkflowStepInstructions`) so pre-existing saved workflows like C7 receive the canonical contract and non-conflict note at Copy time without duplication.
   - Wired `parseAssessmentPackDesignPageCaptureForStorage` consistently across Stage 4 paste/save (`validateStrictJsonWorkflowRunStepCapture`) and step advance (`parseWorkflowRunPageStructureCaptureForStorage`), preserving determinate-key, structured-stimulus, and advisory workload feasibility checks.
   - Hardened `resolveAssessmentPackPublishPage({ ..., requireCanonical: true })` (`lib/assessment-pack-publish.js` + `app.js` `isCanonicalFourStageAssessmentPackWorkflow`) so malformed canonical four-stage Assessment Pack workflows fail closed with `assessment_evidence_invalid` rather than falling through to legacy `assessment_pack_required`, while preserving genuine legacy Assessment Pack compatibility.
   - Live C7 Stage 4 retest verified `output_specification` capture and authoring progression passed cleanly.
2. **Canonical scatterplot `representation` contract (single-panel and multi-panel) across Stage 2–4 prompts, capture validation, and learner renderer:**
   - Added `validateScatterplotRepresentation()`, `reviewElicitationRepresentations()`, and `buildScatterplotRepresentationAuthoringContractLines()` in `lib/assessment-pack-canonical.js`, wired into `validateElicitation()` (Stage 2 & Stage 4 canonical validation) and `app.js` Stage 2, Stage 3, and Stage 4 capture gates (`assessmentRepresentationCaptureErrors`).
   - Wired the canonical scatterplot contract into Stage 2 (`lib/first-class-workflow-family.js`) and the live Copy path for both Stage 2 and Stage 4 (`ensureAssessmentPackScatterplotRepresentationPrompt` in `app.js`).
   - Extended `lib/learner-renderer-vnext/assessment-evidence-hydration.js` and `lib/learner-renderer-vnext/render-assessment-evidence.js` (and rebuilt `lib/learner-renderer-vnext-browser.js`) to support multi-panel scatterplots via top-level `representation.panels[]` where every panel obeys the exact same strict fail-closed canonical single-panel contract (`authoritative_data.columns` + `observations`, `plot_specification.x_axis` + `y_axis` with distinct `variable_id`s, cell-for-cell `accessible_equivalent.column_headers` + `rows`) and reuses `expositoryMaterials.renderScatterplotEvidence()`.
   - C7 will be regenerated from Stage 2 onward to exercise the corrected representation contract at its source in live acceptance.
3. **Post-Connect More backlog items recorded (not S104 closure dependencies):**
   - [`PB-FA-034`](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-034--assessment-pack-progressive-capture-and-deterministic-assembly) — Assessment Pack progressive capture and deterministic assembly.
   - [`PB-FA-035`](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-035--shared-structured-representations-and-native-svg-rendering) — Shared Structured Representations and Native SVG Rendering (cross-referencing `D-016`).

### Focused automated verification (`node --test`, observed 2026-11-26)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-assessment-pack-stage4-contract-hardening.test.js` (new) | **9 / 9 pass** | Covers Stage 4 canonical `output_specification` prompt examples (both modes), C7 missing-field rejection at paste/save & step advance, valid canonical acceptance with workload warnings & structured-stimulus checks, fail-closed canonical publication without legacy fallback, legacy publication preservation, live Copy path upgrade without duplication on stale saved workflows, Stage 2 & Stage 4 scatterplot prompt/Copy contracts, Stage 2–4 capture rejection of malformed C7 scatterplot structure, and canonical multi-panel C7 (F1 + F2) capture + SVG/table rendering + fail-closed panel mismatch rejection |
| Existing Assessment Pack regression bundle (`s93-assessment-editorial-opening`, `s93-assessment-pack-canonical`, `s93-assessment-pack-output-specification`, `s93-assessment-pack-output-authoring`, `s93-assessment-pack-publish-integration`, `s100b2-assessment-pack-workload-feasibility`, `qa-c06-assessment-evidence-and-artefact`, `assessment-pack-legacy-retain-output-spec`, `assessment-pack-legacy-section-mapped-output-spec`, `assessment-pack-c04-output-spec-shorthand`) | **78 / 78 pass** | **87 / 87 total pass** across all 11 Assessment Pack suites |
| `npm run check:learner-renderer-vnext-browser` | **OK** | Confirms `lib/learner-renderer-vnext-browser.js` and export runtime bundles match source |

---

## Security remediation — inline SVG assessment stimulus sanitisation (2026-11-26)

### Finding & exposure
- `renderStimulus(item)` in `lib/learner-renderer-vnext/assessment-interactive.js` interpolated `item.representation.media.markup` raw into published HTML whenever `media.format === "svg"`, guarded only by `markup.indexOf("<script") !== -1`.
- Confirmed reachable through supported authoring, import, preview, standalone publication, and LMS export paths (`assessment_evidence.elicitations[].delivery.items[]`, `assessment_check.items[]`, and `activities[].assessment_items[]`), creating a stored-XSS exposure if untrusted JSON or active SVG markup reached `representation.media.markup`.

### Narrowly scoped remediation (independent of `PB-FA-035`)
1. **Parser-based structural validator & restrictive allowlist (`lib/svg-stimulus-security.js`):**
   - Implemented a zero-dependency XML/SVG state-machine parser (`validateSafeInlineSvgStimulus`) enforcing a single complete, balanced `<svg>...</svg>` root with zero content outside the root; rejecting `<!DOCTYPE`, `<!ENTITY`, `<![CDATA[`, comments, processing instructions, nested `<svg>`, unquoted/duplicate attributes, and stray angle brackets.
   - Enforced restrictive allowlists for static SVG geometric/text elements (`svg`, `title`, `desc`, `g`, `rect`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `path`, `text`, `tspan`, `defs`, `clipPath`) and safe presentational attributes (excluding all `on*` handlers, `href`/`xlink:href`, `style`, `src`, and external URIs, with XML entity decoding prior to protocol inspection).
   - Consolidated access via `PRISM_VISUAL_ASSETS.validateSafeInlineSvgStimulus` (`lib/prism-visual-assets.js`) without altering Visual Jobs SVG-to-PNG rasterisation.
2. **Fail-closed pre-publication gate with explicit diagnostics (`lib/learner-renderer-vnext/render-learner-page.js`):**
   - Wired `validatePageInlineSvgStimuli(sourcePage)` into `renderLearnerPageHtml()` (the single shared chokepoint for learner preview, standalone HTML publication, and LMS export), failing closed with `html: null` and structured `unsafe_svg_stimulus` diagnostics naming the exact JSON path rather than silently dropping assessment evidence.
3. **Defense-in-depth in `renderStimulus()` (`lib/learner-renderer-vnext/assessment-interactive.js`):**
   - Replaced the `<script` substring check with `svgStimulusSecurity.validateSafeInlineSvgStimulus(markup)`, failing closed if `renderAssessmentItem()` is invoked directly.
4. **Browser bundle & cache tokens:**
   - Rebuilt `lib/learner-renderer-vnext-browser.js` (`npm run build:learner-renderer-vnext-browser`), verified sync (`npm run check:learner-renderer-vnext-browser`), loaded `lib/svg-stimulus-security.js` in `index.html`, and bumped `?v=20261126-sec-svg-stimulus` cache tokens.

### Focused security & compatibility validation (`node --test`, observed 2026-11-26)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/security-inline-svg-stimulus-sanitization.test.js` (new) | **4 / 4 pass** | Verifies rejection of 18 active/external/breakout/malformed SVG payloads (uppercase `<SCRIPT>`, `onload`/`onerror`, `<foreignObject>`, `javascript:` & entity-obfuscated URIs, external `<image href>`/`url()`, `</figure>` breakout, `<!DOCTYPE>`/XXE, `<style>`, `<animate>`, nested `<svg>`, unquoted/mismatched/unclosed tags) across direct validator, `PRISM_VISUAL_ASSETS`, `renderAssessmentItem`, and `renderLearnerPageHtml` (canonical AP, legacy `assessment_check`, and activity pages); verifies benign legacy deterministic bar-chart SVG (`lib/assessment-pack-publish.js`) still renders cleanly |
| `tests/s105-svg-visual-asset-intake.test.js`, `tests/s93-assessment-pack-publish-integration.test.js`, `tests/qa-c06-assessment-evidence-and-artefact.test.js`, `tests/s104-assessment-pack-stage4-contract-hardening.test.js` | **37 / 37 pass** | **41 / 41 total pass**; `npm run check:learner-renderer-vnext-browser` **OK** |

---

## C7 Assessment Pack live acceptance & independent Assessment Pack QA v1.3 (2026-11-26 — ACCEPTED)

C7 was regenerated from **Stage 2 onward** (exercising the corrected canonical scatterplot representation contract and Stage 4 `output_specification` contract at source), assembled, published, and independently assessed using **Assessment Pack QA v1.3**.

| Check / Dimension | Recorded Result | Notes & Scope Boundary |
| ----------------- | --------------- | ---------------------- |
| **Educational QA score** | **`96 / 100` — Excellent** | Accepted; **do not regenerate** |
| **Confirmed defects** | **0 Critical, 0 Major, 0 Moderate** | — |
| **Minor educational limitations (non-blocking)** | **2 minor observations** | (1) Referential clarity of the four assessment expectations; (2) limited qualitative differentiation in immediate self-review |
| **Multi-panel scatterplot & tabular evidence** | **PASS** | Both scatterplots (Panel F1 and Panel F2) and accompanying semantic data tables present; both Pearson correlation coefficients independently verified |
| **Assessment design & learner artefact binding** | **PASS** | Single integrated `E7` constructed performance educationally appropriate; learner artefact contribution `comm_7.E7` correctly specified |
| **Commissioned & published duration** | **`17 minutes` preserved** | Inherited authoritative allocation intact |
| **Workload assurance observation (non-defect)** | **Credible workload concern noted; infeasibility not established** | Recorded strictly as an **assurance observation**, not a confirmed defect and not an empirical learner timing measurement |
| **Remaining whole-journey verification scope** | **Deferred to whole-journey acceptance** | Integrated learner runtime, Learning Journal handoff, persistence, and companion feedback continuity (`comm_8`) remain to be verified during whole-journey acceptance |

---

## Integrated Learning Journey QA audit — canonical Economics journey (2026-11-26 — 86 / 100, Ready with qualifications)

The completed independent Learning Journey QA audit awarded the canonical Economics journey **`86 / 100`** (superseding the preliminary `79 / 100`), with **zero confirmed Critical or Major defects** and readiness rating **Ready with qualifications**. This is the current Sprint 104 integrated educational QA evidence; **runtime assurance remains outstanding**.

| Dimension / Check | Recorded Result | Notes & Scope Boundary |
| ----------------- | --------------- | ---------------------- |
| **Overall score & readiness** | **`86 / 100` — Ready with qualifications** | Supersedes preliminary `79 / 100` |
| **Confirmed Critical / Major defects** | **0 Critical, 0 Major** | — |
| **Dimension ratings** | Progression **9/10** · Continuity **7/10** · Assessment validity **9/10** · Scaffolding & feedback **9/10** · Materials **9/10** · Usability **8/10** | — |
| **Confirmed Moderate configuration concerns (static package)** | **F01** (missing `comm_4.E4` producer & reference route; `j1` unresolved) · **F02** (`comm_6.E6` inappropriately declared as `"Your earlier response"` reference for independent assessment `comm_7`) | Both confirmed in the published package with `conflicts: []`; actual runtime consequences not yet established; root-cause investigation completed and awaiting review before bounded source-level fix |
| **Runtime assurance** | **Outstanding** | Integrated learner runtime, Journal handoff, persistence, and live cross-resource continuity remain to be verified after bounded F01/F02 fixes |

---

## Final S104 workload policy and presentation (`S104-D07`, 2026-11-26 — verified, pending review)

### Automated regression verification (`node --test`, observed 2026-11-26)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-final-workload-policy-and-presentation.test.js` (new) | **6 / 6 pass** | Shared indicative duration benchmarks (`5`–`90` min), short/fractional/extended monotonicity, aggregate non-inflation, `15`-min (`12–18`, `16–28`, `20–30`, `25–40`) and `5`-min (`6–9`, `8–12`) warning boundaries, `insufficient_evidence`/`duration_unavailable` preservation, factor-grounded actionable warnings & `durationLocked: true` upstream guidance, learner-facing indicative header + single note + suppressed routine activity badges + preserved explicit time limit & internal `durationMinutes`, unified shell overview total + single note + component TOC durations, prompt alignment across all product families |
| Combined 15-suite S104 / S100 / renderer / export-shell / unified-shell bundle | **144 / 144 pass** | Covers `s104-final-workload-policy-and-presentation`, `s100a`, `s100b1`, `s100b2`, `s100c`, `s104-lj-progressive-workload-fidelity`, `s104-m2`, `s104-m3`, `s104-m4`, `s104-m5`, `s104-situated-task-workload-feasibility`, `s104-artefact-contract-f01-f02`, `s104-assessment-pack-stage4-contract-hardening`, `s104-c6-practice-publication-qa`, `learner-renderer-vnext-export-shell`, `s78-t-037-learner-timing-metadata`, `s96-resource-title-in-unified-shell` |
| `npm run check:learner-renderer-vnext-browser` | **OK** | Confirms rebuilt `lib/learner-renderer-vnext-browser.js` and export runtime bundles match source |

### Representative Economics Learning Journey Stage 4 before-and-after (`tests/fixtures/s105-economics-stage4-commissions.json`)

| Commission | Allocated | Indicative range (upper boundary) | Estimated workload | Before (`low > allocated`) | After (`low > upperBoundary`) | Diagnostic evidence preserved |
| ---------- | --------: | --------------------------------- | ------------------ | -------------------------- | ----------------------------- | ----------------------------- |
| `comm_2` | 10 min | 5–15 minutes (15) | 11–24 min | Warned | Suppressed (`11 <= 15`) | `rawExceedsAllocated: true`, full drivers/components retained |
| `comm_5` | 8 min | 4–12 minutes (12) | 9–21 min | Warned | Suppressed (`9 <= 12`) | `rawExceedsAllocated: true`, full drivers/components retained |
| `comm_8` | 8 min | 4–12 minutes (12) | 10–23 min | Warned | Suppressed (`10 <= 12`) | `rawExceedsAllocated: true`, full drivers/components retained |
| Synthetic heavy (`comm_2`, 8 min) | 8 min | 4–12 minutes (12) | 43–87 min | Warned | **Warned** (`43 > 12`, actionable) | Full drivers + current-stage & upstream options |

### Updated Milestone 6 acceptance criterion (`S104-D07`)
- The outstanding **5-, 15-, and 30-minute Practice sensitivity test** must demonstrate meaningful differences in scope, activity design, and workload proportionality while preserving intended learning purpose and appropriate cognitive demand; it is **not** intended to demonstrate exact learner completion times.

---

## Consolidated Economics Learning Journey live runtime acceptance & presentation refinements (2026-11-26 — PASS)

### Live runtime acceptance results (Economics Learning Journey)

| Check / Dimension | Live Result | Notes & Scope Boundary |
| ----------------- | ----------- | ---------------------- |
| **Situated Task → Practice learner artefact handoff** | **PASS** | `C4 → C5` and `C4 → C6` response retrieval verified live |
| **Independent Assessment Pack (`C7`)** | **PASS** | Correctly displays no earlier learner responses, preserving assessment independence |
| **Assessment Pack → Practice handoff (`C7 → C8`)** | **PASS** | Authoritative artefact bound to `assessment-output-<specification_id>` (the learner's current editable retained judgement under *"My transport and employment judgement"*), preserving existing edits and explicit replacement behaviour (`lib/learner-renderer-vnext/assessment-output.js`, `lib/learner-renderer-vnext/learner-artefact-producers.js`) |
| **Learning Journal population & response persistence** | **PASS** | Live draft-save sync (`prism:learner-draft-saved`), Journal count increment (`2 → 3`), population, and device persistence verified |

### Intentional presentation policy & recorded legacy / follow-up observations

- **Intentional unified timing presentation policy:** Aggregate **Suggested study time** is shown in the journey overview with discreet secondary explanatory text; component timings are shown in the table of contents; routine timing labels are intentionally omitted within embedded components of the unified journey (standalone resource timing guidance and explicitly timed pedagogical activities remain preserved).
- **Saved-response, Learning Journal navigation & earlier-response refinements:** Saved-response notices use concise subordinate text with an unobtrusive *"About saving and backup"* disclosure; the Learning Journal section heading and navigation item with live response count sit immediately below the journey title above the independently scrollable contents list; earlier-response panels appear in the component's pedagogical opening (after overview and learning outcomes where present, never above internal navigation or editorial image) with a shortened read-only attribution note.
- **Legacy Economics `C5` observation (no regeneration):** The existing Economics `C5` receives an unnecessary earlier response through legacy dependency inference even though its authored specification explicitly excludes that response. The new explicit `artefact_references[]` contract (`8c0b98a`) resolves this for newly authored journeys; Economics is not regenerated to correct this legacy configuration.
- **Editorial opening images (no regeneration of Economics):** The existing Economics journey explicitly specifies `editorial_opening_image.decision: "skip"`, so its `Graphics (0)` state in Authoring is expected. The Learning Journey editorial synthesis prompts (`lib/learning-journey-design-page.js`) have been updated to favour `"generate"` by default (distinguishing decorative editorial imagery from instructional graphical representations while retaining justified `"skip"` for exceptional circumstances). The restored journey-level image production and publication pathway will be verified live on the next newly authored journey.

### Focused automated verification (`node --test`, observed 2026-11-26)

| Suite / Scope | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-c7-c8-assessment-output-handoff.test.js` (new) | **4 / 4 pass** | Editable retained-judgement workspace binding (`assessment-output-<specId>`), `direct_copy` & bare pack preservation, C7 independence + C7 → C8 handoff + Journal `2 → 3` + C4/C6 non-regression, live `prism:learner-draft-saved` badge sync, and `installAssessmentOutput` direct-edit preservation / explicit replacement |
| `tests/s104-presentation-refinements.test.js` (new) | **5 / 5 pass** | Overview *"Suggested study time"* without callout/border + TOC durations, concise saved-response guidance + backup disclosure, pinned Learning Journal section heading & nav item above scrollable TOC, earlier-response insertion after overview & learning outcomes with concise read-only note, and LJ editorial opening image discovery/fulfilment/overview placement/packaging/graceful omission + prompt default-generate alignment |
| Combined 14-suite handoff, Journal, workload, design-page & presentation regression bundle | **92 / 92 pass** | Includes `s104-presentation-refinements`, `s104-c7-c8-assessment-output-handoff`, `s104-final-workload-policy-and-presentation`, `s104-artefact-contract-f01-f02`, `s96-artefact-carry-forward-signposting`, `assessment-pack-delivery-context-retention-guidance`, `s95-m3-learner-artefact-handoff`, `s96-m3-contextual-guidance`, `s97-m2-t2-learning-journal-population`, `s97-m2-t3-learning-journal-notifications`, `s93-assessment-pack-output-assembly`, `assessment-pack-output-direct-copy`, `s105-m2-prompts-and-continuity`, `s91-learning-journey-wp3-design-page` |
| `npm run check:learner-renderer-vnext-browser` | **OK** | Confirms rebuilt `lib/learner-renderer-vnext-browser.js` and export runtime bundles match source |

---

## Authoring workload advisory & toast notification presentation refinement (2026-11-26)

| Suite / Check | Result | Notes |
| ------------- | ------ | ----- |
| `tests/s104-advisory-and-toast-presentation.test.js` (new) | **5 / 5 pass** | Single-commission and multi-commission collapsed-by-default `<details>` disclosures preserving full diagnostics without journey-level repetition, constituent workflow parity, hydration/re-validation toast deduplication, changed-condition announcement, blocking-error `role="alert"` preservation, accessible dismissal, and live-region / styling contracts |
| Combined 8-suite advisory, toast & workload regression bundle | **66 / 66 pass** | `s104-advisory-and-toast-presentation`, `s104-lj-progressive-workload-fidelity`, `s104-final-workload-policy-and-presentation`, `s104-situated-task-workload-feasibility`, `s104-m5-workload-estimation`, `s100c-learning-journey-workload-feasibility`, `s100a-workload-feasibility-estimator`, `s76-empty-capture-persist-guard` |
| `npm run check:learner-renderer-vnext-browser` | **OK** | Confirmed vNext browser bundles unaffected and matching source |


