# Sprint 96 — Validation ledger

**Sprint:** 96 — Unified Learning Journey Experience & Compatibility  
**Status:** **OPEN** — M1 accepted; M2 evidence recorded; awaiting author acceptance

## Planned evidence

| Evidence | Expected |
| -------- | -------- |
| M1 sticky overlap / zoom | Section nav clearance tracks live toolbar; no prose bleed at 100–200% zoom |
| M1 collapsible TOC | Keyboard, aria-expanded, focus return, Escape; one `<main>` |
| M1 journey vs resource nav | Distinct labels/placement; hash contract preserved |
| M2 visual coherence | Compact chrome; full-height sidebar; reading measure unchanged |
| M3 contextual guidance | Unified accurate; standalone manual guidance preserved |
| M4 MathLive enhanced | `math-field` present; remount ≥2; draft restore; offline ZIP |
| M4 MathJax | Typeset after mount and remount; offline ZIP |
| M5 real DUU + maths journeys | Author + automated gates |
| M5 default switch | Unified standard; multi-doc fallback; regressions green |
| Standalone + multi-doc lock | Unchanged behaviour until/after fallback retained |

## Recorded evidence

| Date | Evidence | Result |
| ---- | -------- | ------ |
| 2026-11-03 | Read-only investigation (layout + maths) | **Recorded** — [INITIAL-INVESTIGATION.md](INITIAL-INVESTIGATION.md) |
| 2026-11-03 | Sprint 95 baseline focused suite (pre-S96) | **41 passed** at close (`c5d93e8…`) — reference only |

## M1 — Navigation and layout (2026-11-03)

| Check | Result |
| ----- | ------ |
| Hard-coded `3.75rem` removed | **Pass** — unit asserts CSS uses `--lj-shell-toolbar-height` |
| Toolbar height measured | **Pass** (M1); superseded in M2 — var fixed at `0px` after title-bar removal |
| Section nav sticky top uses measured toolbar height | **Pass** — `top: var(--lj-shell-toolbar-height)` |
| Scroll/index clearance includes toolbar in shell | **Pass** — `totalStickyClearanceHeight()` in sequential-section-nav |
| Layout listener dispose on unmount | **Pass** — removes `prism:lj-shell-layout` listener in dispose |
| Collapsible sidebar (wide default expanded) | **Pass** — browser |
| Collapsed default ≤860px | **Pass** — browser at 390px width |
| Explicit choice persists across resources | **Pass** — `sessionStorage` `prism:lj-shell:sidebar-state` |
| Accessible name / aria-expanded | **Pass** — toggle + reopen controls |
| Keyboard Escape collapses when focus in sidebar | **Pass** — focus returns to reopen |
| Previous/Next structural two-column actions | **Pass** (M1); **removed in M2** per design |
| Desktop sticky no overlap | **Pass** — Playwright geometry |
| Narrow layout usable main width | **Pass** — browser |
| 200% / 400% zoom sticky no overlap | **Pass** — Playwright (`documentElement.style.zoom`) |
| 200% no unexpected horizontal page scroll | **Pass** |
| Draft persistence across resource nav | **Pass** — browser |
| Artefact handoff regression (S95 M3 browser) | **Pass** |
| Shell / sequential nav regressions | **Pass** |
| Screen-reader verification | **Not claimed** — keyboard/ARIA only |

### Automated results (M1)

| Suite | Result |
| ----- | ------ |
| `tests/s96-m1-navigation-layout.test.js` | **2 passed** |
| `tests/s96-m1-navigation-layout-browser.test.js` | **1 passed** |
| Related S95 shell / section-nav / artefact browser sample | **Green** |

**M1 acceptance:** **Accepted** (S96-D08) with visual caveat — engineering only; presentation not final.

---

## M2 — Visual coherence (2026-11-03)

