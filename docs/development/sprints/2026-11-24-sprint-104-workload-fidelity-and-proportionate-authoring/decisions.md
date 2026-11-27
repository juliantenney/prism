# Sprint 104 — Decisions

## S104-D01 — Open Sprint 104 — Workload Fidelity and Proportionate Authoring

**Date:** 2026-11-24  
**Status:** **Accepted**  
**Baseline:** `1515cd4`  
**Primary backlog item:** [PB-FA-025](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-025--duration-fidelity-learner-workload-budgeting)

**Decision:** Open **Sprint 104 — Workload Fidelity and Proportionate Authoring** from clean baseline `1515cd4`.

**Authorised in Phase 104A (investigation & documentation):**

- Create Sprint 104 documentation pack and programme pointer updates.
- Conduct full read-only investigation of `C04` (*Comparing competing economic explanations*, 8 min), systemic comparison across `C01`/`C03`/`C05`, and full audit of prompt instructions, contracts, and workload validators.
- Report root causes and proposed interventions for agreement prior to any code, prompt, contract, or validator changes.

**Not authorised in Phase 104A:**

- Modifying authoring prompts, contracts, validators, `app.js`, `lib/`, or tests.
- Regenerating *Correlation and Causation: Making Sense of Economic Evidence* or altering pre-intervention captures.
- Pursuing explicit non-goals (new pedagogical capabilities, new interaction types, shared statistical visualisation architecture, snapshot persistence, general renderer refactoring, PB-S-008 remediation, or automatic rewriting of authoritative durations).

---

## S104-D02 — Architectural Agreement, Principles (A–E), and Separately Gated Milestones

**Date:** 2026-11-24  
**Status:** **Accepted** (supersedes draft S104-D02 heuristics in [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) §§6–7)  
**Basis:** Phase 104A investigation accepted (`f3bb47d`); architectural review agreement

### 1. Agreed architectural principles (A–E)

#### Principle A — Authoritative duration
- The **Learning Journey owns commissioned component duration**, just as it owns commissioned learning outcomes.
- Duration must be a **structured, authoritative parameter** transported across all four commissioned product families (**Expository**, **Practice**, **Assessment Pack**, **Situated Task**) and legacy commissioned **Interactive** workflows when structured duration exists.
- Establish **one canonical point of origin** in Learning Journey planning/commissioning (**Step 4 `learning_commissions`** via `<<<COMMISSION_DURATIONS_BEGIN>>> ... <<<COMMISSION_DURATIONS_END>>>` carrying `allocated_minutes` per `commission_id`) and preserve its value verbatim throughout commissioning (`Design Page`), commission envelope, intake, workflow seeding (`deliverySeed` / `resolvedFactors`), and effective workflow run context. Do **not** independently author a different duration at Design Page.
- **No prose parsing fallback** for legacy commissions: commissions lacking structured duration metadata remain explicitly unavailable (`null` / absent), with no invented or parsed authoritative duration.
- Explicitly distinguish **authoritative allocated duration** (commissioned constraint), **designed duration** (author/planner allocation across activities, e.g. `learning_sequence`), and **estimated workload** (advisory feasibility calculation).
- Component authoring must **not** unilaterally change commissioned duration or commissioned learning outcomes.

#### Principle B — Practice Episode Plan design authority
- Practice moves from deterministic archetype instantiation (`deriveDesignEpisodePlanCaptureJson` / `ARCHETYPE_TEMPLATES`) to **AI-authored, deterministically validated Episode Plans**, following the **Assessment Pack architectural precedent**: give the AI a clear pedagogical problem to solve within system constraints rather than prescribing the solution deterministically.
- The AI selects appropriate pedagogical moves and activity structure in response to purpose, outcomes, authoritative duration, prior learning, and journey context.
- Preserve the existing pedagogical vocabulary, grammar (`lib/episode-plan-v1-archetype-grammar.js`), structured Episode Plan schema, and downstream population/fidelity mechanisms wherever possible.
- **Do not** introduce fixed duration tiers (`≤ 10`, `11–20`, `21+`), arbitrary activity quotas, beat-count targets, or deterministic LO grouping rules.
- Investigate whether the existing Episode Plan / downstream contract supports multiple learning outcomes addressed through one cohesive activity.
- Protect existing standalone **Interactive** behaviour.

