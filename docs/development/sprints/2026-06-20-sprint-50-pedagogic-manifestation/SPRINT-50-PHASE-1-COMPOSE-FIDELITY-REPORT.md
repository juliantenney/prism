# Sprint 50 Phase 1 — Compose Fidelity Report

**Status:** Complete  
**Scope:** Workstream 1 only — Design Page compose persistence  
**Out of scope:** Renderer changes, prompts, contracts, schemas, gates, ontology, generation logic  
**Evidence corpus:** Marx `marx-run-artefacts-run2/`

---

## Summary

Phase 1 closes the gap between **compose-time merge** (which already worked in isolation) and **authoritative `page.json` activity rows** saved from workflow capture. Merged Orient/Think framing fields — especially `activity_preamble` and `reasoning_orientation` — now persist when upstream DLA is available, including when upstream lives only in `workflowRunCapturedOutputsRaw`.

---

## Files changed

| File | Change |
| ---- | ------ |
| `app.js` | Upstream capture resolution (`readWorkflowRunCaptureTextForStepId`); raw-map fallback for DLA/GAM upstream; authoritative page capture persistence after compose; test API exports |
| `tests/sprint-50-phase-1-compose-fidelity.test.js` | Marx regression + raw-capture upstream + captured-page compose tests |
| `docs/development/sprints/2026-06-20-sprint-50-pedagogic-manifestation/SPRINT-50-PHASE-1-COMPOSE-FIDELITY-REPORT.md` | This report |

---

## Root cause

Two related persistence gaps:

### 1. Upstream resolution only read sanitized captures

`resolveUpstreamLearningActivitiesForPageStep` and `resolveUpstreamLearningActivitiesFromWorkflowCaptures` read **only** `state.workflowRunCapturedOutputs[sid]`, not `workflowRunCapturedOutputsRaw` or the DOM textarea.

When DLA existed in the raw map but not the sanitized map (or sanitized was empty/stale), compose ran with **no upstream**, `mergeLearnerPageActivityFramingFieldsIntoPageActivities` merged zero fields, and saved `page.json` activity rows lacked PEL/Think fields even though DLA contained them.

**Reproduced in test:** raw-only DLA capture → preamble merge **failed** before fix, **passes** after.

### 2. Composed page authority was conditional on string inequality

`syncWorkflowRunCapturedOutputToState` only wrote composed JSON back to authoritative capture maps when `pageComposeResult.json !== raw`. Pre-compose text was written to both maps first; if compose did not update (upstream miss), **unmerged LLM draft remained authoritative**.

Compose merge logic itself was correct (`repairLearnerPageCompositionFromUpstream`, `mergeLearnerPageActivityFramingFieldsIntoPageActivities`) — confirmed by existing Sprint 41 tests and Marx fixture merge when upstream is supplied.

---

## Implementation summary

### `readWorkflowRunCaptureTextForStepId(stepId)`

Unified capture read order:

1. `workflowRunCapturedOutputs[sid]` (sanitized)
2. `workflowRunCapturedOutputsRaw[sid]` (raw)
3. DOM `runStepOutput` textarea for that step

Used by:

- `resolveUpstreamLearningActivitiesForPageStep`
- `resolveUpstreamLearningActivitiesFromWorkflowCaptures`
- `resolveUpstreamWorkflowArtefactFromCaptures`
- `resolveUpstreamActivityMaterialsFromWorkflowCaptures`
- `resolveCaptureTextForWorkflowStep`

### Authoritative page capture persistence

In `syncWorkflowRunCapturedOutputToState`, when `applyPageCompositionValidationForCapturedPage` returns JSON:

- Always write composed JSON to `workflowRunCapturedOutputsRaw` and `workflowRunCapturedOutputs`
- Update textarea only when semantically different (`workflowRunCaptureJsonSemanticallyEquivalent`)

### Preserved Sprint 48–49 behaviour

- GAM materials merge path unchanged; GAM upstream resolution now also benefits from raw-map fallback
- `applyPedagogicCognitionSemanticsToComposedPage` logic untouched
- No prompt/contract/schema/gate changes
- Renderer untouched

---

## Before / after `page.json` examples

### Before (Marx run2 `page.json` activity A1 — authoritative artefact)

PEL/Think fields absent on activity row; task/materials present:

```json
{
  "activity_id": "A1",
  "title": "Historical Materialism and Capitalism",
  "duration_minutes": 10,
  "grouping": "individual",
  "learner_task": "1. Read the explanatory text on historical materialism.\n2. Study the worked example carefully...",
  "expected_output": "A short written explanation applying historical materialism to capitalism, revised using the checklist.",
  "support_note": "Avoid treating historical materialism as a claim that economics alone mechanically determines politics and culture.",
  "materials": { "text": "...", "worked_example": "...", "sample_output": "...", "checklist": "..." }
}
```

### After (same page through compose with upstream DLA)

Framing fields from `learning_activities.json` merged onto matching `activity_id`:

```json
{
  "activity_id": "A1",
  "title": "Historical Materialism and Capitalism",
  "activity_preamble": "This activity builds a foundation for the session by clarifying how Marx analyses capitalism as a historical and social system.",
  "reasoning_orientation": "Conceptual explanation using a structured analytical method.",
  "self_explanation_prompt": "Which step in the worked example clarified the method most for you?",
  "duration_minutes": 10,
  "grouping": "individual",
  "learner_task": "1. Read the explanatory text on historical materialism.\n2. Study the worked example carefully...",
  "expected_output": "A short written explanation applying historical materialism to capitalism, revised using the checklist.",
  "support_note": "Avoid treating historical materialism as a claim that economics alone mechanically determines politics and culture.",
  "materials": { "text": "...", "worked_example": "...", "sample_output": "...", "checklist": "..." }
}
```

All five Marx activities receive `activity_preamble` when upstream DLA has them.

---

## Test evidence

```text
node --test tests/sprint-50-phase-1-compose-fidelity.test.js \
  tests/workflow-learner-page-design-page-preservation.test.js \
  tests/page-49-6b-gam-material-preservation.test.js
```

| Result | Count |
| ------ | ----- |
| Pass   | 14    |
| Fail   | 0     |

New tests cover:

- Marx pre-compose anchor (fields missing)
- Direct compose merge (`activity_preamble`, `reasoning_orientation`, `self_explanation_prompt`)
- Raw-only DLA capture upstream resolution
- `applyPageCompositionValidationForCapturedPage` with binding upstream
- All Marx activity IDs receive upstream `activity_preamble`

Existing Sprint 41 preservation and Sprint 49-6b GAM tests remain green.

---

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Manual artefact export bypassing workflow sync still saves pre-merge draft | User must paste/sync through Design Page step (Next or input sync); utilities export path already runs compose validation |
| Semantic-equivalence textarea skip could hide formatting-only compose changes | Maps always receive composed JSON; textarea updates when content differs |
| Raw-map fallback could read stale raw if sanitized intentionally diverged | Sanitized map is still preferred first; raw is fallback only when sanitized is empty |

---

## Follow-up work (Phase 2 — renderer)

Per `SPRINT-50-INSTRUCTIONAL-MANIFESTATION-IMPLEMENTATION-SPEC.md`:

1. Emit activity sections in instructional function order (Orient → Think → Study → Do → Check → Reflect → Transfer)
2. Labelled learner-facing headings (`Why this activity`, `How to approach this`, etc.)
3. De-duplicate Compass / cognition / framing signals in HTML output
4. Re-validate Marx corpus end-to-end: composed `page.json` → rendered learner experience

Phase 1 makes those renderer changes **possible** by ensuring composed fields exist on authoritative activity rows.
