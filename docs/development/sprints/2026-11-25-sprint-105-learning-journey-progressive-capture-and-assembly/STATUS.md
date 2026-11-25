# Sprint 105 — Status / work log

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Status:** **OPEN — MILESTONE 1 IMPLEMENTED & FOCUSED-VERIFIED (STOPPED FOR REVIEW)**  
**Opened:** 2026-11-25  
**Baseline:** `f1f1269` (Sprint 104 M1–M5 committed)  
**Priority:** Takes priority **before Connect More** (Wed 2 Dec 12:00)  
**Decisions:** [S105-D01](decisions.md#s105-d01--open-sprint-105--learning-journey-progressive-capture-and-assembly) · [S105-D02 (Accepted)](decisions.md#s105-d02--stage-authority-progressive-capture-and-deterministic-assembly-contract)

| Item | State |
| ---- | ----- |
| Sprint 104 suspension (`S104-D04`) | **Complete** (M1–M5 preserved at `f1f1269`; M6–M7 & M1 live acceptance preserved) |
| Programme pointers & dependencies updated | **Complete** (`NEXT-SPRINT.md`, `docs/sprints/README.md`, `sprint-104-*.md`, `sprint-105-*.md`, `PRODUCT-BACKLOG.md`, `docs/backlog/README.md`) |
| **Phase 105A** — Initial investigation & sprint documentation | **Approved** (`S105-D02` accepted with 9 refinements) |
| **Milestone 1** — Stage contracts, deterministic LJ assembler, workflow versioning & legacy separation | **Implemented & focused-verified (uncommitted — stopped for review)** |
| **Milestone 2** — Economical Stage 1–5 prompts, Step 5 runner-guidance fix & continuity guidance reconciliation | **Gated on Milestone 1 review** |
| **Milestone 3** — Run orchestration, stage validation, invalidation, reload persistence, clear-run & workflow duplication | **Gated on Milestone 2 review** |
| **Milestone 4** — Focused regression verification, live clean Economics LJ validation & handback to Sprint 104 M6–M7 | **Gated on Milestone 3 review** |

---

## Work log

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
