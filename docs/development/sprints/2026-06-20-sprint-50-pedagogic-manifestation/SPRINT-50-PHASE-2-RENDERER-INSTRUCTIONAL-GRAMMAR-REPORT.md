# Sprint 50 Phase 2 — Renderer Instructional Grammar Report

**Status:** Complete  
**Scope:** Workstream 2 only — learner-page instructional manifestation in the utility renderer  
**Out of scope:** Compose pipeline, DLA/GAM generation, prompts, contracts, schemas, gates, ontology  
**Depends on:** Phase 1 compose fidelity (`activity_preamble`, `reasoning_orientation`, authoritative `page.json` rows)

---

## Summary

Phase 2 implements the validated Sprint 50 instructional manifestation grammar in the learner-page renderer. Activities on `page_profile: learner` (non-workshop) now render as a single-column sequence of instructional sections — Orient → Think → Study → [Explain before you check] → Do → Check → Reflect → Transfer → [Support] — with Compass reduced to lightweight progress signalling and duplicate Orient/Think/Transfer prose removed.

---

## Files changed

| File | Change |
| ---- | ------ |
| `lib/ld-instructional-manifestation-render.js` | **New** — grammar activation, material partitioning, Orient/Think field collection, pre-check Reflect activation |
| `app.js` | Instructional section renderers; grammar activity card assembly; `buildPageSectionRenderOpts` flag; Compass de-duplication; single-column layout; CSS |
| `index.html` | Script tag for new lib |
| `tests/prism-vm-lib-bootstrap.js` | Load instructional manifestation lib in VM tests |
| `tests/sprint-50-phase-2-renderer-instructional-grammar.test.js` | **New** — grammar ordering, Check unification, pre-check Reflect, Compass de-duplication |
| `tests/utility-journey-compass-render.test.js` | Updated for Sprint 50 single-column grammar + progression label in activity `h3` |
| `docs/development/sprints/2026-06-20-sprint-50-pedagogic-manifestation/SPRINT-50-PHASE-2-RENDERER-INSTRUCTIONAL-GRAMMAR-REPORT.md` | This report |

---

## Renderer changes

### Grammar activation

`lib/ld-instructional-manifestation-render.js` exports `shouldApplyInstructionalManifestationGrammar(renderOpts, pageArtifact)`:

- **On:** `page_profile` is `learner` or `self_directed_learner`, and page is not a learner-workshop delivery page
- **Off:** Workshop delivery pages retain the legacy renderer (Sprint 48–49 column layout and framing rail)

`buildPageSectionRenderOpts` sets `instructionalManifestationGrammar: true` when the lib reports applicable.

### Instructional section assembly

`renderInstructionalManifestationActivityCard` in `app.js` assembles each activity as:

1. **Header** — `activity_id — title` when both differ; duration/grouping badges
2. **Progress** — `Step N of M` (`util-activity-progress`) when journey compass data exists
3. **Orient** — heading *Why this activity*; sources: `activity_preamble`, `orienting_preamble`, `activity_framing`, bridges, prior knowledge, etc.
4. **Think** — heading *How to approach this*; sources: `reasoning_orientation`, `intellectual_frame`, `disciplinary_lens`, `conceptual_contrast_prompt`, `argument_structure_hint`, `evidence_use_prompt`, scaffold sequence
5. **Study** — heading *Read and model*; study-bucket materials only (text, worked_example, scenario, analysis_table, sample_output when pre-check, etc.)
6. **Reflect (pre-check)** — heading *Explain before you check*; `self_explanation_prompt` when pre-check rule fires
7. **Do** — heading *What to do*; `learner_task` + practice-oriented materials
8. **Check** — heading *Check your work*; checklist materials + `expected_output` unified (no separate Output block)
9. **Reflect (post-check)** — heading *What to take away*; `consolidation_summary`, reflection materials, pack reconciliation fields
10. **Transfer** — heading *Apply elsewhere*; `materials.transfer_prompt` (authoritative) or `transfer_or_application_task` fallback
11. **Support** — heading *Watch for this mistake*; `support_note` when present

