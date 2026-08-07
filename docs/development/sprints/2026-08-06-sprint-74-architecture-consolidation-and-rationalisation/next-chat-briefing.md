# Sprint 74 — Next-chat briefing

**Pack status:** **OPEN** (programme wrapper)  
**Theme:** Architecture Consolidation and Rationalisation — **one definitive codebase**  
**Decisions:** `S74-D01`…`S74-D09`  
**Constraints:** [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md)  
**Disciplines:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  
**Active work:** [Sprint 74B](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/next-chat-briefing.md)

---

## One-line mission

**Sprint 74B is OPEN** — T-030 Done; next is **S74B-T-040** under `S74-D09` / `S74B-D03`. Implement in the 74B pack. Do **not** open 74C.

> Preserve current intended functionality, not historical pre-release data shapes or superseded implementation behaviour.

Architectural constraints define what Prism must remain; Engineering Disciplines define how consolidation work is carried out safely.

---

## Binding constraints

See [ARCHITECTURAL-CONSTRAINTS.md](ARCHITECTURAL-CONSTRAINTS.md) — especially Constraint 2 / **`S74-D07`** and pre-release Compatibility / **`S74-D09`**.

---

## Read first (active work)

1. [Sprint 74B START HERE](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/SPRINT-74B-START-HERE.md)  
2. [S74B-T-030 reconciled plan](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/S74B-T-030-deprecated-helper-compose-legacy-validator-removal-plan.md)  
3. [S74-D09](decisions.md#s74-d09--pre-release-compatibility-is-not-a-default-requirement) · [S74B-D03](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/decisions.md#s74b-d03--historical-pre-release-workflowrunstate-compatibility-does-not-block-rationalisation)  
4. [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md)  

---

## Sub-sprint status

| Sprint | Status |
| ------ | ------ |
| **74A** | **COMPLETE / Closed** |
| **74B** | **OPEN** — T-001…T-030 Done; T-040 Not started |
| **74C** | **Not opened** |

---

## Hard rules

- Implement in the **74B pack**, not this wrapper  
- Compatibility is **opt-in** by explicit product requirement (`S74-D09`)  
- No 74C; no Authoring export-path changes  
- Node-based tests ≠ deployment proof  
- Do not begin T-040 until authorised  
