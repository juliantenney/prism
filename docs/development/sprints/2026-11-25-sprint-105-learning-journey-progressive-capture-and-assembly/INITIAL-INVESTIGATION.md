# Sprint 105 — Phase 105A Initial Investigation

**Sprint:** 105 — Learning Journey Progressive Capture and Assembly  
**Date:** 2026-11-25  
**Baseline:** `f1f1269` (Sprint 104 M1–M5 complete & committed)  
**Scope:** Tightly focused read-only architectural investigation (`105A`). Architectural direction (progressive structured capture + deterministic assembly) is already agreed; no alternative architectures were evaluated.

---

## 1. Existing progressive capture & assembly precedent (Interactive & Expository)

PRISM already implements a mature, battle-tested progressive capture and deterministic assembly architecture originally built for **Interactive** (Sprint 58) and cleanly extended to **Expository** (Sprint 85/87):

### 1.1 Deterministic assembler (`lib/page-vnext-assemble.js`)
- `STAGE_ORDER` (`lib/page-vnext-assemble.js:20–32`) and `STAGE_CANONICAL_STEP_IDS` (`lib/page-vnext-assemble.js:34–45`) register product-specific partial stages in strict canonical order:
  - Interactive / Practice: `episode_plan` → `dla` → `gam` → `learning_sequence` → (`assessment_design` / `assessment_items`) → `design_page`.
  - Expository: `expository_journey_plan` → `expository_development` → `expository_materials` → `design_page`.
- **Strict stage ownership enforcement:** `DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS` (`48–58`) and `EXPOSITORY_DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS` (`64–74`) explicitly restrict what Step 5 (`design_page`) can patch onto the assembled page (`applyTopLevelPatch`). For Expository, `sections[]` belong exclusively to `EJP`/`XD`/`XM`; Step 5 cannot overwrite them. For Interactive, upstream `episode_plan` and `dla` titles cannot be overwritten by downstream stages (`mergeActivitiesById`, `530–585`), with explicit diagnostics when a model attempts an overwrite.
- `mergeAssemblyState` records `enriched_by[]` and `current_stage` cleanly across partials, and `validateAssembledPageForRender` (`801–855`) validates the assembled output before handing it to renderers/export.

### 1.2 Workflow routing & assembly (`app.js`)
- `isPartialPageOutputWorkflowEnabled(wf)` (`app.js:14075–14084`) enables partial-page routing when `isPageEnrichmentV2WorkflowEnabled(wf)` and `outputSpec.partialPageOutputs` (or Expository V2) is set.
- `resolvePageForRenderOrAssembly(parsed, wf, options)` (`app.js:13015–13188`) reads each stage's stored capture via `readWorkflowStepCaptureByCanonicalId` (`captures` / `capturesRaw`, preferring raw), parses each partial, and invokes `assembleMod.assembleVNextPageFromPartials(...)`. Notice how Expository (`13081–13110`) already runs as a clean sibling branch inside this exact function.
- `workflowStepProducesStoredArtefact(step, wf)` (`app.js:11246–11253`) already returns `true` for every step with a non-empty `outputName` — meaning **all five Learning Journey steps already participate in `state.workflowRunCapturedOutputs`, `workflowRunCapturedOutputsRaw`, `workflowRunCaptureRefs`, and IndexedDB persistence!**
- **Why Learning Journey failed:** Learning Journey currently bypasses this entire mechanism:
  - `lib/first-class-workflow-family.js:46–82, 939–988` builds LJ workflows without `partialPageOutputs: true`.
  - Steps 1–4 emit long free-form markdown prose (Step 4 alone asks for **11 sections** including 21 bullets per commission, generating ~14,000 words on the 90-min Economics brief).
  - `app.js:7845–7890` (`readAcceptedLearningJourneyPageFromWorkflow`) reads **only** `step_design_page` (`learning_journey_page`) as a single monolithic JSON blob.
  - `app.js:7895–7985` (`orchestrateLearningJourneyDesignPageRunStage`) explicitly marks Step 5 as same-chat monolithic synthesis (`localAssemblerInvoked: false`), forcing the model to re-author every commission, outcome block, continuity contract, shared corpus, section, and Journal spec in one response — hitting output-length limits.

