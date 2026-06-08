# 38S — Episode Plan → DLA workflow chaining fix

**Date:** 2026-06-08  
**Status:** **FIX**  
**Symptom:** DLA Copy prompt emits PF-11 (`missing episode_plans upstream`) even when the user completed Design Episode Plan in the prior workflow step.

---

## Normal user workflow (not Run Mode execution)

Prism does **not** execute workflows end-to-end. The user:

1. Opens workflow in **Run** mode (or copies step prompts individually).
2. **Copy** on Define Learning Outcomes → paste into Copilot → paste Copilot JSON into the step capture textarea.
3. **Copy** on Design Episode Plan → Copilot (or PRISM auto-derive in Run) → capture canonical `episode_plans` JSON.
4. **Copy** on Design Learning Activities → Copilot must receive upstream `episode_plans` in the prompt text.

The failure is in **prompt chaining**, not workflow execution.

---

## Exact chaining path

```
User clicks Copy on DLA step
  └─ copy button handler (app.js)
       ├─ backfillWorkflowStepCatalogMetadata(effectiveStep)
       ├─ syncAllWorkflowRunCapturesFromDomToState()   ← sync all prior textarea captures → state
       ├─ resolveEffectiveInputBindingsForPromptStep()  ← ensure DLA binds episode_plans from EP step
       └─ buildWorkflowStepInstructions(effectiveStep, index, li)
            ├─ syncAllWorkflowRunCapturesFromDomToState()
            ├─ resolveWorkflowForUpstreamArtefacts()   ← gathered DOM + metadata backfill
            ├─ [bindings embed] resolveCaptureTextForWorkflowStep(ep_step)
            │    └─ state.workflowRunCapturedOutputs[ep_step.id] OR dom [data-field=runStepOutput]
            ├─ resolveStepPromptText(step, wf)
            │    └─ applyWorkflowStepRuntimePromptAugmentations()
            │         └─ applyEpisodePlanDlaPopulationPromptBlockToDraft()
            │              ├─ resolveEpisodePlansForDlaPopulation()
            │              │    └─ resolveUpstreamWorkflowArtefactFromCaptures("episode_plans")
            │              └─ buildEpisodePlanUpstreamPromptSection() → ### Upstream episode_plans
            └─ clipboard text = instructions + embedded upstream JSON + augmented DLA prompt
```

### Storage

| Item | Location | Key |
|------|----------|-----|
| Step capture (session) | `state.workflowRunCapturedOutputs` | `step.id` (e.g. `ep_step`) |
| Raw capture (unsanitized) | `state.workflowRunCapturedOutputsRaw` | `step.id` |
| DOM source | `[data-field="runStepOutput"]` textarea per step `<li>` | synced on input / Copy / syncAll |

Episode Plan output is **not** persisted into the saved workflow record; it lives in session capture until the user saves or clears the session.

---

## Root cause

**Composite — prompt builder could not see prior step output:**

| # | Cause | Detail |
|---|--------|--------|
| **A** | Capture not in state at Copy time | Textarea held valid JSON but `syncAllWorkflowRunCapturesFromDomToState()` was not called before DLA prompt build. |
| **B** | Strict binding match blocked embed | `buildWorkflowStepInstructions` required `prod.outputName === artifactName`; heuristic EP steps often had empty `outputName`. |
| **C** | Missing DLA input binding | DLA step lacked explicit `inputBindings` for `episode_plans` when heuristics inserted Design Episode Plan. |
| **D** | Captures cleared on Edit mode | Leaving Run mode previously wiped `workflowRunCapturedOutputs`, losing EP output before DLA Copy. |

**PF-11 emit site:** `buildEpisodePlanUpstreamPromptSection({ requireUpstream: true })` when `resolveEpisodePlansForDlaPopulation()` returns null despite a Design Episode Plan step in the workflow.

---

## Fix (smallest targeted)

| Function | Change |
|----------|--------|
| `syncAllWorkflowRunCapturesFromDomToState` | Called at start of `buildWorkflowStepInstructions` and DLA Copy handler |
| `resolveWorkflowForUpstreamArtefacts` | Uses gathered DOM workflow in Run mode + metadata backfill |
| `resolveUpstreamWorkflowArtefactFromCaptures` | DOM textarea fallback; `workflowStepProducesArtefact` identity match |
| `ensureDlaEpisodePlanInputBindingsForSteps` | Auto-adds DLA ← EP `episode_plans` binding; called in heuristics, `normalizeWorkflowForV1`, prompt resolution |
| `bindingArtifactMatchesProducer` | Fuzzy artefact match (title/canonical identity, not only `outputName`) |
| `resolveCaptureTextForWorkflowStep` | State + DOM capture resolution |
| `buildWorkflowStepInstructions` | Uses chaining helpers for upstream embed |
| `setWorkflowMode` | **No longer clears** `workflowRunCapturedOutputs` when leaving Run mode |

**Not changed:** Episode Plan V1 schema, `deriveEpisodePlansFromLearningOutcomes`, FunctionEnum, population contract, IFP blocks, LO-only fallback gate semantics.

---

## Tests added

`tests/workflow-ld-episode-plan-step.test.js`:

- `buildWorkflowStepInstructions chains episode_plans capture into DLA copy text` — EP with empty `outputName`, capture in state → DLA Copy includes binding embed + `### Upstream episode_plans`, no PF-11.

Existing suite (21 tests across episode-plan + step-marker) still passes.

---

## Manual verification

1. Open an LD activity workflow with LO → Design Episode Plan → DLA (Run mode).
2. Paste LO JSON into Define Learning Outcomes capture; confirm valid.
3. On Design Episode Plan: either let PRISM auto-derive or paste canonical `episode_plans` JSON into capture.
4. Click **Copy** on Design Learning Activities (do **not** re-run Episode Plan).
5. Paste clipboard into a text editor and confirm:
   - `Upstream artefact "episode_plans"` block with full JSON body
   - `### Upstream episode_plans (authoritative — populate only…)` in core prompt section
   - **No** `PF-11: missing episode_plans upstream`
6. Run prompt in Copilot → expect valid `learning_activities` JSON (not PF-11 error object).

**DevTools:** If PF-11 still fires, filter console for `[PRISM PF-11 DLA upstream trace]` and check `capture_state_exists` / `capture_dom_exists` on the Episode Plan row.

---

## Acceptance mapping

| Criterion | Status |
|-----------|--------|
| EP output stored as `episode_plans` (keyed by `step.id`) | PASS |
| DLA prompt shows upstream `episode_plans` JSON | PASS |
| PF-11 does not fire when valid plans exist | PASS |
| No LO-only replanning fallback restored | PASS |
| Tests green | PASS |
