# Sprint 67 — Objectives and Scope

## Objectives

1. Render learner pages from the existing vNext page model without re-deriving associations in HTML code.  
2. Preserve authored structure: episode-plan order, learner-task steps, materials-by-id, expected output ownership.  
3. Prove golden-fixture invariants for heteroscedasticity.  
4. Ship behind an explicit renderer version selector; keep legacy default.  
5. Keep architecture exclusion tests green.

## In scope

* HTML modules under `lib/learner-renderer-vnext/`
* Minimal feature-flag entry point in the production Utilities export path
* Tests listed in [testing-strategy.md](testing-strategy.md)
* Human review notes for the primary fixture
* Documentation updates in this sprint pack

## Out of scope

* Legacy renderer retirement  
* Deleting `ld-beat-assignment-compose` / registry (Sprint 68 draft)  
* Pipeline / schema / GAM redesign  
* New instructional content generation  
* CSS redesign beyond mapping model fields to existing utility classes  

## Scope boundary with Sprint 66

Sprint 66 owns the **decision** and **model**. Sprint 67 owns **HTML → rollout**. Do not reopen the model architecture unless a hard validation error forces a rule change (then log a Sprint 67 decision).
