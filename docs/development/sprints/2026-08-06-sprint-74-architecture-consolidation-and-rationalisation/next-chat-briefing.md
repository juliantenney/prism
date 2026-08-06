# Sprint 74 — Next-chat briefing

**Pack status:** **OPEN** (programme wrapper) — Sprint 74A **OPEN**  
**Theme:** Architecture Consolidation and Rationalisation — **one definitive codebase**  
**Decisions:** `S74-D01`…`S74-D07`  
**Constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)  
**Active work:** [Sprint 74A](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/next-chat-briefing.md)

---

## One-line mission

**Continue Sprint 74A** (vNext sole learner renderer; remove obsolete renderer). Do **not** implement under this wrapper. Next 74A task: **S74A-T-045** (Not started).

---

## Binding constraints

See [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) — especially Constraint 2 / **`S74-D07`** (definitive codebase; Compatibility only for current product requirements).

---

## Read first (active work)

1. [Sprint 74A START HERE](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-START-HERE.md)  
2. [S74A-D02](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/decisions.md#s74a-d02--vnext-replaces-the-obsolete-learner-renderer)  
3. [S74-D07](decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  

---

## Sub-sprint status

| Sprint | Status |
| ------ | ------ |
| **74A** | **OPEN** — obsolete renderer removal Accepted |
| **74B** | Not opened |
| **74C** | Not opened |

---

## Hard rules

- Implement in the **74A pack**, not this wrapper  
- Evidence-led removal of obsolete alternatives is the intended outcome when covered (`S74-D07`)  
- Do not retain obsolete learner renderer as Compatibility by default  
- No 74B / 74C yet  
- Node-based tests ≠ deployment proof  
