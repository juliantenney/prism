# Sprint 74 — Next-chat briefing

**Pack status:** **OPEN** (2026-08-06) — T-001 + T-010 complete; constraints binding; 74A not opened  
**Theme:** Architecture Consolidation and Rationalisation  
**Decisions:** `S74-D01`…`S74-D05`  
**Constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)

---

## One-line mission

**Await operator approval, then open Sprint 74A** (Authoring → learner export path integrity). Do **not** implement under the Sprint 74 wrapper. No runtime changes until 74A is opened and scoped.

## Planning principle

> A backlog item should only enter a sprint when it has a concrete implementation approach, clear ownership and acceptance criteria.

---

## Binding constraints (must carry into 74A)

1. **Browser-only runtime** — production is HTML/JS/CSS + browser APIs; Node is tooling only.  
2. **One supported path** — one authoritative implementation; label Compatibility.  
3. **`app.js` by ownership** — no size-driven split.  
4. **Static deployment** — `index.html` bootstrap; no backend; no runtime compilation for end users.

Full text: [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md).

---

## Read first

1. [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)  
2. [S74-T-010-rationalisation-domain-refinement.md](S74-T-010-rationalisation-domain-refinement.md)  
3. [decisions.md](decisions.md) (`S74-D02`…`S74-D05`)  
4. [STATUS.md](STATUS.md) · [PLAN.md](PLAN.md)

---

## Immediate sequence

1. Operator approves opening **Sprint 74A** (or requests S74-T-011 / changes).  
2. On approval: create **Sprint 74A pack** from Domain A in T-010 — still no drive-by cleanup.  
3. Verify **production browser path**; treat Node-based suites as **test evidence**, not deployment proof.  
4. Do **not** open 74B / 74C yet.  
5. Do **not** split `app.js` by size.

---

## Recommended order (not opened)

| Sprint | Domain |
| ------ | ------ |
| **74A** | Authoring → learner export path integrity |
| **74B** | Generation-contract & capture-validator hygiene |
| **74C** | Repository & fixture hygiene |

---

## Hard rules

- **No** runtime changes in the Sprint 74 wrapper after T-010  
- **No** 74A/B/C pack without operator approval  
- **No** Sprint 73 reopen  
- **No** backend / runtime Node / non-static deployment  
- Legacy **inventory** in 74A; Legacy **deletion** not in 74A  
- Continuous verification (`S72-D14`) if regressions appear  

---

## Predecessor gold links

- [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)  
- [S74-T-010](S74-T-010-rationalisation-domain-refinement.md)  
- [SPRINT-73-FINAL-REPORT.md](../2026-08-06-sprint-73-workflow-resources/SPRINT-73-FINAL-REPORT.md)  
- [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) (PB-FA-003)  
