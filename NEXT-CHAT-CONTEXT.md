# Next chat context — PRISM

**Last updated:** 2026-06-03  
**Active programme:** **Sprint 38-B — Learning Design Prompt Architecture and Materials Fidelity Consolidation** (planning)

---

## Resume here

| What | Where |
|------|--------|
| **Sprint 38-B pack (primary)** | [docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/CONTEXT-FOR-NEXT-CHAT.md](docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/CONTEXT-FOR-NEXT-CHAT.md) |
| **Sprint 38-B README** | [docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/README.md](docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/README.md) |
| **Sprint 38 (complete, frozen)** | [docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md](docs/development/sprints/2026-06-03-sprint-38-pedagogical-visual-affordance-enrichment/ARCHITECTURE.md) |
| **Sprint 39 (deferred)** | [docs/sprints/sprint-39/CONTEXT-FOR-NEXT-CHAT.md](docs/sprints/sprint-39/CONTEXT-FOR-NEXT-CHAT.md) |

**Tests:** `node --test tests/*.test.js` → **706 pass / 0 fail**

---

## One-line state

Sprint 38 visual affordance pipeline is **done** and frozen. Design Page **prompt architecture debt** caused materials regressions (placeholders partially fixed; **table fidelity still broken** on Inflation). Sprint 38-B audits/consolidates LD prompts before Sprint 39 reasoning cues.

---

## Paste prompt for new chat

```text
We have completed Sprint 38. The pedagogical visual affordance pipeline works end-to-end and is documented. A materials-fidelity patch improved a Design Page regression where rich materials collapsed into placeholders, but the latest Inflation rerun still shows table fidelity problems such as malformed comma-row list tables (`Scenario 1,,,`) and header/row prose instead of proper table-shaped materials. Before starting Sprint 39 reasoning cue work, we need Sprint 38-B: Learning Design Prompt Architecture and Materials Fidelity Consolidation. Please review docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/CONTEXT-FOR-NEXT-CHAT.md and begin with 38B-1 Prompt Audit, paying special attention to Design Page prompt growth and 38B-4 Materials and Table Fidelity. Do not refactor runtime code yet; start with prompt inventory, taxonomy, risk analysis, and consolidation plan.
```

---

## Previous programme (deferred)

Sprint 39 — Reasoning Cue Specification — remains planned at `docs/sprints/sprint-39/`. **Do not start Sprint 39 prompt additions** until Sprint 38-B has completed at least **38B-1 Prompt Audit** and **38B-4 Materials and Table Fidelity** (see [HANDOVER-AND-FORWARD-PLAN.md](docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/HANDOVER-AND-FORWARD-PLAN.md)).
