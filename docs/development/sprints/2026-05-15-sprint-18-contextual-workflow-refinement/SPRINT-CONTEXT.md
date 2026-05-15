# Sprint Context — Sprint 18

**Role:** authoritative for **this pack only**.

**Sprint:** Sprint 18 — Contextual Workflow Refinement

**Pack path:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/`

**Physical snapshots:** `context-files/` — copies for fresh chat; prefer live repo for `app.js` and `domains/research/` when implementing.

---

## Sprint 18 focus

- **Goal:** **Workflow-aware contextual refinement** on deterministic planning — **Research first** (Slices 1–2 **closed**).
- **Breakthrough:** Workflow synthesis creates **semantic context** for elicitation; refinement reads **steps + brief + disclosures**, not only factor IDs.
- **Framing:** Sprint 17 = **safe**; Sprint 18 Slices 1–2 = **assistive adequacy** surfaced in Planning panel after synthesis.
- **Checkpoint:** [`SPRINT-18-CHECKPOINT.md`](SPRINT-18-CHECKPOINT.md)
- **Not in scope (ongoing):** chat, dismiss state, LD rollout, AI phrasing, renderer/schema, Prompt Studio merge; Sprint 17 reopen.

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
| **Refinement opportunities** | Slice 1–2: `planning_adequacy` (assistive) |
| **Workflow-quality enrichment** | Folded into adequacy `when` (e.g. `weakTopicScope`) |

---

## Research proving surface

| Layer | Location |
|-------|----------|
| Pack | `domain-research-step-patterns.md` — extend `workflowBriefConfig` when chartered |
| Runtime | `app.js` — generic interpreters; `continueWorkflowDesignGeneration` |
| Fixtures | `tests/fixtures/workflow-brief-research-sparse/` S1–S7 |
| Tests | `workflow-research-sparse-briefs.test.js` (S1–S6); `workflow-research-adequacy.test.js` (S7) |

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

**Checkpoint:** **91 passed**, 0 failed (2026-05-15). S1–S6 unchanged.

---

## Next candidate slices

1. **Slice 3A** — manual M0/M2/M4 + copy polish  
2. **Slice 3B** — dismiss / recommendation lifecycle  
3. **Slice 3C** — additional Research adequacy checks  
4. **Renderer contract** — separate charter

Details: [`SPRINT-18-CHECKPOINT.md`](SPRINT-18-CHECKPOINT.md).

---

## Review log

See `review-log.md`.