---

## 2. Final Learning Journey Design Page contract & stage-by-stage field ownership map

Every field in the existing final Learning Journey Design Page contract (`lib/learning-journey-design-page.js:876–976, 1117–1346`) and its downstream consumers (`lib/first-class-commission-intake.js`, `lib/learning-journey-shared-source.js`, `lib/learning-journey-unified-shell.js`, `lib/learning-journey-learner-package.js`, `lib/learning-journey-workload-feasibility-adapter.js`) maps cleanly to one originating stage:

### 2.1 Complete field ownership & authority mapping

| Final LJ Design Page Field | Originating Authoritative Stage | Downstream Consumers | Notes / Determinism |
| -------------------------- | ------------------------------- | -------------------- | ------------------- |
| `artifact_type: "page"`, `schema_version: "2.0.0"`, `product_id: "learning_journey"`, `activities: []` | **Deterministic assembler** (constant envelope) | All validators, renderers, unified shell, intake | Assembled deterministically; never relies on model re-typing boilerplate |
| `assembly_state` (`current_stage: "design_page"`, `enriched_by: [...]`, `calls_model: true`) | **Deterministic assembler** (merged across stages 1–5) | Validation & inspection metadata | Records all contributing LJ stages cleanly |
| `commissions[].journey_context_text` → `<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>> ... <<<JOURNEY_LEARNING_OUTCOMES_END>>>` | **Stage 1 (`step_journey_requirements`)** `learning_outcomes` (DLO shape), filtered by optional Stage 4 `relevant_journey_outcome_indices` (default: full Stage 1 set) | Child intake (`first-class-commission-intake.js` contextual journey outcomes), `validateLearningJourneyDesignPage` | **Major economy win:** Stage 1 captures DLO `learning_outcomes` once as structured JSON; Stage 4 does **not** paste the JSON block 6× into every commission; assembler injects it deterministically and fails closed on conflict |
| `learning_journey.allocated_minutes` | **Author brief / Stage 1** echoed, **Stage 4 (`step_journey_commissioning`)** reconciled (`sum(commissions[].allocated_minutes) === journey_allocated_minutes`) | `reconcileLearningJourneyDesignPageDurations`, `learning-journey-workload-feasibility-adapter.js`, unified shell | Preserves Sprint 104 M1 authoritative duration invariant; Step 5 cannot mutate |
| `shared_authoritative_material` (`{ status: "generated"\|"provided"\|"none", content }`) | **Stage 4 (`step_journey_commissioning`)** (or user-provided `source_context` preserved verbatim) | `lib/learning-journey-shared-source.js` write-once onto parent `source_context`, child commission intake, `validateLearningJourneyDesignPage` | Captured once at Stage 4 directly in structured JSON (no prose marker + Step 5 copy-paste); Step 5 cannot emit or modify |
| `commissions[]` (`commission_id`, `section_id`, `order`, `title`, `product_id`, `status`, `allocated_minutes`, `specification_text` [including `<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>` for supported], `journey_context_text` [established scenario facts / explicit no-recurring-scenario, preceding activities, bring-forward], `dependencies`) | **Stage 4 (`step_journey_commissioning`)** | Preview contract, single & batch component creation, `first-class-commission-intake.js`, `learning-journey-unified-shell.js`, workload feasibility | Emitted **once** in structured JSON at Stage 4; replaces 11-section 14,000-word prose dump; Step 5 never touches `commissions[]` |
| `learning_journey.continuity` | **Stage 4 (`step_journey_commissioning`)** | `validateLearningJourneyDesignPage`, author inspection | Concise journey-level continuity summary owned by Stage 4 |
| `learning_journey.journal.enabled` & authoritative ordered `learning_journey.journal.entries[]` identity (`entry_id`, `order`, `title`, `artefact_id`) | **Stage 4 (`step_journey_commissioning`)** (grounded in Stage 1–3 journal notes) | `learning-journey-unified-shell.js`, Journal producer/consumer validation, `validateLearningJourneyDesignPage` | Stage 4 owns inclusion decision, `decision_basis`, and exact ordered `entry_id` + `{commission_id}.{elicitation_id}` bindings; Step 5 cannot add, drop, reorder, or rename `artefact_id` |
| `learning_journey.journal.title` & `learning_journey.journal.entries[].framing` | **Stage 5 (`step_design_page`)** (optional editorial polish; defaults/fallback from Stage 4 if Stage 4 supplied framing) | `learning-journey-unified-shell.js` Journal page rendering | Clean separation: Stage 4 owns structural bindings, Stage 5 owns learner-facing editorial framing |
| `title` (concise publication-quality learner-facing journey title) | **Stage 5 (`step_design_page`)** | Unified shell home/zip basename, preview, page header | Genuinely new learner-facing synthesis |
| `editorial_opening_image` (`{ decision: "generate"\|"skip", subject, context, caption_intent, alt_text: "", detailed_description, skip_reason }`) | **Stage 5 (`step_design_page`)** | Image generation pipeline, unified shell home hero, `validateLearningJourneyDesignPage` | Genuinely new learner-facing visual synthesis |
| `sections[]` (`journey_intro` + 1:1 ordered `exp_N` sections matching Stage 4 `commissions[].section_id` & `order` + optional closing section; each `{ section_id, title, order, exposition }`) | **Stage 5 (`step_design_page`)** (constrained by Stage 4 `commissions[].section_id` & `order`) | `learning-journey-unified-shell.js` home overview & experience framing cards, preview, `validateLearningJourneyDesignPage` | Genuinely new learner-facing prose; validator enforces exact 1:1 `section_id`/`order` match against Stage 4 commissions |
| `learning_journey.design_intent` | **Stage 5 (`step_design_page`)** (concise synthesis across Stages 1–4) | `validateLearningJourneyDesignPage`, author inspection | Concise 2–4 sentence synthesis of the finished journey rationale |

