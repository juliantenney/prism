# Sprint 26 review log

**Pack:** `docs/development/sprints/2026-05-20-sprint-26-renderer-presentation-consolidation/`  
**Decisions:** R26-001+

---

## 2026-05-20 — Sprint 26 open

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R26-001 | Sprint 26 scope is **presentation-only**; composition and export contracts are **frozen** | Sprint 25 closed with live A1–A5 validation |
| R26-002 | **Inflation workshop full fixture** is the primary renderer benchmark | Dense mixed materials; existing regression tests |
| R26-003 | Renderer governance lives in [`renderer-governance.md`](renderer-governance.md) (this pack), superseding Sprint 25 investigation §8 draft | 25-4 governance deferred; 26-1 delivers it |
| R26-004 | Composition tests (`utility-page-composition-closure.test.js`) are **guardrails** — must not be weakened for presentation work | Preserve Sprint 25 closure semantics |
| R26-005 | Optional enhancements require backlog item + mini-charter before implementation | Prevents scope creep into semantics |
| R26-006 | **26-1 first:** audit + backlog before CSS/material code changes | Evidence-led presentation refinements |

### Artefacts

| Artefact | Path |
|----------|------|
| Charter | [`sprint-26-charter.md`](sprint-26-charter.md) |
| Governance | [`renderer-governance.md`](renderer-governance.md) |
| Backlog | [`renderer-refinement-backlog.md`](renderer-refinement-backlog.md) |

**Pack/runtime delta:** None at sprint open (documentation only).

---

## Status

**Sprint 26 open.** **26-1:** kitchen sink + audit. **26-2:** spacing/hierarchy/density (**238** tests). **26-3:** fallback/structural cleanup (**244** tests). **26-4:** professional polish (**246** tests). **26-5:** typographic finish (**248** tests).

---

## 2026-05-20 — Renderer kitchen sink fixture planning

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R26-007 | **`renderer-kitchen-sink-page.json`** is synthetic renderer QA only | Not composition contract |
| R26-008 | Materials embedded in `learning_activities.content[]` (no separate `activity_materials` section) | Matches strict export; avoids probe confusion |
| R26-009 | Keep **inflation full** + **kitchen sink** as dual benchmarks | Fidelity vs coverage |
| R26-010 | Smoke tests assert patterns, not composition closure | Closure tests remain frozen |
| R26-011 | Gap audit: mapped outcomes not renderer-aware; remainder keys weak | Guides 26-3/26-5 |

### Artefacts

