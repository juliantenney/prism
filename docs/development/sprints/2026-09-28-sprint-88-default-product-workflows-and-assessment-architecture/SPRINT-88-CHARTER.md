# Sprint 88 — Charter

**Sprint:** 88 — Default Product Workflows & Assessment Architecture  
**Status:** **OPEN / investigation beginning** (opened 2026-09-28)  
**Type:** Investigation — not implementation  
**Predecessor:** Sprint 87 — COMPLETE / CLOSED ([S87-D14](../2026-09-22-sprint-87-expository-quality-first-successor-implementation/decisions.md#s87-d14--close-sprint-87--expository-quality--first-successor-implementation))  
**Backlog item:** none assigned at open  
**Start here:** [SPRINT-88-START-HERE.md](SPRINT-88-START-HERE.md)  
**Opening decision:** [S88-D01](decisions.md#s88-d01--open-sprint-88--default-product-workflows--assessment-architecture)

---

## Mission

Investigate two related architectural questions. Do **not** turn the working hypotheses below into settled architectural decisions.

This is an investigation sprint. It is **not** an implementation sprint.

---

## Working questions (not decided)

### Question 1 — Default product workflows

Whether PRISM's first-class products should have canonical/default workflow shapes that can be instantiated locally without mandatory model-driven elicitation, while retaining elicitation/generated workflow creation as an advanced capability.

**Not decided.** Canonical or default workflows are **not** approved by opening this sprint.

### Question 2 — Assessment architecture

PRISM's existing assessment architecture and history, including Design Assessment, Generate Assessment Items, learner-evidence concepts, and their relationship to current Interactive formative assessment and a possible future first-class Assessment product.

**Not decided.** Opening this sprint does **not** specify Assessment product architecture.

---

## Scope (in) — investigation posture only

- Establish and maintain this sprint pack and the opening decision.  
- Investigate the two questions above **before** any implementation.  
- When a later, explicit task breakdown is accepted, record findings, evidence, and recommendations without converting them into production changes.  
- Keep hypotheses and open questions visibly distinct from decisions.

**Detailed task plan:** not authorised by this charter. This charter does **not** assign task IDs or an implementation scope.

---

## Non-goals (binding at open)

Sprint 88 does **not** authorise:

- production code changes;
- prompt, contract, or schema changes;
- Create UI or workflow-instantiation changes;
- renderer or learner-page changes;
- treating canonical/default workflows as approved;
- specifying a first-class Assessment product, its topology, stages, or contracts;
- rewriting Interactive formative assessment;
- reopening closed sprints or treating historical debt as automatic work.

---

## Intended programme sequence (intentions, not commitments)

```text
1. Sprint 88 — Default Product Workflows & Assessment Architecture   ← OPEN (investigation)
2. later planning, only if investigation warrants it                 (intention)
3. implementation                                                    (not authorised)
```

Later planning or implementation sprints are **intentions**. They do not commit to default workflows, an Assessment product, or any particular architecture.

---

## Settled programme inputs (do not reopen casually)

| Input | Authority |
| ----- | --------- |
| Alpha development complete | [S82-D04](../2026-09-01-sprint-82-maths-entry-and-alpha-completion/decisions.md#s82-d04--alpha-development-complete) |
| First-class gate at alpha close | `npm run test:first-class` → **339/339** |
| Sprint 82–87 | **CLOSED** |
| Sprint 87 | **COMPLETE / CLOSED** |
| Canonical post-alpha backlog | [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) |
| Interactive prompt family | Protected baseline ([S83-D04](../2026-09-21-sprint-83-expository-resource-investigation/decisions.md#s83-d04--planning-handoff--sibling-prompt-family--protected-baseline)) — not a Sprint 88 decision |

---

## Expected evidence (when investigation proceeds)

Evidence is **not yet defined as a task list**. When investigation proceeds, it should typically include: findings on current workflow creation and instantiation; findings on existing assessment stages, learner evidence, and Interactive formative assessment; explicit non-claims; and a recommendation on whether any later planning sprint is warranted.

Exact evidence criteria belong in a later accepted task breakdown, not invented here.

---

## Exit posture (high level)

Sprint 88 may close when the investigation questions have recorded findings and a clear recommendation exists for whether any further planning is warranted — **without** having implemented default workflows or an Assessment product.