### 2.2 Stage 1–3 structured authoring artefacts (upstream authority without final-page bloat)

Stages 1, 2, and 3 produce **durable, validated JSON partials** that govern downstream design without bloating the final Design Page:

- **Stage 1 (`learning_requirements`):** `artifact_type: "learning_journey_stage"`, `stage: "learning_requirements"`, `schema_version: "1.0.0"`, `journey_allocated_minutes`, `learning_outcomes` (canonical DLO object), `requirements` (`learners`, `purpose`, `body_of_knowledge`, `capabilities[]`, `dependencies[]`, `constraints_and_implications`, `trade_offs[]`, `journal_consideration`).
- **Stage 2 (`learning_progression`):** `artifact_type: "learning_journey_stage"`, `stage: "learning_progression"`, `schema_version: "1.0.0"`, `journey_structure` (`mode: "single"|"constituent"`, `rationale`, optional `constituent_journeys[]`), `developmental_phases[]` (`phase_id`, `title`, `purpose`, `builds_on`, `learner_development`, `experience_types[]`, `indicative_minutes`, `scaffolding_and_fading`, `evidence_and_feedback`, `dependencies[]`), `overall_developmental_arc`, `journal_progression_note`. (Sum of `indicative_minutes` checked deterministically against Stage 1 `journey_allocated_minutes`!)
- **Stage 3 (`learning_elements`):** `artifact_type: "learning_journey_stage"`, `stage: "learning_elements"`, `schema_version: "1.0.0"`, `elements[]` (`element_id`, `phase_id`, `title`, `educational_job`, `builds_on`, `learner_experience`, `knowledge_focus`, `indicative_minutes`, `evidence_and_feedback`, `scaffolding`, `dependencies[]`, `journal_producer_candidate`), `architecture_notes`. (Every `phase_id` checked against Stage 2; per-phase and total `indicative_minutes` checked deterministically!)
- **Stage 4 (`learning_commissions`):** `artifact_type: "learning_journey_stage"`, `stage: "learning_commissions"`, `schema_version: "1.0.0"`, `journey_allocated_minutes`, `shared_authoritative_material`, `commissions[]` (canonical final-page commission fields + `element_ids[]` + optional `relevant_journey_outcome_indices[]`), `continuity`, `journal` (`enabled`, `decision_basis`, `entries[]`), concise `commissioning_rationale` & `product_capability_observations`. (Deterministic validation checks element coverage, parent duration reconciliation, `sum(allocated_minutes) === journey_allocated_minutes`, supported `<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>`, continuity contract, no `interactive` on new journeys, and journal binding discipline.)
- **Stage 5 (`learning_journey_page` partial):** `artifact_type: "page"`, `schema_version: "2.0.0"`, `product_id: "learning_journey"`, `title`, `editorial_opening_image`, `sections[]`, `learning_journey: { design_intent, journal?: { title?, entries?: [{ entry_id, framing }] } }`, `assembly_state: { current_stage: "design_page", enriched_by: ["design_page"], calls_model: true }`.

