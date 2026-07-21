# Sprint 68 — Handover Pack

**Sprint:** 68 — Learning Coherence and Narrative Flow  
**Pack date:** 2026-07-21  
**Predecessor close:** [Sprint 67 closure](../2026-07-17-sprint-67-learner-renderer-vnext/SPRINT-67-CLOSURE.md)

---

## Why Sprint 68 exists

Sprint 67 restored the vNext learner renderer to functional completeness: deterministic model → HTML, default export shell, navigation, typography, icons, and regression coverage. **Renderer fidelity work is complete.**

Sprint 68 addresses two equally important purposes:

1. **Learner coherence** — improve continuity and pedagogical flow where authoritative lesson data already supports it.
2. **Boundary validation** — determine whether coherence gaps are renderer limitations, render-model mapping gaps, lesson schema gaps, or pipeline generation gaps.

> The renderer renders. The pipeline authors.

Do not make the renderer increasingly intelligent. Validate where the lesson model must supply richer pedagogical information.

---

## Sprint 67 achievements (inherit)

| Area | Outcome |
| ---- | ------- |
| Pipeline | `PRISM JSON → validated LearnerPageModel → HTML` |
| Default renderer | vNext for new exports (`rendererVersion: "vnext"`) |
| Export shell | 1200px header/navigation · 70ch reading column · sticky nav |
| Header | Subtitle + inline duration · intro scrolls away · nav sticks |
| Icons | Semantic iconography via `learner-icon-renderer.js` |
| Tests | 150 vNext-related tests green at Sprint 67 close |
| Legacy | Explicit `rendererVersion: "legacy"` still supported |
| Code | `lib/learner-renderer-vnext/` · browser bundle · `app.js` export composition |

Full close-out: [SPRINT-67-CLOSURE.md](../2026-07-17-sprint-67-learner-renderer-vnext/SPRINT-67-CLOSURE.md)

---

## Current renderer architecture

```text
page JSON
  → build-page-model.js (validation + LearnerPageModel)
  → render-page.js
       → orientation / activities / assessment / study tips
       → render-activity.js (preamble, reasoning orientation, beats)
       → render-beat.js (instructions, prompts, materials)
  → composeStandaloneVnextLearnerExport (app.js)
       → sticky header + journey nav + CSS (getUtilityVnextProseMeasureCss)
```

Render modules consume the **view model only**. Do not re-inspect source JSON in renderers.

---

## Confirmed design principles (carry forward)

1. Deterministic pipeline; no heuristic beat scoring.
2. Single canonical page model; one vNext render path.
3. Render from view model only.
4. Empty beats omitted from renderable output.
5. Explicit ownership of tasks, prompts, materials, expected output.
6. **Sprint 68 addendum:** exhaust existing authoritative fields before schema changes.
7. **The renderer renders; the pipeline authors** — the learner renderer is a deterministic presentation layer; it must not invent instructional content absent from the lesson model.

Full context: [context/architectural-principles.md](context/architectural-principles.md)

---

## Investigation mindset

Classify each coherence issue as one of:

| Category | Meaning |
| -------- | ------- |
| Renderer defect | Render module placement, ordering or presentation error |
| Render model deficiency | JSON → `LearnerPageModel` mapping incomplete or incorrect |
| Lesson schema deficiency | Required pedagogical information has no authoritative field |
| Pipeline generation deficiency | Field exists in schema but is not populated upstream |

Correct ownership before proposing fixes. Not every gap belongs to the renderer.

---

## Known technical debt (not Sprint 68 primary)

| Item | Notes |
| ---- | ----- |
| Legacy renderer | Deprecated path; coexistence only |
| Duplicate orientation headings (S67-F03) | Markdown `##` + section `h2` |
| Page-level learning outcomes region (S67-F05) | Model may not expose dedicated section |
| Marx workflow formatting test | Pre-existing failure unrelated to vNext |

---

## Known pedagogical debt (Sprint 68 focus)

| Item | Notes |
| ---- | ----- |
| Activity bridging | Only one `intellectual_coherence_bridge` visible; embedded in A5 |
| Abrupt activity boundaries | Possible gap between activity articles |
| Preamble vs bridge roles | Unclear whether preambles should serve as transitions |
| Progression cues | `progression_guidance` may be underused in learner flow |
| Repetition | Duplicate headings and redundant orientation copy |

---

## Renderer constraints (do not violate)

* No navigation or layout redesign
* No Sprint 67 CSS architecture reopen
* No semantic iconography redesign
* No export shell changes unless coherence absolutely requires minimal markup
* No speculative content generation
* Preserve regression tests

See [context/renderer-constraints.md](context/renderer-constraints.md)

---

## Deferred schema work

The [deferred schema register](context/deferred-schema-work.md) is the **evidence-based specification for future pipeline work** — not a speculative wishlist.

Schema proposals require: evidence, learner impact, why renderer improvements alone are insufficient, and the minimal additional lesson information required.

Register entries only after S68-BL-001 … S68-BL-008 demonstrate renderer-first and render-model paths are insufficient.

---

## Active assumptions

1. Heteroscedasticity remains the primary golden fixture for coherence work.
2. `activity_preamble` and `intellectual_coherence_bridge` may overlap semantically.
3. Archetype rules govern which prompt fields appear in which beats.
4. Improving flow may require **placement** changes more than new copy.

---

## Immediate backlog item

**S68-BL-001** — Activity-to-activity bridging investigation ([investigation-log.md](investigation-log.md)).
