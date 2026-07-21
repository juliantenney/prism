# Sprint 67 — Semantic Iconography Restoration (vNext)

Date: 2026-07-21

## Legacy icon inventory

**Mechanism:** Inline Lucide SVG via `lib/utility-pedagogical-icons.js` (`createRenderer` → `renderIconHtml` / `renderMaterialIconHtml` / `renderSectionIconHtml`).

**Format:** `<svg class="util-lucide-icon util-lucide-icon--{sm|md|lg} util-material-icon …" aria-hidden="true">` — no emoji, no icon font, no remote CDN.

**Legacy placement pattern:** Icon as first flex child inside `.util-icon-heading` or `.util-section-heading`, label in following `<span>`.

| Semantic area | Legacy PEDAGOGICAL_ICONS key | Lucide shape | Visible label retained |
|---------------|------------------------------|--------------|------------------------|
| Overview | OVERVIEW | info | Section title |
| Learning purpose / outcomes | PURPOSE | target | Section title |
| Knowledge summary | REFLECT | lightbulb | Section title |
| Learning activities | ACTIVITIES | puzzle | Section title |
| Assessment | EVALUATE | clipboard-check | Section title |
| Study tips | TIPS | graduation-cap | Section title |
| Explanatory text | READ | book-open | Material title |
| Worked example / sample | EXAMPLE | search | Material title |
| Tables | TABLE | table | Material title |
| Checklist | CHECKLIST | list-checks | Material title |
| Template | TEMPLATE | file-text | Material title |
| Scenario | SCENARIO | map-pin | Material title |
| Prompt set | DISCUSS | messages-square | Material title |
| Instructions / practice | PRACTICE | pencil | Step text |
| Expected output | CHECK | circle-check | "Expected output" |
| Support / modelling note | NOTE | notebook-pen | Label / title |

**Pedagogical guidance (legacy):** Text labels only in activity framing (`util-framing-label`, `util-guidance-label`) — no dedicated guidance-field icons in legacy HTML. vNext adds icons mapped by `data-guidance-type` / prompt field name for parity with material/section treatment.

**Journey navigation:** Legacy uses text links only (`util-journey-link-text`) — no nav icons. **Decision: no navigation icons added.**

**Accessibility (legacy):** SVG icons `aria-hidden="true"`; visible text carries meaning.

## vNext implementation

### Central registry

`lib/learner-renderer-vnext/learner-icon-registry.js` — typed semantic keys → PEDAGOGICAL_ICONS keys.

Examples:
- `section.overview` → OVERVIEW
- `material.worked_example` → EXAMPLE
- `guidance.self_explanation` → REFLECT
- `learner.instruction` → PRACTICE
- `assessment.question` → EVALUATE

### Renderer

`lib/learner-renderer-vnext/learner-icon-renderer.js` — wraps legacy `utility-pedagogical-icons.createRenderer`.

### HTML pattern

```html
<h2 class="util-section-heading util-icon-heading">
  <span class="util-semantic-icon" aria-hidden="true"><svg class="util-lucide-icon …">…</svg></span>
  <span class="util-semantic-icon__label">Learning outcomes</span>
</h2>
```

Same pattern for material headings, guidance labels, beat headings, instructions, assessment.

### CSS

Included in standalone export via `getLearnerIconPresentationCss()` appended to `getUtilityVnextProseMeasureCss()` in `app.js`. Reuses legacy `.util-lucide-icon` rules plus vNext `.util-semantic-icon` alignment.

### Intentional additions (not in legacy)

| Element | Icon | Rationale |
|---------|------|-----------|
| Beat headings (`learner.reflect`, etc.) | Role-mapped Lucide | Helps scan beat purpose in vNext beat-stream layout |
| Pedagogical guidance labels | Field-mapped Lucide | Consistent with section/material iconography |
| Activity preamble | NOTE | Supports activity framing scan |
| Mapped outcomes | PURPOSE | Lightweight LO association cue |

Legacy renderer output unchanged (`util-semantic-icon` is vNext-only).

## Visual-affordance regression

- Hook count unchanged: **13** on heteroscedasticity fixture
- `.util-visual-affordance` hooks remain `hidden` + `aria-hidden="true"`
- No icons inside affordance placeholders
- VEU selector contract unchanged

## Tests

`tests/learner-renderer-vnext-icons.test.js` (11 tests) + updated golden/html/VA tests.

**Full vNext suite:** 114/114 pass.

## Fresh export

`docs/development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/artefacts/heteroscedasticity-vnext-icons-export.html`

## Manual review checklist (heteroscedasticity)

| Region | Icons present | Labels readable | Notes |
|--------|---------------|-----------------|-------|
| Orientation sections | Yes | Yes | info/target/lightbulb per section type |
| Learning outcomes | Yes | Yes | target icon |
| Progression guidance | Yes | Yes | target icon |
| Activity reasoning orientation | Yes | Yes | lightbulb + "How to think" |
| Beat headings | Yes | Yes | Role icons (reflect, check, etc.) |
| Instructions | Yes | Yes | pencil icon before step text |
| Materials (text, worked example, tables, checklist) | Yes | Yes | Type-mapped icons in `h4` |
| Expected output | Yes | Yes | circle-check |
| Assessment | Yes | Yes | clipboard-check section + question icons |
| Study tips | Yes | Yes | graduation-cap |
| Visual affordance hooks | N/A (hidden) | — | Not visible; unchanged |

## Files modified

**New:** `learner-icon-registry.js`, `learner-icon-renderer.js`, `tests/learner-renderer-vnext-icons.test.js`, this audit.

**Modified:** `render-page.js`, `render-activity.js`, `render-beat.js`, `render-material.js`, `index.js`, `browser-entry.js`, `app.js`, `scripts/build-learner-renderer-vnext-browser.js`, `tests/prism-vm-lib-bootstrap.js`, golden/html/VA tests, `learner-renderer-vnext-browser.js` (rebuilt).

## Unmapped semantic types

Unknown registry keys return no icon (safe fallback). `guidance.generic` used for unlisted prompt fields.