### 2.3 Expected output economy impact

| Stage | Pre-105 Output Shape | Sprint 105 Progressive Partial Shape | Reduction / Risk Impact |
| ----- | -------------------- | ------------------------------------ | ----------------------- |
| Steps 1–3 | Unstructured long essays (not validated beyond Step 1 DLO block) | Concise structured JSON partials (~600–1,800 words each) | Validated immediately on paste; arithmetic & phase/element references checked deterministically |
| Step 4 | **~14,000 words** (11 prose sections + 21 bullets/commission + 2 embedded marker blocks) | Direct structured JSON `commissions[]` + `shared_authoritative_material` + `journal` + concise rationale (~2,500–4,500 words; zero prose checklists; zero 6× journey-outcome duplication) | **~70%+ reduction** in Step 4 volume; eliminates prose-to-JSON translation loss |
| Step 5 | Monolithic full LJ Design Page JSON (failed output-length limit!) | Thin learner-facing synthesis partial only (`title`, `editorial_opening_image`, `sections[]`, `design_intent`, optional journal `framing` — **~600–1,200 words**) | **~85–90% reduction** in Step 5 output; makes output-length failure structurally impossible |

---

## 3. Reusable infrastructure vs genuinely LJ-specific requirements

### 3.1 Directly reusable PRISM infrastructure

1. **Deterministic partial assembly pattern (`lib/page-vnext-assemble.js`):** Extend `STAGE_ORDER` and `STAGE_CANONICAL_STEP_IDS` (exactly as Sprint 85 did for Expository) and apply strict owned-field patching (`LEARNING_JOURNEY_DESIGN_PAGE_OWNED_TOP_LEVEL_FIELDS`) with forbidden-field rejection.
2. **Workflow partial-output routing (`app.js:14075`, `13015–13188`):** Reuse `isPartialPageOutputWorkflowEnabled(wf)` and add a Learning Journey branch in `resolvePageForRenderOrAssembly` alongside Expository and Interactive/Practice.
3. **Per-step capture storage & reload persistence (`app.js:11246`, `state.workflowRunCapturedOutputs`, `workflowRunCapturedOutputsRaw`, `workflowRunCaptureRefs`, IndexedDB):** Already enabled for all 5 LJ steps because every step has an `outputName` (`workflowStepProducesStoredArtefact` returns `true`).
4. **Clear run data (`app.js:31155–31265` `clearWorkflowRunCaptureState`):** Existing epoch bump, persist-chain cancellation, capture map clearing, and IndexedDB wipe can be reused directly, with targeted LJ cleanup hooks added.
5. **Existing LJ final-page & downstream validators (zero rewrite needed):**
   - `lib/learning-journey-design-page.js` (`validateLearningJourneyDesignPage`, `reconcileDesignPageCommissionDurations`, `renderCommissionContractHtml`)
   - `lib/learning-journey-shared-source.js` (write-once `source_context` lock and mismatch detection)
   - `lib/learning-journey-workload-feasibility-adapter.js` (Sprint 104 M5 authoritative duration & feasibility checks)
   - `lib/first-class-commission-intake.js`, `lib/learning-journey-unified-shell.js`, `lib/learning-journey-learner-package.js` (downstream consumers remain completely untouched).

