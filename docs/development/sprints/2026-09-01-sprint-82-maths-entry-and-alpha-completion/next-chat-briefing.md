# Sprint 82 — Next-chat briefing

**Sprint status:** **OPEN**  
**Current gate:** **S82-G2B** — implement alpha MathLive treatment (**AUTHORISED**)  
**Treatment:** [S82-D02](decisions.md#s82-d02--gate-2a-outcome-go-alpha-mathlive) — **A — GO ALPHA MATHLIVE**  
**Handover:** [HANDOVER.md](HANDOVER.md)

---

## Context

| Fact | State |
| ---- | ----- |
| Product | **WORKING ALPHA** |
| Gate | `test:first-class` **339/339** |
| Sprint 81 | **CLOSED** |
| S82-G1 | **COMPLETE** — semantic `input_modality` |
| S82-G2 | **COMPLETE** — renderer seam diagnosed |
| S82-G2A | **COMPLETE** — MathLive spike + [evidence](S82-G2A-spike-evidence.md) |
| S82-D02 | **ACCEPTED** — GO ALPHA MATHLIVE |
| **Next** | **S82-G2B** — production hardening + ship |

## Product one-liner

Gate 1 commissions maths fields; G2B hardens MathLive as the alpha interaction while preserving `text_entry` TeX persistence and textarea fallback.

## G2B must address (from G2A evidence)

- Harden `inputModality` propagation (not spike-only)
- Label / math-field focus association
- Tab / Shift+Tab exit
- Virtual-keyboard policy
- AT duplicate-control review
- 200% zoom/reflow
- Learner-package asset paths
- Realistic Lagrangian workflow (non-TeX construction validation)

Unresolved G2A browser rows stay **unresolved** until G2B/G3 verify — do not mark as passed retroactively.

## Canonical evidence

```json
{ "kind": "text_entry", "value": { "text": "<TeX string>" } }
```

Textarea remains canonical + fallback.

## Do not

- Reopen Sprint 81 surface architecture
- Build rich mixed editor, CAS, table maths (unless live validation forces close blocker)
- Remove spike naming in this step (G2B scope)
- Claim WCAG conformance or production readiness

## Reference

- [PLAN.md](PLAN.md) §S82-G2B  
- [S82-G2A-spike-evidence.md](S82-G2A-spike-evidence.md)
