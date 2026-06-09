# 39S Workstream B — Design Page Hygiene Implementation

**Date:** 2026-06-09  
**Status:** **COMPLETE**  
**Type:** Pack hygiene + runtime authority ordering (Package 2)  
**Sprint:** [Sprint 39](../README.md)  
**Authority:** [sprint-39-work-packages.md](../sprint-39-work-packages.md) · [39S-0-baseline-prompt-metrics.md](39S-0-baseline-prompt-metrics.md)  
**Metrics:** [artefacts/EV-39S-DESIGN-PAGE-HYGIENE-metrics.json](../artefacts/EV-39S-DESIGN-PAGE-HYGIENE-metrics.json)  
**Baseline:** [artefacts/EV-39S-DESIGN-PAGE-BASELINE.json](../artefacts/EV-39S-DESIGN-PAGE-BASELINE.json)

---

## Executive summary

Workstream B reduces Design Page prompt duplication and clarifies runtime authority ordering **without** changing compose semantics, LD-DESIGN-PAGE-COMPOSE-CONTRACT body, renderer behaviour, or Sprint 38 VA emission rules.

**Pack combined −1,332 chars (−11.8%).** **Augmented −379 chars** on the Step 1 inflation self-directed scenario (pack shrink only; runtime Δ unchanged). **LD-DESIGN-PAGE-COMPOSE-CONTRACT now precedes Sprint 38 visual affordance** in the augmented prompt — compose fidelity rules receive attention before schema-heavy VA content.

---

## Task completion (DP-B1–B8)

| ID | Task | Status | Evidence |
|:--:|------|:------:|----------|
| B1 | Confirm baseline | ✓ | `EV-39S-DESIGN-PAGE-BASELINE.json` (Step 1) |
| B2 | Rewrite `defaultPromptNotes` | ✓ | 7 pointer lines; `LD-DESIGN-PAGE-COMPOSE-CONTRACT` authoritative |
| B3 | Trim `runnerInstructions.what_to_check` | ✓ | 636 chars; compose-contract refs |
| B4 | Remove inline VA prose from pack | ✓ | One-line runtime reference; output keys retained |
| B5 | Reorder runtime augmentation | ✓ | Compose before VA in `applyWorkflowStepRuntimePromptAugmentations` |
| B6 | Resolve dead preservation helper | ✓ | **Deleted** — see decision below |
| B7 | Remove PEL orientation from Design Page | ✓ | DLA-only PEL orientation injection |
| B8 | Post-probe + validation | ✓ | All harness green; `fullOk: true` |

---

## Measured results

### Pack (§13 Design Page)

| Metric | Step 1 baseline | After hygiene | Δ |
|--------|----------------:|--------------:|--:|
| `promptTemplate` | 9,519 | **9,140** | **−379** |
| `defaultPromptNotes` | 1,783 | **830** | **−953** |
| `what_to_check` | ~2,400 (est.) | **636** | **~−1,764** |
| **Pack combined** | 11,302 | **9,970** | **−1,332** |

### Workflow (inflation_self_directed — matches Step 1 probe)

| Metric | Baseline | After | Δ |
|--------|---------:|------:|--:|
| Seeded | 9,349 | **8,970** | −379 |
| Augmented | 27,907 | **27,528** | **−379** |
| Runtime Δ | 18,558 | 18,558 | 0 |

Runtime character count unchanged — hygiene is **dedupe + ordering**, not runtime block removal.

### Runtime block order (after)

| # | Block |
|---|-------|
| 1 | LD-SELF-DIRECTED-RHETORIC |
| 2 | **LD-DESIGN-PAGE-COMPOSE-CONTRACT** |
| 3 | Sprint 38 visual affordance authoring contract |
| 4 | Sprint 38 pedagogical added-value contract |
| 5 | LD-MATH-RENDER |

**Before:** VA preceded compose (38S audit DP-09). **After:** compose index 12,697 &lt; VA index 19,708.

### Probe cross-check (`probe-38b1-design-page-prompt-size.js`)

Self-directed inflation workshop brief: augmented **26,713** chars; block titles show compose before VA. Generic workshop: **22,549** augmented (no self-directed rhetoric).

---

## Changes by surface

### Pack — `domain-learning-design-step-patterns.md` §13

**`defaultPromptNotes` (DP-B2):** Seven concise sentences. Materials fidelity, membership, VA, and maths defer to runtime modules; **LD-DESIGN-PAGE-COMPOSE-CONTRACT** named as authoritative for preservation.

**`runnerInstructions.what_to_check` (DP-B3):** Short checklist — section shape, materials structure, compose-contract governance, VA root keys, limitations.