#### Principle C — Conditional pedagogical obligations
- Downstream authoring (**DLA**, **GAM**, **Learning Sequence**, **Design Page**) **realises the selected pedagogical design** rather than enlarging it.
- DLA and GAM realise the pedagogical functions selected in the Episode Plan; quality contracts apply **conditionally** to selected functions rather than universally forcing every element.
- Worked examples, guided practice, diagnostic checklists, and consolidation are **purpose-driven**, not universal mandates.
- Feedback type, depth, and number of criteria reflect the learner's performance.
- Opening images (`editorial_opening_image`), study tips (`study_tips` / `S78-D04`), knowledge summaries, and other editorial furniture are **optional for Practice**.
- Preserve structural integrity, accessibility, constructive alignment, material fidelity, and learner-artefact continuity.
- Distinguish reusable educational infrastructure from inherited Interactive educational prescriptions; prefer **removing redundant prescriptions** over adding compensatory exceptions.

#### Principle D — Proportionate journey commissioning
- Distribute pedagogical functions across the journey rather than repeatedly within individual components.
- Reason about actual learner performance and complete expected workload, including feedback engagement.
- Exploit established prior learning and familiar evidence.
- **Avoid** arbitrary component quotas, outcome-count restrictions, and duration-based word-count rules.
- Encourage progressive development and meaningful reuse of learner artefacts.
- **Journal discipline:** Journal contributions arise from purposeful learner performance; Journal population must not itself drive additional writing tasks.
- Surface genuinely infeasible commissions explicitly rather than silently mutating their authoritative parameters.

#### Principle E — Workload estimation
- Fix confirmed estimator bugs (`lib/learning-journey-workload-feasibility-adapter.js` operator-precedence defect) and silent duration-check bypasses (`lib/interactive-workload-feasibility-adapter.js` missing duration check).
- Restore cumulative workload comparison against authoritative commissioned duration.
- Account for significant learner demands, including evidence inspection, structured decisions, constructed responses, and feedback engagement.
- Distinguish familiar vs new material and expected study vs optional support.
- Keep estimated workload warnings **advisory** (no false precision, no automatic modification of duration, outcomes, or activities).
- Distinguish **structural duration compliance** (explicit allocation arithmetic / missing parameter checks) from **estimated workload feasibility** (advisory effort bands).

### 2. Revised separately gated milestone sequence

| Milestone | Scope | Gate / Status |
| --------- | ----- | ------------- |
| **104A** | Phase 104A read-only investigation & documentation pack | **Complete (`f3bb47d`)** |
| **Milestone 1** | **Authoritative duration transport only** (canonical origin in Step 4 → Design Page → envelope → intake → `deliverySeed` → `resolvedFactors` → effective run context across Expository, Practice, Assessment Pack, Situated Task + legacy/standalone non-regression + focused tests) | **Authorised now** (stop for review on completion) |
| **Milestone 2** | Practice Episode Plan design authority (AI-authored, deterministically validated Episode Plans; protect Interactive; investigate multi-LO single-activity support) | **Gated on Milestone 1 review** |
| **Milestone 3** | Reconciliation of downstream Practice contracts (DLA, GAM, LS, Design Page conditional pedagogical obligations; remove redundant Interactive prescriptions) | **Gated on Milestone 2 review** |
| **Milestone 4** | Proportionate Learning Journey commissioning (journey-wide function distribution, prior learning/familiar evidence, Journal discipline, surfacing infeasibility) | **Gated on Milestone 3 review** |
| **Milestone 5** | Workload estimation corrections (bug fixes, cumulative comparison vs authoritative duration, evidence/decision/response/feedback bands, familiar/optional separation, advisory warnings) | **Gated on Milestone 4 review** |
| **Milestone 6** | Live **5-, 15-, and 30-minute** Practice sensitivity probes | **Gated on Milestone 5 review** |
| **Milestone 7** | Regeneration of original 90-minute Economics journey, baseline comparison, educational QA & learner-runtime acceptance | **Gated on Milestone 6 review** |

### 3. Authorised in Milestone 1 (current milestone only)

