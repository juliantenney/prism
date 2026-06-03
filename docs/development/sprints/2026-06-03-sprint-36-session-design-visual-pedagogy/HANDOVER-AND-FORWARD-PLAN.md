# Sprint 35 → Sprint 36 Handover & Forward Plan

**Date:** 2026-06-03 (updated — Sprint 36 **complete**)  
**Authoritative code:** `app.js`, `tests/`, domain packs under `domains/`  
**Predecessor packs:** Sprint 35 (pedagogical refinement, **COMPLETE**), Sprint 34 (renderer stability, **COMPLETE**), Sprint 32 (diagrams, **PLANNED / NOT STARTED**)

**Test floor (current):** `node --test tests/*.test.js` → **589 pass / 0 fail**

---

## 1. Sprint 36 outcome (closed)

Sprint 36 delivered **five observation-led slices** on rendered learner pages — presentation CSS and minimal class hooks only:

| Slice | Outcome |
|-------|---------|
| 36-1 | Visual hierarchy and scanability review (observation-only) |
| 36-2 | Activity pacing and density — **V31_8** + phase/purpose hooks |
| 36-3 | Semantic visual grammar — **V31_9** + `util-material-role-*` |
| 36-4 | Imaging placement affordances — **V31_10** + opportunity inventory |
| 36-5 | Print/session polish and final review — **V31_11** |

**No** workflow steps, schema fields, Sprint 32 diagram orchestration, or decorative redesign.

Observations: `observations/36-1-…` through `observations/36-5-print-session-polish-final-review.md`.

---

## 2. Renderer and presentation baseline (post–Sprint 36)

| Layer | State |
|-------|--------|
| Markdown materials | `renderMaterialMarkdownBlock` |
| MathJax | `\(...\)`, `\[...\]`; restore `kind: inline\|block` |
| Presentation CSS | `getUtilityPagePresentationCss()` chains **V31_7** (typography/base) through **V31_11** (print/narrow) |
| Activity card | `article.util-task-block`, materials stack, cognition regions |
| Role grammar | `util-material-role-*` on task, thinking, model, practice, scenario, inquiry, checklist, deliverable, guidance, checkpoint, phase |
| Golden test | `tests/utility-page-render.test.js` |

### V31 layer reference

| Layer | Function |
|-------|----------|
| **V31_7** | Heading ladder, table scroll, knowledge summary, assessment formative styling |
| **V31_8** | Activity gaps, cognition band, phase cues, purpose demotion, study-tips epilogue (screen) |
| **V31_9** | Pedagogical role borders/backgrounds; print desaturation of role fills |
| **V31_10** | Future `<img>` / `<figure>` accommodation in materials and summary |
| **V31_11** | Print: card-grid pagination, table-heavy activity breaks, header/checkpoint cohesion, study-tips print epilogue; narrow: padding and badge row |

Sprint 37+ should **extend** this stack (V31_12+) rather than replace V31_7.

---

## 3. Known strong output — climate page

**Primary live/probe anchor:** climate-change learner materials (misconception discussion, evidence evaluation).

**Fixture proxy:** `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json`  
**Test:** `tests/utility-ld-climate-misconception-page-render.test.js`  
**Live reference:** `docs/development/sprints/2026-05-21-sprint-28-pedagogic-richness-dialogic-learning/context-files/probe-p28-01-live.md`

**Sprint 36 notes:** Card grid print pagination improved (V31_11). Fixture still lacks `study_tips` — session ending feels abrupt in HTML; add via producer/page compose, not renderer.

**Imaging opportunities:** See `observations/36-4-imaging-placement-affordances.md`.

---

## 4. Evaluation anchors (unchanged paths)

| Page | Path |
|------|------|
| Confidence intervals (golden) | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` |
| Kitchen sink | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` |
| Climate discussion | `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |

---

## 5. Forward work (not Sprint 36)

| Item | Status | Notes |
|------|--------|-------|
| **Utility workflow prompt update** | Recommended | Encourage `study_tips`, tier-1 visuals per 36-4, matrix vs table wording |
| **Utilities inspect/augment** | Existing path | Image output type + HTML export; placement rules in 36-4 |
| **Sprint 32 diagram programme** | **Deferred** | Separate charter; do not conflate with Sprint 36 |
| Climate fixture `study_tips` | Optional | Test/fixture parity with CI/Marx epilogue |
| Domain copy notes (visual choreography) | Optional | Wording-only when producers choose matrix vs prose |

---

## 6. Clear non-goals (unchanged)

- New workflow steps or diagram generation steps (Sprint 32)
- Schema fields for `visual_theme`, `layout_variant`, adaptive pacing
- Full renderer rewrite or component framework migration
- Stock photography, gradients, or decorative hero sections
- Reopening MathJax `$` delimiters or TeX policy
- Undoing Sprint 35 copy patterns

---

## 7. Pack structure

```text
2026-06-03-sprint-36-session-design-visual-pedagogy/
  README.md
  SPRINT-36-CHARTER.md
  HANDOVER-AND-FORWARD-PLAN.md  ← this file
  NOTES.md
  observations/
    36-1 … 36-5
  fixtures/README.md
```

---

## 8. Regression command

```bash
node --test tests/*.test.js
```

Targeted: `utility-page-render`, `utility-markdown-bullet`, `utility-renderer-kitchen-sink`, `utility-marx-page-render`, `utility-ld-climate-misconception-page-render`, `mathjax-delimiter-preservation`.
