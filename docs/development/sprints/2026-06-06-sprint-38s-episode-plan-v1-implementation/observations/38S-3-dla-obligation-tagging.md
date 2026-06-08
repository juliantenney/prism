# 38S-3 — DLA obligation tagging integration

**Date:** 2026-06-06  
**Status:** **COMPLETE**  
**Type:** Implementation phase — production wiring + harness integration  
**Charter:** [IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) §38S-3  
**Inputs:** [38S-2 population contract](38S-2-population-contract-implementation.md) · [38S-1 integration](38S-1-episode-plan-v1-integration.md) · [38R-3 mapping](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-3-plan-to-dla-mapping.md)  
**Implementation:** `lib/episode-plan-dla-integration.js` · `lib/episode-plan-v1-templates.js` · `app.js` · `ev-38l-inflation-pipeline-capture-once.mjs`  
**Successor:** [38S-4 Proof execution](38S-4-proof-execution.md)

---

## Executive framing

**Primary question:**

> Can DLA be forced to behave as a population layer rather than a planning layer?

**Answer (38S-3):** **Yes — with enforced wiring.** Episode Plan is now upstream authority; DLA capture path applies population contract automatically; obligation tags are structural, not prompt-decorative.

**Scope:** Wiring and enforcement only. **No proof-run evaluation** (38S-4). **No V1 schema change.**

---

## Task 1 — DLA integration map

## DLA integration map

| Touchpoint | Impact | Role |
|------------|:------:|------|
| `lib/episode-plan-dla-integration.js` | **High** | Merge scaffold + tags; gate; validation orchestration |
| `lib/episode-plan-v1-templates.js` | **High** | Derive `episode_plans[]` from LO (38R-2 A1–A4 templates) |
| `lib/episode-plan-population-contract.js` | **High** | Scaffold, AC/T-chain, M-02/M-03/M-05 (38S-2) |
| `app.js` — `applyEpisodePlanPopulationEnforcementToDlaCapture` | **High** | Post-capture DLA enforcement on workflow sync |
| `app.js` — `applyEpisodePlanDlaPopulationPromptBlockToDraft` | **High** | Population-only prompt block on DLA step |
| `app.js` — `resolveEpisodePlansForDlaPopulation` | **Medium** | Resolve `episode_plans` capture or derive from LO |
| `index.html` script includes | **Low** | Load contract + templates + integration modules |
| `ev-38l-inflation-pipeline-capture-once.mjs` | **High** | Derive plans → DLA → enforce → validate |
| `domain-learning-design-step-patterns.md` §5 DLA prompt | **Medium** | IFP planning language still present — runtime block overrides intent |
| `lib/dla-38l-obligation-check.js` | **Low** | 38L depth rows — complementary, not replaced |
| GAM / Page compose (38M–38P) | **Low** | Consume tagged `learning_activities` unchanged |
| Dedicated `step_design_episode_plan` workflow step | **Medium** | **Deferred** — derivation from LO satisfies gate; separate step is follow-on |

---

## Task 2 — Gate integration

## Gate integration

### Enforcement points

| Gate | Function | Location | Behaviour |
|------|----------|----------|-----------|
| **M-13 / PF-11** | `assertPlanBeforePopulateGate(episodePlan)` | `episode-plan-population-contract.js` | Single plan invalid → fail |
| **Container gate** | `assertEpisodePlansContainerGate(episodePlans)` | `episode-plan-dla-integration.js` | Empty/missing container → fail |
| **Harness pre-DLA** | Container gate before OpenAI call | `ev-38l-inflation-pipeline-capture-once.mjs` L449 | Hard throw |
| **Workflow post-capture** | `applyEpisodePlanPopulationEnforcementToDlaCapture` | `app.js` → `syncWorkflowRunCapturedOutputToState` | Marks step incomplete; stores `workflowRunPopulationContractValidation` |

### Failure modes

| Condition | Result |
|-----------|--------|
| No Episode Plan + no LO upstream | **Fail** — `PF-11: missing episode_plans and learning_outcomes upstream` |
| Invalid Episode Plan (empty beats) | **Fail** — container gate errors |
| Population before plan | **Prevented** — harness derives plans before DLA; workflow derives from LO if no `episode_plans` capture |
| LLM output without tags | **Corrected** — merge replaces order/tags from plan scaffold |

**Exact workflow enforcement point:** `syncWorkflowRunCapturedOutputToState` → sanitized DLA JSON → `applyEpisodePlanPopulationEnforcementToDlaCapture` → re-serialized tagged `learning_activities`.

---

## Task 3 — Obligation tagging contract

