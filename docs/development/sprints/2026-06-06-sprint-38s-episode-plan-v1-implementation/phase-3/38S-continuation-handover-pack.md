# Sprint 38S Continuation Handover

**Date:** 2026-06-08  
**Status:** Architecture tranche **nearing completion** — implementation closure pending renderer + GAM cleanup + Inflation re-run  
**Supersedes for continuation work:** [phase-2/38S-handover-pack.md](../phase-2/38S-handover-pack.md) (original harness-era pack)  
**Charter:** [../IMPLEMENTATION-CHARTER.md](../IMPLEMENTATION-CHARTER.md) · **Sprint index:** [../README.md](../README.md)

---

## Executive Summary

Sprint 38S established and validated the frozen pipeline `KM → LO → Design Episode Plan → DLA → GAM → Page` with Episode Plan V1 as the planning authority, DLA as population-only, GAM as realisation, and Page as compose/render.

**Harness proof is green:** `EV-38S-AFTER-4` — `fullOk: true`, `proofOk: true` (`artefacts/EV-38S-AFTER-4-run-log.json`). **Manual Inflation validation** (LO1–LO5, workshop brief) now traverses the full chain with structurally faithful GAM realisation and largely preserved Page bodies.

**Remaining work is not architectural relitigation.** It is renderer correctness (Page Phase A), GAM pack hygiene (Wave A dedupe), a post-fix Inflation re-run, and a formal architecture closure note. North Star pedagogy, PEL depth programmes, and instructional-depth enhancements are explicitly deferred until architecture closure.

---

## Architecture Status

| Layer | Status | Evidence |
|-------|--------|----------|
| **Episode Plan** | **Complete / Stable** | V1 frozen (`activity_id` + `episode_plan { archetype, beats[{ function }] }`). Deterministic derive + `validateEpisodePlansContainerV1()`. First-class workflow step registered. Harness + manual EP captures pass. |
| **DLA** | **Stable** (population contract) · **Under Observation** (runtime augmentation) | Final pack sanitisation: **27,119 → 13,983 chars** (`EV-38S-final-dla-prompt-metrics.json`). Population contract + merge + PF-11 gate in code. Residual runtime PEL duplication audited, not yet trimmed. |
| **PF-11 chain** | **Stable** (code fixes in) · **Under Observation** (manual UI) | Round 1: capture sync + resolver alignment. Round 2: dedup false-positive fix. Stale-override detection + V1 capture enforcement. Manual Copy diagnostic: `[PRISM DLA copy diagnostic]`. |
| **GAM** | **Stable** (realisation architecture) · **Outstanding** (prompt bloat) | `EV-38S-AFTER-4` fullOk. Inflation rerun: beat-aligned types, obligation realisation correct. Pack **22,084 chars** post–2B; ~40% duplicate sediment per final cleanup audit. Wave A not yet implemented. |
| **Page** | **Stable** (preservation) · **Outstanding** (renderer defects) | GAM→Page body preservation largely working (`page (79).html` evidence). Seven presentation defects — five renderer bugs, two compose gaps. Phase A fixes not yet implemented. |

---

## Major Achievements Since Original Handover

