# Sprint 68 — Implementation Notes

Working notes for implementers. Update as work proceeds.

---

## S68-IMP-012 — GAM type audit and kitchen-sink fixture (2026-07-21)

### Audit methodology

Merged `lib/beat-material-registry.js` (50 types), vNext `MATERIAL_RENDERER_TYPES` (13), and `tests/fixtures/**/*.json` emission scan. Renderer paths reviewed in `render-material.js`, composition seam, and workspace routing.

Regenerate: `npm run build:gam-renderer-type-inventory`

### Inventory totals

| Metric | Value |
|--------|------:|
| Canonical material types | 51 |
| vNext-supported | 13 |
| Kitchen-sink coverage | 100% (13/13) |
| Unsupported in vNext page path | 38 |

### Type-to-surface mapping

- **text_entry** ← task-step patterns (reflection, explanation, justification, …)
- **table_entry** ← `analysis_table`, `decision_table`, `comparison_table` in composed Do
- **static** ← default for all types in beats / KS fixture path

### Kitchen-sink fixture

`tests/fixtures/page-render/learner-renderer-kitchen-sink-page.json` — activities KS01–KS05, one archetype variant each, all thirteen vNext material types.

Regenerate fixture: `npm run build:learner-renderer-kitchen-sink-fixture`

Capture review: `node docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/capture-kitchen-sink-review.js`

### Ordering/ranking findings

Documented in `artefacts/gam-renderer-type-inventory.json` → `ordering_ranking_findings`. No ordering surface implemented.

### Maintenance

New emitted type → inventory script / test failure → classify → add fixture case or unsupported report.

### Tests

`tests/learner-renderer-vnext-kitchen-sink.test.js` (10 tests). **279/279** vNext tests passing.

### Architectural statements

> GAM activity and manifestation types do not map one-to-one to learner surfaces. Different educational activities may reuse the same learner-surface capability.

> Learner surfaces are an open-ended renderer-owned capability set. The kitchen-sink inventory records current coverage but does not define a permanent closed taxonomy.

> New learner surfaces should be introduced only when a real emitted activity cannot be represented well using an existing surface capability.

No GAM, PRISM, or pipeline semantics were changed.

---

## S68-IMP-011 — Full-page moments mode integration (2026-07-21)

### Where moments mode is enabled

| Boundary | Behaviour |
| -------- | --------- |
| `lib/learner-renderer-vnext/composition-config.js` | `DEFAULT_COMPOSITION_MODE = "moments"` |
| `normalizeCompositionMode()` | Defaults to moments; explicit `"beats"` still supported |
| `renderLearnerPageHtml()` | Single renderer entry — no downstream mode duplication |
| `app.js` → `runLearnerRendererVNextExport()` | Passes optional `compositionMode` from export pipeline; otherwise uses renderer default |
| `render-page.js` | Emits `data-composition-mode="moments"` on page root `<main>` |

Beats mode override: `renderLearnerPageHtml(page, { compositionMode: "beats" })` or `renderLearnerPageForTest(..., { compositionMode: "beats" })`.

### Full-page structural metrics (heteroscedasticity reference lesson)

| Metric | Moments (default) | Beats (explicit) |
| ------ | ----------------- | ---------------- |
| Activities | 5 | 5 |
| Composition moments | 20 | 0 |
| Beat sections | 0 | 17 |
| Table-entry workspaces | 3 | 0 |
| Text-entry workspaces | 3 | 0 |
| Table inputs | 29 | 0 |
| Textareas | 3 | 0 |
| Duplicate IDs | 0 | 0 |

Surface coverage unchanged: A1/A4 text_entry; A2/A3 table_entry; A5 table_entry + text_entry.

### Integrated review findings

No composition-mapping defects required changes in this slice. Full-page review confirmed:

- Orient / Learn / Do / Check rhythm across all five activities
- A5 retains table-entry before text-entry
- Non-persistence guidance present without excessive duplication
- Reference tables remain static in Learn
- Unique IDs and activity-scoped table header references across the page

### Architectural statement

> Moments mode is now the default learner-renderer composition path. Further renderer development proceeds by reviewing real authored cases, reusing existing learner surfaces where possible, and introducing new surface capabilities only when a concrete educational interaction cannot be represented well by the existing set.

No PRISM, GAM, or pipeline changes were required.

### Tests

