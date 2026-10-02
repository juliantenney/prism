# Sprint 88 — Architectural debt ledger

**Sprint 88 is COMPLETE / CLOSED.** The findings below are unchanged and unresolved. Sprint 89 may investigate them; this file does not.

## Protected prior programme state

| Item | State |
| ---- | ----- |
| Alpha development | **Complete** |
| Sprint 82–87 | **CLOSED** |
| Sprint 88 | **COMPLETE / CLOSED** — findings below not resolved |
| First-class gate at alpha close | **339/339** |
| Interactive prompt family | **Protected baseline** ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)) |
| Production changes in Sprint 88 | **Not authorised** |
| Workshop redesign | **Not authorised** (S88-D03) |
| Design Assessment removal or repair | **Not authorised** (S88-D04) |

## Sprint 88 debt

| ID | Finding | Notes |
| -- | ------- | ----- |
| **S88-AD-001** | `keepDesignAssessmentStep` reads `assessmentBlueprintRequested` and `assessmentItemsRequested` before those `var` declarations are assigned, so the blueprint arm does not contribute | Record only. **Do not fix in Sprint 88** (S88-D04). Later Assessment investigation, not a behaviour-preservation patch |
| **S88-AD-002** | Expository sibling replacement inside `applyWorkflowDesignHeuristics` is still nested in the Sprint 27 topic-only guard | **New creates no longer use that path.** They instantiate the documented family locally. Saved source-Expository graphs are not rewritten |
| **S88-AD-003** | `ldCreateOutputType` is persisted and load-bearing although S75-D11 said Create-time only, with no later decision found that authorised persistence | Architecture plan §A replaces it with `product` / `variant` / `startingPoint`. Do not migrate stored graphs in this pass |
| **S88-AD-004** | Legacy workflow-generation complexity left behind by deterministic first-class creation | **Maintainability debt, not a product defect.** See below. Does **not** authorise a cleanup or refactor investigation |
| **S88-AD-005** | First-class product family extensibility | **Maintainability / extensibility debt, not a current product defect.** See below. Does **not** authorise a refactor, plugin, registry, or schema design |
| **S88-AD-006** | Reassess domain-pack responsibilities after deterministic first-class creation | **Architectural / maintainability debt, not a current product defect.** See below. Does **not** authorise a domain-pack refactor or speculative removal |

### S88-AD-004 — legacy generation complexity

Deterministic first-class creation no longer uses elicitation, factor extraction, or intent interpretation to choose a normal Learning Design product workflow. Much of the Learning Design domain-pack insertion, pruning, ordering, dependency, and product-predicate logic existed to correct or shape model-generated first-class workflows.

Some of that machinery remains legitimately required by Custom/Generated workflows, Research, or compatibility with saved graphs. This item records the leftover complexity. It does **not** authorise a cleanup or refactor investigation. Future work should simplify or remove a particular piece only when ordinary maintenance or product work shows that piece is redundant, and only with regression protection for the paths that still need it.

### S88-AD-005 — First-class product family extensibility

PRISM's first-class architecture is now demonstrably becoming a family of products rather than a small set of individually wired cases.

Interactive, Expository, and Assessment Pack now demonstrate a recurring architecture:

- a first-class product has explicit identity;
- it has canonical workflow topology;
- it can be created independently;
- a completed PRISM product output may be used as ordinary source material for another product;
- established upstream Learning Design stages can be reused;
- product-specific intellectual transformations can be introduced where needed;
- product parameters configure the known process rather than requiring AI to invent topology;
- publishing and rendering behaviour may differ by product where the product contract genuinely differs.

The implementation has evolved incrementally from earlier Interactive-first assumptions. Shared Create and workflow code may therefore still contain product-specific branching, UI wiring, parameter handling, topology selection, prompt construction, assembly, or publishing assumptions that make each new first-class product require unnecessary edits across shared code.

**Future maintenance objective.** Adding a first-class product should increasingly look like adding a member to a product family, not modifying PRISM throughout the codebase.

A clean extension boundary should eventually allow a product to define, as appropriate:

- product identity;
- supported starting points;
- product parameters;
- canonical stage family;
- product-specific stages and contracts;
- use of established shared stages;
- source and product-output behaviour;
- publishing and rendering behaviour.

This item does **not** prescribe a plugin architecture, registry, schema system, or any other implementation. It does **not** authorise a refactor of the current products. The appropriate abstraction should emerge from evidence supplied by future first-class product additions and by ordinary maintenance of Interactive, Expository, and Assessment Pack.

### S88-AD-006 — Reassess domain-pack responsibilities after deterministic first-class creation

Domain packs were substantially shaped around the earlier Create architecture, where elicitation and domain-specific interpretation helped PRISM determine what workflow or process should be generated.

Sprint 88 materially changes that responsibility for first-class products.

For normal first-class creation:

- the author explicitly chooses the product;
- PRISM already knows its canonical workflow family;
- supported variability is expressed through product parameters and starting points;
- AI is no longer required to infer first-class topology from elicitation.

This may leave parts of the current domain-pack architecture redundant or over-complex for first-class products.

Domain packs may still have legitimate responsibilities, including domain knowledge, terminology, prompt context, defaults, constraints, or support for Custom/Generated workflows. Do not assume the entire concept is obsolete.

**Future maintenance objective.** Reassess which domain-pack responsibilities remain necessary after the deterministic first-class architecture, and whether the implementation can be substantially simplified or stripped back.

In particular, distinguish:

- domain knowledge genuinely required while running a workflow;
- product configuration required while creating a known first-class product;
- elicitation and workflow-inference machinery retained only for cases where PRISM genuinely does not already know the process.

This item does **not** authorise a refactor of domain packs, or speculative removal of domain-pack behaviour. It does **not** call for a broad catalogue of potentially redundant code. Use normal maintenance, future product additions, and concrete evidence to determine what remains useful.

## Explicitly out of this open sprint

Implementing default workflows; specifying an Assessment product; modifying prompts, contracts, or `keepDesignAssessmentStep`; redesigning Workshop; a cleanup or refactor of S88-AD-004; a refactor, plugin, registry, or schema design for S88-AD-005; a domain-pack refactor or speculative removal under S88-AD-006; historical debt from closed sprints as automatic work.
