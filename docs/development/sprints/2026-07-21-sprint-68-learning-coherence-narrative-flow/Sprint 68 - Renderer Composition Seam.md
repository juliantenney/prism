# Sprint 68 – Renderer Composition Seam

**Status:** Architecture design (pre-implementation)  
**Reference case:** Activity 1 — heteroscedasticity fixture  
**Related:**
- [Sprint 68 - Learner Composition Model.md](Sprint%2068%20-%20Learner%20Composition%20Model.md)
- [Sprint 68 - Learner Renderer Composition Principles.md](Sprint%2068%20-%20Learner%20Renderer%20Composition%20Principles.md)

---

## 1. Current rendering pipeline

The vNext learner renderer is a **CommonJS HTML-string pipeline** (not React). It receives an assembled PRISM page JSON object and returns HTML fragments that `app.js` wraps in the export shell.

### End-to-end flow

```
PRISM page JSON (artifact_type: "page")
  │
  ├─ [Production] app.js
  │     runUtilityPageExportPipeline(parsed, opts)
  │       → resolvePageForRenderOrAssembly(parsed)          // optional capture assembly
  │       → applyPageCompositionValidationForUtilitiesPage  // upstream closure check (not learner moments)
  │       → runLearnerRendererVNextExport(parsed)
  │             → PRISM_LEARNER_RENDERER_VNEXT.renderLearnerPageHtml(parsed)
  │             → composeStandaloneVnextLearnerExport(html, modelResult, parsed)  // export shell
  │
  └─ [vNext core] lib/learner-renderer-vnext/
        render-learner-page.js :: renderLearnerPageHtml(sourcePage)
          → build-page-model.js :: buildPageModel(sourcePage)     // LearnerPageModel
          → render-page.js :: renderPage(model)                   // HTML string
```

**Browser bundle:** `scripts/build-learner-renderer-vnext-browser.js` bundles `lib/learner-renderer-vnext/` into `lib/learner-renderer-vnext-browser.js`, registered as `window.PRISM_LEARNER_RENDERER_VNEXT` via `browser-entry.js` → `index.html`.

**Test entry:** `app.js` exposes `prismTestApi.renderLearnerPageForTest(parsed, opts)` which calls the same `runUtilityPageExportPipeline` path.

---

### Stage A — Page intake and upstream validation

| Step | Location | Function | Role |
| ---- | -------- | -------- | ---- |
| Export pipeline gate | `app.js` ~47558 | `runUtilityPageExportPipeline` | Validates `artifact_type: "page"`, resolves renderer version (`legacy` \| `vnext`, default `vnext`) |
| Page assembly | `app.js` | `resolvePageForRenderOrAssembly` | Merges capture workflow artefacts when needed |
| Upstream composition validation | `app.js` | `applyPageCompositionValidationForUtilitiesPage` | Validates upstream/page closure (activities, materials). **Not** Sprint 68 learner-moment composition |
| Legacy normalisation (legacy path only) | `lib/page-render-normalize.js` | `normalizePageForRender` | Adapts vNext page shape for legacy utilities renderer |

vNext path **does not** use `page-render-normalize.js`. It reads the assembled page object directly.

---

### Stage B — Source validation and page model build

**Entry:** `lib/learner-renderer-vnext/build-page-model.js` → `buildPageModel(page)`