## Obligation tagging contract

Every material obligation after enforcement carries:

```json
{
  "material_id": "M_plan_N",
  "instructional_function": "<FunctionEnum>",
  "plan_beat_index": 0,
  "specification": "<pedagogical spec>",
  "type": "<from LLM when matched>",
  "population_contract_version": "38S-2"
}
```

### Requirements

| Requirement | Mechanism |
|-------------|-----------|
| Generated automatically | `mergePopulationScaffoldWithLlmActivity` from plan beat index |
| Survives population | Applied post-LLM before GAM handoff |
| Survives validation | `validateLearningActivitiesPopulationContract` |
| Survives downstream handoff | JSON persisted in `learning_activities` capture / harness artefact |

### Activity-level metadata

- `episode_plan_ref` — `{ archetype, beat_count, population_contract_version }`
- `_population_trace[]` — beat → surface map
- `_learner_task_segments[]` — OBL-T segments
- `materials_order[]` — plan-ordered material_ids
- `_population_contract_version: "38S-3"` on activity

**Canonical field:** `instructional_function` (not `purpose` alone).

---

## Task 4 — Ordering enforcement

## Ordering enforcement

**Rule:** Episode Plan order = OBL-M order in `required_materials[]`.

| Mechanism | Detail |
|-----------|--------|
| Scaffold emission | Materials emitted in beat index order |
| `materials_order[]` | Declared on activity for Page compose |
| `plan_beat_index` | Non-decreasing in array order |
| **M-03** | `metricOrderedObligationSurvival(plan, activity)` — target 100% |

**Merge policy:** LLM materials matched by `instructional_function` / `purpose` / `plan_beat_index`, then **reordered** to plan sequence. Parallel bundle reordering cannot survive enforcement.

---

## Task 5 — DLA responsibility audit

| Responsibility | DLA (after 38S-3) | Episode Plan |
|----------------|-------------------|--------------|
| Archetype selection | **No** — upstream | **Yes** (derived from LO) |
| Beat sequencing | **No** — upstream | **Yes** |
| T1–T5 choreography | **No** — upstream | **Yes** (beat order) |
| Function identity per beat | **Tagged** — not invented | **Yes** |
| Obligation spec population | **Yes** — fill bodies/types | Provides beat intent |
| `learner_task` assembly | **Yes** — from segments + LLM prose | Provides segment order |
| Material type selection | **Yes** (with GAM realisation) | **No** |
| 38L depth rows (checklist, etc.) | **Yes** — LLM still emits | **No** |

### Remaining planning behaviour in DLA

| Behaviour | Status | Mitigation |
|-----------|--------|------------|
| Pack §5 IFP / archetype selection prose | **Still in prompt** | 38S-3 auto-applied population-only block contradicts |
| 38J internal IFP mental planning | **Superseded structurally** | Post-capture enforcement overwrites order/tags |
| LLM inventing extra materials | **Partially corrected** | Orphan materials without plan beat flagged (AC-08) |
| LLM omitting beats | **Corrected** | Scaffold inserts missing obligations |

**Verdict:** Sequencing and choreography **moved upstream**. DLA **population remains** but is **constrained** by enforcement layer.

---

## Task 6 — Inflation harness readiness

## Inflation harness readiness

**Harness:** `docs/.../ev-38l-inflation-pipeline-capture-once.mjs`  
**Version:** `38S-3a`

### Pipeline (updated)

```text
Brief → LC → KM → frozen LO
  → derive episode_plans (38R-2 templates)
  → gate (M-13)
  → DLA (population-only prompt + episode_plans upstream)
  → applyPopulationContractToLearningActivities
  → validateLearningActivitiesPopulationContract
  → validateDla38LObligations (38L)
  → GAM → Page
```

### New artefact

- `{RUN_PREFIX}-episode-plans.json`

### Harness imports

- `episode-plan-dla-integration.js`
- `episode-plan-population-contract.js`
- Episode plan libs loaded in `loadApi()` VM context for `app.js` test API parity

**Proof run:** Harness is **ready** for 38S-4 execution. This phase did **not** execute LLM proof run.

---

## Task 7 — Enforcement verification

Structural verification (unit tests — no LLM):

| Verification | Status |
|--------------|:------:|
| `instructional_function` present on all OBL-M after merge | **PASS** |
| `plan_beat_index` present on all OBL-M after merge | **PASS** |
| Container gate rejects missing plans | **PASS** |
| Frozen LO → 4 episode plans (A1–A4) | **PASS** |
| Collapsed LLM bundle → plan-ordered tagged obligations | **PASS** |
| M-03 order preserved after merge | **PASS** |
| Population contract validation on merged artefact | **PASS** |
| DLA population-only prompt block present | **PASS** |
| `episode-plan-population-contract.test.js` (12 tests) | **PASS** |
| `episode-plan-dla-integration.test.js` (6 tests) | **PASS** |

