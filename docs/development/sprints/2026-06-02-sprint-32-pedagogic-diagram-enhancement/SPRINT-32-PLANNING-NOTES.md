# Sprint 32 planning notes

**Status:** Planning / governance — **NOT implementation**  
**Date:** 2026-06-02  
**Charter:** [`sprint-32-charter.md`](sprint-32-charter.md)

---

## Why Sprint 32 now

Sprints 30–31 established **rich pedagogic JSON** and **calm rendered HTML**. Learners still lack **purpose-built figures** embedded in **offline-ready** study packs. Multiple prior packs deferred an **illustration / diagram pipeline** (Sprint 29, 30, 31 charters). Sprint 32 names that programme explicitly as **workflow + export**, not renderer rhetoric.

---

## Problem statement (draft)

Rendered self-directed pages are text- and structure-strong but **visually under-supported** where a single well-designed diagram would:

- reduce extraneous cognitive load for spatial concepts  
- anchor vocabulary introduced in prose  
- support comparison, process, and hierarchy tasks already implied in activities  

Ad-hoc image insertion (decorative stock art, inline SVG experiments, prompt-stuffed base64) would **harm** trust, accessibility, and maintainability.

---

## Target outcome

A **repeatable workflow** that outputs **self-contained HTML** with **pedagogically justified**, **accessible** figures — without altering the underlying learning design or Sprint 31 presentation hierarchy.

---

## Architectural anchors (non-negotiable)

1. **Input:** rendered learner-page HTML (utility export path).  
2. **Analysis:** scored visual opportunities with inclusion tiers.  
3. **Generation:** educational image prompts → **file artefacts**.  
4. **Embedding:** base64 (or equivalent) **only** at final assembly.  
5. **No base64 in LLM prompts** for images.  
6. **Fallback:** download / re-upload path when artefact store unavailable.  
7. **SVG legacy:** audit only — not the architectural north star.

---

## Open questions (resolve before slice 32-1)

| # | Question |
|---|----------|
| Q1 | Which existing workflow(s), if any, already touch SVG or image steps? |
| Q2 | Where do workflow artefacts persist today (browser storage, files, step outputs)? |
| Q3 | Is final HTML produced by workflow export, renderer re-run, or a new assembly function? |
| Q4 | Who authors alt text and captions — generation step, rule template, or human review gate? |
| Q5 | How do we prevent figure placement from breaking Sprint 31 activity framing order? |
| Q6 | Does 32-7 belong in this programme or a separate quantitative sprint? |

---

## Recommended sequencing (draft)

1. **Audit** — populate `visual-enhancement-workflow-analysis.md` from codebase.  
2. **Charter 32-1** — artefact contract + step topology (docs + review).  
3. **Charter 32-2** — scoring rubric + tier enforcement.  
4. **Charters 32-3–32-4** — prompts + accessibility (can overlap in design).  
5. **Charter 32-5** — placement rules respecting Sprint 31 DOM patterns.  
6. **Charter 32-6** — self-contained export hardening.  
7. **Optional 32-7** — STEM only if scope confirmed.

---

## Evidence pages (for future manual QA)

Reuse Sprint 30/31 live artefacts:

| Page | Path (Sprint 30 pack) |
|------|------------------------|
| Marx self-study | `.../live-artefacts/marx-page.json` |
| RNA / HCV | `.../live-artefacts/rna-page.json` |
| Kitchen sink | `tests/fixtures/page-render/renderer-kitchen-sink-page.json` |

Enhanced HTML probes should be **notes + rubric scores**, not large binary dumps in git.

---

## Explicit non-goals (planning phase)

- Implementing workflow steps  
- Modifying `app.js` renderer  
- Creating slice charter files beyond this pack’s context docs  
- Reopening Sprint 31  
- Starting `metacognition_contract`  

---

## Next chat (recommended)

See [`HANDOVER.md`](HANDOVER.md) suggested opening prompt: **workflow audit + draft slice-32-1 charter (documentation only)**.