`tests/learner-renderer-vnext-compose-full-page.test.js` (8 tests). Updated default-mode expectations in compose A1 tests, feature-flag tests, field-coverage, export-shell, icons, and visual-affordances tests. **269/269** vNext tests passing.

### Artefacts

| Artefact | Path |
| -------- | ---- |
| Beats-mode full-page export | `heteroscedasticity-s68-full-page-beats-mode-export.html` |
| Moments-mode full-page export | `heteroscedasticity-s68-full-page-moments-mode-export.html` |
| Structural comparison JSON | `heteroscedasticity-s68-full-page-composition-structural-comparison.json` |
| Side-by-side review HTML | `heteroscedasticity-s68-full-page-review.html` |
| Capture script | `capture-s68-full-page-composition-review.js` |

---

## S68-IMP-010 — A5 capstone composition with ordered multi-surface Do (2026-07-21)

### Composition mapping

| Moment | Sources |
| ------ | ------- |
| **Orient** | study phase, activity purpose, preamble, reasoning orientation, `intellectual_coherence_bridge` |
| **Learn** | step 1 + `A5-M1` (orientation beat); step 2 + `A5-M2` (scenario) + `A5-M3` (worked judgement) (comparison beat) |
| **Do** | `argument_structure_hint`; steps 3–4 + `A5-M4` (comparison_table) + `A5-M5` (template) + `expected_output`; text workspace for step 4 |
| **Check** | step 5 + `A5-M6` (evaluation beat); step 6 + `A5-M8` (consolidation) + `A5-M7` (transfer) (reflection beat content; reflection beat omitted) |

Beat anchors: Learn → `comparison`, Do → `evaluation`, Check → `evaluation`.

Beat omissions: entire `reflection` beat (Check absorbs step 6 materials); `orientation` beat framing (Orient + Learn consume orientation content).

### Learner-surface sequence

| Surface | Material / step | Renderer |
| ------- | --------------- | -------- |
| `table_entry` | `A5-M4` comparison_table (step 3) | `renderTableWorkspace()` |
| `text_entry` | step 4 written judgement | shared `renderLearnerWorkspace()` |

Do item order: structure hint → step 3 → table workspace → step 4 → template → expected output → text workspace.

### Composition-model generalisation

- `CompositionMoment.workspaces` — ordered workspace requirement collection (backward-compatible `workspace` retained for single-surface activities)
- `determineWorkspaceRequirements()` — resolves multiple step-anchored workspaces
- `composeLearnMomentFromBeatConfigs()` / `composeCheckMomentFromBeatConfigs()` — multi-beat moment assembly
- `learnRenderHintsFromItems()` / `checkRenderHintsFromItems()` — per-beat suppression from item `sourceRef.beatFunction`
- `omitPromptSourceFields` on beat suppression — prevents duplicate Do prompts (e.g. `argument_structure_hint`)
- `renderTableWorkspace(..., { omitGuidance })` — deduplicates non-persistence guidance when table and text surfaces cohabit one Do moment

### Guidance deduplication

When Do contains both table-entry and text-entry surfaces, table-specific non-persistence guidance is omitted; the text workspace retains the shared learner guidance once.

### Architectural statement

> A learner activity may compose multiple learner-surface capabilities in an ordered sequence. Surface capability is independent of activity identity, and the current text-entry and table-entry surfaces remain an open-ended renderer-owned set.

No A5-specific renderer (`renderA5Workspace`, composite workspace type, or A5 CSS) was introduced. No PRISM, GAM, or pipeline changes were required.

### Sprint 68 surface coverage

```text
A1 → text_entry
A2 → table_entry
A3 → table_entry
A4 → text_entry
A5 → table_entry + text_entry
```

### Tests

`tests/learner-renderer-vnext-compose-a5.test.js` (11 tests). Default moments activity set now includes A5 (`DEFAULT_MOMENTS_ACTIVITY_IDS`).

### Artefacts

`docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/artefacts/capture-a5-composition-ux-review.js`

---

## S68-IMP-009 — A4 composition and prompt-set free-text workspace (2026-07-21)

### Composition mapping

| Moment | Sources |
| ------ | ------- |
| **Orient** | study phase, activity purpose, preamble, reasoning orientation |
| **Learn** | steps 1–2 + `A4-M1` (text) + `A4-M2` (modelling note) from `explanation` beat |
| **Do** | step 3 + `A4-M3` (prompt set) + `expected_output` from `application` / `check_understanding` beats |
| **Check** | step 4 + `A4-M4` (checklist) from `check_understanding` beat |

