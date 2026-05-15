# Sprint 20 — Workflow Explainability and Settings UX (context)

**Pack path:** `docs/development/sprints/2026-05-15-sprint-20-workflow-explainability-settings-ux/`  
**Date:** 2026-05-15  
**Phase:** **Proposed / ready for charter** — bootstrap pack only

---

## Problem statement

Sprint 19 successfully **reduced redundant chat**:

- Generic post-synthesis `refinementFactors` queue disabled (19-1).  
- Structural fit surfaced as **planning adequacy** (19-2).  
- **Profile required tiers emptied** — Ready no longer blocked by forced assessment/page re-asks (19-3).

**New gap:** With fewer questions, users must discover **what the system assumed** and **how to tune** assessment type/count, page profile, tone, depth, and related step parameters. **Settings** (`mappingRules` → `stepParams`) are authoritative but can feel like a **hidden expert mode** if not surfaced in the Factory workflow.

---

## Sprint goal

Improve **workflow explainability** and **Settings discoverability** so users can:

- See which steps are **configurable** and what matters.  
- Understand **key assumptions** (defaults, inference, resolved brief state).  
- Tune common parameters **without** chat interrogation.  
- Use planning adequacy as **guidance**, not a second mandatory wizard.

**Without** reintroducing heavy elicitation or rewriting the Sprint 18/19 policy model.

---

## Core principle

The system should **generate good workflows with minimal interrogation**, then **clearly expose assumptions and tuning affordances afterward**.

---

## Candidate goals

| ID | Goal | Description |
|----|------|-------------|
| **A** | **Settings discoverability** | Make step Settings visible, actionable, and linked from Planning / step list |
| **B** | **Workflow explainability** | Surface assumptions, provenance, and resolved-factor summaries post-design |
| **C** | **Adequacy UX refinement** | Improve Planning-panel presentation of adequacy without new blocking behaviour |

---

## Success criteria (programme)

| Criterion | Target |
|-----------|--------|
| Configurable steps visible | Users can see which steps have meaningful Settings |
| Assumptions understandable | Users can see key inferred/defaulted values without opening JSON |
| Tuning without chat | Common params adjustable via Settings |
| Ready non-blocking | No regression to required post-gen queues |
| Test floor | **118+** passed, 0 failed |
| Architecture preserved | Essentials, adequacy, Settings division unchanged |

---

## In scope (when chartered)

- Factory UX for Settings visibility and navigation.  
- Planning-panel and/or step-list affordances (“editable in Settings”).  
- Summaries of resolved brief factors and step-relevant mappings.  
- Bounded runtime hooks **only if** UX cannot ship otherwise.  
- LD-first pilots; Research behaviour unchanged unless explicitly chartered.

---

## Out of scope (bootstrap and default programme)

| Item | Reason |
|------|--------|
| Bootstrap implementation | Planning-only |
| Runtime rewrite | Prefer UI + small hooks |
| Renderer / schema redesign | Separate programme |
| Validation/conflict framework | Sprint 19 backlog |
| Prompt Studio merge | Patterns only |
| AI-generated adequacy | Deterministic pack text (Sprint 18) |
| Return to heavy elicitation | Contradicts 18/19 |

---

## Dependencies

| Dependency | Notes |
|------------|--------|
| Sprint 19 closed | LD pack policy baseline; **118 tests** |
| Sprint 18 | Research adequacy interpreter — reuse, do not fork |
| `mappingRules` | Existing factor → `stepParams` paths |
| Manual validation | `npm run dev` + `.env.local` for Factory runs |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Settings become hidden expert mode | Slice 20-1 — badges, links, summaries |
| Adequacy becomes a second wizard | Keep non-blocking; cap rows; link to Settings |
| Explainability overwhelms users | Progressive disclosure; summaries not dumps |
| UX complexity creeps back | Charter per slice; no scope creep |

---

## References

- [`sprint-20-bootstrap.md`](sprint-20-bootstrap.md)  
- [`docs/consolidation/sprint-19-closeout.md`](../../../consolidation/sprint-19-closeout.md)  
- [`docs/consolidation/sprint-19-manual-validation-post-19-3.md`](../../../consolidation/sprint-19-manual-validation-post-19-3.md)
