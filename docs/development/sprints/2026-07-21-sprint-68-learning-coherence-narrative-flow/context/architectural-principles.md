# Sprint 68 — Architectural Principles

Inherited from Sprint 67 unless explicitly extended here.

---

## Core pipeline (unchanged)

1. Deterministic: `PRISM JSON → validated LearnerPageModel → HTML`
2. Single canonical page model; one vNext rendering path
3. Render from view model only — no source JSON inspection in render modules
4. No heuristic beat scoring; no activity-ID-specific branches
5. No post-render content insertion
6. Empty beats omitted from renderable output
7. Explicit ownership of tasks, prompts, materials, expected output

---

## Sprint 68 extension

8. **Authoritative data first** — improve placement and presentation of existing fields before schema changes
9. **Coherence without rewrite** — pedagogical flow improvements must not destabilise the Sprint 67 renderer
10. **No invented copy** — transitions and bridges must come from lesson JSON / model, not generated prose
11. **The renderer renders; the pipeline authors** — the learner renderer is a deterministic presentation layer. It faithfully renders authoritative pedagogical information supplied by the lesson model. It must not invent instructional content, narrative transitions, conceptual relationships or pedagogical scaffolding that are absent from the lesson model.

Principle 11 is inherited for future sprints after Sprint 68.

---

## Surfaces frozen for this sprint

* Export shell (1200px header/nav, 70ch reading column)
* Journey navigation behaviour
* Sprint 67 CSS token architecture
* Semantic icon registry and section iconography

Coherence work should concentrate on **activity framing**, **beat prompts**, **orientation regions**, and **inter-activity structure**.
