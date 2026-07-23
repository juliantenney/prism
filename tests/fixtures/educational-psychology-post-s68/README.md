# Educational Psychology — post–Sprint 68 regression fixture

**Captured:** 2026-07-23 from Edge `localStorage` (`http://localhost`)  
**Workflow id:** `440910f0-041b-4f00-a32b-83345e732307`  
**Name:** Educational Psychology

## Purpose

Unmodified failing producer artefacts used to prove:

1. Illegal beat vocabulary (`consolidation`, `comparison`, `worked_example`, `application` as beat functions) entered at **Design Episode Plan capture**.
2. Downstream DLA/GAM/Design Page partials did **not** introduce those beats.
3. After Fix B (FunctionEnum enforcement + derive fallback) + Fix A (merge preservation) + last-resort V1 registry variants, assembled pages reach learner-renderer-vNext page-model construction.

## Files

| File | Stage |
| ---- | ----- |
| `workflow.json` | Workflow definition |
| `runstate.json` | Run captures |
| `design-episode-plan.json` | **Failing** EP shell (illegal beats) |
| `design-learning-activities.json` | DLA partial (no `episode_plan` overwrite) |
| `generate-activity-materials.json` | GAM partial |
| `construct-learning-sequence.json` | LS partial |
| `design-page.json` | Design Page synthesis partial |

Do not hand-edit stage JSON to “fix” beats. Tests repair via canonical derive + assembly.
