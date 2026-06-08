# 38S Phase 2B-b.1 — Runtime Thinness Alignment

**Date:** 2026-06-08  
**Status:** **COMPLETE**  
**Type:** Targeted runtime prompt alignment (no pack/architecture changes)  
**Sprint:** [38S Episode Plan V1 implementation](../README.md)  
**Predecessor:** [Phase 2B-b PEL audit](./38S-prompt-sanitisation-phase-2b-b-pel-audit.md)

---

## Summary

Smallest safe runtime changes to stop teaching artificially short instructional artefacts while preserving learner support, metacognitive guidance, fidelity contracts, and Episode Plan authority.

**Files touched:** `app.js` (runtime blocks), `lib/ld-self-directed-rhetoric.js`, test assertions in `tests/ld-self-directed-rhetoric.test.js` and `tests/workflow-self-directed-activity-framing-adoption.test.js`.

**Not changed:** Episode Plan, DLA pack, GAM pack, population contract, workflow architecture, renderer, Page generation, `buildSelfDirectedGamPelReasoningMaterialPromptBlock`.

---

## A. Exact changes made

| File | Section | Before | After |
|------|---------|--------|-------|
| `app.js` | `buildSelfDirectedLearnerPageActivityFramingPromptBlock` | `1–3 concise sentences` | `1–3 topic-specific sentences … depth_floor L3 orientation with explanatory reasoning, not minimal filler` |
| `app.js` | same | `scaffold_hint_sequence (2–3 short hints)` | `2–3 substantive hints with reasoning cues` |
| `app.js` | `buildSelfDirectedLearnerPageDlaOutputContractOverrideBlock` | `activity_preamble … 1–3 sentences` | `1–3 topic-specific sentences with explanatory reasoning` |
| `app.js` | same | `one short generative-retrieval sentence each` | `one generative-retrieval prompt each requiring explanatory reasoning … (depth_floor L3 … not a label or single token)` |
| `app.js` | same | `short claim → evidence → implication scaffold` | `claim → evidence → implication scaffold with meaningful reasoning steps` |
| `app.js` | same | `short tag-like lens` | `tag-like lens label naming the discipline mode` |
| `app.js` | same | `2–3 short strings` (scaffold_hint_sequence) | `2–3 substantive hint strings with procedural or reasoning guidance` |
| `app.js` | `buildSelfDirectedLearnerPageDlaOutputContractExampleBlock` | self_explanation: one sentence | explain + justify + cite evidence |
| `app.js` | same | `"Short paired excerpts with titles."` | `"depth_floor: L3; paired excerpt blocks ≥150 words each …"` |
| `app.js` | `buildPelOrientationContractPromptBlock` | Full field-level rules for study_orientation, intellectual_frame, bridge, preamble separation | Page-level overview rules + pointer to OUTPUT CONTRACT for activity-level fields |
| `app.js` | `buildPelReasoningContractPromptBlock` | Full per-field definitions (reasoning_orientation, evidence_use, etc.) | Pointer to OUTPUT CONTRACT + execution guards (no tutoring, depth_floor L3, avoid list) |
| `app.js` | inline `LD-SELF-DIRECTED-RHETORIC` bootstrap | `intellectual_coherence_bridge on every activity after the first … Bad bridge shape` | Pointer to OUTPUT CONTRACT on DLA; preserve on Page |
| `app.js` | inline rhetoric + closure line | `2–3 epistemic bullets` | `GAM-PRES-08 transfer/closure minima … transfer_prompt ≥80 words when specified — not minimal bullet stubs` |
| `lib/ld-self-directed-rhetoric.js` | `CORE_LINES` | Same bridge + closure lines as above | Same alignment as inline bootstrap |

---

## B. Prompt-size impact (runtime only)

Measured via `scripts/probe-38b1-ld-workflow-prompt-audit.js` (self-directed inflation workshop brief):

| Step | Seeded | Augmented (pre-2B-b.1) | Augmented (post-2B-b.1) | Runtime Δ (post) | Δ vs pre-2B-b.1 |
|------|-------:|-----------------------:|------------------------:|-----------------:|----------------:|
| DLA | 24,491 | 42,393 | 42,190 | +17,699 | **−203** |
| GAM | 20,013 | 32,006 | 32,128 | +12,115 | **+122** |

**PEL block size reduction (standalone builders):**

| Block | Before | After | Δ |
|-------|-------:|------:|--:|
| PEL orientation | ~1,594 | ~780 | **−814** |
| PEL reasoning | ~1,637 | ~520 | **−1,117** |
| LD-SELF-DIRECTED-RHETORIC (core) | ~3,412 | ~3,380 | **−32** (closure line longer; bridge line shorter) |

Net runtime: DLA **−203 chars** (PEL dedupe outweighs depth-aligned contract wording). GAM **+122 chars** (GAM-PRES-08 closure reference longer than “2–3 epistemic bullets”; PEL reasoning dedupe partially offsets). Depth alignment was prioritised over size reduction on GAM closure.

---

## C. Verification

| Check | Result |
|-------|--------|
| `tests/ld-self-directed-rhetoric.test.js` | pass |
| `tests/workflow-pel-orientation.test.js` | pass |
| `tests/workflow-pel-reasoning.test.js` | pass |
| `tests/workflow-self-directed-activity-framing-adoption.test.js` | pass |
| `tests/workflow-self-directed-learner-page-formatting.test.js` | pass |
| `tests/workbook-contract-prompt-surface.test.js` | pass |
| `tests/workflow-ld-episode-plan-step.test.js` | pass |
| `ev-38s-production-pipeline-chase.mjs` | `proofOk: true`, `roleOk: true`, `fullOk: true` |

---

## D. Risk assessment — deferred to later phases

| Item | Phase | Notes |
|------|-------|-------|
| DLA pack IFP replanning debt | **2C** | Dominant prompt size; not runtime |
| GAM pack thin tokens (`brief`, `minimal`) | **2C** | Pack-level; GAM-PRES already pro-depth |
| `buildSelfDirectedGamPelReasoningMaterialPromptBlock` micro-example / 2–3 closure | **2C or 2B-b.2** | Often gated off for workshop briefs; align to GAM-PRES-08 when touched |
| PEC `workshop` gating vs self_directed delivery | **2C** | Audit found silent suppression of PEC blocks |
| Aggressive PEL collapse | **Out of scope** | Explicitly deferred per 2B-b.1 constraints |
| Material-shape “short orienting text” / checklist cap | **Review** | Scope-control rules; not changed in 2B-b.1 |

---

## Success criterion

| Criterion | Met? |
|-----------|:----:|
| Runtime stops teaching minimal artefacts | ✓ Wording aligned to depth_floor L3 |
| Learner support preserved | ✓ Metacognitive fields, guards, fidelity unchanged |
| Episode Plan authority preserved | ✓ Population block untouched |
| No pack/architecture changes | ✓ |
| Tests + EV chase green | ✓ |

---

*End of Phase 2B-b.1.*
