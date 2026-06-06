# 38N-2 — Render ordering hardening

**Date:** 2026-06-05  
**Status:** **COMPLETE**  
**Residual:** R2 (from [38M-6](../../2026-06-05-sprint-38m-page-composition-fidelity/observations/38M-6-sprint-closure.md))  
**Type:** Code + tests

---

## Problem

On `EV-38M-AFTER`, A3 page JSON had correct `materials_order` but rendered HTML showed **checklist before worked analytic pass**. Root cause: post-merge **alias keys** (`worked_example`, `scenarios`, `evaluation_checklist`, `verification_checklist`) triggered renderer **legacy early paths** after the declared-order loop, re-emitting materials out of sequence.

Secondary harness bug: `findActivityTitles()` read `section.rows` instead of `section.content`, causing A3 HTML extraction to span the full page and mask true ordering in proof logs.

---

## Design

### Authoritative ordering path

When `activityRow.materials_order` is declared:

1. Render declared keys first via `renderOrderedMaterialKeyBlock`.
2. Call `markMaterialAliasGroupRendered(markOrderedMaterialRendered, orderKey)` for each successful block.
3. Suppress legacy paths for consumed alias groups.

### Alias groups (`lib/page-a3-materials-sequencing.js`)

```text
worked_analytic_pass  → worked_example
analysis_table        → worksheet, classification_table, impact_table, comparison_table, table
scenario_maya_households → scenario, scenarios
checklist             → checklist_evaluate, verification_checklist, evaluation_checklist
```

---

## Implementation (`app.js`)

| Change | Effect |
|--------|--------|
| Alias marking after ordered render | Marks all group members consumed |
| `!scenariosRendered` guard on scenarios early path | Prevents duplicate scenario blocks |
| `!checklistRendered` on checklist + evaluation_checklist paths | Skips duplicate checklists |
| `Object.keys` fallback skips | When `declaredMaterialOrder` set, skip checklist/scenario/worksheet/worked_example alias keys already consumed |

---

## Harness fix

`findActivityTitles()` in `ev-38m-inflation-pipeline-capture-once.mjs` now reads `section.content` (aligned with `findLearningActivitiesRows`).

---

## Verification

| Check | Result |
|-------|--------|
| `validateA3RenderMaterialOrder` on `EV-38M-AFTER` re-render | **PASS** |
| Positions: worked → worksheet → scenario → checklist | **PASS** |
| `tests/page-38n-fidelity-hardening.test.js` R2 test | **PASS** |
| 38M A3 sequencing suite | **6/6 pass** (no regression) |
