# Sprint 105 — Implementation Map

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Status:** **S105-D02 ACCEPTED — MILESTONE 1 COMMITTED (`4b698db`); MILESTONE 2 IMPLEMENTED & VERIFIED (STOPPED FOR REVIEW)**  
**Baseline:** `4b698db`

---

## 1. Separately gated implementation sequence

Each milestone is independently testable, committable, and review-gated.

| Milestone | Scope | Primary Files | Gate |
| --------- | ----- | ------------- | ---- |
| **105A** | Investigation, sprint pack, Sprint 104 suspension & programme pointer updates | `docs/**` only | **Approved (`S105-D02` accepted)** |
| **Milestone 1** | **LJ stage partial contracts, deterministic final assembler, workflow versioning & strict legacy separation** | `lib/learning-journey-assemble.js` (new UMD module), `lib/page-vnext-assemble.js`, `lib/first-class-workflow-family.js`, `index.html`, `tests/prism-vm-lib-bootstrap.js`, `tests/s105-m1-lj-assembly.test.js` | **Approved & committed (`4b698db`)** |
| **Milestone 2** | **Economical Stage 1–5 prompts (distinguishing reasoning from capture, no arbitrary word limits; stored captures authoritative), Step 5 runner-guidance fix & learner artefact continuity reconciliation** | `lib/learning-journey-assemble.js`, `lib/learning-journey-shared-source.js`, `lib/learning-journey-sibling-prompts.js`, `lib/learning-journey-design-page.js`, `app.js` (runner-guidance fix & progressive prompt/handoff wiring), `tests/s105-m2-prompts-and-continuity.test.js` | **Implemented & verified (`100/100` pass) — stopped for review** |
| **Milestone 3** | **Run orchestration (stored captures authoritative over conversational context), stage capture validation, invalidation, reload persistence, clear-run & workflow duplication** | `app.js` (`isPartialPageOutputWorkflowEnabled`, `resolvePageForRenderOrAssembly`, `readAcceptedLearningJourneyPageFromWorkflow`, `orchestrateLearningJourneyDesignPageRunStage`, `syncWorkflowRunCapturedOutputToState`, `clearWorkflowRunCaptureState`, `handleDuplicateWorkflow`, LJ stage invalidation/staleness), `tests/s105-m3-lifecycle-and-orchestration.test.js` | Gated on Milestone 2 review |
| **Milestone 4** | **Focused non-regression sweep, live clean Economics LJ validation & handback to Sprint 104 M6–M7** | Focused regression suites + fresh live 90-min Economics LJ run (preserving baseline & incomplete run) + Sprint 105 closure & Sprint 104 resumption | Gated on Milestone 3 review |

