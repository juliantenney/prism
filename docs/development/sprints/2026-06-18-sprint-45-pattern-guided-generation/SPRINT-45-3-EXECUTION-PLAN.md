# Sprint 45.3 Execution Plan

**Date:** 2026-06-17  
**Type:** Execution plan (design-package, pre-execution)  
**Status:** Planned, not started  
**Purpose:** Define phased execution path for Sprint 45.3 without performing scoring or analysis  
**Plan authority:** `SPRINT-45-3-CHARTER.md` · `SPRINT-45-3-REGRESSION-EVALUATION-DESIGN.md` · `SPRINT-45-2-EXECUTION-STATUS.md` · `45-2-recommendation-i5-closure-addendum.md`

**Non-goals:** Start execution, compute results, set thresholds, expand scope.

---

## Objective

Execute a governed comparative study workflow that:

1. Locks authorised inputs (45.1 cohort + frozen target-type corpus segment),
2. Collects body/pair/segment/distribution evidence structures,
3. Produces recommendation-ready outputs (Proceed / Repeat / Stop).

---

## Phase Structure

```text
Phase 0: Preconditions and dependency lock
    ↓
Phase 1: Input register and scope lock
    ↓
Phase 2: Body-level and pair-level evidence population
    ↓
Phase 3: Segment and distribution evidence population
    ↓
Phase 4: Cross-domain and non-target regression sections
    ↓
Phase 5: Recommendation synthesis and completion review
```

---

## Inputs

Mandatory inputs (read-only):

- Sprint 45.1 completed cohort artefacts and workbook references.
- Sprint 44 frozen benchmark corpus target-type segment (`decision_table`, `transfer_prompt`) for Marx + Photosynthesis.
- Sprint 45.2 closure artefacts including I5 closure addendum/report.
- 45.3 design artefacts:
  - `SPRINT-45-3-CHARTER.md`
  - `SPRINT-45-3-REGRESSION-EVALUATION-DESIGN.md`
  - `45-3-evidence-workbook.md` (template/work surface)

---

## Outputs

Phase outputs:

- Input/artefact register entries in workbook.
- Body-level and pair-level sections complete.
- Segment-level and distribution tables complete.
- Cross-domain and non-target sections complete.
- `45-3-recommendation.md` completed with route template.
- `SPRINT-45-3-EXECUTION-STATUS.md` updated to post-execution state (when actually run).

---

## Phase Gates

### Gate G0 — Dependency lock

Must confirm before Phase 1:

- 45.2 closure reference present.
- D1-D3 frozen decisions recorded.
- No unresolved scope override requests.

### Gate G1 — Scope lock

Must confirm before Phase 2:

- Generation set fixed to 45.1 cohort.
- Frozen reference scope fixed to target-type segment only.
- Non-target definition fixed to D3 type-level interpretation.

### Gate G2 — Body/pair completeness

Must confirm before Phase 3:

- All required body-level entries populated.
- All six pair sections populated.

### Gate G3 — Segment/distribution completeness

Must confirm before Phase 4:

- Segment-level tables populated for both domains and both target types.
- Distribution tables structurally complete.

### Gate G4 — Regression-section completeness

Must confirm before Phase 5:

- Cross-domain comparison section complete.
- Non-target regression section complete with evidence-status flags.

### Gate G5 — Recommendation readiness

Must confirm before completion:

- Evidence summary completed.
- Open issues recorded.
- Exactly one route selected (Proceed / Repeat / Stop) at recommendation time.

---

## Required Evidence by Phase

| Phase | Required evidence |
| ----- | ----------------- |
| 0 | Dependency lock checklist and 45.2 closure references |
| 1 | Cohort register + frozen reference register + scope lock entries |
| 2 | Body-level records + pair-level records |
| 3 | Segment-level + distribution tables |
| 4 | Cross-domain table + non-target regression section |
| 5 | Recommendation summary + route + open issues |

---

## Completion Criteria

Sprint 45.3 execution plan completion (design-package level) requires:

1. All phases defined with clear inputs/outputs/gates.
2. Required evidence mapped by phase.
3. No execution or scoring embedded in plan text.
4. Full consistency with frozen D1-D3 decisions.
5. Route-ready recommendation dependency defined.

Execution completion (future run-time) is out of scope for this document and must be reflected in status tracker when run.

---

## Constraints Lock

- No new generation run in baseline 45.3 execution.
- No new pattern families.
- No new material-type scope.
- No new datasets.
- No thresholds introduced.
- No analysis results included in plan.

---

## Plan Readiness

This execution plan is ready to govern Sprint 45.3 execution activity once explicit run authorisation is issued and status tracker moves from pre-execution to active state.