| Step | Module | Function | Data-flow notes |
| ---- | ------ | -------- | --------------- |
| Input validation | `validate-input.js` | `validateInput` | Structural checks: activities, episode plans, material IDs, learning sequence |
| Activity ordering | `build-page-model.js` | `orderedActivities` | Orders by `learning_sequence.ordered_activity_ids`; warns on extras |
| Activity model | `build-activity-model.js` | `buildActivityModel` | Per activity: preamble, reasoningOrientation, beats |
| Beat assignment | `build-beat-model.js` | `buildBeatModels` | Archetype-driven assignment of materials, task steps, prompts, expected output |
| Task parsing | `parse-learner-task.js` | `parseLearnerTask` | Numbered `learner_task` → `{ sourceStepNumber, text }[]` |
| Material parsing | `parse-material.js` | `buildMaterialModel` | GAM body → `LearnerMaterial` with checklist parsing |
| Archetype selection | `archetype-rules.js` | `selectArchetypeVariant` | Exact match on archetype + beat sequence |
| Page synthesis | `build-page-model.js` | inline | `page_synthesis.*` → `orientationSections[]` |
| Learning outcomes | `build-page-model.js` | inline | `learning_outcomes[]` → `{ id, statement }[]` |
| Progression | `build-page-model.js` | inline | `learning_sequence.navigation_guidance.progression_logic` → `progressionGuidance` |
| Assessment passthrough | `build-page-model.js` | inline | `assessment_check.items[]` copied to `model.assessment.items` |
| Model closure validation | `validate-model.js` | `validatePageModel` | Source-to-model material/step/expected-output closure |
| Visual affordances | `build-visual-affordance-placements.js` | `attachVisualAffordancePlacements` | Post-validation hook descriptors on beats/materials |

**Output type:** `LearnerPageModel` (contract in `types.js`).

**Not currently mapped into `LearnerPageModel`:**

- `learning_sequence.study_flow[].phase` (study phase)
- `learning_sequence.timeline[].purpose` (activity purpose)
- Full `learner_task` string at activity level (only beat-scoped step slices)
- Successor activity preamble for Transition composition

---

### Stage C — Beat content sequencing (pre-render)

**Module:** `lib/learner-renderer-vnext/build-beat-content-sequence.js` → `buildBeatContentSequence(beat)`

Called from `build-beat-model.js` after beat assignment. Produces `beat.contentSequence[]` — ordered `{ kind, instruction|prompt|material|expectedOutput }` items.

Ordering rules:

1. Entry prompts (`self_explanation_prompt`, `intellectual_coherence_bridge`, etc.) first
2. Instructions and materials **interleaved by index** (positional pairing)
3. Exit prompts (`transfer_or_application_task`) after interleaving
4. Expected output last

This is the primary within-beat ordering decision point today.

---

### Stage D — HTML rendering

**Entry:** `lib/learner-renderer-vnext/render-page.js` → `renderPage(model)`

| Region | Module | Function | Renders |
| ------ | ------ | -------- | ------- |
| Page shell | `render-page.js` | `renderPage` | `<main class="util-learner-renderer-vnext">` wrapper |
| Header | `render-page.js` | `renderHeader` | Title, overview (if not duplicated in orientation), duration |
| Orientation | `render-page.js` | `renderOrientationRegion` | Overview, learning purpose, knowledge summary, outcomes, progression guidance |
| Activities | `render-activity.js` | `renderActivity` | One `<article>` per activity |
| Beats | `render-beat.js` | `renderBeat` | One `<section class="util-beat-section">` per beat |
| Materials | `render-material.js` | `renderMaterial` | Typed material body |
| Prompts / instructions | `render-beat.js` | `renderPrompt`, `renderInstruction`, `renderExpectedOutput` | Per contentSequence item |
| Assessment | `render-page.js` | `renderAssessment` | Formative MCQ items |
| Study tips | `render-page.js` | `renderStudyTips` | Page synthesis study tips |
| Icons / labels | `learner-icon-renderer.js`, `prompt-labels.js`, `labels.js` | various | Presentation chrome |

**Activity render structure** (`render-activity.js`):

```
<article>
  <header> title + badges </header>
  [visual affordance hook]
  mapped outcomes
  renderFraming()          ← activity_preamble + reasoning_orientation (activity-level)
  renderBeat() × N         ← beat heading + contentSequence stream
</article>
```

**Export shell (post-render, `app.js`):**

- `composeStandaloneVnextLearnerExport` strips inline page header, injects sticky header + journey nav, applies vNext CSS (`getUtilityVnextProseMeasureCss`)

---

### Where ordering and grouping decisions are made today

