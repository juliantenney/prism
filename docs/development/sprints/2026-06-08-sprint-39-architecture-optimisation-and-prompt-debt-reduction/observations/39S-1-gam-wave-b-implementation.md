# 39S Workstream A — GAM Wave B Implementation

**Date:** 2026-06-09  
**Status:** **COMPLETE**  
**Type:** Runtime augmentation optimisation (Package 1)  
**Sprint:** [Sprint 39](../README.md)  
**Authority:** [sprint-39-work-packages.md](../sprint-39-work-packages.md) · [39S-0-baseline-prompt-metrics.md](39S-0-baseline-prompt-metrics.md)  
**Metrics:** [artefacts/EV-39S-GAM-WAVE-B-metrics.json](../artefacts/EV-39S-GAM-WAVE-B-metrics.json)

---

## Executive summary

GAM Wave B consolidates three runtime self-study markers into one authoritative block, removes duplicate PEL reasoning contract injection on the GAM path, and rewrites the PEL reasoning-materials block to back-reference **GAM-PRES-08** without thinness cues.

**Pack unchanged** (15,712 chars). **LD-MATERIALS-COPY**, **LD-TABLE-FIDELITY**, and **LD-MATH-RENDER** injection paths unchanged. All Package 1 validation suites pass; production chase reports `fullOk: true`, `proofOk: true`, `roleOk: true`.

---

## Changes implemented

### GAM-B2 — Merged self-study materials marker

| Before (3 blocks) | After (1 block) |
|-------------------|-----------------|
| `buildSelfDirectedGamReadingSufficiencyPromptBlock` | `buildSelfDirectedGamSelfStudyMaterialsPromptBlock` |
| `buildSelfDirectedGamLearnerVoicePromptBlock` | (composed from existing bullet sources) |
| `buildSelfDirectedTimelineSequencingAlignmentPromptBlock` | |

- **Marker:** `Self-directed learner-page self-study materials (auto-applied):`
- **Dedup:** `gamSelfStudyMaterialsMarkerPresent()` — skips injection when merged or any legacy marker is present
- **Semantics:** All reading, voice, and timeline bullets preserved verbatim (composed from existing builders)
- **Location:** `app.js` — `applySelfDirectedLearnerPageStepScaffoldsToDraft` GAM branch

### GAM-B3 — PEL reasoning contract removed from GAM path

- `applyPedagogicEnrichmentContractScaffoldToDraft`: `buildPelReasoningContractPromptBlock` now injects on **DLA only** (`isDla`), not GAM
- GAM retains **reasoning-materials** block when `reasoning_contract` PEC resolves (separate branch)

### GAM-B4 — Reasoning materials block rewritten

`buildSelfDirectedGamPelReasoningMaterialPromptBlock` updated:

| Removed | Added |
|---------|-------|
| *short worked micro-example* | GAM-PRES-08 (A1) ≥120-word walkthrough |
| *concise* verification/closure cues | GAM-PRES-08 (V1) verification + repair |
| *2–3 items* closure bullets | GAM-PRES-08 (T1)/(E1) ≥80-word transfer/closure |
| — | Anti-redundancy must not thin below GAM-PRES-08 minima |

### GAM-B5 — Unchanged contracts verified

| Contract | GAM path | Change |
|----------|----------|--------|
| LD-TABLE-FIDELITY | `applyLdTableFidelityContractToDraft` in GAM scaffold | **None** |
| LD-MATERIALS-COPY | `applyLdMaterialsCopyContractToDraft` in GAM scaffold | **None** |
| LD-MATH-RENDER | `applyMathSafeOutputContractToDraft` in augmentation chain | **None** |

### Out of scope (confirmed untouched)

- GAM pack §6 `promptTemplate` / `defaultPromptNotes`
- GAM-PRES-07/08/09/10 pack text
- Episode Plan, DLA, Design Page
- `gam-output-format.js` validators
- Workbook contract pack rows

---

## Measured results

### Inflation self-directed (production-chase scenario, PEC inactive)

| Metric | Step 1 baseline | Wave B after | Δ |
|--------|----------------:|-------------:|--:|
| Pack combined | 15,712 | 15,712 | 0 |
| Augmented | 27,659 | **27,542** | **−117** |
| Runtime Δ | 12,514 | **12,397** | **−117** |

**Auto-applied blocks:** 6 → 4 (three legacy markers → one merged marker).

### Marx self-study PEC-active (estimated comparison)

| Metric | Pre-Wave B (est.) | After | Δ |
|--------|------------------:|------:|--:|
| Augmented | 30,316 | **29,803** | **−513** |

Estimate components: inflation baseline (27,659) + PEL reasoning on GAM (618) + pre-rewrite reasoning materials (2,039).

**≥500 char reduction target:** met on PEC-active self-study path; **not** met on inflation-only path (documented — PEC inactive, no PEL blocks injected).

### Block-level standalone sizes

| Block | Before | After | Δ |
|-------|-------:|------:|--:|
| Reading + voice + timeline (separate) | 3,644 | — | — |
| Merged self-study materials | — | 3,530 | **−114** |
| PEL reasoning on GAM | 618 (when PEC) | 0 | **−618** |
| Reasoning materials | 2,039 | 2,261 | +222 |

---

## Validation

| Command | Result |
|---------|--------|
| `node --test tests/workbook-contract-prompt-surface.test.js` | **47/47 pass** |
| `node --test tests/gam-output-format.test.js` | **5/5 pass** |
| `node --test tests/workflow-pel-reasoning.test.js` | **22/22 pass** |
| `node docs/.../ev-38s-production-pipeline-chase.mjs` | **fullOk: true, proofOk: true, roleOk: true** |

### Prompt-surface assertions (GAM)

| Check | Status |
|-------|:------:|
| Merged self-study marker present | ✓ |
| Legacy reading/voice/timeline markers absent | ✓ |
| GAM-PRES-08 referenced in material voice bullets | ✓ |
| No `short worked micro-example` in active GAM path | ✓ |
| PEL reasoning contract absent on GAM | ✓ |
| Reasoning materials present when PEC `reasoning_contract` resolves | ✓ |

---

## Files touched

| File | Change |
|------|--------|
| `app.js` | Merged marker, PEL path split, reasoning materials rewrite, test API exports |
| `tests/workflow-pel-reasoning.test.js` | GAM PEL expectations updated |
| `tests/workflow-pel-orientation.test.js` | Merged marker expectations |
| `tests/workflow-self-directed-learner-page-formatting.test.js` | GAM scaffold marker expectations |
| `docs/.../scripts/probe-39s-gam-wave-b-metrics.mjs` | **New** — Wave B metrics probe |
| `docs/.../scripts/probe-39s-baseline-prompt-metrics.mjs` | Standalone merged-block size |
| `artefacts/EV-39S-GAM-WAVE-B-metrics.json` | **New** |
| `artefacts/EV-39S-GAM-RUNTIME-BASELINE.json` | Restored Step 1 frozen baseline |

---

## Completion criteria (Package 1)

| Criterion | Met? |
|-----------|:----:|
| GAM-B1–B6 complete | ✓ |
| Harness green | ✓ |
| GAM-PRES semantics preserved | ✓ |
| Proof replay unchanged | ✓ |
| Implementation report published | ✓ |

---

## Next steps

Workstream A is **complete**. Proceed to **Workstream B — Design Page hygiene** (Package 2) per [sprint-39-plan.md](../sprint-39-plan.md).
