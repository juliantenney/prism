# Sprint 36 → Sprint 37 Handover & Forward Plan

**Date:** 2026-06-03  
**Authoritative code:** `app.js`, `tests/`, domain packs under `domains/`  
**Predecessor packs:** Sprint 36 (visual pedagogy, **COMPLETE**), Sprint 35 (pedagogical refinement, **COMPLETE**), Sprint 34 (renderer stability, **COMPLETE**)

**Test floor (current):** `node --test tests/*.test.js` → **593 pass / 0 fail**

---

## 1. Current state after Sprint 36

Sprint 36 closed with **five observation-led slices** on rendered learner pages — presentation CSS and minimal affordance hooks:

| Slice | Outcome |
|-------|---------|
| 36-1 | Visual hierarchy and scanability review |
| 36-2 | Activity pacing and density — **V31_8** |
| 36-3 | Semantic visual grammar — **V31_9** + `util-material-role-*` |
| 36-4 | Imaging placement affordances — **V31_10** + opportunity inventory |
| 36-5 | Print/session polish — **V31_11** |

**Post–Sprint 36 affordance fix (same programme, placement hardening):**

- PRISM emits **hidden block-level** `.util-visual-affordance` hooks with `data-visual-slot` at safe DOM positions (e.g. immediately **after** `.util-activity-header`, between paired `.util-table-scroll` regions, after `.util-card-grid`).
- Hooks must **not** appear inside `.util-activity-header`, badge rows, headings, or icon-heading wrappers.
- Visual Enhancement Utility v1.1.1 embed guidance points utilities at these slots, not `h3`/header proximity.
- Regression: `tests/utility-visual-affordance-hooks.test.js`; CSS hides hooks in learner view.

Sprint 37 **does not** reopen visual design unless a slice proves copy cannot be expressed without a presentation hook (default: **no**).

---

## 2. Key finding — intros and summaries lag activity sophistication

| Layer | State after 35/36 |
|-------|-------------------|
| **Within-activity pedagogy** | Strong: learner-action tasks, fading, misconception interruption, role grammar |
| **Visual session design** | Strong: hierarchy, pacing, affordance placement, print polish |
| **Session-level rhetoric** | **Weaker:** openings often **describe coverage**; endings can **close structurally** without strong **epistemic synthesis** |

**Evidence (qualitative):**

- **RNA/HCV rerun** — much stronger than `RNAOLD.html` / `RNAOriginal.html` on activities; **introduction and synthesis** still improvable.
- **Climate page** — strong intellectual progression (signal vs variability → mechanism → uncertainty → policy judgement); use as **positive model** for progression signalling (37-3).
- **Study tips / section closings** — present but can read as tips lists rather than “what should now be clearer.”

Sprint 37 targets **prompt/domain guidance** for session framing — not renderer refactors.

---

## 3. Stable foundations to preserve

| Foundation | Detail |
|------------|--------|
| Renderer contracts | Sprint 34 golden fixture, MathJax, `renderMaterialMarkdownBlock` |
| Presentation CSS | V31_7 … V31_11 + affordance hook CSS |
| Pedagogical copy | Sprint 35 auto-applied blocks on self-directed flows |
| Visual affordances | `data-visual-slot` placement rules and tests |
| **Test floor** | **593 pass / 0 fail** |

---

## 4. Evaluation anchors

| Page | Path |
|------|------|
| RNA enhanced | Latest composed HTML + `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` |
| RNA older / original | `RNAOLD.html`, `RNAOriginal.html` (manual baselines) |
| Climate | `climate change.html` + `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |
| Confidence intervals | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| Marx self-study | `tests/fixtures/page-render/marx-self-study-page.json` |

---

## 5. Forward work (Sprint 37)

| Slice | Focus |
|-------|--------|
| **37-1** | Session orientation rhetoric — page/section openings |
| **37-2** | Conceptual tension / why-this-is-hard framing |
| **37-3** | Intellectual progression signalling across activities |
| **37-4** | Synthesis and epistemic closure |
| **37-5** | Transfer, durable understanding, final comparison review — **complete** |

**Deliverable pattern per slice:**

1. `observations/37-X-….md` using rhetorical review template  
2. Targeted edits to prompt blocks / domain packs (document paths)  
3. Optional fixture promotion to `tests/fixtures/page-render/` when shape is stable  
4. Full suite green if code or fixtures change  

**Do not modify `app.js`** until charter is complete **and** the active slice explicitly justifies prompt/domain changes (37-1 starts with observation + guidance).

---

## 6. Non-goals (Sprint 37)

- New workflow steps or orchestration layers  
- Schema / PEC expansion  
- Renderer or CSS changes (default)  
- Adaptive tutoring, reflective diary engines  
- Verbose motivational or generic reflection filler  
- New artefact types  
- Sprint 32 diagram workflow  
- Reopening Sprint 36 visual programme  
- Decorative or “hero” session branding  

---

## 7. Opening prompt for 37-1

Copy into the first implementation session:

> **Context:** Sprint 37 setup complete.  
> **Task:** 37-1 — session orientation rhetoric.  
> **Review:** RNA/HCV newer and older pages, climate change page, CI golden, and Marx page.  
> **Identify:** What makes a **strong opening** for a self-directed PRISM learner page.  
> **Improve:** Prompt/domain guidance so generated pages establish: **topic**, **stakes**, **why the reasoning matters**, **what learners will do intellectually**, and **how the session progresses**.  
> **Keep:** Concise; avoid motivational fluff.  
> **Constraints:** No renderer, workflow, schema, or CSS changes unless clearly justified.  
> **Success:** Observation note plus targeted prompt/domain changes; tests remain **0 fail** if code changes occur.

---

## 8. Forward work (Sprint 38 — chartered)

Sprint 37 is **complete**. The next chartered programme addresses **pedagogical visual affordance enrichment** — not image generation quality.

| Finding (Inflation + enhancement validation) | Sprint 38 response |
|---------------------------------------------|-------------------|
| Visual Enhancement places figures correctly (VEU v1.1.1) | Keep DOM contract frozen |
| Affordances are often topic-shallow (`subject` / title inference) | Emit `purpose`, `concepts`, `preferred_representation`, `anti_spoiler` |
| Figures duplicate tables or assert weak relationships | `representation_avoid`, `reasoning_supported`, tier discipline |

**Sprint 38 pack:** [../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/README.md](../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/README.md)

| Slice | Focus |
|-------|--------|
| 38-1 | Visual affordance audit (inflation anchor) |
| 38-2 | Purpose taxonomy |
| 38-3 | Representation guidance |
| 38-4 | Enriched affordance structure |
| 38-5 | VEU / LD handover (no image-model tuning) |

**Test floor (Sprint 38 entry):** **642 pass / 0 fail**.

---

## 9. Related documentation

| Doc | Path |
|-----|------|
| Sprint 37 charter | [SPRINT-37-CHARTER.md](SPRINT-37-CHARTER.md) |
| Sprint 37 README | [README.md](README.md) |
| Sprint 38 handover (next) | [../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/HANDOVER-AND-FORWARD-PLAN.md](../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/HANDOVER-AND-FORWARD-PLAN.md) |
| Sprint 36 handover (closed) | [../2026-06-03-sprint-36-session-design-visual-pedagogy/HANDOVER-AND-FORWARD-PLAN.md](../2026-06-03-sprint-36-session-design-visual-pedagogy/HANDOVER-AND-FORWARD-PLAN.md) |
| Visual affordance patch note | [../../workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md](../../workflow/exports/visual-enhancement-utility-v1.1.1-patch-note.md) |