| Decision | Where | Basis |
| -------- | ----- | ----- |
| Activity order | `build-page-model.js` :: `orderedActivities` | `learning_sequence.ordered_activity_ids` |
| Beat order | `build-beat-model.js` | Episode plan beat sequence (archetype rules) |
| Material → beat | `build-beat-model.js` | Material type vs archetype rule |
| Task step → beat | `build-beat-model.js` | Archetype `taskSteps.take` allocation |
| Prompt → beat | `build-beat-model.js` | Archetype `promptFields` |
| Within-beat stream | `build-beat-content-sequence.js` | Positional instruction/material interleave + prompt partition |
| Activity framing group | `render-activity.js` :: `renderFraming` | Visual wrapper only; preamble + reasoning_orientation |
| Beat visual group | `render-beat.js` | One heading per beat (`learnerLabel`) |

---

### Where raw PRISM fields pass directly into render modules

| Field | Model location | Render location |
| ----- | -------------- | --------------- |
| `activity_preamble` | `LearnerActivity.preamble` | `render-activity.js` :: `renderFraming` |
| `reasoning_orientation` | `LearnerActivity.reasoningOrientation` | `render-activity.js` :: `renderFraming` |
| `self_explanation_prompt` etc. | `LearnerBeat.prompts[]` | `render-beat.js` :: `renderPrompt` |
| `learner_task` steps | `LearnerBeat.instructions[]` | `render-beat.js` :: `renderInstruction` |
| Material bodies | `LearnerMaterial.body` | `render-material.js` |
| `expected_output` | `LearnerBeat.expectedOutput` | `render-beat.js` :: `renderExpectedOutput` |
| `page_synthesis.*` | `orientationSections[]` | `render-page.js` :: `renderOrientationSection` |
| `assessment_check.items` | `model.assessment.items` | `render-page.js` :: `renderAssessmentItem` (raw item fields: stem, options, correct_answer) |

Render modules **do not** read source JSON. They consume `LearnerPageModel` only (Sprint 67 invariant).

---

## 2. Existing composition behaviour

### Already semantic composition (reusable for Sprint 68)

| Behaviour | Fields combined | Location | Type | Reusable? |
| --------- | --------------- | -------- | ---- | --------- |
| Beat assignment | materials, task steps, prompts, expected output → beats | `build-beat-model.js` + `archetype-rules.js` | **Semantic** (archetype-driven ownership) | **Yes** — composition pass must preserve beat assignment; moments group across beats, not replace assignment |
| Beat content sequence | instructions + materials + prompts + expected output → ordered stream | `build-beat-content-sequence.js` | **Semantic** within beat | **Partially** — interleaving rule is a placeholder for moment-aware sequencing; entry/exit prompt partition is reusable |
| Activity framing wrapper | `activity_preamble` + `reasoning_orientation` | `render-activity.js` :: `renderFraming` | **Visual grouping only** | **Partially** — proves multi-field grouping works; does not include self-explanation, study phase, or purpose |
| Page orientation region | synthesis sections + outcomes + progression | `render-page.js` :: `renderOrientationRegion` | **Visual grouping** | **Yes** for page-level Orient; separate from activity Orient |
| Activity ordering | learning sequence | `build-page-model.js` | **Semantic** | **Yes** |
| Prompt label deduplication | prompt label vs beat heading | `render-beat.js` :: `shouldRenderPromptLabel` | Presentation | **Yes** |
| Checklist parsing | markdown body → criteria + revision instruction | `parse-material.js` | **Semantic parse** | **Yes** |

### Visual-only grouping (insufficient for Sprint 68)

| Behaviour | Issue |
| --------- | ----- |
| `renderFraming` | Groups preamble + reasoning orientation but leaves self-explanation prompt in orientation beat below a separate beat heading |
| Beat headings (`Reflect`, `Understand`, `Check your work`) | Expose episode-plan structure, not learner moments |
| Positional instruction/material pairing | Does not use task-step semantics ("Study" vs "Work through" vs "Compare") |

### Field-by-field serialisation (Sprint 68 targets)

