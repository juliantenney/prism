# Sprint 95 — Validation ledger

**Sprint:** 95 — Unified Learning Journey Runtime  
**Status:** **CLOSED — ACCEPTED** (S95-D07)

## Planned evidence

| Evidence | Expected |
| -------- | -------- |
| M1 mount/unmount/remount | Assessment Pack fragment mounts; dispose; remount restores draft |
| M2 shell a11y | Single `<main>`; focus + live announcement; TOC keyboard operable |
| M3 artefact resolution | Declared artefact resolves; undeclared drafts never exposed |
| M3 read-only consumer | C6 shows labelled read-only reference; no editable controls on import |
| M3 live update | Edit C5 → return to C6 shows updated text |
| M3 missing input | Consumer usable; clear notice; no invented content |
| Standalone + multi-doc lock | Unchanged and green |
| M4 compatibility inventory | Real DUU source gap recorded before code changes |
| M4 lifecycle installs | Ordering, math-entry, revision-criterion container-scoped install/dispose |
| M4 six-resource shell | All six synthetic commissions reachable; C5→C6 handoff intact |
| M4 browser + a11y | Ordering interaction; math fallback persistence; landmarks; reload |

## Recorded evidence

| Date | Evidence | Result |
| ---- | -------- | ------ |
| 2026-11-03 | M1 lifecycle + AP/LJ/browser | **ACCEPTED** (S95-D02) |
| 2026-11-03 | M2 shell + Playwright | **ACCEPTED** (S95-D03) |
| 2026-11-03 | M3 contract: `tests/s95-m3-learner-artefact-handoff.test.js` | **5 passed, 0 failed** |
| 2026-11-03 | M3 browser: `tests/s95-m3-artefact-handoff-browser.test.js` | **1 passed, 0 failed** |
| 2026-11-03 | M3 combined with M1/M2 + AP + LJ regressions | **56 passed, 0 failed** |
| 2026-11-03 | M4 inventory: `COMPATIBILITY-INVENTORY.md` | **Recorded** — live DUU HTML absent on disk; synthetic fixture required |
| 2026-11-03 | M4 unit: `tests/s95-m4-lifecycle-compatibility.test.js` | **5 passed, 0 failed** — ordering/math lifecycle; six-resource shell + C5→C6 contract embed; multi-doc lock |
| 2026-11-03 | M4 browser: `tests/s95-m4-compatibility-browser.test.js` | **1 passed, 0 failed** — six TOC entries; ordering move; math fallback restore; C5→C6 missing→resolved; single `<main>`; polite live region; reload retains artefact |
| 2026-11-03 | M1–M4 focused suite | **22 passed, 0 failed** |
| 2026-11-03 | AP render/persistence/publish + guided-review + LJ package + maths + revision + browser freshness | **Green** (guided-review document-root scope fix included) |

## M4 accessibility checks performed

| Check | Method | Result |
| ----- | ------ | ------ |
| Single `<main>` landmark | Automated (Node assert + Playwright count) | Pass |
| Persistent TOC / six nav targets | Automated Playwright | Pass |
| `aria-live` on shell announcer | Automated attribute read | Pass (`polite` or `assertive`) |
| Ordering status live region updates | Automated text after move | Pass |
| Artefact missing notice intelligible | Automated text match | Pass |
| Artefact reference read-only (no inputs) | Automated count | Pass |
| Keyboard focus management on nav | Covered by M2 Playwright suite (still green) | Pass |
| Screen-reader labelling of imported artefact | Markup contract from M3 (`.lj-artefact-ref__label` / `aria-label`) still emitted | Pass (markup); full SR pass not re-run manually this slice |
| Inactive-resource cleanup (no duplicate handlers) | Unit dispose + remount listener counts | Pass |
| Misleading completion indicators | Manual inspection of synthetic shell HTML | No completion chrome added |

## M4 C5 → C6 handoff result

Synthetic Assessment Pack C5/C6 with declared artefact contract:

- Missing on C6 before C5 save → usable notice.
- After C5 write → C6 shows labelled read-only reference.
- Reload retains resolved text.
- Real stored DUU identifiers were **not** available on disk; gap recorded in inventory (not concealed by content edits).

## Real-journey integration gate (2026-11-03)