| Artefact | Path |
|----------|------|
| Design note | [`renderer-kitchen-sink-fixture-design.md`](renderer-kitchen-sink-fixture-design.md) |
| Fixture | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` |
| Tests | `tests/utility-renderer-kitchen-sink.test.js` |

---

## 2026-05-20 — Slice 26-2: spacing, hierarchy, density

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R26-012 | Presentation overrides live in **`getUtilityPagePresentationCssV26_2()`** appended to existing export `<style>` blocks | Reusable class-level fixes; no fixture-specific hacks |
| R26-013 | Wide tables wrapped in **`.util-table-scroll`** at HTML emit time | B26-004; narrow viewport scroll without changing table semantics |
| R26-014 | Print rules use **`break-inside:avoid-page`** on activities and dense material blocks (KS-A3) | Partial B26-030; avoids mid-card splits without hiding content |
| R26-015 | LO export inherits the same v26-2 CSS append as single-page export | Presentation parity baseline (full LO chrome polish deferred B26-034) |

### Before / after (visual)

Validated against kitchen sink HTML, with emphasis on **KS-A3** (six task cards, four scenarios, comparison table, long prompt set):

- **Before:** Section and material headings felt stacked; nested cards added perceived double padding; tables could clip; output and support notes read as one block.
- **After:** Clearer section → activity → material hierarchy; card grid breathes on wide viewports and stacks at 720px; tables scroll horizontally in preview; print avoids breaking inside activity shells.

### Artefacts

| Artefact | Path |
|----------|------|
| Slice charter | [`slice-26-2-charter.md`](slice-26-2-charter.md) |
| CSS helper | `app.js` — `getUtilityPagePresentationCssV26_2`, `utilityWrapExportTableHtml` |
| Tests | `tests/utility-renderer-kitchen-sink.test.js` (+2 presentation smoke tests) |

**Pack/runtime delta:** Presentation CSS + table wrapper only. **238** tests passing.

---

## 2026-05-20 — Slice 26-3: fallback safety and structural cleanup

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R26-016 | Scalar coercion guard in `firstNonEmpty` (skip objects); structured export via `utilityRenderExportFieldValue` | Eliminates `[object Object]` without dropping nested content |
| R26-017 | Metadata `section_id` renders in **`util-meta` only**; array body render returns empty for metadata entries | Fixes duplication side-effect when metadata section was removed from render array (inflation A3 card count) |
| R26-018 | Checklist uses `util-checklist-block` + `fa-list-check` | Visual/semantic distinction from `util-prompt-set` |
| R26-019 | Removed hard-coded worksheet scenario instruction | Presentation must not invent pedagogy |

### Before / after

- **Timeline:** learner/facilitator object fields render as structured blocks, not `[object Object]`.
- **Metadata:** no duplicate `Production Metadata` h2 in page body when `generation_notes` also appear in fold.
- **Inflation workshop:** scenario card counts unchanged (4 + 3); full regression green.

### Artefacts

| Artefact | Path |
|----------|------|
| Slice charter | [`slice-26-3-charter.md`](slice-26-3-charter.md) |
| Tests | `tests/utility-renderer-kitchen-sink.test.js` (+6) |

**Pack/runtime delta:** Structural renderer helpers + metadata fold rule. **244** tests passing.

---

## 2026-05-20 — Slice 26-4: professional renderer polish

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R26-020 | v26-4 polish in **`getUtilityPagePresentationCssV26_4()`**, exported via **`getUtilityPagePresentationCss()`** | Separates rhythm (26-2) from hierarchy/icon/card polish (26-4); both paths append to export `<style>` |
| R26-021 | **Linked-journey** sequence rows use timeline wrapper/classes when simple; **`util-task-block`** when rich linked materials present | Timeline no longer reads as generic activity cards on kitchen sink / inflation sequence sections |
| R26-022 | **`utilityRenderIconHeading`** always includes **`util-icon-heading`** | Single alignment model for section, material, output, support, and meta summary headings |
| R26-023 | Kitchen sink 26-4 tests assert **CSS class markers** (timeline wrapper, material heading rules, `util-meta`) — not function names or pixels | Durable structural expectations per governance |

### Before / after (visual)

Validated against kitchen sink HTML, with inflation full fixture regression:

- **Before:** Icon gaps uneven; material `h4` competed with activity titles; session timeline resembled task cards; tables and metadata fold felt functional but basic.
- **After:** Calmer heading tiers; aligned icon headings; timeline stack with meta/title treatment; table wrapper and metadata card polish; LO export inherits full presentation CSS.

### Artefacts

| Artefact | Path |
|----------|------|
| Slice charter | [`slice-26-4-charter.md`](slice-26-4-charter.md) |
| CSS helpers | `app.js` — `getUtilityPagePresentationCssV26_4`, `getUtilityPagePresentationCss` |
| Tests | `tests/utility-renderer-kitchen-sink.test.js` (+2) |

**Pack/runtime delta:** Presentation CSS + timeline HTML classes only. **246** tests passing.

---

## 2026-05-20 — Slice 26-5: typographic refinement and presentation finish

### Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| R26-024 | v26-5 in **`getUtilityPagePresentationCssV26_5()`**, composed after v26-2/v26-4 | Final polish layer without rewriting prior slices |
| R26-025 | Assessment uses **`util-assessment-item`** (+ section/list wrappers); retains `util-task-block` | Distinct formative-check identity; no composition change |
| R26-026 | Metadata summary → **“Document information”**; folded section `h3` still uses fixture heading (**Production Metadata**) | Professional footer affordance; inflation/kitchen sink metadata strings preserved in fold body |
| R26-027 | `utility-page-render` fold test accepts summary or section metadata label | Summary label change must not break metadata fold smoke |

### Before / after

- **Icons:** centre-aligned flex rows replace per-icon margin-top nudges on headings and meta summary.
- **Assessment:** numbered items, teal accent, explanation/answer blocks — no longer indistinguishable from activity cards.
- **Timeline:** numbered step markers on left rail; white step cards vs flat dashed blocks.
- **Print:** shadows stripped on cards/timeline/assessment for cleaner grayscale output.

### Artefacts

| Artefact | Path |
|----------|------|
| Slice charter | [`slice-26-5-charter.md`](slice-26-5-charter.md) |
| CSS | `app.js` — `getUtilityPagePresentationCssV26_5` |
| Tests | `tests/utility-renderer-kitchen-sink.test.js` (+2) |

**Pack/runtime delta:** Presentation CSS + assessment HTML classes only. **248** tests passing.