| Location | Serialisation behaviour |
| -------- | ----------------------- |
| `render-activity.js` | Preamble and reasoning orientation rendered as separate labelled blocks before beats |
| `render-beat.js` | Each beat emitted as independent section with role heading |
| `build-beat-content-sequence.js` | One instruction block + one material per index without moment classification |
| `build-page-model.js` | Study phase and activity purpose dropped — not available to render layer |
| Activity A1 orientation beat | `self_explanation_prompt` isolated under "Reflect" heading, separated from preamble/reasoning at activity header |
| Step 5 (write explanation) | Instruction rendered as text block; no workspace; `expected_output` appended in same beat without Do/Check separation |

**A1 symptom (from Composition Model):** five PRISM entry fields form one Orient moment in design, but vNext renders them as 3+ visual restarts (header framing, beat heading, prompt label, then explanation beat heading).

---

## 3. Proposed composition seam

### Recommended insertion point

```
buildPageModel(sourcePage)          ← Sprint 67 assignment (unchanged)
        ↓
validatePageModel + VA attachments  ← unchanged
        ↓
┌───────────────────────────────────────────────────────┐
│  buildComposedPageModel(modelResult, sourcePage)      │  ← NEW SEAM
│  lib/learner-renderer-vnext/compose-page-model.js     │
└───────────────────────────────────────────────────────┘
        ↓
renderPage(model, composedView)       ← presentation switch
   OR
renderComposedPage(composedModel)     ← parallel render path during migration
```

**Earliest safe point:** immediately **after** `buildPageModel` returns a validated `LearnerPageModel` (`modelResult.ok === true`), **before** any HTML rendering.

**Wiring location:** `lib/learner-renderer-vnext/render-learner-page.js` — extend `renderLearnerPageHtml` to call the composition pass and pass the result to the renderer.

### Why this point

| Criterion | Satisfied how |
| --------- | ------------- |
| PRISM remains authoritative | Composition reads `LearnerPageModel` + selective `sourcePage.learning_sequence` fields; no mutation of source JSON |
| No persisted schema changes | Composed model is render-time projection only |
| Centralised rules | Single pure module (`compose-page-model.js` + `compose-activity-moments.js`) |
| Multi-field moments | Can gather preamble, prompts, page-context fields, and beat items across beats |
| Preserve activity/beat ordering | Composition **groups** assigned content; does not reorder beats or reassign materials |
| Reuse render components | Moment renderer delegates to existing `renderMaterial`, `renderInstruction`, etc. |
| Incremental migration | Feature flag selects beat-render vs moment-render per activity |

### Why not other points

| Alternative | Rejection reason |
| ----------- | ---------------- |
| Inside `render-activity.js` / `render-beat.js` | Rules scatter across modules; cannot compose across beats or page boundaries; every render tweak becomes composition logic |
| Inside `buildPageModel` | Mixes Sprint 67 assignment contract with Sprint 68 presentation; complicates validation and regression tests |
| Before `buildPageModel` | Materials, task steps, and beat ownership not yet resolved |
| Inside `app.js` export shell | Too late — beat structure already baked into HTML; shell only handles header/nav |
| Upstream pipeline | Violates "renderer composes" principle; would duplicate presentation concerns in Design Page |

### Page-context inputs at the seam

The composition pass needs **`sourcePage`** alongside **`modelResult.model`** for fields not yet on `LearnerPageModel`:

- `learning_sequence.study_flow` → study phase per activity
- `learning_sequence.timeline` → activity purpose
- Successor activity `activity_preamble` → Transition at activity boundary
- `learning_sequence.navigation_guidance.progression_logic` → already on model; also usable for Transition

Longer term, `buildPageModel` may expose a `sequenceContext` slice on the model. For Sprint 68, the composition adapter may read `sourcePage` directly — this is acceptable because it reads authoritative data, not inventing content.

---

## 4. Proposed renderer view model

Minimal **renderer-owned, non-persisted** shape. Names are illustrative; not a production schema commit.

### Top level

```js
/**
 * @typedef {Object} ComposedLearnerPageModel
 * @property {string} title
 * @property {ComposedPageContext} pageContext
 * @property {ComposedOrientationRegion} orientation      // existing page orient region (unchanged initially)
 * @property {ComposedActivity[]} activities
 * @property {ComposedAssessmentRegion} assessment
 * @property {string} studyTips
 * @property {LearnerPageModel} sourceModel                 // traceability back to Sprint 67 model
 */

/**
 * @typedef {Object} ComposedPageContext
 * @property {string} progressionLogic
 * @property {LearningOutcome[]} learningOutcomes
 */
```

