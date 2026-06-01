# Slice 31-3 charter — Concept / knowledge-summary consistency

**Status:** **Complete** (2026-06-01 — R31-004)  
**Slice:** 31-3  
**Date:** 2026-06-01

**Parent:** [`sprint-31-charter.md`](sprint-31-charter.md) §5–6  
**Predecessors:** [Slice 31-1 complete](slice-31-1-charter.md) (R31-002), [Slice 31-2 complete](slice-31-2-charter.md) (R31-003)

---

## Goal

Make **concept-like** and **knowledge-summary** content render with a **calm, consistent, learner-facing pattern** across domains (humanities, STEM, future quantitative pages), so pages feel **intentionally authored** rather than arbitrary object dumps — while **preserving every term, definition, relationship string, and ordering** present in JSON.

**Governance line (non-negotiable):** The renderer may choose a **calmer display pattern** for concept-like structures; it must **not** infer, rewrite, rank, merge, summarise, or synthesise concepts.

---

## Problem (observed)

Programme charter ([`sprint-31-charter.md`](sprint-31-charter.md) §4) and Sprint 30 retrospective note inconsistent knowledge presentation. After 31-1 (metadata) and 31-2 (cue hierarchy), **concept sections remain the main visual inconsistency**:

| Issue | Observation |
|-------|-------------|
| **Shape-dependent output** | Same pedagogic intent renders differently for `knowledge_summary` as **object** (`concepts[]`), **array** of rows, or **prose** string — learners see different chrome |
| **Generic structured blocks** | Term/definition pairs use `.util-structured-block` with inline `<strong>Term:</strong>` — works but no shared **knowledge-summary** rhythm |
| **Renderer subheadings** | `renderKnowledgeSummaryBlocks` injects fixed `<h3>Concepts</h3>` / `<h3>Relationships</h3>` — not always aligned with section heading (e.g. “Key Knowledge Summary”) |
| **Key field variance** | Rows accept `name`, `term`, `concept`, `key_concept` + `definition` / `summary` / `explanation` — output pattern should be **consistent** regardless of which key supplied |
| **Relationships placement** | `relationships` string on object summaries renders as separate block; styling not visually tied to concept list |
| **Marx fixture** | Object shape with `concepts` + `relationships` — [`marx-self-study-page.json`](../../../tests/fixtures/page-render/marx-self-study-page.json); test guards no `<h3>` inside `<li>` ([`utility-marx-page-render.test.js`](../../../tests/utility-marx-page-render.test.js)) |
| **Kitchen-sink** | Dual sections `knowledge_summary` + `knowledge_summary_array` — partial coverage ([`renderer-kitchen-sink-page.json`](../../../tests/fixtures/page-render/renderer-kitchen-sink-page.json)) |
| **RNA assessment fixture** | No `knowledge_summary` section — rubric row 10 validated primarily on **Marx** + kitchen-sink; RNA live may use overview prose (out of scope unless already routed through knowledge path) |
| **Rubric row 10** | “Knowledge summary / concept lists use one visual pattern” — **not yet Pass** on representative pages |

---

## In scope

