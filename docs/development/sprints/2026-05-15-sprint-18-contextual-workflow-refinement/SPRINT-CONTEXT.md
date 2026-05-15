# Sprint Context — Sprint 18

**Role:** authoritative for **this pack only**.

**Sprint:** Sprint 18 — Contextual Workflow Refinement

**Pack path:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/`

**Physical snapshots:** `context-files/` — copies for fresh chat; prefer live repo for `app.js` and `domains/research/` when implementing.

---

## Sprint 18 focus

- **Goal:** Design (and later implement) **workflow-aware contextual refinement** on deterministic planning — **Research first**.
- **Breakthrough:** Workflow synthesis creates **semantic context** for elicitation; refinement reads **steps + brief + disclosures**, not only factor IDs.
- **Framing:** Sprint 17 = **safe**; Sprint 18 = **adequate + improvable** without factor-schema explosion.
- **Not in scope:** renderer, schema redesign, Prompt Studio merge, LD implementation (default), Sprint 17 reopen.

---

## Closed baseline (do not reopen)

| Sprint | Role |
|--------|------|
| **Sprint 17** | **Closed** — validation, conflict, disclosure, gates, S1–S6, **85 tests** |
| **Sprint 16** | **Closed** — `page` renderer |

---

## Four planning concepts

| Concept | Sprint 17 touchpoint |
|---------|---------------------|
| **Required essentials** | Four Research factors; essentials queue |
| **Proceedability** | GRC / Design Page gates |
| **Refinement opportunities** | Sprint 18 target (assistive) |
| **Workflow-quality enrichment** | Sprint 18 target (derived) |

---

## Research proving surface

| Layer | Location |
|-------|----------|
| Pack | `domain-research-step-patterns.md` — extend `workflowBriefConfig` when chartered |
| Runtime | `app.js` — generic interpreters; `continueWorkflowDesignGeneration` |
| Fixtures | `tests/fixtures/workflow-brief-research-sparse/` S1–S6 (+ S7 planned) |
| Tests | `workflow-research-sparse-briefs.test.js` |

**LD:** Audit and lessons only unless separate charter.

---

## Read-first order

1. `GPT-BOOTSTRAP-PROMPT.md`
2. `sprint-18-bootstrap.md`
3. `context-files/sprint-17-implementation-summary.md`
4. `context-files/contextual-refinement-architecture-note.md`
5. `context-files/sprint-17-topic-sufficiency-gap.md`
6. `context-files/workflow-aware-refinement-concepts.md`
7. `context-files/existing-refinement-infrastructure-audit.md`
8. `context-files/sprint-18-research-questions.md`
9. `context-files/sprint-17-research-elicitation-sparse-brief-prep.md`
10. `context-files/prompt-studio-workflow-factory-lessons.md`

---

## Verification

```bash
node --test tests/*.test.js
```

**Baseline:** **85 passed**, 0 failed (2026-05-15).

---

## Review log

See `review-log.md`.