| Check | Result |
| ----- | ------ |
| Compact ~36–40px icon toggle (expanded) | **Pass** — Playwright bounding box + `aria-label="Hide journey contents"` |
| Compact restore control (collapsed, top-left) | **Pass** — fixed icon reopen + `aria-label="Show journey contents"` |
| Full-height sidebar (desktop) | **Pass** — sidebar height ≈ viewport; TOC `overflow:auto` |
| Shell Previous/Next removed | **Pass** — unit + browser assert absent |
| Shell title bar removed | **Pass** — no `.lj-shell__toolbar` / current-label |
| Sticky without title bar | **Pass** — `--lj-shell-toolbar-height: 0`; section nav `top` uses var; `--learner-sticky-nav-height` measured |
| Resource reading width unchanged | **Pass** — `--learner-reading-width: 70ch` in shell CSS + browser |
| Content-viewer CSS in shell resolve | **Pass** — unit match `util-learner-content-viewer` |
| Draft persistence via Contents nav | **Pass** — browser |
| Narrow + 200%/400% zoom | **Pass** — browser; reading token unchanged |
| Keyboard Escape + focus to reopen | **Pass** |
| Artefact handoff C5→C6 regression | **Pass** — `tests/s95-m3-artefact-handoff-browser.test.js` |
| Screen-reader verification | **Not claimed** |

### Automated results (M2)

| Suite | Result |
| ----- | ------ |
| `tests/s96-m2-visual-coherence.test.js` | **2 passed** |
| `tests/s96-m2-visual-coherence-browser.test.js` | **1 passed** |
| `tests/s96-m1-navigation-layout.test.js` | **2 passed** |
| `tests/s96-m1-navigation-layout-browser.test.js` | **1 passed** |
| `tests/s95-m2-learning-journey-unified-shell.test.js` (+ related) | **Green** |
| `tests/s95-m2-unified-shell-browser.test.js` | **1 passed** |
| `tests/s95-sequential-section-nav.test.js` / browser | **Green** |
| `tests/s95-m3-artefact-handoff-browser.test.js` | **1 passed** |

### Browser evidence screenshots

| File | Scene |
| ---- | ----- |
| [evidence/m2-visual-coherence/01-desktop-expanded.png](evidence/m2-visual-coherence/01-desktop-expanded.png) | Desktop, sidebar expanded, resource mounted |
| [evidence/m2-visual-coherence/02-desktop-collapsed.png](evidence/m2-visual-coherence/02-desktop-collapsed.png) | Desktop, sidebar collapsed, compact reopen |
| [evidence/m2-visual-coherence/03-narrow-screen.png](evidence/m2-visual-coherence/03-narrow-screen.png) | 390px viewport |
| [evidence/m2-visual-coherence/04-zoom-200.png](evidence/m2-visual-coherence/04-zoom-200.png) | 200% zoom |
| [evidence/m2-visual-coherence/05-zoom-400.png](evidence/m2-visual-coherence/05-zoom-400.png) | 400% zoom |

### M2 refinements (authorised within M2 — 2026-11-03)

| Check | Result |
| ----- | ------ |
| Cause of black title outline | **Identified** — initial `showResource(..., {skipFocus:false})` programmatically focused `[data-lj-resource-title]` |
| No intrusive outline on initial load | **Pass** — `skipFocus:true` on boot; browser assert heading not focused |
| Focus after Contents navigation | **Pass** — heading receives focus (`tabindex=-1`) after user nav |
| Keyboard `:focus-visible` retained | **Pass** — Tab to sidebar control shows outline; no global `outline:none` |
| Collapsed full-height rail ~52–60px | **Pass** — `--lj-shell-rail-width:3.5rem`; Playwright geometry |
| Toggle stable in rail (no floating reopen) | **Pass** — single `#lj-shell-sidebar-toggle`; reopen control removed |
| Shared `--learner-nav-*` tokens | **Pass** — unit + browser (TOC + current section share active blue) |
| Standalone sequential-nav / export shell | **Pass** — `learner-renderer-vnext-sequential-nav` + export-shell suites |
| Artefact handoff / draft persistence | **Pass** — S95 browser regressions |
| Reading width `70ch` | **Pass** |

### M2 horizontal overflow fix (2026-11-03)

