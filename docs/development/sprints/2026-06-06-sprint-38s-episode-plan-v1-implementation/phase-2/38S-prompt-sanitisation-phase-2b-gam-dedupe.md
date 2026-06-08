# 38S Prompt Sanitisation Phase 2B — GAM Dedupe (implementation)

**Date:** 2026-06-08  
**Status:** **COMPLETE**  
**Type:** GAM pack subtraction only (no runtime, no responsibility rewrite)  
**Predecessor:** [Phase 2B audit](38S-prompt-sanitisation-phase-2b-gam-audit.md) · [Phase 2A DLA](38S-prompt-sanitisation-phase-2a-dla-only.md)

---

## Summary

Applied the **first three** Phase 2B audit recommendations only:

1. Removed standalone **Material-type realisation guidance** section (~4,005 chars)
2. **Output organisation / Scope** — verified single canonical copy (no duplicate blocks present to remove; dedupe guard added in script)
3. Removed **GAM-WB-22..31** archetype-conditioned packs (~2,428 chars)

**Not in scope:** runtime PEL alignment (Phase 2B-b), F-rule merges, defaultPromptNotes trim, preamble dedupe.

---

## Sections removed

| Section | Marker | Chars removed |
|---------|--------|--------------:|
| Material-type realisation (standalone) | `Material-type realisation guidance:` → `Usability requirements:` | 4,005 |
| GAM-WB-22..31 archetype packs | `GAM-WB-22` → `- Anti-patterns (workbook FAIL)` | 2,428 |
| Output org duplicates | — | 0 (already single copy) |

**Retained:** GAM-PRES-00..10, GAM-WB-00..21 (+ MIX/F-rules), Usability header, Anti-patterns AP-01..05, Scope + Output organisation (×1), fail taxonomy F1–F9 references in GAM-WB-38E-9 block.

**Fixed:** GAM-WB-21 line break — `…do not supply the answer- GAM-WB-22` → `…do not supply the answer` before Anti-patterns.

---

## Prompt size

| Metric | Before | After | Δ |
|--------|-------:|------:|--:|
| `promptTemplate` | 26,544 | **20,109** | **−6,435 (−24.2%)** |
| `defaultPromptNotes` | 1,810 | 1,810 | 0 |
| **Pack combined** | 28,354 | **21,919** | **−6,435 (−22.7%)** |

Metrics: `../artefacts/EV-38S-2B-gam-prompt-metrics.json`  
Script: `scripts/apply-phase-2b-gam-dedupe.mjs`

---

## Verification

| Suite | Result |
|-------|--------|
| `tests/workbook-contract-prompt-surface.test.js` | **Pass** (incl. 38S-2B assertions) |
| `tests/gam-output-format.test.js` | **Pass** |
| `tests/workflow-ld-episode-plan-step.test.js` | **Pass** |
| `ev-38s-production-pipeline-chase.mjs` | **Pass** — `proofOk`, `roleOk`, `fullOk` |

**Regressions:** None at contract/harness layer.

**Manual LLM re-run:** Not executed in this phase (user step-by-step Inflation workflow).

---

## Phase 2B-b recommendation

Align runtime blocks that compete with GAM-PRES-07/08 depth:

1. `buildSelfDirectedGamPelReasoningMaterialPromptBlock` — remove “short worked micro-example”, “concise cues”, closure “2–3 items”; align with PRES-08 minima
2. Optional: merge reading sufficiency + material voice + timeline into one self-study block (38B proposal)
3. **Do not** trim `defaultPromptNotes` until pack Phase 2B-c — notes still reference removed GAM-WB-22..31 clauses harmlessly

Expected depth improvement requires **2B-b runtime pass + manual GAM capture**, not pack subtraction alone.
