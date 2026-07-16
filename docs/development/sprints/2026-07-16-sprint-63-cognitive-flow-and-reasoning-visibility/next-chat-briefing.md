# Sprint 63 — Briefing for New Chat

**Document role:** Concise transfer prompt. Details: [Sprint 63 charter](../../../sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md).  
**Updated:** 2026-07-16

---

## Briefing (copy below)

You are starting PRISM on **Sprint 63 — Cognitive Flow & Reasoning Visibility**.

**Sprint 62 is closed (PASS).** Renderer correctness and learner-journey presentation improvements are complete. No further Sprint 62 implementation work is planned.

**Sprint 63 is a discovery and architecture sprint** — not a schema redesign sprint, not a DLA/GAM rewrite, and not a renderer feature sprint.

**Pack:** `docs/development/sprints/2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/`  
**Start:** [SPRINT-63-START-HERE.md](SPRINT-63-START-HERE.md)  
**Charter:** [docs/sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md](../../../sprints/sprint-63-cognitive-flow-and-reasoning-visibility.md)  
**Evolution:** [docs/architecture/learning-experience-evolution.md](../../../architecture/learning-experience-evolution.md)

### Current state

- Sprint 62 complete.
- Renderer improvements landed (correctness + journey presentation).
- Goal framing, success promotion, learner-facing labels, and structural dedupe implemented within “no invented meaning” boundary.
- No further Sprint 62 implementation work planned.

### Important evidence

- **A2 learner-facing redesign:** Frame → Your goal → Success looks like → Understand → See it modelled → Your turn → Check your work; materials/order/bodies unchanged.
- **A6 boundary analysis:** inventory-style learner_task cannot safely become a goal; Transfer order preserved; no invented evaluative goal.
- **Educational review / redesign findings:** Learning Journey ≠ Cognitive Journey; uniform episode structure may mask distinct reasoning patterns.

### Major conclusions

- Renderer correctness largely achieved.
- Journey presentation materially improved.
- Cognitive orchestration remains an opportunity area.
- Reasoning visibility appears to be an emerging upstream concern.
- Pipeline evolution may eventually be required, but **no redesign decisions have yet been made**.

### Working Hypothesis

Remaining learner friction may no longer be primarily renderer correctness or activity structure. The next bottleneck may be a **mismatch between the cognitive process learners must perform and the information explicitly available in the activity**. Sprint 63 exists to test this — determine whether friction is presentation, orchestration, missing information, or a combination. Full text: charter § Working Hypothesis.

### Sprint 63 objectives

1. Cognitive flow audit.
2. Cognitive pattern inventory.
3. Missing-information inventory.
4. Distinguish rendering issues vs orchestration issues vs information gaps.
5. Evidence-based recommendations for future pipeline evolution (documentation only).

### Provisional cognitive patterns (validate in Sprint 63)

| Activity | Candidate pattern |
| -------- | ----------------- |
| A1 | Classification |
| A2 | Causal Analysis |
| A3 | Process Modelling |
| A4 | Systems Analysis |
| A5 | Comparative Analysis |
| A6 | Evaluation & Judgement |

### Open questions

- What cognitive patterns exist across activities?
- Which learner difficulties are caused by orchestration?
- Which are caused by missing information?
- Which concepts are already implicit in the pipeline?
- What additional concepts may eventually be required?

### Explicitly out of scope

- Production code / renderer / DLA / GAM / schema changes
- Inventing instructional meaning in presentation

### Recommendation

Begin Sprint 63 in this (or a fresh) conversation with clean context; work evidence-first from fixtures and Sprint 62 closure docs.

### Predecessor closures

- [Sprint 62 closure](../2026-07-16-sprint-62-coherent-renderer-pass/SPRINT-62-CLOSURE.md)  
- [Sprint 61 closure](../2026-07-15-sprint-61-priority-1-archetype-selection-reliability/SPRINT-61-CLOSURE.md)  
