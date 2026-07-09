# Open Questions — Sprint 57A

## Status

Sprint 57A closed 2026-07-09. Unresolved items below are **carried forward to Sprint 58**.

See: [Sprint 58 open questions](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/risks-and-open-questions.md)

---

## Resolved in 57A

| # | Question | Resolution |
| - | -------- | ---------- |
| 1 | Can full-page enrich-in-place work at realistic page sizes? | **No** — empirically failed across post-EP stages |
| 2 | Does instructional budgeting block implementation? | **No** — heuristics defined; architecture pivot is the blocker |
| 3 | Proceed to 57B full-page implementation? | **No** — superseded by Sprint 58 partial architecture |

---

## Carried forward (was open in 57A)

1. What content-budget ranges are appropriate by learner level and context? → **Reference heuristics only; not Sprint 58 scope**
2. How often do constrained pages remain instructionally satisfying? → **Ongoing product evaluation; not Sprint 58 gate**
3. At what point do model output constraints become the dominant limiting factor? → **Full-page emission is the dominant failure; partial outputs mitigate**
4. Can DLA and GAM consistently follow workload-budget targets? → **Prompt guidance in 57A docs; enforce in Sprint 58 partial prompts**
5. What audit rubric thresholds should gate progression? → **Sprint 58 test strategy**
6. Should DLA include `estimated_learner_minutes`? → **Future-design only; not Sprint 58**
