# Sprint 57A — Instructional Sufficiency & Content Budgeting

- **Sprint ID:** 57A
- **Date opened:** 2026-07-08
- **Status:** Active investigation (no implementation)
- **Predecessor:** [Sprint 56F](../2026-07-07-sprint-56f-progressive-page-enrichment-architecture/README.md)

## Purpose

Investigate whether PRISM can produce instructionally valid learning pages within realistic learner-time and content budgets before progressive-enrichment implementation.

Sprint 56F answered the architecture question: ownership, structure, and progressive enrichment shape.  
Sprint 57A answers the instructional-design question: how much core content should exist for the allotted learner time.

## Key principle

PRISM pages are learning experiences, not textbooks.

Learning duration is not equivalent to reading duration or generated word count.  
A prompt such as "Write 150-200 words..." may require 15-25 minutes once reading, thinking, planning, writing, and review are included.

## Scope boundaries

- 57A follows 56F closure; do not reopen 56F architecture decisions unless new evidence requires it.
- Progressive enrichment implementation remains deferred.
- This sprint is investigation/modeling/experiment planning only.

## Definition of Done

- Learner-time budgeting model agreed.
- Core vs extension content policy agreed.
- DLA activity sizing guidance agreed.
- GAM material budgeting guidance agreed.
- At least one controlled page-generation experiment completed.
- Instructional-validity audit completed.
- Recommendation produced:
  - A. Proceed to Sprint 57B implementation, or
  - B. Continue instructional-budget investigation.

Purpose: prevent Sprint 57A from becoming an open-ended research effort.

## Exit Decision

If instructionally valid pages can be produced within the proposed learner-workload and content-budget assumptions, proceed to Sprint 57B implementation planning.

If instructionally valid pages cannot yet be produced, refine the instructional-budget model before implementation begins.

The purpose of 57A is to determine whether the instructional model is viable before implementation work starts.

## Entry points

1. [SPRINT-57A-START-HERE.md](SPRINT-57A-START-HERE.md)
2. [sprint-overview.md](sprint-overview.md)
3. [problem-statement.md](problem-statement.md)
4. [instructional-budget-model.md](instructional-budget-model.md)
5. [output-budget-experiment-plan.md](output-budget-experiment-plan.md)