Beat anchors: Learn → `explanation`, Do → `application`, Check → `check_understanding`.

### Learner-surface decision

**Capability:** `text_entry` (free-text), reusing the A1 workspace renderer.

**Cardinality:** **One combined textarea.** The five prompt-set questions form one coherent chain-of-effects explanation; `expected_output` describes a single successful explanation, not five separate answers.

**Prompt presentation:** `A4-M3` renders once via `renderMaterial()` as a `prompt_set`; the workspace sits beneath with label “Explain the chain of effects”. Prompts are not duplicated inside the workspace.

### Shared generalisation

- `compose-workspace.js` — A4 step-3 rule; shared `buildTextEntryWorkspace()` helper
- `WorkspaceRequirement.responseLabel` — accessible workspace label without duplicating prompt text
- `composeDoMomentForBeat` — configurable `workspaceStepNumber` (replaces hardcoded step 5)

### Open capability set

> Activity types and learner surfaces are different dimensions. Multiple educational activity types may reuse the same learner-surface capability, and the currently implemented capabilities are not a closed list produced by PRISM.

Demonstrated capabilities: `text_entry`, `table_entry`. Renderer chooses concrete controls; composition identifies capability only.

### Implications for A5

A5 may combine `comparison_table` (table_entry reuse) with a written judgement step (text_entry). Composition mapping for A5 remains the final Sprint 68 activity slice.

### Tests

`tests/learner-renderer-vnext-compose-a4.test.js` (8 tests).

---

## S68-IMP-008 — A3 composition and table workspace reuse (2026-07-21)

### Composition mapping

| Moment | Sources |
| ------ | ------- |
| **Orient** | study phase, activity purpose, preamble, reasoning orientation |
| **Learn** | steps 1–2 + `A3-M1` (`worked_example` beat) |
| **Do** | steps 3–4 + `A3-M2` (scenarios) + `A3-M3` (`decision_table`) + `expected_output` (`practice` beat) |
| **Check** | step 5 + `A3-M4` (checklist) + `transfer_or_application_task` (`reflection` beat, composed as prompt) |

Beat injection anchors: Learn → `worked_example`, Do → `practice`, Check → `practice`. Reflection beat omitted via `activityOmitBeatFunctions`.

### Table workspace reuse

`A3-M3` (`decision_table`) uses the **same** `renderTableWorkspace()` path as A2-M2. No new workspace renderer. Composition metadata (`tableWorkspace: true`) is set automatically via `shouldComposeTableWorkspaceMaterial()` for all completion-table types in Do.

### Renderer generalisation (minimal)

`render-table-workspace.js` now assigns visually hidden row labels when the first column is blank (tables without case-label rows). Required for A3 decision table rows; also improves accessibility for similar A5 tables.

### Pipeline changes

None. Activity-scoped composition constants only.

### Limitations for A5

A5 uses `comparison_table` and may include multi-beat practice structure similar to A3. The existing table workspace renderer should apply without new workspace types; A5 composition mapping remains a separate task.

### Tests

`tests/learner-renderer-vnext-compose-a3.test.js` (9 tests). Regression tests updated so A4–A5 remain beats-only in moments export.

---

## S68-IMP-007 — A2 interactive table workspace (2026-07-21)

### Table workspace rendering path

New renderer module: `render-table-workspace.js` with `renderTableWorkspace(material, activityId)`.

Do-moment material items carry explicit composition metadata (`tableWorkspace: true`) when the material type is a supported completion-table family (`analysis_table`, `decision_table`, `comparison_table`). `renderDoMoment()` routes those items to the table workspace path instead of `renderMaterial()`.

### Semantic routing rule (reference vs completion)

| Signal | Reference table (A2-M1) | Completion table (A2-M2) |
| ------ | ------------------------- | ------------------------ |
| Composition moment | Learn | Do |
| Composition metadata | none | `tableWorkspace: true` |
| Material type | `worked_example` (embedded table) | `analysis_table` |
| Render path | `renderMaterial()` | `renderTableWorkspace()` |

Editability is **not** inferred from blank cells alone in the generic material renderer. Blank cells become inputs only inside the explicit table-workspace path.

### Editable-cell inference (within table workspace)

1. Header row → `<th scope="col">` (fixed).
2. First column with authored row label → `<th scope="row">` (fixed).
3. Any cell with authored non-empty content → fixed `<td>`.
4. Remaining empty cells in body rows → single-line `<input type="text">`.

