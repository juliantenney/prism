# Sprint 51 — Pedagogic Salience Fix Implementation Report

**Status:** Complete (renderer-only)  
**Design:** [SPRINT-51-PEDAGOGIC-SALIENCE-FIX-DESIGN.md](./SPRINT-51-PEDAGOGIC-SALIENCE-FIX-DESIGN.md)

---

## Summary

Sprint 51 pedagogic sections (`What experts notice`, `Why this works`, `Common mistakes`, `If any check is not met`) now render as distinct learner-facing callouts inside existing Sprint 50 instructional grammar buckets. Verification checklist items remain checkbox-style; diagnostic mistakes and revision guidance no longer flatten into ordinary headings or tick-box rows.

---

## Files changed

| File | Change |
| ---- | ------ |
| `lib/ld-pedagogic-salience-render.js` | **New** — heading allowlist, `splitChecklistPedagogicSections()`, `wrapPedagogicSalienceSectionsInHtml()` |
| `app.js` | Salience lib resolver; checklist pre-split in `renderMaterialValue()`; `utilityApplyPedagogicSalienceHtml()` + `utilityTagMaterialBlockHtml()` hook; checklist heading-strip guard; `getUtilityPagePresentationCssV31_12()` |
| `index.html` | Script tag for salience lib |
| `tests/prism-vm-lib-bootstrap.js` | Load salience lib in VM tests |
| `tests/sprint-51-pedagogic-salience-render.test.js` | **New** — unit + integration coverage |

**Not changed:** GAM prompts, DLA prompts, schemas, compose logic, material preservation, workflow stages, `ld-instructional-manifestation-render.js`.

---

## Implementation approach

### 1. Salience lib (`ld-pedagogic-salience-render.js`)

- **Canonical headings** matched case-insensitively with optional trailing colon.
- **`splitChecklistPedagogicSections(markdown)`** — splits verification preamble/items from `## Common mistakes` and `### If any check is not met:` before checkbox conversion.
- **`wrapPedagogicSalienceSectionsInHtml(html)`** — replaces recognised `util-card-subheading` blocks with `<aside class="util-pedagogic-callout …">` wrappers, micro-label, and cue line.

| Section | Callout class | Cue |
| ------- | ------------- | --- |
| What experts notice | `util-pedagogic-callout--expert-insight` | How experts think |
| Why this works | `util-pedagogic-callout--quality-commentary` | Why the model is strong |
| Common mistakes | `util-pedagogic-callout--diagnostic` | Weaknesses to avoid |
| If any check is not met | `util-pedagogic-callout--revision` | How to improve |

### 2. Renderer hooks (`app.js`)

- **Checklist strings:** split → render verification with `materialHint: "checklist"` inside `util-checklist-block` → render diagnostic/revision without checklist hint → apply salience wrap.
- **Worked example / sample output:** `utilityTagMaterialBlockHtml()` applies salience wrap after existing role wrappers.
- **Heading-strip guard:** generic “Checklist” redundant-heading removal skips HTML that already contains pedagogic callouts.
- **CSS V31_12:** restrained callout variants reusing cognition/guidance palette; diagnostic bullets styled via `.util-pedagogic-callout--diagnostic ul:not(.util-checkbox-list)`.

### 3. Sprint 50 grammar preservation

Callouts are injected **inside** existing `util-instructional-study` and `util-instructional-check` material bodies. No new top-level instructional sections were added.

---

## Before / after examples

### What experts notice (worked example, Study)

**Before:** plain `<h4 class="util-card-subheading">` inside model panel.

**After:**

```html
<aside class="util-pedagogic-callout util-pedagogic-callout--expert-insight util-material-role-guidance" role="note" data-pedagogic-salience="expert-insight">
  <p class="util-pedagogic-callout__label">What experts notice</p>
  <p class="util-pedagogic-callout__cue">How experts think</p>
  <ul><li>Strong analysis names the transmission mechanism…</li></ul>
</aside>
```

### Common mistakes (checklist, Check)

**Before:** mistake bullets inside `util-checkbox-list` with ☐ markers.

**After:**

```html
<div class="util-checklist-block util-material-role-checklist">
  <ul class="util-checkbox-list">…verification items only…</ul>
</div>
<aside class="util-pedagogic-callout util-pedagogic-callout--diagnostic …">
  <p class="util-pedagogic-callout__label">Common mistakes</p>
  <p class="util-pedagogic-callout__cue">Weaknesses to avoid</p>
  <ul><li>Label-only classification with no mechanism.</li></ul>
</aside>
```

---

## Test results

```
node --test \
  tests/sprint-51-pedagogic-salience-render.test.js \
  tests/sprint-50-phase-2-renderer-instructional-grammar.test.js \
  tests/sprint-51-annotated-models-generation.test.js \
  tests/sprint-51-evaluative-coaching-generation.test.js \
  tests/sprint-51-gam-material-preservation.test.js
```

**38 / 38 passed**

Salience suite verifies:

- Expert-insight, quality-commentary, diagnostic, and revision callouts with cues
- Common mistakes bullets are plain `<ul><li>` (not checkbox items)
- Verification items still use `util-checkbox-list`
- Sprint 50 grammar order (Study → Do → Check) unchanged
- Sprint 51 annotated-model and evaluative-coaching generation regressions green
- GAM material preservation regressions green

---

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Heading vocabulary drift | Exact Sprint 51 allowlist; case-insensitive match |
| False-positive wrap | Only four canonical titles; skip if callout already present |
| Checklist without coaching sections | Split no-ops; verification-only behaviour unchanged |
| Visual clutter | Four callout types; muted borders; no extra icons |
| Weak/strong judgement sections | Deferred (out of smallest slice) |

---

## Governance compliance

| Constraint | Status |
| ---------- | ------ |
| Renderer-only | ✓ No generation, compose, schema, or workflow changes |
| Sprint 50 grammar order | ✓ Regression tests green |
| Verification checkboxes preserved | ✓ |
| Diagnostic/revision not checkboxes | ✓ |
| Quiet salience (existing visual language) | ✓ Cognition/guidance patterns reused |

---

## Recommended next step

**Phase 2 (optional):** extend salience vocabulary for `## A weaker response would` / `## A stronger response would` comparative judgement callouts, and evaluate `prompt_set` self-check salience if Layer 2 evaluative coaching needs distinct rendering.

---

## Success criterion

A learner scanning the rendered page can immediately distinguish model content, expert judgement, quality commentary, diagnostic mistakes, and revision guidance without inferring function from surrounding prose alone.
