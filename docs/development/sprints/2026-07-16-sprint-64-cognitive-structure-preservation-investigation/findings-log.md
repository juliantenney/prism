# Sprint 64 — Findings Log

| ID | Date | Finding | Confidence | Links |
| -- | ---- | ------- | ---------- | ----- |
| S64-F01 | 2026-07-16 | High-value structure already lives on DLA `required_materials`; materials[] channel flattens at GAM hydration; `required_materials` may remain orphaned | High | [candidate-preservation-attachment-points.md](candidate-preservation-attachment-points.md) |
| S64-F02 | 2026-07-16 | Viable zones = retain/bridge existing plan fields (A/D/G); prose recovery not viable | High | same |
| S64-F03 | 2026-07-16 | Strong mechanism candidates: retain required_materials (A), opaque `material_id` reference (D), preserve bridge (E); subset (C) premature to freeze; full plan on materials (B) high coupling | High | [candidate-preservation-mechanisms.md](candidate-preservation-mechanisms.md) |
| S64-F04 | 2026-07-16 | `material_id` is intended 1:1 correlation key; not proven across partial paths — feasibility experiment required before manifestation contracts | High | same |
| S64-F05 | 2026-07-16 | Outcome B: 52/52 exact 1:1 when both sides present; partial/material-only omit `required_materials` — gate A/D/E | High | [source-to-material-correlation-and-retention-feasibility.md](source-to-material-correlation-and-retention-feasibility.md) |
| S64-F06 | 2026-07-16 | Strong contracts: A opaque, B verbatim envelope, F ephemeral; reject C generic projection & D-alone instructions; next = location comparison | High | [candidate-manifestation-contracts.md](candidate-manifestation-contracts.md) |
| S64-F07 | 2026-07-16 | Strong prototype locations: Combo 6 (experiment-only) then Combo 1; reject renderer interpretation; ephemeral envelope; no material-level full-plan copy yet | High | [preservation-and-manifestation-location-comparison.md](preservation-and-manifestation-location-comparison.md) |
| S64-F08 | 2026-07-16 | Ephemeral verbatim envelope prototype succeeded: 3/3 eligible archetypes, fail-closed exclusions, full provenance, no production changes | High | [bounded-prototype-ephemeral-verbatim-envelope.md](bounded-prototype-ephemeral-verbatim-envelope.md) |
| S64-F09 | 2026-07-16 | Sprint 64 Outcome C: architecture + experimental feasibility established; production implementation not justified; future production-readiness investigation (frequency/value/retention) recommended only | High | [sprint-64-final-recommendation.md](sprint-64-final-recommendation.md) |

Do not restate Sprint 63 findings here; cite [sprint-63-authoritative-findings.md](../2026-07-16-sprint-63-cognitive-flow-and-reasoning-visibility/sprint-63-authoritative-findings.md).