- Canonical duration origin in `learning_commissions` (Step 4) and lossless transport through LJ Design Page, envelope, intake, workflow family seeding, single/batch creation, delete/recreate, persistence, and effective workflow run context across **Expository**, **Practice**, **Assessment Pack**, and **Situated Task**.
- Explicit non-fallback legacy behaviour (missing structured duration remains `null`/unavailable; zero prose parsing).
- Authority & conflict detection (`Step 4` vs `Step 5` Design Page mismatch fails closed; component authoring/Adjustments cannot unilaterally change LJ-owned duration).
- Identification and reporting of downstream duration consumers that cannot yet operate properly without later milestones.
- Focused automated tests covering transport, authority, persistence, legacy compatibility, and non-regression across all four product families.
- **Stop for review** prior to committing implementation changes or starting Milestone 2; retain the pre-intervention Economics journey and captures untouched.

---

## S104-D03 — Milestone 2 Multi-LO Compatibility and Milestone 3 Contract Reconciliation

**Date:** 2026-11-24  
**Status:** **Milestone 2 committed (`9db45bf`); Milestone 3 reconciled (stopped for review before commit)**

### 1. Multi-outcome cohesive single-activity finding (Milestone 2)

- Empirical verification against `lib/page-shell-create.js`, `lib/episode-plan-population-contract.js`, `lib/page-gam-enrich.js`, `lib/page-vnext-assemble.js` (`assembleVNextPageFromPartials`), and `lib/learner-renderer-vnext` confirms that **multiple commissioned learning outcomes addressed through one cohesive activity (`activities.length === 1`, `episode_plans.length === 1`, `mapped_learning_outcome_ids: ["LO1", "LO2", ...]`, `learning_outcome_ids: ["LO1", "LO2", ...]`) are compatible with the existing structured shell, assembly, and learner-rendering architecture** (`0` assembly/renderer validation errors).
- `lib/practice-episode-plan.js` explicitly permits multi-LO cohesive single activities in both `buildPracticeEpisodePlanPromptBody` and `validatePracticeEpisodePlanCapture`, while enforcing 100% outcome coverage, exact statement fidelity, and bidirectional sync between `episode_plans[].mapped_learning_outcome_ids` and `activities[].learning_outcome_ids`. No outcomes are grouped or discarded deterministically.
- One minor single-LO assumption exists in `lib/page-dla-enrich.js:336–350` (`resolveLoStatementForActivity`), which reads only the first non-empty mapped LO statement for deterministic fallback prose; this does not alter captured or model-authored multi-LO bindings and is flagged for Milestone 3 awareness.

### 2. Milestone 3 downstream reconciliation summary (implemented — pending review)

Milestone 3 reconciled all five deferred incompatibilities under Principle C without altering standalone Interactive behaviour:

