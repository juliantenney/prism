# Sprint 29 — programme closure

**Date:** 2026-05-21  
**Status:** **Closed** (29-0 investigation; 29-1 HTML audit; 29-2 bounded renderer)  
**Test floor:** **355** (`node --test tests/*.test.js`)

---

## Problem diagnosed

Sprint 28 placed cognition fields on composed `page` JSON, but the Utilities HTML renderer (**R**) treated them as undifferentiated prose inside generic activity cards. Learners could not see revision, misconception-repair, uncertainty, or transformation prompts as distinct semantic blocks.

---

## Slices completed

| Slice | Status | Deliverable |
|-------|--------|-------------|
| **29-0** | **Complete** | Investigation pack, code audit, documentary matrix (no `app.js` changes) |
| **29-1** | **Complete** | HTML capture for R29-P01/P02/P07 via `buildUtilityStructuredHtmlForTest`; matrix refresh (**R29-003**) |
| **29-2** | **Complete** | `renderCognitionFieldsForActivity`, `util-cognition*` CSS, regression tests (**R29-004**) |
| **29-3** | Not chartered | No further renderer programme |

---

## Confirmations

| Check | Result |
|-------|--------|
| **29-1 audit complete** | `r29-p*-html-capture.md`, `29-1-html-capture-runner.js`, HTML-backed matrix |
| **29-2 implementation complete** | Top-level activity-row cognition fields → labelled semantic blocks |
| **Tests** | **355** passing (350 baseline + 5 cognition render tests) |
| **No workflow changes** | E/O/G/C untouched |
| **No generation changes** | Prompts/schemas/factors unchanged |
| **No composition changes** | `applyPedagogicCognitionSemanticsToComposedPage` unchanged in Sprint 29 |
| **No assessment rendering changes** | `assessment_check` path and Sprint 27 visibility modes unchanged |

---

## Renderer outcome (29-2)

When cognition field IDs are present on the **top-level activity row**, the renderer emits:

- Wrapper: `util-cognition` with modifier (`util-cognition--revision`, `--repair`, `--uncertainty`, `--transformation`)
- Items: `util-cognition__item`, `util-cognition__label`, `util-cognition__body`
- Placement: after activity header / task summary, **before** materials
- Materials dedupe: cognition keys skipped in materials remainder when the same field exists on the row

**Implementation:** `renderCognitionFieldsForActivity` in `app.js`; styles in `getUtilityCognitionPresentationCss()`.

---

## Residual limitation (by design)

Cognition **embedded inside `task_cards` markdown** (common on post-5d P01/P07 captures) remains **generic** task-card prose. The renderer does not parse or promote inline markdown labels to semantic blocks.

**Moving those fields to top-level activity rows** is a **composition / data-placement** concern (Sprint 28 `mergeUpstreamCognitionFieldsIntoPageActivities`), **not** Sprint 29 renderer scope. No further renderer functionality is planned under this charter.

---

## Hypothesis adjudication (final)

| ID | Verdict |
|----|---------|
| **R29-H1** | **Partial** — assessment item chrome still distinct; activity sections often longer in HTML |
| **R29-H2** | **Supported** for row-level fields — semantic blocks improve legibility without pedagogy changes |
| **R29-H3** | **Partial** — row fields first-class; task-card embedding unchanged |
| **R29-H4** | **Supported** for row-level fields — lightweight CSS yields clear labels |
| **R29-H5** | **Partial** — profile passed to render context; blocks gate on row field presence |

---

## Evidence artefacts

| Artefact | Path |
|----------|------|
| HTML captures | [`context-files/r29-p01-html-capture.md`](context-files/r29-p01-html-capture.md) (P02, P07) |
| Evidence matrix | [`renderer-cognition-evidence-matrix.md`](renderer-cognition-evidence-matrix.md) |
| Semantics notes | [`renderer-semantics-notes.md`](renderer-semantics-notes.md) |
| Tests | [`tests/utility-renderer-cognition-fields.test.js`](../../../tests/utility-renderer-cognition-fields.test.js) |
| Review log | [`review-log.md`](review-log.md) — R29-001 through **R29-005** |

---

## Handover pointer

Sprint 29 is **closed**. Next work should be a **new sprint theme** (e.g. composition parity for task-card embedding, illustration pipeline, export polish) — not an extension of `util-cognition` without a new charter.
