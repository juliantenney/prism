# Sprint 104 — Implementation map

**Status:** **OPEN — MILESTONES 1 (`c461770`), 2 (`9db45bf`), 3 (`53bd50c`), & 4 (`43db3f4`) COMMITTED / MILESTONE 5 IMPLEMENTED & VERIFIED**  
**Charter:** [SPRINT-104-CHARTER.md](SPRINT-104-CHARTER.md)  
**Decisions:** [S104-D01](decisions.md#s104-d01--open-sprint-104--workload-fidelity-and-proportionate-authoring) · [S104-D02](decisions.md#s104-d02--architectural-agreement-principles-a-e-and-separately-gated-milestones) · [S104-D03](decisions.md#s104-d03--milestone-2-multi-lo-compatibility-and-milestone-3-contract-reconciliation)  
**Investigation:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md)

---

## Separately gated milestone sequence

```text
104A  Investigation, C04 trace, C01/C03/C05 comparison, audit           COMPLETE (f3bb47d)
M1    Authoritative duration transport only (all 4 products + legacy)   COMMITTED (c461770; manual live pending)
M2    Practice Episode Plan design authority (AI-authored, validated)   COMMITTED (9db45bf)
M3    Reconciliation of downstream Practice contracts                   COMMITTED (53bd50c)
M4    Proportionate Learning Journey commissioning                      COMMITTED (43db3f4)
M5    Workload estimation corrections                                   IMPLEMENTED & VERIFIED (uncommitted)
M6    Live 5-, 15-, and 30-minute Practice sensitivity probes           GATED on M5
M7    90-min Economics regeneration, comparison, QA & learner runtime   GATED on M6
```

---

## Milestones

| Milestone | Scope | Agreed Principle(s) | State |
| --------- | ----- | ------------------- | ----- |
| **104A** | Pipeline trace (`C04`), systemic check (`C01`, `C03`, `C05`), contracts/validators audit | Read-only baseline | **Complete (`f3bb47d`)** |
| **M1** | Canonical Step 4 origin (`<<<COMMISSION_DURATIONS_BEGIN>>>` / `allocated_minutes`) → Step 5 Design Page → commission envelope → intake → `deliverySeed` → `resolvedFactors` → effective run context (`Duration: N minutes`) across **Expository, Practice, Assessment Pack, Situated Task**; conflict rejection & component lock; explicit `null`/unavailable legacy handling (no prose parsing); focused tests + consumer audit | **Principle A** | **Committed (`c461770`)** |
| **M2** | Move Practice Episode Plan from deterministic archetype templates to AI-authored, deterministically validated Episode Plans (Assessment Pack precedent; grammar-preserving; no duration tiers/quotas/beat targets/LO grouping; protect Interactive; assess multi-LO cohesive single activity support) | **Principle B** | **Committed (`9db45bf`)** |
| **M3** | Reconcile downstream Practice contracts (`DLA`, `GAM`, `Learning Sequence`, `Design Page`, `Guided Review`, `Population Contract`, `Scaffold`, `vNext Assembly/Renderer`) so obligations apply conditionally to EP-selected functions and redundant Interactive prescriptions (mandatory images/tips/summaries/bridges/3-criterion floors/fixed exemplars) are removed without altering standalone Interactive | **Principle C** | **Committed (`53bd50c`)** |
| **M4** | Proportionate LJ commissioning: distribute functions across journey, exploit prior learning & familiar evidence, honour consequential artefact reuse without inventing adaptation/snapshots, honour Journal-from-purposeful-performance rule, avoid arbitrary component/LO/word-count quotas or duration tiers, surface infeasible commissions cleanly, calibrate all 4 commissioned product families to authoritative duration | **Principle D** | **Committed (`43db3f4`)** |
| **M5** | Fix `learning-journey-workload-feasibility-adapter.js` precedence bug, eliminate silent `interactive-workload-feasibility-adapter.js` bypasses, restore cumulative comparison vs authoritative duration, model evidence/decisions/responses/worked examples/feedback/revision, separate familiar/new & optional load, keep warnings advisory & separate from structural duration compliance, audit Sprint 101 safeguards & arbitrary criterion caps | **Principle E** | **Implemented & verified (uncommitted)** |
| **M6** | Live **5-, 15-, and 30-minute** Practice duration sensitivity probes | **Principles A–E** | **Gated on M5 review** |
| **M7** | Regenerate original 90-min *Correlation and Causation* Economics journey (retaining baseline captures intact), baseline comparison, educational QA & learner-runtime acceptance | **Principles A–E** | **Gated on M6 review** |

