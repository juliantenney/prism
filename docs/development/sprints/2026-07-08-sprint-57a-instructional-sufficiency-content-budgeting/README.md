# Sprint 57A — Instructional Sufficiency & Content Budgeting

## Closure status (2026-07-09)

- Sprint 57A is **closed**.
- Type: investigation only — no production implementation.
- Outcome: instructional budgeting models agreed; end-to-end testing showed full-page enrich-in-place is not viable.
- Successor: [Sprint 58 — Partial Page Artefact Architecture Implementation](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/README.md)

> Do not add new investigation scope to 57A except typo/link maintenance.

- **Sprint ID:** 57A
- **Date opened:** 2026-07-08
- **Date closed:** 2026-07-09
- **Status:** Closed (investigation complete)
- **Predecessor:** [Sprint 56F](../2026-07-07-sprint-56f-progressive-page-enrichment-architecture/README.md)
- **Successor:** [Sprint 58](../2026-07-09-sprint-58-partial-page-artefact-architecture-implementation/README.md)

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

## Exit decision (final)

Proceed to **Sprint 58** with the **partial page artefact architecture** — not full-page progressive enrichment.

Instructional budgeting heuristics from 57A are retained as reference. Implementation is unblocked; the binding constraint is LLM full-page preservation failure, not unresolved budget theory.

Closure report: [SPRINT-57A-CLOSURE-REPORT.md](SPRINT-57A-CLOSURE-REPORT.md)

## Entry points

1. [SPRINT-57A-START-HERE.md](SPRINT-57A-START-HERE.md)
2. [sprint-overview.md](sprint-overview.md)
3. [problem-statement.md](problem-statement.md)
4. [instructional-budget-model.md](instructional-budget-model.md)
5. [output-budget-experiment-plan.md](output-budget-experiment-plan.md)
