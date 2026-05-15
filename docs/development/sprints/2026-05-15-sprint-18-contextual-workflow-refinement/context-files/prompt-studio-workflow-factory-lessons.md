# Prompt Studio vs Workflow Factory — comparison lessons (Sprint 18)

**Date:** 2026-05-15  
**Status:** Portable snapshot for Sprint 18 bootstrap — **patterns only**, not a merge proposal.

**Canonical:** [`docs/consolidation/contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) §5; [`docs/audits/existing-refinement-infrastructure-audit.md`](existing-refinement-infrastructure-audit.md) §6.

---

## What Prompt Studio does well

| Pattern | Why it works |
|---------|----------------|
| **Session object is concrete** | User refines a known prompt body, not an abstract factor map |
| **Assumptions visible** | Prior choices and loaded context are in-session before “refine” |
| **Delta-oriented refinement** | `handleStartRefinement` improves text; draft/refined versions are comparable |
| **Domain context for writing** | `buildPromptRefinementContext` loads prompt-rules / artefacts — “how to phrase” |
| **Non-blocking ambiguity** | User can save and edit; refinement suggests rather than gates every gap |

---

## Where Workflow Factory differs today

| Factory behaviour | Gap vs PS |
|-------------------|-----------|
| Primary object is **brief factors** | Workflow steps may not exist when essentials finish |
| Post-gen queue (LD) asks **factor ids** | Not “does this step list match intent?” |
| Sprint 17 Planning notices | Pre-design centric; adequacy after synthesis under-served |
| `callOpenAIForWorkflowReview` | Generic “add QA steps”; no pack triggers, no brief adequacy |
| Step **Settings** | Expert knobs — high friction for “wrong plan” questions |

---

## Lessons to adopt (without orchestration merge)

1. **Treat the designed workflow as the session object** after first synthesis — same psychological anchor as a prompt body in PS.
2. **Surface rejected vs applied inference** (Sprint 17 `rejectedInference`) and extend to **workflow-level** recommendations.
3. **Scoped deltas** — “narrow topic”, “remove thematic step”, “add validate” — not full brief re-entry.
4. **Assistive default** — PS does not block on every ambiguity; Factory should not add required factors for every adequacy gap.
5. **Separate channels** — PS `brief` snapshot field names ≠ Factory `briefLines`; do not copy PS payloads into planning without a contract.

---

## Explicit non-goals (Sprint 18)

- Merge Prompt Studio UI, template library, or IndexedDB prompt store into Factory
- Unify `buildPromptRefinementContext` with workflow design context loaders
- Replace `continueWorkflowDesignGeneration` with PS refinement orchestration
- Make step-level prompt refinement the primary workflow-planning UX

---

## Runtime boundaries (audit summary)

| Surface | Refines |
|---------|---------|
| Factory essentials queue | Brief **requiredFactors** |
| Factory post-gen profiles (LD) | Factors → **stepParams** when steps exist |
| Factory AI review | **Workflow graph** (insert steps) |
| Prompt Studio | **Prompt text** for a step or library asset |

Sprint 18 targets the **Factory workflow-plan** channel, not Prompt Studio product code.
