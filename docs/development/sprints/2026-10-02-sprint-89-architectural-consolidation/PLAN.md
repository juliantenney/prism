# Sprint 89 — Plan

**Status:** **COMPLETE / CLOSED**  
The sequence below is the plan as written at open. The work was done in investigations 1, 1B, and 2, then implementation slices 1–4. Close: [SPRINT-89-CLOSURE.md](SPRINT-89-CLOSURE.md).

1. Establish the repository-grounded pipeline baseline from Domain Packs onward. The conceptual path to account for, without assuming the code is organised this way, is: domain responsibilities → product selection → author input and product parameters → persisted authoring state → topic, source, or product-output input mode → predetermined first-class workflow selection and construction → stage definitions and subsystem contracts → model execution → authoritative artefact creation → artefact transport and transformation → product-specific design and authorship → deterministic assembly → preview and rendering → publishing → final first-class output → optional reuse as source for another product.  
2. Trace Interactive Resource end to end, including where they apply: topic or focus, source, product output as source, product parameters, predetermined workflow construction, model stages, the artefact chain, deterministic operations, assembly, preview and rendering, and publishing.  
3. Trace Expository Resource the same way.  
4. Trace Assessment Pack the same way.  
5. Compare the three real pipelines. Identify genuinely shared responsibilities, genuinely product-specific responsibilities, duplicated plumbing, historical assumptions, elicitation or workflow-generation remnants, inconsistent placement of responsibility, and uncertain areas.  
6. Reconcile those findings with [S88-AD-001…006](../2026-09-28-sprint-88-default-product-workflows-and-assessment-architecture/ARCHITECTURAL-DEBT.md). Do not treat those items as already decided.  
7. Only then apply the hypothetical fourth-product diagnostic to the architecture the real traces revealed. The question is whether adding another sibling would propagate historical accidents. Classify significant touchpoints as a legitimate shared contract, legitimate product-specific implementation, accidental coupling, legacy architecture, or uncertain. Do not let the hypothetical product drive speculative abstractions.  
8. Agree the bounded consolidation work that the evidence supports.  
9. Implement only that agreed work.  
10. Validate the existing Interactive, Expository, and Assessment journeys.  
11. Close the sprint when the charter stopping condition is met.

Domain Packs are the start of the investigation. The traces must establish what they currently own, and which of those responsibilities are domain-level, product-level, workflow construction, stage or subsystem contracts, leftovers of elicitation and workflow generation, still useful, or legacy or duplicated. Do not decide in advance to remove them.

Do not implement from this plan. Do not open Outcomes Map, Course Home, or a candidate product as work inside these steps.
