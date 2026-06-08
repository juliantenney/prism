# 38S Prompt Sanitisation Phase 2A — DLA Only

**Date:** 2026-06-08  
**Status:** **COMPLETE**  
**Type:** DLA pack subtraction (IFP planning blocks removed)  
**Predecessor:** [Phase 1 deletion potential](38S-prompt-sanitisation-phase-1-deletion-potential.md) · [Prompt responsibility audit](38S-prompt-responsibility-audit-dla-gam-page-after-episode-plan-v1.md)

---

## Executive summary

Phase 2A removed **superseded DLA planning blocks** (IFP-00, 01, 02, 03, 07, 08) from the pack prompt while preserving obligation gates (IFP-04–10), DLA-WB, JSON schema, and LD-MATERIALS-COPY spec role.

**Result:** No regressions on population contract, Episode Plan workflow policy, or `EV-38S-AFTER-4` production chase (`proofOk` / `roleOk` / `fullOk` all true).

**Recommendation:** **Proceed to Phase 2B (GAM dedupe)** — DLA subtraction is safe at the contract/harness layer; manual LLM re-run still needed to confirm educational depth improvement.

---

## 1. What was removed

| Block | ~Chars removed | Superseded by |
|-------|---------------:|---------------|
| IFP-00 SEQUENCE | ~1,070 | Episode Plan derive + population contract + runtime 38S block |
| IFP-01 ARCHETYPE SELECTION | ~730 | `episode_plan.archetype` |
| IFP-02 ARCHETYPE TEMPLATES | ~2,030 | `episode_plan.beats[].function` |
| IFP-03 KM TRIGGERS | ~1,055 | Frozen derive + `FUNCTION_SPECS` (code) |
| IFP-07 SESSION ARC | ~600 | Learning Sequence + brief (cross-activity) |
| IFP-08 derive bridge | ~270 | `episode-plan-population-contract.js` |
| **Total `promptTemplate`** | **~5,724** | |
| `defaultPromptNotes` trim | ~378 | |

### Preserved (unchanged)

- IFP-04 INFERENCE CONTRACTS  
- IFP-05 ANTI-SHELL  
- IFP-06 ANTI-SPOILER  
- IFP-09 DEPTH FLOORS  
- IFP-10 CLOSURE EMISSION GATES  
- Full DLA-WB self-study workbook block  
- JSON output schema + PRE-EMIT gates  
- LD-MATERIALS-COPY spec-only role  

### Minimal reference updates (not new planning logic)

- IFP header: states `upstream episode_plans owns archetype and beat order — do not replan`
- `IFP-00 A–K` → `IFP-04–10` in PRE-EMIT gate text
- DLA **Input** metadata: `learning_outcomes, episode_plans`
- **Workflow policy restored** (38S prerequisite that was uncommitted on disk): `Design Episode Plan` in `canonicalSteps`, dependencies, precedence

---

## 2. Prompt size before / after

| Metric | Before | After | Δ |
|--------|-------:|------:|--:|
| DLA `promptTemplate` | 30,550 | **24,826** | **−5,724 (−18.7%)** |
| DLA `defaultPromptNotes` | 2,671 | **2,293** | −378 |
| **DLA pack total** | **33,221** | **27,119** | **−6,102 (−18.4%)** |

Metrics artefact: `artefacts/EV-38S-2A-dla-prompt-metrics.json`

Script (reproducible): `scripts/apply-phase-2a-dla-sanitize.mjs`

**Note:** Phase 1 estimated ~55–70% DLA reduction after full IFP strip + DLA-WB dedupe. Phase 2A achieved **~18%** because only planning blocks were removed — DLA-WB and IFP-04–10 intentionally retained.

---

## 3. DLA output comparison

Phase 2A changes **prompt text only**. DLA **post-capture behaviour** is unchanged:

