# Sprint 105 — Validation Plan

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Status:** **MILESTONE 1 FOCUSED-VERIFIED (STOPPED FOR REVIEW)**  
**Baseline:** `f1f1269`

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

### Milestone 2 gate — Economical prompts, Step 5 runner-guidance fix & continuity reconciliation
- **Syntax checks:** `node --check` on `lib/learning-journey-sibling-prompts.js`, `lib/learning-journey-design-page.js`, `app.js`.
- **Focused automated suite (`tests/s105-m2-prompts-and-continuity.test.js`):**
  - Stages 1–4 prompts emit compact JSON stage contracts without 11-section markdown essay duplication or 6× Stage 1 outcome copying; all Sprint 104 M1/M4 duration & proportionate commissioning principles and Sprint 97 Journal reasoning are preserved.
  - **Step 5 runner-guidance regression:** `buildWorkflowStepInstructions` for LJ Step 5 contains **zero** Interactive `page_synthesis`, `activities[].materials[]`, `visual_affordance_schema_version`, or `activities_visual_review` runner guidance.
  - **Continuity guidance & validator reconciliation:**
    - Still rejects authoring-time inspection claims (*"inspects previous published outputs"*), response-aware runtime adaptation / AI grading of prior answers, automatic transfer of arbitrary undeclared answers, and pre-feedback snapshot claims.
    - Accepts accurate educational bring-forward descriptions and declared `{commission_id}.{elicitation_id}` unified runtime / Journal availability without false-positive failure.
  - Non-regression on `tests/s104-m1-duration-transport.test.js`, `tests/s104-m4-proportionate-commissioning.test.js`, `tests/s94-learning-journey-wp2*.test.js`, `tests/s103-duration-fidelity-guidance.test.js`, `tests/s103-artefact-consumer-four-product.test.js`.

### Milestone 3 gate — Run orchestration, invalidation, reload persistence, clear-run, duplication & legacy compatibility
- **Syntax checks:** `node --check app.js`.
- **Focused automated suite (`tests/s105-m3-lifecycle-and-orchestration.test.js`):**
  - **Progressive capture & deterministic assembly in `app.js`:** Pasting valid Stage 1–5 partials stores each step cleanly, validates on paste, assembles deterministically via `readAcceptedLearningJourneyPageFromWorkflow` and `resolvePageForRenderOrAssembly`, and feeds batch/single component creation and unified publish.
  - **Stage invalidation:** Editing or replacing Stage 1, 2, 3, or 4 invalidates downstream readiness/cached assembled page snapshots and clears stale run-derived durations / run-generated shared source without deleting brief-provided `source_context`.
  - **Reload persistence:** Simulated IndexedDB save → reload hydration restores all 5 stage captures and re-assembles the identical final LJ Design Page cleanly.
  - **Clear run data:** `clearWorkflowRunCaptureState` clears all stage captures, validation states, cached assembled page, and run-generated `deliverySeed` fields while preserving the original brief and brief-provided `source_context`; no phantom captures remain.
  - **Workflow duplication:** `handleDuplicateWorkflow` creates a clean duplicate with remapped step IDs, preserved brief & brief-provided `source_context`, and zero leaked captures, run-generated `source_context`, or `commissioned_component_durations`.
  - **Legacy monolithic LJ compatibility:** Pre-Sprint 105 workflows without `progressive_capture_version` containing monolithic Step 5 `learning_journey_page` JSON continue to read, validate, preview, commission, and publish identically.
  - Non-regression on `tests/qa-lj-no-phantom-run-captures.test.js`, `tests/qa-lj-batch-component-creation.test.js`, `tests/qa-lj-commission-native-and-lifecycle.test.js`, `tests/s96-lj-shared-source-design-page-boundary.test.js`, `tests/s102e-clear*.test.js`, `tests/s103-clear*.test.js`, and Expository/Practice/Interactive partial-page tests.

### Milestone 4 gate — Live clean Economics LJ validation & Sprint 104 handback
- **Live validation (fresh workflow; original baseline & incomplete Sprint 104 run preserved untouched):**
  1. Run the 90-minute / 2-week *Correlation and Causation: Making Sense of Economic Evidence* brief end-to-end through progressive Learning Journey Steps 1–5.
  2. Confirm economical stage outputs across Steps 1–4 (no ~14,000-word Step 4 sprawl) and thin Step 5 synthesis completing comfortably within model output limits.
  3. Confirm deterministic final assembly passes all LJ Design Page, duration reconciliation, shared-source, continuity, and Journal validations cleanly.
  4. Verify browser reload persistence, preview contract, single/batch commissioning handoff (carrying authoritative `allocated_minutes`, component outcomes, journey outcomes, shared source, and `{commission_id}.{elicitation_id}` bindings), and unified shell export readiness.
- **Handback to Sprint 104:** Close Sprint 105 and resume **Sprint 104 live acceptance** (Milestone 1 integrated live acceptance, Milestone 6 live 5-/15-/30-minute Practice sensitivity probes, and Milestone 7 Economics component regeneration, baseline comparison against preserved pre-intervention captures, educational QA, and unified learner-runtime acceptance).
