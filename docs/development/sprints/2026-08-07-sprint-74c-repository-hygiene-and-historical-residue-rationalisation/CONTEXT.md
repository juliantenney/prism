# Sprint 74C — Context

**Status:** **OPEN** (opened 2026-08-07) — planning only  
**Role:** Durable context for repository hygiene & historical residue rationalisation  
**Parent:** Sprint 74 wrapper — **OPEN**; Sprint 75 **Not opened**  
**Predecessors:** Sprint 74A · Sprint 74B — **COMPLETE / Closed**  
**Scope authority:** [S74-programme-post-74B-review.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-programme-post-74B-review.md) (narrowed R1)

---

## Why this sprint exists

After 74A (sole vNext export) and 74B (partial → capture → validation → assemble), supported **architectural** ownership for the page spine is consolidated. Remaining work that fits Sprint 74 is **repository hygiene**, not another ownership domain.

The post-74B review rejected opening original Domain C unchanged (scratch + PB-S-001 mixed). Operator authorised **narrowed R1**: scratch/archive/probe classification and cleanup only.

## Governing principle

> If removing something requires reasoning about current product behaviour, it does not belong in 74C.

## Durable facts

- 74C is **hygiene**, not architectural redesign.  
- **PB-S-001** remains investigation-needed / not sprint-ready — **excluded**.  
- WR orphan cleanup remains blocked on **PB-R-008** — **excluded**.  
- **PB-FA-004** is product backlog — **excluded**.  
- Git history preserves removed implementations; active `_archive/` must earn its keep via a concise policy (T-020).  
- Protect: sprint evidence packs, certification `artifacts/`, current fixtures, current generated browser artefacts, current build outputs, focused test guardians.

## Binding constraints

[ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) — browser-only; static deployment; one definitive implementation (`S74-D07`); pre-release Compatibility not default (`S74-D09`).

## Engineering disciplines (inherited)

[ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) — **do not duplicate**.

Key practices for 74C:

- Inventory before removal  
- Reference audit before deletion  
- Residue sweep after each slice  
- Small reversible commits  
- Repository history is the archive (do not retain obsolete active code solely for history)

## Explicit exclusions

| Item | Why |
| ---- | --- |
| PB-S-001 | Not sprint-ready; fixture enrichment can mask bugs |
| Broad-suite greenwashing | Focused guardians remain authoritative |
| Runtime / product paths | Out of hygiene charter |
| WR orphans / PB-FA-004 | Policy / product — not 74C |
| Sprint 75 | Not opened |

## Predecessor links

| Kind | Link |
| ---- | ---- |
| Post-74B review | [S74-programme-post-74B-review.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-programme-post-74B-review.md) |
| Sprint 74B closure | [S74B-T-050](../2026-08-07-sprint-74b-generation-contract-capture-validator-hygiene/S74B-T-050-final-verification-and-sprint-closure.md) |
| Sprint 74A outcome | [SPRINT-74A-FINAL-REPORT.md](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-FINAL-REPORT.md) |
| Original Domain C sketch | [S74-T-010](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/S74-T-010-rationalisation-domain-refinement.md) *(historical)* |