**`promptTemplate` (DP-B4):** Inline Sprint 38 VA prose replaced with:

> VISUAL AFFORDANCES: mandatory page-root metadata only — full Sprint 38 generate/defer/reject rules, schema 38.4 field set, and examples in runtime Sprint 38 visual affordance contract

**Retained in pack (unchanged):** MATERIALS FIDELITY block with FORBIDDEN inflation-collapse examples; verbatim preserve language; 38H-3 / DP-TABLE-ADJ-01; output JSON VA root key requirements; activity membership rules.

### Runtime — `app.js`

**DP-B5 — augmentation order:**

```text
… → applyPedagogicEnrichmentContractScaffoldToDraft
  → applyLdDesignPageComposeContractToDraft      ← moved up
  → applySprint38VisualAffordanceContractToDraft
  → applyMathSafeOutputContractToDraft …
```

**DP-B7 — PEL orientation:** `buildPelOrientationContractPromptBlock` injects on **DLA only** (`isDla`), not Design Page. Reasoning contract was already DLA-only (Workstream A). Workshop briefs unchanged — PEC resolves `[]` for facilitated delivery.

**DP-B6 — dead code removed:** `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock()` deleted. Never injected; **LD-DESIGN-PAGE-COMPOSE-CONTRACT** `FIELD_PRESERVATION_LINES` already covers the same field IDs.

---

## DP-B6 decision record

| Option | Verdict |
|--------|---------|
| Wire `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock` | **Rejected** — duplicates compose contract; adds ~700 chars with no unique semantics |
| Delete | **Accepted** — 38S design-page audit DP-10; compose contract is canonical |

---

## Validation

| Command | Result |
|---------|--------|
| `node scripts/probe-38b1-design-page-prompt-size.js` | ✓ compose before VA in block list |
| `node --test tests/ld-design-page-compose-contract.test.js` | **6/6** |
| `node --test tests/design-page-materials-fidelity.test.js` | **13/13** |
| `node --test tests/page-38s-phase-a-render-fixes.test.js` | **5/5** |
| `node --test tests/sprint-38-visual-affordances.test.js` | **22/22** |
| `node --test tests/workflow-pel-orientation.test.js` | **11/11** |
| `ev-38s-production-pipeline-chase.mjs` | **fullOk: true, proofOk: true, roleOk: true** |

### Prompt-surface assertions

| Check | Status |
|-------|:------:|
| `LD-DESIGN-PAGE-COMPOSE-CONTRACT` injected | ✓ |
| FORBIDDEN collapse / verbatim preserve in pack + runtime | ✓ |
| VA metadata achievable (Sprint 38 tests) | ✓ |
| No PEL orientation on Design Page (Marx self-study) | ✓ |
| No `near-verbatim` / shorten-non-essential permission | ✓ |
| Compose precedes VA in augmented prompt | ✓ |

---

## Out of scope (confirmed untouched)

- Episode Plan, DLA, GAM packs and runtime
- `lib/ld-design-page-compose-contract.js` body semantics
- `lib/page-gam-materials-preserve.js`
- Page renderer (`app.js` render path)
- Workbook contract rows
- `materials_order` / `activity_preamble` enforcement work

---

## Files touched

| File | Change |
|------|--------|
| `domains/learning-design/domain-learning-design-step-patterns.md` | §13 notes, what_to_check, VA pack line |
| `app.js` | Runtime reorder; PEL orientation DLA-only; delete dead helper |
| `tests/workflow-pel-orientation.test.js` | Design Page PEL expectations |
| `tests/sprint-38-visual-affordances.test.js` | Pack VA one-line ref expectations |
| `tests/design-page-materials-fidelity.test.js` | Compose-before-VA order test |
| `scripts/probe-39s-design-page-hygiene-metrics.mjs` | **New** |
| `artefacts/EV-39S-DESIGN-PAGE-HYGIENE-metrics.json` | **New** |

---

## Success criteria

| Criterion | Met? |
|-----------|:----:|
| Prompt duplication reduced | ✓ (−1,332 pack; −379 augmented) |
| Compose contract clearer authority | ✓ notes + ordering |
| VA pack duplication reduced | ✓ inline prose → runtime ref |
| Runtime ordering improved | ✓ compose before VA |
| No Inflation validation regression | ✓ chase fullOk |
| Workstream B formally closed | ✓ |

---

## Next steps

Proceed to **Workstream C — Architecture inventory** (Package 3) or optional **DLA runtime trim** (Package 4) per [sprint-39-plan.md](../sprint-39-plan.md).