1. **Conditional DLA cognition, bridge & material obligations + multi-LO fallback (`lib/page-dla-enrich.js`, `lib/ld-dla-page-enrich-contract.js`, `lib/ld-guided-learning-scaffold.js`, `lib/dla-diagnostic-review.js`, `app.js`):** Scoped Practice cognition/bridge/preamble obligations to selected Episode Plan beats, enabled valid zero-dedicated-material Practice activities (`required_materials: []`) while preserving material obligations from selected material-bearing beats/evidence/response surfaces, allowed Practice hybrid `selection` + open-response activities to point `diagnostic_review.covers_response_material_ids` at open response surfaces, bypassed Interactive guided-learning scaffold prose/word-floor enforcement on Practice captures, and updated `resolveLoStatementForActivity` to join all distinct mapped LO statements.
2. **Population contract reconciliation (`lib/episode-plan-population-contract.js`, `lib/episode-plan-dla-integration.js`):** Removed the `"3–4 quality dimensions"` minimum floor in `FUNCTION_SPECS.verification` and permitted valid self-contained Practice activities (`options.practiceProduct === true`) without `AC-09`/`AC-01`/`AC-07`/`M-02` collapse while retaining ordering (`M-03`) and beat-bound material obligations.
3. **Guided-review & GAM reconciliation (`lib/guided-review-generation-contract.js`, `lib/ld-gam-page-enrich-contract.js`, `lib/gam-canonical-assembler.js`, `lib/page-gam-enrich.js`, `app.js`):** Reconciled Practice guided-review criteria to function-proportionate counts without arbitrary minimum floors (hard max 4; Interactive `3–4` unchanged), removed Interactive `LD-GAM-INSTRUCTIONAL-DEPTH-CONTRACT` and unconditional `S78-D04` closure packaging on Practice, and enabled valid `materials: []` when `required_materials: []` while preserving 1:1 coverage when materials are present.
4. **Practice presentation contracts, LS preservation & purpose-driven Design Page (`lib/ld-practice-presentation-contracts.js`, `app.js`):** Removed fixed `A2-style`/`A3-style`/`A4-style` exemplars, enforced Episode Plan activity/duration preservation in Practice Learning Sequence, and made Practice `editorial_opening_image` (`"generate"` / `"skip"` with `skip_reason` / omitted) and `page_synthesis` (`overview`, `learning_purpose`, `knowledge_summary`, `study_tips`) purpose-driven.
5. **Assembly & vNext renderer survival (`lib/page-vnext-assemble.js`, `lib/learner-renderer-vnext/archetype-canonical-binding.js`, `lib/learner-renderer-vnext/build-activity-model.js`, `lib/learner-renderer-vnext-browser.js`):** Stripped `"—"` shell placeholders on omitted optional Practice fields and guaranteed clean fallback binding for lean/custom grammar-legal beat sequences (`UNASSIGNED_TASK_STEP` / `UNASSIGNED_EXPECTED_OUTPUT` avoided).

---

## S104-D04 — Suspend Sprint 104 at Live Acceptance Pending Sprint 105

**Date:** 2026-11-25  
**Status:** **Accepted**  
**Committed implementation baseline:** `f1f1269` (M1 `c461770`, M2 `9db45bf`, M3 `53bd50c`, M4 `43db3f4`, M5 `f1f1269`)

**Context:**  
Sprint 104 implementation milestones 1–5 are complete, verified against focused automated suites, and committed through `f1f1269`. During live validation regeneration of the 90-minute *Correlation and Causation: Making Sense of Economic Evidence* Learning Journey, Step 4 (`Commissioning`) generated approximately 14,000 words in conversational context and Step 5 (`Design Page`) subsequently failed to produce the complete Design Page JSON, citing output-length limitations. This exposed the same monolithic-final-capture architectural limitation previously resolved for Interactive via progressive structured capture and deterministic assembly.

**Decision:**

1. **Suspend Sprint 104 at live acceptance** (do **not** close Sprint 104). Preserve all committed implementation (`c461770`–`f1f1269`) and all outstanding validation requirements:
   - Milestone 1 manual integrated live acceptance;
   - Milestone 6 — live 5-, 15-, and 30-minute Practice sensitivity probes;
   - Milestone 7 — 90-minute Economics Learning Journey regeneration, baseline comparison against the preserved pre-intervention captures, educational QA, and learner-runtime acceptance.
2. **Open [Sprint 105 — Learning Journey Progressive Capture and Assembly](../2026-11-25-sprint-105-learning-journey-progressive-capture-and-assembly/SPRINT-105-START-HERE.md)** as the active priority sprint ahead of Connect More (Wed 2 Dec 12:00).
3. **Preserve artefacts untouched:** Retain both the original pre-intervention Economics baseline (`c01-page.json`, `c01-zip/`, `c02-page.json`, `tests/fixtures/assessment-pack-c06-design-page-d09-scatterplot.json`, and external parent/component baseline captures) and the current incomplete regeneration without alteration.
4. **Resumption criterion:** Resume Sprint 104 live acceptance (Milestones 6–7 + M1 integrated live acceptance) once Sprint 105 delivers progressive Learning Journey capture and deterministic assembly.

---

## S104-D05 — Resume Sprint 104 at Live Acceptance After Sprint 105 Closure

**Date:** 2026-11-25  
**Status:** **Accepted**  
**Resumption baseline:** `a7ad249` (Sprint 104 M1–M5 `c461770`–`f1f1269` + Sprint 105 M1–M4 `4b698db`–`a7ad249`, Sprint 105 closed per `S105-D04`)

