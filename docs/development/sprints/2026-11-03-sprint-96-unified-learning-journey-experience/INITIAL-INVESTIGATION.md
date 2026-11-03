# Sprint 96 — Initial investigation (read-only)

**Date:** 2026-11-03  
**Status:** Complete — informs IMPLEMENTATION-MAP; **no implementation authorised**  
**Baseline:** `c5d93e85cb4bf1457f499ccac76763d75d272dad`  
**Absorbs Sprint 95 debt:** S95-AD-008, S95-AD-011/012, S95-AD-015…020

---

## 1. Layout / navigation findings (→ M1)

### Shell structure

Unified shell (`lib/learning-journey-unified-shell.js`):

- Grid `.lj-shell`: sidebar (~14–18rem) + workspace.
- Sidebar: brand `<h1>`, TOC (`data-lj-nav-id`), sticky foot **Previous resource** / **Next resource**.
- Workspace: sticky `.lj-shell__toolbar` (current title) + single `<main id="lj-shell-main">`.
- Overview is a TOC destination (not a persistent above-resource intro).
- Resource sequential nav (`.util-journey-nav--sequential`) is restored into mounted fragments and must not steal journey hash (`preserveJourneyHash`).

Journey vs resource navigation are **already separated in behaviour**; presentation debt remains.

### Section-nav overlap (S95-AD-015) — likely root cause

1. Dual sticky stack: `.lj-shell__toolbar` (`top:0`, z-index 40) + `.util-journey-nav` (shell override `top:3.75rem`, z-index 35).  
2. **Hard-coded `3.75rem`** does not track real toolbar height (wrap / zoom / large text).  
3. `--learner-sticky-nav-height` is measured from section-nav only; shell scroll-margin adds another hard-coded `3.75rem`; JS `scrollToSection` / index logic may omit toolbar clearance.  
4. Semi-transparent sticky backgrounds let prose “bleed through”.  
5. Revision reminder fixed positioning uses the same sticky token and can collide with shell chrome.

### Previous/Next (S95-AD-016)

- Journey controls: sidebar foot — good semantic separation; can feel cramped; become `position:static` under ≤860px.  
- Resource controls: in-main sequential adjacent links — distinct aria-labels (**Previous/Next section**).  
- Toolbar still duplicates current title while section nav also shows a current section title (chrome density).

### Responsive / zoom (S95-AD-018)

- One shell breakpoint (`max-width:860px`) stacks columns; no drawer/collapse.  
- Learner CSS has additional 700/720/640 breakpoints for sequential nav / gutters.  
- No unified-shell zoom tests or live-measured sticky offsets. Likely failure at 150–200% zoom with wrapped toolbar + fixed `3.75rem`.

### Collapsible TOC (S95-AD-017)

- Not implemented. Needs toggle with `aria-expanded` / `aria-controls`, focus return, Escape, landmark preservation, layout reclaim, and sync with mobile breakpoint. Prefer after sticky tokens are fixed.

### Recommended M1 sequence

1. Measure/fix sticky stack + tokens.  
2. Clarify journey vs resource chrome / prev-next presentation.  
3. Responsive + zoom with measured heights.  
4. Collapsible TOC once tokens stable.

---

## 2. MathLive / MathJax findings (→ M4 blocking)

### Standalone (works offline)

- MathLive: vendored `lib/mathlive/` (0.110.0); head markup + runtime auto-boot; enhance → `math-field`; dispose tears down fields (library stays on `window`).  
- Packaging: `math-entry-package-assets.js` + `learner-package.appendMathLivePackageAssets` — fail closed if missing.  
- MathJax: CDN in preview enhanced to local `lib/mathjax/` at package time; fail closed; typeset via document bootstrap / `typesetPromise`.  
- Evidence: Sprint 82 packaging tests; authoring export fetch hooks in `app.js`.

### Unified shell (gaps)

| Concern | State |
| ------- | ----- |
| ZIP contents | `index.html` + `runtime/learner-renderer-vnext-browser.js` + `media/<commissionId>/…` only |
| Fragment path | `includeRuntimeScripts: false`; `extractRendererFragmentFromHtml` strips scripts; head MathJax lost |
| Mount | `installMathEntryRuntime(root)` runs — but without `window.MathLive` → **always fallback** |
| MathJax | No bootstrap; no remount `typesetPromise` → raw delimiters |
| Path rewrite | Only `assets/` → `media/<id>/`; even if maths files were copied under media, `lib/mathlive` URLs would not resolve |

Sprint 95 M4 tests **assert** `mode === "fallback"` / `.util-learner-workspace--math-fallback`. That proves lifecycle + draft on textarea — **not** MathLive enhancement (S95-AD-011/012).

### Bundling for static hosting

**Feasible:** reuse existing collect/fetch + vendored trees; inject shell head once; place assets at top-level `lib/mathlive/…` and `lib/mathjax/…` in the unified ZIP; need-based inclusion so non-maths journeys stay lean.

### Other mount capability risks

Ordering and revision-criterion have scoped install/dispose (M4 S95) but revision fixed chrome may still collide. Content-viewer CSS may be incomplete in shell Node resolve. Unknown `product_id` still warned only. Draft `pageKey` stability remains critical.

---

## 3. Contextual guidance findings (→ M3)

- Sprint 94 commissioning / bring-forward copy correctly assumes **no automatic** access to earlier stored answers under multi-document delivery.  
- Unified artefact handoff now supplies declared producer drafts as read-only references; `standaloneFallback` already distinguishes outside-journey cases.  
- Real DUU may still show learner-facing prose telling learners to transfer responses manually — inaccurate in unified mode, appropriate in standalone/multi-doc.  
- Constraint: fix via **runtime/shell presentation**, not prompt pipelines or regenerating educational JSON.

**Scope discussion needed:** which surfaces are in scope (runtime artefact host copy only vs also Assessment Pack `learner_context` / Interactive blocks that were generated as commissioning prose).

---

## 4. Acceptance risks / decisions for discussion

1. **Default switch timing** — Charter holds default until M5; confirm multi-doc remains labelled “compatibility fallback” in UI after switch.  
2. **M3 surface scope** — Runtime-only vs limited generated-prose suppression without regen.  
3. **Math ZIP size** — Always bundle both engines when either needed vs granular detection.  
4. **M4 vs M1 parallelisation** — Maths packaging can start after sticky contract agreed; remount AT testing should follow M1 chrome stabilisation.  
5. **Collapsible TOC default on mobile** — Default collapsed ≤860px? (a11y trade-off).  
6. **Content-viewer / other incomplete shell CSS** — In scope for M4/M2 or separate debt?

---

## 5. Key paths

| Area | Path |
| ---- | ---- |
| Shell | `lib/learning-journey-unified-shell.js` |
| Section nav | `lib/learner-renderer-vnext/sequential-section-nav.js` |
| Lifecycle | `lib/learner-renderer-vnext/resource-lifecycle.js` |
| Math entry | `lib/learner-renderer-vnext/math-entry-runtime.js` |
| Math package | `lib/learner-renderer-vnext/math-entry-package-assets.js`, `mathjax-package-assets.js` |
| Standalone package | `lib/learner-package.js` |
| Learner CSS | `app.js` → `getUtilityVnextProseMeasureCss` |
| Artefacts | `lib/learner-renderer-vnext/learner-artefact-contract.js` |
