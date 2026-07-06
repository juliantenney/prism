# Generation Visibility Constraint

**Sprint:** 56C — Design Page Migration Execution  
**Status:** Governance constraint — applies to all Sprint 56C validation language  
**Date:** 2026-07-06  
**Authority:** Programme decision — prompt execution occurs in **Copilot**; Prism/Cursor does not observe runtime prompt outputs.

---

## Constraint

### Prism/Cursor **can** validate

- Architecture alignment with CP-4 and frozen governing principles
- Prompt and contract text (ownership boundaries, allowed/disallowed categories)
- Implementation alignment (code, workflows, emit-path obligations)
- Artefact structures (page JSON shape, section membership, embed invariants)
- Governance compliance (guardrails, Assembly-Time Ownership Test classification, inventory reconciliation)

### Prism/Cursor **cannot** validate

- Copilot runtime outputs
- Generated content quality
- Generated summaries
- Generated transitions
- Model behavioural compliance

**Runtime output evaluation must occur within the environment that executes prompts** (Copilot and associated capture/review workflows).

---

## Sprint 56C validation scope (therefore)

| Activity | In Prism/Cursor scope | Requires Copilot/runtime environment |
| -------- | --------------------- | ---------------------------------- |
| Architecture compliance review | Yes | — |
| Prompt and contract audit | Yes | — |
| Page JSON structural review (Layer 1 embed, keys, slots) | Yes | — |
| OQ-24 dual-path **policy** definition | Yes | — |
| OQ-25 fixture **definition** and shortlist | Yes | — |
| Acceptance-test **framework** preparation | Yes | — |
| Proof that runtime generation produces correct prose | No | Yes |
| Proof of summary/transition **quality** | No | Yes |
| Model adherence to behavioural instructions | No | Yes |

---

## OQ-24 / OQ-25 framing

- **OQ-24** — validation **preparation**: dual-path **review framework** and architecture compliance criteria per path. Not proof of Copilot output correctness.
- **OQ-25** — fixture **definition** and acceptance-test **readiness**. Fixtures may be captured from Copilot runs; structural compliance is reviewable in Prism/Cursor; runtime generation quality is not.

---

## Consumers

| Artefact | Application |
| -------- | ----------- |
| [Implementation plan §7](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-IMPLEMENTATION-PLAN.md) | Validation strategy and Wave 3 |
| [Execution checklist §E](SPRINT-56C-EXECUTION-CHECKLIST.md) | Validation readiness checks |
| [Execution readiness review](SPRINT-56C-EXECUTION-READINESS-REVIEW.md) | CP-6 assessment |
