# Sprint 89 — Charter

**Status:** **COMPLETE / CLOSED** — [S89-D08](decisions.md#s89-d08--close-sprint-89--architectural-consolidation-complete)

## Why this sprint exists

Interactive, Expository, and Assessment Pack are now sibling first-class products. Their educational purposes differ. Their creation, artefact chain, and publishing path are better understood than when much of the surrounding architecture was written.

The next product programme — Outcomes Map, Course Home, and any further first-class product — should not be wired into leftover patterns only because those patterns are already in the code.

## Objective

> Bring the implementation into alignment with PRISM's now-established first-class product and pipeline model before extending that model further.

This is consolidation of architecture that recent first-class work has made clearer. It is not generic technical-debt cleanup.

## Established model (do not reopen)

- Three first-class learning-resource products: Interactive Resource, Expository Resource, Assessment Pack. Shared infrastructure does not imply shared instructional reasoning. Reuse subsystem contracts, not instructional prompts.
- Known product → known workflow, constructed deterministically from the product, the focus or source, and the product parameters. Generated workflows are for unknown processes. Custom workflows are for a process the author specifies. Known process → encode it. Unknown process → reason about it.
- Model stages create or transform intellectual content. Deterministic code does known plumbing, transport, assembly, and publishing.
- Model stages create or transform authoritative artefacts. Deterministic assembly transports and combines the artefacts that product needs, without loss.
- Every first-class product works on its own. Another product’s completed output may be source material. The receiver runs its own source pipeline. Do not splice product workflows together.
- Adding a first-class product should increasingly look like adding a member to a product family, not modifying PRISM throughout the codebase. That is a direction. It is not a decision to build a registry, plugin system, or schema.

[S89-D02](decisions.md#s89-d02--first-class-product-pipelines-are-predetermined) is decided: those three products have predetermined pipelines. Workflow elicitation is not how they are created. Asking for topic, source, audience, parameters, constraints, or preferences is input acquisition. Custom remains the place for a process the author specifies outside those pipelines.

## Investigation order

Trace the current pipeline from Domain Packs through the three real products before any hypothetical fourth product. Domain Packs are in scope as the starting point: what they own, and which of those duties are domain-level, product-level, workflow construction, stage contracts, older elicitation machinery, still useful, or legacy. Do not decide to remove them. The fourth-product check comes afterwards, against the architecture those traces reveal.

## Scope that may be agreed later

Only after those traces, and only where the evidence supports it:

- remove obsolete paths that the investigation shows are unused for the established model;
- simplify first-class product creation;
- reduce accidental product-specific branching;
- remove dead state or concepts that the investigation identifies;
- consolidate duplicated plumbing;
- clarify shared contracts that are already established;
- strengthen tests around those contracts.

Existing Interactive, Expository, and Assessment journeys are the behavioural baseline.

## Non-goals

- Outcomes Map implementation ([PB-FA-014](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-014--outcomes-map))
- Course Home implementation ([PB-FA-016](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-016--course-home--course-assembly))
- Scenario, Problem, guided practice, or Situated Task implementation ([PB-FA-015](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-015--additional-first-class-learning-resource-pipelines))
- speculative design of future products
- a generic plugin, framework, or product registry without evidence
- general code cleanup
- redesign of working pedagogy
- abstraction for hypothetical requirements that the diagnostic did not show
- Assessment Pack real-use calibration (recorded separately; not this sprint)

Not every educational job an Outcomes Map identifies has to become a first-class product. That principle motivates consolidation. It must not be turned into architecture during this sprint.

## Stopping condition

> Adding another sibling first-class product could follow the established product and pipeline model without propagating known historical architectural accidents.

Product-specific work for a real new product can still be required. The stop is when the known accidents are no longer the path a fourth product would have to copy. Close only when that condition is met and the existing first-class journeys still hold.