| Achievement | Evidence / outcome |
|-------------|-------------------|
| **Final DLA sanitisation** | Pack rewritten to population-first: `OBLIGATION POPULATION (38S)`, IFP-04/05/06 compact, DLA-WB-25/26..31 removed/merged, no `replan function_sequence`. Checks in `EV-38S-final-dla-prompt-metrics.json`. |
| **DLA prompt reduction** | **−13,136 chars (−48%)** from 38S baseline (27,119 → 13,983 combined). Prompt template 24,826 → 13,189. |
| **Stale override diagnosis** | `isStaleCatalogSeededStepOverride()` + `scripts/probe-manual-dla-copy-stale-override.mjs` — saved `local_override` bodies bypass pack; probe confirms stale IFP-00/01/WB-25 detection. |
| **PF-11 root-cause analysis** | Three distinct failure modes documented (below). Code fixes + diagnostics in `app.js`, tests in `workflow-ld-episode-plan-step.test.js`. |
| **Episode Plan → DLA validation** | Inflation manual path: valid `episode_plans` → DLA obligations populated; Evaluate archetype beats honoured. |
| **Evaluate pathway validation** | LO5 Evaluate activity: scenario, decision table, template, checklist types present in GAM capture; structural trio gate passes harness. |
| **GAM obligation-realisation validation** | `GAM-PRES-01/02/03` preserve order and membership; types map to DLA `required_materials`. No collapse to single consolidation. |
| **Material-preservation improvements** | Phase 2C-a compose fixes + `lib/page-gam-materials-preserve.js` — content collapse largely resolved; defects now renderer/ordering, not upstream absence. |

---

## Key Root Causes Discovered

### PF-11 Root Cause 1 — Stale persisted workflow overrides

| | |
|---|---|
| **Symptoms** | DLA Copy prompt contains pre-38S IFP planning language (IFP-00, IFP-01, DLA-WB-25). Population block present but model replans despite upstream JSON. Shallow or misaligned obligations. |
| **Diagnosis** | Saved workflows retain `override_prompt_body` / `prompt_source_type: local_override` from pre-sanitisation era. Override replaces pack template at `resolveStepPromptText()` — pack changes do not reach manual Copy path. |
| **Fix** | `isStaleCatalogSeededStepOverride()` detection; users must reseed workflow or clear override. Probe script validates detection. Final DLA sanitisation applies only when pack (not override) is active. |
| **Current status** | **Mitigated** — detection in place; manual workflows may still need reseed. Not a code-chain bug. |

### PF-11 Root Cause 2 — Episode-plan dedup false positive

| | |
|---|---|
| **Symptoms** | Valid `episode_plans` in capture; Copilot returns `{ "error": "PF-11: missing episode_plans upstream" }`. Copied DLA prompt lacks `### Upstream episode_plans` JSON block. |
| **Diagnosis** | `applyEpisodePlanDlaPopulationPromptBlockToDraft` deduped with `/upstream episode_plans/i`. Post-sanitisation pack already contains that phrase in IFP header (*"upstream episode_plans owns archetype…"*), so authoritative JSON section was **never injected**. |
| **Fix** | Dedup anchor changed to `/### Upstream episode_plans/i`. Bindings embed normalises valid capture to pretty JSON. Copy diagnostic: `state.workflowRunDlaCopyDiagnostic`. |
| **Current status** | **Fixed** in code. Manual verify: Copy DLA → `has_authoritative_upstream_section: true`, `has_pf11_guard: false`. |

### PF-11 Root Cause 3 — Invalid / non-V1 episode-plan captures

| | |
|---|---|
| **Symptoms** | Invented archetypes (`concept_explanation`), non-FunctionEnum beats (`introduce_concept`), downstream population failures or wrong obligation shapes. |
| **Diagnosis** | Pre-first-class-step: users could LLM-generate Episode Plan from prompt; `executionMode: deterministic_derive` was documented but not enforced. Invalid captures accepted and passed to DLA. |
| **Fix** | First-class Design Episode Plan step; `applyEpisodePlanCaptureCanonicalEnforcement()` replaces invalid captures with `deriveEpisodePlansFromLearningOutcomes()`; `validateEpisodePlansContainerV1()` gate; DLA ignores invalid upstream. |
| **Current status** | **Fixed** for canonical workflow path. Residual risk: user bypasses auto-fill and pastes non-V1 JSON before sync — enforcement replaces at capture sync. |

---

## Current Architecture Assessment

### Confirmed Working

