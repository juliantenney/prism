# Sprint 73 — Next-chat briefing

**Pack status:** **OPEN** (2026-08-06)  
**Theme:** Workflow Resources  
**Backlog anchor:** [PB-FA-001 — Workflow Resources](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-001--workflow-resources)

---

## One-line mission

**Implement the bounded Phase 2 generated-image persistence slice** under [S73-T-010 acceptance criteria](S73-T-010-phase-2-acceptance-criteria.md) and `S73-D02` conditions.

## Planning principle

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria.

Phase 1, the feasibility gate, and acceptance criteria are complete; implementation (`S73-T-011`) is next and not yet started.

---

## Read first

1. [SPRINT-73-START-HERE.md](SPRINT-73-START-HERE.md)  
2. [SPRINT-73-CHARTER.md](SPRINT-73-CHARTER.md)  
3. [CONTEXT.md](CONTEXT.md) · [PLAN.md](PLAN.md)  
4. [decisions.md](decisions.md) (`S73-D01`, `S73-D02`; inherited `S72-D09`, `S72-D10`)

---

## Immediate sequence

1. Read [S73-T-011-generated-image-persistence-implementation.md](S73-T-011-generated-image-persistence-implementation.md).  
2. Execute **S73-T-012** — verification matrix + browser proof per T-010.  
3. Stop and escalate per T-010 §9 if stop/pivot conditions are met.

---

## Design constraints (Phase 1)

- **Resource-type neutrality:** persistence architecture must not be specialised for images.  
- **Prompt-independence:** evaluate whether a persisted resource remains usable without its generating prompt.

---

## Hard rules

- **Do not assume** persistence is feasible or already partially implemented  
- **Do not reopen** Sprint 71 or Sprint 72 instructional evidence  
- **Do not expand** into PB-FA-002, PB-FA-003, or unrelated backlog items  
- **Do not implement** PDF, Word, or video resources in this sprint  
- **Do not change** evidence architecture unless discovery proves narrow necessary coupling  
- Continuous verification: on regression, stop → fix owning layer → focused coverage (`S72-D14`)  
- Do not claim the broader evidence-centred suite is green

---

## Language discipline

Prefer: **investigate**, **determine**, **establish**, **evaluate**.  
Avoid: implying solutions already exist or Phase 2/3 are committed.

---

## Predecessor gold links

- [SPRINT-72-FINAL-REPORT.md](../2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-FINAL-REPORT.md)  
- [SPRINT-72-CLOSURE.md](../2026-07-31-sprint-72-productising-instructional-architecture/SPRINT-72-CLOSURE.md)  
- [decisions.md](../2026-07-31-sprint-72-productising-instructional-architecture/decisions.md) (`S72-D09`, `S72-D10`)  
- [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md)