**Decision:**

1. **Formally resume Sprint 104 at its outstanding live acceptance milestones:**
   - **Milestone 1** — Integrated live acceptance;
   - **Milestone 6** — Practice duration sensitivity probes at **5, 15, and 30 minutes**;
   - **Milestone 7** — Remaining Economics component generation, workload assessment, baseline comparison against preserved pre-intervention captures, educational QA, and unified learner-runtime acceptance.
2. **Canonical parent workflow & baseline preservation:** Adopt the fresh, successfully assembled 90-minute *Correlation and Causation: Making Sense of Economic Evidence* Learning Journey (produced and verified under Sprint 105, with regenerated Economics C1 already accepted at **91 / 100**) as the canonical parent workflow for Sprint 104 acceptance. Preserve **both historical Economics baselines** (the original pre-intervention baseline and the incomplete Sprint 104 regeneration) without mutation.
3. **Carry forward Sprint 105 authoring & publication improvements:** Retain Sprint 105's progressive LJ capture/assembly, Expository representational necessity and workload proportionality (Workstream 1), Expository optional block-level material anchors (`S105-D03`), `evaluate` evaluative-refinement sequencing, and structured-material publication fixes, together with the non-blocking residual C1 observation (~12–15 minutes estimated learner workload vs 10 minutes commissioned; **actual learner completion times remain unmeasured**).
4. **Scope discipline (binding for Sprint 104 live acceptance):**
   - Immediate objective: establish workload fidelity across the complete Economics Learning Journey and close Sprint 104.
   - Do **not** undertake comprehensive component-type testing or pursue incremental improvements to otherwise acceptable resources.
   - Address defects that prevent generation, publication, meaningful workload assessment, or integrated Learning Journey operation.
   - Record and defer unrelated editorial, presentation, and component-type enhancement opportunities (including deferred `S105-AD-005` and `D-016`).
   - Avoid unnecessary regeneration of accepted components (retain accepted Economics C1).
   - Preserve educational quality, accessibility, and disciplinary authenticity without pursuing perfection in individual resources.
5. **Political Economy boundary:** The 30-hour, 10-week, 50-component Political Economy Learning Journey remains an independent, incrementally developed, large-scale PRISM reference implementation and stress test; its completion is **not** a dependency for Sprint 104 closure.

---

## S104-D06 — Focused Progressive Learning Journey Workload-Fidelity Corrections and Revised Live Acceptance Sequence

**Date:** 2026-11-25  
**Status:** **Accepted — focused corrections implemented (stopped for review before commit / live acceptance)**  
**Baseline:** `76f44ef` (Sprint 105 formally closed and handed back to Sprint 104; Sprint 105 remains **CLOSED — COMPLETE**)

**Context:**  
Re-evaluation of Sprint 104 live acceptance identified that Sprint 105 M2 prompt compression removed explicit effort-reconciliation and pre-finalisation achievability verification requirements previously introduced by Sprint 104 M4 (`43db3f4`) from `PROGRESSIVE_TEMPLATES` (`lib/learning-journey-sibling-prompts.js`), and that `app.js` surfaced Learning Journey workload feasibility warnings only at Stage 5 (`design_page`) rather than Stage 4 (`learning_commissions`). This is classified as a **regression against existing Sprint 104 workload-fidelity requirements**, not a new enhancement, and is recorded under **Sprint 104** without reopening Sprint 105.

**Decision:**