- Episode Plan V1 schema, derive, and validation gate
- Population contract (`FUNCTION_SPECS`, beat→obligation merge, tagging)
- DLA population-only pack (post-final sanitisation)
- GAM realisation contract (`GAM-PRES-07/08/09`, anti-collapse, Evaluate trio)
- Strict fenced JSON capture (KM/LS/LO/EP; STEP footer stripped)
- Harness `ev-38s-production-pipeline-chase.mjs` — `fullOk: true`
- GAM→Page material body preservation (content not collapsing)

### Remaining Architecture Risks

| Risk | Severity | Notes |
|------|----------|-------|
| Legacy `local_override` prompts on saved workflows | Medium | Bypasses pack; user must reseed |
| GAM prompt duplication (~40% sediment) | Medium | Signal competition; not missing rules |
| Page renderer legacy fast-path ordering | High (visible) | Checklist before exposition on Inflation export |
| `materials_order` / `material_role_index` absent on some captures | Medium | Compose gap; renderer fallback inverts order |
| PEC `workshop` gate suppresses GAM PEL blocks | Low (known) | Inflation uses workshop brief; PEL inactive by design |
| DLA runtime augmentation still ~17k chars | Low | Duplicates pack obligations; audited, not trimmed |

### Deferred Non-Architecture Work

These are **pedagogy / teaching-quality**, not architecture blockers:

- Minimum viable L3 prose (meets word floors weakly)
- Richer expert walkthrough modelling beyond ≥120w
- PEL reasoning-material depth when gate opens
- `activity_preamble` / study_orientation population on Page JSON
- North Star instructional-depth programme (38Q teaching architecture)

---

## Open Issues Register

### Page defects (from [38S-page-rendering-audit.md](../phase-2/38S-page-rendering-audit.md))

| ID | Issue | Severity | Owner | Layer |
|----|-------|----------|-------|-------|
| **PAGE-01** | Material ordering inverted — checklist before exposition/worked example (LO1, LO5) | **High** | Renderer | `renderMaterialsForActivity` legacy fast-path |
| **PAGE-02** | Literal `&lt;strong&gt;` in list items | **High** | Renderer (+ upstream) | `utilityRenderMarkdownInline` |
| **PAGE-03** | Material ID leakage (M1, M4 as `<h5>` headings) | **Medium** | Renderer | `renderMaterialValue` nested keys |
| **PAGE-04** | Missing PEL population — no preamble/orientation/reasoning cues | **Medium** | Compose | Page JSON lacks fields; renderer ready |
| **PAGE-05** | VA metadata visible in learner body; empty VA slots hidden | **Low** | Renderer + compose | Metadata classification gap |
| **PAGE-06** | LO3 `analysis_table` (M9) missing from render | **High** | Renderer | `utilityUnwrapWorksheetTablePayload` nested M-keys |

### DLA / GAM watch items

| ID | Issue | Severity | Owner |
|----|-------|----------|-------|
| **GAM-01** | Pack duplication GAM-WB ↔ GAM-PRES (~5.5–7.5k chars) | Medium | Pack (Wave A) |
| **GAM-02** | `buildSelfDirectedGamPelReasoningMaterialPromptBlock` thinness cues conflict PRES-08 | Medium | Runtime (when PEC active) |
| **GAM-03** | Pack `minimal assumptions` / `brief purpose` thinness tokens | Low | Pack (Wave A6) |
| **DLA-01** | Runtime PEL orientation/reasoning duplicates OUTPUT CONTRACT | Low | Runtime (deferred) |
| **DLA-02** | Material-shape checklist ~4 cap vs obligation ≥4 | Low | Runtime alignment |

---

## GAM Cleanup Audit Summary

**Source:** [38S-final-gam-cleanup-audit.md](../phase-2/38S-final-gam-cleanup-audit.md)

### Size map (post–Phase 2B partial dedupe)

| Layer | Chars |
|-------|------:|
| GAM pack template | 20,274 |
| GAM pack notes | 1,810 |
| Pack combined | 22,084 |
| Augmented GAM (self-directed) | 32,692–35,349 |
| Runtime delta | +12,514–15,171 |

