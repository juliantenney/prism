# Sprint 68 — Implementation Plan

Phased plan. **No implementation in the setup task.**

---

## Phase 0 — Planning (complete)

- Sprint pack, handover, context files
- Investigation log seeded with bridging observation

## Phase 1 — Investigate (M1)

1. **S68-BL-001** — Activity bridging: JSON → model → HTML trace
2. **S68-BL-002** — Field inventory for all transition-like authoritative fields
3. Compare heteroscedasticity with at least one additional fixture
4. Record recommendation in investigation log

## Phase 2 — Implement renderer-first improvements (M2–M4)

Based on Phase 1 outcome:

- Inter-activity transition rendering (if data supports)
- Preamble / bridge / progression presentation tuning
- Beat entry prompt sequencing review
- Repetition reduction where authoritative

## Phase 3 — Schema gap register (M5)

Only if Phase 2 cannot achieve target coherence:

- Document missing fields with evidence
- Defer schema work to a later sprint

## Phase 4 — Close (M6)

- Regression suite green
- Fresh export artefact
- Human coherence review
- Closure document

---

## Decision rule

```text
IF authoritative field exists AND placement is wrong
  → fix render placement / model mapping
ELSE IF field absent in JSON across fixtures
  → log schema gap; do not invent copy
```
