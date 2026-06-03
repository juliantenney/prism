# Slice 36-5 — Print/session polish and final visual review

**Date:** 2026-06-03  
**Status:** Complete — **Sprint 36 programme closed**  
**Regression:** `node --test tests/*.test.js` → **589 pass / 0 fail**

**Predecessors:** [36-1](36-1-hierarchy-scanability-ci-marx-climate.md) · [36-2](36-2-pacing-density-choreography.md) · [36-3](36-3-semantic-visual-grammar.md) · [36-4](36-4-imaging-placement-affordances.md)

**Presentation stack (final):** V31_7 (typography/base) → V31_8 (pacing) → V31_9 (role grammar) → V31_10 (figure accommodation) → **V31_11** (print/session polish)

---

## Executive summary

Rendered learner pages are **ready to close Sprint 36** as calm, self-study handouts in browser, narrow viewport (~360–720px), and print preview. Post–36-2/36-3/36-4 work delivers:

- Credible **session arc** (model → practise → transfer → checkpoint → study tips where present)
- **Role grammar** without visual noise
- **Print-safe** tables, assessment, and future figures
- **One targeted print fix** for climate-scale card grids (V31_11)

**Residual gaps** are **content/producer** (climate fixture lacks `study_tips`; live probe richer than fixture) — not presentation-layer blockers.

---

## Review method

| Anchor | Fixture / reference | Modes reviewed |
|--------|---------------------|----------------|
| CI golden | `confidence-interval-a2-multitable-page.json` | Browser structure, print rules, MathJax |
| Marx | `marx-self-study-page.json` | Checklist density, study tips epilogue |
| Kitchen sink | `renderer-kitchen-sink-page.json` | Material diversity contract |
| Climate | `ld-climate-misconception-discussion-page.json` | Card grid, abrupt ending |
| Climate live | `probe-p28-01-live.md` | Session shape reference (not re-rendered in CI) |

Validation: fixture renders via `buildUtilityStructuredHtmlForTest`; CSS cross-read `getUtilityPagePresentationCss()` V31_7–V31_11; regression suites listed in charter.

---

## 1. Print continuity

| Concern | Before Sprint 36 | After (V31_7–V31_11) | V31_11 delta |
|---------|-------------------|----------------------|--------------|
| Activity cards fragment mid-card | V26 `break-inside: avoid` on `article.util-task-block` | Preserved for typical activities | **Table-heavy** activities: `break-inside: auto` when `.util-table-scroll` present — avoids blank half-pages on CI A2 |
| Long tables | `overflow: visible`; `break-inside: auto` (V31_7) | Usable on paper | Unchanged — **Pass** |
| Card grid (climate) | Entire grid `break-inside: avoid` (V26) — forced huge block | Grid can **span pages**; each `util-task-card` still avoids internal break | **Fixed** |
| Activity title orphaned from task | Possible on print | Header + purpose/framing `break-after/before: avoid` | **Improved** |
| Assessment checkpoint | Formative item avoid (V31_6) | Section checkpoint tint (V31_9) | Section `break-inside: avoid` on print |
| Figures (future) | — | V31_10 `max-width`, avoid inside figure | Ready |
| Role tinted backgrounds | — | Print → white (V31_9) | No ink-heavy panels |
| Study tips epilogue | V31_8 screen border | Print border reinforced (`#cbd5e1`) | Clear session end on CI/Marx |

**CI golden print path:** Three activities print with 20px inter-activity gap; A2 tables may split across pages inside the activity card; assessment and study tips follow as distinct sections.

**Climate fixture print path:** Cards paginate individually; template → prompts → output → T/F checkpoint read sequentially; **no study_tips** — ending still feels like “assessment appendix” (content gap, not CSS).

---

## 2. Session handout feel

| Page | Coherent session? | Progression visible? | Ending cue? |
|------|-------------------|----------------------|-------------|
| **CI golden** | **Yes** | A1 model → A2 faded → A4 transfer; 28px activity gaps | **Strong** — `study_tips` epilogue + in-activity Closure/Debrief phase cues |
| **Marx** | **Yes** | A2 model → A3 table → A4 scenario/checklist | **Strong** — study tips |
| **Kitchen sink** | N/A (QA) | Material types ordered in one card | Study tips section present in fixture |
| **Climate fixture** | **Partial** | Single 40-min block; card wall then worksheet | **Weak** — ends at formative check; no epilogue section |
| **Live climate probe** | **Yes** (content) | Scenario cards → formative check | Facilitator debrief off-page; learner handout still benefits from `study_tips` in compose |

**Scan-path (intended):** `h1` → section landmarks → activity title → **What to do** (action role) → thinking → materials by role → deliverable → guidance → checkpoint → study tips.

**36-3 role grammar** supports this without new card designs — task (slate), thinking (neutral), model/practice/scenario (distinct borders), checkpoint (top rule).

---

## 3. Narrow viewport (~360–720px)

| Element | Assessment | V31_11 |
|---------|------------|--------|
| Role left borders / labels | Still scannable; no horizontal overflow | Unchanged |
| Tables | `util-table-scroll` horizontal scroll; meaning preserved | Touch scroll retained |
| Badge row | Header `flex-wrap` (base) | Badges **full-width row** below title — less crowding |
| Activity padding | 20px/22px | **16px/14px** on narrow |
| Cognition / support | Readable | Slightly reduced padding; support `.875rem` |
| Card grid | Single column (V26) | Unchanged |
| Checkpoint | Readable | Slightly reduced top padding |

