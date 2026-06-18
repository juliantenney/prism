# Sprint 51 — GAM Material Preservation Fix Report

**Status:** Complete  
**Issue:** Design Page compose thinned GAM pedagogic bodies before `page.json` — Sprint 51 sections survived structurally but lost substantive content.  
**Date:** 2026-06-18

---

## Root cause

GAM material preservation (`lib/page-gam-materials-preserve.js`) runs **after** Design Page LLM compose via `applyComposedPageGamMaterialsPreserve()` in `app.js`. The merge overlay is the correct architectural fix point, but three gaps allowed compression to persist:

| Gap | Effect |
| --- | ------ |
| **Checklist tier E** | `resolveFidelityContract` assigned checklists `tier: "E"` with `minRatio: 0`. `shouldMergeGamBody` only replaced checklist bodies when the page value was a **placeholder** (< 48 chars). A compose-shortened checklist that still looked “substantive” was **never restored** from GAM. |
| **Length-only merge threshold** | For other materials, merge triggered mainly when GAM was **longer**. Compose could paraphrase/thin bullets while keeping headings (`## Why this works`, `## What experts notice`, `## Common mistakes`) at **similar total length** — merge did not fire. |
| **Alias sync** | `preferAliasFromCanonical` only copied canonical → alias when canonical was **strictly longer**. Equal-length thinned aliases (e.g. `evaluation_checklist`) could retain compose paraphrase even after canonical key merged. |

Design Page prompts already forbid paraphrase (`LD-MATERIALS-COPY`, `LD-DESIGN-PAGE-COMPOSE`), but LLM compose still shortens bodies. The post-compose merge must **authoritatively prefer upstream GAM** for learner-facing material keys.

---

## Fix

### 1. Authoritative GAM preference

For learner-facing material keys (`worked_example`, `sample_output`, `checklist`, tables, `prompt_set`, `transfer_prompt`, `consolidation_summary`, etc.), `shouldMergeGamBody` now prefers upstream GAM when bodies differ — not only when GAM is longer.

### 2. Pedagogic richness detection

New `pedagogicRichnessLoss()` detects Sprint 51 section thinning:

- Missing `## What experts notice`, `## Why this works`, `## Common mistakes`, or `### If any check is not met:`
- Fewer bullets under a present section
- GAM body > 2% longer than page body

### 3. Fidelity contracts for Sprint 51 types

| Material | Markers |
| -------- | ------- |
| `worked_example` | `what_experts_notice` |
| `sample_output` | `why_this_works` |
| `checklist` / `checklist_evaluate` | `common_mistakes`, `revise_if_not_met` |

Checklists upgraded from tier **E** → tier **B** (`minRatio: 0.99`).

### 4. Alias sync

`preferAliasFromCanonical` now syncs when content differs and canonical length is ≥ alias (not only strictly greater).

**No changes** to workflow, schema, compose prompts, renderer, or instructional grammar.

---

## Files changed

| File | Change |
| ---- | ------ |
| `lib/page-gam-materials-preserve.js` | Authoritative merge, pedagogic richness detection, Sprint 51 fidelity contracts, checklist tier fix, alias sync |
| `tests/sprint-51-gam-material-preservation.test.js` | **New** — Sprint 51 body preservation tests |

---

## Before / after example

### Before (compose-thinned page.json)

```markdown
## What experts notice
- Names the mechanism.

## Why this works
- Links concepts.
- Uses evidence.

## Common mistakes
- Label-only classification.

### If any check is not met:
Revise your work.
```

Headings present; bullets generic and shortened. GAM upstream had fuller disciplinary commentary.

### After (post-merge page.json)

Full GAM bodies restored verbatim:

```markdown
## What experts notice
- Strong analysis names the transmission mechanism, not only demand-pull or cost-push labels.
- Novices list agents without explaining how the pressure reaches prices.
- Effective reasoning links evidence from the scenario to the classification move.

## Why this works
- Links concepts through a causal mechanism rather than listing definitions.
- Uses scenario-specific evidence to support the analytical move, not generic claims.
- Moves beyond description by explaining relationships and implications.
- Explains who gains and loses through the transmission path, not agent labels alone.

## Common mistakes
- Label-only classification with no mechanism or evidence.
- Listing affected agents without explaining how the pressure reaches them.
- Generic justification that could fit any inflation case.

### If any check is not met:
Revise your report by (1) adding a mechanism sentence for each classification, (2) quoting one scenario detail per claim.
```

---

## Test results

```
node --test tests/sprint-51-gam-material-preservation.test.js \
         tests/page-49-6b-gam-material-preservation.test.js \
         tests/page-gam-materials-projection.test.js \
         tests/page-38m-gam-preservation.test.js \
         tests/sprint-51-evaluative-coaching-generation.test.js \
         tests/sprint-51-annotated-models-generation.test.js \
         tests/sprint-50-phase-2-renderer-instructional-grammar.test.js
```

| Suite | Result |
| ----- | ------ |
| `sprint-51-gam-material-preservation.test.js` | 8/8 pass |
| `page-49-6b-gam-material-preservation.test.js` | 3/3 pass |
| `page-gam-materials-projection.test.js` | 4/4 pass |
| `page-38m-gam-preservation.test.js` | 7/7 pass |
| `sprint-51-evaluative-coaching-generation.test.js` | 7/7 pass |
| `sprint-51-annotated-models-generation.test.js` | 6/6 pass |
| `sprint-50-phase-2-renderer-instructional-grammar.test.js` | 9/9 pass |

**Total:** 44/44 pass.

### Coverage verified

- `worked_example` with `## What experts notice` survives merge
- `sample_output` with `## Why this works` survives merge
- `checklist` with `## Common mistakes` and revision block survives merge (including former tier E gap)
- Equal-length paraphrase prefers GAM for authoritative keys
- Sprint 50 grammar renderer unchanged
- Sprint 51 annotated models and evaluative coaching prompt tests unchanged
- Marx benchmark preservation (`49-6b`, `38M`) still passes

---

## Remaining risks

| Risk | Note |
| ---- | ---- |
| **Preserve not invoked** | If `upstreamActivityMaterials` is missing from workflow captures, merge cannot run — verify Marx runner passes GAM upstream |
| **Activity ID mismatch** | `matchGamActivity` must align page rows with GAM activities; index fallback used when IDs differ |
| **GAM itself thin** | Preservation restores GAM authority; cannot fix thin GAM generation |
| **Non-authoritative keys** | Materials outside the authoritative key set still use length/ratio heuristics |

---

## Success criterion

After a fresh Marx run, `activity_materials` and `page.json` `materials.*` bodies should carry the **same substantive** worked examples, sample outputs, `## Why this works`, `## What experts notice`, `## Common mistakes`, and revision guidance — with Design Page compose no longer flattening pedagogic content post-merge.

**Recommended verification:** Re-run Marx self-study and diff GAM `activity_materials.md` against composed `page.json` material bodies for length and Sprint 51 section bullets.
