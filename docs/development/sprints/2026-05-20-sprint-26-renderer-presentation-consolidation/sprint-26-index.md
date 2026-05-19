# Sprint 26 index — Renderer presentation consolidation

**Pack path:** `docs/development/sprints/2026-05-20-sprint-26-renderer-presentation-consolidation/`  
**Date:** 2026-05-20  
**Status:** **Open**

**Predecessor (closed):**

- [Sprint 25 — Design Page composition and renderer consolidation](../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/sprint-25-closeout.md) — composition + export contracts **implemented**; live workshop **A1–A5** preserved; **229** tests passing

**Verification floor (entry):** **229 passed**, 0 failed · **current:** **248 passed** (kitchen sink + 26-2–26-5 smoke)

---

## Purpose

Consolidate **utility renderer v1 presentation quality** on top of the **stable composition and export contracts** delivered in Sprint 25.

Sprint 26 is **presentation-only**. It does **not** reopen composition semantics, activity closure, export authority, or workflow orchestration.

---

## Programme thesis

| Layer | Sprint 25 outcome | Sprint 26 focus |
|-------|-------------------|-----------------|
| **Composition** | `page.sections[]` membership + omission trace | **Frozen** — no pack/prompt changes |
| **Export authority** | `sections[]` canonical body; `strictCompositionClosure` | **Frozen** — no authority changes |
| **Renderer** | Faithful when JSON complete; typed material patterns | **Spacing, hierarchy, a11y, print, pattern polish** |

**Benchmark fixtures:**

| Fixture | Role |
|---------|------|
| [`ld-inflation-workshop-page-full.json`](../../../tests/fixtures/page-render/ld-inflation-workshop-page-full.json) | Production-shaped composition fidelity (Sprint 25) |
| [`renderer-kitchen-sink-page.json`](../../../tests/fixtures/page-render/renderer-kitchen-sink-page.json) | Synthetic renderer pattern coverage (Sprint 26) |

---

## Portable pack (this folder)

| File | Purpose |
|------|---------|
| [`sprint-26-index.md`](sprint-26-index.md) | This index |
| [`sprint-26-charter.md`](sprint-26-charter.md) | Sprint charter, boundaries, success criteria |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Live status + active slice |
| [`review-log.md`](review-log.md) | Decisions R26-001+ |
| [`renderer-governance.md`](renderer-governance.md) | Safe vs prohibited renderer changes |
| [`renderer-refinement-backlog.md`](renderer-refinement-backlog.md) | Scoped presentation backlog |
| [`renderer-kitchen-sink-fixture-design.md`](renderer-kitchen-sink-fixture-design.md) | **Kitchen sink** fixture design, coverage matrix, gap audit |
| [`slice-26-2-charter.md`](slice-26-2-charter.md) | **26-2** spacing/hierarchy/density pass (complete) |
| [`slice-26-3-charter.md`](slice-26-3-charter.md) | **26-3** fallback safety + structural cleanup (complete) |
| [`slice-26-4-charter.md`](slice-26-4-charter.md) | **26-4** professional renderer polish (complete) |
| [`slice-26-5-charter.md`](slice-26-5-charter.md) | **26-5** typographic refinement and finish (complete) |
| [`tests/fixtures/page-render/renderer-kitchen-sink-page.json`](../../../tests/fixtures/page-render/renderer-kitchen-sink-page.json) | Synthetic renderer stress JSON |
| [`tests/utility-renderer-kitchen-sink.test.js`](../../../tests/utility-renderer-kitchen-sink.test.js) | Kitchen sink smoke tests |

---

## Proposed slice sequence

| Slice | Focus | Status |
|-------|--------|--------|
| **26-1** | Governance refresh + renderer audit baseline (inflation HTML review) | **Complete** |
| **26-2** | Global visual rhythm (spacing, headings, section transitions, density) | **Complete** |
| **26-3** | Fallback safety + structural cleanup | **Complete** |
| **26-4** | Professional renderer polish (hierarchy, icons, cards, timeline, tables, metadata) | **Complete** |
| **26-5** | Typographic refinement and presentation finish | **Complete** |
| **26-6** | Fragment fixtures + optional enhancements (compact mode, etc.) | Optional — charter per item |

Slices are **not implementation-approved** until chartered individually. **26-1** may be documentation + audit only.

---

## Explicit non-goals (frozen from Sprint 25)

Do **not** reopen in Sprint 26:

- Design Page composition semantics or pack prompts
- `validatePageActivityClosure` / `generation_notes` omission rules
- `strictCompositionClosure` / export authority / `pageSections` contract
- `page.sections[]` as canonical body
- Workflow runtime, Settings, PF, LD artefact taxonomy
- Automatic content repair or activity recovery from materials/sequence
- Generic object-walker material dumps replacing typed patterns

**Authoritative contracts (read-only reference):**

- [`design-page-composition-contract.md`](../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/design-page-composition-contract.md)
- [`design-page-export-contract.md`](../2026-05-19-sprint-25-design-page-composition-renderer-consolidation/design-page-export-contract.md)

---

## System boundaries

```mermaid
flowchart LR
  PAGE[page.sections JSON - frozen shape]
  UTIL[Utilities renderer v1]
  HTML[HTML / print / preview]

  PAGE --> UTIL
  UTIL --> HTML
```

| Layer | Sprint 26 owns | Sprint 26 does not own |
|-------|----------------|-------------------------|
| **CSS / HTML presentation** | Spacing, typography, cards, print | — |
| **Material renderers** | Pattern HTML for known shapes | Inventing pedagogy or activities |
| **Tests** | Presentation regression snapshots / selectors | Composition closure tests (frozen) |
| **Docs** | Governance, backlog, a11y checklist | Composition/export contracts |

---

## Key references (codebase)

| Topic | Path |
|-------|------|
| Renderer implementation | `app.js` — `utilityRenderPageSections`, `buildUtilityStructuredHtml`, material helpers |
| Export behaviour notes | [`docs/architecture/renderer-export-behavior.md`](../../../architecture/renderer-export-behavior.md) |
| Full workshop fixture | `tests/fixtures/page-render/ld-inflation-workshop-page-full.json` |
| Render regression tests | `tests/utility-ld-inflation-page-render.test.js` |
| Composition tests (do not modify semantics) | `tests/utility-page-composition-closure.test.js` |

---

## Verification

```bash
node --test tests/*.test.js
```

**Entry floor:** **229 passed**, 0 failed.  
**Sprint rule:** test count must not regress; presentation changes should extend or tighten renderer tests, not weaken composition tests.
