# Slice 31-4 charter — Worked-example & material rendering polish

**Status:** **Complete** (implemented 2026-06-01 — R31-005)  
**Slice:** 31-4  
**Date:** 2026-06-01

**Parent:** [`sprint-31-charter.md`](sprint-31-charter.md) §5–6  
**Predecessors:** [31-1](slice-31-1-charter.md) (R31-002), [31-2](slice-31-2-charter.md) (R31-003), [31-3](slice-31-3-charter.md) (R31-004)

---

## Goal

Improve **presentation consistency, readability, and calmness** of **worked examples**, **activity materials**, **markdown/pipe tables**, **templates**, and **prompt sets** in rendered learner pages — so dense GAM content feels **intentionally presented**, not raw object dumps — while **preserving every word, row, and ordering** already in JSON.

**Governance line (non-negotiable):** The renderer may **normalise presentation** of already-structured or clearly parseable material; it must **not** rewrite, complete, infer, or pedagogically improve examples.

---

## Problem (observed)

Programme charter §4 and post–31-3 probes note remaining **material-layer** inconsistency. Slices 31-1–31-3 improved metadata, cue hierarchy, and knowledge-summary patterns; **activity materials** are still the main source of “assembled” feel:

| Issue | Observation |
|-------|-------------|
| **Pipe-table soup** | Markdown pipe tables sometimes appear as inline paragraphs or broken `<p>` fragments instead of `<table>` inside `.util-table-scroll` ([`sprint-31-charter.md`](sprint-31-charter.md) §4) |
| **Worked examples in wrong chrome** | Example/template strings embedded in cards or generic object dumps rather than calm worked-example blocks |
| **Material type collision** | `.util-prompt-set`, `.util-template-block`, `.util-task-card`, `.util-scenario-card` share similar weight — hard to scan which is “fill this in” vs “read this” |
| **Long materials dominate cards** | RNA live activities carry large `reference_text` / table templates inside `.util-activity-materials` — weak separation from **What to do** ([`probe-31-04-rna-render-notes.md`](context-files/probe-31-04-rna-render-notes.md)) |
| **Template note lines** | `.util-template-note-line` placeholders exist but rhythm varies by path |
| **Generic object fallback** | Unknown material keys → `renderMaterialValue` / `utilityRenderObject` — can read as arbitrary key–value dumps |
| **Separator artefacts** | Marx `comparison_prompts` markdown `---` fragments (partially normalised in 31-2-era tests) — material paths may still leak pipe/separator noise |
| **Tables “generally strong”** | Need header rhythm, scroll wrapper consistency, print-friendly polish ([`sprint-31-charter.md`](sprint-31-charter.md)) |
| **Rubric row 11** | “Tables and worked examples render cleanly (no raw pipe soup)” — **open** on Marx + kitchen-sink |

**31-3 resolved:** knowledge-summary wrappers (`.util-knowledge-summary`, `.util-definition-list`). **31-4 targets:** materials inside activity cards and section-level markdown tables only.

---

## In scope

| Item | Detail |
|------|--------|
| **R-layer only** | `renderMaterialsForActivity`, `renderMaterialValue`, `utilityRenderObject`, `utilityRenderArray`, `utilityWrapExportTableHtml`, `sanitizeUtilityHtmlOutput`, embedded CSS |
| **Markdown / pipe tables** | Consistent `.util-table-scroll` + `<table>` when content is already parseable; no new table inference from non-tabular prose |
| **Template blocks** | Calmer `.util-template-block` rhythm; optional wrapper e.g. `.util-worked-template` where structurally identifiable |
| **Prompt sets** | `.util-prompt-set` de-emphasised vs primary task; preserve list semantics |
| **Worked-example presentation** | Stable class/wrapper for example-like material keys (`examples`, `worked_example`, template+table combos) **without** changing text |
| **Card materials** | `.util-task-card`, `.util-scenario-card`, checklists — spacing, headings, subordinate to `.util-activity-task--primary` |
| **Material stack wrapper** | Optional `.util-materials-stack` / `.util-material-block` grouping inside `.util-activity-materials` |
| **Pipe-text normalisation** | Extend existing separator/table detection in material markdown paths and `sanitizeUtilityHtmlOutput` — **presentation only** |
| **Print / export** | Extend existing `@media print` rules for tables and material blocks where already present |
| **Tests** | kitchen-sink, page-render (`shape-markdown-table.json`), Marx materials; optional small worked-example fixture |
| **Manual review** | Marx + kitchen-sink + RNA materials scope; rubric **row 11**; probes `probe-31-07-*.md`, `probe-31-08-*.md` (on implement) |

