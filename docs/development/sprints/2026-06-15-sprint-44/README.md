# Sprint 44 — Instructional Depth and GAM Validation

**Status:** Closed — see [`sprint-44-outcomes.md`](sprint-44-outcomes.md)  
**Folder:** `docs/development/sprints/2026-06-15-sprint-44/` (all Sprint 44 documents live here)  
**Entry point for fresh chats:** [`context-pack/06-fresh-chat-bootstrap.md`](context-pack/06-fresh-chat-bootstrap.md) (+ full [`context-pack/`](context-pack/))  
**Short handover:** [`sprint-44-chat-handover-pack.md`](sprint-44-chat-handover-pack.md)  
**Prior sprint (closed):** [`../2026-06-12-sprint-43-educational-salience/`](../2026-06-12-sprint-43-educational-salience/)

---

## Folder contents

| Path | Role |
| ---- | ---- |
| [`context-pack/`](context-pack/) | Full continuation package for fresh ChatGPT (6 docs + README) |
| [`sprint-44-chat-handover-pack.md`](sprint-44-chat-handover-pack.md) | Short handover |
| [`sprint-44-current-frontier.md`](sprint-44-current-frontier.md) | Active frontier |
| [`sprint-44-slice-index.md`](sprint-44-slice-index.md) | Slice index |
| [`sprint-44-slice-1-tiered-gam-capture-gate.md`](sprint-44-slice-1-tiered-gam-capture-gate.md) | **44-1** design spec |
| [`sprint-44-2-instructional-depth-contracts.md`](sprint-44-2-instructional-depth-contracts.md) | **44-2** contracts (Draft 1) |
| [`sprint-44-3-instructional-pattern-library.md`](sprint-44-3-instructional-pattern-library.md) | **44-3** pattern library architecture |
| [`patterns/`](patterns/) | **44-3** pattern entries SP-01–SP-06 |
| [`benchmark-corpus/`](benchmark-corpus/) | Frozen Marx and Photosynthesis evaluation corpus |
| [`sprint-44-review.md`](sprint-44-review.md) | Sprint closure review |
| [`sprint-44-outcomes.md`](sprint-44-outcomes.md) | Deliverables and definition of done |
| [`sprint-45-proposal.md`](sprint-45-proposal.md) | Proposed next sprint (not approved) |

---

## Sprint purpose

Sprint 44 improves **learner-facing instructional material quality** for self-directed higher-education resources.

Sprint 43 closed the architectural investigation. Investigation-primary / resource-secondary ownership, salience diagnosis, and two-column manifestation direction are settled. Cross-domain testing (Marx, Photosynthesis) showed the architecture generalises; the remaining gap is **instructional material realisation**, not workflow architecture.

Sprint 44 work centres on:

- GAM capture safety (structural failures blocked before compose)
- Explicit instructional depth contracts for material types
- Material realisation quality on benchmark domains

---

## Active documents

| Document | Role |
| -------- | ---- |
| [`context-pack/`](context-pack/) | **Full continuation package** for fresh ChatGPT — 6 documents; start with `06-fresh-chat-bootstrap.md` |
| [`sprint-44-chat-handover-pack.md`](sprint-44-chat-handover-pack.md) | Short handover — settled ground, do-not-reopen list, next tasks |
| [`sprint-44-current-frontier.md`](sprint-44-current-frontier.md) | What Sprint 44 is doing now and what is out of scope |
| [`sprint-44-slice-index.md`](sprint-44-slice-index.md) | Slice status, links, and dependencies |

### Slice artefacts (authoritative per slice)

| Slice | Document | Location |
| ----- | -------- | -------- |
| **44-1** Tiered GAM capture validation gate | Design spec | [`sprint-44-slice-1-tiered-gam-capture-gate.md`](sprint-44-slice-1-tiered-gam-capture-gate.md) |
| **44-2** Instructional depth contracts | Educational design spec (Draft 1) | [`sprint-44-2-instructional-depth-contracts.md`](sprint-44-2-instructional-depth-contracts.md) |
| **44-3** Instructional pattern library | Draft 1 complete (architecture + SP-01–SP-06) | [`sprint-44-3-instructional-pattern-library.md`](sprint-44-3-instructional-pattern-library.md), [`patterns/`](patterns/) |

---

## Inherited from Sprint 43 (do not reopen)

See handover pack for full list. In short:

- Presence ≠ salience; pedagogy exists upstream
- Investigation-primary / resource-secondary ownership accepted
- Activities, materials, capability, judgement, and PEL are **supporting structures**
- Two-column manifestation accepted for learner-facing prototypes
- Marx prototype validated stronger manifestation; Photosynthesis confirmed cross-domain architecture with material-realisation weakness
- Visual affordances are a **separate workflow** — not part of Sprint 44 instructional-depth work

---

## After Sprint 44

Sprint 44 educational-design work is complete. See [`sprint-44-review.md`](sprint-44-review.md) and [`sprint-44-outcomes.md`](sprint-44-outcomes.md).

**Proposed next sprint (not approved):** [`sprint-45-proposal.md`](sprint-45-proposal.md) — Pattern-Guided Generation.

**May continue in parallel:** **44-1** runtime capture gate implementation per [`sprint-44-slice-1-tiered-gam-capture-gate.md`](sprint-44-slice-1-tiered-gam-capture-gate.md).
