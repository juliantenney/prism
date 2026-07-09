# Architecture Summary — Sprint 58

## Pipeline

```
[Upstream — unchanged]
  Learning Outcomes → … → Episode Plan

[Episode Plan]
  Output: FULL v2 page shell
  Storage: runStepOutput for EP step
  Derive: PRISM may auto-fill shell from LO (deterministic)

[Post-EP — partial outputs]
  DLA              → partial page (activities[] instructional + assembly_state)
  GAM              → partial page (activities[].materials + assembly_state)
  Learning Seq     → partial page (learning_sequence + assembly_state)
  Design Page      → partial page (page_synthesis and/or sections + assembly_state)

[PRISM storage]
  Each paste → workflowRunCapturedOutputs[stepId]
  NOT injected into downstream Copy prompts

[Assembly — code only]
  assembleVNextPageFromWorkflowCaptures(wf)
  Order: EP → DLA → GAM → LS → DP
  Merge: activity_id, material_id

[Render]
  getPageForRender(assembledPage) → normalizePageForRender → HTML
```

## Partial artefact envelope

All post-EP outputs share:

```json
{
  "artifact_type": "page",
  "schema_version": "2.0.0",
  "assembly_state": {
    "current_stage": "<stage>",
    "enriched_by": ["<stage>"]
  }
}
```

Plus owned fields only.

## Prompt model

| Stage | Prompt receives from PRISM | Prompt receives from chat |
| ----- | -------------------------- | ------------------------- |
| Episode Plan | LO bindings (unchanged), deterministic shell embed | Prior steps |
| DLA | Workflow brief, partial contract | EP page shell |
| GAM | Workflow brief, partial contract | DLA activities context |
| Learning Sequence | Workflow brief, partial contract | GAM materials context |
| Design Page | Workflow brief, partial contract | Full instructional context |

## Storage vs prompt boundary

```
Copilot generates → User pastes → runStepOutput → state maps
                                        ↓
                              assembly (render only)
                                        ↓
                                   NOT → downstream prompts
```

## Code modules

| Module | Role |
| ------ | ---- |
| `lib/page-shell-create.js` | EP full shell (unchanged) |
| `lib/page-vnext-assemble.js` | **New** — deterministic merge |
| `lib/page-render-normalize.js` | Render adapter (unchanged) |
| `lib/ld-*-page-enrich-contract.js` | Partial output contracts (rewrite) |
| `app.js` | Gates, prompt assembly, capture sync, render wiring |

## Relationship to 56F

| 56F concept | Sprint 58 adjustment |
| ----------- | --------------------- |
| Single `page` artefact type | Retained |
| Stage ownership | Retained |
| Enrich in place (post-EP) | **Replaced** by partial emit + assembly |
| `page_synthesis` at DP/finalise | DP partial owns `page_synthesis` |
| `sections[]` | Legacy dual-read; optional in DP partial |

## Authoritative principle

> Post-Episode-Plan stages return partial v2 page artefacts containing only owned fields. PRISM stores those artefacts in stepOutput. Downstream prompts use chat context, not stored step outputs.