| Check | Before Phase 2A | After Phase 2A |
|-------|:---------------:|:--------------:|
| `deriveEpisodePlansFromLearningOutcomes` | Unchanged | Unchanged |
| `applyPopulationContractToLearningActivities` | Pass | **Pass** (10/10 integration tests) |
| `validateLearningActivitiesPopulationContract` | Pass | **Pass** |
| Beat → obligation tagging (`instructional_function`, `plan_beat_index`) | Present | **Present** |
| V1 archetypes from Episode Plan | Frozen | **Frozen** |
| Invented taxonomy gate | Rejects | **Rejects** |

**Saved artefact replay** (`EV-38S-AFTER-4-dla-learning-activities.json`): Population contract validation still passes against saved Episode Plan — structural output unchanged because merge/enforcement is code-driven, not pack-IFP-driven.

**LLM raw output:** Not re-run in this phase (no live model call). Expectation: model no longer receives contradictory “select archetype / function template” instructions; should align better with runtime 38S population block.

---

## 4. Verification results

### Automated

| Suite | Result |
|-------|--------|
| `tests/workbook-contract-prompt-surface.test.js` | **Pass** (38S-2A assertions updated) |
| `tests/workflow-ld-episode-plan-step.test.js` | **8/8 pass** |
| `tests/episode-plan-dla-integration.test.js` | **10/10 pass** |
| `tests/episode-plan-population-contract.test.js` | **Pass** |
| `ev-38s-production-pipeline-chase.mjs` | **Pass** — `proofOk`, `roleOk`, `fullOk` |

### Acceptance criteria (from task)

| Criterion | Met? |
|-----------|:----:|
| Valid JSON still produced | ✅ (schema unchanged) |
| `required_materials` still produced | ✅ (population contract) |
| Activity structure preserved | ✅ |
| Episode Plan mappings preserved | ✅ |
| No invented archetypes | ✅ (V1 gate) |
| No invented beat sequences | ✅ (derive frozen) |
| Population contract passes | ✅ |
| Full pipeline no regression | ✅ (chase harness) |

---

## 5. Regressions found

**None** at contract, workflow-policy, or fidelity-replay layers.

**Residual risks (not regressions):**

1. **Context line** still opens with `learning_outcomes` only in `promptTemplate` Context (Input metadata lists `episode_plans`). Runtime injects upstream JSON — acceptable for Phase 2A subtraction scope.
2. **DLA-WB-25** still references `ARC-01..06` session-fade language (workbook delivery_notes); IFP-07 removed but workbook row retained per charter.
3. **Educational depth** not re-measured — requires manual KM→LO→Episode Plan→DLA→GAM→Page run with live LLM.

---

## 6. Recommendation — proceed to Phase 2B?

**Yes — proceed to Phase 2B (GAM dedupe / runtime PEL conflict trim).**

| Rationale | Detail |
|-----------|--------|
| DLA subtraction safe | No contract or replay regression |
| Planning authority clearer | ~5.7k chars of contradictory IFP planning removed |
| Depth not yet proven | IFP-04–10 + full DLA-WB still ~19k chars — further DLA-WB dedupe is Phase 2B/3 |
| GAM is next target | Phase 1 identified GAM-WB ↔ GAM-PRES duplication and PEL “short/concise” runtime conflict |

**Do not yet:**

- Remove IFP-04–10 or DLA-WB (obligation quality layer)  
- Change Episode Plan derive, population contract, GAM pack, Page, or renderers  

---

## Files changed

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | DLA IFP removal; workflow policy restore; DLA Input |
| `tests/workbook-contract-prompt-surface.test.js` | 38S-2A prompt surface assertions |
| `scripts/apply-phase-2a-dla-sanitize.mjs` | Reproducible sanitisation script |
| `artefacts/EV-38S-2A-dla-prompt-metrics.json` | Size metrics |

**Not changed:** `lib/episode-plan-*`, `app.js` runtime (except pre-existing 38S wiring), GAM, Page, Learning Sequence.
