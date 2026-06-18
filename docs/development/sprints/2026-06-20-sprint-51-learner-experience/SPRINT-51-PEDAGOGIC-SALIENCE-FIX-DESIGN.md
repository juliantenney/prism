# Sprint 51 — Pedagogic Salience Manifestation Fix (Design)

**Mode:** Design only — renderer enhancement, no generation/compose changes  
**Problem:** Sprint 51 content is generated and preserved in `materials.*` bodies, but the renderer treats expert commentary, diagnostic warnings, and revision coaching as generic markdown subsections or checklist items.  
**Constraint:** Renderer-only; preserve Sprint 50 instructional grammar; minimal implementation; reuse existing visual language.

---

# Current Rendering

## Pipeline

```
page.json materials.* (markdown)
  → renderMaterialsForActivity() / renderPlainStructuredText()
  → utilityTagMaterialBlockHtml() (role wrappers)
  → Sprint 50 instructional grammar sections (Study / Do / Check)
  → exported HTML + presentation CSS
```

Sprint 51 sections are **already present in markdown** after GAM preservation. The manifestation gap is **HTML structure and CSS salience**, not content availability.

## How each Sprint 51 section renders today

| Section | Typical material | Grammar bucket | Current HTML | Learner perception |
| ------- | ---------------- | -------------- | ------------ | ------------------ |
| Model steps / exemplar | `worked_example`, `sample_output` | **Read and model** (`util-instructional-study`) | Wrapped in `util-worked-example util-material-role-model` (left border, pale background) | Model is slightly distinct; steps and commentary look the same |
| `## What experts notice` | Inside `worked_example` | Study | Plain `<h4 class="util-card-subheading">` + `<ul>` inside worked-example block | Looks like another subsection of the model — not “expert lens” |
| `## Why this works` | Inside `sample_output` | Study or Check | Plain `<h4>` + bullet list inside generic material prose | Looks like part of the sample answer — not quality commentary |
| `Have you / Did you` checks | `checklist` | **Check your work** (`util-instructional-check`) | `util-checklist-block` + `util-checkbox-list` with ☐ markers | Correct function — verification checklist |
| `## Common mistakes` | Inside `checklist` | Check | Often **same checkbox path** as verification items (`checklistRowFromPlainLine` → `renderCheckboxList`) when `materialHint === "checklist"` | Misread as “things to tick off” — not diagnostic warnings |
| `### If any check is not met:` | Inside `checklist` | Check | Plain subheading + paragraph | Looks like footer prose — not actionable revision coaching |

## Root manifestation behaviours

1. **Flat heading treatment** — `##` / `###` in materials become `util-card-subheading` (`h4`/`h5`) with no role-specific wrapper.
2. **Checklist hint over-application** — `renderPlainStructuredText()` with `materialHint: "checklist"` converts **all** bullet/`•` lines in a block to checkbox rows, including diagnostic mistake bullets under `## Common mistakes`.
3. **No post-render section classifier** — Unlike `util-support-note` (Watch for this mistake) and `util-cognition` (Think blocks), Sprint 51 commentary has no dedicated callout wrapper or label.
4. **Existing role CSS is material-type scoped** — `util-material-role-model` styles the **whole** worked example, not the expert-insight subsection within it.

## Existing visual language (reuse candidates)

| Pattern | Classes | Current use | Salience |
| ------- | ------- | ----------- | -------- |
| Guidance aside | `util-support-note util-material-role-guidance` | `support_note` — Watch for this mistake | Muted, left border, uppercase micro-label |
| Thinking block | `util-cognition util-material-role-thinking` + variant (`--explain`, `--revision`, etc.) | Activity-row cognition fields | Coloured left border, role label |
| Model block | `util-worked-example util-material-role-model` | Worked examples | Pale slate panel |
| Verification | `util-checklist-block util-material-role-checklist` + `util-checkbox-list` | Criteria checks | Grey panel + checkboxes |
| Deliverable | `util-output-block util-material-role-deliverable` | `expected_output` in Check | Green accent |

Sprint 42/51 annotated-models design already proposed `util-model-commentary util-material-role-guidance` for model commentary — not yet implemented.

---

# Proposed Manifestation

## Design principle

> **Same grammar, richer semantics inside material HTML.**  
> Do not add new instructional functions or grammar sections. Classify recognised Sprint 51 subsections during/after markdown render and wrap them in role-appropriate callouts.

## Target mapping

