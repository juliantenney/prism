# Sprint 38-B — Learning Design Prompt Architecture and Materials Fidelity Consolidation

**Pack path:** `docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/`  
**Status:** **Wave 1 COMPLETE** (shared modules); Waves 2a–4 not started. Planning closed 2026-06-04.  
**Date:** 2026-06-04  
**Predecessor:** [Sprint 38 — Pedagogical Visual Affordance Enrichment](../2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/) (**COMPLETE**, architecture frozen)  
**Successor (gated):** [Sprint 39 — Reasoning Cue Specification](../../../sprints/sprint-39/) (**DEFERRED** until 38-B prompt audit completes)

**Quick resume:** [CONTEXT-FOR-NEXT-CHAT.md](CONTEXT-FOR-NEXT-CHAT.md) · Root mirror: [NEXT-CHAT-CONTEXT.md](../../../../NEXT-CHAT-CONTEXT.md)

---

## Sprint overview

Sprint 38 validated the **pedagogical visual affordance pipeline** end-to-end:

```text
Design Page → Compose → Renderer → VEU v1.2.1 → Image Generation
```

Sprint 38 validation also exposed **Learning Design prompt architecture debt**: capabilities from Sprints 35–38 were added by **appending auto-applied instruction blocks**, producing very large Design Page prompts where block interactions are hard to reason about. That debt contributed to **learning material fidelity regressions**.

Sprint 38-B audits and plans **consolidation** — preserving pedagogical capability while making prompts shorter, hierarchical, and less likely to degrade activity materials.

**This sprint does not remove pedagogy.** It reorganises instructions into a maintainable contract hierarchy.

---

## Known regressions (track in 38B-4)

| Phase | Symptom | Status |
|-------|---------|--------|
| Initial | Rich materials collapsed to placeholders (“Set of scenarios…”, “Calculation table…”) | **Partially fixed** — materials-fidelity prompt patch |
| Current | Tables flattened to malformed comma-row prose (`Scenario 1,,,`, `Headers` / `Rows` blocks) | **Unresolved** — table fidelity |

---

## Core hypothesis

The immediate bottleneck is **prompt architecture debt**, not missing Sprint 38 schema or renderer capability.

---

## Programme question

> Can we preserve existing LD workflow capabilities while making prompts shorter, more hierarchical, easier to maintain, and less likely to degrade activity materials (including structured tables)?

---

## Proposed slices

| Slice | Focus |
|-------|--------|
| [38B-1](observations/38B-1-prompt-audit.md) | LD workflow prompt audit (length, blocks, duplication, risks) |
| [38B-2](observations/38B-2-instruction-taxonomy.md) | Instruction taxonomy and overlap map |
| [38B-3](observations/38B-3-design-page-consolidation-plan.md) | Design Page consolidation plan (first detailed case) |
| [38B-4](observations/38B-4-materials-and-table-fidelity.md) | Materials + **table** fidelity regression |
| [38B-5](observations/38B-5-workflow-wide-review.md) | Workflow-wide prompt growth review |
| [38B-6](observations/38B-6-regression-validation-plan.md) | Validation plan for future consolidation |
| [38B-7](observations/38B-7-governance-and-maintenance.md) | Prompt governance and maintenance rules |

---

## Boundaries (do not reopen)

| Frozen | Out of scope for 38-B setup |
|--------|------------------------------|
| Sprint 38 schema 38.4, renderer, VEU v1.2.1 | Runtime refactoring in planning phase |
| Sprint 36 placement / CSS | Renderer, VEU, image model changes |
| Sprint 39 reasoning cue implementation | Deleting Sprint 35–38 blocks without consolidation plan |

**Start as audit and planning — not prompt refactor implementation** (unless a later 38-B execution phase is chartered).

---

## Key artefacts

| Doc | Role |
|-----|------|
| [SPRINT-38-B-CHARTER.md](SPRINT-38-B-CHARTER.md) | Mission, principles, success criteria |
| [HANDOVER-AND-FORWARD-PLAN.md](HANDOVER-AND-FORWARD-PLAN.md) | Entry criteria, slice order, exit to Sprint 39 |
| [NOTES.md](NOTES.md) | Working log |
| [fixtures/](fixtures/) | Probe templates and checklists |

---

## Relationship to Sprint 39

Sprint 39 (reasoning cue specification) should **wait** until Sprint 38-B has at least completed **38B-1 Prompt Audit** and documented **38B-4 Materials and Table Fidelity**. Adding new cue-authoring guidance to the current prompt stack without consolidation risks repeating the accumulation problem.
