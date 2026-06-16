# Sprint 45 — Pattern-Guided Generation

**Status:** Proposed — **not yet started** (not approved)  
**Folder:** `docs/development/sprints/2026-06-18-sprint-45-pattern-guided-generation/`  
**Entry point for fresh chats:** [`context-pack/06-fresh-chat-bootstrap.md`](context-pack/06-fresh-chat-bootstrap.md) (+ full [`context-pack/`](context-pack/))  
**Short handover:** [`sprint-45-chat-handover-pack.md`](sprint-45-chat-handover-pack.md)  
**Prior sprint (closed):** [`../2026-06-15-sprint-44/`](../2026-06-15-sprint-44/)

---

## Sprint purpose

Sprint 45 would test whether **evidence-backed instructional patterns** from Sprint 44 can **influence GAM generation quality** — measured by 44-2 contracts and pattern detection signals — **without** reopening educational architecture, redesigning contracts, or treating patterns as unvalidated prompt dumps.

Sprint 44 made instructional quality observable, measurable, and reusable. Sprint 45 would ask whether that reusability changes what the pipeline produces.

**This sprint is a proposal.** See [`../2026-06-15-sprint-44/sprint-45-proposal.md`](../2026-06-15-sprint-44/sprint-45-proposal.md). Work should not begin until explicitly approved.

---

## Key source documents (Sprint 44)

| Document | Role |
| -------- | ---- |
| [`../2026-06-15-sprint-44/sprint-44-outcomes.md`](../2026-06-15-sprint-44/sprint-44-outcomes.md) | Sprint 44 deliverables and definition of done |
| [`../2026-06-15-sprint-44/sprint-44-review.md`](../2026-06-15-sprint-44/sprint-44-review.md) | Sprint 44 closure narrative |
| [`../2026-06-15-sprint-44/sprint-45-proposal.md`](../2026-06-15-sprint-44/sprint-45-proposal.md) | Source proposal for Sprint 45 scope |
| [`../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md`](../2026-06-15-sprint-44/sprint-44-2-instructional-depth-contracts.md) | Evaluation rubric — unchanged |
| [`../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md`](../2026-06-15-sprint-44/sprint-44-3-instructional-pattern-library.md) | Pattern Library architecture |
| [`../2026-06-15-sprint-44/patterns/`](../2026-06-15-sprint-44/patterns/) | SP-01–SP-06 Draft 1 entries |
| [`../2026-06-15-sprint-44/benchmark-corpus/`](../2026-06-15-sprint-44/benchmark-corpus/) | Frozen Marx and Photosynthesis fixtures |

---

## Folder contents

| Path | Role |
| ---- | ---- |
| [`context-pack/`](context-pack/) | Full continuation package for fresh chats (6 docs + README) |
| [`sprint-45-chat-handover-pack.md`](sprint-45-chat-handover-pack.md) | Short handover |
| [`sprint-45-current-frontier.md`](sprint-45-current-frontier.md) | Proposed frontier |
| [`sprint-45-slice-index.md`](sprint-45-slice-index.md) | Proposed slice index |

Sprint 45 does not duplicate Sprint 44 artefacts. Patterns, contracts, and benchmark corpus remain in the Sprint 44 folder.

---

## Proposed slices

| Slice | Title | Status |
| ----- | ----- | ------ |
| **45-1** | Pattern Injection Experiment | Proposed |
| **45-2** | Pattern-Aware Evaluation | Proposed |
| **45-3** | Regression Against Benchmark Corpus | Proposed |
| **45-4** | Material-Level Repair Strategy | Proposed |

Details: [`sprint-45-slice-index.md`](sprint-45-slice-index.md)

**Recommended first slice (if approved):** 45-1 using SP-02 (`decision_table`) and SP-03 (`transfer_prompt`).

---

## Inherited context (do not reopen)

- Sprint 43 architectural decisions remain settled
- Investigation-primary / resource-secondary ownership accepted
- Presence ≠ salience accepted
- Missing-stage and missing-upstream-pedagogy hypotheses disproved
- 44-2 contracts accepted and validated
- Pattern Library Draft 1 and meta-principles MP-1–MP-8 are documentary synthesis only
- Capture/channel artefacts (stub outputs, page-composition loss) are distinct from instructional material quality

---

## Approval

Sprint 45 requires **explicit approval** before implementation or experimentation begins. Until then, treat all slices as proposed and all workstreams as design-phase only.