**Total:** 18/18 pass.

---

## Task 8 — Regression assessment

| Surface | Impact | Rationale |
|---------|:------:|-----------|
| 38M–38P compose path | **None** | Adds metadata fields; existing fields preserved |
| GAM material realisation | **Low** | Receives more ordered obligations; may increase row count |
| Page render order | **Low** | `materials_order[]` now populated from plan |
| Role fidelity (38P) | **None** | No role registry changes |
| `fullOk` logic | **None** | No changes to RF gates |
| Workflows without LO/`episode_plans` | **Medium** | DLA step marked incomplete until upstream available |
| Stale UI prompt overrides | **Medium** | Pre-existing 38L diagnosis — pack block may be bypassed |

**Overall regression risk:** **Low** for fidelity path; **Medium** for legacy workflows lacking LO upstream.

---

## Task 9 — Integration verdict

| # | Question | Answer |
|---|----------|--------|
| 1 | Is DLA now population-first? | **Yes** — prompt block + post-capture enforcement; planning prose remains but is overridden structurally |
| 2 | Is Episode Plan now planning authority? | **Yes** — beats/order from plan; DLA cannot change obligation count/order without validation failure |
| 3 | Can obligation identity survive end-to-end? | **Yes** — tags persist in capture JSON through GAM handoff |
| 4 | Does the contract remain enforceable? | **Yes** — gate + merge + validate active in workflow and harness |
| 5 | What risks remain before proof execution? | LLM spec quality vs AC rules (**High**); dedicated Episode Plan workflow step not yet in pack graph (**Medium**); 38L depth vs plan order tension (**Low**) |

---

## Task 10 — Inputs to 38S-4

## Proof execution inputs

### Active integration points

- Workflow: `syncWorkflowRunCapturedOutputToState` enforcement
- DLA prompt: `applyEpisodePlanDlaPopulationPromptBlockToDraft`
- Harness: derive → gate → DLA → enforce → validate
- Modules: `episode-plan-dla-integration.js`, `episode-plan-v1-templates.js`, `episode-plan-population-contract.js`

### Enforcement status

| Component | Status |
|-----------|:------:|
| M-13 gate | **Active** |
| Obligation tagging | **Active** |
| M-03 ordering | **Active** |
| AC-01–AC-10 | **Active** (post-merge validation) |
| T1–T5 chains | **Active** |

### Validation status

- Unit tests: **18/18 pass**
- LLM proof run: **Not executed** (38S-4)

### Regression status

- 38M–38P: **No code changes**
- `fullOk`: **Unchanged**

### Proof-run assumptions

1. Use `ev-38l-inflation-pipeline-capture-once.mjs` with `RUN_PREFIX=EV-38S-AFTER` (or charter prefix)  
2. Frozen LO + derived A1–A4 plans as authority  
3. Compare M-02/M-03/M-05 against [38R-4](../../2026-06-06-sprint-38r-instructional-episode-plan-design-proof/observations/38R-4-proof-validation-design.md) targets  
4. Baseline: `EV-38M-AFTER`; floor: `EV-38P-AFTER`  
5. Educational outcome evaluation deferred to 38S-4/38S-5  

---

## Success condition

> "Has Episode Plan become the authoritative planner and DLA become an enforceable population layer?"

**Yes.** Episode Plan beats drive obligation scaffold; DLA output is merged into plan order with mandatory tags; validation runs automatically; harness path is wired for proof execution.

---

## Implementation artefacts

| Artefact | Path |
|----------|------|
| DLA integration module | `lib/episode-plan-dla-integration.js` |
| V1 templates + LO derivation | `lib/episode-plan-v1-templates.js` |
| Workflow wiring | `app.js` |
| Script load | `index.html` |
| Harness | `ev-38l-inflation-pipeline-capture-once.mjs` |
| Integration tests | `tests/episode-plan-dla-integration.test.js` |

---

## Success contribution

| SC | Target | Status |
|----|--------|:------:|
| **SC-3** | `instructional_function` tagging implemented | **PASS** |
| **SC-5** | AC-01–AC-10 enforced | **PASS** (validators active) |

---

## Status

| Field | Value |
|-------|-------|
| Phase | 38S-3 |
| Status | **COMPLETE** |
| Next | [38S-4 Proof execution](38S-4-proof-execution.md) |
