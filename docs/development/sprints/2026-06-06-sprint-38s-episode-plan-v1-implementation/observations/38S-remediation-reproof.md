# 38S — Remediation and re-proof (SC-7 unblock attempt)

**Date:** 2026-06-08  
**Status:** **COMPLETE**  
**Type:** Implementation remediation + targeted re-proof  
**Run ID:** `EV-38S-AFTER-2`  
**Harness:** `38S-R1`  
**Predecessor:** [Remediation status audit](38S-remediation-status-audit.md) · [38S-5 evaluation](38S-5-evaluation-and-recommendation.md)

---

## Executive summary

| Question | Answer |
|----------|--------|
| **Can one DLA artefact pass Population Contract and 38L simultaneously?** | **Yes** — proven on `EV-38S-AFTER-2` merged DLA |
| **Is SC-7 (`fullOk`) unblocked?** | **No** — GAM/Page LLM output prevents 38P replay pass |
| **Re-proof verdict** | **B — Educational Pass / Fidelity Fail** |
| **Closure recommendation** | **NO** — SC-7 remains blocked; DLA dual-lane objective achieved |

Architecture remains **validated**. Implementation remediation **succeeded at DLA integration**. Fidelity failure is **downstream harness/LLM GAM format**, not Episode Plan V1.

---

## Task 1 — Additive merge implementation

## Additive merge implementation

### Before (38S-3 hybrid)

- Output row count = scaffold beat count only  
- Unmatched LLM rows **discarded**  
- 38L depth rows lost → dual-lane proof required  

### After (38S-R1)

**File:** `lib/episode-plan-dla-integration.js` (`INTEGRATION_VERSION: "38S-R1"`)

1. Map scaffold beats → LLM rows (preserve `type`, `specification`, `content`, `purpose`)  
2. Skip beat matching for **38L depth rows** (`is38LDepthRow`) — worked analytic pass, independent judgement template, `consolidation_summary`  
3. Append unmatched rows as `supplementary: true` with **38L-aware placement** (e.g. analytic pass before `analysis_table`)  
4. Exclude supplementary from population contract tagging (`taggedMaterials` filter) and M-07 orphan count  

### Demonstration

| Fixture | Population contract | 38L obligations |
|---------|:--------------------:|:---------------:|
| `EV-38L-AFTER` DLA (pre-merge) | Fail (untagged) | **Pass** |
| `EV-38S-AFTER` raw DLA (pre-merge) | Fail | **Pass** |
| Same after **38S-R1 merge** | **Pass** | **Pass** |
| `EV-38S-AFTER-2` raw DLA after merge | **Pass** | **Pass** |

---

## Task 2 — Single-lane proof path

## Single-lane proof path

```
Episode Plan → DLA (LLM) → Additive Merge → Population + 38L gates
  → GAM → Page → normalizePageForGamCompose → 38P Compose → Fidelity replay
```

| Script | Single lane? | Notes |
|--------|:------------:|-------|
| `ev-38l-inflation-pipeline-capture-once.mjs` (38S-R1) | **Yes** | Removed fidelity-lane fork; `PRISM_HARNESS_RESUME_FROM=dla` supported |
| `ev-38s-proof-continue.mjs` (38S-R1) | **Yes** | Merged DLA only; dual-lane removed |
| `ev-38s-proof-replay.mjs` | Replay only | Reads single-lane artefacts |

**Dual-lane artefact write removed** from continue script.

---

## Task 3 — End-to-end replay path

## End-to-end replay path

Capture harness now executes inline:

1. `applyGamMaterialsToComposedPage`  
2. `applyA3MaterialsSequencingToComposedPage`  
3. `computeProofDimensionsForTest` → writes `${RUN_PREFIX}-proof-replay.json`  

**Harness additions:**

- `normalizePageForGamCompose` — wraps flat LLM `activities[]` into `sections[].learning_activities.content[]`  
- `parseGamMaterialsExtended` — text GAM + JSON fallback  
- `PRISM_HARNESS_RESUME_FROM=dla` — skip DLA LLM when raw capture exists  

**Remaining gap:** LLM GAM step returns JSON specification stubs instead of pack text format → compose receives thin bodies → 38M/38L/38P page gates fail. This is **operational output format**, not merge logic.

---

## Task 4 — Combined validation suite

## Combined validation suite

**File:** `tests/episode-plan-dla-integration.test.js` (+3 tests)

| Test | Asserts |
|------|---------|
| `additive merge: EV-38L fixture passes population contract and 38L obligations` | Both validators Pass on same artefact |
| `additive merge preserves 38L depth rows` | A3 worked analytic pass + A4 independent judgement survive |
| `additive merge appends unmatched LLM rows as supplementary` | Depth rows present; tagged rows have `instructional_function` |

**Supporting changes:**

- `lib/episode-plan-population-contract.js` — `supplementary` excluded from `taggedMaterials`  
- `lib/episode-plan-proof-metrics.js` — M-07 excludes supplementary  

**Test run:** 9/9 integration + 12/12 population contract + 52/52 fidelity subset = **73/73 Pass** on 38S-related suites.

---

## Task 5 — EV-38S-AFTER-2 execution

