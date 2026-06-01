# Sprint 32 charter — Pedagogic diagram enhancement & self-contained visual rendering

**Pack path:** `docs/development/sprints/2026-06-02-sprint-32-pedagogic-diagram-enhancement/`  
**Status:** **PLANNED** — **NOT STARTED** (2026-06-02)  
**Date:** 2026-06-02  
**Predecessor:** [Sprint 31 CLOSED](../2026-06-01-sprint-31-page-rhetoric-renderer-experience/SPRINT-31-RETROSPECTIVE.md) (R31-999; floor **502**)  
**Planning:** [`SPRINT-32-PLANNING-NOTES.md`](SPRINT-32-PLANNING-NOTES.md)

> **This document is a governance charter for a future workflow programme.**  
> No implementation slices are approved until recorded in [`review-log.md`](review-log.md) with explicit slice charter files.

---

## Programme framing

| Sprint | Role |
|--------|------|
| **Sprint 30** | Pedagogically **intelligent** generation (PEL) |
| **Sprint 31** | Pedagogically **elegant** rendered pages (R-layer) — **CLOSED** |
| **Sprint 32** | Pedagogically **justified visuals** + **self-contained** enhanced export (workflow programme) |

> **Sprint 32 is not a renderer-rhetoric sprint.**  
> It does not re-litigate Sprint 31 hierarchy, dedupe, or assessment presentation except where figure placement must respect existing structure.

---

## 1. Goal

Enable a **workflow-driven programme** that:

1. Takes **rendered learner-page HTML** (post–Sprint 31 export) as a primary input surface.  
2. **Analyses** where high-value educational graphics would improve comprehension, retention, or task performance.  
3. **Generates** publication-quality educational diagrams/figures with explicit pedagogic purpose.  
4. **Embeds** graphics into a **final downloadable self-contained HTML** artefact suitable for offline study.

Success is measured by **learner usefulness and accessibility of embedded figures**, not by image count or decorative richness.

---

## 2. Core workflow concept

```text
[Rendered learner HTML] 
    → visual-opportunity analysis (scored, tiered)
    → image generation (prompt + model → file artefact)
    → placement / layout strategy (respects page hierarchy)
    → final HTML assembly (embed + base64 at export boundary only)
    → self-contained downloadable HTML
```

### Critical architectural decision

| Rule | Rationale |
|------|-----------|
| **Do NOT pass image base64 through LLM prompts** | Token cost, corruption risk, audit failure |
| **Preferred:** image **files / workflow artefacts** between steps | Inspectable, reusable, debuggable |
| **Base64 only at final embedding step** | Single responsibility at export boundary |
| **Fallback:** user **downloads** images and **re-uploads** if persistence unavailable | Manual continuity without prompt stuffing |

### Historical context (non-target)

Any **existing SVG-oriented workflow** in the repo is **useful audit context** but is **NOT** the final architecture target for Sprint 32. The programme assumes **raster and/or vector file artefacts** with explicit pedagogic metadata, not inline SVG generation as the primary delivery path unless a future slice explicitly charters it.

---

## 3. Scope (when implemented)

| Area | Intent |
|------|--------|
| **Workflow redesign** | Steps for analysis → generation → review → embed |
| **Artefact handoff** | File-based image artefacts between steps |
| **Pedagogic scoring** | Essential / valuable / optional / rejected tiers |
| **Prompt architecture** | Educational image prompts grounded in page content |
| **Accessibility** | Alt text, captions, semantic `<figure>` structure |
| **Placement** | Respect Sprint 31 activity/material/assessment hierarchy |
| **Export robustness** | Self-contained HTML (embedded assets, portable) |
| **STEM foundations (optional)** | Slice 32-7 — quantitative/math visual baseline only if chartered |

### Layer policy (planned)

| Layer | Sprint 32 may touch (when approved) |
|-------|-------------------------------------|
| **Workflow / orchestration** | **Yes** — primary surface |
| **Export / assembly** | **Yes** — final HTML embedding |
| **R (renderer)** | **Minimal** — only if required for figure hooks; prefer workflow-side assembly |
| **G (generation prompts for page JSON)** | **No** — unless explicitly chartered and bounded |
| **C (composition)** | **No** — frozen by default |
| **Schema / PECs** | **No** — frozen by default |

---

## 4. Out of scope (programme defaults)