Parsed representation is markdown pipe-table rows only; no per-cell schema in the model. Distinction relies on composition placement + material type + empty-vs-authored cell content inside the workspace renderer.

### Accessibility

- Semantic `<table>` retained with column and row headers (`scope="col"` / `scope="row"`).
- Each input uses `aria-labelledby` referencing row and column header element IDs.
- Non-persistence guidance rendered once above the table scroller (`.util-learner-table-workspace__guidance`).

### Presentation, responsive, print

CSS scoped under `.util-learner-table-workspace` in `getUtilityVnextCompositionMomentPresentationCss()` — fixed cells use a muted background; editable cells use native inputs. Table scroll wrapper reused. Print rules flatten input chrome and preserve fixed-cell distinction.

### Rule 3 preserved

`doMoment.workspace` remains `null`. No standalone textarea beneath the table. The fillable table material is the workspace surface.

### Out of scope (confirmed)

No validation, scoring, persistence, or submission behaviour.

### Learner-complete status

A2 is **composition-complete and learner-complete in moments mode** using the table-completion workspace variant.

### Remaining reuse work

- A3 / A5 composition (not this task) will reuse the same `tableWorkspace` metadata + renderer when their `analysis_table` / `decision_table` materials are composed into Do.
- Optional future: per-cell control type hints if authored structure requires textarea rather than single-line input.

### Tests

`tests/learner-renderer-vnext-compose-a2-table-workspace.test.js` (9 tests). Updated A2 regression tests in `learner-renderer-vnext-compose-a2.test.js`.

---

## S68-IMP-006 — A2 composition (static workspace) (2026-07-21)

### Activity 2 composition mapping

| Moment | Sources consumed |
| ------ | ---------------- |
| **Orient** | study phase, activity purpose, preamble, reasoning orientation, `conceptual_contrast_prompt` |
| **Learn** | step 1 + `A2-M1` (`worked_example`, includes reference table) from `worked_example` beat |
| **Do** | steps 2–4 + `A2-M3` (scenarios) + `A2-M2` (analysis table) + `expected_output` from `analysis` / `check_understanding` beats |
| **Check** | step 5 + `A2-M4` (checklist) from `check_understanding` beat |

Beat injection anchors: Learn → `worked_example`, Do → `analysis`, Check → `check_understanding`.

### Reference vs completion tables

| Material | Role | Moment | Render path |
| -------- | ---- | ------ | ----------- |
| **A2-M1** embedded table | Reference / instructional (inside worked example) | Learn | `renderMaterial()` — static, read-only |
| **A2-M2** | Learner completion scaffold | Do | `renderMaterial()` — static empty cells, fixed Example row preserved |

Semantic distinction is by **composition placement**, not a separate table-input renderer.

### Rule 3 application

A2 provides a fillable analysis-table scaffold (`A2-M2`). **No standalone `WorkspaceRequirement` or textarea** was created beneath the table. The analysis table **is** the learner workspace surface for this slice (static rendering only).

### Intentional limitation (not learner-complete)

`A2-M2` renders through the existing material table path with **empty `<td>` cells and no `<input>` / `<textarea>` elements**. Interactive table editing is deferred to the dedicated table-workspace task identified in the workspace generalisability checkpoint.

### Modules changed

- `compose-activity-moments.js` — A2 Learn/Do/Check rules; generalised beat-anchor helpers; orient entry-prompt support for `conceptual_contrast_prompt`
- `compose-page-model.js` — default moments activities `["A1", "A2"]`; beat anchor render hints
- `render-activity.js` — moment injection at activity-specific beat functions
- `types.js` — `learnMomentBeat`, `doMomentBeat`, `checkMomentBeat`
- `lib/learner-renderer-vnext-browser.js` — rebuilt bundle

### Tests

`tests/learner-renderer-vnext-compose-a2.test.js` (10 tests). Updated A1 regression tests for A3–A5 unchanged / A2 composed.

### Validation artefacts

`artefacts/capture-a2-composition-ux-review.js`, `wrap-a2-review-pages.js`, structural comparison JSON, beats/moments A2 exports and review HTML.

### Remaining work for learner-complete A2

- Interactive table workspace renderer for `A2-M2` empty cells (Sprint 69+)
- Accessible cell/header associations and non-persistence guidance at cell level
- Visual distinction between reference tables (Learn) and editable completion tables (Do)

