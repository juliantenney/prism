# Sprint 104 — Validation ledger

**Status:** **OPEN — MILESTONES 1 (`c461770`), 2 (`9db45bf`), 3 (`53bd50c`), & 4 (`43db3f4`) COMMITTED / MILESTONE 5 VERIFIED (UNCOMMITTED)**  
**Baseline commit:** `1515cd4` (M1: `c461770`; M2: `9db45bf`; M3: `53bd50c`; M4: `43db3f4`)

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
| **Milestone 5 — Workload estimation corrections** | Fix `\|\| product === "practice"` precedence & prose-first duration lookup in `learning-journey-workload-feasibility-adapter.js`; wire cumulative workload against authoritative duration; explicit unavailable duration status; account for evidence, decisions, constructed responses, worked examples, feedback & revision; familiar/new & optional separation; advisory warnings only; audit Sprint 101 safeguards & arbitrary criterion caps | **Implemented & focused-verified (uncommitted — stopped before commit)** |
| **Milestone 6 — Practice duration sensitivity probes** | Live authoring runs for equivalent purpose at **5 min**, **15 min**, and **30 min** showing genuine structural & workload scaling with preserved pedagogical completeness | **Not started** (gated on Milestone 5) |
| **Milestone 7 — 90-minute Economics journey regeneration & runtime acceptance** | Regenerate 90-min journey from original brief without touching pre-intervention baseline captures; compare against untouched baseline; Educational QA + learner-runtime acceptance | **Not started** (gated on Milestone 6) |

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

## Milestone 5 verification (Workload estimation corrections — Uncommitted)

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