### Material kinds (implementation map)

| Kind | Existing hooks | 31-4 intent |
|------|----------------|-------------|
| **Markdown table** | `utilityWrapExportTableHtml`, pipe parsing in `renderMaterialValue` / `utilityRenderObject` | Always scroll-wrapped; calm header/body typography |
| **Template / worksheet** | `.util-template-block`, `.util-template-note-line` | Clear fill-in rhythm; distinguish from prose |
| **Prompt set** | `.util-prompt-set`, `utilityRenderPromptSetHeading` | Secondary to task; consistent padding |
| **Task / scenario cards** | `.util-task-card`, `.util-scenario-card` | Predictable card spacing under material heading |
| **Checklist** | `.util-checklist-block`, `.util-checkbox-list` | No regression (Marx tests) |
| **Reference / long text** | String materials in RNA/Marx | Calm prose block inside `.util-material-prose` (or equivalent), not mistaken for table |
| **Unknown material** | `.util-generic-material-icon`, generic heading | Softer fallback chrome — still render all keys |

---

## Out of scope (31-4)

| Excluded | Notes |
|----------|--------|
| **Completing partial examples** | No filling blank cells, no invented row/column labels |
| **Rewriting material prose** | No copy edits to learner-facing strings |
| **Pedagogic enhancement** | No summaries, hints, or “better” explanations |
| **Concept / knowledge-summary** | Slice **31-3** — do not regress `.util-knowledge-summary` |
| **Cue hierarchy** | Slice **31-2** — framing/task CSS frozen except incidental spacing in materials section |
| **Metadata fold** | Slice **31-1** |
| **Density / dedupe** | Slice **31-5** — no omitting duplicate material vs task text |
| **Assessment MCQ layout** | Slice **31-6** — regression tests only |
| **JSON / schema / generation / composition** | No upstream changes |
| **PEC / metacognition / workflow** | Frozen |
| **Adaptive display** | No learner modelling |
| **New diagram/chart pipelines** | Out of programme scope |

---

## Current behaviour (baseline)

### Primary code paths

| Function | Role |
|----------|------|
| `renderMaterialsForActivity` | ~25560 — dispatches material keys: cards, scenarios, templates, checklists, tables |
| `renderMaterialValue` | ~25991 — markdown strings, nested objects, table extraction |
| `utilityRenderObject` / `utilityRenderArray` | Column-row tables, structured shapes, fallbacks |
| `utilityWrapExportTableHtml` | ~29282 — wraps `<table>` in `.util-table-scroll` |
| `sanitizeUtilityHtmlOutput` | ~30508 — post-process lists, template lines, checkbox lists, adjacent `<ul>` merge |
| `getUtilityPagePresentationCssV26_2` / `V26_4` / `V26_5` | Table scroll, prompt-set, template-block, material heading rules |
| `getUtilityPagePresentationCssV31_2` / `V31_3` | Prior slices — do not weaken |

### Existing CSS (representative)

| Class | Current role |
|-------|----------------|
| `.util-table-scroll` | Horizontal scroll; border in v26_5 |
| `.util-template-block` | Dashed border, note lines |
| `.util-prompt-set` | Blue-tinted block |
| `.util-task-card` / `.util-scenario-card` | Left-border cards |
| `.util-activity-materials` | Border-top separator under task |
| `.util-material-heading` | Icon headings for material subsections |

### Existing tests

| Test / fixture | Guards |
|----------------|--------|
| `utility-renderer-kitchen-sink.test.js` | Core patterns, `util-table-scroll` count, template+table split, pipe→table |
| `utility-page-render.test.js` | `shape-markdown-table.json`, table/list semantics |
| `utility-marx-page-render.test.js` | Checklist, comparison separators, material headings |
| `utility-ld-rna-assessment-page-render.test.js` | Assessment + 31-1/31-2/31-3 regression |
| `shape-markdown-table.json` | Minimal section-level pipe table |

