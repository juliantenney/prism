# Sprint 18 — pack index

**Date:** 2026-05-15  
**Sprint title:** Sprint 18 — Contextual Workflow Refinement  
**Status:** **Bootstrap / handover** — documentation and exploration; implementation charter TBD.

**Fresh chat:** [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) → [`HANDOVER.md`](HANDOVER.md) → [`sprint-18-bootstrap.md`](sprint-18-bootstrap.md)

---

## Goal

Enable continuation of **Contextual Workflow Refinement**: workflow-aware, recommendation-driven refinement on **pack-driven deterministic planning**, **Research-first**, informed by Sprint 17 outcomes and post-closeout adequacy findings.

---

## Pack contents (handover equivalent to Sprint 17)

| File | Role |
|------|------|
| [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) | Fresh-chat entry + **copy-paste block** |
| [`HANDOVER.md`](HANDOVER.md) | Session handover summary |
| [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) | Focus, boundaries, read-first |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Active sprint pointer |
| [`sprint-18-bootstrap.md`](sprint-18-bootstrap.md) | Primary bootstrap: architecture, tests, constraints |
| [`sprint-18-index.md`](sprint-18-index.md) | This index |
| [`review-log.md`](review-log.md) | Decisions and open questions |
| [`context-files/README.md`](context-files/README.md) | Snapshot inventory |

---

## Live repo artefacts (canonical when mounted)

| Path | Role |
|------|------|
| [`docs/consolidation/sprint-17-implementation-summary.md`](../../../consolidation/sprint-17-implementation-summary.md) | Closed Sprint 17 |
| [`docs/consolidation/contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) | Sprint 17→18 architecture |
| [`docs/exploration/workflow-aware-refinement-concepts.md`](../../../exploration/workflow-aware-refinement-concepts.md) | Candidate concepts |
| [`docs/exploration/sprint-18-research-questions.md`](../../../exploration/sprint-18-research-questions.md) | Open design questions |
| [`docs/audits/existing-refinement-infrastructure-audit.md`](../../../audits/existing-refinement-infrastructure-audit.md) | Code inventory |
| [`docs/consolidation/sprint-17-research-elicitation-sparse-brief-prep.md`](../../../consolidation/sprint-17-research-elicitation-sparse-brief-prep.md) | S1–S6 sparse brief table |
| `domains/research/domain-research-step-patterns.md` | Research pack |
| `tests/fixtures/workflow-brief-research-sparse/` | S1–S6 golden fixtures |
| `tests/workflow-research-sparse-briefs.test.js` | Regression |

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

## Exploration themes

1. Contextual refinement model (workflow as substrate)
2. Assistive vs blocking refinement
3. Topic-generation sufficiency / high-impact clarification
4. Pack-driven recommendation policy (generic runtime)
5. Refinement timing vs `continueWorkflowDesignGeneration`
6. Research vs LD divergence
7. Pack vs AI reasoning boundary
8. Regression (S7+, manual M0–M8)

---

## Non-goals

- Renderer, schema redesign, Prompt Studio merge, LD implementation (default)
- Reopening Sprint 17 implementation
- Step-settings-first refinement UX

---

## Live repo anchors

| Layer | Path |
|-------|------|
| Research pack | `domains/research/domain-research-step-patterns.md` |
| Planning / elicitation | `app.js` — resolve, heuristics, elicitation, `continueWorkflowDesignGeneration`, planning disclosures |
| Sparse regression | `tests/workflow-research-sparse-briefs.test.js`, `tests/fixtures/workflow-brief-research-sparse/` |