Each section uses `util-instructional-section` + role class (`util-instructional-orient`, `util-instructional-think`, etc.) and an `h4.util-instructional-heading` for linear document outline.

### Legacy path suppression

When grammar is active:

- `renderCognitionFieldsForActivity` returns empty (no duplicate Think blocks / `util-cognition`)
- `renderActivityFramingForActivity` / `util-pel-reasoning-cue` are not invoked for grammar activities
- No `util-output-block` after the activity — expected output lives inside Check
- No `util-activity-row util-page-columns` side compass column

---

## Section ordering logic

Material partitioning is delegated to `partitionActivityMaterialsForGrammar(row, materials)`:

| Bucket | Keys (representative) |
| ------ | --------------------- |
| Study | `text`, `scenario`, `worked_example`, `summary_text`, `reference_table`, … |
| Do | `template`, `analysis_table`, `worksheet`, `prompt_set`, `task_cards`, … |
| Check | `checklist`, `evaluation_checklist`, `sample_output` (when not pre-check) |
| Reflect | `reflection_prompt`, `consolidation_summary` |
| Transfer | `transfer_prompt`, `transfer_prompt_evaluate` |

**Pre-check branch (A3b):** `activityNeedsPreCheckReflect` is true when `self_explanation_prompt` is present **and** the activity has `sample_output`, checklist material, or `expected_output`. When true:

- `sample_output` is placed in **Study** (model before generative step)
- Pre-check Reflect section renders **before** Do
- Post-check Reflect uses remaining reflect sources after Check

**Study before Do:** When any Study-bucket materials exist, the Study section is emitted before Do regardless of legacy material render order.

---

## Duplication removals

| Signal | Before (legacy) | After (Sprint 50) |
| ------ | ---------------- | ----------------- |
| **Compass** | Per-activity aside with Orient/Think/Transfer signal prose | Progress only (`Step N of M`); `buildJourneyCompassFromPage` no longer pushes field signals |
| **Think** | `util-pel-reasoning-cue` + `util-cognition` blocks + Compass | Single *How to approach this* section |
| **Transfer** | Compass transfer pointer + material body | *Apply elsewhere* section only; `transfer_prompt` authoritative |
| **Check** | Separate `util-output-block` after materials | Checklist + expected output under *Check your work* |
| **Orient** | Framing rail (`util-activity-framing`) + Compass | *Why this activity* section |

---

## Before / after render examples

### Activity header and Orient/Think (Marx A2 fixture)

**Before (legacy):**

```html
<article class="util-task-block">
  <div class="util-activity-header"><h3>Modelled comparison row</h3></div>
  <div class="util-activity-framing">
    <div class="util-activity-preamble">…</div>
    <p class="util-pel-reasoning-cue"><strong>How to think:</strong> …</p>
  </div>
  <div class="util-activity-task">…<h4>What to do</h4>…</div>
  …
</article>
```

**After (grammar):**

```html
<article class="util-task-block util-instructional-activity">
  <div class="util-activity-header"><h3>A2 — Modelled comparison row</h3></div>
  <p class="util-activity-progress">Step 1 of 3</p>
  <section class="util-instructional-section util-instructional-orient">
    <h4 class="util-instructional-heading">Why this activity</h4>…
  </section>
  <section class="util-instructional-section util-instructional-think">
    <h4 class="util-instructional-heading">How to approach this</h4>…
  </section>
  <section class="util-instructional-section util-instructional-study">
    <h4 class="util-instructional-heading">Read and model</h4>…
  </section>
  <section class="util-instructional-section util-instructional-do">
    <h4 class="util-instructional-heading">What to do</h4>…
  </section>
  …
</article>
```

### Check unification (Marx A4)

**Before:** Checklist in materials stack + separate `<div class="util-output-block">` with *Output* heading after the activity.

