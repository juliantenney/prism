# Hotfix — assessment step assembly regression

**Date:** 2026-05-21

## Root cause

Workflow assembly (`applyWorkflowDesignHeuristics`) treated assessment need as **goal-text regex only** (`assessmentItemsRequested` via `hasIntent`), while brief resolution correctly set `assessment_required`, `assessment_total_items`, and related factors from phrases like “10 formative assessment questions”.

A second layer removed assessment steps: domain **trigger rules** for `session_materials: ["page"]` **exclude** `Generate Assessment Items` and `Design Feedback`. Those excludes ran even when the resolved brief required assessment, so Marx-style self-study page chains dropped assessment after inclusion.

## Why planner drift occurred

- **Two paths:** `resolveWorkflowBriefFactors` (resolution) vs `applyWorkflowDesignHeuristics` (assembly) — assembly did not read resolved assessment flags.
- **Pack policy vs brief:** page-delivery defaults were written to keep lean page-only chains; they were not gated on `assessment_required`.
- **Pruning guard was too narrow:** assessment prerequisite protection only ran for `generate_from_topic` starting artefact, not all assessment-required briefs.

Recent self-directed scaffold work did **not** change these gates; the regression is longstanding resolution/assembly drift exposed by Marx self-study (assessment in resolution, page delivery, no assessment keywords in goal).

## Fix (bounded to assembly)

1. `briefResolvedAssessmentRequired` — `assessmentItemsRequested` when `assessment_required === true` or `assessment_total_items > 0`.
2. Skip page-pattern **exclude** of `Generate Assessment Items` when assessment is requested; preserve `Design Feedback` exclude unless feedback semantics require it.
3. Post-trigger **re-inject** `Generate Assessment Items` if still missing.
4. Protect assessment prerequisite closure for all `assessmentItemsRequested` briefs (not only topic-start).

## Tests

`tests/workflow-assessment-step-assembly.test.js`

## Remaining risks

- **Design Feedback** still only appears when feedback semantics / explicit brief request — not auto-added for every formative page.
- **Design Assessment** may still be pruned when lean formative intent applies; item generation step is the hard requirement.
