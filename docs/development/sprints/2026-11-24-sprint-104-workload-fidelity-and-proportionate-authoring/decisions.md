# Sprint 104 — Decisions

## S104-D01 — Open Sprint 104 — Workload Fidelity and Proportionate Authoring

**Date:** 2026-11-24  
**Status:** **Accepted**  
**Baseline:** `1515cd4`  
**Primary backlog item:** [PB-FA-025](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-025--duration-fidelity-learner-workload-budgeting)

**Decision:** Open **Sprint 104 — Workload Fidelity and Proportionate Authoring** from clean baseline `1515cd4`.

**Authorised in Phase 104A (this opening):**

- Create Sprint 104 documentation pack and programme pointer updates.
- Conduct full read-only investigation of `C04` (*Comparing competing economic explanations*, 8 min), systemic comparison across `C01`/`C03`/`C05`, and full audit of prompt instructions, contracts, and workload validators.
- Report root causes and proposed interventions for agreement prior to any code, prompt, contract, or validator changes.

**Not authorised in Phase 104A:**

- Modifying authoring prompts, contracts, validators, `app.js`, `lib/`, or tests.
- Regenerating *Correlation and Causation: Making Sense of Economic Evidence* or altering pre-intervention captures.
- Pursuing explicit non-goals (new pedagogical capabilities, new interaction types, shared statistical visualisation architecture, snapshot persistence, general renderer refactoring, PB-S-008 remediation, or automatic rewriting of authoritative durations).

---

## S104-D02 — Proposed implementation plan (awaiting agreement)

**Date:** 2026-11-24  
**Status:** **Proposed — awaiting author review and agreement**  
**Basis:** [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) §6

**Summary of proposed interventions for agreement before Phase 104B implementation:**

1. **Authoritative duration transport (`LJ Design Page → Intake → Workflow`):** Add structured numeric duration metadata on LJ commissions (`allocated_minutes` / `duration_minutes` with prose fallback at intake normalisation only) and thread it into `deliverySeed.duration_minutes` → `resolvedFactors.duration_minutes`, surfacing authoritative duration in `AUTHORITATIVE WORKFLOW PARAMETERS` and re-enabling `appendLearningSequenceDurationComplianceErrors`.
2. **Commissioning & outcome proportionality (`lib/learning-journey-sibling-prompts.js`):** Add explicit component viability and workload-budgeting constraints linking component count, component `learning_outcomes[]` count, constructed-response scope, and Learning Journal elicitations to allocated minutes, distinguishing familiar vs new evidence and optional support vs expected study.
3. **Duration- and product-aware Episode Plan (`lib/episode-plan-v1-templates.js`, `app.js`):** Remove the unconditional `1 LO = 1 12–15-beat Interactive activity` lock for Practice by passing `{ durationMinutes, product }` into `deriveEpisodePlansFromLearningOutcomes`, grouping closely linked sub-outcomes into a single cohesive activity for short commissions (`≤ 10–12 min`) and selecting grammar-legal lean beat profiles (`4–7` beats) permitted by `lib/episode-plan-v1-archetype-grammar.js` while keeping standalone Interactive untouched.
4. **Proportionate Practice DLA, GAM & Design Page contracts (`lib/ld-practice-presentation-contracts.js`, `lib/guided-review-generation-contract.js`, `lib/ld-gam-page-enrich-contract.js`, `lib/ld-dla-page-enrich-contract.js`, `lib/episode-plan-population-contract.js`, `lib/ld-design-page-partial-contract.js`):**
   - Gate the unconditional `"3–4 criteria / <3 criteria is an instructional FAIL"` floor in `guided-review-generation-contract.js` and `FUNCTION_SPECS.verification` so Practice (and compact durations) can use `1–2` focused criteria or compact verification without forcing 6 criteria on 2 activities.
   - Add explicit duration tiers (`≤ 10 min`, `11–20 min`, `21+ min`) to Practice contracts scaling evidence datasets, selection chains, worked models, constructed-response word expectations, `S78-D04` closure / `study_tips`, and optional support vs core study.
   - Surface per-activity and total duration constraints in Practice DLA / GAM / LS prompts.
5. **Workload estimator & validator upgrades (`lib/learning-journey-workload-feasibility-adapter.js`, `lib/interactive-workload-feasibility-adapter.js`, `lib/workload-feasibility-estimator.js`):**
   - Fix the operator-precedence bug at `lib/learning-journey-workload-feasibility-adapter.js:182–186` that unconditionally labels every `product === "practice"` commission `"mathematical_problem"` (`10–18 min` production floor).
   - Compare cumulative page effort against workflow `resolvedFactors.duration_minutes` (eliminating silent `declaredDurationMinutes: null` skipping as seen on `C01`).
   - Model dataset inspection (`data_table`/`scenario`), structured `selection` decision chains, `checklist` diagnostic review effort, and partial familiar/new mixes; fix false `"institutional_recommendation"` keyword misclassifications.
6. **Optional policy confirmation:** Confirm whether extreme Practice/LJ workload overshoots remain non-blocking advisory warnings (consistent with Sprint 100 guardrails) or emit stronger pre-emit / LS warnings when cumulative effort exceeds commissioned minutes by a clear threshold.
