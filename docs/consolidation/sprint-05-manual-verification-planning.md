# Sprint 05 - Manual Verification Planning (Post-Sprint 04)

## Purpose

Define a bounded consolidation sprint that verifies workflow definition/runtime boundaries after Sprint 04, before any further implementation changes.

The immediate objective is confidence and continuity: confirm that clarified ownership boundaries, warning lifecycles, and compatibility paths behave as expected in real browser usage.

## Scope

- run a manual browser smoke pass focused on workflow definition and runtime boundary behavior
- verify warning-only validation behavior remains non-blocking in create/edit/save/import flows
- verify prompt attachment compatibility across:
  - library prompt-linked steps
  - local override steps
  - none/empty prompt steps
- verify import/export workflow bundle compatibility remains stable
- document findings, regressions (if any), and pass/fail status in continuity notes
- prepare a decision note for next bounded consolidation step based on smoke outcomes

## Non-Goals

- no new implementation changes before smoke checks complete
- no schema changes or migration work
- no runtime execution redesign
- no import/export contract redesign
- no workflow generation redesign
- no domain-pack redesign
- no app modularization/restructure sprint in this phase

## Manual Smoke Checklist

Environment:
- open `index.html` in local browser with latest source loaded
- start from a clean baseline (or known deterministic baseline) and keep notes per step

Checks:
1. **Load and select**
   - load app
   - open Workflows tab
   - select existing workflow(s)
   - confirm editor renders and warning panel behavior is stable
2. **Create/edit/save**
   - create a new workflow
   - edit name/artefacts/outputs/step metadata
   - save successfully
   - confirm save remains non-blocking even with warnings
3. **Prompt attachment modes**
   - add or edit one step as `library_prompt` (linked prompt selected)
   - add or edit one step as `local_override`
   - add or edit one step with no prompt source (`none`/empty)
   - save and reload workflow; confirm modes persist compatibly
4. **Validation lifecycle**
   - trigger expected warning states (missing prompt, invalid internal binding, missing outputName on source step)
   - confirm warnings surface in UI
   - confirm warnings do not block save/import behavior
5. **Import/export bundle**
   - export selected workflow bundle
   - import exported bundle
   - verify workflow remains selectable/editable/runnable with expected warning behavior
6. **Run-mode boundary sanity**
   - enter run mode and step through navigation
   - confirm runtime navigation still respects prior behavior
   - confirm no unintended mutation of definition-only fields during run navigation

Evidence capture:
- record pass/fail per checklist item
- capture brief repro notes for failures
- list whether issue is regression vs existing known behavior

## Likely Follow-On Options

Option A - **No regressions found (recommended path)**
- close Sprint 05 as verification-only
- proceed to a small documentation debt pass (validation/ownership glossary alignment)
- then choose next bounded consolidation target

Option B - **Minor regressions found**
- run a narrow bug-fix micro-pass (regression-only, behavior restoration)
- re-run only affected smoke slices
- update continuity/check-in docs

Option C - **Boundary ambiguity persists but behavior is stable**
- run a comments/docs-only clarification pass
- defer structural changes to an explicitly scoped future sprint

Option D - **Larger conceptual redesign pressure appears**
- explicitly open a new planning sprint first
- choose redesign track deliberately (not inside this verification sprint)

## Recommended First Task

Execute the manual smoke checklist end-to-end and produce a single verification report with:
- pass/fail matrix
- any regression candidates with repro steps
- recommendation: close verification sprint vs run targeted regression micro-pass

No implementation should begin until this report is complete and reviewed.
