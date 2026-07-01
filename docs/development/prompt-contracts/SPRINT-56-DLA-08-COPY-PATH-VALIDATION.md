# Sprint 56 DLA-08 — Copy-Path External Generation Validation

**Status:** Complete  
**Date:** 2026-07-01  
**Workflow:** Self-directed RNA/HCV learner-page · `step_design_learning_activities`  
**Predecessor evidence:** [SPRINT-55-DLA-EMITTED-PROMPT-AUDIT.md](../sprints/2026-06-29-sprint-55-educational-product-experience/SPRINT-55-DLA-EMITTED-PROMPT-AUDIT.md) · [SPRINT-55-CLOSURE-REPORT.md](../sprints/2026-06-29-sprint-55-educational-product-experience/SPRINT-55-CLOSURE-REPORT.md)  
**SSOT spec:** [SPRINT-56-DLA-SSOT-SPEC.md](SPRINT-56-DLA-SSOT-SPEC.md)

---

## 1. Validation setup

| Item | Value |
|------|-------|
| Brief | RNA/HCV self-directed learner-page (same as Sprint 55/56 tests) |
| Path | Copy → `buildWorkflowStepInstructions` → `resolveStepPromptText` → `applyWorkflowStepRuntimePromptAugmentations` |
| Upstream captures | Synthetic `learning_outcomes` (LO1–LO5) + derived `episode_plans` (5 activities, V1) embedded via `ensureDlaEpisodePlanInputBindingsForSteps` |
| Prompt version | Post-DLA-05 SSOT rationalisation (`LD-GUIDED-LEARNING-SCAFFOLD-CONTRACT` sole scaffold authority) |
| Emitted core size | **37,745 chars** (includes upstream episode_plans population block + PF-11 embed) |
| Copy wrapper size | **44,419 chars** |
| DLA-05 core-only baseline (no upstream embed) | **31,551 chars** (Sprint 56 budget test) |
| Sprint 55 emitted core baseline | **49,949 chars** |
| Model | `gpt-4.1-mini` (OpenAI Responses API; `PRISM_PROBE_MODEL` default) |
| Temperature | 0.35 |
| Artefacts | `artefacts/dla-08-rna-hcv-emitted-copy-prompt.txt` · `tests/fixtures/dla/rna-hcv-dla-08-run.json` |
| Repro runner | `node scripts/probe-dla-08-copy-validation.js` |

---

## 2. Generated output summary

| Metric | Value |
|--------|------:|
| Activities generated | **5** (A1–A5, mapped LO1–LO5) |
| `required_materials` rows populated | Yes (DLA-WB / obligation population honoured) |
| `intellectual_coherence_bridge` present | 4/5 (A2–A5; absent on A1) |
| Cognition fields used | `self_explanation_prompt` (A1–A2), `conceptual_contrast_prompt` (A3–A4), `uncertainty_tension_prompt` (A5) |
| `reasoning_orientation` populated | 0/5 |
| Topic-specific RNA/HCV prose | **Weak** — several preambles reference “LO1” / “LO2” generically |

**Qualitative note:** Output reads as obligation-population-compliant (beat lists mirrored in `learner_task`) but scaffold fields remain instructional labels or short stems, not 50–120 word educational prose. Preamble length improved vs Sprint 55 latest run but still predominantly below the 50-word floor.

---

## 3. Scoring methodology

Word floors per SSOT (`lib/ld-guided-learning-scaffold.js` `FIELD_WORD_RANGES`):

| Field | Floor | Ceiling |
|-------|------:|--------:|
| `activity_preamble` | 50 | 120 |
| `reasoning_orientation` | 35 | 80 |
| `self_explanation_prompt` | 35 | 80 |
| `conceptual_contrast_prompt` | 35 | 80 |
| `argument_structure_hint` | 35 | 80 |
| `transfer_or_application_task` | 35 | 80 |
| `expected_output` | 30 | 70 |
| `intellectual_coherence_bridge` | 30 | 60 |
| `support_note` | 20 | 70 |

**Per-activity pass (mandatory):**

1. `activity_preamble` ≥ 50 words  
2. `expected_output` ≥ 30 words  
3. ≥ 1 cognition field (`reasoning_orientation`, `self_explanation_prompt`, `conceptual_contrast_prompt`, `argument_structure_hint`, `transfer_or_application_task`) ≥ 35 words  
4. `intellectual_coherence_bridge` ≥ 30 words on every activity after the first (when sequence has 2+ activities)

Evaluator cross-check: `evaluateGuidedLearningScaffoldEvidence()` (includes anti-terse heuristics).

**DLA-08 threshold:** ≥ **80%** of activities meet all mandatory floors.

---

## 4. Scoring table — DLA-08 post-DLA-05 run

