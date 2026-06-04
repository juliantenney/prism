# Sprint 37 — Session framing and intellectual coherence

**Pack path:** `docs/development/sprints/2026-06-03-sprint-37-session-framing-intellectual-coherence/`  
**Status:** **COMPLETE** — slices 37-1–37-5 delivered (observations + domain §6g–6k + auto-applied blocks)  
**Date:** 2026-06-03  
**Test floor (entry):** **593 pass / 0 fail**  
**Predecessor:** [Sprint 36 — session design and visual pedagogy](../2026-06-03-sprint-36-session-design-visual-pedagogy/) (**COMPLETE**)

---

## Sprint overview

Sprint 37 improves PRISM’s **session-level rhetoric**: how learner pages **introduce**, **frame**, **sequence**, and **close** the intellectual journey.

This is **not** a renderer sprint, **not** a visual design sprint, and **not** a workflow/orchestration sprint. Work targets **prompt shaping**, **domain guidance**, and **observation-led review** so composed pages read as a **coherent reasoning journey** — not a competent document summary of topic coverage.

---

## Why this follows Sprint 35 and 36

| Sprint | Contribution | What Sprint 37 adds |
|--------|----------------|---------------------|
| **34** | Stable renderer contracts, golden fixtures | Floor to preserve — no contract churn |
| **35** | Activity pedagogy: learner-action framing, fading, misconception interruption, concept/procedure integration, metacognitive closure | Strong **within-activity** rhetoric; openings/endings can still lag |
| **36** | Visual rhythm, semantic roles, figure accommodation, affordance hook placement | Pages **look** like designed sessions; **intellectual arc** at page level can still under-signal stakes and synthesis |

**Core gap:** Recent outputs (e.g. RNA/HCV rerun, climate progression) show strong activity and visual sophistication, but **openings** often describe coverage and **closings** can end structurally without strong epistemic synthesis (“what should now be clearer”).

---

## Core principle

> PRISM should frame each learner page as a **coherent intellectual journey**, not merely a well-structured content artefact.

Move generated copy from:

- *“This page covers topic X”*

towards:

- *“This session guides you through a coherent reasoning journey.”*

---

## Boundaries

| In scope | Out of scope |
|----------|--------------|
| Session orientation and stakes in existing fields | New workflow steps |
| Conceptual tension / why-this-is-hard framing | Schema / PEC expansion |
| Intellectual progression signalling across activities | Renderer or CSS changes (unless unavoidable — default **no**) |
| Synthesis, epistemic closure, transfer rhetoric | Adaptive tutoring or reflective diary engines |
| Targeted prompt/domain pack edits | Verbose motivational prose |
| Observation notes and rhetorical probes in `fixtures/` | Generic “reflect on your learning” filler |
| Tests only when a rhetorical contract is stable | New artefact types |
| | Sprint 32 diagram workflow |
| | Reopening Sprint 35/36 visual or activity contracts |

**Preserve:** Sprint 34 renderer contracts, Sprint 35 pedagogical field semantics, Sprint 36 presentation and affordance placement.

---

## Proposed slices

| Slice | Title | Primary focus |
|-------|--------|----------------|
| **37-1** | Session orientation rhetoric | Page/section openings: topic, stakes, why reasoning matters, intellectual plan |
| **37-2** | Conceptual tension / why-this-is-hard framing | Misconception pressure, difficulty honesty, conceptual stakes without fluff |
| **37-3** | Intellectual progression signalling | Cross-activity arc: build → challenge → integrate → judge |
| **37-4** | Synthesis and epistemic closure | Endings, study tips, debrief: what is clearer now |
| **37-5** | Transfer, durable understanding, and final comparison review | Application, comparison, durable takeaways |

See [SPRINT-37-CHARTER.md](SPRINT-37-CHARTER.md) for governance, review lenses, and regression expectations.

---

## Evaluation anchors

Use these for before/after rhetorical review (fixture render via `buildUtilityStructuredHtmlForTest` unless noted as live HTML).

| Anchor | Path / note |
|--------|-------------|
| **RNA (newer)** | Enhanced learner page from latest HCV/RNA run; fixture proxy: `tests/fixtures/page-render/ld-rna-hcv-assessment-page.json` |
| **RNA (older)** | `RNAOLD.html` — manual baseline; add to `fixtures/` if not in repo |
| **RNA (original)** | `RNAOriginal.html` — manual baseline; add to `fixtures/` if not in repo |
| **Climate** | `climate change.html` (live/probe) + `tests/fixtures/page-render/ld-climate-misconception-discussion-page.json` |
| **Confidence intervals** | `tests/fixtures/page-render/confidence-interval-a2-multitable-page.json` |
| **Marx self-study** | `tests/fixtures/page-render/marx-self-study-page.json` |

**Cross-references:** Sprint 35 observations (`../2026-06-03-sprint-35-pedagogical-refinement/observations/`), Sprint 36 visual notes (`../2026-06-03-sprint-36-session-design-visual-pedagogy/observations/`).

---

## Suggested first prompt (37-1)

> **Context:** Sprint 37 setup complete.  
> **Task:** 37-1 — session orientation rhetoric.  
> **Review:** RNA/HCV newer and older pages, climate change page, CI golden, and Marx page.  
> **Identify:** What makes a **strong opening** for a self-directed PRISM learner page.  
> **Improve:** Prompt/domain guidance so generated pages establish: **topic**, **stakes**, **why the reasoning matters**, **what learners will do intellectually**, and **how the session progresses**.  
> **Keep:** Concise; avoid motivational fluff.  
> **Constraints:** No renderer, workflow, schema, or CSS changes unless clearly justified.  
> **Success:** Observation note plus targeted prompt/domain changes; tests remain **0 fail** if code changes occur.

Full handover text: [HANDOVER-AND-FORWARD-PLAN.md](HANDOVER-AND-FORWARD-PLAN.md).

---

## Successor — Sprint 38 (chartered)

**Sprint 38 — Pedagogical Visual Affordance Enrichment** addresses shallow upstream visual briefs (Inflation validation). Not image-model work.

Pack: [../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/README.md](../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/README.md)

---

## Pack contents

| File / folder | Purpose |
|---------------|---------|
| [README.md](README.md) | Overview, boundaries, slices, anchors (this file) |
| [SPRINT-37-CHARTER.md](SPRINT-37-CHARTER.md) | Rationale, scope, principles, success criteria, review lenses |
| [HANDOVER-AND-FORWARD-PLAN.md](HANDOVER-AND-FORWARD-PLAN.md) | Post–Sprint 36 state, affordance fix summary, forward work, 37-1 opener |
| [NOTES.md](NOTES.md) | Programme notes and slice log |
| [observations/](observations/) | Rhetorical review notes per slice |
| [fixtures/](fixtures/) | Probe excerpts and before/after extracts (non-CI unless promoted) |

---

## Regression command

When any code or test fixture changes:

```bash
node --test tests/*.test.js
```

**Entry floor:** 593 pass / 0 fail.
