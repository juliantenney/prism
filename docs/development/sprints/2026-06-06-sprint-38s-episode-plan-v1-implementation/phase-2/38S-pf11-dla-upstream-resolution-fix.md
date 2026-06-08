# 38S — PF-11 DLA upstream resolution fix

**Date:** 2026-06-08  
**Status:** **FIX + INSTRUMENTATION**  
**Symptom:** DLA emits `{ "error": "PF-11: missing episode_plans upstream" }` despite visible canonical Episode Plan capture.

---

## Root cause (live path)

| Failure mode | Verdict | Evidence |
|--------------|---------|----------|
| **A. Capture not synced** | **Primary** | `resolveEpisodePlansForDlaPopulation` read only `state.workflowRunCapturedOutputs`. Textarea content on Episode Plan step is visible but not synced until `input` or **Next** on that step. DLA **Copy** did not sync prior steps. |
| **B. Metadata not backfilled on live objects** | **Secondary** | Copy path built `effectiveStep` from DOM without `backfillWorkflowStepCatalogMetadata`. Heuristic-inserted steps often had empty `outputName` in persisted `state.workflows`. |
| **C. Resolver used different step objects** | **Confirmed** | `resolveUpstreamWorkflowArtefactFromCaptures` always used `findWorkflowById()` and ignored gathered DOM workflow / `options.workflow`. |
| **D. Title/id mismatch** | Unlikely after 2A identity fallback | `workflowStepProducesArtefact` matches by title when `outputName` empty. |
| **E. DLA prompt bypassed resolver** | No | PF-11 emitted only from `applyEpisodePlanDlaPopulationPromptBlockToDraft` → `resolveEpisodePlansForDlaPopulation`. |
| **F. Pack policy/catalog mismatch** | Contributed to B | Missing §11 Design Episode Plan pattern (restored in 2A); policy `produces` not applied at Copy time without backfill. |

**Not the cause:** LO-only fallback removal, V1 validation on valid JSON, Episode Plan derive.

---

## Instrumentation

On PF-11 emit, PRISM now logs:

```text
[PRISM PF-11 DLA upstream trace]
```

Stored at `state.workflowRunPf11DiagnosticTrace`.

Trace includes:

1. DLA step (id, title, outputName, canonical_step_id)
2. All prior steps in run order with capture state/dom lengths, previews, `workflowStepProducesArtefact_episode_plans`, backfill delta
3. `resolveUpstreamWorkflowArtefactFromCaptures` + `resolveEpisodePlansForDlaPopulation` results with `reason`
4. Capture key index (`Object.keys(workflowRunCapturedOutputs)`)

**How to read in browser:** Open DevTools → Console → Copy DLA step → filter `PF-11 DLA upstream trace`.

Test API: `getWorkflowRunPf11DiagnosticTraceForTest()` after `emitPf11DlaUpstreamDiagnosticTrace`.

---

## Fix (smallest targeted)

| Change | File |
|--------|------|
| `syncAllWorkflowRunCapturesFromDomToState()` before DLA prompt resolution | `app.js` |
| `resolveWorkflowForUpstreamArtefacts()` — gathered DOM workflow + backfill | `app.js` |
| DOM textarea fallback when state capture empty | `resolveUpstreamWorkflowArtefactFromCaptures` |
| `buildWorkflowStepRowFromRunLi()` when persisted step row missing at sync | `syncWorkflowRunCapturedOutputToState` |
| Sync all captures before Run-mode Copy | copy button handler |
| PF-11 diagnostic emit on missing upstream | `applyEpisodePlanDlaPopulationPromptBlockToDraft` |

**Not changed:** Episode Plan V1, derive, population contract, IFP blocks, LO-only fallback gate.

---

## Expected trace after fix (success)

```json
{
  "resolver": {
    "resolveEpisodePlansForDlaPopulation": {
      "reason": "ok",
      "episodePlans": { "episode_plans": [ "..."] }
    }
  }
}
```

Prior Episode Plan row should show `capture_state_exists: true` OR `capture_dom_exists: true` with non-zero length.

---

## Verification

```text
21/21  workflow-ld-episode-plan-step + integration
PASS   ev-38s-production-pipeline-chase
```

Manual: KM → LO → Episode Plan (paste/auto-fill) → **Next** or edit blur → DLA Copy. Console should show no PF-11 block; upstream JSON section present in prompt.