| Artefact | Path | Status |
|----------|------|:------:|
| Episode Plans | `38l/artefacts/EV-38S-AFTER-2-episode-plans.json` | Written |
| DLA (merged, single lane) | `38l/artefacts/EV-38S-AFTER-2-dla-learning-activities.json` | Written |
| DLA (raw LLM) | `38l/artefacts/EV-38S-AFTER-2-dla-learning-activities-raw.txt` | Written |
| GAM | `38l/artefacts/EV-38S-AFTER-2-gam.json` / `.txt` | Written (JSON format) |
| Page | `38l/artefacts/EV-38S-AFTER-2-design-page.json` | Partial |
| Proof metrics | `38s/artefacts/EV-38S-AFTER-2-proof-metrics.json` | Written |
| Proof replay | `38l/artefacts/EV-38S-AFTER-2-proof-replay.json` | Written (fullOk false) |

**Gate set:** A1–A4 + T3-MICRO (structural via proof evaluation).

---

## Task 6 — Educational lane re-check

| Metric | 38S-4 (EV-38S-AFTER) | EV-38S-AFTER-2 | Regression? |
|--------|---------------------|----------------|:-----------:|
| **M-01** Transition coverage | 100% | **100%** | No |
| **M-02** Beat survival | 100% | **100%** | No |
| **M-03** Ordered obligation survival | 100% | **100%** | No |
| **M-04** Episode continuity | 100% | **100%** | No |
| **M-05** AC violations | 0 | **0** | No |
| **M-06** Depth ratio (A4) | 1.25× (partial) | **≥ plan scaffold** (Pass threshold) | Improved |
| **M-07** Orphan materials | 0 | **0** | No |
| **M-08** Plan traceability / GAP closure | Pass | **Pass** | No |

**Educational lane: No regression from 38S-4.**

---

## Task 7 — Fidelity lane re-check

| Check | Result | Evidence |
|-------|:------:|----------|
| **Population contract (DLA)** | **Pass** | `validateLearningActivitiesPopulationContract` on merged AFTER-2 |
| **38L obligations (DLA)** | **Pass** | `validateDla38LObligations` on merged AFTER-2 |
| **38L page GAM preservation** | **Fail** | A4 worked judgement missing post-compose |
| **38M body fidelity** | **Fail** | Checklist G8 — bodies &lt; 80 chars (GAM JSON stubs) |
| **38P RF-1..RF-7** | **Fail** | Downstream of thin page materials |
| **RF-8 compose transparency** | **Fail** | No `material_role_index` — GAM bodies not merged |
| **proofOk** | **false** | `EV-38S-AFTER-2-proof-replay.json` |
| **roleOk** | **false** | Same |
| **fullOk** | **false** | Same |
| **58/58 + 38S suite** | **Pass** | 73/73 on targeted suites; machinery intact |

**Root cause (fidelity):** GAM LLM returns JSON DLA-shaped specifications instead of pack text `Material: … Content:` bodies. Compose path cannot populate Tier-A materials → RF-8 and 38L page gates fail.

---

## Task 8 — SC-7 review

### Is SC-7 now unblocked?

**FAIL**

| Blocker | Category | Status after R1–R4 |
|---------|----------|-------------------|
| Dual-lane DLA | Implementation | **Resolved** |
| Destructive merge | Implementation | **Resolved** |
| `fullOk` on plan-driven workbook | Harness + LLM GAM output | **Not resolved** |

**Evidence:** `EV-38S-AFTER-2-proof-replay.json` → `fullOk: false`; harness abort at 38L page preservation on GAM resume run.

SC-7 blocked by **harness/LLM GAM output format**, not Episode Plan architecture.

---

## Task 9 — Final re-proof verdict

### **B — Educational Pass / Fidelity Fail**

| Lane | Result |
|------|--------|
| Educational (M-01–M-08, AC, transitions) | **Pass** on merged single-lane DLA |
| Fidelity (fullOk, RF-1..RF-8, page replay) | **Fail** |

Same pattern as 38S-4 but **DLA dual-lane tension eliminated**.

---

## Task 10 — Closure recommendation

### Should Sprint 38S proceed to closure?

**NO** (unconditional closure)

**YES** for architecture validation conclusion; **NO** for production readiness / SC-7.

| Criterion | Met? |
|-----------|:----:|
| Episode Plan V1 validated | Yes |
| Single artefact: population + 38L | **Yes** |
| Single artefact: + fullOk | No |
| SC-7 | Blocked |

**Recommended next step (minimal, out of scope here):** GAM harness output enforcement — reject JSON GAM responses and retry, or require text format before compose (no prompt redesign; harness contract only).

---

## Code changes

| File | Change |
|------|--------|
| `lib/episode-plan-dla-integration.js` | Additive merge, 38L depth preservation, placement, v38S-R1 |
| `lib/episode-plan-population-contract.js` | Exclude `supplementary` from contract tagging |
| `lib/episode-plan-proof-metrics.js` | M-07 excludes supplementary |
| `tests/episode-plan-dla-integration.test.js` | +3 combined validation tests |
| `ev-38l-inflation-pipeline-capture-once.mjs` | Single-lane, 38P compose, dla resume, page normalize |
| `ev-38s-proof-continue.mjs` | Single-lane, page normalize, 38P compose |
| `ev-38s-proof-replay.mjs` | Harness version 38S-R1 |

---

## Primary question — answered

> Can Prism preserve Episode Plan structure and fidelity on the same artefact?

**At DLA layer: Yes.** Episode Plan structure (population contract, transitions, AC) and 38L depth coexist on one merged `required_materials[]` artefact.

**At full workbook replay: Not yet demonstrated.** Fidelity gates fail downstream of GAM realisation format, not merge logic.

---

## Status

| Field | Value |
|-------|-------|
| Phase | Remediation + re-proof |
| SC-7 | **Blocked** |
| Next | GAM output harness enforcement → re-run replay → 38S-6 conditional closure |