### Activity

```js
/**
 * @typedef {Object} ComposedActivity
 * @property {string} id
 * @property {string} title
 * @property {number|null} durationMinutes
 * @property {string} grouping
 * @property {string[]} mappedOutcomeIds
 * @property {ComposedActivityContext} context
 * @property {CompositionMoment[]} moments              // ordered: orient → … → transition
 * @property {LearnerBeat[]} sourceBeats                 // preserved for traceability / migration
 */

/**
 * @typedef {Object} ComposedActivityContext
 * @property {string} studyPhase                        // from learning_sequence.study_flow
 * @property {string} activityPurpose                   // from learning_sequence.timeline
 */
```

### Composition moment

```js
/**
 * @typedef {"orient"|"learn"|"do"|"check"|"reflect"|"transition"} CompositionMomentKind
 */

/**
 * @typedef {Object} CompositionMoment
 * @property {CompositionMomentKind} kind
 * @property {CompositionItem[]} items                  // ordered within moment
 * @property {WorkspaceRequirement|null} workspace
 */

/**
 * @typedef {Object} CompositionItem
 * @property {"pageContext"|"instruction"|"prompt"|"material"|"expectedOutput"} kind
 * @property {SourceRef} sourceRef                        // authoritative trace
 * @property {string=} text                               // for instructions/prompts/context (verbatim)
 * @property {LearnerMaterial=} material                  // reference into source model
 * @property {ExpectedOutputModel=} expectedOutput
 * @property {string=} pageContextField                   // e.g. "studyPhase", "activityPurpose"
 */

/**
 * @typedef {Object} SourceRef
 * @property {string} activityId
 * @property {string=} sourceField                        // PRISM field name when applicable
 * @property {number=} sourceStepNumber
 * @property {string=} materialId
 * @property {string=} beatFunction                        // episode plan beat (traceability)
 * @property {string=} sourcePath                          // JSON pointer for debugging
 */
```

### Workspace and transition

```js
/**
 * @typedef {Object} WorkspaceRequirement
 * @property {"inline"|"external"} mode
 * @property {string} instruction                         // verbatim from learner task
 * @property {number} sourceStepNumber
 * @property {string=} hint                               // e.g. "Write in your notes"
 */

/**
 * @typedef {Object} ComposedTransition
 * @property {CompositionItem[]} items
 * @property {string=} successorActivityId
 * @property {string[]} sourceFields                       // e.g. intellectual_coherence_bridge, successor preamble
 */
```

### Assessment (unchanged initially)

```js
/**
 * @typedef {Object} ComposedAssessmentRegion
 * @property {Object[]} items                             // passthrough from LearnerPageModel.assessment
 * @property {VisualAffordanceHook|null} hook
 */
```

Assessment remains outside activity moment composition in the first slice. Formative items are already page-scoped.

---

### A1 projection (reference)

Mapping from [Sprint 68 - Learner Composition Model.md](Sprint%2068%20-%20Learner%20Composition%20Model.md):

| Moment | CompositionItem sources |
| ------ | ----------------------- |
| **Orient** | `pageContext.studyPhase`, `pageContext.activityPurpose`, `activity_preamble`, `reasoning_orientation`, `self_explanation_prompt`, mapped LO1 |
| **Learn** | instruction step 1, material `A1-M1` |
| **Do** | instruction step 2 + `A1-M2`; instruction step 5 + `workspace` |
| **Check** | instruction steps 3–4, `A1-M3`, `A1-M4`, `expected_output` |
| **Reflect** | step 4 misconception clause (split from step 4 check portion) |
| **Transition** | `progression_logic`, A2 `timeline.purpose`, A2 `activity_preamble` (page-level; no A1 bridge) |

---

## 5. Migration approach

Adapted to the repository's module + feature-flag architecture.