---

## Milestone 1 architecture summary (Duration transport)

- **Canonical origin:** Step 4 (`learning_commissions`, `lib/learning-journey-sibling-prompts.js`) emits `<<<COMMISSION_DURATIONS_BEGIN>>>` with `journey_allocated_minutes` and `commissions: [{ commission_id, allocated_minutes }]` alongside commission specifications.
- **Step 5 Design Page (`lib/learning-journey-design-page.js`):** Carries `commissions[].allocated_minutes` (and optional `learning_journey.allocated_minutes`) verbatim; never invents or re-authors duration; rejects conflicts against Step 4 and rejects non-positive/non-integer/prose values; keeps absent `allocated_minutes` valid for legacy pages.
- **Envelope → Intake → Seeding → Runtime (`lib/first-class-commission-intake.js`, `lib/first-class-workflow-family.js`, `app.js`):** Transports structured `allocatedMinutes` cleanly into `deliverySeed.commissioned_duration_minutes`, `deliverySeed.duration_minutes`, `deliverySeed.commissioned_duration_provenance`, and `resolvedFactors`.
- **Authority & projection (`app.js`):**
  - `resolveCommissionedWorkflowDurationMinutes` prefers `commissioned_duration_minutes` over mutable/fallback `duration_minutes` and returns `null` when commissioned without structured duration (zero prose parsing).
  - `ADJUSTMENTS_CAPABILITY_RESOLVERS.interactive_duration` applies to LJ-commissioned Expository components with `commissioned_duration_minutes` while leaving standalone/legacy Expository untouched (`tests/s85-wp4-capability-preservation-closure.test.js`).
  - Component authoring and component Adjustments cannot unilaterally override LJ-owned `commissioned_duration_minutes`.
- **Downstream consumers explicitly deferred to Milestones 3–5:** Milestone 2 now delivers Practice `Design Episode Plan` AI design authority (`lib/practice-episode-plan.js` + `app.js`). Downstream Practice DLA/GAM/LS/DP contract reconciliation remains deferred to Milestone 3, commissioning proportionality to Milestone 4, and workload estimators/adapters to Milestone 5.

---

## Milestone 2 architecture summary (Practice Episode Plan design authority)

- **Module boundary (`lib/practice-episode-plan.js`, loaded after `lib/episode-plan-v1-archetype-grammar.js` in `index.html`):**
  - `resolveAuthoritativePracticeOutcomes`: resolves commissioned or upstream `learning_outcomes` with deterministic ID normalization (`id || outcome_id || learning_outcome_id || "LO" + (i + 1)`).
  - `formatPracticeGrammarSummary`: surfaces the 4 frozen archetypes, approved `FunctionEnum`, required beats/groups, phase/T1–T5 order, and terminal closure rules dynamically while explicitly forbidding fixed duration tiers, activity quotas, and beat-count targets.
  - `buildPracticeEpisodePlanPromptBody`: supplies authoritative outcomes, duration, purpose, prior learning, journey context, dependencies, shared learner artefact awareness, explicit multi-LO cohesive single-activity permission, and the v2 `page` shell schema (`product_id: "practice"`, `page_kind: "practice"`, em-dash DLA placeholders, empty `required_materials`/`materials`).
  - `validatePracticeEpisodePlanCapture`: deterministically enforces v2 `page` shell validity, Practice identity, `assembly_state.current_stage === "episode_plan"`, zero invented DLA cognition fields or non-empty `required_materials`/`materials`, 1:1 `activities[]` ↔ `episode_plans[]` pairing and `episode_plan` agreement, bidirectional outcome ID mapping without conflict, V1 grammar legality (`validateSequenceAgainstGrammar`) on every activity, 100% outcome coverage (multi-LO single cohesive activity allowed), and exact statement fidelity.
