# Sprint 104 — Status / work log

**Sprint:** 104 — Workload Fidelity and Proportionate Authoring  
**Status:** **OPEN — MILESTONE 1 COMMITTED (`c461770`) / MILESTONE 2 IMPLEMENTED (STOPPED FOR REVIEW BEFORE COMMIT)**  
**Baseline:** `1515cd4` (M1 checkpoint: `c461770`)  
**Primary backlog item:** [PB-FA-025](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-025--duration-fidelity-learner-workload-budgeting)  
**Opening & agreement:** [S104-D01](decisions.md#s104-d01--open-sprint-104--workload-fidelity-and-proportionate-authoring), [S104-D02](decisions.md#s104-d02--architectural-agreement-principles-a-e-and-seven-gated-milestones)

| Item | State |
| ---- | ----- |
| S104-D01 Open sprint | **Accepted** |
| Phase 104A Read-only investigation & documentation | **Complete (`f3bb47d`)** |
| S104-D02 Architectural agreement (Principles A–E & Milestones 1–7) | **Accepted** |
| Milestone 1 — Authoritative duration transport | **Complete & committed (`c461770`)** (automated verified; manual acceptance pending integrated live validation) |
| Milestone 2 — Practice Episode Plan design authority | **Implemented & focused-verified (uncommitted — stopped for review before commit)** |
| Milestone 3 — Reconciliation of downstream Practice contracts | **Not started** (gated on Milestone 2 review; incompatibilities documented) |
| Milestone 4 — Proportionate Learning Journey commissioning | **Not started** (gated on Milestone 3) |
| Milestone 5 — Workload estimation corrections | **Not started** (gated on Milestone 4) |
| Milestone 6 — Live 5-, 15- and 30-minute Practice sensitivity probes | **Not started** (gated on Milestone 5) |
| Milestone 7 — 90-minute Economics journey regeneration, baseline comparison, QA & learner-runtime acceptance | **Not started** (gated on Milestone 6) |

---

## Work log

### 2026-11-24 — Milestone 2 implementation (Practice Episode Plan design authority)

- Implemented **Milestone 2** per [S104-D02](decisions.md#s104-d02--architectural-agreement-principles-a-e-and-seven-gated-milestones) Principle B (stopped before commit for review; Milestone 3 left untouched; economics baseline untouched):
  - **`lib/practice-episode-plan.js` (new UMD module `PRISM_PRACTICE_EPISODE_PLAN`):**
    - Normalizes authoritative commissioned or upstream outcomes (`resolveAuthoritativePracticeOutcomes`) with canonical ID preservation (`LO1`, `LO2`, ... fallback).
    - Formats dynamic Episode Plan V1 grammar guidance (`formatPracticeGrammarSummary`) from `lib/episode-plan-v1-vocabulary.js` and `lib/episode-plan-v1-archetype-grammar.js` with **no** duration tiers, activity quotas, or beat-count targets.
    - Builds AI-authored Practice Episode Plan prompts (`buildPracticeEpisodePlanPromptBody`) supplying authoritative outcomes, `durationMinutes`, purpose, prior learning, journey context, dependencies, shared learner artefact awareness, explicit multi-LO cohesive single-activity permission, and v2 `page` shell schema (`product_id: "practice"`, `page_kind: "practice"`, em-dash DLA placeholders, empty `required_materials`/`materials`).
    - Deterministically validates AI-authored Practice Episode Plan captures (`validatePracticeEpisodePlanCapture`): v2 `page` shell schema (`lib/page-shell-create.js`), Practice identity, `assembly_state.current_stage === "episode_plan"`, zero invented DLA cognition fields or non-empty `required_materials[]`/`materials[]`, 1:1 `activities[]` ↔ `episode_plans[]` pairing and `episode_plan` agreement, bidirectional `mapped_learning_outcome_ids` ↔ `learning_outcome_ids` sync + conflict rejection, `validateSequenceAgainstGrammar` on every activity (fail-closed if grammar module absent), 100% authoritative outcome coverage (allowing multiple LOs on one cohesive activity), and exact statement fidelity without overwriting.
  - **`index.html`:** Loaded `lib/episode-plan-v1-archetype-grammar.js` after `lib/episode-plan-v1-vocabulary.js`, and `lib/practice-episode-plan.js` after `lib/episode-plan-dla-integration.js`.
  - **`app.js`:**
    - Routed Practice `Design Episode Plan` in `resolveStepPromptText` to `sourceType: "practice_episode_plan"` (`buildPracticeDesignEpisodePlanPromptBody` via `isCommissionContextDeliveryStep`), replacing deterministic `v2_locked` instantiation for Practice while keeping `v2_locked` intact for Interactive.
    - Updated `isDerivedShellWorkflowStep`, `isWorkflowStepEligibleForWorkflowContextProjection`, and `buildWorkflowStepInstructions` with workflow-aware branching so Practice projects authoritative context (Duration, Audience, Topic, Additional Instruction) cleanly and omits `"Deterministic step (Sprint 56F)"` / PRISM-derived shell embedding.
    - Removed Practice deterministic archetype derivation and capture overwriting across `applyEpisodePlanCaptureCanonicalEnforcement`, `syncWorkflowRunCapturedOutputToState` (guarding auto-repair with `!isPracticeWorkflow(wf)`), `maybeAutoPopulateDesignEpisodePlanRunCapture`, `deriveDesignEpisodePlanCaptureJson`, `deriveDesignEpisodePlanCaptureJsonFromLearningOutcomes`, `resolvePageShellJsonForDlaCopy`, `tryResolveCanonicalEpisodePlansDeriveFallback`, `resolveEpisodePlansForDlaPopulation`, `parseEpisodePlanOrPageCaptureForStorage`, `formatEpisodePlansCaptureForPromptEmbed`, and `validateEpisodePlanOrPageShellCapture`.
  - **`lib/ld-practice-presentation-contracts.js`:** Updated `episodePlanLines()` for Milestone 2 design authority while leaving DLA/GAM/LS/DP contract sections untouched for Milestone 3.
  - **`tests/prism-vm-lib-bootstrap.js`, `tests/qa-lj-no-phantom-run-captures.test.js`, `tests/s104-m2-practice-episode-plan.test.js`:** Wired M2 dependencies into VM bootstrap, aligned the outdated Sprint 102E Practice deterministic-derivation expectation in `qa-lj-no-phantom-run-captures.test.js` (`deriveDesignEpisodePlanCaptureJson === ""` and `sourceType === "practice_episode_plan"` while keeping unstarted Run emptiness), and added 8 focused Milestone 2 tests.
- **Multi-LO cohesive single activity finding:** Verified empirically across `page-shell-create.js`, `episode-plan-population-contract.js`, `page-gam-enrich.js`, `page-vnext-assemble.js`, and `learner-renderer-vnext` that mapping multiple authoritative LOs onto one cohesive activity (`learning_outcome_ids` / `mapped_learning_outcome_ids`) is supported cleanly (`0` assembly/renderer errors); noted minor `lib/page-dla-enrich.js:336-350` (`resolveLoStatementForActivity`) single-statement fallback for Milestone 3 awareness.
- **Identified Milestone 3 incompatibilities (untouched):** Documented exact contract, validator, and prompt incompatibilities in [IMPLEMENTATION-MAP.md](IMPLEMENTATION-MAP.md#milestone-3-incompatibilities-identified-during-milestone-2) and [decisions.md](decisions.md#s104-d03--milestone-2-multi-lo-compatibility-and-deferred-milestone-3-incompatibilities).

### 2026-11-24 — Milestone 1 implementation and architectural documentation update

- Recorded architectural agreement **[S104-D02](decisions.md#s104-d02--architectural-agreement-principles-a-e-and-seven-gated-milestones)** across `decisions.md`, `IMPLEMENTATION-MAP.md`, `VALIDATION.md`, `STATUS.md`, `SPRINT-104-CHARTER.md`, `SPRINT-104-START-HERE.md`, `README.md`, `ARCHITECTURAL-DEBT.md`, `INITIAL-INVESTIGATION.md`, and programme docs (`docs/sprints/sprint-104-workload-fidelity-and-proportionate-authoring.md`, `docs/sprints/NEXT-SPRINT.md`), replacing the draft `S104-D02` heuristics (prose fallback, fixed duration tiers, beat quotas, deterministic LO grouping) with AI design authority, conditional downstream contracts, proportionate commissioning, and the 7-milestone sequence.
- Implemented **Milestone 1 (Authoritative duration transport only)**:
  - `lib/learning-journey-sibling-prompts.js`: established Step 4 (`step_journey_commissioning`) as canonical origin with `<<<COMMISSION_DURATIONS_BEGIN>>> ... <<<COMMISSION_DURATIONS_END>>>` structured JSON block and clear conceptual separation of Authoritative allocated duration, Designed duration, and Estimated workload (preserving Sprint 103 guidance wording).
  - `lib/learning-journey-design-page.js`: added strict structured-integer extraction (`extractCommissionDurationsFromCommissioningText`), Step 5 schema validation (`commissions[].allocated_minutes`, optional `learning_journey.allocated_minutes`), Step 4↔Step 5 reconciliation (`reconcileDesignPageCommissionDurations`) failing closed on conflict and inheriting verbatim when omitted at Design Page, zero prose fallback for legacy pages, author-only inspection metadata (`renderCommissionContractHtml`), and Step 5 prompt alignment.
  - `lib/first-class-commission-intake.js` & `lib/first-class-workflow-family.js`: added strict integer `allocatedMinutes` validation, fail-closed conflict checking, lossless seeding of `commissioned_duration_minutes`, `duration_minutes`, `commissioned_duration_provenance`, and optional `journey_allocated_minutes` across all 4 commissioned product families (`expository`, `practice`, `assessment_pack`, `situated_task`) plus legacy `interactive`, without altering standalone Create seeds.
  - `app.js`: wired Step 4 capture extraction (`applyLearningJourneyCommissionDurationsFromCommissionCapture`), Step 5 capture/gate conflict blocking (`reconcileLearningJourneyDesignPageDurations`), single & batch creation authoritative duration handoff, persistence/normalization carry-forward, component-level Adjustments duration lock for LJ-commissioned components (`hasAuthoritativeCommissionedDuration`), and `ADJUSTMENTS_CAPABILITY_RESOLVERS.interactive_duration` inclusion for LJ-commissioned Expository with authoritative duration while keeping standalone Expository and legacy commissions untouched.
- Verified Milestone 1 closure invariants:
  - Enforced Step 4 `journey_allocated_minutes` vs parent Learning Journey authoritative allocation (`resolveLearningJourneyAuthoritativeParentDurationMinutes`) and component sum reconciliation (`sum === journey_allocated_minutes`) in `lib/learning-journey-design-page.js` and `app.js` (also fixed `resolveLearningJourneyLearningTimeEnvelopeMinutes` to inspect `workflowBriefResolution.resolvedFactors` / `initialBrief`).
  - Distinguished genuinely legacy Learning Journeys/commissions from newly authored commissions via `duration_contract_version: "s104_m1"` on `buildLearningJourneyFamily`, `isLearningJourneyDurationContractRequired`, and partial-duration detection so new Step 4, Step 5, and intake paths cannot silently bypass structured duration metadata while legacy compatibility remains preserved.
- Added focused test suite `tests/s104-m1-duration-transport.test.js` (11 / 11 passing) and verified 158 / 158 assertions across the closure/legacy non-regression bundle (plus 343 / 343 across the broader 34-file Milestone 1 verification sweep). Recorded manual acceptance as **pending integrated live validation** and committed Milestone 1 as a discrete checkpoint.

### 2026-11-24 — Phase 104A investigation and sprint pack creation

- Opened Sprint 104 from clean baseline `1515cd4`.
- Traced `C04` (*Comparing competing economic explanations*, 8 min) end-to-end across Journey Planning, Commission Scope, Intake, Commission-Native Binding, Episode Plan, DLA, GAM, Construct Learning Sequence, Design Page, and all four workload estimation/validation modules.
- Directly inspected and measured `C01` (`c01-page.json`, `c01-zip/learner-page.html`), `C02` (`c02-page.json`), and `C06` (`tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`), and ran `lib/interactive-workload-feasibility-adapter.js` against `C01` to observe the silent `warnings: []` bypass empirically.
- Documented exact evidence boundary (raw captures for `C03`, `C04`, `C05`, and parent Economics LJ not present in workspace; user `Downloads` directory untouched).
- Authored Sprint 104 documentation pack (`README.md`, `SPRINT-104-START-HERE.md`, `SPRINT-104-CHARTER.md`, `INITIAL-INVESTIGATION.md`, `IMPLEMENTATION-MAP.md`, `VALIDATION.md`, `decisions.md`, `STATUS.md`, `ARCHITECTURAL-DEBT.md`) and programme pointers.
- Verified zero modifications to prompts, contracts, validators, application code, tests, or baseline captures.
