# Slice 36-2 — Activity pacing and density choreography

**Date:** 2026-06-03  
**Status:** Complete  
**Regression:** `node --test tests/*.test.js` → **589 pass / 0 fail**

**Predecessor:** [36-1-hierarchy-scanability-ci-marx-climate.md](36-1-hierarchy-scanability-ci-marx-climate.md) (observation-only)

---

## Goal

Modulate **pacing** and **density** on learner pages so build → practise → interpret → synthesise → close read as distinct session phases — without redesign, new schema, or Sprint 32 diagrams.

---

## Implementation summary

### Presentation layer: `getUtilityPagePresentationCssV31_8()`

Narrow successor to V31_7, appended in `getUtilityPagePresentationCss()`.

| Rule group | Intent |
|------------|--------|
| `article.util-task-block + article.util-task-block` | Activity-to-activity cadence (28px gap) |
| `.util-purpose-task-cue` | Demote duplicate purpose `Task:` line |
| `article > .util-cognition` | Stronger band + uppercase field labels |
| Materials padding + adjacent table gap | Table-wall breathing (20px between scroll wrappers) |
| `.util-session-phase-cue` | Closure / Debrief / Step → meaning / Self-check / Use this when — dashed top rule, uppercase label |
| Output + support | Milestone top rule after materials; dashed rule before support note |
| `h2` study tips | Epilogue border-top (38px margin) |
| `.util-card-grid` margin | Climate card-wall relief before worksheet |
| `.util-scenario-card h3` | Debrief-style `###` headings in scenario prose |
| Print / narrow | Reduced breaks; auto page-break on phase cues |

### Minimal renderer semantics (not restructuring)

| Hook | Location |
|------|----------|
| `utilityMaterialSessionPhaseCueClass(title)` | Class on `util-card-subheading` for phase subheads |
| `util-purpose-task-cue` | Purpose paragraph before primary task box |
| Wired in | `renderTableHintHeadingSections`, markdown `###`/`####` bullet paths, activity `purposeTask` line |

---

## Before → after (36-1 baseline → 36-2)

### Confidence-interval golden page

| Region | Before (36-1) | After (36-2) |
|--------|---------------|--------------|
| Purpose line | Same weight as framing | Muted `.util-purpose-task-cue` |
| A1 → A2 → A4 | Uniform 14px card margin | **28px** between activity cards |
| Cognition (A2/A4) | Light grey, easy to skip | Stronger band before materials |
| A2 materials | Two tables back-to-back | **20px** extra gap between table wrappers |
| Step → meaning / Closure | Plain `h5` subheadings | **`util-session-phase-cue`** with dashed transition |
| Output / support | Low separation from materials | Top rule on output; dashed rule before support |
| Study tips | Section `h2` only | **Epilogue** top border + extra margin |

**Scan-path change:** Eye should catch cognition → phase cues → output milestone before re-entering table grid.

### Marx self-study page

| Region | Before | After |
|--------|--------|-------|
| Activity cadence | Uniform | Increased inter-activity gap |
| A3 template subheads | Flat | Closure / Step → meaning cues when titled |
| A4 scenario | Debrief bold in prose only | `h3` in scenario (if present) gets debrief styling |
| Study tips | Present | Stronger terminal section |

### Climate misconception fixture

| Region | Before | After |
|--------|--------|-------|
| Card grid | Long scroll to template | **18px** margin below grid |
| Session end | Assessment only | Assessment margin + (no study_tips in fixture — unchanged content) |
| Cognition | N/A | N/A |

**Live climate probe:** P28-01 handout benefits from card-grid margin; full epilogue still needs `study_tips` section in generated JSON (producer guidance — not this slice).

---

## Density map (after)

```text
CI A2 (improved rhythm)
[What to do     ▓▓▓]
[Cognition      ▓▓   ← more visible]
[Step meaning   ░    ← phase cue, no heavy top rule]
[Tables         ▓▓▓]
[gap            ░    ← 20px between tables]
[Self-check     ▓]
[Closure        ▓    ← dashed cue, synthesise phase]
[Output         ▓▓   ← milestone rule]
[Support        ░]

Page end
[Assessment     ▓▓]
[Study tips     ▓    ← epilogue rule]
```

