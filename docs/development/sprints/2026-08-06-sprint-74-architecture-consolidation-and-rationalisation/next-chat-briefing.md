# Sprint 74 — Next-chat briefing

**Pack status:** **OPEN** (programme wrapper)  
**Theme:** Architecture Consolidation and Rationalisation — **one definitive codebase**  
**Decisions:** `S74-D01`…`S74-D08`  
**Constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)  
**Disciplines:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
**Active work:** [Sprint 74B](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/next-chat-briefing.md)

---

## One-line mission

**Sprint 74B is OPEN** — generation-contract hygiene with **ownership inventory first**. Implement in the 74B pack. Do **not** open 74C.

Architectural constraints define what Prism must remain; Engineering Disciplines define how consolidation work is carried out safely.

---

## Binding constraints

See [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) — especially Constraint 2 / **`S74-D07`**.

---

## Read first (active work)

1. [Sprint 74B START HERE](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/SPRINT-74B-START-HERE.md)  
2. [S74B-T-010 baseline](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/S74B-T-010-generation-pipeline-architectural-discovery.md)  
3. [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
4. [S74-D08](decisions.md#s74-d08-operator-approval-opens-sprint-74b)  

---

## Sub-sprint status

| Sprint | Status |
| ------ | ------ |
| **74A** | **COMPLETE / Closed** |
| **74B** | **OPEN** — T-010 Done; T-020 next (Not started) |
| **74C** | **Not opened** |

---

## Hard rules

- Implement in the **74B pack**, not this wrapper  
- Ownership inventory **before** removal  
- No 74C; no Authoring export-path changes  
- Node-based tests ≠ deployment proof  
