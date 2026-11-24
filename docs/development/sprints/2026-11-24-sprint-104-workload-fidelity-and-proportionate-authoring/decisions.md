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

## S104-D03 — Milestone 2 Multi-LO Compatibility and Deferred Milestone 3 Incompatibilities

**Date:** 2026-11-24  
**Status:** **Recorded during Milestone 2 implementation (pending M2 review)**

### 1. Multi-outcome cohesive single-activity finding (Milestone 2)

- Empirical verification against `lib/page-shell-create.js`, `lib/episode-plan-population-contract.js`, `lib/page-gam-enrich.js`, `lib/page-vnext-assemble.js` (`assembleVNextPageFromPartials`), and `lib/learner-renderer-vnext` confirms that **multiple commissioned learning outcomes addressed through one cohesive activity (`activities.length === 1`, `episode_plans.length === 1`, `mapped_learning_outcome_ids: ["LO1", "LO2", ...]`, `learning_outcome_ids: ["LO1", "LO2", ...]`) are compatible with the existing structured shell, assembly, and learner-rendering architecture** (`0` assembly/renderer validation errors).
- `lib/practice-episode-plan.js` explicitly permits multi-LO cohesive single activities in both `buildPracticeEpisodePlanPromptBody` and `validatePracticeEpisodePlanCapture`, while enforcing 100% outcome coverage, exact statement fidelity, and bidirectional sync between `episode_plans[].mapped_learning_outcome_ids` and `activities[].learning_outcome_ids`. No outcomes are grouped or discarded deterministically.
- One minor single-LO assumption exists in `lib/page-dla-enrich.js:336–350` (`resolveLoStatementForActivity`), which reads only the first non-empty mapped LO statement for deterministic fallback prose; this does not alter captured or model-authored multi-LO bindings and is flagged for Milestone 3 awareness.

### 2. Deferred Milestone 3 downstream incompatibilities (not altered in Milestone 2)

Milestone 3 (Principle C — conditional pedagogical obligations) must reconcile the following verified incompatibilities without altering standalone Interactive behaviour:

1. **Mandatory DLA cognition/bridge/material obligations** (`lib/page-dla-enrich.js:1106`, `:1462–1550`, `:2004–2280`; `app.js:22691–22800` `applyGuidedLearningScaffoldRepairToDlaCapture`, `applyDlaEnrichedPageHardValidationToCapture`): `validateDlaEnrichedPage` rejects lean Practice activities lacking `intellectual_coherence_bridge`, and both DLA enrichment and runtime capture repair/validation unconditionally require full cognition fields and non-empty `required_materials[]`.
2. **Population contract unconditional material/criteria rules** (`lib/episode-plan-population-contract.js:27–135` `FUNCTION_SPECS`, `:581–590` `AC-02`, `:653–668` `AC-09`): `FUNCTION_SPECS.verification` hardcodes `3–4 quality dimensions (max 5)` and `AC-09` requires a distinct material row for every beat whose spec includes `"material"`.
3. **Guided-review 3-criterion floor & GAM closure packaging** (`lib/guided-review-generation-contract.js:291, 306`; `lib/ld-gam-page-enrich-contract.js:58, 108–120`): mandate `3–4` criteria (`< 3` flagged as instructional FAIL, conflicting with Practice `2–3` criteria / optional checklists) and universal `### Page learner-resource closure` packaging for `study_tips`.
4. **GAM non-empty material enforcement** (`lib/page-gam-enrich.js:1453–1458, 1584–1591, 1819–1824`): fails when any activity omits `required_materials[]` or `materials[]`.
5. **Practice Design Page & exemplar prescriptions** (`lib/ld-practice-presentation-contracts.js:140–143, 285–289`; `lib/ld-design-page-partial-contract.js:83–120`; `app.js:15692–15725, 41812–41832`): still prescribe hardcoded `A2-style`/`A3-style`/`A4-style` exemplars, non-skippable `Overview`/`Learning purpose`/`Knowledge summary`, and mandatory `editorial_opening_image.decision === "generate"` (rejecting `"skip"` or omission).

