# Session Handover — Sprint 18 portable pack

**Role:** authoritative for **this pack only**.

**Pack path:** `docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/`

**Date:** 2026-05-15

---

## What this pack is for

Portable context for **Sprint 18 — Contextual Workflow Refinement**. Physical copies in **`context-files/`** support assistants without the full repo; refresh from canonical paths when policies change.

**Entry point for a fresh chat:** **`GPT-BOOTSTRAP-PROMPT.md`** (includes copy-paste block).

---

## Sprint 17 closed — Sprint 18 active

| Sprint | Status |
|--------|--------|
| **Sprint 17** | **Closed** — Slices 0–5; **85 tests green**; `explicitExtract` deferred |
| **Sprint 18** | **Bootstrap** — docs/exploration; implementation charter not yet in this pack |

---

## Sprint 18 purpose

Move from **factor-only elicitation** to **workflow-aware refinement**:

1. Keep **deterministic essentials** (Sprint 17 guardrails).  
2. Use **workflow generation** as the **elicitation substrate** (steps reveal plan commitments).  
3. Add **contextual, recommendation-driven** refinement — usually **non-blocking** — for planning **adequacy** and fit.  
4. Prove on **Research** before LD rollout.

**Not in scope:** renderer, schema redesign, Prompt Studio merge, LD implementation (default), broad UI redesign.

---

## Architectural breakthrough (handoff summary)

> Resolving required factors makes planning **safe**; seeing the **designed workflow** makes planning **discussable**.

Sprint 17 smoke test: all four Research essentials resolved for an executive briefing on “AI governance risks”, but no **topic scope** question before thematic analysis steps appeared. That gap motivates Sprint 18 — not a Sprint 17 defect.

---

## Four concepts (must stay distinct)

| Concept | Blocking? |
|---------|-----------|
| **Required essentials** | Yes when missing/unsafe |
| **Proceedability** (proceed gates) | Yes for specific heuristic steps |
| **Refinement opportunities** | Usually no |
| **Workflow-quality enrichment** | No (derived signals) |

---

## What this pack contains

| File | Purpose |
|------|---------|
| `GPT-BOOTSTRAP-PROMPT.md` | Fresh-chat bootstrap + copy-paste block |
| `HANDOVER.md` | This file |
| `SPRINT-CONTEXT.md` | Focus, boundaries, read-first |
| `CURRENT-STATE.md` | Active sprint pointer |
| `sprint-18-bootstrap.md` | Primary architecture bootstrap |
| `sprint-18-index.md` | Pack index |
| `review-log.md` | Decisions / open questions |
| `context-files/` | Snapshots (see README) |

---

## `context-files/` inventory

| Snapshot | Canonical source |
|----------|------------------|
| `sprint-17-implementation-summary.md` | `docs/consolidation/sprint-17-implementation-summary.md` |
| `sprint-17-index.md` | `docs/consolidation/sprint-17-index.md` |
| `sprint-17-topic-sufficiency-gap.md` | Implementation summary §12 |
| `sprint-17-research-elicitation-sparse-brief-prep.md` | `docs/consolidation/` (S1–S6) |
| `contextual-refinement-architecture-note.md` | `docs/consolidation/` |
| `workflow-aware-refinement-concepts.md` | `docs/exploration/` |
| `sprint-18-research-questions.md` | `docs/exploration/` |
| `existing-refinement-infrastructure-audit.md` | `docs/audits/` |
| `prompt-studio-workflow-factory-lessons.md` | Pack-authored distill |

**Live-only when implementing:** `domains/research/domain-research-step-patterns.md`, `tests/fixtures/workflow-brief-research-sparse/`, `app.js`.

---

## Sparse brief regression (carry forward)

| Fixture | Scenario |
|---------|----------|
| **S1** | Topic-only intent |
| **S2** | Upload language, no inputs |
| **S3** | Explicit source + audience |
| **S4** | Mixed analysis + briefing |
| **S5** | HTML-ready page delivery |
| **S6** | Minimal ambiguous |

Tests: `tests/workflow-research-sparse-briefs.test.js` — **do not break** when adding Sprint 18 behaviour.

**Planned:** **S7+** for topic sufficiency / adequacy (charter).

---

## Manual tests (Sprint 18)

See **`sprint-18-bootstrap.md` §13** — **M0** (smoke), **M1–M6** (S1–S6 parity), **M7–M8** (dismiss / AI review).

---

## Verification

```bash
node --test tests/*.test.js
```

**85 passed**, 0 failed (2026-05-15).

---

## What to do next

1. Open **`GPT-BOOTSTRAP-PROMPT.md`** — paste copy-paste block into fresh chat.  
2. Read **`sprint-18-bootstrap.md`** and **`context-files/sprint-18-research-questions.md`**.  
3. Confirm **85 tests** still pass.  
4. Narrow open questions in **`review-log.md`** (RQ-T1, RQ-B1, RQ-P1).  
5. When chartered: refinement context contract → one Research rule → S7 fixture — bounded diffs only.

---

## Review log

- **2026-05-15** — Sprint 18 handover pack equivalent to Sprint 17 bootstrap (docs only).
- **2026-05-15** — Prior bootstrap entries: architecture note, infrastructure audit, research questions.
