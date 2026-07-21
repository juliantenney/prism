# Sprint 68 — Objectives and Scope

## Objectives

1. Improve learner-perceived continuity where authoritative lesson fields already support it.
2. Validate the pipeline/renderer boundary — classify gaps as renderer, render model, schema, or pipeline ownership.
3. Use authoritative lesson fields already in JSON and the vNext page model; do not invent copy.
4. Document genuine schema and pipeline gaps only after renderer-first and render-model paths are exhausted.
5. Preserve vNext renderer stability and regression coverage.
6. Produce evidence-based recommendations for lesson model evolution.

Deferring an improvement is success when the required pedagogical information does not exist in the current lesson model.

## In scope

* Investigation of bridge, preamble, progression and guidance field usage — with four-category classification
* Render model gap analysis (JSON → page model mapping)
* Render placement and presentation changes in `lib/learner-renderer-vnext/`
* Coherence-focused tests and export review artefacts
* Multi-fixture comparison where needed for evidence
* Evidence-based deferred schema register for future pipeline work
* Documentation in this sprint pack

## Out of scope

* Renderer rewrite
* Sprint 67 CSS / navigation / export shell redesign
* Semantic iconography redesign
* Legacy renderer deletion
* Pipeline / GAM / Design Page schema changes (initially)
* Inventing instructional content absent from JSON

## Scope boundary with Sprint 67

Sprint 67 owns **renderer fidelity and export shell**. Sprint 68 owns **pedagogical coherence on top of that stable base** and **boundary validation** between pipeline authoring and renderer presentation. Do not reopen Sprint 67 work unless a coherence fix requires a minimal, justified presentation adjustment.
