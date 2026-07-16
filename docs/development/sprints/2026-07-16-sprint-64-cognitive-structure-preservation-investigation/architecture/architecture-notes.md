# Sprint 64 — Architecture Notes

**Status:** Closed after S64-BL-005 (Outcome C)  
**Constraint:** Descriptive and comparative only — not a production design.

## Known boundary (from Sprint 63, refined)

```text
DLA (plan on required_materials)     ← earliest intact structure
→ GAM routing (ephemeral consume)
→ materials[] bodies (structured plan absent)  ← irreversible flatten for materials channel
→ required_materials may still hold plan       ← orphaned / path-dependent
→ preserve / normalize (no plan consumers)     ← viable bridge locus (unused today)
→ renderer (no plan consumers)
```

**Authoritative map:** [candidate-preservation-attachment-points.md](../candidate-preservation-attachment-points.md)

## Topics for investigation

1. Attachment points → **Done (S64-BL-001)**  
2. Preservation mechanisms within Viable / Potentially Viable zones → **Done (S64-BL-002)** — see [candidate-preservation-mechanisms.md](../candidate-preservation-mechanisms.md)  
3. Bounded feasibility: correlation + retention survey → **Done (S64-BL-002b, Outcome B)** — see [source-to-material-correlation-and-retention-feasibility.md](../source-to-material-correlation-and-retention-feasibility.md)  
4. Manifestation contracts on path-gated artefacts → **Done (S64-BL-003)** — see [candidate-manifestation-contracts.md](../candidate-manifestation-contracts.md)  
5. Preservation + manifestation **location** comparison → **Done (S64-BL-004)** — see [preservation-and-manifestation-location-comparison.md](../preservation-and-manifestation-location-comparison.md)  
6. Bounded experiment-only prototype (Combo 6) → **Done (S64-BL-004b)** — see [bounded-prototype-ephemeral-verbatim-envelope.md](../bounded-prototype-ephemeral-verbatim-envelope.md)  
7. Sprint 64 recommendation → **Done (S64-BL-005, Outcome C)** — see [sprint-64-final-recommendation.md](../sprint-64-final-recommendation.md)  

## Close position

* Experimental path established; production design **not** selected.  
* Future production-readiness investigation (frequency/value/retention) recommended only — **not started**.

## Explicitly out of scope here

Schema proposals, taxonomy redesign, renderer architecture replacement.
