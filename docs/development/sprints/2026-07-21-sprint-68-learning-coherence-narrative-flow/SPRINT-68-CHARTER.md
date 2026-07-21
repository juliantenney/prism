# Sprint 68 — Charter

**Sprint:** 68 — Learning Coherence and Narrative Flow  
**Status:** Chartered  
**Opened:** 2026-07-21  
**Type:** Learner experience on stable vNext renderer  
**Canonical pointer:** [docs/sprints/sprint-68-learning-coherence-narrative-flow.md](../../../sprints/sprint-68-learning-coherence-narrative-flow.md)  
**Predecessor:** [Sprint 67 closure](../2026-07-17-sprint-67-learner-renderer-vnext/SPRINT-67-CLOSURE.md)

---

## Background

Sprint 67 delivered a deterministic vNext learner export renderer: validated page model → HTML, default vNext shell, sticky journey navigation, typography, semantic iconography, and field coverage. The renderer is considered **functionally complete**.

The major remaining work is **learner experience**: continuity, narrative flow and pedagogical coherence. Lessons should read like professionally authored self-study material rather than a sequence of correctly rendered components.

After Sprint 67, Sprint 68 also has a second purpose: **validate the boundary between the lesson pipeline and the learner renderer** — distinguishing what coherence improvements the renderer can deliver from what requires richer authoritative lesson data.

---

## Primary goal

Improve learner coherence where existing authoritative data supports it, and produce evidence showing where improvements require lesson-model or pipeline enhancements rather than a smarter renderer — while preserving renderer stability.

The renderer should not become increasingly intelligent; it should faithfully present what the lesson model supplies.

---

## Expected outcomes

Sprint 68 should produce:

* **Renderer improvements** where justified by existing authoritative data
* **A validated renderer/model boundary** — clear ownership of each coherence issue
* **Render model gap analysis** — deficiencies between JSON and the page model
* **Evidence for future pipeline enhancements** — only where renderer-first paths are insufficient
* **Recommendations for lesson model evolution** — minimal, evidence-based

The sprint succeeds even if some learner experience improvements are **intentionally deferred** because the required pedagogical information does not exist in the current lesson model.

---

## Investigation classification

Investigations should classify each issue into one of four categories:

1. **Renderer defect** — presentation bug in render modules
2. **Render model deficiency** — authoritative JSON not mapped correctly into `LearnerPageModel`
3. **Lesson schema deficiency** — required pedagogical information has no field in lesson JSON
4. **Pipeline generation deficiency** — schema supports the information but upstream authoring does not populate it

The purpose is to identify correct ownership. Do not assume every learner experience issue belongs to the renderer.

---

## Expected workstreams

1. Activity-to-activity bridging
2. Narrative continuity
3. Orientation effectiveness
4. Progression guidance
5. Beat sequencing presentation
6. Coherence of instructional flow
7. Reducing unnecessary repetition
8. Identifying genuine schema gaps **only after** renderer-first improvements are exhausted

---

## In scope

* Using authoritative fields already in PRISM JSON and the vNext page model
* Renderer placement, ordering and presentation of existing narrative / guidance content
* Investigation of misplaced or suppressed bridge content
* Targeted render-model or render-module changes that improve flow without redesigning the page shell
* Tests and documentation for coherence improvements
* Primary fixture: heteroscedasticity (plus other fixtures as evidence requires)

## Out of scope

* Renderer rewrite or Sprint 67 CSS revisit
* Navigation or page layout redesign
* Semantic iconography redesign
* Export architecture changes
* Speculative heuristics where authoritative lesson data exists
* Legacy renderer retirement (may follow later; not this sprint's primary goal)
* Schema / pipeline extensions **until** existing data paths are exhausted

---

## Known startup observation

Only one `intellectual_coherence_bridge` appears in the heteroscedasticity rendered lesson. It is embedded inside Activity 5 (orientation beat) rather than functioning as a transition between activities.

Sprint 68 begins by determining whether bridge content already exists elsewhere, is misplaced, is suppressed, or is genuinely absent from the lesson model.

---

## Success criteria

1. Planning documentation and handover complete (this setup task).
2. Activity bridging investigation completed with documented findings and issue classification.
3. Learner-facing improvements implemented using existing authoritative data where possible.
4. Renderer/model boundary validated — each major coherence gap assigned to renderer, render model, schema, or pipeline.
5. vNext renderer stability preserved (150+ regression tests remain green).
6. Deferred schema register populated with evidence-based pipeline recommendations, or explicitly empty.
7. Definition of done signed in [definition-of-done.md](definition-of-done.md).

---

## First task

**S68-BL-001** — Investigate activity-to-activity bridging (see [investigation-log.md](investigation-log.md)).