| Evidence | Result |
| -------- | ------ |
| S95-D05 recorded as accepted with qualifications | **Done** |
| Data-access route documented | **Done** — [REAL-JOURNEY-INTEGRATION.md](REAL-JOURNEY-INTEGRATION.md) |
| Developer-only unified shell download | **Done** — `__PRISM_TEST_API.handleLearningJourneyUnifiedShellPackageDownloadForTest` (not default UI) |
| Artefact contract proposal from dependencies + constructed workspace | **3 passed** — `tests/s95-real-journey-artefact-proposal.test.js` |
| Cursor browser / automation store inspection for DUU | **Empty** — 0 workflows; cannot assemble live journey here |
| Live six-resource navigation / real C5→C6 / manual keyboard pass | **Not run** — blocked on author-store presence |
| Full screen-reader audit | **Not claimed** |
| 2026-11-03 | Browser dry-run `runtime_missing` | **Fixed** — authoring path now fetches and passes `runtimeScript`; browser resolve helper ok (~972 KB) |
| 2026-11-03 | Explicit C5→C6 proposal when consumer is Interactive | **Confirmed** — auto path excludes non-AP consumers; explicit ids derive producer workspace |

## Real-journey styling defect (2026-11-03)

Author-confirmed after live DUU unified-shell open: incomplete CSS, TOC/heading `c1`–`c6`, journey intro dominating sidebar.

| Check | Result |
| ----- | ------ |
| Root cause — CSS | Browser assemble omitted `learnerCss`; Node-only `resolveLearnerExportCss` never ran in authoring. |
| Root cause — titles | Authoring path set `title = commissionId` when ready rows lacked titles, masking `page.commissions[].title`. |
| Root cause — intro | Intro rendered inside sticky sidebar above TOC. |
| Fix — CSS | `handleLearningJourneyUnifiedShellPackageDownload` passes `getUtilityVnextProseMeasureCss()`; Node resolve now also pulls composition + expository CSS. |
| Fix — titles | Prefer design-page commission metadata; ignore commission-id echoes. |
| Fix — intro | Intro moved to workspace `<section class="lj-shell__intro">`; sidebar is navigation-first. |
| Cache markers | `app.js` + `learning-journey-unified-shell.js` → `?v=20261103-s95-styling-titles-intro` |
| Unit: titles / intro / CSS | **Pass** — `tests/s95-m2-learning-journey-unified-shell.test.js` (incl. new title + CSS cases) |
| Browser nav / persistence | **Pass** — M2 browser suite |
| C5→C6 artefact handoff | **Pass** — M3 unit + browser |
| Six-resource shell + a11y landmarks | **Pass** — M4 unit + browser |
| Multi-doc / standalone lock | **Unchanged** — multi-doc ZIP test still green; no default publish change |
| Live DUU re-export in this automation store | **Not re-run** — store still empty; author must hard-reload cache marker and re-export |

## Overview destination (2026-11-03)

Author-confirmed after styling fix: journey introduction still competed with the first resource (narrow column above content; raw Markdown visible).

| Check | Result |
| ----- | ------ |
| Overview TOC entry before resources | **Pass** — `data-lj-nav-id="overview"` |
| Default open without resource hash | **Pass** — initial destination is Overview |
| Intro rendered in `<main>` only | **Pass** — no persistent above-resource intro |
| Markdown headings / lists / paragraphs | **Pass** — unit asserts rendered HTML, no raw `##` |
| Resource selection replaces Overview | **Pass** — M2 browser |
| Return to Overview via TOC | **Pass** — M2 browser |
| Prev/Next Overview ↔ resources | **Pass** — M2 browser (Next from Overview → C1; Prev from C1 → Overview) |
| Hash reload (`#c1`) | **Pass** — M2 browser restores resource + draft |
| Draft persistence | **Pass** — M2 browser |
| C5 → C6 artefact handoff | **Pass** — M3 unit + browser |
| Six-resource + a11y landmarks | **Pass** — M4 unit + browser (TOC count 7 with Overview) |
| Single `<main>` | **Pass** |
| Cache marker | `learning-journey-unified-shell.js?v=20261103-s95-overview-destination` |
| Focused suite | **20 passed, 0 failed** |

## Two-level navigation (2026-11-03)

Author-confirmed: journey TOC/Overview worked, but Interactive constituent activity/section navigation was missing; journey Previous/Next competed with resource chrome in the content header.