---

## S68-IMP-005 — A1 composition moment presentation CSS (2026-07-21)

### Delivery

Added `getUtilityVnextCompositionMomentPresentationCss()` in `app.js` and wired it into `getUtilityVnextProseMeasureCss()`. All rules are scoped under `.util-learner-renderer-vnext .util-composition-moment` (and descendants) so default beats mode HTML and styling remain unchanged.

### Presentation changes

| Area | CSS treatment |
| ---- | ------------- |
| Activity rhythm | Consistent vertical spacing between moments; transparent moment containers (no card restarts) |
| Moment headings | `.util-composition-moment-heading` — calm hierarchy with subtle bottom border |
| Orient metadata | `.util-composition-study-phase`, `.util-composition-activity-purpose` — smaller, muted |
| Instructions in moments | Beat left-border removed inside composed moments only |
| Learn | Softer definition material headings inside `.util-composition-learn-item--definition` |
| Do | `.util-composition-expected-output` panel; `.util-learner-workspace` integrated container with styled textarea and secondary persistence note |
| Check | `.util-composition-check-guidance` muted guidance; styled native `<details>` reveal with chevron and focus ring |

### Unchanged

- Composition adapter logic (IMP-001–004)
- Authored content and HTML semantics
- Beats mode markup and beat-era CSS
- A3–A5 rendering (A2 composed in IMP-006)
- Check reveal behaviour (closed by default, no JavaScript)
- Workspace non-persistence copy

### Tests

`tests/learner-renderer-vnext-compose-presentation.test.js`

### Validation artefacts

Regenerated via `artefacts/capture-a1-composition-ux-review.js` and `wrap-a1-review-pages.js`. Screenshots saved to `artefacts/s68-imp-005-moments-a1-*-after.png`.

### Remaining UX issues (defer to Sprint 69)

- Orient moment has no visible moment heading (by design); learners may benefit from a softer intro divider between activity title and first moment body
- Material `h2` inside definition content can still compete with moment headings on long pages
- Reflect/Transition moments not composed; step 4 misconception prompt remains inside Check
- Icon density in instruction rows still reads slightly “beat-era” despite border removal
- No in-app preview path for moments mode outside export shell (preview parity if needed)

---

## Setup (2026-07-21)

- Sprint 68 pack created; **no renderer code changed**.
- First investigation INV-001 opened for activity bridging.
- Primary code surfaces identified in [investigation-log.md](investigation-log.md).

---

## S68-IMP-004 — A1 Learn moment and explanatory content composition (2026-07-21)

### Model changes

Extended `CompositionMoment` for `kind: "learn"` with:

- ordered `items` (`instruction`, `material`) with semantic `role` per item
- `explanatorySteps`, `materials`
- `renderHints.suppressBeatContent` for explanation beat filtering

Extended `ActivityCompositionRenderHints` with `learnMoment`.

### Learn moment sources consumed (A1)

From `explanation` beat:

| Source | Step / ID | Learn classification reason |
| ------ | --------- | --------------------------- |
| Learner task step 1 | Study explanatory text | Introductory study instruction preparing concept learning |
| Material A1-M1 | text (Residual Variance…) | Core concept definitions and homoscedasticity/heteroscedasticity distinction |

**Not consumed:** orientation prompts (Orient), Do/Check task steps and materials, reflective semantics.

### Learn-moment item roles

| Item | Role |
| ---- | ---- |
| Step 1 instruction | `explanation` |
| A1-M1 | `definition` |

Roles are render-time composition metadata only — not a persisted schema.

### Structured-material renderer reuse

Learn moment rendering calls existing `renderMaterial(material)` from `render-material.js` inside a composition wrapper (`util-composition-learn-item`). No material HTML duplication; no extraction required — beat and composed paths share the same renderer.

Instructions reuse `learnerIcons.renderInstructionBlock`.

### Rendered behaviour

Moments mode for A1 renders in order:

1. Composed Orient (S68-IMP-001)
2. Composed Learn section (`Explore the idea`, step 1, A1-M1 — visible immediately)
3. Composed Do section (S68-IMP-002)
4. Composed Check section (S68-IMP-003)

No reveal behaviour for Learn — A1 has no prediction-before-explanation dependency.

### Duplicate suppression and empty-beat handling

Element-level suppression via `applyBeatContentSuppression`:

- `explanation`: omit step 1, material A1-M1