| Activity | Preamble | Cognition field(s) | Cognition wc | Expected output | Bridge | Mandatory pass |
|----------|----------|-------------------|-------------:|----------------:|-------:|:--------------:|
| A1 | 36 ❌ | `self_explanation_prompt` | 27 ❌ | 20 ❌ | — | ❌ |
| A2 | 45 ❌ | `self_explanation_prompt` | 21 ❌ | 20 ❌ | 26 ❌ | ❌ |
| A3 | 48 ❌ | `conceptual_contrast_prompt` | 21 ❌ | 26 ❌ | 28 ❌ | ❌ |
| A4 | 50 ✓ | `conceptual_contrast_prompt` | 18 ❌ | 24 ❌ | 23 ❌ | ❌ |
| A5 | 55 ✓ | *(none ≥ 35)* `uncertainty_tension_prompt` only | — ❌ | 28 ❌ | 22 ❌ | ❌ |

**Summary**

| Metric | Result |
|--------|--------|
| Activities meeting all mandatory floors | **0 / 5 (0%)** |
| `evaluateGuidedLearningScaffoldEvidence` | **FAIL** (5/5 activities flagged) |
| DLA-08 threshold (≥ 80%) | **FAIL** |

### Fields most commonly below floor (DLA-08)

| Issue | Activities affected |
|-------|--------------------:|
| `expected_output` below 30 words | 5/5 |
| No cognition field ≥ 35 words | 5/5 |
| `intellectual_coherence_bridge` below 30 words (or missing) | 5/5 |
| `activity_preamble` below 50 words | 3/5 |
| Populated cognition field below 35 words | 4/5 |

### Missing scaffold fields

| Field | Notes |
|-------|-------|
| `reasoning_orientation` | Absent on all 5 activities |
| `argument_structure_hint` | Absent (A5 uses `uncertainty_tension_prompt` instead) |
| `transfer_or_application_task` | Absent |
| `support_note` | Absent |
| `intellectual_coherence_bridge` | Missing on A1 |

---

## 5. Comparison — Sprint 55 failure pattern

### Sprint 55 latest run (`rna-hcv-latest-run.json`)

| Activity | Preamble | Cognition wc | Expected output | Mandatory pass |
|----------|----------|-------------|----------------:|:--------------:|
| A1 | 22 | `reasoning_orientation` 20 | 20 | ❌ |
| A2 | 23 | `self_explanation_prompt` 17 | 18 | ❌ |
| A3 | 19 | `conceptual_contrast_prompt` 12 | 15 | ❌ |
| A4 | 18 | `argument_structure_hint` 11 | 16 | ❌ |
| A5 | 15 | `transfer_or_application_task` 15 | 21 | ❌ |

| Metric | Sprint 55 latest | DLA-08 post-DLA-05 |
|--------|-----------------:|-------------------:|
| Activities meeting mandatory floors | 0/5 (0%) | 0/5 (0%) |
| Mean `activity_preamble` words | 19.4 | **46.8** (+27.4) |
| Mean `expected_output` words | 18.0 | 23.6 (+5.6) |
| Activities with preamble ≥ 50 | 0 | **2** (A4, A5) |
| `intellectual_coherence_bridge` populated | 0 | 4 |

### Interpretation

| Sprint 55 root cause | DLA-05 / DLA-08 disposition |
|----------------------|----------------------------|
| ~50k prompt accretion, duplicate scaffold layers | **Resolved** — core down to ~32k (SSOT-only scaffold) |
| Conflicting 25–80 / 30–70 ranges | **Resolved** — single authoritative range line |
| Presence-only gates before word-count gate | **Partially resolved** — unified PRE-EMIT; domain-pack IFP gates remain |
| Terse external outputs despite requirements in prompt | **Persists** — 0% mandatory pass; marginal preamble lengthening only |
| Obligation-population primacy + “Return only JSON” compression | **Persists** — model still prioritises materials/tasks over scaffold prose |
| EQF “reduce scaffolding” conflict | **Addressed** (DLA-07) |
| SSOT block late in prompt | **Addressed** (DLA-07) |

**Conclusion:** DLA-05 rationalisation improved prompt architecture and produced modestly longer preambles, but did **not** achieve the DLA-08 quality threshold. The Sprint 55 failure mode (terse scaffold strings on Copy path) is **not cleared**.

---

## 6. Pass / fail judgement

| Criterion | Result |
|-----------|--------|
| Emitted prompt ≤ 32k (core-only, no upstream embed) | **PASS** (31,551) |
| SSOT single authority in emitted prompt | **PASS** (DLA-05 guards) |
| Copy-path external generation ≥ 80% activities meet word floors | **FAIL** (0%; marginal improvement after DLA-07) |

