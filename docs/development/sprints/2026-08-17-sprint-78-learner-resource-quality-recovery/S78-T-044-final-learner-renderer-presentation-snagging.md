# S78-T-044 — Final learner-renderer presentation snagging

**Task:** S78-T-044  
**Status:** **DIAGNOSTIC + AUTHORISED FIX COMPLETE** (2026-08-25)  
**Mode:** Diagnostic + one authorised look-for CSS fix; Orient→A1 separator restored as missing application of existing convention; ordinal / grouping diagnose (+ live regressions where capability works)  
**Sprint 78:** OPEN · **T-013:** remains OPEN  

**Do not:** regenerate Lagrangian content; close T-013; close Sprint 78; expand verifier; implement editable maths; force `Individual` badges on self-study.

---

## 1. Guided-review look-for bullets (A) — AUTHORISED FIX

### Root cause

T-039 correctly changed look-for from `<ol>` to `<ul>`, removing `1. A.` / `2. B.` browser numbering. vNext export CSS still styles **all** `.util-learner-renderer-vnext ul` with `padding-left:1.25rem` and default disc markers, so operators still saw:

- `• A. …`
- `• B. …`

A/B keys in `util-guided-review__feature-key` are the intended enumeration.

### Exact fix

In `getUtilityVnextProseMeasureCss()` (`app.js`):

```css
.util-learner-renderer-vnext .util-guided-review__look-for ul{
  list-style:none;padding-left:0;margin-left:0
}
```

Preserves `<ul>`/`<li>` semantics; scoped to look-for only; ordinary vNext lists keep `padding-left:1.25rem`.

### Regression

`tests/s78-t-044-learner-renderer-presentation-snagging.test.js` — live vNext export asserts:

- look-for CSS `list-style:none`
- A./B. feature keys, `<ul>`, no `<ol>`, no `1. A.` prefixes
- global ul/ol padding rule unchanged

---

## 2. Orient → Activity 1 separator (B) — IMPLEMENTED (mechanically safe)

### Finding

| Layer | Behaviour |
| ----- | --------- |
| DOM | `util-page-orientation` then sibling `util-learning-activities` containing `util-activity` articles (`render-page.js`) |
| A1→An | `.util-learner-renderer-vnext .util-activity+.util-activity` → `border-top` + spacing |
| Orient→A1 | **Missing** in vNext CSS — orientation is outside the activity list, so adjacent-sibling activity rule never fires |
| Legacy generic cleanup | Already had `section.util-learning-activities>.util-activity:first-child{…border-top…}` — **not** included in vNext export CSS (`getUtilityVnextProseMeasureCss` only) |

### Change

Applied the same border/spacing tokens as activity siblings, scoped when orientation precedes activities:

```css
.util-learner-renderer-vnext .util-page-orientation+.util-learning-activities>.util-activity:first-child{
  margin-top:4rem;padding-top:3rem;border-top:1px solid #e5e7eb
}
```

Mirrored in the existing 720px and print media rules that already adjust activity+activity spacing.

**Not** a new visual system — missing application of the existing activity boundary convention.

---

## 3. Activity ordinal in heading (C) — DIAGNOSE ONLY

| Question | Finding |
| -------- | ------- |
| Ordinal in model? | Yes — activity `id` (e.g. A1) and render order index |
| Heading text? | `render-activity.js` uses `<h2 class="util-activity-title">` + `activity.title` only |
| Journey nav? | `utilityBuildVnextJourneyActivityNavItems` uses title; fallback `"Activity N"` **only when title empty**; position shown via journey chrome, not heading prefix |
| Legacy? | `"Activity N"` historically used as **missing-title fallback**, not as a durable `"Activity N: Title"` heading contract |
| a11y | Prefixing every h2 would duplicate journey position labels; titles alone remain distinct landmarks when titles are unique |

**Recommendation: retain current heading** (`Title` only). Do **not** restore `Activity N: Title` — no evidence of unintentional loss during vNext migration; ordinal is already available via nav/DOM ids.

---

## 4. Grouping badges (D) — DIAGNOSE + LIVE REGRESSION

### Canonical path

1. **Owner:** DLA / activity row `grouping` (workshop fixtures: `small_group`, `pair`, `whole_group`).
2. **Assemble:** `page-vnext-assemble` does **not** project LS timeline `grouping` onto activities (intentional — T-037-era test). Activity-owned `grouping` survives merge.
3. **Model:** `build-activity-model.js` → `activity.grouping` string.
4. **Render:** `renderActivityBadges` — if non-empty trim, emit `util-badge-group` with **raw** string (no pretty-label map).

### Self-study

- Empty / absent grouping → **no badge** (acceptable; Individual implicit).
- Fixture `owen-a1` has `grouping: "individual"` → would show raw `individual` if left set. Renderer does **not** specially suppress `individual`.
- Do **not** fabricate Individual for symmetry.

### Workshop

- Capability works when DLA populates grouping: badge appears.
- **Gap:** legacy `prettyGroupingValue` (`small_group` → `Small group`, `pair` → `Pair`, etc.) was **not** ported to vNext — learner sees tokens, not “In pairs” / “Small group”. Recommend a small follow-on to port pretty labels (not done here).

### Regression

Live vNext export proves `small_group` / `pair` / `pairs` badges; empty grouping emits no badge element.

---

## 5. Production changes

| File | Change |
| ---- | ------ |
| `app.js` | Look-for `list-style:none`; Orient→A1 first-activity border (desktop / 720px / print) |
| `tests/s78-t-044-learner-renderer-presentation-snagging.test.js` | New |

---

## 6. Tests / checks

```text
node --test tests/s78-t-044-learner-renderer-presentation-snagging.test.js
→ 5 pass
```

Also re-checked: `tests/s78-t-039-guided-review-feature-list-enumeration.test.js` → 5 pass.

---

## 7. Unresolved risks

- Operators may still want prettier grouping labels (`Small group` / `In pairs`) — separate small fix.
- Missing-list (`Missing A:`) still uses default ul markers — not reported; left unchanged.
- Orient→A1 spacing uses full activity-sibling tokens (4rem/3rem); if operators want lighter separation, that would be a new design tweak.

---

## 8. Sprint state

**Sprint 78:** OPEN  
**T-013:** OPEN  
**T-044:** complete (this record)