### 3.2 Genuinely Learning-Journey-specific requirements

1. **LJ stage partial schemas & validators (Stages 1–4 + thin Stage 5):** Interactive/Expository partials are all partial `artifact_type: "page"` shells seeded from an Episode Plan / EJP. Learning Journey Stages 1–3 are pedagogical design stages (Requirements, Progression, Elements) whose payloads do not map 1:1 to `activities[]` or `sections[]`, while Stage 4 owns `commissions[]` + `shared_authoritative_material` + `journal` identity + `allocated_minutes`, and Stage 5 owns `sections[]` + `title` + `editorial_opening_image` + `design_intent`. A dedicated LJ stage validator & assembler module (`lib/learning-journey-assemble.js`, invoked by `lib/page-vnext-assemble.js` and `app.js`) keeps `lib/page-vnext-assemble.js` clean and avoids polluting Interactive/Expository logic.
2. **Deterministic Stage 1 → Stage 4 journey-outcome injection:** Injecting Stage 1's authoritative DLO `learning_outcomes` as `<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>> ... <<<JOURNEY_LEARNING_OUTCOMES_END>>>` inside each assembled `commissions[].journey_context_text` (respecting optional Stage 4 `relevant_journey_outcome_indices`).
3. **Structured Stage 4 → parent `deliverySeed` synchronisation & clean reset:** Currently `app.js:31930–32025` extracts Stage 4 `shared_authoritative_material` and `commissioned_component_durations` onto `wf.deliverySeed`. Under progressive capture:
   - Stage 4 JSON capture directly supplies both without marker-in-prose parsing (while retaining marker extraction for legacy workflows).
   - **Clear run data** and **Workflow duplication** (`app.js:40483–40519` `handleDuplicateWorkflow`) must cleanly reset **run-derived** `deliverySeed` fields (generated `source_context` and `commissioned_component_durations`), while preserving **author-supplied** `deliverySeed.source_context` (from the initial brief), `topic`, `audience`, `learning_time`, `duration`, `constraints`, `duration_contract_version`, and `original_brief`.
4. **Upstream stage invalidation on edit / re-capture:** Unlike Interactive's `recomposeWorkflowPageCapturesFromUpstream` (`app.js:59587`), which only recomposes Design Page when activities change, editing or re-capturing an earlier LJ stage (e.g., Stage 1 outcomes, Stage 2 phases, Stage 3 elements, or Stage 4 commissions/durations/shared material) must:
   - Mark downstream LJ stages stale / clear their `workflowRunStepCompleted` readiness (or fail validation cleanly if downstream captures reference removed/changed `phase_id`, `element_id`, `section_id`, `commission_id`, or `allocated_minutes`),
   - Invalidate cached `assembledPageSnapshot` and derived run metadata (`commissioned_component_durations`, generated `source_context` if Stage 4 is re-captured or cleared),
   - Re-assemble deterministically whenever valid Stage 1 + Stage 4 + Stage 5 captures are present (never serving a stale cached monolithic page).
5. **Compact upstream prompt handoff (same-chat economy):** In progressive LJ mode, `buildWorkflowStepInstructions` (`app.js:42150–42200`) must **not** dump full verbose upstream JSON back into prompts when running in the same Copilot conversation (following Interactive/Practice/Expository V2 convention: `"PRISM does not embed stored prior step outputs in this mode. Use Copilot conversation context for upstream continuity."`), except compact authoritative anchors needed when starting a fresh chat or enforcing Stage 4 → Stage 5 exact `section_id`/`commission_id`/`entry_id` parity (a tiny ~10-line summary table of `commission_id` + `section_id` + `order` + `title` + `entry_id`/`artefact_id`, never the full `specification_text` or `shared_authoritative_material`!).
6. **Legacy monolithic LJ dual-read:** `readAcceptedLearningJourneyPageFromWorkflow` (`app.js:7845–7890`) must inspect whether the workflow is progressive (`isProgressiveLearningJourneyWorkflow(wf)` and/or has structured Stage 4 + thin Stage 5 captures) vs legacy monolithic (no progressive flag, or Step 5 capture already contains full `commissions[]` + `shared_authoritative_material`). Legacy workflows continue working identically without forced migration.

