# Session handover — Sprint 32 (Pedagogic diagram enhancement)

**Role:** authoritative entry point for **this pack only**.

**Pack path:** `docs/development/sprints/2026-06-02-sprint-32-pedagogic-diagram-enhancement/`

**Date:** 2026-06-02

**Status:** **PLANNED** — **NOT STARTED**

**Live repo rule:** Until slice charters are approved, treat `app.js`, workflow JSON, and tests as **frozen** for Sprint 32 purposes except unrelated work.

---

## Continue here (new chat)

1. Read [`CURRENT-STATE.md`](CURRENT-STATE.md) — programme status.  
2. Read [`sprint-32-charter.md`](sprint-32-charter.md) — goals, boundaries, architecture.  
3. Read [`SPRINT-32-PLANNING-NOTES.md`](SPRINT-32-PLANNING-NOTES.md) — open questions and sequencing.  
4. Read [`context-files/proposed-sprint-32-slices.md`](context-files/proposed-sprint-32-slices.md) — **draft** slice map (not approved).  
5. Confirm Sprint 31 remains **CLOSED**: [`../2026-06-01-sprint-31-page-rhetoric-renderer-experience/CURRENT-STATE.md`](../2026-06-01-sprint-31-page-rhetoric-renderer-experience/CURRENT-STATE.md).  
6. Run `node --test tests/*.test.js` — expect **502** pass / **0 fail** until Sprint 32 work begins.

**Framing:** Sprint 31 made rendered pages **pedagogically elegant** (R-layer). Sprint 32 targets **pedagogically justified visuals** in a **workflow enrichment pipeline** with **self-contained export** — not renderer rhetoric changes.

---

## Do not (until chartered)

| Action | Reason |
|--------|--------|
| Implement slice code | No slice charters approved |
| Modify Prism workflow JSON | Governance-first phase |
| Change `app.js` renderer behaviour | Sprint 31 frozen; Sprint 32 is workflow + export |
| Pass image base64 through LLM prompts | Architectural violation — see charter |
| Reopen Sprint 31 | Closed at R31-999 |
| Add decorative / stock-art imagery | Visual governance |

---

## Core workflow concept (target architecture)

```
Rendered learner-page HTML
    → workflow analyses pedagogic visual opportunities
    → workflow generates educational graphics (file artefacts)
    → final step embeds images + produces self-contained downloadable HTML
```

**Critical:** image bytes as **files/artefacts** through the pipeline; **base64 encoding only at final HTML assembly**.  
**Fallback:** user download + re-upload if artefact persistence is unavailable.

**Historical note:** any existing **SVG-oriented workflow** is context only — **not** the final architecture target.

---

## Key references

| Doc | Use |
|-----|-----|
| [`context-files/sprint-31-boundary-summary.md`](context-files/sprint-31-boundary-summary.md) | What Sprint 31 already fixed |
| [`context-files/visual-enhancement-workflow-analysis.md`](context-files/visual-enhancement-workflow-analysis.md) | Current-state workflow audit frame |
| [`context-files/diagram-quality-targets.md`](context-files/diagram-quality-targets.md) | Quality bar for generated figures |
| [`context-files/accessibility-principles.md`](context-files/accessibility-principles.md) | Alt, captions, semantics |
| [`context-files/future-quantitative-rendering-notes.md`](context-files/future-quantitative-rendering-notes.md) | STEM/math deferred boundary |
| [`review-log.md`](review-log.md) | R32-001+ decisions |

---

## Suggested opening prompt (next bounded session)

> Context: Sprint 32 pack is **PLANNED / NOT STARTED**; Sprint 31 **CLOSED** at test floor **502**. Task: **audit existing visual/SVG workflow paths** and draft **slice-32-1 charter** (workflow redesign + artefact handoff) — documentation and governance only unless explicitly approved to implement. Scope: Sprint 32 `context-files/` + workflow docs; no `app.js` renderer changes. Non-goals: decorative images, base64-in-prompts, Sprint 31 reopen, pedagogy/schema changes. Success: agreed artefact contract + updated `review-log.md` entry.