**Gaps to close in 31-4:** unified material-stack wrapper; worked-example vs template vs prompt visual tiers; rubric row 11 on Marx/kitchen-sink; RNA long-material calmness (manual).

---

## Design intent

### Visual hierarchy (within activity card)

| Tier | Elements | Intent |
|------|----------|--------|
| **Primary** | `.util-activity-task--primary` | Unchanged anchor (31-2) |
| **Secondary** | Materials block container | Clearly “resources for the task” |
| **Tertiary** | Templates, tables, prompts, examples | Typed chrome — readable, not noisy |
| **Background** | Generic/unknown material keys | Softest — still complete |

### Presentation rules

1. **Preserve text** — all material strings and table cell values appear in HTML.  
2. **Preserve order** — material key iteration and array order unchanged unless existing code already reorders (document in review-log if touched).  
3. **Parse, don’t invent** — only promote pipe/markdown to `<table>` when existing parsers succeed.  
4. **Typed wrappers** — add classes at **existing structural boundaries** (template block, prompt set, table scroll), not by guessing pedagogy from prose.  
5. **Calm tables** — thead rhythm, cell padding, print overflow visible.  
6. **No new headings** that introduce pedagogic labels not already implied by material keys/headings — may refine `prettyMaterialHeading` display styling only.  
7. **Subordinate materials** — more top margin/padding separation from primary task; lighter borders than task card.

### Resolved programme decision (R31-005 candidate)

**Slice 31-4 = renderer presentation polish only** — no rewriting, inference, completion, schema change, or generation-layer work.

---

## Acceptance criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-1 | All existing material content in kitchen-sink + Marx fixtures still renders | kitchen-sink, Marx tests |
| AC-2 | Parseable markdown/pipe tables use `.util-table-scroll` + `<table>` | `shape-markdown-table.json`, kitchen-sink table tests |
| AC-3 | Template, prompt, and card structures retain distinguishable classes | Regex on HTML; no class rename without test update |
| AC-4 | Material **wording and order** preserved | Marx comparison prompt strings; kitchen-sink material titles |
| AC-5 | **No new educational text** in output | Negative assertion: no placeholder instructional sentences added by renderer |
| AC-6 | **No** generation/composition/schema changes | Diff scope review |
| AC-7 | **31-1** metadata intact | `About this page`, `util-meta`, no Audience in learner body |
| AC-8 | **31-2** cue hierarchy intact | `.util-activity-framing`, `.util-activity-task--primary`, cue order tests |
| AC-9 | **31-3** knowledge-summary intact | `.util-knowledge-summary`, `.util-definition-list` on Marx/kitchen-sink |
| AC-10 | Rubric **row 11** pass on Marx + kitchen-sink | [`probe-31-07-marx-material-notes.md`](context-files/probe-31-07-marx-material-notes.md) (create on implement) |
| AC-11 | Full suite **≥ 485** pass / **0** fail | `node --test tests/*.test.js` |
| AC-12 | Embedded CSS documents material/table hierarchy (testable substrings) | e.g. `.util-materials-stack`, `.util-table-scroll` rule refinements |

---

## Implementation checklist

- [x] Audit `renderMaterialsForActivity` / `renderMaterialValue` branches for table, template, prompt, example keys
- [x] Audit `sanitizeUtilityHtmlOutput` for pipe-table and separator edge cases (align with Marx tests)
- [x] Add optional `.util-materials-stack` / material-type modifiers without changing dispatch order
- [x] Add `getUtilityPagePresentationCssV31_4()` — tables, templates, prompts, material spacing
- [x] Confirm print rules for `.util-table-scroll` and material blocks
- [x] Extend tests — every CSS/wrapper change paired with assertion
- [x] Optional `shape-worked-example-template.json` **only if** kitchen-sink lacks worked-example coverage (skipped — kitchen-sink sufficient)
- [x] Manual probes Marx + kitchen-sink (row 11); RNA materials note in probe-31-08
- [x] Record **R31-005** in [`review-log.md`](review-log.md)
- [x] Update [`CURRENT-STATE.md`](CURRENT-STATE.md), [`baseline-test-floor.md`](baseline-test-floor.md) if test count changes
- [x] Update [`context-files/renderer-hooks.md`](context-files/renderer-hooks.md)

