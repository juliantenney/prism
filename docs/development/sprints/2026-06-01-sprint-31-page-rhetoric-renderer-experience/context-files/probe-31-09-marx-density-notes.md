# Probe 31-09 — Marx density / pacing (Slice 31-5)

**Date:** 2026-06-01  
**Fixture:** `tests/fixtures/page-render/marx-self-study-page.json`  
**Rubric rows:** 1–5 (calmness, density, whitespace, task hierarchy), 13–14 (pedagogy preserved)

## Observations

- Activity-scoped comparable-text registry suppresses exact cross-block echoes (e.g. legacy `Task:` vs preamble) without removing **What to do**.
- PEL framing order and labels unchanged; distinct orientation/reasoning strings still present.
- `.util-knowledge-summary`, `.util-materials-stack`, `.util-activity-task--primary` intact (31-3/31-4).
- Framing→task spacing slightly increased via `getUtilityPagePresentationCssV31_5()`.

## Pass criteria

| Check | Result |
|-------|--------|
| Primary task visible | Pass |
| No unexpected cue loss | Pass |
| Less obvious exact repetition | Pass (where JSON duplicated strings) |
| Metadata boundary (31-1) | Pass |
