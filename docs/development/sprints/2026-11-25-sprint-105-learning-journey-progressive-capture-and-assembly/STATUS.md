# Sprint 105 — Status / work log

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Status:** **OPEN — MILESTONE 1 COMMITTED (`4b698db`); MILESTONE 2 IMPLEMENTED & FOCUSED-VERIFIED (STOPPED FOR REVIEW)**  
**Opened:** 2026-11-25  
**Baseline:** `4b698db` (Sprint 105 M1 committed on top of Sprint 104 M1–M5 `f1f1269`)  
**Priority:** Takes priority **before Connect More** (Wed 2 Dec 12:00)  
**Decisions:** [S105-D01](decisions.md#s105-d01--open-sprint-105--learning-journey-progressive-capture-and-assembly) · [S105-D02 (Accepted)](decisions.md#s105-d02--stage-authority-progressive-capture-and-deterministic-assembly-contract)

| Item | State |
| ---- | ----- |
| Sprint 104 suspension (`S104-D04`) | **Complete** (M1–M5 preserved at `f1f1269`; M6–M7 & M1 live acceptance preserved) |
| Programme pointers & dependencies updated | **Complete** (`NEXT-SPRINT.md`, `docs/sprints/README.md`, `sprint-104-*.md`, `sprint-105-*.md`, `PRODUCT-BACKLOG.md`, `docs/backlog/README.md`) |
| **Phase 105A** — Initial investigation & sprint documentation | **Approved** (`S105-D02` accepted with 9 refinements) |
| **Milestone 1** — Stage contracts, deterministic LJ assembler, workflow versioning & legacy separation | **Approved & committed (`4b698db`)** |
| **Milestone 2** — Economical Stage 1–5 prompts, Step 5 runner-guidance fix & continuity guidance reconciliation | **Implemented & focused-verified (uncommitted — stopped for review)** |
| **Milestone 3** — Run orchestration, stage validation, invalidation, reload persistence, clear-run & workflow duplication | **Gated on Milestone 2 review** |
| **Milestone 4** — Focused regression verification, live clean Economics LJ validation & handback to Sprint 104 M6–M7 | **Gated on Milestone 3 review** |

---

## Work log

### 2026-11-25 — Milestone 1 committed (`4b698db`); Milestone 2 implemented & focused-verified (stopped before commit / M3)

- Committed Milestone 1 at `4b698db` (`Sprint 105 M1: Learning Journey progressive capture contracts, deterministic assembler, and legacy separation`).
- Implemented **Milestone 2** aligned verbatim to the M1 stage contracts:
  - **`lib/learning-journey-assemble.js`:** Added and exported `buildAuthoritativeStageHandoffSection(targetStage, storedCaptures, options)` — establishes the `AUTHORITATIVE STORED UPSTREAM CAPTURES` precedence rule (accepted stored captures override conversational context, especially after author edits) and projects only minimal per-stage anchors (Stage 2 gets Stage 1 minutes/purpose/profile/constraints/numbered outcomes; Stage 3 gets Stage 1 minutes + Stage 2 phases/structure; Stage 4 gets Stage 1 minutes + numbered outcomes `1..N` + Stage 3 elements; Stage 5 gets compact Stage 4 commission & Journal manifests ONLY — zero `specification_text`, zero `journey_context_text`, zero `shared_authoritative_material`).
  - **`lib/learning-journey-shared-source.js`:** Added and exported `composeProgressiveAuthoritativeSharedSourcePromptSection(existingSourceContext)` — enforces deterministic transport for brief-provided source (`{ "status": "provided" }` with `content` omitted, no retranscription) and concise `"generated"`/`"none"` JSON contract otherwise, leaving legacy shared-source prompt helpers untouched.
  - **`lib/learning-journey-design-page.js`:**
    - Added and exported genuinely thin `buildProgressiveLearningJourneyDesignPagePrompt()` and `buildProgressiveLearningJourneyDesignPageCopyInstructions()` (learner-facing editorial synthesis only — `title`, `editorial_opening_image`, 1:1 `sections[]`, `learning_journey.design_intent`, optional `learning_journey.journal` framing keyed by Stage 4 `entry_id`; explicitly forbids `commissions[]`, `shared_authoritative_material`, `activities[]`, `learning_outcomes`, `allocated_minutes`, `continuity`, Journal structure mutation, and all Interactive fields).
    - Reconciled **`S105-AD-003`** in both prompts and `collectLearningJourneyContinuityErrors`: replaced outdated blanket no-transfer wording with the accurate post-Sprint 95/96/103 distinction (forbidding authoring-time inspection, automatic transfer of arbitrary undeclared answers, response-aware runtime adaptation, AI grading of prior answers, and pre-feedback snapshot claims while accepting declared `{commission_id}.{elicitation_id}` read-only runtime / Learning Journal descriptions).
  - **`lib/learning-journey-sibling-prompts.js`:** Preserved legacy `TEMPLATES` verbatim and added `PROGRESSIVE_TEMPLATES` (`learning_requirements`, `learning_progression`, `learning_elements`, `learning_commissions`, plus progressive `design_page` delegation) matching M1 allowed keys verbatim, preserving educational reasoning, Sprint 104 M4 proportionate commissioning principles, and Sprint 97 two-criterion Journal discipline without redundant prose checklists or arbitrary word-count caps. Updated `resolveTemplate(stageOrStep, options)` to select progressive templates only when `{ progressive: true }` / `{ mode: "progressive" }`.
  - **`app.js` (strictly M2 scope):**
    - Fixed **`S105-AD-002`** at `buildWorkflowStepInstructions` (`workflowRecordIsLearningJourney(wfForChain) || isLearningJourneyWorkflow(wfForChain)` added to the Step 5 generic Interactive `runnerInstructions` suppression guard for both progressive and legacy LJ workflows).
    - Wired progressive LJ prompt routing (`resolveLearningJourneySiblingPromptBodyForStep`, `orchestrateLearningJourneyDesignPageRunStage`, `composeLearningJourneyAuthoritativeSharedSourceToken`, `materializeWorkflowPromptTemplateTokens` with `AUTHORITATIVE_STAGE_HANDOFF`, and `buildWorkflowStepInstructions` thin Stage 5 Copy notes + suppression of raw full-JSON upstream dumps and conversational Design Page boilerplate on progressive LJ steps). Legacy LJ workflows and all non-LJ product families remain unchanged.
  - **`tests/s105-m2-prompts-and-continuity.test.js`:** Added 5 focused M2 tests (including live `app.js` VM verification of progressive/legacy LJ and Interactive prompt/instruction routing).
- Verified **100 / 100** passing assertions across 11 focused suites (`s105-m2`, `s105-m1`, `s104-m4`, `s94-wp2`, `s103-duration`, `s96-shared-source`, `s91-design-page`, plus Expository, Situated Task, and Assessment Pack design-page non-regression suites; `node --check` exit 0 on all touched files). Stopped for review before committing M2 or starting M3. No live generation yet.

### 2026-11-25 — Milestone 1 implemented & focused-verified (stopped before commit / M2)

- Ratified **[S105-D02](decisions.md#s105-d02--stage-authority-progressive-capture-and-deterministic-assembly-contract)** incorporating all 9 architectural refinements (immutable final DP contract with zero intermediate-field leakage, minimum sufficient field-purpose/consumer schemas, structural ownership enforcement, deterministic transport of Stage 1 outcomes and brief-provided source material, mandatory 5-stage progressive assembly, strict legacy separation with zero monolithic bypass on progressive workflows, stored-captures-authoritative principle recorded for M2/M3, Sprint 104 contract preservation, and Economics evidence preservation).
- Implemented **Milestone 1**:
  - **`lib/learning-journey-assemble.js` (new UMD module `PRISM_LEARNING_JOURNEY_ASSEMBLE`):**
    - Minimal sufficient, allowed-key-enforced validators for all 5 stages (`validateLearningJourneyRequirementsPartial`, `validateLearningJourneyProgressionPartial`, `validateLearningJourneyElementsPartial`, `validateLearningJourneyCommissionsPartial`, `validateLearningJourneyDesignPagePartial`).
    - Cross-stage integrity enforcement: Stage 2 phase & constituent minutes vs Stage 1; Stage 3 `phase_id`s, phase coverage & per-phase minutes vs Stage 2; Stage 4 `element_ids` 100% coverage vs Stage 3, new-journey `interactive` prohibition, `<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>` validation via `lib/commission-native-lo-bind.js`, pre-injection continuity validation via `lib/learning-journey-design-page.js`, and sum of `allocated_minutes` reconciliation; Stage 5 1:1 `sections[]` order match vs Stage 4 commissions and strict Journal framing-only merge without altering `enabled`, order, or `artefact_id`.
    - Deterministic transport: injects Stage 1 DLO `learning_outcomes` (full or `relevant_journey_outcome_numbers` subset) into every assembled `commissions[].journey_context_text` (failing closed on conflict), and transports `briefProvidedSourceContext` verbatim when Stage 4 declares `{ status: "provided" }` (failing closed on regeneration or conflict).
    - `assembleLearningJourneyPageFromPartials`: requires all 5 valid stages (never treats Stage 2 or Stage 3 as optional), strips all intermediate-only fields (`element_ids`, `relevant_journey_outcome_numbers`, `decision_basis`, `feasibility_note`, Stages 1–3 payloads), and validates the assembled page against the immutable `validateLearningJourneyDesignPage`.
    - Workflow versioning & strict legacy separation (`readProgressiveCaptureVersion`, `isProgressiveLearningJourneyWorkflow`, `classifyLearningJourneyWorkflowMode`, `isMonolithicLearningJourneyDesignPageShape`, `resolveLearningJourneyPageByMode`): progressive workflows strictly reject monolithic Step 5 captures (`monolithic_capture_rejected_for_progressive_workflow`), while legacy pre-105 workflows continue working identically.
  - **`lib/page-vnext-assemble.js`:** Additive registration of LJ stages (`learning_requirements`, `learning_progression`, `learning_elements`, `learning_commissions`) in `STAGE_ORDER` / `STAGE_CANONICAL_STEP_IDS`, delegation of LJ partial bundles to `PRISM_LEARNING_JOURNEY_ASSEMBLE`, `LEARNING_JOURNEY_DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS`, `pageHasLearningJourneyEnrichment`, and `validateAssembledPageForRender` LJ support — Interactive, Practice, and Expository paths untouched.
  - **`lib/first-class-workflow-family.js`:** Stamped `deliverySeed.progressive_capture_version = "s105_v1"`, `deliverySeed.source_context_origin = "brief_provided"` (when `sourceContext` supplied), and `outputSpec: { partialPageOutputs: true, progressiveCaptureVersion: "s105_v1" }` on `buildLearningJourneyFamily` (preserving `duration_contract_version: "s104_m1"`).
  - **`index.html` & `tests/prism-vm-lib-bootstrap.js`:** Wired `lib/learning-journey-assemble.js` load order alongside `lib/learning-journey-design-page.js` and `lib/page-vnext-assemble.js`.
  - **`tests/s105-m1-lj-assembly.test.js`:** Added 8 focused tests covering immutable DP fidelity, zero intermediate leakage, mandatory 5-stage requirement, deterministic brief-source & Stage 1 outcome transport, single-stage ownership & cross-stage integrity, constituent journeys & disabled journal, strict legacy separation, `lib/page-vnext-assemble.js` delegation, and live compatibility with unchanged downstream modules (`first-class-commission-intake.js`, `learning-journey-shared-source.js`, `learning-journey-unified-shell.js`, `learning-journey-workload-feasibility-adapter.js`).
- Verified **71 / 71** passing assertions across Milestone 1 + focused Interactive/Expository/shared-source/S104-M5 assembly non-regression suites (`node --check` exit 0 on all modified/new modules). Stopped for review.

### 2026-11-25 — Sprint 105 opened & Phase 105A investigation completed (documentation only)

- Suspended Sprint 104 at live acceptance (`S104-D04`), inspected Interactive/Expository partial-page infrastructure, mapped LJ stage ownership, pinpointed Step 5 runner-guidance and continuity defects, and produced Sprint 105 documentation pack.