1. **Implement two focused Sprint 104 workload-fidelity corrections prior to further live acceptance:**
   - **Correction 1 — Restore progressive Learning Journey workload-fidelity instructions (`lib/learning-journey-sibling-prompts.js`):** Restore concise, stage-appropriate Sprint 104 M4 effort-reconciliation requirements across progressive Stages 1–4 (`learning_requirements`, `learning_progression`, `learning_elements`, `learning_commissions`), respecting progressive capture ownership boundaries. Explicitly require Stage 4 to account for complete learner workload (prior-learning activation, unfamiliar vs familiar evidence inspection, reasoning and decision-making, response construction, and feedback engagement and revision), verify educational achievability of every commission within its `allocated_minutes` before finalising (arithmetic reconciliation alone is insufficient), and reconcile scope/staging/allocation within upstream constraints while preserving educational purpose, intellectual demand, and meaningful learner performance — with zero arbitrary word limits, activity counts, duration tiers, or rigid timing formulae, and zero new schema fields.
   - **Correction 2 — Surface advisory workload feasibility warnings at Stage 4 (`app.js`, `index.html`):** Use the existing `PrismLearningJourneyWorkloadFeasibilityAdapter` to surface commission-level and journey-level advisory (non-blocking) workload feasibility warnings at Stage 4 (`learning_commissions`) capture before Stage 5 is generated, while preserving final assembled Stage 5 (`design_page`) diagnostics identically. Guarantee full warning lifecycle hygiene across Stage 4 edits (using current Stage 4 `allocated_minutes` rather than stale `deliverySeed` metadata), invalid/empty captures, upstream invalidation, reload/hydration (`restoreWorkflowRunStateForWorkflow` / `revalidateProgressiveLearningJourneyCapturesAfterHydration`), and `Clear run data`, with zero automatic regeneration, zero correction loops, zero new schema fields, and zero estimator threshold changes.
2. **Preserve all existing acceptance evidence untouched:** Do **not** modify or regenerate the accepted canonical Economics Learning Journey, accepted regenerated Economics C1 (`91/100`), the Political Economy reference module, or either preserved historical Economics baseline.
3. **Approved subsequent live acceptance sequence (following review of these corrections):**
   1. Generate **Economics C6 and C2** as the diagnostic pair, recording **Milestone 1** duration-transport evidence concurrently.
   2. Review the relationship between upstream commissioning demand and realised downstream workload.
   3. Complete the remaining Economics components and integrated **Milestone 7** acceptance (holistic workload assessment, baseline comparison, educational QA, and unified learner-runtime acceptance).
   4. Conduct **Milestone 6** through the proposed disposable **50-minute Learning Journey** containing three comparable Practice commissions at **5, 15, and 30 minutes** (probe brief to be reviewed separately so duration, rather than progression or prior familiarity, is the principal variable).
4. **Scope guardrails reaffirmed:** Do **not** undertake further estimator tuning or unrelated component-type improvements. Stop for review once the two corrections, regression tests, and Sprint 104 documentation updates are complete.

---

## S104-D07 — Final Sprint 104 Workload Policy and Presentation

**Date:** 2026-11-26  
**Status:** **Accepted — implemented (stopped for review before sprint closure / commit)**  
**Governing principle:** *Precision internally, flexibility externally.* **Time helps learners decide when to engage; it should not dictate how they engage.**

**Context:**  
Following live authoring and educational QA of the Economics Learning Journey (`86 / 100`, Ready with qualifications; C1 `91/100`, C6 `89/100`, C4 PASS, C7 `96/100`), workload estimation refinement reached diminishing returns. This final policy makes the existing capability educationally appropriate, useful to authors, and supportive of learners.

**Decision (Final S104 Workload Policy):**

1. **Three distinct duration concepts:**
   - **Allocated duration:** exact internal design and commissioning constraint (all existing numeric duration contracts, locking, transport, arithmetic, and structural validation preserved unchanged).
   - **Indicative duration range:** flexible learner-facing planning guidance computed deterministically by a single shared helper (`lib/indicative-duration.js`).
   - **Estimated workload range:** author-facing advisory assessment of the demands of the generated design.
2. **Shared indicative duration convention (`lib/indicative-duration.js`):**
   - `5 → Around 5 minutes` (internal upper tolerance boundary `7`), `10 → 5–15 minutes`, `15 → 10–20 minutes`, `20 → 15–25 minutes`, `30 → 20–40 minutes`, `45 → 35–55 minutes`, `90 → 75–105 minutes`, with monotonic handling for short, fractional, and extended durations.
   - Aggregate indicative ranges (e.g. Learning Journey overview) are calculated strictly from total exact allocated duration — never by summing individual component ranges.
