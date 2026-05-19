# Renderer refinement backlog (Sprint 26)

**Date:** 2026-05-20  
**Status:** **Prioritised backlog** — items require slice charter before implementation (except doc-only 26-1)

**Governance:** [`renderer-governance.md`](renderer-governance.md)  
**Benchmark:** `tests/fixtures/page-render/ld-inflation-workshop-page-full.json`

**Legend:** **Safe** = presentation-only per governance §4.1 · **Charter** = needs mini-charter in slice notes · **P0** = workshop readability blocker · **P1** = high value · **P2** = polish / optional

---

## P0 — Workshop readability (audit first in 26-1)

| ID | Item | Type | Notes |
|----|------|------|-------|
| B26-001 | Section spacing rhythm (`h2` → content, section → section) | Safe | **Done (26-2)** — `getUtilityPagePresentationCssV26_2` section/`h2` rules |
| B26-002 | Activity block density (`util-task-block` padding vs nested materials) | Safe | **Done (26-2)** — activity block + materials border rhythm |
| B26-003 | Heading hierarchy clarity (activity `h3` vs material `h4`) | Safe | **Done (26-4, 26-5)** — material tier + markdown section heading calm-down in v26-5 |
| B26-004 | Table overflow / print (A2 comparison table, worksheets) | Safe · Charter | **Done (26-2)** — `.util-table-scroll` + print overflow |
| B26-005 | Long prompt set scannability (A2, A5) | Safe | **Done (26-2)** — prompt set + list spacing / wrap |

---

## P1 — Material pattern consistency

| ID | Item | Type | Notes |
|----|------|------|-------|
| B26-010 | Task card grid alignment (`util-card-grid`, `util-task-card`) | Safe | **Partial (26-2, 26-4)** — grid gap/minmax; light card shadow in v26-4 |
| B26-011 | Scenario card stack (`util-scenario-list`, titles) | Safe | **Partial (26-4, 26-5)** — unified card radius/shadow restraint |
| B26-012 | Prompt set + checklist grouping (A2) | Safe | **Done (26-3, 26-5)** — distinct accent colours (blue vs slate) in v26-5 |
| B26-013 | Worksheet / table heading pattern | Safe | **Partial (26-4)** — material heading + `.util-table-scroll` border/header/empty-cell treatment |
| B26-014 | Support note vs output block distinction | Safe | **Done (26-2)** — margin separation after output block |
| B26-015 | Session timeline / sequence blocks (if in fixture) | Safe | **Done (26-4, 26-5)** — numbered step progression in v26-5 |
| B26-016 | Metadata collapse (`util-meta`, production metadata) | Safe | **Partial (26-4, 26-5)** — document-information summary + footer typography; print expand deferred |

---

## P1 — Accessibility and usability

| ID | Item | Type | Notes |
|----|------|------|-------|
| B26-020 | Heading structure audit per exported page | Safe | **Partial (26-5)** — markdown `h2`–`h4` calm-down inside sections; tag levels unchanged |
| B26-021 | Icon accessibility pass | Safe | **Partial (26-4)** — `util-icon-heading` alignment; decorative FA unchanged |
| B26-022 | Colour contrast on badges and muted text | Safe | Badge blues/greens on grey backgrounds |
| B26-023 | Checkbox list readability | Safe | **Done (26-2)** — `util-checkbox-list` line-height/margins |
| B26-024 | Mobile reflow (max-width 980 → narrow) | Safe · Charter | Card grids stack; tables scroll |

---

## P2 — Optional enhancements (charter required)

| ID | Item | Type | Notes |
|----|------|------|-------|
| B26-030 | Print-specific CSS (`@media print`) | Charter | **Partial (26-2, 26-5)** — break-inside + v26-5 shadow removal / grayscale borders |
| B26-031 | Compact mode for long workshops | Charter | Toggle via render option only — **no content omission** |
| B26-032 | Facilitator note styling variant | Safe · Charter | Secondary typographic tier |
| B26-033 | Material grouping subheadings (icon + label consistency) | Safe | **Partial (26-4)** — calmer `util-material-heading` + `util-icon-heading` gap |
| B26-034 | Learning object mode presentation parity | Charter | **Partial (26-4)** — LO export appends full `getUtilityPagePresentationCss()`; LO chrome polish deferred |

---

## P1 — Regression protection (Slice 26-5)

| ID | Item | Type | Notes |
|----|------|------|-------|
| B26-040 | Fixture: dense nested materials slice | Safe | Extract A1-only fragment JSON |
| B26-041 | Fixture: long prompt set fragment | Safe | A2 prompt_set + checklist |
| B26-042 | Test: print-critical CSS classes exist | Safe | **Partial (26-2, 26-4)** — kitchen sink asserts print rules + timeline print `break-inside` in v26-4 |
| B26-043 | Test: metadata collapsed by default | Safe | `<details class="util-meta">` |
| B26-044 | Test: no placeholder markdown leaks | Safe | Extend existing sanitizer tests |
| B26-045 | Catalog `sectionOrder` parity render smoke | Safe | Already in inflation tests — keep green |

---

## Explicitly excluded (Sprint 26)

| ID | Item | Reason |
|----|------|--------|
| — | Re-enable full-page probe activity recovery | Export contract / Sprint 25 |
| — | Auto-insert missing activities | Composition scope |
| — | Change `validatePageActivityClosure` | Sprint 25 frozen |
| — | Design Page prompt edits | Pack scope |
| — | Generic `utilityRenderObject` for all materials | Governance §5 |

---

## Kitchen sink coverage (B26-050+)

| ID | Item | Type | Notes |
|----|------|------|-------|
| B26-050 | Kitchen sink fixture + smoke tests | Done | `renderer-kitchen-sink-page.json`, 7 tests |
| B26-051 | Feedback-display variant fixture | Charter | `answer_grid_end` / `answers_explanations` |
| B26-052 | Remove or gate PRISM TRACE material logs | P2 | DevTools noise |
| B26-053 | First-class `comparison_table` key | P2 | Today uses remainder loop |
| B26-054 | Checklist vs prompt_set icon differentiation | P2 | **Done (26-3)** — `fa-list-check`, `util-checklist-block` |
| B26-055 | Configurable worksheet intro (not hard-coded) | P2 | analysis/impact table path |

See gap audit in [`renderer-kitchen-sink-fixture-design.md`](renderer-kitchen-sink-fixture-design.md) §5.

---

## Slice mapping (proposed)

| Slice | Backlog IDs |
|-------|-------------|
| **26-1** | Audit all P0; confirm priorities |
| **26-2** | B26-001–005, B26-010/014/023 (partial), B26-030 (partial) — **complete** |
| **26-3** | Fallback safety, metadata fold, B26-054 — **complete** |
| **26-3b** | B26-010–016, B26-033 (residual polish) |
| **26-4** | B26-003, 010–016 (partial), 021, 033–034 (partial), 042 (partial) — **complete** |
| **26-5** | B26-003, 011–016 (partial), 012, 020 (partial), 021, 030 (partial), assessment identity — **complete** |
| **26-6** | B26-040–045, B26-022, B26-031–034 (optional) |

---

## Audit template (26-1)

Use when reviewing rendered inflation workshop HTML:

| Area | Observation | Backlog ID |
|------|-------------|------------|
| Section gaps | | |
| Activity blocks | | |
| A2 table + prompts | | |
| A1 task cards | | |
| Metadata fold | | |
| Print preview | | |
