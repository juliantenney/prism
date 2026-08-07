# Sprint 74B — Decision Log

**Sprint status:** **OPEN** (2026-08-07)  
**Format:** ID · Decision · Status · Rationale · Consequences  

Inherited programme constraints are **linked, not duplicated** — [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md); parent decisions `S74-D01`…`S74-D08`.

Inherited working practice — [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) *(not duplicated here)*.

---

## S74B-D01 Open Sprint 74B for Generation-contract & capture-validator hygiene

- **Decision:** Operator approval has **opened Sprint 74B** — Generation-contract & capture-validator hygiene. The sprint implements **Domain B** from [S74-T-010](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md), as sequenced after Sprint 74A closure. Sprint 74 architectural constraints (`S74-D03`…`S74-D05`, `S74-D07`) and [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) remain **binding**. Sprint 74B does **not** open Sprint 74C. The first implementation task is **ownership-first investigation** (`S74B-T-010`). Pack initialisation (`S74B-T-001`) does **not** begin runtime implementation.
- **Status:** Accepted (2026-08-07)
- **Rationale:** Sprint 74A closed with sole vNext learner export verified. Domain B planning and post-74A methodology refinement establish ownership inventory before removal. Opening a bounded pack with explicit non-scope prevents export-path regression and 74C scope bleed.
- **Consequences:** Implementation proceeds under [PLAN.md](PLAN.md) starting at `S74B-T-010` when authorised. Removal or consolidation follows ownership proof. Authoring export remains out of scope. Parent Sprint 74 stays open as programme wrapper. Further decisions discovered during the sprint must be recorded as `S74B-D##` with evidence.

---

## Pending decisions

| Topic | Expected trigger |
| ----- | ---------------- |
| Whether compose/partial **code merge** enters 74B | After T-010/T-020 — default **docs-only first** |
| Specific removal slices | After T-030 plan — evidence gates each slice |
| Open Sprint 74C | After 74B closure or operator resequence |

Do not record consolidation or removal decisions without inventory evidence and explicit acceptance criteria.