- **Runtime routing & non-overwriting (`app.js`):**
  - `resolveStepPromptText` returns `sourceType: "practice_episode_plan"` for Practice `Design Episode Plan` while retaining `v2_locked` for Interactive.
  - `isDerivedShellWorkflowStep`, `isWorkflowStepEligibleForWorkflowContextProjection`, and `buildWorkflowStepInstructions` project authoritative workflow context onto Practice `Design Episode Plan` without `"Deterministic step (Sprint 56F)"` boilerplate or derived shell embedding.
  - Practice deterministic shell instantiation, auto-population, and capture overwriting are disabled in `applyEpisodePlanCaptureCanonicalEnforcement`, `syncWorkflowRunCapturedOutputToState` (auto-repair guarded by `!isPracticeWorkflow(wf)`), `maybeAutoPopulateDesignEpisodePlanRunCapture`, `deriveDesignEpisodePlanCaptureJson`, `deriveDesignEpisodePlanCaptureJsonFromLearningOutcomes`, `resolvePageShellJsonForDlaCopy`, `tryResolveCanonicalEpisodePlansDeriveFallback`, `resolveEpisodePlansForDlaPopulation`, and `parseEpisodePlanOrPageCaptureForStorage`.
- **Multi-LO cohesive single activity compatibility:** Confirmed supported across `page-shell-create.js`, `episode-plan-population-contract.js`, `page-gam-enrich.js`, `page-vnext-assemble.js` (`assembleVNextPageFromPartials`), and `learner-renderer-vnext` (`validateInput` passes with `errors: []`, `warnings: []` while preserving `activities[0].learning_outcome_ids` and `episode_plans[0].mapped_learning_outcome_ids`).

## Milestone 3 incompatibilities identified during Milestone 2 (Reconciled in Milestone 3 — uncommitted)

All five Milestone 2 incompatibilities below are reconciled in Milestone 3 (`STATUS.md`, `VALIDATION.md`, and `S104-D03`):

1. **`lib/page-dla-enrich.js` & `app.js` unconditional cognition/scaffold/material mandates:**
   - `lib/page-dla-enrich.js:1106`, `:1462–1550`, `:2004–2280` (`DLA_OWNED_COGNITION_FIELDS`, `validateDlaEnrichedPage`) fail validation on lean Practice pages that omit `intellectual_coherence_bridge` (`activities[0].intellectual_coherence_bridge must be enriched (not placeholder em dash)`) and require `required_materials.length >= 1`.
   - `app.js:22691–22800` (`applyGuidedLearningScaffoldRepairToDlaCapture`, `applyDlaEnrichedPageHardValidationToCapture`) enforce guided-learning scaffold prose and full `validateDlaEnrichedPage` unconditionally on DLA captures regardless of Practice optionality.
   - `lib/page-dla-enrich.js:336–350` (`resolveLoStatementForActivity`) reads only the first mapped LO statement rather than combining all mapped `learning_outcome_ids` when multiple LOs share one cohesive activity.
2. **`lib/episode-plan-population-contract.js` (`FUNCTION_SPECS` `:27–135`, `AC-02` `:581–590`, `AC-09` `:653–668`):**
   - `FUNCTION_SPECS.verification` prescribes `3–4 quality dimensions (max 5)` and `AC-09` flags any `"material"`-classified beat without its own material row, conflicting with Practice's leaner combined surfaces and optional checklist/criteria rules.
3. **`lib/guided-review-generation-contract.js` (`:291, 306`) & `lib/ld-gam-page-enrich-contract.js` (`:58, 108–120`):**
   - Hard-mandate `3–4 criteria (hard maximum 5)` (`< 3` flagged as instructional FAIL, conflicting with Practice's `2–3` criteria / optional checklist contract in `lib/ld-practice-presentation-contracts.js:103, 138`) and unconditionally require `"S78-D04 page learner-resource closure packaging"` for `study_tips` transport even when Practice omits `study_tips`.
4. **`lib/page-gam-enrich.js` (`:1453–1458, 1584–1591, 1819–1824`):**
   - Unconditionally requires non-empty `required_materials[]` and `materials[]` on every activity at GAM stage.
5. **`lib/ld-practice-presentation-contracts.js` (`:140–143, 285–289`), `lib/ld-design-page-partial-contract.js` (`:83–120`), & `app.js` (`:15692–15725, 41812–41832`):**
   - Hardcode `A2-style`/`A3-style`/`A4-style` exemplars in `controlLedJustificationLines()`, enforce non-skippable `Overview`/`Learning purpose`/`Knowledge summary`, and hard-fail Practice Design Page validation unless `editorial_opening_image.decision === "generate"` (`skip` is rejected).