> **Binding M2/M3 principle (`S105-D02` #7 — Stored captures are authoritative):** Accepted structured captures take precedence over conversational context, particularly following author edits. M2/M3 prompt handoff and invalidation must ensure downstream steps honour current stored captures without unnecessary input duplication or reliance on superseded conversational state.

---

## 2. Detailed module & contract map

### Milestone 1 — Stage partial contracts & deterministic LJ assembler

- **`lib/learning-journey-assemble.js` (new UMD module `PRISM_LEARNING_JOURNEY_ASSEMBLE`):**
  - Schema validators for each LJ stage partial:
    - `validateLearningJourneyRequirementsPartial(obj, opts)` (Stage 1: DLO `learning_outcomes`, `journey_allocated_minutes`, concise `requirements` metadata; forbids downstream fields).
    - `validateLearningJourneyProgressionPartial(obj, opts)` (Stage 2: `journey_structure`, `developmental_phases[]`, `indicative_minutes` sum check against Stage 1; forbids outcomes/elements/products).
    - `validateLearningJourneyElementsPartial(obj, opts)` (Stage 3: `elements[]`, `phase_id` referential integrity vs Stage 2, per-phase & total `indicative_minutes` check; forbids products/commissions).
    - `validateLearningJourneyCommissionsPartial(obj, opts)` (Stage 4: `shared_authoritative_material`, `journey_allocated_minutes` vs parent brief, `commissions[]` with `sum(allocated_minutes) === journey_allocated_minutes`, supported `<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>`, `element_ids` coverage vs Stage 3, continuity contract, no `interactive` on new journeys, authoritative `journal` enabled + ordered `entry_id`/`artefact_id` bindings; forbids `sections[]`/`editorial_opening_image`).
    - `validateLearningJourneyDesignPagePartial(obj, opts)` (Stage 5 thin partial: `title`, `editorial_opening_image`, `sections[]` starting with `journey_intro` + 1:1 exact `exp_N` match to Stage 4 `commissions[].section_id` & `order` + optional closing section, `learning_journey.design_intent`, optional `learning_journey.journal` title/entry `framing` keyed strictly to Stage 4 `entry_id`; **forbids** `commissions[]`, `shared_authoritative_material`, `allocated_minutes`, `learning_outcomes`, `page_synthesis`, `visual_affordances`, non-empty `activities[]`).
  - `assembleLearningJourneyPageFromPartials(partials, opts)`:
    - Deterministically produces the exact canonical final LJ Design Page (`artifact_type: "page"`, `schema_version: "2.0.0"`, `product_id: "learning_journey"`, `activities: []`, `title`, `editorial_opening_image`, `shared_authoritative_material`, `sections[]`, `commissions[]`, `learning_journey`, `assembly_state`).
    - Deterministically injects Stage 1 authoritative `learning_outcomes` as `<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>> ... <<<JOURNEY_LEARNING_OUTCOMES_END>>>` into each `commissions[].journey_context_text` (honouring optional `relevant_journey_outcome_indices` and failing closed if Stage 4 embedded a conflicting block).
    - Merges Stage 5 optional `journal` `title` and per-entry `framing` onto Stage 4's authoritative `journal` structure without permitting entry addition, removal, reordering, or `artefact_id` mutation.
    - Runs `validateLearningJourneyDesignPage(assembled)` as the final deterministic gate.
- **`lib/page-vnext-assemble.js`:**
  - Register LJ stage IDs (`lj_requirements`, `lj_progression`, `lj_elements`, `lj_commissions`) in `STAGE_ORDER` / `STAGE_CANONICAL_STEP_IDS` and delegate LJ partial bundles cleanly to `PRISM_LEARNING_JOURNEY_ASSEMBLE` (additive only; zero changes to Interactive/Practice/Expository code paths).
- **`lib/first-class-workflow-family.js`:**
  - Mark newly created LJ workflows (`buildLearningJourneyFamily`) with `outputSpec: { partialPageOutputs: true, progressive_capture_version: "s105_v1" }` alongside existing `duration_contract_version: "s104_m1"`.
- **`index.html` & `tests/prism-vm-lib-bootstrap.js`:**
  - Load `lib/learning-journey-assemble.js` alongside `lib/learning-journey-design-page.js` and `lib/page-vnext-assemble.js`.

### Milestone 2 — Economical prompts, runner-guidance fix & continuity reconciliation

- **`lib/learning-journey-sibling-prompts.js`:**
  - Refactor Stages 1–4 prompt templates (`learning_requirements`, `learning_progression`, `learning_elements`, `learning_commissions`) to emit compact fenced JSON stage partials matching Milestone 1 schemas while preserving all educational design pedagogy (including Sprint 104 M1 authoritative duration and M4 proportionate commissioning principles, Sprint 97 Journal two-criterion reasoning, Sprint 94 continuity contract, and Sprint 102 journey-owned outcomes).
  - Remove the 11-section markdown essay structure and redundant per-commission prose checklists from Stage 4 (`learning_commissions`), instructing Stage 4 to emit `commissions[]`, `shared_authoritative_material`, `continuity`, and `journal` structure directly once — and not to paste Stage 1 `learning_outcomes` JSON into every commission.
- **`lib/learning-journey-design-page.js`:**
  - Update `buildLearningJourneyDesignPagePrompt()` and `buildLearningJourneyDesignPageCopyInstructions()` for progressive Step 5 thin-partial mode (generating only `title`, `editorial_opening_image`, `sections[]`, `learning_journey.design_intent`, optional `learning_journey.journal` editorial framing, and `assembly_state`), explicitly forbidding regeneration of `commissions[]`, `shared_authoritative_material`, `allocated_minutes`, or `learning_outcomes`.
  - **Reconcile learner artefact continuity guidance & validator (`574–770, 848, 965`):** Separate authoring-time model non-inspection / no response-aware adaptation / no pre-feedback snapshot prohibitions from unified LJ runtime read-only learner artefact availability (`{commission_id}.{elicitation_id}` and Journal).
- **`app.js` (`41956–42200`):**
  - **Fix Step 5 runner-guidance conflict (`42117–42128`):** Include `workflowRecordIsLearningJourney(wfForChain) || isLearningJourneyWorkflow(wfForChain)` in the suppression guard for generic Interactive `step_design_page` `runnerInstructions`.
  - In progressive LJ mode, avoid dumping full prior step JSON into prompts (same-chat economy), while optionally projecting a tiny deterministic Stage 4 structural manifest (`commission_id`, `section_id`, `order`, `title`, and Journal `entry_id`/`artefact_id` list) into Step 5 Copy instructions so Step 5 achieves exact 1:1 `section_id` and Journal `entry_id` parity without ever re-reading or re-emitting full commission bodies.

### Milestone 3 — Run orchestration, validation, invalidation, persistence, clear-run & duplication

- **`app.js`:**
  - `isProgressiveLearningJourneyWorkflow(wf)`: detects Sprint 105 progressive flag (`outputSpec.partialPageOutputs` / `progressive_capture_version`) while recognising pre-105 monolithic workflows cleanly.
  - `isPartialPageOutputWorkflowEnabled(wf)` (`14075`): enable for progressive LJ workflows.
  - `resolvePageForRenderOrAssembly` (`13015–13188`): add progressive LJ branch reading Stage 1 + Stage 4 (+ Stage 2/3 if present for diagnostics/enriched_by) + Stage 5 captures and assembling via `assembleLearningJourneyPageFromPartials`.
  - `readAcceptedLearningJourneyPageFromWorkflow` (`7845–7890`):
    - Legacy monolithic path: if workflow is legacy OR Step 5 capture is a valid complete monolithic LJ Design Page (`commissions[]` + `shared_authoritative_material`), return it directly as today.
    - Progressive path: assemble from stored stage captures (`step_journey_requirements`, `step_journey_progression`, `step_journey_elements`, `step_journey_commissioning`, `step_design_page`) and validate the assembled final page.
  - `orchestrateLearningJourneyDesignPageRunStage` (`7895–7985`): report progressive thin-partial Step 5 + deterministic local assembly (`localAssemblerInvoked: true` when assembling) accurately.
  - `syncWorkflowRunCapturedOutputToState` (`31930–32095`):
    - Validate each LJ stage capture (Steps 1–5) on paste/sync, surfacing clear blocking errors in `workflowRunPageValidation` / `workflowRunLjStageValidation` and preventing durable acceptance of invalid partials.
    - On Stage 4 JSON acceptance, synchronise `shared_authoritative_material` (write-once onto `wf.deliverySeed.source_context`, tracking `source_context_origin: "run_generated"` vs `"brief_provided"`) and `commissioned_component_durations`.
    - **Stage invalidation:** When an upstream LJ stage capture is edited, replaced, or cleared, invalidate downstream LJ stage completion flags, clear cached assembled page snapshots, and if Stage 4 is modified/cleared, clear run-generated `source_context` (only when `source_context_origin === "run_generated"`, never brief-provided source) and `commissioned_component_durations` so stale durations/shared corpora cannot survive.
  - `clearWorkflowRunCaptureState` (`31155–31265`): clear `workflowRunLjStageValidation`, `workflowRunLjSharedSourceValidation`, `workflowRunLjDurationValidation`, cached assembled LJ snapshot, and run-derived LJ `deliverySeed` fields (`commissioned_component_durations` and run-generated `source_context`), preserving author brief fields.
  - `handleDuplicateWorkflow` (`40483–40519`): strip run-derived LJ fields (`commissioned_component_durations` and run-generated `source_context`) on the cloned workflow so duplicates start completely clean while retaining the author's original brief and any brief-provided source context.

---

## 3. Strict regression boundaries

The following surfaces must remain **unchanged** in behaviour throughout Sprint 105:

1. **Final LJ Design Page schema & all downstream LJ consumers:**
   - `lib/first-class-commission-intake.js`
   - `lib/learning-journey-unified-shell.js`
   - `lib/learning-journey-learner-package.js`
   - `lib/learning-journey-shared-source.js` (write-once semantics preserved)
   - `lib/learning-journey-workload-feasibility-adapter.js` (Sprint 104 M5 logic preserved)
   - Batch & single component creation, delete/recreate, preview contract, unified ZIP publish, and Learning Journal runtime.
2. **All other first-class product workflows:**
   - Interactive (standalone & legacy), Practice (Sprint 104 M2/M3 Episode Plan & conditional contracts), Expository (EJP/XD/XM/DP progressive assembly), Assessment Pack, and Situated Task.
3. **Legacy Learning Journey workflows:**
   - Pre-Sprint 105 workflows containing monolithic Step 5 `learning_journey_page` captures must continue to load, validate, preview, commission, and publish cleanly.
4. **Preserved Economics evidence:**
   - Original pre-intervention baseline (`c01-page.json`, `c01-zip/`, `c02-page.json`, `tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`) and the incomplete Sprint 104 regeneration remain untouched.