### Phase 1 — Pure composition adapter (no render change)

**Deliverables:**

- `lib/learner-renderer-vnext/compose-activity-moments.js` — pure functions, A1 rules only
- `lib/learner-renderer-vnext/compose-page-model.js` — orchestrates per-activity composition + page context
- `tests/learner-renderer-vnext-compose-a1.test.js` — asserts moment grouping against Composition Model doc
- Extend `types.js` JSDoc with composed model typedefs

**Exit criteria:** A1 moment array matches design doc; all items carry `SourceRef`; no HTML output yet.

### Phase 2 — Compose one reference activity

Implement `composeActivityMoments(activity, modelResult, sequenceContext)` for A1 heteroscedasticity only; other activities pass through as `{ mode: "beats", sourceBeats }`.

### Phase 3 — Parallel render path behind flag

Extend `render-learner-page.js`:

```js
function renderLearnerPageHtml(sourcePage, options) {
  var modelResult = buildPageModel(sourcePage);
  if (!modelResult.ok) return { html: null, error: ..., modelResult };

  var compositionMode = options && options.compositionMode || "beats"; // "beats" | "moments"

  if (compositionMode === "moments") {
    var composed = buildComposedPageModel(modelResult, sourcePage, { activityIds: ["A1"] });
    return { html: renderComposedPage(composed.model), ... };
  }

  return { html: renderPage(modelResult.model), ... };
}
```

Add `lib/learner-renderer-vnext/render-composed-activity.js` and `render-composed-moment.js` that **delegate** to existing `renderMaterial`, `renderInstruction`, `renderPrompt`, `renderExpectedOutput` — new wrappers only for moment container markup.

Wire flag through `runLearnerRendererVNextExport` / test API when needed (`compositionMode: "moments"`).

### Phase 4 — Compare outputs

- Generate heteroscedasticity export with `compositionMode: "moments"` (A1 composed, A2–A5 beat fallback)
- Side-by-side review artefact in sprint `artefacts/`
- Automated test: composed A1 HTML contains all authoritative text; beat headings for A1 absent; A2–A5 unchanged

### Phase 5 — Extend composition rules

- Generalise moment classification from task-step verb patterns (`Study` → Learn, `Work through`/`Write` → Do, `Compare`/`Complete` → Check)
- Add Transition composer using learning sequence + bridges
- Validate against A5 (has `intellectual_coherence_bridge`) and A2 (analysis table)

### Phase 6 — Migrate remaining activities

Enable `compositionMode: "moments"` for all activities when rules pass fixture tests.

### Phase 7 — Remove obsolete serialisation

- Deprecate beat-heading-first presentation for composed activities
- Retain `LearnerPageModel` and beat assignment permanently (assignment ≠ presentation)
- Remove dual render path only after golden + field-coverage + coherence tests green

---

## 6. Risks and constraints

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| **Dual render paths during migration** | Duplicated logic, drift | Shared leaf renderers (`renderMaterial`, etc.); composed path only adds moment wrappers |
| **Breaking Sprint 67 regression suite** | 150+ tests assert beat structure | Default `compositionMode: "beats"`; composed tests separate until parity |
| **Source traceability loss** | Cannot audit composed output against JSON | Mandatory `SourceRef` on every `CompositionItem`; tests assert coverage |
| **Missing optional semantics** | Empty moments (e.g. no bridge on A1) | Moments omitted when empty; Transition falls back to page-level sequence fields only — never invented copy |
| **Accidental content invention** | Violates pipeline/renderer boundary | Composition adapter reads verbatim strings only; no string synthesis; workspace hints are presentation labels, not pedagogical content |
| **Mixing with upstream composition validation** | Name collision with `applyPageCompositionValidationForUtilitiesPage` | Document distinction: upstream = closure validation; Sprint 68 = learner moment composition |
| **Reading `sourcePage` in composition pass** | Coupling to JSON shape | Acceptable at seam; optional future `sequenceContext` on model reduces coupling |
| **Performance** | Extra pass over model | Negligible — pure in-memory transform on small page graphs; no I/O |
| **Browser bundle size** | New modules in UMD bundle | Rebuild via `scripts/build-learner-renderer-vnext-browser.js`; monitor bundle delta |
| **Export shell assumptions** | Journey nav collects `<article id="activity-*">` | Composed activities must preserve same article structure and IDs |
| **Visual affordance hooks** | Hooks attached to beat contentSequence items | Composition must propagate or re-derive hook placement when regrouping items |