| Sprint 51 section | Pedagogic function | Proposed wrapper | Visual reuse | Learner reads it as |
| ----------------- | ------------------ | ---------------- | ------------ | ------------------- |
| Model body (steps, exemplar) | **Model** | Keep existing `util-worked-example` / material prose | Unchanged | “Here is the example” |
| `## What experts notice` | **Expert judgement** | `<aside class="util-pedagogic-callout util-pedagogic-callout--expert-insight util-material-role-guidance" role="note">` | Cognition `--explain` palette (violet accent) + guidance label pattern | “This is how experts think” |
| `## Why this works` | **Quality commentary** | `<aside class="util-pedagogic-callout util-pedagogic-callout--quality util-material-role-guidance" role="note">` | Model-adjacent slate + guidance label | “This is why the model is strong” |
| `Have you / Did you / Does your` items | **Verification** | Keep `util-checklist-block` + `util-checkbox-list` | Unchanged | “Check your work” |
| `## Common mistakes` | **Diagnostic warning** | `<aside class="util-pedagogic-callout util-pedagogic-callout--diagnostic util-material-role-guidance" role="note">` with **plain bullet list** (`util-diagnostic-list`) — **no checkboxes** | Amber/warning accent (distinct from support-note grey) | “Watch for these weaknesses in your own work” |
| `### If any check is not met:` | **Revision coaching** | `<aside class="util-pedagogic-callout util-pedagogic-callout--revision util-material-role-guidance" role="note">` | Cognition `--revision` palette (indigo accent) | “Here is how to strengthen your draft” |

### Callout label convention

Each aside includes a visible micro-label (matching `util-cognition__label` / `util-support-note-label` pattern):

| Section | Label text |
| ------- | ---------- |
| What experts notice | **What experts notice** |
| Why this works | **Why this works** |
| Common mistakes | **Common mistakes** |
| If any check is not met | **If any check is not met** |

Headings inside markdown are **moved into the label** (not duplicated as `h4` + label).

## Checklist split (critical)

Checklist materials must be **section-split before checkbox conversion**:

```
[verification preamble + Have you items]  → util-checklist-block + checkboxes
## Common mistakes                        → diagnostic callout + plain bullets
### If any check is not met:              → revision callout + prose
```

Implementation approach:

1. **Pre-render split** on canonical headings (`## Common mistakes`, `### If any check is not met:`).
2. Render verification segment with existing checklist path (`materialHint: "checklist"`).
3. Render diagnostic/revision segments through salience wrapper (no `materialHint: "checklist"` — use `materialHint: "diagnostic"` / `"revision"` or post-wrap only).

This prevents mistake bullets from receiving ☐ tokens.

## Worked example / sample output

Post-process rendered HTML inside `util-worked-example` and sample-output blocks:

1. Detect rendered heading nodes matching canonical titles (case-insensitive, punctuation-tolerant).
2. Wrap heading + following sibling content until next recognised heading or Bridge line.
3. Leave model steps and Bridge outside callouts.

Optional Phase 1b: also wrap `## A weaker response would` / `## A stronger response would` in a comparative callout (`util-pedagogic-callout--judgement`) — out of smallest slice unless trivial.

## Sprint 50 grammar preservation

| Rule | Detail |
| ---- | ------ |
| Section order unchanged | Orient → Think → Study → Explain → Do → Check → Reflect → Transfer |
| Buckets unchanged | Commentary stays in Study (models) or Check (checklist) per existing partition |
| Headings unchanged | `util-instructional-heading` section titles remain “Read and model”, “Check your work” |
| No new grammar functions | Callouts are **inside** `util-instructional-study-materials` / `util-instructional-check` bodies |

---

# Files Affected

## Phase 1 — Smallest viable slice

| File | Change |
| ---- | ------ |
| `lib/ld-pedagogic-salience-render.js` | **New** — heading vocabulary, `splitChecklistPedagogicSections(markdown)`, `wrapPedagogicSalienceSectionsInHtml(html)` |
| `app.js` | Hook salience wrap after material markdown render; checklist pre-split branch in `renderPlainStructuredText` / checklist render path |
| `app.js` | Add `getUtilityPagePresentationCssV31_12()` — callout + diagnostic list styles (reuse cognition/support-note tokens) |
| `tests/prism-vm-lib-bootstrap.js` | Load new lib in VM tests |
| `tests/sprint-51-pedagogic-salience-render.test.js` | **New** — wrapper output, checklist split, no checkbox on mistakes |
| `tests/sprint-50-phase-2-renderer-instructional-grammar.test.js` | Regression — grammar order unchanged |

## Not affected

| Layer | Reason |
| ----- | ------ |
| GAM prompts / instructional patterns | Content unchanged |
| `page-gam-materials-preserve.js` | Bodies unchanged |
| `ld-instructional-manifestation-render.js` | Grammar partition unchanged |
| `page.json` schema | No new fields |
| Workflow | No stages |

## Optional Phase 2

| File | Change |
| ---- | ------ |
| `index.html` | Script tag if lib not bundled through existing bootstrap |
| Weak/strong judgement callout | Extend vocabulary in salience lib |

---

# Before / After

## 1. What experts notice (worked example, Study)

### Before

```html
<div class="util-worked-example util-material-role-model">
  <p><strong>Step 1:</strong> …</p>
  <h4 class="util-card-subheading">What experts notice</h4>
  <ul><li>Strong analysis names the transmission mechanism…</li></ul>
  <p><strong>Bridge:</strong> Apply the same sequence…</p>
</div>
```

### After