---

## 4. Confirmed defects to fix in Sprint 105

### 4.1 Generic Design Page `Runner guidance` conflict in LJ Step 5
- **Confirmed location:** `app.js:42117–42128`:
  ```js
  var runnerInstructions =
    (workflowRecordIsAssessmentPack(wfForChain) ||
      workflowRecordIsSituatedTask(wfForChain) ||
      isSituatedTaskWorkflow(wfForChain)) &&
    isWorkflowStepDesignPage({ ... })
      ? null
      : getRunnerInstructionsForStep(step);
  ```
- **Observed bug:** Assessment Pack and Situated Task explicitly suppress generic `step_design_page` `runnerInstructions`, **but Learning Journey (`workflowRecordIsLearningJourney` / `isLearningJourneyWorkflow`) was omitted**.
- **Runtime impact:** `getRunnerInstructionsForStep(step)` (`app.js:1905–1948`) pulls the Interactive Design Page pattern from `domains/learning-design/domain-learning-design-step-patterns.md:2696–2697`:
  > *"Emit Design Page owned wrapper prose as page_synthesis on a partial v2 page artefact. activities[] and activities[].materials[] are already hydrated upstream..."*
  > *"page_synthesis object with knowledge_summary mandatory... visual_affordance_schema_version 38.4 present; activities_visual_review[] present; visual_affordances[] present..."*
  This directly contradicts Learning Journey's own Step 5 contract (which explicitly forbids `page_synthesis`, `visual_affordance_schema_version`, `activities_visual_review`, and `visual_affordances`).
- **Fix:** Suppress generic Interactive `runnerInstructions` for Learning Journey `step_design_page` (matching Assessment Pack and Situated Task) and emit concise, LJ-specific Step 5 runner guidance if desired — zero Interactive `page_synthesis` / `visual_affordances` leakage.

### 4.2 Residual outdated learner artefact continuity guidance
- **Confirmed locations:**
  1. `lib/learning-journey-design-page.js:848`:
     > `"- claim that PRISM transfers, retrieves, or makes stored answers / previous published outputs available across components;"`
  2. `lib/learning-journey-design-page.js:965`:
     > `"If stating the no-access limitation, use that approved phrasing — do not claim automatic transfer, retrieval, inspection of previous published outputs, or availability of stored answers..."`
  3. `lib/learning-journey-design-page.js:574–770` (`AUTOMATIC_RESPONSE_ACCESS_PHRASES`, `AUTOMATIC_ACCESS_NEGATION_PHRASES`, `collectLearningJourneyContinuityErrors`): Sprint 94 WP2 capture-time continuity denylist still rejects phrases such as `"stored answers are available"` / `"automatically retrieve"` indiscriminately, reflecting pre-Sprint 95/96/103 single-page limitations.
  4. `lib/learning-journey-sibling-prompts.js:27` (`learning_commissions` Bring-Forward rule): already more accurate (*"Do not state whether or how the delivery environment transfers, saves, or retrieves learner responses — delivery explains availability. Do not invent response-aware runtime adaptation or imply that an earlier version/snapshot of a learner's response is preserved beside a later revision"*), creating a subtle conflict with Step 5's older prohibition.
