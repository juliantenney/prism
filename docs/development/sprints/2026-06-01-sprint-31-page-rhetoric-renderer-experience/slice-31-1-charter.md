# Slice 31-1 charter — Metadata visibility & learner/developer boundary

**Status:** **Complete** (2026-06-01)  
**Slice:** 31-1  
**Date:** 2026-06-01  
**Approved:** 2026-06-01 — R31-002

**Parent:** [`sprint-31-charter.md`](sprint-31-charter.md) §6, §9

---

## Goal

Learner-facing rendered pages must read as **study documents**, not **production exports**. Production traceability (`source_artefacts`, `constraints_applied`, `generation_notes`, internal `metadata` sections) stays available but **outside the main reading path** — collapsed in `details.util-meta` or equivalent, never as prominent body sections.

---

## Problem (observed)

| Issue | Example |
|-------|---------|
| Metadata feels developer-facing | Upstream artefact keys, generation limitations visible while studying |
| Inconsistent paths | Top-level keys vs `sections[]` entry with `section_id: metadata` (kitchen-sink) |
| RNA/Marx live JSON | Root `source_artefacts` / `generation_notes` — must not appear as learner H2 flow when fold exists |
| Audience line | `Audience: Review panel` on shape fixtures — acceptable for tests; live learner pages should not surface review-only labels in primary flow (evaluate per `page_profile`) |

---

## In scope

| Item | Detail |
|------|--------|
| **R-layer only** | `buildUtilityStructuredHtml` and helpers: `utilityIsPageMetadataSectionEntry`, `utilityRenderPageMetadataSectionHtml`, section key routing |
| **Fold behaviour** | All `metadataKeys` content in `<details class="util-meta">`; default **closed** |
| **Body cleanliness** | Main HTML before `util-meta` contains no production metadata keys as `<h2>` sections |
| **Section-array metadata** | `sections[]` metadata entries fold only — not duplicated in body (align kitchen-sink test) |
| **Summary copy** | `utilityRenderMetaSummaryHtml()` — learner-appropriate label (e.g. “About this page” / “Production details”) — tone review |
| **Tests** | Extend `utility-page-render.test.js`, `utility-renderer-kitchen-sink.test.js`; optional Marx live JSON render assertion |
| **Manual review** | Marx + RNA live re-render per [`context-files/evidence-pages-marx-rna.md`](context-files/evidence-pages-marx-rna.md) rubric rows 7–9 |

---

## Out of scope (31-1)

| Excluded | Notes |
|----------|--------|
| Cue typography / weighting | Slice **31-2** |
| PEL field changes | No JSON schema changes |
| Generation / composition | No DLA, GAM, Design Page, merge logic |
| Hiding pedagogic cues | Orientation/reasoning must remain in body when present |
| `page_profile` semantics change | Only render-time suppression if already implied |
| Removing metadata from JSON | Display policy only |

---

## Current behaviour (baseline)

`buildUtilityStructuredHtml` (~30168–30379):

- Page artefacts: `source_artefacts`, `constraints_applied`, `generation_notes` → `metadataBlocks` → `util-meta` fold.
- `pageBodyFromSectionsArray`: metadata sections via `utilityIsPageMetadataSectionEntry` → meta fold.
- `suppressInternalMetadata: true` in section render opts reduces inline leakage.

**Gaps to close in 31-1:** any path where metadata still appears in `primaryBlocks`; RNA/Marx live renders audited; summary label rhetoric; `Audience` handling for `page_profile: learner`.

---

## Acceptance criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-1 | `shape-production-metadata.json` — upstream keys only inside `util-meta` | Existing test + extend if needed |
| AC-2 | `shape-metadata-with-body.json` — body lists clean | Existing test |
| AC-3 | Kitchen-sink metadata section not in body before fold | `utility-renderer-kitchen-sink.test.js` |
| AC-4 | Marx fixture render — no `source_artefacts` H2 in body | New or extended assertion |
| AC-5 | RNA live JSON render — `generation_notes` not in body H2 | New assertion when stable |
| AC-6 | Full suite ≥ **471** pass | `node --test tests/*.test.js` |
| AC-7 | Manual rubric rows 7–9 **Pass** on Marx + RNA HTML | [`presentation-review-rubric.md`](context-files/presentation-review-rubric.md) |

---

## Implementation checklist

- [x] Audit all `renderSectionKey` / `utilityRenderPageSections` paths for metadata leakage
- [x] Confirm `utilityIsPageMetadataSectionEntry` covers all Design Page metadata section shapes
- [x] Tune `utilityRenderMetaSummaryHtml` label → **About this page**
- [x] Evaluate `Audience` rendering — suppressed when `page_profile` is learner
- [x] Add/extend tests (no visual-only change)
- [x] Re-render Marx/RNA live JSON — [`probe-31-01-marx-render-notes.md`](context-files/probe-31-01-marx-render-notes.md), [`probe-31-02-rna-render-notes.md`](context-files/probe-31-02-rna-render-notes.md)
- [x] Record decision **R31-002** in [`review-log.md`](review-log.md)
- [x] Update [`CURRENT-STATE.md`](CURRENT-STATE.md) slice 31-1 → complete

---

## Regression guards

| Page | Test |
|------|------|
| Workshop inflation | `tests/utility-ld-inflation-page-render.test.js` |
| Facilitated climate | `tests/utility-ld-climate-misconception-page-render.test.js` |
| PEL framing order | `tests/utility-self-directed-activity-framing.test.js` — unchanged cue order |

---

## Success rubric (manual)

| Question | Pass |
|----------|------|
| Would a learner mistake metadata for lesson content? | **No** |
| Can an author still find upstream traceability? | **Yes** (open meta fold) |
| Does the page feel calmer at first scroll? | **Yes** |

---

## Files likely touched (implementation phase only)

| File | Change |
|------|--------|
| `app.js` | Renderer metadata routing, meta summary copy, optional audience gate |
| `tests/utility-page-render.test.js` | Assertions |
| `tests/utility-renderer-kitchen-sink.test.js` | Assertions |
| `tests/utility-marx-page-render.test.js` | Optional metadata boundary |
| Sprint 31 docs | CURRENT-STATE, review-log, probe notes |

**Implemented** 2026-06-01 per R31-002.
