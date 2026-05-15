# Sprint 19 index — Learning Design Workflow Rationalisation

**Pack path:** `docs/development/sprints/2026-05-15-sprint-19-ld-workflow-rationalisation/`  
**Date:** 2026-05-15  
**Status:** **Closed** — see [`SPRINT-19-CHECKPOINT.md`](SPRINT-19-CHECKPOINT.md) and [`docs/consolidation/sprint-19-closeout.md`](../../../consolidation/sprint-19-closeout.md)

**Entry point:** [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) (historical)

**Verification at closeout:** **118 passed**, 0 failed

---

## Portable pack (this folder)

| File | Purpose |
|------|---------|
| [`GPT-BOOTSTRAP-PROMPT.md`](GPT-BOOTSTRAP-PROMPT.md) | Fresh-chat entry + copy-paste block |
| [`HANDOVER.md`](HANDOVER.md) | Session handover |
| [`SPRINT-CONTEXT.md`](SPRINT-CONTEXT.md) | Goals, scope, risks |
| [`CURRENT-STATE.md`](CURRENT-STATE.md) | Test floor + file map |
| [`sprint-19-bootstrap.md`](sprint-19-bootstrap.md) | Thesis, phases, draft adequacy candidates |
| [`sprint-19-index.md`](sprint-19-index.md) | This index |
| [`review-log.md`](review-log.md) | Decisions log |

---

## Primary audit

| Document | Path |
|----------|------|
| LD workflow generation rationalisation audit | [`docs/audits/ld-workflow-generation-rationalisation-audit.md`](../../../audits/ld-workflow-generation-rationalisation-audit.md) |

---

## Sprint 18 reference (Research — do not regress)

| Document | Path |
|----------|------|
| Sprint 18 checkpoint | [`../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md`](../2026-05-15-sprint-18-contextual-workflow-refinement/SPRINT-18-CHECKPOINT.md) |
| Sprint 18 bootstrap | [`../2026-05-15-sprint-18-contextual-workflow-refinement/sprint-18-bootstrap.md`](../2026-05-15-sprint-18-contextual-workflow-refinement/sprint-18-bootstrap.md) |
| Architecture note | [`docs/consolidation/contextual-refinement-architecture-note.md`](../../../consolidation/contextual-refinement-architecture-note.md) |
| Slice 3C charter | [`docs/consolidation/sprint-18-slice-3c-charter.md`](../../../consolidation/sprint-18-slice-3c-charter.md) |
| Method vs output conflict proposal | [`docs/consolidation/sprint-18-research-method-vs-output-conflict-proposal.md`](../../../consolidation/sprint-18-research-method-vs-output-conflict-proposal.md) |

---

## Live repo (implementation sources)

| Area | Path |
|------|------|
| LD domain pack | `domains/learning-design/domain-learning-design-step-patterns.md` |
| Research domain pack | `domains/research/domain-research-step-patterns.md` |
| Runtime | `app.js` |
| Research sparse tests | `tests/workflow-research-sparse-briefs.test.js` |
| Research adequacy tests | `tests/workflow-research-adequacy.test.js` |
| Research conflict tests | `tests/workflow-research-conflict-exceptions.test.js` |

---

## Prompt Studio / Factory context

| Document | Path |
|----------|------|
| PS lessons (Sprint 18 context-files) | [`../2026-05-15-sprint-18-contextual-workflow-refinement/context-files/prompt-studio-workflow-factory-lessons.md`](../2026-05-15-sprint-18-contextual-workflow-refinement/context-files/prompt-studio-workflow-factory-lessons.md) |
| Refinement infrastructure audit | [`docs/audits/existing-refinement-infrastructure-audit.md`](../../../audits/existing-refinement-infrastructure-audit.md) |

---

## Verification

```bash
node --test tests/*.test.js
```

**At closeout:** **118 passed**, 0 failed.

---

## Slice charter placeholders (create when implementing)

| Slice | Charter path (to create) |
|-------|--------------------------|
| 19-1 | `docs/consolidation/sprint-19-slice-1-charter.md` |
| 19-2 | `docs/consolidation/sprint-19-slice-2-charter.md` |
| 19-3 | `docs/consolidation/sprint-19-slice-3-charter.md` |
