# Sprint 55 — Completed / Current State

**Sprint:** 55 — Educational Product Experience  
**Updated:** 2026-06-29  
**Status:** Structural rendering milestone **complete** — presentation quality is now the primary focus  
**Companion docs:** [CONTEXT-PACK](SPRINT-55-CONTEXT-PACK.md) · [PRODUCT-BACKLOG](SPRINT-55-PRODUCT-BACKLOG.md) · [DESIGN-PRINCIPLES](SPRINT-55-DESIGN-PRINCIPLES.md)

---

## Canonical learner-facing structure

Activities remain the **main learner-visible unit**.

The operational instructional hierarchy is now:

```
Journey
  → Activity
      → Beat
          → Material
```

**Episode plans are operational instructional structure**, not passive metadata.

When `activity.episode_plan.beats` is present on a page activity row, the renderer treats it as the **authoritative source of learner progression and render order**.

---

## Architecture transition

### Previous implicit model (replaced)

```
Activity
  → Materials
      → inferred progression
```

Material key order, role-precedence heuristics, and text-based beat inference drove what the learner saw **inside** an activity. Progression was **inferred** after the fact.

### Current explicit model (operational)

```
Activity
  → Episode Plan Beats
      → Registry-assigned Materials
```

| Layer | Responsibility |
| ----- | -------------- |
| **Episode plan** | Defines beat sequence (`beats[].function`) per activity |
| **Material–beat registry** | Maps each material type to exactly one learning function / renderer beat |
| **Renderer** | Renders beat sections in episode-plan order; materials inside their owning beat |

**Material order no longer determines instructional progression.**

---

## Completed — structural rendering (2026-06-29)