| Check | Result |
| ----- | ------ |
| Root cause | **Identified** — `.util-material-table-block` / table breakouts size with `100vw` as if the reading column is centred in the viewport; beside the unified sidebar they extend past `.lj-shell__workspace` (~124px at 1280×800 on real DUU C2/C3) |
| Responsible scroll surface | Workspace `overflow:auto` full-height → horizontal scrollbar along the bottom of the viewport (document `scrollWidth` stayed clipped via shared body `overflow-x:clip`) |
| Fix | Shell-scoped breakout rebase: `container-type:inline-size` on `#lj-shell-main`; `--learner-breakout-basis:100cqw` instead of `100vw` |
| Before (DUU C2 @1280) | workspace `scrollWidth` 1124 / `clientWidth` 1000 (**+124**) |
| After (DUU C2/C3 @1280) | workspace overflow **0**; breakout `overflow-x:auto`; reading width **70ch** |
| Narrow 390 / 200% zoom | workspace overflow **0** |
| 400% zoom | Extreme CSS-zoom geometry remains imperfect; tables keep local `overflow-x:auto` (not claimed as ordinary desktop) |
| Standalone C2 | document overflow **0**; breakout unchanged (still `100vw` path) |
| Automated | `tests/s96-m2-horizontal-overflow.test.js` — **2 passed** |

Evidence screenshots: [evidence/m2-horizontal-overflow/](evidence/m2-horizontal-overflow/).

Cache markers: `learning-journey-unified-shell.js` + `learner-renderer-vnext-browser.js` → `?v=20261103-s96-m2-horizontal-overflow`.

**M2 acceptance:** **ACCEPTED** (S96-D09) — author confirmed presentation and horizontal-overflow fixes on the exported unified *Deciding Under Uncertainty* journey.

---

## Resource-fidelity repair gate (S96-D10)

Full write-up: [RESOURCE-FIDELITY-GATE.md](RESOURCE-FIDELITY-GATE.md).

| Check | Result |
| ----- | ------ |
| Graphics root cause | **Identified** — `sourcePage` preferred over package HTML (dropped imgs); `rewriteAssetPaths` ignored `media/` |
| C2 graphics decode under static host | **Pass** — `media/c2/…`; naturalWidth > 0 |
| C3/C4 representative graphics | **Pass** |
| C2 Four-Source Evaluation editable (standalone + unified) | **Pass** — `textarea.util-learner-table-workspace__input` + `aria-labelledby` |
| C4 Three-Option Evidence Comparison editable | **Pass** — 9 inputs; author phrase “Compare all three alternatives” maps to this workspace |
| Drafts persist across resource nav | **Pass** (browser C2↔C4) |
| Keyboard focus on table input | **Pass** |
| 70ch / no document overflow | **Pass** |
| S95 artefact handoff suite | **Pass** |
| Standalone publishing path | **Unchanged** |
| Screen-reader verification | **Not claimed** |

Automated: `tests/s96-resource-fidelity.test.js` (4), `tests/s96-resource-fidelity-browser.test.js` (1).

Evidence: [evidence/m2-resource-fidelity/](evidence/m2-resource-fidelity/).

**Resource-fidelity acceptance:** **ACCEPTED** (S96-D11).

---

## M3 Contextual guidance (S96-D12 / S96-D13)

| Check | Result |
| ----- | ------ |
| Guidance source | **Identified** — Sprint 94 commissioning prompts (`composeCommissioned*` + Step 4 BRING-FORWARD) forced “PRISM does not transfer…” into generated C5/C6 prose |
| Responsibility boundary | Educational task in content; availability explained by runtime |
| Prompt pipeline delivery-neutral | **Pass** — app.js + sibling Step 4 + Assessment Pack Bind/Design |
| Unified C5 save/copy + transfer prose neutralized | **Pass** (browser) |
| Unified C6 transfer/retrieve prose neutralized | **Pass** (browser) |
| Artefact host still injects available/missing | **Pass** |
| Journeys without artefact deps unchanged | **Pass** (unit) |
| Standalone source retains manual-reference prose until regen | **Pass** (fixture assert) |
| Stored journey overwritten | **No** — candidate only ([M3-CANDIDATE-CONTENT.md](M3-CANDIDATE-CONTENT.md)) |
| Reading width 70ch | **Pass** |
| S95 artefact handoff suite | **Pass** (note wording updated) |

Automated: `tests/s96-m3-contextual-guidance.test.js`, `tests/s96-m3-contextual-guidance-browser.test.js`, updated S94 WP1/WP4/WP5.

Evidence: [evidence/m3-contextual-guidance/](evidence/m3-contextual-guidance/).

**M3 acceptance:** Proposed (S96-D13) — awaiting author.

---

## Publishing UI simplification (S96-D14)

**Product decision:** Learning Journeys publish only as unified experiences. This is **not** M4/M5 completion.