After filtering, explanation beat has no renderable content and is omitted cleanly via `hasRenderableContent`. Authoritative page model unchanged.

Default `"beats"` mode unaffected.

### Known limitations

- Learn composition is A1-specific (`activityId === "A1"`)
- Item role mapping is A1-scoped (`learnItemRoleForMaterial`)
- No general explanatory-content classifier

### Tests

`tests/learner-renderer-vnext-compose-a1-learn.test.js`

---

## S68-IMP-003 — A1 Check moment and learner verification flow (2026-07-21)

### Model changes

Extended `CompositionMoment` for `kind: "check"` with:

- ordered `items` (`instruction`, `material`)
- `checkingSteps`, `materials`, `learnerGuidance`
- per-item `reveal` (`CompositionReveal`) separate from HTML rendering
- merged `renderHints.suppressBeatContent` combining Do + Check suppression

Extended `ActivityCompositionRenderHints` with `checkMoment`.

### Check moment sources consumed (A1)

From `check_understanding` beat after Do suppression:

| Source | Step / ID | Check classification reason |
| ------ | --------- | --------------------------- |
| Learner task step 3 | Compare sample response with explanation | Comparison / verification against authored reference |
| Material A1-M3 | sample_output | Reference example for comparison (step 3) |
| Learner task step 4 | Complete self-check + misconception | Self-verification using criteria |
| Material A1-M4 | checklist | Evaluation criteria for self-check (step 4) |

**Not consumed (deferred or already composed elsewhere):**

- Steps 2 & 5, A1-M2, `expected_output` — consumed by Do (S68-IMP-002)
- Introductory `self_explanation_prompt` — Orient (S68-IMP-001); step 4 misconception language retained in Check as authored verification task, not composed as Reflect

### Reveal decision

| Material | Default state | Rationale |
| -------- | ------------- | --------- |
| A1-M3 (sample response) | Hidden (`<details>`, closed) | Step 3 asks the learner to compare first; immediate visibility would undermine comparison |
| A1-M4 (checklist) | Visible | Criteria support self-check without giving away the sample answer |

Reveal intent stored on composed item as `{ mode: "details", defaultOpen: false, summary: "Review the example response" }`. Rendered as native `<details>` / `<summary>` (no JavaScript).

### Rendered behaviour

Moments mode for A1 renders in order:

1. Composed Orient (S68-IMP-001)
2. Composed Learn section (S68-IMP-004)
3. Composed Do section (S68-IMP-002)
4. Composed Check section (`Check your response`, guidance, steps 3–4, A1-M3 reveal, A1-M4)

Presentational guidance only: *Complete your response first, then use this material to check or improve it.* No automated checking, scoring, saving, or submission claims.

### Duplicate suppression and empty-beat handling

Merged element-level suppression via `applyBeatContentSuppression`:

- `check_understanding`: omit steps 2–5, materials A1-M2/A1-M3/A1-M4, expected output

After filtering, the check beat has no renderable content. `renderBeat` returns empty string via `hasRenderableContent` — no empty heading, wrapper, or landmark. Original beat data remains in the authoritative page model.

Default `"beats"` mode unaffected.

### Known limitations

- Check composition is A1-specific (`activityId === "A1"`)
- Step 4 misconception prompt remains in Check as verification task; standalone Reflect moment deferred
- No A1 transition composed
- Reveal mechanism is A1-M3 only; not a general interaction framework

### Tests

`tests/learner-renderer-vnext-compose-a1-check.test.js`

---

## S68-IMP-002 — A1 Do moment and learner workspace (2026-07-21)

### Model changes

Extended `CompositionMoment` for `kind: "do"` with:

- ordered `items` (`instruction`, `material`, `expectedOutput`)
- `taskSteps`, `materials`, `expectedOutput`, `workspace`
- `renderHints.suppressBeatContent` for source-driven beat filtering

New modules: `compose-workspace.js`, `compose-beat-suppression.js`.

### Workspace decision rule (A1 only)

For activity `A1`, learner task step **5** whose text begins with `Write` requires an inline text workspace.

- `mode: inline`, `capability: text_entry`
- `persistenceAvailable: false`
- Guidance: response is not saved on this page

This is **not** a general keyword classifier — it applies only to the A1 archetype slice.

### Do moment sources consumed (A1)

From `check_understanding` beat / activity fields:

| Source | Step / ID |
| ------ | --------- |
| Learner task step 2 | Work through expert example |
| Material A1-M2 | worked_example |
| Learner task step 5 | Write brief explanation |
| expected_output | Success criteria |

Steps 3–4 and materials A1-M3/A1-M4 are consumed by Check (S68-IMP-003).

### Rendered behaviour

Moments mode for A1 renders in order:

1. Composed Orient (S68-IMP-001)
2. Composed Learn section (S68-IMP-004)
3. Composed Do section (`Your task`, steps, A1-M2, `What to produce`, workspace)
4. Composed Check section (S68-IMP-003)

### Duplicate suppression

Element-level via `applyBeatContentSuppression` in `render-beat.js`:

- `check_understanding`: omit steps 2 & 5, material A1-M2, expected output (Do); steps 3–4, A1-M3/A1-M4 (Check, merged in IMP-003)

### Known limitations

- Do composition is A1-specific (`activityId === "A1"`)
- Workspace rule is A1 step 5 + `Write` prefix only
- Textarea is non-persisted presentation only
- Expected output moved from check beat into Do (`What to produce`)
- Transition and Reflect moments not yet composed

`tests/learner-renderer-vnext-compose-a1-do.test.js`

---

## S68-IMP-001 — A1 Orient composition adapter (2026-07-21)

### Modules

| Module | Role |
| ------ | ---- |
| `lib/learner-renderer-vnext/compose-sequence-context.js` | Reads `learning_sequence.study_flow` and `timeline` (non-mutating) |
| `lib/learner-renderer-vnext/compose-activity-moments.js` | Activity-level Orient moment builder |
| `lib/learner-renderer-vnext/compose-page-model.js` | `buildComposedPageModel(modelResult, sourcePage, options)` |
| `lib/learner-renderer-vnext/render-composed-moment.js` | Renders composed Orient section HTML |

### Function boundary

```js
buildComposedPageModel(modelResult, sourcePage, options?)
  → { ok, composed, errors, warnings }

renderLearnerPageHtml(sourcePage, { compositionMode: "moments" })
  → buildPageModel → buildComposedPageModel → renderPage(model, { activityComposition })
```

Default `compositionMode` is `"beats"` (unchanged Sprint 67 behaviour).

### Feature option

- `compositionMode: "beats"` — default; beat-serialised rendering
- `compositionMode: "moments"` — enables A1 Orient composition slice only

Optional: `activityIds: ["A1"]` (defaults to A1 when moments mode is enabled).

### Composed in this slice

**A1 Orient only:** study phase, activity purpose, activity preamble, reasoning orientation, introductory `self_explanation_prompt`.

### Not composed yet

Learn, Do, Check, Reflect, Transition; A2–A5; mapped outcomes (still rendered via existing `renderMappedOutcomes`); workspace for A1 step 5; A1→A2 transition.

### Duplicate suppression

When A1 Orient is composed:

- `renderFraming` suppressed for A1
- orientation beat omitted (`omitBeatFunctions: ["orientation"]`)

### Deviations from seam design

- `buildComposedPageModel` returns `{ composed }` rather than attaching to model; render hints carried on composed activity entries and mapped via `buildActivityCompositionMap`.
- Mapped learning outcomes remain outside the Orient moment in this slice (minimal vertical cut).

### Unresolved (unchanged)

- LC-A1-01: no explicit A1 transition field
- LC-A1-02: step 5 workspace gap
- LC-A1-04: self-explanation dual role (Orient only in this slice; Reflect deferred)

### Tests

`tests/learner-renderer-vnext-compose-a1.test.js`

---

## Field reference (transition-like)

| JSON / source field | Model | Label (if prompt) | Current render |
| ------------------- | ----- | ----------------- | -------------- |
| `activity_preamble` | `activity.preamble` | activity.preamble icon | `util-activity-preamble` at activity start |
| `reasoning_orientation` | activity / beat | Reasoning orientation | `util-pedagogical-guidance--reasoning-orientation` |
| `intellectual_coherence_bridge` | beat prompt | Connect your learning | Beat prompt stream inside owning activity |
| `progression_guidance` | page orientation | — | Orient section |
| `argument_structure_hint` | beat prompt | — | Beat prompt stream |

---

## Placeholder sections

### Bridging implementation notes

*(Add after S68-BL-003)*

### Narrative continuity notes

*(Add after S68-BL-004)*

### Schema gap notes

*(Add after S68-BL-009 if required)*
