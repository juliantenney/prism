# Sprint 19 — Learning Design Workflow Rationalisation (context)

**Pack path:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`  
**Date:** 2026-05-15  
**Phase:** **Active** — bootstrap / audit-first (audit + planning pack complete)

---

## Problem statement

Learning Design workflow generation resolves **five required factors**, then often asks **up to eight pre-design refinement questions**, then after synthesis enters **`post_generation_refinement`** with **stepRefinementProfiles** that re-ask assessment and page tuning — much of which is already available in **step Settings** via `mappingRules`.

Users experience a **form wizard**: chat interrogation before and after the plan is visible, with overlapping knobs.

Research (Sprint 18) reduced this pattern: **essentials stay blocking**; **fit and scope** surface as **assistive `planning_adequacy`** after the step list exists.

---

## Sprint goal

Produce a **signed-off rationalisation plan** for LD that:

- Preserves deterministic safety (essentials, inference, triggerRules, proceed heuristics).  
- Classifies every LD elicitation mechanism (essential / adequacy / Settings / remove-defer).  
- Defines the **safest first implementation slice** without rewriting runtime in bootstrap.  
- Aligns with Prompt Studio / Factory lessons (workflow as concrete session object).

---

## Success criteria (bootstrap)

| Criterion | Met when |
|-----------|----------|
| Audit answers 9 questions | `ld-workflow-generation-rationalisation-audit.md` complete |
| Portable pack exists | Seven files in this folder |
| Research frozen | No Research pack/test changes in bootstrap PR |
| Test floor unchanged | `node --test tests/*.test.js` → **100 passed** |
| review-log | Ends with **Sprint 19 ready** |

**Not required in bootstrap:** LD code, new fixtures, Factory manual run.

---

## Four concepts (carry from Sprint 18)

| Concept | LD today | Sprint 19 direction |
|---------|----------|---------------------|
| **Required essentials** | 5 factors | **Keep** |
| **Proceedability** | `triggerRules`, assessment gates, heuristics | **Keep** |
| **Refinement opportunities** | refinementFactors + post-gen chat | **Convert** → `planning_adequacy` |
| **Workflow-quality enrichment** | Implicit in step list | **Derive** in adequacy clauses |

---

## In scope

- LD `workflowBriefConfig` audit (`requiredFactors`, `refinementFactors`, profiles, `questionPolicy`, `intentClasses`).  
- Overlap analysis: post-gen vs Settings vs pre-design queue.  
- Prompt Studio lesson mapping.  
- Slice 19-1 / 19-2 / 19-3 charter outlines in bootstrap doc.  
- Sprint 19 portable pack for assistants.

---

## Out of scope (unless explicitly chartered)

| Item | Reason |
|------|--------|
| LD runtime / pack implementation | Bootstrap is planning-only |
| Research regression or pack edits | Frozen reference implementation |
| Renderer / Utilities HTML | Sprint 16 closed |
| Workflow schema redesign | Separate programme |
| Prompt Studio product merge | Patterns only |
| Slice 3B dismiss lifecycle (Research) | Remains Research backlog |
| Removing `stepRefinementProfiles` without replacement | Risky without adequacy + fixtures |

---

## Dependencies

| Dependency | Status |
|------------|--------|
| Sprint 18 Research adequacy interpreter | **Available** in `app.js` |
| Sprint 18 architecture note | **Canonical** |
| LD domain pack | **Source of truth** for policy |
| `existing-refinement-infrastructure-audit.md` | **Background** (Sprint 18) |

---

## Risks

| Risk | Mitigation |
|------|------------|
| Disabling post-gen breaks assessment flows | Phased: adequacy first, then thin profiles with fixtures |
| Re-asking `learner_level` in page profile | Essentials once; profile defers to Settings |
| Triple-ask (chat + Settings + adequacy) | Classification table; one channel per factor class |
| LD without validation/conflict | Port Research pattern only when evidence (Slice 19-4) |

---

## Reference links

- Audit: [`docs/audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md)  
- Sprint 18 checkpoint: [`../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md`](../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md)  
- Architecture: [`docs/consolidation/contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md)  
- LD pack: `domains/learning-design/domain-learning-design-step-patterns.md`