**Overall DLA-08 verdict: FAIL** (unchanged after DLA-07 rerun — see §9)

---

## 7. Recommended next action

### Completed (DLA-07)

1. ~~EQF brevity conflict~~ — qualified on DLA learner-page path  
2. ~~PEL one-cue trim~~ — SSOT word-floor line replaces one-cue minimisation  
3. ~~SSOT block position~~ — SSOT precedes EQF/PEL  
4. ~~JSON brevity qualifier~~ — runtime pointer added  

### Still required

1. **Domain-pack / IFP salience** — presence-only gates and obligation-population opening framing still compete with PRE-EMIT (DLA-09 candidate).
2. **Re-run DLA-08** after domain-pack tuning — DLA-07 rerun did **not** meet ≥80%.
3. **Optional:** `gpt-4.1` (non-mini) spot-check to rule out model capacity.

### Not recommended

- Adding new scaffold prompt layers.
- Relying on capture-side repair for Copy-evaluated quality.

---

## 8. Traceability

| Backlog item | This validation |
|--------------|-----------------|
| DLA-08 | Copy-path spot-check — **FAIL** |
| DLA-07 | EQF / PEL / SSOT position — **required** |
| DLA-05 | Prompt size + SSOT — **PASS**; output quality — **not sufficient** |

---

## 9. Post-stabilisation update (2026-07-01)

**Evidence:** [SPRINT-56-DLA-STABILISATION-PASS.md](SPRINT-56-DLA-STABILISATION-PASS.md) · semantic framing · cognition remediation

### 9.1 Prompt size trajectory

| Stage | Core (no upstream embed) | ≤32k |
|-------|------------------------:|:----:|
| DLA-05 baseline | 31,551 | ✓ |
| Post-semantic framing | ~32,187 | ✗ |
| Post-cognition remediation | ~33,651 | ✗ |
| **Post-stabilisation** | **~31,932** | **✓** |

Copy wrapper (probe, with upstream embed): **~38,253 chars**.

### 9.2 External generation — multi-probe results

**Settings:** `gpt-4.1-mini`, temperature 0.35 · `node scripts/probe-dla-08-batch.js 3`

| Probe phase | Best run | Worst run | Mean pass |
|-------------|----------|-----------|-----------|
| Semantic framing | 20% | 0% | — |
| Cognition remediation | **60%** | 0% | — |
| **Stabilisation batch** | **40%** | **0%** | **13.3%** |

| Criterion | Result |
|-----------|--------|
| ≥80% mandatory pass on any single run | **FAIL** (peak 60% cognition-best; stabilisation-best 40%) |
| ≥80% reliable across 3 runs | **FAIL** (0/3 runs met threshold) |
| Core ≤32k | **PASS** |
| Cognition fields trend above SSOT floors (best runs) | **Partial** — confirmed on cognition-best; unstable in batch |
| Bridge mandatory clarification | **Partial** — bridges present in stabilisation runs; A2 omission in cognition-best |

**Field-level variance (highest):** `self_explanation_prompt`, `activity_preamble`, `expected_output`, `intellectual_coherence_bridge`.

**Failure modes:** borderline cognition length (32–34w); run-specific preamble collapse (41w mean); occasional missing bridge on A2.

### 9.3 Updated pass / fail judgement

| Criterion | Result |
|-----------|--------|
| Emitted prompt ≤ 32k (core-only) | **PASS** (~31,932) |
| SSOT single authority | **PASS** |
| Copy-path ≥ 80% mandatory floor compliance | **FAIL** (mean 13.3%; intermittent peaks only) |

**Overall DLA-08 verdict: FAIL** — architecture and budget goals met; learner-facing scaffold reliability not production-ready on Copy path alone.

### 9.4 Recommended next action (post-stabilisation)

1. **Accept partial improvement** — metadata/prose and cognition-genre hypotheses confirmed; 60% peak shows floors are reachable.
2. **Enable capture-side scaffold repair** for borderline/missing-bridge fields (`evaluateGuidedLearningScaffoldEvidence`).
3. **Optional:** temperature 0.2 spot-check; compact `expected_output` exemplar restore (~200 chars) if preamble variance persists.
4. **Do not** add prompt layers, PRE-EMIT systems, or weaken SSOT floors.

### 9.5 Artefacts

| File | Role |
|------|------|
| `rna-hcv-dla-08-cognition-best-run.json` | Cognition remediation 60% run |
| `rna-hcv-dla-08-stab-run-{1,2,3}.json` | Stabilisation batch |
| `rna-hcv-dla-08-run.json` | Latest (stab run 3, 40%) |
| `artefacts/dla-08-stabilisation-batch-report.json` | Batch aggregate |
