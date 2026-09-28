# Sprint 88 — Architectural debt ledger

**Sprint 88 is OPEN.** Investigation 1 and Product Judgement Pass 1 are recorded. Opening decision: [S88-D01](decisions.md#s88-d01--open-sprint-88--default-product-workflows--assessment-architecture). Judgements: [S88-D03](decisions.md#s88-d03--workshop-remains-an-interactive-variant-for-current-sprint-88-scope) · [S88-D04](decisions.md#s88-d04--preserve-design-assessment-do-not-repair-it-in-sprint-88).

## Protected prior programme state

| Item | State |
| ---- | ----- |
| Alpha development | **Complete** |
| Sprint 82–87 | **CLOSED** |
| Sprint 88 | **OPEN** — judgement pass recorded; architecture not chosen |
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

### S88-AD-004 — legacy generation complexity

Deterministic first-class creation no longer uses elicitation, factor extraction, or intent interpretation to choose a normal Learning Design product workflow. Much of the Learning Design domain-pack insertion, pruning, ordering, dependency, and product-predicate logic existed to correct or shape model-generated first-class workflows.

Some of that machinery remains legitimately required by Custom/Generated workflows, Research, or compatibility with saved graphs. This item records the leftover complexity. It does **not** authorise a cleanup or refactor investigation. Future work should simplify or remove a particular piece only when ordinary maintenance or product work shows that piece is redundant, and only with regression protection for the paths that still need it.

## Explicitly out of this open sprint

Implementing default workflows; specifying an Assessment product; modifying prompts, contracts, or `keepDesignAssessmentStep`; redesigning Workshop; a cleanup or refactor of S88-AD-004; historical debt from closed sprints as automatic work.