| Check | Result |
| ----- | ------ |
| Separate Unified download control removed | **Pass** — absent from `index.html` |
| One normal LJ download action | **Pass** — package btn → `handleLearningJourneyUnifiedShellPackageDownload` |
| Labels: Download Learning Journey / Download Resource | **Pass** |
| Unified ZIP contains index + runtime + media | **Pass** (existing assemble + S95/S96 package tests) |
| No silent multi-doc fallback on unified failure | **Pass** — route calls unified only |
| Legacy multi-doc assembler still callable | **Pass** — `handleLearningJourneyLearnerPackageDownloadForTest` + `assembleLearningJourneyLearnerPackage` |
| Standalone resource ZIP path unchanged | **Pass** — non-LJ still uses resource package builder |
| Mathematics compatibility claimed | **No** at D14 — see M4 section below |

Automated: `tests/s96-lj-publishing-default.test.js`; updated `tests/s95-m5-unified-publishing-ui.test.js` / browser.

---

## M4 — Mathematics compatibility (2026-11-04)

**Status:** **IMPLEMENTED** — awaiting author acceptance (S96-D16). Policy: [S96-D05](decisions.md#s96-d05--mathematics-packaging-policy-m4).

| Check | Result |
| ----- | ------ |
| Need-based packaging (none / MathJax-only / MathLive-only / both) | **Pass** |
| Missing assets fail closed | **Pass** (`mathlive_assets_missing` / `mathjax_assets_missing`) |
| Shell loads local MathLive + MathJax (no CDN) | **Pass** — head inject; ZIP root `lib/mathlive/…`, `lib/mathjax/…` |
| MathLive enhanced `<math-field>` on first mount | **Pass** (browser) |
| Remount ≥2 + TeX draft restore | **Pass** (browser) |
| Reload restores distinctive expression | **Pass** (browser) |
| MathJax typeset after mount and remount | **Pass** — `mjx-container`; no raw delimiters |
| Switch maths ↔ non-maths resources | **Pass** |
| Offline / CDN blocked | **Pass** — Playwright aborts CDN hosts; zero CDN requests |
| Standalone maths packaging regressions | **Pass** — S82 MathLive + MathJax suites |
| Fallback alone not counted as enhanced success | **Pass** — S95 unit keeps fallback negative control; browser asserts enhanced |
| Screen-reader acceptance | **Not claimed** — keyboard/focus labels retained; formal AT deferred (S95-AD-020 / M5) |

Automated:

- `tests/s96-m4-math-compatibility.test.js` — **8 passed**
- `tests/s96-m4-math-compatibility-browser.test.js` — **1 passed** (~9.5s)
- `tests/s95-m4-compatibility-browser.test.js` — updated for enhanced MathLive — **passed**
- `tests/s95-m4-lifecycle-compatibility.test.js` — fallback negative control retained — **passed**
- S82 MathLive + MathJax packaging suites — **passed**

**Not done:** DUU six-resource regen; formal screen-reader sign-off; M5.

---

## Viewport-centred reading column (S96-D15)

| Check | Result |
| ----- | ------ |
| Desktop expanded prose centre @1280 | **640** (viewport centre 640) |
| Desktop collapsed prose centre @1280 | **640** (Δ **0** vs expanded) |
| Reading width | **70ch** both states |
| Prose / breakout under sidebar | **No** |
| Document overflow (desktop / narrow / 200%) | **0** |
| C2/C4 wide tables expand into available main width | **Pass** (breakoutRight ≈ viewport − gutter; not under sidebar) |
| Narrow 390 (stacked sidebar occupied=0) | Prose centred in content; no overlap; overflow 0 |
| 400% zoom | Local geometry imperfect; no claim of ordinary desktop |
| Standalone layout | Unchanged (shell overrides only under `body.lj-shell-body`) |

Measurements: [evidence/viewport-centred-reading/measurements.json](evidence/viewport-centred-reading/measurements.json).  
Screenshots: [evidence/viewport-centred-reading/](evidence/viewport-centred-reading/).  
Automated: `tests/s96-viewport-centred-reading.test.js` — **2 passed**.

Cache marker: `?v=20261103-s96-viewport-centred-reading`.

**Acceptance:** Proposed (S96-D15) — awaiting author review.