| Excluded | Notes |
|----------|--------|
| **Decorative / stock-art images** | Rejected tier — no implementation path |
| **Fixed image count caps** | Justify by pedagogic value, not quota |
| **Semantic rewriting of instructional prose** | Analysis may recommend placement; not rewrite LD |
| **Adaptive learner modelling** | No profiles, history, or personalised visual sets |
| **Generation-layer pedagogy changes** | No new PECs, cognition fields, or assessment semantics |
| **Sprint 31 renderer reopen** | Regression fixes only |
| **`metacognition_contract`** | Remains deferred (Sprint 30 Phase 3) |
| **Base64 in intermediate prompts** | Architectural violation |
| **Implementation in this pack creation phase** | Documentation and governance only |

---

## 5. Visual governance

### Inclusion tiers

| Tier | Meaning | Default action |
|------|---------|----------------|
| **Essential** | Comprehension or task completion materially depends on the figure | Generate + embed |
| **Valuable** | Meaningful learning gain; page works without it | Generate if quality bar met |
| **Optional** | Marginal gain; density-sensitive | Omit unless author override |
| **Decorative / rejected** | Aesthetic only; stock-art; redundant with text | **Never generate** |

### Quality direction

See [`context-files/diagram-quality-targets.md`](context-files/diagram-quality-targets.md).

- Publication-quality **educational** visuals  
- Clean **editorial** style (university learning materials)  
- **Not** sketch style; **not** decorative stock-art style  

### No fixed image cap

The workflow must **not** enforce a hard maximum image count. Decisions are driven by **tiered pedagogic justification** and page density judgement.

---

## 6. Accessibility (programme requirements)

When implemented, every embedded figure must support:

- **Alt text** — concise, pedagogically meaningful  
- **Captions** — visible where appropriate  
- **Semantic structure** — `<figure>`, `<figcaption>`, logical association  
- **Non-colour-only signalling** — patterns/labels for colour-blind learners  
- **Screen-reader compatibility** — no information solely in untagged graphics  

Details: [`context-files/accessibility-principles.md`](context-files/accessibility-principles.md).

---

## 7. Proposed slices (draft — not approved)

| Slice | Focus | Status |
|-------|--------|--------|
| **32-1** | Workflow redesign & artefact handoff | Draft |
| **32-2** | Pedagogic visual opportunity scoring | Draft |
| **32-3** | Educational image prompt architecture | Draft |
| **32-4** | Accessibility & figure semantics | Draft |
| **32-5** | Placement & layout strategy | Draft |
| **32-6** | Final HTML assembly / export robustness | Draft |
| **32-7** | Quantitative / STEM visual foundations (optional) | Draft / optional |

Full descriptions: [`context-files/proposed-sprint-32-slices.md`](context-files/proposed-sprint-32-slices.md).

**Do not create `slice-32-N-charter.md` files until the programme lead approves sequencing.**

---

## 8. Success criteria (for future close)

- [ ] Workflow produces **tier-justified** figures only (no decorative tier shipped)  
- [ ] Images flow as **artefacts**, not prompt base64  
- [ ] Self-contained HTML opens offline with embedded figures  
- [ ] Accessibility checklist pass on representative Marx / RNA exports  
- [ ] Sprint 31 renderer hierarchy **preserved** in enhanced exports  
- [ ] Test floor documented; no silent drop below **502** without review-log entry  
- [ ] Sprint 32 retrospective + R32-999 closure decision  

---

## 9. Inherited baseline

| Metric | Value |
|--------|-------|
| **Pass** | **502** |
| **Fail** | **0** |

Command: `node --test tests/*.test.js` — see [`baseline-test-floor.md`](baseline-test-floor.md).

---

## 10. Related packs

| Pack | Relevance |
|------|-----------|
| [Sprint 31](../2026-06-01-sprint-31-page-rhetoric-renderer-experience/) | Renderer hierarchy to preserve |
| [Sprint 30](../2026-05-21-sprint-30-pedagogic-enrichment-layer/) | PEL boundaries; Phase 3 constraints |
| [Sprint 29](../2026-05-21-sprint-29-renderer-cognition-semantics/) | Illustration ≠ renderer semantics |
| [`docs/workflow/workflow-spec.md`](../../workflow/workflow-spec.md) | Step/artefact contracts |