Phase 2B already removed **−6,435 chars (−22.7%)** (standalone material-type section + GAM-WB-22..31).

### Duplication findings

- **~40–46%** of remaining pack template is duplicate sediment
- GAM-WB-11..18 type index duplicates **GAM-PRES-03**
- GAM-WB-01/02/06 restate **GAM-PRES-08** depth floors
- F1–F9 + MIX + AP-01..05 duplicate **GAM-PRES-09** fail taxonomy
- Canonical contracts preamble duplicates runtime **LD-TABLE-FIDELITY** + **LD-MATERIALS-COPY**
- PEL GAM blocks inactive on Inflation (`workshop` brief) but conflict PRES-08 if enabled

### Wave A recommendations (pack-only)

1. Merge GAM-WB-11..18 → PRES-03 cross-ref (~−2,300 chars)
2. Merge GAM-WB-01/02/06 → PRES-08 appendix (~−800–1,000)
3. Consolidate F1–F9 + MIX + AP → PRES-09 single taxonomy (~−2,500–3,500)
4. Canonical LD-* preamble → one-line refs (~−1,200–1,600)
5. Rewrite `defaultPromptNotes` to 5–8 lines (~−800–1,200)
6. Replace *minimal assumptions* → *necessary assumptions for complete bodies*

### Projected reductions

| Scenario | Pack Δ | Augmented GAM Δ |
|----------|-------:|----------------:|
| Wave A conservative | −4,500 (~20%) | −5,000 (~15%) |
| Wave A likely | −6,500 (~29%) | −7,500 (~22%) |

**Do not remove:** GAM-PRES-07/08/09/10 core semantics, output organisation, runtime LD-TABLE-FIDELITY author body.

---

## Page Rendering Audit Summary

**Source:** [38S-page-rendering-audit.md](../phase-2/38S-page-rendering-audit.md) · **Evidence:** `page (79).html` (Inflation LO1–LO5 export)

**Verdict:** GAM bodies survive to Page. Defects are renderer/compose presentation, not upstream content collapse.

### Root causes

1. **Ordering:** Legacy checklist/template/worksheet fast-paths in `renderMaterialsForActivity` run before generic type loop when `materials_order` / `material_role_index` absent
2. **Escaping:** `utilityRenderMarkdownInline` escapes HTML before markdown transform — `<strong>` in list strings becomes visible entities
3. **ID leakage:** Nested `materials[type][material_id]` renders M-keys as `<h5>` headings
4. **Missing table:** `utilityUnwrapWorksheetTablePayload` does not descend material_id wrappers (`{ M9: { table: … } }`)
5. **Metadata leak:** VA schema/review fields not in metadata suppression whitelist

### Proposed Phase A fixes (renderer-only, no prompt changes)

1. Gate or relocate legacy checklist/template/worksheet paths; default to 38-P role weights when no authoritative order
2. Suppress `/^M\d+/` as visible headings in nested `renderMaterialValue`
3. Normalise safe `<strong>` / `<em>` to markdown before escape in `utilityRenderMarkdownInline`
4. Extend table unwrap for material_id-keyed nested maps
5. Add VA metadata keys to page metadata suppression

**Phase B (compose, separate):** populate `materials_order[]` from episode plan; enforce `activity_preamble` minimum.

---

## Recommended Next Actions

Execute in order:

1. **Implement Page Rendering Phase A** — five renderer fixes in `app.js`; add render-order / escape / M-id / table / metadata tests
2. **Implement GAM Cleanup Wave A** — pack edits in `domain-learning-design-step-patterns.md` §6; run `workbook-contract-prompt-surface.test.js` + `ev-38s-production-pipeline-chase.mjs`
3. **Re-run Inflation end-to-end validation** — manual UI: LO → EP → DLA (copy diagnostic) → GAM → Page; compare to `page (79).html` baseline
4. **Produce Sprint 38S architecture closure note** — confirm closure criteria below; update sprint README status to CLOSED

