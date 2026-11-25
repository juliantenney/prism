# Sprint 105 — Charter

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Status:** **CLOSED — COMPLETE (2026-11-25)** — see [SPRINT-105-CLOSURE.md](SPRINT-105-CLOSURE.md)  
**Opened:** 2026-11-25 · **Closed:** 2026-11-25  
**Baseline:** `f1f1269` (opened) → `a7ad249` (implementation complete; closed per `S105-D04`)  
**Handback target:** [Sprint 104 — Workload Fidelity and Proportionate Authoring](../2026-11-24-sprint-104-workload-fidelity-and-proportionate-authoring/SPRINT-104-START-HERE.md) (resumed at live acceptance via `S104-D05`)

---

## 1. Trigger and problem statement

During Sprint 104 live validation regeneration of the 90-minute *Correlation and Causation: Making Sense of Economic Evidence* Learning Journey:

- Steps 1–4 established the full educational design only in AI conversational prose, with **Step 4 (`Commissioning`) generating approximately 14,000 words**.
- **Step 5 (`Design Page`)** then had to synthesise and re-emit the entire monolithic final Learning Journey Design Page JSON (`shared_authoritative_material`, `sections[]`, `commissions[]` with full `specification_text`, `<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>`, `journey_context_text`, `<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>>`, `dependencies`, `allocated_minutes`, `learning_journey.journal`, and `editorial_opening_image`) in one response, and **failed due to output-length limitations**.

This is the exact same architectural class previously encountered in **Interactive** (Sprint 58) and subsequently solved cleanly for **Expository** (Sprint 85/87): monolithic final-step capture breaks under realistic educational richness.

## 2. Agreed architectural direction

The architectural direction is agreed (`S105-D01`): **do not investigate alternative architectures**.

1. **Retain the existing 5-stage Learning Journey educational design process:**
   - Stage 1: `Requirements` (`step_journey_requirements` / `learning_requirements`)
   - Stage 2: `Progression` (`step_journey_progression` / `learning_progression`)
   - Stage 3: `Elements` (`step_journey_elements` / `learning_elements`)
   - Stage 4: `Commissioning` (`step_journey_commissioning` / `learning_commissions`)
   - Stage 5: `Design Page` (`step_design_page` / `learning_journey_page`)
2. **Move to progressive structured capture, validation, persistence, and deterministic final assembly**, reusing established PRISM partial-page mechanisms developed for Interactive (`lib/page-vnext-assemble.js`, `app.js` partial-capture orchestration/persistence/clear-run) and adopted by Expository wherever appropriate.
3. **Single-stage field authority:** Each stage owns its authoritative information. Later stages must **never** regenerate established outcomes, shared material, allocations, commission specifications, continuity contracts, or other upstream-owned data.
4. **Economical stage contracts:** Prompts and structured stage outputs must be lean and non-repetitive — eliminating multi-section prose repetition in Stage 4 and eliminating full-page re-serialization at Stage 5.
5. **Preserve the final Learning Journey Design Page contract identically:** The deterministically assembled page must preserve `artifact_type: "page"`, `schema_version: "2.0.0"`, `product_id: "learning_journey"`, `activities: []`, `shared_authoritative_material`, `editorial_opening_image`, `sections[]`, `commissions[]`, `learning_journey`, and `assembly_state`, leaving all downstream commissioning, intake, batch/single component creation, artefact continuity, Journal, delivery, unified publishing, and preview behaviour intact.
6. **Complete operational lifecycle parity:** Stage invalidation, reload persistence, workflow duplication, clearing run data, and legacy monolithic-capture workflow compatibility must follow established PRISM patterns.
7. **Fix two confirmed Learning Journey authoring defects in scope:**
   - Suppress the generic Interactive Design Page `Runner guidance` currently injected into LJ Step 5 Copy prompts (`app.js:42117–42128` → `domains/learning-design/domain-learning-design-step-patterns.md:2696`).
   - Reconcile residual outdated learner artefact continuity guidance (`lib/learning-journey-design-page.js:574–770, 848, 965` and `lib/learning-journey-sibling-prompts.js:27`) so prompts and capture validators accurately distinguish **authoring-time non-inspection / no response-aware adaptation / no pre-feedback snapshots** from **unified LJ runtime read-only learner artefact availability (`{commission_id}.{elicitation_id}` and Learning Journal)**.

## 3. Hard invariants

- **Final LJ Design Page contract unchanged:** No breaking schema changes to downstream consumers (`lib/learning-journey-design-page.js` final validation, `lib/first-class-commission-intake.js`, `lib/learning-journey-unified-shell.js`, `lib/learning-journey-learner-package.js`, `lib/learning-journey-shared-source.js`, `lib/learning-journey-workload-feasibility-adapter.js`).
- **Sprint 104 M1–M5 preserved:** Authoritative duration transport (`allocated_minutes`, `journey_allocated_minutes`, `duration_contract_version: "s104_m1"`), Practice Episode Plan authority, downstream Practice reconciliation, proportionate commissioning, and workload estimation remain intact.
- **Legacy Learning Journeys preserved:** Existing pre-Sprint 105 workflows with monolithic Step 5 captures continue to open, validate, preview, commission, and publish without forced migration.
- **Other product families untouched:** Interactive, Practice, Expository, Assessment Pack, and Situated Task workflows remain unaffected.
- **Economics evidence preserved:** Both the original pre-intervention Economics baseline (`c01-page.json`, `c01-zip/`, `c02-page.json`, `tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`, and external captures) and the current incomplete Sprint 104 regeneration remain untouched.
- **Programme invariants:** Assessment Pack remains non-summative; constituent LJ products remain standalone-publishable; no implicit sharing of all learner responses; no AI marking of shared artefacts; author LJ download remains unified-only (`S96-D14`).

## 4. Explicit non-goals

- Redesigning the 5-stage Learning Journey educational methodology or changing stage count.
- Investigating alternative architectures (e.g., server-side orchestration, multi-turn chunked Step 5 replay, or prose-to-JSON scraping).
- Modifying Practice, Expository, Interactive, Assessment Pack, or Situated Task authoring contracts.
- Pulling in `PB-S-008` pre-existing full-suite technical debt or `PB-FA-018` statistical visualisation architecture.
- Building a production prose-migration parser to recover the incomplete 14,000-word Economics run.

## 5. Exit criteria & handback

Sprint 105 closes when:

1. Progressive structured capture, validation, persistence, invalidation, clear-run, duplication, legacy compatibility, and deterministic final assembly are implemented and verified with focused tests across all 5 LJ stages and downstream consumers.
2. Both confirmed defects (LJ Step 5 generic runner-guidance leak and outdated learner artefact continuity phrasing/validator drift) are fixed and regression-tested.
3. A fresh clean live Learning Journey authoring run (re-validating the 90-minute Economics brief while preserving both the original baseline and the incomplete regeneration) completes Steps 1–5 cleanly without output-length failure and produces a valid assembled Design Page ready for commissioning and unified publish.
4. Sprint 104 live acceptance (**Milestones 6–7** + **Milestone 1** manual integrated acceptance) is unblocked and handed back cleanly.
