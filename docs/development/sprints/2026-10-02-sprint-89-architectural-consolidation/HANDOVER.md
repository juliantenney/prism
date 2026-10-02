# Sprint 89 — Handover

**Kind:** Open-sprint continuity  
**Sprint status:** **OPEN** — established; nothing investigated; nothing implemented  
**Opening:** [S89-D01](decisions.md#s89-d01--open-sprint-89--architectural-consolidation) · [S89-D02](decisions.md#s89-d02--first-class-product-pipelines-are-predetermined)

## Why a new chat should continue here

Sprint 88 closed the architecture of deterministic first-class workflows and of Assessment Pack as the third sibling product. The implementation still carries older patterns from before that model was clear. Sprint 89 exists so later work is not attached to those patterns by habit.

## Model to hold

Reuse subsystem contracts, not instructional prompts. Known process → encode it. Unknown process → reason about it. First-class products have predetermined pipelines (S89-D02). Obtaining missing author information is input acquisition, not workflow elicitation. Custom remains for a process the author specifies outside those pipelines. Model stages create or transform authoritative artefacts. Deterministic assembly transports and combines them without loss. A completed first-class output may be source material for another product; the receiver runs its own pipeline. Adding a product should increasingly look like adding a family member, not editing PRISM throughout. That sentence is not a licence for a plugin system or a registry.

## First task

Do not start coding. Start at Domain Packs and trace how the three real products — Interactive, Expository, and Assessment — actually move from product selection through a predetermined workflow, artefacts, assembly, preview, and publishing. Compare those pipelines, then reconcile with the Sprint 88 debt register. Only after that, test a hypothetical fourth sibling against what the real traces showed. Do not decide the fate of Domain Packs in advance. Only after the evidence should any consolidation be agreed.

## After this sprint, still out of scope now

[PB-FA-014](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-014--outcomes-map) Outcomes Map, [PB-FA-016](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-016--course-home--course-assembly) Course Home, and [PB-FA-015](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-015--additional-first-class-learning-resource-pipelines) (Scenario, Problem, guided practice / worked example, Situated Task). Not every educational job Outcomes Map names needs a new first-class product. Those directions are why consolidation happens now. They must not dictate speculative abstractions in this sprint.

## Assessment calibration

Not done, and not this sprint. See [Assessment Pack real-use calibration](../../../backlog/PRODUCT-BACKLOG.md#assessment-pack-real-use-calibration-sprint-88-remainder).

## Do not

- Investigate the codebase before reading the charter, plan, and debt pointers  
- Treat S88-AD items as bugs already authorised for removal  
- Implement Outcomes Map, Course Home, or a candidate product  
- Redesign working Interactive, Expository, or Assessment pedagogy
