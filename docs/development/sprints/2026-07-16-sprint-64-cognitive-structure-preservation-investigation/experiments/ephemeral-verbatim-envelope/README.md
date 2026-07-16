# Ephemeral Verbatim Envelope — Bounded Prototype

Non-production Sprint 64 S64-BL-004b experiment.

| File | Role |
| ---- | ---- |
| `eligible-samples.json` | Eligible samples + ephemeral envelopes |
| `excluded-samples.json` | Fail-closed exclusions |
| `envelopes.ephemeral.json` | Diagnostic envelopes (not a schema) |
| `tier1-tier2-comparisons.md` | T2 vs T1 deltas |
| `provenance-traces.json` | Field → element traces |
| `evaluation.md` | Success criteria |
| `build-prototype.js` | Regenerator |

**Report:** [../../bounded-prototype-ephemeral-verbatim-envelope.md](../../bounded-prototype-ephemeral-verbatim-envelope.md)

```bash
node build-prototype.js
```

Do not merge into production pages or renderer.