| Item | Detail |
|------|--------|
| **R-layer only** | `renderKnowledgeSummaryBlocks`, `utilityRenderDefinitionStyleBlock`, `utilityRenderStructuredObjectShape` (term/definition path), `utilityRenderPageSections` knowledge branch, embedded CSS |
| **Knowledge-summary wrapper** | Consistent outer wrapper (e.g. `.util-knowledge-summary`) around section body from `renderKnowledgeSummaryBlocks` |
| **Concept list rhythm** | Shared list/container (e.g. `.util-concept-list`) for ordered concept rows — **preserve array order** |
| **Term–definition presentation** | One readable pattern for term/definition pairs (existing wording; may use `.util-concept-item` on or beside `.util-structured-block`) |
| **Relationships block** | Consistent presentation for `relationships` / `relationship` / `connections` scalars (e.g. `.util-knowledge-relationships`) |
| **Object / array / prose shapes** | Route all `knowledge_summary` (and heading-matched) content through the same visual system where feasible |
| **Prose-only summary** | String or markdown block inside knowledge section — calm paragraph/list pattern, no new prose |
| **Section dispatch** | `looksKnowledgeSummarySection` + `section_id: knowledge_summary` paths in `utilityRenderPageSections` (~28965, ~29147) |
| **CSS** | Typography, spacing, borders for concept scan — in `getUtilityPagePresentationCss()` (new `V31_3` block acceptable) |
| **Tests** | Extend kitchen-sink, page-render, Marx; optional **shape fixture** only if prose-only case lacks coverage |
| **Manual review** | Marx live + kitchen-sink; rubric row **10**; confirm 31-1/31-2 unchanged — probes `probe-31-05-*.md`, `probe-31-06-*.md` (on implement) |

### Shape coverage matrix (implementation target)

| JSON shape | Example source | Target |
|------------|----------------|--------|
| Object + `concepts[]` | Marx fixture | Wrapper + concept list + relationships |
| Object + `items[]` / `key_concepts[]` | Alternate generators | Same list pattern |
| Array of term/definition objects | Kitchen-sink `knowledge_summary_array` | Same row pattern as object concepts |
| Prose / markdown string | Future stats page; add fixture if missing | `.util-knowledge-summary-prose` (or equivalent), no invented bullets |
| Single lone concept object | `renderKnowledgeSummaryBlocks` fallback | Same term–definition pattern |

---

## Out of scope (31-3)

| Excluded | Notes |
|----------|--------|
| **Inferring or generating concepts** | No new terms, definitions, or relationships |
| **Rewording** | No copy edits to learner-facing concept prose |
| **Ranking / merging / deduping concepts** | Slice **31-5** |
| **JSON / schema / generation / composition** | No upstream changes |
| **PEC / metacognition / workflow** | Frozen |
| **Table / pipe-text / template polish** | Slice **31-4** — touch materials only if concept content incorrectly routes through material renderer (bugfix) |
| **Assessment MCQ layout** | Slice **31-6** |
| **Cue hierarchy regression** | Slice **31-2** — do not alter framing/task CSS except incidental spacing |
| **Metadata boundary** | Slice **31-1** — `util-meta` unchanged |
| **Converting non-concept sections** | Do not treat activities, materials, or assessment as concepts |
| **Adaptive display** | No learner modelling |

---

## Current behaviour (baseline)

### Primary code paths

| Function | Role |
|----------|------|
| `renderKnowledgeSummaryBlocks` | ~24555–24632 — parses object/array; maps rows; emits `<h3>Concepts</h3>`, concept HTML, `<h3>Relationships</h3>` |
| `utilityRenderDefinitionStyleBlock` | ~23786 — `<article class="util-structured-block">` + `<strong>term:</strong> definition` |
| `utilityRenderStructuredObjectShape` | ~23488 — `term_definition`, heading/body pairs, misconception shapes |
| `utilityDetectStructuredObjectShape` | `term` + `definition` → `term_definition` |
| `utilityRenderPageSections` | Dispatches `looksKnowledgeSummarySection` → `renderKnowledgeSummaryBlocks` |
| `renderSectionHeadingH2` | Section icon `util-section-icon--knowledge-summary` |

### Row rendering order (preserved today)

1. Filter/normalise rows from `concepts`, `items`, `key_concepts`, or array root.  
2. `rows.map(renderKnowledgeSummaryRow)` — **order preserved**.  
3. Append relationships scalar after concept blocks.

### Existing tests

| Test | Guards |
|------|--------|
| `utility-marx-page-render.test.js` | Key Knowledge Summary; `util-structured-block`; no `<li><h3>` stacks |
| `utility-renderer-kitchen-sink.test.js` | Object + array knowledge sections; structured blocks |
| `utility-page-render.test.js` | General page shapes (extend for knowledge-summary CSS) |
| `utility-ld-rna-assessment-page-render.test.js` | No knowledge section today — regression only for 31-1/31-2 |