**After:** Single `<section class="util-instructional-check">` containing checklist **and** expected-output prose under *Check your work*.

### Pre-check Reflect (Marx A3)

When `self_explanation_prompt` coexists with `expected_output` / checklist:

```html
<section class="util-instructional-section util-instructional-reflect-precheck">
  <h4 class="util-instructional-heading">Explain before you check</h4>…
</section>
<section class="util-instructional-section util-instructional-do">…</section>
<section class="util-instructional-section util-instructional-check">…</section>
```

---

## Test evidence

```text
node --test \
  tests/sprint-50-phase-2-renderer-instructional-grammar.test.js \
  tests/utility-journey-compass-render.test.js \
  tests/utility-marx-page-render.test.js \
  tests/utility-self-directed-activity-framing.test.js \
  tests/utility-renderer-kitchen-sink.test.js \
  tests/page-49-6b-gam-material-preservation.test.js \
  tests/sprint-50-phase-1-compose-fidelity.test.js

ℹ tests 95
ℹ pass 95
ℹ fail 0
```

### Phase 2 tests (`sprint-50-phase-2-renderer-instructional-grammar.test.js`)

| Test | AC |
| ---- | -- |
| Marx fixture renders grammar headings | AC1, AC6 |
| Study before Do on modelled comparison | AC2 |
| Check unifies checklist and expected output | AC3 |
| Explain before you check (pre-check) | AC1 (branch) |
| No duplicate `util-cognition` | AC5 |
| Compass does not duplicate reasoning signals | AC5 |
| Single-column layout (no side compass column) | AC6 |
| Marx run2 composed page Orient/Think | AC4 |
| Lib partition checklist in Check bucket | Partition contract |

---

## Success criteria

| ID | Criterion | Status |
| -- | --------- | ------ |
| AC1 | Activities render instructional sections in validated order | **Pass** |
| AC2 | Study appears before Do when Study materials exist | **Pass** |
| AC3 | Check combines checklist and expected output | **Pass** |
| AC4 | Orient and Think render when present | **Pass** |
| AC5 | Duplicate Compass / Think / Transfer signalling removed | **Pass** |
| AC6 | Linear heading structure visible in rendered HTML | **Pass** |
| AC7 | Sprint 48–49 regressions remain green | **Pass** (95/95) |

---

## Risks

| Risk | Severity | Mitigation |
| ---- | -------- | ---------- |
| Benchmark corpus pages without composed PEL fields render grammar with empty Orient/Think | Low | Phase 1 compose + `applyPageCompositionValidation` in export tests; empty sections omitted |
| Material key misclassification for uncommon GAM keys | Low | `classifyRemainingMaterialKey` heuristic defaults to Study; extend keys only when corpus proves gap |
| Workshop pages intentionally excluded — different layout persists | Info | `isLearnerWorkshopPage` gate documented; no change to workshop delivery |
| Pre-check Reflect rule is structural (self_explanation + check sources), not semantic timing | Low | Matches Sprint 50 spec activation rule; content authors position prompts accordingly |

---

## Validation notes

- **Accessibility:** Sections use semantic `<section>` + `h4` headings; progress uses `aria-label`; content remains coherent with styles removed (single-column document order).
- **Reading order:** Heading outline alone communicates Why → How → Read → Do → Check → Take Away → Apply on fully populated activities.
- **Compose boundary respected:** No changes to DLA/GAM/prompts/contracts/schemas/gates/ontology; renderer reads authoritative `page.json` rows only.
- **Compass:** Page-level journey header retained; per-activity aside removed in grammar mode; `A1 — Title` progression label moved to activity `h3`.

---

## Next steps (out of scope for Phase 2)

- Visual design polish for instructional sections (typography tiering beyond functional headings)
- Authoring guidance for when `self_explanation_prompt` should use pre-check vs post-check semantics
- Optional: workshop learner pages if product requests grammar parity (currently legacy renderer)