### Testing implications

- **Unit tests:** pure composition functions with A1 fixture (moment membership, source refs, workspace flag for step 5)
- **Integration tests:** `renderLearnerPageHtml` with `compositionMode: "moments"` — HTML contains authoritative strings, omits A1 beat headings
- **Regression:** existing golden tests remain on default beat mode until Phase 7
- **Traceability tests:** every composition item maps to exactly one authoritative source field/step/material

---

## 7. Recommendation

### Proposed module location

| Module | Responsibility |
| ------ | -------------- |
| **`lib/learner-renderer-vnext/compose-page-model.js`** | Orchestrator: page context + per-activity moment composition |
| **`lib/learner-renderer-vnext/compose-activity-moments.js`** | Activity-level rules: classify items into Orient/Learn/Do/Check/Reflect/Transition |
| **`lib/learner-renderer-vnext/compose-rules.js`** | Shared classifiers (task-step verbs, material placement overrides) |
| **`lib/learner-renderer-vnext/render-composed-page.js`** | Page render entry for composed model (Phase 3+) |
| **`lib/learner-renderer-vnext/render-composed-activity.js`** | Activity render via moments (Phase 3+) |

### Function boundary

```js
// compose-page-model.js
/**
 * Build a render-time composed view from a validated LearnerPageModel.
 * Does not mutate sourcePage or modelResult.model.
 *
 * @param {import("./types").LearnerPageModelResult} modelResult
 * @param {Object} sourcePage
 * @param {{ activityIds?: string[] }} options  // undefined = all activities
 * @returns {{ ok: boolean, composed: ComposedLearnerPageModel|null, errors: [], warnings: [] }}
 */
function buildComposedPageModel(modelResult, sourcePage, options) { ... }

// render-learner-page.js (extended)
function renderLearnerPageHtml(sourcePage, options) {
  // buildPageModel → buildComposedPageModel (optional) → renderComposedPage | renderPage
}
```

Export from `index.js`:

```js
buildComposedPageModel: require("./compose-page-model").buildComposedPageModel
```

### First production implementation task

**S68-IMP-001 — Pure A1 composition adapter**

1. Create `compose-activity-moments.js` implementing A1 rules from the Composition Model document
2. Create `compose-page-model.js` reading `learning_sequence.study_flow` and `timeline` for A1 context
3. Add `tests/learner-renderer-vnext-compose-a1.test.js`
4. No render changes in this task

### Smallest vertical slice proving architecture

**Orient moment for Activity 1 only** (single moment, end-to-end):

1. `composeActivityMoments` produces one **Orient** moment containing: study phase, activity purpose, preamble, reasoning orientation, self-explanation prompt (all with `SourceRef`)
2. `renderComposedActivity` renders Orient as one `<section data-composition-moment="orient">` using existing prompt/material render helpers
3. Remainder of A1 continues through existing `renderBeat` path (hybrid activity render)
4. Flag: `compositionMode: "moments"`, `composedMoments: ["orient"]` scoped to A1
5. Verify in heteroscedasticity export: one coherent introduction block; authoritative text preserved; beat assignment tests still pass

This slice validates:

- Seam placement (post-`buildPageModel`, pre-HTML)
- Page-context fields reachable from `sourcePage`
- Multi-field semantic composition
- Incremental migration without full rewrite
- Alignment with A1 worked composition **Orient** section

**Success signal:** A learner opening Activity 1 sees one instructional entry conversation instead of preamble block + "Reflect" beat heading + labelled self-explanation — with zero authored content changes.

---

## Document control

| Version | Date | Change |
| ------- | ---- | ------ |
| 1.0 | 2026-07-21 | Initial architecture seam analysis |
