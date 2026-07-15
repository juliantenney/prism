# Sprint 61-E01 — Archetype extensibility (`evaluation_judgement`)

**Date:** 2026-07-15  
**Status:** Implemented (runtime + DLA guidance + tests)

## Production ID

```text
evaluation_judgement
```

Earlier conceptual inventory names **`evaluation`** and **`worked_judgement`** map to this single production ID. Do not emit those inventory names as `instructional_archetype` values.

## SoT (unchanged)

```text
required_materials[].instructional_archetype
required_materials[].archetype_plan
```

## Plan shape

```json
{
  "instructional_archetype": "evaluation_judgement",
  "archetype_plan": {
    "question": "...",
    "criteria": ["...", "..."],
    "evidence": ["..."],
    "tradeoffs": ["..."],
    "judgement_focus": "..."
  }
}
```

Validation: `question` and `judgement_focus` non-empty; `criteria` ≥ 2; `evidence` ≥ 1; `tradeoffs` ≥ 1.

## Worked-example delivery (refinement `20260715-e01w`)

`RULES.evaluation_judgement` requires worked examples to **model** a complete evaluative sequence (criteria ↔ evidence → limitation/trade-off → weighing → justified conclusion on `judgement_focus`), not meta-advice about judgement quality. Templates prefer Initial position → Evidence assessed against the criteria → Competing interpretation or limitation → Final justified judgement (avoid duplicative Conclusion / Final judgement).

## Modules

- `lib/ld-instructional-archetype.js` (`SCRIPT_VERSION` `20260715-e01w`)
- `lib/ld-dla-page-enrich-contract.js` (planning guidance item 4)

No new persistence, assembly, or renderer architecture.