```html
<div class="util-worked-example util-material-role-model">
  <p><strong>Step 1:</strong> …</p>
  <aside class="util-pedagogic-callout util-pedagogic-callout--expert-insight util-material-role-guidance" role="note">
    <p class="util-pedagogic-callout__label">What experts notice</p>
    <ul><li>Strong analysis names the transmission mechanism…</li></ul>
  </aside>
  <p><strong>Bridge:</strong> Apply the same sequence…</p>
</div>
```

**Learner cue:** Violet-accent aside inside model panel = expert lens, not more model text.

---

## 2. Why this works (sample output, Study/Check)

### Before

```html
<blockquote>…exemplar…</blockquote>
<h4 class="util-card-subheading">Why this works</h4>
<ul><li>Links concepts through a causal mechanism…</li></ul>
```

### After

```html
<blockquote>…exemplar…</blockquote>
<aside class="util-pedagogic-callout util-pedagogic-callout--quality util-material-role-guidance" role="note">
  <p class="util-pedagogic-callout__label">Why this works</p>
  <ul><li>Links concepts through a causal mechanism…</li></ul>
</aside>
```

**Learner cue:** Quality commentary is visually separated from the exemplar product.

---

## 3. Common mistakes (checklist, Check)

### Before

```html
<div class="util-checklist-block util-material-role-checklist">
  <ul class="util-checkbox-list">
    <li><span class="util-checkbox">☐</span><span>Have you linked each price pressure…</span></li>
    …
    <li><span class="util-checkbox">☐</span><span>Label-only classification with no mechanism…</span></li>
  </ul>
</div>
```

### After

```html
<div class="util-checklist-block util-material-role-checklist">
  <ul class="util-checkbox-list">
    <li><span class="util-checkbox">☐</span><span>Have you linked each price pressure…</span></li>
    …
  </ul>
</div>
<aside class="util-pedagogic-callout util-pedagogic-callout--diagnostic util-material-role-guidance" role="note">
  <p class="util-pedagogic-callout__label">Common mistakes</p>
  <ul class="util-diagnostic-list">
    <li>Label-only classification with no mechanism…</li>
  </ul>
</aside>
<aside class="util-pedagogic-callout util-pedagogic-callout--revision util-material-role-guidance" role="note">
  <p class="util-pedagogic-callout__label">If any check is not met</p>
  <p>Revise your report by (1) adding a mechanism sentence…</p>
</aside>
```

**Learner cue:** Checkboxes = self-verification only; amber aside = weaknesses to avoid; indigo aside = how to fix.

---

# Risks

| Risk | Mitigation |
| ---- | ---------- |
| **Heading vocabulary drift** | Match exact Sprint 51 GAM strings (`## What experts notice`, etc.); case-insensitive; test against fixtures |
| **False-positive wrap** | Only wrap when heading text matches allowlist; do not match partial prose |
| **Double wrap on re-render** | Guard: skip if parent already has `util-pedagogic-callout` |
| **Checklist without Common mistakes** | Split logic no-ops; verification-only checklist unchanged |
| **Visual clutter** | Max four callout types; reuse existing border/label patterns; no icons required in MVP |
| **Print layout** | `@media print` — callouts keep border, white background (match existing cognition/support print rules) |
| **Domain content collision** | Rare if heading is exact `## Common mistakes`; allowlist is section-title specific |

---

# Smallest Viable Slice

**Ship in one PR — renderer only:**

1. **`lib/ld-pedagogic-salience-render.js`**
   - Canonical heading allowlist (four Sprint 51 sections)
   - `splitChecklistPedagogicSections(markdown)` → `{ verification, diagnostic, revision }`
   - `wrapPedagogicSalienceSectionsInHtml(html)` → aside wrappers for expert/quality/diagnostic/revision

2. **`app.js` hooks**
   - Checklist string materials: split → render verification with checkboxes → render diagnostic/revision through wrap path
   - After `utilityTagMaterialBlockHtml()` for worked_example / sample_output: apply `wrapPedagogicSalienceSectionsInHtml`

3. **CSS** (`getUtilityPagePresentationCssV31_12`)
   - Four callout variants reusing cognition/support-note spacing
   - `.util-diagnostic-list` — plain bullets, no checkbox styling

4. **Tests**
   - Common mistakes bullets are **not** in `util-checkbox-list`
   - Each callout class present with correct label
   - Sprint 50 grammar section order regression

**Defer:**

- Weak/strong judgement callouts
- `prompt_set` self-check salience (Layer 2 evaluative coaching)
- Renderer changes outside export path

**Estimated diff:** ~200–280 lines (lib + hooks + CSS + tests).

---

## Success criterion

A learner scanning the page can immediately distinguish:

| Visual | Meaning |
| ------ | ------- |
| Model panel (slate) | The example itself |
| Violet expert-insight aside | How experts think about the model |
| Slate quality aside | Why the model is strong |
| Checkbox block | Criteria to verify |
| Amber diagnostic aside | Weak patterns to avoid in own work |
| Indigo revision aside | Concrete steps to improve |

…without reading surrounding prose to infer function.

---

*Design v1 — renderer salience only; no implementation in this document.*