| Check | Result |
| ----- | ------ |
| Root cause — lost resource nav | Standalone sequential nav HTML + boot script sit outside the extracted `[data-renderer=vnext]` fragment; shell mount never reinstalled them |
| Fix — resource nav | `enhanceFragmentWithSectionNavigation` + container-scoped `installSequentialSectionNav` / dispose on unmount |
| Journey hash preserved | Section adjacent/all-activity clicks do not change `#c6`-style journey hashes |
| Sidebar Previous/Next | Labels **Previous resource** / **Next resource**; sticky at sidebar foot; removed from content toolbar |
| Journey TOC + Overview | Unchanged sequence Overview → C1…C6 |
| Single `<main>` | **Pass** |
| Remount restores internal nav + draft | **Pass** — `tests/s95-sequential-section-nav-browser.test.js` |
| C5 → C6 artefact handoff | **Pass** — M3 browser |
| Six-resource shell | **Pass** — M4 browser |
| Multi-doc / standalone lock | **Pass** — M2 ZIP additive test still green |
| Cache markers | `learning-journey-unified-shell.js` + `learner-renderer-vnext-browser.js` → `?v=20261103-s95-two-level-nav` |
| Focused suite | **13 passed** (nav unit/browser + M2/M3/M4 browser/unit sample) |

## M5 — Author-facing Unified Learning Journey Publishing (2026-11-03)

| Check | Result |
| ----- | ------ |
| Author control in Utilities preview | **Pass** — `#utilitiesDownloadUnifiedJourneyBtn` labelled **Download Unified Learning Journey**; hidden unless LJ commissioning preview active |
| Console not required for author path | **Pass** — click handler → `handleLearningJourneyUnifiedShellPackageDownload` |
| Automatic AP→Interactive artefact proposal from explicit dependencies | **Pass** — `tests/s95-real-journey-artefact-proposal.test.js` (no order-only invention) |
| Unresolved explicit pairs blocked with toast | **Pass** — gaps formatted; package not downloaded when pairs declared but unresolved (`allowUnresolvedArtefactContract` test-only override) |
| Incomplete journey readiness messaging | **Pass** — reuses `preflightLearningJourneyLearnerPackage` / `formatPreflightBlockers` |
| Multi-document ZIP unchanged / non-default unified | **Pass** — existing ZIP control retained; Unified additive |
| Browser: control present on `index.html` | **Pass** — `tests/s95-m5-unified-publishing-browser.test.js` |
| Browser: auto-proposed AP→Interactive handoff in served ZIP | **Pass** — write C5 → resolved C6 reference; reload retains; single `<main>` |
| UI visibility unit | **Pass** — `tests/s95-m5-unified-publishing-ui.test.js` (3) |
| Cache markers | `app.js`, `learning-journey-unified-shell.js`, `learner-renderer-vnext-browser.js` → `?v=20261103-s95-m5-unified-publishing` |
| Live Complete DUU via author UI in automation store | Automation store empty; **author verified live** (below) |
| M5 acceptance | **ACCEPTED** (S95-D06) |

### M5 author live-browser evidence (2026-11-03)

Real *Deciding Under Uncertainty* via normal **Download Unified Learning Journey**:

| Check | Result |
| ----- | ------ |
| Unified ZIP without developer console | **Pass** |
| Journey opens; constituent resources render | **Pass** |
| Journey and component navigation present | **Pass** |
| C5 constructed response in C6 as labelled read-only artefact | **Pass** |
| Artefact contract automatic (no manual commission ids) | **Pass** |

### Final regression at close (2026-11-03)

| Suite | Result |
| ----- | ------ |
| Sprint 95 focused (M1–M5 + sequential nav + runtime script) | **41 passed, 0 failed** |
| Adjacent AP render/persistence + LJ package + LJ home | **40 passed, 0 failed** |

## Remaining limitations (closed into architectural debt)

- Unified shell remains **additive**; multi-doc ZIP remains default download (not superseded) — S95-AD-008.
- MathLive remount / MathJax·MathLive packaging — S95-AD-011, S95-AD-012.
- Presentation-sprint polish (overlapping component nav, sidebar refinement, collapsible TOC, responsive/zoom, C5/C6 manual-transfer copy, further keyboard/SR) — S95-AD-015…020.
- Artefact contract not persisted on design pages — S95-AD-013 (derive at assemble remains acceptable).
- No artefact versioning/snapshots; no AI marking; no prompt-pipeline changes.

See [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md) and [SPRINT-95-CLOSURE.md](SPRINT-95-CLOSURE.md).
