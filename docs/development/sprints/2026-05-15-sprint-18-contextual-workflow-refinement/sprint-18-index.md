# Sprint 18 — pack index

**Date:** 2026-05-15  
**Sprint title:** Sprint 18 — Contextual Workflow Refinement  
**Status:** **Bootstrap** — documentation and exploration only.

---

## Goal

Document and prepare the architectural shift from **factor-only elicitation** to **workflow-aware, recommendation-driven refinement** sitting on deterministic planning — informed by Sprint 17 outcomes and post-closeout adequacy findings.

---

## Pack contents

| File | Role |
|------|------|
| [`sprint-18-bootstrap.md`](sprint-18-bootstrap.md) | Primary bootstrap: architecture, constraints, exploration areas |
| [`sprint-18-index.md`](sprint-18-index.md) | This index |
| [`review-log.md`](review-log.md) | Sprint 18 review and decision log |
| [`context-files/README.md`](context-files/README.md) | Snapshot inventory |
| [`docs/audits/existing-refinement-infrastructure-audit.md`](../../../audits/existing-refinement-infrastructure-audit.md) | **Existing refinement infrastructure audit** (2026-05-15) |
| [`docs/exploration/sprint-18-research-questions.md`](../../../exploration/sprint-18-research-questions.md) | **Sprint 18 research questions** — open design questions with S1–S6 examples |

---

## Sprint 17 bridge (closed)

| Artefact | Location |
|----------|----------|
| Implementation closeout | `docs/consolidation/sprint-17-implementation-summary.md` |
| Consolidation index | `docs/consolidation/sprint-17-index.md` |
| explicitExtract proposal | `docs/consolidation/sprint-17-explicit-extract-profile-proposal.md` |
| Topic sufficiency gap | `context-files/sprint-17-topic-sufficiency-gap.md` |
| Sprint 17 portable pack | `docs/development/sprints/2026-05-15-sprint-17-research-elicitation-sparse-brief-testing/` |

**Tests:** `node --test tests/*.test.js` → **85 passed** (2026-05-15).

---

## Sprint 18 exploration themes (initial)

1. Contextual refinement model (workflow as substrate)
2. Assistive vs blocking elicitation balance
3. Topic-generation sufficiency / high-impact clarification (Research)
4. Pack-driven recommendation policy (generic runtime)
5. Refinement timing relative to `continueWorkflowDesignGeneration`

---

## Out of scope

- Renderer, schema redesign, Prompt Studio merge, LD implementation, broad UI redesign
- Reopening Sprint 17 implementation

---

## Live repo anchors (when mounted)

| Layer | Path |
|-------|------|
| Research pack | `domains/research/domain-research-step-patterns.md` |
| Planning / elicitation | `app.js` — `resolveWorkflowBriefFactors`, `applyWorkflowDesignHeuristics`, elicitation queue, `getWorkflowRefinementQueue` |
| Sparse regression | `tests/workflow-research-sparse-briefs.test.js`, `tests/fixtures/workflow-brief-research-sparse/` |