---

## Rubric re-score (post-36-2)

| Category | CI golden | Marx | Climate fixture |
|----------|-----------|------|-----------------|
| Hierarchy | Partial → **Partial+** | Partial → **Partial+** | Partial |
| Scanability | Partial → **Pass** | Pass | Partial → **Partial+** |
| Pacing | Partial → **Pass** | Partial → **Pass** | Fail → **Partial** |
| Density | Partial → **Pass** | Partial → **Pass** | Fail → **Partial** |
| Cognitive emphasis | Partial → **Pass** | Partial → **Partial+** | Fail |
| Print / session | Partial → **Pass** | Partial → **Pass** | Partial |

**Note:** Climate still needs content-level `study_tips` for full “close” phase (36-3/ producer, not CSS-only).

---

## Lens notes (post-change)

| Lens | Finding |
|------|---------|
| **Learning designer** | Phase subheads now signal synthesise/close inside long templates |
| **Session designer** | Inter-activity gap + study-tips epilogue improve sitting rhythm |
| **Graphic designer** | Still calm; no new colours — spacing and rules only |
| **Cognitive load** | Table pairs separated; phase bullets grouped under cues |
| **Accessibility** | Semantic HTML unchanged; contrast on cues uses existing slate palette |

---

## Print-preview impact

- Activity cards: extra margin between activities prints cleanly.  
- Phase cues: `break-before: auto` — avoids forced page break before every Closure.  
- Tables: still `break-inside: auto` (V31_7 preserved).  
- Study tips: epilogue border visible on print.

---

## Tests

| Suite | Result |
|-------|--------|
| `tests/*.test.js` | 589 pass / 0 fail |
| Golden page | Asserts `util-purpose-task-cue`, `util-session-phase-cue`, Closure cue in A2 |

---

## Highest-value changes delivered (36-1 priorities)

| Priority | Item | Delivered |
|----------|------|-----------|
| A | Closure/Debrief transition | `util-session-phase-cue` + CSS |
| A | Cognition visibility | V31_8 cognition band |
| A | Output/support milestone | Top rules on output + support |
| B | Multi-table breathing | Adjacent `util-table-scroll` gap |
| B | Activity cadence | `article + article` margin |
| B | Purpose demotion | `util-purpose-task-cue` |
| C | Session epilogue | Study tips `h2` rule (CI, Marx) |
| C | Climate grid relief | Card grid bottom margin |

---

## Rejected scope creep

| Rejected | Reason |
|----------|--------|
| Card redesign / asymmetrical layout | Charter |
| New colour system / gradients | Calm academic tone |
| Icon explosion | 36-3 semantic grammar |
| Animation | Not session design |
| Climate `study_tips` in fixture | Out of CSS scope; producer/page compose |
| Collapsible card grid | Interaction / restructuring |
| Sprint 32 diagrams | Deferred |
| Replacing V31_7 | Extended via V31_8 only |

---

## Deferred to later slices

| Item | Slice |
|------|--------|
| Pedagogical role colours/icons (task vs materials vs assessment) | 36-3 |
| Imaging opportunity catalogue | 36-4 |
| Print polish pass on climate multi-page cards | 36-5 |
| Checklist `Closure:` item styling (inline li, not heading) | 36-3 optional |

---

## Files touched

| Path |
|------|
| `app.js` — `utilityMaterialSessionPhaseCueClass`, V31_8, purpose/scenario hooks |
| `tests/utility-page-render.test.js` — golden pacing class asserts |
| `observations/36-2-pacing-density-choreography.md` |
| `NOTES.md` — slice log |

---

## Next slice

**36-3** — Semantic visual grammar for pedagogical roles (extend phase cues; cognition modifiers; assessment/task differentiation without noise).