**Gaps to close in 31-3:** unified wrapper/classes; calmer CSS; prose shape test if missing; rubric row 10 on Marx + kitchen-sink.

---

## Design intent

### Learner scan pattern

1. **Section H2** — existing `util-section-heading` (unchanged icon/heading from JSON).  
2. **Knowledge body wrapper** — single `.util-knowledge-summary` container.  
3. **Concept list** — vertical stack of term/definition items; term visually scannable (weight/size), definition readable.  
4. **Relationships** — subordinate block below concepts; not mistaken for a fourth “concept card”.  
5. **Prose summaries** — plain calm typography inside same wrapper when no concept rows.

### Presentation rules

1. **Preserve text** — all strings from JSON appear in HTML (minus existing empty-value skips).  
2. **Preserve order** — `concepts[]` / array order unchanged.  
3. **Preserve keys semantically** — `name` vs `term` vs `concept` map to same visual row, not renamed in output.  
4. **Do not add concepts** — empty arrays stay empty; no placeholder definitions.  
5. **Subheadings** — may retain “Concepts” / “Relationships” **or** replace with class-only structure if tests updated; do **not** inject new pedagogic labels beyond existing renderer subheadings without charter note in review-log.  
6. **Reuse structured-block** — extend with modifiers (e.g. `.util-structured-block.util-concept-item`) rather than duplicate render logic where possible.  
7. **Calm chrome** — lighter borders/background than activity task card; distinct from `.util-cognition` and `.util-activity-framing`.

### Resolved programme decision (R31-004 candidate)

**Slice 31-3 = renderer presentation consistency only** — no inference, rewriting, ranking, synthesis, schema change, or generation-layer work.

---

## Acceptance criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-1 | `knowledge_summary` content still renders when present in JSON | Marx fixture, kitchen-sink object + array sections |
| AC-2 | Object, array, and prose shapes use shared wrapper/class hooks where feasible | Assertions on `.util-knowledge-summary` (and list/relationships classes) in HTML |
| AC-3 | Term–definition pairs readable; **wording unchanged** | Snapshot of Marx concept strings; `Karl Marx`, `Class Struggle`, etc. |
| AC-4 | Concept **order preserved** | Fixture order matches HTML order (index assertions) |
| AC-5 | **No new concept text** invented in render output | Negative check: no placeholder “Definition TBD” patterns |
| AC-6 | **No** `app.js` generation/composition changes; **no** fixture JSON edits unless new shape-only fixture added | Review diff scope |
| AC-7 | **31-1 intact** — `About this page`, `util-meta`, no Audience in learner body | Existing 31-1 tests |
| AC-8 | **31-2 intact** — `.util-activity-framing`, `.util-activity-task--primary`, cue order | Existing 31-2 tests |
| AC-9 | Marx + kitchen-sink support rubric **row 10** | [`probe-31-05-marx-render-notes.md`](context-files/probe-31-05-marx-render-notes.md) (create on implement) |
| AC-10 | Full suite **≥ 481** pass / **0** fail | `node --test tests/*.test.js` |
| AC-11 | Embedded CSS documents hierarchy (testable rule substrings) | e.g. `.util-knowledge-summary`, `.util-concept-list` in `<style>` |

---

## Implementation checklist

- [x] Audit all entry points to `renderKnowledgeSummaryBlocks` (object map + sections array)
- [x] Wrapper/classes in `renderKnowledgeSummaryBlocks` / `utilityRenderDefinitionStyleBlock` (`knowledgeSummary` opt)
- [x] `getUtilityPagePresentationCssV31_3()` — concept list, relationships, prose
- [x] Prose scalar path + `shape-knowledge-summary-prose.json`
- [x] `looksKnowledgeSummarySection` — `knowledge_summary_*` section ids
- [x] Tests (+4); floor **485**
- [x] Probes 31-05 / 31-06
- [x] **R31-004** recorded
- [x] CURRENT-STATE, baseline-test-floor, renderer-hooks updated