3. **Learner-facing timing presentation:**
   - Displayed at Learning Journey overview (indicative total + explanatory note once), component listing (indicative component duration), and component opening (indicative component duration; standalone resources include the explanatory note once at resource level).
   - Routine activity-level, episode-level, and step-level timings are **suppressed** in learner-facing output while remaining intact in structured data and authoring; explicitly timed tasks (`explicit_time_limit` / `fixed_timing`) and explicit assessment time limits remain preserved.
   - Standard explanatory wording: *"The suggested timings are a guide to help you plan your learning. You may need more or less time depending on your prior knowledge and how you approach the activities. Work at a pace that suits you."*
4. **Authoring prompt alignment:** Future prompts across Learning Journey, Expository, Practice, Assessment Pack, and Situated Task distinguish precise internal allocations from learner-facing indicative timing guidance and avoid fixed-pace framing or routine activity-/step-level timing prose. Accepted resources do not require regeneration solely to adopt this policy.
5. **Advisory workload warning threshold & actionable guidance:**
   - Warn across all four workload feasibility adapters (`learning-journey`, `interactive`, `assessment-pack`, `situated-task`) **only when the credible lower workload estimate exceeds the shared upper indicative duration boundary** (`low > upperIndicativeBoundary`), without changing underlying workload estimation calculations or weakening structural validators, and retaining full diagnostic evidence (`indicativeEffortMinutes`, `indicativeDuration`, `upperIndicativeBoundaryMinutes`, `rawExceedsAllocated`, `demandDrivers`, `factors`, `components`) even when a marginal warning is suppressed.
   - Warnings communicate allocated duration, indicative range, estimated workload range, principal workload demands, and factor-grounded current-stage vs upstream options, honour locked commissioned durations (`durationLocked: true` directs authors to upstream commissioning rather than local duration edits), preserve pedagogical integrity, and state clearly that warnings are advisory and approximate.
6. **Updated Milestone 6 acceptance framing (5-, 15-, and 30-minute Practice sensitivity test):**
   - The outstanding 5-, 15-, and 30-minute Practice sensitivity test should demonstrate **meaningful differences in scope, activity design, and workload proportionality** while preserving intended learning purpose and appropriate cognitive demand. It is **not** intended to demonstrate exact learner completion times.
7. **Conclusion of workload fidelity development:**
   - This implementation concludes workload fidelity development for Sprint 104. Further refinement should be undertaken only when substantive evidence from real authoring or learner use demonstrates a need.





---

## S104-D08 — Recovery: Deactivate Deterministic Workload Assessment; Preserve Estimator Work on a Recovery Branch

**Date:** 2026-11-27  
**Status:** **Accepted — implemented on `master` (Sprint 104 remains OPEN)**

**Context:**  
The live 5/15/30-minute Practice experiment (M6) demonstrated pedagogical proportionality, but diagnostics exposed fundamental limitations of the additive deterministic estimator (counterintuitive workload ordering, flat reasoning floors, sensitivity to stated response length). The M6 estimator resolution was not accepted and incremental refinement was suspended (see STATUS.md, 2026-11-26).

**Decision:**

1. Further refinement of the deterministic workload estimator is **not pursued**.
2. The educational/runtime fixes (Practice evidence placement, saving-information sidebar footer) and authoring guidance (shared proportionality principles, authorised authenticated commissioning prompt change) are **committed on `master`**.
3. 2026-11-26's estimator, adapter and advisory-wiring work, its tests and diagnostics are preserved **only** on branch `recovery/s104-m6-workload-estimator`, **not merged to `master`**. `master` keeps the previously committed estimator and adapter implementations unchanged (retained for possible research; not deleted or refactored).
4. A single internal switch in `app.js` (`workloadAssessmentEnabled`, default `false`) deactivates deterministic workload assessment across all four product families: the four `append*WorkloadFeasibilityWarnings` entry points and `attachLearningJourneyWorkloadWarningsToGate` return before any adapter/estimator runs; `notifyWorkloadAdvisoryToast` is inert; previously stored advisories are not rendered. It is not user-facing configuration. Tests of the dormant machinery enable it via `setWorkloadAssessmentEnabledForTest`.
5. Duration contracts, allocation transport, locking, arithmetic reconciliation, indicative timing presentation, authoring guidance, capture, assembly and publication are unchanged. No replacement mechanism, AI call, workflow stage or setting is introduced.