---

## Regression guards

| Page / suite | Test file | Expect |
|--------------|-----------|--------|
| Kitchen-sink materials | `tests/utility-renderer-kitchen-sink.test.js` | Tables, templates, prompts, PEL sections |
| Markdown table shape | `tests/utility-page-render.test.js` | Table preserved, no list nesting |
| Marx materials | `tests/utility-marx-page-render.test.js` | Checklist, separators, headings, 31-3 knowledge |
| RNA assessment | `tests/utility-ld-rna-assessment-page-render.test.js` | Assessment + 31-1/31-2/31-3 |
| PEL framing | `tests/utility-self-directed-activity-framing.test.js` | Unchanged |
| Cognition fields | `tests/utility-renderer-cognition-fields.test.js` | Unchanged |
| Workshop inflation | `tests/utility-ld-inflation-page-render.test.js` | Facilitated regression |
| Self-directed formatting | `tests/workflow-self-directed-learner-page-formatting.test.js` | Do not extend unless regression |

---

## Manual review rubric focus

Primary: [`presentation-review-rubric.md`](context-files/presentation-review-rubric.md)

| Rows | Focus |
|------|--------|
| **11** | **Primary** — tables and worked examples clean; no raw pipe soup |
| **1–3** | Regression — page calmness after material polish |
| **4–5** | Regression — task/cue hierarchy (31-2) |
| **7–9** | Regression — metadata (31-1) |
| **10** | Regression — knowledge-summary (31-3) |
| **13–14** | All material text present; no facilitator leakage |

**Evidence:** [`evidence-pages-marx-rna.md`](context-files/evidence-pages-marx-rna.md) — **P31-01 Marx** (comparison table materials), **P31-02 RNA** (long reference_text in cards), kitchen-sink synthetic.

**Note:** User pack read list references `probe-31-05-marx-knowledge-summary-notes.md` / `probe-31-06-rna-knowledge-summary-notes.md`; actual 31-3 probes are [`probe-31-05-marx-render-notes.md`](context-files/probe-31-05-marx-render-notes.md), [`probe-31-06-kitchen-sink-knowledge-notes.md`](context-files/probe-31-06-kitchen-sink-knowledge-notes.md).

---

## Tests likely extended

| File | Planned assertions |
|------|-------------------|
| `tests/utility-renderer-kitchen-sink.test.js` | Material stack wrapper; table/template tier CSS; no pipe paragraphs in table sections |
| `tests/utility-page-render.test.js` | `shape-markdown-table.json` + optional new shape fixture |
| `tests/utility-marx-page-render.test.js` | Material wrappers; separator/table stability |
| `tests/utility-ld-rna-assessment-page-render.test.js` | 31-1/31-2/31-3 smoke; materials render without regression |

**Optional fixture:** `tests/fixtures/page-render/shape-worked-example-template.json` — template heading + pipe table + prompt line (only if kitchen-sink insufficient).

**Pattern:** class names, text preservation, table structure, CSS in `<style>` — not screenshots.

---

## Files likely touched (implementation phase only)

| File | Change |
|------|--------|
| `app.js` | `renderMaterialsForActivity`, `renderMaterialValue`, `sanitizeUtilityHtmlOutput`, `getUtilityPagePresentationCssV31_4` |
| `tests/utility-renderer-kitchen-sink.test.js` | Material/table assertions |
| `tests/utility-page-render.test.js` | Table shape + optional fixture |
| `tests/utility-marx-page-render.test.js` | Material polish smoke |
| `tests/utility-ld-rna-assessment-page-render.test.js` | Regression smoke |
| `tests/fixtures/page-render/shape-worked-example-template.json` | Optional |
| Sprint 31 docs | CURRENT-STATE, review-log, probes, baseline, renderer-hooks |

---

## Success rubric (manual)

| Question | Pass |
|----------|------|
| Would a learner mistake a pipe table for broken prose? | **No** |
| Can they tell template vs prompt vs reference text apart? | **Yes** (where structurally present) |
| Is every material string from JSON still on the page? | **Yes** |
| Does the page stay calm with 31-1–31-3 improvements? | **Yes** |

---

**Implemented 2026-06-01 (R31-005).**
