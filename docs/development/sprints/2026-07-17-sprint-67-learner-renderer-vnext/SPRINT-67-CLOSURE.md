# Sprint 67 — Closure

**Sprint:** 67 — Learner Renderer vNext  
**Closed:** 2026-07-21  
**Final task:** Sprint 67.10 — CSS cleanup and verification  

---

## Outcome

Sprint 67 delivered a deterministic vNext learner export renderer with:

- validated page model → HTML pipeline
- default vNext export shell (1200px header/navigation, 70ch reading column)
- normal-flow lesson header with sticky journey navigation sibling
- responsive navigation overflow, journey progress track, and scroll-margin targets
- restored typography and semantic iconography
- field coverage, golden tests, and browser bundle registration

Legacy renderer remains available via explicit `rendererVersion: "legacy"` for comparison until Sprint 68 retirement work.

---

## Sprint 67.10 CSS cleanup (final)

| Change | Rationale |
| ------ | --------- |
| Removed `--learner-shell-width` and `--learner-text-2xl` | Unused / misleading tokens |
| Fixed duplicate `min-width: 0` on icon label flex child | Duplicate declaration |
| `.util-learning-header__duration` independent selector | Duration owns presentation regardless of parent |
| Consistent horizontal nav scrollbar policy | Removed `-ms-overflow-style` and WebKit scrollbar hiding; retained `scrollbar-width: thin` |
| Consolidated scroll-link CSS via shared fragments | DRY without changing breakpoints |
| Removed print `* { break-inside: auto; }` | Over-broad reset |
| Retained compatibility selectors | `util-journey-arrow`, `util-journey-nav--scroll`, knowledge-summary variants, pedagogic-beat/icon sizes — used by other fixtures or bundled icon CSS |
| Retained defensive activity/material resets | Protect vNext from shared/legacy card styling |

`body.util-page-export--vnext { overflow-x: clip; }` retained — no sticky regression observed in automated structural tests.

---

## Verification

- **Automated:** 150 vNext-related tests green; full `tests/*.test.js` suite green at closure.
- **Export artefact:** [`artefacts/heteroscedasticity-vnext-icons-export.html`](artefacts/heteroscedasticity-vnext-icons-export.html) regenerated after 67.10.
- **Manual:** Desktop/mobile smoke test and journey-link landing checks recommended before production cutover.

---

## Sprint 68 startup item

**Restore consistent activity-to-activity bridging.**

Initial investigation must determine:

- whether authoritative bridge text already exists in the JSON or render model
- why only one intellectual coherence bridge is currently visible
- whether existing bridge content is misplaced inside the destination activity
- how to render concise transitions between consecutive activity articles
- what schema or pipeline data is genuinely missing, if existing data is insufficient

See also [`planning/sprint-68-planning-note.md`](planning/sprint-68-planning-note.md).

---

## Evidence

| ID | Notes |
| -- | ----- |
| S67-EV-05 … S67-EV-07 | Feature flag, browser bundle, M5 human review |
| S67-EV-08 | Sprint 67.10 CSS cleanup — `getUtilityVnextProseMeasureCss`, `learner-icon-renderer.js`, export-shell tests |

Add S67-EV-08 to evidence-log separately if maintaining the table.