---

## Regression guards

| Page / suite | Test file | Expect |
|--------------|-----------|--------|
| Marx knowledge summary | `tests/utility-marx-page-render.test.js` | Concepts present; no nested heading stacks in lists |
| Kitchen-sink KS shapes | `tests/utility-renderer-kitchen-sink.test.js` | Object + array sections; PEL/KS sections unchanged |
| Page shapes | `tests/utility-page-render.test.js` | No list/table regressions |
| RNA assessment | `tests/utility-ld-rna-assessment-page-render.test.js` | Assessment + 31-1/31-2 |
| PEL framing | `tests/utility-self-directed-activity-framing.test.js` | Unchanged |
| Cognition | `tests/utility-renderer-cognition-fields.test.js` | Unchanged |
| Workshop inflation | `tests/utility-ld-inflation-page-render.test.js` | Facilitated regression |
| Workflow PEL | `tests/workflow-pel-reasoning.test.js` | Do not extend for 31-3 |

---

## Manual review rubric focus

Primary: [`presentation-review-rubric.md`](context-files/presentation-review-rubric.md)

| Rows | Focus |
|------|--------|
| **10** | **Primary** — one visual pattern for knowledge summary / concepts |
| **1–3** | Regression — page still calm after concept styling |
| **4–5** | Regression — task/cue hierarchy from 31-2 |
| **7–9** | Regression — metadata from 31-1 |
| **13–14** | All concept text from JSON still visible; no facilitator leakage |

**Evidence pages:** [`evidence-pages-marx-rna.md`](context-files/evidence-pages-marx-rna.md) — **P31-01 Marx** primary; **P31-02 RNA** optional for row 10 if knowledge section absent.

---

## Tests likely extended

| File | Planned assertions |
|------|-------------------|
| `tests/utility-renderer-kitchen-sink.test.js` | Wrapper/classes on object + array knowledge sections; CSS markers; existing anti-`<li><h3>` guards |
| `tests/utility-page-render.test.js` | Optional dedicated knowledge-shape test if new fixture added |
| `tests/utility-marx-page-render.test.js` | Concept order; wrapper classes; preserved strings |
| `tests/utility-ld-rna-assessment-page-render.test.js` | 31-1/31-2 smoke only (no knowledge section) |

**Optional fixture (only if needed):** `tests/fixtures/page-render/shape-knowledge-summary-prose.json` — prose-only `knowledge_summary` string.

**Pattern:** assert **class names**, **text preservation**, **order**, **embedded CSS substrings** — not screenshots.

---

## Files likely touched (implementation phase only)

| File | Change |
|------|--------|
| `app.js` | `renderKnowledgeSummaryBlocks`, `utilityRenderDefinitionStyleBlock`, knowledge CSS |
| `tests/utility-renderer-kitchen-sink.test.js` | Knowledge consistency |
| `tests/utility-marx-page-render.test.js` | Marx concept pattern |
| `tests/utility-page-render.test.js` | Optional shape fixture test |
| `tests/fixtures/page-render/shape-knowledge-summary-prose.json` | **Only if** prose shape uncovered |
| Sprint 31 docs | CURRENT-STATE, review-log, probes, baseline, renderer-hooks |

---

## Success rubric (manual)

| Question | Pass |
|----------|------|
| Do concept blocks look like one designed pattern, not random JSON expansion? | **Yes** |
| Can a learner scan terms then definitions quickly? | **Yes** |
| Is every concept string from the JSON still in the page? | **Yes** |
| Does the page stay calm alongside 31-1/31-2 improvements? | **Yes** |

---

**Implemented** 2026-06-01 per R31-004.