| # | Milestone | State |
| - | --------- | ----- |
| 1 | **Beat-first rendering implemented** | When `activity.episode_plan.beats` exists, materials render inside beat sections — not material-first stacks |
| 2 | **Episode plans drive learner progression** | `activity.episode_plan.beats` is the render-order source; beats reflect instructional choreography from upstream episode plans |
| 3 | **Material–beat registry is source of truth** | `lib/beat-material-registry.js` — `MATERIAL_BEAT_REGISTRY`, `resolveBeatMaterials()`, `resolveBeatMaterialPlan()` |
| 4 | **Beat sections render in episode-plan order** | Learner sees beats in the order declared on the episode plan |
| 5 | **Empty beats are skipped** | Beats with no assigned materials produce no learner-visible section |
| 6 | **Existing material renderers preserved** | Per-type render paths (checklist, scenario, table, template, icons, salience) unchanged — only **grouping and order** changed |
| 7 | **Temporary fallback for unassigned materials** | Materials not resolved to a beat still render via the legacy key-iteration path at the end of the activity materials stack |
| 8 | **Beat diagnostics available** | `buildBeatRenderDiagnostic(activity)`; logged at render time as `[PRISM beat-render]`; exposed on `prismTestApi` for tests |
| 9 | **Relevant tests passing** | See [Test anchors](#test-anchors) below |
| 10 | **Typography foundation pass** | Editorial reading measure (`68ch`), spacing scale, de-carded activities, subdued material chrome — `getUtilityPagePresentationCssSprint55Typography()` |

---

## Typography foundation (2026-06-29)

Presentation-only CSS layer — **does not change** beat-first architecture or registry behaviour.

| Decision | Value |
| -------- | ----- |
| Reading measure | `max-width: 68ch` on body |
| Spacing scale | `--space-1` … `--space-5` |
| Activity treatment | Document sections (no card border/shadow/background) |
| Visible hierarchy | Lesson title → activity heading → beat heading |
| Material headings | Lead-in weight (`.95rem`, no uppercase) |
| Instructional blocks | Transparent background, subtle left rule only |

Tests: `tests/sprint-55-typography-foundation.test.js`

---

## Learner-facing beat labels

Episode **function** slugs map to learner-visible headings via `EPISODE_FUNCTION_LABELS` in the registry.

| Episode function (internal) | Learner-facing label |
| --------------------------- | -------------------- |
| `explanation` | Explanation |
| `worked_thinking` | Worked Thinking |
| `guided_practice` | Practice |
| `transfer` | Transfer |
| `verification` | Check Your Thinking |

Internal labels such as “Beat 1”, “Beat 2”, or raw function slugs are **not** exposed to learners.

---

## Material-to-beat principle

**One material type maps to exactly one learning function / beat** (exclusive registry row).

Assignment uses registry `episodeFunctions` where declared; renderer-beat fallback applies only when no explicit function list exists. Conflicting resolutions fail validation (`validatePageBeatMaterialClosure`).

### Example mappings (registry)

| Material type | Episode function / beat |
| ------------- | ----------------------- |
| `text` | `explanation` |
| `worked_example` | `worked_thinking` |
| `sample_output` | `worked_thinking` |
| `scenario` | `guided_practice` |
| `decision_table` | `guided_practice` |
| `template` | `guided_practice` |
| `transfer_prompt` | `transfer` |
| `consolidation_summary` | `transfer` |
| `checklist` | `verification` |

Additional types (e.g. `reference_table`, `analysis_table`, `modelling_note`) are defined in `MATERIAL_BEAT_REGISTRY` — extend the registry only; do not add parallel hard-coded mappings in the renderer.

---

## Example learner experience (Marx self-study)

**Activity 1** (with episode plan on the activity row):

```
Explanation
    text

Worked Thinking
    worked_example
    sample_output

Check Your Thinking
    checklist
```

**Activity 5**:

```
Explanation
    reference_table

Worked Thinking
    worked_example

Practice
    decision_table
    template

Transfer
    transfer_prompt
    consolidation_summary

Check Your Thinking
    checklist
```

Fixture: `tests/fixtures/page-render/marx-beat-render-page.json`  
Acceptance tests: `tests/beat-first-activity-render.test.js`

---

## Implementation surfaces

| Concern | Location |
| ------- | -------- |
| Registry + resolver | `lib/beat-material-registry.js` |
| Beat-first render path | `app.js` — `renderMaterialsForActivity()` inside `renderLearningActivitiesBlocks()` |
| Instructional-grammar path | `renderInstructionalManifestationActivityCard()` — beat-ordered materials when episode plan present |
| Page composition validation | `validatePageBeatMaterialClosureFromLib()` wired in `applyPageCompositionValidationForCapturedPage()` |
| Beat section markup | `<section class="util-beat-section" data-episode-function="…">` |
| Styles | `.util-beat-section`, `.util-beat-heading`, `.util-beat-ordered-materials` in utility export CSS |

---

## Diagnostic shape (temporary)

```json
{
  "activity": "A1",
  "beats": [
    { "beat": "explanation", "materials": ["text"] },
    { "beat": "worked_thinking", "materials": ["worked_example", "sample_output"] },
    { "beat": "verification", "materials": ["checklist"] }
  ]
}
```

---

## Test anchors

```bash
node --test tests/beat-first-activity-render.test.js
node --test tests/beat-material-registry.test.js
node --test tests/sprint-55-typography-foundation.test.js
node --test tests/utility-pedagogical-icons.test.js
```

Retain Sprint 50/51 regression suites from [CONTEXT-PACK § J.2](SPRINT-55-CONTEXT-PACK.md#j2-regression-anchors).

---

## Remaining Sprint 55 focus

Architectural discovery for **activity-internal progression** is **complete**.

Sprint 55 effort should now shift to **renderer presentation quality** on top of the explicit Journey → Activity → Beat → Material structure.

### Presentation priorities

| Area | Intent |
| ---- | ------ |
| **Typography** | Readable prose scale; consistent body text |
| **Heading hierarchy** | Activity → beat → material headings must read as one clear ladder |
| **Line length** | Comfortable measure for exposition and tasks |
| **Line height** | Breathing room without vertical sprawl |
| **Spacing rhythm** | Predictable gaps between beats and materials |
| **Table typography** | Worksheets and decision tables scannable, not cramped |
| **Beat typography** | Beat headings distinct but not shouting |
| **Activity typography** | Activity title and metadata anchor the beat sequence |
| **Visual hierarchy** | One primary focal path per beat |
| **Reduction of visual clutter** | Less “visual soup” — fewer competing headings, icons, and boxes |

### Guiding principle

> **Beat heading survives. Everything else must justify itself.**

The beat heading is the learner’s orienting anchor for instructional progression. Secondary headings, material-type labels, icons, callout chrome, and wrapper boxes should be **justified** by clarity — not inherited by default from the pre-beat-first renderer.

### Current visual assessment

The exported HTML is **structurally correct** but still **visually noisy**.

Beat-first rendering made the underlying instructional structure **explicit**; the next work should **simplify the presentation layer** now that progression is no longer inferred from material order.

---

## PEL / educational enhancements — working hypothesis

**Do not redesign PEL in this sprint.**

Treat enhancement placement as a **support layer** separate from the progression taxonomy:

| Layer | Structure |
| ----- | --------- |
| **Progression layer** | Activity → Beat → Material |
| **Support layer** | Pre-Activity Support · Post-Activity Support · Pre-Beat Support · Post-Beat Support |

Future work should investigate where existing PEL / educational enhancement elements (orientation, preamble, self-explanation prompts, support notes, salience callouts, compass signals) **naturally attach** within the support layer — **without** forcing them into the beat taxonomy or duplicating beat headings.

---

## What not to re-open

| Closed for Sprint 55 structural work |
| ------------------------------------ |
| “Should materials drive order?” — **No**; episode plan beats do |
| “Do we need a registry?” — **Yes**; implemented and wired |
| “Are episode plans metadata only?” — **No**; operational on export when present on activity rows |

Product-layer P1 items (journey navigator, TOC, progress chrome) remain **open** — see [PRODUCT-BACKLOG](SPRINT-55-PRODUCT-BACKLOG.md).

---

*Sprint 55 current state — structural rendering milestone — 2026-06-29.*
