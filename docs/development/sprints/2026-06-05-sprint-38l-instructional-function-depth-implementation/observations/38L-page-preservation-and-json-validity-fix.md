# 38L — GAM → Page preservation and JSON validity fix

**Date:** 2026-06-05  
**Sprint:** 38-L instructional function depth  
**Scope:** L4 Design Page compose merge only — **no** changes to DLA, GAM pack (§6), schema, ACM, or renderer styling.

---

## Problem

38L proof run `EV-38L-AFTER-gam.json` carried full instructional bodies (19 materials: checklists, worked analytic pass, scenarios, tables, templates, transfer prompts, consolidation). Composed `EV-38L-AFTER-design-page.json` retained material **keys** but **thinned or synopsis-replaced** several A4 bodies after LLM compose:

| Material | GAM `contentLen` | Page (pre-fix) | Symptom |
|----------|------------------|----------------|---------|
| A4 scenario (strategy menu) | 817 | 222 | Catalogue sentence instead of A–E strategy list |
| A4 worked judgement | 1050 | 248 | One-line synopsis instead of weak/strong exemplars |
| A4 transfer_prompt | 684 | ~120 | Short stub vs full 80-word transfer task |

A1–A3 were largely preserved; A4 Evaluate completion pack was the main collapse point.

**Root cause:** Design Page compose is LLM-only today. `LD-MATERIALS-COPY` / `LD-DESIGN-PAGE-COMPOSE-CONTRACT` are prompt contracts, not a programmatic merge. `applyPedagogicCognitionSemanticsToComposedPage` merged cognition/framing fields but did not overlay upstream GAM `activity_materials`.

---

## Fix

### 1. `lib/page-gam-materials-preserve.js` (new)

Programmatic **GAM → page `materials` merge** after compose:

- Maps GAM material `type` + `purpose` → page field keys (`checklist`, `checklist_evaluate`, `worked_analytic_pass`, `worked_judgement_weak_strong`, `scenario_maya_strategy_menu`, `transfer_prompt_evaluate`, `guided_judgement_table`, `independent_judgement_template`, table keys, etc.).
- Merges when page field is missing, placeholder-thin, or **>10% shorter** than GAM body.
- Sets renderer-friendly canonical aliases (`checklist`, `worked_example`, `transfer_prompt`, `scenario`, `template`, `decision_table`) without changing renderer CSS.
- `validate38LPageGamPreservation(page, { gamSource })` — hard checks for 38L inflation workbook:
  - Checklist on A1–A4
  - A3 worked analytic pass
  - A4 substantive scenario (Strategy A–E list)
  - A4 substantive worked judgement (weak/strong exemplars)
  - A4 checklist/debrief
  - A4 `transfer_prompt` **only if present in upstream GAM**

### 2. `app.js` — compose hook only

- `applyComposedPageGamMaterialsPreserve` called at end of `applyPedagogicCognitionSemanticsToComposedPage` (both cognition-active and inactive paths).
- Accepts `options.upstreamActivityMaterials`; auto-resolves from workflow `activity_materials` capture when omitted.
- `resolvePageGamMaterialsPreserveLib` checks `window` and `globalThis` (VM harness compatibility).

### 3. Harness hard gate

`ev-38l-inflation-pipeline-capture-once.mjs`:

- Parses GAM before page post-process.
- Passes `upstreamActivityMaterials: gamJsonForPage.activities` into cognition compose.
- **Throws** if `validate38LPageGamPreservation` fails after merge.

### 4. Regression tests

`tests/page-38l-gam-preservation.test.js` (4 tests):

- Thinned `EV-38L-AFTER-design-page.json` **fails** validator before merge.
- After `applyGamMaterialsToComposedPage` with `EV-38L-AFTER-gam.json`, A4 scenario contains `Strategy A: Budget Tightening`, worked judgement contains `Weak Evaluation Example`, transfer contains `at least 80 words`.
- Full checklist A1–A4 + A3 analytic pass length check.
- `applyPedagogicCognitionSemanticsToComposedPage` path with `upstreamActivityMaterials` passes validator.

---

## Verification (artefact replay, no live LLM)

```
node --test tests/page-38l-gam-preservation.test.js
```

| Check | Before merge | After merge |
|-------|--------------|-------------|
| Validator | FAIL (A4 substantive scenario + worked judgement) | PASS |
| A4 scenario length | 222 | 817 |
| A4 worked judgement length | 248 | 1050 |

---

## Files changed

| File | Change |
|------|--------|
| `lib/page-gam-materials-preserve.js` | **New** — merge + validate + GAM text parse helpers |
| `app.js` | Compose post-process hook; workflow GAM resolve; test API exports |
| `index.html` | Script tags for fidelity + preserve libs |
| `artefacts/ev-38l-inflation-pipeline-capture-once.mjs` | Pass GAM to compose; post-page validation gate |
| `tests/page-38l-gam-preservation.test.js` | **New** — 4 regression tests |

**Unchanged:** DLA pack §5, GAM pack §6, JSON schema, ACM, renderer styling/CSS.

---

## Material types preserved (per activity)

All upstream GAM materials map into page JSON `materials` object:

- `checklist` / `checklist_evaluate`
- `worked_example` / `worked_analytic_pass` / `worked_judgement_weak_strong`
- `scenario` / `scenario_maya_households` / `scenario_maya_strategy_menu`
- `transfer_prompt` / `transfer_prompt_evaluate`
- `template` / `independent_judgement_template`
- `decision_table` / `guided_judgement_table`
- `analysis_table`, `classification_table`, `comparison_table`, `impact_table`
- `text` (concept/criteria exposition), `consolidation_summary`, `sample_output`

Renderer continues to use existing key fallbacks; canonical aliases improve early-path recognition without style changes.

---

## Next run

Full or resumed 38L harness will fail at Design Page if GAM bodies are not merged onto composed JSON:

```bash
PRISM_HARNESS_RESUME_FROM=km node docs/development/sprints/2026-06-05-sprint-38l-instructional-function-depth-implementation/artefacts/ev-38l-inflation-pipeline-capture-once.mjs
```

Prism UI Design Page step auto-resolves GAM from workflow `activity_materials` capture when the preserve lib is loaded via `index.html`.