- **Actual current PRISM runtime truth (post-Sprints 95, 96, 97, 103):**
  - **What PRISM DOES NOT do (still strictly prohibited in prompts & validators):**
    - Authoring/generation models for later components **do not inspect** previous published outputs or individual learner responses.
    - Published pages **do not perform** response-aware runtime adaptation, AI marking/branching on prior answers, or automatic transfer of arbitrary undeclared answers.
    - Published pages **do not preserve** earlier pre-feedback snapshots alongside a learner's revised editable response.
  - **What PRISM DOES do at unified LJ runtime (must not be falsely contradicted):**
    - When commissioned and bound via declared `{commission_id}.{elicitation_id}` producer/consumer contracts, the unified Learning Journey runtime **does** display a learner's own saved constructed-text artefact read-only inside designated later components and assembles declared producer artefacts in the Learning Journal.
- **Fix:** Reconcile both prompt text (`lib/learning-journey-sibling-prompts.js`, `lib/learning-journey-design-page.js`) and capture-time validator rules (`collectLearningJourneyContinuityErrors` in `lib/learning-journey-design-page.js`) so:
  - Positive claims of **authoring-time inspection of previous published outputs**, **response-aware runtime adaptation / AI grading of prior responses**, **automatic transfer of arbitrary stored answers**, or **preserved pre-feedback snapshots** remain strictly rejected;
  - Accurate educational bring-forward descriptions and declared `{commission_id}.{elicitation_id}` artefact / Journal references are cleanly permitted without forcing outdated "PRISM cannot make earlier learner work available" phrasing.

---

## 5. Assessment: Can the current incomplete Economics run be recovered without regeneration?

### Verdict: **Not cleanly / not recommended for production recovery; preserve it untouched and run a fresh clean Economics LJ under Sprint 105.**

### Evidence & technical reasoning
1. **Where the incomplete run lives:** No incomplete Economics regeneration files exist in the git workspace (`Glob` confirmed zero workspace files); the incomplete run lives in the browser workflow/IndexedDB state and Copilot chat thread.
2. **What the incomplete run contains:**
   - Steps 1–4 were authored under the pre-105 prose contract: markdown essays in Steps 1–3 (with a structured `<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>>` JSON block in Step 1) and an approximately **14,000-word markdown prose document** in Step 4 (with `<<<SHARED_AUTHORITATIVE_MATERIAL_BEGIN>>>` and `<<<COMMISSION_DURATIONS_BEGIN>>>` blocks).
   - Step 5 failed due to output-length limits, so there is no valid monolithic Step 5 `learning_journey_page` JSON capture.
3. **Why direct zero-regeneration recovery is not viable:**
   - Deterministic assembly under Sprint 105 requires **validated structured JSON partials** — specifically Stage 4's structured `commissions[]` (`specification_text` with per-commission `<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>`, `journey_context_text`, `dependencies`, `section_id`, `product_id`, `status`, `allocated_minutes`), `shared_authoritative_material`, and `journal` producer bindings.
   - Converting 14,000 words of free-form markdown prose into structured `commissions[]` JSON deterministically in code would require a brittle one-off markdown scraper that violates PRISM's no-prose-parsing-fallback principle (`S104-D02` Principle A) and risks silently corrupting component outcomes, scenario continuity, or Journal bindings.
   - Even an AI-assisted backfill in the existing Copilot thread (re-running Stage 4 in compact JSON mode + Stage 5 thin partial) would still regenerate Stage 4 and Stage 5 anyway — AND would **fail to validate** Sprint 105's actual end-to-end Stages 1–5 economy or Sprint 104 Milestone 7's clean regeneration behaviour.
4. **Recommendation:**
   - **Preserve both** the original pre-intervention Economics baseline **and** the current incomplete Sprint 104 regeneration untouched (as historical failure evidence).
   - Once Sprint 105 implementation is complete, execute a **fresh clean Economics Learning Journey run** (same authoritative brief, 90 minutes, 2 weeks) through progressive Steps 1–5. That simultaneously validates:
     1. Sprint 105 end-to-end progressive capture, economical stage sizing, and deterministic final assembly, and
     2. Sprint 104 Milestone 7 clean regeneration, baseline comparison, educational QA, and unified learner-runtime acceptance.
