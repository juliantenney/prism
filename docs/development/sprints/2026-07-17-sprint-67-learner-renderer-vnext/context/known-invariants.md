# Known Invariants — Sprint 67

Agreed renderer invariants for vNext. Automated tests must enforce these for the primary fixture; apply generally wherever data is present.

## Structure

1. Activity order follows `learning_sequence.ordered_activity_ids` when present.  
2. Beat functions/order follow `activity.episode_plan.beats` only.  
3. Do not invent beats from material types or prompt fields.  
4. Do not merge top-level `episode_plans[]` into activity plans.  
5. Empty learner-facing beats are omitted from the renderable model and from HTML.  
6. No empty `.util-beat-section` in output.

## Content ownership

7. Each material ID appears exactly once.  
8. Each numbered learner-task step appears exactly once.  
9. Each activity `expected_output` appears exactly once when present.  
10. Each checklist material appears exactly once.  
11. Framing (`activity_preamble`, `reasoning_orientation`) stays outside the material stream.  
12. Prompt fields retain `sourceField` provenance in the model.

## Ordering

13. Within a beat, materials follow declarative `materialOrder` then source order.  
14. Fixture-critical: A2-M3 before A2-M2; A5-M8 before A5-M7.

## Labelling

15. HTML headings use `learnerLabel` from resolved `learnerRole`.  
16. Source function remains in `data-beat-function` (or equivalent), not as the human heading.  
17. No raw schema tokens as learner-facing titles.

## Architecture

18. Single canonical page model before HTML.  
19. Renderers do not inspect original JSON.  
20. No heuristic scoring, sinks, consumption flags, or post-render insertion.  
21. No activity-ID-specific production branches.  
22. Ambiguous material assignment is a **validation error**, not a silent fallback.  
23. Legacy and vNext are never mixed in one render.  
24. Default production path remains legacy until rollout criteria pass.

## Heteroscedasticity association matrix (primary fixture)

```text
A1-M1 → Understand
A1-M2 → Check your work
A1-M3 → Check your work
A2-M1 → See it modelled
A2-M3 → Your turn
A2-M2 → Your turn
A4-M1 → Understand
A4-M2 → Understand
A4-M3 → Your turn
A5-M4 → Your turn
A5-M5 → Your turn
A5-M8 → Apply elsewhere
A5-M7 → Apply elsewhere
```

Non-empty rendered beat counts: A1=3, A2=4, A3=3, A4=3, A5=4.