**Verdict:** **Pass** — role grammar survives narrow; no competing loud zones.

---

## 4. Final visual balance (V31_8–V31_10 stack)

| Check | Result |
|-------|--------|
| Over-emphasis after role grammar | **No** — borders 2–3px; backgrounds light; no badges added |
| Cognition as warning boxes | **No** — neutral band (36-3) |
| Phase cues vs material headings | **Separated** — phase cues uppercase/dashed; material `h4` distinct |
| Task vs materials | **Clear** — primary task slate rule; materials stack below border |
| Output vs support | **Clear** — deliverable green milestone; guidance muted |
| Assessment vs activity | **Clear** — checkpoint section outside activity cards |
| Imaging placeholders | **None** — correct |

**Sprint 35 copy patterns (regression contracts):**

| Pattern | CI golden | Marx | Climate |
|---------|-----------|------|---------|
| Step → meaning / Closure | Visible + phase cue | Visible | Template subheads |
| Check your thinking | support_note | support_note | N/A |
| Worked example / template | model + practice roles | model + practice | template |
| Debrief | A4 scenario | A4 summary_text | N/A |
| MathJax `\[...\]` / `\(...\)` | knowledge_summary | N/A | N/A |
| Assessment structure | `<ol>` stem, options | N/A | T/F layout |

All preserved in targeted tests — **no renderer changes in 36-5**.

---

## 5. Regression contracts

```text
node --test tests/*.test.js
→ 589 pass / 0 fail
```

| Targeted suite | Purpose |
|----------------|---------|
| `utility-page-render.test.js` | Golden CI + pacing/role classes |
| `utility-markdown-bullet.test.js` | Lists/tables |
| `utility-renderer-kitchen-sink.test.js` | Material diversity |
| `utility-marx-page-render.test.js` | Humanities layout |
| `utility-ld-climate-misconception-page-render.test.js` | Climate materials |
| `mathjax-delimiter-preservation.test.js` | TeX unchanged |

**36-5 code touch:** CSS only (`getUtilityPagePresentationCssV31_11()`). No HTML contract changes — golden asserts unchanged.

---

## Anchor verdicts (Sprint 36 rubric)

| Category | CI | Marx | Climate fixture | Kitchen sink |
|----------|-----|------|-----------------|--------------|
| Hierarchy | Pass | Pass | Partial | Pass (QA) |
| Scanability | Pass | Pass | Partial | Pass |
| Pacing | Pass | Pass | Partial | N/A |
| Density | Pass | Partial | Partial | N/A |
| Cognitive emphasis | Pass | Pass | Fail (no cognition) | Pass |
| Visual affordance | Pass (36-4 doc) | Pass | Pass (36-4 doc) | Pass |
| Accessibility | Pass | Pass | Pass | Pass |
| Print / session | **Pass** | **Pass** | **Partial** | Pass |
| Calm academic tone | Pass | Pass | Pass | Pass |

**Scale movement since 36-1:** CI and Marx print/session upgraded from **Partial → Pass**; climate print improved (card pagination); content ending still **Partial** without `study_tips`.

---

## Implementation (36-5)

### `getUtilityPagePresentationCssV31_11()`

| Rule | Intent |
|------|--------|
| Card grid `break-inside: auto` on print; per-card `avoid` | Climate handout: cards flow across pages |
| Table-heavy activity `break-inside: auto` | CI A2: tables split without forcing whole activity to next page |
| Activity header break avoid | Title + badges stay with top of activity |
| Checkpoint section break avoid | Short formative block stays together |
| Study tips print border | Epilogue visible on paper |
| Narrow: padding, badges, cognition/support | Handout on phone without crowding |

---

## Rejected scope creep

| Rejected | Reason |
|----------|--------|
| Forced `break-before: page` on every activity | Breaks CI continuity; too aggressive |
| Decorative print headers/footers | Not session design |
| Climate `study_tips` in fixture | Producer/page compose — out of CSS scope |
| Collapsing card grid in print | Hides content |
| New renderer / workflow / schema | Charter |
| Sprint 32 diagrams | Deferred programme |
| V31_12+ without new charter | Stack complete for Sprint 36 |

---

## Sprint 36 close-out

| Slice | Deliverable |
|-------|-------------|
| 36-1 | Hierarchy scanability observations |
| 36-2 | V31_8 pacing + phase/purpose hooks |
| 36-3 | V31_9 role grammar + `util-material-role-*` |
| 36-4 | V31_10 figure accommodation + imaging inventory |
| 36-5 | V31_11 print/narrow polish + this final review |

**Programme question answered:** Pages can read as **intentionally choreographed study sessions** while staying **calm and academically restrained** — with known content gaps (climate epilogue) documented for forward producer/workflow work.

---

## Forward work (post–Sprint 36)

| Item | Owner | Notes |
|------|-------|-------|
| Utility workflow prompt update | Workflow/domain | Encourage `study_tips`, matrix vs table, tier-1 visual opportunities per [36-4](36-4-imaging-placement-affordances.md) |
| Utilities HTML inspect/augment pass | Existing utility + image output path | Placement rules in 36-4; no new steps |
| Sprint 32 diagram programme | Separate charter | **Still deferred** — not activated by Sprint 36 |
| Climate live probe re-render | Manual QA | Confirm card-grid print after V31_11 |
| Optional fixture: climate `study_tips` | Test/fixture only if product wants CI parity | Not required to close Sprint 36 |