---

## Explicitly Deferred

Do **not** start until architecture closure is complete:

- **North Star pedagogy** — expert modelling quality beyond L3 floors
- **Teacherly reasoning programme** — rich worked-thinking exposition
- **PEL enhancement programme** — gate expansion, reasoning-material injection policy
- **Instructional-depth tranche** (38Q teaching architecture, misconception interrupts, judgement exemplar richness)

Optional post-closure: GAM Wave B runtime merge; DLA runtime PEL dedupe; Phase 2B-b.2 PEL reasoning block rewrite (only if PEC gate changes).

---

## Sprint 38S Closure Criteria

The architecture tranche may be marked **CLOSED** when all of the following are true:

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | Page Rendering Phase A implemented and tested | Render tests pass; Inflation HTML shows text before checklist, no M-id h5, no `&lt;strong&gt;`, LO3 table present |
| 2 | GAM Wave A implemented | Pack reduced ≥4,500 chars; `GAM-PRES-07/08/09` retained; harness `fullOk: true` |
| 3 | Manual Inflation re-run complete | LO → EP → DLA → GAM → Page without PF-11; DLA copy diagnostic green; structural fidelity confirmed |
| 4 | No open **High** severity Page defects | PAGE-01, PAGE-02, PAGE-06 resolved |
| 5 | Architecture closure note published | Phase-3 closure doc; sprint README status updated |
| 6 | No regression in frozen boundaries | EP V1, population contract, workflow chaining, workbook validators unchanged unless evidence-driven |

**Not required for architecture closure:** pedagogic depth improvement, PEL gate changes, `activity_preamble` compose population, visual affordance images.

---

## Files To Read First

Read in this order to resume work from this point:

1. **This document** — `phase-3/38S-continuation-handover-pack.md`
2. [phase-2/38S-page-rendering-audit.md](../phase-2/38S-page-rendering-audit.md) — Page Phase A specification
3. [phase-2/38S-final-gam-cleanup-audit.md](../phase-2/38S-final-gam-cleanup-audit.md) — GAM Wave A specification
4. [phase-2/38S-handover-pack.md](../phase-2/38S-handover-pack.md) — original harness-era context + PF-11 round 2
5. [phase-2/38S-phase-2b-b2-gam-reasoning-alignment-audit.md](../phase-2/38S-phase-2b-b2-gam-reasoning-alignment-audit.md) — depth vs signal competition (deferred)
6. [phase-2/38S-final-dla-residual-architecture-audit.md](../phase-2/38S-final-dla-residual-architecture-audit.md) — DLA residual debt (post-sanitisation baseline)
7. [artefacts/EV-38S-AFTER-4-run-log.json](../artefacts/EV-38S-AFTER-4-run-log.json) — harness proof baseline
8. [artefacts/EV-38S-final-dla-prompt-metrics.json](../artefacts/EV-38S-final-dla-prompt-metrics.json) — DLA size verification
9. [observations/38S-first-class-episode-plan-step.md](../observations/38S-first-class-episode-plan-step.md) — EP step + V1 enforcement
10. [phase-2/38S-episode-plan-dla-chaining-fix.md](../phase-2/38S-episode-plan-dla-chaining-fix.md) · [phase-2/38S-pf11-dla-upstream-resolution-fix.md](../phase-2/38S-pf11-dla-upstream-resolution-fix.md) — PF-11 fix detail

**Key code entry points:** `app.js` (`renderMaterialsForActivity`, `utilityRenderMarkdownInline`, `applyEpisodePlanDlaPopulationPromptBlockToDraft`); `domains/learning-design/domain-learning-design-step-patterns.md` §5 DLA · §6 GAM; `lib/episode-plan-dla-integration.js`; `lib/page-role-render-sequencing.js`.

---

*End of Sprint 38S continuation handover pack.*
